'use server';

import { prisma } from '@/lib/prisma';
import { 
    erpTransactionSchema, 
    ErpTransactionInput, 
    ErpJournalEntryInput 
} from '@/lib/validations/erp';
import { revalidatePath } from 'next/cache';

/**
 * CORE FINANCIAL ENGINE: Balanced Ledger Transaction
 * 
 * Enforces Double-Entry rules:
 * 1. Sum(Debits) must equal Sum(Credits).
 * 2. Atomic updates to both Transaction history and Account balances.
 */
export async function createLedgerTransaction(data: {
    transaction: ErpTransactionInput,
    entries: Omit<ErpJournalEntryInput, 'transactionId'>[]
}) {
    // 1. Validate Input Metadata
    const validatedTx = erpTransactionSchema.parse(data.transaction);
    
    // 2. Validate Balancing Logic
    let totalDebit = 0;
    let totalCredit = 0;
    
    for (const entry of data.entries) {
        if (entry.type === 'DEBIT') {
            totalDebit += entry.amount;
        } else {
            totalCredit += entry.amount;
        }
    }
    
    // Allow for minor precision differences if any, but ideally exact
    if (Math.abs(totalDebit - totalCredit) > 0.001) {
        return { 
            success: false, 
            error: `Imbalanced Transaction: Debits (${totalDebit.toFixed(2)}) must equal Credits (${totalCredit.toFixed(2)}).` 
        };
    }

    try {
        const result = await prisma.$transaction(async (tx) => {
            // 3. Create the Transaction Parent
            const newTx = await tx.erpTransaction.create({
                data: validatedTx
            });

            // 4. Process all Entries
            for (const entry of data.entries) {
                // a. Save Journal Entry
                await tx.erpJournalEntry.create({
                    data: {
                        amount: entry.amount,
                        type: entry.type,
                        accountId: entry.accountId,
                        transactionId: newTx.id
                    }
                });

                // b. Load Account to determine balance logic
                const account = await tx.erpAccount.findUniqueOrThrow({
                    where: { id: entry.accountId }
                });

                // Accounting logic:
                // Assets (1xxx) & Expenses (5xxx) increase with DEBIT
                // Revenue (4xxx), Liabilities (2xxx), Equity (3xxx) increase with CREDIT
                const isDebitIncrease = account.code.startsWith('1') || account.code.startsWith('5');
                
                let balanceChange = entry.amount;
                if (isDebitIncrease) {
                    if (entry.type === 'CREDIT') balanceChange = -entry.amount;
                } else {
                    if (entry.type === 'DEBIT') balanceChange = -entry.amount;
                }

                // c. Update Account Balance atomically
                await tx.erpAccount.update({
                    where: { id: account.id },
                    data: {
                        balance: { increment: balanceChange }
                    }
                });
            }

            return { success: true, transactionId: newTx.id };
        });

        revalidatePath('/admin/erp/finance');
        return result;
    } catch (_error) {
        console.error('Ledger Transaction Failed:', _error);
        return { success: false, error: 'Database transaction failed. The books remain balanced.' };
    }
}

export async function getAccountBalances() {
    return await prisma.erpAccount.findMany({
        orderBy: { code: 'asc' }
    });
}

export async function getRecentTransactions(limit = 15) {
    return await prisma.erpTransaction.findMany({
        where: { status: 'VERIFIED' },
        take: limit,
        orderBy: { date: 'desc' },
        include: {
            journalEntries: {
                include: {
                    account: true
                }
            }
        }
    });
}

export async function getPendingTransactions() {
    return await prisma.erpTransaction.findMany({
        where: { status: 'PENDING_VERIFICATION' },
        orderBy: { createdAt: 'desc' },
        include: {
            project: true
        }
    });
}

/**
 * INTAKE: Record a donation for review
 */
export async function createIntakeDonation(data: ErpTransactionInput) {
    const validated = erpTransactionSchema.parse(data);
    try {
        const tx = await prisma.erpTransaction.create({
            data: {
                ...validated,
                status: 'PENDING_VERIFICATION'
            }
        });
        revalidatePath('/admin/erp/finance');
        return { success: true, transactionId: tx.id };
    } catch (error) {
        console.error('Intake Error:', error);
        return { success: false, error: 'Failed to record donation intake.' };
    }
}

/**
 * VERIFICATION: Post a pending donation to the ledger
 */
export async function verifyAndPostDonation(transactionId: string, baseAmount: number) {
    try {
        return await prisma.$transaction(async (tx) => {
            const pendingTx = await tx.erpTransaction.findUniqueOrThrow({
                where: { id: transactionId }
            });

            if (pendingTx.status !== 'PENDING_VERIFICATION') {
                throw new Error('Transaction is already processed or rejected.');
            }

            // Accounting Logic mapping
            let debitCode = '1000'; // Cash on Hand
            let creditCode = '4000'; // Donation Revenue

            if (pendingTx.source === 'IN_KIND' || pendingTx.type === 'IN_KIND') {
                debitCode = '1100'; // In-Kind Inventory
                creditCode = '4001'; // In-Kind Revenue
            } else if (pendingTx.source === 'BANK_TRANSFER' || pendingTx.source === 'STRIPE') {
                debitCode = '1001'; // Cash at Bank
            }

            const debitAcc = await tx.erpAccount.findUnique({ where: { code: debitCode } });
            const creditAcc = await tx.erpAccount.findUnique({ where: { code: creditCode } });

            if (!debitAcc || !creditAcc) {
                throw new Error(`Missing required accounts (${debitCode}/${creditCode}). Check seed data.`);
            }

            // 1. Create Journal Entries
            await tx.erpJournalEntry.createMany({
                data: [
                    { amount: baseAmount, type: 'DEBIT', accountId: debitAcc.id, transactionId },
                    { amount: baseAmount, type: 'CREDIT', accountId: creditAcc.id, transactionId }
                ]
            });

            // 2. Update Account Balances
            await tx.erpAccount.update({
                where: { id: debitAcc.id },
                data: { balance: { increment: baseAmount } }
            });
            await tx.erpAccount.update({
                where: { id: creditAcc.id },
                data: { balance: { increment: baseAmount } }
            });

            // 3. Finalize Status
            await tx.erpTransaction.update({
                where: { id: transactionId },
                data: { 
                    status: 'VERIFIED',
                    baseAmount: baseAmount,
                    date: new Date() // Set to confirmation date
                }
            });

            return { success: true };
        });
    } catch (error: unknown) {
        console.error('Verification Error:', error);
        const message = error instanceof Error ? error.message : 'Failed to verify transaction.';
        return { success: false, error: message };
    } finally {
        revalidatePath('/admin/erp/finance');
    }
}

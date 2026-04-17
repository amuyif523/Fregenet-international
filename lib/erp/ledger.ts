import { ErpTransactionInput, ErpJournalEntryInput } from '@/lib/validations/erp';

/**
 * Ledger Utility for Double-Entry Accounting
 * 
 * CORE RULE: Every transaction must be balanced (Sum of Debits = Sum of Credits).
 */

export interface TransactionWithEntries extends ErpTransactionInput {
  entries: Omit<ErpJournalEntryInput, 'transactionId'>[];
}

// NOTE: Implementation moved to Server Actions (app/actions/erp/finance.ts)
// for direct database transaction support.

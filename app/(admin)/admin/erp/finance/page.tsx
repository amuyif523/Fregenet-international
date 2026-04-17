import { getAccountBalances, getRecentTransactions, getPendingTransactions } from '@/app/actions/erp/finance';
import { Wallet, Package, TrendingUp, History, AlertCircle, Plus } from 'lucide-react';
import Link from 'next/link';
import { VerifyButton } from './VerifyButton';

export const dynamic = 'force-dynamic';

export default async function FinancePage() {
    const balances = await getAccountBalances();
    const transactions = await getRecentTransactions(15);
    const pending = await getPendingTransactions();

    // Filter key accounts for the summary
    const cashAcc = balances.find(a => a.code === '1001'); // Bank
    const inventoryAcc = balances.find(a => a.code === '1100');
    const revenueAcc = balances.find(a => a.code === '4000');
    
    return (
        <div className="space-y-10">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="font-headline text-4xl font-extrabold text-[#1A1A1B]">Financial Overview</h1>
                    <p className="text-secondary">Track the real-time health of the foundation&apos;s assets and ledgers.</p>
                </div>
                <Link 
                    href="/admin/erp/finance/intake"
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-[#A8171D] transition-all shadow-lg shadow-primary/20 w-fit"
                >
                    <Plus className="w-5 h-5" />
                    Record New Donation
                </Link>
            </header>

            {/* Pending Review Queue */}
            {pending.length > 0 && (
                <section className="bg-amber-50 rounded-2xl border border-amber-200 overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-amber-200 bg-amber-100/50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-amber-600 animate-pulse" />
                            <h2 className="text-xl font-bold text-amber-900">Pending Verification ({pending.length})</h2>
                        </div>
                        <p className="text-xs font-bold text-amber-700 uppercase tracking-widest">Awaiting Admin Action</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-amber-800 text-xs uppercase font-bold tracking-wider">
                                    <th className="px-6 py-4">Source</th>
                                    <th className="px-6 py-4">Donor / Intent</th>
                                    <th className="px-6 py-4 text-right">Amount</th>
                                    <th className="px-6 py-4 text-right">Verification</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-amber-200">
                                {pending.map((item) => (
                                    <tr key={item.id} className="hover:bg-amber-100/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-amber-900">{item.source}</span>
                                                <span className="text-[10px] text-amber-700">{new Date(item.date).toLocaleDateString()}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-amber-900">{item.donorName || 'Anonymous'}</span>
                                                <span className="text-xs text-amber-700 line-clamp-1">{item.donorIntent || item.description}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-amber-900">
                                                    {Number(item.originalAmount || 0).toFixed(2)} {item.originalCurrency}
                                                </span>
                                                <span className="text-[10px] text-amber-600">
                                                    Base: ETB {Number(item.baseAmount || item.originalAmount || 0).toFixed(2)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end">
                                                <VerifyButton id={item.id} amount={Number(item.baseAmount || item.originalAmount || 0)} />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            )}


            {/* Account Balance Summaries */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-lg bg-primary/10">
                            <Wallet className="w-6 h-6 text-primary" />
                        </div>
                        <p className="text-sm uppercase tracking-wider text-secondary">Cash on Hand</p>
                    </div>
                    <p className="text-3xl font-bold text-[#1A1A1B]">
                        ETB {Number(cashAcc?.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                </div>

                <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-lg bg-green-500/10">
                            <Package className="w-6 h-6 text-green-600" />
                        </div>
                        <p className="text-sm uppercase tracking-wider text-secondary">Inventory Value</p>
                    </div>
                    <p className="text-3xl font-bold text-[#1A1A1B]">
                        ETB {Number(inventoryAcc?.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                </div>

                <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-lg bg-purple-500/10">
                            <TrendingUp className="w-6 h-6 text-purple-600" />
                        </div>
                        <p className="text-sm uppercase tracking-wider text-secondary">Revenue (YTD)</p>
                    </div>
                    <p className="text-3xl font-bold text-[#1A1A1B]">
                        ETB {Number(revenueAcc?.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                </div>
            </section>

            {/* Recent Transaction Ledger */}
            <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 overflow-hidden">
                <div className="p-6 border-b border-outline-variant/30 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <History className="w-5 h-5 text-primary" />
                        <h2 className="text-xl font-bold text-[#1A1A1B]">Recent Ledger Entries</h2>
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-surface-container-low">
                                <th className="px-6 py-4 text-sm font-semibold text-secondary uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-sm font-semibold text-secondary uppercase tracking-wider">Description</th>
                                <th className="px-6 py-4 text-sm font-semibold text-secondary uppercase tracking-wider">Type / Category</th>
                                <th className="px-6 py-4 text-sm font-semibold text-secondary uppercase tracking-wider">Double-Entry Details</th>
                                <th className="px-6 py-4 text-sm font-semibold text-secondary uppercase tracking-wider text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/20">
                            {transactions.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-10 text-center text-secondary italic">
                                        No recent transactions recorded in the ledger.
                                    </td>
                                </tr>
                            ) : (
                                transactions.map((tx) => {
                                    // Calculate total (Sum of all Debits)
                                    const total = tx.journalEntries
                                        .filter(e => e.type === 'DEBIT')
                                        .reduce((acc, curr) => acc + Number(curr.amount), 0);

                                    return (
                                        <tr key={tx.id} className="hover:bg-surface-container-lowest transition-colors">
                                            <td className="px-6 py-4 text-sm whitespace-nowrap">
                                                {new Date(tx.date).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-[#1A1A1B]">
                                                {tx.description}
                                            </td>
                                            <td className="px-6 py-4 space-y-1">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary uppercase">
                                                    {tx.type}
                                                </span>
                                                <div className="text-[10px] text-secondary uppercase font-bold">
                                                    {tx.category}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-1">
                                                    {tx.journalEntries.map((e, idx) => (
                                                        <div key={idx} className="flex justify-between gap-4 text-xs font-mono">
                                                            <span className="text-secondary">{e.account.name}</span>
                                                            <span className={e.type === 'DEBIT' ? 'text-green-600' : 'text-blue-600'}>
                                                                {e.type[0]}: {Number(e.amount).toFixed(2)}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right font-bold text-[#1A1A1B]">
                                                ETB {total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}

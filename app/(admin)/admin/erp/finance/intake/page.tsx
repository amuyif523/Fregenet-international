'use client';

import { useState } from 'react';
import { createIntakeDonation } from '@/app/actions/erp/finance';
import { z } from 'zod';
import { 
    DonationSourceEnum, 
    TransactionTypeEnum, 
    TransactionStatusEnum,
    FundRestrictionEnum
} from '@/lib/validations/erp';
import { ClipboardList, Send, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DonationIntakePage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true);
        setMessage(null);

        const data = {
            type: formData.get('type') as z.infer<typeof TransactionTypeEnum>,
            category: 'REVENUE' as const,
            status: 'PENDING_VERIFICATION' as z.infer<typeof TransactionStatusEnum>,
            isRestricted: false,
            fundRestriction: 'UNRESTRICTED' as z.infer<typeof FundRestrictionEnum>,
            source: formData.get('source') as z.infer<typeof DonationSourceEnum>,
            description: formData.get('description') as string,
            originalAmount: Number(formData.get('originalAmount')),
            originalCurrency: formData.get('originalCurrency') as string,
            donorName: formData.get('donorName') as string,
            donorEmail: formData.get('donorEmail') as string,
            donorIntent: formData.get('donorIntent') as string,
            referenceId: (formData.get('referenceId') as string) || null,
            date: new Date(formData.get('date') as string),
        };

        const result = await createIntakeDonation(data);

        if (result.success) {
            setMessage({ type: 'success', text: 'Donation intake recorded! It is now pending verification.' });
            setTimeout(() => router.push('/admin/erp/finance'), 2000);
        } else {
            setMessage({ type: 'error', text: result.error || 'Failed to record intake.' });
        }
        setIsSubmitting(false);
    }

    return (
        <div className="max-w-4xl mx-auto space-y-10 py-6">
            <header className="space-y-2">
                <div className="flex items-center gap-3 text-primary mb-2">
                    <ClipboardList className="w-6 h-6" />
                    <span className="text-sm font-bold uppercase tracking-widest text-[#CB2128]">ERP Finance</span>
                </div>
                <h1 className="font-headline text-4xl font-extrabold text-[#1A1A1B]">Donation Intake</h1>
                <p className="text-secondary max-w-2xl">
                    Log new value entering the foundation from various channels. All manual entries are queued for verification before ledger posting.
                </p>
            </header>

            {message && (
                <div className={`p-4 rounded-xl border ${
                    message.type === 'success' 
                        ? 'bg-green-50 border-green-200 text-green-800' 
                        : 'bg-red-50 border-red-200 text-red-800'
                }`}>
                    {message.text}
                </div>
            )}

            <form action={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Channel & Type */}
                <section className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/30 space-y-6">
                    <h2 className="text-xl font-bold text-[#1A1A1B] flex items-center gap-2">
                        <Info className="w-5 h-5 text-primary" />
                        Channel Details
                    </h2>
                    
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-secondary uppercase tracking-wider">Source Channel</label>
                        <select 
                            name="source" 
                            required
                            className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white"
                        >
                            <option value="BANK_TRANSFER">Bank Transfer</option>
                            <option value="CASH">Physical Cash</option>
                            <option value="IN_KIND">In-Kind (Physical Items)</option>
                            <option value="STRIPE">Stripe (Manual Log)</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-secondary uppercase tracking-wider">Asset Type</label>
                        <select 
                            name="type" 
                            required
                            className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white"
                        >
                            <option value="CASH">Currency / Cash</option>
                            <option value="IN_KIND">Physical Goods</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-secondary uppercase tracking-wider">Amount</label>
                            <input 
                                type="number" 
                                name="originalAmount" 
                                step="0.01" 
                                required 
                                placeholder="0.00"
                                className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-secondary uppercase tracking-wider">Currency</label>
                            <select 
                                name="originalCurrency" 
                                className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white"
                            >
                                <option value="ETB">ETB</option>
                                <option value="USD">USD</option>
                                <option value="EUR">EUR</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-secondary uppercase tracking-wider">Received Date</label>
                        <input 
                            type="date" 
                            name="date" 
                            defaultValue={new Date().toISOString().split('T')[0]}
                            required
                            className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                    </div>
                </section>

                {/* Donor & Notes */}
                <section className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/30 space-y-6">
                    <h2 className="text-xl font-bold text-[#1A1A1B] flex items-center gap-2">
                        <Send className="w-5 h-5 text-primary" />
                        Donor Information
                    </h2>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-secondary uppercase tracking-wider">Full Name</label>
                        <input 
                            type="text" 
                            name="donorName" 
                            placeholder="e.g. John Doe"
                            className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-secondary uppercase tracking-wider">Email Address</label>
                        <input 
                            type="email" 
                            name="donorEmail" 
                            placeholder="donor@example.com"
                            className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-secondary uppercase tracking-wider">Internal Description</label>
                        <input 
                            type="text" 
                            name="description" 
                            required
                            placeholder="e.g. Monthly Bank Transfer"
                            className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-secondary uppercase tracking-wider">Donor Intent / Comments</label>
                        <textarea 
                            name="donorIntent" 
                            rows={3}
                            placeholder="Any specific project or restriction requested by the donor..."
                            className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                        ></textarea>
                    </div>

                    <div className="pt-4">
                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg ${
                                isSubmitting ? 'bg-secondary cursor-not-allowed' : 'bg-primary hover:bg-[#A8171D] hover:-translate-y-1'
                            }`}
                        >
                            {isSubmitting ? 'Recording Intake...' : 'Submit Donation for Review'}
                        </button>
                    </div>
                </section>
            </form>
        </div>
    );
}

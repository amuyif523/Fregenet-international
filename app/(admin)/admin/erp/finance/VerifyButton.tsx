'use client';

import { useState } from 'react';
import { verifyAndPostDonation } from '@/app/actions/erp/finance';
import { CheckCircle2, Loader2 } from 'lucide-react';

export function VerifyButton({ id, amount }: { id: string, amount: number }) {
    const [isVerifying, setIsVerifying] = useState(false);

    async function handleVerify() {
        if (!confirm(`Are you sure you want to verify and post ETB ${amount.toFixed(2)} to the official ledger? This action will update account balances.`)) {
            return;
        }
        
        setIsVerifying(true);
        try {
            const result = await verifyAndPostDonation(id, amount);
            if (!result.success) {
                // Type narrowing: result must be the error branch here
                const errorResult = result as { error: string };
                alert(errorResult.error);
            }
        } catch {
            alert('An unexpected error occurred during verification.');
        } finally {
            setIsVerifying(false);
        }
    }

    return (
        <button 
            onClick={handleVerify}
            disabled={isVerifying}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-700 disabled:bg-slate-300 transition-all shadow-md shadow-green-900/10"
        >
            {isVerifying ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                <CheckCircle2 className="w-4 h-4" />
            )}
            {isVerifying ? 'Verifying...' : 'Verify & Post'}
        </button>
    );
}

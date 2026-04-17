'use client';

import { useState } from 'react';
import { recordStudentVitals } from '@/app/actions/erp/health';
import { Loader2 } from 'lucide-react';

export function HealthVitalsForm({ studentId }: { studentId: string }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true);
        setError(null);

        const data = {
            studentId,
            date: new Date(formData.get('date') as string),
            height: Number(formData.get('height')),
            weight: Number(formData.get('weight')),
        };

        const result = await recordStudentVitals(data);
        if (result.success) {
            (document.getElementById('health-form') as HTMLFormElement).reset();
        } else {
            setError(result.error || 'Failed to record vitals.');
        }
        setIsSubmitting(false);
    }

    return (
        <form id="health-form" action={handleSubmit} className="space-y-5">
            {error && <p className="text-xs text-red-500 font-bold">{error}</p>}
            
            <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Measurement Date</label>
                <input 
                    type="date" 
                    name="date" 
                    defaultValue={new Date().toISOString().split('T')[0]}
                    required 
                    className="w-full bg-[#2A2A2B] border border-slate-700/50 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                />
            </div>

            <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Height (cm)</label>
                <input 
                    type="number" 
                    step="0.1"
                    name="height" 
                    required 
                    placeholder="e.g. 145"
                    className="w-full bg-[#2A2A2B] border border-slate-700/50 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                />
            </div>

            <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Weight (kg)</label>
                <input 
                    type="number" 
                    step="0.1"
                    name="weight" 
                    required 
                    placeholder="e.g. 35.5"
                    className="w-full bg-[#2A2A2B] border border-slate-700/50 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                />
            </div>

            <button 
                disabled={isSubmitting}
                className="w-full py-4 bg-primary rounded-xl font-bold text-sm tracking-wide hover:bg-[#A8171D] transition-all flex items-center justify-center gap-2"
            >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {isSubmitting ? 'Recording...' : 'Update Health Record'}
            </button>
        </form>
    );
}

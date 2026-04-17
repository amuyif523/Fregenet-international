'use client';

import { useState } from 'react';
import { upsertStaff } from '@/app/actions/erp/school';
import { Loader2 } from 'lucide-react';

export function StaffOnboardingForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true);
        setError(null);

        const data = {
            name: formData.get('name') as string,
            role: formData.get('role') as string,
            hireDate: new Date(formData.get('hireDate') as string),
            isActive: true,
        };

        const result = await upsertStaff(data);
        if (result.success) {
            (document.getElementById('staff-form') as HTMLFormElement).reset();
        } else {
            setError(result.error || 'Failed to onboard staff.');
        }
        setIsSubmitting(false);
    }

    return (
        <form id="staff-form" action={handleSubmit} className="space-y-4">
            {error && <p className="text-xs text-red-500 font-bold">{error}</p>}
            
            <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Full Name</label>
                <input 
                    name="name" 
                    required 
                    placeholder="Employee Name"
                    className="w-full bg-[#2A2A2B] border border-slate-700/50 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                />
            </div>

            <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Primary Role</label>
                <select 
                    name="role" 
                    className="w-full bg-[#2A2A2B] border border-slate-700/50 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                >
                    <option value="Teacher">Teacher</option>
                    <option value="Administrator">Administrator</option>
                    <option value="Cook">Cook</option>
                    <option value="Security">Security</option>
                    <option value="Support Staff">Support Staff</option>
                </select>
            </div>

            <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hire Date</label>
                <input 
                    type="date" 
                    name="hireDate" 
                    defaultValue={new Date().toISOString().split('T')[0]}
                    required 
                    className="w-full bg-[#2A2A2B] border border-slate-700/50 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                />
            </div>

            <button 
                disabled={isSubmitting}
                className="w-full py-3 bg-primary rounded-xl font-bold text-sm tracking-wide hover:bg-[#A8171D] transition-all flex items-center justify-center gap-2"
            >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {isSubmitting ? 'Onboarding...' : 'Register Employee'}
            </button>
        </form>
    );
}

'use client';

import { useState } from 'react';
import { upsertStudent } from '@/app/actions/erp/school';
import { Loader2 } from 'lucide-react';
import { StudentStatusEnum } from '@/lib/validations/erp';
import { z } from 'zod';

export function StudentEnrollmentForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true);
        setError(null);

        const data = {
            firstName: formData.get('firstName') as string,
            lastName: formData.get('lastName') as string,
            dateOfBirth: new Date(formData.get('dateOfBirth') as string),
            gender: formData.get('gender') as string,
            school: formData.get('school') as string,
            bio: formData.get('bio') as string || undefined,
            status: 'ACTIVE' as z.infer<typeof StudentStatusEnum>,
        };

        const result = await upsertStudent(data);
        if (result.success) {
            // Re-render handled by revalidatePath in action
            (document.getElementById('enrollment-form') as HTMLFormElement).reset();
        } else {
            setError(result.error || 'Failed to enroll student.');
        }
        setIsSubmitting(false);
    }

    return (
        <form id="enrollment-form" action={handleSubmit} className="space-y-4">
            {error && <p className="text-xs text-red-500 font-bold">{error}</p>}
            
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">First Name</label>
                    <input 
                        name="firstName" 
                        required 
                        className="w-full bg-[#2A2A2B] border border-slate-700/50 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Last Name</label>
                    <input 
                        name="lastName" 
                        required 
                        className="w-full bg-[#2A2A2B] border border-slate-700/50 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">DOB</label>
                    <input 
                        type="date" 
                        name="dateOfBirth" 
                        required 
                        className="w-full bg-[#2A2A2B] border border-slate-700/50 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Gender</label>
                    <select 
                        name="gender" 
                        className="w-full bg-[#2A2A2B] border border-slate-700/50 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                    >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">School Branch</label>
                <select 
                    name="school" 
                    className="w-full bg-[#2A2A2B] border border-slate-700/50 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                >
                    <option value="Denbi">Denbi</option>
                    <option value="Addis Ababa">Addis Ababa</option>
                </select>
            </div>

            <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Notes / Bio</label>
                <textarea 
                    name="bio" 
                    rows={3} 
                    className="w-full bg-[#2A2A2B] border border-slate-700/50 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none resize-none"
                />
            </div>

            <button 
                disabled={isSubmitting}
                className="w-full py-3 bg-primary rounded-xl font-bold text-sm tracking-wide hover:bg-[#A8171D] transition-all flex items-center justify-center gap-2"
            >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {isSubmitting ? 'Enrolling...' : 'Confirm Enrollment'}
            </button>
        </form>
    );
}

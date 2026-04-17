import { getAllStudents } from '@/app/actions/erp/school';
import { Utensils, ClipboardCheck } from 'lucide-react';
import { NutritionBulkEntryForm } from './NutritionBulkEntryForm';

export const dynamic = 'force-dynamic';

export default async function NutritionLogPage() {
    const students = await getAllStudents();

    return (
        <div className="space-y-10">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3 text-primary mb-1">
                        <Utensils className="w-6 h-6" />
                        <span className="text-sm font-bold uppercase tracking-widest text-[#CB2128]">Impact Tracking</span>
                    </div>
                    <h1 className="font-headline text-4xl font-extrabold text-[#1A1A1B]">Daily Feeding Log</h1>
                    <p className="text-secondary max-w-2xl">Record nutritional impact and track student participation across school branches.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-1 gap-10">
                <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 overflow-hidden shadow-sm">
                    <div className="p-8 border-b border-outline-variant/30 bg-[#1A1A1B] text-white flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <ClipboardCheck className="w-5 h-5 text-primary" />
                            <h2 className="text-xl font-bold">New Feeding Event</h2>
                        </div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                            Bulk Enrollment Logic enabled
                        </div>
                    </div>
                    
                    <div className="p-8">
                        <NutritionBulkEntryForm allStudents={students} />
                    </div>
                </section>
            </div>
        </div>
    );
}

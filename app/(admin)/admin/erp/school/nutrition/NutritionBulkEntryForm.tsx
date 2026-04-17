'use client';

import { useState, useMemo } from 'react';
import { logDailyMeal } from '@/app/actions/erp/health';
import { Loader2, Users, CheckCircle } from 'lucide-react';

interface SimpleStudent {
    id: string;
    firstName: string;
    lastName: string;
    school: string;
}

export function NutritionBulkEntryForm({ allStudents }: { allStudents: SimpleStudent[] }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [selectedSchool, setSelectedSchool] = useState('Denbi');
    const [absenteeIds, setAbsenteeIds] = useState<string[]>([]);

    // Filter students by selected school
    const filteredStudents = useMemo(() => {
        return allStudents.filter(s => s.school === selectedSchool);
    }, [allStudents, selectedSchool]);

    const activeCount = filteredStudents.length - absenteeIds.length;

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true);
        setMessage(null);

        const data = {
            date: new Date(formData.get('date') as string),
            mealType: formData.get('mealType') as string,
            menu: formData.get('menu') as string,
            studentCount: activeCount,
            school: selectedSchool,
            absenteeIds: absenteeIds
        };

        const result = await logDailyMeal(data);
        if (result.success) {
            setMessage({ type: 'success', text: `Feeding log recorded for ${activeCount} students!` });
            setAbsenteeIds([]);
            (document.getElementById('nutrition-form') as HTMLFormElement).reset();
        } else {
            setMessage({ type: 'error', text: result.error || 'Failed to record feeding event.' });
        }
        setIsSubmitting(false);
    }

    const toggleAbsentee = (id: string) => {
        setAbsenteeIds(prev => 
            prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
        );
    };

    return (
        <form id="nutrition-form" action={handleSubmit} className="space-y-8">
            {message && (
                <div className={`p-4 rounded-xl border ${
                    message.type === 'success' 
                        ? 'bg-green-50 border-green-200 text-green-800' 
                        : 'bg-red-50 border-red-200 text-red-800'
                }`}>
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-secondary uppercase tracking-widest">School Branch</label>
                        <select 
                            name="school" 
                            className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 outline-none focus:ring-2 focus:ring-primary/20 bg-white"
                            onChange={(e) => {
                                setSelectedSchool(e.target.value);
                                setAbsenteeIds([]);
                            }}
                            value={selectedSchool}
                        >
                            <option value="Denbi">Denbi</option>
                            <option value="Addis Ababa">Addis Ababa</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-secondary uppercase tracking-widest">Feeding Date</label>
                        <input 
                            type="date" 
                            name="date" 
                            defaultValue={new Date().toISOString().split('T')[0]}
                            required
                            className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 outline-none focus:ring-2 focus:ring-primary/20"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-secondary uppercase tracking-widest">Meal Type</label>
                        <select 
                            name="mealType" 
                            className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 outline-none focus:ring-2 focus:ring-primary/20 bg-white"
                        >
                            <option value="Breakfast">Breakfast</option>
                            <option value="Lunch">Lunch</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-secondary uppercase tracking-widest">Menu Details</label>
                        <textarea 
                            name="menu" 
                            required
                            placeholder="e.g. Rice with Vegetable Stew and Milk"
                            className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 outline-none focus:ring-2 focus:ring-primary/20 resize-none h-32"
                        />
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="flex items-center justify-between pb-2 border-b border-outline-variant/30">
                        <label className="text-xs font-bold text-secondary uppercase tracking-widest flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Attendance Check
                        </label>
                        <p className="text-xs font-bold text-primary">
                            Students Fed: {activeCount} / {filteredStudents.length}
                        </p>
                    </div>

                    <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2">
                        {filteredStudents.length === 0 ? (
                            <p className="text-sm text-secondary italic py-10 text-center">No students registered at this branch.</p>
                        ) : (
                            filteredStudents.map((student) => {
                                const isAbsent = absenteeIds.includes(student.id);
                                return (
                                    <button
                                        key={student.id}
                                        type="button"
                                        onClick={() => toggleAbsentee(student.id)}
                                        className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
                                            isAbsent 
                                                ? 'bg-slate-50 border-slate-200 opacity-60' 
                                                : 'bg-white border-outline-variant/50 shadow-sm'
                                        }`}
                                    >
                                        <div className="flex flex-col items-start">
                                            <span className={`text-sm font-bold ${isAbsent ? 'text-slate-500 line-through' : 'text-[#1A1A1B]'}`}>
                                                {student.firstName} {student.lastName}
                                            </span>
                                        </div>
                                        {isAbsent ? (
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Absent</span>
                                        ) : (
                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                        )}
                                    </button>
                                );
                            })
                        )}
                    </div>

                    <button 
                        disabled={isSubmitting || filteredStudents.length === 0}
                        className="w-full py-4 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#A8171D] disabled:bg-slate-300 transition-all shadow-lg"
                    >
                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                        {isSubmitting ? 'Recording Impact...' : 'Save Daily Feeding Log'}
                    </button>
                </div>
            </div>
        </form>
    );
}

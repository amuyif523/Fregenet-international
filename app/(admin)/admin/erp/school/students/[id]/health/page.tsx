import { prisma } from '@/lib/prisma';
import { getStudentHealthHistory } from '@/app/actions/erp/health';
import { Activity, ArrowUpRight, Scale, Ruler, PlusCircle } from 'lucide-react';
import { HealthVitalsForm } from './HealthVitalsForm';
import { HealthGrowthChart } from './HealthGrowthChart';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function StudentHealthPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    
    const student = await prisma.student.findUnique({
        where: { id }
    });

    if (!student) notFound();

    const history = await getStudentHealthHistory(id);
    const latest = history[history.length - 1];

    return (
        <div className="space-y-10">
            <header className="space-y-1">
                <div className="flex items-center gap-2 text-primary">
                    <Activity className="w-5 h-5" />
                    <span className="text-sm font-bold uppercase tracking-widest text-[#CB2128]">Health Track</span>
                </div>
                <h1 className="font-headline text-3xl font-extrabold text-[#1A1A1B]">
                    {student.firstName} {student.lastName}
                </h1>
                <p className="text-secondary">Longitudinal health monitoring and growth metrics.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Metrics Summary */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="grid grid-cols-3 gap-6">
                        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 flex flex-col items-center text-center">
                            <Ruler className="w-5 h-5 text-primary mb-2 opacity-30" />
                            <p className="text-[10px] uppercase font-bold text-secondary tracking-widest mb-1">Height</p>
                            <p className="text-2xl font-bold text-[#1A1A1B]">{Number(latest?.height || 0).toFixed(0)} <span className="text-xs font-normal">cm</span></p>
                        </div>
                        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 flex flex-col items-center text-center">
                            <Scale className="w-5 h-5 text-primary mb-2 opacity-30" />
                            <p className="text-[10px] uppercase font-bold text-secondary tracking-widest mb-1">Weight</p>
                            <p className="text-2xl font-bold text-[#1A1A1B]">{Number(latest?.weight || 0).toFixed(1)} <span className="text-xs font-normal">kg</span></p>
                        </div>
                        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 flex flex-col items-center text-center text-center">
                            <ArrowUpRight className="w-5 h-5 text-primary mb-2 opacity-30" />
                            <p className="text-[10px] uppercase font-bold text-secondary tracking-widest mb-1">Current BMI</p>
                            <p className="text-2xl font-bold text-[#1A1A1B]">{Number(latest?.bmi || 0).toFixed(1)}</p>
                        </div>
                    </div>

                    <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/30">
                        <h2 className="text-xl font-bold text-[#1A1A1B] mb-8">Growth Trajectory</h2>
                        <HealthGrowthChart history={history} />
                    </div>
                </div>

                {/* Vitals Entry Form */}
                <aside className="space-y-6">
                    <div className="bg-[#1A1A1B] p-8 rounded-2xl text-white shadow-xl shadow-slate-900/10">
                        <div className="flex items-center gap-3 mb-6">
                            <PlusCircle className="w-6 h-6 text-primary" />
                            <h2 className="text-xl font-bold">New Measurement</h2>
                        </div>
                        <HealthVitalsForm studentId={id} />
                    </div>

                    <div className="bg-green-50 p-6 rounded-2xl border border-green-200">
                        <h4 className="text-[10px] font-bold text-green-700 uppercase tracking-widest mb-2">Nutritional Status</h4>
                        <p className="text-sm text-green-800 leading-relaxed italic">
                            Regular monitoring helps ensure the foundation&apos;s nutritional assistance is effectively supporting healthy growth.
                        </p>
                    </div>
                </aside>
            </div>
        </div>
    );
}

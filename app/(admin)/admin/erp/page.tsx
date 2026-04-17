import { getSchoolMetrics } from '@/app/actions/erp/school';
import { getAccountBalances } from '@/app/actions/erp/finance';
import { getSchoolNutritionStats } from '@/app/actions/erp/health';
import { GraduationCap, UserCheck, Calculator, Wallet, TrendingUp, ChevronRight, Utensils } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function ErpDashboardPage() {
    const metrics = await getSchoolMetrics();
    const balances = await getAccountBalances();
    const impact = await getSchoolNutritionStats();

    const cash = balances.find(a => a.code === '1001');

    return (
        <div className="space-y-10">
            <header className="space-y-2">
                <div className="flex items-center gap-3 text-primary mb-1">
                    <span className="text-sm font-bold uppercase tracking-widest text-[#CB2128]">Fregenet OS ERP</span>
                </div>
                <h1 className="font-headline text-4xl font-extrabold text-[#1A1A1B]">Operations Dashboard</h1>
                <p className="text-secondary max-w-2xl">A unified view of foundation impact, school enrollment, and financial health.</p>
            </header>

            {/* Top Level Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-[#1A1A1B] text-white p-6 rounded-2xl shadow-xl shadow-slate-900/10">
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-4">Active Students</p>
                    <div className="flex items-end justify-between">
                        <p className="text-4xl font-bold">{metrics.activeStudents}</p>
                        <GraduationCap className="w-8 h-8 text-primary opacity-50" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-outline-variant/30">
                    <p className="text-[10px] uppercase font-bold text-secondary tracking-widest mb-4">Foundation Staff</p>
                    <div className="flex items-end justify-between">
                        <p className="text-4xl font-bold text-[#1A1A1B]">{metrics.totalStaff}</p>
                        <UserCheck className="w-8 h-8 text-primary opacity-20" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-outline-variant/30">
                    <p className="text-[10px] uppercase font-bold text-secondary tracking-widest mb-4">Student/Teacher Ratio</p>
                    <div className="flex items-end justify-between">
                        <p className="text-4xl font-bold text-[#1A1A1B]">{metrics.ratio}</p>
                        <Calculator className="w-8 h-8 text-primary opacity-20" />
                    </div>
                </div>

                <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/30">
                    <p className="text-[10px] uppercase font-bold text-secondary tracking-widest mb-4">Total Meals Served</p>
                    <div className="flex items-end justify-between">
                        <p className="text-4xl font-bold text-[#1A1A1B]">{impact.totalMealsServed.toLocaleString()}</p>
                        <Utensils className="w-8 h-8 text-primary opacity-20" />
                    </div>
                </div>

                <div className="bg-[#CB2128] text-white p-6 rounded-2xl shadow-xl shadow-red-900/10">
                    <p className="text-[10px] uppercase font-bold text-white/60 tracking-widest mb-4">Bank Liquidity</p>
                    <div className="flex items-end justify-between">
                        <p className="text-2xl font-bold">ETB {Number(cash?.balance || 0).toLocaleString()}</p>
                        <Wallet className="w-8 h-8 text-white opacity-20" />
                    </div>
                </div>
            </div>

            {/* Quick Actions / Navigation Sections */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                {/* School Operations Section */}
                <section className="space-y-6">
                    <h2 className="text-xl font-bold text-[#1A1A1B] flex items-center gap-3">
                        <GraduationCap className="w-5 h-5 text-primary" />
                        School Operations
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Link href="/admin/erp/school/students" className="group bg-white p-6 rounded-xl border border-outline-variant/30 hover:border-primary transition-all">
                            <h3 className="font-bold text-[#1A1A1B] mb-1 group-hover:text-primary">Student Registry</h3>
                            <p className="text-xs text-secondary mb-4">Enroll new children and track support status.</p>
                            <div className="flex items-center text-xs font-bold text-primary gap-1">
                                Open Module <ChevronRight className="w-3 h-3" />
                            </div>
                        </Link>
                        <Link href="/admin/erp/school/staff" className="group bg-white p-6 rounded-xl border border-outline-variant/30 hover:border-primary transition-all">
                            <h3 className="font-bold text-[#1A1A1B] mb-1 group-hover:text-primary">Staff Directory</h3>
                            <p className="text-xs text-secondary mb-4">Manage teachers and support personnel.</p>
                            <div className="flex items-center text-xs font-bold text-primary gap-1">
                                Open Module <ChevronRight className="w-3 h-3" />
                            </div>
                        </Link>
                    </div>
                </section>

                {/* Financial Operations Section */}
                <section className="space-y-6">
                    <h2 className="text-xl font-bold text-[#1A1A1B] flex items-center gap-3">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        Financial Management
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Link href="/admin/erp/finance" className="group bg-white p-6 rounded-xl border border-outline-variant/30 hover:border-primary transition-all">
                            <h3 className="font-bold text-[#1A1A1B] mb-1 group-hover:text-primary">Ledger Overview</h3>
                            <p className="text-xs text-secondary mb-4">Real-time view of assets and expenditures.</p>
                            <div className="flex items-center text-xs font-bold text-primary gap-1">
                                Open Module <ChevronRight className="w-3 h-3" />
                            </div>
                        </Link>
                        <Link href="/admin/erp/finance/intake" className="group bg-white p-6 rounded-xl border border-outline-variant/30 hover:border-primary transition-all">
                            <h3 className="font-bold text-[#1A1A1B] mb-1 group-hover:text-primary">Donation Intake</h3>
                            <p className="text-xs text-secondary mb-4">Log manual funds and Stripe payouts.</p>
                            <div className="flex items-center text-xs font-bold text-primary gap-1">
                                Open Module <ChevronRight className="w-3 h-3" />
                            </div>
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
}

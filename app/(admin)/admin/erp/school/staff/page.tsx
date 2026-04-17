import { getAllStaff } from '@/app/actions/erp/school';
import { Briefcase, UserCheck, Calendar, UserPlus } from 'lucide-react';
import { StaffOnboardingForm } from './StaffOnboardingForm';

export const dynamic = 'force-dynamic';

export default async function StaffRegistryPage() {
    const staff = await getAllStaff();

    return (
        <div className="space-y-10">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3 text-primary mb-1">
                        <Briefcase className="w-6 h-6" />
                        <span className="text-sm font-bold uppercase tracking-widest text-[#CB2128]">Human Resources</span>
                    </div>
                    <h1 className="font-headline text-4xl font-extrabold text-[#1A1A1B]">Staff Management</h1>
                    <p className="text-secondary max-w-2xl">Maintain the registry of teachers, administrators, and support staff managed by the foundation.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10 items-start">
                {/* Staff Table */}
                <section className="xl:col-span-2 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-outline-variant/30 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <UserCheck className="w-5 h-5 text-primary" />
                            <h2 className="text-xl font-bold text-[#1A1A1B]">Employee Registry ({staff.length})</h2>
                        </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-surface-container-low">
                                    <th className="px-6 py-4 text-xs font-bold text-secondary uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-4 text-xs font-bold text-secondary uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-4 text-xs font-bold text-secondary uppercase tracking-wider">Hire Date</th>
                                    <th className="px-6 py-4 text-xs font-bold text-secondary uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant/20">
                                {staff.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-10 text-center text-secondary italic">No staff records found.</td>
                                    </tr>
                                ) : (
                                    staff.map((member) => (
                                        <tr key={member.id} className="hover:bg-surface-container-lowest transition-colors">
                                            <td className="px-6 py-4 font-bold text-[#1A1A1B]">
                                                {member.name}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm px-3 py-1 rounded-lg bg-surface-container-low text-secondary font-medium">
                                                    {member.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-secondary">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4" />
                                                    {new Date(member.hireDate).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold ${
                                                    member.isActive 
                                                        ? 'bg-green-100 text-green-700' 
                                                        : 'bg-red-100 text-red-700'
                                                }`}>
                                                    {member.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Onboarding Form */}
                <section className="space-y-6">
                    <div className="bg-[#1A1A1B] p-8 rounded-2xl text-white shadow-xl shadow-slate-900/10">
                        <div className="flex items-center gap-3 mb-6">
                            <UserPlus className="w-6 h-6 text-primary" />
                            <h2 className="text-xl font-bold">Staff Onboarding</h2>
                        </div>
                        <StaffOnboardingForm />
                    </div>
                    
                    <div className="p-6 rounded-2xl border border-outline-variant/30 bg-white">
                        <h3 className="text-sm font-bold text-[#1A1A1B] mb-2 uppercase tracking-wide">Financial Integration</h3>
                        <p className="text-xs text-secondary leading-relaxed leading-relaxed">
                            Employee roles defined here are used to categorize future <span className="text-primary font-bold italic">Salary Expense</span> journal entries in the ledger.
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
}

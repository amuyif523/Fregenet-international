import { getAllStudents } from '@/app/actions/erp/school';
import { Users, GraduationCap, MapPin, Plus } from 'lucide-react';
import { StudentEnrollmentForm } from './StudentEnrollmentForm';

export const dynamic = 'force-dynamic';

export default async function StudentRegistryPage() {
    const students = await getAllStudents();

    return (
        <div className="space-y-10">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3 text-primary mb-1">
                        <GraduationCap className="w-6 h-6" />
                        <span className="text-sm font-bold uppercase tracking-widest text-[#CB2128]">SIS Operations</span>
                    </div>
                    <h1 className="font-headline text-4xl font-extrabold text-[#1A1A1B]">Student Registry</h1>
                    <p className="text-secondary max-w-2xl">Manage enrollment, status, and school assignments for all foundation supported children.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10 items-start">
                {/* Registry Table */}
                <section className="xl:col-span-2 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-outline-variant/30 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Users className="w-5 h-5 text-primary" />
                            <h2 className="text-xl font-bold text-[#1A1A1B]">Enrolled Students ({students.length})</h2>
                        </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-surface-container-low">
                                    <th className="px-6 py-4 text-xs font-bold text-secondary uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-4 text-xs font-bold text-secondary uppercase tracking-wider">School</th>
                                    <th className="px-6 py-4 text-xs font-bold text-secondary uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-secondary uppercase tracking-wider">Enrolled</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant/20">
                                {students.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-10 text-center text-secondary italic">No student records found.</td>
                                    </tr>
                                ) : (
                                    students.map((student) => (
                                        <tr key={student.id} className="hover:bg-surface-container-lowest transition-colors">
                                            <td className="px-6 py-4">
                                                <p className="font-bold text-[#1A1A1B]">{student.firstName} {student.lastName}</p>
                                                <p className="text-[10px] text-secondary">
                                                    DOB: {new Date(student.dateOfBirth).toLocaleDateString()} ({student.gender[0]})
                                                </p>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium">
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="w-3.5 h-3.5 text-primary" />
                                                    {student.school}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-bold">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] uppercase ${
                                                    student.status === 'ACTIVE' 
                                                        ? 'bg-green-100 text-green-700' 
                                                        : 'bg-slate-100 text-slate-600'
                                                }`}>
                                                    {student.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-xs text-secondary">
                                                {new Date(student.enrollmentDate).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Enrollment Form */}
                <section className="space-y-6">
                    <div className="bg-[#1A1A1B] p-8 rounded-2xl text-white shadow-xl shadow-slate-900/10">
                        <div className="flex items-center gap-3 mb-6">
                            <Plus className="w-6 h-6 text-primary" />
                            <h2 className="text-xl font-bold">New Enrollment</h2>
                        </div>
                        <StudentEnrollmentForm />
                    </div>
                    
                    <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10">
                        <p className="text-xs text-primary font-bold uppercase tracking-widest mb-2">Notice</p>
                        <p className="text-sm text-slate-600 leading-relaxed italic">
                            Adding a student here registers them in the foundation&apos;s beneficiary registry, enabling support tracking and reporting.
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
}

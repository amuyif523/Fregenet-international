import { prisma } from '@/lib/prisma';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { DatabaseUnavailableNotice } from '@/components/DatabaseUnavailableNotice';
import { safeDbQuery } from '@/lib/safe-db';
import type { Report } from '@/prisma/generated/client';

export const dynamic = 'force-dynamic';

export default async function TransparencyPage() {
    const { data: reports, unavailable } = await safeDbQuery(
        'reports',
        () => prisma.report.findMany({ orderBy: { year: 'desc' } }),
        [] as Report[]
    );

    return (
        <div>
            <Navbar />
            <main>
                <section className="bg-surface py-24 md:py-32 px-8">
                    <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row gap-16">
                        <div className="md:w-7/12">
                            <span className="inline-block text-primary font-bold tracking-[0.2em] uppercase text-xs mb-6">Institutional Accountability</span>
                            <h1 className="font-headline text-5xl md:text-7xl font-extrabold text-[#1A1A1B] mb-8">
                                Trust Through <br/><span className="text-primary italic font-normal">Radical</span> Transparency.
                            </h1>
                            <p className="text-secondary text-xl max-w-2xl">
                                Full access to our financial records ensures every dollar is invested in the future of our students.
                            </p>
                        </div>
                        <div className="md:w-5/12 hidden md:block">
                            <img className="w-full h-full object-cover grayscale opacity-80 rounded-xl editorial-shadow" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7ZaVfQQQGz-1Y-RKjwVVuuPymaqef4Um4ZXa7p73D94nmfENINV6mmac3toLb6TiOWEC9MAoeLQGdoGOCari42OyzhJcAI7Sofmojmxuoi4whOQk8uQVCyNUqBT1_jdOcjv1GRPCfe4EHdPdjfIhueUgsowm_bNUm82PsU4pGVow63aO-4rCndOy8evrqr9G3_ljBTL9X9xypIia4yHTrQm4Y9fvUuqLxpz4O7ykaSyxRjgkZGgVg4729HVS7QqAJv1T3zDM6OQ"/>
                        </div>
                    </div>
                </section>
                <section className="bg-surface py-24 px-8 max-w-screen-2xl mx-auto">
                    <h2 className="font-headline text-3xl font-bold mb-12">Annual Reports</h2>
                    <div className="space-y-4">
                        {reports.length > 0 ? (
                            reports.map((report: Report) => (
                                <div key={report.id} className="group flex flex-col md:flex-row md:items-center justify-between p-8 bg-surface-container-lowest border border-transparent hover:border-outline-variant/30 rounded-xl transition-all duration-500 editorial-shadow">
                                    <div className="flex items-center gap-8">
                                        <span className="text-6xl font-headline font-black text-surface-container-highest group-hover:text-primary-container/20">{report.year}</span>
                                        <div>
                                            <h3 className="text-xl font-bold">{report.title}</h3>
                                            <p className="text-secondary text-sm">{report.category} • Audited Financial Statements • IRS Form 990</p>
                                        </div>
                                    </div>
                                    <div className="mt-4 md:mt-0 flex flex-col items-start md:items-end gap-3">
                                        {report.isVerified ? (
                                            <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-gradient-to-r from-amber-200 to-teal-200 text-teal-950 border border-amber-300">
                                                IFRS 18 Certified
                                            </span>
                                        ) : null}
                                        <a href={report.fileUrl} target="_blank" rel="noopener noreferrer" className="bg-primary-container text-white px-8 py-4 rounded-lg font-bold uppercase text-xs inline-block text-center">Download PDF</a>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <DatabaseUnavailableNotice
                                title={unavailable ? 'Reports temporarily unavailable' : 'Reports coming soon'}
                                message={
                                    unavailable
                                        ? 'Annual reports are temporarily unavailable while the site reconnects to the database.'
                                        : 'Published reports will appear here once they have been uploaded.'
                                }
                            />
                        )}
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}

import { prisma } from '@/lib/prisma';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { DatabaseUnavailableNotice } from '@/components/DatabaseUnavailableNotice';
import { safeDbQuery } from '@/lib/safe-db';
import type { Project } from '@/prisma/generated/client';

export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
    const { data: projects, unavailable } = await safeDbQuery(
        'projects',
        () =>
            prisma.project.findMany({
                where: { status: 'active' },
                orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
            }),
        [] as Project[]
    );

    return (
        <div>
            <Navbar />
            <main>
                <section className="relative pt-24 pb-20 px-8 max-w-screen-2xl mx-auto">
                    <div className="max-w-4xl">
                        <span className="text-primary font-bold tracking-[0.2em] uppercase text-xs mb-4 block">Our Portfolio</span>
                        <h1 className="font-headline text-5xl md:text-7xl font-extrabold text-[#1A1A1B] leading-tight tracking-tighter mb-8">
                            Empowering through <br/><span className="text-primary italic">Education & Care</span>.
                        </h1>
                        <p className="text-xl text-secondary leading-relaxed max-w-2xl font-body">
                            Fregenet International focuses on sustainable community growth through targeted initiatives in Addis Ababa, ensuring every child has the tools to succeed.
                        </p>
                    </div>
                </section>
                <section className="px-8 pb-32 max-w-screen-2xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                        {projects.length > 0 ? (
                            projects.map((project: Project, index: number) => {
                                const isLarge = index % 2 === 0;
                                const imageFallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(project.title)}&size=800&background=random`;
                                return (
                                    <div key={project.id} className={`group cursor-pointer ${isLarge ? 'md:col-span-8' : 'md:col-span-4'}`}>
                                        <div className={`relative overflow-hidden bg-surface-container mb-8 ${isLarge ? 'aspect-[16/9]' : 'aspect-[4/5]'}`}>
                                            <img alt={project.title} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" src={project.imageUrl || imageFallbackUrl} />
                                        </div>
                                        <div className={isLarge ? "flex justify-between items-start" : ""}>
                                            <div className={isLarge ? "max-w-xl" : ""}>
                                                <span className={`text-4xl font-headline font-extrabold text-surface-container-highest mb-4 ${isLarge ? 'hidden' : 'block'}`}>0{index + 1}</span>
                                                <h2 className={`font-headline font-bold text-[#1A1A1B] mb-3 ${isLarge ? 'text-3xl' : 'text-2xl'}`}>{project.title}</h2>
                                                <p className={`text-secondary ${isLarge ? 'mb-6' : ''}`}>{project.description}</p>
                                            </div>
                                            {isLarge && <span className="text-4xl font-headline font-extrabold text-surface-container-highest">0{index + 1}</span>}
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="md:col-span-12">
                                <DatabaseUnavailableNotice
                                    title={unavailable ? 'Projects temporarily unavailable' : 'Projects coming soon'}
                                    message={
                                        unavailable
                                            ? 'Project stories are temporarily unavailable while the site reconnects to the database.'
                                            : 'Published projects will appear here once they have been added.'
                                    }
                                />
                            </div>
                        )}
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}

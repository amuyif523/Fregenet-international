import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { DatabaseUnavailableNotice } from '@/components/DatabaseUnavailableNotice';
import { ShieldCheck } from 'lucide-react';
import type { BoardMember } from '@/prisma/generated/client';
import { safeDbQuery } from '@/lib/safe-db';

export const dynamic = 'force-dynamic';

async function getBoardMembers() {
    return safeDbQuery(
        'board members',
        () => prisma.boardMember.findMany({ orderBy: { sortOrder: 'asc' } }),
        [] as BoardMember[]
    );
}

export default async function GovernancePage() {
    const { data: boardMembers, unavailable } = await getBoardMembers();

    return (
        <div className="bg-surface">
            <Navbar />
            <main>
                <section className="py-24 md:py-32 px-8 max-w-screen-2xl mx-auto flex flex-col md:flex-row gap-16 items-end">
                    <div className="md:w-3/5 space-y-8">
                        <span className="text-primary font-bold tracking-[0.2em] uppercase text-sm">Organizational Excellence</span>
                        <h1 className="font-headline font-extrabold text-5xl md:text-7xl leading-[1.1] tracking-tight text-[#1A1A1B]">
                            Governing with <br/> Transparency & Trust.
                        </h1>
                        <p className="text-xl text-secondary leading-relaxed max-w-2xl font-light">
                            Our leadership brings together global expertise and deep local insights to ensure every resource is directed toward transformative education.
                        </p>
                    </div>
                    <div className="md:w-2/5 flex flex-col items-start gap-6 border-l border-outline-variant/30 pl-8 pb-4">
                        <div className="flex items-center gap-4">
                            <ShieldCheck className="text-primary w-8 h-8" />
                            <span className="text-sm font-bold text-[#1A1A1B] uppercase tracking-wider">100% Transparency</span>
                        </div>
                        <p className="text-sm text-secondary">Independent Board committed to the highest standards of fiscal responsibility.</p>
                    </div>
                </section>
                <section className="bg-surface-container-low py-20 px-8">
                    <div className="max-w-screen-2xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 text-center md:text-left">
                        <div><div className="text-4xl font-headline font-extrabold text-primary mb-2">2004</div><div className="text-xs font-bold uppercase tracking-widest text-secondary">Year Established</div></div>
                        <div><div className="text-4xl font-headline font-extrabold text-primary mb-2">12</div><div className="text-xs font-bold uppercase tracking-widest text-secondary">Board Members</div></div>
                        <div><div className="text-4xl font-headline font-extrabold text-primary mb-2">98%</div><div className="text-xs font-bold uppercase tracking-widest text-secondary">Program Efficiency</div></div>
                        <div><div className="text-4xl font-headline font-extrabold text-primary mb-2">Global</div><div className="text-xs font-bold uppercase tracking-widest text-secondary">Network Coverage</div></div>
                    </div>
                </section>
                <section className="py-24 px-8 max-w-screen-2xl mx-auto">
                    {boardMembers.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            {boardMembers.map((member: BoardMember) => {
                                const avatarUrl = member.imageUrl?.startsWith('/') ? member.imageUrl : '/images/board/placeholder.svg';
                                return (
                                    <div key={member.id} className="group flex flex-col h-full bg-surface-container-lowest p-6 rounded-xl editorial-shadow hover:-translate-y-2 transition-all">
                                        <div className="relative mb-4 aspect-[4/5] w-full overflow-hidden rounded-lg">
                                            <Image
                                                src={avatarUrl}
                                                alt={member.name}
                                                fill
                                                sizes="(min-width: 768px) 25vw, 100vw"
                                                className="object-cover grayscale transition-all group-hover:grayscale-0"
                                            />
                                        </div>
                                        <h3 className="font-bold text-xl text-[#1A1A1B]">{member.name}</h3>
                                        <p className="text-primary font-bold text-xs uppercase tracking-widest mb-3">{member.role}</p>
                                        <p className="text-secondary text-sm mt-auto flex-1">{member.bio}</p>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <DatabaseUnavailableNotice
                            title={unavailable ? 'Board directory temporarily unavailable' : 'Board profiles coming soon'}
                            message={
                                unavailable
                                    ? 'Board member profiles are temporarily unavailable while the site reconnects to the database.'
                                    : 'Board member profiles will appear here once they have been published.'
                            }
                        />
                    )}
                </section>
            </main>
            <Footer />
        </div>
    );
}

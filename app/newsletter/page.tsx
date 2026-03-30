import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { DatabaseUnavailableNotice } from '@/components/DatabaseUnavailableNotice';
import { prisma } from '@/lib/prisma';
import { safeDbQuery } from '@/lib/safe-db';

export const metadata: Metadata = {
  title: 'Newsletter | Fregenet International',
  description: "Stay updated with Fregenet International's impact in Ethiopia.",
};

export const dynamic = 'force-dynamic';

export default async function NewsletterPage() {
  const { data: newsletters, unavailable } = await safeDbQuery(
    'newsletters',
    () =>
      prisma.newsletter.findMany({
        orderBy: { publishedAt: 'desc' },
      }),
    []
  );

  return (
    <div>
      <Navbar />
      <main className="bg-surface">
        <section className="relative overflow-hidden border-b border-[#e3dfd1] bg-gradient-to-br from-[#f8f5eb] via-[#f4faf8] to-[#edf5ff]">
          <div className="absolute -top-20 -right-10 h-64 w-64 rounded-full bg-[#0b6f77]/10 blur-3xl" aria-hidden="true" />
          <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-[#d2b257]/20 blur-3xl" aria-hidden="true" />
          <div className="relative mx-auto max-w-screen-2xl px-8 py-20 md:py-24">
            <span className="inline-flex rounded-full border border-[#d2b257] bg-[#fff4d4] px-4 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#7a5f17]">
              Archive
            </span>
            <h1 className="mt-4 font-headline text-5xl font-extrabold leading-tight tracking-tight text-[#1A1A1B] md:text-6xl">
              Newsletter Archive
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-700">
              Browse past updates, community milestones, and progress reports from Fregenet International.
            </p>
          </div>
        </section>

        <section className="px-8 py-16 md:py-20">
          <div className="mx-auto grid max-w-screen-2xl grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {newsletters.map((newsletter) => (
              <article key={newsletter.id} className="overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-4 md:p-5">
                <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-outline-variant/20">
                  <Image
                    src={newsletter.imageUrl}
                    alt={newsletter.title}
                    fill
                    sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="space-y-4 p-2 pt-5">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-secondary">
                    {new Date(newsletter.publishedAt).toLocaleDateString('en-US', {
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                  <h2 className="font-headline text-2xl font-extrabold leading-tight text-[#1A1A1B]">
                    <Link href={`/newsletter/${newsletter.slug}`} className="transition-colors hover:text-[#0b6f77]">
                      {newsletter.title}
                    </Link>
                  </h2>
                  <p className="text-secondary leading-relaxed [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical] overflow-hidden">
                    {newsletter.excerpt}
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    <Link
                      href={`/newsletter/${newsletter.slug}`}
                      className="inline-flex rounded-lg bg-[#0b6f77] px-4 py-2 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#095961]"
                    >
                      Read Update
                    </Link>
                    {newsletter.fileUrl ? (
                      <Link
                        href={newsletter.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex rounded-lg border border-[#0b6f77] px-4 py-2 text-sm font-bold uppercase tracking-wider text-[#0b6f77] transition-colors hover:bg-[#e9f6f7]"
                      >
                        View PDF
                      </Link>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </div>

          {newsletters.length === 0 ? (
            <div className="mx-auto mt-8 max-w-screen-2xl">
              <DatabaseUnavailableNotice
                title={unavailable ? 'Newsletter archive temporarily unavailable' : 'Archives Coming Soon'}
                message={
                  unavailable
                    ? 'Newsletter entries are temporarily unavailable while the site reconnects to the database.'
                    : 'We are preparing our first public newsletter editions. Check back soon for updates and impact stories.'
                }
                actionHref="/"
                actionLabel="Back to Mission"
              />
            </div>
          ) : null}
        </section>
      </main>
      <Footer />
    </div>
  );
}

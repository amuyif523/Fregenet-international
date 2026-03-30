import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

type PageProps = {
  params: Promise<{ slug: string }>;
};

function looksLikeHtml(value: string): boolean {
  return /<\/?[a-z][\s\S]*>/i.test(value);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const newsletter = await prisma.newsletter.findUnique({
    where: { slug },
    select: { title: true, excerpt: true },
  });

  if (!newsletter) {
    return {
      title: 'Newsletter Not Found',
      description: "Stay updated with Fregenet International's impact in Ethiopia.",
    };
  }

  return {
    title: newsletter.title,
    description: newsletter.excerpt,
    openGraph: {
      title: newsletter.title,
      description: newsletter.excerpt,
    },
  };
}

export default async function NewsletterDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const newsletter = await prisma.newsletter.findUnique({
    where: { slug },
  });

  if (!newsletter) {
    notFound();
  }

  const publishedLabel = new Date(newsletter.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div>
      <Navbar />
      <main className="bg-surface">
        <section className="border-b border-outline-variant/30 bg-gradient-to-br from-[#f8f5eb] via-[#f4faf8] to-[#edf5ff] px-8 py-16 md:py-20">
          <div className="mx-auto max-w-screen-xl space-y-5">
            <Link href="/newsletter" className="inline-flex text-xs font-bold uppercase tracking-[0.18em] text-[#0b6f77] hover:underline">
              &larr; Back to All Updates
            </Link>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-secondary">{publishedLabel}</p>
            <h1 className="max-w-4xl font-headline text-4xl font-extrabold leading-tight text-[#1A1A1B] md:text-6xl">
              {newsletter.title}
            </h1>
            <p className="max-w-3xl text-lg leading-relaxed text-slate-700">{newsletter.excerpt}</p>
          </div>
        </section>

        <section className="px-8 py-12 md:py-16">
          <div className="mx-auto max-w-screen-xl space-y-8">
            <div className="relative h-[320px] w-full overflow-hidden rounded-2xl border border-outline-variant/30 md:h-[460px]">
              <Image
                src={newsletter.imageUrl}
                alt={newsletter.title}
                fill
                sizes="(min-width: 1280px) 1200px, 100vw"
                className="object-cover"
              />
            </div>

            <article className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-8 md:p-10">
              {looksLikeHtml(newsletter.content) ? (
                <div
                  className="prose prose-slate max-w-none prose-headings:font-headline prose-a:text-[#0b6f77]"
                  dangerouslySetInnerHTML={{ __html: newsletter.content }}
                />
              ) : (
                <div className="space-y-4 whitespace-pre-line text-base leading-relaxed text-[#1A1A1B]">
                  {newsletter.content}
                </div>
              )}
            </article>

            {newsletter.fileUrl ? (
              <div>
                <Link
                  href={newsletter.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#0b6f77] px-5 py-3 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#095961]"
                >
                  <ShieldCheck className="h-4 w-4" />
                  Download PDF Version
                </Link>
              </div>
            ) : null}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

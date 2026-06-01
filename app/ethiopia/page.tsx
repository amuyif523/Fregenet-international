import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Ethiopia',
  description: 'A page about Ethiopia, the country and communities the foundation serves.',
};

const countryHighlights = [
  {
    title: 'Deep heritage',
    description: 'Ethiopia is one of Africa’s oldest civilizations, known for its cultural depth, languages, and enduring identity.',
  },
  {
    title: 'Strong communities',
    description: 'Families, neighborhoods, and local institutions form the backbone of daily life and mutual support.',
  },
  {
    title: 'Promise and progress',
    description: 'Across the country, education and child wellbeing remain central to long-term opportunity.',
  },
];

export default function EthiopiaPage() {
  return (
    <div className="bg-surface">
      <Navbar />
      <main>
        <section className="relative overflow-hidden border-b border-outline-variant/30 bg-gradient-to-br from-[#f5f0df] via-[#eef8f8] to-[#eef2ff] px-8 py-20 md:py-28">
          <div className="mx-auto grid max-w-screen-2xl gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7 space-y-6">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#0b6f77]">The Country We Serve</p>
              <h1 className="max-w-4xl font-headline text-5xl font-extrabold leading-tight text-[#1A1A1B] md:text-7xl">
                Ethiopia
              </h1>
              <p className="max-w-3xl text-xl leading-relaxed text-slate-700">
                Ethiopia is home to the communities, children, and families the foundation serves. It is a place of resilience, history, language, and shared responsibility,
                where education can change the trajectory of an entire household.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/" className="rounded-lg bg-[#0b6f77] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#095961]">
                  Back to Our Mission
                </Link>
                <Link href="/projects" className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-800 transition-colors hover:bg-slate-50">
                  Explore Our Projects
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="overflow-hidden rounded-3xl border border-outline-variant/30 bg-white shadow-[0_24px_80px_rgba(12,44,58,0.12)]">
                <div className="relative aspect-[4/5]">
                  <Image
                    src="/images/home-hero.jpg"
                    alt="Children learning in Ethiopia"
                    fill
                    sizes="(min-width: 1024px) 420px, 100vw"
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="space-y-3 p-6">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0b6f77]">A nation of strength</p>
                  <p className="text-sm leading-relaxed text-slate-600">
                    Our work is rooted in Ethiopia’s realities and aspirations, with programs designed to support children where they live and learn.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-8 py-16 md:py-20">
          <div className="mx-auto grid max-w-screen-2xl gap-8 lg:grid-cols-3">
            {countryHighlights.map((item) => (
              <article key={item.title} className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-8 shadow-sm">
                <div className="mb-4 h-1 w-14 rounded-full bg-[#c7a548]" />
                <h2 className="mb-3 font-headline text-2xl font-bold text-[#1A1A1B]">{item.title}</h2>
                <p className="leading-relaxed text-slate-600">{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="px-8 pb-20 md:pb-28">
          <div className="mx-auto grid max-w-screen-2xl gap-8 lg:grid-cols-12">
            <article className="rounded-3xl border border-[#d7e9ea] bg-gradient-to-br from-[#eef8f8] to-[#f9f5e7] p-8 md:p-10 lg:col-span-8">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#0b6f77]">Why Ethiopia matters</p>
              <h2 className="mb-6 max-w-2xl font-headline text-4xl font-extrabold leading-tight text-[#1A1A1B] md:text-5xl">
                The foundation’s mission is inseparable from the people and communities of Ethiopia.
              </h2>
              <div className="space-y-5 text-base leading-relaxed text-slate-700">
                <p>
                  Ethiopia matters because it is where the foundation’s work becomes real: in classrooms, kitchens, health checkups, and everyday moments of support.
                  The goal is not only to provide resources, but to strengthen the systems around children so they can grow with stability and hope.
                </p>
                <p>
                  By investing in early learning and holistic care, the foundation contributes to a future where more children can thrive within their own communities.
                </p>
              </div>
            </article>

            <aside className="rounded-3xl border border-outline-variant/30 bg-white p-8 lg:col-span-4">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#0b6f77]">At a glance</p>
              <ul className="space-y-4 text-slate-700">
                <li className="rounded-2xl bg-slate-50 px-4 py-3">Home to the children we serve</li>
                <li className="rounded-2xl bg-slate-50 px-4 py-3">Rich history and cultural identity</li>
                <li className="rounded-2xl bg-slate-50 px-4 py-3">A place where education builds opportunity</li>
              </ul>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

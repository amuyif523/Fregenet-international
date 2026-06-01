import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Fregenet Tafesse',
  description: 'Learn about Fregenet Tafesse, the woman whose legacy inspired the foundation.',
};

const legacyPoints = [
  {
    title: 'Compassion in practice',
    description: 'She believed dignity should be tangible: a warm meal, a safe classroom, and a chance to learn without fear.',
  },
  {
    title: 'Service to children',
    description: 'Her dream centered on children who were vulnerable, overlooked, or blocked from opportunity by poverty.',
  },
  {
    title: 'A vision bigger than one lifetime',
    description: 'The foundation exists to continue a calling that her family and community chose to preserve and expand.',
  },
];

export default function FregenetTafessePage() {
  return (
    <div className="bg-surface">
      <Navbar />
      <main>
        <section className="relative overflow-hidden border-b border-outline-variant/30 bg-gradient-to-br from-[#fff7e4] via-[#f6faf8] to-[#edf4ff] px-8 py-20 md:py-28">
          <div className="mx-auto grid max-w-screen-2xl gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7 space-y-6">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#0b6f77]">The Legacy Behind the Name</p>
              <h1 className="max-w-4xl font-headline text-5xl font-extrabold leading-tight text-[#1A1A1B] md:text-7xl">
                Fregenet Tafesse
              </h1>
              <p className="max-w-3xl text-xl leading-relaxed text-slate-700">
                Fregenet Tafesse is remembered as the woman whose spirit of care, responsibility, and belief in children became the moral center of the foundation.
                Her story is not just historical. It is the reason the organization exists and the standard by which its work is measured.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/" className="rounded-lg bg-[#0b6f77] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#095961]">
                  Back to Our Mission
                </Link>
                <Link href="/ethiopia" className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-800 transition-colors hover:bg-slate-50">
                  Read About Ethiopia
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="overflow-hidden rounded-3xl border border-outline-variant/30 bg-white shadow-[0_24px_80px_rgba(12,44,58,0.12)]">
                <div className="relative aspect-[4/5]">
                  <Image
                    src="/images/legacy.jpg"
                    alt="Legacy image representing Fregenet Tafesse"
                    fill
                    sizes="(min-width: 1024px) 420px, 100vw"
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="space-y-3 p-6">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0b6f77]">Remembered with purpose</p>
                  <p className="text-sm leading-relaxed text-slate-600">
                    Her legacy is carried forward through education, nutrition, and care that helps children learn with confidence and stability.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-8 py-16 md:py-20">
          <div className="mx-auto grid max-w-screen-2xl gap-8 lg:grid-cols-3">
            {legacyPoints.map((point) => (
              <article key={point.title} className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-8 shadow-sm">
                <div className="mb-4 h-1 w-14 rounded-full bg-[#0b6f77]" />
                <h2 className="mb-3 font-headline text-2xl font-bold text-[#1A1A1B]">{point.title}</h2>
                <p className="leading-relaxed text-slate-600">{point.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="px-8 pb-20 md:pb-28">
          <div className="mx-auto grid max-w-screen-2xl gap-8 lg:grid-cols-12">
            <article className="rounded-3xl border border-[#eadfb7] bg-gradient-to-br from-[#fff7df] to-[#faf7f0] p-8 md:p-10 lg:col-span-8">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#8a6d1f]">What she stood for</p>
              <h2 className="mb-6 max-w-2xl font-headline text-4xl font-extrabold leading-tight text-[#1A1A1B] md:text-5xl">
                A life anchored in generosity, responsibility, and practical love.
              </h2>
              <div className="space-y-5 text-base leading-relaxed text-slate-700">
                <p>
                  Fregenet Tafesse stood for the belief that every child deserves care that is immediate, consistent, and human. Her name became associated with a promise:
                  that education should not be reserved for the privileged, and that support should be built around real needs rather than abstract ideals.
                </p>
                <p>
                  The foundation carries that promise forward through schooling, nutrition, and long-term support systems that aim to remove barriers before they become permanent.
                </p>
              </div>
            </article>

            <aside className="rounded-3xl border border-outline-variant/30 bg-white p-8 lg:col-span-4">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#0b6f77]">Her legacy today</p>
              <ul className="space-y-4 text-slate-700">
                <li className="rounded-2xl bg-slate-50 px-4 py-3">A foundation named in her honor</li>
                <li className="rounded-2xl bg-slate-50 px-4 py-3">A mission centered on children and families</li>
                <li className="rounded-2xl bg-slate-50 px-4 py-3">A lasting commitment to service in Ethiopia</li>
              </ul>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

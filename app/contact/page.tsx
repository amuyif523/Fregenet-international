'use client';

import { useActionState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { sendInquiry } from '@/app/actions';

type InquiryState = {
  success: boolean;
  message: string;
};

const initialState: InquiryState = {
  success: false,
  message: '',
};

export default function ContactPage() {
  const [state, formAction, pending] = useActionState(sendInquiry, initialState);

  return (
    <div>
      <Navbar />
      <main className="bg-surface">
        <section className="max-w-screen-2xl mx-auto px-8 py-20 md:py-28 grid grid-cols-1 lg:grid-cols-12 gap-10">
          <header className="lg:col-span-5 space-y-6">
            <span className="inline-block text-primary font-bold tracking-[0.2em] uppercase text-xs">Contact & CRM Lite</span>
            <h1 className="font-headline text-5xl md:text-6xl font-extrabold text-[#1A1A1B] leading-tight">Let&apos;s Build Impact Together</h1>
            <p className="text-secondary text-lg leading-relaxed">
              Reach out for partnerships, volunteering, or general questions. Our team reviews every message and responds promptly.
            </p>
            <div className="bg-gradient-to-br from-[#f7f3ea] to-[#edf7f4] border border-[#d9d6cc] rounded-2xl p-6">
              <p className="text-xs uppercase tracking-widest font-bold text-secondary mb-2">Response Commitment</p>
              <p className="text-[#1A1A1B] font-semibold">Most inquiries are reviewed within 24 to 48 hours.</p>
            </div>
          </header>

          <section className="lg:col-span-7 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-8 md:p-10">
            <form action={formAction} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-[#1A1A1B]">Name</label>
                  <input
                    name="name"
                    required
                    className="w-full bg-white border border-outline-variant/30 rounded-lg px-4 py-3 outline-none focus:border-primary"
                    placeholder="Your full name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-[#1A1A1B]">Email</label>
                  <input
                    name="email"
                    type="email"
                    required
                    className="w-full bg-white border border-outline-variant/30 rounded-lg px-4 py-3 outline-none focus:border-primary"
                    placeholder="you@example.org"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-[#1A1A1B]">Subject</label>
                <select
                  name="subject"
                  defaultValue="General"
                  className="w-full bg-white border border-outline-variant/30 rounded-lg px-4 py-3 outline-none focus:border-primary"
                >
                  <option value="General">General</option>
                  <option value="Partnership">Partnership</option>
                  <option value="Volunteering">Volunteering</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-[#1A1A1B]">Message</label>
                <textarea
                  name="message"
                  required
                  rows={7}
                  className="w-full bg-white border border-outline-variant/30 rounded-lg px-4 py-3 outline-none focus:border-primary"
                  placeholder="Tell us how we can support your inquiry..."
                />
              </div>

              <input
                name="website"
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                aria-hidden="true"
              />

              {state.message ? (
                <p className={state.success ? 'text-green-700 text-sm font-semibold' : 'text-red-700 text-sm font-semibold'}>
                  {state.message}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={pending}
                className="w-full md:w-auto bg-[#1A1A1B] text-white font-bold uppercase text-sm tracking-wider px-8 py-4 rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-60"
              >
                {pending ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </section>
        </section>
      </main>
      <Footer />
    </div>
  );
}

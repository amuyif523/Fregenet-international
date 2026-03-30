'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { MailCheck, SendHorizonal } from 'lucide-react';
import { subscribeToNewsletter } from '@/app/actions';

type SubscribeState = {
  success: boolean;
  message: string;
};

const initialState: SubscribeState = {
  success: false,
  message: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-2 rounded-lg bg-[#0b6f77] px-6 py-3 font-bold uppercase tracking-[0.12em] text-white transition-all duration-300 hover:bg-[#095961] disabled:cursor-not-allowed disabled:opacity-60"
    >
      <SendHorizonal className="h-4 w-4" />
      {pending ? 'Subscribing...' : 'Join The Movement'}
    </button>
  );
}

export function NewsletterSignup() {
  const [state, formAction] = useActionState(
    async (_prevState: SubscribeState, formData: FormData) => subscribeToNewsletter(formData),
    initialState
  );

  return (
    <section className="relative overflow-hidden border-t border-b border-[#e3dfd1] bg-gradient-to-br from-[#f8f5eb] via-[#f4faf8] to-[#edf5ff]">
      <div className="absolute -top-20 -right-10 h-64 w-64 rounded-full bg-[#0b6f77]/10 blur-3xl" aria-hidden="true" />
      <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-[#d2b257]/20 blur-3xl" aria-hidden="true" />

      <div className="relative mx-auto grid max-w-screen-2xl grid-cols-1 gap-10 px-8 py-20 md:py-24 lg:grid-cols-12">
        <header className="lg:col-span-7 space-y-6">
          <span className="inline-flex rounded-full border border-[#d2b257] bg-[#fff4d4] px-4 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#7a5f17]">
            Join the Movement
          </span>
          <h2 className="font-headline text-5xl font-extrabold leading-tight tracking-tight text-[#1A1A1B] md:text-6xl">
            Follow The Story Behind Every Classroom, Meal, and Milestone
          </h2>
          <p className="max-w-2xl text-lg leading-relaxed text-slate-700">
            Subscribe for monthly updates from the Fregenet School, including student highlights, nutrition program progress,
            and transparent reports on how support turns into measurable impact in Ethiopia.
          </p>
          <div className="grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-[#d8e7e8] bg-white/80 p-4">
              <p className="text-2xl font-black text-[#0b6f77]">Monthly</p>
              <p className="mt-1 text-xs uppercase tracking-widest text-slate-600">Impact Briefings</p>
            </div>
            <div className="rounded-xl border border-[#eadfb7] bg-white/80 p-4">
              <p className="text-2xl font-black text-[#8a6d1f]">Direct</p>
              <p className="mt-1 text-xs uppercase tracking-widest text-slate-600">Project Stories</p>
            </div>
            <div className="rounded-xl border border-[#d8e7e8] bg-white/80 p-4">
              <p className="text-2xl font-black text-[#0b6f77]">Clear</p>
              <p className="mt-1 text-xs uppercase tracking-widest text-slate-600">Transparency Alerts</p>
            </div>
          </div>
        </header>

        <aside className="lg:col-span-5">
          <div className="rounded-2xl border border-[#d8d8d9] bg-white p-8 shadow-[0_16px_50px_-24px_rgba(11,111,119,0.45)]">
            <h3 className="font-headline text-2xl font-extrabold text-[#1A1A1B]">Get Monthly Impact Updates</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Join our newsletter for concise progress updates, stories from students and educators, and key milestones from our programs.
            </p>

            <form action={formAction} className="mt-6 space-y-4">
              <label className="block space-y-2">
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-600">Email Address</span>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="you@example.org"
                  className="w-full rounded-lg border border-[#d7d7d8] bg-white px-4 py-3 text-[#1A1A1B] outline-none transition-colors focus:border-[#0b6f77]"
                />
              </label>

              <SubmitButton />

              <div
                className={`grid overflow-hidden transition-all duration-500 ${state.success ? 'grid-rows-[1fr] opacity-100 translate-y-0' : 'grid-rows-[0fr] opacity-0 -translate-y-2'}`}
                aria-live="polite"
              >
                <div className="overflow-hidden">
                  <div className="mt-1 inline-flex items-center gap-2 rounded-md border border-[#d2b257] bg-[#fff7df] px-3 py-2 text-sm font-semibold text-[#684f00]">
                    <MailCheck className="h-4 w-4" />
                    Thank you. You are now subscribed to monthly impact updates.
                  </div>
                </div>
              </div>

              {state.message && !state.success ? (
                <p className="text-sm font-semibold text-red-700 transition-opacity duration-300">{state.message}</p>
              ) : null}
            </form>
          </div>
        </aside>
      </div>
    </section>
  );
}

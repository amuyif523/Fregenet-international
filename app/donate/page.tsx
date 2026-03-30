'use client';

import { useActionState, useEffect, useMemo, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { createCheckoutSession } from '@/app/actions';

type DonationActionState = {
  success: boolean;
  message: string;
};

const initialState: DonationActionState = {
  success: false,
  message: '',
};

const presetAmounts = [25, 100, 250];

export default function DonatePage() {
  const [selectedAmount, setSelectedAmount] = useState<number>(25);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [checkoutStatus, setCheckoutStatus] = useState<{ success: boolean; canceled: boolean }>({
    success: false,
    canceled: false,
  });
  const [state, formAction, pending] = useActionState(createCheckoutSession, initialState);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setCheckoutStatus({
      success: params.get('success') === '1',
      canceled: params.get('canceled') === '1',
    });
  }, []);

  const effectiveAmount = useMemo(() => {
    const custom = Number.parseFloat(customAmount);
    return Number.isFinite(custom) && custom > 0 ? custom : selectedAmount;
  }, [customAmount, selectedAmount]);

  return (
    <div>
      <Navbar minimal />
      <main className="max-w-screen-6xl mx-auto px-8 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <section className="lg:col-span-7 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-8 md:p-10 space-y-8">
          <header className="space-y-3">
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-secondary">International Donation Bridge</span>
            <h1 className="font-headline text-4xl md:text-5xl font-extrabold text-[#1A1A1B]">Fuel Ethiopia&apos;s Future</h1>
            <p className="text-secondary text-lg">Every contribution helps expand access to education, nutrition, and digital opportunity.</p>
          </header>

          <div className="rounded-2xl border border-[#dec381] bg-gradient-to-br from-[#fff7df] to-[#f8efd2] p-6 space-y-3">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8a6d1f]">Sponsor A Student</p>
            <p className="font-headline text-3xl font-extrabold text-[#1A1A1B]">15,000 ETB Per Year</p>
            <p className="text-secondary leading-relaxed">
              A full sponsorship of approximately <span className="font-bold text-[#1A1A1B]">$130-$250 USD</span> (depending on exchange rates)
              covers a student&apos;s annual essentials: nutritious meals, school uniform, and books.
            </p>
          </div>

          <form action={formAction} className="space-y-6">
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-widest text-[#1A1A1B]">Choose an Amount (USD)</label>
              <div className="grid grid-cols-3 gap-3">
                {presetAmounts.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => {
                      setSelectedAmount(amount);
                      setCustomAmount('');
                    }}
                    className={`px-4 py-3 rounded-lg border font-bold transition-colors ${effectiveAmount === amount && !customAmount ? 'bg-[#1A1A1B] text-white border-[#1A1A1B]' : 'bg-white text-[#1A1A1B] border-outline-variant/40 hover:border-[#1A1A1B]'}`}
                  >
                    {amount === 25 ? '$25/mo' : amount === 250 ? '$250/yr' : `$${amount}`}
                  </button>
                ))}
              </div>
              <p className="text-xs text-secondary">
                Suggested sponsorship increments: <span className="font-semibold text-[#1A1A1B]">$25/month partial support</span> or <span className="font-semibold text-[#1A1A1B]">$250/year full sponsorship</span>.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-[#1A1A1B]">Custom Amount (Optional)</label>
              <input
                type="number"
                min="1"
                step="0.01"
                value={customAmount}
                onChange={(event) => setCustomAmount(event.target.value)}
                className="w-full bg-white border border-outline-variant/30 rounded-lg px-4 py-3 outline-none focus:border-primary"
                placeholder="Enter custom amount"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-[#1A1A1B]">Email Address</label>
              <input
                type="email"
                name="donorEmail"
                required
                className="w-full bg-white border border-outline-variant/30 rounded-lg px-4 py-3 outline-none focus:border-primary"
                placeholder="you@example.org"
              />
            </div>

            <input type="hidden" name="amount" value={effectiveAmount} />

            <button
              type="submit"
              disabled={pending}
              className="w-full bg-[#1A1A1B] text-white font-bold uppercase text-sm tracking-wider py-4 rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-60"
            >
              {pending ? 'Redirecting...' : `Donate $${effectiveAmount.toFixed(2)} Now`}
            </button>

            {checkoutStatus.canceled ? <p className="text-amber-700 text-sm font-semibold">Checkout was canceled. You can try again anytime.</p> : null}
            {checkoutStatus.success ? <p className="text-green-700 text-sm font-semibold">Thank you. Your donation was submitted successfully.</p> : null}
            {state.message ? <p className="text-red-700 text-sm font-semibold">{state.message}</p> : null}
          </form>

          <section className="rounded-2xl border border-[#d9d6cc] bg-white p-6 space-y-3">
            <h2 className="font-headline text-2xl font-extrabold text-[#1A1A1B]">Beyond Funding: A Safety Net</h2>
            <p className="text-secondary leading-relaxed">
              Fregenet Foundation also serves as a trusted counselor and help-line for young people in crisis.
              We offer practical guidance, referrals, and compassionate support so students and families are not left alone during critical moments.
            </p>
          </section>
        </section>

        <aside className="lg:col-span-5 bg-gradient-to-br from-[#f7f3ea] via-[#edf7f4] to-[#f4f6f9] rounded-2xl border border-[#d9d6cc] p-8 md:p-10 space-y-6">
          <h2 className="font-headline text-3xl font-extrabold text-[#1A1A1B]">Impact Snapshot</h2>
          <p className="text-secondary">Your contribution directly powers classroom continuity and child-centered care.</p>

          <div className="space-y-4">
            <div className="bg-white/80 border border-[#e3dccf] rounded-xl p-4">
              <p className="text-sm uppercase tracking-widest text-secondary font-bold">$25/month (Partial)</p>
              <p className="text-[#1A1A1B] font-semibold">Keeps one student connected to meals and classroom essentials.</p>
            </div>
            <div className="bg-white/80 border border-[#e3dccf] rounded-xl p-4">
              <p className="text-sm uppercase tracking-widest text-secondary font-bold">15,000 ETB / $130-$250</p>
              <p className="text-[#1A1A1B] font-semibold">Covers full annual sponsorship: meals, uniform, and books for one child.</p>
            </div>
            <div className="bg-white/80 border border-[#e3dccf] rounded-xl p-4">
              <p className="text-sm uppercase tracking-widest text-secondary font-bold">$250/year (Full)</p>
              <p className="text-[#1A1A1B] font-semibold">Provides dependable, year-long support for a student&apos;s full learning journey.</p>
            </div>
          </div>
        </aside>
      </main>
      <Footer />
    </div>
  );
}

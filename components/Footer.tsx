"use client";

import Link from 'next/link';
import { useActionState } from 'react';
import { Globe, AtSign, Send } from 'lucide-react';
import { subscribeToNewsletter } from '@/app/actions';
import Image from 'next/image';

type SubscribeState = {
    success: boolean;
    message: string;
};

const initialState: SubscribeState = {
    success: false,
    message: '',
};

function SubscribeButton({ pending }: { pending: boolean }) {
    return (
        <button
            type="submit"
            disabled={pending}
            className="bg-primary text-white px-4 py-2 rounded-r hover:bg-primary-container transition-colors disabled:opacity-60"
            aria-label="Subscribe to newsletter"
        >
            <Send className="w-4 h-4 text-white" />
        </button>
    );
}

export const Footer = () => {
    const [state, formAction, pending] = useActionState(
        async (_prevState: SubscribeState, formData: FormData) => subscribeToNewsletter(formData),
        initialState
    );

    return (
    <footer className="bg-[#f3f3f3] dark:bg-slate-950 font-body leading-relaxed text-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-12 py-20 max-w-screen-2xl mx-auto">
            <div>
                <div className="mb-6">
                    <Image 
                        src="/images/fregenet_logo.png" 
                        alt="Fregenet Foundation" 
                        height={40} 
                        width={140}
                        className="h-10 w-auto object-contain dark:brightness-100"
                    />
                </div>
                <p className="text-slate-500 dark:text-slate-400 mb-6">Building a sustainable future through education, nutrition, and technological empowerment for the children of Ethiopia.</p>
                <div className="flex gap-4 text-secondary">
                    <a href="https://fregenetlehitsanat.org" target="_blank" rel="noopener noreferrer" aria-label="Fregenet Lehitsanat legacy website" className="hover:text-primary transition-colors">
                        <Globe className="w-5 h-5 cursor-pointer" />
                    </a>
                    <a href="https://fregenetfoundation.org" target="_blank" rel="noopener noreferrer" aria-label="Fregenet Foundation legacy website" className="hover:text-primary transition-colors">
                        <AtSign className="w-5 h-5 cursor-pointer" />
                    </a>
                </div>
            </div>
            <div>
                <h4 className="font-bold text-[#1A1A1B] dark:text-white mb-6 uppercase tracking-widest text-xs">Impact</h4>
                <ul className="space-y-4">
                    <li><Link href="/transparency" className="text-slate-500 dark:text-slate-400 hover:text-[#1A1A1B]">Annual Reports</Link></li>
                    <li><Link href="/transparency" className="text-slate-500 dark:text-slate-400 hover:text-[#1A1A1B]">Transparency</Link></li>
                    <li><Link href="/projects" className="text-slate-500 dark:text-slate-400 hover:text-[#1A1A1B]">Global Impact</Link></li>
                </ul>
            </div>
            <div>
                <h4 className="font-bold text-[#1A1A1B] dark:text-white mb-6 uppercase tracking-widest text-xs">About Us</h4>
                <ul className="space-y-4">
                    <li><a href="https://fregenetlehitsanat.org" target="_blank" rel="noopener noreferrer" className="text-slate-500 dark:text-slate-400 hover:text-[#1A1A1B]">fregenetlehitsanat.org</a></li>
                    <li><a href="https://fregenetfoundation.org" target="_blank" rel="noopener noreferrer" className="text-slate-500 dark:text-slate-400 hover:text-[#1A1A1B]">fregenetfoundation.org</a></li>
                    <li><Link href="/newsletter" className="text-slate-500 dark:text-slate-400 hover:text-[#1A1A1B]">Newsletter</Link></li>
                    <li><Link href="/contact" className="text-slate-500 dark:text-slate-400 hover:text-[#1A1A1B]">Contact Us</Link></li>
                    <li><a href="#" className="text-slate-500 dark:text-slate-400 hover:text-[#1A1A1B]">Privacy Policy</a></li>
                </ul>
            </div>
            <div>
                <h4 className="font-bold text-[#1A1A1B] dark:text-white mb-6 uppercase tracking-widest text-xs">Newsletter</h4>
                <p className="text-slate-500 dark:text-slate-400 mb-4">Stay updated on our impact.</p>
                <form action={formAction} className="space-y-3">
                    <div className="flex">
                        <input
                            className="bg-white border-none text-sm px-4 py-2 w-full focus:ring-1 focus:ring-primary rounded-l"
                            placeholder="Email address"
                            type="email"
                            name="email"
                            required
                        />
                        <SubscribeButton pending={pending} />
                    </div>
                    {state.success ? <p className="text-green-700 text-xs">Thank you for subscribing!</p> : null}
                    {state.message && !state.success ? <p className="text-red-700 text-xs">{state.message}</p> : null}
                </form>
            </div>
        </div>
        <div className="bg-slate-200 dark:bg-slate-800 h-px w-full"></div>
        <div className="py-8 text-center text-slate-500 dark:text-slate-400 text-xs">
            © 2024 Fregenet Foundation. All rights reserved.
        </div>
    </footer>
    );
};

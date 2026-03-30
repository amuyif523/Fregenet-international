import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { NewsletterSignup } from '@/components/NewsletterSignup';
import Image from 'next/image';
import { Quote, Utensils, Shirt, Pencil, BookOpen, Library, History, Users, GraduationCap } from 'lucide-react';

export default function Home() {
    return (
        <div>
            <Navbar />
            <main>
                {/* Hero Section */}
                <section className="relative min-h-[870px] flex items-center overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <img alt="Students learning" className="w-full h-full object-cover" src="/images/home-hero.jpg"/>
                        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-transparent" />
                        <div className="absolute inset-0 hero-gradient" />
                    </div>
                    <div className="relative z-10 max-w-screen-2xl mx-auto px-8 w-full">
                        <div className="max-w-3xl">
                            <h1 className="font-headline text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight tracking-tight mb-6">
                                Nurturing Tomorrow&apos;s Leaders from the Very Beginning
                            </h1>
                            <p className="text-xl md:text-2xl text-white/90 leading-relaxed mb-10 max-w-2xl">
                                Providing high-quality early childhood education and holistic care for young learners in Addis Ababa, Ethiopia.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <a href="/contact" className="px-8 py-4 bg-[#0b6f77] text-white font-bold rounded-lg shadow-sm hover:bg-[#095961] transition-all duration-300 flex items-center justify-center gap-2">
                                    Support Our Mission
                                </a>
                                <a href="#history" className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/60 text-white font-bold rounded-lg transition-all duration-300 hover:scale-[1.02] hover:bg-white/20 flex items-center justify-center">
                                    Learn Our Story
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Impact Ribbon */}
                <section className="bg-surface-container-high pb-20 pt-0">
                    <div className="max-w-screen-2xl mx-auto px-12">
                        <div className="-mt-20 relative z-20 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                            <div className="animate-fade-in-up rounded-2xl border border-outline-variant/30 bg-white/95 p-8 shadow-sm">
                                <History className="w-6 h-6 mx-auto mb-3 text-[#c7a548]" />
                                <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[#d8b25b]" />
                                <span className="text-5xl font-black text-[#0a5a61] font-headline">21+</span>
                                <span className="mt-2 block text-sm md:text-base font-bold text-[#1A1A1B] tracking-wide uppercase">Years of Service (Since 2004)</span>
                            </div>
                            <div className="animate-fade-in-up rounded-2xl border border-outline-variant/30 bg-white/95 p-8 shadow-sm" style={{ animationDelay: '100ms' }}>
                                <Users className="w-6 h-6 mx-auto mb-3 text-[#c7a548]" />
                                <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[#d8b25b]" />
                                <span className="text-5xl font-black text-[#0a5a61] font-headline">600+</span>
                                <span className="mt-2 block text-sm md:text-base font-bold text-[#1A1A1B] tracking-wide uppercase">Children Directly Served</span>
                            </div>
                            <div className="animate-fade-in-up rounded-2xl border border-outline-variant/30 bg-white/95 p-8 shadow-sm" style={{ animationDelay: '200ms' }}>
                                <GraduationCap className="w-6 h-6 mx-auto mb-3 text-[#c7a548]" />
                                <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[#d8b25b]" />
                                <span className="text-5xl font-black text-[#0a5a61] font-headline">1:30</span>
                                <span className="mt-2 block text-sm md:text-base font-bold text-[#1A1A1B] tracking-wide uppercase">Teacher-to-Student Ratio (vs 1:80 Local Average)</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Legacy + Holistic Model */}
                <section id="history" className="py-24 bg-surface">
                    <div className="max-w-screen-2xl mx-auto px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
                            <div className="lg:col-span-7 rounded-2xl border border-[#eadfb7] bg-gradient-to-br from-[#fff6df] to-[#fbf4e8] p-10 md:p-12 space-y-6">
                                <div className="flex items-center justify-between gap-4">
                                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8a6d1f]">Legacy of Love</p>
                                    <Quote className="w-6 h-6 text-[#c7a548]" />
                                </div>
                                <h2 className="font-headline text-4xl md:text-5xl font-extrabold text-[#1A1A1B] leading-tight">A Vision That Continued Beyond 2003</h2>
                                <p className="max-w-prose text-secondary leading-relaxed">
                                    In 2003, Fregenet Tafesse Woubshet passed away before she could fulfill her dream of returning to Ethiopia to serve vulnerable children.
                                    Her family and community chose to carry that calling forward, establishing Fregenet Foundation in 2004 as a living legacy of compassion,
                                    dignity, and practical support.
                                </p>
                                <div className="relative aspect-video overflow-hidden rounded-xl border border-[#e8dcb3] bg-white/70">
                                    <Image
                                        src="/images/legacy.jpg"
                                        alt="Fregenet Kidanewold Kassa, our inspiration"
                                        fill
                                        sizes="(min-width: 1024px) 58vw, 100vw"
                                        className="object-cover"
                                    />
                                </div>
                            </div>

                            <div className="lg:col-span-5 rounded-2xl border border-[#0b6f77]/40 bg-gradient-to-br from-[#0b6f77] to-[#0a5a61] p-10 md:p-12 space-y-5 text-white">
                                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#bce7ea]">Core Mission</p>
                                <h2 className="font-headline text-4xl md:text-5xl font-extrabold leading-tight">Building Strong Foundations for Lifelong Learning</h2>
                                <p className="max-w-prose text-white/90 leading-relaxed">
                                    Our mission is focused on high-quality Kindergarten education where consistent learning, nutrition,
                                    and care have the greatest long-term impact on a child&apos;s future.
                                </p>
                                <div className="pt-2 text-sm font-bold uppercase tracking-wider text-[#d7f1f2]">Kindergarten Focus | Early Childhood First</div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-10 md:p-12">
                            <div className="mb-10 text-center">
                                <h3 className="font-headline text-4xl md:text-5xl font-black text-[#1A1A1B] mb-4">The Holistic Model</h3>
                                <div className="mx-auto h-1 w-24 rounded-full bg-[#0b6f77]" />
                                <p className="text-secondary max-w-prose mx-auto leading-relaxed mt-4">
                                    Every enrolled child receives a complete package of free daily support so learning is never blocked by financial hardship.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-5">
                                <div className="rounded-2xl border border-outline-variant/30 bg-white px-5 py-6 text-center shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                                    <Utensils className="w-7 h-7 mx-auto mb-3 text-[#0b6f77]" />
                                    <p className="font-semibold text-[#1A1A1B]">Nutritious Meals</p>
                                    <p className="text-xs text-secondary mt-1">Nutritious Daily Nourishment</p>
                                </div>
                                <div className="rounded-2xl border border-outline-variant/30 bg-white px-5 py-6 text-center shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                                    <Shirt className="w-7 h-7 mx-auto mb-3 text-[#c7a548]" />
                                    <p className="font-semibold text-[#1A1A1B]">School Uniforms</p>
                                    <p className="text-xs text-secondary mt-1">Provided at no cost</p>
                                </div>
                                <div className="rounded-2xl border border-outline-variant/30 bg-white px-5 py-6 text-center shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                                    <Pencil className="w-7 h-7 mx-auto mb-3 text-[#0b6f77]" />
                                    <p className="font-semibold text-[#1A1A1B]">Stationery</p>
                                    <p className="text-xs text-secondary mt-1">Daily learning supplies</p>
                                </div>
                                <div className="rounded-2xl border border-outline-variant/30 bg-white px-5 py-6 text-center shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                                    <BookOpen className="w-7 h-7 mx-auto mb-3 text-[#c7a548]" />
                                    <p className="font-semibold text-[#1A1A1B]">Textbooks</p>
                                    <p className="text-xs text-secondary mt-1">Curriculum-ready materials</p>
                                </div>
                                <div className="rounded-2xl border border-outline-variant/30 bg-white px-5 py-6 text-center shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                                    <Library className="w-7 h-7 mx-auto mb-3 text-[#0b6f77]" />
                                    <p className="font-semibold text-[#1A1A1B]">School Library</p>
                                    <p className="text-xs text-secondary mt-1">Fostering a love for reading and learning from a young age.</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 rounded-2xl border border-[#d7e9ea] bg-gradient-to-r from-[#eef8f8] to-[#f7f2df] p-8 md:p-10">
                            <p className="max-w-4xl text-sm md:text-base font-semibold text-[#1A1A1B] leading-relaxed">
                                This professional, child-centered model allows teachers and families to focus on learning outcomes, emotional wellbeing,
                                and long-term community resilience through a strong Kindergarten foundation.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Newsletter Callout */}
                <section>
                    <NewsletterSignup />
                </section>
            </main>
            <Footer />
        </div>
    );
}

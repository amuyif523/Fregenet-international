"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import Image from "next/image";

export const Navbar = ({ minimal = false }: { minimal?: boolean }) => {
  const pathname = usePathname();
  const router = useRouter();
  
  const isActive = (path: string) => pathname === path;

  if (minimal) {
      return (
          <nav className="sticky top-0 w-full z-50 bg-slate-50/80 backdrop-blur-xl">
              <div className="flex justify-between items-center px-8 py-5 max-w-screen-2xl mx-auto">
                  <Link href="/">
                      <Image 
                          src="/images/fregenet_logo.png" 
                          alt="Fregenet Foundation" 
                          height={64} 
                          width={225}
                          className="h-12 md:h-16 w-auto object-contain"
                          priority
                      />
                  </Link>
                  <div className="hidden md:flex gap-8 items-center">
                      <Link href="/newsletter" className="text-slate-500 hover:text-[#1A1A1B] font-medium transition-all duration-300">Newsletter</Link>
                      <Link href="/projects" className="text-slate-500 hover:text-[#1A1A1B] font-medium transition-all duration-300">Back to Projects</Link>
                      <span className="bg-slate-100 h-px w-8 hidden lg:block"></span>
                      <div className="flex items-center gap-2 text-primary font-bold">
                          <Lock className="w-4 h-4" />
                          <span className="text-sm uppercase tracking-wider">Secure Checkout</span>
                      </div>
                  </div>
              </div>
          </nav>
      );
  }

  return (
      <nav className="sticky top-0 w-full z-50 bg-slate-50/80 backdrop-blur-xl font-headline antialiased tracking-tight border-b border-slate-100">
          <div className="flex justify-between items-center px-8 py-5 max-w-screen-2xl mx-auto">
              <Link href="/">
                  <Image 
                      src="/images/fregenet_logo.png" 
                      alt="Fregenet Foundation" 
                      height={64} 
                      width={225}
                      className="h-12 md:h-16 w-auto object-contain dark:brightness-100"
                      priority
                  />
              </Link>
              <div className="hidden md:flex items-center space-x-8">
                  <Link href="/" className={`${isActive('/') ? 'text-[#98001b] font-bold border-b-2 border-[#98001b] pb-1' : 'text-slate-500 font-medium hover:text-[#be1e2d]'} transition-all duration-300`}>Our Mission</Link>
                  <Link href="/projects" className={`${isActive('/projects') ? 'text-[#98001b] font-bold border-b-2 border-[#98001b] pb-1' : 'text-slate-500 font-medium hover:text-[#be1e2d]'} transition-all duration-300`}>Projects</Link>
                  <Link href="/governance" className={`${isActive('/governance') ? 'text-[#98001b] font-bold border-b-2 border-[#98001b] pb-1' : 'text-slate-500 font-medium hover:text-[#be1e2d]'} transition-all duration-300`}>Governance</Link>
                  <Link href="/transparency" className={`${isActive('/transparency') ? 'text-[#98001b] font-bold border-b-2 border-[#98001b] pb-1' : 'text-slate-500 font-medium hover:text-[#be1e2d]'} transition-all duration-300`}>Transparency</Link>
                  <Link href="/newsletter" className={`${isActive('/newsletter') ? 'text-[#98001b] font-bold border-b-2 border-[#98001b] pb-1' : 'text-slate-500 font-medium hover:text-[#be1e2d]'} transition-all duration-300`}>Newsletter</Link>
                  <Link href="/contact" className={`${isActive('/contact') ? 'text-[#98001b] font-bold border-b-2 border-[#98001b] pb-1' : 'text-slate-500 font-medium hover:text-[#be1e2d]'} transition-all duration-300`}>Contact</Link>
              </div>
              <button onClick={() => router.push('/donate')} className="bg-primary text-on-primary px-6 py-2 rounded-lg font-bold text-xs tracking-widest uppercase hover:bg-primary-container transition-all duration-300 transform hover:-translate-y-1">
                  Donate
              </button>
          </div>
      </nav>
  );
};

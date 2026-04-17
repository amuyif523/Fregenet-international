import { ShieldCheck, LogOut } from 'lucide-react'
import { logoutAdmin } from '@/app/actions'
import { AdminNav } from './AdminNav'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-surface-container-lowest border-r border-outline-variant/30 flex flex-col">
        <div className="p-8 border-b border-outline-variant/30">
          <div className="flex items-center gap-3">
             <ShieldCheck className="text-primary w-8 h-8"/>
             <span className="font-headline font-bold text-[#1A1A1B]">Console</span>
          </div>
        </div>
        
        <AdminNav />
        
        <div className="p-6 border-t border-outline-variant/30">
          <form action={logoutAdmin}>
            <button className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-error hover:bg-error-container/20 transition-all font-bold">
               <LogOut className="w-5 h-5"/> Sign Out
            </button>
          </form>
        </div>
      </aside>
      
      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}

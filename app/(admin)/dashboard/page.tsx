import { Users, FileText, Activity } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  return (
    <div className="space-y-12">
      <div>
        <h1 className="font-headline text-4xl font-extrabold text-[#1A1A1B] mb-2">Management Console</h1>
        <p className="text-secondary">Welcome back. Select an action below to manage the platform.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Link href="/dashboard/board" className="bg-surface-container-lowest p-8 rounded-xl editorial-shadow hover:-translate-y-2 transition-transform group border border-transparent hover:border-outline-variant/30">
          <Users className="w-10 h-10 text-primary mb-6" />
          <h3 className="font-bold text-xl text-[#1A1A1B] mb-2">Manage Board</h3>
          <p className="text-secondary text-sm group-hover:text-[#1A1A1B] transition-colors">Update bios, roles, and portrait assets for the leadership team.</p>
        </Link>
        
        <Link href="/dashboard/reports" className="bg-surface-container-lowest p-8 rounded-xl editorial-shadow hover:-translate-y-2 transition-transform group border border-transparent hover:border-outline-variant/30">
          <FileText className="w-10 h-10 text-primary mb-6" />
          <h3 className="font-bold text-xl text-[#1A1A1B] mb-2">Upload Report</h3>
          <p className="text-secondary text-sm group-hover:text-[#1A1A1B] transition-colors">Publish annual reports directly to the public transparency portal.</p>
        </Link>

        <Link href="/dashboard/projects" className="bg-surface-container-lowest p-8 rounded-xl editorial-shadow hover:-translate-y-2 transition-transform group border border-transparent hover:border-outline-variant/30">
          <Activity className="w-10 h-10 text-primary mb-6" />
          <h3 className="font-bold text-xl text-[#1A1A1B] mb-2">Project Updates</h3>
          <p className="text-secondary text-sm group-hover:text-[#1A1A1B] transition-colors">Create or modify impact initiatives showcasing field progress.</p>
        </Link>
      </div>
    </div>
  )
}

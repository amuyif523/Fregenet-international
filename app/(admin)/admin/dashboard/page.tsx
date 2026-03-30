import Link from 'next/link';
import { Users, BriefcaseBusiness, FolderKanban, FileText } from 'lucide-react';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const [subscriberCount, boardMemberCount, projectCount, reportCount] = await Promise.all([
    prisma.subscriber.count(),
    prisma.boardMember.count(),
    prisma.project.count(),
    prisma.report.count(),
  ]);

  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <h1 className="font-headline text-4xl font-extrabold text-[#1A1A1B]">Welcome to Fregenet Admin</h1>
        <p className="text-secondary">Use the sidebar to manage core platform records.</p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <Link href="/admin/subscribers" className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30 hover:-translate-y-1 transition-transform">
          <Users className="w-8 h-8 text-primary mb-4" />
          <p className="text-sm uppercase tracking-wider text-secondary">Subscribers</p>
          <p className="text-3xl font-bold text-[#1A1A1B]">{subscriberCount}</p>
        </Link>

        <Link href="/admin/board" className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30 hover:-translate-y-1 transition-transform">
          <BriefcaseBusiness className="w-8 h-8 text-primary mb-4" />
          <p className="text-sm uppercase tracking-wider text-secondary">Board Members</p>
          <p className="text-3xl font-bold text-[#1A1A1B]">{boardMemberCount}</p>
        </Link>

        <Link href="/admin/projects" className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30 hover:-translate-y-1 transition-transform">
          <FolderKanban className="w-8 h-8 text-primary mb-4" />
          <p className="text-sm uppercase tracking-wider text-secondary">Projects</p>
          <p className="text-3xl font-bold text-[#1A1A1B]">{projectCount}</p>
        </Link>

        <Link href="/admin/reports" className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30 hover:-translate-y-1 transition-transform">
          <FileText className="w-8 h-8 text-primary mb-4" />
          <p className="text-sm uppercase tracking-wider text-secondary">Reports</p>
          <p className="text-3xl font-bold text-[#1A1A1B]">{reportCount}</p>
        </Link>
      </section>
    </div>
  );
}

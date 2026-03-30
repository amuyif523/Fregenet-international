import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import BoardMembersTable from './_components/BoardMembersTable';

export const dynamic = 'force-dynamic';

export default async function BoardMembersPage() {
  const boardMembers = await prisma.boardMember.findMany({
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
  });

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-2">
          <h1 className="font-headline text-4xl font-extrabold text-[#1A1A1B]">Board Members</h1>
          <p className="text-secondary">Create, edit, and order governance profiles shown on the public site.</p>
        </div>
        <Link
          href="/admin/board/new"
          className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-[#1A1A1B] text-white font-semibold hover:bg-slate-800 transition-colors"
        >
          Add Board Member
        </Link>
      </header>

      <BoardMembersTable boardMembers={boardMembers} />
    </div>
  );
}

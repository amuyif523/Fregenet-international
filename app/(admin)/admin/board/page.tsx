import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { DatabaseUnavailableNotice } from '@/components/DatabaseUnavailableNotice';
import { safeDbQuery } from '@/lib/safe-db';
import BoardMembersTable from './_components/BoardMembersTable';

export const dynamic = 'force-dynamic';

export default async function BoardMembersPage() {
  const { data: boardMembers, unavailable } = await safeDbQuery(
    'admin board members',
    () =>
      prisma.boardMember.findMany({
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      }),
    []
  );

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

      {unavailable ? (
        <DatabaseUnavailableNotice message="Board member records are temporarily unavailable while the admin panel reconnects to the database." />
      ) : (
        <BoardMembersTable boardMembers={boardMembers} />
      )}
    </div>
  );
}

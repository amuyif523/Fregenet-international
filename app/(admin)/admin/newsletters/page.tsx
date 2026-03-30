import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { DatabaseUnavailableNotice } from '@/components/DatabaseUnavailableNotice';
import { safeDbQuery } from '@/lib/safe-db';
import NewslettersTable from './_components/NewslettersTable';

export const dynamic = 'force-dynamic';

export default async function AdminNewslettersPage() {
  const { data: newsletters, unavailable } = await safeDbQuery(
    'admin newsletters',
    () =>
      prisma.newsletter.findMany({
        orderBy: { publishedAt: 'desc' },
      }),
    []
  );

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <h1 className="font-headline text-4xl font-extrabold text-[#1A1A1B]">Newsletters</h1>
          <p className="text-secondary">Manage published newsletter editions shown on the public archive page.</p>
        </div>
        <Link
          href="/admin/newsletters/new"
          className="inline-flex items-center justify-center rounded-lg bg-[#0b6f77] px-5 py-3 font-semibold text-white transition-colors hover:bg-[#095961]"
        >
          New Newsletter
        </Link>
      </header>

      {unavailable ? (
        <DatabaseUnavailableNotice message="Newsletter records are temporarily unavailable while the admin panel reconnects to the database." />
      ) : (
        <NewslettersTable newsletters={newsletters} />
      )}
    </div>
  );
}

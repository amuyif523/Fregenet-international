import { prisma } from '@/lib/prisma';
import { DatabaseUnavailableNotice } from '@/components/DatabaseUnavailableNotice';
import { safeDbQuery } from '@/lib/safe-db';
import SubscribersTable from './_components/SubscribersTable';

export const dynamic = 'force-dynamic';

export default async function SubscribersPage() {
  const { data: subscribers, unavailable } = await safeDbQuery(
    'subscribers',
    () =>
      prisma.subscriber.findMany({
        orderBy: { createdAt: 'desc' },
      }),
    []
  );

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="font-headline text-4xl font-extrabold text-[#1A1A1B]">Newsletter Subscribers</h1>
        <p className="text-secondary">Manage valid signups and remove spam or invalid emails.</p>
      </header>

      {unavailable ? (
        <DatabaseUnavailableNotice message="Subscriber records are temporarily unavailable while the admin panel reconnects to the database." />
      ) : (
        <SubscribersTable subscribers={subscribers} />
      )}
    </div>
  );
}

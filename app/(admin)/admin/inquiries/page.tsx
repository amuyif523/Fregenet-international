import { prisma } from '@/lib/prisma';
import InquiriesMailbox from './_components/InquiriesMailbox';

export const dynamic = 'force-dynamic';

export default async function InquiriesPage() {
  const inquiries = await prisma.contactInquiry.findMany({
    orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
  });

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="font-headline text-4xl font-extrabold text-[#1A1A1B]">Inbox</h1>
        <p className="text-secondary">Review incoming inquiries from partners, volunteers, and supporters.</p>
      </header>

      <InquiriesMailbox inquiries={inquiries} />
    </div>
  );
}

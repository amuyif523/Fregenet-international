import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { DatabaseUnavailableNotice } from '@/components/DatabaseUnavailableNotice';
import { safeDbQuery } from '@/lib/safe-db';
import BoardMemberForm from '../_components/BoardMemberForm';

export const dynamic = 'force-dynamic';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditBoardMemberPage({ params }: PageProps) {
  const { id } = await params;

  const { data: member, unavailable } = await safeDbQuery(
    `board member ${id}`,
    () =>
      prisma.boardMember.findUnique({
        where: { id },
      }),
    null
  );

  if (unavailable) {
    return (
      <DatabaseUnavailableNotice message="This board member could not be loaded because the admin panel is temporarily disconnected from the database." />
    );
  }

  if (!member) {
    notFound();
  }

  return (
    <BoardMemberForm
      title="Edit Board Member"
      description="Update role details, profile narrative, and display order."
      initialData={{
        id: member.id,
        name: member.name,
        role: member.role,
        bio: member.bio ?? '',
        imageUrl: member.imageUrl,
        sortOrder: member.sortOrder,
      }}
    />
  );
}

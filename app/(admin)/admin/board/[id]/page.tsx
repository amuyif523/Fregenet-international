import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import BoardMemberForm from '../_components/BoardMemberForm';

export const dynamic = 'force-dynamic';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditBoardMemberPage({ params }: PageProps) {
  const { id } = await params;

  const member = await prisma.boardMember.findUnique({
    where: { id },
  });

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

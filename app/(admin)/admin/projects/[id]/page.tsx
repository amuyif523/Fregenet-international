import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ProjectForm from '../_components/ProjectForm';

export const dynamic = 'force-dynamic';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProjectPage({ params }: PageProps) {
  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id },
  });

  if (!project) {
    notFound();
  }

  return (
    <ProjectForm
      title="Edit Project"
      description="Update project details and publish settings for the public projects page."
      redirectOnSuccess="/admin/projects"
      initialData={{
        id: project.id,
        title: project.title,
        description: project.description,
        category: project.category,
        imageUrl: project.imageUrl,
        status: project.status as 'active' | 'draft',
        sortOrder: project.sortOrder,
      }}
    />
  );
}

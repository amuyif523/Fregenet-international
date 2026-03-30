import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { DatabaseUnavailableNotice } from '@/components/DatabaseUnavailableNotice';
import { safeDbQuery } from '@/lib/safe-db';
import ProjectForm from '../_components/ProjectForm';

export const dynamic = 'force-dynamic';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProjectPage({ params }: PageProps) {
  const { id } = await params;

  const { data: project, unavailable } = await safeDbQuery(
    `project ${id}`,
    () =>
      prisma.project.findUnique({
        where: { id },
      }),
    null
  );

  if (unavailable) {
    return (
      <DatabaseUnavailableNotice message="This project could not be loaded because the admin panel is temporarily disconnected from the database." />
    );
  }

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

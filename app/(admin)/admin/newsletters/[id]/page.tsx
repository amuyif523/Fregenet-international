import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import NewsletterForm from '../_components/NewsletterForm';

export const dynamic = 'force-dynamic';

function toInputDateTime(value: Date) {
  const offset = value.getTimezoneOffset() * 60 * 1000;
  return new Date(value.getTime() - offset).toISOString().slice(0, 16);
}

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditNewsletterPage({ params }: PageProps) {
  const { id } = await params;

  const newsletter = await prisma.newsletter.findUnique({
    where: { id },
  });

  if (!newsletter) {
    notFound();
  }

  return (
    <NewsletterForm
      title="Edit Newsletter"
      description="Update newsletter copy, cover image, and archive assets."
      redirectOnSuccess="/admin/newsletters"
      initialData={{
        id: newsletter.id,
        title: newsletter.title,
        slug: newsletter.slug,
        publishedAt: toInputDateTime(newsletter.publishedAt),
        excerpt: newsletter.excerpt,
        content: newsletter.content,
        imageUrl: newsletter.imageUrl,
        fileUrl: newsletter.fileUrl ?? '',
      }}
    />
  );
}

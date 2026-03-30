import NewsletterForm from '../_components/NewsletterForm';

function nowForInput() {
  const date = new Date();
  const offset = date.getTimezoneOffset() * 60 * 1000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

export default function NewNewsletterPage() {
  return (
    <NewsletterForm
      title="New Newsletter"
      description="Create and publish a new newsletter edition for the public archive."
      redirectOnSuccess="/admin/newsletters"
      initialData={{
        title: '',
        slug: '',
        publishedAt: nowForInput(),
        excerpt: '',
        content: '',
        imageUrl: '',
        fileUrl: '',
      }}
    />
  );
}

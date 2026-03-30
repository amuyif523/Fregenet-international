'use client';

import Link from 'next/link';
import { useActionState, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { upsertNewsletter } from '@/app/actions';

type NewsletterFormData = {
  id?: string;
  title: string;
  slug: string;
  publishedAt: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  fileUrl: string;
};

type NewsletterFormProps = {
  title: string;
  description: string;
  initialData: NewsletterFormData;
  redirectOnSuccess?: string;
};

type ActionState = {
  success: boolean;
  message: string;
};

const initialActionState: ActionState = {
  success: false,
  message: '',
};

export default function NewsletterForm({ title, description, initialData, redirectOnSuccess }: NewsletterFormProps) {
  const [state, formAction, pending] = useActionState(upsertNewsletter, initialActionState);
  const [previewUrl, setPreviewUrl] = useState(initialData.imageUrl);
  const [pdfName, setPdfName] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (state.success && redirectOnSuccess) {
      router.push(redirectOnSuccess);
    }
  }, [state.success, redirectOnSuccess, router]);

  useEffect(() => {
    return () => {
      if (previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleCoverChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setPreviewUrl(initialData.imageUrl);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl((current) => {
      if (current.startsWith('blob:')) {
        URL.revokeObjectURL(current);
      }
      return objectUrl;
    });
  };

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="font-headline text-4xl font-extrabold text-[#1A1A1B]">{title}</h1>
        <p className="text-secondary">{description}</p>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <form
          action={formAction}
          className="space-y-6 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-8 lg:col-span-8"
        >
          <input type="hidden" name="id" value={initialData.id ?? ''} />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-[#1A1A1B]">Title</label>
              <input
                name="title"
                defaultValue={initialData.title}
                required
                className="w-full rounded-lg border border-outline-variant/30 bg-white px-4 py-3 outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-[#1A1A1B]">Slug</label>
              <input
                name="slug"
                defaultValue={initialData.slug}
                placeholder="monthly-impact-january-2026"
                required
                className="w-full rounded-lg border border-outline-variant/30 bg-white px-4 py-3 outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-[#1A1A1B]">Published Date</label>
            <input
              name="publishedAt"
              type="datetime-local"
              defaultValue={initialData.publishedAt}
              required
              className="w-full rounded-lg border border-outline-variant/30 bg-white px-4 py-3 outline-none focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-[#1A1A1B]">Excerpt</label>
            <textarea
              name="excerpt"
              rows={4}
              defaultValue={initialData.excerpt}
              required
              className="w-full rounded-lg border border-outline-variant/30 bg-white px-4 py-3 outline-none focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-[#1A1A1B]">Content (HTML/Text)</label>
            <textarea
              name="content"
              rows={10}
              defaultValue={initialData.content}
              required
              className="w-full rounded-lg border border-outline-variant/30 bg-white px-4 py-3 font-mono text-sm outline-none focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-[#1A1A1B]">Cover Image Upload</label>
              <input
                name="image"
                type="file"
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                onChange={handleCoverChange}
                className="w-full rounded-lg border border-outline-variant/30 bg-white px-4 py-3 outline-none focus:border-primary"
              />
              <p className="text-xs text-secondary">
                Upload JPG, PNG, or WEBP cover image. {initialData.id ? 'Leave empty to keep current cover.' : 'Required for new newsletters.'}
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-[#1A1A1B]">Optional PDF Upload</label>
              <input
                name="pdfFile"
                type="file"
                accept=".pdf,application/pdf"
                onChange={(event) => setPdfName(event.target.files?.[0]?.name || '')}
                className="w-full rounded-lg border border-outline-variant/30 bg-white px-4 py-3 outline-none focus:border-primary"
              />
              {pdfName ? <p className="text-xs text-secondary">Selected: {pdfName}</p> : null}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-[#1A1A1B]">Optional PDF URL</label>
            <input
              name="fileUrl"
              type="url"
              defaultValue={initialData.fileUrl}
              placeholder="https://example.org/newsletter-january-2026.pdf"
              className="w-full rounded-lg border border-outline-variant/30 bg-white px-4 py-3 outline-none focus:border-primary"
            />
          </div>

          {state.message ? (
            <p className={state.success ? 'text-sm font-semibold text-green-700' : 'text-sm font-semibold text-red-700'}>{state.message}</p>
          ) : null}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={pending}
              className="rounded-lg bg-[#0b6f77] px-5 py-3 font-semibold text-white transition-colors hover:bg-[#095961] disabled:opacity-60"
            >
              {pending ? 'Saving...' : 'Save Newsletter'}
            </button>
            <Link href="/admin/newsletters" className="rounded-lg bg-slate-100 px-5 py-3 font-semibold text-slate-800 transition-colors hover:bg-slate-200">
              Back to Newsletters
            </Link>
          </div>
        </form>

        <aside className="h-fit rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-6 lg:col-span-4">
          <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-[#1A1A1B]">Cover Preview</h2>
          <img
            src={previewUrl || '/images/board/placeholder.svg'}
            alt="Newsletter preview"
            className="mb-4 aspect-[4/5] w-full rounded-lg object-cover"
          />
          <p className="text-sm text-secondary">Preview the newsletter cover before publishing.</p>
        </aside>
      </div>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { useActionState, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { upsertProject } from '@/app/actions';

type ProjectFormData = {
  id?: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  status: 'active' | 'draft';
  sortOrder: number;
};

type ProjectFormProps = {
  title: string;
  description: string;
  initialData: ProjectFormData;
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

export default function ProjectForm({ title, description, initialData, redirectOnSuccess }: ProjectFormProps) {
  const [state, formAction, pending] = useActionState(upsertProject, initialActionState);
  const [previewUrl, setPreviewUrl] = useState(initialData.imageUrl);
  const [imageSource, setImageSource] = useState<'upload' | 'url'>('url');
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

  const handleImageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      if (previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <form action={formAction} className="lg:col-span-8 bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-8 space-y-6">
          <input type="hidden" name="id" value={initialData.id ?? ''} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-[#1A1A1B]">Title</label>
              <input
                name="title"
                defaultValue={initialData.title}
                required
                className="w-full bg-white border border-outline-variant/30 rounded-lg px-4 py-3 outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-[#1A1A1B]">Category</label>
              <input
                name="category"
                defaultValue={initialData.category}
                required
                className="w-full bg-white border border-outline-variant/30 rounded-lg px-4 py-3 outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-[#1A1A1B]">Description</label>
            <textarea
              name="description"
              defaultValue={initialData.description}
              rows={7}
              required
              className="w-full bg-white border border-outline-variant/30 rounded-lg px-4 py-3 outline-none focus:border-primary"
            />
          </div>

          <div className="space-y-4">
            <label className="text-xs font-bold uppercase tracking-widest text-[#1A1A1B]">Project Image Source</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setImageSource('upload')}
                className={`px-4 py-3 rounded-lg border text-sm font-bold uppercase tracking-wider transition-colors ${imageSource === 'upload' ? 'bg-[#0b6f77] text-white border-[#0b6f77]' : 'bg-white text-[#1A1A1B] border-outline-variant/40 hover:border-[#0b6f77]'}`}
              >
                Upload File
              </button>
              <button
                type="button"
                onClick={() => setImageSource('url')}
                className={`px-4 py-3 rounded-lg border text-sm font-bold uppercase tracking-wider transition-colors ${imageSource === 'url' ? 'bg-[#0b6f77] text-white border-[#0b6f77]' : 'bg-white text-[#1A1A1B] border-outline-variant/40 hover:border-[#0b6f77]'}`}
              >
                External URL
              </button>
            </div>

            {imageSource === 'upload' ? (
              <div className="space-y-2">
                <input
                  name="imageFile"
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                  onChange={handleImageFileChange}
                  className="w-full bg-white border border-outline-variant/30 rounded-lg px-4 py-3 outline-none focus:border-primary"
                />
                <p className="text-xs text-secondary">Upload JPG, PNG, or WEBP. Leave empty to keep the current image when editing.</p>
              </div>
            ) : (
              <div className="space-y-2">
                <input
                  name="imageUrl"
                  type="text"
                  defaultValue={initialData.imageUrl}
                  onChange={(event) => setPreviewUrl(event.target.value)}
                  className="w-full bg-white border border-outline-variant/30 rounded-lg px-4 py-3 outline-none focus:border-primary"
                  placeholder="https://example.com/project-image.jpg"
                />
                <p className="text-xs text-secondary">Paste an external image URL. If left blank during edit, current image is retained.</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-[#1A1A1B]">Status</label>
              <select
                name="status"
                defaultValue={initialData.status}
                className="w-full bg-white border border-outline-variant/30 rounded-lg px-4 py-3 outline-none focus:border-primary"
              >
                <option value="active">Active</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-[#1A1A1B]">Sort Order</label>
              <input
                name="sortOrder"
                type="number"
                defaultValue={initialData.sortOrder}
                required
                className="w-full bg-white border border-outline-variant/30 rounded-lg px-4 py-3 outline-none focus:border-primary"
              />
            </div>
          </div>

          {state.message ? (
            <p className={state.success ? 'text-green-700 text-sm font-semibold' : 'text-red-700 text-sm font-semibold'}>
              {state.message}
            </p>
          ) : null}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={pending}
              className="px-5 py-3 rounded-lg bg-[#0b6f77] text-white font-semibold hover:bg-[#095961] transition-colors disabled:opacity-60"
            >
              {pending ? 'Saving...' : 'Save Project'}
            </button>
            <Link href="/admin/projects" className="px-5 py-3 rounded-lg bg-slate-100 text-slate-800 font-semibold hover:bg-slate-200 transition-colors">
              Back to Projects
            </Link>
          </div>
        </form>

        <aside className="lg:col-span-4 bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-6 h-fit">
          <h2 className="font-bold text-[#1A1A1B] mb-4 uppercase tracking-widest text-xs">Preview</h2>
          <img
            src={previewUrl || 'https://ui-avatars.com/api/?name=Project&size=800&background=random'}
            alt="Project preview"
            className="w-full aspect-[4/5] object-cover rounded-lg mb-4"
          />
          <p className="text-secondary text-sm">Preview the featured image before publishing the project.</p>
        </aside>
      </div>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { useActionState, useEffect, useMemo, useState } from 'react';
import { upsertBoardMember } from '@/app/actions';

type BoardMemberFormData = {
  id?: string;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  sortOrder: number;
};

type BoardMemberFormProps = {
  title: string;
  description: string;
  initialData: BoardMemberFormData;
};

type ActionState = {
  success: boolean;
  message: string;
};

const initialActionState: ActionState = {
  success: false,
  message: '',
};

export default function BoardMemberForm({ title, description, initialData }: BoardMemberFormProps) {
  const [state, formAction, pending] = useActionState(upsertBoardMember, initialActionState);
  const [previewUrl, setPreviewUrl] = useState(initialData.imageUrl);

  const fallbackAvatar = useMemo(() => {
    const source = initialData.name || 'Board Member';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(source)}&background=random`;
  }, [initialData.name]);

  useEffect(() => {
    return () => {
      if (previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <form action={formAction} className="lg:col-span-8 bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-8 space-y-6">
          <input type="hidden" name="id" value={initialData.id ?? ''} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-[#1A1A1B]">Name</label>
              <input
                name="name"
                defaultValue={initialData.name}
                required
                className="w-full bg-white border border-outline-variant/30 rounded-lg px-4 py-3 outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-[#1A1A1B]">Role</label>
              <input
                name="role"
                defaultValue={initialData.role}
                required
                className="w-full bg-white border border-outline-variant/30 rounded-lg px-4 py-3 outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-[#1A1A1B]">Bio</label>
            <textarea
              name="bio"
              defaultValue={initialData.bio}
              rows={6}
              className="w-full bg-white border border-outline-variant/30 rounded-lg px-4 py-3 outline-none focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-[#1A1A1B]">Photo Upload</label>
              <input
                name="image"
                type="file"
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                className="w-full bg-white border border-outline-variant/30 rounded-lg px-4 py-3 outline-none focus:border-primary"
              />
              <p className="text-xs text-secondary">
                Accepted formats: JPG, PNG, WEBP. Max size: 5MB. {initialData.id ? 'Leave empty to keep current image.' : ''}
              </p>
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
              className="px-5 py-3 rounded-lg bg-[#1A1A1B] text-white font-semibold hover:bg-slate-800 transition-colors disabled:opacity-60"
            >
              {pending ? 'Saving...' : 'Save Member'}
            </button>
            <Link href="/admin/board" className="px-5 py-3 rounded-lg bg-slate-100 text-slate-800 font-semibold hover:bg-slate-200 transition-colors">
              Back to Board List
            </Link>
          </div>
        </form>

        <aside className="lg:col-span-4 bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-6 h-fit">
          <h2 className="font-bold text-[#1A1A1B] mb-4 uppercase tracking-widest text-xs">Preview</h2>
          <img
            src={previewUrl || fallbackAvatar}
            alt="Board member preview"
            className="w-full aspect-[4/5] object-cover rounded-lg mb-4"
          />
          <p className="text-secondary text-sm">This is how the headshot will appear before saving.</p>
        </aside>
      </div>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import type { Newsletter } from '@/prisma/generated/client';
import { deleteNewsletter } from '@/app/actions';

type DeleteState = {
  success: boolean;
  message: string;
};

const initialDeleteState: DeleteState = {
  success: false,
  message: '',
};

function DeleteButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-red-50 px-4 py-2 font-semibold text-red-700 transition-colors hover:bg-red-100 disabled:opacity-60"
    >
      {pending ? 'Deleting...' : 'Delete'}
    </button>
  );
}

export default function NewslettersTable({ newsletters }: { newsletters: Newsletter[] }) {
  const [state, formAction] = useActionState(deleteNewsletter, initialDeleteState);
  const [showToast, setShowToast] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!state.message) return;

    setShowToast(true);
    if (state.success) {
      router.refresh();
    }

    const timer = setTimeout(() => setShowToast(false), 2500);
    return () => clearTimeout(timer);
  }, [state, router]);

  return (
    <>
      {showToast ? (
        <div className={`fixed right-6 top-6 z-50 rounded-lg border px-4 py-3 text-sm font-semibold ${state.success ? 'border-green-200 bg-green-50 text-green-700' : 'border-red-200 bg-red-50 text-red-700'}`}>
          {state.message}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-lowest">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-container">
            <tr>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-secondary">Title</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-secondary">Slug</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-secondary">Published</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-secondary">Actions</th>
            </tr>
          </thead>
          <tbody>
            {newsletters.map((newsletter) => (
              <tr key={newsletter.id} className="border-t border-outline-variant/20">
                <td className="px-6 py-4 font-semibold text-[#1A1A1B]">{newsletter.title}</td>
                <td className="px-6 py-4 text-secondary">/{newsletter.slug}</td>
                <td className="px-6 py-4 text-secondary">
                  {new Date(newsletter.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/admin/newsletters/${newsletter.id}`}
                      className="rounded-lg bg-slate-100 px-4 py-2 font-semibold text-slate-800 transition-colors hover:bg-slate-200"
                    >
                      Edit
                    </Link>
                    <form action={formAction}>
                      <input type="hidden" name="id" value={newsletter.id} />
                      <DeleteButton />
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {newsletters.length === 0 ? <div className="px-6 py-8 text-secondary">No newsletters yet. Publish your first update.</div> : null}
      </div>
    </>
  );
}

'use client';

import { useActionState, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFormStatus } from 'react-dom';
import type { ContactInquiry } from '@/prisma/generated/client';
import { deleteInquiry, markInquiryAsRead } from '@/app/actions';

type ActionState = {
  success: boolean;
  message: string;
};

const initialActionState: ActionState = {
  success: false,
  message: '',
};

function ActionButton({ label, pendingLabel, variant }: { label: string; pendingLabel: string; variant: 'read' | 'delete' }) {
  const { pending } = useFormStatus();
  const className =
    variant === 'read'
      ? 'px-3 py-2 rounded-lg bg-teal-50 text-teal-800 font-semibold hover:bg-teal-100 transition-colors disabled:opacity-60'
      : 'px-3 py-2 rounded-lg bg-amber-50 text-amber-800 font-semibold hover:bg-amber-100 transition-colors disabled:opacity-60';

  return (
    <button type="submit" disabled={pending} className={className}>
      {pending ? pendingLabel : label}
    </button>
  );
}

export default function InquiriesMailbox({ inquiries }: { inquiries: ContactInquiry[] }) {
  const [readState, readAction] = useActionState(markInquiryAsRead, initialActionState);
  const [deleteState, deleteAction] = useActionState(deleteInquiry, initialActionState);
  const [toast, setToast] = useState<ActionState | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!readState.message) return;
    setToast(readState);
    if (readState.success) router.refresh();
  }, [readState, router]);

  useEffect(() => {
    if (!deleteState.message) return;
    setToast(deleteState);
    if (deleteState.success) router.refresh();
  }, [deleteState, router]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(timer);
  }, [toast]);

  return (
    <>
      {toast ? (
        <div className={`fixed top-6 right-6 z-50 px-4 py-3 rounded-lg border text-sm font-semibold ${toast.success ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
          {toast.message}
        </div>
      ) : null}

      <div className="space-y-4">
        {inquiries.map((inquiry) => (
          <article key={inquiry.id} className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 space-y-4">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="space-y-1">
                <p className="font-bold text-[#1A1A1B] text-lg">{inquiry.subject}</p>
                <p className="text-secondary text-sm">From {inquiry.name} • {inquiry.email}</p>
                <p className="text-secondary text-xs">{new Date(inquiry.createdAt).toLocaleString()}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${inquiry.status === 'new' ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-teal-100 text-teal-900 border border-teal-300'}`}>
                {inquiry.status}
              </span>
            </div>

            <p className="text-[#1A1A1B] leading-relaxed whitespace-pre-wrap">{inquiry.message}</p>

            <div className="flex items-center gap-3">
              {inquiry.status === 'new' ? (
                <form action={readAction}>
                  <input type="hidden" name="id" value={inquiry.id} />
                  <ActionButton label="Mark as Read" pendingLabel="Marking..." variant="read" />
                </form>
              ) : null}

              <form action={deleteAction}>
                <input type="hidden" name="id" value={inquiry.id} />
                <ActionButton label="Delete" pendingLabel="Deleting..." variant="delete" />
              </form>
            </div>
          </article>
        ))}

        {inquiries.length === 0 ? (
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-8 text-secondary">
            No inquiries yet. New messages will appear here.
          </div>
        ) : null}
      </div>
    </>
  );
}

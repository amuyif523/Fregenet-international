'use client';

import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import type { Subscriber } from '@/prisma/generated/client';
import { deleteSubscriber } from '@/app/actions';

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
      className="px-4 py-2 rounded-lg bg-red-50 text-red-700 font-semibold hover:bg-red-100 transition-colors disabled:opacity-60"
    >
      {pending ? 'Deleting...' : 'Delete'}
    </button>
  );
}

export default function SubscribersTable({ subscribers }: { subscribers: Subscriber[] }) {
  const [state, formAction] = useActionState(deleteSubscriber, initialDeleteState);
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
        <div className={`fixed top-6 right-6 z-50 px-4 py-3 rounded-lg border text-sm font-semibold ${state.success ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
          {state.message}
        </div>
      ) : null}

      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-container">
            <tr>
              <th className="px-6 py-4 font-bold uppercase tracking-widest text-xs text-secondary">Email</th>
              <th className="px-6 py-4 font-bold uppercase tracking-widest text-xs text-secondary">Date Joined</th>
              <th className="px-6 py-4 font-bold uppercase tracking-widest text-xs text-secondary">Action</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.map((subscriber) => (
              <tr key={subscriber.id} className="border-t border-outline-variant/20">
                <td className="px-6 py-4 text-[#1A1A1B] font-medium">{subscriber.email}</td>
                <td className="px-6 py-4 text-secondary">{new Date(subscriber.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <form action={formAction}>
                    <input type="hidden" name="id" value={subscriber.id} />
                    <DeleteButton />
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {subscribers.length === 0 ? <div className="px-6 py-8 text-secondary">No subscribers yet.</div> : null}
      </div>
    </>
  );
}

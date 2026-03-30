'use client';

import Link from 'next/link';
import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import type { BoardMember } from '@/prisma/generated/client';
import { deleteBoardMember } from '@/app/actions';

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
    <button type="submit" disabled={pending} className="px-4 py-2 rounded-lg bg-red-50 text-red-700 font-semibold hover:bg-red-100 transition-colors disabled:opacity-60">
      {pending ? 'Deleting...' : 'Delete'}
    </button>
  );
}

export default function BoardMembersTable({ boardMembers }: { boardMembers: BoardMember[] }) {
  const [state, formAction] = useActionState(deleteBoardMember, initialDeleteState);
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
              <th className="px-6 py-4 font-bold uppercase tracking-widest text-xs text-secondary">Member</th>
              <th className="px-6 py-4 font-bold uppercase tracking-widest text-xs text-secondary">Role</th>
              <th className="px-6 py-4 font-bold uppercase tracking-widest text-xs text-secondary">Sort Order</th>
              <th className="px-6 py-4 font-bold uppercase tracking-widest text-xs text-secondary">Actions</th>
            </tr>
          </thead>
          <tbody>
            {boardMembers.map((member) => (
              <tr key={member.id} className="border-t border-outline-variant/20">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={member.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}`}
                      alt={member.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <span className="font-semibold text-[#1A1A1B]">{member.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-secondary">{member.role}</td>
                <td className="px-6 py-4 text-secondary">{member.sortOrder}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Link href={`/admin/board/${member.id}`} className="px-4 py-2 rounded-lg bg-slate-100 text-slate-800 font-semibold hover:bg-slate-200 transition-colors">
                      Edit
                    </Link>
                    <form action={formAction}>
                      <input type="hidden" name="id" value={member.id} />
                      <DeleteButton />
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {boardMembers.length === 0 ? <div className="px-6 py-8 text-secondary">No board members found. Add your first profile.</div> : null}
      </div>
    </>
  );
}

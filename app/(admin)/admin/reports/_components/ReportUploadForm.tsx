'use client';

import Link from 'next/link';
import { useActionState, useState } from 'react';
import { uploadReport } from '@/app/actions';

type ReportActionState = {
  success: boolean;
  message: string;
};

const initialState: ReportActionState = {
  success: false,
  message: '',
};

export default function ReportUploadForm() {
  const [state, formAction, pending] = useActionState(uploadReport, initialState);
  const [fileName, setFileName] = useState('');

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="font-headline text-4xl font-extrabold text-[#1A1A1B]">Upload Report</h1>
        <p className="text-secondary">Add annual reports and audit files to the public transparency portal.</p>
      </header>

      <form action={formAction} className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-8 space-y-6 max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-[#1A1A1B]">Title</label>
            <input
              name="title"
              required
              className="w-full bg-white border border-outline-variant/30 rounded-lg px-4 py-3 outline-none focus:border-primary"
              placeholder="2026 Financial Audit"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-[#1A1A1B]">Year</label>
            <input
              name="year"
              type="number"
              min="2000"
              max="2100"
              defaultValue={new Date().getFullYear()}
              required
              className="w-full bg-white border border-outline-variant/30 rounded-lg px-4 py-3 outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-[#1A1A1B]">Category</label>
            <input
              name="category"
              required
              className="w-full bg-white border border-outline-variant/30 rounded-lg px-4 py-3 outline-none focus:border-primary"
              placeholder="Annual Report"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-[#1A1A1B]">IFRS 18 Compliance</label>
            <label className="flex items-center gap-3 bg-white border border-outline-variant/30 rounded-lg px-4 py-3">
              <input type="checkbox" name="isVerified" className="h-4 w-4" />
              <span className="text-secondary text-sm font-medium">Mark as IFRS 18 Certified</span>
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-[#1A1A1B]">PDF File</label>
          <label className="flex items-center justify-between gap-4 bg-white border border-outline-variant/30 rounded-lg px-4 py-3 cursor-pointer">
            <span className="text-secondary text-sm truncate">{fileName || 'Choose PDF file...'}</span>
            <span className="px-3 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold uppercase tracking-wider">Browse</span>
            <input
              type="file"
              name="file"
              accept=".pdf,application/pdf"
              required
              className="hidden"
              onChange={(event) => setFileName(event.target.files?.[0]?.name || '')}
            />
          </label>
        </div>

        {state.message ? (
          <p className={state.success ? 'text-green-700 text-sm font-semibold' : 'text-red-700 text-sm font-semibold'}>{state.message}</p>
        ) : null}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={pending}
            className="px-5 py-3 rounded-lg bg-[#1A1A1B] text-white font-semibold hover:bg-slate-800 transition-colors disabled:opacity-60"
          >
            {pending ? 'Uploading...' : 'Save Report'}
          </button>
          <Link href="/admin/reports" className="px-5 py-3 rounded-lg bg-slate-100 text-slate-800 font-semibold hover:bg-slate-200 transition-colors">
            Back to Reports
          </Link>
        </div>
      </form>
    </div>
  );
}

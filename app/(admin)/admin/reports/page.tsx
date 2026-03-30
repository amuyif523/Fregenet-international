import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { DatabaseUnavailableNotice } from '@/components/DatabaseUnavailableNotice';
import { safeDbQuery } from '@/lib/safe-db';

export const dynamic = 'force-dynamic';

export default async function ReportsPage() {
  const { data: reports, unavailable } = await safeDbQuery(
    'admin reports',
    () =>
      prisma.report.findMany({
        orderBy: [{ year: 'desc' }, { createdAt: 'desc' }],
      }),
    []
  );

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-2">
          <h1 className="font-headline text-4xl font-extrabold text-[#1A1A1B]">Transparency Vault</h1>
          <p className="text-secondary">Manage annual reports, audits, and IFRS 18 verification status.</p>
        </div>
        <Link
          href="/admin/reports/new"
          className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-[#1A1A1B] text-white font-semibold hover:bg-slate-800 transition-colors"
        >
          Upload New Report
        </Link>
      </header>

      {unavailable ? (
        <DatabaseUnavailableNotice message="Report records are temporarily unavailable while the admin panel reconnects to the database." />
      ) : (
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-container">
            <tr>
              <th className="px-6 py-4 font-bold uppercase tracking-widest text-xs text-secondary">Title</th>
              <th className="px-6 py-4 font-bold uppercase tracking-widest text-xs text-secondary">Year</th>
              <th className="px-6 py-4 font-bold uppercase tracking-widest text-xs text-secondary">Category</th>
              <th className="px-6 py-4 font-bold uppercase tracking-widest text-xs text-secondary">Status</th>
              <th className="px-6 py-4 font-bold uppercase tracking-widest text-xs text-secondary">File</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id} className="border-t border-outline-variant/20">
                <td className="px-6 py-4 text-[#1A1A1B] font-semibold">{report.title}</td>
                <td className="px-6 py-4 text-secondary">{report.year}</td>
                <td className="px-6 py-4 text-secondary">{report.category}</td>
                <td className="px-6 py-4">
                  {report.isVerified ? (
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-teal-100 text-teal-900 border border-amber-300">
                      IFRS 18 Certified
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                      Pending Review
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <a href={report.fileUrl} target="_blank" rel="noopener noreferrer" className="text-primary font-semibold hover:underline">
                    View PDF
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {reports.length === 0 ? <div className="px-6 py-8 text-secondary">No reports uploaded yet.</div> : null}
      </div>
      )}
    </div>
  );
}

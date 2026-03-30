import Link from 'next/link';
import { Pencil } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { DatabaseUnavailableNotice } from '@/components/DatabaseUnavailableNotice';
import { deleteProject } from '@/app/actions';
import { safeDbQuery } from '@/lib/safe-db';

export const dynamic = 'force-dynamic';

export default async function AdminProjectsPage() {
  const { data: projects, unavailable } = await safeDbQuery(
    'admin projects',
    () =>
      prisma.project.findMany({
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      }),
    []
  );

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-2">
          <h1 className="font-headline text-4xl font-extrabold text-[#1A1A1B]">Projects</h1>
          <p className="text-secondary">Manage project stories, categories, publication status, and order.</p>
        </div>
        <Link
          href="/admin/projects/new"
          className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-[#0b6f77] text-white font-semibold hover:bg-[#095961] transition-colors"
        >
          Add Project
        </Link>
      </header>

      {unavailable ? (
        <DatabaseUnavailableNotice message="Project records are temporarily unavailable while the admin panel reconnects to the database." />
      ) : (
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-container">
            <tr>
              <th className="px-6 py-4 font-bold uppercase tracking-widest text-xs text-secondary">Title</th>
              <th className="px-6 py-4 font-bold uppercase tracking-widest text-xs text-secondary">Category</th>
              <th className="px-6 py-4 font-bold uppercase tracking-widest text-xs text-secondary">Status</th>
              <th className="px-6 py-4 font-bold uppercase tracking-widest text-xs text-secondary">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id} className="border-t border-outline-variant/20">
                <td className="px-6 py-4 text-[#1A1A1B] font-semibold">{project.title}</td>
                <td className="px-6 py-4 text-secondary">{project.category}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${project.status === 'active' ? 'bg-teal-100 text-teal-900 border border-teal-300' : 'bg-amber-100 text-amber-900 border border-amber-300'}`}>
                    {project.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/admin/projects/${project.id}`}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 text-blue-800 font-semibold hover:bg-blue-100 transition-colors"
                    >
                      <Pencil className="h-4 w-4" />
                      Edit
                    </Link>

                    <form action={deleteProject}>
                      <input type="hidden" name="id" value={project.id} />
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-lg bg-red-50 text-red-700 font-semibold hover:bg-red-100 transition-colors"
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {projects.length === 0 ? (
          <div className="px-6 py-8 text-secondary">No projects yet. Add your first project.</div>
        ) : null}
      </div>
      )}
    </div>
  );
}

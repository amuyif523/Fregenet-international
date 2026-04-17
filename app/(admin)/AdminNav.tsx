'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, FileText } from 'lucide-react';

const navItems = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/subscribers', icon: FileText, label: 'Subscribers' },
  { href: '/admin/board', icon: FileText, label: 'Board Members' },
  { href: '/admin/projects', icon: FileText, label: 'Projects' },
  { href: '/admin/reports', icon: FileText, label: 'Reports' },
  { href: '/admin/newsletters', icon: FileText, label: 'Newsletters' },
  { href: '/admin/inquiries', icon: FileText, label: 'Inquiries' },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex-1 p-6 space-y-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        // Check if the current pathname is exactly the item's href OR a sub-path of it
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              isActive
                ? 'bg-primary-container text-primary font-bold'
                : 'text-secondary hover:bg-surface-container'
            }`}
          >
            <Icon className="w-5 h-5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

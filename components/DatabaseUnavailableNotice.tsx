import Link from 'next/link';

type DatabaseUnavailableNoticeProps = {
  title?: string;
  message: string;
  actionHref?: string;
  actionLabel?: string;
};

export function DatabaseUnavailableNotice({
  title = 'Database connection unavailable',
  message,
  actionHref,
  actionLabel,
}: DatabaseUnavailableNoticeProps) {
  return (
    <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest px-6 py-8 text-secondary">
      <p className="font-headline text-2xl font-extrabold text-[#1A1A1B]">{title}</p>
      <p className="mt-3 max-w-2xl leading-relaxed">{message}</p>
      {actionHref && actionLabel ? (
        <Link
          href={actionHref}
          className="mt-6 inline-flex rounded-lg bg-[#0b6f77] px-5 py-3 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#095961]"
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}

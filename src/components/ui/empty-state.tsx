import React from "react";
import Link from "next/link";
import { Button } from "./button";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
}

export function EmptyState({ icon, title, description, actionHref, actionLabel }: EmptyStateProps) {
  return (
    <div className="text-center py-12 px-4 rounded-xl border border-dashed border-slate-300 bg-slate-50/50">
      {icon && <div className="mx-auto flex h-12 w-12 items-center justify-center text-slate-400 mb-3">{icon}</div>}
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">{description}</p>
      {actionHref && actionLabel && (
        <div className="mt-6">
          <Link href={actionHref}>
            <Button variant="primary">{actionLabel}</Button>
          </Link>
        </div>
      )}
    </div>
  );
}

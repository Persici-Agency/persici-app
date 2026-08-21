import type { DashboardHeaderProps } from '../../types';

export type { DashboardHeaderProps };

export function DashboardHeader({ dict }: DashboardHeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-black/10 bg-white px-6">
      <h1 className="text-lg font-semibold text-foreground">
        {dict.dashboard.title}
      </h1>
      {/* Auth controls and profile will be placed here */}
    </header>
  );
}

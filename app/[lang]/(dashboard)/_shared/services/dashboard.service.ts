export interface SidebarLink {
  key: string;
  href: string;
  icon: string;
}

export const sidebarLinks: SidebarLink[] = [
  { key: 'overview', href: '/dashboard', icon: '📊' },
  { key: 'content', href: '/dashboard/content', icon: '📝' },
  { key: 'projects', href: '/dashboard/projects', icon: '💼' },
  { key: 'services', href: '/dashboard/services', icon: '⚙️' },
  { key: 'media', href: '/dashboard/media', icon: '🖼️' },
  { key: 'settings', href: '/dashboard/settings', icon: '🔧' },
];

export function getSidebarLinks(): SidebarLink[] {
  return sidebarLinks;
}

import type {
  SidebarLink,
  DashboardMetric,
  DashboardProject,
  DashboardService,
  DashboardActivity,
} from './types';

export const sidebarLinks: SidebarLink[] = [
  { id: '1', key: 'overview', href: '/dashboard', icon: '📊', order: 1 },
  { id: '2', key: 'content', href: '/dashboard/content', icon: '📝', order: 2 },
  { id: '3', key: 'projects', href: '/dashboard/projects', icon: '💼', order: 3 },
  { id: '4', key: 'services', href: '/dashboard/services', icon: '⚙️', order: 4 },
  { id: '5', key: 'media', href: '/dashboard/media', icon: '🖼️', order: 5 },
  { id: '6', key: 'settings', href: '/dashboard/settings', icon: '🔧', order: 6 },
];

export const dashboardOverviewMetrics: DashboardMetric[] = [
  { id: '1', key: 'total_revenue', title: 'Managed Ad Spend', value: '$2.4M', change: '+24%', trend: 'up', timeframe: 'Last 30 Days' },
  { id: '2', key: 'active_clients', title: 'Active Scale Partners', value: '48', change: '+6', trend: 'up', timeframe: 'Current' },
  { id: '3', key: 'avg_roas', title: 'Average Blended ROAS', value: '3.6x', change: '+18%', trend: 'up', timeframe: 'Across All Brands' },
  { id: '4', key: 'pipeline_leads', title: 'Discovery Call Requests', value: '142', change: '+32%', trend: 'up', timeframe: 'This Month' },
];

export const dashboardRecentActivities: DashboardActivity[] = [
  { id: '1', type: 'lead', description: 'New Discovery Call request from Lumina Beauty', timestamp: '10 minutes ago', user: 'System' },
  { id: '2', type: 'project', description: 'Nordic Living headless Shopify sprint completed', timestamp: '2 hours ago', user: 'Shopify Team' },
  { id: '3', type: 'client', description: 'Meta scaling campaign budget increased for Silk & Stone', timestamp: '5 hours ago', user: 'Media Buying' },
];

export const dashboardProjectsSummary: DashboardProject[] = [
  { id: '1', title: 'Nordic Living', client: 'Nordic Retail Group', category: 'Home & Living', status: 'live', revenueGrowth: '+210%' },
  { id: '2', title: 'Lumina Beauty', client: 'Lumina Cosmetics', category: 'Cosmetics', status: 'live', revenueGrowth: '+140%' },
  { id: '3', title: 'Urban Pulse', client: 'Urban Pulse Apparel', category: 'Apparel', status: 'in-progress', revenueGrowth: 'Scaling' },
];

export const dashboardServicesSummary: DashboardService[] = [
  { id: '1', title: 'Paid Social & Performance', slug: 'paid-social', status: 'active', activeClientsCount: 36 },
  { id: '2', title: 'Google Ads & Search', slug: 'google-ads', status: 'active', activeClientsCount: 28 },
  { id: '3', title: 'Shopify Plus & CRO', slug: 'shopify-cro', status: 'active', activeClientsCount: 22 },
  { id: '4', title: 'Growth Strategy', slug: 'strategy', status: 'active', activeClientsCount: 15 },
];

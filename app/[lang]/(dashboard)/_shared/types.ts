import type { Dictionary } from '@dictionaries';

export interface BaseMongoDocument {
  _id?: string;
  id?: string | number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface SidebarLink extends BaseMongoDocument {
  key: string;
  href: string;
  icon: string;
  order?: number;
  badge?: string | number;
}

export interface DashboardMetric extends BaseMongoDocument {
  key: string;
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  timeframe?: string;
}

export interface DashboardProject extends BaseMongoDocument {
  title: string;
  client: string;
  category: string;
  status: 'planning' | 'in-progress' | 'live' | 'archived';
  revenueGrowth?: string;
  leadsCount?: number;
}

export interface DashboardService extends BaseMongoDocument {
  title: string;
  slug: string;
  status: 'active' | 'inactive';
  activeClientsCount: number;
}

export interface DashboardActivity extends BaseMongoDocument {
  type: 'project' | 'lead' | 'client' | 'system';
  description: string;
  timestamp: string;
  user?: string;
}

export interface DashboardUser extends BaseMongoDocument {
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  avatar?: string;
}

export type DashboardSidebarProps = {
  lang: string;
  dict: Dictionary;
};

export type DashboardHeaderProps = {
  lang?: string;
  dict: Dictionary;
};

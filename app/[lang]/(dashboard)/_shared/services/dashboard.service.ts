import type {
  SidebarLink,
  DashboardMetric,
  DashboardProject,
  DashboardService,
  DashboardActivity,
} from '../types';
import {
  sidebarLinks,
  dashboardOverviewMetrics,
  dashboardRecentActivities,
  dashboardProjectsSummary,
  dashboardServicesSummary,
} from '../data';

export type { SidebarLink, DashboardMetric, DashboardProject, DashboardService, DashboardActivity };
export { sidebarLinks, dashboardOverviewMetrics, dashboardRecentActivities, dashboardProjectsSummary, dashboardServicesSummary };

export function getSidebarLinks(): SidebarLink[] {
  return sidebarLinks;
}

export function getDashboardMetrics(): DashboardMetric[] {
  return dashboardOverviewMetrics;
}

export function getDashboardActivities(): DashboardActivity[] {
  return dashboardRecentActivities;
}

export function getDashboardProjects(): DashboardProject[] {
  return dashboardProjectsSummary;
}

export function getDashboardServices(): DashboardService[] {
  return dashboardServicesSummary;
}

import { NextResponse } from 'next/server';
import { getDb, COLLECTIONS } from '@/lib/mongodb';
import {
  dashboardOverviewMetrics,
  dashboardRecentActivities,
  dashboardProjectsSummary,
  dashboardServicesSummary,
} from '@dashboard-shared/data';

export const runtime = 'nodejs';

/**
 * GET /api/dashboard/overview
 * Returns aggregated statistics, recent leads, and activities for the dashboard overview.
 */
export async function GET() {
  try {
    const db = await getDb();

    if (!db) {
      return NextResponse.json({
        success: true,
        connected: false,
        metrics: dashboardOverviewMetrics,
        recentActivities: dashboardRecentActivities,
        projects: dashboardProjectsSummary,
        services: dashboardServicesSummary,
        counts: {
          projects: dashboardProjectsSummary.length,
          services: dashboardServicesSummary.length,
          inquiries: 0,
          discoveryLeads: 0,
          media: 0,
        },
        note: 'Using default dashboard data. Connect MongoDB to view live database statistics.',
      });
    }

    // Run parallel counts
    const [
      projectsCount,
      servicesCount,
      inquiriesCount,
      discoveryCount,
      mediaCount,
      recentInquiries,
      recentLeads,
    ] = await Promise.all([
      db.collection(COLLECTIONS.PROJECTS).countDocuments().catch(() => 0),
      db.collection(COLLECTIONS.SERVICES).countDocuments().catch(() => 0),
      db.collection(COLLECTIONS.CONTACT_SUBMISSIONS).countDocuments().catch(() => 0),
      db.collection(COLLECTIONS.DISCOVERY_SUBMISSIONS).countDocuments().catch(() => 0),
      db.collection(COLLECTIONS.MEDIA).countDocuments().catch(() => 0),
      db
        .collection(COLLECTIONS.CONTACT_SUBMISSIONS)
        .find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .toArray()
        .catch(() => []),
      db
        .collection(COLLECTIONS.DISCOVERY_SUBMISSIONS)
        .find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .toArray()
        .catch(() => []),
    ]);

    const liveMetrics = [
      {
        key: 'active-projects',
        title: 'Active Projects',
        value: projectsCount || dashboardProjectsSummary.length,
        trend: 'up' as const,
        change: '+15%',
      },
      {
        key: 'growth-services',
        title: 'Active Services',
        value: servicesCount || dashboardServicesSummary.length,
        trend: 'neutral' as const,
      },
      {
        key: 'discovery-leads',
        title: 'Discovery Leads',
        value: discoveryCount,
        trend: 'up' as const,
        change: '+32%',
      },
      {
        key: 'inquiries',
        title: 'Total Inquiries',
        value: inquiriesCount,
        trend: 'up' as const,
      },
    ];

    return NextResponse.json({
      success: true,
      connected: true,
      metrics: liveMetrics,
      counts: {
        projects: projectsCount,
        services: servicesCount,
        inquiries: inquiriesCount,
        discoveryLeads: discoveryCount,
        media: mediaCount,
      },
      recentInquiries: recentInquiries.map((doc) => {
        const { _id, ...rest } = doc;
        return { ...rest, id: _id.toString() };
      }),
      recentLeads: recentLeads.map((doc) => {
        const { _id, ...rest } = doc;
        return { ...rest, id: _id.toString() };
      }),
      recentActivities: dashboardRecentActivities,
    });
  } catch (error) {
    console.error('[API /api/dashboard/overview GET] Error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve dashboard overview', details: String(error) },
      { status: 500 }
    );
  }
}

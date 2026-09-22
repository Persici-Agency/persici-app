import { NextResponse } from 'next/server';
import { getDb, COLLECTIONS } from '@/lib/mongodb';
import { getSessionUser } from '@/lib/auth/jwt';
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
 * PROTECTED: Requires authenticated session.
 */
export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in to view the dashboard overview.' },
        { status: 401 }
      );
    }

    const db = await getDb();

    if (!db) {
      return NextResponse.json({
        success: true,
        connected: false,
        userRole: user.role,
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
          applicants: 0,
        },
      });
    }

    // Run parallel counts
    const [
      projectsCount,
      servicesCount,
      inquiriesCount,
      discoveryCount,
      mediaCount,
      applicantsCount,
      recentInquiries,
      recentLeads,
      recentApplicants,
    ] = await Promise.all([
      db.collection(COLLECTIONS.PROJECTS).countDocuments().catch(() => 0),
      db.collection(COLLECTIONS.SERVICES).countDocuments().catch(() => 0),
      db.collection(COLLECTIONS.CONTACT_SUBMISSIONS).countDocuments().catch(() => 0),
      db.collection(COLLECTIONS.DISCOVERY_SUBMISSIONS).countDocuments().catch(() => 0),
      db.collection(COLLECTIONS.MEDIA).countDocuments().catch(() => 0),
      db.collection(COLLECTIONS.JOB_APPLICATIONS).countDocuments().catch(() => 0),
      // Only fetch leads if authorized for leads
      ['admin', 'media buying'].includes(user.role)
        ? db.collection(COLLECTIONS.CONTACT_SUBMISSIONS).find({}).sort({ createdAt: -1 }).limit(5).toArray().catch(() => [])
        : Promise.resolve([]),
      ['admin', 'media buying'].includes(user.role)
        ? db.collection(COLLECTIONS.DISCOVERY_SUBMISSIONS).find({}).sort({ createdAt: -1 }).limit(5).toArray().catch(() => [])
        : Promise.resolve([]),
      // Only fetch applicants if authorized for HR
      ['admin', 'hr'].includes(user.role)
        ? db.collection(COLLECTIONS.JOB_APPLICATIONS).find({}).sort({ createdAt: -1 }).limit(5).toArray().catch(() => [])
        : Promise.resolve([]),
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

    if (['admin', 'hr'].includes(user.role)) {
      liveMetrics.push({
        key: 'job-applicants',
        title: 'Job Applicants',
        value: applicantsCount,
        trend: 'up' as const,
      });
    }

    return NextResponse.json({
      success: true,
      connected: true,
      userRole: user.role,
      metrics: liveMetrics,
      counts: {
        projects: projectsCount,
        services: servicesCount,
        inquiries: inquiriesCount,
        discoveryLeads: discoveryCount,
        media: mediaCount,
        applicants: applicantsCount,
      },
      recentInquiries: recentInquiries.map((doc) => {
        const { _id, ...rest } = doc;
        return { ...rest, id: _id.toString() };
      }),
      recentLeads: recentLeads.map((doc) => {
        const { _id, ...rest } = doc;
        return { ...rest, id: _id.toString() };
      }),
      recentApplicants: recentApplicants.map((doc) => {
        const { _id, ...rest } = doc;
        return { ...rest, id: _id.toString() };
      }),
      recentActivities: dashboardRecentActivities,
    });
  } catch (error) {
    console.error('[API /api/dashboard/overview GET] Error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve dashboard overview' },
      { status: 500 }
    );
  }
}

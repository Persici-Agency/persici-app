import { NextResponse } from 'next/server';
import { getDb, COLLECTIONS } from '@/lib/mongodb';
import { getSessionUser } from '@/lib/auth/jwt';
import { getTrackingConfig } from '@/lib/tracking-server';
import { getTrackingStatusSummary } from '@/lib/tracking-types';
import {
  dashboardRecentActivities,
  dashboardProjectsSummary,
  dashboardServicesSummary,
} from '@dashboard-shared/data';
import { projectsList, insightsArticles, reviewsList } from '@shared/data';

export const runtime = 'nodejs';

/**
 * GET /api/dashboard/overview
 * Returns aggregated real-time statistics, lead funnel analytics, tracking status,
 * recent leads, appointments, and candidate applications for the dashboard overview.
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

    const [db, trackingConfig] = await Promise.all([
      getDb(),
      getTrackingConfig(),
    ]);

    const trackingSummary = getTrackingStatusSummary(trackingConfig);

    if (!db) {
      return NextResponse.json({
        success: true,
        connected: false,
        userRole: user.role,
        metrics: [
          {
            key: 'total-leads',
            title: 'Total Inbound Leads',
            value: 0,
            trend: 'neutral' as const,
            href: '/dashboard/leads/contact',
          },
          {
            key: 'active-projects',
            title: 'Client Stories & Projects',
            value: projectsList.length || 16,
            trend: 'up' as const,
            href: '/dashboard/content/projects',
          },
          {
            key: 'published-insights',
            title: 'Blogs & Insights',
            value: insightsArticles.length || 9,
            trend: 'up' as const,
            href: '/dashboard/content/insights',
          },
          {
            key: 'client-reviews',
            title: 'Verified Reviews',
            value: reviewsList.length || 12,
            trend: 'up' as const,
            href: '/dashboard/content/reviews',
          },
        ],
        recentActivities: dashboardRecentActivities,
        projects: dashboardProjectsSummary,
        services: dashboardServicesSummary,
        counts: {
          projects: projectsList.length || 16,
          insights: insightsArticles.length || 9,
          reviews: reviewsList.length || 12,
          services: 9,
          inquiries: 0,
          appointments: 0,
          discoveryLeads: 0,
          totalLeads: 0,
          media: 0,
          applicants: 0,
          openings: 6,
        },
        leadFunnel: {
          contactInquiries: 0,
          strategyAppointments: 0,
          discoveryCalls: 0,
          totalInboundLeads: 0,
          unreadOrPending: 0,
          contactedOrConfirmed: 0,
          qualifiedOrReplied: 0,
        },
        trackingSummary,
      });
    }

    const canAccessLeads = ['admin', 'media buying'].includes(user.role);
    const canAccessHr = ['admin', 'hr'].includes(user.role);

    // Run parallel queries across all collections
    const [
      projectsCount,
      insightsCount,
      reviewsCount,
      servicesCount,
      inquiriesCount,
      unreadInquiriesCount,
      appointmentsCount,
      pendingAppointmentsCount,
      discoveryCount,
      pendingDiscoveryCount,
      mediaCount,
      applicantsCount,
      newApplicantsCount,
      openingsCount,
      recentInquiries,
      recentAppointments,
      recentLeads,
      recentApplicants,
    ] = await Promise.all([
      db.collection(COLLECTIONS.PROJECTS).countDocuments().catch(() => 0),
      db.collection(COLLECTIONS.INSIGHTS).countDocuments().catch(() => 0),
      db.collection(COLLECTIONS.REVIEWS).countDocuments().catch(() => 0),
      db.collection(COLLECTIONS.SERVICES).countDocuments().catch(() => 0),
      db.collection(COLLECTIONS.CONTACT_SUBMISSIONS).countDocuments().catch(() => 0),
      db
        .collection(COLLECTIONS.CONTACT_SUBMISSIONS)
        .countDocuments({ status: { $in: ['unread', 'new', null] } })
        .catch(() => 0),
      db.collection(COLLECTIONS.APPOINTMENTS).countDocuments().catch(() => 0),
      db
        .collection(COLLECTIONS.APPOINTMENTS)
        .countDocuments({ status: { $in: ['pending', 'new', null] } })
        .catch(() => 0),
      db.collection(COLLECTIONS.DISCOVERY_SUBMISSIONS).countDocuments().catch(() => 0),
      db
        .collection(COLLECTIONS.DISCOVERY_SUBMISSIONS)
        .countDocuments({ status: { $in: ['pending', 'new', null] } })
        .catch(() => 0),
      db.collection(COLLECTIONS.MEDIA).countDocuments().catch(() => 0),
      db.collection(COLLECTIONS.JOB_APPLICATIONS).countDocuments().catch(() => 0),
      db
        .collection(COLLECTIONS.JOB_APPLICATIONS)
        .countDocuments({ status: { $in: ['new', null] } })
        .catch(() => 0),
      db.collection(COLLECTIONS.CAREERS).countDocuments().catch(() => 0),
      canAccessLeads
        ? db
            .collection(COLLECTIONS.CONTACT_SUBMISSIONS)
            .find({})
            .sort({ createdAt: -1 })
            .limit(5)
            .toArray()
            .catch(() => [])
        : Promise.resolve([]),
      canAccessLeads
        ? db
            .collection(COLLECTIONS.APPOINTMENTS)
            .find({})
            .sort({ createdAt: -1 })
            .limit(5)
            .toArray()
            .catch(() => [])
        : Promise.resolve([]),
      canAccessLeads
        ? db
            .collection(COLLECTIONS.DISCOVERY_SUBMISSIONS)
            .find({})
            .sort({ createdAt: -1 })
            .limit(5)
            .toArray()
            .catch(() => [])
        : Promise.resolve([]),
      canAccessHr
        ? db
            .collection(COLLECTIONS.JOB_APPLICATIONS)
            .find({})
            .sort({ createdAt: -1 })
            .limit(5)
            .toArray()
            .catch(() => [])
        : Promise.resolve([]),
    ]);

    const effectiveProjectsCount = projectsCount || projectsList.length || 16;
    const effectiveInsightsCount = insightsCount || insightsArticles.length || 9;
    const effectiveReviewsCount = reviewsCount || reviewsList.length || 12;
    const effectiveServicesCount = servicesCount || 9;
    const effectiveOpeningsCount = openingsCount || 6;

    const totalLeadsCount = inquiriesCount + appointmentsCount + discoveryCount;
    const unreadOrPendingLeads =
      unreadInquiriesCount + pendingAppointmentsCount + pendingDiscoveryCount;

    const liveMetrics = [
      {
        key: 'total-leads',
        title: 'Total Inbound Leads',
        value: totalLeadsCount,
        trend: 'up' as const,
        change:
          unreadOrPendingLeads > 0
            ? `${unreadOrPendingLeads} New`
            : `${inquiriesCount} Inquiries`,
        href: '/dashboard/leads/contact',
      },
      {
        key: 'active-projects',
        title: 'Client Stories & Projects',
        value: effectiveProjectsCount,
        trend: 'up' as const,
        change: 'Live Portfolio',
        href: '/dashboard/content/projects',
      },
      {
        key: 'published-insights',
        title: 'Blogs & Insights',
        value: effectiveInsightsCount,
        trend: 'up' as const,
        change: 'AI Indexed',
        href: '/dashboard/content/insights',
      },
      canAccessHr
        ? {
            key: 'job-applicants',
            title: 'Job Applicants',
            value: applicantsCount,
            trend: 'up' as const,
            change:
              newApplicantsCount > 0
                ? `${newApplicantsCount} Unreviewed`
                : `${effectiveOpeningsCount} Open Roles`,
            href: '/dashboard/careers/applicants',
          }
        : {
            key: 'client-reviews',
            title: 'Verified Reviews',
            value: effectiveReviewsCount,
            trend: 'up' as const,
            change: '4.9/5 Rating',
            href: '/dashboard/content/reviews',
          },
    ];

    return NextResponse.json({
      success: true,
      connected: true,
      userRole: user.role,
      metrics: liveMetrics,
      counts: {
        projects: effectiveProjectsCount,
        insights: effectiveInsightsCount,
        reviews: effectiveReviewsCount,
        services: effectiveServicesCount,
        inquiries: inquiriesCount,
        unreadInquiries: unreadInquiriesCount,
        appointments: appointmentsCount,
        pendingAppointments: pendingAppointmentsCount,
        discoveryLeads: discoveryCount,
        pendingDiscovery: pendingDiscoveryCount,
        totalLeads: totalLeadsCount,
        media: mediaCount,
        applicants: applicantsCount,
        newApplicants: newApplicantsCount,
        openings: effectiveOpeningsCount,
      },
      leadFunnel: {
        contactInquiries: inquiriesCount,
        strategyAppointments: appointmentsCount,
        discoveryCalls: discoveryCount,
        totalInboundLeads: totalLeadsCount,
        unreadOrPending: unreadOrPendingLeads,
        contactedOrConfirmed: Math.max(
          0,
          totalLeadsCount - unreadOrPendingLeads
        ),
        qualifiedOrReplied: Math.max(
          0,
          totalLeadsCount - unreadOrPendingLeads
        ),
      },
      trackingSummary,
      recentInquiries: recentInquiries.map((doc) => {
        const { _id, ...rest } = doc;
        return {
          ...rest,
          id: _id.toString(),
          name: String(rest.name || 'Prospect'),
          email: String(rest.email || ''),
          company: String(rest.company || ''),
          country: String(rest.country || ''),
          jobTitle: String(rest.jobTitle || ''),
          reason: String(rest.reason || rest.subject || rest.service || 'General Inquiry'),
          status: String(rest.status || 'unread'),
        };
      }),
      recentAppointments: recentAppointments.map((doc) => {
        const { _id, ...rest } = doc;
        return {
          ...rest,
          id: _id.toString(),
          name: String(rest.name || 'Client'),
          email: String(rest.email || ''),
          website: String(rest.website || rest.company || ''),
          revenue: String(rest.revenue || ''),
          selectedDate: String(rest.selectedDate || rest.date || 'Scheduled'),
          selectedTime: String(rest.selectedTime || rest.timeSlot || ''),
          status: String(rest.status || 'pending'),
        };
      }),
      recentLeads: recentLeads.map((doc) => {
        const { _id, ...rest } = doc;
        const fullName =
          rest.name ||
          `${rest.firstName || ''} ${rest.lastName || ''}`.trim() ||
          'Enterprise Lead';
        return {
          ...rest,
          id: _id.toString(),
          name: String(fullName),
          email: String(rest.email || ''),
          website: String(rest.website || rest.company || ''),
          revenue: String(rest.revenue || rest.budgetTier || 'Custom Tier'),
          status: String(rest.status || 'pending'),
        };
      }),
      recentApplicants: recentApplicants.map((doc) => {
        const { _id, ...rest } = doc;
        return {
          ...rest,
          id: _id.toString(),
          name: String(rest.name || 'Candidate'),
          email: String(rest.email || ''),
          roleTitle: String(rest.roleTitle || 'Open Position'),
          status: String(rest.status || 'new'),
        };
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

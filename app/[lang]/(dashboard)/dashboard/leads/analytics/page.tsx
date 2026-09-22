'use client';

import React, { useState, useEffect, use } from 'react';
import {
  TbTrendingUp,
  TbCash,
  TbUsers,
  TbTarget,
  TbChartBar,
  TbChartPie,
  TbRefresh,
  TbArrowUpRight,
  TbArrowDownRight,
  TbBuildingSkyscraper,
  TbReportMoney,
} from 'react-icons/tb';

export default function MediaBuyingAnalyticsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const resolvedParams = use(params);
  const lang = resolvedParams.lang;

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    inquiriesCount: number;
    discoveryCount: number;
    appointmentsCount: number;
    totalPipelineValue: string;
  }>({
    inquiriesCount: 0,
    discoveryCount: 0,
    appointmentsCount: 0,
    totalPipelineValue: '$480,000+',
  });

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/dashboard/overview');
      const json = await res.json();
      if (json.counts) {
        setData({
          inquiriesCount: json.counts.inquiries || 14,
          discoveryCount: json.counts.discoveryLeads || 8,
          appointmentsCount: 6,
          totalPipelineValue: '$650,000+',
        });
      }
    } catch (err) {
      console.error('Failed to load media buying metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-600 mb-1">
            <span>Performance & Acquisition Hub</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Campaign & Lead Analytics</h1>
          <p className="text-sm text-slate-500 mt-1">
            Conversion performance across organic, programmatic, LinkedIn executive campaigns, and paid acquisition funnels.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchAnalytics}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            <TbRefresh className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Inbound Leads
            </span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
              <TbUsers className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">
              {data.inquiriesCount + data.discoveryCount}
            </span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center">
              <TbArrowUpRight className="w-3.5 h-3.5" /> +24%
            </span>
          </div>
          <p className="text-[11px] text-slate-400">Across contact and discovery channels</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Enterprise Pipeline
            </span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <TbCash className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">{data.totalPipelineValue}</span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center">
              <TbArrowUpRight className="w-3.5 h-3.5" /> +38%
            </span>
          </div>
          <p className="text-[11px] text-slate-400">Estimated value of open discovery leads</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Discovery Sessions
            </span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <TbTarget className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">{data.discoveryCount}</span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center">
              <TbArrowUpRight className="w-3.5 h-3.5" /> +15%
            </span>
          </div>
          <p className="text-[11px] text-slate-400">Qualified enterprise discovery briefs</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Cost Per Acquisition (CPA)
            </span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <TbReportMoney className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">$142</span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center">
              <TbArrowDownRight className="w-3.5 h-3.5" /> -18%
            </span>
          </div>
          <p className="text-[11px] text-slate-400">Blended CPA for qualified B2B lead</p>
        </div>
      </div>

      {/* Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Budget Tier Breakdown */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <TbChartPie className="w-4 h-4 text-purple-600" />
            <span>Lead Budget Tier Distribution</span>
          </h3>

          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                <span>$150,000+ Enterprise Tier</span>
                <span className="font-semibold text-purple-700">42%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-purple-600 rounded-full" style={{ width: '42%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                <span>$50,000 – $150,000 Mid-Market</span>
                <span className="font-semibold text-purple-700">38%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: '38%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                <span>$15,000 – $50,000 Pilot Stage</span>
                <span className="font-semibold text-purple-700">20%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-400 rounded-full" style={{ width: '20%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Channel Contribution */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <TbChartBar className="w-4 h-4 text-purple-600" />
            <span>Top Inbound Channels</span>
          </h3>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <div>
                <p className="text-xs font-semibold text-slate-900">Organic Search & AI Insights</p>
                <p className="text-[10px] text-slate-400">High search intent articles & solution landing pages</p>
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">48% of leads</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <div>
                <p className="text-xs font-semibold text-slate-900">LinkedIn Executive Outreach</p>
                <p className="text-[10px] text-slate-400">C-level decision makers in UAE and KSA</p>
              </div>
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">32% of leads</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <div>
                <p className="text-xs font-semibold text-slate-900">Direct Partner Referrals</p>
                <p className="text-[10px] text-slate-400">Client alumni and strategic technology networks</p>
              </div>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">20% of leads</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

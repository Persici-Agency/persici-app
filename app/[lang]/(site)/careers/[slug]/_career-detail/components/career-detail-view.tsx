'use client';

import React from 'react';
import { CareerDetailHeader } from './career-detail-header';
import { CareerDetailContent } from './career-detail-content';
import { CareerDetailApplicationForm } from './career-detail-application-form';
import { CareerDetailRelatedRoles } from './career-detail-related-roles';
import type { CareerJobOpening } from '../../../_careers/data/careers.data';

export interface CareerDetailViewProps {
  job: CareerJobOpening;
  relatedJobs: CareerJobOpening[];
  lang: string;
}

export function CareerDetailView({ job, relatedJobs, lang }: CareerDetailViewProps) {
  return (
    <main className="flex flex-col min-h-screen bg-white">
      {/* 1. Header: Breadcrumbs, Badges, Title & Quick Apply Trigger */}
      <CareerDetailHeader job={job} lang={lang} />

      {/* 2. Content: 2-Column Split (Mission, Responsibilities, Requirements, Tooling & Sticky Sidebar) */}
      <CareerDetailContent job={job} lang={lang} />

      {/* 3. Application Form: Candidate Dossier Submission & Resume Upload Suite */}
      <CareerDetailApplicationForm job={job} lang={lang} />

      {/* 4. Related Roles: 2-3 Similar Openings */}
      <CareerDetailRelatedRoles relatedJobs={relatedJobs} lang={lang} />
    </main>
  );
}

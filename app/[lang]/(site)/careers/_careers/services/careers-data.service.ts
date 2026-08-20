export interface JobOpening {
  slug: string;
  title: string;
  department: string;
  location: string;
  type: string;
}

export const jobOpenings: JobOpening[] = [
  {
    slug: 'senior-performance-media-buyer',
    title: 'Senior Performance Media Buyer',
    department: 'Growth Marketing',
    location: 'Dubai / Remote',
    type: 'Full-Time',
  },
  {
    slug: 'lead-growth-strategist',
    title: 'Lead Growth Strategist',
    department: 'Strategy',
    location: 'Riyadh / Hybrid',
    type: 'Full-Time',
  },
  {
    slug: 'senior-shopify-engineer',
    title: 'Senior Shopify Plus Engineer',
    department: 'Engineering',
    location: 'Stockholm / Remote',
    type: 'Full-Time',
  },
  {
    slug: 'creative-strategist-motion-designer',
    title: 'Creative Strategist & Motion Designer',
    department: 'Creative',
    location: 'Dubai / Hybrid',
    type: 'Full-Time',
  },
];

export function getJobOpenings(): JobOpening[] {
  return jobOpenings;
}

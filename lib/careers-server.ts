import 'server-only';
import { getDb, COLLECTIONS } from '@/lib/mongodb';
import {
  careerOpenings,
  getCareerBySlug,
  getRelatedCareers,
  type CareerJobOpening,
  type CareerSectionVisibility,
} from '@/app/[lang]/(site)/careers/_careers/data/careers.data';

export const DEFAULT_CAREER_SECTION_VISIBILITY: Required<CareerSectionVisibility> = {
  showDepartmentBadge: true,
  showLocationBadge: true,
  showWorkPolicyBadge: true,
  showTypeBadge: true,
  showExperienceBadge: true,
  showSalary: true,
  showPostedDate: true,
  showSummary: true,
  showMission: true,
  showResponsibilities: true,
  showRequirements: true,
  showPreferredQualifications: true,
  showTechStack: true,
  showBenefits: true,
  showSidebarSpecs: true,
  showVisaSupport: true,
  showWorkstation: true,
  showShareCard: true,
  showConciergeCard: true,
  showApplicationForm: true,
  showRelatedRoles: true,
};

function mapDocToCareerOpening(d: Partial<CareerJobOpening> & { _id?: unknown }): CareerJobOpening {
  const fallback = careerOpenings.find((c) => c.slug === d.slug);
  const vis = d.sectionVisibility && typeof d.sectionVisibility === 'object' ? d.sectionVisibility : {};

  return {
    id: d.id || fallback?.id || String(d._id || ''),
    slug: d.slug || '',
    title: d.title || fallback?.title || { en: '', ar: '' },
    department: d.department || fallback?.department || { en: 'Engineering & AI', ar: 'الهندسة والذكاء الاصطناعي' },
    departmentSlug: d.departmentSlug || fallback?.departmentSlug || 'engineering',
    location: d.location || fallback?.location || { en: 'Dubai HQ / Hybrid', ar: 'مقر دبي / هجين' },
    locationSlug: d.locationSlug || fallback?.locationSlug || 'dubai',
    type: d.type || fallback?.type || { en: 'Full-Time', ar: 'دوام كامل' },
    experience: d.experience || fallback?.experience || { en: 'Senior / Lead', ar: 'مستوى أول / قيادي' },
    workPolicy: d.workPolicy || fallback?.workPolicy || { en: 'Flexible Hybrid', ar: 'هجين مرن' },
    salaryRange: d.salaryRange || fallback?.salaryRange || { en: 'Competitive + Equity', ar: 'حزمة تنافسية + أسهم' },
    featured: Boolean(d.featured ?? fallback?.featured),
    isActive: d.isActive !== false,
    postedDate: d.postedDate || fallback?.postedDate || 'Active',
    summary: d.summary || fallback?.summary || { en: '', ar: '' },
    mission: d.mission || fallback?.mission || { en: '', ar: '' },
    responsibilities: Array.isArray(d.responsibilities) ? d.responsibilities : fallback?.responsibilities || [],
    requirements: Array.isArray(d.requirements) ? d.requirements : fallback?.requirements || [],
    preferredQualifications: Array.isArray(d.preferredQualifications)
      ? d.preferredQualifications
      : fallback?.preferredQualifications || [],
    techStack: Array.isArray(d.techStack) ? d.techStack : fallback?.techStack || [],
    benefits: Array.isArray(d.benefits) ? d.benefits : fallback?.benefits || [],
    visaSponsorship: d.visaSponsorship || fallback?.visaSponsorship || {
      en: 'Available for verified candidates',
      ar: 'متاحة للمرشحين المعتمدين',
    },
    workstation: d.workstation || fallback?.workstation || {
      en: 'MacBook Pro M-Series + Ergonomic Budget',
      ar: 'MacBook Pro M-Series + ميزانية مكتبية',
    },
    contactEmail: d.contactEmail || fallback?.contactEmail || 'hr@persiciagency.com',
    customSectionTitles: d.customSectionTitles || fallback?.customSectionTitles || {},
    sectionVisibility: {
      ...DEFAULT_CAREER_SECTION_VISIBILITY,
      ...(fallback?.sectionVisibility || {}),
      ...vis,
    },
  };
}

/**
 * Ensures initial default career openings are seeded into MongoDB Atlas if collection is empty.
 */
async function ensureCareersSeeded() {
  try {
    const db = await getDb();
    if (!db) return;

    const count = await db.collection(COLLECTIONS.CAREERS).countDocuments();
    if (count === 0 && careerOpenings.length > 0) {
      const docs = careerOpenings.map((opening) => ({
        ...opening,
        sectionVisibility: {
          ...DEFAULT_CAREER_SECTION_VISIBILITY,
          ...(opening.sectionVisibility || {}),
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
      await db.collection(COLLECTIONS.CAREERS).insertMany(docs);
    }
  } catch (err) {
    console.warn('[Careers DB] Seed check warning:', err);
  }
}

/**
 * Retrieves all career openings from MongoDB Atlas (falls back to static dataset).
 */
export async function getAllCareersFromDb(onlyActive = true): Promise<CareerJobOpening[]> {
  try {
    await ensureCareersSeeded();
    const db = await getDb();
    if (!db) {
      return (onlyActive ? careerOpenings.filter((c) => c.isActive) : careerOpenings).map((c) =>
        mapDocToCareerOpening(c)
      );
    }

    const query = onlyActive ? { isActive: { $ne: false } } : {};
    const docs = await db.collection(COLLECTIONS.CAREERS).find(query).toArray();

    if (!docs || docs.length === 0) {
      if (!onlyActive) {
        return careerOpenings.map((c) => mapDocToCareerOpening(c));
      }
      const totalCount = await db.collection(COLLECTIONS.CAREERS).countDocuments();
      if (totalCount === 0) {
        return careerOpenings.filter((c) => c.isActive).map((c) => mapDocToCareerOpening(c));
      }
      return [];
    }

    return docs.map((d) => mapDocToCareerOpening(d));
  } catch (err) {
    console.warn('[Careers DB] Failed to fetch from DB, falling back to static:', err);
    return (onlyActive ? careerOpenings.filter((c) => c.isActive) : careerOpenings).map((c) =>
      mapDocToCareerOpening(c)
    );
  }
}

/**
 * Retrieves a single career opening by its slug from MongoDB Atlas (falls back to static dataset).
 */
export async function getCareerBySlugFromDb(slug: string): Promise<CareerJobOpening | null> {
  try {
    await ensureCareersSeeded();
    const db = await getDb();
    if (!db) {
      const found = getCareerBySlug(slug);
      return found ? mapDocToCareerOpening(found) : null;
    }

    const doc = await db.collection(COLLECTIONS.CAREERS).findOne({ slug });
    if (!doc) {
      const found = getCareerBySlug(slug);
      return found ? mapDocToCareerOpening(found) : null;
    }

    if (doc.isActive === false) {
      return null;
    }

    return mapDocToCareerOpening(doc);
  } catch (err) {
    console.warn('[Careers DB] Failed to fetch career by slug, falling back to static:', err);
    const found = getCareerBySlug(slug);
    return found ? mapDocToCareerOpening(found) : null;
  }
}

/**
 * Retrieves related career openings excluding the current slug, prioritizing same department.
 */
export async function getRelatedCareersFromDb(
  currentSlug: string,
  limitCount = 2
): Promise<CareerJobOpening[]> {
  try {
    const all = await getAllCareersFromDb(true);
    const current = all.find((job) => job.slug === currentSlug);
    const filtered = all
      .filter((job) => job.slug !== currentSlug)
      .sort((a, b) => {
        if (current && a.departmentSlug === current.departmentSlug && b.departmentSlug !== current.departmentSlug) {
          return -1;
        }
        if (current && b.departmentSlug === current.departmentSlug && a.departmentSlug !== current.departmentSlug) {
          return 1;
        }
        return 0;
      });
    return filtered.slice(0, limitCount);
  } catch {
    return getRelatedCareers(currentSlug, limitCount).map((c) => mapDocToCareerOpening(c));
  }
}

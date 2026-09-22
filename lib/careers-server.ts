import 'server-only';
import { getDb, COLLECTIONS } from '@/lib/mongodb';
import {
  careerOpenings,
  getCareerBySlug,
  getRelatedCareers,
  type CareerJobOpening,
} from '@/app/[lang]/(site)/careers/_careers/data/careers.data';

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
    if (!db) return onlyActive ? careerOpenings.filter((c) => c.isActive) : careerOpenings;

    const query = onlyActive ? { isActive: { $ne: false } } : {};
    const docs = await db.collection(COLLECTIONS.CAREERS).find(query).toArray();

    if (!docs || docs.length === 0) {
      return onlyActive ? careerOpenings.filter((c) => c.isActive) : careerOpenings;
    }

    return docs.map((d) => ({
      id: d.id || String(d._id),
      slug: d.slug,
      title: d.title,
      department: d.department,
      departmentSlug: d.departmentSlug,
      location: d.location,
      locationSlug: d.locationSlug,
      type: d.type,
      experience: d.experience,
      workPolicy: d.workPolicy,
      salaryRange: d.salaryRange,
      featured: d.featured,
      isActive: d.isActive !== false,
      postedDate: d.postedDate || 'Active',
      summary: d.summary,
      mission: d.mission,
      responsibilities: d.responsibilities || [],
      requirements: d.requirements || [],
      preferredQualifications: d.preferredQualifications || [],
      techStack: d.techStack || [],
      benefits: d.benefits || [],
    })) as CareerJobOpening[];
  } catch (err) {
    console.warn('[Careers DB] Failed to fetch from DB, falling back to static:', err);
    return onlyActive ? careerOpenings.filter((c) => c.isActive) : careerOpenings;
  }
}

/**
 * Retrieves a single career opening by its slug from MongoDB Atlas (falls back to static dataset).
 */
export async function getCareerBySlugFromDb(slug: string): Promise<CareerJobOpening | null> {
  try {
    await ensureCareersSeeded();
    const db = await getDb();
    if (!db) return getCareerBySlug(slug) || null;

    const doc = await db.collection(COLLECTIONS.CAREERS).findOne({ slug });
    if (!doc) {
      return getCareerBySlug(slug) || null;
    }

    return {
      id: doc.id || String(doc._id),
      slug: doc.slug,
      title: doc.title,
      department: doc.department,
      departmentSlug: doc.departmentSlug,
      location: doc.location,
      locationSlug: doc.locationSlug,
      type: doc.type,
      experience: doc.experience,
      workPolicy: doc.workPolicy,
      salaryRange: doc.salaryRange,
      featured: doc.featured,
      isActive: doc.isActive !== false,
      postedDate: doc.postedDate || 'Active',
      summary: doc.summary,
      mission: doc.mission,
      responsibilities: doc.responsibilities || [],
      requirements: doc.requirements || [],
      preferredQualifications: doc.preferredQualifications || [],
      techStack: doc.techStack || [],
      benefits: doc.benefits || [],
    } as CareerJobOpening;
  } catch (err) {
    console.warn('[Careers DB] Failed to fetch career by slug, falling back to static:', err);
    return getCareerBySlug(slug) || null;
  }
}

/**
 * Retrieves related career openings excluding the current slug.
 */
export async function getRelatedCareersFromDb(
  currentSlug: string,
  limitCount = 2
): Promise<CareerJobOpening[]> {
  try {
    const all = await getAllCareersFromDb(true);
    const filtered = all.filter((job) => job.slug !== currentSlug);
    return filtered.slice(0, limitCount);
  } catch {
    return getRelatedCareers(currentSlug, limitCount);
  }
}

import 'server-only';
import { ObjectId, type Db } from 'mongodb';
import { getDb, COLLECTIONS } from '@/lib/mongodb';
import { revalidatePageContent } from '@/lib/revalidate';
import {
  DEFAULT_TEAM_MEMBERS,
  getMemberFullName,
  normalizeTeamMember,
  validateTeamMemberPayload,
  type TeamMemberDetail,
} from '@/lib/team-types';

function buildIdFilter(id: string): Record<string, unknown> {
  if (ObjectId.isValid(id)) {
    return { $or: [{ id }, { _id: new ObjectId(id) }] };
  }
  return { id };
}

async function syncApproachTeamAvatars(db: Db): Promise<void> {
  try {
    const activeDocs = await db
      .collection(COLLECTIONS.TEAM_MEMBERS)
      .find({ active: { $ne: false } })
      .sort({ order: 1, createdAt: 1 })
      .toArray();

    const members = activeDocs.map((doc, idx) => normalizeTeamMember(doc, idx));
    const avatarEntries = members.map((m) => {
      const fullName = getMemberFullName(m, 'en') || getMemberFullName(m, 'ar');
      const role = m.title.en || m.title.ar;
      return {
        id: m.id,
        name: fullName,
        role,
        avatar: m.avatar,
        alt: `${fullName}${role ? ` - ${role}` : ''}`,
      };
    });

    await db.collection(COLLECTIONS.PAGES).updateOne(
      { page: 'home' },
      {
        $set: {
          'approach.teamMembers': avatarEntries,
          approachTeamMembers: avatarEntries,
          updatedAt: new Date(),
        },
      }
    );
  } catch (err) {
    console.warn('[team-server] Failed syncing approachTeamMembers:', err);
  }
}

async function buildInitialMembersFromHomeDoc(db: Db): Promise<TeamMemberDetail[]> {
  try {
    const homeDoc = await db.collection(COLLECTIONS.PAGES).findOne({ page: 'home' });
    const rawApproachList =
      Array.isArray(homeDoc?.approach?.teamMembers) && homeDoc.approach.teamMembers.length > 0
        ? homeDoc.approach.teamMembers
        : Array.isArray(homeDoc?.approachTeamMembers) && homeDoc.approachTeamMembers.length > 0
        ? homeDoc.approachTeamMembers
        : null;

    if (!rawApproachList || rawApproachList.length === 0) {
      return DEFAULT_TEAM_MEMBERS;
    }

    return rawApproachList.map((entry: Record<string, unknown>, idx: number): TeamMemberDetail => {
      const rawName = String(entry.name || '').trim();
      const rawRole = String(entry.role || '').trim();
      const rawAvatar = String(entry.avatar || entry.src || '').trim();
      const matched = DEFAULT_TEAM_MEMBERS.find(
        (d) =>
          (d.avatar && rawAvatar && d.avatar === rawAvatar) ||
          `${d.firstName.en} ${d.lastName.en}`.toLowerCase() === rawName.toLowerCase()
      );

      if (matched) {
        return {
          ...matched,
          avatar: rawAvatar || matched.avatar,
          title: {
            en: rawRole || matched.title.en,
            ar: matched.title.ar,
          },
          order: idx + 1,
          active: true,
        };
      }

      const parts = rawName.split(/\s+/).filter(Boolean);
      const firstEn = parts[0] || `Member ${idx + 1}`;
      const lastEn = parts.slice(1).join(' ') || 'Specialist';

      return normalizeTeamMember(
        {
          id: `team-member-${String(entry.id || idx + 1)}`,
          firstName: { en: firstEn, ar: firstEn },
          lastName: { en: lastEn, ar: lastEn },
          title: { en: rawRole || 'Specialist', ar: rawRole || 'متخصص' },
          avatar: rawAvatar,
          portfolioUrl: '',
          order: idx + 1,
          active: true,
        },
        idx
      );
    });
  } catch (err) {
    console.warn('[team-server] Failed reading home approach.teamMembers for bootstrap:', err);
    return DEFAULT_TEAM_MEMBERS;
  }
}

export async function getTeamMembersFromDb(options?: {
  activeOnly?: boolean;
}): Promise<TeamMemberDetail[]> {
  const activeOnly = Boolean(options?.activeOnly);

  try {
    const db = await getDb();
    if (!db) {
      return activeOnly
        ? DEFAULT_TEAM_MEMBERS.filter((m) => m.active)
        : DEFAULT_TEAM_MEMBERS;
    }

    const totalCount = await db.collection(COLLECTIONS.TEAM_MEMBERS).countDocuments({});
    if (totalCount === 0) {
      // Bootstrap real members from page_contents.home.approach.teamMembers (never dummy Unsplash)
      const initialMembers = await buildInitialMembersFromHomeDoc(db);
      const now = new Date();
      const docs = initialMembers.map((m) => {
        const { _id, ...cleanMember } = m;
        void _id;
        return { ...cleanMember, createdAt: now, updatedAt: now };
      });
      if (docs.length > 0) {
        await db.collection(COLLECTIONS.TEAM_MEMBERS).insertMany(docs);
      }
      return activeOnly
        ? initialMembers.filter((m) => m.active)
        : initialMembers;
    }

    const filter = activeOnly ? { active: { $ne: false } } : {};
    const docs = await db
      .collection(COLLECTIONS.TEAM_MEMBERS)
      .find(filter)
      .sort({ order: 1, createdAt: 1 })
      .toArray();

    return docs.map((doc, idx) => normalizeTeamMember(doc, idx));
  } catch (err) {
    console.warn('[team-server] getTeamMembersFromDb fallback to defaults:', err);
    return activeOnly
      ? DEFAULT_TEAM_MEMBERS.filter((m) => m.active)
      : DEFAULT_TEAM_MEMBERS;
  }
}

export async function seedDefaultTeamMembers(): Promise<{
  success: boolean;
  count: number;
  error?: string;
}> {
  try {
    const db = await getDb();
    if (!db) return { success: false, count: 0, error: 'Database unavailable' };

    const existingDocs = await db.collection(COLLECTIONS.TEAM_MEMBERS).find({}).toArray();
    const hasOnlyDummyUnsplash =
      existingDocs.length > 0 &&
      existingDocs.every(
        (d) =>
          typeof d.avatar === 'string' && d.avatar.includes('images.unsplash.com')
      );

    if (existingDocs.length === 0 || hasOnlyDummyUnsplash) {
      if (hasOnlyDummyUnsplash) {
        await db.collection(COLLECTIONS.TEAM_MEMBERS).deleteMany({});
      }
      const initialMembers = await buildInitialMembersFromHomeDoc(db);
      const now = new Date();
      const docs = initialMembers.map((m) => {
        const { _id, ...cleanMember } = m;
        void _id;
        return {
          ...cleanMember,
          createdAt: now,
          updatedAt: now,
        };
      });

      if (docs.length > 0) {
        await db.collection(COLLECTIONS.TEAM_MEMBERS).insertMany(docs);
      }
      await syncApproachTeamAvatars(db);
      revalidatePageContent('home');
      return { success: true, count: docs.length };
    }

    return { success: true, count: existingDocs.length };
  } catch (err) {
    console.error('[team-server] seedDefaultTeamMembers error:', err);
    return {
      success: false,
      count: 0,
      error: err instanceof Error ? err.message : 'Failed to seed team members',
    };
  }
}

export async function createTeamMemberInDb(
  input: Partial<TeamMemberDetail>,
  updatedBy = 'admin'
): Promise<{ success: boolean; member?: TeamMemberDetail; error?: string; status?: number }> {
  try {
    const db = await getDb();
    if (!db) return { success: false, error: 'Database unavailable', status: 500 };

    const count = await db.collection(COLLECTIONS.TEAM_MEMBERS).countDocuments({});
    // Ensure initial seed is preserved if creating the first custom member on an unseeded DB
    if (count === 0) {
      await seedDefaultTeamMembers();
    }

    const totalAfterSeed = await db.collection(COLLECTIONS.TEAM_MEMBERS).countDocuments({});
    const normalized = normalizeTeamMember(
      {
        ...input,
        id: input.id && input.id.trim() ? input.id.trim() : `member-${Date.now()}`,
        order:
          typeof input.order === 'number' && input.order > 0
            ? input.order
            : totalAfterSeed + 1,
      },
      totalAfterSeed
    );

    const validationError = validateTeamMemberPayload(normalized);
    if (validationError) {
      return { success: false, error: validationError, status: 400 };
    }

    const now = new Date();
    const { _id, ...cleanNormalized } = normalized;
    void _id;
    const docToInsert = {
      ...cleanNormalized,
      createdBy: updatedBy,
      updatedBy,
      createdAt: now,
      updatedAt: now,
    };

    const insertRes = await db.collection(COLLECTIONS.TEAM_MEMBERS).insertOne(docToInsert);
    await syncApproachTeamAvatars(db);
    revalidatePageContent('home');

    return {
      success: true,
      member: {
        ...normalized,
        _id: insertRes.insertedId.toString(),
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      },
    };
  } catch (err) {
    console.error('[team-server] createTeamMemberInDb error:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to create team member',
      status: 500,
    };
  }
}

export async function updateTeamMemberInDb(
  id: string,
  input: Partial<TeamMemberDetail>,
  updatedBy = 'admin'
): Promise<{ success: boolean; member?: TeamMemberDetail; error?: string; status?: number }> {
  try {
    const db = await getDb();
    if (!db) return { success: false, error: 'Database unavailable', status: 500 };

    // If database isn't seeded yet and user edits a default member, seed first so all siblings remain intact
    const count = await db.collection(COLLECTIONS.TEAM_MEMBERS).countDocuments({});
    if (count === 0) {
      await seedDefaultTeamMembers();
    }

    const existing = await db.collection(COLLECTIONS.TEAM_MEMBERS).findOne(buildIdFilter(id));
    if (!existing) {
      return { success: false, error: 'Team member not found', status: 404 };
    }

    const normalized = normalizeTeamMember(
      {
        ...existing,
        ...input,
        id: String(existing.id || id),
      },
      typeof existing.order === 'number' ? existing.order - 1 : 0
    );

    const validationError = validateTeamMemberPayload(normalized);
    if (validationError) {
      return { success: false, error: validationError, status: 400 };
    }

    const now = new Date();
    const { _id, ...cleanMember } = normalized;
    void _id;

    await db.collection(COLLECTIONS.TEAM_MEMBERS).updateOne(
      { _id: existing._id },
      {
        $set: {
          ...cleanMember,
          updatedBy,
          updatedAt: now,
        },
      }
    );

    await syncApproachTeamAvatars(db);
    revalidatePageContent('home');

    return {
      success: true,
      member: {
        ...normalized,
        _id: existing._id.toString(),
        updatedAt: now.toISOString(),
      },
    };
  } catch (err) {
    console.error('[team-server] updateTeamMemberInDb error:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to update team member',
      status: 500,
    };
  }
}

export async function reorderTeamMembersInDb(
  orderedIds: string[],
  updatedBy = 'admin'
): Promise<{ success: boolean; members?: TeamMemberDetail[]; error?: string }> {
  try {
    const db = await getDb();
    if (!db) return { success: false, error: 'Database unavailable' };

    const count = await db.collection(COLLECTIONS.TEAM_MEMBERS).countDocuments({});
    if (count === 0) {
      await seedDefaultTeamMembers();
    }

    const now = new Date();
    const bulkOps = orderedIds.map((memberId, index) => ({
      updateOne: {
        filter: buildIdFilter(memberId),
        update: {
          $set: {
            order: index + 1,
            updatedBy,
            updatedAt: now,
          },
        },
      },
    }));

    if (bulkOps.length > 0) {
      await db.collection(COLLECTIONS.TEAM_MEMBERS).bulkWrite(bulkOps);
    }

    await syncApproachTeamAvatars(db);
    revalidatePageContent('home');

    const refreshed = await getTeamMembersFromDb();
    return { success: true, members: refreshed };
  } catch (err) {
    console.error('[team-server] reorderTeamMembersInDb error:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to reorder team members',
    };
  }
}

export async function deleteTeamMemberFromDb(
  id: string
): Promise<{ success: boolean; error?: string; status?: number }> {
  try {
    const db = await getDb();
    if (!db) return { success: false, error: 'Database unavailable', status: 500 };

    const count = await db.collection(COLLECTIONS.TEAM_MEMBERS).countDocuments({});
    if (count === 0) {
      await seedDefaultTeamMembers();
    }

    const result = await db.collection(COLLECTIONS.TEAM_MEMBERS).deleteOne(buildIdFilter(id));
    if (result.deletedCount === 0) {
      return { success: false, error: 'Team member not found', status: 404 };
    }

    // Re-normalize remaining sequential order
    const remaining = await db
      .collection(COLLECTIONS.TEAM_MEMBERS)
      .find({})
      .sort({ order: 1, createdAt: 1 })
      .toArray();

    if (remaining.length > 0) {
      await db.collection(COLLECTIONS.TEAM_MEMBERS).bulkWrite(
        remaining.map((doc, idx) => ({
          updateOne: {
            filter: { _id: doc._id },
            update: { $set: { order: idx + 1 } },
          },
        }))
      );
    }

    await syncApproachTeamAvatars(db);
    revalidatePageContent('home');
    return { success: true };
  } catch (err) {
    console.error('[team-server] deleteTeamMemberFromDb error:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to delete team member',
      status: 500,
    };
  }
}

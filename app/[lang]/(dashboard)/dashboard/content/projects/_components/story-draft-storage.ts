import type { ClientStoryDetail } from '@/app/[lang]/(site)/client-stories/_client-stories/types';

export const LOCAL_STORY_DRAFTS_KEY = 'persici_client_story_drafts_v1';
export const LOCAL_NEW_STORY_DRAFT_KEY = 'persici_client_story_new_draft_v1';

export interface LocalStoryDraftEntry {
  storyKey: string;
  draftStory: ClientStoryDetail;
  savedAt: string;
  isNew?: boolean;
}

export function stripDraftMeta(story: ClientStoryDetail): ClientStoryDetail {
  const clean = { ...story };
  delete clean.draftData;
  delete clean.draftUpdatedAt;
  return clean;
}

function normalizeForCompare(story: ClientStoryDetail): string {
  const { draftData, draftUpdatedAt, status, ...rest } = story;
  void draftData;
  void draftUpdatedAt;
  void status;
  return JSON.stringify(rest);
}

export function areStoriesContentEqual(
  a: ClientStoryDetail | null,
  b: ClientStoryDetail | null
): boolean {
  if (!a || !b) return false;
  return normalizeForCompare(a) === normalizeForCompare(b);
}

export function readLocalStoryDrafts(): Record<string, LocalStoryDraftEntry> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(LOCAL_STORY_DRAFTS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    const out: Record<string, LocalStoryDraftEntry> = {};
    for (const [key, val] of Object.entries(parsed as Record<string, unknown>)) {
      if (val && typeof val === 'object') {
        const entry = val as Partial<LocalStoryDraftEntry>;
        if (entry.draftStory && typeof entry.draftStory === 'object') {
          out[key] = {
            storyKey: entry.storyKey || key,
            draftStory: stripDraftMeta(entry.draftStory),
            savedAt: entry.savedAt || new Date().toISOString(),
            isNew: Boolean(entry.isNew),
          };
        }
      }
    }
    return out;
  } catch {
    return {};
  }
}

export function writeLocalStoryDraft(
  storyKey: string,
  story: ClientStoryDetail
): LocalStoryDraftEntry | null {
  if (typeof window === 'undefined' || !storyKey) return null;
  try {
    const existing = readLocalStoryDrafts();
    const entry: LocalStoryDraftEntry = {
      storyKey,
      draftStory: stripDraftMeta(story),
      savedAt: new Date().toISOString(),
      isNew: false,
    };
    existing[storyKey] = entry;
    window.localStorage.setItem(LOCAL_STORY_DRAFTS_KEY, JSON.stringify(existing));
    return entry;
  } catch {
    return null;
  }
}

export function removeLocalStoryDraft(
  storyKey: string
): Record<string, LocalStoryDraftEntry> {
  if (typeof window === 'undefined' || !storyKey) return {};
  try {
    const existing = readLocalStoryDrafts();
    if (storyKey in existing) {
      delete existing[storyKey];
      window.localStorage.setItem(LOCAL_STORY_DRAFTS_KEY, JSON.stringify(existing));
    }
    return existing;
  } catch {
    return readLocalStoryDrafts();
  }
}

export function readNewStoryLocalDraft(): LocalStoryDraftEntry | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(LOCAL_NEW_STORY_DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<LocalStoryDraftEntry>;
    if (!parsed || !parsed.draftStory || typeof parsed.draftStory !== 'object') {
      return null;
    }
    return {
      storyKey: parsed.storyKey || parsed.draftStory.slug || 'new-story',
      draftStory: stripDraftMeta(parsed.draftStory),
      savedAt: parsed.savedAt || new Date().toISOString(),
      isNew: true,
    };
  } catch {
    return null;
  }
}

export function writeNewStoryLocalDraft(
  story: ClientStoryDetail
): LocalStoryDraftEntry | null {
  if (typeof window === 'undefined') return null;
  try {
    const entry: LocalStoryDraftEntry = {
      storyKey: story.slug || 'new-story',
      draftStory: stripDraftMeta(story),
      savedAt: new Date().toISOString(),
      isNew: true,
    };
    window.localStorage.setItem(LOCAL_NEW_STORY_DRAFT_KEY, JSON.stringify(entry));
    return entry;
  } catch {
    return null;
  }
}

export function clearNewStoryLocalDraft(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(LOCAL_NEW_STORY_DRAFT_KEY);
  } catch {}
}

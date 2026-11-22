export type MediaType = 'image' | 'video' | 'document' | 'audio' | 'archive' | 'other';

export interface MediaItem {
  key: string;
  url: string;
  filename: string;
  size: number;
  lastModified?: string | Date;
  mediaType: MediaType;
  format: string;
  thumbnailUrl?: string | null;
  alt?: string;
  title?: string;
  caption?: string;
  folder?: string;
  physicalFolder?: string;
  isVirtualFolder?: boolean;
  uploadedBy?: string;
  width?: number;
  height?: number;
}

export type SortOption =
  | 'newest'
  | 'oldest'
  | 'size-desc'
  | 'size-asc'
  | 'name-asc'
  | 'name-desc';

export interface FolderOption {
  id: string;
  labelEn: string;
  labelAr: string;
  parentId?: string;
  isCustom?: boolean;
  count?: number;
  directCount?: number;
}

export const DEFAULT_FOLDERS: FolderOption[] = [
  { id: '', labelEn: 'All Folders', labelAr: 'كل المجلدات', parentId: '' },
  { id: 'heroes', labelEn: 'Hero Banners', labelAr: 'بانرات الواجهة', parentId: '' },
  { id: 'projects', labelEn: 'Projects', labelAr: 'المشاريع', parentId: '' },
  { id: 'solutions', labelEn: 'Solutions', labelAr: 'الحلول والخدمات', parentId: '' },
  { id: 'industries', labelEn: 'Industries', labelAr: 'القطاعات', parentId: '' },
  { id: 'team', labelEn: 'Leadership & Team', labelAr: 'فريق العمل', parentId: '' },
  { id: 'logos', labelEn: 'Client Logos', labelAr: 'شعارات العملاء', parentId: '' },
  { id: 'clients', labelEn: 'Clients', labelAr: 'العملاء', parentId: '' },
  { id: 'videos', labelEn: 'Showreels & Videos', labelAr: 'الفيديوهات والعروض', parentId: '' },
  { id: 'documents', labelEn: 'Documents & PDFs', labelAr: 'المستندات والـ PDF', parentId: '' },
  { id: 'resumes', labelEn: 'Candidate Dossiers', labelAr: 'السير الذاتية', parentId: '' },
  { id: 'general', labelEn: 'General Storage', labelAr: 'التخزين العام', parentId: '' },
];

// Backwards-compatible export alias
export const FOLDERS: FolderOption[] = DEFAULT_FOLDERS;

export const MAX_FOLDER_DEPTH = 3;

export function sanitizeFolderSegment(segment: string): string {
  return segment
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function normalizeFolderPath(rawPath: string): string {
  if (!rawPath) return '';
  const segments = rawPath
    .trim()
    .split('/')
    .map((s) => s.trim())
    .filter((s) => Boolean(s) && s !== '.' && s !== '..')
    .slice(0, MAX_FOLDER_DEPTH);
  return segments.join('/');
}

export function getParentFolderPath(folderId: string): string {
  const clean = normalizeFolderPath(folderId);
  if (!clean || !clean.includes('/')) return '';
  return clean.substring(0, clean.lastIndexOf('/'));
}

export function getFolderDepth(folderId: string): number {
  const clean = normalizeFolderPath(folderId);
  if (!clean) return 0;
  return clean.split('/').length;
}

export function getFolderBreadcrumbTrail(
  folderId: string,
  allFolders: FolderOption[]
): FolderOption[] {
  const clean = normalizeFolderPath(folderId);
  const root = allFolders.find((f) => f.id === '') || DEFAULT_FOLDERS[0];
  if (!clean) return [root];

  const segments = clean.split('/');
  const trail: FolderOption[] = [root];
  let acc = '';
  for (const seg of segments) {
    acc = acc ? `${acc}/${seg}` : seg;
    const match = allFolders.find((f) => f.id === acc);
    trail.push(
      match || {
        id: acc,
        labelEn: seg,
        labelAr: seg,
        parentId: getParentFolderPath(acc),
      }
    );
  }
  return trail;
}

export function formatFolderDisplayPath(
  folderId: string,
  allFolders: FolderOption[],
  isRtl = false
): string {
  if (!folderId) {
    const root = allFolders.find((f) => f.id === '') || DEFAULT_FOLDERS[0];
    return isRtl ? root.labelAr : root.labelEn;
  }
  const trail = getFolderBreadcrumbTrail(folderId, allFolders).slice(1);
  if (trail.length === 0) return folderId;
  return trail.map((f) => (isRtl ? f.labelAr : f.labelEn)).join(' / ');
}

export interface MediaUrlSyncReport {
  oldUrl: string;
  newUrl: string;
  updatedCollections: Array<{ collection: string; count: number }>;
  updatedDocumentsCount: number;
  totalReplacements: number;
}

export interface MediaUrlUsageItem {
  collection: string;
  documentId: string;
  label: string;
  occurrences: number;
}

export interface MediaUrlUsageSummary {
  url: string;
  totalUsages: number;
  usages: MediaUrlUsageItem[];
}

export interface TypeFilterOption {
  id: string;
  labelEn: string;
  labelAr: string;
}

export const TYPE_FILTERS: TypeFilterOption[] = [
  { id: 'all', labelEn: 'All Files', labelAr: 'جميع الملفات' },
  { id: 'image', labelEn: 'Images', labelAr: 'الصور' },
  { id: 'video', labelEn: 'Videos', labelAr: 'الفيديوهات' },
  { id: 'document', labelEn: 'Documents & PDFs', labelAr: 'المستندات والـ PDF' },
  { id: 'audio', labelEn: 'Audio', labelAr: 'الصوتيات' },
  { id: 'archive', labelEn: 'Archives', labelAr: 'الملفات المضغوطة' },
];

export type ImageUploadQualityMode = 'high-webp' | 'reduced-webp';

export interface MediaStorageBrowserProps {
  mode?: 'standalone' | 'picker';
  multiple?: boolean;
  allowedType?: 'all' | MediaType;
  defaultFolder?: string;
  defaultQualityMode?: ImageUploadQualityMode;
  onSelect?: (url: string, item: MediaItem) => void;
  onSelectMultiple?: (urls: string[], items: MediaItem[]) => void;
  onClose?: () => void;
  onMediaMutated?: () => void;
  className?: string;
}

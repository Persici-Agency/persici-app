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
}

export const FOLDERS: FolderOption[] = [
  { id: '', labelEn: 'All Folders', labelAr: 'كل المجلدات' },
  { id: 'heroes', labelEn: 'Hero Banners', labelAr: 'بانرات الواجهة' },
  { id: 'projects', labelEn: 'Projects', labelAr: 'المشاريع' },
  { id: 'solutions', labelEn: 'Solutions', labelAr: 'الحلول والخدمات' },
  { id: 'industries', labelEn: 'Industries', labelAr: 'القطاعات' },
  { id: 'team', labelEn: 'Leadership & Team', labelAr: 'فريق العمل' },
  { id: 'logos', labelEn: 'Client Logos', labelAr: 'شعارات العملاء' },
  { id: 'clients', labelEn: 'Clients', labelAr: 'العملاء' },
  { id: 'videos', labelEn: 'Showreels & Videos', labelAr: 'الفيديوهات والعروض' },
  { id: 'documents', labelEn: 'Documents & PDFs', labelAr: 'المستندات والـ PDF' },
  { id: 'resumes', labelEn: 'Candidate Dossiers', labelAr: 'السير الذاتية' },
  { id: 'general', labelEn: 'General Storage', labelAr: 'التخزين العام' },
];

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

export interface MediaStorageBrowserProps {
  mode?: 'standalone' | 'picker';
  allowedType?: 'all' | MediaType;
  defaultFolder?: string;
  onSelect?: (url: string, item: MediaItem) => void;
  onClose?: () => void;
  className?: string;
}

export type Jurisdiction = 'global' | 'uae' | 'ksa' | 'jordan';

export interface LegalClause {
  id: string;
  title: {
    en: string;
    ar: string;
  };
  jurisdiction?: Jurisdiction;
  content: {
    en: string[];
    ar: string[];
  };
  subsections?: {
    subtitle: {
      en: string;
      ar: string;
    };
    jurisdiction?: Jurisdiction;
    points: {
      en: string[];
      ar: string[];
    };
  }[];
  highlightBox?: {
    title: {
      en: string;
      ar: string;
    };
    body: {
      en: string;
      ar: string;
    };
    jurisdiction: Jurisdiction;
  };
}

export interface LegalDocumentData {
  documentType: 'privacy' | 'terms';
  title: {
    en: string;
    ar: string;
  };
  subtitle: {
    en: string;
    ar: string;
  };
  effectiveDate: {
    en: string;
    ar: string;
  };
  version: string;
  officerEmail: string;
  operatingEntities: {
    region: string;
    legalName: {
      en: string;
      ar: string;
    };
    address: {
      en: string;
      ar: string;
    };
    governingAuthority: {
      en: string;
      ar: string;
    };
  }[];
  clauses: LegalClause[];
}

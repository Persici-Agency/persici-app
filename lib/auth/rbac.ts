export type UserRole = 'admin' | 'editor' | 'author' | 'media buying' | 'hr';

export interface DashboardUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt?: string | Date;
  lastLogin?: string | Date;
}

export type Resource =
  | 'pages'
  | 'navigation'
  | 'media'
  | 'insights'
  | 'projects'
  | 'reviews'
  | 'leads'
  | 'careers_ats'
  | 'users'
  | 'settings';

export type Action = 'create' | 'read' | 'update' | 'delete';

const PERMISSIONS: Record<UserRole, Partial<Record<Resource, Action[]>>> = {
  admin: {
    pages: ['create', 'read', 'update', 'delete'],
    navigation: ['create', 'read', 'update', 'delete'],
    media: ['create', 'read', 'update', 'delete'],
    insights: ['create', 'read', 'update', 'delete'],
    projects: ['create', 'read', 'update', 'delete'],
    reviews: ['create', 'read', 'update', 'delete'],
    leads: ['create', 'read', 'update', 'delete'],
    careers_ats: ['create', 'read', 'update', 'delete'],
    users: ['create', 'read', 'update', 'delete'],
    settings: ['create', 'read', 'update', 'delete'],
  },
  editor: {
    pages: ['create', 'read', 'update', 'delete'],
    navigation: ['create', 'read', 'update', 'delete'],
    media: ['create', 'read', 'update', 'delete'],
    insights: ['create', 'read', 'update', 'delete'],
    projects: ['create', 'read', 'update', 'delete'],
    reviews: ['create', 'read', 'update', 'delete'],
    leads: [],
    careers_ats: [],
    users: [],
    settings: ['read'],
  },
  author: {
    pages: ['read'],
    navigation: ['read'],
    media: ['create', 'read'],
    insights: ['create', 'read', 'update', 'delete'],
    projects: ['create', 'read', 'update', 'delete'],
    reviews: ['read'],
    leads: [],
    careers_ats: [],
    users: [],
    settings: [],
  },
  'media buying': {
    pages: ['read'],
    navigation: ['read'],
    media: ['read'],
    insights: ['read'],
    projects: ['read'],
    reviews: ['read'],
    leads: ['create', 'read', 'update', 'delete'],
    careers_ats: [],
    users: [],
    settings: [],
  },
  hr: {
    pages: [],
    navigation: [],
    media: ['read'],
    insights: [],
    projects: [],
    reviews: [],
    leads: [],
    careers_ats: ['create', 'read', 'update', 'delete'],
    users: [],
    settings: [],
  },
};

/**
 * Checks if a given role has permission to perform an action on a resource.
 */
export function hasPermission(role: UserRole, resource: Resource, action: Action = 'read'): boolean {
  if (role === 'admin') return true;
  const rolePerms = PERMISSIONS[role];
  if (!rolePerms) return false;
  const actions = rolePerms[resource];
  if (!actions) return false;
  return actions.includes(action);
}

/**
 * Validates whether a user role is permitted for a dashboard section.
 */
export function isRoleAllowed(role: UserRole, allowedRoles: UserRole[]): boolean {
  if (role === 'admin') return true;
  return allowedRoles.includes(role);
}

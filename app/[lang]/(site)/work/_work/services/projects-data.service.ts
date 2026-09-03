import type { ProjectItem } from '@shared/types';
import { projectsList } from '@shared/data';
import { getDbProjects } from '@shared/services/db.service';

export type { ProjectItem };
export { projectsList };

/**
 * Returns static projects list synchronously.
 */
export function getProjectsList(): ProjectItem[] {
  return projectsList;
}

/**
 * Fetches projects from MongoDB with automatic fallback to static projectsList.
 */
export async function fetchProjectsList(): Promise<ProjectItem[]> {
  return getDbProjects();
}

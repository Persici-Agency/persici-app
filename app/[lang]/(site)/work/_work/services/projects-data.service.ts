import type { ProjectItem } from '@shared/types';
import { projectsList } from '@shared/data';

export type { ProjectItem };
export { projectsList };

export function getProjectsList(): ProjectItem[] {
  return projectsList;
}

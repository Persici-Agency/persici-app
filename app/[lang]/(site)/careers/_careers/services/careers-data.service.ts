import type { JobOpening } from '@shared/types';
import { jobOpenings } from '@shared/data';

export type { JobOpening };
export { jobOpenings };

export function getJobOpenings(): JobOpening[] {
  return jobOpenings;
}

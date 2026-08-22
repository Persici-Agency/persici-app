import type { ClientLogo } from '@shared/types';
import { clientLogos } from '@shared/data';

export type { ClientLogo };
export { clientLogos };

export function getClientLogos(): ClientLogo[] {
  return clientLogos;
}

import type { ClientLogo } from '../types';
import { clientLogos } from '../data';

export type { ClientLogo };
export { clientLogos };

export function getClientLogos(): ClientLogo[] {
  return clientLogos;
}

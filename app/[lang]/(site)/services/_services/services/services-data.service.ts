import type { ServiceItem } from '@shared/types';
import { servicesList } from '@shared/data';

export type { ServiceItem };
export { servicesList };

export function getServicesList(): ServiceItem[] {
  return servicesList;
}

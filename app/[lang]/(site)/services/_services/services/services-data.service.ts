import type { ServiceItem } from '@shared/types';
import { servicesList } from '@shared/data';
import { getDbServices } from '@shared/services/db.service';

export type { ServiceItem };
export { servicesList };

/**
 * Returns static services list synchronously.
 */
export function getServicesList(): ServiceItem[] {
  return servicesList;
}

/**
 * Fetches services from MongoDB with automatic fallback to static servicesList.
 */
export async function fetchServicesList(): Promise<ServiceItem[]> {
  return getDbServices();
}

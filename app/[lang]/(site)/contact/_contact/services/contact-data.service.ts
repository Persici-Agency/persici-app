import type { ContactOffice } from '@shared/types';
import { contactOffices } from '@shared/data';

export type { ContactOffice };
export { contactOffices };

export function getContactOffices(): ContactOffice[] {
  return contactOffices;
}

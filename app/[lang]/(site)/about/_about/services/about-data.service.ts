import type { AboutValueItem, ValueItem } from '@shared/types';
import { aboutValues } from '@shared/data';

export type { AboutValueItem, ValueItem };
export { aboutValues };

export function getAboutValues(): AboutValueItem[] {
  return aboutValues;
}

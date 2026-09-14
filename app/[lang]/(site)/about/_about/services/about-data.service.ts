import type { AboutValueItem, ValueItem } from '@shared/types';
import { aboutValues } from '@shared/data';
import { aboutPageData, type AboutPageData } from '../data/about.data';

export type { AboutValueItem, ValueItem, AboutPageData };
export { aboutValues, aboutPageData };

export function getAboutValues(): AboutValueItem[] {
  return aboutValues;
}

export function getStaticAboutPageData(): AboutPageData {
  return aboutPageData;
}

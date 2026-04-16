// Brand KB loader
// Imports all per-brand knowledge base strings and exposes a getter
// that returns the brand KB to load into Tammy's chat context.

import { CROSS_BRAND_KB } from './cross-brand.js';
import { BEST_WESTERN_KB } from './best-western.js';
import { CHOICE_KB } from './choice.js';
import { HILTON_KB } from './hilton.js';
import { HYATT_KB } from './hyatt.js';
import { IHG_KB } from './ihg.js';
import { MARRIOTT_KB } from './marriott.js';
import { WYNDHAM_KB } from './wyndham.js';

export const BRAND_KB_MAP = {
  'cross-brand': CROSS_BRAND_KB,
  'best-western': BEST_WESTERN_KB,
  'choice': CHOICE_KB,
  'hilton': HILTON_KB,
  'hyatt': HYATT_KB,
  'ihg': IHG_KB,
  'marriott': MARRIOTT_KB,
  'wyndham': WYNDHAM_KB,
};

export function getBrandKB(slug) {
  return BRAND_KB_MAP[slug] || null;
}

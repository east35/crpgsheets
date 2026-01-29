// Re-export gear data and lookup functions
import { GEAR_DATA, findGearByName, type GearInfo } from './gear-from-wiki';
import helmetItems from './helmets.json';

interface HelmetItem {
  id: string;
  name: string;
  wikiUrl?: string;
  images?: string[];
  slot?: string;
  type?: string;
  rarity?: string;
  requirements?: string[];
  effect?: string;
  flavorText?: string;
  keywords?: string[];
}

const HELMET_BASE_URL = 'https://roguetrader.wiki.fextralife.com';

function toKey(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
}

function normalizeImage(url?: string): string | undefined {
  if (!url) return undefined;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/')) return `${HELMET_BASE_URL}${url}`;
  return url;
}

function buildHelmetMap(items: HelmetItem[]): Record<string, GearInfo> {
  const map: Record<string, GearInfo> = {};
  for (const item of items) {
    if (!item.name) continue;
    const stats: Record<string, string> = {};
    if (item.slot) stats.slot = item.slot;
    if (item.rarity) stats.rarity = item.rarity;
    if (item.requirements?.length) stats.requirements = item.requirements.join('; ');
    if (item.keywords?.length) stats.keywords = item.keywords.join(', ');

    const imageRemote = normalizeImage(item.images?.[0]);
    map[toKey(item.name)] = {
      name: item.name,
      type: 'accessory',
      effect: item.effect || item.flavorText || '',
      stats,
      wikiUrl: item.wikiUrl,
      ...(imageRemote ? { imageRemote } : {}),
    };
  }
  return map;
}

const HELMET_GEAR_DATA = buildHelmetMap(helmetItems as HelmetItem[]);

export type { GearInfo };
export { GEAR_DATA, findGearByName as findGear };

// Get gear info by name
export function getGearInfo(name: string): GearInfo | undefined {
  const helmet = HELMET_GEAR_DATA[toKey(name)];
  if (helmet) return helmet;
  return findGearByName(name);
}

// Get gear description for tooltip display
export function getGearDescription(name: string): string | undefined {
  const gear = HELMET_GEAR_DATA[toKey(name)] || findGearByName(name);
  return gear?.effect;
}

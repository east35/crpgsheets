// Import from wiki-parsed talents (857 talents from Fextralife)
import { WIKI_TALENTS, findTalent as findWikiTalent, type WikiTalent } from './talents-from-wiki';
// Import from wiki-parsed abilities (200 abilities from Fextralife)
import { WIKI_ABILITIES, findAbility, type WikiAbility } from './abilities-from-wiki';
// Import icon mapping
import { getTalentIcon } from './icon-map';

// Unified type for both talents and abilities
export interface TalentInfo {
  name: string;
  effect: string;
  source: string[];
  cost?: string;
  target?: string;
  iconPath?: string;
}

// Convert WikiTalent to TalentInfo
function talentToInfo(talent: WikiTalent): TalentInfo {
  const iconFile = getTalentIcon(talent.name);
  return {
    name: talent.name,
    effect: talent.effect,
    source: talent.source,
    iconPath: iconFile ? `/talent-icons/${iconFile}` : undefined,
  };
}

// Convert WikiAbility to TalentInfo
function abilityToInfo(ability: WikiAbility): TalentInfo {
  const iconFile = getTalentIcon(ability.name);
  return {
    name: ability.name,
    effect: ability.effect,
    source: ability.archetype ? [ability.archetype] : [],
    cost: ability.cost || undefined,
    target: ability.target || undefined,
    iconPath: iconFile ? `/talent-icons/${iconFile}` : undefined,
  };
}

// Get talent/ability info by name - checks abilities first (more specific), then talents
export function getTalentInfo(name: string): TalentInfo | undefined {
  // Try abilities first (they have more specific info like cost/target)
  const ability = findAbility(name);
  if (ability) {
    return abilityToInfo(ability);
  }
  
  // Fall back to talents
  const talent = findWikiTalent(name);
  if (talent) {
    return talentToInfo(talent);
  }
  
  return undefined;
}

// Get talent description for tooltip display
export function getTalentDescription(name: string): string | undefined {
  const info = getTalentInfo(name);
  return info?.effect;
}

// Get talent source (which archetype/class it comes from)
export function getTalentSource(name: string): string[] | undefined {
  const info = getTalentInfo(name);
  return info?.source;
}

// Get all talents that match any of the given sources
export function getTalentsBySource(sources: string[]): TalentInfo[] {
  const results: TalentInfo[] = [];
  const seen = new Set<string>();
  
  // Check wiki talents
  for (const talent of Object.values(WIKI_TALENTS)) {
    if (seen.has(talent.name)) continue;
    const matchesSource = talent.source.some(s => sources.includes(s));
    if (matchesSource) {
      results.push(talentToInfo(talent));
      seen.add(talent.name);
    }
  }
  
  // Check abilities
  for (const ability of Object.values(WIKI_ABILITIES)) {
    if (seen.has(ability.name)) continue;
    const abilitySource = ability.archetype || '';
    if (sources.includes(abilitySource)) {
      results.push(abilityToInfo(ability));
      seen.add(ability.name);
    }
  }
  
  // Sort alphabetically
  return results.sort((a, b) => a.name.localeCompare(b.name));
}

// Re-export for direct access if needed
export { WIKI_TALENTS, WIKI_ABILITIES, findWikiTalent, findAbility };

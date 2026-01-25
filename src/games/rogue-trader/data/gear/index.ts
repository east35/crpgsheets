// Re-export gear data and lookup functions
import { GEAR_DATA, findGearByName, type GearInfo } from './gear-from-wiki';

export type { GearInfo };
export { GEAR_DATA, findGearByName as findGear };

// Get gear info by name
export function getGearInfo(name: string): GearInfo | undefined {
  return findGearByName(name);
}

// Get gear description for tooltip display
export function getGearDescription(name: string): string | undefined {
  const gear = findGearByName(name);
  return gear?.effect;
}

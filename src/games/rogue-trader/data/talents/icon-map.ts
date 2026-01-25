// Icon mapping for talents and abilities
// Icons are served from /talent-icons/ in the public folder

export const TALENT_ICONS: Record<string, string> = {
  'above the thundering guns': 'above_the_thundering_guns_talents_warhammer_40k_rogue_trader.png',
  'absolution': 'absolution_talents_warhammer_40k_rogue_trader_wiki_guide_128.png',
  'at all costs!': 'at_all_costs!_abilities_warhammer_40k_rogue_trader_wiki_guid.png',
  'biomancy': 'biomancy_psyker_abilities_warhammer_40k_rogue_trader_wiki_gu.png',
  'biophysical distortion': 'biophysical_distortion_talents_warhammer_40k_rogue_trader_wi.png',
  'break through': 'break_through_warrior_abilities_warhammer_40k_rogue_trader_w.png',
  'charge': 'charge_abilities_warhammer_40k_rogue_trader_wiki_guide_64px.png',
  'claim the bounty': 'claim_the_bounty_bounty_hunter_abilities_warhammer_40k_rogue.png',
  'combat locus stratagem': 'combat_locus_stratagem_grand_strategist_abilities_warhammer_.png',
  'consolidation': 'consolidation_ability_icon-rogue-trader-wiki-guide.jpg',
  'courage and steel': 'courage_and_steel_talents_warhammer_40k_rogue_trader_wiki_gu.png',
  'daemonopathy': 'daemonopathy_talents_warhammer_40k_rogue_trader_wiki_guide_1.png',
  'destroy the weak': 'destroy_the_weak_talents_warhammer_40k_rogue_trader_wiki_gui.png',
  'dismantling attack': 'dismantling_attack_desperate_psyker_abilities_warhammer_40k_.png',
  'excellence': 'excellence_talents_warhammer_40k_rogue_trader_wiki_guide_128.png',
  'gifts of the warp': 'gifts_of_the_warp_talents_warhammer_40k_rogue_trader_wiki_gu.png',
  'grim determination': 'grim_determination_talents_warhammer_40k_rogue_trader_wiki_g.png',
  'hot on the trail': 'hot_on_the_trail_bounty_hunter_abilities_warhammer_40k_rogue.png',
  'hunt down the prey': 'hunt_down_the_prey_abilities_warhammer_40k_rogue_trader_wiki.png',
  'instrument of his will': 'instrument_of_his_will_talents_warhammer_40k_rogue_trader_wi.png',
  'killzone stratagem': 'killzone_stratagem_grand_strategist_abilities_warhammer_40k_.png',
  'litany of hatred': 'litany_of_hatred_talents_warhammer_40k_rogue_trader_wiki_gui.png',
  'master of command': 'master_of_command_talents_warhammer_40k_rogue_trader_wiki_gu.png',
  'metabolic overcharge': 'metabolic_overcharge_psyker_abilities_warhammer_40k_rogue_tr.png',
  'path of redemption': 'path_of_redemption_talents_warhammer_40k_rogue_trader_wiki_g.png',
  'piercing resolution': 'piercing_resolution_talents_warhammer_40k_rogue_trader_wiki_.png',
  'power from beyond the veil': 'power_from_beyond_the_veil_talents_warhammer_40k_rogue_trade.png',
  'resource preservation': 'resource_preservation_talents_warhammer_40k_rogue_trader_wik.png',
  'sanguine siphon': 'sanguine_siphon_talents_warhammer_40k_rogue_trader_wiki_guid.png',
  'shot on the run': 'shot_on_the_run_talents_warhammer_40k_rogue_trader_wiki_guid.png',
  'show the path': 'show_the_path_officer_abilities_warhammer_40k_rogue_trader_w.png',
  'transcend the potential': 'transcend_the_potential_talents_warhammer_40k_rogue_trader_w.png',
  'wall of rockcrete': 'wall_of_rockcrete_vanguard_abilities_warhammer_40k_rogue_tra.png',
};

// Get icon path for a talent/ability name
export function getTalentIcon(name: string): string | undefined {
  const normalizedName = name.toLowerCase().trim();
  
  // Try exact match first
  if (TALENT_ICONS[normalizedName]) {
    return TALENT_ICONS[normalizedName];
  }
  
  // Try partial match
  for (const [key, iconPath] of Object.entries(TALENT_ICONS)) {
    if (key.includes(normalizedName) || normalizedName.includes(key)) {
      return iconPath;
    }
  }
  
  return undefined;
}

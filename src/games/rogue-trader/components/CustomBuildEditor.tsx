import { useState, useMemo } from 'react';
import type { CompanionName, BaseArchetype, AdvancedArchetype, LevelChoice } from '../types';
import { ARCHETYPE_DISPLAY_NAMES } from '../types';
import { ARCHETYPE_PROGRESSION, COMPANION_DEFAULT_ARCHETYPES, COMPANION_START_LEVELS, getArchetypeTier, getValidSourcesForLevel } from '../data/archetypes';
import { getTalentsBySource } from '../data/talents';
import { TalentTooltip } from './TalentTooltip';
import './CustomBuildEditor.css';

interface CustomBuildEditorProps {
  companion: CompanionName;
  onSave: (buildData: CustomBuildData) => void;
  onCancel: () => void;
  existingBuild?: CustomBuildData;
}

export interface CustomBuildData {
  companion: CompanionName;
  buildName: string;
  baseArchetype: BaseArchetype;
  advancedArchetype: AdvancedArchetype;
  progression: LevelChoice[];
  notes?: string;
}

const COMPANIONS: CompanionName[] = [
  'RogueTrader', 'Abelard', 'Argenta', 'Idira', 'Pasqal', 'Cassia',
  'Heinrix', 'Jae', 'Yrliet', 'Marazhai', 'Ulfar'
];

const BASE_ARCHETYPES: BaseArchetype[] = ['warrior', 'operative', 'soldier', 'officer', 'bladeDancer'];

export function CustomBuildEditor({ companion: initialCompanion, onSave, onCancel, existingBuild }: CustomBuildEditorProps) {
  const [companion, setCompanion] = useState<CompanionName>(existingBuild?.companion || initialCompanion);
  const [buildName, setBuildName] = useState(existingBuild?.buildName || '');
  const [baseArchetype, setBaseArchetype] = useState<BaseArchetype>(
    existingBuild?.baseArchetype || COMPANION_DEFAULT_ARCHETYPES[companion]
  );
  const [advancedArchetype, setAdvancedArchetype] = useState<AdvancedArchetype>(
    existingBuild?.advancedArchetype || ARCHETYPE_PROGRESSION[baseArchetype][0]
  );
  const [progression, setProgression] = useState<LevelChoice[]>(existingBuild?.progression || []);
  const [notes, setNotes] = useState(existingBuild?.notes || '');
  const [editingLevel, setEditingLevel] = useState<number | null>(null);
  const [talentSearch, setTalentSearch] = useState('');

  const startLevel = COMPANION_START_LEVELS[companion];
  const availableAdvanced = ARCHETYPE_PROGRESSION[baseArchetype];

  // Get talents available for the currently editing level
  const availableTalents = useMemo(() => {
    if (editingLevel === null) return [];
    const sources = getValidSourcesForLevel(editingLevel, baseArchetype, advancedArchetype);
    return getTalentsBySource(sources);
  }, [editingLevel, baseArchetype, advancedArchetype]);

  const filteredTalents = useMemo(() => {
    if (!talentSearch) return availableTalents;
    const search = talentSearch.toLowerCase();
    return availableTalents.filter(t => 
      t.name.toLowerCase().includes(search) || 
      t.effect.toLowerCase().includes(search)
    );
  }, [availableTalents, talentSearch]);

  // Get talents selected for a specific level
  const getTalentsForLevel = (level: number): string[] => {
    const levelData = progression.find(p => p.level === level);
    return levelData?.talents || [];
  };

  // Add/remove talent for a level
  const toggleTalent = (level: number, talentName: string) => {
    setProgression(prev => {
      const existing = prev.find(p => p.level === level);
      if (existing) {
        const hasTalent = existing.talents.includes(talentName);
        if (hasTalent) {
          // Remove talent
          const newTalents = existing.talents.filter(t => t !== talentName);
          if (newTalents.length === 0 && !existing.statIncrease) {
            // Remove the whole level entry if empty
            return prev.filter(p => p.level !== level);
          }
          return prev.map(p => p.level === level ? { ...p, talents: newTalents } : p);
        } else {
          // Add talent
          return prev.map(p => p.level === level ? { ...p, talents: [...p.talents, talentName] } : p);
        }
      } else {
        // Create new level entry
        return [...prev, { level, talents: [talentName] }].sort((a, b) => a.level - b.level);
      }
    });
  };

  // Handle base archetype change
  const handleBaseArchetypeChange = (newBase: BaseArchetype) => {
    setBaseArchetype(newBase);
    // Reset advanced to first valid option
    setAdvancedArchetype(ARCHETYPE_PROGRESSION[newBase][0]);
    // Clear progression for levels that would be affected
    setProgression(prev => prev.filter(p => p.level <= 15));
  };

  // Handle companion change
  const handleCompanionChange = (newCompanion: CompanionName) => {
    setCompanion(newCompanion);
    setBaseArchetype(COMPANION_DEFAULT_ARCHETYPES[newCompanion]);
    setAdvancedArchetype(ARCHETYPE_PROGRESSION[COMPANION_DEFAULT_ARCHETYPES[newCompanion]][0]);
    setProgression([]);
  };

  const handleSave = () => {
    if (!buildName.trim()) {
      alert('Please enter a build name');
      return;
    }
    onSave({
      companion,
      buildName: buildName.trim(),
      baseArchetype,
      advancedArchetype,
      progression,
      notes: notes.trim() || undefined,
    });
  };

  // Generate level rows
  const levelRows = [];
  for (let level = startLevel; level <= 55; level++) {
    const tier = getArchetypeTier(level);
    const isTierStart = level === startLevel || level === 16 || level === 36;
    const talents = getTalentsForLevel(level);
    
    levelRows.push(
      <div key={level}>
        {isTierStart && (
          <div className={`tier-divider ${tier}`}>
            {tier === 'base' && ARCHETYPE_DISPLAY_NAMES[baseArchetype]}
            {tier === 'advanced' && ARCHETYPE_DISPLAY_NAMES[advancedArchetype]}
            {tier === 'exemplar' && 'Exemplar'}
            {' '}(Levels {tier === 'base' ? `${startLevel}-15` : tier === 'advanced' ? '16-35' : '36-55'})
          </div>
        )}
        <div 
          className={`level-row ${tier} ${editingLevel === level ? 'editing' : ''}`}
          onClick={() => setEditingLevel(editingLevel === level ? null : level)}
        >
          <div className="level-number">Lv {level}</div>
          <div className="level-talents">
            {talents.length > 0 ? (
              talents.map((t, i) => (
                <TalentTooltip key={i} talentName={t}>
                  <span className="selected-talent">{t}</span>
                </TalentTooltip>
              ))
            ) : (
              <span className="no-talents">Click to add talents</span>
            )}
          </div>
        </div>
        
        {editingLevel === level && (
          <div className="talent-picker">
            <input
              type="text"
              placeholder="Search talents..."
              value={talentSearch}
              onChange={(e) => setTalentSearch(e.target.value)}
              className="talent-search"
              autoFocus
            />
            <div className="talent-list">
              {filteredTalents.slice(0, 50).map(talent => (
                <div 
                  key={talent.name}
                  className={`talent-option ${talents.includes(talent.name) ? 'selected' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleTalent(level, talent.name);
                  }}
                >
                  <span className="talent-name">{talent.name}</span>
                  <span className="talent-source">{talent.source.join(', ')}</span>
                </div>
              ))}
              {filteredTalents.length > 50 && (
                <div className="more-talents">
                  +{filteredTalents.length - 50} more talents (refine search)
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="custom-build-editor">
      <div className="editor-header">
        <h2>{existingBuild ? 'Edit Custom Build' : 'Create Custom Build'}</h2>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave}>Save Build</button>
        </div>
      </div>

      <div className="editor-form">
        <div className="form-row">
          <label>
            Companion
            <select value={companion} onChange={(e) => handleCompanionChange(e.target.value as CompanionName)}>
              {COMPANIONS.map(c => (
                <option key={c} value={c}>{c === 'RogueTrader' ? 'Rogue Trader' : c}</option>
              ))}
            </select>
          </label>
          
          <label>
            Build Name
            <input
              type="text"
              value={buildName}
              onChange={(e) => setBuildName(e.target.value)}
              placeholder="e.g., Tank Build, DPS Build..."
            />
          </label>
        </div>

        <div className="form-row">
          <label>
            Base Archetype (Lv 1-15)
            <select value={baseArchetype} onChange={(e) => handleBaseArchetypeChange(e.target.value as BaseArchetype)}>
              {BASE_ARCHETYPES.map(a => (
                <option key={a} value={a}>{ARCHETYPE_DISPLAY_NAMES[a]}</option>
              ))}
            </select>
          </label>
          
          <label>
            Advanced Archetype (Lv 16-35)
            <select value={advancedArchetype} onChange={(e) => setAdvancedArchetype(e.target.value as AdvancedArchetype)}>
              {availableAdvanced.map(a => (
                <option key={a} value={a}>{ARCHETYPE_DISPLAY_NAMES[a]}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="form-row full-width">
          <label>
            Notes
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Build strategy, gear notes, etc..."
              rows={2}
            />
          </label>
        </div>
      </div>

      <div className="progression-editor">
        <h3>Level Progression</h3>
        <p className="hint">Click a level to add/remove talents. Talents are filtered by your selected archetypes.</p>
        <div className="level-list">
          {levelRows}
        </div>
      </div>
    </div>
  );
}

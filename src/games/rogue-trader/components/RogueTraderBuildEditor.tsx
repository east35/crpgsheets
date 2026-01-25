import { useState } from 'react';
import type { CharacterBuild } from '../../../types';
import type { RogueTraderCharacter, CompanionName, Archetype, Origin } from '../types';
import { COMPANIONS, ARCHETYPE_DISPLAY_NAMES, ORIGIN_DISPLAY_NAMES } from '../data/companions';

interface RogueTraderBuildEditorProps {
  build: CharacterBuild | null;
  onSave: (name: string, data: RogueTraderCharacter, description?: string) => void;
  onCancel: () => void;
}

const DEFAULT_CHARACTERISTICS = {
  weaponSkill: 30,
  ballisticSkill: 30,
  strength: 30,
  toughness: 30,
  agility: 30,
  intelligence: 30,
  perception: 30,
  willpower: 30,
  fellowship: 30,
};

export function RogueTraderBuildEditor({ build, onSave, onCancel }: RogueTraderBuildEditorProps) {
  const existingData = build?.data as RogueTraderCharacter | undefined;

  const [name, setName] = useState(build?.name || '');
  const [description, setDescription] = useState(build?.description || '');
  const [selectedCompanion, setSelectedCompanion] = useState<CompanionName>(
    existingData?.name as CompanionName || 'Custom'
  );
  const [origin, setOrigin] = useState<Origin>(
    existingData?.origin || COMPANIONS[selectedCompanion]?.origin || 'imperialWorld'
  );
  const [startingArchetype, setStartingArchetype] = useState<Archetype>(
    existingData?.startingArchetype || COMPANIONS[selectedCompanion]?.startingArchetype || 'warrior'
  );
  const [notes, setNotes] = useState(existingData?.notes || '');
  const [guideReference, setGuideReference] = useState(existingData?.guideReference || '');

  const handleCompanionChange = (companion: CompanionName) => {
    setSelectedCompanion(companion);
    if (companion !== 'Custom') {
      const info = COMPANIONS[companion];
      setName(info.fullName);
      setOrigin(info.origin);
      setStartingArchetype(info.startingArchetype);
    }
  };

  const handleSave = () => {
    if (!name.trim()) return;

    const characterData: RogueTraderCharacter = {
      name: selectedCompanion === 'Custom' ? name : COMPANIONS[selectedCompanion].fullName,
      origin,
      startingArchetype,
      currentLevel: existingData?.currentLevel || COMPANIONS[selectedCompanion]?.startingLevel || 1,
      baseCharacteristics: existingData?.baseCharacteristics || DEFAULT_CHARACTERISTICS,
      currentCharacteristics: existingData?.currentCharacteristics || DEFAULT_CHARACTERISTICS,
      levelProgression: existingData?.levelProgression || [],
      talents: existingData?.talents || [],
      skills: existingData?.skills || [],
      notes,
      guideReference,
    };

    onSave(name, characterData, description);
  };

  return (
    <div className="build-editor">
      <h2>{build ? 'Edit Build' : 'New Rogue Trader Build'}</h2>

      <div className="form-section">
        <label>Character</label>
        <select
          value={selectedCompanion}
          onChange={(e) => handleCompanionChange(e.target.value as CompanionName)}
        >
          {Object.entries(COMPANIONS).map(([key, info]) => (
            <option key={key} value={key}>
              {info.fullName}
            </option>
          ))}
        </select>
        {selectedCompanion !== 'Custom' && (
          <p className="helper-text">{COMPANIONS[selectedCompanion].description}</p>
        )}
      </div>

      <div className="form-section">
        <label>Build Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Argenta Bolter Build"
        />
      </div>

      <div className="form-section">
        <label>Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief description of this build"
        />
      </div>

      <div className="form-row">
        <div className="form-section">
          <label>Origin</label>
          <select value={origin} onChange={(e) => setOrigin(e.target.value as Origin)}>
            {Object.entries(ORIGIN_DISPLAY_NAMES).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-section">
          <label>Starting Archetype</label>
          <select
            value={startingArchetype}
            onChange={(e) => setStartingArchetype(e.target.value as Archetype)}
          >
            {Object.entries(ARCHETYPE_DISPLAY_NAMES).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-section">
        <label>Guide Reference URL</label>
        <input
          type="url"
          value={guideReference}
          onChange={(e) => setGuideReference(e.target.value)}
          placeholder="https://example.com/build-guide"
        />
      </div>

      <div className="form-section">
        <label>Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Build notes, level-by-level guide, talent priorities..."
          rows={6}
        />
      </div>

      <div className="form-actions">
        <button className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button className="btn btn-primary" onClick={handleSave} disabled={!name.trim()}>
          {build ? 'Save Changes' : 'Create Build'}
        </button>
      </div>
    </div>
  );
}

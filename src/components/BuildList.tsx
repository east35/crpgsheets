import type { CharacterBuild } from '../types';

interface BuildListProps {
  builds: CharacterBuild[];
  onSelectBuild: (build: CharacterBuild) => void;
  onDeleteBuild: (id: string) => void;
}

export function BuildList({ builds, onSelectBuild, onDeleteBuild }: BuildListProps) {
  if (builds.length === 0) {
    return (
      <div className="build-list-empty">
        <p>No builds yet. Create a new build or import from a file.</p>
      </div>
    );
  }

  return (
    <div className="build-list">
      {builds.map((build) => (
        <div key={build.id} className="build-card">
          <div className="build-info" onClick={() => onSelectBuild(build)}>
            <h3>{build.name}</h3>
            {build.description && <p>{build.description}</p>}
            <span className="build-date">
              Updated: {new Date(build.updatedAt).toLocaleDateString()}
            </span>
          </div>
          <div className="build-actions">
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => onSelectBuild(build)}
            >
              Edit
            </button>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => onDeleteBuild(build.id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

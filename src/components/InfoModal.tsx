import { createPortal } from 'react-dom';
import { Xmark } from 'iconoir-react';
import { CHANGELOG, ROADMAP } from '../data/changelog';
import './InfoModal.css';

interface InfoModalProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}

export function InfoModal({ title, children, onClose }: InfoModalProps) {
  return createPortal(
    <div className="info-modal-overlay" onClick={onClose}>
      <div className="info-modal" onClick={e => e.stopPropagation()}>
        <button className="info-modal-close" onClick={onClose}>
          <Xmark width={24} height={24} />
        </button>
        <h2>{title}</h2>
        <div className="info-modal-content">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}

export function ChangelogContent() {
  return (
    <div className="changelog-list">
      {CHANGELOG.map((release) => (
        <div key={release.version} className="changelog-entry">
          <div className="changelog-header">
            <span className="changelog-version">v{release.version}</span>
            <span className="changelog-date">{release.date}</span>
          </div>
          <h3 className="changelog-title">{release.title}</h3>
          <ul className="changelog-changes">
            {release.changes.map((change, i) => (
              <li key={i}>{change}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export function RoadmapContent() {
  const inProgress = ROADMAP.filter(item => item.status === 'in-progress');
  const planned = ROADMAP.filter(item => item.status === 'planned');
  const considering = ROADMAP.filter(item => item.status === 'considering');

  return (
    <div className="roadmap-list">
      {inProgress.length > 0 && (
        <div className="roadmap-section">
          <h3 className="roadmap-section-title in-progress">In Progress</h3>
          {inProgress.map((item, i) => (
            <div key={i} className="roadmap-item">
              <div className="roadmap-item-title">{item.title}</div>
              <div className="roadmap-item-desc">{item.description}</div>
            </div>
          ))}
        </div>
      )}
      {planned.length > 0 && (
        <div className="roadmap-section">
          <h3 className="roadmap-section-title planned">Planned</h3>
          {planned.map((item, i) => (
            <div key={i} className="roadmap-item">
              <div className="roadmap-item-title">{item.title}</div>
              <div className="roadmap-item-desc">{item.description}</div>
            </div>
          ))}
        </div>
      )}
      {considering.length > 0 && (
        <div className="roadmap-section">
          <h3 className="roadmap-section-title considering">Considering</h3>
          {considering.map((item, i) => (
            <div key={i} className="roadmap-item">
              <div className="roadmap-item-title">{item.title}</div>
              <div className="roadmap-item-desc">{item.description}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

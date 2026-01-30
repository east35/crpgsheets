import { useEffect, useMemo, useState } from 'react';
import { getDatasetsForGame, type AuditDataset } from '../data/auditRegistry';
import './DataAuditView.css';

type ImageFilter = 'all' | 'with' | 'missing';

const IMAGE_HINT_KEYS = ['image', 'icon', 'portrait', 'thumb', 'avatar'];

function findImage(entry: Record<string, unknown>): string | undefined {
  for (const [key, value] of Object.entries(entry)) {
    if (!value) continue;
    const lowered = key.toLowerCase();
    const matches = IMAGE_HINT_KEYS.some((hint) => lowered.includes(hint));
    if (!matches) continue;
    if (typeof value === 'string') return value;
  }
  return undefined;
}

function toSearchText(entry: Record<string, unknown>): string {
  const parts: string[] = [];
  for (const value of Object.values(entry)) {
    if (!value) continue;
    if (typeof value === 'string') {
      parts.push(value);
    } else if (Array.isArray(value)) {
      parts.push(value.join(' '));
    } else if (typeof value === 'number') {
      parts.push(String(value));
    }
  }
  return parts.join(' ').toLowerCase();
}

function buildKeyStats(entries: Array<Record<string, unknown>>) {
  const counts = new Map<string, number>();
  for (const entry of entries) {
    for (const key of Object.keys(entry)) {
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([key, count]) => ({ key, count }));
}

export function DataAuditView({ gameId, gameName }: { gameId: string; gameName: string }) {
  const datasets = useMemo(() => getDatasetsForGame(gameId), [gameId]);
  const [activeDatasetId, setActiveDatasetId] = useState<string | null>(datasets[0]?.id ?? null);
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [imageFilter, setImageFilter] = useState<ImageFilter>('all');
  const [pageSize, setPageSize] = useState(100);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setActiveDatasetId(datasets[0]?.id ?? null);
  }, [datasets]);

  const activeDataset = useMemo<AuditDataset | null>(() => {
    if (!activeDatasetId) return null;
    return datasets.find((dataset) => dataset.id === activeDatasetId) ?? null;
  }, [datasets, activeDatasetId]);

  const entries = useMemo<Array<{ id: string; [key: string]: unknown }>>(() => {
    if (!activeDataset) return [];
    return Object.entries(activeDataset.data).map(([id, value]) => ({
      id,
      ...(value as Record<string, unknown>),
    }));
  }, [activeDataset]);

  const keyStats = useMemo(() => buildKeyStats(entries), [entries]);

  const enrichedEntries = useMemo(() => {
    return entries.map((entry) => ({
      entry,
      name: (entry.name as string | undefined) ?? entry.id,
      image: findImage(entry),
      searchText: toSearchText(entry),
    }));
  }, [entries]);

  const filteredEntries = useMemo(() => {
    const query = search.trim().toLowerCase();
    return enrichedEntries.filter(({ entry, name, image, searchText }) => {
      if (imageFilter === 'with' && !image) return false;
      if (imageFilter === 'missing' && image) return false;
      if (!query) return true;
      return entry.id.toLowerCase().includes(query) || name.toLowerCase().includes(query) || searchText.includes(query);
    });
  }, [enrichedEntries, search, imageFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredEntries.length / pageSize));
  const clampedPage = Math.min(page, totalPages);
  const pagedEntries = filteredEntries.slice((clampedPage - 1) * pageSize, clampedPage * pageSize);

  useEffect(() => {
    setPage(1);
  }, [search, imageFilter, pageSize, activeDatasetId]);

  useEffect(() => {
    const first = filteredEntries[0]?.entry.id ?? null;
    setSelectedEntryId(first);
  }, [filteredEntries]);

  const selectedEntry = useMemo(() => {
    if (!selectedEntryId) return null;
    return entries.find((entry) => entry.id === selectedEntryId) ?? null;
  }, [entries, selectedEntryId]);

  const selectedImage = selectedEntry ? findImage(selectedEntry) : undefined;

  if (!datasets.length) {
    return (
      <section className="data-audit">
        <div className="data-audit-empty">
          <h1>Data Audit</h1>
          <p>No datasets registered yet for {gameName}. Add a dataset to the audit registry to start browsing.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="data-audit">
      <header className="data-audit-hero">
        <div>
          <p className="data-audit-eyebrow">Data Audit</p>
          <h1>{gameName} Data Lab</h1>
          <p className="data-audit-subtitle">Browse, filter, and sanity-check ingested datasets across the game.</p>
        </div>
        <div className="data-audit-kpis">
          <div>
            <span>Datasets</span>
            <strong>{datasets.length}</strong>
          </div>
          <div>
            <span>Entries</span>
            <strong>{activeDataset ? entries.length : 0}</strong>
          </div>
          <div>
            <span>Fields</span>
            <strong>{keyStats.length}</strong>
          </div>
        </div>
      </header>

      <div className="data-audit-body">
        <aside className="data-audit-sidebar">
          <div className="data-audit-panel">
            <h2>Datasets</h2>
            <div className="data-audit-list">
              {datasets.map((dataset) => {
                const count = Object.keys(dataset.data).length;
                const isActive = dataset.id === activeDatasetId;
                return (
                  <button
                    key={dataset.id}
                    className={`data-audit-list-item${isActive ? ' active' : ''}`}
                    onClick={() => setActiveDatasetId(dataset.id)}
                  >
                    <span>{dataset.label}</span>
                    <em>{count}</em>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="data-audit-panel">
            <h2>Coverage</h2>
            <div className="data-audit-coverage">
              {keyStats.slice(0, 8).map((stat) => (
                <div key={stat.key} className="data-audit-coverage-row">
                  <span>{stat.key}</span>
                  <div className="data-audit-coverage-bar">
                    <div style={{ width: `${Math.round((stat.count / Math.max(entries.length, 1)) * 100)}%` }} />
                  </div>
                  <em>{stat.count}</em>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <div className="data-audit-main">
          <div className="data-audit-toolbar">
            <div className="data-audit-controls">
              <label>
                Dataset
                <select value={activeDatasetId ?? ''} onChange={(event) => setActiveDatasetId(event.target.value)}>
                  {datasets.map((dataset) => (
                    <option key={dataset.id} value={dataset.id}>
                      {dataset.label}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Search
                <input
                  type="search"
                  value={search}
                  placeholder="Name, id, or any field"
                  onChange={(event) => setSearch(event.target.value)}
                />
              </label>

              <label>
                Images
                <select value={imageFilter} onChange={(event) => setImageFilter(event.target.value as ImageFilter)}>
                  <option value="all">All</option>
                  <option value="with">With images</option>
                  <option value="missing">Missing images</option>
                </select>
              </label>

              <label>
                Page size
                <select value={pageSize} onChange={(event) => setPageSize(Number(event.target.value))}>
                  {[50, 100, 250, 500].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="data-audit-meta">
              <span>{filteredEntries.length} results</span>
              <div className="data-audit-pagination">
                <button onClick={() => setPage(Math.max(1, clampedPage - 1))} disabled={clampedPage === 1}>
                  Prev
                </button>
                <span>
                  Page {clampedPage} / {totalPages}
                </span>
                <button onClick={() => setPage(Math.min(totalPages, clampedPage + 1))} disabled={clampedPage === totalPages}>
                  Next
                </button>
              </div>
            </div>
          </div>

          <div className="data-audit-table">
            {pagedEntries.map(({ entry, name, image }) => (
              <button
                key={entry.id}
                className={`data-audit-row${entry.id === selectedEntryId ? ' selected' : ''}`}
                onClick={() => setSelectedEntryId(entry.id)}
              >
                <div className="data-audit-row-title">
                  <span>{name}</span>
                  <em>{entry.id}</em>
                </div>
                <div className="data-audit-row-meta">
                  <span>{Object.keys(entry).length} fields</span>
                  <span className={image ? 'has-image' : 'missing-image'}>
                    {image ? 'Image ✓' : 'No image'}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <aside className="data-audit-detail">
          {selectedEntry ? (
            <>
              <div className="data-audit-detail-header">
                <h2>{(selectedEntry.name as string | undefined) ?? selectedEntry.id}</h2>
                <span>{selectedEntry.id}</span>
              </div>
              {selectedImage && (
                <div className="data-audit-detail-image">
                  <img src={selectedImage} alt={String(selectedEntry.name ?? selectedEntry.id)} />
                </div>
              )}
              <div className="data-audit-detail-fields">
                {Object.entries(selectedEntry).map(([key, value]) => (
                  <div key={key}>
                    <strong>{key}</strong>
                    <span>{typeof value === 'string' ? value : JSON.stringify(value)}</span>
                  </div>
                ))}
              </div>
              <div className="data-audit-detail-json">
                <h3>Raw JSON</h3>
                <pre>{JSON.stringify(selectedEntry, null, 2)}</pre>
              </div>
            </>
          ) : (
            <div className="data-audit-detail-empty">
              <p>Select a record to inspect details.</p>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}

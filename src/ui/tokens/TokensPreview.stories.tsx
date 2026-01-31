import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta = {
  title: 'UI/Tokens',
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta

type Story = StoryObj

const surfaceTokens = [
  '--ui-surface-base',
  '--ui-surface-panel',
  '--ui-surface-panel-alt',
  '--ui-surface-hover',
  '--ui-surface-muted',
  '--ui-surface-elevated',
  '--ui-surface-scrim',
  '--ui-surface-scrim-strong',
]

const textTokens = [
  '--ui-text-primary',
  '--ui-text-muted',
  '--ui-text-subtle',
  '--ui-text-disabled',
  '--ui-text-disabled-strong',
  '--ui-text-on-dark',
  '--ui-text-accent',
]

const borderTokens = [
  '--ui-border-default',
  '--ui-border-strong',
  '--ui-border-subtle',
  '--ui-border-contrast',
  '--ui-border-ghost',
]

const radiusTokens = [
  '--ui-radius-xs',
  '--ui-radius-sm',
  '--ui-radius-md',
  '--ui-radius-lg',
  '--ui-radius-xl',
  '--ui-radius-2xl',
  '--ui-radius-3xl',
  '--ui-radius-pill',
]

const shadowTokens = [
  '--ui-shadow-xs',
  '--ui-shadow-sm',
  '--ui-shadow-md',
  '--ui-shadow-lg',
  '--ui-shadow-xl',
  '--ui-shadow-glow-accent',
]

const spacingTokens = [
  '--ui-space-2xs',
  '--ui-space-xs',
  '--ui-space-sm',
  '--ui-space-md',
  '--ui-space-lg',
  '--ui-space-xl',
  '--ui-space-2xl',
  '--ui-space-3xl',
]

const zLayers = [
  '--ui-layer-base',
  '--ui-layer-raised',
  '--ui-layer-sticky',
  '--ui-layer-dropdown',
  '--ui-layer-overlay',
  '--ui-layer-modal',
  '--ui-layer-toast',
]

function TokenSwatch({ token }: { token: string }) {
  return (
    <div
      style={{
        border: '1px solid var(--ui-border-default)',
        borderRadius: 'var(--ui-radius-md)',
        padding: 'var(--ui-space-sm)',
        background: 'var(--ui-surface-panel)',
        color: 'var(--ui-text-primary)',
        display: 'grid',
        gap: 'var(--ui-space-xs)',
      }}
    >
      <div style={{ fontSize: 'var(--ui-font-size-sm)' }}>{token}</div>
      <div
        style={{
          height: 48,
          borderRadius: 'var(--ui-radius-sm)',
          background: `var(${token})`,
          border: '1px solid var(--ui-border-subtle)',
        }}
      />
    </div>
  )
}

export const Overview: Story = {
  render: () => (
    <div
      style={{
        minHeight: '100vh',
        padding: 'var(--ui-space-xl)',
        background: 'var(--ui-surface-base)',
        color: 'var(--ui-text-primary)',
        fontFamily: 'sans-serif',
        display: 'grid',
        gap: 'var(--ui-space-xl)',
      }}
    >
      <section>
        <h2 style={{ marginBottom: 'var(--ui-space-sm)' }}>Surfaces</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--ui-space-md)' }}>
          {surfaceTokens.map((token) => (
            <TokenSwatch key={token} token={token} />
          ))}
        </div>
      </section>

      <section>
        <h2 style={{ marginBottom: 'var(--ui-space-sm)' }}>Text</h2>
        <div style={{ display: 'grid', gap: 'var(--ui-space-sm)' }}>
          {textTokens.map((token) => (
            <div key={token} style={{ color: `var(${token})`, fontSize: 'var(--ui-font-size-lg)' }}>
              {token} — The quick brown fox jumps over the lazy dog.
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 style={{ marginBottom: 'var(--ui-space-sm)' }}>Borders</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--ui-space-md)' }}>
          {borderTokens.map((token) => (
            <div
              key={token}
              style={{
                border: `2px solid var(${token})`,
                borderRadius: 'var(--ui-radius-md)',
                padding: 'var(--ui-space-md)',
              }}
            >
              {token}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 style={{ marginBottom: 'var(--ui-space-sm)' }}>Spacing + Radius</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--ui-space-md)' }}>
          {radiusTokens.map((token) => (
            <div
              key={token}
              style={{
                borderRadius: `var(${token})`,
                background: 'var(--ui-surface-panel)',
                border: '1px solid var(--ui-border-default)',
                padding: 'var(--ui-space-md)',
              }}
            >
              {token}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 'var(--ui-space-sm)', marginTop: 'var(--ui-space-md)', flexWrap: 'wrap' }}>
          {spacingTokens.map((token) => (
            <div
              key={token}
              style={{
                padding: `var(${token})`,
                background: 'var(--ui-surface-panel-alt)',
                borderRadius: 'var(--ui-radius-sm)',
                border: '1px solid var(--ui-border-subtle)',
              }}
            >
              {token}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 style={{ marginBottom: 'var(--ui-space-sm)' }}>Elevation</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--ui-space-md)' }}>
          {shadowTokens.map((token) => (
            <div
              key={token}
              style={{
                padding: 'var(--ui-space-lg)',
                borderRadius: 'var(--ui-radius-md)',
                background: 'var(--ui-surface-panel)',
                boxShadow: `var(${token})`,
              }}
            >
              {token}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 style={{ marginBottom: 'var(--ui-space-sm)' }}>Z-Layers</h2>
        <div style={{ display: 'grid', gap: 'var(--ui-space-xs)' }}>
          {zLayers.map((token) => (
            <div key={token}>
              {token}: <span style={{ color: 'var(--ui-text-muted)' }}>var({token})</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 style={{ marginBottom: 'var(--ui-space-sm)' }}>Theme Scope: Audit</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--ui-space-lg)' }}>
          <div style={{ padding: 'var(--ui-space-lg)', borderRadius: 'var(--ui-radius-lg)', background: 'var(--ui-surface-panel)', border: '1px solid var(--ui-border-default)' }}>
            <h3 style={{ marginTop: 0 }}>Base Theme</h3>
            <p style={{ color: 'var(--ui-text-muted)' }}>Uses :root tokens.</p>
          </div>
          <div
            data-theme="audit"
            style={{ padding: 'var(--ui-space-lg)', borderRadius: 'var(--ui-radius-lg)', background: 'var(--ui-surface-panel)', border: '1px solid var(--ui-border-default)' }}
          >
            <h3 style={{ marginTop: 0, color: 'var(--ui-text-primary)' }}>Audit Theme</h3>
            <p style={{ color: 'var(--ui-text-muted)' }}>Overrides surface/text/accent tokens.</p>
            <div style={{ height: 6, borderRadius: 999, background: 'var(--ui-accent-primary)' }} />
          </div>
        </div>
      </section>
    </div>
  ),
}

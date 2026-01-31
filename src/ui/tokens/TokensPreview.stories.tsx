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
      <div
        style={{
          fontFamily: 'var(--ui-type-core-font)',
          fontSize: 'var(--ui-type-core-meta)',
          lineHeight: 'var(--ui-type-core-leading)',
        }}
      >
        {token}
      </div>
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
            <div
              key={token}
              style={{
                color: `var(${token})`,
                fontFamily: 'var(--ui-type-core-font)',
                fontSize: 'var(--ui-type-core-body)',
                lineHeight: 'var(--ui-type-core-leading)',
              }}
            >
              {token} — The quick brown fox jumps over the lazy dog.
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 style={{ marginBottom: 'var(--ui-space-sm)' }}>Typography</h2>
        <div style={{ display: 'grid', gap: 'var(--ui-space-lg)' }}>
          <div>
            <h3 style={{ marginBottom: 'var(--ui-space-xs)' }}>Core Body</h3>
            <div style={{ color: 'var(--ui-text-muted)', fontSize: 'var(--ui-type-core-meta)' }}>
              font-size: var(--ui-type-core-body) · line-height: var(--ui-type-core-leading)
            </div>
            <p
              style={{
                margin: 0,
                fontFamily: 'var(--ui-type-core-font)',
                fontSize: 'var(--ui-type-core-body)',
                lineHeight: 'var(--ui-type-core-leading)',
                color: 'var(--ui-text-primary)',
              }}
            >
              The core UI copy is compact and calm. It prioritizes dense layouts without
              feeling cramped, keeping quick scans comfortable across panels and controls.
            </p>
          </div>
          <div>
            <h3 style={{ marginBottom: 'var(--ui-space-xs)' }}>Editorial Body</h3>
            <div style={{ color: 'var(--ui-text-muted)', fontSize: 'var(--ui-type-core-meta)' }}>
              font-size: var(--ui-type-editorial-body) · line-height: var(--ui-type-editorial-leading)
            </div>
            <p
              style={{
                margin: 0,
                fontFamily: 'var(--ui-type-editorial-font)',
                fontSize: 'var(--ui-type-editorial-body)',
                lineHeight: 'var(--ui-type-editorial-leading)',
                color: 'var(--ui-text-primary)',
              }}
            >
              Editorial copy uses the same size as core text but opens the leading for
              longer-form reading. Paragraphs feel airy while maintaining visual alignment.
            </p>
          </div>
          <div>
            <h3 style={{ marginBottom: 'var(--ui-space-xs)' }}>Core Heading</h3>
            <div style={{ color: 'var(--ui-text-muted)', fontSize: 'var(--ui-type-core-meta)' }}>
              font-size: var(--ui-type-core-heading) · line-height: var(--ui-type-core-leading)
            </div>
            <div
              style={{
                fontFamily: 'var(--ui-type-core-font)',
                fontSize: 'var(--ui-type-core-heading)',
                lineHeight: 'var(--ui-type-core-leading)',
                fontWeight: 'var(--ui-font-semibold)',
              }}
            >
              Core heading for UI sections
            </div>
          </div>
          <div>
            <h3 style={{ marginBottom: 'var(--ui-space-xs)' }}>Editorial Heading</h3>
            <div style={{ color: 'var(--ui-text-muted)', fontSize: 'var(--ui-type-core-meta)' }}>
              font-size: var(--ui-type-editorial-heading) · line-height: var(--ui-type-editorial-leading)
            </div>
            <div
              style={{
                fontFamily: 'var(--ui-type-editorial-font)',
                fontSize: 'var(--ui-type-editorial-heading)',
                lineHeight: 'var(--ui-type-editorial-leading)',
                fontWeight: 'var(--ui-font-semibold)',
              }}
            >
              Editorial heading for narrative sections
            </div>
          </div>
          <div>
            <h3 style={{ marginBottom: 'var(--ui-space-xs)' }}>Label</h3>
            <div style={{ color: 'var(--ui-text-muted)', fontSize: 'var(--ui-type-core-meta)' }}>
              font-size: var(--ui-type-core-label) · tracking: var(--ui-tracking-wide)
            </div>
            <div
              style={{
                fontFamily: 'var(--ui-type-core-font)',
                fontSize: 'var(--ui-type-core-label)',
                lineHeight: 'var(--ui-type-core-leading)',
                letterSpacing: 'var(--ui-tracking-wide)',
                textTransform: 'uppercase',
                color: 'var(--ui-text-muted)',
              }}
            >
              Core label sample
            </div>
          </div>
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

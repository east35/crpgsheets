import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './Button'

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
}

export default meta

type Story = StoryObj<typeof Button>

const variants = ['primary', 'secondary', 'ghost', 'danger'] as const
const sizes = ['sm', 'md', 'lg'] as const

export const VariantsAndSizes: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--ui-space-lg)' }}>
      {variants.map((variant) => (
        <div key={variant} style={{ display: 'grid', gap: 'var(--ui-space-sm)' }}>
          <strong style={{ color: 'var(--ui-text-primary)' }}>{variant}</strong>
          <div style={{ display: 'flex', gap: 'var(--ui-space-sm)', flexWrap: 'wrap' }}>
            {sizes.map((size) => (
              <Button key={`${variant}-${size}`} variant={variant} size={size}>
                {variant} {size}
              </Button>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
}

export const StatesAndIcons: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--ui-space-sm)' }}>
      <Button variant="primary" size="md" disabled>
        Disabled
      </Button>
      <Button variant="secondary" size="md" isLoading>
        Loading
      </Button>
      <Button variant="ghost" size="md" startIcon={<span aria-hidden="true">★</span>}>
        Start Icon
      </Button>
      <Button variant="danger" size="md" endIcon={<span aria-hidden="true">→</span>}>
        End Icon
      </Button>
      <Button
        variant="primary"
        size="md"
        startIcon={<span aria-hidden="true">✓</span>}
        endIcon={<span aria-hidden="true">↗</span>}
      >
        Both Icons
      </Button>
    </div>
  ),
}

export const FullWidth: Story = {
  render: () => (
    <div style={{ width: 320, display: 'grid', gap: 'var(--ui-space-sm)' }}>
      <Button variant="primary" size="md" fullWidth>
        Full width primary
      </Button>
      <Button variant="secondary" size="md" fullWidth>
        Full width secondary
      </Button>
    </div>
  ),
}

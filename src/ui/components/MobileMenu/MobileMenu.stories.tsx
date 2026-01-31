import type { Meta, StoryObj } from '@storybook/react'
import { useEffect, useState } from 'react'
import { MobileMenu } from './MobileMenu'
import styles from './MobileMenu.module.css'

const meta: Meta<typeof MobileMenu> = {
  title: 'UI/MobileMenu',
  component: MobileMenu,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta

type Story = StoryObj<typeof MobileMenu>

type MenuSandboxProps = {
  initialOpen: boolean
}

function MenuSandbox({ initialOpen }: MenuSandboxProps) {
  const [isOpen, setIsOpen] = useState(initialOpen)

  useEffect(() => {
    setIsOpen(initialOpen)
  }, [initialOpen])

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: '2rem',
        background: 'var(--ui-surface-panel)',
        color: 'var(--ui-text-default)',
        display: 'flex',
        justifyContent: 'flex-end',
      }}
    >
      <MobileMenu isOpen={isOpen} onOpenChange={setIsOpen}>
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Game</h3>
          <button type="button" className={styles.gameSelectBtn}>
            <span className={styles.gameSelectInfo}>
              <span className={styles.gameSelectLogo} aria-hidden="true">
                BG3
              </span>
              <span className={styles.gameSelectName}>Baldur&apos;s Gate 3</span>
            </span>
            <span aria-hidden="true">Switch</span>
          </button>
        </div>
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Shortcuts</h3>
          <button type="button" className={styles.gameSelectBtn}>
            Open Profiles
          </button>
          <button type="button" className={styles.gameSelectBtn}>
            Import Build
          </button>
        </div>
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Keyboard</h3>
          <p style={{ margin: 0, color: 'var(--ui-text-muted)' }}>
            Tab to focus buttons, then press Escape to close the menu.
          </p>
        </div>
      </MobileMenu>
    </div>
  )
}

export const DesktopClosed: Story = {
  render: () => <MenuSandbox initialOpen={false} />,
  parameters: {
    viewport: { defaultViewport: 'responsive' },
  },
}

export const DesktopOpen: Story = {
  render: () => <MenuSandbox initialOpen={true} />,
  parameters: {
    viewport: { defaultViewport: 'responsive' },
  },
}

export const MobileClosed: Story = {
  render: () => <MenuSandbox initialOpen={false} />,
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
}

export const MobileOpen: Story = {
  render: () => <MenuSandbox initialOpen={true} />,
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
}

export const KeyboardDemo: Story = {
  render: () => <MenuSandbox initialOpen={true} />,
  parameters: {
    viewport: { defaultViewport: 'responsive' },
  },
}

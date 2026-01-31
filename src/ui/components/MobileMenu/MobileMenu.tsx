import { useEffect, useId, useRef } from 'react'
import styles from './MobileMenu.module.css'

export type MobileMenuProps = {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

export function MobileMenu({ isOpen, onOpenChange, children }: MobileMenuProps) {
  const panelId = useId()
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        onOpenChange(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onOpenChange])

  useEffect(() => {
    if (!isOpen) return

    const handlePointerDown = (event: MouseEvent) => {
      if (!window.matchMedia('(min-width: 769px)').matches) return
      const target = event.target as Node
      if (wrapperRef.current && !wrapperRef.current.contains(target)) {
        onOpenChange(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [isOpen, onOpenChange])

  const panelClassName = isOpen ? `${styles.panel} ${styles.panelOpen}` : styles.panel

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      <button
        type="button"
        className={styles.toggleButton}
        aria-expanded={isOpen}
        aria-controls={panelId}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        onClick={() => onOpenChange(!isOpen)}
      >
        Menu
      </button>
      {isOpen ? (
        <div
          className={styles.overlay}
          onClick={() => onOpenChange(false)}
          aria-hidden="true"
        />
      ) : null}
      <div id={panelId} className={panelClassName} aria-hidden={!isOpen}>
        <button
          type="button"
          className={styles.closeButton}
          aria-label="Close menu"
          onClick={() => onOpenChange(false)}
        >
          Close
        </button>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  )
}

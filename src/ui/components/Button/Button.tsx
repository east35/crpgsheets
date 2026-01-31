import type { ButtonHTMLAttributes, ReactNode } from 'react'
import styles from './Button.module.css'

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  startIcon?: ReactNode
  endIcon?: ReactNode
  fullWidth?: boolean
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  startIcon,
  endIcon,
  fullWidth = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || isLoading

  return (
    <button
      type="button"
      className={styles.button}
      data-variant={variant}
      data-size={size}
      data-loading={isLoading}
      data-full-width={fullWidth}
      disabled={isDisabled}
      aria-busy={isLoading || undefined}
      {...props}
    >
      <span className={styles.content}>
        {startIcon ? <span className={styles.icon}>{startIcon}</span> : null}
        <span className={styles.label}>{children}</span>
        {endIcon ? <span className={styles.icon}>{endIcon}</span> : null}
      </span>
      {isLoading ? <span className={styles.spinner} aria-hidden="true" /> : null}
    </button>
  )
}

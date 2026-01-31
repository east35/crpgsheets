import type { Preview } from '@storybook/react'
import '../src/ui/tokens/tokens.css'

const preview: Preview = {
  parameters: {
    layout: 'fullscreen',

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    }
  },
}

export default preview

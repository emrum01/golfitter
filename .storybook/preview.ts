import type { Preview } from '@storybook/nextjs-vite'
import { fn } from 'storybook/test'
import '../app/globals.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    },

    nextjs: {
      appDirectory: true,
      navigation: {
        push: fn(),
        replace: fn(),
        forward: fn(),
        back: fn(),
        prefetch: fn(),
        refresh: fn(),
      },
    },
  },
};

export default preview;
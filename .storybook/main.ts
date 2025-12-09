import type { StorybookConfig } from '@storybook/nextjs-vite'

const config: StorybookConfig = {
  stories: [
    '../src/components/atoms/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../src/components/molecules/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../src/components/organisms/**/*.stories.@(js|jsx|mjs|ts|tsx)'
  ],
  addons: [],
  framework: '@storybook/nextjs-vite',
  staticDirs: ['../public']
}
export default config

import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  root: './',
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    reporters: ['verbose', 'json'],
    outputFile: {
      json: './test/test-report.json',
    },
    clearMocks: true,
  },
})

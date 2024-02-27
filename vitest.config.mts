import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      exclude: ['src/index.ts', 'src/types.d.ts', '.eslintrc.cjs'],
    },
    poolOptions: {
      threads: {
        singleThread: true,
      },
    },
  },
})

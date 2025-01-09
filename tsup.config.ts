import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['server/server.ts'],
  format: ['cjs'],
  outDir: 'build',
  target: 'node20',
  platform: 'node',
  splitting: false,
  sourcemap: false,
  clean: true,
});


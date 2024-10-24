import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['server/server.ts'],
  outDir: 'build',
  target: 'node20',
  platform: 'node',
  splitting: false,
  sourcemap: true,
  clean: true,
});


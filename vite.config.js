import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { allowedHosts: ['terminal.local'] },
  build: { sourcemap: false },
  test: { environment: 'jsdom', setupFiles: ['./tests/setup.js'], restoreMocks: true },
});

import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  // Relative base ensures assets load on GitHub Pages subpaths (e.g., /repo-name/)
  base: './',
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: true,
  },
  preview: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: true,
  },
});

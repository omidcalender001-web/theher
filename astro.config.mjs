import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

// TODO (Phase 10): set the final production domain before launch
export default defineConfig({
  site: 'https://the-her-omid.netlify.app',
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  trailingSlash: 'never',
  devToolbar: { enabled: false },
  server: {
    host: '0.0.0.0',
    port: 3000
  },
  vite: {
    server: {
      host: true,
      allowedHosts: true
    }
  },
  build: {
    inlineStylesheets: 'auto'
  }
});

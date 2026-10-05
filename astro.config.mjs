import { defineConfig } from 'astro/config';

// TODO (Phase 10): set the final production domain before launch
export default defineConfig({
  site: 'https://the-her-omid.netlify.app',
  trailingSlash: 'never',
  devToolbar: { enabled: false },
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

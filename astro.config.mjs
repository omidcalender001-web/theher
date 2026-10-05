import { defineConfig } from 'astro/config';

// TODO (Phase 10): set the final production domain before launch
export default defineConfig({
  site: 'https://the-her-omid.netlify.app',
  trailingSlash: 'never',
  build: {
    inlineStylesheets: 'auto'
  }
});

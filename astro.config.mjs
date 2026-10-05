import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';

export default defineConfig({
  site: 'https://the-her-omid.netlify.app',
  output: 'server',
  // Netlify packages every server-rendered route (including /api/preview)
  // as a Netlify Function while static assets continue to use the CDN.
  adapter: netlify(),
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

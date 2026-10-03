import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

function reactScanDev(enabled: boolean): Plugin {
  return {
    name: 'react-scan-dev',
    apply: 'serve',
    transformIndexHtml() {
      if (!enabled) return [];
      return [
        {
          tag: 'script',
          attrs: { src: '/node_modules/react-scan/dist/auto.global.js' },
          injectTo: 'head-prepend',
        },
      ];
    },
  };
}

function siteUrl(url: string): Plugin {
  return {
    name: 'site-url',
    transformIndexHtml: {
      order: 'pre',
      handler: (html) => html.replaceAll('%SITE_URL%', url),
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const scanEnabled = env.REACT_SCAN !== 'false';
  const site = (env.URL ?? 'http://localhost:4173').replace(/\/$/, '');

  return {
    plugins: [react(), tailwindcss(), reactScanDev(scanEnabled), siteUrl(site)],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      host: true,
      port: 5173,
    },
    build: {
      sourcemap: false,
      target: 'es2022',
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/three')) return 'three';
            return undefined;
          },
        },
      },
    },
  };
});

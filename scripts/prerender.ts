import { build } from 'vite';
import { readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const distDir = path.join(root, 'dist');
const ssrDir = path.join(distDir, '.ssr');

await build({
  configFile: path.join(root, 'vite.config.ts'),
  logLevel: 'warn',
  build: {
    ssr: 'src/entry-server.tsx',
    outDir: ssrDir,
    emptyOutDir: true,
    rollupOptions: { output: { manualChunks: undefined } },
  },
});

const { render } = (await import(path.join(ssrDir, 'entry-server.js'))) as {
  render: () => string;
};

const indexPath = path.join(distDir, 'index.html');
const template = await readFile(indexPath, 'utf8');
const marker = '<div id="root"></div>';

if (!template.includes(marker)) {
  throw new Error('prerender: root marker not found in dist/index.html');
}

const stylesheetTag =
  /<link rel="stylesheet"[^>]*href="\/(assets\/[^"]+\.css)"[^>]*>/;

async function inlineStylesheet(input: string) {
  const match = input.match(stylesheetTag);
  if (!match) return input;
  const css = await readFile(path.join(distDir, match[1]), 'utf8');
  return input.replace(match[0], `<style>${css}</style>`);
}

const html = await inlineStylesheet(
  template.replace(marker, `<div id="root">${render()}</div>`),
);
await writeFile(indexPath, html);
await rm(ssrDir, { recursive: true, force: true });

console.log('prerender: dist/index.html hydrated with static markup');

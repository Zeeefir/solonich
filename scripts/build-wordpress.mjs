import { build } from 'vite';
import { mkdirSync, copyFileSync, writeFileSync, readdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const release = path.join(root, 'data', 'wordpress', new Date().toISOString().replaceAll(/[:.]/g, '-'));
const theme = path.join(release, 'solonich-catalog');
const publicDirectory = path.join(release, 'public');
const output = path.join(theme, 'build');
mkdirSync(theme, { recursive: true });
mkdirSync(publicDirectory, { recursive: true });
for (const file of readdirSync(path.join(root, 'wordpress', 'solonich-catalog'))) {
  copyFileSync(path.join(root, 'wordpress', 'solonich-catalog', file), path.join(theme, file));
}

// Package only published media, never local credentials, databases or original work files.
const publicFiles = execFileSync('git', ['ls-files', '-z', 'public'], { cwd: root, encoding: 'utf8' }).split('\0').filter(Boolean);
for (const file of publicFiles) {
  const destination = path.join(publicDirectory, file.slice('public/'.length));
  mkdirSync(path.dirname(destination), { recursive: true });
  copyFileSync(path.join(root, file), destination);
}
const base = '/wp-content/themes/solonich-catalog/build/';
process.env.VITE_SITE_URL = 'https://solenich.kz';
process.env.VITE_ASSET_BASE = base;
process.env.SITE_BUILD_DIRECTORY = output;
await build({ root, base, publicDir: publicDirectory, build: { outDir: output } });
await import('./build-seo.mjs');
writeFileSync(path.join(release, 'release.json'), JSON.stringify({ theme, output, domain: process.env.VITE_SITE_URL, rollbackTheme: 'solenich-anniversary' }, null, 2));
console.log(`WORDPRESS_THEME=${theme}`);

import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const themes = ['leen', 'mada', 'wameed', 'ward'];
const build = process.argv.includes('--build');

function runThemeCommand(slug, command) {
  const cwd = path.join(root, 'salla-themes', slug);
  console.log(`\n[${slug}] corepack pnpm ${command}`);
  const result = spawnSync('corepack', ['pnpm', command], { cwd, stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

for (const slug of themes) runThemeCommand(slug, 'check:theme');
if (build) {
  for (const slug of themes) runThemeCommand(slug, 'production');
}

console.log(`\nTwilight ${build ? 'checks and builds' : 'checks'} passed for: ${themes.join(', ')}.`);

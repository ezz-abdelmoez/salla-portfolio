import { access, cp, lstat, mkdir, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
if (args[0] === '--') args.shift();
const [slug, destinationArg] = args;
const allowedThemes = new Set(['leen', 'mada', 'wameed', 'ward', 'qahwa']);

if (!allowedThemes.has(slug) || !destinationArg) {
  console.error('Usage: corepack pnpm export:twilight -- <leen|mada|wameed|ward|qahwa> <new-empty-destination>');
  process.exit(2);
}

const source = path.join(root, 'salla-themes', slug);
const destination = path.resolve(process.cwd(), destinationArg);
const relativeDestination = path.relative(source, destination);
const destinationIsInsideSource = !path.isAbsolute(relativeDestination)
  && relativeDestination !== '..'
  && !relativeDestination.startsWith(`..${path.sep}`);
if (destinationIsInsideSource) {
  console.error('Choose a destination outside the source theme folder.');
  process.exit(2);
}

try {
  await access(destination);
  const details = await lstat(destination);
  if (!details.isDirectory() || (await readdir(destination)).length > 0) {
    console.error(`Destination already exists and is not empty: ${destination}`);
    process.exit(2);
  }
  console.error(`Destination directory already exists: ${destination}`);
  process.exit(2);
} catch (error) {
  if (error?.code !== 'ENOENT') throw error;
}

await mkdir(path.dirname(destination), { recursive: true });
await cp(source, destination, {
  recursive: true,
  errorOnExist: true,
  force: false,
  filter: async (sourcePath) => {
    const relative = path.relative(source, sourcePath).split(path.sep);
    return !relative.some((part) => ['node_modules', '.git', '.next', 'coverage'].includes(part));
  },
});

try {
  await access(path.join(destination, 'twilight.json'));
} catch {
  console.error('Export is missing twilight.json at the theme root.');
  process.exit(1);
}

console.log(`Exported ${slug} to ${destination}.`);
console.log('The export is still a draft: replace partner metadata, create/link its GitHub repository, then use Salla CLI preview on a demo store.');

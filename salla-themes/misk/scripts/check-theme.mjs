import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const slug = path.basename(root);
const failures = [];

async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const absolute = path.join(directory, entry.name);
    return entry.isDirectory() ? listFiles(absolute) : [absolute];
  }));
  return nested.flat();
}

const manifest = JSON.parse(await readFile(path.join(root, 'twilight.json'), 'utf8'));
const requiredPaths = [
  `src/assets/styles/04-components/${slug}.scss`,
  `src/assets/images/${slug}-editorial.jpg`,
  'src/locales/ar.json',
  'src/locales/en.json',
];

if (!manifest.name?.ar || !manifest.name?.en) failures.push('twilight.json needs Arabic and English theme names.');
for (const relativePath of requiredPaths) {
  try {
    await stat(path.join(root, relativePath));
  } catch {
    failures.push(`Missing required theme file: ${relativePath}`);
  }
}

const customComponents = (manifest.components ?? []).filter(({ path: componentPath }) =>
  componentPath?.startsWith(`home.${slug}-`),
);
if (customComponents.length < 2) failures.push(`Expected at least two ${slug} homepage components in twilight.json.`);

function validateFields(fields, prefix) {
  for (const field of fields ?? []) {
    if (typeof field.maxLength === 'number' && field.maxLength > 1000) {
      failures.push(`${prefix}.${field.id ?? 'field'} exceeds Twilight's documented 1000-character limit.`);
    }
    if (field.type === 'string' && ['text', 'textarea'].includes(field.format) && !field.multilanguage) {
      failures.push(`${prefix}.${field.id ?? 'field'} should be multilingual.`);
    }
    if (field.format === 'html' || field.type === 'html') {
      failures.push(`${prefix}.${field.id ?? 'field'} exposes a custom HTML field.`);
    }
    validateFields(field.fields, prefix);
  }
}

for (const component of customComponents) {
  validateFields(component.fields, component.path);
  const relativeTemplate = path.join('src/views/components', `${component.path.replaceAll('.', '/')}.twig`);
  try {
    await stat(path.join(root, relativeTemplate));
  } catch {
    failures.push(`No Twig template matches ${component.path}.`);
  }
}

const viewFiles = await listFiles(path.join(root, 'src/views'));
for (const file of viewFiles.filter((candidate) => candidate.endsWith('.twig'))) {
  const content = await readFile(file, 'utf8');
  if (/\|\s*raw\b/.test(content)) failures.push(`Unsafe Twig raw filter found in ${path.relative(root, file)}.`);
}

for (const locale of ['ar.json', 'en.json']) {
  try {
    JSON.parse(await readFile(path.join(root, 'src/locales', locale), 'utf8'));
  } catch {
    failures.push(`Invalid locale JSON: src/locales/${locale}`);
  }
}

if (failures.length) {
  console.error('Theme checks failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(`Theme checks passed: ${manifest.name.ar} / ${manifest.name.en}; ${customComponents.length} custom components; no Twig raw filters.`);
}

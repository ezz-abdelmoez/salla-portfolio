import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const slug = path.basename(root);
const failures = [];

async function readJson(relativePath, label) {
  try {
    return JSON.parse(await readFile(path.join(root, relativePath), 'utf8'));
  } catch (error) {
    failures.push(`Invalid or missing ${label}: ${relativePath} (${error.message})`);
    return null;
  }
}

async function requireFile(relativePath) {
  try {
    await stat(path.join(root, relativePath));
  } catch {
    failures.push(`Missing required theme file: ${relativePath}`);
  }
}

const manifest = await readJson('twilight.json', 'Twilight manifest');
const locales = {
  ar: await readJson('src/locales/ar.json', 'Arabic locale JSON'),
  en: await readJson('src/locales/en.json', 'English locale JSON'),
};

const requiredPaths = [
  `src/assets/styles/04-components/${slug}.scss`,
  'src/views/components/home/custom-testimonials.twig',
  `src/assets/images/${slug}-editorial.jpg`,
  `public/images/${slug}-editorial.jpg`,
  'public/app.css',
  'src/assets/styles/app.scss',
];
for (const relativePath of requiredPaths) await requireFile(relativePath);

if (manifest) {
  if (!manifest.name?.ar || !manifest.name?.en) failures.push('twilight.json needs Arabic and English theme names.');

  const customComponents = (manifest.components ?? []).filter(({ path: componentPath }) =>
    componentPath?.startsWith(`home.${slug}-`),
  );
  if (customComponents.length < 2) failures.push(`Expected at least two ${slug} homepage components in twilight.json.`);

  const customKeys = customComponents.map(({ key }) => key).filter(Boolean);
  if (customKeys.length !== customComponents.length || new Set(customKeys).size !== customKeys.length) {
    failures.push(`Custom component keys must exist and be unique in ${slug}'s twilight.json.`);
  }

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
    if (!component.title?.ar || !component.title?.en) {
      failures.push(`${component.path} needs Arabic and English editor labels.`);
    }
    validateFields(component.fields, component.path);

    const relativeTemplate = path.join('src/views/components', `${component.path.replaceAll('.', '/')}.twig`);
    let template;
    try {
      template = await readFile(path.join(root, relativeTemplate), 'utf8');
    } catch {
      failures.push(`No Twig template matches ${component.path}.`);
      continue;
    }

    const translationPattern = new RegExp(`trans\\(\\s*['\"]blocks\\.${slug}\\.([a-zA-Z0-9_]+)['\"]\\s*\\)`, 'g');
    for (const [, key] of template.matchAll(translationPattern)) {
      for (const language of ['ar', 'en']) {
        const value = locales[language]?.blocks?.[slug]?.[key];
        if (typeof value !== 'string' || !value.trim()) {
          failures.push(`${relativeTemplate} uses missing ${language} translation blocks.${slug}.${key}.`);
        }
      }
    }

    if (component.path.endsWith('-hero')) {
      if (!/\balt\s*=/.test(template)) failures.push(`${relativeTemplate} needs meaningful image alternative text.`);
      const defaultImages = [...template.matchAll(/default\(\s*['"]images\/([^'"]+)['"]\s*\|\s*asset\s*\)/g)];
      if (defaultImages.length === 0) failures.push(`${relativeTemplate} needs a local default editorial image.`);
      for (const [, image] of defaultImages) {
        await requireFile(`src/assets/images/${image}`);
        await requireFile(`public/images/${image}`);
      }
    }
  }

  const testimonials = (manifest.components ?? []).find(({ path: componentPath }) =>
    componentPath === 'home.custom-testimonials',
  );
  const testimonialItems = testimonials?.fields?.find(({ id }) => id === 'items');
  if (!testimonialItems) {
    failures.push('The optional custom-testimonials component needs an items collection field.');
  } else {
    if (!Array.isArray(testimonialItems.value) || testimonialItems.value.length !== 0) {
      failures.push('Custom testimonials must not ship with seeded customer identities, reviews, or ratings.');
    }
    if (testimonialItems.required !== false) {
      failures.push('Custom testimonials must be optional until the merchant supplies genuine reviews.');
    }
    const avatar = testimonialItems.fields?.find(({ id }) => id === 'items.avatar');
    if (avatar?.required !== false) failures.push('Customer avatars should be optional in custom testimonials.');
    const stars = testimonialItems.fields?.find(({ id }) => id === 'items.stars');
    if (stars?.value != null) failures.push('Custom testimonials must not preselect a customer rating.');
  }
}

let appStyles = '';
try {
  appStyles = await readFile(path.join(root, 'src/assets/styles/app.scss'), 'utf8');
} catch {
  // The missing file is reported by the required-path check above.
}
if (!appStyles.includes(`./04-components/${slug}`)) {
  failures.push(`src/assets/styles/app.scss must import the ${slug} component styles.`);
}

let testimonialTemplate = '';
try {
  testimonialTemplate = await readFile(path.join(root, 'src/views/components/home/custom-testimonials.twig'), 'utf8');
} catch {
  // The missing file is reported by the required-path check above.
}
if (!testimonialTemplate.includes('component.items is not empty')) {
  failures.push('The custom-testimonials template must hide the block when it has no genuine reviews.');
}
if (/auto-play|width:\s*830px/.test(testimonialTemplate)) {
  failures.push('Custom testimonials must not autoplay or force a fixed desktop slide width.');
}

const viewsRoot = path.join(root, 'src/views');
async function listTwigFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) return listTwigFiles(absolute);
    return entry.name.endsWith('.twig') ? [absolute] : [];
  }));
  return nested.flat();
}

try {
  for (const file of await listTwigFiles(viewsRoot)) {
    const content = await readFile(file, 'utf8');
    if (/\|\s*raw\b/.test(content)) failures.push(`Unsafe Twig raw filter found in ${path.relative(root, file)}.`);
  }
} catch (error) {
  failures.push(`Unable to scan Twig templates: ${error.message}`);
}

if (failures.length) {
  console.error('Theme checks failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  const customComponents = (manifest.components ?? []).filter(({ path: componentPath }) =>
    componentPath?.startsWith(`home.${slug}-`),
  );
  console.log(`Theme checks passed: ${manifest.name.ar} / ${manifest.name.en}; ${customComponents.length} custom components; localized fields and local hero assets verified; no seeded reviews or Twig raw filters.`);
}

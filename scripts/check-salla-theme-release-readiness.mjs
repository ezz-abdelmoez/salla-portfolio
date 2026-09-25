import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const themes = ['leen', 'mada', 'wameed', 'ward', 'qahwa', 'misk'];
const blockers = [];
const statusPath = path.join(root, 'salla-themes', 'release-status.json');
const status = JSON.parse(await readFile(statusPath, 'utf8'));

function hasPlaceholder(value) {
  return typeof value !== 'string' || /replace|placeholder|example\.com/i.test(value);
}

for (const slug of themes) {
  const themeRoot = path.join(root, 'salla-themes', slug);
  const [manifestText, packageText] = await Promise.all([
    readFile(path.join(themeRoot, 'twilight.json'), 'utf8'),
    readFile(path.join(themeRoot, 'package.json'), 'utf8'),
  ]);
  const manifest = JSON.parse(manifestText);
  const packageJson = JSON.parse(packageText);
  const themeBlockers = [];
  const packageRepository = typeof packageJson.repository === 'string'
    ? packageJson.repository
    : packageJson.repository?.url;

  if (hasPlaceholder(manifest.repository) || hasPlaceholder(packageRepository)) {
    themeBlockers.push('replace repository URLs in twilight.json and package.json');
  }
  if (hasPlaceholder(manifest.author_email)) themeBlockers.push('set the publisher/support email');
  if (hasPlaceholder(packageJson.author)) themeBlockers.push('set the package author to the registered theme owner');
  if (hasPlaceholder(manifest.support_url)) themeBlockers.push('set a real support URL');

  let licenseFileExists = false;
  try {
    await stat(path.join(themeRoot, 'LICENSE.md'));
    licenseFileExists = true;
  } catch {
    // A missing license file is a release blocker; never infer rights from a public repository.
  }
  if (packageJson.license === 'UNLICENSED' || !licenseFileExists) {
    themeBlockers.push('confirm redistribution rights and include the applicable license text');
  }

  if (themeBlockers.length) {
    blockers.push(...themeBlockers.map((item) => `${slug}: ${item}`));
    console.log(`[BLOCKED] ${manifest.name?.ar ?? slug} (${slug})`);
    for (const blocker of themeBlockers) console.log(`  - ${blocker}`);
  } else {
    console.log(`[METADATA OK] ${manifest.name?.ar ?? slug} (${slug})`);
  }
}

console.log('\n[PARTNER PORTAL — recorded manually; no credentials are stored here]');
if (status.partnerPortal?.accountReady !== true) {
  const blocker = 'create/connect the Salla Partner account';
  console.log(`  - ${blocker}`);
  blockers.push(blocker);
}
if (status.partnerPortal?.previewStoreAvailable !== true) {
  const blocker = 'create and record an available Salla preview store';
  console.log(`  - ${blocker}`);
  blockers.push(blocker);
}

console.log('\n[THEME PREVIEW AND SALLA REVIEW — recorded manually; not verifiable by local code]');
for (const slug of themes) {
  const externalStatus = status.themes?.[slug];
  if (externalStatus?.previewPassed !== true) {
    const blocker = `${slug}: run and record the official Salla preview checks on the preview store`;
    console.log(`  - ${blocker}`);
    blockers.push(blocker);
  }
  if (externalStatus?.sallaReviewApproved !== true) {
    const blocker = `${slug}: complete Partner Portal submission and Salla review`;
    console.log(`  - ${blocker}`);
    blockers.push(blocker);
  }
}

if (blockers.length) {
  console.error(`\nRelease readiness: BLOCKED (${blockers.length} outstanding gates). Local checks/builds do not prove Salla compatibility or approval.`);
  process.exitCode = 1;
} else {
  console.log('\nRelease readiness: all recorded gates passed. This still does not imply Salla approval unless the official review is recorded.');
}

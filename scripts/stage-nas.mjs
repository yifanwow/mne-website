// Create a fresh, self-contained static deployment. Never overwrite a deployed directory.
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const root = path.resolve(fileURLToPath(new URL('../', import.meta.url)));
const [mode, argument] = process.argv.slice(2);
if (!['--output', '--verify'].includes(mode) || !argument) {
  throw new Error('Usage: node scripts/stage-nas.mjs --output NEW_DIRECTORY | --verify DIRECTORY');
}
const target = path.resolve(argument);
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');

async function walk(directory, prefix = '') {
  const files = [];
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const relative = path.posix.join(prefix, entry.name);
    if (entry.isDirectory()) files.push(...await walk(path.join(directory, entry.name), relative));
    else if (entry.isFile()) files.push(relative);
    else throw new Error(`Unsupported filesystem entry: ${relative}`);
  }
  return files.sort();
}

if (mode === '--output') {
  const sourceFiles = await walk(path.join(root, 'dist'));
  const siteFiles = await Promise.all(sourceFiles.map(async name => [name, await fs.readFile(path.join(root, 'dist', name))]));
  const compose = await fs.readFile(path.join(root, 'deploy/docker-compose.yml'));
  const nginx = await fs.readFile(path.join(root, 'deploy/nginx.conf'));
  const guide = await fs.readFile(path.join(root, 'docs/nas-hosting.md'));
  const { version } = JSON.parse(await fs.readFile(path.join(root, 'package.json'), 'utf8'));
  const sourceCommit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
  // mkdir without recursive refuses an existing target, including symbolic links.
  await fs.mkdir(target);
  await fs.writeFile(path.join(target, 'docker-compose.yml'), compose, { flag: 'wx' });
  await fs.writeFile(path.join(target, 'nginx.conf'), nginx, { flag: 'wx' });
  await fs.writeFile(path.join(target, '部署步骤.md'), guide, { flag: 'wx' });
  for (const [name, bytes] of siteFiles) {
    const destination = path.join(target, 'site', name);
    await fs.mkdir(path.dirname(destination), { recursive: true });
    await fs.writeFile(destination, bytes, { flag: 'wx' });
  }
  const files = await walk(target);
  const entries = await Promise.all(files.map(async name => ({ path: name, sha256: hash(await fs.readFile(path.join(target, name))) })));
  await fs.writeFile(path.join(target, 'release.json'), JSON.stringify({
    version, sourceCommit, stagedAt: new Date().toISOString(), domain: 'mne.yifanovo.com', files: entries
  }, null, 2) + '\n', { flag: 'wx' });
  console.log(`Prepared ${target}: ${entries.length} files, site version ${version}. Containers have not been started.`);
} else {
  const release = JSON.parse(await fs.readFile(path.join(target, 'release.json'), 'utf8'));
  for (const file of release.files) {
    if (path.isAbsolute(file.path) || file.path.split(/[\\/]/).includes('..')) throw new Error('Invalid manifest path');
    const bytes = await fs.readFile(path.join(target, file.path));
    if (hash(bytes) !== file.sha256) throw new Error(`SHA-256 mismatch: ${file.path}`);
  }
  console.log(`Verified ${release.files.length} files: ${target} (version ${release.version}).`);
}

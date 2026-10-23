import { readFile, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = fileURLToPath(new URL('../dist/', import.meta.url));
const html = await readFile(path.join(root, 'index.html'), 'utf8');
const js = (await Promise.all(['app.js','motion-copy.js','product-copy.js','stories-copy.js','refine-copy.js','latest-copy.js'].map(file=>readFile(path.join(root,file),'utf8')))).join('\n');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
if (new Set(ids).size !== ids.length) throw new Error('Duplicate HTML IDs');
for (const match of html.matchAll(/(?:src|href)="(\.\/[^"#]+)"/g)) await access(path.join(root, match[1].split('?')[0]));
for (const match of html.matchAll(/href="#([^"]+)"/g)) if (!ids.includes(match[1])) throw new Error(`Missing anchor ${match[1]}`);
for (const match of html.matchAll(/data-i18n="([^"]+)"/g)) {
  const count = [...js.matchAll(new RegExp(`\\b${match[1]}["']?\\s*:`, 'g'))].length;
  if (count !== 2) throw new Error(`Missing bilingual copy for ${match[1]}`);
}
console.log('Local assets, unique IDs, section anchors and bilingual copy: passed.');

// Update website bytes in the existing bind-mounted directory; preserve NAS-specific configuration.
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const root = path.resolve(fileURLToPath(new URL('../', import.meta.url)));
const target = path.resolve(process.argv[2] || '/Volumes/docker/mne-website');
if(path.basename(target)!=='mne-website')throw new Error('Target must be the existing mne-website project directory');
for(const required of ['site','docker-compose.yml','nginx.conf','release.json']) {
  const stat=await fs.lstat(path.join(target,required));
  if(stat.isSymbolicLink())throw new Error(`Refusing symbolic link: ${required}`);
}
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
async function walk(directory,prefix='') {
  const files=[];
  for(const entry of await fs.readdir(directory,{withFileTypes:true})) {
    if(entry.name.startsWith('.'))continue;
    const name=path.posix.join(prefix,entry.name);
    if(entry.isDirectory())files.push(...await walk(path.join(directory,entry.name),name));
    else if(entry.isFile())files.push(name);
    else throw new Error(`Unsupported entry: ${name}`);
  }
  return files.sort();
}
const changed=[];
for(const name of await walk(path.join(root,'dist'))) {
  const bytes=await fs.readFile(path.join(root,'dist',name));
  let old;
  try {old=await fs.readFile(path.join(target,'site',name));}catch(error){if(error.code!=='ENOENT')throw error;}
  if(!old||hash(old)!==hash(bytes))changed.push({name,bytes});
}
const configBefore=await Promise.all(['docker-compose.yml','nginx.conf'].map(async name=>({name,hash:hash(await fs.readFile(path.join(target,name)))})));
const backupRoot=path.join(path.dirname(target),'mne-website-backups');
await fs.mkdir(backupRoot,{recursive:true});
const backup=path.join(backupRoot,new Date().toISOString().replace(/[:.]/g,'-'));
await fs.cp(target,backup,{recursive:true,errorOnExist:true,force:false,filter:source=>path.basename(source)!=='.DS_Store'});

// Replace index last; keep the site directory inode so an existing Docker bind mount sees updates.
changed.sort((a,b)=>Number(a.name==='index.html')-Number(b.name==='index.html'));
async function replace(destination,bytes) {
  await fs.mkdir(path.dirname(destination),{recursive:true});
  const temporary=path.join(path.dirname(destination),`.mne-update-${crypto.randomUUID()}`);
  await fs.writeFile(temporary,bytes,{flag:'wx'});
  await fs.rename(temporary,destination);
}
for(const file of changed)await replace(path.join(target,'site',file.name),file.bytes);
for(const file of configBefore) {
  if(hash(await fs.readFile(path.join(target,file.name)))!==file.hash)throw new Error('NAS configuration changed during sync');
}
const entries=await Promise.all((await walk(target)).filter(name=>name!=='release.json').map(async name=>({path:name,sha256:hash(await fs.readFile(path.join(target,name)))})));
const {version}=JSON.parse(await fs.readFile(path.join(root,'package.json'),'utf8'));
const sourceCommit=execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim();
await replace(path.join(target,'release.json'),JSON.stringify({version,sourceCommit,stagedAt:new Date().toISOString(),domain:'mne.yifanovo.com',files:entries},null,2)+'\n');
console.log(JSON.stringify({version,changed:changed.map(file=>file.name),backup,configuration:'preserved',containers:'not restarted'},null,2));

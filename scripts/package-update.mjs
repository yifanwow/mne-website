// A full static-only update. It deliberately excludes all infrastructure configuration.
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const {version}=JSON.parse(await fs.readFile(path.join(root,'package.json'),'utf8'));
const label=`mne-website-update-${version}`;
const releases=path.join(root,'releases'),target=path.join(releases,label),archive=path.join(releases,label+'.zip');
await fs.mkdir(releases,{recursive:true});
await fs.mkdir(target); // Refuse an existing release rather than silently replacing it.
await fs.cp(path.join(root,'dist'),path.join(target,'site'),{recursive:true});
await fs.copyFile(path.join(root,'docs/nas-update.md'),path.join(target,'更新步骤.md'));
async function walk(directory,prefix='') {
  const out=[];
  for(const entry of await fs.readdir(directory,{withFileTypes:true})) {
    if(entry.name.startsWith('.'))continue;
    const name=path.posix.join(prefix,entry.name);
    if(entry.isDirectory())out.push(...await walk(path.join(directory,entry.name),name));
    else if(entry.isFile())out.push(name);
    else throw new Error('Unexpected package entry: '+name);
  }
  return out.sort();
}
const files=await Promise.all((await walk(target)).map(async name=>({path:name,sha256:crypto.createHash('sha256').update(await fs.readFile(path.join(target,name))).digest('hex')})));
await fs.writeFile(path.join(target,'release.json'),JSON.stringify({
  version,sourceCommit:execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim(),
  appVersion:'0.9.190 (221)',appSourceCommit:'294634c4728d928d1f179ab7de3d690d38ba47c5',
  stagedAt:new Date().toISOString(),domain:'mne.yifanovo.com',type:'static-site-update',files
},null,2)+'\n');
execFileSync('/usr/bin/zip',['-q','-r','-X',archive,label],{cwd:releases});
console.log(JSON.stringify({archive,files:files.length,bytes:(await fs.stat(archive)).size,version}));

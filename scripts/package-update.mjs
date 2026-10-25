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
// A drifted alias must never be shipped with different legal text.
const policy=await fs.readFile(path.join(root,'dist/privacy/index.html'),'utf8');
if(policy!==await fs.readFile(path.join(root,'dist/privacy.html'),'utf8')) throw new Error('Privacy aliases differ');
if(policy.includes('{{CONTACT_EMAIL}}')) throw new Error('Confirm the policy contact email before packaging');
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
  appVersion:'0.9.320 (351)',appSourceCommit:'b0c33bc8942a2926530920e35ee044d6042b3986',appSourceType:'local-source-not-public-release',appSourceScope:'homepage-feature-copy',
  privacyAudit:{date:'2026-10-24',appVersion:'0.9.384 (415)',appSourceCommit:'55b6e0943c60c1f89f22e9e5d524eeb786a0defa',includesUncommittedChanges:true,productionVerified:false,privacyRouteConfigChangeRequired:true,submissionBuild:null,developerConfirmedProviders:['Cloudflare','Tencent Cloud'],developerConfirmedNoSale:true},
  sourceIncludesUncommittedChanges:execFileSync('git',['status','--porcelain'],{cwd:root,encoding:'utf8'}).trim().length>0,
  stagedAt:new Date().toISOString(),domain:'mne.yifanovo.com',type:'static-site-update',files
},null,2)+'\n');
execFileSync('/usr/bin/zip',['-q','-r','-X',archive,label],{cwd:releases});
console.log(JSON.stringify({archive,files:files.length,bytes:(await fs.stat(archive)).size,version}));

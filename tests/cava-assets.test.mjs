import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

test('every selectable local rendering exists and is a nonempty PNG', async()=>{
 const source=await readFile(new URL('../app/hat-assets.ts',import.meta.url),'utf8');
 const files=[...new Set([...source.matchAll(/cowboyAsset\("([^"]+)"\)/g)].map(m=>m[1]))];
 assert.ok(files.length>80);
 for(const file of files){
  const png=await readFile(new URL(`../public/cowboy-renderings/${file}`,import.meta.url));
  assert.equal(png.subarray(1,4).toString(),'PNG',file);
  assert.ok(png.readUInt32BE(16)>0 && png.readUInt32BE(20)>0,file);
 }
});

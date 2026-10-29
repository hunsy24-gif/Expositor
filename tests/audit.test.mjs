import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createSermon,createCard,normalize,merge,isPrivate,safeResearch,safePulpit,pulpitText,researchText} from '../src/domain.js';
// Persistence and domain edge cases: no creation of a public record from private material.
const mark=createSermon({title:'The Physician and Bridegroom',passage:'Mark 2:13–22'});
const privateRecords=[
  createCard({kind:'Private journal',body:'private meditation',private:false,disposition:'Pulpit'}),
  createCard({kind:'Prayer',body:'private prayer',private:false,disposition:'Pulpit'}),
  createCard({kind:'Observation',body:'sensitive journal note',private:true,disposition:'Pulpit'})
];
for(const c of privateRecords){assert(isPrivate(c));assert.equal(c.disposition,'Keep for later');}
const verified=createCard({kind:'Exact quotation',body:'verified text',source:'Printed work',page:'42',status:'Verified',disposition:'Pulpit'});
const missingPage=createCard({kind:'Exact quotation',body:'missing page',source:'Printed work',status:'Verified',disposition:'Pulpit'});
const notVerified=createCard({kind:'Exact quotation',body:'unverified text',source:'Printed work',page:'43',status:'To verify',disposition:'Pulpit'});
const publicNote=createCard({kind:'Observation',body:'test from v17',verse:'Mark 2:17',disposition:'Pulpit'});
mark.cards=[...privateRecords,verified,missingPage,notVerified,publicNote];
assert.equal(safeResearch(mark).length,4);
assert.deepEqual(safePulpit(mark).map(x=>x.body),['verified text','test from v17']);
for(const txt of ['private meditation','private prayer','sensitive journal note']){
  assert(!pulpitText(mark).includes(txt));assert(!researchText(mark).includes(txt));
}
assert(!pulpitText(mark).includes('missing page'));
const newer={version:99,sermons:[mark]};
assert.throws(()=>normalize(newer),/newer Expositor/);
const original=normalize({version:3,sermons:[mark]});
const duplicate=normalize({version:3,sermons:[mark,mark]});
assert.equal(duplicate.sermons.length,1);
const keep=merge(original,{version:3,sermons:[{...mark,title:'overwritten?' }]});
assert.equal(keep.sermons[0].title,'The Physician and Bridegroom');
const archive=normalize({version:3,sermons:[{...mark,archived:true,stage:'preach'}]});
assert.equal(archive.sermons[0].archived,true);
assert.equal(archive.sermons[0].stage,'preach');
// Data-size smoke (in-memory, not a claim about device storage quotas).
const many=Array.from({length:25},(_,i)=>({...createSermon({title:'Passage '+i,passage:'Mark '+i}),cards:Array.from({length:100},(_,k)=>createCard({body:'Observation '+i+'.'+k,kind:'Observation',verse:'Mark 2'}))}));
const roundTrip=normalize(JSON.parse(JSON.stringify({version:3,sermons:many})));
assert.equal(roundTrip.sermons.length,25);
assert.equal(roundTrip.sermons.reduce((n,s)=>n+s.cards.length,0),2500);
// UI quality gates are source checks only; actual pen input requires a device.
const app=fs.readFileSync('App.js','utf8'),entry=fs.readFileSync('index.js','utf8'),sdk=fs.readFileSync('src/sdk.js','utf8');
for(const key of ['Unsaved preparation','Discard and return','Save failed','Save FAILED','CHANGE DESTINATION SERMON','RETURN TO NOTE','minHeight:44','storageOK','captureLock.current'])assert(app.includes(key),key);
assert(entry.includes("editDataTypes:[0]"));
assert(entry.includes("editDataTypes:[3]"));
assert(entry.includes("registerButton(3")||entry.includes("[3,['DOC']"));
assert(entry.includes('getPluginDirPath'));
assert(sdk.includes('releaseLasso'));
assert(sdk.includes('recognizeElements'));
assert(sdk.includes('getLastSelectedText'));
console.log('PASS: 25 dossier/2,500 card model smoke, private export safety, source fidelity and UI/API regression checks');

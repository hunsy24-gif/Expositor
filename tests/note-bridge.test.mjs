import assert from 'node:assert/strict';
import {NOTE_TEMPLATES,promptForNote,sourceCardForNote,noteTextLayout,assertBlankNotePage} from '../src/note-bridge-core.js';
assert.equal(NOTE_TEMPLATES.length,6);
for(const t of NOTE_TEMPLATES){const x=promptForNote(t.key,{title:'Mark 2',passage:'Mark 2:13–22'});assert(x.includes('Mark 2'));assert(x.length<=550);const y=noteTextLayout(x,{width:1920,height:2560});assert(y.textRect.bottom<1280);}
assert.throws(()=>assertBlankNotePage('file.pdf',[]),/NOTE/);
assert.throws(()=>assertBlankNotePage('test.note',[{type:0}]),/blank page/);
assert.throws(()=>assertBlankNotePage('test.note',null),/verify a blank/);
assert(assertBlankNotePage('test.note',[]));
assert.throws(()=>sourceCardForNote({kind:'Prayer',body:'private'},{}),/Private/);
assert.throws(()=>sourceCardForNote({kind:'Observation',body:'private',private:true},{}),/Private/);
assert(sourceCardForNote({kind:'Exact quotation',body:'Quoted',status:'To verify'},{passage:'Mark 2'}).includes('TO VERIFY'));
assert.throws(()=>noteTextLayout('x'.repeat(4000),{width:1920,height:2560}),/too long/);
console.log('PASS: native Note insertion preflight, private exclusion, Manta text geometry, handwritten journaling prompts');

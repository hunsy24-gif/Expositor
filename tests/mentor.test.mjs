import assert from 'node:assert/strict';
import {MENTOR_QUESTIONS,mentorForStage} from '../src/mentor.js';
import {KINDS,STAGES} from '../src/domain.js';
assert(MENTOR_QUESTIONS.length>=15);
for(const s of STAGES){const a=mentorForStage(s.key);assert(a.length>=3,'Too few prompts for '+s.key);for(const q of a){assert(q.source&&q.ref&&q.question.length>20&&q.help&&KINDS.includes(q.kind));}}
assert.equal(MENTOR_QUESTIONS.filter(x=>x.kind==='Private journal').length,2);
assert(!MENTOR_QUESTIONS.some(x=>x.question.includes('AI-generated')));
console.log('PASS: source-grounded mentor stages, distinct private prompts, and prompt types');

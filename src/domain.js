/* Text-first preaching model. Never mutates original Supernote handwriting or source documents. */
export const VERSION=3;
export const STAGES=[
{key:'observe',label:'TEXT',question:'What does the passage actually say?',prompt:'Read repeatedly, track its movement and mark significant words and relationships. Observe before consulting commentaries.'},
{key:'interpret',label:'MEANING',question:'What did the biblical author communicate, and why?',prompt:'Study book context, genre, original audience, grammar, difficult verses, and alternative interpretations.'},
{key:'reflect',label:'HEART',question:'Where must I come under this Word?',prompt:'Meditate, pray, confess, believe, and respond before preaching to others. Private journal cards stay private.'},
{key:'shape',label:'SERMON',question:'How can I communicate this text faithfully?',prompt:'Distinguish the exegetical idea from sermon expression. Make each movement flow from Scripture and the author’s purpose.'},
{key:'preach',label:'PULPIT',question:'Can I proclaim the central burden clearly?',prompt:'Cut interesting but nonessential material, rehearse aloud, verify quotations, and prepare spoken-speed notes.'}
];
export const KINDS=['Observation','Structure','Exegetical question','Commentary','Exact quotation','Paraphrase','Cross-reference','Historical context','Greek / Hebrew','Image reference','Illustration','Application','Sermon draft','Private journal','Prayer'];
export const DISPOSITIONS=['Study','Consider for sermon','Pulpit','Keep for later'];
export const STATUS=['To verify','Verified','Tentative','Disputed'];
export const CHECKS=[
'Passage boundaries and setting in the book are understood.',
'I can state the author’s subject and complement.',
'I can trace the actual logic or narrative of the text.',
'I investigated difficult verses and serious alternatives.',
'I distinguish my observations, inferences, and commentators’ claims.',
'Cross-references and the relationship to Christ are warranted.',
'The sermon structure and applications arise from this text.',
'I have personally prayed and submitted to this Word.',
'I can explain the central idea in clear spoken language.',
'Quotations are verified; I have rehearsed and prepared pulpit notes.'
];
const clean=(x,max=14000)=>String(x??'').trim().slice(0,max);
const id=(p)=>p+'_'+Date.now()+'_'+Math.random().toString(36).slice(2,12);
export const isPrivate=(c)=>c?.private===true||c?.kind==='Private journal'||c?.kind==='Prayer';
export function createSermon(x){const title=clean(x.title,150),passage=clean(x.passage,100);if(!title||!passage)throw Error('Enter a sermon title and biblical passage.');const now=new Date().toISOString();return{id:id('s'),title,passage,series:clean(x.series,120),date:clean(x.date,40),stage:'observe',idea:'',purpose:'',cards:[],checklist:[],archived:false,createdAt:now,updatedAt:now};}
export function createCard(x){const kind=KINDS.includes(x.kind)?x.kind:'Observation',body=clean(x.body),source=clean(x.source,400),location=clean(x.location,900);if(!body&&!source&&!location)throw Error('Add an observation, source, or document reference.');const privateRecord=isPrivate({...x,kind});return{id:id('r'),kind,body,verse:clean(x.verse,100),source,page:clean(x.page,100),location,status:STATUS.includes(x.status)?x.status:'To verify',disposition:privateRecord?'Keep for later':DISPOSITIONS.includes(x.disposition)?x.disposition:'Study',private:privateRecord,createdAt:new Date().toISOString()};}
export function normalize(raw){if(!raw||!Array.isArray(raw.sermons))throw Error('Invalid sermon database.');if(Number(raw.version||1)>VERSION)throw Error('Database was saved by a newer Expositor version.');const seen=new Set();return{version:VERSION,sermons:raw.sermons.filter(s=>s&&typeof s.id==='string'&&typeof s.title==='string'&&typeof s.passage==='string').filter(s=>{if(seen.has(s.id))return false;seen.add(s.id);return true;}).map(s=>{const cids=new Set();return{id:clean(s.id,100),title:clean(s.title,150),passage:clean(s.passage,100),series:clean(s.series,120),date:clean(s.date,40),stage:STAGES.some(t=>t.key===s.stage)?s.stage:'observe',idea:clean(s.idea),purpose:clean(s.purpose),archived:!!s.archived,checklist:[...new Set((Array.isArray(s.checklist)?s.checklist:[]).filter(n=>Number.isInteger(n)&&n>=0&&n<CHECKS.length))],createdAt:clean(s.createdAt,70),updatedAt:clean(s.updatedAt,70),cards:(Array.isArray(s.cards)?s.cards:[]).filter(c=>c&&typeof c.id==='string').filter(c=>{if(cids.has(c.id))return false;cids.add(c.id);return true;}).map(c=>{const kind=KINDS.includes(c.kind)?c.kind:'Observation',p=isPrivate({...c,kind});return{id:clean(c.id,100),kind,body:clean(c.body),verse:clean(c.verse,100),source:clean(c.source,400),page:clean(c.page,100),location:clean(c.location,900),private:p,status:STATUS.includes(c.status)?c.status:'To verify',disposition:p?'Keep for later':DISPOSITIONS.includes(c.disposition)?c.disposition:'Study',createdAt:clean(c.createdAt,70)};})};})};}
export function safeResearch(sermon){return (sermon.cards||[]).filter(c=>!isPrivate(c));}
export function safePulpit(sermon){return safeResearch(sermon).filter(c=>c.disposition==='Pulpit'&&(c.kind!=='Exact quotation'||(c.status==='Verified'&&c.source&&(c.page||c.location))));}
export function researchText(s){return [s.title,s.passage,'', 'EXEGETICAL IDEA',s.idea||'(pending)','', 'PURPOSE',s.purpose||'(pending)','',...safeResearch(s).map(c=>[c.kind+' · '+c.verse,c.body,c.source?'Source: '+c.source+' '+c.page:'',c.location?'Location: '+c.location:'', 'Verification: '+c.status].filter(Boolean).join('\n\n'))].join('\n\n');}
export function pulpitText(s){return [s.title,s.passage,'','CENTRAL BURDEN',s.idea||'(pending)','PURPOSE',s.purpose||'(pending)','',...safePulpit(s).map(c=>c.verse+'\n'+c.body+(c.source?'\n'+c.source+' '+c.page:''))].join('\n\n');}
export function merge(existing,incoming){const a=normalize(existing),b=normalize(incoming),ids=new Set(a.sermons.map(s=>s.id));return normalize({version:VERSION,sermons:[...a.sermons,...b.sermons.filter(s=>!ids.has(s.id))]});}

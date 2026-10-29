import {normalize} from './domain.js';
export const KEYS={main:'the-expositor:dossiers:v2',previous:'the-expositor:dossiers:previous',legacy:'the-expositor:dossiers:v1'};
/** Storage receives an async getItem/setItem adapter; pure control flow is testable with corruption and I/O failures. */
export function dossierStore(adapter){
  if(!adapter||typeof adapter.getItem!=='function'||typeof adapter.setItem!=='function')throw Error('Storage adapter not available.');
  async function load(){
    const raw=await adapter.getItem(KEYS.main);
    if(raw!==null&&raw!==undefined){
      try{return normalize(JSON.parse(raw));}
      catch(primaryError){
        const copy=await adapter.getItem(KEYS.previous);
        if(copy===null||copy===undefined)throw primaryError;
        const recovered=normalize(JSON.parse(copy));
        return {...recovered,recoveredFromPrevious:true};
      }
    }
    const old=await adapter.getItem(KEYS.legacy);
    return old===null||old===undefined?normalize({version:3,sermons:[]}):normalize(JSON.parse(old));
  }
  async function store(data){
    const raw=JSON.stringify(normalize(data));
    // Verify that the old data is sound BEFORE it replaces the recovery copy.
    const old=await adapter.getItem(KEYS.main);
    if(old!==null&&old!==undefined){
      try{
        normalize(JSON.parse(old));
        await adapter.setItem(KEYS.previous,old);
      }catch(error){
        // Preserve previous valid backup. Never copy a corrupt primary over it.
        if(error instanceof SyntaxError||String(error).includes('Invalid sermon database')||String(error).includes('newer Expositor version')){
          // On recovery from newer versions, don't risk writing at all.
          if(String(error).includes('newer Expositor version'))throw error;
        } else {
          throw error; // Critical: a storage write failure must never be silently ignored.
        }
      }
    }
    await adapter.setItem(KEYS.main,raw);
    if(await adapter.getItem(KEYS.main)!==raw)throw Error('Database read-back verification failed.');
  }
  async function previous(){
    const copy=await adapter.getItem(KEYS.previous);
    if(copy===null||copy===undefined)throw Error('No prior good save is available.');
    return normalize(JSON.parse(copy));
  }
  return {load,store,previous};
}

import {PluginCommAPI,PluginManager,PluginNoteAPI,PluginDocAPI} from 'sn-plugin-lib';
const READ='plugin.permission.FILE:READ';
const granted=x=>x===1||x===2;
const unwrap=(res,name)=>{if(!res?.success||res.result===undefined||res.result===null)throw Error(name+': '+(res?.error?.message||'not available'));return res.result;};
async function ensureRead(){const has=await PluginManager.hasPermission(READ);if(granted(has))return;const ok=await PluginManager.requestPermission(READ,'The Expositor reads only the current handwriting selection and source page, without changing ink.');if(!granted(ok))throw Error('File-read permission was not granted; enter the location manually.');}
const tidy=s=>String(s||'').replace(/\s+/g,' ').trim().slice(0,12000);
const docPath=p=>/\.(pdf|epub|xps|cbz|fb2|docx?)(?:$|[?#])/i.test(String(p));
async function releaseLasso(){try{await PluginCommAPI.setLassoBoxState(2);}catch(e){/* Exit remains available even when firmware lacks release. */}}
/** 
 * All recognition is local to the Supernote firmware. No writing to NOTE/DOC.
 * Every captured passage must be reviewed before it is treated as a verified quotation.
 * Source pageIndex is retained unmodified internally; displayed page is one-based.
 */
export async function getSelectionCapture({recognize=true,context='auto'}={}){
  try{await ensureRead();}catch(error){if(context!=='doc')await releaseLasso();throw error;}
  const result={path:'',page:'',pageIndex:null,selection:'',body:'',recognized:false,warning:''};
  try{result.path=String(unwrap(await PluginCommAPI.getCurrentFilePath(),'current file path'));}catch(e){result.warning='File path unavailable; enter document title/page manually.';}
  try{const n=unwrap(await PluginCommAPI.getCurrentPageNum(),'current page');if(Number.isInteger(Number(n))&&Number(n)>=0){result.pageIndex=Number(n);result.page=String(result.pageIndex+1);}}catch(e){}
  if(!recognize)return result;
  const isDoc=context==='doc'||(context!=='note'&&docPath(result.path));
  if(isDoc){
    try{
      const value=tidy(unwrap(await PluginDocAPI.getLastSelectedText(),'DOC selected text'));
      if(value){result.body=value;result.recognized=true;result.selection='document text selection';}
      else result.warning='No text selection found. Keep the document page reference instead.';
    }catch(e){result.warning='Selected document text unavailable; record source/page and add your own note.';}
    return result;
  }
  try{
    // Normal typed text boxes retain full content; skip OCR.
    try{
      const typed=unwrap(await PluginNoteAPI.getLassoText(),'selected text boxes');
      const t=Array.isArray(typed)?typed.map(x=>x?.textContentFull).filter(x=>typeof x==='string'&&x.trim()).join(' '):'';
      if(t.trim()){result.body=tidy(t);result.recognized=true;result.selection='typed NOTE selection';return result;}
    }catch(e){/* Selection likely contains handwritten strokes. */}
    try{
      const elements=unwrap(await PluginCommAPI.getLassoElements(),'handwriting selection');
      if(!Array.isArray(elements)||!elements.length)throw Error('No selected ink.');
      result.selection=elements.length+' ink element(s)';
      const size=unwrap(await PluginCommAPI.getPageDisplaySize(),'NOTE page size');
      const text=unwrap(await PluginCommAPI.recognizeElements(elements,size),'on-device handwriting recognizer');
      const value=tidy(text);
      if(value){result.body=value;result.recognized=true;}
      else result.warning='Handwriting was not recognized; source location retained.';
    }catch(e){result.warning=result.warning||'No handwriting transcription available; original ink is unaffected.';}
  }finally{await releaseLasso();}
  return result;
}
export async function getNoteLocation(){return getSelectionCapture({recognize:false});}

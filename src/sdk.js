import {PluginCommAPI,PluginManager,PluginNoteAPI} from 'sn-plugin-lib';
const READ='plugin.permission.FILE:READ';
const granted=x=>x===1||x===2;
const unwrap=(res,name)=>{if(!res?.success||res.result===undefined||res.result===null)throw Error(name+': '+(res?.error?.message||'not available'));return res.result;};
async function ensureRead(){const has=await PluginManager.hasPermission(READ);if(granted(has))return;const ok=await PluginManager.requestPermission(READ,'The Expositor reads the current selection and page reference; it does not edit your handwriting.');if(!granted(ok))throw Error('Supernote file-read permission was not granted. Capture the reference manually.');}
function tidy(s){return String(s||'').replace(/\s+/g,' ').trim().slice(0,12000);}
/**
 * Read current NOTE selection without altering strokes. When native OCR fails,
 * still keep a source locator and tell the user the transcription was not made.
 * Handwriting OCR is unverified text, never an authenticated exact quotation.
 */
export async function getSelectionCapture({recognize=true}={}){
  await ensureRead();
  const result={path:'',page:'',pageIndex:null,selection:'',body:'',recognized:false,warning:''};
  try{result.path=String(unwrap(await PluginCommAPI.getCurrentFilePath(),'current file path'));}catch(e){result.warning='File location unavailable; enter source manually.';}
  try{const n=unwrap(await PluginCommAPI.getCurrentPageNum(),'current page number');if(Number.isInteger(Number(n))&&Number(n)>=0){result.pageIndex=Number(n);result.page=String(result.pageIndex+1);}}catch(e){}
  if(!recognize)return result;
  try{
    // Typed NOTE text boxes already carry their own text; no OCR needed.
    const typed=unwrap(await PluginNoteAPI.getLassoText(),'typed lasso text');
    const text=Array.isArray(typed)?typed.map(x=>x?.textContentFull).filter(x=>typeof x==='string'&&x.trim()).join(' '):'';
    if(text.trim()){result.body=tidy(text);result.recognized=true;result.selection='typed selection';return result;}
  }catch(e){/* No text boxes in selection; try handwriting OCR. */}
  try{
    const elements=unwrap(await PluginCommAPI.getLassoElements(),'lasso elements');
    if(!Array.isArray(elements)||elements.length===0)throw Error('No handwritten selection to recognize.');
    result.selection=elements.length+' selected ink element(s)';
    const size=unwrap(await PluginCommAPI.getPageDisplaySize(),'page display size');
    const text=unwrap(await PluginCommAPI.recognizeElements(elements,size),'on-device ink recognition');
    const value=tidy(text);
    if(value){result.body=value;result.recognized=true;}
    else result.warning='Handwriting could not be recognized. The original ink and source reference remain available.';
  }catch(e){result.warning=result.warning||'No OCR transcription available. Save the source reference or type an observation.';}
  return result;
}
export async function getNoteLocation(){return getSelectionCapture({recognize:false});}

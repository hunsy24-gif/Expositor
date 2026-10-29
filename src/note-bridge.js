import {PluginCommAPI,PluginFileAPI,PluginNoteAPI,PluginManager} from 'sn-plugin-lib';
import {assertBlankNotePage,noteTextLayout} from './note-bridge-core';
const READ='plugin.permission.FILE:READ',WRITE='plugin.permission.FILE:WRITE';
const valid=x=>x===1||x===2;
const unwrap=(r,what)=>{if(!r?.success||r.result===undefined||r.result===null||r.result===false)throw Error(what+': '+(r?.error?.message||'Supernote returned no result'));return r.result;};
async function permission(value,message){const has=await PluginManager.hasPermission(value);if(valid(has))return;const result=await PluginManager.requestPermission(value,message);if(!valid(result))throw Error('Permission not granted. No Note was changed.');}
/** One user-approved, short, editable text box into a BLANK native NOTE page. Never replaces any ink. */
export async function insertIntoBlankNote(text){
 await permission(READ,'The Expositor must check that the Note page is blank before inserting research.');
 const file=unwrap(await PluginCommAPI.getCurrentFilePath(),'Active file');
 if(!/\.note$/i.test(String(file)))throw Error('Open a Supernote NOTE, not a PDF, and select a blank page. No changes made.');
 const page=unwrap(await PluginCommAPI.getCurrentPageNum(),'Current page');
 if(!Number.isInteger(page)||page<0)throw Error('Invalid Note page. No changes made.');
 const size=unwrap(await PluginCommAPI.getPageDisplaySize(),'Note page size');
 const fields=noteTextLayout(text,size);
 async function checkBlank(){
   const elements=unwrap(await PluginFileAPI.getElements(page,file),'Read Note page');
   try{assertBlankNotePage(file,elements);}
   finally{for(const e of elements||[]){try{if(typeof e?.recycle==='function')await e.recycle();}catch(err){}}}
 }
 await checkBlank();
 await permission(WRITE,'The Expositor will put ONE text box on this blank Note page. It will not delete handwriting.');
 const current=unwrap(await PluginCommAPI.getCurrentFilePath(),'Verify active Note');
 const pg=unwrap(await PluginCommAPI.getCurrentPageNum(),'Verify active page');
 if(file!==current||page!==pg)throw Error('The active Note page changed. Nothing inserted.');
 await checkBlank();
 unwrap(await PluginNoteAPI.insertText(fields),'Insert text box');
 unwrap(await PluginNoteAPI.saveCurrentNote(),'Save Note');
 return{path:file,pageIndex:page,inserted:true};
}

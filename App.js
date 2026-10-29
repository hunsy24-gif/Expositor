import React,{useState,useEffect,useRef} from 'react';
import {PluginManager} from 'sn-plugin-lib';
import {ActivityIndicator,Alert,Pressable,ScrollView,Share,StyleSheet,Text,TextInput,View} from 'react-native';
import {STAGES,KINDS,STATUS,DISPOSITIONS,CHECKS,createSermon,createCard,normalize,merge,safeResearch,safePulpit,researchText,pulpitText,isPrivate} from './src/domain';
import {loadDossiers,storeDossiers,previousDossiers} from './src/storage';
import {getNoteLocation,getSelectionCapture} from './src/sdk';
import {subscribeEntryEvent} from './src/entryEvents';
import {mentorForStage} from './src/mentor';

const C={ink:'#202321',dim:'#5b615e',line:'#ced2cb',white:'#ffffff',shade:'#eef0ec'};
const emptyCard=()=>({kind:'Observation',body:'',verse:'',source:'',page:'',location:'',status:'To verify',disposition:'Study',private:false});
function Btn({children,onPress,active=false,disabled=false}){return <Pressable onPress={onPress} disabled={disabled} style={[styles.btn,active&&styles.btnActive,disabled&&{opacity:.4}]}><Text style={[styles.btnText,active&&{color:'white'}]}>{children}</Text></Pressable>;}
function Block({title,children}){return <View style={styles.block}><Text style={styles.sectionTitle}>{title}</Text>{children}</View>;}
function Field({name,value,set,multi=false,placeholder=''}){return <View style={{marginBottom:12}}><Text style={styles.label}>{name}</Text><TextInput value={String(value??'')} onChangeText={set} placeholder={placeholder} multiline={multi} textAlignVertical="top" placeholderTextColor="#898d88" style={[styles.input,multi&&{minHeight:108}]} /></View>}
function TagRow({items,current,choose}){return <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginVertical:6}} contentContainerStyle={{gap:6,paddingBottom:5}}>{items.map(x=><Btn key={x} active={current===x} onPress={()=>choose(x)}>{x}</Btn>)}</ScrollView>;}
const iso=()=>new Date().toISOString();
export default function App(){
  const [db,setDb]=useState({version:3,sermons:[]});
  const [loaded,setLoaded]=useState(false),[busy,setBusy]=useState(false),[error,setError]=useState('');
  const writing=useRef(false);
  const captureLock=useRef(false);
  const resourceRef=useRef(null);
  const [storageOK,setStorageOK]=useState(true);
  const [selectedId,setSelectedId]=useState(''),[screen,setScreen]=useState('home');
  const [search,setSearch]=useState(''),[resourceSearch,setResourceSearch]=useState(''),[showPrivate,setShowPrivate]=useState(false);
  const [newS,setNewS]=useState({title:'',passage:'',series:'',date:''});
  const [draft,setDraft]=useState(emptyCard()),[editId,setEditId]=useState('');
  const [capturing,setCapturing]=useState(false),[captureStatus,setCaptureStatus]=useState('');
  const [resumeCardAfterNew,setResumeCardAfterNew]=useState(false);
  const [idea,setIdea]=useState({idea:'',purpose:''});
  const [importText,setImportText]=useState('');
  const [lastSaveMessage,setLastSaveMessage]=useState('');
  const current=db.sermons.find(s=>s.id===selectedId);
  useEffect(()=>{resourceRef.current={draft,editId};},[draft,editId]);
  const dirtyCard=screen==='card'&&(!!editId||['body','verse','source','page','location'].some(k=>String(draft[k]||'').trim()));
  const dirtyIdea=screen==='idea'&&current&&(idea.idea!==current.idea||idea.purpose!==current.purpose);
  function navigate(next){if(busy||capturing){Alert.alert('Please finish the current operation','The Expositor is still saving or reading the selection.');return;}if(dirtyCard||dirtyIdea){Alert.alert('Unsaved preparation','Your current changes are not saved.',[{text:'Keep editing',style:'cancel'},{text:'Discard changes',style:'destructive',onPress:()=>{setDraft(emptyCard());setEditId('');setCaptureStatus('');setScreen(next);}}]);return;}setScreen(next);}
  function closeToNote(){if(busy||capturing){Alert.alert('Save or finish capture before closing');return;}const close=()=>{Promise.resolve().then(()=>PluginManager.closePluginView()).catch(e=>Alert.alert('Could not close plugin',String(e)));};if(dirtyCard||dirtyIdea){Alert.alert('Unsaved preparation','Save this work before returning to handwriting.',[{text:'Keep editing',style:'cancel'},{text:'Discard and return',style:'destructive',onPress:close}]);}else close();}
  useEffect(()=>{
    let alive=true;
    (async()=>{try{const saved=await loadDossiers();if(alive){setDb(saved);setSelectedId(saved.sermons.find(s=>s.id===saved.activeSermonId)?.id||saved.sermons[0]?.id||'');if(saved.recoveredFromPrevious)setError('Recovered an earlier copy after a damaged save. Export a backup.');}}catch(e){if(alive){setStorageOK(false);setError('Storage failed: '+String(e));}}finally{if(alive)setLoaded(true);}})();
    const off=subscribeEntryEvent(event=>{
      if(event.id===81002||event.id===81003||event.id===81004){
        if(captureLock.current)return;
        const prior=resourceRef.current;
        if(prior&&(prior.editId||['body','verse','source','page','location'].some(k=>String(prior.draft?.[k]||'').trim()))){
          Alert.alert('Research not saved','Save or cancel the current card before capturing a different selection.');
          return;
        }
        captureLock.current=true;
        setDraft(emptyCard());setEditId('');setScreen('card');setCapturing(true);setCaptureStatus('Reading selected handwriting on this device…');
        getSelectionCapture({recognize:true,context:event.id===81003?'doc':'note'}).then(v=>{if(!alive)return;const loc=[v.path,v.page?'page '+v.page:'',v.selection].filter(Boolean).join(' | ');setDraft(d=>({...d,location:loc,body:v.body||d.body,status:'To verify'}));setCaptureStatus(v.recognized?'Handwriting/text recognized. Check every word against the original before saving.':(v.warning||'Source location captured; add a brief note if needed.'));}).catch(e=>{if(alive)setCaptureStatus('Automatic capture unavailable: '+String(e));}).finally(()=>{captureLock.current=false;if(alive)setCapturing(false);});
      }
    });return ()=>{alive=false;off();};
  },[]);
  async function save(next){
    if(!storageOK){Alert.alert('Storage unavailable','Data could not be loaded. Do not overwrite this database.');return false;}
    if(writing.current){Alert.alert('Saving','An earlier change is still being saved.');return false;}
    writing.current=true;setBusy(true);
    try{const safe=normalize(next);await storeDossiers(safe);setDb(safe);setError('');setLastSaveMessage('Saved locally');return true;}
    catch(e){setLastSaveMessage('Save failed');setError('Save FAILED: '+String(e));Alert.alert('Save failed','Do not trust this change. Export or recover your existing records.');return false;}
    finally{writing.current=false;setBusy(false);}
  }
  function patchS(patch){
    if(!current)return;
    return save({...db,activeSermonId:selectedId,sermons:db.sermons.map(s=>s.id===selectedId?{...s,...patch,updatedAt:iso()}:s)});
  }
  async function addS(){
    try{const s=createSermon(newS);if(await save({...db,activeSermonId:s.id,sermons:[s,...db.sermons]})){setSelectedId(s.id);setNewS({title:'',passage:'',series:'',date:''});setScreen(resumeCardAfterNew?'card':'sermon');setResumeCardAfterNew(false);}}
    catch(e){Alert.alert('Complete your dossier',String(e));}
  }
  async function addCard(){
    if(!current){Alert.alert('Create a sermon before capturing resources.');return;}
    try{
      const card=createCard(draft);
      const next={...db,sermons:db.sermons.map(s=>s.id!==selectedId?s:{...s,updatedAt:iso(),cards:editId?s.cards.map(c=>c.id===editId?{...card,id:c.id,createdAt:c.createdAt}:c):[...s.cards,card]})};
      if(await save({...next,activeSermonId:selectedId})){setEditId('');setDraft(emptyCard());setScreen('sermon');}
    }catch(e){Alert.alert('Check the resource',String(e));}
  }
  async function capture(){
    if(captureLock.current)return;captureLock.current=true;setCapturing(true);setCaptureStatus('Reading your selected handwriting…');
    try{const x=await getSelectionCapture({recognize:true});const location=[x.path,x.page?'page '+x.page:'',x.selection].filter(Boolean).join(' | ');if(!location&&!x.body)throw Error('No current selection was available. Enter the reference manually.');setDraft(d=>({...d,location:location||d.location,body:x.body||d.body,status:'To verify'}));setCaptureStatus(x.recognized?'Review the on-device transcription carefully before saving.':(x.warning||'Source reference captured without transcription.'));}
    catch(e){setCaptureStatus('Could not read selection; type or paste the note manually.');Alert.alert('Capture unavailable',String(e));}
    finally{captureLock.current=false;setCapturing(false);}
  }
  function share(message){Share.share({message}).catch(e=>Alert.alert('Share unavailable',String(e)));}
  async function restore(){
    try{const incoming=JSON.parse(importText);if(await save(merge(db,incoming))){setImportText('');Alert.alert('Imported','Missing sermon IDs were merged; existing sermons retained.');}}
    catch(e){Alert.alert('Invalid backup',String(e));}
  }
  async function previous(){
    try{const old=await previousDossiers();if(await save(merge(db,old)))Alert.alert('Recovery complete','Older missing sermon IDs added. Existing sermon IDs retained.');}
    catch(e){Alert.alert('Recovery unavailable',String(e));}
  }
  function updateChecklist(i){
    if(!current)return;const set=new Set(current.checklist||[]);if(set.has(i))set.delete(i);else set.add(i);patchS({checklist:[...set]});
  }
  function editCard(c){setEditId(c.id);setDraft({...c});setCaptureStatus('');setScreen('card');}
  const title=(name)=> <View style={styles.header}><Text style={styles.brand}>THE EXPOSITOR</Text><Text style={styles.title}>{name}</Text><Text style={styles.sub}>The Word leads. The preacher studies. The sermon follows.</Text></View>;
  if(!loaded)return <View style={[styles.root,{justifyContent:'center',alignItems:'center'}]}><ActivityIndicator color={C.ink}/><Text>Opening your sermon library…</Text></View>;
  return <View style={styles.root}>
    <View style={styles.nav}><Btn onPress={()=>navigate('home')}>LIBRARY</Btn>{current?<Btn onPress={()=>navigate('sermon')}>DOSSIER</Btn>:null}<View style={{flex:1}}/><Btn onPress={closeToNote}>RETURN TO NOTE</Btn></View>
    <View style={styles.statusBar}><Text numberOfLines={1} style={styles.statusText}>{busy?'SAVING…':capturing?'READING INK…':lastSaveMessage||'LOCAL · NO NETWORK'}</Text><Btn onPress={()=>navigate('backup')}>BACKUP</Btn></View>
    {error?<Text style={styles.error}>{error}</Text>:null}
    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.main}>
    {screen==='home'&&<>
      {title('Sermon Library')}
      <View style={styles.row}><Btn active onPress={()=>{setResumeCardAfterNew(false);setScreen('new');}}>+ NEW SERMON</Btn></View>
      <Field name="FIND SERMON OR PUBLIC RESEARCH" value={search} set={setSearch} placeholder="Passage, theme, title, quotation…"/>
      {db.sermons.filter(s=>!search||[s.title,s.passage,s.series,s.idea,...safeResearch(s).flatMap(c=>[c.body,c.verse,c.source])].join(' ').toLowerCase().includes(search.toLowerCase())).map(s=><Pressable key={s.id} style={styles.resource} onPress={()=>{setSelectedId(s.id);setResourceSearch('');setShowPrivate(false);setScreen('sermon');save({...db,activeSermonId:s.id});}}><Text style={styles.itemTitle}>{s.title}</Text><Text style={styles.meta}>{s.passage} {s.series?' · '+s.series:''}</Text><Text style={styles.meta}>{s.archived?'ARCHIVED · ':''}{s.cards.length} research items · {STAGES.find(t=>t.key===s.stage)?.label||'TEXT'}</Text></Pressable>)}
      {db.sermons.length===0?<Text style={styles.hint}>Start with Scripture, not an outline. Create a dossier for your next passage, then attach research as you study.</Text>:null}
    </>}
    {screen==='new'&&<>{title('New Sermon Dossier')}<Field name="SERMON TITLE (WORKING)" value={newS.title} set={title=>setNewS({...newS,title})} placeholder="A working title, not necessarily the final sermon title"/><Field name="SCRIPTURE PASSAGE" value={newS.passage} set={passage=>setNewS({...newS,passage})} placeholder="Mark 2:13–22"/><Field name="SERIES" value={newS.series} set={series=>setNewS({...newS,series})}/><Field name="PREACHING DATE (OPTIONAL)" value={newS.date} set={date=>setNewS({...newS,date})}/><Btn active disabled={busy} onPress={addS}>CREATE DOSSIER</Btn></>}
    {screen==='sermon'&&current&&<>
      {title(current.title)}
      <Text style={styles.meta}>{current.passage}{current.series?' · '+current.series:''}</Text>
      <View style={styles.row}><Btn active onPress={()=>{setEditId('');setDraft(emptyCard());setScreen('card');}}>+ KEEP DISCOVERY</Btn><Btn onPress={()=>{setIdea({idea:current.idea||'',purpose:current.purpose||''});setScreen('idea');}}>CENTRAL IDEA</Btn><Btn onPress={()=>setScreen('mentor')}>STUDY WITH MENTORS</Btn></View>
      <Block title="STUDY THE PASSAGE">
        <TagRow items={STAGES.map(x=>x.label)} current={STAGES.find(x=>x.key===current.stage)?.label} choose={name=>patchS({stage:STAGES.find(x=>x.label===name).key})}/>
        <Text style={styles.question}>{STAGES.find(x=>x.key===current.stage)?.question}</Text>
        <Text style={styles.body}>{STAGES.find(x=>x.key===current.stage)?.prompt}</Text>
      </Block>
      <Block title="THE AUTHOR'S BURDEN">
        <Text style={styles.body}>{current.idea||'Exegetical idea not yet established. Continue studying before deciding.'}</Text>
        {current.purpose?<Text style={styles.meta}>Purpose: {current.purpose}</Text>:null}
      </Block>
      <Block title="RESEARCH & HANDWRITTEN SOURCE REFERENCES">
        <Text style={styles.meta}>{current.cards.length} total · {current.cards.filter(isPrivate).length} private · {safePulpit(current).length} selected for pulpit</Text>
        <Field name="SEARCH THIS DOSSIER" value={resourceSearch} set={setResourceSearch}/>
        {current.cards.filter(c=>(showPrivate||!isPrivate(c))&&[c.kind,c.body,c.verse,c.source,c.location].join(' ').toLowerCase().includes(resourceSearch.toLowerCase())).map(c=><View style={styles.resource} key={c.id}>
          <View style={styles.space}><Text style={styles.label}>{c.kind.toUpperCase()}</Text><Text style={styles.meta}>{isPrivate(c)?'PRIVATE':'STUDY'}</Text></View>
          <Text style={styles.body}>{c.body||'(source reference)'}</Text>
          {c.verse?<Text style={styles.meta}>SCRIPTURE · {c.verse}</Text>:null}
          {c.source?<Text style={styles.meta}>SOURCE · {c.source} {c.page||''}</Text>:null}
          {c.location?<Text style={styles.meta}>LOCATION · {c.location}</Text>:null}
          <Text style={styles.meta}>{c.status} · {c.disposition}</Text>
          <Btn onPress={()=>editCard(c)}>EDIT RESOURCE</Btn>
        </View>)}
        <Btn onPress={()=>setShowPrivate(p=>!p)}>{showPrivate?'HIDE PRIVATE JOURNAL':'SHOW PRIVATE JOURNAL'}</Btn>
      </Block>
      <Block title="TOWARD THE PULPIT">
        <View style={styles.row}><Btn onPress={()=>setScreen('review')}>FAITHFULNESS REVIEW</Btn><Btn onPress={()=>share(researchText(current))}>SHARE PUBLIC RESEARCH</Btn><Btn onPress={()=>share(pulpitText(current))}>SHARE PULPIT NOTES</Btn></View>
        <Text style={styles.hint}>The public and pulpit exports exclude private entries. Exact quotations need a verified source and page or document location before appearing in pulpit notes.</Text>
      </Block>
      <Btn onPress={()=>patchS({archived:!current.archived})}>{current.archived?'RESTORE TO ACTIVE':'ARCHIVE SERMON'}</Btn>
    </>}
    {screen==='select'&&<>{title('Choose Sermon Destination')}<Text style={styles.hint}>Selected ink has not been saved yet. Choose the dossier that should receive it; the handwriting itself stays in the original Note.</Text>{db.sermons.map(s=><Pressable key={s.id} style={styles.resource} onPress={()=>{setSelectedId(s.id);setScreen('card');save({...db,activeSermonId:s.id});}}><Text style={styles.itemTitle}>{s.title}</Text><Text style={styles.meta}>{s.passage}</Text></Pressable>)}<Btn onPress={()=>{setResumeCardAfterNew(true);setScreen('new');}}>NEW DOSSIER</Btn></>}
    {screen==='idea'&&current&&<>{title('Central Exegetical Idea')}<Text style={styles.hint}>Answer from the text, not from a favorite theme or commentary. Save explicitly.</Text>
      <Field name="WHAT THE BIBLICAL AUTHOR IS SAYING" multi value={idea.idea} set={x=>setIdea({...idea,idea:x})}/>
      <Field name="WHY THE AUTHOR SAYS IT / INTENDED RESPONSE" multi value={idea.purpose} set={x=>setIdea({...idea,purpose:x})}/>
      <Btn active disabled={busy} onPress={async()=>{if(await patchS(idea))setScreen('sermon');}}>SAVE CENTRAL IDEA</Btn>
    </>}
    {screen==='card'&&<>
      {title(editId?'Edit Resource':'Keep This Discovery')}
      {!current?<><Text style={styles.hint}>Create a sermon before attaching a note or source.</Text><Btn onPress={()=>{setResumeCardAfterNew(true);setScreen('new');}}>NEW SERMON</Btn></>:<>
        <Text style={styles.meta}>{current.title} · {current.passage}</Text>
        {!editId?<Btn onPress={()=>setScreen('select')}>CHANGE DESTINATION SERMON</Btn>:<Text style={styles.hint}>To keep an edited resource attached to its source sermon, save it here first. Create a new card to file research under a different sermon.</Text>}
        {capturing?<Text style={styles.hint}>Reading selected handwriting on your Manta…</Text>:null}
        {captureStatus?<Text style={styles.hint}>{captureStatus}</Text>:null}
        <TagRow items={KINDS} current={draft.kind} choose={kind=>setDraft({...draft,kind})}/>
        <Field name="OBSERVATION / SOURCE EXCERPT / JOURNAL" value={draft.body} multi set={body=>setDraft({...draft,body})}/>
        <Field name="VERSE OR CROSS-REFERENCE" value={draft.verse} set={verse=>setDraft({...draft,verse})}/>
        <Field name="AUTHOR / BOOK / DOCUMENT TITLE" value={draft.source} set={source=>setDraft({...draft,source})}/>
        <Field name="PAGE / SECTION" value={draft.page} set={page=>setDraft({...draft,page})}/>
        <Field name="SOURCE FILE OR IMAGE LOCATION" value={draft.location} set={location=>setDraft({...draft,location})}/>
        <Btn disabled={capturing} onPress={capture}>READ SELECTED INK & SOURCE PAGE</Btn>
        <Text style={styles.label}>VERIFICATION</Text><TagRow items={STATUS} current={draft.status} choose={status=>setDraft({...draft,status})}/>
        <Text style={styles.label}>RESOURCE DESTINATION</Text><TagRow items={DISPOSITIONS} current={draft.disposition} choose={disposition=>setDraft({...draft,disposition})}/>
        <Btn active={draft.private||isPrivate(draft)} onPress={()=>setDraft({...draft,private:!draft.private})}>PRIVATE / EXCLUDE FROM EXPORT: {draft.private||isPrivate(draft)?'YES':'NO'}</Btn>
        <Text style={styles.hint}>Prayer and private journal entries are always excluded from public exports. Local storage is not encrypted; avoid confidential counseling records.</Text>
        <View style={styles.row}><Btn active disabled={busy||capturing} onPress={addCard}>SAVE RESOURCE</Btn><Btn onPress={()=>navigate('sermon')}>CANCEL</Btn></View>
        {editId?<Btn onPress={()=>Alert.alert('Remove this resource card?','Your original Note/Document is never deleted.',[{text:'Cancel'},{text:'Remove',style:'destructive',onPress:async()=>{if(await patchS({cards:current.cards.filter(c=>c.id!==editId)})){setEditId('');setScreen('sermon');}}}])}>REMOVE RESOURCE CARD</Btn>:null}
      </>}
    </>}
    {screen==='mentor'&&current&&<>
      {title('Preaching Mentor Desk')}
      <Text style={styles.meta}>{current.title} · {current.passage}</Text>
      <Text style={styles.hint}>These are ORIGINAL study questions informed by the cited authors, not quotations from them. The biblical text remains the authority; the conclusions must be yours.</Text>
      <Block title="CHOOSE A PREPARATION STAGE">
        <TagRow items={STAGES.map(x=>x.label)} current={STAGES.find(x=>x.key===current.stage)?.label} choose={name=>patchS({stage:STAGES.find(x=>x.label===name).key})}/>
        <Text style={styles.question}>{STAGES.find(x=>x.key===current.stage)?.question}</Text>
      </Block>
      <Block title="SOURCE-INFORMED STUDY QUESTIONS">
      {mentorForStage(current.stage).map((m,i)=><View style={styles.resource} key={m.source+'-'+i}>
        <Text style={styles.label}>{m.source.toUpperCase()}</Text>
        <Text style={styles.meta}>{m.ref}</Text>
        <Text style={styles.question}>{m.question}</Text>
        <Text style={styles.body}>{m.help}</Text>
        <Btn onPress={()=>{setEditId('');setDraft({...emptyCard(),kind:m.kind,verse:current.passage,body:'Question to investigate: '+m.question+'\\n\\nMy study and evidence: '});setScreen('card');}}>INVESTIGATE & SAVE</Btn>
      </View>)}
      </Block>
      <Text style={styles.hint}>Your notes become ordinary dossier cards with verse references. No outside author's words are auto-inserted as exact quotations.</Text>
      <Btn onPress={()=>setScreen('sermon')}>RETURN TO DOSSIER</Btn>
    </>}
    {screen==='review'&&current&&<>{title('Faithfulness Review')}<Text style={styles.hint}>A preparation check, not a measure of spiritual power or the Spirit's work.</Text>
      <Text style={styles.meta}>{current.checklist.length} / {CHECKS.length} considered</Text>
      {CHECKS.map((x,i)=><Pressable key={i} style={styles.check} disabled={busy} onPress={()=>updateChecklist(i)}><Text style={styles.checkBox}>{current.checklist.includes(i)?'☑':'□'}</Text><Text style={[styles.body,{flex:1}]}>{x}</Text></Pressable>)}
      <Btn onPress={()=>setScreen('sermon')}>BACK TO DOSSIER</Btn>
    </>}
    {screen==='backup'&&<>{title('Backup & Recovery')}<Text style={styles.hint}>FULL BACKUP CONTAINS PRIVATE JOURNAL ENTRIES. Send it only to a destination you control. It is not encrypted.</Text>
      <Btn active onPress={()=>share(JSON.stringify(db,null,2))}>SHARE COMPLETE JSON BACKUP</Btn>
      <Block title="RESTORE AND MERGE">
        <Field name="PASTE EXPORTED JSON" value={importText} set={setImportText} multi/>
        <Btn disabled={busy} onPress={restore}>IMPORT WITHOUT OVERWRITING EXISTING SERMONS</Btn>
      </Block>
      <Block title="PREVIOUS SAVE">
        <Btn disabled={busy} onPress={previous}>RECOVER MISSING SERMONS FROM EARLIER COPY</Btn>
        <Text style={styles.hint}>Merge keeps the currently saved version of any sermon ID. It does not replace current entries.</Text>
      </Block>
    </>}
    </ScrollView>
  </View>;
}
const styles=StyleSheet.create({
  root:{flex:1,backgroundColor:C.white},nav:{minHeight:54,borderBottomWidth:1,borderColor:C.line,flexDirection:'row',alignItems:'center',paddingHorizontal:9,gap:5},
  statusBar:{minHeight:43,borderBottomWidth:1,borderColor:C.line,flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:12},
  statusText:{fontSize:11,color:C.dim,flexShrink:1},
  navRight:{fontSize:10,color:C.dim,marginLeft:'auto'},main:{padding:15,paddingBottom:65},
  header:{borderBottomWidth:1,borderColor:C.line,paddingBottom:14,marginBottom:18},
  brand:{fontSize:11,letterSpacing:1.8,fontWeight:'700',color:C.dim},title:{fontSize:26,fontWeight:'700',color:C.ink,marginTop:6},
  sub:{fontSize:12,color:C.dim,marginTop:5},row:{flexDirection:'row',flexWrap:'wrap',gap:8,marginVertical:8,alignItems:'center'},
  space:{flexDirection:'row',justifyContent:'space-between',gap:12},btn:{borderColor:C.ink,borderWidth:1,borderRadius:5,paddingHorizontal:10,paddingVertical:12,minHeight:44,justifyContent:'center',alignSelf:'flex-start',marginVertical:3},
  btnActive:{backgroundColor:C.ink},btnText:{color:C.ink,fontSize:12,fontWeight:'700'},label:{fontSize:10,letterSpacing:.6,fontWeight:'700',color:C.dim,marginBottom:5},
  input:{borderWidth:1,borderColor:C.line,borderRadius:3,padding:10,fontSize:16,color:C.ink,backgroundColor:C.white},
  block:{borderTopWidth:1,borderColor:C.line,paddingTop:12,marginTop:18,marginBottom:8},
  sectionTitle:{fontSize:13,fontWeight:'800',letterSpacing:1,color:C.ink,marginBottom:12},
  resource:{padding:12,borderBottomWidth:1,borderColor:C.line,backgroundColor:C.shade,marginVertical:5},
  itemTitle:{fontWeight:'700',fontSize:17,color:C.ink,marginBottom:5},body:{fontSize:16,lineHeight:23,color:C.ink,marginVertical:5},
  question:{fontSize:19,fontWeight:'700',color:C.ink,marginBottom:6},meta:{fontSize:12,color:C.dim,marginVertical:3},
  hint:{fontSize:14,color:C.dim,lineHeight:21,marginVertical:10},error:{padding:8,color:'#7a0000',fontSize:12},
  check:{paddingVertical:13,borderBottomWidth:1,borderColor:C.line,flexDirection:'row',gap:10},checkBox:{fontSize:22,color:C.ink}
});

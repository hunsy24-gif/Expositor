import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {PluginManager} from 'sn-plugin-lib';
import {pushEntryEvent} from './src/entryEvents';
AppRegistry.registerComponent(appName,()=>App);
const name=x=>JSON.stringify({en_US:x,en:x});
/**
 * Plugin toolbar icons must use the installed plugin directory URI.
 * React Native asset:// URIs may not resolve in Supernote's native toolbar.
 * Failed registration is logged; never pretend a hidden button succeeded.
 */
(async()=>{
  await PluginManager.init();
  PluginManager.registerButtonListener({onButtonPress:pushEntryEvent});
  let icon='';
  try{
    const dir=await PluginManager.getPluginDirPath();
    if(dir)icon='file://'+String(dir).replace(/\/$/,'')+'/icon.png';
  }catch(e){console.warn('Expositor toolbar icon path unavailable',String(e));}
  const buttons=[
    [1,['NOTE','DOC'],{id:81001,name:name('The Expositor'),icon,showType:1,enable:true}],
    [2,['NOTE'],{id:81002,name:name('Keep in Sermon'),icon,showType:1,enable:true,editDataTypes:[0]}],
    [3,['DOC'],{id:81003,name:name('Keep in Sermon'),icon,showType:1,enable:true}],
  ];
  for(const [type,apps,config] of buttons){
    try{
      const result=await PluginManager.registerButton(type,apps,config);
      if(result===false)console.warn('Expositor button declined',config.id);
    }catch(e){console.error('Expositor button failed registration '+config.id,String(e));}
  }
})().catch(e=>console.error('The Expositor could not initialize native toolbar',String(e)));

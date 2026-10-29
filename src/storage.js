import AsyncStorage from '@react-native-async-storage/async-storage';
import {normalize} from './domain';
const MAIN='the-expositor:dossiers:v2', PREVIOUS='the-expositor:dossiers:previous', LEGACY='the-expositor:dossiers:v1';
export async function loadDossiers(){const raw=await AsyncStorage.getItem(MAIN);if(raw!==null){try{return normalize(JSON.parse(raw));}catch(e){const old=await AsyncStorage.getItem(PREVIOUS);if(old===null)throw e;const state=normalize(JSON.parse(old));return {...state,recoveredFromPrevious:true};}}const legacy=await AsyncStorage.getItem(LEGACY);return legacy===null?normalize({version:3,sermons:[]}):normalize(JSON.parse(legacy));}
export async function storeDossiers(data){const raw=JSON.stringify(normalize(data));const old=await AsyncStorage.getItem(MAIN);if(old!==null)await AsyncStorage.setItem(PREVIOUS,old);await AsyncStorage.setItem(MAIN,raw);if(await AsyncStorage.getItem(MAIN)!==raw)throw Error('Local data failed read-back verification.');}
export async function previousDossiers(){const old=await AsyncStorage.getItem(PREVIOUS);if(old===null)throw Error('No previous save found.');return normalize(JSON.parse(old));}

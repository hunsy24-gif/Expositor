import AsyncStorage from '@react-native-async-storage/async-storage';
import {dossierStore} from './storage-core';
const repo=dossierStore(AsyncStorage);
export const loadDossiers=()=>repo.load();
export const storeDossiers=data=>repo.store(data);
export const previousDossiers=()=>repo.previous();

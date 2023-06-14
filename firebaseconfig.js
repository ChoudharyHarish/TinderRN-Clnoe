import { initializeApp } from "firebase/app";
import firebase from 'firebase/compat/app';
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
import { initializeAuth } from "firebase/auth";
import {getReactNativePersistence} from 'firebase/auth/react-native';

import 'firebase/compat/firestore';
import 'firebase/compat/functions';

import config from "./config";



// Initialize Firebase
const firebaseConfig = {
  apiKey:config.apiKey,
  authDomain: config.authDomain,
  databaseURL: config.databaseURL,
  projectId:config.projectId,
  storage_bucket: config.storage_bucket,
  messagingSenderId: config.messagingSenderId,
  appId:config.appId,
  measurementId: config.measurementId,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
export {auth,db};
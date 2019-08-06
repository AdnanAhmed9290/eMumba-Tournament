import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import FirebaseConfig from '../config/keys';
firebase.initializeApp(FirebaseConfig);

export const fireStoreRef = firebase.firestore();
export const authRef = firebase.auth();
export const provider = new firebase.auth.GoogleAuthProvider();

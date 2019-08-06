import { authRef, provider, fireStoreRef } from '../config/firebase';
import { FETCH_USER } from './types';
import * as R from 'ramda';

export const fetchUser = () => dispatch => {
  authRef.onAuthStateChanged(user => {
    if (user) {
      fireStoreRef.doc(`users/${user.uid}`).onSnapshot(snapShot => {
        dispatch({
          type: FETCH_USER,
          payload: snapShot.data()
        });
      });
    } else {
      dispatch({
        type: FETCH_USER,
        payload: null
      });
    }
  });
};

export const signIn = () => dispatch => {
  authRef
    .signInWithPopup(provider)
    .then(result => {
      updateUser(result.user);
    })
    .catch(error => {
      console.log(error);
    });
};

const updateUser = user => {
  fireStoreRef
    .collection(`users`)
    .doc(`${user.uid}`)
    .set(
      {
        uid: user.uid,
        photoURL: user.photoURL,
        email: user.email,
        displayName: user.displayName,
        role: 'sub'
      },
      { merge: true }
    );
};

export const signOut = () => dispatch => {
  authRef
    .signOut()
    .then(() => {
      // Sign-out successful.
    })
    .catch(error => {
      console.log(error);
    });
};

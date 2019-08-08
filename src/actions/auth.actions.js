import { authRef, provider, fireStoreRef } from '../config/firebase';
import { FETCH_USER, SET_ADMIN } from './types';
import * as R from 'ramda';

export const fetchUser = () => dispatch => {
  authRef.onAuthStateChanged(user => {
    if (user) {
      fireStoreRef.doc(`users/${user.uid}`).onSnapshot(snapShot => {
        const user = snapShot.data();
        dispatch({
          type: FETCH_USER,
          payload: user
        });
        if (R.equals('admin', R.propOr('', 'role', user))) {
          dispatch({
            type: SET_ADMIN,
            payload: true
          });
        }
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
        displayName: user.displayName
      },
      { merge: true }
    );
};

export const signOut = () => dispatch => {
  authRef
    .signOut()
    .then(() => {
      dispatch({
        type: SET_ADMIN,
        payload: false
      });
      dispatch({
        type: FETCH_USER,
        payload: null
      });
    })
    .catch(error => {
      console.log(error);
    });
};

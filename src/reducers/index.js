import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { SET_ADMIN, SET_TOAST } from '../actions/types';

import auth from './auth.reducer';
import teams from './teams.reducer';
import matches from './matches.reducer';

const isAdmin = (state = false, action) => {
  switch (action.type) {
    case SET_ADMIN:
      return action.payload || false;
    default:
      return state;
  }
};

const initialState = {
  message: '',
  type: 'error'
};

const alert = (state = initialState, action) => {
  switch (action.type) {
    case SET_TOAST:
      return action.payload;
    default:
      return state;
  }
};

export default combineReducers({
  auth,
  teams,
  matches,
  isAdmin,
  alert,
  form: formReducer
});

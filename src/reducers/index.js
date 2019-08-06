import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import auth from './auth.reducer';
import teams from './teams.reducer';
import matches from './matches.reducer';

export default combineReducers({
  auth,
  teams,
  matches,
  form: formReducer
});

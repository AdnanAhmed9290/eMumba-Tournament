import { FETCH_TEAMS, FETCH_TEAMS_LOADING } from '../actions/types';

const initialState = {
  isLoading: false,
  list: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_TEAMS:
      return {
        ...state,
        list: action.payload
      };

    case FETCH_TEAMS_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };

    default:
      return state;
  }
};

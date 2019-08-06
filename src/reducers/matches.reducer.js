import { FETCH_MATCHES, FETCH_TEAMS_LOADING, FETCH_MATCH } from '../actions/types';

const initialState = {
  isLoading: false,
  list: [],
  selectedMatch: {}
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_MATCHES:
      return {
        ...state,
        list: action.payload
      };

    case FETCH_MATCH:
      return {
        ...state,
        selectedMatch: action.payload
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

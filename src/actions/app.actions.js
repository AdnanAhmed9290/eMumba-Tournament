import { SET_TOAST } from './types';

export const setToast = (message = '', type = 'error') => {
  return dispatch => {
    dispatch({
      type: SET_TOAST,
      payload: {
        message,
        type
      }
    });
  };
};

export const resetToast = () => {
  return dispatch => {
    dispatch({
      type: SET_TOAST,
      payload: {
        message: '',
        type: 'error'
      }
    });
  };
};

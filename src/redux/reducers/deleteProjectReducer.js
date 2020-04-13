import { DELETE_PROJECT_SUCCESS, DELETE_PROJECT_FAIL, START_DELETING_PROJECT } from '../actions/actionTypes';

const initialState = {
  project: null,
  isDeleted: false,
  isDeleting: false,
  message: '',
  isFailed: false,
};

const deleteProjectReducer = (state = initialState, action) => {
  switch (action.type) {
  case START_DELETING_PROJECT:
    return {
      ...state,
      isDeleting: true,
      isDeleted: false,
      isFailed: false,
    };

  case DELETE_PROJECT_SUCCESS:
    return {
      ...state,
      project: action.payload,
      isDeleting: false,
      isDeleted: true,
      isFailed: false,
      message: 'Project has been Deleted.'
    };

  case DELETE_PROJECT_FAIL:
    return {
      ...state,
      message: action.payload,
      isDeleting: false,
      isDeleted: false,
      isFailed: true,
    };

  default:
    return state;
  }
};

export default deleteProjectReducer;

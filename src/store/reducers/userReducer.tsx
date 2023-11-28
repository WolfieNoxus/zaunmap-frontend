import { UserAction, UserData } from '../actions/userActions';
import { SET_USER } from '../actions/actionTypes';
interface UserState {
  userData: UserData | null;
}

const initialState: UserState = {
  userData: null,
};

const userReducer = (state = initialState, action: UserAction) => {
  switch (action.type) {
    case SET_USER:
      return { ...state, userData: action.payload };
    default:
      return state;
  }
};

export default userReducer;
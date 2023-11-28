import { combineReducers } from 'redux';
import userReducer from './userReducer';

const rootReducer = combineReducers({
  user: userReducer,
  // other reducers go here
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
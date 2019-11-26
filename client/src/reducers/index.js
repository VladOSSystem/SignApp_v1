  
import { combineReducers } from 'redux';
import postReducer from './propReducer';

export default combineReducers({
  posts: postReducer
});
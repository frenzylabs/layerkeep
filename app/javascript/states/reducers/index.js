import { combineReducers } from 'redux'
import appReducer from './app'
import {ProjectReducer} from '../project';
// import visibilityFilter from './visibilityFilter'

export default combineReducers({
  project: ProjectReducer,
  app: appReducer
})
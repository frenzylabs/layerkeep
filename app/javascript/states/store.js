/*
 *  store.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 05/02/19
 *  Copyright 2018 WessCope
 */

import {createStore, combineReducers} from 'redux';
import Reducer                        from './reducers';

const store = createStore(
  combineReducers({
    ...Reducer,
  })
);
  
export default store;

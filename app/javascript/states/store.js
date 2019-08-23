/*
 *  store.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 05/02/19
 *  Copyright 2018 WessCope
 */

import {createStore, applyMiddleware, combineReducers} from 'redux';
import thunkMiddleware from 'redux-thunk'
import Reducers                        from './reducers/index';

const store = createStore(
  Reducers,
  applyMiddleware(
    thunkMiddleware
  )
)

export default store;

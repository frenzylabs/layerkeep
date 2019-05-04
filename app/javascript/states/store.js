/*
 *  store.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 05/02/19
 *  Copyright 2018 WessCope
 */

import {createStore}  from 'redux';
import Reducer        from './reducers';
import {AppState}     from './app';

const store   = createStore(Reducer);
// window.store  = store;

export default store;

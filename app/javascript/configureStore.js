/*
 *  configureStore.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 04/23/19
 *  Copyright 2018 WessCope
 */

 import {createStore} from 'redux';

 const initialState = {
  profiles: []
 };

 function rootReducer(state, action) {
   console.log("Action: " + action.type);

   switch(action.type) {
     default:
      return state;
   }
 }

 export default function configureStore() {
   const store = createStore(rootReducer, initialState);

   return store;
 }

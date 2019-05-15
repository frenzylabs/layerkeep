/*
 *  slice_handler.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 04/30/19
 *  Copyright 2018 WessCope
 */


import Request from './request_client';

function path(endpoint) {
  return '/' + currentUser.username + '/slices/' + (endpoint || '');
}

export default {
  list: (params = {}) => {
    return Request.get(path(), params);
  },

  show: (sliceID, params = {}) => {
    return Request.get(path(sliceID), params);
  },

  slice: (projects, profiles) => {
    var params = {'projects' : projects, 'profiles': profiles};
    return Request.post(path(), params);
  },
}

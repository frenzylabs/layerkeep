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

function user_path(username, endpoint) {
  return `/${(username || currentUser.endpoint)}/slices/${endpoint || ''}`
}

export default {
  list: (username, params = {}) => {
    return Request.get(user_path(username), params);
  },

  show: (username, sliceID, params = {}) => {
    return Request.get(user_path(username, sliceID), params);
  },

  slice: (projects, profiles) => {
    var params = {'projects' : projects, 'profiles': profiles};
    return Request.post(path(), params);
  },
}

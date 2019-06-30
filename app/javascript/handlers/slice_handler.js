/*
 *  slice_handler.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 04/30/19
 *  Copyright 2018 WessCope
 */


import {Request, CancelToken} from './request_client';

function path(endpoint) {
  return '/' + currentUser.username + '/slices/' + (endpoint || '');
}

function user_path(username, endpoint) {
  return `/${(username || currentUser.endpoint)}/slices/${endpoint || ''}`
}

export default {
  cancelSource: () => {
    return CancelToken.source();
  },
  list: (username, params = {}) => {
    return Request.get(user_path(username), params);
  },

  show: (username, sliceID, params = {}) => {
    return Request.get(user_path(username, sliceID), params);
  },

  slice: (engine_id, projects, profiles) => {
    var params = {'engine_id': engine_id, 'projects' : projects, 'profiles': profiles};
    return Request.post(path(), params);
  },
}

/*
 *  slice_handler.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 04/30/19
 *  Copyright 2018 WessCope
 */


import {Request, CancelToken} from './request_client';

const QS = require('qs');

function path(endpoint) {
  return '/' + currentUser.username + '/slices/' + (endpoint || '');
}

function userPath(username, endpoint) {
  return `/api/${(username || currentUser.endpoint)}/slices/${endpoint || ''}`
}

export default {
  cancelSource: () => {
    return CancelToken.source();
  },
  list: (username, opts = {}) => {
    var qs = opts["qs"]
    delete opts["qs"]
    var path = userPath(username) + QS.stringify(qs, { addQueryPrefix: true })
    return Request.get(path, opts);
  },

  get: (user, printId, opts = {}) => {
    return Request.get(userPath(user, printId), opts);
  },

  show: (username, sliceID, params = {}) => {
    return Request.get(userPath(username, sliceID), params);
  },

  update: (user, sliceID, sliceAttrs, opts = {}) => {
    var params = {'slice' : sliceAttrs};
    return Request.patch(userPath(user, sliceID), params, opts);
  },

  create: (user, sliceAttrs, opts = {}) => {
    var params = {'slice' : sliceAttrs};
    return Request.post(userPath(user), params, opts);
  },

  delete: (user, sliceID, opts = {}) => {
    return Request.delete(userPath(user, sliceID), opts);
  },

  slice: (user, engine_id, projects, profiles) => {
    var params = {'engine_id': engine_id, 'projects' : projects, 'profiles': profiles};
    return Request.post(userPath(user, "generate"), params);
  },
}

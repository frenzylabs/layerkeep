/*
 *  slice_handler.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 04/30/19
 *  Copyright 2018 WessCope
 */


import {Request, CancelToken} from './request_client';

const QS = require('qs');


function userPath(username, endpoint) {
  return `/api/${(username || currentUser.username)}/prints/${endpoint || ''}`
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
    // return Request.get(userPath(username), opts);
  },

  get: (user, printId, opts = {}) => {
    return Request.get(userPath(user, printId), opts);
  },

  show: (username, printID, params = {}) => {
    return Request.get(userPath(username, printID), params);
  },

  update: (user, printID, printAttrs, opts = {}) => {
    var params = {'print' : printAttrs};
    return Request.patch(userPath(user, printID), params, opts);
  },

  create: (user, printAttrs, opts = {}) => {
    var params = {'print' : printAttrs};
    return Request.post(userPath(user), params, opts);
  },

  delete: (user, printID, opts = {}) => {
    return Request.delete(userPath(user, printID), opts);
  },

  deleteAsset: (user, printID, assetID, opts = {}) => {
    return Request.delete(userPath(user, printID) + "/assets/" + assetID, opts);
  }
}

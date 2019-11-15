/*
 *  slice_handler.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 04/30/19
 *  Copyright 2018 WessCope
 */


import {Request, CancelToken} from './request_client';

function path(endpoint) {
  return '/' + currentUser.username + '/prints/' + (endpoint || '');
}

function userPath(username, endpoint) {
  return `/${(username || currentUser.username)}/prints/${endpoint || ''}`
}

function ownerPath(username, owner, ownerID, endpoint) {
  return `/${(username || currentUser.username)}/${owner}/${ownerID}/assets/${endpoint || ''}`
}

export default {
  cancelSource: () => {
    return CancelToken.source();
  },
  list: (username, owner, ownerID, params = {}) => {
    return Request.get(ownerPath(username, owner, ownerID), params);
  },

  get: (username, owner, ownerID, assetID, opts = {}) => {
    return Request.get(ownerPath(username, owner, ownerID, assetID), opts);
  },

  // show: (username, printID, params = {}) => {
  //   return Request.get(userPath(username, printID), params);
  // },

  // update: (user, printID, printAttrs, opts = {}) => {
  //   var params = {'print' : printAttrs};
  //   return Request.patch(userPath(user, printID), params, opts);
  // },

  // create: (user, printAttrs, opts = {}) => {
  //   var params = {'print' : printAttrs};
  //   return Request.post(userPath(user), params, opts);
  // },

  delete: (username, owner, ownerID, assetID, opts = {}) => {
    return Request.delete(ownerPath(username, owner, ownerID, assetID), opts);
  },

  raw: (url, opts = {}) => {
    return Request.get(url, opts)
  }
  // deleteAsset: (user, printID, assetID, opts = {}) => {
  //   return Request.delete(userPath(user, printID) + "/assets/" + assetID, opts);
  // }
}

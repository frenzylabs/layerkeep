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
  return `/${(username || currentUser.endpoint)}/printers/${endpoint || ''}`
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

  get: (user, printerID, opts = {}) => {
    return Request.get(userPath(user, printerID), opts);
  },

  show: (username, printerID, params = {}) => {
    return Request.get(userPath(username, printerID), params);
  },

  update: (user, printerID, printAttrs, opts = {}) => {
    var params = {'printer' : printAttrs};
    return Request.patch(userPath(user, printerID), params, opts);
  },

  create: (user, printerAttrs, opts = {}) => {
    var params = {'printer' : printerAttrs};
    return Request.post(userPath(user), params, opts);
  },

  delete: (user, printerID, opts = {}) => {
    return Request.delete(userPath(user, printerID), opts);
  },

  count: (user, opts= {}) => {
    return Request.get(userPath(user, "printer_count"), opts)
  }


  // deleteAsset: (user, printerID, assetID, opts = {}) => {
  //   return Request.delete(userPath(user, printerID) + "/assets/" + assetID, opts);
  // }
}

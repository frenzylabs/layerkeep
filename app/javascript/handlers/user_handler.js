/*
 *  user_handler.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 05/15/19
 *  Copyright 2018 WessCope
 */

import Request from './request_client';

function path(endpoint) {
  return `/user/${endpoint || ''}`;
}

export default {
  saveSettings: (params) => {
    return Request.post(path('settings'), {user: params});
  },

  authToken: () => {
    return Request.post('/oauth/access_tokens'); 
  }
}

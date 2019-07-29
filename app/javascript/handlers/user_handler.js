/*
 *  user_handler.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 05/15/19
 *  Copyright 2018 WessCope
 */

import {Request, CancelToken} from './request_client';

function path(endpoint) {
  return `/user/${endpoint || ''}`;
}

export default {
  cancelSource: () => {
    return CancelToken.source();
  },

  saveSettings: (params) => {
    return Request.post(path('settings'), {user: params});
  },

  authToken: () => {
    return Request.post('/oauth/access_tokens'); 
  },

  raw: (url, opts = {}) => {
    return Request.get(url, opts);
  },

  createSubscription: (user, queryParams = {}) => {
    return Request.post(`/${user}/billing/subscriptions`, queryParams);
  },

  updateSubscriptionItem: (user, item, queryParams = {}) => {
    return Request.patch(`/${user}/billing/subscription_items/${item}`, queryParams);
  },

}

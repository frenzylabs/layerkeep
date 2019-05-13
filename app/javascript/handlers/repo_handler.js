/*
 *  projects_handler.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 04/30/19
 *  Copyright 2018 WessCope
 */


import Request from './request_client';

function path(kind, endpoint) {
  return `/${currentUser.username}/${kind}/${endpoint || ''}`;
}

export const RepoHandler = {
  list: () => {
    return Request.get(path());
  },

  commit: (kind, repo, files, message) => {
    var data = new FormData();

    files.forEach(file => {
      data.append(`files[]`, file);
    });

    data.append('message', message);

    return Request.post(path(kind, `${repo}/tree/master`), data, {headers: {'Content-Type' : 'multipart/form-data'}});
  },

  tree: (url, params = {}) => {
    return Request.get(url, params);
  }
}

/*
 *  projects_handler.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 04/30/19
 *  Copyright 2018 WessCope
 */


import {Request, CancelToken} from './request_client';

function repoPath(user, kind, endpoint) {
  return `/${user}/${kind}/${endpoint || ''}`;
}

export default {
  cancelSource: () => {
    return CancelToken.source();
  },
  
  list: (pathParams = {}, queryParams = {}) => {
    return Request.get(repoPath(pathParams.username, pathParams.kind), queryParams);
  },

  commit: (user, kind, repo, files, message) => {
    var data = new FormData();

    files.forEach(file => {
      data.append(`files[]`, file);
    });

    data.append('message', message);

    return Request.post(repoPath(user, kind, `${repo}/tree/master`), data, {headers: {'Content-Type' : 'multipart/form-data'}});
  },

  deleteFile: (pathParams = {}, file) => {
    var filepath = `${pathParams.name}/files/${pathParams.revisionPath}/${file}`
    var path = repoPath(pathParams.username, pathParams.kind, filepath)
    return Request.delete(path)
  },

  tree: (url, params = {}) => {
    return Request.get(url, params);
  }
}

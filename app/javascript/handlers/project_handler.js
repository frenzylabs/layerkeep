/*
 *  projects_handler.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 04/30/19
 *  Copyright 2018 WessCope
 */


import {Request, CancelToken} from './request_client';

function path(endpoint) {
  return `/${currentUser.username}/projects/${(endpoint || '')}`;
}
function user_project(user, endpoint) {
  return `/api/${user || currentUser.username}/projects/${(endpoint || '')}`;
}

export default {
  cancelSource: () => {
    return CancelToken.source();
  },
  list: (username, opts = {}) => {
    return Request.get(user_project(username), opts);
  },

  get: (username, name, opts = {}) => {
    return Request.get(user_project(username, name), opts);
  },

  create: (username, project, files = null) => {
    var params = {'repo' : project};


    if(files == null) {
      return Request.post(user_project(username), params);
    }

    var data = new FormData();

    files.forEach(file => {
      data.append(`files[${file.name}]`, file.file);
    });

    for ( var key in project ) {
      if (project[key]) {
        data.append(`repo[${key}]`, project[key]);
      }
    }

    return Request.post(user_project(username), data, {headers: {'Content-Type' : 'multipart/form-data'}});
  },

  commit: (project, files, message) => {
    var data = new FormData();

    files.forEach(file => {
      data.append(`files[]`, file);
    });

    data.append('message', message);

    return Request.post(path(`${project}/tree/master`), data, {headers: {'Content-Type' : 'multipart/form-data'}});
  },

  revisions: (name) => {
    return Request.get(path(name + '/revisions'));
  },

  revision: (name, revision) => {
    return Request.get(path(name + '/revisions/' + revision));
  },
 
  reference: (name, ref) => {
    return Request.get(path(name + '/revision/' + ref));
  },

  download: (name, revision) => {
    return Request.get(path(name + '/content/' + revision));
  },

  files: (name, revision, filepath) => {
    return Request.get(path(name + '/files/' + revision + '/' + filepath));
  },

  tree: (name, revision) => {
    return Request.get(path(name + '/tree/' + revision));
  },

  raw: (url, opts = {}) => {
    return Request.get("/api" + url, opts);
  }
}

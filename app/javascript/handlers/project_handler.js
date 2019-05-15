/*
 *  projects_handler.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 04/30/19
 *  Copyright 2018 WessCope
 */


import Request from './request_client';

function path(endpoint) {
  return `/${currentUser.username}/projects/${(endpoint || '')}`;
}
function user_project(user, endpoint) {
  return `/${user || currentUser.username}/projects/${(endpoint || '')}`;
}

export default {
  list: (user, query_params = {}) => {
    return Request.get(user_project(user), query_params);
  },

  get: (user, name) => {
    return Request.get(user_project(user, name));
  },

  create: (project, files = null) => {
    var params = {'repo' : project};

    if(files == null) {
      return Request.post(path(), params);
    }

    var data = new FormData();

    files.forEach(file => {
      data.append(`files[]`, file);
    });

    data.append('repo[name]', project.name);
    data.append('repo[description]', project.description);

    return Request.post(path(), data, {headers: {'Content-Type' : 'multipart/form-data'}});
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

  raw: (url) => {
    return Request.get(url);
  }
}

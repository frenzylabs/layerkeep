/*
 *  profile_handler.js
 *  LayerKeep
 * 
 *  Created by Kevin Musselman (kmussel@gmail.com) on 05/09/19
 *  Copyright 2018 FrenzyLabs
 */


import {Request, CancelToken} from './request_client';

function path(endpoint) {
  return `/${currentUser.username}/profiles/${(endpoint || '')}`;
}

function user_profile(username, endpoint) {
  return `/${username || currentUser.username}/profiles/${(endpoint || '')}`;
}

export default {
  cancelSource: () => {
    return CancelToken.source();
  },
  list: (username, opts = {}) => {
    return Request.get(user_profile(username), opts);
  },

  get: (username, name, opts = {}) => {
    return Request.get(user_profile(username, name), opts);
  },

  create: (username, profile, files = null) => {
    var params = {'repo' : profile};

    if(files == null) {
      return Request.post(user_profile(username), params);
    }

    var data = new FormData();

    files.forEach(file => {
      data.append(`files[${file.name}]`, file.file);
    });

    for ( var key in profile ) {
      if (profile[key]) {
        data.append(`repo[${key}]`, profile[key]);
      }
    }

    return Request.post(user_profile(username), data, {headers: {'Content-Type' : 'multipart/form-data'}});
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
  }
}

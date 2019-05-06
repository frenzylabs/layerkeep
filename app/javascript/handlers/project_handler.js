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

export const ProjectHandler = {
  list: (query_params = {}) => {
    return Request.get(path(), query_params);
  },

  get: (name) => {
    return Request.get(path(name));
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

  revisions: (name) => {
    return Request.get(projectsPath(name + '/revisions'));
  },

  revision: (name, revision) => {
    return Request.get(projectsPath(name + '/revisions/' + revision));
  },
 
  reference: (name, ref) => {
    return Request.get(projectsPath(name + '/revision/' + ref));
  },

  download: (name, revision) => {
    return Request.get(projectsPath(name + '/content/' + revision));
  },

  files: (name, revision, filepath) => {
    return Request.get(projectsPath(name + '/files/' + revision + '/' + filepath));
  },

  tree: (name, revision) => {
    return Request.get(projectsPath(name + '/tree/' + revision));
  }
}

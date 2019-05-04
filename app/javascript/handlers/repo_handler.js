/*
 *  projects_handler.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 04/30/19
 *  Copyright 2018 WessCope
 */


import Request from './request_client';

function path(endpoint) {
  return '/' + currentUser.username + '/projects/' + (endpoint || '');
}

export const RepoHandler = {
  list: () => {
    return Request.get(path());
  },

  get: (name) => {
    return Request.get(path(name));
  },

  create: (project) => {
    return Request.post(projectsPath(), project);
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

  tree: (url) => {
    return Request.get(url);
  }
}

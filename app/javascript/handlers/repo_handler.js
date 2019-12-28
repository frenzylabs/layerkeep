/*
 *  projects_handler.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 04/30/19
 *  Copyright 2018 WessCope
 */


import {Request, CancelToken} from './request_client';

function repoPath(user, kind, endpoint) {
  return `/api/${user}/${kind}/${endpoint || ''}`;
}

export default {
  cancelSource: () => {
    return CancelToken.source();
  },
  
  list: (pathParams = {}, queryParams = {}) => {
    return Request.get(repoPath(pathParams.username, pathParams.kind), queryParams);
  },

  commit: (url, files, message) => {
    var data = new FormData();

    // files.forEach(file => {
    //   data.append(`files[${file.name}]`, file.file);
    // });

    files.forEach(file => {
      data.append(`files[]`, file.path);
    });

    if (message) {
      data.append('message', message);
    }

    return Request.post(url, data, {headers: {'Content-Type' : 'multipart/form-data'}});
  },

  uploadTemp: (url, file, options = {}) => {
   
    options["headers"] = Object.assign({'Content-Type' : 'multipart/form-data'}, options["headers"] || {})
  
    var data = new FormData();
    data.append(`file[${file.name}]`, file.file);

    // files.forEach(file => {
    //   data.append(`files[${file.name}]`, file.file);
    // });

    return Request.post(url, data, options);
  },

  clearUploads: (url, files, options = {}) => {
   
    options["headers"] = Object.assign({'Content-Type' : 'multipart/form-data'}, options["headers"] || {})
  
    var data = new FormData();

    files.forEach(filepath => {
      data.append(`files[]`, filepath);
    });

    return Request.post(url, data, options);
  },

  deleteFile: (pathParams = {}, file) => {
    var filepath = `${pathParams.name}/files/${pathParams.revisionPath}/${file}`
    var path = repoPath(pathParams.username, pathParams.kind, filepath)
    return Request.delete(path)
  },

  tree: (url, params = {}) => {
    return Request.get("/api" + url, params);
  }
}

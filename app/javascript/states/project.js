/*
 *  project.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 05/02/19
 *  Copyright 2018 WessCope
 */

export function ProjectState(list = {data: [], meta: {}}, project = {}) {
  return {
    list: list,
    project: project
  }
}

export const ProjectAction = {
  list: (list = {data: [], meta: {}}) => {
    return {
      type: 'PROJECT_LIST',
      data: list
    }
  },

  view: (project = {}) => {
    return {
      type: 'PROJECT_VIEW',
      data: project
    }
  }
}

const initialState = ProjectState();

export function ProjectReducer(state = initialState, action) {
  switch(action.type) {
  case 'PROJECT_LIST':
    return {
      ...state, 
      list: action.data
    }
  case 'PROJECT_VIEW':
    return {
      ...state, 
      project: action.data
    }  
  default:
    return state;
  }
}

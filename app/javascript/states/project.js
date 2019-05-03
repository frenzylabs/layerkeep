/*
 *  project.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 05/02/19
 *  Copyright 2018 WessCope
 */

export function ProjectState(list = []) {
  return {
    list: list
  }
}

export const ProjectAction = {
  list: (list = []) => {
    return {
      type: 'PROJECT_LIST',
      data: list
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
  default:
    return state;
  }
}

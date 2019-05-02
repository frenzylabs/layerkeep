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
  list: {
    type: 'PROJECT_LIST',
    data: []
  }
}

const initialState = ProjectState();

export function ProjectReducer(state = initialState, action) {
  return state;
}

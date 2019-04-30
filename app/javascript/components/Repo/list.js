/*
 *  list.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 04/30/19
 *  Copyright 2018 WessCope
 */

import React from 'react';
import { RepoListItem } from './list_item';

export class RepoList extends React.Component {
  render() {
    return (
      <div>
        <RepoListItem />
        <RepoListItem />
        <RepoListItem />
        <RepoListItem />
        <RepoListItem />
      </div>
    )
  }
}

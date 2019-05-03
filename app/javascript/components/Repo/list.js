/*
 *  list.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 04/30/19
 *  Copyright 2018 WessCope
 */

import React               from 'react';
import { RepoListItem }   from './list_item';
import { RepoEmptyList }  from './empty_list';

export class RepoList extends React.Component {
  constructor(props) {
    super(props);

    this.items.bind(this);
  }
  empty() {
    return (
      <RepoEmptyList type="projects" />
    );
  }

  items() {
    return this.props.list.map((item) => {
      return (<RepoListItem />)
    });
  }
  render() {
    const component = this.props.list.count > 0 ? this.items() : this.empty();

    return (
      <div>
        {component}
      </div>
    );
  }
}

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

    window.rl = this;
    // this.empty = this.empty.bind(this);
    this.items = this.items.bind(this);
  }

  componentDidUpdate(prevProps) {
    console.log("1 PROPS DID CHANGE");
    console.log(prevProps);
    console.log(this.props);
  }
  
  shouldComponentUpdate(nextProps, nextState) {
      console.log("1 Should comp update");
      const differentList = this.props.list !== nextProps.list;
      return differentList;
  }

  empty() {
    return (
      <RepoEmptyList kind={this.props.match.params.kind} />
    );
  }

  items() {
    console.log(this.props.list.data.length);
    var params = this.props.match.params;
      return this.props.list.data.map((item) => {
        return (<RepoListItem path={`/${params.username}/${params.kind}/${item.attributes.name}`} item={item} key={item.id} />)
      });
  }
  
  render() {
    const component = this.props.list.data.length > 0 ? this.items() : this.empty();

    return (
      <div>
        {component}
      </div>
    );
  }
}

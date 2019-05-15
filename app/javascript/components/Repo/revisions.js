/*
 *  list.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 04/30/19
 *  Copyright 2018 WessCope
 */

import React                from 'react';
import { RevisionListItem } from './revision_item';
import { RepoEmptyList }    from './empty_list';
import { RepoHandler }      from '../../handlers';
import { Container }        from 'bloomer';

export class Revisions extends React.Component {
  constructor(props) {
    super(props);

    this.state = { revisions: {data: [], meta: {}}}
    this.items = this.items.bind(this);
    this.updateRepoRevisionsList()
  }

  updateRepoRevisionsList() {
    var url = this.props.match.url

    RepoHandler.tree(url)
    .then((response) => {
      this.updateRepoRevisions(response.data)
    })
    .catch((error) => {
      console.log(error);
    });
  }

  updateRepoRevisions(data) {
    this.setState({ revisions: data })
  }

  // componentDidUpdate(prevProps) {
  //   console.log(prevProps);
  //   console.log(this.props);
  // }
  
  shouldComponentUpdate(nextProps, nextState) {
      const differentList = this.state.revisions !== nextState.revisions;
      return differentList;
  }

  empty() {
    return (
      <RepoEmptyList kind={this.props.kind} />
    );
  }

  items() {
    console.log(this.state.revisions);
    return this.state.revisions.data.map((item) => {
      return (<RevisionListItem kind={this.props.kind} match={this.props.match} item={item} key={item.id} />)
    });
  }
  
  render() {
    const component = this.state.revisions.data.length > 0 ? this.items() : this.empty();

    return (
      <div className="section">
        <Container className="is-fluid">
          <h3> Revisions </h3>
          {component}
        </Container>
      </div>
    );
  }
}

export default Revisions;

/*
 *  list.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 04/30/19
 *  Copyright 2018 WessCope
 */

import React               from 'react';
import { Container, Breadcrumb, BreadcrumbItem }    from 'bloomer';
import { RepoEmptyList }  from './empty_list';
import { RepoHandler } from '../../handlers/repo_handler';
import { ReactGhLikeDiff } from 'react-gh-like-diff';

export class Revision extends React.Component {
  constructor(props) {
    super(props);

    this.state = { revision: {}}
    this.getRevision()
  }

  getRevision() {
    var url = this.props.match.url

    RepoHandler.tree(url)
    .then((response) => {
      this.updateRevision(response.data)
    })
    .catch((error) => {
      console.log(error);
    });
  }

  updateRevision(data) {
    this.setState({ revision: data })
  }

  // componentDidUpdate(prevProps) {
  //   console.log(prevProps);
  //   console.log(this.props);
  // }
  
  shouldComponentUpdate(nextProps, nextState) {
      const differentList = this.state.revision !== nextState.revision;
      return differentList;
  }

  empty() {
    return (
      <RepoEmptyList kind={this.props.kind} />
    );
  }

  diff() {
    console.log(this.state.revision);
    if (this.state.revision.message) {
      return (<ReactGhLikeDiff diffString={this.state.revision.message} />)
    }
  }
  
  render() {
    const component = this.state.revision.message ? this.diff() : this.empty();

    return (
      <div className="section">
        <Container className="is-fluid">
          <h3> Revision </h3>
          {this.diff()}
        </Container>
      </div>
    );
  }
}

export default Revision;
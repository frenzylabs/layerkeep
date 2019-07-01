/*
 *  list.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 04/30/19
 *  Copyright 2018 WessCope
 */

import React                from 'react';
import { RepoEmptyList }    from './empty_list';
import { RepoHandler }      from '../../handlers';
import { ReactGhLikeDiff }  from 'react-gh-like-diff';
import { Container }        from 'bloomer';

export class Revision extends React.Component {
  constructor(props) {
    super(props);

    this.state = { revision: {}}
    this.cancelRequest = RepoHandler.cancelSource();
    this.getRevision()
  }

  componentWillUnmount() {
    this.cancelRequest.cancel("Left Page");
  }

  getRevision() {
    var url = this.props.match.url

    RepoHandler.tree(url, {cancelToken: this.cancelRequest.token})
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

  shouldComponentUpdate(nextProps, nextState) {
      const differentList = this.state.revision !== nextState.revision;
      return differentList;
  }

  empty() {
    return (
      <RepoEmptyList kind={this.props.kind} params={this.props.match.params} />
    );
  }

  diff() {
    if (this.state.revision.message) {
      return (<ReactGhLikeDiff diffString={this.state.revision.message} />)
    }
  }
  
  render() {
    const component = this.state.revision.message ? this.diff() : this.empty();

    return (
      <div className="section" style={{padding: 0}}>
        <hr/>
        <br/>
        <Container className="is-fluid">
          <h3 className="subtitle"> Revision </h3>
          {this.diff()}
        </Container>
      </div>
    );
  }
}

export default Revision;

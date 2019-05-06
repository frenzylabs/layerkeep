/*
 *  list.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 04/30/19
 *  Copyright 2018 WessCope
 */

import React               from 'react';
import { Container, Breadcrumb, BreadcrumbItem }    from 'bloomer';
import { RevisionListItem }   from './revision_item';
import { RepoEmptyList }  from './empty_list';
import { RepoHandler } from '../../handlers/repo_handler';
import { ReactGhLikeDiff } from 'react-gh-like-diff';

export class Revision extends React.Component {
  constructor(props) {
    super(props);

    window.rl = this;
    this.state = { revision: {}}
    // this.empty = this.empty.bind(this);
    // this.items = this.items.bind(this);
    this.getRevision()
  }

  getRevision() {
    var url = this.props.match.url

    RepoHandler.tree(url)
    .then((response) => {
      console.log("GET REVISION: ",  response.data )
      this.updateRevision(response.data)
    })
    .catch((error) => {
      console.log(error);
    });
  }

  updateRevision(data) {
    console.log("UPDATE REVISION")
    this.setState({ revision: data })
  }

  componentDidUpdate(prevProps) {
    console.log("1 PROPS DID CHANGE");
    console.log(prevProps);
    console.log(this.props);
  }
  
  shouldComponentUpdate(nextProps, nextState) {
      console.log("1 Should comp update");
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
    // <ReactGhLikeDiff 
    //       options={{
    //         originalFileName: TITLE,
    //         updatedFileName: TITLE,
    //       }}
    //       past={this.state.past}
    //       current={this.state.current}
    //     />)
    }
    // return this.state.revisions.data.map((item) => {
    //   return (<RevisionListItem kind={this.props.kind} match={this.props.match} item={item} key={item.id} />)
    // });
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
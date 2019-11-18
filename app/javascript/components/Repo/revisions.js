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
import SpinnerModal       from '../Modal/spinner';

export class Revisions extends React.Component {
  constructor(props) {
    super(props);

    this.state = { 
      revisions: {data: [], meta: {}},
      isLoading: true,
      errors: null
    }
    this.items = this.items.bind(this);
    this.cancelRequest = RepoHandler.cancelSource();
    
  }

  componentDidMount() {
    this.updateRepoRevisionsList()
  }

  componentWillUnmount() {
    this.cancelRequest.cancel("Left Page");
  }

  updateRepoRevisionsList() {
    var url = this.props.match.url
    this.setState({isLoading: true})

    RepoHandler.tree(url, {cancelToken: this.cancelRequest.token})
    .then((response) => {
      this.updateRepoRevisions(response.data)
    })
    .catch((error) => {
      console.error(error);
      var errMessage = "There was an error fetching the revisions."
      if (err.response.data && err.response.data.error) {
        var error = err.response.data.error
        if (error.message) {
          errMessage = error.message
        } else {
          errMessage = JSON.stringify(error)
        }
      }

      this.setState({
        ...this.state,
        isLoading: false,
        errors: errMessage
      });
    });
  }

  updateRepoRevisions(data) {
    this.setState({ isLoading: false, revisions: data })
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
      <Box>
        <Media>
          <MediaLeft>
          </MediaLeft>

          <MediaContent>
            {"You have no Revisions."}
            <br/>
          </MediaContent>

          <MediaRight>
          </MediaRight>
        </Media>
      </Box>
    );
  }

  items() {
    return this.state.revisions.data.map((item) => {
      return (<RevisionListItem kind={this.props.kind} match={this.props.match} item={item} key={item.id} />)
    });
  }

  renderContent() {
    if (this.state.isLoading) {
      return (<SpinnerModal />)
    } else if (this.state.errors) {
      return (
        <article className="message is-danger">
          <div className="message-body">
            {this.state.errors}
          </div>
        </article>
      )
    } else {
      if (this.state.revisions.data.length > 0)
        return this.items() 
      else
       return this.empty()
    }
  }
  
  render() {
    return (
      <div className="section" style={{padding: 0}}>
        <hr/>
        <br/>
        <Container className="is-fluid">
          <h2 className="subtitle"> Revisions </h2>
          {this.renderContent()}
        </Container>
      </div>
    );
  }
}

export default Revisions;

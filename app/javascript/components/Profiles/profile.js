/*
 *  details.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 04/30/19
 *  Copyright 2018 WessCope
 */

import React                from 'react';
import { Link }             from 'react-router-dom';
import { RepoDetails }      from '../Repo/details';
import { ProfileHandler }   from '../../handlers';
import Modal                from '../Modal';
import { Revisions }        from '../Repo/revisions'
import { Revision }         from '../Repo/revision'
import { RepoFileViewer }   from '../Repo/repo_file_viewer'
import { RepoBreadCrumbs }  from '../Repo/breadcrumbs';

import {
  Error404,
  Error401
} from '../ErrorViews';

import { 
  Container, 
  Columns, 
  Column 
} from 'bloomer';


export class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state          = {
      isUploadActive: false, 
      repo:           {},
      hasError:       0,
      hasLoaded:      false
    };

    this.uploadAction     = this.uploadAction.bind(this);
    this.dismissAction    = this.dismissAction.bind(this);
    this.loadRepoDetails  = this.loadRepoDetails.bind(this);
    
    this.loadRepoDetails();
  }

  loadRepoDetails() {    
    ProfileHandler.get(this.props.match.params.name)
    .then((response) => {
      this.setState({
        ...this.state,
        repo:       response.data.data.attributes,
        hasLoaded:  true
      });
    })
    .catch((error) => {
      this.setState({
        ...this.state,
        hasError: error.response.status,
        hasLoaded: true
      })
    });
  }

  uploadAction() {
    this.setState({
      ...this.state,
      isUploadActive: true
    });
  }

  dismissAction() {
    this.setState({
      ...this.state,
      isUploadActive: false
    });
  }

  renderResource() {
    switch (this.props.match.params.resource) {
      case 'tree': {
        return RepoDetails;
      }
      case 'revision': {
        return Revision;
      }
      case 'revisions': {
        return Revisions;
      }
      case 'files': {
        return RepoFileViewer;
      }
      default: {
        return RepoDetails;
      }
    }
  }

  render() {
    if(this.state.hasLoaded == false) {
      return(
        <div className="section">
          <p>Loading this shit.</p>
        </div>
      )
    }

    if(this.state.hasError > 0) {
      switch(this.state.hasError) {
        case 404:
          return (<Error404 style={{height: '100%'}}/>);
        case 401:
          return (<Error401/>);
      }
    }

    const Resource = this.renderResource();

    return (
      <div className="section" style={{height: '100%'}}>
        <Container className="is-fluid">
          <Columns>
            <Column>
              <RepoBreadCrumbs params={this.props.match.params} repo={this.state.repo} />
    
              <p style={{margin: 0, padding: 0}}>
                {this.state.repo.description}
              </p>      
            </Column>

            <Column isSize={3} className="has-text-right">
              <Link className="button" to={`/${this.props.match.params.username}/${this.props.match.params.kind}/${this.state.repo.name}/revisions`}>Revisions</Link>
            </Column>
          </Columns>
        </Container>
        

        <Container className="is-fluid" style={{height: '100%'}}>
         {this.state.repo && this.state.repo.id ?
          <Resource kind={this.props.match.params.kind} item={this.state.repo} match={this.props.match} uploadAction={this.uploadAction} />
          : "" }
        </Container>

        <Modal component={Modal.upload} isActive={this.state.isUploadActive} dismissAction={this.dismissAction} urlParams={this.props.match.params} repoName={this.state.repo.name} />
      </div>
    )
  }   
}


export default Profile;

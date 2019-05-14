/*
 *  details.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 04/30/19
 *  Copyright 2018 WessCope
 */

import React from 'react';
import { Link }         from 'react-router-dom';
import { RepoDetails } from '../Repo/details';
import { Container, Columns, Column, Button } from 'bloomer';
import { ProfileHandler } from '../../handlers/profile_handler';
import Modal from '../Modal';
import { Revisions } from '../Repo/revisions'
import { Revision } from '../Repo/revision'
import { RepoFileViewer } from '../Repo/repo_file_viewer'
import RepoBreadCrumbs from '../Repo/breadcrumbs';


export class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state          = {isUploadActive: false, repo: {}};
    this.uploadAction   = this.uploadAction.bind(this);
    this.dismissAction  = this.dismissAction.bind(this);
    
    this.loadRepoDetails();
  }

  loadRepoDetails() {    
    ProfileHandler.get(this.props.match.params.name)
    .then((response) => {
      this.setState({repo: response.data.data.attributes})
    })
    .catch((error) => {
      console.log(error);
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

        <Modal component={Modal.upload} isActive={this.state.isUploadActive} dismissAction={this.dismissAction} kind={this.props.match.params.kind} repo_name={this.state.repo.name} />
      </div>
    )
  }   
}


export default Profile;

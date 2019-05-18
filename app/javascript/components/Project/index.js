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
import { ProjectHandler }   from '../../handlers';
import { Revisions }        from '../Repo/revisions'
import { Revision }         from '../Repo/revision'
import { RepoFileViewer }   from '../Repo/repo_file_viewer'
import { SliceList }        from '../Slices/list'
import { SliceDetails }     from '../Slices/details'
import Modal                from '../Modal';
import {RepoBreadCrumbs} from '../Repo/breadcrumbs';

import { 
  Container, 
  Columns, 
  Column 
} from 'bloomer';


export class Project extends React.Component {
  constructor(props) {
    super(props);

    this.state          = {isUploadActive: false, project: {}};
    this.uploadAction   = this.uploadAction.bind(this);
    this.dismissAction  = this.dismissAction.bind(this);
    
    this.loadProjectDetails();
  }

  loadProjectDetails() {    
    ProjectHandler.get(this.props.match.params.username, this.props.match.params.name)
    .then((response) => {
      this.setState({project: response.data.data.attributes})
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
      case 'slices': {
        if (this.props.match.params.revisionPath && this.props.match.params.revisionPath.match(/[\d]+/)) {
          return SliceDetails;
        }
        return SliceList;
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
          <Columns className="is-mobile">
            <Column>
              <RepoBreadCrumbs params={this.props.match.params} repo={this.state.project} />
    
              <p style={{margin: 0, padding: 0}}>
                {this.state.project.description}
              </p>      
            </Column>

            <Column className="has-text-right">
              <Link className="button" to={`/${this.props.match.params.username}/projects/${this.state.project.name}/revisions`}>Revisions</Link>
              { currentUser.username == this.props.match.params.username ? 
              <Link className="button" to={`/${this.props.match.params.username}/projects/${this.state.project.name}/slices`}>Slices</Link>
              : "" }
            </Column>
          </Columns>
        </Container>
        

        <Container className="is-fluid" style={{height: '100%'}}>
         {this.state.project && this.state.project.id ?
          <Resource kind="projects" item={this.state.project} match={this.props.match} uploadAction={this.uploadAction} />
          : "" }
        </Container>

        <Modal component={Modal.upload} isActive={this.state.isUploadActive} dismissAction={this.dismissAction} kind={this.props.match.params.kind} repo_name={this.state.project.name} />
      </div>
    )
  }   
}


export default Project;

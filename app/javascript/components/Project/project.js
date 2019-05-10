/*
 *  details.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 04/30/19
 *  Copyright 2018 WessCope
 */

import React from 'react';
import { connect } from 'react-redux';
import { Link }         from 'react-router-dom';
import { RepoDetails } from '../Repo/details';
import { Container, Columns, Column, Button } from 'bloomer';
// import { Breadcrumb } from 'bloomer/lib/components/Breadcrumb/Breadcrumb';
import { Breadcrumb, BreadcrumbItem } from 'bloomer';
import { ProjectHandler } from '../../handlers/project_handler';
import { ProjectAction }  from '../../states/project';
import Modal from '../Modal';
import { Revisions } from '../Repo/revisions'
import { Revision } from '../Repo/revision'
import { RepoFileViewer } from '../Repo/repo_file_viewer'
import { FileViewer } from '../FileViewer/file_viewer'


// import { ProjectDetails } from './components/Project/details';

export class Project extends React.Component {
  constructor(props) {
    super(props);

    this.state          = {isUploadActive: false, project: {}};
    this.uploadAction   = this.uploadAction.bind(this);
    this.dismissAction  = this.dismissAction.bind(this);
    
    this.loadProjectDetails();
  }

  loadProjectDetails() {    
    ProjectHandler.get(this.props.match.params.name)
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
      default: {
        return RepoDetails;
      }
    }
  }

  render() {
    const Resource = this.renderResource()
    return (
      <div className="section" style={{height: '100%'}}>
        <Container className="is-fluid">
          <Columns>
            <Column>
              <Breadcrumb>
                <ul>
                  <BreadcrumbItem className="title is-4">
                    <Link to={`/${this.props.match.params.username}/projects`}>Projects</Link>
                  </BreadcrumbItem>

                  <BreadcrumbItem className="title is-4" >
                    <Link to={`/${this.props.match.params.username}/projects/${this.state.project.name}`}>{this.state.project.name}</Link>
                  </BreadcrumbItem>
                </ul>
              </Breadcrumb>
            </Column>

            <Column isSize={2} className="has-text-right">
              <Button onClick={this.uploadAction}>Upload files</Button>
              <Link className="button" to={`/${this.props.match.params.username}/projects/${this.state.project.name}/revisions`}>Revisions</Link>
            </Column>
          </Columns>
        </Container>
        <br/>

        <Container className="is-fluid" style={{height: '100%'}}>
          <Resource kind="projects" item={this.state.project} match={this.props.match} />
        </Container>

        <Modal component={Modal.upload} isActive={this.state.isUploadActive} dismissAction={this.dismissAction} project={this.state.project.name} />
      </div>
    )
  }   
}


export default Project;

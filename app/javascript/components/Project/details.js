/*
 *  details.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 04/30/19
 *  Copyright 2018 WessCope
 */

import React              from 'react';
import { Link }           from 'react-router-dom';
import { RepoDetails }    from '../Repo/details';
import { ProjectHandler } from '../../handlers/project_handler';
import Modal              from '../Modal';

import { 
  Container,
  Breadcrumb, 
  BreadcrumbItem,
  Columns,
  Column,
  Button
} from 'bloomer';

export class ProjectDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isUploadActive: false, 
      project: {},
      hasError: 0
    };

    this.uploadAction       = this.uploadAction.bind(this);
    this.dismissAction      = this.dismissAction.bind(this);
    this.loadProjectDetails = this.loadProjectDetails.bind(this);

    this.loadProjectDetails();
  }

  loadProjectDetails() {    
    ProjectHandler.get(this.props.match.params.username, this.props.match.params.name)
    .then((response) => {
      this.setState({project: response.data.data.attributes})
    })
    .catch((error) => {
      console.dir("Error");
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

  render() {    
    return (
      <div className="section">
        <Container className="is-fluid">
          <Columns className="is-mobile">
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
            </Column>
          </Columns>
        </Container>

        <br/>

        <Container className="is-fluid">
          <RepoDetails kind="projects" item={this.state.project} match={this.props.match} />
        </Container>

        <Modal component={Modal.upload} isActive={this.state.isUploadActive} dismissAction={this.dismissAction} urlParams={this.props.match.params} repoName={this.state.project.name} />
      </div>
    )
  }   
}


export default ProjectDetails;

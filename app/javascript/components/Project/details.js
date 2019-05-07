/*
 *  details.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 04/30/19
 *  Copyright 2018 WessCope
 */

import React from 'react';
import { connect } from 'react-redux';
import { RepoDetails } from '../Repo/details';
import { Container } from 'bloomer/lib/layout/Container';
import { Breadcrumb } from 'bloomer/lib/components/Breadcrumb/Breadcrumb';
import { BreadcrumbItem } from 'bloomer/lib/components/Breadcrumb/BreadcrumbItem';
import { ProjectHandler } from '../../handlers/project_handler';
import { ProjectAction }  from '../../states/project';
import { Columns } from 'bloomer/lib/grid/Columns';
import { Column } from 'bloomer/lib/grid/Column';
import { Button } from 'bloomer/lib/elements/Button';
import Modal from '../Modal';

class Details extends React.Component {
  constructor(props) {
    super(props);
    
    this.state          = {isUploadActive: false};
    this.uploadAction   = this.uploadAction.bind(this);
    this.dismissAction  = this.dismissAction.bind(this);
    
    this.loadProjectDetails();
  }

  loadProjectDetails() {    
    ProjectHandler.get(this.props.match.params.name)
    .then((response) => {
        this.props.dispatch(ProjectAction.view(response.data));
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

  render() {
    return (
      <div className="section">
        <Container className="is-fluid">
          <Columns>
            <Column>
              <Breadcrumb>
                <ul>
                  <BreadcrumbItem className="title is-4">
                    <a href={"/" + this.props.match.params.username + "/projects" }>Projects</a>
                  </BreadcrumbItem>

                  <BreadcrumbItem className="title is-4" >
                    <a href={"/" + this.props.match.params.username + "/projects/" + this.props.project.name }>{this.props.project.name}</a>
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
          <RepoDetails kind="projects" item={this.props.project} match={this.props.match} />
        </Container>

        <Modal component={Modal.upload} isActive={this.state.isUploadActive} dismissAction={this.dismissAction} project={this.props.project.name} />
      </div>
    )
  }   
}

const mapStateToProps = (state) => {
  return {
    project: state.project.project
  }
}

export const ProjectDetails = connect(mapStateToProps)(Details);

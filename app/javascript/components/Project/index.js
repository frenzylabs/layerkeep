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
import {RepoBreadCrumbs}    from '../Repo/breadcrumbs';
import Loader               from '../Loader';

import {
  Error404,
  Error403,
  Error401
} from '../ErrorViews';

import { 
  Container, 
  Columns, 
  Column 
} from 'bloomer';


export class Project extends React.Component {
  constructor(props) {
    super(props);

    this.state          = {
      isUploadActive: false, 
      project:        {},
      hasError:       0,
      hasLoaded:      false
    };

    this.uploadAction       = this.uploadAction.bind(this);
    this.dismissAction      = this.dismissAction.bind(this);
    this.loadProjectDetails = this.loadProjectDetails.bind(this);
  
    this.cancelRequest = ProjectHandler.cancelSource();    
  }

  componentWillUnmount() {
    this.cancelRequest.cancel("Left Page");
  }

  componentDidMount() {
    this.loadProjectDetails();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.match.params.username != this.props.match.params.username ||
        prevProps.match.params.name != this.props.match.params.name) {
          this.loadProjectDetails()
    }
  }

  loadProjectDetails() {    
    var opts = {cancelToken: this.cancelRequest.token}
    ProjectHandler.get(this.props.match.params.username, this.props.match.params.name, opts)
    .then((response) => {
      this.setState({
        ...this.state,
        project: response.data.data.attributes,
        hasLoaded: true
      });
    })
    .catch((error) => {
      this.setState({
        ...this.state,
        hasError: error.response.status,
        hasLoaded: true
      });
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
    if (!(this.state.project && this.state.project.id)) return null;

    var props = {app: this.props.app, item: this.state.project, match: this.props.match, uploadAction: this.uploadAction}
    var Resource = ((resource) => {
    switch (resource) {
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
            props["match"]["params"]["sliceId"] = this.props.match.params.revisionPath
            return SliceDetails;
          }
          return SliceList;
        }
        default: {
          return RepoDetails;
        }
      }
    })(this.props.match.params.resource)

    return (<Resource {...props} />)
  }

  render() {

    if(this.state.hasLoaded == false) {
      return(
        <Loader/>
      )
    }

    if(this.state.hasError > 0) {
      switch(this.state.hasError) {
        case 404:
          return (<Error404 style={{height: '100%'}}/>);
        case 403:
          return (<Error403 />);
        case 401:
          return (<Error401/>);
      }
    }

    const Resource = this.renderResource();
    return (
      <div className="section" style={{height: '100%'}}>
        <Container className="is-fluid">
          <Columns className="is-mobile">
            <Column>
              <RepoBreadCrumbs params={this.props.match.params} repo={this.state.project} />
              <p style={{whiteSpace: 'pre-wrap', marginTop: '10px'}}>
                {this.state.project.description}
              </p>      
            </Column>

            <Column className="has-text-right">
              <Link className="button" to={`/${this.props.match.params.username}/projects/${this.state.project.name}/revisions`}>Revisions</Link>
              { this.state.project.user_permissions.canManage == true ? 
              <span><Link className="button" to={`/${this.props.match.params.username}/slices?q[project_id]=${this.state.project.id}`}>Slices</Link>
              <Link className="button" to={`/${this.props.match.params.username}/prints?q[project_id]=${this.state.project.id}`}>Prints</Link>
              </span>
              : "" }              
            </Column>
          </Columns>
        </Container>
        

        <Container className="is-fluid" style={{height: '100%'}}>
         {this.renderResource()}
        </Container>

        <Modal component={Modal.upload} isActive={this.state.isUploadActive} dismissAction={this.dismissAction} urlParams={this.props.match.params} repoName={this.state.project.name} />
      </div>
    )
  }   
}


export default Project;

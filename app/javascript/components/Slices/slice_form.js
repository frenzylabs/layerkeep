/*
 *  slice_form.js
 *  LayerKeep
 * 
 *  Created by Kevin Musselman (kmussel@gmail.com) on 09/03/19
 *  Copyright 2019 Frenzylabs
 */

import React              from 'react';
import { Link }           from 'react-router-dom';
import { Redirect }       from 'react-router-dom';
import InputField         from '../Form/InputField';
import Formsy             from 'formsy-react';
import TextField          from '../Form/TextField';
import { ProjectHandler, ProfileHandler, SliceHandler } from '../../handlers';
import Modal              from '../Modal';
import { UploadForm }   from './upload_form';
import { RepoForm }      from './repo_form';

import { 
  Container,
  Section, 
  Columns, 
  Column, 
  Table, 
  Icon,
  Box, 
  Control, 
  Field, 
  Button
} from 'bloomer';


export class SliceForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = { 
      sliceAttrs: {},
      canSubmit :  false,       
      projects: [], 
      profiles: [], 
      currentProfiles: [],
      currentProjects: [],
      requestError: null
    }
    
    this.onRepoFileSelected    = this.onRepoFileSelected.bind(this);
    
    this.disableButton      = this.disableButton.bind(this);
    this.enableButton       = this.enableButton.bind(this);
    this.submit             = this.submit.bind(this);
    this.dismissError       = this.dismissError.bind(this);
    this.fileDeleted        = this.fileDeleted.bind(this);
    this.fileUploaded       = this.fileUploaded.bind(this);

    this.cancelRequest      = SliceHandler.cancelSource()
  }

  componentDidMount() {
    this.loadProjects()
    this.loadProfiles()

    if (this.props.slice) {
      var projectFiles = this.createSelectedRepoOptions(this.props.slice.attributes.project_files)
      var profileFiles = this.createSelectedRepoOptions(this.props.slice.attributes.profile_files)
      this.setState({canSubmit: true, currentProjects: projectFiles, currentProfiles: profileFiles})
    }
  }

  componentWillUnmount() {
    this.cancelRequest.cancel("Left Page");
  }

  // componentDidUpdate(prevProps, prevState) {    
  // }

  createSelectedRepoOptions(repos) {
    return repos.map((item) => {
      return {id: item.id, repoId: item.attributes.repo_id, repoPath: item.attributes.repo_path, revision: item.attributes.commit, filepath: item.attributes.filepath}
    }) || []
  }

  loadProjects() {    
    ProjectHandler.list(null, {cancelToken: this.cancelRequest.token})
    .then((response) => {
      // console.log()
      var projects = response.data.data.map((item) => {
        return {name: item.attributes.name, value: item.attributes.path, id: item.id}
      })
      
      this.setState({ projects: projects})
    })
    .catch((error) => {
      console.log(error);
    });
  }


  loadProfiles() {    
    ProfileHandler.list(null, {cancelToken: this.cancelRequest.token})
    .then((response) => {
      var profiles = response.data.data.map((item) => {
        return {name: item.attributes.name, value: item.attributes.path, id: item.id}
      })
      // console.log("profiles: ", profiles)
      this.setState({ profiles: profiles})
    })
    .catch((error) => {
      console.log(error);
    });
  }

  disableButton() {
    this.setState({...this.state, canSubmit: false});
  }

  enableButton() {
    this.setState({...this.state, canSubmit: true});
  }

  submit(model) {
    this.setState({ makingRequest: true });
    var handler;
    if (this.props.match.params.sliceId) {
      handler = SliceHandler.update(this.props.match.params.username, this.props.match.params.sliceId, this.state.sliceAttrs, {cancelToken: this.cancelRequest.token})
    } else {
      handler = SliceHandler.create(this.props.match.params.username, this.state.sliceAttrs, {cancelToken: this.cancelRequest.token})
    }
    handler
    .then((response) => {
      this.setState({
        makingRequest: false,
        redirect:     true,
        sliceId:  response.data.data.id
      });
      if (this.props.onSuccess) {
        this.props.onSuccess(response.data.data)
      }
    })
    .catch((error) => {
      this.setState({
        makingRequest: false,
        requestError: error
      });
    });

  }

  dismissError() {
    this.setState({
      ...this.state,
      makingRequest: false,
      requestError: null
    });
  }


  fileUploaded(name, signedIds) {
    if (signedIds && signedIds.length == 1) {
      let sliceAttrs = this.state.sliceAttrs
      sliceAttrs[name] = { file: signedIds[0] }
      this.setState({canSubmit: true, sliceAttrs: sliceAttrs})
    }
  }

  fileDeleted(name, ufile) {
    if (ufile && ufile.signed_id) {
      let sliceAttrs = this.state.sliceAttrs
      if (sliceAttrs[name]["file"] == ufile.signed_id) {
        delete sliceAttrs[name]["file"]
      }
      var canSubmit = false
      if (this.props.slice) {
        canSubmit = true
      }
      this.setState({canSubmit: canSubmit, sliceAttrs: sliceAttrs})
    }
  }

  onRepoFileSelected(kind, repos) {
    var selectedRepos = Object.keys(repos).reduce((acc, key) => {
      var item = repos[key];
      if (item.selectedFile && item.selectedFile.name) {
        acc.push({id: item.id, repo_id: item.selectedRepo.id, revision: item.selectedRevision.value, filepath: item.selectedFile.value})
      }
      return acc;
    }, [])

    let sliceAttrs = this.state.sliceAttrs
    if (kind == "Profile") {
      sliceAttrs['profiles'] = selectedRepos
    } else {
      sliceAttrs['projects'] = selectedRepos
    }
    this.setState({sliceAttrs: sliceAttrs})
  }

  renderCurrentGcode() {
    if (this.props.slice && this.props.slice.attributes) {
      return (
        <div className="level"><div className="level-left level-item">{this.props.slice.attributes.name}</div></div>
      )
    }
  }

  renderGcode() {
    return (
      <div className={`card package`}>
        <div className="card-header">
          <p className="card-header-title">
            GCode File
          </p>
        </div>

        <div className="card-content">
          <Container className="is-fluid">
            {this.renderCurrentGcode()}
            <UploadForm name="gcode" {...this.props.uploadStorageConfig} onFileUpload={this.fileUploaded} onFileDeleted={this.fileDeleted} location={this.props.location}></UploadForm>
          </Container>
        </div>
      </div>
    )
  }

  renderProjectSection() {
    return (
      <div className={`card package`}>
        <div className="card-header">
          <p className="card-header-title">
            Attach Project File
          </p>
        </div>

        <div className="card-content">
          <Container className="is-fluid">            
            <RepoForm kind="Project" repos={this.state.projects}  onFileSelected={this.onRepoFileSelected} currentRepos={this.state.currentProjects} />
          </Container>
        </div>
      </div>
    )
  }

  renderProfileSection() {
    return (
      <div className={`card package`}>
        <div className="card-header">
          <p className="card-header-title">
            Attach Profile
          </p>
        </div>

        <div className="card-content">
          <Container className="is-fluid">
            <RepoForm kind="Profile" repos={this.state.profiles} onFileSelected={this.onRepoFileSelected} currentRepos={this.state.currentProfiles} />
          </Container>
        </div>
      </div>
    )
  }

  renderModal() {
    if (this.state.makingRequest) {
      var caption = "Creating Slice..."
      if (this.props.slice && this.props.slice.id) {
        caption = "Updating Slice"
      }
      return (
        <Modal 
          component={Modal.spinner} 
          caption={caption}
          isActive={true}
        /> 
      )
    } else if(this.state.requestError) {
      return (
        <Modal
          component={Modal.error}
          requestError={this.state.requestError}
          isActive={true}
          dismissAction={this.dismissError}
        />
      )
    }
  }
  render() {
    return (
      <div>
        <Formsy onValidSubmit={this.submit} onValid={this.enableButton} onInvalid={this.disableButton}>
          {this.renderGcode()}
          {this.renderProjectSection()}
          {this.renderProfileSection()}
          <br/>
          <Field isGrouped>
            <Control>
              <Button type="submit" disabled={this.state.canSubmit == false}>Save</Button>
            </Control>
          </Field>
        </Formsy>

        {this.renderModal()}
        

        
      </div>
    )
  }
}

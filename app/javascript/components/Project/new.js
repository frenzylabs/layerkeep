/*
 *  new.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 04/26/19
 *  Copyright 2018 WessCope
 */

import React              from 'react';
import { Link, Redirect }       from 'react-router-dom';
import Formsy             from 'formsy-react';
import { 
  Section,
  Container, 
  Columns, 
  Column, 
  Button, 
  Box,
  Control,
  Label,
  Field, 
  Table, 
  Icon
} from 'bloomer';


import InputField         from '../Form/InputField';
import TextField          from '../Form/TextField';
import UploadField        from '../Form/UploadField';
import { SearchDropdown } from '../Form/SearchDropdown'
import { ProjectHandler } from '../../handlers';
import Modal              from '../Modal';

const qs = require('qs');

export class ProjectNew extends React.Component {
  constructor(props) {
    super(props);

    var qparams = qs.parse(this.props.location.search, { ignoreQueryPrefix: true })
    
    this.initialState = {
      nameLabel:        {title: "Name", caption: ""},
      canSubmit :       false, 
      name:             null,
      description:      "",
      isPrivate:        false,
      files:            [],
      fileList:         null,
      creatingRepo:     false,
      requestError:     null,
      fileSources:      [],
      thingID:          qparams["thing_id"],
      remoteSource:     qparams["source"]
    };
    
    this.state = Object.assign({}, this.initialState);

    this.disableButton      = this.disableButton.bind(this);
    this.enableButton       = this.enableButton.bind(this);
    this.nameChanged        = this.nameChanged.bind(this);
    this.descriptionChanged = this.descriptionChanged.bind(this);
    this.privateChanged     = this.privateChanged.bind(this);
    this.filesChanged       = this.filesChanged.bind(this);
    this.deleteFile         = this.deleteFile.bind(this);
    this.renderFiles        = this.renderFiles.bind(this);
    this.submit             = this.submit.bind(this);
    this.dismissError       = this.dismissError.bind(this);
    this.renderNameLabel    = this.renderNameLabel.bind(this);
    this.selectFileSource   = this.selectFileSource.bind(this);
    this.cancelRequest      = ProjectHandler.cancelSource();
    this.loadRemoteSources()

  }

  componentWillUnmount() {
    this.cancelRequest.cancel("Left Page");
  }

  componentDidUpdate(prevProps) {
    if (prevProps.location.pathname != this.props.location.pathname) {
      this.uploadFieldRef.clearFiles();
      this.setState(this.initialState)
    }
  }

  loadRemoteSources() {    
    ProjectHandler.raw("/remote_sources", {cancelToken: this.cancelRequest.token})
    .then((response) => {
      var remoteSources = response.data.data.map((item) => {
        return {name: item.attributes.display_name, value: item.id, id: item.id}
      })
      
      let sources = [{name: "Local", value: "0", id: "0"}].concat(remoteSources)

      this.setState({ fileSources: sources})
      
      var selectedSource = sources.find((item) => item.name.toLowerCase() == this.state.remoteSource) || sources[0]
      this.selectFileSource(selectedSource, "sources0")
    })
    .catch((error) => {
      console.log(error);
    });
  }

  selectFileSource(item, id) {
    this.setState({ selectedFileSource: item})
  }

  nameChanged(e) {
    var val = e.currentTarget.value;
    var name  = val.trim().replace(/[^a-zA-Z0-9\-_]/g, " ").split(/\s+/).join('-').replace(/-*$/, "");

    this.setState({
      ...this.state,
      name: val,
      nameLabel: {
        title: "Name",
        caption: (val != name ? name : '')
      }
    });
  }

  descriptionChanged(e) {
    this.setState({
      ...this.state,
      description: e.currentTarget.value
    });
  }

  privateChanged(e) {
    this.setState({isPrivate: e.currentTarget.checked});
  }

  filesChanged(files) {
    this.setState({
      files: Array.from(files).concat((this.state.files || [])),
      fileList: this.uploadFieldRef.fileList()
    });
  }

  deleteFile(e) {
    if(this.state.files.length == 0) { return }

    var files = this.state.files,
        index = parseInt($(e.currentTarget).attr('id').replace('upload-file-', ''));

    files.splice(index, 1);    
    this.setState({...this.state, files: files});
    this.uploadFieldRef.clearFiles();
  }

  disableButton() {
    this.setState({...this.state, canSubmit: false});
  }

  enableButton() {
    this.setState({...this.state, canSubmit: true});
  }

  submit(formData) {
    var name = this.state.nameLabel.caption.length > 1 ? this.state.nameLabel.caption : this.state.name
    var repoData = Object.assign(formData, {name: name, is_private: this.state.isPrivate})
    if (this.state.selectedFileSource && this.state.selectedFileSource.id != "0") {
      repoData["remote_source_id"] = this.state.selectedFileSource.id
    }

    this.setState({
      ...this.state,
      creatingRepo: true
    });

    ProjectHandler.create(this.props.match.params.username, repoData, this.state.files)
    .then((response) => {
      this.setState({
        ...this.state,
        redirect:     true,
        creatingRepo: false,
        projectName:  response.data.name
      });
    })
    .catch((error) => {
      this.setState({
        ...this.state,
        creatingRepo: false,
        requestError: error
      });
    });
  }

  dismissError() {
    this.setState({
      ...this.state,
      creatingRepo: false,
      requestError: null
    });
  }

  renderFileSourceSelections() {
    if (this.state.fileSources.length > 0) {
      return (
        <div>
          <SearchDropdown id={"source"} hideSearch="true" options={this.state.fileSources} selected={this.state.selectedFileSource} onSelected={this.selectFileSource} promptText="Select a Source" placeholder="Remote Source" />
        </div>
      )
    }
  }

  renderFileOption() {
    if (!this.state.selectedFileSource) return;
    if (this.state.selectedFileSource.id == "0") {
      return (
        <Control>
          <Box style={{margin:0, padding:0}}>
          <UploadField ref={(el) => this.uploadFieldRef = el } name="uploads" id="repo-file-upload" onFiles={this.filesChanged} uploadProps={{multiple: 'multiple'}}>
              <Section>
                <Box className="has-text-centered" style={{border: 'none', boxShadow: 'none'}}>Click here or drag files here to upload.</Box>
              </Section>
            </UploadField>

            <Table isStriped className="is-fullwidth" style={{border: '1px solid #eaeaea'}}>
              <tbody>
                {this.renderFiles() }
              </tbody>
            </Table>
          </Box>
        </Control>
      )
    } else if(this.state.selectedFileSource.name.toLowerCase() == "thingiverse") {
        return (
          <Control>
            <InputField 
              label="Thingiverse ThingID"
              name="thing_id"
              placeholder="Ex. https://www.thingiverse.com/thing:3746963  would be 3746963"
              value={this.state.thingID}
            />
          </Control>
        )
    }
  }

  renderFiles() {
    if(this.state.files == null) { return }

    return this.state.files.map((entry, index) => {
      return (
        <tr key={index}>
          <td>{entry.name}</td>
          <td className="has-text-right" width={2}>
            <a onClick={this.deleteFile} id={'upload-file-' + index}>
              <Icon isSize='small' className='fa fa-trash' />
            </a>
          </td>
        </tr>
      )
    });
  }

  renderNameLabel() {
    return (
      <React.Fragment>
        <span>{this.state.nameLabel.title}</span>
        {this.state.nameLabel.caption.length > 0 && (
          <React.Fragment>
            <span className="is-italic has-text-weight-normal has-text-grey-light">
              &nbsp; &nbsp; &nbsp; Will be created as: 
            </span>
            <span className="is-italic has-text-grey-dar has-text-weight-bold">
              &nbsp; &nbsp; {this.state.nameLabel.caption}
            </span>
          </React.Fragment>
        )}
      </React.Fragment>
    )
  }

  renderPrivateOption() {
    if (!this.props.app.features || !this.props.app.features.project) return;

    if (this.props.app.features && this.props.app.features.project.private_repos) {
      return (
        <div className="control is-expanded">
          <label className="checkbox">
            <input 
              type='checkbox' 
              name="private" 
              value='is_private' 
              checked={this.state.isPrivate} 
              onChange={this.privateChanged} 
            />

            &nbsp; Make this project private
          </label>
        </div>
      )
    } else {
      return (
        <div className="control is-expanded">
          <p>
            <Link style={{fontWeight: 'bold'}} to={`/${this.props.match.params.username}/settings/billing`}>Update Subscription</Link> to 
            enable private projects.
          </p>          
        </div>
      )
    }
  }

  render() {
    if(this.state.redirect) { 
      return (<Redirect to={`/${this.props.match.params.username}/projects/${this.state.projectName}`}/>);
    }
    return (
      
      <div>
        <div>
          <Formsy onValidSubmit={this.submit} onValid={this.enableButton} onInvalid={this.disableButton}>
            <Section>
              <br/>

              <Columns isCentered>
                <Column isSize={9}>
                  <Box>
                    <h1 className="title">Create New Project.</h1>

                    <hr />
                  
                    <InputField 
                      label={this.renderNameLabel()}
                      name="name"
                      onChange={this.nameChanged}
                      placeholder="What should we call this project?"
                      validationError="Name is required"
                      value={this.state.name}
                      required
                    />
                    
                    <TextField 
                      label="Description"
                      name="description"
                      onChange={this.descriptionChanged}
                      placeholder="Tell us about it"
                      value={this.state.description}
                    />

                    <Field>
                      <Label>File Source</Label>
                      <Control>
                        {this.renderFileSourceSelections()}
                      </Control>
                    </Field>

                    <Field>
                      {this.renderFileOption()}
                    </Field>

                    <br/><hr/><br/>
                    
                    <Field isGrouped>
                      {this.renderPrivateOption()}
                    </Field>
                    <Field isGrouped>
                      <Control>
                        <Button type="submit" disabled={this.state.canSubmit == false}>Save</Button>
                      </Control>
                    </Field>
                  </Box>
                </Column>
              </Columns>
            </Section>
          </Formsy>
        </div>

        <Modal 
          component={Modal.spinner} 
          caption={"Creating project..."}
          isActive={this.state.creatingRepo }  
        />  

        <Modal
          component={Modal.error}
          requestError={this.state.requestError}
          isActive={this.state.requestError !== null}
          dismissAction={this.dismissError}
        />

      </div>
    )
  }
}

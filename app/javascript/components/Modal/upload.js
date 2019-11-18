/*
 *  upload.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 05/07/19
 *  Copyright 2018 WessCope
 */

import React            from 'react';
import UploadField      from '../Form/UploadField';
import { RepoHandler }  from '../../handlers';

import { 
  Box,
  Table,
  Icon,
  Button,
  Field,
  Control,
  Columns,
  Column,
  Input
} from 'bloomer';
import { Loader } from 'three';
import { Section } from 'bloomer/lib/layout/Section';


export default class UploadModal extends React.Component {
  title = "Upload files";
  
  constructor(props) {
    super(props);

    this.state = {
      files:        null,
      isUploading:  false,
      errors:       null,
      canSubmit: false
    };

    this.messageChanged = this.messageChanged.bind(this);
    this.filesChanged   = this.filesChanged.bind(this);
    this.deleteFile     = this.deleteFile.bind(this);
    this.renderFiles    = this.renderFiles.bind(this);
    this.submitAction   = this.submitAction.bind(this);

    this.updateFileState = this.updateFileState.bind(this)
    this.filesReady      = this.filesReady.bind(this)
  }

  filesChanged(files) {
    var filelist = Array.from(files)
    filelist.forEach((f) => { f.state = "uploading"; f.progress = 0; this.uploadToTemp(f) })
    this.setState({
      ...this.state,
      files: filelist.concat((this.state.files || []))
    });
  }

  updateFileState(file, attrs = {}) {
    var files = this.state.files.map((item) => {
      if (item.name == file.name) {
        item = Object.assign(item, attrs)
      }
      return item
    })
    this.setState({files: files})
  }

  uploadToTemp(file) {
    var self = this
    const config = {
      onUploadProgress: (progressEvent) => {
        var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        this.updateFileState(file, {state: "uploading", progress: percentCompleted})        
      },
      headers: {'Content-Type' : 'multipart/form-data'}
    }

    var urlParams = this.props.urlParams
    var commitUrl = "/" + [urlParams.username, urlParams.kind, urlParams.name, "upload"].join("/")

    RepoHandler.uploadTemp(commitUrl, file, config)
    .then((response) => {
      this.updateFileState(file, {state: "complete", progress: 100, path: response.data.path})
    })
    .catch((error) => {
      var msg = ""
      if (error.response && error.response.data) {
        var data = error.response.data
        msg = data.error
      }
      this.updateFileState(file, {state: "failed", reason: msg})
      this.setState({
        ...this.state,
        isTmpUploading: false,
        errors: error.message
      });
    });
  }

  messageChanged(e) {
    this.setState({
      ...this.state,
      message: e.currentTarget.value || ""
    });
  }

  deleteFile(e) {
    e.preventDefault();

    if(this.state.files == null || this.state.files.count < 1) { return }

    var files = this.state.files,
        index = parseInt($(e.currentTarget).attr('id').replace('upload-file-', ''));


    files.splice(index, 1);
    
    this.setState({
      ...this.state, 
      files: files
    });

    this.uploadFieldRef.fileInputRef.value = "";
  }

  renderFileState(entry) {
    switch (entry.state) {
      case 'waiting':
        return <td><p>Waiting to upload {entry.name}</p></td>
      case 'uploading':
          return <td><p>Uploading {entry.name}: {entry.progress}%</p></td>
      case 'complete':
          return <td><p>{entry.name} </p></td>
      case 'failed':
          return <td><p>Failed {entry.name} </p></td>
    }
  }
  renderFiles() {
    if(this.state.files == null) { return }

    return this.state.files.map((entry, index) => {
      return (
        <tr key={index}>
          {this.renderFileState(entry)}
          <td className="has-text-right" width={2}>
            <a onClick={this.deleteFile} id={'upload-file-' + index}>
              <Icon isSize='small' className='fa fa-trash' />
            </a>
          </td>
        </tr>
      )
    });
  }

  submitAction() {
    if(this.state.files === null) {
      this.setState({
        ...this.state,
        errors: "No files have been added."
      });
      return;
    }

    this.setState({
      ...this.state,
      isUploading: true
    });

    var urlParams = this.props.urlParams
    var revisionPath = urlParams.revisionPath
    if (!revisionPath) revisionPath = "master"
    var commitUrl = "/" + [urlParams.username, urlParams.kind, urlParams.name, "tree", revisionPath].join("/")

    var completedFiles = this.state.files.reduce((acc, item) => { 
      if (item.state == "complete") return acc.concat(item)
      return acc
    }, [])

    RepoHandler.commit(commitUrl, completedFiles, this.state.message)
    .then((response) => {
      window.location.href = window.location.href;
    })
    .catch((err) => {
      var errMessage = "There was an error uploading the files."
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
        isUploading: false,
        errors: errMessage
      });
    });
  }

  filesReady() {
    if (!this.state.files || this.state.files.find((item) => { item.state != "complete" && item.state != "failed" })) {
      return false
    }
    return true
  }

  render() {
    if(this.state.isUploading) {
      return (
        <div>
        <h1 className="title is-4">Upload files.</h1>
          <Box>
            <div className="columns is-centered">
              <div className="column is-two-fifths">
                <div className="sk-three-bounce">
                  <div className="sk-child sk-bounce1" style={{background: '#c0c0c0'}}></div>
                  <div className="sk-child sk-bounce2" style={{background: '#c0c0c0'}}></div>
                  <div className="sk-child sk-bounce3" style={{background: '#c0c0c0'}}></div>
                </div>
                <p className="has-text-centered" style={{fontSize: '22px', color: "#c0c0c0"}}>Uploading...</p>
              </div>
            </div>
          </Box>
        </div>
      );
    }

    return (
      <div>
        <h1 className="title is-4">
          Upload files. 
        </h1>

        {this.state.errors && (
          <p className="has-text-centered" style={{color: 'red', marginBottom: '10px'}}>{this.state.errors}</p>
        )}

        <Box style={{margin:0, padding:0}} >
          <UploadField ref={(el) => this.uploadFieldRef = el } name="uploads" onFiles={this.filesChanged} uploadProps={{multiple: 'multiple'}}>
            <Section>
              <Box className="has-text-centered" style={{border: 'none', boxShadow: 'none'}}>Click here or drag files here to upload.</Box>
            </Section>
          </UploadField>

          <Box style={{margin:0, padding:0, overflowX: "scroll"}} >
          <Table isStriped className="is-fullwidth" style={{border: '1px solid #eaeaea'}}>
            <tbody>
              {this.renderFiles()}
            </tbody>
          </Table>
          </Box>

        </Box>

        <Field style={{marginTop: '2em'}}>
          <Control>
            <Input type="text" placeholder="Description of uploads." onChange={this.messageChanged} />
          </Control>
        </Field>

        <hr/>

        <Columns>
          <Column>
            <p>Uploading to <strong>{this.props.repoName}.</strong></p>
          </Column>

          <Column>
            <div className="buttons is-right">
              <Button isColor="success" disabled={this.filesReady() == false} onClick={this.submitAction}>Submit</Button>
              <Button onClick={this.props.dismissAction}>Cancel</Button>
            </div>
          </Column>
        </Columns>
      </div>
    )
  }
}

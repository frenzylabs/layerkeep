/*
 *  upload.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 05/07/19
 *  Copyright 2018 WessCope
 */

import React            from 'react';
import { UploadField }  from '@navjobs/upload';
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

export default class UploadModal extends React.Component {
  title = "Upload files";
  
  constructor(props) {
    super(props);

    this.state = {
      files:        null,
      isUploading:  false,
      errors:       null,
    };

    this.messageChanged = this.messageChanged.bind(this);
    this.filesChanged   = this.filesChanged.bind(this);
    this.deleteFile     = this.deleteFile.bind(this);
    this.renderFiles    = this.renderFiles.bind(this);
    this.submitAction   = this.submitAction.bind(this);
  }

  filesChanged(files) {
    this.setState({
      ...this.state,
      files: Array.from(files).concat((this.state.files || []))
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

    RepoHandler.commit(this.props.urlParams.username, this.props.urlParams.kind, this.props.repoName, this.state.files, this.state.message)
    .then((response) => {
      window.location.href = window.location.href;
    })
    .catch((error) => {
      this.setState({
        ...this.state,
        isUploading: false,
        errors: error.message
      });
  
      
    });

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
        

        <Box>
          <UploadField name="uploads" onFiles={this.filesChanged} uploadProps={{multiple: 'multiple'}}>
            <div className="has-text-centered">Click here or drag files here to upload.</div>
          </UploadField>

            <br />

          <Table isStriped className="is-fullwidth" style={{border: '1px solid #eaeaea'}}>
            <tbody>
              {this.renderFiles()}
            </tbody>
          </Table>

          <br/>
        </Box>

        <Field>
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
              <Button isColor="success" onClick={this.submitAction}>Submit</Button>
              <Button onClick={this.props.dismissAction}>Cancel</Button>
            </div>
          </Column>
        </Columns>
      </div>
    )
  }
}

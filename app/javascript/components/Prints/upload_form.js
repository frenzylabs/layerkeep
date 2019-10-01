/*
 *  upload_form.js
 *  LayerKeep
 * 
 *  Created by Kevin Musselman (kmussel@gmail.com) on 08/14/19
 *  Copyright 2019 Frenzylabs
 */

import React            from 'react';
import { Link }         from 'react-router-dom';

import { 
  Box,
  Table,
  Icon,
  Button,
  Field,
  Control,
  Columns,
  Column,
  Input,
  Section
} from 'bloomer';

import { DirectUploadProvider } from 'react-activestorage-provider'

// import ActiveStorageProvider from 'react-activestorage-provider'

import UploadField        from '../Form/UploadField';



export class UploadForm extends React.Component {
  constructor(props) {
    super(props);

    this.initialState = {
      uploads:          {},
      name:             null,
      description:      "",
      isPrivate:        false,
      files:            [],
      fileList:         null,
      creatingRepo:     false,
      requestError:     null,
      fileSources:      []
    };
    
    this.state = Object.assign({}, this.initialState);


    this.renderControl          = this.renderControl.bind(this);
    this.renderFileUploadState  = this.renderFileUploadState.bind(this);
    this.deleteFile             = this.deleteFile.bind(this);
    this.renderFiles            = this.renderFiles.bind(this);

    this.uploads = {}
  }

  componentWillUnmount() {
  }

  componentDidUpdate(prevProps) {
    if (prevProps.location.pathname != this.props.location.pathname) {
      this.uploadFieldRef.clearFiles();
      this.setState(this.initialState)
    }
  }

  deleteFile(key) {
    var uploads = this.state.uploads
    var ufile = uploads[key]
    if (!ufile) return 

    delete uploads[key]
    this.uploadFieldRef.clearFiles();
    this.setState({uploads: uploads});
    if (this.props.onFileDeleted) {
      this.props.onFileDeleted(this.props.name, ufile.file)
    }
  }

  fileUploaded(signedIds) {
    this.setState({uploads: this.uploads})
    if (this.props.onFileUpload) {
      this.props.onFileUpload(this.props.name, signedIds)
    }
  }

  blobListener(file, xhr) {
    if (xhr.response && xhr.response.signed_id) {
      file["signed_id"] = xhr.response.signed_id
    }
  }

  myHandleUploads({id, file, xhr}) {
    var self = this;    
    xhr.addEventListener("load", function() { self.blobListener(file, this) } );
  }

  mybeforeStorage({id, file, xhr}) {
  }


  renderFileUploadState(uploads) {
    if (!uploads) return;
    return uploads.map(upload => {
      switch (upload.state) {
        case 'waiting':
          return <tr key={upload.id}><td><p>Waiting to upload {upload.file.name}</p></td></tr>
        case 'uploading':
          return (
            <tr key={upload.id}><td><p>
              Uploading {upload.file.name}: {upload.progress}%
            </p></td></tr>
          )
        case 'error':
          var uploads = this.uploads
          if (!uploads[upload.file.name]) {
            uploads[upload.id] = upload
            // this.setState({uploads: uploads})
          }
          return (
            <tr key={upload.id}><td><p>
              Error uploading {upload.file.name}: {upload.error}
            </p></td></tr>
          )
        case 'finished':
            var uploads = this.uploads
            if (!uploads[upload.file.name]) {
              uploads[upload.file.name] = upload
              // this.setState({uploads: uploads})
            }
          return (
            <tr key={upload.id}><td><p>Finished uploading {upload.file.name}</p></td></tr>
          )
      }
    })
  }

  onFileChange(files, handleUpload) {
    if (files.length > 0 && !this.props.multiple) {
      this.uploads = {}
      this.setState({ uploads: {} })
    }
    handleUpload(files)
  }

  renderControl({handleUpload, uploads, ready}) {
    let uploadProps = this.props.multiple ? {multiple: 'multiple'} : {}
    return (
      <Control>
        <Box style={{margin:0, padding:0}}>
        <UploadField ref={(el) => this.uploadFieldRef = el } name="uploads" onChange={e => this.onFileChange(e.currentTarget.files, handleUpload)} uploadProps={uploadProps}>
            <Section>
              <Box className="has-text-centered" style={{border: 'none', boxShadow: 'none'}}>Click here or drag file here to upload.</Box>
            </Section>
          </UploadField>
    
          <Table isStriped className="is-fullwidth" style={{border: '1px solid #eaeaea'}}>
            <tbody>
              {this.renderFileUploadState(uploads) }
              {this.renderFiles()}
            </tbody>
          </Table>
        </Box>
      </Control>
    )
  }

  renderFiles() {
    let files = this.state.uploads
    return Object.keys(files).map((key, index) => {
      var entry = files[key]
      return (
        <tr key={key}>
          <td>{entry.file.name}</td>
          <td className="has-text-right" width={2}>
            <a onClick={() => this.deleteFile(key) } id={'upload-file-' + index}>
              <Icon isSize='small' className='fa fa-trash' />
            </a>
          </td>
        </tr>
      )
    });
  }

  render() {
    let multiple = this.props.multiple == undefined ? true : this.props.multiple;

    return (
      <DirectUploadProvider
        directUploadsPath={this.props.directUploadPath}
        endpoint={this.props.endpoint}          
        multiple={multiple}
        onBeforeStorageRequest={this.mybeforeStorage.bind(this)}
        onBeforeBlobRequest={this.myHandleUploads.bind(this)}
        onSuccess={this.fileUploaded.bind(this)}        
        render={this.renderControl}          
      />
    )
  }  
}

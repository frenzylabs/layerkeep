/*
 *  new.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 04/26/19
 *  Copyright 2018 WessCope
 */

import React              from 'react';
import { Link, Redirect }       from 'react-router-dom';
import InputField         from '../Form/InputField';
import Formsy             from 'formsy-react';
import TextField          from '../Form/TextField';
import { PrintHandler } from '../../handlers';
import Modal              from '../Modal';
import SpinnerModal       from '../Modal/spinner';
import { PrintForm }      from './print_form';

import { 
  Section, 
  Columns, 
  Column, 
  Table, 
  Breadcrumb, 
  BreadcrumbItem,
  Icon,
  Box, 
  Control, 
  Label,
  Field, 
  Button
} from 'bloomer';


export class PrintNew extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      nameLabel:        {title: "Name", caption: ""},
      canSubmit :       false, 
      name:             null,
      description:      "",
      files:            [],
      fileList:         null,
      creatingRepo:  false,
      requestError:     null,
    };

    
    this.disableButton      = this.disableButton.bind(this);
    this.enableButton       = this.enableButton.bind(this);
    this.descriptionChanged = this.descriptionChanged.bind(this);
    this.filesChanged       = this.filesChanged.bind(this);
    this.deleteFile         = this.deleteFile.bind(this);
    this.renderFiles        = this.renderFiles.bind(this);
    this.submit             = this.submit.bind(this);
    this.dismissError       = this.dismissError.bind(this);
    this.printCreated       = this.printCreated.bind(this);
  }

  
  descriptionChanged(e) {
    this.setState({
      ...this.state,
      description: e.currentTarget.value
    });
  }

  filesChanged(files) {
    this.setState({
      files: Array.from(files).concat((this.state.files || [])),
      fileList: this.uploadFieldRef.fileList()
    });
  }

  deleteFile(e) {
    e.preventDefault();

    if(this.state.files == null || this.state.files.count < 1) { return }

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

  submit(model) {
    this.setState({
      ...this.state,
      creatingPrint: true
    });
    PrintHandler.create(this.props.match.params.username, {name: this.state.name, description: this.state.description}, this.state.files)
    .then((response) => {
      this.setState({
        ...this.state,
        redirect:     true,
        printID:  response.data.data.id
      });
    })
    .catch((error) => {
      console.log(error);
      this.setState({
        ...this.state,
        creatingPrint: false,
        requestError: error.message
      });
    });

  }

  dismissError() {
    this.setState({
      ...this.state,
      creatingPrint: false,
      requestError: null
    });
  }

  renderFiles() {
    if(this.state.redirect) { 
      return (<Redirect to={`/${this.props.match.params.username}/prints/${this.state.printID}/`}/>);
    }

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

  uploadStorageConfig() {
    var printpath = `/${this.props.match.params.username}/prints`
    return {
      directUploadPath: `${printpath}/assets/presign`,
      endpoint: {
        path: `${printpath}/${this.props.match.params.printId}`,
        model: 'Print',
        attribute: 'files',              
        method: 'PUT'
      },
      multiple: true
    }
  }

  printCreated(data) {
    if (data) {
      this.setState({print: data, redirect: `/${this.props.match.params.username}/prints/${data.id}`})
    }
  }

  renderContent() {
    if (this.state.isLoading) {
      return (<SpinnerModal />)
    } else if (this.state.error) {
      return (
        <article className="message is-danger">
          <div className="message-body">
            {this.state.error}
          </div>
        </article>
      )
    } else {
      return (
        <PrintForm {...this.props} print={this.state.print} onSuccess={this.printCreated} uploadStorageConfig={this.uploadStorageConfig()} />
      )
    }
  }

  render() {
    if(this.state.redirect) { 
      return (<Redirect to={`${this.state.redirect}`}/>);
    }
    return (
      <div className="section">
        <div className="container is-fluid">
          <Columns className="is-mobile">
            <Column>              
            <Breadcrumb>
                <ul>
                  <BreadcrumbItem className="title is-4">
                    <Link to={`/${this.props.match.params.username}/prints`}>Prints</Link>                    
                  </BreadcrumbItem>
                  <BreadcrumbItem className="title is-4" > &nbsp;&nbsp; New </BreadcrumbItem>
                </ul>
              </Breadcrumb>
            </Column>
          </Columns>          
          <Box>
            {this.renderContent()}
          </Box>
        </div>

      <Modal 
        component={Modal.spinner} 
        caption={"Creating print..."}
        isActive={this.state.creatingRepo }  
      />  

      <Modal
        component={Modal.error}
        caption={this.state.requestError}
        isActive={this.state.requestError !== null}
        dismissAction={this.dismissError}
      />

    </div>
    )
  }
}

/*
 *  new.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 04/26/19
 *  Copyright 2018 WessCope
 */

import React            from 'react';
import { Redirect }     from 'react-router-dom';
import { Section }      from 'bloomer/lib/layout/Section';
import { Columns }      from 'bloomer/lib/grid/Columns';
import { Column }       from 'bloomer/lib/grid/Column';
import { Box }          from 'bloomer/lib/elements/Box';
import { Control }      from 'bloomer/lib/elements/Form/Control';
import { Field }        from 'bloomer/lib/elements/Form/Field/Field';
import { Button }       from 'bloomer/lib/elements/Button';
import InputField       from '../Form/InputField';
import Formsy           from 'formsy-react';
import TextField        from '../Form/TextField';
import { Table }        from 'bloomer/lib/elements/Table';
import { Icon }         from 'bloomer/lib/elements/Icon';
import { UploadField }  from '@navjobs/upload';

import { ProjectHandler } from '../../handlers';
import Modal from '../Modal';

export class ProjectNew extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      nameLabel:        {title: "Name", caption: ""},
      canSubmit :       false, 
      name:             null,
      description:      "",
      files:            [],
      creatingProject:  false,
      requestError:     null,
    };
    
    this.disableButton      = this.disableButton.bind(this);
    this.enableButton       = this.enableButton.bind(this);
    this.nameChanged        = this.nameChanged.bind(this);
    this.descriptionChanged = this.descriptionChanged.bind(this);
    this.filesChanged       = this.filesChanged.bind(this);
    this.deleteFile         = this.deleteFile.bind(this);
    this.renderFiles        = this.renderFiles.bind(this);
    this.submit             = this.submit.bind(this);
    this.dismissError       = this.dismissError.bind(this);
    this.renderNameLabel    = this.renderNameLabel.bind(this);
  }

  nameChanged(e) {
    const val = e.currentTarget.value;
    var name  = val.trim().replace(/[^a-zA-Z0-9\-_]/g, " ").split(/\s+/).join('-');

    this.setState({
      ...this.state,
      name: name,
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

  filesChanged(files) {
    this.setState({
      files: Array.from(files).concat((this.state.files || []))
    });
  }

  deleteFile(e) {
    if(this.state.files.length == 0) { return }

    var files = this.state.files,
        index = parseInt($(e.currentTarget).attr('id').replace('upload-file-', ''));


    files.splice(index, 1);
    
    this.setState({...this.state, files: files});
    console.log(this.state.files);
  }

  disableButton() {
    this.setState({...this.state, canSubmit: false});
  }

  enableButton() {
    this.setState({...this.state, canSubmit: true});
  }

  submit() {
    this.setState({
      ...this.state,
      creatingProject: true
    });

    ProjectHandler.create({name: this.state.name, description: this.state.description}, this.state.files)
    .then((response) => {
      this.setState({
        ...this.state,
        redirect:     true,
        projectName:  response.data.name
      });
    })
    .catch((error) => {
      this.setState({
        ...this.state,
        creatingProject: false,
        requestError: error.message
      });
    });
  }

  dismissError() {
    this.setState({
      ...this.state,
      creatingProject: false,
      requestError: null
    });
  }

  renderFiles() {
    if(this.state.redirect) { 
      return (<Redirect to={`/${currentUser.username}/projects/${this.state.projectName}/`}/>);
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

  render() {
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
                      required
                    />
                    
                    <TextField 
                      label="Description"
                      name="description"
                      onChange={this.descriptionChanged}
                      placeholder="Tell us about it"
                    />

                    <Field isGrouped>
                      <Control>
                        <Button type="submit" disabled={this.state.canSubmit == false}>Save</Button>
                      </Control>
                    </Field>
                  </Box>
                </Column>
              </Columns>
            </Section>

            <Section>
              <Columns isCentered>
                <Column isSize={9}>
                  <Box style={{margin:0, padding:0}}>
                  <UploadField name="uploads" onFiles={this.filesChanged} uploadProps={{multiple: 'multiple'}}>
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
                </Column>
              </Columns>
            </Section>
          </Formsy>
        </div>

        <Modal 
          component={Modal.spinner} 
          caption={"Creating project..."}
          isActive={this.state.creatingProject }  
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

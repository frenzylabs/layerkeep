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

import { ProjectHandler } from '../../handlers/project_handler';

export class ProjectNew extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      canSubmit : false, 
      name:         null,
      description:  "",
      files:        null
    };
    
    this.disableButton      = this.disableButton.bind(this);
    this.enableButton       = this.enableButton.bind(this);
    this.nameChanged        = this.nameChanged.bind(this);
    this.descriptionChanged = this.descriptionChanged.bind(this);
    this.filesChanged       = this.filesChanged.bind(this);
    this.deleteFile         = this.deleteFile.bind(this);
    this.renderFiles        = this.renderFiles.bind(this);
    this.submit             = this.submit.bind(this);
  }

  nameChanged(e) {
    this.setState({
      ...this.state,
      name: e.currentTarget.value
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
    e.preventDefault();

    if(this.state.files == null || this.state.files.count < 1) { return }

    var files = this.state.files,
        index = parseInt($(e.currentTarget).attr('id').replace('upload-file-', ''));


    files.splice(index, 1);
    
    this.setState({...this.state, files: files});
  }

  disableButton() {
    this.setState({...this.state, canSubmit: false});
  }

  enableButton() {
    this.setState({...this.state, canSubmit: true});
  }

  submit(model) {
    ProjectHandler.create(model, this.state.files)
    .then((response) => {
      this.setState({
        ...this.state,
        redirect:     true,
        projectName:  response.data.name
      });
    })
    .catch((error) => {
      console.log(error);
    });

  }

  renderFiles() {
    if(this.state.redirect) { 
      return (<Redirect to={`${currentUser.username}/projects/${this.state.projectName}/`}/>);
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

  render() {
    return (
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
                    label="Name"
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
                <Box>
                  <UploadField name="uploads" onFiles={this.filesChanged} uploadProps={{multiple: 'multiple'}}>
                      <div className="has-text-centered">Click here or drag files here to upload.</div>
                  </UploadField>

                  <br />

                  <Table isStriped className="is-fullwidth" style={{border: '1px solid #eaeaea'}}>
                    <tbody>
                      {this.renderFiles() }
                    </tbody>
                  </Table>

                  <br/>
                </Box>
              </Column>
            </Columns>
          </Section>
        </Formsy>
      </div>
    )
  }
}

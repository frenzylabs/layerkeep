/*
 *  upload.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 05/07/19
 *  Copyright 2018 WessCope
 */

import React from 'react';
import { Box }          from 'bloomer/lib/elements/Box';
import { Table }        from 'bloomer/lib/elements/Table';
import { Icon }         from 'bloomer/lib/elements/Icon';
import { UploadField }  from '@navjobs/upload';
import { Button }       from 'bloomer/lib/elements/Button';
import { Field }        from 'bloomer/lib/elements/Form/Field/Field';
import { Control }      from 'bloomer/lib/elements/Form/Control';
import { Columns }      from 'bloomer/lib/grid/Columns';
import { Column }       from 'bloomer/lib/grid/Column';
import { Input }        from 'bloomer/lib/elements/Form/Input';

import { ProjectHandler } from '../../handlers/project_handler';

export default class UploadModal extends React.Component {
  title = "Upload files";
  
  constructor(props) {
    super(props);

    this.state = {
      files: null
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
    
    this.setState({...this.state, files: files});
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
    ProjectHandler.commit(this.props.project, this.state.files, this.state.message)
    .then((response) => {
      window.location.href = window.location.href;
    })
    .catch((error) => {
      console.log(error);
    });

  }

  render() {
    return (
      <div>
        <h1 className="title is-4">Upload files.</h1>
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

        <Field>
          <Control>
            <Input type="text" placeholder="Description of uploads." onChange={this.messageChanged} />
          </Control>
        </Field>

        <hr/>

        <Columns>
          <Column>
            <p>Above files will be uploaded to project.</p>
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

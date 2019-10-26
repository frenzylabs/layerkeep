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
import UploadField        from '../Form/UploadField';
import { PrinterHandler } from '../../handlers';
import Modal              from '../Modal';

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


export class PrinterForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = { 
      printerAttrs: {},
      canSubmit :  false,
      requestError: null
    }
    
    this.disableButton      = this.disableButton.bind(this);
    this.enableButton       = this.enableButton.bind(this);
    this.submit             = this.submit.bind(this);
    this.dismissError       = this.dismissError.bind(this);
    // this.fileDeleted        = this.fileDeleted.bind(this);
    // this.fileUploaded       = this.fileUploaded.bind(this);

    this.cancelRequest      = PrinterHandler.cancelSource()
  }

  componentDidMount() {

    if (this.props.printer) {
      this.setState({canSubmit: true})
    }
  }

  componentWillUnmount() {
    this.cancelRequest.cancel("Left Page");
  }

  // componentDidUpdate(prevProps, prevState) {    
  // }


  disableButton() {
    this.setState({...this.state, canSubmit: false});
  }

  enableButton() {
    this.setState({...this.state, canSubmit: true});
  }

  submit(formattrs) {
    // console.log(formattrs)
    // return
    this.setState({ makingRequest: true });
    
    var handler;
    if (this.props.match.params.printerId) {
      handler = PrinterHandler.update(this.props.match.params.username, this.props.match.params.printerId, formattrs, {cancelToken: this.cancelRequest.token})
    } else {
      handler = PrinterHandler.create(this.props.match.params.username, formattrs, {cancelToken: this.cancelRequest.token})
    }
    handler
    .then((response) => {
      this.setState({
        makingRequest: false,
        redirect:     true,
        printerId:  response.data.data.id
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


  renderModal() {
    if (this.state.makingRequest) {
      var caption = "Adding Printer..."
      if (this.props.printer && this.props.printer.id) {
        caption = "Updating Printer"
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

  renderUUIDLabel() {
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
        <Formsy onValidSubmit={this.submit} onValid={this.enableButton} onInvalid={this.disableButton}>
            <Section>
              <br/>

              <Columns isCentered>
                <Column isSize={9}>
                  <Box>
                    <h1 className="title">{this.props.printer ? "Edit Printer" : "Add New Printer"}</h1>

                    <hr />
                  
                    <InputField 
                      label={<span>Name <small>(*required)</small></span>}
                      name="name"
                      placeholder="Name Your Printer"
                      validationError="Name is required"
                      value={this.props.printer && this.props.printer.attributes.name}
                      required
                    />
                    <InputField 
                      label="Model Name"
                      name="model"
                      placeholder="Printer Model"
                      value={this.props.printer && this.props.printer.attributes.model}
                    />
                    
                    <TextField 
                      label="Description"
                      name="description"
                      placeholder="Tell us about it"
                      value={this.props.printer && this.props.printer.attributes.description}
                    />
                  </Box>
                  <Field isGrouped>
                    <Control>
                      <Button type="submit" disabled={this.state.canSubmit == false}>Save</Button>
                    </Control>
                  </Field>
                </Column>
              </Columns>
            </Section>
          </Formsy>

        {this.renderModal()}
        

        
      </div>
    )
  }
}

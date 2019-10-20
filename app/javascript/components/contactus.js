/*
 *  account.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 05/14/19
 *  Copyright 2018 WessCope
 */

import React          from 'react';
import Formsy         from 'formsy-react'
import {UserHandler}  from '../handlers';

import { 
  Field, 
  Control, 
  Button,
  Box,
  Label,
  Columns,
  Column,
  TextArea
} from 'bloomer';
import { toast } from 'react-toastify';
import TextField from './Form/TextField';
import Modal     from './Modal';

export class ContactUs extends React.Component {
  constructor(props) {
    super(props);

    var subject = "";
    if (props.location.state && props.location.state.subject) {
      subject = props.location.state.subject
    }

    this.state = {
      contact: {
        first_name: currentUser.username,
        last_name: "",
        subject: subject,
        email:    currentUser.email,
        message: ""
      },
      success: false,
      sendingMessage:     false,
      requestError:     null,
      errors: {
        server:   [],
        first_name: "",
        last_name: "",
        subject: "",
        email:    "",
        password: ""
      }
    }
    
    this.submitAction           = this.submitAction.bind(this)
    this.nameChanged            = this.nameChanged.bind(this)
    this.lastNameChanged        = this.lastNameChanged.bind(this)
    this.emailChanged           = this.emailChanged.bind(this)
    this.subjectChanged         = this.subjectChanged.bind(this)
    this.messageChanged         = this.messageChanged.bind(this)
    // this.renderErrors           = this.renderErrors.bind(this)
    this.renderStatus           = this.renderStatus.bind(this)
    this.getErrors              = this.getErrors.bind(this)
    this.dismissError           = this.dismissError.bind(this);
  }

  getErrors() {
    return this.state.errors || {
      first_name: "",
      last_name: "",
      subject: "",
      email:    "",
      message: "",
      server:   []
    };
  }
  
  nameChanged(e) {
    this.setState({
      contact: {...this.state.contact, first_name: e.currentTarget.value || ''}
    })
  }

  lastNameChanged(e) {
    this.setState({
      contact: {...this.state.contact, last_name: e.currentTarget.value || ''}
    })
  }

  emailChanged(e) {
    this.setState({
      contact: {...this.state.contact, email: e.currentTarget.value || ''}
    })
  }

  subjectChanged(e) {
    this.setState({
      contact: {...this.state.contact, subject: e.currentTarget.value || ''}
    })
  }

  messageChanged(e) {
    this.setState({
      contact: {...this.state.contact, message: e.currentTarget.value || ''}
    })
  }

  submitAction(e) {
    e.preventDefault();

    var data = this.state.contact;

    this.setState({sendingMessage: true})

    UserHandler.contactUs(data)
    .then((response) => {
      this.setState({
        ...this.state,
        sendingMessage: false,
        success: true
      });
    })
    .catch((error) => {
      this.setState({
        ...this.state,
        sendingMessage: false,
        requestError: error
      });
    });
  }

  dismissError() {
    this.setState({
      ...this.state,
      sendingMessage: false,
      requestError: null
    });
  }

  renderSuccess() {
    return (
      <article className="message is-success">
        <div className="message-body">
          Your message has been sent.
        </div>
      </article>
    ) 
  }

  // renderErrors() {
  //   if(this.state.errors.server.length < 1) { return; }

  //   const items = this.state.errors.server.map((item, idx) => {
  //     return(
  //       <p key={idx}>{item}</p>
  //     )
  //   });

  //   return (
  //     <article className="message is-danger">
  //       <div className="message-body">
  //         {items}
  //       </div>
  //     </article>
  //   )
  // }

  renderStatus() {
    if (this.state.sendingMessage) return;
    if (this.state.success) return this.renderSuccess()
  }

  render() {

    return(
      <div className="section">
        <div className="container is-fluid">
          <Columns className="is-mobile">
            <Column>
              <h2 className="title">Contact Us</h2>
              <form style={{maxWidth: '500px'}}>
                <Box style={{border: 'none', boxShadow: 'none'}}>
                  {this.renderStatus()}

                  <br/>

                  <Field>
                    <Label>First Name</Label>
                    <input type="text" name="first_name" className="input" defaultValue={currentUser.username} onChange={this.nameChanged}/>
                  </Field>

                  <Field>
                    <Label>Last Name</Label>
                    <input type="text" name="last_name" className="input" onChange={this.lastNameChanged}/>
                  </Field>

                  <Field>
                    <Label>Email Address</Label>
                    <input type="text" name="email" className="input" defaultValue={currentUser.email} onChange={this.emailChanged}/>
                  </Field>

                  <Field>
                    <Label>Subject</Label>
                    <input type="text" name="subject" className="input" defaultValue={this.state.contact.subject} onChange={this.subjectChanged}/>
                  </Field>

                  <Field>
                    <Label>How can we help you?</Label>
                    <TextArea type="text" name="message" onChange={this.messageChanged}></TextArea>
                  </Field>

                  <br/>


                  <Field isGrouped className="is-grouped-right">
                    <Control>
                      <Button className="is-primary" onClick={this.submitAction}>Submit</Button>
                    </Control>
                  </Field>
                </Box>
              </form>
            </Column>
          </Columns>
        </div>
        <Modal 
          component={Modal.spinner} 
          caption={"Sending Message..."}
          isActive={this.state.sendingMessage }  
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

/*
 *  account.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 05/14/19
 *  Copyright 2018 WessCope
 */

import React          from 'react';
import Formsy         from 'formsy-react'
import {UserHandler}  from '../../handlers';

import { 
  Field, 
  Control, 
  Button,
  Box,
  Label
} from 'bloomer';

export class AccountSettings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: currentUser.username,
      email:    currentUser.email,
      password: {
        current:  "",
        new:      "",
        confirm:  ""
      },
      success: false,
      errors: {
        server:   [],
        username: "",
        email:    "",
        password: ""
      }
    }
    
    this.submitAction           = this.submitAction.bind(this);
    this.usernameChanged        = this.usernameChanged.bind(this);
    this.emailChanged           = this.emailChanged.bind(this);
    this.currentPasswordChanged = this.currentPasswordChanged.bind(this);
    this.newPasswordChanged     = this.newPasswordChanged.bind(this);
    this.confirmPasswordChanged = this.confirmPasswordChanged.bind(this);
    this.renderErrors           = this.renderErrors.bind(this);
    this.renderStatus           = this.renderStatus.bind(this);
    this.getErrors              = this.getErrors.bind(this);
  }

  getErrors() {
    return this.state.errors || {
      username: "",
      email:    "",
      password: "",
      server:   []
    };
  }
  usernameChanged(e) {
    this.setState({
      ...this.state,
      username: e.currentTarget.value || ''
    });
  }

  emailChanged(e) {
    this.setState({
      ...this.state,
      email: e.currentTarget.value || ''
    });
  }

  currentPasswordChanged(e) {
    this.setState({
      ...this.state,
      password: {
        ...(this.state.password || {}),
        current: e.currentTarget.value || ''
      }
    });
  }

  newPasswordChanged(e) {
    this.setState({
      ...this.state,
      password: {
        ...(this.state.password || {}),
        new: e.currentTarget.value || ''
      },
      errors: {
        ...this.getErrors(),
        password: ((e.currentTarget.value == this.state.password.confirm) ? "" : "New and confirm do not match")
      }
    });
  }

  confirmPasswordChanged(e) {
    this.setState({
      ...this.state,
      password: {
        ...(this.state.password || {}),
        confirm: e.currentTarget.value
      },
      errors: {
        ...this.getErrors(),
        password: ((e.currentTarget.value == this.state.password.new) ? "" : "New and confirm do not match")
      }
    });
  }

  submitAction(e) {
    e.preventDefault();

    if(this.state.password.new != this.state.password.confirm) {
      this.setState({
        ...this.state,
        errors: {
          ...this.getErrors(),
          password: ((e.currentTarget.value == this.state.password.new || e.currentTarget.value == "") ? "" : "Confirm and new do not match")
        }
      });
  
      return;
    }

    var data = this.state;
    delete data.errors;
    delete data.password.confirm;
    delete data.success;

    UserHandler.saveSettings(data)
    .then((response) => {
      this.setState({
        ...this.state,
        errors: this.getErrors(),
        success: true
      });
    })
    .catch((error) => {
      this.setState({
        ...this.state,
        success: false,
        errors: {
          ...this.getErrors(),
          server: error.response.data.error
        }
      })
    });
  }

  renderSuccess() {
    return (
      <article className="message is-success">
        <div className="message-body">
          Your info has been updated successfully.
        </div>
      </article>
    ) 
  }

  renderErrors() {
    if(this.state.errors.server.length < 1) { return; }

    const items = this.state.errors.server.map((item, idx) => {
      return(
        <p key={idx}>{item}</p>
      )
    });

    return (
      <article className="message is-danger">
        <div className="message-body">
          {items}
        </div>
      </article>
    )
  }

  renderStatus() {
    return this.state.success == true ?
      this.renderSuccess() : this.renderErrors();
  }

  render() {
    var errors = this.getErrors();

    return(
      <div className="tab-content" id="user-details">
        <form>
          <Box style={{border: 'none', boxShadow: 'none'}}>
            {this.renderStatus()}

            <br/>

            <Field>
              <Label>Username</Label>
              <input type="text" name="username" className="input" defaultValue={currentUser.username} onChange={this.usernameChanged}/>
            </Field>

            <Field>
              <Label>Email Address</Label>
              <input type="text" name="email" className="input" defaultValue={currentUser.email} onChange={this.emailChanged}/>
            </Field>

            <br/>
            <hr/>
            <br/>

            <Field>
              <Label>Current Password</Label>
              <input type="password" name="password[current]" className="input" placeholder="" onChange={this.currentPasswordChanged}/>
            </Field>

            <Field>
              <Label>New Password</Label>
              <input type="password" name="password[new]" className="input" placeholder="" onChange={this.newPasswordChanged}/>
              {errors.password.length > 0 && 
                <p className="help is-danger">{errors.password}</p>
              }
            </Field>

            <Field>
              <Label>Confirm New Password</Label>
              <input type="password" name="password[confirm]" className="input" placeholder="" onChange={this.confirmPasswordChanged}/>
              {errors.password.length > 0 && 
                <p className="help is-danger">{errors.password}</p>
              }
            </Field>

            <Field isGrouped className="is-grouped-right">
              <Control>
                <Button className="is-primary" onClick={this.submitAction}>Submit</Button>
              </Control>
            </Field>
          </Box>
        </form>
      </div>
    )
  }
}

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
        current:  '',
        new:      '',
        confirm:  ''
      },
      errors: {
        username: null,
        email:    null,
        password: {
          current:  null,
          confirm:  null
        }
      }
    }
    
    this.submitAction           = this.submitAction.bind(this);
    this.usernameChanged        = this.usernameChanged.bind(this);
    this.emailChanged           = this.emailChanged.bind(this);
    this.currentPasswordChanged = this.currentPasswordChanged.bind(this);
    this.newPasswordChanged     = this.newPasswordChanged.bind(this);
    this.confirmPasswordChanged = this.confirmPasswordChanged.bind(this);
  }

  usernameChanged(e) {
    this.setState({
      ...this.state,
      username: e.currentTarget.value
    });
  }

  emailChanged(e) {
    this.setState({
      ...this.state,
      email: e.currentTarget.value
    });
  }

  currentPasswordChanged(e) {
    this.setState({
      ...this.state,
      password: {
        ...this.state.password,
        current: e.currentTarget.value
      }
    });
  }

  newPasswordChanged(e) {
    this.setState({
      ...this.state,
      password: {
        ...this.state.password,
        new: e.currentTarget.value
      },
      errors: {
        ...this.state.errors,
        password: {
          ...this.state.errors.password,
          confirm: ((e.currentTarget.value == this.state.password.confirm || e.currentTarget.value == "") ? null : "New and confirm do not match")
        }
      }
    });
  }

  confirmPasswordChanged(e) {
    this.setState({
      ...this.state,
      password: {
        ...this.state.password,
        confirm: e.currentTarget.value
      },
      errors: {
        ...this.state.errors,
        password: {
          ...this.state.errors.password,
          confirm: ((e.currentTarget.value == this.state.password.new || e.currentTarget.value == "") ? null : "Confirm and new do not match")
        }
      }
    });
  }

  submitAction(e) {
    e.preventDefault();

    if(this.state.password.new != this.state.password.confirm) {
      this.setState({
        ...this.state,
        errors: {
          ...this.state.errors,
          password: {
            ...this.state.errors.password,
            confirm: ((e.currentTarget.value == this.state.password.new || e.currentTarget.value == "") ? null : "Confirm and new do not match")
          }
        }
      });
  
      return;
    }

    var data = this.state;
    delete data.errors;
    delete data.password.confirm;

    UserHandler.saveSettings(data)
    .then((response) => {
      console.dir(response);
    })
    .catch((error) => {
      console.log(error);
    });
    
  }

  render() {
    return(
      <div className="tab-content" id="user-details">
        <Formsy onValidSubmit={this.submitAction}>
        </Formsy>
        <form>
          <Box style={{border: 'none', boxShadow: 'none'}}>
            <br/>

            <Field>
              <Label>Username</Label>
              <input type="text" name="username" className="input" defaultValue={currentUser.username} onChange={this.usernameChanged}/>
              {this.state.errors.username && 
                <p className="help is-danger">{this.state.errors.username}</p>
              }
            </Field>

            <Field>
              <Label>Email Address</Label>
              <input type="text" name="email" className="input" defaultValue={currentUser.email} onChange={this.emailChanged}/>
              {this.state.errors.email && 
                <p className="help is-danger">{this.state.errors.email}</p>
              }
            </Field>

            <hr/>
            <br/>

            <h2 className="title is-6">Security.</h2>

            <Field>
              <Label>Current Password</Label>
              <input type="password" name="password[current]" className="input" placeholder="" onChange={this.currentPasswordChanged}/>
            </Field>

            <Field>
              <Label>New Password</Label>
              <input type="password" name="password[new]" className="input" placeholder="" onChange={this.newPasswordChanged}/>
              {this.state.errors.password.confirm && 
                <p className="help is-danger">{this.state.errors.password.confirm}</p>
              }
            </Field>

            <Field>
              <Label>Confirm New Password</Label>
              <input type="password" name="password[confirm]" className="input" placeholder="" onChange={this.confirmPasswordChanged}/>
              {this.state.errors.password.confirm && 
                <p className="help is-danger">{this.state.errors.password.confirm}</p>
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

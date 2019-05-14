/*
 *  account.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 05/14/19
 *  Copyright 2018 WessCope
 */

import React from 'react';
import { 
  Field, 
  Control, 
  Button,
  Box
} from 'bloomer';
import { Container } from 'bloomer/lib/layout/Container';
import { Label } from 'bloomer/lib/elements/Form/Label';

export class AccountSettings extends React.Component {
  render() {
    return(
      <div className="tab-content" id="user-details">
        <form>
          <Box style={{border: 'none', boxShadow: 'none'}}>
            <br/>

            <h2 className="title is-6">Information.</h2>

            <Field>
            <Label>Username</Label>
              <input type="text" className="input" placeholder={`Change username from ${currentUser.username}`}/>
            </Field>

            <Field>
              <Label>Email Address</Label>
              <input type="text" className="input" placeholder={`Update email from ${currentUser.email}`}/>
            </Field>

            <hr/>
            <br/>

            <h2 className="title is-6">Security.</h2>

            <Field>
              <Label>Current Password</Label>
              <input type="text" className="input" placeholder=""/>
            </Field>

            <Field>
              <Label>New Password</Label>
              <input type="text" className="input" placeholder=""/>
            </Field>

            <Field>
              <Label>Confirm New Password</Label>
              <input type="text" className="input" placeholder=""/>
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

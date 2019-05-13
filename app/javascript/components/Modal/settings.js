/*
 *  settings.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 05/13/19
 *  Copyright 2018 WessCope
 */

import React from 'react';
import { Box } from 'bloomer/lib/elements/Box';
import { Modal } from 'bloomer/lib/components/Modal/Modal';
import { Tabs } from 'bloomer/lib/components/Tabs/Tabs';
import { Container } from 'bloomer/lib/layout/Container';
import { Field } from 'bloomer/lib/elements/Form/Field/Field';
import { Label } from 'bloomer/lib/elements/Form/Label';
import { Control } from 'bloomer/lib/elements/Form/Control';
import { Button } from 'bloomer/lib/elements/Button';

export default class SettingsModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = { activeTab: 0 }

    this.tabAction    = this.tabAction.bind(this)
    this.submitAction = this.submitAction.bind(this)
  }

  tabAction(e) {
    e.preventDefault();

    $('.tab-handle').removeClass('is-active');
    $(e.currentTarget).parent('.tab-handle').addClass('is-active');
    $('.tab-content').hide();
    $($(e.currentTarget).attr('data-tab')).show();
  }

  submitAction(e) {
    e.preventDefault();

  }

  render() {
    return (
      <div>
        <Tabs isBoxed style={{margin: 0}}>
          <ul>
            <li className="tab-handle is-active">
              <a onClick={this.tabAction} data-tab="#user-details">
                <span className="icon is-small"><i className="fas fa-user" aria-hidden="true"></i></span>
                <span>User Details</span>
              </a>
            </li>

            <li className="tab-handle">
              <a data-tab="#other" className="has-text-grey-lighter">
                <span className="icon is-small"><i className="fas fa-user" aria-hidden="true"></i></span>
                <span>Billing</span>
              </a>
            </li>
          </ul>
        </Tabs>

        <div style={{border: '1px solid #e0e0e0', borderTop: 'none'}}>
          <Box style={{border: 'none', boxShadow: 'none'}}>
            <div className="tab-content" id="user-details">
              <form>
                <Field>
                  <input type="text" className="input" placeholder="Enter current password."/>
                </Field>

                <Field>
                  <input type="text" className="input" placeholder="Enter new password."/>
                </Field>

                <Field>
                  <input type="text" className="input" placeholder="Confirm new password."/>
                </Field>

                <Field isGrouped className="is-grouped-right">
                  <Control>
                    <Button className="is-primary" onClick={this.submitAction}>Submit</Button>
                  </Control>

                  <Control>
                    <Button className="is-light" onClick={this.props.dismissAction}>Cancel</Button>
                  </Control>
                </Field>
              </form>
            </div>

            <div className="tab-content" id="other" hidden={true}>
              Other
            </div>
          </Box>
        </div>
      </div>
    )
  }
}

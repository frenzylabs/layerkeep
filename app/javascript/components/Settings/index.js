/*
 *  settings.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 05/13/19
 *  Copyright 2018 WessCope
 */

import React          from 'react';
import { Switch, Route, NavLink } from "react-router-dom";
import { Container }  from 'bloomer/lib/layout/Container';
import { 
  Box, 
  Tabs, 
} from 'bloomer';

import { AccountSettings } from './account';
import { Billing } from './billing/index'

export class Settings extends React.Component {
  constructor(props) {
    super(props);

    this.state = { activeTab: 0, curLocation: {} }

    this.tabAction    = this.tabAction.bind(this)
    this.submitAction = this.submitAction.bind(this)
    
  }

  tabAction(e) {
    e.preventDefault();
    console.log($(e.currentTarget));
    $('.tab-handle').removeClass('is-active');
    $(e.currentTarget).parent('.tab-handle').addClass('is-active');
    $('.tab-content').hide();
    $($(e.currentTarget).attr('data-tab')).show();
  }

  submitAction(e) {
    e.preventDefault();

  }

  render() {
    console.log("settings props", this.props);
    
    return (
      <div className="section">
        <Container className="is-fluid">
          <Tabs isBoxed style={{margin: 0}}>
            <ul>
              <li className="tab-handle ">
                <NavLink activeClassName="is-active" to={`/${this.props.match.params.username}/settings/account`} className="link has-text-grey-lighter">
                  <span className="icon is-small"><i className="fas fa-user" aria-hidden="true"></i></span>
                  Account
                </NavLink>
              </li>

              <li className="tab-handle">
                <NavLink activeClassName="is-active" to={`/${this.props.match.params.username}/settings/billing`} className="link has-text-grey-lighter">
                  <span className="icon is-small"><i className="fas fa-user" aria-hidden="true"></i></span>
                  Billing
                </NavLink>
    
              </li>
            </ul>
          </Tabs>

          <div style={{border: '1px solid #e0e0e0', borderTop: 'none'}}>
            <Box style={{border: 'none', boxShadow: 'none'}}>
              {this.state.curLocation ?
                <Switch >
                  <Route path={`${this.props.match.url}/account`} render={ props =>
                    <AccountSettings {...props} {...this.props} /> 
                  }/>
                  <Route path={`${this.props.match.url}/billing`} render={ props =>
                    <Billing {...props}  {...this.props}/> 
                  }/>
                </Switch> : "" }
            </Box>
          </div>
        </Container>
      </div>
    )
  }
}

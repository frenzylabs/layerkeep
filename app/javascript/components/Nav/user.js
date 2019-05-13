/*
 *  user.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 04/24/19
 *  Copyright 2018 WessCope
 */

import React              from 'react';
import { NavbarItem }     from 'bloomer/lib/components/Navbar/NavbarItem';
import { NavbarLink }     from 'bloomer/lib/components/Navbar/NavbarLink';
import { Icon }           from 'bloomer/lib/elements/Icon';
import { NavbarDropdown } from 'bloomer/lib/components/Navbar/NavbarDropdown';
import { NavbarDivider }  from 'bloomer/lib/components/Navbar/NavbarDivider';
import Modal from '../Modal';


export class UserNavMenu extends React.Component {
  constructor(props) {
    super(props);

    this.state = { isSettingsActive: false }

    this.settingsAction = this.settingsAction.bind(this);
    this.dismissAction  = this.dismissAction.bind(this);
  }

  settingsAction(e) {
    e.preventDefault();

    this.setState({
      ...this.state,
      isSettingsActive : true
    });
  }

  dismissAction(e) {
    e.preventDefault();

    this.setState({
      ...this.state,
      isSettingsActive: false
    });
  }

  render() {
    return(
      <NavbarItem hasDropdown isHoverable>
        <NavbarLink href="#">
          <Icon isSize="small" className="far fa-robot" />
        </NavbarLink>

        <NavbarDropdown isBoxed className="is-right">
          {/*<NavbarItem href="#">Profile</NavbarItem><NavbarItem href="#">Stars</NavbarItem>*/}
          <NavbarItem href="#" onClick={this.settingsAction}>Settings</NavbarItem>

          <NavbarDivider />

          <NavbarItem href="#">Sign out.</NavbarItem>
        </NavbarDropdown>

        <Modal component={Modal.settings} isActive={this.state.isSettingsActive} dismissAction={this.dismissAction} />
      </NavbarItem>
    );
  }
}

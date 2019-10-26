/*
 *  user.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 04/24/19
 *  Copyright 2018 WessCope
 */

import React              from 'react';
import { Link }           from 'react-router-dom';
import { NavbarStart, NavbarItem }     from 'bloomer';
import { NavbarLink }     from 'bloomer/lib/components/Navbar/NavbarLink';
import { Icon }           from 'bloomer/lib/elements/Icon';
import { NavbarDropdown } from 'bloomer/lib/components/Navbar/NavbarDropdown';
import { NavbarDivider }  from 'bloomer/lib/components/Navbar/NavbarDivider';

export class UserNavMenu extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
        <NavbarItem hasDropdown isHoverable >
          <NavbarLink href="#"  className="is-hidden-touch is-flex-desktop">
            <Icon isSize="small" className="far fa-robot" />
          </NavbarLink>

          <NavbarDropdown isBoxed className="is-right">
            {/*<NavbarItem href="#">Profile</NavbarItem><NavbarItem href="#">Stars</NavbarItem>*/}

            <NavbarItem >
              <p>{currentUser.username}</p>              
            </NavbarItem>

            <NavbarDivider className="is-visible" />            
            <NavbarItem className="is-hidden-desktop">
              <Link to={`/${currentUser.username}/projects/`} className="navbar-item is-hidden-desktop">Projects</Link>
            </NavbarItem>
            <NavbarItem className="is-hidden-desktop">
              <Link to={`/${currentUser.username}/profiles/`} className="navbar-item is-hidden-desktop">Profiles</Link>
            </NavbarItem>
            <NavbarItem className="is-hidden-desktop">
              <Link to={`/${currentUser.username}/slices`} className="navbar-item is-hidden-desktop">Slices</Link>
            </NavbarItem>
            <NavbarItem className="is-hidden-desktop">
              <Link to={`/${currentUser.username}/printers`} className="navbar-item is-hidden-desktop">Printers</Link>
            </NavbarItem>
            <NavbarItem className="is-hidden-desktop">
              <Link to={`/${currentUser.username}/prints`} className="navbar-item is-hidden-desktop">Prints</Link>
            </NavbarItem>

            <NavbarItem >
              <Link to={`/${currentUser.username}/settings/account`}> Settings </Link>
            </NavbarItem>

            <NavbarDivider />

            <NavbarItem href="/users/sign_out">Sign out.</NavbarItem>
          </NavbarDropdown>
        </NavbarItem>
    );
  }
}

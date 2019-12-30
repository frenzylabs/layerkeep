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

  renderSignUpNav() {
    return (
      <NavbarDropdown isBoxed className="is-right">
            {/*<NavbarItem href="#">Profile</NavbarItem><NavbarItem href="#">Stars</NavbarItem>*/}

            <NavbarItem href="/users/sign_in">Sign In</NavbarItem>            
          </NavbarDropdown>
    )
  }

  renderTools() {
    return (
        <NavbarItem hasDropdown isHoverable className="is-hidden-desktop">
          <NavbarDivider />
          <p>Tools</p>
          <NavbarItem className="is-right">
            <a href="https://pluck.io" className="navbar-item">Pluck &nbsp;<small> (find 3D models)</small></a>
            {currentUser.id ?
              <Link to={`/${currentUser.username}/slices/create`} className="navbar-item">Slicer &nbsp;<sup><small>alpha</small></sup></Link>
            : 
            <a href="/users/sign_up" className="navbar-item">Slicer &nbsp;<sup><small>alpha</small></sup></a>
            }
          </NavbarItem>
          
        </NavbarItem>
    )
  }

  renderViewingUser() {
    if (this.props.username != currentUser.username) {
      return (
        <NavbarItem className="is-hidden-desktop">
             <p>Viewing: {this.props.username}</p>
        </NavbarItem>
      )
    }
  }
  renderSignedInNav() {
    return (
          <NavbarDropdown isBoxed className="is-right">
            {/*<NavbarItem href="#">Profile</NavbarItem><NavbarItem href="#">Stars</NavbarItem>*/}

            <NavbarItem >
              Logged In As:
              <Link to={`/${currentUser.username}/projects`} className="navbar-item">{currentUser.username}</Link>
            </NavbarItem>

            <NavbarDivider className="is-visible is-hidden-desktop" />   
            {this.renderViewingUser()}         
            <NavbarItem className="is-hidden-desktop">
              <Link to={`/${this.props.username}/projects`} className="navbar-item is-hidden-desktop">Projects</Link>
            </NavbarItem>
            <NavbarItem className="is-hidden-desktop">
              <Link to={`/${this.props.username}/profiles`} className="navbar-item is-hidden-desktop">Profiles</Link>
            </NavbarItem>
            <NavbarItem className="is-hidden-desktop">
              <Link to={`/${this.props.username}/slices`} className="navbar-item is-hidden-desktop">Slices</Link>
            </NavbarItem>
            <NavbarItem className="is-hidden-desktop">
              <Link to={`/${this.props.username}/printers`} className="navbar-item is-hidden-desktop">Printers</Link>
            </NavbarItem>
            <NavbarItem className="is-hidden-desktop">
              <Link to={`/${this.props.username}/prints`} className="navbar-item is-hidden-desktop">Prints</Link>
            </NavbarItem>

            

            {this.renderTools()}
            <NavbarDivider />

            <NavbarItem >
              <Link to={`/${currentUser.username}/settings/account`}> Settings </Link>
            </NavbarItem>

            <NavbarDivider />

            <NavbarItem href="/users/sign_out">Sign out.</NavbarItem>
          </NavbarDropdown>
    )
  }

  renderNavMenu() {
    if (currentUser.id) {
      return this.renderSignedInNav()
    } else {
      return this.renderSignUpNav()
    }
  }

  render() {
    return(
        <NavbarItem hasDropdown isHoverable >
          <NavbarLink href="#"  className="is-hidden-touch is-flex-desktop">
            <Icon isSize="small" className="far fa-robot" />
          </NavbarLink>
          {this.renderNavMenu()}
          
        </NavbarItem>
    );
  }
}

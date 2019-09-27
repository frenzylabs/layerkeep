/*
 *  index.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 04/24/19
 *  Copyright 2018 WessCope
 */

import React    from 'react';
import { Link } from 'react-router-dom';

import { UserNavMenu }  from './user';
import { Navbar, NavbarBurger, NavbarItem }       from 'bloomer';
import { NavbarStart }  from 'bloomer/lib/components/Navbar/NavbarStart';
import { NavbarBrand }  from 'bloomer/lib/components/Navbar/NavbarBrand';
import { NavbarEnd }    from 'bloomer/lib/components/Navbar/NavbarEnd';
import { NavbarMenu }   from 'bloomer/lib/components/Navbar/NavbarMenu';

export class Nav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isActive: false}
    this.onClickNav = this.onClickNav.bind(this);
  }

  onClickNav(e) {
    this.setState( {isActive: !this.state.isActive})
  }

  render() {
    return(
      <Navbar className="is-fixed-top is-light is-flex" style={{justifyContent: "space-between", borderBottom: '1px solid #d3d3d3'}}>
        
        <NavbarBrand >          
          <Link to={`/${currentUser.username}/projects/`} className="navbar-logo navbar-item">LayerKeep</Link>
          <Link to={`/${currentUser.username}/projects/`} className="navbar-item is-hidden-desktop">Projects</Link>
          <NavbarBurger isActive={this.state.isActive} onClick={this.onClickNav} />
        </NavbarBrand>
          
        

        <NavbarMenu className="" style={{overflow: 'unset'}} isActive={this.state.isActive}  onClick={this.onClickNav}>
          <NavbarStart className="is-hidden-touch is-flex-desktop">
            <Link to={`/${currentUser.username}/profiles/`} className="navbar-item">Profiles</Link>
            <Link to={`/${currentUser.username}/projects/`} className="navbar-item">Projects</Link>
            <Link to={`/${currentUser.username}/slices`} className="navbar-item">Slices</Link>
            <Link to={`/${currentUser.username}/prints`} className="navbar-item">Prints</Link>
          </NavbarStart>
          <NavbarEnd>
            <UserNavMenu />            
            </NavbarEnd>
          </NavbarMenu>
        
      </Navbar>
    );
  }
}

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
import { Navbar, NavbarBurger, NavbarItem, NavbarLink, NavbarDropdown }       from 'bloomer';
import { NavbarStart }  from 'bloomer/lib/components/Navbar/NavbarStart';
import { NavbarBrand }  from 'bloomer/lib/components/Navbar/NavbarBrand';
import { NavbarEnd }    from 'bloomer/lib/components/Navbar/NavbarEnd';
import { NavbarMenu }   from 'bloomer/lib/components/Navbar/NavbarMenu';

import logo from 'images/layerkeep.svg'

export class Nav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isActive: false, isToolActive: false}
    this.onClickNav = this.onClickNav.bind(this);
    this.onToolClickNav = this.onToolClickNav.bind(this);
  }

  onClickNav(e) {
    this.setState( {isActive: !this.state.isActive})
  }

  onToolClickNav(e) {
    this.setState( {isToolActive: !this.state.isToolActive})
  }

  renderToolItems() {
    return (
      <NavbarDropdown isBoxed={true} className="is-right">
            <a href="https://pluck.io" target="_blank" className="navbar-item">Pluck &nbsp;<small> (find 3D models)</small></a>
            {currentUser.id ?
              <Link to={`/${currentUser.username}/slices/create`} className="navbar-item">Slicer &nbsp;<sup><small>alpha</small></sup></Link>
            : 
            <a href="/users/sign_up" className="navbar-item">Slicer &nbsp;<sup><small>alpha</small></sup></a>
            }
          </NavbarDropdown>
    )
  }

  renderTools() {
    return (
        <NavbarItem hasDropdown isHoverable >
          <NavbarLink href="#"  className="">
            Tools
          </NavbarLink>
          {this.renderToolItems()}
          
        </NavbarItem>
    )
  }

  renderSignedInNav() {
    return(
      <Navbar className="is-fixed-top is-light is-flex" style={{justifyContent: "space-between", borderBottom: '1px solid #d3d3d3'}}>
        
        <NavbarBrand style={{flex: "inherit"}}>
          <Link to={`/${currentUser.username}/projects/`} className="navbar-logo navbar-item">
            <img width='30px' src={logo}/> LayerKeep
          </Link>
          <Link to={`/${currentUser.username}/projects/`} className="navbar-item is-hidden-desktop">Projects</Link>
          <NavbarBurger isActive={this.state.isActive} onClick={this.onClickNav} />
        </NavbarBrand>

        <NavbarMenu className="" style={{overflow: 'unset'}} isActive={this.state.isActive}  onClick={this.onClickNav}>
          <NavbarStart className="is-hidden-touch is-flex-desktop">
            <Link to={`/${currentUser.username}/projects/`} className="navbar-item">Projects</Link>
            <Link to={`/${currentUser.username}/profiles/`} className="navbar-item">Profiles</Link>
            <Link to={`/${currentUser.username}/slices`} className="navbar-item">Slices</Link>
            <Link to={`/${currentUser.username}/printers`} className="navbar-item">Printers</Link>
            <Link to={`/${currentUser.username}/prints`} className="navbar-item">Prints</Link>
            {this.renderTools()}
            
          </NavbarStart>
          <NavbarEnd>
            <UserNavMenu />            
          </NavbarEnd>
        </NavbarMenu>  
      </Navbar>
    );
  }

  renderSignUpNav() {
    return(
      <Navbar className="is-fixed-top is-light is-flex" style={{justifyContent: "space-between", borderBottom: '1px solid #d3d3d3'}}>
        
        <NavbarBrand style={{flex: "inherit"}}>
          <a href="/" className="navbar-logo navbar-item">
            <img width='30px' src={logo}/> LayerKeep
          </a>
          
          <NavbarLink href="#"  isActive={this.state.isToolActive}  onClick={this.onToolClickNav} className="navbar-item is-hidden-desktop">Tools</NavbarLink>
          
          <div className="navbar-item is-right is-hidden-desktop" style={{marginLeft: 'auto'}}>
              <a href="/users/sign_in" className="nav-option super">Jump in</a>
            </div>
        </NavbarBrand>

        <NavbarMenu className="" style={{overflow: 'unset'}} isActive={this.state.isToolActive} onClick={this.onToolClickNav}>
          <NavbarStart className="is-hidden-touch is-flex-desktop">
            {this.renderTools()}
            
          </NavbarStart>
          <NavbarEnd>
            <div className="navbar-item is-hidden-touch">
              <a href="/users/sign_in" className="nav-option super">Jump in</a>
            </div>
            {this.renderToolItems()}
          </NavbarEnd>
        </NavbarMenu>  
      </Navbar>
    );
  }

  renderNavMenu() {
    if (currentUser.id) {
      return this.renderSignedInNav()
    } else {
      return this.renderSignUpNav()
    }
  }

  render() {
    return this.renderNavMenu()    
  }
}

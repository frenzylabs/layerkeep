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
import { Navbar }       from 'bloomer/lib/components/Navbar/Navbar';
import { NavbarStart }  from 'bloomer/lib/components/Navbar/NavbarStart';
import { NavbarBrand }  from 'bloomer/lib/components/Navbar/NavbarBrand';
import { NavbarEnd }    from 'bloomer/lib/components/Navbar/NavbarEnd';
import { NavbarMenu }   from 'bloomer/lib/components/Navbar/NavbarMenu';

export class Nav extends React.Component {
  render() {
    return(
      <Navbar className="is-fixed-top is-light">
        <NavbarStart>
          <NavbarBrand>
            <Link to="/user" className="navbar-item">LayerKeep</Link>
          </NavbarBrand>
          
          <Link to="/profiles" className="navbar-item">Profiles</Link>
          <Link to="/projects" className="navbar-item">Projects</Link>
        </NavbarStart>

        <NavbarEnd>
          <NavbarMenu>
            <UserNavMenu />
          </NavbarMenu>
        </NavbarEnd>
      </Navbar>
    );
  }
}

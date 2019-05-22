/*
 *  ProfilesPanel.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 04/24/19
 *  Copyright 2018 WessCope
 */

import React              from 'react';
import { connect }        from 'react-redux';
import { Link }           from 'react-router-dom';
import { toast }          from 'react-toastify';
import { ProfileHandler } from '../../handlers';

import { 
  Columns, 
  Column, 
  Panel, 
  PanelHeading, 
  PanelBlock, 
  PanelIcon
} from 'bloomer';

class _ProfilesPanel extends React.Component {
  constructor(props) {
    super(props);
    

    this.state = {profiles: []}

    var self = this
    ProfileHandler.list({params: {page: 1, per_page: 2}})
    .then((response) => {
      self.setState({ profiles: response.data.data})
    })
    .catch((error) => {
      console.log(error);
    });
  }

  profileItems() {
    return this.state.profiles.map((profile, index) => {
      return (
        <PanelBlock key={'profile-' + profile.id}>
          <PanelIcon className={"far " + ( profile.attributes.is_private ? 'fa-lock' : 'fa-layer-group' )}/>
          <a href={"/" + profile.attributes.path}>{profile.attributes.name}</a>
        </PanelBlock>  
      )
    });
  }

  render() {
    return (
      <Panel id="profiles-panel">
        <PanelHeading tag='div'>        
          <Columns>
            <Column isSize={8}>
              <p>Profiles</p>
            </Column>

            <Column>
              <Link to={`/${currentUser.username}/profiles/new`} className="button is-small is-success">New</Link>
            </Column>
          </Columns>
        </PanelHeading>

        {this.profileItems()}
      </Panel>
    );
  }
}

export const ProfilesPanel = connect()(_ProfilesPanel);

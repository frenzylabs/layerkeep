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

    this.cancelRequest = ProfileHandler.cancelSource();
    this.getProfiles   = this.getProfiles.bind(this)
  }
  componentDidMount() {
    this.getProfiles()
  }

  componentWillUnmount() {
    this.cancelRequest.cancel("Left Profiles Panel");
  }

  getProfiles() {
    ProfileHandler.list(this.props.username || currentUser.username, {params: {page: 1, per_page: 5}, cancelToken: this.cancelRequest.token})
    .then((response) => {
      this.setState({ profiles: response.data.data})
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
          <Link to={"/" + profile.attributes.path}>{profile.attributes.name}</Link>
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
              <p style={{marginRight: '4px'}}>Profiles</p>
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

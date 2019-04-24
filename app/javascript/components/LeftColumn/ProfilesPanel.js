/*
 *  ProfilesPanel.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 04/24/19
 *  Copyright 2018 WessCope
 */

import React    from 'react';
import { Panel } from 'bloomer/lib/components/Panel/Panel';
import { PanelHeading } from 'bloomer/lib/components/Panel/PanelHeading';
import { Column } from 'bloomer/lib/grid/Column';
import { Columns } from 'bloomer/lib/grid/Columns';
import { Button } from 'bloomer/lib/elements/Button';
import { PanelBlock } from 'bloomer/lib/components/Panel/PanelBlock';
import { PanelIcon } from 'bloomer/lib/components/Panel/PanelIcon';

export class ProfilesPanel extends React.Component {
  constructor(props) {
    super(props);
    
    this.profiles = ["this", "that", "other", "and", "so", "it", "goes"];
  }

  profileItems() {
    return this.profiles.map((value, index) => {
      return (
        <PanelBlock key={'profile-' + value}>
          <PanelIcon className="far fa-cubes"/>
          {value}
        </PanelBlock>  
      )
    });
  }

  render() {
    return (
      <Panel id="profiles-panel">
        <PanelHeading tag='div'>        
          <Columns>
            <Column isSize={9}>
              <p>Profiles</p>
            </Column>

            <Column>
              <Button id="new-profile-button" isSize='small' isColor='success'>New</Button>
            </Column>
          </Columns>
        </PanelHeading>

        {this.profileItems()}
      </Panel>
    );
  }
}

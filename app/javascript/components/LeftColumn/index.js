/*
 *  index.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 04/24/19
 *  Copyright 2018 WessCope
 */

import React    from 'react';
import { Section } from 'bloomer/lib/layout/Section';
import { ProfilesPanel } from './ProfilesPanel';
import { ProjectsPanel } from './ProjectsPanel';

export class LeftColumn extends React.Component {

  render() {
    return (
      <div id="left-column">
        <Section>
          <ProjectsPanel username={this.props.username} />
        </Section>

        <hr />

        <Section>
          <ProfilesPanel username={this.props.username}  />
        </Section>
      </div>
    )
  }
}

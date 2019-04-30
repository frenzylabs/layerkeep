/*
 *  ProjectsPanel.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 04/24/19
 *  Copyright 2018 WessCope
 */

import React            from 'react';
import { Link }         from 'react-router-dom';
import { Panel }        from 'bloomer/lib/components/Panel/Panel';
import { PanelHeading } from 'bloomer/lib/components/Panel/PanelHeading';
import { Column }       from 'bloomer/lib/grid/Column';
import { Columns }      from 'bloomer/lib/grid/Columns';
import { PanelBlock }   from 'bloomer/lib/components/Panel/PanelBlock';
import { PanelIcon }    from 'bloomer/lib/components/Panel/PanelIcon';

export class ProjectsPanel extends React.Component {
  constructor(props) {
    super(props);
    
    this.projects = ["this", "that", "other", "and", "so", "it", "goes"];
  }

  projectItems() {
    return this.projects.map((value, index) => {
      return (
        <PanelBlock key={'project-' + value}>
          <PanelIcon className={"far " + (index % 2 == 0 ? 'fa-layer-group' : 'fa-lock')}/>
          {value}
        </PanelBlock>  
      )
    });
  }

  render() {
    return (
      <Panel id="projects-panel">
        <PanelHeading tag='div'>        
          <Columns>
            <Column isSize={9}>
              <p>Projects</p>
            </Column>

            <Column>
              <Link to="/projects/new" className="button is-small is-success">New</Link>
            </Column>
          </Columns>
        </PanelHeading>

        { this.projectItems() }
      </Panel>
    );
  }
}

/*
 *  ProjectsPanel.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 04/24/19
 *  Copyright 2018 WessCope
 */

import React            from 'react';
import { connect }      from 'react-redux';
import { Link }         from 'react-router-dom';
import { Panel }        from 'bloomer/lib/components/Panel/Panel';
import { PanelHeading } from 'bloomer/lib/components/Panel/PanelHeading';
import { Column }       from 'bloomer/lib/grid/Column';
import { Columns }      from 'bloomer/lib/grid/Columns';
import { PanelBlock }   from 'bloomer/lib/components/Panel/PanelBlock';
import { PanelIcon }    from 'bloomer/lib/components/Panel/PanelIcon';
import { ProjectHandler } from '../../handlers/project_handler';

export class ProjectsPanel extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {projects: []}

    var self = this
    ProjectHandler.list({params: {page: 1, per_page: 2}})
    .then((response) => {
      self.setState({ projects: response.data.data})
    })
    .catch((error) => {
      console.log(error);
    });
  }

  projectItems() {
    return this.state.projects.map((project, index) => {
      return (
        <PanelBlock key={'project-' + project.id}>
          <PanelIcon className={"far " + ( project.attributes.is_private ? 'fa-lock' : 'fa-layer-group' )}/>
          <a href={"/" + project.attributes.path}>{project.attributes.name}</a>
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

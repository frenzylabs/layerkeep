/*
 *  ProjectsPanel.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 04/24/19
 *  Copyright 2018 WessCope
 */

import React              from 'react';
import { Link }           from 'react-router-dom';
import { Panel }          from 'bloomer/lib/components/Panel/Panel';
import { PanelHeading }   from 'bloomer/lib/components/Panel/PanelHeading';
import { Column }         from 'bloomer/lib/grid/Column';
import { Columns }        from 'bloomer/lib/grid/Columns';
import { PanelBlock }     from 'bloomer/lib/components/Panel/PanelBlock';
import { PanelIcon }      from 'bloomer/lib/components/Panel/PanelIcon';
import { ProjectHandler } from '../../handlers';

export class ProjectsPanel extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {projects: []}

    this.cancelRequest = ProjectHandler.cancelSource();
    this.getProjects   = this.getProjects.bind(this)
  }

  componentDidMount() {
    this.getProjects()
  }

  componentWillUnmount() {
    this.cancelRequest.cancel("Left Project Panel");
  }

  getProjects() {
    ProjectHandler.list(this.props.username || currentUser.username, {params: {page: 1, per_page: 5}, cancelToken: this.cancelRequest.token})
    .then((response) => {
      this.setState({ projects: response.data.data})
    })
    .catch((error) => {
      console.log(error);
    });
  }

  componentDidUpdate(prevProps, prevState) {

  }

  projectItems() {
    return this.state.projects.map((project, index) => {
      return (
        <PanelBlock key={'project-' + project.id}>
          <PanelIcon className={"far " + ( project.attributes.is_private ? 'fa-lock' : 'fa-layer-group' )}/>
          <Link to={"/" + project.attributes.path}>{project.attributes.name}</Link>
        </PanelBlock>  
      )
    });
  }

  render() {
    return (
      <Panel id="projects-panel">
        <PanelHeading tag='div'>        
          <Columns>
            <Column isSize={8}>
              <p>Projects</p>
            </Column>

            <Column>
            <Link to={`/${currentUser.username}/projects/new`} className="button is-small is-success">New</Link>
            </Column>
          </Columns>
        </PanelHeading>

        { this.projectItems() }
      </Panel>
    );
  }
}

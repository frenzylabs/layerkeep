/*
 *  details.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 04/30/19
 *  Copyright 2018 WessCope
 */

import React from 'react';
import { connect } from 'react-redux';
import { RepoDetails } from '../Repo/details';
import { Container } from 'bloomer/lib/layout/Container';
import { Breadcrumb } from 'bloomer/lib/components/Breadcrumb/Breadcrumb';
import { BreadcrumbItem } from 'bloomer/lib/components/Breadcrumb/BreadcrumbItem';
import { ProjectHandler } from '../../handlers/project_handler';
import { ProjectAction }  from '../../states/project';

class Details extends React.Component {
  constructor(props) {
    super(props);

    this.loadProjectDetails()
  }

  loadProjectDetails() {    
    ProjectHandler.get(this.props.match.params.name)
    .then((response) => {
        this.props.dispatch(ProjectAction.view(response.data))
    })
    .catch((error) => {
      console.log(error);
    });
  }


  // componentDidUpdate(prevProps) {
  //   console.log("PROPS DID CHANGE");
  //   console.log(prevProps);
  //   console.log(this.props);
  // }
  
  // shouldComponentUpdate(nextProps, nextState) {
  //     console.log("Should comp update");
  //     const differentList = this.props.list !== nextProps.list;
  //     return differentList;
  // }

  render() {
    return (
      <div className="section">
      <Container className="is-fluid">
        <Breadcrumb>
          <ul>
            <BreadcrumbItem className="title is-4">
              <a href={"/" + this.props.match.params.username + "/projects" }>Projects</a>
            </BreadcrumbItem>

            <BreadcrumbItem className="title is-4" >
              <a href={"/" + this.props.match.params.username + "/projects/" + this.props.project.name }>{this.props.project.name}</a>
            </BreadcrumbItem>
          </ul>
        </Breadcrumb>
      </Container>
      
      <hr/>
      <br/>

      <Container className="is-fluid">
        <RepoDetails kind="projects" item={this.props.project} match={this.props.match} />
      </Container>
      </div>
    )
  }   
}

const mapStateToProps = (state) => {
  // console.dir(state);
  return {
    project: state.project.project
  }
}

export const ProjectDetails = connect(mapStateToProps)(Details);
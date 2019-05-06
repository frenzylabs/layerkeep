/*
 *  list.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 04/26/19
 *  Copyright 2018 WessCope
 */

import React from 'react';
import { connect } from 'react-redux';

import { Container, Breadcrumb, BreadcrumbItem }    from 'bloomer';
import { RepoList }       from '../Repo/list';
import { ProjectHandler } from '../../handlers/project_handler';
import { ProjectAction }  from '../../states/project';
import PaginatedList      from '../pagination';

export class ProjectList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {page: 1, perPage: 20, list: {data: [], meta: {}}}
    this.fetchProjects()
    this.onChangePage = this.onChangePage.bind(this);

  }

  fetchProjects() {
    ProjectHandler.list({params: {per_page: this.state.perPage, page: this.state.page}})
    .then((response) => {
      this.setState({ list: response.data})
    })
    .catch((error) => {
      console.log(error);
    });
  }

  onChangePage(page) {
    // update state with new page of items
    this.setState({ page: page });    
  }

  
  componentDidUpdate(prevProps, prevState) {
    if (this.state.page != prevState.page || this.state.perPage != prevState.perPage) {
      this.fetchProjects();
    }
  }

  

  renderPagination() {
    if (this.state.list.data.length > 0) {
      var {current_page, last_page, total} = this.state.list.meta;

      return (
        <PaginatedList currentPage={current_page} pageSize={this.state.perPage} totalPages={last_page} totalItems={total} onChangePage={this.onChangePage} /> 
      )
    }
  }

  render() {
    return (
      <div className="section">
        <Container className="is-fluid">
          <Breadcrumb>
            <ul>
              <BreadcrumbItem className="title is-4" isActive>
                <a href="javascript:;">Projects</a>
              </BreadcrumbItem>
            </ul>
          </Breadcrumb>
        </Container>
        
        <hr/>
        <br/>

        <Container className="is-fluid">
          <RepoList kind="projects" list={this.state.list} />
        </Container>

        <br/>

        {this.renderPagination()}
      </div>
    )
  }
}

// const mapStateToProps = (state) => {
//   // console.dir(state);
//   return {
//     list: state.project.list
//   }
// }

// export const ProjectList = connect(mapStateToProps)(List);
export default ProjectList
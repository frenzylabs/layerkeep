/*
 *  list.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 04/26/19
 *  Copyright 2018 WessCope
 */

import React              from 'react';
import { Link }           from 'react-router-dom';
import { RepoList }       from '../Repo/list';
import { ProfileHandler } from '../../handlers';
import PaginatedList      from '../pagination';

import { 
  Container, 
  Breadcrumb, 
  BreadcrumbItem 
} from 'bloomer';

export class ProfileList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {page: 1, perPage: 20, list: {data: [], meta: {}}}
    this.onChangePage = this.onChangePage.bind(this);

    this.cancelRequest = ProfileHandler.cancelSource();
    this.fetchProfiles()
    
  }


  componentWillUnmount() {
    this.cancelRequest.cancel("Left Page");
  }
  fetchProfiles() {
    var opts = {params: {per_page: this.state.perPage, page: this.state.page}, cancelToken: this.cancelRequest.token}
    ProfileHandler.list(opts)
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
      this.fetchProfiles();
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
                <Link to={`/${this.props.match.params.username}/profiles`}>Profiles</Link>
              </BreadcrumbItem>
            </ul>
          </Breadcrumb>
        </Container>
        
        <hr/>
        <br/>

        <Container className="is-fluid">
          <RepoList match={this.props.match} list={this.state.list} />
        </Container>

        <br/>

        {this.renderPagination()}
      </div>
    )
  }
}

export default ProfileList

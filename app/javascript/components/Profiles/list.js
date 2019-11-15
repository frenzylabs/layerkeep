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
import Loader               from '../Loader';

import { 
  Container, 
  Breadcrumb, 
  BreadcrumbItem 
} from 'bloomer';

export class ProfileList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 1, 
      perPage: 20, 
      list: {
        data: [], 
        meta: {}
      },
      hasLoaded: false
    }

    this.onChangePage = this.onChangePage.bind(this);

    this.cancelRequest = ProfileHandler.cancelSource();
    this.fetchProfiles()
    
  }


  componentWillUnmount() {
    this.cancelRequest.cancel("Left Page");
  }
  fetchProfiles() {
    var opts = {
      params: {
        per_page: this.state.perPage, 
        page: this.state.page
      }, 
      cancelToken: this.cancelRequest.token
    };

    ProfileHandler.list(this.props.match.params.username, opts)
    .then((response) => {
      this.setState({ 
        ...this.state,
        list: response.data,
        hasLoaded: true
      });
      
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
    if(this.state.hasLoaded == false) {
      return(
        <Loader/>
      );
    }

    return (
      <div className="section">
        <Container className="is-fluid">
          <div className="columns is-mobile">
            <div className="column">
              <Breadcrumb>
                <ul>
                  <BreadcrumbItem className="title is-4" isActive>
                    <Link to={`/${this.props.match.params.username}/profiles`}>Profiles</Link>
                  </BreadcrumbItem>
                </ul>
              </Breadcrumb>
            </div>
            <div className="column is-3 has-text-right">
              <Link className="button" to={`/${this.props.match.params.username}/profiles/new`}>New Profile</Link>
            </div>    
          </div>          
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

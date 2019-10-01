/*
 *  list.js
 *  LayerKeep
 * 
 *  Created by Kevin Musselman (kmussel@gmail.com) on 04/30/19
 *  Copyright 2019 Frenzylabs
 */

import React                from 'react';
import { Link }             from 'react-router-dom';
import { SliceListItem }    from './list_item';
import { SliceEmptyList }   from './empty_list';
import SpinnerModal       from '../Modal/spinner';
import PaginatedList      from '../pagination';
import Loader             from '../Loader';
import { ProjectHandler, ProfileHandler, SliceHandler }     from '../../handlers';

import { SearchDropdown } from '../Form/SearchDropdown'

const qs = require('qs');

import { 
  Breadcrumb, 
  BreadcrumbItem,
  Columns, 
  Column 
} from 'bloomer';

export class SliceList extends React.Component {
  constructor(props) {
    super(props);


    var qparams = qs.parse(this.props.location.search, { ignoreQueryPrefix: true })
    
    this.state = {
      isLoading: true,
      projects: [],
      profiles: [],
      search: {
        page: parseInt(qparams["page"] || 1), 
        per_page: parseInt(qparams["per_page"] || 20), 
        q: qparams["q"] || {}
      },
      list: {
        data: [], 
        meta: {}
      }
    }
    
    this.items = this.items.bind(this);
    this.onChangePage = this.onChangePage.bind(this)
    this.selectProject  = this.selectProject.bind(this)
    this.cancelRequest = SliceHandler.cancelSource();
  }

  componentDidMount() {
    this.fetchSlices()
    this.loadProjects()
    // this.loadProfiles()
  }

  componentWillUnmount() {
    this.cancelRequest.cancel("Left Page");
  }

   
  componentDidUpdate(prevProps, prevState) {
    if (this.props.location.search != prevProps.location.search) {
      var qparams = qs.parse(this.props.location.search, { ignoreQueryPrefix: true })
      var search = {
        page: parseInt(qparams["page"] || 1), 
        per_page: parseInt(qparams["per_page"] || 20), 
        q: qparams["q"] || {}
      }
      this.setState({search: search})
    }
    else if (JSON.stringify(this.state.search) != JSON.stringify(prevState.search)) {
      var url = qs.stringify(this.state.search, { addQueryPrefix: true });      
      this.props.history.push(`${url}`);
      this.fetchSlices();
    }
  }

  fetchSlices() {
    this.setState({isLoading: true, error: null})
    var url = this.props.match.url
    SliceHandler.list(this.props.match.params.username, {qs: this.state.search, cancelToken: this.cancelRequest.token})
    .then((response) => {
      this.updateSlices(response.data)
    })
    .catch((err) => {
      var errMessage = "There was an error loading the slice details."
      if (err.response.data && err.response.data.error) {
        var error = err.response.data.error
        if (error.message) {
          errMessage = error.message
        } else {
          errMessage = JSON.stringify(error)
        }
      }
      this.setState({
        error:      errMessage,
        isLoading: false
      })
    });
  }

  updateSlices(data) {
    this.setState({ list: data, isLoading: false })
  }

  onChangePage(page) {
    // update state with new page of items
    this.setState({ search: {...this.state.search, page: page }});    
  }

 

  loadProjects() {    
    ProjectHandler.list(this.props.match.params.username, {cancelToken: this.cancelRequest.token})
    .then((response) => {
      var projects = response.data.data.map((item) => {
        return {name: item.attributes.name, value: item.attributes.path, id: item.id}
      })
      projects.unshift({"name": "All", value: "all"})

      this.setState({ projects: projects})
    })
    .catch((error) => {
      console.log(error);
    });
  }


  // loadProfiles() {    
  //   ProfileHandler.list(this.props.match.params.username, {cancelToken: this.cancelRequest.token})
  //   .then((response) => {
  //     var profiles = response.data.data.map((item) => {
  //       return {name: item.attributes.name, value: item.attributes.path, id: item.id}
  //     })
  //     this.setState({ profiles: profiles})
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   });
  // }

  selectProject(item, id) {
    var search = this.state.search
    if (item["id"]) {
      if (search.q["project_id"] != item["id"]) {
        this.setState({ search: {...search, page: 1, q: {...search.q, project_id: item["id"]} }})
      }
    } else {
      var q = Object.assign({}, search.q)
      delete q["project_id"]
      this.setState({ search: {...search, page: 1, q: q }})
    }
  }

  renderRepos() {
    if (!this.state.projects) return null;
    var selectedRepo =  this.state.projects.find((x) => x["id"] == this.state.search.q["project_id"])
    return (
      <div className="level" >  
          <div className="level-left">
            <div className="level-item">Project Name: </div>
            <div className="level-item" >
              <SearchDropdown id={"projectfilter"} options={this.state.projects} selected={selectedRepo} onSelected={this.selectProject} promptText={`Filter by Project`} placeholder={`Project Name`} />
            </div>                
          </div>
      </div>
    )
    
  }

  renderFilter() {
    return (
      <div className="columns is-mobile">
        <div className="column is-half-desktop">
          <div className={`card`}>
            <div className="card-header">
              <p className="card-header-title">
                Filter
              </p>
            </div>

            <div className="card-content">
              {this.renderRepos()}
            </div>
          </div>
        </div>
      </div>
    )
  }
  

  renderPagination() {
    if (this.state.list.data.length > 0) {
      var {current_page, last_page, total} = this.state.list.meta;
      return (
        <PaginatedList currentPage={current_page} pageSize={this.state.search.per_page} totalPages={last_page} totalItems={total} onChangePage={this.onChangePage} /> 
      )
    }
  }

  empty() {
    return (
      <SliceEmptyList params={this.props.match.params} />
    );
  }

  items() {
    var params = this.props.match.params;
      return this.state.list.data.map((item) => {
        return (<SliceListItem path={`/${params.username}/slices/${item.id}`} item={item} key={item.id} />)
      });
  }

  renderContent() {
    if (this.state.isLoading) {
      return (<SpinnerModal />)
    } else if (this.state.error) {
      return (
        <article className="message is-danger">
          <div className="message-body">
            {this.state.error}
          </div>
        </article>
      )
    } else {
      const component = this.state.list.data.length > 0 ? this.items() : this.empty();
      return (<div>
          {component}
        </div>
      )
    }
  }
  
  render() {
    var params = this.props.match.params;
    return (
      <div className="section">
        <div className="container is-fluid">
          <div className="columns is-mobile">
            <div className="column">
              <Breadcrumb>
                <ul>
                  <BreadcrumbItem className="title is-4">
                    <Link to={`/${params.username}/slices`}>Slices</Link>
                  </BreadcrumbItem>
                </ul>
              </Breadcrumb>
            </div>
            <div className="column is-3 has-text-right">
              <div className="level">
                <div className="level-item">
                  <Link className="button" to={`/${params.username}/slices/new`}>New Slice</Link>
                </div>
                <div className="level-right">
                  <div className="level-item">
                    <Link to={`/${params.username}/slices/create/`} className="button">Slicer <sup>Alpha</sup></Link>
                  </div>
                </div>
              </div>
            </div>            
          </div>
        </div>
        <br/>
        
        <div className="container is-fluid">
        
          {this.renderFilter()}

          {this.renderContent()}
          <br/>
          {this.renderPagination()}
          <br/>
        </div>
      </div>
    );
  }
}


export default SliceList
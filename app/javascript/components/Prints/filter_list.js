/*
 *  asset_item.js
 *  LayerKeep
 * 
 *  Created by Kevin Musselman (kevin@frenzylabs.com) on 09/26/19
 *  Copyright 2019 Layerkeep
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'bloomer';
import { SearchDropdown } from '../Form/SearchDropdown'
import { ProjectHandler, ProfileHandler, SliceHandler }     from '../../handlers';

const qs = require('qs');

export class FilterList extends React.Component {
  constructor(props) {
    super(props);

     
    this.state = {     
      projects: [],
      profiles: [], 
      slices: [],
      filter: {
        project_id: props.search.q["project_id"],
        profile_id: props.search.q["profile_id"],
        slice_id: props.search.q["slice_id"]
      }
    }
    this.selectProject = this.selectProject.bind(this)
    this.selectProfile = this.selectProfile.bind(this)
    this.selectSlice   = this.selectSlice.bind(this)

    this.cancelRequest = ProjectHandler.cancelSource();    
    window.fl = this;
  }

  componentDidMount() {
    this.loadProjects()
    this.loadProfiles()
    this.loadSlices()
  }

  componentDidUpdate(prevProps, prevState) {
    if (JSON.stringify(prevState.filter) != JSON.stringify(this.state.filter)) {
      this.loadSlices()
    }
  }

  selectProject(item, id) {
    var filter = {...this.state.filter, project_id: item["id"], slice_id: null}
    this.setState( { filter: filter} )
    if (this.props.onFilter) {
      this.props.onFilter(filter)
    }
  }

  selectProfile(item, id) {
    var filter = {...this.state.filter, profile_id: item["id"], slice_id: null}
    this.setState( { filter: filter } )
    if (this.props.onFilter) {
      this.props.onFilter(filter)
    }
  }

  selectSlice(item, id) {
    var filter = {...this.state.filter, slice_id: item["id"]}
    this.setState( { filter: filter} )
    if (this.props.onFilter) {
      this.props.onFilter(filter)
    }
  }

  loadProjects() {    
    ProjectHandler.list(this.props.match.params.username, { cancelToken: this.cancelRequest.token })
    .then((response) => {
      var projects = response.data.data.map((item) => {
        return {name: item.attributes.name, value: item.attributes.path, id: item.id}
      })
      projects.unshift({"name": "All", value: "all"})

      this.setState({ projects: projects })
    })
    .catch((error) => {
      console.log(error);
    });
  }

  loadProfiles() {    
    ProfileHandler.list(this.props.match.params.username, {cancelToken: this.cancelRequest.token})
    .then((response) => {
      var profiles = response.data.data.map((item) => {
        return {name: item.attributes.name, value: item.attributes.path, id: item.id}
      })
      profiles.unshift({"name": "All", value: "all"})

      this.setState({ profiles: profiles })
    })
    .catch((error) => {
      console.log(error);
    });
  }

  loadSlices() {    
    SliceHandler.list(this.props.match.params.username, { qs: {q: this.state.filter}, cancelToken: this.cancelRequest.token})
    .then((response) => {
      // console.log()
      var slices = response.data.data.map((item) => {
        return {name: item.attributes.name, value: item.attributes.id, id: item.id}
      })
      slices.unshift({"name": "All", value: "all"})
      this.setState({ slices: slices})
    })
    .catch((error) => {
      console.log(error);
    });
  }

  renderProjects() {
    if (!this.state.projects) return null;
    var selectedRepo =  this.state.projects.find((x) => x["id"] == this.state.filter.project_id)
    return (
          <div className="level-left">
            <div className="" >
              <div className="">Project Name: </div>
              <SearchDropdown id={"projectfilter"} options={this.state.projects} selected={selectedRepo} onSelected={this.selectProject} promptText={`Filter by Project`} placeholder={`Project Name`} />
            </div>                
          </div>
    )
  }

  renderProfiles() {
    if (!this.state.profiles) return null;
    var selectedRepo =  this.state.profiles.find((x) => x["id"] == this.state.filter.profile_id)
    return (
          <div className="level-left">            
            <div className="" >
              <div className="">Profile Name: </div>
              <SearchDropdown id={"profilefilter"} options={this.state.profiles} selected={selectedRepo} onSelected={this.selectProfile} promptText={`Filter by Profile`} placeholder={`Profile Name`} />
            </div>                
          </div>
    )
  }

  renderSlices() {
    if (!this.state.slices) return null;
    var selectedItem =  this.state.slices.find((x) => x["id"] == this.state.filter.slice_id)
    return (
          <div className="level-left">            
            <div className="" >
              <div>Slice Name: </div>
              <SearchDropdown id={"slicefilter"} options={this.state.slices} selected={selectedItem} onSelected={this.selectSlice} promptText={`Filter by Slice`} placeholder={`Slice Name`} />
            </div>                
          </div>
    )
  }

  render() {
    return (
      <div className="columns is-mobile">
        <div className="column is-two-thirds-desktop">
          <div className={`card`}>
            <div className="card-header">
              <p className="card-header-title">
                Filter
              </p>
            </div>

            <div className="card-content">
              <div className="level" >  
                {this.renderProjects()}
                {this.renderProfiles()}
                {this.renderSlices()}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

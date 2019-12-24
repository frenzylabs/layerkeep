/*
 *  asset_item.js
 *  LayerKeep
 * 
 *  Created by Kevin Musselman (kevin@frenzylabs.com) on 09/26/19
 *  Copyright 2019 Layerkeep
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Icon, Button } from 'bloomer';
import { SearchDropdown } from '../Form/SearchDropdown'
import { ProjectHandler, ProfileHandler, SliceHandler, PrinterHandler }     from '../../handlers';

const qs = require('qs');

export class FilterList extends React.Component {
  constructor(props) {
    super(props);

     
    this.state = {     
      printers: [],
      projects: [],
      profiles: [], 
      slices: {
        data: [],
        meta: {},
        search: {
          page: 1, 
          per_page: 20, 
          q: {}
        }
      },
      slicesLoading: false,
      filter: {
        printer_id: props.search.q["printer_id"],
        project_id: props.search.q["project_id"],
        profile_id: props.search.q["profile_id"],
        slice_id: props.search.q["slice_id"]
      }
    }
    this.selectProject  = this.selectProject.bind(this)
    this.selectProfile  = this.selectProfile.bind(this)
    this.selectSlice    = this.selectSlice.bind(this)
    this.selectPrinter  = this.selectPrinter.bind(this)

    this.cancelRequest = ProjectHandler.cancelSource();
  }

  componentDidMount() {
    this.loadPrinters()
    this.loadProjects()
    this.loadProfiles()
    this.loadSlices()
  }

  componentDidUpdate(prevProps, prevState) {
    // if (JSON.stringify(prevState.filter) != JSON.stringify(this.state.filter)) {
    if (prevState.filter.project_id != this.state.filter.project_id || 
      prevState.filter.profile_id != this.state.filter.profile_id ||
      prevState.slices.search != this.state.slices.search) {
      this.loadSlices()
    }
  }


  selectPrinter(item, id) {
    var filter = {...this.state.filter, printer_id: item["id"]}
    this.setState( { filter: filter} )
    if (this.props.onFilter) {
      this.props.onFilter(filter)
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

  loadPrinters() {    
    PrinterHandler.list(this.props.match.params.username, { cancelToken: this.cancelRequest.token })
    .then((response) => {
      var printers = response.data.data.map((item) => {
        return {name: item.attributes.name, value: item.attributes.path, id: item.id}
      })
      printers.unshift({"name": "All", value: "all"})

      this.setState({ printers: printers })
    })
    .catch((error) => {
      console.log(error);
    });
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
    this.setState({slicesLoading: true})
    var sliceFilter = {...this.state.slices.search.q, ...this.state.filter}
    SliceHandler.list(this.props.match.params.username, { qs: {q: sliceFilter}, cancelToken: this.cancelRequest.token})
    .then((response) => {
      // console.log()
      var slices = response.data.data.map((item) => {
        return {name: item.attributes.name, value: item.attributes.id, id: item.id, description: item.attributes.description}
      })
      slices.unshift({"name": "All", value: "all"})
      this.setState({ slicesLoading: false, slices: {data: slices, meta: response.data.meta, search: this.state.slices.search}})
    })
    .catch((error) => {
      console.log(error);
      this.setState({slicesLoading: false})
    });
  }

  onSliceFilter(item) {
    this.setState({slices: {...this.state.slices, search: {...this.state.slices.search, q: {name: item}}}})
  }
  

  renderPrinters() {
    if (!this.state.printers) return null;
    var selectedPrinter =  this.state.printers.find((x) => x["id"] == this.state.filter.printer_id)
    return (
          <div className="level-left">
            <div className="" >
              <div className="">Printer Name: </div>
              <SearchDropdown id={"printerfilter"} options={this.state.printers} selected={selectedPrinter} onSelected={this.selectPrinter} promptText={`Filter by Printer`} placeholder={`Printer Name`} />
            </div>                
          </div>
    )
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

  renderSliceOptionItem(item) {

    return (
      <div className="level">
        <div className="level-left">{item.name}</div>
        {item.description && item.description.length > 0 && 
          (<div className="level-right">
            <Icon icon="angle-down" className="fas fa-info-circle" isSize="small" data-tooltip={`${item.description}`} />
          </div>)}
      </div>
    )
  }

  renderSlices() {
    if (!this.state.slices.data) return null;
    var selectedItem =  this.state.slices.data.find((x) => x["id"] == this.state.filter.slice_id)
    return (
          <div className="level-left">            
            <div className="" >
              <div>Slice Name: </div>
              <SearchDropdown id={"slicefilter"} 
                promptText={`Filter by Slice`} 
                placeholder={`Slice Name`}
                loading={this.state.slicesLoading} 
                options={this.state.slices.data} 
                meta={this.state.slices.meta} 
                selected={selectedItem} 
                onSelected={this.selectSlice} 
                onFilter={this.onSliceFilter.bind(this)} 
                renderOptionItem={this.renderSliceOptionItem.bind(this)}
                 />
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
                {this.renderPrinters()}
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

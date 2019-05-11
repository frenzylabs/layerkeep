/*
 *  details.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 04/30/19
 *  Copyright 2018 WessCope
 */

import React from 'react';
import { connect } from 'react-redux';
import { Link }         from 'react-router-dom';

import { Container, Columns, Column, Button } from 'bloomer';
import { Panel, PanelHeading, PanelBlock } from 'bloomer';


import { Revisions } from '../Repo/revisions'
import { Revision } from '../Repo/revision'
import { RepoFileViewer } from '../Repo/repo_file_viewer'
import { FileViewer } from '../FileViewer/file_viewer'

import { ProjectHandler } from '../../handlers/project_handler';
import { ProfileHandler } from '../../handlers/profile_handler';
import { SliceHandler } from '../../handlers/slice_handler';
import { SearchDropdown } from '../Form/SearchDropdown'

// import { ProjectDetails } from './components/Project/details';

export class Slicer extends React.Component {
  constructor(props) {
    super(props);

    this.initialProjectSelection = { selectedProject: {}, revisions: [], selectedRevision: {}, files: [], selectedFile: {}}
    this.initialProfileSelection = { selectedProfile: {}, revisions: [], selectedRevision: {}, files: [], selectedFile: {}}
    this.state = { projects: [], profiles: [], 
                  projectSelections: {"0": Object.assign({}, this.initialProjectSelection)}, 
                  profileSelections: [Object.assign({}, this.initialProfileSelection)] 
                }
    
    this.selectProject          = this.selectProject.bind(this);
    this.selectProjectRevision  = this.selectProjectRevision.bind(this);
    this.selectProjectFile      = this.selectProjectFile.bind(this);
    
    this.selectProfile          = this.selectProfile.bind(this);
    this.selectProfileRevision  = this.selectProfileRevision.bind(this);
    this.selectProfileFile      = this.selectProfileFile.bind(this);

    this.createSlice            = this.createSlice.bind(this);
    

    this.loadProjects();
    this.loadProfiles();

    // window.slicer = this;

  }

  loadProjects() {    
    ProjectHandler.list()
    .then((response) => {
      // console.log()
      var projects = response.data.data.map((item) => {
        return {name: item.attributes.name, value: item.attributes.path, id: item.id}
      })
      
      // console.log("PROJECTS: ", projects)
      this.setState({ projects: projects})
      if (projects.length == 1) {
        this.selectProject(projects[0], "projects0")
      }
    })
    .catch((error) => {
      console.log(error);
    });
  }


  loadProfiles() {    
    ProfileHandler.list()
    .then((response) => {
      var profiles = response.data.data.map((item) => {
        return {name: item.attributes.name, value: item.attributes.path, id: item.id}
      })
      // console.log("profiles: ", profiles)
      this.setState({ profiles: profiles})
    })
    .catch((error) => {
      console.log(error);
    });
  }

  createSlice() {
    console.log("Slice IT");

    var profiles = this.state.profileSelections.reduce((acc, item) => {
      if (item.selectedFile) {
        acc.push({id: item.selectedProfile.id, revision: item.selectedRevision.name, filepath: item.selectedFile.value})
      }
      return acc;
    }, [])

    var projects = Object.keys(this.state.projectSelections).reduce((acc, key) => {
      var item = this.state.projectSelections[key];
      if (item.selectedFile) {
        acc.push({id: item.selectedProject.id, revision: item.selectedRevision.name, filepath: item.selectedFile.value})
      }
      return acc;
    }, [])

    var slicing = SliceHandler.slice(projects, profiles);
    console.log(slicing)
    this.setState( { slicing: slicing});
    // revision
    // filepath
    // id
  }

  selectProject(item, id) {
    // console.log("Selected Project: ", id, item)
    var num = id.match(/[^\d]+(?<index>\d+)$/);
    if (num && num.groups.index) {
      num = num.groups.index
    }

    ProjectHandler.raw(`/${item.value}`)
    .then((response) => {
      var revisions = response.data.data.attributes.branches.map((item) => {
        return {name: item, value: item}
      })

      var pj = {...this.state.projectSelections}
      pj[num] = {revisions: revisions, selectedProject: item, selectedRevision: null, files: [], selectedFile: null};
      this.setState({projectSelections: pj})
      // this.forceUpdate()

      if (revisions.length == 1) {
        this.selectProjectRevision(revisions[0], `project-revisions${num}`)
      }
      // this.setState({ projectSelections: projects})
    })
    .catch((error) => {
      console.log(error);
    });
  }

  selectProjectRevision(item, id) {
    // console.log("Selected Project Revision: ", id, item)
    var num = id.match(/[^\d]+(?<index>\d+)$/);
    if (num && num.groups.index) {
      num = num.groups.index
    }

    var path = this.state.projectSelections[num].selectedProject.value + "/tree/" + item.value;
    ProjectHandler.raw(`/${path}`)
    .then((response) => {
      var files = response.data.data.reduce((acc, item) => {
        if (item.type == "blob" && item.path.match(/\.(stl|obj)$/)) {
          return acc.concat({name: item.name, value: item.path})
        } else {
          return acc;
        }
        
      }, [])

      var pj = {...this.state.projectSelections};
      pj[num] = Object.assign(pj[num], {selectedRevision: item, files: files, selectedFile: null});
      this.setState({ projectSelections: pj})
    })
    .catch((error) => {
      console.log(error);
    });
  }

  selectProjectFile(item, id) {
    console.log("Selected Project File: ", id, item)
    var num = id.match(/[^\d]+(?<index>\d+)$/);
    if (num && num.groups.index) {
      num = num.groups.index
    }
    var revision = item
    if (typeof(item) != "string") {
      revision = item.value
    }

    var projSel = this.state.projectSelections[num];
    
    var path = "/" + projSel.selectedProject.value + "/content/" + projSel.selectedRevision.value + "/" + item.value;
    var ext = item.value.split(".").pop().toLowerCase();
    this.setState( {currentProjectFile: path, extension: ext} );
    projSel.selectedFile = item;
    this.forceUpdate()
  }


  selectProfile(item, id) {
    // console.log("Selected Profile: ", id, item)
    ProjectHandler.raw(`/${item.value}`)
    .then((response) => {
      var revisions = response.data.data.attributes.branches.map((item) => {
        return {name: item, value: item}
      })

      this.state.profileSelections[0] = {revisions: revisions, selectedProfile: item, selectedRevision: null, files: [], selectedFile: null};
      this.forceUpdate()

    })
    .catch((error) => {
      console.log(error);
    });
  }

  selectProfileRevision(item, id) {
    // console.log("Selected Profile Revision: ", id, item)
    var path = this.state.profileSelections[0].selectedProfile.value + "/tree/" + item.value;
    ProjectHandler.raw(`/${path}`)
    .then((response) => {
      var files = response.data.data.reduce((acc, item) => {
        if (item.type == "blob") {
          return acc.concat({name: item.name, value: item.name})
        } else {
          return acc;
        }
        
      }, [])

      this.state.profileSelections[0].files = files;
      this.state.profileSelections[0].selectedRevision = item;
      this.forceUpdate()
      // this.setState({ projectSelections: projects})
    })
    .catch((error) => {
      console.log(error);
    });
  }

  selectProfileFile(item, id) {

    var file = item
    if (typeof(item) != "string") {
      file = item.value
    }

    var params = this.props.match.params;
    var projSel = this.state.profileSelections[0];
    
    var path = "/" + projSel.selectedProfile.value + "/content/" + projSel.selectedRevision.value + "/" + file;
    var ext = file.split(".").pop().toLowerCase();
    this.setState( {currentProfileFile: path, extension: ext} );
    projSel.selectedFile = item;
    this.forceUpdate()
  }

  renderProjectSelections() {
    return Object.keys(this.state.projectSelections).map((key, index) => {
      var item = this.state.projectSelections[key]
      return (
        <PanelBlock key={key} >
          <Container className="is-fluid" >
            <div><SearchDropdown id={"projects"+key} options={this.state.projects} selected={item.selectedProject} onSelected={this.selectProject} promptText="Select a Project" placeholder="Project Name" /></div>
            <div><SearchDropdown id={"project-revision"+key} options={item.revisions} selected={item.selectedRevision} onSelected={this.selectProjectRevision} promptText="Select a Revision" /></div>
            <div><SearchDropdown id={"project-files"+key} options={item.files} selected={item.selectedFile} onSelected={this.selectProjectFile} promptText="Select a File" placeholder="Project File" /></div>
          </Container>
        </PanelBlock>
        )
    });
  }

  renderProfileSelections() {
    return this.state.profileSelections.map((item, index) => {
      return (
        <PanelBlock key={index} >
          <Container className="is-fluid" >
            <div><SearchDropdown id={"profile"+index} options={this.state.profiles} selected={item.selectedProfile} onSelected={this.selectProfile} promptText="Select a Profile" placeholder="Profile Name" /></div>
            <div><SearchDropdown id={"profile-revision"+index} options={item.revisions} selected={item.selectedRevision} onSelected={this.selectProfileRevision} promptText="Select a Revision" /></div>
            <div><SearchDropdown id={"profile-files"+index} options={item.files} selected={item.selectedFile} onSelected={this.selectProfileFile} promptText="Select a File" placeholder="Profile File" /></div>
          </Container>
        </PanelBlock>
        )
    });
  }

  renderProjectFile() {
    if (this.state.currentProjectFile) {
      return (<FileViewer url={this.state.currentProjectFile} extension={this.state.extension} />)
    }
  }

  render() {
    return (
      <div className="section" style={{height: '100%'}}>
        <Columns style={{height: '100%'}}>
            <Column isSize={3} style={{overflow: "scroll", paddingTop: "0"}}>
              <Panel className="is-fluid panel" >
                  <PanelHeading>Select Project File</PanelHeading>
                  {this.renderProjectSelections()}
                </Panel>
                <Panel className="is-fluid panel" >
                  <PanelHeading>Select Printer Profile</PanelHeading>
                  {this.renderProfileSelections()}
              </Panel>
              <Container className="is-fluid" >
                <Button onClick={this.createSlice}>Create Slice</Button>
              </Container>
            </Column>

            <Column className="has-text-right message">
              <Container className="is-fluid" >
                {this.renderProjectFile()}
                </Container>
            </Column>
          </Columns>
      </div>
    )
  }   
}


export default Slicer;




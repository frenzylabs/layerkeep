/*
 *  slicer.js
 *  LayerKeep
 * 
 *  Created by Kevin Musselman (kmussel@gmail.com) on 08/14/19
 *  Copyright 2019 Frenzylabs
 */

import React        from 'react';
import { Redirect } from 'react-router-dom';



import { FileViewer }     from '../FileViewer'
import { SliceHandler }   from '../../handlers';
import { SearchDropdown } from '../Form/SearchDropdown'

import { 
  ProjectHandler, 
  ProfileHandler 
} from '../../handlers';

import { 
  Container, 
  Columns, 
  Column, 
  Button, 
  Panel, 
  PanelHeading, 
  PanelBlock 
} from 'bloomer';


export class Slicer extends React.Component {
  constructor(props) {
    super(props);


    this.initialRepoSelection = { selectedRepo: {}, revisions: [], selectedRevision: {}, files: [], selectedFile: {}}

    this.state = { 
      canSlice: false,
      projects: [], 
      profiles: [], 
      engines: [],
      selectedEngine: null,
      projectSelections: {"0": Object.assign({}, this.initialRepoSelection)}, 
      profileSelections: {"0": Object.assign({}, this.initialRepoSelection)} 
    }
    
    this.selectProject          = this.selectProject.bind(this);
    this.selectProjectRevision  = this.selectProjectRevision.bind(this);
    this.selectProjectFile      = this.selectProjectFile.bind(this);
    
    this.selectProfile          = this.selectProfile.bind(this);
    this.selectProfileRevision  = this.selectProfileRevision.bind(this);
    this.selectProfileFile      = this.selectProfileFile.bind(this);

    this.getSelection           = this.getSelection.bind(this);

    this.loadEngines            = this.loadEngines.bind(this);
    this.selectEngine           = this.selectEngine.bind(this);
    this.createSlice            = this.createSlice.bind(this);
    

    this.cancelRequest = ProjectHandler.cancelSource();

    this.loadProjects();
    this.loadProfiles();
    this.loadEngines();

    window.slicer = this;
  }

  componentWillUnmount() {
    console.log("Unmount h");
    this.cancelRequest.cancel("Left Page");
  }

  loadEngines() {    
    ProjectHandler.raw("/slicer_engines", {cancelToken: this.cancelRequest.token})
    .then((response) => {
      var engines = response.data.data.map((item) => {
        return {name: item.attributes.name + ": " + item.attributes.version, value: item.id, id: item.id}
      })
      this.setState({ engines: engines})

      this.selectEngine(engines[0], "engines0")
    })
    .catch((error) => {
      console.log(error);
    });
  }

  addProfile() {
    var newNum = Object.keys(this.state.profileSelections).length;
    var pj = {...this.state.profileSelections}
    pj[newNum] = Object.assign({}, this.initialRepoSelection)
    this.setState( { profileSelections: pj })
  }

  loadProjects() {    
    ProjectHandler.list(null, {cancelToken: this.cancelRequest.token})
    .then((response) => {
      var projects = response.data.data.map((item) => {
        return {name: item.attributes.name, value: item.attributes.path, id: item.id}
      })
      
      // console.log("PROJECTS: ", projects)
      this.setState({ projects: projects})
      if (this.props.match.params["kind"] == "projects" && this.props.match.params["name"]) {
        var selproj = projects.find((item) => { return item["name"] == this.props.match.params["name"] })
        this.selectProject(selproj, "projects0");
      }
      else if (projects.length == 1) {        
        this.selectProject(projects[0], "projects0")
      }
    })
    .catch((error) => {
      console.log(error);
    });
  }


  loadProfiles() {    
    ProfileHandler.list(null, {cancelToken: this.cancelRequest.token})
    .then((response) => {
      var profiles = response.data.data.map((item) => {
        return {name: item.attributes.name, value: item.attributes.path, id: item.id}
      })

      this.setState({ profiles: profiles})

      if (profiles.length == 1) {
        this.selectProfile(profiles[0], "profiles0")
      }
    })
    .catch((error) => {
      console.log(error);
    });
  }

  createSlice() {
    var profiles = Object.keys(this.state.profileSelections).reduce((acc, key) => {
      var item = this.state.profileSelections[key];
      if (item.selectedFile && item.selectedFile.name) {
        acc.push({repo_id: item.selectedRepo.id, revision: item.selectedRevision.name, filepath: item.selectedFile.value})
      }
      return acc;
    }, [])

    var projects = Object.keys(this.state.projectSelections).reduce((acc, key) => {
      var item = this.state.projectSelections[key];
      if (item.selectedFile && item.selectedFile.name) {
        acc.push({repo_id: item.selectedRepo.id, name: item.selectedRepo.name, revision: item.selectedRevision.name, filepath: item.selectedFile.value})
      }
      return acc;
    }, [])
    
    // console.log("PrOJ: ", projects);
    // console.log("PROFILES: ", profiles);

    this.setState({slicing: slicing})
    var params = this.props.match.params;

    var sliceParams = [params.username, "slices"]
    // {username: "kmussel", kind: "projects", name: "first-project", resouce: "slices"}
    var slicing = SliceHandler.slice(params.username, this.state.selectedEngine.id, projects, profiles).then((response) => {     
      var slicePath = sliceParams.concat(response.data.id).join("/")
      this.setState( { redirect: slicePath})

    }).catch((error) => {
      console.log(error);
    })
  }

  getSelection(identifier) {
    var num = identifier.match(/[^\d]+(?<index>\d+)$/);
    if (num && num.groups.index) {
      num = num.groups.index;
    } else {
      num = 0;
    }
    return num
  }

  selectProject(item, id) {
    var num = this.getSelection(id)

    ProjectHandler.raw(`/${item.value}`, {cancelToken: this.cancelRequest.token})
    .then((response) => {
      var revisions = response.data.data.attributes.branches.map((item) => {
        return {name: item.name, value: item.name }
      })

      var selectedRevision = revisions.find((item) => { return item["name"] == "master" })
      var pj = {...this.state.projectSelections}
      pj[num] = {revisions: revisions, selectedRepo: item, selectedRevision: selectedRevision, files: [], selectedFile: null};
      this.setState({projectSelections: pj})

      if (selectedRevision) {
        this.selectProjectRevision(selectedRevision, `project-revisions${num}`)
      }
      else if (revisions.length == 1) {
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
    var num = this.getSelection(id)

    var path = this.state.projectSelections[num].selectedRepo.value + "/tree/" + item.value;
    ProjectHandler.raw(`/${path}`, {params: {recursive: true}, cancelToken: this.cancelRequest.token })
    .then((response) => {
      var files = response.data.data.reduce((acc, item) => {
        if (item.type == "blob" && item.path.match(/\.(stl|obj)$/i)) {
          return acc.concat({name: item.name, value: item.path})
        } else {
          return acc;
        }
        
      }, [])

      var pj = {...this.state.projectSelections};
      pj[num] = Object.assign(pj[num], {selectedRevision: item, files: files, selectedFile: null});
      this.setState({ projectSelections: pj})

      if (files.length == 1) {
        this.selectProjectFile(files[0], `project-files${num}`)
      }
    })
    .catch((error) => {
      console.log(error);
    });
  }

  selectProjectFile(item, id) {
    // console.log("Selected Project File: ", id, item)
    var num = this.getSelection(id)

    var revision = item
    if (typeof(item) != "string") {
      revision = item.value
    }

    var projSel = this.state.projectSelections[num];
    
    var path = "/" + projSel.selectedRepo.value + "/content/" + projSel.selectedRevision.value + "/" + item.value;
    var ext = item.value.split(".").pop().toLowerCase();
    this.setState( {currentProjectFile: path, extension: ext} );
    projSel.selectedFile = item;
    this.forceUpdate()
  }


  selectProfile(item, id) {
    // console.log("Selected Profile: ", id, item)
    var num = this.getSelection(id)

    ProjectHandler.raw(`/${item.value}`, {cancelToken: this.cancelRequest.token})
    .then((response) => {
      var revisions = response.data.data.attributes.branches.map((item) => {
        return {name: item.name, value: item.name}
      })

      var pj = {...this.state.profileSelections};
      pj[num] = {revisions: revisions, selectedRepo: item, selectedRevision: null, files: [], selectedFile: null};
      this.setState({ profileSelections: pj})

      if (revisions.length == 1) {
        this.selectProfileRevision(revisions[0], `profile-revisions${num}`)
      }

    })
    .catch((error) => {
      console.log(error);
    });
  }

  selectProfileRevision(item, id) {
    var num = this.getSelection(id)
    // console.log("Selected Profile Revision: ", id, item)
    var path = this.state.profileSelections[num].selectedRepo.value + "/tree/" + item.value;
    ProjectHandler.raw(`/${path}`, {cancelToken: this.cancelRequest.token})
    .then((response) => {
      var files = response.data.data.reduce((acc, item) => {
        if (item.type == "blob") {
          return acc.concat({name: item.name, value: item.name})
        } else {
          return acc;
        }        
      }, [])

      var pj = {...this.state.profileSelections};
      pj[num] = Object.assign(pj[num], {selectedRevision: item, files: files, selectedFile: null});
      this.setState({ profileSelections: pj})

      if (files.length == 1) {
        this.selectProfileFile(files[0], `profile-files${num}`)
      }
    })
    .catch((error) => {
      console.log(error);
    });
  }

  selectProfileFile(item, id) {
    var num = this.getSelection(id)

    var pj = {...this.state.profileSelections};
    
    pj[num]["selectedFile"] = item
    this.setState({ profileSelections: pj})
  }

  selectEngine(item, id) {
    this.setState({ selectedEngine: item})
  }

  canSlice() {
    return !!(this.state.selectedEngine && this.state.selectedEngine.id && this.state.currentProjectFile);
  }

  renderProjectSelections() {
    return Object.keys(this.state.projectSelections).map((key, index) => {
      var item = this.state.projectSelections[key]
      return (
        <PanelBlock key={key} >
          <Container className="is-fluid" >
            <div><SearchDropdown id={"projects"+key} options={this.state.projects} selected={item.selectedRepo} onSelected={this.selectProject} promptText="Select a Project" placeholder="Project Name" /></div>
            <div><SearchDropdown id={"project-revision"+key} options={item.revisions} selected={item.selectedRevision} onSelected={this.selectProjectRevision} promptText="Select a Revision" /></div>
            <div><SearchDropdown id={"project-files"+key} options={item.files} selected={item.selectedFile} onSelected={this.selectProjectFile} promptText="Select a File" placeholder="Project File" /></div>
          </Container>
        </PanelBlock>
        )
    });
  }

  renderProfileSelections() {    
    return Object.keys(this.state.profileSelections).map((key, index) => {
      var item = this.state.profileSelections[key]      
      return (
        <PanelBlock key={key} >
          <Container className="is-fluid" >
            <div><SearchDropdown id={"profile"+key} options={this.state.profiles} selected={item.selectedRepo} onSelected={this.selectProfile} promptText="Select a Profile" placeholder="Profile Name" /></div>
            <div><SearchDropdown id={"profile-revision"+key} options={item.revisions} selected={item.selectedRevision} onSelected={this.selectProfileRevision} promptText="Select a Revision" /></div>
            <div><SearchDropdown id={"profile-files"+key} options={item.files} selected={item.selectedFile} onSelected={this.selectProfileFile} promptText="Select a File" placeholder="Profile File" /></div>
          </Container>
        </PanelBlock>
        )
    });
  }

  renderProjectFile() {
    if (this.state.currentProjectFile) {
      return (<FileViewer url={this.state.currentProjectFile} extension={this.state.extension} showAxes={true} />)
    }
  }

  renderEngineSelections() {
    if (this.state.engines.length > 0) {
      return (
        <PanelBlock >
          <Container className="is-fluid" >
            <div><SearchDropdown id={"engine"} options={this.state.engines} selected={this.state.selectedEngine} onSelected={this.selectEngine} promptText="Select an Engine" placeholder="Engine Name" /></div>
          </Container>
        </PanelBlock>
        )
    }
  }

  render() {
    if(this.state.redirect) {       
      return (<Redirect to={`/${this.state.redirect}`}/>);
    }
    return (
      <div className="section" style={{height: '100%'}}>
        <Columns style={{height: '100%'}}>
            <Column isSize={3} style={{overflow: "scroll", paddingTop: "0"}}>
              <Panel className="is-fluid panel" >
                <PanelHeading> Select Slicer Engine </PanelHeading>
                {this.renderEngineSelections()}
              </Panel>
              <Panel className="is-fluid panel" >
                  <PanelHeading>Select Project File</PanelHeading>
                  {this.renderProjectSelections()}
              </Panel>
              <Panel className="is-fluid panel" >
                  <PanelHeading>
                  Select Printer Profile <button onClick={this.addProfile.bind(this)}>+</button></PanelHeading>
                  {this.renderProfileSelections()}
              </Panel>
              <Container className="is-fluid" >
                <Button onClick={this.createSlice} disabled={this.canSlice() == false}>Create Slice</Button>
              </Container>
            </Column>

            <Column className="has-text-right message">
              <Container className="is-fluid" style={{"height": "100%", overflow: "scroll", "display": "flex"}} >
                {this.renderProjectFile()}
                </Container>
            </Column>
          </Columns>
      </div>
    )
  }   
}


export default Slicer;




/*
 *  repo_form.js
 *  LayerKeep
 * 
 *  Created by Kevin Musselman (kmussel@gmail.com) on 09/03/19
 *  Copyright 2019 Frenzylabs
 */

import React            from 'react';
import { Link }         from 'react-router-dom';

import { ProjectHandler } from '../../handlers';

import { SearchDropdown } from '../Form/SearchDropdown'


export class RepoForm extends React.Component {
  constructor(props) {
    super(props);

    this.initialRepoSelection = { state: "new", selectedRepo: {}, revisions: [], selectedRevision: {}, files: [], selectedFile: {}}

    this.initialState = {
      requestError:     null,
      repoSelections: [Object.assign({}, this.initialRepoSelection)]
    };
    
    this.state = Object.assign({}, this.initialState);

    this.cancelRequest = ProjectHandler.cancelSource()

    this.selectRepo          = this.selectRepo.bind(this);
    this.selectRepoRevision  = this.selectRepoRevision.bind(this);
    this.selectRepoFile      = this.selectRepoFile.bind(this);
    this.getSelection        = this.getSelection.bind(this);
  }

  componentWillUnmount() {
    this.cancelRequest.cancel("Left Form")
  }

  componentDidUpdate(prevProps) {
    if (this.props.currentRepos && this.props.currentRepos.length > 0 && prevProps.currentRepos != this.props.currentRepos) {
      this.handleCurrentRepos()
    }
  }

  componentDidMount() {
    if (this.props.currentRepos && this.props.currentRepos.length > 0 ) {
      this.handleCurrentRepos()
    }
  }

  // addFile() {
  //   var newNum = Object.keys(this.state.profileSelections).length;
  //   var pj = {...this.state.profileSelections}
  //   pj[newNum] = Object.assign({}, this.initialRepoSelection)
  //   this.setState( { profileSelections: pj })
  // }

  async handleCurrentRepos() {

    let selections = await Promise.all(this.props.currentRepos.map((item, key) => {
      var res = Object.assign({}, this.initialRepoSelection)
      res.selectedRepo = {value: item.repoPath, id: item.repoId}
      res.id = item.id
      res.state = "edit"
      return this.loadRevisions(res.selectedRepo).then((revisions) => {
        if (!revisions) return null;
        res.revisions = revisions
        res.selectedRevision = revisions.find((ritem) => { return ritem["value"] == item.revision })

        var revPath = item.repoPath + "/tree/" + item.revision;
        return this.loadFiles(revPath).then((files) => { 
          res.files = files
          res.selectedFile = files.find((fitem) => { return fitem["value"] == item.filepath })
          return res
          
        })
      })
    }))
    this.setState({repoSelections: selections})
  }

  loadRevisions(item) {
    return ProjectHandler.raw(`/${item.value}`, {cancelToken: this.cancelRequest.token})
    .then((response) => {
      let revisions = response.data.data.attributes.branches.map((item) => {
        return { name: item.name, value: item.commit }
      })
      return revisions
    }).catch((error) => {
      console.log(error);
    });
  }

  loadFiles(path) {    
    return ProjectHandler.raw(`/${path}`, {params: {recursive: true}, cancelToken: this.cancelRequest.token})
    .then((response) => {
      return response.data.data.reduce((acc, item) => {
        // if (item.type == "blob" && item.path.match(/\.(stl|obj)$/i)) {
        if (item.type == "blob") {  
          return acc.concat({name: item.name, value: item.path})
        } else {
          return acc;
        }
        
      }, [])
    }).catch((error) => {
      console.log(error);
    });
  }

  selectRepo(item, id) {
    var num = this.getSelection(id)

    this.loadRevisions(item)
    .then((revisions) => {

      var pj = [...this.state.repoSelections]

      var selectedRevision = revisions.find((item) => { return item["name"] == "master" })
      
      pj[num] = Object.assign(pj[num], {revisions: revisions, selectedRepo: item, selectedRevision: selectedRevision, files: [], selectedFile: null});
      this.setState({repoSelections: pj})

      if (selectedRevision) {
        this.selectRepoRevision(selectedRevision, `repo-revisions${num}`)
      }
      else if (revisions.length == 1) {
        this.selectRepoRevision(revisions[0], `repo-revisions${num}`)
      }
    })
    .catch((error) => {
      console.log(error);
    });
  }

  selectRepoRevision(item, id) {
    var num = this.getSelection(id)

    var path = this.state.repoSelections[num].selectedRepo.value + "/tree/" + item.value;
    ProjectHandler.raw(`/${path}`, {params: {recursive: true}, cancelToken: this.cancelRequest.token})
    .then((response) => {
      var files = response.data.data.reduce((acc, item) => {
        // if (item.type == "blob" && item.path.match(/\.(stl|obj)$/i)) {
        if (item.type == "blob") {  
          return acc.concat({name: item.name, value: item.path})
        } else {
          return acc;
        }
        
      }, [])

      var pj = [...this.state.repoSelections];
      pj[num] = Object.assign(pj[num], {selectedRevision: item, files: files, selectedFile: null});
      this.setState({ repoSelections: pj})

      if (files.length == 1) {
        this.selectRepoFile(files[0], `repo-files${num}`)
      } else {
        if (this.props.onFileSelected) {
          this.props.onFileSelected(this.props.kind, pj)
        }
      }
    })
    .catch((error) => {
      console.log(error);
    });
  }

  selectRepoFile(item, id) {
    var num = this.getSelection(id)

    var revision = item
    if (typeof(item) != "string") {
      revision = item.value
    }

    var pj = [...this.state.repoSelections];
    pj[num] = {...pj[num], selectedFile: item}
    
    this.setState({ repoSelections: pj})

    if (this.props.onFileSelected) {
      this.props.onFileSelected(this.props.kind, pj)
    }
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


  renderRepoSelections() {
    return this.state.repoSelections.map((item, key) => {
      // var item = this.state.repoSelections[key]      
      return (
        <div className="level" key={key} >
          <div className="level-left is-fluid" >
            <div className="level-item" ><SearchDropdown id={"repo"+key} options={this.props.repos} selected={item.selectedRepo} onSelected={this.selectRepo} promptText={`Select a ${this.props.kind}`} placeholder={`${this.props.kind} Name`} /></div>
            <div className="level-item" ><SearchDropdown id={"repo-revision"+key} options={item.revisions} selected={item.selectedRevision} onSelected={this.selectRepoRevision} promptText="Select a Revision" /></div>
            <div  className="level-item" ><SearchDropdown id={"repo-files"+key} options={item.files} selected={item.selectedFile} onSelected={this.selectRepoFile} promptText="Select a File" placeholder={`${this.props.kind} File`} /></div>
          </div>
        </div>
        )
    });
  }
  

  render() {
    return (
      <div>
        {this.renderRepoSelections()}
      </div>
    )
  }




  
}

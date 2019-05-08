/*
 *  details.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 04/30/19
 *  Copyright 2018 WessCope
 */

import React from 'react';
import { connect }  from 'react-redux';
import { Link }         from 'react-router-dom';

import { Container, Table } from 'bloomer';
import { Breadcrumb, BreadcrumbItem } from 'bloomer';
import { RepoDetailItem } from './detail_item';
import { RepoHandler } from '../../handlers/repo_handler';
import { SearchDropdown } from '../Form/SearchDropdown'

class Details extends React.Component {
  constructor(props) {
    super(props);

    this.state = {repo_files: [], meta: {}, branches: this.props.item.branches || [], currentRevision: "", message: '', lastUpdate: ''};
    this.updateRepoFiles = this.updateRepoFiles.bind(this)
    this.selectBranch = this.selectBranch.bind(this);
    
    this.updateRepoFileList()
  }

  updateRepoFileList() {
    var self  = this
    var url   = this.props.match.url

    if (this.props.match.params.resource != "tree") {
      url = url + "/tree/master"
    }

    RepoHandler.tree(url)
    .then((response) => {
      self.updateRepoFiles(response.data)
    })
    .catch((error) => {
      console.log(error);
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.url != prevProps.match.url) {
      this.updateRepoFileList()
    } else if (this.props.item.branches != prevProps.item.branches ) {
      this.setState({ branches: this.props.item.branches })
    }
  }
  

  
  selectBranch(item) {
    var revision = item
    if (typeof(item) != "string") {
      revision = item.value
    }
    this.setState({ currentRevision: revision })
    var params = this.props.match.params;
    var newloc = "/" + [params.username, params.kind, params.name, 'tree', revision, this.state.meta.filepath].join("/")
    document.location.href = newloc;
  }


  updateRepoFiles(data) {
    this.setState({ 
      lastUpdate: data.data[0].date,
      message: data.data[0].message || "",
      repo_files: data.data,
      meta: data.meta,
      currentRevision: data.meta.revision
    });
  }

  items() {
    if (this.state.repo_files.length > 0) {      
      return this.state.repo_files.map((item) => {
        return (<RepoDetailItem kind={this.props.kind} item={item} repo={this.props.item} key={item.name} match={this.props.match} />)
      });
    } else {
      return (<tr><td>No Files</td></tr>)
    }
  }

  renderBreadCrumbs() {
    if (this.state.meta && this.state.meta.filepath) {
      var params = this.props.match.params;
      var basepath = "/" + [params.username, params.kind, params.name, 'tree', this.state.currentRevision].join("/")
      this.state.meta.filepath
      var filepath = basepath
      var pathComponents = this.state.meta.filepath.split("/");
      var crumbs = []

      if (this.state.meta.filepath.length > 1 && pathComponents.length > 0) {        
        crumbs = crumbs.concat(<BreadcrumbItem key={filepath} className="is-4" >
                                  <Link to={filepath} >{params.name}</Link>
                                </BreadcrumbItem>)
      }

      var res = pathComponents.map((item, index) => {
        filepath = filepath + "/" + item;
        return (<BreadcrumbItem key={filepath} {...pathComponents.length-1 == index ? {isActive: true} : ""} className="is-4" >
                  <Link to={filepath} >{item}</Link>
                </BreadcrumbItem>)
        })
        
      return (<Breadcrumb style={{display: "inline-flex", paddingLeft: "15px"}}>
                <ul style={{display: "inline-flex"}}>
                  {crumbs.concat(res)}
                </ul>
              </Breadcrumb>)
    }

  }

  render() {
    return (
      <div>
        <Container className="is-fluid" style={{display: "flex", alignItems: "center"}}>
          <SearchDropdown options={this.state.branches} selected={this.state.currentRevision} onSelected={this.selectBranch} />
          {this.renderBreadCrumbs()}
        </Container>

        <Table isNarrow className="is-fullwidth">
          <thead>
            <tr>
              <th colSpan={3}>
                {this.state.message}
              </th>

              <th className="has-text-right" colSpan={2}>
                Last updated: {dayjs(this.state.lastUpdate).format('DD.MM.YYYY')}
              </th>
            </tr>
          </thead>

          <tbody>
            {this.items()}
          </tbody>
        </Table>
      </div>
    )
  }
}


const mapStateToProps = (state) => {
  return {
  }
}

export const RepoDetails = connect(mapStateToProps)(Details);

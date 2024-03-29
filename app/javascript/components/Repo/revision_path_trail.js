/*
 *  detail_item.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 04/30/19
 *  Copyright 2018 WessCope
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from 'bloomer';
import { Breadcrumb, BreadcrumbItem } from 'bloomer';
import { SearchDropdown } from '../Form/SearchDropdown'

export class RevisionPathTrail extends React.Component {
  constructor(props) {
    super(props);

    this.selectBranch = this.selectBranch.bind(this);
  }

  selectBranch(item) {
    var revision = item
    if (typeof(item) != "string") {
      revision = item.value || item.name
    }

    var params = this.props.match.params;
    var pathComponents = [params.username, params.kind, params.name, (params.resource || 'tree'), revision]  
    if (this.props.meta.filepath.length > 1)
      pathComponents = pathComponents.concat(this.props.meta.filepath)

    var newloc = "/" + pathComponents.join("/")    
    document.location.href = newloc;
  }

  renderBreadCrumbs() {
    if (this.props.meta && this.props.meta.filepath) {
      var params = this.props.match.params;
      var basepath = "/" + [params.username, params.kind, params.name, 'tree', this.props.meta.revision].join("/")

      var filepath = basepath
      var pathComponents = this.props.meta.filepath.split("/");
      var crumbs = []

      if (this.props.meta.filepath.length > 1 && pathComponents.length > 0) {        
        crumbs = crumbs.concat(<BreadcrumbItem key={filepath} className="is-4" >
                                  <Link to={filepath} style={{textDecoration: 'none'}}>{params.name}</Link>
                                </BreadcrumbItem>)
      }

      var res = pathComponents.map((item, index) => {
        filepath = filepath + "/" + item;
        return (<BreadcrumbItem key={filepath} {...pathComponents.length-1 == index ? {isActive: true} : ""} className="is-4" >
                  <Link to={filepath} style={{textDecoration: 'none'}}>{item}</Link>
                </BreadcrumbItem>)
        })
        
      return (<Breadcrumb className="is-inline-flex">
                <ul className="is-inline-flex">
                  {crumbs.concat(res)}
                </ul>
              </Breadcrumb>)
    }
  }

  render() {
    return(
      <div className="level">
        <div className="level-left">
          <div className="is-inline-flex" style={{paddingRight: "15px"}}>
            <SearchDropdown options={this.props.branches} selected={this.props.meta.revision} onSelected={this.selectBranch} />
          </div>
          <div className="is-inline-flex">
              {this.renderBreadCrumbs()}
            </div>
        </div>
      </div>
    )
  }
}

export default RevisionPathTrail;

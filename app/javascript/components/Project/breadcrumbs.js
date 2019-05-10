/*
 *  breadcrumbs.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 05/10/19
 *  Copyright 2018 WessCope
 */

import React    from 'react';
import { Link } from 'react-router-dom';
import { 
  Breadcrumb, BreadcrumbItem 
} from 'bloomer';


 export default class ProjectBreadCrumbs extends React.Component {
   render(){
     return(
      <Breadcrumb style={{margin: 0, padding: 0}}>
        <ul style={{margin: 0, padding: 0}}>
          <BreadcrumbItem className="title is-5" style={{margin: 0, padding: 0}}>
            <Link to={`/${this.props.username}/projects`}>Projects</Link>
          </BreadcrumbItem>

          <BreadcrumbItem className="title is-5" style={{margin: 0, padding: 0}}>
            <Link to={`/${this.props.username}/projects/${this.props.project.name}`}>{this.props.project.name}</Link>
          </BreadcrumbItem>
        </ul>
      </Breadcrumb>
     )
   }
 }

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


 export class RepoBreadCrumbs extends React.Component {
   titleCase() {
    return (this.props.params.kind.charAt(0).toUpperCase() + this.props.params.kind.slice(1)); 
   }

   render(){
     return(
      <Breadcrumb style={{margin: 0, padding: 0}}>
        <ul style={{margin: 0, padding: 0}}>
          <BreadcrumbItem className="title is-5" style={{margin: 0, padding: 0}}>
            <Link to={`/${this.props.params.username}/${this.props.params.kind}`}>{this.titleCase()}</Link>
          </BreadcrumbItem>

          <BreadcrumbItem className="title is-5" style={{margin: 0, padding: 0}}>
            <Link to={`/${this.props.params.username}/${this.props.params.kind}/${this.props.params.name}`}>{this.props.params.name}</Link>
          </BreadcrumbItem>
        </ul>
      </Breadcrumb>
     )
   }
 }

 export default RepoBreadCrumbs
/*
 *  details.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 04/30/19
 *  Copyright 2018 WessCope
 */

import React                from 'react';
import { Switch, Route, Link } from "react-router-dom";

import { PrintNew }   from './new';
import { PrintDetails }   from './details';
import { PrintEdit }   from './edit';
import { PrintList }   from './list';
import { AssetViewer } from './asset_viewer';

export class PrintIndex extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    var params = this.props.match.params;
    return (
      <div className="" style={{height: '100%'}}>
          <Switch >                  
              <Route path={`${this.props.match.path}/new`} render={ props =>
                <PrintNew {...this.props}  {...props}/> 
              }/>
              <Route path={`${this.props.match.path}/:printId/edit`} exact={true} render={ props =>
                <PrintEdit {...this.props}  {...props} /> 
              }/>
              <Route path={`${this.props.match.path}/:ownerId/assets/:id`} render={ props =>
                <AssetViewer  {...this.props} {...props} /> 
              }/>
              <Route path={`${this.props.match.path}/:printId`} render={ props =>
                <PrintDetails  {...this.props} {...props} /> 
              }/>
              <Route path={`${this.props.match.path}`} render={ props =>
                <PrintList {...this.props}  {...props} /> 
              }/>
            </Switch>
      </div>
    );
  }
}



export default PrintIndex;

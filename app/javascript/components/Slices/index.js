/*
 *  index.js
 *  LayerKeep
 * 
 *  Created by Kevin Musselman (kmussel@gmail.com) on 09/03/19
 *  Copyright 2019 Frenzylabs
 */

import React                from 'react';
import { Switch, Route, Link } from "react-router-dom";

import { SliceNew }   from './new';
import { SliceDetails }   from './details';
import { SliceEdit }   from './edit';
import { SliceList }   from './list';


export class SliceIndex extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    var params = this.props.match.params;
    return (
      <div className="flex-wrapper">
        <div>
          <Switch >                  
              <Route path={`${this.props.match.path}/new`} render={ props =>
                <SliceNew {...this.props}  {...props}/> 
              }/>
              <Route path={`${this.props.match.path}/:sliceId/edit`} exact={true} render={ props =>
                <SliceEdit {...this.props}  {...props} /> 
              }/>
              <Route path={`${this.props.match.path}/:sliceId`} render={ props =>
                <SliceDetails  {...this.props} {...props} /> 
              }/>
              <Route path={`${this.props.match.path}`} render={ props =>
                <SliceList {...this.props}  {...props} /> 
              }/>
            </Switch>
        </div>
      </div>
    );
  }
}


export default SliceIndex;


// { Resource ? 
//   <Resource {...this.props} />
//   : ''
//   }
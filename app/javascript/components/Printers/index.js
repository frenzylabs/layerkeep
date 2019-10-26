/*
 *  index.js
 *  LayerKeep
 * 
 *  Created by Kevin Musselman (kmussel@gmail.com) on 09/03/19
 *  Copyright 2019 Frenzylabs
 */

import React                from 'react';
import { Switch, Route, Link } from "react-router-dom";

import { PrinterNew }   from './new';
import { PrinterDetails }   from './details';
import { PrinterEdit }   from './edit';
import { PrinterList }   from './list';


export class PrinterIndex extends React.Component {
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
                <PrinterNew {...this.props}  {...props}/> 
              }/>
              <Route path={`${this.props.match.path}/:printerId/edit`} exact={true} render={ props =>
                <PrinterEdit {...this.props}  {...props} /> 
              }/>
              <Route path={`${this.props.match.path}/:printerId`} render={ props =>
                <PrinterDetails  {...this.props} {...props} /> 
              }/>
              <Route path={`${this.props.match.path}`} render={ props =>
                <PrinterList {...this.props}  {...props} /> 
              }/>
            </Switch>
        </div>
      </div>
    );
  }
}


export default PrinterIndex;


// { Resource ? 
//   <Resource {...this.props} />
//   : ''
//   }
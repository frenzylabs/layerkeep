//
//  package_select.js
//  LayerKeep
// 
//  Created by Wess Cope (me@wess.io) on 08/12/19
//  Copyright 2019 Wess Cope
//

import React        from 'react'
import SpinnerModal from './spinner'

export default class PackageSelectModal extends React.Component {
  title = "Update Package";
  
  constructor(props) {
    super(props);

    this.state = {
      isCreating: false
    }
  }

  render() {
    if(this.state.isCreating) {
      return (
        <SpinnerModal caption="Saving..."/>
      )
    }

    return (
      <div className="card" style={{border: 'none'}}>
        <div className="card-header">
          <p className="card-header-title">Update package to [Package Name]</p>
        </div>

        <div className="card-content">
          <p>
            This is a description. This is like a couple sentences that
            give you a little tag line about this package.
          </p>

          <br/>

          <ul style={{listStyle: 'circle', marginLeft: '20px'}}>
            <li>Feature Name</li>
            <li>Feature Name</li>
            <li>Feature Name</li>
            <li>Feature Name</li>
            <li>Feature Name</li>
            <li>Feature Name</li>
            <li>Feature Name</li>
            <li>Feature Name</li>
          </ul>
        </div>

        <footer className="card-footer">
          <a className="card-footer-item">Select</a>
          <a className="card-footer-item">Cancel</a>
        </footer>
      </div>
    )
  }
}

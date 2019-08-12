//
//  packages.js
//  LayerKeep
// 
//  Created by Wess Cope (me@wess.io) on 08/12/19
//  Copyright 2019 Wess Cope
//

import React from 'react'

export default class Packages extends React.Component {
  constructor(props) {
    super(props)

    this.renderDetails = this.renderDetails.bind(this)
  }

  renderDetails(pkg, selected) {
    return(
      <div className="card">
        <div className="card-header">
          <p className="card-header-title">
            Package name
          </p>
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
          {!selected && 
            <a className="card-footer-item" onClick={this.props.packageClick}>Select</a>
          }
          
          {selected &&
            <span className="card-footer-item">Current</span>
          }
        </footer>
      </div>
    )
  }

  render() {
    return (
      <div className="card" style={{border: 'none', boxShadow: 'none'}}>
        <div className="card-header" style={{boxShadow: 'none', borderBottom: '1px solid rgba(0, 0, 0, 0.1)'}}>
          <p className="card-header-title">
            Packages
          </p>
        </div>

        <div className="card-content" style={{boxShadow: 'none'}}>
          <div className="columns is-vcentered is-fullwidth is-12">
          <div className="column">
              {this.renderDetails({}, true)}
            </div>

            <div className="column">
              {this.renderDetails({}, false)}
            </div>

            <div className="column">
              {this.renderDetails({}, false)}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

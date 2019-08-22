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

  renderDetails(pkg) {
    var selected = this.props.currentPackage && pkg.id == this.props.currentPackage.id
    var pkg_amount = pkg.attributes.plans.reduce((total, x) => x.attributes.amount + total, 0)
    return(
      <div className="card">
        <div className="card-header">
          <p className="card-header-title">
            {pkg.attributes.name}
          </p>
        </div>

        <div className="card-content">
          <p>
            {pkg.attributes.description}
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

        <br/>
        <p>
           Cost: {pkg_amount}
        </p>

        <footer className="card-footer">
          {!selected && 
            <a className="card-footer-item" onClick={() => this.props.packageClick(pkg)}>Select</a>
          }
          
          {selected &&
            <span className="card-footer-item">Current</span>
          }
        </footer>
      </div>
    )
  }

  renderCustom() {
    return(
      <div className="card">
        <div className="card-header">
          <p className="card-header-title">
            Custom Package
          </p>
        </div>

        <div className="card-content">
          <p>
            Create a custom package that fits your company's needs.
          </p>

          <br/>

          <ul style={{listStyle: 'circle', marginLeft: '20px'}}>
            <li>Feature Name</li>
            <li>Feature Name</li>
            <li>Feature Name</li>
          </ul>
        </div>

        <br/>
        <p>
           Cost: Contact
        </p>

        <footer className="card-footer">
            <a className="card-footer-item" >Contact Us</a>
        </footer>
      </div>
    )
  }

  renderPackages() {
    if (this.props.packages.length > 0) {      
      return this.props.packages.map((pkg, index) => {
        return (
          <div className="column" key={'pack'+ pkg.id}>
            {this.renderDetails(pkg)}
          </div>
        )
      })
    }
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
            {this.renderPackages()}
            <div className="column">
              {this.renderCustom()}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

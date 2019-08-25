//
//  packages.js
//  LayerKeep
// 
//  Created by Wess Cope (me@wess.io) on 08/12/19
//  Copyright 2019 Wess Cope
//

import React from 'react'
import SpinnerModal from '../../../Modal/spinner'

export default class Packages extends React.Component {
  constructor(props) {
    super(props)

    this.renderDetails = this.renderDetails.bind(this)
  }

  amount(pkg) {
    var amount = pkg.attributes.plans.reduce((total, x) => x.attributes.amount + total, 0)
    if (amount > 0) {
      return `$${(amount / 100.0).toFixed(2)}` 
    } else {
      return 'Free'
    }
    
  }

  renderPlan(pkg) {
    return pkg.attributes.plans.map(pl => { 
      return (<li key={pl.id} >{pl.attributes.description}</li>)
    })
  }

  
  renderDetails(pkg) {
    var selected = this.props.currentPackage && pkg.id == this.props.currentPackage.id
    
    var selClass = selected ? "selected" : "";
    return(
      <div className={`${selClass} card package`}>
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

          <ul style={{listStyle: 'none', marginLeft: '20px'}}>
            { this.renderPlan(pkg) }
            
          </ul>
        </div>

        <br/>
        <p style={{padding: '10px'}}>
           Cost: {this.amount(pkg)}
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
      <div className="card package">
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
        </div>

        <footer className="card-footer">
            <a className="card-footer-item" >Contact Us</a>
        </footer>
      </div>
    )
  }

  renderPackages() {
    if (this.props.loading) {
      return (<SpinnerModal />)
    }
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
          <div className="columns is-fullwidth is-12">
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

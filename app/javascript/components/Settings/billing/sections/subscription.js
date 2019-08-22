//
//  subscription.js
//  LayerKeep
// 
//  Created by Wess Cope (me@wess.io) on 08/12/19
//  Copyright 2019 Wess Cope
//

import React from 'react'

export default class Subscription extends React.Component {
  constructor(props) {
    super(props)

    this.amount         = this.amount.bind(this)
    this.description    = this.description.bind(this)
    this.renderDetails  = this.renderDetails.bind(this)
  }

  amount() {
    let items   = (this.props.subscription || {}).items || []
    let amount  = items.reduce((total, x) => x.attributes.plan.attributes.amount + total, 0)

    return amount
  }

  description() {
    let attributes = (this.props.subscription.attributes || {}).items || []

    return attributes.length > 0 ? attributes[0].description : ''
  }

  renderDetails() {
    if(this.props.package) {
      return(
        <h1>Package: {this.props.package.attributes.name} </h1>
      )
    }

    return(
      <table className='table is-narrow is-fullwidth'>
        <thead>
          <tr>
            <td style={{borderBottom: 'none'}}><strong>Package</strong></td>
            <td style={{borderBottom: 'none'}}><strong>Price</strong></td>
            <td style={{borderBottom: 'none'}}><strong>Description</strong></td>
            
          </tr>
        </thead>
        <tbody>
          <tr>
            <td width="24%">Free</td>
            <td width="24%">$0.00</td>
            <td>
              Includes 5 gigs of space and as  many public projects as your space will allow.
              Upgrade to increase space and add other features like private projects.
            </td>
          </tr>
        </tbody>
      </table>
    )
  }

  render() {
    return (
      <div className="card" style={{border: 'none', boxShadow: 'none'}}>
      <div className="card-header" style={{boxShadow: 'none', borderBottom: '1px solid rgba(0, 0, 0, 0.1)'}}>
        <p className="card-header-title">
          Current Subscription
        </p>
      </div>

      <div className="card-content" style={{boxShadow: 'none'}}>
        {this.renderDetails()}
      </div>
    </div>

    )
  }
}

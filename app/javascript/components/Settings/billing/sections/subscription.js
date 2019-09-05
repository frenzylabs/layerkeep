//
//  subscription.js
//  LayerKeep
// 
//  Created by Wess Cope (me@wess.io) on 08/12/19
//  Copyright 2019 Wess Cope
//

import React from 'react'
import SpinnerModal from '../../../Modal/spinner'

export default class Subscription extends React.Component {
  constructor(props) {
    super(props)

    this.amount         = this.amount.bind(this)
    this.description    = this.description.bind(this)
    this.renderDetails  = this.renderDetails.bind(this)
  }

  amount() {
    let items = ((this.props.subscription && this.props.subscription.attributes.items) || [])
    let amount  = items.reduce((total, x) => x.attributes.plan.attributes.amount + total, 0)
    
    return amount
  }

  description() {
    let items = ((this.props.subscription && this.props.subscription.attributes.items) || [])
    
    var attributes = items.map(item => {
      var plan = item.attributes.plan
      if (plan) {
        if(plan.attributes.feature_details != null && plan.attributes.feature_details['details']) {
          return plan.attributes.feature_details.details.map((detail, index) => {
            return detail
          })
        } else {
          return [plan.attributes.description]
        }
      } else {
        return [null]
      }
    }).flatMap((attr) => {
      return attr
    })
    let lineItems = attributes.map((item, index) => {
      if (item)
        return (<li className="package-list-item" key={++index} >{item}</li>) 
    })

    return (
      <ul className="package-block">
        {lineItems}
      </ul>
    )
  }

  statusClass() {
    if (this.props.subscription) {
      switch(this.props.subscription.attributes.status) {
        case "past_due":
        case "unpaid":
          return "is-danger"
        default: 
          return ""
      }
    }
    return ""
  }
  renderStatus() {
    if (this.props.subscription) {      
      // incomplete, incomplete_expired, trialing, active, past_due, unpaid, canceled, or all. Passing in a value of canceled
      // status = this.props.subscription.attributes.status != 'active'
      switch(this.props.subscription.attributes.status) {
        case "active":
        case "trialing":
          return ""
        case "past_due":
          return (<div className="" style={{color: "red"}}>Your Payment is past due.</div>)
        case "unpaid":
          return (<div className=""  style={{color: "red"}}>Your Payment has not been paid.</div>)
        default:
          return ""
      }
    }
  }

  renderDetails() {
    if (this.props.loading) {
      return (<SpinnerModal />)
    }

    var package_name = "Free"
    var price = "Free"
    if (this.props.subscription) {      
      price = this.amount();
      if (price > 0) {
        price = `$${(price / 100.0).toFixed(2)}` 
      } else {
        price = 'Free'
      }
    } 

    if(this.props.package) {
      package_name = this.props.package.attributes.name
    }

    return(
      <div className='level is-narrow is-fullwidth'>
        <div className="level-left">
          <div className="level-item">
            <h1>Package: {package_name} </h1>
          </div>
         </div>
         <div className="level-left"> 
          <div className="level-item">
            <h1>{this.description()} </h1>
          </div>
        </div>
        <div className="level-right" style={{textAlign: 'right'}}>
          <div className="level-item has-text-align-right">
            Price: {price}
          </div>
        </div>
      </div>
    )
  }

  render() {
    var subClass = this.statusClass()
    return (
      <div className="card" style={{border: 'none', boxShadow: 'none'}}>
      <div className="card-header" style={{boxShadow: 'none', borderBottom: '1px solid rgba(0, 0, 0, 0.1)'}}>
        <p className="card-header-title">
          Current Subscription
        </p>
      </div>

      <div className={`card-content message ${subClass}`} style={{boxShadow: 'none'}}>
        {this.renderStatus()}
        {this.renderDetails()}
      </div>
    </div>

    )
  }
}

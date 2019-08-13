//
//  payment_method.js
//  LayerKeep
// 
//  Created by Wess Cope (wess@frenzylabs.com) on 08/06/19
//  Copyright 2019 FrenzyLabs,llc.
//

import React      from 'react'
import * as dayjs from 'dayjs'

export default class PaymentMethod extends React.Component {
  constructor(props) {
    super(props)

    this.renderIcon     = this.renderIcon.bind(this)
    this.renderLastFour = this.renderLastFour.bind(this)
    this.renderUpdated  = this.renderUpdated.bind(this)
    this.updateCard     = this.updateCard.bind(this)
  }

  updateCard() {
    if(this.props.onClick) {
      this.props.onClick(this.props.card)
    }
  }

  renderIcon() {
    var icon = 'fal fa-credit-card'

    if(this.props.card.attributes.brand) {
      icon = `fab fa-cc-${this.props.card.attributes.brand.toLowerCase()}`
    }

    return (
      <div className="column is-narrow is-1" style={{textAlign: 'center'}}>
        <span className="icon is-medium">
          <i className={`${icon} fa-2x`}></i>
        </span>
      </div>
    )
  }

  renderLastFour() {
    let caption = this.props.card.attributes.last4 ? (<p>Card ending in <strong>{this.props.card.attributes.last4}</strong></p>) : (<a onClick={this.updateCard}>Add a credit card</a>)
    let expiry  = (this.props.card.attributes.exp_month && this.props.card.attributes.exp_year) ? (<p>exp date: <strong>{this.props.card.attributes.exp_month}/{this.props.card.attributes.exp_year}</strong></p>) : ''

    return (
      <React.Fragment>
        <div className="column" style={{textAlign: 'center'}}>
          {caption}
        </div>

        <div className="column" style={{textAlign: 'center'}}>
          {expiry}
        </div>
      </React.Fragment>
    )
  }

  renderUpdated() {
    var updated = ""

    if(this.props.card.attributes.updated_at) {
      updated = dayjs(this.props.card.attributes.updated_at).format('MM.DD.YY')
    }

    return (
      <div className="column" style={{textAlign: 'center'}}>
        Added on <strong>{updated}</strong>
      </div>
    )
  }

  render() {
    return (
      <div className="card" style={{border: 'none', boxShadow: 'none'}}>
        <div className="card-header" style={{boxShadow: 'none', borderBottom: '1px solid rgba(0, 0, 0, 0.1)'}}>
          <p className="card-header-title">
            Payment Method
          </p>
        </div>

        <div className="card-content" style={{boxShadow: 'none'}}>
          <div className="columns is-vcentered">
            {this.renderIcon()}

            {this.renderLastFour()}

            {this.renderUpdated()}

            <div className="column is-narrow is-1" style={{textAlign: 'right'}}>
              <a onClick={this.updateCard} className="button is-link is-outlined is-small">
                {this.props.card.attributes.last4 ? 'Update' : 'Add'}
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

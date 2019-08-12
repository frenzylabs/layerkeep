//
//  payment_method.js
//  LayerKeep
// 
//  Created by Wess Cope (wess@frenzylabs.com) on 08/06/19
//  Copyright 2019 FrenzyLabs,llc.
//

import React from 'react'

export default class PaymentMethod extends React.Component {
  constructor(props) {
    super(props)

    this.renderIcon     = this.renderIcon.bind(this)
    this.renderLastFour = this.renderLastFour.bind(this)
    this.renderAddress  = this.renderAddress.bind(this)
    this.updateCard     = this.updateCard.bind(this)
  }

  updateCard() {
    if(this.props.onClick) {
      this.props.onClick(this.props.card)
    }
  }

  renderIcon() {
    let icon = this.props.card.attributes.brand ? `fab fa-cc-${this.props.attributes.brand.type.toLowerCase()}` : 'fal fa-credit-card'

    return (
      <span className="icon is-medium">
        <i className={`${icon} fa-2x`}></i>
      </span>
    )
  }

  renderLastFour() {
    let caption = this.props.card.attributes.last4 ? `Last 4: ${this.props.attributes.card.last4}` : (<a onClick={this.updateCard}>Add a credit card</a>)
    let expiry  = (this.props.card.attributes.exp_month && this.props.card.attributes.exp_year) ? `exp: ${this.props.card.attributes.exp_month}/${this.props.card.attributes.exp_year}` : ''

    return (
      <p className="content">{caption} &nbsp; {expiry}</p>
    )
  }

  renderAddress() {
    let address = this.props.card.attributes.address || ""

    return (
      <p className="content">{address}</p>
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
            <div className="column is-1 is-narrow">
              {this.renderIcon()}
            </div>

            <div className="column is-3">
              {this.renderLastFour()}
            </div>

            <div className="column">
              {this.renderAddress()}
            </div>

            <div className="column is-1">
              <a onClick={this.updateCard} className="button is-link is-outlined is-small">
                {this.props.card.length > 0 ? 'Update' : 'Add'}
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

//
//  form.js
//  LayerKeep
// 
//  Created by Wess Cope (wess@frenzylabs.com) on 08/07/19
//  Copyright 2019 FrenzyLabs,llc.
//

import React from 'react'

import {
  injectStripe,
  CardElement,
  PostalCodeElement
} from 'react-stripe-elements';

class BillingForm extends React.Component {
  constructor(props) {
    super(props)

    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit(ev) {
    ev.preventDefault()

    if(!this.props.stripe) { return }

    // const stripe = this.props.stripe 
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="field">
          <div className="control">
            <CardElement/>
          </div>
        </div>

        <br/>
        <div className="field">
          <div className="control columns">
            
            <div className="buttons column">
              <button class="button is-light">
                <span>Cancel</span>
              </button>

              <button class="button is-success">
                <span class="icon is-small">
                  <i class="fas fa-check"></i>
                </span>
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    )
  }
}

export default injectStripe(BillingForm)

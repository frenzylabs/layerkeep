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
  CardElement
} from 'react-stripe-elements';

class BillingForm extends React.Component {
  async submitAction(ev) {
    ev.preventDefault()

    if(!this.props.stripe) {
      console.error("No stripe property")
      return
    }

    
    let response
    
    try {
      response = await this.props.stripe.createToken({
        type: 'card',
        name: window.currentUser.username
      })
    } catch (error) {
      console.error(error)
    }
    
    await this.props.handleSubmit(response)

  }

  render() {
    return (
      <form onSubmit={this.submitAction.bind(this)}>
        <div className="field">
          <div className="control">
            <CardElement/>
          </div>
        </div>

        <br/>
        <div className="field">
          <div className="control columns">
            <div className="column is-8">
              <div style={{overflow: 'hidden', paddingTop: '6px'}}>
                <p style={{fontSize: '12px', textAlign: 'right', overflow: 'hidden', lineHeight: '200%'}}>
                  Powered by &nbsp;
                  <span className="icon is-medium" style={{display: 'block', float: 'right'}}>
                    <a href="https://stripe.com" target="_blank"><i className="fab fa-stripe fa-2x"></i></a>
                  </span>
                </p>
              </div>
            </div>

            <div className="buttons column">
              <button className="button is-light" onClick={this.props.dismissAction}>
                <span>Cancel</span>
              </button>

              <button className="button is-success">
                <span className="icon is-small">
                  <i className="fas fa-check"></i>
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

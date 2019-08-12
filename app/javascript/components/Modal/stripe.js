//
//  stripe.js
//  LayerKeep
// 
//  Created by Wess Cope (wess@frenzylabs.com) on 08/06/19
//  Copyright 2019 FrenzyLabs,llc.
//

import React                      from 'react'
import {StripeProvider, Elements} from 'react-stripe-elements'
import UserHandler                from '../../handlers/user_handler'
import BillingForm                from '../Settings/billing/form'
import SpinnerModal               from './spinner'

export default class StripeModal extends React.Component {
  title = "Update Billing";
  
  constructor(props) {
    super(props);

    this.state = {
      isCreating: false,
      error:      null
    }
  }

  async handleSubmit(token) {

    console.log("token: ", token)

    if(token.error) {
      console.error('Payload error', token)
      return
    }

    this.setState({
      ...this.state,
      isCreating : true
    })

    UserHandler
    .createCard(window.currentUser.username, {'source_token': token.id})
    .then((res) => {
      this.props.dismissAction(res)
    })
    .catch((err) => {
      this.setState({
        ...this.state,
        error:      err,
        isCreating: false
      })
    })
  }

  render() {
    if(this.state.isCreating) {
      return (
        <SpinnerModal caption="Saving..."/>
      )
    }

    return (
      <div className="card">
        <div className="card-header">
          <p className="card-header-title">Billing Info.</p>
        </div>

        { this.state.error && (
          <article class="message is-danger">
            <div class="message-body">
              {this.state.error}
            </div>
          </article>
        )}

        <div className="card-content">
          <StripeProvider stripe={this.props.stripe}>
            <Elements>
              <BillingForm 
                handleSubmit={this.handleSubmit.bind(this)}
                dismissAction={this.props.dismissAction} 
                stripe={this.props.stripe}
              />
            </Elements>
          </StripeProvider>

        </div>
      </div>
    )
  }
}

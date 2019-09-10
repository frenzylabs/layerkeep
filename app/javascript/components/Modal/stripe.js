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

  handleSubmit(token) {
    console.log("Token: ", token)
    if (token.error ) {
      console.error('Payload error', token.error)
      this.setState({error: token.error.message})
      return
    }

    this.setState({
      ...this.state,
      isCreating : true
    })

    
    UserHandler
    .createCard(window.currentUser.username, {'source_token': token.token})
    .then((res) => {
      this.props.selectAction({card: res.data.data})
    })
    .catch((err) => {
      console.error("err: ", err)
      var errMessage = "There was an error saving your card."
      if (err.response.data && err.response.data.error) {
        console.log(err.response.data)
        var error = err.response.data.error
        if (error.message) {
          errMessage = error.message
        } else {
          errMessage = JSON.stringify(error)
        }
        
      }
      this.setState({
        ...this.state,
        error:      errMessage,
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

    var modalStyle = this.props.style || {}

    return (
      <div className="card" style={modalStyle}>
        <div className="card-header">
          <p className="card-header-title">Billing Info.</p>
        </div>

        { this.state.error && (
          <article className="message is-danger">
            <div className="message-body">
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

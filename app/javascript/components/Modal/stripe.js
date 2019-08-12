//
//  stripe.js
//  LayerKeep
// 
//  Created by Wess Cope (wess@frenzylabs.com) on 08/06/19
//  Copyright 2019 FrenzyLabs,llc.
//

import React            from 'react';
import {StripeProvider, Elements} from 'react-stripe-elements';

import BillingForm  from '../Settings/billing/form'

export default class StripeModal extends React.Component {
  title = "Update Billing";
  
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="card">
        <div className="card-header">
          <p className="card-header-title">Billing Info.</p>
        </div>

        <div className="card-content">
          <StripeProvider stripe={this.props.stripe}>
            <Elements>
              <BillingForm/>
            </Elements>
          </StripeProvider>

        </div>
      </div>
    )
  }
}

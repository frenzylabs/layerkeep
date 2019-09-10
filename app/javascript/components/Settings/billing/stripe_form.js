import React, {Component} from 'react';
import {StripeProvider, Elements, CardElement, injectStripe} from 'react-stripe-elements';
import {UserHandler}  from '../../../handlers';

import { InjectedCardSection } from './card'
import InjectedSubscriptionForm from './subscription_form';

export class StripeForm extends React.Component {
    
    constructor(props) {
      super(props);
    }

    renderStripeForm() {
      if (this.props.stripe) {
        return (
          <StripeProvider stripe={this.props.stripe}>
            <Elements>            
              <this.props.formComponent {...this.props} />
            </Elements>
          </StripeProvider>
        )
      }
    }

    render() {
      return (
        <div>
          {this.renderStripeForm()}
        </div>
      );
    }
}

export default StripeForm;
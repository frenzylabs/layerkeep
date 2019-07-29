import React, {Component} from 'react';
import {StripeProvider, Elements, CardElement, injectStripe} from 'react-stripe-elements';
import {UserHandler}  from '../../../handlers';



class CardSection extends React.Component {

  constructor(props) {
    super(props);
    this.state = {stripe: null, plans: [], subscriptions: []};
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  async handleSubmit(ev) {
    // User clicked submit
    ev.preventDefault();
    console.log("submitted", ev);

    if (this.props.stripe) {
      this.props.stripe.createToken({type: 'card', name: window.currentUser.username})
        .then((payload) => {
          console.log('[token]', payload)
          if (this.props.tokenCreated) {
            this.props.tokenCreated(payload.token)
          }
        });
    } else {
      console.log("Stripe.js hasn't loaded yet.");
    }
  }

  createUpdateCard() {

  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="example">
          <h1>Add Card</h1>
          <label>
            Card details
            <CardElement style={{base: {fontSize: '18px'}}} />
          </label>              
        <button onClick={this.handleSubmit}>Send</button>
      </div>
    </form>
    );
  }
}
export const InjectedCardSection = injectStripe(CardSection)


export default InjectedCardSection
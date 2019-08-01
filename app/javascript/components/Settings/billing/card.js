import React, {Component} from 'react';
import {StripeProvider, 
  Elements, 
  CardElement,
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  injectStripe} from 'react-stripe-elements';
import {UserHandler}  from '../../../handlers';

class CardSection extends React.Component {

  constructor(props) {
    super(props);
    var card = {expmoth: "", expyear: ""}
    if (this.props.card) {
      card.expmoth = this.props.card.attributes.exp_month
      card.expyear = this.props.card.attributes.exp_year
    }

    this.state = { stripe: null, card: card };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.createCard   = this.createCard.bind(this)
    this.changeExpMonth = this.changeExpMonth.bind(this)
    this.changeExpYear = this.changeExpYear.bind(this)
  }
  
  async handleSubmit(ev) {
    // User clicked submit
    ev.preventDefault();
    console.log("submitted", ev);

    if (this.props.stripe) {
      this.props.stripe.createToken({type: 'card', name: window.currentUser.username})
        .then((payload) => {
          console.log('[token]', payload)
          if (payload.error) {
            console.log("Payload.error")
          } else {
            console.log("CreateCard")
            var params = {'source_token': payload.token };
            this.createCard(params)
          }

        });
    } else {
      console.log("Stripe.js hasn't loaded yet.");
    }
  }

  createCard(params) {
    UserHandler.createCard(this.props.match.params.username, params)
    .then((response) => {
      console.log("Create Card")
      console.log(response)
    })
    .catch((error) => {
      console.log(error);
    }).finally(() => {
      // this.setState({loadPlans: false})
    });
  }

  changeExpMonth(el) {
    console.log(el.target.value);
    this.setState({card: {expmonth: el.target.value}})
  }
  changeExpYear(el) {
    console.log(el.target.value);
    this.setState({card: {expyear: el.target.value}})
  }

  renderEditForm() {
    return (
      <div>
        <h1>Edit Card</h1>
        <label>
          Card details
          <input type="text" name="exp-month" value={this.state.card.expmonth} placeholder="MM" onChange={this.changeExpMonth} />
          <input type="text" name="exp-year" value={this.state.card.expyear} placeholder="YY" onChange={this.changeExpYear} />
        </label>              
      </div>
    )
  }

  renderNewForm() {
    return (
      <div>
        <h1>Add Card</h1>
        <label>
          Card details
          <CardNumberElement />
          <CardExpiryElement />    
          <CardCvcElement />
        </label>              
      </div>
    )
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        {this.renderNewForm()}
        <button onClick={this.handleSubmit}>Send</button>
      
    </form>
    );
  }
}
export const InjectedCardSection = injectStripe(CardSection)


export default InjectedCardSection
import React, {Component} from 'react';
import {StripeProvider, Elements, CardElement, injectStripe} from 'react-stripe-elements';
import {UserHandler}  from '../../../handlers';

import { 
  Box,
  Container, 
  Columns, 
  Column, 
  Button, 
  Panel, 
  PanelHeading, 
  PanelBlock,
  PanelIcon,
  Card,
  CardHeader,
  CardHeaderTitle,
  CardHeaderIcon,
  CardFooter,
  CardContent,  
  Icon,
  Content,
  Level, 
  LevelItem, 
  LevelLeft, 
  LevelRight,
} from 'bloomer';


class SubscriptionForm extends React.Component {

  constructor(props) {
    super(props);
    
    this.state = {stripe: null, selectedPlan: this.props.selectedPlan || {}, plans: [], subscriptions: []};
    if (!this.props.selectedPlan && this.props.subItem) {
      // this.state.selectedPlan = this.props.subItem.item.plan
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.createSubscription = this.createSubscription.bind(this);
    this.renderPaymentMethod = this.renderPaymentMethod.bind(this);
    console.log(props)
  }
  
  async handleSubmit(ev) {
    // User clicked submit
    ev.preventDefault();
    console.log("submitted", ev);

    var amount = this.props.package.attributes.plans.reduce((total, x) => total + x.attributes.amount, 0)
      
    var params = { package_id: this.props.package.id }

    let card = this.props.card
    if (card) {
      if (this.props.subscription) {
        this.updateSubscription(params)
      } else {
        this.createSubscription(params)
      }
    }
    else if (amount > 0) {
      if (this.props.stripe) {
        this.props.stripe.createToken({type: 'card', name: window.currentUser.username})
          .then((payload) => {
            console.log('[token]', payload)
            if (payload.error) {

            } else {
              params['source_token'] = payload.token;
              // this.createSubscription(params)
              if (this.props.subscription) {
                this.updateSubscription(params)
              } else {
                this.createSubscription(params)
              }
            }
          });
      } else {
        console.log("Stripe.js hasn't loaded yet.");
      }
    } else {
      if (this.props.subscription) {
        this.updateSubscription(params)
      } else {
        this.createSubscription(params)
      }
    }
  }


  updateSubscription(params) {
    UserHandler.updateSubscription(this.props.match.params.username, this.props.subscription.id, params)
    .then((response) => {
      console.log("Update SUB")
      console.log(response)
      // this.setState({subscription: response.data})
      // this.getSubscriptions()
    })
    .catch((error) => {
      console.log(error);
    }).finally(() => {
      // this.setState({loadPlans: false})
    });
  }

  createSubscription(params) {
    console.log("CREATE SUBscription")
    
    UserHandler.createSubscription(this.props.match.params.username, params)
    .then((response) => {
      console.log("CREATE SUB")
      console.log(response)
      // this.setState({subscription: response.data})
      // this.getSubscriptions()
    })
    .catch((error) => {
      console.log(error);
    }).finally(() => {
      // this.setState({loadPlans: false})
    });
  }

  renderPackage() {
    if (this.props.package) {
      const pkg = this.props.package
      var amount = pkg.attributes.plans.reduce((total, x) => total + x.attributes.amount, 0)      
      return (
        <Card >
          <CardContent>
              <Content>
                <p className="title">{pkg.attributes.name}</p>
                  {pkg.attributes.description}
                  <br/>
                  <small>{amount}</small>
              </Content>
          </CardContent>
      </Card>
      )
    }
  }

  renderPaymentMethod() {
    let card = this.props.card
    if (card) {
      return (
        <Box>
          <h1>Payment Method</h1>
          <h3>{card.attributes.last4}</h3>
          <div>{card.attributes.exp_month}/{card.attributes.exp_year}</div>
        </Box>
      )
    } else if (!card) {
      console.log("NO CARD")
      var amount = this.props.package.attributes.plans.reduce((total, x) => total + x.attributes.amount, 0)      
      if (amount > 0) {
        return (
          <div className="example">
            <h1>Add Payment Method</h1>
            <label>
              Card details
              <CardElement style={{base: {fontSize: '18px'}}} />
            </label>          
          </div>
        )
      }
    }
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        {this.renderPackage()}
        {this.renderPaymentMethod()}
        <button onClick={this.handleSubmit}>Send</button>
    </form>
    );
  }
}
export const InjectedSubscriptionForm = injectStripe(SubscriptionForm)


export default InjectedSubscriptionForm
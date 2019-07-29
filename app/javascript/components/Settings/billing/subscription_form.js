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
    console.log(this.props.plans);
    var selectedPlan = this.state.selectedPlan
    // var plan_id = $("input[name='plan']:checked").val();
    // console.log(plan_id);
    if (!selectedPlan.id) {

    } else {
      
      var params = {plan_id: selectedPlan.id}
      console.log(selectedPlan);
      let card = this.props.cards.find(x => x.attributes.status == "active")
      if (card) {
        if (this.props.subItem) {
          console.log("has subitem", this.props.subItem)
          this.updateSubscription(params)
        } else {
          this.createSubscription(params)
        }
      }
      else if (selectedPlan.attributes.amount > 0 && selectedPlan.attributes.trial_period == 0) {
        var card_required = true
        if (this.props.stripe) {
          this.props.stripe.createToken({type: 'card', name: window.currentUser.username})
            .then((payload) => {
              console.log('[token]', payload)
              if (payload.error) {

              } else {
                params['source_token'] = payload.token;
                this.createSubscription(params)
              }
              // if (this.props.tokenCreated) {
              //   this.props.tokenCreated(payload.token)
              // }
            });
        } else {
          console.log("Stripe.js hasn't loaded yet.");
        }
      } else {
        this.createSubscription(params)
      }
    }
    
    
      if (this.state.cardToken) {
        params['source_token'] = this.state.cardToken;
      }

  }

  getCardToken() {

  }

  updateSubscription(params) {
    UserHandler.updateSubscriptionItem(this.props.match.params.username, this.props.subItem.item.id, params)
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

  tokenCreated(token) {
    console.log("token created")
    console.log(token)
    this.setState({"cardToken": token})
  }

  selectPlan(plan) {
    console.log(plan);
    this.setState({selectedPlan: plan})
  }

  renderPlans() {
    const selectedPlanID = this.state.selectedPlan.id || 0
    if (this.props.plans.length > 0) {
      return this.props.plans.map((plan, index) => {
        var checked = selectedPlanID == plan.id ? true : false
        var amountInterval = `${plan.attributes.amount} / ${plan.attributes.interval}`
        console.log("trial period", plan.attributes.trial_period);
        if (plan.attributes.trial_period > 0 && !this.props.subItem) {
          amountInterval = (<div><p>{plan.attributes.trial_period} Day Free Trial.</p><p>Then {amountInterval}</p></div>)
          
        }
        return (
          <Card key={'plan-' + plan.id} onClick={() => this.selectPlan(plan)}>
            <CardContent>
                <Content>
                  <p className="title">{plan.attributes.name}</p>
                    {plan.attributes.description}
                    <br/>
                    <small>{amountInterval}</small>
                </Content>
                <input type="radio" name="plan" value={plan.id} checked={checked} onChange={() => this.selectPlan(plan)} />  
            </CardContent>
        </Card>
        )
      });
    }
  }

  renderPaymentMethod() {
    let card = this.props.cards.find(x => x.attributes.status == "active")
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
      console.log(this.state.selectedPlan)
      if (this.state.selectedPlan.attributes && this.state.selectedPlan.attributes.amount > 0) {
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
        {this.renderPlans()}
        {this.renderPaymentMethod()}
        <button onClick={this.handleSubmit}>Send</button>
    </form>
    );
  }
}
export const InjectedSubscriptionForm = injectStripe(SubscriptionForm)


export default InjectedSubscriptionForm
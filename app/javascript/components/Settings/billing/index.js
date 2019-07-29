import React, {Component} from 'react';
import { Link } from "react-router-dom";
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
  Section
} from 'bloomer';

import { InjectedCardSection } from './card'
import { CreateSubscription } from './create_subscription'
import Modal              from '../../Modal';

export class Billing extends Component {
  constructor(props) {
    super(props);
    this.state = {loadProducts: true, loadPlans: true, loadSubscriptions: true, loadCards: true, stripe: null, modalIsActive: false, modal: {}, products: [], plans: [], product_subscriptions:{}, subscriptions: [], cards: []};
    // this.handleSubmit = this.handleSubmit.bind(this);
    this.getPlans         = this.getPlans.bind(this);
    this.getSubscriptions = this.getSubscriptions.bind(this);
    this.dismissAction    = this.dismissAction.bind(this);
    this.cancelRequest    = UserHandler.cancelSource();

    this.getProducts()
    // this.getPlans()
    this.getSubscriptions()
    this.getCards()
    window.b = this;
  }

  componentDidMount() {
    if (window.Stripe) {
      this.setState({stripe: window.Stripe(window.stripeApiKey)});
    } else {
      document.querySelector('#stripe-js').addEventListener('load', () => {
        // Create Stripe instance once Stripe.js loads
        this.setState({stripe: window.Stripe(window.stripeApiKey)});
      });
    }
  }

  componentWillUnmount() {
    this.cancelRequest.cancel("Left Page");
  }

  getPlans() {    
    UserHandler.raw("/plans", {cancelToken: this.cancelRequest.token})
    .then((response) => {
      this.setState({plans: response.data.data})
    })
    .catch((error) => {
      console.log(error);
    }).finally(() => {
      this.setState({loadPlans: false})
    });
  }

  getProducts() {    
    UserHandler.raw("/products", {cancelToken: this.cancelRequest.token})
    .then((response) => {
      let plans = response.data.included.filter(x => x.type == "plan").sort((a, b) => a.attributes.amount - b.attributes.amount)
      this.setState({products: response.data.data, plans: plans})
    })
    .catch((error) => {
      console.log(error);
    }).finally(() => {
      this.setState({loadProducts: false})
    });
  }

  getSubscriptions() {
    let user = this.props.match.params.username;
    UserHandler.raw(`/${user}/billing/subscriptions`, {cancelToken: this.cancelRequest.token})
    .then((response) => {
      this.setSubItems(response.data.data)
      // this.setState({subscriptions: response.data})
    })
    .catch((error) => {
      console.log(error);
    }).finally(() => {
      this.setState({loadSubscriptions: false})
    });
  }

  setSubItems(subscriptions) {
    var subprods = {}
    for (var i in subscriptions) {
      let sub = subscriptions[i]
      for (var j in sub.attributes.items) {
        let item = sub.attributes.items[j]
        var subitem = subprods[item.attributes.plan.attributes.product_id] 
        
        if (!subitem) {
          subitem = {is_trial: sub.attributes.is_trial, trialed: sub.attributes.is_trial, current_period_end: sub.attributes.current_period_end, item: item}
        } else {
          if (sub.attributes.is_trial) {
            subitem["trialed"] = true
          } else {
            subitem["is_trial"] = false
            subitem["current_period_end"] = sub.attributes.current_period_end
            subitem["item"] = item
          }
        }
        subprods[item.attributes.plan.attributes.product_id] = subitem
      }
    }
    this.setState({product_subscriptions: subprods})
  }


  getCards() {
    let user = this.props.match.params.username;
    UserHandler.raw(`/${user}/billing/cards`, {cancelToken: this.cancelRequest.token})
    .then((response) => {
      this.setState({cards: response.data.data})
    })
    .catch((error) => {
      console.log(error);
    }).finally(() => {
      this.setState({loadCards: false})
    });
  }

  tokenCreated(token) {
    console.log("token created")
    this.setState({"cardToken": token})
  }

  renderStripeForm() {
    return (
      <StripeProvider stripe={this.state.stripe}>          
        <Elements>            
          <InjectedCardSection tokenCreated={this.tokenCreated.bind(this)} />
        </Elements>
      </StripeProvider>
    )
  }

  
  renderProducts() {
    if (this.state.products.length > 0) {

      return this.state.products.map((prod, index) => {
        var plans = this.state.plans.filter(x => x.attributes.product_id == prod.id)
        return this.renderProductSubscription(prod, plans)
        
      });
    } 
  }



  renderProductSubscription(prod, plans) {
    var prodSub = this.state.product_subscriptions[prod.id]
    console.log(prodSub)
    var name = prod.attributes.name
    var description = ""
    var amount_interval = (<span />)
    var sub_action = "Manage"
    var selectedPlan = {}
    if (prodSub) {
      var customPlan = false
      var canUpgrade = false
      var subAction = "Manage"
      var curPlan = prodSub.item.attributes.plan

      var existingPlanIndex = plans.findIndex(x => x.id == curPlan.id)
      if (existingPlanIndex >= 0) {
        if (plans.length -1 > existingPlanIndex ) {
          selectedPlan = plans[existingPlanIndex+1]
          canUpgrade = true
        }
      } else {
        customPlan = true
      }
      
      name = prodSub.item.attributes.plan.attributes.name

      if (prodSub.is_trial) {
        canUpgrade = true
        if (Date.now() / 1000 > prodSub.current_period_end) {
          // trial expired
          amount_interval = "Trial Expired"
        } else {
          var diff = dayjs.unix(prodSub.current_period_end).diff(dayjs(Date.now()), 'day')
          amount_interval = (<span>{diff} Day{diff > 1 ? 's' : ''} Left in Free Trial</span>)
        }
      } else {
        amount_interval = (<span>{curPlan.attributes.amount} / {curPlan.attributes.interval}</span>);
      }
      
      
      if (customPlan) subAction = "Manage"
      else if (canUpgrade) subAction = "Upgrade"

      return (
        <Level key={'prod-' + prod.id}>
          <LevelLeft>
            <LevelItem>
              {curPlan.attributes.name}
            </LevelItem>
            <LevelItem>
              {curPlan.attributes.description}
            </LevelItem>
            
          </LevelLeft>
          <LevelRight>
            <LevelItem>
              {amount_interval}
            </LevelItem>
            <Button onClick={() => this.activateModal(prod, prodSub, selectedPlan)}>{subAction}</Button>

          </LevelRight>              
        </Level>
      )    
      
    } else {
      // console.log(plans)
      if (plans.length > 0) {
        var curPlan = plans[0]
        
        if (curPlan.attributes.amount == 0) {
          if (plans.length > 1) {
            sub_action = "Upgrade "
            selectedPlan = plans[1]
          }
          amount_interval = (<span>{curPlan.attributes.amount} / {curPlan.attributes.interval}</span>);
        } else {
          selectedPlan = curPlan
          sub_action = "Subscribe"
          if (curPlan.attributes.trial_period > 0) {
            amount_interval = (<span>{curPlan.attributes.trial_period} Day Free Trial</span>)
          } else {
            amount_interval = (<span>{curPlan.attributes.amount} / {curPlan.attributes.interval}</span>);
          }
        }

        return (
          <Level key={'prod-' + prod.id}>
            <LevelLeft>
              <LevelItem>
                {prod.attributes.name}
              </LevelItem>
              <LevelItem>
                {curPlan.attributes.description}
              </LevelItem>
              
            </LevelLeft>
            <LevelRight>
              <LevelItem>
                {amount_interval}
              </LevelItem>
              <Button onClick={() => this.activateModal(prod, null, selectedPlan)}>{sub_action}</Button>

            </LevelRight>              
          </Level>
        )
      }
    }
    return null
  }

  activateModal(prod, currentSubItem, selectedPlan) {
    var plans = this.state.plans.filter(x => x.attributes.product_id == prod.id)
    var modal = {product: prod, plans: plans, subItem: currentSubItem, selectedPlan: selectedPlan}
    this.setState({modal: modal, modalIsActive: true})
  }

  dismissAction() {
    this.setState({modalIsActive: false, modal: {}})
  }

  renderSubModal() {
    if (this.state.modalIsActive) {
      let modal = this.state.modal
      let cards = this.state.cards
      return (<Modal {...this.props}  component={CreateSubscription} isActive={this.state.modalIsActive} dismissAction={this.dismissAction} stripe={this.state.stripe} cards={cards} {...modal} />)
    }
  }

  renderCards() {
    if (this.state.cards.length > 0) {
      return this.state.cards.map((card, index) => {
        return (
          <PanelBlock key={'card-' + card.id}>
            {card.attributes.brand}
            <p>{card.attributes.last4}</p>
            {card.attributes.exp_month}/{card.attributes.exp_year}
          </PanelBlock>  
        )
      });
    }
  }

  render() {
    return (
        <div>
          <div>{this.renderProducts()}</div>
          <div></div>
          <Section>
          <Card>
            <CardHeader>Payment Method</CardHeader>
            <CardContent>
              {this.renderCards()}
            </CardContent>
          </Card>  
          </Section>  
          <div>{this.renderSubModal()}</div>
        </div>
    );
  }
}

export default Billing;
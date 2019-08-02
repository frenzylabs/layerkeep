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

import { StripeForm } from './stripe_form'
import { InjectedSubscriptionForm } from './subscription_form'
import { InjectedCardSection } from './card'
import Modal              from '../../Modal';

export class Billing extends Component {
  constructor(props) {
    super(props);
    this.state = {loadPackages: true, loadSubscriptions: true, loadCards: true, stripe: null, modalIsActive: false, modal: {}, packages: [], subscription: null, card: {}};

    this.getPackages      = this.getPackages.bind(this);
    this.getSubscriptions = this.getSubscriptions.bind(this);
    this.dismissAction    = this.dismissAction.bind(this);
    this.cancelRequest    = UserHandler.cancelSource();

    this.getPackages()
    this.getSubscriptions()
    this.getActiveCard()
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

  getPackages() {    
    UserHandler.raw("/packages", {cancelToken: this.cancelRequest.token})
    .then((response) => {
      this.setState({packages: response.data.data})
    })
    .catch((error) => {
      console.log(error);
    }).finally(() => {
      this.setState({loadPackages: false})
    });
  }

  getSubscriptions() {
    let user = this.props.match.params.username;
    UserHandler.raw(`/${user}/billing/subscriptions`, {cancelToken: this.cancelRequest.token})
    .then((response) => {      
      // this.setState({subscriptions: response.data.data})
      if (response.data.data && response.data.data.length > 0)
        this.setState({subscription: response.data.data[0]})
    })
    .catch((error) => {
      console.log(error);
    }).finally(() => {
      this.setState({loadSubscriptions: false})
    });
  }


  getActiveCard() {
    let user = this.props.match.params.username;
    UserHandler.raw(`/${user}/billing/cards`, {cancelToken: this.cancelRequest.token})
    .then((response) => {
      this.setState({card: response.data.data})
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

  subscribeToPackage(pkg) {
    var modal = {package: pkg, subscription: this.state.subscription, card: this.state.card, component: StripeForm, formComponent: InjectedSubscriptionForm}
    this.setState({modal: modal, modalIsActive: true})
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

  renderPackages() {
    if (this.state.packages.length > 0) {
      return this.state.packages.map((pkg, index) => {
        var pkg_amount = pkg.attributes.plans.reduce((total, x) => x.attributes.amount + total, 0)
        return (
          <div className="tile box is-child" key={'pack'+ pkg.id}>
            <article className="message is-success">
              <p className="message-header">{pkg.attributes.name}</p>
              <div className="message-body">
                {pkg.attributes.description}
                {pkg.attributes.description}
                {pkg.attributes.description}
                {pkg.attributes.description}
              </div>
              <footer className="card-footer">
                <p>
                  {pkg_amount}
                </p>
                <p className="card-footer-item">
                  <span>
                    <button onClick={() => this.subscribeToPackage(pkg)}>Subscribe</button>
                  </span>
                </p>
              </footer>
            </article>
          </div>
        )
      })
    }
  }

  renderPackageName(sub) {
    var pkg = this.state.packages.find(x => x.id == sub.attributes.package_id)
    if (pkg) {
      return (
        <p>
          {pkg.attributes.name}
        </p>
      )
    }
  }

  renderSubscription() {
    if (this.state.subscription) {
      var sub = this.state.subscription      
      var amount_interval = sub.attributes.items.reduce((total, x) => x.attributes.plan.attributes.amount + total, 0)
      return (
        <Level>
          <LevelLeft>
            <LevelItem>              
              {this.renderPackageName(sub)}
              {sub.attributes.name}
            </LevelItem>
            <LevelItem>
              {sub.attributes.items.length > 0 ? sub.attributes.items[0].description : ''}
            </LevelItem>
            
          </LevelLeft>
          <LevelRight>
            <LevelItem>
              {amount_interval}
            </LevelItem>

          </LevelRight>              
        </Level>
      )
      // for (var j in sub.attributes.items) {
      //   let item = sub.attributes.items[j]
        // var subitem = subprods[item.attributes.plan.attributes.product_id] 
        
        // if (!subitem) {
        //   subitem = {is_trial: sub.attributes.is_trial, trialed: sub.attributes.is_trial, current_period_end: sub.attributes.current_period_end, item: item}
        // } else {
        //   if (sub.attributes.is_trial) {
        //     subitem["trialed"] = true
        //   } else {
        //     subitem["is_trial"] = false
        //     subitem["current_period_end"] = sub.attributes.current_period_end
        //     subitem["item"] = item
        //   }
        // }        
      // }
    } else {

    }
  }
  

  activateModal(pkg) {
    var modal = {package: pkg, subscription: this.state.subscription, card: this.state.card, component: StripeForm, formComponent: InjectedSubscriptionForm}
    this.setState({modal: modal, modalIsActive: true})
  }

  dismissAction() {
    this.setState({modalIsActive: false, modal: {}})
  }

  renderSubModal() {
    if (this.state.modalIsActive) {
      let modal = this.state.modal
      let card = this.state.card
      return (<Modal {...this.props}  isActive={this.state.modalIsActive} dismissAction={this.dismissAction} stripe={this.state.stripe} card={card} {...modal} />)
    }
  }

  activateCreditCard(card) {
    var modal = { card: card, component: StripeForm, formComponent: InjectedCardSection  }
    this.setState({ modal: modal, modalIsActive: true })
  }

  renderCard() {
    if (this.state.card && this.state.card.attributes) {
      let card = this.state.card
      return (
        <article className="media" key={'card-' + card.id}>
          <figure className="media-left">
            <strong>{card.attributes.brand}</strong>
            <small>{card.attributes.last4}</small>
            <p>Exp: {card.attributes.exp_month} / {card.attributes.exp_year}</p>
            <a onClick={() => this.activateCreditCard(card)}>Edit</a>
          </figure>
        </article>
      )
    } else {
      return (
        <Level >
          <LevelLeft>
            <LevelItem>
              Add Card
            </LevelItem>
            <LevelItem>
            </LevelItem>
            
          </LevelLeft>
          <LevelRight>
            <LevelItem>
              <a onClick={() => this.activateCreditCard()}>Add</a>
            </LevelItem>

          </LevelRight>              
        </Level>
      )
    }
  }

  render() {
    return (
        <div>
          <Section>
            <Card>
              <CardHeader>Payment Method</CardHeader>
              <CardContent>
                {this.renderCard()}
              </CardContent>
            </Card>  
          </Section>
          <Section>
            <Card>
              <CardHeader>Subscription</CardHeader>
              <CardContent>
                {this.renderSubscription()}
              </CardContent>
            </Card>  
          </Section>
          <Section>
            <h3>Packages</h3>
            <div className="tile is-ancestor">
              {this.renderPackages()}
            </div>
          </Section>
          
          
          <div>{this.renderSubModal()}</div>
        </div>
    );
  }
}

export default Billing;
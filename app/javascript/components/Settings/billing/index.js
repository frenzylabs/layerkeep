//
//  index.js
//  LayerKeep
// 
//  Created by Kevin Musselman (kevin@frenzylabs.com) on 08/02/19
//  Copyright 2019 FrenzyLabs,llc.
//

import React, {Component} from 'react';
import { connect } from 'react-redux'
import { UserHandler }  from '../../../handlers';


import { StripeForm } from './stripe_form'
import { InjectedCardSection } from './card'
import Modal              from '../../Modal'

import {
  PaymentMethod,
  Subscription,
  Packages
 } from './sections'


import { updateFeatures } from '../../../states/actions'

class BillingSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadPackages: true, 
      loadSubscriptions: true, 
      loadCards: true, 
      stripe: null, 
      modalIsActive: false, 
      modal: {}, 
      packages: [], 
      subscription: null, 
      card: {},
      packageModalActive: false
    };

    this.getPackages      = this.getPackages.bind(this);
    this.getSubscriptions = this.getSubscriptions.bind(this);
    this.dismissAction    = this.dismissAction.bind(this);
    this.getCard          = this.getCard.bind(this);

    this.cancelRequest    = UserHandler.cancelSource();

    window.b = this;
  }

  componentDidMount() {
    this.getPackages()
    this.getSubscriptions()
    this.getActiveCard()

    if (window.Stripe) {
      this.setState({
        stripe: window.Stripe(window.stripeApiKey)
      });
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
    this.setState({loadPackages: true})
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
    this.setState({loadSubscriptions: true})
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
    this.setState({loadCards: true})
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

  currentPackage() {
    let sub = this.state.subscription
    var pkg = null
    if (sub) {
      pkg = this.state.packages.find(x => x.id == sub.attributes.package_id)
      if (pkg) {
        return pkg;
      } else {
        return {attributes: {name: "Custom"}, id: sub.attributes.package_id}
      }
    } else {
      var pkg = this.state.packages.find(x => x.attributes.name.toLowerCase() == "free")
      if (pkg) {
        return pkg;
      } else {
        
      }
    }
  }

  dismissAction() {
    this.setState({
      ...this.state,
      modalIsActive:      false, 
      packageModalActive: false,
      modal:              {}
    })
  }


  selectAction() {
    if(arguments.length > 0) {
      if (arguments[0].card) {
        this.getActiveCard()
      }
      if (arguments[0].subscription) {
        this.props.onSubscriptionChange()
        this.getSubscriptions()
      }
    }
    this.dismissAction()
  }

  renderStripeModal() {
    if (this.state.modalIsActive) {
      let modal = this.state.modal
      let card  = this.state.card

      return (
        <Modal 
          {...this.props}  
          isActive={this.state.modalIsActive} 
          dismissAction={this.dismissAction} 
          selectAction={this.selectAction.bind(this)}
          stripe={this.state.stripe} 
          attributes={modal}
          card={card}
          component={Modal.stripe}
        />
      )
    }
  }


  renderPackageSelectModal() {
    if (this.state.packageModalActive) {
      return(
        <Modal 
          {...this.props}
          selectedPackage={this.state.selectedPackage}
          subscription={this.state.subscription}
          card={this.state.card}
          stripe={this.state.stripe}
          isActive={this.state.packageModalActive}
          component={Modal.packageSelect}
          dismissAction={this.dismissAction} 
          selectAction={this.selectAction.bind(this)}
        />
      )
    }
  }

  activateCreditCard(card) {
    var modal = { 
      card: card, 
      stripe: this.state.stripe,
      component: StripeForm, 
      formComponent: InjectedCardSection  
    }

    this.setState({ 
      ...this.state,
      modal: modal, 
      modalIsActive: true 
    })
  }

  getCard() {
    if (this.state.card && this.state.card.attributes) {
      return this.state.card
    }

    return {
      attributes: {}
    }
  }

  selectPackage(pkg) {
    this.setState({
      ...this.state,
      packageModalActive: true,
      selectedPackage: pkg
    })
  }

  render() {
    return (
        <div>
          <PaymentMethod 
            loading={this.state.loadCards}
            card={this.getCard()} 
            onClick={this.activateCreditCard.bind(this)} 
          />
          
          <br/>

          <Subscription 
            loading={this.state.loadSubscriptions}
            subscription={this.state.subscription}
            package={this.currentPackage()}
          />

          <br/>

          <Packages
            loading={this.state.loadPackages}
            packages={this.state.packages || []}
            packageClick={this.selectPackage.bind(this)}
            subscription={this.state.subscription}
            currentPackage={this.currentPackage()}
            user={this.props.match.params.username}
          />

          {this.renderStripeModal()}
          {this.renderPackageSelectModal()}
        </div>
    );
  }
}


const mapStateToProps = (state, ownProps) => ({
  state
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  onSubscriptionChange: () => dispatch(updateFeatures(ownProps.match.params.username)),
  dispatch: dispatch
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BillingSettings)

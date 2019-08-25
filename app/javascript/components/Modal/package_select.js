//
//  package_select.js
//  LayerKeep
// 
//  Created by Wess Cope (me@wess.io) on 08/12/19
//  Copyright 2019 Wess Cope
//

import React        from 'react'
import SpinnerModal from './spinner'
import UserHandler                from '../../handlers/user_handler'
import StripeModal                from './stripe'

export default class PackageSelectModal extends React.Component {
  title = "Update Package";
  
  constructor(props) {
    super(props);

    this.state = {
      isCreating: false,
      error: null
    }
  }

  subscibeToPackage(card = {}) {
    // User clicked submit
    this.setState({ isCreating : true })
    var params = { package_id: this.props.selectedPackage.id }
    var request;
    if (this.props.subscription) {
      request = UserHandler.updateSubscription(this.props.match.params.username, this.props.subscription.id, params)
    } else {
      request = UserHandler.createSubscription(this.props.match.params.username, params)
    }

    request.then((response) => {
      this.props.selectAction(Object.assign(card, {subscription: response.data}))
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
        error:      errMessage,
        isCreating: false
      })
    }).finally(() => {

    });
  }

  updateCardAction() {
    if(arguments.length > 0 && arguments[0].card) {
      this.subscibeToPackage({card: arguments[0].card })
    } else {
      this.props.dismissAction(arguments)
    }
  }

  renderFooter() {
    var amount = this.props.selectedPackage.attributes.plans.reduce((total, x) => total + x.attributes.amount, 0)    
    if (amount > 0 && !this.props.card) {
      return (
        <footer className="card-footer">
          <StripeModal {...this.props} selectAction={this.updateCardAction.bind(this)} style={{width: '100%'}} />
        </footer>
      )
    } else {
      if(this.state.isCreating) {
        return (
          <SpinnerModal caption="Saving..."/>
        )
      }
      return (
        <footer className="card-footer">
          <a className="card-footer-item" onClick={() => this.subscibeToPackage() }>Confirm</a>
          <a className="card-footer-item" onClick={this.props.dismissAction}>Cancel</a>
        </footer>
      )
    }
  }

  renderPlan() {
    return this.props.selectedPackage.attributes.plans.map(pl => { 
      return (<li key={pl.id} >{pl.attributes.description}</li>)
    })
  }



  render() {
    return (
      <div className="card" style={{border: 'none'}}>
        <div className="card-header">
          <p className="card-header-title">Update Subscription to {this.props.selectedPackage.attributes.name}</p>
        </div>

        { this.state.error && (
          <article className="message is-danger">
            <div className="message-body">
              {this.state.error}
            </div>
          </article>
        )}

        <div className="card-content">
          <p>
            {this.props.selectedPackage.attributes.description}
          </p>

          <br/>

          <ul style={{listStyle: 'circle', marginLeft: '20px'}}>
            {this.renderPlan()}
          </ul>
        </div>

          {this.renderFooter()}
          
      </div>
    )
  }
}

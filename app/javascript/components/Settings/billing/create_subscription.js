import React, {Component} from 'react';
import {StripeProvider, Elements, CardElement, injectStripe} from 'react-stripe-elements';
import {UserHandler}  from '../../../handlers';

import { InjectedCardSection } from './card'
import InjectedSubscriptionForm from './subscription_form';

// class SubscriptionForm extends React.Component {

//   constructor(props) {
//     super(props);
//     this.state = {stripe: null, plans: [], subscriptions: []};
//     this.handleSubmit = this.handleSubmit.bind(this);
//   }
  
//   async handleSubmit(ev) {
//     // User clicked submit
//     ev.preventDefault();
//     console.log("submitted", ev);

//     if (this.props.stripe) {
//       this.props.stripe.createToken({type: 'card', name: window.currentUser.username})
//         .then((payload) => {
//           console.log('[token]', payload)
//           if (this.props.tokenCreated) {
//             this.props.tokenCreated(payload.token)
//           }
//         });
//     } else {
//       console.log("Stripe.js hasn't loaded yet.");
//     }
//   }

//   createUpdateCard() {

//   }

//   render() {
//     return (
//       <form onSubmit={this.handleSubmit}>
//         <div className="example">
//           <h1>Add Card</h1>
//           <label>
//             Card details
//             <CardElement style={{base: {fontSize: '18px'}}} />
//           </label>              
//         <button onClick={this.handleSubmit}>Send</button>
//       </div>
//     </form>
//     );
//   }
// }
// export const InjectedSubscriptionForm = injectStripe(SubscriptionForm)


// function withStripe(WrappedComponent) {
//   // ...and returns another component...
//   return class extends React.Component {
//     constructor(props) {
//       super(props);
//       // this.handleChange = this.handleChange.bind(this);
      
//     }

//     // componentDidMount() {
//     //   // ... that takes care of the subscription...
//     //   DataSource.addChangeListener(this.handleChange);
//     // }

//     // componentWillUnmount() {
//     //   DataSource.removeChangeListener(this.handleChange);
//     // }

//     // handleChange() {
//     //   this.setState({
//     //     data: selectData(DataSource, this.props)
//     //   });
//     // }

//     render() {
//       // ... and renders the wrapped component with the fresh data!
//       // Notice that we pass through any additional props
//       return (
//         <StripeProvider stripe={this.props.stripe}>
//           <Elements>            
//             <WrappedComponent {...this.props} />
//           </Elements>
//         </StripeProvider>
//       )
//     }
//   };
// }

// function inject(CardComponent) {
export class CreateSubscription extends React.Component {
    
    constructor(props) {
      super(props);
      console.log("CREATE SuBSCRIPTION")
    }

    renderStripeForm() {
      if (this.props.stripe) {
        return (
          <StripeProvider stripe={this.props.stripe}>
            <Elements>            
              <InjectedSubscriptionForm {...this.props} />
            </Elements>
          </StripeProvider>
        )
      }
    }

    render() {
      return (
        <div>
          <h3>{this.props.product.attributes.name}</h3>
          {this.renderStripeForm()}
        </div>
      );
    }
  // }
}

// export const CreateSubscription = inject(InjectedCardSection)

export default CreateSubscription;
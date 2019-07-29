// import React, {Component} from 'react';
// import {StripeProvider, Elements, CardElement, injectStripe} from 'react-stripe-elements';
// import {UserHandler}  from '../../handlers';


// class CardSection extends React.Component {
//   render() {
//     return (
//       <label>
//         Card details
//         <CardElement style={{base: {fontSize: '18px'}}} />
//       </label>
//     );
//   }
// }

// const InjectedCardSection = CardSection;


// class PaymentSection extends React.Component {

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
//         .then((payload) => console.log('[token]', payload));
//     } else {
//       console.log("Stripe.js hasn't loaded yet.");
//     }
//   }

//   createSubscription() {

//   }

//   render() {
//     return (
//       <form onSubmit={this.handleSubmit}>
//         <div className="example">
//           <h1>React Stripe Elements Example</h1>
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
// const InjectedPaymentSection = injectStripe(PaymentSection)



// export class Billing extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {stripe: null, plans: [], subscriptions: []};
//     // this.handleSubmit = this.handleSubmit.bind(this);
//     this.getPlans = this.getPlans.bind(this);
//     this.cancelRequest = UserHandler.cancelSource();

//     this.getPlans()
//   }

//   componentDidMount() {
//     if (window.Stripe) {
//       this.setState({stripe: window.Stripe(window.stripeApiKey)});
//     } else {
//       document.querySelector('#stripe-js').addEventListener('load', () => {
//         // Create Stripe instance once Stripe.js loads
//         this.setState({stripe: window.Stripe(window.stripeApiKey)});
//       });
//     }
//   }

//   componentWillUnmount() {
//     this.cancelRequest.cancel("Left Page");
//   }

//   getPlans() {
//     this.setState({loadPlans: true})
//     UserHandler.raw("/plans", {cancelToken: this.cancelRequest.token})
//     .then((response) => {
//       this.setState({plans: response.data})
//     })
//     .catch((error) => {
//       console.log(error);
//     }).finally(() => {
//       this.setState({loadPlans: false})
//     });
//   }

//   getSubscriptions() {
//     UserHandler.raw("/user_subscriptions", {cancelToken: this.cancelRequest.token})
//     .then((response) => {
//       this.setState({subscriptions: response.data})
//     })
//     .catch((error) => {
//       console.log(error);
//     });
//     // var url = this.props.match.url
//     // var params = {}
//     // if (this.state.project) {
//     //   params["repo_id"] = this.state.project.id
//     // }
//     // var id = this.props.match.params.revisionPath;
//     // UserHandler.show(this.props.match.params.username, id, {params, cancelToken: this.cancelRequest.token})
//     // .then((response) => {
//     //   this.updateSubscription(response.data)
//     // })
//     // .catch((error) => {
//     //   console.log(error);
//     // });
//   }



//   renderSubscription() {
//     if (this.state.subscriptions.length > 0) {
      
//     }
//   }

//   renderPlans() {
//     if (this.state.plans.length > 0) {
//       return this.state.plans.map((plan, index) => {
//         return (
//           <PanelBlock key={'plan-' + plan.id}>
//             <PanelIcon className={"far " + ( project.attributes.is_private ? 'fa-lock' : 'fa-layer-group' )}/>
//             {plan.attributes.name}
//             <input type="radio" name="plan" value={plan.id} />
//           </PanelBlock>  
//         )
//       });
//     } else if(this.state.loadPlans) {
//       return (<div>Loading</div>)
//     } 
//   }

//   renderCards() {
//     if (this.state.cards.length > 0) {
//       return this.state.plans.map((plan, index) => {
//         return (
//           <PanelBlock key={'plan-' + plan.id}>
//             <PanelIcon className={"far " + ( project.attributes.is_private ? 'fa-lock' : 'fa-layer-group' )}/>
//             {plan.attributes.name}
//             <input type="radio" name="plan" value={plan.id} />
//           </PanelBlock>  
//         )
//       });
//     } else if(this.state.loadCards) {
//       return (<div>Loading</div>)
//     } else {
//       return (
//         <div>
//           Add Payment Method
//         </div>
//       )
//     }
//   }

//   render() {
//     return (
//         <StripeProvider stripe={this.state.stripe}>          
//           <Elements>            
//             <InjectedPaymentSection />
//           </Elements>
//         </StripeProvider>
//     );
//   }
// }

// export default Billing;
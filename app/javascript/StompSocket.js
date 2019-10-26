/*
 *  App.js
 *  LayerKeep
 * 
 *  Created by Kevin Musselman (kmussel@gmail.com) on 05/23/19
 *  Copyright 2019 Frenzylabs
 */

import React              from 'react'
import { connect }        from 'react-redux';


import webstomp from 'webstomp-client';

class StompSocket extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      client: null,
      subscriptions: {},
      vhost: 'users',
      timeStamp: Date.now(),
      maxReconnect: 5
    };

    this.onOpen    = this.onOpen.bind(this);
    this.onConnect = this.onConnect.bind(this);
    this.onError   = this.onError.bind(this);
    this.onMessage = this.onMessage.bind(this);
    this.connect   = this.connect.bind(this);

  }

  componentDidMount() {
    this.connect()
  }

  componentDidUnMount() {
    this.state.client.disconect(() => { console.log("Disconnected");})
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.user != prevProps.user || this.props.password != prevProps.password || this.state.client != prevState) {
      this.connect()
    }
    
    if (this.props.topics != prevProps.topics) {
      this.handleSubscriptions()
    }
  }

  setupWebSocket = () => {
   var protocol = document.location.protocol == "https:" ? 'wss' : 'ws';
   var wspath = `${protocol}://${document.location.hostname}/ws`
   var client = webstomp.client(wspath, {debug: false});   
   client.ws.onopen = this.onOpen
   this.setState( { client: client })
  }

  handleSubscriptions() {
    var subs = this.state.subscriptions;
    Object.keys(subs).forEach((key) => {
      subs[key].unsubscribe()
    })
    subs = []
    this.props.topics.forEach((topic, index) => {
      subs[topic] = this.state.client.subscribe(topic, this.onMessage)
    });
    this.setState( {subscriptions: subs})
  }

  onOpen() {
    this.connect()
  }

  connect() {
    if (this.state.client) {
      if (!this.state.client.connected) {
        if (this.state.client.ws.readyState == this.state.client.ws.OPEN) {
          this.state.client.connect(this.props.user, this.props.password, this.onConnect, this.onError, this.state.vhost)
        }
        else if (this.state.client.ws.readyState == this.state.client.ws.CLOSED) {
          this.setupWebSocket()  
        }
      }
    } else {
      this.setupWebSocket()
    }
  }

  onConnect() {
    this.handleSubscriptions()    
    if (this.props.onConnect) { this.props.onConnect() }
  }

  onError(err) {
    console.log("Error, ", err);
    if (this.state.maxReconnect > 0) {
      this.setState({ maxReconnect: this.state.maxReconnect - 1 }, this.connect);
    } else {
      console.log("Failed to Connect")
      if (this.props.onError) { this.props.onError(err) }
    }
  }

  onMessage(msg) {
    if (this.props.onMessage) { this.props.onMessage(msg) }
  }

  render() {
      return <span />;
  }
}

const mapStateToProps = (state) => {
  return state
}

function mapDispatchToProps() {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(StompSocket);

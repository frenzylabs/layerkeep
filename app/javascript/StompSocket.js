/*
 *  App.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 04/23/19
 *  Copyright 2018 WessCope
 */

import React              from 'react'
import { connect }        from 'react-redux';


import webstomp from 'webstomp-client';

class StompSocket extends React.Component {
  constructor(props) {
    super(props);
    var topics = [];
    if (currentUser && currentUser.username) {
      topics = ["LK.#", currentUser.username]
    }
    this.state = {
      user: '',
      pwd: '',
      vhost: 'users',
      timeStamp: Date.now(),
      maxReconnect: 4,
      topics: topics
    };

    this.onOpen    = this.onOpen.bind(this);
    this.onConnect = this.onConnect.bind(this);
    this.onError   = this.onError.bind(this);
    this.onMessage = this.onMessage.bind(this);
    this.connect   = this.connect.bind(this);
    

    console.log("INSIDE WEBSOCKET")
    this.connect()
  }

  componentDidUpdate(prevProps) {
    console.log(prevProps);
    this.connect()
  }

  setupWebSocket = () => {
   var protocol = document.location.protocol == "https" ? 'wss' : 'ws';
   var wspath = `${protocol}://${document.location.hostname}/ws`
   this.client = webstomp.client(wspath, {debug: false});
   this.client.ws.onopen = this.onOpen
  }

  onOpen() {
    console.log("ON OPEN");
    this.connect()    
  }

  connect = () => {    
    if (this.client && this.client.connected) {
      console.log("INSIDE WEBSOCKET ALREADY CONNECTED")
      return
    }
    else if (this.client && this.client.ws.readyState == this.client.ws.OPEN) {
      console.log("INSIDE WEBSOCKET CONNECT IS READY")
      this.client.connect(this.props.user, this.props.password, this.onConnect, this.onError, this.state.vhost)
    } 
    else {
      this.setupWebSocket()
      if (this.client.ws.readyState == this.client.ws.OPEN) {
        console.log("INSIDE WEBSOCKET CONNECT IS READY 2")
        this.client.connect(this.props.user, this.props.password, this.onConnect, this.onError, this.state.vhost)
      } else {
        console.log("INSIDE CONNECT NOT READY: ", this.client.ws.readyState);
      }
    }

  }

  onConnect() {
    console.log("CONNECTED")
    this.props.topics.forEach((topic, index) => {
      this.client.subscribe(topic, this.onMessage)
    });
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
    console.log("MESSAGE: ", msg)
    if (this.props.onMessage) { this.props.onMessage(msg) }
  }

  render() {
      return <span />;
  }
}
export default StompSocket;
// WebSocket.defaultProps = {
//     name: 'something',
//     maxReconnect: 5,
//   };

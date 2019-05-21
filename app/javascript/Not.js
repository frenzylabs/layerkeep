/*
 *  App.js
 *  LayerKeep
 * 
 *  Created by Kevin Musselman (kmussel@gmail.com) on 05/21/19
 *  Copyright 2018 FrenzyLabs
 */

import React              from 'react'
import { connect }        from 'react-redux';
import { BrowserRouter }  from 'react-router-dom'

import UserHandler from './handlers/user_handler';
import StompSocket from './StompSocket';

import { toast }          from 'react-toastify';

class Not extends React.Component {
  constructor(props) {
    super(props);
    var topics = []
    if (currentUser) {
      topics = ['/topic/LK.#', '/topic/'+currentUser.username]
    }
    this.state = {token: null, topics: topics}

    this.onConnect  = this.onConnect.bind(this);
    this.onError    = this.onError.bind(this);
    this.onMessage  = this.onMessage.bind(this);
    this.authToken  = this.authToken.bind(this);

    window.not = this;

    
    this.authToken()
  }


  authToken() {
    UserHandler.authToken()
    .then((response) => {
      console.log(response)
      this.setState( {token: response.data.token });
    })
    .catch((error) => {
      console.log(error);
    });
  }

  // sendMessage = (msg) => {
  //   this.clientRef.sendMessage('/topics/all', msg);
  // }

  onConnect() {
    console.log("CONNECTED NOTI")
  }

  onError(err) {
    console.log("ErrorFromNot, ", err);
  }

  onMessage(msg) {
    console.log("INSIDE NOT MSG, ", msg);    
    toast("MSG= " + msg.body );
  }

  renderConn() {
    
  }

  render() {
    if (!(currentUser && currentUser.username && this.state.token)) {
      console.log("INSIDE RENDER EMPTY DIV")
      return (<div></div>)
    } else {
      console.log("RENDER WEBSOCKET")
    }
    return (
      <div>
        <StompSocket user={currentUser.username} password={this.state.token} topics={this.state.topics}
            onConnect={this.onConnect}
            onError={this.onError}
            onMessage={this.onMessage}
            ref={ (client) => { this.clientRef = client }} />
      </div>
    );
  }
  rrender() {
    return (<div></div>);
  }
}

const mapStateToProps = (state) => {
  return state
}

function mapDispatchToProps() {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Not);

/*
 *  App.js
 *  LayerKeep
 * 
 *  Created by Kevin Musselman (kmussel@gmail.com) on 05/21/19
 *  Copyright 2018 FrenzyLabs
 */

import React              from 'react'
import { connect }        from 'react-redux';

import UserHandler from './handlers/user_handler';
import StompSocket from './StompSocket';

import { toast }          from 'react-toastify';

class RemoteMessage extends React.Component {
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

    this.authToken()
  }

  componentDidUpdate(prevProps, prevState) {
  }


  authToken() {
    UserHandler.authToken()
    .then((response) => {
      this.setState( {token: response.data.token });
    })
    .catch((error) => {
      console.log(error);
    });
  }

  onConnect() {
    console.log("Remote Notifications Connected")
  }

  onError(err) {
    console.log("ErrorFromNot, ", err);
  }

  onMessage(msg) {
    console.log("INSIDE NOT MSG, ", msg);    
    toast("MSG= " + msg.body, { autoClose: 150000 } );
  }


  render() {
    if (!(currentUser && currentUser.username && this.state.token)) {
      return (<div></div>)
    }
    return (
      <div>
        <StompSocket user={currentUser.username} password={this.state.token} topics={this.state.topics}
            onConnect={this.onConnect}
            onError={this.onError}
            onMessage={this.onMessage} />
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

export default connect(mapStateToProps, mapDispatchToProps)(RemoteMessage);

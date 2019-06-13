/*
 *  error.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 06/13/19
 *  Copyright 2018 WessCope
 */

import React from 'react';

export default class ErrorModal extends React.Component {
  static parentStyles = {background: '#fe3b61'};
  
  render() {
    const caption = this.props.caption || "Unknown error has occured.";

    return (
      <div className="message is-danger">
        <div className="message-header">
          <p className="" style={{fontSize: '22px'}}>{caption}</p>
          <button className="delete" onClick={this.props.dismissAction}></button>
        </div>
      </div>
    );
  }
}

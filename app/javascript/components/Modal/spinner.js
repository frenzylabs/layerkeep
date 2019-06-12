/*
 *  spinner.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 06/12/19
 *  Copyright 2018 WessCope
 */

import React from 'react';

export default class SpinnerModal extends React.Component {
  render() {
    const caption = this.props.caption || "Thank you for waiting...";

    return (
      <div>
        <div className="box" style={{boxShadow: 'none', border: 'none'}}>
          <div className="columns is-centered">
            <div className="column is-three-fifths">
              <div className="sk-three-bounce">
                <div className="sk-child sk-bounce1" style={{background: '#c0c0c0'}}></div>
                <div className="sk-child sk-bounce2" style={{background: '#c0c0c0'}}></div>
                <div className="sk-child sk-bounce3" style={{background: '#c0c0c0'}}></div>
              </div>
              <p className="has-text-centered" style={{fontSize: '22px', color: "#c0c0c0"}}>
                {caption}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

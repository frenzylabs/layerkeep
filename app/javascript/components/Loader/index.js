/*
 *  index.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 05/28/19
 *  Copyright 2018 WessCope
 */

import React from 'react';

export class Loader extends React.Component {
  spinner = (
    <div className="sk-three-bounce">
      <div className="sk-child sk-bounce1" style={{background: '#c0c0c0'}}></div>
      <div className="sk-child sk-bounce2" style={{background: '#c0c0c0'}}></div>
      <div className="sk-child sk-bounce3" style={{background: '#c0c0c0'}}></div>
    </div>
  );

  render() {
    return (
      <div className="columns is-centered" style={{marginTop: '20px'}}>
        <div className="column is-two-fifths">
          <div className="card" style={{boxShadow: 'none', border: 'none'}}>
            <div className="card-content">
              {this.spinner}

              <p className="has-text-centered" style={{fontSize: '22px', color: "#c0c0c0"}}>{this.props.caption || "Loading..."}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Loader;
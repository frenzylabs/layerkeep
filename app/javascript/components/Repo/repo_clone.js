//
//  repo_clone.js
//  LayerKeep
// 
//  Created by Wess Cope (wess@frenzylabs.com) on 07/12/19
//  Copyright 2019 FrenzyLabs,llc.
//

import React from 'react';

export default class RepoClone extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      url: this.props.cloneURL,
      isActive: false
    }
    
    this.copyToClipboard  = this.copyToClipboard.bind(this);
    this.buttonAction     = this.buttonAction.bind(this);
    this.documentClick    = this.documentClick.bind(this);
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.documentClick, false);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.documentClick, false);
  }

  documentClick(e) {
    if(this.node.contains(e.target)) { return; }

    this.setState({
      ...this.state,
      isActive: false
    });
  }

  buttonAction(e) {
    this.setState({
      ...this.state,
      isActive: !this.state.isActive
    });
  }

  copyToClipboard(e) {
    this.cloneInput.select();
    
    document.execCommand('copy');
  }

  render() {
    var classes = 'dropdown is-right' + (this.state.isActive ? ' is-active' : '');

    return (
      <div className={classes} style={{width: '100%'}} ref={(el) => {this.node = el;}}>
        <div className="dropdown-trigger">
          <button className="button is-small" aria-haspopup="true" aria-controls="clone-dropdown" onClick={this.buttonAction}>
            <span className="icon is-small">
              <i className="fas fa-clone"></i>
            </span>
            <span>Clone</span>
          </button>
        </div>

        <div 
          className="dropdown-menu" 
          id="clone-dropdown" 
          role="menu" 
          style={{
            marginTop: '0', 
            paddingTop: '0',
            width: '400px'
          }}
        >
          <div className="dropdown-content" style={{padding: '0', margin: '0'}}>
            <div className="dropdown-item">
              <h5 className="title is-6" style={{margin: 0, padding: 0}}>Clone with git.</h5>
            </div>
            
            <div className="dropdown-item">
              <p style={{margin: 0, padding: 0}}>Use your login and password from your account.</p>
            </div>

            <div className="dropdown-item">
              <div className="field has-addons is-fullwidth">
                <p className="control is-fullwidth is-expanded">
                  <input 
                    className="input is-fullwidth" 
                    type="text" 
                    value={this.state.url} 
                    readOnly
                    ref={(el) => { this.cloneInput = el; }}
                  />
                </p>
              
                <p className="control">
                  <a className="button" onClick={this.copyToClipboard}>
                    <span className="icon">
                      <i className="fas fa-clipboard-list"></i>
                    </span>
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

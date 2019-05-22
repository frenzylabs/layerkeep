/*
 *  status.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 05/22/19
 *  Copyright 2018 WessCope
 */

import React from 'react';

export class StatusError extends React.Component {
  constructor(props) {
    super(props);

    this.title    = this.title    || "404 : Not found.";
    this.caption  = this.caption  || "Unable to find what you are looking for";
  }

  render() {
    return (
      <article className="message is-warning">
        <div className="message-body">
          <h1 className="title is-1">{this.title}</h1>
          <p>{this.caption}</p>
        </div>
      </article>
    );
  }
}

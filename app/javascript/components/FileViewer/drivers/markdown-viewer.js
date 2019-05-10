/*
 *  markdown-view.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 05/10/19
 *  Copyright 2018 WessCope
 */

import React          from 'react';
import {FileLoader}   from 'three';
import ReactMarkdown  from 'react-markdown';


export default class MarkdownViewer extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {text: '', contentType: null, localUrl: null, extension: ''}
    this.loadFile();
  }

  loadFile() {
    var self = this;

    var loader = new FileLoader();
    var req = loader.load(this.props.filePath, function(resp) {
      console.log(req);
      var contentType = req.getResponseHeader("content-type").split(";")[0];
      self.setState({ contentType: contentType, text: resp }) //, extension: ext })
    })
  }
  
  render() {

    return (
      <ReactMarkdown source={this.state.text} style={{width: '100%', height: '100%'}}/>
    );
  }
}

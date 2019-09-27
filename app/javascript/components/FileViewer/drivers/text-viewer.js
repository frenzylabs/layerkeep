/*
 *  text-viewer.js
 *  LayerKeep
 * 
 *  Created by Kevin Musselman (kmussel@gmail.com) on 04/30/19
 *  Copyright 2018 FrenzyLabs
 */

import React        from 'react';
import {FileLoader} from 'three';
import Loading from '../loading';

class TextViewer extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {loading: true, text: '', contentType: null, localUrl: null, extension: ''}
  }

  componentDidMount() {
    this.loadFile()
  }

  loadFile() {
    var self = this;

    var loader = new FileLoader();
    var req = loader.load(this.props.filePath, function(resp) {
      var contentType = req.getResponseHeader("content-type").split(";")[0];
      self.setState({ loading: false, contentType: contentType, text: resp }) //, extension: ext })
    })
  }

  render() {

    if (this.state.loading) {
      return <Loading />;
    }
    
    return (
        <pre className="" style={{height: '100%', 'whiteSpace': 'pre-wrap', 'overflowX': 'scroll'}}>
            {this.state.text}
        </pre>
    );
  }
}

export default TextViewer

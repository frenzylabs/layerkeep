/*
 *  scene-viewer.js
 *  LayerKeep
 * 
 *  Created by Kevin Musselman (kmussel@gmail.com) on 04/30/19
 *  Copyright 2018 FrenzyLabs
 */

import React               from 'react';

import { Container } from 'bloomer';
import { FileLoader }     from 'three';
import { SceneManager }  from '../../Repo/scene_manager';


class SceneViewer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {contentType: null, localUrl: null, extension: ''}
    this.loadFile();
  }

  loadFile() {
    var self = this;

    var loader = new FileLoader();
    loader.setResponseType( 'arraybuffer' );
    var req = loader.load(this.props.filePath, function(resp) {
      var contentType = req.getResponseHeader("content-type").split(";")[0];        
      var binaryResponse = self.ensureBinary(resp);
      var blob = new Blob( [ binaryResponse ], { type: contentType } );
      var localUrl = window.URL.createObjectURL(blob);
      self.setState({ contentType: contentType, localUrl: localUrl }) //, extension: ext })
    })
  }

  ensureBinary( buf ) {
		if ( typeof buf === "string" ) {
			var array_buffer = new Uint8Array( buf.length );
			for ( var i = 0; i < buf.length; i ++ ) {
				array_buffer[ i ] = buf.charCodeAt( i ) & 0xff; // implicitly assumes little-endian
			}
			return array_buffer.buffer || array_buffer;
		} else {
			return buf;
		}
	} 
  componentDidUpdate(prevProps) {
    // console.log("Scene PROPS DID CHANGE");
    // console.log(prevProps);
    // console.log(this.props);
    if (this.props.filePath != prevProps.filePath) {
      this.loadFile();
    }

  }

  renderCanvas() {
    if (this.state.localUrl && (this.props.fileType == "stl" || (this.state.contentType && this.state.contentType.match(/octet-stream/)))) {
      return (<SceneManager file={this.state} />)
    }
  }
  
  render() {

    return (
      <div className="" style={{height: '100%'}}>
          {this.renderCanvas()}
      </div>
    );
  }
}

export default SceneViewer
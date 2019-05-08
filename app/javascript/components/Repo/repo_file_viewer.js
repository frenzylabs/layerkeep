/*
 *  list.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 04/30/19
 *  Copyright 2018 WessCope
 */

import React               from 'react';
import { connect }        from 'react-redux';
import { RepoListItem }   from './list_item';
import { Container } from 'bloomer/lib/layout/Container';
import { RepoEmptyList }  from './empty_list';
import { FileLoader }     from 'three';
import { SceneManager }  from './scene_manager';


import { RepoHandler } from '../../handlers/repo_handler';


export class RepoFileViewer extends React.Component {
  constructor(props) {
    super(props);

    console.log(this.props.location.state);
    
    // this.items = this.items.bind(this);
    this.state = {contentType: null, localUrl: null, extension: ''}
    this.loadFile();
    window.f = this;
  }

  loadFile() {
    var self = this;
    var url = this.props.match.url

    RepoHandler.tree(url)
      .then((response) => {
      
      // var regex = new RegExp("(.*)\/" + response.data.path, "is");
      // matches = params.filepath.match(regex)

      var params = this.props.match.params;
      var url = "/" + [params.username, params.kind, params.name, "content", params.revisionPath].join("/")
      const ext = url.split(".").pop();

      var loader = new FileLoader();
      loader.setResponseType( 'arraybuffer' );
      var req = loader.load(url, function(resp) {
        console.log(req);
        console.log(resp);
        var contentType = req.getResponseHeader("content-type").split(";")[0];        
        var binaryResponse = self.ensureBinary(resp);
        var blob = new Blob( [ binaryResponse ], { type: contentType } );
        var localUrl = window.URL.createObjectURL(blob);
        self.setState({ contentType: contentType, localUrl: localUrl, extension: ext })
        // console.log("RESP: ", resp);
      })
    })
    .catch((error) => {
      console.log(error);
    });
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
    console.log("2 PROPS DID CHANGE");
    console.log(prevProps);
    console.log(this.props);
  }
  
  // shouldComponentUpdate(nextProps, nextState) {
  //     console.log("2 Should comp update");
  //     const differentList = this.props.list !== nextProps.list;
  //     return differentList;
  // }

  empty() {
    return (
      <RepoEmptyList kind={this.props.kind} />
    );
  }

  renderImage() {
    if (this.state.contentType && this.state.contentType.match(/image/)) {
      return (<img src={this.state.localUrl} />)
    }
  }

  renderCanvas() {
    if (this.state.extension == "stl" || (this.state.contentType && this.state.contentType.match(/octet-stream/))) {
      return (<SceneManager file={this.state} />)
    }
  }
  
  render() {

    return (
      <div className="" style={{height: '100%'}}>
          {this.renderImage()}
          {this.renderCanvas()}
      </div>
    );
  }
}

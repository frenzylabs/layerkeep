/*
 *  file_viewer.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 05/13/19
 *  Copyright 2018 FrenzyLabs, llc.
 */


import React            from 'react';
import { RepoHandler }  from '../../handlers';

import {
  CsvViewer,
  DocxViewer,
  VideoViewer,
  XlsxViewer,
  XBimViewer,
  PDFViewer,
  UnsupportedViewer,
  PhotoViewerWrapper,
  AudioViewer,
  SceneViewer,
  TextViewer,
  MarkdownViewer
} from './drivers';

export class FileViewer extends React.Component {
  constructor(props) {
    super(props);

    
    this.state = {contentType: null, localUrl: null, url: this.props.url, extension: this.props.extension || ""}
    this.cancelRequest = RepoHandler.cancelSource();
    if (this.props.url == null) {
      this.loadFile();
    }
  }
  

  componentWillUnmount() {
    this.cancelRequest.cancel("Left Page");
  }

  loadFile() {
    var url = this.props.match.url

    RepoHandler.tree(url, {cancelToken: this.cancelRequest.token})
      .then((response) => {

      var params = this.props.match.params;
      var url = "/" + [params.username, params.kind, params.name, "content", params.revisionPath].join("/")
      const ext = url.split(".").pop().toLowerCase();
      this.setState({ url: url, extension: ext })
    })
    .catch((error) => {
      console.log(error);
    });
  }

  componentDidUpdate(prevProps) { 
    if (this.props.url != prevProps.url) {
      this.setState( {url: this.props.url, extension: this.props.extension} )
    }
  }
  

  getDriver() {

    switch (this.state.extension) {
      case 'stl': {
        return SceneViewer;
      }
      case 'md': {
        return MarkdownViewer;
      }
      case 'txt':
      case 'json':
      case 'ini': {
        return TextViewer;
      }
      case 'csv': {
        return CsvViewer;
      }
      case 'xlsx': {
        // const newProps = Object.assign({}, this.props, { responseType: 'arraybuffer' });
        return XlsxViewer //, newProps);
      }
      case 'jpg':
      case 'jpeg':
      case 'gif':
      case 'bmp':
      case 'png': {
        return PhotoViewerWrapper;
      }
      case 'pdf': {
        return PDFViewer;
      }
      case 'docx': {
        return DocxViewer;
      }
      case 'mp3': {
        return AudioViewer;
      }
      case 'mpg':
      case 'webm':
      case 'mp4': {
        return VideoViewer;
      }
      case 'wexbim': {
        return XBimViewer;
      }
      default: {
        return UnsupportedViewer;
      }
    }
  }

  onError(e) {
    logger.logError(e, 'error in file-viewer');
  }
  
  render() {

    var Driver = this.getDriver(this.state);
    return (
      <div className="" style={{height: '100%', width: "100%", margin: 0, padding: 0}}>
        <Driver fileType={this.state.extension} filePath={this.state.url} {...this.props} height={'100%'} onError={this.onError} />
      </div>)      
  }
}





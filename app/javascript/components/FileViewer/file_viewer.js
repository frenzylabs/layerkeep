import React               from 'react';


import { RepoHandler } from '../../handlers/repo_handler';
// import  *  as FV from 'react-file-viewer';

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
} from './drivers/index';

export class FileViewer extends React.Component {
  constructor(props) {
    super(props);

    
    this.state = {contentType: null, localUrl: null, url: this.props.url, extension: this.props.extension || ""}
    if (this.props.url == null) {
      this.loadFile();
    }

  }

  loadFile() {
    var self = this;
    var url = this.props.match.url

    RepoHandler.tree(url)
      .then((response) => {

      var params = this.props.match.params;
      var url = "/" + [params.username, params.kind, params.name, "content", params.revisionPath].join("/")
      const ext = url.split(".").pop().toLowerCase();
      self.setState({ url: url, extension: ext })
    })
    .catch((error) => {
      console.log(error);
    });
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
      <div className="section" style={{height: '100%'}}>
        <Driver fileType={this.state.extension} filePath={this.state.url} onError={this.onError}/>
      </div>)      
  }
}





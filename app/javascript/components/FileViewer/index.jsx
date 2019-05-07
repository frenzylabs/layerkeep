import React               from 'react';
import { connect }        from 'react-redux';
// import { RepoListItem }   from './list_item';
import { Container } from 'bloomer';
// import { OtherDrivers }  from './driver';
import { FileLoader }     from 'three';
import { SceneManager }  from '../Repo/scene_manager';



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
  SceneViewer
} from './drivers/index';

export class MyFileViewer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {contentType: null, localUrl: null, extension: ''}
    this.loadFile();
    window.f = this;

  }

  loadFile() {
    var self = this;
    var url = this.props.match.url

    RepoHandler.tree(url)
      .then((response) => {

      var params = this.props.match.params;
      var url = "/" + [params.username, params.kind, params.name, "content", params.revisionPath].join("/")
      const ext = url.split(".").pop();
      self.setState({ url: url, extension: ext })
    })
    .catch((error) => {
      console.log(error);
    });
  }

  // componentDidUpdate(prevProps) {
  //   console.log("2 PROPS DID CHANGE");
  //   console.log(prevProps);
  //   console.log(this.props);
  // }
  
  // shouldComponentUpdate(nextProps, nextState) {
  //     console.log("2 Should comp update");
  //     const differentList = this.props.list !== nextProps.list;
  //     return differentList;
  // }

  getDriver() {

    switch (this.state.extension) {
      case 'stl': {
        return SceneViewer;
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





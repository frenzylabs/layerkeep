/*
 *  list.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 04/30/19
 *  Copyright 2018 WessCope
 */

import React                from 'react';
import { Link }           from 'react-router-dom';
// import { RevisionPathTrail }  from './revision_path_trail'
import { FileViewer }       from '../FileViewer'
import { AssetHandler }      from '../../handlers';
import SpinnerModal       from '../Modal/spinner';

import { 
  Breadcrumb, BreadcrumbItem 
} from 'bloomer';

export class AssetViewer extends React.Component {
  constructor(props) {
    super(props);

    var owner = {};
    if (props.location.state && props.location.state.owner) {
      owner = props.location.state.owner
    }

    this.state = {  
      owner: owner, 
      asset: {}, 
      contentType: null, 
      url: null, 
      extension: '', 
      meta: {},
      loading: true,
      error: false
    }
    
    this.cancelRequest = AssetHandler.cancelSource();
    // this.loadFile();
  }

  componentDidMount() {
    this.loadFile();
  }

  componentWillUnmount() {
    this.cancelRequest.cancel("Left Page");
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.location.state != this.props.location.state && this.props.location.state && this.props.location.state.owner) {
      this.setState({ owner: this.props.location.state.owner})
    }
  }

  loadFile() {
    var self = this;
    var url = this.props.match.url
    console.log("URL= ", url)
    this.setState({loading: true})
    AssetHandler.raw("/api" + url, {cancelToken: this.cancelRequest.token})
      .then((response) => {
      // var params = this.props.match.params;
      // var url = "/" + [params.username, params.kind, params.name, "content", params.revisionPath].join("/")
      // const ext = url.split(".").pop().toLowerCase();
      const asset = response.data.data
      const ext = asset.attributes.name.split(".").pop().toLowerCase()
      // response.data.metadata
      const owner = {attributes: asset.attributes.owner }
      self.setState({ loading: false, owner: owner, asset: asset, url: `${url}/download`, extension: ext, meta: asset.attributes.metadata })
    })
    .catch((err) => {
      var errMessage = "There was an error loading the asset."
      if (err.response && err.response.data && err.response.data.error) {
        var error = err.response.data.error
        if (error.message) {
          errMessage = error.message
        } else {
          errMessage = JSON.stringify(error)
        }
      }
      this.setState({ loading: false, error: errMessage })
    });
  }  

  renderFile() {
    if (this.state.loading) {
      return (<SpinnerModal />)
    }
    else if (this.state.error) {
      return (
        <article className="message is-danger">
          <div className="message-body">
            {this.state.error}
          </div>
        </article>
      )
    } 
    if (this.state.url) {
      return (
        <FileViewer {...this.props} url={this.state.url} extension={this.state.extension} />
      )
    }
  }

  titleCase() {
    return (this.props.match.params.kind.charAt(0).toUpperCase() + this.props.match.params.kind.slice(1)); 
   }

  renderBreadCrumbs() {
    var params = this.props.match.params;
    return (
      <Breadcrumb style={{margin: 0, padding: 0}}>
        <ul style={{margin: 0, padding: 0}}>
          <BreadcrumbItem className="title is-4" style={{margin: 0, padding: 0}}>
            <Link to={`/${params.username}/${params.kind}`}>{this.titleCase()}</Link>
          </BreadcrumbItem>

          <BreadcrumbItem className="title is-4" style={{margin: 0, padding: 0}}>
            <Link to={`/${params.username}/${params.kind}/${params.ownerId}`}>{this.state.owner.attributes && this.state.owner.attributes.job}</Link>
          </BreadcrumbItem>
        </ul>
    </Breadcrumb>)
  }
  render() {
    var urlparams = this.props.match.params;
    return (
      <div className="section">
        <div className="container is-fluid">
          <div className="columns is-mobile" style={{width: '100%', height: '100%'}}>
              <div className="column" style={{flex: 'unset'}}>
                <div className="level-item">
                  {this.renderBreadCrumbs()}
                </div>
              </div>
          </div>

        <article className="message is-fullwidth flex-wrapper" style={{border: '1px solid #d1d5da'}}>
          <div className="message-header" style={{display: 'block', background: '#f6f8fa', borderBottom: '1px solid #d1d5da', color: '#24292e'}}>
            <div className="columns is-mobile" style={{width: '100%', height: '100%'}}>
              <div className="column" style={{flex: 'unset'}}>
                <div className="level-item">
                  {this.state.asset.attributes && this.state.asset.attributes.name}
                </div>
              </div>
              
              <div className="column">
                <div className="buttons has-addons is-right">
                  <a className="button is-small" href={`/${urlparams.username}/${urlparams.kind}/${urlparams.ownerId}/assets/${urlparams.id}/download`}>Download</a>
                </div>
              </div>
            </div>
          </div>

          <div className="message-body" style={{padding: 0}}>
            {this.renderFile()}
          </div>
        </article>
      </div>
      </div>
    );
  }
}

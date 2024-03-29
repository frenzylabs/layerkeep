/*
 *  list.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 04/30/19
 *  Copyright 2018 WessCope
 */

import React                from 'react';
import { Link } from 'react-router-dom';
import { RevisionPathTrail }  from './revision_path_trail'
import { FileViewer }       from '../FileViewer'
import { RepoHandler }      from '../../handlers';

export class RepoFileViewer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {contentType: null, url: null, extension: '', meta: {}}
    
    this.cancelRequest = RepoHandler.cancelSource();
    this.loadFile();
  }

  componentWillUnmount() {
    this.cancelRequest.cancel("Left Page");
  }


  loadFile() {
    var self = this;
    var url = this.props.match.url

    RepoHandler.tree(url, {cancelToken: this.cancelRequest.token})
      .then((response) => {

      var params = this.props.match.params;
      var url = "/" + [params.username, params.kind, params.name, "content", params.revisionPath].join("/")
      const ext = url.split(".").pop().toLowerCase();
      self.setState({ url: url, extension: ext, meta: response.data.meta })
    })
    .catch((error) => {
      console.log(error);
    });
  }  

  renderFile() {
    if (this.state.url) {
      return (
        <FileViewer {...this.props} url={this.state.url} extension={this.state.extension} />
      )
    }
  }

  render() {
    var urlparams = this.props.match.params;
    return (
      <div className="flex-wrapper">
        <hr/>
        <br/>

        <article className="message is-fullwidth flex-wrapper" style={{border: '1px solid #d1d5da'}}>
          <div className="message-header" style={{display: 'block', background: '#f6f8fa', borderBottom: '1px solid #d1d5da', color: '#24292e'}}>
          <div className="columns is-mobile" style={{width: '100%', height: '100%'}}>
              <div className="column" style={{flex: 'unset'}}>
                <div className="level-item">
                  <RevisionPathTrail match={this.props.match} branches={this.props.item.branches || {}} meta={this.state.meta} />
                </div>
              </div>
              
              <div className="column">
                <div className="buttons has-addons is-right">
                  <a className="button is-small" href={`/${urlparams.username}/${urlparams.kind}/${urlparams.name}/content/${urlparams.revisionPath}?download=true`}>Download</a>
                  &nbsp; <Link className="button is-small" to={`/${urlparams.username}/${urlparams.kind}/${urlparams.name}/revisions/${urlparams.revisionPath}`}>Revisions</Link>
                </div>
              </div>
            </div>
          </div>

          <div className="message-body" style={{padding: 0}}>
            {this.renderFile()}
          </div>
        </article>
      </div>
    );
  }
}

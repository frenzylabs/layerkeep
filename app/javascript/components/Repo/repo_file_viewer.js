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
import { Columns, Column }         from 'bloomer';
import { RepoBreadCrumbs } from './repo_bread_crumbs'
import { FileViewer } from '../FileViewer/file_viewer'

import { RepoHandler } from '../../handlers/repo_handler';
import { Level } from 'bloomer/lib/components/Level/Level';
import { LevelLeft } from 'bloomer/lib/components/Level/LevelLeft';
import { LevelRight } from 'bloomer/lib/components/Level/LevelRight';
import { LevelItem } from 'bloomer/lib/components/Level/LevelItem';


export class RepoFileViewer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {contentType: null, url: null, extension: '', meta: {}}
    this.loadFile();
  }

  loadFile() {
    var self = this;
    var url = this.props.match.url

    RepoHandler.tree(url)
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
      <div style={{width: '100%', height: '100%'}}>
        <hr/>
        <br/>

        <article className="message is-fullwidth" style={{border: '1px solid #d1d5da', width: '100%', height: '100%'}}>
          <div className="message-header" style={{background: '#f6f8fa', borderBottom: '1px solid #d1d5da', color: '#24292e'}}>
          <div className="level" style={{width: '100%', height: '100%'}}>
              <div className="level-left">
                <div className="level-item">
                  <RepoBreadCrumbs match={this.props.match} branches={this.props.item.branches || []} meta={this.state.meta} />
                </div>
              </div>
              
              <div className="level-right">
                <div className="level-item">
                  <div className="buttons has-addons">
                    <a className="button is-small" href={`/${urlparams.username}/${urlparams.kind}/${urlparams.name}/content/${urlparams.revisionPath}?download=true`}>Download</a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="message-body" style={{padding: 0, height: '100%', width: '100%'}}>
            {this.renderFile()}
          </div>
        </article>
      </div>
    );
  }
}

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
      return (<FileViewer {...this.props} url={this.state.url} extension={this.state.extension} style={{width: '100%', height:'100%'}} />)
    }
  }

  render() {
    var urlparams = this.props.match.params;
    return (
      <div>
        <hr/>
        <br/>

        <article className="message is-fullwidth" style={{border: '1px solid #d1d5da'}}>
          <div className="message-header is-fullwidth" style={{background: '#f6f8fa', borderBottom: '1px solid #d1d5da', color: '#24292e'}}>
            <Level className="is-fullwidth" style={{paddingTop: '4px', paddingBottom: '4px'}}>
              <LevelLeft>
                <RepoBreadCrumbs match={this.props.match} branches={this.props.item.branches || []} meta={this.state.meta} />
              </LevelLeft>

              <LevelRight>
                <div className="buttons has-addons">
                  <a className="button is-small" href={`/${urlparams.username}/${urlparams.kind}/${urlparams.name}/content/${urlparams.revisionPath}?download=true`}>Download</a>
                </div>
              </LevelRight>
            </Level>
          </div>

          <div className="message-body is-fullwidth" style={{background: '#fff', padding: 0}}>
            {this.renderFile()}
          </div>
        </article>
      </div>
    );
  }
}

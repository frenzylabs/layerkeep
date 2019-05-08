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
      return (<FileViewer {...this.props} url={this.state.url} extension={this.state.extension} />)
    }
  }

  render() {
    var urlparams = this.props.match.params;
    return (
      <div className="" style={{height: '100%'}}>
        <Columns isGapless isMultiline >
          <Column  isSize='3/4'>
            <RepoBreadCrumbs match={this.props.match} branches={this.props.item.branches || []} meta={this.state.meta}></RepoBreadCrumbs>
          </Column>
          <Column className="has-text-right">
            <a className="button" href={`/${urlparams.username}/${urlparams.kind}/${urlparams.name}/content/${urlparams.revisionPath}?download=true`}>Download</a>
          </Column>
        </Columns>

        {this.renderFile()}
      </div>
    );
  }
}

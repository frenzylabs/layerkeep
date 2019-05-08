/*
 *  details.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 04/30/19
 *  Copyright 2018 WessCope
 */

import React from 'react';
import { connect }  from 'react-redux';
import { Link }         from 'react-router-dom';

import { Container, Table } from 'bloomer';
import { Breadcrumb, BreadcrumbItem } from 'bloomer';
import { Columns, Column }         from 'bloomer';

import { RepoDetailItem } from './detail_item';
import { RepoHandler } from '../../handlers/repo_handler';
import { SearchDropdown } from '../Form/SearchDropdown'
import { RepoBreadCrumbs } from './repo_bread_crumbs'

class Details extends React.Component {
  constructor(props) {
    super(props);

    this.state = {repo_files: [], meta: {}, branches: this.props.item.branches || [], currentRevision: "", message: '', lastUpdate: ''};
    this.updateRepoFiles = this.updateRepoFiles.bind(this)
    
    this.updateRepoFileList()
  }

  updateRepoFileList() {
    var self  = this
    var url   = this.props.match.url

    if (this.props.match.params.resource != "tree") {
      url = url + "/tree/master"
    }

    RepoHandler.tree(url)
    .then((response) => {
      self.updateRepoFiles(response.data)
    })
    .catch((error) => {
      console.log(error);
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.url != prevProps.match.url) {
      this.updateRepoFileList()
    } else if (this.props.item.branches != prevProps.item.branches ) {
      this.setState({ branches: this.props.item.branches })
    }
  }

  updateRepoFiles(data) {
    this.setState({ 
      lastUpdate: data.data[0].date,
      message: data.data[0].message || "",
      repo_files: data.data,
      meta: data.meta,
      currentRevision: data.meta.revision
    });
  }

  items() {
    if (this.state.repo_files.length > 0) {      
      return this.state.repo_files.map((item) => {
        return (<RepoDetailItem kind={this.props.kind} item={item} repo={this.props.item} key={item.name} match={this.props.match} />)
      });
    } else {
      return (<tr><td>No Files</td></tr>)
    }
  }

  render() {
    var urlparams = this.props.match.params;
    return (
      <div>
        <div >
          <Columns isGapless isMultiline >
            <Column  isSize='3/4'>
              <RepoBreadCrumbs match={this.props.match} branches={this.state.branches} meta={this.state.meta}></RepoBreadCrumbs>              
            </Column>
            <Column className="has-text-right">
              <a className="button" href={`/${urlparams.username}/${urlparams.kind}/${urlparams.name}/content/${urlparams.revisionPath}?download=true`}>Download</a>
            </Column>
          </Columns>
        </div>
        <br/>
        <Table isNarrow className="is-fullwidth">
          <thead>
            <tr>
              <th colSpan={3}>
                {this.state.message}
              </th>

              <th className="has-text-right" colSpan={2}>
                Last updated: {dayjs(this.state.lastUpdate).format('DD.MM.YYYY')}
              </th>
            </tr>
          </thead>

          <tbody>
            {this.items()}
          </tbody>
        </Table>
      </div>
    )
  }
}


const mapStateToProps = (state) => {
  return {
  }
}

export const RepoDetails = connect(mapStateToProps)(Details);

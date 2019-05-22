/*
 *  details.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 04/30/19
 *  Copyright 2018 WessCope
 */

import React                from 'react';
import { connect }          from 'react-redux';

import { 
  Table,
  Columns, 
  Column,
  Content,
  Icon
} from 'bloomer';

import { RepoDetailItem }   from './detail_item';
import { RepoHandler }      from '../../handlers';
import { RevisionPathTrail }  from './revision_path_trail'
import { FileViewer }       from '../FileViewer';

import {
  Error404,
  Error401
} from '../ErrorViews';


class Details extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      repo_files:       [], 
      meta:             {}, 
      branches:         this.props.item.branches || [], 
      currentRevision:  "", 
      message:          '', 
      lastUpdate:       '',
      hasError:         0
    };

    this.updateRepoFiles    = this.updateRepoFiles.bind(this);
    this.renderReadme       = this.renderReadme.bind(this);
    this.deleteFile         = this.deleteFile.bind(this);
    this.updateRepoFileList = this.updateRepoFileList.bind(this);

    this.updateRepoFileList();
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
      this.setState({
        ...this.state,
        hasError: error.response.status
      })
    });
  }

  deleteFile(path) {
    var urlparams = this.props.match.params;
    RepoHandler.deleteFile(urlparams, path)
    .then((response) => {
      this.updateRepoFileList()
    })
    .catch((error) => {
      console.log(error);
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.url != prevProps.match.url) {
      this.updateRepoFileList()
    } else if (this.props.item.branches != prevProps.item.branches ) {
      this.setState({ 
        ...this.state,
        branches: this.props.item.branches 
      });
    }
  }

  updateRepoFiles(data) {
    this.setState({ 
      ...this.state,
      lastUpdate: data.meta.last_committed_at,
      message: data.meta.last_commit_message || "",
      repo_files: data.data,
      meta: data.meta,
      currentRevision: data.meta.revision
    });
  }

  items() {
    if (this.state.repo_files.length > 0) {      
      return this.state.repo_files.map((item) => {
        return (<RepoDetailItem kind={this.props.kind} item={item} repo={this.props.item} key={item.name} match={this.props.match} deleteFile={this.deleteFile} />)
      });
    } else {
      return (<tr><td>No Files</td></tr>)
    }
  }

  renderReadme() {
    const urlparams = this.props.match.params;
    const readme    = this.state.repo_files.filter((item) => { return item.name.toLowerCase() == 'readme.md'; })[0];

    if(readme == null) {
      return null;
    }

    const url = `/${urlparams.username}/projects/${urlparams.name}/content/master/README.md`;

    return (
      <article className="message is-small" style={{border: '1px solid #d1d5da'}}>
        <div className="message-header" style={{background: '#f6f8fa', borderBottom: '1px solid #d1d5da', color: '#24292e'}}>
          <p>
            <Icon className="fal fa-poll-h"/>
            README.md
          </p>
        </div>

        <div className="message-body" style={{background: '#fff'}}>
          <Content>
            <FileViewer url={url} extension="md"/>
          </Content>
        </div>
      </article>
    );
  }

  render() {
    if(this.state.hasError > 0) {

      switch(this.state.hasError) {
        case 404:
          return (
            <Error404/>
          );

        case 401:
          return (
            <Error401/>
          )
      }
    }

    const urlparams = this.props.match.params;
    const url       = `/${urlparams.username}/${urlparams.kind}/${urlparams.name}/content/${urlparams.revisionPath || 'master'}?download=true`;

    return (
      <div className="flex-wrapper">
        <hr/>
        <br/>

        <div>
          <Columns className="is-narrow is-gapless is-mobile">
            <Column>
              <RevisionPathTrail match={this.props.match} branches={this.state.branches} meta={this.state.meta}></RevisionPathTrail>        
            </Column>

            <Column >
              <div className="buttons has-addons is-right">
                <p className="control">
                  <a className="button is-small" onClick={this.props.uploadAction}>
                    <span className="icon is-small">
                      <i className="fas fa-upload"></i>
                    </span>
                    <span>Upload</span>
                  </a>
                </p>
                <p className="control">
                  <a className="button is-small" href={url} target="_blank">
                    <span className="icon is-small">
                      <i className="fas fa-download"></i>
                    </span>
                    <span>Download</span>
                  </a>
                </p>
              </div>
            </Column>
          </Columns>
        </div>

        <Table isNarrow className="is-fullwidth" style={{marginTop: '10px'}}>
          <thead>
            <tr style={{background: '#eff7ff', border: '1px solid #c1ddff'}}>
              <th colSpan={3} style={{fontWeight: 'normal'}}>
                {this.state.message}
              </th>

              <th className="has-text-right" colSpan={2} style={{fontWeight: 'normal'}}>
                Last updated: {dayjs(this.state.lastUpdate).format('MM.DD.YYYY')}
              </th>
            </tr>
          </thead>

          <tbody style={{border: '1px solid #dadee1'}}>
            {this.items()}
          </tbody>
        </Table>

        <div>
          {this.renderReadme()}
        </div>
      </div>
    )
  }
}


const mapStateToProps = (state) => {
  return state
}

export const RepoDetails = connect(mapStateToProps)(Details);

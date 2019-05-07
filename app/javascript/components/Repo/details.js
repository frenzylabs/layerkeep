/*
 *  details.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 04/30/19
 *  Copyright 2018 WessCope
 */

import React from 'react';
import { connect }  from 'react-redux';

import { Table } from 'bloomer/lib/elements/Table';
import { RepoDetailItem } from './detail_item';
import { RepoHandler } from '../../handlers/repo_handler';

class Details extends React.Component {
  constructor(props) {
    super(props);

    this.state            = {repo_files: [], message: '', lastUpdate: ''};
    this.updateRepoFiles  = this.updateRepoFiles.bind(this)
    
    this.updateRepoFileList()
  }

  updateRepoFileList() {
    var self  = this
    var url   = this.props.match.url

    if (!this.props.match.params.tree) {
      url = url + "/tree/master"
    }

    RepoHandler.tree(url)
    .then((response) => {
      console.log(response);
      
      self.updateRepoFiles(response.data)
    })
    .catch((error) => {
      console.log(error);
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.url != prevProps.match.url) {
      console.log("URL DID CHANGE")
      this.updateRepoFileList()
    }
  }
  

  updateRepoFiles(data) {
    this.setState({ 
      lastUpdate: data[0].date,
      message: data[0].message || "",
      repo_files: data 
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
    return (
      <div>
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

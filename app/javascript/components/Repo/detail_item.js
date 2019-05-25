/*
 *  detail_item.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 04/30/19
 *  Copyright 2018 WessCope
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'bloomer';

export class RepoDetailItem extends React.Component {
  constructor(props) {
    super(props);
  }

  icon(type) {
    if (type == "tree") {
      return (<i className="fas fa-folder"></i>)
    } else {
      return (<i className="fas fa-file"></i>)
    }
  }

  linkToFile(item) {
    var path = item.name
    
    if (item.type == "tree") {
      var url  = this.props.match.url.replace(/(\/)$/, "");
      if (this.props.match.params.resource != "tree") {
        path = url + "/tree/master/" + path
      } else {
        path = url + "/" + path
      }
      return (<Link to={path}>{item.name}</Link>)
    } else {
      let urlParams = this.props.match.params
      if (!urlParams.revisionPath) {
        urlParams.revisionPath = "master"
      }
      urlParams.revisionPath = urlParams.revisionPath.replace(/(\/)$/, "");      
      const filepath = "/" + [urlParams.username, urlParams.kind, urlParams.name, "files", urlParams.revisionPath, path].join("/")

      return (<Link to={{pathname: filepath, state: {repo: this.props.repo}}} >{item.name}</Link>) 
    }
  }

  downloadLink(item) {    
    var urlParams = this.props.match.params;
    if (!urlParams.revisionPath) {
      urlParams.revisionPath = "master"
    }
    return (
      <p className="control">
          <a className="button is-small" href={`/${urlParams.username}/${urlParams.kind}/${urlParams.name}/content/${urlParams.revisionPath}/${item.name}?download=true`}>
                <span className="icon is-small">
                  <i className="far fa-download"></i>
                </span>
              </a>
            </p>
    )
  }

  deleteButton(item) {
    if (item.type == "tree") {
      return 
    }
    return (
      <p className="control">
        <Button className="button is-small" onClick={() => { this.props.deleteFile(item.name)} }>
          <span className="icon is-small">
            <i className="far fa-trash"></i>
          </span>
        </Button>
      </p>
    )
  }

  render() {
    return(
      <tr>
        <td className="cell-icon">
          <p className="icon">{this.icon(this.props.item.type)}</p>
        </td>
        
        <td className="file-details is-text-overflow">
          <p>
            {this.linkToFile(this.props.item)}
          </p>
        </td>

        <td className="cell-content is-text-overflow">
          <p>
            <a>
              {this.props.item.message}
            </a>
          </p>
        </td>
        
        <td className="has-text-right">
          <p>{dayjs(this.props.item.date).format('DD.MM.YYYY')}</p>
        </td>

        <td className="has-text-right cell-option-buttons"  width={66}>
          <div className="field has-addons">

            {this.downloadLink(this.props.item)}

            {this.deleteButton(this.props.item)}
          </div>
        </td>
      </tr>
    )
  }
}

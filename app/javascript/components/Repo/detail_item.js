/*
 *  detail_item.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 04/30/19
 *  Copyright 2018 WessCope
 */

import React from 'react';
import { Link } from 'react-router-dom';

export class RepoDetailItem extends React.Component {

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
    var urlparams = this.props.match.params;
    return (
      <p className="control">
          <a className="button is-small" href={`/${urlparams.username}/${urlparams.kind}/${urlparams.name}/content/${urlparams.revisionPath}/${item.name}?download=true`}>
                <span className="icon is-small">
                  <i className="far fa-download"></i>
                </span>
              </a>
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
            <p className="control">
              <a className="button is-small">
                <span className="icon is-small">
                  <i className="fas fa-scalpel-path"></i>
                </span>
              </a>
            </p>

            {this.downloadLink(this.props.item)}

            <p className="control">
              <a className="button is-small">
                <span className="icon is-small">
                  <i className="far fa-trash"></i>
                </span>
              </a>
            </p>
          </div>
        </td>
      </tr>
    )
  }
}

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
    var path = item.path
    if (item.type == "tree") {
      if (!this.props.match.params.tree) {
        path = this.props.match.url + "/tree/master/" + path
      } else {
        path = this.props.match.url + "/" + path
      }
      return (<Link to={path}>{item.name}</Link>)
    } else {
      let urlParams = this.props.match.params
      const filepath = "/" + [urlParams.username, urlParams.kind, urlParams.name, "files", path].join("/")

      return (<Link to={filepath}>{item.name}</Link>) 
    }
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
          <p>{this.props.item.date}</p>
        </td>

        <td className="has-text-right cell-option-buttons"  width={100}>
          <div className="field has-addons">
            <p className="control">
              <a className="button is-small">
                <span className="icon is-small">
                  <i className="fas fa-scalpel-path"></i>
                </span>
              </a>
            </p>

            <p className="control">
              <a className="button is-small">
                <span className="icon is-small">
                  <i className="far fa-cube"></i>
                </span>
              </a>
            </p>

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

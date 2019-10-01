/*
 *  asset_item.js
 *  LayerKeep
 * 
 *  Created by Kevin Musselman (kevin@frenzylabs.com) on 09/26/19
 *  Copyright 2019 Layerkeep
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'bloomer';

export class PrintAssetItem extends React.Component {
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
    var path = item.attributes.name
    let urlParams = this.props.match.params
    const filepath = "/" + [urlParams.username, "prints", urlParams.printId, "assets", item.id].join("/")
    
    return (<Link to={{pathname: filepath, state: { owner: this.props.owner }}} title={`View File ${item.attributes.name}`}>{item.attributes.name}</Link>) 
    // if (item.type == "tree") {
    //   var url  = this.props.match.url.replace(/(\/)$/, "");
    //   if (this.props.match.params.resource != "tree") {
    //     path = url + "/tree/master/" + path
    //   } else {
    //     path = url + "/" + path
    //   }
    //   return (<Link to={path}>{item.name}</Link>)
    // } else {
    //   let urlParams = this.props.match.params
    //   if (!urlParams.revisionPath) {
    //     urlParams.revisionPath = "master"
    //   }
    //   urlParams.revisionPath = urlParams.revisionPath.replace(/(\/)$/, "");      
    //   const filepath = "/" + [urlParams.username, urlParams.kind, urlParams.name, "files", urlParams.revisionPath, path].join("/")

    //   return (<Link to={{pathname: filepath, state: {repo: this.props.repo}}} >{item.name}</Link>) 
    // }
  }

  downloadLink(item) {    
    var urlParams = this.props.match.params;    
    const filepath = "/" + [urlParams.username, "prints", urlParams.printId, "assets", item.id, "download"].join("/")
    return (
      <p className="control">
          <a title={`Download ${item.attributes.name}`}className="button is-small" href={`${filepath}`}>
                <span className="icon is-small">
                  <i className="far fa-download"></i>
                </span>
              </a>
            </p>
    )
  }

  deleteButton(item) {
    if (!this.props.deleteFile) {
      return 
    }
    return (
      <p className="control">
        <Button title={`Delete File ${item.attributes.name}`} className="button is-small" onClick={() => { this.props.deleteFile(item.id)} }>
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
          <p className="icon">{this.icon(this.props.item.attributes.content_type)}</p>
        </td>
        
        <td className="file-details is-text-overflow">
          <p>
            {this.linkToFile(this.props.item)}
          </p>
        </td>

        <td className="cell-content is-text-overflow">
          <p>
            <a>
              
            </a>
          </p>
        </td>
        
        <td className="has-text-right">
          <p>{dayjs(this.props.item.attributes.created_at).format('MM.DD.YYYY')}</p>
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

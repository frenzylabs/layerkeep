/*
 *  detail_item.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 04/30/19
 *  Copyright 2018 WessCope
 */

import React from 'react';

export class RepoDetailItem extends React.Component {
  render() {
    return(
      <tr>
        <td className="cell-icon">
          <p className="icon"><i className="fas fa-file"></i></p>
        </td>
        
        <td className="file-details is-text-overflow">
          <p>
            <a>file_name_here.stl</a>
          </p>
        </td>

        <td className="cell-content is-text-overflow">
          <p>
            <a>
              k4jehlFkjyu4o3
            </a>
          </p>
        </td>
        
        <td className="has-text-right">
          <p>99 months ago</p>
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

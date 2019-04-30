/*
 *  details.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 04/30/19
 *  Copyright 2018 WessCope
 */

import React from 'react';

import { Table } from 'bloomer/lib/elements/Table';
import { RepoDetailItem } from './detail_item';

export class RepoDetails extends React.Component {
  render() {
    return (
      <div>
        <Table isNarrow className="is-fullwidth">
          <thead>
            <tr>
              <th colSpan={3}>
                Did something to make this revision sexy.
              </th>

              <th className="has-text-right" colSpan={2}>
                Last updated: 01.01.2019
              </th>
            </tr>
          </thead>

          <tbody>
            <RepoDetailItem/>
            <RepoDetailItem/>
            <RepoDetailItem/>
            <RepoDetailItem/>
            <RepoDetailItem/>
            <RepoDetailItem/>
          </tbody>
        </Table>
      </div>
    )
  }
}

/*
 *  list_item.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 04/30/19
 *  Copyright 2018 WessCope
 */

import React            from 'react';
import { Media }        from 'bloomer/lib/components/Media/Media';
import { MediaLeft }    from 'bloomer/lib/components/Media/MediaLeft';
import { MediaContent } from 'bloomer/lib/components/Media/MediaContent';
import { MediaRight }   from 'bloomer/lib/components/Media/MediaRight';
import { Icon }         from 'bloomer/lib/elements/Icon';

export class ProjectListItem extends React.Component {
  render() {
    return (
      <a className="box" data-id={this.props.id}>
        <Media>
          <MediaLeft>
            <Icon className="far fa-layer-group" isSize="medium"/>
          </MediaLeft>

          <MediaContent>
            <p className="title is-5" style={{lineHeight: "154%", marginBottom: "0"}}>{this.props.path || 'projects/project_name'}</p>
            <p className="has-text-grey">{this.props.description || 'Description goes here.'}</p>
          </MediaContent>

          <MediaRight>
            <p>Updated: 01.01.2019</p>
          </MediaRight>
        </Media>
      </a>
    )
  }
}

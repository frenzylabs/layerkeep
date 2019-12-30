/*
 *  list_item.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 04/30/19
 *  Copyright 2018 WessCope
 */

import React            from 'react';
import { Link }         from 'react-router-dom';
import { Media }        from 'bloomer/lib/components/Media/Media';
import { MediaLeft }    from 'bloomer/lib/components/Media/MediaLeft';
import { MediaContent } from 'bloomer/lib/components/Media/MediaContent';
import { MediaRight }   from 'bloomer/lib/components/Media/MediaRight';
import { Icon }         from 'bloomer/lib/elements/Icon';

export class RepoListItem extends React.Component {
  render() {
    return (
      <Link to={this.props.path} className="box" data-id={this.props.item.id} key={this.props.item.id} >
        <Media>
          <MediaLeft>
            <Icon className="far fa-layer-group" isSize="medium"/>
          </MediaLeft>

          <MediaContent>
            <p className="title is-5" style={{lineHeight: "154%", marginBottom: "0"}}>{this.props.item.attributes.name}</p>
            <p className="has-text-grey">{this.props.item.attributes.description || ''}</p>
          </MediaContent>

          <MediaRight>
            <p>Last Updated: {dayjs(this.props.item.attributes.updated_at).format('MM.DD.YYYY')}</p>
          </MediaRight>
        </Media>
      </Link>
    )
  }
}

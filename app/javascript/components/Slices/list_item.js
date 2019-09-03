/*
 *  list_item.js
 *  LayerKeep
 * 
 *  Created by Kevin Musselman (kmussel@gmail.com) on 09/03/19
 *  Copyright 2019 Frenzylabs
 */

import React            from 'react';
import { Link }         from 'react-router-dom';
import { Media }        from 'bloomer/lib/components/Media/Media';
import { MediaLeft }    from 'bloomer/lib/components/Media/MediaLeft';
import { MediaContent } from 'bloomer/lib/components/Media/MediaContent';
import { MediaRight }   from 'bloomer/lib/components/Media/MediaRight';
import { Icon }         from 'bloomer/lib/elements/Icon';

export class PrintListItem extends React.Component {
  renderStatus() {
    var status = this.props.item.attributes.status;
    switch (status) {
      case "success": {
        return (<span className="has-text-success">{status}</span>)
      }
      case "failed": {
        return (<span className="has-text-danger">{status}</span>)
      }
      default: {
        return (<span>{status}</span>);
      }
    }
  }

  render() {
    return (
      <Link to={this.props.path} className="box" data-id={this.props.item.id} key={this.props.item.id} >
        <Media>
          <MediaLeft>
            <Icon className="far fa-layer-group" isSize="medium"/>
          </MediaLeft>

          <MediaContent>
            <p className="title is-5" style={{lineHeight: "154%", marginBottom: "0"}}>{this.props.item.attributes.name}</p>
            <p className="has-text-grey">{this.props.item.attributes.description || 'Description goes here.'}</p>
          </MediaContent>

          <MediaRight>
            <p>Created: {dayjs(this.props.item.attributes.updated_at).format('MM.DD.YYYY')}</p>
            <p>Status: {this.renderStatus()}</p>
          </MediaRight>
        </Media>
      </Link>
    )
  }
}

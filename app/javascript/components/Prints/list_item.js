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

  renderTitle() {
    var itematt = this.props.item.attributes
    if (!itematt.name && itematt.slices && itematt.slices.attributes.name) {
      return (<p className="title is-5" style={{lineHeight: "154%", marginBottom: "0"}}>{itematt.slices.attributes.name}</p>)
    }
    return (
      <p className="title is-5" style={{lineHeight: "154%", marginBottom: "0"}}>{itematt.name}</p>
    )
  }

  renderDescription() {
    if (this.props.item.attributes.description) {
      var d = this.props.item.attributes.description
      if (d.length > 216) {
        d = d.substring(0, 216)
        var last = d.lastIndexOf(" ")
        return d.substring(0, last) + "..."
      }
      return d
      
    }
    return ""
  }

  render() {
    return (
      <Link to={this.props.path} className="box" data-id={this.props.item.id} key={this.props.item.id} >
        <Media>
          <MediaLeft>
            <Icon className="far fa-layer-group" isSize="medium"/>
          </MediaLeft>

          <MediaContent>
            {this.renderTitle()}
            <p className="has-text-grey">{this.renderDescription()}</p>
          </MediaContent>

          <MediaRight>
            <p>Created: {dayjs(this.props.item.attributes.updated_at).format('MM.DD.YYYY HH:mm:ss')}</p>
            <p>Status: {this.renderStatus()}</p>
          </MediaRight>
        </Media>
      </Link>
    )
  }
}

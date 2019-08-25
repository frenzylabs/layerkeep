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

export class SliceListItem extends React.Component {
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
  renderEngine() {
    var engine = this.props.item.attributes.slicer_engine
    if (engine && engine.id) {
      return (<p>Engine: {engine.attributes.name}: {engine.attributes.version} </p>)
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
            <p className="has-text-grey">{this.props.item.attributes.description || ''}</p>
          </MediaContent>

          <MediaRight>
            <p>Created: {dayjs(this.props.item.attributes.updated_at).format('MM.DD.YYYY')}</p>
            <p>Status: {this.renderStatus()}</p>
            {this.renderEngine()}
          </MediaRight>
        </Media>
      </Link>
    )
  }
}

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

export class RevisionListItem extends React.Component {
  revisionPath(item) {    
    let urlParams = this.props.match.params
    const filepath = "/" + [urlParams.username, urlParams.kind, urlParams.name, "revision", item.id].join("/")
    return filepath
  }

  filesPath(item) {    
    let urlParams = this.props.match.params
    const filepath = "/" + [urlParams.username, urlParams.kind, urlParams.name, "tree", item.id].join("/")
    return filepath
  }

  render() {
    return (
      
        <Media className="box" >
          <MediaLeft>
            <Icon className="far fa-layer-group" isSize="medium"/>
          </MediaLeft>

          <MediaContent>
            <Link to={this.revisionPath(this.props.item)} data-id={this.props.item.id} key={this.props.item.id} >
            <p className="title is-6" style={{marginBottom: "0"}}>{this.props.item.id}</p>
            <p className="has-text-grey">{this.props.item.attributes.message || 'Description goes here.'}</p>
            </Link>
          </MediaContent>

          <MediaRight>
            <p>Updated: {this.props.item.attributes.time}</p>
            <Link to={this.filesPath(this.props.item)} data-id={this.props.item.id} key={this.props.item.id} >Files</Link>
          </MediaRight>
        </Media>
      
    )
  }
}

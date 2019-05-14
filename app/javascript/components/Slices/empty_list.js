/*
 *  slice_empty_list.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 05/03/19
 *  Copyright 2018 WessCope
 */

import React            from 'react';
import { Link }         from 'react-router-dom';
import { Media }        from 'bloomer/lib/components/Media/Media';
import { MediaLeft }    from 'bloomer/lib/components/Media/MediaLeft';
import { MediaContent } from 'bloomer/lib/components/Media/MediaContent';
import { MediaRight }   from 'bloomer/lib/components/Media/MediaRight';
import { Icon }         from 'bloomer/lib/elements/Icon';
import { Box }          from 'bloomer/lib/elements/Box';

export class SliceEmptyList extends React.Component {
  render() {
    return (
      <Box>
        <Media>
          <MediaLeft>
          </MediaLeft>

          <MediaContent style={{textAlign: "center"}}>
            {"You have no slices created."}
            <br/>
            <Link className="button" to={`/${this.props.params.username}/projects/${this.props.params.name}/slices/new`}>New Slice</Link>
          </MediaContent>

          <MediaRight>
          </MediaRight>
        </Media>
      </Box>
    )
  }
}

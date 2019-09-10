/*
 *  empty_list.js
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
import { Box }          from 'bloomer/lib/elements/Box';

export class SliceEmptyList extends React.Component {
  render() {
    return (
      <Box>
        <Media>
          <MediaLeft>
          </MediaLeft>

          <MediaContent style={{textAlign: "center"}}>
            {"You have not created any Slices yet."}
            <br/>
            <Link className="button" to={`/${this.props.params.username}/slices/new`}>New Slice</Link>
          </MediaContent>

          <MediaRight>
          </MediaRight>
        </Media>
      </Box>
    )
  }
}

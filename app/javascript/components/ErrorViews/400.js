/*
 *  401.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 05/22/19
 *  Copyright 2018 WessCope
 */

import {StatusError}  from './status';

export class Error400 extends StatusError {
  title     = '400 : Error';
  caption   = "There was an error loading this resource.";
}

/*
 *  401.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 05/22/19
 *  Copyright 2018 WessCope
 */

import {StatusError}  from './status';

export class Error403 extends StatusError {
  title     = '403 : Forbidden';
  caption   = "You are not authorized to view this resource.";
}

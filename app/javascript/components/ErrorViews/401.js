/*
 *  401.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 05/22/19
 *  Copyright 2018 WessCope
 */

import {StatusError}  from './status';

export class Error401 extends StatusError {
  title     = '401 : Not Authorized';
  caption   = "You are not authorized.";
}

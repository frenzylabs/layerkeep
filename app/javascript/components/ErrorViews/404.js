/*
 *  404.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 05/22/19
 *  Copyright 2018 WessCope
 */

import {StatusError}  from './status';

export class Error404 extends StatusError {
  title   = "404 : Not found.";
  caption = "Unable to find what you are looking for";
}

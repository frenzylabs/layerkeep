/*
 *  request_client.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 04/30/19
 *  Copyright 2018 WessCope
 */

import axios from 'axios';

export default axios.create({
  baseURL:      '',
  responseType: 'json'
});

/*
 *  request_client.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 04/30/19
 *  Copyright 2018 WessCope
 */

import axios from 'axios';

export const Request = axios.create({
  baseURL:      '',
  responseType: 'json',
  headers: {
		'Content-Type': 'application/json',
		'Accept': 'application/json',
	}
});

export const isCancel = axios.isCancel;
export const CancelToken = axios.CancelToken;

export default Request;

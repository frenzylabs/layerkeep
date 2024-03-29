/* eslint no-console:0 */
// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.
//
// To reference this file, add <%= javascript_pack_tag 'application' %> to the appropriate
// layout file, like app/views/layouts/application.html.erb


// Uncomment to copy all static images under ../images to the output folder and reference
// them with the image_pack_tag helper in views (e.g <%= image_pack_tag 'rails.png' %>)
// or the `imagePath` JavaScript helper below.
//
// const images = require.context('../images', true)
// const imagePath = (name) => images(name, true)

import React        from 'react';
import ReactDOM     from 'react-dom';
import {Provider}   from 'react-redux'

import App    from '../App';
import store  from '../states/store';
import { Request, isCancel } from '../handlers/request_client';


Request.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  //catches if the session ended!
  console.log(error);
  if (isCancel(error)) {
    console.log('Request canceled', error.message);
  } else {
    if (error.response && error.response.status == 401) {
      store.dispatch({ type: "UNAUTH_USER" });
    }
  }
  return Promise.reject(error);
  
});


document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('app')
  );
});

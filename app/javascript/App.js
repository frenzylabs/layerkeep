/*
 *  App.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 04/23/19
 *  Copyright 2018 WessCope
 */

import React      from 'react'
import {Provider} from 'react-redux'
import {
  BrowserRouter,
  Switch,
  Route
} from 'react-router-dom'

import configureStore from 'configureStore'

const store = configureStore();

class App extends React.Component {
  render () {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <Switch>
            <Route exact path="/" render={() => ("Home!")} />
            <Route path="/about"  render={() => ("About!")} />
          </Switch>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App

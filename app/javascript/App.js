/*
 *  App.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 04/23/19
 *  Copyright 2018 WessCope
 */

import React              from 'react'
import { connect }        from 'react-redux';
import { BrowserRouter }  from 'react-router-dom'

import AppContainer from './AppContainer';

class App extends React.Component {
  constructor(props) {
     super(props)
  }
  componentDidUpdate(prevProps) {
    // console.log("App PROPS DID CHANGE");
    // console.log(prevProps);
    // console.log(this.props);
  }
  
  routeChanged(previousRoute, nextRoute) {
    // console.log("route changed ", previousRoute, nextRoute);
  }

  render () {
    return (
      <BrowserRouter >
        <AppContainer />
      </BrowserRouter>
    );
  }
}

const mapStateToProps = (state) => {
  // console.dir(state);
  return state
}

function mapDispatchToProps() {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

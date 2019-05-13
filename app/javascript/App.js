/*
 *  App.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 04/23/19
 *  Copyright 2018 WessCope
 */

import React        from 'react'
import { connect }  from 'react-redux';

import {
  BrowserRouter,
  Switch,
  Route,
  withRouter
} from 'react-router-dom'

import { Columns, Column }         from 'bloomer';
import { Nav }              from './components/Nav';
import { LeftColumn }     from './components/LeftColumn';
import { ProjectList }    from './components/Project/list';
import { ProjectNew }     from './components/Project/new';
import { ProjectDetails } from './components/Project/details';
import { Project }     from './components/Project/project';
import { Slicer }     from './components/Slices/slicer';

import { FileViewer } from './components/FileViewer/file_viewer';
import { RepoFileViewer } from './components/Repo/repo_file_viewer';
import { Revisions } from './components/Repo/revisions';
import { Revision } from './components/Repo/revision';
import AppContainer from './AppContainer';

class App extends React.Component {
  constructor(props) {
     super(props)
  }
  componentDidUpdate(prevProps) {
    console.log("App PROPS DID CHANGE");
    
    console.log(prevProps);
    console.log(this.props);
  }
  
  routeChanged(previousRoute, nextRoute) {
    console.log("route changed ", previousRoute, nextRoute);
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

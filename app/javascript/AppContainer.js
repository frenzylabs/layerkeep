/*
 *  App.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 04/23/19
 *  Copyright 2018 WessCope
 */

import React              from 'react'
import { connect }        from 'react-redux';
import { ToastContainer } from 'react-toastify';

import {
  Switch,
  Route,
  withRouter,
  matchPath
} from 'react-router-dom'

import { Columns, Column }  from 'bloomer';
import { 
  Nav,
  LeftColumn,
  ProjectList,
  ProjectNew,
  Project,
  Slicer,
  ProfileList,
  Profile,
  ProfileNew,
  Settings
} from './components';

import RemoteMessage from './RemoteMessage'

class SideLayout extends React.Component {
  render() {
    const Component = this.props.component;
    return (
      <div className="has-navbar-fixed-top" style={{flex: '1'}}>
        <Columns id="layout-column" isGapless >
          <Column isSize={2} className="is-hidden-mobile" >
            <LeftColumn />
          </Column>
          <Column>
            <Component {...this.props} />
          </Column>
      </Columns>
      </div>
    );
 }
}

class FullScreenLayout extends React.Component {
  render() {
    const Component = this.props.component;
    return (
      <div id="" className="has-navbar-fixed-top" style={{height: '100vh', flex: '1'}}>
       <Columns id="layout-column" isGapless >
          <Column isFullWidth >
            <Component {...this.props} />
          </Column>
      </Columns>
      </div>
    );
 }
}

class AppContainer extends React.Component {
  constructor(props) {
     super(props)
     this.state = {
       fullLayoutRoutes: [
        {path: '/:username/:resource(slices)/new', component: Slicer},
        {path: '/:username/:kind(projects)/:name/:resouce(slices)/new', component: Slicer},
       ],

       sidebarLayoutRoutes: [
        {path: '/:username/:kind(settings)', exact: false, component: Settings},
        {path: '/:username/:kind(projects)/new', component: ProjectNew},
        {path: '/:username/:kind(projects)', component: ProjectList},
        {path: '/:username/:kind(projects)/:name/:resource/:revisionPath(.*)?', component: Project},
        {path: '/:username/:kind(projects)/:name', component: Project},
        {path: '/:username/:kind(profiles)/new', component: ProfileNew},
        {path: '/:username/:kind(profiles)', component: ProfileList},
        {path: '/:username/:kind(profiles)/:name/:resource/:revisionPath(.*)?', component: Profile},        
        {path: '/:username/:kind(profiles)/:name?', component: Profile}
       ]
      }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.location.pathname != this.props.location.pathname) {
      try {
        var matchLocationParams = this.getPathParams(this.props.location.pathname);
        matchLocationParams["pathname"] = this.props.location.pathname
        mixpanel.track("Page Change", matchLocationParams);
      } catch (err) {
        mixpanel.track("Page Change", {"pathname": this.props.location.pathname})
      }
    }
  }

  getPathParams(pathname) {
    var matchLocation = (this.state.fullLayoutRoutes.concat(this.state.sidebarLayoutRoutes)).reduce((acc, item) =>  {
      var mpath = matchPath(pathname, item.path); 
      if (mpath) { 
        acc = mpath; 
        return acc; 
      }
      return acc;
    }
    )
    return (matchLocation && matchLocation.params) || {};
  }
  
  renderFullLayoutRoutes() {
    return this.state.fullLayoutRoutes.map((item) => {
      return (<Route key={item.path} exact={item.exact || true} path={item.path} 
        render={ props => 
          <FullScreenLayout component={item.component} {...props} /> 
        }
      />)
    })  
 }

 renderSideBarLayoutRoutes() {
  return this.state.sidebarLayoutRoutes.map((item) => {
    return (
        <Route key={item.path}  path={item.path}  render={ props =>
          <SideLayout {...item}  {...props} /> 
        }/>
      )
    });  
  }

  render () {
    return (
      <div id="dashboard" style={{height: '100%'}}>
        <RemoteMessage {...this.props} />
        <ToastContainer />
        <Nav />

        <Switch>
          {this.renderFullLayoutRoutes()}
          {this.renderSideBarLayoutRoutes()}              
        </Switch>        
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return state
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AppContainer));


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

import { ProfileList }     from './components/Profiles/list';
import { Profile }     from './components/Profiles/profile';
import { ProfileNew }     from './components/Profiles/new';

import { Settings }     from './components/Settings/settings';

import { FileViewer } from './components/FileViewer/file_viewer';
import { RepoFileViewer } from './components/Repo/repo_file_viewer';
import { Revisions } from './components/Repo/revisions';
import { Revision } from './components/Repo/revision';
import { renderComponent } from 'recompose';


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
        {path: '/:username/:kind(settings)', component: Settings},
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
  // componentDidUpdate(prevProps) {
  //   console.log("AppContainer PROPS DID CHANGE");    
  // }
  
  renderFullLayoutRoutes() {
    return this.state.fullLayoutRoutes.map((item) => {
      return (<Route key={item.path} exact path={item.path} 
        render={ props => 
          <FullScreenLayout component={item.component} {...props} /> 
        }
      />)
    })  
 }

 renderSideBarLayoutRoutes() {
  return this.state.sidebarLayoutRoutes.map((item) => {
    return (<Route key={item.path} exact path={item.path} 
      render={ props => 
        <SideLayout {...item}  {...props} /> 
      }
    />)
  })  
}

  render () {
    return (
      <div id="dashboard" style={{height: '100%'}}>
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

function mapDispatchToProps() {
  return {};
}


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AppContainer));


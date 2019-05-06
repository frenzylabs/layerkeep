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
  Route
} from 'react-router-dom'

import { Columns }        from 'bloomer/lib/grid/Columns';
import { Column }         from 'bloomer';
import { Nav }            from './components/Nav';
import { LeftColumn }     from './components/LeftColumn';
import { ProjectList }    from './components/Project/list';
import { ProjectNew }     from './components/Project/new';
import { ProjectDetails } from './components/Project/details';
import { FileViewer } from './components/Repo/file_viewer';
import { Revisions } from './components/Repo/revisions';
import { Revision } from './components/Repo/revision';

class App extends React.Component {
  render () {
    return (
      <BrowserRouter>
        <Nav />

        <Columns isGapless id="dashboard">
          <Column isSize={2}>
            <LeftColumn />
          </Column>

          <Column>
            <Switch>
              <Route exact path="/user/"                    render={() => "Hi"} />
              <Route exact path="/:username/:kind(projects)/new"    component={ProjectNew} />
              <Route exact path="/:username/:kind(projects)"        component={ProjectList} />
              <Route path="/:username/:kind(projects)/:name/:revision(revision)/:revisionPath(.*)"  component={Revision} />
              <Route path="/:username/:kind(projects)/:name/:revisions(revisions)/:revisionPath(.*)"  component={Revisions} />
              <Route path="/:username/:kind(projects)/:name/:tree(tree)/:revisionPath(.*)"  component={ProjectDetails} />
              <Route exact path="/:username/:kind(projects)/:name"  component={ProjectDetails} />
              <Route path="/:username/:kind(projects)/:name/:files(files)/:revisionPath(.*)"  component={FileViewer} />
            </Switch>
          </Column>
        </Columns>
      </BrowserRouter>
    );
  }
}

export default connect()(App);

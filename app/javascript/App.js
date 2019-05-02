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

import { Columns }        from 'bloomer/lib/grid/Columns';
import { Column }         from 'bloomer';
import { Nav }            from './components/Nav';
import { LeftColumn }     from './components/LeftColumn';
import { ProjectList }    from './components/Project/list';
import { ProjectNew }     from './components/Project/new';
import { ProjectDetails } from './components/Project/details';
import AppStore           from './states/store';

export default class App extends React.Component {
  render () {
    return (
      <Provider store={AppStore}>
        <BrowserRouter>
          <Nav />

          <Columns isGapless id="dashboard">
            <Column isSize={2}>
              <LeftColumn />
            </Column>

            <Column>
              <Switch>
                <Route exact path="/user/"                    render={() => "Hi"} />
                <Route exact path="/projects/new"             component={ProjectNew} />
                <Route exact path="/projects"                 component={ProjectList} />
                <Route path="/:username/projects/:name"  component={ProjectDetails} />
              </Switch>
            </Column>
          </Columns>
        </BrowserRouter>
      </Provider>
    );
  }
}

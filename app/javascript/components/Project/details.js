/*
 *  details.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 04/30/19
 *  Copyright 2018 WessCope
 */

import React from 'react';
import { RepoDetails } from '../Repo/details';
import { Container } from 'bloomer/lib/layout/Container';
import { Breadcrumb } from 'bloomer/lib/components/Breadcrumb/Breadcrumb';
import { BreadcrumbItem } from 'bloomer/lib/components/Breadcrumb/BreadcrumbItem';

export class ProjectDetails extends React.Component {
  render() {
    return (
      <div className="section">
      <Container>
        <Breadcrumb>
          <ul>
            <BreadcrumbItem className="title is-4">
              <a href="javascript:;">Projects</a>
            </BreadcrumbItem>

            <BreadcrumbItem className="title is-4" isActive>
              <a href="javascript:;">Project Name</a>
            </BreadcrumbItem>
          </ul>
        </Breadcrumb>
      </Container>
      
      <hr/>
      <br/>

      <Container>
        <RepoDetails/>
      </Container>
      </div>
    )
  }   
}

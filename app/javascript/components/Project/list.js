/*
 *  list.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 04/26/19
 *  Copyright 2018 WessCope
 */

import React from 'react';
import { Container } from 'bloomer/lib/layout/Container';
import { Breadcrumb } from 'bloomer/lib/components/Breadcrumb/Breadcrumb';
import { Pagination } from 'bloomer/lib/components/Pagination/Pagination';
import { BreadcrumbItem } from 'bloomer/lib/components/Breadcrumb/BreadcrumbItem';
import { PageControl } from 'bloomer/lib/components/Pagination/PageControl';
import { PageList } from 'bloomer/lib/components/Pagination/PageList';
import { Page } from 'bloomer/lib/components/Pagination/Page';
import { PageLink } from 'bloomer/lib/components/Pagination/PageLink';
import { PageEllipsis } from 'bloomer';
import { RepoList } from '../Repo/list';

export class ProjectList extends React.Component {
  render() {
    return (
      <div className="section">
        <Container>
          <Breadcrumb>
            <ul>
              <BreadcrumbItem className="title is-4" isActive>
                <a href="javascript:;">Projects</a>
              </BreadcrumbItem>
            </ul>
          </Breadcrumb>
        </Container>
        
        <hr/>
        <br/>

        <Container>
          <RepoList type="projects"/>
        </Container>

        <br/>

        <Container>
          <Pagination isAlign="centered">
            <PageControl isPrevious>Previous</PageControl>
            <PageControl isNext>Next</PageControl>

            <PageList>
              <Page><PageLink>1</PageLink></Page>
              <Page><PageEllipsis/></Page>
              <Page><PageLink>21</PageLink></Page>
              <Page><PageLink>22</PageLink></Page>
              <Page><PageLink>23</PageLink></Page>
              <Page><PageEllipsis/></Page>
              <Page><PageLink>60</PageLink></Page>
            </PageList>
          </Pagination>
        </Container>
      </div>
    )
  }
}

/*
 *  list.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 04/26/19
 *  Copyright 2018 WessCope
 */

import React from 'react';
import { connect } from 'react-redux';

import { Container }      from 'bloomer/lib/layout/Container';
import { Breadcrumb }     from 'bloomer/lib/components/Breadcrumb/Breadcrumb';
import { Pagination }     from 'bloomer/lib/components/Pagination/Pagination';
import { BreadcrumbItem } from 'bloomer/lib/components/Breadcrumb/BreadcrumbItem';
import { PageControl, PageList, Page, PageLink }    from 'bloomer/lib/components/Pagination/PageControl';
import { PageEllipsis }   from 'bloomer';
import { RepoList }       from '../Repo/list';
import { ProjectHandler } from '../../handlers/project_handler';
import { ProjectAction }  from '../../states/project';

class List extends React.Component {
  constructor(props) {
    super(props);

    ProjectHandler.list()
    .then((response) => {
      props.dispatch(ProjectAction.list(response.data))
    })
    .catch((error) => {
      console.log(error);
    });
  }

  render() {
    return (
      <div className="section">
        <Container className="is-fluid">
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

        <Container className="is-fluid">
          <RepoList kind="projects" list={this.props.list} />
        </Container>

        <br/>

        {this.props.list.data.count > 0 && 
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
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  // console.dir(state);
  return {
    list: state.project.list
  }
}

export const ProjectList = connect(mapStateToProps)(List);

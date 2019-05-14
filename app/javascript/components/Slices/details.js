/*
 *  details.js
 *  LayerKeep
 * 
 *  Created by Kevin Musselman (kmussel@gmail.com) on 05/12/19
 *  Copyright 2018 Frenzylabs
 */

import React               from 'react';
import { Link }         from 'react-router-dom';
import { SliceListItem }   from './list_item';
import { RepoEmptyList }  from '../Repo/empty_list';
import { SliceHandler } from '../../handlers/slice_handler';

import { Columns, Column, Level, LevelItem, LevelLeft, LevelRight } from 'bloomer';
import { Media, MediaLeft, MediaContent, MediaRight }     from 'bloomer';
import { RepoBreadCrumbs } from '../Repo/repo_bread_crumbs'

export class SliceDetails extends React.Component {
  constructor(props) {
    super(props);

    this.props.match.params.revisionPath
    this.state = {project: this.props.item, slice: null}

    this.getSlice()

    window.sl = this;
  }

  getSlice() {
    var url = this.props.match.url
    var params = {}
    if (this.state.project) {
      params["repo_id"] = this.state.project.id
    }
    var id = this.props.match.params.revisionPath;
    SliceHandler.show(id, {params})
    .then((response) => {
      this.updateSlice(response.data)
    })
    .catch((error) => {
      console.log(error);
    });
  }

  updateSlice(data) {
    this.setState({ slice: data })
  }

  // componentDidUpdate(prevProps) {
  //   console.log(prevProps);
  //   console.log(this.props);
  // }
  
  // shouldComponentUpdate(nextProps, nextState) {
  //     const differentList = this.props.list !== nextProps.list;
  //     return differentList;
  // }

  empty() {
    return (
      <RepoEmptyList kind={this.props.match.params.kind} />
    );
  }

  renderStatus() {
    var status = this.state.slice.data.attributes.status;
    switch (status) {
      case "success": {
        return (<span className="has-text-success">{status}</span>)
      }
      case "failed": {
        return (<span className="has-text-danger">{status}</span>)
      }
      default: {
        return (<span>{status}</span>);
      }
    }
  }

  renderDownloadLink() {
    if (this.state.slice.data.attributes.status == "success") {
      const urlparams = this.props.match.params;
      const url       = `/${urlparams.username}/slices/${this.state.slice.data.id}/gcodes`;
      return (
        <LevelItem>
        <a className="button is-small" href={url} target="_blank">
                    <span className="icon is-small">
                      <i className="fas fa-download"></i>
                    </span>
                    <span>Download</span>
                  </a>
                  </LevelItem>
      )
    }
  }

  renderSlice() {
    var params = this.props.match.params;
    
    if (this.state.slice && this.state.slice.data.attributes) {
      var slice = this.state.slice.data.attributes;
      slice.status == "success"
      return (
      <Media>
        <MediaContent >
          <Level>
            <LevelLeft>
              <LevelItem>{slice.name}</LevelItem>
            </LevelLeft>
            <LevelRight>
              
                { this.renderDownloadLink()}
              <LevelItem>
                {this.renderStatus()}
              </LevelItem>
            </LevelRight>
          </Level>
          <br/>
          <h3 className="title is-4"> Project</h3>
          <Media >
            
            <MediaContent>
            
              {slice.project_files.map((pf) => {
                return (<Level key={pf.id}>  
                  <LevelLeft>
                    {pf.filepath}
                  </LevelLeft>
                  <LevelItem>
                    {pf.commit}
                  </LevelItem>
                </Level>)
              })}
            </MediaContent>
          </Media>
          <br/>
          <h3 className="title is-4">Profiles</h3>
          <Media >
            
            <MediaContent>
            
              {slice.profile_files.map((pf) => {
                return (<Level key={pf.id}>  
                  <LevelLeft>
                    {pf.filepath}
                  </LevelLeft>
                  <LevelItem>
                    {pf.commit}
                  </LevelItem>
                </Level>)
              })}
            </MediaContent>
          </Media>
        </MediaContent>
      </Media>)
      // .project_files
      // return (JSON.stringify(this.state.slice))
    }
  }
  
  render() {
    var params = this.props.match.params;
    return (
      <div className="section">
          <Columns className="is-narrow is-gapless">
            <Column>
              
            </Column>

            <Column isSize={2} className="has-text-right">
            <Link className="button" to={`/${params.username}/projects/${params.name}/slices/new`}>New Slice</Link>
          </Column>
          </Columns>
          {this.renderSlice()}
      </div>
    );
  }
}
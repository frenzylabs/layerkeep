/*
 *  list.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 04/30/19
 *  Copyright 2018 WessCope
 */

import React               from 'react';
import { Link }         from 'react-router-dom';
import { SliceListItem }   from './list_item';
import { SliceEmptyList }  from './empty_list';
import { SliceHandler } from '../../handlers/slice_handler';

import { Columns, Column } from 'bloomer';
import { RepoBreadCrumbs } from '../Repo/repo_bread_crumbs'

export class SliceList extends React.Component {
  constructor(props) {
    super(props);


    this.state = {project: this.props.item, page: 1, perPage: 20, list: {data: [], meta: {}}}
    this.items = this.items.bind(this);
    this.updateSlicesList()
  }

  updateSlicesList() {
    var url = this.props.match.url
    var params = {per_page: this.state.perPage, page: this.state.page}
    if (this.state.project) {
      params["repo_id"] = this.state.project.id
    }
    SliceHandler.list({params})
    .then((response) => {
      this.updateSlices(response.data)
    })
    .catch((error) => {
      console.log(error);
    });
  }

  updateSlices(data) {
    this.setState({ list: data })
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
      <SliceEmptyList params={this.props.match.params} />
    );
  }

  items() {
    var params = this.props.match.params;
      return this.state.list.data.map((item) => {
        return (<SliceListItem path={`/${params.username}/${params.kind}/${this.props.item.name}/slices/${item.id}`} item={item} key={item.id} />)
      });
  }
  
  render() {
    const component = this.state.list.data.length > 0 ? this.items() : this.empty();
    var params = this.props.match.params;
    return (
      <div>
        <div>
          <Columns className="is-narrow is-gapless">
            <Column>
              
            </Column>

            <Column isSize={2} className="has-text-right">
            <Link className="button" to={`/${params.username}/projects/${params.name}/slices/new`}>New Slice</Link>
          </Column>
          </Columns>
        </div>
        {component}
      </div>
    );
  }
}

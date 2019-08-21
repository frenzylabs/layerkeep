/*
 *  list.js
 *  LayerKeep
 * 
 *  Created by Kevin Musselman (kmussel@gmail.com) on 04/30/19
 *  Copyright 2019 Frenzylabs
 */

import React                from 'react';
import { Link }             from 'react-router-dom';
import { SliceListItem }    from './list_item';
import { SliceEmptyList }   from './empty_list';
import { SliceHandler }     from '../../handlers';

import { 
  Columns, 
  Column 
} from 'bloomer';

export class SliceList extends React.Component {
  constructor(props) {
    super(props);


    this.state = {
      project: this.props.item, 
      page: 1, 
      perPage: 20, 
      list: {
        data: [], 
        meta: {}
      }
    }
    
    this.items = this.items.bind(this);

    this.cancelRequest = SliceHandler.cancelSource();
    this.updateSlicesList()
  }

  componentWillUnmount() {
    this.cancelRequest.cancel("Left Page");
  }

  updateSlicesList() {
    var url = this.props.match.url
    var params = {per_page: this.state.perPage, page: this.state.page}
    if (this.state.project) {
      params["repo_id"] = this.state.project.id
    }
    SliceHandler.list(this.props.match.params.username, {params, cancelToken: this.cancelRequest.token})
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
      <div className="flex-wrapper">
        <hr/>
        <br/>

        
          <Columns className="is-narrow is-gapless is-mobile">
            <Column>
                <h3 className="subtitle">Slices</h3>
            </Column>

            <Column isSize={3} className="has-text-right">
            <Link className="button" to={`/${params.username}/projects/${params.name}/slices/new`}>New Slice</Link>
          </Column>
        </Columns>

        <div> 
          {component}
        </div>
      </div>
    );
  }
}

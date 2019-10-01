/*
 *  list.js
 *  LayerKeep
 * 
 *  Created by Kevin Musselman (kmussel@gmail.com) on 04/30/19
 *  Copyright 2019 Frenzylabs
 */

import React                from 'react';
import { Link }             from 'react-router-dom';
import { PrintListItem }    from './list_item';
import { PrintEmptyList }   from './empty_list';
import { PrintHandler }     from '../../handlers';
import SpinnerModal       from '../Modal/spinner';
import PaginatedList      from '../pagination';
import Loader             from '../Loader';
import { FilterList }         from './filter_list'

import { 
  Columns, 
  Column 
} from 'bloomer';

import { SearchDropdown } from '../Form/SearchDropdown'

const qs = require('qs');

export class PrintList extends React.Component {
  constructor(props) {
    super(props);

    var qparams = qs.parse(this.props.location.search, { ignoreQueryPrefix: true })

    this.state = {
      search: {
        page: parseInt(qparams["page"] || 1), 
        per_page: parseInt(qparams["per_page"] || 20), 
        q: qparams["q"] || {}
      },
      list: {
        data: [], 
        meta: {}
      }      
    }
    
    this.items          = this.items.bind(this);
    this.onChangePage   = this.onChangePage.bind(this)

    this.cancelRequest = PrintHandler.cancelSource();
  }

  componentDidMount() {
    this.getPrints()
  }

  componentWillUnmount() {
    this.cancelRequest.cancel("Left Page");
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.location.search != prevProps.location.search) {
      var qparams = qs.parse(this.props.location.search, { ignoreQueryPrefix: true })
      var search = {
        page: parseInt(qparams["page"] || 1), 
        per_page: parseInt(qparams["per_page"] || 20), 
        q: qparams["q"] || {}
      }
      this.setState({search: search})
    }
    else if (JSON.stringify(this.state.search) != JSON.stringify(prevState.search)) {
      var url = qs.stringify(this.state.search, { addQueryPrefix: true });      
      this.props.history.push(`${url}`);
      this.getPrints();
    }
  }

  getPrints() {
    this.setState({isLoading: true, error: null})
    PrintHandler.list(this.props.match.params.username, { qs: this.state.search, cancelToken: this.cancelRequest.token})
    .then((response) => {
      this.updatePrints(response.data)
    })
    .catch((err) => {
      var errMessage = "There was an error loading the prints."
      if (err.response && err.response.data && err.response.data.error) {
        var error = err.response.data.error
        if (error.message) {
          errMessage = error.message
        } else {
          errMessage = JSON.stringify(error)
        }
      }
      this.setState({
        error:      errMessage,
        isLoading: false
      })
    });
  }

  updatePrints(data) {
    this.setState({ list: data, isLoading: false })
  }

  onChangePage(page) {
    // update state with new page of items
    this.setState({ search: {...this.state.search, page: page }});    
  }

  onFilter(filter) {   
    var search = this.state.search
    var q = {}
    if (filter) {
      if (filter.project_id) {
        q["project_id"] = filter.project_id
      }
      if (filter.profile_id) {
        q["profile_id"] = filter.profile_id
      }
      if (filter.slice_id) {
        q["slice_id"] = filter.slice_id
      }
    }
    if (JSON.stringify(q) != JSON.stringify(search.q)) {
      this.cancelRequest.cancel("Changed Filter");
      this.cancelRequest = PrintHandler.cancelSource();
      this.setState({ search: {...search, page: 1, q: q }})
    }
  }

  renderPagination() {
    if (this.state.list.data.length > 0) {
      var {current_page, last_page, total} = this.state.list.meta;
      return (
        <PaginatedList currentPage={current_page} pageSize={this.state.search.per_page} totalPages={last_page} totalItems={total} onChangePage={this.onChangePage} /> 
      )
    }
  }

  empty() {
    return (
      <PrintEmptyList params={this.props.match.params} search={this.state.search} />
    );
  }

  items() {
    var params = this.props.match.params;
      return this.state.list.data.map((item) => {
        return (<PrintListItem path={`/${params.username}/prints/${item.id}`} item={item} key={item.id} />)
      });
  }

  renderContent() {
    if (this.state.isLoading) {
      return (<SpinnerModal />)
    } else if (this.state.error) {
      return (
        <article className="message is-danger">
          <div className="message-body">
            {this.state.error}
          </div>
        </article>
      )
    } else {
      const component = this.state.list.data.length > 0 ? this.items() : this.empty();
      return (<div>
          {component}
        </div>
      )
    }
  }
  
  render() {    
    var params = this.props.match.params;
    return (
      <div className="section">
        <div className="container is-fluid">
          <Columns className="is-narrow is-gapless is-mobile">
            <Column>
                <h2 className="title is-4">Prints</h2>
            </Column>

            <Column isSize={3} className="has-text-right">
            <Link className="button" to={`/${params.username}/prints/new`}>New Print</Link>
          </Column>
        </Columns>

        <div> 
          <FilterList {...this.props} search={this.state.search} onFilter={this.onFilter.bind(this)}/>
          {this.renderContent()}
          <br/>
          {this.renderPagination()}
          <br />
        </div>
      </div>
      </div>
    );
  }
}

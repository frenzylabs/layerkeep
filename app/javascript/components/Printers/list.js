/*
 *  list.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 04/26/19
 *  Copyright 2018 WessCope
 */

import React    from 'react';
import { Link } from 'react-router-dom';

import { RepoList }           from '../Repo/list';
import { PrinterHandler }     from '../../handlers';
import SpinnerModal           from '../Modal/spinner';
import PaginatedList          from '../pagination';
import Loader                 from '../Loader';
import { PrinterEmptyList }   from './empty_list';
import { PrinterListItem }    from './list_item';

import { 
  Container, 
  Breadcrumb, 
  BreadcrumbItem 
} from 'bloomer';

const qs = require('qs');


export class PrinterList extends React.Component {
  constructor(props) {
    super(props);

    var qparams = qs.parse(this.props.location.search, { ignoreQueryPrefix: true })
    
    this.state = {
      isLoading: true,
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

    this.onChangePage = this.onChangePage.bind(this);

    this.cancelRequest = PrinterHandler.cancelSource();
    
  }

  componentDidMount() {
    this.fetchPrinters()
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
      this.fetchPrinters();
    }
  }

  fetchPrinters() {
    this.setState({isLoading: true, error: null})
    PrinterHandler.list(this.props.match.params.username, {qs: this.state.search, cancelToken: this.cancelRequest.token})
    .then((response) => {
      this.setState({ 
        ...this.state,
        list:       response.data,
        isLoading:  false
      });
    })
    .catch((err) => {
      var errMessage = "There was an error loading the printers."
      if (err.response.data && err.response.data.error) {
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

  onChangePage(page) {
    // update state with new page of items
    this.setState({ page: page });    
  }

  
  componentDidUpdate(prevProps, prevState) {
    if (this.state.page != prevState.page || this.state.perPage != prevState.perPage) {
      this.fetchPrinters();
    }
  }

  

  renderNewPrinterButton() {
    if (this.state.list.meta && this.state.list.meta.canManage) {
      return (
        <div className="column is-3 has-text-right">
          <Link className="button" to={`/${this.props.match.params.username}/printers/new`}>New Printer</Link>
        </div>    
      )
    }
    return null
  }

  renderPagination() {
    if (this.state.list.data.length > 0) {
      var {current_page, last_page, total} = this.state.list.meta;

      return (
        <PaginatedList currentPage={current_page} pageSize={this.state.perPage} totalPages={last_page} totalItems={total} onChangePage={this.onChangePage} /> 
      )
    }
  }

  renderEmpty() {
    return (
      <PrinterEmptyList params={this.props.match.params} />
    );
  }

  renderItems() {
    var params = this.props.match.params;
      return this.state.list.data.map((item) => {
        return (<PrinterListItem path={`/${params.username}/printers/${item.id}`} item={item} key={item.id} />)
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
      const component = this.state.list.data.length > 0 ? this.renderItems() : this.renderEmpty();
      return (<div>
          {component}
        </div>
      )
    }
  }


  render() {
    return (
      <div className="section">
        <Container className="is-fluid">
          <div className="columns is-mobile">
            <div className="column">
              <Breadcrumb>
                <ul>
                  <BreadcrumbItem className="title is-4" isActive>
                    <Link to={`/${this.props.match.params.username}/printers`}>Printers</Link>
                  </BreadcrumbItem>
                </ul>
              </Breadcrumb>
            </div>
            {this.renderNewPrinterButton()}
          </div>
        </Container>
        <hr/>
        <br/>

        <Container className="is-fluid">
          {this.renderContent()}
          <br/>
          {this.renderPagination()}
          <br/>
        </Container>

        <br/>

        
      </div>
    )
  }
}

export default PrinterList

/*
 *  new.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 04/26/19
 *  Copyright 2018 WessCope
 */

import React              from 'react';
import { Link, Redirect }       from 'react-router-dom';
import Formsy             from 'formsy-react';
import { 
  Section,
  Container, 
  Columns, 
  Column, 
  Button, 
  Box,
  Control,
  Label,
  Field, 
  Table, 
  Icon,
  Breadcrumb, 
  BreadcrumbItem
} from 'bloomer';


import InputField         from '../Form/InputField';
import TextField          from '../Form/TextField';
import { SearchDropdown } from '../Form/SearchDropdown'
import { PrinterHandler } from '../../handlers';
import Modal              from '../Modal';
import { PrinterForm }    from './printer_form';
import Loader                 from '../Loader';

const qs = require('qs');

export class PrinterNew extends React.Component {
  constructor(props) {
    super(props);

    var qparams = qs.parse(this.props.location.search, { ignoreQueryPrefix: true })
    
    this.initialState = {      
      requestError:     null,
      printer_count: 0,
      isLoading: true
    };
    
    this.state = Object.assign({}, this.initialState);

    // this.dismissError       = this.dismissError.bind(this);
    this.cancelRequest      = PrinterHandler.cancelSource();
  }

  componentDidMount() {
    this.fetchPrinterCount()
  }

  componentWillUnmount() {
    this.cancelRequest.cancel("Left Page");
  }

  componentDidUpdate(prevProps) {
    if (prevProps.location.pathname != this.props.location.pathname) {
      this.setState(this.initialState)
    }
  }

  fetchPrinterCount() {
    this.setState({isLoading: true, error: null})
    PrinterHandler.count(this.props.match.params.username, {cancelToken: this.cancelRequest.token})
    .then((response) => {
      this.setState({ 
        printer_count:  response.data["count"],
        isLoading:  false
      });
    })
    .catch((err) => {
      var errMessage = "There was an error loading Printers."
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


  onSuccess(printer) {
    var redirectUrl = `/${this.props.match.params.username}/printers/${printer.id}`
    if (this.props.location.state && this.props.location.state.redirect) {
      redirectUrl = this.props.location.state.redirect
    }
    this.setState({redirect: redirectUrl})
  }


  renderContent() {
    if (this.state.isLoading) return (<Loader />)
    if (!this.props.app.features || !this.props.app.features.print) return;
    var printerCnt = this.props.app.features.print.printers
    if (printerCnt == "unlimited" || parseInt(printerCnt) > this.state.printer_count) {
      return (
        <PrinterForm {...this.props} onSuccess={this.onSuccess.bind(this)} />
      )
    } else {
      return (
        <div className="control is-expanded">
          <p>
            <Link style={{fontWeight: 'bold'}} to={`/${this.props.match.params.username}/settings/billing`}>Update Subscription</Link> to 
            add more printers.
          </p>          
        </div>
      )
    }
  }


  render() {
    if(this.state.redirect) { 
      return (<Redirect to={this.state.redirect}/>);
    }
    return (
      <div className="section">
        <div className="container is-fluid">
          <div className="columns is-mobile">
            <div className="column">
              <Breadcrumb>
                <ul>
                  <BreadcrumbItem className="title is-4">
                    <Link to={`/${this.props.match.params.username}/printers`}>Printers</Link>
                  </BreadcrumbItem>

                  <BreadcrumbItem className="title is-4" > &nbsp; New </BreadcrumbItem>
                </ul>
              </Breadcrumb>
            </div>
          </div>
          {this.renderContent()}
        </div>
      
        
        

      </div>
    )
  }
}

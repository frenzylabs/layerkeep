/*
 *  edit.js
 *  LayerKeep
 * 
 *  Created by Kevin Musselman (kmussel@gmail.com) on 09/03/19
 *  Copyright 2019 Frenzylabs
 */

import React              from 'react';
import { Link, Redirect } from 'react-router-dom';
import { PrinterHandler }   from '../../handlers';
import Modal              from '../Modal';

import SpinnerModal       from '../Modal/spinner';
import { PrinterForm }    from './printer_form';

import { 
  Container,
  Breadcrumb, 
  BreadcrumbItem,
  Columns,
  Column,
  Button
} from 'bloomer';

export class PrinterEdit extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true, 
      printer: {},
      error: 0
    };

    this.cancelRequest         = PrinterHandler.cancelSource()

    this.deletePrinterClick    = this.deletePrinterClick.bind(this);
    this.printerUpdated        = this.printerUpdated.bind(this);
    this.dismissAction         = this.dismissAction.bind(this);
    this.loadPrinterDetails    = this.loadPrinterDetails.bind(this);
  }

  componentWillUnmount() {
    this.cancelRequest.cancel("Left Form")
  }

  componentDidMount() {
    this.loadPrinterDetails();
  }

  loadPrinterDetails() {    
    this.setState({isLoading: true})
    PrinterHandler.get(this.props.match.params.username, this.props.match.params.printerId, { cancelToken: this.cancelRequest.token })
    .then((response) => {
      this.setState({isLoading: false, printer: response.data.data})
    })
    .catch((err) => {
      var errMessage = "There was an error loading the printer details."
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


  

  dismissAction() {
    this.setState({
      ...this.state,
      requestError: null
    });
  }

  deleteItem() {
    this.setState({isDeleting: true})
    PrinterHandler.delete(this.props.match.params.username, this.props.match.params.printerId)
    .then((response) => {
      this.setState({isDeleting: false, redirect: `/${this.props.match.params.username}/printers`})
    })
    .catch((err) => {
      console.dir("Error", err);
      this.setState({
        requestError:      err,
        isDeleting: false
      })
    });
  }

  deletePrinterClick(e) {
    if (window.confirm('Are you sure you wish to delete this item?'))
     this.deleteItem()
  }

  printerUpdated(data) {
    if (data) {
      this.setState({printer: data, redirect: `/${this.props.match.params.username}/printers/${data.id}`})
    }
  }

  renderDelete() {
    if (!this.state.printer.attributes) return;
    return (
      <Column className="has-text-right">
        <Button className="is-danger" onClick={this.deletePrinterClick}>Delete</Button>
      </Column>
    )
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
      return (
        <PrinterForm {...this.props} printer={this.state.printer} onSuccess={this.printerUpdated} />
      )
    }
  }
  

  render() {
    if(this.state.redirect) { 
      return (<Redirect to={`${this.state.redirect}`}/>);
    }
    const urlparams = this.props.match.params
    return (
      <div className="section">
        <div className="container is-fluid">
          <Columns className="is-mobile">
            <Column>
              <Breadcrumb>
                <ul>
                  <BreadcrumbItem className="title is-4">
                    <Link to={`/${urlparams.username}/printers`}>Printers</Link>
                  </BreadcrumbItem>

                  <BreadcrumbItem className="title is-4" >
                    <Link to={`/${urlparams.username}/printers/${urlparams.printerId}`}> &nbsp; {urlparams.printerId}</Link>
                  </BreadcrumbItem>
                </ul>
              </Breadcrumb>
            </Column>
            {this.renderDelete()}            
          </Columns>
        
          { this.renderContent() }
        </div>

        <Modal 
          component={Modal.spinner} 
          caption={"Deleting Printer..."}
          isActive={this.state.isDeleting }  
        />  

        <Modal
          component={Modal.error}
          requestError={this.state.requestError}
          isActive={this.state.requestError != null}
          dismissAction={this.dismissAction}
        />
        
      </div>
    )
  }
}


export default PrinterEdit;

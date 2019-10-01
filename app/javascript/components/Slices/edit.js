/*
 *  edit.js
 *  LayerKeep
 * 
 *  Created by Kevin Musselman (kmussel@gmail.com) on 09/03/19
 *  Copyright 2019 Frenzylabs
 */

import React              from 'react';
import { Link, Redirect } from 'react-router-dom';
import { SliceHandler }   from '../../handlers';
import Modal              from '../Modal';
import { SliceForm }      from './slice_form';
import SpinnerModal       from '../Modal/spinner';

import { 
  Container,
  Breadcrumb, 
  BreadcrumbItem,
  Columns,
  Column,
  Button
} from 'bloomer';

import ActiveStorageProvider from 'react-activestorage-provider'

export class SliceEdit extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true, 
      slice: {},
      error: 0
    };

    this.cancelRequest         = SliceHandler.cancelSource()

    this.deleteSliceClick      = this.deleteSliceClick.bind(this);
    this.dismissAction         = this.dismissAction.bind(this);
    this.loadSliceDetails      = this.loadSliceDetails.bind(this);
  }

  componentWillUnmount() {
    this.cancelRequest.cancel("Left Form")
  }

  componentDidMount() {
    this.loadSliceDetails();
  }

  loadSliceDetails() {    
    this.setState({isLoading: true})
    SliceHandler.get(this.props.match.params.username, this.props.match.params.sliceId, { cancelToken: this.cancelRequest.token })
    .then((response) => {
      this.setState({isLoading: false, slice: response.data.data})
    })
    .catch((err) => {
      var errMessage = "There was an error loading the slice details."
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


  uploadStorageConfig() {
    var slicepath = `/${this.props.match.params.username}/slices`
    return {
      directUploadPath: `/${this.props.match.params.username}/slices/assets/presign`,
      endpoint: {
        path: `${slicepath}/${this.props.match.params.sliceId}`,
        model: 'Slice',
        attribute: 'files',              
        method: 'PUT'
      }
    }
  }

  deleteItem() {
    this.setState({isDeleting: true})
    SliceHandler.delete(this.props.match.params.username, this.props.match.params.sliceId)
    .then((response) => {
      this.setState({isDeleting: false, redirect: `/${this.props.match.params.username}/slices`})
    })
    .catch((err) => {
      console.dir("Error", err);
      this.setState({
        requestError:      err,
        isDeleting: false
      })
    });
  }

  deleteSliceClick(e) {
    if (window.confirm('Are you sure you wish to delete this item?'))
     this.deleteItem()
  }

  renderDelete() {
    if (!this.state.slice.attributes) return;
    return (
      <Column className="has-text-right">
        <Button className="is-danger" onClick={this.deleteSliceClick}>Delete</Button>
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
        <SliceForm {...this.props} slice={this.state.slice} uploadStorageConfig={this.uploadStorageConfig()} />
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
                    <Link to={`/${urlparams.username}/slices`}>Slices</Link>
                  </BreadcrumbItem>

                  <BreadcrumbItem className="title is-4" >
                    <Link to={`/${urlparams.username}/slices/${urlparams.sliceId}`}> &nbsp; {urlparams.sliceId}</Link>
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
          caption={"Deleting Slice..."}
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


export default SliceEdit;

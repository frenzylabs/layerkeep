/*
 *  new.js
 *  LayerKeep
 * 
 *  Created by Kevin Musselman (kmussel@gmail.com) on 09/03/19
 *  Copyright 2019 Frenzylabs
 */

import React              from 'react';
import { Link, Redirect }       from 'react-router-dom';
import InputField         from '../Form/InputField';
import Formsy             from 'formsy-react';
import TextField          from '../Form/TextField';
import { ProjectHandler, ProfileHandler, SliceHandler } from '../../handlers';
import Modal              from '../Modal';
import { SliceForm }   from './slice_form';

import { 
  Container,
  Breadcrumb, 
  BreadcrumbItem,
  Section, 
  Columns, 
  Column, 
  Table, 
  Icon,
  Box, 
  Control, 
  Field, 
  Button
} from 'bloomer';


export class SliceNew extends React.Component {
  constructor(props) {
    super(props);

    this.state = { 
      projects: [], 
      profiles: [], 
      engines: [],
      selectedEngine: null,
      requestError: null
    }

    this.descriptionChanged = this.descriptionChanged.bind(this);
    this.dismissError       = this.dismissError.bind(this);
    this.cancelRequest      = SliceHandler.cancelSource()
  }

  componentDidMount() {
    this.loadProjects()
    this.loadProfiles()
  }

  componentWillUnmount() {
    this.cancelRequest.cancel("Left Page");
  }

  loadProjects() {    
    ProjectHandler.list(this.props.match.params.username, {cancelToken: this.cancelRequest.token})
    .then((response) => {
      var projects = response.data.data.map((item) => {
        return {name: item.attributes.name, value: item.attributes.path, id: item.id}
      })

      this.setState({ projects: projects})
    })
    .catch((error) => {
      console.log(error);
    });
  }


  loadProfiles() {    
    ProfileHandler.list(this.props.match.params.username, {cancelToken: this.cancelRequest.token})
    .then((response) => {
      var profiles = response.data.data.map((item) => {
        return {name: item.attributes.name, value: item.attributes.path, id: item.id}
      })
      this.setState({ profiles: profiles})
    })
    .catch((error) => {
      console.log(error);
    });
  }

  
  descriptionChanged(e) {
    this.setState({
      ...this.state,
      description: e.currentTarget.value
    });
  }

  dismissError() {
    this.setState({
      ...this.state,
      creatingSlice: false,
      requestError: null
    });
  }

  uploadStorageConfig() {
    var slicepath = `/${this.props.match.params.username}/slices`
    return {
      directUploadPath: `/${this.props.match.params.username}/slices/assets/presign`,
      endpoint: {
        path: `${slicepath}`,
        model: 'Slice',
        attribute: 'files',              
        method: 'POST'
      },
      multiple: false
    }
  }

  onSuccess(slice) {
    this.setState({redirect: true, sliceID: slice.id})
  }

  renderContent() {
    if (this.state.error) {
      return (
        <article className="message is-danger">
          <div className="message-body">
            {this.state.error}
          </div>
        </article>
      )
    } else {
      return (
        <SliceForm {...this.props} uploadStorageConfig={this.uploadStorageConfig()} onSuccess={this.onSuccess.bind(this)} />
      )
    }
  }

  

  render() {
    if(this.state.redirect) { 
      return (<Redirect to={`/${this.props.match.params.username}/slices/${this.state.sliceID}`}/>);
    }
    return (
      <div className="section">
        <div className="container is-fluid">
          <div className="columns is-mobile">
            <div className="column">
              <Breadcrumb>
                <ul>
                  <BreadcrumbItem className="title is-4">
                    <Link to={`/${this.props.match.params.username}/slices`}>Slices</Link>
                  </BreadcrumbItem>

                  <BreadcrumbItem className="title is-4" > &nbsp; New </BreadcrumbItem>
                </ul>
              </Breadcrumb>
            </div>
          </div>
        </div>
      
        {this.renderContent()}

        <Modal 
          component={Modal.spinner} 
          caption={"Creating Slice..."}
          isActive={this.state.creatingSlice }  
        />  

        <Modal
          component={Modal.error}
          requestError={this.state.requestError}
          isActive={this.state.requestError !== null}
          dismissAction={this.dismissError}
        />
        
      </div>
    )
  }
}

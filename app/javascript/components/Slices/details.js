/*
 *  details.js
 *  LayerKeep
 * 
 *  Created by Kevin Musselman (kmussel@gmail.com) on 09/03/19
 *  Copyright 2019 Frenzylabs
 */

import React              from 'react';
import { Link }           from 'react-router-dom';
import { SliceHandler }   from '../../handlers';
import SpinnerModal       from '../Modal/spinner';


import { 
  Container,
  Breadcrumb, 
  BreadcrumbItem,
  Columns,
  Column,
  Button
} from 'bloomer';


export class SliceDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true, 
      slice: {}
    };

    this.cancelRequest      = SliceHandler.cancelSource()
    this.loadSliceDetails   = this.loadSliceDetails.bind(this);
  }

  componentDidMount() {
    this.loadSliceDetails();
  }

  componentWillUnmount() {
    this.cancelRequest.cancel("Left Form")
  }

  componentDidUpdate() {
    var currentSliceNot = this.props.app.notifications.slice
    
    if (currentSliceNot && (!this.state.slice.attributes 
        || this.state.slice.attributes.status != currentSliceNot[this.state.slice.id].status)) {
      if (!this.state.isLoading)
        this.loadSliceDetails()
    }
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


  renderStatus() {
    if (!this.state.slice.attributes || !this.state.slice.attributes.slicer_engine) return null;

    var status = this.state.slice.attributes.status;
    switch (status) {
      case "success": {
        return (<span className="level-right has-text-success">{status}</span>)
      }
      case "failed": {
        return (<span className="level-right has-text-danger">{status}</span>)
      }
      default: {
        return (<span className="level-right" >{status}</span>);
      }
    }
  }

  renderDownloadLink() {
    if (this.state.slice.attributes && this.state.slice.attributes.status == "success") {
      const urlparams = this.props.match.params;
      const url       = `/${urlparams.username}/slices/${this.state.slice.id}/gcodes`;
      return (
        <div className="level-item">
          <a className="button is-small" href={url} target="_blank">
            <span className="icon is-small">
              <i className="fas fa-download"></i>
            </span>
            <span>Download</span>
          </a>
        </div>
      )
    }
  }

  renderLogfileLink() {
    var log_data = this.state.slice.attributes.log_data;
    if (log_data && log_data["id"]) {
      const urlparams = this.props.match.params;
      const url       = `/${urlparams.username}/slices/${this.state.slice.id}/gcodes?logpath=true`;
      return (
        <div className="level-item">
          <a className="button is-small" href={url} target="_blank">
            <span className="icon is-small">
              <i className="fas fa-download"></i>
            </span>
            <span>Logfile</span>
          </a>
        </div>
      )
    }
  }


  renderGcode() {
    return (
      <div className={`card`}>
        <div className="card-header">
          <div className="card-header-title level">
            <p className="level-left">Gcode</p>
            {this.renderStatus()}            
          </div>
        </div>

        <div className="card-content">
            <div className="level">
              <div className="level-left">
                <div className="level-item">
                  {this.state.slice.attributes.name}
                </div>
              </div>
              <div className="level-right">
                {this.renderDownloadLink()}
                {this.renderLogfileLink()}                
              </div>
            </div>
        </div>
      </div>
    )
  }

  renderRepos(files) {
    if (!files) return null;
    return files.map((pf) => {
      const url       = `/${pf.attributes.repo_path}/files/${pf.attributes.commit}/${pf.attributes.filepath}`;

      return (<div className="level" key={pf.id}>  
                <div className="level-left">
                  <div className="level-item">{pf.attributes.repo_name}</div>
                  <div className="level-item">
                    <Link to={url}>{pf.attributes.filepath}</Link>
                  </div>
                  <div className="level-item">
                  {pf.attributes.commit}
                </div>
              </div>
            </div>)
    })
  }

  renderProjectSection() {
    return (
      <div className={`card`}>
        <div className="card-header">
          <p className="card-header-title">
            Project File
          </p>
        </div>

        <div className="card-content">
          {this.renderRepos(this.state.slice.attributes.project_files)}
        </div>
      </div>
    )
  }

  renderProfileSection() {
    return (
      <div className={`card`}>
        <div className="card-header">
          <p className="card-header-title">
            Profiles
          </p>
        </div>

        <div className="card-content">
          {this.renderRepos(this.state.slice.attributes.profile_files)}
        </div>
      </div>
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
      return (<div>
          {this.renderGcode()}
          {this.renderProjectSection()}
          {this.renderProfileSection()}
        </div>
      )
    }
  }


  render() {    
    return (
      <div className="section">
        <Container className="is-fluid">
          <Columns className="is-mobile">
            <Column>
              <Breadcrumb>
                <ul>
                  <BreadcrumbItem className="title is-4">
                    <Link to={`/${this.props.match.params.username}/slices`}>Slices</Link>
                  </BreadcrumbItem>

                  <BreadcrumbItem className="title is-4" > &nbsp; {this.props.match.params.sliceId}</BreadcrumbItem>
                </ul>
              </Breadcrumb>
            </Column>
            <Column className="has-text-right"><Link className="button" to={`${this.props.match.url}/edit`}>Edit</Link></Column>
          </Columns>
          {this.renderContent()}
        </Container>
        <br/>
      </div>
    )
  }   
}

export default SliceDetails;

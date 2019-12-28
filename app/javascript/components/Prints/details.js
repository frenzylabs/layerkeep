/*
 *  details.js
 *  LayerKeep
 * 
 *  Created by Kevin Musselman (kmussel@gmail.com) on 09/03/19
 *  Copyright 2019 Frenzylabs
 */

import React              from 'react';
import { Link }           from 'react-router-dom';

import { PrintHandler }   from '../../handlers';
import SpinnerModal       from '../Modal/spinner';
import { PrintAssetItem } from './asset_item'

import Gallery   from '../Utils/gallery';

import { 
  Container,
  Breadcrumb, 
  BreadcrumbItem,
  Columns,
  Column,
  Table,
  Button
} from 'bloomer';


export class PrintDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true, 
      print: {}
    };

    this.cancelRequest      = PrintHandler.cancelSource()
    this.loadPrintDetails   = this.loadPrintDetails.bind(this);
  }

  componentDidMount() {
    this.loadPrintDetails();
  }

  componentWillUnmount() {
    this.cancelRequest.cancel("Left Form")
  }

  componentDidUpdate() {
    var currentPrintNot = this.props.app.notifications.print
    
    if (currentPrintNot && currentPrintNot[this.state.print.id] && (!this.state.print.attributes 
        || this.state.print.attributes.status != currentPrintNot[this.state.print.id].status)) {
      if (!this.state.isLoading)
        this.loadPrintDetails()
    }
  }

  loadPrintDetails() {    
    this.setState({isLoading: true})
    PrintHandler.get(this.props.match.params.username, this.props.match.params.printId, { cancelToken: this.cancelRequest.token })
    .then((response) => {
      this.setState({isLoading: false, print: response.data.data})
    })
    .catch((err) => {
      var errMessage = "There was an error loading the print details."
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
    if (!this.state.print.attributes) return null;

    var status = this.state.print.attributes.status;
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
    if (this.state.print.attributes && this.state.print.attributes.status == "success") {
      const urlparams = this.props.match.params;
      const url       = `/${urlparams.username}/prints/${this.state.print.id}/gcodes`;
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
    var log_data = this.state.print.attributes.log_data;
    if (log_data && log_data["id"]) {
      const urlparams = this.props.match.params;
      const url       = `/${urlparams.username}/prints/${this.state.print.id}/gcodes?logpath=true`;
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


  renderPrinter() {
    if (!(this.state.print.attributes.printer && this.state.print.attributes.printer.id)) return null;

    const url       = `/${this.props.match.params.username}/printers/${this.state.print.attributes.printer.id}`;
    return (
      <div className={`card`}>
        <div className="card-header">
          <div className="card-header-title level">
            <p className="level-left">Printer</p>          
          </div>
        </div>

        <div className="card-content">
          <div className="level">
            <div className="level-left">
              <div className="level-item">Name:</div>
              <div className="level-item">
                <Link to={url}>{this.state.print.attributes.printer.attributes.name}</Link>
              </div>
            </div>
          </div>
          <div className="level">
            <div className="level-left">
              <div className="level-item">Model:</div>
              <div className="level-item">
                {this.state.print.attributes.printer.attributes.model}
              </div>
            </div>
          </div>
          <div className="level">
            <div className="level-left">
              <div className="level-item">Description:</div>
              <div className="level-item">
                {this.state.print.attributes.printer.attributes.description}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  renderGcode() {
    if (!(this.state.print.attributes.slices && this.state.print.attributes.slices.id)) return null;

    const url       = `/${this.props.match.params.username}/slices/${this.state.print.attributes.slices.id}`;
    return (
      <div className={`card`}>
        <div className="card-header">
          <div className="card-header-title level">
            <p className="level-left">Slice Details</p>          
          </div>
        </div>

        <div className="card-content">
          <div className={`card`}>
            <div className="card-header">
              <p className="card-header-title">
                GCode File
              </p>
            </div>

            <div className="card-content">
              <div className="level">
                <div className="level-left">
                  <div className="level-item">
                    <Link to={url}>{this.state.print.attributes.slices.attributes.name}</Link>
                  </div>
                </div>
                <div className="level-right">
                  {this.renderDownloadLink()}
                  {this.renderLogfileLink()}                
                </div>
              </div>
            </div>
          </div>
            {this.renderDescription()}
            {this.renderProjectSection()}
            {this.renderProfileSection()}
        </div>
      </div>
    )
  }

  renderDescription() {
    if (!this.state.print.attributes.slices) return null
    return (
      <div className={`card`}>
        <div className="card-header">
          <p className="card-header-title">
            Description
          </p>
        </div>

        <div className="card-content">
          {this.state.print.attributes.slices.attributes.description}
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
                  <div className="level-item"><Link to={`/${pf.attributes.repo_path}`}>{pf.attributes.repo_name}</Link></div>
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
    if (!this.state.print.attributes.slices) return null
    return (
      <div className={`card`}>
        <div className="card-header">
          <p className="card-header-title">
            Project File
          </p>
        </div>

        <div className="card-content">
          {this.renderRepos(this.state.print.attributes.slices.attributes.project_files)}
        </div>
      </div>
    )
  }

  renderProfileSection() {
    if (!this.state.print.attributes.slices) return null
    return (
      <div className={`card`}>
        <div className="card-header">
          <p className="card-header-title">
            Profile
          </p>
        </div>

        <div className="card-content">
          {this.renderRepos(this.state.print.attributes.slices.attributes.profile_files)}
        </div>
      </div>
    )
  }
  renderAssets() {
    if (this.state.print.attributes.assets.length > 0) {      
      return this.state.print.attributes.assets.map((item) => {
        return (<PrintAssetItem item={item} owner={this.state.print} key={item.attributes.name} match={this.props.match} />)
      });
    } else {
      return (<tr><td>No Files</td></tr>)
    }
  }

  renderAssetsContainer() {
    return (
          <Table isNarrow className="is-fullwidth" style={{marginTop: '10px'}}>
            <thead>
              <tr style={{background: '#eff7ff', border: '1px solid #c1ddff'}}>
                <th colSpan={5} style={{fontWeight: 'normal'}}>
                  Asset Name
                </th>
              </tr>
            </thead>
            <tbody style={{border: '1px solid #dadee1'}}>
              {this.renderAssets()}
            </tbody>
          </Table> 
    )
  }

  renderGallery() {
    if (this.state.print.attributes.assets.length == 0) return null;
    var assets = this.state.print.attributes.assets
    var images = assets.reduce((image_paths, item) => { 
      if (item.attributes.content_type.match(/^image|img/)) {  
        const url = `${this.props.location.pathname}/assets/${item.id}/download`
        const img = {
          original: url,
          thumbnail: url,  
        };
        return image_paths.concat(img)
      } else {
        return image_paths;
      }
      
    }, [])

    if (images.length == 0) return null;

    return (
      <div className="column"> 
      <Gallery images={images} />
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
          {this.renderPrinter()}
          <br/>
          {this.renderGcode()}
          <br/>
          {this.renderAssetsContainer()}
          <div>
            <div className="columns">
              {this.renderGallery()}
              <div className="column">                
              </div>
            </div>
          </div>
        </div>
      )
    }
  }

  renderEditButton() {
    if (this.state.print.attributes && this.state.print.attributes.user_permissions.canManage) {
      return (
        <Column className="has-text-right">
          <Link className="button" to={`${this.props.match.url}/edit`}>Edit</Link>
        </Column>
      )
    }
    return null
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
                    <Link to={`/${this.props.match.params.username}/prints`}>Prints</Link>                    
                  </BreadcrumbItem>
                  <BreadcrumbItem className="title is-4" > &nbsp;&nbsp; {this.state.print.attributes && this.state.print.attributes.job}</BreadcrumbItem>
                </ul>
              </Breadcrumb>
                <p style={{whiteSpace: 'pre'}}>
                  {this.state.print.attributes && this.state.print.attributes.description}
                </p>
            </Column>
            {this.renderEditButton()}
            
          </Columns>
          {this.renderContent()}
        </Container>
        <br/>
        
      </div>
    )
  }   
}

export default PrintDetails;

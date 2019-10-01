/*
 *  edit.js
 *  LayerKeep
 * 
 *  Created by Kevin Musselman (kmussel@gmail.com) on 09/23/19
 *  Copyright 2019 Frenzylabs
 */

import React              from 'react';
import { Link, Redirect } from 'react-router-dom';
import { PrintHandler }   from '../../handlers';
import Modal              from '../Modal';
import { PrintForm }      from './print_form';
import SpinnerModal       from '../Modal/spinner';
import { PrintAssetItem } from './asset_item'

import { 
  Container,
  Breadcrumb, 
  BreadcrumbItem,
  Table,
  Columns,
  Column,
  Button
} from 'bloomer';

import ActiveStorageProvider from 'react-activestorage-provider'

export class PrintEdit extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true, 
      print: {},
      error: 0
    };

    this.cancelRequest         = PrintHandler.cancelSource()

    this.deletePrintClick      = this.deletePrintClick.bind(this);
    this.dismissAction         = this.dismissAction.bind(this);
    this.loadPrintDetails      = this.loadPrintDetails.bind(this);
    this.deleteAsset           = this.deleteAsset.bind(this)
    this.printUpdated          = this.printUpdated.bind(this)
  }

  componentWillUnmount() {
    this.cancelRequest.cancel("Left Form")
  }

  componentDidMount() {
    this.loadPrintDetails();
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

  dismissAction() {
    this.setState({
      ...this.state,
      requestError: null
    });
  }


  uploadStorageConfig() {
    var printpath = `/${this.props.match.params.username}/prints`
    return {
      directUploadPath: `${printpath}/assets/presign`,
      endpoint: {
        path: `${printpath}/${this.props.match.params.printId}`,
        model: 'Print',
        attribute: 'files',              
        method: 'PUT'
      },
      multiple: true
    }
  }

  deleteItem() {
    this.setState({isDeleting: true})
    PrintHandler.delete(this.props.match.params.username, this.props.match.params.printId)
    .then((response) => {
      this.setState({isDeleting: false, redirect: `/${this.props.match.params.username}/prints`})
    })
    .catch((err) => {
      console.dir("Error", err);
      this.setState({
        requestError:      err,
        isDeleting: false
      })
    });
  }

  deletePrintClick(e) {
    if (window.confirm('Are you sure you wish to delete this item?'))
     this.deleteItem()
  }

  deleteAsset(assetId) {
    var urlparams = this.props.match.params;
    console.log(arguments)
    PrintHandler.deleteAsset(this.props.match.params.username, this.props.match.params.printId, assetId)
    .then((response) => {
      console.log(response)
      var assets = this.state.print.attributes.assets
      var index = assets.findIndex((el) => el.id == assetId)
      if (index >= 0) {
        assets.splice(index, 1);
      }
      this.state.print.attributes.assets = assets
      this.setState({print: this.state.print})

      // this.updateRepoFileList()
    })
    .catch((error) => {
      console.error(error);
    });
  }

  printUpdated(data) {
    if (data) {
      this.setState({print: data, redirect: `/${this.props.match.params.username}/prints/${data.id}`})
    }
  }

  renderDelete() {
    if (!this.state.print.attributes) return;
    return (
      <Column className="has-text-right">
        <Button className="is-danger" onClick={this.deletePrintClick}>Delete</Button>
      </Column>
    )
  }


  renderAssets() {
    if (!this.state.print.attributes) return;
    if (this.state.print.attributes.assets.length > 0) {      
      return this.state.print.attributes.assets.map((item) => {
        return (<PrintAssetItem item={item} prnt={this.props.print} key={item.attributes.name} match={this.props.match} deleteFile={this.deleteAsset} />)
      });
    } else {
      return (<tr><td>No Files</td></tr>)
    }
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
        <PrintForm {...this.props} print={this.state.print} onSuccess={this.printUpdated} deleteAsset={this.deleteAsset} uploadStorageConfig={this.uploadStorageConfig()} />
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
                    <Link to={`/${urlparams.username}/prints`}>Prints</Link>
                  </BreadcrumbItem>

                  <BreadcrumbItem className="title is-4" >
                    <Link to={`/${urlparams.username}/prints/${urlparams.printId}`}> {this.state.print.attributes && this.state.print.attributes.job}</Link>
                  </BreadcrumbItem>
                </ul>
              </Breadcrumb>
            </Column>
            {this.renderDelete()}            
          </Columns>
        
          { this.renderContent() }
          <Table className="is-narrow is-fullwidth" style={{margin: '20px 0'}}>
            <thead>
              <tr style={{background: '#eff7ff', border: '1px solid #c1ddff'}}>
                <th colSpan={5} style={{fontWeight: 'normal'}}>
                  Asset Names
                </th>
              </tr>
            </thead>

            <tbody style={{border: '1px solid #dadee1'}}>
              {this.renderAssets()}
            </tbody>
          </Table>
          <br/>

          
        </div>

        <Modal 
          component={Modal.spinner} 
          caption={"Deleting Print..."}
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


export default PrintEdit;

/*
 *  print_form.js
 *  LayerKeep
 * 
 *  Created by Kevin Musselman (kmussel@gmail.com) on 09/03/19
 *  Copyright 2019 Frenzylabs
 */

import React              from 'react';
import { Link, Redirect } from 'react-router-dom';
import InputField         from '../Form/InputField';
import Formsy             from 'formsy-react';
import TextField          from '../Form/TextField';
import { ProjectHandler, SliceHandler, PrintHandler, PrinterHandler } from '../../handlers';
import Modal              from '../Modal';
import { UploadForm }   from './upload_form';
import { RepoForm }      from '../Form/repo_form';
import { SearchDropdown } from '../Form/SearchDropdown'
import { PrintAssetItem } from './asset_item'

import { 
  Container,
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

const qs = require('qs');

export class PrintForm extends React.Component {
  constructor(props) {
    super(props);

    var qparams = qs.parse(this.props.location.search, { ignoreQueryPrefix: true })

    var selectedSlice = ""
    if (qparams["slice_id"])
      selectedSlice = qparams["slice_id"]

    var selectedPrinter = ""
      if (qparams["printer_id"])
        selectedPrinter = qparams["printer_id"]      

    this.state = { 
      printAttrs: { files:[]},
      selectedSlice: selectedSlice,
      selectedPrinter: selectedPrinter,
      canSubmit :  true,       
      slices: [], 
      slicesMeta: {},
      printers: [],
      profiles: [], 
      currentProfiles: [],
      currentProjects: [],
      requestError: null,
      search: {
        q: qparams["q"] || {}
      },
      sliceSearch: {
        page: 1, 
        per_page: 20, 
        q: {}
      }
    }
    
    this.onSliceSelected    = this.onSliceSelected.bind(this);
    
    this.disableButton      = this.disableButton.bind(this);
    this.enableButton       = this.enableButton.bind(this);
    this.submit             = this.submit.bind(this);
    this.dismissError       = this.dismissError.bind(this);
    this.fileDeleted        = this.fileDeleted.bind(this);
    this.fileUploaded       = this.fileUploaded.bind(this);
    this.selectSlice        = this.selectSlice.bind(this)
    this.selectPrinter      = this.selectPrinter.bind(this)
    this.descriptionChanged = this.descriptionChanged.bind(this)

    this.cancelRequest      = PrintHandler.cancelSource()
  }

  componentDidMount() {
    this.loadSlices()
    this.loadPrinters()

    if (this.props.print) {
      if (this.props.print.attributes.slices) {
        this.setState({selectedSlice: this.props.print.attributes.slices.id })
      }
      if (this.props.print.attributes.printer) {
        this.setState({selectedPrinter: this.props.print.attributes.printer.id })
      }
    }
  }

  componentWillUnmount() {
    this.cancelRequest.cancel("Left Page");
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.location.search != prevProps.location.search) {
      var qparams = qs.parse(this.props.location.search, { ignoreQueryPrefix: true })
      var search = {
        q: qparams["q"] || {}
      }
      var selectedSlice = this.state.selectedSlice
      if (qparams["slice_id"])
        selectedSlice = qparams["slice_id"]
      this.setState({search: search, selectedSlice: selectedSlice})
    }
    if (prevState.sliceSearch != this.state.sliceSearch) {
      this.loadSlices()
    }
  }

  createSelectedRepoOptions(repos) {
    if (!repos) return;
    return repos.map((item) => {
      return {id: item.id, repoId: item.attributes.repo_id, repoPath: item.attributes.repo_path, revision: item.attributes.commit, filepath: item.attributes.filepath}
    }) || []
  }

  loadSlices() {    
    this.setState({slicesLoading: true})
    SliceHandler.list(this.props.match.params.username, {qs: this.state.sliceSearch, cancelToken: this.cancelRequest.token})
    // SliceHandler.list(this.props.match.params.username, {cancelToken: this.cancelRequest.token})
    .then((response) => {
      var slices = response.data.data.map((item) => {
        return {name: item.attributes.name, value: item.attributes.id, id: item.id, description: item.attributes.description}
      })
      
      this.setState({ slicesLoading: false, slices: slices, slicesMeta: response.data.meta || {}})
    })
    .catch((error) => {
      console.log(error);
      this.setState({slicesLoading: false})
    });
  }

  loadPrinters() {    
    PrinterHandler.list(this.props.match.params.username, {cancelToken: this.cancelRequest.token})
    .then((response) => {
      var printers = response.data.data.map((item) => {
        return {name: item.attributes.name, value: item.attributes.id, id: item.id}
      })
      
      this.setState({ printers: printers})
    })
    .catch((error) => {
      console.log(error);
    });
  }


  disableButton() {
    this.setState({...this.state, canSubmit: false});
  }

  enableButton() {
    this.setState({...this.state, canSubmit: true});
  }


  submit(model) {
    this.setState({ makingRequest: true });
    var handler;
    if (this.props.match.params.printId) {
      handler = PrintHandler.update(this.props.match.params.username, this.props.match.params.printId, this.state.printAttrs, {cancelToken: this.cancelRequest.token})
    } else {
      handler = PrintHandler.create(this.props.match.params.username, this.state.printAttrs, {cancelToken: this.cancelRequest.token})
    }
    handler
    .then((response) => {
      this.setState({
        makingRequest: false,
        redirect:     true,
        printId:  response.data.id
      });
      if (this.props.onSuccess) {
        this.props.onSuccess(response.data.data)
      }
    })
    .catch((error) => {
      this.setState({
        makingRequest: false,
        requestError: error
      });
    });

  }

  dismissError() {
    this.setState({
      ...this.state,
      creatingPrint: false,
      requestError: null
    });
  }
  
  // filesChanged(files) {
  //   this.setState({
  //     ...this.state,
  //     files: Array.from(files).concat((this.state.files || []))
  //   });
  // }

  fileUploaded(name, signedIds) {
    if (signedIds) {
      let printAttrs = this.state.printAttrs
      var files = printAttrs[name].concat(signedIds || [])
      this.setState({printAttrs: {...printAttrs, files: files}})
    }
  }

  fileDeleted(name, ufile) {
    if (ufile && ufile.signed_id) {
      let printAttrs = this.state.printAttrs
      var files = printAttrs[name]
      var index = files.indexOf(ufile.signed_id)
      if (index >= 0) {
        files.splice(index, 1);
      }
      this.setState({printAttrs: {...printAttrs, files: files}})
    }
  }

  onSliceFilter(item) {
    this.setState({sliceSearch: {...this.state.sliceSearch, q: {name: item}}})
  }

  selectSlice(item, id) {
    this.setState({selectedSlice: item.id, printAttrs: {...this.state.printAttrs, "slice_id": item.id}})
  }

  selectPrinter(item, id) {
    this.setState({selectedPrinter: item.id, printAttrs: {...this.state.printAttrs, "printer_id": item.id}})
  }

  onSliceSelected(kind, repos) {
    var selectedRepos = Object.keys(repos).reduce((acc, key) => {
      var item = repos[key];
      if (item.selectedFile && item.selectedFile.name) {
        acc.push({id: item.id, repo_id: item.selectedRepo.id, revision: item.selectedRevision.value, filepath: item.selectedFile.value})
      }
      return acc;
    }, [])

    let printAttrs = this.state.printAttrs
    if (kind == "Profile") {
      printAttrs['profiles'] = selectedRepos
    } else {
      printAttrs['slice'] = selectedRepos
    }
    this.setState({printAttrs: printAttrs})
  }

  descriptionChanged(e) {
    this.setState({printAttrs: {...this.state.printAttrs, "description": e.currentTarget.value}})      
  }

  renderCurrentGcode() {
    if (this.props.print && this.props.print.attributes) {
      return (
        <div className="level"><div className="level-left level-item">{this.props.print.attributes.name}</div></div>
      )
    }
  }

  renderAssetsContainer() {
    return (
      <div className={`card package`}>
        <div className="card-header">
          <p className="card-header-title">
            Upload Asset Files
          </p>
        </div>

        <div className="card-content">
          <Container className="is-fluid">
            <UploadForm name="files" {...this.props.uploadStorageConfig} onFileUpload={this.fileUploaded} onFileDeleted={this.fileDeleted} location={this.props.location}></UploadForm>
          </Container>
          
        </div>
      </div>
    )
  }

  renderSliceOptionItem(item) {
    return (
      <div className="level">
        <div className="level-left">{item.name}</div>
        {item.description && item.description.length > 0 && 
          (<div className="level-right">
            <Icon icon="angle-down" className="fas fa-info-circle" isSize="small" data-tooltip={`${item.description}`} />
          </div>)}
      </div>
    )
  }

  renderSliceSection() {

    var selectedSlice =  this.state.slices.find((x) => x["id"] == this.state.selectedSlice)
    return (
      <div className={`card package`}>
        <div className="card-header">
          <p className="card-header-title">
            Attach Your Slice
          </p>
        </div>

        <div className="card-content">
          <Container className="is-fluid">      
            <div className="level" >  
                <div className="level-left">
                  <div className="level-item">GCode Name: </div>
                  <div className="level-item" >
                    <SearchDropdown id={"slices"} 
                      promptText={`Select Slice`} 
                      placeholder={`Slice Name`}
                      loading={this.state.slicesLoading} 
                      options={this.state.slices} 
                      meta={this.state.slicesMeta} 
                      selected={selectedSlice} 
                      onSelected={this.selectSlice} 
                      onFilter={this.onSliceFilter.bind(this)} 
                      renderOptionItem={this.renderSliceOptionItem.bind(this)}
                       />
                  </div>
                  <div className="level-item"> <Link style={{fontSize: "14px"}} to={`/${this.props.match.params.username}/slices/new`}> &nbsp; [add a new one]</Link> </div>
                </div>
            </div>
          </Container>
        </div>
      </div>
    )
  }

  renderPrinterSection() {

    var selectedPrinter =  this.state.printers.find((x) => x["id"] == this.state.selectedPrinter)
    return (
      <div className={`card package`}>
        <div className="card-header">
          <p className="card-header-title">
            Select Your Printer
          </p>
        </div>

        <div className="card-content">
          <Container className="is-fluid">      
            <div className="level" >  
                <div className="level-left">
                  <div className="level-item">Printer Name: </div>
                  <div className="level-item" >
                    <SearchDropdown id={"printers"} options={this.state.printers} selected={selectedPrinter} onSelected={this.selectPrinter} promptText={`Select Printer`} placeholder={`Printer Name`} />
                  </div>
                  <div className="level-item"> <Link style={{fontSize: "14px"}} to={{pathname: `/${this.props.match.params.username}/printers/new`, state: {redirect: this.props.match.url}}}> &nbsp; [add a new one]</Link> </div>
                </div>
            </div>
          </Container>
        </div>
      </div>
    )
  }

  renderModal() {
    if (this.state.makingRequest) {
      var caption = "Creating Print..."
      if (this.props.print && this.props.print.id) {
        caption = "Updating Print"
      }
      return (
        <Modal 
          component={Modal.spinner} 
          caption={caption}
          isActive={true}
        /> 
      )
    } else if(this.state.requestError) {
      return (
        <Modal
          component={Modal.error}
          requestError={this.state.requestError}
          isActive={true}
          dismissAction={this.dismissError}
        />
      )
    }
  }

  renderDescription() {
    // if (!(this.props.print && this.props.print.attributes)) return null;
    return (<TextField 
      label="Description"
      name="description"
      onChange={this.descriptionChanged}
      placeholder="Describe Your Print"
      value={this.props.print ? this.props.print.attributes.description : ""}
    />)
  }
  render() {    
    var backparams = [this.props.match.params.username, "prints"]
    if (this.props.print && this.props.print.id) {
      backparams.concat(this.props.print.id)
    }
    const backurl = backparams.join("/")
    return (
      <div>
        <Formsy onValidSubmit={this.submit} onValid={this.enableButton} onInvalid={this.disableButton}>
          
          {this.renderPrinterSection()}
          <br/>          
          {this.renderSliceSection()}
          <br/>
          {this.renderDescription()}
          <br/>
          {this.renderAssetsContainer()}
          
          <br/>
          <Field isGrouped>
            <Control>
              <Button type="submit" disabled={this.state.canSubmit == false}>Save</Button>
              <Link className="button" style={{marginLeft: '10px'}} to={`/${backurl}`}> Cancel </Link>              
            </Control>
          </Field>
        </Formsy>

        {this.renderModal()}
        

        
      </div>
    )
  }
}

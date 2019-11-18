/*
 *  details.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 04/30/19
 *  Copyright 2018 WessCope
 */

import React                from 'react';
import { connect }          from 'react-redux';

import { 
  Table,
  Columns, 
  Column,
  Content,
  Icon
} from 'bloomer';

import { RepoDetailItem }   from './detail_item';
import { RepoHandler }      from '../../handlers';
import { RevisionPathTrail }  from './revision_path_trail'
import { FileViewer }       from '../FileViewer';

import Gallery   from '../Utils/gallery';
import Modal              from '../Modal';

import {
  Error404,
  Error401
} from '../ErrorViews';
import RepoClone from './repo_clone';


class Details extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      repo_files:       [], 
      image_paths:      [],
      meta:             {}, 
      branches:         this.props.item.branches || {}, 
      currentRevision:  "", 
      message:          '', 
      lastUpdate:       '',
      hasError:         0,
      requestError:     null
    };

    this.updateRepoFiles    = this.updateRepoFiles.bind(this);
    this.renderReadme       = this.renderReadme.bind(this);
    this.deleteFile         = this.deleteFile.bind(this);
    this.updateRepoFileList = this.updateRepoFileList.bind(this);
    this.retreiveImagePaths = this.retreiveImagePaths.bind(this);

    this.cancelRequest = RepoHandler.cancelSource();
    
    this.updateRepoFileList();
  }

  componentWillUnmount() {
    this.cancelRequest.cancel("Left Page");
  }

  updateRepoFileList() {
    var url   = this.props.match.url

    if (this.props.match.params.resource != "tree") {
      url = url + "/tree/master"
    }

    RepoHandler.tree(url, {cancelToken: this.cancelRequest.token})
    .then((response) => {
      this.updateRepoFiles(response.data);
      this.retreiveImagePaths();
    })
    .catch((error) => {
      this.setState({
        ...this.state,
        hasError: error.response.status
      })
    });
  }

  deleteFile(path) {
    var urlparams = this.props.match.params;
    RepoHandler.deleteFile(urlparams, path)
    .then((response) => {
      this.updateRepoFileList()
    })
    .catch((error) => {
      this.setState({
        requestError:  error,
      })
    });
  }


  dismissAction() {
    this.setState({
      ...this.state,
      requestError: null
    });
  }

  retreiveImagePaths() {
    if(this.state.currentRevision == "") { return; }

    const params = this.props.match.params;
    const url = '/' + [
      params.username,
      params.kind,
      params.name,
      "tree",
      this.state.currentRevision,
      "images",
    ].join('/');

    RepoHandler.tree(url, {cancelToken: this.cancelRequest.token})
    .then((response) => {
      const images = response.data.data.map((item) => {
        if (item.type == "tree") return null
        const imagePath = (url.replace('tree', 'content') + '/' + item.name);

        return {
          original: imagePath,
          thumbnail: imagePath,  
        };
      }).filter((el) => { return el != null; });

      this.setState({
        ...this.state,
        image_paths: images
      })
    })
    .catch((error) => {
      console.error(error);
    });    
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.url != prevProps.match.url) {
      this.updateRepoFileList();
    } else if (this.props.item.branches != prevProps.item.branches ) {
      this.setState({ 
        ...this.state,
        branches: this.props.item.branches 
      });
    }
  }

  updateRepoFiles(data) {
    this.setState({ 
      ...this.state,
      lastUpdate: data.meta.last_committed_at,
      message: data.meta.last_commit_message || "",
      repo_files: data.data,
      meta: data.meta,
      currentRevision: data.meta.revision
    });
  }

  items() {
    if (this.state.repo_files.length > 0) {      
      return this.state.repo_files.map((item) => {
        return (<RepoDetailItem kind={this.props.kind} item={item} meta={this.state.meta} repo={this.props.item} key={item.name} match={this.props.match} deleteFile={this.deleteFile} />)
      });
    } else {
      return (<tr><td>No Files</td></tr>)
    }
  }

  renderReadme() {
    const urlparams = this.props.match.params;    
    const readme    = this.state.repo_files.filter((item) => { return item.name.toLowerCase().match(/readme\.(md|txt)$/); })[0];
    
    if(readme == null) {
      if (currentUser.username == urlparams.username) {
        return (
          <article className="message is-info" style={{border: '1px solid #d1d5da'}}>
            <div className="level" style={{padding: '15px'}}>
              <div className="level-left" style={{marginRight: "10px"}}>
                <p className="control">
                  <a className="button is-small" onClick={this.props.uploadAction}>
                    <span className="icon is-small">
                      <i className="fas fa-upload"></i>
                    </span>
                    <span>Upload README.md File</span>
                  </a>
                </p>
              </div>
              <div className="level-right" style={{flex: 1}}>
                <p>Add a README with any instructions or information to help others this project. </p>
              </div>
            </div>
          </article>
        );
      }
      return null
    }

    const url = `/${urlparams.username}/projects/${urlparams.name}/content/${urlparams.revisionPath || 'master'}/${readme.name}`;

    return (
      <article className="message is-small" style={{border: '1px solid #d1d5da'}}>
        <div className="message-header" style={{background: '#f6f8fa', borderBottom: '1px solid #d1d5da', color: '#24292e'}}>
          <p>
            <Icon className="fal fa-poll-h"/>
            {readme.name}
          </p>
        </div>

        <div className="message-body" style={{background: '#fff'}}>
          <Content>
            <FileViewer url={url} extension="md"/>
          </Content>
        </div>
      </article>
    );
  }

  renderLeftNav(onClick, disabled) {
    return (
      <button
        className='image-gallery-left-nav'
        disabled={disabled}
        onClick={onClick}/>
    )
  }

  renderGallery() {
    if(this.props.match.params.kind.toLowerCase() !== 'projects' || this.state.image_paths.length == 0) { return null; }

    return(
      <div className="column">
        <Gallery images={this.state.image_paths} />        
      </div>
    )
  }

  renderUploadButton() {
    if (this.props.item.user_permissions && 
        this.props.item.user_permissions.canManage == true &&
        this.state.meta.head == true) {
      return (
        <p className="control">
        <a className="button is-small" onClick={this.props.uploadAction}>
          <span className="icon is-small">
            <i className="fas fa-upload"></i>
          </span>
          <span>Upload</span>
        </a>
      </p>
      )
    }
    return null
  }

  render() {
    if(this.state.hasError > 0) {

      switch(this.state.hasError) {
        case 404:
          return (
            <Error404/>
          );

        case 401:
          return (
            <Error401/>
          )
      }
    }

    const urlparams = this.props.match.params;
    const url       = `/${urlparams.username}/${urlparams.kind}/${urlparams.name}/content/${urlparams.revisionPath || 'master'}?download=true`;

    return (
      <div className="flex-wrapper">
        <hr/>
        <br/>

        <div>
          <Columns className="is-narrow is-gapless is-mobile">
            <Column>
              <RevisionPathTrail match={this.props.match} branches={this.state.branches} meta={this.state.meta}></RevisionPathTrail>        
            </Column>

            <Column >
              <div className="buttons has-addons is-right">
                {this.renderUploadButton()}
                
                <p className="control">
                  <a className="button is-small" href={url} target="_blank">
                    <span className="icon is-small">
                      <i className="fas fa-download"></i>
                    </span>
                    <span>Download</span>
                  </a>
                </p>
                <div className="control">
                  <RepoClone cloneURL={
                    [
                      'https://layerkeep.com',
                      this.props.match.params.username,
                      this.props.match.params.kind,
                      this.props.match.params.name + '.git'
                    ].join('/')
                  } />
                </div>
              </div>
            </Column>
          </Columns>
        </div>

        <Table isNarrow className="is-fullwidth" style={{marginTop: '10px'}}>
          <thead>
            <tr style={{background: '#eff7ff', border: '1px solid #c1ddff'}}>
              <th colSpan={3} style={{fontWeight: 'normal'}}>
                {this.state.message}
              </th>

              <th className="has-text-right" colSpan={2} style={{fontWeight: 'normal'}}>
                Last updated: {dayjs(this.state.lastUpdate).format('MM.DD.YYYY')}
              </th>
            </tr>
          </thead>

          <tbody style={{border: '1px solid #dadee1'}}>
            {this.items()}
          </tbody>
        </Table>

        <div>
          <div className="columns">
            {this.renderGallery()}

            <div className="column">
              {this.renderReadme()}
            </div>
          </div>
        </div>

        <Modal
          component={Modal.error}
          requestError={this.state.requestError}
          isActive={this.state.requestError != null}
          dismissAction={this.dismissAction.bind(this)}
        />
      </div>
    )
  }
}


const mapStateToProps = (state) => {
  return state
}

export const RepoDetails = connect(mapStateToProps)(Details);

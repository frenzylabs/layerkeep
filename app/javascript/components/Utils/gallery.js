/*
 *  gallery.js
 *  LayerKeep
 * 
 *  Created by Kevin Musselman (kmussel@gmail.com) on 09/30/19
 *  Copyright 2019 Layerkeep
 */

import React from 'react';

import ImageGallery       from 'react-image-gallery';
import { Lightbox } from "react-modal-image";

export default class Gallery extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isFullscreen: false
    };
  }
  

  closeLightbox(event) {
    this.setState({isFullscreen: false})
  }

  toggleFullScreen(event) {
    this.setState({isFullscreen: !this.state.isFullscreen})
  }

  renderFullscreenButton(onClick, isFullscreen) {
    return (
      <button
        type='button'
        className={
          `image-gallery-fullscreen-button${isFullscreen ? ' active' : ''}`}
        onClick={this.toggleFullScreen.bind(this)}
      />
    );
  }

  renderFullScreen() {
    if (this.state.isFullscreen) {
      var urlImage = this.gallery.props.items[this.gallery.state.currentIndex].original
      return (<Lightbox
        medium={urlImage}
        large={urlImage}
        alt=""
        onClose={this.closeLightbox.bind(this)}
      />)
      }
  }

  
  render() {
    const caption = this.props.caption || "Thank you for waiting...";
    return(
      <div>
        <ImageGallery
          ref={gal => this.gallery = gal}
          items={this.props.images}
          showPlayButton={false}
          showFullscreenButton={true}
          useBrowserFullscreen={false}
          showBullets={false}
          infinite={true}
          lazyLoad={false}
          showThumbnails={this.props.images.length > 1}
          renderFullscreenButton={this.renderFullscreenButton.bind(this)}
          // renderLeftNav={this.renderLeftNav}
        />
        {this.renderFullScreen()}
      </div>
    )
    // return (
    //   <div>
    //     <div className="box" style={{boxShadow: 'none', border: 'none'}}>
    //       <div className="columns is-centered">
    //         <div className="column is-three-fifths">
    //           <div className="sk-three-bounce">
    //             <div className="sk-child sk-bounce1" style={{background: '#c0c0c0'}}></div>
    //             <div className="sk-child sk-bounce2" style={{background: '#c0c0c0'}}></div>
    //             <div className="sk-child sk-bounce3" style={{background: '#c0c0c0'}}></div>
    //           </div>
    //           <p className="has-text-centered" style={{fontSize: '22px', color: "#c0c0c0"}}>
    //             {caption}
    //           </p>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // );
  }
}

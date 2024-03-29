// Copyright (c) 2017 PlanGrid, Inc.

import React from 'react';
import VisibilitySensor from 'react-visibility-sensor/visibility-sensor';

import pdfjs from "@bundled-es-modules/pdfjs-dist/build/pdf";
 
pdfjs.GlobalWorkerOptions.workerSrc = '//cdn.jsdelivr.net/npm/pdfjs-dist@2.1.266/build/pdf.worker.min.js';

// import pdfjs from 'pdfjs-dist/webpack';
// import * as PDFJS from 'pdfjs-dist/webpack';
// import * as PDFJS from "pdfjs-dist";
// import * as PDFJS from 'pdfjs-dist/webpack';
// import { PDFViewer as pdfViewer } from 'pdfjs-dist/web/pdf_viewer';
// import { PDFJS } from 'pdfjs-dist/build/pdf';
// import 'pdfjs-dist/web/pdf_viewer.js';

// pdfjs.disableWorker = true;
const INCREASE_PERCENTAGE = 0.2;
const DEFAULT_SCALE = 1.1;

export class PDFPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    if (this.props.disableVisibilityCheck) this.fetchAndRenderPage();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.disableVisibilityCheck) {
      if (prevProps.zoom !== this.props.zoom) this.fetchAndRenderPage();
      return;
    }

    // we want to render/re-render in two scenarias
    // user scrolls to the pdf
    // user zooms in
    if (prevState.isVisible === this.state.isVisible && prevProps.zoom === this.props.zoom) return;
    if (this.state.isVisible) this.fetchAndRenderPage();
  }

  onChange(isVisible) {
    if (isVisible) this.setState({ isVisible });
  }

  fetchAndRenderPage() {
    const { pdf, index } = this.props;
    pdf.getPage(index).then(this.renderPage.bind(this));
  }

  renderPage(page) {
    const { containerWidth, zoom } = this.props;
    const calculatedScale = (containerWidth / page.getViewport(DEFAULT_SCALE).width);
    const scale = calculatedScale > DEFAULT_SCALE ? DEFAULT_SCALE : calculatedScale;
    const viewport = page.getViewport(scale + zoom);
    const { width, height } = viewport;

    const context = this.canvas.getContext('2d');
    this.canvas.width = width;
    this.canvas.height = height;

    page.render({
      canvasContext: context,
      viewport,
    });
  }

  render() {
    return (
      <div className="pdf-canvas">
        {this.props.disableVisibilityCheck ? <canvas ref={node => this.canvas = node} width="670" height="870" /> : (
          <VisibilitySensor onChange={this.onChange} partialVisibility >
            <canvas ref={node => this.canvas = node} width="670" height="870" />
          </VisibilitySensor>
            )
        }
      </div>
    );
  }
}

export default class PDFDriver extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pdf: null,
      zoom: 0,
      percent: 0,
    };

    this.increaseZoom = this.increaseZoom.bind(this);
    this.reduceZoom = this.reduceZoom.bind(this);
    this.resetZoom = this.resetZoom.bind(this);
  }

  componentDidMount() {
    const { filePath } = this.props;
    const containerWidth = this.container.offsetWidth;
    pdfjs.getDocument(filePath, null, null, this.progressCallback.bind(this)).then((pdf) => {
      this.setState({ pdf, containerWidth });
    });
  }

  setZoom(zoom) {
    this.setState({
      zoom,
    });
  }

  progressCallback(progress) {
    const percent = ((progress.loaded / progress.total) * 100).toFixed();
    this.setState({ percent });
  }

  reduceZoom() {
    if (this.state.zoom === 0) return;
    this.setZoom(this.state.zoom - 1);
  }

  increaseZoom() {
    this.setZoom(this.state.zoom + 1);
  }

  resetZoom() {
    this.setZoom(0);
  }

  renderPages() {
    const { pdf, containerWidth, zoom } = this.state;
    if (!pdf) return null;
    const pages = Array.apply(null, { length: pdf.numPages });
    return pages.map((v, i) => (
      (<PDFPage
        key={i + 1}
        index={i + 1}
        pdf={pdf}
        containerWidth={containerWidth}
        zoom={zoom * INCREASE_PERCENTAGE}
        disableVisibilityCheck={this.props.disableVisibilityCheck}
      />)
    ));
  }

  renderLoading() {
    if (this.state.pdf) return null;
    return (<div className="pdf-loading">LOADING ({this.state.percent}%)</div>);
  }

  render() {
    return (
      <div className="pdf-viewer-container">
        <div className="pdf-viewer" ref={node => this.container = node} >
          <div className="pdf-controlls-container">
            <div className="view-control" onClick={this.increaseZoom} >
              <i className="fas fa-plus-circle" />
            </div>            
            <div className="view-control" onClick={this.reduceZoom}>
              <i className="fas fa-minus-circle" />
            </div>
            <div className="view-control" onClick={this.resetZoom}>
              <i className="fas fa-redo" />
            </div>
          </div>
          {this.renderLoading()}
          {this.renderPages()}
        </div>
      </div>
    );
  }
}

PDFDriver.defaultProps = {
  disableVisibilityCheck: false,
};

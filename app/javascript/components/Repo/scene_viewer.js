// /*
//  *  list.js
//  *  LayerKeep
//  * 
//  *  Created by Wess Cope (me@wess.io) on 04/30/19
//  *  Copyright 2018 WessCope
//  */

// import React               from 'react';
// import { connect }        from 'react-redux';
// import { RepoListItem }   from './list_item';
// import { RepoEmptyList }  from './empty_list';
// // import { FileLoader }     from 'three';

// import * as THREE from 'three';
// import { RepoHandler } from '../../handlers/repo_handler';


// export default containerElement => {
//   const canvas = createCanvas(document, containerElement);
//   const sceneManager = new SceneManager(canvas);

//   bindEventListeners();
//   render();
//   function createCanvas(document, containerElement) {
//     const canvas = document.createElement('canvas');
//     containerElement.appendChild(canvas);
//     return canvas;
//   }
//   function bindEventListeners() {
//     window.onresize = resizeCanvas;
//     resizeCanvas();
//   }
//   function resizeCanvas() {
//     canvas.style.width = '100%';
//     canvas.style.height= '100%';
//     canvas.width = canvas.offsetWidth;
//     canvas.height = canvas.offsetHeight;
//     sceneManager.onWindowResize();
//   }
//   function render(time) {
//     requestAnimationFrame(render);
//     sceneManager.update();
//   }
// }

// export class SceneManager extends React.Component {
//   constructor(props) {
//     super(props);

//     // this.items = this.items.bind(this);
//     this.state = {contentType: null, localUrl: null}
//     // this.loadFile();
//     window.sm = this;
//   }

  

//   componentDidUpdate(prevProps) {
//     console.log("2 PROPS DID CHANGE");
//     console.log(prevProps);
//     console.log(this.props);
//   }
  
//   // shouldComponentUpdate(nextProps, nextState) {
//   //     console.log("2 Should comp update");
//   //     const differentList = this.props.list !== nextProps.list;
//   //     return differentList;
//   // }

//   empty() {
//     return (
//       <RepoEmptyList kind={this.props.kind} />
//     );
//   }

//   renderImage() {
//     if (this.state.contentType && this.state.contentType.match(/image/)) {
//       return (<img src={this.state.localUrl} />)
//     }
//   }
//   // items() {
//   //   console.log(this.props.list.data.length);
//   //     return this.props.list.data.map((item) => {
//   //       return (<RepoListItem kind={this.props.kind} item={item} key={item.id} />)
//   //     });
//   // }
  
//   render() {

//     return (
//       <div>
//         {this.renderImage()}
//       </div>
//     );
//   }
// }

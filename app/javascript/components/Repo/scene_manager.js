/*
 *  list.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 04/30/19
 *  Copyright 2018 WessCope
 */

import React               from 'react';
import { connect }        from 'react-redux';
import { RepoListItem }   from './list_item';
import { RepoEmptyList }  from './empty_list';
// import { FileLoader }     from 'three';


global.THREE = require('three');

require('three/examples/js/loaders/STLLoader');
require('three/examples/js/controls/OrbitControls.js')


import { RepoHandler } from '../../handlers/repo_handler';
import { BufferGeometry } from 'three';


function fitCameraToObject  ( camera, object, offset, controls ) {

  offset = offset || 1.25;

  var camera = camera;
  const boundingBox = new THREE.Box3();

  // get bounding box of object - this will be used to setup controls and camera
  boundingBox.setFromObject( object );

  var center = new THREE.Vector3();
  boundingBox.getCenter(center);
  var size = new THREE.Vector3();
  boundingBox.getSize(size);

    // get the max side of the bounding box (fits to width OR height as needed )
  const maxDim = Math.max( size.x, size.y, size.z );
  const fov = camera.fov * ( Math.PI / 180 );
  var cameraZ = Math.abs( maxDim / 2 * Math.tan( fov * 2 ) ); //Applied fifonik correction
  cameraZ *= offset; // zoom out a little so that objects don't fill the screen

  console.log("FITCAMERA 2.5");
  //Method 1 to get object's world position
  scene.updateMatrixWorld(); //Update world positions
  var objectWorldPosition = new THREE.Vector3();
  objectWorldPosition.setFromMatrixPosition( object.matrixWorld );
  
  //Method 2 to get object's world position
  // objectWorldPosition = object.getWorldPosition();

  const directionVector = camera.position.sub(objectWorldPosition); 	//Get vector from camera to object

  const unitDirectionVector = directionVector.normalize(); // Convert to unit vector
  
  var newpos = unitDirectionVector.multiplyScalar(cameraZ);  
  camera.position.copy(newpos);

  // camera.position = unitDirectionVector.multiplyScalar(cameraZ); //Multiply unit vector times cameraZ distance

  camera.lookAt(objectWorldPosition); //Look at object
  // --->


  const minZ = boundingBox.min.z;
  const cameraToFarEdge = ( minZ < 0 ) ? -minZ + cameraZ : cameraZ - minZ;

  camera.far = cameraToFarEdge * 3;
  camera.updateProjectionMatrix();


  if ( controls ) {

    // set camera to rotate around center of loaded object
    controls.target = center;
    // // prevent camera from zooming out far enough to create far plane cutoff
    controls.maxDistance = cameraToFarEdge * 2;
  } else {
      camera.lookAt( center )
  }
}


function setupScene(container, geometry) {
  console.log("SETUP SCENE");
  window.container = container;

  var scene   = new THREE.Scene(), 
        camera  = new THREE.PerspectiveCamera(35, container.width() / container.height(), 1, 1000);

    

    camera.position.set(200, 100, 200);

    var hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);

    hemiLight.position.set(0, 200, 0);

    scene.add(hemiLight);

    var directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set( 0, 200, 100 );

    directionalLight.castShadow           = true;
    directionalLight.shadow.camera.top    = 180;
    directionalLight.shadow.camera.bottom = -100;
    directionalLight.shadow.camera.left   = -120;
    directionalLight.shadow.camera.right  = 120;

    scene.add(directionalLight);

    var ground = new THREE.Mesh( 
      new THREE.PlaneBufferGeometry(4000, 4000), 
      new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: true }) 
    );

    ground.rotation.x     = - Math.PI / 2;
    ground.position.y = 0; //- 0.5;
    ground.receiveShadow  = true;

    scene.add(ground);

    var grid                  = new THREE.GridHelper( 4000, 20, 0x000000, 0x000000 );
    grid.material.opacity     = 0.2;
    grid.material.transparent = true;

    scene.add( grid );

    var renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
    renderer.setPixelRatio(container.devicePixelRatio);
    renderer.setSize(container.width(), container.height());
    renderer.shadowMap.enabled = true;

    container.append(renderer.domElement);

    var controls = new THREE.OrbitControls(camera, renderer.domElement);
    // controls.target.set(0, 25, 0);
    // controls.update();

    window.scene = scene;
    window.camera = camera;
    window.ground = ground;
    window.renderer = renderer;
    window.controls = controls;
    window.grid     = grid;
    

    
    var material  = new THREE.MeshPhongMaterial({color: 0x00ff00}),
    animate   = function() {
      requestAnimationFrame(animate);
      
      renderer.render(scene, camera);
    };

    console.log("SETUP SCENE 7");

    // var scope = new THREE.STLLoader()
    // // canvas.append(renderer.domElement);
    // geometry = scope.parse( response );
    var mesh        = new THREE.Mesh(geometry, material);
    window.mesh = mesh; 
    const boundingBox = new THREE.Box3();

    // get bounding box of object - this will be used to setup controls and camera
    boundingBox.setFromObject( mesh );

    
    mesh.castShadow = true;
    mesh.position.y =  - boundingBox.min.y;

    scene.add(mesh);

    fitCameraToObject  ( camera, mesh, 4, controls )
    

    window.addEventListener('resize', function() {
      // console.log("height: ", container.height());
      // console.log("width: ", container.width(), container.innerWidth());
      renderer.setSize(0, 0);
      renderer.setSize(container.width(), container.height());
      
      camera.aspect = container.width() / container.height();
      camera.updateProjectionMatrix();
      // fitCameraToObject(camera, mesh, 4, controls);
      

      
    }, false);

    animate();
}


export class SceneManager extends React.Component {
  constructor(props) {
    super(props);

    // this.items = this.items.bind(this);
    this.material  = new THREE.MeshPhongMaterial({color: 0x00ff00});
    this.state = {contentType: null, localUrl: null, geometry: null, material: this.material}
    // this.loadFile();
    window.t = THREE;
    // window.tada = STLLoader;
    var self = this;
    this.scene = React.createRef();
    console.log("INSIDE SM CONSTRUCTOR");
    console.log(this.props);
    // if (this.props.file.extension == "stl") {
      this.loader = new THREE.STLLoader()
    //   this.loader.load(this.props.file.localUrl, function(resp) {        
    //     self.geometry = resp;
    //     console.log(self.scene);
    //     setupScene($(this.scene.current), this.state.geometry);
    //     self.setState( {geometry: resp} )
    //   })
    // }
    
    window.sm = this;
  }

  componentDidMount() {
    // setupScene($(this.scene.current), this.state.geometry);
    window.addEventListener('load', this.handleLoad);
    console.log(this.loader);
    var self = this;
    
    this.loader.load(this.props.file.localUrl, function(resp) {        
      self.geometry = resp;
      console.log(self.scene);
      setupScene($(self.scene.current), self.geometry);
      self.setState( {geometry: resp} )
    })
 }

 handleLoad() {
   console.log("HANDLE LOAD")
 }
 
  componentDidUpdate(prevProps) {
    console.log(" d PROPS DID CHANGE");
    
    console.log(prevProps);
    console.log(this.props.file);

    
  }
  
  // shouldComponentUpdate(nextProps, nextState) {
  //     console.log("2 Should comp update");
  //     const differentList = this.props.list !== nextProps.list;
  //     return differentList;
  // }

  empty() {
    return (
      <RepoEmptyList kind={this.props.kind} />
    );
  }

  renderImage() {
    if (this.state.contentType && this.state.contentType.match(/image/)) {
      return (<img src={this.state.localUrl} />)
    }
  }

  renderStl() {
    // return (<div></div>)
    
    // const geometry = (() => new this.loader.load(this.props.file.localUrl), [this.props.file.localUrl])
    if (this.state.geometry) {
      // const mesh = new THREE.Mesh(this.state.geometry, this.state.material)
      
      // return <primitive object={mesh} position={[0, 0, 0]} />
      // return (
      //   <mesh material={this.material}>
      //     <planeBufferGeometry attach="geometry" args={[1000, 1000]} />
      //     <meshPhongMaterial attach="material" color="#272727" />
      //     <primitive object={this.state.geometry} position={[0, 0, 0]} />
      //   </mesh>
      // )

      // <bufferGeometry object={this.state.geometry} /> 
      // return (<primitive object={this.state.geometry} />)
    // return (
    //   <mesh geometry={this.state.geometry} material={this.material}></mesh>        
    // )
    }
  }
  // items() {
  //   console.log(this.props.list.data.length);
  //     return this.props.list.data.map((item) => {
  //       return (<RepoListItem kind={this.props.kind} item={item} key={item.id} />)
  //     });
  // }
  
  render() {
    return (<div ref={this.scene} style={{height: '100%', padding: '10px'}} />) 
  }
    // return (<Canvas style={{ background: '#272727' }}>
    //   <ambientLight color="lightblue" />
    //   {this.renderStl()}
    // </Canvas>)    
  // }
}

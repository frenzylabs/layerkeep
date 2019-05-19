/*
 *  list.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 04/30/19
 *  Copyright 2018 WessCope
 */

import React               from 'react';

global.THREE = require('three');

require('three/examples/js/loaders/STLLoader');
require('three/examples/js/controls/OrbitControls.js')


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

  //Method 1 to get object's world position
  // scene.updateMatrixWorld(); //Update world positions
  var objectWorldPosition = new THREE.Vector3();
  // objectWorldPosition.setFromMatrixPosition( object.matrixWorld );
  
  //Method 2 to get object's world position
  object.getWorldPosition(objectWorldPosition);

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

export class SceneManager extends React.Component {
  constructor(props) {
    super(props);

    var upAxis = new THREE.Vector3(0, 0, 1);
    THREE.Object3D.DefaultUp = upAxis;
    var axes = null;
    if (this.props.showAxes) {
      axes = this.buildAxes(1000)      
    }
    this.state = {contentType: null, localUrl: null, geometry: null, axes: axes}
    
    this.animate = this.animate.bind(this)
    this.handleResize = this.handleResize.bind(this)

    this.sceneContainer = React.createRef();

    this.scene   = new THREE.Scene()
    this.camera  = new THREE.PerspectiveCamera(35, 1, 1, 1000);
    this.renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
    this.material  = new THREE.MeshPhongMaterial({color: 0x00ff00});
    this.geometry  = null;
    this.mesh      = null;

    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    window.sm = this;

  }

  componentDidMount() {
    // window.addEventListener('load', this.handleLoad);

    this.loader = new THREE.STLLoader()
    this.loader.load(this.props.file.localUrl, (resp) =>{        
      this.geometry = resp;
      this.setupScene()
      this.addMesh()
      this.setState( {geometry: resp} )
    })
  }

  animate() {
    requestAnimationFrame(this.animate);
    this.renderer.render(this.scene, this.camera);
  }

  setupScene() {

    this.camera.position.set(200, 100, 200);

    var hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
    hemiLight.position.set(0, 200, 200);

    this.scene.add(hemiLight);

    var directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set( 0, 200, 200 );

    directionalLight.castShadow           = true;
    directionalLight.shadow.camera.top    = 180;
    directionalLight.shadow.camera.bottom = -100;
    directionalLight.shadow.camera.left   = -120;
    directionalLight.shadow.camera.right  = 120;

    this.scene.add(directionalLight);

    var ground = new THREE.Mesh( 
      new THREE.PlaneBufferGeometry(4000, 4000), 
      new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: true }) 
    );

    // ground.rotation.x   = Math.PI / 2;
    // ground.position.y  = 0; //- 0.5;
    ground.receiveShadow  = true;

    this.scene.add(ground);

    var grid                  = new THREE.GridHelper( 4000, 20, 0x000000, 0x000000 );
    grid.material.opacity     = 0.2;
    grid.material.transparent = true;
    grid.geometry.rotateX( Math.PI / 2 );

    this.scene.add( grid );

    if (this.state.axes) {
      this.scene.add( this.state.axes);
    }
    

    var container = $(this.sceneContainer.current)
    this.renderer.setSize(container.width(), container.height());
    this.renderer.shadowMap.enabled = true;
    

    // this.renderer.domElement.style.border = "1px solid grey";
    this.sceneContainer.current.append(this.renderer.domElement);

    window.addEventListener('resize', this.handleResize, false)
  }

  addMesh() {    
    this.mesh        = new THREE.Mesh(this.geometry, this.material);
    // window.mesh = mesh; 
    const boundingBox = new THREE.Box3();

    // get bounding box of object - this will be used to setup controls and camera
    boundingBox.setFromObject( this.mesh );

    
    this.mesh.castShadow = true;
    this.mesh.position.y =  - boundingBox.min.y;

    this.scene.add(this.mesh);

    // var container = $(this.sceneContainer.current)
    this.handleResize();
    fitCameraToObject  ( this.camera, this.mesh, 4, this.controls )

    this.animate();
  }

  buildAxes( length ) {
    return new THREE.AxesHelper( length );;
  }


  handleResize() {
    this.renderer.setSize(0, 0);
        
    var container = $(this.sceneContainer.current)
    this.camera.aspect = container.width() / container.height();
    this.renderer.setSize(container.width(), container.height(), true);
        // renderer.domElement.style.display = "block"
    this.camera.aspect = container.width() / container.height();
    this.camera.updateProjectionMatrix();
  }

 
  componentDidUpdate(prevProps) {
    // console.log("SceneManager PROPS DID CHANGE");
    
    if (this.props.file.localUrl != prevProps.file.localUrl) {
      this.loader = new THREE.STLLoader()
      this.loader.load(this.props.file.localUrl, (resp) => {        

        this.geometry = resp;
        if (this.mesh) {
          this.scene.remove(this.mesh)
        }
        this.addMesh();
        this.setState( {geometry: resp} )
        this.forceUpdate()
      })
    }
    if (this.props.showAxes != prevProps.showAxes) {
      if (this.props.showAxes) {
        var axes = this.state.axes
        if (!axes)
          axes = this.buildAxes(1000)
        this.scene.add(axes)
        this.setState( {axes: axes} )
      } else {
        this.scene.remove(this.state.axes)
        this.setState( {axes: null})
      }
    }
  }

  render() {
    return (<div ref={this.sceneContainer} style={{height: '100%', minHeight: "300px", padding: '0'}} />) 
  }
}

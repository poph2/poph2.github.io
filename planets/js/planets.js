

class Body extends THREE.Mesh {
  constructor(scene, material, radius, orbitalCenter, orbitalRadius, orbitalAngle, rotationPeriod, orbitalPeriod) {

    radius /= 2;

    var geometry = new THREE.SphereGeometry( radius,60,60 );

    super(geometry, material);

    this.radius = radius;
    this.orbitalCenter = orbitalCenter;
    this.orbitalRadius = orbitalRadius;
    this.orbitalAngle = orbitalAngle;
    this.rotationPeriod = rotationPeriod;
    this.orbitalPeriod = orbitalPeriod;

    var x = orbitalCenter.x + (orbitalRadius * Math.sin(orbitalAngle * (Math.PI/180)));
    var z = orbitalCenter.z + (orbitalRadius * Math.cos(orbitalAngle * (Math.PI/180)));

    // console.log(x);

    this.position.set(x, 0.0, z);

    scene.add(this);
  }

  move(speed, orbitalCenter, orbitalRadius) {



    var deg = 360.0;
    var orbitalAnglePerHour = deg/(this.orbitalPeriod*24);

    this.orbitalAngle += speed * orbitalAnglePerHour;
    this.orbitalCenter = orbitalCenter;
    if(orbitalCenter == null) {
      this.orbitalCenter = new THREE.Vector3(0, 0, 0);
    }
    // this.orbitalCenter = orbitalCenter;

    var x = this.orbitalCenter.x + (this.orbitalRadius * Math.sin(this.orbitalAngle * (Math.PI/180)));
    var z = this.orbitalCenter.z + (this.orbitalRadius * Math.cos(this.orbitalAngle * (Math.PI/180)));

    this.position.set(x, 0.0, z);

  }

  rotate(speed) {

    var rad = 360.0 * (Math.PI/180);

    var rotationAnglePerHour = rad/(this.rotationPeriod*24);

    // rotationAnglePerHour = rotationAnglePerHour;

    this.rotation.x += speed * 0.0;
    this.rotation.y += speed * rotationAnglePerHour;
    this.rotation.z += speed * 0.0;
  }
}

class Moon extends Body {

  // https://codepen.io/jayadul/pen/oNNLLMP

  constructor(scene, orbitalCenter, orbiting) {
    var textureURL = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/17271/lroc_color_poles_1k.jpg";
    var displacementURL = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/17271/ldem_3_8bit.jpg";

    // var geometry = new THREE.SphereGeometry( 1,60,60 );
    var textureLoader = new THREE.TextureLoader();
    var texture = textureLoader.load( textureURL );
    var displacementMap = textureLoader.load( displacementURL );

    var material = new THREE.MeshPhongMaterial ({
      color: 0xffffff ,
      map: texture ,
      displacementMap: displacementMap,
      displacementScale: 0.006,
      bumpMap: displacementMap,
      bumpScale: 0.01,
      reflectivity:0,
      shininess :0
    });

    if(orbitalCenter == null) {
      orbitalCenter = new THREE.Vector3(0, 0, 0);
    }

    var orbitalRadius = 2;
    if(orbiting == null) {
      orbitalRadius = 0;
    }

    var orbitalAngle = 0;
    var radius = 0.3;
    var rotationPeriod = 27.322;
    var orbitalPeriod = 27.322;

    super(scene, material, radius, orbitalCenter, orbitalRadius, orbitalAngle, rotationPeriod, orbitalPeriod);

  }

}

class Earth extends Body {

  // https://codepen.io/jayadul/pen/oNNLLMP

  constructor(scene, orbiting) {
    var textureURL = "./images/earthmap1k.jpg";
    var displacementURL = "./images/earthbump1k.jpg";

    // var geometry = new THREE.SphereGeometry( 1,60,60 );
    var textureLoader = new THREE.TextureLoader();
    var texture = textureLoader.load( textureURL );
    var displacementMap = textureLoader.load( displacementURL );

    var material = new THREE.MeshPhongMaterial ({
      color: 0xffffff ,
      map: texture ,
      displacementMap: displacementMap,
      displacementScale: 0.001,
      bumpMap: displacementMap,
      bumpScale: 0.05,
      reflectivity:1,
      shininess :1
    });

    var orbitalCenter = new THREE.Vector3(0, 0, 0);
    var orbitalRadius = 5;
    var orbitalAngle = 30;
    var radius = 1;
    var rotationPeriod = 1;
    var orbitalPeriod = 365.25636;

    if(!orbiting) {
      orbitalRadius = 0;
    }

    super(scene, material, radius, orbitalCenter, orbitalRadius, orbitalAngle, rotationPeriod, orbitalPeriod);

    this.moon = new Moon(scene, this.position);

    console.log(this.position);
  }

  rotate(speed) {
    super.rotate(speed, 1)
    this.moon.rotate(speed);
  }

  move(speed, orbitalCenter) {

    if(orbitalCenter == null) {
      super.move(speed, this.orbitalCenter);
    }
    this.moon.move(speed, this.position);
  }

}

class Sun extends Body {

  // https://codepen.io/bradyhouse/pen/OMmyra

  constructor(scene) {
    var textureURL = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/297733/sunSurfaceMaterial.jpg";
    // var displacementURL = "./images/earthbump1k.jpg";
    var atmosphereURL = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/297733/sunAtmosphereMaterial.png";

    // var geometry = new THREE.SphereGeometry( 1,60,60 );
    var textureLoader = new THREE.TextureLoader();
    var texture = textureLoader.load( textureURL );
    // var displacementMap = textureLoader.load( displacementURL );

    var material = new THREE.MeshPhongMaterial ({
      color: 0xffffff ,
      map: texture ,
      // displacementMap: displacementMap,
      // displacementScale: 0.06,
      // bumpMap: displacementMap,
      // bumpScale: 0.05,
      reflectivity:1,
      shininess :1
    });

    var orbitalCenter = new THREE.Vector3(0, 0, 0);
    var orbitalRadius = 0;
    var orbitalAngle = 30;
    var radius = 3;
    var rotationPeriod = 20;
    var orbitalPeriod = 1;

    super(scene, material, radius, orbitalCenter, orbitalRadius, orbitalAngle, rotationPeriod, orbitalPeriod);

    // super(scene, material, radius, orbitalCenter, orbitalRadius, orbitalAngle);

    this.earth = new Earth(scene);
  }

  rotate(speed) {
    super.rotate(speed);
    this.earth.rotate(speed);
  }

  move(speed) {
    this.earth.move(speed, this.orbitalCenter);
  }
}

class ThreeWorld {

  // var moon;

  constructor(scene, body) {

    // this.body = body;

    this.container = document.querySelector("#container");

    this.WIDTH  = this.container.clientWidth;
    this.HEIGHT = this.container.clientHeight;

    this.scene = scene;
    this.body = body;

    this.init();
    this.renderWorld();
  }

  init() {
    // this.scene = new THREE.Scene();

    //Init camera
    this.camera = new THREE.PerspectiveCamera(45, this.WIDTH / this.HEIGHT, 1, 100);
    this.camera.position.set(0, 5, 5);
    this.camera.lookAt(this.scene.position);

    //Init renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(this.WIDTH, this.HEIGHT);

    //Init Controls
    this.controls = new THREE.OrbitControls( this.camera, this.container );
    // this.controls.rotateSpeed = .07;
    this.controls.enableDamping = true;
    this.controls.dampingFactor = .05;

    this.controls.enablePan = false;

    document.body.appendChild(this.renderer.domElement);

    var cubeGeom = new THREE.CubeGeometry(100, 100, 10, 1, 1, 1);
    var mirrorCubeCamera = new THREE.CubeCamera( 0.1, 5000, 512 );
    this.scene.add( mirrorCubeCamera );

    var mirrorCubeMaterial = new THREE.MeshBasicMaterial( { envMap: mirrorCubeCamera.renderTarget } );
  	var mirrorCube = new THREE.Mesh( cubeGeom, mirrorCubeMaterial );
  	mirrorCube.position.set(-75,50,0);
  	// mirrorCubeCamera.position = mirrorCube.position;
  	this.scene.add(mirrorCube);

    // var geometry = new THREE.PlaneBufferGeometry( 100, 100 );
    var geometry = new THREE.PlaneGeometry( 1, 1, 1, 1 );
    var verticalMirror = new THREE.Reflector( geometry, {
      clipBias: 0.003,
      textureWidth: 100,
      textureHeight: 100,
      color: 0x889999,
      recursion: 1
    } );
    verticalMirror.rotation.x = -Math.PI/2;
    verticalMirror.position.y = -5;
    // verticalMirror.position.z = - 5;
    this.scene.add( verticalMirror );


    // var geometry = new THREE.PlaneGeometry( 1, 1, 1, 1 );
    // var material = new THREE.MeshBasicMaterial( { color: 0x0000ff } );
  	// var floor = new THREE.Mesh( geometry, material );
  	// floor.material.side = THREE.DoubleSide;
  	// floor.rotation.x = 90;
  	// this.scene.add( floor );






    // var cubeGeom = new THREE.CubeGeometry(100, 100, 10, 1, 1, 1);
    // var mirrorCubeCamera = new THREE.CubeCamera( 0.1, 5000, 512 );
    // // mirrorCubeCamera.renderTarget.minFilter = THREE.LinearMipMapLinearFilter;
    // this.scene.add( mirrorCubeCamera );
    // var mirrorCubeMaterial = new THREE.MeshBasicMaterial( { envMap: mirrorCubeCamera.renderTarget } );
    // mirrorCube = new THREE.Mesh( cubeGeom, mirrorCubeMaterial );
    // mirrorCube.position.set(-75,50,0);
    // mirrorCubeCamera.position = mirrorCube.position;
    // this.scene.add(mirrorCube);

    //Init Planets
    // this.sun = new Sun(this.scene);
    // this.moon = new Moon();
    // this.earth = new Earth();
    //
    // // this.scene.add(this.sun);
    // this.scene.add(this.moon);
    // this.scene.add(this.earth);

    //Init Lights
    // this.light = new THREE.PointLight( 0xFFFFFF, 1 );
    // this.light.position.set( 0, 0, 0 );
    // this.scene.add( this.light );

    // this.light = new THREE.DirectionalLight(0xFFFFFF, 1);
    // this.light.position.set(-100, 10,50);
    // this.scene.add(this.light);

    this.light1 = new THREE.PointLight(0xFFFFFF, 1, 0, 0);
    this.light1.position.set(0, 0, 10);
    this.scene.add(this.light1);

    this.hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.3 );
    this.hemiLight.color.setHSL( 0.6, 1, 0.6 );
    this.hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
    this.hemiLight.position.set( 0, 0, 0 );
    this.scene.add( this.hemiLight );

    // // var geometry = new THREE.PlaneGeometry( 0, 10, 10 );
    // // var material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
    // // var plane = new THREE.Mesh( geometry, material );
    // // this.scene.add( plane );
    // var geometry = new THREE.PlaneGeometry( 5, 5, 1, 1 );
    // var material = new THREE.MeshBasicMaterial( { color: 0x0000ff } );
    // var floor = new THREE.Mesh( geometry, material );
  	// floor.material.side = THREE.DoubleSide;
  	// floor.rotation.x = 90;
  	// floor.position.set(0,-1,0);
  	// this.scene.add( floor );

    // var worldGeometry = new THREE.SphereGeometry( 1000,60,60 );
    // var worldMaterial = new THREE.MeshBasicMaterial (
    //   { color: 0xffffff ,
    //   map: worldTexture ,
    //   side: THREE.BackSide
    //   }
    // );
    // var world = new THREE.Mesh( worldGeometry, worldMaterial );
    // scene.add( world );

  }

  renderWorld() {

      var speed = 0.05;

      this.body.rotate(speed);

      this.body.move(speed);

      this.controls.update();
      this.renderer.render(this.scene, this.camera);
  }

  resize() {

    this.WIDTH  = this.container.clientWidth;
    this.HEIGHT = this.container.clientHeight;

    this.camera.aspect = this.WIDTH / this.HEIGHT;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.WIDTH, this.HEIGHT);
  }

  show() {

  }

}

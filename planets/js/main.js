

// var container = document.querySelector("#container");
//
// var WIDTH  = container.clientWidth;
// var HEIGHT = container.clientHeight;

// var moon = new Moon();
// var earth = new Earth();

var scene = new THREE.Scene();

var moon = new Moon(scene);
// var earth = new Earth(scene);

threeWorld = new ThreeWorld(scene, moon);

function render() {
    requestAnimationFrame(render);
    threeWorld.renderWorld();
}

render();

function onResize() {
  threeWorld.resize();
}

window.addEventListener('resize', onResize, false);

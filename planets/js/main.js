

// var container = document.querySelector("#container");
//
// var WIDTH  = container.clientWidth;
// var HEIGHT = container.clientHeight;

// var moon = new Moon();
// var earth = new Earth();

threeWorld = new ThreeWorld();

function render() {
    requestAnimationFrame(render);
    threeWorld.render();
}

render();

function onResize() {
  threeWorld.resize();
}

window.addEventListener('resize', onResize, false);

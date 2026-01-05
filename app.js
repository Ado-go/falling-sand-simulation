let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

canvas.addEventListener("mousedown", startdrawParticle);
canvas.addEventListener("mouseup", stopdrawParticle);
canvas.addEventListener("mousemove", mouseMove);
canvas.addEventListener("mouseleave", stopdrawParticle);
canvas.addEventListener("mousedown", pickElement);

let simulation = new Simulation(700, 400);
simulation.particles = simulation.make2Darray();
simulation.oldFrame = simulation.make2Darray();
simulation.initialDraw();

function startdrawParticle(evt) {
  if (evt.button == 0) {
    simulation.drawing = true;
    simulation.particleDrawingInterval = setInterval(drawParticle, 1, evt);
  }
}

function stopdrawParticle(evt) {
  if (evt.button == 0) {
    simulation.drawing = false;
    clearInterval(simulation.particleDrawingInterval);
  }
}

function mouseMove(evt) {
  if (simulation.drawing) {
    clearInterval(simulation.particleDrawingInterval);
    simulation.particleDrawingInterval = setInterval(drawParticle, 1, evt);
  }
}

function pickElement(evt) {
  if (evt.clientX < 0 || evt.clientY < 0) {
    return;
  }
  if (
    Math.floor(evt.clientX / simulation.resolution) >=
      Math.floor(simulation.width / simulation.resolution) ||
    Math.floor(evt.clientY / simulation.resolution) <=
      Math.floor(simulation.height / simulation.resolution)
  ) {
    return;
  }
  if (Math.floor(evt.clientX / 40) < Object.keys(simulation.elements).length) {
    simulation.element = simulation.elements[Math.floor(evt.clientX / 40)];
  }
}

function drawParticle(evt) {
  if (evt.clientX < 0 || evt.clientY < 0) {
    return;
  }
  if (
    Math.floor(evt.clientX / simulation.resolution) >=
      Math.floor(simulation.width / simulation.resolution) ||
    Math.floor(evt.clientY / simulation.resolution) >=
      Math.floor(simulation.height / simulation.resolution)
  ) {
    return;
  }
  if (
    simulation.drawing &&
    (simulation.particles[Math.floor(evt.clientY / simulation.resolution)][
      Math.floor(evt.clientX / simulation.resolution)
    ].type == "AIR" ||
      simulation.element.type == "AIR")
  ) {
    simulation.particles[Math.floor(evt.clientY / simulation.resolution)][
      Math.floor(evt.clientX / simulation.resolution)
    ].changeParticle(simulation.element);
  }
}

setInterval(simulation.drawSimulation, 1000 / 60);

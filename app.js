let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let currentEvent = null;

canvas.addEventListener("pointerdown", startdrawParticle);
canvas.addEventListener("pointerup", stopdrawParticle);
canvas.addEventListener("pointermove", mouseMove);
canvas.addEventListener("pointerleave", stopdrawParticle);
canvas.addEventListener("pointerdown", pickElement);

let simulation = new Simulation(700, 400);
simulation.particles = simulation.make2Darray();
simulation.oldFrame = simulation.make2Darray();
simulation.initialDraw();

function startdrawParticle(evt) {
  if (evt.isPrimary) {
    simulation.drawing = true;
    currentEvent = evt;
    simulation.particleDrawingInterval = setInterval(drawParticle, 1);
  }
}

function stopdrawParticle(evt) {
  if (evt.isPrimary) {
    simulation.drawing = false;
    clearInterval(simulation.particleDrawingInterval);
  }
}

function mouseMove(evt) {
  currentEvent = evt;
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

function drawParticle() {
  if (!currentEvent) return;

  if (currentEvent.clientX < 0 || currentEvent.clientY < 0) {
    return;
  }
  if (
    Math.floor(currentEvent.clientX / simulation.resolution) >=
      Math.floor(simulation.width / simulation.resolution) ||
    Math.floor(currentEvent.clientY / simulation.resolution) >=
      Math.floor(simulation.height / simulation.resolution)
  ) {
    return;
  }
  if (
    simulation.drawing &&
    (simulation.particles[
      Math.floor(currentEvent.clientY / simulation.resolution)
    ][Math.floor(currentEvent.clientX / simulation.resolution)].type == "AIR" ||
      simulation.element.type == "AIR")
  ) {
    simulation.particles[
      Math.floor(currentEvent.clientY / simulation.resolution)
    ][Math.floor(currentEvent.clientX / simulation.resolution)].changeParticle(
      simulation.element
    );
  }
}

setInterval(simulation.drawSimulation, 1000 / 60);

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let currentEvent = null;

canvas.addEventListener("pointerdown", startdrawParticle, false);
canvas.addEventListener("pointerup", stopdrawParticle, false);
canvas.addEventListener("pointermove", mouseMove, false);
canvas.addEventListener("pointerleave", stopdrawParticle, false);
canvas.addEventListener("pointerdown", pickElement, false);

document.addEventListener(
  "touchmove",
  function (e) {
    if (e.target == canvas) {
      e.preventDefault();
    }
  },
  false
);

function getCanvasCoordinates(evt) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  return {
    x: (evt.clientX - rect.left) * scaleX,
    y: (evt.clientY - rect.top) * scaleY,
  };
}

canvas.width = 700;
canvas.height = 460;

let simulation = new Simulation(700, 400);
simulation.particles = simulation.make2Darray();
simulation.oldFrame = simulation.make2Darray();
simulation.initialDraw();

window.addEventListener(
  "resize",
  function () {
    if (simulation) {
      simulation.initialDraw();
    }
  },
  false
);

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
  if (evt.isPrimary) {
    currentEvent = evt;
  }
}

function pickElement(evt) {
  const coords = getCanvasCoordinates(evt);
  if (coords.x < 0 || coords.y < 0) {
    return;
  }
  if (
    Math.floor(coords.x / simulation.resolution) >=
      Math.floor(simulation.width / simulation.resolution) ||
    Math.floor(coords.y / simulation.resolution) <=
      Math.floor(simulation.height / simulation.resolution)
  ) {
    return;
  }
  if (Math.floor(coords.x / 40) < Object.keys(simulation.elements).length) {
    simulation.element = simulation.elements[Math.floor(coords.x / 40)];
  }
}

function drawParticle() {
  if (!currentEvent) return;

  const coords = getCanvasCoordinates(currentEvent);

  if (coords.x < 0 || coords.y < 0) {
    return;
  }
  if (
    Math.floor(coords.x / simulation.resolution) >=
      Math.floor(simulation.width / simulation.resolution) ||
    Math.floor(coords.y / simulation.resolution) >=
      Math.floor(simulation.height / simulation.resolution)
  ) {
    return;
  }
  if (
    simulation.drawing &&
    (simulation.particles[Math.floor(coords.y / simulation.resolution)][
      Math.floor(coords.x / simulation.resolution)
    ].type == "AIR" ||
      simulation.element.type == "AIR")
  ) {
    simulation.particles[Math.floor(coords.y / simulation.resolution)][
      Math.floor(coords.x / simulation.resolution)
    ].changeParticle(simulation.element);
  }
}

setInterval(simulation.drawSimulation, 1000 / 60);

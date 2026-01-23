console.log("testtttttttt");
const CANVA_WIDTH = 1000;
const CANVA_HEIGHT = 1000;
let fibs = [1, 1];
let scale = 1;
const colors = ["#003f5c", "#ffD166", "#ff6f61", "#00bfa5", "#e6e6fa"];

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  initFibs();
}

function draw() {
  background(200);
  translate(windowWidth / 2, windowHeight / 2);

  for (let i = 0; i < fibs.length; i++) {
    const fib = fibs[i] * scale;
    const color = colors[i % 5];
    fill(color);
    rect(0, 0, fib, fib);
    arc(fib, 0, 2 * fib, 2 * fib, 90, 180);
    translate(fib, fib);
    rotate(-90);
  }
  scale *= 0.99;
}

function addFib() {
  const fibsLen = fibs.length;
  fibs.push(fibs[fibsLen - 1] + fibs[fibsLen - 2]);
}

function initFibs() {
  for (let i = 0; i < 100; i++) {
    addFib();
    if (i === 25 || i === 99) {
      scale = 1;
    }
  }
}

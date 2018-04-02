class Settings {
  constructor() {}
  add(param, minVal, maxVal, curVal, step) {
    this[param] = curVal;
    let div = createDiv('');
    div.id(param);
    let slider = createSlider(minVal, maxVal, curVal, step);
    let label = createP(`${param}: ${curVal}`);
    // `this` doesn't work from anon-function in the slider,
    // references something else
    let self = this;
    slider.input(function() {
      self[param] = slider.value();
      label.html(`${param}: ${self[param]}`);
    });
    slider.parent(param);
    label.parent(param);
    // let lineBreak = createSpan('<br/>');
    // lineBreak.parent(param);
    // TODO: make slider and text stay on the same line
  }
}
let settings = new Settings();
let engine = new Engine();

var boids = [];
const WIDTH = 600;
const HEIGHT = 400;

function setup() {
  createCanvas(WIDTH, HEIGHT);
  // Boids try to go in the same direction
  settings.add('alignment',0,2,0.2,0.1);
  // Boids want to stay close to each other
  settings.add('cohesion',0,2,1,0.1);
  // Boids don't like intersecting
  settings.add('separation',0,2,1.5,0.1);
  // Boids move a bit randomly
  settings.add('noise',0,2,1,0.1);
  // TODO: Boids try to avoid obstacles ?
  // settings.add('avoid',0,2,1,0.1);
  for (let x = 1; x < 100; x ++) {
    boids.push(new Boid(random(0,WIDTH), random(0,HEIGHT)));
  }
}

function mouseClicked() {
  // Add a new boid
  boids.push(new Boid(mouseX, mouseY));
}

function draw() {
  let border = new Rectangle(WIDTH/2, HEIGHT/2, WIDTH/2, HEIGHT/2);
  let qtree = new QuadTree(border, 8);
  for (let boid of boids) {
    qtree.insert(boid);
  }
  background(0);
  show(qtree);
  for (let boid of boids) {
    boid.render();
  }
  // Highlight the last boid
  noStroke();
  fill(255,0,0,50);
  let b = boids[boids.length-1];
  ellipse(b.x, b.y, 2*interactionRadius);

  for (let boid of boids) {
    let neigthbors = qtree.query(new Circle(boid.x, boid.y, interactionRadius));
    var f;
    for (let other of neigthbors) {
      if (boid === other) continue;
      f = engine.pullForce(boid, other);
      boid.applyForce(f, settings.cohesion);
      f = engine.pushForce(boid, other);
      boid.applyForce(f, settings.separation);
      f = engine.alignForce(boid, other);
      boid.applyForce(f, settings.alignment);
    }
    f = engine.chaosForce();
    boid.applyForce(f, settings.noise);
  }

  // Move boids
  for (let boid of boids) {
    boid.move();
    if (boid.x >= WIDTH) boid.x -= WIDTH;
    if (boid.x < 0) boid.x += WIDTH;
    if (boid.y >= HEIGHT) boid.y -= HEIGHT;
    if (boid.y < 0) boid.y += HEIGHT;
  }
}

function show(qtree) {
  stroke(20);
  noFill();
  strokeWeight(1);
  rectMode(CENTER);
  rect(qtree.boundary.x, qtree.boundary.y, qtree.boundary.w * 2, qtree.boundary.h * 2);

  if (qtree.divided) {
    show(qtree.northeast);
    show(qtree.northwest);
    show(qtree.southeast);
    show(qtree.southwest);
  }
}

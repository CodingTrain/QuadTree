// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// The old way to do intersection tests, look how slow!!

let particleCount = 1000;
let particles = []; // ArrayList for all "things"

let framerateP;
let withQuadTree;
let total;

function setup() {
  createCanvas(600, 400);

  // Put 1000 particles in the system
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle(random(width), random(height)));
  }

  framerateP = createP('framerate: ');
  withQuadTree = createCheckbox('using quadtree');
  withQuadTree.checked(true);
  let totalP = createP('Number of particles: '+particleCount);
  total = createSlider(1, 5000, 1000);
  total.input(function() {
    particleCount = total.value();
    totalP.html('Number of particles: '+particleCount);
    while (particleCount > particles.length) {
      particles.push(new Particle(random(width), random(height)));
    }
    if (particleCount < particles.length) {
      particles.splice(0, particles.length - particleCount);
    }
  });

}

function draw() {

  background(0);

  // Display and move all particles
  if (withQuadTree.checked()) {
    let boundary = new Rectangle(width / 2, height / 2, width / 2, height / 2);
    qtree = new QuadTree(boundary, 4);
    for (let p of particles) {
      let point = new Point(p.x, p.y, p);
      qtree.insert(point);
    }
    show(qtree);
    for (let p of particles) {
      p.highlight = false;
      let range = new Circle(p.x, p.y, p.r * 2);
      let points = qtree.query(range);
      for (let point of points) {
        let other = point.userData;
        if (p != other) {
          let d = dist(p.x, p.y, other.x, other.y);
          if (d < p.r / 2 + other.r / 2) {
            p.highlight = true;
            break;
          }
        }
      }
    }
  } else {
    for (let p of particles) {
      p.highlight = false;
      for (let other of particles) {
        if (p != other) {
          let d = dist(p.x, p.y, other.x, other.y);
          if (d < p.r / 2 + other.r / 2) {
            p.highlight = true;
            break;
          }
        }
      }
    }
  }

  for (let p of particles) {
    p.render();
    p.move();
  }

  let fr = floor(frameRate());
  framerateP.html("Framerate: " + fr);

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

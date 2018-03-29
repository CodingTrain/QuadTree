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

  // Put 2000 Things in the system
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle(random(width), random(height)));
  }

  framerateP = createP('framerate: ');
  withQuadTree = createCheckbox('using quadtree');
  withQuadTree.checked(true);
  let totalP = createP(particleCount);
  total = createSlider(1, 5000, 1000);
  total.input(function() {
    particleCount = total.value();
    totalP.html(particleCount);
    while (particleCount > particles.length) {
      particles.push(new Particle(random(width), random(height)));
    }
    if (particleCount < particles.length) {
      particles.splice(0, particles.length - particleCount);
    }
  });

}

function draw() {
  let boundary = new Rectangle(width / 2, height / 2, width / 2, height / 2);
  qtree = new QuadTree(boundary, 4);


  background(0);
  fill(255);
  noStroke();
  // Run through the Grid
  stroke(255);

  // Display and move all Things
  for (let p of particles) {
    let point = new Point(p.x, p.y, p);
    qtree.insert(point);
  }


  for (let p of particles) {
    p.highlight = false;

    let range = new Circle(p.x, p.y, p.r * 2);

    if (withQuadTree.checked()) {
      let points = qtree.query(range);
      for (let point of points) {
        let other = point.userData;
        if (p != other) {
          let d = dist(p.x, p.y, other.x, other.y);
          if (d < p.r / 2 + other.r / 2) {
            p.highlight = true;
          }
        }
      }
    } else {
      for (let other of particles) {
        if (p != other) {
          let d = dist(p.x, p.y, other.x, other.y);
          if (d < p.r / 2 + other.r / 2) {
            p.highlight = true;
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

  // show(qtree);

}

function show(qtree) {
  stroke(255);
  noFill();
  strokeWeight(1);
  rectMode(CENTER);
  rect(qtree.boundary.x, qtree.boundary.y, qtree.boundary.w * 2, qtree.boundary.h * 2);
  // for (let p of qtree.points) {
  //   strokeWeight(2);
  //   point(p.x, p.y);
  // }

  if (qtree.divided) {
    show(qtree.northeast);
    show(qtree.northwest);
    show(qtree.southeast);
    show(qtree.southwest);
  }
}
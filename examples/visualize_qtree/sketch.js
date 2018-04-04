// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain

// QuadTree
// Coding Challenge #98.1: Quadtree - Part 1:
// https://www.youtube.com/watch?v=OJxEcs0w_kE
// Coding Challenge #98.2: Quadtree - Part 2:
// https://www.youtube.com/watch?v=QQx_NmCIuCY&t=70s

let qtree;

function setup() {
  createCanvas(600, 600);
  background(255);
  let boundary = new Rectangle(width / 2, height / 2, width / 2, height / 2);
  qtree = new QuadTree(boundary, 4);
  for (let i = 0; i < 300; i++) {
    let x = randomGaussian(width / 2, width / 8);
    let y = randomGaussian(height / 2, height / 8);
    let p = new Point(x, y);
    qtree.insert(p);
  }
}

function draw() {
  background(0);
  show(qtree);

  // let range = new Rectangle(mouseX, mouseY, 25, 25);
  let range = new Circle(mouseX, mouseY, 64);
  ellipse(range.x, range.y, range.r * 2);

  stroke(0, 255, 0);
  strokeWeight(4);
  let points = qtree.query(range);
  for (let p of points) {
    point(p.x, p.y);
  }
}

function show(qtree) {
  stroke(255);
  noFill();
  strokeWeight(1);
  rectMode(CENTER);
  rect(qtree.boundary.x, qtree.boundary.y, qtree.boundary.w * 2, qtree.boundary.h * 2);

  for (let p of qtree.points) {
    strokeWeight(2);
    point(p.x, p.y);
  }

  if (qtree.divided) {
    show(qtree.northeast);
    show(qtree.northwest);
    show(qtree.southeast);
    show(qtree.southwest);
  }
}

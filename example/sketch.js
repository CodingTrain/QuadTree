// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain

// QuadTree
// [video url 1]
// [video url 2]

let qtree;

function setup() {
  createCanvas(400, 400);
  background(255);
  let boundary = new Rectangle(200, 200, 200, 200);
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

  stroke(0, 255, 0);
  rectMode(CENTER);

  // let range = new Rectangle(mouseX, mouseY, 25, 25);
  let range = new Circle(mouseX, mouseY, 25);

  // draw the shape(i.e Rectangle, Circle etc.)
  range.show();

  let points = qtree.query(range);
  for (let p of points) {
    strokeWeight(4);
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

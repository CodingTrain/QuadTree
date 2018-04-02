// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain   

// QuadTree
// Part 1: https://youtu.be/OJxEcs0w_kE
// Part 2: https://youtu.be/QQx_NmCIuCY

// Example written by Ali Al Saqban

let particles = [];
let boundary;
let count = 0;

function setup() {
    createCanvas(400, 400);
    background(0);

    // Instantiate boids and quadtree boundary
    for (let i = 0; i < 600; i++) {
        particles.push(new Boid())
    }
    boundary = new Rectangle(width / 2, height / 2, width / 2, height / 2);
}

function draw() {
    //Switch off background and render with alpha for so much fun 
    background(0);
    
    // Instantiate a quadtree from particles at every frame
    let qtree = new QuadTree(boundary, 5);
    for (let p of particles) {
        let point = new Point(p.loc.x, p.loc.y, p);
        qtree.insert(point);
        p.run(qtree);
      }

    // Experimenting with condensing the two loops (qtree insert and p.run loops) into one. Seems to be working

    // for (let p of particles) {
    //     p.run(qtree);
    // }
    
    // Display quadtree in action
    show(qtree);

}


function show(qtree) {
    stroke(0,230,230);
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
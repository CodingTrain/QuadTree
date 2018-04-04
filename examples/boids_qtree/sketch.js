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
let parameters;

function setup() {
    createCanvas(600, 400);
    background(0);
    smooth()
    colorMode(HSB)

    // Parameters object
    parameters = {boids: 600,
                  sep: 1.5,
                  ali: 0.5,
                  coh: 1.2,
                  sep_tolerance: 25,
                  ali_tolerance: 50,
                  coh_tolerance: 50,
                  display_qtree: true,
                  background: true
                };

    // Instantiate boids and quadtree boundary
    for (let i = 0; i < parameters.boids; i++) {
        particles.push(new Boid(parameters))
    }

    boundary = new Rectangle(width / 2, height / 2, width / 2, height / 2);
    
}

function draw() {
    //Switch off background and render with alpha for so much fun 
    if(parameters.background) background(0);
    
    // Instantiate a quadtree from particles at every frame
    let qtree = new QuadTree(boundary, 5);
    
    for (let p of particles) {
        let point = new Point(p.loc.x, p.loc.y, p);
        qtree.insert(point)
        p.run(qtree);
      }
     
    // Run particle system here
    // for (let p of particles) {
    //     p.run(qtree);
    // }
    
    // Display quadtree in action
    if(parameters.display_qtree) show(qtree);

}


function show(qtree) {
    //Alternate color of quad stroke to show it well for background = false
    _color = color(303,56,25+25*sin(frameCount/50))
    stroke(_color);

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
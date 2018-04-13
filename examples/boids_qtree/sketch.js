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

let _display_quadtree;
let _background;
let framerateP;


function setup() {
    cnv = createCanvas(600, 400);
    background(0);
    smooth()
    colorMode(HSB)

    // Parameters object
    parameters = {
        boids: 700,
        sep: 1.5,
        ali: 1,
        coh: 1,
        sep_tolerance: 50,
        ali_tolerance: 25,
        coh_tolerance: 25,
        display_qtree: true,
        background: false
    };

    // Instantiate boids and quadtree boundary
    for (let i = 0; i < parameters.boids; i++) {
        particles.push(new Boid(parameters))
    }

    boundary = new Rectangle(width / 2, height / 2, width / 2, height / 2);

    // Interface Setup
    _display_qtree = createCheckbox('Display quadtree');
    _display_qtree.checked(true);
    
    _background = createCheckbox('Display background (Paint!)');
    _background.checked(true);

    let totalP = createP(parameters.boids);
    total = createSlider(1, 1000, parameters.boids);
    total.input(function () {
        parameters.boids = total.value();
        totalP.html(parameters.boids);
        while (parameters.boids > particles.length) {
            particles.push(new Boid(parameters));
        }
        if (parameters.boids < particles.length) {
            particles.splice(0, particles.length - parameters.boids);
        }
    });
}

function draw() {

    //Switch off background and render with alpha for so much fun 
    if (_background.checked()) background(0);

    // Instantiate a quadtree from particles at every frame
    let qtree = new QuadTree(boundary, 4);

    for (let p of particles) {
        let point = new Point(p.loc.x, p.loc.y, p);
        qtree.insert(point)
    }

    //Run particle system here
    for (let p of particles) {
        p.run(qtree);
    }

    // Display quadtree in action
    if (_display_qtree.checked()) show(qtree);

}


function show(qtree) {
    //Alternate color of quad stroke to show it well for background = false
    _color = color(303, 56, 25 + 25 * sin(frameCount / 50))
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
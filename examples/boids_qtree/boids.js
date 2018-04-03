// Daniel Shiffman
// http://natureofcode.com
// Boid class based on the Nature of Code
// approach to autonomous agents.

// Ported by Ali Al-Saqban

// Boid class that utilizes qtree data-structure

class Boid {

    constructor() {
        // Initializing location to be spread out rather than starting from one point
        // which affects performance.
        this.vel = createVector(random(-1,1),random(-1,1));
        this.acc = createVector(0, 0);
        this.loc = createVector(randomGaussian(width/2,4),randomGaussian(height/2,4));

        // Other attributes and limits
        this.r = 7
        this.maxspeed = 3;
        this.maxforce = 0.05;
        this.mass = 1;

    }

    run(qtree) {
        // The NoC approach took in a Boids list prior to this. Switch to qtree data-structure instead
        this.flock(qtree);
        this.update();
        this.render();
        this.torroidal();
    }

    update() {
        //Update location
        this.vel.add(this.acc);

        //Limit velocity and update location
        this.vel.limit(this.maxspeed);
        this.loc.add(this.vel);

        //Reset acceleration
        this.acc.mult(0)
    }

    applyForce(force) {
        // Rearranging F = ma to a = F/m
        this.acc.add(force)
    }

    seek(target){
        let desired = p5.Vector.sub(target, this.loc);

        // Normalize and scale
        desired.normalize();
        desired.mult(this.maxspeed)

        // Steer = Desired minus Velocity
        let steer = desired.sub(this.vel);

        // Limit steer vector magnitude (comment it out for some fun arrangements)
        //steer.limit(this.maxforce);

        return steer

    }

    flock(qtree) {
        // The flocking trifecta: separation, alignment, and cohesion.
        // Try these settings out with no background in draw
        // | 0.2 | 1 | 1.5 | // | 1.5 | 1 | 1.3 | // | 1 | 1 | 1.3 |

        this.applyForce(this.separate(qtree).mult(0.5));
        this.applyForce(this.align(qtree).mult(1));
        this.applyForce(this.cohesion(qtree).mult(1.5));

        // Add any additional force(s) to "stir the pot" here
        //this.applyForce(createVector(-1,0));
    }


    separate(qtree) {

        let tolerance = 25;
        let steer = createVector(0, 0);
        let count = 0;

        // Create a circle range to query qtree (Circle radius can be adjusted)
        let range = new Circle(this.loc.x, this.loc.y, tolerance);
        let points = qtree.query(range);

        // Loop through the points list from the query
        for (let p of points) {

            let other = p.userData
            let d = p5.Vector.dist(this.loc, other.loc);


            if (0 < d && d < tolerance) { // "Eek, another boid!" condition here
                let diff = p5.Vector.sub(this.loc, other.loc).normalize().div(d)
                steer.add(diff)
                count++;
            }
        }

        if(count>0){
            // comment out line below for some interesting arrangements
            // steer.div(count);
        }

        if (steer.mag() > 0) {
            steer.normalize();
            steer.mult(this.maxspeed);
            steer.sub(this.vel);

            // comment out line below for some interesting arrangements
            //steer.limit(this.maxforce);
        }

        return steer
    }

    align(qtree){

        let tolerance = 50;
        let steer = createVector(0, 0);
        let count = 0;


        let range = new Circle(this.loc.x, this.loc.y, tolerance);
        let points = qtree.query(range);

        for (let p of points) {

            let other = p.userData
            let d = p5.Vector.dist(this.loc, other.loc);

            if (0 < d && d < tolerance) {
                steer.add(other.vel)
                count++;
            }
        }

        if(count > 0){
            steer.div(count);
            steer.normalize();
            steer.mult(this.maxspeed);
            steer = steer.sub(this.vel)

            // comment out line below for some jitters
            steer.limit(this.maxforce)
        }

        return steer
    }

    cohesion(qtree){

        let tolerance = 50;
        let steer = createVector(0, 0);
        let count = 0;

        let range = new Circle(this.loc.x, this.loc.y, tolerance);
        let points = qtree.query(range);

        for (let p of points) {

            let other = p.userData
            let d = p5.Vector.dist(this.loc, other.loc);

            if (0 < d && d < tolerance) {
                steer.add(other.loc)
                count++;
            }
        }

        if(count > 0){
            // comment out line below for some interesting arrangements
            //steer.div(count);

            steer = this.seek(steer)
        }

        return steer
    }



    torroidal() {
        // Pacman world, or rather, a torus
        this.loc.x = this.loc.x > width ? 0 : this.loc.x
        this.loc.y = this.loc.y > height ? 0 : this.loc.y
        this.loc.x = this.loc.x+self.r < 0 ? width : this.loc.x
        this.loc.y = this.loc.y+self.r < 0 ? height : this.loc.y
    }
    render() {
        fill(255);
        stroke(255);
        strokeWeight(this.r/2);
        point(this.loc.x, this.loc.y);
    }
}

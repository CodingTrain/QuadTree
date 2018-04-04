// Daniel Shiffman
// http://natureofcode.com
// Boid class based on the Nature of Code
// approach to autonomous agents.

// Ported by Ali Al-Saqban

// Boid class that utilizes qtree data-structure

class Boid {

    constructor(_parameters) {
        // Initializing location to be spread out rather than starting from one point
        // which affects performance.

        this.acc = createVector(0, 0);
        this.loc = createVector(randomGaussian(width/2,25),randomGaussian(height/2,25));
        this.angle = random(-PI,PI);
        this.vel = createVector(cos(this.angle),sin(this.angle))

        // Other attributes and limits
        this.parameters = _parameters;
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
        this.acc.mult(0);
    }

    applyForce(force) {
        // Rearranging F = ma to a = F/m
        this.acc.add(force).div(this.mass);
    }

    seek(target){
        let desired = p5.Vector.sub(target, this.loc);

        // Normalize and scale
        desired.normalize();
        desired.mult(this.maxspeed);

        // Steer = Desired minus Velocity
        let steer = desired.sub(this.vel);

        // Limit steer vector magnitude (comment it out for some fun arrangements)
        steer.limit(this.maxforce);

        return steer

    }

    flock(qtree) {
        // The flocking trifecta: separation, alignment, and cohesion.

        this.applyForce(this.separate(qtree).mult(this.parameters.sep));
        this.applyForce(this.align(qtree).mult(this.parameters.ali));
        this.applyForce(this.cohesion(qtree).mult(this.parameters.coh));

        // Add any additional force(s) to "stir the pot" here
        // this.applyForce(createVector(-1,0));
    }


    separate(qtree) {

        let tolerance =  this.parameters.sep_tolerance;
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
            steer.div(count);
        }

        if (steer.mag() > 0) {
            steer.normalize();
            steer.mult(this.maxspeed);
            steer.sub(this.vel);

            steer.limit(this.maxforce);
        }

        return steer
    }

    align(qtree){

        let tolerance =  this.parameters.ali_tolerance;
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

            steer.limit(this.maxforce)
        }

        return steer
    }

    cohesion(qtree){

        let tolerance = this.parameters.coh_tolerance;
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
            steer.div(count);
            steer = this.seek(steer)
        }

        return steer
    }



    torroidal() {
        // Pacman world, or rather, a torus
        this.loc.x = this.loc.x > width ? this.loc.x-width : this.loc.x
        this.loc.y = this.loc.y > height ? this.loc.y-height : this.loc.y
        this.loc.x = this.loc.x < 0 ? this.loc.x+width : this.loc.x
        this.loc.y = this.loc.y < 0 ? this.loc.y+height : this.loc.y
    }

    render() {
        // Keep boids same color but distinguish them with brightness and size
        if(!this.color) this.color = color(190,96,floor(random(50,90)));
        if(!this.strokeRadius) this.strokeRadius = random(this.r/3,this.r);
        
        stroke(this.color);
        strokeWeight(this.strokeRadius);
        
        point(this.loc.x, this.loc.y);
    }
}

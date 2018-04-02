const boidSize = 5;
const interactionRadius = 4*boidSize;
const maxSpeed = 1;

class Boid {
  constructor(x,y,dir) {
    this.x = x;
    this.y = y;
    this.speed = maxSpeed;
    this.force = {x:0, y:0};
    if (!dir) {
      this.dir = 0;
    } else {
      this.dir = dir;
    }
  }
  move() {
    //moving
    this.x += this.speed * cos(this.dir);
    this.y += this.speed * sin(this.dir);
    // applying force
    let d = dist(0,0,this.force.x,this.force.y);
    if (d > maxSpeed) d = maxSpeed;
    this.speed = d;
    this.dir = atan2(this.force.x,this.force.y);
  }
  render() {
    if (!this.color) {
     this.color = color(random(120,255),random(120,255),random(120,255));
    }
    push();
    noStroke();
    fill(this.color);
    translate(this.x, this.y);
    rotate(this.dir + 3*PI/4);
    let s = boidSize;
    rectMode(CENTER);
    rect(0,0,2*s,2*s, 0,s,s,s);
    pop();
  }
  applyForce(f) {
    this.force = f;
  }
}

class Engine {
  constructor(settings) {}

  pullForce(boid, other) {
    let d = dist(boid.x, boid.y, other.x, other.y)+1;
    let f = {
      x : (other.x - boid.x) / d,
      y : (other.y - boid.y) / d
    };
    return f;
  }

  pushForce(boid, other) {
    let x = other.x;
    let y = other.y;
    while (x == boid.x && y == boid.y) {
      x += random(-1,1);
      y += random(-1,1);
    }
    let d = dist(boid.x, boid.y, x, y);
    let c = map(d, 0, interactionRadius, 1.5, 0.5) / d;
    let f = {
      x : (x-boid.x) * c,
      y : (y-boid.y) * c
    };
    return f;
  }

  alignForce(boid, other) {
    let f = {
      x : cos(other.dir),
      y : sin(other.dir)
    };
    return f;
  }

  chaosForce() {
    let f = {
      x : randomGaussian(0,0.5),
      y : randomGaussian(0,0.5)
    };
    return f;
  }
}

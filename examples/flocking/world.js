const boidSize = 5;
const interactionRadius = 4*boidSize;
const maxSpeed = 1;

class Boid {
  constructor(x,y,dir) {
    this.x = x;
    this.y = y;
    if (!dir) {
      this.dir = random(0,TWO_PI);
    } else {
      this.dir = dir;
    }
    this.speed = {
      x : maxSpeed * cos(this.dir),
      y : maxSpeed * sin(this.dir)
    };
    this.force = {
      x : 0,
      y : 0
    };
  }
  move() {
    // Move
    this.x += this.speed.x;
    this.y += this.speed.y;
    // Applying the driving force
    this.speed.x += this.force.x;
    this.speed.y += this.force.y;
    let d = dist(0,0,this.speed.x,this.speed.y);
    if (d > maxSpeed) {
      this.speed.x /= d;
      this.speed.y /= d;
    }
    this.dir = atan2(this.speed.y,this.speed.x);
    // Nullify the driving force
    this.force.x = 0;
    this.force.y = 0;
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
  applyForce(f, weight) {
    if (typeof weight == 'undefined') weight = 1;
    this.force.x += f.x * weight;
    this.force.y += f.y * weight;
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
      x : (boid.x - x) * c,
      y : (boid.y - y) * c
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
      x : randomGaussian(0,0.1),
      y : randomGaussian(0,0.1)
    };
    return f;
  }
}

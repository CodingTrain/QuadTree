// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com
// Daniel Shiffman

// Simple class describing an ellipse living on our screen

class Particle {


  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.highlight = false;
    this.r = 8;
  }

  move() {
    this.x += random(-1, 1);
    this.y += random(-1, 1);
  }

  render() {
    noStroke();
    if (this.highlight) fill(255);
    else fill(100);
    ellipse(this.x, this.y, this.r, this.r);
  }

}
// Daniel Shiffman
// https://thecodingtrain.com/CodingChallenges/098.1-quadtree.html
// https://thecodingtrain.com/CodingChallenges/098.2-quadtree.html
// https://thecodingtrain.com/CodingChallenges/098.3-quadtree.html

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

  checkCollision(others) {
    this.highlight = false;
    for (let other of others) {
      if (other.userData) {
        other = other.userData;
      }
      if (this != other) {
        let d = dist(this.x, this.y, other.x, other.y);
        if (d < other.r / 2 + this.r / 2) {
          this.highlight = true;
        }
      }
    }
  }
}

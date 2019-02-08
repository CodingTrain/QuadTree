// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain

// QuadTree

class Point {
  constructor(x, y, data) {
    this.x = x;
    this.y = y;
    this.userData = data;
  }
}

class Rectangle {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  contains(point) {
    return (point.x >= this.x - this.w &&
      point.x <= this.x + this.w &&
      point.y >= this.y - this.h &&
      point.y <= this.y + this.h);
  }


  intersects(range) {
    return !(range.x - range.w > this.x + this.w ||
      range.x + range.w < this.x - this.w ||
      range.y - range.h > this.y + this.h ||
      range.y + range.h < this.y - this.h);
  }


}

// circle class for a circle shaped query
class Circle {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.rSquared = this.r * this.r;
  }

  contains(point) {
    // check if the point is in the circle by checking if the euclidean distance of
    // the point and the center of the circle if smaller or equal to the radius of
    // the circle
    let d = Math.pow((point.x - this.x), 2) + Math.pow((point.y - this.y), 2);
    return d <= this.rSquared;
  }

  intersects(range) {

    let xDist = Math.abs(range.x - this.x);
    let yDist = Math.abs(range.y - this.y);

    // radius of the circle
    let r = this.r;

    let w = range.w;
    let h = range.h;

    let edges = Math.pow((xDist - w), 2) + Math.pow((yDist - h), 2);

    // no intersection
    if (xDist > (r + w) || yDist > (r + h))
      return false;

    // intersection within the circle
    if (xDist <= w || yDist <= h)
      return true;

    // intersection on the edge of the circle
    return edges <= this.rSquared;
  }
}

class QuadTree {
  constructor(boundary, capacity) {
    if (!boundary) {
      throw TypeError('boundary is null or undefined');
    }
    if (!(boundary instanceof Rectangle)) {
      throw TypeError('boundary should be a Rectangle');
    }
    if (typeof capacity !== 'number') {
      throw TypeError(`capacity should be a number but is a ${typeof capacity}`);
    }
    if (capacity < 1) {
      throw RangeError('capacity must be greater than 0');
    }
    this.boundary = boundary;
    this.capacity = capacity;
    this.points = [];
    this.divided = false;
  }

  toJSON(stringify) {
    if (typeof stringify === "undefined") {
      stringify = true;
    }
    let obj = { points: this.points };
    if (this.divided) {
      obj.ne = this.northeast.toJSON(false);
      obj.nw = this.northwest.toJSON(false);
      obj.se = this.southeast.toJSON(false);
      obj.sw = this.southwest.toJSON(false);
    }
    if (stringify) {
      obj.capacity = this.capacity;
      obj.x = this.boundary.x;
      obj.y = this.boundary.y;
      obj.w = this.boundary.w;
      obj.h = this.boundary.h;
      return JSON.stringify(obj);
    }
    return obj;
  }
  static fromJSON(obj, x, y, w, h, capacity) {
    if (typeof x === "undefined") {
      if ("x" in obj) {
        x = obj.x;
        y = obj.y;
        w = obj.w;
        h = obj.h;
        capacity = obj.capacity;
      } else {
        throw TypeError("JSON missing boundary information");
      }
    }
    let qt = new QuadTree(new Rectangle(x, y, w, h), capacity);
    qt.points = obj.points;
    if ("nw" in obj) {
      let x = qt.boundary.x;
      let y = qt.boundary.y;
      let w = qt.boundary.w / 2;
      let h = qt.boundary.h / 2;

      qt.northeast = QuadTree.fromJSON(obj.ne, x + w, y - h, w, h, capacity);
      qt.northwest = QuadTree.fromJSON(obj.nw, x - w, y - h, w, h, capacity);
      qt.southeast = QuadTree.fromJSON(obj.se, x + w, y + h, w, h, capacity);
      qt.southwest = QuadTree.fromJSON(obj.sw, x - w, y + h, w, h, capacity);

      qt.divided = true;
    }
    return qt;
  }

  subdivide() {
    let x = this.boundary.x;
    let y = this.boundary.y;
    let w = this.boundary.w / 2;
    let h = this.boundary.h / 2;

    let ne = new Rectangle(x + w, y - h, w, h);
    this.northeast = new QuadTree(ne, this.capacity);
    let nw = new Rectangle(x - w, y - h, w, h);
    this.northwest = new QuadTree(nw, this.capacity);
    let se = new Rectangle(x + w, y + h, w, h);
    this.southeast = new QuadTree(se, this.capacity);
    let sw = new Rectangle(x - w, y + h, w, h);
    this.southwest = new QuadTree(sw, this.capacity);

    this.divided = true;
  }

  insert(point) {
    if (!this.boundary.contains(point)) {
      return false;
    }

    if (this.points.length < this.capacity) {
      this.points.push(point);
      return true;
    }

    if (!this.divided) {
      this.subdivide();
    }

    return (this.northeast.insert(point) || this.northwest.insert(point) ||
      this.southeast.insert(point) || this.southwest.insert(point));
  }

  query(range, found) {
    if (!found) {
      found = [];
    }

    if (!range.intersects(this.boundary)) {
      return found;
    }

    for (let p of this.points) {
      if (range.contains(p)) {
        found.push(p);
      }
    }
    if (this.divided) {
      this.northwest.query(range, found);
      this.northeast.query(range, found);
      this.southwest.query(range, found);
      this.southeast.query(range, found);
    }

    return found;
  }

}

((module ? module.exports = { Point, Rectangle, QuadTree, Circle } : 0));


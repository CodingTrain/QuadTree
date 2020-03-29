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

  get left() {
    return this.x - this.w / 2;
  }

  get right() {
    return this.x + this.w / 2;
  }

  get top() {
    return this.y - this.h / 2;
  }

  get bottom() {
    return this.y + this.h / 2;
  }

  ne() {
    return new Rectangle(this.x + this.w / 2, this.y - this.h / 2, this.w / 2, this.h / 2);
  }

  nw() {
    return new Rectangle(this.x - this.w / 2, this.y - this.h / 2, this.w / 2, this.h / 2);
  }

  se() {
    return new Rectangle(this.x + this.w / 2, this.y + this.h / 2, this.w / 2, this.h / 2);
  }

  sw() {
    return new Rectangle(this.x - this.w / 2, this.y + this.h / 2, this.w / 2, this.h / 2);
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
    this.children = [];
  }

  static create() {
    let DEFAULT_CAPACITY = 8;
    if (arguments.length === 0) {
      if (typeof width === "undefined") {
        throw new TypeError("No global width defined");
      }
      if (typeof height === "undefined") {
        throw new TypeError("No global height defined");
      }
      let bounds = new Rectangle(width / 2, height / 2, width, height);
      return new QuadTree(bounds, DEFAULT_CAPACITY);
    }
    if (arguments[0] instanceof Rectangle) {
      let capacity = arguments[1] || DEFAULT_CAPACITY;
      return new QuadTree(arguments[0], capacity);
    }
    if (typeof arguments[0] === "number" &&
        typeof arguments[1] === "number" &&
        typeof arguments[2] === "number" &&
        typeof arguments[3] === "number") {
      let capacity = arguments[4] || DEFAULT_CAPACITY;
      return new QuadTree(new Rectangle(arguments[0], arguments[1], arguments[2], arguments[3]), capacity);
    }
    throw new TypeError('Invalid parameters');
  }

  toJSON(isChild) {
    let obj = { points: this.points };
    if (this.divided) {
      if (this.children[0].points.length > 0) {
        obj.ne = this.children[0].toJSON(true);
      }
      if (this.children[1].points.length > 0) {
        obj.nw = this.children[1].toJSON(true);
      }
      if (this.children[2].points.length > 0) {
        obj.se = this.children[2].toJSON(true);
      }
      if (this.children[3].points.length > 0) {
        obj.sw = this.children[3].toJSON(true);
      }
    }
    if (!isChild) {
      obj.capacity = this.capacity;
      obj.x = this.boundary.x;
      obj.y = this.boundary.y;
      obj.w = this.boundary.w;
      obj.h = this.boundary.h;
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
    if (
      "ne" in obj ||
      "nw" in obj ||
      "se" in obj ||
      "sw" in obj
    ) {
      let x = qt.boundary.x;
      let y = qt.boundary.y;
      let w = qt.boundary.w / 2;
      let h = qt.boundary.h / 2;

      if ("ne" in obj) {
        qt.children.push(QuadTree.fromJSON(obj.ne, x + w, y - h, w, h, capacity));
      } else {
        qt.children.push(new QuadTree(new Rectangle(x + w, y - h, w, h), capacity));
      }
      if ("nw" in obj) {
        qt.children.push(QuadTree.fromJSON(obj.nw, x - w, y - h, w, h, capacity));
      } else {
        qt.children.push(new QuadTree(new Rectangle(x - w, y - h, w, h), capacity));
      }
      if ("se" in obj) {
        qt.children.push(QuadTree.fromJSON(obj.se, x + w, y + h, w, h, capacity));
      } else {
        qt.children.push(new QuadTree(new Rectangle(x + w, y + h, w, h), capacity));
      }
      if ("sw" in obj) {
        qt.children.push(QuadTree.fromJSON(obj.sw, x - w, y + h, w, h, capacity));
      } else {
        qt.children.push(new QuadTree(new Rectangle(x - w, y + h, w, h), capacity));
      }

      qt.divided = true;
    }
    return qt;
  }

  subdivide() {
    this.children = [
      new QuadTree(this.boundary.ne(), this.capacity),
      new QuadTree(this.boundary.nw(), this.capacity),
      new QuadTree(this.boundary.se(), this.capacity),
      new QuadTree(this.boundary.sw(), this.capacity),
    ];

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

    return this.children.reduce((b, c) => b || c.insert(point), false);
  }

  query(range) {
    if (!range.intersects(this.boundary)) {
      return [];
    }

    return this.children
      .reduce((a, c) => a.concat(c.query(range)), this.points.filter(p => range.contains(p)));
  }

  closest(point, count, maxDistance) {
    if (typeof point === "undefined") {
      throw TypeError("Method 'closest' needs a point");
    }
    if (typeof count === "undefined") {
      count = 1;
    }

    // Limit to number of points in this QuadTree
    if (this.length == 0) {
      return [];
    }
    if (this.length < count) {
      return this.points;
    }

    if (typeof maxDistance === "undefined") {
      // A circle that contains the entire QuadTree
      const outerReach = Math.sqrt(
        Math.pow(this.boundary.w, 2) + Math.pow(this.boundary.h, 2)
      );
      // Distance of query point from center
      const pointDistance = Math.sqrt(
        Math.pow(point.x, 2) + Math.pow(point.y, 2)
      );
      // One QuadTree size away from the query point
      maxDistance = outerReach + pointDistance;
    }

    // Binary search with Circle queries
    let inner = 0;
    let outer = maxDistance;
    let limit = 8; // Limit to avoid infinite loops caused by ties
    let points;
    while (limit > 0) {
      const radius = (inner + outer) / 2;
      const range = new Circle(point.x, point.y, radius);
      points = this.query(range);
      if (points.length === count) {
        return points; // Return when we hit the right size
      } else if (points.length < count) {
        inner = radius;
      } else {
        outer = radius;
        limit --;
      }
    }
    // Sort by squared distance
    points.sort(
      (a, b) => {
        const aDist = Math.pow(point.x - a.x, 2) +
          Math.pow(point.y - a.y, 2);
        const bDist = Math.pow(point.x - b.x, 2) +
          Math.pow(point.y - b.y, 2);
        return aDist - bDist;
      }
    );
    // Slice to return correct count (breaks ties)
    return points.slice(0, count);
  }

  forEach(fn) {
    this.points.forEach(fn);
    this.children.forEach(c => c.forEach(fn));
  }

  merge(other, capacity) {
    let left = Math.min(this.boundary.left, other.boundary.left);
    let right = Math.max(this.boundary.right, other.boundary.right);
    let top = Math.min(this.boundary.top, other.boundary.top);
    let bottom = Math.max(this.boundary.bottom, other.boundary.bottom);
    let height = bottom - top;
    let width = right - left;
    let midX = left + width / 2;
    let midY = top + height / 2;
    let boundary = new Rectangle(midX, midY, width, height);
    let result = new QuadTree(boundary, capacity);
    this.forEach(point => result.insert(point));
    other.forEach(point => result.insert(point));

    return result;
  }

  get length() {
    return this.children.reduce((a, c) => a + c.length, this.points.length);
  }
}

if (typeof module !== "undefined") {
  module.exports = { Point, Rectangle, QuadTree, Circle };
}

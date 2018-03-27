// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain

// QuadTree

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
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

      // get the name of the range's class (i.e Rectangle, Circle etc.)
      var is_Rect = range.constructor.name;

      // if the range is of class Rectangle
      if(is_Rect == 'Rectangle'){
        return !(range.x - range.w > this.x + this.w ||
                 range.x + range.w < this.x - this.w ||
                 range.y - range.h > this.y + this.h ||
                 range.y + range.h < this.y - this.h);
      }else {
          // if the range is of class Circle
          if(is_Rect == 'Circle'){

              // call the intersects function of the range
              // this is done in order to have each class
              // having its own intersects and not have here
              // a huge function that contains all of the
              // intersection checks
              return range.intersects(this);
          }
      }
    }

    show(){
        rect(this.x, this.y, this.w * 2, this.h * 2);
    }


}

// circle class for a circle shaped query
class Circle {
    constructor(x, y, r){
        this.x = x;
        this.y = y;
        this.r = r;
    }

    contains(point) {
        // check if the point is in the circle by checking if the euclidean distance of
        // the point and the center of the circle if smaller or equal to the radius of
        // the circle
        dist = Math.sqrt(Math.pow((point.x - this.x), 2) + Math.pow((point.y - this.y), 2));
        return dist <= this.r;
    }

    intersects(range){

        var xDist = Math.abs(range.x - this.x);
        var yDist = Math.abs(range.y - this.y);

        // radius of the circle
        var r = this.r;

        // radius of circle squared
        var r_squared = Math.pow(this.r, 2);

        var w = range.w;
        var h = range.h;

        var edges = Math.pow((xDist - w), 2) + Math.pow((yDist - h), 2);

        // no intersection
        if (xDist > (r + w) || yDist > (r + h))
            return false;

        // intersection within the circle
        if (xDist <= w || yDist <= h)
            return true;

        // intersection on the edge of the circle
        return edges <= r_squared;
    }

    show(){
        ellipse(this.x, this.y, this.r * 2);
    }

}

class QuadTree {
  constructor(boundary, n) {
    this.boundary = boundary;
    this.capacity = n;
    this.points = [];
    this.divided = false;
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
    } else {
      if (!this.divided) {
        this.subdivide();
      }
      if (this.northeast.insert(point)) {
        return true;
      } else if (this.northwest.insert(point)) {
        return true;
      } else if (this.southeast.insert(point)) {
        return true;
      } else if (this.southwest.insert(point)) {
        return true;
      }
    }
  }

  query(range, found) {
    if (!found) {
      found = [];
    }
    if (!this.boundary.intersects(range)) {
      return;
    } else {
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
    }
    return found;
  }

}

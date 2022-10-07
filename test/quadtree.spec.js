const {expect} = require('chai');
const { QuadTree, Rectangle, Point, Circle } = require('../quadtree');

describe('QuadTree', () => {
  describe('on construction', () => {
    it('assigns boundary', () => {
      let rect = new Rectangle(100, 100, 10, 10);
      let quadtree = new QuadTree(rect, 4);
      expect(quadtree.boundary).to.equal(rect);
    });
    it('throws exception when boundary not set', () => {
      expect(() => { new QuadTree(null, 3) }).to.throw(TypeError);
    });
    it('throws exception when boundary not set with correct message', () => {
      expect(() => { new QuadTree(null, 3) }).to.throw('boundary is null or undefined');
    });
    it('throws exception when boundary is not a Rectangle with correct message', () => {
      expect(() => { new QuadTree('not a boundary object', 3) }).to.throw('boundary should be a Rectangle');
    });
    it('throws type error when boundary is not a Rectangle', () => {
      expect(() => { new QuadTree('not a boundary object', 3) }).to.throw(TypeError);
    });
    it('assigns capacity', () => {
      let rect = new Rectangle(100, 100, 10, 10);
      let quadtree = new QuadTree(rect, 4);
      expect(quadtree.capacity).to.equal(4);
    });
    it('throws exception when capacity is less than 1', () => {
      let rect = new Rectangle(100, 100, 10, 10);
      expect(() => { new QuadTree(rect, 0) }).to.throw(RangeError);
    });
    it('throws exception when capacity is less than 1 with correct message', () => {
      let rect = new Rectangle(100, 100, 10, 10);
      expect(() => { new QuadTree(rect, 0) }).to.throw('capacity must be greater than 0');
    });
    it('throws exception when capacity is not a number', () => {
      let rect = new Rectangle(100, 100, 10, 10);
      expect(() => { new QuadTree(rect, 'test') }).to.throw(TypeError);
    });
    it('throws exception with correct message when capacity is not a number', () => {
      let rect = new Rectangle(100, 100, 10, 10);
      expect(() => { new QuadTree(rect, 'test') }).to.throw('capacity should be a number but is a string');
    });
    it('assigns empty array to points', () => {
      let rect = new Rectangle(100, 100, 30, 30);
      let quadtree = new QuadTree(rect, 4);
      expect(quadtree.points).to.have.length(0);
    });
    it('assigns divided to false', () => {
      let rect = new Rectangle(100, 100, 30, 30);
      let quadtree = new QuadTree(rect, 4);
      expect(quadtree.divided).to.be.false;
    });
    it('does not define northeast', () => {
      let rect = new Rectangle(100, 100, 30, 30);
      let quadtree = new QuadTree(rect, 4);
      expect(quadtree.northeast).to.be.undefined;
    });
    it('does not define northwest', () => {
      let rect = new Rectangle(100, 100, 30, 30);
      let quadtree = new QuadTree(rect, 4);
      expect(quadtree.northwest).to.be.undefined;
    });
    it('does not define southeast', () => {
      let rect = new Rectangle(100, 100, 30, 30);
      let quadtree = new QuadTree(rect, 4);
      expect(quadtree.southeast).to.be.undefined;
    });
    it('does not define southwest', () => {
      let rect = new Rectangle(100, 100, 30, 30);
      let quadtree = new QuadTree(rect, 4);
      expect(quadtree.southwest).to.be.undefined;
    });
  });
  describe('on subdivide', () => {
    let rect;
    let quadtree;
    let cx = 100;
    let cy = 200;
    let w = 50;
    let h = 30;
    let childTests = (direction, mx, my) => {
      describe(direction, () => {
        let child;
        let boundary;
        beforeEach(() => {
          child = quadtree[direction];
          boundary = child.boundary;
        });
        it('is assigned', () => {
          expect(child).not.to.be.undefined;
        })
        it('gets correct center x', () => {
          expect(boundary.x).to.equal(mx);
        });
        it('gets correct center y', () => {
          expect(boundary.y).to.equal(my);
        });
        it('has parent width divided by 2', () => {
          expect(boundary.w).to.equal(w / 2);
        });
        it('has parent height divided by 2', () => {
          expect(boundary.h).to.equal(h / 2);
        });
        it('has same capacity as parent', () => {
          expect(child.capacity).to.equal(quadtree.capacity);
        });
      })
    };
    beforeEach(() => {
      rect = new Rectangle(cx, cy, w, h);
      quadtree = new QuadTree(rect, 4);
      quadtree.subdivide();
    });
    it('marks subdivided as true', () => {
      expect(quadtree.divided).to.be.true;
    });
    childTests('northwest', cx - w / 4, cy - h / 4);
    childTests('northeast', cx + w / 4, cy - h / 4);
    childTests('southwest', cx - w / 4, cy + h / 4);
    childTests('southeast', cx + w / 4, cy + h / 4);
  });
  describe('insert', () => {
    let rect;
    let quadtree;
    beforeEach(() => {
      rect = new Rectangle(100, 200, 20, 50);
      quadtree = new QuadTree(rect, 4);
    });
    it('returns false when boundary does not contain point', () => {
      expect(quadtree.insert(new Point(10, 20))).to.be.false;
    });
    it('does not add to points array when boundary does not contain point', () => {
      quadtree.insert(new Point(89, 200));
      quadtree.insert(new Point(111, 200));
      quadtree.insert(new Point(100, 174));
      quadtree.insert(new Point(100, 226));
      expect(quadtree.points).to.have.length(0);
    });
    it('does add to points array when point is on the boundary', () => {
      quadtree.insert(new Point(90, 200));
      quadtree.insert(new Point(110, 200));
      quadtree.insert(new Point(100, 175));
      quadtree.insert(new Point(100, 225));
      expect(quadtree.points).to.have.length(4);
    });
    it('returns true when capacity not hit and boundary does contain point', () => {
      expect(quadtree.insert(new Point(100,200))).to.be.true;
    });
    it('adds point to points array when capacity not hit and boundary does contain point', () => {
      quadtree.insert(new Point(100,200));
      expect(quadtree.points).to.have.length(1);
    });
    it('triggers subdivision when capacity is exceeded', () => {
      expect(quadtree.divided).to.be.false;
      quadtree.insert(new Point(100,200));
      quadtree.insert(new Point(100,200));
      quadtree.insert(new Point(100,200));
      quadtree.insert(new Point(100,200));
      quadtree.insert(new Point(100,200));
      expect(quadtree.divided).to.be.true;
    });
    describe('when subdivided', () => {
      beforeEach(() => {
        // one for each quarter
        quadtree.insert(new Point(100 - 5,200 - 5));
        quadtree.insert(new Point(100 + 5,200 - 5));
        quadtree.insert(new Point(100 - 5,200 + 5));
        quadtree.insert(new Point(100 + 5,200 + 5));
      });
      it('correctly adds to northwest', () => {
        quadtree.insert(new Point(100 - 10, 200 - 10));
        expect(quadtree.northwest.points).to.have.length(2);
      });
      it('returns true when added to northwest', () => {
        expect(quadtree.insert(new Point(100 - 10, 200 - 10))).to.be.true;
      });
      it('correctly adds to northeast', () => {
        quadtree.insert(new Point(100 + 10, 200 - 10));
        expect(quadtree.northeast.points).to.have.length(2);
      });
      it('returns true when added to northeast', () => {
        expect(quadtree.insert(new Point(100 + 10, 200 - 10))).to.be.true;
      });
      it('correctly adds to southwest', () => {
        quadtree.insert(new Point(100 - 10, 200 + 10));
        expect(quadtree.southwest.points).to.have.length(2);
      });
      it('returns true when added to southwest', () => {
        expect(quadtree.insert(new Point(100 - 10, 200 + 10))).to.be.true;
      });
      it('correctly adds to southeast', () => {
        quadtree.insert(new Point(100 + 10, 200 + 10));
        expect(quadtree.southeast.points).to.have.length(2);
      });
      it('returns true when added to southeast', () => {
        expect(quadtree.insert(new Point(100 + 10, 200 + 10))).to.be.true;
      });
      it('does not trigger multiple subdivisions', () => {
        quadtree.insert(new Point(100 + 10, 200 + 10));
        let temp = quadtree.northeast;
        quadtree.insert(new Point(100 + 10, 200 + 10));
        expect(quadtree.northeast).to.equal(temp);
      });
    });
  });
  describe('query', () => {
    let quadtree;
    let points;
    beforeEach(() => {
      quadtree = new QuadTree(new Rectangle(0, 0, 100, 100), 4);
      points = [
        new Point(-25, -25),
        new Point(25, -25),
        new Point(-25, 25),
        new Point(25, 25)
      ];
      points.forEach(point => quadtree.insert(point));
    });
    it('returns an array when not passed in an array', () => {
      let found = quadtree.query(new Rectangle(50, 50, 10, 10));
      expect(found).to.be.an('array');
    });
    it('returns the array that is passed into it', () => {
      let old = [];
      let found = quadtree.query(new Rectangle(50, 50, 10, 10), old);
      expect(found).to.equal(old);
    });
    it('returns an empty array when no points should match', () => {
      let found = quadtree.query(new Rectangle(0, 0, 10, 10));
      expect(found).to.have.length(0);
    });
    it('returns no items when there is no overlap', () => {
      let found = quadtree.query(new Rectangle(1000, 1000, 10, 10));
      expect(found).to.have.length(0);
    });
    it('returns an array with one point when search should be successful', () => {
      let found = quadtree.query(new Rectangle(25, 25, 10, 10));
      expect(found).to.have.length(1);
    });
    it('returns an array with the correct point when search should be successful', () => {
      let found = quadtree.query(new Rectangle(25, 25, 10, 10));
      expect(found).to.contain(points[3]);
    });
    it('returns an item on the right edge of the query region', () => {
      let found = quadtree.query(new Rectangle(20, 25, 10, 10));
      expect(found).to.contain(points[3]);
    });
    it('returns an item on the bottom edge of the query region', () => {
      let found = quadtree.query(new Rectangle(25, 20, 10, 10));
      expect(found).to.contain(points[3]);
    });
    describe('when a subdivision occurs', () => {
      beforeEach(() => {
        points.push(new Point(-26, -26));
        points.push(new Point(26, -26));
        points.push(new Point(-26, 26));
        points.push(new Point(26, 26));
        quadtree.insert(points[4]);
        quadtree.insert(points[5]);
        quadtree.insert(points[6]);
        quadtree.insert(points[7]);
        expect(quadtree.divided).to.be.true;
      });
      it('returns correct number of northwest points', () => {
        let found = quadtree.query(new Rectangle(-25, 25, 10, 10));
        expect(found).to.have.length(2);
      });
      it('returns all appropriate northwest points', () => {
        let found = quadtree.query(new Rectangle(-25, 25, 10, 10));
        expect(found).to.contain(points[2]);
        expect(found).to.contain(points[6]);
      });
      it('returns correct number of northeast points', () => {
        let found = quadtree.query(new Rectangle(25, 25, 10, 10));
        expect(found).to.have.length(2);
      });
      it('returns all appropriate northeast points', () => {
        let found = quadtree.query(new Rectangle(25, 25, 10, 10));
        expect(found).to.contain(points[3]);
        expect(found).to.contain(points[7]);
      });
      it('returns correct number of southwest points', () => {
        let found = quadtree.query(new Rectangle(-25, -25, 10, 10));
        expect(found).to.have.length(2);
      });
      it('returns all appropriate southwest points', () => {
        let found = quadtree.query(new Rectangle(-25, -25, 10, 10));
        expect(found).to.contain(points[0]);
        expect(found).to.contain(points[4]);
      });
      it('returns correct number of southeast points', () => {
        let found = quadtree.query(new Rectangle(25, -25, 10, 10));
        expect(found).to.have.length(2);
      });
      it('returns all appropriate southeast points', () => {
        let found = quadtree.query(new Rectangle(25, -25, 10, 10));
        expect(found).to.contain(points[1]);
        expect(found).to.contain(points[5]);
      });
      it('returns correct number of points from multiple regions', () => {
        let found = quadtree.query(new Rectangle(0, -25, 60, 10));
        expect(found).to.have.length(4);
      });
      it('returns correct points from multiple regions', () => {
        let found = quadtree.query(new Rectangle(0, -25, 60, 10));
        expect(found).to.contain(points[0]);
        expect(found).to.contain(points[4]);
        expect(found).to.contain(points[1]);
        expect(found).to.contain(points[5]);
      });
      it('returns no points as expected with a Circle', () => {
        let found = quadtree.query(new Circle(0, 0, 10));
        expect(found).to.have.length(0);
      });
      it('returns correct number of points with a Circle', () => {
        let found = quadtree.query(new Circle(25, 25, 10));
        expect(found).to.have.length(2);
      });
      it('returns correct points with a Circle', () => {
        let found = quadtree.query(new Circle(25, 25, 10));
        expect(found).to.contain(points[3]);
        expect(found).to.contain(points[7]);
      });
    });
  });
  describe('closest', () => {
    let quadtree;
    let points;
    beforeEach(() => {
      quadtree = new QuadTree(new Rectangle(0, 0, 100, 100), 4);
      points = [
        new Point(20, 0),
        new Point(40, 0),
        new Point(-30, 0),
        new Point(-40, 0)
      ];
      points.forEach(point => quadtree.insert(point));
    });
    it('requires a point to query', () => {
      expect(() => { quadtree.closest() }).to.throw("Method 'closest' needs a point");
    });
    it('returns empty array when quadtree is empty', () => {
      quadtree = new QuadTree(new Rectangle(0, 0, 100, 100), 4);
      found = quadtree.closest(new Point(0, 0), 1);
      expect(found).to.have.length(0);
    });
    it('returns all items when number requested exceeds QuadTree contents', () => {
      found = quadtree.closest(new Point(0, 0), 10);
      expect(found).to.have.length(4);
    });
    it('returns closest item', () => {
      found = quadtree.closest(new Point(0, 0), 1);
      expect(found).to.contain(points[0]);
    });
    it('returns default number of items (one)', () => {
      found = quadtree.closest(new Point(0, 0));
      expect(found).to.have.length(1);
    });
    it('returns correct number of items (one)', () => {
      found = quadtree.closest(new Point(0, 0), 1);
      expect(found).to.have.length(1);
    });
    it('returns correct number of items (many)', () => {
      found = quadtree.closest(new Point(0, 0), 3);
      expect(found).to.have.length(3);
    });
    it('returns correct number of items when tie occurs', () => {
      found = quadtree.closest(new Point(30, 0), 1);
      expect(found).to.have.length(1);
    });
    it('returns correct number of items when far away', () => {
      found = quadtree.closest(new Point(-30000, 0), 1);
      expect(found).to.have.length(1);
      expect(found).to.contain(points[3]);
    });
    // Supplied maxDistance
    it('limits search to maxDistance', () => {
      found = quadtree.closest(new Point(0, 0), 3, 25);
      expect(found).to.have.length(1);
      expect(found).to.contain(points[0]);
    });
    it('gracefully fails search if nothing within maxDistance', () => {
      found = quadtree.closest(new Point(-100, 0), 3, 25);
      expect(found).to.have.length(0);
    });
  });
  describe('length', () => {
    let quadtree;
    beforeEach(() => {
      let rect = new Rectangle(100, 100, 20, 20);
      quadtree = new QuadTree(rect, 4);
    });
    it('returns 0 when no points in QuadTree', () => {
      expect(quadtree.length).to.equal(0);
    });
    it('returns 1 when only one point in QuadTree', () => {
      quadtree.insert(new Point(95, 95));
      expect(quadtree.length).to.equal(1);
    });
    it('does not increase count when new point is not within QuadTree', () => {
      quadtree.insert(new Point(0, 0));
      expect(quadtree.length).to.equal(0);
    });
    it('counts points from all subtrees after subdivision', () => {
      quadtree.insert(new Point(96, 96));
      quadtree.insert(new Point(96, 106));
      quadtree.insert(new Point(106, 96));
      quadtree.insert(new Point(106, 106));
      quadtree.insert(new Point(96, 96));
      quadtree.insert(new Point(96, 106));
      quadtree.insert(new Point(106, 96));
      quadtree.insert(new Point(106, 106));
      expect(quadtree.length).to.equal(8);
    });
  });
  describe('forEach', () => {
    let quadtree;
    let points;
    beforeEach(() => {
      let bound = new Rectangle(-30, 40, 12, 43);
      quadtree = new QuadTree(bound, 4);
      points = [];
      for (let idx = 0; idx < 10; ++idx) {
        points.push(new Point(
          bound.left + bound.w * Math.random(),
          bound.top + bound.h * Math.random()));
      }
      points.forEach(point => quadtree.insert(point));
    });
    for (let idx = 0; idx < 10; ++idx) {
      it(`runs forEach function against point ${idx}`, () => {
        quadtree.forEach(point => point.userData = idx);
        expect(points[idx].userData).to.equal(idx);
      });
    }
  });
});

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
    childTests('northwest', cx - w / 2, cy - h / 2);
    childTests('northeast', cx + w / 2, cy - h / 2);
    childTests('southwest', cx - w / 2, cy + h / 2);
    childTests('southeast', cx + w / 2, cy + h / 2);
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
      quadtree.insert(new Point(10, 20));
      expect(quadtree.points).to.have.length(0);
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
        quadtree.insert(new Point(100,200));
        quadtree.insert(new Point(100,200));
        quadtree.insert(new Point(100,200));
        quadtree.insert(new Point(100,200));
      });
      it('correctly adds to northwest', () => {
        quadtree.insert(new Point(100 - 10, 200 - 10));
        expect(quadtree.northwest.points).to.have.length(1);
      });
      it('returns true when added to northwest', () => {
        expect(quadtree.insert(new Point(100 - 10, 200 - 10))).to.be.true;
      });
      it('correctly adds to northeast', () => {
        quadtree.insert(new Point(100 + 10, 200 - 10));
        expect(quadtree.northeast.points).to.have.length(1);
      });
      it('returns true when added to northeast', () => {
        expect(quadtree.insert(new Point(100 + 10, 200 - 10))).to.be.true;
      });
      it('correctly adds to southwest', () => {
        quadtree.insert(new Point(100 - 10, 200 + 10));
        expect(quadtree.southwest.points).to.have.length(1);
      });
      it('returns true when added to southwest', () => {
        expect(quadtree.insert(new Point(100 - 10, 200 + 10))).to.be.true;
      });
      it('correctly adds to southeast', () => {
        quadtree.insert(new Point(100 + 10, 200 + 10));
        expect(quadtree.southeast.points).to.have.length(1);
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
        let found = quadtree.query(new Rectangle(0, -25, 50, 10));
        expect(found).to.have.length(4);
      });
      it('returns correct points from multiple regions', () => {
        let found = quadtree.query(new Rectangle(0, -25, 50, 10));
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
  describe('json operations', () => {
    let quadtree;
    beforeEach(() => {
      quadtree = new QuadTree(new Rectangle(0, 0, 40, 40), 2);
      points = [
        new Point(-20,  20, { index: 0 }),
        new Point(-20, -20, { index: 1 }),
        new Point( 20,  20, { index: 2 }),
        new Point( 20, -20, { index: 3 })
      ];
      points.forEach(point => quadtree.insert(point));
    });
    it('throws exception when JSON has no position data', () => {
      expect(() => { new QuadTree.fromJSON({ points: [] }) }).to.throw(TypeError);
    });
    it('saves all data to a string', () => {
      const json = quadtree.toJSON();
      const obj = JSON.parse(json);
      expect(obj.x).to.equal(quadtree.boundary.x);
      expect(obj.y).to.equal(quadtree.boundary.y);
      expect(obj.w).to.equal(quadtree.boundary.w);
      expect(obj.h).to.equal(quadtree.boundary.h);
      expect(obj.capacity).to.equal(quadtree.capacity);
      expect(obj.ne.points.length).to.equal(quadtree.northeast.points.length);
      expect(obj.ne.points[0].userData.index).to.equal(quadtree.northeast.points[0].userData.index);
      expect(obj.nw.divided).to.be.undefined;
      expect(obj.se.x).to.be.undefined;
      expect(obj.sw.y).to.be.undefined;
    });
    it('loads properly from a string', () => {
      const json = quadtree.toJSON();
      const test = QuadTree.fromJSON(JSON.parse(json));
      expect(test.boundary.x).to.equal(quadtree.boundary.x);
      expect(test.boundary.y).to.equal(quadtree.boundary.y);
      expect(test.boundary.w).to.equal(quadtree.boundary.w);
      expect(test.boundary.h).to.equal(quadtree.boundary.h);
      expect(test.capacity).to.equal(quadtree.capacity);
      expect(test.northeast.boundary.x).to.equal(quadtree.northeast.boundary.x);
      expect(test.northeast.points[0].userData.index).to.equal(quadtree.northeast.points[0].userData.index);
      expect(test.northwest.divided).to.be.equal(quadtree.northwest.divided);
      expect(test.southeast.x).to.be.equal(quadtree.southeast.x);
      expect(test.southwest.y).to.be.equal(quadtree.southwest.y);
    });
  });
});

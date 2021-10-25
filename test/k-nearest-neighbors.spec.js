const {expect} = require('chai');
const { QuadTree, Rectangle, Point, Circle } = require('../quadtree');

describe('K Nearest Neighbors', () => {
  it('Finds the nearest 4 points', () => {
    const rect = new Rectangle(50, 50, 100, 100);
    let qt = new QuadTree(rect, 4);

    qt.insert(new Point(20, 20));
    qt.insert(new Point(25, 25));
    qt.insert(new Point(30, 30));
    qt.insert(new Point(35, 35));

    const point = new Point(0, 0);

    expect(qt.closest(point, 4, 1000).length).to.equal(4);
    expect(qt.closest(point, 4, 1000)[0].x).to.equal(20);
    expect(qt.closest(point, 1, 1000).length).to.equal(1);
    expect(qt.closest(point, 1, 1000)[0].x).to.equal(20);
  });
  it('Finds the point in range', () => {
    const rect = new Rectangle(50, 50, 100, 100);
    let qt = new QuadTree(rect, 4);

    qt.insert(new Point(35, 35));
    qt.insert(new Point(20, 20));
    qt.insert(new Point(25, 25));
    qt.insert(new Point(30, 30));
    qt.insert(new Point(1, 1));

    const point = new Point(0, 0);

    expect(qt.closest(point, 5, 10).length).to.equal(1);
    expect(qt.closest(point, 5, 10)[0].x).to.equal(1);
  });
  it('Finds all the points', () => {
    const rect = new Rectangle(50, 50, 100, 100);
    let qt = new QuadTree(rect, 4);

    qt.insert(new Point(35, 35));
    qt.insert(new Point(20, 20));
    qt.insert(new Point(25, 25));
    qt.insert(new Point(30, 30));
    qt.insert(new Point(1, 1));

    const point = new Point(0, 0);

    expect(qt.closest(point, 5, 1000).length).to.equal(5);
    expect(qt.closest(point, 5, 1000)[4].x).to.equal(35);
  });
  it('Edge case search', () => {
    const rect = new Rectangle(50, 50, 100, 100);
    let qt = new QuadTree(rect, 4);

    qt.insert(new Point(1, 1));
    qt.insert(new Point(2, 2));
    qt.insert(new Point(3, 3));
    qt.insert(new Point(4, 4));
    qt.insert(new Point(5, 5));
    qt.insert(new Point(49, 49));
    qt.insert(new Point(51, 51));
    qt.insert(new Point(100, 100));

    const point = new Point(6, 6);

    expect(qt.closest(point, 8, 1000).length).to.equal(8);
    expect(qt.closest(point, 8, 1000)[7].x).to.equal(100);
  });
  it('Lots of points', () => {
    const rect = new Rectangle(50, 50, 100, 100);
    let qt = new QuadTree(rect, 100);

    for(var i=0; i<10000; ++i) {
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      qt.insert(new Point(x, y));
    }

    const point = new Point(50, 50);

    expect(qt.closest(point, 10000).length).to.equal(10000);
  });
  it('Even more points', () => {
    const rect = new Rectangle(500, 500, 1000, 1000);
    let qt = new QuadTree(rect, 100);

    for(var i=0; i<100000; ++i) {
      const x = Math.random() * 1000;
      const y = Math.random() * 1000;
      qt.insert(new Point(x, y));
    }

    const point = new Point(500, 500);

    expect(qt.closest(point, 100000).length).to.equal(100000);
  });
  it('Stupid number of points', () => {
    const rect = new Rectangle(500, 500, 1000, 1000);
    let qt = new QuadTree(rect, 100);

    for(var i=0; i<1000000; ++i) {
      const x = Math.random() * 1000;
      const y = Math.random() * 1000;
      qt.insert(new Point(x, y));
    }

    const point = new Point(500, 500);

    expect(qt.closest(point, 10).length).to.equal(10);
  }).timeout(5000); // extend timeout
});

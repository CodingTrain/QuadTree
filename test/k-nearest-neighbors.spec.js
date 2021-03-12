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

    expect(qt.kNearestNeighbors(point, 4, 1000).length).to.equal(4);
    expect(qt.kNearestNeighbors(point, 4, 1000)[0].x).to.equal(20);
    expect(qt.kNearestNeighbors(point, 1, 1000).length).to.equal(1);
    expect(qt.kNearestNeighbors(point, 1, 1000)[0].x).to.equal(20);
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

    expect(qt.kNearestNeighbors(point, 5, 10).length).to.equal(1);
    expect(qt.kNearestNeighbors(point, 5, 10)[0].x).to.equal(1);
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

    expect(qt.kNearestNeighbors(point, 5, 1000).length).to.equal(5);
    expect(qt.kNearestNeighbors(point, 5, 1000)[4].x).to.equal(35);
  });
});

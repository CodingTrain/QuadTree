const {expect} = require('chai');
const { QuadTree, Rectangle, Point } = require('../quadtree');

describe('quadtree merging', () => {
  let tree1;
  let tree2;
  let childTree;
  beforeEach(() => {
    tree1 = new QuadTree(new Rectangle(-30, -20, 10, 8), 5);
    tree2 = new QuadTree(new Rectangle(50, 100, 30, 40), 5);
    [
      new Point(-29, -21),
      new Point(-29, -20),
      new Point(-29, -19),
      new Point(-29, -18),
      new Point(-31, -21),
      new Point(-31, -20),
      new Point(-31, -19),
      new Point(-31, -18)
    ].forEach(point => tree1.insert(point));
    [
      new Point(49, 99),
      new Point(51, 99),
      new Point(49, 101),
      new Point(51, 101),
      new Point(50, 100)
    ].forEach(point => tree2.insert(point));
    childTree = tree1.merge(tree2, 5);
  });
  it('passes capacity to new QuadTree', () => {
    expect(childTree.capacity).to.equal(5);
  });
  it('does not return original quadtree', () => {
    expect(childTree).not.to.equal(tree1);
  });
  it('does not return other quadtree', () => {
    expect(childTree).not.to.equal(tree2);
  });
  it('has the minimal left value', () => {
    expect(childTree.boundary.left).to.equal(Math.min(tree1.boundary.left, tree2.boundary.left));
  });
  it('has the max right value', () => {
    expect(childTree.boundary.right).to.equal(Math.max(tree1.boundary.right, tree2.boundary.right));
  });
  it('has the minimal top value', () => {
    expect(childTree.boundary.top).to.equal(Math.min(tree1.boundary.top, tree2.boundary.top));
  });
  it('has the max bottom value', () => {
    expect(childTree.boundary.bottom).to.equal(Math.max(tree1.boundary.bottom, tree2.boundary.bottom));
  });
  it('has combined length of both trees', () => {
    expect(childTree.length).to.equal(tree1.length + tree2.length);
  });
});
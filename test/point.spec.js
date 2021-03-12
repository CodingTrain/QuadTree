const {expect} = require('chai');
let { Point } = require('../quadtree');

describe('Point', () => {
  it('assigns x on creation', () => {
    let point = new Point(12, 23);
    expect(point.x).to.equal(12);
  });
  it('assigns y on creation', () => {
    let point = new Point(12, 23);
    expect(point.y).to.equal(23);
  });
  it('assigns userData on creation', () => {
    let point = new Point(12,23, 'myData');
    expect(point.userData).to.equal('myData');
  });
  it('calculates distance to point', () => {
    let point = new Point(0, 0);
    let other = new Point(3, 4);
    expect(point.distanceFrom(other)).to.equal(5);
  });
  it('calculates distance to same point as 0', () => {
    let point = new Point(0, 0);
    let other = new Point(0, 0);
    expect(point.distanceFrom(other)).to.equal(0);
  });
  it('calculates distance to point 2', () => {
    let point = new Point(1, 1);
    let other = new Point(0, 0);
    expect(point.distanceFrom(other)).to.equal(Math.SQRT2);
  });
});

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
});
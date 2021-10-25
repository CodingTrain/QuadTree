const {expect} = require('chai');
let { Circle, Point, Rectangle } = require('../quadtree');

describe('Circle', () => {
  describe('on construction', () => {
    it('sets x', () => {
      let circ = new Circle(12, 23, 40);
      expect(circ.x).to.equal(12);
    });
    it('sets y', () => {
      let circ = new Circle(12, 23, 40);
      expect(circ.y).to.equal(23);
    });
    it('sets radius', () => {
      let circ = new Circle(12, 23, 40);
      expect(circ.r).to.equal(40);
    });
    it('sets rSquared', () => {
      let circ = new Circle(12, 23, 40);
      expect(circ.rSquared).to.equal(40 * 40);
    });
  });
  describe('contains', () => {
    let circle;
    let cx = 100;
    let cy = 50;
    let r = 25;
    beforeEach(() => {
      circle = new Circle(cx, cy, r);
    });
    [
      { desc: 'centre', x: cx, y: cy, in: true },
      { desc: 'top', x: cx, y: cy - r, in: true },
      { desc: 'above top', x: cx, y: cy - r - 1, in: false },
      { desc: 'bottom', x: cx, y: cy + r, in: true },
      { desc: 'below bottom', x: cx, y: cy + r + 1, in: false },
      { desc: 'left', x: cx - r, y: cy, in: true },
      { desc: 'outside left', x: cx - r - 1, y: cy, in: false },
      { desc: 'right', x: cx + r, y: cy, in: true },
      { desc: 'outside right', x: cx + r + 1, y: cy, in: false }
    ].forEach(element => {
      it(`returns ${element.in} for ${element.desc} (${element.x}, ${element.y})`, () => {
        expect(circle.contains(element)).to.equal(element.in);
      });
    });
  });
  describe('intersects', () => {
    let circle;
    let cx = 100;
    let cy = 50;
    let r = 25;
    beforeEach(() => {
      circle = new Circle(cx, cy, r);
    });
    it('returns false when entire rectangle is too far away', () => {
      let rect = new Rectangle(1000, 2000, 12, 10);
      expect(circle.intersects(rect)).to.be.false;
    });
    it('returns false when only x on rectangle is out of range', () => {
      let rect = new Rectangle(1000, cy, 12, 10);
      expect(circle.intersects(rect)).to.be.false;
    });
    it('returns false when only y on rectangle is out of range', () => {
      let rect = new Rectangle(cx, 1000, 12, 10);
      expect(circle.intersects(rect)).to.be.false;
    });
    it('returns true when circle encapsulates rectangle', () => {
      let rect = new Rectangle(cx, cy, 12, 10);
      expect(circle.intersects(rect)).to.be.true;
    });
    it('returns true when circle is encapsulated by rectangle', () => {
      let rect = new Rectangle(cx, cy, r * 2, r * 2);
      expect(circle.intersects(rect)).to.be.true;
    });
    it ('returns true when partially inside circle', () => {
      let rect = new Rectangle(cx + 8, 50, 7, 10);
      expect(circle.intersects(rect)).to.be.true;
    });
    it ('returns false when not inside circle but within bounding box', () => {
      let rect = new Rectangle(cx + 24, cy + 24, 1, 1);
      expect(circle.intersects(rect)).to.be.false;
    });
    it ('returns true when just inside circle', () => {
      let rect = new Rectangle(cx + 18, cy + 18, 1, 1);
      expect(circle.intersects(rect)).to.be.true;
    });
  });
});

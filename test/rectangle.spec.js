const {expect} = require('chai');
let { Rectangle, Point } = require('../quadtree');

describe('Rectangle', () => {
  describe('on construction', () => {
    it('sets x', () => {
      let rect = new Rectangle(12, 23, 40, 83);
      expect(rect.x).to.equal(12);
    });
    it('sets y', () => {
      let rect = new Rectangle(12, 23, 40, 83);
      expect(rect.y).to.equal(23);
    });
    it('sets w', () => {
      let rect = new Rectangle(12, 23, 40, 83);
      expect(rect.w).to.equal(40);
    });
    it('sets h', () => {
      let rect = new Rectangle(12, 23, 40, 83);
      expect(rect.h).to.equal(83);
    });
  });
  describe('contains', () => {
    let rect;
    let left;
    let right;
    let top;
    let bottom;
    let cx;
    let cy;
    beforeEach(() => {
      // Left: 25, Right: 75
      // Top: 70, Bottom: 130
      cx = 50;
      cy = 100;
      let w = 25;
      let h = 30;
      rect = new Rectangle(cx, cy, w, h);;
      left = cx - w;
      right = cx + w;
      top = cy - h;
      bottom = cy + h;
    });
    it('returns true when point is in the center', () => {
      let point = new Point(cx, cy);
      expect(rect.contains(point)).to.be.true;
    });
    it('returns true when point on left edge', () => {
      let point = new Point(left, cy);
      expect(rect.contains(point)).to.be.true;
    });
    it('returns true when point inside left edge', () => {
      let point = new Point(left + 1, cy);
      expect(rect.contains(point)).to.be.true;
    });
    it('returns false when point outside left edge', () => {
      let point = new Point(left - 1, cy);
      expect(rect.contains(point)).not.to.be.true;
    });
    it('returns true when point on right edge', () => {
      let point = new Point(right, cy);
      expect(rect.contains(point)).to.be.true;
    });
    it('returns true when point inside right edge', () => {
      let point = new Point(right - 1, cy);
      expect(rect.contains(point)).to.be.true;
    });
    it('returns false when point outside right edge', () => {
      let point = new Point(right + 1, cy);
      expect(rect.contains(point)).not.to.be.true;
    });
    it('returns true when point on top edge', () => {
      let point = new Point(cx, top);
      expect(rect.contains(point)).to.be.true;
    });
    it('returns true when point inside top edge', () => {
      let point = new Point(cx, top + 1);
      expect(rect.contains(point)).to.be.true;
    });
    it('returns false when point outside top edge', () => {
      let point = new Point(cx, top - 1);
      expect(rect.contains(point)).not.to.be.true;
    });
    it('returns true when point on bottom edge', () => {
      let point = new Point(cx, bottom);
      expect(rect.contains(point)).to.be.true;
    });
    it('returns true when point inside bottom edge', () => {
      let point = new Point(cx, bottom - 1);
      expect(rect.contains(point)).to.be.true;
    });
    it('returns false when point outside bottom edge', () => {
      let point = new Point(cx, bottom + 1);
      expect(rect.contains(point)).not.to.be.true;
    });
  });
  describe('intersects', () => {
    let base;
    let cx;
    let cy;
    let w;
    let h;
    let left;
    let right;
    let top;
    let bottom;
    beforeEach(() => {
      cx = 100;
      cy = 200;
      w = 50;
      h = 25;
      left = cx - w;
      right = cx + w;
      top = cy - h;
      bottom = cy + h;
      base = new Rectangle(cx, cy, w, h);
    });
    it('returns true when second rectangle is inside first', () => {
      let test = new Rectangle(cx, cy, w / 2, h / 2);
      expect(base.intersects(test)).to.be.true;
    });
    it('returns true when second rectangle is the same as first', () => {
      let test = new Rectangle(cx, cy, w, h);
      expect(base.intersects(test)).to.be.true;
    });
    it('returns true when second rectangle is the same encapsulates the first', () => {
      let test = new Rectangle(cx, cy, w * 2, h * 2);
      expect(base.intersects(test)).to.be.true;
    });
    it('returns true when edges line up on the left', () => {
      let test = new Rectangle(left - 10, cy, 10, 10);
      expect(base.intersects(test)).to.be.true;
    });
    it('returns false when edges do not line up on the left', () => {
      let test = new Rectangle(left - 10 - 1, cy, 10, 10);
      expect(base.intersects(test)).not.to.be.true;
    });
    it('returns true when edges line up on the right', () => {
      let test = new Rectangle(right + 10, cy, 10, 10);
      expect(base.intersects(test)).to.be.true;
    });
    it('returns false when edges do not line up on the right', () => {
      let test = new Rectangle(right + 10 + 1, cy, 10, 10);
      expect(base.intersects(test)).not.to.be.true;
    });
    it('returns true when edges line up on the top', () => {
      let test = new Rectangle(cx, top - 10, 10, 10);
      expect(base.intersects(test)).to.be.true;
    });
    it('returns false when edges do not line up on the top', () => {
      let test = new Rectangle(cx, top - 10 - 1, 10, 10);
      expect(base.intersects(test)).not.to.be.true;
    });
    it('returns true when edges line up on the bottom', () => {
      let test = new Rectangle(cx, bottom + 10, 10, 10);
      expect(base.intersects(test)).to.be.true;
    });
    it('returns false when edges do not line up on the bottom', () => {
      let test = new Rectangle(cx, bottom + 10 + 1, 10, 10);
      expect(base.intersects(test)).not.to.be.true;
    });
  });
});

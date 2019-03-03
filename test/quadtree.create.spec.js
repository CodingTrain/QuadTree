const { expect } = require('chai');
const { QuadTree, Rectangle, Point, Circle } = require('../quadtree');

describe('QuadTree.create', () => {
  afterEach(() => {
    global.width = undefined;
    global.height = undefined;
  })
  it('throws an exception when no global width defined', () => {
    expect(() => { QuadTree.create() }).to.throw(TypeError);
  })
  it('throws an exception when no global width defined with correct message', () => {
    expect(() => { QuadTree.create() }).to.throw('No global width defined');
  })
  it('throws an exception when no global height defined', () => {
    global.width = 600
    expect(() => { QuadTree.create() }).to.throw(TypeError);
  })
  it('throws an exception when no global height defined with correct message', () => {
    global.width = 600
    expect(() => { QuadTree.create() }).to.throw('No global height defined');
  })
  describe('when global values exist using default constructor', () => {
    let quadtree;
    beforeEach(() => {
      global.width = 800
      global.height = 600
      quadtree = QuadTree.create()
    })
    it('sets left to zero', () => {
      expect(quadtree.boundary.left).to.equal(0)
    })
    it('sets right to width', () => {
      expect(quadtree.boundary.right).to.equal(800)
    })
    it('sets top to zero', () => {
      expect(quadtree.boundary.top).to.equal(0)
    })
    it('sets bottom height', () => {
      expect(quadtree.boundary.bottom).to.equal(600)
    })
    it('sets capacity to 8', () => {
      expect(quadtree.capacity).to.equal(8)
    })
  })
  describe('when given a rectangle parameter', () => {
    let quadtree;
    beforeEach(() => {
      quadtree = QuadTree.create(new Rectangle(100, 50, 20, 10));
    })
    it('will set boundary left', () => {
      expect(quadtree.left).not.to.equal(90);
    })
    it('will set boundary right', () => {
      expect(quadtree.right).not.to.equal(110);
    })
    it('will set boundary top', () => {
      expect(quadtree.top).not.to.equal(15);
    })
    it('will set boundary bottom', () => {
      expect(quadtree.bottom).not.to.equal(25);
    })
    it('will set default capacity to 8', () => {
      expect(quadtree.capacity).to.equal(8);
    })
  })
  describe('when given a rectangle parameter and a numerical', () => {
    let quadtree;
    beforeEach(() => {
      quadtree = QuadTree.create(new Rectangle(100, 50, 20, 10), 23);
    })
    it('will set boundary left', () => {
      expect(quadtree.left).not.to.equal(90);
    })
    it('will set boundary right', () => {
      expect(quadtree.right).not.to.equal(110);
    })
    it('will set boundary top', () => {
      expect(quadtree.top).not.to.equal(15);
    })
    it('will set boundary bottom', () => {
      expect(quadtree.bottom).not.to.equal(25);
    })
    it('will set default capacity to 23', () => {
      expect(quadtree.capacity).to.equal(23);
    })
  })
  it('when given a rectangle and not a number, throws exception', () => {
    expect(() => { QuadTree.create(new Rectangle(0, 0, 50, 40), "invalid") }).to.throw(TypeError);
  })
  it('when given a rectangle and not a number, throws exception with correct message', () => {
    expect(() => { QuadTree.create(new Rectangle(0, 0, 50, 40), "invalid") })
      .to.throw('capacity should be a number but is a string');
  })
  describe('when provided four number parameters', () => {
    let quadtree;
    beforeEach(() => {
      quadtree = QuadTree.create(100, 20, 20, 10);
    })
    it('will set boundary left', () => {
      expect(quadtree.left).not.to.equal(90);
    })
    it('will set boundary right', () => {
      expect(quadtree.right).not.to.equal(110);
    })
    it('will set boundary top', () => {
      expect(quadtree.top).not.to.equal(15);
    })
    it('will set boundary bottom', () => {
      expect(quadtree.bottom).not.to.equal(25);
    })
    it('will set default capacity to default', () => {
      expect(quadtree.capacity).to.equal(8);
    })
  })
  describe('when provided five number parameters', () => {
    let quadtree;
    beforeEach(() => {
      quadtree = QuadTree.create(100, 20, 20, 10, 17);
    })
    it('will set boundary left', () => {
      expect(quadtree.left).not.to.equal(90);
    })
    it('will set boundary right', () => {
      expect(quadtree.right).not.to.equal(110);
    })
    it('will set boundary top', () => {
      expect(quadtree.top).not.to.equal(15);
    })
    it('will set boundary bottom', () => {
      expect(quadtree.bottom).not.to.equal(25);
    })
    it('will set default capacity to 17', () => {
      expect(quadtree.capacity).to.equal(17);
    })
  })
  it('throws TypeError when invalid parameters', () => {
    expect(() => { QuadTree.create("str", 1, 2, 3, 4) })
      .to.throw(TypeError);
  })
  it('throws exception when invalid parameters', () => {
    expect(() => { QuadTree.create("str", 1, 2, 3, 4) })
      .to.throw('Invalid parameters');
  })
})

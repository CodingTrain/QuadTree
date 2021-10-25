const { expect } = require("chai");
const { QuadTree, Point, Rectangle, Circle } = require("../quadtree");

describe("QuadTree.deleteInRange", () => {
  let qt;

  beforeEach(() => {
    qt = new QuadTree(new Rectangle(0, 0, 200, 200), 4);
    qt.insert(new Point(-100, 10));
    qt.insert(new Point(   0, 10));
    qt.insert(new Point( 100, 10));
  });

  it("delete within a Rectangle", () => {
    qt.deleteInRange(new Rectangle(25, 0, 100, 100)); // delete one
    expect(qt.length).to.equal(2);
  });
  it("delete nothing outside Rectangle", () => {
    qt.deleteInRange(new Rectangle(25, 100, 1, 1));
    expect(qt.length).to.equal(3);
  });

  it("delete within a Circle", () => {
    qt.deleteInRange(new Circle(0, 0, 50, 50)); // delete one
    expect(qt.length).to.equal(2);
  });
  it("delete nothing outside Circle", () => {
    qt.deleteInRange(new Circle(25, 100, 1, 1));
    expect(qt.length).to.equal(3);
  });
});

describe("QuadTree.filter", () => {
  beforeEach(() => {
    qt = new QuadTree(new Rectangle(0, 0, 200, 200), 2);
    qt.insert(new Point(-100, 10));
    qt.insert(new Point(   0, 10));
    qt.insert(new Point( 100, 10));
  });

  it("will filter all", () => {
    const filtered = qt.filter((point) => false);
    expect(filtered.length).to.equal(0);
  });
  it("will filter none", () => {
    const filtered = qt.filter((point) => true);
    expect(filtered.length).to.equal(3);
  });
  it("will filter some", () => {
    const filtered = qt.filter((point) => point.x === 0);
    expect(filtered.length).to.equal(1);
  });

  it("does not alter the original", () => {
    const original = qt.toJSON();
    qt.filter((point) => point.x === 0);
    expect(qt.toJSON()).to.deep.equal(original);
  });
});

describe("QuadTree.clear", () => {
  let qt;

  beforeEach(() => {
    qt = new QuadTree(new Rectangle(0, 0, 200, 200), 2);
    qt.insert(new Point(-100, 10));
    qt.insert(new Point(   0, 10));
    qt.insert(new Point( 100, 10));
  });

  it("clears points", () => {
    expect(qt.length).to.equal(3);
    qt.clear();
    expect(qt.length).to.equal(0);
  });

  it("resets division", () => {
    expect(qt.divided).to.be.true;
    qt.clear();
    expect(qt.divided).to.be.false;
  });

  it("keeps working after clear", () => {
    qt.clear();
    qt.insert(new Point(10, 10));
    expect(qt.length).to.equal(1);
  });
});

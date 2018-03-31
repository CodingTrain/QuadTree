// Carla de Beer
// Created: March 2018.
// Processing version of a basic Quad Tree implementation.
// Based on Daniel Shiffman's Coding Train videos:
// https://www.youtube.com/watch?v=OJxEcs0w_kE & https://www.youtube.com/watch?v=QQx_NmCIuCY

QuadTree qtree;

void setup() {
  size(501, 501);
  Rectangle boundary = new Rectangle(width*0.5, height*0.5, 250, 250);
  qtree = new QuadTree(boundary, 4);
  for (int i = 0; i < 300; ++i) {
    float x = random(50, width - 50);
    float y = random(50, height - 50);
    Point p = new Point(x, y);
    qtree.insert(p);
  }
}

void draw() {
  background(0);
  qtree.show();
  stroke(0, 255, 0);
  rectMode(CENTER);
  Rectangle range = new Rectangle(mouseX, mouseY, 25, 25);
  rect(range.x, range.y, range.w * 2, range.h * 2);
  ArrayList<Point> points = new ArrayList<Point>();
  points = qtree.query(range, points);

  strokeWeight(4);
  for (Point p : points) {
    point(p.x, p.y);
  }
}

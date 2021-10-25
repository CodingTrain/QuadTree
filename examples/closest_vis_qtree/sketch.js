let qtree;
let searchedQuads = [];

function setup() {
    createCanvas(600, 600);

    rectMode(CENTER);

    qtree = QuadTree.create();

    for (let i = 0; i < 1000; i++) {
        let p = new Point(
            Math.round(Math.random() * width),
            Math.round(Math.random() * height),
            {
                searched: false,
                closest: false,
            }
        );
        qtree.insert(p);
    }

    console.log(qtree);
}

function draw() {
    background("#0e141f");

    noFill();
    stroke("#273445");
    drawQuads(qtree);

    stroke("#a56de2");
    for (let quad of searchedQuads) {
        rect(quad.x, quad.y, quad.w, quad.h);
    }

    noStroke();
    qtree.forEach((p) => {
        fill("#95a3ab");
        if (p.userData.searched) {
            fill("#ffa154");
        }
        if (p.userData.closest) {
            fill("#68b723");
        }

        rect(p.x, p.y, 6, 6);
    });
}

function drawQuads(tree) {
    rect(tree.boundary.x, tree.boundary.y, tree.boundary.w, tree.boundary.h);
    tree.children.map(drawQuads);
}

function kNearest(tree, searchPoint, maxCount = 1, maxDistance = Infinity, furthestDistance = 0, foundSoFar = 0) {
    if (typeof searchPoint === "undefined") {
        throw TypeError("Method 'closest' needs a point");
    }

    let found = [];

    tree.children.sort((a, b) => a.boundary.distanceFrom(searchPoint) - b.boundary.distanceFrom(searchPoint))
        .forEach((child) => {
            const distance = child.boundary.distanceFrom(searchPoint);
            if (distance > maxDistance) {
                return;
            } else if (foundSoFar < maxCount || distance < furthestDistance) {
                const result = kNearest(child, searchPoint, maxCount, maxDistance, furthestDistance, foundSoFar);
                searchedQuads.push(child.boundary);
                const childPoints = result.found;
                found = found.concat(childPoints);
                foundSoFar += childPoints.length;
                furthestDistance = result.furthestDistance;
            }
        });

    tree.points.sort((a, b) => a.distanceFrom(searchPoint) - b.distanceFrom(searchPoint))
        .forEach((p) => {
            const distance = p.distanceFrom(searchPoint);
            p.userData.searched = true;
            if (distance > maxDistance) {
                return;
            } else if (foundSoFar < maxCount || distance < furthestDistance) {
                found.push(p);
                furthestDistance = max(distance, furthestDistance);
                foundSoFar++;
            }
        });

    return {
        found: found.sort((a, b) => a.distanceFrom(searchPoint) - b.distanceFrom(searchPoint)).slice(0, maxCount),
        furthestDistance
    };
}

function mousePressed() {
    searchedQuads = [];
    qtree.forEach((p) => {
        p.userData = {
            searched: false,
            closest: false,
        };
    });
    let mp = new Point(mouseX, mouseY);
    let closest = kNearest(qtree, mp).found;
    closest.forEach((p) => {
        p.userData.closest = true;
    });
}

A QuadTree example (and almost sort of a JavaScript library) with [p5.js](http://p5js.org).

## QuadTree
* [QuadTree on wikipedia](https://en.wikipedia.org/wiki/Quadtree)
* [QuadTree pseudo-code](https://en.wikipedia.org/wiki/Quadtree#Pseudo_code)
* [QuadTree video tutorial 1](https://thecodingtrain.com/CodingChallenges/098.1-quadtree.html)
* [QuadTree video tutorial 2](https://thecodingtrain.com/CodingChallenges/098.2-quadtree.html)
* [QuadTree video tutorial 3](https://thecodingtrain.com/CodingChallenges/098.3-quadtree.html)

## How to use
* You can download and include `quadtree.js` in your p5 sketch or refer to it via this CDN link:

```html
<script src="https://cdn.jsdelivr.net/gh/CodingTrain/QuadTree/quadtree.js"></script>
```

Once you've include the library you can create a `QuadTree` object a `Rectangle` boundary and maximum capacity:

```javascript
const r = new Rectangle(0, 0, width, height);
const capacity = 4;
const quadtree = new QuadTree(r, capacity);
```

## Testing
To run tests use one of the following commands

For continuous testing
```
npm run test-watch
```

For a single run test, with coverage
```
npm run test
```
This will output to the `coverage` folder where you can few test coverage by opening index.html

## Other QuadTree libraries in JS
* [quadtree-js](https://github.com/timohausmann/quadtree-js)
* [d3-quadtree](https://github.com/d3/d3-quadtree)

## Other Versions

### Ports to other languages
 * Carla de Beer (Processing port) - [GitHub](https://github.com/Carla-de-Beer/Processing/tree/master/QuadTree)
 * Alix Poulsen (Kit port) - [Github](https://github.com/AlexPoulsen/tree)

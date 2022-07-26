// Import stylesheets
import { Point } from './PointInterface';
import './style.css';

// Write TypeScript code!
const appDiv: HTMLElement = document.getElementById('app');
appDiv.innerHTML = `<canvas id="canvas"></canvas>`;

var canvas = document.getElementById('canvas') as HTMLCanvasElement | null;

canvas.width = 500;
canvas.height = 500;

var ctx = canvas.getContext('2d');

const poly: Point[] = [
  { x: 200, y: 200 },
  { x: 350, y: 50 },
  { x: 500, y: 200 },
  { x: 450, y: 450 },
  { x: 250, y: 450 },
];

var bullet = { x: poly[0].x, y: poly[0].y };

const draw = function () {
  ctx.fillStyle = '#FFFF';
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillRect(bullet.x - 2, bullet.y - 2, 4, 4);

  ctx.globalCompositeOperation = 'destination-over';
  ctx.fillStyle = 'rgb(63, 63, 63)';
  ctx.strokeStyle = 'rgb(173, 172, 172)';

  ctx.beginPath();
  for (let index = 0; index < poly.length; index++) {
    if (index === 0) {
      ctx.moveTo(poly[index].x, poly[index].y);
    }
    ctx.lineTo(poly[index].x, poly[index].y);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
};

function closestPointInPolygon(poly: Point[], pos: Point): Point {
  var coordinates: any[] = [];

  for (let i = 0; i < poly.length; i++) {
    const data = getAllCoordinates(poly[i], poly[i + 1] ?? poly[0]);
    coordinates.push(...data);
  }

  if (inside({ x: pos.x, y: pos.y }, coordinates)) {
    return {
      x: pos.x,
      y: pos.y,
    };
  }

  const { x, y } = coordinates
    .map((coordinate) => {
      let y = pos.x - coordinate[0];
      let x = pos.y - coordinate[1];

      return {
        distance: Math.sqrt(x * x + y * y),
        x: coordinate[0],
        y: coordinate[1],
      };
    })
    .sort(function (a, b) {
      return a.distance - b.distance;
    })[0];

  return { x, y };
}

canvas.addEventListener('mousemove', function (e) {
  var cRect = canvas.getBoundingClientRect();
  var canvasX = Math.round(e.clientX - cRect.left);
  var canvasY = Math.round(e.clientY - cRect.top);

  const closestPint = closestPointInPolygon(poly, { x: canvasX, y: canvasY });
  bullet = closestPint;
  draw();
});

function getAllCoordinates(A: Point, B: Point) {
  function slope(a: Point, b: Point) {
    if (a.x == b.x) {
      return null;
    }

    return (b.y - a.y) / (b.x - a.x);
  }

  function intercept(point: Point, slope: number | null) {
    if (slope === null) {
      return point.x;
    }
    return point.y - slope * point.x;
  }

  var m = slope(A, B);
  var b = intercept(A, m);

  var coordinates = [];

  if (A.x > B.x) {
    for (var x = A.x; x >= B.x; x--) {
      var y = m * x + b;
      coordinates.push([x, y]);
    }
  } else if (A.x == B.x && A.y < B.y) {
    for (var x = B.y; x >= A.y; x--) {
      var y = m * x + b;
      coordinates.push([y, x]);
    }
  } else if (A.x == B.x) {
    for (var x = A.y; x >= B.y; x--) {
      var y = m * x + b;
      coordinates.push([y, x]);
    }
  } else {
    for (var x = A.x; x <= B.x; x++) {
      var y = m * x + b;
      coordinates.push([x, y]);
    }
  }
  return coordinates;
}

function inside(point: Point, vs: any[]) {
  // ray-casting algorithm based on
  // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html/pnpoly.html

  var x = point.x;
  var y = point.y;

  var inside = false;
  for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    var xi = vs[i][0],
      yi = vs[i][1];
    var xj = vs[j][0],
      yj = vs[j][1];

    var intersect =
      yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

draw();

// Import stylesheets
import './style.css';

// Write TypeScript code!
const appDiv: HTMLElement = document.getElementById('app');
appDiv.innerHTML = `<canvas id="canvas"></canvas>`;

var canvas = document.getElementById('canvas') as HTMLCanvasElement | null;

canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;

var ctx = canvas.getContext('2d');

const points = [
  { x: 10, y: 10 },
  { x: 200, y: 10 },
  { x: 200, y: 200 },
  { x: 10, y: 200 },
];

var coordinates = [];

for (let i = 0; i < points.length; i++) {
  const data = getAllCoordinates(points[i], points[i + 1] ?? points[0]);
  coordinates.push(...data);
}

var bullet = [points[0].x, points[0].y];

const draw = function () {
  ctx.fillStyle = '#FFFF';
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillRect(bullet[0] - 2, bullet[1] - 2, 4, 4);

  ctx.globalCompositeOperation = 'destination-over';
  ctx.fillStyle = 'rgb(63, 63, 63)';
  ctx.strokeStyle = 'rgb(173, 172, 172)';

  ctx.beginPath();
  for (let index = 0; index < points.length; index++) {
    if (index === 0) {
      ctx.moveTo(points[index].x, points[index].y);
    }
    ctx.lineTo(points[index].x, points[index].y);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
};

canvas.addEventListener('mousemove', function (e) {
  var cRect = canvas.getBoundingClientRect();
  var canvasX = Math.round(e.clientX - cRect.left);
  var canvasY = Math.round(e.clientY - cRect.top);
  const closestPint = coordinates
    .map((ax) => {
      let y = canvasX - ax[0];
      let x = canvasY - ax[1];

      return {
        distance: Math.sqrt(x * x + y * y),
        x: ax[0],
        y: ax[1],
      };
    })
    .sort(function (a, b) {
      return a.distance - b.distance;
    });
  bullet = [closestPint[0].x, closestPint[0].y];
  draw();
});

function getAllCoordinates(A, B) {
  function slope(a, b) {
    if (a.x == b.x) {
      return null;
    }

    return (b.y - a.y) / (b.x - a.x);
  }

  function intercept(point, slope) {
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

draw();

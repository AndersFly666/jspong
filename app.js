class Vector {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
}

class Rect {
  constructor(w, h) {
    this.pos = new Vector;
    this.size = new Vector(w, h);
  }
}

class Ball extends Rect {
  constructor() {
    super(10, 10);
    this.velocity = new Vector;
  }
}

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const ball = new Ball;
ball.pos.x = 100;
ball.pos.y = 50;

ball.velocity.x = 100;
ball.velocity.y = 100;

let lastTime;

function callback(milliseconds) {
  if (lastTime) {
    update((milliseconds - lastTime) / 1000);
  }
  lastTime = milliseconds;
  requestAnimationFrame(callback);
}

function update(dt) {
  ball.pos.x += ball.velocity.x * dt;
  ball.pos.y += ball.velocity.y * dt;

  if (ball.pos.x < 0 || ball.pos.x > canvas.width) {
    ball.velocity.x = -ball.velocity.x;
  }
  if (ball.pos.y < 0 || ball.pos.y > canvas.height) {
    ball.velocity.y = -ball.velocity.y;
  }

  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#fff';
  ctx.fillRect(ball.pos.x, ball.pos.y, ball.size.x, ball.size.y);
}

callback();
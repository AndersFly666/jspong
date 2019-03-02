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

function update(dt) {
  ball.pos.x += ball.velocity.x * dt;
  ball.pos.y += ball.velocity.y * dt;

  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#fff';
  ctx.fillRect(ball.pos.x, ball.pos.y, ball.size.x, ball.size.y);
}
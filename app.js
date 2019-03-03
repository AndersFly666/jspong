class Vector {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
}

class Rect {
  constructor(w, h) {
    this.pos = new Vector();
    this.size = new Vector(w, h);
  }

  get left() {
    return this.pos.x - this.size.x / 2;
  }

  get right() {
    return this.pos.x + this.size.x / 2;
  }

  get top() {
    return this.pos.y - this.size.y / 2;
  }

  get bottom() {
    return this.pos.y + this.size.y / 2;
  }
}

class Ball extends Rect {
  constructor() {
    super(10, 10);
    this.velocity = new Vector();
  }
}

class Player extends Rect {
  constructor() {
    super(20, 100);
    this.score = 0;
  }
}

class Pong {
  constructor(canvas) {
    this._canvas = canvas;
    this._context = canvas.getContext('2d');

    this.ball = new Ball();
    this.ball.pos.x = 100;
    this.ball.pos.y = 50;

    this.ball.velocity.x = 100;
    this.ball.velocity.y = 100;

    this.players = [
      new Player(),
      new Player()
    ];

    this.players[0].pos.x = 40;
    this.players[1].pos.x = this._canvas.width - 40;
    this.players.forEach(player => {
      player.pos.y = this._canvas.height / 2;
    })

    let lastTime;
    const callback = (milliseconds) => {
      if (lastTime) {
        this.update((milliseconds - lastTime) / 1000);
      }
      lastTime = milliseconds;
      requestAnimationFrame(callback);
    };
    callback();
  }

  collide(player, ball) {
    if (player.left < ball.right && player.right > ball.left && 
        player.top < ball.bottom && player.bottom > ball.top) {
          ball.velocity.x = -ball.velocity.x;
        }
  }

  draw() {
    this._context.fillStyle = '#000';
    this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);
    
    this.drawRect(this.ball);
    this.players.forEach(player => this.drawRect(player));
  }

  drawRect(rect) {
    this._context.fillStyle = '#fff';
    this._context.fillRect( rect.left, rect.top,
                            rect.size.x, rect.size.y );
  }

  update(dt) {
    this.ball.pos.x += this.ball.velocity.x * dt;
    this.ball.pos.y += this.ball.velocity.y * dt;
  
    if (this.ball.left < 0 || this.ball.right > this._canvas.width) {
      this.ball.velocity.x = -this.ball.velocity.x;
    }
    if (this.ball.top < 0 || this.ball.bottom > this._canvas.height) {
      this.ball.velocity.y = -this.ball.velocity.y;
    }

    this.players[1].pos.y = this.ball.pos.y;

    this.players.forEach(player => this.collide(player, this.ball));
  
    this.draw();   
  }
}

const canvas = document.getElementById('canvas');
const pong = new Pong(canvas);

canvas.addEventListener('mousemove', event => {
  pong.players[0].pos.y = event.offsetY;
})
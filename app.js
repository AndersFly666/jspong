class Vector {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  get len() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  set len(value) {
    const fact = value / this.len;
    this.x *= fact;
    this.y *= fact;
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

    this.CHAR_PIXEL = 10;
    this.CHARS = [
      '111101101101111',
      '010010010010010',
      '111001111100111',
      '111001111001111',
      '101101111001001',
      '111100111001111',
      '111100111101111',
      '111100001001001',
      '111101111101111',
      '111101111001111',
    ].map(str => {
      const canvas = document.createElement('canvas');
      canvas.width = 3 * this.CHAR_PIXEL;
      canvas.height = 5 * this.CHAR_PIXEL;
      const context = canvas.getContext('2d');
      context.fillStyle = '#fff';
      str.split('').forEach((fill, i) => {
        if (fill === '1') {
          context.fillRect( (i % 3) * this.CHAR_PIXEL, 
                            (i / 3 | 0) * this.CHAR_PIXEL,
                            this.CHAR_PIXEL,
                            this.CHAR_PIXEL);
        }
      });
      return canvas;
    });

    this.reset();
  }

  collide(player, ball) {
    if (player.left < ball.right && player.right > ball.left && 
        player.top < ball.bottom && player.bottom > ball.top) {
        const len = ball.velocity.len;
        ball.velocity.x = -ball.velocity.x;
        ball.velocity.y += 300 * (Math.random() - 0.5);
        ball.velocity.len = len * 1.05;
  }
  }

  draw() {
    this._context.fillStyle = '#000';
    this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);
    
    this.drawRect(this.ball);
    this.players.forEach(player => this.drawRect(player));

    this.drawScore();
  }

  drawRect(rect) {
    this._context.fillStyle = '#fff';
    this._context.fillRect( rect.left, rect.top,
                            rect.size.x, rect.size.y );
  }

  drawScore() {
    const align = this._canvas.width / 3;
    const CHAR_W = this.CHAR_PIXEL * 4;
    this.players.forEach((player, i) => {
      const chars = player.score.toString().split('');
      const offset = align * (i + 1) - (CHAR_W * chars.length / 2) + this.CHAR_PIXEL / 2;
      chars.forEach((char, pos) => {
        this._context.drawImage(this.CHARS[char|0],
                                offset + pos * CHAR_W, 20);
      })
    });
  }

  update(dt) {
    this.ball.pos.x += this.ball.velocity.x * dt;
    this.ball.pos.y += this.ball.velocity.y * dt;
  
    if (this.ball.left < 0 || this.ball.right > this._canvas.width) {
      const playerId = this.ball.velocity.x < 0 ? 1 : 0;
      this.players[playerId].score++;
      this.reset();
    }
    if (this.ball.top < 0 || this.ball.bottom > this._canvas.height) {
      this.ball.velocity.y = -this.ball.velocity.y;
    }

    this.players[1].pos.y = this.ball.pos.y;

    this.players.forEach(player => this.collide(player, this.ball));
  
    this.draw();   
  }

  reset() {
    this.ball.pos.x = this._canvas.width / 2;
    this.ball.pos.y = this._canvas.height / 2;

    this.ball.velocity.x = 0;
    this.ball.velocity.y = 0;
  }

  start() {
    if (this.ball.velocity.x === 0 && this.ball.velocity.y === 0) {
      this.ball.velocity.x = 300 * (Math.random() > 0.5 ? 1 : -1);
      this.ball.velocity.y = 300 * (Math.random() * 2 - 1);
      this.ball.velocity.len = 200;
    }
  }
}

const canvas = document.getElementById('canvas');
const pong = new Pong(canvas);

canvas.addEventListener('mousemove', event => {
  const scale = event.offsetY / event.target.getBoundingClientRect().height;
  pong.players[0].pos.y = canvas.height * scale;
});

canvas.addEventListener('click', event => {
  pong.start();
});

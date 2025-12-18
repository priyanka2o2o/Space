const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;

window.addEventListener("resize", () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
});

let mouse = { x: canvas.width / 2, y: canvas.height - 60 };
canvas.addEventListener("mousemove", e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});
canvas.addEventListener("touchmove", e => {
  mouse.x = e.touches[0].clientX;
  mouse.y = e.touches[0].clientY;
});

// Images
const playerImg = new Image();
playerImg.src = "https://image.ibb.co/dfbD1U/heroShip.png";

const enemyImg = new Image();
enemyImg.src = "https://i.ibb.co/0YgHvmx/enemy-fotor-20230927153748.png";

// Game state
let bullets = [];
let enemies = [];
let stars = [];
let score = 0;
let health = 100;
let gameRunning = true;

// Stars (parallax)
for (let i = 0; i < 100; i++) {
  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    speed: Math.random() * 2 + 0.5
  });
}

class Player {
  draw() {
    c.drawImage(playerImg, mouse.x - 16, mouse.y - 16, 32, 32);
  }
}

class Bullet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = 10;
  }
  update() {
    this.y -= this.speed;
    c.fillStyle = "cyan";
    c.fillRect(this.x, this.y, 4, 10);
  }
}

class Enemy {
  constructor() {
    this.x = Math.random() * (canvas.width - 32);
    this.y = -32;
    this.speed = Math.random() * 2 + 1;
  }
  update() {
    this.y += this.speed;
    c.drawImage(enemyImg, this.x, this.y, 32, 32);
  }
}

// Fire bullets
setInterval(() => {
  if (gameRunning && bullets.length < 8) {
    bullets.push(new Bullet(mouse.x, mouse.y - 20));
  }
}, 200);

// Spawn enemies
setInterval(() => {
  if (gameRunning) enemies.push(new Enemy());
}, 1000);

const player = new Player();

function collision(a, b) {
  return (
    a.x < b.x + 32 &&
    a.x + 32 > b.x &&
    a.y < b.y + 32 &&
    a.y + 32 > b.y
  );
}

function drawHealthBar() {
  c.fillStyle = "red";
  c.fillRect(20, 20, 200, 10);
  c.fillStyle = "lime";
  c.fillRect(20, 20, 2 * health, 10);
}

function animate() {
  if (!gameRunning) return;
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);

  // Stars
  c.fillStyle = "white";
  stars.forEach(s => {
    s.y += s.speed;
    if (s.y > canvas.height) s.y = 0;
    c.fillRect(s.x, s.y, 2, 2);
  });

  // UI
  c.fillStyle = "white";
  c.font = "18px Arial";
  c.fillText("Score: " + score, canvas.width - 120, 30);
  drawHealthBar();

  player.draw();

  bullets.forEach((b, bi) => {
    b.update();
    if (b.y < 0) bullets.splice(bi, 1);
  });

  enemies.forEach((e, ei) => {
    e.update();
    if (e.y > canvas.height) {
      enemies.splice(ei, 1);
      health -= 10;
    }

    bullets.forEach((b, bi) => {
      if (collision({ x: b.x, y: b.y }, e)) {
        enemies.splice(ei, 1);
        bullets.splice(bi, 1);
        score++;
      }
    });
  });

  if (health <= 0) {
    gameRunning = false;
    document.getElementById("gameOver").style.display = "flex";
    document.getElementById("finalScore").innerText =
      "Your Score: " + score;
  }
}

animate();

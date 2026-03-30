const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const startBtn = document.getElementById("startBtn");
const scoreText = document.getElementById("scoreText");
const ui = document.getElementById("ui");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let player, obstacles, stars, score, running;

// Initialize game
function init() {
  player = {
    x: 100,
    y: canvas.height / 2,
    size: 15,
    dy: 0,
    gravity: 0.5
  };

  obstacles = [];
  stars = [];
  score = 0;
  running = true;

  for (let i = 0; i < 120; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2
    });
  }
}

// Spawn obstacles
function spawnObstacle() {
  if (!running) return;

  let gap = 150;
  let topHeight = Math.random() * (canvas.height - gap);

  obstacles.push({
    x: canvas.width,
    width: 40,
    top: topHeight,
    bottom: topHeight + gap
  });

  setTimeout(spawnObstacle, 1200);
}

// Game loop
function update() {
  if (!running) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Stars
  ctx.fillStyle = "white";
  stars.forEach(star => {
    star.x -= 0.5;
    if (star.x < 0) star.x = canvas.width;
    ctx.fillRect(star.x, star.y, star.size, star.size);
  });

  // Player
  player.dy += player.gravity;
  player.y += player.dy;

  ctx.fillStyle = "cyan";
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.size, 0, Math.PI * 2);
  ctx.fill();

  // Obstacles
  ctx.fillStyle = "red";
  obstacles.forEach((obs, index) => {
    obs.x -= 5;

    // Top block
    ctx.fillRect(obs.x, 0, obs.width, obs.top);

    // Bottom block
    ctx.fillRect(obs.x, obs.bottom, obs.width, canvas.height);

    // Collision
    if (
      player.x + player.size > obs.x &&
      player.x - player.size < obs.x + obs.width &&
      (player.y - player.size < obs.top ||
        player.y + player.size > obs.bottom)
    ) {
      gameOver();
    }

    // Score
    if (obs.x + obs.width < player.x && !obs.passed) {
      obs.passed = true;
      score++;
      scoreText.innerText = "Score: " + score;
    }

    // Remove
    if (obs.x < -obs.width) {
      obstacles.splice(index, 1);
    }
  });

  requestAnimationFrame(update);
}

// Jump
function jump() {
  if (!running) return;
  player.dy = -8;
}

// Game Over
function gameOver() {
  running = false;
  ui.style.display = "block";
  startBtn.innerText = "Restart";
}

// Start game
startBtn.onclick = () => {
  ui.style.display = "none";
  init();
  spawnObstacle();
  update();
};

// Controls
window.addEventListener("keydown", jump);
window.addEventListener("touchstart", jump);

// Resize
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

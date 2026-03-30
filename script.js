const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Player
let player = {
  x: 100,
  y: canvas.height / 2,
  size: 20,
  dy: 0,
  gravity: 0.5,
  color: "cyan"
};

// Obstacles
let obstacles = [];
let score = 0;

// Stars (for better graphics)
let stars = [];
for (let i = 0; i < 100; i++) {
  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 2
  });
}

// Spawn obstacles
function spawnObstacle() {
  let height = Math.random() * (canvas.height - 150) + 50;
  obstacles.push({
    x: canvas.width,
    y: height,
    width: 20,
    height: 100
  });
}
setInterval(spawnObstacle, 1500);

// Game loop
function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw stars (background animation)
  ctx.fillStyle = "white";
  stars.forEach(star => {
    star.x -= 0.5;
    if (star.x < 0) star.x = canvas.width;
    ctx.fillRect(star.x, star.y, star.size, star.size);
  });

  // Player physics
  player.dy += player.gravity;
  player.y += player.dy;

  // Draw player (glow effect)
  ctx.shadowBlur = 20;
  ctx.shadowColor = player.color;
  ctx.fillStyle = player.color;
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.size, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // Obstacles
  ctx.fillStyle = "red";
  obstacles.forEach((obs, index) => {
    obs.x -= 6;
    ctx.fillRect(obs.x, obs.y, obs.width, obs.height);

    // Collision
    if (
      player.x + player.size > obs.x &&
      player.x - player.size < obs.x + obs.width &&
      player.y + player.size > obs.y &&
      player.y - player.size < obs.y + obs.height
    ) {
      alert("Game Over! Score: " + score);
      location.reload();
    }

    // Remove off screen
    if (obs.x < -obs.width) {
      obstacles.splice(index, 1);
      score++;
    }
  });

  // Score
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 20, 30);

  requestAnimationFrame(update);
}
update();

// Controls
function jump() {
  player.dy = -10;
}

window.addEventListener("keydown", jump);
window.addEventListener("touchstart", jump);

// Resize handling
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

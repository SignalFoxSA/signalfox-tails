/* SignalFox Tails — shared star field.
   ONE file, loaded by every screen: 600 twinkling stars + shooting stars.
   Screen HTML only needs: <canvas id="starCanvas"></canvas>
   and <script src="../js/stars.js"></script> as the last element in .phone */
(function () {
  const canvas = document.getElementById('starCanvas');
  if (!canvas) return;
  const phone = canvas.parentElement;
  const ctx = canvas.getContext('2d');
  canvas.width = phone.offsetWidth;
  canvas.height = phone.offsetHeight;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const stars = Array.from({ length: 600 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.4 + 0.3,
    alpha: Math.random(),
    speed: Math.random() * 0.008 + 0.002,
    dir: Math.random() > 0.5 ? 1 : -1
  }));

  const shootingStars = [];
  function spawnShooting() {
    shootingStars.push({
      x: Math.random() * canvas.width * 0.7,
      y: Math.random() * canvas.height * 0.4,
      len: Math.random() * 80 + 60,
      speed: Math.random() * 6 + 5,
      alpha: 1,
      angle: Math.PI / 5
    });
  }

  let animFrame;
  function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => {
      s.alpha += s.speed * s.dir;
      if (s.alpha >= 1 || s.alpha <= 0.1) s.dir *= -1;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${s.alpha})`;
      ctx.fill();
    });
    for (let i = shootingStars.length - 1; i >= 0; i--) {
      const ss = shootingStars[i];
      const grad = ctx.createLinearGradient(ss.x, ss.y,
        ss.x - Math.cos(ss.angle) * ss.len, ss.y - Math.sin(ss.angle) * ss.len);
      grad.addColorStop(0, `rgba(255,248,200,${ss.alpha})`);
      grad.addColorStop(1, 'rgba(255,248,200,0)');
      ctx.beginPath();
      ctx.moveTo(ss.x, ss.y);
      ctx.lineTo(ss.x - Math.cos(ss.angle) * ss.len, ss.y - Math.sin(ss.angle) * ss.len);
      ctx.strokeStyle = grad; ctx.lineWidth = 1.5; ctx.stroke();
      ss.x += Math.cos(ss.angle) * ss.speed;
      ss.y += Math.sin(ss.angle) * ss.speed;
      ss.alpha -= 0.018;
      if (ss.alpha <= 0) shootingStars.splice(i, 1);
    }
    animFrame = requestAnimationFrame(drawStars);
  }

  if (reduceMotion) {
    // Draw one static field, no animation.
    stars.forEach(s => {
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${Math.max(s.alpha, 0.25)})`;
      ctx.fill();
    });
    return;
  }

  for (let i = 0; i < 5; i++) setTimeout(spawnShooting, i * 1800);
  setInterval(spawnShooting, 3000);
  drawStars();

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(animFrame);
    else animFrame = requestAnimationFrame(drawStars);
  });
})();

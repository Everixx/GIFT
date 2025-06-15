document.addEventListener('DOMContentLoaded', () => {
  const surpriseContainer = document.querySelector('.surprise-container');
  const audio = document.getElementById('bgMusic');
  const body = document.body;
  const canvas = document.getElementById("fireworks");
  const ctx = canvas.getContext("2d");

  // Inisialisasi musik
  audio.volume = 0.3;

  // Set ukuran canvas fireworks
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Klik memulai animasi
  surpriseContainer.addEventListener('click', () => {
    surpriseContainer.classList.add('hidden');
    body.classList.remove('not-loaded');
    body.classList.add('loaded');

    audio.play().then(() => {
      startFireworks();
    }).catch(() => {
      surpriseContainer.innerHTML = `<h1 style="color:#ff0000">Klik lagi untuk memulai</h1>`;
    });
  }, { once: true });

  // Fallback jika tidak diklik dalam 5 detik
  setTimeout(() => {
    if (body.classList.contains('not-loaded')) {
      surpriseContainer.style.display = 'none';
      body.classList.remove('not-loaded');
      body.classList.add('loaded');
    }
  }, 5000);

  // Fungsi kembang api
  function startFireworks() {
    let fireworks = [];

    function random(min, max) {
      return Math.random() * (max - min) + min;
    }

    function createFirework() {
      const x = random(100, canvas.width - 100);
      const y = random(50, canvas.height / 2);
      const count = random(30, 50);
      const firework = [];

      for (let i = 0; i < count; i++) {
        firework.push({
          x: x,
          y: y,
          angle: random(0, Math.PI * 2),
          speed: random(2, 6),
          radius: 0,
          alpha: 1,
          color: `hsl(${random(0, 360)}, 100%, 70%)`
        });
      }

      fireworks.push(firework);
    }

    function update() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      fireworks.forEach((firework, i) => {
        firework.forEach(particle => {
          particle.radius += particle.speed;
          particle.alpha -= 0.01;
          const x = particle.x + Math.cos(particle.angle) * particle.radius;
          const y = particle.y + Math.sin(particle.angle) * particle.radius;

          ctx.globalAlpha = particle.alpha;
          ctx.beginPath();
          ctx.arc(x, y, 2, 0, Math.PI * 2);
          ctx.fillStyle = particle.color;
          ctx.fill();
        });

        if (firework[0].alpha <= 0) {
          fireworks.splice(i, 1);
        }
      });

      requestAnimationFrame(update);
    }

    setInterval(createFirework, 800);
    update();
  }
});

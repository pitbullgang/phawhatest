document.addEventListener("DOMContentLoaded", async () => {
  // 🎨 1. Load Settings (Theme & Music)
  try {
    const response = await fetch("settings.json");
    if (response.ok) { // เพิ่มการเช็คว่าโหลดไฟล์สำเร็จไหม
      const settings = await response.json();
      const theme = settings.theme;

      if (theme) {
        const themeProps = {
          "--gradient-start": theme.gradientStart,
          "--gradient-end": theme.gradientEnd,
          "--circle-color": theme.circleColor,
          "--button-gradient-start": theme.buttonGradientStart,
          "--button-gradient-end": theme.buttonGradientEnd,
          "--button-text-color": theme.buttonTextColor,
          "--font": theme.fontFamily
        };
        Object.entries(themeProps).forEach(([k, v]) => {
          if (v) document.documentElement.style.setProperty(k, v);
        });
      }

      // 🎵 ระบบเพลง: รองรับทั้งหน้า Home และหน้า Person
      const music = document.getElementById("bg-music") || document.getElementById("list-music");
      if (music) {
        if (settings.backgroundMusic) music.src = settings.backgroundMusic;
        music.volume = 0.4;

        document.addEventListener("keydown", e => {
          if (e.code === "Space") {
            e.preventDefault(); // กันหน้าจอเลื่อนเวลาเล่นเพลง
            music.paused ? music.play() : music.pause();
          }
        });
      }
    }
  } catch (error) {
    console.log("Settings skip:", error.message);
  }

  // ⏳ 2. Loading Screen
  const loading = document.getElementById("loading-screen");
  if (loading) {
    setTimeout(() => loading.classList.add("hidden"), 1000);
  }

  // 💀 3. SKULL EFFECT (รันเฉพาะหน้าที่มี Canvas)
  const canvas = document.getElementById("particleCanvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let animationFrame;

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    const skulls = Array.from({ length: 20 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      speedY: Math.random() * 0.5 + 0.3,
      speedX: Math.random() * 0.2 - 0.1,
      opacity: Math.random() * 0.2 + 0.1,
      rotation: Math.random() * Math.PI * 2,
      spin: Math.random() * 0.02 - 0.01
    }));

    function drawSkulls() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = "18px serif";
      ctx.textAlign = "center";
      
      skulls.forEach(s => {
        ctx.save();
        ctx.globalAlpha = s.opacity;
        ctx.translate(s.x, s.y);
        ctx.rotate(s.rotation);
        ctx.fillText("💀", 0, 0);
        ctx.restore();

        s.y += s.speedY;
        s.x += s.speedX;
        s.rotation += s.spin;

        if (s.y > canvas.height + 50) {
          s.y = -50;
          s.x = Math.random() * canvas.width;
        }
      });
      animationFrame = requestAnimationFrame(drawSkulls);
    }
    drawSkulls();
  }

  // 🔘 4. Navigation
  document.getElementById("memberBtn")?.addEventListener("click", () => {
    window.location.href = "person.html";
  });
});

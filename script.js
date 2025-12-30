// นำเข้า Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// --- 1. Firebase Configuration (ใช้ค่าที่คุณได้มา) ---
const firebaseConfig = {
    apiKey: "AIzaSyCvkv6CsE1PFela50dXSTG0P26spzdXuOE",
    authDomain: "phawhalogin.firebaseapp.com",
    projectId: "phawhalogin",
    storageBucket: "phawhalogin.firebasestorage.app",
    messagingSenderId: "502924655668",
    appId: "1:502924655668:web:e120839a6adab245869e61",
    measurementId: "G-2KBDHJ3Z3W"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", async () => {
  // 🎨 1. Load Settings (Theme & Music) - เหมือนเดิมของคุณ
  try {
    const response = await fetch("settings.json");
    if (response.ok) {
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

      const music = document.getElementById("bg-music") || document.getElementById("list-music");
      if (music) {
        if (settings.backgroundMusic) {
            if (!music.src.includes(settings.backgroundMusic)) {
                music.src = settings.backgroundMusic;
            }
        }
        music.volume = 0.4;
        const playMusic = () => {
            music.play().then(() => {
                sessionStorage.setItem("musicPaused", "false");
            }).catch(err => console.log("Autoplay blocked..."));
        };
        if (sessionStorage.getItem("musicPaused") !== "true") {
            playMusic();
        }
        document.addEventListener("keydown", e => {
          if (e.code === "Space") {
            e.preventDefault();
            if (music.paused) { playMusic(); } else {
              music.pause();
              sessionStorage.setItem("musicPaused", "true");
            }
          }
        });
        document.addEventListener('click', () => {
            if (sessionStorage.getItem("musicPaused") !== "true") { playMusic(); }
        }, { once: true });
      }
    }
  } catch (error) {
    console.log("Settings skip:", error.message);
  }

  // 🔥 ฟังก์ชันใหม่: ดึงรูปจาก Firebase มาอัปเดตในหน้าเว็บ
  async function syncFirebaseImages() {
    try {
        const querySnapshot = await getDocs(collection(db, "users"));
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const username = doc.id; // เช่น "ken"
            
            // หา element รูปภาพที่มี ID ตรงกับ username (เช่น id="img-ken")
            const userImg = document.getElementById(`img-${username}`);
            if (userImg && data.profileImg) {
                userImg.src = data.profileImg;
                // ถ้ามีข้อมูลกรอบรูป (frame) ก็สั่งเปลี่ยนตรงนี้ได้เลย
                if (data.frameColor) {
                    userImg.style.borderColor = data.frameColor;
                }
            }
        });
    } catch (e) { console.log("Firebase sync failed:", e); }
  }

  // เรียกใช้ฟังก์ชันดึงรูปหลังจากหน้ารายชื่อโหลดเสร็จ (คุณอาจต้องเรียกในฟังก์ชันที่สร้างการ์ดสมาชิก)
  setTimeout(syncFirebaseImages, 2000); // ตั้งหน่วงเวลาไว้เล็กน้อยเพื่อให้รายชื่อโหลดเสร็จก่อน

  // ⏳ 2. Loading Screen - เหมือนเดิม
  const loading = document.getElementById("loading-screen");
  if (loading) {
    setTimeout(() => loading.classList.add("hidden"), 1000);
  }

  // 💀 3. SKULL EFFECT - เหมือนเดิม
  const canvas = document.getElementById("particleCanvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    function resizeCanvas() {
      canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    const skulls = Array.from({ length: 20 }, () => ({
      x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight,
      speedY: Math.random() * 0.5 + 0.3, speedX: Math.random() * 0.2 - 0.1,
      opacity: Math.random() * 0.2 + 0.1, rotation: Math.random() * Math.PI * 2,
      spin: Math.random() * 0.02 - 0.01
    }));
    function drawSkulls() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = "18px serif"; ctx.textAlign = "center";
      skulls.forEach(s => {
        ctx.save(); ctx.globalAlpha = s.opacity; ctx.translate(s.x, s.y); ctx.rotate(s.rotation);
        ctx.fillText("💀", 0, 0); ctx.restore();
        s.y += s.speedY; s.x += s.speedX; s.rotation += s.spin;
        if (s.y > canvas.height + 50) { s.y = -50; s.x = Math.random() * canvas.width; }
      });
      requestAnimationFrame(drawSkulls);
    }
    drawSkulls();
  }

  // 🔘 4. Navigation
  document.getElementById("memberBtn")?.addEventListener("click", () => {
    window.location.href = "person.html";
  });
});

(function () {
  "use strict";

  /* ---------- read personalization config ---------- */
  const cfg = document.getElementById("config").dataset;
  document.querySelectorAll("#friend-name-hero, #friend-name-letter").forEach((el) => {
    el.textContent = cfg.friendName;
  });
  document.getElementById("your-name-sign").textContent = cfg.yourName;
  document.getElementById("letter-body").textContent = cfg.letter;
  document.title = "Happy Birthday, " + cfg.friendName + "!";

  /* ---------- floating hearts / petals background ---------- */
  const floaterLayer = document.getElementById("floaters");
  const SYMBOLS = ["♥", "❀", "✿"];
  const FLOATER_COUNT = window.innerWidth < 600 ? 14 : 24;

  for (let i = 0; i < FLOATER_COUNT; i++) {
    const span = document.createElement("span");
    span.className = "floater";
    span.textContent = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
    const size = 12 + Math.random() * 22;
    const left = Math.random() * 100;
    const duration = 9 + Math.random() * 10;
    const delay = Math.random() * 10;
    const hueColors = ["#D46A85", "#C9A227", "#B84F6C", "#E4C766"];
    span.style.left = left + "vw";
    span.style.fontSize = size + "px";
    span.style.color = hueColors[i % hueColors.length];
    span.style.animationDuration = duration + "s";
    span.style.animationDelay = "-" + delay + "s";
    floaterLayer.appendChild(span);
  }

  /* ---------- hero scroll cue ---------- */
  document.getElementById("scroll-cue").addEventListener("click", () => {
    document.getElementById("gift-section").scrollIntoView({ behavior: "smooth" });
  });

  /* ---------- gift box -> polaroid reveal ---------- */
  const giftBox = document.getElementById("gift-box");
  const polaroid = document.getElementById("polaroid");
  let giftOpened = false;

  giftBox.addEventListener("click", () => {
    if (giftOpened) return;
    giftOpened = true;
    giftBox.classList.add("opened");
    setTimeout(() => {
      polaroid.classList.add("shown");
      burstConfetti(giftBox.getBoundingClientRect());
    }, 350);
  });

  /* ---------- envelope open/close ---------- */
  const envelope = document.getElementById("envelope");
  envelope.addEventListener("click", () => {
    envelope.classList.toggle("opened");
  });
  envelope.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      envelope.classList.toggle("opened");
    }
  });
  envelope.setAttribute("tabindex", "0");
  envelope.setAttribute("role", "button");
  envelope.setAttribute("aria-label", "Open the letter");

  /* ---------- wishes wall ---------- */
  const wishForm = document.getElementById("wish-form");
  const wishWall = document.getElementById("wish-wall");
  const wishStatus = document.getElementById("wish-status");

  function renderWishes(wishes) {
    wishWall.innerHTML = "";
    if (!wishes.length) {
      const empty = document.createElement("p");
      empty.className = "wish-empty";
      empty.textContent = "No wishes yet — be the first to leave one!";
      wishWall.appendChild(empty);
      return;
    }
    wishes
      .slice()
      .reverse()
      .forEach((w, i) => {
        const card = document.createElement("div");
        card.className = "wish-card";
        card.style.animationDelay = Math.min(i * 0.05, 0.5) + "s";

        const msg = document.createElement("p");
        msg.textContent = w.message;

        const meta = document.createElement("p");
        meta.className = "wish-meta";
        const nameSpan = document.createElement("span");
        nameSpan.textContent = w.name;
        const timeSpan = document.createElement("span");
        timeSpan.textContent = w.timestamp || "";
        meta.appendChild(nameSpan);
        meta.appendChild(timeSpan);

        card.appendChild(msg);
        card.appendChild(meta);
        wishWall.appendChild(card);
      });
  }

  async function loadWishes() {
    try {
      const res = await fetch("/api/wishes");
      const wishes = await res.json();
      renderWishes(wishes);
    } catch (err) {
      wishWall.innerHTML = '<p class="wish-empty">Couldn\'t load wishes right now.</p>';
    }
  }

  wishForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("wish-name").value.trim();
    const message = document.getElementById("wish-message").value.trim();
    if (!message) return;

    wishStatus.textContent = "Sending...";
    try {
      const res = await fetch("/api/wishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      wishStatus.textContent = "Wish sent! 💌";
      wishForm.reset();
      await loadWishes();
      setTimeout(() => (wishStatus.textContent = ""), 3000);
    } catch (err) {
      wishStatus.textContent = err.message || "Couldn't send that — try again.";
    }
  });

  loadWishes();

  /* ---------- confetti ---------- */
  const canvas = document.getElementById("confetti-canvas");
  const ctx = canvas.getContext("2d");
  let confettiPieces = [];
  let confettiRunning = false;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  const CONFETTI_COLORS = ["#D46A85", "#C9A227", "#B84F6C", "#E4C766", "#7A2439"];

  function burstConfetti(originRect) {
    const originX = originRect ? originRect.left + originRect.width / 2 : window.innerWidth / 2;
    const originY = originRect ? originRect.top + originRect.height / 2 : window.innerHeight / 3;

    for (let i = 0; i < 90; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 6;
      confettiPieces.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        size: 5 + Math.random() * 6,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        life: 0,
        maxLife: 90 + Math.random() * 40,
      });
    }
    if (!confettiRunning) {
      confettiRunning = true;
      requestAnimationFrame(animateConfetti);
    }
  }

  function animateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    confettiPieces.forEach((p) => {
      p.vy += 0.12;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotationSpeed;
      p.life++;

      const alpha = Math.max(0, 1 - p.life / p.maxLife);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      ctx.restore();
    });

    confettiPieces = confettiPieces.filter((p) => p.life < p.maxLife);

    if (confettiPieces.length > 0) {
      requestAnimationFrame(animateConfetti);
    } else {
      confettiRunning = false;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  document.getElementById("confetti-btn").addEventListener("click", () => {
    burstConfetti({ left: window.innerWidth / 2 - 10, top: window.innerHeight - 140, width: 20, height: 20 });
  });

  /* a gentle welcome burst */
  setTimeout(() => burstConfetti({ left: window.innerWidth / 2 - 10, top: 40, width: 20, height: 20 }), 900);
})();

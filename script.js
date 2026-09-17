const SITE = {
  name: "cat wif hat",
  symbol: "catwif",
  twitter: "https://x.com/catwifhat_meme",
  contract: "",
  pumpswap: "https://swap.pump.fun",
  dexscreenerBase: "https://dexscreener.com/solana",
};

function pairUrl() {
  return SITE.contract
    ? `${SITE.dexscreenerBase}/${SITE.contract}`
    : SITE.dexscreenerBase;
}

function buyUrl() {
  if (!SITE.contract) return SITE.pumpswap;
  return `${SITE.pumpswap}/?input=So11111111111111111111111111111111111111112&output=${SITE.contract}`;
}

function applyLinks() {
  const dex = pairUrl();
  const buy = buyUrl();

  document.querySelectorAll("[data-dex]").forEach((el) => {
    el.setAttribute("href", dex);
  });
  document.querySelectorAll("[data-pumpswap]").forEach((el) => {
    el.setAttribute("href", buy);
  });

  const embed = document.getElementById("dex-embed");
  if (embed) {
    embed.src = `${dex}?embed=1&theme=light&trades=0&info=0`;
  }

  const ca = document.getElementById("ca-value");
  if (ca) ca.textContent = SITE.contract || "TBA";
}

function bindCopy() {
  const btn = document.getElementById("copy-ca");
  if (!btn) return;
  btn.addEventListener("click", async () => {
    const value = SITE.contract || "TBA";
    try {
      await navigator.clipboard.writeText(value);
    } catch (_) {
      const probe = document.createElement("textarea");
      probe.value = value;
      document.body.appendChild(probe);
      probe.select();
      document.execCommand("copy");
      probe.remove();
    }
    btn.textContent = "copied";
    btn.classList.add("is-copied");
    window.setTimeout(() => {
      btn.textContent = "copy";
      btn.classList.remove("is-copied");
    }, 1600);
  });
}

function bindNav() {
  const toggle = document.getElementById("nav-toggle");
  const links = document.querySelectorAll(".nav a");
  const sections = ["hero", "about", "howtobuy", "chart", "joinus"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  if (toggle) {
    toggle.addEventListener("click", () => {
      const open = document.body.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
  }

  links.forEach((link) => {
    link.addEventListener("click", () => {
      document.body.classList.remove("nav-open");
      if (toggle) toggle.setAttribute("aria-expanded", "false");
    });
  });

  const sync = () => {
    const y = window.scrollY + 120;
    let current = "hero";
    sections.forEach((section) => {
      if (section.offsetTop <= y) current = section.id;
    });
    links.forEach((link) => {
      link.classList.toggle("is-on", link.getAttribute("href") === `#${current}`);
    });
  };

  window.addEventListener("scroll", sync, { passive: true });
  sync();
}

function paintYarn() {
  const canvas = document.getElementById("yarn-field");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const strands = [];
  const colors = ["rgba(224,122,154,0.22)", "rgba(224,155,74,0.16)", "rgba(196,93,120,0.14)"];

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  const seed = () => {
    strands.length = 0;
    for (let i = 0; i < 9; i += 1) {
      strands.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        amp: 40 + Math.random() * 70,
        len: 180 + Math.random() * 220,
        speed: 0.15 + Math.random() * 0.25,
        phase: Math.random() * Math.PI * 2,
        color: colors[i % colors.length],
        width: 1.2 + Math.random() * 1.6,
      });
    }
  };

  let tick = 0;
  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    tick += 1;
    strands.forEach((s) => {
      ctx.beginPath();
      ctx.strokeStyle = s.color;
      ctx.lineWidth = s.width;
      ctx.lineCap = "round";
      const originX = s.x + Math.sin(tick * 0.004 + s.phase) * 24;
      const originY = (s.y + tick * s.speed) % (canvas.height + s.len) - s.len * 0.4;
      ctx.moveTo(originX, originY);
      ctx.bezierCurveTo(
        originX + s.amp,
        originY + s.len * 0.33,
        originX - s.amp,
        originY + s.len * 0.66,
        originX,
        originY + s.len
      );
      ctx.stroke();
    });
    requestAnimationFrame(draw);
  };

  resize();
  seed();
  draw();
  window.addEventListener("resize", () => {
    resize();
    seed();
  });
}

function revealOnScroll() {
  const nodes = document.querySelectorAll("[data-reveal]");
  if (!("IntersectionObserver" in window)) {
    nodes.forEach((node) => node.classList.add("is-in"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -40px 0px" }
  );
  nodes.forEach((node) => io.observe(node));
}

applyLinks();
bindCopy();
bindNav();
revealOnScroll();
paintYarn();

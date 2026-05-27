const header = document.querySelector("[data-header]");
const menuButton = document.querySelector("[data-menu-button]");
const mobileNav = document.querySelector("[data-mobile-nav]");
const filterButtons = document.querySelectorAll("[data-filter]");
const ordinanceCards = document.querySelectorAll("[data-category]");

const updateHeader = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 24);
};

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

menuButton.addEventListener("click", () => {
  mobileNav.classList.toggle("is-open");
});

mobileNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => mobileNav.classList.remove("is-open"));
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const category = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    ordinanceCards.forEach((card) => {
      const shouldShow = category === "all" || card.dataset.category === category;
      card.classList.toggle("is-hidden", !shouldShow);
    });
  });
});

const canvas = document.querySelector("[data-network-canvas]");
const context = canvas.getContext("2d");
let width = 0;
let height = 0;
let points = [];

const resizeCanvas = () => {
  const ratio = window.devicePixelRatio || 1;
  width = canvas.offsetWidth;
  height = canvas.offsetHeight;
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);

  const count = Math.max(28, Math.floor(width / 34));
  points = Array.from({ length: count }, (_, index) => ({
    x: (index / count) * width + Math.random() * 80,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.28,
    vy: (Math.random() - 0.5) * 0.28,
    size: Math.random() * 2 + 1,
  }));
};

const drawNetwork = () => {
  context.clearRect(0, 0, width, height);

  points.forEach((point) => {
    point.x += point.vx;
    point.y += point.vy;

    if (point.x < -20) point.x = width + 20;
    if (point.x > width + 20) point.x = -20;
    if (point.y < -20) point.y = height + 20;
    if (point.y > height + 20) point.y = -20;
  });

  points.forEach((point, index) => {
    for (let nextIndex = index + 1; nextIndex < points.length; nextIndex += 1) {
      const next = points[nextIndex];
      const distance = Math.hypot(point.x - next.x, point.y - next.y);

      if (distance < 150) {
        context.strokeStyle = `rgba(255, 255, 255, ${0.16 * (1 - distance / 150)})`;
        context.lineWidth = 1;
        context.beginPath();
        context.moveTo(point.x, point.y);
        context.lineTo(next.x, next.y);
        context.stroke();
      }
    }
  });

  points.forEach((point, index) => {
    context.fillStyle = index % 5 === 0 ? "rgba(255, 107, 53, 0.82)" : "rgba(255, 255, 255, 0.72)";
    context.beginPath();
    context.arc(point.x, point.y, point.size, 0, Math.PI * 2);
    context.fill();
  });

  requestAnimationFrame(drawNetwork);
};

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
drawNetwork();

function createStars(containerId, count, maxTopPercent) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const fragment = document.createDocumentFragment();

  for (let i = 0; i < count; i++) {
    const star = document.createElement("div");
    star.className = "star";

    const size = 1 + Math.random() * 1.4;
    star.style.width = size + "px";
    star.style.height = size + "px";

    const left = Math.random() * 100;
    const top = Math.random() * maxTopPercent;

    star.style.left = left + "%";
    star.style.top = top + "%";

    const opacity = 0.3 + Math.random() * 0.7;
    star.style.opacity = opacity.toString();

    const duration = 4 + Math.random() * 6;
    const delay = Math.random() * 4;
    star.style.animationDuration = duration + "s";
    star.style.animationDelay = delay + "s";

    fragment.appendChild(star);
  }

  container.appendChild(fragment);
}

function initCursorTrail() {
  const DOT_COUNT = 6; 
  const dots = [];
  const positions = [];
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let mouseActive = false;

  for (let i = 0; i < DOT_COUNT; i++) {
    const dot = document.createElement("div");
    dot.className = "cursor-dot";
    document.body.appendChild(dot);

    dots.push(dot);
    positions.push({ x: mouseX, y: mouseY });
  }

  function handleMove(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
    mouseActive = true;
  }

  function handleLeave() {
    mouseActive = false;
  }

  window.addEventListener("mousemove", handleMove);
  window.addEventListener("mouseleave", handleLeave);

  function animate() {
    positions[0].x += (mouseX - positions[0].x) * 0.35;
    positions[0].y += (mouseY - positions[0].y) * 0.35;

    for (let i = 1; i < DOT_COUNT; i++) {
      positions[i].x += (positions[i - 1].x - positions[i].x) * 0.4;
      positions[i].y += (positions[i - 1].y - positions[i].y) * 0.4;
    }

    for (let i = 0; i < DOT_COUNT; i++) {
      const dot = dots[i];
      const pos = positions[i];

      const t = 1 - i / DOT_COUNT; 
      const scale = 0.6 + t * 0.6; 
      const opacity = mouseActive ? 0.2 + t * 0.6 : 0;

      dot.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) scale(${scale})`;
      dot.style.opacity = opacity.toString();
    }

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}

function initPlanets() {
  const sky = document.querySelector(".sky");
  const infoPanel = document.getElementById("info-panel");
  const infoTitle = document.getElementById("info-title");
  const infoBody = document.getElementById("info-body");
  const infoClose = document.getElementById("info-close");
  const planets = Array.from(document.querySelectorAll(".planet"));

  if (!sky || !infoPanel || !infoTitle || !infoBody || !infoClose) return;

  let openPlanet = null;

  function positionInfoPanel(planet) {
    const planetRect = planet.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const placeRight = planetRect.left < viewportWidth / 2;

    const panelWidth = infoPanel.offsetWidth || 320;
    const horizontalMargin = 24;

    let left = placeRight
      ? planetRect.right + horizontalMargin
      : planetRect.left - panelWidth - horizontalMargin;
    left = Math.max(16, Math.min(left, viewportWidth - panelWidth - 16));

    const centerY = planetRect.top + planetRect.height / 2;
    let top = centerY;

    const minTop = 24;
    const maxTop = viewportHeight - 24;
    top = Math.max(minTop, Math.min(top, maxTop));

    infoPanel.style.left = left + "px";
    infoPanel.style.top = top + "px";
  }

  function openInfoForPlanet(planet) {
    const title = planet.dataset.title || "";
    const contentNode = planet.querySelector(".planet-info-content");
    const bodyHtml = contentNode ? contentNode.innerHTML : "";

    infoTitle.textContent = title;
    infoBody.innerHTML = bodyHtml;

    infoPanel.classList.add("info-panel--visible");
    planets.forEach((p) => p.classList.remove("planet--info-open"));
    planet.classList.add("planet--info-open");
    openPlanet = planet;

    requestAnimationFrame(() => {
      positionInfoPanel(planet);
    });
  }

  function closeInfoPanel() {
    infoPanel.classList.remove("info-panel--visible");
    planets.forEach((p) => p.classList.remove("planet--info-open"));
    openPlanet = null;
  }

  planets.forEach((planet) => {
    planet.addEventListener("click", (event) => {
      event.stopPropagation();
      if (
        openPlanet === planet &&
        infoPanel.classList.contains("info-panel--visible")
      ) {
        closeInfoPanel();
      } else {
        openInfoForPlanet(planet);
      }
    });
  });

  infoClose.addEventListener("click", (event) => {
    event.stopPropagation();
    closeInfoPanel();
  });

  sky.addEventListener("click", (event) => {
    if (!infoPanel.contains(event.target)) {
      closeInfoPanel();
    }
  });

  window.addEventListener("resize", () => {
    if (openPlanet && infoPanel.classList.contains("info-panel--visible")) {
      positionInfoPanel(openPlanet);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  createStars("stars-layer-1", 70, 42);
  createStars("stars-layer-2", 40, 55);
  initCursorTrail();
  initPlanets();
});

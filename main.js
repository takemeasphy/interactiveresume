function createStars(containerId, count, maxTopPercent) {
  const container = document.getElementById(containerId);
  const frag = document.createDocumentFragment();

  for (let i = 0; i < count; i++) {
    const star = document.createElement('div');
    star.className = 'star';

    const size = 1 + Math.random() * 1.4;
    star.style.width = size + 'px';
    star.style.height = size + 'px';

    const left = Math.random() * 100;
    const top = Math.random() * maxTopPercent;

    star.style.left = left + '%';
    star.style.top = top + '%';

    star.style.opacity = (0.4 + Math.random() * 0.6).toFixed(2);

    const duration = 2 + Math.random() * 4;
    const delay = Math.random() * 6;

    star.style.animationDuration = duration.toFixed(2) + 's';
    star.style.animationDelay = delay.toFixed(2) + 's';

    frag.appendChild(star);
  }

  container.appendChild(frag);
}

createStars('stars-layer-1', 70, 42);
createStars('stars-layer-2', 40, 55);

const trailLength = 1;
const DOT_SIZE = 16;
const dots = [];
const positionsCursor = [];

for (let i = 0; i < trailLength; i++) {
  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  document.body.appendChild(dot);
  dots.push(dot);
  positionsCursor.push({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
}

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let mouseActive = false;

window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  mouseActive = true;
});

window.addEventListener('mouseleave', () => {
  mouseActive = false;
  dots.forEach(dot => dot.style.opacity = '0');
});

function animateTrail() {
  positionsCursor[0].x = mouseX;
  positionsCursor[0].y = mouseY;

  for (let i = 1; i < trailLength; i++) {
    const prev = positionsCursor[i - 1];
    const curr = positionsCursor[i];
    const lerpFactor = 0.2;
    curr.x += (prev.x - curr.x) * lerpFactor;
    curr.y += (prev.y - curr.y) * lerpFactor;
  }

  for (let i = 0; i < trailLength; i++) {
    const dot = dots[i];
    const pos = positionsCursor[i];

    const scale = 1 - i * 0.035;
    const opacity = mouseActive ? (1 - i * 0.055) : 0;
    const half = DOT_SIZE / 2;

    dot.style.left = (pos.x - half) + 'px';
    dot.style.top = (pos.y - half) + 'px';
    dot.style.transform = `scale(${scale})`;
    dot.style.opacity = opacity.toFixed(2);
  }

  requestAnimationFrame(animateTrail);
}

requestAnimationFrame(animateTrail);

const sky = document.querySelector('.sky');
const infoPanel = document.getElementById('info-panel');
const infoTitle = document.getElementById('info-title');
const infoBody = document.getElementById('info-body');
const infoClose = document.getElementById('info-close');
const planets = Array.from(document.querySelectorAll('.planet'));

function openInfoForPlanet(planet) {
  const title = planet.dataset.title || '';
  const contentNode = planet.querySelector('.planet-info-content');
  const bodyHtml = contentNode ? contentNode.innerHTML : '';

  infoTitle.textContent = title;
  infoBody.innerHTML = bodyHtml;

  const planetRect = planet.getBoundingClientRect();
  const skyRect = sky.getBoundingClientRect();

  const isTouch = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;

  if (isTouch) {
    infoPanel.style.position = 'fixed';
    infoPanel.style.left = '50%';
    infoPanel.style.top = '50%';
    infoPanel.style.transform = 'translate(-50%, -50%)';
    infoPanel.style.maxWidth = 'min(90vw, 360px)';
    infoPanel.style.width = '90vw';
    infoPanel.style.maxHeight = '80vh';
    infoPanel.style.overflowY = 'auto';
    infoPanel.style.webkitOverflowScrolling = 'touch';
  } else {
    const approxWidth = 340;
    let left = planetRect.left - skyRect.left + planetRect.width + 24;
    let top = planetRect.top - skyRect.top + planetRect.height / 2;

    if (left + approxWidth > skyRect.width - 16) {
      left = planetRect.left - skyRect.left - approxWidth - 24;
      if (left < 16) left = 16;
    }

    infoPanel.style.position = 'absolute';
    infoPanel.style.left = left + 'px';
    infoPanel.style.top = top + 'px';

    infoPanel.style.transform = '';
    infoPanel.style.maxWidth = '';
    infoPanel.style.width = '';
  }

  planets.forEach(p => p.classList.remove('planet--info-open'));
  planet.classList.add('planet--info-open');

  infoPanel.classList.add('info-panel--visible');
}


function closeInfoPanel() {
  infoPanel.classList.remove('info-panel--visible');
  planets.forEach(p => p.classList.remove('planet--info-open'));
}

planets.forEach(planet => {
  planet.addEventListener('click', (e) => {
    e.stopPropagation();
    openInfoForPlanet(planet);
  });
});

infoClose.addEventListener('click', (e) => {
  e.stopPropagation();
  closeInfoPanel();
});

sky.addEventListener('click', (e) => {
  if (!e.target.closest('.planet') && !infoPanel.contains(e.target)) {
    closeInfoPanel();
  }
});

window.addEventListener('resize', () => {
  if (!infoPanel.classList.contains('info-panel--visible')) return;
  const openPlanet = planets.find(p => p.classList.contains('planet--info-open'));
  if (openPlanet) {
    openInfoForPlanet(openPlanet);
  }
});
document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;

  let currentLang = body.classList.contains('lang-en') ? 'en' : 'uk';

  function createStars(containerId, count, maxTopPercent) {
    const container = document.getElementById(containerId);
    if (!container) return;

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

  const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;

  if (!isCoarsePointer) {
    const cursor = document.createElement('div');
    cursor.className = 'cursor-dot';
    document.body.appendChild(cursor);

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;
    let active = false;

    window.addEventListener('mousemove', (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      active = true;
      cursor.style.opacity = '1';
    });

    window.addEventListener('mouseleave', () => {
      active = false;
    });

    function animateCursor() {
      const speed = 0.35;
      currentX += (targetX - currentX) * speed;
      currentY += (targetY - currentY) * speed;

      const size = 14;
      cursor.style.transform = `translate(${currentX - size / 2}px, ${currentY - size / 2}px)`;

      if (!active) {
        const currentOpacity = parseFloat(cursor.style.opacity || '0');
        const next = Math.max(currentOpacity - 0.02, 0);
        cursor.style.opacity = String(next);
      }

      requestAnimationFrame(animateCursor);
    }

    requestAnimationFrame(animateCursor);
  }

  const sky = document.querySelector('.sky');
  const infoPanel = document.getElementById('info-panel');
  const infoTitle = document.getElementById('info-title');
  const infoBody = document.getElementById('info-body');
  const infoClose = document.getElementById('info-close');
  const planets = Array.from(document.querySelectorAll('.planet'));

  function openInfoForPlanet(planet) {
    const langKey = currentLang === 'uk' ? 'titleUk' : 'titleEn';
    const title = planet.dataset[langKey] || '';

    const contentNode = planet.querySelector(
      `.planet-info-content[data-lang="${currentLang}"]`
    );
    const bodyHtml = contentNode ? contentNode.innerHTML : '';

    infoTitle.textContent = title;
    infoBody.innerHTML = bodyHtml;

    const planetRect = planet.getBoundingClientRect();
    const skyRect = sky.getBoundingClientRect();

    const approxWidth = 340;
    let left = planetRect.left - skyRect.left + planetRect.width + 24;
    let top = planetRect.top - skyRect.top + planetRect.height / 2;

    if (left + approxWidth > skyRect.width - 16) {
      left = planetRect.left - skyRect.left - approxWidth - 24;
      if (left < 16) left = 16;
    }

    infoPanel.style.left = `${left}px`;
    infoPanel.style.top = `${top}px`;

    planets.forEach((p) => p.classList.remove('planet--info-open'));
    planet.classList.add('planet--info-open');

    infoPanel.classList.add('info-panel--visible');
  }

  function closeInfoPanel() {
    infoPanel.classList.remove('info-panel--visible');
    planets.forEach((p) => p.classList.remove('planet--info-open'));
  }

  planets.forEach((planet) => {
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
    const openPlanet = planets.find((p) => p.classList.contains('planet--info-open'));
    if (openPlanet) {
      openInfoForPlanet(openPlanet);
    }
  });

  const langButtons = document.querySelectorAll('.lang-btn');

  function setLanguage(lang) {
    if (lang !== 'uk' && lang !== 'en') return;

    currentLang = lang;
    body.classList.remove('lang-uk', 'lang-en');
    body.classList.add(`lang-${lang}`);

    langButtons.forEach((btn) => {
      btn.classList.toggle('lang-btn--active', btn.dataset.lang === lang);
    });

    const openPlanet = planets.find((p) => p.classList.contains('planet--info-open'));
    if (openPlanet && infoPanel.classList.contains('info-panel--visible')) {
      openInfoForPlanet(openPlanet);
    }
  }

  langButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const lang = btn.dataset.lang;
      if (lang && lang !== currentLang) {
        setLanguage(lang);
      }
    });
  });

  setLanguage(currentLang);
});

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

document.addEventListener('DOMContentLoaded', () => {
  createStars('stars-layer-1', 70, 42);
  createStars('stars-layer-2', 40, 55);

  setupLanguageSwitch();
  setupInfoPanels();
});

function setupLanguageSwitch() {
  const buttons = Array.from(document.querySelectorAll('.lang-btn'));
  let currentLang = document.body.classList.contains('lang-en') ? 'en' : 'uk';

  function applyLang(lang) {
    currentLang = lang;

    document.body.classList.toggle('lang-uk', lang === 'uk');
    document.body.classList.toggle('lang-en', lang === 'en');
    document.documentElement.lang = lang === 'uk' ? 'uk' : 'en';

    buttons.forEach(btn => {
      const isActive = btn.dataset.lang === lang;
      btn.classList.toggle('lang-btn--active', isActive);
      btn.setAttribute('aria-pressed', String(isActive));
    });

    const openPlanet = document.querySelector('.planet.planet--info-open');
    if (openPlanet) {
      openInfoForPlanet(openPlanet, lang);
    }
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;
      if (!lang || lang === currentLang) return;
      applyLang(lang);
    });
  });

  applyLang(currentLang);
}

function setupInfoPanels() {
  const sky = document.querySelector('.sky');
  const infoPanel = document.getElementById('info-panel');
  const infoTitle = document.getElementById('info-title');
  const infoBody = document.getElementById('info-body');
  const infoClose = document.getElementById('info-close');
  const planets = Array.from(document.querySelectorAll('.planet'));

  if (!sky || !infoPanel || !infoTitle || !infoBody) return;

  function getCurrentLang() {
    return document.body.classList.contains('lang-en') ? 'en' : 'uk';
  }

  window.openInfoForPlanet = function (planet, forcedLang) {
    const lang = forcedLang || getCurrentLang();

    const title =
      lang === 'uk'
        ? planet.dataset.titleUk || ''
        : planet.dataset.titleEn || '';

    const contentNode = planet.querySelector(
      `.planet-info-content[data-lang="${lang}"]`
    );
    const bodyHtml = contentNode ? contentNode.innerHTML : '';

    infoTitle.textContent = title;
    infoBody.innerHTML = bodyHtml;

    const planetRect = planet.getBoundingClientRect();
    const skyRect = sky.getBoundingClientRect();

    const approxWidth = Math.min(340, skyRect.width - 32);
    let left = planetRect.left - skyRect.left + planetRect.width + 24;
    let top = planetRect.top - skyRect.top + planetRect.height / 2;

    if (left + approxWidth > skyRect.width - 16) {
      left = planetRect.left - skyRect.left - approxWidth - 24;
      if (left < 16) left = 16;
    }

    infoPanel.style.left = left + 'px';
    infoPanel.style.top = top + 'px';

    planets.forEach(p => p.classList.remove('planet--info-open'));
    planet.classList.add('planet--info-open');

    infoPanel.classList.add('info-panel--visible');
  };

  function closeInfoPanel() {
    infoPanel.classList.remove('info-panel--visible');
    planets.forEach(p => p.classList.remove('planet--info-open'));
  }

  planets.forEach(planet => {
    planet.addEventListener('click', e => {
      e.stopPropagation();
      openInfoForPlanet(planet);
    });
  });

  infoClose.addEventListener('click', e => {
    e.stopPropagation();
    closeInfoPanel();
  });

  sky.addEventListener('click', e => {
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
}

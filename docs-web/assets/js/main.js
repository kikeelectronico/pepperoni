// Modo oscuro
(function () {
  var root = document.documentElement;

  // Modo claro / oscuro
  var themeBtn = document.querySelector('.theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  }

  // Menú lateral en móvil
  var sideBtn = document.querySelector('.sidebar-toggle');
  if (sideBtn) {
    sideBtn.addEventListener('click', function () {
      var open = root.classList.toggle('sidebar-open');
      sideBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      sideBtn.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    });
  }

  // Pestañas: se construyen a partir de los paneles
  document.querySelectorAll('.tabs').forEach(function (tabs, n) {
    var panels = Array.prototype.slice.call(tabs.querySelectorAll(':scope > .tab-panel'));
    if (!panels.length) return;

    var list = document.createElement('div');
    list.className = 'tab-list';
    list.setAttribute('role', 'tablist');

    var buttons = panels.map(function (panel, i) {
      var id = 'tab-' + n + '-' + i;
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.id = id;
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-controls', id + '-panel');
      btn.textContent = panel.getAttribute('data-label');
      panel.id = id + '-panel';
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', id);
      btn.addEventListener('click', function () { select(i); });
      btn.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight') { select((i + 1) % panels.length, true); e.preventDefault(); }
        if (e.key === 'ArrowLeft') { select((i - 1 + panels.length) % panels.length, true); e.preventDefault(); }
      });
      list.appendChild(btn);
      return btn;
    });

    function select(index, focus) {
      panels.forEach(function (p, i) {
        p.hidden = i !== index;
        buttons[i].setAttribute('aria-selected', i === index ? 'true' : 'false');
        buttons[i].tabIndex = i === index ? 0 : -1;
      });
      if (focus) buttons[index].focus();
    }

    tabs.insertBefore(list, tabs.firstChild);
    var start = panels.findIndex(function (p) { return p.hasAttribute('data-default'); });
    select(start < 0 ? 0 : start);
  });
})();

// Índice "En esta página": marca en color el apartado que se está leyendo
(function () {
  var links = Array.prototype.slice.call(document.querySelectorAll('.content-toc nav a[href^="#"]'));
  if (!links.length) return;

  var items = links.map(function (a) {
    var el = document.getElementById(decodeURIComponent(a.getAttribute('href').slice(1)));
    return el ? { a: a, el: el } : null;
  }).filter(Boolean);
  if (!items.length) return;

  var offset = 90; // un poco más que la barra superior
  var ticking = false;

  function update() {
    ticking = false;
    var current = null;
    for (var i = 0; i < items.length; i++) {
      if (items[i].el.getBoundingClientRect().top <= offset) current = items[i];
      else break;
    }
    if (!current) current = items[0]; // arriba del todo: primer apartado
    var doc = document.documentElement;
    var scrollable = doc.scrollHeight > window.innerHeight + 10;
    if (scrollable && window.innerHeight + window.scrollY >= doc.scrollHeight - 2) {
      current = items[items.length - 1];
    }
    items.forEach(function (it) {
      var on = it === current;
      it.a.classList.toggle('active', on);
      if (on) it.a.setAttribute('aria-current', 'location');
      else it.a.removeAttribute('aria-current');
    });
  }

  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
})();

// Índice "En esta página": desplazamiento suave al pulsar un apartado
(function () {
  var toc = document.querySelector('.content-toc nav');
  if (!toc) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  toc.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var el = document.getElementById(decodeURIComponent(a.getAttribute('href').slice(1)));
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    history.pushState(null, '', a.getAttribute('href'));
  });
})();

// Visor: al pulsar una foto de la documentación se abre a pantalla completa
(function () {
  var imgs = Array.prototype.slice.call(document.querySelectorAll('.markdown img'));
  if (!imgs.length || typeof HTMLDialogElement === 'undefined') return;

  var dialog = document.createElement('dialog');
  dialog.className = 'lightbox';
  dialog.setAttribute('aria-label', 'Imagen ampliada');
  dialog.innerHTML =
    '<button type="button" class="lightbox-close" aria-label="Cerrar imagen">×</button>' +
    '<figure class="lightbox-figure"><img alt=""><figcaption></figcaption></figure>';
  document.body.appendChild(dialog);

  var big = dialog.querySelector('img');
  var caption = dialog.querySelector('figcaption');
  var lastFocus = null;

  function open(img) {
    lastFocus = img;
    big.src = img.getAttribute('data-full') || img.currentSrc || img.src;
    big.alt = img.alt;
    caption.textContent = img.alt;
    document.documentElement.classList.add('lightbox-open');
    dialog.showModal();
  }

  function close() { dialog.close(); }

  dialog.addEventListener('click', close); // pulsar en cualquier parte cierra
  dialog.addEventListener('close', function () {
    document.documentElement.classList.remove('lightbox-open');
    big.removeAttribute('src');
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  });

  imgs.forEach(function (img) {
    if (img.closest('a')) return; // no tocar imágenes que ya son enlaces
    img.classList.add('zoomable');
    img.tabIndex = 0;
    img.setAttribute('role', 'button');
    img.addEventListener('click', function () { open(img); });
    img.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(img); }
    });
  });
})();


// YouTube: consentimiento previo
(function () {
  var CONSENT_KEY = 'youtube-consent';
  var GRANTED_VALUE = 'granted';

  var videos = Array.prototype.slice.call(
    document.querySelectorAll('.video[data-youtube-id]')
  );

  var revokeButtons = document.querySelectorAll(
    '.youtube-consent-revoke'
  );
  
  function hasConsent() {
    try {
      return localStorage.getItem(CONSENT_KEY) === GRANTED_VALUE;
    } catch (e) {
      return false;
    }
  }

  function saveConsent() {
    try {
      localStorage.setItem(CONSENT_KEY, GRANTED_VALUE);
    } catch (e) {}
  }

  function updateRevokeButton() {
    var granted = hasConsent();

    revokeButtons.forEach(function (button) {
      button.hidden = !granted;
    });
  }

  function createPlaceholder(container) {
    var placeholder = document.createElement('div');
    placeholder.className = 'video-consent-placeholder';

    var content = document.createElement('div');
    content.className = 'video-consent-content';

    var icon = document.createElement('span');
    icon.className = 'video-consent-icon';
    icon.setAttribute('aria-hidden', 'true');

    icon.innerHTML =
      '<svg viewBox="0 0 24 24" focusable="false">' +
      '<path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z"/>' +
      '</svg>';

    var message = document.createElement('p');
    message.className = 'video-consent-message';
    message.textContent =
      'Este vídeo está alojado en YouTube. Al cargarlo, tu navegador se conectará a los servidores de Google y YouTube creará cookies propias, conforme a sus políticas de privacidad y cookies.';

    var privacy = document.createElement('p');
    privacy.className = 'video-consent-privacy';
    privacy.textContent =
      'Tu elección se recordará en este navegador. Puedes revocarla en cualquier momento desde el pie de página.';

    var button = document.createElement('button');
    button.className = 'video-consent-button';
    button.type = 'button';
    button.textContent = 'Cargar vídeo';

    button.addEventListener('click', function () {
      saveConsent();

      updateRevokeButton();

      // Cargar todos los vídeos sin reproducción automática.
      videos.forEach(function (video) {
        mountVideo(video, false);
      });
    });

    content.appendChild(icon);
    content.appendChild(message);
    content.appendChild(privacy);
    content.appendChild(button);

    placeholder.appendChild(content);

    container.replaceChildren(placeholder);
  }

  function mountVideo(container, autoplay) {
    var videoId = container.getAttribute('data-youtube-id');

    var title =
      container.getAttribute('data-video-title') ||
      'Vídeo de YouTube';

    if (!/^[A-Za-z0-9_-]{11}$/.test(videoId || '')) {
      return;
    }

    // Evita crear otro iframe si ya existe.
    if (container.querySelector('iframe')) {
      return;
    }

    var iframe = document.createElement('iframe');

    var params = 'rel=0&playsinline=1';

    if (autoplay) {
      params += '&autoplay=1';
    }

    iframe.src =
      'https://www.youtube-nocookie.com/embed/' +
      encodeURIComponent(videoId) +
      '?' + params;

    iframe.title = title;
    iframe.loading = 'lazy';
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';

    iframe.allow =
      'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';

    iframe.allowFullscreen = true;

    // Sustituye el aviso por el reproductor.
    container.replaceChildren(iframe);
  }

  function revokeConsent() {
    try {
      localStorage.removeItem(CONSENT_KEY);
    } catch (e) {}

    // Elimina los reproductores y vuelve a mostrar los avisos.
    videos.forEach(function (video) {
      createPlaceholder(video);
    });

    updateRevokeButton();
  }

  // Evento del botón de revocación del footer.
  revokeButtons.forEach(function (button) {
    button.addEventListener('click', revokeConsent);
  });

  // Inicialización de los vídeos.
  if (hasConsent()) {
    videos.forEach(function (video) {
      mountVideo(video, false);
    });
  } else {
    videos.forEach(function (video) {
      createPlaceholder(video);
    });
  }

  // Actualiza la visibilidad del botón del footer.
  updateRevokeButton();

})();

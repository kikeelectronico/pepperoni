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

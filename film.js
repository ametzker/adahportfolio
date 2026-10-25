const projects = [
  {
    id: 'greta',
    title: 'GRETA',
    year: '2026',
    category: ['Documentary', 'Postproduction'],
    role: 'Production · Editing · Camera · Graphic design',
    type: 'youtube',
    src: 'https://www.youtube.com/embed/t3i7dQsqBC8',
    thumbnail: 'images/miniatura-greta.png',
    description: 'Documentary portrait.'
  },
  {
    id: 'veneno',
    title: 'VENENO',
    year: '2025',
    category: ['Short film', 'Art direction'],
    role: 'Direction · Art direction · Visual identity',
    type: 'youtube',
    src: 'https://www.youtube.com/embed/A7rZZu2k-vM',
    thumbnail: 'images/miniatura-veneno.png'
  },
  {
    id: 'pistola',
    title: 'Handy-Arm V2SOPMOD-VX',
    year: '2026',
    category: 'Postproduction',
    role: 'Edition',
    type: 'youtube',
    src: 'https://www.youtube.com/embed/xopSYZDS-kk',
    thumbnail: 'images/miniatura-pistola.png'
  },
  {
    id: 'somewhere',
    title: 'GRETA - PHOTO',
    year: '2026',
    category: 'Photography',
    role: 'Photography',
    type: 'image',
    src: 'images/somewhere else.jpg',
    thumbnail: 'images/photo-08.jpg'
  },
  {
    id: 'short-film',
    title: 'MAGNIFICENT',
    year: '2025',
    category: 'Short film',
    role: 'Art Direction',
    type: 'youtube',
    src: 'https://www.youtube.com/embed/watch?v=0XFAxlzHGI4',
    thumbnail: 'images/miniatura-magnificent.png'
  }
];

const photos = [
  { title: 'greta 1', src: 'images/photo-01.jpg', projectId: 'somewhere', collection: 'GRETA - FOTO' },
  { title: 'greta 2', src: 'images/photo-02.jpg', landscape: true, projectId: 'somewhere', collection: 'GRETA - FOTO' },
  { title: 'greta 3', src: 'images/photo-03.jpg', projectId: 'somewhere', collection: 'GRETA - FOTO' },
  { title: 'greta 3', src: 'images/photo-04.jpg', projectId: 'somewhere', collection: 'GRETA - FOTO' },
  { title: 'greta 3', src: 'images/photo-05.jpg', projectId: 'somewhere', collection: 'GRETA - FOTO' },
  { title: 'greta 3', src: 'images/photo-06.jpg', projectId: 'somewhere', collection: 'GRETA - FOTO' },
  { title: 'greta 3', src: 'images/photo-07.jpg', projectId: 'somewhere', collection: 'GRETA - FOTO' },
  { title: 'greta 3', src: 'images/photo-08.jpg', projectId: 'somewhere', collection: 'GRETA - FOTO' },
  { title: 'greta 3', src: 'images/photo-09.jpg', projectId: 'somewhere', collection: 'GRETA - FOTO' }
];

const $ = s => document.querySelector(s);
const desktop = $('#desktop');
const windows = $('#windows');
const scatter = $('#scatter');

let z = 20;
let activeCategory = 'All';

const offsets = [
  [.10, .14, -3],
  [.34, .24, 2],
  [.57, .12, -2],
  [.18, .48, 3],
  [.43, .45, -2],
  [.68, .35, 2],
  [.13, .30, 2],
  [.59, .18, -3]
];

function bringFront(el) {
  el.style.zIndex = ++z;
}

function drag(handle, target) {
  let down = false;
  let sx = 0, sy = 0, left = 0, top = 0;

  handle.addEventListener('pointerdown', e => {
    if (e.button !== undefined && e.button !== 0) return;

    if (
      e.target.closest('button') &&
      !e.target.classList.contains('traffic') &&
      handle !== target
    ) return;

    down = true;
    delete target.dataset.dragged;
    target.style.zIndex = ++z;

    const r = target.getBoundingClientRect();
    const p = desktop.getBoundingClientRect();

    left = r.left - p.left;
    top = r.top - p.top;
    sx = e.clientX;
    sy = e.clientY;

    if (handle.classList.contains('titlebar') || handle === target) {
      e.preventDefault();
    }

    handle.setPointerCapture?.(e.pointerId);
  });

  handle.addEventListener('pointermove', e => {
    if (!down) return;

    if (Math.abs(e.clientX - sx) > 4 || Math.abs(e.clientY - sy) > 4) {
      target.dataset.dragged = 'true';
    }

    let x = left + e.clientX - sx;
    let y = top + e.clientY - sy;
    const p = desktop.getBoundingClientRect();

    x = Math.max(0, Math.min(p.width - target.offsetWidth, x));
    y = Math.max(0, Math.min(p.height - 30, y));

    target.style.left = x + 'px';
    target.style.top = y + 'px';
    target.style.transform = 'none';
  });

  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(event => {
    handle.addEventListener(event, () => down = false);
  });
}

function makeWindow(title, kind = '') {
  const w = document.createElement('section');
  w.className = 'win';
  w.style.left = Math.max(8, desktop.clientWidth / 2 - 380 + (windows.children.length % 4) * 23) + 'px';
  w.style.top = Math.max(12, desktop.clientHeight / 2 - 230 + (windows.children.length % 4) * 19) + 'px';
  w.style.zIndex = ++z;

  w.innerHTML = `
    <header class="titlebar">
      <div class="lights">
        <button class="traffic close" aria-label="Cerrar"></button>
        <button class="traffic min" aria-label="Minimizar"></button>
        <button class="traffic max" aria-label="Ampliar"></button>
      </div>
      <span class="wtitle"></span>
      <small class="kind"></small>
    </header>
    <div class="window-content"></div>
    <footer class="status"><span></span><span></span></footer>
  `;

  w.querySelector('.wtitle').textContent = title;
  w.querySelector('.kind').textContent = kind;

  w.querySelector('.traffic.close').onclick = () => {
    w.querySelectorAll('video').forEach(v => v.pause());
    w.remove();
  };

  w.querySelector('.traffic.min').onclick = () => {
    w.classList.toggle('minimized');
    w.querySelector('.window-content').hidden = w.classList.contains('minimized');
    w.querySelector('.status').hidden = w.classList.contains('minimized');
  };

  w.querySelector('.traffic.max').onclick = () => {
    if (!w.dataset.old) {
      w.dataset.old = JSON.stringify({
        left: w.style.left,
        top: w.style.top,
        width: w.style.width,
        height: w.style.height
      });

      w.style.left = '8px';
      w.style.top = '8px';
      w.style.width = 'calc(100% - 16px)';
      w.style.maxHeight = 'calc(100% - 60px)';
    } else {
      Object.assign(w.style, JSON.parse(w.dataset.old));
      w.dataset.old = '';
    }
  };

  w.addEventListener('pointerdown', () => bringFront(w));
  drag(w.querySelector('.titlebar'), w);
  windows.append(w);

  return w;
}

function missing(el, path = '') {
  el.replaceChildren();

  const d = document.createElement('div');
  d.className = 'placeholder';
  d.textContent = path ? 'File not found: ' + path : 'Preview unavailable';

  el.append(d);
}

function categoryText(category, fallback = 'Film') {
  if (Array.isArray(category)) return category.join(' · ');
  return category || fallback;
}

function openProject(p) {
  const w = makeWindow(p.title);
  const body = document.createElement('div');
  body.className = 'window-body';

  const media = document.createElement('div');
  media.className = 'media';

  const info = document.createElement('aside');
  info.className = 'info';
  info.innerHTML = `
    <small class="eyebrow">PROJECT</small>
    <h2></h2>
    <div class="meta"><span class="cat"></span><span class="year"></span></div>
    <p class="role"></p>
  `;

  info.querySelector('h2').textContent = p.title;
  info.querySelector('.cat').textContent = categoryText(p.category);
  info.querySelector('.year').textContent = p.year || '—';
  info.querySelector('.role').textContent = p.role || '';

  if (p.type === 'video') {
    const v = document.createElement('video');
    v.controls = true;
    v.playsInline = true;
    v.src = p.src;
    v.onerror = () => missing(media, p.src);
    media.append(v);
  } else if (p.type === 'youtube') {
    const f = document.createElement('iframe');
    f.src = p.src;
    f.title = p.title;
    f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    f.allowFullscreen = true;
    media.append(f);
  } else if (p.src) {
    const im = document.createElement('img');
    im.src = p.src;
    im.alt = p.title;
    im.onerror = () => missing(media, p.src);
    media.append(im);
  } else {
    missing(media);
  }

  body.append(media, info);
  w.querySelector('.window-content').replaceWith(body);

  w.querySelector('.status span').textContent =
    categoryText(p.category, 'PROJECT') + ' · ' + (p.year || '');
}

function photoWindow(p, pos) {
  const b = document.createElement('div');
  b.className = 'photo-window' + (p.landscape ? ' landscape' : '');
  b.style.left = Math.round(pos[0] * desktop.clientWidth) + 'px';
  b.style.top = Math.max(55, Math.round(pos[1] * desktop.clientHeight)) + 'px';
  b.style.transform = `rotate(${pos[2]}deg)`;
  b.style.zIndex = ++z;
  b.dataset.photoId = p.projectId || '';

  const im = document.createElement('img');
  im.src = p.src;
  im.alt = p.title;
  im.draggable = false;
  im.onerror = () => {
    b.classList.add('missing');
    im.remove();
  };

  const label = document.createElement('span');
  label.textContent = p.title;

  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'photo-close';
  close.textContent = '×';
  close.setAttribute('aria-label', 'Cerrar ' + p.title);

  close.addEventListener('pointerdown', e => e.stopPropagation());

  close.addEventListener('click', e => {
    e.preventDefault();
    e.stopPropagation();
    b.remove();
  });

  b.append(im, label, close);

  b.addEventListener('click', e => {
    if (e.target.closest('.photo-close')) return;

    if (b.dataset.dragged === 'true') {
      delete b.dataset.dragged;
      return;
    }

    openProject({
      title: p.title,
      year: '—',
      category: 'Photography',
      role: p.collection || 'Photography',
      type: 'image',
      src: p.src
    });
  });

  b.addEventListener('pointerdown', () => bringFront(b));
  scatter.append(b);
  drag(b, b);

  return b;
}

function scatterCollection(project) {
  scatter.replaceChildren();

  const collection = photos.filter(p => p.projectId === project.id);

  if (!collection.length) {
    openProject(project);
    return;
  }

  collection.forEach((p, i) => {
    photoWindow(p, offsets[i % offsets.length]);
  });
}

function openPhotos() {
  const w = makeWindow('Photo Archive', 'GALLERY');
  const gallery = document.createElement('div');
  gallery.className = 'photo-gallery';

  photos.forEach(p => {
    const item = document.createElement('button');
    item.type = 'button';
    item.className = 'gallery-item';

    const im = document.createElement('img');
    im.src = p.src;
    im.alt = p.title;
    im.onerror = () => {
      item.classList.add('image-missing');
      im.remove();
    };

    const caption = document.createElement('span');
    caption.textContent = p.title;

    const meta = document.createElement('small');
    meta.textContent = p.collection || 'Photography';

    item.append(im, caption, meta);

    item.addEventListener('click', () => openProject({
      title: p.title,
      year: '—',
      category: 'Photography',
      role: p.collection || 'Photography',
      type: 'image',
      src: p.src
    }));

    gallery.append(item);
  });

  w.querySelector('.window-content').replaceWith(gallery);
  w.querySelector('.status span').textContent = photos.length + ' PHOTOGRAPHS · ALL PROJECTS';
}

function createFallbackIcon(type) {
  const icon = document.createElement('span');
  icon.className = 'doc-art';
  icon.textContent = type === 'video' ? '▶' : '▧';
  return icon;
}

function createProjectFiles() {
  const holder = document.createElement('div');
  holder.id = 'project-files';

  holder.style.cssText = `
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 3;
  `;

  desktop.append(holder);

  function getRandomPosition(index, occupied) {
    const width = desktop.clientWidth;
    const height = desktop.clientHeight;

    const iconWidth = window.innerWidth <= 700 ? 76 : 108;
    const iconHeight = 100;
    const margin = 16;
    const topMin = 35;
    const bottomSpace = 100;

    const maxX = Math.max(margin, width - iconWidth - margin);
    const maxY = Math.max(topMin, height - iconHeight - bottomSpace);

    let x = margin;
    let y = topMin;

    for (let attempt = 0; attempt < 100; attempt++) {
      x = margin + Math.random() * (maxX - margin);
      y = topMin + Math.random() * (maxY - topMin);

      const overlaps = occupied.some(pos => {
        const dx = x - pos.x;
        const dy = y - pos.y;

        return Math.abs(dx) < iconWidth + 24 &&
               Math.abs(dy) < iconHeight + 12;
      });

      if (!overlaps) break;
    }

    occupied.push({ x, y });
    return { x, y };
  }

  const occupied = [];

  projects.forEach((p, i) => {
    const pos = getRandomPosition(i, occupied);

    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'desktop-icon project-icon';

    // Guarda todas las categorías del proyecto.
    b.dataset.category = Array.isArray(p.category)
      ? p.category.join('|')
      : (p.category || '');

    b.style.left = `${pos.x}px`;
    b.style.top = `${pos.y}px`;
    b.style.pointerEvents = 'auto';

    if (p.thumbnail) {
      const art = document.createElement('img');
      art.className = 'project-thumbnail';
      art.src = p.thumbnail;
      art.alt = p.title;
      art.draggable = false;

      art.onerror = () => {
        art.replaceWith(createFallbackIcon(p.type));
      };

      b.append(art);
    } else {
      b.append(createFallbackIcon(p.type));
    }

    const name = document.createElement('span');
    name.className = 'project-name';
    name.textContent = p.title;
    b.append(name);

    b.addEventListener('click', () => {
      if (b.dataset.dragged === 'true') {
        delete b.dataset.dragged;
        return;
      }

      document.querySelectorAll('.project-icon.selected')
        .forEach(el => el.classList.remove('selected'));

      b.classList.add('selected');

      const categories = Array.isArray(p.category)
        ? p.category
        : [p.category];

      if (categories.includes('Photography')) {
        scatterCollection(p);
      } else {
        openProject(p);
      }
    });

    b.addEventListener('pointerdown', () => bringFront(b));

    drag(b, b);
    holder.append(b);
  });
}

function createCategoryBar() {
  const bar = document.createElement('nav');
  bar.id = 'archive-categories';
  bar.setAttribute('aria-label', 'Filter projects by category');
  bar.innerHTML = '<span>PROJECTS</span><div class="category-options"></div>';

  const opts = [
    ['All', 'All'],
    ['Documentary', 'Documentary'],
    ['Short film', 'Short film'],
    ['Photo', 'Photography'],
    ['Music video', 'Music video'],
    ['Art direction', 'Art direction'],
    ['Postproduction', 'Postproduction']
  ];

  const list = bar.querySelector('.category-options');

  opts.forEach(([label, value]) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = label;
    b.dataset.category = value;
    b.classList.toggle('active', value === activeCategory);
    b.onclick = () => setCategory(value);
    list.append(b);
  });

  desktop.append(bar);
}

function setCategory(category) {
  activeCategory = category;

  document.querySelectorAll('#archive-categories button').forEach(b => {
    b.classList.toggle('active', b.dataset.category === category);
  });

  document.querySelectorAll('.project-icon').forEach(el => {
    const categories = (el.dataset.category || '').split('|');

    // El proyecto aparece si tiene asignada la categoría seleccionada.
    el.hidden = category !== 'All' && !categories.includes(category);
  });

  scatter.querySelectorAll('.photo-window').forEach(el => {
    el.hidden = category !== 'All' && category !== 'Photography';
  });

  const folder = $('#photo-folder');
  if (folder) {
    folder.hidden = category !== 'All' && category !== 'Photography';
  }
}

function openFilmFolder() {
  const w = makeWindow('Film', 'FOLDER');
  const list = document.createElement('div');
  list.className = 'folder-list';

  projects.forEach(p => {
    const b = document.createElement('button');
    b.className = 'folder-row';
    b.innerHTML = '<span class="mini-icon"></span><span><strong></strong><small></small></span>';

    b.querySelector('strong').textContent = p.title;
    b.querySelector('small').textContent =
      categoryText(p.category, 'Project') + ' · ' + (p.year || '');

    b.onclick = () => openProject(p);
    list.append(b);
  });

  w.querySelector('.window-content').replaceWith(list);
  w.querySelector('.status span').textContent = projects.length + ' ITEMS';
}

function openAbout() {
  const w = makeWindow('About.txt', 'TEXT');
  const d = document.createElement('div');
  d.className = 'about-body';

  const p = document.createElement('p');
  p.textContent = 'Adah García — audiovisual work, photography and visual direction.';

  const p2 = document.createElement('p');
  p2.textContent = 'An evolving archive of moving images and stills.';

  d.append(p, p2);
  w.querySelector('.window-content').replaceWith(d);
}

$('#photo-folder')?.addEventListener('click', () => {
  openPhotos();
  $('#photo-folder').classList.add('selected');
});

$('#film-folder')?.addEventListener('click', () => {
  openFilmFolder();
  $('#film-folder').classList.add('selected');
});

$('#about-file')?.addEventListener('click', openAbout);

document.querySelectorAll('.dock button').forEach(b => {
  b.addEventListener('click', () => {
    if (b.dataset.action === 'photos') openPhotos();
    else if (b.dataset.action === 'film') openFilmFolder();
    else openAbout();
  });
});

document.querySelectorAll('.menubar button').forEach(b => {
  b.addEventListener('click', () => {
    document.querySelector('.menu-pop')?.remove();

    const pop = document.createElement('div');
    pop.className = 'menu-pop';

    const actions = [
      ['Abrir Fotos', openPhotos],
      ['Abrir Film', openFilmFolder],
      ['About', openAbout],
      ['Cerrar menú', () => {}]
    ];

    actions.forEach(([label, fn]) => {
      const x = document.createElement('button');
      x.textContent = label;

      x.onclick = () => {
        pop.remove();
        fn();
      };

      pop.append(x);
    });

    desktop.append(pop);
  });
});

document.addEventListener('pointerdown', e => {
  if (!e.target.closest('.menu-pop') && !e.target.closest('.menubar button')) {
    document.querySelector('.menu-pop')?.remove();
  }
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelector('.menu-pop')?.remove();
    const w = windows.lastElementChild;
    if (w) w.remove();
  }
});

function clock() {
  $('#clock').textContent = new Date().toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

clock();
setInterval(clock, 60000);

createProjectFiles();
createCategoryBar();
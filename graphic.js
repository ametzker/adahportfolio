
const projects = [
  {
    title: "GRETA",
    category: "Poster Design",
    year: "2026",
    description: "Official poster design for 'GRETA' musical documentary.",
    dimensions: "A3 · PORTRAIT",
    files: [
      { title: "Poster", image: "imatges/greta cartell.jpg" }
    ]
  },
  {
    title: "ETHER KLUB",
    category: "Editorial Design",
    year: "2025",
    description: "Visual brand design. An exploration of digital culture.",
    dimensions: "COLLECTION",
    files: [
      { title: "Official poster", image: "imatges/CARTEL ETHER DEF.jpg" },
      { title: "Poster v1", image: "imatges/verde.png" },
      { title: "Poster v2", image: "imatges/tronja.png" },
      { title: "Line up", image: "imatges/etherlineup.jpg" },
      { title: "Name design", image: "imatges/ethernoms.png" },
    ]
  },
  {
    title: "BAZOOKA | CODEC",
    category: "Experimental Design",
    year: "2026",
    description: "Colour, atmosphere and storytelling.",
    dimensions: "A3 · PORTRAIT",
    files: [
      { title: "Artwork", image: "imatges/bazuka.png" },
      { title: "Artwork", image: "imatges/bazuka1.png" },
      { title: "Artwork", image: "imatges/bazuka3.png" },
    ]
  },
  {
    title: "MAGNIFICENT",
    category: "Motion Graphics",
    year: "2025",
    description: "Animated cards and end credits for Magnificent, short film.",
    dimensions: "MOTION · GRAPHIC DESIGN",
    folders: [
      {
        title: "CARDS",
        files: [
          //{ title: "Card 02", image: "imatges/magnificent/cards/card-02.jpg" }
          { title: "Magenta", image: "imatges/magenta.MP4" },
          { title: "Magnificent", image: "imatges/magnificent.MP4" },
        ]
      },
      {
        title: "CREDITS",
        files: [
          { title: "Credits", image: "imatges/magcreds.mov" },
        ]
      }
    ]
  },
  {
    title: "NO RETURN | Interactive Short Film",
    category: "End Credits",
    year: "2025",
    description: "End credits design for an interactive short film.",
    dimensions: "FILM CREDITS",
    files: [
      { title: "End Credits", image: "imatges/escena crèdits.mp4"},
    ]
  },
  {
    title: "THE LAST DINNER PARTY",
    category: "Concept Poster",
    year: "2024",
    description: "A conceptual poster design for the band The Last Dinner Party.",
    dimensions: "POSTER",
    files: [
      { title: "The last dinner party | Concept poster", image: "imatges/insta tldp.jpg"},
      { title: "The last dinner party | Concept poster", image: "imatges/insta tldp bnw.jpg"},
    ]
  },
  /*{
    title: "SPEAK OR DIE",
    category: "Visual Identity",
    year: "2025",
    description: "An experimental visual identity.",
    dimensions: "IDENTITY · SERIES",
    files: [
      { title: "Main Artwork", image: "imatges/speak or die.jpg" }
    ]
  },
  
  {
    title: "BLUE HOUR",
    category: "Experimental Design",
    year: "2025",
    description: "An experimental composition.",
    dimensions: "DIGITAL · SERIES",
    files: [
      { title: "Composition", image: "imatges/blue hour.jpg" }
    ]
  } */
];

const $ = id => document.getElementById(id);

const gallery = $("gallery-items");
const layers = $("layers-list");
const mainImage = $("main-image");
const canvas = $("canvas");
const canvasFrame = document.querySelector(".canvas-frame");

let selectedIndex = 0;
let selectedFileIndex = 0;
let selectedFolderIndex = -1;

/* FILES */

function getFiles(project) {
  if (project.folders) {
    if (selectedIndex === projects.indexOf(project) && selectedFolderIndex >= 0) {
      return project.folders[selectedFolderIndex].files.filter(file => file.image);
    }
    return project.folders.flatMap(folder =>
      folder.files.filter(file => file.image)
    );
  }

  return (project.files || []).filter(file => file.image);
}

/* PROJECT CARDS AND LAYERS */

function createProjectButton(project, index, type) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = type;
  button.dataset.index = index;

  const firstFile = project.folders
    ? project.folders.flatMap(folder => folder.files)[0]
    : getFiles(project)[0];

  if (type === "gallery-card") {
    const img = document.createElement("img");
    img.alt = "";
    img.loading = "lazy";
    img.src = firstFile?.image || "";

    const name = document.createElement("span");
    name.className = "gallery-name";
    name.textContent = project.title;

    const category = document.createElement("span");
    category.className = "gallery-category";
    category.textContent = `${project.category} · ${project.year}`;

    button.append(img, name, category);
  } else {
    const eye = document.createElement("span");
    eye.className = "layer-eye";
    eye.textContent = "◉";

    const img = document.createElement("img");
    img.alt = "";
    img.loading = "lazy";
    img.src = firstFile?.image || "";

    const text = document.createElement("span");

    const name = document.createElement("span");
    name.className = "layer-name";
    name.textContent = project.title;

    const subtitle = document.createElement("span");
    subtitle.className = "layer-subtitle";
    subtitle.textContent = `${project.category} · ${project.year}`;

    text.append(name, subtitle);
    button.append(eye, img, text);
  }

  button.setAttribute("aria-pressed", "false");
  button.addEventListener("click", () => selectProject(index));

  return button;
}

function renderProjects() {
  gallery.replaceChildren();
  layers.replaceChildren();

  projects.forEach((project, index) => {
    gallery.appendChild(
      createProjectButton(project, index, "gallery-card")
    );

    layers.appendChild(
      createProjectButton(project, index, "layer")
    );
  });
}

/* FOLDER NAVIGATION */

function renderFiles() {
  const project = projects[selectedIndex];
  gallery.replaceChildren();

  if (project.folders && selectedFolderIndex === -1) {
    project.folders.forEach((folder, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "gallery-card folder-card";

      const icon = document.createElement("span");
      icon.textContent = "📁";
      icon.style.cssText =
        "display:grid;place-items:center;width:100%;height:72px;font-size:30px";

      const name = document.createElement("span");
      name.className = "gallery-name";
      name.textContent = folder.title;

      const count = document.createElement("span");
      count.className = "gallery-category";
      count.textContent =
        `${folder.files.filter(file => file.image).length} archivos`;

      button.append(icon, name, count);

      button.addEventListener("click", () => {
        selectedFolderIndex = index;
        selectedFileIndex = 0;
        renderFiles();

        const files = getFiles(project);
        if (files.length) {
          selectFile(0);
        } else {
          mainImage.removeAttribute("src");
          mainImage.alt = "Esta carpeta todavía no tiene imágenes.";
          updateCreditNavigation();
        }
      });

      gallery.appendChild(button);
    });

    $("gallery-count").textContent = "FOLDERS";
    updateCreditNavigation();
    return;
  }

  const files = getFiles(project);

  if (project.folders) {
    const back = document.createElement("button");
    back.type = "button";
    back.className = "gallery-card folder-back";

    const arrow = document.createElement("span");
    arrow.textContent = "←";
    arrow.style.cssText =
      "display:grid;place-items:center;height:72px;font-size:24px";

    const name = document.createElement("span");
    name.className = "gallery-name";
    name.textContent = "Carpetas";

    const subtitle = document.createElement("span");
    subtitle.className = "gallery-category";
    subtitle.textContent = project.folders[selectedFolderIndex].title;

    back.append(arrow, name, subtitle);

    back.addEventListener("click", () => {
      selectedFolderIndex = -1;
      selectedFileIndex = 0;
      renderFiles();

      mainImage.removeAttribute("src");
      mainImage.alt = "Selecciona una carpeta para ver sus imágenes.";
      resetZoom();
      updateCreditNavigation();
    });

    gallery.appendChild(back);
  }

  files.forEach((file, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className =
      "gallery-card file-card" +
      (index === selectedFileIndex ? " active" : "");

    const img = document.createElement("img");
    img.src = file.image;
    img.alt = "";
    img.loading = "lazy";

    const name = document.createElement("span");
    name.className = "gallery-name";
    name.textContent = file.title;

    const category = document.createElement("span");
    category.className = "gallery-category";
    category.textContent =
      `${String(index + 1).padStart(2, "0")} / ${String(files.length).padStart(2, "0")}`;

    button.append(img, name, category);
    button.setAttribute("aria-pressed", String(index === selectedFileIndex));

    button.addEventListener("click", () => selectFile(index));

    gallery.appendChild(button);
  });

  updateGalleryCount();
  updateCreditNavigation();
  gallery.scrollLeft = 0;
}

function updateGalleryCount() {
  const files = getFiles(projects[selectedIndex]);
  const counter = $("gallery-count");

  if (!counter) return;

  counter.textContent = files.length
    ? `${String(selectedFileIndex + 1).padStart(2, "0")} / ${String(files.length).padStart(2, "0")}`
    : "NO FILES";
}

/* SELECT PROJECT */

function selectProject(index) {
  if (index < 0 || index >= projects.length) return;

  selectedIndex = index;
  selectedFileIndex = 0;
  selectedFolderIndex = -1;

  const project = projects[index];

  $("info-title").textContent = project.title;
  $("info-category").textContent = project.category;
  $("info-year").textContent = project.year;
  $("info-description").textContent = project.description;
  $("tab-title").textContent =
    `${project.title} — ${project.category} (${project.year})`;
  $("dimensions").textContent = project.dimensions;

  document.querySelectorAll(".layer").forEach((button, i) => {
    const active = i === index;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  renderFiles();

  if (project.folders) {
    mainImage.removeAttribute("src");
    mainImage.alt = "Selecciona CARDS o CREDITS para ver sus imágenes.";
    resetZoom();
    updateCreditNavigation();
  } else {
    selectFile(0);
  }
}

/* SELECT IMAGE */

function selectFile(index) {
  const project = projects[selectedIndex];
  const files = getFiles(project);

  if (!files.length || index < 0 || index >= files.length) {
    mainImage.removeAttribute("src");
    mainImage.alt = "Esta carpeta no contiene imágenes.";
    updateCreditNavigation();
    return;
  }

  selectedFileIndex = index;
  const file = files[index];

  mainImage.classList.add("changing");

  const preload = new Image();

  preload.onload = () => {
    mainImage.src = file.image;
    mainImage.alt = `${project.title} — ${file.title}`;
    mainImage.classList.remove("changing");
    fitImage();
  };

  preload.onerror = () => {
    mainImage.classList.remove("changing");
    console.error("No se encuentra la imagen:", file.image);
  };

  preload.src = file.image;

  $("tab-title").textContent =
    `${project.title} — ${file.title}`;

  $("dimensions").textContent = project.dimensions;

  document.querySelectorAll(".file-card").forEach((button, i) => {
    const active = i === index;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  updateGalleryCount();
  updateCreditNavigation();
}

/* CANVAS ARROWS */

let creditNavigation = null;

function createCreditNavigation() {
  if (!canvasFrame || creditNavigation) return;

  creditNavigation = document.createElement("div");
  creditNavigation.id = "credit-navigation";

  Object.assign(creditNavigation.style, {
    position: "absolute",
    left: "50%",
    bottom: "18px",
    transform: "translateX(-50%)",
    zIndex: "20",
    display: "none",
    alignItems: "center",
    gap: "10px",
    padding: "6px 8px",
    border: "1px solid #505050",
    borderRadius: "5px",
    background: "rgba(35,35,35,.94)",
    color: "#eee",
    font: "11px var(--mono, monospace)"
  });

  function makeButton(label, title, direction) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = label;
    button.title = title;

    Object.assign(button.style, {
      minWidth: "30px",
      height: "28px",
      border: "1px solid #505050",
      borderRadius: "3px",
      background: "#303030",
      color: "#eee",
      cursor: "pointer",
      font: "14px var(--mono, monospace)"
    });

    button.addEventListener("click", () => {
      const files = getFiles(projects[selectedIndex]);

      if (files.length > 1) {
        selectFile(
          (selectedFileIndex + direction + files.length) % files.length
        );
      }
    });

    return button;
  }

  const previous = makeButton("←", "Imagen anterior", -1);

  const counter = document.createElement("span");
  counter.id = "credit-navigation-count";

  const next = makeButton("→", "Imagen siguiente", 1);

  creditNavigation.append(previous, counter, next);
  canvasFrame.appendChild(creditNavigation);
}

function updateCreditNavigation() {
  if (!creditNavigation) return;

  const project = projects[selectedIndex];
  const files = getFiles(project);

  const isFolderOpen =
    project.folders && selectedFolderIndex >= 0;

  const showNavigation =
    project.title === "MAGNIFICENT" &&
    isFolderOpen &&
    files.length > 1;

  creditNavigation.style.display = showNavigation ? "flex" : "none";

  const counter = $("credit-navigation-count");

  if (counter) {
    counter.textContent = files.length
      ? `${String(selectedFileIndex + 1).padStart(2, "0")} / ${String(files.length).padStart(2, "0")}`
      : "00 / 00";
  }
}

/* KEYBOARD ARROWS */

document.addEventListener("keydown", event => {
  if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

  const tag = document.activeElement?.tagName;
  if (["INPUT", "TEXTAREA", "SELECT"].includes(tag)) return;

  const project = projects[selectedIndex];

  if (project.folders && selectedFolderIndex === -1) return;

  const files = getFiles(project);
  if (files.length < 2) return;

  if (event.key === "ArrowRight") {
    selectFile((selectedFileIndex + 1) % files.length);
  } else {
    selectFile((selectedFileIndex - 1 + files.length) % files.length);
  }
});

/* GALLERY SCROLL */

gallery.addEventListener("wheel", event => {
  if (event.shiftKey) {
    event.preventDefault();
    gallery.scrollLeft += event.deltaY;
  }
}, { passive: false });

/* TOOLBAR */

document.querySelectorAll(".tools button").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".tools button").forEach(item => {
      item.classList.remove("active");
    });
    button.classList.add("active");
  });
});

/* PANEL TABS */

document.querySelectorAll(".panel-tabs .tab").forEach(tab => {
  tab.addEventListener("click", () => {
    tab.parentElement.querySelectorAll(".tab").forEach(item => {
      item.classList.toggle("active", item === tab);
    });
  });
});

/* ZOOM + PAN */

const zoomInButton = $("zoom-in");
const zoomOutButton = $("zoom-out");
const zoomLevelButton = $("zoom-level");
const zoomFitButton = $("zoom-fit");

let zoom = 1;
let fitScale = 1;
let panX = 0;
let panY = 0;

const MIN_ZOOM = 0.1;
const MAX_ZOOM = 5;
const ZOOM_STEP = 1.2;

function resetZoom() {
  zoom = 1;
  fitScale = 1;
  panX = 0;
  panY = 0;

  mainImage.style.transform = "";
  mainImage.style.width = "";
  mainImage.style.height = "";

  if (zoomLevelButton) zoomLevelButton.textContent = "100%";
}

function fitImage() {
  if (!mainImage.complete || !mainImage.naturalWidth || !canvas) return;

  const availableWidth = canvas.clientWidth * 0.82;
  const availableHeight = canvas.clientHeight * 0.82;

  fitScale = Math.min(
    availableWidth / mainImage.naturalWidth,
    availableHeight / mainImage.naturalHeight
  );

  zoom = fitScale;
  panX = 0;
  panY = 0;

  updateZoom();
}

function updateZoom() {
  if (!mainImage.naturalWidth) return;

  mainImage.style.width = `${mainImage.naturalWidth}px`;
  mainImage.style.height = `${mainImage.naturalHeight}px`;

  mainImage.style.transform =
    `translate(${panX}px, ${panY}px) scale(${zoom})`;

  if (zoomLevelButton) {
    zoomLevelButton.textContent =
      `${Math.round((zoom / fitScale) * 100)}%`;
  }
}

function setZoom(nextZoom, clientX, clientY) {
  if (!mainImage.naturalWidth) return;

  const rect = canvas.getBoundingClientRect();

  const centerX = clientX ?? rect.left + rect.width / 2;
  const centerY = clientY ?? rect.top + rect.height / 2;

  const mouseX = centerX - rect.left - rect.width / 2;
  const mouseY = centerY - rect.top - rect.height / 2;

  const clampedZoom = Math.max(
    fitScale * MIN_ZOOM,
    Math.min(fitScale * MAX_ZOOM, nextZoom)
  );

  const ratio = clampedZoom / zoom;

  panX = mouseX - (mouseX - panX) * ratio;
  panY = mouseY - (mouseY - panY) * ratio;

  zoom = clampedZoom;
  updateZoom();
}

zoomInButton?.addEventListener("click", () => {
  setZoom(zoom * ZOOM_STEP);
});

zoomOutButton?.addEventListener("click", () => {
  setZoom(zoom / ZOOM_STEP);
});

zoomLevelButton?.addEventListener("click", fitImage);
zoomFitButton?.addEventListener("click", fitImage);

canvas.addEventListener("wheel", event => {
  event.preventDefault();

  if (event.deltaY < 0) {
    setZoom(zoom * 1.1, event.clientX, event.clientY);
  } else {
    setZoom(zoom / 1.1, event.clientX, event.clientY);
  }
}, { passive: false });

let dragging = false;
let startX = 0;
let startY = 0;
let initialPanX = 0;
let initialPanY = 0;

canvas.addEventListener("pointerdown", event => {
  if (event.target.closest("#credit-navigation")) return;

  dragging = true;
  startX = event.clientX;
  startY = event.clientY;
  initialPanX = panX;
  initialPanY = panY;

  canvas.setPointerCapture(event.pointerId);
});

canvas.addEventListener("pointermove", event => {
  if (!dragging) return;

  panX = initialPanX + event.clientX - startX;
  panY = initialPanY + event.clientY - startY;

  updateZoom();
});

canvas.addEventListener("pointerup", () => {
  dragging = false;
});

canvas.addEventListener("pointercancel", () => {
  dragging = false;
});

/* INITIALIZE */

createCreditNavigation();
renderProjects();
selectProject(0);

mainImage.addEventListener("load", fitImage);
window.addEventListener("resize", fitImage);

fitImage();

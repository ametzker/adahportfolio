
/* =========================================
   HOME — CAMBIO DE AMBIENTE SEGÚN LA HORA
   ========================================= */

const scenes = {
  morning: {
    start: 6,
    end: 15,
    image: "imatges/llit-mati.png",
    className: "is-morning"
  },
  afternoon: {
    start: 15,
    end: 21,
    image: "imatges/llit-tarda.png",
    className: "is-afternoon"
  },
  night: {
    start: 21,
    end: 6,
    image: "imatges/llit-nit.png",
    className: "is-night"
  }
};

function updateScene() {
  const hour = new Date().getHours();

  let scene;
  if (hour >= scenes.morning.start && hour < scenes.morning.end) {
    scene = scenes.morning;
  } else if (hour >= scenes.afternoon.start && hour < scenes.afternoon.end) {
    scene = scenes.afternoon;
  } else {
    scene = scenes.night;
  }

  document.body.classList.remove("is-morning", "is-afternoon", "is-night");
  document.body.classList.add(scene.className);

  const bedImage = document.getElementById("bed-image");

  if (bedImage && !bedImage.getAttribute("src").endsWith(scene.image)) {
    bedImage.style.opacity = "0";

    const showImage = () => {
      bedImage.style.opacity = "1";
    };

    bedImage.onload = showImage;
    bedImage.onerror = () => {
      showImage();
      console.error("No se encuentra la imagen:", scene.image);
    };

    bedImage.src = scene.image;

    if (bedImage.complete && bedImage.naturalWidth > 0) {
      showImage();
    }
  }
}

updateScene();
setInterval(updateScene, 60000);


/* =========================================
   REPRODUCTOR MUSICAL
   ========================================= */

// Cambia los títulos, artistas y rutas por tus canciones reales.

const tracks = [
  { title: "AMOR EN EL METRO", artist: "Greta", src: "audio/cancion-01.wav" },
  { title: "All I need", artist: "Radiohead", src: "audio/cancion-02.mp3" },
  { title: "Sateside", artist: "Pinkpantheress feat Zara Larsson", src: "audio/cancion-03.mp3" }
];

const radioButton = document.getElementById("radio-trigger");
const player = document.getElementById("music-player");
const audio = document.getElementById("audio");

const title = document.getElementById("track-title");
const artist = document.getElementById("track-artist");

const playPause = document.getElementById("play-pause");
const previousButton = document.getElementById("previous-track");
const nextButton = document.getElementById("next-track");

const volumeButton = document.getElementById("volume-icon");
const volumePopup = document.getElementById("volume-popup");
const volumeSlider = document.getElementById("volume");

const tracklistToggle = document.getElementById("tracklist-toggle");
const tracklistPanel = document.getElementById("tracklist-panel");
const tracklistItems = document.getElementById("tracklist-items");
const trackCount = document.getElementById("track-count");

let currentTrack = 0;
let previousVolume = 0.7;


function updateTitleMarquee() {
  if (!title) return;

  const windowEl = title.closest(".track-title-window");
  if (!windowEl) return;

  title.classList.remove("is-scrolling");
  title.style.removeProperty("--scroll-distance");
  title.style.removeProperty("--marquee-duration");

  requestAnimationFrame(() => {
    const overflow = title.scrollWidth - windowEl.clientWidth;

    if (overflow > 2) {
      title.style.setProperty("--scroll-distance", `-${overflow}px`);
      title.style.setProperty(
        "--marquee-duration",
        `${Math.max(5, overflow / 18)}s`
      );
      title.classList.add("is-scrolling");
    }
  });
}


function loadTrack(index, autoplay = false) {
  currentTrack = (index + tracks.length) % tracks.length;
  const track = tracks[currentTrack];

  title.textContent = track.title;
  artist.textContent = track.artist;

  audio.src = track.src;
  audio.load();

  playPause.textContent = "▶";
  playPause.setAttribute("aria-label", "Reproducir");

  updateTitleMarquee();
  renderTracklist();

  if (autoplay) playAudio();
}

async function playAudio() {
  try {
    await audio.play();
  } catch (error) {
    console.error("No se ha podido reproducir la canción:", error);
  }
}

radioButton?.addEventListener("click", () => {
  player.hidden = !player.hidden;
  radioButton.setAttribute("aria-expanded", String(!player.hidden));

  if (!player.hidden && !audio.src) {
    loadTrack(currentTrack);
  }
});

playPause?.addEventListener("click", () => {
  if (audio.paused) {
    playAudio();
  } else {
    audio.pause();
  }
});

audio.addEventListener("play", () => {
  playPause.textContent = "Ⅱ";
  playPause.setAttribute("aria-label", "Pausar");
});

audio.addEventListener("pause", () => {
  playPause.textContent = "▶";
  playPause.setAttribute("aria-label", "Reproducir");
  renderTracklist();
});

previousButton?.addEventListener("click", () => {
  loadTrack(currentTrack - 1, true);
});

nextButton?.addEventListener("click", () => {
  loadTrack(currentTrack + 1, true);
});

audio.addEventListener("ended", () => {
  loadTrack(currentTrack + 1, true);
});

/* Abrir y cerrar el volumen vertical */
volumeButton?.addEventListener("click", () => {
  const open = volumePopup.hidden;
  volumePopup.hidden = !open;
  volumeButton.setAttribute("aria-expanded", String(open));
});

volumeSlider?.addEventListener("input", () => {
  audio.volume = Number(volumeSlider.value);
  audio.muted = false;

  if (audio.volume > 0) previousVolume = audio.volume;

  volumeButton.textContent = audio.volume === 0 ? "MUTE" : "VOL";
});

volumeButton?.addEventListener("dblclick", () => {
  if (audio.muted || audio.volume === 0) {
    audio.muted = false;
    audio.volume = previousVolume || 0.7;
  } else {
    previousVolume = audio.volume;
    audio.volume = 0;
  }

  volumeSlider.value = String(audio.volume);
});

/* Flecha de la tracklist */
tracklistToggle?.addEventListener("click", () => {
  const open = !player.classList.contains("is-expanded");

  player.classList.toggle("is-expanded", open);
  tracklistToggle.setAttribute("aria-expanded", String(open));
  tracklistPanel.setAttribute("aria-hidden", String(!open));
});

/* Construir las canciones del desplegable */
function renderTracklist() {
  if (!tracklistItems) return;

  tracklistItems.replaceChildren();

  if (trackCount) {
    trackCount.textContent = `${String(tracks.length).padStart(2, "0")} TRACKS`;
  }

  tracks.forEach((track, index) => {
    const row = document.createElement("button");
    row.type = "button";
    row.className = "track-row";
    row.classList.toggle("is-playing", index === currentTrack);

    const number = document.createElement("span");
    number.className = "track-row-number";
    number.textContent = String(index + 1).padStart(2, "0");

    const info = document.createElement("span");
    info.className = "track-row-info";

    const songTitle = document.createElement("span");
    songTitle.className = "track-row-title";
    songTitle.textContent = track.title;

    const songArtist = document.createElement("span");
    songArtist.className = "track-row-artist";
    songArtist.textContent = track.artist;

    const state = document.createElement("span");
    state.className = "track-row-state";
    state.textContent = index === currentTrack && !audio.paused ? "Ⅱ" : "▶";

    info.append(songTitle, songArtist);
    row.append(number, info, state);

    row.addEventListener("click", () => {
      loadTrack(index, true);
    });

    tracklistItems.appendChild(row);
  });
}

audio.addEventListener("play", renderTracklist);
window.addEventListener("resize", updateTitleMarquee);

audio.volume = 0.7;
if (volumeSlider) volumeSlider.value = "0.7";

loadTrack(0);

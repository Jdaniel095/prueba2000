/* =========================================================
   STORY APP (cinematográfico + ambience por escena + stepImage)
   - Crossfade imágenes (imgA/imgB)
   - StepImage: cambia a una sub-imagen SOLO en ese step y vuelve luego
   - Sub NO sale automático: aparece con un click extra (mismo step)
   - Ambience por escena con fade, NO se corta al pasar a video final
   - Video final con volumen configurable (muted true por defecto)
   ========================================================= */

/* -------------------- DOM -------------------- */
const imgA = document.getElementById("imgA");
const imgB = document.getElementById("imgB");
const vidEl = document.getElementById("sceneVideo");
const overlay = document.getElementById("overlay");
const progress = document.getElementById("progress");
const counter = document.getElementById("counter");
const stage = document.getElementById("stage");

// Audio
const bgAudio = document.getElementById("bgAudio"); // música general
const fxAudio = document.getElementById("fxAudio"); // ambiente por escena (dinámico)
let audioStarted = false;

/* -------------------- DATA -------------------- */
/**
 * scenes[].ambience opcional:
 *  ambience: { src: "assets/forest.mp3", volume: 0.10, loop:true }
 *
 * steps[].stepVideo opcional:
 *  stepVideo: { src:"assets/vid5.mp4", loop:true, muted:true, volume:0.0 }
 *
 * steps[].stepImage opcional:
 *  stepImage: "assets/subescena2.png"
 *
 * steps[].pos opcional (para CSS):
 *  pos: "pos-center" | "pos-bottom" | "pos-top" | "pos-topLeft" | "pos-topRight" | "pos-bottomLeft" | "pos-bottomRight"
 */
const scenes = [
  {
    id: 0,
    type: "image",
    src: "assets/escena0.jpg",
    ambience: { src: "assets/amb_space.mp3", volume: 0.08, loop: true },
    steps: [
  {
    title: "Esta historia no empezó en un lugar…",
    sub: "empezó en una pantalla.",
    pos: "pos-bottom"
  },
  {
    title: "Y sin darnos cuenta…",
    sub: "ya estábamos a punto de vivir algo muy real.",
    pos: "pos-bottom"
  }
]

  },
  {
    id: 1,
    type: "image",
    src: "assets/escena1.png",
    ambience: { src: "assets/amb_room.mp3", volume: 0.07, loop: true },
    steps: [
  {
    title: "Te conocí jugando Wild Rift.",
    sub: "Tú pensabas que yo te odiaba por jugar en mi misma línea…",
    pos: "pos-bottom"
  },
  {
    title: "Pero la verdad es que ahí empezó todo.",
    sub: "Como si el destino decidiera meterse a jugar con nosotros.",
    pos: "pos-bottom"
  },
  {
    title: "Entre partidas, bromas y risas…",
    sub: "dejaste de ser solo alguien del juego y empezaste a quedarte conmigo.",
    stepImage: "assets/subescena1.png",
    pos: "pos-bottom"
  }
]

  },
  {
    id: 2,
    type: "image",
    src: "assets/escena2.png",
    ambience: { src: "assets/amb_night.mp3", volume: 0.08, loop: true },
  steps: [
  {
    title: "Entre mensajes que se alargaban…",
    sub: "llegó una madrugada que lo cambió todo.",
    pos: "pos-bottom"
  },
  {
    title: "Era 31 de diciembre.",
    sub: "Mientras el año se despedía, yo hablaba contigo por celular.",
    pos: "pos-bottom"
  },
  {
    title: "Con nervios, pero seguro de lo que sentía…",
    sub: "te lo pregunté.",
    pos: "pos-bottom"
  },
  {
    title: "¿Quieres ser mi novia?",
    sub: "Y desde ahí, empezamos a elegirnos.",
    stepImage: "assets/subescena2.png",
    pos: "pos-bottom"
  }
]

  },
  {
    id: 3,
    type: "image",
    src: "assets/escena3.png",
    ambience: { src: "assets/amb_city.mp3", volume: 0.07, loop: true },
 steps: [
    {
      title: "Después de eso, pensé en tener un detalle contigo.",
      sub: "algo simple, pero con cariño.",
      pos: "pos-bottom"
    },
    {
      title: "Fui a una tienda donde había visto algo días antes.",
      sub: "pensé que todavía estaría ahí.",
      pos: "pos-bottom"
    },
    {
      title: "Cuando llegué, ya no estaba.",
      sub: "y tampoco lo encontré en otros lados.",
      pos: "pos-bottom"
    },
    {
      title: "Así que me moví de un lugar a otro.",
      sub: "sin apuro… pero pensando en ti todo el tiempo.",
      pos: "pos-bottom"
  }
]

  },
  {
    id: 4,
    type: "image",
    src: "assets/escena4.jpg",
    ambience: { src: "assets/forest.mp3", volume: 0.10, loop: true },
   steps: [
  {
    title: "Con el regalo al fin en mis manos…",
    sub: "fui directo al parque.",
    pos: "pos-bottom"
  },
  {
    title: "Entré con la mochila y la bolsita apretada.",
    sub: "sabía que estaba a punto de verte.",
    pos: "pos-bottom"
  },
  {
    title: "Me acerqué a la baranda frente a la laguna.",
    sub: "respiré… porque ese momento podía cambiarlo todo.",
    pos: "pos-bottom"
  }
]

  },
  {
    id: 5,
    type: "image",
    src: "assets/escena5.png",
    ambience: { src: "assets/forest.mp3", volume: 0.10, loop: true },
    steps: [
  {
    title: "Nuestra primera videollamada fue ahí.",
    sub: "Tú en tu parque… yo frente a la laguna.",
    pos: "pos-bottom"
  },
  {
    title: "Intentaba verme calmado.",
    sub: "pero por dentro estaba temblando.",
    pos: "pos-bottom"
  },
  {
    title: "No era solo una llamada.",
    sub: "eras tú.",
    stepImage: "assets/subescena3.png",
    pos: "pos-bottom"
  }
]

  },
  {
    id: 6,
    type: "image",
    src: "assets/escena6.png",
    ambience: { src: "assets/amb_fire.mp3", volume: 0.06, loop: true },
   steps: [
  {
    title: "Después de verte, entendí algo importante.",
    sub: "el amor también vive en los pequeños gestos.",
    pos: "pos-bottom"
  },
  {
    title: "Tú me enseñaste a dar detalles simples.",
    sub: "donde lo único que importa es el amor.",
    pos: "pos-bottom"
  },
  {
    title: "Hicimos nuestras manualidades.",
    sub: "yo te hice una cajita… tú me regalaste palabras que guardo en el corazón.",
    pos: "pos-bottom"
  }
]

  },
  {
    id: 7,
    type: "image",
    src: "assets/escena7.png",
    ambience: { src: "assets/amb_home.mp3", volume: 0.06, loop: true },
  steps: [
  {
    title: "Comimos pastel en videollamada.",
    sub: "era nuestro aniversario.",
    pos: "pos-bottom"
  },
  {
    title: "No compartimos la misma mesa…",
    sub: "pero sí el mismo momento.",
    pos: "pos-bottom"
  }
]

  },
  {
    id: 8,
    type: "image",
    src: "assets/escena8.png",
    ambience: { src: "assets/amb_soft.mp3", volume: 0.05, loop: true },
    steps: [
  {
    title: "Para mi cumpleaños me regalaste algo único.",
    sub: "",
    pos: "pos-bottom"
  },
  {
    title: "Un video lleno de amor.",
    sub: "ese día me sentí querido, elegido y acompañado.",
    pos: "pos-bottom"
  }
]

  },
  {
    id: 9,
    type: "image",
    src: "assets/escena9.png",
    ambience: { src: "assets/amb_wind.mp3", volume: 0.06, loop: true },
   steps: [
  {
    title: "Todo eso nos fue trayendo hasta aquí.",
    sub: "una historia distinta.",
    pos: "pos-bottom"
  },
  {
    title: "Nuestra historia no empezó como las demás.",
    sub: "empezó lejos… pero sincera.",
    stepImage: "assets/subescena9.png",
    pos: "pos-bottom"
  }
]

  },
  {
    id: 10,
    type: "image",
    src: "assets/escena10.png",
    ambience: { src: "assets/amb_final.mp3", volume: 0.20, loop: true },
    steps: [
  {
    title: "Te amo, mi pequeña bebé.",
    sub: "",
    pos: "pos-center"
  },
  {
    title: "Por muchos años más juntos.",
    sub: "",
    pos: "pos-center"
  }
]
,
    endVideo: {
      src: "assets/vid10.mp4",
      title: "Feliz Primer Año,Mi Pequeña Dramatica :D",
      muted: true,      // ✅ cambia a false si quieres oírlo
      volume: 0.15      // ✅ si muted=false, este es el volumen del video final
    },
  },
];

/* -------------------- STATE -------------------- */
let sceneIndex = 0;
let stepIndex = 0;
let isAnimating = false;
let hasPlayedFinalVideo = false;

// Crossfade imágenes
let front = imgA;
let back = imgB;

// Ambience por escena
let currentFxSrc = "";

// StepVideo / StepImage
let isStepVideoPlaying = false;
let isStepImageActive = false;

// Sub: aparece con click extra (misma slide)
let isSubRevealed = false;

/* =========================================================
   HELPERS
   ========================================================= */
function escapeHtml(s){
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[c]));
}

/* ---- fade genérico (opacity) ---- */
function fadeElTo(el, targetOpacity, ms=500){
  if(!el) return Promise.resolve();
  const start = parseFloat(getComputedStyle(el).opacity || "1");
  const diff = targetOpacity - start;
  const t0 = performance.now();

  return new Promise((resolve) => {
    function tick(t){
      const p = Math.min(1, (t - t0) / ms);
      el.style.opacity = String(start + diff * p);
      if(p < 1) requestAnimationFrame(tick);
      else resolve();
    }
    requestAnimationFrame(tick);
  });
}

/* ---- fade audio ---- */
function fadeAudioTo(audioEl, target, ms=900){
  if(!audioEl) return Promise.resolve();
  const start = audioEl.volume ?? 0;
  const diff = target - start;
  const t0 = performance.now();

  return new Promise((resolve) => {
    function tick(t){
      const p = Math.min(1, (t - t0) / ms);
      audioEl.volume = Math.max(0, Math.min(1, start + diff * p));
      if(p < 1) requestAnimationFrame(tick);
      else resolve();
    }
    requestAnimationFrame(tick);
  });
}

/* ---- UI dots (si lo quieres visible) ---- */
function buildProgress(){
  if(!progress) return;
  progress.innerHTML = "";
  for(let i=0;i<scenes.length;i++){
    const d = document.createElement("div");
    d.className = "dot" + (i === sceneIndex ? " active" : "");
    progress.appendChild(d);
  }
}
function setCounter(){
  if(!counter) return;
  counter.textContent = `Escena ${sceneIndex}/${scenes.length-1}`;
}

/* =========================================================
   MEDIA: image / stepImage / video
   ========================================================= */
function stopVideo(){
  try { vidEl.pause(); } catch(e){}
  vidEl.removeAttribute("src");
  vidEl.load();
  vidEl.style.display = "none";
  vidEl.style.opacity = "0";
  vidEl.loop = false;
  vidEl.muted = false;
  isStepVideoPlaying = false;
}

function showImageCrossfade(src){
  // si había stepVideo, sacarlo suave (sin cortar ambience)
  if(isStepVideoPlaying){
    fadeElTo(vidEl, 0, 350).finally(() => stopVideo());
  }

  back.onload = () => {
    back.classList.add("is-active");
    front.classList.remove("is-active");
    const tmp = front; front = back; back = tmp;
    back.onload = null;
  };
  back.src = src;
}

async function showStepImage(stepImageSrc, sc){
  if(!stepImageSrc) return;

  // si venía stepVideo, apagar
  await stopStepVideoToSceneImage(sc);

  // mostrar imagen extra
  showImageCrossfade(stepImageSrc);
  isStepImageActive = true;
}

async function stopStepImageToSceneImage(sc){
  if(!isStepImageActive) return;
  showImageCrossfade(sc.src);
  isStepImageActive = false;
}

// imagen -> video (stepVideo)
async function playStepVideo(stepVideo, sc){
  if(!stepVideo?.src) return;

  // si había stepImage activo, volver a base primero
  await stopStepImageToSceneImage(sc);

  vidEl.style.display = "block";
  vidEl.style.opacity = "0";
  vidEl.src = stepVideo.src;
  vidEl.currentTime = 0;
  vidEl.loop = stepVideo.loop ?? true;
  vidEl.muted = stepVideo.muted ?? true;
  vidEl.playsInline = true;
  if(typeof stepVideo.volume === "number") vidEl.volume = Math.max(0, Math.min(1, stepVideo.volume));

  try { await vidEl.play(); } catch(e){}
  await fadeElTo(vidEl, 1, 600);
  isStepVideoPlaying = true;
}

// video -> imagen base
async function stopStepVideoToSceneImage(sc){
  if(!isStepVideoPlaying) return;
  await fadeElTo(vidEl, 0, 450);
  stopVideo();
  showImageCrossfade(sc.src);
}

/* =========================================================
   CAPTION: sub con click extra + posición opcional
   ========================================================= */
function showCaption(step){
  const { title, sub, pos } = step || {};
  overlay.innerHTML = "";

  const box = document.createElement("div");
  box.className = "caption enter";

  // posición opcional (usa clases del CSS)
  if(pos) box.classList.add(pos);

  box.innerHTML = `
    <div class="title">${escapeHtml(title || "")}</div>
    ${sub ? `<div class="sub">${escapeHtml(sub)}</div>` : ``}
  `;
  overlay.appendChild(box);

  // al mostrar caption: sub oculto hasta click (si existe)
  isSubRevealed = !sub; // si no hay sub, ya está "revelado"
  box.classList.remove("show-sub");

  // efecto "typing" lento: solo cursor, el texto ya está completo (JS no corta letras)
  // (si quieres typing real letra por letra, te lo armo después)
  box.classList.add("typing");
  setTimeout(() => box.classList.remove("typing"), 2400); // 👈 más lento

  return box;
}

function revealSubIfNeeded(){
  const current = overlay.querySelector(".caption");
  if(!current) return false;
  const hasSub = !!current.querySelector(".sub");
  if(!hasSub) return false;
  if(isSubRevealed) return false;

  current.classList.add("show-sub");
  isSubRevealed = true;
  return true; // consumimos el click
}

function animateOutCurrentCaption(){
  const current = overlay.querySelector(".caption");
  if(!current) return Promise.resolve();
  return new Promise((res) => {
    current.classList.remove("enter");
    current.classList.add("exit");
    current.addEventListener("animationend", () => res(), {once:true});
  });
}

/* =========================================================
   AUDIO: bg + ambience por escena (NO se corta en final)
   ========================================================= */
function startAmbientAudioOnce(){
  if(audioStarted || !bgAudio) return;
  audioStarted = true;

  bgAudio.volume = 0.0;
  bgAudio.loop = true;

  bgAudio.play().then(() => {
    fadeAudioTo(bgAudio, 0.22, 1200);
  }).catch(() => {
    audioStarted = false;
  });
}

// Ambience por escena (si falta, no rompe)
async function applySceneAmbience(sc){
  if(!fxAudio) return;

  const amb = sc?.ambience;
  const nextSrc = amb?.src || "";
  const nextVol = (typeof amb?.volume === "number") ? amb.volume : 0.10;
  const nextLoop = (amb?.loop !== false); // default true

  // Si no hay ambience: apagar suave
  if(!nextSrc){
    if(currentFxSrc){
      await fadeAudioTo(fxAudio, 0.0, 700);
      try { fxAudio.pause(); } catch(e){}
      fxAudio.currentTime = 0;
      currentFxSrc = "";
    }
    return;
  }

  // Si es el mismo archivo: ajusta volumen
  if(currentFxSrc === nextSrc){
    fxAudio.loop = nextLoop;
    await fadeAudioTo(fxAudio, nextVol, 450);
    return;
  }

  // Cambiar de uno a otro (fade out -> load -> fade in)
  if(currentFxSrc){
    await fadeAudioTo(fxAudio, 0.0, 550);
    try { fxAudio.pause(); } catch(e){}
    fxAudio.currentTime = 0;
  }

  currentFxSrc = nextSrc;
  fxAudio.src = nextSrc;
  fxAudio.currentTime = 0;
  fxAudio.loop = nextLoop;
  fxAudio.volume = 0.0;

  try {
    await fxAudio.play();
    await fadeAudioTo(fxAudio, nextVol, 800);
  } catch(e){
    // si falla (bloqueo / archivo no existe), no romper
    try { fxAudio.pause(); } catch(_e){}
    currentFxSrc = "";
  }
}

/* =========================================================
   SCENE LOAD
   ========================================================= */
async function loadScene(idx){
  const sc = scenes[idx];
  sceneIndex = idx;
  stepIndex = 0;

  buildProgress();
  setCounter();

  // reset step states
  isStepImageActive = false;
  isStepVideoPlaying = false;
  isSubRevealed = false;

  // mostrar imagen base
  showImageCrossfade(sc.src);
  overlay.innerHTML = "";

  // ambience con fade
  await applySceneAmbience(sc);
}

/* =========================================================
   FINAL VIDEO (NO corta fx ambience de escena 10)
   ========================================================= */
async function playFinalVideo(sc){
  await animateOutCurrentCaption();

  // apagar stepVideo/stepImage si estaban
  await stopStepVideoToSceneImage(sc);
  await stopStepImageToSceneImage(sc);

  // bajar música general un poquito durante el final (pero NO tocar fxAudio)
  await fadeAudioTo(bgAudio, 0.14, 650);

  // ocultar imágenes (video arriba)
  imgA.classList.remove("is-active");
  imgB.classList.remove("is-active");

  // configurar video final
  vidEl.style.display = "block";
  vidEl.style.opacity = "0";
  vidEl.src = sc.endVideo.src;
  vidEl.currentTime = 0;
  vidEl.loop = false;

  // ✅ control de audio del video final
  const muted = sc.endVideo.muted ?? true;
  const vol = (typeof sc.endVideo.volume === "number") ? sc.endVideo.volume : 0.15;
  vidEl.muted = muted;
  if(!muted) vidEl.volume = Math.max(0, Math.min(1, vol));

  try { await vidEl.play(); } catch(e){}
  await fadeElTo(vidEl, 1, 700);

  // título encima
  overlay.innerHTML = "";
  const title = document.createElement("div");
  title.className = "finalTitle enter";
  title.textContent = sc.endVideo.title;
  overlay.appendChild(title);

  hasPlayedFinalVideo = true;

  // cuando termine, devolver música general
  vidEl.onended = () => {
    fadeAudioTo(bgAudio, 0.22, 800);
  };
}

/* =========================================================
   CLICK ADVANCE
   - click 1: muestra título
   - click 2 (si hay sub): revela sub (mismo step)
   - click 3: pasa al siguiente step
   ========================================================= */
async function next(){
  if(isAnimating) return;
  isAnimating = true;

  startAmbientAudioOnce();

  const sc = scenes[sceneIndex];

  // reintento por si el navegador bloqueó antes
  await applySceneAmbience(sc);

  // si hay sub y no está revelado: este click SOLO revela sub
  if(revealSubIfNeeded()){
    isAnimating = false;
    return;
  }

  // FINAL: después de terminar steps
  if(sceneIndex === 10 && stepIndex >= sc.steps.length && sc.endVideo && !hasPlayedFinalVideo){
    await playFinalVideo(sc);
    isAnimating = false;
    return;
  }
  if(sceneIndex === 10 && hasPlayedFinalVideo){
    isAnimating = false;
    return;
  }

  // STEP
  if(stepIndex < sc.steps.length){
    const step = sc.steps[stepIndex];

    // salir caption anterior
    await animateOutCurrentCaption();

    // manejar step media
    if(step.stepVideo){
      await playStepVideo(step.stepVideo, sc);
    } else if(step.stepImage){
      await showStepImage(step.stepImage, sc);
    } else {
      // si veníamos de stepVideo/stepImage, volver a base
      await stopStepVideoToSceneImage(sc);
      await stopStepImageToSceneImage(sc);
    }

    // mostrar caption (sub oculto hasta próximo click)
    showCaption(step);
    stepIndex++;

    isAnimating = false;
    return;
  }

  // SEE NEXT SCENE
  if(sceneIndex < scenes.length - 1){
    await animateOutCurrentCaption();

    // limpiar step media
    await stopStepVideoToSceneImage(sc);
    await stopStepImageToSceneImage(sc);

    await loadScene(sceneIndex + 1);

    // mostrar primer step
    const first = scenes[sceneIndex].steps[0];
    // aplicar step media si existe
    if(first.stepVideo){
      await playStepVideo(first.stepVideo, scenes[sceneIndex]);
    } else if(first.stepImage){
      await showStepImage(first.stepImage, scenes[sceneIndex]);
    }
    showCaption(first);
    stepIndex = 1;
  }

  isAnimating = false;
}

stage.addEventListener("click", next);

/* =========================================================
   INIT
   ========================================================= */
loadScene(0).then(() => {
  showCaption(scenes[0].steps[0]);
  stepIndex = 1;
});

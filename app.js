/* =========================================================
   STORY APP (cinematográfico + ambience por escena + stepImage)
   - Crossfade imágenes (imgA/imgB) esperando decode/load
   - StepImage: cambia a una sub-imagen SOLO en ese step y vuelve luego
   - Sub NO sale automático: aparece con un click extra (mismo step)
   - Ambience por escena con fade, NO se corta al pasar a video final
   - Video final con volumen configurable (muted true por defecto)
   - FIX: caption se muestra SOLO cuando media está listo (no mezcla)
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
const scenes = [
  {
    id: 0,
    type: "image",
    src: "assets/escena0.jpg",
    ambience: { src: "assets/amb_space.mp3", volume: 0.08, loop: true },
    steps: [
      { title: "Esta historia no empezó en un lugar…", sub: "empezó en una pantalla.", pos: "pos-bottom" },
      { title: "Y sin darnos cuenta…", sub: "ya estábamos a punto de vivir algo muy real.", pos: "pos-bottom" }
    ]
  },
  {
    id: 1,
    type: "image",
    src: "assets/escena1.png",
    ambience: { src: "assets/amb_room.mp3", volume: 0.07, loop: true },
    steps: [
      { title: "Te conocí jugando Wild Rift.", sub: "Tú pensabas que yo te odiaba por jugar en mi misma línea…", pos: "pos-bottom" },
      { title: "Pero la verdad es que ahí empezó todo.", sub: "Como si el destino decidiera meterse a jugar con nosotros.", pos: "pos-bottom" },
      { title: "Entre partidas, bromas y risas…", sub: "dejaste de ser solo alguien del juego y empezaste a quedarte conmigo.", stepImage: "assets/subescena1.png", pos: "pos-bottom" }
    ]
  },
  {
    id: 2,
    type: "image",
    src: "assets/escena2.png",
    ambience: { src: "assets/amb_night.mp3", volume: 0.08, loop: true },
    steps: [
      { title: "Entre mensajes que se alargaban…", sub: "llegó una madrugada que lo cambió todo.", pos: "pos-bottom" },
      { title: "Era 31 de diciembre.", sub: "Mientras el año se despedía, yo hablaba contigo por celular.", pos: "pos-bottom" },
      { title: "Con nervios, pero seguro de lo que sentía…", sub: "te lo pregunté.", pos: "pos-bottom" },
      { title: "¿Quieres ser mi novia?", sub: "Y desde ahí, empezamos a elegirnos.", stepImage: "assets/subescena2.png", pos: "pos-bottom" }
    ]
  },
  {
    id: 3,
    type: "image",
    src: "assets/escena3.png",
    ambience: { src: "assets/amb_city.mp3", volume: 0.04, loop: true },
    steps: [
      { title: "Después de eso, pensé en tener un detalle contigo.", sub: "algo simple, pero con cariño.", pos: "pos-bottom" },
      { title: "Fui a una tienda donde había visto algo días antes.", sub: "pensé que todavía estaría ahí.", pos: "pos-bottom" },
      { title: "Cuando llegué, ya no estaba.", sub: "y tampoco lo encontré en otros lados.", pos: "pos-bottom" },
      { title: "Así que me moví de un lugar a otro.", sub: "sin apuro… pero pensando en ti todo el tiempo.", pos: "pos-bottom" }
    ]
  },
  {
    id: 4,
    type: "image",
    src: "assets/escena4.jpg",
    ambience: { src: "assets/forest.mp3", volume: 0.06, loop: true },
    steps: [
      { title: "Con el regalo al fin en mis manos…", sub: "fui directo al parque.", pos: "pos-bottom" },
      { title: "Entré con la mochila y la bolsita apretada.", sub: "sabía que estaba a punto de verte.", pos: "pos-bottom" },
      { title: "Me acerqué a la baranda frente a la laguna.", sub: "respiré… porque ese momento podía cambiarlo todo.", pos: "pos-bottom" }
    ]
  },
  {
    id: 5,
    type: "image",
    src: "assets/escena5.png",
    ambience: { src: "assets/forest.mp3", volume: 0.10, loop: true },
    steps: [
      { title: "Nuestra primera videollamada fue ahí.", sub: "Tú en tu parque… yo frente a la laguna.", pos: "pos-bottom" },
      { title: "Intentaba verme calmado.", sub: "pero por dentro estaba temblando.", pos: "pos-bottom" },
      { title: "No era solo una llamada.", sub: "eras tú.", stepImage: "assets/subescena3.png", pos: "pos-bottom" }
    ]
  },
  {
    id: 6,
    type: "image",
    src: "assets/escena6.png",
    ambience: { src: "assets/amb_fire.mp3", volume: 0.06, loop: true },
    steps: [
      { title: "Después de verte, entendí algo importante.", sub: "el amor también vive en los pequeños gestos.", pos: "pos-bottom" },
      { title: "Tú me enseñaste a dar detalles simples.", sub: "donde lo único que importa es el amor.", pos: "pos-bottom" },
      { title: "Hicimos nuestras manualidades.", sub: "yo te hice una cajita… tú me regalaste palabras que guardo en el corazón.", pos: "pos-bottom" }
    ]
  },
  {
    id: 7,
    type: "image",
    src: "assets/escena7.png",
    ambience: { src: "assets/amb_home.mp3", volume: 0.06, loop: true },
    steps: [
      { title: "Comimos pastel en videollamada.", sub: "era nuestro aniversario.", pos: "pos-bottom" },
      { title: "No compartimos la misma mesa…", sub: "pero sí el mismo momento.", pos: "pos-bottom" }
    ]
  },
  {
    id: 8,
    type: "image",
    src: "assets/escena8.png",
    ambience: { src: "assets/amb_soft.mp3", volume: 0.05, loop: true },
    steps: [
      { title: "Para mi cumpleaños me regalaste algo único.", sub: "", pos: "pos-bottom" },
      { title: "Un video lleno de amor.", sub: "ese día me sentí querido, elegido y acompañado.", pos: "pos-bottom" }
    ]
  },
  {
    id: 9,
    type: "image",
    src: "assets/escena9.png",
    ambience: { src: "assets/amb_wind.mp3", volume: 0.06, loop: true },
        steps: [
      { title: "Todo eso nos fue trayendo hasta aquí.", sub: "una historia distinta.", pos: "pos-bottom" },
      { title: "Nuestra historia no empezó como las demás.", sub: "empezó lejos… pero sincera.", stepImage: "assets/subescena9.png", pos: "pos-bottom" }


steps: [
    {
      title: "Todo eso nos fue trayendo hasta aquí.",
      sub: "una historia distinta.",
      pos: "pos-bottom"
    },
    {
      title: "Nuestra historia no empezó como las demás.",
      sub: "empezó lejos… pero sincera.",
      pos: "pos-bottom"
    },
    {
      title: "Y cuando algo nace así…",
      sub: "con paciencia, con verdad y con cariño real…", stepImage: "assets/subescena9.png",
      pos: "pos-bottom"
    },
    {
      title: "se queda.",
      sub: "crece… y se vuelve hogar.",
      pos: "pos-bottom" }
    ]
  },
{
  id: 10,
  type: "image",
  src: "assets/escena10.png",
  ambience: { src: "assets/amb_final.mp3", volume: 0.20, loop: true },
  steps: [
    {
      title: "Y por eso hoy puedo decirlo sin dudas…",
      sub: "",
      pos: "pos-center"
    },
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
  ],
  endVideo: {
    src: "assets/vid10.mp4",
    title: "Feliz Primer Año, Mi Pequeña Dramática :D",
    muted: true,
    volume: 0.15
  }
}

];

/* -------------------- PRELOAD -------------------- */
function collectAssetsFromScenes(scenes){
  const imgs = [];
  const videos = [];
  const audios = [];

  for (const sc of scenes){
    if (sc.src) imgs.push(sc.src);
    if (sc.ambience?.src) audios.push(sc.ambience.src);
    if (sc.endVideo?.src) videos.push(sc.endVideo.src);

    for (const st of (sc.steps || [])){
      if (st.stepImage) imgs.push(st.stepImage);
      if (st.stepVideo?.src) videos.push(st.stepVideo.src);
    }
  }
  return {
    imgs: [...new Set(imgs)],
    videos: [...new Set(videos)],
    audios: [...new Set(audios)],
  };
}

function preloadImage(src){
  return new Promise((resolve) => {
    const im = new Image();
    im.onload = () => resolve(true);
    im.onerror = () => resolve(false);
    im.src = src;
  });
}

function preloadVideo(src){
  return new Promise((resolve) => {
    const v = document.createElement("video");
    v.preload = "auto";
    v.muted = true;
    v.playsInline = true;
    v.onloadeddata = () => resolve(true);
    v.onerror = () => resolve(false);
    v.src = src;
    v.load();
  });
}

function preloadAudio(src){
  return new Promise((resolve) => {
    const a = document.createElement("audio");
    a.preload = "auto";
    a.oncanplaythrough = () => resolve(true);
    a.onerror = () => resolve(false);
    a.src = src;
    a.load();
  });
}

async function preloadAllAssets(){
  const { imgs, videos, audios } = collectAssetsFromScenes(scenes);
  await Promise.all(imgs.map(preloadImage));
  await Promise.all([
    ...videos.map(preloadVideo),
    ...audios.map(preloadAudio),
  ]);
}

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

/* ---- UI dots ---- */
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
   MEDIA READY HELPERS
   ========================================================= */
function waitImageReady(imgEl){
  if (imgEl.decode) {
    return imgEl.decode().catch(() => {});
  }
  return new Promise((res) => {
    if (imgEl.complete && imgEl.naturalWidth > 0) return res();
    imgEl.onload = () => res();
    imgEl.onerror = () => res();
  });
}

function waitVideoReady(v){
  return new Promise((res) => {
    const done = () => res();
    v.addEventListener("canplay", done, { once:true });
    v.addEventListener("loadeddata", done, { once:true });
    v.addEventListener("error", done, { once:true });
  });
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

async function showImageCrossfade(src){
  if(isStepVideoPlaying){
    await fadeElTo(vidEl, 0, 350).catch(()=>{});
    stopVideo();
  }

  back.src = src;
  await waitImageReady(back);

  back.classList.add("is-active");
  front.classList.remove("is-active");
  const tmp = front; front = back; back = tmp;
}

async function showStepImage(stepImageSrc, sc){
  if(!stepImageSrc) return;
  await stopStepVideoToSceneImage(sc);
  await showImageCrossfade(stepImageSrc);
  isStepImageActive = true;
}

async function stopStepImageToSceneImage(sc){
  if(!isStepImageActive) return;
  await showImageCrossfade(sc.src);
  isStepImageActive = false;
}

// imagen -> video (stepVideo)
async function playStepVideo(stepVideo, sc){
  if(!stepVideo?.src) return;

  await stopStepImageToSceneImage(sc);

  vidEl.style.display = "block";
  vidEl.style.opacity = "0";
  vidEl.src = stepVideo.src;
  vidEl.currentTime = 0;
  vidEl.loop = stepVideo.loop ?? true;
  vidEl.muted = stepVideo.muted ?? true;
  vidEl.playsInline = true;
  if(typeof stepVideo.volume === "number") vidEl.volume = Math.max(0, Math.min(1, stepVideo.volume));

  vidEl.load();
  await waitVideoReady(vidEl);

  try { await vidEl.play(); } catch(e){}
  await fadeElTo(vidEl, 1, 600);
  isStepVideoPlaying = true;
}

// video -> imagen base
async function stopStepVideoToSceneImage(sc){
  if(!isStepVideoPlaying) return;
  await fadeElTo(vidEl, 0, 450);
  stopVideo();
  await showImageCrossfade(sc.src);
}

/* =========================================================
   CAPTION: sub con click extra + posición opcional
   ========================================================= */
function showCaption(step){
  const { title, sub, pos } = step || {};
  overlay.innerHTML = "";

  const box = document.createElement("div");
  box.className = "caption enter";

  if(pos) box.classList.add(pos);

  box.innerHTML = `
    <div class="title">${escapeHtml(title || "")}</div>
    ${sub ? `<div class="sub">${escapeHtml(sub)}</div>` : ``}
  `;
  overlay.appendChild(box);

  isSubRevealed = !sub;
  box.classList.remove("show-sub");

  box.classList.add("typing");
  setTimeout(() => box.classList.remove("typing"), 2400);

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
  return true;
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

async function applySceneAmbience(sc){
  if(!fxAudio) return;

  const amb = sc?.ambience;
  const nextSrc = amb?.src || "";
  const nextVol = (typeof amb?.volume === "number") ? amb.volume : 0.10;
  const nextLoop = (amb?.loop !== false);

  if(!nextSrc){
    if(currentFxSrc){
      await fadeAudioTo(fxAudio, 0.0, 700);
      try { fxAudio.pause(); } catch(e){}
      fxAudio.currentTime = 0;
      currentFxSrc = "";
    }
    return;
  }

  if(currentFxSrc === nextSrc){
    fxAudio.loop = nextLoop;
    await fadeAudioTo(fxAudio, nextVol, 450);
    return;
  }

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
    try { fxAudio.pause(); } catch(_e){}
    currentFxSrc = "";
  }
}

/* =========================================================
   SCENE LOAD (espera imagen lista)
   ========================================================= */
async function loadScene(idx){
  const sc = scenes[idx];
  sceneIndex = idx;
  stepIndex = 0;

  buildProgress();
  setCounter();

  isStepImageActive = false;
  isStepVideoPlaying = false;
  isSubRevealed = false;

  overlay.innerHTML = "";

  // Imagen base lista antes de seguir
  await showImageCrossfade(sc.src);

  await applySceneAmbience(sc);
}

/* =========================================================
   FINAL VIDEO (NO corta fx ambience de escena 10)
   ========================================================= */
async function playFinalVideo(sc){
  await animateOutCurrentCaption();

  await stopStepVideoToSceneImage(sc);
  await stopStepImageToSceneImage(sc);

  await fadeAudioTo(bgAudio, 0.14, 650);

  imgA.classList.remove("is-active");
  imgB.classList.remove("is-active");

  vidEl.style.display = "block";
  vidEl.style.opacity = "0";
  vidEl.src = sc.endVideo.src;
  vidEl.currentTime = 0;
  vidEl.loop = false;

  const muted = sc.endVideo.muted ?? true;
  const vol = (typeof sc.endVideo.volume === "number") ? sc.endVideo.volume : 0.15;
  vidEl.muted = muted;
  if(!muted) vidEl.volume = Math.max(0, Math.min(1, vol));

  vidEl.load();
  await waitVideoReady(vidEl);

  try { await vidEl.play(); } catch(e){}
  await fadeElTo(vidEl, 1, 700);

  overlay.innerHTML = "";
  const title = document.createElement("div");
  title.className = "finalTitle enter";
  title.textContent = sc.endVideo.title;
  overlay.appendChild(title);

  hasPlayedFinalVideo = true;

  vidEl.onended = () => {
    fadeAudioTo(bgAudio, 0.22, 800);
  };
}

/* =========================================================
   CLICK ADVANCE
   - click 1: muestra título
   - click 2 (si hay sub): revela sub (mismo step)
   - click 3: pasa al siguiente step
   - FIX: texto aparece después del media ready
   ========================================================= */
async function next(){
  if(isAnimating) return;
  isAnimating = true;

  startAmbientAudioOnce();

  const sc = scenes[sceneIndex];

  await applySceneAmbience(sc);

  if(revealSubIfNeeded()){
    isAnimating = false;
    return;
  }

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

    await animateOutCurrentCaption();

    // evitar mezcla: ocultar overlay mientras cambia media
    overlay.style.opacity = "0";
    overlay.innerHTML = "";

    if(step.stepVideo){
      await playStepVideo(step.stepVideo, sc);
    } else if(step.stepImage){
      await showStepImage(step.stepImage, sc);
    } else {
      await stopStepVideoToSceneImage(sc);
      await stopStepImageToSceneImage(sc);
      await showImageCrossfade(sc.src);
    }

    showCaption(step);
    overlay.style.opacity = "1";

    stepIndex++;
    isAnimating = false;
    return;
  }

  // NEXT SCENE
  if(sceneIndex < scenes.length - 1){
    await animateOutCurrentCaption();

    overlay.style.opacity = "0";
    overlay.innerHTML = "";

    await stopStepVideoToSceneImage(sc);
    await stopStepImageToSceneImage(sc);

    await loadScene(sceneIndex + 1);

    const first = scenes[sceneIndex].steps[0];

    if(first.stepVideo){
      await playStepVideo(first.stepVideo, scenes[sceneIndex]);
    } else if(first.stepImage){
      await showStepImage(first.stepImage, scenes[sceneIndex]);
    } else {
      await showImageCrossfade(scenes[sceneIndex].src);
    }

    showCaption(first);
    overlay.style.opacity = "1";

    stepIndex = 1;
  }

  isAnimating = false;
}

stage.addEventListener("click", next);

/* =========================================================
   INIT
   ========================================================= */
(async function init(){
  stage.style.pointerEvents = "none";

  await preloadAllAssets();

  await loadScene(0);

  // asegurar que la imagen activa (front) está lista antes del primer caption
  await new Promise((r) => {
    const active = front;
    if (active.complete && active.naturalWidth > 0) return r();
    active.onload = () => r();
    active.onerror = () => r();
  });

  overlay.style.opacity = "1";
  showCaption(scenes[0].steps[0]);
  stepIndex = 1;

  stage.style.pointerEvents = "auto";
})();



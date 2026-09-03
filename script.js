const birthdayConfig = {
  name: "Sanjana",
  birthdayMonth: 11,
  birthdayDay: 8,
  music: "assets/birthday-song.mp3",
  loveLetter: `Dear Sanjana,\n\nI don't know if words can ever completely explain how special you are to me.\n\nYour smile makes ordinary moments beautiful.\nYour presence makes my happiest memories even more special.\n\nToday, on your birthday, I just want you to know that you are truly precious to me.\n\nI hope your life is filled with happiness, beautiful dreams, endless smiles and unforgettable moments.\n\nHappy Birthday, Sanjana.\n\nKeep smiling.\nKeep shining.\nAnd always remember how special you are. `,
  reasons: [
    ["01", "♥", "Your smile", "Your smile can make even an ordinary day feel special."],
    ["02", "✦", "Your heart", "Your kindness makes you even more beautiful."],
    ["03", "✿", "Your presence", "Everything feels a little better when you're around."],
    ["04", "▣", "Our memories", "Every memory with you is something I want to keep forever."],
    ["05", "♡", "You", "Because you're simply you."]
  ],
  timeline: [
    ["Chapter one", "The beginning", "Where everything started..."],
    ["Chapter two", "First conversation", "A small conversation that became a beautiful memory."],
    ["Chapter three", "First special memory", "One moment I'll never forget."],
    ["Chapter four", "Beautiful memories", "Every moment became something worth remembering."],
    ["Today", "November 8", "Today, we celebrate YOU."]
  ]
};

birthdayConfig.loveLetter = birthdayConfig.loveLetter.replace(/\x13/g, "❤️");
birthdayConfig.loveLetter = birthdayConfig.loveLetter.replaceAll("Sanjana", birthdayConfig.name);
document.title = `For ${birthdayConfig.name} | A Birthday in the Stars`;
const textWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
while (textWalker.nextNode()) textWalker.currentNode.nodeValue = textWalker.currentNode.nodeValue.replaceAll("Sanjana", birthdayConfig.name);

const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const intro = $("#intro");
const main = $("main");
const header = $(".site-header");

document.body.classList.add("is-intro");

function rotateIntroLines() {
  const lines = $$(".intro-line");
  let index = 0;
  const interval = setInterval(() => {
    lines[index].classList.remove("is-visible");
    index += 1;
    if (index >= lines.length) { clearInterval(interval); return; }
    lines[index].classList.add("is-visible");
  }, 1800);
}
rotateIntroLines();

$("#enter-btn").addEventListener("click", () => {
  intro.classList.add("is-leaving");
  main.classList.add("is-visible");
  header.classList.add("visible");
  document.body.classList.remove("is-intro");
  setTimeout(() => intro.remove(), 1400);
  playMusic();
});

$$("[data-scroll]").forEach(button => button.addEventListener("click", () => $(button.dataset.scroll).scrollIntoView({ behavior: "smooth" })));

function getNextBirthday() {
  const now = new Date();
  const year = now.getMonth() + 1 > birthdayConfig.birthdayMonth || (now.getMonth() + 1 === birthdayConfig.birthdayMonth && now.getDate() > birthdayConfig.birthdayDay) ? now.getFullYear() + 1 : now.getFullYear();
  return new Date(year, birthdayConfig.birthdayMonth - 1, birthdayConfig.birthdayDay);
}
function updateCountdown() {
  const now = new Date();
  const target = getNextBirthday();
  const isBirthday = now.getMonth() + 1 === birthdayConfig.birthdayMonth && now.getDate() === birthdayConfig.birthdayDay;
  if (isBirthday) { $("#countdown-grid").hidden = true; $("#birthday-today").hidden = false; return; }
  const difference = Math.max(0, target - now);
  const values = [Math.floor(difference / 86400000), Math.floor(difference / 3600000) % 24, Math.floor(difference / 60000) % 60, Math.floor(difference / 1000) % 60];
  $$("[data-unit]").forEach((item, index) => item.textContent = String(values[index]).padStart(2, "0"));
}
updateCountdown();
setInterval(updateCountdown, 1000);

const reasonsGrid = $("#reasons-grid");
birthdayConfig.reasons.forEach(([number, icon, title, text]) => {
  const card = document.createElement("article");
  card.className = "reason-card";
  card.tabIndex = 0;
  card.innerHTML = `<div class="reason-inner"><div class="reason-face reason-front"><span class="reason-number">${number} / 05</span><span class="reason-icon">${icon}</span><h3>${title}</h3></div><div class="reason-face reason-back"><span>${icon}</span><p>${text}</p><small>tap to turn back</small></div></div>`;
  card.addEventListener("click", () => card.classList.toggle("flipped"));
  card.addEventListener("keydown", event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); card.classList.toggle("flipped"); } });
  reasonsGrid.append(card);
});

const timeline = $("#timeline");
birthdayConfig.timeline.forEach(([chapter, title, text]) => {
  const item = document.createElement("article");
  item.className = "timeline-item reveal";
  item.innerHTML = `<span class="timeline-dot"></span><div class="timeline-date">${chapter}</div><div class="timeline-copy"><h3>${title}</h3><p>${text}</p></div>`;
  timeline.append(item);
});

const typewriter = $("#typewriter");
let typeIndex = 0;
function typeLetter() {
  if (typeIndex >= birthdayConfig.loveLetter.length) return;
  typewriter.textContent += birthdayConfig.loveLetter[typeIndex++];
  setTimeout(typeLetter, birthdayConfig.loveLetter[typeIndex - 1] === "\n" ? 180 : 26);
}

const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (!entry.isIntersecting) return;
  entry.target.classList.add("visible");
  if (entry.target === $(".letter-paper")) typeLetter();
  observer.unobserve(entry.target);
}), { threshold: .12 });
$$(".reveal").forEach(element => observer.observe(element));

const dropZone = $("#drop-zone");
const input = $("#photo-input");
const gallery = $("#memory-gallery");
let memoryFiles = [];
function addPhotos(files) {
  [...files].filter(file => file.type.startsWith("image/")).forEach(file => memoryFiles.push(file));
  renderGallery();
}
function renderGallery() {
  gallery.innerHTML = "";
  if (!memoryFiles.length) { gallery.innerHTML = `<div class="empty-gallery"><span class="empty-star">✧</span><p>Your memories will float here</p><small>Upload a few photos to begin</small></div>`; return; }
  memoryFiles.forEach((file, index) => {
    const card = document.createElement("article");
    card.className = "memory-card";
    card.style.setProperty("--angle", `${(index % 3 - 1) * 1.5}deg`);
    const image = document.createElement("img"); image.alt = `Memory ${index + 1}`; image.loading = "lazy"; image.src = URL.createObjectURL(file);
    const zoom = document.createElement("button"); zoom.className = "zoom-memory"; zoom.type = "button"; zoom.textContent = "↗"; zoom.setAttribute("aria-label", "Zoom memory");
    zoom.addEventListener("click", () => openImage(image.src));
    const remove = document.createElement("button"); remove.className = "remove-memory"; remove.type = "button"; remove.textContent = "×"; remove.setAttribute("aria-label", "Remove memory");
    remove.addEventListener("click", () => { URL.revokeObjectURL(image.src); memoryFiles.splice(index, 1); renderGallery(); });
    card.append(image, zoom, remove); gallery.append(card);
  });
}
input.addEventListener("change", event => { addPhotos(event.target.files); input.value = ""; });
dropZone.addEventListener("click", event => { if (!event.target.closest("label")) input.click(); });
dropZone.addEventListener("keydown", event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); input.click(); } });
["dragenter", "dragover"].forEach(name => dropZone.addEventListener(name, event => { event.preventDefault(); dropZone.classList.add("dragging"); }));
["dragleave", "drop"].forEach(name => dropZone.addEventListener(name, event => { event.preventDefault(); dropZone.classList.remove("dragging"); }));
dropZone.addEventListener("drop", event => addPhotos(event.dataTransfer.files));
function openImage(src) {
  const overlay = document.createElement("div"); overlay.className = "image-overlay";
  overlay.innerHTML = `<img src="${src}" alt="Enlarged memory"><button type="button" aria-label="Close image">×</button>`;
  overlay.addEventListener("click", () => overlay.remove()); document.body.append(overlay);
}

const wishButton = $("#wish-btn");
wishButton.addEventListener("click", () => {
  $(".flames").classList.add("is-out"); wishButton.disabled = true; $("#wish-message").textContent = "Your wish is on its way... ♥"; createCelebration($("#celebration"), 80); playMusic();
});
$("#finale-btn").addEventListener("click", () => { $("#finale-before").hidden = true; $("#finale-after").hidden = false; createCelebration($("#celebration"), 150); playMusic(); });

const audio = $("#birthday-audio");
audio.src = birthdayConfig.music;
const musicInput = $("#music-input");
let selectedSongUrl = "";
musicInput.addEventListener("change", event => {
  const [file] = event.target.files;
  if (!file || !file.type.startsWith("audio/")) return;
  if (selectedSongUrl) URL.revokeObjectURL(selectedSongUrl);
  selectedSongUrl = URL.createObjectURL(file);
  audio.src = selectedSongUrl;
  audio.load();
  $("#music-label").textContent = "song ready";
  musicInput.value = "";
});
function playMusic() { audio.play().then(() => { $("#music-label").textContent = "sound on"; }).catch(() => { $("#music-label").textContent = "add your song"; }); }
$("#music-toggle").addEventListener("click", () => { if (audio.paused) playMusic(); else { audio.pause(); $("#music-label").textContent = "sound off"; } });

function createCelebration(container, count) {
  container.innerHTML = "";
  for (let index = 0; index < count; index += 1) {
    const particle = document.createElement("i"); particle.className = "burst"; particle.textContent = index % 4 === 0 ? "♥" : "";
    particle.style.left = `${35 + Math.random() * 30}%`; particle.style.top = `${35 + Math.random() * 25}%`;
    particle.style.setProperty("--x", `${(Math.random() - .5) * 100}vw`); particle.style.setProperty("--y", `${(Math.random() - .5) * 80}vh`); particle.style.animationDelay = `${Math.random() * .5}s`; container.append(particle);
  }
}

function createTouchSparkles(touch) {
  const colors = ["#ffffff", "#ffd978", "#ee789d", "#ffffff", "#d8af6d", "#ff9fbb"];
  for (let index = 0; index < 6; index += 1) {
    const sparkle = document.createElement("i");
    const angle = (Math.PI * 2 * index) / 6;
    const distance = 24 + Math.random() * 22;
    sparkle.className = "touch-sparkle";
    sparkle.style.left = `${touch.clientX}px`;
    sparkle.style.top = `${touch.clientY}px`;
    sparkle.style.background = colors[index];
    sparkle.style.setProperty("--x", `${Math.cos(angle) * distance}px`);
    sparkle.style.setProperty("--y", `${Math.sin(angle) * distance}px`);
    sparkle.style.animationDelay = `${index * 25}ms`;
    document.body.append(sparkle);
    setTimeout(() => sparkle.remove(), 1000);
  }
}

window.addEventListener("touchstart", event => {
  [...event.changedTouches].forEach(createTouchSparkles);
}, { passive: true });

function initThree() {
  if (!window.THREE) return;
  const canvas = $("#space-canvas"); const scene = new THREE.Scene(); const camera = new THREE.PerspectiveCamera(65, innerWidth / innerHeight, .1, 100); camera.position.z = 5;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true }); renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5)); renderer.setSize(innerWidth, innerHeight);
  const count = innerWidth < 600 ? 280 : 600; const positions = new Float32Array(count * 3); const colors = new Float32Array(count * 3);
  for (let index = 0; index < count; index += 1) { const i = index * 3; positions[i] = (Math.random() - .5) * 14; positions[i + 1] = (Math.random() - .5) * 9; positions[i + 2] = (Math.random() - .5) * 8; const color = new THREE.Color(index % 5 === 0 ? "#ee789d" : index % 7 === 0 ? "#d8af6d" : "#f9efe7"); colors[i] = color.r; colors[i + 1] = color.g; colors[i + 2] = color.b; }
  const geometry = new THREE.BufferGeometry(); geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3)); geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  const material = new THREE.PointsMaterial({ size: .025, vertexColors: true, transparent: true, opacity: .75 }); const stars = new THREE.Points(geometry, material); scene.add(stars);
  const pointer = { x: 0, y: 0 }; window.addEventListener("pointermove", event => { pointer.x = (event.clientX / innerWidth - .5) * 2; pointer.y = (event.clientY / innerHeight - .5) * 2; }, { passive: true });
  function animate() { requestAnimationFrame(animate); stars.rotation.y += .00025; stars.rotation.x += .00008; camera.position.x += (pointer.x * .22 - camera.position.x) * .02; camera.position.y += (-pointer.y * .16 - camera.position.y) * .02; renderer.render(scene, camera); }
  animate(); window.addEventListener("resize", () => { camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight); });
}
initThree();

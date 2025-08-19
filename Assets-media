let pixelMode = "image"; // default mode

function openPixelMedia() {
  if (document.getElementById("pixelPanel")) return;

  const panel = document.createElement("div");
  panel.id = "pixelPanel";
  panel.style.cssText = `
    position: fixed;
    top: 10%;
    left: 10%;
    width: 80%;
    height: 80%;
    background: #fff;
    border: 2px solid #ccc;
    box-shadow: 0 0 10px rgba(0,0,0,0.3);
    z-index: 9999;
    padding: 10px;
    overflow-y: auto;
  `;

  // Close Button
  const closeBtn = document.createElement("button");
  closeBtn.innerText = "✖ Close";
  closeBtn.style.cssText = `float: right; margin-bottom: 10px;`;
  closeBtn.onclick = () => panel.remove();
  panel.appendChild(closeBtn);

  // Search input
  const search = document.createElement("input");
  search.type = "text";
  search.id = "pixelSearch";
  search.placeholder = "Search images or videos...";
  search.style.cssText = "width:60%;padding:5px;margin-bottom:10px;";
  panel.appendChild(search);

  // Tabs
  const btnImg = document.createElement("button");
  btnImg.innerText = "Images";
  btnImg.onclick = () => setPixelMode("image");
  panel.appendChild(btnImg);

  const btnVid = document.createElement("button");
  btnVid.innerText = "Videos";
  btnVid.onclick = () => setPixelMode("video");
  panel.appendChild(btnVid);

  // Result grid
  const results = document.createElement("div");
  results.id = "pixelResults";
  results.className = "pixel-grid";
  panel.appendChild(results);

  document.body.appendChild(panel);

  fetchPixelDefault(); // default load
}

function setPixelMode(mode) {
  pixelMode = mode;
  document.getElementById("pixelResults").innerHTML = "";
  fetchPixelDefault();
}

// Search Input Listener
document.addEventListener("input", (e) => {
  if (e.target.id === "pixelSearch") {
    const query = e.target.value.trim();
    if (query) fetchPixelSearch(query);
    else fetchPixelDefault();
  }
});

// ✅ Backend base URL
const BACKEND_URL = "https://assets-media.onrender.com";

// Fetch Default Curated
function fetchPixelDefault() {
  const url = pixelMode === "image"
    ? `${BACKEND_URL}/api/images`
    : `${BACKEND_URL}/api/videos`;
  fetch(url)
    .then(res => res.json())
    .then(renderPixelMedia);
}

// Fetch by Search
function fetchPixelSearch(query) {
  const url = pixelMode === "image"
    ? `${BACKEND_URL}/api/images?query=${query}`
    : `${BACKEND_URL}/api/videos?query=${query}`;
  fetch(url)
    .then(res => res.json())
    .then(renderPixelMedia);
}

// Render Grid
function renderPixelMedia(data) {
  const container = document.getElementById("pixelResults");
  container.innerHTML = "";
  container.style.cssText = `
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 10px;
    margin-top: 10px;
  `;

  if (pixelMode === "image" && data.photos) {
    data.photos.forEach(photo => {
      const img = document.createElement("img");
      img.src = photo.src.medium;
      img.style.width = "100%";
      img.style.borderRadius = "10px";
      img.style.cursor = "pointer";
      img.onclick = () => insertToEditor("img", photo.src.large);
      container.appendChild(img);
    });
  } else if (pixelMode === "video" && data.videos) {
    data.videos.forEach(video => {
      const vid = document.createElement("video");
      const btn = document.createElement("button");
      btn.textContent = "Insert";
      vid.src = video.video_files[0].link;
      vid.controls = true;
      vid.style.width = "100%";
      vid.style.borderRadius = "10px";
      vid.style.cursor = "pointer";
      btn.onclick = () => insertToEditor("video", video.video_files[0].link);
      container.appendChild(vid);
      container.appendChild(btn);
    });
  }
}

// Insert to iframe editor
function insertToEditor(type, src) {
  const iframe = document.getElementById("canvas");
  if (!iframe) return alert("Editor iframe not found!");

  const doc = iframe.contentDocument;
  const el = doc.createElement(type);
  el.src = src;
  el.style.margin = "10px";
  el.style.width = type === "img" ? "300px" : "400px";
  if (type === "video") el.controls = true;

  selectedParent.appendChild(el);
}

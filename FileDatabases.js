
    // css or js file injecting code
let db;
let customFiles = {};
let currentFile = null;
let filename = null;

// Open IndexedDB
const request = indexedDB.open('WebEditorDB', 2);
request.onupgradeneeded = e => {
  db = e.target.result;
  if (!db.objectStoreNames.contains('files')) {
    db.createObjectStore('files', { keyPath: 'filename' });
  }
  if (!db.objectStoreNames.contains('projects')) {
    db.createObjectStore('projects', { keyPath: 'name' });
  }
};
request.onsuccess = () => {
  db = request.result;
  listAllProjects();
};

// Create new JS/CSS file
function createFile(type) {
  const name = prompt(`Enter ${type.toUpperCase()} file name:`);
  if (!name) return;
  const filename = name + (type === 'js' ? '.js' : '.css');
  if (customFiles[filename]) return alert('File exists.');

  customFiles[filename] = { type, content: '' };
  updateFileList();
}

let eee = ace.edit("fileEditor");
      eee.setTheme("ace/theme/monokai");
      eee.setOptions({
          fontSize: "15px",
          showPrintMargin: true,
          useSoftTabs: true,
          wrap: false
      });
      
// ✅ Update file list UI
function updateFileList() {
  const list = document.getElementById('fileList');
  list.innerHTML = '';

  for (const file in customFiles) {
    const li = document.createElement('li');
    li.className = "fileNamecssjs";
    li.textContent = file;

    // File click: Load content into editor
    li.onclick = () => {
      currentFile = file;
      let editor = ace.edit('fileEditor');
      editor.setValue(customFiles[file].content || '', -1); // -1 to prevent cursor reset
      editor.session.setMode(`ace/mode/${customFiles[file].type}`);
    };

    // Delete button
    const del = document.createElement('button');
    del.textContent = 'X';
    del.onclick = (e) => {
      e.stopPropagation();
      deleteFile(file);
    };

    li.appendChild(del);
    list.appendChild(li);
  }
}

// ✅ Save file content and inject into iframe
function applyFile() {
  if (!currentFile) return;

  const editor = ace.edit('fileEditor');
  const content = editor.getValue();
  //editor.setTheme("ace/theme/monokai");
  const type = customFiles[currentFile].type;
  customFiles[currentFile].content = content;
  
  const iframe = document.getElementById('canvas');
  const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

  // ✅ Remove old tag (if exists)
  const selector = `${type === 'js' ? 'script' : 'style'}[data-file="${currentFile}"]`;
  const existing = iframeDoc.querySelector(selector);
  if (existing) existing.remove();

  // ✅ Create new tag
  const tag = iframeDoc.createElement(type === 'js' ? 'script' : 'style');
  tag.textContent = content;
  tag.dataset.file = currentFile; // For unique reference

  iframeDoc.head.appendChild(tag);
  updateFileList();

  runUserCode(content);
}

function runUserCode(code) {
  try {
    new Function(code)(); // safer than eval
  } catch (e) {
    var ertag = document.getElementById("errorTag");
    //ertag.textContent = e.message;
    console.error(e);
  }
}

// Delete file
function deleteFile(filename) {
  document.querySelectorAll(filename.endsWith('.js') ? 'script' : 'style')
    .forEach(el => {
      if (el.textContent === customFiles[filename].content && el.dataset.custom === 'true') el.remove();
    });
  delete customFiles[filename];
  if (currentFile === filename) {
    currentFile = null;
    document.getElementById('fileEditor').value = '';
  }
  updateFileList();
}

// Save full project
function saveProject() {
  const name = prompt("project name:");
  if (!name) return;

  const iframeDoc = document.getElementById("canvas").contentDocument;
  const fullHTML = iframeDoc.documentElement.outerHTML;

  const tx = db.transaction('projects', 'readwrite');
  const store = tx.objectStore('projects');

  store.put({
    name,
    html: fullHTML,          // 💾 Save full iframe HTML
    files: customFiles       // 💾 Save JS/CSS files
  }).onsuccess = () => {
    showPopup("Saved", `Your Project (${name}) was Saved.`, true, false);
    listAllProjects();
  };
}

// Load project by name
function loadProject(name) {
  const tx = db.transaction('projects', 'readonly');
  const store = tx.objectStore('projects');
  const req = store.get(name);

  req.onsuccess = () => {
    const data = req.result;
    if (!data) return;

    const iframe = document.getElementById("canvas");
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

    iframeDoc.open();
    iframeDoc.write(data.html);  // 💾 Restore full HTML
    iframeDoc.close();

    // Remove old custom files (from parent doc)
    document.querySelectorAll('style[data-custom], script[data-custom]').forEach(e => e.remove());

    // Inject saved custom JS/CSS into parent document again
    customFiles = data.files || {};
    for (const file in customFiles) {
      const tag = document.createElement(customFiles[file].type === 'js' ? 'script' : 'style');
      tag.textContent = customFiles[file].content;
      tag.dataset.custom = 'true';
      document.body.appendChild(tag);
    }

    updateFileList();
    showPopup("Project Loaded", `Your Project ${name} was Loaded`, true, false);
  };
}

// Delete project
function deleteProject(name) {
  const tx = db.transaction('projects', 'readwrite');
  tx.objectStore('projects').delete(name).onsuccess = () => {
    var dic = "Your Project (" + name + ") was Deleted."
    showPopup("Delete",dic,true,false);    
    listAllProjects();
  };
}

// List all projects
function listAllProjects() {
  const tx = db.transaction('projects', 'readonly');
  const store = tx.objectStore('projects');
  store.getAll().onsuccess = e => {
    const projects = e.target.result;
    const list = document.getElementById('projectList');
    list.innerHTML = '';
    projects.forEach(p => {
      const li = document.createElement('li');
      li.textContent = p.name;
      li.style.margin = '10px 0';

      const loadBtn = document.createElement('button');
      loadBtn.textContent = 'Open';
      loadBtn.style.margin = '0 10px';
      loadBtn.onclick = () => loadProject(p.name);

      const delBtn = document.createElement('button');
      delBtn.textContent = 'X';
      delBtn.onclick = () => showPopup("Conferm","Want Delete Your Project ",true,true,p.name);

      li.appendChild(loadBtn);
      li.appendChild(delBtn);
      list.appendChild(li);
    });
  };
}



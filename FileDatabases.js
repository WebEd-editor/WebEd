
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
 
// ✅ Update file list UI
function updateFileList() {
  const list = document.getElementById('fileList');
  list.innerHTML = '';

  for (const file in customFiles) {
    const sw = document.createElement('div');
    sw.className="sw";
    const tty = document.createElement('div');
    tty.className="tty";
    tty.textContent = customFiles[file].type;
    tty.style.color = (customFiles[file].type === 'js') ? 'yellow' : 'lightgreen';
    const li = document.createElement('li');
    li.className = "fileNamecssjs";
    li.textContent = file;

    // File click: Load content into editor
    li.onclick = () => {
      currentFile = file;
      let editor = ace.edit('fileEditor');
      editor.setTheme("ace/theme/github_dark");
      var t;
      t = (customFiles[file].type === 'js') ? 'javascript' : 'css' ;
      editor.session.setMode(`ace/mode/${t}`);
      editor.setValue(customFiles[file].content || '', -1); // -1 to prevent cursor reset
      document.getElementById("eundo").onclick = () => {editor.undo()}
      document.getElementById("eredo").onclick = () => {editor.redo()}
      document.getElementById("gotoline").oninput = () => {editor.gotoLine(document.getElementById("gotoline").value)}
      let lastSearch = "";
      let searchOptions = {
          needle: "",
          wrap: true,
          caseSensitive: false,
          wholeWord: false,
          regExp: false,
          backwards: false
      };
      document.getElementById("searchText").oninput = () => { const text = document.getElementById("searchText").value; if (text && text !== lastSearch) { searchOptions.needle = text; editor.find(text, searchOptions); lastSearch = text; } }
      document.getElementById("findNext").onclick = () => { searchOptions.backwards = false; editor.findNext(searchOptions); }
      document.getElementById("findPrev").onclick = () => { searchOptions.backwards = true; editor.findPrevious(searchOptions); }
    };

    // Delete button
    const del = document.createElement('button');
    del.textContent = 'X';
    del.onclick = (e) => {
      e.stopPropagation();
      deleteFile(file);
    };

    sw.appendChild(tty);
    sw.appendChild(li);
    sw.appendChild(del);
    list.appendChild(sw);
  }
}

// ✅ Save file content and inject into iframe
function applyFile() {
  if (!currentFile) return;

  const editor = ace.edit('fileEditor');
  const content = editor.getValue();
  editor.setTheme("ace/theme/github_dark");
  editor.getSession().getUndoManager().reset();

  const type = customFiles[currentFile].type;
  customFiles[currentFile].content = content;

  const iframe = document.getElementById('canvas');
  const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

  // ✅ Remove old tag (if exists)
  const selector = `${type === 'js' ? 'script' : 'style'}[data-file="${currentFile}"]`;
  const existing = iframeDoc.querySelector(selector);
  if (existing) existing.remove();

  if (type === 'js') {
    // ❌ JS file: Do not append to iframe, only save content
    updateFileList(); // Still update UI
    return;
  }

  // ✅ Append CSS only (not JS)
  const tag = iframeDoc.createElement('style');
  tag.textContent = content;
  tag.dataset.file = currentFile;

  iframeDoc.head.appendChild(tag);
  updateFileList();
}

function saveHTMLBeforePreview() {
  sessionStorage.setItem('customFilesBackup', JSON.stringify(customFiles));
  sessionStorage.setItem('currentFileBackup', currentFile);
}

window.addEventListener('DOMContentLoaded', () => {
  const saved = sessionStorage.getItem('customFilesBackup');
  const file = sessionStorage.getItem('currentFileBackup');

  if (saved && file) {
    customFiles = JSON.parse(saved);
    currentFile = file;

    // Restore editor
    if (customFiles[currentFile]) {
      ace.edit('fileEditor').setValue(customFiles[currentFile].content, -1);
    }

    alert("✅ Editor state restored successfully!");
  }
});



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

function openFullPreview() {
  saveHTMLBeforePreview();

  const iframe = document.getElementById("canvas");
  const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

  // ✅ 1. Append missing JS files temporarily
  for (let fileName in customFiles) {
    const file = customFiles[fileName];
    if (file.type === 'js') {
      const exists = iframeDoc.querySelector(`script[data-temp="${fileName}"]`);
      if (!exists) {
        const script = iframeDoc.createElement('script');
        script.textContent = file.content;
        script.dataset.temp = fileName;
        iframeDoc.body.appendChild(script);
      }
    }
  }

  // ✅ 2. Clean DOM directly before capturing outerHTML
  const allElements = iframeDoc.querySelectorAll("*");
  allElements.forEach((el) => {
    if (el.hasAttribute("class") && el.getAttribute("class").trim() === "") {
      el.removeAttribute("class");
    }

    if (el.hasAttribute("id") && el.getAttribute("id").trim() === "") {
      el.removeAttribute("id");
    }

    const unwantedAttributes = ["contenteditable"];
    unwantedAttributes.forEach((attr) => {
      if (el.hasAttribute(attr)) {
        el.removeAttribute(attr);
      }
    });
  });

  // ✅ 3. Capture cleaned HTML
  const fullHTML = '<!DOCTYPE html>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n' + iframeDoc.documentElement.outerHTML;
  ffcode = fullHTML;alert("fullHTML");

  // ✅ 4. Remove temporary scripts (cleanup)
  const tempScripts = iframeDoc.querySelectorAll('script[data-temp]');
  tempScripts.forEach(tag => tag.remove());

  // ✅ 5. Preview in new tab
  const blob = new Blob([fullHTML], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');

  const allElements2 = iframeDoc.querySelectorAll("*");
  allElements2.forEach((el) => {
      contenteditable.forEach((att) => {
           el.setAttribute(attr, 'true');
      });
  });
}

let currentPro = null;       // Current project ka naam
let saveInterval = null;     // Auto-save ka reference

// Save full project
function saveProject() {
  if (!currentPro) return;   // agar project ka naam hi nahi to kuch save nahi karna

  console.log("Auto-saved:", currentPro);

  const iframeDoc = document.getElementById("canvas").contentDocument;
  const fullHTML = iframeDoc.documentElement.outerHTML;

  const tx = db.transaction('projects', 'readwrite');
  const store = tx.objectStore('projects');

  store.put({
    name: currentPro,
    html: fullHTML,
    files: customFiles
  }).onsuccess = () => {
    // showPopup("Saved", `Your Project (${currentPro}) was auto-saved.`, true, false);
    listAllProjects();
  };
}

// Start auto-save for a project
function startAutoSave(name) {
  // Pehle ka interval clear kar do (agar koi chal raha ho)
  if (saveInterval) {
    clearInterval(saveInterval);
  }

  currentPro = name; // naye project ka naam set
  saveInterval = setInterval(saveProject, 1000); // har 1 sec me save
  // console.log("Auto-save started for:", name);
}

// New Project banana
function createNewProject() {
  const name = prompt("Enter new project name:");
  if (!name) return;

  startAutoSave(name);
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
    startAutoSave(name);
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



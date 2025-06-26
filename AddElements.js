// adding elements 

  let selectedParent = null;
  let currentEditingElement = null;

function handleMediaUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const url = URL.createObjectURL(file);
  let el;
  var s = document.getElementById('editSrc');

  if (file.type.startsWith('image/')) {
    el = document.createElement('img');
    el.src = url;
    el.alt = 'Uploaded Image';
    el.style.maxWidth = '100%';
  } else if (file.type.startsWith('video/')) {
    el = document.createElement('video');
    el.controls = true;
    el.src = url;
    if (s.value!="") el.src = s.value
    el.style.maxWidth = '100%';
  } else if (file.type.startsWith('audio/')) {
    el = document.createElement('audio');
    el.controls = true;
    el.src = url;
  }

  if (el) {
    el.classList.add('editable');
    el.setAttribute('data-editable', 'true');
    el.contentEditable = false;

    el.addEventListener('click', (e) => e.stopPropagation());

    const iframe = document.getElementById('canvas');
    
    if (!selectedParent || !iframe.contentDocument.body.contains(selectedParent)) {
       selectedParent = iframe.contentDocument.body;
    }
    selectedParent.appendChild(el);
    updateTree();
    saveHistory();
  }
}

function addElement(type) {
  const iframe = document.getElementById('canvas');

  // 🔁 CHANGE 1: Get selectedParent from iframe document body if needed
  if (!selectedParent || !iframe.contentDocument.body.contains(selectedParent)) {
    selectedParent = iframe.contentDocument.body;
  }

  const id = document.getElementById('customId').value.trim();
  const className = document.getElementById('customClass').value.trim();
  const onclickCode = document.getElementById('customOnclick').value.trim();

  let el;

  // --- Predefined SVG Icon ---
  if (type === 'svg-icon') {
    el = document.createElement('div');
    el.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" 
      xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L15 8H9L12 2Z" fill="currentColor"/>
      <circle cx="12" cy="16" r="4" fill="currentColor"/>
    </svg>`;
    el = el.firstElementChild;
  }

  // --- Custom Empty SVG for Drawing ---
  else if (type === 'svg') {
     el = document.createElement("div");
     el.innerHTML = icode; // assuming `icode` is defined somewhere globally
  }

  // --- Regular HTML Elements ---
  else {
    el = document.createElement(type);
    el.textContent = type === 'button' ? 'Click Me' : `New ${type}`;
    el.classList.add('editable');
    el.setAttribute('contenteditable', 'true');
    el.setAttribute('data-editable', 'true');
  }

  if (id) el.id = id;
  if (className) el.className += ' ' + className;

  if (onclickCode) {
    try {
      el.onclick = new Function(onclickCode);
    } catch {
      alert("Invalid onclick code");
    }
  }

  // 🔁 CHANGE 2: Add event listener and mark element in iframe
  el.addEventListener('click', (e) => {
    e.stopPropagation();
    selectedParent = el;
    clearSelected();
    el.classList.add('selected');
  });

  selectedParent.appendChild(el);

  const iframeD = document.getElementById("canvas").contentDocument || iframe.contentWindow.document;

       const lin = iframeD.createElement("link");
       lin.rel = "stylesheet";
       lin.href = "https://fonts.googleapis.com/css2?family=Nunito:wght@200;300;400;500;600;700;800;900;1000&family=Roboto:wght@300;400;500;700&display=swap";

       iframeD.head.appendChild(lin);
  
  updateTree();
  saveHistory();

  // Clear input fields
  document.getElementById('customId').value = '';
  document.getElementById('customClass').value = '';
  document.getElementById('customOnclick').value = '';
}


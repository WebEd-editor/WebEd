
function MyTabClose(){
   document.querySelectorAll('.footBtn').forEach( fs => {
      fs.classList.toggle('hidden');
   });
} 
function MyOpen(id){
   document.querySelectorAll('.tab').forEach( v => {
      v.style.display="none";
   });
   document.getElementById(id).style.display="block";
   if (id == "fullcodearea") rr();
   if (id == "editModal") id.style.margin ="30px 20px 0 0"; 
   if (id == "sidebar") updateTree();
   if (id == "iconEditorTab" || id == "addSh" || id == "treeTabForIcon" || id == "previewIconTab") document.getElementById("iconEditor").style.display ="block";
   if (id == "iconEditor") document.getElementById("iconEditor").style.width="90%";
}

function MyClose(id){
   document.getElementById(id).style.display="none";
}
function rr() {
  const iframe = document.getElementById("canvas");
  const iframeDoc = iframe.contentDocument.documentElement || iframe.contentWindow.document;

  // Get the body HTML from iframe
  let html = iframeDoc.innerHTML;

  // Clean up editor-related attributes
  let newHtml = html.replace(/contenteditable="true"/g, '');
  let newHtml2 = newHtml.replace(/editable/g, '');
  let newHtml3 = newHtml2.replace(/data-editable="true"/g, '');

  // Set cleaned HTML to display area
  document.getElementById("htmlcssjs").textContent = newHtml3;
  document.getElementById("BtnBeautify").addEventListener('click', beautify(newHtml3));
}

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

let iconDb;
const Icon_request = indexedDB.open("iconDataBase", 2);

// ✅ Create store
Icon_request.onupgradeneeded = function (event) {
  iconDb = event.target.result;
  const store = iconDb.createObjectStore("icons", { keyPath: "id" });
  store.createIndex("name", "name", { unique: false });
  console.log("Object store created");
};

// ✅ DB opened
Icon_request.onsuccess = function (event) {
  iconDb = event.target.result;
  console.log("icon Database opened successfully");

  // Example insert into DB
  const transaction = iconDb.transaction(["icons"], "readwrite");
  const store = transaction.objectStore("icons");

  transaction.oncomplete = () => {
    console.log("Icons added to DB");
    iconListDisplay();
  };
};

var saveIconCodeGlobely = "";

function pushIconInArray() {
  if(saveIconCodeGlobely===""){ Notify("Create Do Something", "f");return;}
  var iconName = prompt("Enter Icon Name");
  if(!iconName) return;
  var iconId = Date.now(); // simple ID
  const newIcon = { id: iconId, name: iconName, svgcode: saveIconCodeGlobely };

  // Save to IndexedDB
  const transaction = iconDb.transaction(["icons"], "readwrite");
  const store = transaction.objectStore("icons");
  store.add(newIcon);

  transaction.oncomplete = () => {
    console.log("Icon saved to DB");
    Notify("icon saved successfully","s");
    iconListDisplay(); // refresh display
  };
}

const iconL = document.getElementById("iconList");

function iconListDisplay() {
  const transaction = iconDb.transaction(["icons"], "readonly");
  const store = transaction.objectStore("icons");
  const request = store.getAll();

  request.onsuccess = () => {
    const icons = request.result;
    iconL.innerHTML = "";
    icons.forEach((Ic) => {
      const wrapper = document.createElement("div");
    wrapper.style = `
      width: 80px; height: 120px;width: calc(33.333% - 1px); 
      box-sizing: border-box;
      background: linear-gradient(60deg, #95a2ff, #2d365a);
      border-radius: 5px; margin: 10px; padding: 5px; text-align: center;
    `;

    const iconDiv = document.createElement("div");
    iconDiv.innerHTML = Ic.svgcode;
    iconDiv.querySelector('#IconSvg').style.outline ="2px dashed #5597ff";

    const nameP = document.createElement("p");
    nameP.textContent = Ic.name;

    const insertBtn = document.createElement("button");
    insertBtn.textContent = "Insert";
    insertBtn.onclick = () => iconInsert(Ic.svgcode);
    
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.onclick = () => deleteIcon(Ic.id);

    wrapper.appendChild(iconDiv);
    wrapper.appendChild(nameP);
    wrapper.appendChild(insertBtn);
    wrapper.appendChild(deleteBtn);
    iconL.appendChild(wrapper);
    });
  };
}

function deleteIcon(iconId) {
  const transaction = iconDb.transaction(["icons"], "readwrite");
  const store = transaction.objectStore("icons");
 if(confirm("confirm delete your icon")){
  const deleteRequest = store.delete(iconId);

  deleteRequest.onsuccess = () => {
    console.log(`Icon with ID ${iconId} deleted`);
    iconListDisplay();
  };

  deleteRequest.onerror = (event) => {
    console.error("Error deleting icon:", event.target.error);
  };
 }else{return}
}
let icode = "";

function iconInsert(svgC) {
  icode = svgC;
  addElement('svg');
  //console.log("Inserted SVG:", svgC);
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
  updateTree();
  saveHistory();

  // Clear input fields
  document.getElementById('customId').value = '';
  document.getElementById('customClass').value = '';
  document.getElementById('customOnclick').value = '';
}

const arrowTR = `<svg width="20" height="20" viewBox="0 0 100 100"><path d="M 10 10 L 10 50 Z M 10 50 L 70 50 Z M 40 20 L 70 50 Z M 40 80 L 70 50 Z" stroke="white" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

function updateTree() {
  const tree = document.getElementById('tree');
  tree.innerHTML = '';

  function buildTree(el, container) {
    Array.from(el.children).forEach(child => {
      const item = document.createElement('div');
      item.className = 'tree-item';

      const label = document.createElement('span');
      label.className = 'tree-label';

      const id = child.id ? `#${child.id}` : '';

      // ✅ Safe class handling for HTML and SVG
      let classString = '';
      if (typeof child.className === 'string') {
        classString = child.className;
      } else if (child.className && typeof child.className.baseVal === 'string') {
        classString = child.className.baseVal; // For SVG elements
      }
      const cls = classString ? `.${classString.split(' ').join('.')}` : '';

      var tagLabel = `${child.tagName.toLowerCase()} ${id}${cls}`;
      label.innerHTML = arrowTR + "< "+String(tagLabel)+" >";

      // 👇 Element select action
      label.onclick = () => {
        selectedParent = child;
        clearSelected();
        child.classList.add('selected');
      };

      const actions = document.createElement('span');
      actions.className = 'tree-actions';

      const delBtn = document.createElement('button');
      delBtn.textContent = '🗑';
      delBtn.onclick = () => {
        if (selectedParent === child) {
          selectedParent = document.getElementById('canvas');
          clearSelected();
        }
        child.remove();
        updateTree();saveHistory();
      };

      const editBtn = document.createElement('button');
      editBtn.textContent = '✏️';
      editBtn.onclick = () => openEdit(child);

      actions.appendChild(editBtn);
      actions.appendChild(delBtn);
      if(child.tagName.toLowerCase() === 'body'){actions.removeChild(delBtn)}

      item.appendChild(label);
      item.appendChild(actions);
      container.appendChild(item);
      if(child.tagName.toLowerCase() === 'head'){container.removeChild(item)}

      if (child.children.length > 0) {
        buildTree(child, item);
      }
      
      label.draggable = true;

      // Store the dragged element
      label.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', child.getAttribute('data-id') || '');
        draggedElement = child;
        label.style.outline="2px solid green";
      });

      // Allow drop
      label.addEventListener('dragover', (e) => {
        e.preventDefault();
        if(isValidDropTarget(child, draggedElement)){
           label.classList.add('drag-over');
        }
      });

      label.addEventListener('dragleave', () => {
        label.classList.remove('drag-over');
      });

      // Handle drop
      label.addEventListener('drop', (e) => {
        e.preventDefault();
        label.classList.remove('drag-over');

        if (!draggedElement || draggedElement.contains(child)) return;
        label.style.outline="2px solid yellow";
        child.appendChild(draggedElement);
        updateTree();
        saveHistory();
      });
    });
  }

  buildTree(document.getElementById('canvas').contentDocument.documentElement, tree);

}  
function isValidDropTarget(target, dragged) {
  if (!target || !dragged) return false;
  if (dragged.contains(target)) return false; // prevent nesting into own child
  if (target.tagName === 'HEAD' || dragged.tagName === 'HEAD') return false;
  return true;
}

function treeIcon(){
   const treei = document.getElementById("iconTree");
   treei.innerHTML ="";
   
   function buildTreeIcon(Aa, Cc) {
     Array.from(Aa.children).forEach(child => {
      const iconItem = document.createElement('div');
      iconItem.className = 'tree-item';

      const label = document.createElement('span');
      label.className = 'tree-label';

      const id = child.id ? `#${child.id}` : '';

      // ✅ Safe class handling for HTML and SVG
      let classString = '';
      if (typeof child.className === 'string') {
        classString = child.className;
      } else if (child.className && typeof child.className.baseVal === 'string') {
        classString = child.className.baseVal; // For SVG elements
      }
      const cls = classString ? `.${classString.split(' ').join('.')}` : '';

      label.textContent = `<${child.tagName.toLowerCase()}> ${id}${cls}`;

      // 👇 Element select action
     /* label.onclick = () => {
        selectedParent = child;
        clearSelected();
        child.classList.add('selected');
      };*/

      const actions = document.createElement('span');
      actions.className = 'tree-actions';

      const delBtn = document.createElement('button');
      delBtn.textContent = '🗑';
      delBtn.onclick = () => {
           // Check and remove from real parent (SVG or HTML)
           if (child.parentNode) {
             child.parentNode.removeChild(child);
             updateCode();
           }
           treeIcon();
      };

      const editBtn = document.createElement('button');
      editBtn.textContent = '✏️';
      editBtn.onclick = () => openIconEdit(child);

      actions.appendChild(editBtn);
      actions.appendChild(delBtn);

      iconItem.appendChild(label);
      iconItem.appendChild(actions);
      Cc.appendChild(iconItem);

      if (child.children.length > 0) {
        buildTreeIcon(child, iconItem);
      }
    });
  }
   
   buildTreeIcon(document.getElementById('iconEditorArea'), treei);
}
let currIcon;

function openIconEdit(ic) {
  currIcon = ic;
  document.getElementById("iconEditorTab").style.display = "block";

  // Use getComputedStyle only if inline style not available
  const fill = ic.getAttribute("fill") || ic.style.fill || window.getComputedStyle(ic).fill;
  const stroke = ic.getAttribute("stroke") || ic.style.stroke || window.getComputedStyle(ic).stroke;
  const strokeWidth = ic.getAttribute("stroke-width") || ic.style.strokeWidth || window.getComputedStyle(ic).strokeWidth;

  document.getElementById("iconFill").value = RGBtoHEX(fill) || '';
  document.getElementById("iconStroke").value = RGBtoHEX(stroke) || '';
  document.getElementById("iconStrWid").value = parseFloat(strokeWidth) || '';
  document.getElementById("linejoin").value = ic.getAttribute("stroke-lonejoin") || '';
  document.getElementById("linecap").value = ic.getAttribute("stroke-linecap") || '';
}

function apllyIcon() {
  if (!currIcon) return;

  const fill = document.getElementById("iconFill").value || '';
  const stroke = document.getElementById("iconStroke").value || '';
  const strokeWidth = document.getElementById("iconStrWid").value || '';

  // Apply to main icon
  if(iconFillN.checked){currIcon.setAttribute("fill", "none");}else{currIcon.setAttribute("fill", fill);}
  currIcon.setAttribute("stroke", stroke);
  currIcon.setAttribute("stroke-width", strokeWidth);
  currIcon.setAttribute("stroke-linejoin", document.getElementById("linejoin").value || '');
  currIcon.setAttribute("stroke-linecap", document.getElementById("linecap").value || '');

  // Also apply to all child paths inside the SVG
  currIcon.querySelectorAll("path, circle, rect, line, polygon, polyline").forEach(el => {
    el.setAttribute("fill", fill);
    el.setAttribute("stroke", stroke);
    el.setAttribute("stroke-width", strokeWidth);
  });
  updateCode();
}
  
let historyStack = [];
let redoStack = [];

function getIframeDoc() {
  const iframe = document.getElementById("canvas");
  return iframe.contentDocument || iframe.contentWindow.document;
}

// ✅ Save entire HTML of iframe
function saveHistory() {
  const doc = getIframeDoc();
  const fullHTML = doc.documentElement.outerHTML;

  historyStack.push(fullHTML);
  if (historyStack.length > 100) historyStack.shift();
  redoStack = [];
  console.log("Full document history saved");
}

// ✅ Undo entire HTML
function undoEdit() {
  if (historyStack.length === 0) return;

  const doc = getIframeDoc();
  const currentHTML = doc.documentElement.outerHTML;
  redoStack.push(currentHTML);

  const lastHTML = historyStack.pop();
  doc.open();
  doc.write(lastHTML);
  doc.close();
}

// ✅ Redo entire HTML
function redoEdit() {
  if (redoStack.length === 0) return;

  const doc = getIframeDoc();
  const currentHTML = doc.documentElement.outerHTML;
  historyStack.push(currentHTML);

  const nextHTML = redoStack.pop();
  doc.open();
  doc.write(nextHTML);
  doc.close();
}


  function clearSelected() {
    document.getElementById("canvas").contentDocument.body.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));
  }

   //document.getElementById("opct").value = 1;
  function openEdit(el) {
    currentEditingElement = el;
    document.getElementById('editId').value = el.id || '';
    document.getElementById('editClass').value = el.className || '';
    document.getElementById('editSrc').value = el.src || '';
    document.getElementById('editOnclick').value = el.getAttribute('onclick') || '';
    
    // 1. 
    document.getElementById('clr').value = RGBtoHEX(el.style.color) || '';
    document.getElementById('fnfml').value = el.style.fontFamily || '';
    document.getElementById('fnsz').value = el.style.fontSize.replace('px', '') || '';
    document.getElementById('fnwet').value = el.style.fontWeight || '';
    document.getElementById('fnstl').value = el.style.fontStyle || '';
    document.getElementById('txtalg').value = el.style.textAlign || '';
    document.getElementById('txtdec').value = el.style.textDecoration || '';
    document.getElementById('txttsfm').value = el.style.textTransform || '';
    document.getElementById('lnhet').value = el.style.lineHeight || '';
    document.getElementById('ltsp').value = el.style.letterSpacing.replace('px', '') || '';
    
    // 2.
    document.getElementById('mar').value = el.style.margin || '';
    document.getElementById('pad').value = el.style.padding || '';
    document.getElementById('bor').value = el.style.border || '';
    document.getElementById('borrd').value = el.style.borderRadius.replace('px', '') || '';
    document.getElementById('bxsz').value = el.style.boxSizing || '';
    document.getElementById('wid').value = el.style.width || '';
    document.getElementById('hei').value = el.style.height || '';
    document.getElementById('mwid').value = el.style.maxWidth || '';
    document.getElementById('mnhei').value = el.style.minHeight || '';
    
    // 3.
    document.getElementById('bakcol').value = RGBtoHEX(el.style.backgroundColor) || '';
    document.getElementById('bakcolt').value = el.style.backgroundColor || '';
    document.getElementById('bakpos').value = el.style.backgroundPosition || '';
    document.getElementById('baksz').value = el.style.backgroundSize || '';
    document.getElementById('bakrep').value = el.style.backgroundRepeat || '';
    document.getElementById('objectFit').value = el.style.objectFit || '';
    // document.getElementById('bakimg').value = MygetOnlyUrl() || '';
    //document.getElementById('opct').value = el.style.opacity || '';
    
    // 4.
    document.getElementById('editPosition').value = el.style.position || '';
    document.getElementById('mar-t').value = el.style.marginTop.replace('px', '') || '';
    document.getElementById('mar-r').value = el.style.marginRight.replace('px', '') || '';
    document.getElementById('mar-b').value = el.style.marginBottom.replace('px', '') || '';
    document.getElementById('mar-l').value = el.style.marginLeft.replace('px', '') || '';
    document.getElementById('pad-t').value = el.style.paddingTop.replace('px', '') || '';
    document.getElementById('pad-r').value = el.style.paddingRight.replace('px', '') || '';
    document.getElementById('pad-b').value = el.style.paddingBottom.replace('px', '') || '';
    document.getElementById('pad-l').value = el.style.paddingLeft.replace('px', '') || '';
    document.getElementById('zindex').value = el.style.zIndex || '';
    document.getElementById('dspl').value = el.style.display || '';
    document.getElementById('flt').value = el.style.float || '';
    document.getElementById('ovrfl').value = el.style.overflow || '';
    document.getElementById('vsblt').value = el.style.visibility || '';
    
    // 5.
    document.getElementById('flxd').value = el.style.flexDirection || '';
    document.getElementById('jstfc').value = el.style.justifyContent || '';
    document.getElementById('algni').value = el.style.alignItems || '';
    document.getElementById('flxw').value = el.style.flexWrap || '';
    document.getElementById('gtc').value = el.style.gridTemplateColumn || '';
    document.getElementById('gtr').value = el.style.gridTemplateRow || '';
    document.getElementById('gap').value = el.style.gap || '';
    
    // 6.
    document.getElementById('trnsfm').value = el.style.transform || '';
    document.getElementById('trnstn').value = el.style.transition || '';
    document.getElementById('anmtn').value = el.style.animation || '';
    
    //7.
    document.getElementById('cursor').value = el.style.cursor || '';
    document.getElementById('bxshd').value = el.style.boxShadow || '';
    document.getElementById('filter').value = el.style.filter || '';
    document.getElementById('usrslct').value = el.style.userSelect || '';
    document.getElementById('pointerEvent').value = el.style.pointerEvent || '';
    document.getElementById('clipPath').value = el.style.clipPath || '';
    
    document.getElementById('editModal').style.display = 'block';
  }
  
  function RGBtoHEX(rgb) {
    // Extract numbers from the RGB format
    let match = rgb.match(/\d+/g);
    
    if (!match || match.length < 3) return null; // Invalid input

    // Convert each value to HEX and ensure it's two digits
    let hex = match.slice(0, 3).map(x => {
        let h = parseInt(x).toString(16);
        return h.length === 1 ? "0" + h : h; // Add leading zero if needed
    }).join("");

    return `#${hex}`;
  }
function applyEdit() {
    if (!currentEditingElement) return;

    currentEditingElement.id = document.getElementById('editId').value.trim();
    currentEditingElement.className = document.getElementById('editClass').value.trim();
    currentEditingElement.src = document.getElementById('editSrc').value.trim();
    const onclickCode = document.getElementById('editOnclick').value.trim();
    
    const newPos = document.getElementById('editPosition').value;
    const mt = document.getElementById('mar-t').value +'px';
    const mr = document.getElementById('mar-r').value +'px';
    const mb = document.getElementById('mar-b').value +'px';
    const ml = document.getElementById('mar-l').value +'px';
    const pt = document.getElementById('pad-t').value +'px';
    const pr = document.getElementById('pad-r').value +'px';
    const pb = document.getElementById('pad-b').value +'px';
    const pl = document.getElementById('pad-l').value +'px';
    

    if (onclickCode) {
      try {
        currentEditingElement.onclick = new Function(onclickCode);
      } catch {
        alert("Invalid onclick code");
      }
    } else {
      currentEditingElement.removeAttribute('onclick');
    }

    currentEditingElement.style.color = document.getElementById('clr').value || '';
    currentEditingElement.style.fontFamily = document.getElementById('fnfml').value || '';
    currentEditingElement.style.fontSize = document.getElementById('fnsz').value +'px' || '';
    currentEditingElement.style.fontWeight = document.getElementById('fnwet').value || '';
    currentEditingElement.style.fontStyle = document.getElementById('fnstl').value || '';
    currentEditingElement.style.textAlign = document.getElementById('txtalg').value || '';
    currentEditingElement.style.textDecoration = document.getElementById('txtdec').value || '';
    currentEditingElement.style.textTransform = document.getElementById('txttsfm').value || '';
    currentEditingElement.style.lineHeight = document.getElementById('lnhet').value || '';
    currentEditingElement.style.letterSpacing = document.getElementById('ltsp').value +'px' || '';
    
    currentEditingElement.style.margin = document.getElementById('mar').value +'px' || '';
    currentEditingElement.style.padding = document.getElementById('pad').value +'px' || '';
    currentEditingElement.style.border = document.getElementById('bor').value || '';
    currentEditingElement.style.borderRadius = document.getElementById('borrd').value +'px' || '';
    currentEditingElement.style.boxSizing = document.getElementById('bxsz').value || '';
    currentEditingElement.style.width = document.getElementById('wid').value || '';
    currentEditingElement.style.height = document.getElementById('hei').value || '';
    currentEditingElement.style.maxWidth = document.getElementById('mwid').value || '';
    currentEditingElement.style.minHeight = document.getElementById('mnhei').value || ''; 
    
    currentEditingElement.style.backgroundColor = document.getElementById('bakcolt').value || '';
    //currentEditingElement.style.backgroundColor = document.getElementById('bakcol').value || '';
    currentEditingElement.style.backgroundPosition = document.getElementById('bakpos').value || '';
    currentEditingElement.style.backgroundSize = document.getElementById('baksz').value || '';
    currentEditingElement.style.backgroundRepeat = document.getElementById('bakrep').value || '';
    currentEditingElement.style.objectFit = document.getElementById('objectFit').value || '';
    function MygetUrl(){
       var url = document.getElementById('bakimg').value;
       var bk = document.getElementById("bakimg");
       bk.value="";
       bk.value = `url('${url}')`;
       bk.value = url;
       return `url('${url}')`;
    }
    currentEditingElement.style.backgroundImage = MygetUrl() || '';
    currentEditingElement.style.opacity = document.getElementById('opct').value || '';
    

    currentEditingElement.style.position = newPos || '';
    currentEditingElement.style.marginTop = mt || '';
    currentEditingElement.style.marginRight = mr || '';
    currentEditingElement.style.marginBottom = mb || '';
    currentEditingElement.style.marginLeft = ml || '';
    currentEditingElement.style.paddingTop = pt || '';
    currentEditingElement.style.paddingRight = pr || '';
    currentEditingElement.style.paddingBottom = pb || '';
    currentEditingElement.style.paddingLeft = pl || '';
    currentEditingElement.style.zIndex = document.getElementById('zindex').value || '';
    currentEditingElement.style.display = document.getElementById('dspl').value || '';
    currentEditingElement.style.float = document.getElementById('flt').value || '';
    currentEditingElement.style.overflow = document.getElementById('ovrfl').value || '';
    currentEditingElement.style.visibility = document.getElementById('vsblt').value || '';
    
    currentEditingElement.style.flexDirection = document.getElementById('flxd').value || '';
    currentEditingElement.style.justifyContent = document.getElementById('jstfc').value || '';
    currentEditingElement.style.alignItems = document.getElementById('algni').value || '';
    currentEditingElement.style.flexWrap = document.getElementById('flxw').value || '';
    currentEditingElement.style.gridTemplateColumn = document.getElementById('gtc').value || '';
    currentEditingElement.style.gridTemplateRow = document.getElementById('gtr').value || '';
    currentEditingElement.style.gap = document.getElementById('gap').value || '';
    
    currentEditingElement.style.transform = document.getElementById('trnsfm').value || '';
    currentEditingElement.style.transition = document.getElementById('trnstn').value || '';
    currentEditingElement.style.animation = document.getElementById('anmtn').value || '';
    
    currentEditingElement.style.cursor = document.getElementById('cursor').value || '';
    currentEditingElement.style.boxShadow = document.getElementById('bxshd').value || '';
    currentEditingElement.style.filter = document.getElementById('filter').value || '';
    currentEditingElement.style.userSelect = document.getElementById('usrslct').value || '';
    currentEditingElement.style.pointerEvent = document.getElementById('pointerEvent').value || '';
    currentEditingElement.style.clipPath = document.getElementById('clipPath').value || '';
    
    
    //currentEditingElement = null;
  //  document.getElementById('editModal').style.display = 'none';
    updateTree();
   // saveHistory();    
    Notify("Applying All css Properties", "s");
  }

  function closeEdit() {
    currentEditingElement = null;
    document.getElementById('editModal').style.display = 'none';
  }

let copiedStyleData = null;

function copyStyle() {
    if (!currentEditingElement) {
        alert("No element selected to copy from!");
        return;
    }

    const computedStyles = window.getComputedStyle(currentEditingElement);
    copiedStyleData = {};

    for (let prop of computedStyles) {
        copiedStyleData[prop] = computedStyles.getPropertyValue(prop);
    }

    showPopup("Styles copied!","",true,false);
}

function pasteStyle() {
    if (!currentEditingElement) {
        alert("No element selected to paste into!");
        return;
    }

    if (!copiedStyleData) {
        alert("No styles copied yet!");
        return;
    }

    for (let prop in copiedStyleData) {
        currentEditingElement.style[prop] = copiedStyleData[prop];
    }

    showPopup("Styles pasted!","",true,false);
}

  updateTree();

function AddEvent(){
   const evid = prompt("write id name");
   const evname = prompt("write Event Name");
   const fun = prompt("write Function name 'funName()'");
   console.log(`${evid}, ${evname}, ${fun}`);
   
   const content = `document.getElementById('${evid}').addEventListener('${evname}', ${fun}());`;
   customFiles[filename].content = content;
   console.log(currentFile);
}

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

// Update file list UI
function updateFileList() {
  const list = document.getElementById('fileList');
  list.innerHTML = '';
  for (const file in customFiles) {
    const li = document.createElement('li');
    li.className = "fileNamecssjs";
    li.textContent = file;
    li.onclick = () => {
      currentFile = file;
      document.getElementById('fileEditor').value = customFiles[file].content;
    };
    const del = document.createElement('button');
    del.textContent = 'X';
    del.onclick = e => {
      e.stopPropagation();
      deleteFile(file);
    };
    li.appendChild(del);
    list.appendChild(li);
  }
}

// Save file content and inject
function applyFile() {
  if (!currentFile) return;
  const content = document.getElementById('fileEditor').value;
  const type = customFiles[currentFile].type;
  customFiles[currentFile].content = content;

  // 🔁 STEP 1: Target iframe document
  const iframe = document.getElementById('canvas');
  const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

  // 🔁 STEP 2: Remove old tag (if exists) with same filename marker
  const existing = iframeDoc.querySelector(`${type === 'js' ? 'script' : 'style'}[data-file="${currentFile}"]`);
  if (existing) existing.remove();

  // ✅ STEP 3: Create new tag
  const tag = iframeDoc.createElement(type === 'js' ? 'script' : 'style');
  tag.textContent = content;
  tag.dataset.custom = 'true';
  tag.dataset.file = currentFile;  // 🔖 Use data-file attribute to uniquely identify

  iframeDoc.head.appendChild(tag); // Better: inject in <head>
  updateFileList();
  runUserCode(content);
}

function runUserCode(code) {
  try {
    new Function(code)(); // safer than eval
  } catch (e) {
    var ertag = document.getElementById("errorTag");
    ertag.textContent = e.message;
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



// icon editor 

  const svg = document.getElementById("iconEditorArea");
  const codeBox = document.getElementById("svgCode");
  const fileInput = document.getElementById("addImgInBackSvg");
  let svgBackImg;

fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    svg.style.background = `url(${reader.result}) center center / contain no-repeat`;
    svgBackImg = reader.result;
  };
  reader.readAsDataURL(file);
});

  function updateCode() {
    const clone = svg.cloneNode(true);
    clone.id="IconSvg";
    // Remove handles
    clone.querySelectorAll('.handle').forEach(h => h.remove());
    clone.querySelectorAll('.grid-lines').forEach(gl => gl.remove());
    // for insertion into array
    clone.style="width: 30px;height: 30px;background: transperant;";
    codeBox.value = clone.outerHTML;
    saveIconCodeGlobely = codeBox.value;
    // for preview 
    clone.style="width: 100%;height: 100%;";
    codeBox.value = clone.outerHTML;
    document.getElementById("previewIcon").innerHTML = codeBox.value;
    treeIcon();
  }
  var hc = "";
  const stepSize = 5;
  
function createHandle(cx, cy, onDrag) {
  const handle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  handle.setAttribute("class", "handle");
  handle.setAttribute("r", 1);
  handle.setAttribute("stroke", "white");

  // Set handle fill color
  if (hc === "red") {
    handle.setAttribute("fill", "red");
  } else if (hc === "green") {
    handle.setAttribute("fill", "green");
  } else if (hc === "skyblue") {
    handle.setAttribute("fill", "skyblue");
  } else if (hc === "yellow") {
    handle.setAttribute("fill", "yellow");
  } else {
    console.log("no choose shape");
  }

  handle.setAttribute("cx", cx);
  handle.setAttribute("cy", cy);

  function dragStart(e) {
    e.preventDefault();

    function move(ev) {
      const pt = svg.createSVGPoint();
      const touch = ev.touches ? ev.touches[0] : ev;
      pt.x = touch.clientX;
      pt.y = touch.clientY;

      const svgPt = pt.matrixTransform(svg.getScreenCTM().inverse());

      // ✅ Snap coordinates to nearest step
      const snappedX = Math.round(svgPt.x / stepSize) * stepSize;
      const snappedY = Math.round(svgPt.y / stepSize) * stepSize;

      handle.setAttribute("cx", snappedX);
      handle.setAttribute("cy", snappedY);

      onDrag(snappedX, snappedY); // Update element position
      updateCode();
      treeIcon();
    }

    function end() {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", end);
      document.removeEventListener("touchmove", move);
      document.removeEventListener("touchend", end);
    }

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", end);
    document.addEventListener("touchmove", move, { passive: false });
    document.addEventListener("touchend", end);
  }

  handle.addEventListener("mousedown", dragStart);
  handle.addEventListener("touchstart", dragStart, { passive: false });

  svg.appendChild(handle);
}

  function addLine() {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", 10);
    line.setAttribute("y1", 10);
    line.setAttribute("x2", 90);
    line.setAttribute("y2", 90);
    line.setAttribute("stroke", "white");
    line.setAttribute("stroke-width", 2);
    svg.appendChild(line);

    hc = "red";
    createHandle(10, 10, (x, y) => {
      line.setAttribute("x1", x);
      line.setAttribute("y1", y);
    });

    createHandle(90, 90, (x, y) => {
      line.setAttribute("x2", x);
      line.setAttribute("y2", y);
    });
    
    updateCode();
    treeIcon();
  }

let linePath = null;
let linePoints = [];

function addPathLine(x = 10, y = 10) {
  linePath = document.createElementNS("http://www.w3.org/2000/svg", "path");
  linePath.setAttribute("stroke", "white");
  linePath.setAttribute("fill", "none");
  linePath.setAttribute("stroke-width", 2);
  svg.appendChild(linePath);

  linePoints = [{ x, y, cmd: "M" }];
  updateLinePath();

  hc = "orange";
  createHandleRef(linePoints[0], updateLinePath);
  updateCode();
}

function addLineJoin(x, y, cmd = "L") {
  if (!linePath) return;

  const point = { x, y, cmd };
  linePoints.push(point);
  updateLinePath();

  hc = "orange";
  createHandleRef(point, updateLinePath);
  updateCode();
}

function updateLinePath() {
  if (!linePath || !linePoints.length) return;

  const d = [];

  for (let i = 0; i < linePoints.length; i++) {
    const p = linePoints[i];

    switch (p.cmd) {
      case "M":
      case "L":
        d.push(`${p.cmd} ${p.x} ${p.y}`);
        break;
      case "H":
        d.push(`${p.cmd} ${p.x}`);
        break;
      case "V":
        d.push(`${p.cmd} ${p.y}`);
        break;
      case "C":
        // Need 3 points (current and 2 controls), skip if not enough
        if (i + 2 < linePoints.length) {
          const p1 = linePoints[++i];
          const p2 = linePoints[++i];
          d.push(`C ${p.x} ${p.y}, ${p1.x} ${p1.y}, ${p2.x} ${p2.y}`);
        }
        break;
      // Add more commands if needed
    }
  }

  linePath.setAttribute("d", d.join(" "));
}

svg.addEventListener("click", function (e) {
  const pt = svg.createSVGPoint();
  pt.x = e.clientX;
  pt.y = e.clientY;
  const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());

  // Default to Line (L), but you can allow user selection
  addLineJoin(svgP.x, svgP.y, currentCommand || "L");
});

function closePath() {
  if (!linePath || linePoints.length < 3) return;

  // Same logic but close it with Z
  updateLinePath();
  const d = linePath.getAttribute("d");
  linePath.setAttribute("d", d + " Z");
  updateCode();
}

let currentCommand="L";
function createHandleRef(pointRef, onUpdate) {
  const handle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  handle.setAttribute("class", "handle");
  handle.setAttribute("r", 1);
  handle.setAttribute("fill", hc || "orange");
  handle.setAttribute("stroke", "white");
  svg.appendChild(handle);

  let isDragging = false;

  const moveHandle = (clientX, clientY) => {
    const svgPoint = svg.createSVGPoint();
    svgPoint.x = clientX;
    svgPoint.y = clientY;
    const svgP = svgPoint.matrixTransform(svg.getScreenCTM().inverse());

    const snappedPX = Math.round(svgP.x / stepSize) * stepSize;
    const snappedPY = Math.round(svgP.y / stepSize) * stepSize;

   // grid of
   /* pointRef.x = svgP.x;
    pointRef.y = svgP.y;

    handle.setAttribute("cx", svgP.x);
    handle.setAttribute("cy", svgP.y); */
    
    // grid on
    pointRef.x = snappedPX;
    pointRef.y = snappedPY;

    handle.setAttribute("cx", snappedPX);
    handle.setAttribute("cy", snappedPY);

    onUpdate();
  };

  // Mouse events
  handle.addEventListener("mousedown", e => {
    e.preventDefault();
    isDragging = true;
  });

  document.addEventListener("mousemove", e => {
    if (isDragging) moveHandle(e.clientX, e.clientY);
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
  });

  // Touch events
  handle.addEventListener("touchstart", e => {
    e.preventDefault();
    isDragging = true;
  }, { passive: false });

  document.addEventListener("touchmove", e => {
    if (isDragging && e.touches.length > 0) {
      const touch = e.touches[0];
      moveHandle(touch.clientX, touch.clientY);
      updateCode();
      treeIcon();
    }
  }, { passive: false });

  document.addEventListener("touchend", () => {
    isDragging = false;
  });

  // Initial position set
  handle.setAttribute("cx", pointRef.x);
  handle.setAttribute("cy", pointRef.y);
}

  function addCircle() {
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", 50);
    circle.setAttribute("cy", 50);
    circle.setAttribute("r", 20);
    circle.setAttribute("stroke", "white");
    circle.setAttribute("fill", "none");
    circle.setAttribute("stroke-width", 2);
    svg.appendChild(circle);

    hc="skyblue";
    createHandle(50, 50, (x, y) => {
      circle.setAttribute("cx", x);
      circle.setAttribute("cy", y);
    });

    createHandle(60, 60, (x, y) => {
      const cx = parseFloat(circle.getAttribute("cx"));
      const cy = parseFloat(circle.getAttribute("cy"));
      const r = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
      circle.setAttribute("r", r);
    });

    updateCode();
    treeIcon();
  }

  function addCurve() {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    let p1 = {x: 10, y: 10}, p2 = {x: 90, y: 90}, cp1 = {x: 10, y: 50}, cp2 = {x: 50, y: 10};

    function updatePath() {
      path.setAttribute("d", `M ${p1.x} ${p1.y} C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${p2.x} ${p2.y}`);
    }

    path.setAttribute("stroke", "white");
    path.setAttribute("fill", "none");
    path.setAttribute("stroke-width", 1);
    svg.appendChild(path);
    updatePath();

    hc="green";
    createHandle(p1.x, p1.y, (x, y) => { p1 = {x, y}; updatePath(); });
    createHandle(p2.x, p2.y, (x, y) => { p2 = {x, y}; updatePath(); });
    createHandle(cp1.x, cp1.y, (x, y) => { cp1 = {x, y}; updatePath(); });
    createHandle(cp2.x, cp2.y, (x, y) => { cp2 = {x, y}; updatePath(); });

    updateCode();
    treeIcon();
  }


  
  function addRectangle() {
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", 10);
    rect.setAttribute("y", 10);
    rect.setAttribute("width", 80);
    rect.setAttribute("height", 80);
    rect.setAttribute("fill", "none");
    rect.setAttribute("stroke", "white");
    rect.setAttribute("stroke-width", 2);
    svg.appendChild(rect);

    const start = { x: 10, y: 10 };
    const end = { x: 90, y: 90 };
    
    hc ="yellow";
    createHandle(start.x, start.y, (x, y) => {
      start.x = x;
      start.y = y;
      updateRect();
    });

    createHandle(end.x, end.y, (x, y) => {
      end.x = x;
      end.y = y;
      updateRect();
    });

    function updateRect() {
      rect.setAttribute("x", Math.min(start.x, end.x));
      rect.setAttribute("y", Math.min(start.y, end.y));
      rect.setAttribute("width", Math.abs(end.x - start.x));
      rect.setAttribute("height", Math.abs(end.y - start.y));
    }

    updateCode();
    treeIcon();
  }
  
function drawGrid(svg, step, color = "#444", strokeWidth = 0.5) {
  step = stepSize;
  // Remove previous grid if any
  const oldGrid = svg.querySelector("g.grid-lines");
  if (oldGrid) oldGrid.remove();

  const gridGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
  gridGroup.setAttribute("class", "grid-lines");         

  const width = svg.viewBox.baseVal.width;
  const height = svg.viewBox.baseVal.height;

  for (let x = 0; x <= width; x += step) {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", x);
    line.setAttribute("y1", 0);
    line.setAttribute("x2", x);
    line.setAttribute("y2", height);
    line.setAttribute("stroke", color);
    line.setAttribute("stroke-width", strokeWidth);
    gridGroup.appendChild(line);
  }

  for (let y = 0; y <= height; y += step) {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", 0);
    line.setAttribute("y1", y);
    line.setAttribute("x2", width);
    line.setAttribute("y2", y);
    line.setAttribute("stroke", color);
    line.setAttribute("stroke-width", strokeWidth);
    gridGroup.appendChild(line);
  }

  svg.insertBefore(gridGroup, svg.firstChild); // Send to back
}

document.getElementById("toggleGrid").addEventListener("change", e => {
  if (e.target.checked) {
    drawGrid(svg, 20);
  } else {
    const oldGrid = svg.querySelector("g.grid-lines");
    if (oldGrid) oldGrid.remove();
  }
});

  function resetCanvas() {
    svg.innerHTML = '';
    updateCode();
  }
  
  //function addBackImgInSvg(){svg.style.background=`url('${svgBackImg}') center center`;} 

  function copyCode() {
    navigator.clipboard.writeText(codeBox.value).then(() => {
      alert("SVG code copied!");
    }).catch(() => {
      alert("Copy failed!");
    });
  }
  
  
// popup script 
function showPopup( heading, description, accept, cancel, n) {
  document.getElementById("popup-heading").innerText = heading;
  document.getElementById("popup-description").innerText = description;
  
  const overlay = document.getElementById("popup-overlay");
  const acceptBtn = document.getElementById("popup-accept");
  const cancelBtn = document.getElementById("popup-cancel");

  acceptBtn.style.display = accept ? "inline-block" : "none";
  cancelBtn.style.display = cancel ? "inline-block" : "none";

  overlay.classList.remove("hidden");

  acceptBtn.onclick = () => {
    if (n) deleteProject(n);
    overlay.classList.add("hidden");
    console.log("Accepted");
  };

  cancelBtn.onclick = () => {
    overlay.classList.add("hidden");
    console.log("Cancelled");
  };
}
// Example usage:
// showPopup({ heading: "Payment Done", description: "Thank you!", accept: true, cancel: true });

var n = document.getElementById("notify");
function Notify(str, r){ 
   n.textContent = str;let backColorNotify;
   if(r==="s") {backColorNotify ="#1f8616" } else{backColorNotify="#863722";}
   n.style.background= backColorNotify;
   n.style.top= "10px";
   setTimeout(nn,2500);
} 
function nn(){n.style.top="-50px";}

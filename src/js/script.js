
function MyTabClose(){
   document.querySelectorAll('.footBtn').forEach( fs => {
      fs.classList.toggle('hidden');
   });
} 

function MyOpen(id){
   document.querySelectorAll('.tab').forEach( v => {
      v.style.display="none";v.style.top="5%";v.style.right="10px";
   });
   document.getElementById(id).style.display="block";
   if (id == "fullcodearea") rr();
   if (id == "editModal") id.style.margin ="30px 20px 0 0"; 
   if (id == "sidebar") updateTree();
   if (id == "iconEditorTab" || id == "addSh" || id == "treeTabForIcon" || id == "previewIconTab") document.getElementById("iconEditor").style.display ="block";
   if (id == "iconEditor") document.getElementById("iconEditor").style.width="90%";
   dek();
}

function MyClose(id){
   document.getElementById(id).style.display="none";
}

let ffcode;
async function rr() {
  const iframe = document.getElementById("canvas");
  const iframeDoc = iframe.contentDocument.documentElement || iframe.contentWindow.document;

  if (iframeDoc.querySelector('#scriptDragDropEl')) iframeDoc.querySelector('#scriptDragDropEl').remove();
  if (iframeDoc.querySelector('.behOverlay')) iframeDoc.querySelector('.behOverlay').remove();

  // Get the body HTML from iframe
  let html = iframeDoc.innerHTML;
  
  if (ffcode){ html = ffcode;alert(ffcode);}

  let resultHead = iframeDoc.head.innerHTML;
  //resultHead += formatNode(iframeDoc.head, 0);

  // Clean up editor-related attributes
  let newHtml = html.replace(/contenteditable="true"/g, '');
  newHtml = newHtml.replace(/editable/g, '');
  newHtml = newHtml.replace(/data-="true"/g, '');

   const API_URL = "https://code-generator-836m.onrender.com/api/generate-code";

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ html: newHtml })
    });

    const data = await res.json();
    const html4 = `<!DOCTYPE html>\n<html>\n<head>\n${resultHead}\n<style>\n${data.css}\n</style>\n</head>\n${data.html}\n</html>`;
    console.log("Conversion stats:", data.stats);

  } catch (err) {
    console.error(err);
    alert("Failed to generate code");
  }
  document.getElementById("htmlcssjs").textContent = html4;

  // Set cleaned HTML to display area
 // document.getElementById("htmlcssjs").textContent = newHtml3;
   // beautify(newHtml);
}

function beautify(htmlString) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');

  let result = '<!-- full code made in WebEd tool -->\n';
  result += formatNode(doc.documentElement, 0);

  document.getElementById("htmlcssjs").textContent = result.trim();
}

function formatNode(node, level) {
  const indent = '  '.repeat(level);
  let result = '';

  node.childNodes.forEach(child => {
    if (child.nodeType === Node.ELEMENT_NODE) {
      const tagName = child.tagName.toLowerCase();

      const attrs = Array.from(child.attributes)
        .map(attr => `${attr.name}="${attr.value}"`)
        .join(' ');
      const openTag = attrs ? `<${tagName} ${attrs}>` : `<${tagName}>`;

      const isSelfClosing = child.childNodes.length === 0;

      if (isSelfClosing && ['meta', 'link', 'img', 'br', 'hr', 'input'].includes(tagName)) {
        // Format as self-closing if applicable
        result += `${indent}<${tagName}${attrs ? ' ' + attrs : ''} />\n`;
      } else {
        result += `${indent}${openTag}\n`;
        result += formatNode(child, level + 1);
        result += `${indent}</${tagName}>\n`;
      }

    } else if (child.nodeType === Node.TEXT_NODE) {
      const text = child.textContent.trim();
      if (text) {
        result += `${indent}${text}\n`;
      }
    } else if (child.nodeType === Node.COMMENT_NODE) {
      result += `${indent}<!-- ${child.textContent.trim()} -->\n`;
    }
  });

  return result;
}

// links for css fonts
       const iframe = document.getElementById("canvas");
       const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
       const link = iframeDoc.createElement("link");
       link.rel = "stylesheet";
       link.href = "https://fonts.googleapis.com/css2?family=Nunito:wght@200;300;400;500;600;700;800;900;1000&family=Roboto:wght@300;400;500;700&display=swap";
       iframeDoc.head.appendChild(link);

// icon data base
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

const arrowTR = `<svg width="20" height="20" viewBox="0 0 100 100"><path d="M 10 10 L 10 50 Z M 10 50 L 70 50 Z M 40 20 L 70 50 Z M 40 80 L 70 50 Z" stroke="white" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

let copiedElement = null;
let isCopied = false;

function updateTree() {
  const tree = document.getElementById('tree');
  tree.innerHTML = '';

  function buildTree(el, container) {
    Array.from(el.children).forEach(child => {
      if (child.classList && child.classList.contains('behOverlay')) return;
      if (child.id && child.id.includes('scriptDragDropEl')) return;
      if (child.tagName && child.tagName==='script') return;
      if (child.tagName && child.tagName==='style') return;
      
      const item = document.createElement('div');
      item.className = 'tree-item';

      const label = document.createElement('span');
      label.className = 'tree-label';

      const id = child.id ? `#${child.id}` : '';

      let classString = '';
      if (typeof child.className === 'string') {
        classString = child.className;
      } else if (child.className && typeof child.className.baseVal === 'string') {
        classString = child.className.baseVal;
      }
      const cls = classString ? `.${classString.split(' ').join('.')}` : '';
      const tagLabel = `${child.tagName.toLowerCase()} ${id}${cls}`;
      label.innerHTML = /*arrowTR +*/ "< " + String(tagLabel) + " >";

      // 👇 Element select action
      label.onclick = () => {
        selectedParent = child;
        clearSelected();
        child.classList.add('selected');
        document.getElementById('canvas').contentDocument.body.querySelectorAll('svg, span, div, line, path, circle, curve, rec, img, video').forEach(edel => {edel.style.outline = "none";edel.classList.add('editable');});
        document.getElementById('canvas').contentDocument.body.querySelectorAll('.editable').forEach(edel => {edel.style.outline = "none";});
        document.getElementById('canvas').contentDocument.body.querySelectorAll('.selected').forEach(edel => {edel.style.outline = "1px solid blue";});
        //updateTree();
      };

      const actions = document.createElement('span');
      actions.className = 'tree-actions';

      // ✏️ Edit button
      const editBtn = document.createElement('button');
      editBtn.className = "actbtn";
      editBtn.textContent = '✏️';
      editBtn.dataset.title = 'Edit';
      editBtn.onclick = () => openEdit(child);

      // 🗑 Delete button
      const delBtn = document.createElement('button');
      delBtn.className = "actbtn";
      delBtn.textContent = '🗑';
      delBtn.dataset.title = "Delete element";
      delBtn.onclick = () => {
        if (selectedParent === child) {
          selectedParent = document.getElementById('canvas');
          clearSelected();
        }
        child.remove();
        updateTree(); saveHistory();
      };

      // 📋 Copy/Paste button
      const cpBtn = document.createElement('button');
      cpBtn.className = "actbtn";
      cpBtn.textContent = isCopied ? '📥' : '📋';
      cpBtn.dataset.title = isCopied ? 'Paste copied element' : 'Copy this element';
      cpBtn.onclick = () => {
        if (!isCopied) {
          copiedElement = child.cloneNode(true);
          isCopied = true;
          cpBtn.textContent = '📥';
          cpBtn.dataset.title = 'Paste copied element';
        } else {
          if (selectedParent) {
            const pasted = copiedElement.cloneNode(true);
            selectedParent.appendChild(pasted);
            isCopied = false;
            copiedElement = null;
            cpBtn.textContent = '📋';
            cpBtn.dataset.title = 'Copy this element';
            updateTree();
            saveHistory();
            showOverlay(pasted);
          }
        }
      };

      const act = document.createElement('button');
      act.textContent = "...";
      act.className = "act";

      const actw = document.createElement('div');
      actw.className="actw";

      // Add buttons
      actw.appendChild(editBtn);
      actw.appendChild(cpBtn);
      actw.appendChild(delBtn);
      act.appendChild(actw);
      actions.appendChild(act);
      if (child.tagName.toLowerCase() === 'body') {
        actw.removeChild(delBtn);
        actw.removeChild(cpBtn);
      }
      
      const ss = document.createElement('summary');
      const dd = document.createElement('details');
      ss.appendChild(label);
      ss.appendChild(actions);
      dd.appendChild(ss);
      dd.setAttribute('open', 'true');
      dd.style="margin-left: 10px; background: rgba(0,0,0,.3); padding: 5px;";
      
      if (child.tagName.toLowerCase() !== 'head') {
        container.appendChild(dd);
      }

      // Recursive tree
      if (child.children.length > 0) {
        buildTree(child, dd);
      }

      // Drag-and-drop support
      label.draggable = true;
      label.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', child.getAttribute('data-id') || '');
        draggedElement = child;
        label.style.outline = "2px solid green";
      });
      label.addEventListener('dragover', (e) => {
        e.preventDefault();
        if (isValidDropTarget(child, draggedElement)) {
          label.classList.add('drag-over');
        }
      });
      label.addEventListener('dragleave', () => {
        label.classList.remove('drag-over');
      });
      label.addEventListener('drop', (e) => {
        e.preventDefault();
        label.classList.remove('drag-over');
        if (!draggedElement || draggedElement.contains(child)) return;
        label.style.outline = "2px solid yellow";
        child.appendChild(draggedElement);
        updateTree();
        saveHistory();
      });
    });
  }

  const canvasDoc = document.getElementById('canvas').contentDocument;
  buildTree(canvasDoc.documentElement, tree);
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

   document.getElementById("opct").value = 1;
  function openEdit(el) {
    currentEditingElement = el;
    document.getElementById('editId').value = el.id || '';
    document.getElementById('editClass').value = el.className || '';
    document.getElementById('editSrc').value = el.src || '';
    
    // 1. 
    document.getElementById('clr').value = el.style.color || '';
   // document.getElementById('fnfml').value = el.style.fontFamily || '';
   // document.getElementById('fnsz').value = el.style.fontSize.replace('px', '') || '';
   // document.getElementById('fnwet').value = el.style.fontWeight || '';
    //document.getElementById('fnstl').value = el.style.fontStyle || '';
   // document.getElementById('txtalg').value = el.style.textAlign || '';
   // document.getElementById('txtdec').value = el.style.textDecoration || '';
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
    /*document.getElementById('bakcolt').value = el.style.backgroundColor || '';*/
    document.getElementById('bakpos').value = el.style.backgroundPosition || '';
    document.getElementById('baksz').value = el.style.backgroundSize || '';
    document.getElementById('bakrep').value = el.style.backgroundRepeat || '';
    document.getElementById('objectFit').value = el.style.objectFit || '';
    /*const cssUrl = el.style.backgroundImage;
    const extractedUrl = cssUrl.slice(5, -2);
    document.getElementById('bakimg').value = extractedUrl || '';
    //document.getElementById('opct').value = el.style.opacity || '';*/
    
    // 4.
    document.getElementById('editPosition').value = el.style.position || '';
    document.getElementById('mar-t').value = el.style.top.replace('px', '') || '';
    document.getElementById('mar-r').value = el.style.right.replace('px', '') || '';
    document.getElementById('mar-b').value = el.style.bottom.replace('px', '') || '';
    document.getElementById('mar-l').value = el.style.left.replace('px', '') || '';
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
    editBackgroundForElement(el);
    document.getElementById("addPresets").onclick = () => addPresets(el);
    
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
    
    const newPos = document.getElementById('editPosition').value;
    const mt = document.getElementById('mar-t').value +'px';
    const mr = document.getElementById('mar-r').value +'px';
    const mb = document.getElementById('mar-b').value +'px';
    const ml = document.getElementById('mar-l').value +'px';
    const pt = document.getElementById('pad-t').value +'px';
    const pr = document.getElementById('pad-r').value +'px';
    const pb = document.getElementById('pad-b').value +'px';
    const pl = document.getElementById('pad-l').value +'px';
    

    currentEditingElement.style.color = document.getElementById('clr').value || '';
   // currentEditingElement.style.fontFamily = document.getElementById('fnfml').value || '';
   // currentEditingElement.style.fontSize = document.getElementById('fnsz').value +'px' || '';
    //currentEditingElement.style.fontWeight = document.getElementById('fnwet').value || '';
    //currentEditingElement.style.fontStyle = document.getElementById('fnstl').value || '';
   // currentEditingElement.style.textAlign = document.getElementById('txtalg').value || '';
   // currentEditingElement.style.textDecoration = document.getElementById('txtdec').value || '';
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
    
    //currentEditingElement.style.backgroundColor = document.getElementById('bakcolt').value || '';
    //currentEditingElement.style.backgroundColor = document.getElementById('bakcol').value || '';
    currentEditingElement.style.backgroundPosition = document.getElementById('bakpos').value || '';
    currentEditingElement.style.backgroundSize = document.getElementById('baksz').value || '';
    currentEditingElement.style.backgroundRepeat = document.getElementById('bakrep').value || '';
    currentEditingElement.style.objectFit = document.getElementById('objectFit').value || '';
    /*function MygetUrl(){
       var url = document.getElementById('bakimg').value;
       var bk = document.getElementById("bakimg");
       bk.value="";
       bk.value = `url('${url}')`;
       bk.value = url;
       return `url('${url}')`;
    }
    currentEditingElement.style.backgroundImage = MygetUrl() || '';*/
    currentEditingElement.style.opacity = document.getElementById('opct').value || '';
    

    currentEditingElement.style.position = newPos || '';
    currentEditingElement.style.top = mt || '';
    currentEditingElement.style.right = mr || '';
    currentEditingElement.style.bottom = mb || '';
    currentEditingElement.style.left = ml || '';
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
    saveHistory();    
   // Notify("Applying All css Properties", "s");
  }
  function apply_txtalg(vv){
     currentEditingElement.style.textAlign = document.querySelector('.'+vv).getAttribute('txt-alg') || '';
     saveHistory();
  }
function fontS(sig) {
  let t = currentEditingElement;
  let currentSize = window.getComputedStyle(t, null).getPropertyValue('font-size');
  let size = parseFloat(currentSize); // removes 'px'

  if (sig === "incr") {
    size += 2;
  } else if (sig === "decr") {
    size -= 2;
  }
  t.style.fontSize = size + "px";
  saveHistory();
}
function txtdec(val){
   currentEditingElement.style.textDecoration = val;
   saveHistory();
}
function fnstl(){currentEditingElement.style.fontStyle = (currentEditingElement.style.fontStyle === 'normal') ? 'italic' : 'normal'; if(currentEditingElement.style.fontStyle === 'normal'){document.getElementById('fnstlbtn').style.background='transparent'}else{document.getElementById('fnstlbtn').style.background='rgba(100,100,100,.5)'}} 
function fnwet(){currentEditingElement.style.fontWeight = (currentEditingElement.style.fontWeight < 600) ? '600' : '500'; if(currentEditingElement.style.fontWeight < 600){document.getElementById('fnwetbtn').style.background='transparent'}else{document.getElementById('fnwetbtn').style.background='rgba(100,100,100,.5)'} }


// links for css fonts
function loadGoogleFont(fontN) {
  const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
  const fontLinkId = `google-font-${fontN.replace(/\s+/g, '-')}`;
  // Avoid duplicate loads
  if (iframeDoc.getElementById(fontLinkId)) return;
  
  const link = document.createElement("link");
  link.id = fontLinkId;
  link.href = `https://fonts.googleapis.com/css2?family=${fontN.replace(/\s+/g, '+')}&display=swap`;
  link.rel = "stylesheet";
  iframeDoc.head.appendChild(link);
}
/*
// links for Google icons integration 
const ICONS = [
  "home", "menu", "search", "account_circle", "delete", "add", "edit", "favorite",
  "star", "settings", "check", "close", "visibility", "lock", "camera", "send",
  "download", "info", "warning", "help", "language", "face", "phone", "email", "subscription", "add_circle",
  "thumb_down", "thumb_up","share","arrow_back","shopping_cart"
];*/

const ICONS = [
  "home","search","bookmark","menu","settings","account_circle","favorite","favorite_border","delete","add","close",
  "arrow_back","arrow_forward","check","star","star_border","info","warning","camera_alt","shopping_cart","email",
  "lock","visibility","visibility_off","share","edit","download","upload","phone","calendar_today","alarm",
  "battery_full","map","location_on","directions_car","local_cafe","wifi","bluetooth","cloud","play_arrow","pause",
  "stop","volume_up","volume_off","person","groups","school","work","light_mode","dark_mode","analytics","build",
  "book","brightness_medium","calendar_month","chat","chat_bubble","check_circle","construction","credit_card","currency_rupee",
  "directions","done_all","event","expand_more","file_copy","folder","globe","help","launch","link","list","location_city",
  "lock_open","logout","looks_one","more_vert","notifications","offline_bolt","paid","pets","print","refresh","save","schedule",
  "send","settings_applications","shopping_bag","speaker","thumb_up","thumb_down","timer","translate","visibility","workspaces",
  "account_box","android","announcement","badge","backup","battery_alert","beenhere","border_all","brightness_high","brush",
  "business","cached","cake","call","camera","cancel","card_giftcard","card_membership","card_travel","change_history",
  "check_box","check_circle_outline","chrome_reader_mode","class","close_fullscreen","cloud_circle","code","collections",
  "color_lens","comment","compare","dashboard","date_range","delete_forever","description","desktop_windows","directions_bike",
  "directions_boat","directions_bus","directions_railway","directions_walk","disc_full","dns","done","donut_large","donut_small",
  "drafts","eco","edit_location","eject","emoji_events","event_available","event_busy","event_note","exit_to_app",
  "explore","extension","face","fast_forward","fast_rewind","fiber_manual_record","file_download","file_upload","filter_list",
  "flag","flare","flash_auto","folder_special","format_align_center","format_bold","format_italic","forum","forward","gesture",
  "grade","group_add","g_translate","handyman","hdr_off","headset","hearing","help_outline","highlight","history","home_work",
  "hotel","hourglass_empty","https","image","import_contacts","import_export","inbox","indeterminate_check_box","info_outline",
  "input","invert_colors","keyboard","keyboard_alt","keyboard_arrow_down","keyboard_backspace","keyboard_tab","kitchen",
  "label","label_outline","language","launch","leadership","lightbulb","line_style","link_off","live_help","local_hospital",
  "lock_outline","looks","loop","mail_outline","map_outlined","markunread","maximize","memory","menu_open","merge_type","minimize",
  "money_off","monochrome_photos","mood","more_horiz","motorcycle","movie","mp","multiline_chart","music_note","nature",
  "navigate_before","navigate_next","note","notifications_off","ondemand_video","opacity","open_in_new","outlined_flag","palette",
  "panorama","pause_circle_filled","people","perm_camera_mic","person_add","phone_android","phonelink_off","pie_chart",
  "play_circle_filled","policy","polymer","poll","power_settings_new","pregnant_woman","print_disabled","public","push_pin",
  "radio_button_checked","receipt","redo","remove_circle","report_problem","restore","room","rowing","rss_feed","sale","schedule_send",
  "school","score","screen_rotation","search_off","security","select_all","send_and_archive","sentiment_dissatisfied","share_off",
  "shopping_cart_checkout","shuffle","signal_cellular_alt","skip_next","slideshow","smartphone","sms","sort","spa","spellcheck",
  "star_half","stop_circle","store","subject","swap_horiz","sync","table_chart","tag","text_fields","thumb_down_off_alt",
  "timer_off","toggle_off","train","tram","trending_up","tty","tv","undo","usb","videocam","volume_down","wallpaper"
];

// CDN links
const cdnLinks = {
  filled: "https://fonts.googleapis.com/icon?family=Material+Icons",
  outlined: "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined",
  rounded: "https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded"
};
   
// Initial CDN load
loadCDN("filled");

function loadCDN() {
  /*const cdnLinks = {
    filled: "https://fonts.googleapis.com/icon?family=Material+Icons",
    outlined: "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined",
    rounded: "https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded"
  };*/

  const iframe = document.getElementById("canvas");
  if (!iframe) return console.warn("❌ iframe #canvas not found");

  const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

  // Clean old links if already present
  ["material-icon-cdn-filled", "material-icon-cdn-outlined", "material-icon-cdn-rounded"].forEach(id => {
    const old = iframeDoc.getElementById(id);
    if (old) old.remove();
  });

  // Inject all styles
  Object.entries(cdnLinks).forEach(([style, href]) => {
    const link = iframeDoc.createElement("link");
    link.id = `material-icon-cdn-${style}`;
    link.rel = "stylesheet";
    link.href = href;
    iframeDoc.head.appendChild(link);
  });
}

function showTab(tabId) {
  document.getElementById("icons-tab").style.display = (tabId === 'icons-tab') ? 'block' : 'none';
  document.getElementById("preview-tab").style.display = (tabId === 'preview-tab') ? 'block' : 'none';

  document.getElementById("tab-btn-icons").style.background = (tabId === 'icons-tab') ? 'var(--bg)' : 'var(--surface)';
  document.getElementById("tab-btn-preview").style.background = (tabId === 'preview-tab') ? 'var(--bg)' : 'var(--surface)';
}

function renderIcons() {
  const list = document.getElementById("icon-list");
  const query = document.getElementById("icon-search").value.toLowerCase();
  const style = document.getElementById("icon-style").value;
  loadCDN(style);

  list.innerHTML = "";
  ICONS.filter(name => name.includes(query)).forEach(iconName => {
    const el = document.createElement("span");
    el.innerText = iconName;
    el.className = style === "filled" ? "material-icons" : `material-symbols-${style}`;
    el.style.fontSize = "24px";
    el.style.cursor = "pointer";
    el.title = iconName;

    el.onclick = () => {
      document.getElementById("icon-preview").className = el.className;
      document.getElementById("icon-preview").innerText = iconName;
      document.getElementById("preview-name").innerText = iconName;
      showTab("preview-tab");
    };

    list.appendChild(el);
  });
}

// When settings are changed → update preview live
["icon-style", "font-size", "icon-color"].forEach(id => {
  document.getElementById(id).addEventListener("input", updatePreview);
  document.getElementById(id).addEventListener("change", updatePreview);
});

function updatePreview() {
  const style = document.getElementById("icon-style").value;
  const fontSize = document.getElementById("font-size").value + "px";
  const color = document.getElementById("icon-color").value;
  const iconName = document.getElementById("icon-preview").innerText;

  loadCDN(style);
  const preview = document.getElementById("icon-preview");
  preview.className = style === "filled" ? "material-icons" : `material-symbols-${style}`;
  preview.innerText = iconName;
  preview.style.fontSize = fontSize;
  preview.style.color = color;
}

// Insert btn → console output of final HTML
document.getElementById("insert-btn").onclick = () => {
  const style = document.getElementById("icon-style").value;
  const iconName = document.getElementById("icon-preview").innerText;
  const fontSize = document.getElementById("font-size").value + "px";
  const color = document.getElementById("icon-color").value;

  const className = style === "filled" ? "material-icons" : `material-symbols-${style}`;
  const html = `<span class="${className}" style="font-size: ${fontSize}; color: ${color};">${iconName}</span>`;
  iconInsert(html);
  //console.log("✅ Icon HTML:\n", html);
};

document.getElementById("icon-search").addEventListener("input", renderIcons);
window.addEventListener("DOMContentLoaded", renderIcons);

function applyFont(fontName) {
  if (!fontName) return;

  loadGoogleFont(fontName); // Load the font dynamically

  const selected = currentEditingElement;
  if (selected) {
    selected.style.fontFamily = `'${fontName}', sans-serif`;
  }
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

//let deferredPrompt = null;

window.addEventListener("beforeinstallprompt", (e) => {
   e.preventDefault();
   deferredPrompt = e;
   //console.log("PWA install prompt saved");
});

let presetdb;
let pre = [];

let presetrequest = indexedDB.open("WebEdPresetsDB", 1);

presetrequest.onupgradeneeded = function (e) {
   presetdb = e.target.result;

   if (!presetdb.objectStoreNames.contains("presets")) {
      presetdb.createObjectStore("presets", { keyPath: "id", autoIncrement: true });
   }
};

presetrequest.onsuccess = function (e) {
   presetdb = e.target.result;
   loadPresets();
};

presetrequest.onerror = () => console.log("DB Error");


function addPresets(el) {

   if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(res => {
         console.log("User Install:", res.outcome);
      });
      deferredPrompt = null; // reset
   }


   let name = prompt('Name of preset');

   let overlay = el.querySelector('.behOverlay');
   if (overlay) {
      overlay.remove();
   }

   let presetHTML = el.outerHTML;

   let object = { n: name, p: presetHTML };

   pre.push(object);

   let tx = presetdb.transaction("presets", "readwrite");
   let store = tx.objectStore("presets");
   store.add(object);
   tx.oncomplete = () => console.log("Preset saved to IndexedDB");

   renderPresetList();
}

function insertPreset(obj) {
   let canvas = document.getElementById("canvas");
   let doc = canvas.contentDocument || canvas.contentWindow.document;

   // Insert preset HTML
   doc.body.insertAdjacentHTML("beforeend", obj.p);

   alert("Preset inserted inside canvas iframe");
}

function deletePreset(id, index) {
   // 1. Array se delete
   pre.splice(index, 1);

   // 2. IndexedDB se delete
   let tx = presetdb.transaction("presets", "readwrite");
   let store = tx.objectStore("presets");

   store.delete(id);

   tx.oncomplete = () => {
      alert("Preset removed");
      renderPresetList();
   };
}

function renderPresetList() {
   const list = document.getElementById("presetsList");
   list.innerHTML = '';

   pre.forEach((e, index) => {
      let id = "thumb_" + crypto.randomUUID();

      list.innerHTML += `
        <div class="presetCard" style="
            margin: 5px; 
            width: 85%; 
            height: 240px; 
            background: #222; 
            border: 1px solid #444; 
            padding: 5px;
            position: relative;
        ">
           <iframe id="${id}" 
              style="
                 width: 100%; 
                 height: 160px; 
                 border: none; 
                 background: white;
                 pointer-events: none;
                 overflow: hidden;
              ">
           </iframe>

           <p class="presetName" style="color:white; margin-top:5px">${e.n}</p>

           <div style="display:flex; gap:10px; margin-top:8px;">
              <button class="insertBtn" data-index="${index}" 
                 style="flex:1; padding:5px; background:#4CAF50; color:white; border:none; border-radius:5px;">
                 Insert
              </button>

              <button class="delBtn" data-id="${e.id}" data-index="${index}"
                 style="flex:1; padding:5px; background:#E53935; color:white; border:none; border-radius:5px;">
                 Delete
              </button>
           </div>
        </div>
      `;

      // Render iframe thumbnail
      setTimeout(() => {
         let iframe = document.getElementById(id);
         iframe.contentDocument.body.innerHTML = e.p;
      }, 50);
   });

   // Insert button actions
   document.querySelectorAll(".insertBtn").forEach(btn => {
      btn.addEventListener("click", function () {
         let index = this.dataset.index;
         insertPreset(pre[index]);
      });
   });

   // Delete button actions
   document.querySelectorAll(".delBtn").forEach(btn => {
      btn.addEventListener("click", function () {
         let id = Number(this.dataset.id);
         let index = this.dataset.index;
         deletePreset(id, index);
      });
   });
}

function loadPresets() {
   let tx = presetdb.transaction("presets", "readonly");
   let store = tx.objectStore("presets");

   let getReq = store.getAll();

   getReq.onsuccess = () => {
      pre = getReq.result;
      renderPresetList();
   };
}

// icon editor 

  const svg = document.getElementById("iconEditorArea");
  const codeBox = document.getElementById("svgCode");
  const fileInput = document.getElementById("addImgInBackSvg");
  let svgBackImg;

/*fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    svg.style.background = `url(${reader.result}) center center / contain no-repeat`;
    svgBackImg = reader.result;
  };
  reader.readAsDataURL(file);
});
*/
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
document.getElementById("fullScreenBtn").addEventListener("click", function () {
      alert("User touched the screen! full screen mode On.");
      
      // Example: Try fullscreen (only works on user interaction)
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      }
    });
    document.addEventListener("keydown", function(e) {
      if(e.altKey && e.shiftKey && e.key.toLowerCase() === "f"){
        e.preventDefault();
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen();
        }
      }
    });
    
function downloadAsImg() {
   var imgName = prompt('Write image name');
  
     let iframe = document.getElementById("canvas");
  let iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

  html2canvas(iframeDoc.body).then(canvas => {
    const link = document.createElement("a");
    link.download = imgName+".png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
  
}


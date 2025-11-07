//const iframe = document.getElementById("canvas");
// iframe.srcdoc = "<body style='min-height:100vh;'></body>";

let selectedEl = null;
let overlay = null;

/* / ✅ Add Element Function
function addElement(type) {
  const doc = iframe.contentDocument;
  const body = doc.body;

  let el = doc.createElement(type);
  el.textContent = type === "button" ? "Click Me" : New ${type};
  el.classList.add("editable");
  el.style.display = "inline-block";
  el.style.minWidth = "50px";
  el.style.minHeight = "30px";
  el.style.border = "1px solid #ccc";
  el.style.padding = "5px";

  el.addEventListener("click", (e) => {
    e.stopPropagation();
    showOverlay(el);
  });

  body.appendChild(el);
}*/

function clickShowOverlay(){
   const docc = iframe.contentDocument || iframe.contentWindow.document;
   docc.querySelectorAll('.editable').forEach(ell => {
      ell.onclick = () => {overlay = docc.createElement("div"); showOverlay(ell);};
   });
   removeOverlay();
}

// ✅ Overlay Function
function showOverlay(target) {
  removeOverlay();
  selectedEl = target;
  const doc = iframe.contentDocument;  

  if(!overlay) overlay = doc.createElement("div");
  overlay.className = 'behOverlay';
  overlay.style.position = "absolute";
  overlay.style.border = "2px dashed #3F3760";
  overlay.style.pointerEvents = "none"; 
  overlay.style.zIndex = "9999";

  doc.body.appendChild(overlay);

  // Controls container (👇 bottom center)
  const controls = doc.createElement("div");
  controls.style.position = "absolute";
  controls.style.bottom = "-30px";
  controls.style.left = "50%";
  controls.style.transform = "translateX(-50%)";
  controls.style.display = "flex";
  controls.style.gap = "5px";
  overlay.appendChild(controls);

  // ✅ Move Handle (Left)
  const moveBtn = doc.createElement("button");
  moveBtn.innerHTML = dragIcon;
  styleBtn(moveBtn);
  controls.appendChild(moveBtn);

  // ✅ Border Radius Handle (Green Btn Right)
  const radiusBtn = doc.createElement("button");
  radiusBtn.textContent = "◉";
  styleBtn(radiusBtn, "green");
  controls.appendChild(radiusBtn);
  
  const eBtn = doc.createElement("button");
  eBtn.innerHTML = editIcon;
  eBtn.onclick = () => openEdit(target);
  styleBtn(eBtn, "yellow");
  controls.appendChild(eBtn);
  
  const dBtn = doc.createElement("button");
  dBtn.innerHTML = deleteicon;
  dBtn.onclick = () => {
        if (selectedParent === target) {
          selectedParent = document.getElementById('canvas');
          clearSelected();
        }
        target.remove();
        updateTree(); saveHistory(); removeOverlay();
  };
  styleBtn(dBtn, "tomato");
  controls.appendChild(dBtn);
  
  const cpBtn = doc.createElement("button");
  cpBtn.innerHTML = copyIcon;
  cpBtn.onclick = () => {
     let copiedElement = null;
     copiedElement = target.cloneNode(true);
     copiedElement.removeAttribute("id");
     doc.body.appendChild(copiedElement);
     showOverlay(copiedElement);
     copiedElement.onclick = () => {showOverlay(copiedElement);}
  }
  styleBtn(cpBtn, "khaki");
  controls.appendChild(cpBtn);
  
  const Wlabel = doc.createElement("div");
  Wlabel.style.position = "absolute";
  Wlabel.style.top = "25px";
  Wlabel.style.right = "45%";
  Wlabel.style.fontSize = "10px";
  Wlabel.style.color = "white";
  Wlabel.style.background = "purple";
  Wlabel.style.padding = "5px 10px";
  Wlabel.style.borderRadius = "3px";
  controls.appendChild(Wlabel);

  // ✅ Resize Handles (same as before)
  ["nw","ne","sw","se"].forEach(corner => {
    const handle = doc.createElement("div");
    handle.dataset.corner = corner;
    handle.style.width = "10px";
    handle.style.height = "10px";
    handle.style.background = "#3F3760";
    handle.style.border = "2px solid white";
    handle.style.position = "absolute";
    handle.style.pointerEvents = "auto";

    if (corner.includes("n")) handle.style.top = "-5px";
    if (corner.includes("s")) handle.style.bottom = "-5px";
    if (corner.includes("w")) handle.style.left = "-5px";
    if (corner.includes("e")) handle.style.right = "-5px";

    overlay.appendChild(handle);
    behAddDrag(handle, (dx, dy) => {
        const parent = target.offsetParent || target.parentElement;
        const parentWidth = parent.offsetWidth;
        const parentHeight = parent.offsetHeight;

        const startWidth = target.offsetWidth;
        const startHeight = target.offsetHeight;
        const startLeft = target.offsetLeft;
        const startTop = target.offsetTop;

        let newWidth = startWidth + dx;
        let newHeight = startHeight + dy;

        const snapPoints = [.25, .5, .75, 1];
        let snapped = false;

        snapPoints.forEach(sp => {
                if (Math.abs((parentWidth * sp) - newWidth) < 10) {
                        target.style.width = (sp * 100) + "%";
                        showSnapGuide(parentWidth, target, sp);
                        snapped = true;
                }
                if (corner === "se") {
                        //target.style.width = newWidth + "px";
                        target.style.height = newHeight + "px";
                }
                if (corner === "sw") {
                        //target.style.width = (startWidth - dx) + "px";
                        target.style.height = newHeight + "px";
                        target.style.left = (startLeft + dx) + "px";
                }
                if (corner === "ne") {
                        //target.style.width = newWidth + "px";
                        target.style.height = (startHeight - dy) + "px";
                        target.style.top = (startTop + dy) + "px";
                }
                if (corner === "nw") {
                        // target.style.width = (startWidth - dx) + "px";
                        target.style.height = (startHeight - dy) + "px";
                        target.style.left = (startLeft + dx) + "px";
                        target.style.top = (startTop + dy) + "px";
                }
        });

        if (!snapped) {
                if (corner === "se") {
                        target.style.width = newWidth + "px";
                        target.style.height = newHeight + "px";
                }
                if (corner === "sw") {
                        target.style.width = (startWidth - dx) + "px";
                        target.style.height = newHeight + "px";
                        target.style.left = (startLeft + dx) + "px";
                }
                if (corner === "ne") {
                        target.style.width = newWidth + "px";
                        target.style.height = (startHeight - dy) + "px";
                        target.style.top = (startTop + dy) + "px";
                }
                if (corner === "nw") {
                        target.style.width = (startWidth - dx) + "px";
                        target.style.height = (startHeight - dy) + "px";
                        target.style.left = (startLeft + dx) + "px";
                        target.style.top = (startTop + dy) + "px";
                }
                hideSnapGuide();
        }

        Wlabel.textContent = "W "+target.style.width+" × "+" H "+target.style.height;
        updateOverlay();
    });
  });

  // ✅ Move Dragging (fixed)
  behAddDrag(moveBtn, (dx, dy) => {
    const parent = target.offsetParent || target.parentElement;
    const startLeft = target.offsetLeft;
    const startTop = target.offsetTop;

    target.style.position = "absolute";
    target.style.left = startLeft + dx + "px";
    target.style.top = startTop + dy + "px";

    updateOverlay();
  });

  // ✅ Border Radius Dragging
  behAddDrag(radiusBtn, (dx, dy) => {
    let r = parseInt(target.style.borderRadius) || 0;
    r += dx;
    if (r < 0) r = 0;
    target.style.borderRadius = Math.round(r) + "px";
    updateOverlay();
  });
  
  Wlabel.textContent = target.style.width +" × "+ target.style.height;
  updateOverlay();

  doc.addEventListener("click", (e) => {
    //if (!overlay.contains(e.target) && e.target !== target) {
      removeOverlay();
   // }
  }, { once: true });
}

function showClickOver() {
   const doc = iframe.contentDocument || iframe.contentWindow.document;
   const els = doc.body.querySelectorAll('*');
   
   els.forEach(el => {
     el.addEventListener('click', (e) => {
       e.preventDefault();   // link ya button ka default action roke
       e.stopPropagation();  // event bubbling roke
       e.currentTarget.contentEditable=false;
       showOverlay(e.currentTarget);
     });
   });
   els.forEach(el => {
     el.addEventListener('dblclick', (e) => {
       e.preventDefault();
       e.stopPropagation();
       e.currentTarget.contentEditable = true;
       e.currentTarget.focus();
     });
   });
}

// ✅ Helper: Style Button
function styleBtn(btn, color="blue") {
  btn.style.background = "#222";
  btn.style.color = "white";
  btn.style.border = "none";
  btn.style.borderRadius = "4px";
  btn.style.padding = "2px 6px";
  btn.style.cursor = "grab";
  btn.style.pointerEvents = "auto";
}

// ✅ Helper: Drag Support (Mouse + Touch)
function behAddDrag(el, onDrag) {
  let startX, startY;

  function start(e) {
    e.preventDefault();
    startX = e.touches ? e.touches[0].clientX : e.clientX;
    startY = e.touches ? e.touches[0].clientY : e.clientY;
    doc.addEventListener("mousemove", move);
    doc.addEventListener("mouseup", end);
    doc.addEventListener("touchmove", move, { passive: false });
    doc.addEventListener("touchend", end);
  }

  function move(e) {
    e.preventDefault();
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const y = e.touches ? e.touches[0].clientY : e.clientY;
    const dx = x - startX;
    const dy = y - startY;
    startX = x;
    startY = y;
    onDrag(dx, dy);
  }

  function end() {
    doc.removeEventListener("mousemove", move);
    doc.removeEventListener("mouseup", end);
    doc.removeEventListener("touchmove", move);
    doc.removeEventListener("touchend", end);
  }
  const doc = iframe.contentDocument;
  el.addEventListener("mousedown", start);
  el.addEventListener("touchstart", start, { passive: false });
}

function updateOverlay(){
  if (!overlay || !selectedEl) return;

  const rect = selectedEl.getBoundingClientRect();
  overlay.style.position = "absolute";
  overlay.style.top = rect.y+"px";
  overlay.style.left = rect.x+"px";
  overlay.style.width = rect.width - 2 + "px";
  overlay.style.height = rect.height - 2 + "px";
 
}

// ✅ Remove Overlay
function removeOverlay() {
  if (overlay) overlay.remove();
  overlay = null;
  selectedEl = null;
  hideSnapGuide();
}

// snaps guides
let snapLine = null;

function showSnapGuide(parentRect, target, sp) {
  const doc = target.ownerDocument;
  if (!snapLine) {
    snapLine = doc.createElement("div");
    snapLine.style.position = "absolute";
    snapLine.style.top = "0";
    snapLine.style.bottom = "0";
    snapLine.style.width = "1px";
    snapLine.style.background = "purple";
    snapLine.style.zIndex = "9999";

    const label = doc.createElement("div");
    label.textContent = sp * 100 + "%";
    label.style.position = "absolute";
    label.style.top = "10px";
    label.style.right = "-55px";
    label.style.fontSize = "10px";
    label.style.color = "white";
    label.style.background = "purple";
    label.style.padding = "5px 10px";
    label.style.borderRadius = "3px";
    snapLine.appendChild(label);

    overlay.appendChild(snapLine);
  }
  snapLine.style.right = parentRect.right + "px"; // parent right edge
}

function hideSnapGuide() {
  if (snapLine && snapLine.parentNode) {
    snapLine.parentNode.removeChild(snapLine);
    snapLine = null;
  }
}

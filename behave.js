
const iframee = document.getElementById("canvas");
// iframee.srcdoc = "<body style='min-height:100vh;'></body>";

let selectedEl = null;
let overlay = null;

/* / ✅ Add Element Function
function addElement(type) {
  const doc = iframee.contentDocument;
  const body = doc.body;

  let el = doc.createElement(type);
  el.textContent = type === "button" ? "Click Me" : `New ${type}`;
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

// ✅ Overlay Function
function showOverlay(target) {
  removeOverlay();
  selectedEl = target;
  const doc = iframee.contentDocument;

  overlay = doc.createElement("div");
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
  moveBtn.textContent = "⇕";
  styleBtn(moveBtn);
  controls.appendChild(moveBtn);

  // ✅ Border Radius Handle (Green Btn Right)
  const radiusBtn = doc.createElement("button");
  radiusBtn.textContent = "◉";
  styleBtn(radiusBtn, "green");
  controls.appendChild(radiusBtn);
  
  const eBtn = doc.createElement("button");
  eBtn.textContent = "✏️";
  eBtn.onclick = () => openEdit(target);
  styleBtn(eBtn, "yellow");
  controls.appendChild(eBtn);
  
  const dBtn = doc.createElement("button");
  dBtn.textContent = "🗑️";
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
                const rect = target.getBoundingClientRect();
                const parentWidth = target.parentElement.getBoundingClientRect().width;
                const parentHeight = target.parentElement.getBoundingClientRect().height;

                let newWidth = rect.width + dx;
                let newHeight = rect.height + dy;

                const snapPoints = [.25, .5, .75, 1];
                let snapped = false;

                snapPoints.forEach(sp => {
                        if (Math.abs((parentWidth * sp) - newWidth) < 10) {
                                if (sp === .25) target.style.width = "25%";
                                if (sp === .5) target.style.width = "50%";
                                if (sp === .75) target.style.width = "75%";
                                if (sp === 1) target.style.width = "100%";

                                showSnapGuide(parentWidth, target, sp);
                                snapped = true;
                        }
                        if (corner === "se") {
                                target.style.height = Math.round(rect.height + dy) + "px";
                        }
                        if (corner === "sw") {
                                target.style.height = Math.round(rect.height + dy) + "px";
                                target.style.left = Math.round(rect.left + dx) + "px";
                        }
                        if (corner === "ne") {
                                target.style.height = Math.round(rect.height - dy) + "px";
                                target.style.top = Math.round(rect.top + dy) + "px";
                        }
                        if (corner === "nw") {
                                target.style.height = Math.round(rect.height - dy) + "px";
                                target.style.left = Math.round(rect.left + dx) + "px";
                                target.style.top = Math.round(rect.top + dy) + "px";
                        }
                        Wlabel.textContent = target.style.width;
                });

                // agar snap nahi mila to normal resize
                if (!snapped) {
                        if (corner === "se") {
                                target.style.width = Math.round(rect.width + dx) + "px";
                                target.style.height = Math.round(rect.height + dy) + "px";
                        }
                        if (corner === "sw") {
                                target.style.width = Math.round(rect.width - dx) + "px";
                                target.style.height = Math.round(rect.height + dy) + "px";
                                target.style.left = Math.round(rect.left + dx) + "px";
                        }
                        if (corner === "ne") {
                                target.style.width = Math.round(rect.width + dx) + "px";
                                target.style.height = Math.round(rect.height - dy) + "px";
                                target.style.top = Math.round(rect.top + dy) + "px";
                        }
                        if (corner === "nw") {
                                target.style.width = Math.round(rect.width - dx) + "px";
                                target.style.height = Math.round(rect.height - dy) + "px";
                                target.style.left = Math.round(rect.left + dx) + "px";
                                target.style.top = Math.round(rect.top + dy) + "px";
                        }
                        hideSnapGuide();
                }
        updateOverlay();
    });
  });

  // ✅ Move Dragging
  behAddDrag(moveBtn, (dx, dy) => {
    const rect = target.getBoundingClientRect();
    // target.style.position = "absolute";
    target.style.left = Math.round(rect.left + dx) + "px";
    target.style.top = Math.round(rect.top + dy) + "px";
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

  updateOverlay();

  doc.addEventListener("click", (e) => {
    if (!overlay.contains(e.target) && e.target !== target) {
      removeOverlay();
    }
  }, { once: true });
}

// ✅ Helper: Style Button
function styleBtn(btn, color="blue") {
  btn.style.background = color;
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

  const doc = iframee.contentDocument;
  el.addEventListener("mousedown", start);
  el.addEventListener("touchstart", start, { passive: false });
}

// ✅ Overlay Update Position
function updateOverlay() {
  if (!overlay || !selectedEl) return;
  const rect = selectedEl.getBoundingClientRect();
  overlay.style.top = rect.top + "px";
  overlay.style.left = rect.left + "px";
  overlay.style.width = rect.width + "px";
  overlay.style.height = rect.height + "px";
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

    

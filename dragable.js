
// dragable float bar

let isDrag = false;
let offsX, offsY;
let ab = null;

function sd(target, x, y) {
  isDrag = true;
  ab = target;
  const rect = target.getBoundingClientRect();
  offsX = x - rect.left;
  offsY = y - rect.top;
}

function d(x, y) {
  if (!isDrag || !ab) return;
  ab.style.left = `${x - offsX}px`;
  ab.style.top = `${y - offsY}px`;
}

function stopDrag() {
  isDrag = false;
  ab = null;
}
// Attach events to all draggable boxes
document.querySelectorAll('.drag-box').forEach(box => {
  // Touch events
  box.addEventListener("touchstart", e => {
    const touch = e.touches[0];
    sd(box, touch.clientX, touch.clientY);
  });
  box.addEventListener("mousedown", e => {
     sd(box, e.clientX, e.clientY);
  });
});

document.addEventListener("touchmove", e => {
  const touch = e.touches[0];
  d(touch.clientX, touch.clientY);
}, { passive: false });
document.addEventListener("mousemove", e => {
   d(e.clientX, e.clientY);
}, {passive: false});

document.addEventListener("touchend", stopDrag);
document.addEventListener("mouseup", stopDrag);


// dragable script 

let isDragging = false;
let offsetX, offsetY;
let activeBox = null;

function startDrag(target, x, y) {
  activeBox = target.closest('.drag-el');
  if (!activeBox) return;
  isDragging = true;

  const rect = activeBox.getBoundingClientRect();
  offsetX = x - rect.left;
  offsetY = y - rect.top;
}

function drag(x, y) {
  if (!isDragging || !activeBox) return;
  activeBox.style.left = `${x - offsetX}px`;
  activeBox.style.top = `${y - offsetY}px`;
}

function stopDrag() {
  isDragging = false;
  activeBox = null;
}

// Drag handle events
document.querySelectorAll('.drag-handle').forEach(handle => {
  handle.addEventListener("mousedown", e => {
    e.preventDefault();
    startDrag(e.target, e.clientX, e.clientY);
  });

  handle.addEventListener("touchstart", e => {
    const touch = e.touches[0];
    startDrag(e.target, touch.clientX, touch.clientY);
  });
});

// Global drag
document.addEventListener("mousemove", e => drag(e.clientX, e.clientY));
document.addEventListener("mouseup", stopDrag);

document.addEventListener("touchmove", e => {
  const touch = e.touches[0];
  drag(touch.clientX, touch.clientY);
}, { passive: false });

document.addEventListener("touchend", stopDrag);

// dragable script end

// dragabel float bar

let isDrag = false;
let offsX, offsY;
let activeBox2 = null;

function startDrag2(target, x, y) {
  isDrag = true;
  activeBox2 = target;
  const rect = target.getBoundingClientRect();
  offsX = x - rect.left;
  offsY = y - rect.top;
}

function drag2(x, y) {
  if (!isDrag || !activeBox2) return;
  activeBox2.style.left = `${x - offsX}px`;
  activeBox2.style.top = `${y - offsY}px`;
}

function stopDrag2() {
  isDrag = false;
  activeBox2 = null;
}

// Attach events to all draggable boxes
document.querySelectorAll('.drag-box').forEach(box => {
  // Mouse events
  box.addEventListener("mousedown", e => {
    e.preventDefault();
    startDrag2(box, e.clientX, e.clientY);
  });

  // Touch events
  box.addEventListener("touchstart", e => {
    const touch = e.touches[0];
    startDrag2(box, touch.clientX, touch.clientY);
  });
});

// Global mouse/touch move and end
document.addEventListener("mousemove", e => drag2(e.clientX, e.clientY));
document.addEventListener("mouseup", stopDrag2);

document.addEventListener("touchmove", e => {
  const touch = e.touches[0];
  drag2(touch.clientX, touch.clientY);
}, { passive: false });

document.addEventListener("touchend", stopDrag2);

// dragable script 

let isDragging = false;
let offsetX, offsetY;
let activeBox = null;

function startDrag2(target, x, y) {
  activeBox = target.closest('.drag-el');
  if (!activeBox) return;
  isDragging = true;

  const rect = activeBox.getBoundingClientRect();
  offsetX = x - rect.left;
  offsetY = y - rect.top;
}

function drag2(x, y) {
  if (!isDragging || !activeBox) return;
  activeBox.style.left = `${x - offsetX}px`;
  activeBox.style.top = `${y - offsetY}px`;
}

function stopDrag2() {
  isDragging = false;
  activeBox = null;
}

// Drag handle events
document.querySelectorAll('.drag-handle').forEach(handle => {
  handle.addEventListener("mousedown", e => {
    e.preventDefault();
    startDrag2(e.target, e.clientX, e.clientY);
  });

  handle.addEventListener("touchstart", e => {
    const touch = e.touches[0];
    startDrag2(e.target, touch.clientX, touch.clientY);
  });
});

// Global drag
document.addEventListener("mousemove", e => drag2(e.clientX, e.clientY));
document.addEventListener("mouseup", stopDrag2);

document.addEventListener("touchmove", e => {
  const touch = e.touches[0];
  drag2(touch.clientX, touch.clientY);
}, { passive: false });

document.addEventListener("touchend", stopDrag2);

// dragable script end

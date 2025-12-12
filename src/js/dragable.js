// ✅ Float bar drag
let isFloatDragging = false;
let floatOffsetX, floatOffsetY;
let floatTarget = null;

function startFloatDrag(target, x, y) {
  isFloatDragging = true;
  floatTarget = target;
  const rect = target.getBoundingClientRect();
  floatOffsetX = x - rect.left;
  floatOffsetY = y - rect.top;
}

function dragFloat(x, y) {
  if (!isFloatDragging || !floatTarget) return;
  floatTarget.style.left = `${x - floatOffsetX}px`;
  floatTarget.style.top = `${y - floatOffsetY}px`;
}

function stopFloatDrag() {
  isFloatDragging = false;
  floatTarget = null;
}

// Apply to float bars
document.querySelectorAll('.drag-box').forEach(box => {
  box.addEventListener("mousedown", e => {
    e.preventDefault();
    startFloatDrag(box, e.clientX, e.clientY);
  });

  box.addEventListener("touchstart", e => {
    const touch = e.touches[0];
    startFloatDrag(box, touch.clientX, touch.clientY);
  });
});

document.addEventListener("mousemove", e => dragFloat(e.clientX, e.clientY));
document.addEventListener("mouseup", stopFloatDrag);
document.addEventListener("touchmove", e => {
  dragFloat(e.touches[0].clientX, e.touches[0].clientY);
}, { passive: false });
document.addEventListener("touchend", stopFloatDrag);

// ✅ Drag Handle system
let isHandleDragging = false;
let offsetX, offsetY;
let activeBox = null;

function startHandleDrag(target, x, y) {
  activeBox = target.closest('.drag-el');
  if (!activeBox) return;
  isHandleDragging = true;

  const rect = activeBox.getBoundingClientRect();
  offsetX = x - rect.left;
  offsetY = y - rect.top;
}

function dragHandle(x, y) {
  if (!isHandleDragging || !activeBox) return;
  activeBox.style.left = `${x - offsetX}px`;
  activeBox.style.top = `${y - offsetY}px`;
}

function stopHandleDrag() {
  isHandleDragging = false;
  activeBox = null;
}

document.querySelectorAll('.drag-handle').forEach(handle => {
  handle.addEventListener("mousedown", e => {
    e.preventDefault();
    startHandleDrag(e.target, e.clientX, e.clientY);
  });

  handle.addEventListener("touchstart", e => {
    const touch = e.touches[0];
    startHandleDrag(e.target, touch.clientX, touch.clientY);
  });
});

document.addEventListener("mousemove", e => dragHandle(e.clientX, e.clientY));
document.addEventListener("mouseup", stopHandleDrag);
document.addEventListener("touchmove", e => {
  dragHandle(e.touches[0].clientX, e.touches[0].clientY);
}, { passive: false });
document.addEventListener("touchend", stopHandleDrag);


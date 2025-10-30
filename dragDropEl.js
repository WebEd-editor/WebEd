function scriptDragDropElFun(){
   const doc = iframe.contentDocument || iframe.contentWindow.document;
   let scriptDragDropEl = document.createElement('script');
   scriptDragDropEl.id = 'scriptDragDropEl';
   scriptDragDropEl.textContent = `(${enableDragAndNest.toString()})(window.frameElement);`;
   doc.body.appendChild(scriptDragDropEl);
}
scriptDragDropElFun();

function enableDragAndNest(iframe) {
  const doc = iframe.contentDocument || iframe.contentWindow.document;

  // Restriction rules (what CANNOT contain what)
  const restrictRules = {
    //BODY: ['*'],
    DIV: ['P'],
    IMG: ['*'],
  };

  // Helper: check if nesting is valid
  function isValidNest(dragEl, dropEl) {
    if (!dragEl || !dropEl) return false;
    if (dropEl.contains(dragEl)) return false;

    const dragTag = dragEl.tagName;
    const dropTag = dropEl.tagName;

    // ❌ Can't drag the BODY itself
    if (dragTag === 'BODY') return false;
    // ✅ Allow drop on BODY
    if (dropTag === 'HTML') return false;

    if (restrictRules[dropTag]?.includes('*')) return false;

    const restrictedForDrag = restrictRules[dragTag];
    if (restrictedForDrag && restrictedForDrag.includes(dropTag)) return false;

    return true;
  }

  // Helper: find nearest valid ancestor for drop
  function findValidAncestor(dragEl, targetEl) {
    let el = targetEl;
    while (el && el.tagName !== 'HTML') {
      if (isValidNest(dragEl, el)) return el;
      el = el.parentElement;
    }
    return null;
  }

  doc.querySelectorAll('.editable').forEach(el => {
    el.setAttribute('draggable', true);

    el.addEventListener('dragstart', e => {
      e.stopPropagation();
      el.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
    });

    el.addEventListener('dragover', e => {
      e.preventDefault();
      e.stopPropagation();
      const draggingEl = doc.querySelector('.dragging');
      const validDrop = findValidAncestor(draggingEl, el);
      draggingEl.style.outline='2px dashed #2c60af';
      doc.querySelectorAll('.drop-target').forEach(x => x.classList.remove('drop-target'));
      if (validDrop) validDrop.classList.add('drop-target'); validDrop.style.outline='2px dashed #1daf2e';
    });

    el.addEventListener('dragleave', e => {
      e.stopPropagation();
      el.classList.remove('drop-target');
      el.style.outline='';
    });

    el.addEventListener('drop', e => {
      e.preventDefault();
      e.stopPropagation();
      const draggingEl = doc.querySelector('.dragging');
      const validDrop = findValidAncestor(draggingEl, el);

      if (validDrop && isValidNest(draggingEl, validDrop)) {
        validDrop.appendChild(draggingEl);
        validDrop.style.outline='';
      }

      doc.querySelectorAll('.drop-target').forEach(x => x.classList.remove('drop-target'));
      draggingEl?.classList.remove('dragging');
    });

    el.addEventListener('dragend', e => {
      e.stopPropagation();
      el.classList.remove('dragging');
      el.style.outline='';
      doc.querySelectorAll('.drop-target').forEach(x => {
         x.classList.remove('drop-target');
      });
    });
  });
}

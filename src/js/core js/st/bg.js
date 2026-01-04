    const layersContainer = document.getElementById("layers");
    const addLayerBtn = document.getElementById("addLayer");
    const removeAllBtn = document.getElementById("removeAll");

    let layers = [];
    
    function editBackgroundForElement(el) {
      currentEditingElement = el;
      currentEditingElement.style.backgroundBlendMode= 'screen';
      loadBackgroundFromElement(el);
    }
    
    /* ---------- Helper utilities (robust) ---------- */

    // Split by top-level commas (ignores commas inside parentheses)
    function splitTopLevel(str) {
      const parts = [];
      let depth = 0;
      let start = 0;
      for (let i = 0; i < str.length; i++) {
        const ch = str[i];
        if (ch === '(') depth++;
        else if (ch === ')') depth = Math.max(0, depth - 1);
        else if (ch === ',' && depth === 0) {
          parts.push(str.slice(start, i).trim());
          start = i + 1;
        }
      }
      parts.push(str.slice(start).trim());
      return parts.filter(Boolean);
    }

    // Parse 'to right' / '90deg' / '1turn' / '0.5rad' -> degrees
    function parseGradientAngle(token) {
      if (!token) return 180;
      token = token.trim().toLowerCase();
      if (token.endsWith('deg')) return parseFloat(token);
      if (token.endsWith('turn')) return parseFloat(token) * 360;
      if (token.endsWith('rad')) return parseFloat(token) * (180 / Math.PI);
      const directions = {
        'to top': 0,
        'to right': 90,
        'to bottom': 180,
        'to left': 270,
        'to top right': 45,
        'to right top': 45,
        'to bottom right': 135,
        'to right bottom': 135,
        'to bottom left': 225,
        'to left bottom': 225,
        'to top left': 315,
        'to left top': 315
      };
      return directions[token] ?? 180;
    }

    // Parse a color-stop token like:
    // "rgba(0,0,0,0.5) 30%", "#fff 10%", "red", "blue 0px"
    function parseColorStop(token) {
      token = (token || '').trim();
      if (!token) return { color: '#000', pos: null };

      // If starts with function-like color e.g., rgb( / rgba( / hsl(
      if (/^[a-zA-Z]+\(/.test(token)) {
        // capture function upto its matching ')'
        let depth = 0;
        let i = 0;
        for (; i < token.length; i++) {
          const ch = token[i];
          if (ch === '(') depth++;
          else if (ch === ')') {
            depth--;
            if (depth === 0) { i++; break; }
          }
        }
        const color = token.slice(0, i).trim();
        const rest = token.slice(i).trim();
        const pos = rest ? rest : null;
        return { color, pos };
      }

      // otherwise first token is color (#hex or name), rest optional pos
      const parts = token.split(/\s+/);
      const color = parts[0];
      const pos = parts.slice(1).join(' ') || null;
      return { color, pos };
    }

    // Normalize color for <input type="color"> (returns hex if possible, else fallback)
    function colorToInputValue(color) {
      if (!color) return '#000000';
      color = color.trim();
      if (color.startsWith('#')) {
        // ensure 6-char hex
        if (color.length === 4) {
          // expand #abc -> #aabbcc
          return '#' + color.slice(1).split('').map(c => c + c).join('');
        }
        return color;
      }
      const m = color.match(/rgba?\(([^)]+)\)/i);
      if (m) {
        const nums = m[1].split(',').map(s => s.trim());
        const r = parseInt(nums[0] || 0);
        const g = parseInt(nums[1] || 0);
        const b = parseInt(nums[2] || 0);
        const a = nums[3] !== undefined ? parseFloat(nums[3]) : 1;
        if (isNaN(r) || isNaN(g) || isNaN(b)) return '#000000';
        // if alpha < 1, we still return opaque rgb hex (alpha lost in input color)
        return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
      }
      // unknown color name — input can't accept names reliably; fallback
      return '#000000';
    }

    // Keep raw string of rgb/rgba for layers if not convertible to hex
    function rgbStringToHexIfPossible(rgbStr) {
      const m = rgbStr && rgbStr.match(/rgba?\(([^)]+)\)/i);
      if (!m) return rgbStr;
      const parts = m[1].split(',').map(s => s.trim());
      const r = parseInt(parts[0] || 0), g = parseInt(parts[1] || 0), b = parseInt(parts[2] || 0);
      const a = parts[3] !== undefined ? parseFloat(parts[3]) : 1;
      if (isNaN(r) || isNaN(g) || isNaN(b)) return rgbStr;
      if (a !== 1) return rgbStr; // preserve rgba if alpha != 1
      return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
    }

    /* ---------- Robust loader (replaces old loadBackgroundFromElement) ---------- */

    function loadBackgroundFromElement(el) {
      const style = getComputedStyle(el);
      const bg = style.backgroundImage;
      const bgColor = style.backgroundColor;
      layers = [];

      // 1) Pure background-color (no background-image)
      if ((!bg || bg === 'none') && bgColor && bgColor !== 'rgba(0, 0, 0, 0)') {
        const col = rgbStringToHexIfPossible(bgColor);
        layers.push({ type: 'color', value: col });
        renderLayers();
        return;
      }

      // 2) background-image can contain multiple top-level layers
      if (bg && bg !== 'none') {
        const parts = splitTopLevel(bg);
        parts.forEach(part => {
          part = part.trim();

          // linear gradient
          if (/^linear-gradient/i.test(part)) {
            const inner = part.slice(part.indexOf('(') + 1, part.lastIndexOf(')'));
            const args = splitTopLevel(inner);
            let angle = 180;
            // check if first arg is angle/direction
            if (args.length && (/deg$/.test(args[0]) || /turn$/.test(args[0]) || /rad$/.test(args[0]) || /^to\s+/i.test(args[0]))) {
              angle = parseGradientAngle(args[0]);
              args.shift();
            }
            const stops = args.map(a => {
              const p = parseColorStop(a);
              return { color: p.color, pos: p.pos }; // store pos if present
            });
            layers.push({ type: 'gradient', gradientType: 'linear', angle, stops });
            return;
          }

          // radial gradient
          if (/^radial-gradient/i.test(part)) {
            const inner = part.slice(part.indexOf('(') + 1, part.lastIndexOf(')'));
            const args = splitTopLevel(inner);
            let shape = 'circle';
            let position = 'center';

            // if first arg contains shape or 'at'
            if (args.length) {
              const first = args[0].toLowerCase();
              if (first.includes('circle') || first.includes('ellipse') || first.includes('closest') || first.includes('farthest') || first.includes('at')) {
                // check for "at"
                const atIdx = first.indexOf('at');
                if (atIdx !== -1) {
                  const before = first.slice(0, atIdx).trim();
                  const after = first.slice(atIdx + 2).trim();
                  if (before) shape = before.includes('ellipse') ? 'ellipse' : 'circle';
                  if (after) position = after;
                } else {
                  shape = first.includes('ellipse') ? 'ellipse' : 'circle';
                }
                args.shift();
              }
            }

            const stops = args.map(a => {
              const p = parseColorStop(a);
              return { color: p.color, pos: p.pos };
            });

            layers.push({ type: 'gradient', gradientType: 'radial', shape, position, stops });
            return;
          }

          // url(image)
          if (/^url\(/i.test(part)) {
            const m = part.match(/url\(["']?([^"')]+)["']?\)/i);
            const url = m ? m[1] : '';
            layers.push({ type: 'image', value: url, size: 'cover', position: 'center', repeat: 'no-repeat' });
            return;
          }

          // fallback: treat as color
          const fallbackColor = parseColorStop(part).color;
          layers.push({ type: 'color', value: fallbackColor });
        });
      }

      renderLayers();
    }

    /* ---------- Update function (replaces old updateBackground) ---------- */

    function updateBackground() {
      if (!currentEditingElement) return;
      if (!layers || layers.length === 0) {
        let v = document.getElementById('respMode').value;
        if (v === "1024" || v === "768" || v === "320" || v === "hv") {
          respStyle(document.getElementById('respMode').value);
          return;
        }  
        if (v === "default"){currentEditingElement.style.background = '';}
        return;
      }

      const bgList = layers.map(layer => {
        if (layer.type === 'color') return layer.value;
        if (layer.type === 'gradient') {
          // preserve original positions if loaded (s.pos), otherwise omit
          const stopsStr = layer.stops.map(s => {
            return s.pos ? `${s.color} ${s.pos}` : s.color;
          }).join(', ');
          if (layer.gradientType === 'linear') {
            return `linear-gradient(${layer.angle}deg, ${stopsStr})`;
          } else {
            return `radial-gradient(${layer.shape} at ${layer.position}, ${stopsStr})`;
          }
        }
        if (layer.type === 'image') {
          // prefer full background shorthand with position/size/repeat
          return `url("${layer.value}")`;
        }
        return '';
      }).filter(Boolean);

      let v = document.getElementById('respMode').value;
      if (v === "1024" || v === "768" || v === "320" || v === "hv") {
        respStyle(document.getElementById('respMode').value, bgList.join(', '));
        return;
      }   
      if (v === "default"){ currentEditingElement.style.background = bgList.join(', ');}
    }

    /* ---------- UI: color-stop UI without percent input (we keep parsed pos if present) ---------- */

    function createColorStopUI(layer, stop, index) {
      const div = document.createElement('div');
      div.className = 'color-stop';

      const colorInput = document.createElement('input');
      colorInput.type = 'color';
      colorInput.value = colorToInputValue(stop.color);
      colorInput.addEventListener('input', () => {
        // update color text value (keep original color function if possible)
        stop.color = colorInput.value;
        updateBackground();
      });

      const removeBtn = document.createElement('button');
      removeBtn.textContent = 'X';
      removeBtn.style.background = '#e91e63';
      removeBtn.addEventListener('click', () => {
        layer.stops.splice(index, 1);
        renderLayers();
      });

      div.appendChild(colorInput);
      div.appendChild(removeBtn);
      return div;
    }

    /* ---------- UI: gradient controls (replaces previous createGradientControls) ---------- */

    function createGradientControls(layer) {
      const wrapper = document.createElement('div');
      wrapper.className = 'gradient-controls';

      const typeSelect = document.createElement('select');
      ['linear', 'radial'].forEach(opt => {
        const o = document.createElement('option');
        o.value = opt;
        o.textContent = opt;
        if (opt === layer.gradientType) o.selected = true;
        typeSelect.appendChild(o);
      });
      typeSelect.addEventListener('change', () => {
        layer.gradientType = typeSelect.value;
        renderLayers();
      });
      wrapper.appendChild(document.createTextNode('Type: '));
      wrapper.appendChild(typeSelect);

      if (layer.gradientType === 'linear') {
        const angleInput = document.createElement('input');
        angleInput.type = 'number';
        angleInput.min = 0;
        angleInput.max = 360;
        angleInput.value = layer.angle ?? 180;
        angleInput.addEventListener('input', () => {
          layer.angle = Number(angleInput.value) || 180;
          updateBackground();
        });
        wrapper.appendChild(document.createElement('br'));
        wrapper.appendChild(document.createTextNode('Angle: '));
        wrapper.appendChild(angleInput);
        wrapper.appendChild(document.createTextNode('°'));
      } else {
        // radial: show shape and position fields
        const shapeSelect = document.createElement('select');
        ['circle', 'ellipse'].forEach(s => {
          const o = document.createElement('option');
          o.value = s;
          o.textContent = s;
          if (s === layer.shape) o.selected = true;
          shapeSelect.appendChild(o);
        });
        shapeSelect.addEventListener('change', () => {
          layer.shape = shapeSelect.value;
          updateBackground();
        });

        const posInput = document.createElement('input');
        posInput.type = 'text';
        posInput.value = layer.position || 'center';
        posInput.placeholder = 'center / top left';
        posInput.addEventListener('input', () => {
          layer.position = posInput.value;
          updateBackground();
        });

        wrapper.appendChild(document.createElement('br'));
        wrapper.appendChild(document.createTextNode('Shape: '));
        wrapper.appendChild(shapeSelect);
        wrapper.appendChild(document.createElement('br'));
        wrapper.appendChild(document.createTextNode('Position: '));
        wrapper.appendChild(posInput);
      }

      // stops area (no pos input in UI)
      const stopsContainer = document.createElement('div');
      layer.stops.forEach((stop, i) => {
        stopsContainer.appendChild(createColorStopUI(layer, stop, i));
      });

      const addStopBtn = document.createElement('button');
      addStopBtn.textContent = '+ Add Color';
      addStopBtn.style.background = '#4caf50';
      addStopBtn.addEventListener('click', () => {
        layer.stops.push({ color: '#ffffff', pos: null });
        renderLayers();
      });

      wrapper.appendChild(document.createElement('br'));
      wrapper.appendChild(stopsContainer);
      wrapper.appendChild(addStopBtn);
      return wrapper;
    }

    /* ---------- Image controls (kept) ---------- */

    function createImageControls(layer) {
      const wrapper = document.createElement("div");
      wrapper.className = "image-controls";

      const urlInput = document.createElement("input");
      urlInput.type = "text";
      urlInput.value = layer.value;
      urlInput.placeholder = "Image URL";
      urlInput.style.width = "95%";
      urlInput.addEventListener("input", () => {
        layer.value = urlInput.value;
        updateBackground();
      });

      const sizeInput = document.createElement("input");
      sizeInput.type = "text";
      sizeInput.value = layer.size;
      sizeInput.placeholder = "cover / contain / 100px";
      sizeInput.addEventListener("input", () => {
        layer.size = sizeInput.value;
        updateBackground();
      });

      const posInput = document.createElement("input");
      posInput.type = "text";
      posInput.value = layer.position;
      posInput.placeholder = "center / top left";
      posInput.addEventListener("input", () => {
        layer.position = posInput.value;
        updateBackground();
      });

      const repeatSelect = document.createElement("select");
      ["no-repeat", "repeat", "repeat-x", "repeat-y"].forEach(opt => {
        const option = document.createElement("option");
        option.value = opt;
        option.textContent = opt;
        if (opt === layer.repeat) option.selected = true;
        repeatSelect.appendChild(option);
      });
      repeatSelect.addEventListener("change", () => {
        layer.repeat = repeatSelect.value;
        updateBackground();
      });

      wrapper.appendChild(document.createTextNode("URL:"));
      wrapper.appendChild(document.createElement("br"));
      wrapper.appendChild(urlInput);
      wrapper.appendChild(document.createElement("br"));
      wrapper.appendChild(document.createTextNode("Size: "));
      wrapper.appendChild(sizeInput);
      wrapper.appendChild(document.createElement("br"));
      wrapper.appendChild(document.createTextNode("Position: "));
      wrapper.appendChild(posInput);
      wrapper.appendChild(document.createElement("br"));
      wrapper.appendChild(document.createTextNode("Repeat: "));
      wrapper.appendChild(repeatSelect);
      return wrapper;
    }

    /* ---------- Create layer UI & render ---------- */

    function createLayerUI(layer, index) {
      const div = document.createElement("div");
      div.className = "layer";

      const select = document.createElement("select");
      ["color", "gradient", "image"].forEach(opt => {
        const option = document.createElement("option");
        option.value = opt;
        option.textContent = opt;
        if (opt === layer.type) option.selected = true;
        select.appendChild(option);
      });

      select.addEventListener("change", () => {
        const t = select.value;
        if (t === "color") layers[index] = { type: "color", value: "#ffffff" };
        if (t === "gradient") layers[index] = { type: "gradient", gradientType: "linear", angle: 180, stops: [{ color: "#ff0000", pos: null }, { color: "#0000ff", pos: null }] };
        if (t === "image") layers[index] = { type: "image", value: "", size: "cover", position: "center", repeat: "no-repeat" };
        renderLayers();
      });

      const removeBtn = document.createElement("button");
      removeBtn.textContent = "Remove";
      removeBtn.addEventListener("click", () => {
        layers.splice(index, 1);
        renderLayers();
      });

      div.appendChild(select);

      if (layer.type === "gradient") {
        div.appendChild(createGradientControls(layer));
      } else if (layer.type === "image") {
        div.appendChild(createImageControls(layer));
      } else {
        const colorInput = document.createElement("input");
        colorInput.type = "color";
        colorInput.value = colorToInputValue(layer.value || '#ffffff');
        colorInput.addEventListener("input", () => {
          layer.value = colorInput.value;
          updateBackground();
        });
        div.appendChild(colorInput);
      }

      div.appendChild(removeBtn);
      return div;
    }

    function renderLayers() {
      layersContainer.innerHTML = "";
      layers.forEach((layer, index) => {
        layersContainer.appendChild(createLayerUI(layer, index));
      });
      updateBackground();
    }

    // ---------- Buttons ----------
    addLayerBtn.addEventListener("click", () => {
      layers.push({ type: "color", value: "#ffffff" });
      renderLayers();
    });

    removeAllBtn.addEventListener("click", () => {
      layers = [];
      updateBackground();
      renderLayers();
    });

    // Initialize: nothing selected
    renderLayers();
    

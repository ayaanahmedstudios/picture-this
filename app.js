(() => {
  'use strict';

  // --- Parameter Definitions ---
  const SLIDER_GROUPS = {
    light: [
      { key: 'exposure', label: 'Exposure', min: -100, max: 100, def: 0 },
      { key: 'brightness', label: 'Brightness', min: -100, max: 100, def: 0 },
      { key: 'contrast', label: 'Contrast', min: -100, max: 100, def: 0 },
      { key: 'highlights', label: 'Highlights', min: -100, max: 100, def: 0 },
      { key: 'shadows', label: 'Shadows', min: -100, max: 100, def: 0 },
      { key: 'whites', label: 'Whites', min: -100, max: 100, def: 0 },
      { key: 'blacks', label: 'Blacks', min: -100, max: 100, def: 0 }
    ],
    color: [
      { key: 'temp', label: 'Temperature', min: -100, max: 100, def: 0 },
      { key: 'tint', label: 'Tint', min: -100, max: 100, def: 0 },
      { key: 'vibrance', label: 'Vibrance', min: -100, max: 100, def: 0 },
      { key: 'saturation', label: 'Saturation', min: -100, max: 100, def: 0 }
    ],
    effects: [
      { key: 'clarity', label: 'Clarity', min: -100, max: 100, def: 0 },
      { key: 'vignette', label: 'Vignette', min: -100, max: 100, def: 0 },
      { key: 'grain', label: 'Grain', min: 0, max: 100, def: 0 }
    ]
  };

  const MASK_SLIDERS = [
    { key: 'exposure', label: 'Exposure', min: -100, max: 100, def: 0 },
    { key: 'brightness', label: 'Brightness', min: -100, max: 100, def: 0 },
    { key: 'contrast', label: 'Contrast', min: -100, max: 100, def: 0 },
    { key: 'temp', label: 'Temperature', min: -100, max: 100, def: 0 },
    { key: 'saturation', label: 'Saturation', min: -100, max: 100, def: 0 }
  ];

  const BUILTIN_PRESETS = [
    { name: 'Neutral', values: {} },
    { name: 'Warm Film', values: { exposure: 6, contrast: 12, highlights: -18, shadows: 16, temp: 22, vibrance: 14, grain: 18 } },
    { name: 'Crisp Daylight', values: { exposure: 4, contrast: 18, highlights: -12, whites: 15, blacks: -10, clarity: 20, vibrance: 12 } },
    { name: 'Soft Matte', values: { contrast: -18, highlights: -24, shadows: 28, blacks: 32, saturation: -12, vignette: -15 } },
    { name: 'High Contrast B&W', values: { contrast: 38, highlights: -15, whites: 22, blacks: -28, saturation: -100, clarity: 28, grain: 22 } },
    { name: 'Silver Gelatin', values: { exposure: 5, contrast: 16, highlights: -20, shadows: 12, saturation: -100, temp: 8, vignette: -22 } },
    { name: 'Moody Teal', values: { exposure: -8, contrast: 20, highlights: -30, shadows: -10, temp: -24, tint: -10, saturation: -16, vignette: -28 } },
    { name: 'Portra 400', values: { exposure: 8, contrast: 8, highlights: -16, shadows: 20, temp: 16, tint: 6, vibrance: 18, grain: 12 } }
  ];

  // --- Application State ---
  const state = {
    photos: [],
    currentIndex: -1,
    activeMode: 'adjust',
    clipboard: null,
    compareHold: false,
    splitWipe: false,
    splitPos: 0.5,
    sectionBypass: { light: false, color: false, effects: false },
    showMaskOverlay: false,
    brushMode: 'paint',
    brushSize: 60,
    exportFormat: 'image/webp',
    userPresets: JSON.parse(localStorage.getItem('pt_user_presets') || '[]'),
    interaction: null
  };

  function createDefaultEdits() {
    return {
      exposure: 0, brightness: 0, contrast: 0, highlights: 0, shadows: 0, whites: 0, blacks: 0,
      temp: 0, tint: 0, vibrance: 0, saturation: 0,
      clarity: 0, vignette: 0, grain: 0,
      crop: { x: 0, y: 0, w: 1, h: 1, ratio: 'free' },
      rotateFine: 0,
      rotateStep: 0,
      flipH: false,
      flipV: false,
      masks: [],
      selectedMaskId: null
    };
  }

  function cloneEdits(edits) {
    return JSON.parse(JSON.stringify({
      ...edits,
      masks: edits.masks.map(m => ({
        ...m,
        strokes: m.strokes ? m.strokes.map(s => ({ ...s, points: s.points.map(p => ({ ...p })) })) : []
      }))
    }));
  }

  function isModified(edits) {
    const def = createDefaultEdits();
    for (const group of Object.values(SLIDER_GROUPS)) {
      for (const s of group) {
        if (edits[s.key] !== def[s.key]) return true;
      }
    }
    if (edits.rotateFine !== 0 || edits.rotateStep !== 0 || edits.flipH || edits.flipV) return true;
    if (edits.crop.x > 0.001 || edits.crop.y > 0.001 || edits.crop.w < 0.999 || edits.crop.h < 0.999) return true;
    if (edits.masks.length > 0) return true;
    return false;
  }

  // --- DOM Elements ---
  const el = {
    fileInput: document.getElementById('file-input'),
    folderInput: document.getElementById('folder-input'),
    dropOverlay: document.getElementById('drop-overlay'),
    homeScreen: document.getElementById('home-screen'),
    workspace: document.getElementById('workspace'),
    glCanvas: document.getElementById('gl-canvas'),
    overlayCanvas: document.getElementById('overlay-canvas'),
    canvasStage: document.getElementById('canvas-stage'),
    canvasWrap: document.getElementById('canvas-wrap'),
    photoCounter: document.getElementById('photo-counter'),
    fileMeta: document.getElementById('file-meta'),
    filmstripWrap: document.getElementById('filmstrip-wrap'),
    filmstrip: document.getElementById('filmstrip'),
    inspector: document.getElementById('inspector'),
    statusMsg: document.getElementById('status-msg'),
    btnUndo: document.getElementById('btn-undo'),
    btnRedo: document.getElementById('btn-redo'),
    btnPaste: document.getElementById('btn-paste'),
    maskList: document.getElementById('mask-list'),
    maskControlsWrap: document.getElementById('mask-controls-wrap'),
    brushControls: document.getElementById('brush-controls'),
    chkMaskOverlay: document.getElementById('chk-mask-overlay'),
    chkMaskInvert: document.getElementById('chk-mask-invert'),
    exportModal: document.getElementById('export-modal')
  };

  // --- Home Screen Anime.js Entrance ---
  function runHomeAnimation() {
    if (!window.anime) return;
    const strokes = document.querySelectorAll('.home-mark .anim-stroke');
    strokes.forEach(path => {
      const len = path.getTotalLength ? path.getTotalLength() : 300;
      path.style.strokeDasharray = len;
      path.style.strokeDashoffset = len;
    });

    const tl = window.anime.timeline({ easing: 'easeOutQuart' });
    tl.add({
      targets: '.home-mark .anim-stroke',
      strokeDashoffset: [window.anime.setDashoffset, 0],
      duration: 950,
      delay: window.anime.stagger(90)
    })
    .add({
      targets: ['.home-title', '.home-subtitle', '.home-actions', '.btn-text'],
      opacity: [0, 1],
      translateY: [10, 0],
      duration: 600,
      delay: window.anime.stagger(80)
    }, '-=500');
  }

  // --- Status Helper ---
  let statusTimer = null;
  function showStatus(msg) {
    el.statusMsg.textContent = msg;
    clearTimeout(statusTimer);
    statusTimer = setTimeout(() => {
      el.statusMsg.textContent = '';
    }, 2600);
  }

  // --- Build Inspector Sliders ---
  function buildSliders() {
    Object.entries(SLIDER_GROUPS).forEach(([groupKey, sliders]) => {
      const container = document.getElementById(`sliders-${groupKey}`);
      container.innerHTML = '';
      sliders.forEach(s => {
        const row = document.createElement('div');
        row.className = 'slider-row';
        row.innerHTML = `
          <div class="slider-header">
            <span class="slider-label" data-reset="${s.key}" title="Double-click to reset">${s.label}</span>
            <span class="slider-val" id="val-${s.key}">0</span>
          </div>
          <input type="range" class="studio-range" id="slider-${s.key}" data-key="${s.key}" min="${s.min}" max="${s.max}" step="1" value="${s.def}" />
        `;
        container.appendChild(row);

        const input = row.querySelector('input');
        const label = row.querySelector('.slider-label');

        input.addEventListener('input', () => {
          const photo = getCurrentPhoto();
          if (!photo) return;
          photo.edits[s.key] = Number(input.value);
          updateSliderUI(photo.edits);
          requestRender();
        });

        input.addEventListener('change', () => pushHistory());

        const resetFn = () => {
          const photo = getCurrentPhoto();
          if (!photo) return;
          photo.edits[s.key] = s.def;
          pushHistory();
          updateSliderUI(photo.edits);
          requestRender();
        };
        input.addEventListener('dblclick', resetFn);
        label.addEventListener('dblclick', resetFn);
      });
    });

    // Mask Sliders
    const maskContainer = document.getElementById('sliders-mask');
    maskContainer.innerHTML = '';
    MASK_SLIDERS.forEach(s => {
      const row = document.createElement('div');
      row.className = 'slider-row';
      row.innerHTML = `
        <div class="slider-header">
          <span class="slider-label" data-mreset="${s.key}">${s.label}</span>
          <span class="slider-val" id="mval-${s.key}">0</span>
        </div>
        <input type="range" class="studio-range" id="mslider-${s.key}" data-mkey="${s.key}" min="${s.min}" max="${s.max}" step="1" value="0" />
      `;
      maskContainer.appendChild(row);

      const input = row.querySelector('input');
      const label = row.querySelector('.slider-label');

      input.addEventListener('input', () => {
        const mask = getSelectedMask();
        if (!mask) return;
        mask[s.key] = Number(input.value);
        updateMaskUI();
        requestRender();
      });

      input.addEventListener('change', () => pushHistory());
      const resetMaskVal = () => {
        const mask = getSelectedMask();
        if (!mask) return;
        mask[s.key] = 0;
        pushHistory();
        updateMaskUI();
        requestRender();
      };
      input.addEventListener('dblclick', resetMaskVal);
      label.addEventListener('dblclick', resetMaskVal);
    });
  }

  // --- 2D Offscreen & WebGL / Canvas 2D Shader Pipeline ---
  const brushMaskCanvas = document.createElement('canvas');
  brushMaskCanvas.width = 512;
  brushMaskCanvas.height = 512;
  const brushMaskCtx = brushMaskCanvas.getContext('2d');

  // High-speed pixel processor using WebGL2 / WebGL1 for real-time tone + mask grading
  class GLProcessor {
    constructor(canvas) {
      this.canvas = canvas;
      this.gl = canvas.getContext('webgl', { preserveDrawingBuffer: true, premultipliedAlpha: false });
      this.init();
    }

    init() {
      const gl = this.gl;
      if (!gl) return;

      const vsSource = `
        attribute vec2 a_pos;
        varying vec2 v_uv;
        void main() {
          v_uv = vec2(a_pos.x * 0.5 + 0.5, 0.5 - a_pos.y * 0.5);
          gl_Position = vec4(a_pos, 0.0, 1.0);
        }
      `;

      const fsSource = `
        precision highp float;
        varying vec2 v_uv;
        uniform sampler2D u_tex;
        uniform sampler2D u_maskTex;

        uniform float u_exposure;
        uniform float u_brightness;
        uniform float u_contrast;
        uniform float u_highlights;
        uniform float u_shadows;
        uniform float u_whites;
        uniform float u_blacks;
        uniform float u_temp;
        uniform float u_tint;
        uniform float u_vibrance;
        uniform float u_saturation;
        uniform float u_clarity;
        uniform float u_vignette;
        uniform float u_grain;

        uniform int u_maskType; // 0=none, 1=linear, 2=radial, 3=brush
        uniform vec4 u_maskGeom; // x1,y1,x2,y2 or cx,cy,rx,ry
        uniform int u_maskInvert;
        uniform int u_showOverlay;
        uniform vec3 u_maskLight; // exp, bri, con
        uniform vec2 u_maskColor; // temp, sat

        float rand(vec2 co) {
          return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
        }

        vec3 applyGrade(vec3 col, float expV, float briV, float conV, float hiV, float shV, float whV, float blV, float tmpV, float tntV, float vibV, float satV, float clrV) {
          // Exposure
          col *= pow(2.0, expV * 1.5);
          // Brightness
          col += briV * 0.25;
          // Temperature & Tint
          col.r += tmpV * 0.14;
          col.b -= tmpV * 0.14;
          col.g += tntV * 0.12;

          float luma = dot(col, vec3(0.299, 0.587, 0.114));
          // Shadows & Highlights
          float shMask = pow(clamp(1.0 - luma, 0.0, 1.0), 1.6);
          float hiMask = pow(clamp(luma, 0.0, 1.0), 1.6);
          col += shV * 0.32 * shMask;
          col += hiV * 0.32 * hiMask;

          // Blacks & Whites
          col += blV * 0.22 * pow(clamp(1.0 - luma, 0.0, 1.0), 2.5);
          col += whV * 0.22 * pow(clamp(luma, 0.0, 1.0), 2.5);

          // Contrast & Clarity (midtone punch)
          float cFactor = 1.0 + conV * 0.65;
          col = (col - 0.5) * cFactor + 0.5;
          if (abs(clrV) > 0.001) {
            float midWeight = 4.0 * luma * (1.0 - luma);
            col = (col - 0.5) * (1.0 + clrV * 0.45 * midWeight) + 0.5;
          }

          // Vibrance & Saturation
          float newLuma = dot(col, vec3(0.299, 0.587, 0.114));
          float maxC = max(col.r, max(col.g, col.b));
          float minC = min(col.r, min(col.g, col.b));
          float curSat = maxC - minC;
          float vibBoost = vibV * (1.0 - curSat);
          float totalSat = max(0.0, 1.0 + satV + vibBoost);
          col = mix(vec3(newLuma), col, totalSat);

          return clamp(col, 0.0, 1.0);
        }

        void main() {
          vec4 texCol = texture2D(u_tex, v_uv);
          vec3 col = applyGrade(
            texCol.rgb,
            u_exposure, u_brightness, u_contrast,
            u_highlights, u_shadows, u_whites, u_blacks,
            u_temp, u_tint, u_vibrance, u_saturation, u_clarity
          );

          // Active or combined mask pass
          if (u_maskType > 0) {
            float w = 0.0;
            if (u_maskType == 1) {
              vec2 a = u_maskGeom.xy;
              vec2 b = u_maskGeom.zw;
              vec2 ab = b - a;
              float len2 = max(0.0001, dot(ab, ab));
              float t = dot(v_uv - a, ab) / len2;
              w = smoothstep(0.0, 1.0, 1.0 - t);
            } else if (u_maskType == 2) {
              vec2 center = u_maskGeom.xy;
              vec2 radii = max(vec2(0.01), u_maskGeom.zw);
              vec2 d = (v_uv - center) / radii;
              float dist = length(d);
              w = 1.0 - smoothstep(0.45, 1.0, dist);
            } else if (u_maskType == 3) {
              w = texture2D(u_maskTex, v_uv).r;
            }
            if (u_maskInvert == 1) w = 1.0 - w;

            vec3 maskedCol = applyGrade(
              col,
              u_maskLight.x, u_maskLight.y, u_maskLight.z,
              0.0, 0.0, 0.0, 0.0,
              u_maskColor.x, 0.0, 0.0, u_maskColor.y, 0.0
            );
            col = mix(col, maskedCol, w);

            if (u_showOverlay == 1) {
              col = mix(col, vec3(0.98, 0.25, 0.15), w * 0.45);
            }
          }

          // Vignette
          if (abs(u_vignette) > 0.001) {
            float d = distance(v_uv, vec2(0.5, 0.5));
            float vig = smoothstep(0.25, 0.82, d);
            col = clamp(col + u_vignette * vig * 0.65, 0.0, 1.0);
          }

          // Grain
          if (u_grain > 0.001) {
            float n = (rand(v_uv * 400.0) - 0.5) * u_grain * 0.22;
            col = clamp(col + n, 0.0, 1.0);
          }

          gl_FragColor = vec4(col, texCol.a);
        }
      `;

      const compile = (type, src) => {
        const s = gl.createShader(type);
        gl.shaderSource(s, src);
        gl.compileShader(s);
        return s;
      };

      this.prog = gl.createProgram();
      gl.attachShader(this.prog, compile(gl.VERTEX_SHADER, vsSource));
      gl.attachShader(this.prog, compile(gl.FRAGMENT_SHADER, fsSource));
      gl.linkProgram(this.prog);
      gl.useProgram(this.prog);

      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
      const posLoc = gl.getAttribLocation(this.prog, 'a_pos');
      gl.enableVertexAttribArray(posLoc);
      gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

      this.tex = this.createTex(0);
      this.maskTex = this.createTex(1);
    }

    createTex(unit) {
      const gl = this.gl;
      gl.activeTexture(gl.TEXTURE0 + unit);
      const t = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, t);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      return t;
    }

    render(sourceCanvas, edits, bypass, showOverlay) {
      const gl = this.gl;
      if (!gl) return;

      if (this.canvas.width !== sourceCanvas.width || this.canvas.height !== sourceCanvas.height) {
        this.canvas.width = sourceCanvas.width;
        this.canvas.height = sourceCanvas.height;
      }

      gl.viewport(0, 0, this.canvas.width, this.canvas.height);
      gl.useProgram(this.prog);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, sourceCanvas);
      gl.uniform1i(gl.getUniformLocation(this.prog, 'u_tex'), 0);

      const L = bypass.light ? 0 : 1;
      const C = bypass.color ? 0 : 1;
      const E = bypass.effects ? 0 : 1;

      const setU = (name, val) => gl.uniform1f(gl.getUniformLocation(this.prog, name), val);
      setU('u_exposure', (edits.exposure / 100) * L);
      setU('u_brightness', (edits.brightness / 100) * L);
      setU('u_contrast', (edits.contrast / 100) * L);
      setU('u_highlights', (edits.highlights / 100) * L);
      setU('u_shadows', (edits.shadows / 100) * L);
      setU('u_whites', (edits.whites / 100) * L);
      setU('u_blacks', (edits.blacks / 100) * L);

      setU('u_temp', (edits.temp / 100) * C);
      setU('u_tint', (edits.tint / 100) * C);
      setU('u_vibrance', (edits.vibrance / 100) * C);
      setU('u_saturation', (edits.saturation / 100) * C);

      setU('u_clarity', (edits.clarity / 100) * E);
      setU('u_vignette', (edits.vignette / 100) * E);
      setU('u_grain', (edits.grain / 100) * E);

      // Selected Mask (or last mask)
      const mask = edits.masks.find(m => m.id === edits.selectedMaskId) || edits.masks[edits.masks.length - 1];
      if (mask) {
        const typeInt = mask.type === 'linear' ? 1 : mask.type === 'radial' ? 2 : 3;
        gl.uniform1i(gl.getUniformLocation(this.prog, 'u_maskType'), typeInt);
        gl.uniform1i(gl.getUniformLocation(this.prog, 'u_maskInvert'), mask.invert ? 1 : 0);
        gl.uniform1i(gl.getUniformLocation(this.prog, 'u_showOverlay'), showOverlay ? 1 : 0);
        gl.uniform3f(
          gl.getUniformLocation(this.prog, 'u_maskLight'),
          mask.exposure / 100,
          mask.brightness / 100,
          mask.contrast / 100
        );
        gl.uniform2f(
          gl.getUniformLocation(this.prog, 'u_maskColor'),
          mask.temp / 100,
          mask.saturation / 100
        );

        if (mask.type === 'linear') {
          gl.uniform4f(gl.getUniformLocation(this.prog, 'u_maskGeom'), mask.x1, mask.y1, mask.x2, mask.y2);
        } else if (mask.type === 'radial') {
          gl.uniform4f(gl.getUniformLocation(this.prog, 'u_maskGeom'), mask.cx, mask.cy, mask.rx, mask.ry);
        } else if (mask.type === 'brush') {
          renderBrushMaskToCanvas(mask);
          gl.activeTexture(gl.TEXTURE1);
          gl.bindTexture(gl.TEXTURE_2D, this.maskTex);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, brushMaskCanvas);
          gl.uniform1i(gl.getUniformLocation(this.prog, 'u_maskTex'), 1);
        }
      } else {
        gl.uniform1i(gl.getUniformLocation(this.prog, 'u_maskType'), 0);
      }

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
  }

  function renderBrushMaskToCanvas(mask) {
    brushMaskCtx.fillStyle = '#000';
    brushMaskCtx.fillRect(0, 0, 512, 512);
    brushMaskCtx.lineCap = 'round';
    brushMaskCtx.lineJoin = 'round';

    (mask.strokes || []).forEach(stroke => {
      if (!stroke.points.length) return;
      brushMaskCtx.strokeStyle = stroke.mode === 'erase' ? '#000' : '#fff';
      brushMaskCtx.lineWidth = (stroke.size / 600) * 512;
      brushMaskCtx.beginPath();
      stroke.points.forEach((pt, idx) => {
        const px = pt.x * 512;
        const py = pt.y * 512;
        if (idx === 0) brushMaskCtx.moveTo(px, py);
        else brushMaskCtx.lineTo(px, py);
      });
      brushMaskCtx.stroke();
    });
  }

  const glProc = new GLProcessor(el.glCanvas);
  const geomCanvas = document.createElement('canvas');
  const geomCtx = geomCanvas.getContext('2d');

  // --- Transform & Crop Geometry Pass ---
  function buildTransformedSource(imgSource, edits, inCropMode) {
    const stepRad = ((edits.rotateStep % 360) * Math.PI) / 180;
    const fineRad = (edits.rotateFine * Math.PI) / 180;
    const swapped = Math.abs(edits.rotateStep % 180) === 90;

    const baseW = swapped ? imgSource.height : imgSource.width;
    const baseH = swapped ? imgSource.width : imgSource.height;

    const crop = inCropMode ? { x: 0, y: 0, w: 1, h: 1 } : edits.crop;
    const outW = Math.max(1, Math.round(baseW * crop.w));
    const outH = Math.max(1, Math.round(baseH * crop.h));

    geomCanvas.width = outW;
    geomCanvas.height = outH;
    geomCtx.save();
    geomCtx.clearRect(0, 0, outW, outH);

    // Offset for active crop
    geomCtx.translate(-crop.x * baseW, -crop.y * baseH);
    geomCtx.translate(baseW / 2, baseH / 2);

    // Auto-scale on fine straighten so edges never show black triangles
    if (Math.abs(edits.rotateFine) > 0.05) {
      const absSin = Math.abs(Math.sin(fineRad));
      const absCos = Math.abs(Math.cos(fineRad));
      const scale = Math.max(
        (baseW * absCos + baseH * absSin) / baseW,
        (baseH * absCos + baseW * absSin) / baseH
      );
      geomCtx.scale(scale, scale);
    }

    geomCtx.rotate(stepRad + fineRad);
    geomCtx.scale(edits.flipH ? -1 : 1, edits.flipV ? -1 : 1);
    geomCtx.drawImage(imgSource, -imgSource.width / 2, -imgSource.height / 2);
    geomCtx.restore();
    return geomCanvas;
  }

  // --- On-Demand Render Loop (0% Idle CPU/GPU) ---
  let renderPending = false;
  function requestRender() {
    if (renderPending) return;
    renderPending = true;
    requestAnimationFrame(() => {
      renderPending = false;
      renderViewport();
    });
  }

  function renderViewport() {
    const photo = getCurrentPhoto();
    if (!photo) return;

    const inCropMode = state.activeMode === 'crop';
    const srcCanvas = buildTransformedSource(photo.proxy, photo.edits, inCropMode);

    // Fit canvas inside stage
    const stageRect = el.canvasStage.getBoundingClientRect();
    const availW = Math.max(120, stageRect.width - 32);
    const availH = Math.max(120, stageRect.height - 32);
    const scale = Math.min(1, availW / srcCanvas.width, availH / srcCanvas.height);

    const dispW = Math.round(srcCanvas.width * scale);
    const dispH = Math.round(srcCanvas.height * scale);

    el.glCanvas.style.width = `${dispW}px`;
    el.glCanvas.style.height = `${dispH}px`;
    el.overlayCanvas.width = dispW;
    el.overlayCanvas.height = dispH;

    if (state.compareHold) {
      const neutral = createDefaultEdits();
      glProc.render(srcCanvas, neutral, { light: false, color: false, effects: false }, false);
    } else {
      glProc.render(
        srcCanvas,
        photo.edits,
        state.sectionBypass,
        state.activeMode === 'mask' && state.showMaskOverlay
      );
    }

    drawOverlay(dispW, dispH, srcCanvas, photo.edits);
  }

  // --- 2D Overlay for Crop, Mask Handles & Split Wipe ---
  function drawOverlay(w, h, srcCanvas, edits) {
    const ctx = el.overlayCanvas.getContext('2d');
    ctx.clearRect(0, 0, w, h);

    // Split Wipe Comparison
    if (state.splitWipe) {
      const splitX = Math.round(w * state.splitPos);
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, splitX, h);
      ctx.clip();
      ctx.drawImage(srcCanvas, 0, 0, w, h);
      ctx.restore();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(splitX, 0);
      ctx.lineTo(splitX, h);
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(splitX, h / 2, 10, 0, Math.PI * 2);
      ctx.fill();
    }

    // Crop Overlay
    if (state.activeMode === 'crop') {
      const c = edits.crop;
      const cx = c.x * w;
      const cy = c.y * h;
      const cw = c.w * w;
      const ch = c.h * h;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.58)';
      ctx.fillRect(0, 0, w, cy);
      ctx.fillRect(0, cy + ch, w, h - (cy + ch));
      ctx.fillRect(0, cy, cx, ch);
      ctx.fillRect(cx + cw, cy, w - (cx + cw), ch);

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(cx, cy, cw, ch);

      // Rule of Thirds
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx + cw / 3, cy); ctx.lineTo(cx + cw / 3, cy + ch);
      ctx.moveTo(cx + (cw * 2) / 3, cy); ctx.lineTo(cx + (cw * 2) / 3, cy + ch);
      ctx.moveTo(cx, cy + ch / 3); ctx.lineTo(cx + cw, cy + ch / 3);
      ctx.moveTo(cx, cy + (ch * 2) / 3); ctx.lineTo(cx + cw, cy + (ch * 2) / 3);
      ctx.stroke();

      // Corner Handles
      ctx.fillStyle = '#ffffff';
      const hs = 8;
      [
        [cx, cy],
        [cx + cw - hs, cy],
        [cx, cy + ch - hs],
        [cx + cw - hs, cy + ch - hs]
      ].forEach(([hx, hy]) => ctx.fillRect(hx, hy, hs, hs));
    }

    // Mask Handles
    if (state.activeMode === 'mask') {
      const mask = getSelectedMask();
      if (!mask) return;

      if (mask.type === 'linear') {
        const x1 = mask.x1 * w, y1 = mask.y1 * h;
        const x2 = mask.x2 * w, y2 = mask.y2 * h;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        [ [x1, y1], [x2, y2] ].forEach(([px, py], idx) => {
          ctx.fillStyle = idx === 0 ? '#f97316' : '#ffffff';
          ctx.beginPath();
          ctx.arc(px, py, 6, 0, Math.PI * 2);
          ctx.fill();
        });
      } else if (mask.type === 'radial') {
        const cx = mask.cx * w, cy = mask.cy * h;
        const rx = mask.rx * w, ry = mask.ry * h;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#f97316';
        ctx.beginPath();
        ctx.arc(cx, cy, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(cx + rx, cy, 5, 0, Math.PI * 2);
        ctx.arc(cx, cy + ry, 5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // --- Pointer Interactions on Overlay Canvas ---
  function getNormPointer(e) {
    const rect = el.overlayCanvas.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)),
      y: Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height)),
      w: rect.width,
      h: rect.height
    };
  }

  el.overlayCanvas.addEventListener('pointerdown', e => {
    const photo = getCurrentPhoto();
    if (!photo) return;
    el.overlayCanvas.setPointerCapture(e.pointerId);
    const pt = getNormPointer(e);

    // Split Wipe Drag
    if (state.splitWipe && Math.abs(pt.x - state.splitPos) * pt.w < 20) {
      state.interaction = { type: 'split' };
      return;
    }

    // Crop Drag
    if (state.activeMode === 'crop') {
      const c = photo.edits.crop;
      const tolX = 16 / pt.w;
      const tolY = 16 / pt.h;

      const nearL = Math.abs(pt.x - c.x) < tolX;
      const nearR = Math.abs(pt.x - (c.x + c.w)) < tolX;
      const nearT = Math.abs(pt.y - c.y) < tolY;
      const nearB = Math.abs(pt.y - (c.y + c.h)) < tolY;

      let handle = null;
      if (nearL && nearT) handle = 'nw';
      else if (nearR && nearT) handle = 'ne';
      else if (nearL && nearB) handle = 'sw';
      else if (nearR && nearB) handle = 'se';
      else if (pt.x > c.x && pt.x < c.x + c.w && pt.y > c.y && pt.y < c.y + c.h) handle = 'move';

      if (handle) {
        state.interaction = {
          type: 'crop',
          handle,
          startX: pt.x,
          startY: pt.y,
          orig: { ...c }
        };
      }
      return;
    }

    // Mask Drag / Brush
    if (state.activeMode === 'mask') {
      const mask = getSelectedMask();
      if (!mask) return;

      if (mask.type === 'linear') {
        const d1 = Math.hypot((pt.x - mask.x1) * pt.w, (pt.y - mask.y1) * pt.h);
        const d2 = Math.hypot((pt.x - mask.x2) * pt.w, (pt.y - mask.y2) * pt.h);
        if (d1 < 20) state.interaction = { type: 'linear-p1' };
        else if (d2 < 20) state.interaction = { type: 'linear-p2' };
      } else if (mask.type === 'radial') {
        const dc = Math.hypot((pt.x - mask.cx) * pt.w, (pt.y - mask.cy) * pt.h);
        const drx = Math.hypot((pt.x - (mask.cx + mask.rx)) * pt.w, (pt.y - mask.cy) * pt.h);
        const dry = Math.hypot((pt.x - mask.cx) * pt.w, (pt.y - (mask.cy + mask.ry)) * pt.h);
        if (dc < 20) state.interaction = { type: 'radial-center' };
        else if (drx < 20) state.interaction = { type: 'radial-rx' };
        else if (dry < 20) state.interaction = { type: 'radial-ry' };
      } else if (mask.type === 'brush') {
        const stroke = { mode: state.brushMode, size: state.brushSize, points: [{ x: pt.x, y: pt.y }] };
        mask.strokes.push(stroke);
        state.interaction = { type: 'brush', stroke };
        requestRender();
      }
    }
  });

  el.overlayCanvas.addEventListener('pointermove', e => {
    if (!state.interaction) return;
    const photo = getCurrentPhoto();
    if (!photo) return;
    const pt = getNormPointer(e);
    const act = state.interaction;

    if (act.type === 'split') {
      state.splitPos = Math.max(0.05, Math.min(0.95, pt.x));
      requestRender();
      return;
    }

    if (act.type === 'crop') {
      const dx = pt.x - act.startX;
      const dy = pt.y - act.startY;
      const c = photo.edits.crop;
      const o = act.orig;

      if (act.handle === 'move') {
        c.x = Math.max(0, Math.min(1 - o.w, o.x + dx));
        c.y = Math.max(0, Math.min(1 - o.h, o.y + dy));
      } else {
        if (act.handle.includes('w')) {
          const nx = Math.max(0, Math.min(o.x + o.w - 0.1, o.x + dx));
          c.w = o.w + (o.x - nx);
          c.x = nx;
        }
        if (act.handle.includes('e')) {
          c.w = Math.max(0.1, Math.min(1 - o.x, o.w + dx));
        }
        if (act.handle.includes('n')) {
          const ny = Math.max(0, Math.min(o.y + o.h - 0.1, o.y + dy));
          c.h = o.h + (o.y - ny);
          c.y = ny;
        }
        if (act.handle.includes('s')) {
          c.h = Math.max(0.1, Math.min(1 - o.y, o.h + dy));
        }
      }
      requestRender();
      return;
    }

    const mask = getSelectedMask();
    if (!mask) return;
    if (act.type === 'linear-p1') { mask.x1 = pt.x; mask.y1 = pt.y; }
    else if (act.type === 'linear-p2') { mask.x2 = pt.x; mask.y2 = pt.y; }
    else if (act.type === 'radial-center') { mask.cx = pt.x; mask.cy = pt.y; }
    else if (act.type === 'radial-rx') { mask.rx = Math.max(0.05, Math.abs(pt.x - mask.cx)); }
    else if (act.type === 'radial-ry') { mask.ry = Math.max(0.05, Math.abs(pt.y - mask.cy)); }
    else if (act.type === 'brush') {
      act.stroke.points.push({ x: pt.x, y: pt.y });
    }
    requestRender();
  });

  el.overlayCanvas.addEventListener('pointerup', () => {
    if (state.interaction) {
      if (state.interaction.type !== 'split') pushHistory();
      state.interaction = null;
    }
  });

  // --- File & Folder Loading ---
  async function loadFiles(fileList) {
    const validFiles = Array.from(fileList).filter(f =>
      f.type.startsWith('image/') || /\.(jpe?g|png|webp|avif|bmp|gif)$/i.test(f.name)
    );
    if (!validFiles.length) return;

    showStatus(`Loading ${validFiles.length} photo(s)...`);

    for (const file of validFiles) {
      try {
        const bitmap = await createImageBitmap(file);
        const maxProxy = 1440;
        const scale = Math.min(1, maxProxy / Math.max(bitmap.width, bitmap.height));
        const proxyCanvas = document.createElement('canvas');
        proxyCanvas.width = Math.round(bitmap.width * scale);
        proxyCanvas.height = Math.round(bitmap.height * scale);
        proxyCanvas.getContext('2d').drawImage(bitmap, 0, 0, proxyCanvas.width, proxyCanvas.height);

        // Thumbnail URL
        const thumbCanvas = document.createElement('canvas');
        const tScale = Math.min(1, 160 / Math.max(bitmap.width, bitmap.height));
        thumbCanvas.width = Math.round(bitmap.width * tScale);
        thumbCanvas.height = Math.round(bitmap.height * tScale);
        thumbCanvas.getContext('2d').drawImage(bitmap, 0, 0, thumbCanvas.width, thumbCanvas.height);
        const thumbUrl = thumbCanvas.toDataURL('image/jpeg', 0.75);
        bitmap.close();

        const initialEdits = createDefaultEdits();
        state.photos.push({
          id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()),
          name: file.name.replace(/\.[^/.]+$/, ''),
          origName: file.name,
          file,
          width: proxyCanvas.width / scale,
          height: proxyCanvas.height / scale,
          proxy: proxyCanvas,
          thumbUrl,
          edits: initialEdits,
          history: [cloneEdits(initialEdits)],
          historyIndex: 0
        });
      } catch (err) {
        console.warn('Skipped file:', file.name, err);
      }
    }

    if (state.photos.length > 0) {
      el.homeScreen.classList.add('hidden');
      el.workspace.classList.remove('hidden');
      if (state.currentIndex === -1) selectPhoto(0);
      else {
        renderFilmstrip();
        updateHeaderMeta();
      }
      showStatus(`Loaded ${validFiles.length} photograph(s)`);
    }
  }

  // Recursive Drag-and-Drop Directory Reader
  async function readEntryRecursively(entry) {
    if (entry.isFile) {
      return new Promise(resolve => entry.file(f => resolve([f]), () => resolve([])));
    }
    if (entry.isDirectory) {
      const reader = entry.createReader();
      const allEntries = [];
      const readBatch = () =>
        new Promise(resolve => {
          reader.readEntries(entries => {
            if (!entries.length) resolve();
            else {
              allEntries.push(...entries);
              readBatch().then(resolve);
            }
          }, () => resolve());
        });
      await readBatch();
      const nested = await Promise.all(allEntries.map(readEntryRecursively));
      return nested.flat();
    }
    return [];
  }

  // --- Sample Photographs ---
  async function loadSamplePhotos() {
    const urls = [
      { name: 'mountain_dawn', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=85' },
      { name: 'architectural_lines', url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=85' },
      { name: 'coastal_fog', url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1600&q=85' }
    ];
    showStatus('Fetching sample photographs...');
    const files = [];
    for (const item of urls) {
      const res = await fetch(item.url);
      const blob = await res.blob();
      files.push(new File([blob], `${item.name}.jpg`, { type: 'image/jpeg' }));
    }
    await loadFiles(files);
  }

  // --- Photo Selection & History ---
  function getCurrentPhoto() {
    return state.photos[state.currentIndex] || null;
  }

  function getSelectedMask() {
    const p = getCurrentPhoto();
    if (!p) return null;
    return p.edits.masks.find(m => m.id === p.edits.selectedMaskId) || null;
  }

  function selectPhoto(index) {
    if (index < 0 || index >= state.photos.length) return;
    state.currentIndex = index;
    const photo = getCurrentPhoto();
    updateSliderUI(photo.edits);
    updateMaskUI();
    updateHistoryButtons();
    renderFilmstrip();
    updateHeaderMeta();
    requestRender();
  }

  function pushHistory() {
    const photo = getCurrentPhoto();
    if (!photo) return;
    photo.history = photo.history.slice(0, photo.historyIndex + 1);
    photo.history.push(cloneEdits(photo.edits));
    if (photo.history.length > 35) photo.history.shift();
    photo.historyIndex = photo.history.length - 1;
    updateHistoryButtons();
    renderFilmstrip();
  }

  function undo() {
    const photo = getCurrentPhoto();
    if (!photo || photo.historyIndex <= 0) return;
    photo.historyIndex--;
    photo.edits = cloneEdits(photo.history[photo.historyIndex]);
    updateSliderUI(photo.edits);
    updateMaskUI();
    updateHistoryButtons();
    renderFilmstrip();
    requestRender();
  }

  function redo() {
    const photo = getCurrentPhoto();
    if (!photo || photo.historyIndex >= photo.history.length - 1) return;
    photo.historyIndex++;
    photo.edits = cloneEdits(photo.history[photo.historyIndex]);
    updateSliderUI(photo.edits);
    updateMaskUI();
    updateHistoryButtons();
    renderFilmstrip();
    requestRender();
  }

  function updateHistoryButtons() {
    const photo = getCurrentPhoto();
    el.btnUndo.disabled = !photo || photo.historyIndex <= 0;
    el.btnRedo.disabled = !photo || photo.historyIndex >= photo.history.length - 1;
  }

  function updateHeaderMeta() {
    const photo = getCurrentPhoto();
    el.photoCounter.textContent = state.photos.length
      ? `${state.currentIndex + 1} / ${state.photos.length}`
      : '0 / 0';
    el.fileMeta.textContent = photo
      ? `${photo.origName} (${Math.round(photo.width)} × ${Math.round(photo.height)})`
      : '';
  }

  function updateSliderUI(edits) {
    Object.values(SLIDER_GROUPS).flat().forEach(s => {
      const input = document.getElementById(`slider-${s.key}`);
      const valEl = document.getElementById(`val-${s.key}`);
      const label = document.querySelector(`[data-reset="${s.key}"]`);
      if (input && valEl) {
        input.value = edits[s.key];
        valEl.textContent = edits[s.key] > 0 ? `+${edits[s.key]}` : edits[s.key];
        if (label) label.classList.toggle('modified', edits[s.key] !== s.def);
      }
    });

    const rotSlider = document.getElementById('slider-rotate-fine');
    const rotVal = document.getElementById('val-rotate-fine');
    if (rotSlider && rotVal) {
      rotSlider.value = edits.rotateFine;
      rotVal.textContent = `${edits.rotateFine.toFixed(1)}°`;
    }

    document.querySelectorAll('.ratio-btn[data-ratio]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.ratio === edits.crop.ratio);
    });
  }

  function renderFilmstrip() {
    el.filmstrip.innerHTML = '';
    state.photos.forEach((p, idx) => {
      const item = document.createElement('div');
      item.className = `thumb-item${idx === state.currentIndex ? ' active' : ''}`;
      item.innerHTML = `
        <img src="${p.thumbUrl}" alt="${p.name}" />
        ${isModified(p.edits) ? '<span class="thumb-dot"></span>' : ''}
        <button class="thumb-remove" title="Remove photo">&times;</button>
      `;
      item.addEventListener('click', e => {
        if (e.target.closest('.thumb-remove')) {
          state.photos.splice(idx, 1);
          if (!state.photos.length) {
            state.currentIndex = -1;
            el.workspace.classList.add('hidden');
            el.homeScreen.classList.remove('hidden');
            return;
          }
          selectPhoto(Math.min(state.currentIndex, state.photos.length - 1));
          return;
        }
        selectPhoto(idx);
      });
      el.filmstrip.appendChild(item);
    });
  }

  // --- Mask Management ---
  function addMask(type) {
    const photo = getCurrentPhoto();
    if (!photo) return;
    const id = String(Date.now());
    const count = photo.edits.masks.length + 1;
    const base = {
      id,
      type,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} ${count}`,
      invert: false,
      exposure: 0,
      brightness: 0,
      contrast: 0,
      temp: 0,
      saturation: 0
    };

    if (type === 'linear') {
      Object.assign(base, { x1: 0.5, y1: 0.25, x2: 0.5, y2: 0.75 });
    } else if (type === 'radial') {
      Object.assign(base, { cx: 0.5, cy: 0.5, rx: 0.28, ry: 0.28 });
    } else if (type === 'brush') {
      Object.assign(base, { strokes: [] });
    }

    photo.edits.masks.push(base);
    photo.edits.selectedMaskId = id;
    pushHistory();
    updateMaskUI();
    requestRender();
  }

  function updateMaskUI() {
    const photo = getCurrentPhoto();
    if (!photo) return;

    el.maskList.innerHTML = '';
    photo.edits.masks.forEach(m => {
      const div = document.createElement('div');
      div.className = `mask-item${m.id === photo.edits.selectedMaskId ? ' active' : ''}`;
      div.innerHTML = `<span>${m.name}</span><span>${m.type}</span>`;
      div.addEventListener('click', () => {
        photo.edits.selectedMaskId = m.id;
        updateMaskUI();
        requestRender();
      });
      el.maskList.appendChild(div);
    });

    const mask = getSelectedMask();
    el.maskControlsWrap.classList.toggle('hidden', !mask);
    if (!mask) return;

    el.chkMaskInvert.checked = Boolean(mask.invert);
    el.brushControls.classList.toggle('hidden', mask.type !== 'brush');

    MASK_SLIDERS.forEach(s => {
      const input = document.getElementById(`mslider-${s.key}`);
      const val = document.getElementById(`mval-${s.key}`);
      if (input && val) {
        input.value = mask[s.key] || 0;
        val.textContent = mask[s.key] > 0 ? `+${mask[s.key]}` : mask[s.key] || 0;
      }
    });
  }

  // --- Presets ---
  function renderPresets() {
    const grid = document.getElementById('preset-grid');
    grid.innerHTML = '';
    BUILTIN_PRESETS.forEach(p => {
      const btn = document.createElement('button');
      btn.className = 'preset-btn';
      btn.textContent = p.name;
      btn.addEventListener('click', () => applyPresetValues(p.values, p.name));
      grid.appendChild(btn);
    });

    const userGrid = document.getElementById('user-preset-list');
    userGrid.innerHTML = '';
    state.userPresets.forEach((p, idx) => {
      const btn = document.createElement('button');
      btn.className = 'preset-btn';
      btn.textContent = p.name;
      btn.title = 'Click to apply, Shift+Click to delete';
      btn.addEventListener('click', e => {
        if (e.shiftKey) {
          state.userPresets.splice(idx, 1);
          localStorage.setItem('pt_user_presets', JSON.stringify(state.userPresets));
          renderPresets();
          return;
        }
        applyPresetValues(p.values, p.name);
      });
      userGrid.appendChild(btn);
    });
  }

  function applyPresetValues(values, name) {
    const photo = getCurrentPhoto();
    if (!photo) return;
    const def = createDefaultEdits();
    Object.values(SLIDER_GROUPS).flat().forEach(s => {
      photo.edits[s.key] = values[s.key] !== undefined ? values[s.key] : def[s.key];
    });
    pushHistory();
    updateSliderUI(photo.edits);
    requestRender();
    showStatus(`Applied preset: ${name}`);
  }

  // --- Auto Balance ---
  function autoBalancePhoto() {
    const photo = getCurrentPhoto();
    if (!photo) return;
    const ctx = photo.proxy.getContext('2d');
    const data = ctx.getImageData(0, 0, photo.proxy.width, photo.proxy.height).data;
    let sumLuma = 0;
    let sumR = 0, sumB = 0;
    const step = 16;
    let count = 0;
    for (let i = 0; i < data.length; i += 4 * step) {
      const r = data[i], g = data[i + 1], b = data[i + 2];
      sumLuma += 0.299 * r + 0.587 * g + 0.114 * b;
      sumR += r;
      sumB += b;
      count++;
    }
    const avgLuma = sumLuma / count;
    const avgR = sumR / count;
    const avgB = sumB / count;

    photo.edits.exposure = Math.max(-45, Math.min(45, Math.round((128 - avgLuma) * 0.45)));
    photo.edits.contrast = 14;
    photo.edits.highlights = -16;
    photo.edits.shadows = 18;
    photo.edits.vibrance = 12;
    photo.edits.temp = Math.max(-25, Math.min(25, Math.round((avgB - avgR) * 0.25)));

    pushHistory();
    updateSliderUI(photo.edits);
    requestRender();
    showStatus('Auto balanced tone & color');
  }

  // --- Sequential Full-Resolution Batch Export ---
  async function renderFullResBlob(photo, mimeType, quality, maxEdge) {
    const bitmap = await createImageBitmap(photo.file);
    const fullTransformed = buildTransformedSource(bitmap, photo.edits, false);
    bitmap.close();

    let targetW = fullTransformed.width;
    let targetH = fullTransformed.height;
    if (maxEdge > 0 && Math.max(targetW, targetH) > maxEdge) {
      const s = maxEdge / Math.max(targetW, targetH);
      targetW = Math.round(targetW * s);
      targetH = Math.round(targetH * s);
    }

    const outCanvas = document.createElement('canvas');
    outCanvas.width = targetW;
    outCanvas.height = targetH;
    outCanvas.getContext('2d').drawImage(fullTransformed, 0, 0, targetW, targetH);

    // Render shader at target export dimensions
    glProc.render(outCanvas, photo.edits, { light: false, color: false, effects: false }, false);

    const blob = await new Promise(resolve => el.glCanvas.toBlob(resolve, mimeType, quality));
    requestRender(); // Restore viewport preview
    return blob;
  }

  async function runExport(mode) {
    const scope = document.getElementById('export-scope').value;
    const targets = scope === 'current' ? [getCurrentPhoto()].filter(Boolean) : state.photos;
    if (!targets.length) return;

    const mime = state.exportFormat;
    const ext = mime === 'image/webp' ? 'webp' : mime === 'image/jpeg' ? 'jpg' : 'png';
    const quality = Number(document.getElementById('slider-export-quality').value) / 100;
    const maxEdge = Number(document.getElementById('export-resize').value);
    const prefix = document.getElementById('export-prefix').value.trim();

    const progWrap = document.getElementById('export-progress-wrap');
    const progBar = document.getElementById('export-progress-bar');
    const progText = document.getElementById('export-progress-text');

    progWrap.classList.remove('hidden');

    // Direct Folder Export if chosen and supported
    if (mode === 'folder' && window.showDirectoryPicker) {
      try {
        const dirHandle = await window.showDirectoryPicker();
        for (let i = 0; i < targets.length; i++) {
          const p = targets[i];
          progText.textContent = `Saving ${i + 1} of ${targets.length}: ${p.name}.${ext}`;
          progBar.style.width = `${Math.round(((i + 1) / targets.length) * 100)}%`;
          const blob = await renderFullResBlob(p, mime, quality, maxEdge);
          const fileHandle = await dirHandle.getFileHandle(`${prefix}${p.name}.${ext}`, { create: true });
          const writable = await fileHandle.createWritable();
          await writable.write(blob);
          await writable.close();
        }
        progWrap.classList.add('hidden');
        el.exportModal.classList.add('hidden');
        showStatus(`Saved ${targets.length} file(s) to folder`);
        return;
      } catch (err) {
        progWrap.classList.add('hidden');
        return;
      }
    }

    // Single Photo Direct Download
    if (targets.length === 1) {
      const p = targets[0];
      progText.textContent = `Rendering ${p.name}.${ext}...`;
      progBar.style.width = '100%';
      const blob = await renderFullResBlob(p, mime, quality, maxEdge);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${prefix}${p.name}.${ext}`;
      a.click();
      URL.revokeObjectURL(url);
      progWrap.classList.add('hidden');
      el.exportModal.classList.add('hidden');
      showStatus(`Exported ${p.name}.${ext}`);
      return;
    }

    // Multi-Photo ZIP Export via fflate
    const zipEntries = {};
    for (let i = 0; i < targets.length; i++) {
      const p = targets[i];
      progText.textContent = `Encoding ${i + 1} / ${targets.length}: ${p.name}.${ext}`;
      progBar.style.width = `${Math.round(((i + 1) / targets.length) * 100)}%`;
      const blob = await renderFullResBlob(p, mime, quality, maxEdge);
      const buf = new Uint8Array(await blob.arrayBuffer());
      zipEntries[`${prefix}${p.name}.${ext}`] = buf;
    }

    progText.textContent = 'Bundling ZIP archive...';
    const zipped = window.fflate.zipSync(zipEntries, { level: 0 });
    const zipBlob = new Blob([zipped], { type: 'application/zip' });
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `picture-this-${ext}-export.zip`;
    a.click();
    URL.revokeObjectURL(url);

    progWrap.classList.add('hidden');
    el.exportModal.classList.add('hidden');
    showStatus(`Exported ${targets.length} photos (.zip)`);
  }

  // --- Wire UI Events ---
  function initEvents() {
    // Upload triggers
    document.getElementById('home-btn-photos').addEventListener('click', () => el.fileInput.click());
    document.getElementById('home-btn-folder').addEventListener('click', () => el.folderInput.click());
    document.getElementById('home-btn-sample').addEventListener('click', loadSamplePhotos);
    document.getElementById('btn-add-photos').addEventListener('click', () => el.fileInput.click());
    document.getElementById('btn-add-folder').addEventListener('click', () => el.folderInput.click());
    document.getElementById('btn-home-logo').addEventListener('click', () => el.fileInput.click());

    el.fileInput.addEventListener('change', e => {
      loadFiles(e.target.files);
      el.fileInput.value = '';
    });
    el.folderInput.addEventListener('change', e => {
      loadFiles(e.target.files);
      el.folderInput.value = '';
    });

    // Global Drag & Drop (Files + Folders)
    window.addEventListener('dragover', e => {
      e.preventDefault();
      el.dropOverlay.classList.remove('hidden');
    });
    window.addEventListener('dragleave', e => {
      if (e.relatedTarget === null) el.dropOverlay.classList.add('hidden');
    });
    window.addEventListener('drop', async e => {
      e.preventDefault();
      el.dropOverlay.classList.add('hidden');
      const items = e.dataTransfer.items;
      if (items && items.length) {
        const entries = [];
        for (let i = 0; i < items.length; i++) {
          const entry = items[i].webkitGetAsEntry ? items[i].webkitGetAsEntry() : null;
          if (entry) entries.push(entry);
        }
        if (entries.length) {
          const nestedFiles = await Promise.all(entries.map(readEntryRecursively));
          await loadFiles(nestedFiles.flat());
          return;
        }
      }
      if (e.dataTransfer.files.length) {
        await loadFiles(e.dataTransfer.files);
      }
    });

    // Mode Switching
    document.querySelectorAll('.mode-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        state.activeMode = tab.dataset.mode;
        document.querySelectorAll('.mode-tab').forEach(t => t.classList.toggle('active', t === tab));
        document.querySelectorAll('.inspector-panel').forEach(p => {
          p.classList.toggle('active', p.id === `panel-${state.activeMode}`);
        });
        if (el.inspector.classList.contains('collapsed')) {
          el.inspector.classList.remove('collapsed');
        }
        requestRender();
      });
    });

    // Accordions & Section Bypass / Reset
    document.querySelectorAll('.accordion-trigger').forEach(trig => {
      trig.addEventListener('click', () => trig.closest('.accordion').classList.toggle('open'));
    });

    document.querySelectorAll('.section-eye').forEach(btn => {
      btn.addEventListener('click', () => {
        const sec = btn.dataset.section;
        state.sectionBypass[sec] = !state.sectionBypass[sec];
        btn.classList.toggle('muted', state.sectionBypass[sec]);
        requestRender();
      });
    });

    document.querySelectorAll('.section-reset').forEach(btn => {
      btn.addEventListener('click', () => {
        const photo = getCurrentPhoto();
        if (!photo) return;
        const sec = btn.dataset.section;
        SLIDER_GROUPS[sec].forEach(s => { photo.edits[s.key] = s.def; });
        pushHistory();
        updateSliderUI(photo.edits);
        requestRender();
      });
    });

    // Auto Tone, Undo, Redo, Copy, Paste, Sync All
    document.getElementById('btn-auto-tone').addEventListener('click', autoBalancePhoto);
    el.btnUndo.addEventListener('click', undo);
    el.btnRedo.addEventListener('click', redo);

    document.getElementById('btn-copy').addEventListener('click', () => {
      const photo = getCurrentPhoto();
      if (!photo) return;
      state.clipboard = cloneEdits(photo.edits);
      el.btnPaste.disabled = false;
      showStatus('Copied adjustments to clipboard');
    });

    el.btnPaste.addEventListener('click', () => {
      const photo = getCurrentPhoto();
      if (!photo || !state.clipboard) return;
      photo.edits = cloneEdits(state.clipboard);
      pushHistory();
      updateSliderUI(photo.edits);
      updateMaskUI();
      requestRender();
      showStatus('Pasted adjustments');
    });

    document.getElementById('btn-sync-all').addEventListener('click', () => {
      const src = getCurrentPhoto();
      if (!src || state.photos.length < 2) return;
      state.photos.forEach((p, idx) => {
        if (idx === state.currentIndex) return;
        p.edits = cloneEdits(src.edits);
        p.history.push(cloneEdits(p.edits));
        p.historyIndex = p.history.length - 1;
      });
      renderFilmstrip();
      showStatus(`Synced settings across all ${state.photos.length} photos`);
    });

    // Stage Utility Buttons
    document.getElementById('btn-toggle-filmstrip').addEventListener('click', () => {
      el.filmstripWrap.classList.toggle('collapsed');
      setTimeout(requestRender, 180);
    });

    document.getElementById('btn-toggle-inspector').addEventListener('click', () => {
      el.inspector.classList.toggle('collapsed');
      setTimeout(requestRender, 180);
    });

    const splitBtn = document.getElementById('btn-split-wipe');
    splitBtn.addEventListener('click', () => {
      state.splitWipe = !state.splitWipe;
      splitBtn.classList.toggle('active', state.splitWipe);
      requestRender();
    });

    const holdBtn = document.getElementById('btn-compare-hold');
    const startHold = () => { state.compareHold = true; requestRender(); };
    const endHold = () => { state.compareHold = false; requestRender(); };
    holdBtn.addEventListener('pointerdown', startHold);
    window.addEventListener('pointerup', endHold);

    document.getElementById('btn-reset-photo').addEventListener('click', () => {
      const photo = getCurrentPhoto();
      if (!photo) return;
      photo.edits = createDefaultEdits();
      pushHistory();
      updateSliderUI(photo.edits);
      updateMaskUI();
      requestRender();
      showStatus('Reset photograph to original');
    });

    // Crop & Transform
    document.querySelectorAll('.ratio-btn[data-ratio]').forEach(btn => {
      btn.addEventListener('click', () => {
        const photo = getCurrentPhoto();
        if (!photo) return;
        const ratio = btn.dataset.ratio;
        photo.edits.crop.ratio = ratio;

        if (ratio === 'free' || ratio === 'original') {
          photo.edits.crop = { x: 0, y: 0, w: 1, h: 1, ratio };
        } else {
          const [rw, rh] = ratio.split(':').map(Number);
          const imgAspect = photo.width / photo.height;
          const targetAspect = rw / rh;
          let w = 1, h = 1;
          if (targetAspect > imgAspect) h = imgAspect / targetAspect;
          else w = targetAspect / imgAspect;
          photo.edits.crop = { x: (1 - w) / 2, y: (1 - h) / 2, w, h, ratio };
        }
        pushHistory();
        updateSliderUI(photo.edits);
        requestRender();
      });
    });

    document.getElementById('btn-swap-ratio').addEventListener('click', () => {
      const photo = getCurrentPhoto();
      if (!photo) return;
      const c = photo.edits.crop;
      const nw = Math.min(1, c.h);
      const nh = Math.min(1, c.w);
      c.w = nw;
      c.h = nh;
      c.x = (1 - nw) / 2;
      c.y = (1 - nh) / 2;
      pushHistory();
      requestRender();
    });

    const rotFine = document.getElementById('slider-rotate-fine');
    rotFine.addEventListener('input', () => {
      const photo = getCurrentPhoto();
      if (!photo) return;
      photo.edits.rotateFine = Number(rotFine.value);
      document.getElementById('val-rotate-fine').textContent = `${photo.edits.rotateFine.toFixed(1)}°`;
      requestRender();
    });
    rotFine.addEventListener('change', pushHistory);
    rotFine.addEventListener('dblclick', () => {
      const photo = getCurrentPhoto();
      if (!photo) return;
      photo.edits.rotateFine = 0;
      pushHistory();
      updateSliderUI(photo.edits);
      requestRender();
    });

    document.getElementById('btn-rot-left').addEventListener('click', () => {
      const photo = getCurrentPhoto();
      if (!photo) return;
      photo.edits.rotateStep = (photo.edits.rotateStep - 90) % 360;
      pushHistory();
      requestRender();
    });

    document.getElementById('btn-rot-right').addEventListener('click', () => {
      const photo = getCurrentPhoto();
      if (!photo) return;
      photo.edits.rotateStep = (photo.edits.rotateStep + 90) % 360;
      pushHistory();
      requestRender();
    });

    document.getElementById('btn-flip-h').addEventListener('click', () => {
      const photo = getCurrentPhoto();
      if (!photo) return;
      photo.edits.flipH = !photo.edits.flipH;
      pushHistory();
      requestRender();
    });

    document.getElementById('btn-flip-v').addEventListener('click', () => {
      const photo = getCurrentPhoto();
      if (!photo) return;
      photo.edits.flipV = !photo.edits.flipV;
      pushHistory();
      requestRender();
    });

    document.getElementById('btn-reset-crop').addEventListener('click', () => {
      const photo = getCurrentPhoto();
      if (!photo) return;
      photo.edits.crop = { x: 0, y: 0, w: 1, h: 1, ratio: 'free' };
      photo.edits.rotateFine = 0;
      photo.edits.rotateStep = 0;
      photo.edits.flipH = false;
      photo.edits.flipV = false;
      pushHistory();
      updateSliderUI(photo.edits);
      requestRender();
    });

    // Mask Controls
    document.getElementById('btn-add-linear').addEventListener('click', () => addMask('linear'));
    document.getElementById('btn-add-radial').addEventListener('click', () => addMask('radial'));
    document.getElementById('btn-add-brush').addEventListener('click', () => addMask('brush'));

    el.chkMaskOverlay.addEventListener('change', () => {
      state.showMaskOverlay = el.chkMaskOverlay.checked;
      requestRender();
    });

    el.chkMaskInvert.addEventListener('change', () => {
      const mask = getSelectedMask();
      if (!mask) return;
      mask.invert = el.chkMaskInvert.checked;
      pushHistory();
      requestRender();
    });

    document.getElementById('btn-delete-mask').addEventListener('click', () => {
      const photo = getCurrentPhoto();
      if (!photo) return;
      photo.edits.masks = photo.edits.masks.filter(m => m.id !== photo.edits.selectedMaskId);
      photo.edits.selectedMaskId = photo.edits.masks[0]?.id || null;
      pushHistory();
      updateMaskUI();
      requestRender();
    });

    const brushSizeSlider = document.getElementById('slider-brush-size');
    brushSizeSlider.addEventListener('input', () => {
      state.brushSize = Number(brushSizeSlider.value);
      document.getElementById('val-brush-size').textContent = state.brushSize;
    });

    document.getElementById('btn-brush-paint').addEventListener('click', e => {
      state.brushMode = 'paint';
      e.target.classList.add('active');
      document.getElementById('btn-brush-erase').classList.remove('active');
    });

    document.getElementById('btn-brush-erase').addEventListener('click', e => {
      state.brushMode = 'erase';
      e.target.classList.add('active');
      document.getElementById('btn-brush-paint').classList.remove('active');
    });

    document.getElementById('btn-brush-clear').addEventListener('click', () => {
      const mask = getSelectedMask();
      if (!mask || mask.type !== 'brush') return;
      mask.strokes = [];
      pushHistory();
      requestRender();
    });

    // Save Custom Preset
    document.getElementById('btn-save-preset').addEventListener('click', () => {
      const photo = getCurrentPhoto();
      const input = document.getElementById('input-preset-name');
      const name = input.value.trim();
      if (!photo || !name) return;
      const values = {};
      Object.values(SLIDER_GROUPS).flat().forEach(s => { values[s.key] = photo.edits[s.key]; });
      state.userPresets.push({ name, values });
      localStorage.setItem('pt_user_presets', JSON.stringify(state.userPresets));
      input.value = '';
      renderPresets();
      showStatus(`Saved preset "${name}"`);
    });

    // Export Modal
    document.getElementById('btn-open-export').addEventListener('click', () => {
      el.exportModal.classList.remove('hidden');
    });
    document.getElementById('btn-close-export').addEventListener('click', () => {
      el.exportModal.classList.add('hidden');
    });

    document.querySelectorAll('.format-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        state.exportFormat = pill.dataset.format;
        document.querySelectorAll('.format-pill').forEach(p => p.classList.toggle('active', p === pill));
        document.getElementById('export-quality-row').classList.toggle('hidden', state.exportFormat === 'image/png');
      });
    });

    const qSlider = document.getElementById('slider-export-quality');
    qSlider.addEventListener('input', () => {
      document.getElementById('val-export-quality').textContent = `${qSlider.value}%`;
    });

    document.getElementById('btn-export-zip').addEventListener('click', () => runExport('zip'));
    document.getElementById('btn-export-folder').addEventListener('click', () => runExport('folder'));

    // Keyboard Shortcuts
    window.addEventListener('keydown', e => {
      if (e.target.tagName === 'INPUT' && e.target.type === 'text') return;

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redo();
      } else if (e.key === 'ArrowRight') {
        selectPhoto(state.currentIndex + 1);
      } else if (e.key === 'ArrowLeft') {
        selectPhoto(state.currentIndex - 1);
      } else if (e.key === 'Tab' && !el.workspace.classList.contains('hidden')) {
        e.preventDefault();
        const hideBoth = !el.inspector.classList.contains('collapsed');
        el.inspector.classList.toggle('collapsed', hideBoth);
        el.filmstripWrap.classList.toggle('collapsed', hideBoth);
        setTimeout(requestRender, 180);
      }
    });

    window.addEventListener('resize', requestRender);
  }

  // --- Initialize App ---
  buildSliders();
  renderPresets();
  initEvents();
  runHomeAnimation();
})();

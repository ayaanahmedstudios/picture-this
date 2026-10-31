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

  // Full Lightroom Local Adjustment Sliders for Masks
  const MASK_SLIDERS = [
    { key: 'exposure', label: 'Exposure', min: -100, max: 100, def: 0 },
    { key: 'brightness', label: 'Brightness', min: -100, max: 100, def: 0 },
    { key: 'contrast', label: 'Contrast', min: -100, max: 100, def: 0 },
    { key: 'highlights', label: 'Highlights', min: -100, max: 100, def: 0 },
    { key: 'shadows', label: 'Shadows', min: -100, max: 100, def: 0 },
    { key: 'whites', label: 'Whites', min: -100, max: 100, def: 0 },
    { key: 'blacks', label: 'Blacks', min: -100, max: 100, def: 0 },
    { key: 'temp', label: 'Temperature', min: -100, max: 100, def: 0 },
    { key: 'tint', label: 'Tint', min: -100, max: 100, def: 0 },
    { key: 'vibrance', label: 'Vibrance', min: -100, max: 100, def: 0 },
    { key: 'saturation', label: 'Saturation', min: -100, max: 100, def: 0 },
    { key: 'clarity', label: 'Clarity', min: -100, max: 100, def: 0 }
  ];

  // Categorized Full Preset Library
  const PRESET_CATEGORIES = [
    {
      category: 'Essential & Clean',
      items: [
        { name: 'Neutral', values: {} },
        { name: 'Natural Punch', values: { exposure: 4, contrast: 14, highlights: -14, shadows: 14, vibrance: 16, clarity: 10 } },
        { name: 'Crisp Daylight', values: { exposure: 5, contrast: 18, highlights: -16, whites: 16, blacks: -10, clarity: 20, vibrance: 12 } },
        { name: 'Studio Clean', values: { exposure: 8, brightness: 6, contrast: 10, highlights: -20, shadows: 22, whites: 12, temp: -4, saturation: -4 } },
        { name: 'Architecture', values: { contrast: 24, highlights: -26, shadows: 18, whites: 18, blacks: -14, clarity: 34, temp: -6, saturation: -10 } },
        { name: 'Vivid Pop', values: { contrast: 16, highlights: -12, shadows: 12, whites: 14, vibrance: 34, saturation: 10, clarity: 16 } }
      ]
    },
    {
      category: 'Film & Analog',
      items: [
        { name: 'Portra 400', values: { exposure: 7, contrast: 8, highlights: -18, shadows: 22, temp: 16, tint: 6, vibrance: 18, grain: 14 } },
        { name: 'Kodak Gold 200', values: { exposure: 5, contrast: 14, highlights: -12, shadows: 14, blacks: 8, temp: 26, tint: 4, vibrance: 20, grain: 18 } },
        { name: 'Fuji Velvia 50', values: { contrast: 26, highlights: -14, shadows: -8, blacks: -12, temp: 6, tint: 8, vibrance: 28, saturation: 22 } },
        { name: 'Cinestill 800T', values: { exposure: -4, contrast: 18, highlights: -22, shadows: 10, temp: -28, tint: -8, vibrance: 16, vignette: -20, grain: 22 } },
        { name: 'Superia 400', values: { exposure: 4, contrast: 12, highlights: -16, shadows: 18, blacks: 10, temp: -6, tint: 14, vibrance: 14, grain: 16 } },
        { name: 'Warm Analog', values: { exposure: 6, contrast: 10, highlights: -20, shadows: 18, blacks: 16, temp: 24, saturation: -8, grain: 20 } }
      ]
    },
    {
      category: 'Moody & Editorial',
      items: [
        { name: 'Soft Matte', values: { contrast: -18, highlights: -24, shadows: 28, blacks: 32, saturation: -14, vignette: -15 } },
        { name: 'Moody Teal', values: { exposure: -8, contrast: 20, highlights: -30, shadows: -8, temp: -24, tint: -10, saturation: -18, vignette: -26 } },
        { name: 'Nordic Slate', values: { exposure: -4, contrast: 14, highlights: -26, shadows: 16, blacks: 12, temp: -16, saturation: -32, clarity: 18 } },
        { name: 'Golden Hour', values: { exposure: 6, contrast: 12, highlights: -22, shadows: 24, temp: 34, tint: 10, vibrance: 24, vignette: -14 } },
        { name: 'Faded Editorial', values: { contrast: -10, highlights: -18, shadows: 22, blacks: 26, temp: 10, vibrance: -12, saturation: -18, grain: 12 } },
        { name: 'Deep Cinema', values: { exposure: -10, contrast: 28, highlights: -28, shadows: -12, blacks: -8, temp: -12, vibrance: 10, vignette: -32 } }
      ]
    },
    {
      category: 'Black & White',
      items: [
        { name: 'High Contrast B&W', values: { contrast: 40, highlights: -16, whites: 24, blacks: -28, saturation: -100, clarity: 28, grain: 20 } },
        { name: 'Silver Gelatin', values: { exposure: 5, contrast: 16, highlights: -20, shadows: 14, saturation: -100, vignette: -22, grain: 12 } },
        { name: 'Tri-X 400', values: { contrast: 32, highlights: -12, shadows: -8, whites: 18, blacks: -18, saturation: -100, clarity: 22, grain: 34 } },
        { name: 'Soft Monochrome', values: { exposure: 4, contrast: -8, highlights: -22, shadows: 26, blacks: 20, saturation: -100 } }
      ]
    }
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
    brushFeather: 65,
    hoverCursor: null,
    presetStrength: 100,
    activePresetBase: null,
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

  function createDefaultMask(type, index) {
    const base = {
      id: String(Date.now() + Math.random()),
      type,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} ${index}`,
      invert: false,
      feather: type === 'radial' ? 60 : 50,
      exposure: 0, brightness: 0, contrast: 0, highlights: 0, shadows: 0, whites: 0, blacks: 0,
      temp: 0, tint: 0, vibrance: 0, saturation: 0, clarity: 0
    };
    if (type === 'linear') {
      Object.assign(base, { x1: 0.5, y1: 0.25, x2: 0.5, y2: 0.72 });
    } else if (type === 'radial') {
      Object.assign(base, { cx: 0.5, cy: 0.5, rx: 0.28, ry: 0.28, angle: 0 });
    } else if (type === 'brush') {
      Object.assign(base, { strokes: [] });
    }
    return base;
  }

  function cloneEdits(edits) {
    return JSON.parse(JSON.stringify(edits));
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
    loadingOverlay: document.getElementById('loading-overlay'),
    loadingTitle: document.getElementById('loading-title'),
    loadingCount: document.getElementById('loading-count'),
    loadingBarFill: document.getElementById('loading-bar-fill'),
    loadingFilename: document.getElementById('loading-filename'),
    loadingPercent: document.getElementById('loading-percent'),
    homeScreen: document.getElementById('home-screen'),
    workspace: document.getElementById('workspace'),
    glCanvas: document.getElementById('gl-canvas'),
    overlayCanvas: document.getElementById('overlay-canvas'),
    canvasStage: document.getElementById('canvas-stage'),
    photoCounter: document.getElementById('photo-counter'),
    inputPhotoName: document.getElementById('input-photo-name'),
    fileMeta: document.getElementById('file-meta'),
    queueWrap: document.getElementById('queue-wrap'),
    photoQueue: document.getElementById('photo-queue'),
    inspector: document.getElementById('inspector'),
    statusMsg: document.getElementById('status-msg'),
    btnUndo: document.getElementById('btn-undo'),
    btnRedo: document.getElementById('btn-redo'),
    btnPaste: document.getElementById('btn-paste'),
    maskList: document.getElementById('mask-list'),
    maskControlsWrap: document.getElementById('mask-controls-wrap'),
    geomMaskControls: document.getElementById('geom-mask-controls'),
    brushControls: document.getElementById('brush-controls'),
    chkMaskOverlay: document.getElementById('chk-mask-overlay'),
    chkMaskInvert: document.getElementById('chk-mask-invert'),
    exportModal: document.getElementById('export-modal')
  };

  // --- Kinetic Home Title Animation (Anime.js) ---
  function runHomeAnimation() {
    const titleEl = document.getElementById('hero-title');
    const text = 'Picture This';
    titleEl.innerHTML = text
      .split('')
      .map(ch =>
        ch === ' '
          ? '<span class="char-mask">&nbsp;</span>'
          : `<span class="char-mask"><span class="hero-char">${ch}</span></span>`
      )
      .join('');

    if (!window.anime) return;

    const tl = window.anime.timeline({ easing: 'easeOutQuint' });
    tl.add({
      targets: '.hero-char',
      translateY: ['115%', '0%'],
      duration: 950,
      delay: window.anime.stagger(42, { start: 80 })
    })
      .add(
        {
          targets: '#hero-rule',
          scaleX: [0, 1],
          duration: 750,
          easing: 'easeInOutQuart'
        },
        '-=620'
      )
      .add(
        {
          targets: ['.home-subtitle', '.home-actions', '.btn-text'],
          opacity: [0, 1],
          translateY: [12, 0],
          duration: 650,
          delay: window.anime.stagger(90)
        },
        '-=450'
      );
  }

  // --- Status Helper ---
  let statusTimer = null;
  function showStatus(msg) {
    el.statusMsg.textContent = msg;
    clearTimeout(statusTimer);
    statusTimer = setTimeout(() => {
      el.statusMsg.textContent = '';
    }, 2800);
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

    // Mask Local Sliders (Full 12-Slider Suite)
    const maskContainer = document.getElementById('sliders-mask');
    maskContainer.innerHTML = '';
    MASK_SLIDERS.forEach(s => {
      const row = document.createElement('div');
      row.className = 'slider-row';
      row.innerHTML = `
        <div class="slider-header">
          <span class="slider-label" data-mreset="${s.key}" title="Double-click to reset">${s.label}</span>
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
        updateMaskSlidersUI();
        requestRender();
      });

      input.addEventListener('change', () => pushHistory());
      const resetMaskVal = () => {
        const mask = getSelectedMask();
        if (!mask) return;
        mask[s.key] = 0;
        pushHistory();
        updateMaskSlidersUI();
        requestRender();
      };
      input.addEventListener('dblclick', resetMaskVal);
      label.addEventListener('dblclick', resetMaskVal);
    });
  }

  // --- Brush Mask Offscreen Rasterizer ---
  const brushMaskCanvas = document.createElement('canvas');
  brushMaskCanvas.width = 512;
  brushMaskCanvas.height = 512;
  const brushMaskCtx = brushMaskCanvas.getContext('2d');

  function renderBrushMaskToCanvas(mask) {
    brushMaskCtx.save();
    brushMaskCtx.fillStyle = '#000000';
    brushMaskCtx.fillRect(0, 0, 512, 512);
    brushMaskCtx.lineCap = 'round';
    brushMaskCtx.lineJoin = 'round';

    (mask.strokes || []).forEach(stroke => {
      if (!stroke.points.length) return;
      const radiusPx = ((stroke.size || 60) / 600) * 512;
      const softness = (stroke.feather !== undefined ? stroke.feather : 65) / 100;
      brushMaskCtx.filter = softness > 0.02 ? `blur(${Math.round(radiusPx * softness * 0.45)}px)` : 'none';
      brushMaskCtx.strokeStyle = stroke.mode === 'erase' ? '#000000' : '#ffffff';
      brushMaskCtx.fillStyle = stroke.mode === 'erase' ? '#000000' : '#ffffff';
      brushMaskCtx.lineWidth = radiusPx;

      if (stroke.points.length === 1) {
        brushMaskCtx.beginPath();
        brushMaskCtx.arc(stroke.points[0].x * 512, stroke.points[0].y * 512, radiusPx / 2, 0, Math.PI * 2);
        brushMaskCtx.fill();
      } else {
        brushMaskCtx.beginPath();
        stroke.points.forEach((pt, idx) => {
          const px = pt.x * 512;
          const py = pt.y * 512;
          if (idx === 0) brushMaskCtx.moveTo(px, py);
          else brushMaskCtx.lineTo(px, py);
        });
        brushMaskCtx.stroke();
      }
    });
    brushMaskCtx.restore();
  }

  // --- Multi-Pass WebGL Shader Pipeline (Supports Unlimited Masks + Full Sliders) ---
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
        uniform float u_flipY;
        varying vec2 v_uv;
        varying vec2 v_screenUv;
        void main() {
          v_screenUv = vec2(a_pos.x * 0.5 + 0.5, 0.5 - a_pos.y * 0.5);
          v_uv = u_flipY > 0.5
            ? vec2(a_pos.x * 0.5 + 0.5, 0.5 - a_pos.y * 0.5)
            : vec2(a_pos.x * 0.5 + 0.5, a_pos.y * 0.5 + 0.5);
          gl_Position = vec4(a_pos, 0.0, 1.0);
        }
      `;

      const fsSource = `
        precision highp float;
        varying vec2 v_uv;
        varying vec2 v_screenUv;
        uniform sampler2D u_tex;
        uniform sampler2D u_maskTex;

        uniform int u_passMode; // 0 = base grade, 1 = mask pass, 2 = effects (vignette + grain)

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

        uniform int u_maskType; // 1=linear, 2=radial, 3=brush
        uniform vec4 u_maskGeom; // x1,y1,x2,y2 or cx,cy,rx,ry
        uniform float u_maskFeather;
        uniform float u_maskAngle;
        uniform int u_maskInvert;
        uniform int u_showOverlay;

        float rand(vec2 co) {
          return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
        }

        vec3 applyGrade(vec3 col) {
          col *= pow(2.0, u_exposure * 1.5);
          col += u_brightness * 0.25;
          col.r += u_temp * 0.14;
          col.b -= u_temp * 0.14;
          col.g += u_tint * 0.12;

          float luma = dot(col, vec3(0.299, 0.587, 0.114));
          float shMask = pow(clamp(1.0 - luma, 0.0, 1.0), 1.6);
          float hiMask = pow(clamp(luma, 0.0, 1.0), 1.6);
          col += u_shadows * 0.32 * shMask;
          col += u_highlights * 0.32 * hiMask;

          col += u_blacks * 0.22 * pow(clamp(1.0 - luma, 0.0, 1.0), 2.5);
          col += u_whites * 0.22 * pow(clamp(luma, 0.0, 1.0), 2.5);

          float cFactor = 1.0 + u_contrast * 0.65;
          col = (col - 0.5) * cFactor + 0.5;
          if (abs(u_clarity) > 0.001) {
            float midWeight = 4.0 * luma * (1.0 - luma);
            col = (col - 0.5) * (1.0 + u_clarity * 0.48 * midWeight) + 0.5;
          }

          float newLuma = dot(col, vec3(0.299, 0.587, 0.114));
          float maxC = max(col.r, max(col.g, col.b));
          float minC = min(col.r, min(col.g, col.b));
          float curSat = maxC - minC;
          float vibBoost = u_vibrance * (1.0 - curSat);
          float totalSat = max(0.0, 1.0 + u_saturation + vibBoost);
          col = mix(vec3(newLuma), col, totalSat);

          return clamp(col, 0.0, 1.0);
        }

        void main() {
          vec4 texCol = texture2D(u_tex, v_uv);
          vec3 col = texCol.rgb;

          if (u_passMode == 0) {
            col = applyGrade(col);
          } else if (u_passMode == 1) {
            float w = 0.0;
            if (u_maskType == 1) {
              vec2 a = u_maskGeom.xy;
              vec2 b = u_maskGeom.zw;
              vec2 ab = b - a;
              float len2 = max(0.0001, dot(ab, ab));
              float t = dot(v_screenUv - a, ab) / len2;
              float fSpan = mix(0.08, 0.5, u_maskFeather);
              w = 1.0 - smoothstep(0.5 - fSpan, 0.5 + fSpan, t);
            } else if (u_maskType == 2) {
              vec2 center = u_maskGeom.xy;
              vec2 radii = max(vec2(0.005), u_maskGeom.zw);
              vec2 delta = v_screenUv - center;
              float c = cos(-u_maskAngle);
              float s = sin(-u_maskAngle);
              vec2 rotD = vec2(delta.x * c - delta.y * s, delta.x * s + delta.y * c);
              float dist = length(rotD / radii);
              float inner = clamp(1.0 - u_maskFeather * 0.94, 0.02, 0.98);
              w = 1.0 - smoothstep(inner, 1.0, dist);
            } else if (u_maskType == 3) {
              w = texture2D(u_maskTex, v_screenUv).r;
            }

            if (u_maskInvert == 1) w = 1.0 - w;

            vec3 graded = applyGrade(col);
            col = mix(col, graded, w);

            if (u_showOverlay == 1) {
              col = mix(col, vec3(0.98, 0.28, 0.12), w * 0.48);
            }
          } else if (u_passMode == 2) {
            if (abs(u_vignette) > 0.001) {
              float d = distance(v_screenUv, vec2(0.5, 0.5));
              float vig = smoothstep(0.22, 0.82, d);
              col = clamp(col + u_vignette * vig * 0.65, 0.0, 1.0);
            }
            if (u_grain > 0.001) {
              float n = (rand(v_screenUv * 420.0) - 0.5) * u_grain * 0.22;
              col = clamp(col + n, 0.0, 1.0);
            }
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

    setGradeUniforms(params, L = 1, C = 1, E = 1) {
      const gl = this.gl;
      const setU = (name, val) => gl.uniform1f(gl.getUniformLocation(this.prog, name), val);
      setU('u_exposure', ((params.exposure || 0) / 100) * L);
      setU('u_brightness', ((params.brightness || 0) / 100) * L);
      setU('u_contrast', ((params.contrast || 0) / 100) * L);
      setU('u_highlights', ((params.highlights || 0) / 100) * L);
      setU('u_shadows', ((params.shadows || 0) / 100) * L);
      setU('u_whites', ((params.whites || 0) / 100) * L);
      setU('u_blacks', ((params.blacks || 0) / 100) * L);
      setU('u_temp', ((params.temp || 0) / 100) * C);
      setU('u_tint', ((params.tint || 0) / 100) * C);
      setU('u_vibrance', ((params.vibrance || 0) / 100) * C);
      setU('u_saturation', ((params.saturation || 0) / 100) * C);
      setU('u_clarity', ((params.clarity || 0) / 100) * E);
    }

    render(sourceCanvas, edits, bypass, showOverlay) {
      const gl = this.gl;
      if (!gl) return;

      const w = sourceCanvas.width;
      const h = sourceCanvas.height;
      if (this.canvas.width !== w || this.canvas.height !== h) {
        this.canvas.width = w;
        this.canvas.height = h;
      }

      gl.viewport(0, 0, w, h);
      gl.useProgram(this.prog);

      const L = bypass.light ? 0 : 1;
      const C = bypass.color ? 0 : 1;
      const E = bypass.effects ? 0 : 1;

      // Pass 0: Global Tone & Color Grade
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, sourceCanvas);
      gl.uniform1i(gl.getUniformLocation(this.prog, 'u_tex'), 0);
      gl.uniform1f(gl.getUniformLocation(this.prog, 'u_flipY'), 1.0);
      gl.uniform1i(gl.getUniformLocation(this.prog, 'u_passMode'), 0);
      this.setGradeUniforms(edits, L, C, E);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      // Pass 1..N: Each Local Mask Layer
      const masks = edits.masks || [];
      for (let i = 0; i < masks.length; i++) {
        const m = masks[i];
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.tex);
        gl.copyTexImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 0, 0, w, h, 0);

        gl.uniform1f(gl.getUniformLocation(this.prog, 'u_flipY'), 0.0);
        gl.uniform1i(gl.getUniformLocation(this.prog, 'u_passMode'), 1);

        const typeInt = m.type === 'linear' ? 1 : m.type === 'radial' ? 2 : 3;
        gl.uniform1i(gl.getUniformLocation(this.prog, 'u_maskType'), typeInt);
        gl.uniform1i(gl.getUniformLocation(this.prog, 'u_maskInvert'), m.invert ? 1 : 0);
        gl.uniform1f(gl.getUniformLocation(this.prog, 'u_maskFeather'), (m.feather !== undefined ? m.feather : 55) / 100);
        gl.uniform1f(gl.getUniformLocation(this.prog, 'u_maskAngle'), m.angle || 0);
        gl.uniform1i(
          gl.getUniformLocation(this.prog, 'u_showOverlay'),
          showOverlay && m.id === edits.selectedMaskId ? 1 : 0
        );

        this.setGradeUniforms(m, 1, 1, 1);

        if (m.type === 'linear') {
          gl.uniform4f(gl.getUniformLocation(this.prog, 'u_maskGeom'), m.x1, m.y1, m.x2, m.y2);
        } else if (m.type === 'radial') {
          gl.uniform4f(gl.getUniformLocation(this.prog, 'u_maskGeom'), m.cx, m.cy, m.rx, m.ry);
        } else if (m.type === 'brush') {
          renderBrushMaskToCanvas(m);
          gl.activeTexture(gl.TEXTURE1);
          gl.bindTexture(gl.TEXTURE_2D, this.maskTex);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, brushMaskCanvas);
          gl.uniform1i(gl.getUniformLocation(this.prog, 'u_maskTex'), 1);
        }

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }

      // Final Pass: Vignette & Film Grain
      const vigVal = (edits.vignette / 100) * E;
      const grnVal = (edits.grain / 100) * E;
      if (Math.abs(vigVal) > 0.001 || grnVal > 0.001) {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.tex);
        gl.copyTexImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 0, 0, w, h, 0);

        gl.uniform1f(gl.getUniformLocation(this.prog, 'u_flipY'), 0.0);
        gl.uniform1i(gl.getUniformLocation(this.prog, 'u_passMode'), 2);
        gl.uniform1f(gl.getUniformLocation(this.prog, 'u_vignette'), vigVal);
        gl.uniform1f(gl.getUniformLocation(this.prog, 'u_grain'), grnVal);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
    }
  }

  const glProc = new GLProcessor(el.glCanvas);
  const geomCanvas = document.createElement('canvas');
  const geomCtx = geomCanvas.getContext('2d');

  // Dedicated small WebGL canvas for instant Preset Thumbnail Previews
  const previewGLCanvas = document.createElement('canvas');
  previewGLCanvas.width = 140;
  previewGLCanvas.height = 92;
  const previewProc = new GLProcessor(previewGLCanvas);

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

    geomCtx.translate(-crop.x * baseW, -crop.y * baseH);
    geomCtx.translate(baseW / 2, baseH / 2);

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

  // --- On-Demand Render Loop ---
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

  // --- 2D Overlay for Crop, Lightroom Radial/Linear/Brush Handles & Split Wipe ---
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
      ctx.arc(splitX, h / 2, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0e0e0e';
      ctx.font = '600 10px Switzer, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('↔', splitX, h / 2);
    }

    // Crop Overlay
    if (state.activeMode === 'crop') {
      const c = edits.crop;
      const cx = c.x * w;
      const cy = c.y * h;
      const cw = c.w * w;
      const ch = c.h * h;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
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

      // 4 Corners + 4 Edge Bars
      ctx.fillStyle = '#ffffff';
      const hs = 8;
      [
        [cx, cy],
        [cx + cw - hs, cy],
        [cx, cy + ch - hs],
        [cx + cw - hs, cy + ch - hs],
        [cx + cw / 2 - hs / 2, cy],
        [cx + cw / 2 - hs / 2, cy + ch - hs],
        [cx, cy + ch / 2 - hs / 2],
        [cx + cw - hs, cy + ch / 2 - hs / 2]
      ].forEach(([hx, hy]) => ctx.fillRect(hx, hy, hs, hs));
    }

    // Mask Handles (Lightroom Style)
    if (state.activeMode === 'mask') {
      const mask = getSelectedMask();
      if (!mask) return;

      if (mask.type === 'linear') {
        const x1 = mask.x1 * w, y1 = mask.y1 * h;
        const x2 = mask.x2 * w, y2 = mask.y2 * h;
        const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
        const dx = x2 - x1, dy = y2 - y1;
        const len = Math.hypot(dx, dy) || 1;
        const nx = -dy / len, ny = dx / len;
        const span = Math.max(w, h) * 0.85;

        ctx.save();
        // Perpendicular boundary lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
        ctx.lineWidth = 1.25;
        ctx.beginPath();
        ctx.moveTo(x1 - nx * span, y1 - ny * span);
        ctx.lineTo(x1 + nx * span, y1 + ny * span);
        ctx.moveTo(x2 - nx * span, y2 - ny * span);
        ctx.lineTo(x2 + nx * span, y2 + ny * span);
        ctx.stroke();

        // Center spine
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.restore();

        // Start, Center (Move), and End Pins
        drawPin(ctx, x1, y1, '#ffffff', 6);
        drawPin(ctx, x2, y2, '#ffffff', 6);
        drawPin(ctx, mx, my, '#f97316', 7);
      } else if (mask.type === 'radial') {
        const cx = mask.cx * w, cy = mask.cy * h;
        const rx = mask.rx * w, ry = mask.ry * h;
        const angle = mask.angle || 0;
        const innerScale = Math.max(0.05, 1 - ((mask.feather !== undefined ? mask.feather : 60) / 100) * 0.9);

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle);

        // Outer ellipse
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Feather inner boundary ring
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.42)';
        ctx.setLineDash([4, 4]);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(0, 0, rx * innerScale, ry * innerScale, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Rotation stem at top
        ctx.beginPath();
        ctx.moveTo(0, -ry);
        ctx.lineTo(0, -ry - 18);
        ctx.stroke();

        // 4 Perimeter Resize Handles + Top Rotate Handle + Center Pin
        drawPin(ctx, 0, 0, '#f97316', 7);
        drawPin(ctx, rx, 0, '#ffffff', 5.5);
        drawPin(ctx, -rx, 0, '#ffffff', 5.5);
        drawPin(ctx, 0, ry, '#ffffff', 5.5);
        drawPin(ctx, 0, -ry, '#ffffff', 5.5);
        drawPin(ctx, 0, -ry - 18, '#f97316', 5);
        ctx.restore();
      } else if (mask.type === 'brush' && state.hoverCursor) {
        const bx = state.hoverCursor.x * w;
        const by = state.hoverCursor.y * h;
        const r = ((state.brushSize / 600) * w) / 2;
        const innerR = r * Math.max(0.1, 1 - state.brushFeather / 100);

        ctx.save();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.25;
        ctx.beginPath();
        ctx.arc(bx, by, r, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(255,255,255,0.45)';
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.arc(bx, by, innerR, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
    }
  }

  function drawPin(ctx, x, y, fill, radius) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#0e0e0e';
    ctx.stroke();
  }

  // --- Hit Testing & Dynamic Cursors on Overlay Canvas ---
  function getNormPointer(e) {
    const rect = el.overlayCanvas.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)),
      y: Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height)),
      w: rect.width,
      h: rect.height
    };
  }

  function detectCropHandle(pt, c) {
    const tolX = 14 / pt.w;
    const tolY = 14 / pt.h;
    const nearL = Math.abs(pt.x - c.x) < tolX;
    const nearR = Math.abs(pt.x - (c.x + c.w)) < tolX;
    const nearT = Math.abs(pt.y - c.y) < tolY;
    const nearB = Math.abs(pt.y - (c.y + c.h)) < tolY;
    const inX = pt.x >= c.x && pt.x <= c.x + c.w;
    const inY = pt.y >= c.y && pt.y <= c.y + c.h;

    if (nearL && nearT) return 'nw';
    if (nearR && nearT) return 'ne';
    if (nearL && nearB) return 'sw';
    if (nearR && nearB) return 'se';
    if (nearT && inX) return 'n';
    if (nearB && inX) return 's';
    if (nearL && inY) return 'w';
    if (nearR && inY) return 'e';
    if (inX && inY) return 'move';
    return 'new';
  }

  function detectRadialHandle(pt, mask) {
    const dx = (pt.x - mask.cx) * pt.w;
    const dy = (pt.y - mask.cy) * pt.h;
    const angle = mask.angle || 0;
    const cos = Math.cos(-angle);
    const sin = Math.sin(-angle);
    const lx = dx * cos - dy * sin;
    const ly = dx * sin + dy * cos;

    const rxPx = mask.rx * pt.w;
    const ryPx = mask.ry * pt.h;

    if (Math.hypot(lx, ly) < 16) return 'radial-center';
    if (Math.hypot(lx, ly - (-ryPx - 18)) < 14) return 'radial-rotate';
    if (Math.hypot(lx - rxPx, ly) < 14 || Math.hypot(lx + rxPx, ly) < 14) return 'radial-rx';
    if (Math.hypot(lx, ly - ryPx) < 14 || Math.hypot(lx, ly + ryPx) < 14) return 'radial-ry';
    const normDist = Math.hypot(lx / Math.max(1, rxPx), ly / Math.max(1, ryPx));
    if (normDist < 1.0) return 'radial-move-inside';
    return null;
  }

  function updateCanvasCursor(pt) {
    const photo = getCurrentPhoto();
    if (!photo) {
      el.overlayCanvas.style.cursor = 'default';
      return;
    }

    if (state.splitWipe && Math.abs(pt.x - state.splitPos) * pt.w < 18) {
      el.overlayCanvas.style.cursor = 'ew-resize';
      return;
    }

    if (state.activeMode === 'crop') {
      const h = detectCropHandle(pt, photo.edits.crop);
      const map = {
        nw: 'nwse-resize',
        se: 'nwse-resize',
        ne: 'nesw-resize',
        sw: 'nesw-resize',
        n: 'ns-resize',
        s: 'ns-resize',
        e: 'ew-resize',
        w: 'ew-resize',
        move: 'move',
        new: 'crosshair'
      };
      el.overlayCanvas.style.cursor = map[h] || 'crosshair';
      return;
    }

    if (state.activeMode === 'mask') {
      const mask = getSelectedMask();
      if (!mask) {
        el.overlayCanvas.style.cursor = 'default';
        return;
      }
      if (mask.type === 'brush') {
        el.overlayCanvas.style.cursor = 'crosshair';
        return;
      }
      if (mask.type === 'linear') {
        const mx = (mask.x1 + mask.x2) / 2;
        const my = (mask.y1 + mask.y2) / 2;
        const dm = Math.hypot((pt.x - mx) * pt.w, (pt.y - my) * pt.h);
        const d1 = Math.hypot((pt.x - mask.x1) * pt.w, (pt.y - mask.y1) * pt.h);
        const d2 = Math.hypot((pt.x - mask.x2) * pt.w, (pt.y - mask.y2) * pt.h);
        if (dm < 16) el.overlayCanvas.style.cursor = 'move';
        else if (d1 < 16 || d2 < 16) el.overlayCanvas.style.cursor = 'grab';
        else el.overlayCanvas.style.cursor = 'crosshair';
        return;
      }
      if (mask.type === 'radial') {
        const rh = detectRadialHandle(pt, mask);
        if (rh === 'radial-center' || rh === 'radial-move-inside') el.overlayCanvas.style.cursor = 'move';
        else if (rh === 'radial-rotate') el.overlayCanvas.style.cursor = 'grab';
        else if (rh === 'radial-rx') el.overlayCanvas.style.cursor = 'ew-resize';
        else if (rh === 'radial-ry') el.overlayCanvas.style.cursor = 'ns-resize';
        else el.overlayCanvas.style.cursor = 'crosshair';
        return;
      }
    }

    el.overlayCanvas.style.cursor = 'default';
  }

  el.overlayCanvas.addEventListener('pointerdown', e => {
    const photo = getCurrentPhoto();
    if (!photo) return;
    el.overlayCanvas.setPointerCapture(e.pointerId);
    const pt = getNormPointer(e);

    if (state.splitWipe && Math.abs(pt.x - state.splitPos) * pt.w < 18) {
      state.interaction = { type: 'split' };
      return;
    }

    if (state.activeMode === 'crop') {
      const c = photo.edits.crop;
      const handle = detectCropHandle(pt, c);
      if (handle === 'new') {
        c.x = pt.x;
        c.y = pt.y;
        c.w = 0.05;
        c.h = 0.05;
        c.ratio = 'free';
        state.interaction = {
          type: 'crop',
          handle: 'se',
          startX: pt.x,
          startY: pt.y,
          orig: { ...c }
        };
      } else {
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

    if (state.activeMode === 'mask') {
      const mask = getSelectedMask();
      if (!mask) return;

      if (mask.type === 'linear') {
        const mx = (mask.x1 + mask.x2) / 2;
        const my = (mask.y1 + mask.y2) / 2;
        const dm = Math.hypot((pt.x - mx) * pt.w, (pt.y - my) * pt.h);
        const d1 = Math.hypot((pt.x - mask.x1) * pt.w, (pt.y - mask.y1) * pt.h);
        const d2 = Math.hypot((pt.x - mask.x2) * pt.w, (pt.y - mask.y2) * pt.h);
        if (dm < 18) {
          state.interaction = {
            type: 'linear-move',
            startX: pt.x,
            startY: pt.y,
            orig: { x1: mask.x1, y1: mask.y1, x2: mask.x2, y2: mask.y2 }
          };
        } else if (d1 < 18) state.interaction = { type: 'linear-p1' };
        else if (d2 < 18) state.interaction = { type: 'linear-p2' };
        else {
          // Draw a fresh linear gradient line where user drags
          mask.x1 = pt.x;
          mask.y1 = pt.y;
          mask.x2 = pt.x;
          mask.y2 = Math.min(1, pt.y + 0.02);
          state.interaction = { type: 'linear-p2' };
        }
      } else if (mask.type === 'radial') {
        const rh = detectRadialHandle(pt, mask);
        if (rh === 'radial-center' || rh === 'radial-move-inside') {
          state.interaction = {
            type: 'radial-move',
            startX: pt.x,
            startY: pt.y,
            origCx: mask.cx,
            origCy: mask.cy
          };
        } else if (rh === 'radial-rotate' || rh === 'radial-rx' || rh === 'radial-ry') {
          state.interaction = { type: rh };
        } else {
          // Click and drag anywhere outside to draw a new radial ellipse on the spot
          mask.cx = pt.x;
          mask.cy = pt.y;
          mask.rx = 0.02;
          mask.ry = 0.02;
          state.interaction = { type: 'radial-draw', startX: pt.x, startY: pt.y };
        }
      } else if (mask.type === 'brush') {
        const stroke = {
          mode: state.brushMode,
          size: state.brushSize,
          feather: state.brushFeather,
          points: [{ x: pt.x, y: pt.y }]
        };
        mask.strokes.push(stroke);
        state.interaction = { type: 'brush', stroke };
        requestRender();
      }
    }
  });

  el.overlayCanvas.addEventListener('pointermove', e => {
    const pt = getNormPointer(e);
    state.hoverCursor = pt;

    if (!state.interaction) {
      updateCanvasCursor(pt);
      if (state.activeMode === 'mask' && getSelectedMask()?.type === 'brush') {
        requestRender();
      }
      return;
    }

    const photo = getCurrentPhoto();
    if (!photo) return;
    const act = state.interaction;

    if (act.type === 'split') {
      state.splitPos = Math.max(0.04, Math.min(0.96, pt.x));
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
          const nx = Math.max(0, Math.min(o.x + o.w - 0.06, o.x + dx));
          c.w = o.w + (o.x - nx);
          c.x = nx;
        }
        if (act.handle.includes('e')) {
          c.w = Math.max(0.06, Math.min(1 - o.x, o.w + dx));
        }
        if (act.handle.includes('n')) {
          const ny = Math.max(0, Math.min(o.y + o.h - 0.06, o.y + dy));
          c.h = o.h + (o.y - ny);
          c.y = ny;
        }
        if (act.handle.includes('s')) {
          c.h = Math.max(0.06, Math.min(1 - o.y, o.h + dy));
        }
      }
      requestRender();
      return;
    }

    const mask = getSelectedMask();
    if (!mask) return;

    if (act.type === 'linear-p1') {
      mask.x1 = pt.x;
      mask.y1 = pt.y;
    } else if (act.type === 'linear-p2') {
      mask.x2 = pt.x;
      mask.y2 = pt.y;
    } else if (act.type === 'linear-move') {
      const dx = pt.x - act.startX;
      const dy = pt.y - act.startY;
      mask.x1 = Math.max(0, Math.min(1, act.orig.x1 + dx));
      mask.y1 = Math.max(0, Math.min(1, act.orig.y1 + dy));
      mask.x2 = Math.max(0, Math.min(1, act.orig.x2 + dx));
      mask.y2 = Math.max(0, Math.min(1, act.orig.y2 + dy));
    } else if (act.type === 'radial-move') {
      mask.cx = Math.max(0, Math.min(1, act.origCx + (pt.x - act.startX)));
      mask.cy = Math.max(0, Math.min(1, act.origCy + (pt.y - act.startY)));
    } else if (act.type === 'radial-rotate') {
      const dx = (pt.x - mask.cx) * pt.w;
      const dy = (pt.y - mask.cy) * pt.h;
      mask.angle = Math.atan2(dy, dx) + Math.PI / 2;
    } else if (act.type === 'radial-rx' || act.type === 'radial-ry') {
      const dx = (pt.x - mask.cx) * pt.w;
      const dy = (pt.y - mask.cy) * pt.h;
      const angle = mask.angle || 0;
      const cos = Math.cos(-angle);
      const sin = Math.sin(-angle);
      const lx = dx * cos - dy * sin;
      const ly = dx * sin + dy * cos;
      if (act.type === 'radial-rx') mask.rx = Math.max(0.03, Math.abs(lx) / pt.w);
      if (act.type === 'radial-ry') mask.ry = Math.max(0.03, Math.abs(ly) / pt.h);
    } else if (act.type === 'radial-draw') {
      mask.rx = Math.max(0.04, Math.abs(pt.x - act.startX));
      mask.ry = Math.max(0.04, Math.abs(pt.y - act.startY));
    } else if (act.type === 'brush') {
      act.stroke.points.push({ x: pt.x, y: pt.y });
    }
    requestRender();
  });

  el.overlayCanvas.addEventListener('pointerleave', () => {
    state.hoverCursor = null;
    if (state.activeMode === 'mask' && getSelectedMask()?.type === 'brush') {
      requestRender();
    }
  });

  el.overlayCanvas.addEventListener('pointerup', () => {
    if (state.interaction) {
      if (state.interaction.type !== 'split') pushHistory();
      state.interaction = null;
    }
  });

  // --- Fast Parallel-Batch Folder & File Ingestion with Visual Loading Sequence ---
  async function decodeSinglePhoto(file) {
    const bitmap = await createImageBitmap(file);
    const origW = bitmap.width;
    const origH = bitmap.height;

    const maxProxy = 1440;
    const scale = Math.min(1, maxProxy / Math.max(origW, origH));
    const proxyCanvas = document.createElement('canvas');
    proxyCanvas.width = Math.max(1, Math.round(origW * scale));
    proxyCanvas.height = Math.max(1, Math.round(origH * scale));
    proxyCanvas.getContext('2d').drawImage(bitmap, 0, 0, proxyCanvas.width, proxyCanvas.height);

    const thumbCanvas = document.createElement('canvas');
    const tScale = Math.min(1, 150 / Math.max(origW, origH));
    thumbCanvas.width = Math.max(1, Math.round(origW * tScale));
    thumbCanvas.height = Math.max(1, Math.round(origH * tScale));
    thumbCanvas.getContext('2d').drawImage(bitmap, 0, 0, thumbCanvas.width, thumbCanvas.height);
    const thumbUrl = thumbCanvas.toDataURL('image/jpeg', 0.72);
    bitmap.close();

    const initialEdits = createDefaultEdits();
    return {
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()),
      name: file.name.replace(/\.[^/.]+$/, ''),
      origName: file.name,
      file,
      width: origW,
      height: origH,
      proxy: proxyCanvas,
      thumbUrl,
      edits: initialEdits,
      history: [cloneEdits(initialEdits)],
      historyIndex: 0
    };
  }

  async function loadFiles(fileList) {
    const validFiles = Array.from(fileList).filter(
      f =>
        !f.name.startsWith('.') &&
        (f.type.startsWith('image/') || /\.(jpe?g|png|webp|avif|bmp|gif)$/i.test(f.name))
    );
    if (!validFiles.length) return;

    const total = validFiles.length;
    el.loadingOverlay.classList.remove('hidden');
    el.loadingTitle.textContent = total === 1 ? 'Loading Photograph' : 'Importing Photographs';
    el.loadingCount.textContent = `0 / ${total}`;
    el.loadingBarFill.style.width = '0%';
    el.loadingPercent.textContent = '0%';
    el.loadingFilename.textContent = validFiles[0].name;

    // Yield once so browser paints the loading sequence immediately
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

    let loadedCount = 0;
    const BATCH_SIZE = 4; // Parallel decode 4 images at a time for fast multi-core speed

    for (let i = 0; i < total; i += BATCH_SIZE) {
      const batch = validFiles.slice(i, i + BATCH_SIZE);
      el.loadingFilename.textContent = batch[0].name;

      const results = await Promise.all(
        batch.map(file =>
          decodeSinglePhoto(file).catch(err => {
            console.warn('Skipped file:', file.name, err);
            return null;
          })
        )
      );

      results.forEach(item => {
        if (item) state.photos.push(item);
      });

      loadedCount = Math.min(total, i + batch.length);
      const pct = Math.round((loadedCount / total) * 100);
      el.loadingCount.textContent = `${loadedCount} / ${total}`;
      el.loadingBarFill.style.width = `${pct}%`;
      el.loadingPercent.textContent = `${pct}%`;

      // Yield to main thread so progress bar animates smoothly
      await new Promise(r => setTimeout(r, 8));
    }

    el.loadingOverlay.classList.add('hidden');

    if (state.photos.length > 0) {
      el.homeScreen.classList.add('hidden');
      el.workspace.classList.remove('hidden');
      if (state.currentIndex === -1) {
        selectPhoto(0);
      } else {
        renderQueue();
        updateHeaderMeta();
      }
      showStatus(`Imported ${validFiles.length} photograph(s)`);
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
          reader.readEntries(
            entries => {
              if (!entries.length) resolve();
              else {
                allEntries.push(...entries);
                readBatch().then(resolve);
              }
            },
            () => resolve()
          );
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
    el.loadingOverlay.classList.remove('hidden');
    el.loadingTitle.textContent = 'Downloading Sample Photographs';
    el.loadingCount.textContent = `0 / ${urls.length}`;
    el.loadingBarFill.style.width = '10%';
    el.loadingFilename.textContent = 'Connecting...';

    const files = [];
    for (let i = 0; i < urls.length; i++) {
      const item = urls[i];
      el.loadingFilename.textContent = `${item.name}.jpg`;
      const res = await fetch(item.url);
      const blob = await res.blob();
      files.push(new File([blob], `${item.name}.jpg`, { type: 'image/jpeg' }));
      const pct = Math.round(((i + 1) / urls.length) * 100);
      el.loadingCount.textContent = `${i + 1} / ${urls.length}`;
      el.loadingBarFill.style.width = `${pct}%`;
      el.loadingPercent.textContent = `${pct}%`;
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
    state.activePresetBase = null;
    const photo = getCurrentPhoto();
    updateSliderUI(photo.edits);
    updateMaskUI();
    updateHistoryButtons();
    renderQueue();
    updateHeaderMeta();
    requestRender();
    if (state.activeMode === 'presets') {
      updatePresetThumbnails();
    }
  }

  function pushHistory() {
    const photo = getCurrentPhoto();
    if (!photo) return;
    photo.history = photo.history.slice(0, photo.historyIndex + 1);
    photo.history.push(cloneEdits(photo.edits));
    if (photo.history.length > 35) photo.history.shift();
    photo.historyIndex = photo.history.length - 1;
    updateHistoryButtons();
    renderQueue();
  }

  function undo() {
    const photo = getCurrentPhoto();
    if (!photo || photo.historyIndex <= 0) return;
    photo.historyIndex--;
    photo.edits = cloneEdits(photo.history[photo.historyIndex]);
    updateSliderUI(photo.edits);
    updateMaskUI();
    updateHistoryButtons();
    renderQueue();
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
    renderQueue();
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
    if (photo) {
      el.inputPhotoName.value = photo.name;
      el.fileMeta.textContent = `${Math.round(photo.width)} × ${Math.round(photo.height)} px`;
    } else {
      el.inputPhotoName.value = '';
      el.fileMeta.textContent = '';
    }
  }

  function updateSliderUI(edits) {
    Object.values(SLIDER_GROUPS)
      .flat()
      .forEach(s => {
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

  function renderQueue() {
    el.photoQueue.innerHTML = '';
    state.photos.forEach((p, idx) => {
      const item = document.createElement('div');
      item.className = `thumb-item${idx === state.currentIndex ? ' active' : ''}`;
      item.title = p.name;
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
      el.photoQueue.appendChild(item);
    });
  }

  // --- Mask Management ---
  function addMask(type) {
    const photo = getCurrentPhoto();
    if (!photo) return;
    const mask = createDefaultMask(type, photo.edits.masks.length + 1);
    photo.edits.masks.push(mask);
    photo.edits.selectedMaskId = mask.id;
    pushHistory();
    updateMaskUI();
    requestRender();
  }

  function updateMaskSlidersUI() {
    const mask = getSelectedMask();
    if (!mask) return;
    MASK_SLIDERS.forEach(s => {
      const input = document.getElementById(`mslider-${s.key}`);
      const val = document.getElementById(`mval-${s.key}`);
      const label = document.querySelector(`[data-mreset="${s.key}"]`);
      if (input && val) {
        const v = mask[s.key] || 0;
        input.value = v;
        val.textContent = v > 0 ? `+${v}` : v;
        if (label) label.classList.toggle('modified', v !== 0);
      }
    });
  }

  function updateMaskUI() {
    const photo = getCurrentPhoto();
    if (!photo) return;

    el.maskList.innerHTML = '';
    photo.edits.masks.forEach(m => {
      const div = document.createElement('div');
      div.className = `mask-item${m.id === photo.edits.selectedMaskId ? ' active' : ''}`;
      div.innerHTML = `<span>${m.name}</span><span class="mask-item-meta">${m.type}</span>`;
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
    el.geomMaskControls.classList.toggle('hidden', mask.type === 'brush');
    el.brushControls.classList.toggle('hidden', mask.type !== 'brush');

    const featherSlider = document.getElementById('slider-mask-feather');
    const featherVal = document.getElementById('val-mask-feather');
    if (featherSlider && featherVal) {
      const f = mask.feather !== undefined ? mask.feather : 55;
      featherSlider.value = f;
      featherVal.textContent = f;
    }

    updateMaskSlidersUI();
  }

  // --- Presets Library + Live Visual Previews ---
  function renderPresetsStructure() {
    const wrap = document.getElementById('preset-categories-wrap');
    wrap.innerHTML = '';

    PRESET_CATEGORIES.forEach(cat => {
      const sec = document.createElement('div');
      sec.className = 'panel-section';
      sec.innerHTML = `<div class="section-label">${cat.category}</div>`;

      const grid = document.createElement('div');
      grid.className = 'preset-cards-grid';

      cat.items.forEach(p => {
        const btn = document.createElement('button');
        btn.className = 'preset-card';
        btn.dataset.presetName = p.name;
        btn.innerHTML = `
          <img class="preset-thumb" alt="${p.name}" />
          <span class="preset-card-title">${p.name}</span>
        `;
        btn.addEventListener('click', () => {
          document.querySelectorAll('.preset-card').forEach(c => c.classList.toggle('active', c === btn));
          applyPresetValues(p.values, p.name);
        });
        grid.appendChild(btn);
      });

      sec.appendChild(grid);
      wrap.appendChild(sec);
    });

    renderUserPresets();
  }

  function renderUserPresets() {
    const userGrid = document.getElementById('user-preset-list');
    userGrid.innerHTML = '';
    state.userPresets.forEach((p, idx) => {
      const btn = document.createElement('button');
      btn.className = 'preset-card';
      btn.dataset.userPresetIdx = idx;
      btn.title = 'Click to apply, Shift+Click to delete';
      btn.innerHTML = `
        <img class="preset-thumb" alt="${p.name}" />
        <span class="preset-card-title">${p.name}</span>
      `;
      btn.addEventListener('click', e => {
        if (e.shiftKey) {
          state.userPresets.splice(idx, 1);
          localStorage.setItem('pt_user_presets', JSON.stringify(state.userPresets));
          renderUserPresets();
          updatePresetThumbnails();
          return;
        }
        applyPresetValues(p.values, p.name);
      });
      userGrid.appendChild(btn);
    });
  }

  function updatePresetThumbnails() {
    const photo = getCurrentPhoto();
    if (!photo) return;

    const smallSource = document.createElement('canvas');
    smallSource.width = 140;
    smallSource.height = 92;
    const sCtx = smallSource.getContext('2d');

    // Center-crop cover draw into 140x92
    const imgRatio = photo.proxy.width / photo.proxy.height;
    const targetRatio = 140 / 92;
    let sw = photo.proxy.width, sh = photo.proxy.height, sx = 0, sy = 0;
    if (imgRatio > targetRatio) {
      sw = photo.proxy.height * targetRatio;
      sx = (photo.proxy.width - sw) / 2;
    } else {
      sh = photo.proxy.width / targetRatio;
      sy = (photo.proxy.height - sh) / 2;
    }
    sCtx.drawImage(photo.proxy, sx, sy, sw, sh, 0, 0, 140, 92);

    const allBuiltIn = PRESET_CATEGORIES.flatMap(c => c.items);
    document.querySelectorAll('#preset-categories-wrap .preset-card').forEach(card => {
      const found = allBuiltIn.find(p => p.name === card.dataset.presetName);
      if (!found) return;
      const tempEdits = { ...createDefaultEdits(), ...found.values };
      previewProc.render(smallSource, tempEdits, { light: false, color: false, effects: false }, false);
      const imgEl = card.querySelector('.preset-thumb');
      if (imgEl) imgEl.src = previewGLCanvas.toDataURL('image/jpeg', 0.72);
    });

    document.querySelectorAll('#user-preset-list .preset-card').forEach(card => {
      const p = state.userPresets[Number(card.dataset.userPresetIdx)];
      if (!p) return;
      const tempEdits = { ...createDefaultEdits(), ...p.values };
      previewProc.render(smallSource, tempEdits, { light: false, color: false, effects: false }, false);
      const imgEl = card.querySelector('.preset-thumb');
      if (imgEl) imgEl.src = previewGLCanvas.toDataURL('image/jpeg', 0.72);
    });
  }

  function applyPresetValues(values, name) {
    const photo = getCurrentPhoto();
    if (!photo) return;
    state.activePresetBase = { ...values };
    const strength = state.presetStrength / 100;
    const def = createDefaultEdits();
    Object.values(SLIDER_GROUPS)
      .flat()
      .forEach(s => {
        const targetVal = values[s.key] !== undefined ? values[s.key] : def[s.key];
        photo.edits[s.key] = Math.round(targetVal * strength);
      });
    pushHistory();
    updateSliderUI(photo.edits);
    requestRender();
    showStatus(`Applied preset: ${name}`);
  }

  // --- Crop Ratio Helper ---
  function applyAspectRatioToCurrentPhoto(rw, rh, labelRatio) {
    const photo = getCurrentPhoto();
    if (!photo) return;
    const swapped = Math.abs(photo.edits.rotateStep % 180) === 90;
    const imgW = swapped ? photo.height : photo.width;
    const imgH = swapped ? photo.width : photo.height;
    const imgAspect = imgW / imgH;
    const targetAspect = rw / rh;

    let w = 1, h = 1;
    if (targetAspect > imgAspect) {
      h = imgAspect / targetAspect;
    } else {
      w = targetAspect / imgAspect;
    }
    photo.edits.crop = { x: (1 - w) / 2, y: (1 - h) / 2, w, h, ratio: labelRatio };
    pushHistory();
    updateSliderUI(photo.edits);
    requestRender();
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

    glProc.render(outCanvas, photo.edits, { light: false, color: false, effects: false }, false);

    const blob = await new Promise(resolve => el.glCanvas.toBlob(resolve, mimeType, quality));
    requestRender();
    return blob;
  }

  function buildExportFilename(photo, index, ext) {
    const mode = document.getElementById('export-naming-mode').value;
    if (mode === 'sequence') {
      const base = (document.getElementById('export-base-name').value || 'photo').trim();
      const startNum = Math.max(1, Number(document.getElementById('export-seq-start').value) || 1);
      const padded = String(startNum + index).padStart(3, '0');
      return `${base}_${padded}.${ext}`;
    }
    const prefix = document.getElementById('export-prefix').value.trim();
    const suffix = document.getElementById('export-suffix').value.trim();
    const cleanName = (photo.name || 'photo').trim();
    return `${prefix}${cleanName}${suffix}.${ext}`;
  }

  async function runExport(mode) {
    const scope = document.getElementById('export-scope').value;
    const targets = scope === 'current' ? [getCurrentPhoto()].filter(Boolean) : state.photos;
    if (!targets.length) return;

    const mime = state.exportFormat;
    const ext = mime === 'image/webp' ? 'webp' : mime === 'image/jpeg' ? 'jpg' : 'png';
    const quality = Number(document.getElementById('slider-export-quality').value) / 100;
    const maxEdge = Number(document.getElementById('export-resize').value);

    const progWrap = document.getElementById('export-progress-wrap');
    const progBar = document.getElementById('export-progress-bar');
    const progText = document.getElementById('export-progress-text');

    progWrap.classList.remove('hidden');

    if (mode === 'folder' && window.showDirectoryPicker) {
      try {
        const dirHandle = await window.showDirectoryPicker();
        for (let i = 0; i < targets.length; i++) {
          const p = targets[i];
          const outName = buildExportFilename(p, i, ext);
          progText.textContent = `Saving ${i + 1} of ${targets.length}: ${outName}`;
          progBar.style.width = `${Math.round(((i + 1) / targets.length) * 100)}%`;
          const blob = await renderFullResBlob(p, mime, quality, maxEdge);
          const fileHandle = await dirHandle.getFileHandle(outName, { create: true });
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

    if (targets.length === 1) {
      const p = targets[0];
      const outName = buildExportFilename(p, 0, ext);
      progText.textContent = `Rendering ${outName}...`;
      progBar.style.width = '100%';
      const blob = await renderFullResBlob(p, mime, quality, maxEdge);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = outName;
      a.click();
      URL.revokeObjectURL(url);
      progWrap.classList.add('hidden');
      el.exportModal.classList.add('hidden');
      showStatus(`Exported ${outName}`);
      return;
    }

    const zipEntries = {};
    for (let i = 0; i < targets.length; i++) {
      const p = targets[i];
      const outName = buildExportFilename(p, i, ext);
      progText.textContent = `Encoding ${i + 1} / ${targets.length}: ${outName}`;
      progBar.style.width = `${Math.round(((i + 1) / targets.length) * 100)}%`;
      const blob = await renderFullResBlob(p, mime, quality, maxEdge);
      const buf = new Uint8Array(await blob.arrayBuffer());
      zipEntries[outName] = buf;
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
    showStatus(`Exported ${targets.length} photographs (.zip)`);
  }

  // --- Wire UI Events ---
  function initEvents() {
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

    // Inline Photo Renaming
    el.inputPhotoName.addEventListener('change', () => {
      const photo = getCurrentPhoto();
      if (!photo) return;
      const val = el.inputPhotoName.value.trim();
      if (val) {
        photo.name = val;
        renderQueue();
        showStatus(`Renamed to "${val}"`);
      } else {
        el.inputPhotoName.value = photo.name;
      }
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
        if (state.activeMode === 'presets') {
          updatePresetThumbnails();
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
        SLIDER_GROUPS[sec].forEach(s => {
          photo.edits[s.key] = s.def;
        });
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
      renderQueue();
      showStatus(`Synced settings across all ${state.photos.length} photographs`);
    });

    // Stage Utility Buttons
    document.getElementById('btn-toggle-queue').addEventListener('click', () => {
      el.queueWrap.classList.toggle('collapsed');
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
    holdBtn.addEventListener('pointerdown', () => {
      state.compareHold = true;
      requestRender();
    });
    window.addEventListener('pointerup', () => {
      if (state.compareHold) {
        state.compareHold = false;
        requestRender();
      }
    });

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

    // Crop & Custom Ratio
    document.querySelectorAll('.ratio-btn[data-ratio]').forEach(btn => {
      btn.addEventListener('click', () => {
        const photo = getCurrentPhoto();
        if (!photo) return;
        const ratio = btn.dataset.ratio;

        if (ratio === 'free' || ratio === 'original') {
          photo.edits.crop = { x: 0, y: 0, w: 1, h: 1, ratio };
          pushHistory();
          updateSliderUI(photo.edits);
          requestRender();
        } else if (ratio === 'custom') {
          const cw = Math.max(1, Number(document.getElementById('crop-custom-w').value) || 1);
          const ch = Math.max(1, Number(document.getElementById('crop-custom-h').value) || 1);
          applyAspectRatioToCurrentPhoto(cw, ch, 'custom');
        } else {
          const [rw, rh] = ratio.split(':').map(Number);
          applyAspectRatioToCurrentPhoto(rw, rh, ratio);
        }
      });
    });

    document.getElementById('btn-apply-custom-crop').addEventListener('click', () => {
      const cw = Math.max(1, Number(document.getElementById('crop-custom-w').value) || 1);
      const ch = Math.max(1, Number(document.getElementById('crop-custom-h').value) || 1);
      applyAspectRatioToCurrentPhoto(cw, ch, 'custom');
      showStatus(`Applied ${cw}:${ch} custom crop`);
    });

    document.getElementById('btn-swap-ratio').addEventListener('click', () => {
      const photo = getCurrentPhoto();
      if (!photo) return;
      const wInput = document.getElementById('crop-custom-w');
      const hInput = document.getElementById('crop-custom-h');
      const temp = wInput.value;
      wInput.value = hInput.value;
      hInput.value = temp;

      const c = photo.edits.crop;
      const swapped = Math.abs(photo.edits.rotateStep % 180) === 90;
      const imgW = swapped ? photo.height : photo.width;
      const imgH = swapped ? photo.width : photo.height;
      const actualCropW = c.w * imgW;
      const actualCropH = c.h * imgH;
      applyAspectRatioToCurrentPhoto(actualCropH, actualCropW, c.ratio);
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
    const resetFineRot = () => {
      const photo = getCurrentPhoto();
      if (!photo) return;
      photo.edits.rotateFine = 0;
      pushHistory();
      updateSliderUI(photo.edits);
      requestRender();
    };
    rotFine.addEventListener('dblclick', resetFineRot);
    document.getElementById('label-rotate-fine').addEventListener('dblclick', resetFineRot);

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

    const maskFeatherSlider = document.getElementById('slider-mask-feather');
    maskFeatherSlider.addEventListener('input', () => {
      const mask = getSelectedMask();
      if (!mask) return;
      mask.feather = Number(maskFeatherSlider.value);
      document.getElementById('val-mask-feather').textContent = mask.feather;
      requestRender();
    });
    maskFeatherSlider.addEventListener('change', pushHistory);

    document.getElementById('btn-reset-mask').addEventListener('click', () => {
      const mask = getSelectedMask();
      if (!mask) return;
      MASK_SLIDERS.forEach(s => {
        mask[s.key] = 0;
      });
      pushHistory();
      updateMaskSlidersUI();
      requestRender();
    });

    document.getElementById('btn-delete-mask').addEventListener('click', () => {
      const photo = getCurrentPhoto();
      if (!photo) return;
      photo.edits.masks = photo.edits.masks.filter(m => m.id !== photo.edits.selectedMaskId);
      photo.edits.selectedMaskId = photo.edits.masks[photo.edits.masks.length - 1]?.id || null;
      pushHistory();
      updateMaskUI();
      requestRender();
    });

    const brushSizeSlider = document.getElementById('slider-brush-size');
    brushSizeSlider.addEventListener('input', () => {
      state.brushSize = Number(brushSizeSlider.value);
      document.getElementById('val-brush-size').textContent = state.brushSize;
    });

    const brushFeatherSlider = document.getElementById('slider-brush-feather');
    brushFeatherSlider.addEventListener('input', () => {
      state.brushFeather = Number(brushFeatherSlider.value);
      document.getElementById('val-brush-feather').textContent = state.brushFeather;
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

    // Preset Intensity & Custom Preset Saving
    const strengthSlider = document.getElementById('slider-preset-strength');
    strengthSlider.addEventListener('input', () => {
      state.presetStrength = Number(strengthSlider.value);
      document.getElementById('val-preset-strength').textContent = `${state.presetStrength}%`;
      const photo = getCurrentPhoto();
      if (!photo || !state.activePresetBase) return;
      const factor = state.presetStrength / 100;
      const def = createDefaultEdits();
      Object.values(SLIDER_GROUPS)
        .flat()
        .forEach(s => {
          const baseV = state.activePresetBase[s.key] !== undefined ? state.activePresetBase[s.key] : def[s.key];
          photo.edits[s.key] = Math.max(s.min, Math.min(s.max, Math.round(baseV * factor)));
        });
      updateSliderUI(photo.edits);
      requestRender();
    });
    strengthSlider.addEventListener('change', pushHistory);

    document.getElementById('btn-save-preset').addEventListener('click', () => {
      const photo = getCurrentPhoto();
      const input = document.getElementById('input-preset-name');
      const name = input.value.trim();
      if (!photo || !name) return;
      const values = {};
      Object.values(SLIDER_GROUPS)
        .flat()
        .forEach(s => {
          values[s.key] = photo.edits[s.key];
        });
      state.userPresets.push({ name, values });
      localStorage.setItem('pt_user_presets', JSON.stringify(state.userPresets));
      input.value = '';
      renderUserPresets();
      updatePresetThumbnails();
      showStatus(`Saved preset "${name}"`);
    });

    // Export Modal & Naming Scheme Toggle
    document.getElementById('btn-open-export').addEventListener('click', () => {
      el.exportModal.classList.remove('hidden');
    });
    document.getElementById('btn-close-export').addEventListener('click', () => {
      el.exportModal.classList.add('hidden');
    });

    document.getElementById('export-naming-mode').addEventListener('change', e => {
      const isSeq = e.target.value === 'sequence';
      document.getElementById('naming-original-group').classList.toggle('hidden', isSeq);
      document.getElementById('naming-sequence-group').classList.toggle('hidden', !isSeq);
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
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redo();
      } else if (e.key.toLowerCase() === 'o' && state.activeMode === 'mask') {
        state.showMaskOverlay = !state.showMaskOverlay;
        el.chkMaskOverlay.checked = state.showMaskOverlay;
        requestRender();
      } else if (e.key === 'ArrowRight') {
        selectPhoto(state.currentIndex + 1);
      } else if (e.key === 'ArrowLeft') {
        selectPhoto(state.currentIndex - 1);
      } else if (e.key === 'Tab' && !el.workspace.classList.contains('hidden')) {
        e.preventDefault();
        const hideBoth = !el.inspector.classList.contains('collapsed');
        el.inspector.classList.toggle('collapsed', hideBoth);
        el.queueWrap.classList.toggle('collapsed', hideBoth);
        setTimeout(requestRender, 180);
      }
    });

    window.addEventListener('resize', requestRender);
  }

  // --- Initialize App ---
  buildSliders();
  renderPresetsStructure();
  initEvents();
  runHomeAnimation();
})();

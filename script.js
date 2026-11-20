(() => {
  'use strict';

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

  const state = {
    photos: [],
    currentIndex: -1,
    activeMode: 'adjust',
    mobileMode: 'light',
    mobileParamKey: {
      light: 'exposure',
      color: 'temp',
      effects: 'clarity',
      crop: 'straighten',
      mask: 'exposure'
    },
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
    activePresetName: 'Neutral',
    exportFormat: 'image/webp',
    userPresets: JSON.parse(localStorage.getItem('pt_user_presets') || '[]'),
    interaction: null,
    gestureTwist: null
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
      feather: type === 'radial' ? 68 : 62,
      exposure: 0, brightness: 0, contrast: 0, highlights: 0, shadows: 0, whites: 0, blacks: 0,
      temp: 0, tint: 0, vibrance: 0, saturation: 0, clarity: 0
    };
    if (type === 'linear') {
      Object.assign(base, { x1: 0.5, y1: 0.22, x2: 0.5, y2: 0.76 });
    } else if (type === 'radial') {
      Object.assign(base, { cx: 0.5, cy: 0.5, rx: 0.3, ry: 0.3, angle: 0 });
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
    twistHud: document.getElementById('twist-hud'),
    photoCounter: document.getElementById('photo-counter'),
    inputPhotoName: document.getElementById('input-photo-name'),
    mobileInputPhotoName: document.getElementById('mobile-input-photo-name'),
    fileMeta: document.getElementById('file-meta'),
    mobileFileMeta: document.getElementById('mobile-file-meta'),
    queueWrap: document.getElementById('queue-wrap'),
    photoQueue: document.getElementById('photo-queue'),
    inspector: document.getElementById('inspector'),
    statusMsg: document.getElementById('status-msg'),
    btnUndo: document.getElementById('btn-undo'),
    btnRedo: document.getElementById('btn-redo'),
    btnPaste: document.getElementById('btn-paste'),
    mBtnPaste: document.getElementById('m-btn-paste'),
    maskList: document.getElementById('mask-list'),
    maskControlsWrap: document.getElementById('mask-controls-wrap'),
    geomMaskControls: document.getElementById('geom-mask-controls'),
    brushControls: document.getElementById('brush-controls'),
    chkMaskOverlay: document.getElementById('chk-mask-overlay'),
    chkMaskInvert: document.getElementById('chk-mask-invert'),
    exportModal: document.getElementById('export-modal'),
    mobileContextualArea: document.getElementById('mobile-contextual-area'),
    mobileActionSheet: document.getElementById('mobile-action-sheet')
  };

  function runHomeAnimation() {
    const titleEl = document.getElementById('hero-title');
    const words = ['Picture', 'This'];
    titleEl.innerHTML = words
      .map(word => {
        const chars = word
          .split('')
          .map(ch => `<span class="hero-char">${ch}</span>`)
          .join('');
        return `<span class="hero-word">${chars}</span>`;
      })
      .join('');

    const shutterWrap = document.getElementById('hero-shutter-wrap');
    const triggerShutterPulse = () => {
      if (!window.anime) return;
      window.anime({
        targets: '#shutter-blades',
        rotate: '+=55',
        scale: [1, 0.88, 1],
        duration: 620,
        easing: 'easeOutElastic(1, .65)'
      });
    };
    shutterWrap.addEventListener('pointerenter', triggerShutterPulse);
    shutterWrap.addEventListener('pointerdown', triggerShutterPulse);

    if (!window.anime) return;

    const tl = window.anime.timeline({ easing: 'easeOutQuint' });
    tl.add({
      targets: '#hero-shutter-wrap',
      scale: [0.55, 1],
      opacity: [0, 1],
      duration: 720
    })
      .add(
        {
          targets: '#shutter-blades',
          rotate: [-72, 0],
          duration: 950,
          easing: 'easeOutExpo'
        },
        '-=720'
      )
      .add(
        {
          targets: '.hero-char',
          translateY: ['115%', '0%'],
          opacity: [0, 1],
          duration: 820,
          delay: window.anime.stagger(36)
        },
        '-=720'
      )
      .add(
        {
          targets: ['.home-actions', '.btn-text'],
          opacity: [0, 1],
          translateY: [10, 0],
          duration: 580,
          delay: window.anime.stagger(75)
        },
        '-=450'
      );

    window.anime({
      targets: '#shutter-blades',
      rotate: [0, 360],
      duration: 28000,
      loop: true,
      easing: 'linear'
    });
  }

  let statusTimer = null;
  function showStatus(msg) {
    el.statusMsg.textContent = msg;
    clearTimeout(statusTimer);
    statusTimer = setTimeout(() => {
      el.statusMsg.textContent = '';
    }, 2800);
  }

  let twistHudTimer = null;
  function showTwistHud(deg) {
    el.twistHud.textContent = `${deg >= 0 ? '+' : ''}${deg.toFixed(1)}°`;
    el.twistHud.classList.remove('hidden');
    clearTimeout(twistHudTimer);
    twistHudTimer = setTimeout(() => {
      el.twistHud.classList.add('hidden');
    }, 900);
  }

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
          renderMobileControls();
          requestRender();
        });

        input.addEventListener('change', () => pushHistory());

        const resetFn = () => {
          const photo = getCurrentPhoto();
          if (!photo) return;
          photo.edits[s.key] = s.def;
          pushHistory();
          updateSliderUI(photo.edits);
          renderMobileControls();
          requestRender();
        };
        input.addEventListener('dblclick', resetFn);
        label.addEventListener('dblclick', resetFn);
      });
    });

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
        renderMobileControls();
        requestRender();
      });

      input.addEventListener('change', () => pushHistory());
      const resetMaskVal = () => {
        const mask = getSelectedMask();
        if (!mask) return;
        mask[s.key] = 0;
        pushHistory();
        updateMaskSlidersUI();
        renderMobileControls();
        requestRender();
      };
      input.addEventListener('dblclick', resetMaskVal);
      label.addEventListener('dblclick', resetMaskVal);
    });
  }

  const brushMaskCanvas = document.createElement('canvas');
  brushMaskCanvas.width = 1024;
  brushMaskCanvas.height = 1024;
  const brushMaskCtx = brushMaskCanvas.getContext('2d');

  function drawSoftBrushDab(ctx, x, y, radius, softness, isErase) {
    const innerR = radius * Math.max(0.02, 1 - softness * 0.92);
    const grad = ctx.createRadialGradient(x, y, innerR * 0.5, x, y, radius);
    const alpha = softness > 0.05 ? 0.55 : 0.92;
    if (isErase) {
      grad.addColorStop(0, `rgba(0,0,0,${alpha})`);
      grad.addColorStop(0.65, `rgba(0,0,0,${alpha * 0.45})`);
      grad.addColorStop(1, 'rgba(0,0,0,0)');
    } else {
      grad.addColorStop(0, `rgba(255,255,255,${alpha})`);
      grad.addColorStop(0.65, `rgba(255,255,255,${alpha * 0.45})`);
      grad.addColorStop(1, 'rgba(255,255,255,0)');
    }
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  function renderBrushMaskToCanvas(mask) {
    const size = 1024;
    brushMaskCtx.save();
    brushMaskCtx.globalCompositeOperation = 'source-over';
    brushMaskCtx.fillStyle = '#000000';
    brushMaskCtx.fillRect(0, 0, size, size);

    (mask.strokes || []).forEach(stroke => {
      if (!stroke.points.length) return;
      const radiusPx = Math.max(4, (((stroke.size || 60) / 600) * size) / 2);
      const softness = (stroke.feather !== undefined ? stroke.feather : 65) / 100;
      const isErase = stroke.mode === 'erase';
      const stepDist = Math.max(1.5, radiusPx * 0.18);

      const pts = stroke.points;
      drawSoftBrushDab(brushMaskCtx, pts[0].x * size, pts[0].y * size, radiusPx, softness, isErase);

      for (let i = 1; i < pts.length; i++) {
        const x0 = pts[i - 1].x * size;
        const y0 = pts[i - 1].y * size;
        const x1 = pts[i].x * size;
        const y1 = pts[i].y * size;
        const dist = Math.hypot(x1 - x0, y1 - y0);
        const steps = Math.max(1, Math.floor(dist / stepDist));
        for (let s = 1; s <= steps; s++) {
          const t = s / steps;
          drawSoftBrushDab(brushMaskCtx, x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, radiusPx, softness, isErase);
        }
      }
    });
    brushMaskCtx.restore();
  }

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

        uniform int u_passMode;
        uniform int u_isLocalMask;
        uniform float u_aspect;

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

        uniform int u_maskType;
        uniform vec4 u_maskGeom;
        uniform float u_maskFeather;
        uniform float u_maskAngle;
        uniform int u_maskInvert;
        uniform int u_showOverlay;

        float rand(vec2 co) {
          return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
        }

        float gaussianFalloff(float t) {
          float c = clamp(t, 0.0, 1.0);
          return c * c * c * (c * (c * 6.0 - 15.0) + 10.0);
        }

        vec3 applyGrade(vec3 col) {
          float scale = u_isLocalMask == 1 ? 0.78 : 1.0;

          float expStops = u_exposure * 1.35 * scale;
          vec3 exposed = col * pow(2.0, expStops);
          col = exposed / (1.0 + max(vec3(0.0), exposed - 0.85) * 0.35);

          float luma = dot(col, vec3(0.2126, 0.7152, 0.0722));
          float midBell = 4.0 * luma * (1.0 - luma);
          col += u_brightness * 0.22 * scale * (0.45 + 0.55 * midBell);

          float tShift = u_temp * 0.11 * scale;
          float tintShift = u_tint * 0.095 * scale;
          col.r += tShift * (0.65 + 0.35 * midBell);
          col.b -= tShift * (0.65 + 0.35 * midBell);
          col.g += tintShift * (0.65 + 0.35 * midBell);
          col.r -= tintShift * 0.32 * midBell;
          col.b -= tintShift * 0.32 * midBell;

          luma = dot(clamp(col, 0.0, 1.0), vec3(0.2126, 0.7152, 0.0722));
          float shMask = smoothstep(0.65, 0.0, luma);
          float hiMask = smoothstep(0.35, 1.0, luma);
          col += u_shadows * 0.28 * scale * shMask * shMask;
          col += u_highlights * 0.28 * scale * hiMask * hiMask;

          float blkMask = smoothstep(0.35, 0.0, luma);
          float whtMask = smoothstep(0.65, 1.0, luma);
          col += u_blacks * 0.19 * scale * blkMask * blkMask;
          col += u_whites * 0.19 * scale * whtMask * whtMask;

          float cFactor = 1.0 + u_contrast * 0.58 * scale;
          vec3 pivoted = (col - 0.5) * cFactor + 0.5;
          col = mix(col, pivoted, 0.85);

          if (abs(u_clarity) > 0.001) {
            float clarWeight = pow(max(0.0, 4.0 * luma * (1.0 - luma)), 1.25);
            col = (col - 0.5) * (1.0 + u_clarity * 0.44 * scale * clarWeight) + 0.5;
          }

          col = clamp(col, 0.0, 1.0);
          float newLuma = dot(col, vec3(0.2126, 0.7152, 0.0722));
          float maxC = max(col.r, max(col.g, col.b));
          float minC = min(col.r, min(col.g, col.b));
          float curSat = maxC - minC;
          float vibBoost = u_vibrance * scale * (1.0 - curSat) * (1.0 - smoothstep(0.75, 1.0, newLuma) * 0.4);
          float totalSat = max(0.0, 1.0 + u_saturation * scale + vibBoost);
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
              vec2 a = vec2(u_maskGeom.x * u_aspect, u_maskGeom.y);
              vec2 b = vec2(u_maskGeom.z * u_aspect, u_maskGeom.w);
              vec2 p = vec2(v_screenUv.x * u_aspect, v_screenUv.y);
              vec2 ab = b - a;
              float len2 = max(0.0001, dot(ab, ab));
              float t = dot(p - a, ab) / len2;
              float fSpan = mix(0.06, 0.65, u_maskFeather);
              float raw = 1.0 - clamp((t - (0.5 - fSpan)) / max(0.001, 2.0 * fSpan), 0.0, 1.0);
              w = gaussianFalloff(raw);
            } else if (u_maskType == 2) {
              vec2 center = u_maskGeom.xy;
              vec2 radii = max(vec2(0.005), u_maskGeom.zw);
              vec2 delta = vec2((v_screenUv.x - center.x) * u_aspect, v_screenUv.y - center.y);
              float c = cos(-u_maskAngle);
              float s = sin(-u_maskAngle);
              vec2 rotD = vec2(delta.x * c - delta.y * s, delta.x * s + delta.y * c);
              vec2 scaledRadii = vec2(radii.x * u_aspect, radii.y);
              float dist = length(rotD / scaledRadii);
              float inner = clamp(1.0 - u_maskFeather * 0.96, 0.0, 0.96);
              float raw = 1.0 - clamp((dist - inner) / max(0.001, 1.0 - inner), 0.0, 1.0);
              w = gaussianFalloff(raw);
            } else if (u_maskType == 3) {
              float raw = texture2D(u_maskTex, v_screenUv).r;
              w = gaussianFalloff(raw);
            }

            if (u_maskInvert == 1) w = 1.0 - w;

            vec3 graded = applyGrade(col);
            col = mix(col, graded, w);

            if (u_showOverlay == 1) {
              vec3 rubyTint = vec3(1.0, 0.34, 0.12);
              col = mix(col, rubyTint, w * 0.42);
            }
          } else if (u_passMode == 2) {
            if (abs(u_vignette) > 0.001) {
              vec2 centered = (v_screenUv - 0.5) * vec2(min(u_aspect, 1.35), 1.0);
              float d = length(centered);
              float vig = gaussianFalloff(clamp((d - 0.24) / 0.58, 0.0, 1.0));
              col = clamp(col + u_vignette * vig * 0.62, 0.0, 1.0);
            }
            if (u_grain > 0.001) {
              float n = (rand(v_screenUv * 480.0) - 0.5) * u_grain * 0.2;
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
      gl.uniform1f(gl.getUniformLocation(this.prog, 'u_aspect'), w / Math.max(1, h));

      const L = bypass.light ? 0 : 1;
      const C = bypass.color ? 0 : 1;
      const E = bypass.effects ? 0 : 1;

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, sourceCanvas);
      gl.uniform1i(gl.getUniformLocation(this.prog, 'u_tex'), 0);
      gl.uniform1f(gl.getUniformLocation(this.prog, 'u_flipY'), 1.0);
      gl.uniform1i(gl.getUniformLocation(this.prog, 'u_passMode'), 0);
      gl.uniform1i(gl.getUniformLocation(this.prog, 'u_isLocalMask'), 0);
      this.setGradeUniforms(edits, L, C, E);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      const masks = edits.masks || [];
      for (let i = 0; i < masks.length; i++) {
        const m = masks[i];
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.tex);
        gl.copyTexImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 0, 0, w, h, 0);

        gl.uniform1f(gl.getUniformLocation(this.prog, 'u_flipY'), 0.0);
        gl.uniform1i(gl.getUniformLocation(this.prog, 'u_passMode'), 1);
        gl.uniform1i(gl.getUniformLocation(this.prog, 'u_isLocalMask'), 1);

        const typeInt = m.type === 'linear' ? 1 : m.type === 'radial' ? 2 : 3;
        gl.uniform1i(gl.getUniformLocation(this.prog, 'u_maskType'), typeInt);
        gl.uniform1i(gl.getUniformLocation(this.prog, 'u_maskInvert'), m.invert ? 1 : 0);
        gl.uniform1f(gl.getUniformLocation(this.prog, 'u_maskFeather'), (m.feather !== undefined ? m.feather : 62) / 100);
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

  const previewGLCanvas = document.createElement('canvas');
  previewGLCanvas.width = 140;
  previewGLCanvas.height = 92;
  const previewProc = new GLProcessor(previewGLCanvas);

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

  let renderPending = false;
  function requestRender() {
    if (renderPending) return;
    renderPending = true;
    requestAnimationFrame(() => {
      renderPending = false;
      renderViewport();
    });
  }

  function isMobileLayout() {
    return window.innerWidth <= 820;
  }

  function isMaskModeActive() {
    return isMobileLayout() ? state.mobileMode === 'mask' : state.activeMode === 'mask';
  }

  function isCropModeActive() {
    return isMobileLayout() ? state.mobileMode === 'crop' : state.activeMode === 'crop';
  }

  function renderViewport() {
    const photo = getCurrentPhoto();
    if (!photo) return;

    const inCropMode = isCropModeActive();
    const srcCanvas = buildTransformedSource(photo.proxy, photo.edits, inCropMode);

    const stageRect = el.canvasStage.getBoundingClientRect();
    const padX = isMobileLayout() ? 20 : 32;
    const padY = isMobileLayout() ? 52 : 32;
    const availW = Math.max(120, stageRect.width - padX);
    const availH = Math.max(120, stageRect.height - padY);
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
        isMaskModeActive() && state.showMaskOverlay
      );
    }

    drawOverlay(dispW, dispH, srcCanvas, photo.edits);
  }

  function drawOverlay(w, h, srcCanvas, edits) {
    const ctx = el.overlayCanvas.getContext('2d');
    ctx.clearRect(0, 0, w, h);

    if (state.splitWipe) {
      const splitX = Math.round(w * state.splitPos);
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, splitX, h);
      ctx.clip();
      ctx.drawImage(srcCanvas, 0, 0, w, h);
      ctx.restore();

      ctx.strokeStyle = '#ff6a00';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(splitX, 0);
      ctx.lineTo(splitX, h);
      ctx.stroke();

      ctx.fillStyle = '#ff6a00';
      ctx.beginPath();
      ctx.arc(splitX, h / 2, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0b0b0c';
      ctx.font = '700 11px General Sans, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('↔', splitX, h / 2);
    }

    if (isCropModeActive()) {
      const c = edits.crop;
      const cx = c.x * w;
      const cy = c.y * h;
      const cw = c.w * w;
      const ch = c.h * h;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.62)';
      ctx.fillRect(0, 0, w, cy);
      ctx.fillRect(0, cy + ch, w, h - (cy + ch));
      ctx.fillRect(0, cy, cx, ch);
      ctx.fillRect(cx + cw, cy, w - (cx + cw), ch);

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(cx, cy, cw, ch);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx + cw / 3, cy); ctx.lineTo(cx + cw / 3, cy + ch);
      ctx.moveTo(cx + (cw * 2) / 3, cy); ctx.lineTo(cx + (cw * 2) / 3, cy + ch);
      ctx.moveTo(cx, cy + ch / 3); ctx.lineTo(cx + cw, cy + ch / 3);
      ctx.moveTo(cx, cy + (ch * 2) / 3); ctx.lineTo(cx + cw, cy + (ch * 2) / 3);
      ctx.stroke();

      ctx.fillStyle = '#ff6a00';
      const hs = isMobileLayout() ? 11 : 8;
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

    if (isMaskModeActive()) {
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
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
        ctx.lineWidth = 1.25;
        ctx.beginPath();
        ctx.moveTo(x1 - nx * span, y1 - ny * span);
        ctx.lineTo(x1 + nx * span, y1 + ny * span);
        ctx.moveTo(x2 - nx * span, y2 - ny * span);
        ctx.lineTo(x2 + nx * span, y2 + ny * span);
        ctx.stroke();

        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.restore();

        const rPin = isMobileLayout() ? 8 : 6;
        drawPin(ctx, x1, y1, '#ffffff', rPin);
        drawPin(ctx, x2, y2, '#ffffff', rPin);
        drawPin(ctx, mx, my, '#ff6a00', rPin + 1.5);
      } else if (mask.type === 'radial') {
        const cx = mask.cx * w, cy = mask.cy * h;
        const rx = mask.rx * w, ry = mask.ry * h;
        const angle = mask.angle || 0;
        const innerScale = Math.max(0.05, 1 - ((mask.feather !== undefined ? mask.feather : 68) / 100) * 0.9);

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle);

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.42)';
        ctx.setLineDash([4, 4]);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(0, 0, rx * innerScale, ry * innerScale, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.beginPath();
        ctx.moveTo(0, -ry);
        ctx.lineTo(0, -ry - 20);
        ctx.stroke();

        const rPin = isMobileLayout() ? 7 : 5.5;
        drawPin(ctx, 0, 0, '#ff6a00', rPin + 1.5);
        drawPin(ctx, rx, 0, '#ffffff', rPin);
        drawPin(ctx, -rx, 0, '#ffffff', rPin);
        drawPin(ctx, 0, ry, '#ffffff', rPin);
        drawPin(ctx, 0, -ry, '#ffffff', rPin);
        drawPin(ctx, 0, -ry - 20, '#ff6a00', rPin);
        ctx.restore();
      } else if (mask.type === 'brush' && state.hoverCursor) {
        const bx = state.hoverCursor.x * w;
        const by = state.hoverCursor.y * h;
        const r = ((state.brushSize / 600) * w) / 2;
        const innerR = r * Math.max(0.1, 1 - state.brushFeather / 100);

        ctx.save();
        ctx.strokeStyle = '#ff6a00';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(bx, by, r, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(255,255,255,0.5)';
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
    ctx.strokeStyle = '#0b0b0c';
    ctx.stroke();
  }

  function applyTwistDelta(deltaRad) {
    const photo = getCurrentPhoto();
    if (!photo) return;
    const degDelta = (deltaRad * 180) / Math.PI;

    if (isMaskModeActive()) {
      const mask = getSelectedMask();
      if (mask && mask.type === 'radial') {
        mask.angle = (mask.angle || 0) + deltaRad;
        const normDeg = (((mask.angle * 180) / Math.PI) % 360 + 360) % 360;
        showTwistHud(normDeg);
        requestRender();
        return;
      }
      if (mask && mask.type === 'linear') {
        const mx = (mask.x1 + mask.x2) / 2;
        const my = (mask.y1 + mask.y2) / 2;
        const cos = Math.cos(deltaRad);
        const sin = Math.sin(deltaRad);
        const rotPt = (px, py) => ({
          x: Math.max(0, Math.min(1, mx + (px - mx) * cos - (py - my) * sin)),
          y: Math.max(0, Math.min(1, my + (px - mx) * sin + (py - my) * cos))
        });
        const p1 = rotPt(mask.x1, mask.y1);
        const p2 = rotPt(mask.x2, mask.y2);
        mask.x1 = p1.x;
        mask.y1 = p1.y;
        mask.x2 = p2.x;
        mask.y2 = p2.y;
        const lineDeg = (Math.atan2(mask.y2 - mask.y1, mask.x2 - mask.x1) * 180) / Math.PI;
        showTwistHud(lineDeg);
        requestRender();
        return;
      }
    }

    photo.edits.rotateFine = Math.max(
      -45,
      Math.min(45, Number((photo.edits.rotateFine + degDelta).toFixed(1)))
    );
    updateSliderUI(photo.edits);
    if (isMobileLayout() && state.mobileMode === 'crop') {
      renderMobileControls();
    }
    showTwistHud(photo.edits.rotateFine);
    requestRender();
  }

  function getTouchAngle(t1, t2) {
    return Math.atan2(t2.clientY - t1.clientY, t2.clientX - t1.clientX);
  }

  window.addEventListener(
    'touchstart',
    e => {
      if (el.workspace.classList.contains('hidden')) return;
      if (e.touches.length === 2) {
        const t0 = e.touches[0].target;
        const t1 = e.touches[1].target;
        if (el.canvasStage.contains(t0) || el.canvasStage.contains(t1)) {
          state.interaction = null;
          state.gestureTwist = {
            lastAngle: getTouchAngle(e.touches[0], e.touches[1]),
            moved: false
          };
        }
      } else if (e.touches.length < 2 && state.gestureTwist) {
        if (state.gestureTwist.moved) pushHistory();
        state.gestureTwist = null;
      }
    },
    { passive: true }
  );

  window.addEventListener(
    'touchmove',
    e => {
      if (e.touches.length === 2 && state.gestureTwist) {
        if (e.cancelable) e.preventDefault();
        const curAngle = getTouchAngle(e.touches[0], e.touches[1]);
        let diff = curAngle - state.gestureTwist.lastAngle;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        if (Math.abs(diff) > 0.002) {
          state.gestureTwist.lastAngle = curAngle;
          state.gestureTwist.moved = true;
          applyTwistDelta(diff);
        }
      }
    },
    { passive: false }
  );

  window.addEventListener('touchend', e => {
    if (state.gestureTwist && e.touches.length < 2) {
      if (state.gestureTwist.moved) pushHistory();
      state.gestureTwist = null;
    }
  });

  window.addEventListener('touchcancel', () => {
    if (state.gestureTwist) {
      if (state.gestureTwist.moved) pushHistory();
      state.gestureTwist = null;
    }
  });

  let lastGestureRot = 0;
  el.canvasStage.addEventListener('gesturestart', e => {
    e.preventDefault();
    lastGestureRot = e.rotation || 0;
  });
  el.canvasStage.addEventListener('gesturechange', e => {
    e.preventDefault();
    const curRot = e.rotation || 0;
    const deltaDeg = curRot - lastGestureRot;
    lastGestureRot = curRot;
    applyTwistDelta((deltaDeg * Math.PI) / 180);
  });
  el.canvasStage.addEventListener('gestureend', e => {
    e.preventDefault();
    pushHistory();
  });

  let wheelPushTimer = null;
  el.canvasStage.addEventListener(
    'wheel',
    e => {
      const canTwist = e.altKey || e.shiftKey || isCropModeActive() || isMaskModeActive();
      if (!canTwist) return;
      e.preventDefault();
      const rawDelta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      const gain = e.ctrlKey || e.metaKey ? 0.25 : 0.14;
      applyTwistDelta((rawDelta * gain * Math.PI) / 180);
      clearTimeout(wheelPushTimer);
      wheelPushTimer = setTimeout(() => pushHistory(), 260);
    },
    { passive: false }
  );

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
    const tol = isMobileLayout() ? 22 : 14;
    const tolX = tol / pt.w;
    const tolY = tol / pt.h;
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
    const hitTol = isMobileLayout() ? 22 : 15;
    const dx = (pt.x - mask.cx) * pt.w;
    const dy = (pt.y - mask.cy) * pt.h;
    const angle = mask.angle || 0;
    const cos = Math.cos(-angle);
    const sin = Math.sin(-angle);
    const lx = dx * cos - dy * sin;
    const ly = dx * sin + dy * cos;

    const rxPx = mask.rx * pt.w;
    const ryPx = mask.ry * pt.h;

    if (Math.hypot(lx, ly) < hitTol) return 'radial-center';
    if (Math.hypot(lx, ly - (-ryPx - 20)) < hitTol) return 'radial-rotate';
    if (Math.hypot(lx - rxPx, ly) < hitTol || Math.hypot(lx + rxPx, ly) < hitTol) return 'radial-rx';
    if (Math.hypot(lx, ly - ryPx) < hitTol || Math.hypot(lx, ly + ryPx) < hitTol) return 'radial-ry';
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

    if (isCropModeActive()) {
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

    if (isMaskModeActive()) {
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
    if (state.gestureTwist) return;
    const photo = getCurrentPhoto();
    if (!photo) return;
    try {
      el.overlayCanvas.setPointerCapture(e.pointerId);
    } catch (_) {}
    const pt = getNormPointer(e);

    if (state.splitWipe && Math.abs(pt.x - state.splitPos) * pt.w < 22) {
      state.interaction = { type: 'split' };
      return;
    }

    if (isCropModeActive()) {
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

    if (isMaskModeActive()) {
      const mask = getSelectedMask();
      if (!mask) return;
      const hitTol = isMobileLayout() ? 24 : 18;

      if (mask.type === 'linear') {
        const mx = (mask.x1 + mask.x2) / 2;
        const my = (mask.y1 + mask.y2) / 2;
        const dm = Math.hypot((pt.x - mx) * pt.w, (pt.y - my) * pt.h);
        const d1 = Math.hypot((pt.x - mask.x1) * pt.w, (pt.y - mask.y1) * pt.h);
        const d2 = Math.hypot((pt.x - mask.x2) * pt.w, (pt.y - mask.y2) * pt.h);
        if (dm < hitTol) {
          state.interaction = {
            type: 'linear-move',
            startX: pt.x,
            startY: pt.y,
            orig: { x1: mask.x1, y1: mask.y1, x2: mask.x2, y2: mask.y2 }
          };
        } else if (d1 < hitTol) state.interaction = { type: 'linear-p1' };
        else if (d2 < hitTol) state.interaction = { type: 'linear-p2' };
        else {
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
    if (state.gestureTwist) {
      state.interaction = null;
      return;
    }
    const pt = getNormPointer(e);
    state.hoverCursor = pt;

    if (!state.interaction) {
      updateCanvasCursor(pt);
      if (isMaskModeActive() && getSelectedMask()?.type === 'brush') {
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
    if (isMaskModeActive() && getSelectedMask()?.type === 'brush') {
      requestRender();
    }
  });

  const finishPointerInteraction = () => {
    if (state.interaction) {
      if (state.interaction.type !== 'split') pushHistory();
      state.interaction = null;
    }
  };
  el.overlayCanvas.addEventListener('pointerup', finishPointerInteraction);
  el.overlayCanvas.addEventListener('pointercancel', finishPointerInteraction);

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

    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

    let loadedCount = 0;
    const BATCH_SIZE = 4;

    for (let i = 0; i < total; i += BATCH_SIZE) {
      const batch = validFiles.slice(i, i + BATCH_SIZE);
      el.loadingFilename.textContent = batch[0].name;

      const results = await Promise.all(
        batch.map(file =>
          decodeSinglePhoto(file).catch(() => null)
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
        renderMobileControls();
      }
      showStatus(`Imported ${validFiles.length} photograph(s)`);
    }
  }

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

  async function loadSamplePhotos() {
    const urls = [
      { name: 'alpine_sunrise', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=85' },
      { name: 'editorial_portrait', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1600&q=85' },
      { name: 'tokyo_neon_rain', url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1600&q=85' },
      { name: 'minimal_architecture', url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=85' },
      { name: 'desert_dunes', url: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=1600&q=85' },
      { name: 'artisan_espresso', url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1600&q=85' },
      { name: 'coastal_cliffs', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=85' },
      { name: 'vintage_porsche', url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=85' },
      { name: 'misty_pines', url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1600&q=85' },
      { name: 'nordic_interior', url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1600&q=85' },
      { name: 'golden_retriever', url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1600&q=85' },
      { name: 'night_astrophotography', url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=85' }
    ];

    el.loadingOverlay.classList.remove('hidden');
    el.loadingTitle.textContent = 'Downloading Sample Photographs';
    el.loadingCount.textContent = `0 / ${urls.length}`;
    el.loadingBarFill.style.width = '4%';
    el.loadingPercent.textContent = '0%';
    el.loadingFilename.textContent = 'Connecting...';

    const files = [];
    for (let i = 0; i < urls.length; i++) {
      const item = urls[i];
      el.loadingFilename.textContent = `${item.name}.jpg`;
      try {
        const res = await fetch(item.url);
        const blob = await res.blob();
        files.push(new File([blob], `${item.name}.jpg`, { type: 'image/jpeg' }));
      } catch (_) {}
      const pct = Math.round(((i + 1) / urls.length) * 100);
      el.loadingCount.textContent = `${i + 1} / ${urls.length}`;
      el.loadingBarFill.style.width = `${pct}%`;
      el.loadingPercent.textContent = `${pct}%`;
    }
    await loadFiles(files);
  }

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
    renderMobileControls();
    requestRender();
    if (state.activeMode === 'presets' || state.mobileMode === 'presets') {
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
    renderMobileControls();
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
    renderMobileControls();
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
      el.mobileInputPhotoName.value = photo.name;
      const metaStr = `${Math.round(photo.width)} × ${Math.round(photo.height)} px`;
      el.fileMeta.textContent = metaStr;
      el.mobileFileMeta.textContent = metaStr;
    } else {
      el.inputPhotoName.value = '';
      el.mobileInputPhotoName.value = '';
      el.fileMeta.textContent = '';
      el.mobileFileMeta.textContent = '';
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

  function addMask(type) {
    const photo = getCurrentPhoto();
    if (!photo) return;
    const mask = createDefaultMask(type, photo.edits.masks.length + 1);
    photo.edits.masks.push(mask);
    photo.edits.selectedMaskId = mask.id;
    pushHistory();
    updateMaskUI();
    renderMobileControls();
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
        renderMobileControls();
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
      const f = mask.feather !== undefined ? mask.feather : 62;
      featherSlider.value = f;
      featherVal.textContent = f;
    }

    updateMaskSlidersUI();
  }

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

  function buildPresetSmallSource(photo) {
    const smallSource = document.createElement('canvas');
    smallSource.width = 140;
    smallSource.height = 92;
    const sCtx = smallSource.getContext('2d');

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
    return smallSource;
  }

  function updatePresetThumbnails() {
    const photo = getCurrentPhoto();
    if (!photo) return;
    const smallSource = buildPresetSmallSource(photo);

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

    if (isMobileLayout() && state.mobileMode === 'presets') {
      renderMobileControls();
    }
  }

  function applyPresetValues(values, name) {
    const photo = getCurrentPhoto();
    if (!photo) return;
    state.activePresetBase = { ...values };
    state.activePresetName = name;
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
    renderMobileControls();
    requestRender();
    showStatus(`Applied preset: ${name}`);
  }

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
    renderMobileControls();
    requestRender();
  }

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
    renderMobileControls();
    requestRender();
    showStatus('Auto balanced tone & color');
  }

  function renderMobileControls() {
    const photo = getCurrentPhoto();
    const area = el.mobileContextualArea;
    if (!photo || !area) return;

    const mode = state.mobileMode;

    if (mode === 'light' || mode === 'color' || mode === 'effects') {
      const sliders = SLIDER_GROUPS[mode];
      const activeKey = state.mobileParamKey[mode] || sliders[0].key;
      const activeParam = sliders.find(s => s.key === activeKey) || sliders[0];
      const curVal = photo.edits[activeParam.key];

      area.innerHTML = `
        <div class="m-pill-strip">
          ${sliders
            .map(s => {
              const mod = photo.edits[s.key] !== s.def ? ' modified' : '';
              const act = s.key === activeParam.key ? ' active' : '';
              return `<button class="m-param-pill${act}${mod}" data-mparam="${s.key}">${s.label}</button>`;
            })
            .join('')}
        </div>
        <div class="m-scrub-box">
          <div class="m-scrub-header">
            <span class="m-scrub-title">${activeParam.label}</span>
            <span class="m-scrub-val" id="m-active-val">${curVal > 0 ? `+${curVal}` : curVal}</span>
          </div>
          <input type="range" id="m-active-range" class="m-range" min="${activeParam.min}" max="${activeParam.max}" step="1" value="${curVal}" />
        </div>
      `;

      area.querySelectorAll('.m-param-pill').forEach(btn => {
        btn.addEventListener('click', () => {
          state.mobileParamKey[mode] = btn.dataset.mparam;
          renderMobileControls();
        });
      });

      const rangeEl = document.getElementById('m-active-range');
      const valEl = document.getElementById('m-active-val');
      rangeEl.addEventListener('input', () => {
        const v = Number(rangeEl.value);
        photo.edits[activeParam.key] = v;
        valEl.textContent = v > 0 ? `+${v}` : v;
        updateSliderUI(photo.edits);
        requestRender();
      });
      rangeEl.addEventListener('change', () => {
        pushHistory();
        renderMobileControls();
      });
      valEl.addEventListener('click', () => {
        photo.edits[activeParam.key] = activeParam.def;
        pushHistory();
        updateSliderUI(photo.edits);
        renderMobileControls();
        requestRender();
      });
      return;
    }

    if (mode === 'crop') {
      const ratios = [
        { id: 'free', label: 'Free' },
        { id: '1:1', label: '1:1' },
        { id: '4:5', label: '4:5' },
        { id: '9:16', label: '9:16' },
        { id: '3:4', label: '3:4' },
        { id: '3:2', label: '3:2' },
        { id: '16:9', label: '16:9' }
      ];
      area.innerHTML = `
        <div class="m-pill-strip">
          <button class="m-tool-chip" id="m-crop-rot-l"><i class="ph ph-arrow-counter-clockwise"></i>90°</button>
          <button class="m-tool-chip" id="m-crop-rot-r"><i class="ph ph-arrow-clockwise"></i>90°</button>
          <button class="m-tool-chip" id="m-crop-flip-h"><i class="ph ph-flip-horizontal"></i></button>
          <button class="m-tool-chip" id="m-crop-swap"><i class="ph ph-arrows-left-right"></i>Swap</button>
          ${ratios
            .map(
              r =>
                `<button class="m-param-pill${photo.edits.crop.ratio === r.id ? ' active' : ''}" data-mratio="${r.id}">${r.label}</button>`
            )
            .join('')}
        </div>
        <div class="m-scrub-box">
          <div class="m-scrub-header">
            <span class="m-scrub-title">Straighten (or two-finger twist)</span>
            <span class="m-scrub-val" id="m-crop-angle-val">${photo.edits.rotateFine.toFixed(1)}°</span>
          </div>
          <input type="range" id="m-crop-angle-range" class="m-range" min="-45" max="45" step="0.1" value="${photo.edits.rotateFine}" />
        </div>
      `;

      document.getElementById('m-crop-rot-l').addEventListener('click', () => {
        photo.edits.rotateStep = (photo.edits.rotateStep - 90) % 360;
        pushHistory();
        requestRender();
      });
      document.getElementById('m-crop-rot-r').addEventListener('click', () => {
        photo.edits.rotateStep = (photo.edits.rotateStep + 90) % 360;
        pushHistory();
        requestRender();
      });
      document.getElementById('m-crop-flip-h').addEventListener('click', () => {
        photo.edits.flipH = !photo.edits.flipH;
        pushHistory();
        requestRender();
      });
      document.getElementById('m-crop-swap').addEventListener('click', () => {
        document.getElementById('btn-swap-ratio').click();
      });

      area.querySelectorAll('[data-mratio]').forEach(btn => {
        btn.addEventListener('click', () => {
          const r = btn.dataset.mratio;
          if (r === 'free') {
            photo.edits.crop = { x: 0, y: 0, w: 1, h: 1, ratio: 'free' };
            pushHistory();
            renderMobileControls();
            requestRender();
          } else {
            const [rw, rh] = r.split(':').map(Number);
            applyAspectRatioToCurrentPhoto(rw, rh, r);
          }
        });
      });

      const angleRange = document.getElementById('m-crop-angle-range');
      const angleVal = document.getElementById('m-crop-angle-val');
      angleRange.addEventListener('input', () => {
        photo.edits.rotateFine = Number(angleRange.value);
        angleVal.textContent = `${photo.edits.rotateFine.toFixed(1)}°`;
        updateSliderUI(photo.edits);
        requestRender();
      });
      angleRange.addEventListener('change', pushHistory);
      angleVal.addEventListener('click', () => {
        photo.edits.rotateFine = 0;
        pushHistory();
        updateSliderUI(photo.edits);
        renderMobileControls();
        requestRender();
      });
      return;
    }

    if (mode === 'mask') {
      const mask = getSelectedMask();
      const maskSelectorHtml = photo.edits.masks
        .map(
          m =>
            `<button class="m-tool-chip${m.id === photo.edits.selectedMaskId ? ' active' : ''}" data-mmaskid="${m.id}">${m.name}</button>`
        )
        .join('');

      if (!mask) {
        area.innerHTML = `
          <div class="m-mask-toolbar">
            <button class="m-tool-chip" id="m-add-linear"><i class="ph ph-gradient"></i>+ Linear</button>
            <button class="m-tool-chip" id="m-add-radial"><i class="ph ph-circle-dashed"></i>+ Radial</button>
            <button class="m-tool-chip" id="m-add-brush"><i class="ph ph-paint-brush"></i>+ Brush</button>
          </div>
          <div class="m-scrub-box" style="align-items:center;padding-top:8px;">
            <span class="m-scrub-title">Tap a mask type above to begin local adjustments</span>
          </div>
        `;
        document.getElementById('m-add-linear').addEventListener('click', () => addMask('linear'));
        document.getElementById('m-add-radial').addEventListener('click', () => addMask('radial'));
        document.getElementById('m-add-brush').addEventListener('click', () => addMask('brush'));
        return;
      }

      const activeKey = state.mobileParamKey.mask || 'exposure';
      const activeParam = MASK_SLIDERS.find(s => s.key === activeKey) || MASK_SLIDERS[0];
      const curVal = mask[activeParam.key] || 0;

      area.innerHTML = `
        <div class="m-mask-toolbar">
          <button class="m-tool-chip" id="m-add-linear"><i class="ph ph-plus"></i>Linear</button>
          <button class="m-tool-chip" id="m-add-radial"><i class="ph ph-plus"></i>Radial</button>
          <button class="m-tool-chip" id="m-add-brush"><i class="ph ph-plus"></i>Brush</button>
          ${maskSelectorHtml}
          <button class="m-tool-chip${state.showMaskOverlay ? ' active' : ''}" id="m-toggle-overlay"><i class="ph ph-eye"></i>Overlay</button>
          <button class="m-tool-chip${mask.invert ? ' active' : ''}" id="m-toggle-invert">Invert</button>
          ${
            mask.type === 'brush'
              ? `<button class="m-tool-chip${state.brushMode === 'erase' ? ' active' : ''}" id="m-brush-erase">Eraser</button>`
              : ''
          }
          <button class="m-tool-chip danger" id="m-del-mask"><i class="ph ph-trash"></i></button>
        </div>
        <div class="m-pill-strip">
          ${MASK_SLIDERS.map(s => {
            const mod = (mask[s.key] || 0) !== 0 ? ' modified' : '';
            const act = s.key === activeParam.key ? ' active' : '';
            return `<button class="m-param-pill${act}${mod}" data-mmparam="${s.key}">${s.label}</button>`;
          }).join('')}
        </div>
        <div class="m-scrub-box">
          <div class="m-scrub-header">
            <span class="m-scrub-title">${mask.name} · ${activeParam.label}</span>
            <span class="m-scrub-val" id="m-mask-val">${curVal > 0 ? `+${curVal}` : curVal}</span>
          </div>
          <input type="range" id="m-mask-range" class="m-range" min="${activeParam.min}" max="${activeParam.max}" step="1" value="${curVal}" />
        </div>
      `;

      document.getElementById('m-add-linear').addEventListener('click', () => addMask('linear'));
      document.getElementById('m-add-radial').addEventListener('click', () => addMask('radial'));
      document.getElementById('m-add-brush').addEventListener('click', () => addMask('brush'));

      area.querySelectorAll('[data-mmaskid]').forEach(btn => {
        btn.addEventListener('click', () => {
          photo.edits.selectedMaskId = btn.dataset.mmaskid;
          updateMaskUI();
          renderMobileControls();
          requestRender();
        });
      });

      document.getElementById('m-toggle-overlay').addEventListener('click', () => {
        state.showMaskOverlay = !state.showMaskOverlay;
        el.chkMaskOverlay.checked = state.showMaskOverlay;
        renderMobileControls();
        requestRender();
      });

      document.getElementById('m-toggle-invert').addEventListener('click', () => {
        mask.invert = !mask.invert;
        pushHistory();
        updateMaskUI();
        renderMobileControls();
        requestRender();
      });

      const eraseBtn = document.getElementById('m-brush-erase');
      if (eraseBtn) {
        eraseBtn.addEventListener('click', () => {
          state.brushMode = state.brushMode === 'erase' ? 'paint' : 'erase';
          renderMobileControls();
        });
      }

      document.getElementById('m-del-mask').addEventListener('click', () => {
        document.getElementById('btn-delete-mask').click();
      });

      area.querySelectorAll('[data-mmparam]').forEach(btn => {
        btn.addEventListener('click', () => {
          state.mobileParamKey.mask = btn.dataset.mmparam;
          renderMobileControls();
        });
      });

      const mRange = document.getElementById('m-mask-range');
      const mVal = document.getElementById('m-mask-val');
      mRange.addEventListener('input', () => {
        const v = Number(mRange.value);
        mask[activeParam.key] = v;
        mVal.textContent = v > 0 ? `+${v}` : v;
        updateMaskSlidersUI();
        requestRender();
      });
      mRange.addEventListener('change', () => {
        pushHistory();
        renderMobileControls();
      });
      mVal.addEventListener('click', () => {
        mask[activeParam.key] = 0;
        pushHistory();
        updateMaskSlidersUI();
        renderMobileControls();
        requestRender();
      });
      return;
    }

    if (mode === 'presets') {
      const smallSource = buildPresetSmallSource(photo);
      const allPresets = [
        ...state.userPresets,
        ...PRESET_CATEGORIES.flatMap(c => c.items)
      ];

      area.innerHTML = `
        <div class="m-preset-strip" id="m-preset-strip"></div>
        <div class="m-scrub-box">
          <div class="m-scrub-header">
            <span class="m-scrub-title">Preset Intensity</span>
            <span class="m-scrub-val" id="m-preset-str-val">${state.presetStrength}%</span>
          </div>
          <input type="range" id="m-preset-str-range" class="m-range" min="0" max="150" step="1" value="${state.presetStrength}" />
        </div>
      `;

      const strip = document.getElementById('m-preset-strip');
      allPresets.forEach(p => {
        const tempEdits = { ...createDefaultEdits(), ...p.values };
        previewProc.render(smallSource, tempEdits, { light: false, color: false, effects: false }, false);
        const dataUrl = previewGLCanvas.toDataURL('image/jpeg', 0.72);

        const chip = document.createElement('button');
        chip.className = `m-preset-chip${state.activePresetName === p.name ? ' active' : ''}`;
        chip.innerHTML = `<img src="${dataUrl}" alt="${p.name}" /><span>${p.name}</span>`;
        chip.addEventListener('click', () => {
          applyPresetValues(p.values, p.name);
        });
        strip.appendChild(chip);
      });

      const strRange = document.getElementById('m-preset-str-range');
      const strVal = document.getElementById('m-preset-str-val');
      strRange.addEventListener('input', () => {
        state.presetStrength = Number(strRange.value);
        strVal.textContent = `${state.presetStrength}%`;
        document.getElementById('slider-preset-strength').value = state.presetStrength;
        document.getElementById('val-preset-strength').textContent = `${state.presetStrength}%`;
        if (!state.activePresetBase) return;
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
      strRange.addEventListener('change', pushHistory);
    }
  }

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

    const handleRename = inputEl => {
      const photo = getCurrentPhoto();
      if (!photo) return;
      const val = inputEl.value.trim();
      if (val) {
        photo.name = val;
        el.inputPhotoName.value = val;
        el.mobileInputPhotoName.value = val;
        renderQueue();
        showStatus(`Renamed to "${val}"`);
      } else {
        inputEl.value = photo.name;
      }
    };
    el.inputPhotoName.addEventListener('change', () => handleRename(el.inputPhotoName));
    el.mobileInputPhotoName.addEventListener('change', () => handleRename(el.mobileInputPhotoName));

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

    document.querySelectorAll('.m-nav-item').forEach(item => {
      item.addEventListener('click', () => {
        state.mobileMode = item.dataset.mmode;
        document.querySelectorAll('.m-nav-item').forEach(n => n.classList.toggle('active', n === item));
        renderMobileControls();
        requestRender();
        if (state.mobileMode === 'presets') {
          updatePresetThumbnails();
        }
      });
    });

    document.getElementById('btn-mobile-more').addEventListener('click', () => {
      el.mobileActionSheet.classList.remove('hidden');
    });
    document.getElementById('mobile-sheet-backdrop').addEventListener('click', () => {
      el.mobileActionSheet.classList.add('hidden');
    });

    document.getElementById('m-btn-copy').addEventListener('click', () => {
      document.getElementById('btn-copy').click();
      el.mobileActionSheet.classList.add('hidden');
    });
    document.getElementById('m-btn-paste').addEventListener('click', () => {
      document.getElementById('btn-paste').click();
      el.mobileActionSheet.classList.add('hidden');
    });
    document.getElementById('m-btn-sync-all').addEventListener('click', () => {
      document.getElementById('btn-sync-all').click();
      el.mobileActionSheet.classList.add('hidden');
    });
    document.getElementById('m-btn-auto-tone').addEventListener('click', () => {
      autoBalancePhoto();
      el.mobileActionSheet.classList.add('hidden');
    });
    document.getElementById('m-btn-add-photos').addEventListener('click', () => {
      el.mobileActionSheet.classList.add('hidden');
      el.fileInput.click();
    });
    document.getElementById('m-btn-reset-photo').addEventListener('click', () => {
      document.getElementById('btn-reset-photo').click();
      el.mobileActionSheet.classList.add('hidden');
    });

    const mSplitBtn = document.getElementById('m-btn-split');
    mSplitBtn.addEventListener('click', () => {
      state.splitWipe = !state.splitWipe;
      mSplitBtn.classList.toggle('active', state.splitWipe);
      document.getElementById('btn-split-wipe').classList.toggle('active', state.splitWipe);
      requestRender();
    });

    const mHoldBtn = document.getElementById('m-btn-hold-orig');
    mHoldBtn.addEventListener('pointerdown', () => {
      state.compareHold = true;
      mHoldBtn.classList.add('active');
      requestRender();
    });
    window.addEventListener('pointerup', () => {
      if (state.compareHold) {
        state.compareHold = false;
        mHoldBtn.classList.remove('active');
        requestRender();
      }
    });

    const mFilmstripBtn = document.getElementById('m-btn-toggle-filmstrip');
    mFilmstripBtn.addEventListener('click', () => {
      el.queueWrap.classList.toggle('collapsed');
      mFilmstripBtn.classList.toggle('active', !el.queueWrap.classList.contains('collapsed'));
      setTimeout(requestRender, 180);
    });

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
        renderMobileControls();
        requestRender();
      });
    });

    document.getElementById('btn-auto-tone').addEventListener('click', autoBalancePhoto);
    el.btnUndo.addEventListener('click', undo);
    el.btnRedo.addEventListener('click', redo);

    document.getElementById('btn-copy').addEventListener('click', () => {
      const photo = getCurrentPhoto();
      if (!photo) return;
      state.clipboard = cloneEdits(photo.edits);
      el.btnPaste.disabled = false;
      el.mBtnPaste.disabled = false;
      showStatus('Copied adjustments to clipboard');
    });

    document.getElementById('btn-paste').addEventListener('click', () => {
      const photo = getCurrentPhoto();
      if (!photo || !state.clipboard) return;
      photo.edits = cloneEdits(state.clipboard);
      pushHistory();
      updateSliderUI(photo.edits);
      updateMaskUI();
      renderMobileControls();
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
      mSplitBtn.classList.toggle('active', state.splitWipe);
      requestRender();
    });

    const holdBtn = document.getElementById('btn-compare-hold');
    holdBtn.addEventListener('pointerdown', () => {
      state.compareHold = true;
      requestRender();
    });

    document.getElementById('btn-reset-photo').addEventListener('click', () => {
      const photo = getCurrentPhoto();
      if (!photo) return;
      photo.edits = createDefaultEdits();
      pushHistory();
      updateSliderUI(photo.edits);
      updateMaskUI();
      renderMobileControls();
      requestRender();
      showStatus('Reset photograph to original');
    });

    document.querySelectorAll('.ratio-btn[data-ratio]').forEach(btn => {
      btn.addEventListener('click', () => {
        const photo = getCurrentPhoto();
        if (!photo) return;
        const ratio = btn.dataset.ratio;

        if (ratio === 'free' || ratio === 'original') {
          photo.edits.crop = { x: 0, y: 0, w: 1, h: 1, ratio };
          pushHistory();
          updateSliderUI(photo.edits);
          renderMobileControls();
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
      renderMobileControls();
      requestRender();
    });

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
      renderMobileControls();
      requestRender();
    });

    document.getElementById('btn-delete-mask').addEventListener('click', () => {
      const photo = getCurrentPhoto();
      if (!photo) return;
      photo.edits.masks = photo.edits.masks.filter(m => m.id !== photo.edits.selectedMaskId);
      photo.edits.selectedMaskId = photo.edits.masks[photo.edits.masks.length - 1]?.id || null;
      pushHistory();
      updateMaskUI();
      renderMobileControls();
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

    window.addEventListener('keydown', e => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redo();
      } else if (e.key.toLowerCase() === 'o' && isMaskModeActive()) {
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

    window.addEventListener('resize', () => {
      renderMobileControls();
      requestRender();
    });
  }

  buildSliders();
  renderPresetsStructure();
  initEvents();
  runHomeAnimation();
})();
// =========================================================================================
// 数学交互式课件 — 第三库：课堂黑板批注与尺规几何作图组件库 (annotation_components.js)
// 包含：
//   1. Goodnotes / 希沃白板风格半透明毛玻璃悬浮批注坞 UI 与自包含样式 (InkAnnotationLayer.injectStyles)
//   2. 五大核心批注模态：
//      - cursor    : 手指触控穿透模式（保留批注栏，直接操作下层课件步骤与几何交互）
//      - pen       : 贝塞尔平滑压感画笔（支持实线批注与几何虚线辅助线切换）
//      - highlight : 半透明荧光笔（重点公式与题干条件高亮，不遮挡底层字迹）
//      - shape     : 8 种初中数学专属拖拽几何作图工具（平面直角坐标系 xOy / 带刻度数轴 /
//                    三角形 △ / 自动带直角标直角三角形 Rt△ / 智能吸附正圆 ○ / 矩形 □ /
//                    实虚辅助线段 / 推导指向箭头）
//      - eraser    : 大尺寸局部块状橡皮擦（destination-out 离屏合成擦除）
//   3. 双离屏缓冲高帧率 Canvas 2D 笔迹引擎（支持 getCoalescedEvents 增量极速渲染）
//   4. 分页独立笔迹存储（inkPages Map，每页 100 步 Undo/Redo 栈，翻页自动保存与恢复）
//   5. 可拖拽悬浮窗 (#inkDrag) 与一键折叠迷你悬浮球 (#inkBubble)
//   6. 独立交互式预览黑板组件 (InkAnnotationLayer.createInteractiveDemo)
// =========================================================================================

(function(global) {
  'use strict';

  const INK_STAGE_W = 1600;
  const INK_STAGE_H = 900;

  const TOOLS = [
    {
      id: 'cursor',
      label: '触控操作',
      tip: '手指触控操作课件（保留批注栏，穿透画布操作底层课件）',
      hasSubMenu: false,
      icon: '<svg viewBox="0 0 24 24"><path d="M18 11v-1a2 2 0 0 0-2-2a2 2 0 0 0-2 2"/><path d="M14 10V9a2 2 0 0 0-2-2a2 2 0 0 0-2 2v1"/><path d="M10 9.5V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v10"/><path d="M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-4c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/></svg>'
    },
    {
      id: 'pen',
      label: '画笔',
      tip: '画笔（点击展开粗细、虚线与调色二级菜单）',
      hasSubMenu: true,
      icon: '<svg viewBox="0 0 24 24"><path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>'
    },
    {
      id: 'highlight',
      label: '荧光笔',
      tip: '荧光笔（点击展开粗细与调色二级菜单）',
      hasSubMenu: true,
      icon: '<svg viewBox="0 0 24 24"><path d="m9 11-6 6v3h9l3-3"/><path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4"/><path d="m18 8 4 4"/></svg>'
    },
    {
      id: 'shape',
      label: '几何作图',
      tip: '几何作图工具（点击选择坐标系 / 数轴 / 三角形 / 圆等，在黑板上拖拽作图）',
      hasSubMenu: true,
      icon: '<svg viewBox="0 0 24 24"><path d="M10.5 3.5 3 16h15Z"/><circle cx="17" cy="15.5" r="4.5"/></svg>'
    },
    {
      id: 'eraser',
      label: '橡皮擦',
      tip: '局部块状橡皮擦',
      hasSubMenu: false,
      icon: '<svg viewBox="0 0 24 24"><path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"/><path d="M22 21H7"/><path d="m5 11 9 9"/></svg>'
    }
  ];

  const SHAPES = [
    {
      id: 'axes',
      label: '平面直角坐标系',
      tip: '平面直角坐标系 xOy（拖拽生成带正方向箭头、等距刻度与斜体 x, y, O）',
      icon: '<svg viewBox="0 0 24 24"><line x1="2" y1="12" x2="21" y2="12"/><polyline points="17 8.5 21 12 17 15.5"/><line x1="12" y1="22" x2="12" y2="3"/><polyline points="8.5 7 12 3 15.5 7"/></svg>'
    },
    {
      id: 'numberline',
      label: '数轴',
      tip: '数轴（带原点 0 与整数刻度，拖拽生成）',
      icon: '<svg viewBox="0 0 24 24"><line x1="2" y1="13" x2="21" y2="13"/><polyline points="17 9 21 13 17 17"/><line x1="6" y1="9.5" x2="6" y2="16.5"/><line x1="11.5" y1="8" x2="11.5" y2="18"/><line x1="16.5" y1="9.5" x2="16.5" y2="16.5"/></svg>'
    },
    {
      id: 'triangle',
      label: '三角形',
      tip: '三角形 △（拖拽生成）',
      icon: '<svg viewBox="0 0 24 24"><polygon points="12 4 3.5 19.5 20.5 19.5"/></svg>'
    },
    {
      id: 'rttriangle',
      label: '直角三角形',
      tip: '直角三角形 Rt△（自动带标准直角符号 ∟）',
      icon: '<svg viewBox="0 0 24 24"><polygon points="4.5 4.5 4.5 19.5 20 19.5"/><polyline points="4.5 15 9 15 9 19.5"/></svg>'
    },
    {
      id: 'circle',
      label: '圆 / 椭圆',
      tip: '圆 / 椭圆 ○（接近等宽时自动吸附为正圆）',
      icon: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/></svg>'
    },
    {
      id: 'rect',
      label: '矩形',
      tip: '矩形 / 正方形 □（拖拽生成）',
      icon: '<svg viewBox="0 0 24 24"><rect x="4" y="5.5" width="16" height="13" rx="1.5"/></svg>'
    },
    {
      id: 'line',
      label: '直线段 / 辅助线',
      tip: '直线段 / 辅助线（配合虚线开关可画波利亚虚线辅助线）',
      icon: '<svg viewBox="0 0 24 24"><line x1="4" y1="19" x2="20" y2="5"/><circle cx="4" cy="19" r="1.6" fill="currentColor"/><circle cx="20" cy="5" r="1.6" fill="currentColor"/></svg>'
    },
    {
      id: 'arrow',
      label: '指向箭头',
      tip: '射线 / 推导指向箭头',
      icon: '<svg viewBox="0 0 24 24"><line x1="4" y1="19" x2="20" y2="5"/><polyline points="13 5 20 5 20 12"/></svg>'
    }
  ];

  const STROKE_SIZES = [
    { size: 2.5, label: '细线条 (2.5px)', strokeW: 2.0 },
    { size: 5.5, label: '标准线条 (5.5px)', strokeW: 4.6, defaultSelected: true },
    { size: 11,  label: '粗线条 (11px)',  strokeW: 8.4 }
  ];

  const COLORS = [
    { hex: '#d94040', label: '批注红' },
    { hex: '#384d8f', label: '波利亚靛蓝' },
    { hex: '#118575', label: '解析几何绿' },
    { hex: '#252b37', label: '板书深黑' },
    { hex: '#e29a19', label: '重点荧光橙' },
    { hex: '#9652ae', label: '辅助线紫' }
  ];

  const ACTION_ICONS = {
    undo:  ['撤销 (Ctrl+Z)', '<svg viewBox="0 0 24 24"><path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11"/></svg>'],
    redo:  ['重做 (Ctrl+Y)', '<svg viewBox="0 0 24 24"><path d="m15 14 5-5-5-5"/><path d="M20 9H9.5A5.5 5.5 0 0 0 4 14.5v0A5.5 5.5 0 0 0 9.5 20H13"/></svg>'],
    clear: ['清空本页批注', '<svg viewBox="0 0 24 24"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>'],
    fold:  ['收起为悬浮球', '<svg viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/></svg>'],
    exit:  ['退出批注', '<svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'],
    caret: '<svg class="ink-tool-caret" viewBox="0 0 12 12" fill="none" stroke="currentColor"><path d="M2.5 4.5 6 8l3.5-3.5"/></svg><span class="ink-tool-color-bar"></span>',
    plus:  '<svg viewBox="0 0 24 24" fill="none"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
    dash:  '<svg viewBox="0 0 32 16"><line x1="2" y1="8" x2="8" y2="8" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"/><line x1="13" y1="8" x2="19" y2="8" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"/><line x1="24" y1="8" x2="30" y2="8" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"/></svg>',
    bubble:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 16-1 4 4-1L20 7l-3-3L5 16Zm10-10 3 3M5 16l3 3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>'
  };

  function createDefaultProfiles() {
    return {
      pen:       { color: '#d94040', size: 5.5, dashed: false },
      highlight: { color: '#e29a19', size: 5.5, dashed: false },
      shape:     { color: '#384d8f', size: 2.5, dashed: false, shapeType: 'axes' }
    };
  }

  // ================= 1. 核心 2D Canvas 几何作图与贝塞尔笔迹渲染器 =================
  function drawInkArrowHead(c, tx, ty, ang, sz) {
    c.save();
    c.setLineDash([]);
    c.beginPath();
    c.moveTo(tx, ty);
    c.lineTo(tx - sz * Math.cos(ang - Math.PI / 6), ty - sz * Math.sin(ang - Math.PI / 6));
    c.moveTo(tx, ty);
    c.lineTo(tx - sz * Math.cos(ang + Math.PI / 6), ty - sz * Math.sin(ang + Math.PI / 6));
    c.stroke();
    c.restore();
  }

  function drawHaloText(c, txt, x, y, haloWidth) {
    c.save();
    c.lineJoin = 'round';
    c.lineWidth = haloWidth || 4;
    c.strokeStyle = 'rgba(255, 255, 255, 0.92)';
    c.strokeText(txt, x, y);
    c.fillText(txt, x, y);
    c.restore();
  }

  function normalizeShapePoints(stroke, skipInitBounds) {
    const pts = stroke.points;
    if (!pts || !pts.length) return pts;
    const p1 = pts[0];
    const p2 = pts[pts.length - 1];
    let x1 = p1.x, y1 = p1.y, x2 = p2.x, y2 = p2.y;
    const st = stroke.shapeType || 'axes';
    const dist = Math.hypot(x2 - x1, y2 - y1);

    if (st === 'numberline') {
      if (dist < 18) {
        return [{ x: x1 - 180, y: y1, w: p1.w }, { x: x1 + 180, y: y1, w: p1.w }];
      }
      // 锁死纵坐标为起笔点 y1，彻底杜绝拖拽数轴时上下漂移
      return [{ x: x1, y: y1, w: p1.w }, { x: x2, y: y1, w: p1.w }];
    }

    if (st === 'axes') {
      if (dist < 20) {
        x2 = x1 + 140;
        y2 = y1 + 110;
        x1 = x1 - 140;
        y1 = y1 - 110;
      } else {
        let dx = x2 - x1, dy = y2 - y1;
        const aw = Math.abs(dx), ah = Math.abs(dy);
        if (aw > 40 && ah > 40 && Math.abs(aw - ah) / Math.max(aw, ah) < 0.14) {
          const sq = Math.round((aw + ah) / 2);
          x2 = x1 + (dx >= 0 ? sq : -sq);
          y2 = y1 + (dy >= 0 ? sq : -sq);
        }
      }
      if (!skipInitBounds && !stroke.axesBounds) {
        const minX = Math.min(x1, x2), maxX = Math.max(x1, x2);
        const minY = Math.min(y1, y2), maxY = Math.max(y1, y2);
        stroke.axesBounds = {
          ox: Math.round((minX + maxX) / 2),
          oy: Math.round((minY + maxY) / 2),
          minX: Math.round(minX),
          maxX: Math.round(maxX),
          minY: Math.round(minY),
          maxY: Math.round(maxY)
        };
      }
      return [{ x: x1, y: y1, w: p1.w }, { x: x2, y: y2, w: p1.w }];
    }

    return [p1, p2];
  }

  function getAxesBounds(stroke) {
    if (stroke && stroke.axesBounds && typeof stroke.axesBounds.ox === 'number') {
      return stroke.axesBounds;
    }
    const norm = normalizeShapePoints(stroke, true) || [];
    if (!norm.length) return { ox: 0, oy: 0, minX: -140, maxX: 140, minY: -110, maxY: 110 };
    const p1 = norm[0], p2 = norm[norm.length - 1];
    const minX = Math.min(p1.x, p2.x), maxX = Math.max(p1.x, p2.x);
    const minY = Math.min(p1.y, p2.y), maxY = Math.max(p1.y, p2.y);
    return {
      ox: (minX + maxX) / 2,
      oy: (minY + maxY) / 2,
      minX,
      maxX,
      minY,
      maxY
    };
  }

  function cloneStroke(s) {
    if (!s) return s;
    return {
      ...s,
      points: Array.isArray(s.points) ? s.points.map(p => ({ ...p })) : [],
      axesBounds: s.axesBounds ? { ...s.axesBounds } : undefined
    };
  }

  function cloneStrokes(arr) {
    return Array.isArray(arr) ? arr.map(cloneStroke) : [];
  }

  function getAxesHandles(stroke) {
    if (!stroke || stroke.tool !== 'shape' || (stroke.shapeType || 'axes') !== 'axes') return [];
    const b = getAxesBounds(stroke);
    return [
      { id: 'posX',   x: b.maxX + 7, y: b.oy,       axis: 'x', dir: '+x', cursor: 'ew-resize', label: '+x 半轴' },
      { id: 'negX',   x: b.minX - 7, y: b.oy,       axis: 'x', dir: '-x', cursor: 'ew-resize', label: '-x 半轴' },
      { id: 'posY',   x: b.ox,       y: b.minY - 7, axis: 'y', dir: '+y', cursor: 'ns-resize', label: '+y 半轴' },
      { id: 'negY',   x: b.ox,       y: b.maxY + 7, axis: 'y', dir: '-y', cursor: 'ns-resize', label: '-y 半轴' },
      { id: 'origin', x: b.ox,       y: b.oy,       axis: 'o', dir: 'O',  cursor: 'move',      label: '平移坐标系' }
    ];
  }

  function hitTestAxesHandle(strokes, pt, preferredIdx, hitRadius = 18) {
    if (!Array.isArray(strokes) || !pt) return null;
    const indices = [];
    if (typeof preferredIdx === 'number' && preferredIdx >= 0 && preferredIdx < strokes.length) {
      indices.push(preferredIdx);
    }
    for (let i = strokes.length - 1; i >= 0; i--) {
      if (i !== preferredIdx) indices.push(i);
    }
    for (const idx of indices) {
      const s = strokes[idx];
      if (!s || s.tool !== 'shape' || (s.shapeType || 'axes') !== 'axes') continue;
      const handles = getAxesHandles(s);
      for (const h of handles) {
        if (Math.hypot(pt.x - h.x, pt.y - h.y) <= hitRadius) {
          return { strokeIndex: idx, stroke: s, handle: h };
        }
      }
    }
    return null;
  }

  function hitTestAxesStroke(strokes, pt, tolerance = 12) {
    if (!Array.isArray(strokes) || !pt) return -1;
    for (let i = strokes.length - 1; i >= 0; i--) {
      const s = strokes[i];
      if (!s || s.tool !== 'shape' || (s.shapeType || 'axes') !== 'axes') continue;
      const b = getAxesBounds(s);
      const onX = pt.x >= b.minX - tolerance && pt.x <= b.maxX + tolerance && Math.abs(pt.y - b.oy) <= tolerance;
      const onY = pt.y >= b.minY - tolerance && pt.y <= b.maxY + tolerance && Math.abs(pt.x - b.ox) <= tolerance;
      if (onX || onY) return i;
    }
    return -1;
  }

  function applyAxesHandleDrag(stroke, handleId, pt, startBounds, startPt) {
    if (!stroke || !startBounds || !pt) return;
    const b = { ...startBounds };
    if (handleId === 'posX') {
      b.maxX = Math.round(Math.max(b.ox + 36, pt.x));
    } else if (handleId === 'negX') {
      b.minX = Math.round(Math.min(b.ox - 12, pt.x));
    } else if (handleId === 'posY') {
      b.minY = Math.round(Math.min(b.oy - 36, pt.y));
    } else if (handleId === 'negY') {
      b.maxY = Math.round(Math.max(b.oy + 12, pt.y));
    } else if (handleId === 'origin' && startPt) {
      const dx = Math.round(pt.x - startPt.x);
      const dy = Math.round(pt.y - startPt.y);
      b.ox += dx;
      b.oy += dy;
      b.minX += dx;
      b.maxX += dx;
      b.minY += dy;
      b.maxY += dy;
    }
    stroke.axesBounds = b;
    const w = (stroke.points && stroke.points[0] && stroke.points[0].w) || stroke.size || 2.5;
    stroke.points = [
      { x: b.minX, y: b.minY, w },
      { x: b.maxX, y: b.maxY, w }
    ];
  }

  function drawAxesHandles(target, stroke, dpr, activeHandleId) {
    if (!target || !stroke || stroke.tool !== 'shape' || (stroke.shapeType || 'axes') !== 'axes') return;
    const b = getAxesBounds(stroke);
    const handles = getAxesHandles(stroke);
    const step = 44;
    target.save();
    target.setTransform(dpr, 0, 0, dpr, 0, 0);

    // 虚线外框提示当前处于可单独调节半轴长度状态
    target.strokeStyle = 'rgba(37, 99, 235, 0.28)';
    target.lineWidth = 1.3;
    target.setLineDash([5, 4]);
    target.strokeRect(b.minX, b.minY, b.maxX - b.minX, b.maxY - b.minY);
    target.setLineDash([]);

    handles.forEach(h => {
      const isAct = h.id === activeHandleId;
      if (h.id === 'origin') {
        target.beginPath();
        target.arc(h.x, h.y, isAct ? 7 : 5.5, 0, Math.PI * 2);
        target.fillStyle = isAct ? '#dbeafe' : 'rgba(255, 255, 255, 0.92)';
        target.fill();
        target.lineWidth = 2;
        target.strokeStyle = isAct ? '#1d4ed8' : '#3b82f6';
        target.stroke();
        return;
      }

      const r = isAct ? 9 : 7.5;
      // 外发光圈
      target.beginPath();
      target.arc(h.x, h.y, r + 3.5, 0, Math.PI * 2);
      target.fillStyle = isAct ? 'rgba(217, 119, 6, 0.22)' : 'rgba(37, 99, 235, 0.16)';
      target.fill();

      // 手柄圆盘
      target.beginPath();
      target.arc(h.x, h.y, r, 0, Math.PI * 2);
      target.fillStyle = isAct ? '#fef3c7' : '#ffffff';
      target.fill();
      target.lineWidth = 2.2;
      target.strokeStyle = isAct ? '#d97706' : '#2563eb';
      target.stroke();

      // 手柄内部双向微箭头指示（水平 ↔ 或 垂直 ↕）
      target.beginPath();
      target.lineWidth = 1.6;
      target.strokeStyle = isAct ? '#b45309' : '#1d4ed8';
      if (h.axis === 'x') {
        target.moveTo(h.x - 3.8, h.y);
        target.lineTo(h.x + 3.8, h.y);
        target.moveTo(h.x - 1.8, h.y - 2.2);
        target.lineTo(h.x - 4.0, h.y);
        target.lineTo(h.x - 1.8, h.y + 2.2);
        target.moveTo(h.x + 1.8, h.y - 2.2);
        target.lineTo(h.x + 4.0, h.y);
        target.lineTo(h.x + 1.8, h.y + 2.2);
      } else {
        target.moveTo(h.x, h.y - 3.8);
        target.lineTo(h.x, h.y + 3.8);
        target.moveTo(h.x - 2.2, h.y - 1.8);
        target.lineTo(h.x, h.y - 4.0);
        target.lineTo(h.x + 2.2, h.y - 1.8);
        target.moveTo(h.x - 2.2, h.y + 1.8);
        target.lineTo(h.x, h.y + 4.0);
        target.lineTo(h.x + 2.2, h.y + 1.8);
      }
      target.stroke();

      // 拖拽时实时显示该半轴当前的刻度单位长度
      if (isAct) {
        let pxLen = 0;
        let reserve = 16;
        if (h.id === 'posX') { pxLen = b.maxX - b.ox; reserve = 24; }
        else if (h.id === 'negX') { pxLen = b.ox - b.minX; reserve = 16; }
        else if (h.id === 'posY') { pxLen = b.oy - b.minY; reserve = 24; }
        else if (h.id === 'negY') { pxLen = b.maxY - b.oy; reserve = 16; }
        const units = Math.max(0, Math.floor((pxLen - reserve) / step));
        const tipText = `${h.dir}半轴: ${units} 单位`;
        target.font = '700 13px "Songti SC", "SimSun", sans-serif';
        target.textAlign = 'center';
        target.textBaseline = 'bottom';
        drawHaloText(target, tipText, h.x, h.y - 13, 4);
      }
    });

    target.restore();
  }

  function traceShapePath(c, stroke, w, dashed, isPreview) {
    const pts = stroke.points;
    if (!pts || !pts.length) return;
    const norm = normalizeShapePoints(stroke);
    const p1 = norm[0], p2 = norm[norm.length - 1];
    const x1 = p1.x, y1 = p1.y, x2 = p2.x, y2 = p2.y;
    const dx = x2 - x1, dy = y2 - y1, dist = Math.hypot(dx, dy);
    const st = stroke.shapeType || 'axes';
    c.lineCap = 'round';
    c.lineJoin = 'round';
    c.lineWidth = w;
    c.setLineDash(dashed ? [w * 2.2, w * 1.8] : []);

    if (st === 'line') {
      c.beginPath();
      c.moveTo(x1, y1);
      c.lineTo(x2, y2);
      c.stroke();
    } else if (st === 'arrow') {
      c.beginPath();
      c.moveTo(x1, y1);
      c.lineTo(x2, y2);
      c.stroke();
      if (dist > 8) drawInkArrowHead(c, x2, y2, Math.atan2(dy, dx), Math.max(13, w * 2.8));
    } else if (st === 'triangle') {
      c.beginPath();
      c.moveTo((x1 + x2) / 2, y1);
      c.lineTo(x1, y2);
      c.lineTo(x2, y2);
      c.closePath();
      c.stroke();
    } else if (st === 'rttriangle') {
      c.beginPath();
      c.moveTo(x1, y1);
      c.lineTo(x1, y2);
      c.lineTo(x2, y2);
      c.closePath();
      c.stroke();
      if (Math.abs(dx) > 24 && Math.abs(dy) > 24) {
        const sq = Math.min(18, Math.abs(dx) * 0.26, Math.abs(dy) * 0.26);
        const sx = dx >= 0 ? 1 : -1;
        const sy = dy >= 0 ? -1 : 1;
        c.save();
        c.setLineDash([]);
        c.lineWidth = Math.max(2, w * 0.68);
        c.beginPath();
        c.moveTo(x1 + sx * sq, y2);
        c.lineTo(x1 + sx * sq, y2 + sy * sq);
        c.lineTo(x1, y2 + sy * sq);
        c.stroke();
        c.restore();
      }
    } else if (st === 'rect') {
      c.beginPath();
      c.rect(Math.min(x1, x2), Math.min(y1, y2), Math.abs(dx), Math.abs(dy));
      c.stroke();
    } else if (st === 'circle') {
      const cx = (x1 + x2) / 2, cy = (y1 + y2) / 2;
      let rx = Math.abs(dx) / 2, ry = Math.abs(dy) / 2;
      if (rx > 8 && ry > 8 && Math.abs(rx - ry) / Math.max(rx, ry) < 0.22) {
        rx = ry = (rx + ry) / 2;
      }
      c.beginPath();
      c.ellipse(cx, cy, Math.max(1, rx), Math.max(1, ry), 0, 0, Math.PI * 2);
      c.stroke();
    } else if (st === 'numberline') {
      const minX = Math.min(x1, x2), maxX = Math.max(x1, x2), ny = y1, len = maxX - minX;
      if (isPreview && len > 8) {
        const midPx = (minX + maxX) / 2;
        c.save();
        c.strokeStyle = 'rgba(37, 99, 235, 0.35)';
        c.lineWidth = 1.4;
        c.setLineDash([4, 4]);
        c.beginPath();
        c.moveTo(midPx, ny - 26);
        c.lineTo(midPx, ny + 36);
        c.stroke();
        c.fillStyle = 'rgba(37, 99, 235, 0.75)';
        c.beginPath();
        c.arc(minX, ny, 4, 0, Math.PI * 2);
        c.arc(maxX, ny, 4, 0, Math.PI * 2);
        c.fill();
        c.restore();
      }
      c.beginPath();
      c.moveTo(minX, ny);
      c.lineTo(maxX, ny);
      c.stroke();
      if (len > 24) {
        drawInkArrowHead(c, maxX, ny, 0, Math.max(13, w * 2.6));
        const midX = (minX + maxX) / 2;
        // 固定 48px 单位刻度步长，彻底消除拖拽时数字来回缩放跳动
        const step = 48;
        c.save();
        c.setLineDash([]);
        c.font = '700 18px "Times New Roman", serif';
        c.textAlign = 'center';
        c.textBaseline = 'top';
        const maxK = Math.floor((len / 2 - 26) / step);
        for (let k = -maxK; k <= maxK; k++) {
          const tx = midX + k * step, th = k === 0 ? 10 : 6;
          c.lineWidth = k === 0 ? Math.max(2.4, w * 0.9) : Math.max(1.8, w * 0.72);
          c.beginPath();
          c.moveTo(tx, ny - th);
          c.lineTo(tx, ny + th);
          c.stroke();
          if (maxK <= 6 || k === 0 || k % 2 === 0) {
            drawHaloText(c, String(k), tx, ny + 12, 4);
          }
        }
        c.restore();
      }
    } else if (st === 'axes') {
      const b = getAxesBounds(stroke);
      const minX = b.minX, maxX = b.maxX, minY = b.minY, maxY = b.maxY;
      const ox = b.ox, oy = b.oy;
      const wSpan = maxX - minX, hSpan = maxY - minY;
      const lenPosX = Math.max(0, maxX - ox), lenNegX = Math.max(0, ox - minX);
      const lenPosY = Math.max(0, oy - minY), lenNegY = Math.max(0, maxY - oy);
      // 固定 44px 单位步长，确保单侧拉伸半轴时格点与刻度比例恒定不抖动
      const step = 44;
      const kxPos = Math.floor(Math.max(0, lenPosX - 24) / step);
      const kxNeg = Math.floor(Math.max(0, lenNegX - 16) / step);
      const kyPos = Math.floor(Math.max(0, lenPosY - 24) / step);
      const kyNeg = Math.floor(Math.max(0, lenNegY - 16) / step);

      if (isPreview && wSpan > 20 && hSpan > 20) {
        c.save();
        c.strokeStyle = 'rgba(37, 99, 235, 0.36)';
        c.lineWidth = 1.4;
        c.setLineDash([5, 4]);
        c.strokeRect(minX, minY, wSpan, hSpan);
        c.beginPath();
        c.arc(ox, oy, 5, 0, Math.PI * 2);
        c.stroke();
        c.restore();
      }

      // 淡雅单位辅助方格网（按各半轴实际长度独立生成，方便描点与画函数图像）
      if (wSpan > 60 && hSpan > 60) {
        c.save();
        c.globalAlpha *= 0.15;
        c.lineWidth = 1;
        c.setLineDash([3, 3]);
        for (let k = -kxNeg; k <= kxPos; k++) {
          if (k === 0) continue;
          const gx = ox + k * step;
          c.beginPath();
          c.moveTo(gx, minY + 12);
          c.lineTo(gx, maxY - 8);
          c.stroke();
        }
        for (let k = -kyNeg; k <= kyPos; k++) {
          if (k === 0) continue;
          const gy = oy - k * step;
          c.beginPath();
          c.moveTo(minX + 8, gy);
          c.lineTo(maxX - 12, gy);
          c.stroke();
        }
        c.restore();
      }

      c.beginPath();
      c.moveTo(minX, oy);
      c.lineTo(maxX, oy);
      c.moveTo(ox, maxY);
      c.lineTo(ox, minY);
      c.stroke();
      if (wSpan > 30 && hSpan > 30) {
        const arrSz = Math.max(12, w * 2.5);
        drawInkArrowHead(c, maxX, oy, 0, arrSz);
        drawInkArrowHead(c, ox, minY, -Math.PI / 2, arrSz);
        c.save();
        c.setLineDash([]);
        c.lineWidth = Math.max(1.8, w * 0.65);
        const maxKx = Math.max(kxNeg, kxPos);
        c.font = '600 14px "Times New Roman", serif';
        c.textAlign = 'center';
        c.textBaseline = 'top';
        for (let k = -kxNeg; k <= kxPos; k++) {
          if (k === 0) continue;
          const tx = ox + k * step;
          c.beginPath();
          c.moveTo(tx, oy - 5);
          c.lineTo(tx, oy + 5);
          c.stroke();
          if (Math.abs(k) === 1 || (maxKx <= 5 && k !== 0) || k % 2 === 0) {
            drawHaloText(c, String(k), tx, oy + 8, 3.5);
          }
        }
        const maxKy = Math.max(kyNeg, kyPos);
        c.textAlign = 'right';
        c.textBaseline = 'middle';
        for (let k = -kyNeg; k <= kyPos; k++) {
          if (k === 0) continue;
          const ty = oy - k * step;
          c.beginPath();
          c.moveTo(ox - 5, ty);
          c.lineTo(ox + 5, ty);
          c.stroke();
          if (Math.abs(k) === 1 || (maxKy <= 5 && k !== 0) || k % 2 === 0) {
            drawHaloText(c, String(k), ox - 8, ty, 3.5);
          }
        }
        c.font = 'italic bold 21px "Times New Roman", serif';
        c.textAlign = 'left';
        c.textBaseline = 'top';
        drawHaloText(c, 'x', maxX - 18, oy + 10, 4);
        drawHaloText(c, 'y', ox + 12, minY + 2, 4);
        c.textAlign = 'right';
        drawHaloText(c, 'O', ox - 8, oy + 6, 4);
        c.restore();
      }
    }
    c.setLineDash([]);
  }

  function traceBezierPath(c, pts, w, dashed) {
    c.lineCap = 'round';
    c.lineJoin = 'round';
    c.lineWidth = w;
    c.setLineDash(dashed ? [w * 2.2, w * 1.8] : []);
    if (pts.length === 1) {
      c.beginPath();
      c.arc(pts[0].x, pts[0].y, w / 2, 0, Math.PI * 2);
      c.fill();
      return;
    }
    c.beginPath();
    c.moveTo(pts[0].x, pts[0].y);
    if (pts.length === 2) {
      c.lineTo(pts[1].x, pts[1].y);
    } else {
      for (let i = 1; i < pts.length - 1; i++) {
        const mx = (pts[i].x + pts[i + 1].x) / 2;
        const my = (pts[i].y + pts[i + 1].y) / 2;
        c.quadraticCurveTo(pts[i].x, pts[i].y, mx, my);
      }
      const last = pts[pts.length - 1];
      c.lineTo(last.x, last.y);
    }
    c.stroke();
    c.setLineDash([]);
  }

  function paintStrokeOnContext(target, stroke, strokeCanvas, strokeCtx, dpr, isPreview) {
    const pts = stroke.points;
    if (!pts || !pts.length) return;
    const w = pts[0].w || (stroke.tool === 'eraser' ? stroke.size * 5.2 : stroke.tool === 'highlight' ? stroke.size * 4.2 : stroke.size);
    const isDash = Boolean(stroke.dashed && stroke.tool !== 'eraser');
    if (stroke.tool === 'shape') {
      target.save();
      target.setTransform(dpr, 0, 0, dpr, 0, 0);
      target.globalAlpha = 1;
      target.globalCompositeOperation = 'source-over';
      target.strokeStyle = stroke.color;
      target.fillStyle = stroke.color;
      traceShapePath(target, stroke, w, isDash, isPreview);
      target.restore();
      return;
    }
    if (stroke.tool === 'pen' || stroke.tool === 'marker') {
      target.save();
      target.setTransform(dpr, 0, 0, dpr, 0, 0);
      target.globalAlpha = 1;
      target.globalCompositeOperation = 'source-over';
      target.strokeStyle = stroke.color;
      target.fillStyle = stroke.color;
      traceBezierPath(target, pts, w, isDash);
      target.restore();
      return;
    }
    if (strokeCanvas && strokeCtx) {
      strokeCtx.setTransform(1, 0, 0, 1, 0, 0);
      strokeCtx.clearRect(0, 0, strokeCanvas.width, strokeCanvas.height);
      strokeCtx.save();
      strokeCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      strokeCtx.strokeStyle = stroke.color;
      strokeCtx.fillStyle = stroke.color;
      traceBezierPath(strokeCtx, pts, w, isDash);
      strokeCtx.restore();
      target.save();
      target.setTransform(1, 0, 0, 1, 0, 0);
      target.globalAlpha = stroke.tool === 'highlight' ? 0.34 : 1;
      target.globalCompositeOperation = stroke.tool === 'eraser' ? 'destination-out' : 'source-over';
      target.drawImage(strokeCanvas, 0, 0);
      target.restore();
    } else {
      target.save();
      target.setTransform(dpr, 0, 0, dpr, 0, 0);
      target.globalAlpha = stroke.tool === 'highlight' ? 0.34 : 1;
      target.globalCompositeOperation = stroke.tool === 'eraser' ? 'destination-out' : 'source-over';
      target.strokeStyle = stroke.color;
      target.fillStyle = stroke.color;
      traceBezierPath(target, pts, w, isDash);
      target.restore();
    }
  }

  // ================= 2. 批注工具栏 DOM 统一装配器（消除散落补丁） =================
  function upgradeToolbarDOM(tb) {
    if (!tb || tb.dataset.iconified === '1') return;
    tb.dataset.iconified = '1';
    tb.classList.add('ink-floating', 'ink-simple');

    // 1) 顶部拖拽柄与折叠/退出按钮
    if (!tb.querySelector('.ink-float-head')) {
      const head = document.createElement('div');
      head.className = 'ink-float-head';
      head.innerHTML =
        '<div id="inkDrag" title="拖动批注窗" aria-label="拖动批注窗" tabindex="0"><span class="ink-grip" aria-hidden="true">⠿</span><span>课堂批注</span></div>' +
        '<button id="inkFold" type="button" title="收起为悬浮球" aria-label="收起为悬浮球">' + ACTION_ICONS.fold[1] + '</button>' +
        '<button id="inkExit" type="button" title="退出批注" aria-label="退出批注">' + ACTION_ICONS.exit[1] + '</button>';
      tb.prepend(head);
    }

    // 2) 一级工具按钮区（cursor / pen / highlight / shape / eraser）
    const toolGrp = tb.querySelector('.ink-group');
    if (toolGrp) {
      if (!toolGrp.querySelector('[data-ink-tool="cursor"]')) {
        const curBtn = document.createElement('button');
        curBtn.type = 'button';
        curBtn.dataset.inkTool = 'cursor';
        toolGrp.prepend(curBtn);
      }
      if (!toolGrp.querySelector('[data-ink-tool="shape"]')) {
        const shapeBtn = document.createElement('button');
        shapeBtn.type = 'button';
        shapeBtn.dataset.inkTool = 'shape';
        const erBtn = toolGrp.querySelector('[data-ink-tool="eraser"]');
        if (erBtn) toolGrp.insertBefore(shapeBtn, erBtn);
        else toolGrp.appendChild(shapeBtn);
      }
    }

    TOOLS.forEach(t => {
      const el = tb.querySelector(`[data-ink-tool="${t.id}"]`);
      if (el) {
        el.title = t.tip;
        el.setAttribute('aria-label', t.tip);
        el.innerHTML = t.icon + (t.hasSubMenu ? ACTION_ICONS.caret : '');
      }
    });

    // 3) 撤销 / 重做 / 清空 / 折叠 / 退出图标化
    const actionMap = {
      '#inkUndo':  ACTION_ICONS.undo,
      '#inkRedo':  ACTION_ICONS.redo,
      '#inkClear': ACTION_ICONS.clear,
      '#inkFold':  ACTION_ICONS.fold,
      '#inkExit':  ACTION_ICONS.exit
    };
    Object.entries(actionMap).forEach(([sel, [tip, svg]]) => {
      const el = tb.querySelector(sel);
      if (el) {
        el.title = tip;
        el.setAttribute('aria-label', tip);
        el.innerHTML = svg;
      }
    });

    if (!tb.querySelector('#inkMore')) {
      const more = document.createElement('button');
      more.id = 'inkMore';
      more.type = 'button';
      more.textContent = '设置';
      more.setAttribute('aria-expanded', 'false');
      const undoParent = tb.querySelector('#inkUndo')?.parentElement;
      if (undoParent) tb.insertBefore(more, undoParent);
    }

    // 4) Goodnotes 风格二级弹出胶囊菜单（8种数学几何图形 + 虚线/3档粗细 + 6色球/自定义取色）
    const palette = tb.querySelector('.ink-palette');
    if (palette && !tb.querySelector('#inkSubMenu')) {
      const subMenu = document.createElement('div');
      subMenu.id = 'inkSubMenu';
      subMenu.setAttribute('role', 'group');
      subMenu.setAttribute('aria-label', '几何图形、笔迹粗细与颜色二级菜单');

      const shapeBox = document.createElement('div');
      shapeBox.className = 'ink-shape-presets';
      shapeBox.innerHTML = SHAPES.map((sh, i) =>
        `<button type="button" class="ink-shape-btn${i === 0 ? ' selected' : ''}" data-ink-shape="${sh.id}" title="${sh.tip}" aria-label="${sh.label}">${sh.icon}</button>`
      ).join('');

      const strokeBox = document.createElement('div');
      strokeBox.className = 'ink-stroke-presets';
      strokeBox.innerHTML =
        `<button type="button" class="ink-stroke-btn" data-ink-dash="1" title="虚线批注 / 几何虚线辅助线" aria-label="虚线">${ACTION_ICONS.dash}</button>` +
        STROKE_SIZES.map(st =>
          `<button type="button" class="ink-stroke-btn${st.defaultSelected ? ' selected' : ''}" data-ink-size="${st.size}" title="${st.label}" aria-label="${st.label}">` +
          `<svg viewBox="0 0 32 16"><line x1="4" y1="8" x2="28" y2="8" stroke="currentColor" stroke-width="${st.strokeW}" stroke-linecap="round"/></svg></button>`
        ).join('');

      const divider = document.createElement('div');
      divider.className = 'ink-sub-divider';

      if (!palette.querySelector('.ink-custom-plus')) {
        const plusBtn = document.createElement('button');
        plusBtn.type = 'button';
        plusBtn.className = 'ink-custom-plus';
        plusBtn.title = '自定义更多颜色';
        plusBtn.setAttribute('aria-label', '自定义颜色');
        plusBtn.innerHTML = ACTION_ICONS.plus;
        plusBtn.onclick = (ev) => {
          ev.stopPropagation();
          tb.querySelector('#inkCustomColor')?.click();
        };
        palette.appendChild(plusBtn);
      }

      palette.parentNode.insertBefore(subMenu, palette);
      subMenu.appendChild(shapeBox);
      subMenu.appendChild(strokeBox);
      subMenu.appendChild(divider);
      subMenu.appendChild(palette);

      document.addEventListener('pointerdown', (ev) => {
        if (!tb.contains(ev.target)) {
          subMenu.classList.remove('palette-open');
        }
      });
    }
  }

  function setupCoursewareToolbar(opts = {}) {
    const getPenOn = opts.getPenOn || (() => false);
    const inkSettings = opts.inkSettings || { color: '#d94040', size: 5.5, tool: 'pen', dashed: false, shapeType: 'axes' };
    const updateInkTools = opts.updateInkTools || (() => {});

    const penBtn = document.getElementById('pen');
    if (penBtn && !penBtn.dataset.styled) {
      penBtn.dataset.styled = '1';
      if (!getPenOn()) penBtn.textContent = '✏️ 批注';
    }

    const tb = document.getElementById('inkToolbar');
    if (!tb) return;

    upgradeToolbarDOM(tb);

    if (!global.inkToolProfiles) {
      global.inkToolProfiles = createDefaultProfiles();
    }

    if (!tb.dataset.eventsBound) {
      tb.dataset.eventsBound = '1';

      global.syncSubMenuDock = () => {
        if (!tb.dataset.recentered && !tb.hidden && tb.offsetWidth > 0) {
          tb.dataset.recentered = '1';
          tb.style.left = Math.round((window.innerWidth - tb.offsetWidth) / 2) + 'px';
        }
        const subMenu = document.getElementById('inkSubMenu');
        const activeDrawTool = ['pen', 'highlight', 'shape'].includes(inkSettings.tool) ? inkSettings.tool : 'pen';
        if (subMenu) {
          subMenu.classList.toggle('shape-mode', activeDrawTool === 'shape');
        }
        ['pen', 'highlight', 'shape'].forEach(tName => {
          const prof = global.inkToolProfiles[tName];
          const tBtn = tb.querySelector(`[data-ink-tool="${tName}"]`);
          const bar = tBtn?.querySelector('.ink-tool-color-bar');
          if (bar && prof) {
            bar.style.setProperty('--tool-color', prof.color);
            const bh = prof.size <= 3.5 ? '2.5px' : (prof.size >= 8 ? '7px' : '4.5px');
            bar.style.setProperty('--bar-h', bh);
            bar.style.height = bh;
            bar.style.backgroundColor = prof.color;
            bar.classList.toggle('is-dashed', Boolean(prof.dashed));
          }
        });
        tb.querySelectorAll('[data-ink-shape]').forEach(b => {
          b.classList.toggle('selected', b.dataset.inkShape === (inkSettings.shapeType || 'axes'));
        });
        tb.querySelectorAll('[data-ink-size]').forEach(b => {
          b.classList.toggle('selected', +b.dataset.inkSize === +inkSettings.size);
        });
        const dashBtn = tb.querySelector('[data-ink-dash]');
        if (dashBtn) dashBtn.classList.toggle('selected', Boolean(inkSettings.dashed));
        tb.querySelectorAll('[data-ink-color]').forEach(b => {
          const act = b.dataset.inkColor?.toLowerCase() === String(inkSettings.color).toLowerCase();
          b.classList.toggle('selected', act);
          b.setAttribute('aria-pressed', String(act));
        });
        tb.style.setProperty('--active-ink', inkSettings.color);
        if (subMenu && subMenu.classList.contains('palette-open')) {
          const targetBtn = tb.querySelector(`[data-ink-tool="${activeDrawTool}"]`);
          if (targetBtn) {
            const btnR = targetBtn.getBoundingClientRect();
            const subR = subMenu.getBoundingClientRect();
            if (subR.width > 0) {
              const arrowX = Math.max(28, Math.min(subR.width - 28, (btnR.left + btnR.width / 2) - subR.left));
              subMenu.style.setProperty('--dock-arrow-x', Math.round(arrowX) + 'px');
            }
          }
        }
      };

      const customInp = document.getElementById('inkCustomColor');
      if (customInp && !customInp.dataset.boundSync) {
        customInp.dataset.boundSync = '1';
        customInp.addEventListener('input', (e) => {
          inkSettings.color = e.target.value;
          const drawTool = ['pen', 'highlight', 'shape'].includes(inkSettings.tool) ? inkSettings.tool : 'pen';
          if (!['pen', 'highlight', 'shape'].includes(inkSettings.tool)) inkSettings.tool = 'pen';
          global.inkToolProfiles[drawTool].color = inkSettings.color;
          updateInkTools();
          global.syncSubMenuDock();
        });
      }

      tb.addEventListener('click', (ev) => {
        const btn = ev.target.closest('button');
        if (!btn) return;
        const penOn = getPenOn();
        const subMenu = document.getElementById('inkSubMenu');
        const activeDrawTool = ['pen', 'highlight', 'shape'].includes(inkSettings.tool) ? inkSettings.tool : 'pen';
        if (btn.dataset.inkShape) {
          ev.stopPropagation();
          inkSettings.tool = 'shape';
          inkSettings.shapeType = btn.dataset.inkShape;
          global.inkToolProfiles.shape.shapeType = inkSettings.shapeType;
          document.getElementById('penLayer')?.classList.toggle('enabled', penOn);
          updateInkTools();
          global.syncSubMenuDock();
          return;
        }
        if (btn.dataset.inkDash) {
          ev.stopPropagation();
          if (!['pen', 'highlight', 'shape'].includes(inkSettings.tool)) inkSettings.tool = activeDrawTool;
          inkSettings.dashed = !inkSettings.dashed;
          global.inkToolProfiles[inkSettings.tool].dashed = inkSettings.dashed;
          document.getElementById('penLayer')?.classList.toggle('enabled', penOn);
          updateInkTools();
          global.syncSubMenuDock();
          return;
        }
        if (btn.dataset.inkSize) {
          ev.stopPropagation();
          if (!['pen', 'highlight', 'shape'].includes(inkSettings.tool)) inkSettings.tool = activeDrawTool;
          inkSettings.size = +btn.dataset.inkSize;
          global.inkToolProfiles[inkSettings.tool].size = inkSettings.size;
          document.getElementById('penLayer')?.classList.toggle('enabled', penOn);
          updateInkTools();
          global.syncSubMenuDock();
          return;
        }
        if (btn.dataset.inkTool) {
          const tool = btn.dataset.inkTool;
          const isCursor = tool === 'cursor';
          document.getElementById('penLayer')?.classList.toggle('enabled', penOn && !isCursor);
          if (tool === 'pen' || tool === 'highlight' || tool === 'shape') {
            const prof = global.inkToolProfiles[tool];
            if (prof) {
              inkSettings.color = prof.color;
              inkSettings.size = prof.size;
              inkSettings.dashed = prof.dashed;
              if (prof.shapeType) inkSettings.shapeType = prof.shapeType;
            }
            if (tb.dataset.lastOpenTool === tool && subMenu?.classList.contains('palette-open')) {
              subMenu.classList.remove('palette-open');
            } else {
              subMenu?.classList.add('palette-open');
            }
            tb.dataset.lastOpenTool = tool;
            updateInkTools();
            requestAnimationFrame(() => global.syncSubMenuDock());
          } else {
            subMenu?.classList.remove('palette-open');
            tb.dataset.lastOpenTool = tool;
          }
          global.syncSubMenuDock();
        } else if (btn.dataset.inkColor) {
          if (!['pen', 'highlight', 'shape'].includes(inkSettings.tool)) {
            inkSettings.tool = 'pen';
          }
          global.inkToolProfiles[inkSettings.tool].color = inkSettings.color;
          document.getElementById('penLayer')?.classList.toggle('enabled', penOn);
          updateInkTools();
          global.syncSubMenuDock();
        }
      });
    }

    if (global.syncSubMenuDock) {
      global.syncSubMenuDock();
      requestAnimationFrame(() => global.syncSubMenuDock());
    }
  }

  // ================= 3. 自包含 CSS 注入器（供独立预览页或外部容器一键加载） =================
  const STANDALONE_INK_CSS = `
    .ink-demo-stage {
      position: relative;
      width: 100%;
      height: 520px;
      background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
      border: 2px solid #cbd5e1;
      border-radius: 18px;
      overflow: hidden;
      box-shadow: inset 0 2px 10px rgba(15, 23, 42, 0.04);
      user-select: none;
    }
    .ink-demo-bg {
      position: absolute;
      inset: 0;
      padding: 24px 32px;
      pointer-events: none;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .ink-demo-canvas {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      z-index: 5;
      touch-action: none;
      cursor: crosshair;
    }
    .ink-demo-canvas.cursor-mode {
      pointer-events: none;
    }
    .ink-demo-dock-wrap {
      position: absolute;
      left: 50%;
      bottom: 18px;
      transform: translateX(-50%);
      z-index: 20;
      touch-action: none;
    }
    .ink-demo-dock-wrap.is-moved {
      transform: none;
      bottom: auto;
    }
    .ink-demo-dock-wrap[hidden] {
      display: none !important;
    }
    .ink-demo-toolbar {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 10px;
      padding: 10px 14px;
      border-radius: 24px;
      background: rgba(30, 41, 59, 0.78);
      border: 1.5px solid rgba(255, 255, 255, 0.48);
      box-shadow: 0 12px 32px rgba(15, 23, 42, 0.28);
      backdrop-filter: blur(14px) saturate(140%);
      -webkit-backdrop-filter: blur(14px) saturate(140%);
      color: #ffffff;
      position: relative;
      cursor: grab;
      touch-action: none;
    }
    .ink-demo-toolbar:active {
      cursor: grabbing;
    }
    .ink-demo-drag {
      width: 28px;
      height: 46px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: rgba(255, 255, 255, 0.85);
      font-size: 26px;
      line-height: 1;
      cursor: grab;
      user-select: none;
      padding-right: 6px;
      border-right: 1.5px solid rgba(255, 255, 255, 0.28);
      touch-action: none;
    }
    .ink-demo-drag:hover {
      color: #ffffff;
    }
    .ink-demo-drag:active {
      cursor: grabbing;
    }
    .ink-demo-bubble {
      position: absolute;
      right: 22px;
      bottom: 18px;
      z-index: 25;
      height: 54px;
      min-width: 54px;
      padding: 0 16px 0 13px;
      border-radius: 999px;
      background: rgba(24, 34, 52, 0.88);
      color: #ffffff;
      border: 2.5px solid var(--active-ink, #384d8f);
      box-shadow: 0 10px 28px rgba(15, 23, 42, 0.36), 0 0 0 3px rgba(255, 255, 255, 0.42);
      backdrop-filter: blur(12px) saturate(140%);
      -webkit-backdrop-filter: blur(12px) saturate(140%);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 7px;
      cursor: grab;
      user-select: none;
      touch-action: none;
      transition: transform 0.15s ease, background 0.15s ease;
    }
    .ink-demo-bubble[hidden] {
      display: none !important;
    }
    .ink-demo-bubble:hover {
      transform: scale(1.05);
      background: rgba(30, 41, 59, 0.96);
    }
    .ink-demo-bubble:active {
      cursor: grabbing;
    }
    .ink-demo-bubble svg {
      width: 22px;
      height: 22px;
      stroke: currentColor;
      stroke-width: 2.2;
      fill: none;
      stroke-linecap: round;
      stroke-linejoin: round;
      pointer-events: none;
    }
    .ink-demo-bubble-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: var(--active-ink, #384d8f);
      border: 1.5px solid #ffffff;
      flex-shrink: 0;
      pointer-events: none;
    }
    .ink-demo-bubble-label {
      font-family: 'SimSun', 'Songti SC', serif;
      font-size: 15px;
      font-weight: 700;
      letter-spacing: 0.5px;
      pointer-events: none;
      white-space: nowrap;
    }
    .ink-demo-toolbar .ink-btn {
      width: 52px;
      height: 52px;
      border-radius: 15px;
      background: rgba(15, 23, 42, 0.45);
      border: 1.5px solid rgba(255, 255, 255, 0.32);
      color: #ffffff;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      position: relative;
      cursor: pointer;
      padding: 0;
      transition: all 0.15s ease;
    }
    .ink-demo-toolbar .ink-btn.has-caret {
      width: 62px;
      padding-right: 10px;
    }
    .ink-demo-toolbar .ink-btn:hover:not(:disabled) {
      background: rgba(15, 23, 42, 0.72);
      border-color: rgba(255, 255, 255, 0.68);
      transform: translateY(-1px);
    }
    .ink-demo-toolbar .ink-btn.selected {
      background: linear-gradient(135deg, rgba(13, 148, 136, 0.95), rgba(2, 132, 199, 0.95));
      border-color: #99f6e4;
      box-shadow: 0 4px 14px rgba(2, 132, 199, 0.42);
    }
    .ink-demo-toolbar .ink-btn:disabled {
      opacity: 0.35;
      cursor: default;
    }
    .ink-demo-toolbar .ink-btn.danger {
      background: rgba(153, 27, 27, 0.58);
      color: #fecaca;
      border-color: rgba(252, 165, 165, 0.55);
    }
    .ink-demo-toolbar .ink-btn.danger:hover {
      background: rgba(185, 28, 28, 0.88);
      color: #ffffff;
    }
    .ink-demo-toolbar .ink-btn > svg:first-child {
      width: 26px;
      height: 26px;
      stroke: currentColor;
      stroke-width: 2.2;
      fill: none;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    .ink-demo-toolbar .ink-tool-caret {
      position: absolute;
      right: 6px;
      top: 50%;
      transform: translateY(-50%);
      width: 10px;
      height: 10px;
      opacity: 0.8;
      stroke-width: 2.5;
    }
    .ink-demo-toolbar .ink-tool-color-bar {
      position: absolute;
      bottom: 5px;
      left: 10px;
      width: 28px;
      height: var(--bar-h, 4px);
      border-radius: 99px;
      background: var(--tool-color, #d94040);
    }
    .ink-demo-toolbar .ink-tool-color-bar.is-dashed {
      background: repeating-linear-gradient(90deg, var(--tool-color, #d94040) 0px, var(--tool-color, #d94040) 6px, transparent 6px, transparent 10px) !important;
    }
    .ink-demo-submenu {
      position: absolute;
      bottom: calc(100% + 12px);
      left: 50%;
      transform: translateX(-50%);
      display: none;
      flex-direction: row;
      align-items: center;
      gap: 12px;
      padding: 9px 18px;
      border-radius: 999px;
      background: rgba(24, 34, 52, 0.94);
      border: 1.5px solid rgba(255, 255, 255, 0.55);
      box-shadow: 0 10px 28px rgba(15, 23, 42, 0.38);
      width: max-content;
      z-index: 30;
    }
    .ink-demo-submenu.open {
      display: flex;
    }
    .ink-demo-submenu.flip-down {
      bottom: auto;
      top: calc(100% + 12px);
    }
    .ink-demo-submenu .sub-btn {
      width: 40px;
      height: 40px;
      border-radius: 11px;
      background: transparent;
      border: 1.5px solid transparent;
      color: rgba(255, 255, 255, 0.88);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      padding: 0;
    }
    .ink-demo-submenu .sub-btn:hover {
      background: rgba(255, 255, 255, 0.14);
    }
    .ink-demo-submenu .sub-btn.selected {
      background: rgba(56, 189, 248, 0.28);
      border-color: #7dd3fc;
      color: #ffffff;
    }
    .ink-demo-submenu .sub-btn svg {
      width: 22px;
      height: 22px;
      stroke: currentColor;
      stroke-width: 2.1;
      fill: none;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    .ink-demo-submenu .swatch-btn {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 2.5px solid rgba(255, 255, 255, 0.8);
      cursor: pointer;
      padding: 0;
      transition: transform 0.15s ease;
    }
    .ink-demo-submenu .swatch-btn.selected {
      transform: scale(1.18);
      border-color: #ffffff;
      box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.28);
    }
    .ink-demo-sep {
      width: 1.5px;
      height: 28px;
      background: rgba(255, 255, 255, 0.28);
    }
  `;

  function injectStyles() {
    if (typeof document === 'undefined' || document.getElementById('ink-annotation-layer-styles')) return;
    const styleEl = document.createElement('style');
    styleEl.id = 'ink-annotation-layer-styles';
    styleEl.textContent = STANDALONE_INK_CSS;
    document.head?.appendChild(styleEl);
  }

  // ================= 4. 独立交互式预览黑板组件 (供 component_library_preview.html 直接挂载) =================
  function createInteractiveDemo(container, options = {}) {
    if (!container) return null;
    injectStyles();

    const stageW = options.width || 1100;
    const stageH = options.height || 500;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const profiles = createDefaultProfiles();
    const state = {
      tool: 'shape',
      color: '#384d8f',
      size: 2.5,
      dashed: false,
      shapeType: 'axes',
      strokes: (options.initialStrokes || []).slice(),
      undo: [],
      redo: []
    };

    container.innerHTML = `
      <div class="ink-demo-stage" style="height:${stageH}px;">
        <div class="ink-demo-bg">
          <div style="display:flex;align-items:center;justify-content:space-between;">
            <span style="background:#eef2ff;color:#1e3a8a;border:1.5px solid #c7d2fe;padding:5px 14px;border-radius:99px;font-weight:700;font-size:15px;">
              ✨ 交互式黑板批注与尺规作图演练场（支持直接在下方画布拖拽作图或书写）
            </span>
            <span id="inkDemoStatus" style="font-size:14px;color:#475569;font-weight:600;">
              当前模式：几何作图 · 平面直角坐标系 xOy
            </span>
          </div>
          <div style="display:grid;grid-template-columns:1.1fr 1fr;gap:24px;margin:14px 0 auto;opacity:0.95;">
            <div style="background:#f8fafc;border:1.5px dashed #cbd5e1;border-radius:14px;padding:18px 22px;font-family:'SimSun','Songti SC',serif;font-size:22px;line-height:1.85;color:#1e293b;">
              <div style="font-weight:700;color:#1e3a8a;margin-bottom:8px;font-size:16px;">【模拟课件底层板书区 · 可用荧光笔/画笔直接圈画批注】</div>
              已知反比例函数 <i class="m">y</i>=<span class="fraction"><span><span class="num">6</span></span><span><i class="m">x</i></span></span>（<i class="m">x</i>&gt;<span class="num">0</span>）的图象经过点 <i class="m">A</i>(<span class="num">2</span>,<span class="num">3</span>)，过点 <i class="m">A</i> 作 <i class="m">AB</i>⊥<i class="m">x</i> 轴于点 <i class="m">B</i>，连接 <i class="m">OA</i>，则 △<i class="m">OAB</i> 的面积 <i class="m">S</i>=<span class="num">3</span>。
            </div>
            <div style="background:#f8fafc;border:1.5px dashed #cbd5e1;border-radius:14px;padding:14px 18px;display:flex;flex-direction:column;justify-content:flex-start;min-height:245px;">
              <div style="font-weight:700;color:#475569;font-size:15px;">【右侧尺规几何作图区 · 已预置坐标系 <i class="m">xOy</i>、Rt△ 与虚线辅助线】</div>
            </div>
          </div>
          <div style="height:68px;"></div>
        </div>
        <canvas class="ink-demo-canvas" width="${stageW * dpr}" height="${stageH * dpr}"></canvas>
        <div class="ink-demo-dock-wrap" id="demoDockWrap">
          <div class="ink-demo-toolbar" id="demoToolbar" title="按住左侧拖拽柄或工具栏空白处可自由移动位置">
            <div class="ink-demo-submenu open">
              <div class="ink-demo-shapes" style="display:flex;align-items:center;gap:4px;">
                ${SHAPES.map(sh => `<button type="button" class="sub-btn" data-demo-shape="${sh.id}" title="${sh.tip}">${sh.icon}</button>`).join('')}
              </div>
              <div class="ink-demo-sep" id="demoShapeSep"></div>
              <div style="display:flex;align-items:center;gap:4px;">
                <button type="button" class="sub-btn" data-demo-dash="1" title="虚线批注 / 几何虚线辅助线">${ACTION_ICONS.dash}</button>
                ${STROKE_SIZES.map(st => `<button type="button" class="sub-btn" data-demo-size="${st.size}" title="${st.label}"><svg viewBox="0 0 32 16"><line x1="4" y1="8" x2="28" y2="8" stroke="currentColor" stroke-width="${st.strokeW}" stroke-linecap="round"/></svg></button>`).join('')}
              </div>
              <div class="ink-demo-sep"></div>
              <div style="display:flex;align-items:center;gap:8px;">
                ${COLORS.map(c => `<button type="button" class="swatch-btn" data-demo-color="${c.hex}" style="background:${c.hex}" title="${c.label}"></button>`).join('')}
              </div>
            </div>
            <div class="ink-demo-drag" id="demoDrag" title="按住拖动批注工具栏位置" aria-label="拖动批注工具栏">⠿</div>
            ${TOOLS.map(t => `<button type="button" class="ink-btn${t.hasSubMenu ? ' has-caret' : ''}" data-demo-tool="${t.id}" title="${t.tip}">${t.icon}${t.hasSubMenu ? ACTION_ICONS.caret : ''}</button>`).join('')}
            <div class="ink-demo-sep"></div>
            <button type="button" class="ink-btn" id="demoUndo" title="${ACTION_ICONS.undo[0]}">${ACTION_ICONS.undo[1]}</button>
            <button type="button" class="ink-btn" id="demoRedo" title="${ACTION_ICONS.redo[0]}">${ACTION_ICONS.redo[1]}</button>
            <button type="button" class="ink-btn danger" id="demoClear" title="${ACTION_ICONS.clear[0]}">${ACTION_ICONS.clear[1]}</button>
            <div class="ink-demo-sep"></div>
            <button type="button" class="ink-btn" id="demoFold" title="最小化收起为悬浮球（避免遮挡底层图形）" aria-label="最小化收起为悬浮球">${ACTION_ICONS.fold[1]}</button>
          </div>
        </div>
        <button type="button" class="ink-demo-bubble" id="demoBubble" hidden title="点击展开批注栏 · 按住可拖动位置" aria-label="展开批注工具栏">
          ${ACTION_ICONS.bubble}
          <span class="ink-demo-bubble-dot"></span>
          <span class="ink-demo-bubble-label">批注</span>
        </button>
      </div>
    `;

    const canvas = container.querySelector('.ink-demo-canvas');
    const ctx = canvas.getContext('2d');
    const baseCanvas = document.createElement('canvas');
    const strokeCanvas = document.createElement('canvas');
    baseCanvas.width = strokeCanvas.width = stageW * dpr;
    baseCanvas.height = strokeCanvas.height = stageH * dpr;
    const baseCtx = baseCanvas.getContext('2d');
    const strokeCtx = strokeCanvas.getContext('2d');

    const subMenu = container.querySelector('.ink-demo-submenu');
    const shapesWrap = container.querySelector('.ink-demo-shapes');
    const shapeSep = container.querySelector('#demoShapeSep');
    const statusEl = container.querySelector('#inkDemoStatus');
    const stageEl = container.querySelector('.ink-demo-stage');
    const dockWrap = container.querySelector('#demoDockWrap');
    const toolbarEl = container.querySelector('#demoToolbar');
    const bubbleEl = container.querySelector('#demoBubble');

    function clampVal(v, min, max) {
      return Math.max(min, Math.min(Math.max(min, max), v));
    }

    function setNodeStagePos(node, leftPx, topPx) {
      if (!stageEl || !node) return;
      const sr = stageEl.getBoundingClientRect();
      const nr = node.getBoundingClientRect();
      const clampedL = clampVal(leftPx, 8, sr.width - nr.width - 8);
      const clampedT = clampVal(topPx, 8, sr.height - nr.height - 8);
      node.classList.add('is-moved');
      node.style.left = `${Math.round(clampedL)}px`;
      node.style.top = `${Math.round(clampedT)}px`;
      node.style.right = 'auto';
      node.style.bottom = 'auto';
      node.style.transform = 'none';
      if (node === dockWrap && subMenu) {
        subMenu.classList.toggle('flip-down', clampedT < 92);
      }
    }

    function foldDemoToolbar() {
      if (!stageEl || !dockWrap || !bubbleEl) return;
      const sr = stageEl.getBoundingClientRect();
      const dr = dockWrap.getBoundingClientRect();
      dockWrap.hidden = true;
      bubbleEl.hidden = false;
      const br = bubbleEl.getBoundingClientRect();
      const targetL = (dr.right - sr.left) - br.width;
      const targetT = (dr.top - sr.top) + (dr.height - br.height) / 2;
      setNodeStagePos(bubbleEl, targetL, targetT);
    }

    function unfoldDemoToolbar() {
      if (!stageEl || !dockWrap || !bubbleEl) return;
      const sr = stageEl.getBoundingClientRect();
      const br = bubbleEl.getBoundingClientRect();
      bubbleEl.hidden = true;
      dockWrap.hidden = false;
      const dr = dockWrap.getBoundingClientRect();
      const targetL = (br.right - sr.left) - dr.width;
      const targetT = (br.top - sr.top) - (dr.height - br.height) / 2;
      setNodeStagePos(dockWrap, targetL, targetT);
    }

    function attachStageDrag(handleEl, targetNode, isBubble = false) {
      if (!handleEl || !targetNode || !stageEl) return;
      let dragState = null;
      let hasMoved = false;
      handleEl.addEventListener('pointerdown', ev => {
        if (ev.button !== 0) return;
        if (!isBubble && ev.target.closest('button, .ink-demo-submenu')) return;
        const sr = stageEl.getBoundingClientRect();
        const tr = targetNode.getBoundingClientRect();
        dragState = {
          pid: ev.pointerId,
          startX: ev.clientX,
          startY: ev.clientY,
          initLeft: tr.left - sr.left,
          initTop: tr.top - sr.top
        };
        hasMoved = false;
        handleEl.setPointerCapture(ev.pointerId);
        ev.preventDefault();
        ev.stopPropagation();
      });
      handleEl.addEventListener('pointermove', ev => {
        if (!dragState || ev.pointerId !== dragState.pid) return;
        const dx = ev.clientX - dragState.startX;
        const dy = ev.clientY - dragState.startY;
        if (Math.hypot(dx, dy) > 4) hasMoved = true;
        if (hasMoved) {
          setNodeStagePos(targetNode, dragState.initLeft + dx, dragState.initTop + dy);
        }
      });
      handleEl.addEventListener('pointerup', ev => {
        if (!dragState || ev.pointerId !== dragState.pid) return;
        const wasClick = !hasMoved;
        dragState = null;
        if (handleEl.hasPointerCapture(ev.pointerId)) handleEl.releasePointerCapture(ev.pointerId);
        if (isBubble && wasClick) {
          unfoldDemoToolbar();
        }
      });
      handleEl.addEventListener('pointercancel', () => {
        dragState = null;
        hasMoved = false;
      });
    }

    attachStageDrag(toolbarEl, dockWrap, false);
    attachStageDrag(bubbleEl, bubbleEl, true);
    bubbleEl?.addEventListener('click', ev => {
      if (ev.detail === 0) unfoldDemoToolbar();
    });

    function syncUI() {
      canvas.classList.toggle('cursor-mode', state.tool === 'cursor');
      const isShape = state.tool === 'shape';
      if (shapesWrap) shapesWrap.style.display = isShape ? 'flex' : 'none';
      if (shapeSep) shapeSep.style.display = isShape ? 'block' : 'none';

      container.querySelectorAll('[data-demo-tool]').forEach(b => {
        const t = b.dataset.demoTool;
        b.classList.toggle('selected', t === state.tool);
        const prof = profiles[t];
        const bar = b.querySelector('.ink-tool-color-bar');
        if (bar && prof) {
          bar.style.setProperty('--tool-color', prof.color);
          const bh = prof.size <= 3.5 ? '2.5px' : (prof.size >= 8 ? '6.5px' : '4.5px');
          bar.style.setProperty('--bar-h', bh);
          bar.style.height = bh;
          bar.style.backgroundColor = prof.color;
          bar.classList.toggle('is-dashed', Boolean(prof.dashed));
        }
      });
      container.querySelectorAll('[data-demo-shape]').forEach(b => {
        b.classList.toggle('selected', b.dataset.demoShape === state.shapeType);
      });
      container.querySelectorAll('[data-demo-size]').forEach(b => {
        b.classList.toggle('selected', +b.dataset.demoSize === +state.size);
      });
      const dashBtn = container.querySelector('[data-demo-dash]');
      if (dashBtn) dashBtn.classList.toggle('selected', Boolean(state.dashed));
      container.querySelectorAll('[data-demo-color]').forEach(b => {
        b.classList.toggle('selected', b.dataset.demoColor.toLowerCase() === state.color.toLowerCase());
      });
      container.querySelector('#demoUndo').disabled = !state.undo.length;
      container.querySelector('#demoRedo').disabled = !state.redo.length;
      if (bubbleEl) bubbleEl.style.setProperty('--active-ink', state.color);

      const toolObj = TOOLS.find(t => t.id === state.tool);
      const shapeObj = SHAPES.find(s => s.id === state.shapeType);
      if (statusEl) {
        const axesHint = (state.tool === 'shape' && state.shapeType === 'axes') ? '（拖出后可拉动四端手柄单独调节 ±x、±y 半轴长度）' : '';
        statusEl.textContent = `当前模式：${toolObj ? toolObj.label : state.tool}${state.tool === 'shape' && shapeObj ? ' · ' + shapeObj.label : ''}${state.dashed ? '（虚线模式）' : ''}${axesHint}`;
      }
    }

    let activeStroke = null;
    let activePid = null;
    let activeAxesDrag = null;
    let hoveredAxesHandleId = null;
    let selectedAxesIdx = -1;
    for (let i = state.strokes.length - 1; i >= 0; i--) {
      const s = state.strokes[i];
      if (s && s.tool === 'shape' && (s.shapeType || 'axes') === 'axes') {
        normalizeShapePoints(s);
        if (selectedAxesIdx === -1) selectedAxesIdx = i;
      }
    }

    function findLastAxesIndex() {
      for (let i = state.strokes.length - 1; i >= 0; i--) {
        const s = state.strokes[i];
        if (s && s.tool === 'shape' && (s.shapeType || 'axes') === 'axes') return i;
      }
      return -1;
    }

    function rebuild() {
      baseCtx.clearRect(0, 0, baseCanvas.width, baseCanvas.height);
      state.strokes.forEach(s => paintStrokeOnContext(baseCtx, s, strokeCanvas, strokeCtx, dpr));
      redraw();
      syncUI();
    }

    function redraw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(baseCanvas, 0, 0);
      if (activeStroke) {
        paintStrokeOnContext(ctx, activeStroke, strokeCanvas, strokeCtx, dpr, true);
      } else if (
        selectedAxesIdx >= 0 &&
        selectedAxesIdx < state.strokes.length &&
        state.strokes[selectedAxesIdx] &&
        state.strokes[selectedAxesIdx].tool === 'shape' &&
        (state.strokes[selectedAxesIdx].shapeType || 'axes') === 'axes' &&
        state.tool !== 'cursor' &&
        state.tool !== 'eraser'
      ) {
        drawAxesHandles(
          ctx,
          state.strokes[selectedAxesIdx],
          dpr,
          activeAxesDrag ? activeAxesDrag.handleId : hoveredAxesHandleId
        );
      }
    }

    function ptFromEvent(e) {
      const r = canvas.getBoundingClientRect();
      const x = (e.clientX - r.left) * stageW / r.width;
      const y = (e.clientY - r.top) * stageH / r.height;
      const w = state.tool === 'eraser' ? state.size * 5.2 : state.tool === 'highlight' ? state.size * 4.2 : state.size;
      return { x, y, w };
    }

    canvas.addEventListener('pointerdown', e => {
      if (state.tool === 'cursor' || e.button !== 0) return;
      e.preventDefault();
      const p0 = ptFromEvent(e);

      // 优先检测是否点击在已生成坐标系的 ±x / ±y 半轴调节手柄（或原点平移手柄）上
      if (state.tool !== 'eraser') {
        const hit = hitTestAxesHandle(state.strokes, p0, selectedAxesIdx, 18);
        if (hit && (hit.strokeIndex === selectedAxesIdx || (state.tool === 'shape' && state.shapeType === 'axes'))) {
          state.undo.push(cloneStrokes(state.strokes));
          state.redo = [];
          selectedAxesIdx = hit.strokeIndex;
          activePid = e.pointerId;
          activeAxesDrag = {
            strokeIndex: hit.strokeIndex,
            handleId: hit.handle.id,
            startBounds: { ...getAxesBounds(hit.stroke) },
            startPt: p0
          };
          canvas.setPointerCapture(e.pointerId);
          rebuild();
          return;
        }
        if (state.tool === 'shape' && state.shapeType === 'axes') {
          const hitAxisIdx = hitTestAxesStroke(state.strokes, p0, 12);
          if (hitAxisIdx >= 0 && hitAxisIdx !== selectedAxesIdx) {
            selectedAxesIdx = hitAxisIdx;
            redraw();
            return;
          }
        }
      }

      if (state.tool !== 'shape' || state.shapeType !== 'axes') {
        selectedAxesIdx = -1;
      }

      activePid = e.pointerId;
      activeStroke = {
        tool: state.tool,
        color: state.color,
        size: state.size,
        dashed: state.dashed,
        shapeType: state.shapeType,
        points: [p0]
      };
      canvas.setPointerCapture(e.pointerId);
      redraw();
    });

    canvas.addEventListener('pointermove', e => {
      const p = ptFromEvent(e);
      if (activeAxesDrag && e.pointerId === activePid) {
        e.preventDefault();
        const targetStroke = state.strokes[activeAxesDrag.strokeIndex];
        if (targetStroke) {
          applyAxesHandleDrag(targetStroke, activeAxesDrag.handleId, p, activeAxesDrag.startBounds, activeAxesDrag.startPt);
          rebuild();
        }
        return;
      }
      if (!activeStroke || e.pointerId !== activePid) {
        if (state.tool !== 'cursor' && state.tool !== 'eraser' && selectedAxesIdx >= 0) {
          const hit = hitTestAxesHandle(state.strokes, p, selectedAxesIdx, 18);
          const nextHover = (hit && hit.strokeIndex === selectedAxesIdx) ? hit.handle.id : null;
          canvas.style.cursor = (hit && hit.strokeIndex === selectedAxesIdx) ? hit.handle.cursor : 'crosshair';
          if (nextHover !== hoveredAxesHandleId) {
            hoveredAxesHandleId = nextHover;
            redraw();
          }
        } else if (canvas.style.cursor !== 'crosshair') {
          canvas.style.cursor = 'crosshair';
        }
        return;
      }
      e.preventDefault();
      const last = activeStroke.points[activeStroke.points.length - 1];
      if (Math.hypot(p.x - last.x, p.y - last.y) > 0.2) {
        activeStroke.points.push(p);
        redraw();
      }
    });

    function endStroke(e, cancel = false) {
      if (activeAxesDrag && e.pointerId === activePid) {
        activeAxesDrag = null;
        activePid = null;
        if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
        rebuild();
        return;
      }
      if (!activeStroke || e.pointerId !== activePid) return;
      if (!cancel) {
        activeStroke.points.push(ptFromEvent(e));
        if (activeStroke.tool === 'shape') {
          activeStroke.points = normalizeShapePoints(activeStroke);
        }
        state.undo.push(cloneStrokes(state.strokes));
        state.redo = [];
        state.strokes.push(activeStroke);
        if (activeStroke.tool === 'shape' && (activeStroke.shapeType || 'axes') === 'axes') {
          selectedAxesIdx = state.strokes.length - 1;
        }
      }
      activeStroke = null;
      activePid = null;
      if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
      rebuild();
    }

    canvas.addEventListener('pointerup', e => endStroke(e, false));
    canvas.addEventListener('pointercancel', e => endStroke(e, true));

    container.querySelector('.ink-demo-toolbar').addEventListener('click', e => {
      const btn = e.target.closest('button');
      if (!btn) return;
      if (btn.dataset.demoTool) {
        const t = btn.dataset.demoTool;
        if (['pen', 'highlight', 'shape'].includes(t)) {
          if (state.tool === t) subMenu.classList.toggle('open');
          else subMenu.classList.add('open');
          state.tool = t;
          const prof = profiles[t];
          state.color = prof.color;
          state.size = prof.size;
          state.dashed = prof.dashed;
          if (prof.shapeType) state.shapeType = prof.shapeType;
          if (t === 'shape' && state.shapeType === 'axes' && selectedAxesIdx === -1) {
            selectedAxesIdx = findLastAxesIndex();
          }
        } else {
          state.tool = t;
          subMenu.classList.remove('open');
        }
        redraw();
        syncUI();
      } else if (btn.dataset.demoShape) {
        state.tool = 'shape';
        state.shapeType = btn.dataset.demoShape;
        profiles.shape.shapeType = state.shapeType;
        if (state.shapeType === 'axes' && selectedAxesIdx === -1) {
          selectedAxesIdx = findLastAxesIndex();
        }
        redraw();
        syncUI();
      } else if (btn.dataset.demoDash) {
        state.dashed = !state.dashed;
        if (profiles[state.tool]) profiles[state.tool].dashed = state.dashed;
        syncUI();
      } else if (btn.dataset.demoSize) {
        state.size = +btn.dataset.demoSize;
        if (profiles[state.tool]) profiles[state.tool].size = state.size;
        syncUI();
      } else if (btn.dataset.demoColor) {
        state.color = btn.dataset.demoColor;
        if (!['pen', 'highlight', 'shape'].includes(state.tool)) state.tool = 'pen';
        profiles[state.tool].color = state.color;
        syncUI();
      } else if (btn.id === 'demoUndo') {
        if (!state.undo.length) return;
        state.redo.push(cloneStrokes(state.strokes));
        state.strokes = state.undo.pop();
        selectedAxesIdx = findLastAxesIndex();
        rebuild();
      } else if (btn.id === 'demoRedo') {
        if (!state.redo.length) return;
        state.undo.push(cloneStrokes(state.strokes));
        state.strokes = state.redo.pop();
        selectedAxesIdx = findLastAxesIndex();
        rebuild();
      } else if (btn.id === 'demoClear') {
        if (!state.strokes.length) return;
        state.undo.push(cloneStrokes(state.strokes));
        state.redo = [];
        state.strokes = [];
        selectedAxesIdx = -1;
        rebuild();
      } else if (btn.id === 'demoFold') {
        foldDemoToolbar();
      }
    });

    rebuild();
    return { state, rebuild };
  }

  global.InkAnnotationLayer = {
    INK_STAGE_W,
    INK_STAGE_H,
    TOOLS,
    SHAPES,
    STROKE_SIZES,
    COLORS,
    ACTION_ICONS,
    createDefaultProfiles,
    drawInkArrowHead,
    normalizeShapePoints,
    getAxesBounds,
    cloneStroke,
    cloneStrokes,
    getAxesHandles,
    hitTestAxesHandle,
    hitTestAxesStroke,
    applyAxesHandleDrag,
    drawAxesHandles,
    traceShapePath,
    traceBezierPath,
    paintStrokeOnContext,
    upgradeToolbarDOM,
    setupCoursewareToolbar,
    injectStyles,
    createInteractiveDemo
  };
})(typeof window !== 'undefined' ? window : globalThis);

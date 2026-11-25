window.COURSEWARE_BRAND = "北师大版九下 · 第三章";
window.COURSEWARE_TITLE = "3.1.2 垂径定理";
window.COURSEWARE_PHASES = [
  ['① 情境引入', '圆的轴对称性激活'],
  ['② 新知探究', '垂径定理及其推论'],
  ['③ 新知应用', '第1—5题多元迁移'],
  ['④ 分层训练', '拓展建模与课堂小结']
];

(function () {
  // 真实数学坐标圆绘制辅助（严格要求 equalAspect: true）
  function drawMathCircle(cv, cxMath, cyMath, R, cfg) {
    const o = cfg || {};
    const cx = cv.px(cxMath);
    const cy = cv.py(cyMath);
    const rp = R * cv.scaleX;
    const fill = o.fill !== undefined ? o.fill : 'rgba(37,99,235,0.04)';
    const stroke = o.stroke || '#1e293b';
    const width = o.width !== undefined ? o.width : 2.5;
    const dash = o.dash ? ` stroke-dasharray="${o.dash}"` : '';
    cv.raw(`<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${rp.toFixed(1)}" fill="${fill}" stroke="${stroke}" stroke-width="${width}"${dash}/>`);
  }

  // 圆心在 (0,0)、半径为 R 的圆弧精确绘制辅助
  // ccwMath = true 表示数学坐标系逆时针方向（屏幕逆时针 sweep=0），false 表示顺时针方向（屏幕顺时针 sweep=1）
  function drawCenterArc(cv, R, deg1, deg2, ccwMath, cfg) {
    const o = cfg || {};
    const r1 = (deg1 * Math.PI) / 180;
    const r2 = (deg2 * Math.PI) / 180;
    const x1 = cv.px(R * Math.cos(r1));
    const y1 = cv.py(R * Math.sin(r1));
    const x2 = cv.px(R * Math.cos(r2));
    const y2 = cv.py(R * Math.sin(r2));
    const rp = R * cv.scaleX;
    let span = ccwMath ? (deg2 - deg1) : (deg1 - deg2);
    while (span <= 0) span += 360;
    while (span > 360) span -= 360;
    const largeArc = span > 180 ? 1 : 0;
    const sweep = ccwMath ? 0 : 1;
    const stroke = o.stroke || '#2563eb';
    const width = o.width !== undefined ? o.width : 4;
    const dash = o.dash ? ` stroke-dasharray="${o.dash}"` : '';
    cv.raw(`<path d="M ${x1.toFixed(1)} ${y1.toFixed(1)} A ${rp.toFixed(1)} ${rp.toFixed(1)} 0 ${largeArc} ${sweep} ${x2.toFixed(1)} ${y2.toFixed(1)}" fill="none" stroke="${stroke}" stroke-width="${width}"${dash} stroke-linecap="round"/>`);
  }

  // 线段等长短杠标记辅助（count = 1 单短杠, count = 2 双短杠）
  function drawSegTicks(cv, p1, p2, count, cfg) {
    const o = cfg || {};
    const [x1, y1] = cv.pt(p1);
    const [x2, y2] = cv.pt(p2);
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.hypot(dx, dy) || 1;
    const ux = dx / len;
    const uy = dy / len;
    const nx = -uy;
    const ny = ux;
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    const half = o.halfLen || 5.8;
    const gap = o.gap || 4.8;
    const color = o.color || '#dc2626';
    const width = o.width || 2.1;
    const n = count || 1;
    for (let i = 0; i < n; i++) {
      const off = (i - (n - 1) / 2) * gap;
      const cx = mx + ux * off;
      const cy = my + uy * off;
      cv.raw(`<line x1="${(cx - nx * half).toFixed(1)}" y1="${(cy - ny * half).toFixed(1)}" x2="${(cx + nx * half).toFixed(1)}" y2="${(cy + ny * half).toFixed(1)}" stroke="${color}" stroke-width="${width}" stroke-linecap="round"/>`);
    }
  }

  // 圆弧中点处等弧短杠标记辅助（在圆心角 degMid 方向画小径向短杠）
  function drawArcTicks(cv, R, degMid, count, cfg) {
    const o = cfg || {};
    const half = o.halfLen || 5.2;
    const degGap = o.degGap || 3.4;
    const color = o.color || '#2563eb';
    const width = o.width || 2.0;
    const rp = R * cv.scaleX;
    const ox = cv.px(0);
    const oy = cv.py(0);
    const n = count || 1;
    for (let i = 0; i < n; i++) {
      const ang = ((degMid + (i - (n - 1) / 2) * degGap) * Math.PI) / 180;
      const ux = Math.cos(ang);
      const uy = -Math.sin(ang);
      const x1 = ox + ux * (rp - half);
      const y1 = oy + uy * (rp - half);
      const x2 = ox + ux * (rp + half);
      const y2 = oy + uy * (rp + half);
      cv.raw(`<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${color}" stroke-width="${width}" stroke-linecap="round"/>`);
    }
  }

  // =========================================================================
  // Slide 1：标准教学封面页
  // =========================================================================
  window.defineSlide({
    cover: true,
    chapter: "北师大版九年级数学下册 · 第三章 圆",
    num: "<span class='num'>3.1.2</span>",
    title: "垂径定理",
    chapterTheme: "circle",
    caption: "圆的轴对称性 · 垂径定理及其推论",
    goals: [
      "理解圆的轴对称性，经历探索并证明垂径定理及其推论的过程，掌握垂径定理及其推论；（<b>重点</b>）",
      "学会运用垂径定理及其推论解决有关的证明、计算和作图问题．（<b>难点</b>）"
    ]
  });

  // =========================================================================
  // Slide 2：一、情境引入（圆的轴对称性与动态 3D 对折）
  // =========================================================================
  function syncSlide2State(step, state) {
    if (step !== state._prevStep) {
      if (!window.isManualOverride(state, 'foldDeg')) {
        if (step === 0) {
          state.foldDeg = 0;
          state.axisDeg = 90;
        } else if (step === 1) {
          state.foldDeg = 140;
        } else if (step >= 2) {
          state.foldDeg = 0;
        }
      }
      state._prevStep = step;
    }
  }

  window.defineSlide({
    phase: 0,
    navTag: "引入·圆对称性",
    section: "情境引入",
    title: "情境引入：探索圆的轴对称性",
    layout: "layout-ppt",
    stem: '<p><span class="num">1．</span>如图，圆是轴对称图形吗？如果是，它的对称轴是什么？你能找到多少条对称轴？你是用什么方法解决上述问题的？</p>',
    steps: [
      { title: "折叠重合探究" },
      { title: "判定对称轴（直线）" },
      { title: "归纳无数条对称轴" }
    ],
    onInit(state) {
      state.foldDeg = 0;
      state.axisDeg = 90;
      state._prevStep = 0;
    },
    controls(step, state) {
      syncSlide2State(step, state);
      if (step < 1) return '';
      let html = window.slider('foldDeg', '3D折叠', 0, 180, state.foldDeg, 5, '°') +
        '<button type="button" class="step-btn" onclick="window.toggle3DFoldAnim()">▶ 对折演示</button>';
      if (step >= 2) {
        html += window.slider('axisDeg', '旋转对称轴', 0, 175, state.axisDeg, 5, '°');
      }
      return html;
    },
    renderBody(step, state) {
      syncSlide2State(step, state);
      const cv = window.createCoordCanvas({
        width: 480,
        height: 390,
        xRange: [-4.4, 4.4],
        yRange: [-4.0, 4.0],
        equalAspect: true,
        padding: { left: 16, right: 16, top: 14, bottom: 14 }
      });
      const R = 3.35;
      const foldDeg = Number(state.foldDeg || 0);
      const axisDeg = state.axisDeg !== undefined ? Number(state.axisDeg) : 90;
      const axisRad = (axisDeg * Math.PI) / 180;
      const ux = Math.cos(axisRad);
      const uy = Math.sin(axisRad);

      const nearHoriz = (axisDeg < 22 || axisDeg > 158);
      const oLabelCfg = nearHoriz
        ? { label: 'O', dx: 0, dy: 23, fontSize: 18, anchor: 'middle', color: '#0f172a', r: 4.6 }
        : { label: 'O', dx: 15, dy: 6, fontSize: 18, anchor: 'start', color: '#0f172a', r: 4.6 };

      if (step === 0 && foldDeg <= 0.5) {
        drawMathCircle(cv, 0, 0, R, { fill: 'rgba(37,99,235,0.04)', stroke: '#1e293b', width: 2.7 });
        cv.drawPoint([0, 0], { label: 'O', dx: 11, dy: 19, fontSize: 18, color: '#0f172a', r: 4.6 });
      } else if (foldDeg > 0.5) {
        window.draw3DFoldCircle(cv, { R: R, axisDeg: axisDeg, foldDeg: foldDeg });
        cv.drawSegment([-3.95 * ux, -3.95 * uy], [3.95 * ux, 3.95 * uy], {
          color: '#dc2626',
          width: 2.6,
          dash: '7,5'
        });
        cv.drawPoint([0, 0], oLabelCfg);
      } else {
        drawMathCircle(cv, 0, 0, R, { fill: 'rgba(37,99,235,0.04)', stroke: '#1e293b', width: 2.7 });
        if (step >= 3) {
          [30, 60, 120, 150].forEach(ang => {
            const diff = Math.abs(ang - axisDeg);
            if (diff < 8 || diff > 172) return;
            const r = (ang * Math.PI) / 180;
            cv.drawSegment([-3.9 * Math.cos(r), -3.9 * Math.sin(r)], [3.9 * Math.cos(r), 3.9 * Math.sin(r)], {
              color: '#60a5fa',
              width: 1.8,
              dash: '5,4'
            });
          });
        }
        cv.drawSegment([-3.95 * ux, -3.95 * uy], [3.95 * ux, 3.95 * uy], {
          color: '#dc2626',
          width: 2.8,
          dash: '8,5'
        });
        cv.drawPoint([0, 0], oLabelCfg);
      }

      const lines = [
        {
          step: 1,
          html: '解：（<span class="num">1</span>）<b>探究方法：</b>将圆形纸片沿经过圆心<i class="m">O</i>的直线对折，两侧半圆能够完全重合（<b>折叠法</b>）．'
        },
        {
          step: 2,
          html: '（<span class="num">2</span>）<b>圆是轴对称图形</b>，它的对称轴是<b>任意一条经过圆心的直线</b>．<br><span style="color:#1e3a8a;font-size:25px;">（注意：对称轴是无限延伸的“直线”，不能说成“直径”！）</span>'
        },
        {
          step: 3,
          html: '（<span class="num">3</span>）因为经过圆心<i class="m">O</i>可以作无数条直线，所以圆有<b>无数条</b>对称轴．'
        }
      ];

      return window.pptExampleLayout({
        step,
        lines,
        rightSvg: cv.toSvg()
      });
    }
  });

  // =========================================================================
  // Slide 3：二、新知探究 问题1（含弦 AB 的圆折叠探索对称轴）
  // =========================================================================
  function syncSlide3State(step, state) {
    if (step !== state._prevStep) {
      if (!window.isManualOverride(state, 'foldDeg')) {
        if (step === 0) {
          state.foldDeg = 0;
        } else if (step === 1) {
          state.foldDeg = 145;
        } else if (step >= 2) {
          state.foldDeg = 0;
        }
      }
      state._prevStep = step;
    }
  }

  window.defineSlide({
    phase: 1,
    navTag: "问题1·对称轴",
    section: "新知探究",
    title: "问题<span class='num'>1</span>：折出对称轴",
    layout: "layout-ppt",
    stem: '<p><b>问题<span class="num">1</span>：</b>如图，<i class="m">AB</i>是<span class="num">⊙</span><i class="m">O</i>的一条弦，这个图形是轴对称图形吗？如果是，你能作出它的对称轴吗？</p>',
    steps: [
      { title: "沿过O直线对折使点A与点B重合" },
      { title: "作垂直于弦AB的直径CD所在直线" }
    ],
    onInit(state) {
      state.foldDeg = 0;
      state._prevStep = 0;
    },
    controls(step, state) {
      syncSlide3State(step, state);
      if (step < 1) return '';
      return window.slider('foldDeg', '3D折叠', 0, 180, state.foldDeg, 5, '°') +
        '<button type="button" class="step-btn" onclick="window.toggle3DFoldAnim()">▶ 对折演示</button>';
    },
    renderBody(step, state) {
      syncSlide3State(step, state);
      const cv = window.createCoordCanvas({
        width: 480,
        height: 390,
        xRange: [-4.4, 4.4],
        yRange: [-4.0, 4.0],
        equalAspect: true,
        padding: { left: 16, right: 16, top: 14, bottom: 14 }
      });
      const R = 3.35;
      const chordV = 1.55;
      const u = Math.sqrt(R * R - chordV * chordV);
      const foldDeg = Number(state.foldDeg || 0);

      if (step === 0 && foldDeg <= 0.5) {
        drawMathCircle(cv, 0, 0, R, { fill: 'rgba(37,99,235,0.04)', stroke: '#1e293b', width: 2.7 });
        cv.drawSegment([-u, chordV], [u, chordV], { color: '#0f172a', width: 2.8 });
        cv.drawPoint([-u, chordV], { label: 'A', dx: -16, dy: -6, fontSize: 18, color: '#0f172a', r: 4.6 });
        cv.drawPoint([u, chordV], { label: 'B', dx: 12, dy: -6, fontSize: 18, color: '#0f172a', r: 4.6 });
        cv.drawPoint([0, 0], { label: 'O', dx: 11, dy: 19, fontSize: 18, color: '#0f172a', r: 4.6 });
      } else if (foldDeg > 0.5) {
        window.draw3DFoldCircle(cv, {
          R: R,
          axisDeg: 90,
          foldDeg: foldDeg,
          chordV: chordV,
          showM: false
        });
        cv.drawSegment([0, -3.95], [0, 3.95], { color: '#dc2626', width: 2.6, dash: '7,5' });
        cv.drawPoint([0, 0], { label: 'O', dx: -16, dy: 8, fontSize: 18, color: '#0f172a', r: 4.6 });
      } else {
        drawMathCircle(cv, 0, 0, R, { fill: 'rgba(37,99,235,0.04)', stroke: '#1e293b', width: 2.7 });
        cv.drawSegment([-u, chordV], [u, chordV], { color: '#0f172a', width: 2.8 });
        cv.drawSegment([0, -3.95], [0, 3.95], { color: '#dc2626', width: 2.4, dash: '7,5' });
        if (step >= 2) {
          cv.drawSegment([0, -R], [0, R], { color: '#dc2626', width: 2.8 });
          cv.drawRightAngle([0, chordV], [u, chordV], [0, -R], 11, '#dc2626');
          cv.drawPoint([0, R], { label: 'C', dx: 11, dy: -6, fontSize: 18, color: '#dc2626', r: 4.6 });
          cv.drawPoint([0, -R], { label: 'D', dx: 11, dy: 19, fontSize: 18, color: '#dc2626', r: 4.6 });
          cv.drawPoint([0, chordV], { label: 'M', dx: -15, dy: -8, fontSize: 17.5, color: '#dc2626', r: 4.4 });
        }
        cv.drawPoint([-u, chordV], { label: 'A', dx: -16, dy: -6, fontSize: 18, color: '#0f172a', r: 4.6 });
        cv.drawPoint([u, chordV], { label: 'B', dx: 12, dy: -6, fontSize: 18, color: '#0f172a', r: 4.6 });
        cv.drawPoint([0, 0], { label: 'O', dx: -16, dy: 8, fontSize: 18, color: '#0f172a', r: 4.6 });
      }

      const lines = [
        {
          step: 1,
          html: '解：<b>这个图形是轴对称图形．</b><br>将圆沿经过圆心<i class="m">O</i>的直线对折，使点<i class="m">B</i>与点<i class="m">A</i>恰好重合，折痕两侧图形完全重合．'
        },
        {
          step: 2,
          html: '<b>对称轴作法：</b>过圆心<i class="m">O</i>作垂直于弦<i class="m">AB</i>的直径<i class="m">CD</i>（交<i class="m">AB</i>于点<i class="m">M</i>），则<b>直径<i class="m">CD</i>所在的直线</b>即为它的对称轴．'
        }
      ];

      return window.pptExampleLayout({
        step,
        lines,
        rightSvg: cv.toSvg()
      });
    }
  });

  // =========================================================================
  // Slide 4：二、新知探究 问题2(1)（严谨证明直线 CD 是图形的对称轴，PPT大字板书版）
  // =========================================================================
  window.defineSlide({
    phase: 1,
    navTag: "问题2·证对称",
    section: "新知探究",
    title: "问题<span class='num'>2(1)</span>：证明对称轴",
    layout: "layout-ppt",
    stem: '<p><b>问题<span class="num">2</span>：</b>小明认为这个图是轴对称图形，他作对称轴的方法是：如图，作直径<i class="m">CD</i>，使<span class="math"><i class="m">CD</i><span class="num">⊥</span><i class="m">AB</i></span>，垂足为<i class="m">M</i>．<b>你能证明直线<i class="m">CD</i>是这个图形的对称轴吗？</b></p>',
    steps: [
      { title: "连半径证点A与点B关于直线CD对称" },
      { title: "结合圆的对称性证整图沿直线CD重合" }
    ],
    renderBody(step) {
      const cv = window.createCoordCanvas({
        width: 460,
        height: 390,
        xRange: [-4.2, 4.2],
        yRange: [-4.1, 4.1],
        equalAspect: true,
        padding: { left: 16, right: 16, top: 14, bottom: 14 }
      });
      const R = 3.35;
      const chordV = 1.55;
      const u = Math.sqrt(R * R - chordV * chordV);
      const degB = (Math.atan2(chordV, u) * 180) / Math.PI;
      const degA = 180 - degB;

      drawMathCircle(cv, 0, 0, R, {
        fill: step >= 2 ? 'rgba(37,99,235,0.06)' : 'rgba(37,99,235,0.03)',
        stroke: step >= 2 ? '#1d4ed8' : '#1e293b',
        width: 2.8
      });

      if (step >= 1) {
        cv.drawPolygon([[0, 0], [-u, chordV], [u, chordV]], {
          fill: 'rgba(59,130,246,0.14)',
          stroke: 'none',
          width: 0
        });
        cv.drawSegment([0, 0], [-u, chordV], { color: '#dc2626', width: 2.5, dash: '6,4' });
        cv.drawSegment([0, 0], [u, chordV], { color: '#dc2626', width: 2.5, dash: '6,4' });
        drawSegTicks(cv, [0, 0], [-u, chordV], 1, { color: '#dc2626' });
        drawSegTicks(cv, [0, 0], [u, chordV], 1, { color: '#dc2626' });
      }

      if (step >= 2) {
        drawCenterArc(cv, R, degA, degB, false, { stroke: '#2563eb', width: 3.8 });
        cv.drawSegment([0, -3.95], [0, 3.95], { color: '#dc2626', width: 2.6, dash: '8,5' });
      }

      cv.drawSegment([-u, chordV], [u, chordV], { color: '#0f172a', width: 2.8 });
      cv.drawSegment([0, -R], [0, R], { color: step >= 2 ? '#dc2626' : '#0f172a', width: 2.7 });
      cv.drawRightAngle([0, chordV], [u, chordV], [0, -R], 11, step >= 1 ? '#dc2626' : '#475569');

      if (step >= 1) {
        drawSegTicks(cv, [-u, chordV], [0, chordV], 2, { color: '#2563eb' });
        drawSegTicks(cv, [0, chordV], [u, chordV], 2, { color: '#2563eb' });
      }

      cv.drawPoint([-u, chordV], { label: 'A', dx: -16, dy: -6, fontSize: 18, color: '#0f172a', r: 4.8 });
      cv.drawPoint([u, chordV], { label: 'B', dx: 12, dy: -6, fontSize: 18, color: '#0f172a', r: 4.8 });
      cv.drawPoint([0, R], { label: 'C', dx: 11, dy: -6, fontSize: 18, color: step >= 2 ? '#dc2626' : '#0f172a', r: 4.8 });
      cv.drawPoint([0, -R], { label: 'D', dx: 11, dy: 20, fontSize: 18, color: step >= 2 ? '#dc2626' : '#0f172a', r: 4.8 });
      cv.drawPoint([0, chordV], { label: 'M', dx: -15, dy: -8, fontSize: 17.5, color: '#0f172a', r: 4.5 });
      cv.drawPoint([0, 0], { label: 'O', dx: 13, dy: 20, fontSize: 18, color: '#0f172a', r: 4.8 });

      const lines = [
        {
          step: 1,
          html: window.formalProofStep([
            { head: '证明：连接<i class="m">OA</i>，<i class="m">OB</i>．' },
            { sym: '∵', text: '<span class="math"><i class="m">OA</i><span class="num">=</span><i class="m">OB</i></span>，∴ <span class="tri-sym">△</span><i class="m">OAB</i>是等腰三角形．' },
            { sym: '∵', text: '<span class="math"><i class="m">CD</i><span class="num">⊥</span><i class="m">AB</i></span>于点<i class="m">M</i>，' },
            { sym: '∴', text: '<span class="math"><i class="m">AM</i><span class="num">=</span><i class="m">BM</i></span>（等腰三角形“三线合一”），即点<i class="m">A</i>、<i class="m">B</i>关于直线<i class="m">CD</i>对称．' }
          ])
        },
        {
          step: 2,
          html: window.formalProofStep([
            { sym: '∵', text: '直径<i class="m">CD</i>过圆心<i class="m">O</i>，<span class="num">⊙</span><i class="m">O</i>关于直线<i class="m">CD</i>对称，' },
            { sym: '∴', text: '沿直线<i class="m">CD</i>折叠时，圆与弦<i class="m">AB</i>两侧均完全重合，故<span style="color:#1d4ed8;">直线<i class="m">CD</i>是它的对称轴</span>．' }
          ])
        }
      ];

      return window.pptExampleLayout({
        step: step,
        lines: lines,
        rightSvg: cv.toSvg()
      });
    }
  });

  // =========================================================================
  // Slide 5：二、新知探究 问题2(2)（发现等量关系与提出猜想，layout-ppt + pptInferDiagram）
  // =========================================================================
  window.defineSlide({
    phase: 1,
    navTag: "问题2·提猜想",
    section: "新知探究",
    title: "问题<span class='num'>2(2)</span>：提出猜想",
    layout: "layout-ppt",
    stem: '<p><span style="color:#0369a1;font-weight:700;">【前问已知】</span>已证直径<i class="m">CD</i>垂直于弦<i class="m">AB</i>时，直线<i class="m">CD</i>是整个图形的对称轴．<br><b>思考：</b>根据以上对称重合过程，你能发现图中有哪些等量关系？<b>提出你的猜想．</b></p>',
    steps: [
      { title: "梳理条件与对称轴" },
      { title: "推出三条等量关系猜想" }
    ],
    renderBody(step) {
      const cv = window.createCoordCanvas({
        width: 380,
        height: 365,
        xRange: [-4.0, 4.0],
        yRange: [-4.1, 4.1],
        equalAspect: true,
        padding: { left: 14, right: 14, top: 14, bottom: 14 }
      });
      const R = 3.25;
      const yM = 1.5;
      const u = Math.sqrt(R * R - yM * yM);
      const degB = (Math.atan2(yM, u) * 180) / Math.PI;
      const degA = 180 - degB;

      drawMathCircle(cv, 0, 0, R, { fill: 'rgba(37,99,235,0.03)', stroke: '#1e293b', width: 2.6 });

      if (step >= 2) {
        drawCenterArc(cv, R, degA, degB, false, { stroke: '#0d9488', width: 4.5 });
        drawCenterArc(cv, R, degA, degB, true, { stroke: '#4f46e5', width: 4.5 });
        drawArcTicks(cv, R, (degA + 90) / 2, 1, { color: '#0d9488' });
        drawArcTicks(cv, R, (90 + degB) / 2, 1, { color: '#0d9488' });
        drawArcTicks(cv, R, 225, 2, { color: '#4f46e5', degGap: 4.0 });
        drawArcTicks(cv, R, 315, 2, { color: '#4f46e5', degGap: 4.0 });
      }

      cv.drawSegment([0, 0], [-u, yM], { color: '#2563eb', width: 2.2, dash: '6,4' });
      cv.drawSegment([0, 0], [u, yM], { color: '#2563eb', width: 2.2, dash: '6,4' });
      cv.drawSegment([-u, yM], [u, yM], { color: '#0f172a', width: 2.7 });
      cv.drawSegment([0, -3.9], [0, 3.9], { color: '#dc2626', width: 2.2, dash: '7,4' });
      cv.drawSegment([0, -R], [0, R], { color: '#dc2626', width: 2.5 });
      cv.drawRightAngle([0, yM], [u, yM], [0, -R], 10, '#dc2626');

      if (step >= 2) {
        drawSegTicks(cv, [-u, yM], [0, yM], 2, { color: '#dc2626', halfLen: 5.8, gap: 4.6 });
        drawSegTicks(cv, [0, yM], [u, yM], 2, { color: '#dc2626', halfLen: 5.8, gap: 4.6 });
      }

      cv.drawPoint([-u, yM], { label: 'A', dx: -16, dy: -5, fontSize: 17.5, color: '#0f172a', r: 4.5 });
      cv.drawPoint([u, yM], { label: 'B', dx: 11, dy: -5, fontSize: 17.5, color: '#0f172a', r: 4.5 });
      cv.drawPoint([0, R], { label: 'C', dx: 10, dy: -6, fontSize: 17.5, color: '#dc2626', r: 4.5 });
      cv.drawPoint([0, -R], { label: 'D', dx: 10, dy: 18, fontSize: 17.5, color: '#dc2626', r: 4.5 });
      cv.drawPoint([0, yM], { label: 'M', dx: -14, dy: -8, fontSize: 17, color: '#0f172a', r: 4.2 });
      cv.drawPoint([0, 0], { label: 'O', dx: 12, dy: 18, fontSize: 17.5, color: '#0f172a', r: 4.5 });

      return window.pptInferDiagram({
        step: step,
        leftSvg: cv.toSvg(),
        condTitle: "条件",
        conds: [
          '① <i class="m">CD</i>是<span class="num">⊙</span><i class="m">O</i>的直径',
          '② <span class="math"><i class="m">CD</i><span class="num">⊥</span><i class="m">AB</i></span>'
        ],
        arrowText: "可推得",
        resTitle: "猜想结论",
        results: [
          '③ <span class="math"><i class="m">AM</i><span class="num">=</span><i class="m">BM</i></span>',
          `④ <span class="math">${window.arcHtml('AC')}<span class="num">=</span>${window.arcHtml('BC')}</span>`,
          `⑤ <span class="math">${window.arcHtml('AD')}<span class="num">=</span>${window.arcHtml('BD')}</span>`
        ],
        cloudNote: '<i class="m">CD</i>所在直线是<span class="num">⊙</span><i class="m">O</i>的对称轴'
      });
    }
  });

  // =========================================================================
  // Slide 6：二、新知探究 问题3（垂径定理的严谨证明，PPT大字板书版）
  // =========================================================================
  window.defineSlide({
    phase: 1,
    navTag: "问题3·证定理",
    section: "新知探究",
    title: "问题<span class='num'>3</span>：证明垂径定理",
    layout: "layout-ppt",
    stem: `<p><b>问题<span class="num">3</span>：</b>能不能用所学过的知识证明你的猜想？<br><b>已知：</b>如图，<i class="m">AB</i>是<span class="num">⊙</span><i class="m">O</i>的一条弦，<i class="m">CD</i>是<span class="num">⊙</span><i class="m">O</i>的一条直径，且<span class="math"><i class="m">CD</i><span class="num">⊥</span><i class="m">AB</i></span>，垂足为<i class="m">M</i>．<b>求证：</b><span class="math"><i class="m">AM</i><span class="num">=</span><i class="m">BM</i></span>，<span class="math">${window.arcHtml('AC')}<span class="num">=</span>${window.arcHtml('BC')}</span>，<span class="math">${window.arcHtml('AD')}<span class="num">=</span>${window.arcHtml('BD')}</span>．</p>`,
    steps: [
      { title: "连半径得等腰三角形" },
      { title: "三线合一证平分弦" },
      { title: "轴对称重合证平分两条弧" }
    ],
    renderBody(step) {
      const cv = window.createCoordCanvas({
        width: 460,
        height: 390,
        xRange: [-4.1, 4.1],
        yRange: [-3.9, 3.9],
        equalAspect: true,
        padding: { left: 16, right: 16, top: 14, bottom: 14 }
      });
      const R = 3.35;
      const yM = 1.52;
      const u = Math.sqrt(R * R - yM * yM);
      const degB = (Math.atan2(yM, u) * 180) / Math.PI;
      const degA = 180 - degB;

      drawMathCircle(cv, 0, 0, R, { fill: 'rgba(37,99,235,0.03)', stroke: '#1e293b', width: 2.7 });

      if (step >= 1) {
        cv.drawPolygon([[0, 0], [-u, yM], [u, yM]], {
          fill: 'rgba(249,115,22,0.14)',
          stroke: 'none',
          width: 0
        });
        cv.drawSegment([0, 0], [-u, yM], { color: '#dc2626', width: 2.5, dash: '6,4' });
        cv.drawSegment([0, 0], [u, yM], { color: '#dc2626', width: 2.5, dash: '6,4' });
        drawSegTicks(cv, [0, 0], [-u, yM], 1, { color: '#dc2626' });
        drawSegTicks(cv, [0, 0], [u, yM], 1, { color: '#dc2626' });
      }

      if (step >= 3) {
        drawCenterArc(cv, R, degA, degB, false, { stroke: '#2563eb', width: 4.5 });
        drawCenterArc(cv, R, degA, degB, true, { stroke: '#16a34a', width: 4.5 });
        drawArcTicks(cv, R, (degA + 90) / 2, 1, { color: '#2563eb' });
        drawArcTicks(cv, R, (90 + degB) / 2, 1, { color: '#2563eb' });
        drawArcTicks(cv, R, 225, 2, { color: '#16a34a', degGap: 3.8 });
        drawArcTicks(cv, R, 315, 2, { color: '#16a34a', degGap: 3.8 });
      }

      cv.drawSegment([-u, yM], [u, yM], { color: '#0f172a', width: 2.8 });
      cv.drawSegment([0, -R], [0, R], { color: step >= 2 ? '#dc2626' : '#0f172a', width: 2.6 });
      cv.drawRightAngle([0, yM], [u, yM], [0, -R], 10.5, step >= 2 ? '#dc2626' : '#475569');

      if (step >= 2) {
        drawSegTicks(cv, [-u, yM], [0, yM], 2, { color: '#dc2626', halfLen: 6, gap: 4.8 });
        drawSegTicks(cv, [0, yM], [u, yM], 2, { color: '#dc2626', halfLen: 6, gap: 4.8 });
      }

      cv.drawPoint([-u, yM], { label: 'A', dx: -16, dy: -5, fontSize: 18, color: '#0f172a', r: 4.6 });
      cv.drawPoint([u, yM], { label: 'B', dx: 11, dy: -5, fontSize: 18, color: '#0f172a', r: 4.6 });
      cv.drawPoint([0, R], { label: 'C', dx: 10, dy: -7, fontSize: 18, color: '#0f172a', r: 4.6 });
      cv.drawPoint([0, -R], { label: 'D', dx: 10, dy: 19, fontSize: 18, color: '#0f172a', r: 4.6 });
      cv.drawPoint([0, yM], { label: 'M', dx: -14, dy: -8, fontSize: 17.5, color: '#0f172a', r: 4.4 });
      cv.drawPoint([0, 0], { label: 'O', dx: 12, dy: 19, fontSize: 18, color: '#0f172a', r: 4.6 });

      const lines = [
        {
          step: 1,
          html: window.formalProofStep([
            { head: '证明：连接<i class="m">OA</i>，<i class="m">OB</i>．' },
            { sym: '∵', text: '<span class="math"><i class="m">OA</i><span class="num">=</span><i class="m">OB</i></span>，∴ <span class="tri-sym">△</span><i class="m">OAB</i>是等腰三角形．' }
          ])
        },
        {
          step: 2,
          html: window.formalProofStep([
            { sym: '∵', text: '<span class="math"><i class="m">CD</i><span class="num">⊥</span><i class="m">AB</i></span>，垂足为<i class="m">M</i>，' },
            { sym: '∴', text: '<span class="math"><i class="m">AM</i><span class="num">=</span><i class="m">BM</i></span>（等腰三角形“三线合一”）．' }
          ])
        },
        {
          step: 3,
          html: window.formalProofStep([
            { sym: '∵', text: '<span class="num">⊙</span><i class="m">O</i>关于直线<i class="m">CD</i>对称，沿直径<i class="m">CD</i>对折时点<i class="m">A</i>与点<i class="m">B</i>重合，' },
            { sym: '∴', text: `<span style="color:#1d4ed8;">${window.arcHtml('AC')}<span class="num">=</span>${window.arcHtml('BC')}</span>，<span style="color:#15803d;">${window.arcHtml('AD')}<span class="num">=</span>${window.arcHtml('BD')}</span>．` }
          ])
        }
      ];

      return window.pptExampleLayout({
        step: step,
        lines: lines,
        rightSvg: cv.toSvg()
      });
    }
  });

  // =========================================================================
  // Slide 7：垂径定理归纳表（三重表征对照，layout-ppt + pptThreeColTable）
  // =========================================================================
  window.defineSlide({
    phase: 1,
    navTag: "归纳·垂径定理",
    section: "新知探究",
    title: "归纳：垂径定理",
    layout: "layout-ppt",
    stem: '<p>通过以上探究与证明，归纳圆的重要性质——<b>垂径定理</b>（与学案三栏表同步）：</p>',
    steps: [
      { title: "揭晓文字语言" },
      { title: "揭晓符号语言与图形标记" }
    ],
    renderBody(step) {
      const col1Html = `垂直于弦的直径<span class="tri-blank ${step >= 1 ? 'is-filled' : ''}">平分弦</span>，<br>并且<span class="tri-blank is-blue ${step >= 1 ? 'is-filled' : ''}">平分弦所对的两条弧</span>．`;

      const cv = window.createCoordCanvas({
        width: 340,
        height: 300,
        xRange: [-4.2, 4.2],
        yRange: [-4.2, 4.2],
        equalAspect: true,
        padding: { left: 20, right: 20, top: 20, bottom: 20 }
      });
      const R = 3.2;
      const yM = 1.45;
      const u = Math.sqrt(R * R - yM * yM);
      const degB = (Math.atan2(yM, u) * 180) / Math.PI;
      const degA = 180 - degB;

      drawMathCircle(cv, 0, 0, R, { fill: 'rgba(37,99,235,0.03)', stroke: '#1e293b', width: 2.4 });

      if (step >= 2) {
        drawCenterArc(cv, R, degA, degB, false, { stroke: '#2563eb', width: 4 });
        drawCenterArc(cv, R, degA, degB, true, { stroke: '#16a34a', width: 4 });
        drawArcTicks(cv, R, (degA + 90) / 2, 1, { color: '#2563eb' });
        drawArcTicks(cv, R, (90 + degB) / 2, 1, { color: '#2563eb' });
        drawArcTicks(cv, R, 225, 2, { color: '#16a34a', degGap: 3.8 });
        drawArcTicks(cv, R, 315, 2, { color: '#16a34a', degGap: 3.8 });
      }

      cv.drawSegment([-u, yM], [u, yM], { color: '#0f172a', width: 2.5 });
      cv.drawSegment([0, -R], [0, R], { color: '#dc2626', width: 2.6 });
      cv.drawRightAngle([0, yM], [u, yM], [0, -R], 9, '#dc2626');

      if (step >= 2) {
        drawSegTicks(cv, [-u, yM], [0, yM], 2, { color: '#dc2626', halfLen: 5.4, gap: 4.4 });
        drawSegTicks(cv, [0, yM], [u, yM], 2, { color: '#dc2626', halfLen: 5.4, gap: 4.4 });
      }

      cv.drawPoint([-u, yM], { label: 'A', dx: -15, dy: -5, fontSize: 15.5, color: '#0f172a', r: 4.0 });
      cv.drawPoint([u, yM], { label: 'B', dx: 10, dy: -5, fontSize: 15.5, color: '#0f172a', r: 4.0 });
      cv.drawPoint([0, R], { label: 'C', dx: 9, dy: -6, fontSize: 15.5, color: '#dc2626', r: 4.0 });
      cv.drawPoint([0, -R], { label: 'D', dx: 9, dy: 16, fontSize: 15.5, color: '#dc2626', r: 4.0 });
      cv.drawPoint([0, yM], { label: 'M', dx: -13, dy: -7, fontSize: 15, color: '#0f172a', r: 3.8 });
      cv.drawPoint([0, 0], { label: 'O', dx: 10, dy: 16, fontSize: 15.5, color: '#0f172a', r: 4.0 });

      const col3Html = window.formalProofStep([
        { sym: '∵', text: '<i class="m">CD</i>是<span class="num">⊙</span><i class="m">O</i>的直径，<span class="math"><i class="m">CD</i><span class="num">⊥</span><i class="m">AB</i></span>，' },
        { sym: '∴', text: `<span class="tri-blank ${step >= 2 ? 'is-filled' : ''}" style="min-width:250px;"><i class="m">AM</i><span class="num">=</span><i class="m">BM</i>，${window.arcHtml('AC')}<span class="num">=</span>${window.arcHtml('BC')}，${window.arcHtml('AD')}<span class="num">=</span>${window.arcHtml('BD')}</span>．` }
      ]);

      return window.pptThreeColTable({
        col1Title: "文字语言",
        col2Title: "图形语言",
        col3Title: "符号语言",
        col1Html: col1Html,
        col2Svg: cv.toSvg(),
        col3Html: col3Html
      });
    }
  });
})();

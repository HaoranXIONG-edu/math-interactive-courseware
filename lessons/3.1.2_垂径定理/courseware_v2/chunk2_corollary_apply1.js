// ============================================================================
// 北师大版九年级数学下册《3.1.2 垂径定理》动态讲解课件 · 第 2 分块（Slide 8 ～ Slide 12）
// 包含：追问1反例冲突探究、推论严谨证明、推论三栏归纳表、问题4弯道半径建模、应用题1四图辨析
// ============================================================================
(function() {
  'use strict';

  function drawCircleSvg(cv, R, cfg) {
    const o = cfg || {};
    const cx = cv.px(o.cx || 0).toFixed(1);
    const cy = cv.py(o.cy || 0).toFixed(1);
    const rp = (R * cv.scaleX).toFixed(1);
    const fill = o.fill || 'rgba(37,99,235,0.03)';
    const stroke = o.stroke || '#1e293b';
    const width = o.width !== undefined ? o.width : 2.5;
    const dash = o.dash ? ` stroke-dasharray="${o.dash}"` : '';
    cv.raw(`<circle cx="${cx}" cy="${cy}" r="${rp}" fill="${fill}" stroke="${stroke}" stroke-width="${width}"${dash}/>`);
  }

  // 逆时针数学角度圆弧（degStart -> degEnd，要求 0 < degEnd - degStart < 360）
  function drawMathArc(cv, R, degStart, degEnd, cfg) {
    const o = cfg || {};
    let span = degEnd - degStart;
    while (span <= 0) span += 360;
    if (span >= 359.9) {
      drawCircleSvg(cv, R, o);
      return;
    }
    const r1 = (degStart * Math.PI) / 180;
    const r2 = ((degStart + span) * Math.PI) / 180;
    const sx = cv.px(R * Math.cos(r1)).toFixed(1);
    const sy = cv.py(R * Math.sin(r1)).toFixed(1);
    const ex = cv.px(R * Math.cos(r2)).toFixed(1);
    const ey = cv.py(R * Math.sin(r2)).toFixed(1);
    const rp = (R * cv.scaleX).toFixed(1);
    const largeArc = span > 180 ? 1 : 0;
    const color = o.color || o.stroke || '#2563eb';
    const width = o.width !== undefined ? o.width : 3.6;
    const dash = o.dash ? ` stroke-dasharray="${o.dash}"` : '';
    cv.raw(`<path d="M ${sx} ${sy} A ${rp} ${rp} 0 ${largeArc} 0 ${ex} ${ey}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round"${dash}/>`);
  }

  // 线段中点等长短杠标记（count = 1 或 2）
  function drawTickMarks(cv, p1, p2, count, cfg) {
    const o = cfg || {};
    const [x1, y1] = cv.pt(p1);
    const [x2, y2] = cv.pt(p2);
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.hypot(dx, dy) || 1;
    const tx = dx / len;
    const ty = dy / len;
    const nx = -ty;
    const ny = tx;
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    const hl = o.len || 5.5;
    const gap = o.gap || 4.4;
    const color = o.color || '#0f172a';
    const width = o.width || 2.1;
    const n = count || 1;
    for (let i = 0; i < n; i++) {
      const shift = (i - (n - 1) / 2) * gap;
      const cx = mx + tx * shift;
      const cy = my + ty * shift;
      cv.raw(`<line x1="${(cx - nx * hl).toFixed(1)}" y1="${(cy - ny * hl).toFixed(1)}" x2="${(cx + nx * hl).toFixed(1)}" y2="${(cy + ny * hl).toFixed(1)}" stroke="${color}" stroke-width="${width}" stroke-linecap="round"/>`);
    }
  }

  // 支持实线或虚线的直角标
  function drawRightAngleCustom(cv, vertex, p1, p2, cfg) {
    const o = cfg || {};
    const size = o.size || 10.5;
    const color = o.color || '#dc2626';
    const width = o.width || 2.0;
    const dash = o.dash ? ` stroke-dasharray="${o.dash}"` : '';
    const [vx, vy] = cv.pt(vertex);
    const [x1, y1] = cv.pt(p1);
    const [x2, y2] = cv.pt(p2);
    const d1 = Math.hypot(x1 - vx, y1 - vy) || 1;
    const d2 = Math.hypot(x2 - vx, y2 - vy) || 1;
    const u1x = ((x1 - vx) / d1) * size;
    const u1y = ((y1 - vy) / d1) * size;
    const u2x = ((x2 - vx) / d2) * size;
    const u2y = ((y2 - vy) / d2) * size;
    cv.raw(`<polyline fill="none" stroke="${color}" stroke-width="${width}"${dash} points="${(vx + u1x).toFixed(1)},${(vy + u1y).toFixed(1)} ${(vx + u1x + u2x).toFixed(1)},${(vy + u1y + u2y).toFixed(1)} ${(vx + u2x).toFixed(1)},${(vy + u2y).toFixed(1)}"/>`);
  }

  // ==========================================================================
  // Slide 8：二、新知探究 追问1（“知二推三”反例冲突与推论猜想）
  // ==========================================================================
  window.defineSlide({
    lesson: 1,
    phase: 1,
    layout: 'layout-ppt',
    section: '新知探究',
    navTag: '追问1·举反例',
    title: '追问<span class="num">1</span>：反例与猜想',
    stem: '<p><b>追问<span class="num">1</span>：</b>垂径定理满足<b>①过圆心</b>、<b>②垂直于弦</b>，推出<b>③平分弦</b>、<b>④平分优弧</b>、<b>⑤平分劣弧</b>．若已知<b>①、③</b>，一定能推出<b>②④⑤</b>吗？请举出反例，并提出修正后的猜想．</p>',
    steps: [
      { title: '构造两条不垂直直径的反例' },
      { title: '剖析原因并加上限制条件' },
      { title: '提出修正后的推论猜想' }
    ],
    onInit(state) {
      state.angAB = 32;
    },
    controls(step, state) {
      if (step === 1 || step === 2) {
        return window.slider('angAB', '旋转直径<i class="m">AB</i>', 15, 75, state.angAB, 5, '°');
      }
      return '';
    },
    renderBody(step, state) {
      const cv = window.createCoordCanvas({
        width: 475,
        height: 390,
        xRange: [-4.2, 4.2],
        yRange: [-3.9, 3.9],
        equalAspect: true,
        padding: { left: 16, right: 16, top: 14, bottom: 14 }
      });
      const R = 3.3;
      const O = [0, 0];

      if (step === 0) {
        drawCircleSvg(cv, R, { stroke: '#1e293b', width: 2.7, fill: 'rgba(37,99,235,0.03)' });
        cv.drawPoint(O, { label: 'O', dx: 11, dy: 19, fontSize: 18, color: '#0f172a', r: 4.6 });
      } else if (step === 1 || step === 2) {
        const ang = Number(state.angAB !== undefined ? state.angAB : 32);
        const rad = (ang * Math.PI) / 180;
        const C = [0, R];
        const D = [0, -R];
        const B = [R * Math.cos(rad), R * Math.sin(rad)];
        const A = [-R * Math.cos(rad), -R * Math.sin(rad)];
        const cobDeg = Math.round(90 - ang);

        drawCircleSvg(cv, R, { stroke: '#1e293b', width: 2.7, fill: 'rgba(37,99,235,0.03)' });
        if (step === 2) {
          cv.drawSegment(A, B, { color: 'rgba(220,38,38,0.18)', width: 11 });
        }
        cv.drawSegment(C, D, { color: '#2563eb', width: 2.8 });
        cv.drawSegment(A, B, { color: '#dc2626', width: 2.8 });
        drawTickMarks(cv, O, A, 1, { color: '#dc2626', len: 6.2, width: 2.3 });
        drawTickMarks(cv, O, B, 1, { color: '#dc2626', len: 6.2, width: 2.3 });

        cv.raw(window.svgNumberedAngle(
          cv.pt(O),
          cv.pt(C),
          cv.pt(B),
          '1',
          {
            radius: 28,
            labelDist: cobDeg < 28 ? 50 : 41,
            leader: cobDeg < 28,
            color: '#dc2626',
            fill: 'rgba(220,38,38,0.12)',
            fontSize: 15
          }
        ));
        cv.drawText([-1.55, 1.25], `∠1=${cobDeg}°≠90°`, {
          color: '#dc2626',
          fontSize: 16.5,
          anchor: 'middle'
        });

        cv.drawPoint(C, { label: 'C', dx: -11, dy: -6, fontSize: 18, anchor: 'end', color: '#1d4ed8', r: 4.6 });
        cv.drawPoint(D, { label: 'D', dx: 11, dy: 18, fontSize: 18, anchor: 'start', color: '#1d4ed8', r: 4.6 });
        cv.drawPoint(A, { label: 'A', dx: -11, dy: 15, fontSize: 18, anchor: 'end', color: '#dc2626', r: 4.6 });
        cv.drawPoint(B, { label: 'B', dx: 11, dy: -4, fontSize: 18, anchor: 'start', color: '#dc2626', r: 4.6 });
        cv.drawPoint(O, { label: 'O', dx: 11, dy: 20, fontSize: 18, anchor: 'start', color: '#0f172a', r: 4.6 });
      } else {
        const yM = 1.5;
        const xB = Math.sqrt(R * R - yM * yM);
        const C = [0, R];
        const D = [0, -R];
        const A = [-xB, yM];
        const B = [xB, yM];
        const M = [0, yM];

        drawCircleSvg(cv, R, { stroke: '#1e293b', width: 2.7, fill: 'rgba(37,99,235,0.03)' });
        cv.drawSegment(C, D, { color: '#2563eb', width: 2.8 });
        cv.drawSegment(A, B, { color: '#0f172a', width: 2.8 });
        drawTickMarks(cv, A, M, 2, { color: '#0f172a', len: 6.0, gap: 4.5 });
        drawTickMarks(cv, M, B, 2, { color: '#0f172a', len: 6.0, gap: 4.5 });
        drawRightAngleCustom(cv, M, B, O, { size: 11.5, color: '#dc2626', width: 2.2, dash: '3.2,2.4' });

        cv.drawPoint(C, { label: 'C', dx: 11, dy: -6, fontSize: 18, color: '#1d4ed8', r: 4.6 });
        cv.drawPoint(D, { label: 'D', dx: 11, dy: 19, fontSize: 18, color: '#1d4ed8', r: 4.6 });
        cv.drawPoint(A, { label: 'A', dx: -11, dy: -4, fontSize: 18, anchor: 'end', color: '#0f172a', r: 4.6 });
        cv.drawPoint(B, { label: 'B', dx: 11, dy: -4, fontSize: 18, anchor: 'start', color: '#0f172a', r: 4.6 });
        cv.drawPoint(M, { label: 'M', dx: -10, dy: 20, fontSize: 17.5, anchor: 'end', color: '#0f172a', r: 4.4 });
        cv.drawPoint(O, { label: 'O', dx: 11, dy: 19, fontSize: 18, color: '#0f172a', r: 4.6 });
      }

      const lines = [
        {
          step: 1,
          html: '解：<b>不一定能推出②④⑤！</b><br><b>反例：</b>如图，任作两条不垂直的直径<i class="m">CD</i>和<i class="m">AB</i>（交于圆心<i class="m">O</i>），满足过圆心且<span class="math"><i class="m">OA</i><span class="num">=</span><i class="m">OB</i></span>，但<i class="m">CD</i>与<i class="m">AB</i><b>不垂直</b>，也不平分弧！'
        },
        {
          step: 2,
          html: '<b>原因分析：</b>被平分的弦<i class="m">AB</i>恰好也是<b>直径</b>（任意两条直径都互相平分），故必须加上限制条件：<b>被平分的弦“不是直径”</b>．'
        },
        {
          step: 3,
          html: '<span style="color:#1d4ed8;"><b>提出猜想：</b>平分弦（<b>不是直径</b>）的直径<b>垂直于弦</b>，并且<b>平分弦所对的两条弧</b>．</span>'
        }
      ];

      return window.pptExampleLayout({
        step,
        lines,
        rightSvg: cv.toSvg()
      });
    }
  });

  // ==========================================================================
  // Slide 9：二、新知探究 推论的严谨证明
  // ==========================================================================
  window.defineSlide({
    lesson: 1,
    phase: 1,
    layout: 'layout-ppt',
    section: '新知探究',
    navTag: '探究·证推论',
    title: '探究：推论的证明',
    stem: `<p>能不能用所学过的知识证明你的猜想？<br><b>已知：</b>如图，<i class="m">CD</i>是<span class="num">⊙</span><i class="m">O</i>的直径，弦<i class="m">AB</i>不是直径，<i class="m">CD</i>交<i class="m">AB</i>于点<i class="m">M</i>，且<span class="math"><i class="m">AM</i><span class="num">=</span><i class="m">BM</i></span>．<b>求证：</b><span class="math"><i class="m">CD</i><span class="num">⊥</span><i class="m">AB</i></span>，<span class="math">${window.arcHtml('AC')}<span class="num">=</span>${window.arcHtml('BC')}</span>，<span class="math">${window.arcHtml('AD')}<span class="num">=</span>${window.arcHtml('BD')}</span>．</p>`,
    steps: [
      { title: '连半径构造等腰△OAB' },
      { title: '三线合一证CD⊥AB' },
      { title: '由垂径定理证平分两条弧' }
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
      const yM = 1.5;
      const xB = Math.sqrt(R * R - yM * yM);
      const O = [0, 0];
      const C = [0, R];
      const D = [0, -R];
      const A = [-xB, yM];
      const B = [xB, yM];
      const M = [0, yM];
      const degB = (Math.atan2(yM, xB) * 180) / Math.PI;
      const degA = 180 - degB;

      drawCircleSvg(cv, R, { stroke: '#1e293b', width: 2.7, fill: 'rgba(37,99,235,0.03)' });

      if (step >= 1) {
        cv.drawPolygon([O, A, B], { fill: 'rgba(37,99,235,0.12)', stroke: 'none', width: 0 });
      }

      if (step >= 3) {
        drawMathArc(cv, R, degB, degA, { color: '#2563eb', width: 4.5 });
        drawMathArc(cv, R, degA, 360 + degB, { color: '#16a34a', width: 4.5 });
      }

      cv.drawSegment(C, D, { color: '#1e293b', width: 2.6 });
      cv.drawSegment(A, B, { color: '#0f172a', width: 2.8 });
      drawTickMarks(cv, A, M, 2, { color: '#0f172a', len: 6, gap: 4.5 });
      drawTickMarks(cv, M, B, 2, { color: '#0f172a', len: 6, gap: 4.5 });

      if (step >= 1) {
        cv.drawSegment(O, A, { color: '#dc2626', width: 2.5, dash: '6,4' });
        cv.drawSegment(O, B, { color: '#dc2626', width: 2.5, dash: '6,4' });
        drawTickMarks(cv, O, A, 1, { color: '#dc2626', len: 6 });
        drawTickMarks(cv, O, B, 1, { color: '#dc2626', len: 6 });
      }

      if (step >= 2) {
        drawRightAngleCustom(cv, M, B, O, { size: 11.5, color: '#dc2626', width: 2.3 });
      }

      cv.drawPoint(C, { label: 'C', dx: 10, dy: -7, fontSize: 18, color: step >= 3 ? '#1d4ed8' : '#0f172a', r: 4.6 });
      cv.drawPoint(D, { label: 'D', dx: 10, dy: 19, fontSize: 18, color: step >= 3 ? '#15803d' : '#0f172a', r: 4.6 });
      cv.drawPoint(A, { label: 'A', dx: -11, dy: -4, fontSize: 18, anchor: 'end', color: '#0f172a', r: 4.6 });
      cv.drawPoint(B, { label: 'B', dx: 11, dy: -4, fontSize: 18, anchor: 'start', color: '#0f172a', r: 4.6 });
      cv.drawPoint(M, { label: 'M', dx: -10, dy: -8, fontSize: 17.5, anchor: 'end', color: step >= 2 ? '#dc2626' : '#0f172a', r: 4.4 });
      cv.drawPoint(O, { label: 'O', dx: 11, dy: 19, fontSize: 18, color: '#0f172a', r: 4.6 });

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
            { sym: '∵', text: '<span class="math"><i class="m">AM</i><span class="num">=</span><i class="m">BM</i></span>（即<i class="m">OM</i>是底边<i class="m">AB</i>上的中线），' },
            { sym: '∴', text: '<span class="math"><i class="m">OM</i><span class="num">⊥</span><i class="m">AB</i></span>（等腰三角形“三线合一”），即<span class="math"><i class="m">CD</i><span class="num">⊥</span><i class="m">AB</i></span>．' }
          ])
        },
        {
          step: 3,
          html: window.formalProofStep([
            { sym: '∵', text: '直径<span class="math"><i class="m">CD</i><span class="num">⊥</span><i class="m">AB</i></span>，由垂径定理，' },
            { sym: '∴', text: `<span style="color:#1d4ed8;">${window.arcHtml('AC')}<span class="num">=</span>${window.arcHtml('BC')}</span>，<span style="color:#15803d;">${window.arcHtml('AD')}<span class="num">=</span>${window.arcHtml('BD')}</span>．` }
          ])
        }
      ];

      return window.pptExampleLayout({
        step,
        lines,
        rightSvg: cv.toSvg()
      });
    }
  });

  // ==========================================================================
  // Slide 10：垂径定理的推论归纳表（三重表征对照）
  // ==========================================================================
  window.defineSlide({
    lesson: 1,
    phase: 1,
    layout: 'layout-ppt',
    section: '新知探究',
    navTag: '归纳·定理推论',
    title: '归纳：垂径定理推论',
    stem: '<p>归纳<b>垂径定理的推论</b>（特别注意括号内的限制条件，与学案三栏表同步）：</p>',
    steps: [
      { title: '揭晓文字语言及限制条件' },
      { title: '揭晓符号语言与图形标记' }
    ],
    renderBody(step) {
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
      const xB = Math.sqrt(R * R - yM * yM);
      const O = [0, 0];
      const C = [0, R];
      const D = [0, -R];
      const A = [-xB, yM];
      const B = [xB, yM];
      const M = [0, yM];
      const degB = (Math.atan2(yM, xB) * 180) / Math.PI;
      const degA = 180 - degB;

      drawCircleSvg(cv, R, { stroke: '#1e293b', width: 2.5, fill: 'rgba(37,99,235,0.03)' });

      if (step >= 2) {
        drawMathArc(cv, R, degB, degA, { color: '#2563eb', width: 4.2 });
        drawMathArc(cv, R, degA, 360 + degB, { color: '#16a34a', width: 4.2 });
      }

      cv.drawSegment(C, D, { color: '#1e293b', width: 2.5 });
      cv.drawSegment(A, B, { color: '#0f172a', width: 2.6 });
      drawTickMarks(cv, A, M, 2, { color: '#0f172a', len: 5.5, gap: 4.2 });
      drawTickMarks(cv, M, B, 2, { color: '#0f172a', len: 5.5, gap: 4.2 });

      if (step >= 2) {
        drawRightAngleCustom(cv, M, B, O, { size: 11, color: '#dc2626', width: 2.2 });
      }

      cv.drawPoint(C, { label: 'C', dx: 9, dy: -6, color: step >= 2 ? '#1d4ed8' : '#0f172a', r: 4.2 });
      cv.drawPoint(D, { label: 'D', dx: 9, dy: 17, color: step >= 2 ? '#15803d' : '#0f172a', r: 4.2 });
      cv.drawPoint(A, { label: 'A', dx: -9, dy: -4, anchor: 'end', color: '#0f172a', r: 4.2 });
      cv.drawPoint(B, { label: 'B', dx: 9, dy: -4, anchor: 'start', color: '#0f172a', r: 4.2 });
      cv.drawPoint(M, { label: 'M', dx: -8, dy: -8, anchor: 'end', color: step >= 2 ? '#dc2626' : '#0f172a', r: 4.0 });
      cv.drawPoint(O, { label: 'O', dx: 9, dy: 17, color: '#0f172a', r: 4.2 });

      const col1Html = `平分弦（<span class="tri-blank ${step >= 1 ? 'is-filled' : ''}" style="min-width:112px;">不是直径</span>）的直径<br><span class="tri-blank ${step >= 1 ? 'is-filled' : ''}" style="min-width:112px;">垂直于弦</span>，并且<br><span class="tri-blank is-blue ${step >= 1 ? 'is-filled' : ''}" style="min-width:210px;">平分弦所对的两条弧</span>．`;

      const col3Html = window.formalProofStep([
        { sym: '∵', text: '<i class="m">CD</i>是<span class="num">⊙</span><i class="m">O</i>的直径，弦<i class="m">AB</i>不是直径，<span class="math"><i class="m">AM</i><span class="num">=</span><i class="m">BM</i></span>，' },
        { sym: '∴', text: `<span class="tri-blank ${step >= 2 ? 'is-filled' : ''}" style="min-width:255px;"><i class="m">CD</i><span class="num">⊥</span><i class="m">AB</i>，${window.arcHtml('AC')}<span class="num">=</span>${window.arcHtml('BC')}，${window.arcHtml('AD')}<span class="num">=</span>${window.arcHtml('BD')}</span>．` }
      ]);

      return window.pptThreeColTable({
        col1Title: '文字语言',
        col2Title: '图形语言',
        col3Title: '符号语言',
        col1Html,
        col2Svg: cv.toSvg(),
        col3Html
      });
    }
  });

  // ==========================================================================
  // Slide 11：二、新知探究 问题4：公路弯道半径
  // ==========================================================================
  window.defineSlide({
    lesson: 1,
    phase: 1,
    layout: 'layout-ppt',
    section: '新知探究',
    navTag: '问题4·求半径',
    title: '问题<span class="num">4</span>：求弯道半径',
    stem: `<p><b>问题<span class="num">4</span>：</b>如图，一条公路的转弯处是一段圆弧（即图中${window.arcHtml('CD')}，点<i class="m">O</i>是${window.arcHtml('CD')}所在圆的圆心），其中<span class="math"><i class="m">CD</i><span class="num">=600m</span></span>，<i class="m">E</i>为${window.arcHtml('CD')}上一点，且<span class="math"><i class="m">OE</i><span class="num">⊥</span><i class="m">CD</i></span>，垂足为<i class="m">F</i>，<span class="math"><i class="m">EF</i><span class="num">=90m</span></span>．求这段弯路的半径．</p>`,
    steps: [
      { title: '连半径设未知数R' },
      { title: '由垂径定理求半弦CF' },
      { title: '在Rt△OCF中列勾股方程求解' }
    ],
    renderBody(step) {
      const cv = window.createCoordCanvas({
        width: 470,
        height: 390,
        xRange: [-3.2, 3.5],
        yRange: [-3.1, 3.45],
        equalAspect: true,
        padding: { left: 10, right: 12, top: 14, bottom: 10 }
      });
      const r = 2.95;
      const O = [0, 0];
      const C = [0, r];
      const D = [r, 0];
      const E = [r * Math.SQRT1_2, r * Math.SQRT1_2];
      const F = [r / 2, r / 2];

      // 其余圆周虚线（90° -> 360°，还原 PPT 清晰虚线圆）
      drawMathArc(cv, r, 90, 360, { color: '#475569', width: 1.9, dash: '6,5' });

      if (step >= 2) {
        cv.drawPolygon([O, C, F], { fill: 'rgba(37,99,235,0.14)', stroke: 'none', width: 0 });
      }

      // 第一象限弯道圆弧与两段切线直道
      drawMathArc(cv, r, 0, 90, { color: '#0f172a', width: 3.0 });
      cv.drawSegment([-2.9, r], C, { color: '#0f172a', width: 2.8 });
      cv.drawSegment(D, [r, -2.5], { color: '#0f172a', width: 2.8 });

      // 弦 CD 与虚线半径 OE
      cv.drawSegment(C, D, { color: '#1e293b', width: 2.4, dash: '6,4' });
      cv.drawSegment(O, E, { color: '#1e293b', width: 2.2, dash: '6,4' });
      drawRightAngleCustom(cv, F, O, C, { size: 11, color: '#0f172a', width: 2.0 });

      if (step >= 1) {
        cv.drawSegment(O, C, { color: '#dc2626', width: 2.8, dash: '6,4' });
        cv.drawText([-0.34, 1.55], 'R', { color: '#dc2626', fontSize: 18.5, anchor: 'end' });
      }

      if (step >= 2) {
        drawTickMarks(cv, C, F, 1, { color: '#1d4ed8', len: 6 });
        drawTickMarks(cv, F, D, 1, { color: '#1d4ed8', len: 6 });
      }

      cv.drawPoint(O, { label: 'O', dx: -4, dy: 23, fontSize: 18.5, anchor: 'middle', color: '#0f172a', r: 4.5 });
      cv.drawPoint(C, { label: 'C', dx: 0, dy: -11, fontSize: 18.5, anchor: 'middle', color: '#0f172a', r: 4.5 });
      cv.drawPoint(D, { label: 'D', dx: 10, dy: 6, fontSize: 18.5, anchor: 'start', color: '#0f172a', r: 4.5 });
      cv.drawPoint(E, { label: 'E', dx: 9, dy: -6, fontSize: 18.5, anchor: 'start', color: '#0f172a', r: 4.5 });
      cv.drawPoint(F, { label: 'F', dx: 4, dy: 24, fontSize: 18, anchor: 'middle', color: '#0f172a', r: 4.2 });

      const lines = [
        {
          step: 1,
          html: '解：连接<i class="m">OC</i>．<br>设弯路的半径为<span class="math"><i class="m">R</i><span class="num">m</span></span>，则<span class="math"><i class="m">OF</i><span class="num">=(</span><i class="m">R</i><span class="num">-90)m</span></span>．'
        },
        {
          step: 2,
          html: window.formalProofStep([
            { sym: '∵', text: '<span class="math"><i class="m">OE</i><span class="num">⊥</span><i class="m">CD</i></span>，' },
            { sym: '∴', text: '<span class="math"><i class="m">CF</i><span class="num">=</span><span class="fraction"><span><span class="num">1</span></span><span><span class="num">2</span></span></span><i class="m">CD</i><span class="num">=</span><span class="fraction"><span><span class="num">1</span></span><span><span class="num">2</span></span></span><span class="num">×600=300(m)</span></span>．' }
          ])
        },
        {
          step: 3,
          html: '在<span class="num">Rt</span><span class="tri-sym">△</span><i class="m">OCF</i>中，根据勾股定理，得<span class="math"><i class="m">OC</i><sup><span class="num">2</span></sup><span class="num">=</span><i class="m">CF</i><sup><span class="num">2</span></sup><span class="num">+</span><i class="m">OF</i><sup><span class="num">2</span></sup></span>，<br>即<span class="math"><i class="m">R</i><sup><span class="num">2</span></sup><span class="num">=300</span><sup><span class="num">2</span></sup><span class="num">+(</span><i class="m">R</i><span class="num">-90)</span><sup><span class="num">2</span></sup></span>，解这个方程，得<span class="math"><i class="m">R</i><span class="num">=545</span></span>．<br>所以，这段弯路所在圆的半径为<span class="num">545m</span>．'
        }
      ];

      return window.pptExampleLayout({
        step,
        lines,
        rightSvg: cv.toSvg()
      });
    }
  });

  // ==========================================================================
  // Slide 12：三、新知应用 第1题：四图条件辨析
  // ==========================================================================
  function makeSmallDiscCanvas() {
    return window.createCoordCanvas({
      width: 240,
      height: 215,
      xRange: [-3.35, 3.35],
      yRange: [-3.25, 3.25],
      equalAspect: true,
      padding: { left: 8, right: 8, top: 8, bottom: 8 }
    });
  }

  window.defineSlide({
    lesson: 1,
    phase: 2,
    layout: 'layout-j',
    cols: 5,
    section: '新知应用',
    navTag: '题1·五图辨析',
    title: '第<span class="num">1</span>题：垂径定理条件辨析',
    stem: '<p><span class="num">1．</span>下列图形是否具备垂径定理的条件？如果不是，请说明为什么？</p>',
    summary: '<b>判定核心：</b>一看<b>是否过圆心</b>（直径、半径或弦心距所在直线），二看<b>是否垂直于弦</b>——“过圆心”与“垂直于弦”缺一不可！',
    steps: [
      {
        title: '图(1)',
        badgeType: 'no',
        badge: '✕ 不具备',
        html: '直径<i class="m">CD</i>虽过圆心<i class="m">O</i>，但与弦<i class="m">AB</i><b>不垂直</b>．',
        renderSvg(isUnlocked) {
          const cv = makeSmallDiscCanvas();
          const R = 2.7;
          const yA = 1.25;
          const xB = Math.sqrt(R * R - yA * yA);
          const rad60 = Math.PI / 3;
          const O = [0, 0];
          const A = [-xB, yA];
          const B = [xB, yA];
          const C = [R * Math.cos(rad60), R * Math.sin(rad60)];
          const D = [-R * Math.cos(rad60), -R * Math.sin(rad60)];
          const E = [yA / Math.tan(rad60), yA];

          drawCircleSvg(cv, R, { stroke: '#1e293b', width: 2.2, fill: isUnlocked ? 'rgba(220,38,38,0.03)' : 'rgba(37,99,235,0.02)' });
          cv.drawSegment(A, B, { color: '#0f172a', width: 2.2 });
          cv.drawSegment(C, D, { color: isUnlocked ? '#dc2626' : '#0f172a', width: 2.2 });

          if (isUnlocked) {
            cv.raw(window.svgNumberedAngle(cv.pt(E), cv.pt(C), cv.pt(B), '', {
              radius: 14,
              color: '#dc2626',
              fill: 'rgba(220,38,38,0.20)'
            }));
            cv.drawText([1.48, 0.45], '≠90°', { color: '#dc2626', fontSize: 13.5, anchor: 'middle' });
          }

          cv.drawPoint(A, { label: 'A', dx: -8, dy: 4, anchor: 'end', color: '#0f172a', r: 3.6, fontSize: 14.5 });
          cv.drawPoint(B, { label: 'B', dx: 8, dy: 4, anchor: 'start', color: '#0f172a', r: 3.6, fontSize: 14.5 });
          cv.drawPoint(C, { label: 'C', dx: 7, dy: -4, anchor: 'start', color: '#0f172a', r: 3.6, fontSize: 14.5 });
          cv.drawPoint(D, { label: 'D', dx: -7, dy: 14, anchor: 'end', color: '#0f172a', r: 3.6, fontSize: 14.5 });
          cv.drawPoint(E, { label: 'E', dx: -7, dy: -7, anchor: 'end', color: isUnlocked ? '#dc2626' : '#0f172a', r: 3.4, fontSize: 14 });
          cv.drawPoint(O, { label: 'O', dx: 9, dy: 15, anchor: 'start', color: '#0f172a', r: 3.8, fontSize: 14.5 });
          return cv.toSvg();
        }
      },
      {
        title: '图(2)',
        badgeType: 'ok',
        badge: '✓ 具备',
        html: '线段<i class="m">OE</i><b>过圆心<i class="m">O</i>且垂直于弦<i class="m">AB</i></b>，具备垂径定理条件（可得<span class="math"><i class="m">AE</i><span class="num">=</span><i class="m">BE</i></span>）．',
        renderSvg(isUnlocked) {
          const cv = makeSmallDiscCanvas();
          const R = 2.7;
          const yE = 1.15;
          const xB = Math.sqrt(R * R - yE * yE);
          const O = [0, 0];
          const A = [-xB, yE];
          const B = [xB, yE];
          const E = [0, yE];

          drawCircleSvg(cv, R, { stroke: '#1e293b', width: 2.2, fill: isUnlocked ? 'rgba(22,163,74,0.04)' : 'rgba(37,99,235,0.02)' });

          if (isUnlocked) {
            cv.drawSegment([0, R], [0, -R], { color: '#86efac', width: 1.6, dash: '4,3' });
          }

          cv.drawSegment(A, B, { color: '#0f172a', width: 2.2 });
          cv.drawSegment(O, E, { color: isUnlocked ? '#16a34a' : '#0f172a', width: isUnlocked ? 2.7 : 2.2 });
          drawRightAngleCustom(cv, E, B, O, { size: 9, color: isUnlocked ? '#16a34a' : '#334155', width: 1.9 });

          if (isUnlocked) {
            drawTickMarks(cv, A, E, 1, { color: '#16a34a', len: 5 });
            drawTickMarks(cv, E, B, 1, { color: '#16a34a', len: 5 });
          }

          cv.drawPoint(A, { label: 'A', dx: -8, dy: 4, anchor: 'end', color: '#0f172a', r: 3.6, fontSize: 14.5 });
          cv.drawPoint(B, { label: 'B', dx: 8, dy: 4, anchor: 'start', color: '#0f172a', r: 3.6, fontSize: 14.5 });
          cv.drawPoint(E, { label: 'E', dx: -7, dy: -8, anchor: 'end', color: isUnlocked ? '#15803d' : '#0f172a', r: 3.5, fontSize: 14.5 });
          cv.drawPoint(O, { label: 'O', dx: 8, dy: 16, anchor: 'start', color: isUnlocked ? '#15803d' : '#0f172a', r: 3.8, fontSize: 14.5 });
          return cv.toSvg();
        }
      },
      {
        title: '图(3)',
        badgeType: 'no',
        badge: '✕ 不具备',
        html: '弦<i class="m">CD</i>虽垂直于<i class="m">AB</i>，但<b>没有经过圆心<i class="m">O</i></b>（不是直径）．',
        renderSvg(isUnlocked) {
          const cv = makeSmallDiscCanvas();
          const R = 2.7;
          const yA = 1.15;
          const xC = 1.05;
          const xB = Math.sqrt(R * R - yA * yA);
          const yC = Math.sqrt(R * R - xC * xC);
          const O = [0, 0];
          const A = [-xB, yA];
          const B = [xB, yA];
          const C = [xC, yC];
          const D = [xC, -yC];
          const E = [xC, yA];

          drawCircleSvg(cv, R, { stroke: '#1e293b', width: 2.2, fill: isUnlocked ? 'rgba(220,38,38,0.03)' : 'rgba(37,99,235,0.02)' });
          cv.drawSegment(A, B, { color: '#0f172a', width: 2.2 });
          cv.drawSegment(C, D, { color: isUnlocked ? '#dc2626' : '#0f172a', width: 2.2 });
          drawRightAngleCustom(cv, E, A, D, { size: 9, color: '#334155', width: 1.8 });

          if (isUnlocked) {
            const [ox, oy] = cv.pt(O);
            cv.raw(`<circle cx="${ox.toFixed(1)}" cy="${oy.toFixed(1)}" r="9" fill="rgba(220,38,38,0.16)" stroke="#dc2626" stroke-width="1.8" stroke-dasharray="3,2"/>`);
            cv.drawText([-1.28, -0.95], '未过O', { color: '#dc2626', fontSize: 13.5, anchor: 'middle' });
          }

          cv.drawPoint(A, { label: 'A', dx: -8, dy: 4, anchor: 'end', color: '#0f172a', r: 3.6, fontSize: 14.5 });
          cv.drawPoint(B, { label: 'B', dx: 8, dy: 4, anchor: 'start', color: '#0f172a', r: 3.6, fontSize: 14.5 });
          cv.drawPoint(C, { label: 'C', dx: 7, dy: -5, anchor: 'start', color: '#0f172a', r: 3.6, fontSize: 14.5 });
          cv.drawPoint(D, { label: 'D', dx: 7, dy: 14, anchor: 'start', color: '#0f172a', r: 3.6, fontSize: 14.5 });
          cv.drawPoint(E, { label: 'E', dx: 7, dy: -6, anchor: 'start', color: '#0f172a', r: 3.4, fontSize: 14 });
          cv.drawPoint(O, { label: 'O', dx: -9, dy: -6, anchor: 'end', color: isUnlocked ? '#dc2626' : '#0f172a', r: 3.8, fontSize: 14.5 });
          return cv.toSvg();
        }
      },
      {
        title: '图(4)',
        badgeType: 'ok',
        badge: '✓ 具备',
        html: '直径<i class="m">CD</i><b>既过圆心<i class="m">O</i>又垂直于弦<i class="m">AB</i></b>，完全具备垂径定理条件．',
        renderSvg(isUnlocked) {
          const cv = makeSmallDiscCanvas();
          const R = 2.7;
          const yE = 1.15;
          const xB = Math.sqrt(R * R - yE * yE);
          const O = [0, 0];
          const A = [-xB, yE];
          const B = [xB, yE];
          const C = [0, R];
          const D = [0, -R];
          const E = [0, yE];

          drawCircleSvg(cv, R, { stroke: '#1e293b', width: 2.2, fill: isUnlocked ? 'rgba(22,163,74,0.04)' : 'rgba(37,99,235,0.02)' });
          cv.drawSegment(A, B, { color: '#0f172a', width: 2.2 });
          cv.drawSegment(C, D, { color: isUnlocked ? '#16a34a' : '#0f172a', width: isUnlocked ? 2.7 : 2.2 });
          drawRightAngleCustom(cv, E, B, O, { size: 9, color: isUnlocked ? '#16a34a' : '#334155', width: 1.9 });

          if (isUnlocked) {
            drawTickMarks(cv, A, E, 1, { color: '#16a34a', len: 5 });
            drawTickMarks(cv, E, B, 1, { color: '#16a34a', len: 5 });
          }

          cv.drawPoint(A, { label: 'A', dx: -8, dy: 4, anchor: 'end', color: '#0f172a', r: 3.6, fontSize: 14.5 });
          cv.drawPoint(B, { label: 'B', dx: 8, dy: 4, anchor: 'start', color: '#0f172a', r: 3.6, fontSize: 14.5 });
          cv.drawPoint(C, { label: 'C', dx: 8, dy: -5, anchor: 'start', color: isUnlocked ? '#15803d' : '#0f172a', r: 3.6, fontSize: 14.5 });
          cv.drawPoint(D, { label: 'D', dx: 8, dy: 15, anchor: 'start', color: isUnlocked ? '#15803d' : '#0f172a', r: 3.6, fontSize: 14.5 });
          cv.drawPoint(E, { label: 'E', dx: -8, dy: -7, anchor: 'end', color: isUnlocked ? '#15803d' : '#0f172a', r: 3.5, fontSize: 14.5 });
          cv.drawPoint(O, { label: 'O', dx: 8, dy: 15, anchor: 'start', color: isUnlocked ? '#15803d' : '#0f172a', r: 3.8, fontSize: 14.5 });
          return cv.toSvg();
        }
      },
      {
        title: '图(5)',
        badgeType: 'ok',
        badge: '✓ 具备',
        html: '线段<i class="m">OE</i><b>过圆心<i class="m">O</i>且垂直于竖直弦<i class="m">AB</i></b>，具备垂径定理条件（可得<span class="math"><i class="m">AE</i><span class="num">=</span><i class="m">BE</i></span>）．',
        renderSvg(isUnlocked) {
          const cv = makeSmallDiscCanvas();
          const R = 2.7;
          const xE = 1.25;
          const yA = Math.sqrt(R * R - xE * xE);
          const O = [0, 0];
          const A = [xE, yA];
          const B = [xE, -yA];
          const E = [xE, 0];

          drawCircleSvg(cv, R, { stroke: '#1e293b', width: 2.2, fill: isUnlocked ? 'rgba(22,163,74,0.04)' : 'rgba(37,99,235,0.02)' });
          if (isUnlocked) {
            cv.drawSegment([-R, 0], [R, 0], { color: '#86efac', width: 1.6, dash: '4,3' });
          }

          cv.drawSegment(A, B, { color: '#0f172a', width: 2.2 });
          cv.drawSegment(O, E, { color: isUnlocked ? '#16a34a' : '#0f172a', width: isUnlocked ? 2.7 : 2.2 });
          drawRightAngleCustom(cv, E, O, B, { size: 9, color: isUnlocked ? '#16a34a' : '#334155', width: 1.9 });

          if (isUnlocked) {
            drawTickMarks(cv, A, E, 1, { color: '#16a34a', len: 5 });
            drawTickMarks(cv, E, B, 1, { color: '#16a34a', len: 5 });
          }

          cv.drawPoint(A, { label: 'A', dx: 8, dy: -6, anchor: 'start', color: '#0f172a', r: 3.6, fontSize: 14.5 });
          cv.drawPoint(B, { label: 'B', dx: 8, dy: 14, anchor: 'start', color: '#0f172a', r: 3.6, fontSize: 14.5 });
          cv.drawPoint(E, { label: 'E', dx: 8, dy: -6, anchor: 'start', color: isUnlocked ? '#15803d' : '#0f172a', r: 3.5, fontSize: 14.5 });
          cv.drawPoint(O, { label: 'O', dx: -8, dy: -6, anchor: 'end', color: isUnlocked ? '#15803d' : '#0f172a', r: 3.8, fontSize: 14.5 });
          return cv.toSvg();
        }
      }
    ]
  });
})();

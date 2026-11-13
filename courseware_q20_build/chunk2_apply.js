// =============================================================================
// Chunk 2: 类比迁移 (3) + 拓展提升 (4) 破局设元
// =============================================================================

// 通用几何绘图函数
function svgTextHalo2(x, y, text, opts = {}) {
  const { size = 15, color = '#0f172a', anchor = 'middle', weight = '700' } = opts;
  const inner = typeof window.svgAutoFormatText === 'function' ? window.svgAutoFormatText(text, size) : text;
  return `<text x="${Number(x).toFixed(1)}" y="${Number(y).toFixed(1)}" font-family="'Times New Roman', 'Songti SC', SimSun, serif" font-weight="${weight}" font-size="${size}" fill="${color}" text-anchor="${anchor}" stroke="#ffffff" stroke-width="3.5" paint-order="stroke">${inner}</text>`;
}

function svgPt2(x, y, color = '#1e293b', r = 4.5) {
  return `<circle cx="${Number(x).toFixed(1)}" cy="${Number(y).toFixed(1)}" r="${r}" fill="${color}" stroke="#ffffff" stroke-width="1.8"/>`;
}

function svgPoly2(pts, fill, stroke = 'none', strokeWidth = 1.5, dash = '') {
  const ptsStr = pts.map(p => `${Number(p[0]).toFixed(1)},${Number(p[1]).toFixed(1)}`).join(' ');
  const dashAttr = dash ? `stroke-dasharray="${dash}"` : '';
  return `<polygon points="${ptsStr}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" ${dashAttr}/>`;
}

function svgLine2(p1, p2, color = '#0f172a', width = 2, dash = '') {
  const dashAttr = dash ? `stroke-dasharray="${dash}"` : '';
  return `<line x1="${Number(p1[0]).toFixed(1)}" y1="${Number(p1[1]).toFixed(1)}" x2="${Number(p2[0]).toFixed(1)}" y2="${Number(p2[1]).toFixed(1)}" stroke="${color}" stroke-width="${width}" ${dashAttr} stroke-linecap="round"/>`;
}

function svgRightAngle2(v, p1, p2, size = 12, color = '#64748b') {
  const v1 = [p1[0] - v[0], p1[1] - v[1]];
  const v2 = [p2[0] - v[0], p2[1] - v[1]];
  const len1 = Math.hypot(v1[0], v1[1]) || 1;
  const len2 = Math.hypot(v2[0], v2[1]) || 1;
  const u1 = [v1[0] / len1 * size, v1[1] / len1 * size];
  const u2 = [v2[0] / len2 * size, v2[1] / len2 * size];
  const a = [v[0] + u1[0], v[1] + u1[1]];
  const b = [v[0] + u1[0] + u2[0], v[1] + u1[1] + u2[1]];
  const c = [v[0] + u2[0], v[1] + u2[1]];
  return `<polyline points="${a[0].toFixed(1)},${a[1].toFixed(1)} ${b[0].toFixed(1)},${b[1].toFixed(1)} ${c[0].toFixed(1)},${c[1].toFixed(1)}" fill="none" stroke="${color}" stroke-width="1.6"/>`;
}

// 几何标注：等长短杠标记（Tick Marks）
function svgTickMarks2(p1, p2, count = 1, color = '#64748b', size = 6, tPos = 0.5) {
  const dx = p2[0] - p1[0];
  const dy = p2[1] - p1[1];
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len, uy = dy / len;
  const nx = -uy, ny = ux;
  const mx = p1[0] + dx * tPos;
  const my = p1[1] + dy * tPos;
  const gap = 4.5;
  let out = '';
  for (let i = 0; i < count; i++) {
    const shift = (i - (count - 1) / 2) * gap;
    const cx = mx + ux * shift;
    const cy = my + uy * shift;
    out += `<line x1="${(cx - nx * size).toFixed(1)}" y1="${(cy - ny * size).toFixed(1)}" x2="${(cx + nx * size).toFixed(1)}" y2="${(cy + ny * size).toFixed(1)}" stroke="${color}" stroke-width="2.2" stroke-linecap="round"/>`;
  }
  return out;
}

// 几何标注：角度圆弧与角标 (Angle Arc)
function svgAngleArc2(v, pStart, pEnd, radius = 24, label = '', color = '#2563eb', labelOffset = 14) {
  const dx1 = pStart[0] - v[0], dy1 = pStart[1] - v[1];
  const dx2 = pEnd[0] - v[0], dy2 = pEnd[1] - v[1];
  let a1 = Math.atan2(dy1, dx1);
  let a2 = Math.atan2(dy2, dx2);
  let diff = a2 - a1;
  while (diff <= -Math.PI) diff += Math.PI * 2;
  while (diff > Math.PI) diff -= Math.PI * 2;
  const sweep = diff > 0 ? 1 : 0;
  const sx = v[0] + Math.cos(a1) * radius;
  const sy = v[1] + Math.sin(a1) * radius;
  const ex = v[0] + Math.cos(a2) * radius;
  const ey = v[1] + Math.sin(a2) * radius;
  let out = `<path d="M ${sx.toFixed(1)} ${sy.toFixed(1)} A ${radius} ${radius} 0 0 ${sweep} ${ex.toFixed(1)} ${ey.toFixed(1)}" fill="none" stroke="${color}" stroke-width="2.0"/>`;
  if (label) {
    const midA = a1 + diff / 2;
    const lx = v[0] + Math.cos(midA) * (radius + labelOffset);
    const ly = v[1] + Math.sin(midA) * (radius + labelOffset);
    out += svgTextHalo2(lx, ly, label, { size: 14, color: color, weight: '700' });
  }
  return out;
}

// 几何标注：线段标签 (Segment Label - 严格法向偏移)
function svgSegmentLabel2(p1, p2, text, offset = 18, tPos = 0.5, color = '#0f172a', size = 14) {
  const dx = p2[0] - p1[0];
  const dy = p2[1] - p1[1];
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const lx = p1[0] + dx * tPos + nx * offset;
  const ly = p1[1] + dy * tPos + ny * offset;
  return svgTextHalo2(lx, ly, text, { size: size, color: color, weight: '700' });
}

// -----------------------------------------------------------------------------
// Slide 3: 第(3)问 平行四边形双垂相似转高之比 (3 步骤)
// -----------------------------------------------------------------------------
window.defineSlide({
  lesson: 1,
  phase: 1,
  navTag: '(3)·平四双垂相似',
  section: '类比迁移',
  title: '第(3)问【类比迁移】：平行四边形双垂相似转高之比',
  layout: 'layout-b',
  stem: `
    <div class="screen-stem-banner" style="background:#e0f2fe;border-left:4px solid #0284c7;padding:5px 12px;margin-bottom:6px;border-radius:4px;font-size:0.92rem;color:#0369a1;"><b>【从全等到相似】</b>当定点 <i class="m">P</i> 不在角平分线上时，双垂线 <i class="m">PM</i>, <i class="m">PN</i> 不等，全等演进为“双垂相似”，线段比转化为对应高之比！</div>
    <p>（<span class="num">3</span>）如图<span class="num">3</span>，在平行四边形<i class="m">ABCD</i>中，<i class="m">P</i>是对角线<i class="m">BD</i>上一点，<i class="m">E</i>是<i class="m">AB</i>边上一点，将射线<i class="m">PE</i>绕点<i class="m">P</i>顺时针旋转<i class="m">α</i>交<i class="m">AD</i>边于点<i class="m">F</i>，且<span class="math">∠<i class="m">ADC</i><span class="num">=</span><i class="m">α</i></span>．若<span class="math"><i class="m">AD</i><span class="num">=</span><i class="m">BD</i><span class="num">=3</span></span>，<span class="math"><i class="m">AB</i><span class="num">=4</span></span>，<span class="math"><i class="m">PD</i><span class="num">=</span><i class="m">nPB</i></span>，求<span class="math"><span class="fraction"><span><i class="m">PF</i></span><span><i class="m">PE</i></span></span></span>的值为<span class="screen-blank" data-step="3" data-ans="<span class='fraction'><span><span class='num'>4</span></span><span><span class='num'>3</span></span></span><i class='m'>n</i>"></span>．</p>
  `,
  steps: [
    {
      title: '作十字双垂与同角互补导角',
      html: '过点<i class="m">P</i>作<span class="math"><i class="m">PM</i><span class="num">⊥</span><i class="m">AB</i></span>于<i class="m">M</i>，<span class="math"><i class="m">PN</i><span class="num">⊥</span><i class="m">AD</i></span>于<i class="m">N</i>．在四边形<i class="m">PMAN</i>中，两垂角互补，结合<span class="math"><i class="m">AB</i><span class="num">∥</span><i class="m">CD</i></span>知<span class="math">∠<i class="m">MPN</i><span class="num">=</span>∠<i class="m">ADC</i><span class="num">=</span><i class="m">α</i></span>．'
    },
    {
      title: '十字相似建立边比桥梁',
      html: '由<span class="math">∠<i class="m">EPF</i><span class="num">=</span><i class="m">α</i><span class="num">=</span>∠<i class="m">MPN</i></span>，同减公共角得<span class="math">∠<span class="num">1</span><span class="num">=</span>∠<span class="num">2</span></span>，两角对应相等得<span class="math"><span class="num">Rt△</span><i class="m">PME</i><span class="num">∽Rt△</span><i class="m">PNF</i></span>，故<span class="math" style="white-space:nowrap;"><span class="fraction"><span><i class="m">PF</i></span><span><i class="m">PE</i></span></span><span class="num">=</span><span class="fraction"><span><i class="m">PN</i></span><span><i class="m">PM</i></span></span></span>．'
    },
    {
      title: '连 PA 转面积高之比解出结果',
      html: '连接<i class="m">PA</i>．<span class="math"><span class="fraction"><span><i class="m">S</i><sub><span class="num">△</span><i class="m">PAD</i></sub></span><span><i class="m">S</i><sub><span class="num">△</span><i class="m">PAB</i></sub></span></span><span class="num">=</span><span class="fraction"><span><i class="m">AD·PN</i></span><span><i class="m">AB·PM</i></span></span><span class="num">=</span><span class="fraction"><span><span class="num">3</span><i class="m">PN</i></span><span><span class="num">4</span><i class="m">PM</i></span></span></span>；同高三角形面积比等于底之比<span class="math"><span class="fraction"><span><i class="m">PD</i></span><span><i class="m">PB</i></span></span><span class="num">=</span><i class="m">n</i></span>．联立得<span class="math" style="white-space:nowrap;"><span class="fraction"><span><i class="m">PF</i></span><span><i class="m">PE</i></span></span><span class="num">=</span><span class="fraction"><span><i class="m">PN</i></span><span><i class="m">PM</i></span></span><span class="num">=</span><span class="fraction"><span><span class="num">4</span></span><span><span class="num">3</span></span></span><i class="m">n</i></span>！'
    }
  ],
  state: { n: 1.0, tE: 0.81 },
  controls(step, state) {
    const curN = String(state.n || 1.0);
    const nBtns = modeButtons('n', curN, [
      ['1.0', 'n = 1 (P为中点)', step >= 2 ? step : 2],
      ['0.75', 'n = 0.75', step >= 2 ? step : 2],
      ['1.5', 'n = 1.5', step >= 2 ? step : 2]
    ]);
    return nBtns + slider('tE', '拖动改变点 <i class="m">E</i> 位置', 0.6, 0.95, state.tE || 0.81, 0.05);
  },
  renderScene(step, state) {
    const W = 540, H = 410;
    const n = Number(state.n || 1.0);
    const tE = Number(state.tE !== undefined ? state.tE : 0.81);
    const ox = 70, oy = 350, sc = 68;

    const sqrt5 = Math.sqrt(5);
    const A = [ox, oy];
    const B = [ox + 4 * sc, oy];
    const D = [ox + 2 * sc, oy - sqrt5 * sc];
    const C = [B[0] + 2 * sc, oy - sqrt5 * sc];

    const tP = 1 / (n + 1);
    const P = [B[0] + tP * (D[0] - B[0]), B[1] + tP * (D[1] - B[1])];

    const M = [P[0], oy];
    const uAD = [2 / 3, -sqrt5 / 3];
    const dotAD = (P[0] - A[0]) * uAD[0] + (P[1] - A[1]) * uAD[1];
    const N = [A[0] + dotAD * uAD[0], A[1] + dotAD * uAD[1]];

    const lenPM = Math.abs(oy - P[1]);
    const lenPN = Math.hypot(P[0] - N[0], P[0] - N[0]);

    const E = [ox + 4 * sc * tE, oy];
    const tanTheta = (E[0] - M[0]) / (lenPM || 1);
    const F = [N[0] - lenPN * tanTheta * uAD[0], N[1] - lenPN * tanTheta * uAD[1]];

    let svg = `<svg viewBox="0 0 ${W} ${H}" style="width:100%;height:100%;display:block;">`;

    // 步骤 2: 阴影十字相似直角三角形
    if (step === 2) {
      svg += svgPoly2([P, M, E], 'rgba(59, 130, 246, 0.28)', '#2563eb', 1.8);
      svg += svgPoly2([P, N, F], 'rgba(249, 115, 22, 0.28)', '#ea580c', 1.8);
    }

    // 步骤 3: 阴影面积转线段比 △PAD 与 △PAB
    if (step >= 3) {
      svg += svgPoly2([P, A, D], 'rgba(249, 115, 22, 0.20)', '#ea580c', 1.5, '4 3');
      svg += svgPoly2([P, A, B], 'rgba(59, 130, 246, 0.20)', '#2563eb', 1.5, '4 3');
    }

    // 平行四边形与对角线 BD
    svg += svgPoly2([A, B, C, D], 'none', '#1e293b', 2.8);
    svg += svgLine2(B, D, '#475569', 2.2);

    // 钝角 ∠ADC = α 角弧标注
    svg += svgAngleArc2(D, A, C, 22, 'α', '#64748b', 14);

    // 题干边长标准法向标注（AD=3, AB=4）
    svg += svgSegmentLabel2(A, D, '3', 18, 0.5, '#64748b');
    svg += svgSegmentLabel2(A, B, '4', 20, 0.5, '#64748b');

    // 旋转线段 PE, PF
    const rotColor = step >= 1 ? '#dc2626' : '#2563eb';
    svg += svgLine2(P, E, rotColor, 3.2);
    svg += svgLine2(P, F, rotColor, 3.2);
    svg += svgAngleArc2(P, E, F, 22, 'α', rotColor, 14);

    // 步骤 1: 十字双垂线 PM, PN 与直角符号
    if (step >= 1) {
      svg += svgLine2(P, M, '#dc2626', 2.4, '6 4');
      svg += svgLine2(P, N, '#dc2626', 2.4, '6 4');
      svg += svgRightAngle2(M, P, B, 13, '#dc2626');
      svg += svgRightAngle2(N, P, A, 13, '#dc2626');
      svg += svgPt2(M[0], M[1], '#dc2626', 4.5);
      svg += svgPt2(N[0], N[1], '#dc2626', 4.5);
      svg += svgTextHalo2(M[0], M[1] + 20, 'M', { color: '#dc2626' });
      svg += svgTextHalo2(N[0] - 16, N[1] - 8, 'N', { color: '#dc2626' });
    }

    // 步骤 2: 角弧标注 ∠1 与 ∠2
    if (step >= 2) {
      svg += svgAngleArc2(P, M, E, 28, '∠1', '#2563eb', 14);
      svg += svgAngleArc2(P, N, F, 28, '∠2', '#ea580c', 14);
    }

    // 步骤 3: 辅助线 PA
    if (step >= 3) {
      svg += svgLine2(P, A, '#16a34a', 2.6, '6 4');
      svg += svgTextHalo2((A[0] + P[0]) / 2 - 12, (A[1] + P[1]) / 2, 'PA', { size: 13, color: '#16a34a' });
    }

    // 主顶点标注
    svg += svgPt2(A[0], A[1]); svg += svgTextHalo2(A[0] - 16, A[1] + 16, 'A');
    svg += svgPt2(B[0], B[1]); svg += svgTextHalo2(B[0] + 16, B[1] + 16, 'B');
    svg += svgPt2(C[0], C[1]); svg += svgTextHalo2(C[0] + 16, C[1] - 8, 'C');
    svg += svgPt2(D[0], D[1]); svg += svgTextHalo2(D[0] - 12, D[1] - 12, 'D');
    svg += svgPt2(P[0], P[1], '#dc2626', 5); svg += svgTextHalo2(P[0] + 16, P[1] - 8, 'P', { color: '#dc2626' });
    svg += svgPt2(E[0], E[1], rotColor, 5.5); svg += svgTextHalo2(E[0], E[1] + 20, 'E', { color: rotColor });
    svg += svgPt2(F[0], F[1], rotColor, 5.5); svg += svgTextHalo2(F[0] - 18, F[1] + 4, 'F', { color: rotColor });

    svg += `</svg>`;
    return svg;
  }
});

// -----------------------------------------------------------------------------
// Slide 4: 第(4)问 拓展提升·思维破局 (细化为 3 步：矩形构造 -> 确定定长 -> 设元表边)
// -----------------------------------------------------------------------------
window.defineSlide({
  lesson: 1,
  phase: 2,
  navTag: '(4)·破局设元表边',
  section: '拓展提升',
  title: '第(4)问【拓展提升】：构造矩形与十字相似设元表边',
  layout: 'layout-b',
  stem: `
    <div class="screen-stem-banner" style="background:#e0f2fe;border-left:4px solid #0284c7;padding:5px 12px;margin-bottom:6px;border-radius:4px;font-size:0.92rem;color:#0369a1;"><b>【几何背景】</b>在 <span class="num">Rt△</span><i class="m">ABC</i> 中，<span class="math">∠<i class="m">ABC</i><span class="num">=90°</span></span>，<span class="math"><i class="m">BC</i><span class="num">=6</span></span>，<span class="math"><i class="m">AB</i><span class="num">=9</span></span>，点 <i class="m">P</i> 在 <i class="m">AC</i> 上且 <span class="math"><i class="m">AP</i><span class="num">=2</span><i class="m">PC</i></span>．射线 <i class="m">PE</i> 绕点 <i class="m">P</i> 顺时针旋转 <span class="num">90°</span> 交 <i class="m">AB</i> 于 <i class="m">F</i>．</div>
    <p><b>【破局关键】</b>点<i class="m">P</i>是斜边上的定分点，如何通过前问建立的模型，将动点<i class="m">E</i>、<i class="m">F</i>的位置用未知数<span class="math"><i class="m">x</i><span class="num">=(</span><i class="m">BE</i><span class="num">)</span></span>完整表示出来？</p>
  `,
  steps: [
    {
      title: '作双垂构造矩形 PMBN',
      html: '过点<i class="m">P</i>作<span class="math"><i class="m">PM</i><span class="num">⊥</span><i class="m">BC</i></span>于<i class="m">M</i>，<span class="math"><i class="m">PN</i><span class="num">⊥</span><i class="m">AB</i></span>于<i class="m">N</i>．由<span class="math">∠<i class="m">B</i><span class="num">=90°</span></span>得四边形<i class="m">PMBN</i>为矩形．'
    },
    {
      title: '由 AP=2PC 确定定点 P 垂线长',
      html: '由<span class="math"><i class="m">AP</i><span class="num">=2</span><i class="m">PC</i><span class="num">⇒</span><span class="fraction"><span><i class="m">CP</i></span><span><i class="m">CA</i></span></span><span class="num">=</span><span class="fraction"><span><span class="num">1</span></span><span><span class="num">3</span></span></span></span>．平行线分线段成比例得<span class="math"><i class="m">PM</i><span class="num">=</span><i class="m">BN</i><span class="num">=3</span></span>，<span class="math"><i class="m">PN</i><span class="num">=</span><i class="m">BM</i><span class="num">=4</span></span>．'
    },
    {
      title: '十字相似设元 x 表出各关键边长',
      html: '由<span class="math">∠<span class="num">1</span><span class="num">=</span>∠<span class="num">2</span></span>得<span class="math"><span class="num">Rt△</span><i class="m">PME</i><span class="num">∽Rt△</span><i class="m">PNF</i></span>，边比<span class="math"><span class="fraction"><span><i class="m">NF</i></span><span><i class="m">ME</i></span></span><span class="num">=</span><span class="fraction"><span><span class="num">4</span></span><span><span class="num">3</span></span></span></span>．设<span class="math"><i class="m">BE</i><span class="num">=</span><i class="m">x</i></span>，则<span class="math"><i class="m">ME</i><span class="num">=4-</span><i class="m">x</i></span>，代入得<span class="math"><i class="m">NF</i><span class="num">=</span><span class="fraction"><span><span class="num">4</span></span><span><span class="num">3</span></span></span><span class="num">(4-</span><i class="m">x</i><span class="num">)</span></span>，进而<span class="math"><i class="m">BF</i><span class="num">=</span><span class="fraction"><span><span class="num">25-4</span><i class="m">x</i></span><span><span class="num">3</span></span></span></span>！'
    }
  ],
  state: { x: 2.94 },
  controls(step, state) {
    return slider('x', '拖动改变点 <i class="m">E</i> 位置', 1.0, 5.0, Number(state.x || 2.94), 0.05);
  },
  renderScene(step, state) {
    const W = 540, H = 410;
    const xVal = Number(state.x !== undefined ? state.x : 2.94);
    const ox = 135, oy = 365, sc = 35;

    // B(0,0), C(6,0), A(0,9)
    const B = [ox, oy];
    const C = [ox + 6 * sc, oy];
    const A = [ox, oy - 9 * sc];

    // P on AC: AP = 2 PC => P = (4, 3)
    const P = [ox + 4 * sc, oy - 3 * sc];
    const M = [ox + 4 * sc, oy];
    const N = [ox, oy - 3 * sc];

    // 斜边 AC 上的三等分基准点 P1(2, 6)
    const P1 = [ox + 2 * sc, oy - 6 * sc];

    // E on BC: BE = xVal
    const E = [ox + xVal * sc, oy];
    // BF = (25 - 4x) / 3
    const bf = (25 - 4 * xVal) / 3;
    const F = [ox, oy - bf * sc];

    let svg = `<svg viewBox="0 0 ${W} ${H}" style="width:100%;height:100%;display:block;">`;

    // 步骤 3: 阴影直角相似三角形 Rt△PME 与 Rt△PNF
    if (step >= 3) {
      svg += svgPoly2([P, M, E], 'rgba(59, 130, 246, 0.28)', '#2563eb', 1.8);
      svg += svgPoly2([P, N, F], 'rgba(249, 115, 22, 0.28)', '#ea580c', 1.8);
    }

    // 主直角三角形 ABC
    svg += svgPoly2([B, C, A], 'none', '#1e293b', 2.8);
    svg += svgRightAngle2(B, C, A, 14, '#1e293b');

    // 题干直角边长标注（BC=6, AB=9 置于上端近A处避开下方推导）
    svg += svgSegmentLabel2(B, C, '6', 20, 0.8, '#64748b');
    svg += svgSegmentLabel2(A, B, '9', 22, 0.16, '#64748b');

    // 斜边 AC 上的三等分点 P1 与等长短杠标记（完美表达 AP = 2PC）
    svg += svgPt2(P1[0], P1[1], '#94a3b8', 3.5);
    svg += svgTickMarks2(A, P1, 1, '#64748b', 6, 0.5);
    svg += svgTickMarks2(P1, P, 1, '#64748b', 6, 0.5);
    svg += svgTickMarks2(P, C, 1, '#64748b', 6, 0.5);

    // 步骤 1: 辅助矩形 PMBN 与直角符号
    if (step >= 1) {
      svg += svgPoly2([B, M, P, N], 'rgba(37, 99, 235, 0.08)', '#2563eb', 2.0, '5 4');
      svg += svgRightAngle2(M, B, P, 12, '#2563eb');
      svg += svgRightAngle2(N, B, P, 12, '#2563eb');
      svg += svgPt2(M[0], M[1], '#2563eb', 4.5);
      svg += svgPt2(N[0], N[1], '#2563eb', 4.5);
      svg += svgTextHalo2(M[0], M[1] + 20, 'M', { color: '#2563eb' });
      svg += svgTextHalo2(N[0] - 18, N[1] + 5, 'N', { color: '#2563eb' });
    }

    // 步骤 2: 标出定长 PM=3, PN=4, BN=3
    if (step === 2) {
      svg += svgSegmentLabel2(M, P, '3', 16, 0.5, '#2563eb');
      svg += svgTextHalo2(ox + 2.5 * sc, N[1] + 16, '4', { size: 14, color: '#2563eb' });
      svg += svgSegmentLabel2(B, N, '3', 18, 0.5, '#2563eb');
      svg += svgSegmentLabel2(B, M, '4', 20, 0.5, '#2563eb');
    }

    // 步骤 3: 旋转线段、直角符号、数字角与各设元边长的数形对应标注！
    if (step >= 3) {
      // 保持定长 PM=3 与 BN=3 的背景参考
      svg += svgSegmentLabel2(M, P, '3', 16, 0.5, '#2563eb');
      svg += svgSegmentLabel2(B, N, '3', 18, 0.5, '#2563eb');
      svg += svgTextHalo2(ox + 2.8 * sc, N[1] + 16, '4', { size: 13, color: '#2563eb' });

      // 旋转线段与直角
      svg += svgLine2(P, E, '#dc2626', 3.2);
      svg += svgLine2(P, F, '#dc2626', 3.2);
      svg += svgLine2(E, F, '#f97316', 2.5);
      svg += svgRightAngle2(P, E, F, 13, '#dc2626');
      svg += svgPt2(E[0], E[1], '#dc2626', 5.5); svg += svgTextHalo2(E[0], E[1] + 20, 'E', { color: '#dc2626' });
      svg += svgPt2(F[0], F[1], '#dc2626', 5.5); svg += svgTextHalo2(F[0] - 18, F[1] + 4, 'F', { color: '#dc2626' });

      // 数字角 ∠1 与 ∠2（十字双垂导角）
      svg += svgAngleArc2(P, N, F, 32, '∠1', '#ea580c', 15);
      svg += svgAngleArc2(P, M, E, 32, '∠2', '#2563eb', 15);

      // 【数形结合：将设元 x 后的各边长精准标注在对应线段旁！】
      // 1. BE = x
      const midBEx = (B[0] + E[0]) / 2;
      svg += svgTextHalo2(midBEx, oy + 20, 'x', { size: 14.5, color: '#dc2626', weight: '700' });

      // 2. ME = 4 - x
      const midMEx = (E[0] + M[0]) / 2;
      svg += svgTextHalo2(midMEx, oy + 20, '4-x', { size: 13, color: '#2563eb', weight: '700' });

      // 3. NF = 4/3(4-x) 胶囊气泡框（位于 NF 中点左侧，与 BN=3 分开）
      const midNFy = (N[1] + F[1]) / 2;
      svg += `
        <g>
          <rect x="20" y="${(midNFy - 11).toFixed(1)}" width="80" height="22" rx="4" fill="#fff7ed" stroke="#fdba74" stroke-width="1.1"/>
          ${svgTextHalo2(60, midNFy + 3, 'NF=4/3(4-x)', { size: 11, color: '#c2410c', weight: '700' })}
        </g>
      `;

      // 4. BF = (25-4x)/3 胶囊气泡框（位于 F 上方左侧）
      svg += `
        <g>
          <rect x="18" y="${(F[1] - 26).toFixed(1)}" width="82" height="22" rx="4" fill="#eff6ff" stroke="#93c5fd" stroke-width="1.1"/>
          ${svgTextHalo2(59, F[1] - 12, 'BF=(25-4x)/3', { size: 11, color: '#1e3a8a', weight: '700' })}
        </g>
      `;
    }

    // 主顶点标注
    svg += svgPt2(B[0], B[1]); svg += svgTextHalo2(B[0] - 16, B[1] + 16, 'B');
    svg += svgPt2(C[0], C[1]); svg += svgTextHalo2(C[0] + 16, C[1] + 16, 'C');
    svg += svgPt2(A[0], A[1]); svg += svgTextHalo2(A[0] - 16, A[1] - 8, 'A');
    svg += svgPt2(P[0], P[1], '#dc2626', 5); svg += svgTextHalo2(P[0] + 16, P[1] - 8, 'P', { color: '#dc2626' });

    svg += `</svg>`;
    return svg;
  }
});

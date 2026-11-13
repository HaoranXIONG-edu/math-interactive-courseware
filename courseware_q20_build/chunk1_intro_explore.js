// =============================================================================
// Chunk 1: 封面导览 + 特例感知 (1) + 类比迁移 (2)
// =============================================================================

window.COURSEWARE_BRAND = '九年级数学 · 几何综合';
window.COURSEWARE_TITLE = '第20题 十字双垂旋转模型探究';
window.COURSEWARE_PHASES = [
  ['① 特例感知', '正方形对角线全等探索'],
  ['② 类比迁移', '菱形与平四双垂相似'],
  ['③ 拓展提升', '矩形双垂与三等分双解'],
  ['④ 模型总结', '十字双垂旋转模型通法']
];

// 通用几何绘图函数
function svgTextHalo(x, y, text, opts = {}) {
  const { size = 15, color = '#0f172a', anchor = 'middle', weight = '700' } = opts;
  const inner = typeof window.svgAutoFormatText === 'function' ? window.svgAutoFormatText(text, size) : text;
  return `<text x="${Number(x).toFixed(1)}" y="${Number(y).toFixed(1)}" font-family="'Times New Roman', 'Songti SC', SimSun, serif" font-weight="${weight}" font-size="${size}" fill="${color}" text-anchor="${anchor}" stroke="#ffffff" stroke-width="3.5" paint-order="stroke">${inner}</text>`;
}

function svgPt(x, y, color = '#1e293b', r = 4.5) {
  return `<circle cx="${Number(x).toFixed(1)}" cy="${Number(y).toFixed(1)}" r="${r}" fill="${color}" stroke="#ffffff" stroke-width="1.8"/>`;
}

function svgPoly(pts, fill, stroke = 'none', strokeWidth = 1.5, dash = '') {
  const ptsStr = pts.map(p => `${Number(p[0]).toFixed(1)},${Number(p[1]).toFixed(1)}`).join(' ');
  const dashAttr = dash ? `stroke-dasharray="${dash}"` : '';
  return `<polygon points="${ptsStr}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" ${dashAttr}/>`;
}

function svgLine(p1, p2, color = '#0f172a', width = 2, dash = '') {
  const dashAttr = dash ? `stroke-dasharray="${dash}"` : '';
  return `<line x1="${Number(p1[0]).toFixed(1)}" y1="${Number(p1[1]).toFixed(1)}" x2="${Number(p2[0]).toFixed(1)}" y2="${Number(p2[1]).toFixed(1)}" stroke="${color}" stroke-width="${width}" ${dashAttr} stroke-linecap="round"/>`;
}

function svgRightAngle(v, p1, p2, size = 12, color = '#64748b') {
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
function svgTickMarks(p1, p2, count = 1, color = '#64748b', size = 6, tPos = 0.5) {
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
function svgAngleArc(v, pStart, pEnd, radius = 24, label = '', color = '#2563eb', labelOffset = 14) {
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
    out += svgTextHalo(lx, ly, label, { size: 14, color: color, weight: '700' });
  }
  return out;
}

// 几何标注：线段标签 (Segment Label - 严格法向偏移)
function svgSegmentLabel(p1, p2, text, offset = 18, tPos = 0.5, color = '#0f172a', size = 14) {
  const dx = p2[0] - p1[0];
  const dy = p2[1] - p1[1];
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const lx = p1[0] + dx * tPos + nx * offset;
  const ly = p1[1] + dy * tPos + ny * offset;
  return svgTextHalo(lx, ly, text, { size: size, color: color, weight: '700' });
}

// -----------------------------------------------------------------------------
// Slide 0: 封面与学习目标导览页
// -----------------------------------------------------------------------------
window.defineSlide({
  lesson: 1,
  phase: 0,
  cover: true,
  navTag: '封面·导览',
  section: '特例感知',
  title: '第20题 十字双垂旋转模型探究',
  layout: 'layout-a',
  stem: '',
  renderCover() {
    return window.renderStandardCover({
      badge: '中考压轴经典几何模型 · 深度研磨',
      title: '十字双垂旋转模型探究',
      subtitle: '从对称全等到一般相似，再到代数设元列方程的通法迁移',
      tags: [
        '特例感知：正方形对角线全等',
        '类比迁移：菱形与平四相似',
        '拓展提升：矩形设元与 8 字双解',
        '通法全景：几何旋转解题体系'
      ]
    });
  }
});

// -----------------------------------------------------------------------------
// Slide 1: 第(1)问 正方形特例感知 (3 步骤)
// -----------------------------------------------------------------------------
window.defineSlide({
  lesson: 1,
  phase: 0,
  navTag: '(1)·正方形全等',
  section: '特例感知',
  title: '第(1)问【特例感知】：正方形对角线交点旋转构造全等',
  layout: 'layout-b',
  stem: `
    <div class="screen-stem-banner" style="background:#e0f2fe;border-left:4px solid #0284c7;padding:5px 12px;margin-bottom:6px;border-radius:4px;font-size:0.92rem;color:#0369a1;"><b>【特例感知】</b>正方形对角线互相垂直平分且平分一组对角，旋转角恰为 90°．</div>
    <p>（<span class="num">1</span>）如图<span class="num">1</span>，在正方形<i class="m">ABCD</i>中，对角线交于点<i class="m">O</i>，点<i class="m">E</i>在边<i class="m">AB</i>上，射线<i class="m">OE</i>绕点<i class="m">O</i>顺时针旋转<span class="num">90°</span>交<i class="m">AD</i>于点<i class="m">F</i>．求证：<span class="math"><i class="m">OE</i><span class="num">=</span><i class="m">OF</i></span>．</p>
  `,
  steps: [
    {
      title: '作十字双垂线并由角平分线判定线段相等',
      html: '过点<i class="m">O</i>作<span class="math"><i class="m">OM</i><span class="num">⊥</span><i class="m">AB</i></span>于<i class="m">M</i>，<span class="math"><i class="m">ON</i><span class="num">⊥</span><i class="m">AD</i></span>于<i class="m">N</i>．由正方形性质知<i class="m">AO</i>平分<span class="math">∠<i class="m">DAB</i></span>，故垂线段<span class="math"><i class="m">OM</i><span class="num">=</span><i class="m">ON</i></span>．'
    },
    {
      title: '同减公共角完成导角 ∠1 = ∠2',
      html: '易知<span class="math">∠<i class="m">MON</i><span class="num">=90°</span></span>．又旋转角<span class="math">∠<i class="m">EOF</i><span class="num">=90°</span></span>，两边同时减去公共角<span class="math">∠<i class="m">MOF</i></span>，得<span class="math">∠<span class="num">1</span>（∠<i class="m">MOE</i>）<span class="num">=</span>∠<span class="num">2</span>（∠<i class="m">NOF</i>）</span>．'
    },
    {
      title: 'ASA 判定全等直接得出 OE = OF',
      html: '在<span class="math"><span class="num">Rt△</span><i class="m">OME</i></span>与<span class="math"><span class="num">Rt△</span><i class="m">ONF</i></span>中，由<span class="math">∠<i class="m">OME</i><span class="num">=</span>∠<i class="m">ONF</i><span class="num">=90°</span></span>，<span class="math"><i class="m">OM</i><span class="num">=</span><i class="m">ON</i></span>，<span class="math">∠<span class="num">1</span><span class="num">=</span>∠<span class="num">2</span></span>，得<span class="math"><span class="num">Rt△</span><i class="m">OME</i><span class="num">≌Rt△</span><i class="m">ONF</i><span class="num">（ASA）</span></span>，故<span class="math"><i class="m">OE</i><span class="num">=</span><i class="m">OF</i></span>！'
    }
  ],
  state: { tE: 0.65 },
  controls(step, state) {
    return slider('tE', '拖动改变点 <i class="m">E</i> 位置', 0.2, 0.85, state.tE || 0.65, 0.05);
  },
  renderScene(step, state) {
    const W = 540, H = 410;
    const tE = Number(state.tE !== undefined ? state.tE : 0.65);
    const ox = 145, oy = 330, a = 250;

    const A = [ox, oy];
    const B = [ox + a, oy];
    const C = [ox + a, oy - a];
    const D = [ox, oy - a];
    const O = [ox + a / 2, oy - a / 2];

    const M = [O[0], oy];
    const N = [ox, O[1]];
    const E = [ox + a * tE, oy];
    const distME = E[0] - M[0];
    const F = [ox, N[1] - distME];

    let svg = `<svg viewBox="0 0 ${W} ${H}" style="width:100%;height:100%;display:block;">`;

    // 步骤 2、3 阴影直角全等三角形
    if (step >= 2) {
      svg += svgPoly([O, M, E], 'rgba(59, 130, 246, 0.32)', '#2563eb', 1.8);
      svg += svgPoly([O, N, F], 'rgba(249, 115, 22, 0.32)', '#ea580c', 1.8);
    }

    // 正方形轮廓与对角线
    svg += svgPoly([A, B, C, D], 'none', '#1e293b', 2.8);
    svg += svgLine(A, C, '#94a3b8', 1.6);
    svg += svgLine(B, D, '#94a3b8', 1.6);

    // 步骤 1: 辅助十字双垂线 OM, ON，标注直角与等长短杠
    if (step >= 1) {
      svg += svgLine(O, M, '#dc2626', 2.4, '6 4');
      svg += svgLine(O, N, '#dc2626', 2.4, '6 4');
      svg += svgRightAngle(M, O, B, 13, '#dc2626');
      svg += svgRightAngle(N, O, D, 13, '#dc2626');
      svg += svgTickMarks(O, M, 1, '#dc2626', 6, 0.5);
      svg += svgTickMarks(O, N, 1, '#dc2626', 6, 0.5);
      svg += svgPt(M[0], M[1], '#dc2626', 4.5);
      svg += svgPt(N[0], N[1], '#dc2626', 4.5);
      svg += svgTextHalo(M[0], M[1] + 20, 'M', { color: '#dc2626' });
      svg += svgTextHalo(N[0] - 18, N[1] + 5, 'N', { color: '#dc2626' });
    }

    // 旋转线段 OE, OF
    const rotColor = step >= 1 ? '#dc2626' : '#2563eb';
    svg += svgLine(O, E, rotColor, 3.2);
    svg += svgLine(O, F, rotColor, 3.2);
    svg += svgRightAngle(O, E, F, 14, '#2563eb');

    // 步骤 2: 角弧标注 ∠1 与 ∠2
    if (step >= 2) {
      svg += svgAngleArc(O, M, E, 28, '∠1', '#2563eb', 16);
      svg += svgAngleArc(O, N, F, 28, '∠2', '#ea580c', 16);
    }

    // 步骤 3: 证明结论 OE 与 OF 上标注等长短杠
    if (step >= 3) {
      svg += svgTickMarks(O, E, 2, '#16a34a', 7, 0.5);
      svg += svgTickMarks(O, F, 2, '#16a34a', 7, 0.5);
    }

    // 主顶点标注
    svg += svgPt(A[0], A[1]); svg += svgTextHalo(A[0] - 16, A[1] + 16, 'A');
    svg += svgPt(B[0], B[1]); svg += svgTextHalo(B[0] + 16, B[1] + 16, 'B');
    svg += svgPt(C[0], C[1]); svg += svgTextHalo(C[0] + 16, C[1] - 8, 'C');
    svg += svgPt(D[0], D[1]); svg += svgTextHalo(D[0] - 16, D[1] - 8, 'D');
    svg += svgPt(O[0], O[1], '#1e293b', 5); svg += svgTextHalo(O[0] + 16, O[1] - 12, 'O');
    svg += svgPt(E[0], E[1], rotColor, 5.5); svg += svgTextHalo(E[0], E[1] + 20, 'E', { color: rotColor });
    svg += svgPt(F[0], F[1], rotColor, 5.5); svg += svgTextHalo(F[0] - 18, F[1] + 5, 'F', { color: rotColor });

    svg += `</svg>`;
    return svg;
  }
});

// -----------------------------------------------------------------------------
// Slide 2: 第(2)问 菱形类比迁移 (3 步骤)
// -----------------------------------------------------------------------------
window.defineSlide({
  lesson: 1,
  phase: 1,
  navTag: '(2)·菱形双垂全等',
  section: '类比迁移',
  title: '第(2)问【类比迁移】：菱形十字双垂全等证明',
  layout: 'layout-b',
  stem: `
    <div class="screen-stem-banner" style="background:#e0f2fe;border-left:4px solid #0284c7;padding:5px 12px;margin-bottom:6px;border-radius:4px;font-size:0.92rem;color:#0369a1;"><b>【类比迁移】</b>菱形中对角线依然平分一组对角，旋转角恰等于钝角 120°！</div>
    <p>（<span class="num">2</span>）如图<span class="num">2</span>，在菱形<i class="m">ABCD</i>中，<span class="math">∠<i class="m">ADC</i><span class="num">=120°</span></span>，点<i class="m">O</i>为对角线交点，将射线<i class="m">OE</i>绕点<i class="m">O</i>顺时针旋转<span class="num">120°</span>交<i class="m">AD</i>于点<i class="m">F</i>．求证：<span class="math"><i class="m">OE</i><span class="num">=</span><i class="m">OF</i></span>．</p>
  `,
  steps: [
    {
      title: '过点 O 作十字双垂 OM⊥AB, ON⊥AD',
      html: '在菱形<i class="m">ABCD</i>中，对角线<i class="m">AC</i>平分<span class="math">∠<i class="m">DAB</i></span>．由角平分线性质，点<i class="m">O</i>到两边距离相等：<span class="math"><i class="m">OM</i><span class="num">=</span><i class="m">ON</i></span>．'
    },
    {
      title: '利用四边形对角互补与旋转角同减公共角导角',
      html: '在四边形<i class="m">OMAN</i>中，<span class="math">∠<i class="m">OMA</i><span class="num">=</span>∠<i class="m">ONA</i><span class="num">=90°</span></span>，<span class="math">∠<i class="m">A</i><span class="num">=180°-120°=60°</span></span>，故<span class="math">∠<i class="m">MON</i><span class="num">=120°</span></span>．又旋转角<span class="math">∠<i class="m">EOF</i><span class="num">=120°</span></span>，同减公共角得<span class="math">∠<span class="num">1</span><span class="num">=</span>∠<span class="num">2</span></span>．'
    },
    {
      title: 'ASA 判定全等直接证得 OE = OF',
      html: '在<span class="math"><span class="num">Rt△</span><i class="m">OME</i></span>与<span class="math"><span class="num">Rt△</span><i class="m">ONF</i></span>中，由<span class="math">∠<i class="m">OME</i><span class="num">=</span>∠<i class="m">ONF</i><span class="num">=90°</span></span>，<span class="math"><i class="m">OM</i><span class="num">=</span><i class="m">ON</i></span>，<span class="math">∠<span class="num">1</span><span class="num">=</span>∠<span class="num">2</span></span>，得<span class="math"><span class="num">Rt△</span><i class="m">OME</i><span class="num">≌Rt△</span><i class="m">ONF</i><span class="num">（ASA）</span></span>，故<span class="math"><i class="m">OE</i><span class="num">=</span><i class="m">OF</i></span>！'
    }
  ],
  state: { tE: 0.62 },
  controls(step, state) {
    return slider('tE', '拖动改变点 <i class="m">E</i> 位置', 0.25, 0.85, state.tE || 0.62, 0.05);
  },
  renderScene(step, state) {
    const W = 540, H = 410;
    const tE = Number(state.tE !== undefined ? state.tE : 0.62);
    const ox = 90, oy = 320, a = 220;

    const rad60 = Math.PI / 3;
    const A = [ox, oy];
    const B = [ox + a, oy];
    const D = [ox + a * Math.cos(rad60), oy - a * Math.sin(rad60)];
    const C = [B[0] + a * Math.cos(rad60), B[1] - a * Math.sin(rad60)];
    const O = [(A[0] + C[0]) / 2, (A[1] + C[1]) / 2];

    const M = [O[0], oy];
    const uAD = [Math.cos(rad60), -Math.sin(rad60)];
    const dotN = (O[0] - A[0]) * uAD[0] + (O[1] - A[1]) * uAD[1];
    const N = [A[0] + dotN * uAD[0], A[1] + dotN * uAD[1]];

    const E = [ox + a * tE, oy];
    const distME = E[0] - M[0];
    const F = [N[0] - distME * uAD[0], N[1] - distME * uAD[1]];

    let svg = `<svg viewBox="0 0 ${W} ${H}" style="width:100%;height:100%;display:block;">`;

    // 步骤 2、3: 阴影全等直角三角形
    if (step >= 2) {
      svg += svgPoly([O, M, E], 'rgba(59, 130, 246, 0.32)', '#2563eb', 1.8);
      svg += svgPoly([O, N, F], 'rgba(249, 115, 22, 0.32)', '#ea580c', 1.8);
    }

    // 菱形轮廓与对角线
    svg += svgPoly([A, B, C, D], 'none', '#1e293b', 2.8);
    svg += svgLine(A, C, '#94a3b8', 1.6);
    svg += svgLine(B, D, '#475569', 2.2);

    // 钝角 ∠ADC = 120° 角弧标注
    svg += svgAngleArc(D, A, C, 22, '120°', '#64748b', 14);

    // 步骤 1: 辅助双垂线 OM, ON，标注直角与等长短杠
    if (step >= 1) {
      svg += svgLine(O, M, '#dc2626', 2.4, '6 4');
      svg += svgLine(O, N, '#dc2626', 2.4, '6 4');
      svg += svgRightAngle(M, O, A, 13, '#dc2626');
      svg += svgRightAngle(N, O, A, 13, '#dc2626');
      svg += svgTickMarks(O, M, 1, '#dc2626', 6, 0.5);
      svg += svgTickMarks(O, N, 1, '#dc2626', 6, 0.5);
      svg += svgPt(M[0], M[1], '#dc2626', 4.5);
      svg += svgPt(N[0], N[1], '#dc2626', 4.5);
      svg += svgTextHalo(M[0], M[1] + 20, 'M', { color: '#dc2626' });
      svg += svgTextHalo(N[0] - 18, N[1] - 6, 'N', { color: '#dc2626' });
    }

    // 旋转线段 OE, OF
    const rotColor = step >= 1 ? '#dc2626' : '#2563eb';
    svg += svgLine(O, E, rotColor, 3.2);
    svg += svgLine(O, F, rotColor, 3.2);
    svg += svgAngleArc(O, E, F, 24, '120°', '#2563eb', 14);

    // 步骤 2: 角弧标注 ∠1 与 ∠2
    if (step >= 2) {
      svg += svgAngleArc(O, M, E, 32, '∠1', '#2563eb', 16);
      svg += svgAngleArc(O, N, F, 32, '∠2', '#ea580c', 16);
    }

    // 步骤 3: 证明结论 OE 与 OF 上标注等长短杠
    if (step >= 3) {
      svg += svgTickMarks(O, E, 2, '#16a34a', 7, 0.5);
      svg += svgTickMarks(O, F, 2, '#16a34a', 7, 0.5);
    }

    // 主顶点标注
    svg += svgPt(A[0], A[1]); svg += svgTextHalo(A[0] - 16, A[1] + 16, 'A');
    svg += svgPt(B[0], B[1]); svg += svgTextHalo(B[0] + 16, B[1] + 16, 'B');
    svg += svgPt(C[0], C[1]); svg += svgTextHalo(C[0] + 16, C[1] - 8, 'C');
    svg += svgPt(D[0], D[1]); svg += svgTextHalo(D[0] - 14, D[1] - 14, 'D');
    svg += svgPt(O[0], O[1], '#1e293b', 5); svg += svgTextHalo(O[0] + 18, O[1] - 12, 'O');
    svg += svgPt(E[0], E[1], rotColor, 5.5); svg += svgTextHalo(E[0], E[1] + 20, 'E', { color: rotColor });
    svg += svgPt(F[0], F[1], rotColor, 5.5); svg += svgTextHalo(F[0] - 18, F[1] + 6, 'F', { color: rotColor });

    svg += `</svg>`;
    return svg;
  }
});

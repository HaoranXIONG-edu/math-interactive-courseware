// =============================================================================
// Chunk 3: 拓展提升 (4) 情况一、情况二与模型总结
// =============================================================================

// 通用几何绘图函数
function svgTextHalo3(x, y, text, opts = {}) {
  const { size = 15, color = '#0f172a', anchor = 'middle', weight = '700' } = opts;
  const inner = typeof window.svgAutoFormatText === 'function' ? window.svgAutoFormatText(text, size) : text;
  return `<text x="${Number(x).toFixed(1)}" y="${Number(y).toFixed(1)}" font-family="'Times New Roman', 'Songti SC', SimSun, serif" font-weight="${weight}" font-size="${size}" fill="${color}" text-anchor="${anchor}" stroke="#ffffff" stroke-width="3.5" paint-order="stroke">${inner}</text>`;
}

function svgPt3(x, y, color = '#1e293b', r = 4.5) {
  return `<circle cx="${Number(x).toFixed(1)}" cy="${Number(y).toFixed(1)}" r="${r}" fill="${color}" stroke="#ffffff" stroke-width="1.8"/>`;
}

function svgPoly3(pts, fill, stroke = 'none', strokeWidth = 1.5, dash = '') {
  const ptsStr = pts.map(p => `${Number(p[0]).toFixed(1)},${Number(p[1]).toFixed(1)}`).join(' ');
  const dashAttr = dash ? `stroke-dasharray="${dash}"` : '';
  return `<polygon points="${ptsStr}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" ${dashAttr}/>`;
}

function svgLine3(p1, p2, color = '#0f172a', width = 2, dash = '') {
  const dashAttr = dash ? `stroke-dasharray="${dash}"` : '';
  return `<line x1="${Number(p1[0]).toFixed(1)}" y1="${Number(p1[1]).toFixed(1)}" x2="${Number(p2[0]).toFixed(1)}" y2="${Number(p2[1]).toFixed(1)}" stroke="${color}" stroke-width="${width}" ${dashAttr} stroke-linecap="round"/>`;
}

function svgRightAngle3(v, p1, p2, size = 12, color = '#64748b') {
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
function svgTickMarks3(p1, p2, count = 1, color = '#64748b', size = 6, tPos = 0.5) {
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

// 几何标注：线段标签 (Segment Label - 严格法向偏移)
function svgSegmentLabel3(p1, p2, text, offset = 18, tPos = 0.5, color = '#0f172a', size = 14) {
  const dx = p2[0] - p1[0];
  const dy = p2[1] - p1[1];
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const lx = p1[0] + dx * tPos + nx * offset;
  const ly = p1[1] + dy * tPos + ny * offset;
  return svgTextHalo3(lx, ly, text, { size: size, color: color, weight: '700' });
}

// -----------------------------------------------------------------------------
// Slide 5: 第(4)问 情况一：EG = 1/3 EF (2 步骤)
// -----------------------------------------------------------------------------
window.defineSlide({
  lesson: 1,
  phase: 2,
  navTag: '(4)·情况一求解',
  section: '拓展提升',
  title: '第(4)问【拓展提升】：平行 8 字相似与情况一求解',
  layout: 'layout-b',
  stem: `
    <div class="screen-stem-banner" style="background:#e0f2fe;border-left:4px solid #0284c7;padding:4px 12px;margin-bottom:4px;border-radius:4px;font-size:0.9rem;color:#0369a1;"><b>【已知关系】</b>设 <span class="math"><i class="m">BE</i><span class="num">=</span><i class="m">x</i></span>，已求得 <span class="math"><i class="m">BF</i><span class="num">=</span><span class="fraction"><span><span class="num">25-4</span><i class="m">x</i></span><span><span class="num">3</span></span></span></span>，定点 <i class="m">P</i> 坐标为 <span class="math"><span class="num">(4, 3)</span></span>．</div>
    <p>（<span class="num">4</span>）当点<i class="m">G</i>是<i class="m">EF</i>的三等分点且<span class="math"><i class="m">EG</i><span class="num">=</span><span class="fraction"><span><span class="num">1</span></span><span><span class="num">3</span></span></span><i class="m">EF</i></span>时，求<i class="m">BE</i>的长为<span class="screen-blank" data-step="2" data-ans="<span class='fraction'><span><span class='num'>50</span></span><span><span class='num'>17</span></span></span>"></span>．</p>
  `,
  steps: [
    {
      title: '作 FH∥BC 构造 8 字相似建立边比',
      html: '作<span class="math"><i class="m">FH</i><span class="num">∥</span><i class="m">BC</i></span>交<i class="m">BP</i>延长线于<i class="m">H</i>．由<span class="math"><span class="num">△</span><i class="m">BFH</i><span class="num">∽△</span><i class="m">BNP</i><span class="num">⇒</span><i class="m">FH</i><span class="num">=</span><span class="fraction"><span><span class="num">4</span></span><span><span class="num">3</span></span></span><i class="m">BF</i><span class="num">=</span><span class="fraction"><span><span class="num">4(25-4</span><i class="m">x</i><span class="num">)</span></span><span><span class="num">9</span></span></span></span>；由<span class="math"><span class="num">8</span></span>字相似<span class="math"><span class="num">△</span><i class="m">EBG</i><span class="num">∽△</span><i class="m">FHG</i><span class="num">⇒</span><span class="fraction"><span><i class="m">EG</i></span><span><i class="m">FG</i></span></span><span class="num">=</span><span class="fraction"><span><i class="m">BE</i></span><span><i class="m">FH</i></span></span><span class="num">=</span><span class="fraction"><span><span class="num">9</span><i class="m">x</i></span><span><span class="num">4(25-4</span><i class="m">x</i><span class="num">)</span></span></span></span>．'
    },
    {
      title: '代入三等分比列方程求出 BE',
      html: '由<span class="math"><i class="m">EG</i><span class="num">=</span><span class="fraction"><span><span class="num">1</span></span><span><span class="num">3</span></span></span><i class="m">EF</i><span class="num">⇒</span><span class="fraction"><span><i class="m">EG</i></span><span><i class="m">FG</i></span></span><span class="num">=</span><span class="fraction"><span><span class="num">1</span></span><span><span class="num">2</span></span></span></span>．代入边比：<span class="math" style="white-space:nowrap;"><span class="fraction"><span><span class="num">9</span><i class="m">x</i></span><span><span class="num">4(25-4</span><i class="m">x</i><span class="num">)</span></span></span><span class="num">=</span><span class="fraction"><span><span class="num">1</span></span><span><span class="num">2</span></span></span></span>，去分母得<span class="math" style="white-space:nowrap;"><span class="num">9</span><i class="m">x</i><span class="num">=2(25-4</span><i class="m">x</i><span class="num">)⇒17</span><i class="m">x</i><span class="num">=50</span></span>，解得<span class="math" style="white-space:nowrap;"><i class="m">x</i><span class="num">=</span><span class="fraction"><span><span class="num">50</span></span><span><span class="num">17</span></span></span></span>！'
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

    // P = (4, 3)
    const P = [ox + 4 * sc, oy - 3 * sc];
    const P1 = [ox + 2 * sc, oy - 6 * sc];

    // E on BC: BE = xVal
    const E = [ox + xVal * sc, oy];
    // BF = (25 - 4x) / 3
    const bf = (25 - 4 * xVal) / 3;
    const F = [ox, oy - bf * sc];

    // H on ray BP: y = (3/4)x => line FH: y = bf => H_x = (4/3)*bf
    const fhLen = (4 / 3) * bf;
    const Hpt = [ox + fhLen * sc, oy - bf * sc];

    // EF 上的两个真实三等分基准点 T1(靠近E) 与 T2(靠近F)
    const T1 = [E[0] + (1 / 3) * (F[0] - E[0]), E[1] + (1 / 3) * (F[1] - E[1])];
    const T2 = [E[0] + (2 / 3) * (F[0] - E[0]), E[1] + (2 / 3) * (F[1] - E[1])];

    // 动点 G: BP 与 EF 的交点
    const ratioEGFG = xVal / (fhLen || 1);
    const tG = ratioEGFG / (1 + ratioEGFG);
    const G = [E[0] + tG * (F[0] - E[0]), E[1] + tG * (F[1] - E[1])];

    let svg = `<svg viewBox="0 0 ${W} ${H}" style="width:100%;height:100%;display:block;">`;

    // 步骤 1: 阴影 8 字相似三角形 △EBG 与 △FHG
    if (step >= 1) {
      svg += svgPoly3([E, B, G], 'rgba(34, 197, 94, 0.28)', '#16a34a', 1.8);
      svg += svgPoly3([F, Hpt, G], 'rgba(234, 88, 12, 0.24)', '#ea580c', 1.8);
    }

    // 主直角三角形 ABC 与直角符号
    svg += svgPoly3([B, C, A], 'none', '#1e293b', 2.8);
    svg += svgRightAngle3(B, C, A, 14, '#1e293b');

    // 斜边 AC 上的三等分点 P1 与等长短杠标记
    svg += svgPt3(P1[0], P1[1], '#94a3b8', 3.5);
    svg += svgTickMarks3(A, P1, 1, '#64748b', 6, 0.5);
    svg += svgTickMarks3(P1, P, 1, '#64748b', 6, 0.5);
    svg += svgTickMarks3(P, C, 1, '#64748b', 6, 0.5);

    // 直线 BP 与平行辅助线 FH
    const bpExt = [ox + 7.5 * sc, oy - 7.5 * 0.75 * sc];
    svg += svgLine3(B, bpExt, '#6366f1', 2.0, '6 4');
    if (step >= 1) {
      svg += svgLine3(F, Hpt, '#ea580c', 2.4, '6 4');
      svg += svgRightAngle3(F, Hpt, B, 12, '#ea580c');
      svg += svgPt3(Hpt[0], Hpt[1], '#ea580c', 4.5);
      svg += svgTextHalo3(Hpt[0] + 16, Hpt[1] + 4, 'H', { color: '#ea580c' });
      // 8 字相似对应边代数式标注（采用精致防遮挡胶囊气泡）
      const midFHx = (F[0] + Hpt[0]) / 2;
      svg += `
        <g>
          <rect x="${(midFHx - 52).toFixed(1)}" y="${(F[1] - 25).toFixed(1)}" width="104" height="22" rx="4" fill="#fff7ed" stroke="#fdba74" stroke-width="1.1"/>
          ${svgTextHalo3(midFHx, F[1] - 9, 'FH=4(25-4x)/9', { size: 11, color: '#c2410c', weight: '700' })}
        </g>
      `;

      // BF 边长标注
      svg += `
        <g>
          <rect x="18" y="${(F[1] - 26).toFixed(1)}" width="82" height="22" rx="4" fill="#eff6ff" stroke="#93c5fd" stroke-width="1.1"/>
          ${svgTextHalo3(59, F[1] - 12, 'BF=(25-4x)/3', { size: 11, color: '#1e3a8a', weight: '700' })}
        </g>
      `;

      // BE 边长标注：步骤 1 设元为 x，步骤 2 得出结论 BE = 50/17
      const midBEx = (B[0] + E[0]) / 2;
      if (step >= 2) {
        svg += `
          <g>
            <rect x="${(midBEx - 46).toFixed(1)}" y="${(oy + 8).toFixed(1)}" width="92" height="24" rx="5" fill="#f0fdf4" stroke="#86efac" stroke-width="1.3"/>
            ${svgTextHalo3(midBEx, oy + 24, 'BE = 50/17', { size: 12.5, color: '#15803d', weight: '700' })}
          </g>
        `;
      } else {
        svg += svgTextHalo3(midBEx, oy + 20, 'x', { size: 14, color: '#dc2626', weight: '700' });
      }
    }

    // 旋转直角线段 PE, PF, EF 与旋转角直角标记
    svg += svgLine3(P, E, '#dc2626', 2.5);
    svg += svgLine3(P, F, '#dc2626', 2.5);
    svg += svgRightAngle3(P, E, F, 13, '#dc2626');
    svg += svgLine3(E, F, '#16a34a', 3.0);

    // 线段 EF 上的三等分基准点刻度与单短杠标注
    // 空心圆圈标记三等分分点 T2
    svg += `<circle cx="${T2[0].toFixed(1)}" cy="${T2[1].toFixed(1)}" r="3.8" fill="#ffffff" stroke="#16a34a" stroke-width="1.8"/>`;
    // 在三段上标注等长单短杠，表示点 G 刚好是靠近 E 的三等分点
    svg += svgTickMarks3(E, T1, 1, '#16a34a', 6, 0.5);
    svg += svgTickMarks3(T1, T2, 1, '#16a34a', 6, 0.5);
    svg += svgTickMarks3(T2, F, 1, '#16a34a', 6, 0.5);

    // 交点 G
    svg += svgPt3(G[0], G[1], '#16a34a', 6.0);
    svg += svgTextHalo3(G[0] + 18, G[1] + 4, 'G', { color: '#16a34a' });

    // 主顶点标注
    svg += svgPt3(B[0], B[1]); svg += svgTextHalo3(B[0] - 16, B[1] + 16, 'B');
    svg += svgPt3(C[0], C[1]); svg += svgTextHalo3(C[0] + 16, C[1] + 16, 'C');
    svg += svgPt3(A[0], A[1]); svg += svgTextHalo3(A[0] - 16, A[1] - 8, 'A');
    svg += svgPt3(P[0], P[1], '#dc2626', 5); svg += svgTextHalo3(P[0] + 16, P[1] - 8, 'P', { color: '#dc2626' });
    svg += svgPt3(E[0], E[1], '#dc2626', 5.5); svg += svgTextHalo3(E[0], E[1] + 20, 'E', { color: '#dc2626' });
    svg += svgPt3(F[0], F[1], '#dc2626', 5.5); svg += svgTextHalo3(F[0] - 18, F[1] + 4, 'F', { color: '#dc2626' });

    svg += `</svg>`;
    return svg;
  }
});

// -----------------------------------------------------------------------------
// Slide 6: 第(4)问 情况二求解与综合双解 (2 步骤)
// -----------------------------------------------------------------------------
window.defineSlide({
  lesson: 1,
  phase: 2,
  navTag: '(4)·情况二与双解',
  section: '拓展提升',
  title: '第(4)问【拓展提升】：情况二求解与综合双解总结',
  layout: 'layout-b',
  stem: `
    <div class="screen-stem-banner" style="background:#e0f2fe;border-left:4px solid #0284c7;padding:4px 12px;margin-bottom:4px;border-radius:4px;font-size:0.9rem;color:#0369a1;"><b>【分类讨论】</b>点 <i class="m">G</i> 是 <i class="m">EF</i> 的三等分点，存在情况一 <span class="math"><i class="m">EG</i><span class="num">=</span><span class="fraction"><span><span class="num">1</span></span><span><span class="num">3</span></span></span><i class="m">EF</i></span> 与情况二 <span class="math"><i class="m">FG</i><span class="num">=</span><span class="fraction"><span><span class="num">1</span></span><span><span class="num">3</span></span></span><i class="m">EF</i></span>．</div>
    <p>（<span class="num">4</span>）当<span class="math"><i class="m">FG</i><span class="num">=</span><span class="fraction"><span><span class="num">1</span></span><span><span class="num">3</span></span></span><i class="m">EF</i></span>时，求<i class="m">BE</i>的长及最终双解为<span class="screen-blank" data-step="2" data-ans="<span class='fraction'><span><span class='num'>50</span></span><span><span class='num'>17</span></span></span> 或 <span class='fraction'><span><span class='num'>200</span></span><span><span class='num'>41</span></span></span>"></span>．</p>
  `,
  steps: [
    {
      title: '情况二代入比例方程快速求解',
      html: '当点<i class="m">G</i>靠近点<i class="m">F</i>时，<span class="math"><i class="m">FG</i><span class="num">=</span><span class="fraction"><span><span class="num">1</span></span><span><span class="num">3</span></span></span><i class="m">EF</i><span class="num">⇒</span><span class="fraction"><span><i class="m">EG</i></span><span><i class="m">FG</i></span></span><span class="num">=2</span></span>．代入 8 字相似边比：<span class="math" style="white-space:nowrap;"><span class="fraction"><span><span class="num">9</span><i class="m">x</i></span><span><span class="num">4(25-4</span><i class="m">x</i><span class="num">)</span></span></span><span class="num">=2</span></span>，去分母化简得<span class="math" style="white-space:nowrap;"><span class="num">9</span><i class="m">x</i><span class="num">=8(25-4</span><i class="m">x</i><span class="num">)⇒41</span><i class="m">x</i><span class="num">=200</span></span>，解得<span class="math" style="white-space:nowrap;"><i class="m">x</i><span class="num">=</span><span class="fraction"><span><span class="num">200</span></span><span><span class="num">41</span></span></span></span>！'
    },
    {
      title: '区间存在性检验与综合双解结论',
      html: '点<i class="m">E</i>在线段<i class="m">BC</i>上，需满足<span class="math"><span class="num">0&lt;</span><i class="m">x</i><span class="num">&lt;6</span></span>．检验知：<span class="math"><span class="num">0&lt;</span><span class="fraction"><span><span class="num">50</span></span><span><span class="num">17</span></span></span><span class="num">≈2.94&lt;6</span></span>，且<span class="math"><span class="num">0&lt;</span><span class="fraction"><span><span class="num">200</span></span><span><span class="num">41</span></span></span><span class="num">≈4.88&lt;6</span></span>，两解均符合几何意义！综上，<i class="m">BE</i>的长为<span class="math" style="white-space:nowrap;"><span class="fraction"><span><span class="num">50</span></span><span><span class="num">17</span></span></span></span>或<span class="math" style="white-space:nowrap;"><span class="fraction"><span><span class="num">200</span></span><span><span class="num">41</span></span></span></span>．'
    }
  ],
  state: { caseType: 'case2', x: 4.88 },
  controls(step, state) {
    const curCase = state.caseType || 'case2';
    const caseBtns = modeButtons('caseType', curCase, [
      ['case1', '情况一: EG=1/3EF', step],
      ['case2', '情况二: FG=1/3EF', step]
    ]);
    const defX = curCase === 'case1' ? 2.94 : 4.88;
    return caseBtns + slider('x', '拖动改变点 <i class="m">E</i> 位置', 1.0, 5.5, Number(state.x || defX), 0.05);
  },
  renderScene(step, state) {
    const W = 540, H = 410;
    const curCase = state.caseType || 'case2';
    const defX = curCase === 'case1' ? 2.94 : 4.88;
    const xVal = Number(state.x !== undefined ? state.x : defX);
    const ox = 135, oy = 365, sc = 35;

    // B(0,0), C(6,0), A(0,9)
    const B = [ox, oy];
    const C = [ox + 6 * sc, oy];
    const A = [ox, oy - 9 * sc];

    // P = (4, 3)
    const P = [ox + 4 * sc, oy - 3 * sc];
    const P1 = [ox + 2 * sc, oy - 6 * sc];

    const E = [ox + xVal * sc, oy];
    const bf = (25 - 4 * xVal) / 3;
    const F = [ox, oy - bf * sc];

    const fhLen = (4 / 3) * bf;
    const Hpt = [ox + fhLen * sc, oy - bf * sc];

    // EF 上的两个真实三等分基准点 T1(靠近E) 与 T2(靠近F)
    const T1 = [E[0] + (1 / 3) * (F[0] - E[0]), E[1] + (1 / 3) * (F[1] - E[1])];
    const T2 = [E[0] + (2 / 3) * (F[0] - E[0]), E[1] + (2 / 3) * (F[1] - E[1])];

    const ratioEGFG = xVal / (fhLen || 1);
    const tG = ratioEGFG / (1 + ratioEGFG);
    const G = [E[0] + tG * (F[0] - E[0]), E[1] + tG * (F[1] - E[1])];

    let svg = `<svg viewBox="0 0 ${W} ${H}" style="width:100%;height:100%;display:block;">`;

    // 阴影 8 字相似三角形
    svg += svgPoly3([E, B, G], 'rgba(34, 197, 94, 0.28)', '#16a34a', 1.8);
    svg += svgPoly3([F, Hpt, G], 'rgba(234, 88, 12, 0.24)', '#ea580c', 1.8);

    // 主直角三角形 ABC 与直角符号
    svg += svgPoly3([B, C, A], 'none', '#1e293b', 2.8);
    svg += svgRightAngle3(B, C, A, 14, '#1e293b');

    // 斜边 AC 上的三等分点 P1 与等长短杠标记
    svg += svgPt3(P1[0], P1[1], '#94a3b8', 3.5);
    svg += svgTickMarks3(A, P1, 1, '#64748b', 6, 0.5);
    svg += svgTickMarks3(P1, P, 1, '#64748b', 6, 0.5);
    svg += svgTickMarks3(P, C, 1, '#64748b', 6, 0.5);

    // 直线 BP 与辅助线 FH
    const bpExt = [ox + 7.5 * sc, oy - 7.5 * 0.75 * sc];
    svg += svgLine3(B, bpExt, '#6366f1', 2.0, '6 4');
    svg += svgLine3(F, Hpt, '#ea580c', 2.4, '6 4');
    svg += svgRightAngle3(F, Hpt, B, 12, '#ea580c');
    svg += svgPt3(Hpt[0], Hpt[1], '#ea580c', 4.5);
    svg += svgTextHalo3(Hpt[0] + 16, Hpt[1] + 4, 'H', { color: '#ea580c' });
    // 8 字相似对应边代数式标注（采用精致防遮挡胶囊气泡）
    const isCase1 = (curCase === 'case1');
    const midFHx = (F[0] + Hpt[0]) / 2;
    svg += `
      <g>
        <rect x="${(midFHx - 52).toFixed(1)}" y="${(F[1] - 25).toFixed(1)}" width="104" height="22" rx="4" fill="#fff7ed" stroke="#fdba74" stroke-width="1.1"/>
        ${svgTextHalo3(midFHx, F[1] - 9, 'FH=4(25-4x)/9', { size: 11, color: '#c2410c', weight: '700' })}
      </g>
    `;

    // BF 边长标注
    svg += `
      <g>
        <rect x="18" y="${(F[1] - 26).toFixed(1)}" width="82" height="22" rx="4" fill="#eff6ff" stroke="#93c5fd" stroke-width="1.1"/>
        ${svgTextHalo3(59, F[1] - 12, 'BF=(25-4x)/3', { size: 11, color: '#1e3a8a', weight: '700' })}
      </g>
    `;

    // BE 边长标注
    const midBEx = (B[0] + E[0]) / 2;
    if (step >= 2) {
      const solText = isCase1 ? 'BE = 50/17' : 'BE = 200/41';
      svg += `
        <g>
          <rect x="${(midBEx - 48).toFixed(1)}" y="${(oy + 8).toFixed(1)}" width="96" height="24" rx="5" fill="#f0fdf4" stroke="#86efac" stroke-width="1.3"/>
          ${svgTextHalo3(midBEx, oy + 24, solText, { size: 12.5, color: '#15803d', weight: '700' })}
        </g>
      `;
    } else {
      svg += svgTextHalo3(midBEx, oy + 20, 'x', { size: 14, color: '#dc2626', weight: '700' });
    }

    // 旋转直角线段 PE, PF, EF 与旋转直角符号
    svg += svgLine3(P, E, '#dc2626', 2.5);
    svg += svgLine3(P, F, '#dc2626', 2.5);
    svg += svgRightAngle3(P, E, F, 13, '#dc2626');
    svg += svgLine3(E, F, '#16a34a', 3.0);

    // 在线段 EF 上标注三等分点刻度与单短杠
    if (isCase1) {
      // 情况一：点 G 在 T1 处
      svg += `<circle cx="${T2[0].toFixed(1)}" cy="${T2[1].toFixed(1)}" r="3.8" fill="#ffffff" stroke="#16a34a" stroke-width="1.8"/>`;
      svg += svgTickMarks3(E, T1, 1, '#16a34a', 6, 0.5);
      svg += svgTickMarks3(T1, T2, 1, '#16a34a', 6, 0.5);
      svg += svgTickMarks3(T2, F, 1, '#16a34a', 6, 0.5);
    } else {
      // 情况二：点 G 在 T2 处
      svg += `<circle cx="${T1[0].toFixed(1)}" cy="${T1[1].toFixed(1)}" r="3.8" fill="#ffffff" stroke="#16a34a" stroke-width="1.8"/>`;
      svg += svgTickMarks3(E, T1, 1, '#16a34a', 6, 0.5);
      svg += svgTickMarks3(T1, T2, 1, '#16a34a', 6, 0.5);
      svg += svgTickMarks3(T2, F, 1, '#16a34a', 6, 0.5);
    }

    // 交点 G
    svg += svgPt3(G[0], G[1], '#16a34a', 6.0);
    svg += svgTextHalo3(G[0] + 18, G[1] + 4, 'G', { color: '#16a34a' });

    // 主顶点标注
    svg += svgPt3(B[0], B[1]); svg += svgTextHalo3(B[0] - 16, B[1] + 16, 'B');
    svg += svgPt3(C[0], C[1]); svg += svgTextHalo3(C[0] + 16, C[1] + 16, 'C');
    svg += svgPt3(A[0], A[1]); svg += svgTextHalo3(A[0] - 16, A[1] - 8, 'A');
    svg += svgPt3(P[0], P[1], '#dc2626', 5); svg += svgTextHalo3(P[0] + 16, P[1] - 8, 'P', { color: '#dc2626' });
    svg += svgPt3(E[0], E[1], '#dc2626', 5.5); svg += svgTextHalo3(E[0], E[1] + 20, 'E', { color: '#dc2626' });
    svg += svgPt3(F[0], F[1], '#dc2626', 5.5); svg += svgTextHalo3(F[0] - 18, F[1] + 4, 'F', { color: '#dc2626' });

    svg += `</svg>`;
    return svg;
  }
});

// -----------------------------------------------------------------------------
// Slide 7: 模型总结·通法全景 (3 步骤)
// -----------------------------------------------------------------------------
window.defineSlide({
  lesson: 1,
  phase: 3,
  navTag: '模型总结·通法全景',
  section: '模型总结',
  title: '模型总结【通法全景】：十字双垂旋转模型演进四步法',
  layout: 'layout-b',
  stem: `
    <div class="screen-stem-banner" style="background:#e0f2fe;border-left:4px solid #0284c7;padding:5px 12px;margin-bottom:6px;border-radius:4px;font-size:0.92rem;color:#0369a1;"><b>【中考压轴几何通法】</b>本题完整展现了从“特殊对称（全等）”到“一般线性（相似）”，再到“坐标代数设元列方程”的四级进阶思维体系！</div>
    <p>请回顾整道试题的思维演进脉络，提炼三大核心解题模型：</p>
  `,
  steps: [
    {
      title: '第一阶：角平分线对称与十字双垂全等（第1、2问）',
      html: '当定点<i class="m">P</i>落在角平分线上时，双垂线<span class="math"><i class="m">PM</i><span class="num">=</span><i class="m">PN</i></span>．旋转角与夹角相等（<span class="math">∠<i class="m">EPF</i><span class="num">=</span>∠<i class="m">MPN</i><span class="num">=</span><i class="m">α</i></span>），利用“同减公共角”得<span class="math">∠<span class="num">1</span><span class="num">=</span>∠<span class="num">2</span></span>，构造全等<span class="math"><span class="num">Rt△</span><i class="m">PME</i><span class="num">≌Rt△</span><i class="m">PNF</i></span>，直接锁定<span class="math" style="white-space:nowrap;"><i class="m">PE</i><span class="num">=</span><i class="m">PF</i></span>．'
    },
    {
      title: '第二阶：脱离角分线与十字双垂相似转化高比（第3问）',
      html: '当定点<i class="m">P</i>不在角平分线上时，双垂线不相等，全等自然演进为相似：<span class="math"><span class="num">Rt△</span><i class="m">PME</i><span class="num">∽Rt△</span><i class="m">PNF</i></span>，得<span class="math" style="white-space:nowrap;"><span class="fraction"><span><i class="m">PF</i></span><span><i class="m">PE</i></span></span><span class="num">=</span><span class="fraction"><span><i class="m">PN</i></span><span><i class="m">PM</i></span></span></span>．连接公共顶点借助“等高三角形面积比等于底边比”，秒转为对角线分点比<span class="math" style="white-space:nowrap;"><span class="fraction"><span><span class="num">4</span></span><span><span class="num">3</span></span></span><i class="m">n</i></span>．'
    },
    {
      title: '第三阶：代数设元表边与外接平行 8 字相似解方程（第4问）',
      html: '动点问题中，以十字相似作为桥梁：设<span class="math"><i class="m">BE</i><span class="num">=</span><i class="m">x</i></span>，将所有动点坐标和线段全用<i class="m">x</i>线性表出．遇分点比例条件，过动点引平行线构造经典的“<span class="num">8</span>字相似”，将分点比与代数式精准挂钩，一元一次方程化简求出双解！'
    }
  ],
  state: { focus: 1 },
  controls(step, state) {
    return modeButtons('focus', String(state.focus || 1), [
      ['1', '① 全等基石', step],
      ['2', '② 相似高比', step],
      ['3', '③ 代数破局', step]
    ]);
  },
  renderScene(step, state) {
    const W = 540, H = 410;
    const f = Number(state.focus || 1);

    let cardTitle = '', cardDesc = '', cColor = '#2563eb', cardBg = '#eff6ff';
    if (f === 1) {
      cardTitle = '① 特殊对称：全等基石';
      cardDesc = '正方形 / 菱形（角平分线上的点）<br>• 垂线段相等: PM = PN<br>• 旋转导角: ∠1 = ∠2<br>• 核心模型: Rt△PME ≌ Rt△PNF<br>• 结论: 旋转线段恒等 PE = PF';
      cColor = '#2563eb'; cardBg = '#eff6ff';
    } else if (f === 2) {
      cardTitle = '② 一般位置：相似高比';
      cardDesc = '平行四边形（直线上的任意定点）<br>• 垂线段不等: PM ≠ PN<br>• 核心模型: Rt△PME ∽ Rt△PNF<br>• 比例转化: PF/PE = PN/PM<br>• 连顶点借助等高面积比: 转对角线比';
      cColor = '#059669'; cardBg = '#ecfdf5';
    } else {
      cardTitle = '③ 代数破局：8字方程';
      cardDesc = '任意直角三角形（动点轨迹与方程）<br>• 设元: BE = x<br>• 十字相似表边: BF = (25-4x)/3<br>• 辅助线: 作平行线 FH ∥ BC 造 8 字相似<br>• 分类讨论: 三等分点两种情况解方程';
      cColor = '#dc2626'; cardBg = '#fef2f2';
    }

    let svg = `<svg viewBox="0 0 ${W} ${H}" style="width:100%;height:100%;display:block;">`;
    svg += window.svgFoCard(30, 16, 480, 142, `<div style="padding:14px 18px;background:${cardBg};border-radius:10px;height:100%;box-sizing:border-box;"><div style="font-size:17px;font-weight:700;color:${cColor};margin-bottom:6px;">${cardTitle}</div><div style="font-size:13.5px;color:#334155;line-height:22px;">${cardDesc}</div></div>`, `border-color:${cColor};`);

    // 下方对比流程图（使用绝对坐标展开，兼容无 transform 偏移审计）
    svg += `
      <rect x="30" y="225" width="140" height="150" rx="8" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
      <text x="100" y="257" font-size="15" font-weight="700" fill="#1e293b" text-anchor="middle">正方形/菱形</text>
      <text x="100" y="290" font-size="13" fill="#64748b" text-anchor="middle">角分线定点</text>
      <text x="100" y="320" font-size="13" fill="#2563eb" font-weight="700" text-anchor="middle">十字双垂全等</text>
      <text x="100" y="350" font-size="13" fill="#0f172a" text-anchor="middle">PE = PF</text>

      <path d="M 175 300 L 195 300" stroke="#94a3b8" stroke-width="2" marker-end="url(#arr)"/>

      <rect x="200" y="225" width="140" height="150" rx="8" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
      <text x="270" y="257" font-size="15" font-weight="700" fill="#1e293b" text-anchor="middle">平行四边形</text>
      <text x="270" y="290" font-size="13" fill="#64748b" text-anchor="middle">对角线任意点</text>
      <text x="270" y="320" font-size="13" fill="#059669" font-weight="700" text-anchor="middle">双垂相似转高比</text>
      <text x="270" y="350" font-size="13" fill="#0f172a" text-anchor="middle">PF/PE = (4/3)n</text>

      <path d="M 345 300 L 365 300" stroke="#94a3b8" stroke-width="2" marker-end="url(#arr)"/>

      <rect x="370" y="225" width="140" height="150" rx="8" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
      <text x="440" y="257" font-size="15" font-weight="700" fill="#1e293b" text-anchor="middle">直角三角形</text>
      <text x="440" y="290" font-size="13" fill="#64748b" text-anchor="middle">斜边三等分点</text>
      <text x="440" y="320" font-size="13" fill="#dc2626" font-weight="700" text-anchor="middle">十字相似+8字</text>
      <text x="440" y="350" font-size="13" fill="#0f172a" text-anchor="middle">方程双解</text>
    `;

    svg += `<defs><marker id="arr" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 1 L 10 5 L 0 9 z" fill="#94a3b8"/></marker></defs>`;
    svg += `</svg>`;
    return svg;
  }
});

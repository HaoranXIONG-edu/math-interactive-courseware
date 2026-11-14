window.UNIT1_THEOREM_SLIDES = window.UNIT1_THEOREM_SLIDES || [];
window.UNIT1_SIMS = window.UNIT1_SIMS || {};
window.COURSEWARE_BRAND = '反比例函数';
window.COURSEWARE_TITLE = '2.2.3 “k”的几何意义';
window.COURSEWARE_PHASES = [
  ['① 情境引入', '核心面积激活'],
  ['② 新知探究', '问题1—4模型探究'],
  ['③ 新知应用', '第1—5题典例精析'],
  ['④ 分层训练', '训练1—3与课堂小结']
];

// ================= SVG 辅助绘制函数（标准二维分式、白描边防压线、坐标轴） =================
function svgFrac1(x, y, num, den, color = '#1e293b', size = 14) {
  const w = Math.max(String(num).length, String(den).length) * (size * 0.62) + 10;
  const numHtml = typeof window.svgAutoFormatText === 'function' ? window.svgAutoFormatText(num, size) : num;
  const denHtml = typeof window.svgAutoFormatText === 'function' ? window.svgAutoFormatText(den, size) : den;
  return `<g font-family="'Times New Roman', serif" font-weight="700" font-size="${size}" fill="${color}" text-anchor="middle">
    <text x="${x}" y="${y - 6}" stroke="#ffffff" stroke-width="3.5" paint-order="stroke">${numHtml}</text>
    <line x1="${x - w / 2}" y1="${y - 1}" x2="${x + w / 2}" y2="${y - 1}" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round"/>
    <line x1="${x - w / 2}" y1="${y - 1}" x2="${x + w / 2}" y2="${y - 1}" stroke="${color}" stroke-width="1.6" stroke-linecap="round"/>
    <text x="${x}" y="${y + size}" stroke="#ffffff" stroke-width="3.5" paint-order="stroke">${denHtml}</text>
  </g>`;
}

function svgTextHalo1(x, y, txt, opts = {}) {
  const { size = 15, color = '#0f172a', anchor = 'middle', weight = '700' } = opts;
  const inner = typeof window.svgAutoFormatText === 'function' ? window.svgAutoFormatText(txt, size) : txt;
  return `<text x="${x}" y="${y}" font-family="'Times New Roman', 'Songti SC', 'SimSun', serif" font-style="normal" font-weight="${weight}" font-size="${size}" fill="${color}" text-anchor="${anchor}" stroke="#ffffff" stroke-width="3.5" paint-order="stroke">${inner}</text>`;
}

function svgAxes1(ox, oy, xMin, xMax, yMin, yMax) {
  return `<g stroke="#334155" stroke-width="1.8">
    <defs>
      <marker id="arr1" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
        <path d="M0,1 L7,4 L0,7 Z" fill="#334155"/>
      </marker>
    </defs>
    <line x1="${xMin}" y1="${oy}" x2="${xMax}" y2="${oy}" marker-end="url(#arr1)"/>
    <line x1="${ox}" y1="${yMax}" x2="${ox}" y2="${yMin}" marker-end="url(#arr1)"/>
    ${svgTextHalo1(xMax - 6, oy + 20, 'x', { size: 16 })}
    ${svgTextHalo1(ox - 16, yMin + 12, 'y', { size: 16 })}
    ${svgTextHalo1(ox - 12, oy + 18, 'O', { size: 15 })}
  </g>`;
}

function sampleHyperbola1(k, xStart, xEnd, ox, oy, scale, steps = 60) {
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const x = xStart + (xEnd - xStart) * (i / steps);
    const y = k / x;
    pts.push(`${(ox + x * scale).toFixed(1)},${(oy - y * scale).toFixed(1)}`);
  }
  return pts.join(' ');
}

// ================= Slide 0: 封面与学习目标导览页 =================
window.UNIT1_THEOREM_SLIDES.push({
  id: 'cover',
  type: 'cover',
  cover: true,
  lesson: 1,
  phase: 0,
  navTag: '课题导览',
  section: '情境引入',
  title: '<span class="num">2.2.3</span> 反比例函数中“<i class="m">k</i>”的几何意义',
  sim: null,
  html: window.renderStandardCover({
    chapter: '北师大版九年级数学上册 · 第二章 反比例函数',
    num: '2.2.3',
    title: '反比例函数中“<i class="m">k</i>”的几何意义',
    caption: '第二章 反比例函数 · 专题教学课件',
    goals: [
      '理解并掌握反比例函数中<span class="num">|</span><i class="m">k</i><span class="num">|</span>的几何意义及常见基本图形的面积规律；（<b class="goal-focus">重点</b>）',
      '能灵活运用等积变形、割补转化思想解决反比例函数中的面积计算问题．（<b class="goal-hard">难点</b>）'
    ]
  })
});

// ================= Slide 1: 情境引入 =================
window.UNIT1_THEOREM_SLIDES.push({
  lesson: 1,
  phase: 0,
  navTag: "情境引入",
  section: "情境引入",
  title: "回顾与激活：矩形与基础直角三角形的面积",
  cover: false,
  sim: "introSim",
  html: `
    <div class="screen-page lab-visible">
      <div class="screen-stem">
        <p><span class="num">1．</span>在上节课的探究过程中，我们发现对于反比例函数<span class="math"><i class="m">y</i><span class="num">=</span><span class="fraction"><span><i class="m">k</i></span><span><i class="m">x</i></span></span></span>，点<i class="m">Q</i>是其图象上的任意一点，作<i class="m">QA</i><span class="num">⊥</span><i class="m">y</i>轴于点<i class="m">A</i>，作<i class="m">QB</i><span class="num">⊥</span><i class="m">x</i>轴于点<i class="m">B</i>，矩形<i class="m">AOBQ</i>的面积与<i class="m">k</i>的关系是<i class="m">S</i><sub>矩形<i class="m">AOBQ</i></sub><span class="num">=</span><span class="screen-blank" data-step="2" data-ans="<span class='num'>|</span><i class='m'>k</i><span class='num'>|</span>"></span>；连接<i class="m">OQ</i>，则<i class="m">S</i><sub><span class="num">△</span><i class="m">AOQ</i></sub><span class="num">=</span><i class="m">S</i><sub><span class="num">△</span><i class="m">BOQ</i></sub><span class="num">=</span><span class="screen-blank" data-step="3" data-ans="<span class='fraction'><span><span class='num'>1</span></span><span><span class='num'>2</span></span></span><span class='num'>|</span><i class='m'>k</i><span class='num'>|</span>"></span>．那反比例函数中“<i class="m">k</i>”还有哪些几何意义呢？</p>
      </div>
      <div class="screen-lower layout-b">
        <div class="screen-notes">
          <div id="controls" class="controls"></div>
          <div class="step step-locked"><b>01</b><span><b>步骤<span class="num">1</span>（设点表边）：</b>设点<i class="m">Q</i><span class="num">(</span><i class="m">x</i><sub><span class="num">0</span></sub><span class="num">,</span><i class="m">y</i><sub><span class="num">0</span></sub><span class="num">)</span>在<span class="math"><i class="m">y</i><span class="num">=</span><span class="fraction"><span><i class="m">k</i></span><span><i class="m">x</i></span></span></span>图象上，则<i class="m">x</i><sub><span class="num">0</span></sub><i class="m">y</i><sub><span class="num">0</span></sub><span class="num">=</span><i class="m">k</i>，且<i class="m">OA</i><span class="num">=|</span><i class="m">y</i><sub><span class="num">0</span></sub><span class="num">|</span>，<i class="m">OB</i><span class="num">=|</span><i class="m">x</i><sub><span class="num">0</span></sub><span class="num">|</span>．</span></div>
          <div class="step step-locked"><b>02</b><span><b>步骤<span class="num">2</span>（矩形面积）：</b><i class="m">S</i><sub>矩形<i class="m">AOBQ</i></sub><span class="num">=</span><i class="m">OB</i><span class="num">·</span><i class="m">OA</i><span class="num">=|</span><i class="m">x</i><sub><span class="num">0</span></sub><span class="num">|·|</span><i class="m">y</i><sub><span class="num">0</span></sub><span class="num">|=|</span><i class="m">x</i><sub><span class="num">0</span></sub><i class="m">y</i><sub><span class="num">0</span></sub><span class="num">|=|</span><i class="m">k</i><span class="num">|</span>．</span></div>
          <div class="step step-locked"><b>03</b><span><b>步骤<span class="num">3</span>（对角线平分）：</b>对角线<i class="m">OQ</i>将矩形平分为两个全等的直角三角形，故<i class="m">S</i><sub><span class="num">△</span><i class="m">AOQ</i></sub><span class="num">=</span><i class="m">S</i><sub><span class="num">△</span><i class="m">BOQ</i></sub><span class="num">=</span><span class="math"><span class="fraction"><span><span class="num">1</span></span><span><span class="num">2</span></span></span></span><span class="num">|</span><i class="m">k</i><span class="num">|</span>（面积只与<span class="num">|</span><i class="m">k</i><span class="num">|</span>有关，与点<i class="m">Q</i>位置无关）．</span></div>
        </div>
        <div class="screen-media">
          <div class="screen-lab">
            <div id="scene" class="visual" style="padding:10px;align-items:stretch;justify-content:center;"></div>
          </div>
        </div>
      </div>
    </div>
  `
});

// ================= Slide 2: 问题1 单曲线动点拉窗帘 =================
window.UNIT1_THEOREM_SLIDES.push({
  lesson: 1,
  phase: 1,
  navTag: "问题1·动点同底等高",
  section: "新知探究",
  title: "问题<span class='num'>1</span>：一点两垂线与坐标轴动点“拉窗帘”（同底等高）模型",
  cover: false,
  sim: "explore1Sim",
  html: `
    <div class="screen-page lab-visible">
      <div class="screen-stem">
        <p><b>问题<span class="num">1</span>：</b>如图，点<i class="m">A</i>是反比例函数<span class="math"><i class="m">y</i><span class="num">=</span><span class="fraction"><span><i class="m">k</i></span><span><i class="m">x</i></span></span></span>图象上任意一点，作<i class="m">AB</i><span class="num">⊥</span><i class="m">x</i>轴于点<i class="m">B</i>，作<i class="m">AC</i><span class="num">⊥</span><i class="m">y</i>轴于点<i class="m">C</i>，连接<i class="m">OA</i>，则<i class="m">S</i><sub><span class="num">△</span><i class="m">AOB</i></sub><span class="num">=</span><i class="m">S</i><sub><span class="num">△</span><i class="m">AOC</i></sub><span class="num">=</span><span class="screen-blank" data-step="1" data-ans="<span class='fraction'><span><span class='num'>1</span></span><span><span class='num'>2</span></span></span><span class='num'>|</span><i class='m'>k</i><span class='num'>|</span>"></span>．（<span class="num">1</span>）如图(<span class="num">1</span>)、(<span class="num">2</span>)，点<i class="m">D</i>为<i class="m">y</i>轴动点，则<i class="m">S</i><sub><span class="num">△</span><i class="m">ABD</i></sub><span class="num">=</span><span class="screen-blank" data-step="2" data-ans="不变（恒为<span class='fraction'><span><span class='num'>1</span></span><span><span class='num'>2</span></span></span><span class='num'>|</span><i class='m'>k</i><span class='num'>|</span>）"></span>；（<span class="num">2</span>）如图(<span class="num">3</span>)，点<i class="m">E</i>为<i class="m">x</i>轴动点，则<i class="m">S</i><sub><span class="num">△</span><i class="m">ACE</i></sub><span class="num">=</span><span class="screen-blank" data-step="3" data-ans="不变（恒为<span class='fraction'><span><span class='num'>1</span></span><span><span class='num'>2</span></span></span><span class='num'>|</span><i class='m'>k</i><span class='num'>|</span>）"></span>．</p>
      </div>
      <div class="screen-lower layout-b">
        <div class="screen-notes">
          <div id="controls" class="controls"></div>
          <div class="step step-locked"><b>01</b><span><b>步骤<span class="num">1</span>（一点两垂线基准）：</b>过点<i class="m">A</i>作<i class="m">AB</i><span class="num">⊥</span><i class="m">x</i>轴、<i class="m">AC</i><span class="num">⊥</span><i class="m">y</i>轴，当第三个顶点在原点<i class="m">O</i>时，<i class="m">S</i><sub><span class="num">△</span><i class="m">AOB</i></sub><span class="num">=</span><i class="m">S</i><sub><span class="num">△</span><i class="m">AOC</i></sub><span class="num">=</span><span class="math"><span class="fraction"><span><span class="num">1</span></span><span><span class="num">2</span></span></span></span><span class="num">|</span><i class="m">k</i><span class="num">|</span>．</span></div>
          <div class="step step-locked"><b>02</b><span><b>步骤<span class="num">2</span>（图(1)(2)·<i class="m">y</i>轴动点<i class="m">D</i>）：</b>因为<i class="m">AB</i><span class="num">∥</span><i class="m">y</i>轴，点<i class="m">D</i>在<i class="m">y</i>轴上任意移动时，<span class="num">△</span><i class="m">ABD</i>与<span class="num">△</span><i class="m">AOB</i>同底（底为<i class="m">AB</i>）、等高（高为<i class="m">OB</i>），故<i class="m">S</i><sub><span class="num">△</span><i class="m">ABD</i></sub><span class="num">=</span><i class="m">S</i><sub><span class="num">△</span><i class="m">AOB</i></sub><span class="num">=</span><span class="math"><span class="fraction"><span><span class="num">1</span></span><span><span class="num">2</span></span></span></span><span class="num">|</span><i class="m">k</i><span class="num">|</span>保持不变．</span></div>
          <div class="step step-locked"><b>03</b><span><b>步骤<span class="num">3</span>（图(3)·<i class="m">x</i>轴动点<i class="m">E</i>与规律总结）：</b>因为<i class="m">AC</i><span class="num">∥</span><i class="m">x</i>轴，点<i class="m">E</i>在<i class="m">x</i>轴上移动时，<span class="num">△</span><i class="m">ACE</i>与<span class="num">△</span><i class="m">AOC</i>同底（底为<i class="m">AC</i>）、等高（高为<i class="m">OC</i>），故<i class="m">S</i><sub><span class="num">△</span><i class="m">ACE</i></sub><span class="num">=</span><i class="m">S</i><sub><span class="num">△</span><i class="m">AOC</i></sub><span class="num">=</span><span class="math"><span class="fraction"><span><span class="num">1</span></span><span><span class="num">2</span></span></span></span><span class="num">|</span><i class="m">k</i><span class="num">|</span>不变！</span></div>
        </div>
        <div class="screen-media">
          <div class="screen-lab">
            <div id="scene" class="visual" style="padding:10px;align-items:stretch;justify-content:center;"></div>
          </div>
        </div>
      </div>
    </div>
  `
});

// ================= Slide 3: 问题2 异支对称两点·中心对称图形面积 =================
window.UNIT1_THEOREM_SLIDES.push({
  lesson: 1,
  phase: 1,
  navTag: "问题2·中心对称面积",
  section: "新知探究",
  title: "问题<span class='num'>2</span>：单曲线异支对称两点（过原点直线交双曲线）",
  cover: false,
  sim: "explore4Sim",
  html: `
    <div class="screen-page lab-visible">
      <div class="screen-stem">
        <p><b>问题<span class="num">2</span>：</b>如图，过原点<i class="m">O</i>的直线与反比例函数<span class="math"><i class="m">y</i><span class="num">=</span><span class="fraction"><span><i class="m">k</i></span><span><i class="m">x</i></span></span></span>的图象交于两点，观察下列四个图形（图(<span class="num">3</span>)中<i class="m">OC</i><span class="num">=</span><i class="m">OD</i>，图(<span class="num">4</span>)中<i class="m">OE</i><span class="num">=</span><i class="m">OF</i>），则：<b>图(<span class="num">1</span>)、(<span class="num">2</span>)</b>中<i class="m">S</i><sub><span class="num">△</span><i class="m">ABC</i></sub><span class="num">=</span><span class="screen-blank" data-step="2" data-ans="<span class='num'>|</span><i class='m'>k</i><span class='num'>|</span>"></span>；<b>图(<span class="num">3</span>)、(<span class="num">4</span>)</b>中<i class="m">S</i><sub>四边形<i class="m">ABCD</i></sub><span class="num">=</span><span class="screen-blank" data-step="3" data-ans="<span class='num'>2|</span><i class='m'>k</i><span class='num'>|</span>"></span>．</p>
      </div>
      <div class="screen-lower layout-b">
        <div class="screen-notes">
          <div id="controls" class="controls"></div>
          <div class="step step-locked"><b>01</b><span><b>步骤<span class="num">1</span>（中心对称得中点）：</b>反比例函数图象关于原点<i class="m">O</i>成中心对称，过原点的直线与双曲线的两个交点关于原点对称，故<i class="m">OA</i><span class="num">=</span><i class="m">OC</i>（或<i class="m">OA</i><span class="num">=</span><i class="m">OB</i>）．</span></div>
          <div class="step step-locked"><b>02</b><span><b>步骤<span class="num">2</span>（图(1)(2)·中线倍增）：</b>在图(<span class="num">1</span>)、(<span class="num">2</span>)中，<i class="m">OB</i>是<span class="num">△</span><i class="m">ABC</i>的中线，等底同高得<i class="m">S</i><sub><span class="num">△</span><i class="m">ABC</i></sub><span class="num">=2</span><i class="m">S</i><sub><span class="num">△</span><i class="m">AOB</i></sub><span class="num">=2×</span><span class="math"><span class="fraction"><span><span class="num">1</span></span><span><span class="num">2</span></span></span></span><span class="num">|</span><i class="m">k</i><span class="num">|=|</span><i class="m">k</i><span class="num">|</span>．</span></div>
          <div class="step step-locked"><b>03</b><span><b>步骤<span class="num">3</span>（图(3)(4)·四块拼合）：</b>在图(<span class="num">3</span>)、(<span class="num">4</span>)中，两条对角线在原点互相平分，将平行四边形分为<span class="num">4</span>个面积均为<span class="math"><span class="fraction"><span><span class="num">1</span></span><span><span class="num">2</span></span></span></span><span class="num">|</span><i class="m">k</i><span class="num">|</span>的三角形，故<i class="m">S</i><sub>四边形<i class="m">ABCD</i></sub><span class="num">=4×</span><span class="math"><span class="fraction"><span><span class="num">1</span></span><span><span class="num">2</span></span></span></span><span class="num">|</span><i class="m">k</i><span class="num">|=2|</span><i class="m">k</i><span class="num">|</span>．</span></div>
        </div>
        <div class="screen-media">
          <div class="screen-lab">
            <div id="scene" class="visual" style="padding:10px;align-items:stretch;justify-content:center;"></div>
          </div>
        </div>
      </div>
    </div>
  `
});

// ================= Slide 4: 问题3(1) 单曲线同支双点转化 =================
window.UNIT1_THEOREM_SLIDES.push({
  lesson: 1,
  phase: 1,
  navTag: "问题3(1)·同支蝴蝶等积",
  section: "新知探究",
  title: "问题<span class='num'>3</span>（<span class='num'>1</span>）：单曲线同支两点“蝴蝶等积”与转梯形模型",
  cover: false,
  sim: "explore2Sim",
  html: `
    <div class="screen-page lab-visible">
      <div class="screen-stem">
        <p><b>问题<span class="num">3</span>（<span class="num">1</span>）：</b>如图，点<i class="m">A</i>，<i class="m">C</i>是反比例函数<span class="math"><i class="m">y</i><span class="num">=</span><span class="fraction"><span><i class="m">k</i></span><span><i class="m">x</i></span></span></span>图象上同支任意两点，作<i class="m">AB</i><span class="num">⊥</span><i class="m">x</i>轴于点<i class="m">B</i>，作<i class="m">CD</i><span class="num">⊥</span><i class="m">x</i>轴于点<i class="m">D</i>，连接<i class="m">OC</i>交<i class="m">AB</i>于点<i class="m">E</i>，则<i class="m">S</i><sub><span class="num">△</span><i class="m">AOE</i></sub>与<i class="m">S</i><sub>四边形<i class="m">BECD</i></sub>的数量关系是<span class="screen-blank" data-step="2" data-ans="<i class='m'>S</i><sub><span class='num'>△</span><i class='m'>AOE</i></sub><span class='num'>=</span><i class='m'>S</i><sub>四边形<i class='m'>BECD</i></sub>"></span>；连接<i class="m">AC</i>，则<i class="m">S</i><sub><span class="num">△</span><i class="m">AOC</i></sub><span class="num">=</span><span class="screen-blank" data-step="3" data-ans="<i class='m'>S</i><sub>直角梯形<i class='m'>ABDC</i></sub>"></span>．</p>
      </div>
      <div class="screen-lower layout-b">
        <div class="screen-notes">
          <div id="controls" class="controls"></div>
          <div class="step step-locked"><b>01</b><span><b>步骤<span class="num">1</span>（双点基准）：</b>点<i class="m">A</i>，<i class="m">C</i>均在<span class="math"><i class="m">y</i><span class="num">=</span><span class="fraction"><span><i class="m">k</i></span><span><i class="m">x</i></span></span></span>图象上，故<i class="m">S</i><sub><span class="num">△</span><i class="m">AOB</i></sub><span class="num">=</span><i class="m">S</i><sub><span class="num">△</span><i class="m">COD</i></sub><span class="num">=</span><span class="math"><span class="fraction"><span><span class="num">1</span></span><span><span class="num">2</span></span></span></span><span class="num">|</span><i class="m">k</i><span class="num">|</span>．</span></div>
          <div class="step step-locked"><b>02</b><span><b>步骤<span class="num">2</span>（同减公共块）：</b>两三角形重叠于公共部分<span class="num">△</span><i class="m">BOE</i>，同减<i class="m">S</i><sub><span class="num">△</span><i class="m">BOE</i></sub>得<i class="m">S</i><sub><span class="num">△</span><i class="m">AOB</i></sub><span class="num">-</span><i class="m">S</i><sub><span class="num">△</span><i class="m">BOE</i></sub><span class="num">=</span><i class="m">S</i><sub><span class="num">△</span><i class="m">COD</i></sub><span class="num">-</span><i class="m">S</i><sub><span class="num">△</span><i class="m">BOE</i></sub>，即<i class="m">S</i><sub><span class="num">△</span><i class="m">AOE</i></sub><span class="num">=</span><i class="m">S</i><sub>四边形<i class="m">BECD</i></sub>．</span></div>
          <div class="step step-locked"><b>03</b><span><b>步骤<span class="num">3</span>（同加<span class="num">△</span><i class="m">ACE</i>转直角梯形）：</b>连接<i class="m">AC</i>，两边同加<i class="m">S</i><sub><span class="num">△</span><i class="m">ACE</i></sub>，可得<i class="m">S</i><sub><span class="num">△</span><i class="m">AOC</i></sub><span class="num">=</span><i class="m">S</i><sub>直角梯形<i class="m">ABDC</i></sub><span class="num">=</span><span class="math"><span class="fraction"><span><span class="num">1</span></span><span><span class="num">2</span></span></span></span><span class="num">(</span><i class="m">AB</i><span class="num">+</span><i class="m">CD</i><span class="num">)·</span><i class="m">BD</i>！</span></div>
        </div>
        <div class="screen-media">
          <div class="screen-lab">
            <div id="scene" class="visual" style="padding:10px;align-items:stretch;justify-content:center;"></div>
          </div>
        </div>
      </div>
    </div>
  `
});

// ================= Slide 5: 问题3(2) 交点三角形面积 =================
window.UNIT1_THEOREM_SLIDES.push({
  lesson: 1,
  phase: 1,
  navTag: "问题3(2)·交点△AOB面积",
  section: "新知探究",
  title: "问题<span class='num'>3</span>（<span class='num'>2</span>）：迁移突破——反比例与一次函数交点<span class='num'>△</span><i class='m'>AOB</i>面积",
  cover: false,
  sim: "explore5Sim",
  html: `
    <div class="screen-page lab-visible">
      <div class="screen-stem">
        <p><b>问题<span class="num">3</span>（<span class="num">2</span>）：</b>如图，若反比例函数与一次函数的图象交于<i class="m">A</i>，<i class="m">B</i>两点，直线<i class="m">AB</i>与坐标轴分别交于<i class="m">C</i>，<i class="m">D</i>两点，怎么求<i class="m">S</i><sub><span class="num">△</span><i class="m">AOB</i></sub>？<b>方法一（分割法）</b><i class="m">S</i><sub><span class="num">△</span><i class="m">AOB</i></sub><span class="num">=</span><span class="screen-blank" data-step="1" data-ans="<i class='m'>S</i><sub><span class='num'>△</span><i class='m'>COD</i></sub><span class='num'>-</span><i class='m'>S</i><sub><span class='num'>△</span><i class='m'>AOC</i></sub><span class='num'>-</span><i class='m'>S</i><sub><span class='num'>△</span><i class='m'>BOD</i></sub>"></span>；<b>方法二（由(1)转直角梯形）</b><i class="m">S</i><sub><span class="num">△</span><i class="m">AOB</i></sub><span class="num">=</span><span class="screen-blank" data-step="2" data-ans="<i class='m'>S</i><sub>直角梯形<i class='m'>AEFB</i></sub>"></span>．</p>
      </div>
      <div class="screen-lower layout-b">
        <div class="screen-notes">
          <div id="controls" class="controls"></div>
          <div class="step step-locked"><b>01</b><span><b>步骤<span class="num">1</span>（方法一·大减小分割）：</b>利用直线与坐标轴交点<i class="m">C</i>，<i class="m">D</i>，用大<span class="num">Rt△</span><i class="m">COD</i>减去两侧空白三角形：<i class="m">S</i><sub><span class="num">△</span><i class="m">AOB</i></sub><span class="num">=</span><i class="m">S</i><sub><span class="num">△</span><i class="m">COD</i></sub><span class="num">-</span><i class="m">S</i><sub><span class="num">△</span><i class="m">AOC</i></sub><span class="num">-</span><i class="m">S</i><sub><span class="num">△</span><i class="m">BOD</i></sub>．</span></div>
          <div class="step step-locked"><b>02</b><span><b>步骤<span class="num">2</span>（方法二·<i class="m">k</i>的几何意义转梯形 ★核心）：</b>作<i class="m">AE</i><span class="num">⊥</span><i class="m">x</i>轴于<i class="m">E</i>（交<i class="m">OB</i>于<i class="m">M</i>）、<i class="m">BF</i><span class="num">⊥</span><i class="m">x</i>轴于<i class="m">F</i>．由（<span class="num">1</span>）知<i class="m">S</i><sub><span class="num">△</span><i class="m">OAM</i></sub><span class="num">=</span><i class="m">S</i><sub>四边形<i class="m">MEFB</i></sub>，故<i class="m">S</i><sub><span class="num">△</span><i class="m">AOB</i></sub><span class="num">=</span><i class="m">S</i><sub>直角梯形<i class="m">AEFB</i></sub><span class="num">=</span><span class="math"><span class="fraction"><span><span class="num">1</span></span><span><span class="num">2</span></span></span></span><span class="num">(</span><i class="m">AE</i><span class="num">+</span><i class="m">BF</i><span class="num">)·</span><i class="m">EF</i>！</span></div>
          <div class="step step-locked"><b>03</b><span><b>步骤<span class="num">3</span>（方法三·矩形补形）：</b>如方法三图，过<i class="m">A</i>作<i class="m">AC</i><span class="num">⊥</span><i class="m">y</i>轴于<i class="m">C</i>、过<i class="m">B</i>作<i class="m">BF</i><span class="num">⊥</span><i class="m">x</i>轴于<i class="m">F</i>，两垂线延长交于<i class="m">D</i>补成矩形<i class="m">COFD</i>，则<i class="m">S</i><sub><span class="num">△</span><i class="m">AOB</i></sub><span class="num">=</span><i class="m">S</i><sub>矩形<i class="m">COFD</i></sub><span class="num">-|</span><i class="m">k</i><span class="num">|-</span><i class="m">S</i><sub><span class="num">△</span><i class="m">ABD</i></sub>．</span></div>
        </div>
        <div class="screen-media">
          <div class="screen-lab">
            <div id="scene" class="visual" style="padding:10px;align-items:stretch;justify-content:center;"></div>
          </div>
        </div>
      </div>
    </div>
  `
});

// ================= Slide 6: 问题4 双反比例函数 =================
window.UNIT1_THEOREM_SLIDES.push({
  lesson: 1,
  phase: 1,
  navTag: "问题4·双函数模型",
  section: "新知探究",
  title: "问题<span class='num'>4</span>：双反比例函数中的面积规律与比例拓展",
  cover: false,
  sim: "explore3Sim",
  html: `
    <div class="screen-page lab-visible">
      <div class="screen-stem">
        <p style="font-size:26px!important;line-height:1.38!important;"><b>问题<span class="num">4</span>：</b>双反比例函数<span class="math"><i class="m">y</i><span class="num">=</span><span class="fraction"><span><i class="m">k</i><sub><span class="num">1</span></sub></span><span><i class="m">x</i></span></span></span>与<span class="math"><i class="m">y</i><span class="num">=</span><span class="fraction"><span><i class="m">k</i><sub><span class="num">2</span></sub></span><span><i class="m">x</i></span></span></span>：（<span class="num">1</span>）图(<span class="num">1</span>)<i class="m">S</i><span class="num">=</span><span class="screen-blank" data-step="1" data-ans="<span class='num'>|</span><i class='m'>k</i><sub><span class='num'>1</span></sub><span class='num'>|-|</span><i class='m'>k</i><sub><span class='num'>2</span></sub><span class='num'>|</span>"></span>，图(<span class="num">2</span>)<i class="m">S</i><span class="num">=</span><span class="screen-blank" data-step="2" data-ans="<span class='fraction'><span><span class='num'>1</span></span><span><span class='num'>2</span></span></span><span class='num'>(|</span><i class='m'>k</i><sub><span class='num'>1</span></sub><span class='num'>|-|</span><i class='m'>k</i><sub><span class='num'>2</span></sub><span class='num'>|)</span>"></span>，图(<span class="num">3</span>)<i class="m">S</i><span class="num">=</span><span class="screen-blank" data-step="3" data-ans="<span class='num'>|</span><i class='m'>k</i><sub><span class='num'>1</span></sub><span class='num'>|+|</span><i class='m'>k</i><sub><span class='num'>2</span></sub><span class='num'>|</span>"></span>，图(<span class="num">4</span>)<i class="m">S</i><span class="num">=</span><span class="screen-blank" data-step="4" data-ans="<span class='fraction'><span><span class='num'>1</span></span><span><span class='num'>2</span></span></span><span class='num'>(|</span><i class='m'>k</i><sub><span class='num'>1</span></sub><span class='num'>|+|</span><i class='m'>k</i><sub><span class='num'>2</span></sub><span class='num'>|)</span>"></span>；（<span class="num">2</span>）①图(<span class="num">1</span>)<span class="math"><span class="fraction"><span><i class="m">CF</i></span><span><i class="m">CB</i></span></span></span><span class="num">=</span><span class="screen-blank" data-step="5" data-ans="<span class='fraction'><span><i class='m'>k</i><sub><span class='num'>2</span></sub></span><span><i class='m'>k</i><sub><span class='num'>1</span></sub></span></span>"></span>，图(<span class="num">3</span>)<span class="math"><span class="fraction"><span><i class="m">AE</i></span><span><i class="m">BE</i></span></span></span><span class="num">=</span><span class="screen-blank" data-step="6" data-ans="<span class='fraction'><span><span class='num'>|</span><i class='m'>k</i><sub><span class='num'>1</span></sub><span class='num'>|</span></span><span><span class='num'>|</span><i class='m'>k</i><sub><span class='num'>2</span></sub><span class='num'>|</span></span></span>"></span>；②图(<span class="num">5</span>)<i class="m">S</i><sub><span class="num">△</span><i class="m">BDF</i></sub><span class="num">=</span><span class="screen-blank" data-step="7" data-ans="<span class='fraction'><span><span class='num'>(</span><i class='m'>k</i><sub><span class='num'>1</span></sub><span class='num'>-</span><i class='m'>k</i><sub><span class='num'>2</span></sub><span class='num'>)</span><sup><span class='num'>2</span></sup></span><span><span class='num'>2</span><i class='m'>k</i><sub><span class='num'>1</span></sub></span></span>"></span>，<i class="m">S</i><sub><span class="num">△</span><i class="m">ODF</i></sub><span class="num">=</span><span class="screen-blank" data-step="8" data-ans="<span class='fraction'><span><i class='m'>k</i><sub><span class='num'>1</span></sub><sup><span class='num'>2</span></sup><span class='num'>-</span><i class='m'>k</i><sub><span class='num'>2</span></sub><sup><span class='num'>2</span></sup></span><span><span class='num'>2</span><i class='m'>k</i><sub><span class='num'>1</span></sub></span></span>"></span>．</p>
      </div>
      <div class="screen-lower layout-b">
        <div class="screen-notes">
          <div id="controls" class="controls"></div>
          <div class="step step-locked"><b>01</b><span><b>步骤<span class="num">1</span>（(1)图(1)·同号矩形面积）：</b>外层大矩形减内层空白矩形：<i class="m">S</i><sub>矩形<i class="m">DFBA</i></sub><span class="num">=</span><i class="m">S</i><sub>矩形<i class="m">OABC</i></sub><span class="num">-</span><i class="m">S</i><sub>矩形<i class="m">OCFD</i></sub><span class="num">=|</span><i class="m">k</i><sub><span class="num">1</span></sub><span class="num">|-|</span><i class="m">k</i><sub><span class="num">2</span></sub><span class="num">|</span>．</span></div>
          <div class="step step-locked"><b>02</b><span><b>步骤<span class="num">2</span>（(1)图(2)·同号三角形面积）：</b><span class="num">△</span><i class="m">OBD</i>与图(<span class="num">1</span>)阴影矩形同底<i class="m">BD</i>、等高<i class="m">OA</i>，故<i class="m">S</i><sub><span class="num">△</span><i class="m">OBD</i></sub><span class="num">=</span><span class="math"><span class="fraction"><span><span class="num">1</span></span><span><span class="num">2</span></span></span></span><span class="num">(|</span><i class="m">k</i><sub><span class="num">1</span></sub><span class="num">|-|</span><i class="m">k</i><sub><span class="num">2</span></sub><span class="num">|)</span>（顶点在<i class="m">y</i>轴移动时面积不变）．</span></div>
          <div class="step step-locked"><b>03</b><span><b>步骤<span class="num">3</span>（(1)图(3)·异号矩形面积）：</b><i class="m">y</i>轴两侧矩形拼接求和：<i class="m">S</i><sub>矩形<i class="m">BCDA</i></sub><span class="num">=</span><i class="m">S</i><sub>矩形<i class="m">OEDA</i></sub><span class="num">+</span><i class="m">S</i><sub>矩形<i class="m">OCBE</i></sub><span class="num">=|</span><i class="m">k</i><sub><span class="num">1</span></sub><span class="num">|+|</span><i class="m">k</i><sub><span class="num">2</span></sub><span class="num">|</span>．</span></div>
          <div class="step step-locked"><b>04</b><span><b>步骤<span class="num">4</span>（(1)图(4)·异号三角形面积）：</b><span class="num">△</span><i class="m">OAB</i>与图(<span class="num">3</span>)阴影矩形同底<i class="m">AB</i>、等高<i class="m">OC</i>，故<i class="m">S</i><sub><span class="num">△</span><i class="m">OAB</i></sub><span class="num">=</span><span class="math"><span class="fraction"><span><span class="num">1</span></span><span><span class="num">2</span></span></span></span><span class="num">(|</span><i class="m">k</i><sub><span class="num">1</span></sub><span class="num">|+|</span><i class="m">k</i><sub><span class="num">2</span></sub><span class="num">|)</span>（顶点在<i class="m">x</i>轴移动时面积不变）．</span></div>
          <div class="step step-locked"><b>05</b><span><b>步骤<span class="num">5</span>（(2)①图(1)·共高矩形转线段比）：</b>图(<span class="num">1</span>)中两矩形同高<i class="m">OC</i>，线段比等于面积比：<span class="math"><span class="fraction"><span><i class="m">CF</i></span><span><i class="m">CB</i></span></span><span class="num">=</span><span class="fraction"><span><i class="m">S</i><sub>矩形<i class="m">OCFD</i></sub></span><span><i class="m">S</i><sub>矩形<i class="m">OABC</i></sub></span></span><span class="num">=</span><span class="fraction"><span><i class="m">k</i><sub><span class="num">2</span></sub></span><span><i class="m">k</i><sub><span class="num">1</span></sub></span></span></span>．</span></div>
          <div class="step step-locked"><b>06</b><span><b>步骤<span class="num">6</span>（(2)①图(3)·共高矩形转线段比）：</b>图(<span class="num">3</span>)中两矩形同高<i class="m">OE</i>，线段比等于面积比：<span class="math"><span class="fraction"><span><i class="m">AE</i></span><span><i class="m">BE</i></span></span><span class="num">=</span><span class="fraction"><span><i class="m">S</i><sub>矩形<i class="m">OEDA</i></sub></span><span><i class="m">S</i><sub>矩形<i class="m">OCBE</i></sub></span></span><span class="num">=</span><span class="fraction"><span><span class="num">|</span><i class="m">k</i><sub><span class="num">1</span></sub><span class="num">|</span></span><span><span class="num">|</span><i class="m">k</i><sub><span class="num">2</span></sub><span class="num">|</span></span></span></span>．</span></div>
          <div class="step step-locked"><b>07</b><span><b>步骤<span class="num">7</span>（(2)②图(5)·求右上角<span class="num">△</span><i class="m">BDF</i>面积）：</b>由<span class="math"><span class="fraction"><span><i class="m">CF</i></span><span><i class="m">CB</i></span></span><span class="num">=</span><span class="fraction"><span><i class="m">AD</i></span><span><i class="m">AB</i></span></span><span class="num">=</span><span class="fraction"><span><i class="m">k</i><sub><span class="num">2</span></sub></span><span><i class="m">k</i><sub><span class="num">1</span></sub></span></span></span>得<span class="math"><span class="fraction"><span><i class="m">BF</i></span><span><i class="m">CB</i></span></span><span class="num">=</span><span class="fraction"><span><i class="m">BD</i></span><span><i class="m">AB</i></span></span><span class="num">=</span><span class="fraction"><span><i class="m">k</i><sub><span class="num">1</span></sub><span class="num">-</span><i class="m">k</i><sub><span class="num">2</span></sub></span><span><i class="m">k</i><sub><span class="num">1</span></sub></span></span></span>，故<span class="math"><i class="m">S</i><sub><span class="num">△</span><i class="m">BDF</i></sub><span class="num">=</span><span class="fraction"><span><span class="num">1</span></span><span><span class="num">2</span></span></span><i class="m">BF</i><span class="num">·</span><i class="m">BD</i><span class="num">=</span><span class="fraction"><span><span class="num">(</span><i class="m">k</i><sub><span class="num">1</span></sub><span class="num">-</span><i class="m">k</i><sub><span class="num">2</span></sub><span class="num">)</span><sup><span class="num">2</span></sup></span><span><span class="num">2</span><i class="m">k</i><sub><span class="num">1</span></sub></span></span></span>．</span></div>
          <div class="step step-locked"><b>08</b><span><b>步骤<span class="num">8</span>（(2)②图(5)·大矩形割补求<span class="num">△</span><i class="m">ODF</i>面积）：</b>用<i class="m">S</i><sub>矩形<i class="m">OABC</i></sub><span class="num">=</span><i class="m">k</i><sub><span class="num">1</span></sub>减去<i class="m">S</i><sub><span class="num">△</span><i class="m">OCF</i></sub><span class="num">+</span><i class="m">S</i><sub><span class="num">△</span><i class="m">OAD</i></sub><span class="num">=</span><i class="m">k</i><sub><span class="num">2</span></sub>及<i class="m">S</i><sub><span class="num">△</span><i class="m">BDF</i></sub>，化简得<span class="math"><i class="m">S</i><sub><span class="num">△</span><i class="m">ODF</i></sub><span class="num">=</span><span class="fraction"><span><i class="m">k</i><sub><span class="num">1</span></sub><sup><span class="num">2</span></sup><span class="num">-</span><i class="m">k</i><sub><span class="num">2</span></sub><sup><span class="num">2</span></sup></span><span><span class="num">2</span><i class="m">k</i><sub><span class="num">1</span></sub></span></span></span>！</span></div>
        </div>
        <div class="screen-media">
          <div class="screen-lab">
            <div id="scene" class="visual" style="padding:10px;align-items:stretch;justify-content:center;"></div>
          </div>
        </div>
      </div>
    </div>
  `
});

// ================= SIMS 实现 =================
Object.assign(window.UNIT1_SIMS, {
  introSim(state, isInit) {
    if (isInit) {
      state.step = 0;
      state.xQ = 1.6;
      clearManualOverrides(state);
    }
    const root = activeRoot();
    const step = Number(state.step || 0);
    const controls = root.querySelector('#controls');
    if (controls) {
      controls.innerHTML = stepBar(step, 3) + (step >= 1 ? slider('xQ', '拖动点<i class="m">Q</i>', 0.8, 3.2, state.xQ, 0.05) : '');
    }
    const scene = root.querySelector('#scene');
    if (!scene) return;
    const ox = 210, oy = 195, scale = 42, k = 3.2;
    const xQ = Number(state.xQ || 1.6), yQ = k / xQ;
    const qx = ox + xQ * scale, qy = oy - yQ * scale;
    const ax = ox, ay = qy, bx = qx, by = oy;
    scene.innerHTML = `<svg viewBox="0 0 480 360" style="width:100%;height:100%;max-height:100%;display:block;">
      <rect x="${ox}" y="${qy}" width="${qx - ox}" height="${oy - qy}" fill="${step >= 2 ? 'rgba(34,197,94,0.22)' : 'rgba(134,239,172,0.32)'}" stroke="#2563eb" stroke-width="1.8"/>
      ${step >= 3 ? `<polygon points="${ox},${oy} ${qx},${qy} ${bx},${by}" fill="rgba(59,130,246,0.28)" stroke="#1d4ed8" stroke-width="1.5"/>` : ''}
      ${svgAxes1(ox, oy, 40, 440, 20, 340)}
      <polyline fill="none" stroke="#db2777" stroke-width="3" points="${sampleHyperbola1(k, 0.55, 4.5, ox, oy, scale)}"/>
      <polyline fill="none" stroke="#db2777" stroke-width="3" points="${sampleHyperbola1(k, -4.0, -0.55, ox, oy, scale)}"/>
      <line x1="${ox}" y1="${oy}" x2="${qx}" y2="${qy}" stroke="#0f172a" stroke-width="2.4"/>
      <circle cx="${qx}" cy="${qy}" r="4.5" fill="#dc2626" stroke="#fff" stroke-width="1.5"/>
      ${svgTextHalo1(qx + 14, qy - 8, 'Q')}
      ${svgTextHalo1(ax - 14, ay + 5, 'A')}
      ${svgTextHalo1(bx, by + 20, 'B')}
      ${svgTextHalo1(ox + 150, 55, 'y =', { size: 15, color: '#be185d' })}
      ${svgFrac1(ox + 175, 51, 'k', 'x', '#be185d', 15)}
      ${step >= 2 ? window.svgFoCard(242, 244, 224, 84, `
        <div style="color:#15803d;font-size:14.5px;"><i class="m">S</i><sub>矩形<i class="m">AOBQ</i></sub><span class="num"> = |</span><i class="m">k</i><span class="num">|</span></div>
        ${step >= 3 ? `<div style="color:#1d4ed8;font-size:14px;"><i class="m">S</i><sub><span class="num">△</span><i class="m">AOQ</i></sub><span class="num"> = </span><i class="m">S</i><sub><span class="num">△</span><i class="m">BOQ</i></sub><span class="num"> = </span><span class="fraction"><span><span class="num">1</span></span><span><span class="num">2</span></span></span><span class="num">|</span><i class="m">k</i><span class="num">|</span></div>` : ''}
      `, 'background:#f8fafc;border-color:#cbd5e1;') : ''}
    </svg>`;
  },

  explore1Sim(state, isInit) {
    if (isInit) {
      state.step = 0;
      state.axisMode = 1;
      state.yD = 2.6;
      state.xE = 2.8;
      clearManualOverrides(state);
    }
    const root = activeRoot();
    const step = Number(state.step || 0);
    if (!isManualOverride(state, 'axisMode')) {
      state.axisMode = step >= 3 ? 2 : 1;
    }
    const axisMode = Number(state.axisMode || 1);
    const controls = root.querySelector('#controls');
    if (controls) {
      controls.innerHTML = stepBar(step, 3) +
        modeButtons('axisMode', axisMode, [
          [1, '（1）y轴动点D（同底AB）', 2],
          [2, '（2）x轴动点E（同底AC）', 3]
        ]) +
        (axisMode === 1
          ? slider('yD', '拖动<i class="m">y</i>轴动点<i class="m">D</i>', -2.2, 3.0, state.yD, 0.05)
          : slider('xE', '拖动<i class="m">x</i>轴动点<i class="m">E</i>', -1.8, 3.8, state.xE, 0.05));
    }
    const scene = root.querySelector('#scene');
    if (!scene) return;
    const ox = 160, oy = 215, scale = 48, k = 2.8;
    const xA = 1.25, yA = k / xA;
    const ax = ox + xA * scale, ay = oy - yA * scale;
    const bx = ax, by = oy;
    const cx = ox, cy = ay;
    const yD = Number(state.yD !== undefined ? state.yD : 2.6);
    const dx = ox, dy = oy - yD * scale;
    const xE = Number(state.xE !== undefined ? state.xE : 2.8);
    const ex = ox + xE * scale, ey = oy;

    if (axisMode === 1) {
      scene.innerHTML = `<svg viewBox="0 0 480 360" style="width:100%;height:100%;max-height:100%;display:block;">
        ${step >= 1 ? `<polygon points="${ox},${oy} ${ax},${ay} ${bx},${by}" fill="rgba(59,130,246,0.18)" stroke="#2563eb" stroke-width="1.6" stroke-dasharray="5,4"/>` : ''}
        <polygon points="${dx},${dy} ${ax},${ay} ${bx},${by}" fill="rgba(100,116,139,0.36)" stroke="#0f172a" stroke-width="2"/>
        ${svgAxes1(ox, oy, 40, 440, 20, 340)}
        <polyline fill="none" stroke="#1e293b" stroke-width="2.5" points="${sampleHyperbola1(k, 0.55, 5.2, ox, oy, scale)}"/>
        <line x1="${ox}" y1="${oy}" x2="${ax}" y2="${ay}" stroke="#334155" stroke-width="1.8"/>
        ${step >= 2 ? `<g>
          <line x1="${ox}" y1="${dy}" x2="${ax}" y2="${dy}" stroke="#dc2626" stroke-width="2" stroke-dasharray="4,4"/>
          ${svgTextHalo1((ox + ax) / 2, dy - 8, '高 = OB', { size: 13, italic: false, color: '#dc2626' })}
        </g>` : ''}
        <circle cx="${ax}" cy="${ay}" r="4" fill="#0f172a"/>
        <circle cx="${bx}" cy="${by}" r="4" fill="#0f172a"/>
        <circle cx="${dx}" cy="${dy}" r="5" fill="#dc2626" stroke="#fff" stroke-width="1.5"/>
        ${svgTextHalo1(ax + 14, ay - 6, 'A')}
        ${svgTextHalo1(bx, by + 20, 'B')}
        ${svgTextHalo1(dx - 16, dy + 5, 'D', { color: '#dc2626' })}
        ${step >= 2 ? window.svgFoCard(248, 30, 218, 76, `
          <div style="color:#1d4ed8;font-size:13px;"><i class="m">AB</i><span class="num">⊥</span><i class="m">x</i>轴 · 同底<i class="m">AB</i>等高<i class="m">OB</i></div>
          <div style="color:#0f172a;font-size:13.5px;"><i class="m">S</i><sub><span class="num">△</span><i class="m">ABD</i></sub><span class="num"> = </span><i class="m">S</i><sub><span class="num">△</span><i class="m">AOB</i></sub><span class="num"> = </span><span class="fraction"><span><span class="num">1</span></span><span><span class="num">2</span></span></span><span class="num">|</span><i class="m">k</i><span class="num">|</span></div>
        `, 'background:#eff6ff;border-color:#93c5fd;') : ''}
      </svg>`;
    } else {
      scene.innerHTML = `<svg viewBox="0 0 480 360" style="width:100%;height:100%;max-height:100%;display:block;">
        ${step >= 3 ? `<polygon points="${ox},${oy} ${ax},${ay} ${cx},${cy}" fill="rgba(16,185,129,0.20)" stroke="#059669" stroke-width="1.6" stroke-dasharray="5,4"/>` : ''}
        <polygon points="${ex},${ey} ${ax},${ay} ${cx},${cy}" fill="rgba(100,116,139,0.36)" stroke="#0f172a" stroke-width="2"/>
        ${svgAxes1(ox, oy, 40, 440, 20, 340)}
        <polyline fill="none" stroke="#1e293b" stroke-width="2.5" points="${sampleHyperbola1(k, 0.55, 5.2, ox, oy, scale)}"/>
        <line x1="${ox}" y1="${oy}" x2="${ax}" y2="${ay}" stroke="#334155" stroke-width="1.8"/>
        <line x1="${cx}" y1="${cy}" x2="${ax}" y2="${ay}" stroke="#0f172a" stroke-width="2.2"/>
        ${step >= 3 ? `<g>
          <line x1="${ex}" y1="${oy}" x2="${ex}" y2="${ay}" stroke="#059669" stroke-width="2" stroke-dasharray="4,4"/>
          ${svgTextHalo1(ex + 28, (oy + ay) / 2, '高 = OC', { size: 13, italic: false, color: '#059669' })}
        </g>` : ''}
        <circle cx="${ax}" cy="${ay}" r="4" fill="#0f172a"/>
        <circle cx="${cx}" cy="${cy}" r="4" fill="#0f172a"/>
        <circle cx="${ex}" cy="${ey}" r="5" fill="#059669" stroke="#fff" stroke-width="1.5"/>
        ${svgTextHalo1(ax + 14, ay - 6, 'A')}
        ${svgTextHalo1(cx - 14, cy + 5, 'C')}
        ${svgTextHalo1(ex, ey + 20, 'E', { color: '#059669' })}
        ${step >= 3 ? window.svgFoCard(248, 30, 218, 76, `
          <div style="color:#047857;font-size:13px;"><i class="m">AC</i><span class="num">⊥</span><i class="m">y</i>轴 · 同底<i class="m">AC</i>等高<i class="m">OC</i></div>
          <div style="color:#0f172a;font-size:13.5px;"><i class="m">S</i><sub><span class="num">△</span><i class="m">ACE</i></sub><span class="num"> = </span><i class="m">S</i><sub><span class="num">△</span><i class="m">AOC</i></sub><span class="num"> = </span><span class="fraction"><span><span class="num">1</span></span><span><span class="num">2</span></span></span><span class="num">|</span><i class="m">k</i><span class="num">|</span></div>
        `, 'background:#ecfdf5;border-color:#6ee7b7;') : ''}
      </svg>`;
    }
  },

  explore2Sim(state, isInit) {
    if (isInit) {
      state.step = 0;
      state.xC = 3.2;
      clearManualOverrides(state);
    }
    const root = activeRoot();
    const step = Number(state.step || 0);
    const controls = root.querySelector('#controls');
    if (controls) {
      controls.innerHTML = stepBar(step, 3) + (step >= 1 ? slider('xC', '拖动点<i class="m">C</i>', 2.0, 4.4, state.xC, 0.1) : '');
    }
    const scene = root.querySelector('#scene');
    if (!scene) return;
    const ox = 110, oy = 275, scale = 65, k = 3.0;
    const xA = 1.15, yA = k / xA;
    const xC = Number(state.xC || 3.2), yC = k / xC;
    const yE = (yC / xC) * xA;
    const ax = ox + xA * scale, ay = oy - yA * scale;
    const bx = ax, by = oy;
    const cx = ox + xC * scale, cy = oy - yC * scale;
    const dx = cx, dy = oy;
    const ex = ax, ey = oy - yE * scale;
    scene.innerHTML = `<svg viewBox="0 0 480 360" style="width:100%;height:100%;max-height:100%;display:block;">
      <polygon points="${ox},${oy} ${ax},${ay} ${ex},${ey}" fill="${step >= 2 ? 'rgba(59,130,246,0.38)' : 'rgba(148,163,184,0.45)'}" stroke="#1e293b" stroke-width="1.8"/>
      <polygon points="${bx},${by} ${ex},${ey} ${cx},${cy} ${dx},${dy}" fill="${step >= 2 ? 'rgba(59,130,246,0.38)' : 'rgba(100,116,139,0.6)'}" stroke="#1e293b" stroke-width="1.8"/>
      ${step >= 1 ? `<polygon points="${ox},${oy} ${bx},${by} ${ex},${ey}" fill="rgba(250,204,21,0.35)" stroke="#ca8a04" stroke-width="1.8" stroke-dasharray="4,3"/>` : ''}
      ${step >= 3 ? `<g>
        <polygon points="${ax},${ay} ${cx},${cy} ${dx},${dy} ${bx},${by}" fill="rgba(16,185,129,0.18)" stroke="#059669" stroke-width="2.2" stroke-dasharray="6,4"/>
        <line x1="${ax}" y1="${ay}" x2="${cx}" y2="${cy}" stroke="#059669" stroke-width="2.5"/>
      </g>` : ''}
      ${svgAxes1(ox, oy, 30, 450, 20, 325)}
      <polyline fill="none" stroke="#0f172a" stroke-width="2.4" points="${sampleHyperbola1(k, 0.75, 4.9, ox, oy, scale)}"/>
      <circle cx="${ax}" cy="${ay}" r="4" fill="#0f172a"/>
      <circle cx="${cx}" cy="${cy}" r="4.5" fill="#dc2626" stroke="#fff" stroke-width="1.5"/>
      <circle cx="${ex}" cy="${ey}" r="3.8" fill="#1d4ed8"/>
      ${svgTextHalo1(ax + 12, ay - 6, 'A')}
      ${svgTextHalo1(bx, by + 20, 'B')}
      ${svgTextHalo1(cx + 12, cy - 8, 'C', { color: '#dc2626' })}
      ${svgTextHalo1(dx, dy + 20, 'D')}
      ${svgTextHalo1(ex + 13, ey - 5, 'E', { color: '#1d4ed8' })}
      ${step >= 2 ? svgTextHalo1(310, 65, 'S△AOE = S四边形BECD', { size: 15, italic: false, color: '#1d4ed8' }) : ''}
      ${step >= 3 ? svgTextHalo1(310, 92, 'S△AOC = S直角梯形ACDB', { size: 14, italic: false, color: '#059669' }) : ''}
    </svg>`;
  },

  explore3Sim(state, isInit) {
    if (isInit) {
      state.step = 0;
      state.caseMode = 0;
      clearManualOverrides(state);
    }
    const root = activeRoot();
    const step = Number(state.step || 0);
    if (!isManualOverride(state, 'caseMode')) {
      if (step === 1 || step === 5) state.caseMode = 1;
      else if (step === 2) state.caseMode = 2;
      else if (step === 3 || step === 6) state.caseMode = 3;
      else if (step === 4) state.caseMode = 4;
      else if (step >= 7) state.caseMode = 5;
      else state.caseMode = 0;
    }
    const mode = Number(state.caseMode || 0);
    const controls = root.querySelector('#controls');
    if (controls) {
      controls.innerHTML = stepBar(step, 8);
    }
    const scene = root.querySelector('#scene');
    if (!scene) return;

    function cell1(x0, y0, w, h) {
      const kScale = w / 224;
      const isZoom = kScale > 1.3;
      const ox = x0 + Math.round(32 * kScale), oy = y0 + h - Math.round(24 * kScale), sc = 24 * kScale;
      const xB = 3.2, yB = 1.6, xF = 1.6;
      const bx = ox + xB * sc, by = oy - yB * sc, fx = ox + xF * sc;
      const cx = ox, cy = by, dx = fx, dy = oy, ax = bx, ay = oy;
      const showArea = step >= 1;
      const showRatio = step >= 5;
      const isActive = step === 1 || step === 5;
      const ptR = isZoom ? 3.8 : 2.4;
      const lblFs = Math.round(11.5 * Math.max(0.85, Math.min(1.3, kScale)));
      const titleTxt = isZoom
        ? (step >= 5 ? '图(1) 拓展①：共高矩形转线段比 CF、CB' : '图(1) 同号双曲线：阴影矩形 DFBA 面积')
        : '图(1) 同号：矩形';
      return `<g ${!isZoom ? 'style="cursor:pointer;" onclick="window.advanceSimStep(1)"' : ''}>
        <rect x="${x0}" y="${y0}" width="${w}" height="${h}" rx="8" fill="#ffffff" stroke="${isActive ? '#2563eb' : '#cbd5e1'}" stroke-width="${isActive ? 2.4 : 1}"/>
        ${svgTextHalo1(x0 + w / 2, y0 + Math.max(14, 16 * kScale), titleTxt, { size: Math.round(11.5 * Math.max(0.88, Math.min(1.25, kScale))), italic: false, color: isActive ? '#1d4ed8' : '#1e293b' })}
        <rect x="${ox}" y="${by}" width="${fx - ox}" height="${oy - by}" fill="rgba(148,163,184,0.38)" stroke="#475569"/>
        <rect x="${fx}" y="${by}" width="${bx - fx}" height="${oy - by}" fill="rgba(59,130,246,0.32)" stroke="#1d4ed8" stroke-width="1.6"/>
        ${showRatio ? `<g>
          <line x1="${cx}" y1="${cy}" x2="${bx}" y2="${by}" stroke="#2563eb" stroke-width="${isZoom ? 3.2 : 2.0}"/>
          <line x1="${cx}" y1="${cy}" x2="${fx}" y2="${by}" stroke="#dc2626" stroke-width="${isZoom ? 3.8 : 2.4}"/>
          ${isZoom ? `
            <path d="M ${cx},${cy - 8} L ${cx},${cy - 15} L ${fx},${cy - 15} L ${fx},${cy - 8}" fill="none" stroke="#dc2626" stroke-width="1.5"/>
            ${svgTextHalo1((cx + fx) / 2, cy - 21, 'CF (面积 k₂)', { size: 12, italic: false, color: '#dc2626' })}
            <path d="M ${cx},${cy + 8} L ${cx},${cy + 16} L ${bx},${cy + 16} L ${bx},${cy + 8}" fill="none" stroke="#2563eb" stroke-width="1.5" stroke-dasharray="3,2"/>
            ${svgTextHalo1((cx + bx) / 2, cy + 29, 'CB (总面积 k₁)', { size: 12, italic: false, color: '#2563eb' })}
          ` : ''}
        </g>` : ''}
        ${svgAxes1(ox, oy, x0 + 12 * kScale, x0 + w - 10 * kScale, y0 + 24 * kScale, y0 + h - 10 * kScale)}
        <polyline fill="none" stroke="#0f172a" stroke-width="1.8" points="${sampleHyperbola1(5.12, 1.15, 4.2, ox, oy, sc, 30)}"/>
        <polyline fill="none" stroke="#64748b" stroke-width="1.6" points="${sampleHyperbola1(2.56, 0.72, 4.2, ox, oy, sc, 30)}"/>
        <circle cx="${cx}" cy="${cy}" r="${ptR}" fill="#0f172a"/>
        <circle cx="${fx}" cy="${by}" r="${ptR}" fill="#dc2626"/>
        <circle cx="${bx}" cy="${by}" r="${ptR}" fill="#1d4ed8"/>
        <circle cx="${dx}" cy="${dy}" r="${ptR}" fill="#0f172a"/>
        <circle cx="${ax}" cy="${ay}" r="${ptR}" fill="#0f172a"/>
        ${svgTextHalo1(cx - 9 * kScale, cy + 4 * kScale, 'C', { size: lblFs })}
        ${svgTextHalo1(fx + 2 * kScale, by - 6 * kScale, 'F', { size: lblFs, color: '#dc2626' })}
        ${svgTextHalo1(bx + 7 * kScale, by - 5 * kScale, 'B', { size: lblFs, color: '#1d4ed8' })}
        ${svgTextHalo1(dx, dy + 13 * kScale, 'D', { size: lblFs })}
        ${svgTextHalo1(ax, ay + 13 * kScale, 'A', { size: lblFs })}
        ${isZoom ? `
          ${window.svgFoLabel(ox + 3.55 * sc, oy - 1.92 * sc, 90, 44, '<span style="color:#0f172a;font-size:13px;"><i class="m">y</i><span class="num">=</span><span class="fraction"><span><i class="m">k</i><sub><span class="num">1</span></sub></span><span><i class="m">x</i></span></span></span>')}
          ${window.svgFoLabel(ox + 3.55 * sc, oy - 0.88 * sc, 90, 44, '<span style="color:#475569;font-size:13px;"><i class="m">y</i><span class="num">=</span><span class="fraction"><span><i class="m">k</i><sub><span class="num">2</span></sub></span><span><i class="m">x</i></span></span></span>')}
        ` : ''}
        ${showArea ? svgTextHalo1(x0 + w - (isZoom ? 110 : 52 * kScale), y0 + (isZoom ? 54 : 34 * kScale), 'S = |k₁| - |k₂|', { size: isZoom ? 15 : Math.round(10.5 * Math.max(0.88, kScale)), italic: false, color: '#1d4ed8' }) : ''}
        ${showRatio && isZoom ? window.svgFoLabel(x0 + w - 195, y0 + 74, 182, 48, `<span style="color:#dc2626;font-size:15px;background:rgba(255,241,242,0.92);padding:1px 6px;border-radius:5px;border:1px solid #fda4af;"><span class="fraction"><span><i class="m">CF</i></span><span><i class="m">CB</i></span></span><span class="num">=</span><span class="fraction"><span><i class="m">k</i><sub><span class="num">2</span></sub></span><span><i class="m">k</i><sub><span class="num">1</span></sub></span></span></span>`) : ''}
      </g>`;
    }
    function cell2(x0, y0, w, h) {
      const kScale = w / 224;
      const isZoom = kScale > 1.3;
      const ox = x0 + Math.round(32 * kScale), oy = y0 + h - Math.round(24 * kScale), sc = 24 * kScale;
      const xA = 2.8, yB = 5.12 / xA, yD = 2.56 / xA;
      const ax = ox + xA * sc, by = oy - yB * sc, dy = oy - yD * sc;
      const cx = ox, cy = by;
      const showAns = step >= 2;
      const isActive = step === 2;
      const ptR = isZoom ? 3.8 : 2.4;
      const lblFs = Math.round(11.5 * Math.max(0.85, Math.min(1.3, kScale)));
      const titleTxt = isZoom ? '图(2) 同号双曲线：阴影三角形 △OBD 面积' : '图(2) 同号：△OBD';
      return `<g ${!isZoom ? 'style="cursor:pointer;" onclick="window.advanceSimStep(2)"' : ''}>
        <rect x="${x0}" y="${y0}" width="${w}" height="${h}" rx="8" fill="#ffffff" stroke="${isActive ? '#2563eb' : '#cbd5e1'}" stroke-width="${isActive ? 2.4 : 1}"/>
        ${svgTextHalo1(x0 + w / 2, y0 + Math.max(14, 16 * kScale), titleTxt, { size: Math.round(11.5 * Math.max(0.88, Math.min(1.25, kScale))), italic: false, color: isActive ? '#1d4ed8' : '#1e293b' })}
        <line x1="${cx}" y1="${cy}" x2="${ax}" y2="${by}" stroke="#64748b" stroke-width="1.2" stroke-dasharray="3,3"/>
        <polygon points="${ox},${oy} ${ax},${by} ${ax},${dy}" fill="rgba(59,130,246,0.35)" stroke="#1d4ed8" stroke-width="1.6"/>
        <line x1="${ax}" y1="${dy}" x2="${ax}" y2="${oy}" stroke="#475569" stroke-dasharray="3,3"/>
        ${svgAxes1(ox, oy, x0 + 12 * kScale, x0 + w - 10 * kScale, y0 + 24 * kScale, y0 + h - 10 * kScale)}
        <polyline fill="none" stroke="#0f172a" stroke-width="1.8" points="${sampleHyperbola1(5.12, 1.15, 4.2, ox, oy, sc, 30)}"/>
        <polyline fill="none" stroke="#64748b" stroke-width="1.6" points="${sampleHyperbola1(2.56, 0.72, 4.2, ox, oy, sc, 30)}"/>
        <circle cx="${cx}" cy="${cy}" r="${ptR}" fill="#0f172a"/>
        <circle cx="${ax}" cy="${by}" r="${ptR}" fill="#1d4ed8"/>
        <circle cx="${ax}" cy="${dy}" r="${ptR}" fill="#dc2626"/>
        <circle cx="${ax}" cy="${oy}" r="${ptR}" fill="#0f172a"/>
        ${svgTextHalo1(cx - 9 * kScale, cy + 4 * kScale, 'C', { size: lblFs })}
        ${svgTextHalo1(ax + 8 * kScale, by - 4 * kScale, 'B', { size: lblFs, color: '#1d4ed8' })}
        ${svgTextHalo1(ax + 8 * kScale, dy + 3 * kScale, 'D', { size: lblFs, color: '#dc2626' })}
        ${svgTextHalo1(ax, oy + 13 * kScale, 'A', { size: lblFs })}
        ${isZoom ? `
          ${window.svgFoLabel(ox + 3.55 * sc, oy - 1.92 * sc, 90, 44, '<span style="color:#0f172a;font-size:13px;"><i class="m">y</i><span class="num">=</span><span class="fraction"><span><i class="m">k</i><sub><span class="num">1</span></sub></span><span><i class="m">x</i></span></span></span>')}
          ${window.svgFoLabel(ox + 3.55 * sc, oy - 0.88 * sc, 90, 44, '<span style="color:#475569;font-size:13px;"><i class="m">y</i><span class="num">=</span><span class="fraction"><span><i class="m">k</i><sub><span class="num">2</span></sub></span><span><i class="m">x</i></span></span></span>')}
        ` : ''}
        ${showAns ? window.svgFoLabel(x0 + (isZoom ? 200 : 28 * kScale), y0 + (isZoom ? 38 : 20 * kScale), isZoom ? 210 : w - 32 * kScale, isZoom ? 48 : 32 * kScale, `<span style="color:#1d4ed8;font-size:${isZoom ? 15 : 10.5}px;"><i class="m">S</i><span class="num">=</span><span class="fraction"><span><span class="num">1</span></span><span><span class="num">2</span></span></span><span class="num">(|</span><i class="m">k</i><sub><span class="num">1</span></sub><span class="num">|-|</span><i class="m">k</i><sub><span class="num">2</span></sub><span class="num">|)</span></span>`) : ''}
      </g>`;
    }
    function cell3(x0, y0, w, h) {
      const kScale = w / 224;
      const isZoom = kScale > 1.3;
      const ox = x0 + w / 2, oy = y0 + h - Math.round(24 * kScale), sc = 21 * kScale;
      const yA = 1.8, xA = 3.2 / yA, xB = -2.4 / yA;
      const ax = ox + xA * sc, bx = ox + xB * sc, ay = oy - yA * sc;
      const ex = ox, ey = ay, cx = bx, cy = oy, dx = ax, dy = oy;
      const showArea = step >= 3;
      const showRatio = step >= 6;
      const isActive = step === 3 || step === 6;
      const ptR = isZoom ? 3.8 : 2.4;
      const lblFs = Math.round(11.5 * Math.max(0.85, Math.min(1.3, kScale)));
      const titleTxt = isZoom
        ? (step >= 6 ? '图(3) 拓展①：共高矩形转线段比 AE、BE' : '图(3) 异号双曲线：阴影矩形 BCDA 面积')
        : '图(3) 异号：矩形';
      return `<g ${!isZoom ? 'style="cursor:pointer;" onclick="window.advanceSimStep(3)"' : ''}>
        <rect x="${x0}" y="${y0}" width="${w}" height="${h}" rx="8" fill="#ffffff" stroke="${isActive ? '#059669' : '#cbd5e1'}" stroke-width="${isActive ? 2.4 : 1}"/>
        ${svgTextHalo1(x0 + w / 2, y0 + Math.max(14, 16 * kScale), titleTxt, { size: Math.round(11.5 * Math.max(0.88, Math.min(1.25, kScale))), italic: false, color: isActive ? '#059669' : '#1e293b' })}
        <rect x="${bx}" y="${ay}" width="${ax - bx}" height="${oy - ay}" fill="rgba(16,185,129,0.28)" stroke="#059669" stroke-width="1.6"/>
        ${showRatio ? `<g>
          <line x1="${bx}" y1="${ay}" x2="${ex}" y2="${ey}" stroke="#2563eb" stroke-width="${isZoom ? 3.6 : 2.0}"/>
          <line x1="${ex}" y1="${ey}" x2="${ax}" y2="${ay}" stroke="#dc2626" stroke-width="${isZoom ? 3.6 : 2.0}"/>
          ${isZoom ? `
            <path d="M ${bx + 2},${ay + 7} L ${bx + 2},${ay + 15} L ${ex - 3},${ay + 15} L ${ex - 3},${ay + 7}" fill="none" stroke="#2563eb" stroke-width="1.5"/>
            ${svgTextHalo1((bx + ex) / 2 - 4, ay + 28, 'BE (|k₂|)', { size: 11.5, italic: false, color: '#2563eb' })}
            <path d="M ${ex + 3},${ay + 7} L ${ex + 3},${ay + 15} L ${ax - 2},${ay + 15} L ${ax - 2},${ay + 7}" fill="none" stroke="#dc2626" stroke-width="1.5"/>
            ${svgTextHalo1((ex + ax) / 2 + 4, ay + 28, 'AE (|k₁|)', { size: 11.5, italic: false, color: '#dc2626' })}
          ` : ''}
        </g>` : ''}
        ${svgAxes1(ox, oy, x0 + 10 * kScale, x0 + w - 10 * kScale, y0 + 24 * kScale, y0 + h - 10 * kScale)}
        <polyline fill="none" stroke="#0f172a" stroke-width="1.8" points="${sampleHyperbola1(3.2, 0.85, 3.6, ox, oy, sc, 30)}"/>
        <polyline fill="none" stroke="#64748b" stroke-width="1.8" points="${sampleHyperbola1(-2.4, -3.6, -0.7, ox, oy, sc, 30)}"/>
        <circle cx="${bx}" cy="${ay}" r="${ptR}" fill="#2563eb"/>
        <circle cx="${ex}" cy="${ey}" r="${ptR}" fill="#dc2626"/>
        <circle cx="${ax}" cy="${ay}" r="${ptR}" fill="#dc2626"/>
        <circle cx="${cx}" cy="${cy}" r="${ptR}" fill="#0f172a"/>
        <circle cx="${dx}" cy="${dy}" r="${ptR}" fill="#0f172a"/>
        ${svgTextHalo1(bx - 10 * kScale, ay - 3 * kScale, 'B', { size: lblFs, color: '#2563eb' })}
        ${svgTextHalo1(ex + 8 * kScale, ey - 6 * kScale, 'E', { size: lblFs, color: '#dc2626' })}
        ${svgTextHalo1(ax + 10 * kScale, ay - 3 * kScale, 'A', { size: lblFs, color: '#dc2626' })}
        ${svgTextHalo1(cx, cy + 13 * kScale, 'C', { size: lblFs })}
        ${svgTextHalo1(dx, dy + 13 * kScale, 'D', { size: lblFs })}
        ${isZoom ? `
          ${window.svgFoLabel(ox - 3.65 * sc, oy - 3.05 * sc, 90, 44, '<span style="color:#475569;font-size:13px;"><i class="m">y</i><span class="num">=</span><span class="fraction"><span><i class="m">k</i><sub><span class="num">2</span></sub></span><span><i class="m">x</i></span></span></span>')}
          ${window.svgFoLabel(ox + 2.25 * sc, oy - 1.38 * sc, 90, 44, '<span style="color:#0f172a;font-size:13px;"><i class="m">y</i><span class="num">=</span><span class="fraction"><span><i class="m">k</i><sub><span class="num">1</span></sub></span><span><i class="m">x</i></span></span></span>')}
        ` : ''}
        ${showArea ? svgTextHalo1(x0 + (isZoom ? 115 : 46 * kScale), y0 + (isZoom ? 54 : 34 * kScale), 'S = |k₁| + |k₂|', { size: isZoom ? 15 : Math.round(10.5 * Math.max(0.88, kScale)), italic: false, color: '#059669' }) : ''}
        ${showRatio && isZoom ? window.svgFoLabel(x0 + w - 195, y0 + 54, 182, 48, `<span style="color:#dc2626;font-size:15px;background:rgba(255,241,242,0.92);padding:1px 6px;border-radius:5px;border:1px solid #fda4af;"><span class="fraction"><span><i class="m">AE</i></span><span><i class="m">BE</i></span></span><span class="num">=</span><span class="fraction"><span><span class="num">|</span><i class="m">k</i><sub><span class="num">1</span></sub><span class="num">|</span></span><span><span class="num">|</span><i class="m">k</i><sub><span class="num">2</span></sub><span class="num">|</span></span></span></span>`) : ''}
      </g>`;
    }
    function cell4(x0, y0, w, h) {
      const kScale = w / 224;
      const isZoom = kScale > 1.3;
      const ox = x0 + w / 2, oy = y0 + h - Math.round(24 * kScale), sc = 21 * kScale;
      const yA = 1.8, xA = 3.2 / yA, xB = -2.4 / yA;
      const ax = ox + xA * sc, bx = ox + xB * sc, ay = oy - yA * sc;
      const cx = ox, cy = ay;
      const showAns = step >= 4;
      const isActive = step === 4;
      const ptR = isZoom ? 3.8 : 2.4;
      const lblFs = Math.round(11.5 * Math.max(0.85, Math.min(1.3, kScale)));
      const titleTxt = isZoom ? '图(4) 异号双曲线：阴影三角形 △OAB 面积' : '图(4) 异号：△OAB';
      return `<g ${!isZoom ? 'style="cursor:pointer;" onclick="window.advanceSimStep(4)"' : ''}>
        <rect x="${x0}" y="${y0}" width="${w}" height="${h}" rx="8" fill="#ffffff" stroke="${isActive ? '#059669' : '#cbd5e1'}" stroke-width="${isActive ? 2.4 : 1}"/>
        ${svgTextHalo1(x0 + w / 2, y0 + Math.max(14, 16 * kScale), titleTxt, { size: Math.round(11.5 * Math.max(0.88, Math.min(1.25, kScale))), italic: false, color: isActive ? '#059669' : '#1e293b' })}
        <polygon points="${bx},${ay} ${ax},${ay} ${ox},${oy}" fill="rgba(16,185,129,0.34)" stroke="#059669" stroke-width="1.6"/>
        ${svgAxes1(ox, oy, x0 + 10 * kScale, x0 + w - 10 * kScale, y0 + 24 * kScale, y0 + h - 10 * kScale)}
        <polyline fill="none" stroke="#0f172a" stroke-width="1.8" points="${sampleHyperbola1(3.2, 0.85, 3.6, ox, oy, sc, 30)}"/>
        <polyline fill="none" stroke="#64748b" stroke-width="1.8" points="${sampleHyperbola1(-2.4, -3.6, -0.7, ox, oy, sc, 30)}"/>
        <circle cx="${bx}" cy="${ay}" r="${ptR}" fill="#0f172a"/>
        <circle cx="${cx}" cy="${cy}" r="${ptR}" fill="#0f172a"/>
        <circle cx="${ax}" cy="${ay}" r="${ptR}" fill="#0f172a"/>
        ${svgTextHalo1(bx - 8 * kScale, ay - 4 * kScale, 'B', { size: lblFs })}
        ${svgTextHalo1(cx + 7 * kScale, cy - 5 * kScale, 'C', { size: lblFs })}
        ${svgTextHalo1(ax + 8 * kScale, ay - 4 * kScale, 'A', { size: lblFs })}
        ${isZoom ? `
          ${window.svgFoLabel(ox - 3.65 * sc, oy - 3.05 * sc, 90, 44, '<span style="color:#475569;font-size:13px;"><i class="m">y</i><span class="num">=</span><span class="fraction"><span><i class="m">k</i><sub><span class="num">2</span></sub></span><span><i class="m">x</i></span></span></span>')}
          ${window.svgFoLabel(ox + 2.25 * sc, oy - 1.38 * sc, 90, 44, '<span style="color:#0f172a;font-size:13px;"><i class="m">y</i><span class="num">=</span><span class="fraction"><span><i class="m">k</i><sub><span class="num">1</span></sub></span><span><i class="m">x</i></span></span></span>')}
        ` : ''}
        ${showAns ? window.svgFoLabel(x0 + (isZoom ? 220 : 16 * kScale), y0 + (isZoom ? 38 : 20 * kScale), isZoom ? 200 : w - 32 * kScale, isZoom ? 48 : 32 * kScale, `<span style="color:#059669;font-size:${isZoom ? 15 : 10.5}px;"><i class="m">S</i><span class="num">=</span><span class="fraction"><span><span class="num">1</span></span><span><span class="num">2</span></span></span><span class="num">(|</span><i class="m">k</i><sub><span class="num">1</span></sub><span class="num">|+|</span><i class="m">k</i><sub><span class="num">2</span></sub><span class="num">|)</span></span>`) : ''}
      </g>`;
    }
    function cell5(x0, y0, w, h) {
      const kScale = w / 432;
      const isZoom = kScale > 0.7;
      const ox = x0 + Math.round(52 * kScale), oy = y0 + h - Math.round(38 * kScale), sc = 56 * kScale;
      const k1 = 6.0, k2 = 2.4;
      const xB = 3.2, yB = k1 / xB;
      const xF = k2 / yB;
      const yD = k2 / xB;
      const bx = ox + xB * sc, by = oy - yB * sc;
      const fx = ox + xF * sc, fy = by;
      const dx = bx, dy = oy - yD * sc;
      const cx = ox, cy = by, ax = bx, ay = oy;
      const showBDF = step >= 7;
      const showODF = step >= 8;
      const ptR = isZoom ? 4.2 : 2.4;
      const lblFs = isZoom ? 15 : 10.5;
      const titleTxt = isZoom ? '图(5) 拓展②：双曲线矩形内接 △BDF 与 △ODF' : '图(5) 拓展：△BDF与△ODF';
      return `<g ${!isZoom ? 'style="cursor:pointer;" onclick="window.advanceSimStep(7)"' : ''}>
        <rect x="${x0}" y="${y0}" width="${w}" height="${h}" rx="8" fill="#ffffff" stroke="${step >= 7 ? '#2563eb' : '#cbd5e1'}" stroke-width="${step >= 7 ? 2.2 : 1}"/>
        ${svgTextHalo1(x0 + w / 2, y0 + (isZoom ? 22 : 14), titleTxt, { size: isZoom ? 14 : 10.5, italic: false, color: '#1e293b' })}
        <rect x="${ox}" y="${by}" width="${bx - ox}" height="${oy - by}" fill="rgba(241,245,249,0.7)" stroke="#94a3b8" stroke-dasharray="4,3"/>
        <polygon points="${bx},${by} ${dx},${dy} ${fx},${fy}" fill="${showBDF ? 'rgba(59,130,246,0.38)' : 'rgba(59,130,246,0.18)'}" stroke="#1d4ed8" stroke-width="${step === 7 ? 2.8 : 1.5}"/>
        <polygon points="${ox},${oy} ${dx},${dy} ${fx},${fy}" fill="${showODF ? 'rgba(245,158,11,0.38)' : 'rgba(245,158,11,0.22)'}" stroke="#d97706" stroke-width="${step === 8 ? 2.8 : 1.5}"/>
        ${svgAxes1(ox, oy, x0 + 22 * kScale, x0 + w - 20 * kScale, y0 + (isZoom ? 34 : 22), y0 + h - 14 * kScale)}
        <polyline fill="none" stroke="#0f172a" stroke-width="${isZoom ? 2.4 : 1.6}" points="${sampleHyperbola1(k1, 1.35, 4.5, ox, oy, sc, 40)}"/>
        <polyline fill="none" stroke="#dc2626" stroke-width="${isZoom ? 2.2 : 1.5}" points="${sampleHyperbola1(k2, 0.58, 4.5, ox, oy, sc, 40)}"/>
        <circle cx="${bx}" cy="${by}" r="${ptR}" fill="#0f172a"/>
        <circle cx="${dx}" cy="${dy}" r="${ptR}" fill="#dc2626"/>
        <circle cx="${fx}" cy="${fy}" r="${ptR}" fill="#dc2626"/>
        <circle cx="${cx}" cy="${cy}" r="${ptR * 0.85}" fill="#0f172a"/>
        <circle cx="${ax}" cy="${ay}" r="${ptR * 0.85}" fill="#0f172a"/>
        ${svgTextHalo1(bx + 12 * kScale, by - 6 * kScale, 'B', { size: lblFs })}
        ${svgTextHalo1(dx + 13 * kScale, dy + 4 * kScale, 'D', { size: lblFs, color: '#dc2626' })}
        ${svgTextHalo1(fx - 4 * kScale, fy - 9 * kScale, 'F', { size: lblFs, color: '#dc2626' })}
        ${svgTextHalo1(cx - 13 * kScale, cy + 5 * kScale, 'C', { size: lblFs })}
        ${svgTextHalo1(ax, ay + 16 * kScale, 'A', { size: lblFs })}
        ${isZoom && showBDF ? window.svgFoCard(x0 + w - 222, y0 + 36, 210, showODF ? 114 : 74, `
          <div style="color:#be185d;font-size:12.5px;"><span class="fraction"><span><i class="m">BF</i></span><span><i class="m">CB</i></span></span><span class="num"> = </span><span class="fraction"><span><i class="m">BD</i></span><span><i class="m">AB</i></span></span><span class="num"> = </span><span class="fraction"><span><i class="m">k</i><sub><span class="num">1</span></sub><span class="num">-</span><i class="m">k</i><sub><span class="num">2</span></sub></span><span><i class="m">k</i><sub><span class="num">1</span></sub></span></span></div>
          <div style="color:#1d4ed8;font-size:12.5px;"><i class="m">S</i><sub><span class="num">△</span><i class="m">BDF</i></sub><span class="num"> = </span><span class="fraction"><span><span class="num">(</span><i class="m">k</i><sub><span class="num">1</span></sub><span class="num">-</span><i class="m">k</i><sub><span class="num">2</span></sub><span class="num">)</span><sup><span class="num">2</span></sup></span><span><span class="num">2</span><i class="m">k</i><sub><span class="num">1</span></sub></span></span></div>
          ${showODF ? `
            <div style="color:#b45309;font-size:12.5px;"><i class="m">S</i><sub><span class="num">△</span><i class="m">ODF</i></sub><span class="num"> = </span><span class="fraction"><span><i class="m">k</i><sub><span class="num">1</span></sub><sup><span class="num">2</span></sup><span class="num">-</span><i class="m">k</i><sub><span class="num">2</span></sub><sup><span class="num">2</span></sup></span><span><span class="num">2</span><i class="m">k</i><sub><span class="num">1</span></sub></span></span></div>
          ` : ''}
        `, 'background:rgba(255,255,255,0.95);border-color:#cbd5e1;') : ''}
      </g>`;
    }

    if (mode === 0) {
      scene.innerHTML = `<svg viewBox="0 0 480 360" style="width:100%;height:100%;max-height:100%;display:block;">
        ${cell1(6, 8, 150, 166)}
        ${cell2(165, 8, 150, 166)}
        ${cell3(324, 8, 150, 166)}
        ${cell4(42, 184, 188, 166)}
        ${cell5(250, 184, 188, 166)}
      </svg>`;
    } else {
      const fn = [null, cell1, cell2, cell3, cell4, cell5][mode];
      scene.innerHTML = `<svg viewBox="0 0 480 360" style="width:100%;height:100%;max-height:100%;display:block;">
        ${fn(24, 12, 432, 336)}
      </svg>`;
    }
  },

  explore4Sim(state, isInit) {
    if (isInit) {
      state.step = 0;
      clearManualOverrides(state);
    }
    const root = activeRoot();
    const step = Number(state.step || 0);
    const controls = root.querySelector('#controls');
    if (controls) {
      controls.innerHTML = stepBar(step, 3);
    }
    const scene = root.querySelector('#scene');
    if (!scene) return;

    function symCell(idx, x0, y0, w, h) {
      const ox = x0 + w / 2, oy = y0 + h / 2 + 6, sc = 20, k = 2.0;
      const xA = 1.35, yA = k / xA;
      const ax = ox + xA * sc, ay = oy - yA * sc;
      const cx = ox - xA * sc, cy = oy + yA * sc;
      let poly = '', lbl = '', extraMarks = '';
      if (idx === 1) {
        poly = `<polygon points="${ax},${ay} ${ax},${oy} ${cx},${cy}" fill="rgba(59,130,246,0.28)" stroke="#1d4ed8" stroke-width="1.6"/>`;
        lbl = step >= 2 ? '① S△ABC = |k|' : '图(1) (AB⊥x轴)';
        extraMarks = `<polyline points="${ax - 6},${oy} ${ax - 6},${oy - 6} ${ax},${oy - 6}" fill="none" stroke="#1d4ed8" stroke-width="1.2"/>
          <circle cx="${ax}" cy="${oy}" r="2.6" fill="#1d4ed8"/>
          ${svgTextHalo1(ax + 6, oy + 13, 'B', { size: 11.5, color: '#1d4ed8' })}`;
      } else if (idx === 2) {
        poly = `<polygon points="${ax},${ay} ${ox},${ay} ${cx},${cy}" fill="rgba(59,130,246,0.28)" stroke="#1d4ed8" stroke-width="1.6"/>`;
        lbl = step >= 2 ? '② S△ABC = |k|' : '图(2) (AB⊥y轴)';
        extraMarks = `<polyline points="${ox},${ay + 6} ${ox + 6},${ay + 6} ${ox + 6},${ay}" fill="none" stroke="#1d4ed8" stroke-width="1.2"/>
          <circle cx="${ox}" cy="${ay}" r="2.6" fill="#1d4ed8"/>
          ${svgTextHalo1(ox - 10, ay - 3, 'B', { size: 11.5, color: '#1d4ed8' })}`;
      } else if (idx === 3) {
        const d = 1.6 * sc;
        poly = `<polygon points="${ax},${ay} ${ox + d},${oy} ${cx},${cy} ${ox - d},${oy}" fill="rgba(16,185,129,0.28)" stroke="#059669" stroke-width="1.6"/>`;
        lbl = step >= 3 ? '③ S▱ = 2|k|' : '图(3) (OC=OD)';
        extraMarks = `<circle cx="${ox + d}" cy="${oy}" r="2.6" fill="#059669"/>
          <circle cx="${ox - d}" cy="${oy}" r="2.6" fill="#059669"/>
          ${svgTextHalo1(ox + d + 5, oy + 13, 'C', { size: 11.5, color: '#059669' })}
          ${svgTextHalo1(ox - d - 7, oy - 5, 'D', { size: 11.5, color: '#059669' })}`;
      } else {
        const d = 1.5 * sc;
        poly = `<polygon points="${ax},${ay} ${ox},${oy + d} ${cx},${cy} ${ox},${oy - d}" fill="rgba(16,185,129,0.28)" stroke="#059669" stroke-width="1.6"/>`;
        lbl = step >= 3 ? '④ S▱ = 2|k|' : '图(4) (OE=OF)';
        extraMarks = `<circle cx="${ox}" cy="${oy + d}" r="2.6" fill="#059669"/>
          <circle cx="${ox}" cy="${oy - d}" r="2.6" fill="#059669"/>
          ${svgTextHalo1(ox + 10, oy + d + 4, 'E', { size: 11.5, color: '#059669' })}
          ${svgTextHalo1(ox - 10, oy - d + 3, 'F', { size: 11.5, color: '#059669' })}`;
      }
      return `<g>
        <rect x="${x0}" y="${y0}" width="${w}" height="${h}" rx="8" fill="#ffffff" stroke="#cbd5e1"/>
        ${svgTextHalo1(x0 + w / 2, y0 + 18, lbl, { size: 12, italic: false, color: idx <= 2 ? '#1d4ed8' : '#059669' })}
        ${poly}
        ${svgAxes1(ox, oy, x0 + 12, x0 + w - 12, y0 + 26, y0 + h - 10)}
        ${extraMarks}
        <polyline fill="none" stroke="#9333ea" stroke-width="1.8" points="${sampleHyperbola1(k, 0.65, 3.2, ox, oy, sc, 25)}"/>
        <polyline fill="none" stroke="#9333ea" stroke-width="1.8" points="${sampleHyperbola1(k, -3.2, -0.65, ox, oy, sc, 25)}"/>
        <line x1="${ax}" y1="${ay}" x2="${cx}" y2="${cy}" stroke="#dc2626" stroke-width="1.5"/>
        <circle cx="${ax}" cy="${ay}" r="3" fill="#dc2626"/>
        <circle cx="${cx}" cy="${cy}" r="3" fill="#dc2626"/>
        ${svgTextHalo1(ax + 10, ay - 4, 'A', { size: 12 })}
        ${svgTextHalo1(cx - 10, cy + 12, idx <= 2 ? 'C' : 'B', { size: 12 })}
      </g>`;
    }

    scene.innerHTML = `<svg viewBox="0 0 480 360" style="width:100%;height:100%;max-height:100%;display:block;">
      ${symCell(1, 10, 8, 224, 166)}
      ${symCell(2, 246, 8, 224, 166)}
      ${symCell(3, 10, 184, 224, 166)}
      ${symCell(4, 246, 184, 224, 166)}
    </svg>`;
  },

  explore5Sim(state, isInit) {
    if (isInit) {
      state.step = 0;
      state.methodMode = 1;
      clearManualOverrides(state);
    }
    const root = activeRoot();
    const step = Number(state.step || 0);
    if (!isManualOverride(state, 'methodMode')) {
      state.methodMode = step === 2 ? 2 : (step === 3 ? 3 : 1);
    }
    const mode = Number(state.methodMode || 1);
    const hasManualMode = isManualOverride(state, 'methodMode');
    const controls = root.querySelector('#controls');
    if (controls) {
      controls.innerHTML = stepBar(step, 3) + modeButtons('methodMode', mode, [
        [1, '方法一：分割法', 1],
        [2, '方法二：梯形法(★核心)', 2],
        [3, '方法三：补形法', 3]
      ]);
    }
    const scene = root.querySelector('#scene');
    if (!scene) return;
    const ox = 85, oy = 290, scale = 58;
    const ax = ox + 1 * scale, ay = oy - 3 * scale;
    const bx = ox + 3 * scale, by = oy - 1 * scale;
    const cx = ox, cy = oy - 4 * scale;
    const dx = ox + 4 * scale, dy = oy;
    const ex = ax, ey = oy, fx = bx, fy = oy;
    const mx = ax, my = oy - (1 / 3) * scale;

    const c3x = ox, c3y = ay;
    const d3x = bx, d3y = ay;

    scene.innerHTML = `<svg viewBox="0 0 480 360" style="width:100%;height:100%;max-height:100%;display:block;">
      ${mode === 1 && (step >= 1 || hasManualMode) ? `<polygon points="${ox},${oy} ${cx},${cy} ${dx},${dy}" fill="rgba(250,204,21,0.22)" stroke="#ca8a04" stroke-dasharray="4,3"/>` : ''}
      ${mode === 2 && (step >= 2 || hasManualMode) ? `<polygon points="${ax},${ay} ${bx},${by} ${fx},${fy} ${ex},${ey}" fill="rgba(16,185,129,0.32)" stroke="#059669" stroke-width="2"/>` : ''}
      ${mode === 3 ? `<g>
        <polygon points="${ox},${oy} ${ax},${ay} ${c3x},${c3y}" fill="rgba(16,185,129,0.20)" stroke="none"/>
        <polygon points="${ox},${oy} ${bx},${by} ${fx},${fy}" fill="rgba(16,185,129,0.20)" stroke="none"/>
        <polygon points="${ax},${ay} ${bx},${by} ${d3x},${d3y}" fill="rgba(249,115,22,0.28)" stroke="none"/>
        <rect x="${ox}" y="${ay}" width="${bx - ox}" height="${oy - ay}" fill="none" stroke="#ea580c" stroke-width="2" stroke-dasharray="5,4"/>
        <polyline points="${ox},${ay + 9} ${ox + 9},${ay + 9} ${ox + 9},${ay}" fill="none" stroke="#475569" stroke-width="1.5"/>
        <polyline points="${fx},${oy - 9} ${fx + 9},${oy - 9} ${fx + 9},${oy}" fill="none" stroke="#475569" stroke-width="1.5"/>
        <polyline points="${d3x - 9},${d3y} ${d3x - 9},${d3y + 9} ${d3x},${d3y + 9}" fill="none" stroke="#ea580c" stroke-width="1.5"/>
      </g>` : ''}
      <polygon points="${ox},${oy} ${ax},${ay} ${bx},${by}" fill="rgba(59,130,246,0.32)" stroke="#1d4ed8" stroke-width="2.2"/>
      ${mode === 2 ? `<g stroke="#1d4ed8" stroke-width="1.6" stroke-dasharray="4,4">
        <line x1="${ax}" y1="${ay}" x2="${ex}" y2="${ey}"/>
        <line x1="${bx}" y1="${by}" x2="${fx}" y2="${fy}"/>
        <circle cx="${mx}" cy="${my}" r="3.5" fill="#dc2626"/>
        ${svgTextHalo1(mx - 12, my - 4, 'M', { size: 13, color: '#dc2626' })}
        ${svgTextHalo1(ex, ey + 20, 'E', { size: 14 })}
        ${svgTextHalo1(fx, fy + 20, 'F', { size: 14 })}
      </g>` : ''}
      ${svgAxes1(ox, oy, 30, 440, 20, 330)}
      <polyline fill="none" stroke="#1e293b" stroke-width="2.4" points="${sampleHyperbola1(3.0, 0.68, 4.8, ox, oy, scale)}"/>
      ${mode !== 3
        ? `<line x1="${ox - 18}" y1="${cy - 18}" x2="${dx + 24}" y2="${dy + 24}" stroke="#334155" stroke-width="2"/>`
        : `<line x1="${ax}" y1="${ay}" x2="${bx}" y2="${by}" stroke="#334155" stroke-width="2.2"/>`}
      <circle cx="${ax}" cy="${ay}" r="4.5" fill="#dc2626"/>
      <circle cx="${bx}" cy="${by}" r="4.5" fill="#dc2626"/>
      ${svgTextHalo1(ax + 10, ay - 10, 'A')}
      ${svgTextHalo1(bx + 14, by - 4, 'B')}
      ${mode !== 3 ? `<g>
        <circle cx="${cx}" cy="${cy}" r="4" fill="#dc2626"/>
        <circle cx="${dx}" cy="${dy}" r="4" fill="#dc2626"/>
        ${svgTextHalo1(cx - 14, cy + 5, 'C')}
        ${svgTextHalo1(dx + 6, dy + 20, 'D')}
      </g>` : `<g>
        <circle cx="${c3x}" cy="${c3y}" r="4" fill="#ea580c"/>
        <circle cx="${d3x}" cy="${d3y}" r="4" fill="#ea580c"/>
        <circle cx="${fx}" cy="${fy}" r="4" fill="#ea580c"/>
        ${svgTextHalo1(c3x - 15, c3y + 5, 'C', { color: '#ea580c' })}
        ${svgTextHalo1(d3x + 14, d3y + 4, 'D', { color: '#ea580c' })}
        ${svgTextHalo1(fx, fy + 20, 'F', { color: '#ea580c' })}
      </g>`}
      ${mode === 1 && step >= 1 ? svgTextHalo1(315, 75, 'S△AOB = S△COD - S△AOC - S△BOD', { size: 14, italic: false, color: '#b45309' }) : ''}
      ${mode === 2 && step >= 2 ? svgTextHalo1(315, 75, '★ S△AOB = S直角梯形AEFB', { size: 15, italic: false, color: '#059669' }) : ''}
      ${mode === 3 && step >= 3 ? svgTextHalo1(315, 75, 'S△AOB = S矩形COFD - |k| - S△ABD', { size: 14, italic: false, color: '#ea580c' }) : ''}
    </svg>`;
  }
});

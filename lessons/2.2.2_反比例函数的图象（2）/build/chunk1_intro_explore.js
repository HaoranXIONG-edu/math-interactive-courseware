// ==================== Chunk 1: 封面、情境引入与新知探究 (Slides 1 - 6) ====================
window.UNIT1_THEOREM_SLIDES = window.UNIT1_THEOREM_SLIDES || [];
window.UNIT1_SIMS = window.UNIT1_SIMS || {};
window.SLIDES_CHUNK1 = window.UNIT1_THEOREM_SLIDES;
window.SIMS_CHUNK1 = window.UNIT1_SIMS;
window.SLIDES_CHUNK = window.UNIT1_THEOREM_SLIDES;
window.SIMS_CHUNK = window.UNIT1_SIMS;
window.COURSEWARE_BRAND = '反比例函数';
window.COURSEWARE_TITLE = '2.2.2 反比例函数图象(2)';
window.COURSEWARE_PHASES = [
  ['① 情境引入', '图象特征回顾激活'],
  ['② 新知探究', '增减性与k的几何意义'],
  ['③ 新知应用', '第1—6题典例精析'],
  ['④ 分层训练', '训练1—2与课堂小结']
];

// 注入补充样式：确保 <em> 与 .frac (.num / .den) 及笔记卡片严格符合数学排版规范
if (typeof document !== 'undefined' && document.head && !document.getElementById('chunk1-math-style')) {
  const st = document.createElement('style');
  st.id = 'chunk1-math-style';
  st.textContent = `
    .slide em, #slideTitle em, #tocList em {
      font-family: 'Times New Roman', Times, serif !important;
      font-style: italic !important;
      font-weight: inherit;
      padding: 0 1px;
    }
    .frac {
      display: inline-flex !important;
      vertical-align: middle !important;
      flex-direction: column !important;
      align-items: center !important;
      text-align: center !important;
      line-height: 1.05 !important;
      margin: 0 0.12em !important;
      font-family: 'Times New Roman', Times, serif !important;
      font-style: normal !important;
      font-size: 0.88em !important;
    }
    .frac > .num {
      border-bottom: 1.8px solid currentColor !important;
      padding: 0 0.22em 1px !important;
      font-family: 'Times New Roman', Times, serif !important;
      font-style: normal !important;
      display: block !important;
      width: 100% !important;
    }
    .frac > .den {
      padding: 1px 0.22em 0 !important;
      font-family: 'Times New Roman', Times, serif !important;
      font-style: normal !important;
      display: block !important;
      width: 100% !important;
    }
    .note-card {
      background: #f8fafc;
      border: 1.5px solid #cbd5e1;
      border-left: 4px solid #2563eb;
      border-radius: 10px;
      padding: 8px 12px;
      margin-bottom: 8px;
      font-size: 21px;
      line-height: 1.45;
      color: #1e293b;
    }
    .note-card p {
      font-size: 21px !important;
      line-height: 1.45 !important;
      margin: 2px 0 0 !important;
    }
    .blank-pill {
      display: inline-block;
      min-width: 72px;
      padding: 0 8px;
      margin: 0 3px;
      border-bottom: 2.5px solid #2563eb;
      text-align: center;
      font-weight: 700;
      color: #1d4ed8;
      background: #eff6ff;
      border-radius: 4px 4px 0 0;
      transition: all 0.2s;
    }
    .blank-pill.revealed {
      background: #dcfce7;
      border-bottom-color: #16a34a;
      color: #15803d;
    }
  `;
  document.head.appendChild(st);
}

// SVG 2D 叠置分式辅助生成器：严禁在 SVG 内使用 "/" 拼凑分式
function svgStackedFrac(x, y, numText, denText, color = '#1d4ed8', signText = '', lhsText = 'y') {
  const hasSign = Boolean(signText);
  const eqText = lhsText ? `<tspan font-style="italic">${lhsText}</tspan> = ${signText}` : signText;
  const fracCx = lhsText ? (hasSign ? 56 : 38) : (hasSign ? 26 : 12);
  const lineHalf = Math.max(9, Math.max(String(numText).length, String(denText).length) * 5.5);
  const denIsVar = /^[a-zA-Z]$/.test(String(denText).trim());
  const numIsVar = /^[a-zA-Z]$/.test(String(numText).trim());
  return `
    <g transform="translate(${x}, ${y})">
      <text x="0" y="0" font-family="'Times New Roman', serif" font-size="17" font-weight="700" fill="${color}" stroke="#ffffff" stroke-width="4" paint-order="stroke">${eqText}</text>
      <text x="${fracCx}" y="-7" font-family="'Times New Roman', serif" font-style="${numIsVar ? 'italic' : 'normal'}" font-size="15.5" font-weight="700" fill="${color}" text-anchor="middle" stroke="#ffffff" stroke-width="3.5" paint-order="stroke">${numText}</text>
      <line x1="${fracCx - lineHalf}" y1="-4" x2="${fracCx + lineHalf}" y2="-4" stroke="${color}" stroke-width="2"/>
      <text x="${fracCx}" y="11" font-family="'Times New Roman', serif" font-style="${denIsVar ? 'italic' : 'normal'}" font-size="15.5" font-weight="700" fill="${color}" text-anchor="middle" stroke="#ffffff" stroke-width="3.5" paint-order="stroke">${denText}</text>
    </g>
  `;
}

function syncChunk1StepDOM(root, state, maxStep) {
  const step = Number(state.step || 0);
  root.querySelectorAll('.step-item[data-step]').forEach(el => {
    const req = Number(el.dataset.step || 1);
    const idx = req - 1;
    const isManual = Boolean(state.manualNotes && state.manualNotes[idx]);
    if (isManual || step >= req) {
      el.classList.remove('step-locked');
      el.classList.toggle('step-active', step === req || isManual);
    } else {
      el.classList.add('step-locked');
      el.classList.remove('step-active');
    }
  });
  root.querySelectorAll('.blank-pill[data-unlock-step]').forEach(el => {
    const req = Number(el.dataset.unlockStep || maxStep);
    if (step >= req) {
      el.innerHTML = el.dataset.ans || '';
      el.classList.add('revealed');
    } else {
      el.innerHTML = '____';
      el.classList.remove('revealed');
    }
  });
}

window.UNIT1_THEOREM_SLIDES.push(
  // ==================== Slide 1: Cover Slide ====================
  {
    id: 'cover',
    type: 'cover',
    cover: true,
    lesson: 1,
    phase: 0,
    navTag: '课题导览',
    section: '课题导览',
    tag: '课题导览',
    title: '<span class="num">2.2.2</span> 反比例函数的图象（<span class="num">2</span>）',
    sim: null,
    simId: null,
    html: `
      <div class="two" style="height:640px;align-items:center;gap:38px;">
        <div>
          <div class="big-number"><span class="num">2.2.2</span></div>
          <h1>反比例函数的图象（<span class="num">2</span>）</h1>
          <p class="subtitle">北师大版九年级数学上册 · 交互式动态精讲课件（教师演示版）</p>
          <div style="margin-top:16px;padding:10px 16px;background:#f0fdfa;border:1.5px solid #5eead4;border-left:5px solid #0d9488;border-radius:10px;font-size:20px;color:#0f766e;font-weight:700;">
            核心素养：反比例函数的增减性 · 每一象限限定辨析 · <em>k</em>的几何意义（矩形与三角形面积不变量）
          </div>
          <div style="background:#f8fafc;border:1.5px solid #cbd5e1;border-radius:14px;padding:18px 20px;margin-top:22px;">
            <div style="font-size:20px;font-weight:700;color:#334155;margin-bottom:12px;">本节课四阶学习路线图：</div>
            <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;text-align:center;">
              <div style="background:#eff6ff;border:1.5px solid #93c5fd;border-radius:10px;padding:12px 8px;">
                <div style="font-size:18px;font-weight:700;color:#1e3a8a;"><span class="num">01</span> 情境引入</div>
                <div style="font-size:15px;color:#475569;margin-top:4px;">观察<em>k</em><span class="num">&gt;0</span>特征</div>
              </div>
              <div style="background:#f0fdfa;border:1.5px solid #5eead4;border-radius:10px;padding:12px 8px;">
                <div style="font-size:18px;font-weight:700;color:#0f766e;"><span class="num">02</span> 新知探究</div>
                <div style="font-size:15px;color:#475569;margin-top:4px;">增减性与<em>k</em>的意义</div>
              </div>
              <div style="background:#fef3c7;border:1.5px solid #fcd34d;border-radius:10px;padding:12px 8px;">
                <div style="font-size:18px;font-weight:700;color:#b45309;"><span class="num">03</span> 新知应用</div>
                <div style="font-size:15px;color:#475569;margin-top:4px;">典例精析与模型</div>
              </div>
              <div style="background:#fdf2f8;border:1.5px solid #f9a8d4;border-radius:10px;padding:12px 8px;">
                <div style="font-size:18px;font-weight:700;color:#be185d;"><span class="num">04</span> 分层训练</div>
                <div style="font-size:15px;color:#475569;margin-top:4px;">综合迁移与总结</div>
              </div>
            </div>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:20px;">
          <div style="background:#ffffff;border:2px solid #cbd5e1;border-top:6px solid #1e3a8a;border-radius:14px;padding:24px 28px;box-shadow:0 8px 24px rgba(15,23,42,0.06);">
            <div style="font-size:24px;font-weight:700;color:#1e3a8a;margin-bottom:14px;display:flex;align-items:center;gap:10px;">
              <span style="display:inline-block;width:10px;height:24px;background:#0d9488;border-radius:4px;"></span>【学习目标】
            </div>
            <div style="font-size:21px;line-height:1.68;color:#1e293b;margin-bottom:14px;">
              <span class="num" style="font-weight:700;color:#1e3a8a;">1.</span>经历观察、归纳、交流的过程，逐步提高从函数图象中获取信息的能力，探索反比例函数的主要性质；
            </div>
            <div style="font-size:21px;line-height:1.68;color:#1e293b;">
              <span class="num" style="font-weight:700;color:#1e3a8a;">2.</span>理解反比例函数<em>k</em>的几何意义，掌握由反比例函数图象上的点构成的矩形、三角形面积的计算与探究。（<b style="color:#b4222c;">重难点</b>）
            </div>
          </div>
          <div style="background:#ffffff;border:1.5px solid #cbd5e1;border-left:5px solid #0d9488;border-radius:14px;padding:18px 24px;">
            <div style="font-size:20px;font-weight:700;color:#0f766e;margin-bottom:8px;">【核心探究主线】</div>
            <div style="font-size:19px;line-height:1.6;color:#334155;">
              • <b>数形结合探增减</b>：对比<em>k</em><span class="num">&gt;0</span>与<em>k</em><span class="num">&lt;0</span>时双曲线所在象限及“在每一象限内”<em>y</em>随<em>x</em>的变化规律；<br>
              • <b>以形助数悟面积</b>：由<em>xy</em><span class="num">=</span><em>k</em>推导<em>S</em><sub>矩形<em>AOBQ</em></sub><span class="num">=|</span><em>k</em><span class="num">|</span>与<em>S</em><sub><span class="num">&triangle;</span><em>QAO</em></sub><span class="num">=</span><span class="frac"><span class="num">1</span><span class="den">2</span></span><span class="num">|</span><em>k</em><span class="num">|</span>。
            </div>
          </div>
        </div>
      </div>
    `
  },

  // ==================== Slide 2: 一、情境引入 (intro-k-pos, Layout B) ====================
  {
    id: 'intro-k-pos',
    lesson: 1,
    phase: 0,
    section: '一、情境引入',
    tag: '一、情境引入',
    navTag: '情境·观察k>0特征',
    title: '观察 <em>k</em> &gt; 0 时的函数图象特征',
    cover: false,
    layout: 'layout-b',
    sim: 'introKPosSim',
    simId: 'introKPosSim',
    maxStep: 3,
    html: `
      <div class="screen-page lab-visible">
        <div class="screen-stem" style="padding:8px 16px;">
          <p>观察反比例函数<em>y</em><span class="num">=</span><span class="frac"><span class="num">2</span><span class="den"><em>x</em></span></span>，<em>y</em><span class="num">=</span><span class="frac"><span class="num">4</span><span class="den"><em>x</em></span></span>，<em>y</em><span class="num">=</span><span class="frac"><span class="num">6</span><span class="den"><em>x</em></span></span>的形式，它们有什么共同点？函数图象有什么共同特征？<br>
          （<span class="num">1</span>）函数图象分别位于哪几个象限内？　（<span class="num">2</span>）在每一个象限内，随着<em>x</em>值的增大，<em>y</em>的值怎样变化？能说明这是为什么吗？　（<span class="num">3</span>）反比例函数的图象可能与<em>x</em>轴相交吗？可能与<em>y</em>轴相交吗？为什么？</p>
        </div>
        <div class="screen-lower layout-b">
          <div class="screen-notes">
            <div id="controls" class="controls"></div>
            <div class="step step-item step-locked" data-step="1">
              <b>01</b>
              <span><b>（<span class="num">1</span>）所在象限与共同点：</b>三个函数的比例系数<em>k</em><span class="num">=2, 4, 6</span>均满足<b><em>k</em><span class="num">&gt;0</span></b>；它们的图象都是由两支曲线组成的双曲线，且两支曲线均分别位于<b>第一、三象限</b>内。</span>
            </div>
            <div class="step step-item step-locked" data-step="2">
              <b>02</b>
              <span><b>（<span class="num">2</span>）同一象限内的增减性：</b>在<b>每一个象限内</b>，随着<em>x</em>值的增大，<em>y</em>的值逐渐<b>减小</b>（曲线从左向右呈下降趋势）。代数解释：当<em>x</em><sub><span class="num">2</span></sub><span class="num">&gt;</span><em>x</em><sub><span class="num">1</span></sub><span class="num">&gt;0</span>（或<span class="num">0&gt;</span><em>x</em><sub><span class="num">2</span></sub><span class="num">&gt;</span><em>x</em><sub><span class="num">1</span></sub>）时，<em>y</em><sub><span class="num">2</span></sub><span class="num">−</span><em>y</em><sub><span class="num">1</span></sub><span class="num">=</span><span class="frac"><span class="num"><em>k</em></span><span class="den"><em>x</em><sub><span class="num">2</span></sub></span></span><span class="num">−</span><span class="frac"><span class="num"><em>k</em></span><span class="den"><em>x</em><sub><span class="num">1</span></sub></span></span><span class="num">=</span><span class="frac"><span class="num"><em>k</em>(<em>x</em><sub><span class="num">1</span></sub><span class="num">−</span><em>x</em><sub><span class="num">2</span></sub>)</span><span class="den"><em>x</em><sub><span class="num">1</span></sub><em>x</em><sub><span class="num">2</span></sub></span></span><span class="num">&lt;0</span>，故<em>y</em><sub><span class="num">2</span></sub><span class="num">&lt;</span><em>y</em><sub><span class="num">1</span></sub>。</span>
            </div>
            <div class="step step-item step-locked" data-step="3">
              <b>03</b>
              <span><b>（<span class="num">3</span>）渐近线特征（与坐标轴不相交）：</b>图象<b>不可能</b>与<em>x</em>轴相交，也<b>不可能</b>与<em>y</em>轴相交。因为分母<em>x</em><span class="num">&ne;0</span>，所以图象与<em>y</em>轴无交点；又因为分子<em>k</em><span class="num">&ne;0</span>，故<em>y</em><span class="num">=</span><span class="frac"><span class="num"><em>k</em></span><span class="den"><em>x</em></span></span><span class="num">&ne;0</span>，所以图象与<em>x</em>轴也无交点，只会无限靠近坐标轴。</span>
            </div>
          </div>
          <div class="screen-media">
            <div class="screen-lab">
              <div id="scene" class="visual"></div>
            </div>
          </div>
        </div>
      </div>
    `
  },

  // ==================== Slide 3: 二、新知探究 · 问题1 (explore-q1, Layout B) ====================
  {
    id: 'explore-q1',
    lesson: 1,
    phase: 1,
    section: '二、新知探究',
    tag: '二、新知探究 · 问题1',
    navTag: '问题1·k<0与性质归纳',
    title: '探究 <em>k</em> &lt; 0 时的图象特征与性质归纳',
    cover: false,
    layout: 'layout-b',
    sim: 'exploreQ1Sim',
    simId: 'exploreQ1Sim',
    maxStep: 4,
    html: `
      <div class="screen-page lab-visible">
        <div class="screen-stem" style="padding:8px 16px;">
          <p><b>问题<span class="num">1</span>：</b>考察当<em>k</em><span class="num">=−2, −4, −6</span>时，反比例函数<em>y</em><span class="num">=</span><span class="frac"><span class="num"><em>k</em></span><span class="den"><em>x</em></span></span>的图象，它们有哪些共同特征？<br>
          <b>【归纳】</b>反比例函数<em>y</em><span class="num">=</span><span class="frac"><span class="num"><em>k</em></span><span class="den"><em>x</em></span></span>（<em>k</em>为常数，<em>k</em><span class="num">&ne;0</span>）的图象是由<span class="blank-pill" data-unlock-step="3" data-ans="两支曲线">____</span>组成的：当<em>k</em><span class="num">&gt;0</span>时，两支曲线分别位于第<span class="blank-pill" data-unlock-step="3" data-ans="一、三">____</span>象限内，在每一象限内，<em>y</em>的值随<em>x</em>值的增大而<span class="blank-pill" data-unlock-step="3" data-ans="减小">____</span>；当<em>k</em><span class="num">&lt;0</span>时，两支曲线分别位于第<span class="blank-pill" data-unlock-step="3" data-ans="二、四">____</span>象限内，在每一象限内，<em>y</em>的值随<em>x</em>值的增大而<span class="blank-pill" data-unlock-step="3" data-ans="增大">____</span>。</p>
        </div>
        <div class="screen-lower layout-b">
          <div class="screen-notes">
            <div id="controls" class="controls"></div>
            <div class="step step-item step-locked" data-step="1">
              <b>01</b>
              <span><b>步骤<span class="num">1</span>（观察<em>k</em><span class="num">&lt;0</span>的所在象限）：</b>当<em>k</em><span class="num">=−2, −4, −6&lt;0</span>时，<em>x</em>与<em>y</em>异号，三个函数的两支曲线均分别位于<b>第二、四象限</b>内。</span>
            </div>
            <div class="step step-item step-locked" data-step="2">
              <b>02</b>
              <span><b>步骤<span class="num">2</span>（观察<em>k</em><span class="num">&lt;0</span>的增减变化）：</b>在第二或第四象限的<b>每一个象限内</b>，曲线从左向右呈上升趋势，即随着<em>x</em>值的增大，<em>y</em>的值逐渐<b>增大</b>。</span>
            </div>
            <div class="step step-item step-locked" data-step="3">
              <b>03</b>
              <span><b>步骤<span class="num">3</span>（完成性质归纳填空）：</b>反比例函数<em>y</em><span class="num">=</span><span class="frac"><span class="num"><em>k</em></span><span class="den"><em>x</em></span></span>（<em>k</em><span class="num">&ne;0</span>）的图象是由<b>两支曲线</b>组成的：<b>① 当<em>k</em><span class="num">&gt;0</span>时</b>，位于第<b>一、三</b>象限内，在每一象限内，<em>y</em>随<em>x</em>的增大而<b>减小</b>；<b>② 当<em>k</em><span class="num">&lt;0</span>时</b>，位于第<b>二、四</b>象限内，在每一象限内，<em>y</em>随<em>x</em>的增大而<b>增大</b>。</span>
            </div>
            <div class="step step-item step-locked" data-step="4">
              <b>04</b>
              <span><b>步骤<span class="num">4</span>（对比总结）：</b><em>k</em>的正负决定双曲线所在的象限与同一象限内的增减趋势；<span class="num">|</span><em>k</em><span class="num">|</span>越大，双曲线离坐标原点越远。</span>
            </div>
          </div>
          <div class="screen-media">
            <div class="screen-lab">
              <div id="scene" class="visual"></div>
            </div>
          </div>
        </div>
      </div>
    `
  },

  // ==================== Slide 4: 二、新知探究 · 追问1 (explore-f1, Layout B) ====================
  {
    id: 'explore-f1',
    lesson: 1,
    phase: 1,
    section: '二、新知探究',
    tag: '二、新知探究 · 追问1',
    navTag: '追问1·每一象限辨析',
    title: '追问1：能否删去“在每一象限内”？',
    cover: false,
    layout: 'layout-b',
    sim: 'exploreF1Sim',
    simId: 'exploreF1Sim',
    maxStep: 3,
    html: `
      <div class="screen-page lab-visible">
        <div class="screen-stem" style="padding:8px 16px;">
          <div style="background:#f0fdfa;border:1.5px solid #5eead4;border-left:5px solid #0d9488;border-radius:8px;padding:5px 12px;margin-bottom:6px;font-size:20px;color:#0f766e;">
            <b>【关联前问总结】</b>由问题<span class="num">1</span>归纳可知：反比例函数的增减性必须以<b>“在每一象限内”</b>为前提（当<em>k</em><span class="num">&gt;0</span>时在每一象限内<em>y</em>随<em>x</em>的增大而减小；当<em>k</em><span class="num">&lt;0</span>时在每一象限内<em>y</em>随<em>x</em>的增大而增大）。
          </div>
          <p><b>追问<span class="num">1</span>：</b>如果把“<b>在每一象限内</b>”删去，上面的结论还成立吗？为什么？请举例说明。</p>
        </div>
        <div class="screen-lower layout-b">
          <div class="screen-notes">
            <div id="controls" class="controls"></div>
            <div class="step step-item step-locked" data-step="1">
              <b>01</b>
              <span><b>步骤<span class="num">1</span>（明确结论）：</b><b>不成立！</b>反比例函数的两支曲线被坐标轴<em>x</em><span class="num">=0</span>断开，分处两个不同的象限，跨象限时<em>y</em>的正负号直接发生突变，不能统称单调递增或递减。</span>
            </div>
            <div class="step step-item step-locked" data-step="2">
              <b>02</b>
              <span><b>步骤<span class="num">2</span>（反例验证：以<em>y</em><span class="num">=</span><span class="frac"><span class="num">4</span><span class="den"><em>x</em></span></span>为例）：</b>在<em>y</em><span class="num">=</span><span class="frac"><span class="num">4</span><span class="den"><em>x</em></span></span>（<em>k</em><span class="num">=4&gt;0</span>）上取第三象限的点<em>A</em><span class="num">(−2, −2)</span>和第一象限的点<em>B</em><span class="num">(1, 4)</span>。虽然自变量满足<span class="num">−2&lt;1</span>（<em>x</em>增大），但函数值却是<span class="num">−2&lt;4</span>（<em>y</em>反而增大），违反了“<em>y</em>随<em>x</em>增大而减小”。</span>
            </div>
            <div class="step step-item step-locked" data-step="3">
              <b>03</b>
              <span><b>步骤<span class="num">3</span>（核心防坑准则）：</b>比较反比例函数上两点的函数值大小时，必须<b>先判象限、再看增减</b>——同象限用增减性，跨象限直接比正负（正数永远大于负数）！</span>
            </div>
          </div>
          <div class="screen-media">
            <div class="screen-lab">
              <div id="scene" class="visual"></div>
            </div>
          </div>
        </div>
      </div>
    `
  },

  // ==================== Slide 5: 二、新知探究 · 追问2 (explore-f2, Layout B) ====================
  {
    id: 'explore-f2',
    lesson: 1,
    phase: 1,
    section: '二、新知探究',
    tag: '二、新知探究 · 追问2',
    navTag: '追问2·矩形面积S₁与S₂',
    title: '追问2：垂线构造矩形面积 <em>S</em><sub>1</sub> 与 <em>S</em><sub>2</sub> 的关系',
    cover: false,
    layout: 'layout-b',
    sim: 'exploreF2Sim',
    simId: 'exploreF2Sim',
    maxStep: 3,
    html: `
      <div class="screen-page lab-visible">
        <div class="screen-stem" style="padding:8px 16px;">
          <div style="background:#f0fdfa;border:1.5px solid #5eead4;border-left:5px solid #0d9488;border-radius:8px;padding:5px 12px;margin-bottom:6px;font-size:20px;color:#0f766e;">
            <b>【关联前问总结】</b>由反比例函数表达式<em>y</em><span class="num">=</span><span class="frac"><span class="num"><em>k</em></span><span class="den"><em>x</em></span></span>变形可得横、纵坐标之积<em>x</em><span class="num">&middot;</span><em>y</em><span class="num">=</span><em>k</em>（非零定值），这一代数恒等式对应着双曲线上点与坐标轴围成的几何图形面积。
          </div>
          <p><b>追问<span class="num">2</span>：</b>在任意一个反比例函数图象上任取两点<em>P</em>、<em>Q</em>，过点<em>P</em>分别作<em>x</em>轴、<em>y</em>轴的平行线，与坐标轴围成的矩形面积为<em>S</em><sub><span class="num">1</span></sub>；过点<em>Q</em>分别作<em>x</em>轴、<em>y</em>轴的平行线，与坐标轴围成的矩形面积为<em>S</em><sub><span class="num">2</span></sub>，<em>S</em><sub><span class="num">1</span></sub>与<em>S</em><sub><span class="num">2</span></sub>有什么关系？为什么？</p>
        </div>
        <div class="screen-lower layout-b">
          <div class="screen-notes">
            <div id="controls" class="controls"></div>
            <div class="step step-item step-locked" data-step="1">
              <b>01</b>
              <span><b>步骤<span class="num">1</span>（设点求点<em>P</em>围成的矩形面积<em>S</em><sub><span class="num">1</span></sub>）：</b>设点<em>P</em>的坐标为<span class="num">(</span><em>x</em><sub><span class="num">1</span></sub><span class="num">,</span><em>y</em><sub><span class="num">1</span></sub><span class="num">)</span>，因为点<em>P</em>在反比例函数<em>y</em><span class="num">=</span><span class="frac"><span class="num"><em>k</em></span><span class="den"><em>x</em></span></span>的图象上，所以<em>x</em><sub><span class="num">1</span></sub><em>y</em><sub><span class="num">1</span></sub><span class="num">=</span><em>k</em>。矩形的邻边长分别为点<em>P</em>到两坐标轴的距离<span class="num">|</span><em>x</em><sub><span class="num">1</span></sub><span class="num">|</span>与<span class="num">|</span><em>y</em><sub><span class="num">1</span></sub><span class="num">|</span>，故<em>S</em><sub><span class="num">1</span></sub><span class="num">=|</span><em>x</em><sub><span class="num">1</span></sub><span class="num">|&middot;|</span><em>y</em><sub><span class="num">1</span></sub><span class="num">|=|</span><em>x</em><sub><span class="num">1</span></sub><em>y</em><sub><span class="num">1</span></sub><span class="num">|=|</span><em>k</em><span class="num">|</span>。</span>
            </div>
            <div class="step step-item step-locked" data-step="2">
              <b>02</b>
              <span><b>步骤<span class="num">2</span>（设点求点<em>Q</em>围成的矩形面积<em>S</em><sub><span class="num">2</span></sub>）：</b>同理，设点<em>Q</em>的坐标为<span class="num">(</span><em>x</em><sub><span class="num">2</span></sub><span class="num">,</span><em>y</em><sub><span class="num">2</span></sub><span class="num">)</span>，则<em>x</em><sub><span class="num">2</span></sub><em>y</em><sub><span class="num">2</span></sub><span class="num">=</span><em>k</em>，点<em>Q</em>与坐标轴围成的矩形面积<em>S</em><sub><span class="num">2</span></sub><span class="num">=|</span><em>x</em><sub><span class="num">2</span></sub><span class="num">|&middot;|</span><em>y</em><sub><span class="num">2</span></sub><span class="num">|=|</span><em>x</em><sub><span class="num">2</span></sub><em>y</em><sub><span class="num">2</span></sub><span class="num">|=|</span><em>k</em><span class="num">|</span>。</span>
            </div>
            <div class="step step-item step-locked" data-step="3">
              <b>03</b>
              <span><b>步骤<span class="num">3</span>（得出结论）：</b>因此<b><em>S</em><sub><span class="num">1</span></sub><span class="num">=</span><em>S</em><sub><span class="num">2</span></sub><span class="num">=|</span><em>k</em><span class="num">|</span></b>！无论点<em>P</em>、<em>Q</em>在双曲线上如何移动（也无论在同一分支还是不同分支），过该点作两坐标轴的垂线所围成的矩形面积恒相等，且都等于<span class="num">|</span><em>k</em><span class="num">|</span>。</span>
            </div>
          </div>
          <div class="screen-media">
            <div class="screen-lab">
              <div id="scene" class="visual"></div>
            </div>
          </div>
        </div>
      </div>
    `
  },

  // ==================== Slide 6: 二、新知探究 · 核心归纳 (explore-k-geom, Layout B) ====================
  {
    id: 'explore-k-geom',
    lesson: 1,
    phase: 1,
    section: '二、新知探究',
    tag: '二、新知探究 · 核心归纳',
    navTag: '核心归纳·k的几何意义',
    title: '反比例函数中 <em>k</em> 的几何意义',
    cover: false,
    layout: 'layout-b',
    sim: 'exploreKGeomSim',
    simId: 'exploreKGeomSim',
    maxStep: 3,
    html: `
      <div class="screen-page lab-visible">
        <div class="screen-stem" style="padding:8px 16px;">
          <p><b>【反比例函数中<em>k</em>的几何意义】</b>过双曲线<em>y</em><span class="num">=</span><span class="frac"><span class="num"><em>k</em></span><span class="den"><em>x</em></span></span>（<em>k</em><span class="num">&ne;0</span>）上任意一点<em>Q</em>作<em>x</em>轴、<em>y</em>轴的垂线，垂足分别为<em>A</em>、<em>B</em>，则所得矩形<em>AOBQ</em>的面积为<em>S</em><sub>矩形<em>AOBQ</em></sub><span class="num">=</span><span class="blank-pill" data-unlock-step="1" data-ans="<span class='num'>|</span><em>k</em><span class='num'>|</span>">____</span>；连接<em>OQ</em>，则<em>S</em><sub><span class="num">&triangle;</span><em>QAO</em></sub><span class="num">=</span><em>S</em><sub><span class="num">&triangle;</span><em>QBO</em></sub><span class="num">=</span><span class="blank-pill" data-unlock-step="2" data-ans="<span class='frac'><span class='num'>1</span><span class='den'>2</span></span><span class='num'>|</span><em>k</em><span class='num'>|</span>">____</span>。</p>
        </div>
        <div class="screen-lower layout-b">
          <div class="screen-notes">
            <div id="controls" class="controls"></div>
            <div class="step step-item step-locked" data-step="1">
              <b>01</b>
              <span><b>模型一（双垂线矩形模型）：</b>设点<em>Q</em><span class="num">(</span><em>x</em><span class="num">,</span><em>y</em><span class="num">)</span>在双曲线<em>y</em><span class="num">=</span><span class="frac"><span class="num"><em>k</em></span><span class="den"><em>x</em></span></span>上，则<em>OB</em><span class="num">=|</span><em>x</em><span class="num">|</span>，<em>OA</em><span class="num">=|</span><em>y</em><span class="num">|</span>。故矩形<em>AOBQ</em>的面积为：<em>S</em><sub>矩形<em>AOBQ</em></sub><span class="num">=</span><em>OA</em><span class="num">&middot;</span><em>OB</em><span class="num">=|</span><em>x</em><span class="num">|&middot;|</span><em>y</em><span class="num">|=|</span><em>xy</em><span class="num">|=|</span><em>k</em><span class="num">|</span>。</span>
            </div>
            <div class="step step-item step-locked" data-step="2">
              <b>02</b>
              <span><b>模型二（单垂线直角三角形模型）：</b>连接原点<em>O</em>与点<em>Q</em>，对角线<em>OQ</em>将矩形<em>AOBQ</em>平分为两个全等的直角三角形<span class="num">&triangle;</span><em>QAO</em>和<span class="num">&triangle;</span><em>QBO</em>，因此：<em>S</em><sub><span class="num">&triangle;</span><em>QAO</em></sub><span class="num">=</span><em>S</em><sub><span class="num">&triangle;</span><em>QBO</em></sub><span class="num">=</span><span class="frac"><span class="num">1</span><span class="den">2</span></span><em>S</em><sub>矩形<em>AOBQ</em></sub><span class="num">=</span><span class="frac"><span class="num">1</span><span class="den">2</span></span><span class="num">|</span><em>k</em><span class="num">|</span>。</span>
            </div>
            <div class="step step-item step-locked" data-step="3">
              <b>03</b>
              <span><b>步骤<span class="num">3</span>（逆向求<em>k</em>的易错点提示）：</b>已知矩形或直角三角形面积反求<em>k</em>时，先由面积求出<span class="num">|</span><em>k</em><span class="num">|</span>，再<b>务必根据双曲线所在象限判断<em>k</em>的正负号</b>（一、三象限<em>k</em><span class="num">&gt;0</span>，二、四象限<em>k</em><span class="num">&lt;0</span>）！</span>
            </div>
          </div>
          <div class="screen-media">
            <div class="screen-lab">
              <div id="scene" class="visual"></div>
            </div>
          </div>
        </div>
      </div>
    `
  }
);

Object.assign(window.UNIT1_SIMS, {
  // ==================== Sim 1: introKPosSim (Slide 2: 观察 k > 0 时的三个函数图象) ====================
  introKPosSim: function(state, isInit) {
    if (isInit) {
      state.step = 0;
      state.action = 'm0';
      state.x0 = 1.6;
      clearManualOverrides(state);
    }
    const root = activeRoot();
    const step = Number(state.step || 0);
    const mode = state.action || 'm0';
    const x0 = Number(state.x0 !== undefined ? state.x0 : 1.6);

    const controls = root.querySelector('#controls');
    if (controls) {
      controls.innerHTML =
        stepBar(step, 3) +
        actions([
          ['m0', '三线同屏对比'],
          ['m1', '聚焦 <em>y</em>=<span class="frac"><span class="num">2</span><span class="den"><em>x</em></span></span>'],
          ['m2', '聚焦 <em>y</em>=<span class="frac"><span class="num">4</span><span class="den"><em>x</em></span></span>'],
          ['m3', '聚焦 <em>y</em>=<span class="frac"><span class="num">6</span><span class="den"><em>x</em></span></span>']
        ], mode) +
        slider('x0', '动点横坐标 <em>x</em><sub>0</sub>', 0.8, 4.2, x0, 0.2, '');
    }

    syncChunk1StepDOM(root, state, 3);

    const scene = root.querySelector('#scene');
    if (!scene) return;

    // 坐标系映射: viewBox="0 0 520 430"
    // 上方：3个并列学案原图缩略窗 (y = 2/x, y = 4/x, y = 6/x)，高 112px
    // 下方：高清叠加主坐标网格 (y in [124, 420])，中心 (260, 272)，scale = 23px/unit
    const ox = 260, oy = 272, sc = 23;
    const cx = x => (ox + sc * x).toFixed(1);
    const cy = y => (oy - sc * y).toFixed(1);

    const buildBranch = (kVal, tMin, tMax) => {
      const q1 = [], q3 = [];
      for (let t = tMin; t <= tMax; t += 0.08) {
        const yv = kVal / t;
        if (Math.abs(yv) <= 6.1) {
          q1.push(`${cx(t)},${cy(yv)}`);
          q3.push(`${cx(-t)},${cy(-yv)}`);
        }
      }
      return { q1: q1.join(' '), q3: q3.join(' ') };
    };

    const c2 = buildBranch(2, 0.34, 8.8);
    const c4 = buildBranch(4, 0.66, 8.8);
    const c6 = buildBranch(6, 0.99, 8.8);

    const activeK = mode === 'm1' ? 2 : (mode === 'm3' ? 6 : 4);
    const activeColor = mode === 'm1' ? '#2563eb' : (mode === 'm3' ? '#0d9488' : '#dc2626');
    const op2 = (mode === 'm0' || mode === 'm1') ? 1 : 0.22;
    const op4 = (mode === 'm0' || mode === 'm2') ? 1 : 0.22;
    const op6 = (mode === 'm0' || mode === 'm3') ? 1 : 0.22;

    let grid = '';
    for (let i = -8; i <= 8; i++) {
      if (i === 0) continue;
      const gx = ox + sc * i;
      grid += `<line x1="${gx.toFixed(1)}" y1="130" x2="${gx.toFixed(1)}" y2="414" stroke="${i % 2 === 0 ? '#cbd5e1' : '#e2e8f0'}" stroke-width="${i % 2 === 0 ? '1.1' : '0.7'}"/>`;
      if (i % 2 === 0) {
        const ty = i < 0 ? (oy - 7) : (oy + 16);
        grid += `<text x="${gx.toFixed(1)}" y="${ty}" text-anchor="middle" font-family="'Times New Roman', serif" font-size="12.5" fill="#475569" stroke="#ffffff" stroke-width="3.5" paint-order="stroke">${i < 0 ? '−' + Math.abs(i) : i}</text>`;
      }
    }
    for (let j = -6; j <= 6; j++) {
      if (j === 0) continue;
      const gy = oy - sc * j;
      grid += `<line x1="62" y1="${gy.toFixed(1)}" x2="458" y2="${gy.toFixed(1)}" stroke="${j % 2 === 0 ? '#cbd5e1' : '#e2e8f0'}" stroke-width="${j % 2 === 0 ? '1.1' : '0.7'}"/>`;
      if (j % 2 === 0) {
        const tx = j > 0 ? (ox - 7) : (ox + 7);
        const anc = j > 0 ? 'end' : 'start';
        grid += `<text x="${tx}" y="${gy + 4}" text-anchor="${anc}" font-family="'Times New Roman', serif" font-size="12.5" fill="#475569" stroke="#ffffff" stroke-width="3.5" paint-order="stroke">${j < 0 ? '−' + Math.abs(j) : j}</text>`;
      }
    }

    // 动点 P1(x0, y1) 与同象限右侧点 P2(x0 + 1.2, y2)
    const x1 = Math.max(0.8, Math.min(4.2, x0));
    const y1 = activeK / x1;
    const x2 = Math.min(5.6, x1 + 1.3);
    const y2 = activeK / x2;

    // 顶部三小图生成器
    const miniCard = (idx, kVal, col, isFoc) => {
      const mx = 12 + idx * 168;
      const mox = mx + 80, moy = 62, msc = 8.2;
      const p1 = [], p3 = [];
      for (let t = Math.max(0.4, kVal / 4.8); t <= 5.2; t += 0.15) {
        p1.push(`${(mox + msc * t).toFixed(1)},${(moy - msc * (kVal / t)).toFixed(1)}`);
        p3.push(`${(mox - msc * t).toFixed(1)},${(moy + msc * (kVal / t)).toFixed(1)}`);
      }
      return `
        <g>
          <rect x="${mx}" y="8" width="160" height="108" rx="8" fill="${isFoc ? '#f8fafc' : '#ffffff'}" stroke="${isFoc ? col : '#cbd5e1'}" stroke-width="${isFoc ? '2.2' : '1.3'}"/>
          <line x1="${mx + 12}" y1="${moy}" x2="${mx + 140}" y2="${moy}" stroke="#475569" stroke-width="1.4"/>
          <line x1="${mox}" y1="108" x2="${mox}" y2="16" stroke="#475569" stroke-width="1.4"/>
          <text x="${mx + 144}" y="${moy + 4}" font-family="'Times New Roman', serif" font-style="italic" font-size="12.5" font-weight="700" fill="#334155">x</text>
          <text x="${mox + 6}" y="23" font-family="'Times New Roman', serif" font-style="italic" font-size="12.5" font-weight="700" fill="#334155">y</text>
          <polyline points="${p1.join(' ')}" fill="none" stroke="${col}" stroke-width="2.4" stroke-linecap="round"/>
          <polyline points="${p3.join(' ')}" fill="none" stroke="${col}" stroke-width="2.4" stroke-linecap="round"/>
          ${svgStackedFrac(mx + 14, 36, String(kVal), 'x', col, '', 'y')}
        </g>
      `;
    };

    scene.innerHTML = `
      <svg viewBox="0 0 520 430" style="width:100%;height:100%;max-height:100%;display:block;" aria-label="观察k>0时的三个反比例函数图象">
        <defs>
          <marker id="arrAxisKPos" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 1.5 L 8.5 5 L 0 8.5 z" fill="#1e293b"/>
          </marker>
          <marker id="arrIncX" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 1.5 L 8.5 5 L 0 8.5 z" fill="#0d9488"/>
          </marker>
          <marker id="arrDecY" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 1.5 L 8.5 5 L 0 8.5 z" fill="#dc2626"/>
          </marker>
        </defs>

        <!-- 顶部学案三图并列展示 -->
        ${miniCard(0, 2, '#2563eb', mode === 'm0' || mode === 'm1')}
        ${miniCard(1, 4, '#dc2626', mode === 'm0' || mode === 'm2')}
        ${miniCard(2, 6, '#0d9488', mode === 'm0' || mode === 'm3')}

        <!-- 下方主坐标系背景 -->
        <rect x="12" y="122" width="496" height="300" rx="10" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>

        ${step >= 1 ? `
          <!-- 步骤1：高亮第一、三象限背景色块与标签 -->
          <rect x="${ox}" y="130" width="198" height="142" fill="#eff6ff" opacity="0.55"/>
          <rect x="62" y="${oy}" width="198" height="142" fill="#eff6ff" opacity="0.55"/>
          <rect x="372" y="136" width="124" height="24" rx="6" fill="#dbeafe" stroke="#60a5fa" stroke-width="1.2"/>
          <text x="434" y="153" text-anchor="middle" font-family="'SimSun', serif" font-size="13.5" font-weight="700" fill="#1e3a8a">第一象限 (+, +)</text>
          <rect x="24" y="388" width="124" height="24" rx="6" fill="#dbeafe" stroke="#60a5fa" stroke-width="1.2"/>
          <text x="86" y="405" text-anchor="middle" font-family="'SimSun', serif" font-size="13.5" font-weight="700" fill="#1e3a8a">第三象限 (−, −)</text>
        ` : ''}

        ${grid}

        <!-- 坐标轴 -->
        <line x1="52" y1="${oy}" x2="472" y2="${oy}" stroke="#1e293b" stroke-width="2.2" marker-end="url(#arrAxisKPos)"/>
        <line x1="${ox}" y1="418" x2="${ox}" y2="128" stroke="#1e293b" stroke-width="2.2" marker-end="url(#arrAxisKPos)"/>
        <text x="478" y="${oy + 5}" font-family="'Times New Roman', serif" font-style="italic" font-size="17" font-weight="700" fill="#1e293b">x</text>
        <text x="${ox + 8}" y="138" font-family="'Times New Roman', serif" font-style="italic" font-size="17" font-weight="700" fill="#1e293b">y</text>
        <text x="${ox - 14}" y="${oy + 16}" font-family="'Times New Roman', serif" font-style="italic" font-size="15" font-weight="700" fill="#1e293b">O</text>

        ${step >= 3 ? `
          <!-- 步骤3：高亮渐近线（坐标轴 x=0, y=0 永不相交） -->
          <line x1="56" y1="${oy}" x2="466" y2="${oy}" stroke="#f59e0b" stroke-width="4" stroke-dasharray="7,5" opacity="0.85"/>
          <line x1="${ox}" y1="414" x2="${ox}" y2="132" stroke="#f59e0b" stroke-width="4" stroke-dasharray="7,5" opacity="0.85"/>
          <rect x="22" y="138" width="166" height="44" rx="7" fill="#fffbeb" stroke="#f59e0b" stroke-width="1.5"/>
          <text x="105" y="156" text-anchor="middle" font-family="'SimSun', serif" font-size="13" font-weight="700" fill="#b45309"><tspan font-family="'Times New Roman', serif" font-style="italic">x</tspan>≠0 ⇒ 不与<tspan font-family="'Times New Roman', serif" font-style="italic">y</tspan>轴相交</text>
          <text x="105" y="175" text-anchor="middle" font-family="'SimSun', serif" font-size="13" font-weight="700" fill="#b45309"><tspan font-family="'Times New Roman', serif" font-style="italic">y</tspan>≠0 ⇒ 不与<tspan font-family="'Times New Roman', serif" font-style="italic">x</tspan>轴相交</text>
        ` : ''}

        <!-- 三条双曲线 -->
        <polyline points="${c2.q1}" fill="none" stroke="#2563eb" stroke-width="2.8" opacity="${op2}" stroke-linecap="round"/>
        <polyline points="${c2.q3}" fill="none" stroke="#2563eb" stroke-width="2.8" opacity="${op2}" stroke-linecap="round"/>
        <polyline points="${c4.q1}" fill="none" stroke="#dc2626" stroke-width="3.2" opacity="${op4}" stroke-linecap="round"/>
        <polyline points="${c4.q3}" fill="none" stroke="#dc2626" stroke-width="3.2" opacity="${op4}" stroke-linecap="round"/>
        <polyline points="${c6.q1}" fill="none" stroke="#0d9488" stroke-width="2.8" opacity="${op6}" stroke-linecap="round"/>
        <polyline points="${c6.q3}" fill="none" stroke="#0d9488" stroke-width="2.8" opacity="${op6}" stroke-linecap="round"/>

        <!-- 动点 P(x0, y0) -->
        <line x1="${cx(x1)}" y1="${oy}" x2="${cx(x1)}" y2="${cy(y1)}" stroke="${activeColor}" stroke-width="1.5" stroke-dasharray="4,3"/>
        <line x1="${ox}" y1="${cy(y1)}" x2="${cx(x1)}" y2="${cy(y1)}" stroke="${activeColor}" stroke-width="1.5" stroke-dasharray="4,3"/>
        <circle cx="${cx(x1)}" cy="${cy(y1)}" r="5.5" fill="${activeColor}" stroke="#ffffff" stroke-width="1.8"/>
        <text x="${Number(cx(x1)) + 8}" y="${Number(cy(y1)) - 8}" font-family="'Times New Roman', serif" font-size="14" font-weight="700" fill="${activeColor}" stroke="#ffffff" stroke-width="3.5" paint-order="stroke"><tspan font-style="italic">P</tspan>(${x1.toFixed(1)}, ${y1.toFixed(2)})</text>

        ${step >= 2 ? `
          <!-- 步骤2：同一象限内增减性动态箭头 (x增大 -> y减小) -->
          <circle cx="${cx(x2)}" cy="${cy(y2)}" r="5" fill="#0f766e" stroke="#ffffff" stroke-width="1.6"/>
          <line x1="${cx(x1)}" y1="${cy(y1)}" x2="${cx(x2)}" y2="${cy(y1)}" stroke="#0d9488" stroke-width="2.4" marker-end="url(#arrIncX)"/>
          <line x1="${cx(x2)}" y1="${cy(y1)}" x2="${cx(x2)}" y2="${cy(y2)}" stroke="#dc2626" stroke-width="2.4" marker-end="url(#arrDecY)"/>
          <text x="${((Number(cx(x1)) + Number(cx(x2))) / 2).toFixed(1)}" y="${Number(cy(y1)) - 7}" text-anchor="middle" font-family="'SimSun', serif" font-size="13" font-weight="700" fill="#0f766e" stroke="#ffffff" stroke-width="3" paint-order="stroke"><tspan font-family="'Times New Roman', serif" font-style="italic">x</tspan>增大</text>
          <text x="${Number(cx(x2)) + 26}" y="${((Number(cy(y1)) + Number(cy(y2))) / 2 + 4).toFixed(1)}" text-anchor="middle" font-family="'SimSun', serif" font-size="13" font-weight="700" fill="#dc2626" stroke="#ffffff" stroke-width="3" paint-order="stroke"><tspan font-family="'Times New Roman', serif" font-style="italic">y</tspan>减小</text>
        ` : ''}
      </svg>
    `;
  },

  // ==================== Sim 2: exploreQ1Sim (Slide 3: 探究 k < 0 时的图象特征与性质归纳) ====================
  exploreQ1Sim: function(state, isInit) {
    if (isInit) {
      state.step = 0;
      state.action = 'm0';
      state.x0 = -2.4;
      clearManualOverrides(state);
    }
    const root = activeRoot();
    const step = Number(state.step || 0);
    const mode = state.action || 'm0';
    const x0 = Number(state.x0 !== undefined ? state.x0 : -2.4);

    const controls = root.querySelector('#controls');
    if (controls) {
      controls.innerHTML =
        stepBar(step, 4) +
        actions([
          ['m0', '观察 <em>k</em>=−2, −4, −6'],
          ['m1', '聚焦 <em>y</em>=−<span class="frac"><span class="num">4</span><span class="den"><em>x</em></span></span> 增减性'],
          ['m2', '<em>k</em>&gt;0 与 <em>k</em>&lt;0 对比']
        ], mode) +
        slider('x0', '第二象限动点 <em>x</em><sub>0</sub>', -4.5, -1.0, x0, 0.25, '');
    }

    syncChunk1StepDOM(root, state, 4);

    const scene = root.querySelector('#scene');
    if (!scene) return;

    const ox = 260, oy = 272, sc = 23;
    const cx = x => (ox + sc * x).toFixed(1);
    const cy = y => (oy - sc * y).toFixed(1);

    const buildNegBranch = (absK, tMin) => {
      const q2 = [], q4 = [];
      for (let t = tMin; t <= 8.8; t += 0.08) {
        const yv = absK / t;
        if (yv <= 6.1) {
          q2.push(`${cx(-t)},${cy(yv)}`);
          q4.push(`${cx(t)},${cy(-yv)}`);
        }
      }
      return { q2: q2.join(' '), q4: q4.join(' ') };
    };

    const n2 = buildNegBranch(2, 0.34);
    const n4 = buildNegBranch(4, 0.66);
    const n6 = buildNegBranch(6, 0.99);

    const p4Q1 = [], p4Q3 = [];
    for (let t = 0.66; t <= 8.8; t += 0.08) {
      const yv = 4 / t;
      if (yv <= 6.1) {
        p4Q1.push(`${cx(t)},${cy(yv)}`);
        p4Q3.push(`${cx(-t)},${cy(-yv)}`);
      }
    }

    let grid = '';
    for (let i = -8; i <= 8; i++) {
      if (i === 0) continue;
      const gx = ox + sc * i;
      grid += `<line x1="${gx.toFixed(1)}" y1="130" x2="${gx.toFixed(1)}" y2="414" stroke="${i % 2 === 0 ? '#cbd5e1' : '#e2e8f0'}" stroke-width="${i % 2 === 0 ? '1.1' : '0.7'}"/>`;
      if (i % 2 === 0) {
        const ty = i < 0 ? (oy + 16) : (oy - 7);
        grid += `<text x="${gx.toFixed(1)}" y="${ty}" text-anchor="middle" font-family="'Times New Roman', serif" font-size="12.5" fill="#475569" stroke="#ffffff" stroke-width="3.5" paint-order="stroke">${i < 0 ? '−' + Math.abs(i) : i}</text>`;
      }
    }
    for (let j = -6; j <= 6; j++) {
      if (j === 0) continue;
      const gy = oy - sc * j;
      grid += `<line x1="62" y1="${gy.toFixed(1)}" x2="458" y2="${gy.toFixed(1)}" stroke="${j % 2 === 0 ? '#cbd5e1' : '#e2e8f0'}" stroke-width="${j % 2 === 0 ? '1.1' : '0.7'}"/>`;
      if (j % 2 === 0) {
        const tx = j > 0 ? (ox + 7) : (ox - 7);
        const anc = j > 0 ? 'start' : 'end';
        grid += `<text x="${tx}" y="${gy + 4}" text-anchor="${anc}" font-family="'Times New Roman', serif" font-size="12.5" fill="#475569" stroke="#ffffff" stroke-width="3.5" paint-order="stroke">${j < 0 ? '−' + Math.abs(j) : j}</text>`;
      }
    }

    const x1 = Math.min(-1.0, Math.max(-4.5, x0));
    const y1 = -4 / x1;
    const x2 = Math.min(-0.75, x1 + 1.1);
    const y2 = -4 / x2;

    const miniNegCard = (idx, absK, col) => {
      const mx = 12 + idx * 168;
      const mox = mx + 80, moy = 62, msc = 8.2;
      const p2 = [], p4 = [];
      for (let t = Math.max(0.4, absK / 4.8); t <= 5.2; t += 0.15) {
        p2.push(`${(mox - msc * t).toFixed(1)},${(moy - msc * (absK / t)).toFixed(1)}`);
        p4.push(`${(mox + msc * t).toFixed(1)},${(moy + msc * (absK / t)).toFixed(1)}`);
      }
      return `
        <g>
          <rect x="${mx}" y="8" width="160" height="108" rx="8" fill="#ffffff" stroke="${col}" stroke-width="1.8"/>
          <line x1="${mx + 12}" y1="${moy}" x2="${mx + 140}" y2="${moy}" stroke="#475569" stroke-width="1.4"/>
          <line x1="${mox}" y1="108" x2="${mox}" y2="16" stroke="#475569" stroke-width="1.4"/>
          <text x="${mx + 144}" y="${moy + 4}" font-family="'Times New Roman', serif" font-style="italic" font-size="12.5" font-weight="700" fill="#334155">x</text>
          <text x="${mox - 6}" y="23" text-anchor="end" font-family="'Times New Roman', serif" font-style="italic" font-size="12.5" font-weight="700" fill="#334155">y</text>
          <polyline points="${p2.join(' ')}" fill="none" stroke="${col}" stroke-width="2.4" stroke-linecap="round"/>
          <polyline points="${p4.join(' ')}" fill="none" stroke="${col}" stroke-width="2.4" stroke-linecap="round"/>
          ${svgStackedFrac(mx + 92, 36, String(absK), 'x', col, '−', 'y')}
        </g>
      `;
    };

    const showCompare = (step >= 3 || mode === 'm2');

    scene.innerHTML = `
      <svg viewBox="0 0 520 430" style="width:100%;height:100%;max-height:100%;display:block;" aria-label="探究k&lt;0时的三个反比例函数图象与性质归纳">
        <defs>
          <marker id="arrAxisKNeg" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 1.5 L 8.5 5 L 0 8.5 z" fill="#1e293b"/>
          </marker>
          <marker id="arrUpTeal" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 1.5 L 8.5 5 L 0 8.5 z" fill="#0d9488"/>
          </marker>
          <marker id="arrRightBlue" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 1.5 L 8.5 5 L 0 8.5 z" fill="#2563eb"/>
          </marker>
        </defs>

        <!-- 顶部三图：y = -2/x, y = -4/x, y = -6/x -->
        ${miniNegCard(0, 2, '#7c3aed')}
        ${miniNegCard(1, 4, '#dc2626')}
        ${miniNegCard(2, 6, '#d97706')}

        <!-- 下方主坐标系 -->
        <rect x="12" y="122" width="496" height="300" rx="10" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>

        ${step >= 1 ? `
          <!-- 步骤1：高亮第二、四象限 -->
          <rect x="62" y="130" width="198" height="142" fill="#fef2f2" opacity="0.58"/>
          <rect x="${ox}" y="${oy}" width="198" height="142" fill="#fef2f2" opacity="0.58"/>
          <rect x="24" y="136" width="124" height="24" rx="6" fill="#fee2e2" stroke="#f87171" stroke-width="1.2"/>
          <text x="86" y="153" text-anchor="middle" font-family="'SimSun', serif" font-size="13.5" font-weight="700" fill="#991b1b">第二象限 (−, +)</text>
          <rect x="372" y="388" width="124" height="24" rx="6" fill="#fee2e2" stroke="#f87171" stroke-width="1.2"/>
          <text x="434" y="405" text-anchor="middle" font-family="'SimSun', serif" font-size="13.5" font-weight="700" fill="#991b1b">第四象限 (+, −)</text>
        ` : ''}

        ${grid}

        <line x1="52" y1="${oy}" x2="472" y2="${oy}" stroke="#1e293b" stroke-width="2.2" marker-end="url(#arrAxisKNeg)"/>
        <line x1="${ox}" y1="418" x2="${ox}" y2="128" stroke="#1e293b" stroke-width="2.2" marker-end="url(#arrAxisKNeg)"/>
        <text x="478" y="${oy + 5}" font-family="'Times New Roman', serif" font-style="italic" font-size="17" font-weight="700" fill="#1e293b">x</text>
        <text x="${ox - 14}" y="138" font-family="'Times New Roman', serif" font-style="italic" font-size="17" font-weight="700" fill="#1e293b">y</text>
        <text x="${ox - 14}" y="${oy + 16}" font-family="'Times New Roman', serif" font-style="italic" font-size="15" font-weight="700" fill="#1e293b">O</text>

        ${showCompare ? `
          <!-- 对比 y = 4/x (蓝色虚线，一、三象限下降) -->
          <polyline points="${p4Q1.join(' ')}" fill="none" stroke="#2563eb" stroke-width="2.6" stroke-dasharray="6,4" opacity="0.85"/>
          <polyline points="${p4Q3.join(' ')}" fill="none" stroke="#2563eb" stroke-width="2.6" stroke-dasharray="6,4" opacity="0.85"/>
          ${svgStackedFrac(362, 184, '4', 'x', '#1d4ed8', '', 'y')}
        ` : ''}

        <!-- k = -2, -4, -6 三支曲线 -->
        <polyline points="${n2.q2}" fill="none" stroke="#7c3aed" stroke-width="2.4" opacity="${mode === 'm1' ? '0.25' : '0.88'}" stroke-linecap="round"/>
        <polyline points="${n2.q4}" fill="none" stroke="#7c3aed" stroke-width="2.4" opacity="${mode === 'm1' ? '0.25' : '0.88'}" stroke-linecap="round"/>
        <polyline points="${n4.q2}" fill="none" stroke="#dc2626" stroke-width="3.4" stroke-linecap="round"/>
        <polyline points="${n4.q4}" fill="none" stroke="#dc2626" stroke-width="3.4" stroke-linecap="round"/>
        <polyline points="${n6.q2}" fill="none" stroke="#d97706" stroke-width="2.4" opacity="${mode === 'm1' ? '0.25' : '0.88'}" stroke-linecap="round"/>
        <polyline points="${n6.q4}" fill="none" stroke="#d97706" stroke-width="2.4" opacity="${mode === 'm1' ? '0.25' : '0.88'}" stroke-linecap="round"/>

        <!-- 动点 P(x0, y0) 在 y = -4/x 上 -->
        <line x1="${cx(x1)}" y1="${oy}" x2="${cx(x1)}" y2="${cy(y1)}" stroke="#dc2626" stroke-width="1.5" stroke-dasharray="4,3"/>
        <line x1="${ox}" y1="${cy(y1)}" x2="${cx(x1)}" y2="${cy(y1)}" stroke="#dc2626" stroke-width="1.5" stroke-dasharray="4,3"/>
        <circle cx="${cx(x1)}" cy="${cy(y1)}" r="5.5" fill="#dc2626" stroke="#ffffff" stroke-width="1.8"/>
        <text x="${Number(cx(x1)) - 8}" y="${Number(cy(y1)) - 10}" text-anchor="end" font-family="'Times New Roman', serif" font-size="14" font-weight="700" fill="#b91c1c" stroke="#ffffff" stroke-width="4" paint-order="stroke"><tspan font-style="italic">P</tspan>(${x1.toFixed(1)}, ${y1.toFixed(2)})</text>

        ${step >= 2 ? `
          <!-- 步骤2：每一象限内 x 增大 -> y 增大（曲线从左向右上升） -->
          <circle cx="${cx(x2)}" cy="${cy(y2)}" r="5" fill="#0d9488" stroke="#ffffff" stroke-width="1.6"/>
          <line x1="${cx(x1)}" y1="${cy(y1)}" x2="${cx(x2)}" y2="${cy(y1)}" stroke="#2563eb" stroke-width="2.4" marker-end="url(#arrRightBlue)"/>
          <line x1="${cx(x2)}" y1="${cy(y1)}" x2="${cx(x2)}" y2="${cy(y2)}" stroke="#0d9488" stroke-width="2.4" marker-end="url(#arrUpTeal)"/>
          <text x="${((Number(cx(x1)) + Number(cx(x2))) / 2).toFixed(1)}" y="${Number(cy(y1)) + 15}" text-anchor="middle" font-family="'SimSun', serif" font-size="13" font-weight="700" fill="#1d4ed8" stroke="#ffffff" stroke-width="3" paint-order="stroke"><tspan font-family="'Times New Roman', serif" font-style="italic">x</tspan>增大</text>
          <text x="${Number(cx(x2)) + 26}" y="${((Number(cy(y1)) + Number(cy(y2))) / 2 + 4).toFixed(1)}" text-anchor="middle" font-family="'SimSun', serif" font-size="13" font-weight="700" fill="#0f766e" stroke="#ffffff" stroke-width="3" paint-order="stroke"><tspan font-family="'Times New Roman', serif" font-style="italic">y</tspan>增大</text>
        ` : ''}

        ${step >= 4 ? `
          <!-- 步骤4：|k| 越大离原点越远提示 -->
          <rect x="284" y="346" width="212" height="32" rx="7" fill="#fffbeb" stroke="#f59e0b" stroke-width="1.5"/>
          <text x="390" y="367" text-anchor="middle" font-family="'SimSun', serif" font-size="13.5" font-weight="700" fill="#b45309">|<tspan font-family="'Times New Roman', serif" font-style="italic">k</tspan>| = 2 → 4 → 6：离原点<tspan font-family="'Times New Roman', serif" font-style="italic">O</tspan>越来越远</text>
        ` : ''}
      </svg>
    `;
  },

  // ==================== Sim 3: exploreF1Sim (Slide 4: 追问1 能否删去“在每一象限内”？) ====================
  exploreF1Sim: function(state, isInit) {
    if (isInit) {
      state.step = 0;
      state.action = 'm0';
      state.xA = -2.0;
      state.xB = 1.0;
      clearManualOverrides(state);
    }
    const root = activeRoot();
    const step = Number(state.step || 0);
    const mode = state.action || 'm0';

    if (mode === 'm1' && state.xA < 0) {
      state.xA = 1.0;
      state.xB = 4.0;
    } else if (mode === 'm0' && state.xA > 0) {
      state.xA = -2.0;
      state.xB = 1.0;
    }

    const xA = Number(state.xA !== undefined ? state.xA : -2.0);
    const xB = Number(state.xB !== undefined ? state.xB : 1.0);

    const controls = root.querySelector('#controls');
    if (controls) {
      controls.innerHTML =
        stepBar(step, 3) +
        actions([
          ['m0', '跨象限反例：<em>A</em>(−2,−2)与<em>B</em>(1,4)'],
          ['m1', '同象限对比：<em>A</em>(1,4)与<em>B</em>(4,1)']
        ], mode) +
        (mode === 'm0'
          ? slider('xA', '第三象限点 <em>x</em><sub><em>A</em></sub>', -4.0, -0.8, xA, 0.2, '') +
            slider('xB', '第一象限点 <em>x</em><sub><em>B</em></sub>', 0.8, 4.0, xB, 0.2, '')
          : slider('xA', '第一象限点 <em>x</em><sub><em>A</em></sub>', 0.8, 2.0, xA, 0.2, '') +
            slider('xB', '第一象限点 <em>x</em><sub><em>B</em></sub>', 2.2, 4.5, xB, 0.2, ''));
    }

    syncChunk1StepDOM(root, state, 3);

    const scene = root.querySelector('#scene');
    if (!scene) return;

    const ox = 250, oy = 215, sc = 28;
    const cx = x => (ox + sc * x).toFixed(1);
    const cy = y => (oy - sc * y).toFixed(1);

    const q1Pts = [], q3Pts = [];
    for (let t = 0.62; t <= 6.8; t += 0.07) {
      q1Pts.push(`${cx(t)},${cy(4 / t)}`);
      q3Pts.push(`${cx(-t)},${cy(-4 / t)}`);
    }

    let grid = '';
    for (let i = -6; i <= 6; i++) {
      if (i === 0) continue;
      const gx = ox + sc * i;
      const gy = oy - sc * i;
      grid += `<line x1="${gx}" y1="22" x2="${gx}" y2="408" stroke="${i % 2 === 0 ? '#cbd5e1' : '#e2e8f0'}" stroke-width="${i % 2 === 0 ? '1.1' : '0.75'}"/>`;
      grid += `<line x1="56" y1="${gy}" x2="444" y2="${gy}" stroke="${i % 2 === 0 ? '#cbd5e1' : '#e2e8f0'}" stroke-width="${i % 2 === 0 ? '1.1' : '0.75'}"/>`;
      if (i % 2 === 0) {
        const ty = i < 0 ? (oy - 7) : (oy + 17);
        const tx = i > 0 ? (ox - 7) : (ox + 7);
        const anc = i > 0 ? 'end' : 'start';
        grid += `<text x="${gx}" y="${ty}" text-anchor="middle" font-family="'Times New Roman', serif" font-size="13" fill="#475569" stroke="#ffffff" stroke-width="3.5" paint-order="stroke">${i < 0 ? '−' + Math.abs(i) : i}</text>`;
        grid += `<text x="${tx}" y="${gy + 4}" text-anchor="${anc}" font-family="'Times New Roman', serif" font-size="13" fill="#475569" stroke="#ffffff" stroke-width="3.5" paint-order="stroke">${i < 0 ? '−' + Math.abs(i) : i}</text>`;
      }
    }

    const yA = 4 / xA;
    const yB = 4 / xB;
    const isCross = xA * xB < 0;

    scene.innerHTML = `
      <svg viewBox="0 0 500 430" style="width:100%;height:100%;max-height:100%;display:block;" aria-label="追问1：能否删去在每一象限内反例演示">
        <defs>
          <marker id="arrAxisF1" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 1.5 L 8.5 5 L 0 8.5 z" fill="#1e293b"/>
          </marker>
        </defs>

        ${grid}

        <!-- 坐标轴 -->
        <line x1="42" y1="${oy}" x2="458" y2="${oy}" stroke="#1e293b" stroke-width="2.2" marker-end="url(#arrAxisF1)"/>
        <line x1="${ox}" y1="414" x2="${ox}" y2="16" stroke="#1e293b" stroke-width="2.2" marker-end="url(#arrAxisF1)"/>
        <text x="464" y="${oy + 5}" font-family="'Times New Roman', serif" font-style="italic" font-size="18" font-weight="700" fill="#1e293b">x</text>
        <text x="${ox + 8}" y="24" font-family="'Times New Roman', serif" font-style="italic" font-size="18" font-weight="700" fill="#1e293b">y</text>
        <text x="${ox - 15}" y="${oy + 17}" font-family="'Times New Roman', serif" font-style="italic" font-size="15" font-weight="700" fill="#1e293b">O</text>

        ${step >= 1 ? `
          <!-- 步骤1：高亮 x = 0 断开分界线 -->
          <line x1="${ox}" y1="408" x2="${ox}" y2="24" stroke="#dc2626" stroke-width="4" stroke-dasharray="7,5"/>
          <rect x="24" y="24" width="194" height="30" rx="7" fill="#fef2f2" stroke="#ef4444" stroke-width="1.5"/>
          <text x="121" y="44" text-anchor="middle" font-family="'SimSun', serif" font-size="13.5" font-weight="700" fill="#b91c1c">在 <tspan font-family="'Times New Roman', serif" font-style="italic">x</tspan>=0 处两支断开，正负突变！</text>
        ` : ''}

        <!-- 双曲线 y = 4/x -->
        <polyline points="${q1Pts.join(' ')}" fill="none" stroke="#2563eb" stroke-width="3.6" stroke-linecap="round"/>
        <polyline points="${q3Pts.join(' ')}" fill="none" stroke="#2563eb" stroke-width="3.6" stroke-linecap="round"/>
        ${svgStackedFrac(405, 130, '4', 'x', '#1d4ed8', '', 'y')}

        <!-- 点 A 与 点 B 投影虚线及坐标点 -->
        <line x1="${cx(xA)}" y1="${oy}" x2="${cx(xA)}" y2="${cy(yA)}" stroke="#dc2626" stroke-width="1.8" stroke-dasharray="4,3"/>
        <line x1="${ox}" y1="${cy(yA)}" x2="${cx(xA)}" y2="${cy(yA)}" stroke="#dc2626" stroke-width="1.8" stroke-dasharray="4,3"/>
        <line x1="${cx(xB)}" y1="${oy}" x2="${cx(xB)}" y2="${cy(yB)}" stroke="#0d9488" stroke-width="1.8" stroke-dasharray="4,3"/>
        <line x1="${ox}" y1="${cy(yB)}" x2="${cx(xB)}" y2="${cy(yB)}" stroke="#0d9488" stroke-width="1.8" stroke-dasharray="4,3"/>

        ${step >= 2 ? `
          <!-- 步骤2：连接 A、B 的割线指示跨象限/同象限变化趋势 -->
          <line x1="${cx(xA)}" y1="${cy(yA)}" x2="${cx(xB)}" y2="${cy(yB)}" stroke="${isCross ? '#dc2626' : '#16a34a'}" stroke-width="2.4" stroke-dasharray="6,4"/>
        ` : ''}

        <circle cx="${cx(xA)}" cy="${cy(yA)}" r="6" fill="#dc2626" stroke="#ffffff" stroke-width="1.8"/>
        <text x="${Number(cx(xA)) + (xA < 0 ? -8 : 8)}" y="${Number(cy(yA)) + (yA < 0 ? 18 : -8)}" text-anchor="${xA < 0 ? 'end' : 'start'}" font-family="'Times New Roman', serif" font-size="14.5" font-weight="700" fill="#b91c1c" stroke="#ffffff" stroke-width="3.5" paint-order="stroke"><tspan font-style="italic">A</tspan>(${xA.toFixed(1)}, ${yA.toFixed(1)})</text>

        <circle cx="${cx(xB)}" cy="${cy(yB)}" r="6" fill="#0d9488" stroke="#ffffff" stroke-width="1.8"/>
        <text x="${Number(cx(xB)) + 8}" y="${Number(cy(yB)) - 8}" text-anchor="start" font-family="'Times New Roman', serif" font-size="14.5" font-weight="700" fill="#0f766e" stroke="#ffffff" stroke-width="3.5" paint-order="stroke"><tspan font-style="italic">B</tspan>(${xB.toFixed(1)}, ${yB.toFixed(1)})</text>

        ${step >= 2 ? `
          <!-- 步骤2/3：右上/右下角动态比较看板 -->
          <g transform="translate(238, 304)">
            <rect x="0" y="0" width="248" height="106" rx="10" fill="${isCross ? '#fef2f2' : '#f0fdf4'}" stroke="${isCross ? '#ef4444' : '#16a34a'}" stroke-width="2"/>
            <text x="124" y="24" text-anchor="middle" font-family="'SimSun', serif" font-size="14.5" font-weight="700" fill="${isCross ? '#991b1b' : '#166534'}">${isCross ? '✗ 跨象限反例（结论不成立！）' : '✓ 同一象限内（结论成立）'}</text>
            <text x="16" y="50" font-family="'SimSun', serif" font-size="14" font-weight="700" fill="#1e293b">自变量：<tspan font-family="'Times New Roman', serif" font-style="italic">x</tspan><tspan font-size="10" dy="3">1</tspan><tspan dy="-3"> = ${xA.toFixed(1)} &lt; </tspan><tspan font-family="'Times New Roman', serif" font-style="italic">x</tspan><tspan font-size="10" dy="3">2</tspan><tspan dy="-3"> = ${xB.toFixed(1)}（增大）</tspan></text>
            <text x="16" y="75" font-family="'SimSun', serif" font-size="14" font-weight="700" fill="${isCross ? '#dc2626' : '#15803d'}">函数值：<tspan font-family="'Times New Roman', serif" font-style="italic">y</tspan><tspan font-size="10" dy="3">1</tspan><tspan dy="-3"> = ${yA.toFixed(1)} ${yA < yB ? '&lt;' : '&gt;'} </tspan><tspan font-family="'Times New Roman', serif" font-style="italic">y</tspan><tspan font-size="10" dy="3">2</tspan><tspan dy="-3"> = ${yB.toFixed(1)}（${yA < yB ? '反而增大!' : '减小'}）</tspan></text>
            <text x="16" y="96" font-family="'SimSun', serif" font-size="12.5" font-weight="700" fill="#475569">${isCross ? '原因：第三象限 y&lt;0，第一象限 y&gt;0' : '原因：同在第一象限，x增大则y减小'}</text>
          </g>
        ` : ''}
      </svg>
    `;
  },

  // ==================== Sim 4: exploreF2Sim (Slide 5: 追问2 垂线构造矩形面积 S1 与 S2 的关系) ====================
  exploreF2Sim: function(state, isInit) {
    if (isInit) {
      state.step = 0;
      state.action = 'm0';
      state.xP = -3.2;
      state.xQ = -1.2;
      clearManualOverrides(state);
    }
    const root = activeRoot();
    const step = Number(state.step || 0);
    const mode = state.action || 'm0';

    if (mode === 'm1' && state.xQ < 0) {
      state.xQ = 2.0;
    } else if (mode === 'm0' && state.xQ > 0) {
      state.xQ = -1.2;
    }

    const xP = Number(state.xP !== undefined ? state.xP : -3.2);
    const xQ = Number(state.xQ !== undefined ? state.xQ : (mode === 'm1' ? 2.0 : -1.2));

    const controls = root.querySelector('#controls');
    if (controls) {
      controls.innerHTML =
        stepBar(step, 3) +
        actions([
          ['m0', '学案原图：<em>P</em>、<em>Q</em>同在第二象限'],
          ['m1', '拓展：<em>P</em>在第二象限、<em>Q</em>在第四象限']
        ], mode) +
        slider('xP', '点 <em>P</em> 横坐标 <em>x</em><sub><em>P</em></sub>', -4.8, -0.9, xP, 0.2, '') +
        (mode === 'm0'
          ? slider('xQ', '点 <em>Q</em> 横坐标 <em>x</em><sub><em>Q</em></sub>', -4.8, -0.9, xQ, 0.2, '')
          : slider('xQ', '点 <em>Q</em> 横坐标 <em>x</em><sub><em>Q</em></sub>', 0.9, 4.8, xQ, 0.2, ''));
    }

    syncChunk1StepDOM(root, state, 3);

    const scene = root.querySelector('#scene');
    if (!scene) return;

    // 忠实还原学案 image13.png：y = -4/x (k = -4)，点 P、Q 作两坐标轴平行线围成矩形 S1、S2
    const ox = 255, oy = 215, sc = 34;
    const cx = x => (ox + sc * x).toFixed(1);
    const cy = y => (oy - sc * y).toFixed(1);

    const kVal = -4;
    const q2Pts = [], q4Pts = [];
    for (let t = 0.72; t <= 6.2; t += 0.07) {
      const yv = 4 / t;
      if (yv <= 5.5) {
        q2Pts.push(`${cx(-t)},${cy(yv)}`);
        q4Pts.push(`${cx(t)},${cy(-yv)}`);
      }
    }

    let grid = '';
    for (let i = -6; i <= 6; i++) {
      if (i === 0) continue;
      const gx = ox + sc * i;
      grid += `<line x1="${gx}" y1="20" x2="${gx}" y2="410" stroke="${i % 2 === 0 ? '#cbd5e1' : '#e2e8f0'}" stroke-width="0.9"/>`;
    }
    for (let j = -5; j <= 5; j++) {
      if (j === 0) continue;
      const gy = oy - sc * j;
      grid += `<line x1="36" y1="${gy}" x2="474" y2="${gy}" stroke="${j % 2 === 0 ? '#cbd5e1' : '#e2e8f0'}" stroke-width="0.9"/>`;
    }

    const yP = kVal / xP;
    const yQ = kVal / xQ;

    const rxP = Math.min(Number(cx(xP)), ox);
    const ryP = Math.min(Number(cy(yP)), oy);
    const rwP = Math.abs(Number(cx(xP)) - ox);
    const rhP = Math.abs(Number(cy(yP)) - oy);

    const rxQ = Math.min(Number(cx(xQ)), ox);
    const ryQ = Math.min(Number(cy(yQ)), oy);
    const rwQ = Math.abs(Number(cx(xQ)) - ox);
    const rhQ = Math.abs(Number(cy(yQ)) - oy);

    scene.innerHTML = `
      <svg viewBox="0 0 510 430" style="width:100%;height:100%;max-height:100%;display:block;" aria-label="追问2：反比例函数上任取两点P、Q构造矩形面积S1与S2">
        <defs>
          <marker id="arrAxisF2" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 1.5 L 8.5 5 L 0 8.5 z" fill="#1e293b"/>
          </marker>
        </defs>

        ${grid}

        <!-- 矩形 S1 (点 P 围成) -->
        <rect x="${rxP}" y="${ryP}" width="${rwP}" height="${rhP}" fill="#3b82f6" fill-opacity="0.24" stroke="#2563eb" stroke-width="2.2" stroke-dasharray="5,3"/>

        <!-- 矩形 S2 (点 Q 围成) -->
        <rect x="${rxQ}" y="${ryQ}" width="${rwQ}" height="${rhQ}" fill="#10b981" fill-opacity="0.24" stroke="#0d9488" stroke-width="2.2" stroke-dasharray="5,3"/>

        <!-- 坐标轴 -->
        <line x1="28" y1="${oy}" x2="482" y2="${oy}" stroke="#1e293b" stroke-width="2.3" marker-end="url(#arrAxisF2)"/>
        <line x1="${ox}" y1="414" x2="${ox}" y2="16" stroke="#1e293b" stroke-width="2.3" marker-end="url(#arrAxisF2)"/>
        <text x="488" y="${oy + 5}" font-family="'Times New Roman', serif" font-style="italic" font-size="18" font-weight="700" fill="#1e293b">x</text>
        <text x="${ox + 8}" y="24" font-family="'Times New Roman', serif" font-style="italic" font-size="18" font-weight="700" fill="#1e293b">y</text>
        <text x="${ox + 6}" y="${oy + 18}" font-family="'Times New Roman', serif" font-style="italic" font-size="16" font-weight="700" fill="#1e293b">O</text>

        <!-- 双曲线两支 -->
        <polyline points="${q2Pts.join(' ')}" fill="none" stroke="#1e293b" stroke-width="3.4" stroke-linecap="round"/>
        <polyline points="${q4Pts.join(' ')}" fill="none" stroke="#1e293b" stroke-width="3.4" stroke-linecap="round"/>

        <!-- S1 与 S2 内部标签 -->
        <text x="${(rxP + rwP / 2).toFixed(1)}" y="${(ryP + rhP / 2 + 6).toFixed(1)}" text-anchor="middle" font-family="'Times New Roman', serif" font-size="19" font-weight="700" fill="#1d4ed8" stroke="#ffffff" stroke-width="3.5" paint-order="stroke"><tspan font-style="italic">S</tspan><tspan font-size="13" dy="4">1</tspan></text>
        <text x="${(rxQ + rwQ / 2).toFixed(1)}" y="${(ryQ + rhQ / 2 + 6).toFixed(1)}" text-anchor="middle" font-family="'Times New Roman', serif" font-size="19" font-weight="700" fill="#0f766e" stroke="#ffffff" stroke-width="3.5" paint-order="stroke"><tspan font-style="italic">S</tspan><tspan font-size="13" dy="4">2</tspan></text>

        <!-- 点 P 与 点 Q -->
        <circle cx="${cx(xP)}" cy="${cy(yP)}" r="6" fill="#2563eb" stroke="#ffffff" stroke-width="1.8"/>
        <text x="${Number(cx(xP)) - 8}" y="${Number(cy(yP)) - 8}" text-anchor="end" font-family="'Times New Roman', serif" font-size="15" font-weight="700" fill="#1e3a8a" stroke="#ffffff" stroke-width="3.5" paint-order="stroke"><tspan font-style="italic">P</tspan>(${xP.toFixed(1)}, ${yP.toFixed(2)})</text>

        <circle cx="${cx(xQ)}" cy="${cy(yQ)}" r="6" fill="#0d9488" stroke="#ffffff" stroke-width="1.8"/>
        <text x="${Number(cx(xQ)) + (xQ < 0 ? -8 : 8)}" y="${Number(cy(yQ)) + (yQ > 0 ? -8 : 18)}" text-anchor="${xQ < 0 ? 'end' : 'start'}" font-family="'Times New Roman', serif" font-size="15" font-weight="700" fill="#0f766e" stroke="#ffffff" stroke-width="3.5" paint-order="stroke"><tspan font-style="italic">Q</tspan>(${xQ.toFixed(1)}, ${yQ.toFixed(2)})</text>

        ${step >= 1 ? `
          <!-- 步骤1：展示 S1 的边长乘积 -->
          <g transform="translate(274, 26)">
            <rect x="0" y="0" width="218" height="48" rx="8" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.6"/>
            <text x="12" y="21" font-family="'SimSun', serif" font-size="13.5" font-weight="700" fill="#1e3a8a">矩形 <tspan font-family="'Times New Roman', serif" font-style="italic">S</tspan><tspan font-size="10" dy="3">1</tspan><tspan dy="-3">：|</tspan><tspan font-family="'Times New Roman', serif" font-style="italic">x</tspan><tspan font-size="10" dy="3">1</tspan><tspan dy="-3">| = ${Math.abs(xP).toFixed(1)}，|</tspan><tspan font-family="'Times New Roman', serif" font-style="italic">y</tspan><tspan font-size="10" dy="3">1</tspan><tspan dy="-3">| = ${Math.abs(yP).toFixed(2)}</tspan></text>
            <text x="12" y="40" font-family="'Times New Roman', serif" font-size="14.5" font-weight="700" fill="#1d4ed8"><tspan font-style="italic">S</tspan><tspan font-size="10" dy="3">1</tspan><tspan dy="-3"> = |</tspan><tspan font-style="italic">x</tspan><tspan font-size="10" dy="3">1</tspan><tspan dy="-3">|·|</tspan><tspan font-style="italic">y</tspan><tspan font-size="10" dy="3">1</tspan><tspan dy="-3">| = |</tspan><tspan font-style="italic">k</tspan>| = 4</text>
          </g>
        ` : ''}

        ${step >= 2 ? `
          <!-- 步骤2：展示 S2 的边长乘积 -->
          <g transform="translate(274, 82)">
            <rect x="0" y="0" width="218" height="48" rx="8" fill="#f0fdfa" stroke="#0d9488" stroke-width="1.6"/>
            <text x="12" y="21" font-family="'SimSun', serif" font-size="13.5" font-weight="700" fill="#0f766e">矩形 <tspan font-family="'Times New Roman', serif" font-style="italic">S</tspan><tspan font-size="10" dy="3">2</tspan><tspan dy="-3">：|</tspan><tspan font-family="'Times New Roman', serif" font-style="italic">x</tspan><tspan font-size="10" dy="3">2</tspan><tspan dy="-3">| = ${Math.abs(xQ).toFixed(1)}，|</tspan><tspan font-family="'Times New Roman', serif" font-style="italic">y</tspan><tspan font-size="10" dy="3">2</tspan><tspan dy="-3">| = ${Math.abs(yQ).toFixed(2)}</tspan></text>
            <text x="12" y="40" font-family="'Times New Roman', serif" font-size="14.5" font-weight="700" fill="#0f766e"><tspan font-style="italic">S</tspan><tspan font-size="10" dy="3">2</tspan><tspan dy="-3"> = |</tspan><tspan font-style="italic">x</tspan><tspan font-size="10" dy="3">2</tspan><tspan dy="-3">|·|</tspan><tspan font-style="italic">y</tspan><tspan font-size="10" dy="3">2</tspan><tspan dy="-3">| = |</tspan><tspan font-style="italic">k</tspan>| = 4</text>
          </g>
        ` : ''}

        ${step >= 3 ? `
          <!-- 步骤3：展示面积相等核心结论 -->
          <g transform="translate(22, 356)">
            <rect x="0" y="0" width="218" height="46" rx="9" fill="#fffbeb" stroke="#d97706" stroke-width="2"/>
            <text x="109" y="29" text-anchor="middle" font-family="'SimSun', serif" font-size="16" font-weight="700" fill="#b45309">恒有：<tspan font-family="'Times New Roman', serif" font-style="italic">S</tspan><tspan font-size="11" dy="3">1</tspan><tspan dy="-3"> = </tspan><tspan font-family="'Times New Roman', serif" font-style="italic">S</tspan><tspan font-size="11" dy="3">2</tspan><tspan dy="-3"> = |</tspan><tspan font-family="'Times New Roman', serif" font-style="italic">k</tspan>|（面积不变量）</text>
          </g>
        ` : ''}
      </svg>
    `;
  },

  // ==================== Sim 5: exploreKGeomSim (Slide 6: 反比例函数中 k 的几何意义，还原学案 image15.png) ====================
  exploreKGeomSim: function(state, isInit) {
    if (isInit) {
      state.step = 0;
      state.action = 'm0';
      state.xQ = -2.2;
      clearManualOverrides(state);
    }
    const root = activeRoot();
    const step = Number(state.step || 0);
    const mode = state.action || 'm0';
    const xQ = Number(state.xQ !== undefined ? state.xQ : -2.2);

    const controls = root.querySelector('#controls');
    if (controls) {
      controls.innerHTML =
        stepBar(step, 3) +
        actions([
          ['m0', '高亮矩形 <em>AOBQ</em>'],
          ['m1', '高亮 Rt△<em>QAO</em>'],
          ['m2', '高亮 Rt△<em>QBO</em>']
        ], mode) +
        slider('xQ', '拖动点 <em>Q</em> 横坐标 <em>x</em>', -4.2, -1.0, xQ, 0.2, '');
    }

    syncChunk1StepDOM(root, state, 3);

    const scene = root.querySelector('#scene');
    if (!scene) return;

    // 忠实还原学案 image15.png：
    // 第二象限双曲线分支 y = k/x (以 k = -4 为标准比例)，点 Q(x, y) 在第二象限
    // QA ⊥ y轴于点 A(0, y)，QB ⊥ x轴于点 B(x, 0)，连接 OQ，标注直角符号 ∟
    const ox = 310, oy = 290, sc = 46;
    const cx = x => (ox + sc * x).toFixed(1);
    const cy = y => (oy - sc * y).toFixed(1);

    const kVal = -4;
    const q2Pts = [];
    for (let t = 0.78; t <= 5.4; t += 0.06) {
      const yv = 4 / t;
      if (yv <= 5.4) {
        q2Pts.push(`${cx(-t)},${cy(yv)}`);
      }
    }

    const yQ = kVal / xQ; // yQ > 0
    const qx = Number(cx(xQ));
    const qy = Number(cy(yQ));
    const ax = ox, ay = qy; // A on positive y-axis
    const bx = qx, by = oy; // B on negative x-axis

    const showRect = (mode === 'm0' && step !== 2);
    const showTriA = (mode === 'm1' || step === 2);
    const showTriB = (mode === 'm2' || step === 2);

    scene.innerHTML = `
      <svg viewBox="0 0 500 420" style="width:100%;height:100%;max-height:100%;display:block;" aria-label="反比例函数中k的几何意义：矩形AOBQ与直角三角形QAO、QBO">
        <defs>
          <marker id="arrAxisKGeom" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 1.5 L 8.5 5 L 0 8.5 z" fill="#1e293b"/>
          </marker>
        </defs>

        <!-- 矩形 AOBQ 阴影 -->
        <rect x="${qx}" y="${qy}" width="${ox - qx}" height="${oy - qy}"
          fill="${showRect ? '#dbeafe' : '#f1f5f9'}"
          fill-opacity="${showRect ? '0.75' : '0.45'}"
          stroke="#2563eb" stroke-width="2.2"/>

        <!-- Rt△QAO 阴影 -->
        ${showTriA ? `
          <polygon points="${qx},${qy} ${ax},${ay} ${ox},${oy}" fill="#99f6e4" fill-opacity="0.72" stroke="#0d9488" stroke-width="2.2"/>
        ` : ''}

        <!-- Rt△QBO 阴影 -->
        ${showTriB ? `
          <polygon points="${qx},${qy} ${bx},${by} ${ox},${oy}" fill="#fde68a" fill-opacity="0.72" stroke="#d97706" stroke-width="2.2"/>
        ` : ''}

        <!-- 点 A 與 点 B 处的标准直角符号 ∟ -->
        <polyline points="${ax - 13},${ay} ${ax - 13},${ay + 13} ${ax},${ay + 13}" fill="none" stroke="#334155" stroke-width="1.8"/>
        <polyline points="${bx},${by - 13} ${bx + 13},${by - 13} ${bx + 13},${by}" fill="none" stroke="#334155" stroke-width="1.8"/>

        <!-- 对角线 OQ -->
        <line x1="${ox}" y1="${oy}" x2="${qx}" y2="${qy}" stroke="#dc2626" stroke-width="2.8"/>

        <!-- 坐标轴 -->
        <line x1="36" y1="${oy}" x2="456" y2="${oy}" stroke="#1e293b" stroke-width="2.5" marker-end="url(#arrAxisKGeom)"/>
        <line x1="${ox}" y1="386" x2="${ox}" y2="26" stroke="#1e293b" stroke-width="2.5" marker-end="url(#arrAxisKGeom)"/>
        <text x="464" y="${oy + 6}" font-family="'Times New Roman', serif" font-style="italic" font-size="20" font-weight="700" fill="#1e293b">x</text>
        <text x="${ox + 10}" y="34" font-family="'Times New Roman', serif" font-style="italic" font-size="20" font-weight="700" fill="#1e293b">y</text>
        <text x="${ox + 8}" y="${oy + 22}" font-family="'Times New Roman', serif" font-style="italic" font-size="18" font-weight="700" fill="#1e293b">O</text>

        <!-- 第二象限双曲线 y = k/x -->
        <polyline points="${q2Pts.join(' ')}" fill="none" stroke="#1e293b" stroke-width="3.6" stroke-linecap="round"/>
        ${svgStackedFrac(78, 66, 'k', 'x', '#1e293b', '', 'y')}

        <!-- 顶点 Q, A, B 圆点与斜体标注 -->
        <circle cx="${qx}" cy="${qy}" r="6" fill="#dc2626" stroke="#ffffff" stroke-width="1.8"/>
        <text x="${qx - 10}" y="${qy - 10}" text-anchor="end" font-family="'Times New Roman', serif" font-style="italic" font-size="19" font-weight="700" fill="#b91c1c" stroke="#ffffff" stroke-width="3.5" paint-order="stroke">Q</text>

        <circle cx="${ax}" cy="${ay}" r="5" fill="#1e3a8a" stroke="#ffffff" stroke-width="1.5"/>
        <text x="${ax + 10}" y="${ay + 6}" font-family="'Times New Roman', serif" font-style="italic" font-size="19" font-weight="700" fill="#1e3a8a" stroke="#ffffff" stroke-width="3.5" paint-order="stroke">A</text>

        <circle cx="${bx}" cy="${by}" r="5" fill="#1e3a8a" stroke="#ffffff" stroke-width="1.5"/>
        <text x="${bx}" y="${by + 24}" text-anchor="middle" font-family="'Times New Roman', serif" font-style="italic" font-size="19" font-weight="700" fill="#1e3a8a" stroke="#ffffff" stroke-width="3.5" paint-order="stroke">B</text>

        <!-- 边长 |x| 与 |y| 标注 -->
        <text x="${((qx + ox) / 2).toFixed(1)}" y="${oy + 22}" text-anchor="middle" font-family="'Times New Roman', serif" font-size="15.5" font-weight="700" fill="#1d4ed8"><tspan font-style="italic">OB</tspan> = |<tspan font-style="italic">x</tspan>|</text>
        <text x="${ox + 12}" y="${((qy + oy) / 2 + 5).toFixed(1)}" font-family="'Times New Roman', serif" font-size="15.5" font-weight="700" fill="#1d4ed8"><tspan font-style="italic">OA</tspan> = |<tspan font-style="italic">y</tspan>|</text>

        ${step >= 1 ? `
          <!-- 步骤1：双垂线矩形面积公式框 -->
          <g transform="translate(26, 326)">
            <rect x="0" y="0" width="216" height="74" rx="9" fill="#eff6ff" stroke="#2563eb" stroke-width="1.8"/>
            <text x="14" y="26" font-family="'SimSun', serif" font-size="14.5" font-weight="700" fill="#1e3a8a">① 矩形面积（双垂线）：</text>
            <text x="14" y="54" font-family="'Times New Roman', serif" font-size="17" font-weight="700" fill="#1d4ed8"><tspan font-style="italic">S</tspan><tspan font-family="'SimSun', serif" font-size="12" dy="4">矩形</tspan><tspan font-style="italic" font-size="12">AOBQ</tspan><tspan dy="-4"> = </tspan><tspan font-style="italic">OA</tspan>·<tspan font-style="italic">OB</tspan> = |<tspan font-style="italic">k</tspan>|</text>
          </g>
        ` : ''}

        ${step >= 2 ? `
          <!-- 步骤2：单垂线直角三角形面积公式框（含 2D 叠置分式 1/2 |k|） -->
          <g transform="translate(254, 326)">
            <rect x="0" y="0" width="224" height="74" rx="9" fill="#f0fdfa" stroke="#0d9488" stroke-width="1.8"/>
            <text x="14" y="24" font-family="'SimSun', serif" font-size="14.5" font-weight="700" fill="#0f766e">② 直角三角形面积（单垂线）：</text>
            <text x="14" y="54" font-family="'Times New Roman', serif" font-size="16.5" font-weight="700" fill="#0f766e"><tspan font-style="italic">S</tspan><tspan font-size="11.5" dy="4">△<tspan font-style="italic">QAO</tspan></tspan><tspan dy="-4"> = </tspan><tspan font-style="italic">S</tspan><tspan font-size="11.5" dy="4">△<tspan font-style="italic">QBO</tspan></tspan><tspan dy="-4"> =</tspan></text>
            <text x="166" y="45" text-anchor="middle" font-family="'Times New Roman', serif" font-size="14" font-weight="700" fill="#0f766e">1</text>
            <line x1="157" y1="49" x2="175" y2="49" stroke="#0f766e" stroke-width="1.8"/>
            <text x="166" y="64" text-anchor="middle" font-family="'Times New Roman', serif" font-size="14" font-weight="700" fill="#0f766e">2</text>
            <text x="180" y="54" font-family="'Times New Roman', serif" font-size="16.5" font-weight="700" fill="#0f766e">|<tspan font-style="italic">k</tspan>|</text>
          </g>
        ` : ''}

        ${step >= 3 ? `
          <!-- 步骤3：逆向求 k 符号警示徽章 -->
          <g transform="translate(156, 16)">
            <rect x="0" y="0" width="322" height="32" rx="8" fill="#fef2f2" stroke="#dc2626" stroke-width="1.8"/>
            <text x="161" y="21" text-anchor="middle" font-family="'SimSun', serif" font-size="13.5" font-weight="700" fill="#b91c1c">⚠️ 逆向求 <tspan font-family="'Times New Roman', serif" font-style="italic">k</tspan>：先由面积求 |<tspan font-family="'Times New Roman', serif" font-style="italic">k</tspan>|，再按所在象限定正负（二象限 <tspan font-family="'Times New Roman', serif" font-style="italic">k</tspan>&lt;0）</text>
          </g>
        ` : ''}
      </svg>
    `;
  }
});

window.UNIT1_THEOREM_SLIDES = window.UNIT1_THEOREM_SLIDES || [];
window.UNIT1_SIMS = window.UNIT1_SIMS || {};
window.SLIDES_CHUNK3 = window.UNIT1_THEOREM_SLIDES;
window.SIMS_CHUNK3 = window.UNIT1_SIMS;

window.UNIT1_THEOREM_SLIDES.push(
  // ==================== Slide 13: 四、分层训练 · 第1题 (Layout B: 左解右图) ====================
  {
    lesson: 1,
    phase: 3,
    id: "train-1",
    navTag: "分层1·区间最值",
    section: "四、分层训练",
    tag: "四、分层训练 · 第1题",
    title: '第<span class="num">1</span>题：反比例函数在指定区间上的最值问题',
    layout: "layout-b",
    cover: false,
    sim: "train1Sim",
    simId: "train1Sim",
    maxStep: 3,
    html: `
      <div class="screen-page lab-visible">
        <div class="screen-stem">
          <p><span class="num">1．</span>（<span class="num">2025</span>秋•罗湖区期末）已知反比例函数<span class="math"><i class="m">y</i><span class="num">=</span><span class="fraction"><span><i class="m">k</i></span><span><i class="m">x</i></span></span></span>（<i class="m">k</i>为常数且<i class="m">k</i><span class="num">&ne;0</span>），当<span class="num">-3&le;</span><i class="m">x</i><span class="num">&le;-1</span>时，<i class="m">y</i>的最大值是<span class="num">6</span>，则当<span class="num">1&le;</span><i class="m">x</i><span class="num">&le;3</span>时，<i class="m">y</i>的最小值为<span class="screen-blank" data-ans="<span class='num'>-6</span>"></span>．</p>
        </div>
        <div class="screen-lower layout-b">
          <div class="screen-notes">
            <div id="controls" class="controls"></div>
            <div class="step step-locked" data-step="1"><b>01</b><span><b>步骤<span class="num">1</span>（由自变量与函数值符号判定<i class="m">k</i>的正负）：</b>当<span class="num">-3&le;</span><i class="m">x</i><span class="num">&le;-1</span>时，自变量<i class="m">x</i><span class="num">&lt;0</span>，而此时函数<i class="m">y</i>的最大值为<span class="num">6&gt;0</span>（<i class="m">x</i>，<i class="m">y</i>异号），说明该分支位于<b>第二象限</b>，故<b><i class="m">k</i><span class="num">&lt;0</span></b>，在每一象限内<i class="m">y</i>随<i class="m">x</i>的增大而<b>增大</b>。</span></div>
            <div class="step step-locked" data-step="2"><b>02</b><span><b>步骤<span class="num">2</span>（利用区间单调性求<i class="m">k</i>的值）：</b>在<span class="num">-3&le;</span><i class="m">x</i><span class="num">&le;-1</span>上，<i class="m">y</i>随<i class="m">x</i>的增大而增大，因此当<b><i class="m">x</i><span class="num">=-1</span></b>时，<i class="m">y</i>取得最大值<span class="num">6</span>。代入得<span class="fraction"><span><i class="m">k</i></span><span><span class="num">-1</span></span></span><span class="num">=6&rArr;</span><b><i class="m">k</i><span class="num">=-6</span></b>，故反比例函数表达式为<span class="math"><i class="m">y</i><span class="num">=-</span><span class="fraction"><span><span class="num">6</span></span><span><i class="m">x</i></span></span></span>（也可由中心对称性快速分析）。</span></div>
            <div class="step step-locked" data-step="3"><b>03</b><span><b>步骤<span class="num">3</span>（求区间<span class="num">1&le;</span><i class="m">x</i><span class="num">&le;3</span>上的最小值）：</b>在第四象限区间<span class="num">1&le;</span><i class="m">x</i><span class="num">&le;3</span>上，<span class="math"><i class="m">y</i><span class="num">=-</span><span class="fraction"><span><span class="num">6</span></span><span><i class="m">x</i></span></span></span>仍随<i class="m">x</i>的增大而增大，故当<b><i class="m">x</i><span class="num">=1</span></b>时，<i class="m">y</i>取得最小值：<i class="m">y</i><sub><span class="num">min</span></sub><span class="num">=-</span><span class="fraction"><span><span class="num">6</span></span><span><span class="num">1</span></span></span><span class="num">=</span><b style="color:#15803d;"><span class="num">-6</span></b>。</span></div>
          </div>
          <div class="screen-media">
            <div class="screen-lab">
              <div id="scene" class="visual" style="padding:8px;align-items:stretch;justify-content:center;"></div>
            </div>
          </div>
        </div>
      </div>
    `
  },

  // ==================== Slide 14: 四、分层训练 · 第2题 (Layout B: 左解右图) ====================
  {
    lesson: 1,
    phase: 3,
    id: "train-2",
    navTag: "分层2·一线三垂直",
    section: "四、分层训练",
    tag: "四、分层训练 · 第2题",
    title: '第<span class="num">2</span>题：双反比例函数与“一线三垂直”相似模型',
    layout: "layout-b",
    cover: false,
    sim: "train2Sim",
    simId: "train2Sim",
    maxStep: 4,
    html: `
      <div class="screen-page lab-visible">
        <div class="screen-stem">
          <p><span class="num">2．</span>（<span class="num">2024</span>•苏州）如图，点<i class="m">A</i>为反比例函数<span class="math"><i class="m">y</i><span class="num">=-</span><span class="fraction"><span><span class="num">1</span></span><span><i class="m">x</i></span></span></span>（<i class="m">x</i><span class="num">&lt;0</span>）图象上的一点，连接<i class="m">AO</i>，过点<i class="m">O</i>作<i class="m">OA</i>的垂线与反比例函数<span class="math"><i class="m">y</i><span class="num">=</span><span class="fraction"><span><span class="num">4</span></span><span><i class="m">x</i></span></span></span>（<i class="m">x</i><span class="num">&gt;0</span>）的图象交于点<i class="m">B</i>，则<span class="fraction"><span><i class="m">AO</i></span><span><i class="m">BO</i></span></span>的值为（　　）<br>
          <span id="t2-opt-A"><span class="num">A．</span><span class="fraction"><span><span class="num">1</span></span><span><span class="num">2</span></span></span></span>　　　　　<span class="num">B．</span><span class="fraction"><span><span class="num">1</span></span><span><span class="num">4</span></span></span>　　　　　<span class="num">C．</span><span class="fraction"><span><span class="sqrt"><span><span class="num">3</span></span></span></span><span><span class="num">3</span></span></span>　　　　　<span class="num">D．</span><span class="fraction"><span><span class="num">1</span></span><span><span class="num">3</span></span></span></p>
        </div>
        <div class="screen-lower layout-b">
          <div class="screen-notes">
            <div id="controls" class="controls"></div>
            <div class="step step-locked" data-step="1"><b>01</b><span><b>步骤<span class="num">1</span>（作辅助线构造“一线三垂直”）：</b>如图，过点<i class="m">A</i>作<i class="m">AC</i><span class="num">&perp;</span><i class="m">x</i>轴于点<i class="m">C</i>，过点<i class="m">B</i>作<i class="m">BD</i><span class="num">&perp;</span><i class="m">x</i>轴于点<i class="m">D</i>，则<span class="num">&ang;</span><i class="m">ACO</i><span class="num">=&ang;</span><i class="m">ODB</i><span class="num">=90&deg;</span>。</span></div>
            <div class="step step-locked" data-step="2"><b>02</b><span><b>步骤<span class="num">2</span>（同角的余角相等导角证相似）：</b>因为<i class="m">OA</i><span class="num">&perp;</span><i class="m">OB</i>，所以<span class="num">&ang;</span><i class="m">AOB</i><span class="num">=90&deg;</span>，故<span class="num">&ang;1+&ang;2=90&deg;</span>；又在<span class="num">Rt&triangle;</span><i class="m">AOC</i>中，<span class="num">&ang;1+&ang;</span><i class="m">OAC</i><span class="num">=90&deg;</span>，因此<b><span class="num">&ang;</span><i class="m">OAC</i><span class="num">=&ang;2</span></b>，从而<b><span class="num">&triangle;</span><i class="m">AOC</i><span class="num">&sim;&triangle;</span><i class="m">OBD</i></b>。</span></div>
            <div class="step step-locked" data-step="3"><b>03</b><span><b>步骤<span class="num">3</span>（利用<i class="m">k</i>的几何意义求两直角三角形面积比）：</b>由反比例函数<i class="m">k</i>的几何意义可得：<i class="m">S</i><sub><span class="num">&triangle;</span><i class="m">AOC</i></sub><span class="num">=</span><span class="fraction"><span><span class="num">1</span></span><span><span class="num">2</span></span></span><span class="num">|-1|=</span><span class="fraction"><span><span class="num">1</span></span><span><span class="num">2</span></span></span>，<i class="m">S</i><sub><span class="num">&triangle;</span><i class="m">OBD</i></sub><span class="num">=</span><span class="fraction"><span><span class="num">1</span></span><span><span class="num">2</span></span></span><span class="num">&times;4=2</span>，故面积比为<span class="fraction"><span><i class="m">S</i><sub><span class="num">&triangle;</span><i class="m">AOC</i></sub></span><span><i class="m">S</i><sub><span class="num">&triangle;</span><i class="m">OBD</i></sub></span></span><span class="num">=</span><span class="fraction"><span><span class="num">1</span></span><span><span class="num">4</span></span></span>。</span></div>
            <div class="step step-locked" data-step="4"><b>04</b><span><b>步骤<span class="num">4</span>（面积比等于相似比的平方）：</b>由于相似三角形面积比等于相似比的平方，故<span class="num">(</span><span class="fraction"><span><i class="m">AO</i></span><span><i class="m">BO</i></span></span><span class="num">)</span><sup><span class="num">2</span></sup><span class="num">=</span><span class="fraction"><span><i class="m">S</i><sub><span class="num">&triangle;</span><i class="m">AOC</i></sub></span><span><i class="m">S</i><sub><span class="num">&triangle;</span><i class="m">OBD</i></sub></span></span><span class="num">=</span><span class="fraction"><span><span class="num">1</span></span><span><span class="num">4</span></span></span><span class="num">&rArr;</span><span class="fraction"><span><i class="m">AO</i></span><span><i class="m">BO</i></span></span><span class="num">=</span><b style="color:#15803d;"><span class="fraction"><span><span class="num">1</span></span><span><span class="num">2</span></span></span></b>，故选<b style="color:#15803d;"><span class="num">A</span></b>。</span></div>
          </div>
          <div class="screen-media">
            <div class="screen-lab">
              <div id="scene" class="visual" style="padding:8px;align-items:stretch;justify-content:center;"></div>
            </div>
          </div>
        </div>
      </div>
    `
  },

  // ==================== Slide 15: 五、课堂小结 (Layout A: 全宽知识体系卡片) ====================
  {
    lesson: 1,
    phase: 3,
    id: "summary",
    navTag: "课堂小结",
    section: "五、课堂小结",
    tag: "五、课堂小结",
    title: '课堂小结：反比例函数的性质与<i class="m">k</i>的几何意义',
    layout: "layout-a",
    cover: false,
    sim: null,
    simId: null,
    maxStep: 0,
    html: `
      <div class="screen-page lab-visible">
        <div class="screen-stem">
          <p>系统梳理反比例函数<span class="math"><i class="m">y</i><span class="num">=</span><span class="fraction"><span><i class="m">k</i></span><span><i class="m">x</i></span></span></span>（<i class="m">k</i><span class="num">&ne;0</span>）的<b>象限增减性</b>、<b>比例系数<i class="m">k</i>的几何意义</b>与<b>三大高频解题模型</b>。</p>
        </div>
        <div class="screen-lower layout-a">
          <div class="screen-notes" style="padding:14px 18px !important;">
            <div class="summary-grid" style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;height:100%;align-items:stretch;">
              <!-- 卡片 1：反比例函数的增减性 -->
              <div style="background:#f8fafc;border:2px solid #bfdbfe;border-top:6px solid #2563eb;border-radius:14px;padding:16px 18px;display:flex;flex-direction:column;justify-content:space-between;box-shadow:0 4px 12px rgba(37,99,235,0.06);">
                <div>
                  <div style="font-size:23px;font-weight:700;color:#1e3a8a;margin-bottom:12px;padding-bottom:8px;border-bottom:1.5px dashed #bfdbfe;">
                    一、反比例函数的增减性（必带“在每一象限内”）
                  </div>
                  <div style="background:#ffffff;border:1.5px solid #dbeafe;border-radius:10px;padding:10px 12px;margin-bottom:10px;font-size:20px;line-height:1.52;color:#1e293b;">
                    <b style="color:#2563eb;">① 当<i class="m">k</i><span class="num">&gt;0</span>时：</b>图象位于<b>第一、三象限</b>；在<b>每一象限内</b>，<i class="m">y</i>的值随<i class="m">x</i>值的增大而<b style="color:#dc2626;">减小</b>（左高右低，分支下降）。
                  </div>
                  <div style="background:#ffffff;border:1.5px solid #dbeafe;border-radius:10px;padding:10px 12px;margin-bottom:10px;font-size:20px;line-height:1.52;color:#1e293b;">
                    <b style="color:#0d9488;">② 当<i class="m">k</i><span class="num">&lt;0</span>时：</b>图象位于<b>第二、四象限</b>；在<b>每一象限内</b>，<i class="m">y</i>的值随<i class="m">x</i>值的增大而<b style="color:#16a34a;">增大</b>（左低右高，分支上升）。
                  </div>
                </div>
                <div style="background:#fef2f2;border:1.5px solid #fecaca;border-left:5px solid #dc2626;border-radius:9px;padding:10px 12px;font-size:19px;line-height:1.45;color:#7f1d1d;">
                  <b>⚠️ 核心铁律：</b>双曲线在<i class="m">x</i><span class="num">=0</span>处断开！凡未写“<b>在每一象限内</b>”（或<i class="m">x</i><span class="num">&gt;0</span>、<i class="m">x</i><span class="num">&lt;0</span>）直接断言<i class="m">y</i>随<i class="m">x</i>增大而减小/增大的命题<b>一律错误</b>。
                </div>
              </div>

              <!-- 卡片 2：比例系数 k 的几何意义 -->
              <div style="background:#f0fdfa;border:2px solid #99f6e4;border-top:6px solid #0d9488;border-radius:14px;padding:16px 18px;display:flex;flex-direction:column;justify-content:space-between;box-shadow:0 4px 12px rgba(13,148,136,0.06);">
                <div>
                  <div style="font-size:23px;font-weight:700;color:#115e59;margin-bottom:12px;padding-bottom:8px;border-bottom:1.5px dashed #99f6e4;">
                    二、比例系数<i class="m">k</i>的几何意义（面积不变量）
                  </div>
                  <div style="background:#ffffff;border:1.5px solid #ccfbf1;border-radius:10px;padding:10px 12px;margin-bottom:10px;font-size:20px;line-height:1.52;color:#1e293b;">
                    <b style="color:#0f766e;">① 垂足矩形面积恒定：</b>过双曲线上任意一点<i class="m">P</i><span class="num">(</span><i class="m">x</i><span class="num">,</span><i class="m">y</i><span class="num">)</span>作两坐标轴垂线，围成矩形面积：<br>
                    <span style="display:block;text-align:center;font-weight:700;color:#0f766e;margin-top:4px;"><i class="m">S</i><sub>矩形<i class="m">OAPB</i></sub><span class="num">=|</span><i class="m">x</i><span class="num">|&middot;|</span><i class="m">y</i><span class="num">|=|</span><i class="m">k</i><span class="num">|</span></span>
                  </div>
                  <div style="background:#ffffff;border:1.5px solid #ccfbf1;border-radius:10px;padding:10px 12px;margin-bottom:10px;font-size:20px;line-height:1.52;color:#1e293b;">
                    <b style="color:#0f766e;">② 垂足直角三角形面积恒定：</b>连接原点<i class="m">O</i>与点<i class="m">P</i>，与任一坐标轴垂线围成直角三角形面积：<br>
                    <span style="display:block;text-align:center;font-weight:700;color:#0f766e;margin-top:4px;"><i class="m">S</i><sub><span class="num">&triangle;</span><i class="m">OAP</i></sub><span class="num">=</span><i class="m">S</i><sub><span class="num">&triangle;</span><i class="m">OBP</i></sub><span class="num">=</span><span class="fraction"><span><span class="num">1</span></span><span><span class="num">2</span></span></span><span class="num">|</span><i class="m">k</i><span class="num">|</span></span>
                  </div>
                </div>
                <div style="background:#fffbeb;border:1.5px solid #fde68a;border-left:5px solid #d97706;border-radius:9px;padding:10px 12px;font-size:19px;line-height:1.45;color:#78350f;">
                  <b>💡 由面积反求<i class="m">k</i>必验正负：</b>先由面积求出<span class="num">|</span><i class="m">k</i><span class="num">|</span>，再观察图象所在象限（一、三象限取正，二、四象限取负）定<i class="m">k</i>的符号！
                </div>
              </div>

              <!-- 卡片 3：高频解题模型与易错警示 -->
              <div style="background:#fdf4ff;border:2px solid #e9d5ff;border-top:6px solid #7c3aed;border-radius:14px;padding:16px 18px;display:flex;flex-direction:column;justify-content:space-between;box-shadow:0 4px 12px rgba(124,58,237,0.06);">
                <div>
                  <div style="font-size:23px;font-weight:700;color:#5b21b6;margin-bottom:12px;padding-bottom:8px;border-bottom:1.5px dashed #e9d5ff;">
                    三、高频解题模型与易错警示
                  </div>
                  <div style="background:#ffffff;border:1.5px solid #f3e8ff;border-radius:10px;padding:9px 12px;margin-bottom:8px;font-size:19.5px;line-height:1.48;color:#1e293b;">
                    <b style="color:#6d28d9;">模型<span class="num">1</span>（跨象限比大小与区间最值）：</b>先判<i class="m">k</i>号画双曲线草图，跨象限直接按象限正负与“<b>上大下小</b>”比高低；闭区间最值在区间端点处取得。
                  </div>
                  <div style="background:#ffffff;border:1.5px solid #f3e8ff;border-radius:10px;padding:9px 12px;margin-bottom:8px;font-size:19.5px;line-height:1.48;color:#1e293b;">
                    <b style="color:#6d28d9;">模型<span class="num">2</span>（“拉窗帘”同底等高转化）：</b>当三角形一底边在坐标轴垂线上、对顶点在对应坐标轴上移动时，利用<b>同底等高</b>将顶点拉回原点<i class="m">O</i>，化归为<span class="fraction"><span><span class="num">1</span></span><span><span class="num">2</span></span></span><span class="num">|</span><i class="m">k</i><span class="num">|</span>。
                  </div>
                  <div style="background:#ffffff;border:1.5px solid #f3e8ff;border-radius:10px;padding:9px 12px;font-size:19.5px;line-height:1.48;color:#1e293b;">
                    <b style="color:#6d28d9;">模型<span class="num">3</span>（双曲线“一线三垂直”相似）：</b>遇到过原点直角<span class="num">&ang;</span><i class="m">AOB</i><span class="num">=90&deg;</span>，向同一坐标轴作双垂线得<span class="num">&triangle;</span><i class="m">AOC</i><span class="num">&sim;&triangle;</span><i class="m">OBD</i>，利用<b>面积比<span class="fraction"><span><span class="num">|</span><i class="m">k</i><sub><span class="num">1</span></sub><span class="num">|</span></span><span><span class="num">|</span><i class="m">k</i><sub><span class="num">2</span></sub><span class="num">|</span></span></span>等于相似比的平方</b>求解。
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  }
);

Object.assign(window.UNIT1_SIMS, {
  // ==================== Sim 13: train1Sim (分层训练 · 第1题：闭区间最值问题) ====================
  train1Sim(simState, isInit) {
    if (isInit) {
      simState.step = 0;
      clearManualOverrides(simState);
    }
    const root = activeRoot();
    const step = Number(simState.step || 0);
    const controls = root.querySelector('#controls');
    if (controls) {
      controls.innerHTML = stepBar(step, 3);
    }

    // Coordinate system: x in [-4.5, 4.5], y in [-7.2, 7.2]
    const ox = 230, oy = 180, sx = 44, sy = 22.5;
    const tx = x => (ox + x * sx).toFixed(1);
    const ty = y => (oy - y * sy).toFixed(1);

    const buildBranch = (xStart, xEnd, n = 60) => {
      const pts = [];
      for (let i = 0; i <= n; i++) {
        const x = xStart + (xEnd - xStart) * (i / n);
        const y = -6 / x;
        pts.push(`${i === 0 ? 'M' : 'L'}${tx(x)},${ty(y)}`);
      }
      return pts.join(' ');
    };

    const q2Full = buildBranch(-4.2, -0.86, 65);
    const q2Active = buildBranch(-3, -1, 45);
    const q4Full = buildBranch(0.86, 4.2, 65);
    const q4Active = buildBranch(1, 3, 45);

    const svgHTML = `
      <svg viewBox="0 0 460 360" style="width:100%;height:100%;display:block;background:#ffffff;border-radius:10px;border:1.5px solid #cbd5e1;">
        <defs>
          <marker id="arrT1" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,1 L9,5 L0,9 Z" fill="#1e293b"/>
          </marker>
          <marker id="arrBlueT1" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,1 L9,5 L0,9 Z" fill="#2563eb"/>
          </marker>
          <marker id="arrGreenT1" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,1 L9,5 L0,9 Z" fill="#16a34a"/>
          </marker>
        </defs>

        <!-- Light background coordinate grid -->
        ${[-4, -3, -2, -1, 1, 2, 3, 4].map(gx => `
          <line x1="${tx(gx)}" y1="16" x2="${tx(gx)}" y2="344" stroke="#f1f5f9" stroke-width="1.2"/>
        `).join('')}
        ${[-6, -4, -2, 2, 4, 6].map(gy => `
          <line x1="20" y1="${ty(gy)}" x2="440" y2="${ty(gy)}" stroke="#f1f5f9" stroke-width="1.2"/>
        `).join('')}

        <!-- Interval highlight bands on x-axis (always visible from step 0 as given intervals) -->
        <rect x="${tx(-3)}" y="${oy - 6}" width="${sx * 2}" height="12" rx="4" fill="#dbeafe" stroke="#60a5fa" stroke-width="1.2"/>
        <rect x="${tx(1)}" y="${oy - 6}" width="${sx * 2}" height="12" rx="4" fill="#dcfce7" stroke="#4ade80" stroke-width="1.2"/>

        ${step >= 1 ? `
          <!-- Step 1: Q2 interval vertical strip & Q2 hyperbola branch -->
          <rect x="${tx(-3)}" y="${ty(6)}" width="${sx * 2}" height="${sy * 6}" fill="#eff6ff" opacity="0.55"/>
          <path d="${q2Full}" fill="none" stroke="#93c5fd" stroke-width="2.2" stroke-dasharray="5,4"/>
          <path d="${q2Active}" fill="none" stroke="#2563eb" stroke-width="4" stroke-linecap="round"/>
          <!-- Monotonicity arrow in Q2 -->
          <path d="M${tx(-2.65)},${ty(2.85)} Q${tx(-1.75)},${ty(4.1)} ${tx(-1.25)},${ty(5.65)}" fill="none" stroke="#2563eb" stroke-width="2" marker-end="url(#arrBlueT1)"/>
          <g transform="translate(26, 22)">
            <rect x="0" y="0" width="166" height="44" rx="7" fill="#eff6ff" stroke="#93c5fd" stroke-width="1.4"/>
            <text x="83" y="18" text-anchor="middle" font-size="13" font-weight="700" fill="#1e3a8a">
              <tspan font-family="'Times New Roman',serif" font-style="italic">x</tspan><tspan font-family="'Times New Roman',serif">&lt;0</tspan>且<tspan font-family="'Times New Roman',serif" font-style="italic">y</tspan><tspan font-family="'Times New Roman',serif" font-size="10" dy="3">max</tspan><tspan font-family="'Times New Roman',serif" dy="-3">=6&gt;0</tspan>
            </text>
            <text x="83" y="36" text-anchor="middle" font-size="13" font-weight="700" fill="#2563eb">
              分支在第二象限 &rArr; <tspan font-family="'Times New Roman',serif" font-style="italic">k</tspan><tspan font-family="'Times New Roman',serif">&lt;0</tspan>
            </text>
          </g>
        ` : `
          <!-- Step 0: Blank coordinate plane prompt (zero curve spoiler) -->
          <g transform="translate(115, 32)">
            <rect x="0" y="0" width="230" height="34" rx="8" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.4"/>
            <text x="115" y="22" text-anchor="middle" font-size="13.5" font-weight="700" fill="#475569">
              思考：在 <tspan font-family="'Times New Roman',serif">-3&le;</tspan><tspan font-family="'Times New Roman',serif" font-style="italic">x</tspan><tspan font-family="'Times New Roman',serif">&le;-1</tspan> 上 <tspan font-family="'Times New Roman',serif" font-style="italic">y</tspan> 最大值为 <tspan font-family="'Times New Roman',serif">6</tspan>，图象在哪个象限？
            </text>
          </g>
        `}

        ${step >= 2 ? `
          <!-- Step 2: Endpoint (-3, 2) and maximum endpoint P(-1, 6), plus 2D stacked fraction formula y = -6/x -->
          <line x1="${tx(-3)}" y1="${oy}" x2="${tx(-3)}" y2="${ty(2)}" stroke="#64748b" stroke-width="1.5" stroke-dasharray="4,3"/>
          <line x1="${tx(-1)}" y1="${oy}" x2="${tx(-1)}" y2="${ty(6)}" stroke="#dc2626" stroke-width="2" stroke-dasharray="4,3"/>
          <line x1="${tx(-1)}" y1="${ty(6)}" x2="${ox}" y2="${ty(6)}" stroke="#dc2626" stroke-width="2" stroke-dasharray="4,3"/>
          <circle cx="${tx(-3)}" cy="${ty(2)}" r="4.5" fill="#2563eb" stroke="#ffffff" stroke-width="1.5"/>
          <text x="${Number(tx(-3)) - 8}" y="${Number(ty(2)) - 8}" text-anchor="end" font-size="13.5" font-weight="700" fill="#1e40af" stroke="#ffffff" stroke-width="3.5" paint-order="stroke">
            <tspan font-family="'Times New Roman',serif">(-3,2)</tspan>
          </text>
          <circle cx="${tx(-1)}" cy="${ty(6)}" r="6" fill="#dc2626" stroke="#ffffff" stroke-width="1.8"/>
          <text x="${Number(tx(-1)) - 10}" y="${Number(ty(6)) + 5}" text-anchor="end" font-size="14.5" font-weight="700" fill="#dc2626" stroke="#ffffff" stroke-width="4" paint-order="stroke">
            最大值点 <tspan font-family="'Times New Roman',serif" font-style="italic">P</tspan><tspan font-family="'Times New Roman',serif">(-1,6)</tspan>
          </text>
          <!-- 2D stacked fraction label y = -6/x -->
          <g transform="translate(262, 54)">
            <rect x="-10" y="-24" width="128" height="44" rx="8" fill="#fef2f2" stroke="#fca5a5" stroke-width="1.5"/>
            <text x="0" y="2" font-family="'Times New Roman',serif" font-size="16" font-weight="700" fill="#b91c1c">
              <tspan font-style="italic">k</tspan> = -6，
            </text>
            <text x="58" y="2" font-family="'Times New Roman',serif" font-size="16" font-weight="700" fill="#b91c1c">
              <tspan font-style="italic">y</tspan> = -
            </text>
            <text x="100" y="-7" font-family="'Times New Roman',serif" font-size="14.5" font-weight="700" fill="#b91c1c" text-anchor="middle">6</text>
            <line x1="91" y1="-3" x2="109" y2="-3" stroke="#b91c1c" stroke-width="1.8"/>
            <text x="100" y="12" font-family="'Times New Roman',serif" font-style="italic" font-size="14.5" font-weight="700" fill="#b91c1c" text-anchor="middle">x</text>
          </g>
        ` : ''}

        ${step >= 3 ? `
          <!-- Step 3: Q4 interval [1, 3], Q4 branch, origin symmetry line, and minimum endpoint Q(1, -6) -->
          <rect x="${tx(1)}" y="${oy}" width="${sx * 2}" height="${sy * 6}" fill="#f0fdf4" opacity="0.6"/>
          <path d="${q4Full}" fill="none" stroke="#86efac" stroke-width="2.2" stroke-dasharray="5,4"/>
          <path d="${q4Active}" fill="none" stroke="#16a34a" stroke-width="4" stroke-linecap="round"/>
          <!-- Origin symmetry dashed line connecting P(-1,6) and Q(1,-6) -->
          <line x1="${tx(-1)}" y1="${ty(6)}" x2="${tx(1)}" y2="${ty(-6)}" stroke="#9333ea" stroke-width="1.8" stroke-dasharray="6,4"/>
          <line x1="${tx(1)}" y1="${oy}" x2="${tx(1)}" y2="${ty(-6)}" stroke="#16a34a" stroke-width="2" stroke-dasharray="4,3"/>
          <line x1="${tx(1)}" y1="${ty(-6)}" x2="${ox}" y2="${ty(-6)}" stroke="#16a34a" stroke-width="2" stroke-dasharray="4,3"/>
          <line x1="${tx(3)}" y1="${oy}" x2="${tx(3)}" y2="${ty(-2)}" stroke="#64748b" stroke-width="1.5" stroke-dasharray="4,3"/>
          <!-- Monotonicity arrow in Q4 -->
          <path d="M${tx(1.25)},${ty(-5.65)} Q${tx(1.75)},${ty(-4.1)} ${tx(2.65)},${ty(-2.85)}" fill="none" stroke="#16a34a" stroke-width="2" marker-end="url(#arrGreenT1)"/>
          <circle cx="${tx(3)}" cy="${ty(-2)}" r="4.5" fill="#16a34a" stroke="#ffffff" stroke-width="1.5"/>
          <text x="${Number(tx(3)) + 8}" y="${Number(ty(-2)) + 15}" text-anchor="start" font-size="13.5" font-weight="700" fill="#15803d" stroke="#ffffff" stroke-width="3.5" paint-order="stroke">
            <tspan font-family="'Times New Roman',serif">(3,-2)</tspan>
          </text>
          <circle cx="${tx(1)}" cy="${ty(-6)}" r="6.5" fill="#16a34a" stroke="#ffffff" stroke-width="1.8"/>
          <text x="${Number(tx(1)) + 10}" y="${Number(ty(-6)) + 5}" text-anchor="start" font-size="15" font-weight="700" fill="#15803d" stroke="#ffffff" stroke-width="4" paint-order="stroke">
            最小值点 <tspan font-family="'Times New Roman',serif" font-style="italic">Q</tspan><tspan font-family="'Times New Roman',serif">(1,-6) &rArr; </tspan><tspan font-family="'Times New Roman',serif" font-style="italic">y</tspan><tspan font-family="'Times New Roman',serif" font-size="11" dy="3">min</tspan><tspan font-family="'Times New Roman',serif" dy="-3"> = -6</tspan>
          </text>
        ` : ''}

        <!-- Coordinate Axes -->
        <line x1="18" y1="${oy}" x2="442" y2="${oy}" stroke="#1e293b" stroke-width="2" marker-end="url(#arrT1)"/>
        <line x1="${ox}" y1="346" x2="${ox}" y2="14" stroke="#1e293b" stroke-width="2" marker-end="url(#arrT1)"/>
        <text x="434" y="${oy + 21}" font-family="'Times New Roman',serif" font-style="italic" font-size="17" font-weight="700" fill="#1e293b">x</text>
        <text x="${ox + 12}" y="25" font-family="'Times New Roman',serif" font-style="italic" font-size="17" font-weight="700" fill="#1e293b">y</text>
        <text x="${ox - 16}" y="${oy + 18}" font-family="'Times New Roman',serif" font-style="italic" font-size="15" font-weight="700" fill="#1e293b">O</text>

        <!-- Tick marks on x-axis and y-axis -->
        ${[-3, -2, -1, 1, 2, 3].map(k => `
          <line x1="${tx(k)}" y1="${oy - 4}" x2="${tx(k)}" y2="${oy + 4}" stroke="#1e293b" stroke-width="1.8"/>
          <text x="${tx(k)}" y="${oy + 20}" text-anchor="middle" font-family="'Times New Roman',serif" font-size="14" font-weight="${Math.abs(k) === 1 || Math.abs(k) === 3 ? '700' : '400'}" fill="${k < 0 ? '#1d4ed8' : '#15803d'}" stroke="#ffffff" stroke-width="3" paint-order="stroke">${k}</text>
        `).join('')}
        ${[-6, -4, -2, 2, 4, 6].map(k => `
          <line x1="${ox - 4}" y1="${ty(k)}" x2="${ox + 4}" y2="${ty(k)}" stroke="#1e293b" stroke-width="1.8"/>
          <text x="${ox - 8}" y="${Number(ty(k)) + 5}" text-anchor="end" font-family="'Times New Roman',serif" font-size="14" font-weight="${Math.abs(k) === 6 ? '700' : '400'}" fill="${k === 6 ? '#dc2626' : (k === -6 ? '#15803d' : '#334155')}" stroke="#ffffff" stroke-width="3" paint-order="stroke">${k}</text>
        `).join('')}
      </svg>
    `;

    const scene = root.querySelector('#scene');
    if (scene) scene.innerHTML = svgHTML;
  },

  // ==================== Sim 14: train2Sim (分层训练 · 第2题：双反比例函数与“一线三垂直”) ====================
  train2Sim(simState, isInit) {
    if (isInit) {
      simState.step = 0;
      simState.xA = -1.35;
      clearManualOverrides(simState);
    }
    const root = activeRoot();
    const step = Number(simState.step || 0);
    if (simState.xA === undefined) simState.xA = -1.35;
    const xA = Number(simState.xA);
    const yA = -1 / xA; // > 0 since xA < 0
    // B on y = 4/x (x > 0) with OA ⊥ OB: (xB, yB) = (2*yA, -2*xA)
    const xB = 2 * yA;
    const yB = -2 * xA;

    const controls = root.querySelector('#controls');
    if (controls) {
      controls.innerHTML =
        stepBar(step, 4) +
        slider('xA', '拖动点<i class="m">A</i>横坐标<i class="m">x</i><sub><i class="m">A</i></sub>（旋转直角<span class="num">&ang;</span><i class="m">AOB</i>）', -1.80, -0.65, xA, 0.05);
    }

    // Highlight Option A at step >= 4
    const optA = root.querySelector('#t2-opt-A');
    if (optA) {
      if (step >= 4) {
        optA.style.cssText = 'background:#dcfce7;border:2px solid #16a34a;color:#15803d;padding:2px 10px;border-radius:8px;font-weight:700;';
      } else {
        optA.style.cssText = '';
      }
    }

    // SVG coordinate system matching image68.png:
    // Origin O at (200, 290), scale sc = 68 px/unit
    const ox = 200, oy = 290, sc = 68;
    const tx = x => ox + x * sc;
    const ty = y => oy - y * sc;

    const buildHyp = (kVal, xMin, xMax, n = 65) => {
      const pts = [];
      for (let i = 0; i <= n; i++) {
        const x = xMin + (xMax - xMin) * (i / n);
        const y = kVal / x;
        pts.push(`${i === 0 ? 'M' : 'L'}${tx(x).toFixed(1)},${ty(y).toFixed(1)}`);
      }
      return pts.join(' ');
    };

    const curveQ2 = buildHyp(-1, -2.65, -0.27, 70);
    const curveQ1 = buildHyp(4, 1.04, 3.55, 70);

    const Ax = tx(xA), Ay = ty(yA);
    const Bx = tx(xB), By = ty(yB);
    const Cx = tx(xA), Cy = oy;
    const Dx = tx(xB), Dy = oy;

    // Right-angle marker at O between OA and OB
    const lenOA = Math.hypot(Ax - ox, Ay - oy);
    const lenOB = Math.hypot(Bx - ox, By - oy);
    const uAx = (Ax - ox) / lenOA, uAy = (Ay - oy) / lenOA;
    const uBx = (Bx - ox) / lenOB, uBy = (By - oy) / lenOB;
    const rSz = 13;
    const p1x = ox + uAx * rSz, p1y = oy + uAy * rSz;
    const p2x = ox + (uAx + uBx) * rSz, p2y = oy + (uAy + uBy) * rSz;
    const p3x = ox + uBx * rSz, p3y = oy + uBy * rSz;

    // Angle arcs for ∠1 (∠AOC), ∠2 (∠BOD), and ∠OAC
    // In SVG coordinates: C is to the left of O: angle pi (180 deg)
    // OA has SVG angle atan2(Ay - oy, Ax - ox)
    const angOA = Math.atan2(Ay - oy, Ax - ox);
    const angOB = Math.atan2(By - oy, Bx - ox);
    const rArc1 = 28;
    const a1StartX = ox - rArc1, a1StartY = oy;
    const a1EndX = ox + rArc1 * Math.cos(angOA), a1EndY = oy + rArc1 * Math.sin(angOA);
    const mid1 = (Math.PI + angOA) / 2;
    const lbl1X = ox + (rArc1 + 11) * Math.cos(mid1), lbl1Y = oy + (rArc1 + 11) * Math.sin(mid1) + 4;

    const rArc2 = 32;
    const a2StartX = ox + rArc2 * Math.cos(angOB), a2StartY = oy + rArc2 * Math.sin(angOB);
    const a2EndX = ox + rArc2, a2EndY = oy;
    const mid2 = angOB / 2;
    const lbl2X = ox + (rArc2 + 12) * Math.cos(mid2), lbl2Y = oy + (rArc2 + 12) * Math.sin(mid2) + 4;

    // Arc at vertex A between AC (downward: angle pi/2) and AO (angle atan2(oy - Ay, ox - Ax))
    const angAO = Math.atan2(oy - Ay, ox - Ax);
    const rArcA = 20;
    const aAStartX = Ax, aAStartY = Ay + rArcA;
    const aAEndX = Ax + rArcA * Math.cos(angAO), aAEndY = Ay + rArcA * Math.sin(angAO);

    const svgHTML = `
      <svg viewBox="0 0 460 350" style="width:100%;height:100%;display:block;background:#ffffff;border-radius:10px;border:1.5px solid #cbd5e1;">
        <defs>
          <marker id="arrT2" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,1 L9,5 L0,9 Z" fill="#0f172a"/>
          </marker>
        </defs>

        ${step >= 2 ? `
          <!-- Step 2+: Shaded similar right triangles △AOC and △OBD -->
          <polygon points="${Ax.toFixed(1)},${Ay.toFixed(1)} ${Cx.toFixed(1)},${Cy.toFixed(1)} ${ox},${oy}" fill="#dbeafe" fill-opacity="0.62"/>
          <polygon points="${ ox },${ oy } ${Bx.toFixed(1)},${By.toFixed(1)} ${Dx.toFixed(1)},${Dy.toFixed(1)}" fill="#fef3c7" fill-opacity="0.68"/>
        ` : ''}

        ${step >= 1 ? `
          <!-- Step 1+: Auxiliary perpendiculars AC ⊥ x-axis and BD ⊥ x-axis ("一线三垂直") -->
          <line x1="${Ax.toFixed(1)}" y1="${Ay.toFixed(1)}" x2="${Cx.toFixed(1)}" y2="${Cy.toFixed(1)}" stroke="#2563eb" stroke-width="2.4" stroke-dasharray="5,4"/>
          <line x1="${Bx.toFixed(1)}" y1="${By.toFixed(1)}" x2="${Dx.toFixed(1)}" y2="${Dy.toFixed(1)}" stroke="#d97706" stroke-width="2.4" stroke-dasharray="5,4"/>
          <!-- Right-angle symbol at C -->
          <polyline points="${(Cx + 10).toFixed(1)},${Cy} ${(Cx + 10).toFixed(1)},${(Cy - 10).toFixed(1)} ${Cx.toFixed(1)},${(Cy - 10).toFixed(1)}" fill="none" stroke="#2563eb" stroke-width="1.8"/>
          <!-- Right-angle symbol at D -->
          <polyline points="${(Dx - 11).toFixed(1)},${Dy} ${(Dx - 11).toFixed(1)},${(Dy - 11).toFixed(1)} ${Dx.toFixed(1)},${(Dy - 11).toFixed(1)}" fill="none" stroke="#d97706" stroke-width="1.8"/>
          <circle cx="${Cx.toFixed(1)}" cy="${Cy}" r="4" fill="#2563eb"/>
          <circle cx="${Dx.toFixed(1)}" cy="${Dy}" r="4" fill="#d97706"/>
          <text x="${Cx.toFixed(1)}" y="${Cy + 22}" text-anchor="middle" font-family="'Times New Roman',serif" font-style="italic" font-size="17" font-weight="700" fill="#1d4ed8">C</text>
          <text x="${Dx.toFixed(1)}" y="${Dy + 22}" text-anchor="middle" font-family="'Times New Roman',serif" font-style="italic" font-size="17" font-weight="700" fill="#b45309">D</text>
        ` : ''}

        ${step >= 2 ? `
          <!-- Step 2+: Numbered angles ∠1, ∠2 and equal angle arc at ∠OAC -->
          <path d="M ${a1StartX.toFixed(1)},${a1StartY.toFixed(1)} A ${rArc1},${rArc1} 0 0,1 ${a1EndX.toFixed(1)},${a1EndY.toFixed(1)}" fill="none" stroke="#2563eb" stroke-width="2.2"/>
          <text x="${lbl1X.toFixed(1)}" y="${lbl1Y.toFixed(1)}" text-anchor="middle" font-family="'Times New Roman',serif" font-size="14.5" font-weight="700" fill="#1d4ed8" stroke="#ffffff" stroke-width="3" paint-order="stroke">1</text>

          <path d="M ${a2StartX.toFixed(1)},${a2StartY.toFixed(1)} A ${rArc2},${rArc2} 0 0,1 ${a2EndX.toFixed(1)},${a2EndY.toFixed(1)}" fill="none" stroke="#dc2626" stroke-width="2.2"/>
          <text x="${lbl2X.toFixed(1)}" y="${lbl2Y.toFixed(1)}" text-anchor="middle" font-family="'Times New Roman',serif" font-size="14.5" font-weight="700" fill="#dc2626" stroke="#ffffff" stroke-width="3" paint-order="stroke">2</text>

          <path d="M ${aAStartX.toFixed(1)},${aAStartY.toFixed(1)} A ${rArcA},${rArcA} 0 0,0 ${aAEndX.toFixed(1)},${aAEndY.toFixed(1)}" fill="none" stroke="#dc2626" stroke-width="2"/>
        ` : ''}

        <!-- Original problem elements (always visible at step >= 0, matching image68.png) -->
        <line x1="16" y1="${oy}" x2="444" y2="${oy}" stroke="#0f172a" stroke-width="2.2" marker-end="url(#arrT2)"/>
        <line x1="${ox}" y1="334" x2="${ox}" y2="16" stroke="#0f172a" stroke-width="2.2" marker-end="url(#arrT2)"/>
        <text x="436" y="${oy + 24}" font-family="'Times New Roman',serif" font-style="italic" font-size="19" font-weight="700" fill="#0f172a">x</text>
        <text x="${ox - 20}" y="28" font-family="'Times New Roman',serif" font-style="italic" font-size="19" font-weight="700" fill="#0f172a">y</text>
        <text x="${ox - 18}" y="${oy + 22}" font-family="'Times New Roman',serif" font-style="italic" font-size="18" font-weight="700" fill="#0f172a">O</text>

        <!-- Two Hyperbola Branches: y = -1/x (x<0) and y = 4/x (x>0) -->
        <path d="${curveQ2}" fill="none" stroke="#0f172a" stroke-width="2.6" stroke-linecap="round"/>
        <path d="${curveQ1}" fill="none" stroke="#0f172a" stroke-width="2.6" stroke-linecap="round"/>

        <!-- 2D Stacked Fraction Formula Label: y = -1/x -->
        <g transform="translate(64, 118)">
          <text x="0" y="0" font-family="'Times New Roman',serif" font-size="18" fill="#0f172a">
            <tspan font-style="italic">y</tspan> = -
          </text>
          <text x="48" y="-9" font-family="'Times New Roman',serif" font-size="16" fill="#0f172a" text-anchor="middle">1</text>
          <line x1="38" y1="-4" x2="58" y2="-4" stroke="#0f172a" stroke-width="1.8"/>
          <text x="48" y="13" font-family="'Times New Roman',serif" font-style="italic" font-size="16" fill="#0f172a" text-anchor="middle">x</text>
        </g>

        <!-- 2D Stacked Fraction Formula Label: y = 4/x -->
        <g transform="translate(362, 146)">
          <text x="0" y="0" font-family="'Times New Roman',serif" font-size="18" fill="#0f172a">
            <tspan font-style="italic">y</tspan> =
          </text>
          <text x="38" y="-9" font-family="'Times New Roman',serif" font-size="16" fill="#0f172a" text-anchor="middle">4</text>
          <line x1="28" y1="-4" x2="48" y2="-4" stroke="#0f172a" stroke-width="1.8"/>
          <text x="38" y="13" font-family="'Times New Roman',serif" font-style="italic" font-size="16" fill="#0f172a" text-anchor="middle">x</text>
        </g>

        <!-- Right-angle marker at O (OA ⊥ OB) -->
        <polyline points="${p1x.toFixed(1)},${p1y.toFixed(1)} ${p2x.toFixed(1)},${p2y.toFixed(1)} ${p3x.toFixed(1)},${p3y.toFixed(1)}" fill="none" stroke="#0f172a" stroke-width="1.8"/>

        <!-- Segments OA and OB -->
        <line x1="${ox}" y1="${oy}" x2="${Ax.toFixed(1)}" y2="${Ay.toFixed(1)}" stroke="${step >= 2 ? '#1d4ed8' : '#0f172a'}" stroke-width="2.6"/>
        <line x1="${ox}" y1="${oy}" x2="${Bx.toFixed(1)}" y2="${By.toFixed(1)}" stroke="${step >= 2 ? '#b45309' : '#0f172a'}" stroke-width="2.6"/>

        <!-- Points A and B -->
        <circle cx="${Ax.toFixed(1)}" cy="${Ay.toFixed(1)}" r="4.5" fill="${step >= 1 ? '#2563eb' : '#0f172a'}" stroke="#ffffff" stroke-width="1.4"/>
        <circle cx="${Bx.toFixed(1)}" cy="${By.toFixed(1)}" r="4.5" fill="${step >= 1 ? '#d97706' : '#0f172a'}" stroke="#ffffff" stroke-width="1.4"/>
        <text x="${(Ax - 10).toFixed(1)}" y="${(Ay - 8).toFixed(1)}" text-anchor="end" font-family="'Times New Roman',serif" font-style="italic" font-size="19" font-weight="700" fill="#0f172a" stroke="#ffffff" stroke-width="3.5" paint-order="stroke">A</text>
        <text x="${(Bx + 10).toFixed(1)}" y="${(By - 6).toFixed(1)}" text-anchor="start" font-family="'Times New Roman',serif" font-style="italic" font-size="19" font-weight="700" fill="#0f172a" stroke="#ffffff" stroke-width="3.5" paint-order="stroke">B</text>

        ${step >= 3 ? `
          <!-- Step 3+: Area labels with 2D stacked fraction 1/2 -->
          <g transform="translate(22, 192)">
            <rect x="0" y="-22" width="112" height="42" rx="8" fill="#eff6ff" stroke="#60a5fa" stroke-width="1.5"/>
            <text x="10" y="3" font-family="'Times New Roman',serif" font-size="15" font-weight="700" fill="#1e40af">
              <tspan font-style="italic">S</tspan><tspan font-size="11" dy="4">&triangle;<tspan font-style="italic">AOC</tspan></tspan><tspan dy="-4"> = </tspan>
            </text>
            <text x="88" y="-5" font-family="'Times New Roman',serif" font-size="13.5" font-weight="700" fill="#1e40af" text-anchor="middle">1</text>
            <line x1="80" y1="-1" x2="96" y2="-1" stroke="#1e40af" stroke-width="1.6"/>
            <text x="88" y="13" font-family="'Times New Roman',serif" font-size="13.5" font-weight="700" fill="#1e40af" text-anchor="middle">2</text>
          </g>

          <g transform="translate(328, 224)">
            <rect x="0" y="-18" width="108" height="34" rx="8" fill="#fffbeb" stroke="#fbbf24" stroke-width="1.5"/>
            <text x="54" y="4" text-anchor="middle" font-family="'Times New Roman',serif" font-size="15" font-weight="700" fill="#b45309">
              <tspan font-style="italic">S</tspan><tspan font-size="11" dy="4">&triangle;<tspan font-style="italic">OBD</tspan></tspan><tspan dy="-4"> = 2</tspan>
            </text>
          </g>
        ` : ''}

        ${step >= 4 ? `
          <!-- Step 4: Final similarity ratio badge with 2D stacked fraction AO/BO = 1/2 -->
          <g transform="translate(22, 24)">
            <rect x="0" y="0" width="156" height="48" rx="9" fill="#f0fdf4" stroke="#16a34a" stroke-width="1.8"/>
            <text x="14" y="29" font-family="'Times New Roman',serif" font-size="15" font-weight="700" fill="#15803d">
              &triangle;<tspan font-style="italic">AOC</tspan> &sim; &triangle;<tspan font-style="italic">OBD</tspan> &rArr;
            </text>
            <text x="136" y="19" font-family="'Times New Roman',serif" font-size="14" font-weight="700" fill="#15803d" text-anchor="middle">1</text>
            <line x1="127" y1="23" x2="145" y2="23" stroke="#15803d" stroke-width="1.8"/>
            <text x="136" y="38" font-family="'Times New Roman',serif" font-size="14" font-weight="700" fill="#15803d" text-anchor="middle">2</text>
          </g>
        ` : ''}
      </svg>
    `;

    const scene = root.querySelector('#scene');
    if (scene) scene.innerHTML = svgHTML;
  }
});

queueMicrotask(() => {
  if (typeof PHASES_BY_LESSON !== 'undefined') {
    PHASES_BY_LESSON[1] = [
      ['① 情境引入', '思维激活 · 题1'],
      ['② 新知探究', '增减性与k的几何意义'],
      ['③ 新知应用', '思维迁移 · 题1—6'],
      ['④ 分层训练', '思维提升与课堂小结']
    ];
  }
  if (typeof LECTURE_TABS !== 'undefined') {
    LECTURE_TABS.length = 0;
    LECTURE_TABS.push([1, '2.2.2 反比例函数的图象（2）']);
  }
  const origRender = window.render;
  if (typeof origRender === 'function') {
    window.render = function() {
      origRender();
      const brand = document.querySelector('.flow-brand');
      if (brand) brand.innerHTML = '北师大版九下 · 第二章';
      const s = slides[index];
      const st = document.getElementById('slideTitle');
      if (st && s) st.innerHTML = `<span class="num">2.2.2</span> 反比例函数的图象（<span class="num">2</span>） · ${s.title}`;
      const subfootSpans = document.querySelectorAll('.subfoot > span');
      if (subfootSpans.length >= 1) {
        subfootSpans[0].innerHTML = '北师大版九年级下册 · 第二章 反比例函数 · <span class="num">2.2.2</span> 反比例函数的图象（<span class="num">2</span>）';
      }
    };
    window.render();
  }
  const tocBtn = document.getElementById('toc');
  if (tocBtn) {
    tocBtn.onclick = () => {
      const list = document.getElementById('tocList');
      const hdr = `<div class="toc-group-header"><span>北师大版九年级下册 · 第二章 反比例函数（<span class="num">2.2.2</span> 反比例函数的图象（<span class="num">2</span>））</span><small style="font-size:13.5px;color:#475569;font-weight:600">点击词条直接跳转</small></div>`;
      list.innerHTML = hdr + slides.map((s, i) =>
        `<button data-toc="${i}" class="${i===index?'current':''}"><span class="toc-idx">${String(i+1).padStart(2,'0')}</span><span class="toc-title-wrap">${s.title}</span><small class="phase-label">${getPhasePair(s)[0]}</small></button>`
      ).join('');
      document.getElementById('tocDialog').showModal();
      requestAnimationFrame(() => list.querySelector('.current')?.scrollIntoView({ block: 'nearest' }));
    };
  }
});

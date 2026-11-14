window.UNIT1_THEOREM_SLIDES = window.UNIT1_THEOREM_SLIDES || [];
window.UNIT1_SIMS = window.UNIT1_SIMS || {};
window.SLIDES_CHUNK2 = window.UNIT1_THEOREM_SLIDES;
window.SIMS_CHUNK2 = window.UNIT1_SIMS;

window.UNIT1_THEOREM_SLIDES.push(
  // ==================== Slide 7: 三、新知应用 · 第1题 (Layout B: 左解右图) ====================
  {
    lesson: 1,
    phase: 2,
    navTag: "题1·矩形面积",
    section: "新知应用",
    title: "第<span class='num'>1</span>题：利用<i class='m'>k</i>的几何意义求矩形面积",
    cover: false,
    sim: "apply1Sim",
    html: `
      <div class="screen-page lab-visible">
        <div class="screen-stem">
          <p><span class="num">1．</span>如图，点<i class="m">P</i>在反比例函数<span class="math"><i class="m">y</i><span class="num">=-</span><span class="fraction"><span><span class="num">2</span></span><span><i class="m">x</i></span></span></span>（<i class="m">x</i><span class="num">&lt;0</span>）的图象上，则矩形<i class="m">OAPB</i>的面积是（　　）<br>
          <span class="num">A．1</span>　　　　　　<span class="num">B．2</span>　　　　　　<span class="num">C．4</span>　　　　　　<span class="num">D．6</span></p>
        </div>
        <div class="screen-lower layout-b">
          <div class="screen-notes">
            <div id="controls" class="controls"></div>
            <div class="step step-locked"><b>01</b><span><b>步骤<span class="num">1</span>（设点坐标与表示矩形邻边长）：</b>设点<i class="m">P</i>的坐标为<span class="num">(</span><i class="m">x</i><span class="num">,</span><i class="m">y</i><span class="num">)</span>（<i class="m">x</i><span class="num">&lt;0</span>，<i class="m">y</i><span class="num">&gt;0</span>）。因为点<i class="m">P</i>在反比例函数<span class="math"><i class="m">y</i><span class="num">=-</span><span class="fraction"><span><span class="num">2</span></span><span><i class="m">x</i></span></span></span>的图象上，所以<b><i class="m">xy</i><span class="num">=-2</span></b>；在第二象限内，矩形<i class="m">OAPB</i>的两邻边长分别为<b><i class="m">OA</i><span class="num">=|</span><i class="m">x</i><span class="num">|=-</span><i class="m">x</i></b>，<b><i class="m">OB</i><span class="num">=|</span><i class="m">y</i><span class="num">|=</span><i class="m">y</i></b>。</span></div>
            <div class="step step-locked"><b>02</b><span><b>步骤<span class="num">2</span>（利用<i class="m">k</i>的几何意义计算矩形面积）：</b>由矩形面积公式及反比例函数比例系数<i class="m">k</i>的几何意义可得：<b><i class="m">S</i><sub>矩形<i class="m">OAPB</i></sub><span class="num">=</span><i class="m">OA</i><span class="num">&middot;</span><i class="m">OB</i><span class="num">=|</span><i class="m">x</i><span class="num">|&middot;|</span><i class="m">y</i><span class="num">|=|</span><i class="m">xy</i><span class="num">|=|</span><i class="m">k</i><span class="num">|=|-2|=2</span></b>。</span></div>
            <div class="step step-locked"><b>03</b><span><b>步骤<span class="num">3</span>（锁定答案与动态等积验证）：</b>无论点<i class="m">P</i>在双曲线分支上如何移动（可拖动上方滑块验证），矩形<i class="m">OAPB</i>的面积恒等于定值<b><span class="num">2</span></b>，故选<b><span class="num" style="color:#15803d;">B</span></b>。</span></div>
          </div>
          <div class="screen-media">
            <div class="screen-lab">
              <div id="scene" class="visual" style="padding:10px;align-items:stretch;justify-content:center;"></div>
            </div>
          </div>
        </div>
      </div>
    `
  },

  // ==================== Slide 8: 三、新知应用 · 第2题 (Layout A: 上题下解) ====================
  {
    lesson: 1,
    phase: 2,
    navTag: "题2·性质辨析",
    section: "新知应用",
    title: "第<span class='num'>2</span>题：反比例函数图象与性质综合辨析",
    cover: false,
    sim: "apply2Sim",
    html: `
      <div class="screen-page lab-visible">
        <div class="screen-stem">
          <p><span class="num">2．</span>（<span class="num">2025</span>•浙江）已知反比例函数<span class="math"><i class="m">y</i><span class="num">=-</span><span class="fraction"><span><span class="num">7</span></span><span><i class="m">x</i></span></span></span>．下列选项正确的是（　　）<br>
          <span class="num">A．</span>函数图象在第一、三象限　　　　<span class="num">B．</span><i class="m">y</i>随<i class="m">x</i>的增大而减小　　　　<span class="num">C．</span>函数图象在第二、四象限　　　　<span class="num">D．</span><i class="m">y</i>随<i class="m">x</i>的增大而增大</p>
        </div>
        <div class="screen-lower layout-a">
          <div class="screen-notes">
            <div id="controls" class="controls"></div>
            <div class="step step-locked"><b>01</b><span><b>步骤<span class="num">1</span>（提取比例系数<i class="m">k</i>并判定正负号）：</b>在反比例函数<span class="math"><i class="m">y</i><span class="num">=-</span><span class="fraction"><span><span class="num">7</span></span><span><i class="m">x</i></span></span></span>中，比例系数<b><i class="m">k</i><span class="num">=-7&lt;0</span></b>。</span></div>
            <div class="step step-locked"><b>02</b><span><b>步骤<span class="num">2</span>（核验<span class="num">A</span>、<span class="num">C</span>选项——由<i class="m">k</i>的符号定象限）：</b>当<i class="m">k</i><span class="num">&lt;0</span>时，反比例函数图象的两支分别位于<b>第二、四象限</b>，因此选项<span class="num" style="color:#dc2626;font-weight:700;">A错误</span>，选项<b><span class="num" style="color:#15803d;">C正确</span></b>。</span></div>
            <div class="step step-locked"><b>03</b><span><b>步骤<span class="num">3</span>（辨析<span class="num">B</span>、<span class="num">D</span>选项——严防漏掉“在每一象限内”陷阱）：</b>当<i class="m">k</i><span class="num">=-7&lt;0</span>时，必须强调前提“<b>在每一象限内</b>”，<i class="m">y</i>才随<i class="m">x</i>的增大而增大；若删去该前提跨象限取点（如<i class="m">x</i><sub><span class="num">1</span></sub><span class="num">=-1&lt;</span><i class="m">x</i><sub><span class="num">2</span></sub><span class="num">=1</span>，则<i class="m">y</i><sub><span class="num">1</span></sub><span class="num">=7&gt;</span><i class="m">y</i><sub><span class="num">2</span></sub><span class="num">=-7</span>，<i class="m">y</i>反而减小），故<span class="num" style="color:#dc2626;font-weight:700;">B、D均错误</span>。综上所述，本题选<b><span class="num" style="color:#15803d;">C</span></b>。</span></div>
          </div>
        </div>
      </div>
    `
  },

  // ==================== Slide 9: 三、新知应用 · 第3题 (Layout B: 左解右图) ====================
  {
    lesson: 1,
    phase: 2,
    navTag: "题3·动点面积",
    section: "新知应用",
    title: "第<span class='num'>3</span>题：动点与双曲线上三角形面积变化探究",
    cover: false,
    sim: "apply3Sim",
    html: `
      <div class="screen-page lab-visible">
        <div class="screen-stem">
          <p><span class="num">3．</span>如图，点<i class="m">A</i>是<i class="m">y</i>轴正半轴上的一个定点，点<i class="m">B</i>是反比例函数<span class="math"><i class="m">y</i><span class="num">=</span><span class="fraction"><span><span class="num">1</span></span><span><i class="m">x</i></span></span></span>（<i class="m">x</i><span class="num">&gt;0</span>）图象上的一个动点，当点<i class="m">B</i>的纵坐标逐渐增大时，<span class="num">&triangle;</span><i class="m">OAB</i>的面积将（　　）<br>
          <span class="num">A．</span>逐渐增大　　　　<span class="num">B．</span>不变　　　　<span class="num">C．</span>逐渐减小　　　　<span class="num">D．</span>先增大后减小</p>
        </div>
        <div class="screen-lower layout-b">
          <div class="screen-notes">
            <div id="controls" class="controls"></div>
            <div class="step step-locked"><b>01</b><span><b>步骤<span class="num">1</span>（作高线表示<span class="num">&triangle;</span><i class="m">OAB</i>的面积）：</b>过动点<i class="m">B</i><span class="num">(</span><i class="m">x</i><sub><i class="m">B</i></sub><span class="num">,</span><i class="m">y</i><sub><i class="m">B</i></sub><span class="num">)</span>作<i class="m">BC</i><span class="num">&perp;</span><i class="m">y</i>轴于点<i class="m">C</i>。以<i class="m">y</i>轴上的线段<i class="m">OA</i>为底边，则高为点<i class="m">B</i>到<i class="m">y</i>轴的距离<b><i class="m">BC</i><span class="num">=</span><i class="m">x</i><sub><i class="m">B</i></sub></b>，故<span class="math"><i class="m">S</i><sub><span class="num">&triangle;</span><i class="m">OAB</i></sub><span class="num">=</span><span class="fraction"><span><span class="num">1</span></span><span><span class="num">2</span></span></span><i class="m">OA</i><span class="num">&middot;</span><i class="m">BC</i><span class="num">=</span><span class="fraction"><span><span class="num">1</span></span><span><span class="num">2</span></span></span><i class="m">OA</i><span class="num">&middot;</span><i class="m">x</i><sub><i class="m">B</i></sub></span>。</span></div>
            <div class="step step-locked"><b>02</b><span><b>步骤<span class="num">2</span>（由函数增减性分析高<i class="m">x</i><sub><i class="m">B</i></sub>的变化）：</b>因为点<i class="m">B</i>在反比例函数<span class="math"><i class="m">y</i><span class="num">=</span><span class="fraction"><span><span class="num">1</span></span><span><i class="m">x</i></span></span></span>（<i class="m">x</i><span class="num">&gt;0</span>）的图象上，满足<span class="math"><i class="m">x</i><sub><i class="m">B</i></sub><span class="num">=</span><span class="fraction"><span><span class="num">1</span></span><span><i class="m">y</i><sub><i class="m">B</i></sub></span></span></span>；当点<i class="m">B</i>的纵坐标<i class="m">y</i><sub><i class="m">B</i></sub>逐渐增大时，点<i class="m">B</i>沿第一象限分支向左上方移动，其横坐标<b><i class="m">x</i><sub><i class="m">B</i></sub>逐渐减小</b>（越来越靠近<i class="m">y</i>轴）。</span></div>
            <div class="step step-locked"><b>03</b><span><b>步骤<span class="num">3</span>（辨析“定点<i class="m">A</i>”与“垂足<i class="m">C</i>”锁定答案）：</b>注意本题中点<i class="m">A</i>是<i class="m">y</i>轴上的<b>定点</b>（而非随<i class="m">B</i>移动的垂足<i class="m">C</i>），故底边<b><i class="m">OA</i>的长度固定不变</b>，而高<i class="m">BC</i><span class="num">=</span><i class="m">x</i><sub><i class="m">B</i></sub>逐渐减小，因此<span class="num">&triangle;</span><i class="m">OAB</i>的面积<b>逐渐减小</b>，故选<b><span class="num" style="color:#15803d;">C</span></b>。</span></div>
          </div>
          <div class="screen-media">
            <div class="screen-lab">
              <div id="scene" class="visual" style="padding:10px;align-items:stretch;justify-content:center;"></div>
            </div>
          </div>
        </div>
      </div>
    `
  },

  // ==================== Slide 10: 三、新知应用 · 第4题 (Layout B: 左解右图) ====================
  {
    lesson: 1,
    phase: 2,
    navTag: "题4·看图求范围",
    section: "新知应用",
    title: "第<span class='num'>4</span>题：利用函数图象求自变量与函数值的取值范围",
    cover: false,
    sim: "apply4Sim",
    html: `
      <div class="screen-page lab-visible">
        <div class="screen-stem">
          <p><span class="num">4．</span>如图，考查函数<span class="math"><i class="m">y</i><span class="num">=</span><span class="fraction"><span><span class="num">2</span></span><span><i class="m">x</i></span></span></span>的图象：当<i class="m">x</i><span class="num">=-2</span>时，<i class="m">y</i><span class="num">=</span><span class="screen-blank" data-ans="<span class='num'>-1</span>"></span>；当<i class="m">x</i><span class="num">&lt;-2</span>时，<i class="m">y</i>的取值范围是<span class="screen-blank" data-ans="<span class='num'>-1&lt;</span><i class='m'>y</i><span class='num'>&lt;0</span>"></span>；当<i class="m">y</i><span class="num">&gt;-1</span>时，<i class="m">x</i>的取值范围是<span class="screen-blank" data-ans="<i class='m'>x</i><span class='num'>&lt;-2</span>或<i class='m'>x</i><span class='num'>&gt;0</span>"></span>；当<span class="num">3&le;</span><i class="m">x</i><span class="num">&le;6</span>时，<i class="m">y</i>的取值范围是<span class="screen-blank" data-ans="<span class='fraction'><span><span class='num'>1</span></span><span><span class='num'>3</span></span></span><span class='num'>&le;</span><i class='m'>y</i><span class='num'>&le;</span><span class='fraction'><span><span class='num'>2</span></span><span><span class='num'>3</span></span></span>"></span>．</p>
        </div>
        <div class="screen-lower layout-b">
          <div class="screen-notes">
            <div id="controls" class="controls"></div>
            <div class="step step-locked"><b>01</b><span><b>第①空（已知<i class="m">x</i><span class="num">=-2</span>求函数值<i class="m">y</i>）：</b>将<i class="m">x</i><span class="num">=-2</span>代入<span class="math"><i class="m">y</i><span class="num">=</span><span class="fraction"><span><span class="num">2</span></span><span><i class="m">x</i></span></span></span>（或直接读取图中虚线交点坐标<span class="num">(-2,-1)</span>），得<b><span style="color:#15803d;"><i class="m">y</i><span class="num">=-1</span></span></b>。</span></div>
            <div class="step step-locked"><b>02</b><span><b>第②空（当<i class="m">x</i><span class="num">&lt;-2</span>时求<i class="m">y</i>的范围）：</b>当<i class="m">x</i><span class="num">&lt;-2</span>时，对应第三象限点<span class="num">(-2,-1)</span><b>左侧</b>的曲线分支。在第三象限内<i class="m">y</i>随<i class="m">x</i>的增大而减小，且曲线无限接近但永不触碰<i class="m">x</i>轴（<i class="m">y</i><span class="num">&lt;0</span>），故<b><span style="color:#15803d;"><span class="num">-1&lt;</span><i class="m">y</i><span class="num">&lt;0</span></span></b>（切勿漏写上界<span class="num">&lt;0</span>）。</span></div>
            <div class="step step-locked"><b>03</b><span><b>第③空（当<i class="m">y</i><span class="num">&gt;-1</span>时求<i class="m">x</i>的范围——分两象限讨论）：</b>直线<i class="m">y</i><span class="num">=-1</span>上方的图象跨越两个象限：①在第三象限，当<span class="num">-1&lt;</span><i class="m">y</i><span class="num">&lt;0</span>时，对应<b><i class="m">x</i><span class="num">&lt;-2</span></b>；②在第一象限，<i class="m">y</i><span class="num">&gt;0</span>恒满足<i class="m">y</i><span class="num">&gt;-1</span>，对应<b><i class="m">x</i><span class="num">&gt;0</span></b>。综上，填<b><span style="color:#15803d;"><i class="m">x</i><span class="num">&lt;-2</span>或<i class="m">x</i><span class="num">&gt;0</span></span></b>。</span></div>
            <div class="step step-locked"><b>04</b><span><b>第④空（当<span class="num">3&le;</span><i class="m">x</i><span class="num">&le;6</span>时求<i class="m">y</i>的范围）：</b>当<span class="num">3&le;</span><i class="m">x</i><span class="num">&le;6</span>时，图象位于第一象限同一支上，<i class="m">y</i>随<i class="m">x</i>的增大而减小。当<i class="m">x</i><span class="num">=3</span>时<span class="math"><i class="m">y</i><span class="num">=</span><span class="fraction"><span><span class="num">2</span></span><span><span class="num">3</span></span></span></span>；当<i class="m">x</i><span class="num">=6</span>时<span class="math"><i class="m">y</i><span class="num">=</span><span class="fraction"><span><span class="num">2</span></span><span><span class="num">6</span></span></span><span class="num">=</span><span class="fraction"><span><span class="num">1</span></span><span><span class="num">3</span></span></span></span>，故填<b><span style="color:#15803d;"><span class="fraction"><span><span class="num">1</span></span><span><span class="num">3</span></span></span><span class="num">&le;</span><i class="m">y</i><span class="num">&le;</span><span class="fraction"><span><span class="num">2</span></span><span><span class="num">3</span></span></span></span></b>。</span></div>
          </div>
          <div class="screen-media">
            <div class="screen-lab">
              <div id="scene" class="visual" style="padding:10px;align-items:stretch;justify-content:center;"></div>
            </div>
          </div>
        </div>
      </div>
    `
  },

  // ==================== Slide 11: 三、新知应用 · 第5题 (Layout B: 左解右图) ====================
  {
    lesson: 1,
    phase: 2,
    navTag: "题5·含参比大小",
    section: "新知应用",
    title: "第<span class='num'>5</span>题：含参反比例函数的函数值大小比较",
    cover: false,
    sim: "apply5Sim",
    html: `
      <div class="screen-page lab-visible">
        <div class="screen-stem">
          <p><span class="num">5．</span>反比例函数<span class="math"><i class="m">y</i><span class="num">=</span><span class="fraction"><span><i class="m">m</i><sup><span class="num">2</span></sup><span class="num">+1</span></span><span><i class="m">x</i></span></span></span>的图象上<span class="num">3</span>个点的坐标分别为<span class="num">(-2,</span><i class="m">y</i><sub><span class="num">1</span></sub><span class="num">)</span>，<span class="num">(2,</span><i class="m">y</i><sub><span class="num">2</span></sub><span class="num">)</span>，<span class="num">(3,</span><i class="m">y</i><sub><span class="num">3</span></sub><span class="num">)</span>，则<i class="m">y</i><sub><span class="num">1</span></sub>，<i class="m">y</i><sub><span class="num">2</span></sub>，<i class="m">y</i><sub><span class="num">3</span></sub>的大小关系为<span class="screen-blank" data-ans="<i class='m'>y</i><sub><span class='num'>1</span></sub><span class='num'>&lt;</span><i class='m'>y</i><sub><span class='num'>3</span></sub><span class='num'>&lt;</span><i class='m'>y</i><sub><span class='num'>2</span></sub>"></span>．（用“<span class="num">&lt;</span>”连接）</p>
        </div>
        <div class="screen-lower layout-b">
          <div class="screen-notes">
            <div id="controls" class="controls"></div>
            <div class="step step-locked"><b>01</b><span><b>步骤<span class="num">1</span>（非负性判定比例系数<i class="m">k</i>的正负与象限）：</b>对于任意实数<i class="m">m</i>，都有<i class="m">m</i><sup><span class="num">2</span></sup><span class="num">&ge;0</span>，因此比例系数<b><i class="m">k</i><span class="num">=</span><i class="m">m</i><sup><span class="num">2</span></sup><span class="num">+1&ge;1&gt;0</span></b>恒成立。据此在右侧坐标系中画出位于<b>第一、第三象限</b>的双曲线草图。</span></div>
            <div class="step step-locked"><b>02</b><span><b>步骤<span class="num">2</span>（先分象限判正负）：</b>点<span class="num">(-2,</span><i class="m">y</i><sub><span class="num">1</span></sub><span class="num">)</span>的横坐标<span class="num">-2&lt;0</span>，位于<b>第三象限</b>，故<b><i class="m">y</i><sub><span class="num">1</span></sub><span class="num">&lt;0</span></b>；点<span class="num">(2,</span><i class="m">y</i><sub><span class="num">2</span></sub><span class="num">)</span>、<span class="num">(3,</span><i class="m">y</i><sub><span class="num">3</span></sub><span class="num">)</span>的横坐标均大于<span class="num">0</span>，位于<b>第一象限</b>，故<b><i class="m">y</i><sub><span class="num">2</span></sub><span class="num">&gt;0</span>，<i class="m">y</i><sub><span class="num">3</span></sub><span class="num">&gt;0</span></b>。</span></div>
            <div class="step step-locked"><b>03</b><span><b>步骤<span class="num">3</span>（同象限用增减性比较）：</b>在第一象限内，<i class="m">y</i>随<i class="m">x</i>的增大而减小（或观察右图<i class="m">y</i>轴投影高低：上大下小）。因为<span class="num">0&lt;2&lt;3</span>，所以<b><span class="num">0&lt;</span><i class="m">y</i><sub><span class="num">3</span></sub><span class="num">&lt;</span><i class="m">y</i><sub><span class="num">2</span></sub></b>。综合正负关系可得：<b><span style="color:#15803d;"><i class="m">y</i><sub><span class="num">1</span></sub><span class="num">&lt;</span><i class="m">y</i><sub><span class="num">3</span></sub><span class="num">&lt;</span><i class="m">y</i><sub><span class="num">2</span></sub></span></b>。</span></div>
          </div>
          <div class="screen-media">
            <div class="screen-lab">
              <div id="scene" class="visual" style="padding:10px;align-items:stretch;justify-content:center;"></div>
            </div>
          </div>
        </div>
      </div>
    `
  },

  // ==================== Slide 12: 三、新知应用 · 第6题 (Layout B: 左解右图) ====================
  {
    lesson: 1,
    phase: 2,
    navTag: "题6·等积变形",
    section: "新知应用",
    title: "第<span class='num'>6</span>题：等积变形（同底等高）与<i class='m'>k</i>的几何意义",
    cover: false,
    sim: "apply6Sim",
    html: `
      <div class="screen-page lab-visible">
        <div class="screen-stem">
          <p><span class="num">6．</span>（<span class="num">2024</span>•南山区二模）如图，点<i class="m">A</i>是反比例函数<span class="math"><i class="m">y</i><span class="num">=</span><span class="fraction"><span><i class="m">k</i></span><span><i class="m">x</i></span></span></span>的图象上的一点，过点<i class="m">A</i>作<i class="m">AB</i><span class="num">&perp;</span><i class="m">x</i>轴，垂足为<i class="m">B</i>，点<i class="m">C</i>为<i class="m">y</i>轴上的一点，连接<i class="m">AC</i>，<i class="m">BC</i>．若<span class="num">&triangle;</span><i class="m">ABC</i>的面积为<span class="num">6</span>，则<i class="m">k</i>的值是<span class="screen-blank" data-ans="<span class='num'>-12</span>"></span>．</p>
        </div>
        <div class="screen-lower layout-b">
          <div class="screen-notes">
            <div id="controls" class="controls"></div>
            <div class="step step-locked"><b>01</b><span><b>步骤<span class="num">1</span>（构造辅助线与同底等高转化）：</b>连接<i class="m">AO</i>。因为<i class="m">AB</i><span class="num">&perp;</span><i class="m">x</i>轴，且<i class="m">y</i>轴<span class="num">&perp;</span><i class="m">x</i>轴，所以<b><i class="m">AB</i><span class="num">&parallel;</span><i class="m">y</i>轴</b>（点<i class="m">C</i>在<i class="m">y</i>轴上）。<span class="num">&triangle;</span><i class="m">ABC</i>与<span class="num">&triangle;</span><i class="m">ABO</i>同以<i class="m">AB</i>为底，且高都等于平行线<i class="m">AB</i>与<i class="m">y</i>轴之间的距离<i class="m">OB</i>，故<b><i class="m">S</i><sub><span class="num">&triangle;</span><i class="m">ABO</i></sub><span class="num">=</span><i class="m">S</i><sub><span class="num">&triangle;</span><i class="m">ABC</i></sub><span class="num">=6</span></b>。</span></div>
            <div class="step step-locked"><b>02</b><span><b>步骤<span class="num">2</span>（利用<i class="m">k</i>的几何意义求<span class="num">|</span><i class="m">k</i><span class="num">|</span>）：</b>在<span class="num">Rt&triangle;</span><i class="m">ABO</i>中，由反比例函数比例系数<i class="m">k</i>的几何意义可知：<span class="math"><i class="m">S</i><sub><span class="num">&triangle;</span><i class="m">ABO</i></sub><span class="num">=</span><span class="fraction"><span><span class="num">1</span></span><span><span class="num">2</span></span></span><span class="num">|</span><i class="m">k</i><span class="num">|=6</span></span>，解得<b><span class="num">|</span><i class="m">k</i><span class="num">|=12</span></b>。</span></div>
            <div class="step step-locked"><b>03</b><span><b>步骤<span class="num">3</span>（根据所在象限确定<i class="m">k</i>的符号）：</b>由图可知，反比例函数图象的一支位于<b>第二象限</b>（<i class="m">x</i><span class="num">&lt;0</span>，<i class="m">y</i><span class="num">&gt;0</span>），故<b><i class="m">k</i><span class="num">&lt;0</span></b>，从而<b><span style="color:#15803d;"><i class="m">k</i><span class="num">=-12</span></span></b>。</span></div>
          </div>
          <div class="screen-media">
            <div class="screen-lab">
              <div id="scene" class="visual" style="padding:10px;align-items:stretch;justify-content:center;"></div>
            </div>
          </div>
        </div>
      </div>
    `
  }
);

Object.assign(window.UNIT1_SIMS, {
  // ==================== Sim 7: apply1Sim (Layout B: 左解右图) ====================
  apply1Sim(simState, isInit) {
    if (isInit) {
      simState.step = 0;
      simState.xP = -1.15;
      clearManualOverrides(simState);
    }
    const root = activeRoot();
    const step = Number(simState.step || 0);
    if (simState.xP === undefined) simState.xP = -1.15;
    const xP = Number(simState.xP);
    const yP = -2 / xP;

    const controls = root.querySelector('#controls');
    if (controls) {
      controls.innerHTML = stepBar(step, 3) + (step >= 1
        ? slider('xP', '拖动点<i class="m">P</i>横坐标<i class="m">x</i>', -3.2, -0.65, xP, 0.05)
        : '');
    }

    const ox = 290, oy = 250, sc = 64;
    const tx = x => (ox + x * sc).toFixed(1);
    const ty = y => (oy - y * sc).toFixed(1);

    const pts = [];
    for (let i = 0; i <= 60; i++) {
      const x = -3.75 + (-0.58 - (-3.75)) * (i / 60);
      const y = -2 / x;
      pts.push(`${i === 0 ? 'M' : 'L'}${tx(x)},${ty(y)}`);
    }
    const branchQ2 = pts.join(' ');

    const px = Number(tx(xP)), py = Number(ty(yP));
    const rectW = (ox - px).toFixed(1);
    const rectH = (oy - py).toFixed(1);

    const svgHTML = `
      <svg viewBox="0 0 460 360" style="width:100%;height:100%;max-height:100%;display:block;background:#ffffff;border-radius:10px;border:1.5px solid #cbd5e1;">
        <defs>
          <marker id="arrAp1" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,1 L9,5 L0,9 Z" fill="#1e293b"/>
          </marker>
        </defs>

        ${[-4, -3, -2, -1, 1].map(g => `
          <line x1="${tx(g)}" y1="18" x2="${tx(g)}" y2="338" stroke="#f1f5f9" stroke-width="1"/>
        `).join('')}
        ${[1, 2, 3].map(g => `
          <line x1="20" y1="${ty(g)}" x2="438" y2="${ty(g)}" stroke="#f1f5f9" stroke-width="1"/>
        `).join('')}

        ${step >= 2 ? `
          <rect x="${px}" y="${py}" width="${rectW}" height="${rectH}" fill="#dbeafe" fill-opacity="0.72" stroke="#2563eb" stroke-width="2.2"/>
          <text x="${((px + ox) / 2).toFixed(1)}" y="${((py + oy) / 2 + 5).toFixed(1)}" font-size="15.5" font-weight="700" fill="#1d4ed8" text-anchor="middle" stroke="#ffffff" stroke-width="3.5" paint-order="stroke">
            <tspan font-family="'Times New Roman', serif" font-style="italic">S</tspan><tspan font-family="'Times New Roman', serif"> = |</tspan><tspan font-family="'Times New Roman', serif" font-style="italic">k</tspan><tspan font-family="'Times New Roman', serif">| = 2</tspan>
          </text>
        ` : ''}

        <line x1="${px}" y1="${py}" x2="${px}" y2="${oy}" stroke="${step >= 1 ? '#1d4ed8' : '#1e293b'}" stroke-width="2.2"/>
        <line x1="${px}" y1="${py}" x2="${ox}" y2="${py}" stroke="${step >= 1 ? '#1d4ed8' : '#1e293b'}" stroke-width="2.2"/>

        ${step >= 1 ? `
          <polyline points="${px},${oy - 10} ${px + 10},${oy - 10} ${px + 10},${oy}" fill="none" stroke="#1d4ed8" stroke-width="1.6"/>
          <polyline points="${ox - 10},${py} ${ox - 10},${py + 10} ${ox},${py + 10}" fill="none" stroke="#1d4ed8" stroke-width="1.6"/>
          <text x="${((px + ox) / 2).toFixed(1)}" y="${oy + 22}" font-size="14" font-weight="700" fill="#0f766e" text-anchor="middle" stroke="#ffffff" stroke-width="3" paint-order="stroke">
            <tspan font-family="'Times New Roman', serif" font-style="italic">OA</tspan><tspan font-family="'Times New Roman', serif"> = |</tspan><tspan font-family="'Times New Roman', serif" font-style="italic">x</tspan><tspan font-family="'Times New Roman', serif">| = ${Math.abs(xP).toFixed(2)}</tspan>
          </text>
          <text x="${ox + 12}" y="${((py + oy) / 2 + 5).toFixed(1)}" font-size="14" font-weight="700" fill="#0f766e" text-anchor="start" stroke="#ffffff" stroke-width="3" paint-order="stroke">
            <tspan font-family="'Times New Roman', serif" font-style="italic">OB</tspan><tspan font-family="'Times New Roman', serif"> = |</tspan><tspan font-family="'Times New Roman', serif" font-style="italic">y</tspan><tspan font-family="'Times New Roman', serif">| = ${yP.toFixed(2)}</tspan>
          </text>
        ` : ''}

        <line x1="20" y1="${oy}" x2="436" y2="${oy}" stroke="#1e293b" stroke-width="2" marker-end="url(#arrAp1)"/>
        <line x1="${ox}" y1="338" x2="${ox}" y2="18" stroke="#1e293b" stroke-width="2" marker-end="url(#arrAp1)"/>
        <text x="428" y="${oy + 22}" font-family="'Times New Roman', serif" font-style="italic" font-size="17" font-weight="700" fill="#1e293b">x</text>
        <text x="${ox - 20}" y="28" font-family="'Times New Roman', serif" font-style="italic" font-size="17" font-weight="700" fill="#1e293b">y</text>
        <text x="${ox - 18}" y="${oy + 20}" font-family="'Times New Roman', serif" font-style="italic" font-size="16" font-weight="700" fill="#1e293b">O</text>

        <path d="${branchQ2}" fill="none" stroke="${step >= 1 ? '#2563eb' : '#1e293b'}" stroke-width="3" stroke-linecap="round"/>

        <g transform="translate(${tx(-3.15)}, ${ty(2.45)})">
          <text x="0" y="0" font-size="16" font-weight="700" fill="#1e293b" stroke="#ffffff" stroke-width="3.5" paint-order="stroke">
            <tspan font-family="'Times New Roman', serif" font-style="italic">y</tspan><tspan font-family="'Times New Roman', serif"> = -</tspan>
          </text>
          <text x="42" y="-7" font-family="'Times New Roman', serif" font-size="15" font-weight="700" fill="#1e293b" text-anchor="middle" stroke="#ffffff" stroke-width="3.5" paint-order="stroke">2</text>
          <line x1="33" y1="-4" x2="51" y2="-4" stroke="#1e293b" stroke-width="1.8"/>
          <text x="42" y="11" font-family="'Times New Roman', serif" font-style="italic" font-size="15" font-weight="700" fill="#1e293b" text-anchor="middle" stroke="#ffffff" stroke-width="3.5" paint-order="stroke">x</text>
        </g>

        <circle cx="${px}" cy="${py}" r="5" fill="${step >= 1 ? '#dc2626' : '#1e293b'}" stroke="#ffffff" stroke-width="1.5"/>
        <circle cx="${px}" cy="${oy}" r="3.5" fill="#1e293b"/>
        <circle cx="${ox}" cy="${py}" r="3.5" fill="#1e293b"/>

        <text x="${px - 10}" y="${py - 8}" font-family="'Times New Roman', serif" font-style="italic" font-size="16" font-weight="700" fill="#1e293b" text-anchor="end" stroke="#ffffff" stroke-width="3" paint-order="stroke">P</text>
        <text x="${px}" y="${oy + 20}" font-family="'Times New Roman', serif" font-style="italic" font-size="16" font-weight="700" fill="#1e293b" text-anchor="middle" stroke="#ffffff" stroke-width="3" paint-order="stroke">A</text>
        <text x="${ox + 12}" y="${py + 5}" font-family="'Times New Roman', serif" font-style="italic" font-size="16" font-weight="700" fill="#1e293b" text-anchor="start" stroke="#ffffff" stroke-width="3" paint-order="stroke">B</text>

        ${step >= 3 ? `
          <rect x="24" y="20" width="226" height="34" rx="8" fill="#dcfce7" stroke="#16a34a" stroke-width="1.6"/>
          <text x="137" y="42" font-size="14.5" font-weight="700" fill="#15803d" text-anchor="middle">
            恒有 <tspan font-family="'Times New Roman', serif" font-style="italic">OA</tspan><tspan font-family="'Times New Roman', serif">&middot;</tspan><tspan font-family="'Times New Roman', serif" font-style="italic">OB</tspan><tspan font-family="'Times New Roman', serif"> = |</tspan><tspan font-family="'Times New Roman', serif" font-style="italic">xy</tspan><tspan font-family="'Times New Roman', serif">| = 2</tspan>（选 <tspan font-family="'Times New Roman', serif">B</tspan>）
          </text>
        ` : ''}
      </svg>
    `;

    const scene = root.querySelector('#scene');
    if (scene) scene.innerHTML = svgHTML;
  },

  // ==================== Sim 8: apply2Sim (Layout A: 上题下解) ====================
  apply2Sim(simState, isInit) {
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
  },

  // ==================== Sim 9: apply3Sim (Layout B: 左解右图) ====================
  apply3Sim(simState, isInit) {
    if (isInit) {
      simState.step = 0;
      simState.yB = 1.65;
      clearManualOverrides(simState);
    }
    const root = activeRoot();
    const step = Number(simState.step || 0);
    if (simState.yB === undefined) simState.yB = 1.65;
    const yB = Number(simState.yB);
    const xB = 1 / yB;
    const yA = 2.0;

    const controls = root.querySelector('#controls');
    if (controls) {
      controls.innerHTML = stepBar(step, 3) + (step >= 2
        ? slider('yB', '增大动点<i class="m">B</i>纵坐标<i class="m">y</i><sub><i class="m">B</i></sub>', 0.55, 2.75, yB, 0.05)
        : '');
    }

    const ox = 95, oy = 305, sc = 92;
    const tx = x => (ox + x * sc).toFixed(1);
    const ty = y => (oy - y * sc).toFixed(1);

    const pts = [];
    for (let i = 0; i <= 65; i++) {
      const x = 0.34 + (3.55 - 0.34) * (i / 65);
      const y = 1 / x;
      pts.push(`${i === 0 ? 'M' : 'L'}${tx(x)},${ty(y)}`);
    }
    const branchQ1 = pts.join(' ');

    const ax = ox, ay = Number(ty(yA));
    const bx = Number(tx(xB)), by = Number(ty(yB));
    const areaVal = (0.5 * yA * xB).toFixed(2);

    const svgHTML = `
      <svg viewBox="0 0 460 360" style="width:100%;height:100%;max-height:100%;display:block;background:#ffffff;border-radius:10px;border:1.5px solid #cbd5e1;">
        <defs>
          <marker id="arrAp3" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,1 L9,5 L0,9 Z" fill="#1e293b"/>
          </marker>
          <marker id="arrMove3" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,1 L9,5 L0,9 Z" fill="#dc2626"/>
          </marker>
        </defs>

        ${[1, 2, 3].map(g => `
          <line x1="${tx(g)}" y1="18" x2="${tx(g)}" y2="336" stroke="#f1f5f9" stroke-width="1"/>
          <line x1="24" y1="${ty(g)}" x2="436" y2="${ty(g)}" stroke="#f1f5f9" stroke-width="1"/>
        `).join('')}

        ${step >= 1 ? `
          <polygon points="${ox},${oy} ${ax},${ay} ${bx},${by}" fill="#dbeafe" fill-opacity="0.68" stroke="none"/>
          <line x1="${ox}" y1="${oy}" x2="${ax}" y2="${ay}" stroke="#0f766e" stroke-width="4"/>
          <line x1="${ox}" y1="${by}" x2="${bx}" y2="${by}" stroke="#dc2626" stroke-width="2.2" stroke-dasharray="5,4"/>
          <polyline points="${ox},${by + 10} ${ox + 10},${by + 10} ${ox + 10},${by}" fill="none" stroke="#dc2626" stroke-width="1.6"/>
          <circle cx="${ox}" cy="${by}" r="3.5" fill="#dc2626"/>
          <text x="${ox - 14}" y="${by + 5}" font-family="'Times New Roman', serif" font-style="italic" font-size="15" font-weight="700" fill="#dc2626" text-anchor="end" stroke="#ffffff" stroke-width="3" paint-order="stroke">C</text>
          <text x="${((ox + bx) / 2).toFixed(1)}" y="${by - 8}" font-size="13.5" font-weight="700" fill="#dc2626" text-anchor="middle" stroke="#ffffff" stroke-width="3" paint-order="stroke">
            高 <tspan font-family="'Times New Roman', serif" font-style="italic">BC</tspan><tspan font-family="'Times New Roman', serif"> = </tspan><tspan font-family="'Times New Roman', serif" font-style="italic">x</tspan><tspan font-family="'Times New Roman', serif" font-size="10" dy="3">B</tspan>
          </text>
          <text x="${ox - 12}" y="${((oy + ay) / 2).toFixed(1)}" font-size="13.5" font-weight="700" fill="#0f766e" text-anchor="end" stroke="#ffffff" stroke-width="3" paint-order="stroke">
            定底 <tspan font-family="'Times New Roman', serif" font-style="italic">OA</tspan>
          </text>
        ` : ''}

        <line x1="${ax}" y1="${ay}" x2="${bx}" y2="${by}" stroke="#1e293b" stroke-width="2.2"/>
        <line x1="${ox}" y1="${oy}" x2="${bx}" y2="${by}" stroke="#1e293b" stroke-width="2.2"/>

        <line x1="24" y1="${oy}" x2="436" y2="${oy}" stroke="#1e293b" stroke-width="2" marker-end="url(#arrAp3)"/>
        <line x1="${ox}" y1="340" x2="${ox}" y2="18" stroke="#1e293b" stroke-width="2" marker-end="url(#arrAp3)"/>
        <text x="428" y="${oy + 22}" font-family="'Times New Roman', serif" font-style="italic" font-size="17" font-weight="700" fill="#1e293b">x</text>
        <text x="${ox - 20}" y="28" font-family="'Times New Roman', serif" font-style="italic" font-size="17" font-weight="700" fill="#1e293b">y</text>
        <text x="${ox - 18}" y="${oy + 20}" font-family="'Times New Roman', serif" font-style="italic" font-size="16" font-weight="700" fill="#1e293b">O</text>

        <path d="${branchQ1}" fill="none" stroke="${step >= 1 ? '#2563eb' : '#1e293b'}" stroke-width="3" stroke-linecap="round"/>

        <g transform="translate(${tx(2.25)}, ${ty(0.95)})">
          <text x="0" y="0" font-size="16" font-weight="700" fill="#1e293b" stroke="#ffffff" stroke-width="3.5" paint-order="stroke">
            <tspan font-family="'Times New Roman', serif" font-style="italic">y</tspan><tspan font-family="'Times New Roman', serif"> = </tspan>
          </text>
          <text x="32" y="-7" font-family="'Times New Roman', serif" font-size="15" font-weight="700" fill="#1e293b" text-anchor="middle" stroke="#ffffff" stroke-width="3.5" paint-order="stroke">1</text>
          <line x1="24" y1="-4" x2="40" y2="-4" stroke="#1e293b" stroke-width="1.8"/>
          <text x="32" y="11" font-family="'Times New Roman', serif" font-style="italic" font-size="15" font-weight="700" fill="#1e293b" text-anchor="middle" stroke="#ffffff" stroke-width="3.5" paint-order="stroke">x</text>
        </g>

        <circle cx="${ax}" cy="${ay}" r="4.5" fill="#0f766e" stroke="#ffffff" stroke-width="1.5"/>
        <circle cx="${bx}" cy="${by}" r="5.5" fill="${step >= 1 ? '#dc2626' : '#1e293b'}" stroke="#ffffff" stroke-width="1.5"/>
        <text x="${ax - 12}" y="${ay - 4}" font-family="'Times New Roman', serif" font-style="italic" font-size="16" font-weight="700" fill="#1e293b" text-anchor="end" stroke="#ffffff" stroke-width="3" paint-order="stroke">A</text>
        <text x="${bx + 10}" y="${by - 6}" font-family="'Times New Roman', serif" font-style="italic" font-size="16" font-weight="700" fill="#1e293b" text-anchor="start" stroke="#ffffff" stroke-width="3" paint-order="stroke">B</text>

        ${step >= 2 ? `
          <path d="M ${tx(1.15)},${ty(1 / 1.15 - 0.15)} Q ${tx(0.72)},${ty(1 / 0.72 - 0.12)} ${tx(0.48)},${ty(1 / 0.48 - 0.1)}" fill="none" stroke="#dc2626" stroke-width="2.2" stroke-dasharray="4,3" marker-end="url(#arrMove3)"/>
          <text x="${tx(1.45)}" y="${ty(2.25)}" font-size="14" font-weight="700" fill="#dc2626" stroke="#ffffff" stroke-width="3.5" paint-order="stroke">
            <tspan font-family="'Times New Roman', serif" font-style="italic">y</tspan><tspan font-family="'Times New Roman', serif" font-size="10" dy="3">B</tspan><tspan dy="-3">增大 &rarr; 高 </tspan><tspan font-family="'Times New Roman', serif" font-style="italic">x</tspan><tspan font-family="'Times New Roman', serif" font-size="10" dy="3">B</tspan><tspan dy="-3">减小</tspan>
          </text>
        ` : ''}

        ${step >= 3 ? `
          <rect x="196" y="20" width="248" height="36" rx="8" fill="#dcfce7" stroke="#16a34a" stroke-width="1.6"/>
          <text x="320" y="43" font-size="14" font-weight="700" fill="#15803d" text-anchor="middle">
            高 <tspan font-family="'Times New Roman', serif" font-style="italic">x</tspan><tspan font-family="'Times New Roman', serif" font-style="italic" font-size="10" dy="3">B</tspan><tspan font-family="'Times New Roman', serif" dy="-3">=${xB.toFixed(2)} &rarr; </tspan><tspan font-family="'Times New Roman', serif" font-style="italic">S</tspan><tspan font-family="'Times New Roman', serif">=${areaVal}</tspan> 逐渐减小(选<tspan font-family="'Times New Roman', serif">C</tspan>)
          </text>
        ` : ''}
      </svg>
    `;

    const scene = root.querySelector('#scene');
    if (scene) scene.innerHTML = svgHTML;
  },

  // ==================== Sim 10: apply4Sim (Layout B: 左解右图) ====================
  apply4Sim(simState, isInit) {
    if (isInit) {
      simState.step = 0;
      clearManualOverrides(simState);
    }
    const root = activeRoot();
    const step = Number(simState.step || 0);
    const controls = root.querySelector('#controls');
    if (controls) {
      controls.innerHTML = stepBar(step, 4);
    }

    const ox = 205, oy = 180, sc = 36;
    const tx = x => (ox + x * sc).toFixed(1);
    const ty = y => (oy - y * sc).toFixed(1);

    const buildBranch = (xStart, xEnd, nPts = 55) => {
      const pts = [];
      for (let i = 0; i <= nPts; i++) {
        const x = xStart + (xEnd - xStart) * (i / nPts);
        const y = 2 / x;
        pts.push(`${i === 0 ? 'M' : 'L'}${tx(x)},${ty(y)}`);
      }
      return pts.join(' ');
    };

    const branchQ1 = buildBranch(0.45, 6.4);
    const branchQ3 = buildBranch(-5.1, -0.45);
    const branchStep2 = buildBranch(-5.1, -2.0, 35);
    const branchStep4 = buildBranch(3.0, 6.0, 35);

    const svgHTML = `
      <svg viewBox="0 0 460 360" style="width:100%;height:100%;max-height:100%;display:block;background:#ffffff;border-radius:10px;border:1.5px solid #cbd5e1;">
        <defs>
          <marker id="arrAp4" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,1 L9,5 L0,9 Z" fill="#1e293b"/>
          </marker>
        </defs>

        ${[-4, -2, 2, 4, 6].map(g => `
          <line x1="${tx(g)}" y1="16" x2="${tx(g)}" y2="344" stroke="#f1f5f9" stroke-width="1"/>
        `).join('')}
        ${[-4, -2, 2, 4].map(g => `
          <line x1="16" y1="${ty(g)}" x2="444" y2="${ty(g)}" stroke="#f1f5f9" stroke-width="1"/>
        `).join('')}

        ${step === 3 ? `
          <rect x="16" y="16" width="428" height="${(ty(-1) - 16).toFixed(1)}" fill="#fef3c7" fill-opacity="0.45"/>
          <line x1="16" y1="${ty(-1)}" x2="444" y2="${ty(-1)}" stroke="#d97706" stroke-width="1.8" stroke-dasharray="6,4"/>
          <text x="436" y="${Number(ty(-1)) + 16}" font-size="13" font-weight="700" fill="#b45309" text-anchor="end" stroke="#ffffff" stroke-width="3" paint-order="stroke">
            <tspan font-family="'Times New Roman', serif" font-style="italic">y</tspan><tspan font-family="'Times New Roman', serif"> = -1</tspan>
          </text>
        ` : ''}

        <line x1="16" y1="${oy}" x2="444" y2="${oy}" stroke="#1e293b" stroke-width="1.9" marker-end="url(#arrAp4)"/>
        <line x1="${ox}" y1="344" x2="${ox}" y2="16" stroke="#1e293b" stroke-width="1.9" marker-end="url(#arrAp4)"/>
        <text x="436" y="${oy + 20}" font-family="'Times New Roman', serif" font-style="italic" font-size="16" font-weight="700" fill="#1e293b">x</text>
        <text x="${ox - 18}" y="28" font-family="'Times New Roman', serif" font-style="italic" font-size="16" font-weight="700" fill="#1e293b">y</text>
        <text x="${ox + 8}" y="${oy + 18}" font-family="'Times New Roman', serif" font-style="italic" font-size="15" font-weight="700" fill="#1e293b">O</text>

        <path d="${branchQ1}" fill="none" stroke="#334155" stroke-width="2.6" stroke-linecap="round"/>
        <path d="${branchQ3}" fill="none" stroke="#334155" stroke-width="2.6" stroke-linecap="round"/>

        <!-- 原图基准点 (-2, -1) 与虚线 -->
        <line x1="${tx(-2)}" y1="${oy}" x2="${tx(-2)}" y2="${ty(-1)}" stroke="${step >= 1 ? '#dc2626' : '#475569'}" stroke-width="1.8" stroke-dasharray="4,3"/>
        <line x1="${ox}" y1="${ty(-1)}" x2="${tx(-2)}" y2="${ty(-1)}" stroke="${step >= 1 ? '#dc2626' : '#475569'}" stroke-width="1.8" stroke-dasharray="4,3"/>
        <circle cx="${tx(-2)}" cy="${ty(-1)}" r="${step >= 1 ? 5.5 : 4}" fill="${step >= 1 ? '#dc2626' : '#1e293b'}" stroke="#ffffff" stroke-width="1.5"/>
        <text x="${tx(-2)}" y="${oy - 8}" font-family="'Times New Roman', serif" font-size="14.5" font-weight="700" fill="#1e293b" text-anchor="middle" stroke="#ffffff" stroke-width="3" paint-order="stroke">-2</text>
        <text x="${ox + 14}" y="${Number(ty(-1)) + 5}" font-family="'Times New Roman', serif" font-size="14.5" font-weight="700" fill="${step >= 1 ? '#dc2626' : '#1e293b'}" text-anchor="start" stroke="#ffffff" stroke-width="3" paint-order="stroke">-1</text>

        <g transform="translate(${tx(1.85)}, ${ty(2.85)})">
          <text x="0" y="0" font-size="15.5" font-weight="700" fill="#1e293b" stroke="#ffffff" stroke-width="3.5" paint-order="stroke">
            <tspan font-family="'Times New Roman', serif" font-style="italic">y</tspan><tspan font-family="'Times New Roman', serif"> = </tspan>
          </text>
          <text x="32" y="-7" font-family="'Times New Roman', serif" font-size="14.5" font-weight="700" fill="#1e293b" text-anchor="middle" stroke="#ffffff" stroke-width="3.5" paint-order="stroke">2</text>
          <line x1="24" y1="-4" x2="40" y2="-4" stroke="#1e293b" stroke-width="1.8"/>
          <text x="32" y="10" font-family="'Times New Roman', serif" font-style="italic" font-size="14.5" font-weight="700" fill="#1e293b" text-anchor="middle" stroke="#ffffff" stroke-width="3.5" paint-order="stroke">x</text>
        </g>

        ${step === 1 ? `
          <text x="${Number(tx(-2)) - 10}" y="${Number(ty(-1)) + 18}" font-size="14" font-weight="700" fill="#dc2626" text-anchor="end" stroke="#ffffff" stroke-width="3.5" paint-order="stroke">
            ① 当 <tspan font-family="'Times New Roman', serif" font-style="italic">x</tspan><tspan font-family="'Times New Roman', serif">=-2</tspan> 时，<tspan font-family="'Times New Roman', serif" font-style="italic">y</tspan><tspan font-family="'Times New Roman', serif">=-1</tspan>
          </text>
        ` : ''}

        ${step === 2 ? `
          <path d="${branchStep2}" fill="none" stroke="#16a34a" stroke-width="4.5" stroke-linecap="round"/>
          <line x1="20" y1="${oy}" x2="${tx(-2)}" y2="${oy}" stroke="#16a34a" stroke-width="4"/>
          <line x1="${ox}" y1="${ty(-1)}" x2="${ox}" y2="${oy}" stroke="#16a34a" stroke-width="5"/>
          <circle cx="${tx(-2)}" cy="${ty(-1)}" r="5" fill="#ffffff" stroke="#16a34a" stroke-width="2.5"/>
          <text x="${tx(-3.5)}" y="${ty(-1.45)}" font-size="14" font-weight="700" fill="#15803d" text-anchor="middle" stroke="#ffffff" stroke-width="3.5" paint-order="stroke">
            ② <tspan font-family="'Times New Roman', serif" font-style="italic">x</tspan><tspan font-family="'Times New Roman', serif">&lt;-2</tspan> &rArr; <tspan font-family="'Times New Roman', serif">-1&lt;</tspan><tspan font-family="'Times New Roman', serif" font-style="italic">y</tspan><tspan font-family="'Times New Roman', serif">&lt;0</tspan>
          </text>
        ` : ''}

        ${step === 3 ? `
          <path d="${branchStep2}" fill="none" stroke="#d97706" stroke-width="4.5" stroke-linecap="round"/>
          <path d="${branchQ1}" fill="none" stroke="#d97706" stroke-width="4.5" stroke-linecap="round"/>
          <line x1="20" y1="${oy}" x2="${tx(-2)}" y2="${oy}" stroke="#d97706" stroke-width="4.2"/>
          <line x1="${ox}" y1="${oy}" x2="434" y2="${oy}" stroke="#d97706" stroke-width="4.2"/>
          <circle cx="${tx(-2)}" cy="${ty(-1)}" r="5" fill="#ffffff" stroke="#d97706" stroke-width="2.5"/>
          <circle cx="${ox}" cy="${oy}" r="4.5" fill="#ffffff" stroke="#d97706" stroke-width="2.2"/>
          <text x="108" y="52" font-size="14" font-weight="700" fill="#b45309" text-anchor="middle" stroke="#ffffff" stroke-width="3.5" paint-order="stroke">
            ③ <tspan font-family="'Times New Roman', serif" font-style="italic">y</tspan><tspan font-family="'Times New Roman', serif">&gt;-1</tspan> &rArr; <tspan font-family="'Times New Roman', serif" font-style="italic">x</tspan><tspan font-family="'Times New Roman', serif">&lt;-2</tspan> 或 <tspan font-family="'Times New Roman', serif" font-style="italic">x</tspan><tspan font-family="'Times New Roman', serif">&gt;0</tspan>
          </text>
        ` : ''}

        ${step >= 4 ? `
          <path d="${branchStep4}" fill="none" stroke="#2563eb" stroke-width="4.8" stroke-linecap="round"/>
          <line x1="${tx(3)}" y1="${oy}" x2="${tx(3)}" y2="${ty(2 / 3)}" stroke="#2563eb" stroke-width="1.8" stroke-dasharray="4,3"/>
          <line x1="${tx(6)}" y1="${oy}" x2="${tx(6)}" y2="${ty(1 / 3)}" stroke="#2563eb" stroke-width="1.8" stroke-dasharray="4,3"/>
          <line x1="${ox}" y1="${ty(2 / 3)}" x2="${tx(3)}" y2="${ty(2 / 3)}" stroke="#2563eb" stroke-width="1.8" stroke-dasharray="4,3"/>
          <line x1="${ox}" y1="${ty(1 / 3)}" x2="${tx(6)}" y2="${ty(1 / 3)}" stroke="#2563eb" stroke-width="1.8" stroke-dasharray="4,3"/>
          <line x1="${tx(3)}" y1="${oy}" x2="${tx(6)}" y2="${oy}" stroke="#2563eb" stroke-width="4.2"/>
          <line x1="${ox}" y1="${ty(2 / 3)}" x2="${ox}" y2="${ty(1 / 3)}" stroke="#2563eb" stroke-width="5"/>
          <circle cx="${tx(3)}" cy="${ty(2 / 3)}" r="4.5" fill="#2563eb" stroke="#ffffff" stroke-width="1.2"/>
          <circle cx="${tx(6)}" cy="${ty(1 / 3)}" r="4.5" fill="#2563eb" stroke="#ffffff" stroke-width="1.2"/>
          <text x="${tx(3)}" y="${oy + 18}" font-family="'Times New Roman', serif" font-size="14" font-weight="700" fill="#1d4ed8" text-anchor="middle">3</text>
          <text x="${tx(6)}" y="${oy + 18}" font-family="'Times New Roman', serif" font-size="14" font-weight="700" fill="#1d4ed8" text-anchor="middle">6</text>
          <g transform="translate(${tx(3.15)}, ${ty(2.05)})">
            <text x="0" y="0" font-size="13.5" font-weight="700" fill="#1d4ed8" stroke="#ffffff" stroke-width="3.5" paint-order="stroke">④ </text>
            <text x="24" y="-7" font-family="'Times New Roman', serif" font-size="12.5" font-weight="700" fill="#1d4ed8" text-anchor="middle" stroke="#ffffff" stroke-width="3" paint-order="stroke">1</text>
            <line x1="18" y1="-4" x2="30" y2="-4" stroke="#1d4ed8" stroke-width="1.6"/>
            <text x="24" y="9" font-family="'Times New Roman', serif" font-size="12.5" font-weight="700" fill="#1d4ed8" text-anchor="middle" stroke="#ffffff" stroke-width="3" paint-order="stroke">3</text>
            <text x="50" y="0" font-size="13.5" font-weight="700" fill="#1d4ed8" text-anchor="middle" stroke="#ffffff" stroke-width="3.5" paint-order="stroke">
              <tspan font-family="'Times New Roman', serif">&le; </tspan><tspan font-family="'Times New Roman', serif" font-style="italic">y</tspan><tspan font-family="'Times New Roman', serif"> &le;</tspan>
            </text>
            <text x="76" y="-7" font-family="'Times New Roman', serif" font-size="12.5" font-weight="700" fill="#1d4ed8" text-anchor="middle" stroke="#ffffff" stroke-width="3" paint-order="stroke">2</text>
            <line x1="70" y1="-4" x2="82" y2="-4" stroke="#1d4ed8" stroke-width="1.6"/>
            <text x="76" y="9" font-family="'Times New Roman', serif" font-size="12.5" font-weight="700" fill="#1d4ed8" text-anchor="middle" stroke="#ffffff" stroke-width="3" paint-order="stroke">3</text>
          </g>
        ` : ''}
      </svg>
    `;

    const scene = root.querySelector('#scene');
    if (scene) scene.innerHTML = svgHTML;
  },

  // ==================== Sim 11: apply5Sim (Layout B: 左解右图 · 严格零剧透空白坐标系) ====================
  apply5Sim(simState, isInit) {
    if (isInit) {
      simState.step = 0;
      simState.mVal = 1;
      clearManualOverrides(simState);
    }
    const root = activeRoot();
    const step = Number(simState.step || 0);
    if (simState.mVal === undefined) simState.mVal = 1;
    const mVal = Number(simState.mVal);
    const kVal = mVal * mVal + 1;

    const controls = root.querySelector('#controls');
    if (controls) {
      controls.innerHTML = stepBar(step, 3) + (step >= 1
        ? slider('mVal', '调节参数<i class="m">m</i>（恒有<i class="m">m</i><sup><span class="num">2</span></sup><span class="num">+1&gt;0</span>）', -1.5, 1.5, mVal, 0.25)
        : '');
    }

    const ox = 230, oy = 180, sc = 42;
    const tx = x => (ox + x * sc).toFixed(1);
    const ty = y => (oy - y * sc).toFixed(1);

    const buildCurve = (xStart, xEnd, nPts = 55) => {
      const pts = [];
      for (let i = 0; i <= nPts; i++) {
        const x = xStart + (xEnd - xStart) * (i / nPts);
        const y = kVal / x;
        if (Math.abs(y) <= 4.1) {
          pts.push(`${pts.length === 0 ? 'M' : 'L'}${tx(x)},${ty(y)}`);
        }
      }
      return pts.join(' ');
    };

    const curveQ1 = buildCurve(0.45, 4.8);
    const curveQ3 = buildCurve(-4.8, -0.45);

    const x1 = -2, y1 = kVal / x1;
    const x2 = 2, y2 = kVal / x2;
    const x3 = 3, y3 = kVal / x3;

    const svgHTML = `
      <svg viewBox="0 0 460 360" style="width:100%;height:100%;max-height:100%;display:block;background:#ffffff;border-radius:10px;border:1.5px solid #cbd5e1;">
        <defs>
          <marker id="arrAp5" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,1 L9,5 L0,9 Z" fill="#334155"/>
          </marker>
          <marker id="arrUp5" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,1 L9,5 L0,9 Z" fill="#dc2626"/>
          </marker>
        </defs>

        ${[-4, -3, -2, -1, 1, 2, 3, 4].map(g => `
          <line x1="${tx(g)}" y1="16" x2="${tx(g)}" y2="344" stroke="#f1f5f9" stroke-width="1"/>
        `).join('')}
        ${[-3, -2, -1, 1, 2, 3].map(g => `
          <line x1="16" y1="${ty(g)}" x2="444" y2="${ty(g)}" stroke="#f1f5f9" stroke-width="1"/>
        `).join('')}

        ${step >= 1 ? `
          <rect x="${ox + 4}" y="18" width="206" height="${oy - 22}" fill="#eff6ff" opacity="0.45" rx="6"/>
          <rect x="20" y="${oy + 4}" width="206" height="${oy - 22}" fill="#eff6ff" opacity="0.45" rx="6"/>
          <text x="366" y="38" font-size="14" font-weight="700" fill="#1d4ed8" text-anchor="middle" stroke="#ffffff" stroke-width="3" paint-order="stroke">第一象限（<tspan font-family="'Times New Roman', serif" font-style="italic">y</tspan><tspan font-family="'Times New Roman', serif">&gt;0</tspan>）</text>
          <text x="92" y="332" font-size="14" font-weight="700" fill="#1d4ed8" text-anchor="middle" stroke="#ffffff" stroke-width="3" paint-order="stroke">第三象限（<tspan font-family="'Times New Roman', serif" font-style="italic">y</tspan><tspan font-family="'Times New Roman', serif">&lt;0</tspan>）</text>
          <path d="${curveQ1}" fill="none" stroke="#2563eb" stroke-width="3.2" stroke-linecap="round"/>
          <path d="${curveQ3}" fill="none" stroke="#2563eb" stroke-width="3.2" stroke-linecap="round"/>
          <g transform="translate(${tx(1.55)}, ${ty(2.85)})">
            <text x="0" y="0" font-size="14.5" font-weight="700" fill="#1e40af" stroke="#ffffff" stroke-width="3.5" paint-order="stroke">
              <tspan font-family="'Times New Roman', serif" font-style="italic">y</tspan><tspan font-family="'Times New Roman', serif"> = </tspan>
            </text>
            <text x="48" y="-8" font-size="13.5" font-weight="700" fill="#1e40af" text-anchor="middle" stroke="#ffffff" stroke-width="3.5" paint-order="stroke">
              <tspan font-family="'Times New Roman', serif" font-style="italic">m</tspan><tspan font-family="'Times New Roman', serif" font-size="10" dy="-4">2</tspan><tspan font-family="'Times New Roman', serif" dy="4">+1</tspan>
            </text>
            <line x1="25" y1="-4" x2="71" y2="-4" stroke="#1e40af" stroke-width="1.8"/>
            <text x="48" y="10" font-family="'Times New Roman', serif" font-style="italic" font-size="13.5" font-weight="700" fill="#1e40af" text-anchor="middle" stroke="#ffffff" stroke-width="3.5" paint-order="stroke">x</text>
          </g>
        ` : ''}

        <line x1="16" y1="${oy}" x2="444" y2="${oy}" stroke="#334155" stroke-width="1.8" marker-end="url(#arrAp5)"/>
        <line x1="${ox}" y1="346" x2="${ox}" y2="14" stroke="#334155" stroke-width="1.8" marker-end="url(#arrAp5)"/>
        <text x="436" y="${oy + 20}" font-family="'Times New Roman', serif" font-style="italic" font-size="16" font-weight="700" fill="#1e293b">x</text>
        <text x="${ox + 12}" y="26" font-family="'Times New Roman', serif" font-style="italic" font-size="16" font-weight="700" fill="#1e293b">y</text>
        <text x="${ox - 15}" y="${oy + 18}" font-family="'Times New Roman', serif" font-style="italic" font-size="14" font-weight="700" fill="#475569">O</text>

        ${[-3, -2, -1, 1, 2, 3].map(k => `
          <line x1="${tx(k)}" y1="${oy - 4}" x2="${tx(k)}" y2="${oy + 4}" stroke="#334155" stroke-width="1.5"/>
          <text x="${tx(k)}" y="${oy + 18}" font-family="'Times New Roman', serif" font-size="13" fill="#475569" text-anchor="middle">${k}</text>
        `).join('')}

        ${step >= 2 ? `
          <line x1="${tx(x1)}" y1="${oy}" x2="${tx(x1)}" y2="${ty(y1)}" stroke="#0284c7" stroke-width="1.8" stroke-dasharray="4,3"/>
          <line x1="${tx(x2)}" y1="${oy}" x2="${tx(x2)}" y2="${ty(y2)}" stroke="#16a34a" stroke-width="1.8" stroke-dasharray="4,3"/>
          <line x1="${tx(x3)}" y1="${oy}" x2="${tx(x3)}" y2="${ty(y3)}" stroke="#7c3aed" stroke-width="1.8" stroke-dasharray="4,3"/>

          <circle cx="${tx(x1)}" cy="${ty(y1)}" r="5" fill="#0284c7" stroke="#ffffff" stroke-width="1.5"/>
          <circle cx="${tx(x2)}" cy="${ty(y2)}" r="5" fill="#16a34a" stroke="#ffffff" stroke-width="1.5"/>
          <circle cx="${tx(x3)}" cy="${ty(y3)}" r="5" fill="#7c3aed" stroke="#ffffff" stroke-width="1.5"/>

          <text x="${Number(tx(x1)) - 8}" y="${Number(ty(y1)) + 16}" font-size="13.5" font-weight="700" fill="#0369a1" text-anchor="end" stroke="#ffffff" stroke-width="3.5" paint-order="stroke">
            (-2, <tspan font-family="'Times New Roman', serif" font-style="italic">y</tspan><tspan font-family="'Times New Roman', serif" font-size="10" dy="3">1</tspan><tspan dy="-3">)</tspan>
          </text>
          <text x="${Number(tx(x2)) + 6}" y="${Number(ty(y2)) - 8}" font-size="13.5" font-weight="700" fill="#15803d" text-anchor="start" stroke="#ffffff" stroke-width="3.5" paint-order="stroke">
            (2, <tspan font-family="'Times New Roman', serif" font-style="italic">y</tspan><tspan font-family="'Times New Roman', serif" font-size="10" dy="3">2</tspan><tspan dy="-3">)</tspan>
          </text>
          <text x="${Number(tx(x3)) + 6}" y="${Number(ty(y3)) - 6}" font-size="13.5" font-weight="700" fill="#6d28d9" text-anchor="start" stroke="#ffffff" stroke-width="3.5" paint-order="stroke">
            (3, <tspan font-family="'Times New Roman', serif" font-style="italic">y</tspan><tspan font-family="'Times New Roman', serif" font-size="10" dy="3">3</tspan><tspan dy="-3">)</tspan>
          </text>
        ` : ''}

        ${step >= 3 ? `
          <line x1="${tx(x1)}" y1="${ty(y1)}" x2="${ox}" y2="${ty(y1)}" stroke="#0284c7" stroke-width="1.8" stroke-dasharray="4,3"/>
          <line x1="${tx(x2)}" y1="${ty(y2)}" x2="${ox}" y2="${ty(y2)}" stroke="#16a34a" stroke-width="1.8" stroke-dasharray="4,3"/>
          <line x1="${tx(x3)}" y1="${ty(y3)}" x2="${ox}" y2="${ty(y3)}" stroke="#7c3aed" stroke-width="1.8" stroke-dasharray="4,3"/>

          <circle cx="${ox}" cy="${ty(y1)}" r="4.5" fill="#0284c7" stroke="#ffffff" stroke-width="1.2"/>
          <circle cx="${ox}" cy="${ty(y2)}" r="4.5" fill="#16a34a" stroke="#ffffff" stroke-width="1.2"/>
          <circle cx="${ox}" cy="${ty(y3)}" r="4.5" fill="#7c3aed" stroke="#ffffff" stroke-width="1.2"/>

          <text x="${ox + 10}" y="${Number(ty(y1)) + 5}" font-size="14" font-weight="700" fill="#0369a1" stroke="#ffffff" stroke-width="3.5" paint-order="stroke">
            <tspan font-family="'Times New Roman', serif" font-style="italic">y</tspan><tspan font-family="'Times New Roman', serif" font-size="10" dy="3">1</tspan><tspan dy="-3">（最小）</tspan>
          </text>
          <text x="${ox - 10}" y="${Number(ty(y2)) - 2}" font-size="14" font-weight="700" fill="#15803d" text-anchor="end" stroke="#ffffff" stroke-width="3.5" paint-order="stroke">
            （最大）<tspan font-family="'Times New Roman', serif" font-style="italic">y</tspan><tspan font-family="'Times New Roman', serif" font-size="10" dy="3">2</tspan>
          </text>
          <text x="${ox - 10}" y="${Number(ty(y3)) + 6}" font-size="14" font-weight="700" fill="#6d28d9" text-anchor="end" stroke="#ffffff" stroke-width="3.5" paint-order="stroke">
            <tspan font-family="'Times New Roman', serif" font-style="italic">y</tspan><tspan font-family="'Times New Roman', serif" font-size="10" dy="3">3</tspan>
          </text>

          <rect x="26" y="24" width="184" height="32" rx="7" fill="#dcfce7" stroke="#16a34a" stroke-width="1.5"/>
          <text x="118" y="45" font-size="14" font-weight="700" fill="#15803d" text-anchor="middle">
            结论：<tspan font-family="'Times New Roman', serif" font-style="italic">y</tspan><tspan font-family="'Times New Roman', serif" font-size="10" dy="3">1</tspan><tspan font-family="'Times New Roman', serif" dy="-3"> &lt; </tspan><tspan font-family="'Times New Roman', serif" font-style="italic">y</tspan><tspan font-family="'Times New Roman', serif" font-size="10" dy="3">3</tspan><tspan font-family="'Times New Roman', serif" dy="-3"> &lt; </tspan><tspan font-family="'Times New Roman', serif" font-style="italic">y</tspan><tspan font-family="'Times New Roman', serif" font-size="10" dy="3">2</tspan>
          </text>
        ` : ''}
      </svg>
    `;

    const scene = root.querySelector('#scene');
    if (scene) scene.innerHTML = svgHTML;
  },

  // ==================== Sim 12: apply6Sim (Layout B: 左解右图 · 拉窗帘等积变形) ====================
  apply6Sim(simState, isInit) {
    if (isInit) {
      simState.step = 0;
      simState.yC = 1.95;
      clearManualOverrides(simState);
    }
    const root = activeRoot();
    const step = Number(simState.step || 0);
    if (simState.yC === undefined) simState.yC = 1.95;
    const yC = Number(simState.yC);

    const controls = root.querySelector('#controls');
    if (controls) {
      controls.innerHTML = stepBar(step, 3) + (step >= 1
        ? slider('yC', '沿<i class="m">y</i>轴拖动点<i class="m">C</i>至原点<i class="m">O</i>（等积变形）', 0, 2.5, yC, 0.05)
        : '');
    }

    const ox = 305, oy = 295, sc = 76;
    const tx = x => (ox + x * sc).toFixed(1);
    const ty = y => (oy - y * sc).toFixed(1);

    const kPlot = -3.4;
    const axVal = -1.25, ayVal = kPlot / axVal;
    const pts = [];
    for (let i = 0; i <= 60; i++) {
      const x = -3.65 + (-0.95 - (-3.65)) * (i / 60);
      const y = kPlot / x;
      pts.push(`${i === 0 ? 'M' : 'L'}${tx(x)},${ty(y)}`);
    }
    const branchQ2 = pts.join(' ');

    const ax = Number(tx(axVal)), ay = Number(ty(ayVal));
    const bx = ax, by = oy;
    const cx = ox, cy = Number(ty(step >= 1 ? yC : 1.95));

    const svgHTML = `
      <svg viewBox="0 0 460 360" style="width:100%;height:100%;max-height:100%;display:block;background:#ffffff;border-radius:10px;border:1.5px solid #cbd5e1;">
        <defs>
          <marker id="arrAp6" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,1 L9,5 L0,9 Z" fill="#1e293b"/>
          </marker>
        </defs>

        ${[-3, -2, -1, 1].map(g => `
          <line x1="${tx(g)}" y1="18" x2="${tx(g)}" y2="338" stroke="#f1f5f9" stroke-width="1"/>
        `).join('')}
        ${[1, 2, 3].map(g => `
          <line x1="20" y1="${ty(g)}" x2="438" y2="${ty(g)}" stroke="#f1f5f9" stroke-width="1"/>
        `).join('')}

        ${step >= 1 ? `
          <polygon points="${ax},${ay} ${bx},${by} ${ox},${oy}" fill="#dcfce7" fill-opacity="0.72" stroke="#16a34a" stroke-width="2" stroke-dasharray="5,4"/>
          <line x1="${ax}" y1="${ay}" x2="${ox}" y2="${oy}" stroke="#dc2626" stroke-width="2.6" stroke-dasharray="6,4"/>
        ` : ''}

        <polygon points="${ax},${ay} ${bx},${by} ${cx},${cy}" fill="${step >= 1 ? 'rgba(147,197,253,0.48)' : '#cbd5e1'}" stroke="#1e293b" stroke-width="2.2"/>

        <polyline points="${bx - 12},${by} ${bx - 12},${by - 12} ${bx},${by - 12}" fill="none" stroke="#1e293b" stroke-width="1.8"/>

        <line x1="20" y1="${oy}" x2="436" y2="${oy}" stroke="#1e293b" stroke-width="2" marker-end="url(#arrAp6)"/>
        <line x1="${ox}" y1="342" x2="${ox}" y2="18" stroke="#1e293b" stroke-width="2" marker-end="url(#arrAp6)"/>
        <text x="428" y="${oy + 22}" font-family="'Times New Roman', serif" font-style="italic" font-size="17" font-weight="700" fill="#1e293b">x</text>
        <text x="${ox - 20}" y="28" font-family="'Times New Roman', serif" font-style="italic" font-size="17" font-weight="700" fill="#1e293b">y</text>
        <text x="${ox + 10}" y="${oy + 20}" font-family="'Times New Roman', serif" font-style="italic" font-size="16" font-weight="700" fill="#1e293b">O</text>

        <path d="${branchQ2}" fill="none" stroke="${step >= 3 ? '#2563eb' : '#1e293b'}" stroke-width="3" stroke-linecap="round"/>

        <circle cx="${ax}" cy="${ay}" r="4.5" fill="#1e293b"/>
        <circle cx="${bx}" cy="${by}" r="4" fill="#1e293b"/>
        <circle cx="${cx}" cy="${cy}" r="${step >= 1 ? 5.5 : 4}" fill="${step >= 1 ? '#dc2626' : '#1e293b'}" stroke="#ffffff" stroke-width="1.2"/>

        <text x="${ax - 12}" y="${ay - 4}" font-family="'Times New Roman', serif" font-style="italic" font-size="16" font-weight="700" fill="#1e293b" text-anchor="end" stroke="#ffffff" stroke-width="3" paint-order="stroke">A</text>
        <text x="${bx}" y="${by + 20}" font-family="'Times New Roman', serif" font-style="italic" font-size="16" font-weight="700" fill="#1e293b" text-anchor="middle" stroke="#ffffff" stroke-width="3" paint-order="stroke">B</text>
        <text x="${cx + 12}" y="${cy + 5}" font-family="'Times New Roman', serif" font-style="italic" font-size="16" font-weight="700" fill="${step >= 1 ? '#dc2626' : '#1e293b'}" text-anchor="start" stroke="#ffffff" stroke-width="3" paint-order="stroke">C</text>

        ${step >= 1 ? `
          <text x="118" y="42" font-size="14" font-weight="700" fill="#15803d" text-anchor="middle" stroke="#ffffff" stroke-width="3.5" paint-order="stroke">
            <tspan font-family="'Times New Roman', serif" font-style="italic">AB</tspan><tspan font-family="'Times New Roman', serif"> &parallel; </tspan><tspan font-family="'Times New Roman', serif" font-style="italic">y</tspan>轴 <tspan font-family="'Times New Roman', serif">&rArr; </tspan><tspan font-family="'Times New Roman', serif" font-style="italic">S</tspan><tspan font-family="'Times New Roman', serif" font-size="10" dy="3">&triangle;</tspan><tspan font-family="'Times New Roman', serif" font-style="italic" font-size="10">ABO</tspan><tspan font-family="'Times New Roman', serif" dy="-3"> = </tspan><tspan font-family="'Times New Roman', serif" font-style="italic">S</tspan><tspan font-family="'Times New Roman', serif" font-size="10" dy="3">&triangle;</tspan><tspan font-family="'Times New Roman', serif" font-style="italic" font-size="10">ABC</tspan><tspan font-family="'Times New Roman', serif" dy="-3"> = 6</tspan>
          </text>
        ` : ''}

        ${step >= 2 ? `
          <g transform="translate(26, 62)">
            <rect x="0" y="0" width="186" height="44" rx="8" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.5"/>
            <text x="12" y="27" font-size="14" font-weight="700" fill="#1d4ed8">
              <tspan font-family="'Times New Roman', serif" font-style="italic">S</tspan><tspan font-family="'Times New Roman', serif" font-size="10" dy="3">&triangle;</tspan><tspan font-family="'Times New Roman', serif" font-style="italic" font-size="10">ABO</tspan><tspan font-family="'Times New Roman', serif" dy="-3"> = </tspan>
            </text>
            <text x="73" y="18" font-family="'Times New Roman', serif" font-size="12.5" font-weight="700" fill="#1d4ed8" text-anchor="middle">1</text>
            <line x1="66" y1="22" x2="80" y2="22" stroke="#1d4ed8" stroke-width="1.6"/>
            <text x="73" y="35" font-family="'Times New Roman', serif" font-size="12.5" font-weight="700" fill="#1d4ed8" text-anchor="middle">2</text>
            <text x="86" y="27" font-size="14" font-weight="700" fill="#1d4ed8">
              <tspan font-family="'Times New Roman', serif">|</tspan><tspan font-family="'Times New Roman', serif" font-style="italic">k</tspan><tspan font-family="'Times New Roman', serif">| = 6 &rArr; |</tspan><tspan font-family="'Times New Roman', serif" font-style="italic">k</tspan><tspan font-family="'Times New Roman', serif">| = 12</tspan>
            </text>
          </g>
        ` : ''}

        ${step >= 3 ? `
          <rect x="26" y="114" width="186" height="34" rx="8" fill="#dcfce7" stroke="#16a34a" stroke-width="1.5"/>
          <text x="119" y="136" font-size="14" font-weight="700" fill="#15803d" text-anchor="middle">
            图象在第二象限 <tspan font-family="'Times New Roman', serif">&rArr; </tspan><tspan font-family="'Times New Roman', serif" font-style="italic">k</tspan><tspan font-family="'Times New Roman', serif"> = -12</tspan>
          </text>
        ` : ''}
      </svg>
    `;

    const scene = root.querySelector('#scene');
    if (scene) scene.innerHTML = svgHTML;
  }
});

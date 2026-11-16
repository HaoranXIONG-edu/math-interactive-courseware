// 全九大自适应版式（Layouts A–I）+ 标准教学封面 一览演示课件
window.COURSEWARE_TITLE = "九大版式全景图鉴 A–I";
window.COURSEWARE_PHASES = [
  ['① 封面导览', '九大版式总览'],
  ['② 解题A–E', '讲练与探究'],
  ['③ 归纳F–H', '对比与辨析'],
  ['④ 小结I', '思维导图']
];

// 0. 标准教学封面页
window.defineSlide({
  cover: true,
  lesson: 1,
  phase: 0,
  navTag: "版式总览",
  section: "版式总览",
  chapter: "希沃交互式数学动态课件 · 版式规范",
  num: "A–I",
  title: "九大自适应版式全景图鉴",
  caption: "覆盖“新知归纳 · 讲练结合 · 多解对比 · 表格梳理 · 思维导图”全教学环节",
  chapterTheme: "quadratic",
  goals: [
    "<b>解题讲练类（Layouts A–E）</b>：无图纯代数（A）、左解右图综合（B）、四图选择（C）、列表描点作图（D）、多点验算卡片（E）；",
    "<b>新知与归纳类（Layouts F–I）</b>：左要领右演算对照（F）、多解法对比辨析（G）、教研级对比表（H）、全屏交互式思维导图（I）。"
  ]
});

// 1. 版式 A：无配图纯代数/概念辨析题
window.defineSlide({
  lesson: 1,
  phase: 1,
  navTag: "版式 A",
  section: "解题版式 A–E",
  title: "版式 A（layout-a）：无配图纯代数 / 概念辨析",
  layout: "layout-a",
  stem: `<p><b>【版式 A 示例】</b>已知关于<i class="m">x</i>的方程<span class="math">(<i class="m">m</i><span class="num">-1</span>)<i class="m">x</i><sup>|<i class="m">m</i>|+<span class="num">1</span></sup><span class="num">+2</span><i class="m">x</i><span class="num">-3=0</span></span>是一元二次方程，则<i class="m">m</i>的值为<span class="screen-blank" data-step="3" data-ans="-1"></span>．</p>`,
  steps: [
    {
      title: "抓最高次数",
      html: `由一元二次方程的定义，未知数最高次数为<span class="num">2</span>，得<span class="math">|<i class="m">m</i>|<span class="num">+1=2</span></span>，解得<span class="math"><i class="m">m</i><span class="num">=±1</span></span>．`
    },
    {
      title: "查二次项系数",
      html: `二次项系数不能为<span class="num">0</span>，即<span class="math"><i class="m">m</i><span class="num">-1≠0</span></span>，故<span class="math"><i class="m">m</i><span class="num">≠1</span></span>．`
    },
    {
      title: "综合得解",
      html: `综上，<span class="math"><i class="m">m</i><span class="num">=-1</span></span>（答案已同步回填题干横线）．`
    }
  ]
});

// 2. 版式 B：单配图几何/函数综合题（左解右图 + 零剧透辅助线 + 数字角）
window.defineSlide({
  lesson: 1,
  phase: 1,
  navTag: "版式 B",
  section: "解题版式 A–E",
  title: "版式 B（layout-b）：单配图左解右图综合题",
  layout: "layout-b",
  stem: `<p><b>【版式 B 示例】</b>如图，反比例函数<span class="math"><i class="m">y</i>=<span class="fraction"><span><i class="m">k</i></span><span><i class="m">x</i></span></span></span>（<span class="math"><i class="m">x</i>&gt;<span class="num">0</span></span>）的图象经过点<i class="m">A</i>(<span class="num">2</span>,<span class="num">3</span>)，过点<i class="m">A</i>作<i class="m">AB</i>⊥<i class="m">x</i>轴于点<i class="m">B</i>，则△<i class="m">AOB</i>的面积为<span class="screen-blank" data-step="3" data-ans="3"></span>．</p>`,
  steps: [
    {
      title: "确定解析式系数",
      html: `将点<i class="m">A</i>(<span class="num">2</span>,<span class="num">3</span>)代入<span class="math"><i class="m">y</i>=<span class="fraction"><span><i class="m">k</i></span><span><i class="m">x</i></span></span></span>，得<span class="math"><i class="m">k</i>=<span class="num">2×3=6</span></span>．`
    },
    {
      title: "表出直角边长",
      html: `由<i class="m">AB</i>⊥<i class="m">x</i>轴，得<span class="math"><i class="m">OB</i>=<span class="num">2</span></span>，<span class="math"><i class="m">AB</i>=<span class="num">3</span></span>（图中标出绿色高亮直角三角形）．`
    },
    {
      title: "利用几何意义求面积",
      html: `<span class="math"><i class="m">S</i><sub>△<i class="m">AOB</i></sub>=<span class="fraction"><span><span class="num">1</span></span><span><span class="num">2</span></span></span>|<i class="m">k</i>|=<span class="fraction"><span><span class="num">1</span></span><span><span class="num">2</span></span></span>×<span class="num">6=3</span></span>．`
    }
  ],
  renderScene: function(step) {
    const cv = window.createCoordCanvas({ width: 520, height: 400, xRange: [-0.8, 5.2], yRange: [-0.8, 5.2] });
    cv.drawAxes({ xLabel: 'x', yLabel: 'y', step: 1, labelSide: 'quad24' });
    cv.drawHyperbola(6, { xMin: 1.15, xMax: 5.0, color: '#2563eb', width: 2.8 });
    if (step >= 2) {
      cv.drawPolygon([[0, 0], [2, 0], [2, 3]], { fill: 'rgba(16, 185, 129, 0.16)', stroke: '#059669', width: 2.4 });
      cv.drawRightAngle([2, 0], [0, 0], [2, 3], { size: 12, color: '#059669' });
    }
    cv.drawSegment([2, 3], [2, 0], { color: '#059669', width: 2, dashed: step < 2 });
    cv.drawPoint([2, 3], 'A(2,3)', { color: '#dc2626', r: 5, dx: 10, dy: -10 });
    cv.drawPoint([2, 0], 'B', { color: '#0f172a', r: 4, dx: 6, dy: 18 });
    cv.drawPoint([0, 0], 'O', { color: '#0f172a', r: 3.5, dx: -16, dy: 16 });
    if (step >= 3) {
      cv.drawFoCard([3.4, 3.8], `<span style="font-size:16px;font-weight:700;color:#047857;"><i>S</i><sub>△<i>AOB</i></sub> = <span class="fraction"><span>1</span><span>2</span></span>|<i>k</i>| = 3</span>`, { w: 156, h: 48, border: '#10b981' });
    }
    return cv.toSvg();
  }
});

// 3. 版式 C：含 4 个函数图象选项的选择题
window.defineSlide({
  lesson: 1,
  phase: 1,
  navTag: "版式 C",
  section: "解题版式 A–E",
  title: "版式 C（layout-c）：四图选择题排除推导",
  layout: "layout-c",
  stem: `<p><b>【版式 C 示例】</b>反比例函数<span class="math"><i class="m">y</i>=<span class="fraction"><span><span class="num">-4</span></span><span><i class="m">x</i></span></span></span>的大致图象是（<span class="screen-blank choice-bracket" data-step="3" data-ans="D"></span>）</p>`,
  steps: [
    {
      title: "判图象形状",
      html: `反比例函数图象为双曲线，排除直线选项<span class="num">A</span>与抛物线选项<span class="num">C</span>．`
    },
    {
      title: "判所在象限",
      html: `由于<span class="math"><i class="m">k</i>=<span class="num">-4&lt;0</span></span>，双曲线两支位于第二、四象限，排除第一、三象限的<span class="num">B</span>．`
    },
    {
      title: "锁定答案",
      html: `故正确选项为<span class="num">D</span>．`
    }
  ],
  renderScene: function(step) {
    const opts = [
      { key: 'A', elimAt: 1, okAt: -1, render: () => {
        const c = window.createCoordCanvas({ width: 220, height: 170, xRange: [-3, 3], yRange: [-3, 3] });
        c.drawAxes({ step: 1, showNumbers: false, xLabel: ' ', yLabel: ' ' });
        c.drawSegment([-2.5, -2.5], [2.5, 2.5], { color: '#2563eb', width: 2.5 });
        return c.toSvg();
      }},
      { key: 'B', elimAt: 2, okAt: -1, render: () => {
        const c = window.createCoordCanvas({ width: 220, height: 170, xRange: [-3, 3], yRange: [-3, 3] });
        c.drawAxes({ step: 1, showNumbers: false, xLabel: ' ', yLabel: ' ' });
        c.drawHyperbola(1.6, { xMin: 0.55, xMax: 2.8, color: '#2563eb', width: 2.5 });
        c.drawHyperbola(1.6, { xMin: -2.8, xMax: -0.55, color: '#2563eb', width: 2.5 });
        return c.toSvg();
      }},
      { key: 'C', elimAt: 1, okAt: -1, render: () => {
        const c = window.createCoordCanvas({ width: 220, height: 170, xRange: [-3, 3], yRange: [-3, 3] });
        c.drawAxes({ step: 1, showNumbers: false, xLabel: ' ', yLabel: ' ' });
        const pts = [];
        for (let x = -2.2; x <= 2.21; x += 0.2) pts.push([x, 0.55 * x * x]);
        for (let i = 0; i < pts.length - 1; i++) c.drawSegment(pts[i], pts[i + 1], { color: '#2563eb', width: 2.5 });
        return c.toSvg();
      }},
      { key: 'D', elimAt: 99, okAt: 3, render: () => {
        const c = window.createCoordCanvas({ width: 220, height: 170, xRange: [-3, 3], yRange: [-3, 3] });
        c.drawAxes({ step: 1, showNumbers: false, xLabel: ' ', yLabel: ' ' });
        c.drawHyperbola(-1.6, { xMin: 0.55, xMax: 2.8, color: '#16a34a', width: 2.6 });
        c.drawHyperbola(-1.6, { xMin: -2.8, xMax: -0.55, color: '#16a34a', width: 2.6 });
        return c.toSvg();
      }}
    ];
    return `<div class="layout-c-opt-grid">${opts.map(o => {
      const cls = step >= o.okAt && o.okAt > 0 ? 'opt-correct' : (step >= o.elimAt ? 'opt-elim' : '');
      const badge = step >= o.okAt && o.okAt > 0 ? '✓ 正确' : (step >= o.elimAt ? '✕ 排除' : '待定');
      return `<div class="layout-c-opt-card ${cls}">
        <div class="opt-head"><span>选项 ${o.key}</span><span class="opt-badge">${badge}</span></div>
        <div style="width:100%;height:155px;">${o.render()}</div>
      </div>`;
    }).join('')}</div>`;
  }
});

// 4. 版式 D：列表—描点—连线作图题
window.defineSlide({
  lesson: 1,
  phase: 1,
  navTag: "版式 D",
  section: "解题版式 A–E",
  title: "版式 D（layout-d）：列表—描点—连线作图",
  layout: "layout-d",
  stem: `<p><b>【版式 D 示例】</b>用列表—描点—连线法画出反比例函数<span class="math"><i class="m">y</i>=<span class="fraction"><span><span class="num">4</span></span><span><i class="m">x</i></span></span></span>（<span class="math"><i class="m">x</i>&gt;<span class="num">0</span></span>）的图象：
    <span class="math" style="margin-left:10px;">(<i class="m">x</i>, <i class="m">y</i>)：(1, <span class="screen-blank" data-step="1" data-ans="4"></span>), (2, <span class="screen-blank" data-step="1" data-ans="2"></span>), (4, <span class="screen-blank" data-step="1" data-ans="1"></span>)</span>
  </p>`,
  steps: [
    {
      title: "列表计算取值",
      html: `分别取<span class="math"><i class="m">x</i>=<span class="num">1, 2, 4</span></span>，算得对应<span class="math"><i class="m">y</i>=<span class="num">4, 2, 1</span></span>．`
    },
    {
      title: "在坐标系中描点",
      html: `在第一象限依次描出点<span class="math">(<span class="num">1,4</span>)</span>、<span class="math">(<span class="num">2,2</span>)</span>、<span class="math">(<span class="num">4,1</span>)</span>．`
    },
    {
      title: "平滑曲线连线",
      html: `用平滑曲线顺次连接各点并向两端延伸（不与坐标轴相交）．`
    }
  ],
  renderScene: function(step) {
    const cv = window.createCoordCanvas({ width: 520, height: 390, xRange: [-0.5, 5.2], yRange: [-0.5, 5.2] });
    cv.drawAxes({ xLabel: 'x', yLabel: 'y', step: 1, labelSide: 'quad24' });
    if (step >= 2) {
      cv.drawPoint([1, 4], '(1,4)', { color: '#dc2626', r: 5, dx: 8, dy: -8 });
      cv.drawPoint([2, 2], '(2,2)', { color: '#dc2626', r: 5, dx: 8, dy: -8 });
      cv.drawPoint([4, 1], '(4,1)', { color: '#dc2626', r: 5, dx: 8, dy: -8 });
    }
    if (step >= 3) {
      cv.drawHyperbola(4, { xMin: 0.8, xMax: 5.0, color: '#2563eb', width: 2.8 });
    }
    return cv.toSvg();
  }
});

// 5. 版式 E：多点坐标验算判断卡片题
window.defineSlide({
  lesson: 1,
  phase: 1,
  navTag: "版式 E",
  section: "解题版式 A–E",
  title: "版式 E（layout-e）：多点坐标并排验算卡片",
  layout: "layout-e",
  stem: `<p><b>【版式 E 示例】</b>下列各点中，在反比例函数<span class="math"><i class="m">y</i>=<span class="fraction"><span><span class="num">-6</span></span><span><i class="m">x</i></span></span></span>图象上的是<span class="screen-blank" data-step="3" data-ans="(2, -3)"></span>．</p>`,
  steps: [
    {
      title: "验算点 A(2, 3)",
      html: `<span class="math"><span class="num">2×3=6≠-6</span></span>，<b>不在</b>图象上．`
    },
    {
      title: "验算点 B(-1, -6)",
      html: `<span class="math">(<span class="num">-1</span>)×(<span class="num">-6</span>)=<span class="num">6≠-6</span></span>，<b>不在</b>图象上．`
    },
    {
      title: "验算点 C(2, -3)",
      html: `<span class="math"><span class="num">2</span>×(<span class="num">-3</span>)=<span class="num">-6</span></span>，满足<span class="math"><i class="m">xy</i>=<span class="num">-6</span></span>，<b>在</b>图象上！`
    }
  ]
});

// 6. 版式 F：知识归纳与同步演算水平对照版式
window.defineSlide({
  lesson: 1,
  phase: 2,
  navTag: "版式 F",
  section: "新知与对比 F–H",
  title: "版式 F（layout-f）：知识归纳与同步演算对照",
  layout: "layout-f",
  stem: `<p><b>【版式 F 示例】</b>结合同步演算示例，归纳用因式分解法解一元二次方程的四个核心步骤：</p>`,
  steps: [
    { title: "1. 移项", html: `将方程右边化为<span class="num">0</span>（切忌两边直接约去含未知数的因式）．` },
    { title: "2. 化积", html: `将方程左边因式分解为两个一次因式的乘积．` },
    { title: "3. 转化", html: `令每个一次因式分别为<span class="num">0</span>，转化为两个一元一次方程．` },
    { title: "4. 求解", html: `解这两个一元一次方程，它们的解就是原方程的解．` }
  ],
  example: {
    title: "💡 同步示例：",
    stem: `解方程 <span class="math"><span class="num">5</span><i class="m">x</i><sup><span class="num">2</span></sup><span class="num">=4</span><i class="m">x</i></span>`,
    lines: [
      { html: `<span class="math"><span class="num">5</span><i class="m">x</i><sup><span class="num">2</span></sup><span class="num">-4</span><i class="m">x</i><span class="num">=0</span></span>` },
      { html: `<span class="math"><i class="m">x</i><span class="num">(5</span><i class="m">x</i><span class="num">-4)=0</span></span>` },
      { html: `<span class="math"><i class="m">x</i><span class="num">=0</span></span> 或 <span class="math"><span class="num">5</span><i class="m">x</i><span class="num">-4=0</span></span>` },
      { html: `<span class="math"><i class="m">x</i><sub><span class="num">1</span></sub><span class="num">=0, </span><i class="m">x</i><sub><span class="num">2</span></sub><span class="num">=</span><span class="fraction"><span><span class="num">4</span></span><span><span class="num">5</span></span></span></span>` }
    ]
  }
});

// 7. 版式 G：多解法对比 / 正误辨析并排版式
window.defineSlide({
  lesson: 1,
  phase: 2,
  navTag: "版式 G",
  section: "新知与对比 F–H",
  title: "版式 G（layout-g）：多解法对比与易错辨析",
  layout: "layout-g",
  cols: 3,
  stem: `<p><b>【版式 G 示例】</b>小颖、小明、小亮解方程<span class="math"><span class="num">15</span><i class="m">t</i><span class="num">-5</span><i class="m">t</i><sup><span class="num">2</span></sup><span class="num">=0</span></span>，请对比三人的解法：</p>`,
  steps: [
    {
      title: "小颖（公式法）",
      badge: "可行但较繁",
      badgeType: "info",
      html: `<p><b>解：</b>化为一般式：<span class="math"><span class="num">5</span><i class="m">t</i><sup><span class="num">2</span></sup><span class="num">-15</span><i class="m">t</i><span class="num">=0</span></span>．</p>
             <p>这里<span class="math"><i class="m">a</i>=<span class="num">5</span>,<i class="m">b</i>=<span class="num">-15</span>,<i class="m">c</i>=<span class="num">0</span></span>，</p>
             <p><span class="math">Δ=(<span class="num">-15</span>)<sup><span class="num">2</span></sup><span class="num">-4×5×0=225&gt;0</span></span>，</p>
             <p><span class="math"><i class="m">t</i>=<span class="fraction"><span><span class="num">15±</span><span class="sqrt"><span class="num">225</span></span></span><span><span class="num">2×5</span></span></span>=<span class="fraction"><span><span class="num">15±15</span></span><span><span class="num">10</span></span></span></span>，</p>
             <p>∴ <span class="math"><i class="m">t</i><sub><span class="num">1</span></sub>=<span class="num">3</span>, <i class="m">t</i><sub><span class="num">2</span></sub>=<span class="num">0</span></span>．</p>`,
      comment: `<b>点评：</b>步骤正确不漏根，但代入求根公式计算量偏大．`
    },
    {
      title: "小明（两边同除 t）",
      badge: "⚠ 易错漏根",
      badgeType: "warn",
      html: `<p><b>解：</b>方程两边同时除以<i class="m">t</i>，得</p>
             <p><span class="math"><span class="num">15-5</span><i class="m">t</i><span class="num">=0</span></span>，</p>
             <p>移项，得<span class="math"><span class="num">5</span><i class="m">t</i><span class="num">=15</span></span>，</p>
             <p>∴ <span class="math"><i class="m">t</i>=<span class="num">3</span></span>．</p>`,
      comment: `<b>错因：</b>若<span class="math"><i class="m">t</i>=<span class="num">0</span></span>则两边同除以<i class="m">t</i>无意义，直接约去未知数漏掉了<span class="math"><i class="m">t</i><sub><span class="num">2</span></sub>=<span class="num">0</span></span>！`
    },
    {
      title: "小亮（提公因式）",
      badge: "✓ 推荐方法",
      badgeType: "ok",
      html: `<p><b>解：</b>方程左边分解因式，得</p>
             <p><span class="math"><span class="num">5</span><i class="m">t</i>(<span class="num">3-</span><i class="m">t</i>)<span class="num">=0</span></span>，</p>
             <p>于是得<span class="math"><span class="num">5</span><i class="m">t</i>=<span class="num">0</span></span>或<span class="math"><span class="num">3-</span><i class="m">t</i>=<span class="num">0</span></span>，</p>
             <p>∴ <span class="math"><i class="m">t</i><sub><span class="num">1</span></sub>=<span class="num">0</span>, <i class="m">t</i><sub><span class="num">2</span></sub>=<span class="num">3</span></span>．</p>`,
      comment: `<b>点评：</b>提公因式降次求解，步骤最简洁且不漏根，最优！`
    }
  ],
  summary: `<b>核心结论：</b>若<span class="math"><i class="m">ab</i><span class="num">=0</span></span>，则<span class="math"><i class="m">a</i><span class="num">=0</span></span>或<span class="math"><i class="m">b</i><span class="num">=0</span></span>；严禁在未知数可能为<span class="num">0</span>时直接约去未知数！`
});

// 8. 版式 H：教研级交互对比表格版式
window.defineSlide({
  lesson: 1,
  phase: 2,
  navTag: "版式 H",
  section: "新知与对比 F–H",
  title: "版式 H（layout-h）：教研级交互对比表格",
  layout: "layout-h",
  headers: ['方法', '理论依据', '适用范围', '关键步骤'],
  colWidths: '0.95fr 1.2fr 1.5fr 1.5fr',
  stem: `<p><b>【版式 H 示例】</b>梳理并对比一元二次方程的四种常用解法：</p>`,
  steps: [
    { cells: ['直接开平方法', '平方根的意义', '形如(<i class="m">mx</i>+<i class="m">n</i>)<sup>2</sup>=<i class="m">p</i>(<i class="m">p</i>≥0)', '直接开平方降次'] },
    { cells: ['配方法', '完全平方公式', '二次项系数化为1后一次项系数为偶数', '配成完全平方式后开方'] },
    { cells: ['公式法', '配方法推导', '所有一元二次方程（通用）', '先判别式Δ≥0，再代公式'] },
    { cells: ['因式分解法', '<i class="m">ab</i>=0 ⇒ <i class="m">a</i>=0或<i class="m">b</i>=0', '右边为0且左边易分解因式', '提公因式或用乘法公式分解'] }
  ],
  summary: `<b>选用策略：</b>优先观察能否用<b>直接开平方法</b>或<b>因式分解法</b>；若不易分解，再选用<b>配方法</b>或<b>公式法</b>兜底．`
});

// 9. 版式 I：全屏居中交互式思维导图 / 课堂小结版式
window.defineSlide({
  lesson: 1,
  phase: 3,
  navTag: "版式 I",
  section: "小结版式 I",
  title: "版式 I（layout-i）：全屏居中交互式思维导图",
  layout: "layout-i",
  centerTitle: "九大版式体系",
  stem: `<p><b>【版式 I 示例】</b>回顾本课件体系，按教学环节选用最匹配的交互版式：</p>`,
  steps: [
    {
      title: "讲练类 A–E",
      nodes: ["A 纯代数 · B 左解右图", "C 四图选择 · D 列表描点 · E 验算"],
      html: `紧扣题干填空回填与零剧透 SVG 动态演示。`
    },
    {
      title: "新知对比 F–H",
      nodes: ["F 左要领右演算 · G 多解对比", "H 教研级交互对比表"],
      html: `摆脱 .step 卡片束缚，直观对照呈现。`
    },
    {
      title: "小结导图 I",
      nodes: ["全屏 SVG 思维导图", "点击分支逐层展开"],
      html: `构建完整知识网络，支持底部核心思想总结。`
    }
  ],
  summary: `<b>选用原则：</b>根据课堂环节（概念引入 / 例题精讲 / 方法对比 / 课堂小结）精准匹配 <b>Layouts A–I</b>！`
});

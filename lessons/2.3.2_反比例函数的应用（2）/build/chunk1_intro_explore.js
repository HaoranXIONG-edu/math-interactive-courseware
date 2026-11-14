window.UNIT1_THEOREM_SLIDES = window.UNIT1_THEOREM_SLIDES || [];
window.UNIT1_SIMS = window.UNIT1_SIMS || {};
window.COURSEWARE_BRAND = '北师大版九上 · 第二章';
window.COURSEWARE_TITLE = '2.3.2 反比例函数的应用（2）';
window.COURSEWARE_PHASES = [
  ['① 情境引入', '一次与反比例交点激活'],
  ['② 新知探究·问题1', '电子秤复合电路建模'],
  ['③ 新知探究·问题2', '图形间距离与隔音屏障'],
  ['④ 新知探究·问题3', '崂山矿泉水供需与小结']
];

(function () {
  var fmt = window.svgAutoFormatText || function (s) { return s; };

  function slider(key, label, min, max, value, step, unit) {
    return '<div class="ctrl-row" style="display:inline-flex;align-items:center;gap:8px;background:#f8fafc;border:1px solid #cbd5e1;border-radius:999px;padding:4px 12px;font-size:13px;">' +
      '<span class="ctrl-label" style="font-weight:700;color:#1e293b;">' + label + '：<b style="color:#2563eb;"><span class="num">' + value + '</span>' + (unit ? '<span class="num">' + unit + '</span>' : '') + '</b></span>' +
      '<input class="ctrl-slider" type="range" data-state-key="' + key + '" min="' + min + '" max="' + max + '" step="' + (step || 1) + '" value="' + value + '" style="width:120px;accent-color:#2563eb;cursor:pointer;">' +
    '</div>';
  }

  // ==================== 第 1 页：教学封面页 ====================
  window.defineSlide({
    cover: true,
    lesson: 1,
    phase: 0,
    navTag: '课题导览',
    section: '情境引入',
    title: '<span class="num">2.3.2</span> 反比例函数的应用（<span class="num">2</span>）',
    html: window.renderStandardCover({
      chapter: '北师大版九年级数学上册 · 第二章 反比例函数',
      num: '2.3.2',
      title: '反比例函数的应用（<span class="num">2</span>）',
      caption: '第二章 反比例函数 · 一次函数与反比例函数综合及跨学科建模',
      goals: [
        '经历反比例函数与一次函数关系的探究过程，能解决一次函数与反比例函数的综合问题；（<b class="goal-focus">重点</b>）',
        '进一步体会发展数形结合的思想，发展几何直观．（<b class="goal-hard">难点</b>）'
      ]
    })
  });

  // ==================== 第 2 页：情境引入（1）（2） ====================
  window.defineSlide({
    lesson: 1,
    phase: 0,
    layout: 'layout-b',
    navTag: '情境(1)(2)·解析式与面积',
    section: '情境引入',
    title: '情境引入（<span class="num">1</span>）（<span class="num">2</span>）：求双函数表达式与<span class="num">△</span><i class="m">AOB</i>的面积',
    sub: '一次函数与反比例函数交点坐标特征及坐标轴割补法求三角形面积',
    stem: '<p>如图，一次函数<span class="math"><i class="m">y</i><span class="num">=</span><i class="m">kx</i><span class="num">+</span><i class="m">b</i></span>与反比例函数<span class="math"><i class="m">y</i><span class="num">=</span><span class="fraction"><span><i class="m">m</i></span><span><i class="m">x</i></span></span></span>的图象交于点<span class="math"><i class="m">A</i><span class="num">(-3,2)</span></span>，<span class="math"><i class="m">B</i><span class="num">(</span><i class="m">n</i><span class="num">,-3)</span></span>．</p>' +
          '<p>（<span class="num">1</span>）反比例函数的表达式为<span class="screen-blank" data-step="1" data-ans="<span class=\'math\'><i class=\'m\'>y</i><span class=\'num\'>=-</span><span class=\'fraction\'><span><span class=\'num\'>6</span></span><span><i class=\'m\'>x</i></span></span></span>"></span>，点<i class="m">B</i>的坐标为<span class="screen-blank" data-step="1" data-ans="<span class=\'num\'>(2,-3)</span>"></span>，一次函数的表达式为<span class="screen-blank" data-step="2" data-ans="<i class=\'m\'>y</i><span class=\'num\'>=-</span><i class=\'m\'>x</i><span class=\'num\'>-1</span>"></span>；　（<span class="num">2</span>）<span class="math"><span class="num">△</span><i class="m">AOB</i></span>的面积为<span class="screen-blank" data-step="3" data-ans="<span class=\'math\'><span class=\'fraction\'><span><span class=\'num\'>5</span></span><span><span class=\'num\'>2</span></span></span></span>"></span>．</p>',
    steps: [
      {
        title: '由交点<span class="math"><i class="m">A</i><span class="num">(-3,2)</span></span>求反比例函数表达式与点<i class="m">B</i>坐标',
        body: '将点<span class="math"><i class="m">A</i><span class="num">(-3,2)</span></span>代入<span class="math"><i class="m">y</i><span class="num">=</span><span class="fraction"><span><i class="m">m</i></span><span><i class="m">x</i></span></span></span>，得<span class="math"><i class="m">m</i><span class="num">=-3×2=-6</span></span>，∴反比例函数的表达式为<span class="math"><b><i class="m">y</i><span class="num">=-</span><span class="fraction"><span><span class="num">6</span></span><span><i class="m">x</i></span></span></b></span>．<br>将点<span class="math"><i class="m">B</i><span class="num">(</span><i class="m">n</i><span class="num">,-3)</span></span>代入<span class="math"><i class="m">y</i><span class="num">=-</span><span class="fraction"><span><span class="num">6</span></span><span><i class="m">x</i></span></span></span>，得<span class="math"><span class="num">-3=-</span><span class="fraction"><span><span class="num">6</span></span><span><i class="m">n</i></span></span></span>，解得<span class="math"><i class="m">n</i><span class="num">=2</span></span>，∴点<i class="m">B</i>的坐标为<span class="math"><b><span class="num">(2,-3)</span></b></span>．'
      },
      {
        title: '由<i class="m">A</i>，<i class="m">B</i>两点坐标求一次函数表达式',
        body: '将<span class="math"><i class="m">A</i><span class="num">(-3,2)</span></span>，<span class="math"><i class="m">B</i><span class="num">(2,-3)</span></span>代入<span class="math"><i class="m">y</i><span class="num">=</span><i class="m">kx</i><span class="num">+</span><i class="m">b</i></span>，得方程组：<span class="math"><span class="num">-3</span><i class="m">k</i><span class="num">+</span><i class="m">b</i><span class="num">=2</span></span>且<span class="math"><span class="num">2</span><i class="m">k</i><span class="num">+</span><i class="m">b</i><span class="num">=-3</span></span>．<br>两式相减解得<span class="math"><i class="m">k</i><span class="num">=-1</span></span>，<span class="math"><i class="m">b</i><span class="num">=-1</span></span>，∴一次函数的表达式为<span class="math"><b><i class="m">y</i><span class="num">=-</span><i class="m">x</i><span class="num">-1</span></b></span>．'
      },
      {
        title: '坐标轴割补法求<span class="math"><span class="num">△</span><i class="m">AOB</i></span>的面积',
        body: '令<span class="math"><i class="m">y</i><span class="num">=0</span></span>，由<span class="math"><span class="num">-</span><i class="m">x</i><span class="num">-1=0</span></span>解得<span class="math"><i class="m">x</i><span class="num">=-1</span></span>，即直线与<i class="m">x</i>轴交于点<span class="math"><i class="m">C</i><span class="num">(-1,0)</span></span>，故<span class="math"><i class="m">OC</i><span class="num">=1</span></span>．<br>以<i class="m">OC</i>为公共底边，将<span class="math"><span class="num">△</span><i class="m">AOB</i></span>分割为<span class="math"><span class="num">△</span><i class="m">AOC</i></span>与<span class="math"><span class="num">△</span><i class="m">BOC</i></span>：<br><span class="math"><i class="m">S</i><sub><span class="num">△</span><i class="m">AOB</i></sub><span class="num">=</span><i class="m">S</i><sub><span class="num">△</span><i class="m">AOC</i></sub><span class="num">+</span><i class="m">S</i><sub><span class="num">△</span><i class="m">BOC</i></sub><span class="num">=</span><span class="fraction"><span><span class="num">1</span></span><span><span class="num">2</span></span></span><span class="num">×</span><i class="m">OC</i><span class="num">×(|</span><i class="m">y</i><sub><i class="m">A</i></sub><span class="num">|+|</span><i class="m">y</i><sub><i class="m">B</i></sub><span class="num">|)=</span><span class="fraction"><span><span class="num">1</span></span><span><span class="num">2</span></span></span><span class="num">×1×(2+3)=</span><b><span class="fraction"><span><span class="num">5</span></span><span><span class="num">2</span></span></span></b></span>．'
      }
    ],
    renderScene: function (step, state) {
      var c = window.createCoordCanvas({ width: 520, height: 400, xMin: -5.2, xMax: 5.2, yMin: -5.2, yMax: 5.2 });
      c.drawAxes({ showGrid: true });
      var A = [-3, 2], B = [2, -3], O = [0, 0], C = [-1, 0];

      // Step 3: 面积割补色块
      if (step >= 3) {
        c.drawPolygon([O, C, A], { fill: 'rgba(37,99,235,0.18)', stroke: '#2563eb', width: 1.8 });
        c.drawPolygon([O, C, B], { fill: 'rgba(220,38,38,0.18)', stroke: '#dc2626', width: 1.8 });
        // 高的虚线
        c.drawSegment(A, [-3, 0], { color: '#2563eb', width: 2, dash: '5 4' });
        c.drawSegment(B, [2, 0], { color: '#dc2626', width: 2, dash: '5 4' });
      }

      // 原题线段 OA, OB
      c.drawSegment(O, A, { color: '#1e293b', width: 2.2 });
      c.drawSegment(O, B, { color: '#1e293b', width: 2.2 });

      // 双曲线 y = -6/x
      var hypColor = step >= 1 ? '#2563eb' : '#1e293b';
      var hypW = step >= 1 ? 3 : 2.2;
      c.curve(function (x) { return -6 / x; }, -5, -1.2, { color: hypColor, width: hypW });
      c.curve(function (x) { return -6 / x; }, 1.2, 5, { color: hypColor, width: hypW });

      // 直线 y = -x - 1
      var lineColor = step >= 2 ? '#7c3aed' : '#1e293b';
      var lineW = step >= 2 ? 3 : 2.2;
      c.curve(function (x) { return -x - 1; }, -4.8, 3.8, { color: lineColor, width: lineW });

      // Step 1: 交点投影虚线
      if (step >= 1 && step < 3) {
        c.drawSegment(A, [-3, 0], { color: '#2563eb', width: 1.5, dash: '4 4' });
        c.drawSegment(A, [0, 2], { color: '#2563eb', width: 1.5, dash: '4 4' });
        c.drawSegment(B, [2, 0], { color: '#2563eb', width: 1.5, dash: '4 4' });
        c.drawSegment(B, [0, -3], { color: '#2563eb', width: 1.5, dash: '4 4' });
      }

      // 顶点标注
      c.drawPoint(A, { color: step >= 1 ? '#2563eb' : '#1e293b', r: 5 });
      c.drawPoint(B, { color: step >= 1 ? '#2563eb' : '#1e293b', r: 5 });
      c.drawText([A[0] - 0.2, A[1] + 0.55], step >= 1 ? 'A(-3,2)' : 'A', { fontSize: 15, color: step >= 1 ? '#1d4ed8' : '#0f172a', anchor: 'middle' });
      c.drawText([B[0] + 0.3, B[1] - 0.55], step >= 1 ? 'B(2,-3)' : 'B', { fontSize: 15, color: step >= 1 ? '#1d4ed8' : '#0f172a', anchor: 'middle' });

      if (step >= 1) {
        c.raw(window.svgFoCard(330, 22, 175, 48,
          '<div style="display:flex;align-items:center;gap:6px;font-weight:700;color:#1d4ed8;">' +
            '<span>双曲线：</span><span class="math"><i class="m">y</i><span class="num">=-</span><span class="fraction"><span><span class="num">6</span></span><span><i class="m">x</i></span></span></span>' +
          '</div>',
          'background:rgba(239,246,255,0.95);border:1.5px solid #93c5fd;'));
      }

      if (step >= 2) {
        c.raw(window.svgFoCard(330, 76, 175, 36,
          '<div style="font-weight:700;color:#6d28d9;">直线：<span class="math"><i class="m">y</i><span class="num">=-</span><i class="m">x</i><span class="num">-1</span></span></div>',
          'background:rgba(245,243,255,0.95);border:1.5px solid #c4b5fd;'));
      }

      if (step >= 3) {
        c.drawPoint(C, { color: '#dc2626', r: 5.5 });
        c.drawText([C[0] - 0.45, C[1] - 0.45], 'C(-1,0)', { fontSize: 14, color: '#dc2626' });
        c.raw(window.svgFoCard(14, 310, 290, 76,
          '<div style="font-weight:800;color:#991b1b;margin-bottom:2px;">沿 <i class="m">x</i> 轴割补求面积（底边 <span class="math"><i class="m">OC</i><span class="num">=1</span></span>）：</div>' +
          '<div style="color:#1e293b;font-weight:700;"><span class="math"><i class="m">S</i><sub><span class="num">△</span><i class="m">AOB</i></sub><span class="num">=</span><span style="color:#2563eb;"><i class="m">S</i><sub><span class="num">△</span><i class="m">AOC</i></sub></span><span class="num">+</span><span style="color:#dc2626;"><i class="m">S</i><sub><span class="num">△</span><i class="m">BOC</i></sub></span><span class="num">=1+1.5=</span><span class="fraction"><span><span class="num">5</span></span><span><span class="num">2</span></span></span></span></div>',
          'background:rgba(254,242,242,0.95);border:1.5px solid #fca5a5;'));
      }

      return c.toSvg();
    }
  });

  // ==================== 第 3 页：情境引入（3） ====================
  window.defineSlide({
    lesson: 1,
    phase: 0,
    layout: 'layout-b',
    navTag: '情境(3)·图象法解不等式',
    section: '情境引入',
    title: '情境引入（<span class="num">3</span>）：利用函数图象求方程的解与不等式的解集',
    sub: '“三线四区法”：过两交点作 x 轴垂线，连同 y 轴（x=0）分成四个区域比高低',
    state: { xProbe: -1.5 },
    stem: '<div style="background:#eff6ff;border-left:4px solid #2563eb;padding:5px 10px;border-radius:6px;margin-bottom:6px;font-size:13.5px;color:#1e3a8a;">' +
            '<b>【前问已知】</b>一次函数<span class="math"><i class="m">y</i><span class="num">=-</span><i class="m">x</i><span class="num">-1</span></span>与反比例函数<span class="math"><i class="m">y</i><span class="num">=-</span><span class="fraction"><span><span class="num">6</span></span><span><i class="m">x</i></span></span></span>的图象交于点<span class="math"><i class="m">A</i><span class="num">(-3,2)</span></span>，<span class="math"><i class="m">B</i><span class="num">(2,-3)</span></span>．' +
          '</div>' +
          '<p>（<span class="num">3</span>）当<i class="m">x</i>取何值时，<span class="math"><i class="m">kx</i><span class="num">+</span><i class="m">b</i><span class="num">=</span><span class="fraction"><span><i class="m">m</i></span><span><i class="m">x</i></span></span></span>？<span class="screen-blank" data-step="1" data-ans="<i class=\'m\'>x</i><sub><span class=\'num\'>1</span></sub><span class=\'num\'>=-3</span>，<i class=\'m\'>x</i><sub><span class=\'num\'>2</span></sub><span class=\'num\'>=2</span>"></span>；当<i class="m">x</i>取何值时，<span class="math"><i class="m">kx</i><span class="num">+</span><i class="m">b</i><span class="num">&gt;</span><span class="fraction"><span><i class="m">m</i></span><span><i class="m">x</i></span></span></span>呢？<span class="screen-blank" data-step="2" data-ans="<i class=\'m\'>x</i><span class=\'num\'>&lt;-3</span>或<span class=\'num\'>0&lt;</span><i class=\'m\'>x</i><span class=\'num\'>&lt;2</span>"></span>；当<i class="m">x</i>取何值时，<span class="math"><i class="m">kx</i><span class="num">+</span><i class="m">b</i><span class="num">&lt;</span><span class="fraction"><span><i class="m">m</i></span><span><i class="m">x</i></span></span></span>呢？<span class="screen-blank" data-step="3" data-ans="<span class=\'num\'>-3&lt;</span><i class=\'m\'>x</i><span class=\'num\'>&lt;0</span>或<i class=\'m\'>x</i><span class=\'num\'>&gt;2</span>"></span>．</p>',
    steps: [
      {
        title: '图象交点横坐标即方程的解',
        body: '两个函数图象交于点<span class="math"><i class="m">A</i><span class="num">(-3,2)</span></span>，<span class="math"><i class="m">B</i><span class="num">(2,-3)</span></span>，交点的横坐标即为方程<span class="math"><i class="m">kx</i><span class="num">+</span><i class="m">b</i><span class="num">=</span><span class="fraction"><span><i class="m">m</i></span><span><i class="m">x</i></span></span></span>的解，故<b><span class="math"><i class="m">x</i><sub><span class="num">1</span></sub><span class="num">=-3</span></span>，<span class="math"><i class="m">x</i><sub><span class="num">2</span></sub><span class="num">=2</span></span></b>．'
      },
      {
        title: '“三线四区法”求直线在双曲线上方（<span class="math"><i class="m">kx</i><span class="num">+</span><i class="m">b</i><span class="num">&gt;</span><span class="fraction"><span><i class="m">m</i></span><span><i class="m">x</i></span></span></span>）的解集',
        body: '过两交点<span class="math"><i class="m">A</i><span class="num">(-3,2)</span></span>，<span class="math"><i class="m">B</i><span class="num">(2,-3)</span></span>作<i class="m">x</i>轴垂线，连同<i class="m">y</i>轴（<span class="math"><i class="m">x</i><span class="num">=0</span></span>）共<b>三根竖线</b>，将坐标系分为<b>四个区域</b>．观察绿色区域知，当<b><span class="math"><i class="m">x</i><span class="num">&lt;-3</span></span>或<span class="math"><span class="num">0&lt;</span><i class="m">x</i><span class="num">&lt;2</span></span></b>时，一次函数图象在反比例函数图象上方．'
      },
      {
        title: '求直线在双曲线下方（<span class="math"><i class="m">kx</i><span class="num">+</span><i class="m">b</i><span class="num">&lt;</span><span class="fraction"><span><i class="m">m</i></span><span><i class="m">x</i></span></span></span>）的解集',
        body: '观察橙色区域知，在<span class="math"><span class="num">-3&lt;</span><i class="m">x</i><span class="num">&lt;0</span></span>和<span class="math"><i class="m">x</i><span class="num">&gt;2</span></span>区域内，一次函数图象位于反比例函数图象下方（注意<span class="math"><i class="m">x</i><span class="num">=0</span></span>处双曲线断开），故解集为<b><span class="math"><span class="num">-3&lt;</span><i class="m">x</i><span class="num">&lt;0</span></span>或<span class="math"><i class="m">x</i><span class="num">&gt;2</span></span></b>．'
      }
    ],
    controls: function (step, state) {
      if (step < 1) return '';
      var xp = state.xProbe !== undefined ? Number(state.xProbe) : -1.5;
      return slider('xProbe', '拖动竖线检验<i class="m">x</i>', -4.5, 4.5, xp.toFixed(1), 0.1);
    },
    renderScene: function (step, state) {
      var c = window.createCoordCanvas({ width: 520, height: 400, xMin: -5.2, xMax: 5.2, yMin: -5.2, yMax: 5.2 });

      // Step >= 2: 绿色区域 x < -3 和 0 < x < 2
      if (step >= 2) {
        c.drawPolygon([[-5.2, -5.2], [-3, -5.2], [-3, 5.2], [-5.2, 5.2]], { fill: 'rgba(22,163,74,0.10)', stroke: 'none', width: 0 });
        c.drawPolygon([[0, -5.2], [2, -5.2], [2, 5.2], [0, 5.2]], { fill: 'rgba(22,163,74,0.10)', stroke: 'none', width: 0 });
      }
      // Step >= 3: 橙色区域 -3 < x < 0 和 x > 2
      if (step >= 3) {
        c.drawPolygon([[-3, -5.2], [0, -5.2], [0, 5.2], [-3, 5.2]], { fill: 'rgba(234,88,12,0.10)', stroke: 'none', width: 0 });
        c.drawPolygon([[2, -5.2], [5.2, -5.2], [5.2, 5.2], [2, 5.2]], { fill: 'rgba(234,88,12,0.10)', stroke: 'none', width: 0 });
      }

      c.drawAxes({ showGrid: true });

      // 三条分界竖线 x = -3, x = 0, x = 2
      if (step >= 2) {
        c.drawSegment([-3, -5], [-3, 5], { color: '#dc2626', width: 2, dash: '6 4' });
        c.drawSegment([0, -5], [0, 5], { color: '#dc2626', width: 2.2, dash: '6 4' });
        c.drawSegment([2, -5], [2, 5], { color: '#dc2626', width: 2, dash: '6 4' });
        c.drawText([-3, 4.65], 'x=-3', { fontSize: 13, color: '#dc2626' });
        c.drawText([0.65, 3.85], 'x=0', { fontSize: 13, color: '#dc2626' });
        c.drawText([2, 4.65], 'x=2', { fontSize: 13, color: '#dc2626' });
      }

      // 基础曲线
      c.curve(function (x) { return -6 / x; }, -5, -1.2, { color: '#2563eb', width: 2.4 });
      c.curve(function (x) { return -6 / x; }, 1.2, 5, { color: '#2563eb', width: 2.4 });
      c.curve(function (x) { return -x - 1; }, -4.8, 3.8, { color: '#64748b', width: 2.2 });

      // Step >= 2 高亮直线在上方段（绿色加粗）
      if (step >= 2) {
        c.curve(function (x) { return -x - 1; }, -4.8, -3, { color: '#16a34a', width: 4 });
        c.curve(function (x) { return -x - 1; }, 0.05, 2, { color: '#16a34a', width: 4 });
      }
      // Step >= 3 高亮直线在下方段（橙色加粗）
      if (step >= 3) {
        c.curve(function (x) { return -x - 1; }, -3, -0.05, { color: '#ea580c', width: 3.5 });
        c.curve(function (x) { return -x - 1; }, 2, 3.8, { color: '#ea580c', width: 3.5 });
      }

      var A = [-3, 2], B = [2, -3];
      c.drawPoint(A, { color: '#dc2626', r: 5.5 });
      c.drawPoint(B, { color: '#dc2626', r: 5.5 });
      c.drawText([A[0] - 0.65, A[1] + 0.45], step >= 1 ? 'A(-3,2)' : 'A', { fontSize: 14, color: '#0f172a' });
      c.drawText([B[0] + 0.65, B[1] - 0.45], step >= 1 ? 'B(2,-3)' : 'B', { fontSize: 14, color: '#0f172a' });

      // 探针竖线 xProbe
      if (step >= 1) {
        var xp = state.xProbe !== undefined ? Number(state.xProbe) : -1.5;
        if (Math.abs(xp) > 0.15) {
          var yL = -xp - 1;
          var yH = -6 / xp;
          c.drawSegment([xp, -5], [xp, 5], { color: '#0f172a', width: 1.6, dash: '3 3' });
          if (yL >= -5.2 && yL <= 5.2) c.drawPoint([xp, yL], { color: '#16a34a', r: 4.5 });
          if (yH >= -5.2 && yH <= 5.2) c.drawPoint([xp, yH], { color: '#2563eb', r: 4.5 });
          var cmp = Math.abs(yL - yH) < 0.08 ? '=' : (yL > yH ? '&gt;' : '&lt;');
          c.raw(window.svgFoCard(14, 14, 235, 58,
            '<div style="font-weight:800;color:#0f172a;">检验 <span class="math"><i class="m">x</i><span class="num">=' + xp.toFixed(1) + '</span></span>：</div>' +
            '<div style="font-size:12.5px;color:#334155;">' +
              '<span style="color:#16a34a;font-weight:700;"><i class="m">y</i><sub>直</sub><span class="num">=' + yL.toFixed(2) + '</span></span> ' +
              '<b style="color:#dc2626;"><span class="num">' + cmp + '</span></b> ' +
              '<span style="color:#2563eb;font-weight:700;"><i class="m">y</i><sub>反</sub><span class="num">=' + yH.toFixed(2) + '</span></span>' +
            '</div>',
            'background:rgba(255,255,255,0.94);border:1.5px solid #94a3b8;'));
        }
      }

      return c.toSvg();
    }
  });

  // ==================== 第 4 页：新知探究 · 问题1（1）（2） ====================
  window.defineSlide({
    lesson: 1,
    phase: 1,
    layout: 'layout-b',
    navTag: '问题1(1)(2)·电路建模',
    section: '新知探究',
    title: '问题<span class="num">1</span>（<span class="num">1</span>）（<span class="num">2</span>）：电子秤电路中的一次函数与反比例函数建模',
    sub: '跨学科融合：质量 x → 可变电阻 R₁（一次函数）→ 总电阻 R → 电流 I（反比例函数）',
    stem: '<p><b>问题<span class="num">1</span>：</b>图<span class="num">1</span>为某电子秤的实物图，图<span class="num">2</span>为其工作电路图：电源两端电压保持不变，通过所称物体质量调节可变电阻<i class="m">R</i><sub><span class="num">1</span></sub>的大小改变电流<i class="m">I</i>．已知：①可变电阻<i class="m">R</i><sub><span class="num">1</span></sub>（单位：<span class="num">kΩ</span>）与物体质量<i class="m">x</i>（单位：<span class="num">kg</span>）满足图<span class="num">3</span>所示的一次函数关系；②定值电阻<span class="math"><i class="m">R</i><sub><span class="num">2</span></sub><span class="num">=20kΩ</span></span>，总电阻<span class="math"><i class="m">R</i><span class="num">=</span><i class="m">R</i><sub><span class="num">1</span></sub><span class="num">+</span><i class="m">R</i><sub><span class="num">2</span></sub></span>；③电流<i class="m">I</i>（单位：<span class="num">mA</span>）与总电阻<i class="m">R</i>（单位：<span class="num">kΩ</span>）成反比例；④放置<span class="num">1kg</span>物体时，电流<i class="m">I</i>为<span class="num">0.2mA</span>．</p>' +
          '<p>（<span class="num">1</span>）可变电阻<i class="m">R</i><sub><span class="num">1</span></sub>与物体质量<i class="m">x</i>的函数关系式为<span class="screen-blank" data-step="1" data-ans="<i class=\'m\'>R</i><sub><span class=\'num\'>1</span></sub><span class=\'num\'>=-20</span><i class=\'m\'>x</i><span class=\'num\'>+60</span>（<span class=\'num\'>0≤</span><i class=\'m\'>x</i><span class=\'num\'>≤3</span>）"></span>；　（<span class="num">2</span>）电流<i class="m">I</i>与总电阻<i class="m">R</i>的函数关系式为<span class="screen-blank" data-step="2" data-ans="<span class=\'math\'><i class=\'m\'>I</i><span class=\'num\'>=</span><span class=\'fraction\'><span><span class=\'num\'>12</span></span><span><i class=\'m\'>R</i></span></span></span>"></span>．</p>',
    steps: [
      {
        title: '由图<span class="num">3</span>两点坐标求可变电阻<i class="m">R</i><sub><span class="num">1</span></sub>关于质量<i class="m">x</i>的一次函数式',
        body: '设<span class="math"><i class="m">R</i><sub><span class="num">1</span></sub><span class="num">=</span><i class="m">kx</i><span class="num">+</span><i class="m">b</i></span>（<span class="math"><i class="m">k</i><span class="num">≠0</span></span>）．由图<span class="num">3</span>知线段经过点<span class="math"><span class="num">(0,60)</span></span>和<span class="math"><span class="num">(3,0)</span></span>，代入得<span class="math"><i class="m">b</i><span class="num">=60</span></span>，<span class="math"><span class="num">3</span><i class="m">k</i><span class="num">+60=0</span></span>，解得<span class="math"><i class="m">k</i><span class="num">=-20</span></span>．<br>∴<b><span class="math"><i class="m">R</i><sub><span class="num">1</span></sub><span class="num">=-20</span><i class="m">x</i><span class="num">+60</span></span>（<span class="math"><span class="num">0≤</span><i class="m">x</i><span class="num">≤3</span></span>）</b>．'
      },
      {
        title: '由<span class="math"><i class="m">x</i><span class="num">=1kg</span></span>时的总电阻与电流求<i class="m">I</i>关于<i class="m">R</i>的反比例函数式',
        body: '当<span class="math"><i class="m">x</i><span class="num">=1kg</span></span>时，<span class="math"><i class="m">R</i><sub><span class="num">1</span></sub><span class="num">=-20×1+60=40kΩ</span></span>，总电阻<span class="math"><i class="m">R</i><span class="num">=</span><i class="m">R</i><sub><span class="num">1</span></sub><span class="num">+</span><i class="m">R</i><sub><span class="num">2</span></sub><span class="num">=40+20=60kΩ</span></span>．<br>设<span class="math"><i class="m">I</i><span class="num">=</span><span class="fraction"><span><i class="m">U</i></span><span><i class="m">R</i></span></span></span>，将<span class="math"><i class="m">R</i><span class="num">=60</span></span>，<span class="math"><i class="m">I</i><span class="num">=0.2</span></span>代入得<span class="math"><i class="m">U</i><span class="num">=60×0.2=12</span></span>，∴<b><span class="math"><i class="m">I</i><span class="num">=</span><span class="fraction"><span><span class="num">12</span></span><span><i class="m">R</i></span></span></span></b>．'
      }
    ],
    renderScene: function (step, state) {
      var svg = [];
      svg.push('<svg viewBox="0 0 540 400" style="width:100%;height:100%;display:block;">');
      svg.push('<rect width="540" height="400" fill="#ffffff" rx="12"/>');

      // 左侧：图2 工作电路图
      svg.push('<rect x="12" y="14" width="235" height="275" rx="10" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1.5"/>');
      svg.push('<text x="130" y="36" font-size="14" font-weight="800" fill="#1e293b" text-anchor="middle">' + fmt('图2 工作电路图') + '</text>');
      // 串联回路导线
      svg.push('<path d="M 45 215 L 45 85 L 95 85 M 145 85 L 215 85 L 215 115 M 215 175 L 215 215 L 175 215 M 95 215 L 45 215" fill="none" stroke="#1e293b" stroke-width="2.2"/>');
      // 定值电阻 R2
      svg.push('<rect x="95" y="75" width="50" height="20" fill="#fff" stroke="#1e293b" stroke-width="2.2"/>');
      svg.push('<text x="120" y="67" font-size="13" font-weight="700" fill="#1e293b" text-anchor="middle">' + fmt('R2=20kΩ') + '</text>');
      // 可变电阻 R1（右侧竖直）
      svg.push('<rect x="205" y="115" width="20" height="60" fill="#eff6ff" stroke="#2563eb" stroke-width="2.2"/>');
      svg.push('<text x="190" y="150" font-size="14" font-weight="700" fill="#2563eb" text-anchor="end">' + fmt('R1') + '</text>');
      // 滑片与秤盘
      svg.push('<line x1="175" y1="85" x2="175" y2="138" stroke="#dc2626" stroke-width="2"/>');
      svg.push('<line x1="175" y1="138" x2="203" y2="138" stroke="#dc2626" stroke-width="2.2"/>');
      svg.push('<polygon points="204,138 196,134 196,142" fill="#dc2626"/>');
      // 电流表 A（左侧竖直）
      svg.push('<circle cx="45" cy="150" r="16" fill="#fff" stroke="#16a34a" stroke-width="2.2"/>');
      svg.push('<text x="45" y="155" font-size="15" font-weight="800" fill="#16a34a" text-anchor="middle">A</text>');
      // 底部电源与开关
      svg.push('<line x1="95" y1="203" x2="95" y2="227" stroke="#1e293b" stroke-width="2.2"/>');
      svg.push('<line x1="103" y1="209" x2="103" y2="221" stroke="#1e293b" stroke-width="3.5"/>');
      svg.push('<line x1="103" y1="215" x2="135" y2="215" stroke="#1e293b" stroke-width="2.2"/>');
      svg.push('<line x1="135" y1="215" x2="168" y2="202" stroke="#1e293b" stroke-width="2.2"/>');
      svg.push('<circle cx="135" cy="215" r="3" fill="#1e293b"/><circle cx="175" cy="215" r="3" fill="#1e293b"/>');
      svg.push('<text x="130" y="255" font-size="12.5" font-weight="700" fill="#475569" text-anchor="middle">' + fmt('总电阻 R=R1+R2') + '</text>');

      // 右侧：图3 R1-x 一次函数图象
      svg.push('<rect x="258" y="14" width="270" height="275" rx="10" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1.5"/>');
      svg.push('<text x="393" y="36" font-size="14" font-weight="800" fill="#1e293b" text-anchor="middle">' + fmt('图3 R1与质量x的关系') + '</text>');
      // 坐标轴原点 (305, 245)
      var ox = 305, oy = 245;
      svg.push('<line x1="285" y1="' + oy + '" x2="505" y2="' + oy + '" stroke="#1e293b" stroke-width="2"/>');
      svg.push('<polygon points="510,' + oy + ' 501,' + (oy - 4) + ' 501,' + (oy + 4) + '" fill="#1e293b"/>');
      svg.push('<line x1="' + ox + '" y1="262" x2="' + ox + '" y2="62" stroke="#1e293b" stroke-width="2"/>');
      svg.push('<polygon points="' + ox + ',56 ' + (ox - 4) + ',65 ' + (ox + 4) + ',65" fill="#1e293b"/>');
      svg.push('<text x="502" y="' + (oy + 20) + '" font-size="13" font-weight="700" fill="#1e293b" text-anchor="end">' + fmt('x/kg') + '</text>');
      svg.push('<text x="' + (ox + 8) + '" y="68" font-size="13" font-weight="700" fill="#1e293b">' + fmt('R1/kΩ') + '</text>');
      svg.push('<text x="' + (ox - 10) + '" y="' + (oy + 16) + '" font-size="13" font-weight="700" fill="#1e293b">O</text>');

      // (0,60) -> (ox, 95), (3,0) -> (ox+150, oy)
      var p60y = 95, p3x = ox + 150;
      svg.push('<line x1="' + ox + '" y1="' + p60y + '" x2="' + p3x + '" y2="' + oy + '" stroke="' + (step >= 1 ? '#2563eb' : '#1e293b') + '" stroke-width="3"/>');
      svg.push('<circle cx="' + ox + '" cy="' + p60y + '" r="4.5" fill="#2563eb"/>');
      svg.push('<circle cx="' + p3x + '" cy="' + oy + '" r="4.5" fill="#2563eb"/>');
      svg.push('<text x="' + (ox - 8) + '" y="' + (p60y + 5) + '" font-size="13" font-weight="700" fill="#1e293b" text-anchor="end">60</text>');
      svg.push('<text x="' + p3x + '" y="' + (oy + 18) + '" font-size="13" font-weight="700" fill="#1e293b" text-anchor="middle">3</text>');

      if (step >= 1) {
        svg.push('<text x="415" y="138" font-size="14" font-weight="800" fill="#2563eb">' + fmt('R1=-20x+60') + '</text>');
        // 标出 x=1, R1=40
        var p1x = ox + 50, p40y = 145;
        svg.push('<line x1="' + p1x + '" y1="' + oy + '" x2="' + p1x + '" y2="' + p40y + '" stroke="#dc2626" stroke-width="1.6" stroke-dasharray="4 3"/>');
        svg.push('<line x1="' + ox + '" y1="' + p40y + '" x2="' + p1x + '" y2="' + p40y + '" stroke="#dc2626" stroke-width="1.6" stroke-dasharray="4 3"/>');
        svg.push('<circle cx="' + p1x + '" cy="' + p40y + '" r="4.5" fill="#dc2626"/>');
        svg.push('<text x="' + p1x + '" y="' + (oy + 18) + '" font-size="13" font-weight="700" fill="#dc2626" text-anchor="middle">1</text>');
        svg.push('<text x="' + (ox - 8) + '" y="' + (p40y + 4) + '" font-size="13" font-weight="700" fill="#dc2626" text-anchor="end">40</text>');
      }

      if (step >= 2) {
        svg.push(window.svgFoCard(12, 302, 516, 86,
          '<div style="font-weight:800;color:#1e3a8a;margin-bottom:4px;">复合函数传递链（当放置 <span class="math"><i class="m">x</i><span class="num">=1kg</span></span> 物体时）：</div>' +
          '<div style="display:flex;align-items:center;justify-content:space-between;font-size:13px;font-weight:700;color:#0f172a;">' +
            '<span style="background:#dbeafe;padding:4px 8px;border-radius:6px;"><i class="m">x</i><span class="num">=1kg</span></span>' +
            '<span class="num">→</span>' +
            '<span style="background:#dbeafe;padding:4px 8px;border-radius:6px;"><i class="m">R</i><sub><span class="num">1</span></sub><span class="num">=40kΩ</span></span>' +
            '<span class="num">→</span>' +
            '<span style="background:#fef3c7;padding:4px 8px;border-radius:6px;"><i class="m">R</i><span class="num">=40+20=60kΩ</span></span>' +
            '<span class="num">→</span>' +
            '<span style="background:#dcfce7;padding:4px 8px;border-radius:6px;display:inline-flex;align-items:center;"><i class="m">U</i><span class="num">=60×0.2=12</span>，得 <i class="m">I</i><span class="num">=</span><span class="fraction"><span><span class="num">12</span></span><span><i class="m">R</i></span></span></span>' +
          '</div>',
          'background:#eff6ff;border:1.5px solid #93c5fd;'));
      }

      svg.push('</svg>');
      return svg.join('');
    }
  });

  // ==================== 第 5 页：新知探究 · 问题1（3） ====================
  window.defineSlide({
    lesson: 1,
    phase: 1,
    layout: 'layout-b',
    navTag: '问题1(3)·最大称量质量',
    section: '新知探究',
    title: '问题<span class="num">1</span>（<span class="num">3</span>）：由正常工作电流范围求电子秤的最大称量质量',
    sub: '由电流范围 0.15≤I≤0.6 反推总电阻 R 的范围，再求最大质量 x',
    state: { xMass: 1.0 },
    stem: '<div style="background:#eff6ff;border-left:4px solid #2563eb;padding:5px 10px;border-radius:6px;margin-bottom:6px;font-size:13.5px;color:#1e3a8a;">' +
            '<b>【前问已知】</b>可变电阻<span class="math"><i class="m">R</i><sub><span class="num">1</span></sub><span class="num">=-20</span><i class="m">x</i><span class="num">+60</span></span>（<span class="math"><span class="num">0≤</span><i class="m">x</i><span class="num">≤3</span></span>），总电阻<span class="math"><i class="m">R</i><span class="num">=</span><i class="m">R</i><sub><span class="num">1</span></sub><span class="num">+20=-20</span><i class="m">x</i><span class="num">+80</span></span>，电流<span class="math"><i class="m">I</i><span class="num">=</span><span class="fraction"><span><span class="num">12</span></span><span><i class="m">R</i></span></span></span>．' +
          '</div>' +
          '<p>（<span class="num">3</span>）已知该电子秤正常工作的电流范围为<span class="math"><span class="num">0.15≤</span><i class="m">I</i><span class="num">≤0.6</span></span>（单位：<span class="num">mA</span>），则总电阻<i class="m">R</i>的取值范围为<span class="screen-blank" data-step="1" data-ans="<span class=\'num\'>20kΩ≤</span><i class=\'m\'>R</i><span class=\'num\'>≤80kΩ</span>"></span>，该电子秤可称量物品的最大质量为<span class="screen-blank" data-step="2" data-ans="<span class=\'num\'>3kg</span>"></span>．</p>',
    steps: [
      {
        title: '由反比例函数增减性求出总电阻<i class="m">R</i>的允许范围',
        body: '在<span class="math"><i class="m">I</i><span class="num">=</span><span class="fraction"><span><span class="num">12</span></span><span><i class="m">R</i></span></span></span>中，当<span class="math"><i class="m">R</i><span class="num">&gt;0</span></span>时，<i class="m">I</i>随<i class="m">R</i>的增大而减小．<br>当<span class="math"><i class="m">I</i><span class="num">=0.15mA</span></span>时，<span class="math"><i class="m">R</i><span class="num">=</span><span class="fraction"><span><span class="num">12</span></span><span><span class="num">0.15</span></span></span><span class="num">=80kΩ</span></span>；当<span class="math"><i class="m">I</i><span class="num">=0.6mA</span></span>时，<span class="math"><i class="m">R</i><span class="num">=</span><span class="fraction"><span><span class="num">12</span></span><span><span class="num">0.6</span></span></span><span class="num">=20kΩ</span></span>．<br>∴总电阻<i class="m">R</i>的取值范围为<b><span class="math"><span class="num">20kΩ≤</span><i class="m">R</i><span class="num">≤80kΩ</span></span></b>．'
      },
      {
        title: '由总电阻下限求所称物品的最大质量',
        body: '∵<span class="math"><i class="m">R</i><span class="num">=</span><i class="m">R</i><sub><span class="num">1</span></sub><span class="num">+</span><i class="m">R</i><sub><span class="num">2</span></sub><span class="num">=-20</span><i class="m">x</i><span class="num">+60+20=-20</span><i class="m">x</i><span class="num">+80</span></span>，其中<span class="math"><span class="num">-20&lt;0</span></span>，故质量<i class="m">x</i>最大时，总电阻<i class="m">R</i>最小．<br>当<span class="math"><i class="m">R</i><sub><span class="num">min</span></sub><span class="num">=20kΩ</span></span>（即<span class="math"><i class="m">I</i><sub><span class="num">max</span></sub><span class="num">=0.6mA</span></span>）时，由<span class="math"><span class="num">-20</span><i class="m">x</i><span class="num">+80=20</span></span>解得<span class="math"><i class="m">x</i><sub><span class="num">max</span></sub><span class="num">=3kg</span></span>，故最大质量为<b><span class="num">3kg</span></b>．'
      }
    ],
    controls: function (step, state) {
      if (step < 1) return '';
      var xm = state.xMass !== undefined ? Number(state.xMass) : 1.0;
      return slider('xMass', '放置物品质量<i class="m">x</i>', 0, 3, xm.toFixed(1), 0.1, 'kg');
    },
    renderScene: function (step, state) {
      var c = window.createCoordCanvas({
        width: 520, height: 400,
        xMin: -8, xMax: 95, yMin: -0.08, yMax: 0.72,
        xLabel: 'R/kΩ', yLabel: 'I/mA', showGrid: false
      });
      c.drawAxes({ showGrid: false, xLabel: 'R/kΩ', yLabel: 'I/mA', xTicks: [], yTicks: [] });

      // 刻度
      [20, 40, 60, 80].forEach(function (rx) {
        c.drawSegment([rx, 0], [rx, 0.015], { color: '#1e293b', width: 1.5 });
        c.drawText([rx, -0.04], String(rx), { fontSize: 12, color: '#475569' });
      });
      [0.15, 0.3, 0.45, 0.6].forEach(function (iy) {
        c.drawSegment([0, iy], [1.8, iy], { color: '#1e293b', width: 1.5 });
        c.drawText([-5.5, iy], String(iy), { fontSize: 12, color: '#475569' });
      });

      // Step >= 1: 正常工作区间阴影与高亮曲线
      if (step >= 1) {
        c.drawPolygon([[20, 0], [80, 0], [80, 0.6], [20, 0.6]], { fill: 'rgba(37,99,235,0.08)', stroke: 'none', width: 0 });
        c.drawSegment([20, 0], [20, 0.6], { color: '#dc2626', width: 1.8, dash: '5 4' });
        c.drawSegment([0, 0.6], [20, 0.6], { color: '#dc2626', width: 1.8, dash: '5 4' });
        c.drawSegment([80, 0], [80, 0.15], { color: '#2563eb', width: 1.8, dash: '5 4' });
        c.drawSegment([0, 0.15], [80, 0.15], { color: '#2563eb', width: 1.8, dash: '5 4' });
      }

      // 反比例曲线 I = 12/R
      c.curve(function (R) { return 12 / R; }, 17.5, 90, { color: '#94a3b8', width: 2.2 });
      if (step >= 1) {
        c.curve(function (R) { return 12 / R; }, 20, 80, { color: '#2563eb', width: 3.8 });
        c.drawPoint([20, 0.6], { color: '#dc2626', r: 5.5 });
        c.drawPoint([80, 0.15], { color: '#2563eb', r: 5.5 });
        c.drawText([28, 0.64], 'M(20,0.6) 最大质量x=3kg', { fontSize: 13, color: '#dc2626', anchor: 'start' });
        c.drawText([78, 0.22], 'N(80,0.15) 空载x=0kg', { fontSize: 13, color: '#1d4ed8', anchor: 'end' });
      }

      // 动态称重滑块状态
      var xm = state.xMass !== undefined ? Number(state.xMass) : (step >= 2 ? 3.0 : 1.0);
      var R1 = -20 * xm + 60;
      var R = R1 + 20;
      var I = 12 / R;

      if (step >= 1) {
        c.drawPoint([R, I], { color: '#16a34a', r: 6.5 });
        c.drawSegment([R, 0], [R, I], { color: '#16a34a', width: 1.6, dash: '3 3' });
        c.raw(window.svgFoCard(240, 22, 265, 110,
          '<div style="font-weight:800;color:#0f172a;border-bottom:1px solid #cbd5e1;padding-bottom:3px;margin-bottom:4px;">电子秤实时监测面板</div>' +
          '<div style="font-size:13px;line-height:1.5;color:#1e293b;">' +
            '<div>物品质量：<b style="color:#16a34a;"><span class="math"><i class="m">x</i><span class="num">=' + xm.toFixed(1) + 'kg</span></span></b></div>' +
            '<div>可变电阻：<span class="math"><i class="m">R</i><sub><span class="num">1</span></sub><span class="num">=' + R1.toFixed(0) + 'kΩ</span></span>，总电阻：<b style="color:#2563eb;"><span class="math"><i class="m">R</i><span class="num">=' + R.toFixed(0) + 'kΩ</span></span></b></div>' +
            '<div>当前电流：<b style="color:#dc2626;"><span class="math"><i class="m">I</i><span class="num">=' + I.toFixed(2) + 'mA</span></span></b>（范围 <span class="num">0.15~0.6mA</span>）</div>' +
          '</div>',
          'background:rgba(240,253,244,0.96);border:1.5px solid #86efac;'));
      }

      return c.toSvg();
    }
  });
})();

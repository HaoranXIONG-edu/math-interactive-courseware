window.UNIT1_THEOREM_SLIDES = window.UNIT1_THEOREM_SLIDES || [];
window.UNIT1_SIMS = window.UNIT1_SIMS || {};
window.COURSEWARE_BRAND = '反比例函数';
window.COURSEWARE_TITLE = '2.3.1 反比例函数应用(1)';
window.COURSEWARE_PHASES = [
  ['① 情境引入', '湿地铺板压强激活'],
  ['② 新知探究', '蓄电池与桔槔实验探究'],
  ['③ 新知应用', '第1—5题典例精析'],
  ['④ 分层训练', '训练1—2与课堂小结']
];

// =========================================================================
// Slide 0: 课题导览（封面）
// =========================================================================
window.defineSlide({
  cover: true,
  lesson: 1,
  phase: 0,
  navTag: '课题导览',
  section: '情境引入',
  title: '<span class="num">2.3.1</span> 反比例函数的应用（<span class="num">1</span>）',
  html: window.renderStandardCover({
    chapter: '北师大版九年级数学上册 · 第二章 反比例函数',
    num: '2.3.1',
    title: '反比例函数的应用（<span class="num">1</span>）',
    caption: '第二章 反比例函数 · 实际建模与数形结合',
    goals: [
      '经历分析实际问题中两个变量之间的关系、建立反比例函数模型，进而解决问题的过程，进一步体会模型思想，发展应用意识；（<b class="goal-focus">重点</b>）',
      '能用反比例函数解决简单实际问题，进一步体会数形结合的思想，发展几何直观．（<b class="goal-hard">难点</b>）'
    ]
  })
});

// =========================================================================
// Slide 1A: 一、情境引入（第(1)~(3)问：压强公式建模与临界计算）
// =========================================================================
window.defineSlide({
  lesson: 1,
  phase: 0,
  navTag: '情境(1)-(3)·压强建模',
  section: '情境引入',
  title: '情境引入（<span class="num">1</span>）—（<span class="num">3</span>）：湿地铺板中的压强与面积反比例建模',
  layout: 'layout-b',
  state: { Sval: 0.2 },
  stem:
    '<p>道远学校科技小组利用铺垫木板的方式通过一片烂泥湿地．当人和木板对湿地的压力一定时（合计<span class="num">600N</span>），随着木板面积<i class="m">S</i>（单位：<span class="num">m</span><sup><span class="num">2</span></sup>）的变化，压强<i class="m">p</i>（单位：<span class="num">Pa</span>）将如何变化？</p>' +
    '<p>（<span class="num">1</span>）用含<i class="m">S</i>的代数式表示<i class="m">p</i>：<span class="screen-blank" data-step="1" data-ans="<span class=\'math\'><i class=\'m\'>p</i><span class=\'num\'>=</span><span class=\'fraction\'><span><span class=\'num\'>600</span></span><span><i class=\'m\'>S</i></span></span></span>（<i class=\'m\'>S</i><span class=\'num\'>&gt;0</span>）"></span>，<i class="m">p</i>是<i class="m">S</i>的反比例函数吗？　（<span class="num">2</span>）当木板面积为<span class="num">0.2m</span><sup><span class="num">2</span></sup>时，压强是<span class="screen-blank" data-step="2" data-ans="<span class=\'num\'>3000Pa</span>"></span>；　（<span class="num">3</span>）若要求压强不超过<span class="num">6000Pa</span>，木板面积至少要<span class="screen-blank" data-step="3" data-ans="<span class=\'num\'>0.1m</span><sup><span class=\'num\'>2</span></sup>"></span>．</p>',
  steps: [
    [
      '建立反比例函数模型（第<span class="num">1</span>问）',
      '由压强公式<span class="math"><i class="m">p</i><span class="num">=</span><span class="fraction"><span><i class="m">F</i></span><span><i class="m">S</i></span></span></span>，已知压力<span class="math"><i class="m">F</i><span class="num">=600N</span></span>，得<span class="math"><i class="m">p</i><span class="num">=</span><span class="fraction"><span><span class="num">600</span></span><span><i class="m">S</i></span></span></span>（<span class="math"><i class="m">S</i><span class="num">&gt;0</span></span>），符合<span class="math"><i class="m">y</i><span class="num">=</span><span class="fraction"><span><i class="m">k</i></span><span><i class="m">x</i></span></span></span>形式，故<i class="m">p</i>是<i class="m">S</i>的反比例函数．'
    ],
    [
      '已知木板面积求地面压强（第<span class="num">2</span>问）',
      '当<span class="math"><i class="m">S</i><span class="num">=0.2m</span><sup><span class="num">2</span></sup></span>时，代入表达式得<span class="math"><i class="m">p</i><span class="num">=</span><span class="fraction"><span><span class="num">600</span></span><span><span class="num">0.2</span></span></span><span class="num">=</span><b style="color:#dc2626;">3000</b></span>（<span class="num">Pa</span>）．'
    ],
    [
      '由压强上限求木板最小面积（第<span class="num">3</span>问）',
      '当<span class="math"><i class="m">p</i><span class="num">=6000Pa</span></span>时，<span class="math"><span class="fraction"><span><span class="num">600</span></span><span><i class="m">S</i></span></span><span class="num">=6000</span></span>，解得<span class="math"><i class="m">S</i><span class="num">=0.1m</span><sup><span class="num">2</span></sup></span>．因为压力一定时面积越大压强越小，要使<span class="math"><i class="m">p</i><span class="num">≤6000Pa</span></span>，木板面积至少要<b style="color:#dc2626;"><span class="num">0.1m</span><sup><span class="num">2</span></sup></b>．'
    ]
  ],
  controls: function (step, state) {
    if (step < 1) return '';
    return window.slider('Sval', '调节木板面积<i class="m">S</i>', 0.1, 0.6, state.Sval || 0.2, 0.05, 'm²');
  },
  renderScene: function (step, state) {
    var sVal = step >= 1 ? Number(state.Sval || 0.2) : 0.2;
    var pVal = Math.round(600 / sVal);
    var isSafe = pVal <= 6000;
    var boardW = Math.round(80 + sVal * 320); // 0.1 -> 112px, 0.6 -> 272px
    var boardX = Math.round(260 - boardW / 2);
    var sinkDepth = Math.min(28, Math.round((pVal / 6000) * 18));

    var parts = [];
    parts.push('<svg viewBox="0 0 520 400" width="100%" height="100%" style="background:#ffffff;border-radius:12px;">');
    // 顶部标题卡
    parts.push('<rect x="24" y="18" width="472" height="44" rx="10" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>');
    parts.push('<text x="260" y="46" text-anchor="middle" font-size="16" font-weight="700" fill="#1e293b">' + window.svgAutoFormatText('湿地铺垫木板物理受力模型：压力 F = 600 N（恒定）') + '</text>');

    // 烂泥湿地层
    parts.push('<rect x="40" y="210" width="440" height="82" rx="10" fill="#fef3c7" stroke="#f59e0b" stroke-width="1.5"/>');
    parts.push('<text x="465" y="280" text-anchor="end" font-size="13" font-weight="700" fill="#b45309">' + window.svgAutoFormatText('烂泥湿地（承受极限 6000 Pa）') + '</text>');

    // 木板（随 Sval 改变宽度与下陷深度）
    var boardY = 196 + (step >= 1 ? sinkDepth : 8);
    parts.push('<rect x="' + boardX + '" y="' + boardY + '" width="' + boardW + '" height="16" rx="4" fill="#d97706" stroke="#78350f" stroke-width="2"/>');
    parts.push('<text x="260" y="' + (boardY + 34) + '" text-anchor="middle" font-size="14" font-weight="700" fill="#78350f">' + window.svgAutoFormatText('木板受压面积 S = ' + sVal.toFixed(2) + ' m²') + '</text>');

    // 压力箭头 F = 600N
    parts.push('<line x1="260" y1="92" x2="260" y2="' + (boardY - 6) + '" stroke="#dc2626" stroke-width="4"/>');
    parts.push('<polygon points="260,' + boardY + ' 253,' + (boardY - 12) + ' 267,' + (boardY - 12) + '" fill="#dc2626"/>');
    parts.push('<text x="244" y="138" text-anchor="end" font-size="16" font-weight="700" fill="#dc2626">' + window.svgAutoFormatText('总压力 F = 600 N') + '</text>');

    // 底部三步数据卡片
    parts.push('<rect x="24" y="308" width="146" height="72" rx="10" fill="' + (step >= 1 ? '#eff6ff' : '#f8fafc') + '" stroke="' + (step >= 1 ? '#3b82f6' : '#cbd5e1') + '" stroke-width="1.8"/>');
    parts.push('<text x="97" y="334" text-anchor="middle" font-size="13.5" font-weight="700" fill="#1e40af">' + window.svgAutoFormatText('（1）函数关系式') + '</text>');
    parts.push('<text x="97" y="362" text-anchor="middle" font-size="15" font-weight="700" fill="' + (step >= 1 ? '#1d4ed8' : '#94a3b8') + '">' + window.svgAutoFormatText(step >= 1 ? 'p = 600 / S' : '待推导') + '</text>');

    parts.push('<rect x="187" y="308" width="146" height="72" rx="10" fill="' + (step >= 2 ? '#fef2f2' : '#f8fafc') + '" stroke="' + (step >= 2 ? '#ef4444' : '#cbd5e1') + '" stroke-width="1.8"/>');
    parts.push('<text x="260" y="334" text-anchor="middle" font-size="13.5" font-weight="700" fill="#991b1b">' + window.svgAutoFormatText('（2）当 S = 0.2 m²') + '</text>');
    parts.push('<text x="260" y="362" text-anchor="middle" font-size="15" font-weight="700" fill="' + (step >= 2 ? '#dc2626' : '#94a3b8') + '">' + window.svgAutoFormatText(step >= 2 ? 'p = 3000 Pa' : '待计算') + '</text>');

    parts.push('<rect x="350" y="308" width="146" height="72" rx="10" fill="' + (step >= 3 ? '#f0fdf4' : '#f8fafc') + '" stroke="' + (step >= 3 ? '#22c55e' : '#cbd5e1') + '" stroke-width="1.8"/>');
    parts.push('<text x="423" y="334" text-anchor="middle" font-size="13.5" font-weight="700" fill="#166534">' + window.svgAutoFormatText('（3）要求 p ≤ 6000 Pa') + '</text>');
    parts.push('<text x="423" y="362" text-anchor="middle" font-size="15" font-weight="700" fill="' + (step >= 3 ? '#15803d' : '#94a3b8') + '">' + window.svgAutoFormatText(step >= 3 ? 'S ≥ 0.1 m²' : '待求解') + '</text>');

    if (step >= 1) {
      parts.push('<rect x="315" y="82" width="175" height="58" rx="8" fill="' + (isSafe ? '#f0fdf4' : '#fef2f2') + '" stroke="' + (isSafe ? '#86efac' : '#fca5a5') + '" stroke-width="1.5"/>');
      parts.push('<text x="402" y="106" text-anchor="middle" font-size="14" font-weight="700" fill="#1e293b">' + window.svgAutoFormatText('实时压强 p = ' + pVal + ' Pa') + '</text>');
      parts.push('<text x="402" y="128" text-anchor="middle" font-size="13" font-weight="700" fill="' + (isSafe ? '#15803d' : '#dc2626') + '">' + window.svgAutoFormatText(isSafe ? '✓ 未超限（安全通行）' : '⚠ 超过6000Pa（下陷）') + '</text>');
    }
    parts.push('</svg>');
    return parts.join('');
  }
});

// =========================================================================
// Slide 1B: 一、情境引入（第(4)问 + 思考：列表描点作图与第一象限图象解释）
// =========================================================================
window.defineSlide({
  lesson: 1,
  phase: 0,
  navTag: '情境(4)·描点作图解释',
  section: '情境引入',
  title: '情境引入（<span class="num">4</span>）：作出反比例函数图象并作直观解释',
  layout: 'layout-b',
  state: { Sval: 0.2 },
  stem:
    '<div style="background:#eff6ff;border-left:4px solid #2563eb;padding:4px 10px;margin-bottom:5px;border-radius:4px;font-size:14.5px;color:#1e40af;"><b>【前问已知】</b>人和木板对湿地的压强<i class="m">p</i>与木板面积<i class="m">S</i>满足反比例函数<span class="math"><i class="m">p</i><span class="num">=</span><span class="fraction"><span><span class="num">600</span></span><span><i class="m">S</i></span></span></span>（<span class="math"><i class="m">S</i><span class="num">&gt;0</span></span>）．</div>' +
    '<p>（<span class="num">4</span>）在平面直角坐标系中作出相应函数的图象，并利用图象对（<span class="num">2</span>）“当<span class="math"><i class="m">S</i><span class="num">=0.2m</span><sup><span class="num">2</span></sup></span>时<span class="math"><i class="m">p</i><span class="num">=3000Pa</span></span>”和（<span class="num">3</span>）“当<span class="math"><i class="m">p</i><span class="num">≤6000Pa</span></span>时<span class="math"><i class="m">S</i><span class="num">≥0.1m</span><sup><span class="num">2</span></sup></span>”作出直观解释．<b>思考：</b>为什么反比例函数图象只有<span class="screen-blank" data-step="3" data-ans="第一象限的一支"></span>？</p>',
  steps: [
    [
      '列表、描点并连成平滑曲线',
      '取<span class="math"><i class="m">S</i><span class="num">=0.1, 0.2, 0.3, 0.4, 0.6</span></span>，对应<span class="math"><i class="m">p</i><span class="num">=6000, 3000, 2000, 1500, 1000</span></span>，在第一象限描点并用平滑曲线连接．'
    ],
    [
      '利用函数图象直观解释（<span class="num">2</span>）与（<span class="num">3</span>）',
      '在图象上，横坐标<span class="math"><i class="m">S</i><span class="num">=0.2</span></span>对应点<span class="num">(0.2,3000)</span>，纵坐标为<span class="num">3000</span>；纵坐标<span class="math"><i class="m">p</i><span class="num">≤6000</span></span>的曲线段位于点<span class="num">(0.1,6000)</span>及其右侧，对应横坐标<b style="color:#dc2626;"><span class="math"><i class="m">S</i><span class="num">≥0.1m</span><sup><span class="num">2</span></sup></span></b>．'
    ],
    [
      '思考：为什么图象只有第一象限的一支？',
      '因为在实际情境中，木板面积<span class="math"><i class="m">S</i><span class="num">&gt;0</span></span>，地面压强<span class="math"><i class="m">p</i><span class="num">&gt;0</span></span>，自变量与函数值均取正数，故图象只分布在<b style="color:#dc2626;">第一象限</b>．'
    ]
  ],
  controls: function (step, state) {
    if (step < 1) return '';
    return window.slider('Sval', '调节木板面积<i class="m">S</i>', 0.1, 0.6, state.Sval || 0.2, 0.02, 'm²');
  },
  renderScene: function (step, state) {
    var c = window.createCoordCanvas({
      width: 520,
      height: 400,
      xRange: [-0.8, 6.8],
      yRange: [-0.8, 6.8],
      showGrid: false,
      showTicks: false
    });

    var gx, gy;
    for (gx = 1; gx <= 6; gx++) {
      c.line(gx, 0, gx, 6.3, '#cbd5e1', 1, '4,4');
      c.text(gx, -0.35, (gx * 0.1).toFixed(1), '#334155', 14, 'middle', 'normal');
    }
    for (gy = 1; gy <= 6; gy++) {
      c.line(0, gy, 6.3, gy, '#cbd5e1', 1, '4,4');
      c.text(-0.42, gy, String(gy * 1000), '#334155', 13, 'end', 'normal');
    }

    c.line(-0.3, 0, 6.55, 0, '#1e293b', 2);
    c.line(0, -0.3, 0, 6.55, '#1e293b', 2);
    c.raw(
      '<polygon points="' + c.sx(6.62) + ',' + c.sy(0) + ' ' + (c.sx(6.62) - 9) + ',' + (c.sy(0) - 4.5) + ' ' + (c.sx(6.62) - 9) + ',' + (c.sy(0) + 4.5) + '" fill="#1e293b"/>' +
      '<polygon points="' + c.sx(0) + ',' + c.sy(6.62) + ' ' + (c.sx(0) - 4.5) + ',' + (c.sy(6.62) + 9) + ' ' + (c.sx(0) + 4.5) + ',' + (c.sy(6.62) + 9) + '" fill="#1e293b"/>'
    );
    c.text(-0.22, -0.28, 'O', '#1e293b', 15, 'end');
    c.text(6.45, 0.35, 'S/m²', '#1e293b', 14.5, 'middle', 'bold');
    c.text(0.22, 6.45, 'p/Pa', '#1e293b', 15, 'start', 'bold');

    // Step >= 1: 描点并绘制平滑曲线
    if (step >= 1) {
      c.curve(function (wx) { return 6 / wx; }, 0.94, 6.3, '#2563eb', 3);
      var samplePts = [[1, 6], [2, 3], [3, 2], [4, 1.5], [6, 1]];
      for (var i = 0; i < samplePts.length; i++) {
        c.point(samplePts[i][0], samplePts[i][1], '', '#2563eb', 0, 0, 4.5);
      }
      c.text(4.3, 1.72, 'p = 600 / S (S > 0)', '#1d4ed8', 14.5, 'start', 'bold');
    }

    // Step >= 2: 直观解释 (0.2, 3000) 与 p <= 6000 对应 S >= 0.1
    if (step >= 2) {
      var xMinPx = c.sx(1), xMaxPx = c.sx(6.3), yTopPx = c.sy(6), yBotPx = c.sy(0);
      c.raw('<rect x="' + xMinPx + '" y="' + yTopPx + '" width="' + (xMaxPx - xMinPx) + '" height="' + (yBotPx - yTopPx) + '" fill="rgba(22,163,74,0.08)"/>');
      c.line(2, 0, 2, 3, '#2563eb', 1.8, '5,4');
      c.line(0, 3, 2, 3, '#2563eb', 1.8, '5,4');
      c.point(2, 3, '', '#2563eb', 0, 0, 5.5);
      c.text(2.15, 3.25, '(0.2, 3000)', '#1d4ed8', 14, 'start', 'bold');

      c.line(0, 6, 6.3, 6, '#dc2626', 1.8, '6,4');
      c.line(1, 0, 1, 6, '#16a34a', 2, '5,4');
      c.line(1, 0, 6.3, 0, '#16a34a', 4.5);
      c.point(1, 6, '', '#dc2626', 0, 0, 5.5);
      c.text(1.15, 6.18, '(0.1, 6000) 压强上限', '#dc2626', 14, 'start', 'bold');
      c.text(3.6, 0.35, '安全面积区：S ≥ 0.1 m²', '#15803d', 14, 'middle', 'bold');
    }

    // Step >= 3: 标注第一象限实际意义定义域说明
    if (step >= 3) {
      c.raw(
        '<rect x="' + c.sx(2.25) + '" y="' + c.sy(5.45) + '" width="265" height="32" rx="6" fill="#fef2f2" stroke="#fca5a5" stroke-width="1.5"/>' +
        '<text x="' + (c.sx(2.25) + 132) + '" y="' + (c.sy(5.45) + 21) + '" text-anchor="middle" font-size="12.5" font-weight="700" fill="#b91c1c">' +
        window.svgAutoFormatText('实际量 S > 0, p > 0 ⇒ 仅第一象限一支') +
        '</text>'
      );
    }

    // 动态滑块点
    if (step >= 1) {
      var sVal = Number(state.Sval || 0.2);
      var wxDynamic = sVal * 10;
      var wyDynamic = 6 / wxDynamic;
      var pVal = Math.round(600 / sVal);
      c.line(wxDynamic, 0, wxDynamic, wyDynamic, '#d97706', 1.6, '3,3');
      c.line(0, wyDynamic, wxDynamic, wyDynamic, '#d97706', 1.6, '3,3');
      c.point(wxDynamic, wyDynamic, '', '#f59e0b', 0, 0, 6.5);
      c.raw(
        '<rect x="' + c.sx(2.25) + '" y="' + c.sy(4.45) + '" width="265" height="32" rx="6" fill="#fffbeb" stroke="#fcd34d" stroke-width="1.5"/>' +
        '<text x="' + (c.sx(2.25) + 132) + '" y="' + (c.sy(4.45) + 21) + '" text-anchor="middle" font-size="13.5" font-weight="700" fill="#b45309">' +
        window.svgAutoFormatText('当前：S = ' + sVal.toFixed(2) + ' m²，p ≈ ' + pVal + ' Pa') +
        '</text>'
      );
    }

    return c.done();
  }
});

// =========================================================================
// Slide 2A: 二、新知探究 —— 问题1(1)：蓄电池电流与电阻反比例关系式
// =========================================================================
window.defineSlide({
  lesson: 1,
  phase: 1,
  navTag: '问题1(1)·求表达式',
  section: '新知探究',
  title: '问题<span class="num">1</span>（<span class="num">1</span>）：由蓄电池实验图象求反比例函数表达式',
  layout: 'layout-b',
  stem:
    '<p><b>问题<span class="num">1</span>：</b>蓄电池电压为定值，使用此电源时，电流<i class="m">I</i>（单位：<span class="num">A</span>）与电阻<i class="m">R</i>（单位：<span class="num">Ω</span>）之间的关系图象如图所示．若点<i class="m">A</i><span class="num">(9,4)</span>在图象上：</p>' +
    '<p>（<span class="num">1</span>）电流<i class="m">I</i>是电阻<i class="m">R</i>的<span class="screen-blank" data-step="1" data-ans="反比例"></span>函数，这个函数的表达式为<span class="screen-blank" data-step="2" data-ans="<span class=\'math\'><i class=\'m\'>I</i><span class=\'num\'>=</span><span class=\'fraction\'><span><span class=\'num\'>36</span></span><span><i class=\'m\'>R</i></span></span></span>（<i class=\'m\'>R</i><span class=\'num\'>&gt;0</span>）"></span>．</p>',
  steps: [
    [
      '由物理定律判断函数类型',
      '由欧姆定律<span class="math"><i class="m">I</i><span class="num">=</span><span class="fraction"><span><i class="m">U</i></span><span><i class="m">R</i></span></span></span>知，当蓄电池电压<i class="m">U</i>为定值时，电流<i class="m">I</i>是电阻<i class="m">R</i>的<b style="color:#dc2626;">反比例</b>函数．'
    ],
    [
      '代入已知点<i class="m">A</i><span class="num">(9,4)</span>求电压定值<i class="m">U</i>',
      '将点<span class="math"><i class="m">A</i><span class="num">(9,4)</span></span>代入<span class="math"><i class="m">I</i><span class="num">=</span><span class="fraction"><span><i class="m">U</i></span><span><i class="m">R</i></span></span></span>，得<span class="math"><i class="m">U</i><span class="num">=9×4=36</span></span>（<span class="num">V</span>），故函数表达式为<b style="color:#dc2626;"><span class="math"><i class="m">I</i><span class="num">=</span><span class="fraction"><span><span class="num">36</span></span><span><i class="m">R</i></span></span></span>（<span class="math"><i class="m">R</i><span class="num">&gt;0</span></span>）</b>．'
    ]
  ],
  renderScene: function (step) {
    var c = window.createCoordCanvas({
      width: 520,
      height: 400,
      xRange: [-2.2, 19.5],
      yRange: [-2.2, 19.5],
      showGrid: false,
      showTicks: false
    });
    var rTicks = [1, 2, 3, 4, 6, 9, 12, 18];
    for (var i = 0; i < rTicks.length; i++) {
      var r = rTicks[i];
      var wy = (36 / r) / 2;
      c.line(r, 0, r, wy, '#93c5fd', 1.1, '4,3');
      c.line(0, wy, r, wy, '#93c5fd', 1.1, '4,3');
    }
    var xLabelList = [2, 4, 6, 9, 12, 18];
    for (var j = 0; j < xLabelList.length; j++) {
      c.text(xLabelList[j], -0.95, String(xLabelList[j]), '#334155', 13, 'middle', 'normal');
    }
    var yLabelList = [4, 6, 9, 12, 18, 36];
    for (var k = 0; k < yLabelList.length; k++) {
      c.text(-0.55, yLabelList[k] / 2 - 0.15, String(yLabelList[k]), '#334155', 12.5, 'end', 'normal');
    }
    c.line(-0.8, 0, 18.8, 0, '#1e293b', 2);
    c.line(0, -0.8, 0, 18.8, '#1e293b', 2);
    c.raw(
      '<polygon points="' + c.sx(19.0) + ',' + c.sy(0) + ' ' + (c.sx(19.0) - 9) + ',' + (c.sy(0) - 4.5) + ' ' + (c.sx(19.0) - 9) + ',' + (c.sy(0) + 4.5) + '" fill="#1e293b"/>' +
      '<polygon points="' + c.sx(0) + ',' + c.sy(19.0) + ' ' + (c.sx(0) - 4.5) + ',' + (c.sy(19.0) + 9) + ' ' + (c.sx(0) + 4.5) + ',' + (c.sy(19.0) + 9) + '" fill="#1e293b"/>'
    );
    c.text(-0.55, -0.85, 'O', '#1e293b', 14, 'end');
    c.text(18.5, 1.1, 'R/Ω', '#1e293b', 15, 'middle', 'bold');
    c.text(0.55, 18.5, 'I/A', '#1e293b', 15, 'start', 'bold');

    c.curve(function (wx) { return 18 / wx; }, 0.98, 18.2, step >= 2 ? '#2563eb' : '#1e293b', 2.8);
    for (var m = 0; m < rTicks.length; m++) {
      c.point(rTicks[m], 18 / rTicks[m], '', '#334155', 0, 0, 3.2);
    }
    if (step >= 1) {
      c.polygon([[0, 0], [9, 0], [9, 2], [0, 2]], 'rgba(37,99,235,0.12)', '#2563eb', 1.8);
    }
    c.point(9, 2, 'A(9,4)', '#dc2626', 10, -10, 6);
    if (step >= 2) {
      c.raw(
        '<rect x="' + c.sx(5.3) + '" y="' + c.sy(16.8) + '" width="246" height="58" rx="8" fill="#eff6ff" stroke="#93c5fd" stroke-width="1.5"/>' +
        '<text x="' + (c.sx(5.3) + 123) + '" y="' + (c.sy(16.8) + 23) + '" text-anchor="middle" font-size="14" font-weight="700" fill="#1e3a8a">' +
        window.svgAutoFormatText('定值电压：U = 9 × 4 = 36 (V)') +
        '</text>' +
        '<text x="' + (c.sx(5.3) + 123) + '" y="' + (c.sy(16.8) + 46) + '" text-anchor="middle" font-size="14" font-weight="700" fill="#dc2626">' +
        window.svgAutoFormatText('表达式：I = 36 / R (R > 0)') +
        '</text>'
      );
    }
    return c.done();
  }
});

// =========================================================================
// Slide 2B: 二、新知探究 —— 问题1(2)：限制电流区间求可变电阻控制范围
// =========================================================================
window.defineSlide({
  lesson: 1,
  phase: 1,
  navTag: '问题1(2)·求电阻范围',
  section: '新知探究',
  title: '问题<span class="num">1</span>（<span class="num">2</span>）：利用反比例函数图象求可变电阻<i class="m">R</i>的控制范围',
  layout: 'layout-b',
  state: { Rval: 3 },
  stem:
    '<div style="background:#eff6ff;border-left:4px solid #2563eb;padding:4px 10px;margin-bottom:5px;border-radius:4px;font-size:14.5px;color:#1e40af;"><b>【前问已知】</b>蓄电池电流<i class="m">I</i>与电阻<i class="m">R</i>的函数表达式为<span class="math"><i class="m">I</i><span class="num">=</span><span class="fraction"><span><span class="num">36</span></span><span><i class="m">R</i></span></span></span>（<span class="math"><i class="m">R</i><span class="num">&gt;0</span></span>）．</div>' +
    '<p>（<span class="num">2</span>）如果以此蓄电池为电源的用电器能正常工作，则限制电流不得低于<span class="num">9A</span>，且不超过<span class="num">18A</span>（即<span class="math"><span class="num">9A≤</span><i class="m">I</i><span class="num">≤18A</span></span>），请问用电器的可变电阻<i class="m">R</i>应控制在什么范围？<span class="screen-blank" data-step="2" data-ans="<span class=\'num\'>2Ω≤</span><i class=\'m\'>R</i><span class=\'num\'>≤4Ω</span>"></span></p>',
  steps: [
    [
      '求两个临界电流对应的电阻值',
      '当<span class="math"><i class="m">I</i><span class="num">=9A</span></span>时，由<span class="math"><span class="fraction"><span><span class="num">36</span></span><span><i class="m">R</i></span></span><span class="num">=9</span></span>解得<span class="math"><i class="m">R</i><span class="num">=4Ω</span></span>；当<span class="math"><i class="m">I</i><span class="num">=18A</span></span>时，由<span class="math"><span class="fraction"><span><span class="num">36</span></span><span><i class="m">R</i></span></span><span class="num">=18</span></span>解得<span class="math"><i class="m">R</i><span class="num">=2Ω</span></span>．'
    ],
    [
      '结合第一象限增减性确定电阻范围',
      '因为<span class="math"><i class="m">U</i><span class="num">=36&gt;0</span></span>，当<span class="math"><i class="m">R</i><span class="num">&gt;0</span></span>时，<i class="m">I</i>随<i class="m">R</i>的增大而减小．故当<span class="math"><span class="num">9A≤</span><i class="m">I</i><span class="num">≤18A</span></span>时，可变电阻<i class="m">R</i>应控制在<b style="color:#dc2626;"><span class="num">2Ω≤</span><i class="m">R</i><span class="num">≤4Ω</span></b>范围内．'
    ]
  ],
  controls: function (step, state) {
    if (step < 1) return '';
    return window.slider('Rval', '调节电阻<i class="m">R</i>', 1.5, 12, state.Rval || 3, 0.25, 'Ω');
  },
  renderScene: function (step, state) {
    var c = window.createCoordCanvas({
      width: 520,
      height: 400,
      xRange: [-2.2, 19.5],
      yRange: [-2.8, 19.5],
      showGrid: false,
      showTicks: false
    });
    var rTicks = [1, 2, 3, 4, 6, 9, 12, 18];
    for (var i = 0; i < rTicks.length; i++) {
      var r = rTicks[i];
      var wy = (36 / r) / 2;
      c.line(r, 0, r, wy, '#93c5fd', 1.1, '4,3');
      c.line(0, wy, r, wy, '#93c5fd', 1.1, '4,3');
    }
    var xLabelList = [2, 4, 6, 9, 12, 18];
    for (var j = 0; j < xLabelList.length; j++) {
      c.text(xLabelList[j], -1.0, String(xLabelList[j]), '#334155', 13, 'middle', 'normal');
    }
    var yLabelList = [4, 6, 9, 12, 18, 36];
    for (var k = 0; k < yLabelList.length; k++) {
      c.text(-0.55, yLabelList[k] / 2 - 0.15, String(yLabelList[k]), '#334155', 12.5, 'end', 'normal');
    }

    if (step >= 2) {
      var x2 = c.sx(2), x4 = c.sx(4), y9 = c.sy(4.5), y18 = c.sy(9), y0 = c.sy(0), x0 = c.sx(0);
      c.raw(
        '<rect x="' + x2 + '" y="' + y18 + '" width="' + (x4 - x2) + '" height="' + (y0 - y18) + '" fill="rgba(22,163,74,0.12)"/>' +
        '<rect x="' + x0 + '" y="' + y18 + '" width="' + (x4 - x0) + '" height="' + (y9 - y18) + '" fill="rgba(220,38,38,0.08)"/>'
      );
      c.line(2, 0, 4, 0, '#16a34a', 5);
      c.line(0, 4.5, 0, 9, '#dc2626', 5);
    }

    c.line(-0.8, 0, 18.8, 0, '#1e293b', 2);
    c.line(0, -0.8, 0, 18.8, '#1e293b', 2);
    c.raw(
      '<polygon points="' + c.sx(19.0) + ',' + c.sy(0) + ' ' + (c.sx(19.0) - 9) + ',' + (c.sy(0) - 4.5) + ' ' + (c.sx(19.0) - 9) + ',' + (c.sy(0) + 4.5) + '" fill="#1e293b"/>' +
      '<polygon points="' + c.sx(0) + ',' + c.sy(19.0) + ' ' + (c.sx(0) - 4.5) + ',' + (c.sy(19.0) + 9) + ' ' + (c.sx(0) + 4.5) + ',' + (c.sy(19.0) + 9) + '" fill="#1e293b"/>'
    );
    c.text(-0.55, -0.85, 'O', '#1e293b', 14, 'end');
    c.text(18.5, 1.1, 'R/Ω', '#1e293b', 15, 'middle', 'bold');
    c.text(0.55, 18.5, 'I/A', '#1e293b', 15, 'start', 'bold');

    c.curve(function (wx) { return 18 / wx; }, 0.98, 18.2, '#1e293b', 2.4);
    for (var m = 0; m < rTicks.length; m++) {
      c.point(rTicks[m], 18 / rTicks[m], '', '#334155', 0, 0, 3.2);
    }
    c.point(9, 2, 'A(9,4)', '#2563eb', 10, -10, 5.5);

    if (step >= 1) {
      c.line(2, 0, 2, 9, '#dc2626', 1.8, '5,4');
      c.line(0, 9, 2, 9, '#dc2626', 1.8, '5,4');
      c.line(4, 0, 4, 4.5, '#16a34a', 1.8, '5,4');
      c.line(0, 4.5, 4, 4.5, '#16a34a', 1.8, '5,4');
      c.point(2, 9, '(2,18)', '#dc2626', 10, -6, 5.5);
      c.point(4, 4.5, '(4,9)', '#16a34a', 10, -6, 5.5);
    }

    if (step >= 2) {
      c.curve(function (wx) { return 18 / wx; }, 2, 4, '#dc2626', 4.5);
      c.text(3.0, -2.15, '2Ω ≤ R ≤ 4Ω', '#15803d', 13.5, 'middle', 'bold');
    }

    if (step >= 1) {
      var rVal = Number(state.Rval || 3);
      var iCur = 36 / rVal;
      var wyCur = iCur / 2;
      var isSafe = (rVal >= 2 && rVal <= 4);
      var ptColor = isSafe ? '#16a34a' : '#d97706';
      c.line(rVal, 0, rVal, wyCur, ptColor, 1.5, '3,3');
      c.line(0, wyCur, rVal, wyCur, ptColor, 1.5, '3,3');
      c.point(rVal, wyCur, '', ptColor, 0, 0, 6.5);
      c.raw(
        '<rect x="' + c.sx(6.2) + '" y="' + c.sy(16.6) + '" width="235" height="32" rx="6" fill="' + (isSafe ? '#f0fdf4' : '#fffbeb') + '" stroke="' + (isSafe ? '#86efac' : '#fcd34d') + '" stroke-width="1.5"/>' +
        '<text x="' + (c.sx(6.2) + 117) + '" y="' + (c.sy(16.6) + 21) + '" text-anchor="middle" font-size="14" font-weight="700" fill="' + (isSafe ? '#15803d' : '#b45309') + '">' +
        window.svgAutoFormatText('R=' + rVal.toFixed(2) + 'Ω，I=' + iCur.toFixed(1) + 'A ' + (isSafe ? '(正常)' : '(超限)')) +
        '</text>'
      );
    }

    return c.done();
  }
});

// =========================================================================
// Slide 3A: 二、新知探究 —— 问题2(1)(2)：《天工开物》桔槔实验数据描点与函数建模（图1）
// =========================================================================
window.defineSlide({
  lesson: 1,
  phase: 1,
  navTag: '问题2(1)(2)·实验建模',
  section: '新知探究',
  title: '问题<span class="num">2</span>（<span class="num">1</span>）（<span class="num">2</span>）：《天工开物》桔槔实验描点与函数模型建立',
  layout: 'layout-b',
  stem:
    '<p><b>问题<span class="num">2</span>：</b>受《天工开物》桔槔汲水启发，兴趣小组发现<i class="m">L</i><sub><span class="num">2</span></sub>的长度<i class="m">y</i>（单位：<span class="num">cm</span>）和重物<i class="m">B</i>所受重力<i class="m">x</i>（单位：<span class="num">N</span>）之间近似存在函数关系，部分实验数据如下表：</p>' +
    '<table class="stem-data-table">' +
    '<tr><th><i class="m">x</i><span class="num">/N</span></th><td>…</td><td><span class="num">10</span></td><td><span class="num">16</span></td><td><span class="num">20</span></td><td><span class="num">25</span></td><td><span class="num">40</span></td><td><span class="num">50</span></td><td>…</td></tr>' +
    '<tr><th><i class="m">y</i><span class="num">/cm</span></th><td>…</td><td><span class="num">8</span></td><td><span class="num">5</span></td><td><span class="num">4</span></td><td><span class="num">3.2</span></td><td><span class="num">2</span></td><td><span class="num">1.6</span></td><td>…</td></tr>' +
    '</table>' +
    '<p>（<span class="num">1</span>）在图<span class="num">1</span>中描出表中数据对应的点<span class="num">(</span><i class="m">x</i><span class="num">,</span><i class="m">y</i><span class="num">)</span>；　（<span class="num">2</span>）从<span class="math"><i class="m">y</i><span class="num">=</span><i class="m">ax</i><span class="num">+</span><i class="m">b</i></span>和<span class="math"><i class="m">y</i><span class="num">=</span><span class="fraction"><span><i class="m">k</i></span><span><i class="m">x</i></span></span></span>中选择函数模型，求出函数表达式：<span class="screen-blank" data-step="2" data-ans="<span class=\'math\'><i class=\'m\'>y</i><span class=\'num\'>=</span><span class=\'fraction\'><span><span class=\'num\'>80</span></span><span><i class=\'m\'>x</i></span></span></span>（<i class=\'m\'>x</i><span class=\'num\'>&gt;0</span>）"></span>．</p>',
  steps: [
    [
      '在坐标系中描出实验数据点（第<span class="num">1</span>问）',
      '在图<span class="num">1</span>中依次描出点<span class="num">(10,8)</span>，<span class="num">(16,5)</span>，<span class="num">(20,4)</span>，<span class="num">(25,3.2)</span>，<span class="num">(40,2)</span>，<span class="num">(50,1.6)</span>，观察发现各点不在同一直线上，而呈平滑下降曲线分布．'
    ],
    [
      '检验乘积定值并建立反比例函数模型（第<span class="num">2</span>问）',
      '计算各组对应数据的乘积：<span class="num">10×8=16×5=20×4=25×3.2=40×2=50×1.6=80</span>（定值），故选反比例函数模型<span class="math"><i class="m">y</i><span class="num">=</span><span class="fraction"><span><i class="m">k</i></span><span><i class="m">x</i></span></span></span>，得<b style="color:#dc2626;"><span class="math"><i class="m">y</i><span class="num">=</span><span class="fraction"><span><span class="num">80</span></span><span><i class="m">x</i></span></span></span>（<span class="math"><i class="m">x</i><span class="num">&gt;0</span></span>）</b>．'
    ]
  ],
  renderScene: function (step) {
    var c = window.createCoordCanvas({
      width: 520,
      height: 400,
      xRange: [-0.55, 8.5],
      yRange: [-1.55, 9.1],
      equalAspect: false,
      padding: { left: 42, right: 16, top: 24, bottom: 38 },
      showGrid: false,
      showTicks: false
    });

    var gx, gy;
    for (gx = 0.5; gx <= 5.5; gx += 0.5) {
      c.line(gx, 0, gx, 8.5, '#cbd5e1', gx % 1 === 0 ? 1.1 : 0.7, '3,3');
    }
    for (gx = 1; gx <= 5; gx++) {
      c.text(gx, -0.52, String(gx * 10), '#334155', 14, 'middle', 'normal');
    }
    for (gy = 1; gy <= 8; gy++) {
      c.line(0, gy, 5.5, gy, '#cbd5e1', 1.1, '3,3');
      c.text(-0.18, gy, String(gy), '#334155', 14, 'end', 'normal');
    }

    c.line(-0.25, 0, 5.85, 0, '#1e293b', 2);
    c.line(0, -0.4, 0, 8.85, '#1e293b', 2);
    c.raw(
      '<polygon points="' + c.sx(5.92) + ',' + c.sy(0) + ' ' + (c.sx(5.92) - 9) + ',' + (c.sy(0) - 4.5) + ' ' + (c.sx(5.92) - 9) + ',' + (c.sy(0) + 4.5) + '" fill="#1e293b"/>' +
      '<polygon points="' + c.sx(0) + ',' + c.sy(8.92) + ' ' + (c.sx(0) - 4.5) + ',' + (c.sy(8.92) + 9) + ' ' + (c.sx(0) + 4.5) + ',' + (c.sy(8.92) + 9) + '" fill="#1e293b"/>'
    );
    c.text(-0.18, -0.48, 'O', '#1e293b', 14, 'end');
    c.text(5.82, 0.38, 'x/N', '#1e293b', 15, 'middle', 'bold');
    c.text(0.2, 8.75, 'y/cm', '#1e293b', 15, 'start', 'bold');
    c.text(2.75, -1.25, '图1', '#1e293b', 15, 'middle', 'bold');

    var bx = Math.round(c.sx(5.75)), by = Math.round(c.sy(8.5));
    c.raw(
      '<g>' +
      '<rect x="' + bx + '" y="' + by + '" width="164" height="86" rx="8" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>' +
      '<text x="' + (bx + 82) + '" y="' + (by + 18) + '" text-anchor="middle" font-size="12" font-weight="700" fill="#334155">' +
      window.svgAutoFormatText('桔槔杠杆实验：F₁L₁ = x·y') +
      '</text>' +
      '<line x1="' + (bx + 82) + '" y1="' + (by + 44) + '" x2="' + (bx + 82) + '" y2="' + (by + 76) + '" stroke="#475569" stroke-width="2.5"/>' +
      '<line x1="' + (bx + 64) + '" y1="' + (by + 76) + '" x2="' + (bx + 100) + '" y2="' + (by + 76) + '" stroke="#475569" stroke-width="3"/>' +
      '<line x1="' + (bx + 24) + '" y1="' + (by + 44) + '" x2="' + (bx + 140) + '" y2="' + (by + 44) + '" stroke="#1e293b" stroke-width="2.5"/>' +
      '<circle cx="' + (bx + 82) + '" cy="' + (by + 44) + '" r="3.5" fill="#dc2626"/>' +
      '<text x="' + (bx + 82) + '" y="' + (by + 37) + '" text-anchor="middle" font-size="11" font-family="Times New Roman" font-style="italic" fill="#1e293b">O</text>' +
      '<text x="' + (bx + 52) + '" y="' + (by + 38) + '" text-anchor="middle" font-size="11" fill="#2563eb">' + window.svgAutoFormatText('L₁') + '</text>' +
      '<text x="' + (bx + 114) + '" y="' + (by + 38) + '" text-anchor="middle" font-size="11" fill="#dc2626">' + window.svgAutoFormatText('L₂ = y') + '</text>' +
      '<line x1="' + (bx + 28) + '" y1="' + (by + 44) + '" x2="' + (bx + 28) + '" y2="' + (by + 60) + '" stroke="#334155" stroke-width="1.5"/>' +
      '<rect x="' + (bx + 19) + '" y="' + (by + 60) + '" width="18" height="13" fill="#93c5fd" stroke="#2563eb" stroke-width="1.2"/>' +
      '<text x="' + (bx + 28) + '" y="' + (by + 70) + '" text-anchor="middle" font-size="10" font-family="Times New Roman" font-style="italic" fill="#1e3a8a">A</text>' +
      '<line x1="' + (bx + 136) + '" y1="' + (by + 44) + '" x2="' + (bx + 136) + '" y2="' + (by + 60) + '" stroke="#334155" stroke-width="1.5"/>' +
      '<rect x="' + (bx + 127) + '" y="' + (by + 60) + '" width="18" height="13" fill="#fca5a5" stroke="#dc2626" stroke-width="1.2"/>' +
      '<text x="' + (bx + 136) + '" y="' + (by + 70) + '" text-anchor="middle" font-size="10" font-family="Times New Roman" font-style="italic" fill="#991b1b">B</text>' +
      '</g>'
    );

    if (step >= 2) {
      c.curve(function (wx) { return 8 / wx; }, 0.94, 5.5, '#2563eb', 3);
      c.text(2.85, 5.65, 'y = 80 / x (x > 0)', '#1d4ed8', 15, 'start', 'bold');
    }

    if (step >= 1) {
      var expPts = [
        [1.0, 8.0, '(10,8)', 8, -6],
        [1.6, 5.0, '(16,5)', 8, -6],
        [2.0, 4.0, '(20,4)', 8, -6],
        [2.5, 3.2, '(25,3.2)', 8, -6],
        [4.0, 2.0, '(40,2)', 8, -6],
        [5.0, 1.6, '(50,1.6)', 0, 16]
      ];
      for (var pIdx = 0; pIdx < expPts.length; pIdx++) {
        var pt = expPts[pIdx];
        c.point(pt[0], pt[1], pt[2], '#dc2626', pt[3], pt[4], 5);
      }
    }

    return c.done();
  }
});

// =========================================================================
// Slide 3B: 二、新知探究 —— 问题2(3)：反比例函数图象上 △ABC 面积存在性探究（图2）
// =========================================================================
window.defineSlide({
  lesson: 1,
  phase: 1,
  navTag: '问题2(3)·△ABC面积探究',
  section: '新知探究',
  title: '问题<span class="num">2</span>（<span class="num">3</span>）：反比例函数图象上满足<span class="math"><i class="m">S</i><sub><span class="num">△</span><i class="m">ABC</i></sub><span class="num">=40</span></span>的点<i class="m">C</i>坐标探究',
  layout: 'layout-b',
  state: { cMode: 'both' },
  stem:
    '<div style="background:#eff6ff;border-left:4px solid #2563eb;padding:4px 10px;margin-bottom:5px;border-radius:4px;font-size:14.5px;color:#1e40af;"><b>【前问已知】</b>桔槔实验中<i class="m">y</i>与<i class="m">x</i>的反比例函数表达式为<span class="math"><i class="m">y</i><span class="num">=</span><span class="fraction"><span><span class="num">80</span></span><span><i class="m">x</i></span></span></span>（<span class="math"><i class="m">x</i><span class="num">&gt;0</span></span>）．</div>' +
    '<p>（<span class="num">3</span>）如图<span class="num">2</span>，若点<i class="m">A</i><span class="num">(20,0)</span>，<i class="m">B</i><span class="num">(0,2)</span>，在函数<span class="math"><i class="m">y</i><span class="num">=</span><span class="fraction"><span><span class="num">80</span></span><span><i class="m">x</i></span></span></span>（<span class="math"><i class="m">x</i><span class="num">&gt;0</span></span>）的图象上存在点<i class="m">C</i>，使得<span class="math"><i class="m">S</i><sub><span class="num">△</span><i class="m">ABC</i></sub><span class="num">=40</span></span>，则点<i class="m">C</i>的坐标为<span class="screen-blank" data-step="3" data-ans="<span class=\'num\'>(20,4)</span>或<span class=\'num\'>(40,2)</span>"></span>．</p>',
  steps: [
    [
      '设点<i class="m">C</i>坐标并观察特殊垂线位置',
      '设点<span class="math"><i class="m">C</i><span class="num">(</span><i class="m">m</i><span class="num">,</span><span class="fraction"><span><span class="num">80</span></span><span><i class="m">m</i></span></span><span class="num">)</span></span>（<span class="math"><i class="m">m</i><span class="num">&gt;0</span></span>）．已知<span class="math"><i class="m">A</i><span class="num">(20,0)</span></span>在<i class="m">x</i>轴上，<span class="math"><i class="m">B</i><span class="num">(0,2)</span></span>在<i class="m">y</i>轴上，可先考察过<i class="m">A</i>、<i class="m">B</i>作坐标轴垂线与双曲线的交点．'
    ],
    [
      '情形①：过点<i class="m">A</i><span class="num">(20,0)</span>作<i class="m">x</i>轴垂线得<i class="m">C</i><sub><span class="num">1</span></sub><span class="num">(20,4)</span>',
      '当<span class="math"><i class="m">m</i><span class="num">=20</span></span>时，<span class="math"><i class="m">y</i><span class="num">=4</span></span>，即<span class="math"><i class="m">C</i><sub><span class="num">1</span></sub><span class="num">(20,4)</span></span>．此时<span class="math"><i class="m">C</i><sub><span class="num">1</span></sub><i class="m">A</i><span class="num">⊥</span><i class="m">x</i></span>轴，以<span class="math"><i class="m">C</i><sub><span class="num">1</span></sub><i class="m">A</i><span class="num">=4</span></span>为底、点<i class="m">B</i>到直线<span class="math"><i class="m">x</i><span class="num">=20</span></span>的距离<span class="num">20</span>为高，面积<span class="math"><i class="m">S</i><sub><span class="num">△</span><i class="m">ABC</i><sub><span class="num">1</span></sub></sub><span class="num">=</span><span class="fraction"><span><span class="num">1</span></span><span><span class="num">2</span></span></span><span class="num">×4×20=40</span></span>，符合题意！'
    ],
    [
      '情形②：过点<i class="m">B</i><span class="num">(0,2)</span>作<i class="m">y</i>轴垂线得<i class="m">C</i><sub><span class="num">2</span></sub><span class="num">(40,2)</span>',
      '当<span class="math"><i class="m">y</i><span class="num">=2</span></span>时，<span class="math"><i class="m">m</i><span class="num">=40</span></span>，即<span class="math"><i class="m">C</i><sub><span class="num">2</span></sub><span class="num">(40,2)</span></span>（或由割补方程<span class="math"><span class="fraction"><span><span class="num">1</span></span><span><span class="num">2</span></span></span><span class="num">(</span><i class="m">m</i><span class="num">+</span><span class="fraction"><span><span class="num">800</span></span><span><i class="m">m</i></span></span><span class="num">-20)=40</span></span>解得<span class="math"><i class="m">m</i><span class="num">=20</span></span>或<span class="num">40</span>）．此时<span class="math"><i class="m">C</i><sub><span class="num">2</span></sub><i class="m">B</i><span class="num">=40</span></span>、高为<span class="num">2</span>，面积亦为<span class="num">40</span>．故点<i class="m">C</i>坐标为<b style="color:#dc2626;"><span class="num">(20,4)</span>或<span class="num">(40,2)</span></b>．'
    ]
  ],
  controls: function (step, state) {
    if (step < 2) return '';
    return window.modeButtons('cMode', state.cMode || 'both', [
      ['c1', '情形① C₁(20,4)', 2],
      ['c2', '情形② C₂(40,2)', 3],
      ['both', '双解同屏对比', 3]
    ]);
  },
  renderScene: function (step, state) {
    var c = window.createCoordCanvas({
      width: 520,
      height: 400,
      xRange: [-0.65, 6.6],
      yRange: [-1.55, 9.1],
      equalAspect: false,
      padding: { left: 42, right: 24, top: 24, bottom: 38 },
      showGrid: false,
      showTicks: false
    });

    var gx, gy;
    for (gx = 1; gx <= 5; gx++) {
      c.line(gx, 0, gx, 8.5, '#f1f5f9', 1);
      c.text(gx, -0.52, String(gx * 10), '#334155', 14, 'middle', 'normal');
    }
    for (gy = 1; gy <= 8; gy++) {
      c.line(0, gy, 5.6, gy, '#f1f5f9', 1);
      c.text(-0.2, gy, String(gy), '#334155', 14, 'end', 'normal');
    }

    c.line(-0.3, 0, 5.85, 0, '#1e293b', 2);
    c.line(0, -0.4, 0, 8.85, '#1e293b', 2);
    c.raw(
      '<polygon points="' + c.sx(5.92) + ',' + c.sy(0) + ' ' + (c.sx(5.92) - 9) + ',' + (c.sy(0) - 4.5) + ' ' + (c.sx(5.92) - 9) + ',' + (c.sy(0) + 4.5) + '" fill="#1e293b"/>' +
      '<polygon points="' + c.sx(0) + ',' + c.sy(8.92) + ' ' + (c.sx(0) - 4.5) + ',' + (c.sy(8.92) + 9) + ' ' + (c.sx(0) + 4.5) + ',' + (c.sy(8.92) + 9) + '" fill="#1e293b"/>'
    );
    c.text(-0.2, -0.48, 'O', '#1e293b', 14, 'end');
    c.text(5.82, 0.38, 'x/N', '#1e293b', 15, 'middle', 'bold');
    c.text(0.22, 8.75, 'y/cm', '#1e293b', 15, 'start', 'bold');
    c.text(2.75, -1.25, '图2', '#1e293b', 15, 'middle', 'bold');

    // 基础图形：双曲线 y = 80/x 与线段 AB
    c.curve(function (wx) { return 8 / wx; }, 0.94, 5.5, '#2563eb', 2.8);
    c.text(1.35, 7.2, 'y = 80 / x', '#1d4ed8', 15, 'start', 'bold');
    c.line(2, 0, 0, 2, '#1e293b', 2.6);
    c.point(2, 0, 'A(20,0)', '#1e293b', -52, -8, 5);
    c.point(0, 2, 'B(0,2)', '#1e293b', 10, -8, 5);

    var mode = state.cMode || 'both';
    if (step === 2) mode = 'c1';

    if (step >= 2 && (mode === 'c1' || mode === 'both')) {
      c.polygon([[2, 0], [0, 2], [2, 4]], 'rgba(22,163,74,0.18)', '#16a34a', 2.4);
      c.line(2, 0, 2, 4, '#16a34a', 2.6, '5,3');
      c.point(2, 4, 'C₁(20,4)', '#15803d', 10, -8, 6);
      c.text(2.22, 3.15, '底C₁A=4, 高=20 ⇒ S=40', '#15803d', 13.5, 'start', 'bold');
    }

    if (step >= 3 && (mode === 'c2' || mode === 'both')) {
      c.polygon([[2, 0], [0, 2], [4, 2]], 'rgba(217,119,6,0.18)', '#d97706', 2.4);
      c.line(0, 2, 4, 2, '#d97706', 2.6, '5,3');
      c.point(4, 2, 'C₂(40,2)', '#b45309', 10, -8, 6);
      c.text(3.45, 0.95, '底C₂B=40, 高=2 ⇒ S=40', '#b45309', 13.5, 'middle', 'bold');
    }

    return c.done();
  }
});

// =========================================================================
// Slide 4: 二、新知探究 思维生长 —— 追问1：生活中的反比例函数建模归纳
// =========================================================================
window.defineSlide({
  lesson: 1,
  phase: 1,
  navTag: '追问1·生活模型归纳',
  section: '新知探究',
  title: '追问<span class="num">1</span>：生活中常见的反比例函数现实情境与建模通法',
  layout: 'layout-b',
  stem:
    '<div style="background:#ecfeff;border-left:4px solid #0891b2;padding:5px 12px;margin-bottom:6px;border-radius:4px;font-size:15px;color:#0e7490;"><b>【关联前问总结】</b>无论压强<span class="math"><i class="m">p</i><span class="num">=</span><span class="fraction"><span><i class="m">F</i></span><span><i class="m">S</i></span></span></span>、欧姆定律<span class="math"><i class="m">I</i><span class="num">=</span><span class="fraction"><span><i class="m">U</i></span><span><i class="m">R</i></span></span></span>还是杠杆平衡<span class="math"><i class="m">F</i><sub><span class="num">1</span></sub><i class="m">L</i><sub><span class="num">1</span></sub><span class="num">=</span><i class="m">F</i><sub><span class="num">2</span></sub><i class="m">L</i><sub><span class="num">2</span></sub></span>，本质都是“<b>两个变量的乘积为非零定值<i class="m">k</i></b>”．</div>' +
    '<p><b>追问<span class="num">1</span>：</b>在生活中，还有哪些可以应用反比例函数的现实情境？小组合作讨论并归纳常见跨学科模型．</p>',
  steps: [
    [
      '行程与工程总量定值模型',
      '路程<i class="m">s</i>一定时，平均速度<span class="math"><i class="m">v</i><span class="num">=</span><span class="fraction"><span><i class="m">s</i></span><span><i class="m">t</i></span></span></span>；工作总量<i class="m">W</i>一定时，工作效率<span class="math"><i class="m">η</i><span class="num">=</span><span class="fraction"><span><i class="m">W</i></span><span><i class="m">t</i></span></span></span>．'
    ],
    [
      '几何面积与体积定值模型',
      '矩形面积<i class="m">S</i>一定时，长<span class="math"><i class="m">y</i><span class="num">=</span><span class="fraction"><span><i class="m">S</i></span><span><i class="m">x</i></span></span></span>；圆柱体积<i class="m">V</i>一定时，底面积<span class="math"><i class="m">S</i><span class="num">=</span><span class="fraction"><span><i class="m">V</i></span><span><i class="m">h</i></span></span></span>．'
    ],
    [
      '物理跨学科定值模型',
      '压力<i class="m">F</i>一定时压强<span class="math"><i class="m">p</i><span class="num">=</span><span class="fraction"><span><i class="m">F</i></span><span><i class="m">S</i></span></span></span>；电压<i class="m">U</i>一定时电流<span class="math"><i class="m">I</i><span class="num">=</span><span class="fraction"><span><i class="m">U</i></span><span><i class="m">R</i></span></span></span>；阻力矩一定时动力<span class="math"><i class="m">F</i><span class="num">=</span><span class="fraction"><span><i class="m">F</i><sub>阻</sub><i class="m">l</i><sub><span class="num">2</span></sub></span><span><i class="m">l</i><sub><span class="num">1</span></sub></span></span></span>；机械功率<i class="m">P</i>一定时牵引力<span class="math"><i class="m">F</i><span class="num">=</span><span class="fraction"><span><i class="m">P</i></span><span><i class="m">v</i></span></span></span>．'
    ]
  ],
  renderScene: function (step) {
    var c = window.createCoordCanvas({
      width: 520,
      height: 400,
      xRange: [0, 520],
      yRange: [0, 400],
      showGrid: false,
      showAxes: false
    });

    // 卡片辅助绘制函数
    function renderCard(x, y, w, h, title, line1, line2, active, themeColor, bgLight) {
      var stroke = active ? themeColor : '#cbd5e1';
      var fill = active ? bgLight : '#f8fafc';
      var titleFill = active ? themeColor : '#64748b';
      var bodyFill = active ? '#1e293b' : '#94a3b8';
      return (
        '<g>' +
        '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="12" fill="' + fill + '" stroke="' + stroke + '" stroke-width="' + (active ? 2.2 : 1.5) + '"/>' +
        '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="34" rx="12" fill="' + (active ? themeColor : '#e2e8f0') + '" opacity="' + (active ? '0.14' : '0.6') + '"/>' +
        '<text x="' + (x + w / 2) + '" y="' + (y + 23) + '" text-anchor="middle" font-size="15" font-weight="700" fill="' + titleFill + '">' +
        window.svgAutoFormatText(title) +
        '</text>' +
        '<text x="' + (x + w / 2) + '" y="' + (y + 62) + '" text-anchor="middle" font-size="14" font-weight="600" fill="' + bodyFill + '">' +
        window.svgAutoFormatText(line1) +
        '</text>' +
        '<text x="' + (x + w / 2) + '" y="' + (y + 92) + '" text-anchor="middle" font-size="13.5" fill="' + bodyFill + '">' +
        window.svgAutoFormatText(line2) +
        '</text>' +
        '</g>'
      );
    }

    var svgParts = '';

    // 连接线（中心到四个角）
    svgParts +=
      '<line x1="260" y1="200" x2="135" y2="85" stroke="#94a3b8" stroke-width="2" stroke-dasharray="5,4"/>' +
      '<line x1="260" y1="200" x2="385" y2="85" stroke="#94a3b8" stroke-width="2" stroke-dasharray="5,4"/>' +
      '<line x1="260" y1="200" x2="135" y2="315" stroke="#94a3b8" stroke-width="2" stroke-dasharray="5,4"/>' +
      '<line x1="260" y1="200" x2="385" y2="315" stroke="#94a3b8" stroke-width="2" stroke-dasharray="5,4"/>';

    // 卡片1（左上）：课堂已学三模型（Step >= 0 常亮）
    svgParts += renderCard(
      14, 22, 232, 118,
      '① 课堂前问三大实例',
      '湿地压强 p = F / S',
      '蓄电池 I=U/R · 桔槔 L₂=k/x',
      true, '#0891b2', '#ecfeff'
    );

    // 卡片2（右上）：行程与工程定值（Step >= 1 解锁）
    svgParts += renderCard(
      274, 22, 232, 118,
      '② 行程与工程总量模型',
      step >= 1 ? '路程一定：v = s / t' : '【待展开：路程与工效关系】',
      step >= 1 ? '工作总量一定：η = W / t' : '点击下一步揭晓',
      step >= 1, '#2563eb', '#eff6ff'
    );

    // 卡片3（左下）：几何面积与体积（Step >= 2 解锁）
    svgParts += renderCard(
      14, 260, 232, 118,
      '③ 几何面积与体积模型',
      step >= 2 ? '矩形面积一定：y = S / x' : '【待展开：几何图形度量】',
      step >= 2 ? '圆柱体积一定：S = V / h' : '点击下一步揭晓',
      step >= 2, '#16a34a', '#f0fdf4'
    );

    // 卡片4（右下）：物理与生活综合（Step >= 3 解锁）
    svgParts += renderCard(
      274, 260, 232, 118,
      '④ 物理跨学科与生活模型',
      step >= 3 ? '功率一定：牵引力 F = P / v' : '【待展开：物理与日用单价】',
      step >= 3 ? '总价一定：单价 y = 总价 / 数量' : '点击下一步揭晓',
      step >= 3, '#d97706', '#fffbeb'
    );

    // 中心核心不变量徽章
    svgParts +=
      '<g>' +
      '<rect x="148" y="156" width="224" height="88" rx="44" fill="#1e293b" stroke="#38bdf8" stroke-width="3"/>' +
      '<text x="260" y="192" text-anchor="middle" font-size="15.5" font-weight="700" fill="#38bdf8">' +
      window.svgAutoFormatText('反比例建模核心本质') +
      '</text>' +
      '<text x="260" y="220" text-anchor="middle" font-size="14" font-weight="700" fill="#ffffff">' +
      window.svgAutoFormatText('x · y = k (定值, x > 0)') +
      '</text>' +
      '</g>';

    c.raw(svgParts);
    return c.done();
  }
});

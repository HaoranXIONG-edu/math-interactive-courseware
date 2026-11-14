// =============================================================================
// Chunk 2: Phase 2 新知应用（第 1～5 题，共 5 页幻灯片）
// =============================================================================

window.UNIT1_THEOREM_SLIDES = window.UNIT1_THEOREM_SLIDES || [];
window.UNIT1_SIMS = window.UNIT1_SIMS || {};

(function () {
  // ---------------------------------------------------------------------------
  // SVG 辅助绘制函数
  // ---------------------------------------------------------------------------
  function svgTextHalo(x, y, text, opts) {
    opts = opts || {};
    var size = opts.size || 15;
    var fill = opts.fill || '#0f172a';
    var weight = opts.weight || '700';
    var anchor = opts.anchor || 'middle';
    var family = "'Times New Roman', 'Songti SC', SimSun, serif";
    var halo = opts.halo || '#ffffff';
    var haloWidth = opts.haloWidth || 3.5;
    var inner = typeof window.svgAutoFormatText === 'function' ? window.svgAutoFormatText(text, size) : text;
    return (
      '<text data-math-formatted="1" x="' + x + '" y="' + y + '" font-size="' + size + '" font-weight="' + weight + '" ' +
      'font-family="' + family + '" fill="' + fill + '" text-anchor="' + anchor + '" ' +
      'stroke="' + halo + '" stroke-width="' + haloWidth + '" paint-order="stroke" stroke-linejoin="round">' +
      inner +
      '</text>'
    );
  }

  // 绘制 SVG 二维叠置分式标签: prefix + (sign) + num / den
  function svgStackedFraction(cx, cy, prefixText, signText, numText, denText, opts) {
    opts = opts || {};
    var color = opts.color || '#1e40af';
    var barHalf = opts.barHalf || 10;
    var prefixOffset = signText ? -28 : -20;
    var signOffset = -14;
    var fmt = function (s, sz) {
      return typeof window.svgAutoFormatText === 'function' ? window.svgAutoFormatText(s, sz) : s;
    };
    var out = '<g>';
    if (prefixText) {
      out +=
        '<text data-math-formatted="1" x="' + (cx + prefixOffset) + '" y="' + (cy + 5) + '" font-size="15" font-weight="700" ' +
        'font-family="\'Times New Roman\', serif" fill="' + color + '" text-anchor="end" ' +
        'stroke="#ffffff" stroke-width="3.5" paint-order="stroke"><tspan font-style="italic">y</tspan><tspan font-style="normal"> = </tspan></text>';
    }
    if (signText) {
      out +=
        '<text data-math-formatted="1" x="' + (cx + signOffset) + '" y="' + (cy + 5) + '" font-size="16" font-weight="700" ' +
        'font-family="\'Times New Roman\', serif" font-style="normal" fill="' + color + '" text-anchor="middle" ' +
        'stroke="#ffffff" stroke-width="3.5" paint-order="stroke">' + signText + '</text>';
    }
    // 分子
    out +=
      '<text data-math-formatted="1" x="' + cx + '" y="' + (cy - 5) + '" font-size="14" font-weight="700" ' +
      'font-family="\'Times New Roman\', serif" fill="' + color + '" text-anchor="middle" ' +
      'stroke="#ffffff" stroke-width="3.5" paint-order="stroke">' + fmt(numText, 14) + '</text>';
    // 分数线
    out +=
      '<line x1="' + (cx - barHalf) + '" y1="' + cy + '" x2="' + (cx + barHalf) + '" y2="' + cy + '" ' +
      'stroke="#ffffff" stroke-width="4" stroke-linecap="round"/>' +
      '<line x1="' + (cx - barHalf) + '" y1="' + cy + '" x2="' + (cx + barHalf) + '" y2="' + cy + '" ' +
      'stroke="' + color + '" stroke-width="1.8" stroke-linecap="round"/>';
    // 分母
    out +=
      '<text data-math-formatted="1" x="' + cx + '" y="' + (cy + 14) + '" font-size="14" font-weight="700" ' +
      'font-family="\'Times New Roman\', serif" fill="' + color + '" text-anchor="middle" ' +
      'stroke="#ffffff" stroke-width="3.5" paint-order="stroke">' + fmt(denText, 14) + '</text>';
    out += '</g>';
    return out;
  }

  function svgPoint(x, y, color, r) {
    r = r || 4.5;
    color = color || '#1e40af';
    return (
      '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + r + '" ' +
      'fill="' + color + '" stroke="#ffffff" stroke-width="1.8"/>'
    );
  }

  function svgRightAngle(vx, vy, dx1, dy1, dx2, dy2, size, color) {
    size = size || 8;
    color = color || '#64748b';
    var p1x = vx + dx1 * size;
    var p1y = vy + dy1 * size;
    var p2x = vx + dx1 * size + dx2 * size;
    var p2y = vy + dy1 * size + dy2 * size;
    var p3x = vx + dx2 * size;
    var p3y = vy + dy2 * size;
    return (
      '<polyline points="' +
      p1x.toFixed(1) + ',' + p1y.toFixed(1) + ' ' +
      p2x.toFixed(1) + ',' + p2y.toFixed(1) + ' ' +
      p3x.toFixed(1) + ',' + p3y.toFixed(1) +
      '" fill="none" stroke="' + color + '" stroke-width="1.5"/>'
    );
  }

  function sampleHyperbola(k, xMin, xMax, steps, toX, toY, yClipMin, yClipMax) {
    var pts = [];
    for (var i = 0; i <= steps; i++) {
      var x = xMin + ((xMax - xMin) * i) / steps;
      if (Math.abs(x) < 1e-4) continue;
      var y = k / x;
      if (yClipMin !== undefined && y < yClipMin) continue;
      if (yClipMax !== undefined && y > yClipMax) continue;
      pts.push(toX(x).toFixed(1) + ',' + toY(y).toFixed(1));
    }
    return pts.join(' ');
  }

  // ===========================================================================
  // 幻灯片数据定义（5页）
  // ===========================================================================
  var slides = [
    // -------------------------------------------------------------------------
    // Slide 1: 新知应用 · 第1题
    // -------------------------------------------------------------------------
    {
      phase: 2,
      section: '新知应用',
      navTag: '题1·多点矩形面积',
      title: '第<span class="num">1</span>题：利用横坐标与<i class="m">k</i>的几何意义求矩形面积',
      layout: 'layout-b',
      sim: 'apply1Sim',
      maxStep: 3,
      stem:
        '<p><span class="num">1．</span>如图，在反比例函数<span class="math"><i class="m">y</i><span class="num">=</span><span class="fraction"><span><i class="m">k</i></span><span><i class="m">x</i></span></span></span>（<i class="m">x</i><span class="num">&gt;0</span>）的图象上有点<i class="m">P</i><sub><span class="num">1</span></sub>，<i class="m">P</i><sub><span class="num">2</span></sub>，<i class="m">P</i><sub><span class="num">3</span></sub>，它们的横坐标依次为<span class="num">1</span>，<span class="num">3</span>，<span class="num">6</span>，分别过这些点作<i class="m">x</i>轴与<i class="m">y</i>轴的垂线段．图中阴影部分的面积分别记为<i class="m">S</i><sub><span class="num">1</span></sub>，<i class="m">S</i><sub><span class="num">2</span></sub>，若<i class="m">S</i><sub><span class="num">2</span></sub><span class="num">=3</span>，则<i class="m">S</i><sub><span class="num">1</span></sub>的值为<span class="screen-blank" data-ans="<span class=\'num\'>4</span>"></span>．</p>',
      notes:
        '<div class="step step-locked"><b>01</b><span><b>步骤<span class="num">1</span>（表点坐标）：</b>由点<i class="m">P</i><sub><span class="num">1</span></sub>，<i class="m">P</i><sub><span class="num">2</span></sub>，<i class="m">P</i><sub><span class="num">3</span></sub>的横坐标依次为<span class="num">1</span>，<span class="num">3</span>，<span class="num">6</span>，代入<span class="math"><i class="m">y</i><span class="num">=</span><span class="fraction"><span><i class="m">k</i></span><span><i class="m">x</i></span></span></span>得纵坐标依次为<i class="m">y</i><sub><span class="num">1</span></sub><span class="num">=</span><i class="m">k</i>，<span class="math"><i class="m">y</i><sub><span class="num">2</span></sub><span class="num">=</span><span class="fraction"><span><i class="m">k</i></span><span><span class="num">3</span></span></span></span>，<span class="math"><i class="m">y</i><sub><span class="num">3</span></sub><span class="num">=</span><span class="fraction"><span><i class="m">k</i></span><span><span class="num">6</span></span></span></span>．</span></div>' +
        '<div class="step step-locked"><b>02</b><span><b>步骤<span class="num">2</span>（由<i class="m">S</i><sub><span class="num">2</span></sub>求<i class="m">k</i>）：</b>阴影矩形<i class="m">S</i><sub><span class="num">2</span></sub>的长为<span class="num">6-3=3</span>，宽为<span class="math"><i class="m">y</i><sub><span class="num">3</span></sub><span class="num">=</span><span class="fraction"><span><i class="m">k</i></span><span><span class="num">6</span></span></span></span>，故<span class="math"><i class="m">S</i><sub><span class="num">2</span></sub><span class="num">=3×</span><span class="fraction"><span><i class="m">k</i></span><span><span class="num">6</span></span></span><span class="num">=</span><span class="fraction"><span><i class="m">k</i></span><span><span class="num">2</span></span></span><span class="num">=3</span></span>，解得<i class="m">k</i><span class="num">=6</span>（或由点<i class="m">P</i><sub><span class="num">3</span></sub>完整矩形面积为<i class="m">k</i>，而<i class="m">S</i><sub><span class="num">2</span></sub>恰好占一半，得<span class="math"><span class="fraction"><span><span class="num">1</span></span><span><span class="num">2</span></span></span><i class="m">k</i><span class="num">=3</span></span>，即<i class="m">k</i><span class="num">=6</span>）．</span></div>' +
        '<div class="step step-locked"><b>03</b><span><b>步骤<span class="num">3</span>（计算<i class="m">S</i><sub><span class="num">1</span></sub>）：</b>当<i class="m">k</i><span class="num">=6</span>时，<i class="m">y</i><sub><span class="num">1</span></sub><span class="num">=6</span>，<span class="math"><i class="m">y</i><sub><span class="num">2</span></sub><span class="num">=</span><span class="fraction"><span><span class="num">6</span></span><span><span class="num">3</span></span></span><span class="num">=2</span></span>．阴影矩形<i class="m">S</i><sub><span class="num">1</span></sub>的宽为<span class="num">1</span>，高为<i class="m">y</i><sub><span class="num">1</span></sub><span class="num">-</span><i class="m">y</i><sub><span class="num">2</span></sub><span class="num">=6-2=4</span>，故<i class="m">S</i><sub><span class="num">1</span></sub><span class="num">=1×4=4</span>．</span></div>',
      media: '<div class="sim-Host"></div>'
    },

    // -------------------------------------------------------------------------
    // Slide 2: 新知应用 · 第2题
    // -------------------------------------------------------------------------
    {
      phase: 2,
      section: '新知应用',
      navTag: '题2·中心对称求解析式',
      title: '第<span class="num">2</span>题：中心对称三角形面积反求解析式',
      layout: 'layout-b',
      sim: 'apply2Sim',
      maxStep: 3,
      stem:
        '<p><span class="num">2．</span>如图，反比例函数和正比例函数的图象相交于点<i class="m">A</i>和点<i class="m">B</i>，<i class="m">AC</i><span class="num">⊥</span><i class="m">x</i>轴，垂足为点<i class="m">C</i>，连接<i class="m">BC</i>，如果<span class="num">△</span><i class="m">ABC</i>的面积为<span class="num">1.5</span>，那么反比例函数的解析式为<span class="screen-blank" data-ans="<span class=\'math\'><i class=\'m\'>y</i><span class=\'num\'>=</span><span class=\'fraction\'><span><span class=\'num\'>3</span></span><span><span class=\'num\'>2</span><i class=\'m\'>x</i></span></span></span>"></span>．</p>',
      notes:
        '<div class="step step-locked"><b>01</b><span><b>步骤<span class="num">1</span>（对称得中线）：</b>正比例函数与反比例函数图象均关于原点<i class="m">O</i>中心对称，故交点<i class="m">A</i>，<i class="m">B</i>关于原点对称，<i class="m">OA</i><span class="num">=</span><i class="m">OB</i>，即<i class="m">OC</i>是<span class="num">△</span><i class="m">ABC</i>的中线．</span></div>' +
        '<div class="step step-locked"><b>02</b><span><b>步骤<span class="num">2</span>（求<span class="num">|</span><i class="m">k</i><span class="num">|</span>的值）：</b>由等底同高（或中心对称三角形模型）知<i class="m">S</i><sub><span class="num">△</span><i class="m">ABC</i></sub><span class="num">=2</span><i class="m">S</i><sub><span class="num">△</span><i class="m">AOC</i></sub><span class="num">=|</span><i class="m">k</i><span class="num">|</span>．已知<span class="math"><i class="m">S</i><sub><span class="num">△</span><i class="m">ABC</i></sub><span class="num">=1.5=</span><span class="fraction"><span><span class="num">3</span></span><span><span class="num">2</span></span></span></span>，故<span class="math"><span class="num">|</span><i class="m">k</i><span class="num">|=</span><span class="fraction"><span><span class="num">3</span></span><span><span class="num">2</span></span></span></span>．</span></div>' +
        '<div class="step step-locked"><b>03</b><span><b>步骤<span class="num">3</span>（定号写式）：</b>观察图象可知双曲线位于第一、三象限，故<i class="m">k</i><span class="num">&gt;0</span>，即<span class="math"><i class="m">k</i><span class="num">=</span><span class="fraction"><span><span class="num">3</span></span><span><span class="num">2</span></span></span></span>，反比例函数解析式为<span class="math"><i class="m">y</i><span class="num">=</span><span class="fraction"><span><span class="num">3</span></span><span><span class="num">2</span><i class="m">x</i></span></span></span>（或<span class="math"><i class="m">y</i><span class="num">=</span><span class="fraction"><span><span class="num">1.5</span></span><span><i class="m">x</i></span></span></span>）．</span></div>',
      media: '<div class="sim-Host"></div>'
    },

    // -------------------------------------------------------------------------
    // Slide 3: 新知应用 · 第3题（对应问题3：单曲线同支两点蝴蝶等积与转直角梯形）
    // -------------------------------------------------------------------------
    {
      phase: 2,
      section: '新知应用',
      navTag: '题3·同支双点转化',
      title: '第<span class="num">3</span>题：单曲线同支两点“蝴蝶等积”与转直角梯形',
      layout: 'layout-b',
      sim: 'apply3Sim',
      maxStep: 3,
      stem:
        '<p><span class="num">3．</span>如图，点<i class="m">A</i>，<i class="m">C</i>在反比例函数<span class="math"><i class="m">y</i><span class="num">=</span><span class="fraction"><span><span class="num">6</span></span><span><i class="m">x</i></span></span></span>（<i class="m">x</i><span class="num">&gt;0</span>）的图象上，过点<i class="m">A</i>，<i class="m">C</i>分别作<i class="m">AB</i><span class="num">⊥</span><i class="m">x</i>轴于点<i class="m">B</i>，<i class="m">CD</i><span class="num">⊥</span><i class="m">x</i>轴于点<i class="m">D</i>，连接<i class="m">OA</i>，<i class="m">OC</i>，<i class="m">OC</i>交<i class="m">AB</i>于点<i class="m">E</i>．（<span class="num">1</span>）若<i class="m">S</i><sub><span class="num">△</span><i class="m">BOE</i></sub><span class="num">=1</span>，则<i class="m">S</i><sub>四边形<i class="m">BECD</i></sub><span class="num">=</span><span class="screen-blank" data-step="2" data-ans="<span class=\'num\'>2</span>"></span>；（<span class="num">2</span>）若点<i class="m">A</i><span class="num">(1,6)</span>，<i class="m">C</i><span class="num">(3,2)</span>，连接<i class="m">AC</i>，则<i class="m">S</i><sub><span class="num">△</span><i class="m">AOC</i></sub><span class="num">=</span><span class="screen-blank" data-step="3" data-ans="<span class=\'num\'>8</span>"></span>．</p>',
      notes:
        '<div class="step step-locked"><b>01</b><span><b>步骤<span class="num">1</span>（双点基准面积）：</b>因为点<i class="m">A</i>，<i class="m">C</i>均在反比例函数<span class="math"><i class="m">y</i><span class="num">=</span><span class="fraction"><span><span class="num">6</span></span><span><i class="m">x</i></span></span></span>（<i class="m">x</i><span class="num">&gt;0</span>）的图象上，由<i class="m">k</i>的几何意义得<span class="math"><i class="m">S</i><sub><span class="num">△</span><i class="m">AOB</i></sub><span class="num">=</span><i class="m">S</i><sub><span class="num">△</span><i class="m">COD</i></sub><span class="num">=</span><span class="fraction"><span><span class="num">1</span></span><span><span class="num">2</span></span></span><span class="num">×6=3</span></span>．</span></div>' +
        '<div class="step step-locked"><b>02</b><span><b>步骤<span class="num">2</span>（蝴蝶等积求（<span class="num">1</span>））：</b>同减公共部分<span class="num">△</span><i class="m">BOE</i>，由“蝴蝶等积”模型知<i class="m">S</i><sub>四边形<i class="m">BECD</i></sub><span class="num">=</span><i class="m">S</i><sub><span class="num">△</span><i class="m">AOE</i></sub><span class="num">=</span><i class="m">S</i><sub><span class="num">△</span><i class="m">AOB</i></sub><span class="num">-</span><i class="m">S</i><sub><span class="num">△</span><i class="m">BOE</i></sub><span class="num">=3-1=2</span>．</span></div>' +
        '<div class="step step-locked"><b>03</b><span><b>步骤<span class="num">3</span>（转直角梯形求（<span class="num">2</span>））：</b>连接<i class="m">AC</i>，两边同加<span class="num">△</span><i class="m">ACE</i>得<i class="m">S</i><sub><span class="num">△</span><i class="m">AOC</i></sub><span class="num">=</span><i class="m">S</i><sub>直角梯形<i class="m">ABDC</i></sub><span class="num">=</span><span class="math"><span class="fraction"><span><span class="num">1</span></span><span><span class="num">2</span></span></span></span><span class="num">(</span><i class="m">AB</i><span class="num">+</span><i class="m">CD</i><span class="num">)·</span><i class="m">BD</i><span class="num">=</span><span class="math"><span class="fraction"><span><span class="num">1</span></span><span><span class="num">2</span></span></span></span><span class="num">×(6+2)×(3-1)=8</span>．</span></div>',
      media: '<div class="sim-Host"></div>'
    },

    // -------------------------------------------------------------------------
    // Slide 4: 新知应用 · 第4题
    // -------------------------------------------------------------------------
    {
      phase: 2,
      section: '新知应用',
      navTag: '题4·同号双曲线求k',
      title: '第<span class="num">4</span>题：同象限双反比例函数面积差与符号易错点',
      layout: 'layout-b',
      sim: 'apply4Sim',
      maxStep: 3,
      stem:
        '<p><span class="num">4．</span>如图，点<i class="m">A</i>在反比例函数<span class="math"><i class="m">y</i><span class="num">=-</span><span class="fraction"><span><span class="num">6</span></span><span><i class="m">x</i></span></span></span>（<i class="m">x</i><span class="num">&lt;0</span>）的图象上，过点<i class="m">A</i>作<i class="m">AB</i><span class="num">⊥</span><i class="m">x</i>轴，垂足为点<i class="m">B</i>，线段<i class="m">AB</i>与反比例函数<span class="math"><i class="m">y</i><span class="num">=</span><span class="fraction"><span><i class="m">k</i></span><span><i class="m">x</i></span></span></span>（<i class="m">x</i><span class="num">&lt;0</span>）的图象交于点<i class="m">D</i>．若<i class="m">S</i><sub><span class="num">△</span><i class="m">AOD</i></sub><span class="num">=2</span>，则<i class="m">k</i>的值为<span class="screen-blank" data-ans="<span class=\'num\'>-2</span>"></span>．</p>',
      notes:
        '<div class="step step-locked"><b>01</b><span><b>步骤<span class="num">1</span>（表直角三角形）：</b>由<i class="m">k</i>的几何意义知，点<i class="m">A</i>在<span class="math"><i class="m">y</i><span class="num">=-</span><span class="fraction"><span><span class="num">6</span></span><span><i class="m">x</i></span></span></span>上，故<span class="math"><i class="m">S</i><sub><span class="num">△</span><i class="m">AOB</i></sub><span class="num">=</span><span class="fraction"><span><span class="num">1</span></span><span><span class="num">2</span></span></span><span class="num">×|-6|=3</span></span>；点<i class="m">D</i>在<span class="math"><i class="m">y</i><span class="num">=</span><span class="fraction"><span><i class="m">k</i></span><span><i class="m">x</i></span></span></span>上，故<span class="math"><i class="m">S</i><sub><span class="num">△</span><i class="m">DOB</i></sub><span class="num">=</span><span class="fraction"><span><span class="num">1</span></span><span><span class="num">2</span></span></span><span class="num">|</span><i class="m">k</i><span class="num">|</span></span>．</span></div>' +
        '<div class="step step-locked"><b>02</b><span><b>步骤<span class="num">2</span>（面积差列式）：</b>因为<i class="m">S</i><sub><span class="num">△</span><i class="m">AOD</i></sub><span class="num">=</span><i class="m">S</i><sub><span class="num">△</span><i class="m">AOB</i></sub><span class="num">-</span><i class="m">S</i><sub><span class="num">△</span><i class="m">DOB</i></sub><span class="num">=2</span>，所以<span class="math"><span class="num">3-</span><span class="fraction"><span><span class="num">1</span></span><span><span class="num">2</span></span></span><span class="num">|</span><i class="m">k</i><span class="num">|=2</span></span>，解得<span class="math"><span class="fraction"><span><span class="num">1</span></span><span><span class="num">2</span></span></span><span class="num">|</span><i class="m">k</i><span class="num">|=1</span></span>，即<span class="num">|</span><i class="m">k</i><span class="num">|=2</span>．</span></div>' +
        '<div class="step step-locked"><b>03</b><span><b>步骤<span class="num">3</span>（★易错定号）：</b>观察图象，反比例函数<span class="math"><i class="m">y</i><span class="num">=</span><span class="fraction"><span><i class="m">k</i></span><span><i class="m">x</i></span></span></span>的分支位于第二象限，故<i class="m">k</i><span class="num">&lt;0</span>，因此<i class="m">k</i><span class="num">=-2</span>（切忌漏掉负号写成<span class="num">2</span>！）．</span></div>',
      media: '<div class="sim-Host"></div>'
    },

    // -------------------------------------------------------------------------
    // Slide 5: 新知应用 · 第5题
    // -------------------------------------------------------------------------
    {
      phase: 2,
      section: '新知应用',
      navTag: '题5·异号平行四边形',
      title: '第<span class="num">5</span>题：异号双曲线与平行四边形等积变形',
      layout: 'layout-b',
      sim: 'apply5Sim',
      maxStep: 3,
      stem:
        '<p><span class="num">5．</span>如图所示，点<i class="m">A</i>是反比例函数<span class="math"><i class="m">y</i><span class="num">=</span><span class="fraction"><span><span class="num">4</span></span><span><i class="m">x</i></span></span></span>（<i class="m">x</i><span class="num">&gt;0</span>）图象上的任意一点，<i class="m">AB</i><span class="num">∥</span><i class="m">x</i>轴交反比例函数<span class="math"><i class="m">y</i><span class="num">=-</span><span class="fraction"><span><span class="num">5</span></span><span><i class="m">x</i></span></span></span>（<i class="m">x</i><span class="num">&lt;0</span>）的图象于点<i class="m">B</i>，以<i class="m">AB</i>为边作<span class="num">▱</span><i class="m">ABCD</i>，点<i class="m">C</i>，<i class="m">D</i>在<i class="m">x</i>轴上，则<span class="num">▱</span><i class="m">ABCD</i>的面积为<span class="screen-blank" data-ans="<span class=\'num\'>9</span>"></span>．</p>',
      notes:
        '<div class="step step-locked"><b>01</b><span><b>步骤<span class="num">1</span>（作垂线化归矩形）：</b>设<i class="m">AB</i>交<i class="m">y</i>轴于点<i class="m">E</i>，过点<i class="m">A</i>作<i class="m">AF</i><span class="num">⊥</span><i class="m">x</i>轴于点<i class="m">F</i>，过点<i class="m">B</i>作<i class="m">BG</i><span class="num">⊥</span><i class="m">x</i>轴于点<i class="m">G</i>，则四边形<i class="m">ABGF</i>为矩形．</span></div>' +
        '<div class="step step-locked"><b>02</b><span><b>步骤<span class="num">2</span>（同底等高转化）：</b>因为<span class="num">▱</span><i class="m">ABCD</i>与矩形<i class="m">ABGF</i>同底（均以<i class="m">AB</i>为底）、等高（高均为<i class="m">OE</i>的长），所以<i class="m">S</i><sub><span class="num">▱</span><i class="m">ABCD</i></sub><span class="num">=</span><i class="m">S</i><sub>矩形<i class="m">ABGF</i></sub>．</span></div>' +
        '<div class="step step-locked"><b>03</b><span><b>步骤<span class="num">3</span>（异号相加求和）：</b>由异号双曲线矩形模型知，<i class="m">S</i><sub>矩形<i class="m">ABGF</i></sub><span class="num">=</span><i class="m">S</i><sub>矩形<i class="m">AEFO</i></sub><span class="num">+</span><i class="m">S</i><sub>矩形<i class="m">BEGO</i></sub><span class="num">=|4|+|-5|=4+5=9</span>，故<i class="m">S</i><sub><span class="num">▱</span><i class="m">ABCD</i></sub><span class="num">=9</span>．</span></div>',
      media: '<div class="sim-Host"></div>'
    }
  ];

  for (var i = 0; i < slides.length; i++) {
    var sl = slides[i];
    sl.lesson = 1;
    sl.html =
      '<div class="screen-page lab-visible">' +
      '<div class="screen-stem">' + sl.stem + '</div>' +
      '<div class="screen-lower ' + (sl.layout || 'layout-b') + '">' +
      '<div class="screen-notes"><div id="controls" class="controls"></div>' + sl.notes + '</div>' +
      '<div class="screen-media"><div class="screen-lab"><div id="scene" class="visual sim-Host" style="padding:10px;align-items:stretch;justify-content:center;"></div></div></div>' +
      '</div></div>';
    window.UNIT1_THEOREM_SLIDES.push(sl);
  }

  // ===========================================================================
  // 交互仿真模块定义（5个）
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Sim 1: apply1Sim（第1题：多点矩形面积）
  // ---------------------------------------------------------------------------
  window.UNIT1_SIMS.apply1Sim = {
    state: { step: 0, maxStep: 3 },
    init: function (state) {
      state.step = 0;
      state.maxStep = 3;
      if (typeof clearManualOverrides === 'function') clearManualOverrides(state);
    },
    render: function (state) {
      var root = typeof activeRoot === 'function' ? activeRoot() : null;
      if (!root) return;
      var host = root.querySelector('.sim-Host');
      if (!host) return;

      var step = state.step || 0;
      var ox = 68, oy = 310;
      var sx = 54, sy = 38;
      var toX = function (x) { return ox + x * sx; };
      var toY = function (y) { return oy - y * sy; };

      var k = 6;
      var x1 = 1, y1 = 6;
      var x2 = 3, y2 = 2;
      var x3 = 6, y3 = 1;

      var p1x = toX(x1), p1y = toY(y1);
      var p2x = toX(x2), p2y = toY(y2);
      var p3x = toX(x3), p3y = toY(y3);

      var curvePts = sampleHyperbola(k, 0.85, 6.8, 90, toX, toY, 0, 7.2);

      var svg = '';
      svg += '<svg viewBox="0 0 480 360" style="width:100%;height:100%;max-height:100%;display:block;">';
      svg += '<defs>';
      svg += '<marker id="arr1" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">';
      svg += '<path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#334155"/></marker>';
      svg += '<pattern id="hatchS1" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">';
      svg += '<line x1="0" y1="0" x2="0" y2="8" stroke="#64748b" stroke-width="2.2" stroke-opacity="0.45"/></pattern>';
      svg += '</defs>';

      // 阴影矩形 S1: x in [0, 1], y in [2, 6]
      var s1Fill = step >= 3 ? 'rgba(16, 185, 129, 0.28)' : 'url(#hatchS1)';
      var s1Stroke = step >= 3 ? '#059669' : '#475569';
      svg +=
        '<rect x="' + ox + '" y="' + p1y.toFixed(1) + '" width="' + (p1x - ox).toFixed(1) + '" height="' + (p2y - p1y).toFixed(1) + '" ' +
        'fill="rgba(148, 163, 184, 0.28)" stroke="none"/>' +
        '<rect x="' + ox + '" y="' + p1y.toFixed(1) + '" width="' + (p1x - ox).toFixed(1) + '" height="' + (p2y - p1y).toFixed(1) + '" ' +
        'fill="' + s1Fill + '" stroke="' + s1Stroke + '" stroke-width="' + (step >= 3 ? 2.2 : 1.2) + '"/>';

      // 阴影矩形 S2: x in [3, 6], y in [0, 1]
      var s2Fill = step >= 2 ? 'rgba(245, 158, 11, 0.32)' : 'url(#hatchS1)';
      var s2Stroke = step >= 2 ? '#d97706' : '#475569';
      svg +=
        '<rect x="' + p2x.toFixed(1) + '" y="' + p3y.toFixed(1) + '" width="' + (p3x - p2x).toFixed(1) + '" height="' + (oy - p3y).toFixed(1) + '" ' +
        'fill="rgba(148, 163, 184, 0.28)" stroke="none"/>' +
        '<rect x="' + p2x.toFixed(1) + '" y="' + p3y.toFixed(1) + '" width="' + (p3x - p2x).toFixed(1) + '" height="' + (oy - p3y).toFixed(1) + '" ' +
        'fill="' + s2Fill + '" stroke="' + s2Stroke + '" stroke-width="' + (step >= 2 ? 2.2 : 1.2) + '"/>';

      // step >= 2: 高亮 S2 左侧等积空白矩形 x in [0, 3], y in [0, 1]
      if (step >= 2) {
        svg +=
          '<rect x="' + ox + '" y="' + p3y.toFixed(1) + '" width="' + (p2x - ox).toFixed(1) + '" height="' + (oy - p3y).toFixed(1) + '" ' +
          'fill="rgba(59, 130, 246, 0.16)" stroke="#2563eb" stroke-width="1.8" stroke-dasharray="5,4"/>';
        svg += svgTextHalo((ox + p2x) / 2, (p3y + oy) / 2 + 5, '面积 = 3', {
          size: 13,
          fill: '#1d4ed8'
        });
      }

      // 原题垂直与水平虚线
      var dashLines = [
        // P1 垂线
        [ox, p1y, p1x, p1y],
        [p1x, p1y, p1x, oy],
        // P2 垂线
        [ox, p2y, p2x, p2y],
        [p2x, p2y, p2x, oy],
        // P3 垂线
        [ox, p3y, p3x, p3y],
        [p3x, p3y, p3x, oy]
      ];
      for (var d = 0; d < dashLines.length; d++) {
        var ln = dashLines[d];
        svg +=
          '<line x1="' + ln[0].toFixed(1) + '" y1="' + ln[1].toFixed(1) + '" ' +
          'x2="' + ln[2].toFixed(1) + '" y2="' + ln[3].toFixed(1) + '" ' +
          'stroke="#475569" stroke-width="1.4" stroke-dasharray="4,3"/>';
      }

      // 坐标轴
      svg +=
        '<line x1="35" y1="' + oy + '" x2="445" y2="' + oy + '" stroke="#334155" stroke-width="1.8" marker-end="url(#arr1)"/>' +
        '<line x1="' + ox + '" y1="335" x2="' + ox + '" y2="25" stroke="#334155" stroke-width="1.8" marker-end="url(#arr1)"/>';
      svg += svgTextHalo(442, oy + 20, 'x', { italic: true, size: 16 });
      svg += svgTextHalo(ox - 16, 32, 'y', { italic: true, size: 16 });
      svg += svgTextHalo(ox - 14, oy + 18, 'O', { italic: true, size: 15 });

      // x 轴刻度 1, 3, 6 (标在 x 轴下方无双曲线侧)
      var xTicks = [1, 3, 6];
      for (var t = 0; t < xTicks.length; t++) {
        var tx = toX(xTicks[t]);
        svg += '<line x1="' + tx.toFixed(1) + '" y1="' + oy + '" x2="' + tx.toFixed(1) + '" y2="' + (oy - 4) + '" stroke="#334155" stroke-width="1.5"/>';
        svg += svgTextHalo(tx, oy + 19, String(xTicks[t]), { size: 14, fill: '#1e293b' });
      }

      // 双曲线
      svg +=
        '<polyline points="' + curvePts + '" fill="none" stroke="#2563eb" stroke-width="2.6" stroke-linecap="round"/>';

      // 双曲线解析式二维分式标签
      if (step >= 2) {
        svg += svgStackedFraction(toX(4.8), toY(2.2), true, '', '6', 'x', { color: '#1d4ed8', numItalic: false, denItalic: true });
      } else {
        svg += svgStackedFraction(toX(4.8), toY(2.2), true, '', 'k', 'x', { color: '#1d4ed8', numItalic: true, denItalic: true });
      }

      // S1, S2 标注
      svg +=
        '<text x="' + ((ox + p1x) / 2).toFixed(1) + '" y="' + ((p1y + p2y) / 2 + 5).toFixed(1) + '" font-size="15" font-weight="700" ' +
        'font-family="\'Times New Roman\', serif" fill="' + (step >= 3 ? '#047857' : '#0f172a') + '" text-anchor="middle" ' +
        'stroke="#ffffff" stroke-width="3.5" paint-order="stroke"><tspan font-style="italic">S</tspan><tspan dy="3" font-size="11">1</tspan></text>';

      svg +=
        '<text x="' + ((p2x + p3x) / 2).toFixed(1) + '" y="' + ((p3y + oy) / 2 + 5).toFixed(1) + '" font-size="15" font-weight="700" ' +
        'font-family="\'Times New Roman\', serif" fill="' + (step >= 2 ? '#b45309' : '#0f172a') + '" text-anchor="middle" ' +
        'stroke="#ffffff" stroke-width="3.5" paint-order="stroke"><tspan font-style="italic">S</tspan><tspan dy="3" font-size="11">2</tspan>' +
        (step >= 2 ? '<tspan dy="-3" font-size="14"> = 3</tspan>' : '') + '</text>';

      // 点 P1, P2, P3
      svg += svgPoint(p1x, p1y, '#1e40af');
      svg += svgPoint(p2x, p2y, '#1e40af');
      svg += svgPoint(p3x, p3y, '#1e40af');

      // 点标签 P1, P2, P3
      svg +=
        '<text x="' + (p1x + 8).toFixed(1) + '" y="' + (p1y - 6).toFixed(1) + '" font-size="15" font-weight="700" ' +
        'font-family="\'Times New Roman\', serif" fill="#0f172a" stroke="#ffffff" stroke-width="3.5" paint-order="stroke">' +
        '<tspan font-style="italic">P</tspan><tspan dy="3" font-size="11">1</tspan></text>';
      svg +=
        '<text x="' + (p2x + 8).toFixed(1) + '" y="' + (p2y - 6).toFixed(1) + '" font-size="15" font-weight="700" ' +
        'font-family="\'Times New Roman\', serif" fill="#0f172a" stroke="#ffffff" stroke-width="3.5" paint-order="stroke">' +
        '<tspan font-style="italic">P</tspan><tspan dy="3" font-size="11">2</tspan></text>';
      svg +=
        '<text x="' + (p3x + 8).toFixed(1) + '" y="' + (p3y - 6).toFixed(1) + '" font-size="15" font-weight="700" ' +
        'font-family="\'Times New Roman\', serif" fill="#0f172a" stroke="#ffffff" stroke-width="3.5" paint-order="stroke">' +
        '<tspan font-style="italic">P</tspan><tspan dy="3" font-size="11">3</tspan></text>';

      // Step >= 1: 标出 y 轴对应纵坐标
      if (step === 1) {
        svg += svgTextHalo(ox - 16, p1y + 5, 'k', { italic: true, size: 14, fill: '#2563eb' });
        svg += svgStackedFraction(ox - 18, p2y, false, '', 'k', '3', { color: '#2563eb', numItalic: true, denItalic: false, barHalf: 8 });
        svg += svgStackedFraction(ox - 18, p3y, false, '', 'k', '6', { color: '#2563eb', numItalic: true, denItalic: false, barHalf: 8 });
      } else if (step >= 2) {
        svg += svgTextHalo(ox - 16, p1y + 5, '6', { size: 14, fill: '#059669' });
        svg += svgTextHalo(ox - 16, p2y + 5, '2', { size: 14, fill: '#059669' });
        svg += svgTextHalo(ox - 16, p3y + 5, '1', { size: 14, fill: '#d97706' });
      }

      // Step >= 2: 标出 S2 的长 6-3=3
      if (step >= 2) {
        svg += svgTextHalo((p2x + p3x) / 2, oy + 36, '长 = 6 - 3 = 3', { size: 13, fill: '#b45309' });
      }

      // Step >= 3: 标出 S1 的高 6-2=4 与宽 1
      if (step >= 3) {
        svg +=
          '<line x1="' + (p1x + 12).toFixed(1) + '" y1="' + p1y.toFixed(1) + '" x2="' + (p1x + 12).toFixed(1) + '" y2="' + p2y.toFixed(1) + '" ' +
          'stroke="#059669" stroke-width="2" stroke-dasharray="3,2"/>';
        svg += svgTextHalo(p1x + 56, (p1y + p2y) / 2 + 4, '高 = 6 - 2 = 4', { size: 13, fill: '#047857' });
        svg += svgTextHalo((ox + p1x) / 2, p1y - 8, '宽=1', { size: 12, fill: '#047857' });
        svg += svgTextHalo(315, 65, 'S₁ = 1 × (6 - 2) = 4', { size: 15, fill: '#047857' });
      }

      svg += '</svg>';

      var controlsEl = root.querySelector('#controls');
      if (controlsEl && typeof stepBar === 'function') {
        controlsEl.innerHTML = stepBar(step, state.maxStep);
      }
      host.innerHTML = svg;
    }
  };

  // ---------------------------------------------------------------------------
  // Sim 2: apply2Sim（第2题：中心对称求解析式）
  // ---------------------------------------------------------------------------
  window.UNIT1_SIMS.apply2Sim = {
    state: { step: 0, maxStep: 3 },
    init: function (state) {
      state.step = 0;
      state.maxStep = 3;
      if (typeof clearManualOverrides === 'function') clearManualOverrides(state);
    },
    render: function (state) {
      var root = typeof activeRoot === 'function' ? activeRoot() : null;
      if (!root) return;
      var host = root.querySelector('.sim-Host');
      if (!host) return;

      var step = state.step || 0;
      var ox = 240, oy = 180;
      var s = 54;
      var toX = function (x) { return ox + x * s; };
      var toY = function (y) { return oy - y * s; };

      var k = 1.5;
      // 取交点 A(1.5, 1), B(-1.5, -1), C(1.5, 0)
      var ax = 1.5, ay = 1.0;
      var bx = -1.5, by = -1.0;
      var cx = 1.5, cy = 0;

      var Ax = toX(ax), Ay = toY(ay);
      var Bx = toX(bx), By = toY(by);
      var Cx = toX(cx), Cy = toY(cy);

      var branch1 = sampleHyperbola(k, 0.52, 3.6, 70, toX, toY, -3.0, 3.0);
      var branch3 = sampleHyperbola(k, -3.6, -0.52, 70, toX, toY, -3.0, 3.0);

      var svg = '';
      svg += '<svg viewBox="0 0 480 360" style="width:100%;height:100%;max-height:100%;display:block;">';
      svg += '<defs>';
      svg += '<marker id="arr2" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">';
      svg += '<path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#334155"/></marker>';
      svg += '</defs>';

      // step == 0: 淡色填充 △ABC
      if (step === 0) {
        svg +=
          '<polygon points="' + Ax.toFixed(1) + ',' + Ay.toFixed(1) + ' ' +
          Bx.toFixed(1) + ',' + By.toFixed(1) + ' ' +
          Cx.toFixed(1) + ',' + Cy.toFixed(1) + '" fill="rgba(148, 163, 184, 0.18)" stroke="none"/>';
      } else {
        // step >= 1: 高亮 △AOC 与 △BOC 等积色块
        svg +=
          '<polygon points="' + ox + ',' + oy + ' ' + Ax.toFixed(1) + ',' + Ay.toFixed(1) + ' ' + Cx.toFixed(1) + ',' + Cy.toFixed(1) + '" ' +
          'fill="rgba(59, 130, 246, 0.25)" stroke="#2563eb" stroke-width="1.5"/>';
        svg +=
          '<polygon points="' + ox + ',' + oy + ' ' + Bx.toFixed(1) + ',' + By.toFixed(1) + ' ' + Cx.toFixed(1) + ',' + Cy.toFixed(1) + '" ' +
          'fill="rgba(245, 158, 11, 0.25)" stroke="#d97706" stroke-width="1.5"/>';
      }

      // 坐标轴
      svg +=
        '<line x1="30" y1="' + oy + '" x2="450" y2="' + oy + '" stroke="#334155" stroke-width="1.8" marker-end="url(#arr2)"/>' +
        '<line x1="' + ox + '" y1="335" x2="' + ox + '" y2="25" stroke="#334155" stroke-width="1.8" marker-end="url(#arr2)"/>';
      svg += svgTextHalo(446, oy + 20, 'x', { italic: true, size: 16 });
      svg += svgTextHalo(ox - 16, 32, 'y', { italic: true, size: 16 });
      svg += svgTextHalo(ox - 14, oy + 18, 'O', { italic: true, size: 15 });

      // y 轴标刻度 1（标在第二象限侧无双曲线处）
      var y1Tick = toY(1.0);
      svg += '<line x1="' + ox + '" y1="' + y1Tick.toFixed(1) + '" x2="' + (ox + 5) + '" y2="' + y1Tick.toFixed(1) + '" stroke="#334155" stroke-width="1.5"/>';
      svg += svgTextHalo(ox - 14, y1Tick + 5, '1', { size: 14 });

      // 正比例函数直线 (过 A, O, B)
      var lx1 = toX(-3.3), ly1 = toY(-2.2);
      var lx2 = toX(3.3), ly2 = toY(2.2);
      svg += '<line x1="' + lx1.toFixed(1) + '" y1="' + ly1.toFixed(1) + '" x2="' + lx2.toFixed(1) + '" y2="' + ly2.toFixed(1) + '" stroke="#475569" stroke-width="2"/>';

      // 线段 AC, BC
      svg += '<line x1="' + Ax.toFixed(1) + '" y1="' + Ay.toFixed(1) + '" x2="' + Cx.toFixed(1) + '" y2="' + Cy.toFixed(1) + '" stroke="#0f172a" stroke-width="2"/>';
      svg += '<line x1="' + Bx.toFixed(1) + '" y1="' + By.toFixed(1) + '" x2="' + Cx.toFixed(1) + '" y2="' + Cy.toFixed(1) + '" stroke="#0f172a" stroke-width="2"/>';

      // C 处直角标记
      svg += svgRightAngle(Cx, Cy, -1, 0, 0, -1, 8, '#334155');

      // 双曲线两支
      svg += '<polyline points="' + branch1 + '" fill="none" stroke="#2563eb" stroke-width="2.6" stroke-linecap="round"/>';
      svg += '<polyline points="' + branch3 + '" fill="none" stroke="#2563eb" stroke-width="2.6" stroke-linecap="round"/>';

      // step >= 1: OA = OB 等长双短杠标记
      if (step >= 1) {
        var m1x = (ox + Ax) / 2, m1y = (oy + Ay) / 2;
        var m2x = (ox + Bx) / 2, m2y = (oy + By) / 2;
        // 垂直于 AB 方向的短杠向量
        var nx = -4.5, ny = 6.5;
        svg +=
          '<line x1="' + (m1x - nx - 2).toFixed(1) + '" y1="' + (m1y - ny - 1.3).toFixed(1) + '" x2="' + (m1x + nx - 2).toFixed(1) + '" y2="' + (m1y + ny - 1.3).toFixed(1) + '" stroke="#dc2626" stroke-width="2"/>' +
          '<line x1="' + (m1x - nx + 2).toFixed(1) + '" y1="' + (m1y - ny + 1.3).toFixed(1) + '" x2="' + (m1x + nx + 2).toFixed(1) + '" y2="' + (m1y + ny + 1.3).toFixed(1) + '" stroke="#dc2626" stroke-width="2"/>' +
          '<line x1="' + (m2x - nx - 2).toFixed(1) + '" y1="' + (m2y - ny - 1.3).toFixed(1) + '" x2="' + (m2x + nx - 2).toFixed(1) + '" y2="' + (m2y + ny - 1.3).toFixed(1) + '" stroke="#dc2626" stroke-width="2"/>' +
          '<line x1="' + (m2x - nx + 2).toFixed(1) + '" y1="' + (m2y - ny + 1.3).toFixed(1) + '" x2="' + (m2x + nx + 2).toFixed(1) + '" y2="' + (m2y + ny + 1.3).toFixed(1) + '" stroke="#dc2626" stroke-width="2"/>';
        svg += svgTextHalo(125, 72, 'OA = OB (中心对称)', { size: 14, fill: '#dc2626' });
      }

      // step >= 2: 面积推导标注
      if (step >= 2) {
        svg += window.svgFoLabel(22, 82, 210, 34,
          '<span class="math"><i class="m">S</i><sub><span class="num">△</span><i class="m">ABC</i></sub><span class="num">=2</span><i class="m">S</i><sub><span class="num">△</span><i class="m">AOC</i></sub><span class="num">=|</span><i class="m">k</i><span class="num">|=</span><span class="fraction"><span><span class="num">3</span></span><span><span class="num">2</span></span></span></span>',
          'font-size:13.5px; color:#1d4ed8;'
        );
      }

      // step >= 3: 双曲线解析式二维分式标签
      if (step >= 3) {
        svg += svgStackedFraction(toX(2.4), toY(1.8), true, '', '3', '2x', {
          color: '#047857',
          numItalic: false,
          denItalic: true,
          barHalf: 13
        });
      }

      // 几何顶点 A, B, C
      svg += svgPoint(Ax, Ay, '#1e40af');
      svg += svgPoint(Bx, By, '#1e40af');
      svg += svgPoint(Cx, Cy, '#334155', 4);

      svg += svgTextHalo(Ax + 12, Ay - 8, 'A', { italic: true, size: 16 });
      svg += svgTextHalo(Bx - 14, By - 8, 'B', { italic: true, size: 16 });
      svg += svgTextHalo(Cx + 10, Cy + 18, 'C', { italic: true, size: 16 });

      svg += '</svg>';

      var controlsEl = root.querySelector('#controls');
      if (controlsEl && typeof stepBar === 'function') {
        controlsEl.innerHTML = stepBar(step, state.maxStep);
      }
      host.innerHTML = svg;
    }
  };

  // ---------------------------------------------------------------------------
  // Sim 3: apply3Sim（第3题：单曲线同支两点蝴蝶等积与转直角梯形）
  // ---------------------------------------------------------------------------
  window.UNIT1_SIMS.apply3Sim = {
    state: { step: 0, maxStep: 3 },
    init: function (state) {
      state.step = 0;
      state.maxStep = 3;
      if (typeof clearManualOverrides === 'function') clearManualOverrides(state);
    },
    render: function (state) {
      var root = typeof activeRoot === 'function' ? activeRoot() : null;
      if (!root) return;
      var host = root.querySelector('.sim-Host');
      if (!host) return;

      var step = state.step || 0;
      var ox = 78, oy = 305;
      var sx = 78, sy = 38;
      var toX = function (x) { return ox + x * sx; };
      var toY = function (y) { return oy - y * sy; };

      // y = 6/x (x > 0), A(1, 6), C(3, 2), B(1, 0), D(3, 0), E(1, 2/3)
      var k = 6.0;
      var ax = 1.0, ay = 6.0;
      var cx = 3.0, cy = 2.0;
      var bx = 1.0, by = 0;
      var dx = 3.0, dy = 0;
      var ex = 1.0, ey = 2.0 / 3.0;

      var Ax = toX(ax), Ay = toY(ay);
      var Cx = toX(cx), Cy = toY(cy);
      var Bx = toX(bx), By = toY(by);
      var Dx = toX(dx), Dy = toY(dy);
      var Ex = toX(ex), Ey = toY(ey);

      var curvePts = sampleHyperbola(k, 0.86, 4.6, 85, toX, toY, 0, 7.2);

      var svg = '';
      svg += '<svg viewBox="0 0 480 360" style="width:100%;height:100%;max-height:100%;display:block;">';
      svg += '<defs>';
      svg += '<marker id="arr3" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">';
      svg += '<path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#334155"/></marker>';
      svg += '</defs>';

      // step == 0: 淡色标识 △AOE 与 四边形BECD
      if (step === 0) {
        svg +=
          '<polygon points="' + ox + ',' + oy + ' ' + Ax.toFixed(1) + ',' + Ay.toFixed(1) + ' ' + Ex.toFixed(1) + ',' + Ey.toFixed(1) + '" ' +
          'fill="rgba(148, 163, 184, 0.28)" stroke="#475569" stroke-width="1.4"/>';
        svg +=
          '<polygon points="' + Bx.toFixed(1) + ',' + By.toFixed(1) + ' ' + Ex.toFixed(1) + ',' + Ey.toFixed(1) + ' ' + Cx.toFixed(1) + ',' + Cy.toFixed(1) + ' ' + Dx.toFixed(1) + ',' + Dy.toFixed(1) + '" ' +
          'fill="rgba(100, 116, 139, 0.36)" stroke="#475569" stroke-width="1.4"/>';
      } else if (step === 1) {
        // step == 1: 高亮两个基准直角三角形 △AOB 与 △COD 面积均为 3
        svg +=
          '<polygon points="' + ox + ',' + oy + ' ' + Ax.toFixed(1) + ',' + Ay.toFixed(1) + ' ' + Bx.toFixed(1) + ',' + By.toFixed(1) + '" ' +
          'fill="rgba(59, 130, 246, 0.24)" stroke="#2563eb" stroke-width="1.8"/>';
        svg +=
          '<polygon points="' + ox + ',' + oy + ' ' + Cx.toFixed(1) + ',' + Cy.toFixed(1) + ' ' + Dx.toFixed(1) + ',' + Dy.toFixed(1) + '" ' +
          'fill="rgba(245, 158, 11, 0.24)" stroke="#d97706" stroke-width="1.8"/>';
      } else if (step === 2) {
        // step == 2: 蝴蝶等积 S四边形BECD = S△AOE = 3 - 1 = 2
        svg +=
          '<polygon points="' + ox + ',' + oy + ' ' + Bx.toFixed(1) + ',' + By.toFixed(1) + ' ' + Ex.toFixed(1) + ',' + Ey.toFixed(1) + '" ' +
          'fill="rgba(250, 204, 21, 0.35)" stroke="#ca8a04" stroke-width="1.6" stroke-dasharray="4,3"/>';
        svg +=
          '<polygon points="' + ox + ',' + oy + ' ' + Ax.toFixed(1) + ',' + Ay.toFixed(1) + ' ' + Ex.toFixed(1) + ',' + Ey.toFixed(1) + '" ' +
          'fill="rgba(59, 130, 246, 0.34)" stroke="#1d4ed8" stroke-width="1.8"/>';
        svg +=
          '<polygon points="' + Bx.toFixed(1) + ',' + By.toFixed(1) + ' ' + Ex.toFixed(1) + ',' + Ey.toFixed(1) + ' ' + Cx.toFixed(1) + ',' + Cy.toFixed(1) + ' ' + Dx.toFixed(1) + ',' + Dy.toFixed(1) + '" ' +
          'fill="rgba(59, 130, 246, 0.34)" stroke="#1d4ed8" stroke-width="1.8"/>';
      } else if (step >= 3) {
        // step >= 3: 连接 AC，展示 S△AOC = S直角梯形ABDC = 8
        svg +=
          '<polygon points="' + Ax.toFixed(1) + ',' + Ay.toFixed(1) + ' ' + Cx.toFixed(1) + ',' + Cy.toFixed(1) + ' ' + Dx.toFixed(1) + ',' + Dy.toFixed(1) + ' ' + Bx.toFixed(1) + ',' + By.toFixed(1) + '" ' +
          'fill="rgba(16, 185, 129, 0.24)" stroke="#059669" stroke-width="2" stroke-dasharray="5,3"/>';
        svg +=
          '<polygon points="' + ox + ',' + oy + ' ' + Ax.toFixed(1) + ',' + Ay.toFixed(1) + ' ' + Cx.toFixed(1) + ',' + Cy.toFixed(1) + '" ' +
          'fill="rgba(59, 130, 246, 0.24)" stroke="#1d4ed8" stroke-width="2"/>';
        svg +=
          '<line x1="' + Ax.toFixed(1) + '" y1="' + Ay.toFixed(1) + '" x2="' + Cx.toFixed(1) + '" y2="' + Cy.toFixed(1) + '" stroke="#059669" stroke-width="2.5"/>';
      }

      // 坐标轴
      svg +=
        '<line x1="35" y1="' + oy + '" x2="450" y2="' + oy + '" stroke="#334155" stroke-width="1.8" marker-end="url(#arr3)"/>' +
        '<line x1="' + ox + '" y1="335" x2="' + ox + '" y2="25" stroke="#334155" stroke-width="1.8" marker-end="url(#arr3)"/>';
      svg += svgTextHalo(445, oy + 20, 'x', { italic: true, size: 16 });
      svg += svgTextHalo(ox - 16, 32, 'y', { italic: true, size: 16 });
      svg += svgTextHalo(ox - 14, oy + 18, 'O', { italic: true, size: 15 });

      // 线段 OA, OC, AB, CD
      svg += '<line x1="' + ox + '" y1="' + oy + '" x2="' + Ax.toFixed(1) + '" y2="' + Ay.toFixed(1) + '" stroke="#0f172a" stroke-width="2"/>';
      svg += '<line x1="' + ox + '" y1="' + oy + '" x2="' + Cx.toFixed(1) + '" y2="' + Cy.toFixed(1) + '" stroke="#0f172a" stroke-width="2"/>';
      svg += '<line x1="' + Ax.toFixed(1) + '" y1="' + Ay.toFixed(1) + '" x2="' + Bx.toFixed(1) + '" y2="' + By.toFixed(1) + '" stroke="#0f172a" stroke-width="2"/>';
      svg += '<line x1="' + Cx.toFixed(1) + '" y1="' + Cy.toFixed(1) + '" x2="' + Dx.toFixed(1) + '" y2="' + Dy.toFixed(1) + '" stroke="#0f172a" stroke-width="2"/>';

      svg += svgRightAngle(Bx, By, -1, 0, 0, -1, 8, '#334155');
      svg += svgRightAngle(Dx, Dy, -1, 0, 0, -1, 8, '#334155');

      // 双曲线 y = 6/x
      svg += '<polyline points="' + curvePts + '" fill="none" stroke="#2563eb" stroke-width="2.6" stroke-linecap="round"/>';
      svg += svgStackedFraction(toX(3.8), toY(2.25), true, '', '6', 'x', { color: '#1d4ed8', numItalic: false, denItalic: true });

      // 步骤标注
      if (step === 1) {
        svg += window.svgFoLabel(175, 36, 250, 34,
          '<span class="math"><i class="m">S</i><sub><span class="num">△</span><i class="m">AOB</i></sub><span class="num">=</span><i class="m">S</i><sub><span class="num">△</span><i class="m">COD</i></sub><span class="num">=</span><span class="fraction"><span><span class="num">1</span></span><span><span class="num">2</span></span></span><span class="num">×6=3</span></span>',
          'font-size:13.5px; color:#1d4ed8;'
        );
      } else if (step === 2) {
        svg += svgTextHalo((ox + Bx + Ex) / 3 + 4, (oy + By + Ey) / 3 + 3, 'S=1', { size: 12, fill: '#b45309' });
        svg += svgTextHalo((Bx + Dx) / 2, (Ey + Cy + by + dy) / 4 + 135, 'S=2', { size: 13.5, fill: '#1d4ed8' });
        svg += svgTextHalo(295, 52, '同减公共△BOE（面积=1）：', { size: 13.5, fill: '#0f172a' });
        svg += svgTextHalo(295, 76, 'S四边形BECD=S△AOE=3-1=2', { size: 14, fill: '#1d4ed8' });
      } else if (step >= 3) {
        svg += svgTextHalo(295, 44, 'A(1,6)，C(3,2) ⇒ AB=6，CD=2，BD=2', { size: 13, fill: '#0f172a' });
        svg += window.svgFoLabel(145, 56, 305, 36,
          '<span class="math"><i class="m">S</i><sub><span class="num">△</span><i class="m">AOC</i></sub><span class="num">=</span><i class="m">S</i><sub>直角梯形<i class="m">ABDC</i></sub><span class="num">=</span><span class="fraction"><span><span class="num">1</span></span><span><span class="num">2</span></span></span><span class="num">×(6+2)×2=8</span></span>',
          'font-size:13px; color:#047857;'
        );
      }

      // 顶点 A, B, C, D, E
      svg += svgPoint(Ax, Ay, '#1e40af');
      svg += svgPoint(Cx, Cy, '#dc2626');
      svg += svgPoint(Bx, By, '#334155', 4);
      svg += svgPoint(Dx, Dy, '#334155', 4);
      svg += svgPoint(Ex, Ey, '#1d4ed8', 4);

      svg += svgTextHalo(Ax + 16, Ay - 6, step >= 3 ? 'A(1,6)' : 'A', { italic: step < 3, size: 15 });
      svg += svgTextHalo(Cx + 18, Cy - 8, step >= 3 ? 'C(3,2)' : 'C', { italic: step < 3, size: 15, fill: '#dc2626' });
      svg += svgTextHalo(Bx, By + 20, 'B', { italic: true, size: 15 });
      svg += svgTextHalo(Dx, Dy + 20, 'D', { italic: true, size: 15 });
      svg += svgTextHalo(Ex + 13, Ey - 5, 'E', { italic: true, size: 14, fill: '#1d4ed8' });

      svg += '</svg>';

      var controlsEl = root.querySelector('#controls');
      if (controlsEl && typeof stepBar === 'function') {
        controlsEl.innerHTML = stepBar(step, state.maxStep);
      }
      host.innerHTML = svg;
    }
  };

  // ---------------------------------------------------------------------------
  // Sim 4: apply4Sim（第4题：同号双曲线求k）
  // ---------------------------------------------------------------------------
  window.UNIT1_SIMS.apply4Sim = {
    state: { step: 0, maxStep: 3 },
    init: function (state) {
      state.step = 0;
      state.maxStep = 3;
      if (typeof clearManualOverrides === 'function') clearManualOverrides(state);
    },
    render: function (state) {
      var root = typeof activeRoot === 'function' ? activeRoot() : null;
      if (!root) return;
      var host = root.querySelector('.sim-Host');
      if (!host) return;

      var step = state.step || 0;
      var ox = 365, oy = 295;
      var s = 56;
      var toX = function (x) { return ox + x * s; };
      var toY = function (y) { return oy - y * s; };

      // A 在 y = -6/x (x < 0): 取 x = -2, A(-2, 3)
      // D 在 y = -2/x (x < 0): D(-2, 1)
      // B(-2, 0)
      var x0 = -2.0;
      var ax = x0, ay = 3.0;
      var dx = x0, dy = 1.0;
      var bx = x0, by = 0;

      var Ax = toX(ax), Ay = toY(ay);
      var Dx = toX(dx), Dy = toY(dy);
      var Bx = toX(bx), By = toY(by);

      var curveOuter = sampleHyperbola(-6, -5.6, -1.3, 80, toX, toY, 0, 4.7);
      var curveInner = sampleHyperbola(-2, -5.6, -0.45, 80, toX, toY, 0, 4.7);

      var svg = '';
      svg += '<svg viewBox="0 0 480 360" style="width:100%;height:100%;max-height:100%;display:block;">';
      svg += '<defs>';
      svg += '<marker id="arr4" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">';
      svg += '<path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#334155"/></marker>';
      svg += '</defs>';

      // step == 0: 仅高亮原题阴影 △AOD
      if (step === 0) {
        svg +=
          '<polygon points="' + ox + ',' + oy + ' ' + Ax.toFixed(1) + ',' + Ay.toFixed(1) + ' ' + Dx.toFixed(1) + ',' + Dy.toFixed(1) + '" ' +
          'fill="rgba(148, 163, 184, 0.32)" stroke="#475569" stroke-width="1.4"/>';
      } else if (step === 1) {
        // step == 1: 分别展示大 △AOB (面积3) 与小 △DOB (面积 0.5|k|)
        svg +=
          '<polygon points="' + ox + ',' + oy + ' ' + Ax.toFixed(1) + ',' + Ay.toFixed(1) + ' ' + Bx.toFixed(1) + ',' + By.toFixed(1) + '" ' +
          'fill="rgba(59, 130, 246, 0.22)" stroke="#2563eb" stroke-width="1.6"/>';
        svg +=
          '<polygon points="' + ox + ',' + oy + ' ' + Dx.toFixed(1) + ',' + Dy.toFixed(1) + ' ' + Bx.toFixed(1) + ',' + By.toFixed(1) + '" ' +
          'fill="rgba(245, 158, 11, 0.32)" stroke="#d97706" stroke-width="1.6"/>';
      } else {
        // step >= 2: 突出展示面积差 △AOD = 2 与小 △DOB = 1
        svg +=
          '<polygon points="' + ox + ',' + oy + ' ' + Ax.toFixed(1) + ',' + Ay.toFixed(1) + ' ' + Dx.toFixed(1) + ',' + Dy.toFixed(1) + '" ' +
          'fill="rgba(59, 130, 246, 0.28)" stroke="#2563eb" stroke-width="1.8"/>';
        svg +=
          '<polygon points="' + ox + ',' + oy + ' ' + Dx.toFixed(1) + ',' + Dy.toFixed(1) + ' ' + Bx.toFixed(1) + ',' + By.toFixed(1) + '" ' +
          'fill="rgba(16, 185, 129, 0.28)" stroke="#059669" stroke-width="1.8"/>';
      }

      // 坐标轴
      svg +=
        '<line x1="25" y1="' + oy + '" x2="445" y2="' + oy + '" stroke="#334155" stroke-width="1.8" marker-end="url(#arr4)"/>' +
        '<line x1="' + ox + '" y1="335" x2="' + ox + '" y2="20" stroke="#334155" stroke-width="1.8" marker-end="url(#arr4)"/>';
      svg += svgTextHalo(442, oy + 20, 'x', { italic: true, size: 16 });
      svg += svgTextHalo(ox + 16, 28, 'y', { italic: true, size: 16 });
      svg += svgTextHalo(ox + 14, oy + 18, 'O', { italic: true, size: 15 });

      // 线段 AB, OA, OD
      svg += '<line x1="' + Ax.toFixed(1) + '" y1="' + Ay.toFixed(1) + '" x2="' + Bx.toFixed(1) + '" y2="' + By.toFixed(1) + '" stroke="#0f172a" stroke-width="2"/>';
      svg += '<line x1="' + ox + '" y1="' + oy + '" x2="' + Ax.toFixed(1) + '" y2="' + Ay.toFixed(1) + '" stroke="#0f172a" stroke-width="2"/>';
      svg += '<line x1="' + ox + '" y1="' + oy + '" x2="' + Dx.toFixed(1) + '" y2="' + Dy.toFixed(1) + '" stroke="#0f172a" stroke-width="2"/>';

      // B 处直角标记
      svg += svgRightAngle(Bx, By, 1, 0, 0, -1, 8, '#334155');

      // 第二象限两支双曲线
      svg += '<polyline points="' + curveOuter + '" fill="none" stroke="#2563eb" stroke-width="2.6" stroke-linecap="round"/>';
      svg += '<polyline points="' + curveInner + '" fill="none" stroke="#d97706" stroke-width="2.5" stroke-linecap="round"/>';

      // 双曲线解析式二维分式标签
      svg += svgStackedFraction(toX(-4.3), toY(2.1), true, '-', '6', 'x', { color: '#1d4ed8', numItalic: false, denItalic: true });
      if (step >= 3) {
        svg += svgStackedFraction(toX(-4.3), toY(0.82), true, '-', '2', 'x', { color: '#dc2626', numItalic: false, denItalic: true });
      } else {
        svg += svgStackedFraction(toX(-4.3), toY(0.82), true, '', 'k', 'x', { color: '#b45309', numItalic: true, denItalic: true });
      }

      // 三角形内部面积文字标注
      svg += svgTextHalo((ox + Ax + Dx) / 3 - 5, (oy + Ay + Dy) / 3 + 4, 'S△AOD = 2', {
        size: 13.5,
        fill: step >= 1 ? '#1e40af' : '#0f172a'
      });

      if (step === 1) {
        svg += window.svgFoLabel(20, 26, 220, 34,
          '大<span class="num">△</span><i class="m">AOB</i>面积<span class="num">=</span><span class="math"><span class="fraction"><span><span class="num">1</span></span><span><span class="num">2</span></span></span><span class="num">×|-6|=3</span></span>',
          'font-size:13px; color:#1d4ed8;'
        );
        svg += window.svgFoLabel((ox + Dx + Bx) / 3 - 56, (oy + Dy + By) / 3 - 12, 105, 32,
          '<span class="math"><i class="m">S</i><sub><span class="num">△</span><i class="m">DOB</i></sub><span class="num">=</span><span class="fraction"><span><span class="num">1</span></span><span><span class="num">2</span></span></span><span class="num">|</span><i class="m">k</i><span class="num">|</span></span>',
          'font-size:12px; color:#b45309;'
        );
      } else if (step >= 2) {
        svg += svgTextHalo(135, 45, 'S△DOB=3-2=1 ⇒ |k|=2', { size: 13.5, fill: '#047857' });
        svg += svgTextHalo((ox + Dx + Bx) / 3 - 8, (oy + Dy + By) / 3 + 6, 'S△DOB=1', { size: 13, fill: '#047857' });
      }

      if (step >= 3) {
        svg += svgTextHalo(145, 70, '★ 第二象限x<0，y>0 ⇒ k=-2', { size: 13.5, fill: '#dc2626' });
      }

      // 点 A, D, B
      svg += svgPoint(Ax, Ay, '#1e40af');
      svg += svgPoint(Dx, Dy, '#d97706');
      svg += svgPoint(Bx, By, '#334155', 4);

      svg += svgTextHalo(Ax - 14, Ay - 6, 'A', { italic: true, size: 16 });
      svg += svgTextHalo(Dx - 14, Dy - 4, 'D', { italic: true, size: 16 });
      svg += svgTextHalo(Bx, By + 20, 'B', { italic: true, size: 16 });

      svg += '</svg>';

      var controlsEl = root.querySelector('#controls');
      if (controlsEl && typeof stepBar === 'function') {
        controlsEl.innerHTML = stepBar(step, state.maxStep);
      }
      host.innerHTML = svg;
    }
  };

  // ---------------------------------------------------------------------------
  // Sim 5: apply5Sim（第5题：异号平行四边形等积变形 + 双滑块互动）
  // ---------------------------------------------------------------------------
  window.UNIT1_SIMS.apply5Sim = {
    state: { step: 0, maxStep: 3, yVal: 2.0, shiftVal: -0.9 },
    init: function (state) {
      state.step = 0;
      state.maxStep = 3;
      state.yVal = 2.0;
      state.shiftVal = -0.9;
      if (typeof clearManualOverrides === 'function') clearManualOverrides(state);
    },
    render: function (state) {
      var root = typeof activeRoot === 'function' ? activeRoot() : null;
      if (!root) return;
      var host = root.querySelector('.sim-Host');
      if (!host) return;

      var step = state.step || 0;
      var yA = parseFloat(state.yVal);
      if (isNaN(yA) || yA < 1.2) yA = 2.0;
      var shift = parseFloat(state.shiftVal);
      if (isNaN(shift)) shift = -0.9;

      var ox = 250, oy = 278;
      var s = 44;
      var toX = function (x) { return ox + x * s; };
      var toY = function (y) { return oy - y * s; };

      // A 在 y = 4/x (x > 0), B 在 y = -5/x (x < 0)
      var ax = 4.0 / yA, ay = yA;
      var bx = -5.0 / yA, by = yA;
      // 平行四边形底边 C, D 在 x 轴上: C = (bx + shift, 0), D = (ax + shift, 0)
      var cx = bx + shift, cy = 0;
      var dx = ax + shift, dy = 0;

      var Ax = toX(ax), Ay = toY(ay);
      var Bx = toX(bx), By = toY(by);
      var Cx = toX(cx), Cy = toY(cy);
      var Dx = toX(dx), Dy = toY(dy);
      var Ex = ox, Ey = toY(yA);
      var Fx = Ax, Fy = oy;
      var Gx = Bx, Gy = oy;

      var curveRight = sampleHyperbola(4, 0.78, 4.6, 75, toX, toY, 0, 5.5);
      var curveLeft = sampleHyperbola(-5, -5.2, -0.95, 75, toX, toY, 0, 5.5);

      var svg = '';
      svg += '<svg viewBox="0 0 480 360" style="width:100%;height:100%;max-height:100%;display:block;">';
      svg += '<defs>';
      svg += '<marker id="arr5" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">';
      svg += '<path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#334155"/></marker>';
      svg += '</defs>';

      // step >= 3: 左右两个矩形 AEFO (面积4) 与 BEGO (面积5) 分色高亮
      if (step >= 3) {
        svg +=
          '<rect x="' + Gx.toFixed(1) + '" y="' + By.toFixed(1) + '" width="' + (ox - Gx).toFixed(1) + '" height="' + (oy - By).toFixed(1) + '" ' +
          'fill="rgba(245, 158, 11, 0.28)" stroke="#d97706" stroke-width="1.8"/>';
        svg +=
          '<rect x="' + ox + '" y="' + Ay.toFixed(1) + '" width="' + (Fx - ox).toFixed(1) + '" height="' + (oy - Ay).toFixed(1) + '" ' +
          'fill="rgba(16, 185, 129, 0.28)" stroke="#059669" stroke-width="1.8"/>';
      } else if (step >= 1) {
        // step 1 or 2: 矩形 ABGF 整体高亮
        svg +=
          '<rect x="' + Gx.toFixed(1) + '" y="' + By.toFixed(1) + '" width="' + (Fx - Gx).toFixed(1) + '" height="' + (oy - By).toFixed(1) + '" ' +
          'fill="rgba(59, 130, 246, 0.16)" stroke="none"/>';
      }

      // 平行四边形 ABCD
      var paraFill = step === 0 ? 'rgba(59, 130, 246, 0.22)' : 'rgba(99, 102, 241, 0.12)';
      svg +=
        '<polygon points="' +
        Ax.toFixed(1) + ',' + Ay.toFixed(1) + ' ' +
        Bx.toFixed(1) + ',' + By.toFixed(1) + ' ' +
        Cx.toFixed(1) + ',' + Cy.toFixed(1) + ' ' +
        Dx.toFixed(1) + ',' + Dy.toFixed(1) +
        '" fill="' + paraFill + '" stroke="#1e293b" stroke-width="2"/>';

      // step >= 1: 动态绘出垂线 AF ⊥ x轴, BG ⊥ x轴（零剧透铁律：step=0不画辅助线）
      if (step >= 1) {
        svg +=
          '<line x1="' + Ax.toFixed(1) + '" y1="' + Ay.toFixed(1) + '" x2="' + Fx.toFixed(1) + '" y2="' + Fy.toFixed(1) + '" ' +
          'stroke="#059669" stroke-width="2.2" stroke-dasharray="5,3"/>';
        svg +=
          '<line x1="' + Bx.toFixed(1) + '" y1="' + By.toFixed(1) + '" x2="' + Gx.toFixed(1) + '" y2="' + Gy.toFixed(1) + '" ' +
          'stroke="#d97706" stroke-width="2.2" stroke-dasharray="5,3"/>';
        svg += svgRightAngle(Fx, Fy, -1, 0, 0, -1, 8, '#059669');
        svg += svgRightAngle(Gx, Gy, 1, 0, 0, -1, 8, '#d97706');
        svg += svgPoint(Ex, Ey, '#475569', 3.8);
        svg += svgPoint(Fx, Fy, '#059669', 4);
        svg += svgPoint(Gx, Gy, '#d97706', 4);
        svg += svgTextHalo(Ex + 12, Ey - 8, 'E', { italic: true, size: 14, fill: '#334155' });
        svg += svgTextHalo(Fx, Fy + 18, 'F', { italic: true, size: 14, fill: '#047857' });
        svg += svgTextHalo(Gx, Gy + 18, 'G', { italic: true, size: 14, fill: '#b45309' });
      }

      // 坐标轴
      svg +=
        '<line x1="18" y1="' + oy + '" x2="462" y2="' + oy + '" stroke="#334155" stroke-width="1.8" marker-end="url(#arr5)"/>' +
        '<line x1="' + ox + '" y1="330" x2="' + ox + '" y2="18" stroke="#334155" stroke-width="1.8" marker-end="url(#arr5)"/>';
      svg += svgTextHalo(456, oy + 20, 'x', { italic: true, size: 16 });
      svg += svgTextHalo(ox + 15, 26, 'y', { italic: true, size: 16 });
      svg += svgTextHalo(ox + 12, oy + 18, 'O', { italic: true, size: 15 });

      // 两支反比例函数曲线
      svg += '<polyline points="' + curveRight + '" fill="none" stroke="#059669" stroke-width="2.6" stroke-linecap="round"/>';
      svg += '<polyline points="' + curveLeft + '" fill="none" stroke="#d97706" stroke-width="2.6" stroke-linecap="round"/>';

      // 双曲线解析式二维分式标签
      svg += svgStackedFraction(toX(3.3), toY(2.2), true, '', '4', 'x', { color: '#047857', numItalic: false, denItalic: true });
      svg += svgStackedFraction(toX(-3.9), toY(2.2), true, '-', '5', 'x', { color: '#b45309', numItalic: false, denItalic: true });

      // 步骤文字提示
      if (step === 2) {
        svg += svgTextHalo(240, 36, '同底 AB、等高 OE  ⇒  S▱ABCD = S矩形ABGF', { size: 13.5, fill: '#1d4ed8' });
      } else if (step >= 3) {
        svg += svgTextHalo((Gx + ox) / 2, (By + oy) / 2 + 5, '|-5| = 5', { size: 14, fill: '#b45309' });
        svg += svgTextHalo((ox + Fx) / 2, (Ay + oy) / 2 + 5, '|4| = 4', { size: 14, fill: '#047857' });
        svg += svgTextHalo(240, 34, 'S▱ABCD = S矩形BEGO + S矩形AEFO = 5 + 4 = 9', { size: 14, fill: '#047857' });
      }

      // 顶点 A, B, C, D
      svg += svgPoint(Ax, Ay, '#059669');
      svg += svgPoint(Bx, By, '#d97706');
      svg += svgPoint(Cx, Cy, '#1e293b', 4);
      svg += svgPoint(Dx, Dy, '#1e293b', 4);

      svg += svgTextHalo(Ax + 12, Ay - 8, 'A', { italic: true, size: 16 });
      svg += svgTextHalo(Bx - 12, By - 8, 'B', { italic: true, size: 16 });
      svg += svgTextHalo(Cx - 10, Cy + 18, 'C', { italic: true, size: 16 });
      svg += svgTextHalo(Dx + 10, Dy + 18, 'D', { italic: true, size: 16 });

      svg += '</svg>';

      var controlsEl = root.querySelector('#controls');
      if (controlsEl && typeof stepBar === 'function') {
        controlsEl.innerHTML = stepBar(step, state.maxStep) +
          slider('yVal', '点<i class="m">A</i>纵坐标 <span class="num">' + yA.toFixed(1) + '</span>', 1.4, 3.2, yA, 0.1) +
          slider('shiftVal', '底边<i class="m">CD</i>平移 <span class="num">' + shift.toFixed(1) + '</span>', -1.8, 1.2, shift, 0.1);
      }
      host.innerHTML = svg;
    }
  };
})();

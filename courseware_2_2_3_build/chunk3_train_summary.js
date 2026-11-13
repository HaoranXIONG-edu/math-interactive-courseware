window.UNIT1_THEOREM_SLIDES = window.UNIT1_THEOREM_SLIDES || [];
window.UNIT1_SIMS = window.UNIT1_SIMS || {};

(function () {
  function svgFrac(cx, cy, numText, denText, color, fontSize) {
    var fs = fontSize || 12;
    var w = Math.max(String(numText).length, String(denText).length) * (fs * 0.62) + 8;
    var numInner = typeof window.svgAutoFormatText === 'function' ? window.svgAutoFormatText(numText, fs) : numText;
    var denInner = typeof window.svgAutoFormatText === 'function' ? window.svgAutoFormatText(denText, fs) : denText;
    return (
      '<g transform="translate(' + cx + ',' + cy + ')">' +
      '<text data-math-formatted="1" x="0" y="' + (-fs * 0.45) + '" text-anchor="middle" font-family="Times New Roman" font-size="' + fs + '" font-weight="700" fill="' + color + '" stroke="#ffffff" stroke-width="3" paint-order="stroke">' + numInner + '</text>' +
      '<line x1="' + (-w / 2) + '" y1="0" x2="' + (w / 2) + '" y2="0" stroke="' + color + '" stroke-width="1.6"/>' +
      '<text data-math-formatted="1" x="0" y="' + (fs * 0.95) + '" text-anchor="middle" font-family="Times New Roman" font-size="' + fs + '" font-weight="700" fill="' + color + '" stroke="#ffffff" stroke-width="3" paint-order="stroke">' + denInner + '</text>' +
      '</g>'
    );
  }

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

  var slides = [
    {
      phase: 3,
      navTag: "训练1·异号拉窗帘",
      section: "分层训练",
      title: "第<span class='num'>1</span>题：（<span class='num'>2026</span>·四川攀枝花）异号双曲线动点三角形求<i class='m'>k</i>",
      layout: "layout-b",
      sim: "train1Sim",
      maxStep: 3,
      stem: '<p><span class="num">1．</span>（<span class="num">2026</span>·四川攀枝花）如图，点<i class="m">A</i>在函数<span class="math"><i class="m">y</i><span class="num">=</span><span class="fraction"><span><span class="num">2</span></span><span><i class="m">x</i></span></span></span>（<i class="m">x</i><span class="num">&gt;0</span>）的图象上，点<i class="m">B</i>在函数<span class="math"><i class="m">y</i><span class="num">=</span><span class="fraction"><span><i class="m">k</i></span><span><i class="m">x</i></span></span></span>（<i class="m">x</i><span class="num">&lt;0</span>）的图象上，<i class="m">AB</i><span class="num">∥</span><i class="m">x</i>轴交<i class="m">y</i>轴于点<i class="m">D</i>，点<i class="m">C</i>是<i class="m">x</i>轴上一点，若<span class="num">△</span><i class="m">ABC</i>的面积为<span class="num">3</span>，则<i class="m">k</i>的值为<span class="screen-blank" data-step="3" data-ans="<span class=\'num\'>-4</span>"></span>．</p>',
      notes: [
        '<div class="step step-locked"><b>01</b><span><b>步骤<span class="num">1</span>（拉窗帘移点）：</b>连接<i class="m">OA</i>，<i class="m">OB</i>．因为<i class="m">AB</i><span class="num">∥</span><i class="m">x</i>轴，点<i class="m">C</i>在<i class="m">x</i>轴上，所以<span class="num">△</span><i class="m">ABC</i>与<span class="num">△</span><i class="m">ABO</i>同底（以<i class="m">AB</i>为底）、等高（高均为<i class="m">OD</i>），故<i class="m">S</i><sub><span class="num">△</span><i class="m">ABO</i></sub><span class="num">=</span><i class="m">S</i><sub><span class="num">△</span><i class="m">ABC</i></sub><span class="num">=3</span>．</span></div>',
        '<div class="step step-locked"><b>02</b><span><b>步骤<span class="num">2</span>（分割三角形）：</b><i class="m">y</i>轴将<span class="num">△</span><i class="m">ABO</i>分为<span class="num">Rt△</span><i class="m">ADO</i>和<span class="num">Rt△</span><i class="m">BDO</i>．由<i class="m">k</i>的几何意义知<i class="m">S</i><sub><span class="num">△</span><i class="m">ADO</i></sub><span class="num">=</span><span class="math"><span class="fraction"><span><span class="num">1</span></span><span><span class="num">2</span></span></span></span><span class="num">×2=1</span>，<i class="m">S</i><sub><span class="num">△</span><i class="m">BDO</i></sub><span class="num">=</span><span class="math"><span class="fraction"><span><span class="num">1</span></span><span><span class="num">2</span></span></span></span><span class="num">|</span><i class="m">k</i><span class="num">|</span>．</span></div>',
        '<div class="step step-locked"><b>03</b><span><b>步骤<span class="num">3</span>（列式定符号）：</b>由<i class="m">S</i><sub><span class="num">△</span><i class="m">ADO</i></sub><span class="num">+</span><i class="m">S</i><sub><span class="num">△</span><i class="m">BDO</i></sub><span class="num">=3</span>得<span class="num">1+</span><span class="math"><span class="fraction"><span><span class="num">1</span></span><span><span class="num">2</span></span></span></span><span class="num">|</span><i class="m">k</i><span class="num">|=3</span>，解得<span class="num">|</span><i class="m">k</i><span class="num">|=4</span>．又因点<i class="m">B</i>所在分支在第二象限，<i class="m">k</i><span class="num">&lt;0</span>，故<i class="m">k</i><span class="num">=-4</span>．</span></div>'
      ]
    },
    {
      phase: 3,
      navTag: "训练2·八字相似求k",
      section: "分层训练",
      title: "第<span class='num'>2</span>题：过原点的双曲线三角形与“八字相似”面积比",
      layout: "layout-b",
      sim: "train2Sim",
      maxStep: 3,
      stem: '<p><span class="num">2．</span>如图，<span class="num">△</span><i class="m">ABC</i>的边<i class="m">AB</i>经过原点<i class="m">O</i>，点<i class="m">A</i>在反比例函数<span class="math"><i class="m">y</i><span class="num">=</span><span class="fraction"><span><span class="num">1</span></span><span><i class="m">x</i></span></span></span>（<i class="m">x</i><span class="num">&lt;0</span>）的图象上，点<i class="m">B</i>在反比例函数<span class="math"><i class="m">y</i><span class="num">=</span><span class="fraction"><span><i class="m">k</i></span><span><i class="m">x</i></span></span></span>（<i class="m">x</i><span class="num">&gt;0</span>）的图象上，点<i class="m">C</i>在<i class="m">x</i>轴上，若<i class="m">S</i><sub><span class="num">△</span><i class="m">BOC</i></sub><span class="num">=2</span><i class="m">S</i><sub><span class="num">△</span><i class="m">AOC</i></sub>，则<i class="m">k</i>的值为<span class="screen-blank" data-step="3" data-ans="<span class=\'num\'>4</span>"></span>．</p>',
      notes: [
        '<div class="step step-locked"><b>01</b><span><b>步骤<span class="num">1</span>（同底面积比转高之比）：</b>过点<i class="m">A</i>作<i class="m">AM</i><span class="num">⊥</span><i class="m">x</i>轴于点<i class="m">M</i>，过点<i class="m">B</i>作<i class="m">BN</i><span class="num">⊥</span><i class="m">x</i>轴于点<i class="m">N</i>．因为<span class="num">△</span><i class="m">BOC</i>与<span class="num">△</span><i class="m">AOC</i>同以<i class="m">OC</i>为底，且<i class="m">S</i><sub><span class="num">△</span><i class="m">BOC</i></sub><span class="num">=2</span><i class="m">S</i><sub><span class="num">△</span><i class="m">AOC</i></sub>，所以高之比<i class="m">BN</i><span class="num">:</span><i class="m">AM</i><span class="num">=2:1</span>．</span></div>',
        '<div class="step step-locked"><b>02</b><span><b>步骤<span class="num">2</span>（八字相似求相似比）：</b>因为<i class="m">AM</i><span class="num">⊥</span><i class="m">x</i>轴，<i class="m">BN</i><span class="num">⊥</span><i class="m">x</i>轴，且<span class="num">∠</span><i class="m">AOM</i><span class="num">=∠</span><i class="m">BON</i>，所以<span class="num">Rt△</span><i class="m">AOM</i><span class="num">∽Rt△</span><i class="m">BON</i>，相似比为<span class="math"><span class="fraction"><span><i class="m">BN</i></span><span><i class="m">AM</i></span></span><span class="num">=2:1</span></span>．</span></div>',
        '<div class="step step-locked"><b>03</b><span><b>步骤<span class="num">3</span>（面积比等于相似比平方）：</b>由相似三角形性质知<span class="math"><span class="fraction"><span><i class="m">S</i><sub><span class="num">△</span><i class="m">BON</i></sub></span><span><i class="m">S</i><sub><span class="num">△</span><i class="m">AOM</i></sub></span></span><span class="num">=2</span><sup><span class="num">2</span></sup><span class="num">=4</span></span>．又<span class="math"><i class="m">S</i><sub><span class="num">△</span><i class="m">AOM</i></sub><span class="num">=</span><span class="fraction"><span><span class="num">1</span></span><span><span class="num">2</span></span></span><span class="num">×1=</span><span class="fraction"><span><span class="num">1</span></span><span><span class="num">2</span></span></span></span>，故<span class="math"><i class="m">S</i><sub><span class="num">△</span><i class="m">BON</i></sub><span class="num">=4×</span><span class="fraction"><span><span class="num">1</span></span><span><span class="num">2</span></span></span><span class="num">=2=</span><span class="fraction"><span><span class="num">1</span></span><span><span class="num">2</span></span></span><span class="num">|</span><i class="m">k</i><span class="num">|</span></span>，第一象限<i class="m">k</i><span class="num">&gt;0</span>，解得<i class="m">k</i><span class="num">=4</span>．</span></div>'
      ]
    },
    {
      phase: 3,
      navTag: "训练3·双点面积转化",
      section: "分层训练",
      title: "第<span class='num'>3</span>题：一次函数与反比例函数中的面积等量转化",
      layout: "layout-b",
      sim: "train3Sim",
      maxStep: 4,
      stem: '<p><span class="num">3．</span>如图，一次函数<i class="m">y</i><span class="num">=-</span><i class="m">x</i><span class="num">+</span><i class="m">b</i>与反比例函数<span class="math"><i class="m">y</i><span class="num">=</span><span class="fraction"><span><span class="num">4</span></span><span><i class="m">x</i></span></span></span>（<i class="m">x</i><span class="num">&gt;0</span>）的图象交于<i class="m">A</i>，<i class="m">B</i>两点，与<i class="m">x</i>轴、<i class="m">y</i>轴分别交于<i class="m">C</i>，<i class="m">D</i>两点，连接<i class="m">OA</i>，<i class="m">OB</i>，过点<i class="m">A</i>作<i class="m">AE</i><span class="num">⊥</span><i class="m">x</i>轴于点<i class="m">E</i>，交<i class="m">OB</i>于点<i class="m">F</i>，设点<i class="m">A</i>的横坐标为<i class="m">m</i>．若<i class="m">S</i><sub><span class="num">△</span><i class="m">OAF</i></sub><span class="num">+</span><i class="m">S</i><sub>四边形<i class="m">EFBC</i></sub><span class="num">=4</span>，则<i class="m">m</i>的值是<span class="screen-blank" data-step="4" data-ans="<span class=\'num\'>√</span><span style=\'text-decoration:overline;\'><span class=\'num\'>2</span></span>"></span>．</p>',
      notes: [
        '<div class="step step-locked"><b>01</b><span><b>步骤<span class="num">1</span>（求基准面积）：</b>点<i class="m">A</i>在<span class="math"><i class="m">y</i><span class="num">=</span><span class="fraction"><span><span class="num">4</span></span><span><i class="m">x</i></span></span></span>上且<i class="m">AE</i><span class="num">⊥</span><i class="m">x</i>轴，故<i class="m">S</i><sub><span class="num">△</span><i class="m">OAE</i></sub><span class="num">=</span><i class="m">S</i><sub><span class="num">△</span><i class="m">OAF</i></sub><span class="num">+</span><i class="m">S</i><sub><span class="num">△</span><i class="m">OEF</i></sub><span class="num">=</span><span class="math"><span class="fraction"><span><span class="num">1</span></span><span><span class="num">2</span></span></span></span><span class="num">×4=2</span>．</span></div>',
        '<div class="step step-locked"><b>02</b><span><b>步骤<span class="num">2</span>（面积消元化简）：</b>由<i class="m">S</i><sub><span class="num">△</span><i class="m">OAF</i></sub><span class="num">+</span><i class="m">S</i><sub>四边形<i class="m">EFBC</i></sub><span class="num">=4</span>，代入<i class="m">S</i><sub><span class="num">△</span><i class="m">OAF</i></sub><span class="num">=2-</span><i class="m">S</i><sub><span class="num">△</span><i class="m">OEF</i></sub>与<i class="m">S</i><sub>四边形<i class="m">EFBC</i></sub><span class="num">=</span><i class="m">S</i><sub><span class="num">△</span><i class="m">OBC</i></sub><span class="num">-</span><i class="m">S</i><sub><span class="num">△</span><i class="m">OEF</i></sub>，化简得<i class="m">S</i><sub><span class="num">△</span><i class="m">OBC</i></sub><span class="num">-2</span><i class="m">S</i><sub><span class="num">△</span><i class="m">OEF</i></sub><span class="num">=2</span>．</span></div>',
        '<div class="step step-locked"><b>03</b><span><b>步骤<span class="num">3</span>（对称表出坐标）：</b>将<i class="m">A</i><span class="num">(</span><i class="m">m</i><span class="num">,</span><span class="math"><span class="fraction"><span><span class="num">4</span></span><span><i class="m">m</i></span></span></span><span class="num">)</span>代入<i class="m">y</i><span class="num">=-</span><i class="m">x</i><span class="num">+</span><i class="m">b</i>得<i class="m">b</i><span class="num">=</span><i class="m">m</i><span class="num">+</span><span class="math"><span class="fraction"><span><span class="num">4</span></span><span><i class="m">m</i></span></span></span>，故<i class="m">OC</i><span class="num">=</span><i class="m">m</i><span class="num">+</span><span class="math"><span class="fraction"><span><span class="num">4</span></span><span><i class="m">m</i></span></span></span>（<span class="num">△</span><i class="m">AEC</i>为等腰直角三角形，<i class="m">EC</i><span class="num">=</span><i class="m">AE</i><span class="num">=</span><span class="math"><span class="fraction"><span><span class="num">4</span></span><span><i class="m">m</i></span></span></span>）．由对称性知点<i class="m">B</i>坐标为<span class="num">(</span><span class="math"><span class="fraction"><span><span class="num">4</span></span><span><i class="m">m</i></span></span></span><span class="num">,</span><i class="m">m</i><span class="num">)</span>．</span></div>',
        '<div class="step step-locked"><b>04</b><span><b>步骤<span class="num">4</span>（列方程求<i class="m">m</i>）：</b><i class="m">S</i><sub><span class="num">△</span><i class="m">OBC</i></sub><span class="num">=</span><span class="math"><span class="fraction"><span><span class="num">1</span></span><span><span class="num">2</span></span></span></span><i class="m">OC</i><span class="num">·</span><i class="m">y</i><sub><i class="m">B</i></sub><span class="num">=</span><span class="math"><span class="fraction"><span><span class="num">1</span></span><span><span class="num">2</span></span></span></span><i class="m">m</i><sup><span class="num">2</span></sup><span class="num">+2</span>；直线<i class="m">OB</i>为<span class="math"><i class="m">y</i><span class="num">=</span><span class="fraction"><span><i class="m">m</i><sup><span class="num">2</span></sup></span><span><span class="num">4</span></span></span><i class="m">x</i></span>，得<i class="m">F</i><span class="num">(</span><i class="m">m</i><span class="num">,</span><span class="math"><span class="fraction"><span><i class="m">m</i><sup><span class="num">3</span></sup></span><span><span class="num">4</span></span></span></span><span class="num">)</span>，<i class="m">S</i><sub><span class="num">△</span><i class="m">OEF</i></sub><span class="num">=</span><span class="math"><span class="fraction"><span><i class="m">m</i><sup><span class="num">4</span></sup></span><span><span class="num">8</span></span></span></span>．代入得<span class="num">(</span><span class="math"><span class="fraction"><span><span class="num">1</span></span><span><span class="num">2</span></span></span></span><i class="m">m</i><sup><span class="num">2</span></sup><span class="num">+2)-2×</span><span class="math"><span class="fraction"><span><i class="m">m</i><sup><span class="num">4</span></sup></span><span><span class="num">8</span></span></span></span><span class="num">=2</span>，化简得<i class="m">m</i><sup><span class="num">2</span></sup><span class="num">(2-</span><i class="m">m</i><sup><span class="num">2</span></sup><span class="num">)=0</span>．因<i class="m">m</i><span class="num">&gt;0</span>，故<i class="m">m</i><span class="num">=√</span><span style="text-decoration:overline;"><span class="num">2</span></span>．</span></div>'
      ]
    },
    {
      phase: 3,
      navTag: "课堂小结",
      section: "课堂小结",
      title: "课堂小结：反比例函数中“<i class='m'>k</i>”的几何意义四大核心模型",
      layout: "layout-b",
      sim: "summarySim",
      maxStep: 4,
      stem: '<p><b>核心思想：</b>以<span class="math"><i class="m">S</i><sub>矩形</sub><span class="num">=|</span><i class="m">k</i><span class="num">|</span></span>与<span class="math"><i class="m">S</i><sub><span class="num">△</span></sub><span class="num">=</span><span class="fraction"><span><span class="num">1</span></span><span><span class="num">2</span></span></span><span class="num">|</span><i class="m">k</i><span class="num">|</span></span>为基准，通过<b>等积变形（拉窗帘）</b>、<b>公共部分消去（蝴蝶转梯形）</b>、<b>中心对称倍增</b>与<b>双曲线同减异加</b>解决面积问题，反求<i class="m">k</i>时切记<b>由象限定正负</b>！</p>',
      notes: [
        '<div class="step step-locked"><b>01</b><span><b>模型<span class="num">1</span>（单曲线与拉窗帘）：</b>一点一垂线<span class="math"><i class="m">S</i><sub><span class="num">△</span></sub><span class="num">=</span><span class="fraction"><span><span class="num">1</span></span><span><span class="num">2</span></span></span><span class="num">|</span><i class="m">k</i><span class="num">|</span></span>，一点两垂线<span class="math"><i class="m">S</i><sub>矩形</sub><span class="num">=|</span><i class="m">k</i><span class="num">|</span></span>；平行于坐标轴移动三角形顶点（拉窗帘），同底等高面积不变．</span></div>',
        '<div class="step step-locked"><b>02</b><span><b>模型<span class="num">2</span>（中心对称倍增）：</b>过原点直线交同一双曲线得对称点，面积成倍递增（直角三角形<span class="num">|</span><i class="m">k</i><span class="num">|</span>、对称平行四边形<span class="num">2|</span><i class="m">k</i><span class="num">|</span>）．</span></div>',
        '<div class="step step-locked"><b>03</b><span><b>模型<span class="num">3</span>（单曲线双点转梯形）：</b>同支两点作同轴垂线，消去公共三角形得“蝴蝶等积”<i class="m">S</i><sub><span class="num">△</span><i class="m">AOE</i></sub><span class="num">=</span><i class="m">S</i><sub>四边形<i class="m">BECD</i></sub>，且<i class="m">S</i><sub><span class="num">△</span><i class="m">AOC</i></sub><span class="num">=</span><i class="m">S</i><sub>直角梯形<i class="m">ABDC</i></sub>．</span></div>',
        '<div class="step step-locked"><b>04</b><span><b>模型<span class="num">4</span>（双反比例函数与定号）：</b>两条双曲线共垂线时，<i class="m">k</i>同号面积相减（<span class="num">|</span><i class="m">k</i><sub><span class="num">1</span></sub><span class="num">|-|</span><i class="m">k</i><sub><span class="num">2</span></sub><span class="num">|</span>），<i class="m">k</i>异号面积相加（<span class="num">|</span><i class="m">k</i><sub><span class="num">1</span></sub><span class="num">|+|</span><i class="m">k</i><sub><span class="num">2</span></sub><span class="num">|</span>）；<b>易错警示</b>：已知面积反求<i class="m">k</i>时，必须根据图象所在象限确定<i class="m">k</i>的正负号！</span></div>'
      ]
    }
  ];

  slides.forEach(function (s) {
    s.lesson = 1;
    var notesHtml = Array.isArray(s.notes) ? s.notes.join('') : s.notes;
    s.html =
      '<div class="screen-page lab-visible">' +
      '<div class="screen-stem">' + s.stem + '</div>' +
      '<div class="screen-lower ' + (s.layout || 'layout-b') + '">' +
      '<div class="screen-notes"><div id="controls" class="controls"></div>' + notesHtml + '</div>' +
      '<div class="screen-media"><div class="screen-lab"><div id="scene" class="visual sim-Host" style="padding:10px;align-items:stretch;justify-content:center;"></div></div></div>' +
      '</div></div>';
    window.UNIT1_THEOREM_SLIDES.push(s);
  });

  // =========================================================================
  // SIM 1: train1Sim (2026 四川攀枝花 · 异号拉窗帘求 k)
  // =========================================================================
  window.UNIT1_SIMS.train1Sim = {
    init: function (state) {
      state.step = 0;
      state.maxStep = 3;
      state.cx = 1.5;
      state.yD = 1.6;
      if (typeof clearManualOverrides === "function") clearManualOverrides(state);
    },
    render: function (state) {
      var root = typeof activeRoot === "function" ? activeRoot() : null;
      if (!root) return;
      var host = root.querySelector("#scene") || root.querySelector(".sim-Host");
      if (!host) return;

      var step = Number(state.step || 0);
      if (typeof isManualOverride === "function" && !isManualOverride(state, "cx")) {
        state.cx = step >= 1 ? 0 : 1.5;
      }
      var yD = Number(state.yD || 1.6);
      var cx = Number(state.cx !== undefined ? state.cx : (step >= 1 ? 0 : 1.5));

      var ox = 250, oy = 255, sc = 42;
      var xA = 2 / yD;
      var xB = -4 / yD;

      var pxA = ox + xA * sc, pyA = oy - yD * sc;
      var pxB = ox + xB * sc, pyB = oy - yD * sc;
      var pxD = ox, pyD = oy - yD * sc;
      var pxC = ox + cx * sc, pyC = oy;

      var path1 = "";
      for (var x = 0.45; x <= 4.6; x += 0.08) {
        var y = 2 / x;
        var sx = (ox + x * sc).toFixed(1);
        var sy = (oy - y * sc).toFixed(1);
        path1 += (path1 ? " L " : "M ") + sx + " " + sy;
      }

      var path2 = "";
      for (var x2 = -5.2; x2 <= -0.88; x2 += 0.08) {
        var y2 = -4 / x2;
        var sx2 = (ox + x2 * sc).toFixed(1);
        var sy2 = (oy - y2 * sc).toFixed(1);
        path2 += (path2 ? " L " : "M ") + sx2 + " " + sy2;
      }

      var svg = '<svg viewBox="0 0 480 360" style="width:100%;height:100%;max-height:100%;display:block;">';
      svg += '<defs><marker id="t1-arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 1 L 10 5 L 0 9 z" fill="#334155"/></marker></defs>';

      for (var gx = -5; gx <= 4; gx++) {
        if (gx === 0) continue;
        var gpx = ox + gx * sc;
        svg += '<line x1="' + gpx + '" y1="25" x2="' + gpx + '" y2="310" stroke="#f1f5f9" stroke-width="1"/>';
      }
      for (var gy = -1; gy <= 5; gy++) {
        if (gy === 0) continue;
        var gpy = oy - gy * sc;
        svg += '<line x1="25" y1="' + gpy + '" x2="455" y2="' + gpy + '" stroke="#f1f5f9" stroke-width="1"/>';
      }

      svg += '<line x1="20" y1="' + oy + '" x2="460" y2="' + oy + '" stroke="#334155" stroke-width="1.8" marker-end="url(#t1-arr)"/>';
      svg += '<line x1="' + ox + '" y1="320" x2="' + ox + '" y2="20" stroke="#334155" stroke-width="1.8" marker-end="url(#t1-arr)"/>';
      svg += '<text x="455" y="' + (oy + 18) + '" font-family="Times New Roman" font-style="italic" font-size="14" font-weight="700" fill="#1e293b" stroke="#ffffff" stroke-width="3.5" paint-order="stroke">x</text>';
      svg += '<text x="' + (ox + 12) + '" y="28" font-family="Times New Roman" font-style="italic" font-size="14" font-weight="700" fill="#1e293b" stroke="#ffffff" stroke-width="3.5" paint-order="stroke">y</text>';
      svg += '<text x="' + (ox - 14) + '" y="' + (oy + 16) + '" font-family="Times New Roman" font-style="italic" font-size="13" font-weight="700" fill="#1e293b" stroke="#ffffff" stroke-width="3.5" paint-order="stroke">O</text>';

      if (step >= 2) {
        svg += '<polygon points="' + pxB + ',' + pyB + ' ' + pxD + ',' + pyD + ' ' + ox + ',' + oy + '" fill="rgba(245, 158, 11, 0.28)" stroke="#d97706" stroke-width="1.8"/>';
        svg += '<polygon points="' + pxA + ',' + pyA + ' ' + pxD + ',' + pyD + ' ' + ox + ',' + oy + '" fill="rgba(16, 185, 129, 0.28)" stroke="#059669" stroke-width="1.8"/>';
      }

      var polyFill = step >= 2 ? "rgba(59, 130, 246, 0.10)" : "rgba(59, 130, 246, 0.22)";
      svg += '<polygon points="' + pxA + ',' + pyA + ' ' + pxB + ',' + pyB + ' ' + pxC + ',' + pyC + '" fill="' + polyFill + '" stroke="#2563eb" stroke-width="2"/>';

      if (step >= 1) {
        svg += '<line x1="' + ox + '" y1="' + oy + '" x2="' + pxA + '" y2="' + pyA + '" stroke="#ef4444" stroke-width="2.2" stroke-dasharray="6,4"/>';
        svg += '<line x1="' + ox + '" y1="' + oy + '" x2="' + pxB + '" y2="' + pyB + '" stroke="#ef4444" stroke-width="2.2" stroke-dasharray="6,4"/>';
        svg += '<polyline points="' + (pxD + 8) + ',' + pyD + ' ' + (pxD + 8) + ',' + (pyD + 8) + ' ' + pxD + ',' + (pyD + 8) + '" fill="none" stroke="#64748b" stroke-width="1.4"/>';
      }

      svg += '<path d="' + path1 + '" fill="none" stroke="#0284c7" stroke-width="2.6"/>';
      svg += '<path d="' + path2 + '" fill="none" stroke="#7c3aed" stroke-width="2.6"/>';

      svg += svgTextHalo(374, 75, 'y=', { size: 13, fill: '#0284c7' });
      svg += svgFrac(395, 71, "2", "x", "#0284c7", 12);

      var kLabelNum = step >= 3 ? "-4" : "k";
      svg += svgTextHalo(76, 68, 'y=', { size: 13, fill: '#7c3aed' });
      svg += svgFrac(97, 64, kLabelNum, "x", "#7c3aed", 12);

      if (step >= 2) {
        var cxADO = (pxA + pxD + ox) / 3 + 6;
        var cyADO = (pyA + pyD + oy) / 3 + 4;
        var cxBDO = (pxB + pxD + ox) / 3 - 8;
        var cyBDO = (pyB + pyD + oy) / 3 + 4;
        svg += '<text x="' + cxADO + '" y="' + cyADO + '" text-anchor="middle" font-size="12" font-weight="700" fill="#047857" stroke="#ffffff" stroke-width="3.5" paint-order="stroke">S=1</text>';
        svg += '<text x="' + cxBDO + '" y="' + cyBDO + '" text-anchor="middle" font-size="12" font-weight="700" fill="#b45309" stroke="#ffffff" stroke-width="3.5" paint-order="stroke">S=2</text>';
      }

      svg += '<circle cx="' + pxA + '" cy="' + pyA + '" r="4.5" fill="#0284c7" stroke="#ffffff" stroke-width="1.5"/>';
      svg += '<text x="' + (pxA + 8) + '" y="' + (pyA - 6) + '" font-family="Times New Roman" font-style="italic" font-size="14" font-weight="700" fill="#0284c7" stroke="#ffffff" stroke-width="3.5" paint-order="stroke">A</text>';

      svg += '<circle cx="' + pxB + '" cy="' + pyB + '" r="4.5" fill="#7c3aed" stroke="#ffffff" stroke-width="1.5"/>';
      svg += '<text x="' + (pxB - 18) + '" y="' + (pyB - 6) + '" font-family="Times New Roman" font-style="italic" font-size="14" font-weight="700" fill="#7c3aed" stroke="#ffffff" stroke-width="3.5" paint-order="stroke">B</text>';

      svg += '<circle cx="' + pxD + '" cy="' + pyD + '" r="4" fill="#334155" stroke="#ffffff" stroke-width="1.5"/>';
      svg += '<text x="' + (pxD + 6) + '" y="' + (pyD - 6) + '" font-family="Times New Roman" font-style="italic" font-size="13" font-weight="700" fill="#334155" stroke="#ffffff" stroke-width="3.5" paint-order="stroke">D</text>';

      svg += '<circle cx="' + pxC + '" cy="' + pyC + '" r="5" fill="#2563eb" stroke="#ffffff" stroke-width="1.5"/>';
      svg += '<text x="' + (pxC + 4) + '" y="' + (pyC + 18) + '" font-family="Times New Roman" font-style="italic" font-size="14" font-weight="700" fill="#2563eb" stroke="#ffffff" stroke-width="3.5" paint-order="stroke">C</text>';

      var bannerText = "原题状态：S△ABC = 3，AB ∥ x轴";
      if (step === 1) bannerText = "第一步（拉窗帘）：点 C 移至原点 O，S△ABO = S△ABC = 3";
      if (step === 2) bannerText = "第二步（分割）：S△ADO = 1，S△BDO = 3 - 1 = 2";
      if (step === 3) bannerText = "第三步（定号）：|k| = 4，第二象限 k &lt; 0 ⇒ k = -4";

      svg += '<rect x="16" y="12" width="335" height="26" rx="6" fill="rgba(255,255,255,0.92)" stroke="#cbd5e1" stroke-width="1"/>';
      svg += '<text x="26" y="29" font-size="12" font-weight="700" fill="#1e293b">' + bannerText + '</text>';
      svg += '</svg>';

      var controlsEl = root.querySelector("#controls");
      if (controlsEl && typeof stepBar === "function") {
        controlsEl.innerHTML = stepBar(step, 3) + (step >= 1
          ? slider("cx", "拖动点<i class='m'>C</i>（拉窗帘等积）", -2.5, 2.5, cx, 0.1) +
            slider("yD", "水平线<i class='m'>AB</i>高度", 1.1, 2.5, yD, 0.1)
          : "");
      }
      host.innerHTML = svg;
    }
  };

  // =========================================================================
  // SIM 2: train2Sim (第2题：过原点的双曲线三角形与“八字相似”求 k = 4)
  // =========================================================================
  window.UNIT1_SIMS.train2Sim = {
    init: function (state) {
      state.step = 0;
      state.maxStep = 3;
      if (typeof clearManualOverrides === "function") clearManualOverrides(state);
    },
    render: function (state) {
      var root = typeof activeRoot === "function" ? activeRoot() : null;
      if (!root) return;
      var host = root.querySelector("#scene") || root.querySelector(".sim-Host");
      if (!host) return;

      var step = Number(state.step || 0);
      var ox = 185, oy = 185;
      var s = 48;
      var toX = function (x) { return ox + x * s; };
      var toY = function (y) { return oy - y * s; };

      var ax = -1.0, ay = -1.0;
      var bx = 2.0, by = 2.0;
      var cx = 3.2, cy = 0;

      var Ax = toX(ax), Ay = toY(ay);
      var Bx = toX(bx), By = toY(by);
      var Cx = toX(cx), Cy = toY(cy);
      var Mx = toX(ax), My = oy;
      var Nx = toX(bx), Ny = oy;

      var curveA = [];
      for (var i = 0; i <= 70; i++) {
        var x1 = -3.3 + (( -0.32 - (-3.3)) * i) / 70;
        var y1 = 1 / x1;
        if (y1 >= -3.3 && y1 <= 0) curveA.push(toX(x1).toFixed(1) + "," + toY(y1).toFixed(1));
      }
      var curveB = [];
      for (var j = 0; j <= 70; j++) {
        var x2 = 1.25 + ((5.2 - 1.25) * j) / 70;
        var y2 = 4 / x2;
        if (y2 >= 0 && y2 <= 3.3) curveB.push(toX(x2).toFixed(1) + "," + toY(y2).toFixed(1));
      }

      var svg = '<svg viewBox="0 0 480 360" style="width:100%;height:100%;max-height:100%;display:block;">';
      svg += '<defs><marker id="arr-t2" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#334155"/></marker></defs>';

      if (step === 1) {
        svg += '<polygon points="' + ox + ',' + oy + ' ' + Bx.toFixed(1) + ',' + By.toFixed(1) + ' ' + Cx.toFixed(1) + ',' + Cy.toFixed(1) + '" fill="rgba(59, 130, 246, 0.14)" stroke="none"/>';
        svg += '<polygon points="' + ox + ',' + oy + ' ' + Ax.toFixed(1) + ',' + Ay.toFixed(1) + ' ' + Cx.toFixed(1) + ',' + Cy.toFixed(1) + '" fill="rgba(245, 158, 11, 0.14)" stroke="none"/>';
      }

      if (step >= 2) {
        svg += '<polygon points="' + ox + ',' + oy + ' ' + Ax.toFixed(1) + ',' + Ay.toFixed(1) + ' ' + Mx.toFixed(1) + ',' + My.toFixed(1) + '" fill="rgba(245, 158, 11, 0.32)" stroke="#d97706" stroke-width="1.8"/>';
        svg += '<polygon points="' + ox + ',' + oy + ' ' + Bx.toFixed(1) + ',' + By.toFixed(1) + ' ' + Nx.toFixed(1) + ',' + Ny.toFixed(1) + '" fill="rgba(16, 185, 129, 0.28)" stroke="#059669" stroke-width="1.8"/>';
      }

      svg += '<line x1="20" y1="' + oy + '" x2="455" y2="' + oy + '" stroke="#334155" stroke-width="1.8" marker-end="url(#arr-t2)"/>';
      svg += '<line x1="' + ox + '" y1="340" x2="' + ox + '" y2="20" stroke="#334155" stroke-width="1.8" marker-end="url(#arr-t2)"/>';
      svg += svgTextHalo(450, oy + 20, 'x', { italic: true, size: 16 });
      svg += svgTextHalo(ox - 16, 28, 'y', { italic: true, size: 16 });
      svg += svgTextHalo(ox - 14, oy - 8, 'O', { italic: true, size: 15 });

      svg += '<line x1="' + Ax.toFixed(1) + '" y1="' + Ay.toFixed(1) + '" x2="' + Bx.toFixed(1) + '" y2="' + By.toFixed(1) + '" stroke="#0f172a" stroke-width="2.2"/>';
      svg += '<line x1="' + Bx.toFixed(1) + '" y1="' + By.toFixed(1) + '" x2="' + Cx.toFixed(1) + '" y2="' + Cy.toFixed(1) + '" stroke="#0f172a" stroke-width="2"/>';
      svg += '<line x1="' + Ax.toFixed(1) + '" y1="' + Ay.toFixed(1) + '" x2="' + Cx.toFixed(1) + '" y2="' + Cy.toFixed(1) + '" stroke="#0f172a" stroke-width="2"/>';

      if (step >= 1) {
        svg += '<line x1="' + Ax.toFixed(1) + '" y1="' + Ay.toFixed(1) + '" x2="' + Mx.toFixed(1) + '" y2="' + My.toFixed(1) + '" stroke="#d97706" stroke-width="2.2" stroke-dasharray="5,3"/>';
        svg += '<line x1="' + Bx.toFixed(1) + '" y1="' + By.toFixed(1) + '" x2="' + Nx.toFixed(1) + '" y2="' + Ny.toFixed(1) + '" stroke="#059669" stroke-width="2.2" stroke-dasharray="5,3"/>';
        svg += '<polyline points="' + (Mx + 8).toFixed(1) + ',' + My.toFixed(1) + ' ' + (Mx + 8).toFixed(1) + ',' + (My + 8).toFixed(1) + ' ' + Mx.toFixed(1) + ',' + (My + 8).toFixed(1) + '" fill="none" stroke="#d97706" stroke-width="1.5"/>';
        svg += '<polyline points="' + (Nx - 8).toFixed(1) + ',' + Ny.toFixed(1) + ' ' + (Nx - 8).toFixed(1) + ',' + (Ny - 8).toFixed(1) + ' ' + Nx.toFixed(1) + ',' + (Ny - 8).toFixed(1) + '" fill="none" stroke="#059669" stroke-width="1.5"/>';
        svg += '<circle cx="' + Mx.toFixed(1) + '" cy="' + My.toFixed(1) + '" r="4" fill="#d97706" stroke="#fff" stroke-width="1.5"/>';
        svg += '<circle cx="' + Nx.toFixed(1) + '" cy="' + Ny.toFixed(1) + '" r="4" fill="#059669" stroke="#fff" stroke-width="1.5"/>';
        svg += svgTextHalo(Mx, My - 8, 'M', { italic: true, size: 15, fill: '#b45309' });
        svg += svgTextHalo(Nx - 10, Ny + 18, 'N', { italic: true, size: 15, fill: '#047857' });
      }

      svg += '<polyline points="' + curveA.join(' ') + '" fill="none" stroke="#6366f1" stroke-width="2.5" stroke-linecap="round"/>';
      svg += '<polyline points="' + curveB.join(' ') + '" fill="none" stroke="#2563eb" stroke-width="2.6" stroke-linecap="round"/>';

      svg += svgTextHalo(66, 276, 'y=', { size: 14, fill: '#4f46e5' });
      svg += svgFrac(84, 272, "1", "x", "#4f46e5", 13);

      svg += svgTextHalo(356, 100, 'y=', { size: 14, fill: step >= 3 ? '#047857' : '#1d4ed8' });
      svg += svgFrac(374, 96, step >= 3 ? "4" : "k", "x", step >= 3 ? "#047857" : "#1d4ed8", 13);

      if (step === 1) {
        svg += svgTextHalo(105, 52, '同底OC，面积比2:1', { size: 13.5, fill: '#0f172a' });
        svg += svgTextHalo(105, 74, '⇒ 高之比BN:AM=2:1', { size: 13.5, fill: '#047857' });
      } else if (step === 2) {
        svg += svgTextHalo(108, 52, '八字相似：△AOM∽△BON', { size: 13.5, fill: '#b45309' });
        svg += svgTextHalo(108, 74, '相似比OB:OA=BN:AM=2:1', { size: 13.5, fill: '#047857' });
      } else if (step >= 3) {
        svg += svgTextHalo(115, 46, '面积比S△BON:S△AOM=2²=4:1', { size: 13.5, fill: '#1e40af' });
        svg += window.svgFoLabel(14, 54, 215, 34,
          '<span class="math"><i class="m">S</i><sub><span class="num">△</span><i class="m">AOM</i></sub><span class="num">=</span><span class="fraction"><span><span class="num">1</span></span><span><span class="num">2</span></span></span><span class="num"> ⇒ </span><i class="m">S</i><sub><span class="num">△</span><i class="m">BON</i></sub><span class="num">=2 ⇒ </span><i class="m">k</i><span class="num">=4</span></span>',
          'font-size:12.5px; color:#047857;'
        );
        svg += window.svgFoLabel(Mx - 56, (My + Ay) / 2 - 14, 52, 32,
          '<span class="math"><i class="m">S</i><span class="num">=</span><span class="fraction"><span><span class="num">1</span></span><span><span class="num">2</span></span></span></span>',
          'font-size:12px; color:#b45309;'
        );
        svg += svgTextHalo(Nx - 26, (Ny + By) / 2 + 12, 'S=2', { size: 13, fill: '#047857' });
      }

      svg += '<circle cx="' + Ax.toFixed(1) + '" cy="' + Ay.toFixed(1) + '" r="4.5" fill="#4f46e5" stroke="#fff" stroke-width="1.8"/>';
      svg += '<circle cx="' + Bx.toFixed(1) + '" cy="' + By.toFixed(1) + '" r="4.5" fill="#1e40af" stroke="#fff" stroke-width="1.8"/>';
      svg += '<circle cx="' + Cx.toFixed(1) + '" cy="' + Cy.toFixed(1) + '" r="4" fill="#334155" stroke="#fff" stroke-width="1.8"/>';

      svg += svgTextHalo(Ax - 14, Ay + 16, 'A', { italic: true, size: 16 });
      svg += svgTextHalo(Bx + 4, By - 10, 'B', { italic: true, size: 16 });
      svg += svgTextHalo(Cx + 10, Cy + 18, 'C', { italic: true, size: 16 });
      svg += '</svg>';

      var controlsEl = root.querySelector("#controls");
      if (controlsEl && typeof stepBar === "function") {
        controlsEl.innerHTML = stepBar(step, 3);
      }
      host.innerHTML = svg;
    }
  };

  // =========================================================================
  // SIM 3: train3Sim (第3题：一次函数与反比例函数双点面积转化 m = √2)
  // =========================================================================
  window.UNIT1_SIMS.train3Sim = {
    init: function (state) {
      state.step = 0;
      state.maxStep = 4;
      state.m = 1.414;
      if (typeof clearManualOverrides === "function") clearManualOverrides(state);
    },
    render: function (state) {
      var root = typeof activeRoot === "function" ? activeRoot() : null;
      if (!root) return;
      var host = root.querySelector("#scene") || root.querySelector(".sim-Host");
      if (!host) return;

      var step = Number(state.step || 0);
      var m = Number(state.m || 1.414);
      var ox = 55, oy = 310, sc = 52;
      var yA = 4 / m;
      var b = m + yA;
      var xB = yA, yB = m;
      var yF = (m * m * m) / 4;

      var pxO = ox, pyO = oy;
      var pxA = ox + m * sc, pyA = oy - yA * sc;
      var pxB = ox + xB * sc, pyB = oy - yB * sc;
      var pxC = ox + b * sc, pyC = oy;
      var pxD = ox, pyD = oy - b * sc;
      var pxE = ox + m * sc, pyE = oy;
      var pxF = ox + m * sc, pyF = oy - yF * sc;

      var hPath = "";
      for (var x = 0.82; x <= 6.2; x += 0.08) {
        var y = 4 / x;
        var sx = (ox + x * sc).toFixed(1);
        var sy = (oy - y * sc).toFixed(1);
        hPath += (hPath ? " L " : "M ") + sx + " " + sy;
      }

      var svg = '<svg viewBox="0 0 480 360" style="width:100%;height:100%;max-height:100%;display:block;">';
      svg += '<defs><marker id="t3-arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 1 L 10 5 L 0 9 z" fill="#334155"/></marker></defs>';

      for (var gx = 1; gx <= 7; gx++) {
        var gpx = ox + gx * sc;
        svg += '<line x1="' + gpx + '" y1="15" x2="' + gpx + '" y2="' + oy + '" stroke="#f1f5f9" stroke-width="1"/>';
      }
      for (var gy = 1; gy <= 5; gy++) {
        var gpy = oy - gy * sc;
        svg += '<line x1="' + ox + '" y1="' + gpy + '" x2="455" y2="' + gpy + '" stroke="#f1f5f9" stroke-width="1"/>';
      }

      svg += '<line x1="25" y1="' + oy + '" x2="462" y2="' + oy + '" stroke="#334155" stroke-width="1.8" marker-end="url(#t3-arr)"/>';
      svg += '<line x1="' + ox + '" y1="335" x2="' + ox + '" y2="15" stroke="#334155" stroke-width="1.8" marker-end="url(#t3-arr)"/>';
      svg += '<text x="456" y="' + (oy + 18) + '" font-family="Times New Roman" font-style="italic" font-size="14" font-weight="700" fill="#1e293b" stroke="#ffffff" stroke-width="3.5" paint-order="stroke">x</text>';
      svg += '<text x="' + (ox - 16) + '" y="24" font-family="Times New Roman" font-style="italic" font-size="14" font-weight="700" fill="#1e293b" stroke="#ffffff" stroke-width="3.5" paint-order="stroke">y</text>';
      svg += '<text x="' + (ox - 15) + '" y="' + (oy + 16) + '" font-family="Times New Roman" font-style="italic" font-size="13" font-weight="700" fill="#1e293b" stroke="#ffffff" stroke-width="3.5" paint-order="stroke">O</text>';

      svg += '<polygon points="' + pxO + ',' + pyO + ' ' + pxA + ',' + pyA + ' ' + pxF + ',' + pyF + '" fill="rgba(59, 130, 246, 0.28)" stroke="#2563eb" stroke-width="1.6"/>';
      svg += '<polygon points="' + pxE + ',' + pyE + ' ' + pxF + ',' + pyF + ' ' + pxB + ',' + pyB + ' ' + pxC + ',' + pyC + '" fill="rgba(245, 158, 11, 0.26)" stroke="#d97706" stroke-width="1.6"/>';

      if (step >= 1) {
        svg += '<polygon points="' + pxO + ',' + pyO + ' ' + pxE + ',' + pyE + ' ' + pxF + ',' + pyF + '" fill="rgba(16, 185, 129, 0.25)" stroke="#059669" stroke-width="1.5" stroke-dasharray="4,3"/>';
      }

      if (step >= 3) {
        svg += '<line x1="' + ox + '" y1="' + oy + '" x2="' + (ox + 230) + '" y2="' + (oy - 230) + '" stroke="#94a3b8" stroke-width="1.4" stroke-dasharray="5,4"/>';
        svg += '<text x="' + (ox + 195) + '" y="' + (oy - 202) + '" font-family="Times New Roman" font-style="italic" font-size="11" fill="#64748b" stroke="#ffffff" stroke-width="3" paint-order="stroke">y = x</text>';
        svg += '<path d="M ' + (pxC - 22) + ' ' + pyC + ' A 22 22 0 0 1 ' + (pxC - 15.5) + ' ' + (pyC - 15.5) + '" fill="none" stroke="#dc2626" stroke-width="1.6"/>';
        svg += '<text x="' + (pxC - 38) + '" y="' + (pyC - 6) + '" font-size="11" font-weight="700" fill="#dc2626" stroke="#ffffff" stroke-width="3" paint-order="stroke">45°</text>';
      }

      svg += '<line x1="' + pxD + '" y1="' + pyD + '" x2="' + (pxC + 20) + '" y2="' + (pyC + 20) + '" stroke="#334155" stroke-width="2"/>';
      svg += '<line x1="' + pxO + '" y1="' + pyO + '" x2="' + pxA + '" y2="' + pyA + '" stroke="#1e293b" stroke-width="1.8"/>';
      svg += '<line x1="' + pxO + '" y1="' + pyO + '" x2="' + pxB + '" y2="' + pyB + '" stroke="#1e293b" stroke-width="1.8"/>';
      svg += '<line x1="' + pxA + '" y1="' + pyA + '" x2="' + pxE + '" y2="' + pyE + '" stroke="#1e293b" stroke-width="1.8"/>';
      svg += '<polyline points="' + (pxE - 8) + ',' + pyE + ' ' + (pxE - 8) + ',' + (pyE - 8) + ' ' + pxE + ',' + (pyE - 8) + '" fill="none" stroke="#334155" stroke-width="1.3"/>';

      svg += '<path d="' + hPath + '" fill="none" stroke="#0284c7" stroke-width="2.5"/>';
      svg += svgTextHalo(363, 245, 'y=', { size: 13, fill: '#0284c7' });
      svg += svgFrac(383, 241, "4", "x", "#0284c7", 12);

      var pts = [
        { x: pxA, y: pyA, label: "A", dx: 6, dy: -6, c: "#0284c7" },
        { x: pxB, y: pyB, label: "B", dx: 8, dy: -4, c: "#0284c7" },
        { x: pxC, y: pyC, label: "C", dx: 4, dy: 16, c: "#1e293b" },
        { x: pxD, y: pyD, label: "D", dx: -16, dy: 4, c: "#1e293b" },
        { x: pxE, y: pyE, label: "E", dx: -4, dy: 16, c: "#1e293b" },
        { x: pxF, y: pyF, label: "F", dx: -15, dy: -4, c: "#d97706" }
      ];
      pts.forEach(function (p) {
        svg += '<circle cx="' + p.x + '" cy="' + p.y + '" r="4" fill="' + p.c + '" stroke="#ffffff" stroke-width="1.5"/>';
        svg += '<text x="' + (p.x + p.dx) + '" y="' + (p.y + p.dy) + '" font-family="Times New Roman" font-style="italic" font-size="13" font-weight="700" fill="' + p.c + '" stroke="#ffffff" stroke-width="3.5" paint-order="stroke">' + p.label + '</text>';
      });

      var sOAE = 2;
      var sOEF = (m * m * m * m) / 8;
      var sOAF = sOAE - sOEF;
      var sOBC = 0.5 * m * m + 2;
      var sEFBC = sOBC - sOEF;
      var sumArea = sOAF + sEFBC;

      svg += window.svgFoCard(234, 12, 236, 72,
        '<div style="font-size:11.5px; color:#1e293b;">当前点<i class="m">A</i>横坐标<i class="m">m</i><span class="num">=' + m.toFixed(3) + '</span></div>' +
        '<div style="font-size:11.5px; color:#2563eb;"><span class="math"><i class="m">S</i><sub><span class="num">△</span><i class="m">OAF</i></sub><span class="num">=' + sOAF.toFixed(2) + '</span></span>，<span class="math"><i class="m">S</i><sub>四边形<i class="m">EFBC</i></sub><span class="num">=' + sEFBC.toFixed(2) + '</span></span></div>' +
        '<div style="font-size:11.5px; color:' + (Math.abs(sumArea - 4) < 0.05 ? "#059669" : "#dc2626") + ';">面积和<span class="num">=' + sumArea.toFixed(2) + '</span>' +
        (Math.abs(sumArea - 4) < 0.05 ? '（恰好等于<span class="num">4</span>，<i class="m">m</i><span class="num">=√</span><span style="text-decoration:overline;"><span class="num">2</span></span>）' : '') + '</div>',
        'align-items:flex-start; padding:5px 10px;'
      );
      svg += '</svg>';

      var controlsEl = root.querySelector("#controls");
      if (controlsEl && typeof stepBar === "function") {
        controlsEl.innerHTML = stepBar(step, 4) +
          slider("m", "拖动点<i class='m'>A</i>横坐标<i class='m'>m</i>（<i class='m'>m</i><span class='num'>=√</span><span style='text-decoration:overline;'><span class='num'>2</span></span>时和为<span class='num'>4</span>）", 1.0, 1.8, m, 0.01);
      }
      host.innerHTML = svg;
    }
  };

  // =========================================================================
  // SIM 4: summarySim (课堂小结：四大核心模型全景速查卡片)
  // =========================================================================
  window.UNIT1_SIMS.summarySim = {
    init: function (state) {
      state.step = 0;
      state.maxStep = 4;
      if (typeof clearManualOverrides === "function") clearManualOverrides(state);
    },
    render: function (state) {
      var root = typeof activeRoot === "function" ? activeRoot() : null;
      if (!root) return;
      var host = root.querySelector("#scene") || root.querySelector(".sim-Host");
      if (!host) return;

      var step = Number(state.step || 0);

      function cardStyle(idx) {
        var active = step === 0 || step === idx;
        return {
          stroke: step === idx ? "#2563eb" : "#cbd5e1",
          sw: step === idx ? "2.4" : "1.2",
          bg: step === idx ? "#eff6ff" : "#ffffff",
          op: active ? "1" : "0.45"
        };
      }

      var c1 = cardStyle(1), c2 = cardStyle(2), c3 = cardStyle(3), c4 = cardStyle(4);

      var svg = '<svg viewBox="0 0 480 360" style="width:100%;height:100%;max-height:100%;display:block;">';

      // Card 1: Top-Left (模型1：单曲线基准与拉窗帘)
      svg += '<g opacity="' + c1.op + '">';
      svg += '<rect x="12" y="10" width="222" height="162" rx="8" fill="' + c1.bg + '" stroke="' + c1.stroke + '" stroke-width="' + c1.sw + '"/>';
      svg += '<text x="22" y="30" font-size="12.5" font-weight="700" fill="#1e40af">① 单曲线基准与拉窗帘</text>';
      svg += '<line x1="30" y1="138" x2="135" y2="138" stroke="#475569" stroke-width="1.4"/>';
      svg += '<line x1="40" y1="148" x2="40" y2="48" stroke="#475569" stroke-width="1.4"/>';
      svg += '<path d="M 52 55 Q 68 115 128 128" fill="none" stroke="#0284c7" stroke-width="2"/>';
      svg += '<rect x="40" y="78" width="38" height="60" fill="rgba(59,130,246,0.22)" stroke="#2563eb" stroke-width="1.3"/>';
      svg += '<polygon points="40,138 78,78 78,138" fill="rgba(16,185,129,0.28)" stroke="#059669" stroke-width="1.4"/>';
      svg += '<line x1="40" y1="78" x2="78" y2="78" stroke="#dc2626" stroke-width="1.4" stroke-dasharray="3,2"/>';
      svg += '<text x="142" y="78" font-size="11.5" font-weight="700" fill="#1e293b">S矩形 = |k|</text>';
      svg += '<text x="142" y="112" font-size="11.5" font-weight="700" fill="#059669">S△ =</text>';
      svg += svgFrac(180, 108, "1", "2", "#059669", 11);
      svg += '<text x="198" y="112" font-size="11.5" font-weight="700" fill="#059669">|k|</text>';
      svg += '<text x="24" y="160" font-size="11" fill="#475569">平行坐标轴移顶点，同底等高面积不变</text>';
      svg += '</g>';

      // Card 2: Top-Right (模型2：中心对称倍增)
      svg += '<g opacity="' + c2.op + '">';
      svg += '<rect x="246" y="10" width="222" height="162" rx="8" fill="' + c2.bg + '" stroke="' + c2.stroke + '" stroke-width="' + c2.sw + '"/>';
      svg += '<text x="256" y="30" font-size="12.5" font-weight="700" fill="#1e40af">② 中心对称倍增模型</text>';
      svg += '<line x1="258" y1="94" x2="362" y2="94" stroke="#475569" stroke-width="1.4"/>';
      svg += '<line x1="310" y1="144" x2="310" y2="44" stroke="#475569" stroke-width="1.4"/>';
      svg += '<path d="M 320 52 Q 332 78 356 84" fill="none" stroke="#0284c7" stroke-width="2"/>';
      svg += '<path d="M 264 104 Q 288 110 300 136" fill="none" stroke="#0284c7" stroke-width="2"/>';
      svg += '<polygon points="332,70 332,94 288,118" fill="rgba(16,185,129,0.28)" stroke="#059669" stroke-width="1.4"/>';
      svg += '<text x="366" y="78" font-size="11.5" font-weight="700" fill="#059669">对称Rt△ = |k|</text>';
      svg += '<text x="366" y="108" font-size="11.5" font-weight="700" fill="#1e40af">对称▱ = 2|k|</text>';
      svg += '<text x="258" y="160" font-size="11" fill="#475569">OA=OB得中线，等底同高面积加倍</text>';
      svg += '</g>';

      // Card 3: Bottom-Left (模型3：单曲线双点转直角梯形)
      svg += '<g opacity="' + c3.op + '">';
      svg += '<rect x="12" y="184" width="222" height="162" rx="8" fill="' + c3.bg + '" stroke="' + c3.stroke + '" stroke-width="' + c3.sw + '"/>';
      svg += '<text x="22" y="204" font-size="12.5" font-weight="700" fill="#1e40af">③ 单曲线双点转直角梯形</text>';
      svg += '<line x1="30" y1="312" x2="141" y2="312" stroke="#475569" stroke-width="1.4"/>';
      svg += '<line x1="40" y1="322" x2="40" y2="222" stroke="#475569" stroke-width="1.4"/>';
      svg += '<path d="M 54 229 Q 74 286 134 300" fill="none" stroke="#0284c7" stroke-width="2"/>';
      svg += '<polygon points="40,312 61,242 111,292" fill="rgba(59,130,246,0.25)" stroke="#2563eb" stroke-width="1.4"/>';
      svg += '<polygon points="61,242 61,312 111,312 111,292" fill="rgba(245,158,11,0.25)" stroke="#d97706" stroke-width="1.4" stroke-dasharray="3,2"/>';
      svg += '<text x="142" y="256" font-size="11" font-weight="700" fill="#2563eb">S△AOC</text>';
      svg += '<text x="142" y="278" font-size="11" font-weight="700" fill="#d97706">= S直角梯形ABDC</text>';
      svg += '<text x="24" y="334" font-size="11" fill="#475569">消去公共△，蝴蝶翅膀相等转梯形</text>';
      svg += '</g>';

      // Card 4: Bottom-Right (模型4：双反比例函数加减与定号警示)
      svg += '<g opacity="' + c4.op + '">';
      svg += '<rect x="246" y="184" width="222" height="162" rx="8" fill="' + c4.bg + '" stroke="' + c4.stroke + '" stroke-width="' + c4.sw + '"/>';
      svg += '<text x="256" y="204" font-size="12.5" font-weight="700" fill="#1e40af">④ 双曲线（同减异加）与定号</text>';
      svg += '<line x1="258" y1="310" x2="362" y2="310" stroke="#475569" stroke-width="1.4"/>';
      svg += '<line x1="310" y1="320" x2="310" y2="220" stroke="#475569" stroke-width="1.4"/>';
      svg += '<path d="M 265 235 Q 288 288 302 302" fill="none" stroke="#7c3aed" stroke-width="2"/>';
      svg += '<path d="M 318 302 Q 334 288 355 235" fill="none" stroke="#0284c7" stroke-width="2"/>';
      svg += '<polygon points="276,262 342,262 310,310" fill="rgba(124,58,237,0.22)" stroke="#7c3aed" stroke-width="1.4"/>';
      svg += '<text x="364" y="242" font-size="11" font-weight="700" fill="#1e293b">同号：|k₁|-|k₂|</text>';
      svg += '<text x="364" y="260" font-size="11" font-weight="700" fill="#7c3aed">异号：|k₁|+|k₂|</text>';
      svg += '<rect x="364" y="268" width="96" height="42" rx="5" fill="#fef2f2" stroke="#ef4444" stroke-width="1.2"/>';
      svg += '<text x="412" y="285" text-anchor="middle" font-size="10.5" font-weight="700" fill="#dc2626">易错：反求 k 时</text>';
      svg += '<text x="412" y="301" text-anchor="middle" font-size="10.5" font-weight="700" fill="#dc2626">必看象限定正负！</text>';
      svg += '<text x="258" y="334" font-size="11" fill="#475569">一三象限 k&gt;0，二四象限 k&lt;0</text>';
      svg += '</g>';

      svg += '</svg>';

      var controlsEl = root.querySelector("#controls");
      if (controlsEl && typeof stepBar === "function") {
        controlsEl.innerHTML = stepBar(step, 4);
      }
      host.innerHTML = svg;
    }
  };
})();

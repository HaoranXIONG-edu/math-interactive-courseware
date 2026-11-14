window.UNIT1_THEOREM_SLIDES = window.UNIT1_THEOREM_SLIDES || [];
window.UNIT1_SIMS = window.UNIT1_SIMS || {};

(function () {
  // =========================================================================
  // Slide 1: 第 1 题：物流运送 500t 抗旱物资
  // =========================================================================
  window.defineSlide({
    id: 'u2_3_1_apply_q1',
    phase: 2,
    navTag: '题1·物流货运建模',
    section: '新知应用',
    title: '第<span class="num">1</span>题：工程/物流货运中的反比例函数最值问题',
    layout: 'layout-b',
    stem: '<p><span class="num">1．</span>某物流公司需运送<span class="num">500t</span>抗旱物资前往受灾地区，平均每天运送的物资量<i class="m">v</i>（单位：<span class="num">t/</span>天）与规定的运送时间<i class="m">t</i>（单位：天）之间满足反比例函数关系．若要求在不超过<span class="num">10</span>天内全部运完，则平均每天至少需运送物资<span class="screen-blank choice-bracket" data-step="2" data-ans="B"></span></p><p class="stem-options"><span><span class="num">A．25t</span></span><span><span class="num">B．50t</span></span><span><span class="num">C．100t</span></span><span><span class="num">D．500t</span></span></p>',
    steps: [
      {
        title: '建立每天运送量<i class="m">v</i>与时间<i class="m">t</i>的函数关系',
        body: '物资总量固定为<span class="num">500t</span>，由<span class="math"><i class="m">vt</i><span class="num">=500</span></span>得反比例函数表达式为<span class="math"><i class="m">v</i><span class="num">=</span><span class="fraction"><span><span class="num">500</span></span><span><i class="m">t</i></span></span></span>（<span class="math"><i class="m">t</i><span class="num">&gt;0</span></span>）．'
      },
      {
        title: '由时间上限求每日运送量下限',
        body: '当<span class="math"><i class="m">t</i><span class="num">=10</span></span>时，<span class="math"><i class="m">v</i><span class="num">=</span><span class="fraction"><span><span class="num">500</span></span><span><span class="num">10</span></span></span><span class="num">=50</span></span>（<span class="num">t/</span>天）．因为<span class="math"><i class="m">k</i><span class="num">=500&gt;0</span></span>，在第一象限内<i class="m">v</i>随<i class="m">t</i>的增大而减小，当<span class="math"><span class="num">0&lt;</span><i class="m">t</i><span class="num">≤10</span></span>时，<span class="math"><i class="m">v</i><span class="num">≥50</span></span>，即平均每天至少需运送<b style="color:#dc2626;"><span class="num">50t</span></b>，故选<b style="color:#dc2626;">B</b>．'
      }
    ],
    renderScene: function (step, state) {
      var W = 540, H = 420;
      var ox = 72, oy = 355;
      var sx = 20, sy = 2.8; // t: 0..20 -> 400px, v: 0..110 -> 308px
      var tx = function (t) { return ox + t * sx; };
      var ty = function (v) { return oy - v * sy; };

      var parts = [];
      parts.push('<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" height="100%" style="background:#ffffff;border-radius:12px;">');
      parts.push('<defs>');
      parts.push('<marker id="arrQ1" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#334155"/></marker>');
      parts.push('</defs>');

      // Grid lines
      for (var tTick = 2; tTick <= 20; tTick += 2) {
        var gx = tx(tTick);
        parts.push('<line x1="' + gx + '" y1="' + ty(110) + '" x2="' + gx + '" y2="' + oy + '" stroke="#f1f5f9" stroke-width="1"/>');
        if (tTick % 5 === 0 || tTick === 20) {
          parts.push('<line x1="' + gx + '" y1="' + oy + '" x2="' + gx + '" y2="' + (oy + 5) + '" stroke="#334155" stroke-width="1.5"/>');
          parts.push('<text x="' + gx + '" y="' + (oy + 22) + '" text-anchor="middle" font-family="Times New Roman" font-size="14" fill="#334155">' + tTick + '</text>');
        }
      }
      for (var vTick = 10; vTick <= 100; vTick += 10) {
        var gy = ty(vTick);
        parts.push('<line x1="' + ox + '" y1="' + gy + '" x2="' + tx(20) + '" y2="' + gy + '" stroke="#f1f5f9" stroke-width="1"/>');
        if (vTick % 25 === 0 || vTick === 50 || vTick === 100) {
          parts.push('<line x1="' + (ox - 5) + '" y1="' + gy + '" x2="' + ox + '" y2="' + gy + '" stroke="#334155" stroke-width="1.5"/>');
          parts.push('<text x="' + (ox - 10) + '" y="' + (gy + 5) + '" text-anchor="end" font-family="Times New Roman" font-size="14" fill="#334155">' + vTick + '</text>');
        }
      }

      // Axes
      parts.push('<line x1="' + ox + '" y1="' + oy + '" x2="' + (tx(21)) + '" y2="' + oy + '" stroke="#334155" stroke-width="2" marker-end="url(#arrQ1)"/>');
      parts.push('<line x1="' + ox + '" y1="' + oy + '" x2="' + ox + '" y2="' + (ty(114)) + '" stroke="#334155" stroke-width="2" marker-end="url(#arrQ1)"/>');
      parts.push('<text x="' + (ox - 12) + '" y="' + (oy + 20) + '" font-family="Times New Roman" font-style="italic" font-size="15" fill="#334155">O</text>');
      parts.push('<text x="' + (tx(20.8)) + '" y="' + (oy - 10) + '" text-anchor="end" font-family="Times New Roman, SimSun" font-size="15" fill="#1e293b"><tspan font-style="italic">t</tspan>/天</text>');
      parts.push('<text x="' + (ox + 12) + '" y="' + (ty(110)) + '" text-anchor="start" font-family="Times New Roman, SimSun" font-size="15" fill="#1e293b"><tspan font-style="italic">v</tspan>/(t/天)</text>');

      if (step === 0) {
        parts.push('<rect x="165" y="22" width="280" height="34" rx="8" fill="#f8fafc" stroke="#cbd5e1" stroke-dasharray="4,4"/>');
        parts.push('<text x="305" y="44" text-anchor="middle" font-family="SimSun, Times New Roman" font-size="14" fill="#64748b">点击“下一步”建立函数图象与临界分析</text>');
      }

      if (step >= 1) {
        // Plot curve v = 500 / t for t in [4.6, 20]
        var dFull = '';
        for (var i = 0; i <= 120; i++) {
          var tVal = 4.6 + (20 - 4.6) * (i / 120);
          var vVal = 500 / tVal;
          var px = tx(tVal).toFixed(2);
          var py = ty(vVal).toFixed(2);
          dFull += (i === 0 ? 'M' : 'L') + px + ',' + py;
        }
        parts.push('<path d="' + dFull + '" fill="none" stroke="#2563eb" stroke-width="3"/>');
        parts.push('<text x="' + tx(14.5) + '" y="' + (ty(500 / 14.5) - 12) + '" font-family="Times New Roman" font-size="16" font-weight="bold" fill="#2563eb"><tspan font-style="italic">v</tspan> = 500/<tspan font-style="italic">t</tspan></text>');
      }

      if (step >= 2) {
        // Highlight 0 < t <= 10 (from t=4.6 to t=10) and v >= 50
        var dSub = '';
        for (var j = 0; j <= 60; j++) {
          var tSub = 4.6 + (10 - 4.6) * (j / 60);
          var vSub = 500 / tSub;
          dSub += (j === 0 ? 'M' : 'L') + tx(tSub).toFixed(2) + ',' + ty(vSub).toFixed(2);
        }
        // Shaded valid region
        parts.push('<rect x="' + ox + '" y="' + ty(108) + '" width="' + (tx(10) - ox) + '" height="' + (ty(50) - ty(108)) + '" fill="rgba(220,38,38,0.08)"/>');
        parts.push('<path d="' + dSub + '" fill="none" stroke="#dc2626" stroke-width="4.5"/>');

        // Dashed projections from (10, 50)
        var p10x = tx(10), p50y = ty(50);
        parts.push('<line x1="' + p10x + '" y1="' + p50y + '" x2="' + p10x + '" y2="' + oy + '" stroke="#dc2626" stroke-width="2" stroke-dasharray="6,4"/>');
        parts.push('<line x1="' + ox + '" y1="' + p50y + '" x2="' + p10x + '" y2="' + p50y + '" stroke="#dc2626" stroke-width="2" stroke-dasharray="6,4"/>');

        // Highlight intervals on axes
        parts.push('<line x1="' + ox + '" y1="' + oy + '" x2="' + p10x + '" y2="' + oy + '" stroke="#16a34a" stroke-width="5"/>');
        parts.push('<line x1="' + ox + '" y1="' + p50y + '" x2="' + ox + '" y2="' + ty(108) + '" stroke="#dc2626" stroke-width="5"/>');

        // Point P(10, 50)
        parts.push('<circle cx="' + p10x + '" cy="' + p50y + '" r="6" fill="#dc2626" stroke="#ffffff" stroke-width="2"/>');
        parts.push('<text x="' + (p10x + 10) + '" y="' + (p50y - 10) + '" font-family="Times New Roman, SimSun" font-size="15" font-weight="bold" fill="#dc2626">临界点(10,50)</text>');
        parts.push('<text x="' + ((ox + p10x) / 2) + '" y="' + (oy - 8) + '" text-anchor="middle" font-family="Times New Roman, SimSun" font-size="13" font-weight="bold" fill="#16a34a">0&lt;<tspan font-style="italic">t</tspan>≤10</text>');
        parts.push('<text x="' + (ox + 10) + '" y="' + ((p50y + ty(100)) / 2) + '" font-family="Times New Roman, SimSun" font-size="14" font-weight="bold" fill="#dc2626"><tspan font-style="italic">v</tspan>≥50</text>');
      }

      parts.push('</svg>');
      return parts.join('');
    }
  });

  // =========================================================================
  // Slide 2: 第 2 题：古希腊阿基米德杠杆撬石头问题
  // =========================================================================
  window.defineSlide({
    id: 'u2_3_1_apply_q2',
    phase: 2,
    navTag: '题2·阿基米德杠杆',
    section: '新知应用',
    title: '第<span class="num">2</span>题：古希腊阿基米德杠杆平衡原理建模',
    layout: 'layout-b',
    stem: '<p><span class="num">2．</span>如图，古希腊科学家阿基米德发现杠杆平衡原理：动力<span class="num">×</span>动力臂<span class="num">=</span>阻力<span class="num">×</span>阻力臂（即<span class="math"><i class="m">Fl</i><sub><span class="num">1</span></sub><span class="num">=</span><i class="m">F</i><sub>阻</sub><i class="m">l</i><sub><span class="num">2</span></sub></span>）．某工程队用撬棍撬动一块大石头，已知石头对撬棍的阻力<span class="math"><i class="m">F</i><sub>阻</sub><span class="num">=1200N</span></span>，阻力臂<span class="math"><i class="m">l</i><sub><span class="num">2</span></sub><span class="num">=0.5m</span></span>，则动力<i class="m">F</i>（单位：<span class="num">N</span>）关于动力臂<i class="m">l</i><sub><span class="num">1</span></sub>（单位：<span class="num">m</span>）的函数表达式为<span class="screen-blank" data-step="1" data-ans="<span class=\'math\'><i class=\'m\'>F</i><span class=\'num\'>=</span><span class=\'fraction\'><span><span class=\'num\'>600</span></span><span><i class=\'m\'>l</i><sub><span class=\'num\'>1</span></sub></span></span></span>"></span>；若工人在撬棍右端施加的动力臂<span class="math"><i class="m">l</i><sub><span class="num">1</span></sub><span class="num">=1.5m</span></span>，则撬动这块石头至少需要动力<span class="math"><i class="m">F</i><span class="num">=</span></span><span class="screen-blank" data-step="2" data-ans="<span class=\'num\'>400</span>"></span><span class="num">N</span>．</p>',
    steps: [
      {
        title: '代入阻力与阻力臂求函数表达式',
        body: '由<span class="math"><i class="m">Fl</i><sub><span class="num">1</span></sub><span class="num">=</span><i class="m">F</i><sub>阻</sub><i class="m">l</i><sub><span class="num">2</span></sub><span class="num">=1200×0.5=600</span></span>，得<span class="math"><i class="m">F</i><span class="num">=</span><span class="fraction"><span><span class="num">600</span></span><span><i class="m">l</i><sub><span class="num">1</span></sub></span></span></span>（<span class="math"><i class="m">l</i><sub><span class="num">1</span></sub><span class="num">&gt;0</span></span>）．'
      },
      {
        title: '代入动力臂求所需动力',
        body: '当<span class="math"><i class="m">l</i><sub><span class="num">1</span></sub><span class="num">=1.5m</span></span>时，<span class="math"><i class="m">F</i><span class="num">=</span><span class="fraction"><span><span class="num">600</span></span><span><span class="num">1.5</span></span></span><span class="num">=</span><b style="color:#dc2626;">400</b></span>（<span class="num">N</span>），即动力臂是阻力臂的<span class="num">3</span>倍时，所需动力仅为阻力的<span class="math"><span class="fraction"><span><span class="num">1</span></span><span><span class="num">3</span></span></span></span>．'
      }
    ],
    controls: function (step, state) {
      if (step < 1) return '';
      var l1Val = typeof state.l1Val === 'number' ? state.l1Val : 1.5;
      if (typeof window.slider === 'function') {
        return window.slider('l1Val', '调节动力臂<i class="m">l</i><sub>1</sub>', 0.5, 2.5, l1Val, 0.1, 'm');
      }
      return '';
    },
    renderScene: function (step, state) {
      var W = 540, H = 420;
      var l1Val = (step >= 1 && typeof state.l1Val === 'number') ? state.l1Val : 1.5;
      var fVal = Math.round(600 / l1Val);

      var parts = [];
      parts.push('<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" height="100%" style="background:#ffffff;border-radius:12px;">');
      parts.push('<defs>');
      parts.push('<marker id="arrRedQ2" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#dc2626"/></marker>');
      parts.push('<marker id="arrBlueQ2" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#2563eb"/></marker>');
      parts.push('<marker id="arrDimR" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#475569"/></marker>');
      parts.push('<marker id="arrDimL" markerWidth="6" markerHeight="6" refX="1" refY="3" orient="auto"><path d="M6,0 L0,3 L6,6 Z" fill="#475569"/></marker>');
      parts.push('</defs>');

      // Ground line & hatching in upper canvas
      var groundY = 195;
      parts.push('<line x1="40" y1="' + groundY + '" x2="500" y2="' + groundY + '" stroke="#334155" stroke-width="2.5"/>');
      for (var hx = 50; hx <= 490; hx += 18) {
        parts.push('<line x1="' + hx + '" y1="' + groundY + '" x2="' + (hx - 10) + '" y2="' + (groundY + 12) + '" stroke="#94a3b8" stroke-width="1.5"/>');
      }

      // Fulcrum O at (175, 165) -> triangle down to groundY=195
      var ox = 175, oy = 162;
      parts.push('<polygon points="' + ox + ',' + oy + ' ' + (ox - 20) + ',' + groundY + ' ' + (ox + 20) + ',' + groundY + '" fill="#cbd5e1" stroke="#1e293b" stroke-width="2"/>');
      parts.push('<text x="' + ox + '" y="' + (groundY + 26) + '" text-anchor="middle" font-family="Times New Roman" font-style="italic" font-weight="bold" font-size="16" fill="#1e293b">O</text>');

      // Lever angle: slightly tilted (-11 degrees)
      var angle = -11 * Math.PI / 180;
      var cosA = Math.cos(angle), sinA = Math.sin(angle);
      var scaleM = 120; // 1m = 120px
      var leftLen = 0.5 * scaleM; // l2 = 0.5m -> 60px
      var rightLen = l1Val * scaleM; // l1 -> dynamic

      var lx = ox - leftLen * cosA;
      var ly = oy - leftLen * sinA;
      var rx = ox + rightLen * cosA;
      var ry = oy + rightLen * sinA;

      // Rock on the left end
      parts.push('<path d="M' + (lx - 42) + ',' + groundY + ' Q' + (lx - 48) + ',' + (ly - 42) + ' ' + (lx - 8) + ',' + (ly - 48) + ' Q' + (lx + 24) + ',' + (ly - 44) + ' ' + (lx + 18) + ',' + (ly + 2) + ' L' + (lx + 12) + ',' + groundY + ' Z" fill="#94a3b8" stroke="#334155" stroke-width="2"/>');
      parts.push('<text x="' + (lx - 14) + '" y="' + (ly - 14) + '" text-anchor="middle" font-family="SimSun" font-size="14" font-weight="bold" fill="#ffffff">大石头</text>');

      // Lever bar
      parts.push('<line x1="' + lx.toFixed(1) + '" y1="' + ly.toFixed(1) + '" x2="' + rx.toFixed(1) + '" y2="' + ry.toFixed(1) + '" stroke="#b45309" stroke-width="7" stroke-linecap="round"/>');
      parts.push('<circle cx="' + ox + '" cy="' + oy + '" r="4.5" fill="#1e293b"/>');

      // Resistance force arrow F_阻 at left end
      parts.push('<line x1="' + lx.toFixed(1) + '" y1="' + ly.toFixed(1) + '" x2="' + lx.toFixed(1) + '" y2="' + (ly + 45).toFixed(1) + '" stroke="#2563eb" stroke-width="2.5" marker-end="url(#arrBlueQ2)"/>');
      parts.push('<text x="' + (lx - 8).toFixed(1) + '" y="' + (ly + 42).toFixed(1) + '" text-anchor="end" font-family="Times New Roman, SimSun" font-size="15" font-weight="bold" fill="#2563eb"><tspan font-style="italic">F</tspan><tspan dy="4" font-size="11">阻</tspan><tspan dy="-4">=1200N</tspan></text>');

      // Effort force arrow F at right end
      var arrowLen = Math.min(75, Math.max(32, fVal / 12));
      parts.push('<line x1="' + rx.toFixed(1) + '" y1="' + ry.toFixed(1) + '" x2="' + rx.toFixed(1) + '" y2="' + (ry + arrowLen).toFixed(1) + '" stroke="#dc2626" stroke-width="3" marker-end="url(#arrRedQ2)"/>');
      parts.push('<text x="' + (rx + 10).toFixed(1) + '" y="' + (ry + arrowLen - 4).toFixed(1) + '" font-family="Times New Roman" font-style="italic" font-size="18" font-weight="bold" fill="#dc2626">F</text>');

      // Dimension lines for l2 and l1 above lever
      var dimY = 62;
      parts.push('<line x1="' + lx.toFixed(1) + '" y1="' + ly.toFixed(1) + '" x2="' + lx.toFixed(1) + '" y2="' + (dimY - 8) + '" stroke="#64748b" stroke-width="1" stroke-dasharray="4,3"/>');
      parts.push('<line x1="' + ox + '" y1="' + oy + '" x2="' + ox + '" y2="' + (dimY - 8) + '" stroke="#64748b" stroke-width="1" stroke-dasharray="4,3"/>');
      parts.push('<line x1="' + rx.toFixed(1) + '" y1="' + ry.toFixed(1) + '" x2="' + rx.toFixed(1) + '" y2="' + (dimY - 8) + '" stroke="#64748b" stroke-width="1" stroke-dasharray="4,3"/>');

      parts.push('<line x1="' + (lx + 3).toFixed(1) + '" y1="' + dimY + '" x2="' + (ox - 3) + '" y2="' + dimY + '" stroke="#475569" stroke-width="1.5" marker-start="url(#arrDimL)" marker-end="url(#arrDimR)"/>');
      parts.push('<text x="' + ((lx + ox) / 2).toFixed(1) + '" y="' + (dimY - 8) + '" text-anchor="middle" font-family="Times New Roman" font-size="14" font-weight="bold" fill="#1e293b"><tspan font-style="italic">l</tspan><tspan dy="3" font-size="10">2</tspan><tspan dy="-3">=0.5m</tspan></text>');

      parts.push('<line x1="' + (ox + 3) + '" y1="' + dimY + '" x2="' + (rx - 3).toFixed(1) + '" y2="' + dimY + '" stroke="#475569" stroke-width="1.5" marker-start="url(#arrDimL)" marker-end="url(#arrDimR)"/>');
      var l1Label = step >= 1 ? ('=' + l1Val.toFixed(1) + 'm') : '';
      parts.push('<text x="' + ((ox + rx) / 2).toFixed(1) + '" y="' + (dimY - 8) + '" text-anchor="middle" font-family="Times New Roman" font-size="15" font-weight="bold" fill="#dc2626"><tspan font-style="italic">l</tspan><tspan dy="3" font-size="11">1</tspan><tspan dy="-3">' + l1Label + '</tspan></text>');

      // Bottom half: live formula card + mini hyperbola readout when step >= 1
      if (step >= 1) {
        parts.push('<rect x="30" y="236" width="480" height="164" rx="12" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>');
        parts.push('<text x="50" y="268" font-family="SimSun, Times New Roman" font-size="16" font-weight="bold" fill="#1e293b">阿基米德杠杆反比例模型：<tspan font-family="Times New Roman" font-style="italic" fill="#2563eb">F</tspan> = 600 / <tspan font-family="Times New Roman" font-style="italic" fill="#2563eb">l</tspan><tspan dy="3" font-size="11" fill="#2563eb">1</tspan></text>');
        parts.push('<text x="50" y="304" font-family="SimSun, Times New Roman" font-size="15" fill="#334155">• 固定阻力矩：<tspan font-family="Times New Roman"><tspan font-style="italic">F</tspan><tspan dy="3" font-size="11">阻</tspan><tspan dy="-3">·</tspan><tspan font-style="italic">l</tspan><tspan dy="3" font-size="11">2</tspan><tspan dy="-3"> = 1200 × 0.5 = 600 (N·m)</tspan></tspan></text>');
        parts.push('<text x="50" y="338" font-family="SimSun, Times New Roman" font-size="15" fill="#334155">• 当前动力臂：<tspan font-family="Times New Roman" font-weight="bold" fill="#2563eb"><tspan font-style="italic">l</tspan><tspan dy="3" font-size="11">1</tspan><tspan dy="-3"> = ' + l1Val.toFixed(1) + ' m</tspan></tspan></text>');
        parts.push('<text x="50" y="374" font-family="SimSun, Times New Roman" font-size="16" font-weight="bold" fill="#dc2626">• 所需最小动力：<tspan font-family="Times New Roman"><tspan font-style="italic">F</tspan> = 600 / ' + l1Val.toFixed(1) + ' = ' + fVal + ' N</tspan></text>');

        // Mini hyperbola indicator on the right side of the card
        var gx0 = 355, gy0 = 382;
        parts.push('<line x1="' + gx0 + '" y1="' + gy0 + '" x2="490" y2="' + gy0 + '" stroke="#64748b" stroke-width="1.5"/>');
        parts.push('<line x1="' + gx0 + '" y1="' + gy0 + '" x2="' + gx0 + '" y2="255" stroke="#64748b" stroke-width="1.5"/>');
        var miniPath = '';
        for (var k = 0; k <= 40; k++) {
          var ml = 0.5 + 2.0 * (k / 40);
          var mf = 600 / ml;
          var mx = gx0 + ml * 48;
          var my = gy0 - mf * 0.095;
          miniPath += (k === 0 ? 'M' : 'L') + mx.toFixed(1) + ',' + my.toFixed(1);
        }
        parts.push('<path d="' + miniPath + '" fill="none" stroke="#2563eb" stroke-width="2.5"/>');
        var curMx = gx0 + l1Val * 48;
        var curMy = gy0 - fVal * 0.095;
        parts.push('<circle cx="' + curMx.toFixed(1) + '" cy="' + curMy.toFixed(1) + '" r="5" fill="#dc2626" stroke="#ffffff" stroke-width="1.5"/>');
        parts.push('<text x="' + (curMx + 6).toFixed(1) + '" y="' + (curMy - 6).toFixed(1) + '" font-family="Times New Roman" font-size="12" font-weight="bold" fill="#dc2626">(' + l1Val.toFixed(1) + ',' + fVal + ')</text>');
      } else {
        parts.push('<rect x="85" y="265" width="370" height="44" rx="8" fill="#f8fafc" stroke="#cbd5e1" stroke-dasharray="4,4"/>');
        parts.push('<text x="270" y="292" text-anchor="middle" font-family="SimSun, Times New Roman" font-size="15" fill="#64748b">已知阻力<tspan font-family="Times New Roman" font-style="italic">F</tspan><tspan dy="3" font-size="11">阻</tspan><tspan dy="-3">=1200N，阻力臂</tspan><tspan font-family="Times New Roman" font-style="italic">l</tspan><tspan dy="3" font-size="11">2</tspan><tspan dy="-3">=0.5m</tspan></text>');
      }

      parts.push('</svg>');
      return parts.join('');
    }
  });

  // =========================================================================
  // Slide 3: 第 3 题：跨学科·物理——近视眼镜度数与镜片焦距
  // =========================================================================
  window.defineSlide({
    id: 'u2_3_1_apply_q3',
    phase: 2,
    navTag: '题3·近视眼镜焦距',
    section: '新知应用',
    title: '第<span class="num">3</span>题：（跨学科·物理）近视眼镜度数与镜片焦距',
    layout: 'layout-b',
    stem: '<p><span class="num">3．</span>（跨学科·物理）近视眼镜的度数<i class="m">y</i>（单位：度）与镜片焦距<i class="m">x</i>（单位：<span class="num">m</span>）成反比例，其函数图象如图所示，且图象经过点<i class="m">A</i><span class="num">(0.5,800)</span>．则<i class="m">y</i>关于<i class="m">x</i>的函数表达式为<span class="screen-blank" data-step="1" data-ans="<span class=\'math\'><i class=\'m\'>y</i><span class=\'num\'>=</span><span class=\'fraction\'><span><span class=\'num\'>400</span></span><span><i class=\'m\'>x</i></span></span></span>（<i class=\'m\'>x</i><span class=\'num\'>&gt;0</span>）"></span>；若某同学佩戴的近视眼镜度数为<span class="num">400</span>度，则该镜片的焦距<i class="m">x</i>为<span class="screen-blank" data-step="2" data-ans="<span class=\'num\'>1</span>"></span><span class="num">m</span>．</p>',
    steps: [
      {
        title: '由图象上已知点<i class="m">A</i>求表达式',
        body: '设<span class="math"><i class="m">y</i><span class="num">=</span><span class="fraction"><span><i class="m">k</i></span><span><i class="m">x</i></span></span></span>（<span class="math"><i class="m">x</i><span class="num">&gt;0</span></span>），将点<span class="math"><i class="m">A</i><span class="num">(0.5,800)</span></span>代入得<span class="math"><i class="m">k</i><span class="num">=0.5×800=400</span></span>，故<span class="math"><i class="m">y</i><span class="num">=</span><span class="fraction"><span><span class="num">400</span></span><span><i class="m">x</i></span></span></span>（<span class="math"><i class="m">x</i><span class="num">&gt;0</span></span>）．'
      },
      {
        title: '已知度数反求镜片焦距',
        body: '当<span class="math"><i class="m">y</i><span class="num">=400</span></span>时，由<span class="math"><span class="fraction"><span><span class="num">400</span></span><span><i class="m">x</i></span></span><span class="num">=400</span></span>解得<span class="math"><i class="m">x</i><span class="num">=</span><b style="color:#dc2626;">1</b></span>（<span class="num">m</span>）．'
      }
    ],
    renderScene: function (step, state) {
      var W = 540, H = 420;
      var ox = 78, oy = 355;
      var sx = 210, sy = 0.28; // x: 0..1.8 -> 378px, y: 0..1000 -> 280px
      var tx = function (x) { return ox + x * sx; };
      var ty = function (y) { return oy - y * sy; };

      var parts = [];
      parts.push('<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" height="100%" style="background:#ffffff;border-radius:12px;">');
      parts.push('<defs>');
      parts.push('<marker id="arrQ3" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#1e293b"/></marker>');
      parts.push('</defs>');

      // Subtle grid
      var xTicks = [0.5, 1, 1.5];
      for (var i = 0; i < xTicks.length; i++) {
        var gx = tx(xTicks[i]);
        parts.push('<line x1="' + gx + '" y1="' + ty(1000) + '" x2="' + gx + '" y2="' + oy + '" stroke="#f1f5f9" stroke-width="1"/>');
      }
      var yTicks = [200, 400, 600, 800, 1000];
      for (var j = 0; j < yTicks.length; j++) {
        var gy = ty(yTicks[j]);
        parts.push('<line x1="' + ox + '" y1="' + gy + '" x2="' + tx(1.8) + '" y2="' + gy + '" stroke="#f1f5f9" stroke-width="1"/>');
      }

      // Axes
      parts.push('<line x1="' + ox + '" y1="' + oy + '" x2="' + tx(1.9) + '" y2="' + oy + '" stroke="#1e293b" stroke-width="2" marker-end="url(#arrQ3)"/>');
      parts.push('<line x1="' + ox + '" y1="' + oy + '" x2="' + ox + '" y2="' + ty(1080) + '" stroke="#1e293b" stroke-width="2" marker-end="url(#arrQ3)"/>');
      parts.push('<text x="' + (ox - 14) + '" y="' + (oy + 20) + '" font-family="Times New Roman" font-style="italic" font-size="16" fill="#1e293b">O</text>');
      parts.push('<text x="' + tx(1.88) + '" y="' + (oy + 28) + '" text-anchor="end" font-family="Times New Roman" font-size="16" fill="#1e293b"><tspan font-style="italic">x</tspan>/m</text>');
      parts.push('<text x="' + (ox + 12) + '" y="' + ty(1045) + '" font-family="Times New Roman, SimSun" font-size="16" fill="#1e293b"><tspan font-style="italic">y</tspan>/度</text>');

      // Curve y = 400 / x (replicates image36.png at step === 0)
      var dCurve = '';
      for (var k = 0; k <= 120; k++) {
        var xv = 0.38 + (1.75 - 0.38) * (k / 120);
        var yv = 400 / xv;
        dCurve += (k === 0 ? 'M' : 'L') + tx(xv).toFixed(2) + ',' + ty(yv).toFixed(2);
      }
      parts.push('<path d="' + dCurve + '" fill="none" stroke="#1e293b" stroke-width="2.8"/>');

      // Point A(0.5, 800) with dashed lines to 0.5 and 800
      var ax = tx(0.5), ay = ty(800);
      parts.push('<line x1="' + ax + '" y1="' + ay + '" x2="' + ax + '" y2="' + oy + '" stroke="#475569" stroke-width="1.8" stroke-dasharray="5,4"/>');
      parts.push('<line x1="' + ox + '" y1="' + ay + '" x2="' + ax + '" y2="' + ay + '" stroke="#475569" stroke-width="1.8" stroke-dasharray="5,4"/>');
      parts.push('<circle cx="' + ax + '" cy="' + ay + '" r="5" fill="#2563eb" stroke="#ffffff" stroke-width="1.5"/>');
      parts.push('<text x="' + (ax + 10) + '" y="' + (ay - 8) + '" font-family="Times New Roman" font-size="16" font-weight="bold" fill="#2563eb"><tspan font-style="italic">A</tspan>(0.5,800)</text>');
      parts.push('<text x="' + ax + '" y="' + (oy + 22) + '" text-anchor="middle" font-family="Times New Roman" font-size="15" fill="#1e293b">0.5</text>');
      parts.push('<text x="' + (ox - 8) + '" y="' + (ay + 5) + '" text-anchor="end" font-family="Times New Roman" font-size="15" fill="#1e293b">800</text>');

      if (step >= 1) {
        parts.push('<text x="' + tx(1.25) + '" y="' + (ty(400 / 1.25) - 16) + '" font-family="Times New Roman" font-size="17" font-weight="bold" fill="#2563eb"><tspan font-style="italic">y</tspan> = 400/<tspan font-style="italic">x</tspan></text>');
      }

      if (step >= 2) {
        var bx = tx(1.0), by = ty(400);
        parts.push('<line x1="' + bx + '" y1="' + by + '" x2="' + bx + '" y2="' + oy + '" stroke="#dc2626" stroke-width="2.2" stroke-dasharray="6,4"/>');
        parts.push('<line x1="' + ox + '" y1="' + by + '" x2="' + bx + '" y2="' + by + '" stroke="#dc2626" stroke-width="2.2" stroke-dasharray="6,4"/>');
        parts.push('<circle cx="' + bx + '" cy="' + by + '" r="6" fill="#dc2626" stroke="#ffffff" stroke-width="2"/>');
        parts.push('<text x="' + (bx + 10) + '" y="' + (by - 10) + '" font-family="Times New Roman" font-size="16" font-weight="bold" fill="#dc2626"><tspan font-style="italic">B</tspan>(1,400)</text>');
        parts.push('<text x="' + bx + '" y="' + (oy + 22) + '" text-anchor="middle" font-family="Times New Roman" font-size="16" font-weight="bold" fill="#dc2626">1</text>');
        parts.push('<text x="' + (ox - 8) + '" y="' + (by + 5) + '" text-anchor="end" font-family="Times New Roman" font-size="16" font-weight="bold" fill="#dc2626">400</text>');
      }

      parts.push('</svg>');
      return parts.join('');
    }
  });

  // =========================================================================
  // Slide 4: 第 4 题：汽车匀速行驶速度与时间反比例区间问题
  // =========================================================================
  window.defineSlide({
    id: 'u2_3_1_apply_q4',
    phase: 2,
    navTag: '题4·汽车行程限速',
    section: '新知应用',
    title: '第<span class="num">4</span>题：行程问题中的速度、时间与区间范围',
    layout: 'layout-b',
    stem: '<p><span class="num">4．</span>甲、乙两地相距<span class="num">300km</span>，汽车从甲地匀速驶往乙地，行驶的平均速度<i class="m">v</i>（单位：<span class="num">km/h</span>）是行驶时间<i class="m">t</i>（单位：<span class="num">h</span>）的反比例函数．当<span class="math"><i class="m">t</i><span class="num">=3h</span></span>时，<span class="math"><i class="m">v</i><span class="num">=</span></span><span class="screen-blank" data-step="1" data-ans="<span class=\'num\'>100</span>"></span><span class="num">km/h</span>；若该路段最高限速不超过<span class="num">100km/h</span>，则汽车从甲地到乙地至少需要<span class="screen-blank" data-step="2" data-ans="<span class=\'num\'>3</span>"></span><span class="num">h</span>；当行驶时间满足<span class="math"><span class="num">3≤</span><i class="m">t</i><span class="num">≤5</span></span>时，平均速度<i class="m">v</i>的取值范围是<span class="screen-blank" data-step="3" data-ans="<span class=\'num\'>60km/h≤</span><i class=\'m\'>v</i><span class=\'num\'>≤100km/h</span>"></span>．</p>',
    steps: [
      {
        title: '建立函数表达式并求<span class="math"><i class="m">t</i><span class="num">=3</span></span>时的速度',
        body: '由路程<span class="math"><i class="m">s</i><span class="num">=300km</span></span>得<span class="math"><i class="m">v</i><span class="num">=</span><span class="fraction"><span><span class="num">300</span></span><span><i class="m">t</i></span></span></span>（<span class="math"><i class="m">t</i><span class="num">&gt;0</span></span>）．当<span class="math"><i class="m">t</i><span class="num">=3h</span></span>时，<span class="math"><i class="m">v</i><span class="num">=</span><span class="fraction"><span><span class="num">300</span></span><span><span class="num">3</span></span></span><span class="num">=</span><b style="color:#dc2626;">100</b></span>（<span class="num">km/h</span>）．'
      },
      {
        title: '由最高限速求最短时间',
        body: '因为<span class="math"><i class="m">k</i><span class="num">=300&gt;0</span></span>，<i class="m">v</i>随<i class="m">t</i>的增大而减小．当<span class="math"><i class="m">v</i><span class="num">≤100km/h</span></span>时，有<span class="math"><span class="fraction"><span><span class="num">300</span></span><span><i class="m">t</i></span></span><span class="num">≤100</span></span>，解得<span class="math"><i class="m">t</i><span class="num">≥</span><b style="color:#dc2626;">3</b></span>（<span class="num">h</span>），即至少需要<span class="num">3h</span>．'
      },
      {
        title: '由自变量区间求函数值区间',
        body: '当<span class="math"><i class="m">t</i><span class="num">=3</span></span>时<span class="math"><i class="m">v</i><span class="num">=100</span></span>；当<span class="math"><i class="m">t</i><span class="num">=5</span></span>时<span class="math"><i class="m">v</i><span class="num">=</span><span class="fraction"><span><span class="num">300</span></span><span><span class="num">5</span></span></span><span class="num">=60</span></span>．由<i class="m">v</i>随<i class="m">t</i>增大而减小知，当<span class="math"><span class="num">3≤</span><i class="m">t</i><span class="num">≤5</span></span>时，<b style="color:#dc2626;"><span class="num">60km/h≤</span><i class="m">v</i><span class="num">≤100km/h</span></b>．'
      }
    ],
    renderScene: function (step, state) {
      var W = 540, H = 420;
      var ox = 76, oy = 355;
      var sx = 64, sy = 2.4; // t: 0..6 -> 384px, v: 0..125 -> 300px
      var tx = function (t) { return ox + t * sx; };
      var ty = function (v) { return oy - v * sy; };

      var parts = [];
      parts.push('<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" height="100%" style="background:#ffffff;border-radius:12px;">');
      parts.push('<defs>');
      parts.push('<marker id="arrQ4" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#334155"/></marker>');
      parts.push('</defs>');

      // Grid
      for (var tTick = 1; tTick <= 6; tTick++) {
        var gx = tx(tTick);
        parts.push('<line x1="' + gx + '" y1="' + ty(120) + '" x2="' + gx + '" y2="' + oy + '" stroke="#f1f5f9" stroke-width="1"/>');
        parts.push('<line x1="' + gx + '" y1="' + oy + '" x2="' + gx + '" y2="' + (oy + 5) + '" stroke="#334155" stroke-width="1.5"/>');
        parts.push('<text x="' + gx + '" y="' + (oy + 22) + '" text-anchor="middle" font-family="Times New Roman" font-size="14" fill="#334155">' + tTick + '</text>');
      }
      for (var vTick = 20; vTick <= 120; vTick += 20) {
        var gy = ty(vTick);
        parts.push('<line x1="' + ox + '" y1="' + gy + '" x2="' + tx(6) + '" y2="' + gy + '" stroke="#f1f5f9" stroke-width="1"/>');
        parts.push('<line x1="' + (ox - 5) + '" y1="' + gy + '" x2="' + ox + '" y2="' + gy + '" stroke="#334155" stroke-width="1.5"/>');
        parts.push('<text x="' + (ox - 10) + '" y="' + (gy + 5) + '" text-anchor="end" font-family="Times New Roman" font-size="14" fill="#334155">' + vTick + '</text>');
      }

      // Axes
      parts.push('<line x1="' + ox + '" y1="' + oy + '" x2="' + tx(6.4) + '" y2="' + oy + '" stroke="#334155" stroke-width="2" marker-end="url(#arrQ4)"/>');
      parts.push('<line x1="' + ox + '" y1="' + oy + '" x2="' + ox + '" y2="' + ty(128) + '" stroke="#334155" stroke-width="2" marker-end="url(#arrQ4)"/>');
      parts.push('<text x="' + (ox - 12) + '" y="' + (oy + 20) + '" font-family="Times New Roman" font-style="italic" font-size="15" fill="#334155">O</text>');
      parts.push('<text x="' + tx(6.35) + '" y="' + (oy - 10) + '" text-anchor="end" font-family="Times New Roman" font-size="15" fill="#1e293b"><tspan font-style="italic">t</tspan>/h</text>');
      parts.push('<text x="' + (ox + 12) + '" y="' + ty(124) + '" font-family="Times New Roman" font-size="15" fill="#1e293b"><tspan font-style="italic">v</tspan>/(km/h)</text>');

      if (step === 0) {
        parts.push('<rect x="165" y="22" width="280" height="34" rx="8" fill="#f8fafc" stroke="#cbd5e1" stroke-dasharray="4,4"/>');
        parts.push('<text x="305" y="44" text-anchor="middle" font-family="SimSun, Times New Roman" font-size="14" fill="#64748b">点击“下一步”绘制反比例函数图象与区间</text>');
      }

      if (step >= 1) {
        var dCurve = '';
        for (var i = 0; i <= 100; i++) {
          var tv = 2.4 + (6.2 - 2.4) * (i / 100);
          var vv = 300 / tv;
          dCurve += (i === 0 ? 'M' : 'L') + tx(tv).toFixed(2) + ',' + ty(vv).toFixed(2);
        }
        parts.push('<path d="' + dCurve + '" fill="none" stroke="#2563eb" stroke-width="2.8"/>');
        parts.push('<text x="' + tx(2.55) + '" y="' + (ty(300 / 2.55) - 10) + '" font-family="Times New Roman" font-size="15" font-weight="bold" fill="#2563eb"><tspan font-style="italic">v</tspan> = 300/<tspan font-style="italic">t</tspan></text>');

        var p3x = tx(3), p100y = ty(100);
        parts.push('<line x1="' + p3x + '" y1="' + p100y + '" x2="' + p3x + '" y2="' + oy + '" stroke="#2563eb" stroke-width="1.8" stroke-dasharray="5,4"/>');
        parts.push('<line x1="' + ox + '" y1="' + p100y + '" x2="' + p3x + '" y2="' + p100y + '" stroke="#2563eb" stroke-width="1.8" stroke-dasharray="5,4"/>');
        parts.push('<circle cx="' + p3x + '" cy="' + p100y + '" r="5.5" fill="#2563eb" stroke="#ffffff" stroke-width="1.5"/>');
        parts.push('<text x="' + (p3x + 8) + '" y="' + (p100y - 8) + '" font-family="Times New Roman" font-size="15" font-weight="bold" fill="#2563eb">(3,100)</text>');
      }

      if (step >= 2) {
        // Highlight ray t >= 3
        var dRay = '';
        for (var j = 0; j <= 60; j++) {
          var tr = 3 + (6.2 - 3) * (j / 60);
          var vr = 300 / tr;
          dRay += (j === 0 ? 'M' : 'L') + tx(tr).toFixed(2) + ',' + ty(vr).toFixed(2);
        }
        parts.push('<path d="' + dRay + '" fill="none" stroke="#16a34a" stroke-width="4"/>');
        parts.push('<line x1="' + tx(3) + '" y1="' + oy + '" x2="' + tx(6.1) + '" y2="' + oy + '" stroke="#16a34a" stroke-width="4.5"/>');
        parts.push('<text x="' + tx(4.5) + '" y="' + (oy + 38) + '" text-anchor="middle" font-family="Times New Roman, SimSun" font-size="14" font-weight="bold" fill="#16a34a">限速<tspan font-style="italic">v</tspan>≤100 ⇒ <tspan font-style="italic">t</tspan>≥3</text>');
      }

      if (step >= 3) {
        // Highlight segment between (3, 100) and (5, 60) and shaded rectangles onto axes
        var p3x = tx(3), p5x = tx(5);
        var p100y = ty(100), p60y = ty(60);

        parts.push('<rect x="' + p3x + '" y="' + p100y + '" width="' + (p5x - p3x) + '" height="' + (oy - p100y) + '" fill="rgba(220,38,38,0.08)"/>');
        parts.push('<rect x="' + ox + '" y="' + p100y + '" width="' + (p5x - ox) + '" height="' + (p60y - p100y) + '" fill="rgba(220,38,38,0.12)"/>');

        var dSeg = '';
        for (var m = 0; m <= 50; m++) {
          var ts = 3 + 2 * (m / 50);
          var vs = 300 / ts;
          dSeg += (m === 0 ? 'M' : 'L') + tx(ts).toFixed(2) + ',' + ty(vs).toFixed(2);
        }
        parts.push('<path d="' + dSeg + '" fill="none" stroke="#dc2626" stroke-width="5"/>');

        parts.push('<line x1="' + p5x + '" y1="' + p60y + '" x2="' + p5x + '" y2="' + oy + '" stroke="#dc2626" stroke-width="2" stroke-dasharray="5,4"/>');
        parts.push('<line x1="' + ox + '" y1="' + p60y + '" x2="' + p5x + '" y2="' + p60y + '" stroke="#dc2626" stroke-width="2" stroke-dasharray="5,4"/>');

        // Highlight intervals on both axes
        parts.push('<line x1="' + p3x + '" y1="' + oy + '" x2="' + p5x + '" y2="' + oy + '" stroke="#dc2626" stroke-width="5.5"/>');
        parts.push('<line x1="' + ox + '" y1="' + p60y + '" x2="' + ox + '" y2="' + p100y + '" stroke="#dc2626" stroke-width="5.5"/>');

        parts.push('<circle cx="' + p3x + '" cy="' + p100y + '" r="6" fill="#dc2626" stroke="#ffffff" stroke-width="2"/>');
        parts.push('<circle cx="' + p5x + '" cy="' + p60y + '" r="6" fill="#dc2626" stroke="#ffffff" stroke-width="2"/>');
        parts.push('<text x="' + (p5x + 8) + '" y="' + (p60y - 8) + '" font-family="Times New Roman" font-size="15" font-weight="bold" fill="#dc2626">(5,60)</text>');
        parts.push('<text x="' + (ox + 10) + '" y="' + ((p60y + p100y) / 2 + 5) + '" font-family="Times New Roman" font-size="14" font-weight="bold" fill="#dc2626">60≤<tspan font-style="italic">v</tspan>≤100</text>');
      }

      parts.push('</svg>');
      return parts.join('');
    }
  });

  // =========================================================================
  // Slide 5A: 第 5 题（1）：饮水机加热与恒温散热两阶段函数表达式建模
  // =========================================================================
  window.defineSlide({
    id: 'u2_3_1_apply_q5_p1',
    phase: 2,
    navTag: '题5(1)·分段表达式',
    section: '新知应用',
    title: '第<span class="num">5</span>题（<span class="num">1</span>）：饮水机加热与恒温散热两阶段函数建模',
    layout: 'layout-b',
    stem: '<p><span class="num">5．</span>某品牌饮水机开启加热程序后，水温<i class="m">y</i>（单位：<span class="num">°C</span>）随时间<i class="m">x</i>（单位：<span class="num">min</span>）变化的图象如图所示：前<span class="num">5min</span>为加热阶段，图象是连接点<i class="m">A</i><span class="num">(0,20)</span>与点<i class="m">B</i><span class="num">(5,100)</span>的线段<i class="m">AB</i>；<span class="num">5min</span>后进入恒温散热阶段，图象是反比例函数<span class="math"><i class="m">y</i><span class="num">=</span><span class="fraction"><span><i class="m">k</i></span><span><i class="m">x</i></span></span></span>（<span class="math"><i class="m">x</i><span class="num">&gt;5</span></span>）图象的一部分<i class="m">BC</i>．</p><p>（<span class="num">1</span>）加热阶段（<span class="math"><span class="num">0≤</span><i class="m">x</i><span class="num">≤5</span></span>）函数表达式为<span class="screen-blank" data-step="1" data-ans="<i class=\'m\'>y</i><span class=\'num\'>=16</span><i class=\'m\'>x</i><span class=\'num\'>+20</span>"></span>，恒温散热阶段（<span class="math"><i class="m">x</i><span class="num">&gt;5</span></span>）函数表达式为<span class="screen-blank" data-step="2" data-ans="<span class=\'math\'><i class=\'m\'>y</i><span class=\'num\'>=</span><span class=\'fraction\'><span><span class=\'num\'>500</span></span><span><i class=\'m\'>x</i></span></span></span>"></span>．</p>',
    steps: [
      {
        title: '求加热阶段（<span class="math"><span class="num">0≤</span><i class="m">x</i><span class="num">≤5</span></span>）一次函数表达式',
        body: '设线段<i class="m">AB</i>的表达式为<span class="math"><i class="m">y</i><span class="num">=</span><i class="m">ax</i><span class="num">+</span><i class="m">b</i></span>，代入<span class="math"><i class="m">A</i><span class="num">(0,20)</span></span>，<span class="math"><i class="m">B</i><span class="num">(5,100)</span></span>得<span class="math"><i class="m">b</i><span class="num">=20</span></span>，<span class="math"><span class="num">5</span><i class="m">a</i><span class="num">+20=100</span></span>，解得<span class="math"><i class="m">a</i><span class="num">=16</span></span>，故<b style="color:#2563eb;"><span class="math"><i class="m">y</i><span class="num">=16</span><i class="m">x</i><span class="num">+20</span></span>（<span class="math"><span class="num">0≤</span><i class="m">x</i><span class="num">≤5</span></span>）</b>．'
      },
      {
        title: '求恒温散热阶段（<span class="math"><i class="m">x</i><span class="num">&gt;5</span></span>）反比例函数表达式',
        body: '将公共转折点<span class="math"><i class="m">B</i><span class="num">(5,100)</span></span>代入<span class="math"><i class="m">y</i><span class="num">=</span><span class="fraction"><span><i class="m">k</i></span><span><i class="m">x</i></span></span></span>，得<span class="math"><i class="m">k</i><span class="num">=5×100=500</span></span>，故<b style="color:#7c3aed;"><span class="math"><i class="m">y</i><span class="num">=</span><span class="fraction"><span><span class="num">500</span></span><span><i class="m">x</i></span></span></span>（<span class="math"><i class="m">x</i><span class="num">&gt;5</span></span>）</b>．'
      }
    ],
    renderScene: function (step) {
      var W = 540, H = 420;
      var ox = 70, oy = 355;
      var sx = 24, sy = 2.7;
      var tx = function (x) { return ox + x * sx; };
      var ty = function (y) { return oy - y * sy; };

      var parts = [];
      parts.push('<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" height="100%" style="background:#ffffff;border-radius:12px;">');
      parts.push('<defs><marker id="arrQ5A" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#1e293b"/></marker></defs>');

      for (var xTick = 5; xTick <= 15; xTick += 5) {
        var gx = tx(xTick);
        parts.push('<line x1="' + gx + '" y1="' + ty(105) + '" x2="' + gx + '" y2="' + oy + '" stroke="#f1f5f9" stroke-width="1"/>');
      }
      for (var yTick = 20; yTick <= 100; yTick += 20) {
        var gy = ty(yTick);
        parts.push('<line x1="' + ox + '" y1="' + gy + '" x2="' + tx(16.5) + '" y2="' + gy + '" stroke="#f1f5f9" stroke-width="1"/>');
      }

      parts.push('<line x1="' + ox + '" y1="' + oy + '" x2="' + tx(17.5) + '" y2="' + oy + '" stroke="#1e293b" stroke-width="2" marker-end="url(#arrQ5A)"/>');
      parts.push('<line x1="' + ox + '" y1="' + oy + '" x2="' + ox + '" y2="' + ty(114) + '" stroke="#1e293b" stroke-width="2" marker-end="url(#arrQ5A)"/>');
      parts.push('<text x="' + (ox - 12) + '" y="' + (oy + 20) + '" font-family="Times New Roman" font-style="italic" font-size="16" fill="#1e293b">O</text>');
      parts.push('<text x="' + tx(17.3) + '" y="' + (oy + 28) + '" text-anchor="end" font-family="Times New Roman" font-size="16" fill="#1e293b"><tspan font-style="italic">x</tspan>/min</text>');
      parts.push('<text x="' + (ox + 10) + '" y="' + ty(110) + '" font-family="Times New Roman" font-size="16" fill="#1e293b"><tspan font-style="italic">y</tspan>/°C</text>');

      var ax = tx(0), ay = ty(20);
      var bx = tx(5), by = ty(100);
      parts.push('<line x1="' + bx + '" y1="' + by + '" x2="' + bx + '" y2="' + oy + '" stroke="#475569" stroke-width="1.6" stroke-dasharray="5,4"/>');
      parts.push('<line x1="' + ox + '" y1="' + by + '" x2="' + bx + '" y2="' + by + '" stroke="#475569" stroke-width="1.6" stroke-dasharray="5,4"/>');
      parts.push('<text x="' + bx + '" y="' + (oy + 22) + '" text-anchor="middle" font-family="Times New Roman" font-size="15" fill="#1e293b">5</text>');
      parts.push('<text x="' + (ox - 8) + '" y="' + (by + 5) + '" text-anchor="end" font-family="Times New Roman" font-size="15" fill="#1e293b">100</text>');
      parts.push('<text x="' + (ox - 8) + '" y="' + (ay + 5) + '" text-anchor="end" font-family="Times New Roman" font-size="15" fill="#1e293b">20</text>');

      var abColor = step >= 1 ? '#2563eb' : '#1e293b';
      var abWidth = step >= 1 ? '4.2' : '2.8';
      parts.push('<line x1="' + ax + '" y1="' + ay + '" x2="' + bx + '" y2="' + by + '" stroke="' + abColor + '" stroke-width="' + abWidth + '"/>');

      var dBC = '';
      for (var k = 0; k <= 90; k++) {
        var xv = 5 + (16.2 - 5) * (k / 90);
        var yv = 500 / xv;
        dBC += (k === 0 ? 'M' : 'L') + tx(xv).toFixed(2) + ',' + ty(yv).toFixed(2);
      }
      var bcColor = step >= 2 ? '#7c3aed' : '#1e293b';
      var bcWidth = step >= 2 ? '4.2' : '2.8';
      parts.push('<path d="' + dBC + '" fill="none" stroke="' + bcColor + '" stroke-width="' + bcWidth + '"/>');

      parts.push('<circle cx="' + ax + '" cy="' + ay + '" r="4.5" fill="#1e293b"/>');
      parts.push('<circle cx="' + bx + '" cy="' + by + '" r="5.5" fill="#dc2626"/>');
      parts.push('<text x="' + (ax + 8) + '" y="' + (ay + 16) + '" font-family="Times New Roman" font-style="italic" font-size="16" font-weight="bold" fill="#1e293b">A(0,20)</text>');
      parts.push('<text x="' + (bx + 8) + '" y="' + (by - 8) + '" font-family="Times New Roman" font-style="italic" font-size="16" font-weight="bold" fill="#dc2626">B(5,100)</text>');
      parts.push('<text x="' + tx(15.5) + '" y="' + (ty(500 / 15.5) - 10) + '" font-family="Times New Roman" font-style="italic" font-size="16" font-weight="bold" fill="#1e293b">C</text>');

      if (step >= 1) {
        parts.push('<text x="' + tx(1.2) + '" y="' + (ty(68) - 14) + '" font-family="Times New Roman" font-size="16" font-weight="bold" fill="#2563eb"><tspan font-style="italic">y</tspan>=16<tspan font-style="italic">x</tspan>+20 (0≤<tspan font-style="italic">x</tspan>≤5)</text>');
      }
      if (step >= 2) {
        parts.push('<text x="' + tx(8.0) + '" y="' + (ty(500 / 8.0) - 14) + '" font-family="Times New Roman" font-size="16" font-weight="bold" fill="#7c3aed"><tspan font-style="italic">y</tspan>=500/<tspan font-style="italic">x</tspan> (<tspan font-style="italic">x</tspan>&gt;5)</text>');
      }
      parts.push('</svg>');
      return parts.join('');
    }
  });

  // =========================================================================
  // Slide 5B: 第 5 题（2）：水温不低于 50°C 的持续时长求解
  // =========================================================================
  window.defineSlide({
    id: 'u2_3_1_apply_q5_p2',
    phase: 2,
    navTag: '题5(2)·冲泡持续时长',
    section: '新知应用',
    title: '第<span class="num">5</span>题（<span class="num">2</span>）：饮水机水温不低于<span class="num">50°C</span>的持续时长求解',
    layout: 'layout-b',
    stem: '<div style="background:#eff6ff;border-left:4px solid #2563eb;padding:4px 10px;margin-bottom:5px;border-radius:4px;font-size:14.5px;color:#1e40af;"><b>【前问已知】</b>加热阶段（<span class="math"><span class="num">0≤</span><i class="m">x</i><span class="num">≤5</span></span>）：<span class="math"><i class="m">y</i><span class="num">=16</span><i class="m">x</i><span class="num">+20</span></span>；恒温散热阶段（<span class="math"><i class="m">x</i><span class="num">&gt;5</span></span>）：<span class="math"><i class="m">y</i><span class="num">=</span><span class="fraction"><span><span class="num">500</span></span><span><i class="m">x</i></span></span></span>．</div><p>（<span class="num">2</span>）当水温不低于<span class="num">50°C</span>时适合冲泡柠檬水，求开启一次加热程序后水温不低于<span class="num">50°C</span>的持续时长：<span class="screen-blank" data-step="3" data-ans="<span class=\'math\'><span class=\'fraction\'><span><span class=\'num\'>65</span></span><span><span class=\'num\'>8</span></span></span></span><span class=\'num\'>min</span>（或<span class=\'num\'>8.125min</span>）"></span>．</p>',
    steps: [
      {
        title: '求加热阶段水温达到<span class="num">50°C</span>的起始时刻<i class="m">x</i><sub><span class="num">1</span></sub>',
        body: '在加热阶段（<span class="math"><span class="num">0≤</span><i class="m">x</i><span class="num">≤5</span></span>）令<span class="math"><i class="m">y</i><span class="num">=50</span></span>，由<span class="math"><span class="num">16</span><i class="m">x</i><sub><span class="num">1</span></sub><span class="num">+20=50</span></span>解得<span class="math"><i class="m">x</i><sub><span class="num">1</span></sub><span class="num">=</span><span class="fraction"><span><span class="num">15</span></span><span><span class="num">8</span></span></span></span>（<span class="num">min</span>）．'
      },
      {
        title: '求散热阶段水温降至<span class="num">50°C</span>的结束时刻<i class="m">x</i><sub><span class="num">2</span></sub>',
        body: '在散热阶段（<span class="math"><i class="m">x</i><span class="num">&gt;5</span></span>）令<span class="math"><i class="m">y</i><span class="num">=50</span></span>，由<span class="math"><span class="fraction"><span><span class="num">500</span></span><span><i class="m">x</i><sub><span class="num">2</span></sub></span></span><span class="num">=50</span></span>解得<span class="math"><i class="m">x</i><sub><span class="num">2</span></sub><span class="num">=10</span></span>（<span class="num">min</span>）．'
      },
      {
        title: '结合函数图象作差求持续时长',
        body: '由图象知当<span class="math"><span class="fraction"><span><span class="num">15</span></span><span><span class="num">8</span></span></span><span class="num">≤</span><i class="m">x</i><span class="num">≤10</span></span>时水温<span class="math"><i class="m">y</i><span class="num">≥50°C</span></span>，故持续时长为<span class="math"><i class="m">x</i><sub><span class="num">2</span></sub><span class="num">-</span><i class="m">x</i><sub><span class="num">1</span></sub><span class="num">=10-</span><span class="fraction"><span><span class="num">15</span></span><span><span class="num">8</span></span></span><span class="num">=</span><b style="color:#dc2626;"><span class="fraction"><span><span class="num">65</span></span><span><span class="num">8</span></span></span></b></span>（<span class="num">min</span>）（即<span class="num">8.125min</span>）．'
      }
    ],
    renderScene: function (step) {
      var W = 540, H = 420;
      var ox = 70, oy = 355;
      var sx = 24, sy = 2.7;
      var tx = function (x) { return ox + x * sx; };
      var ty = function (y) { return oy - y * sy; };

      var parts = [];
      parts.push('<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" height="100%" style="background:#ffffff;border-radius:12px;">');
      parts.push('<defs><marker id="arrQ5B" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#1e293b"/></marker></defs>');

      for (var xTick = 5; xTick <= 15; xTick += 5) {
        var gx = tx(xTick);
        parts.push('<line x1="' + gx + '" y1="' + ty(105) + '" x2="' + gx + '" y2="' + oy + '" stroke="#f1f5f9" stroke-width="1"/>');
      }
      for (var yTick = 20; yTick <= 100; yTick += 20) {
        var gy = ty(yTick);
        parts.push('<line x1="' + ox + '" y1="' + gy + '" x2="' + tx(16.5) + '" y2="' + gy + '" stroke="#f1f5f9" stroke-width="1"/>');
      }

      var ax = tx(0), ay = ty(20);
      var bx = tx(5), by = ty(100);
      var x1 = 15 / 8, x2 = 10;
      var px1 = tx(x1), px2 = tx(x2), py50 = ty(50);

      if (step >= 3) {
        parts.push('<rect x="' + px1.toFixed(1) + '" y="' + by + '" width="' + (px2 - px1).toFixed(1) + '" height="' + (oy - by) + '" fill="rgba(220,38,38,0.08)"/>');
      }

      parts.push('<line x1="' + ox + '" y1="' + oy + '" x2="' + tx(17.5) + '" y2="' + oy + '" stroke="#1e293b" stroke-width="2" marker-end="url(#arrQ5B)"/>');
      parts.push('<line x1="' + ox + '" y1="' + oy + '" x2="' + ox + '" y2="' + ty(114) + '" stroke="#1e293b" stroke-width="2" marker-end="url(#arrQ5B)"/>');
      parts.push('<text x="' + (ox - 12) + '" y="' + (oy + 20) + '" font-family="Times New Roman" font-style="italic" font-size="16" fill="#1e293b">O</text>');
      parts.push('<text x="' + tx(17.3) + '" y="' + (oy + 28) + '" text-anchor="end" font-family="Times New Roman" font-size="16" fill="#1e293b"><tspan font-style="italic">x</tspan>/min</text>');
      parts.push('<text x="' + (ox + 10) + '" y="' + ty(110) + '" font-family="Times New Roman" font-size="16" fill="#1e293b"><tspan font-style="italic">y</tspan>/°C</text>');

      parts.push('<line x1="' + bx + '" y1="' + by + '" x2="' + bx + '" y2="' + oy + '" stroke="#94a3b8" stroke-width="1.4" stroke-dasharray="5,4"/>');
      parts.push('<line x1="' + ox + '" y1="' + by + '" x2="' + bx + '" y2="' + by + '" stroke="#94a3b8" stroke-width="1.4" stroke-dasharray="5,4"/>');
      parts.push('<text x="' + bx + '" y="' + (oy + 22) + '" text-anchor="middle" font-family="Times New Roman" font-size="15" fill="#1e293b">5</text>');
      parts.push('<text x="' + (ox - 8) + '" y="' + (by + 5) + '" text-anchor="end" font-family="Times New Roman" font-size="15" fill="#1e293b">100</text>');
      parts.push('<text x="' + (ox - 8) + '" y="' + (ay + 5) + '" text-anchor="end" font-family="Times New Roman" font-size="15" fill="#1e293b">20</text>');

      parts.push('<line x1="' + ax + '" y1="' + ay + '" x2="' + bx + '" y2="' + by + '" stroke="#2563eb" stroke-width="3.2"/>');
      var dBC = '';
      for (var k = 0; k <= 90; k++) {
        var xv = 5 + (16.2 - 5) * (k / 90);
        var yv = 500 / xv;
        dBC += (k === 0 ? 'M' : 'L') + tx(xv).toFixed(2) + ',' + ty(yv).toFixed(2);
      }
      parts.push('<path d="' + dBC + '" fill="none" stroke="#7c3aed" stroke-width="3.2"/>');

      parts.push('<circle cx="' + ax + '" cy="' + ay + '" r="4.5" fill="#1e293b"/>');
      parts.push('<circle cx="' + bx + '" cy="' + by + '" r="5" fill="#1e293b"/>');
      parts.push('<text x="' + (ax + 8) + '" y="' + (ay + 16) + '" font-family="Times New Roman" font-style="italic" font-size="16" font-weight="bold" fill="#1e293b">A</text>');
      parts.push('<text x="' + (bx - 4) + '" y="' + (by - 10) + '" font-family="Times New Roman" font-style="italic" font-size="16" font-weight="bold" fill="#1e293b">B</text>');
      parts.push('<text x="' + tx(15.5) + '" y="' + (ty(500 / 15.5) - 10) + '" font-family="Times New Roman" font-style="italic" font-size="16" font-weight="bold" fill="#1e293b">C</text>');

      if (step >= 1) {
        parts.push('<line x1="' + ox + '" y1="' + py50 + '" x2="' + tx(16.2) + '" y2="' + py50 + '" stroke="#dc2626" stroke-width="2" stroke-dasharray="6,4"/>');
        parts.push('<text x="' + (ox - 8) + '" y="' + (py50 + 5) + '" text-anchor="end" font-family="Times New Roman" font-size="15" font-weight="bold" fill="#dc2626">50</text>');
        parts.push('<line x1="' + px1.toFixed(1) + '" y1="' + py50 + '" x2="' + px1.toFixed(1) + '" y2="' + oy + '" stroke="#dc2626" stroke-width="1.8" stroke-dasharray="4,3"/>');
        parts.push('<circle cx="' + px1.toFixed(1) + '" cy="' + py50 + '" r="5.5" fill="#dc2626" stroke="#ffffff" stroke-width="1.5"/>');
        parts.push('<text x="' + px1.toFixed(1) + '" y="' + (oy + 22) + '" text-anchor="middle" font-family="Times New Roman" font-size="14" font-weight="bold" fill="#dc2626">15/8</text>');
      }

      if (step >= 2) {
        parts.push('<line x1="' + px2.toFixed(1) + '" y1="' + py50 + '" x2="' + px2.toFixed(1) + '" y2="' + oy + '" stroke="#dc2626" stroke-width="1.8" stroke-dasharray="4,3"/>');
        parts.push('<circle cx="' + px2.toFixed(1) + '" cy="' + py50 + '" r="5.5" fill="#dc2626" stroke="#ffffff" stroke-width="1.5"/>');
        parts.push('<text x="' + px2.toFixed(1) + '" y="' + (oy + 22) + '" text-anchor="middle" font-family="Times New Roman" font-size="15" font-weight="bold" fill="#dc2626">10</text>');
      }

      if (step >= 3) {
        parts.push('<line x1="' + px1.toFixed(1) + '" y1="' + oy + '" x2="' + px2.toFixed(1) + '" y2="' + oy + '" stroke="#dc2626" stroke-width="6"/>');
        parts.push('<text x="' + ((px1 + px2) / 2).toFixed(1) + '" y="' + (oy + 42) + '" text-anchor="middle" font-family="SimSun, Times New Roman" font-size="14.5" font-weight="bold" fill="#dc2626">持续时长：10 - 15/8 = 65/8 (min)</text>');
      }

      parts.push('</svg>');
      return parts.join('');
    }
  });
})();

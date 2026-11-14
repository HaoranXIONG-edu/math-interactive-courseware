window.UNIT1_THEOREM_SLIDES = window.UNIT1_THEOREM_SLIDES || [];
window.UNIT1_SIMS = window.UNIT1_SIMS || {};

(function () {
  var fmt = function (str) {
    return window.svgAutoFormatText ? window.svgAutoFormatText(str) : str;
  };

  // =========================================================================
  // 第 1 页：二、新知探究 · 问题2（概念定义 + 应用(1) 等腰直角三角形平行线间距离）
  // =========================================================================
  window.defineSlide({
    id: 'u232_p2_q1',
    phase: 2,
    layout: 'layout-b',
    navTag: '问题2(1)·新定义与平行距离',
    section: '新知探究',
    title: '问题<span class="num">2</span>（<span class="num">1</span>）：“两个图形之间的距离”新定义与平行线段间距离',
    stem: [
      '<p><b>问题<span class="num">2</span>：</b>在平面内，把一个图形上任意一点与另一个图形上任意一点之间的距离的最小值，称为这两个图形之间的距离（即<i class="m">A</i>，<i class="m">B</i>分别是图形<i class="m">M</i>和图形<i class="m">N</i>上任意一点，当<i class="m">AB</i>的长最小时，称这个最小值为图形<i class="m">M</i>与<i class="m">N</i>之间的距离）．例如，如图<span class="num">1</span>，<span class="math"><i class="m">AB</i><span class="num">⊥</span><i class="m">l</i><sub><span class="num">2</span></sub></span>，线段<i class="m">AB</i>的长度称为点<i class="m">A</i>与直线<i class="m">l</i><sub><span class="num">2</span></sub>之间的距离；当<span class="math"><i class="m">l</i><sub><span class="num">1</span></sub><span class="num">∥</span><i class="m">l</i><sub><span class="num">2</span></sub></span>时，线段<i class="m">AB</i>的长度也是<i class="m">l</i><sub><span class="num">1</span></sub>与<i class="m">l</i><sub><span class="num">2</span></sub>之间的距离．</p>',
      '<p><b>【应用】</b>（<span class="num">1</span>）如图<span class="num">2</span>，在等腰<span class="math"><span class="num">Rt△</span><i class="m">BAC</i></span>中，<span class="math"><span class="num">∠</span><i class="m">A</i><span class="num">=90°</span></span>，<span class="math"><i class="m">AB</i><span class="num">=</span><i class="m">AC</i></span>，点<i class="m">D</i>为<i class="m">AB</i>边上一点，过点<i class="m">D</i>作<span class="math"><i class="m">DE</i><span class="num">∥</span><i class="m">BC</i></span>交<i class="m">AC</i>于点<i class="m">E</i>．若<span class="math"><i class="m">AB</i><span class="num">=6</span></span>，<span class="math"><i class="m">AD</i><span class="num">=4</span></span>，则<i class="m">DE</i>与<i class="m">BC</i>之间的距离是<span class="screen-blank" data-step="2" data-ans="<span class=\'math\'><span class=\'sqrt\'><span class=\'num\'>2</span></span></span>"></span>．</p>'
    ].join(''),
    steps: [
      {
        title: '作垂线段转化平行线段 <i class="m">DE</i> 与 <i class="m">BC</i> 之间的距离',
        body: '因为 <span class="math"><i class="m">DE</i><span class="num">∥</span><i class="m">BC</i></span>，过点 <i class="m">D</i> 作 <span class="math"><i class="m">DF</i><span class="num">⊥</span><i class="m">BC</i></span> 于点 <i class="m">F</i>，则垂线段 <i class="m">DF</i> 的长即为平行线段 <i class="m">DE</i> 与 <i class="m">BC</i> 之间的距离．由 <span class="math"><i class="m">AB</i><span class="num">=6</span></span>，<span class="math"><i class="m">AD</i><span class="num">=4</span></span>，得 <span class="math"><i class="m">BD</i><span class="num">=</span><i class="m">AB</i><span class="num">-</span><i class="m">AD</i><span class="num">=6-4=2</span></span>．'
      },
      {
        title: '在等腰 <span class="math"><span class="num">Rt△</span><i class="m">BDF</i></span> 中求出垂线段 <i class="m">DF</i> 的长',
        body: '在等腰 <span class="math"><span class="num">Rt△</span><i class="m">BAC</i></span> 中，<span class="math"><span class="num">∠</span><i class="m">A</i><span class="num">=90°</span></span>，<span class="math"><i class="m">AB</i><span class="num">=</span><i class="m">AC</i></span>，故 <span class="math"><span class="num">∠</span><i class="m">B</i><span class="num">=45°</span></span>．在 <span class="math"><span class="num">Rt△</span><i class="m">BDF</i></span> 中，<span class="math"><span class="num">∠</span><i class="m">BFD</i><span class="num">=90°</span></span>，<span class="math"><span class="num">∠</span><i class="m">B</i><span class="num">=45°</span></span>，<span class="math"><i class="m">BD</i><span class="num">=2</span></span>，所以 <span class="math"><i class="m">DF</i><span class="num">=</span><i class="m">BD</i><span class="num">·sin45°=2×</span><span class="fraction"><span><span class="sqrt"><span class="num">2</span></span></span><span><span class="num">2</span></span></span><span class="num">=</span><span class="sqrt"><span class="num">2</span></span></span>．'
      }
    ],
    renderScene: function (step) {
      var out = [];
      out.push('<svg viewBox="0 0 660 400" style="width:100%;height:100%;display:block;">');

      // 分隔卡片背景：左图1，右图2
      out.push('<rect x="14" y="16" width="236" height="368" rx="12" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1.5"/>');
      out.push('<rect x="262" y="16" width="384" height="368" rx="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>');

      // -------------------- 图1：平行线 l1 // l2 与垂线段 AB --------------------
      // l1: 过 A(115, 130) 斜向上，方向向量 (1, -0.42)
      // l2: 平行于 l1，过 B(148, 208)
      // 校验垂直: AB = (33, 78)，斜率 78/33 = 2.3636；直线方向 (78, -33)，完全垂直
      var Ax1 = 115, Ay1 = 130;
      var Bx1 = 148, By1 = 208;
      var ux = 78 / 84.7, uy = -33 / 84.7; // 单位方向向量
      var l1x1 = Ax1 - 75 * ux, l1y1 = Ay1 - 75 * uy;
      var l1x2 = Ax1 + 95 * ux, l1y2 = Ay1 + 95 * uy;
      var l2x1 = Bx1 - 95 * ux, l2y1 = By1 - 95 * uy;
      var l2x2 = Bx1 + 75 * ux, l2y2 = By1 + 75 * uy;

      out.push('<line x1="' + l1x1.toFixed(1) + '" y1="' + l1y1.toFixed(1) + '" x2="' + l1x2.toFixed(1) + '" y2="' + l1y2.toFixed(1) + '" stroke="#1e293b" stroke-width="2.4"/>');
      out.push('<line x1="' + l2x1.toFixed(1) + '" y1="' + l2y1.toFixed(1) + '" x2="' + l2x2.toFixed(1) + '" y2="' + l2y2.toFixed(1) + '" stroke="#1e293b" stroke-width="2.4"/>');

      // B 处直角符号：沿 BA 方向 (-33, -78)/84.7 与 沿 l2 右上方向 (ux, uy)
      var nx = -33 / 84.7, ny = -78 / 84.7;
      var s = 11;
      var r1x = Bx1 + s * nx, r1y = By1 + s * ny;
      var r2x = r1x + s * ux, r2y = r1y + s * uy;
      var r3x = Bx1 + s * ux, r3y = By1 + s * uy;
      out.push('<polyline points="' + r1x.toFixed(1) + ',' + r1y.toFixed(1) + ' ' + r2x.toFixed(1) + ',' + r2y.toFixed(1) + ' ' + r3x.toFixed(1) + ',' + r3y.toFixed(1) + '" fill="none" stroke="#dc2626" stroke-width="1.8"/>');

      // 垂线段 AB
      out.push('<line x1="' + Ax1 + '" y1="' + Ay1 + '" x2="' + Bx1 + '" y2="' + By1 + '" stroke="#dc2626" stroke-width="2.5"/>');
      out.push('<circle cx="' + Ax1 + '" cy="' + Ay1 + '" r="4" fill="#1e293b"/>');
      out.push('<circle cx="' + Bx1 + '" cy="' + By1 + '" r="4" fill="#1e293b"/>');

      // 图1文字标注
      out.push('<text x="' + (Ax1 - 8) + '" y="' + (Ay1 - 10) + '" font-size="16" font-weight="700" fill="#0f172a" text-anchor="end">' + fmt('A') + '</text>');
      out.push('<text x="' + (Bx1 + 8) + '" y="' + (By1 + 20) + '" font-size="16" font-weight="700" fill="#0f172a">' + fmt('B') + '</text>');
      out.push('<text x="' + (l1x2 + 6).toFixed(1) + '" y="' + (l1y2 + 4).toFixed(1) + '" font-size="16" fill="#1e293b"><tspan font-family="Times New Roman" font-style="italic">l</tspan><tspan dy="4" font-size="12" font-family="Times New Roman">1</tspan></text>');
      out.push('<text x="' + (l2x2 + 6).toFixed(1) + '" y="' + (l2y2 + 4).toFixed(1) + '" font-size="16" fill="#1e293b"><tspan font-family="Times New Roman" font-style="italic">l</tspan><tspan dy="4" font-size="12" font-family="Times New Roman">2</tspan></text>');
      out.push('<text x="132" y="346" font-size="15" font-weight="700" fill="#475569" text-anchor="middle">' + fmt('图1') + '</text>');

      // -------------------- 图2：等腰 Rt△BAC，∠A=90°，AB=AC=6，AD=4 --------------------
      // 将直角顶点 A 置于上方偏左，或按常见教材图2（A在顶、BC水平在下，或A在左下直角）：
      // 原卷图2：A在顶（∠BAC=90°），BC水平在底！校验：等腰Rt△BAC，A在顶(454, 76)，B在左下(304, 226)，C在右下(604, 226)
      // 检验向量：AB = (-150, 150)，AC = (150, 150)，AB·AC = -22500 + 22500 = 0（严格90°！且 |AB|=|AC|=150√2，完全等比例！）
      var Ax = 454, Ay = 76;
      var Bx = 304, By = 226;
      var Cx = 604, Cy = 226;
      // AD = 4, AB = 6 => D 为 AB 的 2/3 分点：D = A + (2/3)*(B - A) = (354, 176)
      var Dx = 354, Dy = 176;
      var Ex = 554, Ey = 176;
      // F 为 D 在 BC 上的垂足：因为 BC 水平 (y = 226)，故 F(354, 226)！
      var Fx = 354, Fy = 226;

      // step >= 2 时高亮 Rt△BDF 区域
      if (step >= 2) {
        out.push('<polygon points="' + Bx + ',' + By + ' ' + Dx + ',' + Dy + ' ' + Fx + ',' + Fy + '" fill="rgba(220,38,38,0.14)" stroke="none"/>');
      }

      // A 处直角符号：沿 AB 单位向量 (-1/√2, 1/√2) 与 AC 单位向量 (1/√2, 1/√2)
      var ra = 12;
      var a1x = Ax - ra, a1y = Ay + ra;
      var a2x = Ax, a2y = Ay + 2 * ra;
      var a3x = Ax + ra, a3y = Ay + ra;
      out.push('<polyline points="' + a1x + ',' + a1y + ' ' + a2x + ',' + a2y + ' ' + a3x + ',' + a3y + '" fill="none" stroke="#64748b" stroke-width="1.6"/>');

      // △BAC 轮廓与线段 DE
      out.push('<polygon points="' + Ax + ',' + Ay + ' ' + Bx + ',' + By + ' ' + Cx + ',' + Cy + '" fill="rgba(59,130,246,0.04)" stroke="#1e293b" stroke-width="2.5" stroke-linejoin="round"/>');
      out.push('<line x1="' + Dx + '" y1="' + Dy + '" x2="' + Ex + '" y2="' + Ey + '" stroke="#0284c7" stroke-width="2.6"/>');

      // 顶点圆点与标签
      out.push('<circle cx="' + Ax + '" cy="' + Ay + '" r="4" fill="#1e293b"/>');
      out.push('<circle cx="' + Bx + '" cy="' + By + '" r="4" fill="#1e293b"/>');
      out.push('<circle cx="' + Cx + '" cy="' + Cy + '" r="4" fill="#1e293b"/>');
      out.push('<circle cx="' + Dx + '" cy="' + Dy + '" r="4" fill="#0284c7"/>');
      out.push('<circle cx="' + Ex + '" cy="' + Ey + '" r="4" fill="#0284c7"/>');

      out.push('<text x="' + Ax + '" y="' + (Ay - 12) + '" font-size="16" font-weight="700" fill="#0f172a" text-anchor="middle">' + fmt('A') + '</text>');
      out.push('<text x="' + (Bx - 12) + '" y="' + (By + 6) + '" font-size="16" font-weight="700" fill="#0f172a" text-anchor="end">' + fmt('B') + '</text>');
      out.push('<text x="' + (Cx + 12) + '" y="' + (Cy + 6) + '" font-size="16" font-weight="700" fill="#0f172a">' + fmt('C') + '</text>');
      out.push('<text x="' + (Dx - 12) + '" y="' + (Dy - 6) + '" font-size="16" font-weight="700" fill="#0284c7" text-anchor="end">' + fmt('D') + '</text>');
      out.push('<text x="' + (Ex + 12) + '" y="' + (Ey - 6) + '" font-size="16" font-weight="700" fill="#0284c7">' + fmt('E') + '</text>');

      // step >= 1：作垂线 DF ⊥ BC，标出 F、直角符号及 AD=4, BD=2, ∠B=45°
      if (step >= 1) {
        // F 处直角符号
        out.push('<polyline points="' + (Fx - 10) + ',' + Fy + ' ' + (Fx - 10) + ',' + (Fy - 10) + ' ' + Fx + ',' + (Fy - 10) + '" fill="none" stroke="#dc2626" stroke-width="1.8"/>');
        // 红色虚线 DF
        out.push('<line x1="' + Dx + '" y1="' + Dy + '" x2="' + Fx + '" y2="' + Fy + '" stroke="#dc2626" stroke-width="2.8" stroke-dasharray="6,4"/>');
        out.push('<circle cx="' + Fx + '" cy="' + Fy + '" r="4" fill="#dc2626"/>');
        out.push('<text x="' + Fx + '" y="' + (Fy + 22) + '" font-size="16" font-weight="700" fill="#dc2626" text-anchor="middle">' + fmt('F') + '</text>');

        // 标注 AD=4 与 BD=2
        out.push('<text x="392" y="118" font-size="14" font-weight="700" fill="#2563eb" text-anchor="end">' + fmt('AD=4') + '</text>');
        out.push('<text x="318" y="196" font-size="14" font-weight="700" fill="#dc2626" text-anchor="end">' + fmt('BD=2') + '</text>');

        // ∠B = 45° 角弧
        out.push('<path d="M 326 226 A 22 22 0 0 0 319.6 210.4" fill="none" stroke="#d97706" stroke-width="2"/>');
        out.push('<text x="342" y="218" font-size="12" font-weight="700" fill="#b45309">' + fmt('45°') + '</text>');
      }

      // step >= 2：标出 DF = √2 及底部结论卡片
      if (step >= 2) {
        out.push('<text x="' + (Fx + 8) + '" y="' + ((Dy + Fy) / 2 + 5) + '" font-size="15" font-weight="800" fill="#dc2626">' + fmt('DF=√2') + '</text>');
        if (window.svgFoCard) {
          out.push(window.svgFoCard(284, 266, 340, 52,
            '<div style="font-size:14px;color:#0f172a;font-weight:700;text-align:center;">' +
            '等腰 <span class="math"><span class="num">Rt△</span><i class="m">BDF</i></span> 中：<span class="math"><i class="m">DF</i><span class="num">=</span><i class="m">BD</i><span class="num">·sin45°=2×</span><span class="fraction"><span><span class="sqrt"><span class="num">2</span></span></span><span><span class="num">2</span></span></span><span class="num">=</span><span style="color:#dc2626;"><span class="sqrt"><span class="num">2</span></span></span></span>' +
            '</div>'
          ));
        }
      }

      out.push('<text x="454" y="346" font-size="15" font-weight="700" fill="#475569" text-anchor="middle">' + fmt('图2') + '</text>');
      out.push('</svg>');
      return out.join('');
    }
  });

  // =========================================================================
  // 第 2 页：二、新知探究 · 问题2（2）—— 点A与点B之间的距离、原点O与双曲线C₁之间的距离
  // =========================================================================
  window.defineSlide({
    id: 'u232_p2_q2',
    phase: 2,
    layout: 'layout-b',
    navTag: '问题2(2)·原点与双曲线距离',
    section: '新知探究',
    title: '问题<span class="num">2</span>（<span class="num">2</span>）：求交点<i class="m">A</i>，<i class="m">B</i>之间的距离及原点<i class="m">O</i>与双曲线<i class="m">C</i><sub><span class="num">1</span></sub>之间的距离',
    state: { xP: 1.732 },
    stem: [
      '<div style="background:#f0f9ff;border-left:4px solid #0284c7;padding:6px 12px;margin-bottom:8px;border-radius:6px;font-size:0.92em;color:#0369a1;">',
      '<b>【前问已知】</b>图形<i class="m">M</i>与图形<i class="m">N</i>之间的距离定义为两图形上任意两点间距离的最小值．',
      '</div>',
      '<p>（<span class="num">2</span>）如图<span class="num">3</span>，已知直线<span class="math"><i class="m">l</i><sub><span class="num">3</span></sub><span class="num">：</span><i class="m">y</i><span class="num">=-</span><i class="m">x</i><span class="num">+4</span></span>与双曲线<span class="math"><i class="m">C</i><sub><span class="num">1</span></sub><span class="num">：</span><i class="m">y</i><span class="num">=</span><span class="fraction"><span><i class="m">k</i></span><span><i class="m">x</i></span></span></span>（<span class="math"><i class="m">x</i><span class="num">&gt;0</span></span>）交于<span class="math"><i class="m">A</i><span class="num">(1,</span><i class="m">m</i><span class="num">)</span></span>与<i class="m">B</i>两点，点<i class="m">A</i>与点<i class="m">B</i>之间的距离是<span class="screen-blank" data-step="1" data-ans="<span class=\'num\'>2</span><span class=\'sqrt\'><span class=\'num\'>2</span></span>"></span>，点<i class="m">O</i>与双曲线<i class="m">C</i><sub><span class="num">1</span></sub>之间的距离是<span class="screen-blank" data-step="2" data-ans="<span class=\'sqrt\'><span class=\'num\'>6</span></span>"></span>．</p>'
    ].join(''),
    steps: [
      {
        title: '求交点 <i class="m">A</i>，<i class="m">B</i> 的坐标并计算线段 <i class="m">AB</i> 的长',
        body: '将 <span class="math"><i class="m">A</i><span class="num">(1,</span><i class="m">m</i><span class="num">)</span></span> 代入 <span class="math"><i class="m">y</i><span class="num">=-</span><i class="m">x</i><span class="num">+4</span></span> 得 <span class="math"><i class="m">m</i><span class="num">=3</span></span>，即 <span class="math"><i class="m">A</i><span class="num">(1,3)</span></span>；代入 <span class="math"><i class="m">y</i><span class="num">=</span><span class="fraction"><span><i class="m">k</i></span><span><i class="m">x</i></span></span></span> 得 <span class="math"><i class="m">k</i><span class="num">=3</span></span>．联立 <span class="math"><i class="m">y</i><span class="num">=-</span><i class="m">x</i><span class="num">+4</span></span> 与 <span class="math"><i class="m">y</i><span class="num">=</span><span class="fraction"><span><span class="num">3</span></span><span><i class="m">x</i></span></span></span> 解得 <span class="math"><i class="m">B</i><span class="num">(3,1)</span></span>．由勾股定理得 <span class="math"><i class="m">AB</i><span class="num">=</span><span class="sqrt"><span class="num">(3-1)</span><sup><span class="num">2</span></sup><span class="num">+(1-3)</span><sup><span class="num">2</span></sup></span><span class="num">=2</span><span class="sqrt"><span class="num">2</span></span></span>．'
      },
      {
        title: '利用对称性（或配方法）求原点 <i class="m">O</i> 到双曲线 <i class="m">C</i><sub><span class="num">1</span></sub> 的最短距离',
        body: '设双曲线 <span class="math"><i class="m">C</i><sub><span class="num">1</span></sub><span class="num">：</span><i class="m">y</i><span class="num">=</span><span class="fraction"><span><span class="num">3</span></span><span><i class="m">x</i></span></span></span>（<span class="math"><i class="m">x</i><span class="num">&gt;0</span></span>）上任意一点 <span class="math"><i class="m">P</i><span class="num">(</span><i class="m">x</i><span class="num">,</span><span class="fraction"><span><span class="num">3</span></span><span><i class="m">x</i></span></span><span class="num">)</span></span>，则 <span class="math"><i class="m">OP</i><sup><span class="num">2</span></sup><span class="num">=</span><i class="m">x</i><sup><span class="num">2</span></sup><span class="num">+</span><span class="fraction"><span><span class="num">9</span></span><span><i class="m">x</i><sup><span class="num">2</span></sup></span></span><span class="num">=(</span><i class="m">x</i><span class="num">-</span><span class="fraction"><span><span class="num">3</span></span><span><i class="m">x</i></span></span><span class="num">)</span><sup><span class="num">2</span></sup><span class="num">+6≥6</span></span>．当且仅当 <span class="math"><i class="m">x</i><span class="num">=</span><span class="fraction"><span><span class="num">3</span></span><span><i class="m">x</i></span></span></span>（即点 <i class="m">P</i> 在对称轴 <span class="math"><i class="m">y</i><span class="num">=</span><i class="m">x</i></span> 上，坐标为 <span class="math"><span class="num">(</span><span class="sqrt"><span class="num">3</span></span><span class="num">,</span><span class="sqrt"><span class="num">3</span></span><span class="num">)</span></span>）时，<span class="math"><i class="m">OP</i><sub><span class="num">min</span></sub><span class="num">=</span><span class="sqrt"><span class="num">6</span></span></span>．'
      }
    ],
    controls: function (step, state) {
      if (step < 2) return '';
      return window.slider('xP', '拖动双曲线上动点<i class="m">P</i>', 0.7, 4.2, state.xP || 1.732, 0.05);
    },
    renderScene: function (step, state) {
      var c = window.createCoordCanvas(640, 400, {
        xMin: -0.6, xMax: 4.8,
        yMin: -0.6, yMax: 4.6,
        xStep: 1, yStep: 1,
        showGrid: true
      });

      // 绘制直线 l3: y = -x + 4
      c.line(-0.3, 4.3, 4.3, -0.3, '#475569', 2.2);
      c.text(4.15, 0.25, 'l3', '#334155', 15);

      // 绘制第一象限双曲线 C1: y = 3/x
      c.curve(function (x) { return 3 / x; }, 0.68, 4.5, '#2563eb', 2.8);
      c.text(0.88, 3.85, 'C1', '#2563eb', 15);

      // step = 0：仅标出交点 A, B 字母及图3标签
      if (step === 0) {
        c.point(1, 3, 'A', '#0f172a', 8, -8);
        c.point(3, 1, 'B', '#0f172a', 8, -8);
      }

      // step >= 1：标出 A(1,3), B(3,1) 及等腰直角辅助三角形 AHB (H(1,1))，显示 AB = 2√2
      if (step >= 1) {
        c.polygon([[1, 3], [1, 1], [3, 1]], 'rgba(245,158,11,0.14)', '#d97706', 1.6);
        c.line(1, 3, 1, 1, '#d97706', 1.8, '5,4');
        c.line(1, 1, 3, 1, '#d97706', 1.8, '5,4');
        c.line(1, 3, 3, 1, '#dc2626', 3.0);

        c.point(1, 3, 'A(1,3)', '#dc2626', 8, -8);
        c.point(3, 1, 'B(3,1)', '#dc2626', 8, -8);
        c.text(0.75, 2.0, '2', '#b45309', 14);
        c.text(2.0, 0.72, '2', '#b45309', 14);
        c.text(2.35, 2.28, 'AB=2√2', '#dc2626', 15);
      }

      // step >= 2：画出第一象限角平分线 y = x，标出最近点 P0(√3, √3) 与可拖动动点 P(x, 3/x)
      if (step >= 2) {
        c.line(0, 0, 4.1, 4.1, '#059669', 2.0, '6,4');
        c.text(3.85, 4.18, 'y=x', '#059669', 14);

        var s3 = Math.sqrt(3);
        c.line(0, 0, s3, s3, '#059669', 3.0);
        c.point(s3, s3, 'P0(√3,√3)', '#059669', 8, 16);

        var xp = Number(state && state.xP) || s3;
        var yp = 3 / xp;
        var opLen = Math.sqrt(xp * xp + yp * yp);
        c.line(0, 0, xp, yp, '#7c3aed', 2.2, '4,3');
        c.point(xp, yp, 'P', '#7c3aed', -8, -8);

        if (window.svgFoCard) {
          c.raw(window.svgFoCard(330, 22, 292, 68,
            '<div style="font-size:13px;line-height:1.45;color:#1e293b;">' +
            '<div><span style="color:#7c3aed;font-weight:700;">当前动点：</span><span class="math"><i class="m">P</i></span></div>' +
            '<div><span style="color:#059669;font-weight:700;">最短距离：</span><span class="math"><i class="m">OP</i><sub><span class="num">0</span></sub><span class="num">=</span><span class="sqrt"><span class="num">6</span></span></span>（当 <span class="math"><i class="m">x</i><span class="num">=</span><i class="m">y</i><span class="num">=</span><span class="sqrt"><span class="num">3</span></span></span>）</div>' +
            '</div>'
          ));
        }
      }

      c.raw('<text x="320" y="388" font-size="14" font-weight="700" fill="#475569" text-anchor="middle">' + fmt('图3') + '</text>');
      return c.done();
    }
  });

  // =========================================================================
  // 第 3 页：二、新知探究 · 问题2（3）—— 【拓展】高速路旁修建隔音屏障的长度
  // =========================================================================
  window.defineSlide({
    id: 'u232_p2_q3',
    phase: 2,
    layout: 'layout-b',
    navTag: '问题2(3)·隔音屏障长度',
    section: '新知探究',
    title: '问题<span class="num">2</span>（<span class="num">3</span>）【拓展】：高速路与双曲线小区外延间修建隔音屏障的长度',
    stem: [
      '<p><b>【拓展】</b>（<span class="num">3</span>）按规定，住宅小区的外延到高速路的距离不超过<span class="num">80m</span>时，需要在高速路旁修建与高速路相同走向的隔音屏障（如图<span class="num">4</span>）．现以高速路上某一合适位置为坐标原点建立如图<span class="num">5</span>所示的直角坐标系，此时高速路所在直线<i class="m">l</i><sub><span class="num">4</span></sub>的函数表达式为<span class="math"><i class="m">y</i><span class="num">=-</span><i class="m">x</i></span>，小区外延所在双曲线<i class="m">C</i><sub><span class="num">2</span></sub>的函数表达式为<span class="math"><i class="m">y</i><span class="num">=</span><span class="fraction"><span><span class="num">3000</span></span><span><i class="m">x</i></span></span></span>（<span class="math"><i class="m">x</i><span class="num">&gt;0</span></span>），则需要在高速路旁修建隔音屏障的长度是<span class="screen-blank" data-step="3" data-ans="<span class=\'num\'>40m</span>"></span>．</p>'
    ].join(''),
    steps: [
      {
        title: '平移直线 <i class="m">l</i><sub><span class="num">4</span></sub> 构造距离等于 <span class="num">80m</span> 的临界平行线 <span class="math"><i class="m">l</i><span class="num">′</span></span>',
        body: '在第一象限作与高速路 <span class="math"><i class="m">l</i><sub><span class="num">4</span></sub><span class="num">：</span><i class="m">y</i><span class="num">=-</span><i class="m">x</i></span> 平行且距离为 <span class="num">80m</span> 的直线 <span class="math"><i class="m">l</i><span class="num">′</span></span>，交 <i class="m">x</i> 轴、<i class="m">y</i> 轴于点 <i class="m">E</i>，<i class="m">F</i>．因 <span class="math"><span class="num">△</span><i class="m">OEF</i></span> 是等腰直角三角形，斜边高为 <span class="num">80</span>，故 <span class="math"><i class="m">OE</i><span class="num">=</span><i class="m">OF</i><span class="num">=80</span><span class="sqrt"><span class="num">2</span></span></span>，得临界平行线 <span class="math"><i class="m">l</i><span class="num">′：</span><i class="m">y</i><span class="num">=-</span><i class="m">x</i><span class="num">+80</span><span class="sqrt"><span class="num">2</span></span></span>．'
      },
      {
        title: '联立临界直线 <span class="math"><i class="m">l</i><span class="num">′</span></span> 与双曲线 <i class="m">C</i><sub><span class="num">2</span></sub> 求临界交点 <i class="m">M</i>，<i class="m">N</i> 坐标',
        body: '联立 <span class="math"><i class="m">y</i><span class="num">=-</span><i class="m">x</i><span class="num">+80</span><span class="sqrt"><span class="num">2</span></span></span> 与 <span class="math"><i class="m">y</i><span class="num">=</span><span class="fraction"><span><span class="num">3000</span></span><span><i class="m">x</i></span></span></span>，整理得 <span class="math"><i class="m">x</i><sup><span class="num">2</span></sup><span class="num">-80</span><span class="sqrt"><span class="num">2</span></span><i class="m">x</i><span class="num">+3000=0</span></span>，即 <span class="math"><span class="num">(</span><i class="m">x</i><span class="num">-30</span><span class="sqrt"><span class="num">2</span></span><span class="num">)(</span><i class="m">x</i><span class="num">-50</span><span class="sqrt"><span class="num">2</span></span><span class="num">)=0</span></span>，解得 <span class="math"><i class="m">M</i><span class="num">(30</span><span class="sqrt"><span class="num">2</span></span><span class="num">,50</span><span class="sqrt"><span class="num">2</span></span><span class="num">)</span></span>，<span class="math"><i class="m">N</i><span class="num">(50</span><span class="sqrt"><span class="num">2</span></span><span class="num">,30</span><span class="sqrt"><span class="num">2</span></span><span class="num">)</span></span>．'
      },
      {
        title: '由平行投射（或两点间距离公式）求隔音屏障长度',
        body: '过 <i class="m">M</i>，<i class="m">N</i> 分别向高速路 <i class="m">l</i><sub><span class="num">4</span></sub> 作垂线得垂足 <span class="math"><i class="m">M</i><span class="num">′</span></span>，<span class="math"><i class="m">N</i><span class="num">′</span></span>，则隔音屏障长度 <span class="math"><i class="m">M</i><span class="num">′</span><i class="m">N</i><span class="num">′=</span><i class="m">MN</i><span class="num">=</span><span class="sqrt"><span class="num">(50</span><span class="sqrt"><span class="num">2</span></span><span class="num">-30</span><span class="sqrt"><span class="num">2</span></span><span class="num">)</span><sup><span class="num">2</span></sup><span class="num">+(30</span><span class="sqrt"><span class="num">2</span></span><span class="num">-50</span><span class="sqrt"><span class="num">2</span></span><span class="num">)</span><sup><span class="num">2</span></sup></span><span class="num">=40</span></span>（<span class="num">m</span>）．'
      }
    ],
    renderScene: function (step) {
      var c = window.createCoordCanvas(640, 400, {
        xMin: -40, xMax: 135,
        yMin: -40, yMax: 125,
        xStep: 40, yStep: 40,
        showGrid: true
      });

      var s2 = Math.sqrt(2);
      var b0 = 80 * s2; // 113.137
      var xM = 30 * s2, yM = 50 * s2; // (42.43, 70.71)
      var xN = 50 * s2, yN = 30 * s2; // (70.71, 42.43)
      // 垂足 M', N' 在直线 y = -x 上：点 (x,y) 到 y = -x 的正交投影为 ((x-y)/2, (y-x)/2)
      // M(30√2, 50√2) -> M'(-10√2, 10√2) ≈ (-14.14, 14.14)
      // N(50√2, 30√2) -> N'(10√2, -10√2) ≈ (14.14, -14.14)
      var xMp = -10 * s2, yMp = 10 * s2;
      var xNp = 10 * s2, yNp = -10 * s2;

      // 高速路直线 l4: y = -x
      c.line(-36, 36, 36, -36, '#334155', 2.8);
      c.text(32, -35, 'l4: y=-x', '#1e293b', 14);

      // 小区外延双曲线 C2: y = 3000/x
      c.curve(function (x) { return 3000 / x; }, 25, 126, '#2563eb', 2.8);
      c.text(106, 34, 'C2', '#2563eb', 15);

      // 小区阴影示意区域（双曲线右上方）
      c.text(82, 86, '住宅小区', '#1d4ed8', 15);

      // step >= 1：绘制平移距离为 80m 的临界平行线 l': y = -x + 80√2
      if (step >= 1) {
        c.line(-8, b0 + 8, b0 + 8, -8, '#d97706', 2.4, '7,4');
        c.point(0, b0, 'F(0,80√2)', '#b45309', 14, 12);
        c.point(b0, 0, 'E(80√2,0)', '#b45309', 8, -8);

        // 原点 O 到 l' 的公垂线段 OH，H(40√2, 40√2) ≈ (56.57, 56.57)
        var xH = 40 * s2, yH = 40 * s2;
        c.line(0, 0, xH, yH, '#059669', 2.2, '4,3');
        c.point(xH, yH, '', '#059669');
        c.text(24, 34, 'd=80m', '#059669', 14);
      }

      // step >= 2：标出临界交点 M(30√2, 50√2) 与 N(50√2, 30√2)
      if (step >= 2) {
        c.line(xM, yM, xN, yN, '#dc2626', 3.0);
        c.point(xM, yM, 'M(30√2,50√2)', '#dc2626', 8, -8);
        c.point(xN, yN, 'N(50√2,30√2)', '#dc2626', 8, -8);
      }

      // step >= 3：从 M, N 向高速路 l4 作垂线得 M', N'，高亮隔音屏障段 M'N' = 40m
      if (step >= 3) {
        c.polygon([[xM, yM], [xN, yN], [xNp, yNp], [xMp, yMp]], 'rgba(220,38,38,0.12)', 'none', 0);
        c.line(xM, yM, xMp, yMp, '#dc2626', 1.8, '5,4');
        c.line(xN, yN, xNp, yNp, '#dc2626', 1.8, '5,4');
        c.line(xMp, yMp, xNp, yNp, '#dc2626', 5.0);
        c.point(xMp, yMp, 'M′', '#dc2626', -8, 16);
        c.point(xNp, yNp, 'N′', '#dc2626', -8, 16);

        if (window.svgFoCard) {
          c.raw(window.svgFoCard(335, 18, 288, 62,
            '<div style="font-size:13px;line-height:1.45;color:#0f172a;font-weight:700;">' +
            '<div>临界弦长：<span class="math"><i class="m">MN</i><span class="num">=</span><span class="sqrt"><span class="num">(20</span><span class="sqrt"><span class="num">2</span></span><span class="num">)</span><sup><span class="num">2</span></sup><span class="num">+(-20</span><span class="sqrt"><span class="num">2</span></span><span class="num">)</span><sup><span class="num">2</span></sup></span><span class="num">=40m</span></span></div>' +
            '<div style="color:#dc2626;">隔音屏障长：<span class="math"><i class="m">M</i><span class="num">′</span><i class="m">N</i><span class="num">′=</span><i class="m">MN</i><span class="num">=40m</span></span></div>' +
            '</div>'
          ));
        }
      }

      c.raw('<text x="320" y="388" font-size="14" font-weight="700" fill="#475569" text-anchor="middle">' + fmt('图5') + '</text>');
      return c.done();
    }
  });
})();

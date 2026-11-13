window.UNIT1_THEOREM_SLIDES = window.UNIT1_THEOREM_SLIDES || [];
window.UNIT1_SIMS = window.UNIT1_SIMS || {};

(function () {
  // =========================================================
  // Slide 1: 四、分层训练 · 第 1 题（圆柱形容器底面积与液面高度反比例区间问题）
  // =========================================================
  window.defineSlide({
    id: 'train-q1-cylinder',
    phase: 3,
    navTag: '训练1·圆柱容积区间',
    section: '分层训练',
    title: '第<span class="num">1</span>题：圆柱形容器底面积<i class="m">S</i>与液面高度<i class="m">h</i>的反比例关系',
    layout: 'layout-b',
    initState: { hVal: 12 },
    stem: `<p><span class="num">1．</span>向容积固定的圆柱形容器中注入一定体积的液体，容器底面积<i class="m">S</i>（单位：<span class="num">cm</span><sup><span class="num">2</span></sup>）与液面高度<i class="m">h</i>（单位：<span class="num">cm</span>）成反比例．已知当液面高度<span class="math"><i class="m">h</i><span class="num">=12cm</span></span>时，底面积<span class="math"><i class="m">S</i><span class="num">=25cm</span><sup><span class="num">2</span></sup></span>；若实验要求液面高度控制在<span class="math"><span class="num">10cm≤</span><i class="m">h</i><span class="num">≤15cm</span></span>之间，则所选容器底面积<i class="m">S</i>的取值范围是<span class="screen-blank" data-step="3" data-ans="<span class='num'>20cm</span><sup><span class='num'>2</span></sup><span class='num'>≤</span><i class='m'>S</i><span class='num'>≤30cm</span><sup><span class='num'>2</span></sup>"></span>．</p>`,
    steps: [
      {
        title: '由已知状态求液体体积与函数表达式',
        html: `由圆柱体积公式<span class="math"><i class="m">V</i><span class="num">=</span><i class="m">Sh</i></span>，当<span class="math"><i class="m">h</i><span class="num">=12cm</span></span>，<span class="math"><i class="m">S</i><span class="num">=25cm</span><sup><span class="num">2</span></sup></span>时，<span class="math"><i class="m">V</i><span class="num">=25×12=300</span></span>（<span class="num">cm</span><sup><span class="num">3</span></sup>），故<span class="math"><i class="m">S</i><span class="num">=</span><span class="fraction"><span><span class="num">300</span></span><span><i class="m">h</i></span></span></span>（<span class="math"><i class="m">h</i><span class="num">&gt;0</span></span>）．`
      },
      {
        title: '计算液面高度端点对应的底面积',
        html: `当<span class="math"><i class="m">h</i><span class="num">=10cm</span></span>时，<span class="math"><i class="m">S</i><span class="num">=</span><span class="fraction"><span><span class="num">300</span></span><span><span class="num">10</span></span></span><span class="num">=30</span></span>（<span class="num">cm</span><sup><span class="num">2</span></sup>）；当<span class="math"><i class="m">h</i><span class="num">=15cm</span></span>时，<span class="math"><i class="m">S</i><span class="num">=</span><span class="fraction"><span><span class="num">300</span></span><span><span class="num">15</span></span></span><span class="num">=20</span></span>（<span class="num">cm</span><sup><span class="num">2</span></sup>）．`
      },
      {
        title: '利用反比例函数增减性确定底面积范围',
        html: `因为<span class="math"><i class="m">k</i><span class="num">=300&gt;0</span></span>，当<span class="math"><i class="m">h</i><span class="num">&gt;0</span></span>时，<i class="m">S</i>随<i class="m">h</i>的增大而减小．故当<span class="math"><span class="num">10cm≤</span><i class="m">h</i><span class="num">≤15cm</span></span>时，底面积<i class="m">S</i>的取值范围是<b style="color:#dc2626;"><span class="num">20cm</span><sup><span class="num">2</span></sup><span class="num">≤</span><i class="m">S</i><span class="num">≤30cm</span><sup><span class="num">2</span></sup></b>．`
      }
    ],
    controls: function (step, state, ui) {
      if (step < 1) return '';
      var hVal = Number(state.hVal || 12);
      return ui.slider('hVal', '调节液面高度<i class="m">h</i>', 8, 20, hVal, 0.5, 'cm');
    },
    renderScene: function (step, state) {
      var c = window.createCoordCanvas({
        width: 580,
        height: 440,
        padding: { top: 42, right: 192, bottom: 52, left: 60 },
        xMin: 0,
        xMax: 20,
        yMin: 0,
        yMax: 40,
        xStep: 5,
        yStep: 10,
        xLabel: 'h/cm',
        yLabel: 'S/cm²'
      });

      // Step 0: Zero-Spoiler — only show blank coordinate axes
      if (step === 0) {
        c.text(c.X(10), c.Y(20), '请先根据题意分析S与h的函数关系', {
          size: 15,
          fill: '#64748b',
          weight: 'bold',
          anchor: 'middle'
        });
        return c.done();
      }

      // Step >= 1: Plot S = 300/h and point (12, 25) + right-side cylinder diagram
      c.curve(function (h) { return 300 / h; }, 7.6, 19.5, {
        stroke: '#2563eb',
        width: 3
      });
      c.text(c.X(9.2), c.Y(36.8), 'S=300/h (h>0)', {
        size: 14.5,
        fill: '#1d4ed8',
        weight: 'bold'
      });

      // Known point (12, 25)
      c.projPoint(12, 25, '(12,25)', {
        color: '#2563eb',
        r: 5,
        dx: 8,
        dy: -8,
        showTickX: '12',
        showTickY: '25'
      });

      // Interactive slider point & mini cylinder diagram in right-side panel (outside coordinate grid)
      var hCur = Number(state.hVal || 12);
      var sCur = 300 / hCur;
      if (Math.abs(hCur - 12) > 0.15) {
        c.point(hCur, sCur, '', { color: '#0ea5e9', r: 5.5 });
      }

      var cylX = 486;
      var cylBaseY = 196;
      var cylW = Math.max(36, Math.min(76, sCur * 1.9));
      var cylH = Math.max(28, Math.min(88, hCur * 4.4));
      var rx = cylW / 2;
      var ry = 8;
      var topY = cylBaseY - cylH;
      var containerTopY = cylBaseY - 98;

      c.add(
        '<g>' +
          '<rect x="404" y="46" width="164" height="196" rx="10" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>' +
          '<text x="486" y="68" font-size="12.5" font-weight="bold" fill="#334155" text-anchor="middle">定容积液体 V=300cm³</text>' +
          // Liquid body
          '<path d="M ' + (cylX - rx).toFixed(1) + ' ' + topY.toFixed(1) +
            ' L ' + (cylX - rx).toFixed(1) + ' ' + cylBaseY.toFixed(1) +
            ' A ' + rx.toFixed(1) + ' ' + ry + ' 0 0 0 ' + (cylX + rx).toFixed(1) + ' ' + cylBaseY.toFixed(1) +
            ' L ' + (cylX + rx).toFixed(1) + ' ' + topY.toFixed(1) + ' Z" fill="rgba(56,189,248,0.38)" stroke="#0284c7" stroke-width="1.5"/>' +
          '<ellipse cx="' + cylX + '" cy="' + topY.toFixed(1) + '" rx="' + rx.toFixed(1) + '" ry="' + ry + '" fill="rgba(14,165,233,0.45)" stroke="#0284c7" stroke-width="1.5"/>' +
          // Cylinder wall outline
          '<line x1="' + (cylX - rx).toFixed(1) + '" y1="' + containerTopY + '" x2="' + (cylX - rx).toFixed(1) + '" y2="' + cylBaseY + '" stroke="#475569" stroke-width="2"/>' +
          '<line x1="' + (cylX + rx).toFixed(1) + '" y1="' + containerTopY + '" x2="' + (cylX + rx).toFixed(1) + '" y2="' + cylBaseY + '" stroke="#475569" stroke-width="2"/>' +
          '<ellipse cx="' + cylX + '" cy="' + containerTopY + '" rx="' + rx.toFixed(1) + '" ry="' + ry + '" fill="none" stroke="#475569" stroke-width="1.8"/>' +
          '<ellipse cx="' + cylX + '" cy="' + cylBaseY + '" rx="' + rx.toFixed(1) + '" ry="' + ry + '" fill="none" stroke="#475569" stroke-width="1.5" stroke-dasharray="3,3"/>' +
          '<text x="486" y="228" font-size="12" font-weight="bold" fill="#0369a1" text-anchor="middle">h=' + hCur.toFixed(1) + 'cm, S=' + sCur.toFixed(1) + 'cm²</text>' +
        '</g>'
      );

      // Step >= 2: Mark endpoint (10, 30) and (15, 20)
      if (step >= 2) {
        c.projPoint(10, 30, '(10,30)', {
          color: '#16a34a',
          r: 5.5,
          dx: -8,
          dy: -8
        });
        c.projPoint(15, 20, '(15,20)', {
          color: '#16a34a',
          r: 5.5,
          dx: 8,
          dy: -8
        });
      }

      // Step >= 3: Highlight segment 10 <= h <= 15 and range 20 <= S <= 30
      if (step >= 3) {
        c.shadedRegion(function (h) { return 300 / h; }, 10, 15, 'rgba(220,38,38,0.14)');
        // Highlight y-axis interval [20, 30] and x-axis interval [10, 15]
        c.line(0, 20, 0, 30, { stroke: '#dc2626', width: 5 });
        c.line(10, 0, 15, 0, { stroke: '#dc2626', width: 5 });
        c.curve(function (h) { return 300 / h; }, 10, 15, {
          stroke: '#dc2626',
          width: 4.5
        });
        c.text(c.X(12.5), c.Y(14.5), '10≤h≤15 ⇒ 20≤S≤30', {
          size: 13.5,
          fill: '#dc2626',
          weight: 'bold',
          anchor: 'middle'
        });
      }

      return c.done();
    }
  });

  // =========================================================
  // Slide 2A: 四、分层训练 · 第 2 题（1）：教室熏蒸消毒两阶段函数表达式建模
  // =========================================================
  window.defineSlide({
    id: 'train-q2-disinfect-p1',
    phase: 3,
    navTag: '训练2(1)·分段建模',
    section: '分层训练',
    title: '第<span class="num">2</span>题（<span class="num">1</span>）：教室环保药物熏蒸消毒两阶段函数表达式建模',
    layout: 'layout-b',
    stem: `<p><span class="num">2．</span>某校在周末采用环保药物熏蒸法对教室进行消毒．已知药物释放阶段，教室内每立方米空气中的含药量<i class="m">y</i>（单位：<span class="num">mg</span>）与时间<i class="m">x</i>（单位：<span class="num">min</span>）成正比例（线段<i class="m">OA</i>）；<span class="num">8min</span>后药物释放完毕，此时含药量达到最大值<span class="num">6mg</span>（即点<i class="m">A</i><span class="num">(8,6)</span>），随后<i class="m">y</i>与<i class="m">x</i>成反比例（曲线<span class="math"><i class="m">y</i><span class="num">=</span><span class="fraction"><span><i class="m">k</i></span><span><i class="m">x</i></span></span></span>，<span class="math"><i class="m">x</i><span class="num">&gt;8</span></span>），如图所示．</p><p>（<span class="num">1</span>）药物释放阶段（<span class="math"><span class="num">0≤</span><i class="m">x</i><span class="num">≤8</span></span>）表达式为<span class="screen-blank" data-step="1" data-ans="<span class='math'><i class='m'>y</i><span class='num'>=</span><span class='fraction'><span><span class='num'>3</span></span><span><span class='num'>4</span></span></span><i class='m'>x</i></span>"></span>，释放完毕后（<span class="math"><i class="m">x</i><span class="num">&gt;8</span></span>）表达式为<span class="screen-blank" data-step="2" data-ans="<span class='math'><i class='m'>y</i><span class='num'>=</span><span class='fraction'><span><span class='num'>48</span></span><span><i class='m'>x</i></span></span></span>"></span>．</p>`,
    steps: [
      {
        title: '求药物释放阶段（<span class="math"><span class="num">0≤</span><i class="m">x</i><span class="num">≤8</span></span>）正比例函数表达式',
        html: `释放阶段设<span class="math"><i class="m">y</i><span class="num">=</span><i class="m">k</i><sub><span class="num">1</span></sub><i class="m">x</i></span>，代入最高点<span class="math"><i class="m">A</i><span class="num">(8,6)</span></span>得<span class="math"><span class="num">8</span><i class="m">k</i><sub><span class="num">1</span></sub><span class="num">=6</span></span>，解得<span class="math"><i class="m">k</i><sub><span class="num">1</span></sub><span class="num">=</span><span class="fraction"><span><span class="num">3</span></span><span><span class="num">4</span></span></span></span>，故<b style="color:#2563eb;"><span class="math"><i class="m">y</i><span class="num">=</span><span class="fraction"><span><span class="num">3</span></span><span><span class="num">4</span></span></span><i class="m">x</i></span>（<span class="math"><span class="num">0≤</span><i class="m">x</i><span class="num">≤8</span></span>）</b>．`
      },
      {
        title: '求释放完毕后（<span class="math"><i class="m">x</i><span class="num">&gt;8</span></span>）反比例函数表达式',
        html: `释放完毕后将公共转折点<span class="math"><i class="m">A</i><span class="num">(8,6)</span></span>代入<span class="math"><i class="m">y</i><span class="num">=</span><span class="fraction"><span><i class="m">k</i></span><span><i class="m">x</i></span></span></span>，得<span class="math"><i class="m">k</i><span class="num">=8×6=48</span></span>，故<b style="color:#7c3aed;"><span class="math"><i class="m">y</i><span class="num">=</span><span class="fraction"><span><span class="num">48</span></span><span><i class="m">x</i></span></span></span>（<span class="math"><i class="m">x</i><span class="num">&gt;8</span></span>）</b>．`
      }
    ],
    renderScene: function (step) {
      var c = window.createCoordCanvas({
        width: 580,
        height: 440,
        padding: { top: 42, right: 48, bottom: 52, left: 60 },
        xMin: 0,
        xMax: 35,
        yMin: 0,
        yMax: 7,
        xStep: 5,
        yStep: 1,
        xLabel: 'x/min',
        yLabel: 'y/mg'
      });

      c.line(0, 0, 8, 6, {
        stroke: step >= 1 ? '#2563eb' : '#1e293b',
        width: step >= 1 ? 4 : 3.2
      });
      c.curve(function (x) { return 48 / x; }, 8, 34, {
        stroke: step >= 2 ? '#7c3aed' : '#1e293b',
        width: step >= 2 ? 4 : 3.2
      });
      c.projPoint(8, 6, 'A(8,6)', {
        color: '#dc2626',
        r: 5.5,
        dx: 10,
        dy: -10,
        showTickX: '8'
      });

      if (step >= 1) {
        c.text(c.X(1.5), c.Y(4.9), 'y=(3/4)x (0≤x≤8)', {
          size: 14.5,
          fill: '#2563eb',
          weight: 'bold'
        });
      }
      if (step >= 2) {
        c.text(c.X(14.5), c.Y(3.8), 'y=48/x (x>8)', {
          size: 15,
          fill: '#7c3aed',
          weight: 'bold'
        });
      }

      return c.done();
    }
  });

  // =========================================================
  // Slide 2B: 四、分层训练 · 第 2 题（2）：有效消毒时长与安全进入时间求解
  // =========================================================
  window.defineSlide({
    id: 'train-q2-disinfect-p2',
    phase: 3,
    navTag: '训练2(2)·时长与安全时间',
    section: '分层训练',
    title: '第<span class="num">2</span>题（<span class="num">2</span>）：有效消毒持续时长与学生安全进入时间',
    layout: 'layout-b',
    stem: `<div style="background:#eff6ff;border-left:4px solid #2563eb;padding:4px 10px;margin-bottom:5px;border-radius:4px;font-size:14.5px;color:#1e40af;"><b>【前问已知】</b>释放阶段（<span class="math"><span class="num">0≤</span><i class="m">x</i><span class="num">≤8</span></span>）：<span class="math"><i class="m">y</i><span class="num">=</span><span class="fraction"><span><span class="num">3</span></span><span><span class="num">4</span></span></span><i class="m">x</i></span>；消散阶段（<span class="math"><i class="m">x</i><span class="num">&gt;8</span></span>）：<span class="math"><i class="m">y</i><span class="num">=</span><span class="fraction"><span><span class="num">48</span></span><span><i class="m">x</i></span></span></span>．</div><p>（<span class="num">2</span>）当含药量不低于<span class="num">3mg</span>时消毒有效，且低于<span class="num">1.6mg</span>时学生方可安全进入教室．此次消毒的有效持续时长为<span class="screen-blank" data-step="1" data-ans="<span class='num'>12min</span>"></span>，从开始消毒到学生可安全进入教室至少需要经过<span class="screen-blank" data-step="2" data-ans="<span class='num'>30min</span>"></span>．</p>`,
    steps: [
      {
        title: '求含药量不低于<span class="num">3mg</span>的有效消毒持续时长',
        html: `令<span class="math"><i class="m">y</i><span class="num">=3</span></span>：在释放阶段由<span class="math"><span class="fraction"><span><span class="num">3</span></span><span><span class="num">4</span></span></span><i class="m">x</i><sub><span class="num">1</span></sub><span class="num">=3</span></span>得<span class="math"><i class="m">x</i><sub><span class="num">1</span></sub><span class="num">=4</span></span>；在消散阶段由<span class="math"><span class="fraction"><span><span class="num">48</span></span><span><i class="m">x</i><sub><span class="num">2</span></sub></span></span><span class="num">=3</span></span>得<span class="math"><i class="m">x</i><sub><span class="num">2</span></sub><span class="num">=16</span></span>．故当<span class="math"><span class="num">4≤</span><i class="m">x</i><span class="num">≤16</span></span>时含药量不低于<span class="num">3mg</span>，有效持续时长为<span class="math"><span class="num">16-4=</span><b style="color:#dc2626;">12</b></span>（<span class="num">min</span>）．`
      },
      {
        title: '求含药量低于<span class="num">1.6mg</span>的安全进入时间',
        html: `在药物消散阶段（<span class="math"><i class="m">x</i><span class="num">&gt;8</span></span>），<i class="m">y</i>随<i class="m">x</i>的增大而减小．令<span class="math"><span class="fraction"><span><span class="num">48</span></span><span><i class="m">x</i></span></span><span class="num">=1.6</span></span>，解得<span class="math"><i class="m">x</i><span class="num">=30</span></span>．故从开始消毒到学生可安全进入教室至少需要经过<b style="color:#dc2626;"><span class="num">30min</span></b>．`
      }
    ],
    renderScene: function (step) {
      var c = window.createCoordCanvas({
        width: 580,
        height: 440,
        padding: { top: 42, right: 48, bottom: 52, left: 60 },
        xMin: 0,
        xMax: 35,
        yMin: 0,
        yMax: 7,
        xStep: 5,
        yStep: 1,
        xLabel: 'x/min',
        yLabel: 'y/mg'
      });

      c.line(0, 0, 8, 6, { stroke: '#2563eb', width: 3.2 });
      c.curve(function (x) { return 48 / x; }, 8, 34, { stroke: '#2563eb', width: 3.2 });
      c.projPoint(8, 6, 'A(8,6)', {
        color: '#2563eb',
        r: 5.5,
        dx: 10,
        dy: -10,
        showTickX: '8'
      });

      if (step >= 1) {
        c.shadedRegion(function (x) {
          return x <= 8 ? 0.75 * x : 48 / x;
        }, 4, 16, 'rgba(22,163,74,0.14)');

        c.line(0, 3, 34, 3, { stroke: '#16a34a', width: 2.2, dash: '6,4' });
        c.text(c.X(22.5), c.Y(3.32), 'y=3mg (有效线)', {
          size: 13.5,
          fill: '#15803d',
          weight: 'bold'
        });

        c.projPoint(4, 3, '(4,3)', { color: '#16a34a', r: 5, dx: -10, dy: -10, showTickX: '4' });
        c.projPoint(16, 3, '(16,3)', { color: '#16a34a', r: 5, dx: 10, dy: -10, showTickX: '16' });

        c.line(4, 3, 8, 6, { stroke: '#16a34a', width: 4 });
        c.curve(function (x) { return 48 / x; }, 8, 16, { stroke: '#16a34a', width: 4 });
        c.line(4, 0, 16, 0, { stroke: '#16a34a', width: 5 });
        c.text(c.X(10.2), c.Y(0.75), '有效时长: 16-4=12min', {
          size: 13,
          fill: '#15803d',
          weight: 'bold',
          anchor: 'middle'
        });
      }

      if (step >= 2) {
        c.line(0, 1.6, 34.5, 1.6, { stroke: '#dc2626', width: 2.2, dash: '6,4' });
        c.text(c.X(16.8), c.Y(1.92), 'y=1.6mg (安全线)', {
          size: 13.5,
          fill: '#dc2626',
          weight: 'bold'
        });
        c.projPoint(30, 1.6, '(30,1.6)', {
          color: '#dc2626',
          r: 5.5,
          dx: 8,
          dy: -10,
          showTickY: '1.6'
        });
        c.curve(function (x) { return 48 / x; }, 30, 34.5, { stroke: '#dc2626', width: 4.5 });
        c.line(30, 0, 34.5, 0, { stroke: '#dc2626', width: 5 });
        c.text(c.X(32.2), c.Y(0.55), 'x≥30安全', {
          size: 12.5,
          fill: '#dc2626',
          weight: 'bold',
          anchor: 'middle'
        });
      }

      return c.done();
    }
  });

  // =========================================================
  // Slide 3: 课堂小结（反比例函数实际应用的四大核心题型与通法）
  // =========================================================
  window.defineSlide({
    id: 'summary-2-3-1',
    phase: 3,
    navTag: '课堂小结',
    section: '课堂小结',
    title: '课堂小结：反比例函数的应用（<span class="num">1</span>）建模通法与易错点',
    layout: 'layout-b',
    stem: `<p><b>核心方法：</b>审清实际情境中的<b>不变量（乘积定值<i class="m">k</i>）</b><span class="num">→</span>建立反比例函数模型<span class="math"><i class="m">y</i><span class="num">=</span><span class="fraction"><span><i class="m">k</i></span><span><i class="m">x</i></span></span></span>（<span class="math"><i class="m">x</i><span class="num">&gt;0</span></span>）<span class="num">→</span>结合<b>第一象限内<i class="m">y</i>随<i class="m">x</i>的增大而减小</b>解决求值、限速/限压不等式与分段函数持续时长问题．</p>`,
    steps: [
      {
        title: '题型一：物理与工程定值建模（压强、欧姆定律、杠杆、行程）',
        html: `抓住公式中恒定不变的总量（压力<span class="math"><i class="m">F</i><span class="num">=</span><i class="m">pS</i></span>、电压<span class="math"><i class="m">U</i><span class="num">=</span><i class="m">IR</i></span>、阻力矩<span class="math"><i class="m">Fl</i><sub><span class="num">1</span></sub><span class="num">=</span><i class="m">F</i><sub>阻</sub><i class="m">l</i><sub><span class="num">2</span></sub></span>、路程<span class="math"><i class="m">s</i><span class="num">=</span><i class="m">vt</i></span>），注意实际问题中自变量通常满足<span class="math"><i class="m">x</i><span class="num">&gt;0</span></span>，图象仅在第一象限．`
      },
      {
        title: '题型二：实验数据表格建模与描点连线',
        html: `检验表格中各组对应数据的乘积<span class="math"><i class="m">x</i><span class="num">·</span><i class="m">y</i></span>是否为常数<i class="m">k</i>，描点后必须用<b>平滑曲线</b>连接（切忌用折线连接）．`
      },
      {
        title: '题型三：利用增减性求取值范围（“至少”、“不超过”）',
        html: `先将不等关系转化为<b>方程</b>求出临界端点值，再利用<span class="math"><i class="m">k</i><span class="num">&gt;0</span></span>时第一象限内<i class="m">y</i>随<i class="m">x</i>增大而减小（端点函数值反序）写出最终区间．`
      },
      {
        title: '题型四：一次函数与反比例函数分段综合（温控、熏蒸消毒）',
        html: `<b>转折最高点（公共交点）</b>同时在两段函数图象上！先求交点坐标确定两段解析式；求“不低于某值<i class="m">y</i><sub><span class="num">0</span></sub>的持续时长”时，需将<i class="m">y</i><sub><span class="num">0</span></sub><b>分别代入两段解析式</b>求出<i class="m">x</i><sub><span class="num">1</span></sub>，<i class="m">x</i><sub><span class="num">2</span></sub>，作差<span class="math"><i class="m">x</i><sub><span class="num">2</span></sub><span class="num">-</span><i class="m">x</i><sub><span class="num">1</span></sub></span>即为持续时长．`
      }
    ],
    renderScene: function (step) {
      var cards = [
        {
          idx: 1,
          x: 20,
          y: 58,
          title: '题型一：定值乘积建模',
          tag: 'xy=k (x>0)',
          color: '#2563eb',
          bg: '#eff6ff',
          line1: '压强p=F/S · 电流I=U/R',
          line2: '杠杆F=k/l₁ · 行程v=s/t',
          line3: '易错：自变量x>0(第一象限)'
        },
        {
          idx: 2,
          x: 298,
          y: 58,
          title: '题型二：表格验证与作图',
          tag: '列表→描点→连线',
          color: '#0891b2',
          bg: '#ecfeff',
          line1: '1. 计算各组x·y验证定值k',
          line2: '2. 代入解析式补全表格未知项',
          line3: '3. 必须用平滑双曲线连接各点'
        },
        {
          idx: 3,
          x: 20,
          y: 244,
          title: '题型三：增减性求范围',
          tag: '先求端点·再看单调性',
          color: '#16a34a',
          bg: '#f0fdf4',
          line1: 'k>0, x>0时y随x增大而减小',
          line2: '已知x≤x₀ ⇒ y≥k/x₀',
          line3: '已知a≤x≤b ⇒ k/b≤y≤k/a'
        },
        {
          idx: 4,
          x: 298,
          y: 244,
          title: '题型四：正反比例分段综合',
          tag: '抓转折交点·水平线双解',
          color: '#dc2626',
          bg: '#fef2f2',
          line1: '1. 最高点A(x_A,y_A)两段共用',
          line2: '2. 令y=y₀分别代入两段求x₁,x₂',
          line3: '3. 有效持续时长 Δt=x₂-x₁'
        }
      ];

      var svgParts = [
        '<svg viewBox="0 0 580 440" width="100%" height="100%">',
        '<rect x="10" y="10" width="560" height="420" rx="14" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>',
        '<text x="290" y="38" font-size="17" font-weight="bold" fill="#1e293b" text-anchor="middle">反比例函数实际应用（1）知识全景图</text>'
      ];

      for (var i = 0; i < cards.length; i++) {
        var card = cards[i];
        var unlocked = step >= card.idx;
        var active = step === card.idx;
        var strokeColor = active ? card.color : (unlocked ? card.color : '#cbd5e1');
        var strokeW = active ? 3.2 : (unlocked ? 2 : 1.5);
        var fillBg = unlocked ? card.bg : '#f8fafc';
        var opacity = unlocked ? '1' : '0.55';

        svgParts.push(
          '<g opacity="' + opacity + '">' +
            '<rect x="' + card.x + '" y="' + card.y + '" width="262" height="168" rx="12" fill="' + fillBg + '" stroke="' + strokeColor + '" stroke-width="' + strokeW + '"/>' +
            '<rect x="' + (card.x + 12) + '" y="' + (card.y + 12) + '" width="238" height="28" rx="6" fill="' + (unlocked ? card.color : '#64748b') + '"/>' +
            '<text x="' + (card.x + 131) + '" y="' + (card.y + 31) + '" font-size="14" font-weight="bold" fill="#ffffff" text-anchor="middle">' + window.svgAutoFormatText(card.title) + '</text>' +
            '<text x="' + (card.x + 131) + '" y="' + (card.y + 62) + '" font-size="13" font-weight="bold" fill="' + (unlocked ? card.color : '#475569') + '" text-anchor="middle">【' + window.svgAutoFormatText(card.tag) + '】</text>' +
            '<text x="' + (card.x + 18) + '" y="' + (card.y + 92) + '" font-size="13.5" fill="#1e293b">' + window.svgAutoFormatText(card.line1) + '</text>' +
            '<text x="' + (card.x + 18) + '" y="' + (card.y + 120) + '" font-size="13.5" fill="#1e293b">' + window.svgAutoFormatText(card.line2) + '</text>' +
            '<text x="' + (card.x + 18) + '" y="' + (card.y + 148) + '" font-size="13.5" font-weight="bold" fill="' + (unlocked ? card.color : '#475569') + '">' + window.svgAutoFormatText(card.line3) + '</text>' +
          '</g>'
        );
      }

      svgParts.push('</svg>');
      return svgParts.join('');
    }
  });
})();

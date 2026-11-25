// ============================================================================
// 北师大版九年级数学下册 · 3.1.2 垂径定理 动态讲解课件（第3分块：Slide 13 ~ Slide 19）
// 包含：三、新知应用（第2~5题） · 四、分层训练（第1~2题） · 课堂小结（交互式思维导图）
// ============================================================================

(function () {
  'use strict';

  function sampleArcPoints(cx, cy, r, degStart, degEnd, count) {
    var pts = [];
    var n = count || 56;
    for (var i = 0; i <= n; i++) {
      var deg = degStart + (degEnd - degStart) * (i / n);
      var rad = (deg * Math.PI) / 180;
      pts.push([cx + r * Math.cos(rad), cy + r * Math.sin(rad)]);
    }
    return pts;
  }

  function ptsToSvgPolyline(cv, mathPts, stroke, width, dash) {
    var attrDash = dash ? ' stroke-dasharray="' + dash + '"' : '';
    var pStr = mathPts.map(function (p) {
      return cv.px(p[0]).toFixed(1) + ',' + cv.py(p[1]).toFixed(1);
    }).join(' ');
    return '<polyline fill="none" stroke="' + stroke + '" stroke-width="' + (width || 2.6) + '"' + attrDash + ' stroke-linecap="round" stroke-linejoin="round" points="' + pStr + '"/>';
  }

  function ptsToSvgPath(cv, mathPts, fill, stroke, width) {
    if (!mathPts.length) return '';
    var d = mathPts.map(function (p, idx) {
      return (idx === 0 ? 'M ' : 'L ') + cv.px(p[0]).toFixed(1) + ' ' + cv.py(p[1]).toFixed(1);
    }).join(' ') + ' Z';
    return '<path d="' + d + '" fill="' + (fill || 'none') + '" stroke="' + (stroke || 'none') + '" stroke-width="' + (width || 0) + '" stroke-linejoin="round"/>';
  }

  // --------------------------------------------------------------------------
  // Slide 13：三、新知应用 第2题：长沙中考题（PPT大字板书版）
  // --------------------------------------------------------------------------
  window.defineSlide({
    lesson: 1,
    phase: 2,
    layout: 'layout-ppt',
    navTag: '题2·求圆半径',
    section: '新知应用',
    title: "第<span class='num'>2</span>题：垂径定理与勾股定理求半径",
    stem:
      '<p><span class="num">2．</span>（<span class="num">2024</span>·长沙）如图，在<span class="num">⊙</span><i class="m">O</i>中，弦<i class="m">AB</i>的长为<span class="num">8</span>，圆心<i class="m">O</i>到<i class="m">AB</i>的距离<span class="math"><i class="m">OE</i><span class="num">=4</span></span>，则<span class="num">⊙</span><i class="m">O</i>的半径长为<span style="white-space:nowrap;">（<span class="screen-blank choice-blank" data-step="2" data-ans="B"></span>）</span></p>' +
      window.renderChoices([
        'A．<span class="num">4</span>',
        'B．<span class="num">4</span><span class="sqrt"><span class="num">2</span></span>',
        'C．<span class="num">5</span>',
        'D．<span class="num">5</span><span class="sqrt"><span class="num">2</span></span>'
      ], 4),
    steps: [
      { title: '连半径OA求半弦AE' },
      { title: '由勾股定理求半径OA' }
    ],
    renderBody: function (step) {
      var cv = window.createCoordCanvas({
        width: 460,
        height: 370,
        xRange: [-6.4, 6.4],
        yRange: [-6.1, 6.1],
        equalAspect: true,
        padding: { left: 16, right: 16, top: 14, bottom: 14 }
      });

      var R = Math.sqrt(32);
      var cx = cv.px(0);
      var cy = cv.py(0);
      var rPx = R * cv.scaleX;

      cv.raw('<circle cx="' + cx.toFixed(1) + '" cy="' + cy.toFixed(1) + '" r="' + rPx.toFixed(1) + '" fill="rgba(37,99,235,0.03)" stroke="#1e293b" stroke-width="2.7"/>');

      if (step >= 1) {
        cv.drawPolygon([[0, 0], [4, 0], [4, 4]], {
          fill: 'rgba(37,99,235,0.16)',
          stroke: 'none',
          width: 0
        });
      }

      cv.drawSegment([4, 4], [4, -4], { color: '#0f172a', width: 2.8 });
      cv.drawSegment([0, 0], [4, 0], { color: step >= 1 ? '#1d4ed8' : '#0f172a', width: 2.6 });
      if (step >= 1) {
        cv.drawSegment([4, 0], [4, 4], { color: '#2563eb', width: 3.1 });
      }
      cv.drawRightAngle([4, 0], [0, 0], [4, 4], 11, '#334155');

      if (step >= 1) {
        cv.drawSegment([0, 0], [4, 4], { color: '#dc2626', width: 2.8, dash: '6 4' });
        cv.drawText([2.0, -0.82], '4', { color: '#1e293b', fontSize: 17.5, anchor: 'middle' });
        cv.drawText([4.58, 2.0], '4', { color: '#1d4ed8', fontSize: 17.5, anchor: 'start' });
      }

      cv.drawPoint([0, 0], { label: 'O', dx: -14, dy: 18, fontSize: 18, anchor: 'end', color: '#0f172a', r: 4.8 });
      cv.drawPoint([4, 4], { label: 'A', dx: 11, dy: -8, fontSize: 18, anchor: 'start', color: step >= 1 ? '#dc2626' : '#0f172a', r: 4.8 });
      cv.drawPoint([4, -4], { label: 'B', dx: 11, dy: 19, fontSize: 18, anchor: 'start', color: '#0f172a', r: 4.8 });
      cv.drawPoint([4, 0], { label: 'E', dx: 11, dy: 17, fontSize: 18, anchor: 'start', color: '#1d4ed8', r: 4.4 });

      if (step >= 2) {
        cv.raw(window.svgCalloutTag(
          [cv.px(2), cv.py(2)],
          [26, 56, 146, 34],
          '<span class="math"><i class="m">OA</i><span class="num">=4</span><span class="sqrt"><span class="num">2</span></span></span>',
          { color: '#dc2626', bg: '#fef2f2' }
        ));
      }

      var lines = [
        {
          step: 1,
          html: window.formalProofStep([
            { head: '解：连接<i class="m">OA</i>．' },
            { sym: '∵', text: '<span class="math"><i class="m">OE</i><span class="num">⊥</span><i class="m">AB</i></span>，<span class="math"><i class="m">AB</i><span class="num">=8</span></span>，' },
            { sym: '∴', text: '<span class="math"><i class="m">AE</i><span class="num">=</span><span class="fraction"><span><span class="num">1</span></span><span><span class="num">2</span></span></span><i class="m">AB</i><span class="num">=</span><span class="fraction"><span><span class="num">1</span></span><span><span class="num">2</span></span></span><span class="num">×8=4</span></span>．' }
          ])
        },
        {
          step: 2,
          html: '在<span class="num">Rt</span><span class="tri-sym">△</span><i class="m">OEA</i>中，根据勾股定理，得<br><span class="math"><i class="m">OA</i><span class="num">=</span><span class="sqrt"><span><i class="m">OE</i><sup><span class="num">2</span></sup><span class="num">+</span><i class="m">AE</i><sup><span class="num">2</span></sup></span></span><span class="num">=</span><span class="sqrt"><span><span class="num">4</span><sup><span class="num">2</span></sup><span class="num">+4</span><sup><span class="num">2</span></sup></span></span><span class="num">=4</span><span class="sqrt"><span class="num">2</span></span></span>．<br>故选 <span class="num">B</span>．'
        }
      ];

      return window.pptExampleLayout({
        step: step,
        lines: lines,
        rightSvg: cv.toSvg()
      });
    }
  });

  // --------------------------------------------------------------------------
  // Slide 14：三、新知应用 第3题：网格坐标系中确定圆弧的圆心（PPT大字板书版）
  // --------------------------------------------------------------------------
  window.defineSlide({
    lesson: 1,
    phase: 2,
    layout: 'layout-ppt',
    navTag: '题3·网格定圆心',
    section: '新知应用',
    title: "第<span class='num'>3</span>题：网格坐标系中确定圆弧的圆心",
    stem:
      '<p><span class="num">3．</span>如图，平面直角坐标系中一条圆弧经过网格点<span class="math"><i class="m">A</i><span class="num">(0,4)</span></span>，<span class="math"><i class="m">B</i><span class="num">(4,4)</span></span>，<span class="math"><i class="m">C</i><span class="num">(6,2)</span></span>，则该圆弧所在圆的圆心的坐标为<span style="white-space:nowrap;">（<span class="screen-blank choice-blank" data-step="3" data-ans="B"></span>）</span></p>' +
      window.renderChoices([
        'A．<span class="num">(-1,2)</span>',
        'B．<span class="num">(2,0)</span>',
        'C．<span class="num">(1,-2)</span>',
        'D．<span class="num">(-2,-1)</span>'
      ], 4),
    steps: [
      { title: '作弦AB的垂直平分线' },
      { title: '作弦BC的垂直平分线' },
      { title: '求两中垂线交点得圆心坐标' }
    ],
    renderBody: function (step) {
      var cv = window.createCoordCanvas({
        width: 475,
        height: 375,
        xRange: [-1.5, 7.5],
        yRange: [-1.3, 5.5],
        equalAspect: true,
        padding: { left: 22, right: 20, top: 16, bottom: 16 }
      });

      for (var gx = -1; gx <= 7; gx++) {
        if (gx === 0) continue;
        cv.raw('<line x1="' + cv.px(gx).toFixed(1) + '" y1="' + cv.py(-1).toFixed(1) + '" x2="' + cv.px(gx).toFixed(1) + '" y2="' + cv.py(5).toFixed(1) + '" stroke="#94a3b8" stroke-width="1.2" stroke-dasharray="4 3"/>');
      }
      for (var gy = -1; gy <= 5; gy++) {
        if (gy === 0) continue;
        cv.raw('<line x1="' + cv.px(-1).toFixed(1) + '" y1="' + cv.py(gy).toFixed(1) + '" x2="' + cv.px(7).toFixed(1) + '" y2="' + cv.py(gy).toFixed(1) + '" stroke="#94a3b8" stroke-width="1.2" stroke-dasharray="4 3"/>');
      }

      cv.drawAxes({ showGrid: false, showTicks: false, originOffset: [-18, 20] });

      var R = Math.sqrt(20);
      var arcPts = sampleArcPoints(2, 0, R, 126, 18, 64);
      cv.raw(ptsToSvgPolyline(cv, arcPts, '#0f172a', 2.9));

      if (step >= 3) {
        cv.drawSegment([2, 0], [0, 4], { color: 'rgba(220,38,38,0.55)', width: 1.7, dash: '4 3' });
        cv.drawSegment([2, 0], [4, 4], { color: 'rgba(220,38,38,0.55)', width: 1.7, dash: '4 3' });
        cv.drawSegment([2, 0], [6, 2], { color: 'rgba(220,38,38,0.55)', width: 1.7, dash: '4 3' });
      }

      if (step >= 1) {
        cv.drawSegment([0, 4], [4, 4], { color: '#2563eb', width: 2.7 });
        cv.drawSegment([2, -0.8], [2, 5.0], { color: '#2563eb', width: 2.3, dash: '6 4' });
        cv.drawRightAngle([2, 4], [4, 4], [2, 5], 9.5, '#2563eb');
        cv.drawPoint([2, 4], { color: '#2563eb', r: 3.8 });
        cv.drawText([2.24, 4.88], 'x=2', { color: '#2563eb', fontSize: 16, anchor: 'start' });
      }

      if (step >= 2) {
        cv.drawSegment([4, 4], [6, 2], { color: '#0d9488', width: 2.7 });
        cv.drawSegment([1.4, -0.6], [5.6, 3.6], { color: '#0d9488', width: 2.3, dash: '6 4' });
        cv.drawRightAngle([5, 3], [6, 2], [5.6, 3.6], 9.5, '#0d9488');
        cv.drawPoint([5, 3], { color: '#0d9488', r: 3.8 });
      }

      cv.drawPoint([0, 4], { label: 'A', dx: -12, dy: -8, fontSize: 18, anchor: 'end', color: '#0f172a', r: 4.6 });
      cv.drawPoint([4, 4], { label: 'B', dx: 9, dy: -10, fontSize: 18, anchor: 'start', color: '#0f172a', r: 4.6 });
      cv.drawPoint([6, 2], { label: 'C', dx: 11, dy: -6, fontSize: 18, anchor: 'start', color: '#0f172a', r: 4.6 });

      if (step >= 3) {
        cv.drawPoint([2, 0], { color: '#dc2626', r: 5.6 });
        cv.drawText([2.35, -0.64], 'P(2,0)', { color: '#dc2626', fontSize: 16.5, anchor: 'start' });
      }

      var lines = [
        {
          step: 1,
          html: '解：连接弦<i class="m">AB</i>，作<i class="m">AB</i>的垂直平分线．<br>∵ <span class="math"><i class="m">A</i><span class="num">(0,4)</span></span>，<span class="math"><i class="m">B</i><span class="num">(4,4)</span></span>，∴ <i class="m">AB</i>的垂直平分线为直线<span class="math"><i class="m">x</i><span class="num">=2</span></span>．'
        },
        {
          step: 2,
          html: '连接弦<i class="m">BC</i>，由<span class="math"><i class="m">B</i><span class="num">(4,4)</span></span>，<span class="math"><i class="m">C</i><span class="num">(6,2)</span></span>得中点为<span class="num">(5,3)</span>，<br>过格点<span class="num">(5,3)</span>与<span class="num">(2,0)</span>作<i class="m">BC</i>的垂直平分线<span class="math"><i class="m">y</i><span class="num">=</span><i class="m">x</i><span class="num">-2</span></span>．'
        },
        {
          step: 3,
          html: '两垂直平分线交于格点<span class="math"><i class="m">P</i><span class="num">(2,0)</span></span>，故圆心坐标为<span class="num">(2,0)</span>．故选 <span class="num">B</span>．'
        }
      ];

      return window.pptExampleLayout({
        step: step,
        lines: lines,
        rightSvg: cv.toSvg()
      });
    }
  });

  // --------------------------------------------------------------------------
  // Slide 15：三、新知应用 第4题：垂径定理与圆概念易错辨析（PPT全宽大字版，对齐最新学案）
  // --------------------------------------------------------------------------
  window.defineSlide({
    lesson: 1,
    phase: 2,
    layout: 'layout-ppt',
    navTag: '题4·概念辨析',
    section: '新知应用',
    title: "第<span class='num'>4</span>题：垂径定理与圆概念易错辨析",
    stem:
      '<p><span class="num">4．</span>下列说法正确的是<span style="white-space:nowrap;">（<span class="screen-blank choice-blank" data-step="4" data-ans="B"></span>）</span></p>' +
      window.renderChoices([
        'A．平分弦的直径垂直于弦',
        'B．圆是轴对称图形，任何一条直径所在的直线都是圆的对称轴',
        'C．垂直于弦的直线一定经过圆心',
        'D．长度相等的弧是等弧'
      ], 2),
    steps: [
      { title: '辨析选项A' },
      { title: '辨析选项C' },
      { title: '辨析选项D' },
      { title: '判定选项B' }
    ],
    renderBody: function (step) {
      var lines = [
        {
          step: 1,
          html: '<span style="color:#dc2626;">✕ 选项<span class="num">A</span>错误：</span>忽略了被平分的弦<b>“不是直径”</b>这一前提（任意两条不垂直的直径互相平分但不垂直）．'
        },
        {
          step: 2,
          html: '<span style="color:#dc2626;">✕ 选项<span class="num">C</span>错误：</span>垂直于弦的直线有无数条（如第<span class="num">1</span>题图(<span class="num">3</span>)中的弦<i class="m">CD</i>），只有<b>弦的垂直平分线</b>才一定经过圆心．'
        },
        {
          step: 3,
          html: '<span style="color:#dc2626;">✕ 选项<span class="num">D</span>错误：</span>只有在<b>同圆或等圆中</b>能互相重合的弧才是等弧；半径不同的圆中长度相等的弧不是等弧．'
        },
        {
          step: 4,
          html: '<span style="color:#15803d;">✓ 选项<span class="num">B</span>正确：</span>圆是轴对称图形，<b>任何一条直径所在的直线</b>都是圆的对称轴（注意是“直线”而非线段）．故选 <span class="num">B</span>．'
        }
      ];
      return window.pptExampleLayout({
        step: step,
        lines: lines,
        rightSvg: ''
      });
    }
  });

  // --------------------------------------------------------------------------
  // Slide 16：三、新知应用 第5题：坐标系中求交点坐标（PPT大字板书版）
  // --------------------------------------------------------------------------
  window.defineSlide({
    lesson: 1,
    phase: 2,
    layout: 'layout-ppt',
    navTag: '题5·坐标交点',
    section: '新知应用',
    title: "第<span class='num'>5</span>题：坐标系中利用垂径定理求交点坐标",
    stem:
      '<p><span class="num">5．</span>如图，在平面直角坐标系中，<span class="num">⊙</span><i class="m">M</i>的圆心在<i class="m">x</i>轴上，<span class="num">⊙</span><i class="m">M</i>与<i class="m">x</i>轴的交点为<span class="math"><i class="m">A</i><span class="num">(-1,0)</span></span>和<span class="math"><i class="m">B</i><span class="num">(4,0)</span></span>．求<span class="num">⊙</span><i class="m">M</i>与<i class="m">y</i>轴的交点<i class="m">C</i>，<i class="m">D</i>的坐标．</p>',
    steps: [
      { title: '由直径AB求半径与圆心M坐标' },
      { title: '在Rt△MOC中由勾股定理求OC' },
      { title: '由垂径定理写出C，D坐标' }
    ],
    renderBody: function (step) {
      var cv = window.createCoordCanvas({
        width: 470,
        height: 390,
        xRange: [-2.3, 5.2],
        yRange: [-3.1, 3.25],
        equalAspect: true,
        padding: { left: 20, right: 18, top: 14, bottom: 14 }
      });

      cv.drawAxes({ showGrid: false, showTicks: false, originOffset: [-18, 20] });

      var cx = cv.px(1.5);
      var cy = cv.py(0);
      var rPx = 2.5 * cv.scaleX;
      cv.raw('<circle cx="' + cx.toFixed(1) + '" cy="' + cy.toFixed(1) + '" r="' + rPx.toFixed(1) + '" fill="rgba(37,99,235,0.03)" stroke="#1e293b" stroke-width="2.7"/>');

      if (step >= 2) {
        cv.drawPolygon([[0, 0], [1.5, 0], [0, 2]], {
          fill: 'rgba(37,99,235,0.16)',
          stroke: 'none',
          width: 0
        });
        cv.drawRightAngle([0, 0], [1.5, 0], [0, 2], 10.5, '#2563eb');
        cv.drawSegment([1.5, 0], [0, 2], { color: '#dc2626', width: 2.8, dash: '6 4' });
        cv.raw(window.svgFoLabel(
          216, 102, 86, 40,
          '<span class="math"><i class="m">MC</i><span class="num">=</span><span class="fraction"><span><span class="num">5</span></span><span><span class="num">2</span></span></span></span>',
          'font-size:15.5px;font-weight:700;color:#dc2626;display:flex;align-items:center;justify-content:center;'
        ));
      }

      if (step >= 3) {
        cv.drawSegment([0, 2], [0, -2], { color: '#0d9488', width: 2.9 });
        var ox = cv.px(0);
        var yTick1 = cv.py(1.0);
        var yTick2 = cv.py(-1.0);
        cv.raw('<line x1="' + (ox - 6).toFixed(1) + '" y1="' + (yTick1 - 2).toFixed(1) + '" x2="' + (ox + 6).toFixed(1) + '" y2="' + (yTick1 + 2).toFixed(1) + '" stroke="#0d9488" stroke-width="2.3"/>');
        cv.raw('<line x1="' + (ox - 6).toFixed(1) + '" y1="' + (yTick2 - 2).toFixed(1) + '" x2="' + (ox + 6).toFixed(1) + '" y2="' + (yTick2 + 2).toFixed(1) + '" stroke="#0d9488" stroke-width="2.3"/>');
      }

      cv.drawPoint([-1, 0], { label: 'A', dx: -11, dy: -10, fontSize: 18, anchor: 'end', color: '#0f172a', r: 4.6 });
      cv.drawPoint([4, 0], { label: 'B', dx: 11, dy: -10, fontSize: 18, anchor: 'start', color: '#0f172a', r: 4.6 });

      if (step === 0) {
        cv.drawPoint([1.5, 0], { label: 'M', dx: 0, dy: 24, fontSize: 18, anchor: 'middle', color: '#0f172a', r: 4.6 });
      } else {
        cv.drawPoint([1.5, 0], { color: '#1d4ed8', r: 5.2 });
        cv.raw(window.svgFoLabel(
          198, 206, 94, 40,
          '<span class="math"><i class="m">M</i><span class="num">(</span><span class="fraction"><span><span class="num">3</span></span><span><span class="num">2</span></span></span><span class="num">,0)</span></span>',
          'font-size:15px;font-weight:700;color:#1d4ed8;display:flex;align-items:center;justify-content:center;'
        ));
      }

      if (step < 3) {
        cv.drawPoint([0, 2], { label: 'C', dx: -12, dy: -6, fontSize: 18, anchor: 'end', color: step >= 2 ? '#1d4ed8' : '#0f172a', r: 4.6 });
        cv.drawPoint([0, -2], { label: 'D', dx: -12, dy: 18, fontSize: 18, anchor: 'end', color: '#0f172a', r: 4.6 });
      } else {
        cv.drawPoint([0, 2], { color: '#dc2626', r: 5.0 });
        cv.drawPoint([0, -2], { color: '#dc2626', r: 5.0 });
        cv.raw(window.svgCalloutTag(
          [cv.px(0), cv.py(2)],
          [12, 58, 108, 32],
          '<span class="math"><i class="m">C</i><span class="num">(0,2)</span></span>',
          { color: '#dc2626', bg: '#fef2f2' }
        ));
        cv.raw(window.svgCalloutTag(
          [cv.px(0), cv.py(-2)],
          [12, 304, 114, 32],
          '<span class="math"><i class="m">D</i><span class="num">(0,-2)</span></span>',
          { color: '#dc2626', bg: '#fef2f2' }
        ));
      }

      var lines = [
        {
          step: 1,
          html: '解：连接<i class="m">MC</i>．<br>∵ 圆心<i class="m">M</i>在<i class="m">x</i>轴上，∴ 直径<span class="math"><i class="m">AB</i><span class="num">=4-(-1)=5</span></span>，<br>半径<span class="math"><i class="m">MC</i><span class="num">=</span><span class="fraction"><span><span class="num">5</span></span><span><span class="num">2</span></span></span></span>，圆心<span class="math"><i class="m">M</i><span class="num">(</span><span class="fraction"><span><span class="num">3</span></span><span><span class="num">2</span></span></span><span class="num">,0)</span></span>，即<span class="math"><i class="m">OM</i><span class="num">=</span><span class="fraction"><span><span class="num">3</span></span><span><span class="num">2</span></span></span></span>．'
        },
        {
          step: 2,
          html: '在<span class="num">Rt</span><span class="tri-sym">△</span><i class="m">MOC</i>中，由勾股定理，得<br><span class="math"><i class="m">OC</i><span class="num">=</span><span class="sqrt"><span><i class="m">MC</i><sup><span class="num">2</span></sup><span class="num">-</span><i class="m">OM</i><sup><span class="num">2</span></sup></span></span><span class="num">=</span><span class="sqrt"><span><span class="num">(</span><span class="fraction"><span><span class="num">5</span></span><span><span class="num">2</span></span></span><span class="num">)</span><sup><span class="num">2</span></sup><span class="num">-(</span><span class="fraction"><span><span class="num">3</span></span><span><span class="num">2</span></span></span><span class="num">)</span><sup><span class="num">2</span></sup></span></span><span class="num">=2</span></span>．'
        },
        {
          step: 3,
          html: '∵ 直径<span class="math"><i class="m">AB</i><span class="num">⊥</span><i class="m">CD</i></span>于点<i class="m">O</i>，∴ <span class="math"><i class="m">OD</i><span class="num">=</span><i class="m">OC</i><span class="num">=2</span></span>．<br>所以，交点坐标为<span class="math"><i class="m">C</i><span class="num">(0,2)</span></span>，<span class="math"><i class="m">D</i><span class="num">(0,-2)</span></span>．'
        }
      ];

      return window.pptExampleLayout({
        step: step,
        lines: lines,
        rightSvg: cv.toSvg()
      });
    }
  });

  // --------------------------------------------------------------------------
  // Slide 17：四、分层训练 第1题：圆柱油槽双解分类讨论（PPT大字板书版）
  // --------------------------------------------------------------------------
  window.defineSlide({
    lesson: 1,
    phase: 3,
    layout: 'layout-ppt',
    navTag: '训练1·油槽双解',
    section: '分层训练',
    title: "分层训练<span class='num'>1</span>：圆内平行弦距离的分类讨论",
    stem:
      '<p><span class="num">1．</span>在圆柱形油槽内装有一些油，截面如图所示，已知截面<span class="num">⊙</span><i class="m">O</i>半径为<span class="num">5cm</span>，油面宽<i class="m">AB</i>为<span class="num">6cm</span>，如果再注入一些油后，油面宽变为<span class="num">8cm</span>，则油面<i class="m">AB</i>上升了<span style="white-space:nowrap;">（<span class="screen-blank choice-blank" data-step="3" data-ans="D"></span>）</span></p>' +
      window.renderChoices([
        'A．<span class="num">1cm</span>',
        'B．<span class="num">3cm</span>',
        'C．<span class="num">3cm</span>或<span class="num">4cm</span>',
        'D．<span class="num">1cm</span>或<span class="num">7cm</span>'
      ], 4),
    steps: [
      { title: '求初始弦心距OE' },
      { title: '求注油后弦心距OF' },
      { title: '分圆心上下方两类求解' }
    ],
    onInit: function (state) {
      state.oilMode = 'below';
    },
    controls: function (step, state) {
      if (step >= 2) {
        return window.modeButtons('oilMode', state.oilMode, [
          ['below', '情况①：圆心下方(+1cm)', 3],
          ['above', '情况②：圆心上方(+7cm)', 3]
        ]);
      }
      return '';
    },
    renderBody: function (step, state) {
      var cv = window.createCoordCanvas({
        width: 480,
        height: 375,
        xRange: [-6.6, 7.2],
        yRange: [-5.9, 5.9],
        equalAspect: true,
        padding: { left: 18, right: 22, top: 14, bottom: 14 }
      });

      var isAbove = state && state.oilMode === 'above';
      var yNew = isAbove ? 3 : -3;
      var degA = (Math.atan2(-4, -3) * 180) / Math.PI;
      var degB = (Math.atan2(-4, 3) * 180) / Math.PI;

      var baseOilPts = sampleArcPoints(0, 0, 5, degA, degB, 40);
      cv.raw(ptsToSvgPath(cv, baseOilPts, 'rgba(251,191,36,0.28)', 'none', 0));
      var hatchOffsets = [1.2, 2.0, 2.8, 3.6, 4.4, 5.2, 6.0];
      for (var hi = 0; hi < hatchOffsets.length; hi++) {
        var cVal = hatchOffsets[hi];
        var disc = 50 - cVal * cVal;
        if (disc > 0.05) {
          var yLow = Math.max(-5, (-cVal - Math.sqrt(disc)) / 2);
          var yHigh = Math.min(-4, (-cVal + Math.sqrt(disc)) / 2);
          if (yHigh > yLow + 0.06) {
            cv.drawSegment([yLow + cVal, yLow], [yHigh + cVal, yHigh], { color: 'rgba(180,83,9,0.42)', width: 1.2 });
          }
        }
      }

      if (step >= 2) {
        var angC = (Math.atan2(yNew, -4) * 180) / Math.PI;
        var angCLeft = isAbove ? -360 + angC : angC;
        var angDRight = (Math.atan2(yNew, 4) * 180) / Math.PI;
        var leftArc = sampleArcPoints(0, 0, 5, degA, angCLeft, 28);
        var rightArc = sampleArcPoints(0, 0, 5, angDRight, degB, 28);
        cv.raw(ptsToSvgPath(cv, leftArc.concat(rightArc), 'rgba(56,189,248,0.22)', 'none', 0));
      }

      cv.raw('<circle cx="' + cv.px(0).toFixed(1) + '" cy="' + cv.py(0).toFixed(1) + '" r="' + (5 * cv.scaleX).toFixed(1) + '" fill="none" stroke="#1e293b" stroke-width="2.7"/>');
      cv.drawSegment([-3, -4], [3, -4], { color: '#0f172a', width: 2.6 });

      if (step >= 1) {
        cv.drawSegment([0, 0], [0, -4], { color: '#1d4ed8', width: 2.4 });
        cv.drawRightAngle([0, -4], [-3, -4], [0, 0], 9.5, '#1d4ed8');
        cv.drawSegment([0, 0], [-3, -4], { color: '#dc2626', width: 2.6, dash: '6 4' });
        if (step === 1) {
          cv.drawText([-1.85, -1.75], '5', { color: '#dc2626', fontSize: 16.5, anchor: 'end' });
          cv.drawText([0.48, -2.0], 'OE=4', { color: '#1d4ed8', fontSize: 16, anchor: 'start' });
        }
      }

      if (step >= 2) {
        cv.drawSegment([-4, yNew], [4, yNew], { color: '#0284c7', width: 2.9 });
        cv.drawSegment([0, 0], [0, yNew], { color: '#0d9488', width: 2.5 });
        cv.drawRightAngle([0, yNew], [-4, yNew], [0, 0], 9.5, '#0d9488');
        cv.drawSegment([0, 0], [-4, yNew], { color: '#0d9488', width: 2.6, dash: '6 4' });

        if (isAbove) {
          cv.drawText([0.48, 1.5], 'OF=3', { color: '#0d9488', fontSize: 15.5, anchor: 'start' });
          cv.drawText([0.48, -2.0], 'OE=4', { color: '#1d4ed8', fontSize: 15.5, anchor: 'start' });
        } else {
          cv.drawText([0.48, -1.45], 'OF=3', { color: '#0d9488', fontSize: 15.5, anchor: 'start' });
        }

        cv.drawPoint([-4, yNew], { label: 'C', dx: -13, dy: isAbove ? -6 : 12, fontSize: 17.5, anchor: 'end', color: '#0284c7', r: 4.5 });
        cv.drawPoint([4, yNew], { label: 'D', dx: 11, dy: isAbove ? -8 : 20, fontSize: 17.5, anchor: 'start', color: '#0284c7', r: 4.5 });
        cv.drawPoint([0, yNew], {
          label: 'F',
          dx: 8,
          dy: isAbove ? -8 : -6,
          fontSize: 17,
          anchor: 'start',
          color: '#0d9488',
          r: 4.2
        });

        var dimX = cv.px(5.65);
        var yBotPx = cv.py(-4);
        var yTopPx = cv.py(yNew);
        cv.drawSegment([3, -4], [5.95, -4], { color: '#dc2626', width: 1.3, dash: '3 3' });
        cv.drawSegment([4, yNew], [5.95, yNew], { color: '#dc2626', width: 1.3, dash: '3 3' });
        cv.raw('<line x1="' + dimX.toFixed(1) + '" y1="' + (yTopPx + 4).toFixed(1) + '" x2="' + dimX.toFixed(1) + '" y2="' + (yBotPx - 4).toFixed(1) + '" stroke="#dc2626" stroke-width="2.1"/>');
        cv.raw('<polygon points="' + dimX.toFixed(1) + ',' + yTopPx.toFixed(1) + ' ' + (dimX - 3.8).toFixed(1) + ',' + (yTopPx + 6.5).toFixed(1) + ' ' + (dimX + 3.8).toFixed(1) + ',' + (yTopPx + 6.5).toFixed(1) + '" fill="#dc2626"/>');
        cv.raw('<polygon points="' + dimX.toFixed(1) + ',' + yBotPx.toFixed(1) + ' ' + (dimX - 3.8).toFixed(1) + ',' + (yBotPx - 6.5).toFixed(1) + ' ' + (dimX + 3.8).toFixed(1) + ',' + (yBotPx - 6.5).toFixed(1) + '" fill="#dc2626"/>');
        cv.drawText([6.0, (-4 + yNew) / 2 - 0.15], isAbove ? '7cm' : '1cm', {
          color: '#dc2626',
          fontSize: 16.5,
          anchor: 'start'
        });
      }

      if (step >= 2 && isAbove) {
        cv.drawPoint([0, 0], { label: 'O', dx: -12, dy: 5, fontSize: 17.5, anchor: 'end', color: '#0f172a', r: 4.6 });
      } else {
        cv.drawPoint([0, 0], { label: 'O', dx: 0, dy: -11, fontSize: 17.5, anchor: 'middle', color: '#0f172a', r: 4.6 });
      }
      cv.drawPoint([-3, -4], { label: 'A', dx: -11, dy: 15, fontSize: 17.5, anchor: 'end', color: '#0f172a', r: 4.6 });
      cv.drawPoint([3, -4], { label: 'B', dx: 9, dy: 17, fontSize: 17.5, anchor: 'start', color: '#0f172a', r: 4.6 });
      if (step >= 1) {
        cv.drawPoint([0, -4], {
          label: 'E',
          dx: step >= 2 && !isAbove ? -11 : 9,
          dy: 17,
          fontSize: 17,
          anchor: step >= 2 && !isAbove ? 'end' : 'start',
          color: '#1d4ed8',
          r: 4.2
        });
      }

      var lines = [
        {
          step: 1,
          html: '解：作<span class="math"><i class="m">OE</i><span class="num">⊥</span><i class="m">AB</i></span>于<i class="m">E</i>，连接<i class="m">OA</i>．<br>由<span class="math"><i class="m">OA</i><span class="num">=5</span></span>，<span class="math"><i class="m">AE</i><span class="num">=3</span></span>，得<span class="math"><i class="m">OE</i><span class="num">=</span><span class="sqrt"><span><span class="num">5</span><sup><span class="num">2</span></sup><span class="num">-3</span><sup><span class="num">2</span></sup></span></span><span class="num">=4(cm)</span></span>．'
        },
        {
          step: 2,
          html: '设注油后新油面<span class="math"><i class="m">CD</i><span class="num">=8</span></span>交直线<i class="m">OE</i>于<i class="m">F</i>，连接<i class="m">OC</i>．<br>由<span class="math"><i class="m">OC</i><span class="num">=5</span></span>，<span class="math"><i class="m">CF</i><span class="num">=4</span></span>，得<span class="math"><i class="m">OF</i><span class="num">=</span><span class="sqrt"><span><span class="num">5</span><sup><span class="num">2</span></sup><span class="num">-4</span><sup><span class="num">2</span></sup></span></span><span class="num">=3(cm)</span></span>．'
        },
        {
          step: 3,
          html: '分两种情况讨论：<br>① 新油面在圆心<b>下方</b>：<span class="math"><i class="m">EF</i><span class="num">=4-3=1(cm)</span></span>；<br>② 新油面在圆心<b>上方</b>：<span class="math"><i class="m">EF</i><span class="num">=4+3=7(cm)</span></span>．故选 <span class="num">D</span>．'
        }
      ];

      return window.pptExampleLayout({
        step: step,
        lines: lines,
        rightSvg: cv.toSvg()
      });
    }
  });

  // --------------------------------------------------------------------------
  // Slide 18：四、分层训练 第2题：赵州石拱桥圆弧半径建模（PPT大字板书版）
  // --------------------------------------------------------------------------
  window.defineSlide({
    lesson: 1,
    phase: 3,
    layout: 'layout-ppt',
    navTag: '训练2·赵州拱桥',
    section: '分层训练',
    title: "分层训练<span class='num'>2</span>：赵州石拱桥圆弧半径建模",
    stem:
      '<p><span class="num">2．</span><span class="num">1400</span>多年前，我国隋朝建造的赵州石拱桥（如图）是圆弧形，它的跨度（即弧所对的弦长）为<span class="num">37.2m</span>，拱高（即弧的中点到弦的距离）为<span class="num">7.23m</span>，求桥拱所在圆的半径（结果精确到<span class="num">0.01m</span>）．</p>',
    steps: [
      { title: '设半径R并由垂径定理求半弦AD' },
      { title: '表示弦心距OD' },
      { title: '在Rt△OAD中列勾股方程求解' }
    ],
    renderBody: function (step) {
      var cv = window.createCoordCanvas({
        width: 475,
        height: 390,
        xRange: [-23.5, 23.5],
        yRange: [-3.5, 30.8],
        equalAspect: true,
        padding: { left: 16, right: 16, top: 14, bottom: 14 }
      });

      var yD = 20.31;
      var yC = 27.54;
      var R = Math.hypot(18.6, yD);
      var degB = (Math.atan2(yD, 18.6) * 180) / Math.PI;
      var degA = 180 - degB;

      if (step >= 2) {
        cv.drawPolygon([[0, 0], [0, yD], [-18.6, yD]], {
          fill: 'rgba(37,99,235,0.15)',
          stroke: 'none',
          width: 0
        });
      }

      cv.drawSegment([0, 0], [-18.6, yD], {
        color: step >= 2 ? '#dc2626' : '#475569',
        width: step >= 2 ? 2.8 : 2.1,
        dash: '6 4'
      });
      cv.drawSegment([0, 0], [18.6, yD], { color: '#64748b', width: 2.0, dash: '6 4' });
      cv.drawSegment([0, 0], [0, yD], {
        color: step >= 2 ? '#1d4ed8' : '#475569',
        width: step >= 2 ? 2.6 : 2.0,
        dash: '6 4'
      });
      cv.drawSegment([0, yD], [0, yC], { color: '#0f172a', width: 2.5 });

      var archPts = sampleArcPoints(0, 0, R, degA, degB, 64);
      cv.raw(ptsToSvgPolyline(cv, archPts, '#0f172a', 3.1));
      cv.drawSegment([-18.6, yD], [18.6, yD], { color: '#1e293b', width: 2.5 });
      if (step >= 1) {
        cv.drawSegment([-18.6, yD], [0, yD], { color: '#2563eb', width: 3.3 });
      }

      cv.drawRightAngle([0, yD], [18.6, yD], [0, yC], 10, '#334155');
      cv.drawText([-1.2, 23.8], '7.23', { color: '#0f172a', fontSize: 16, anchor: 'end' });

      var xL = cv.px(-18.6);
      var xR = cv.px(18.6);
      var yDim = cv.py(14.2);
      var xGapL = cv.px(-3.6);
      var xGapR = cv.px(3.6);
      cv.drawSegment([-18.6, yD - 0.6], [-18.6, 13.0], { color: '#475569', width: 1.4 });
      cv.drawSegment([18.6, yD - 0.6], [18.6, 13.0], { color: '#475569', width: 1.4 });
      cv.raw('<line x1="' + (xL + 4).toFixed(1) + '" y1="' + yDim.toFixed(1) + '" x2="' + xGapL.toFixed(1) + '" y2="' + yDim.toFixed(1) + '" stroke="#334155" stroke-width="1.7"/>');
      cv.raw('<line x1="' + xGapR.toFixed(1) + '" y1="' + yDim.toFixed(1) + '" x2="' + (xR - 4).toFixed(1) + '" y2="' + yDim.toFixed(1) + '" stroke="#334155" stroke-width="1.7"/>');
      cv.raw('<polygon points="' + xL.toFixed(1) + ',' + yDim.toFixed(1) + ' ' + (xL + 7).toFixed(1) + ',' + (yDim - 3.6).toFixed(1) + ' ' + (xL + 7).toFixed(1) + ',' + (yDim + 3.6).toFixed(1) + '" fill="#334155"/>');
      cv.raw('<polygon points="' + xR.toFixed(1) + ',' + yDim.toFixed(1) + ' ' + (xR - 7).toFixed(1) + ',' + (yDim - 3.6).toFixed(1) + ' ' + (xR - 7).toFixed(1) + ',' + (yDim + 3.6).toFixed(1) + '" fill="#334155"/>');
      cv.drawText([0, 13.5], '37.2', { color: '#0f172a', fontSize: 16.5, anchor: 'middle' });

      if (step >= 1) {
        cv.drawText([-9.3, 21.8], '18.6', { color: '#1d4ed8', fontSize: 16.5, anchor: 'middle' });
      }
      if (step >= 2) {
        cv.drawText([-9.8, 8.2], 'R', { color: '#dc2626', fontSize: 18, anchor: 'end' });
        cv.drawText([1.0, 10.4], 'R-7.23', { color: '#1d4ed8', fontSize: 15.5, anchor: 'start' });
      }

      cv.drawPoint([-18.6, yD], { label: 'A', dx: -11, dy: -6, fontSize: 18, anchor: 'end', color: '#0f172a', r: 4.5 });
      cv.drawPoint([18.6, yD], { label: 'B', dx: 11, dy: -6, fontSize: 18, anchor: 'start', color: '#0f172a', r: 4.5 });
      cv.drawPoint([0, yC], { label: 'C', dx: 0, dy: -11, fontSize: 18, anchor: 'middle', color: '#0f172a', r: 4.5 });
      cv.drawPoint([0, yD], { label: 'D', dx: 9, dy: 16, fontSize: 17.5, anchor: 'start', color: '#1d4ed8', r: 4.3 });
      cv.drawPoint([0, 0], { label: 'O', dx: 0, dy: 21, fontSize: 18, anchor: 'middle', color: '#0f172a', r: 4.6 });

      var lines = [
        {
          step: 1,
          html: '解：设桥拱所在圆的圆心为<i class="m">O</i>，半径为<span class="math"><i class="m">R</i><span class="num">m</span></span>．<br>连接<i class="m">OA</i>，过<i class="m">O</i>作半径<i class="m">OC</i>经过弧中点<i class="m">C</i>交<i class="m">AB</i>于点<i class="m">D</i>，则<span class="math"><i class="m">OC</i><span class="num">⊥</span><i class="m">AB</i></span>．'
        },
        {
          step: 2,
          html: '∴ <span class="math"><i class="m">AD</i><span class="num">=</span><span class="fraction"><span><span class="num">1</span></span><span><span class="num">2</span></span></span><i class="m">AB</i><span class="num">=</span><span class="fraction"><span><span class="num">1</span></span><span><span class="num">2</span></span></span><span class="num">×37.2=18.6(m)</span></span>，<span class="math"><i class="m">OD</i><span class="num">=</span><i class="m">OC</i><span class="num">-</span><i class="m">CD</i><span class="num">=(</span><i class="m">R</i><span class="num">-7.23)m</span></span>．'
        },
        {
          step: 3,
          html: '在<span class="num">Rt</span><span class="tri-sym">△</span><i class="m">OAD</i>中，由勾股定理得<span class="math"><i class="m">R</i><sup><span class="num">2</span></sup><span class="num">=18.6</span><sup><span class="num">2</span></sup><span class="num">+(</span><i class="m">R</i><span class="num">-7.23)</span><sup><span class="num">2</span></sup></span>，<br>解得<span class="math"><i class="m">R</i><span class="num">≈27.54</span></span>．所以，桥拱所在圆的半径约为<span class="num">27.54m</span>．'
        }
      ];

      return window.pptExampleLayout({
        step: step,
        lines: lines,
        rightSvg: cv.toSvg()
      });
    }
  });

  // --------------------------------------------------------------------------
  // Slide 19：课堂小结：全屏交互式思维导图（layout-i）
  // --------------------------------------------------------------------------
  window.defineSlide({
    lesson: 1,
    phase: 3,
    layout: 'layout-i',
    navTag: '小结·思维导图',
    section: '课堂小结',
    title: '课堂小结：垂径定理知识与方法体系',
    stem: '<p>点击导图分支或按空格键，系统梳理<b>垂径定理</b>的知识脉络与核心解题通法：</p>',
    centerTitle: '3.1.2 垂径定理',
    summary: '<b>核心数学思想：</b>轴对称转化思想 · <b>“作弦心距+连半径”构造<span class="num">Rt</span><span class="tri-sym">△</span>（方程思想）</b> · 圆内平行弦位置<b>分类讨论思想</b>．',
    steps: [
      {
        title: '圆的轴对称性',
        nodes: [
          '任意一条过圆心的直线都是对称轴（无数条）',
          '探究方法：折纸重合 + 等腰三角形三线合一'
        ]
      },
      {
        title: '垂径定理',
        nodes: [
          '条件：①过圆心 + ②垂直于弦',
          '结论：③平分弦 + ④平分劣弧 + ⑤平分优弧'
        ]
      },
      {
        title: '推论与易错点',
        nodes: [
          '平分弦（不是直径！）的直径垂直于弦',
          '易错：两直径互相平分但未必垂直；对称轴是直线'
        ]
      },
      {
        title: '核心解题模型',
        nodes: [
          '常规辅助线：过圆心作弦的垂线 + 连接半径',
          '勾股关系：半径² = 弦心距² + 半弦²（注意双解）'
        ]
      }
    ]
  });
})();

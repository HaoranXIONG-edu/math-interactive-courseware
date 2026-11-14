window.UNIT1_THEOREM_SLIDES = window.UNIT1_THEOREM_SLIDES || [];
window.UNIT1_SIMS = window.UNIT1_SIMS || {};

(function () {
  var slider = window.CoursewareControls ? window.CoursewareControls.slider : function (key, label, min, max, val, step, unit) {
    return '<div class="ctrl-row"><label class="ctrl-label">' + label + '：<b>' + val + (unit || '') + '</b></label>' +
      '<input type="range" class="ctrl-slider" data-key="' + key + '" min="' + min + '" max="' + max + '" step="' + step + '" value="' + val + '"></div>';
  };
  var foCard = window.svgFoCard || function (x, y, w, h, html, style) {
    return '<foreignObject x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '">' +
      '<div xmlns="http://www.w3.org/1999/xhtml" style="width:100%;height:100%;box-sizing:border-box;' + (style || '') + '">' + html + '</div></foreignObject>';
  };

  // =========================================================================
  // 第 1 页：二、新知探究 · 问题3（1）（2）—— 矿泉水需求/供给函数关系式与每瓶最大获利月份
  // =========================================================================
  window.defineSlide({
    id: 'u232-prob3-12',
    phase: 3,
    navTag: '问题3(1)(2)·供需建模与单瓶获利',
    section: '新知探究',
    title: '问题<span class="num">3</span>（<span class="num">1</span>）（<span class="num">2</span>）：崂山矿泉水需求/供给函数与每瓶最大获利月份',
    layout: 'layout-b',
    state: { tMonth: 7 },
    stem:
      '<p><b>问题<span class="num">3</span>：</b>小飞一家在崂山风景区超市统计某种矿泉水（图<span class="num">1</span>规格：<span class="num">570mL×24</span>）在旅游黄金季（<span class="num">5～10</span>月）的销售数据：①零售价不得高于<span class="num">6</span>元<span class="num">/</span>瓶；②当售价<span class="math"><i class="m">x</i><span class="num">=3</span></span>元<span class="num">/</span>瓶时，需求量<span class="math"><i class="m">y</i><sub>需求</sub><span class="num">=100</span></span>箱，售价每上涨<span class="num">0.5</span>元，需求量减少<span class="num">5</span>箱；③供给量<i class="m">y</i><sub>供给</sub>（箱）与售价<i class="m">x</i>（元<span class="num">/</span>瓶）如下表；④<span class="num">5～10</span>月份售价<span class="math"><i class="m">x</i><sub>售价</sub><span class="num">=</span><span class="fraction"><span><span class="num">1</span></span><span><span class="num">2</span></span></span><i class="m">t</i><span class="num">+</span><span class="fraction"><span><span class="num">1</span></span><span><span class="num">2</span></span></span></span>，成本<span class="math"><i class="m">x</i><sub>成本</sub><span class="num">=-</span><span class="fraction"><span><span class="num">1</span></span><span><span class="num">4</span></span></span><i class="m">t</i><sup><span class="num">2</span></sup><span class="num">+</span><span class="fraction"><span><span class="num">7</span></span><span><span class="num">2</span></span></span><i class="m">t</i><span class="num">-</span><span class="fraction"><span><span class="num">37</span></span><span><span class="num">4</span></span></span></span>（见图<span class="num">2</span>）．</p>' +
      '<table class="stem-data-table"><tr><th>售价<i class="m">x</i>（元<span class="num">/</span>瓶）</th><td><span class="num">3</span></td><td><span class="num">4</span></td><td><span class="num">4.5</span></td><td><span class="num">5</span></td><td><span class="num">6</span></td></tr><tr><th><i class="m">y</i><sub>供给</sub>（箱）</th><td><span class="num">120</span></td><td><span class="num">90</span></td><td><span class="num">80</span></td><td><span class="num">72</span></td><td><span class="num">60</span></td></tr></table>' +
      '<p>（<span class="num">1</span>）需求量<span class="screen-blank" data-step="1" data-ans="<i class=\'m\'>y</i><sub>需求</sub><span class=\'num\'>=-10</span><i class=\'m\'>x</i><span class=\'num\'>+130</span>"></span>，供给量<span class="screen-blank" data-step="2" data-ans="<span class=\'math\'><i class=\'m\'>y</i><sub>供给</sub><span class=\'num\'>=</span><span class=\'fraction\'><span><span class=\'num\'>360</span></span><span><i class=\'m\'>x</i></span></span></span>"></span>；　（<span class="num">2</span>）在<span class="screen-blank" data-step="3" data-ans="<span class=\'num\'>10</span>"></span>月出售每瓶获利<i class="m">x</i><sub>利润</sub>最大（最大为<span class="screen-blank" data-step="3" data-ans="<span class=\'num\'>4.75</span>"></span>元<span class="num">/</span>瓶）．</p>',
    steps: [
      {
        title: '建立需求量 <i class="m">y</i><sub>需求</sub> 关于售价 <i class="m">x</i> 的一次函数关系式',
        html: '<p><b>【第（<span class="num">1</span>）问①·需求函数】</b>由题意，售价每上涨<span class="num">0.5</span>元需求量减少<span class="num">5</span>箱，即售价每上涨<span class="num">1</span>元，需求量减少<span class="num">10</span>箱．</p>' +
          '<p>当<span class="math"><i class="m">x</i><span class="num">=3</span></span>时，<span class="math"><i class="m">y</i><sub>需求</sub><span class="num">=100</span></span>，故：<span class="math"><i class="m">y</i><sub>需求</sub><span class="num">=100-10(</span><i class="m">x</i><span class="num">-3)=</span><b class="hl-blue"><span class="num">-10</span><i class="m">x</i><span class="num">+130</span></b></span>（<span class="math"><span class="num">3≤</span><i class="m">x</i><span class="num">≤6</span></span>）．</p>'
      },
      {
        title: '验证乘积定值建立供给量 <i class="m">y</i><sub>供给</sub> 关于售价 <i class="m">x</i> 的反比例函数关系式',
        html: '<p><b>【第（<span class="num">1</span>）问②·供给函数】</b>观察表格中各组售价<i class="m">x</i>与供给量<i class="m">y</i><sub>供给</sub>的乘积：</p>' +
          '<p><span class="math"><span class="num">3×120=4×90=4.5×80=5×72=6×60=360</span></span>（定值），故供给量与售价成反比例函数关系：<span class="math"><i class="m">y</i><sub>供给</sub><span class="num">=</span><b class="hl-red"><span class="fraction"><span><span class="num">360</span></span><span><i class="m">x</i></span></span></b></span>（<span class="math"><span class="num">3≤</span><i class="m">x</i><span class="num">≤6</span></span>）．</p>'
      },
      {
        title: '求每瓶获利 <i class="m">x</i><sub>利润</sub> 关于月份 <i class="m">t</i> 的二次函数最值',
        html: '<p><b>【第（<span class="num">2</span>）问·单瓶最大利润月份】</b>设每瓶获利为<i class="m">x</i><sub>利润</sub>元，则<span class="math"><i class="m">x</i><sub>利润</sub><span class="num">=</span><i class="m">x</i><sub>售价</sub><span class="num">-</span><i class="m">x</i><sub>成本</sub></span>：</p>' +
          '<p><span class="math"><i class="m">x</i><sub>利润</sub><span class="num">=(</span><span class="fraction"><span><span class="num">1</span></span><span><span class="num">2</span></span></span><i class="m">t</i><span class="num">+</span><span class="fraction"><span><span class="num">1</span></span><span><span class="num">2</span></span></span><span class="num">)-(-</span><span class="fraction"><span><span class="num">1</span></span><span><span class="num">4</span></span></span><i class="m">t</i><sup><span class="num">2</span></sup><span class="num">+</span><span class="fraction"><span><span class="num">7</span></span><span><span class="num">2</span></span></span><i class="m">t</i><span class="num">-</span><span class="fraction"><span><span class="num">37</span></span><span><span class="num">4</span></span></span><span class="num">)=</span><span class="fraction"><span><span class="num">1</span></span><span><span class="num">4</span></span></span><i class="m">t</i><sup><span class="num">2</span></sup><span class="num">-3</span><i class="m">t</i><span class="num">+</span><span class="fraction"><span><span class="num">39</span></span><span><span class="num">4</span></span></span><span class="num">=</span><span class="fraction"><span><span class="num">1</span></span><span><span class="num">4</span></span></span><span class="num">(</span><i class="m">t</i><span class="num">-6)</span><sup><span class="num">2</span></sup><span class="num">+</span><span class="fraction"><span><span class="num">3</span></span><span><span class="num">4</span></span></span></span>．</p>' +
          '<p>因为<span class="math"><span class="fraction"><span><span class="num">1</span></span><span><span class="num">4</span></span></span><span class="num">&gt;0</span></span>，抛物线开口向上，对称轴为直线<span class="math"><i class="m">t</i><span class="num">=6</span></span>．在<span class="math"><span class="num">5≤</span><i class="m">t</i><span class="num">≤10</span></span>范围内，当<span class="math"><i class="m">t</i><span class="num">=10</span></span>（即<b class="hl-green"><span class="num">10</span>月份</b>）时，每瓶获利最大，最大为<span class="math"><span class="fraction"><span><span class="num">1</span></span><span><span class="num">4</span></span></span><span class="num">×(10-6)</span><sup><span class="num">2</span></sup><span class="num">+</span><span class="fraction"><span><span class="num">3</span></span><span><span class="num">4</span></span></span><span class="num">=</span><b class="hl-green"><span class="num">4.75</span></b></span>（元<span class="num">/</span>瓶）．</p>'
      }
    ],
    controls: function (step, state) {
      if (step < 3) return '';
      var tVal = state && state.tMonth ? state.tMonth : 7;
      return slider('tMonth', '探究月份 <i class="m">t</i>', 5, 10, tVal, 1, '月');
    },
    renderScene: function (step, state) {
      var tMonth = (state && state.tMonth) ? Number(state.tMonth) : (step >= 3 ? 10 : 7);
      var svg = '<svg viewBox="0 0 640 420" width="100%" height="100%">';
      svg += '<defs>' +
        '<marker id="arr-p31" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,1 L9,5 L0,9 Z" fill="#334155"/></marker>' +
        '<linearGradient id="boxGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#e0f2fe"/><stop offset="100%" stop-color="#bae6fd"/></linearGradient>' +
        '</defs>';

      // 顶部：step >= 1 & step >= 2 浮现需求与供给函数卡片
      if (step === 0) {
        svg += foCard(16, 10, 608, 42,
          '<div style="background:#f8fafc;border:1.5px dashed #94a3b8;border-radius:8px;padding:6px 12px;font-size:13px;color:#334155;display:flex;align-items:center;justify-content:space-between;">' +
          '<span><b>【审题观察】</b>左图1给出<b>每箱<span class="num">24</span>瓶</b>隐藏条件；右图2展示<span class="num">5～10</span>月售价与成本变化趋势</span>' +
          '<span style="color:#0284c7;font-weight:700;">点击下一步逐步推导</span></div>'
        );
      } else {
        var card1Html = '<div style="background:#eff6ff;border:1.5px solid #3b82f6;border-radius:8px;padding:5px 10px;font-size:13px;color:#1e3a8a;height:100%;display:flex;align-items:center;justify-content:center;">' +
          '<b>① 需求函数：</b><span class="math"><i class="m">y</i><sub>需求</sub><span class="num">=-10</span><i class="m">x</i><span class="num">+130</span></span>（<span class="math"><span class="num">3≤</span><i class="m">x</i><span class="num">≤6</span></span>）</div>';
        svg += foCard(16, 8, 296, 44, card1Html);

        if (step >= 2) {
          var card2Html = '<div style="background:#fef2f2;border:1.5px solid #ef4444;border-radius:8px;padding:5px 10px;font-size:13px;color:#991b1b;height:100%;display:flex;align-items:center;justify-content:center;">' +
            '<b>② 供给函数：</b><span class="math"><i class="m">y</i><sub>供给</sub><span class="num">=</span><span class="fraction"><span><span class="num">360</span></span><span><i class="m">x</i></span></span></span>（乘积定值<span class="num">360</span>）</div>';
          svg += foCard(324, 8, 300, 44, card2Html);
        }
      }

      // 左侧：图1 矿泉水箱示意图 (x: 16..206, y: 64..395)
      svg += '<rect x="16" y="62" width="186" height="245" rx="10" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>';
      svg += '<text x="109" y="84" font-size="14" font-weight="700" fill="#1e293b" text-anchor="middle">图1：矿泉水整箱规格</text>';
      // 3D 矿泉水纸箱绘制
      svg += '<polygon points="42,135 142,135 172,110 72,110" fill="#bae6fd" stroke="#0284c7" stroke-width="1.8"/>';
      svg += '<rect x="42" y="135" width="100" height="82" fill="url(#boxGrad)" stroke="#0284c7" stroke-width="1.8"/>';
      svg += '<polygon points="142,135 172,110 172,192 142,217" fill="#7dd3fc" stroke="#0284c7" stroke-width="1.8"/>';
      // 箱面文字
      svg += '<text x="92" y="168" font-size="16" font-weight="800" fill="#0369a1" text-anchor="middle">崂山矿泉水</text>';
      svg += '<rect x="52" y="182" width="80" height="22" rx="4" fill="#0284c7"/>';
      svg += '<text x="92" y="198" font-size="12" font-weight="700" fill="#ffffff" text-anchor="middle">570mL×24</text>';
      // 关键提炼提示
      svg += foCard(24, 228, 170, 72,
        '<div style="background:#fffbeb;border:1px solid #f59e0b;border-radius:6px;padding:6px 8px;font-size:12.5px;color:#92400e;line-height:1.45;">' +
        '<b>读图关键信息：</b><br/>规格 <span class="num">570mL×24</span> 表示<b>每箱有 <span class="num">24</span> 瓶</b>矿泉水！</div>'
      );

      // 左下角：step >= 3 显示二次函数配方法结论卡片
      if (step >= 3) {
        svg += foCard(16, 314, 186, 96,
          '<div style="background:#f0fdf4;border:1.5px solid #16a34a;border-radius:8px;padding:6px 8px;font-size:12px;color:#14532d;line-height:1.4;">' +
          '<b>③ 单瓶利润函数：</b><br/>' +
          '<span class="math"><i class="m">x</i><sub>利润</sub><span class="num">=</span><span class="fraction"><span><span class="num">1</span></span><span><span class="num">4</span></span></span><span class="num">(</span><i class="m">t</i><span class="num">-6)</span><sup><span class="num">2</span></sup><span class="num">+</span><span class="fraction"><span><span class="num">3</span></span><span><span class="num">4</span></span></span></span><br/>' +
          '离对称轴<span class="math"><i class="m">t</i><span class="num">=6</span></span>越远越大<br/>' +
          '∴ <b style="color:#15803d;"><span class="num">10</span>月最大为 <span class="num">4.75</span> 元/瓶</b></div>'
        );
      }

      // 右侧：图2 售价与成本随月份 t 的函数图象 (x: 214..624, y: 62..410)
      svg += '<rect x="214" y="62" width="410" height="348" rx="10" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>';
      svg += '<text x="419" y="84" font-size="14" font-weight="700" fill="#1e293b" text-anchor="middle">图2：5～10月每瓶售价与每瓶成本函数图象</text>';

      // 坐标映射：t in [4, 10.8] -> x in [258, 598] (每1个月 = 50px, t=4对应258)
      // xPrice in [0, 6.5] -> y in [366, 106] (每1元 = 40px, y=0对应366)
      var tx = function (t) { return 258 + (t - 4) * 50; };
      var py = function (v) { return 366 - v * 40; };

      // 网格线与刻度
      for (var gv = 1; gv <= 6; gv++) {
        var gy = py(gv);
        svg += '<line x1="258" y1="' + gy + '" x2="592" y2="' + gy + '" stroke="#f1f5f9" stroke-width="1"/>';
        svg += '<text x="250" y="' + (gy + 4) + '" font-size="12" fill="#64748b" text-anchor="end">' + gv + '</text>';
      }
      for (var gt = 5; gt <= 10; gt++) {
        var gx = tx(gt);
        svg += '<line x1="' + gx + '" y1="106" x2="' + gx + '" y2="366" stroke="#f1f5f9" stroke-width="1"/>';
        svg += '<text x="' + gx + '" y="384" font-size="12" fill="#475569" text-anchor="middle">' + gt + '</text>';
      }

      // 坐标轴
      svg += '<line x1="258" y1="366" x2="606" y2="366" stroke="#334155" stroke-width="1.8" marker-end="url(#arr-p31)"/>';
      svg += '<line x1="258" y1="366" x2="258" y2="96" stroke="#334155" stroke-width="1.8" marker-end="url(#arr-p31)"/>';
      svg += '<text x="604" y="396" font-size="12.5" font-weight="700" fill="#1e293b" text-anchor="end">t（月份）</text>';
      svg += '<text x="266" y="106" font-size="12.5" font-weight="700" fill="#1e293b">金额（元/瓶）</text>';

      // 绘制成本抛物线 x_成本 = -1/4 t^2 + 7/2 t - 37/4, t in [5, 10]
      var costPts = [];
      for (var t = 5; t <= 10.001; t += 0.1) {
        var cVal = -0.25 * t * t + 3.5 * t - 9.25;
        costPts.push(tx(t).toFixed(1) + ',' + py(cVal).toFixed(1));
      }
      svg += '<polyline points="' + costPts.join(' ') + '" fill="none" stroke="#ea580c" stroke-width="2.8"/>';

      // 绘制售价直线段 x_售价 = 0.5 t + 0.5, t in [5, 10]
      svg += '<line x1="' + tx(5) + '" y1="' + py(3) + '" x2="' + tx(10) + '" y2="' + py(5.5) + '" stroke="#2563eb" stroke-width="2.8"/>';

      // 标出原题关键整点: 售价(5,3),(9,5)；成本(5,2),(6,2.75),(7,3),(9,2)
      var keyPts = [
        { t: 5, v: 3, col: '#2563eb' },
        { t: 9, v: 5, col: '#2563eb' },
        { t: 10, v: 5.5, col: '#2563eb' },
        { t: 5, v: 2, col: '#ea580c' },
        { t: 7, v: 3, col: '#ea580c' },
        { t: 9, v: 2, col: '#ea580c' }
      ];
      for (var i = 0; i < keyPts.length; i++) {
        var kp = keyPts[i];
        svg += '<circle cx="' + tx(kp.t) + '" cy="' + py(kp.v) + '" r="3.8" fill="' + kp.col + '" stroke="#fff" stroke-width="1.2"/>';
      }
      svg += '<text x="' + (tx(7.2)) + '" y="' + (py(4.1) - 10) + '" font-size="13" font-weight="700" fill="#2563eb">x售价 = 0.5t + 0.5</text>';
      svg += '<text x="' + (tx(6.6)) + '" y="' + (py(2.95) + 22) + '" font-size="13" font-weight="700" fill="#ea580c">x成本（抛物线）</text>';

      // step >= 3：动态展示第 tMonth 月的铅垂距离（每瓶获利 x_利润）
      if (step >= 3) {
        var sellT = 0.5 * tMonth + 0.5;
        var costT = -0.25 * tMonth * tMonth + 3.5 * tMonth - 9.25;
        var profT = sellT - costT;
        var cxT = tx(tMonth);
        var ySell = py(sellT);
        var yCost = py(costT);

        // 先画 10 月份最大获利虚线参考（若当前不是10月）
        if (tMonth !== 10) {
          svg += '<line x1="' + tx(10) + '" y1="' + py(5.5) + '" x2="' + tx(10) + '" y2="' + py(0.75) + '" stroke="#16a34a" stroke-width="2" stroke-dasharray="4,3"/>';
          svg += '<text x="' + (tx(10) - 6) + '" y="' + py(3.1) + '" font-size="11.5" font-weight="700" fill="#16a34a" text-anchor="end">10月最大:4.75</text>';
        }

        // 当前选中月份的红色铅垂线段
        svg += '<line x1="' + cxT + '" y1="' + ySell + '" x2="' + cxT + '" y2="' + yCost + '" stroke="#dc2626" stroke-width="3.5"/>';
        svg += '<circle cx="' + cxT + '" cy="' + ySell + '" r="5.5" fill="#2563eb" stroke="#fff" stroke-width="1.5"/>';
        svg += '<circle cx="' + cxT + '" cy="' + yCost + '" r="5.5" fill="#ea580c" stroke="#fff" stroke-width="1.5"/>';

        var badgeX = Math.min(Math.max(cxT - 95, 265), 425);
        svg += foCard(badgeX, 102, 195, 58,
          '<div style="background:rgba(254,242,242,0.96);border:1.5px solid #dc2626;border-radius:8px;padding:5px 8px;font-size:12px;color:#7f1d1d;box-shadow:0 2px 6px rgba(0,0,0,0.08);">' +
          '<b><span class="num">' + tMonth + '</span>月份单瓶核算：</b><br/>' +
          '售价<span class="num">' + sellT.toFixed(2).replace(/\.00$/, '') + '</span> - 成本<span class="num">' + costT.toFixed(2).replace(/\.00$/, '') + '</span> = <b style="color:#dc2626;font-size:13px;"><span class="num">' + profT.toFixed(2).replace(/\.00$/, '') + '</span>元/瓶</b></div>'
        );
      }

      svg += '</svg>';
      return svg;
    }
  });

  // =========================================================================
  // 第 2 页：二、新知探究 · 问题3（3）—— 供需平衡时的售价与总利润
  // =========================================================================
  window.defineSlide({
    id: 'u232-prob3-3',
    phase: 3,
    navTag: '问题3(3)·供需平衡与总利润',
    section: '新知探究',
    title: '问题<span class="num">3</span>（<span class="num">3</span>）：矿泉水需求量与供给量相等时的均衡售价与总利润',
    layout: 'layout-b',
    state: {},
    stem:
      '<div style="background:#f0f9ff;border-left:4px solid #0284c7;border-radius:6px;padding:6px 10px;margin-bottom:8px;font-size:13.5px;color:#0c4a6e;">' +
      '<b>【前问已知】</b>每箱<span class="num">24</span>瓶，需求量<span class="math"><i class="m">y</i><sub>需求</sub><span class="num">=-10</span><i class="m">x</i><span class="num">+130</span></span>，供给量<span class="math"><i class="m">y</i><sub>供给</sub><span class="num">=</span><span class="fraction"><span><span class="num">360</span></span><span><i class="m">x</i></span></span></span>（<span class="math"><span class="num">3≤</span><i class="m">x</i><span class="num">≤6</span></span>）；<span class="math"><i class="m">x</i><sub>售价</sub><span class="num">=</span><span class="fraction"><span><span class="num">1</span></span><span><span class="num">2</span></span></span><i class="m">t</i><span class="num">+</span><span class="fraction"><span><span class="num">1</span></span><span><span class="num">2</span></span></span></span>，<span class="math"><i class="m">x</i><sub>成本</sub><span class="num">=-</span><span class="fraction"><span><span class="num">1</span></span><span><span class="num">4</span></span></span><i class="m">t</i><sup><span class="num">2</span></sup><span class="num">+</span><span class="fraction"><span><span class="num">7</span></span><span><span class="num">2</span></span></span><i class="m">t</i><span class="num">-</span><span class="fraction"><span><span class="num">37</span></span><span><span class="num">4</span></span></span></span>．' +
      '</div>' +
      '<p>（<span class="num">3</span>）求该矿泉水需求量与供给量相等时的售价，以及按照该价格出售获得的总利润：均衡售价为<span class="screen-blank" data-step="1" data-ans="<span class=\'num\'>4</span>元<span class=\'num\'>/</span>瓶"></span>，均衡销量为<span class="screen-blank" data-step="2" data-ans="<span class=\'num\'>90</span>箱（<span class=\'num\'>2160</span>瓶）"></span>，此时获得的总利润为<span class="screen-blank" data-step="3" data-ans="<span class=\'num\'>2160</span>元"></span>．</p>',
    steps: [
      {
        title: '联立需求函数与供给函数求均衡售价 <i class="m">x</i>',
        html: '<p><b>【第一步·列分式方程求售价】</b>令<span class="math"><i class="m">y</i><sub>需求</sub><span class="num">=</span><i class="m">y</i><sub>供给</sub></span>，得：<span class="math"><span class="num">-10</span><i class="m">x</i><span class="num">+130=</span><span class="fraction"><span><span class="num">360</span></span><span><i class="m">x</i></span></span></span>．</p>' +
          '<p>两边同乘<i class="m">x</i>并整理得：<span class="math"><i class="m">x</i><sup><span class="num">2</span></sup><span class="num">-13</span><i class="m">x</i><span class="num">+36=0</span></span>，因式分解得<span class="math"><span class="num">(</span><i class="m">x</i><span class="num">-4)(</span><i class="m">x</i><span class="num">-9)=0</span></span>，解得<span class="math"><i class="m">x</i><sub><span class="num">1</span></sub><span class="num">=4</span></span>，<span class="math"><i class="m">x</i><sub><span class="num">2</span></sub><span class="num">=9</span></span>．</p>' +
          '<p><b>双重检验：</b>经检验，<span class="math"><i class="m">x</i><sub><span class="num">1</span></sub><span class="num">=4</span></span>，<span class="math"><i class="m">x</i><sub><span class="num">2</span></sub><span class="num">=9</span></span>都是原分式方程的根；但题目规定零售价<span class="math"><i class="m">x</i><span class="num">≤6</span></span>，故<span class="math"><i class="m">x</i><span class="num">=9</span></span>不合题意舍去．因此均衡售价为<b class="hl-green"><span class="num">4</span>元<span class="num">/</span>瓶</b>．</p>'
      },
      {
        title: '求均衡售价对应的销售箱数与所处月份 <i class="m">t</i>',
        html: '<p><b>【第二步·求均衡销量与对应月份】</b>当<span class="math"><i class="m">x</i><span class="num">=4</span></span>元<span class="num">/</span>瓶时：</p>' +
          '<p>① 销售箱数：<span class="math"><i class="m">y</i><span class="num">=</span><span class="fraction"><span><span class="num">360</span></span><span><span class="num">4</span></span></span><span class="num">=</span><b class="hl-blue"><span class="num">90</span></b></span>（箱），总瓶数为<span class="math"><span class="num">90×24=</span><b class="hl-blue"><span class="num">2160</span></b></span>（瓶）；</p>' +
          '<p>② 对应月份：将<span class="math"><i class="m">x</i><sub>售价</sub><span class="num">=4</span></span>代入<span class="math"><i class="m">x</i><sub>售价</sub><span class="num">=</span><span class="fraction"><span><span class="num">1</span></span><span><span class="num">2</span></span></span><i class="m">t</i><span class="num">+</span><span class="fraction"><span><span class="num">1</span></span><span><span class="num">2</span></span></span></span>，得<span class="math"><span class="fraction"><span><span class="num">1</span></span><span><span class="num">2</span></span></span><i class="m">t</i><span class="num">+</span><span class="fraction"><span><span class="num">1</span></span><span><span class="num">2</span></span></span><span class="num">=4</span></span>，解得<span class="math"><i class="m">t</i><span class="num">=</span><b class="hl-blue"><span class="num">7</span></b></span>（即<b><span class="num">7</span>月份</b>）．</p>'
      },
      {
        title: '计算 <span class="num">7</span> 月份的每瓶成本与销售总利润',
        html: '<p><b>【第三步·算单瓶成本与总利润】</b>当<span class="math"><i class="m">t</i><span class="num">=7</span></span>时，代入成本函数得每瓶成本：</p>' +
          '<p><span class="math"><i class="m">x</i><sub>成本</sub><span class="num">=-</span><span class="fraction"><span><span class="num">1</span></span><span><span class="num">4</span></span></span><span class="num">×7</span><sup><span class="num">2</span></sup><span class="num">+</span><span class="fraction"><span><span class="num">7</span></span><span><span class="num">2</span></span></span><span class="num">×7-</span><span class="fraction"><span><span class="num">37</span></span><span><span class="num">4</span></span></span><span class="num">=</span><b class="hl-amber"><span class="num">3</span></b></span>（元<span class="num">/</span>瓶），每瓶获利为<span class="math"><span class="num">4-3=1</span></span>（元<span class="num">/</span>瓶）．</p>' +
          '<p>故获得的总利润为：<span class="math"><span class="num">1×24×90=</span><b class="hl-red"><span class="num">2160</span></b></span>（元）．</p>'
      }
    ],
    renderScene: function (step) {
      var svg = '<svg viewBox="0 0 640 420" width="100%" height="100%">';
      svg += '<defs>' +
        '<marker id="arr-p33" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,1 L9,5 L0,9 Z" fill="#334155"/></marker>' +
        '</defs>';

      // 左侧坐标图：需求直线 vs 供给双曲线 (x in [2, 10], y in [0, 140])
      // 坐标系区域 x: 52..382, y: 36..376
      var sx = function (x) { return 52 + (x - 2) * 38; }; // x=2..10 -> 52..356
      var sy = function (y) { return 370 - y * 2.3; };    // y=0..140 -> 370..48

      svg += '<rect x="14" y="14" width="372" height="392" rx="10" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>';
      svg += '<text x="200" y="36" font-size="14" font-weight="700" fill="#1e293b" text-anchor="middle">供需平衡图象：y需求 与 y供给 交点分析</text>';

      // 限价区域 x in [3, 6] 绿色淡底色高亮
      svg += '<rect x="' + sx(3) + '" y="50" width="' + (sx(6) - sx(3)) + '" height="320" fill="rgba(22,163,74,0.07)"/>';
      svg += '<line x1="' + sx(6) + '" y1="50" x2="' + sx(6) + '" y2="370" stroke="#dc2626" stroke-width="1.5" stroke-dasharray="5,4"/>';
      svg += '<text x="' + (sx(6) + 4) + '" y="66" font-size="11.5" font-weight="700" fill="#dc2626">限价线 x=6</text>';
      svg += '<text x="' + ((sx(3) + sx(6)) / 2) + '" y="66" font-size="11.5" font-weight="700" fill="#15803d" text-anchor="middle">合规售价区 3≤x≤6</text>';

      // 网格与刻度
      var yTicks = [40, 60, 80, 90, 100, 120];
      for (var i = 0; i < yTicks.length; i++) {
        var yv = yTicks[i];
        svg += '<line x1="52" y1="' + sy(yv) + '" x2="362" y2="' + sy(yv) + '" stroke="#f1f5f9" stroke-width="1"/>';
        svg += '<text x="46" y="' + (sy(yv) + 4) + '" font-size="11" fill="#64748b" text-anchor="end">' + yv + '</text>';
      }
      var xTicks = [3, 4, 5, 6, 7, 8, 9];
      for (var j = 0; j < xTicks.length; j++) {
        var xv = xTicks[j];
        svg += '<line x1="' + sx(xv) + '" y1="50" x2="' + sx(xv) + '" y2="370" stroke="#f1f5f9" stroke-width="1"/>';
        svg += '<text x="' + sx(xv) + '" y="386" font-size="11.5" fill="#475569" text-anchor="middle">' + xv + '</text>';
      }

      // 坐标轴
      svg += '<line x1="52" y1="370" x2="372" y2="370" stroke="#334155" stroke-width="1.8" marker-end="url(#arr-p33)"/>';
      svg += '<line x1="52" y1="370" x2="52" y2="44" stroke="#334155" stroke-width="1.8" marker-end="url(#arr-p33)"/>';
      svg += '<text x="370" y="400" font-size="12" font-weight="700" fill="#1e293b" text-anchor="end">售价 x（元/瓶）</text>';
      svg += '<text x="60" y="54" font-size="12" font-weight="700" fill="#1e293b">y（箱）</text>';

      // 需求函数 y = -10x + 130 (3<=x<=6 实线, 6<x<=9.5 虚线)
      svg += '<line x1="' + sx(3) + '" y1="' + sy(100) + '" x2="' + sx(6) + '" y2="' + sy(70) + '" stroke="#2563eb" stroke-width="2.8"/>';
      svg += '<line x1="' + sx(6) + '" y1="' + sy(70) + '" x2="' + sx(9.5) + '" y2="' + sy(35) + '" stroke="#93c5fd" stroke-width="2" stroke-dasharray="5,4"/>';
      svg += '<text x="' + sx(4.85) + '" y="' + (sy(75) + 18) + '" font-size="12" font-weight="700" fill="#2563eb">y需求=-10x+130</text>';

      // 供给函数 y = 360/x (3<=x<=6 实线, 6<x<=9.5 虚线)
      var supSolid = [], supDash = [];
      for (var x1 = 2.8; x1 <= 6.001; x1 += 0.1) {
        supSolid.push(sx(x1).toFixed(1) + ',' + sy(360 / x1).toFixed(1));
      }
      for (var x2 = 6.0; x2 <= 9.501; x2 += 0.1) {
        supDash.push(sx(x2).toFixed(1) + ',' + sy(360 / x2).toFixed(1));
      }
      svg += '<polyline points="' + supSolid.join(' ') + '" fill="none" stroke="#dc2626" stroke-width="2.8"/>';
      svg += '<polyline points="' + supDash.join(' ') + '" fill="none" stroke="#fca5a5" stroke-width="2" stroke-dasharray="5,4"/>';
      svg += '<text x="' + sx(3.3) + '" y="' + (sy(120) - 6) + '" font-size="12" font-weight="700" fill="#dc2626">y供给（反比例曲线）</text>';

      // step >= 1 标出两交点 (4, 90) 与 (9, 40)
      if (step >= 1) {
        // 交点1：(4, 90) 绿色实心点
        svg += '<line x1="' + sx(4) + '" y1="' + sy(90) + '" x2="' + sx(4) + '" y2="370" stroke="#16a34a" stroke-width="1.6" stroke-dasharray="4,3"/>';
        svg += '<line x1="52" y1="' + sy(90) + '" x2="' + sx(4) + '" y2="' + sy(90) + '" stroke="#16a34a" stroke-width="1.6" stroke-dasharray="4,3"/>';
        svg += '<circle cx="' + sx(4) + '" cy="' + sy(90) + '" r="6" fill="#16a34a" stroke="#fff" stroke-width="1.8"/>';
        svg += '<text x="' + (sx(4) + 8) + '" y="' + (sy(90) - 8) + '" font-size="12.5" font-weight="800" fill="#15803d">均衡点(4, 90) ✓</text>';

        // 交点2：(9, 40) 灰色舍去点
        svg += '<circle cx="' + sx(9) + '" cy="' + sy(40) + '" r="5" fill="#94a3b8" stroke="#475569" stroke-width="1.5" stroke-dasharray="2,2"/>';
        svg += '<text x="' + (sx(9) - 6) + '" y="' + (sy(40) - 10) + '" font-size="11.5" font-weight="700" fill="#64748b" text-anchor="end">(9, 40) 超限价舍去✗</text>';
      }

      // 右侧：分步核算流程图卡片 (x: 396..626)
      if (step === 0) {
        svg += foCard(396, 14, 230, 392,
          '<div style="background:#f8fafc;border:1.5px dashed #94a3b8;border-radius:10px;padding:14px;height:100%;display:flex;flex-direction:column;justify-content:center;color:#334155;font-size:13.5px;line-height:1.7;">' +
          '<div style="font-weight:800;font-size:15px;color:#0f172a;margin-bottom:8px;">【供需平衡解题路线图】</div>' +
          '<div>① <b>供需相等</b>：<span class="math"><i class="m">y</i><sub>需求</sub><span class="num">=</span><i class="m">y</i><sub>供给</sub></span> 求售价<i class="m">x</i>（注意<span class="math"><i class="m">x</i><span class="num">≤6</span></span>检验）；</div>' +
          '<div style="margin-top:8px;">② <b>求销量与月份</b>：由<i class="m">x</i>求箱数<i class="m">y</i>及月份<i class="m">t</i>；</div>' +
          '<div style="margin-top:8px;">③ <b>求总利润</b>：算第<i class="m">t</i>月单瓶成本，乘<b>总瓶数（<span class="num">24</span><i class="m">y</i>）</b>．</div>' +
          '</div>'
        );
      }

      if (step >= 1) {
        svg += foCard(396, 14, 230, 118,
          '<div style="background:#f0fdf4;border:1.5px solid #16a34a;border-radius:10px;padding:8px 10px;font-size:12.5px;color:#14532d;line-height:1.45;">' +
          '<div style="font-weight:800;color:#15803d;font-size:13.5px;margin-bottom:3px;">第一步：求均衡售价 <i class="m">x</i></div>' +
          '<div><span class="math"><span class="num">-10</span><i class="m">x</i><span class="num">+130=</span><span class="fraction"><span><span class="num">360</span></span><span><i class="m">x</i></span></span></span></div>' +
          '<div><span class="math"><i class="m">x</i><sup><span class="num">2</span></sup><span class="num">-13</span><i class="m">x</i><span class="num">+36=0</span></span> ⇒ <span class="math"><i class="m">x</i><sub><span class="num">1</span></sub><span class="num">=4</span></span>，<span class="math"><i class="m">x</i><sub><span class="num">2</span></sub><span class="num">=9</span></span>（舍）</div>' +
          '<div style="font-weight:700;color:#15803d;">∴ 均衡售价 <span class="math"><i class="m">x</i><span class="num">=4</span></span> 元/瓶</div>' +
          '</div>'
        );
      }

      if (step >= 2) {
        svg += foCard(396, 142, 230, 122,
          '<div style="background:#eff6ff;border:1.5px solid #2563eb;border-radius:10px;padding:8px 10px;font-size:12.5px;color:#1e3a8a;line-height:1.45;">' +
          '<div style="font-weight:800;color:#1d4ed8;font-size:13.5px;margin-bottom:3px;">第二步：销量与所处月份 <i class="m">t</i></div>' +
          '<div>• 均衡箱数：<span class="math"><i class="m">y</i><span class="num">=</span><span class="fraction"><span><span class="num">360</span></span><span><span class="num">4</span></span></span><span class="num">=90</span></span> 箱</div>' +
          '<div>• 总瓶数：<span class="math"><span class="num">90×24=</span><b><span class="num">2160</span></b></span> 瓶</div>' +
          '<div>• 所在月份：<span class="math"><span class="fraction"><span><span class="num">1</span></span><span><span class="num">2</span></span></span><i class="m">t</i><span class="num">+</span><span class="fraction"><span><span class="num">1</span></span><span><span class="num">2</span></span></span><span class="num">=4</span></span> ⇒ <b style="color:#1d4ed8;"><i class="m">t</i><span class="num">=7</span>（<span class="num">7</span>月）</b></div>' +
          '</div>'
        );
      }

      if (step >= 3) {
        svg += foCard(396, 274, 230, 132,
          '<div style="background:#fef2f2;border:1.5px solid #dc2626;border-radius:10px;padding:8px 10px;font-size:12.5px;color:#7f1d1d;line-height:1.48;">' +
          '<div style="font-weight:800;color:#b91c1c;font-size:13.5px;margin-bottom:3px;">第三步：核算 <span class="num">7</span> 月销售总利润</div>' +
          '<div>• <span class="num">7</span>月单瓶成本：<span class="math"><i class="m">x</i><sub>成本</sub><span class="num">=3</span></span> 元/瓶</div>' +
          '<div>• 单瓶利润：<span class="math"><span class="num">4-3=1</span></span> 元/瓶</div>' +
          '<div style="margin-top:3px;padding:4px 6px;background:#fee2e2;border-radius:5px;font-weight:800;color:#b91c1c;">总利润 = <span class="num">1×24×90 = 2160</span> 元</div>' +
          '</div>'
        );
      }

      svg += '</svg>';
      return svg;
    }
  });

  // =========================================================================
  // 第 3 页：课堂小结
  // =========================================================================
  window.defineSlide({
    id: 'u232-summary',
    phase: 3,
    navTag: '课堂小结',
    section: '课堂小结',
    title: '课堂小结：反比例函数的应用（<span class="num">2</span>）四大核心模型与方法总结',
    layout: 'layout-b',
    state: {},
    stem: '<p><b>核心思想：</b>以<b>数形结合</b>为桥梁，将“双函数交点、复合电路、图形间最短距离、市场供需平衡”转化为<b>方程联立与函数图象性质</b>求解．</p>',
    steps: [
      {
        title: '模型一：一次函数与反比例函数交点、面积与不等式',
        html: '<p><b>【模型一·双函数综合】</b>交点坐标 <span class="num">⇔</span> 联立方程组的解；求<span class="math"><span class="num">△</span><i class="m">AOB</i></span>面积常用<b>坐标轴割补法</b>（<span class="math"><i class="m">S</i><sub><span class="num">△</span><i class="m">AOB</i></sub><span class="num">=</span><i class="m">S</i><sub><span class="num">△</span><i class="m">AOC</i></sub><span class="num">+</span><i class="m">S</i><sub><span class="num">△</span><i class="m">BOC</i></sub></span>）；解不等式用<b>“三线四区法”</b>（两交点竖线<span class="num">+</span><i class="m">y</i>轴，看上下定左右，切记在<span class="math"><i class="m">x</i><span class="num">=0</span></span>处断开）．</p>'
      },
      {
        title: '模型二：跨学科物理复合函数建模（电子秤电路）',
        html: '<p><b>【模型二·跨学科物理电路】</b>理清多变量传递链条：<span class="math"><i class="m">x</i></span>（质量）<span class="num">→</span>一次函数<span class="math"><i class="m">R</i><sub><span class="num">1</span></sub></span><span class="num">→</span>串联总电阻<span class="math"><i class="m">R</i><span class="num">=</span><i class="m">R</i><sub><span class="num">1</span></sub><span class="num">+</span><i class="m">R</i><sub><span class="num">2</span></sub></span><span class="num">→</span>反比例函数<span class="math"><i class="m">I</i><span class="num">=</span><span class="fraction"><span><i class="m">U</i></span><span><i class="m">R</i></span></span></span>，利用反比例函数在第一象限的增减性由电流范围反推电阻与质量极值．</p>'
      },
      {
        title: '模型三：新定义“图形间的距离”与平行线相交/相切转化',
        html: '<p><b>【模型三·图形间的距离】</b>原点到双曲线<span class="math"><i class="m">y</i><span class="num">=</span><span class="fraction"><span><i class="m">k</i></span><span><i class="m">x</i></span></span></span>（<span class="math"><i class="m">k</i><span class="num">&gt;0</span></span>）最近点在对称轴<span class="math"><i class="m">y</i><span class="num">=</span><i class="m">x</i></span>上，最短距离为<span class="math"><span class="num">√(2</span><i class="m">k</i><span class="num">)</span></span>；求到直线<span class="math"><i class="m">y</i><span class="num">=-</span><i class="m">x</i></span>距离小于<i class="m">d</i>的截线长，通过<b>平移直线</b>构造<span class="math"><i class="m">y</i><span class="num">=-</span><i class="m">x</i><span class="num">+√2</span><i class="m">d</i></span>联立求交点弦长．</p>'
      },
      {
        title: '模型四：经济供需平衡与二次函数利润综合',
        html: '<p><b>【模型四·供需平衡与最大利润】</b>需求函数（一次函数）与供给函数（反比例函数）相等得<b>分式方程</b>，解出后务必<b>双重检验分母与实际限价范围</b>（如<span class="math"><i class="m">x</i><span class="num">≤6</span></span>），再结合每箱瓶数（<span class="num">24</span>瓶<span class="num">/</span>箱）核算总利润．</p>'
      }
    ],
    renderScene: function (step) {
      var svg = '<svg viewBox="0 0 640 420" width="100%" height="100%">';

      var cards = [
        {
          idx: 1, x: 16, y: 14, w: 296, h: 188,
          bg: '#eff6ff', bd: '#2563eb', titleCol: '#1d4ed8',
          title: '模型一：一次函数 × 反比例函数',
          body: '• <b>交点与待定系数</b>：先代已知坐标求解析式，联立方程求另一交点；<br/>' +
            '• <b>面积割补</b>：<span class="math"><i class="m">S</i><sub><span class="num">△</span><i class="m">AOB</i></sub><span class="num">=</span><i class="m">S</i><sub><span class="num">△</span><i class="m">AOC</i></sub><span class="num">+</span><i class="m">S</i><sub><span class="num">△</span><i class="m">BOC</i></sub></span>；<br/>' +
            '• <b>三线四区解不等式</b>：过两交点作竖线与<i class="m">y</i>轴分四区，注意<span class="math"><i class="m">x</i><span class="num">=0</span></span>断开．'
        },
        {
          idx: 2, x: 328, y: 14, w: 296, h: 188,
          bg: '#f0fdf4', bd: '#16a34a', titleCol: '#15803d',
          title: '模型二：跨学科物理电路建模',
          body: '• <b>变量传递链</b>：<span class="math"><i class="m">x</i></span>（质量）<span class="num">→</span><span class="math"><i class="m">R</i><sub><span class="num">1</span></sub><span class="num">=-20</span><i class="m">x</i><span class="num">+60</span></span><span class="num">→</span><span class="math"><i class="m">R</i><sub>总</sub></span><span class="num">→</span><span class="math"><i class="m">I</i><span class="num">=</span><span class="fraction"><span><i class="m">U</i></span><span><i class="m">R</i><sub>总</sub></span></span></span>；<br/>' +
            '• <b>增减性反推极值</b>：电流<i class="m">I</i>随总电阻<i class="m">R</i>增大而减小，最大量程对应最大电流．'
        },
        {
          idx: 3, x: 16, y: 216, w: 296, h: 188,
          bg: '#fffbeb', bd: '#d97706', titleCol: '#b45309',
          title: '模型三：新定义“图形间的距离”',
          body: '• <b>对称轴性质</b>：原点到<span class="math"><i class="m">y</i><span class="num">=</span><span class="fraction"><span><i class="m">k</i></span><span><i class="m">x</i></span></span></span>（<span class="math"><i class="m">k</i><span class="num">&gt;0</span></span>）最近点为<span class="math"><span class="num">(√</span><i class="m">k</i><span class="num">,√</span><i class="m">k</i><span class="num">)</span></span>，<span class="math"><i class="m">d</i><sub>min</sub><span class="num">=√(2</span><i class="m">k</i><span class="num">)</span></span>；<br/>' +
            '• <b>平行线截弦</b>：将距离<i class="m">d</i>转化为竖直截距<span class="math"><span class="num">√2</span><i class="m">d</i></span>，联立求弦长<span class="math"><i class="m">MN</i></span>．'
        },
        {
          idx: 4, x: 328, y: 216, w: 296, h: 188,
          bg: '#fef2f2', bd: '#dc2626', titleCol: '#b91c1c',
          title: '模型四：市场供需平衡与总利润',
          body: '• <b>供需平衡</b>：令<span class="math"><i class="m">y</i><sub>需求</sub><span class="num">=</span><i class="m">y</i><sub>供给</sub></span>列分式方程，<b>严守限价范围</b>（<span class="math"><i class="m">x</i><span class="num">≤6</span></span>）舍根；<br/>' +
            '• <b>单位换算</b>：总利润 <span class="num">=</span> 单瓶利润 <span class="num">×</span> <b>每箱<span class="num">24</span>瓶</b> <span class="num">×</span> 销售箱数．'
        }
      ];

      for (var i = 0; i < cards.length; i++) {
        var c = cards[i];
        var active = (step === 0 || step >= c.idx);
        var opacity = active ? '1' : '0.35';
        var borderW = (step === c.idx) ? '3px' : '1.8px';
        var shadow = (step === c.idx) ? '0 6px 16px rgba(15,23,42,0.14)' : '0 2px 6px rgba(15,23,42,0.05)';
        var html = '<div style="background:' + c.bg + ';border:' + borderW + ' solid ' + c.bd + ';border-radius:12px;padding:12px 14px;height:100%;opacity:' + opacity + ';box-shadow:' + shadow + ';display:flex;flex-direction:column;justify-content:flex-start;">' +
          '<div style="font-size:15px;font-weight:800;color:' + c.titleCol + ';margin-bottom:8px;border-bottom:1px solid rgba(0,0,0,0.08);padding-bottom:5px;">' + c.title + '</div>' +
          '<div style="font-size:13px;color:#1e293b;line-height:1.58;">' + c.body + '</div>' +
          '</div>';
        svg += foCard(c.x, c.y, c.w, c.h, html);
      }

      svg += '</svg>';
      return svg;
    }
  });
})();

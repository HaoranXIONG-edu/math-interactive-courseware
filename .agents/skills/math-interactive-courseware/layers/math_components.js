/**
 * =============================================================================
 * 1. 数学学科与图形组件库 — Math & Geometry Component Library (math_components.js)
 * 面向 2024北师大版初中数学（七上～九下全六册 34 章）
 * =============================================================================
 * 包含五大纯数学核心模块（与页面 UI 布局完全解耦）：
 *   M1. window.MATH_THEME       : 数学图形出版级视觉令牌（线条、角度、填色、字号）
 *   M2. window.MathFormula      : LaTeX 数学公式 HTML 编译器 & 纯原生 SVG 无背景直标渲染器
 *   M3. window.createGeoCanvas  : 波利亚平面几何画板（多边形/圆与切线/尺规作图/工程尺寸线/直接标注）
 *   M4. window.createFuncCanvas : 函数综合坐标系画板（一次函数/反比例双曲线/二次抛物线/对称轴/铅锤高）
 *   M5. window.createNumberLine / createBoxPlot / createProbTree : 数轴不等式组、新课标箱线图、概率树状图
 * =============================================================================
 */
(function (window) {
  'use strict';

  // ===========================================================================
  // M1. MATH GRAPHICS DESIGN TOKENS (数学图形出版级设计令牌)
  // ===========================================================================
  var MATH_THEME = {
    colors: {
      ink: '#0f172a',          // 原题主线与核心文字（深石板黑）
      slate: '#475569',        // 次要说明文字与直角标
      muted: '#94a3b8',        // 网格线与引线
      auxRed: '#dc2626',       // 辅助线、动点、核心高亮（朱红）
      angleBlue: '#2563eb',    // 第一组导角、核心条件（皇家蓝）
      angleAmber: '#d97706',   // 第二组导角、等量转移（琥珀金）
      anglePurple: '#7c3aed',  // 第三组导角、对称翻折（紫罗兰）
      targetGreen: '#059669',  // 求解目标引导色（翠绿）
      dimCyan: '#0284c7',      // 教材工程双箭头尺寸线标准天蓝（九下第4页）
      boxPlotFill: '#38bdf8',  // 2024版北师大八上箱线图标准青蓝箱体色（八上第164页）
      // 柔和多边形/扇形底层填色（透明度 0.16~0.18）
      fillBlue: 'rgba(37, 99, 235, 0.16)',
      fillAmber: 'rgba(217, 119, 6, 0.18)',
      fillGreen: 'rgba(5, 150, 105, 0.16)',
      fillPurple: 'rgba(124, 58, 237, 0.16)',
      fillRose: 'rgba(225, 29, 72, 0.15)'
    },
    stroke: {
      primary: 2.6,            // 原题几何实线标准线宽
      aux: 2.2,                // 辅助虚线标准线宽
      auxDash: '7 4',          // 辅助线标准虚线样式
      compass: 1.5,            // 尺规作图保留弧痕线宽
      angleArc: 2.0,           // 数字角圆弧线宽
      rightAngle: 1.6,         // 直角符号线宽
      tick: 2.2,               // 等长短杠线宽
      halo: 4.2                // 无背景直标文字防压线白边光晕宽度
    },
    angleTiers: {
      1: 26,
      2: 34,
      3: 42,
      4: 50
    },
    pointRadius: {
      vertex: 4.5,
      moving: 5.5,
      center: 3.8
    }
  };
  window.MATH_THEME = MATH_THEME;
  window.CW_THEME = window.CW_THEME || MATH_THEME;

  // ===========================================================================
  // M2. MATH FORMULA COMPILER & NATIVE SVG DIRECT LABEL RENDERER (window.MathFormula)
  // ===========================================================================

  function extractBraceGroup(str, startIdx) {
    var i = startIdx;
    while (i < str.length && str.charAt(i) === ' ') i++;
    if (str.charAt(i) !== '{') return null;
    var depth = 0;
    var contentStart = i + 1;
    for (; i < str.length; i++) {
      var ch = str.charAt(i);
      if (ch === '\\') {
        i++;
        continue;
      }
      if (ch === '{') depth++;
      else if (ch === '}') {
        depth--;
        if (depth === 0) {
          return {
            content: str.slice(contentStart, i),
            endIndex: i + 1
          };
        }
      }
    }
    return null;
  }

  function replaceMacroBalanced(str, macroCmd, numArgs, allowSubOnSecond, replacer) {
    var out = '';
    var idx = 0;
    while (idx < str.length) {
      var pos = str.indexOf(macroCmd, idx);
      if (pos === -1) {
        out += str.slice(idx);
        break;
      }
      var afterCmd = pos + macroCmd.length;
      if (/[a-zA-Z]/.test(str.charAt(afterCmd))) {
        out += str.slice(idx, afterCmd);
        idx = afterCmd;
        continue;
      }
      out += str.slice(idx, pos);
      var cur = afterCmd;
      var args = [];
      var ok = true;
      for (var a = 0; a < numArgs; a++) {
        while (cur < str.length && str.charAt(cur) === ' ') cur++;
        if (a === 1 && allowSubOnSecond && str.charAt(cur) === '_') {
          cur++;
          while (cur < str.length && str.charAt(cur) === ' ') cur++;
        }
        var grp = extractBraceGroup(str, cur);
        if (!grp) {
          ok = false;
          break;
        }
        args.push(grp.content);
        cur = grp.endIndex;
      }
      if (!ok) {
        out += macroCmd;
        idx = afterCmd;
      } else {
        out += replacer.apply(null, args);
        idx = cur;
      }
    }
    return out;
  }

  /**
   * 将 LaTeX 数学公式编译为符合北师大版教材规范的 HTML 结构
   */
  function compileMathToHtml(raw, isInner) {
    var s = String(raw || '').trim();
    if (!s) return '';

    var placeholders = [];
    function saveBlock(html) {
      var id = '\u0000BLK' + placeholders.length + '\u0000';
      placeholders.push(html);
      return id;
    }

    // 0. 保护已编译的 HTML 交互组件标签（如 UI.blank / UI.choices 的 <!--UI_START-->...<!--UI_END-->）并去除 $ 定界符
    if (!isInner) {
      s = s.replace(/<!--UI_START-->([\s\S]*?)<!--UI_END-->/g, function (_, innerUi) {
        return saveBlock(innerUi);
      });
    }
    s = s.replace(/\$/g, '');

    // 1. 方程组/不等式组 \cases{ line1 | ① // line2 | ② }
    var guardCases = 0;
    while (s.indexOf('\\cases') !== -1 && guardCases < 8) {
      var prevCases = s;
      s = replaceMacroBalanced(s, '\\cases', 1, false, function (body) {
        var rows = body.split(/\s*\/\/\s*/);
        var rowsHtml = rows
          .map(function (r) {
            var parts = r.split(/\s*\|\s*/);
            var eqPart = compileMathToHtml(parts[0] || '', true);
            var tagPart = parts[1]
              ? '<span class="num" style="margin-left:16px;color:#475569;font-weight:700;">' + parts[1].trim() + '</span>'
              : '';
            return (
              '<span style="display:flex;align-items:center;justify-content:space-between;padding:2px 0;line-height:1.35;">' +
              '<span>' + eqPart + '</span>' +
              tagPart +
              '</span>'
            );
          })
          .join('');
        var braceH = Math.max(46, rows.length * 30);
        var braceSvg =
          '<svg width="14" height="' + braceH + '" viewBox="0 0 14 48" preserveAspectRatio="none" style="flex-shrink:0;margin-right:4px;overflow:visible;display:block;">' +
          '<path d="M 12 2 Q 6 2 6 9 L 6 19 Q 6 24 1 24 Q 6 24 6 29 L 6 39 Q 6 46 12 46" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>' +
          '</svg>';
        return saveBlock(
          '<span class="cw-cases" style="display:inline-flex;align-items:center;vertical-align:middle;margin:2px 4px;">' +
          braceSvg +
          '<span style="display:inline-flex;flex-direction:column;justify-content:center;">' + rowsHtml + '</span>' +
          '</span>'
        );
      });
      if (s === prevCases) break;
      guardCases++;
    }

    // 2. 下大括号 \underbrace{expr}_{note}（基线锚定，主式与同行等号严格水平对齐）
    var guardUb = 0;
    while (s.indexOf('\\underbrace') !== -1 && guardUb < 10) {
      var prevUb = s;
      s = replaceMacroBalanced(s, '\\underbrace', 2, true, function (expr, note) {
        var topHtml = compileMathToHtml(expr, true);
        var botHtml = compileMathToHtml(note, true);
        return saveBlock(
          '<span class="cw-underbrace" style="position:relative;display:inline-block;vertical-align:baseline;margin:0 3px 1.45em;line-height:1.2;">' +
          '<span style="padding:0 2px;">' + topHtml + '</span>' +
          '<span style="position:absolute;left:0;right:0;top:100%;display:flex;flex-direction:column;align-items:center;pointer-events:none;margin-top:0px;">' +
          '<svg width="100%" height="7" viewBox="0 0 100 9" preserveAspectRatio="none" style="width:100%;height:7px;overflow:visible;display:block;">' +
          '<path d="M 2 1 Q 2 4.5 10 4.5 L 44 4.5 Q 50 4.5 50 8.5 Q 50 4.5 56 4.5 L 90 4.5 Q 98 4.5 98 1" fill="none" stroke="#475569" stroke-width="1.5"/>' +
          '</svg>' +
          '<span style="font-size:0.78em;color:#334155;line-height:1.1;margin-top:2px;white-space:nowrap;">' + botHtml + '</span>' +
          '</span>' +
          '</span>'
        );
      });
      if (s === prevUb) break;
      guardUb++;
    }

    // 3. 圆弧顶弧符号 \arc{AB}（基线锚定，确保 AC、BC 与同行 AM=BM 处于同一基线）
    var guardArc = 0;
    while (s.indexOf('\\arc') !== -1 && guardArc < 10) {
      var prevArc = s;
      s = replaceMacroBalanced(s, '\\arc', 1, false, function (letters) {
        var inner = compileMathToHtml(letters, true);
        return saveBlock(
          '<span class="cw-arc" style="position:relative;display:inline-block;vertical-align:baseline;padding-top:0.32em;margin:0 1px;line-height:1;">' +
          '<svg viewBox="0 0 28 7" preserveAspectRatio="none" style="position:absolute;top:0.02em;left:-1px;width:calc(100% + 2px);height:0.32em;overflow:visible;display:block;pointer-events:none;">' +
          '<path d="M 1 6 Q 14 -0.8 27 6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>' +
          '</svg>' +
          '<span>' + inner + '</span>' +
          '</span>'
        );
      });
      if (s === prevArc) break;
      guardArc++;
    }

    // 4. 常用 LaTeX 符号替换
    s = s
      .replace(/\\odot\b/g, '⊙')
      .replace(/\\para\b/g, '▱')
      .replace(/\\triangle\b/g, '△')
      .replace(/\\angle\b/g, '∠')
      .replace(/\\perp\b/g, '⊥')
      .replace(/\\parallel\b/g, '∥')
      .replace(/\\sim\b/g, '∽')
      .replace(/\\cong\b/g, '≌')
      .replace(/\\neq\b/g, '≠')
      .replace(/\\leq\b/g, '≤')
      .replace(/\\leqslant\b/g, '≤')
      .replace(/\\geq\b/g, '≥')
      .replace(/\\geqslant\b/g, '≥')
      .replace(/\\times\b/g, '×')
      .replace(/\\div\b/g, '÷')
      .replace(/\\cdot\b/g, '·')
      .replace(/\\cdots\b/g, '⋯')
      .replace(/\\pm\b/g, '±')
      .replace(/\\pi\b/g, 'π')
      .replace(/\\alpha\b/g, 'α')
      .replace(/\\beta\b/g, 'β')
      .replace(/\\circ\b/g, '°')
      .replace(/\\because\b/g, '∵')
      .replace(/\\therefore\b/g, '∴')
      .replace(/\\Rightarrow\b/g, '⇒')
      .replace(/\\rightarrow\b/g, '→');

    // 4.5 矢量全等符号 \cong / ≌（杜绝 macOS Times New Roman U+224C 顶部带闭环圈的西文字形，严格还原北师大教材“上∽下=”标准全等号）
    var CONG_SVG =
      '<svg class="cw-cong" viewBox="0 0 16 15" style="width:0.84em;height:0.78em;vertical-align:-0.08em;margin:0 2px;overflow:visible;display:inline-block;">' +
      '<path d="M 1.4 4.5 C 3.2 0.6, 6.2 0.6, 8.0 4.5 C 9.8 8.4, 12.8 8.4, 14.6 4.5" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round"/>' +
      '<line x1="1.3" y1="9.8" x2="14.7" y2="9.8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>' +
      '<line x1="1.3" y1="13.0" x2="14.7" y2="13.0" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>' +
      '</svg>';
    s = s.replace(/≌/g, function () {
      return saveBlock(CONG_SVG);
    });

    // 5. 矢量闭合根号 \sqrt{...}
    var SQRT_HOOK_SVG =
      '<svg class="sqrt-hook" viewBox="0 0 12 20" preserveAspectRatio="none" style="width:0.56em;height:auto;display:block;flex-shrink:0;margin-right:-0.5px;overflow:visible;">' +
      '<path d="M 0.6 11.6 L 3.0 9.6 L 6.2 18.2 L 11.2 0.75 L 12 0.75" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>' +
      '</svg>';
    var guardSqrt = 0;
    while (s.indexOf('\\sqrt') !== -1 && guardSqrt < 10) {
      var prevSqrt = s;
      s = replaceMacroBalanced(s, '\\sqrt', 1, false, function (inner) {
        var innerCompiled = compileMathToHtml(inner, true);
        if (!/^<span class="num">[^<]*<\/span>$/.test(innerCompiled)) {
          innerCompiled = '<span class="num">' + innerCompiled + '</span>';
        }
        return saveBlock('<span class="sqrt">' + SQRT_HOOK_SVG + innerCompiled + '</span>');
      });
      if (s === prevSqrt) break;
      guardSqrt++;
    }
    s = s.replace(/√\(([^()]+)\)/g, function (_, inner) {
      var innerCompiled = compileMathToHtml(inner, true);
      return saveBlock('<span class="sqrt">' + SQRT_HOOK_SVG + '<span class="num">' + innerCompiled + '</span></span>');
    });
    s = s.replace(/√([0-9a-zA-Z]+)/g, function (_, inner) {
      var innerCompiled = compileMathToHtml(inner, true);
      if (!/^<span class="num">[^<]*<\/span>$/.test(innerCompiled)) {
        innerCompiled = '<span class="num">' + innerCompiled + '</span>';
      }
      return saveBlock('<span class="sqrt">' + SQRT_HOOK_SVG + innerCompiled + '</span>');
    });

    // 6. 二维叠置分式 \frac{num}{den}
    var guardFrac = 0;
    while (s.indexOf('\\frac') !== -1 && guardFrac < 12) {
      var prevFrac = s;
      s = replaceMacroBalanced(s, '\\frac', 2, false, function (num, den) {
        return saveBlock(
          '<span class="fraction"><span>' +
            compileMathToHtml(num, true) +
            '</span><span>' +
            compileMathToHtml(den, true) +
            '</span></span>'
        );
      });
      if (s === prevFrac) break;
      guardFrac++;
    }

    // 6.5 处理 \text{...} 正体/中文宏（放在递归宏之后，确保子表达式内部也能正确还原）
    var guardText = 0;
    while (s.indexOf('\\text') !== -1 && guardText < 12) {
      var prevText = s;
      s = replaceMacroBalanced(s, '\\text', 1, false, function (txt) {
        var cleanTxt = String(txt || '').trim();
        if (/^[\u4e00-\u9fa5，。；：？！、（）“”‘’《》【】]+$/.test(cleanTxt)) {
          return saveBlock(cleanTxt);
        }
        return saveBlock('<span class="num">' + cleanTxt + '</span>');
      });
      if (s === prevText) break;
      guardText++;
    }

    // 7. 上下标
    s = s.replace(/_\{([^{}]+)\}/g, function (_, sub) {
      return saveBlock('<sub>' + compileMathToHtml(sub, true) + '</sub>');
    });
    s = s.replace(/_([0-9a-zA-Z△]+)/g, function (_, sub) {
      return saveBlock('<sub>' + compileMathToHtml(sub, true) + '</sub>');
    });
    s = s.replace(/\^\{([^{}]+)\}/g, function (_, sup) {
      return saveBlock('<sup>' + compileMathToHtml(sup, true) + '</sup>');
    });
    s = s.replace(/\^([0-9a-zA-Z+-]+)/g, function (_, sup) {
      return saveBlock('<sup>' + compileMathToHtml(sup, true) + '</sup>');
    });

    function tokenizeSimpleMath(str) {
      var tokenRe = /\u0000BLK\d+\u0000|[0-9.]+(?:\s*(?:cm|mm|km|kg|mg|hm|Pa|Hz|min|max|m|s|h|g|L|V|A|W|N)\b)?|\b(?:Rt|sin|cos|tan|cot|min|max|SAS|ASA|AAS|SSS|HL|cm|mm|km|kg|mg|hm|Pa|Hz)\b|[a-zA-Zαβ]+|[+=<>≤≥≠±×÷·⋯:(),.|/?∠△⊥∥∽≌⊙▱∵∴°①②③④⑤%-]+|[\u4e00-\u9fa5，。；：？！、“”‘’（）【】《》—…]+|\s+/g;
      var m = String(str).match(tokenRe);
      if (!m) return String(str);
      return m
        .map(function (tk) {
          if (tk.charAt(0) === '\u0000') return tk;
          if (/^\s+$/.test(tk)) return '';
          if (/^[0-9.]/.test(tk)) {
            return '<span class="num">' + tk.replace(/\s+/g, '') + '</span>';
          }
          if (/^(?:Rt|sin|cos|tan|cot|min|max|SAS|ASA|AAS|SSS|HL|cm|mm|km|kg|mg|hm|Pa|Hz)$/.test(tk)) {
            return '<span class="num">' + tk + '</span>';
          }
          if (/^[a-zA-Zαβ]+$/.test(tk)) {
            return '<i class="m">' + tk + '</i>';
          }
          if (/^[\u4e00-\u9fa5，。；：？！、“”‘’（）【】《》—…]+$/.test(tk)) {
            return tk;
          }
          var safeOp = tk.replace(/</g, '&lt;').replace(/>/g, '&gt;');
          return '<span class="num">' + safeOp + '</span>';
        })
        .join('');
    }

    function restoreBlocks(str) {
      var out = str;
      var phRe = /\u0000BLK(\d+)\u0000/g;
      var guard = 0;
      while (phRe.test(out) && guard < 15) {
        out = out.replace(phRe, function (_, idx) {
          return placeholders[Number(idx)] || '';
        });
        guard++;
      }
      return out;
    }

    var tokenized = restoreBlocks(tokenizeSimpleMath(s));
    return isInner ? tokenized : '<span class="math">' + tokenized + '</span>';
  }

  /**
   * 纯原生 SVG 2D 数学公式无背景直标渲染器（无胶囊框、无 foreignObject、自带白边光晕防压线）
   * 支持在几何图形或函数图象旁直接标注：
   *   - 二维上下叠置分式：如 \frac{4}{3}(4-x)、y=\frac{4}{x}
   *   - 带完整顶线根式：如 4\sqrt{3}、BC=4\sqrt{3}
   *   - 普通混排表达式：如 求BC=?、PM=3、A(-1,2)
   */
  function estimateSvgTokenWidth(str, fs) {
    var w = 0;
    var s = String(str || '');
    for (var i = 0; i < s.length; i++) {
      var code = s.charCodeAt(i);
      if (code >= 0x4e00 && code <= 0x9fff) w += fs * 1.02;
      else if (/[A-Z]/.test(s.charAt(i))) w += fs * 0.68;
      else if (/[a-z0-9]/.test(s.charAt(i))) w += fs * 0.56;
      else w += fs * 0.52;
    }
    return w;
  }

  function parseSvgMathTokens(expr) {
    var s = String(expr || '').replace(/^\$|\$$/g, '').trim();
    s = s
      .replace(/\\odot\b/g, '⊙')
      .replace(/\\triangle\b/g, '△')
      .replace(/\\angle\b/g, '∠')
      .replace(/\\perp\b/g, '⊥')
      .replace(/\\parallel\b/g, '∥')
      .replace(/\\sim\b/g, '∽')
      .replace(/\\cong\b/g, '≌')
      .replace(/\\leq\b/g, '≤')
      .replace(/\\geq\b/g, '≥')
      .replace(/\\cdot\b/g, '·')
      .replace(/\\pm\b/g, '±');

    var tokens = [];
    var i = 0;
    while (i < s.length) {
      if (s.slice(i, i + 5) === '\\frac') {
        var g1 = extractBraceGroup(s, i + 5);
        if (g1) {
          var g2 = extractBraceGroup(s, g1.endIndex);
          if (g2) {
            tokens.push({ type: 'frac', num: g1.content, den: g2.content });
            i = g2.endIndex;
            continue;
          }
        }
      }
      if (s.slice(i, i + 5) === '\\sqrt') {
        var gs = extractBraceGroup(s, i + 5);
        if (gs) {
          tokens.push({ type: 'sqrt', rad: gs.content });
          i = gs.endIndex;
          continue;
        }
      }
      if (s.charAt(i) === '√') {
        var mRad = s.slice(i + 1).match(/^([0-9a-zA-Z]+)/);
        if (mRad) {
          tokens.push({ type: 'sqrt', rad: mRad[1] });
          i += 1 + mRad[1].length;
          continue;
        }
      }
      if (s.charAt(i) === '≌') {
        tokens.push({ type: 'cong' });
        i += 1;
        continue;
      }
      // 收集普通文本直到下一个 \frac 或 \sqrt 或 √ 或 ≌
      var nextIdx = s.length;
      ['\\frac', '\\sqrt', '√', '≌'].forEach(function (kw) {
        var p = s.indexOf(kw, i);
        if (p !== -1 && p < nextIdx) nextIdx = p;
      });
      var textChunk = s.slice(i, nextIdx);
      if (textChunk) {
        tokens.push({ type: 'text', text: textChunk });
      }
      i = nextIdx;
    }
    return tokens;
  }

  function estimateSvgExprWidth(expr, fs) {
    var tks = parseSvgMathTokens(expr);
    var sum = 0;
    var fracFs = Math.round(fs * 0.84 * 10) / 10;
    tks.forEach(function (tk) {
      if (tk.type === 'text') sum += estimateSvgTokenWidth(tk.text, fs);
      else if (tk.type === 'cong') sum += fs * 0.96;
      else if (tk.type === 'sqrt') sum += 10 + estimateSvgTokenWidth(tk.rad, fs) + 3;
      else if (tk.type === 'frac') sum += Math.max(estimateSvgExprWidth(tk.num, fracFs), estimateSvgExprWidth(tk.den, fracFs)) + 8;
    });
    return sum;
  }

  function renderSvgMathDirect(cx, cy, rawExpr, o) {
    o = o || {};
    var fs = o.size || o.fontSize || 15.5;
    var fracFs = Math.round(fs * 0.84 * 10) / 10;
    var color = o.color || MATH_THEME.colors.ink;
    var halo = o.halo !== undefined ? o.halo : MATH_THEME.stroke.halo;
    var anchor = o.anchor || 'middle';
    var haloAttr = halo > 0 ? ' stroke="#ffffff" stroke-width="' + halo + '" paint-order="stroke"' : '';

    var tokens = parseSvgMathTokens(rawExpr);
    // 计算每个 token 的宽度
    var totalW = 0;
    tokens.forEach(function (tk) {
      if (tk.type === 'text') {
        tk.w = estimateSvgTokenWidth(tk.text, fs);
      } else if (tk.type === 'cong') {
        tk.w = fs * 0.96;
      } else if (tk.type === 'frac') {
        var nw = estimateSvgExprWidth(tk.num, fracFs);
        var dw = estimateSvgExprWidth(tk.den, fracFs);
        tk.w = Math.max(nw, dw) + 10;
      } else if (tk.type === 'sqrt') {
        tk.radW = estimateSvgTokenWidth(tk.rad, fs);
        tk.w = 10 + tk.radW + 3;
      }
      totalW += tk.w;
    });

    var startX = anchor === 'start' ? cx : anchor === 'end' ? cx - totalW : cx - totalW / 2;
    var curX = startX;
    var out = [];

    function fmtText(str, fSize) {
      return typeof window.svgAutoFormatText === 'function' ? window.svgAutoFormatText(str, fSize) : str;
    }

    tokens.forEach(function (tk) {
      if (tk.type === 'text') {
        out.push(
          '<text x="' + curX.toFixed(1) + '" y="' + cy.toFixed(1) + '" ' +
          'font-family="\'Times New Roman\', \'Songti SC\', SimSun, serif" ' +
          'font-size="' + fs + '" font-weight="700" fill="' + color + '" text-anchor="start"' +
          haloAttr + '>' +
          fmtText(tk.text, fs) +
          '</text>'
        );
        curX += tk.w;
      } else if (tk.type === 'cong') {
        var sc = fs / 15.5;
        var ox = curX + 0.5;
        var oy = cy - fs * 0.78;
        var waveD =
          'M ' + (ox + 1.2 * sc).toFixed(1) + ' ' + (oy + 4.2 * sc).toFixed(1) +
          ' C ' + (ox + 3.0 * sc).toFixed(1) + ' ' + (oy + 0.5 * sc).toFixed(1) + ', ' +
                  (ox + 5.8 * sc).toFixed(1) + ' ' + (oy + 0.5 * sc).toFixed(1) + ', ' +
                  (ox + 7.5 * sc).toFixed(1) + ' ' + (oy + 4.2 * sc).toFixed(1) +
          ' C ' + (ox + 9.2 * sc).toFixed(1) + ' ' + (oy + 7.9 * sc).toFixed(1) + ', ' +
                  (ox + 12.0 * sc).toFixed(1) + ' ' + (oy + 7.9 * sc).toFixed(1) + ', ' +
                  (ox + 13.8 * sc).toFixed(1) + ' ' + (oy + 4.2 * sc).toFixed(1);
        var l1y = (oy + 9.1 * sc).toFixed(1);
        var l2y = (oy + 12.1 * sc).toFixed(1);
        var lx1 = (ox + 1.1 * sc).toFixed(1);
        var lx2 = (ox + 13.9 * sc).toFixed(1);
        if (halo > 0) {
          out.push(
            '<path d="' + waveD + '" fill="none" stroke="#ffffff" stroke-width="' + (halo + 1) + '" stroke-linecap="round"/>' +
            '<line x1="' + lx1 + '" y1="' + l1y + '" x2="' + lx2 + '" y2="' + l1y + '" stroke="#ffffff" stroke-width="' + (halo + 1) + '" stroke-linecap="round"/>' +
            '<line x1="' + lx1 + '" y1="' + l2y + '" x2="' + lx2 + '" y2="' + l2y + '" stroke="#ffffff" stroke-width="' + (halo + 1) + '" stroke-linecap="round"/>'
          );
        }
        out.push(
          '<path d="' + waveD + '" fill="none" stroke="' + color + '" stroke-width="1.55" stroke-linecap="round"/>' +
          '<line x1="' + lx1 + '" y1="' + l1y + '" x2="' + lx2 + '" y2="' + l1y + '" stroke="' + color + '" stroke-width="1.5" stroke-linecap="round"/>' +
          '<line x1="' + lx1 + '" y1="' + l2y + '" x2="' + lx2 + '" y2="' + l2y + '" stroke="' + color + '" stroke-width="1.5" stroke-linecap="round"/>'
        );
        curX += tk.w;
      } else if (tk.type === 'frac') {
        var midX = curX + tk.w / 2;
        var barY = cy - fs * 0.34;
        var numY = barY - 5.0;
        var denY = barY + fracFs + 2.0;
        // 分数线白边光晕 + 实线
        out.push(
          '<line x1="' + (curX + 1.5).toFixed(1) + '" y1="' + barY.toFixed(1) + '" x2="' + (curX + tk.w - 1.5).toFixed(1) + '" y2="' + barY.toFixed(1) + '" stroke="#ffffff" stroke-width="' + (halo + 1) + '" stroke-linecap="round"/>' +
          '<line x1="' + (curX + 1.5).toFixed(1) + '" y1="' + barY.toFixed(1) + '" x2="' + (curX + tk.w - 1.5).toFixed(1) + '" y2="' + barY.toFixed(1) + '" stroke="' + color + '" stroke-width="1.65" stroke-linecap="round"/>'
        );
        if (tk.num.indexOf('\\sqrt') !== -1 || tk.num.indexOf('√') !== -1) {
          out.push(renderSvgMathDirect(midX, numY, tk.num, { size: fracFs, color: color, halo: halo, anchor: 'middle' }));
        } else {
          out.push('<text x="' + midX.toFixed(1) + '" y="' + numY.toFixed(1) + '" font-family="\'Times New Roman\', serif" font-size="' + fracFs + '" font-weight="700" fill="' + color + '" text-anchor="middle" stroke="#ffffff" stroke-width="' + halo + '" paint-order="stroke">' + fmtText(tk.num, fracFs) + '</text>');
        }
        if (tk.den.indexOf('\\sqrt') !== -1 || tk.den.indexOf('√') !== -1) {
          out.push(renderSvgMathDirect(midX, denY, tk.den, { size: fracFs, color: color, halo: halo, anchor: 'middle' }));
        } else {
          out.push('<text x="' + midX.toFixed(1) + '" y="' + denY.toFixed(1) + '" font-family="\'Times New Roman\', serif" font-size="' + fracFs + '" font-weight="700" fill="' + color + '" text-anchor="middle" stroke="#ffffff" stroke-width="' + halo + '" paint-order="stroke">' + fmtText(tk.den, fracFs) + '</text>');
        }
        curX += tk.w + 1;
      } else if (tk.type === 'sqrt') {
        // 一体化连续矢量根号折线（折钩 + 水平顶线 vinculum 一笔连通，绝不断开）
        var topY = cy - fs * 0.86;
        var botY = cy + 1.5;
        var midY = cy - fs * 0.36;
        var x0 = curX + 0.5;
        var x1 = curX + 2.8;
        var x2 = curX + 5.6;
        var x3 = curX + 9.4;
        var x4 = curX + tk.w - 0.5;
        var dPath =
          'M ' + x0.toFixed(1) + ' ' + midY.toFixed(1) +
          ' L ' + x1.toFixed(1) + ' ' + (midY - 1.8).toFixed(1) +
          ' L ' + x2.toFixed(1) + ' ' + botY.toFixed(1) +
          ' L ' + x3.toFixed(1) + ' ' + topY.toFixed(1) +
          ' L ' + x4.toFixed(1) + ' ' + topY.toFixed(1);
        out.push(
          '<path d="' + dPath + '" fill="none" stroke="#ffffff" stroke-width="' + (halo + 1) + '" stroke-linecap="round" stroke-linejoin="round"/>' +
          '<path d="' + dPath + '" fill="none" stroke="' + color + '" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round"/>' +
          '<text x="' + (x3 + 1).toFixed(1) + '" y="' + cy.toFixed(1) + '" font-family="\'Times New Roman\', serif" font-size="' + fs + '" font-weight="700" fill="' + color + '" text-anchor="start" stroke="#ffffff" stroke-width="' + halo + '" paint-order="stroke">' +
          fmtText(tk.rad, fs) +
          '</text>'
        );
        curX += tk.w;
      }
    });

    return '<g class="svg-math-direct">' + out.join('') + '</g>';
  }

  // 内置 SVG 文本正斜体/上下标自动格式化、顶部图例条与数字角（确保 math_components.js 100% 独立运行）
  if (typeof window.svgAutoFormatText !== 'function') {
    window.svgAutoFormatText = function (rawText, baseSize) {
      if (rawText === null || rawText === undefined) return '';
      var str = String(rawText);
      if (str.indexOf('<tspan') !== -1) return str;
      var fs = Number(baseSize || 14);
      var subFs = Math.max(9.5, Math.round(fs * 0.74 * 10) / 10);
      var subDy = Math.round(fs * 0.25 * 10) / 10;
      var supDy = Math.round(fs * 0.35 * 10) / 10;

      str = str.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
      str = str.replace(/([\u4e00-\u9fff])\s+([A-Za-z0-9|△▱∠⊥∥∽=+\-(])/g, '$1$2');
      str = str.replace(/([A-Za-z0-9|△▱∠⊥∥∽)])\s+([\u4e00-\u9fff])/g, '$1$2');
      str = str.replace(/(\d)\s+(cm|mm|km|kg|mg|kPa|Pa|min|s|m|h|g|t|N|A|V|W|Ω|°C)(?![A-Za-z])/g, '$1$2');

      function escSvg(s) {
        return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      }

      var pendingDy = 0;
      function consumeDyAttr(extraDy, forceFs) {
        var totalDy = Math.round((pendingDy + (extraDy || 0)) * 10) / 10;
        var hadPending = Math.abs(pendingDy) > 0.01;
        pendingDy = 0;
        var attr = '';
        if (Math.abs(totalDy) > 0.01) attr += ' dy="' + totalDy + '"';
        if (forceFs !== null && forceFs !== undefined) attr += ' font-size="' + forceFs + '"';
        else if (hadPending) attr += ' font-size="' + fs + '"';
        return attr;
      }

      function formatFlatTokens(seg, isSubOrSup) {
        if (!seg) return '';
        var tokenRe = /(Rt|sin|cos|tan|cot|min|max|SAS|ASA|AAS|SSS|HL|cm|mm|km|kg|mg|kPa|Pa|△|[A-Za-z]+|[\u4e00-\u9fff，。：；？！、（）“”]+|[^A-Za-z△\u4e00-\u9fff，。：；？！、（）“”]+)/g;
        var out = '';
        var m;
        var baseTokenFs = isSubOrSup ? subFs : fs;
        while ((m = tokenRe.exec(seg)) !== null) {
          var tk = m[0];
          var idx = m.index;
          var prevChar = idx > 0 ? seg.slice(0, idx).replace(/\s+$/, '').slice(-1) : '';
          var isUnitAfterSlashOrDigit = /^[mshgtNAVWJL]$/.test(tk) && (prevChar === '/' || /[0-9]/.test(prevChar));
          var safeTk = escSvg(tk);
          var dyAttr = isSubOrSup ? '' : consumeDyAttr(0, null);
          if (tk === '△') {
            var triFs = Math.round(baseTokenFs * 0.82 * 10) / 10;
            out += '<tspan' + dyAttr + ' font-family="\'Songti SC\', \'SimSun\', serif" font-style="normal" font-size="' + triFs + '">' + safeTk + '</tspan>';
          } else if (/^(Rt|sin|cos|tan|cot|min|max|SAS|ASA|AAS|SSS|HL|cm|mm|km|kg|mg|kPa|Pa)$/.test(tk) || isUnitAfterSlashOrDigit) {
            out += '<tspan' + dyAttr + ' font-family="\'Times New Roman\', Times, serif" font-style="normal" font-size="' + baseTokenFs + '">' + safeTk + '</tspan>';
          } else if (/^[A-Za-z]+$/.test(tk)) {
            out += '<tspan' + dyAttr + ' font-family="\'Times New Roman\', Times, serif" font-style="italic" font-size="' + baseTokenFs + '">' + safeTk + '</tspan>';
          } else if (/^[\u4e00-\u9fff，。：；？！、（）“”]+$/.test(tk)) {
            out += '<tspan' + dyAttr + ' font-family="\'Songti SC\', \'SimSun\', \'STSong\', serif" font-style="normal" font-size="' + baseTokenFs + '">' + safeTk + '</tspan>';
          } else {
            out += '<tspan' + dyAttr + ' font-family="\'Times New Roman\', Times, serif" font-style="normal" font-size="' + baseTokenFs + '">' + safeTk + '</tspan>';
          }
        }
        return out;
      }

      var subMap = { '₀':'0','₁':'1','₂':'2','₃':'3','₄':'4','₅':'5','₆':'6','₇':'7','₈':'8','₉':'9','ₙ':'n' };
      var supMap = { '⁰':'0','¹':'1','²':'2','³':'3','⁴':'4','⁵':'5','⁶':'6','⁷':'7','⁸':'8','⁹':'9' };
      var masterRe = /S(直角梯形|平行四边形|四边形|矩形|梯形|Rt△|△|▱)([A-Za-z0-9']*)|([₀₁₂₃₄₅₆₇₈₉ₙ]+)|([⁰¹²³⁴⁵⁶⁷⁸⁹]+)|_\{([^{}]+)\}|\^\{([^{}]+)\}/g;

      var result = '';
      var lastIdx = 0;
      var match;
      while ((match = masterRe.exec(str)) !== null) {
        if (match.index > lastIdx) {
          result += formatFlatTokens(str.slice(lastIdx, match.index), false);
        }
        if (match[1] !== undefined) {
          var prefixSub = match[1];
          var lettersSub = match[2] || '';
          var sAttr = consumeDyAttr(0, null);
          result += '<tspan' + sAttr + ' font-family="\'Times New Roman\', Times, serif" font-style="italic">S</tspan>';
          result += '<tspan dy="' + subDy + '" font-size="' + subFs + '">' + formatFlatTokens(prefixSub + lettersSub, true) + '</tspan>';
          pendingDy = -subDy;
        } else if (match[3] !== undefined || match[5] !== undefined) {
          var rawSub = match[3] ? match[3].split('').map(function (c) { return subMap[c] || c; }).join('') : match[5];
          var subAttr = consumeDyAttr(subDy, subFs);
          result += '<tspan' + subAttr + '>' + formatFlatTokens(rawSub, true) + '</tspan>';
          pendingDy = -subDy;
        } else if (match[4] !== undefined || match[6] !== undefined) {
          var rawSup = match[4] ? match[4].split('').map(function (c) { return supMap[c] || c; }).join('') : match[6];
          var supAttr = consumeDyAttr(-supDy, subFs);
          result += '<tspan' + supAttr + '>' + formatFlatTokens(rawSup, true) + '</tspan>';
          pendingDy = supDy;
        }
        lastIdx = masterRe.lastIndex;
      }
      if (lastIdx < str.length) {
        result += formatFlatTokens(str.slice(lastIdx), false);
      }
      return result;
    };
  }

  if (typeof window.svgLegendBar !== 'function') {
    window.svgLegendBar = function (items, opts) {
      opts = opts || {};
      var list = Array.isArray(items) ? items.filter(Boolean) : [];
      if (!list.length) return '';
      var x = opts.x !== undefined ? opts.x : 12;
      var y = opts.y !== undefined ? opts.y : 6;
      var w = opts.width || 516;
      var h = opts.height || 28;
      var cy = y + h / 2;
      var fs = opts.fontSize || 12.5;

      function estTextW(str) {
        var tw = 0;
        var s = String(str || '');
        for (var i = 0; i < s.length; i++) {
          tw += fs * (s.charCodeAt(i) > 127 ? 0.92 : 0.54);
        }
        return tw;
      }

      var measured = list.map(function (it) {
        var type = it.type || 'angle';
        var iconW = type === 'dash' ? 18 : (type === 'line' ? 16 : 15);
        var rawTxt = String(it.text || it.html || '').replace(/<[^>]+>/g, '');
        var tw = estTextW(rawTxt);
        return { it: it, type: type, iconW: iconW, rawTxt: rawTxt, tw: tw, totalW: iconW + 4 + tw };
      });

      var gap = 16;
      var sumW = measured.reduce(function (acc, m) { return acc + m.totalW; }, 0) + gap * (measured.length - 1);
      var curX = x + Math.max(8, (w - sumW) / 2);

      var out = '<g class="svg-legend-bar">';
      out += '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="6" fill="rgba(248,250,252,0.96)" stroke="#cbd5e1" stroke-width="1.2"/>';

      measured.forEach(function (m, idx) {
        var color = m.it.color || '#2563eb';
        if (m.type === 'angle') {
          out += '<path d="M ' + (curX + 13).toFixed(1) + ' ' + (cy + 5).toFixed(1) + ' L ' + (curX + 1).toFixed(1) + ' ' + (cy + 5).toFixed(1) + ' L ' + (curX + 10).toFixed(1) + ' ' + (cy - 5).toFixed(1) + '" fill="none" stroke="' + color + '" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>';
          out += '<path d="M ' + (curX + 8).toFixed(1) + ' ' + (cy + 5).toFixed(1) + ' A 6.5 6.5 0 0 0 ' + (curX + 6.3).toFixed(1) + ' ' + (cy - 0.8).toFixed(1) + '" fill="none" stroke="' + color + '" stroke-width="1.5"/>';
        } else if (m.type === 'dash') {
          out += '<line x1="' + curX.toFixed(1) + '" y1="' + cy.toFixed(1) + '" x2="' + (curX + 18).toFixed(1) + '" y2="' + cy.toFixed(1) + '" stroke="' + color + '" stroke-width="2.4" stroke-dasharray="4 3" stroke-linecap="round"/>';
        } else if (m.type === 'tri') {
          out += '<polygon points="' + (curX + 7).toFixed(1) + ',' + (cy - 5.5).toFixed(1) + ' ' + (curX + 1).toFixed(1) + ',' + (cy + 5).toFixed(1) + ' ' + (curX + 13).toFixed(1) + ',' + (cy + 5).toFixed(1) + '" fill="' + (m.it.fill || 'rgba(37,99,235,0.20)') + '" stroke="' + color + '" stroke-width="1.5" stroke-linejoin="round"/>';
        } else {
          out += '<line x1="' + curX.toFixed(1) + '" y1="' + cy.toFixed(1) + '" x2="' + (curX + 16).toFixed(1) + '" y2="' + cy.toFixed(1) + '" stroke="' + color + '" stroke-width="2.4" stroke-linecap="round"/>';
        }
        var tx = curX + m.iconW + 4;
        var ty = cy + 4.5;
        if (m.rawTxt.indexOf('≌') !== -1 || m.rawTxt.indexOf('\\cong') !== -1 || m.rawTxt.indexOf('\\frac') !== -1 || m.rawTxt.indexOf('\\sqrt') !== -1 || m.rawTxt.indexOf('√') !== -1) {
          out += renderSvgMathDirect(tx, ty, m.rawTxt, { size: fs, color: color, halo: 0, anchor: 'start' });
        } else {
          out += '<text x="' + tx.toFixed(1) + '" y="' + ty.toFixed(1) + '" font-family="\'Times New Roman\', \'Songti SC\', SimSun, serif" font-weight="700" font-size="' + fs + '" fill="' + color + '" text-anchor="start">' + window.svgAutoFormatText(m.rawTxt, fs) + '</text>';
        }
        curX += m.totalW + gap;
        if (idx < measured.length - 1) {
          var sepX = curX - gap / 2;
          out += '<line x1="' + sepX.toFixed(1) + '" y1="' + (y + 6).toFixed(1) + '" x2="' + sepX.toFixed(1) + '" y2="' + (y + h - 6).toFixed(1) + '" stroke="#cbd5e1" stroke-width="1.2"/>';
        }
      });

      out += '</g>';
      return out;
    };
  }

  if (typeof window.svgNumberedAngle !== 'function') {
    window.svgNumberedAngle = function (v, pStart, pEnd, numStr, opts) {
      opts = opts || {};
      var radius = opts.radius || 28;
      var color = opts.color || '#2563eb';
      var fill = opts.fill || 'none';
      var labelDist = opts.labelDist || (radius + 13);
      var dx1 = pStart[0] - v[0], dy1 = pStart[1] - v[1];
      var dx2 = pEnd[0] - v[0], dy2 = pEnd[1] - v[1];
      var a1 = Math.atan2(dy1, dx1);
      var a2 = Math.atan2(dy2, dx2);
      var diff = a2 - a1;
      while (diff <= -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      var sweep = diff > 0 ? 1 : 0;
      var sx = v[0] + Math.cos(a1) * radius;
      var sy = v[1] + Math.sin(a1) * radius;
      var ex = v[0] + Math.cos(a2) * radius;
      var ey = v[1] + Math.sin(a2) * radius;
      var out = '';
      if (fill && fill !== 'none') {
        out += '<path d="M ' + v[0].toFixed(1) + ' ' + v[1].toFixed(1) + ' L ' + sx.toFixed(1) + ' ' + sy.toFixed(1) + ' A ' + radius + ' ' + radius + ' 0 0 ' + sweep + ' ' + ex.toFixed(1) + ' ' + ey.toFixed(1) + ' Z" fill="' + fill + '" stroke="none"/>';
      }
      out += '<path d="M ' + sx.toFixed(1) + ' ' + sy.toFixed(1) + ' A ' + radius + ' ' + radius + ' 0 0 ' + sweep + ' ' + ex.toFixed(1) + ' ' + ey.toFixed(1) + '" fill="none" stroke="' + color + '" stroke-width="2.1"/>';
      if (numStr !== undefined && numStr !== null && String(numStr) !== '') {
        var midA = a1 + diff / 2 + (opts.angleShift || 0);
        var lx = v[0] + Math.cos(midA) * labelDist + (opts.dx || 0);
        var ly = v[1] + Math.sin(midA) * labelDist + 4.5 + (opts.dy || 0);
        if (opts.leader) {
          var mx = v[0] + Math.cos(midA) * (radius * 0.75);
          var my = v[1] + Math.sin(midA) * (radius * 0.75);
          var tx = v[0] + Math.cos(midA) * (labelDist - 7) + (opts.dx || 0);
          var ty = v[1] + Math.sin(midA) * (labelDist - 7) + (opts.dy || 0);
          out += '<line x1="' + mx.toFixed(1) + '" y1="' + my.toFixed(1) + '" x2="' + tx.toFixed(1) + '" y2="' + ty.toFixed(1) + '" stroke="' + color + '" stroke-width="1.3"/>';
        }
        var inner = window.svgAutoFormatText(String(numStr), opts.fontSize || 14);
        out += '<text x="' + lx.toFixed(1) + '" y="' + ly.toFixed(1) + '" font-family="\'Times New Roman\', \'Songti SC\', SimSun, serif" font-weight="700" font-size="' + (opts.fontSize || 14) + '" fill="' + color + '" text-anchor="middle" stroke="#ffffff" stroke-width="3.5" paint-order="stroke">' + inner + '</text>';
      }
      return out;
    };
  }

  var MathFormula = {
    render: compileMathToHtml,
    svg: renderSvgMathDirect
  };
  window.MathFormula = MathFormula;

  // ===========================================================================
  // M3. POLYA-GRADE GEOMETRY CANVAS (window.createGeoCanvas)
  // 全程采用无背景直标（Direct White-Halo Annotation），摒弃遮挡图形的胶囊框
  // ===========================================================================

  var COMPASS_OFFSET = {
    'top': [0, -16],
    'bottom': [0, 20],
    'left': [-16, 5],
    'right': [16, 5],
    'top-left': [-14, -12],
    'top-right': [14, -12],
    'bottom-left': [-14, 18],
    'bottom-right': [14, 18]
  };

  function createGeoCanvas(opts) {
    opts = opts || {};
    var W = opts.width || 560;
    var H = opts.height || 420;
    var bg = opts.bg || '#ffffff';

    var hasMathCoord = Array.isArray(opts.xRange) && Array.isArray(opts.yRange);
    var pad = Object.assign({ left: 36, right: 36, top: 44, bottom: 36 }, opts.padding || {});
    var plotW = W - pad.left - pad.right;
    var plotH = H - pad.top - pad.bottom;

    function toPx(pt) {
      if (!pt || !hasMathCoord) return [Number(pt[0]), Number(pt[1])];
      var xMin = opts.xRange[0], xMax = opts.xRange[1];
      var yMin = opts.yRange[0], yMax = opts.yRange[1];
      var px = pad.left + ((pt[0] - xMin) / (xMax - xMin)) * plotW;
      var py = pad.top + ((yMax - pt[1]) / (yMax - yMin)) * plotH;
      return [px, py];
    }

    var layers = {
      fills: [],
      lines: [],
      marks: [],
      labels: []
    };

    var polyCentroid = [W / 2, H / 2];

    var fillThemeMap = {
      blue: MATH_THEME.colors.fillBlue,
      amber: MATH_THEME.colors.fillAmber,
      green: MATH_THEME.colors.fillGreen,
      purple: MATH_THEME.colors.fillPurple,
      rose: MATH_THEME.colors.fillRose
    };

    var api = {
      width: W,
      height: H,
      toPx: toPx,

      polygonFill: function (pts, theme, o) {
        o = o || {};
        var fill = fillThemeMap[theme] || theme || MATH_THEME.colors.fillBlue;
        var stroke = o.stroke || 'none';
        var sw = o.strokeWidth || 1.6;
        var dash = o.dash ? ' stroke-dasharray="' + o.dash + '"' : '';
        var pStr = pts
          .map(function (p) {
            var q = toPx(p);
            return q[0].toFixed(1) + ',' + q[1].toFixed(1);
          })
          .join(' ');
        layers.fills.push(
          '<polygon points="' + pStr + '" fill="' + fill + '" stroke="' + stroke + '" stroke-width="' + sw + '"' + dash + '/>'
        );
        return api;
      },

      polygon: function (pts, o) {
        o = o || {};
        var stroke = o.color || MATH_THEME.colors.ink;
        var sw = o.width || MATH_THEME.stroke.primary;
        var fill = o.fill || 'none';
        var dash = o.dash ? ' stroke-dasharray="' + o.dash + '"' : '';
        var pxPts = pts.map(toPx);
        if (pxPts.length >= 3) {
          var sx = 0, sy = 0;
          pxPts.forEach(function (q) { sx += q[0]; sy += q[1]; });
          polyCentroid = [sx / pxPts.length, sy / pxPts.length];
        }
        var pStr = pxPts.map(function (q) { return q[0].toFixed(1) + ',' + q[1].toFixed(1); }).join(' ');
        layers.lines.push(
          '<polygon points="' + pStr + '" fill="' + fill + '" stroke="' + stroke + '" stroke-width="' + sw + '" stroke-linejoin="round"' + dash + '/>'
        );
        return api;
      },

      segment: function (p1, p2, o) {
        o = o || {};
        var a = toPx(p1), b = toPx(p2);
        var color = o.color || MATH_THEME.colors.ink;
        var width = o.width || MATH_THEME.stroke.primary;
        var dash = o.dash ? ' stroke-dasharray="' + o.dash + '"' : '';
        layers.lines.push(
          '<line x1="' + a[0].toFixed(1) + '" y1="' + a[1].toFixed(1) + '" x2="' + b[0].toFixed(1) + '" y2="' + b[1].toFixed(1) + '" ' +
          'stroke="' + color + '" stroke-width="' + width + '" stroke-linecap="round"' + dash + '/>'
        );
        return api;
      },

      auxLine: function (p1, p2, o) {
        o = o || {};
        return api.segment(p1, p2, {
          color: o.color || MATH_THEME.colors.auxRed,
          width: o.width || MATH_THEME.stroke.aux,
          dash: o.dash || MATH_THEME.stroke.auxDash
        });
      },

      circle: function (center, rPx, o) {
        o = o || {};
        var c = toPx(center);
        var stroke = o.color || MATH_THEME.colors.ink;
        var sw = o.width || 2.2;
        var fill = o.fill || 'none';
        var dash = o.dash ? ' stroke-dasharray="' + o.dash + '"' : '';
        layers.lines.push(
          '<circle cx="' + c[0].toFixed(1) + '" cy="' + c[1].toFixed(1) + '" r="' + Number(rPx).toFixed(1) + '" ' +
          'fill="' + fill + '" stroke="' + stroke + '" stroke-width="' + sw + '"' + dash + '/>'
        );
        return api;
      },

      circleWithCenter: function (center, rPx, label, o) {
        o = o || {};
        api.circle(center, rPx, o);
        var c = toPx(center);
        layers.labels.push(
          '<circle cx="' + c[0].toFixed(1) + '" cy="' + c[1].toFixed(1) + '" r="' + MATH_THEME.pointRadius.center + '" fill="' + MATH_THEME.colors.ink + '"/>'
        );
        if (label !== false) {
          var preset = COMPASS_OFFSET[o.dir || 'bottom-right'] || [12, 16];
          layers.labels.push(renderSvgMathDirect(c[0] + preset[0], c[1] + preset[1], label || 'O', { size: 16.5 }));
        }
        return api;
      },

      sectorFill: function (center, rPx, startMathDeg, endMathDeg, theme, o) {
        o = o || {};
        var c = toPx(center);
        var r = Number(rPx);
        var rad1 = (-startMathDeg * Math.PI) / 180;
        var rad2 = (-endMathDeg * Math.PI) / 180;
        var x1 = c[0] + r * Math.cos(rad1), y1 = c[1] + r * Math.sin(rad1);
        var x2 = c[0] + r * Math.cos(rad2), y2 = c[1] + r * Math.sin(rad2);
        var span = ((endMathDeg - startMathDeg) % 360 + 360) % 360;
        var largeArc = span > 180 ? 1 : 0;
        var fill = fillThemeMap[theme] || theme || MATH_THEME.colors.fillBlue;
        var isBow = Boolean(o.bow);
        var d = isBow
          ? 'M ' + x1.toFixed(1) + ' ' + y1.toFixed(1) + ' A ' + r + ' ' + r + ' 0 ' + largeArc + ' 0 ' + x2.toFixed(1) + ' ' + y2.toFixed(1) + ' Z'
          : 'M ' + c[0].toFixed(1) + ' ' + c[1].toFixed(1) + ' L ' + x1.toFixed(1) + ' ' + y1.toFixed(1) + ' A ' + r + ' ' + r + ' 0 ' + largeArc + ' 0 ' + x2.toFixed(1) + ' ' + y2.toFixed(1) + ' Z';
        layers.fills.push('<path d="' + d + '" fill="' + fill + '" stroke="' + (o.stroke || 'none') + '" stroke-width="1.5"/>');
        return api;
      },

      tangentFromPoint: function (center, rPx, extPt, o) {
        o = o || {};
        var c = toPx(center), p = toPx(extPt);
        var r = Number(rPx);
        var dx = p[0] - c[0], dy = p[1] - c[1];
        var d = Math.hypot(dx, dy);
        if (d <= r) return api;
        var baseAng = Math.atan2(dy, dx);
        var alpha = Math.acos(r / d);
        var a1 = baseAng - alpha, a2 = baseAng + alpha;
        var t1 = [c[0] + r * Math.cos(a1), c[1] + r * Math.sin(a1)];
        var t2 = [c[0] + r * Math.cos(a2), c[1] + r * Math.sin(a2)];

        var which = o.which || 'both';
        if (which === 'both' || which === 'first') {
          api.segment(p, t1, { color: o.color || MATH_THEME.colors.ink });
          if (o.showRadius !== false) {
            api.auxLine(c, t1);
            api.rightAngle(t1, c, p, { size: 11 });
          }
          if (o.label1) api.point(t1, o.label1, { dir: o.dir1 || 'top' });
        }
        if (which === 'both' || which === 'second') {
          api.segment(p, t2, { color: o.color || MATH_THEME.colors.ink });
          if (o.showRadius !== false) {
            api.auxLine(c, t2);
            api.rightAngle(t2, c, p, { size: 11 });
          }
          if (o.label2) api.point(t2, o.label2, { dir: o.dir2 || 'bottom' });
        }
        return api;
      },

      compassArc: function (center, rPx, midMathDeg, spanDeg, o) {
        o = o || {};
        var c = toPx(center);
        var r = Number(rPx);
        var half = (spanDeg || 28) / 2;
        var rad1 = (-(midMathDeg - half) * Math.PI) / 180;
        var rad2 = (-(midMathDeg + half) * Math.PI) / 180;
        var x1 = c[0] + r * Math.cos(rad1), y1 = c[1] + r * Math.sin(rad1);
        var x2 = c[0] + r * Math.cos(rad2), y2 = c[1] + r * Math.sin(rad2);
        var col = o.color || '#0284c7';
        layers.marks.push(
          '<path d="M ' + x1.toFixed(1) + ' ' + y1.toFixed(1) + ' A ' + r + ' ' + r + ' 0 0 0 ' + x2.toFixed(1) + ' ' + y2.toFixed(1) + '" ' +
          'fill="none" stroke="' + col + '" stroke-width="' + MATH_THEME.stroke.compass + '" stroke-dasharray="' + (o.dash || '4 3') + '" stroke-linecap="round"/>'
        );
        return api;
      },

      dimensionLine: function (p1, p2, label, o) {
        o = o || {};
        var a = toPx(p1), b = toPx(p2);
        var offset = o.offset !== undefined ? o.offset : 26;
        var color = o.color || MATH_THEME.colors.dimCyan;
        var dx = b[0] - a[0], dy = b[1] - a[1];
        var len = Math.hypot(dx, dy) || 1;
        var ux = dx / len, uy = dy / len;
        var nx = -uy, ny = ux;
        if (o.side === 'right') {
          nx = -nx; ny = -ny;
        } else if (o.side !== 'left') {
          var segMidX = (a[0] + b[0]) / 2, segMidY = (a[1] + b[1]) / 2;
          if (nx * (segMidX - polyCentroid[0]) + ny * (segMidY - polyCentroid[1]) < 0) {
            nx = -nx; ny = -ny;
          }
        }

        var extA1 = [a[0] + nx * 4, a[1] + ny * 4];
        var extA2 = [a[0] + nx * (offset + 6), a[1] + ny * (offset + 6)];
        var extB1 = [b[0] + nx * 4, b[1] + ny * 4];
        var extB2 = [b[0] + nx * (offset + 6), b[1] + ny * (offset + 6)];

        var dimA = [a[0] + nx * offset, a[1] + ny * offset];
        var dimB = [b[0] + nx * offset, b[1] + ny * offset];
        var mid = [(dimA[0] + dimB[0]) / 2, (dimA[1] + dimB[1]) / 2];

        var cleanLabel = String(label).replace(/\s+/g, '');
        var gapHalf = o.gapHalf || Math.min(len * 0.36, Math.max(22, cleanLabel.length * 5.2 + 8));
        var g1 = [mid[0] - ux * gapHalf, mid[1] - uy * gapHalf];
        var g2 = [mid[0] + ux * gapHalf, mid[1] + uy * gapHalf];

        var aw = 7, ah = 3.6;
        var arrA1 = [dimA[0] + ux * aw + nx * ah, dimA[1] + uy * aw + ny * ah];
        var arrA2 = [dimA[0] + ux * aw - nx * ah, dimA[1] + uy * aw - ny * ah];
        var arrB1 = [dimB[0] - ux * aw + nx * ah, dimB[1] - uy * aw + ny * ah];
        var arrB2 = [dimB[0] - ux * aw - nx * ah, dimB[1] - uy * aw - ny * ah];

        layers.marks.push(
          '<line x1="' + extA1[0].toFixed(1) + '" y1="' + extA1[1].toFixed(1) + '" x2="' + extA2[0].toFixed(1) + '" y2="' + extA2[1].toFixed(1) + '" stroke="' + color + '" stroke-width="1.2"/>' +
          '<line x1="' + extB1[0].toFixed(1) + '" y1="' + extB1[1].toFixed(1) + '" x2="' + extB2[0].toFixed(1) + '" y2="' + extB2[1].toFixed(1) + '" stroke="' + color + '" stroke-width="1.2"/>' +
          '<line x1="' + dimA[0].toFixed(1) + '" y1="' + dimA[1].toFixed(1) + '" x2="' + g1[0].toFixed(1) + '" y2="' + g1[1].toFixed(1) + '" stroke="' + color + '" stroke-width="1.5"/>' +
          '<line x1="' + g2[0].toFixed(1) + '" y1="' + g2[1].toFixed(1) + '" x2="' + dimB[0].toFixed(1) + '" y2="' + dimB[1].toFixed(1) + '" stroke="' + color + '" stroke-width="1.5"/>' +
          '<polygon points="' + dimA[0].toFixed(1) + ',' + dimA[1].toFixed(1) + ' ' + arrA1[0].toFixed(1) + ',' + arrA1[1].toFixed(1) + ' ' + arrA2[0].toFixed(1) + ',' + arrA2[1].toFixed(1) + '" fill="' + color + '"/>' +
          '<polygon points="' + dimB[0].toFixed(1) + ',' + dimB[1].toFixed(1) + ' ' + arrB1[0].toFixed(1) + ',' + arrB1[1].toFixed(1) + ' ' + arrB2[0].toFixed(1) + ',' + arrB2[1].toFixed(1) + '" fill="' + color + '"/>'
        );

        layers.labels.push(renderSvgMathDirect(mid[0], mid[1] + 5, cleanLabel, { size: o.fontSize || 14.5, color: o.textColor || MATH_THEME.colors.ink }));
        return api;
      },

      reflectPointAcrossLine: function (pt, lineA, lineB, labelPrime, o) {
        o = o || {};
        var p = toPx(pt), a = toPx(lineA), b = toPx(lineB);
        var dx = b[0] - a[0], dy = b[1] - a[1];
        var len2 = dx * dx + dy * dy || 1;
        var t = ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / len2;
        var foot = [a[0] + t * dx, a[1] + t * dy];
        var pPrime = [2 * foot[0] - p[0], 2 * foot[1] - p[1]];

        api.auxLine(p, pPrime, { color: o.color || MATH_THEME.colors.anglePurple });
        api.rightAngle(foot, p, b, { size: 10 });
        api.tickMarks(p, foot, 1, { color: MATH_THEME.colors.anglePurple });
        api.tickMarks(foot, pPrime, 1, { color: MATH_THEME.colors.anglePurple });
        api.point(pPrime, labelPrime || "P'", { role: 'aux', color: MATH_THEME.colors.anglePurple, dir: o.dir || 'bottom-right' });
        return pPrime;
      },

      rightAngle: function (vertex, p1, p2, o) {
        o = o || {};
        var v = toPx(vertex), a = toPx(p1), b = toPx(p2);
        var size = o.size || 12;
        var color = o.color || MATH_THEME.colors.slate;
        var v1 = [a[0] - v[0], a[1] - v[1]];
        var v2 = [b[0] - v[0], b[1] - v[1]];
        var l1 = Math.hypot(v1[0], v1[1]) || 1;
        var l2 = Math.hypot(v2[0], v2[1]) || 1;
        var u1 = [(v1[0] / l1) * size, (v1[1] / l1) * size];
        var u2 = [(v2[0] / l2) * size, (v2[1] / l2) * size];
        var pA = [v[0] + u1[0], v[1] + u1[1]];
        var pB = [v[0] + u1[0] + u2[0], v[1] + u1[1] + u2[1]];
        var pC = [v[0] + u2[0], v[1] + u2[1]];
        var fill = o.fill || 'rgba(148, 163, 184, 0.14)';
        layers.marks.push(
          '<polygon points="' +
            v[0].toFixed(1) + ',' + v[1].toFixed(1) + ' ' +
            pA[0].toFixed(1) + ',' + pA[1].toFixed(1) + ' ' +
            pB[0].toFixed(1) + ',' + pB[1].toFixed(1) + ' ' +
            pC[0].toFixed(1) + ',' + pC[1].toFixed(1) +
            '" fill="' + fill + '" stroke="none"/>' +
          '<polyline points="' +
            pA[0].toFixed(1) + ',' + pA[1].toFixed(1) + ' ' +
            pB[0].toFixed(1) + ',' + pB[1].toFixed(1) + ' ' +
            pC[0].toFixed(1) + ',' + pC[1].toFixed(1) +
            '" fill="none" stroke="' + color + '" stroke-width="' + MATH_THEME.stroke.rightAngle + '"/>'
        );
        return api;
      },

      angle: function (vertex, pStart, pEnd, numStr, o) {
        o = o || {};
        var v = toPx(vertex), a = toPx(pStart), b = toPx(pEnd);
        var colorMap = {
          blue: MATH_THEME.colors.angleBlue,
          amber: MATH_THEME.colors.angleAmber,
          purple: MATH_THEME.colors.anglePurple,
          red: MATH_THEME.colors.auxRed,
          green: MATH_THEME.colors.targetGreen
        };
        var color = colorMap[o.color] || o.color || MATH_THEME.colors.angleBlue;
        var tier = o.tier || 1;
        var radius = o.radius || MATH_THEME.angleTiers[tier] || 26;

        var a1 = Math.atan2(a[1] - v[1], a[0] - v[0]);
        var a2 = Math.atan2(b[1] - v[1], b[0] - v[0]);
        var diff = a2 - a1;
        while (diff <= -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        var deg = Math.abs((diff * 180) / Math.PI);
        var useLeader = o.leader !== undefined ? o.leader : deg < 28;

        if (typeof window.svgNumberedAngle === 'function') {
          layers.marks.push(
            window.svgNumberedAngle(v, a, b, String(numStr), {
              radius: radius,
              color: color,
              leader: useLeader,
              labelOffset: o.labelOffset || (useLeader ? 20 : 13),
              fontSize: o.fontSize || 15
            })
          );
        }
        return api;
      },

      tickMarks: function (p1, p2, count, o) {
        o = o || {};
        var a = toPx(p1), b = toPx(p2);
        var nCount = count || 1;
        var color = o.color || MATH_THEME.colors.auxRed;
        var size = o.size || 6;
        var tPos = o.t !== undefined ? o.t : 0.5;
        var dx = b[0] - a[0], dy = b[1] - a[1];
        var len = Math.hypot(dx, dy) || 1;
        var ux = dx / len, uy = dy / len;
        var nx = -uy, ny = ux;
        var mx = a[0] + dx * tPos, my = a[1] + dy * tPos;
        var gap = 4.8;
        for (var i = 0; i < nCount; i++) {
          var shift = (i - (nCount - 1) / 2) * gap;
          var cx = mx + ux * shift, cy = my + uy * shift;
          layers.marks.push(
            '<line x1="' + (cx - nx * size).toFixed(1) + '" y1="' + (cy - ny * size).toFixed(1) + '" ' +
            'x2="' + (cx + nx * size).toFixed(1) + '" y2="' + (cy + ny * size).toFixed(1) + '" ' +
            'stroke="' + color + '" stroke-width="' + MATH_THEME.stroke.tick + '" stroke-linecap="round"/>'
          );
        }
        return api;
      },

      parallelMarks: function (p1, p2, count, o) {
        o = o || {};
        var a = toPx(p1), b = toPx(p2);
        var nCount = count || 1;
        var color = o.color || MATH_THEME.colors.angleBlue;
        var size = o.size || 6.5;
        var tPos = o.t !== undefined ? o.t : 0.5;
        var dx = b[0] - a[0], dy = b[1] - a[1];
        var len = Math.hypot(dx, dy) || 1;
        var ux = dx / len, uy = dy / len;
        var nx = -uy, ny = ux;
        var mx = a[0] + dx * tPos, my = a[1] + dy * tPos;
        var gap = 6.5;
        for (var i = 0; i < nCount; i++) {
          var shift = (i - (nCount - 1) / 2) * gap;
          var tipX = mx + ux * (shift + size * 0.5);
          var tipY = my + uy * (shift + size * 0.5);
          var w1x = tipX - ux * size + nx * (size * 0.72);
          var w1y = tipY - uy * size + ny * (size * 0.72);
          var w2x = tipX - ux * size - nx * (size * 0.72);
          var w2y = tipY - uy * size - ny * (size * 0.72);
          layers.marks.push(
            '<polyline points="' +
              w1x.toFixed(1) + ',' + w1y.toFixed(1) + ' ' +
              tipX.toFixed(1) + ',' + tipY.toFixed(1) + ' ' +
              w2x.toFixed(1) + ',' + w2y.toFixed(1) +
              '" fill="none" stroke="' + color + '" stroke-width="2.0" stroke-linecap="round" stroke-linejoin="round"/>'
          );
        }
        return api;
      },

      polygonVertices: function (pts, names, o) {
        o = o || {};
        var pxPts = pts.map(toPx);
        var n = pxPts.length;
        var dist = o.dist || 17;
        var dotColor = o.dotColor || MATH_THEME.colors.ink;
        var textColor = o.textColor || MATH_THEME.colors.ink;
        var customOffsets = o.offsets || {};

        var cx = 0, cy = 0;
        for (var i = 0; i < n; i++) {
          cx += pxPts[i][0];
          cy += pxPts[i][1];
        }
        cx /= n || 1;
        cy /= n || 1;

        for (var k = 0; k < n; k++) {
          var curr = pxPts[k];
          var prev = pxPts[(k - 1 + n) % n];
          var next = pxPts[(k + 1) % n];
          var label = names[k] || '';

          layers.labels.push(
            '<circle cx="' + curr[0].toFixed(1) + '" cy="' + curr[1].toFixed(1) + '" r="' + MATH_THEME.pointRadius.vertex + '" fill="' + dotColor + '" stroke="#ffffff" stroke-width="1.8"/>'
          );

          if (!label) continue;

          var dx, dy;
          if (customOffsets[label]) {
            dx = customOffsets[label][0];
            dy = customOffsets[label][1];
          } else {
            var u1x = prev[0] - curr[0], u1y = prev[1] - curr[1];
            var u2x = next[0] - curr[0], u2y = next[1] - curr[1];
            var l1 = Math.hypot(u1x, u1y) || 1;
            var l2 = Math.hypot(u2x, u2y) || 1;
            u1x /= l1; u1y /= l1;
            u2x /= l2; u2y /= l2;

            var bx = -(u1x + u2x);
            var by = -(u1y + u2y);
            var bLen = Math.hypot(bx, by);
            if (bLen < 1e-3) {
              bx = curr[0] - cx;
              by = curr[1] - cy;
              bLen = Math.hypot(bx, by) || 1;
            }
            bx /= bLen;
            by /= bLen;

            if (bx * (curr[0] - cx) + by * (curr[1] - cy) < 0) {
              bx = -bx;
              by = -by;
            }
            dx = bx * dist;
            dy = by * dist + 5;
          }

          layers.labels.push(renderSvgMathDirect(curr[0] + dx, curr[1] + dy, label, { size: o.fontSize || 17, color: textColor }));
        }
        return api;
      },

      point: function (pt, label, o) {
        o = o || {};
        var p = toPx(pt);
        var roleColor =
          o.role === 'moving'
            ? MATH_THEME.colors.auxRed
            : o.role === 'aux'
            ? MATH_THEME.colors.angleBlue
            : MATH_THEME.colors.ink;
        var dotColor = o.color || roleColor;
        var r = o.r || (o.role === 'moving' ? MATH_THEME.pointRadius.moving : MATH_THEME.pointRadius.vertex);

        layers.labels.push(
          '<circle cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="' + r + '" fill="' + dotColor + '" stroke="#ffffff" stroke-width="1.8"/>'
        );

        if (label) {
          var preset = COMPASS_OFFSET[o.dir || 'top-right'] || [14, -10];
          var dx = o.dx !== undefined ? o.dx : preset[0];
          var dy = o.dy !== undefined ? o.dy : preset[1];
          layers.labels.push(
            renderSvgMathDirect(p[0] + dx, p[1] + dy, label, {
              size: o.fontSize || 16.5,
              color: o.textColor || dotColor,
              anchor: o.anchor || (dx < -6 ? 'end' : dx > 6 ? 'start' : 'middle')
            })
          );
        }
        return api;
      },

      /**
       * 线段旁直接标注数值或二维分式/根式（不使用胶囊框，自带白边光晕，自动朝多边形外侧法向偏移）
       */
      segmentLabel: function (p1, p2, expr, o) {
        o = o || {};
        var a = toPx(p1), b = toPx(p2);
        var tPos = o.t !== undefined ? o.t : 0.5;
        var mx = a[0] + (b[0] - a[0]) * tPos;
        var my = a[1] + (b[1] - a[1]) * tPos;
        var dx = b[0] - a[0], dy = b[1] - a[1];
        var len = Math.hypot(dx, dy) || 1;
        var nx = -dy / len;
        var ny = dx / len;

        if (o.side === 'right') {
          nx = -nx; ny = -ny;
        } else if (o.side !== 'left') {
          var outX = mx - polyCentroid[0], outY = my - polyCentroid[1];
          if (nx * outX + ny * outY < 0) {
            nx = -nx; ny = -ny;
          }
        }

        var rawStr = String(expr || '');
        var hasFrac = /\\frac/.test(rawStr);
        var dist = o.dist || (hasFrac ? 24 : 16);
        var lx = mx + nx * dist + (o.dx || 0);
        var ly = my + ny * dist + 5 + (o.dy || 0);
        var anchor = o.anchor || (nx > 0.35 ? 'start' : nx < -0.35 ? 'end' : 'middle');
        if (anchor === 'start' && o.dist === undefined) lx = mx + nx * 14 + (o.dx || 0);
        if (anchor === 'end' && o.dist === undefined) lx = mx + nx * 14 + (o.dx || 0);

        var colorMap = {
          amber: '#b45309',
          blue: '#1d4ed8',
          red: '#dc2626',
          green: '#047857'
        };
        var txtColor = o.color || colorMap[o.pill] || (hasFrac ? '#b45309' : MATH_THEME.colors.ink);

        layers.labels.push(
          renderSvgMathDirect(lx, ly, rawStr, {
            size: o.fontSize || 15.5,
            color: txtColor,
            anchor: anchor
          })
        );
        return api;
      },

      /**
       * 求解目标轻量化引线直标（不使用大块胶囊框，采用圆点虚线引线 + 白边光晕二维公式直标）
       */
      targetCallout: function (anchorPt, labelPosOrRect, cfg) {
        cfg = cfg || {};
        var anchor = toPx(anchorPt);
        var isSolved = Boolean(cfg.solved);
        var tx, ty;
        if (Array.isArray(labelPosOrRect) && labelPosOrRect.length >= 4) {
          tx = labelPosOrRect[0] + labelPosOrRect[2] / 2;
          ty = labelPosOrRect[1] + labelPosOrRect[3] / 2 + 5;
        } else if (Array.isArray(labelPosOrRect)) {
          tx = labelPosOrRect[0];
          ty = labelPosOrRect[1];
        } else {
          tx = anchor[0] + 60;
          ty = anchor[1] + 28;
        }

        var rawExpr;
        if (isSolved && cfg.ans) {
          rawExpr = (cfg.target || '') + '=' + String(cfg.ans).replace(/^\$|\$$/g, '');
        } else {
          rawExpr = '求' + (cfg.target || '?') + '=?';
        }
        var color = isSolved ? MATH_THEME.colors.auxRed : MATH_THEME.colors.targetGreen;

        // 停止引线于文字左侧边缘前 8px
        var dx = tx - anchor[0], dy = (ty - 5) - anchor[1];
        var dist = Math.hypot(dx, dy) || 1;
        var endX = tx - (dx / dist) * 32;
        var endY = (ty - 5) - (dy / dist) * 10;

        layers.labels.push(
          '<line x1="' + anchor[0].toFixed(1) + '" y1="' + anchor[1].toFixed(1) + '" x2="' + endX.toFixed(1) + '" y2="' + endY.toFixed(1) + '" stroke="' + color + '" stroke-width="1.8" stroke-dasharray="4 3"/>' +
          '<circle cx="' + anchor[0].toFixed(1) + '" cy="' + anchor[1].toFixed(1) + '" r="3.8" fill="' + color + '" stroke="#ffffff" stroke-width="1.5"/>' +
          renderSvgMathDirect(tx, ty, rawExpr, {
            size: cfg.fontSize || 16,
            color: color,
            anchor: 'middle'
          })
        );
        return api;
      },

      legendBar: function (items, o) {
        if (!items || !items.length) return api;
        var colorMap = {
          blue: MATH_THEME.colors.angleBlue,
          amber: MATH_THEME.colors.angleAmber,
          purple: MATH_THEME.colors.anglePurple,
          red: MATH_THEME.colors.auxRed,
          green: MATH_THEME.colors.targetGreen
        };
        var typeMap = {
          aux: 'dash',
          dash: 'dash',
          line: 'line',
          angle: 'angle',
          sim: 'tri',
          cong: 'tri',
          tri: 'tri'
        };
        var mapped = items.map(function (it) {
          var c = colorMap[it.color] || it.color || (it.type === 'aux' ? MATH_THEME.colors.auxRed : MATH_THEME.colors.angleBlue);
          return {
            type: typeMap[it.type] || 'line',
            color: c,
            fill: it.fill,
            text: it.text || ''
          };
        });
        if (typeof window.svgLegendBar === 'function') {
          layers.labels.push(window.svgLegendBar(mapped, Object.assign({ width: W - 16, x: 8, y: 6 }, o || {})));
        }
        return api;
      },

      mathText: function (pt, expr, o) {
        var p = toPx(pt);
        layers.labels.push(renderSvgMathDirect(p[0], p[1], expr, o));
        return api;
      },

      raw: function (svgFragment, layerName) {
        var target = layers[layerName] || layers.labels;
        target.push(svgFragment);
        return api;
      },

      toSvg: function () {
        return (
          '<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" height="100%" style="background:' + bg + ';border-radius:12px;display:block;">' +
          layers.fills.join('') +
          layers.lines.join('') +
          layers.marks.join('') +
          layers.labels.join('') +
          '</svg>'
        );
      }
    };

    return api;
  }
  window.createGeoCanvas = createGeoCanvas;

  // ===========================================================================
  // M4. FUNCTION & PARABOLA COORDINATE CANVAS (window.createFuncCanvas)
  // 全部采用无胶囊直标（Direct White-Halo Annotation）
  // ===========================================================================
  function createFuncCanvas(opts) {
    opts = opts || {};
    var W = opts.width || 560;
    var H = opts.height || 400;
    var xRange = opts.xRange || [-5, 5];
    var yRange = opts.yRange || [-4, 6];
    var pad = Object.assign({ left: 38, right: 38, top: 42, bottom: 34 }, opts.padding || {});
    var plotW = W - pad.left - pad.right;
    var plotH = H - pad.top - pad.bottom;

    function toPx(pt) {
      var px = pad.left + ((pt[0] - xRange[0]) / (xRange[1] - xRange[0])) * plotW;
      var py = pad.top + ((yRange[1] - pt[1]) / (yRange[1] - yRange[0])) * plotH;
      return [px, py];
    }

    var parts = [];
    var topOverlays = [];

    var api = {
      toPx: toPx,

      drawAxes: function (o) {
        o = o || {};
        var origin = toPx([0, 0]);
        var ox = origin[0], oy = origin[1];
        var xStep = o.xStep || 1;
        var yStep = o.yStep || 1;

        if (o.grid !== false) {
          for (var gx = Math.ceil(xRange[0]); gx <= Math.floor(xRange[1]); gx += xStep) {
            var px = toPx([gx, 0])[0];
            parts.push('<line x1="' + px.toFixed(1) + '" y1="' + pad.top + '" x2="' + px.toFixed(1) + '" y2="' + (H - pad.bottom) + '" stroke="#f1f5f9" stroke-width="1"/>');
          }
          for (var gy = Math.ceil(yRange[0]); gy <= Math.floor(yRange[1]); gy += yStep) {
            var py = toPx([0, gy])[1];
            parts.push('<line x1="' + pad.left + '" y1="' + py.toFixed(1) + '" x2="' + (W - pad.right) + '" y2="' + py.toFixed(1) + '" stroke="#f1f5f9" stroke-width="1"/>');
          }
        }

        var axisColor = o.color || '#334155';
        parts.push(
          '<line x1="' + pad.left + '" y1="' + oy.toFixed(1) + '" x2="' + (W - pad.right + 10) + '" y2="' + oy.toFixed(1) + '" stroke="' + axisColor + '" stroke-width="1.8"/>' +
          '<polygon points="' + (W - pad.right + 14) + ',' + oy.toFixed(1) + ' ' + (W - pad.right + 5) + ',' + (oy - 4).toFixed(1) + ' ' + (W - pad.right + 5) + ',' + (oy + 4).toFixed(1) + '" fill="' + axisColor + '"/>' +
          '<line x1="' + ox.toFixed(1) + '" y1="' + (H - pad.bottom) + '" x2="' + ox.toFixed(1) + '" y2="' + (pad.top - 10) + '" stroke="' + axisColor + '" stroke-width="1.8"/>' +
          '<polygon points="' + ox.toFixed(1) + ',' + (pad.top - 14) + ' ' + (ox - 4).toFixed(1) + ',' + (pad.top - 5) + ' ' + (ox + 4).toFixed(1) + ',' + (pad.top - 5) + '" fill="' + axisColor + '"/>'
        );

        parts.push(
          '<text x="' + (ox - 10).toFixed(1) + '" y="' + (oy + 16).toFixed(1) + '" font-family="\'Times New Roman\', serif" font-style="italic" font-size="14" font-weight="700" fill="#334155">O</text>' +
          '<text x="' + (W - pad.right + 8) + '" y="' + (oy + 18).toFixed(1) + '" text-anchor="end" font-family="\'Times New Roman\', serif" font-style="italic" font-size="15" font-weight="700" fill="#0f172a">' + (o.xLabel || 'x') + '</text>' +
          '<text x="' + (ox + 12).toFixed(1) + '" y="' + (pad.top - 2) + '" font-family="\'Times New Roman\', serif" font-style="italic" font-size="15" font-weight="700" fill="#0f172a">' + (o.yLabel || 'y') + '</text>'
        );
        return api;
      },

      drawParabola: function (a, b, c, o) {
        o = o || {};
        var domMin = o.xMin !== undefined ? o.xMin : xRange[0];
        var domMax = o.xMax !== undefined ? o.xMax : xRange[1];
        var steps = 120;
        var dx = (domMax - domMin) / steps;
        var segs = [];
        var cur = [];
        for (var i = 0; i <= steps; i++) {
          var x = domMin + i * dx;
          var y = a * x * x + b * x + c;
          if (y >= yRange[0] - 0.8 && y <= yRange[1] + 0.8) {
            var p = toPx([x, y]);
            cur.push(p[0].toFixed(1) + ',' + p[1].toFixed(1));
          } else if (cur.length > 1) {
            segs.push(cur);
            cur = [];
          } else {
            cur = [];
          }
        }
        if (cur.length > 1) segs.push(cur);
        var col = o.color || '#2563eb';
        var sw = o.width || 2.6;
        segs.forEach(function (pts) {
          parts.push('<polyline points="' + pts.join(' ') + '" fill="none" stroke="' + col + '" stroke-width="' + sw + '" stroke-linecap="round"/>');
        });
        return api;
      },

      drawHyperbola: function (k, o) {
        o = o || {};
        var col = o.color || '#2563eb';
        var sw = o.width || 2.6;
        [-1, 1].forEach(function (sign) {
          if (o.branch === 'positive' && sign < 0) return;
          if (o.branch === 'negative' && sign > 0) return;
          var pts = [];
          for (var i = 1; i <= 80; i++) {
            var x = sign * (0.15 + (i / 80) * (Math.max(Math.abs(xRange[0]), Math.abs(xRange[1])) - 0.15));
            var y = k / x;
            if (x >= xRange[0] && x <= xRange[1] && y >= yRange[0] - 0.5 && y <= yRange[1] + 0.5) {
              var p = toPx([x, y]);
              pts.push(p[0].toFixed(1) + ',' + p[1].toFixed(1));
            }
          }
          if (pts.length > 1) {
            parts.push('<polyline points="' + pts.join(' ') + '" fill="none" stroke="' + col + '" stroke-width="' + sw + '" stroke-linecap="round"/>');
          }
        });
        return api;
      },

      drawSymmetryAxis: function (h, label, o) {
        o = o || {};
        var px = toPx([h, 0])[0];
        var col = o.color || '#d97706';
        parts.push(
          '<line x1="' + px.toFixed(1) + '" y1="' + (pad.top - 4) + '" x2="' + px.toFixed(1) + '" y2="' + (H - pad.bottom + 4) + '" stroke="' + col + '" stroke-width="1.8" stroke-dasharray="6 4"/>'
        );
        var txt = label || '直线x=' + h;
        topOverlays.push(renderSvgMathDirect(px + 8, pad.top + 16, txt, { size: 13.5, color: col, anchor: 'start' }));
        return api;
      },

      /**
       * 铅锤高辅助线 PM 与面积割补三角形阴影（直接白边光晕标注，无胶囊框）
       */
      drawLeadVertical: function (xP, yTop, yBot, ptA, ptB, o) {
        o = o || {};
        var pTop = toPx([xP, yTop]);
        var pBot = toPx([xP, yBot]);
        if (ptA && ptB) {
          var pA = toPx(ptA), pB = toPx(ptB);
          parts.push(
            '<polygon points="' + pA[0].toFixed(1) + ',' + pA[1].toFixed(1) + ' ' + pTop[0].toFixed(1) + ',' + pTop[1].toFixed(1) + ' ' + pB[0].toFixed(1) + ',' + pB[1].toFixed(1) + '" fill="rgba(37,99,235,0.15)" stroke="#2563eb" stroke-width="1.8"/>'
          );
        }
        parts.push(
          '<line x1="' + pTop[0].toFixed(1) + '" y1="' + pTop[1].toFixed(1) + '" x2="' + pBot[0].toFixed(1) + '" y2="' + pBot[1].toFixed(1) + '" stroke="#dc2626" stroke-width="2.4" stroke-dasharray="6 3"/>'
        );
        topOverlays.push(
          '<circle cx="' + pTop[0].toFixed(1) + '" cy="' + pTop[1].toFixed(1) + '" r="4.8" fill="#dc2626" stroke="#fff" stroke-width="1.6"/>' +
          '<circle cx="' + pBot[0].toFixed(1) + '" cy="' + pBot[1].toFixed(1) + '" r="4.5" fill="#d97706" stroke="#fff" stroke-width="1.6"/>'
        );
        if (o.label) {
          var midY = (pTop[1] + pBot[1]) / 2 + 5;
          topOverlays.push(
            renderSvgMathDirect(pTop[0] + 10, midY, o.label, {
              size: 15,
              color: '#dc2626',
              anchor: 'start'
            })
          );
        }
        return api;
      },

      drawLine: function (p1, p2, o) {
        o = o || {};
        var a = toPx(p1), b = toPx(p2);
        parts.push(
          '<line x1="' + a[0].toFixed(1) + '" y1="' + a[1].toFixed(1) + '" x2="' + b[0].toFixed(1) + '" y2="' + b[1].toFixed(1) + '" stroke="' + (o.color || '#0f766e') + '" stroke-width="' + (o.width || 2.2) + '"' + (o.dash ? ' stroke-dasharray="' + o.dash + '"' : '') + '/>'
        );
        return api;
      },

      drawPoint: function (pt, label, o) {
        o = o || {};
        var p = toPx(pt);
        var col = o.color || '#0f172a';
        var isOpen = Boolean(o.open);
        topOverlays.push(
          '<circle cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="' + (o.r || 4.5) + '" fill="' + (isOpen ? '#ffffff' : col) + '" stroke="' + col + '" stroke-width="2"/>'
        );
        if (label) {
          var dx = o.dx !== undefined ? o.dx : 10;
          var dy = o.dy !== undefined ? o.dy : -8;
          topOverlays.push(
            renderSvgMathDirect(p[0] + dx, p[1] + dy, label, {
              size: 14.5,
              color: col,
              anchor: 'start'
            })
          );
        }
        return api;
      },

      toSvg: function () {
        return (
          '<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" height="100%" style="background:#ffffff;border-radius:12px;display:block;">' +
          parts.join('') +
          topOverlays.join('') +
          '</svg>'
        );
      }
    };
    return api;
  }
  window.createFuncCanvas = createFuncCanvas;

  // ===========================================================================
  // M5. NUMBER LINE, BOX PLOT & PROBABILITY TREE (数轴、箱线图、概率树组件)
  // ===========================================================================

  function createNumberLine(opts) {
    opts = opts || {};
    var W = opts.width || 560;
    var H = opts.height || 185;
    var minVal = opts.min !== undefined ? opts.min : -4;
    var maxVal = opts.max !== undefined ? opts.max : 6;
    var step = opts.step || 1;
    var axisY = opts.axisY || 128;
    var padX = 44;
    var usableW = W - padX * 2;

    function toX(v) {
      return padX + ((v - minVal) / (maxVal - minVal)) * usableW;
    }

    var shades = [];
    var rays = [];
    var points = [];

    var api = {
      toX: toX,

      addInequality: function (val, dir, inclusive, tier, o) {
        o = o || {};
        var x = toX(val);
        var h = (tier || 1) === 1 ? 38 : 66;
        var topY = axisY - h;
        var endX = dir === 'left' ? padX - 14 : W - padX + 14;
        var col = o.color || ((tier || 1) === 1 ? '#2563eb' : '#d97706');

        // 严格遵循北师大八下教材：不等式解集折线末端不加箭头
        rays.push(
          '<polyline points="' + x.toFixed(1) + ',' + axisY + ' ' + x.toFixed(1) + ',' + topY + ' ' + endX.toFixed(1) + ',' + topY + '" fill="none" stroke="' + col + '" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>'
        );
        if (o.label) {
          rays.push(renderSvgMathDirect((x + endX) / 2, topY - 7, o.label, { size: 13.5, color: col, anchor: 'middle' }));
        }
        points.push(
          '<circle cx="' + x.toFixed(1) + '" cy="' + axisY + '" r="5" fill="' + (inclusive ? col : '#ffffff') + '" stroke="' + col + '" stroke-width="2.4"/>'
        );
        return api;
      },

      shadeIntersection: function (v1, v2, o) {
        o = o || {};
        var x1 = toX(Math.min(v1, v2));
        var x2 = toX(Math.max(v1, v2));
        var h = o.height || 38;
        shades.push(
          '<rect x="' + x1.toFixed(1) + '" y="' + (axisY - h) + '" width="' + Math.max(0, x2 - x1).toFixed(1) + '" height="' + h + '" fill="rgba(37, 99, 235, 0.16)"/>'
        );
        for (var sx = x1 + 8; sx < x2 - 4; sx += 10) {
          shades.push(
            '<line x1="' + sx.toFixed(1) + '" y1="' + axisY + '" x2="' + Math.min(x2, sx + 12).toFixed(1) + '" y2="' + (axisY - h) + '" stroke="rgba(37, 99, 235, 0.35)" stroke-width="1.4"/>'
          );
        }
        return api;
      },

      toSvg: function () {
        var ticks = [];
        for (var v = minVal; v <= maxVal + 1e-6; v += step) {
          var tx = toX(v);
          var isZero = Math.abs(v) < 1e-6;
          ticks.push(
            '<line x1="' + tx.toFixed(1) + '" y1="' + axisY + '" x2="' + tx.toFixed(1) + '" y2="' + (axisY - (isZero ? 9 : 6)) + '" stroke="#0f172a" stroke-width="' + (isZero ? '2' : '1.5') + '"/>' +
            '<text x="' + tx.toFixed(1) + '" y="' + (axisY + 22) + '" text-anchor="middle" font-family="\'Times New Roman\', serif" font-size="14.5" font-weight="' + (isZero ? '800' : '600') + '" fill="#0f172a">' + v + '</text>'
          );
        }
        var axisLine =
          '<line x1="' + (padX - 18) + '" y1="' + axisY + '" x2="' + (W - padX + 20) + '" y2="' + axisY + '" stroke="#0f172a" stroke-width="2.2"/>' +
          '<polygon points="' + (W - padX + 26) + ',' + axisY + ' ' + (W - padX + 15) + ',' + (axisY - 5) + ' ' + (W - padX + 15) + ',' + (axisY + 5) + '" fill="#0f172a"/>';

        return (
          '<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" height="100%" style="background:#ffffff;border-radius:12px;display:block;">' +
          shades.join('') +
          axisLine +
          ticks.join('') +
          rays.join('') +
          points.join('') +
          '</svg>'
        );
      }
    };
    return api;
  }
  window.createNumberLine = createNumberLine;

  function createBoxPlot(cfg) {
    cfg = cfg || {};
    var W = cfg.width || 580;
    var H = cfg.height || 205;
    var minV = Number(cfg.min);
    var q25 = Number(cfg.q25);
    var med = Number(cfg.median);
    var q75 = Number(cfg.q75);
    var maxV = Number(cfg.max);
    var padX = 56;
    var span = (maxV - minV) || 1;
    var dMin = minV - span * 0.08;
    var dMax = maxV + span * 0.08;

    function toX(v) {
      return padX + ((v - dMin) / (dMax - dMin)) * (W - padX * 2);
    }

    var cy = Math.round(H * 0.43);
    var boxH = cfg.boxHeight || 40;
    var capH = 26;

    var xMin = toX(minV), x25 = toX(q25), x50 = toX(med), x75 = toX(q75), xMax = toX(maxV);

    var svg = [];
    if (cfg.title) {
      var titleFmt = typeof window.svgAutoFormatText === 'function' ? window.svgAutoFormatText(cfg.title) : cfg.title;
      svg.push('<text x="' + (W / 2) + '" y="24" text-anchor="middle" font-size="14.5" font-weight="700" fill="#0f172a">' + titleFmt + '</text>');
    }

    svg.push(
      '<line x1="' + xMin.toFixed(1) + '" y1="' + cy + '" x2="' + x25.toFixed(1) + '" y2="' + cy + '" stroke="#0f172a" stroke-width="1.6" stroke-dasharray="4 3"/>' +
      '<line x1="' + x75.toFixed(1) + '" y1="' + cy + '" x2="' + xMax.toFixed(1) + '" y2="' + cy + '" stroke="#0f172a" stroke-width="1.6" stroke-dasharray="4 3"/>' +
      '<line x1="' + xMin.toFixed(1) + '" y1="' + (cy - capH / 2) + '" x2="' + xMin.toFixed(1) + '" y2="' + (cy + capH / 2) + '" stroke="#0f172a" stroke-width="1.8"/>' +
      '<line x1="' + xMax.toFixed(1) + '" y1="' + (cy - capH / 2) + '" x2="' + xMax.toFixed(1) + '" y2="' + (cy + capH / 2) + '" stroke="#0f172a" stroke-width="1.8"/>'
    );

    svg.push(
      '<rect x="' + x25.toFixed(1) + '" y="' + (cy - boxH / 2) + '" width="' + Math.max(2, x75 - x25).toFixed(1) + '" height="' + boxH + '" fill="' + MATH_THEME.colors.boxPlotFill + '" stroke="#0f172a" stroke-width="1.6"/>' +
      '<line x1="' + x50.toFixed(1) + '" y1="' + (cy - boxH / 2) + '" x2="' + x50.toFixed(1) + '" y2="' + (cy + boxH / 2) + '" stroke="#0f172a" stroke-width="2.2"/>'
    );

    var valPts = [
      { x: xMin, v: minV },
      { x: x25,  v: q25 },
      { x: x50,  v: med },
      { x: x75,  v: q75 },
      { x: xMax, v: maxV }
    ];
    for (var k = 1; k < valPts.length; k++) {
      if (valPts[k].x - valPts[k - 1].x < 34) {
        valPts[k - 1].dx = -8;
        valPts[k].dx = 8;
      }
    }
    valPts.forEach(function (vp) {
      svg.push(
        '<text x="' + (vp.x + (vp.dx || 0)).toFixed(1) + '" y="' + (cy - boxH / 2 - 10) + '" text-anchor="middle" font-family="\'Times New Roman\', serif" font-size="14.5" font-weight="700" fill="#0369a1">' + vp.v + '</text>'
      );
    });

    var row1Y = cy + boxH / 2 + 24;
    var row2Y = cy + boxH / 2 + 48;
    var shift25 = (x75 - x25 < 160) ? -26 : 0;
    var shift75 = (x75 - x25 < 160) ? 26 : 0;

    var labelItems = [
      { x: xMin, lx: xMin, y: row1Y, name: '最小值', leader: false },
      { x: x25,  lx: x25 + shift25, y: row1Y, name: '下四分位数m_{25}', leader: shift25 !== 0 },
      { x: x50,  lx: x50, y: row2Y, name: '中位数m_{50}', leader: true, color: '#0369a1' },
      { x: x75,  lx: x75 + shift75, y: row1Y, name: '上四分位数m_{75}', leader: shift75 !== 0 },
      { x: xMax, lx: xMax, y: row1Y, name: '最大值', leader: false }
    ];

    labelItems.forEach(function (item) {
      if (item.leader) {
        svg.push(
          '<line x1="' + item.x.toFixed(1) + '" y1="' + (cy + boxH / 2 + 2) + '" x2="' + item.lx.toFixed(1) + '" y2="' + (item.y - 13) + '" stroke="#94a3b8" stroke-width="1.2" stroke-dasharray="2 2"/>'
        );
      }
      var formattedName = typeof window.svgAutoFormatText === 'function' ? window.svgAutoFormatText(item.name) : item.name;
      svg.push(
        '<text x="' + item.lx.toFixed(1) + '" y="' + item.y + '" text-anchor="middle" font-size="12.5" font-weight="700" fill="' + (item.color || '#334155') + '">' +
        formattedName +
        '</text>'
      );
    });

    return (
      '<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" height="100%" style="background:#ffffff;border-radius:12px;display:block;">' +
      svg.join('') +
      '</svg>'
    );
  }
  window.createBoxPlot = createBoxPlot;

  function createProbTree(cfg, showHighlight) {
    cfg = cfg || {};
    var branches = cfg.branches || [];
    var W = cfg.width || 540;
    var H = cfg.height || 230;
    var totalLeaves = 0;
    branches.forEach(function (b) {
      totalLeaves += (b.children ? b.children.length : 1);
    });
    var slotW = (W - 60) / Math.max(1, totalLeaves);
    var rootX = W / 2, rootY = 26;
    var l1Y = 92, l2Y = 160, resY = 204;

    var lines = [];
    var nodes = [];
    var leafIdx = 0;

    nodes.push(
      '<rect x="' + (rootX - 34) + '" y="' + (rootY - 14) + '" width="68" height="26" rx="6" fill="#1e293b"/>' +
      '<text x="' + rootX + '" y="' + (rootY + 4) + '" text-anchor="middle" font-size="13.5" font-weight="700" fill="#ffffff">' + (cfg.root || '开始') + '</text>'
    );

    branches.forEach(function (b) {
      var ch = b.children || [];
      var startLeaf = leafIdx;
      var endLeaf = leafIdx + Math.max(1, ch.length) - 1;
      var bX = 30 + ((startLeaf + endLeaf) / 2 + 0.5) * slotW;

      lines.push('<line x1="' + rootX + '" y1="' + (rootY + 12) + '" x2="' + bX.toFixed(1) + '" y2="' + (l1Y - 14) + '" stroke="#64748b" stroke-width="1.8"/>');
      nodes.push(
        '<rect x="' + (bX - 22).toFixed(1) + '" y="' + (l1Y - 13) + '" width="44" height="26" rx="6" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.5"/>' +
        '<text x="' + bX.toFixed(1) + '" y="' + (l1Y + 5) + '" text-anchor="middle" font-family="\'Times New Roman\', serif" font-size="14" font-weight="700" fill="#1e40af">' + b.label + '</text>'
      );

      ch.forEach(function (c) {
        var cX = 30 + (leafIdx + 0.5) * slotW;
        var isHit = Boolean(showHighlight && c.match);
        var strokeCol = isHit ? '#dc2626' : '#94a3b8';
        var bgCol = isHit ? '#fef2f2' : '#f8fafc';
        var txtCol = isHit ? '#dc2626' : '#334155';

        lines.push(
          '<line x1="' + bX.toFixed(1) + '" y1="' + (l1Y + 13) + '" x2="' + cX.toFixed(1) + '" y2="' + (l2Y - 14) + '" stroke="' + strokeCol + '" stroke-width="' + (isHit ? '2.4' : '1.6') + '"/>'
        );
        nodes.push(
          '<rect x="' + (cX - 20).toFixed(1) + '" y="' + (l2Y - 13) + '" width="40" height="26" rx="6" fill="' + bgCol + '" stroke="' + strokeCol + '" stroke-width="1.6"/>' +
          '<text x="' + cX.toFixed(1) + '" y="' + (l2Y + 5) + '" text-anchor="middle" font-family="\'Times New Roman\', serif" font-size="13.5" font-weight="700" fill="' + txtCol + '">' + c.label + '</text>'
        );
        var outcomeTxt = c.outcome || '(' + b.label + ',' + c.label + ')';
        nodes.push(
          '<text x="' + cX.toFixed(1) + '" y="' + resY + '" text-anchor="middle" font-family="\'Times New Roman\', serif" font-size="13" font-weight="' + (isHit ? '800' : '600') + '" fill="' + txtCol + '">' + outcomeTxt + (isHit ? ' ✓' : '') + '</text>'
        );
        leafIdx++;
      });
    });

    return (
      '<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" height="100%" style="background:#ffffff;border-radius:10px;display:block;">' +
      '<text x="12" y="' + (l1Y + 5) + '" font-size="12.5" font-weight="700" fill="#64748b">第1步</text>' +
      '<text x="12" y="' + (l2Y + 5) + '" font-size="12.5" font-weight="700" fill="#64748b">第2步</text>' +
      '<text x="12" y="' + resY + '" font-size="12.5" font-weight="700" fill="#64748b">结果</text>' +
      lines.join('') +
      nodes.join('') +
      '</svg>'
    );
  }
  window.createProbTree = createProbTree;

})(typeof window !== 'undefined' ? window : this);

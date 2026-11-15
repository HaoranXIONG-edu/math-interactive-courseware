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
          '<span class="cw-arc" style="position:relative;display:inline-block;vertical-align:baseline;padding-top:0.20em;margin:0 1px;line-height:1;">' +
          '<svg viewBox="0 0 28 7" preserveAspectRatio="none" style="position:absolute;top:0.01em;left:0.05em;width:calc(100% + 0.02em);height:0.25em;overflow:visible;display:block;pointer-events:none;">' +
          '<path d="M 1 5.8 Q 14 0.2 27 5.8" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round"/>' +
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

    // 4.5 矢量几何符号替换：全等号 ≌、垂直号 ⊥、圆符号 ⊙（消除字体基线沉降与字形过细问题）
    var CONG_SVG =
      '<svg class="cw-cong" viewBox="0 0 16 15" style="width:0.84em;height:0.78em;vertical-align:-0.08em;margin:0 2px;overflow:visible;display:inline-block;">' +
      '<path d="M 1.4 4.5 C 3.2 0.6, 6.2 0.6, 8.0 4.5 C 9.8 8.4, 12.8 8.4, 14.6 4.5" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round"/>' +
      '<line x1="1.3" y1="9.8" x2="14.7" y2="9.8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>' +
      '<line x1="1.3" y1="13.0" x2="14.7" y2="13.0" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>' +
      '</svg>';
    s = s.replace(/≌/g, function () {
      return saveBlock(CONG_SVG);
    });
    var PERP_SVG =
      '<svg class="cw-perp" viewBox="0 0 14 14" style="width:0.74em;height:0.74em;vertical-align:0em;margin:0 0.08em;overflow:visible;display:inline-block;">' +
      '<line x1="7" y1="1.2" x2="7" y2="13.2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' +
      '<line x1="1.2" y1="13.2" x2="12.8" y2="13.2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' +
      '</svg>';
    s = s.replace(/⊥/g, function () {
      return saveBlock(PERP_SVG);
    });
    var ODOT_SVG =
      '<svg class="cw-odot" viewBox="0 0 15 15" style="width:0.78em;height:0.78em;vertical-align:-0.04em;margin:0 0.06em;overflow:visible;display:inline-block;">' +
      '<circle cx="7.5" cy="7.5" r="6.1" fill="none" stroke="currentColor" stroke-width="1.45"/>' +
      '<circle cx="7.5" cy="7.5" r="1.35" fill="currentColor"/>' +
      '</svg>';
    s = s.replace(/⊙/g, function () {
      return saveBlock(ODOT_SVG);
    });

    // 5. 矢量闭合根号 \sqrt{...}（绝对定位根号钩，确保被开方数与根号外数字基线 100% 齐平）
    var SQRT_HOOK_SVG =
      '<svg class="sqrt-hook" viewBox="0 0 12 20" preserveAspectRatio="none" style="position:absolute;left:0;top:0;width:0.56em;height:100%;display:block;overflow:visible;pointer-events:none;">' +
      '<path d="M 0.6 11.2 L 3.0 9.4 L 6.2 17.6 L 11.2 0.7 L 12.2 0.7" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>' +
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

        var oDx = o.originDx !== undefined ? o.originDx : -10;
        var oDy = o.originDy !== undefined ? o.originDy : 16;
        var oAnchor = o.originAnchor || 'start';
        topOverlays.push(
          '<text x="' + (ox + oDx).toFixed(1) + '" y="' + (oy + oDy).toFixed(1) + '" text-anchor="' + oAnchor + '" font-family="\'Times New Roman\', serif" font-style="italic" font-size="14" font-weight="700" fill="#334155" stroke="#ffffff" stroke-width="4.2" paint-order="stroke">O</text>' +
          '<text x="' + (W - pad.right + 8) + '" y="' + (oy + 18).toFixed(1) + '" text-anchor="end" font-family="\'Times New Roman\', serif" font-style="italic" font-size="15" font-weight="700" fill="#0f172a" stroke="#ffffff" stroke-width="4.2" paint-order="stroke">' + (o.xLabel || 'x') + '</text>' +
          '<text x="' + (ox + 12).toFixed(1) + '" y="' + (pad.top - 2) + '" font-family="\'Times New Roman\', serif" font-style="italic" font-size="15" font-weight="700" fill="#0f172a" stroke="#ffffff" stroke-width="4.2" paint-order="stroke">' + (o.yLabel || 'y') + '</text>'
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
       * 自动识别 yTop / yBot 中哪一个是直线 AB 上的交点 M、哪一个是抛物线上的动点 P，
       * 确保阴影三角形始终连接 △PAB（而非误连 △MAB）。
       */
      drawLeadVertical: function (xP, yTop, yBot, ptA, ptB, o) {
        o = o || {};
        var pTop = toPx([xP, yTop]);
        var pBot = toPx([xP, yBot]);
        var pP = pTop;
        var pM = pBot;
        if (ptA && ptB) {
          var pA = toPx(ptA), pB = toPx(ptB);
          var yOnAB = ptA[1] + ((xP - ptA[0]) / ((ptB[0] - ptA[0]) || 1)) * (ptB[1] - ptA[1]);
          if (Math.abs(yTop - yOnAB) < Math.abs(yBot - yOnAB)) {
            pM = pTop;
            pP = pBot;
          } else {
            pP = pTop;
            pM = pBot;
          }
          if (o.vertex === 'bottom') { pP = pBot; pM = pTop; }
          else if (o.vertex === 'top') { pP = pTop; pM = pBot; }
          parts.push(
            '<polygon points="' + pA[0].toFixed(1) + ',' + pA[1].toFixed(1) + ' ' + pP[0].toFixed(1) + ',' + pP[1].toFixed(1) + ' ' + pB[0].toFixed(1) + ',' + pB[1].toFixed(1) + '" fill="rgba(37,99,235,0.14)" stroke="#2563eb" stroke-width="1.8" stroke-linejoin="round"/>'
          );
        }
        parts.push(
          '<line x1="' + pTop[0].toFixed(1) + '" y1="' + pTop[1].toFixed(1) + '" x2="' + pBot[0].toFixed(1) + '" y2="' + pBot[1].toFixed(1) + '" stroke="#dc2626" stroke-width="2.4" stroke-dasharray="6 3"/>'
        );
        topOverlays.push(
          '<circle cx="' + pP[0].toFixed(1) + '" cy="' + pP[1].toFixed(1) + '" r="4.8" fill="#dc2626" stroke="#fff" stroke-width="1.6"/>' +
          '<circle cx="' + pM[0].toFixed(1) + '" cy="' + pM[1].toFixed(1) + '" r="4.5" fill="#d97706" stroke="#fff" stroke-width="1.6"/>'
        );
        if (o.label) {
          var lblX = pTop[0] + (o.labelDx !== undefined ? o.labelDx : 10);
          var lblY = o.labelY !== undefined ? toPx([xP, o.labelY])[1] : ((pTop[1] + pBot[1]) / 2 + (o.labelDy !== undefined ? o.labelDy : 5));
          topOverlays.push(
            renderSvgMathDirect(lblX, lblY, o.label, {
              size: o.fontSize || 15,
              color: '#dc2626',
              anchor: o.anchor || 'start'
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
          '<circle cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="' + (o.r || 4.5) + '" fill="' + (isOpen ? '#ffffff' : col) + '" stroke="' + (isOpen ? col : '#ffffff') + '" stroke-width="1.8"/>'
        );
        if (label) {
          var dx = o.dx !== undefined ? o.dx : 10;
          var dy = o.dy !== undefined ? o.dy : -8;
          topOverlays.push(
            renderSvgMathDirect(p[0] + dx, p[1] + dy, label, {
              size: o.fontSize || 14.5,
              color: col,
              anchor: o.anchor || 'start'
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


// =========================================================================
// 数学交互式课件 — 页面 UI 设计与教学交互组件库 (ui_components.js v2.2)
// 职责：专门负责课件的页面版式、2024版北师大教材栏目徽章、题干与拆页横幅、
//       零剧透步骤卡片（[导角]/[求解]）、填空/选择网格、步进描点表格、课堂总结矩阵
// 依赖：调用 window.MathFormula.render() 渲染卡片内部的数学公式
// =========================================================================

window.UI_THEME = {
    primary: '#2563eb',
    primaryLight: '#eff6ff',
    primaryBorder: '#bfdbfe',
    accentRed: '#dc2626',
    accentRedLight: '#fef2f2',
    accentOrange: '#d97706',
    accentOrangeLight: '#fffbeb',
    accentGreen: '#059669',
    accentGreenLight: '#ecfdf5',
    accentPurple: '#7c3aed',
    accentPurpleLight: '#f5f3ff',
    textMain: '#0f172a',
    textSub: '#475569',
    border: '#cbd5e1',
    bgCard: '#ffffff',
    bgSoft: '#f8fafc'
};

window._mathRender = function(text) {
    if (window.MathFormula && typeof window.MathFormula.render === 'function') {
        return window.MathFormula.render(text);
    }
    return String(text || '');
};

window.UI = {
    // 1. 文本与内联公式渲染包装
    text: function(rawText) {
        return window._mathRender(rawText);
    },

    // 2. 2024版北师大教材原生栏目徽章（尝试·思考 / 思考·交流 / 操作·思考 / 随堂练习 / 例题）
    bookBadge: function(type, customLabel) {
        const presets = {
            'try-think':   { label: '尝试·思考', bg: 'linear-gradient(135deg,#0284c7,#0369a1)', icon: '💡', border: '#bae6fd' },
            'try-share':   { label: '尝试·交流', bg: 'linear-gradient(135deg,#0d9488,#0f766e)', icon: '💬', border: '#99f6e4' },
            'think-share': { label: '思考·交流', bg: 'linear-gradient(135deg,#2563eb,#1d4ed8)', icon: '🔍', border: '#bfdbfe' },
            'do-think':    { label: '操作·思考', bg: 'linear-gradient(135deg,#7c3aed,#6d28d9)', icon: '📐', border: '#ddd6fe' },
            'observe':     { label: '观察·思考', bg: 'linear-gradient(135deg,#d97706,#b45309)', icon: '👀', border: '#fde68a' },
            'practice':    { label: '随堂练习',  bg: 'linear-gradient(135deg,#059669,#047857)', icon: '✏️', border: '#a7f3d0' },
            'example':     { label: customLabel || '例 1', bg: 'linear-gradient(135deg,#dc2626,#b91c1c)', icon: '📌', border: '#fecaca' }
        };
        const p = presets[type] || { label: customLabel || type, bg: 'linear-gradient(135deg,#2563eb,#1d4ed8)', icon: '📘', border: '#bfdbfe' };
        return `<span class="book-badge" style="display:inline-flex;align-items:center;gap:6px;padding:3px 12px;border-radius:999px;background:${p.bg};color:#fff;font-size:18px;font-weight:700;box-shadow:0 2px 6px rgba(15,23,42,0.12);border:1.5px solid ${p.border};vertical-align:middle;margin-right:8px;line-height:1.3;"><span>${p.icon}</span><span>${p.label}</span></span>`;
    },

    // 3. 零剧透填空横线（到达 revealStep 时自动切换红色高亮答案）
    blank: function(revealStep, answerLatex, minWidth) {
        const w = minWidth ? `min-width:${minWidth}px;` : '';
        return `<!--UI_START--><span class="blank" data-Empty="　　　" data-step="${revealStep}" style="${w}">${window._mathRender(answerLatex)}</span><!--UI_END-->`;
    },

    // 4. 选择题括号 + 响应式选项网格（支持 4 列单行或 2×2 双列）
    choices: function(options, revealStep, answerLetter, cols = 4) {
        const bracket = `<!--UI_START--><span class="choice-bracket" data-step="${revealStep}" data-ans="${answerLetter}">（<span class="choice-ans">　</span>）</span><!--UI_END-->`;
        const gridClass = cols === 2 ? 'options-grid cols-2' : 'options-grid';
        const items = options.map(opt => `<div class="option-item">${window._mathRender(opt)}</div>`).join('');
        return { bracket, grid: `<div class="${gridClass}">${items}</div>` };
    },

    // 5. 题干卡片与多小问列表（支持题源标签、徽章与子问题编号）
    stemCard: function(stemHtml, opts = {}) {
        const badgeHtml = opts.badge ? UI.bookBadge(opts.badge, opts.badgeLabel) : '';
        const sourceHtml = opts.source ? `<span class="tag-source" style="display:inline-block;padding:2px 8px;border-radius:6px;background:#e0f2fe;color:#0369a1;font-size:16px;font-weight:700;margin-right:8px;vertical-align:middle;">${opts.source}</span>` : '';
        const subItems = (opts.subQuestions || []).map((q, idx) =>
            `<div class="sub-q" style="margin-top:8px;padding-left:8px;font-size:22px;line-height:1.55;color:#1e293b;">${window._mathRender(`（${idx + 1}）${q}`)}</div>`
        ).join('');
        return `<div class="problem-stem" style="background:#ffffff;border:1.5px solid #cbd5e1;border-radius:14px;padding:14px 18px;box-shadow:0 2px 8px rgba(15,23,42,0.04);font-size:23px;line-height:1.6;color:#0f172a;">${badgeHtml}${sourceHtml}${window._mathRender(stemHtml)}${subItems}</div>`;
    },

    // 6. 拆页【前问已知】承接横幅（第(2)/(3)问独立成页时顶部展示）
    prevContext: function(summaryText, title = '前问已知') {
        return `<div class="prev-context-banner" style="display:flex;align-items:center;gap:10px;padding:8px 14px;margin-bottom:10px;border-radius:10px;background:linear-gradient(90deg,#eff6ff,#f8fafc);border-left:4px solid #2563eb;border-top:1px solid #dbeafe;border-right:1px solid #dbeafe;border-bottom:1px solid #dbeafe;font-size:19px;color:#1e3a8a;line-height:1.45;">
            <span style="background:#2563eb;color:#fff;font-weight:700;font-size:15px;padding:2px 8px;border-radius:6px;flex-shrink:0;">【${title}】</span>
            <span>${window._mathRender(summaryText)}</span>
        </div>`;
    },

    // 7. 波利亚两字动作标签步骤卡片（[导角] / [表边] / [列式] / [求解]）
    stepCard: function(tag, contentLatex, stepIndex, theme = 'blue') {
        const themes = {
            blue:   { bg: '#eff6ff', border: '#bfdbfe', tagBg: '#2563eb', text: '#1e3a8a' },
            orange: { bg: '#fffbeb', border: '#fde68a', tagBg: '#d97706', text: '#92400e' },
            green:  { bg: '#ecfdf5', border: '#a7f3d0', tagBg: '#059669', text: '#065f46' },
            purple: { bg: '#f5f3ff', border: '#ddd6fe', tagBg: '#7c3aed', text: '#5b21b6' },
            red:    { bg: '#fef2f2', border: '#fecaca', tagBg: '#dc2626', text: '#991b1b' }
        };
        const t = themes[theme] || themes.blue;
        return `<div class="step" data-step="${stepIndex}" style="display:flex;align-items:flex-start;gap:10px;padding:10px 14px;margin-top:8px;border-radius:12px;background:${t.bg};border:1.5px solid ${t.border};font-size:21px;line-height:1.55;color:#0f172a;">
            <span class="step-action-tag" style="display:inline-flex;align-items:center;justify-content:center;padding:2px 9px;border-radius:7px;background:${t.tagBg};color:#fff;font-size:17px;font-weight:700;flex-shrink:0;margin-top:2px;">[${tag}]</span>
            <div style="flex:1;">${window._mathRender(contentLatex)}</div>
        </div>`;
    },

    // 8. 步进描点表格（列表 → 描点 → 连线）
    stepTable: function(cfg) {
        const headers = cfg.headers || [];
        const rows = cfg.rows || [];
        const ths = headers.map((h, i) => `<th style="padding:7px 10px;border:1.5px solid #94a3b8;background:${i === 0 ? '#e2e8f0' : '#f8fafc'};font-weight:700;text-align:center;">${window._mathRender(String(h))}</th>`).join('');
        const trs = rows.map(row => {
            const tds = row.cells.map((cell, idx) => {
                if (idx === 0) {
                    return `<td style="padding:7px 10px;border:1.5px solid #94a3b8;background:#f1f5f9;font-weight:700;text-align:center;">${window._mathRender(String(cell))}</td>`;
                }
                const stepAttr = row.revealStep ? `class="blank" data-Empty="　" data-step="${row.revealStep}"` : '';
                return `<td style="padding:7px 10px;border:1.5px solid #94a3b8;text-align:center;"><span ${stepAttr}>${window._mathRender(String(cell))}</span></td>`;
            }).join('');
            return `<tr>${tds}</tr>`;
        }).join('');
        return `<table class="step-table" style="width:100%;border-collapse:collapse;font-size:20px;margin:8px 0;background:#fff;border-radius:8px;overflow:hidden;"><thead><tr>${ths}</tr></thead><tbody>${trs}</tbody></table>`;
    },

    // 9. 课堂方法总结矩阵卡片（支持 2×2 或 3 列网格）
    summaryGrid: function(cards, cols = 2) {
        const palette = [
            { bg: '#eff6ff', border: '#93c5fd', titleBg: '#2563eb', titleColor: '#ffffff' },
            { bg: '#fffbeb', border: '#fcd34d', titleBg: '#d97706', titleColor: '#ffffff' },
            { bg: '#ecfdf5', border: '#6ee7b7', titleBg: '#059669', titleColor: '#ffffff' },
            { bg: '#f5f3ff', border: '#c4b5fd', titleBg: '#7c3aed', titleColor: '#ffffff' }
        ];
        const items = (cards || []).map((c, idx) => {
            const p = palette[idx % palette.length];
            const stepAttr = c.step ? `class="step" data-step="${c.step}"` : '';
            return `<div ${stepAttr} style="background:${p.bg};border:1.8px solid ${p.border};border-radius:14px;padding:12px 15px;display:flex;flex-direction:column;gap:6px;">
                <div style="display:flex;align-items:center;flex-wrap:wrap;gap:6px 8px;">
                    <span style="background:${p.titleBg};color:${p.titleColor};font-size:15px;font-weight:700;padding:2px 10px;border-radius:999px;white-space:nowrap;flex-shrink:0;">${window._mathRender(c.badge || `要点 ${idx + 1}`)}</span>
                    <span style="font-size:18px;font-weight:700;color:#0f172a;line-height:1.3;">${window._mathRender(c.title || '')}</span>
                </div>
                <div style="font-size:18.5px;line-height:1.5;color:#1e293b;">${window._mathRender(c.body || '')}</div>
            </div>`;
        }).join('');
        return `<div style="display:grid;grid-template-columns:repeat(${cols},minmax(0,1fr));gap:12px;margin-top:8px;">${items}</div>`;
    },

    // 10. 几何/函数画板底栏参数滑块与交互按钮条
    controlBar: function(controls = []) {
        const items = controls.map(ctrl => {
            if (ctrl.type === 'slider') {
                return `<label style="display:inline-flex;align-items:center;gap:8px;font-size:18px;font-weight:700;color:#1e293b;background:#fff;padding:4px 12px;border-radius:999px;border:1.5px solid #cbd5e1;">
                    <span>${window._mathRender(ctrl.label || '参数')}</span>
                    <input type="range" min="${ctrl.min ?? -5}" max="${ctrl.max ?? 5}" step="${ctrl.step ?? 0.5}" value="${ctrl.value ?? 1}" style="accent-color:#2563eb;cursor:pointer;" oninput="${ctrl.onInput || ''}">
                    <span style="color:#2563eb;font-family:'Times New Roman',serif;min-width:28px;text-align:center;">${ctrl.value ?? 1}</span>
                </label>`;
            }
            return `<button type="button" onclick="${ctrl.onClick || ''}" style="padding:5px 14px;border-radius:999px;border:1.5px solid ${ctrl.primary ? '#1d4ed8' : '#cbd5e1'};background:${ctrl.primary ? '#2563eb' : '#ffffff'};color:${ctrl.primary ? '#ffffff' : '#1e293b'};font-size:17px;font-weight:700;cursor:pointer;">${window._mathRender(ctrl.label || '操作')}</button>`;
        }).join('');
        return `<div class="canvas-control-bar" style="display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:10px;padding:8px 12px;background:#f8fafc;border:1.5px solid #e2e8f0;border-radius:12px;margin-top:8px;">${items}</div>`;
    }
};


// =========================================================================================
// 数学交互式课件 — 第三库：课堂黑板批注与尺规几何作图组件库 (annotation_components.js)
// 包含：
//   1. Goodnotes / 希沃白板风格半透明毛玻璃悬浮批注坞 UI 与自包含样式 (InkAnnotationLayer.injectStyles)
//   2. 五大核心批注模态：
//      - cursor    : 手指触控穿透模式（保留批注栏，直接操作下层课件步骤与几何交互）
//      - pen       : 贝塞尔平滑压感画笔（支持实线批注与几何虚线辅助线切换）
//      - highlight : 半透明荧光笔（重点公式与题干条件高亮，不遮挡底层字迹）
//      - shape     : 8 种初中数学专属拖拽几何作图工具（平面直角坐标系 xOy / 带刻度数轴 /
//                    三角形 △ / 自动带直角标直角三角形 Rt△ / 智能吸附正圆 ○ / 矩形 □ /
//                    实虚辅助线段 / 推导指向箭头）
//      - eraser    : 大尺寸局部块状橡皮擦（destination-out 离屏合成擦除）
//   3. 双离屏缓冲高帧率 Canvas 2D 笔迹引擎（支持 getCoalescedEvents 增量极速渲染）
//   4. 分页独立笔迹存储（inkPages Map，每页 100 步 Undo/Redo 栈，翻页自动保存与恢复）
//   5. 可拖拽悬浮窗 (#inkDrag) 与一键折叠迷你悬浮球 (#inkBubble)
//   6. 独立交互式预览黑板组件 (InkAnnotationLayer.createInteractiveDemo)
// =========================================================================================

(function(global) {
  'use strict';

  const INK_STAGE_W = 1600;
  const INK_STAGE_H = 900;

  const TOOLS = [
    {
      id: 'cursor',
      label: '触控操作',
      tip: '手指触控操作课件（保留批注栏，穿透画布操作底层课件）',
      hasSubMenu: false,
      icon: '<svg viewBox="0 0 24 24"><path d="M18 11v-1a2 2 0 0 0-2-2a2 2 0 0 0-2 2"/><path d="M14 10V9a2 2 0 0 0-2-2a2 2 0 0 0-2 2v1"/><path d="M10 9.5V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v10"/><path d="M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-4c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/></svg>'
    },
    {
      id: 'pen',
      label: '画笔',
      tip: '画笔（点击展开粗细、虚线与调色二级菜单）',
      hasSubMenu: true,
      icon: '<svg viewBox="0 0 24 24"><path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>'
    },
    {
      id: 'highlight',
      label: '荧光笔',
      tip: '荧光笔（点击展开粗细与调色二级菜单）',
      hasSubMenu: true,
      icon: '<svg viewBox="0 0 24 24"><path d="m9 11-6 6v3h9l3-3"/><path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4"/><path d="m18 8 4 4"/></svg>'
    },
    {
      id: 'shape',
      label: '几何作图',
      tip: '几何作图工具（点击选择坐标系 / 数轴 / 三角形 / 圆等，在黑板上拖拽作图）',
      hasSubMenu: true,
      icon: '<svg viewBox="0 0 24 24"><path d="M10.5 3.5 3 16h15Z"/><circle cx="17" cy="15.5" r="4.5"/></svg>'
    },
    {
      id: 'eraser',
      label: '橡皮擦',
      tip: '局部块状橡皮擦',
      hasSubMenu: false,
      icon: '<svg viewBox="0 0 24 24"><path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"/><path d="M22 21H7"/><path d="m5 11 9 9"/></svg>'
    }
  ];

  const SHAPES = [
    {
      id: 'axes',
      label: '平面直角坐标系',
      tip: '平面直角坐标系 xOy（拖拽生成带正方向箭头、等距刻度与斜体 x, y, O）',
      icon: '<svg viewBox="0 0 24 24"><line x1="2" y1="12" x2="21" y2="12"/><polyline points="17 8.5 21 12 17 15.5"/><line x1="12" y1="22" x2="12" y2="3"/><polyline points="8.5 7 12 3 15.5 7"/></svg>'
    },
    {
      id: 'numberline',
      label: '数轴',
      tip: '数轴（带原点 0 与整数刻度，拖拽生成）',
      icon: '<svg viewBox="0 0 24 24"><line x1="2" y1="13" x2="21" y2="13"/><polyline points="17 9 21 13 17 17"/><line x1="6" y1="9.5" x2="6" y2="16.5"/><line x1="11.5" y1="8" x2="11.5" y2="18"/><line x1="16.5" y1="9.5" x2="16.5" y2="16.5"/></svg>'
    },
    {
      id: 'triangle',
      label: '三角形',
      tip: '三角形 △（拖拽生成）',
      icon: '<svg viewBox="0 0 24 24"><polygon points="12 4 3.5 19.5 20.5 19.5"/></svg>'
    },
    {
      id: 'rttriangle',
      label: '直角三角形',
      tip: '直角三角形 Rt△（自动带标准直角符号 ∟）',
      icon: '<svg viewBox="0 0 24 24"><polygon points="4.5 4.5 4.5 19.5 20 19.5"/><polyline points="4.5 15 9 15 9 19.5"/></svg>'
    },
    {
      id: 'circle',
      label: '圆 / 椭圆',
      tip: '圆 / 椭圆 ○（接近等宽时自动吸附为正圆）',
      icon: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/></svg>'
    },
    {
      id: 'rect',
      label: '矩形',
      tip: '矩形 / 正方形 □（拖拽生成）',
      icon: '<svg viewBox="0 0 24 24"><rect x="4" y="5.5" width="16" height="13" rx="1.5"/></svg>'
    },
    {
      id: 'line',
      label: '直线段 / 辅助线',
      tip: '直线段 / 辅助线（配合虚线开关可画波利亚虚线辅助线）',
      icon: '<svg viewBox="0 0 24 24"><line x1="4" y1="19" x2="20" y2="5"/><circle cx="4" cy="19" r="1.6" fill="currentColor"/><circle cx="20" cy="5" r="1.6" fill="currentColor"/></svg>'
    },
    {
      id: 'arrow',
      label: '指向箭头',
      tip: '射线 / 推导指向箭头',
      icon: '<svg viewBox="0 0 24 24"><line x1="4" y1="19" x2="20" y2="5"/><polyline points="13 5 20 5 20 12"/></svg>'
    }
  ];

  const STROKE_SIZES = [
    { size: 2.5, label: '细线条 (2.5px)', strokeW: 2.0 },
    { size: 5.5, label: '标准线条 (5.5px)', strokeW: 4.6, defaultSelected: true },
    { size: 11,  label: '粗线条 (11px)',  strokeW: 8.4 }
  ];

  const COLORS = [
    { hex: '#d94040', label: '批注红' },
    { hex: '#384d8f', label: '波利亚靛蓝' },
    { hex: '#118575', label: '解析几何绿' },
    { hex: '#252b37', label: '板书深黑' },
    { hex: '#e29a19', label: '重点荧光橙' },
    { hex: '#9652ae', label: '辅助线紫' }
  ];

  const ACTION_ICONS = {
    undo:  ['撤销 (Ctrl+Z)', '<svg viewBox="0 0 24 24"><path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11"/></svg>'],
    redo:  ['重做 (Ctrl+Y)', '<svg viewBox="0 0 24 24"><path d="m15 14 5-5-5-5"/><path d="M20 9H9.5A5.5 5.5 0 0 0 4 14.5v0A5.5 5.5 0 0 0 9.5 20H13"/></svg>'],
    clear: ['清空本页批注', '<svg viewBox="0 0 24 24"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>'],
    fold:  ['收起为悬浮球', '<svg viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/></svg>'],
    exit:  ['退出批注', '<svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'],
    caret: '<svg class="ink-tool-caret" viewBox="0 0 12 12" fill="none" stroke="currentColor"><path d="M2.5 4.5 6 8l3.5-3.5"/></svg><span class="ink-tool-color-bar"></span>',
    plus:  '<svg viewBox="0 0 24 24" fill="none"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
    dash:  '<svg viewBox="0 0 32 16"><line x1="2" y1="8" x2="8" y2="8" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"/><line x1="13" y1="8" x2="19" y2="8" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"/><line x1="24" y1="8" x2="30" y2="8" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"/></svg>',
    bubble:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 16-1 4 4-1L20 7l-3-3L5 16Zm10-10 3 3M5 16l3 3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>'
  };

  function createDefaultProfiles() {
    return {
      pen:       { color: '#d94040', size: 5.5, dashed: false },
      highlight: { color: '#e29a19', size: 5.5, dashed: false },
      shape:     { color: '#384d8f', size: 2.5, dashed: false, shapeType: 'axes' }
    };
  }

  // ================= 1. 核心 2D Canvas 几何作图与贝塞尔笔迹渲染器 =================
  function drawInkArrowHead(c, tx, ty, ang, sz) {
    c.save();
    c.setLineDash([]);
    c.beginPath();
    c.moveTo(tx, ty);
    c.lineTo(tx - sz * Math.cos(ang - Math.PI / 6), ty - sz * Math.sin(ang - Math.PI / 6));
    c.moveTo(tx, ty);
    c.lineTo(tx - sz * Math.cos(ang + Math.PI / 6), ty - sz * Math.sin(ang + Math.PI / 6));
    c.stroke();
    c.restore();
  }

  function drawHaloText(c, txt, x, y, haloWidth) {
    c.save();
    c.lineJoin = 'round';
    c.lineWidth = haloWidth || 4;
    c.strokeStyle = 'rgba(255, 255, 255, 0.92)';
    c.strokeText(txt, x, y);
    c.fillText(txt, x, y);
    c.restore();
  }

  function normalizeShapePoints(stroke, skipInitBounds) {
    const pts = stroke.points;
    if (!pts || !pts.length) return pts;
    const p1 = pts[0];
    const p2 = pts[pts.length - 1];
    let x1 = p1.x, y1 = p1.y, x2 = p2.x, y2 = p2.y;
    const st = stroke.shapeType || 'axes';
    const dist = Math.hypot(x2 - x1, y2 - y1);

    if (st === 'numberline') {
      if (dist < 18) {
        return [{ x: x1 - 180, y: y1, w: p1.w }, { x: x1 + 180, y: y1, w: p1.w }];
      }
      // 锁死纵坐标为起笔点 y1，彻底杜绝拖拽数轴时上下漂移
      return [{ x: x1, y: y1, w: p1.w }, { x: x2, y: y1, w: p1.w }];
    }

    if (st === 'axes') {
      if (dist < 20) {
        x2 = x1 + 140;
        y2 = y1 + 110;
        x1 = x1 - 140;
        y1 = y1 - 110;
      } else {
        let dx = x2 - x1, dy = y2 - y1;
        const aw = Math.abs(dx), ah = Math.abs(dy);
        if (aw > 40 && ah > 40 && Math.abs(aw - ah) / Math.max(aw, ah) < 0.14) {
          const sq = Math.round((aw + ah) / 2);
          x2 = x1 + (dx >= 0 ? sq : -sq);
          y2 = y1 + (dy >= 0 ? sq : -sq);
        }
      }
      if (!skipInitBounds && !stroke.axesBounds) {
        const minX = Math.min(x1, x2), maxX = Math.max(x1, x2);
        const minY = Math.min(y1, y2), maxY = Math.max(y1, y2);
        stroke.axesBounds = {
          ox: Math.round((minX + maxX) / 2),
          oy: Math.round((minY + maxY) / 2),
          minX: Math.round(minX),
          maxX: Math.round(maxX),
          minY: Math.round(minY),
          maxY: Math.round(maxY)
        };
      }
      return [{ x: x1, y: y1, w: p1.w }, { x: x2, y: y2, w: p1.w }];
    }

    return [p1, p2];
  }

  function getAxesBounds(stroke) {
    if (stroke && stroke.axesBounds && typeof stroke.axesBounds.ox === 'number') {
      return stroke.axesBounds;
    }
    const norm = normalizeShapePoints(stroke, true) || [];
    if (!norm.length) return { ox: 0, oy: 0, minX: -140, maxX: 140, minY: -110, maxY: 110 };
    const p1 = norm[0], p2 = norm[norm.length - 1];
    const minX = Math.min(p1.x, p2.x), maxX = Math.max(p1.x, p2.x);
    const minY = Math.min(p1.y, p2.y), maxY = Math.max(p1.y, p2.y);
    return {
      ox: (minX + maxX) / 2,
      oy: (minY + maxY) / 2,
      minX,
      maxX,
      minY,
      maxY
    };
  }

  function cloneStroke(s) {
    if (!s) return s;
    return {
      ...s,
      points: Array.isArray(s.points) ? s.points.map(p => ({ ...p })) : [],
      axesBounds: s.axesBounds ? { ...s.axesBounds } : undefined
    };
  }

  function cloneStrokes(arr) {
    return Array.isArray(arr) ? arr.map(cloneStroke) : [];
  }

  function getAxesHandles(stroke) {
    if (!stroke || stroke.tool !== 'shape' || (stroke.shapeType || 'axes') !== 'axes') return [];
    const b = getAxesBounds(stroke);
    return [
      { id: 'posX',   x: b.maxX + 7, y: b.oy,       axis: 'x', dir: '+x', cursor: 'ew-resize', label: '+x 半轴' },
      { id: 'negX',   x: b.minX - 7, y: b.oy,       axis: 'x', dir: '-x', cursor: 'ew-resize', label: '-x 半轴' },
      { id: 'posY',   x: b.ox,       y: b.minY - 7, axis: 'y', dir: '+y', cursor: 'ns-resize', label: '+y 半轴' },
      { id: 'negY',   x: b.ox,       y: b.maxY + 7, axis: 'y', dir: '-y', cursor: 'ns-resize', label: '-y 半轴' },
      { id: 'origin', x: b.ox,       y: b.oy,       axis: 'o', dir: 'O',  cursor: 'move',      label: '平移坐标系' }
    ];
  }

  function hitTestAxesHandle(strokes, pt, preferredIdx, hitRadius = 18) {
    if (!Array.isArray(strokes) || !pt) return null;
    const indices = [];
    if (typeof preferredIdx === 'number' && preferredIdx >= 0 && preferredIdx < strokes.length) {
      indices.push(preferredIdx);
    }
    for (let i = strokes.length - 1; i >= 0; i--) {
      if (i !== preferredIdx) indices.push(i);
    }
    for (const idx of indices) {
      const s = strokes[idx];
      if (!s || s.tool !== 'shape' || (s.shapeType || 'axes') !== 'axes') continue;
      const handles = getAxesHandles(s);
      for (const h of handles) {
        if (Math.hypot(pt.x - h.x, pt.y - h.y) <= hitRadius) {
          return { strokeIndex: idx, stroke: s, handle: h };
        }
      }
    }
    return null;
  }

  function hitTestAxesStroke(strokes, pt, tolerance = 12) {
    if (!Array.isArray(strokes) || !pt) return -1;
    for (let i = strokes.length - 1; i >= 0; i--) {
      const s = strokes[i];
      if (!s || s.tool !== 'shape' || (s.shapeType || 'axes') !== 'axes') continue;
      const b = getAxesBounds(s);
      const onX = pt.x >= b.minX - tolerance && pt.x <= b.maxX + tolerance && Math.abs(pt.y - b.oy) <= tolerance;
      const onY = pt.y >= b.minY - tolerance && pt.y <= b.maxY + tolerance && Math.abs(pt.x - b.ox) <= tolerance;
      if (onX || onY) return i;
    }
    return -1;
  }

  function applyAxesHandleDrag(stroke, handleId, pt, startBounds, startPt) {
    if (!stroke || !startBounds || !pt) return;
    const b = { ...startBounds };
    if (handleId === 'posX') {
      b.maxX = Math.round(Math.max(b.ox + 36, pt.x));
    } else if (handleId === 'negX') {
      b.minX = Math.round(Math.min(b.ox - 12, pt.x));
    } else if (handleId === 'posY') {
      b.minY = Math.round(Math.min(b.oy - 36, pt.y));
    } else if (handleId === 'negY') {
      b.maxY = Math.round(Math.max(b.oy + 12, pt.y));
    } else if (handleId === 'origin' && startPt) {
      const dx = Math.round(pt.x - startPt.x);
      const dy = Math.round(pt.y - startPt.y);
      b.ox += dx;
      b.oy += dy;
      b.minX += dx;
      b.maxX += dx;
      b.minY += dy;
      b.maxY += dy;
    }
    stroke.axesBounds = b;
    const w = (stroke.points && stroke.points[0] && stroke.points[0].w) || stroke.size || 2.5;
    stroke.points = [
      { x: b.minX, y: b.minY, w },
      { x: b.maxX, y: b.maxY, w }
    ];
  }

  function drawAxesHandles(target, stroke, dpr, activeHandleId) {
    if (!target || !stroke || stroke.tool !== 'shape' || (stroke.shapeType || 'axes') !== 'axes') return;
    const b = getAxesBounds(stroke);
    const handles = getAxesHandles(stroke);
    const step = 44;
    target.save();
    target.setTransform(dpr, 0, 0, dpr, 0, 0);

    // 虚线外框提示当前处于可单独调节半轴长度状态
    target.strokeStyle = 'rgba(37, 99, 235, 0.28)';
    target.lineWidth = 1.3;
    target.setLineDash([5, 4]);
    target.strokeRect(b.minX, b.minY, b.maxX - b.minX, b.maxY - b.minY);
    target.setLineDash([]);

    handles.forEach(h => {
      const isAct = h.id === activeHandleId;
      if (h.id === 'origin') {
        target.beginPath();
        target.arc(h.x, h.y, isAct ? 7 : 5.5, 0, Math.PI * 2);
        target.fillStyle = isAct ? '#dbeafe' : 'rgba(255, 255, 255, 0.92)';
        target.fill();
        target.lineWidth = 2;
        target.strokeStyle = isAct ? '#1d4ed8' : '#3b82f6';
        target.stroke();
        return;
      }

      const r = isAct ? 9 : 7.5;
      // 外发光圈
      target.beginPath();
      target.arc(h.x, h.y, r + 3.5, 0, Math.PI * 2);
      target.fillStyle = isAct ? 'rgba(217, 119, 6, 0.22)' : 'rgba(37, 99, 235, 0.16)';
      target.fill();

      // 手柄圆盘
      target.beginPath();
      target.arc(h.x, h.y, r, 0, Math.PI * 2);
      target.fillStyle = isAct ? '#fef3c7' : '#ffffff';
      target.fill();
      target.lineWidth = 2.2;
      target.strokeStyle = isAct ? '#d97706' : '#2563eb';
      target.stroke();

      // 手柄内部双向微箭头指示（水平 ↔ 或 垂直 ↕）
      target.beginPath();
      target.lineWidth = 1.6;
      target.strokeStyle = isAct ? '#b45309' : '#1d4ed8';
      if (h.axis === 'x') {
        target.moveTo(h.x - 3.8, h.y);
        target.lineTo(h.x + 3.8, h.y);
        target.moveTo(h.x - 1.8, h.y - 2.2);
        target.lineTo(h.x - 4.0, h.y);
        target.lineTo(h.x - 1.8, h.y + 2.2);
        target.moveTo(h.x + 1.8, h.y - 2.2);
        target.lineTo(h.x + 4.0, h.y);
        target.lineTo(h.x + 1.8, h.y + 2.2);
      } else {
        target.moveTo(h.x, h.y - 3.8);
        target.lineTo(h.x, h.y + 3.8);
        target.moveTo(h.x - 2.2, h.y - 1.8);
        target.lineTo(h.x, h.y - 4.0);
        target.lineTo(h.x + 2.2, h.y - 1.8);
        target.moveTo(h.x - 2.2, h.y + 1.8);
        target.lineTo(h.x, h.y + 4.0);
        target.lineTo(h.x + 2.2, h.y + 1.8);
      }
      target.stroke();

      // 拖拽时实时显示该半轴当前的刻度单位长度
      if (isAct) {
        let pxLen = 0;
        let reserve = 16;
        if (h.id === 'posX') { pxLen = b.maxX - b.ox; reserve = 24; }
        else if (h.id === 'negX') { pxLen = b.ox - b.minX; reserve = 16; }
        else if (h.id === 'posY') { pxLen = b.oy - b.minY; reserve = 24; }
        else if (h.id === 'negY') { pxLen = b.maxY - b.oy; reserve = 16; }
        const units = Math.max(0, Math.floor((pxLen - reserve) / step));
        const tipText = `${h.dir}半轴: ${units} 单位`;
        target.font = '700 13px "Songti SC", "SimSun", sans-serif';
        target.textAlign = 'center';
        target.textBaseline = 'bottom';
        drawHaloText(target, tipText, h.x, h.y - 13, 4);
      }
    });

    target.restore();
  }

  function traceShapePath(c, stroke, w, dashed, isPreview) {
    const pts = stroke.points;
    if (!pts || !pts.length) return;
    const norm = normalizeShapePoints(stroke);
    const p1 = norm[0], p2 = norm[norm.length - 1];
    const x1 = p1.x, y1 = p1.y, x2 = p2.x, y2 = p2.y;
    const dx = x2 - x1, dy = y2 - y1, dist = Math.hypot(dx, dy);
    const st = stroke.shapeType || 'axes';
    c.lineCap = 'round';
    c.lineJoin = 'round';
    c.lineWidth = w;
    c.setLineDash(dashed ? [w * 2.2, w * 1.8] : []);

    if (st === 'line') {
      c.beginPath();
      c.moveTo(x1, y1);
      c.lineTo(x2, y2);
      c.stroke();
    } else if (st === 'arrow') {
      c.beginPath();
      c.moveTo(x1, y1);
      c.lineTo(x2, y2);
      c.stroke();
      if (dist > 8) drawInkArrowHead(c, x2, y2, Math.atan2(dy, dx), Math.max(13, w * 2.8));
    } else if (st === 'triangle') {
      c.beginPath();
      c.moveTo((x1 + x2) / 2, y1);
      c.lineTo(x1, y2);
      c.lineTo(x2, y2);
      c.closePath();
      c.stroke();
    } else if (st === 'rttriangle') {
      c.beginPath();
      c.moveTo(x1, y1);
      c.lineTo(x1, y2);
      c.lineTo(x2, y2);
      c.closePath();
      c.stroke();
      if (Math.abs(dx) > 24 && Math.abs(dy) > 24) {
        const sq = Math.min(18, Math.abs(dx) * 0.26, Math.abs(dy) * 0.26);
        const sx = dx >= 0 ? 1 : -1;
        const sy = dy >= 0 ? -1 : 1;
        c.save();
        c.setLineDash([]);
        c.lineWidth = Math.max(2, w * 0.68);
        c.beginPath();
        c.moveTo(x1 + sx * sq, y2);
        c.lineTo(x1 + sx * sq, y2 + sy * sq);
        c.lineTo(x1, y2 + sy * sq);
        c.stroke();
        c.restore();
      }
    } else if (st === 'rect') {
      c.beginPath();
      c.rect(Math.min(x1, x2), Math.min(y1, y2), Math.abs(dx), Math.abs(dy));
      c.stroke();
    } else if (st === 'circle') {
      const cx = (x1 + x2) / 2, cy = (y1 + y2) / 2;
      let rx = Math.abs(dx) / 2, ry = Math.abs(dy) / 2;
      if (rx > 8 && ry > 8 && Math.abs(rx - ry) / Math.max(rx, ry) < 0.22) {
        rx = ry = (rx + ry) / 2;
      }
      c.beginPath();
      c.ellipse(cx, cy, Math.max(1, rx), Math.max(1, ry), 0, 0, Math.PI * 2);
      c.stroke();
    } else if (st === 'numberline') {
      const minX = Math.min(x1, x2), maxX = Math.max(x1, x2), ny = y1, len = maxX - minX;
      if (isPreview && len > 8) {
        const midPx = (minX + maxX) / 2;
        c.save();
        c.strokeStyle = 'rgba(37, 99, 235, 0.35)';
        c.lineWidth = 1.4;
        c.setLineDash([4, 4]);
        c.beginPath();
        c.moveTo(midPx, ny - 26);
        c.lineTo(midPx, ny + 36);
        c.stroke();
        c.fillStyle = 'rgba(37, 99, 235, 0.75)';
        c.beginPath();
        c.arc(minX, ny, 4, 0, Math.PI * 2);
        c.arc(maxX, ny, 4, 0, Math.PI * 2);
        c.fill();
        c.restore();
      }
      c.beginPath();
      c.moveTo(minX, ny);
      c.lineTo(maxX, ny);
      c.stroke();
      if (len > 24) {
        drawInkArrowHead(c, maxX, ny, 0, Math.max(13, w * 2.6));
        const midX = (minX + maxX) / 2;
        // 固定 48px 单位刻度步长，彻底消除拖拽时数字来回缩放跳动
        const step = 48;
        c.save();
        c.setLineDash([]);
        c.font = '700 18px "Times New Roman", serif';
        c.textAlign = 'center';
        c.textBaseline = 'top';
        const maxK = Math.floor((len / 2 - 26) / step);
        for (let k = -maxK; k <= maxK; k++) {
          const tx = midX + k * step, th = k === 0 ? 10 : 6;
          c.lineWidth = k === 0 ? Math.max(2.4, w * 0.9) : Math.max(1.8, w * 0.72);
          c.beginPath();
          c.moveTo(tx, ny - th);
          c.lineTo(tx, ny + th);
          c.stroke();
          if (maxK <= 6 || k === 0 || k % 2 === 0) {
            drawHaloText(c, String(k), tx, ny + 12, 4);
          }
        }
        c.restore();
      }
    } else if (st === 'axes') {
      const b = getAxesBounds(stroke);
      const minX = b.minX, maxX = b.maxX, minY = b.minY, maxY = b.maxY;
      const ox = b.ox, oy = b.oy;
      const wSpan = maxX - minX, hSpan = maxY - minY;
      const lenPosX = Math.max(0, maxX - ox), lenNegX = Math.max(0, ox - minX);
      const lenPosY = Math.max(0, oy - minY), lenNegY = Math.max(0, maxY - oy);
      // 固定 44px 单位步长，确保单侧拉伸半轴时格点与刻度比例恒定不抖动
      const step = 44;
      const kxPos = Math.floor(Math.max(0, lenPosX - 24) / step);
      const kxNeg = Math.floor(Math.max(0, lenNegX - 16) / step);
      const kyPos = Math.floor(Math.max(0, lenPosY - 24) / step);
      const kyNeg = Math.floor(Math.max(0, lenNegY - 16) / step);

      if (isPreview && wSpan > 20 && hSpan > 20) {
        c.save();
        c.strokeStyle = 'rgba(37, 99, 235, 0.36)';
        c.lineWidth = 1.4;
        c.setLineDash([5, 4]);
        c.strokeRect(minX, minY, wSpan, hSpan);
        c.beginPath();
        c.arc(ox, oy, 5, 0, Math.PI * 2);
        c.stroke();
        c.restore();
      }

      // 淡雅单位辅助方格网（按各半轴实际长度独立生成，方便描点与画函数图像）
      if (wSpan > 60 && hSpan > 60) {
        c.save();
        c.globalAlpha *= 0.15;
        c.lineWidth = 1;
        c.setLineDash([3, 3]);
        for (let k = -kxNeg; k <= kxPos; k++) {
          if (k === 0) continue;
          const gx = ox + k * step;
          c.beginPath();
          c.moveTo(gx, minY + 12);
          c.lineTo(gx, maxY - 8);
          c.stroke();
        }
        for (let k = -kyNeg; k <= kyPos; k++) {
          if (k === 0) continue;
          const gy = oy - k * step;
          c.beginPath();
          c.moveTo(minX + 8, gy);
          c.lineTo(maxX - 12, gy);
          c.stroke();
        }
        c.restore();
      }

      c.beginPath();
      c.moveTo(minX, oy);
      c.lineTo(maxX, oy);
      c.moveTo(ox, maxY);
      c.lineTo(ox, minY);
      c.stroke();
      if (wSpan > 30 && hSpan > 30) {
        const arrSz = Math.max(12, w * 2.5);
        drawInkArrowHead(c, maxX, oy, 0, arrSz);
        drawInkArrowHead(c, ox, minY, -Math.PI / 2, arrSz);
        c.save();
        c.setLineDash([]);
        c.lineWidth = Math.max(1.8, w * 0.65);
        const maxKx = Math.max(kxNeg, kxPos);
        c.font = '600 14px "Times New Roman", serif';
        c.textAlign = 'center';
        c.textBaseline = 'top';
        for (let k = -kxNeg; k <= kxPos; k++) {
          if (k === 0) continue;
          const tx = ox + k * step;
          c.beginPath();
          c.moveTo(tx, oy - 5);
          c.lineTo(tx, oy + 5);
          c.stroke();
          if (Math.abs(k) === 1 || (maxKx <= 5 && k !== 0) || k % 2 === 0) {
            drawHaloText(c, String(k), tx, oy + 8, 3.5);
          }
        }
        const maxKy = Math.max(kyNeg, kyPos);
        c.textAlign = 'right';
        c.textBaseline = 'middle';
        for (let k = -kyNeg; k <= kyPos; k++) {
          if (k === 0) continue;
          const ty = oy - k * step;
          c.beginPath();
          c.moveTo(ox - 5, ty);
          c.lineTo(ox + 5, ty);
          c.stroke();
          if (Math.abs(k) === 1 || (maxKy <= 5 && k !== 0) || k % 2 === 0) {
            drawHaloText(c, String(k), ox - 8, ty, 3.5);
          }
        }
        c.font = 'italic bold 21px "Times New Roman", serif';
        c.textAlign = 'left';
        c.textBaseline = 'top';
        drawHaloText(c, 'x', maxX - 18, oy + 10, 4);
        drawHaloText(c, 'y', ox + 12, minY + 2, 4);
        c.textAlign = 'right';
        drawHaloText(c, 'O', ox - 8, oy + 6, 4);
        c.restore();
      }
    }
    c.setLineDash([]);
  }

  function traceBezierPath(c, pts, w, dashed) {
    c.lineCap = 'round';
    c.lineJoin = 'round';
    c.lineWidth = w;
    c.setLineDash(dashed ? [w * 2.2, w * 1.8] : []);
    if (pts.length === 1) {
      c.beginPath();
      c.arc(pts[0].x, pts[0].y, w / 2, 0, Math.PI * 2);
      c.fill();
      return;
    }
    c.beginPath();
    c.moveTo(pts[0].x, pts[0].y);
    if (pts.length === 2) {
      c.lineTo(pts[1].x, pts[1].y);
    } else {
      for (let i = 1; i < pts.length - 1; i++) {
        const mx = (pts[i].x + pts[i + 1].x) / 2;
        const my = (pts[i].y + pts[i + 1].y) / 2;
        c.quadraticCurveTo(pts[i].x, pts[i].y, mx, my);
      }
      const last = pts[pts.length - 1];
      c.lineTo(last.x, last.y);
    }
    c.stroke();
    c.setLineDash([]);
  }

  function paintStrokeOnContext(target, stroke, strokeCanvas, strokeCtx, dpr, isPreview) {
    const pts = stroke.points;
    if (!pts || !pts.length) return;
    const w = pts[0].w || (stroke.tool === 'eraser' ? stroke.size * 5.2 : stroke.tool === 'highlight' ? stroke.size * 4.2 : stroke.size);
    const isDash = Boolean(stroke.dashed && stroke.tool !== 'eraser');
    if (stroke.tool === 'shape') {
      target.save();
      target.setTransform(dpr, 0, 0, dpr, 0, 0);
      target.globalAlpha = 1;
      target.globalCompositeOperation = 'source-over';
      target.strokeStyle = stroke.color;
      target.fillStyle = stroke.color;
      traceShapePath(target, stroke, w, isDash, isPreview);
      target.restore();
      return;
    }
    if (stroke.tool === 'pen' || stroke.tool === 'marker') {
      target.save();
      target.setTransform(dpr, 0, 0, dpr, 0, 0);
      target.globalAlpha = 1;
      target.globalCompositeOperation = 'source-over';
      target.strokeStyle = stroke.color;
      target.fillStyle = stroke.color;
      traceBezierPath(target, pts, w, isDash);
      target.restore();
      return;
    }
    if (strokeCanvas && strokeCtx) {
      strokeCtx.setTransform(1, 0, 0, 1, 0, 0);
      strokeCtx.clearRect(0, 0, strokeCanvas.width, strokeCanvas.height);
      strokeCtx.save();
      strokeCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      strokeCtx.strokeStyle = stroke.color;
      strokeCtx.fillStyle = stroke.color;
      traceBezierPath(strokeCtx, pts, w, isDash);
      strokeCtx.restore();
      target.save();
      target.setTransform(1, 0, 0, 1, 0, 0);
      target.globalAlpha = stroke.tool === 'highlight' ? 0.34 : 1;
      target.globalCompositeOperation = stroke.tool === 'eraser' ? 'destination-out' : 'source-over';
      target.drawImage(strokeCanvas, 0, 0);
      target.restore();
    } else {
      target.save();
      target.setTransform(dpr, 0, 0, dpr, 0, 0);
      target.globalAlpha = stroke.tool === 'highlight' ? 0.34 : 1;
      target.globalCompositeOperation = stroke.tool === 'eraser' ? 'destination-out' : 'source-over';
      target.strokeStyle = stroke.color;
      target.fillStyle = stroke.color;
      traceBezierPath(target, pts, w, isDash);
      target.restore();
    }
  }

  // ================= 2. 批注工具栏 DOM 统一装配器（消除散落补丁） =================
  function upgradeToolbarDOM(tb) {
    if (!tb || tb.dataset.iconified === '1') return;
    tb.dataset.iconified = '1';
    tb.classList.add('ink-floating', 'ink-simple');

    // 1) 顶部拖拽柄与折叠/退出按钮
    if (!tb.querySelector('.ink-float-head')) {
      const head = document.createElement('div');
      head.className = 'ink-float-head';
      head.innerHTML =
        '<div id="inkDrag" title="拖动批注窗" aria-label="拖动批注窗" tabindex="0"><span class="ink-grip" aria-hidden="true">⠿</span><span>课堂批注</span></div>' +
        '<button id="inkFold" type="button" title="收起为悬浮球" aria-label="收起为悬浮球">' + ACTION_ICONS.fold[1] + '</button>' +
        '<button id="inkExit" type="button" title="退出批注" aria-label="退出批注">' + ACTION_ICONS.exit[1] + '</button>';
      tb.prepend(head);
    }

    // 2) 一级工具按钮区（cursor / pen / highlight / shape / eraser）
    const toolGrp = tb.querySelector('.ink-group');
    if (toolGrp) {
      if (!toolGrp.querySelector('[data-ink-tool="cursor"]')) {
        const curBtn = document.createElement('button');
        curBtn.type = 'button';
        curBtn.dataset.inkTool = 'cursor';
        toolGrp.prepend(curBtn);
      }
      if (!toolGrp.querySelector('[data-ink-tool="shape"]')) {
        const shapeBtn = document.createElement('button');
        shapeBtn.type = 'button';
        shapeBtn.dataset.inkTool = 'shape';
        const erBtn = toolGrp.querySelector('[data-ink-tool="eraser"]');
        if (erBtn) toolGrp.insertBefore(shapeBtn, erBtn);
        else toolGrp.appendChild(shapeBtn);
      }
    }

    TOOLS.forEach(t => {
      const el = tb.querySelector(`[data-ink-tool="${t.id}"]`);
      if (el) {
        el.title = t.tip;
        el.setAttribute('aria-label', t.tip);
        el.innerHTML = t.icon + (t.hasSubMenu ? ACTION_ICONS.caret : '');
      }
    });

    // 3) 撤销 / 重做 / 清空 / 折叠 / 退出图标化
    const actionMap = {
      '#inkUndo':  ACTION_ICONS.undo,
      '#inkRedo':  ACTION_ICONS.redo,
      '#inkClear': ACTION_ICONS.clear,
      '#inkFold':  ACTION_ICONS.fold,
      '#inkExit':  ACTION_ICONS.exit
    };
    Object.entries(actionMap).forEach(([sel, [tip, svg]]) => {
      const el = tb.querySelector(sel);
      if (el) {
        el.title = tip;
        el.setAttribute('aria-label', tip);
        el.innerHTML = svg;
      }
    });

    if (!tb.querySelector('#inkMore')) {
      const more = document.createElement('button');
      more.id = 'inkMore';
      more.type = 'button';
      more.textContent = '设置';
      more.setAttribute('aria-expanded', 'false');
      const undoParent = tb.querySelector('#inkUndo')?.parentElement;
      if (undoParent) tb.insertBefore(more, undoParent);
    }

    // 4) Goodnotes 风格二级弹出胶囊菜单（8种数学几何图形 + 虚线/3档粗细 + 6色球/自定义取色）
    const palette = tb.querySelector('.ink-palette');
    if (palette && !tb.querySelector('#inkSubMenu')) {
      const subMenu = document.createElement('div');
      subMenu.id = 'inkSubMenu';
      subMenu.setAttribute('role', 'group');
      subMenu.setAttribute('aria-label', '几何图形、笔迹粗细与颜色二级菜单');

      const shapeBox = document.createElement('div');
      shapeBox.className = 'ink-shape-presets';
      shapeBox.innerHTML = SHAPES.map((sh, i) =>
        `<button type="button" class="ink-shape-btn${i === 0 ? ' selected' : ''}" data-ink-shape="${sh.id}" title="${sh.tip}" aria-label="${sh.label}">${sh.icon}</button>`
      ).join('');

      const strokeBox = document.createElement('div');
      strokeBox.className = 'ink-stroke-presets';
      strokeBox.innerHTML =
        `<button type="button" class="ink-stroke-btn" data-ink-dash="1" title="虚线批注 / 几何虚线辅助线" aria-label="虚线">${ACTION_ICONS.dash}</button>` +
        STROKE_SIZES.map(st =>
          `<button type="button" class="ink-stroke-btn${st.defaultSelected ? ' selected' : ''}" data-ink-size="${st.size}" title="${st.label}" aria-label="${st.label}">` +
          `<svg viewBox="0 0 32 16"><line x1="4" y1="8" x2="28" y2="8" stroke="currentColor" stroke-width="${st.strokeW}" stroke-linecap="round"/></svg></button>`
        ).join('');

      const divider = document.createElement('div');
      divider.className = 'ink-sub-divider';

      if (!palette.querySelector('.ink-custom-plus')) {
        const plusBtn = document.createElement('button');
        plusBtn.type = 'button';
        plusBtn.className = 'ink-custom-plus';
        plusBtn.title = '自定义更多颜色';
        plusBtn.setAttribute('aria-label', '自定义颜色');
        plusBtn.innerHTML = ACTION_ICONS.plus;
        plusBtn.onclick = (ev) => {
          ev.stopPropagation();
          tb.querySelector('#inkCustomColor')?.click();
        };
        palette.appendChild(plusBtn);
      }

      palette.parentNode.insertBefore(subMenu, palette);
      subMenu.appendChild(shapeBox);
      subMenu.appendChild(strokeBox);
      subMenu.appendChild(divider);
      subMenu.appendChild(palette);

      document.addEventListener('pointerdown', (ev) => {
        if (!tb.contains(ev.target)) {
          subMenu.classList.remove('palette-open');
        }
      });
    }
  }

  function setupCoursewareToolbar(opts = {}) {
    const getPenOn = opts.getPenOn || (() => false);
    const inkSettings = opts.inkSettings || { color: '#d94040', size: 5.5, tool: 'pen', dashed: false, shapeType: 'axes' };
    const updateInkTools = opts.updateInkTools || (() => {});

    const penBtn = document.getElementById('pen');
    if (penBtn && !penBtn.dataset.styled) {
      penBtn.dataset.styled = '1';
      if (!getPenOn()) penBtn.textContent = '✏️ 批注';
    }

    const tb = document.getElementById('inkToolbar');
    if (!tb) return;

    upgradeToolbarDOM(tb);

    if (!global.inkToolProfiles) {
      global.inkToolProfiles = createDefaultProfiles();
    }

    if (!tb.dataset.eventsBound) {
      tb.dataset.eventsBound = '1';

      global.syncSubMenuDock = () => {
        if (!tb.dataset.recentered && !tb.hidden && tb.offsetWidth > 0) {
          tb.dataset.recentered = '1';
          tb.style.left = Math.round((window.innerWidth - tb.offsetWidth) / 2) + 'px';
        }
        const subMenu = document.getElementById('inkSubMenu');
        const activeDrawTool = ['pen', 'highlight', 'shape'].includes(inkSettings.tool) ? inkSettings.tool : 'pen';
        if (subMenu) {
          subMenu.classList.toggle('shape-mode', activeDrawTool === 'shape');
        }
        ['pen', 'highlight', 'shape'].forEach(tName => {
          const prof = global.inkToolProfiles[tName];
          const tBtn = tb.querySelector(`[data-ink-tool="${tName}"]`);
          const bar = tBtn?.querySelector('.ink-tool-color-bar');
          if (bar && prof) {
            bar.style.setProperty('--tool-color', prof.color);
            const bh = prof.size <= 3.5 ? '2.5px' : (prof.size >= 8 ? '7px' : '4.5px');
            bar.style.setProperty('--bar-h', bh);
            bar.style.height = bh;
            bar.style.backgroundColor = prof.color;
            bar.classList.toggle('is-dashed', Boolean(prof.dashed));
          }
        });
        tb.querySelectorAll('[data-ink-shape]').forEach(b => {
          b.classList.toggle('selected', b.dataset.inkShape === (inkSettings.shapeType || 'axes'));
        });
        tb.querySelectorAll('[data-ink-size]').forEach(b => {
          b.classList.toggle('selected', +b.dataset.inkSize === +inkSettings.size);
        });
        const dashBtn = tb.querySelector('[data-ink-dash]');
        if (dashBtn) dashBtn.classList.toggle('selected', Boolean(inkSettings.dashed));
        tb.querySelectorAll('[data-ink-color]').forEach(b => {
          const act = b.dataset.inkColor?.toLowerCase() === String(inkSettings.color).toLowerCase();
          b.classList.toggle('selected', act);
          b.setAttribute('aria-pressed', String(act));
        });
        tb.style.setProperty('--active-ink', inkSettings.color);
        if (subMenu && subMenu.classList.contains('palette-open')) {
          const targetBtn = tb.querySelector(`[data-ink-tool="${activeDrawTool}"]`);
          if (targetBtn) {
            const btnR = targetBtn.getBoundingClientRect();
            const subR = subMenu.getBoundingClientRect();
            if (subR.width > 0) {
              const arrowX = Math.max(28, Math.min(subR.width - 28, (btnR.left + btnR.width / 2) - subR.left));
              subMenu.style.setProperty('--dock-arrow-x', Math.round(arrowX) + 'px');
            }
          }
        }
      };

      const customInp = document.getElementById('inkCustomColor');
      if (customInp && !customInp.dataset.boundSync) {
        customInp.dataset.boundSync = '1';
        customInp.addEventListener('input', (e) => {
          inkSettings.color = e.target.value;
          const drawTool = ['pen', 'highlight', 'shape'].includes(inkSettings.tool) ? inkSettings.tool : 'pen';
          if (!['pen', 'highlight', 'shape'].includes(inkSettings.tool)) inkSettings.tool = 'pen';
          global.inkToolProfiles[drawTool].color = inkSettings.color;
          updateInkTools();
          global.syncSubMenuDock();
        });
      }

      tb.addEventListener('click', (ev) => {
        const btn = ev.target.closest('button');
        if (!btn) return;
        const penOn = getPenOn();
        const subMenu = document.getElementById('inkSubMenu');
        const activeDrawTool = ['pen', 'highlight', 'shape'].includes(inkSettings.tool) ? inkSettings.tool : 'pen';
        if (btn.dataset.inkShape) {
          ev.stopPropagation();
          inkSettings.tool = 'shape';
          inkSettings.shapeType = btn.dataset.inkShape;
          global.inkToolProfiles.shape.shapeType = inkSettings.shapeType;
          document.getElementById('penLayer')?.classList.toggle('enabled', penOn);
          updateInkTools();
          global.syncSubMenuDock();
          return;
        }
        if (btn.dataset.inkDash) {
          ev.stopPropagation();
          if (!['pen', 'highlight', 'shape'].includes(inkSettings.tool)) inkSettings.tool = activeDrawTool;
          inkSettings.dashed = !inkSettings.dashed;
          global.inkToolProfiles[inkSettings.tool].dashed = inkSettings.dashed;
          document.getElementById('penLayer')?.classList.toggle('enabled', penOn);
          updateInkTools();
          global.syncSubMenuDock();
          return;
        }
        if (btn.dataset.inkSize) {
          ev.stopPropagation();
          if (!['pen', 'highlight', 'shape'].includes(inkSettings.tool)) inkSettings.tool = activeDrawTool;
          inkSettings.size = +btn.dataset.inkSize;
          global.inkToolProfiles[inkSettings.tool].size = inkSettings.size;
          document.getElementById('penLayer')?.classList.toggle('enabled', penOn);
          updateInkTools();
          global.syncSubMenuDock();
          return;
        }
        if (btn.dataset.inkTool) {
          const tool = btn.dataset.inkTool;
          const isCursor = tool === 'cursor';
          document.getElementById('penLayer')?.classList.toggle('enabled', penOn && !isCursor);
          if (tool === 'pen' || tool === 'highlight' || tool === 'shape') {
            const prof = global.inkToolProfiles[tool];
            if (prof) {
              inkSettings.color = prof.color;
              inkSettings.size = prof.size;
              inkSettings.dashed = prof.dashed;
              if (prof.shapeType) inkSettings.shapeType = prof.shapeType;
            }
            if (tb.dataset.lastOpenTool === tool && subMenu?.classList.contains('palette-open')) {
              subMenu.classList.remove('palette-open');
            } else {
              subMenu?.classList.add('palette-open');
            }
            tb.dataset.lastOpenTool = tool;
            updateInkTools();
            requestAnimationFrame(() => global.syncSubMenuDock());
          } else {
            subMenu?.classList.remove('palette-open');
            tb.dataset.lastOpenTool = tool;
          }
          global.syncSubMenuDock();
        } else if (btn.dataset.inkColor) {
          if (!['pen', 'highlight', 'shape'].includes(inkSettings.tool)) {
            inkSettings.tool = 'pen';
          }
          global.inkToolProfiles[inkSettings.tool].color = inkSettings.color;
          document.getElementById('penLayer')?.classList.toggle('enabled', penOn);
          updateInkTools();
          global.syncSubMenuDock();
        }
      });
    }

    if (global.syncSubMenuDock) {
      global.syncSubMenuDock();
      requestAnimationFrame(() => global.syncSubMenuDock());
    }
  }

  // ================= 3. 自包含 CSS 注入器（供独立预览页或外部容器一键加载） =================
  const STANDALONE_INK_CSS = `
    .ink-demo-stage {
      position: relative;
      width: 100%;
      height: 520px;
      background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
      border: 2px solid #cbd5e1;
      border-radius: 18px;
      overflow: hidden;
      box-shadow: inset 0 2px 10px rgba(15, 23, 42, 0.04);
      user-select: none;
    }
    .ink-demo-bg {
      position: absolute;
      inset: 0;
      padding: 24px 32px;
      pointer-events: none;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .ink-demo-canvas {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      z-index: 5;
      touch-action: none;
      cursor: crosshair;
    }
    .ink-demo-canvas.cursor-mode {
      pointer-events: none;
    }
    .ink-demo-dock-wrap {
      position: absolute;
      left: 50%;
      bottom: 18px;
      transform: translateX(-50%);
      z-index: 20;
      touch-action: none;
    }
    .ink-demo-dock-wrap.is-moved {
      transform: none;
      bottom: auto;
    }
    .ink-demo-dock-wrap[hidden] {
      display: none !important;
    }
    .ink-demo-toolbar {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 10px;
      padding: 10px 14px;
      border-radius: 24px;
      background: rgba(30, 41, 59, 0.78);
      border: 1.5px solid rgba(255, 255, 255, 0.48);
      box-shadow: 0 12px 32px rgba(15, 23, 42, 0.28);
      backdrop-filter: blur(14px) saturate(140%);
      -webkit-backdrop-filter: blur(14px) saturate(140%);
      color: #ffffff;
      position: relative;
      cursor: grab;
      touch-action: none;
    }
    .ink-demo-toolbar:active {
      cursor: grabbing;
    }
    .ink-demo-drag {
      width: 28px;
      height: 46px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: rgba(255, 255, 255, 0.85);
      font-size: 26px;
      line-height: 1;
      cursor: grab;
      user-select: none;
      padding-right: 6px;
      border-right: 1.5px solid rgba(255, 255, 255, 0.28);
      touch-action: none;
    }
    .ink-demo-drag:hover {
      color: #ffffff;
    }
    .ink-demo-drag:active {
      cursor: grabbing;
    }
    .ink-demo-bubble {
      position: absolute;
      right: 22px;
      bottom: 18px;
      z-index: 25;
      height: 54px;
      min-width: 54px;
      padding: 0 16px 0 13px;
      border-radius: 999px;
      background: rgba(24, 34, 52, 0.88);
      color: #ffffff;
      border: 2.5px solid var(--active-ink, #384d8f);
      box-shadow: 0 10px 28px rgba(15, 23, 42, 0.36), 0 0 0 3px rgba(255, 255, 255, 0.42);
      backdrop-filter: blur(12px) saturate(140%);
      -webkit-backdrop-filter: blur(12px) saturate(140%);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 7px;
      cursor: grab;
      user-select: none;
      touch-action: none;
      transition: transform 0.15s ease, background 0.15s ease;
    }
    .ink-demo-bubble[hidden] {
      display: none !important;
    }
    .ink-demo-bubble:hover {
      transform: scale(1.05);
      background: rgba(30, 41, 59, 0.96);
    }
    .ink-demo-bubble:active {
      cursor: grabbing;
    }
    .ink-demo-bubble svg {
      width: 22px;
      height: 22px;
      stroke: currentColor;
      stroke-width: 2.2;
      fill: none;
      stroke-linecap: round;
      stroke-linejoin: round;
      pointer-events: none;
    }
    .ink-demo-bubble-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: var(--active-ink, #384d8f);
      border: 1.5px solid #ffffff;
      flex-shrink: 0;
      pointer-events: none;
    }
    .ink-demo-bubble-label {
      font-family: 'SimSun', 'Songti SC', serif;
      font-size: 15px;
      font-weight: 700;
      letter-spacing: 0.5px;
      pointer-events: none;
      white-space: nowrap;
    }
    .ink-demo-toolbar .ink-btn {
      width: 52px;
      height: 52px;
      border-radius: 15px;
      background: rgba(15, 23, 42, 0.45);
      border: 1.5px solid rgba(255, 255, 255, 0.32);
      color: #ffffff;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      position: relative;
      cursor: pointer;
      padding: 0;
      transition: all 0.15s ease;
    }
    .ink-demo-toolbar .ink-btn.has-caret {
      width: 62px;
      padding-right: 10px;
    }
    .ink-demo-toolbar .ink-btn:hover:not(:disabled) {
      background: rgba(15, 23, 42, 0.72);
      border-color: rgba(255, 255, 255, 0.68);
      transform: translateY(-1px);
    }
    .ink-demo-toolbar .ink-btn.selected {
      background: linear-gradient(135deg, rgba(13, 148, 136, 0.95), rgba(2, 132, 199, 0.95));
      border-color: #99f6e4;
      box-shadow: 0 4px 14px rgba(2, 132, 199, 0.42);
    }
    .ink-demo-toolbar .ink-btn:disabled {
      opacity: 0.35;
      cursor: default;
    }
    .ink-demo-toolbar .ink-btn.danger {
      background: rgba(153, 27, 27, 0.58);
      color: #fecaca;
      border-color: rgba(252, 165, 165, 0.55);
    }
    .ink-demo-toolbar .ink-btn.danger:hover {
      background: rgba(185, 28, 28, 0.88);
      color: #ffffff;
    }
    .ink-demo-toolbar .ink-btn > svg:first-child {
      width: 26px;
      height: 26px;
      stroke: currentColor;
      stroke-width: 2.2;
      fill: none;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    .ink-demo-toolbar .ink-tool-caret {
      position: absolute;
      right: 6px;
      top: 50%;
      transform: translateY(-50%);
      width: 10px;
      height: 10px;
      opacity: 0.8;
      stroke-width: 2.5;
    }
    .ink-demo-toolbar .ink-tool-color-bar {
      position: absolute;
      bottom: 5px;
      left: 10px;
      width: 28px;
      height: var(--bar-h, 4px);
      border-radius: 99px;
      background: var(--tool-color, #d94040);
    }
    .ink-demo-toolbar .ink-tool-color-bar.is-dashed {
      background: repeating-linear-gradient(90deg, var(--tool-color, #d94040) 0px, var(--tool-color, #d94040) 6px, transparent 6px, transparent 10px) !important;
    }
    .ink-demo-submenu {
      position: absolute;
      bottom: calc(100% + 12px);
      left: 50%;
      transform: translateX(-50%);
      display: none;
      flex-direction: row;
      align-items: center;
      gap: 12px;
      padding: 9px 18px;
      border-radius: 999px;
      background: rgba(24, 34, 52, 0.94);
      border: 1.5px solid rgba(255, 255, 255, 0.55);
      box-shadow: 0 10px 28px rgba(15, 23, 42, 0.38);
      width: max-content;
      z-index: 30;
    }
    .ink-demo-submenu.open {
      display: flex;
    }
    .ink-demo-submenu.flip-down {
      bottom: auto;
      top: calc(100% + 12px);
    }
    .ink-demo-submenu .sub-btn {
      width: 40px;
      height: 40px;
      border-radius: 11px;
      background: transparent;
      border: 1.5px solid transparent;
      color: rgba(255, 255, 255, 0.88);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      padding: 0;
    }
    .ink-demo-submenu .sub-btn:hover {
      background: rgba(255, 255, 255, 0.14);
    }
    .ink-demo-submenu .sub-btn.selected {
      background: rgba(56, 189, 248, 0.28);
      border-color: #7dd3fc;
      color: #ffffff;
    }
    .ink-demo-submenu .sub-btn svg {
      width: 22px;
      height: 22px;
      stroke: currentColor;
      stroke-width: 2.1;
      fill: none;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    .ink-demo-submenu .swatch-btn {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 2.5px solid rgba(255, 255, 255, 0.8);
      cursor: pointer;
      padding: 0;
      transition: transform 0.15s ease;
    }
    .ink-demo-submenu .swatch-btn.selected {
      transform: scale(1.18);
      border-color: #ffffff;
      box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.28);
    }
    .ink-demo-sep {
      width: 1.5px;
      height: 28px;
      background: rgba(255, 255, 255, 0.28);
    }
  `;

  function injectStyles() {
    if (typeof document === 'undefined' || document.getElementById('ink-annotation-layer-styles')) return;
    const styleEl = document.createElement('style');
    styleEl.id = 'ink-annotation-layer-styles';
    styleEl.textContent = STANDALONE_INK_CSS;
    document.head?.appendChild(styleEl);
  }

  // ================= 4. 独立交互式预览黑板组件 (供 component_library_preview.html 直接挂载) =================
  function createInteractiveDemo(container, options = {}) {
    if (!container) return null;
    injectStyles();

    const stageW = options.width || 1100;
    const stageH = options.height || 500;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const profiles = createDefaultProfiles();
    const state = {
      tool: 'shape',
      color: '#384d8f',
      size: 2.5,
      dashed: false,
      shapeType: 'axes',
      strokes: (options.initialStrokes || []).slice(),
      undo: [],
      redo: []
    };

    container.innerHTML = `
      <div class="ink-demo-stage" style="height:${stageH}px;">
        <div class="ink-demo-bg">
          <div style="display:flex;align-items:center;justify-content:space-between;">
            <span style="background:#eef2ff;color:#1e3a8a;border:1.5px solid #c7d2fe;padding:5px 14px;border-radius:99px;font-weight:700;font-size:15px;">
              ✨ 交互式黑板批注与尺规作图演练场（支持直接在下方画布拖拽作图或书写）
            </span>
            <span id="inkDemoStatus" style="font-size:14px;color:#475569;font-weight:600;">
              当前模式：几何作图 · 平面直角坐标系 xOy
            </span>
          </div>
          <div style="display:grid;grid-template-columns:1.1fr 1fr;gap:24px;margin:14px 0 auto;opacity:0.95;">
            <div style="background:#f8fafc;border:1.5px dashed #cbd5e1;border-radius:14px;padding:18px 22px;font-family:'SimSun','Songti SC',serif;font-size:22px;line-height:1.85;color:#1e293b;">
              <div style="font-weight:700;color:#1e3a8a;margin-bottom:8px;font-size:16px;">【模拟课件底层板书区 · 可用荧光笔/画笔直接圈画批注】</div>
              已知反比例函数 <i class="m">y</i>=<span class="fraction"><span><span class="num">6</span></span><span><i class="m">x</i></span></span>（<i class="m">x</i>&gt;<span class="num">0</span>）的图象经过点 <i class="m">A</i>(<span class="num">2</span>,<span class="num">3</span>)，过点 <i class="m">A</i> 作 <i class="m">AB</i>⊥<i class="m">x</i> 轴于点 <i class="m">B</i>，连接 <i class="m">OA</i>，则 △<i class="m">OAB</i> 的面积 <i class="m">S</i>=<span class="num">3</span>。
            </div>
            <div style="background:#f8fafc;border:1.5px dashed #cbd5e1;border-radius:14px;padding:14px 18px;display:flex;flex-direction:column;justify-content:flex-start;min-height:245px;">
              <div style="font-weight:700;color:#475569;font-size:15px;">【右侧尺规几何作图区 · 已预置坐标系 <i class="m">xOy</i>、Rt△ 与虚线辅助线】</div>
            </div>
          </div>
          <div style="height:68px;"></div>
        </div>
        <canvas class="ink-demo-canvas" width="${stageW * dpr}" height="${stageH * dpr}"></canvas>
        <div class="ink-demo-dock-wrap" id="demoDockWrap">
          <div class="ink-demo-toolbar" id="demoToolbar" title="按住左侧拖拽柄或工具栏空白处可自由移动位置">
            <div class="ink-demo-submenu open">
              <div class="ink-demo-shapes" style="display:flex;align-items:center;gap:4px;">
                ${SHAPES.map(sh => `<button type="button" class="sub-btn" data-demo-shape="${sh.id}" title="${sh.tip}">${sh.icon}</button>`).join('')}
              </div>
              <div class="ink-demo-sep" id="demoShapeSep"></div>
              <div style="display:flex;align-items:center;gap:4px;">
                <button type="button" class="sub-btn" data-demo-dash="1" title="虚线批注 / 几何虚线辅助线">${ACTION_ICONS.dash}</button>
                ${STROKE_SIZES.map(st => `<button type="button" class="sub-btn" data-demo-size="${st.size}" title="${st.label}"><svg viewBox="0 0 32 16"><line x1="4" y1="8" x2="28" y2="8" stroke="currentColor" stroke-width="${st.strokeW}" stroke-linecap="round"/></svg></button>`).join('')}
              </div>
              <div class="ink-demo-sep"></div>
              <div style="display:flex;align-items:center;gap:8px;">
                ${COLORS.map(c => `<button type="button" class="swatch-btn" data-demo-color="${c.hex}" style="background:${c.hex}" title="${c.label}"></button>`).join('')}
              </div>
            </div>
            <div class="ink-demo-drag" id="demoDrag" title="按住拖动批注工具栏位置" aria-label="拖动批注工具栏">⠿</div>
            ${TOOLS.map(t => `<button type="button" class="ink-btn${t.hasSubMenu ? ' has-caret' : ''}" data-demo-tool="${t.id}" title="${t.tip}">${t.icon}${t.hasSubMenu ? ACTION_ICONS.caret : ''}</button>`).join('')}
            <div class="ink-demo-sep"></div>
            <button type="button" class="ink-btn" id="demoUndo" title="${ACTION_ICONS.undo[0]}">${ACTION_ICONS.undo[1]}</button>
            <button type="button" class="ink-btn" id="demoRedo" title="${ACTION_ICONS.redo[0]}">${ACTION_ICONS.redo[1]}</button>
            <button type="button" class="ink-btn danger" id="demoClear" title="${ACTION_ICONS.clear[0]}">${ACTION_ICONS.clear[1]}</button>
            <div class="ink-demo-sep"></div>
            <button type="button" class="ink-btn" id="demoFold" title="最小化收起为悬浮球（避免遮挡底层图形）" aria-label="最小化收起为悬浮球">${ACTION_ICONS.fold[1]}</button>
          </div>
        </div>
        <button type="button" class="ink-demo-bubble" id="demoBubble" hidden title="点击展开批注栏 · 按住可拖动位置" aria-label="展开批注工具栏">
          ${ACTION_ICONS.bubble}
          <span class="ink-demo-bubble-dot"></span>
          <span class="ink-demo-bubble-label">批注</span>
        </button>
      </div>
    `;

    const canvas = container.querySelector('.ink-demo-canvas');
    const ctx = canvas.getContext('2d');
    const baseCanvas = document.createElement('canvas');
    const strokeCanvas = document.createElement('canvas');
    baseCanvas.width = strokeCanvas.width = stageW * dpr;
    baseCanvas.height = strokeCanvas.height = stageH * dpr;
    const baseCtx = baseCanvas.getContext('2d');
    const strokeCtx = strokeCanvas.getContext('2d');

    const subMenu = container.querySelector('.ink-demo-submenu');
    const shapesWrap = container.querySelector('.ink-demo-shapes');
    const shapeSep = container.querySelector('#demoShapeSep');
    const statusEl = container.querySelector('#inkDemoStatus');
    const stageEl = container.querySelector('.ink-demo-stage');
    const dockWrap = container.querySelector('#demoDockWrap');
    const toolbarEl = container.querySelector('#demoToolbar');
    const bubbleEl = container.querySelector('#demoBubble');

    function clampVal(v, min, max) {
      return Math.max(min, Math.min(Math.max(min, max), v));
    }

    function setNodeStagePos(node, leftPx, topPx) {
      if (!stageEl || !node) return;
      const sr = stageEl.getBoundingClientRect();
      const nr = node.getBoundingClientRect();
      const clampedL = clampVal(leftPx, 8, sr.width - nr.width - 8);
      const clampedT = clampVal(topPx, 8, sr.height - nr.height - 8);
      node.classList.add('is-moved');
      node.style.left = `${Math.round(clampedL)}px`;
      node.style.top = `${Math.round(clampedT)}px`;
      node.style.right = 'auto';
      node.style.bottom = 'auto';
      node.style.transform = 'none';
      if (node === dockWrap && subMenu) {
        subMenu.classList.toggle('flip-down', clampedT < 92);
      }
    }

    function foldDemoToolbar() {
      if (!stageEl || !dockWrap || !bubbleEl) return;
      const sr = stageEl.getBoundingClientRect();
      const dr = dockWrap.getBoundingClientRect();
      dockWrap.hidden = true;
      bubbleEl.hidden = false;
      const br = bubbleEl.getBoundingClientRect();
      const targetL = (dr.right - sr.left) - br.width;
      const targetT = (dr.top - sr.top) + (dr.height - br.height) / 2;
      setNodeStagePos(bubbleEl, targetL, targetT);
    }

    function unfoldDemoToolbar() {
      if (!stageEl || !dockWrap || !bubbleEl) return;
      const sr = stageEl.getBoundingClientRect();
      const br = bubbleEl.getBoundingClientRect();
      bubbleEl.hidden = true;
      dockWrap.hidden = false;
      const dr = dockWrap.getBoundingClientRect();
      const targetL = (br.right - sr.left) - dr.width;
      const targetT = (br.top - sr.top) - (dr.height - br.height) / 2;
      setNodeStagePos(dockWrap, targetL, targetT);
    }

    function attachStageDrag(handleEl, targetNode, isBubble = false) {
      if (!handleEl || !targetNode || !stageEl) return;
      let dragState = null;
      let hasMoved = false;
      handleEl.addEventListener('pointerdown', ev => {
        if (ev.button !== 0) return;
        if (!isBubble && ev.target.closest('button, .ink-demo-submenu')) return;
        const sr = stageEl.getBoundingClientRect();
        const tr = targetNode.getBoundingClientRect();
        dragState = {
          pid: ev.pointerId,
          startX: ev.clientX,
          startY: ev.clientY,
          initLeft: tr.left - sr.left,
          initTop: tr.top - sr.top
        };
        hasMoved = false;
        handleEl.setPointerCapture(ev.pointerId);
        ev.preventDefault();
        ev.stopPropagation();
      });
      handleEl.addEventListener('pointermove', ev => {
        if (!dragState || ev.pointerId !== dragState.pid) return;
        const dx = ev.clientX - dragState.startX;
        const dy = ev.clientY - dragState.startY;
        if (Math.hypot(dx, dy) > 4) hasMoved = true;
        if (hasMoved) {
          setNodeStagePos(targetNode, dragState.initLeft + dx, dragState.initTop + dy);
        }
      });
      handleEl.addEventListener('pointerup', ev => {
        if (!dragState || ev.pointerId !== dragState.pid) return;
        const wasClick = !hasMoved;
        dragState = null;
        if (handleEl.hasPointerCapture(ev.pointerId)) handleEl.releasePointerCapture(ev.pointerId);
        if (isBubble && wasClick) {
          unfoldDemoToolbar();
        }
      });
      handleEl.addEventListener('pointercancel', () => {
        dragState = null;
        hasMoved = false;
      });
    }

    attachStageDrag(toolbarEl, dockWrap, false);
    attachStageDrag(bubbleEl, bubbleEl, true);
    bubbleEl?.addEventListener('click', ev => {
      if (ev.detail === 0) unfoldDemoToolbar();
    });

    function syncUI() {
      canvas.classList.toggle('cursor-mode', state.tool === 'cursor');
      const isShape = state.tool === 'shape';
      if (shapesWrap) shapesWrap.style.display = isShape ? 'flex' : 'none';
      if (shapeSep) shapeSep.style.display = isShape ? 'block' : 'none';

      container.querySelectorAll('[data-demo-tool]').forEach(b => {
        const t = b.dataset.demoTool;
        b.classList.toggle('selected', t === state.tool);
        const prof = profiles[t];
        const bar = b.querySelector('.ink-tool-color-bar');
        if (bar && prof) {
          bar.style.setProperty('--tool-color', prof.color);
          const bh = prof.size <= 3.5 ? '2.5px' : (prof.size >= 8 ? '6.5px' : '4.5px');
          bar.style.setProperty('--bar-h', bh);
          bar.style.height = bh;
          bar.style.backgroundColor = prof.color;
          bar.classList.toggle('is-dashed', Boolean(prof.dashed));
        }
      });
      container.querySelectorAll('[data-demo-shape]').forEach(b => {
        b.classList.toggle('selected', b.dataset.demoShape === state.shapeType);
      });
      container.querySelectorAll('[data-demo-size]').forEach(b => {
        b.classList.toggle('selected', +b.dataset.demoSize === +state.size);
      });
      const dashBtn = container.querySelector('[data-demo-dash]');
      if (dashBtn) dashBtn.classList.toggle('selected', Boolean(state.dashed));
      container.querySelectorAll('[data-demo-color]').forEach(b => {
        b.classList.toggle('selected', b.dataset.demoColor.toLowerCase() === state.color.toLowerCase());
      });
      container.querySelector('#demoUndo').disabled = !state.undo.length;
      container.querySelector('#demoRedo').disabled = !state.redo.length;
      if (bubbleEl) bubbleEl.style.setProperty('--active-ink', state.color);

      const toolObj = TOOLS.find(t => t.id === state.tool);
      const shapeObj = SHAPES.find(s => s.id === state.shapeType);
      if (statusEl) {
        const axesHint = (state.tool === 'shape' && state.shapeType === 'axes') ? '（拖出后可拉动四端手柄单独调节 ±x、±y 半轴长度）' : '';
        statusEl.textContent = `当前模式：${toolObj ? toolObj.label : state.tool}${state.tool === 'shape' && shapeObj ? ' · ' + shapeObj.label : ''}${state.dashed ? '（虚线模式）' : ''}${axesHint}`;
      }
    }

    let activeStroke = null;
    let activePid = null;
    let activeAxesDrag = null;
    let hoveredAxesHandleId = null;
    let selectedAxesIdx = -1;
    for (let i = state.strokes.length - 1; i >= 0; i--) {
      const s = state.strokes[i];
      if (s && s.tool === 'shape' && (s.shapeType || 'axes') === 'axes') {
        normalizeShapePoints(s);
        if (selectedAxesIdx === -1) selectedAxesIdx = i;
      }
    }

    function findLastAxesIndex() {
      for (let i = state.strokes.length - 1; i >= 0; i--) {
        const s = state.strokes[i];
        if (s && s.tool === 'shape' && (s.shapeType || 'axes') === 'axes') return i;
      }
      return -1;
    }

    function rebuild() {
      baseCtx.clearRect(0, 0, baseCanvas.width, baseCanvas.height);
      state.strokes.forEach(s => paintStrokeOnContext(baseCtx, s, strokeCanvas, strokeCtx, dpr));
      redraw();
      syncUI();
    }

    function redraw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(baseCanvas, 0, 0);
      if (activeStroke) {
        paintStrokeOnContext(ctx, activeStroke, strokeCanvas, strokeCtx, dpr, true);
      } else if (
        selectedAxesIdx >= 0 &&
        selectedAxesIdx < state.strokes.length &&
        state.strokes[selectedAxesIdx] &&
        state.strokes[selectedAxesIdx].tool === 'shape' &&
        (state.strokes[selectedAxesIdx].shapeType || 'axes') === 'axes' &&
        state.tool !== 'cursor' &&
        state.tool !== 'eraser'
      ) {
        drawAxesHandles(
          ctx,
          state.strokes[selectedAxesIdx],
          dpr,
          activeAxesDrag ? activeAxesDrag.handleId : hoveredAxesHandleId
        );
      }
    }

    function ptFromEvent(e) {
      const r = canvas.getBoundingClientRect();
      const x = (e.clientX - r.left) * stageW / r.width;
      const y = (e.clientY - r.top) * stageH / r.height;
      const w = state.tool === 'eraser' ? state.size * 5.2 : state.tool === 'highlight' ? state.size * 4.2 : state.size;
      return { x, y, w };
    }

    canvas.addEventListener('pointerdown', e => {
      if (state.tool === 'cursor' || e.button !== 0) return;
      e.preventDefault();
      const p0 = ptFromEvent(e);

      // 优先检测是否点击在已生成坐标系的 ±x / ±y 半轴调节手柄（或原点平移手柄）上
      if (state.tool !== 'eraser') {
        const hit = hitTestAxesHandle(state.strokes, p0, selectedAxesIdx, 18);
        if (hit && (hit.strokeIndex === selectedAxesIdx || (state.tool === 'shape' && state.shapeType === 'axes'))) {
          state.undo.push(cloneStrokes(state.strokes));
          state.redo = [];
          selectedAxesIdx = hit.strokeIndex;
          activePid = e.pointerId;
          activeAxesDrag = {
            strokeIndex: hit.strokeIndex,
            handleId: hit.handle.id,
            startBounds: { ...getAxesBounds(hit.stroke) },
            startPt: p0
          };
          canvas.setPointerCapture(e.pointerId);
          rebuild();
          return;
        }
        if (state.tool === 'shape' && state.shapeType === 'axes') {
          const hitAxisIdx = hitTestAxesStroke(state.strokes, p0, 12);
          if (hitAxisIdx >= 0 && hitAxisIdx !== selectedAxesIdx) {
            selectedAxesIdx = hitAxisIdx;
            redraw();
            return;
          }
        }
      }

      if (state.tool !== 'shape' || state.shapeType !== 'axes') {
        selectedAxesIdx = -1;
      }

      activePid = e.pointerId;
      activeStroke = {
        tool: state.tool,
        color: state.color,
        size: state.size,
        dashed: state.dashed,
        shapeType: state.shapeType,
        points: [p0]
      };
      canvas.setPointerCapture(e.pointerId);
      redraw();
    });

    canvas.addEventListener('pointermove', e => {
      const p = ptFromEvent(e);
      if (activeAxesDrag && e.pointerId === activePid) {
        e.preventDefault();
        const targetStroke = state.strokes[activeAxesDrag.strokeIndex];
        if (targetStroke) {
          applyAxesHandleDrag(targetStroke, activeAxesDrag.handleId, p, activeAxesDrag.startBounds, activeAxesDrag.startPt);
          rebuild();
        }
        return;
      }
      if (!activeStroke || e.pointerId !== activePid) {
        if (state.tool !== 'cursor' && state.tool !== 'eraser' && selectedAxesIdx >= 0) {
          const hit = hitTestAxesHandle(state.strokes, p, selectedAxesIdx, 18);
          const nextHover = (hit && hit.strokeIndex === selectedAxesIdx) ? hit.handle.id : null;
          canvas.style.cursor = (hit && hit.strokeIndex === selectedAxesIdx) ? hit.handle.cursor : 'crosshair';
          if (nextHover !== hoveredAxesHandleId) {
            hoveredAxesHandleId = nextHover;
            redraw();
          }
        } else if (canvas.style.cursor !== 'crosshair') {
          canvas.style.cursor = 'crosshair';
        }
        return;
      }
      e.preventDefault();
      const last = activeStroke.points[activeStroke.points.length - 1];
      if (Math.hypot(p.x - last.x, p.y - last.y) > 0.2) {
        activeStroke.points.push(p);
        redraw();
      }
    });

    function endStroke(e, cancel = false) {
      if (activeAxesDrag && e.pointerId === activePid) {
        activeAxesDrag = null;
        activePid = null;
        if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
        rebuild();
        return;
      }
      if (!activeStroke || e.pointerId !== activePid) return;
      if (!cancel) {
        activeStroke.points.push(ptFromEvent(e));
        if (activeStroke.tool === 'shape') {
          activeStroke.points = normalizeShapePoints(activeStroke);
        }
        state.undo.push(cloneStrokes(state.strokes));
        state.redo = [];
        state.strokes.push(activeStroke);
        if (activeStroke.tool === 'shape' && (activeStroke.shapeType || 'axes') === 'axes') {
          selectedAxesIdx = state.strokes.length - 1;
        }
      }
      activeStroke = null;
      activePid = null;
      if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
      rebuild();
    }

    canvas.addEventListener('pointerup', e => endStroke(e, false));
    canvas.addEventListener('pointercancel', e => endStroke(e, true));

    container.querySelector('.ink-demo-toolbar').addEventListener('click', e => {
      const btn = e.target.closest('button');
      if (!btn) return;
      if (btn.dataset.demoTool) {
        const t = btn.dataset.demoTool;
        if (['pen', 'highlight', 'shape'].includes(t)) {
          if (state.tool === t) subMenu.classList.toggle('open');
          else subMenu.classList.add('open');
          state.tool = t;
          const prof = profiles[t];
          state.color = prof.color;
          state.size = prof.size;
          state.dashed = prof.dashed;
          if (prof.shapeType) state.shapeType = prof.shapeType;
          if (t === 'shape' && state.shapeType === 'axes' && selectedAxesIdx === -1) {
            selectedAxesIdx = findLastAxesIndex();
          }
        } else {
          state.tool = t;
          subMenu.classList.remove('open');
        }
        redraw();
        syncUI();
      } else if (btn.dataset.demoShape) {
        state.tool = 'shape';
        state.shapeType = btn.dataset.demoShape;
        profiles.shape.shapeType = state.shapeType;
        if (state.shapeType === 'axes' && selectedAxesIdx === -1) {
          selectedAxesIdx = findLastAxesIndex();
        }
        redraw();
        syncUI();
      } else if (btn.dataset.demoDash) {
        state.dashed = !state.dashed;
        if (profiles[state.tool]) profiles[state.tool].dashed = state.dashed;
        syncUI();
      } else if (btn.dataset.demoSize) {
        state.size = +btn.dataset.demoSize;
        if (profiles[state.tool]) profiles[state.tool].size = state.size;
        syncUI();
      } else if (btn.dataset.demoColor) {
        state.color = btn.dataset.demoColor;
        if (!['pen', 'highlight', 'shape'].includes(state.tool)) state.tool = 'pen';
        profiles[state.tool].color = state.color;
        syncUI();
      } else if (btn.id === 'demoUndo') {
        if (!state.undo.length) return;
        state.redo.push(cloneStrokes(state.strokes));
        state.strokes = state.undo.pop();
        selectedAxesIdx = findLastAxesIndex();
        rebuild();
      } else if (btn.id === 'demoRedo') {
        if (!state.redo.length) return;
        state.undo.push(cloneStrokes(state.strokes));
        state.strokes = state.redo.pop();
        selectedAxesIdx = findLastAxesIndex();
        rebuild();
      } else if (btn.id === 'demoClear') {
        if (!state.strokes.length) return;
        state.undo.push(cloneStrokes(state.strokes));
        state.redo = [];
        state.strokes = [];
        selectedAxesIdx = -1;
        rebuild();
      } else if (btn.id === 'demoFold') {
        foldDemoToolbar();
      }
    });

    rebuild();
    return { state, rebuild };
  }

  global.InkAnnotationLayer = {
    INK_STAGE_W,
    INK_STAGE_H,
    TOOLS,
    SHAPES,
    STROKE_SIZES,
    COLORS,
    ACTION_ICONS,
    createDefaultProfiles,
    drawInkArrowHead,
    normalizeShapePoints,
    getAxesBounds,
    cloneStroke,
    cloneStrokes,
    getAxesHandles,
    hitTestAxesHandle,
    hitTestAxesStroke,
    applyAxesHandleDrag,
    drawAxesHandles,
    traceShapePath,
    traceBezierPath,
    paintStrokeOnContext,
    upgradeToolbarDOM,
    setupCoursewareToolbar,
    injectStyles,
    createInteractiveDemo
  };
})(typeof window !== 'undefined' ? window : globalThis);

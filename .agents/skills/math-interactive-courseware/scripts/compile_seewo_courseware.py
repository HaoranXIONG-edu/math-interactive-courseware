#!/usr/bin/env python3
import argparse, os, re, subprocess, tempfile

def main():
    parser = argparse.ArgumentParser(description="Compile Seewo Interactive Math Courseware from JS chunks")
    parser.add_argument("--title", required=True, help="Courseware title, e.g., 2.2.2 反比例函数的图象（2）")
    parser.add_argument("--chunks", nargs="+", required=True, help="Ordered list of JS chunk files")
    parser.add_argument("--output", required=True, help="Output HTML file path")
    args = parser.parse_args()

    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    prefix = open(os.path.join(base_dir, "layers", "seewo_shell_prefix.html"), "r", encoding="utf-8").read()
    suffix = open(os.path.join(base_dir, "layers", "seewo_shell_suffix.html"), "r", encoding="utf-8").read()

    prefix = prefix.replace("2.2.2 反比例函数的图象（2）", args.title)
    suffix = suffix.replace("2.2.2 反比例函数的图象（2）", args.title)

    chunk_texts = [open(c, "r", encoding="utf-8").read() for c in args.chunks]
    joined_chunks = "\n\n".join(chunk_texts)
    if not re.search(r"cover\s*:\s*true", joined_chunks):
        raise RuntimeError("Missing cover slide (cover: true) in chunk1! The first slide MUST be the Cover & Learning Objectives slide.")
    if not re.search(r"window\.COURSEWARE_PHASES\s*=", joined_chunks):
        raise RuntimeError("Missing 'window.COURSEWARE_PHASES = [...]' in chunk1! Top navigation phases must be explicitly configured.")
    if re.search(r"std-cover-flow", joined_chunks):
        raise RuntimeError("Forbidden '.std-cover-flow' detected in cover slide! Do NOT duplicate the 4-phase navigation cards on the cover.")
    if re.search(r'<div\s+class=["\']screen\s+layout-', joined_chunks):
        raise RuntimeError("Invalid slide wrapper '<div class=\"screen layout-...\">' detected! Must use '<div class=\"screen-page lab-visible\">...<div class=\"screen-lower layout-...\">' or window.defineSlide({...}).")
    full_html = prefix + "\n" + joined_chunks + "\n\n" + suffix

    os.makedirs(os.path.dirname(os.path.abspath(args.output)), exist_ok=True)
    with open(args.output, "w", encoding="utf-8") as f:
        f.write(full_html)
    print(f"[OK] Wrote {args.output} ({len(full_html.encode('utf-8'))} bytes)")

    scripts = re.findall(r"<script[^>]*>(.*?)</script>", full_html, flags=re.S)
    for idx, sc in enumerate(scripts):
        with tempfile.NamedTemporaryFile("w", suffix=".js", encoding="utf-8", delete=False) as tf:
            tf.write(sc)
            tpath = tf.name
        res = subprocess.run(
            ["osascript", "-l", "JavaScript", "-e", f'ObjC.import("Foundation"); var s = $.NSString.stringWithContentsOfFileEncodingError({tpath!r}, $.NSUTF8StringEncoding, null).js; new Function(s); "OK"'],
            capture_output=True, text=True
        )
        os.unlink(tpath)
        if res.returncode != 0:
            raise RuntimeError(f"JS syntax error in script block {idx}: {res.stderr}")
    print("[OK] JavaScript syntax check passed (0 errors)")

    # Automated runtime simulation & DOM wrapper audit across all slides (steps 0..4)
    sc0 = scripts[0]
    cut_idx = sc0.find("const slides = [")
    if cut_idx > 0:
        sc_defs = sc0[:cut_idx] + """
const slides = [
  ...(window.UNIT1_THEOREM_SLIDES || []),
  ...(window.UNIT2_THEOREM_SLIDES || []),
  ...(window.UNIT3_THEOREM_SLIDES || [])
];
const ALL_SIMS = Object.assign({}, window.UNIT1_SIMS || {}, window.UNIT2_SIMS || {}, window.UNIT3_SIMS || {});
"""
        runtime_harness = """
(function() {
var window = this;
var document = {
  body: { classList: { contains: function(){ return false; }, toggle: function(){}, remove: function(){} }, dataset: {} },
  documentElement: { style: { setProperty: function(){} } },
  getElementById: function(id) { return null; },
  querySelector: function(sel) { return null; },
  querySelectorAll: function(sel) { return []; },
  addEventListener: function() {},
  createElement: function() { return { classList: { add:function(){}, remove:function(){} }, style:{}, setAttribute:function(){}, prepend:function(){}, append:function(){}, querySelector:function(){return null;}, querySelectorAll:function(){return [];} }; }
};
var location = { hash: "" };
var localStorage = { getItem: function(){return null;}, setItem: function(){} };
var matchMedia = function(){ return { matches: false, addEventListener: function(){} }; };
var cancelAnimationFrame = function(){};
var requestAnimationFrame = function(){};
var queueMicrotask = function(){};
var setTimeout = function(){};
var clearTimeout = function(){};
var innerWidth = 1600, innerHeight = 900;
""" + sc_defs + """
function cjkLen(s) {
  var plain = String(s || "").replace(/<[^>]+>/g, "");
  var w = 0;
  for (var i = 0; i < plain.length; i++) w += (plain.charCodeAt(i) > 127 ? 1 : 0.55);
  return w;
}
if (window.COURSEWARE_BRAND && cjkLen(window.COURSEWARE_BRAND) > 15) {
  throw new Error("Top flowbar overflow: window.COURSEWARE_BRAND ('" + window.COURSEWARE_BRAND + "') exceeds 15 CJK chars!");
}
if (window.COURSEWARE_TITLE && cjkLen(window.COURSEWARE_TITLE) > 15) {
  throw new Error("Top flowbar overflow: window.COURSEWARE_TITLE ('" + window.COURSEWARE_TITLE + "') exceeds 15 CJK chars!");
}
if (Array.isArray(window.COURSEWARE_PHASES)) {
  for (var pi = 0; pi < window.COURSEWARE_PHASES.length; pi++) {
    var ph = window.COURSEWARE_PHASES[pi];
    if (ph && ph[0] && cjkLen(ph[0]) > 7.5) {
      throw new Error("Top flowbar phase title overflow: '" + ph[0] + "' exceeds 7 chars!");
    }
    if (ph && ph[1] && cjkLen(ph[1]) > 10.5) {
      throw new Error("Top flowbar phase subtitle overflow: '" + ph[1] + "' exceeds 10 chars (causes chevron text clipping)!");
    }
  }
}
for (var idx = 0; idx < slides.length; idx++) {
  var sl = slides[idx];
  if (!sl.cover && (sl.html.indexOf("screen-page") < 0 || sl.html.indexOf("screen-lower") < 0)) {
    throw new Error("Slide " + idx + " missing .screen-page or .screen-lower wrapper!");
  }
  var plainSlideHtml = String(sl.html || "").replace(/<[^>]+>/g, "");
  if (/<\\/?(?:span|div|i|b|sup|sub)\\b|span>|<i class=\\"m\\">span<\\/i>/i.test(plainSlideHtml) || /<i class=\\"m\\">span<\\/i>/.test(String(sl.html || ""))) {
    throw new Error("Slide " + idx + " (" + sl.navTag + ") CORRUPTED HTML TAG LEAK IN TEXT: Found literal 'span>' or '<i class=\\"m\\">span</i>' in rendered slide HTML!");
  }
  if (/(?:∽|相似)[^。；！\\n≅≌]{0,28}[（(]\\s*(?:AA|SAS|SSS|ASA|AAS|HL)\\s*[）)]/.test(plainSlideHtml)) {
    throw new Error("Slide " + idx + " (" + sl.navTag + ") FORBIDDEN SIMILARITY PROOF SYMBOL: Triangle similarity (∽ / 相似) must NEVER have (AA)/(SAS)/(SSS) in parentheses (only congruence ≌ uses them)!");
  }
  if (/√/.test(String(sl.html || ""))) {
    throw new Error("Slide " + idx + " (" + sl.navTag + ") BARE RADICAL '√' IN HTML WITHOUT .sqrt VINCULUM: Use '<span class=\\"sqrt\\"><span class=\\"num\\">3</span></span>' instead of raw '√3' so the horizontal top bar (vinculum) is rendered and KaiTi checkmark fallback never occurs!");
  }
  if (!sl.sim) continue;
  var fn = ALL_SIMS[sl.sim];
  if (!fn) throw new Error("Slide " + idx + " missing sim function: " + sl.sim);
  var stepCardMatches = sl.html.match(/class=["'][^"']*\\b(step|prob-step-card)\\b/g) || [];
  var stepCardCount = stepCardMatches.length;
  var blankStepMatches = sl.html.match(/data-step=["'](\\d+)["']/g) || [];
  var maxBlankStep = 0;
  for (var bi = 0; bi < blankStepMatches.length; bi++) {
    var bnum = parseInt(blankStepMatches[bi].replace(/\\D+/g, ""), 10) || 0;
    if (bnum > maxBlankStep) maxBlankStep = bnum;
  }
  var controlsEl = { innerHTML: "", dataset: {} }, sceneEl = { innerHTML: "", dataset: {} };
  activeRoot = function() {
    return {
      querySelector: function(sel) {
        if (sel === "#controls") return controlsEl;
        if (sel === "#scene" || sel === ".sim-Host" || sel === "#scene, .sim-Host" || sel === ".screen-lab") return sceneEl;
        return null;
      },
      querySelectorAll: function() { return []; }
    };
  };
  var st = { step: 0, manualBlocks: {}, manualCells: {}, manualNotes: {}, manualProbNodes: {}, manualOverrides: {} };
  if (typeof fn === "function") fn(st, true);
  else { if (fn.init) fn.init(st); fn.render(st); }
  var dotMatches = (controlsEl.innerHTML || "").match(/data-step-goto=["'](\\d+)["']/g) || [];
  var dotCount = dotMatches.length;
  if (stepCardCount > 0 && dotCount > 0 && stepCardCount !== dotCount) {
    throw new Error("Slide " + idx + " (" + sl.sim + ") 1-to-1 step mismatch: has " + stepCardCount + " .step cards in HTML but stepBar(step, " + dotCount + ") has " + dotCount + " progress dots! They MUST be strictly equal.");
  }
  if (maxBlankStep > dotCount && dotCount > 0) {
    throw new Error("Slide " + idx + " (" + sl.sim + ") has screen-blank with data-step=" + maxBlankStep + " exceeding maxStep=" + dotCount + "!");
  }
  var modeBtnMatches = (controlsEl.innerHTML || "").match(/data-mode-key=/g) || [];
  var syncBtnMatches = (controlsEl.innerHTML || "").match(/data-sync-step=/g) || [];
  if (dotCount > 1 && modeBtnMatches.length > 0 && syncBtnMatches.length < modeBtnMatches.length) {
    throw new Error("Slide " + idx + " (" + sl.sim + ") has modeButtons without syncStep (3rd element in item tuple)! Every mode button on a multi-step slide must sync with state.step.");
  }
  var totalStepsToTest = Math.max(4, dotCount, stepCardCount);
  for (var s = 0; s <= totalStepsToTest; s++) {
    st.step = s;
    if (typeof fn === "function") fn(st, s === 0);
    else { if (s === 0 && fn.init) fn.init(st); fn.render(st); }
    var isLayoutA = sl.html.indexOf("layout-a") >= 0 && sl.html.indexOf('id="scene"') < 0 && sl.html.indexOf("id='scene'") < 0;
    if (!isLayoutA && (!sceneEl.innerHTML || sceneEl.innerHTML.indexOf("<svg") < 0)) {
      throw new Error("Slide " + idx + " (" + sl.sim + ") produced empty SVG at step " + s);
    }
    if (/\\<0/.test(sceneEl.innerHTML) || /\\<\\s+0/.test(sceneEl.innerHTML)) {
      throw new Error("Slide " + idx + " (" + sl.sim + ") contains unescaped '<0' in SVG at step " + s + " (will corrupt DOM)!");
    }
    var polyRe = /<polygon[^>]*points=["']([^"']+)["'][^>]*>/g, pm;
    while ((pm = polyRe.exec(sceneEl.innerHTML)) !== null) {
      var tagStr = pm[0], ptsStr = pm[1].trim();
      if (tagStr.indexOf('fill="#1e293b"') >= 0 || tagStr.indexOf('fill="#334155"') >= 0 || tagStr.indexOf('fill="#dc2626"') >= 0) {
        var pairs = ptsStr.split(/\\s+/);
        if (pairs.length === 3) {
          var xs = [], ys = [];
          for (var pi = 0; pi < 3; pi++) {
            var xy = pairs[pi].split(",");
            xs.push(parseFloat(xy[0]));
            ys.push(parseFloat(xy[1]));
          }
          var bw = Math.max.apply(null, xs) - Math.min.apply(null, xs);
          var bh = Math.max.apply(null, ys) - Math.min.apply(null, ys);
          if (bw > 28 || bh > 28) {
            throw new Error("Slide " + idx + " (" + sl.sim + ") has a distorted arrowhead <polygon points='" + ptsStr + "'> (bbox " + bw.toFixed(1) + "x" + bh.toFixed(1) + "px > 28px)! Check c.sx/c.sy coordinates.");
          }
        }
      }
    }
    if (!controlsEl.innerHTML || controlsEl.innerHTML.indexOf("step-ctrl-bar") < 0) {
      throw new Error("Slide " + idx + " (" + sl.sim + ") missing stepBar at step " + s);
    }
    if (s <= dotCount) {
      var svgStr = sceneEl.innerHTML || "";
      var isLayoutC = sl.html.indexOf("layout-c") >= 0;
      var svgOpenTags = svgStr.match(/<svg\\b/gi) || [];
      if (!isLayoutC && svgOpenTags.length > 1) {
        throw new Error("Slide " + idx + " (" + sl.navTag + " step=" + s + ") FORBIDDEN NESTED <svg> DETECTED (" + svgOpenTags.length + " <svg> tags)! Nested <svg> inside .visual gets blown up to 100% width/height by CSS. Use pure SVG primitives (<path>, <polygon>, <line>, <rect>, <text>) instead.");
      }
      var tRe = /<text([^>]*)>([\\s\\S]*?)<\\/text>/g, tm, texts = [];
      while ((tm = tRe.exec(svgStr)) !== null) {
        var tAttrs = tm[1], tInner = tm[2];
        var xm = tAttrs.match(/\\bx=["']([^"']+)["']/), ym = tAttrs.match(/\\by=["']([^"']+)["']/);
        if (!xm || !ym) continue;
        var tx = parseFloat(xm[1]), ty = parseFloat(ym[1]);
        var prefixSvg = svgStr.slice(0, tm.index);
        var gStack = [], gTokRe = /<(\\/?)g\\b([^>]*)>/gi, gtm;
        while ((gtm = gTokRe.exec(prefixSvg)) !== null) {
          if (gtm[1] === "/") { gStack.pop(); }
          else if (!/\\/\\s*$/.test(gtm[2])) {
            var trm = gtm[2].match(/transform=["'][^"']*translate\\(\\s*([\\d.+\\-]+)(?:[\\s,]+([\\d.+\\-]+))?\\s*\\)/i);
            gStack.push(trm ? [parseFloat(trm[1]) || 0, parseFloat(trm[2]) || 0] : [0, 0]);
          }
        }
        for (var gi = 0; gi < gStack.length; gi++) { tx += gStack[gi][0]; ty += gStack[gi][1]; }
        var am = tAttrs.match(/text-anchor=["']([^"']+)["']/);
        var anchor = am ? am[1] : "start";
        var sm = tAttrs.match(/font-size=["']([^"']+)["']/);
        var fsize = sm ? parseFloat(sm[1]) : 14;
        var raw = tInner.replace(/<[^>]+>/g, "").replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&amp;/g, "&").replace(/\\s+/g, " ").trim();
        if (!raw) continue;
        if (/(?:[A-Za-z]{1,4}\s*=\s*|:\s*)\d+\/\d+(?:\([^)]+\))?|\(\s*\d+[A-Za-z0-9_+\-\s]*\)\/\d+|\b\d+\/\d+\s*\([A-Za-z0-9_+\-\s]+\)/.test(raw)) {
          throw new Error("Slide " + idx + " (" + sl.navTag + " step=" + s + ") BARE SLASH FRACTION IN SVG TEXT: Found literal single-line slash equation '" + raw + "'. In dynamic courseware, all geometry/algebra fraction labels MUST be rendered using window.svgFoLabel() with standard 2D stacked .fraction HTML layout instead of raw single-line slashes (e.g. '4/3(4-x)')!");
        }
        var tw = 0;
        for (var ci = 0; ci < raw.length; ci++) {
          var cc = raw.charCodeAt(ci);
          tw += fsize * (cc === 32 ? 0.28 : (cc > 127 ? 0.95 : 0.54));
        }
        var x1 = anchor === "middle" ? tx - tw / 2 : (anchor === "end" ? tx - tw : tx);
        var x2 = x1 + tw, y1 = ty - fsize * 0.82, y2 = ty + fsize * 0.18;
        texts.push({ pos: tm.index, raw: raw, x1: x1, x2: x2, y1: y1, y2: y2 });
      }
      for (var ti = 0; ti < texts.length; ti++) {
        for (var tj = ti + 1; tj < texts.length; tj++) {
          var a = texts[ti], b = texts[tj];
          if (a.raw === b.raw && Math.abs(a.x1 - b.x1) < 1.5 && Math.abs(a.y1 - b.y1) < 1.5) continue;
          if (a.x1 < b.x2 - 4 && a.x2 > b.x1 + 4 && a.y1 < b.y2 - 2.5 && a.y2 > b.y1 + 2.5) {
            throw new Error("Slide " + idx + " (" + sl.navTag + " step=" + s + ") SVG TEXT-TEXT OVERLAP: '" + a.raw + "' overlaps '" + b.raw + "'!");
          }
        }
      }
      var rRe = /<rect([^>]*)\\/?>/g, rm;
      while ((rm = rRe.exec(svgStr)) !== null) {
        var rAttrs = rm[1];
        var rxm = rAttrs.match(/\\bx=["']([^"']+)["']/), rym = rAttrs.match(/\\by=["']([^"']+)["']/);
        var rwm = rAttrs.match(/\\bwidth=["']([^"']+)["']/), rhm = rAttrs.match(/\\bheight=["']([^"']+)["']/);
        var rfm = rAttrs.match(/\\bfill=["']([^"']+)["']/);
        if (!rxm || !rym || !rwm || !rhm) continue;
        var rx = parseFloat(rxm[1]), ry = parseFloat(rym[1]), rw = parseFloat(rwm[1]), rh = parseFloat(rhm[1]);
        var rfill = rfm ? rfm[1] : "";
        if (rfill.indexOf("rgba") === 0 || rfill === "none" || rw > 420 || rw <= 24) continue;
        for (var tk = 0; tk < texts.length; tk++) {
          var t = texts[tk];
          if (rh > 80 && rm.index < t.pos) continue;
          var ox = Math.max(0, Math.min(rx + rw, t.x2) - Math.max(rx, t.x1));
          var oy = Math.max(0, Math.min(ry + rh, t.y2) - Math.max(ry, t.y1));
          if (ox > 0 && oy > 0) {
            var inside = (t.x1 >= rx - 2 && t.x2 <= rx + rw + 2 && t.y1 >= ry - 2 && t.y2 <= ry + rh + 2);
            if (!inside || rm.index > t.pos) {
              throw new Error("Slide " + idx + " (" + sl.navTag + " step=" + s + ") SVG RECT-TEXT OCCLUSION: rect(" + Math.round(rx) + "," + Math.round(ry) + "," + Math.round(rw) + "x" + Math.round(rh) + ") occludes/clips text '" + t.raw + "'!");
            }
          }
        }
      }
      var eRe = /<ellipse([^>]*)\\/?>/g, em;
      while ((em = eRe.exec(svgStr)) !== null) {
        var eAttrs = em[1];
        var cxm = eAttrs.match(/\\bcx=["']([^"']+)["']/), cym = eAttrs.match(/\\bcy=["']([^"']+)["']/);
        var erxm = eAttrs.match(/\\brx=["']([^"']+)["']/), erym = eAttrs.match(/\\bry=["']([^"']+)["']/);
        if (!cxm || !cym || !erxm || !erym) continue;
        var ecx = parseFloat(cxm[1]), ecy = parseFloat(cym[1]), erx = parseFloat(erxm[1]), ery = parseFloat(erym[1]);
        for (var te = 0; te < texts.length; te++) {
          var teItem = texts[te];
          if ((ecx - erx) < teItem.x2 && (ecx + erx) > teItem.x1 && (ecy - ery) < teItem.y2 && (ecy + ery) > teItem.y1) {
            throw new Error("Slide " + idx + " (" + sl.navTag + " step=" + s + ") SVG ELLIPSE-TEXT OVERLAP: ellipse(" + Math.round(ecx) + "," + Math.round(ecy) + ") overlaps text '" + teItem.raw + "'!");
          }
        }
      }
      var foRe = /<foreignObject([^>]*)>([\\s\\S]*?)<\\/foreignObject>/g, fom, fos = [];
      while ((fom = foRe.exec(svgStr)) !== null) {
        var fAttrs = fom[1];
        if (/√/.test(fom[2])) {
          throw new Error("Slide " + idx + " (" + sl.navTag + " step=" + s + ") BARE RADICAL '√' IN SVG foreignObject WITHOUT .sqrt VINCULUM: Use '<span class=\\"sqrt\\"><span class=\\"num\\">3</span></span>' instead of raw '√3'!");
        }
        var fxm = fAttrs.match(/\\bx=["']([^"']+)["']/), fym = fAttrs.match(/\\by=["']([^"']+)["']/);
        var fwm = fAttrs.match(/\\bwidth=["']([^"']+)["']/), fhm = fAttrs.match(/\\bheight=["']([^"']+)["']/);
        if (!fxm || !fym || !fwm || !fhm) continue;
        var fx = parseFloat(fxm[1]), fy = parseFloat(fym[1]), fw = parseFloat(fwm[1]), fh = parseFloat(fhm[1]);
        var fRaw = fom[2].replace(/<[^>]+>/g, "").trim().slice(0, 24);
        fos.push({ x1: fx, y1: fy, x2: fx + fw, y2: fy + fh, raw: fRaw });
      }
      for (var fi = 0; fi < fos.length; fi++) {
        var fo = fos[fi];
        for (var ft = 0; ft < texts.length; ft++) {
          var tt = texts[ft];
          if (fo.x1 < tt.x2 - 2 && fo.x2 > tt.x1 + 2 && fo.y1 < tt.y2 - 2 && fo.y2 > tt.y1 + 2) {
            throw new Error("Slide " + idx + " (" + sl.navTag + " step=" + s + ") SVG FOREIGNOBJECT-TEXT OVERLAP: foreignObject('" + fo.raw + "') overlaps text '" + tt.raw + "'!");
          }
        }
        for (var fj = fi + 1; fj < fos.length; fj++) {
          var fo2 = fos[fj];
          if (fo.x1 < fo2.x2 - 2 && fo.x2 > fo2.x1 + 2 && fo.y1 < fo2.y2 - 2 && fo.y2 > fo2.y1 + 2) {
            throw new Error("Slide " + idx + " (" + sl.navTag + " step=" + s + ") SVG FOREIGNOBJECT-FOREIGNOBJECT OVERLAP: '" + fo.raw + "' overlaps '" + fo2.raw + "'!");
          }
        }
      }
    }
  }
  var mbRe = /<button[^>]*data-mode-key=["']([^"']+)["'][^>]*data-mode-val=["']([^"']+)["'][^>]*>/g, mbm, modeItems = [];
  while ((mbm = mbRe.exec(controlsEl.innerHTML || "")) !== null) {
    var ssm = mbm[0].match(/data-sync-step=["']([^"']+)["']/);
    modeItems.push({ key: mbm[1], val: mbm[2], syncStep: ssm ? Number(ssm[1]) : undefined });
  }
  if (modeItems.length >= 2) {
    var modeScenes = {};
    for (var mi = 0; mi < modeItems.length; mi++) {
      var item = modeItems[mi];
      st[item.key] = (typeof st[item.key] === "number") ? (isNaN(+item.val) ? item.val : +item.val) : item.val;
      if (item.syncStep !== undefined) st.step = Math.max(Number(st.step || 0), item.syncStep);
      if (typeof window.setManualOverride === "function") window.setManualOverride(st, item.key);
      if (typeof fn === "function") fn(st, false); else fn.render(st);
      modeScenes[item.val] = sceneEl.innerHTML;
    }
    var firstItem = modeItems[0];
    st[firstItem.key] = (typeof st[firstItem.key] === "number") ? (isNaN(+firstItem.val) ? firstItem.val : +firstItem.val) : firstItem.val;
    if (firstItem.syncStep !== undefined) st.step = Math.max(Number(st.step || 0), firstItem.syncStep);
    if (typeof window.setManualOverride === "function") window.setManualOverride(st, firstItem.key);
    if (typeof fn === "function") fn(st, false); else fn.render(st);
    if (sceneEl.innerHTML !== modeScenes[firstItem.val]) {
      throw new Error("Slide " + idx + " (" + sl.navTag + ") MODE BUTTON ROUND-TRIP STUCK: Clicking mode '" + firstItem.val + "' after mode '" + modeItems[modeItems.length - 1].val + "' failed to restore scene SVG!");
    }
    if (modeItems.length >= 2 && modeScenes[modeItems[0].val] === modeScenes[modeItems[1].val]) {
      throw new Error("Slide " + idx + " (" + sl.navTag + ") MODE BUTTON NO-OP: Mode '" + modeItems[0].val + "' and Mode '" + modeItems[1].val + "' produced identical SVG (check string vs number comparison in renderScene)!");
    }
  }
}
return "Runtime, 1-to-1 Step Consistency & Zero-Occlusion SVG audit passed (" + slides.length + " slides verified across all steps)";
})();
"""
        with tempfile.NamedTemporaryFile("w", suffix=".js", encoding="utf-8", delete=False) as rtf:
            rtf.write(runtime_harness)
            rpath = rtf.name
        rres = subprocess.run(["osascript", "-l", "JavaScript", rpath], capture_output=True, text=True)
        os.unlink(rpath)
        if rres.returncode != 0:
            raise RuntimeError(f"Runtime simulation check failed: {rres.stderr}")
        print(f"[OK] {rres.stdout.strip()}")

if __name__ == "__main__":
    main()

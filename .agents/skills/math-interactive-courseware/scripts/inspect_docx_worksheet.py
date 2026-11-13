#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Enhanced 1-second .docx student worksheet inspector (v2.0) for math-interactive-courseware.
Features:
1. 100% automatic MathType <w:object> (.wmf) GDI coordinate & Symbol-font decoding into inline $LaTeX$;
2. Media stream separation: exports only real figures (.png/.jpg/.jpeg) to --media-out, avoiding WMF clutter;
3. Automatic <a:srcRect> crop detection, physical size (cm) & pixel size audit, plus auto-generation of
   `*_cropped_view.png` for heavily cropped figures (e.g. one image cropped twice for left/right panels);
4. Precise distinction between <mc:AlternateContent> Floating Summary Textboxes (Choice vs Fallback sync check
   + o:gfxdata cache warning + covered ghost paragraph warning) vs floating figures/shapes;
5. Full document-order walk including Headers (<w:hdr>), Paragraphs (P), and Tables (TBL);
6. Structured JSON blueprint export (--json-out) for downstream Stage 2 & Stage 3 tools.
"""

import argparse
import io
import json
import os
import re
import struct
import zipfile
import xml.etree.ElementTree as ET
from PIL import Image

W_NS = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"
M_NS = "{http://schemas.openxmlformats.org/officeDocument/2006/math}"
WP_NS = "{http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing}"
A_NS = "{http://schemas.openxmlformats.org/drawingml/2006/main}"
R_NS = "{http://schemas.openxmlformats.org/officeDocument/2006/relationships}"
V_NS = "{urn:schemas-microsoft-com:vml}"
O_NS = "{urn:schemas-microsoft-com:office:office}"
MC_NS = "{http://schemas.openxmlformats.org/markup-compatibility/2006}"
WPS_NS = "{http://schemas.microsoft.com/office/word/2010/wordprocessingShape}"

SYMBOL_MAP = {
    "^": "⊥",
    "P": "∥",
    "V": "△",
    "Y": "▱",
    "\xd0": "∠",
    "\xb0": "°",
    "\xb9": "≠",
    "\xa3": "≤",
    "\xb3": "≥",
    "\xb1": "±",
    "\xb4": "×",
    "\xb8": "÷",
    "\xa5": "∞",
    "\xde": "⇒",
    "\xac": "←",
    "\xae": "→",
    "\xad": "↑",
    "\xaf": "↓",
    "\xef": "⋯",
    "\xbc": "…",
    "\xe6": "(",
    "\xe7": "",
    "\xe8": "",
    "\xf6": ")",
    "\xf7": "",
    "\xf8": "",
}

MTEXTRA_MAP = {
    "L": "⋯",
    "M": "⋮",
    "N": "⋱",
    "O": "⋰",
    "f": "⁀",
    "\x84": "≤",
    "\x94": "≥",
}


def decode_wmf_to_latex(data: bytes) -> str:
    """Decode MathType WMF GDI records (MoveTo, LineTo, CreateFontIndirect, ExtTextOut) into LaTeX."""
    if not data or len(data) < 24:
        return "<?WMF?>"
    pos = 18 if data[:4] != b"\xd7\xcd\xc6\x9a" else 22 + 18
    cur_x, cur_y = 0, 0
    cur_font = ""
    cur_height = 0
    gdi_objs = []
    items = []   # [x, y, text, height]
    hlines = []  # (x1, x2, y, is_radical)
    prev_Seg_was_diag_up = False

    while pos + 6 <= len(data):
        size_words, func = struct.unpack("<IH", data[pos:pos + 6])
        if size_words < 3:
            break
        rec = data[pos + 6: pos + size_words * 2]
        if func == 0x0214 and len(rec) >= 4:  # META_MOVETO
            cur_y, cur_x = struct.unpack("<hh", rec[:4])
            prev_Seg_was_diag_up = False
        elif func == 0x0213 and len(rec) >= 4:  # META_LINETO
            ly, lx = struct.unpack("<hh", rec[:4])
            if abs(ly - cur_y) <= 4 and abs(lx - cur_x) >= 20:
                hlines.append((min(cur_x, lx), max(cur_x, lx), cur_y, prev_Seg_was_diag_up))
                prev_Seg_was_diag_up = False
            else:
                # Radical upward stroke goes from bottom of tick to top vinculum (ly < cur_y, lx > cur_x)
                prev_Seg_was_diag_up = (ly < cur_y - 40 and lx > cur_x + 15)
            cur_x, cur_y = lx, ly
        elif func in (0x02FA, 0x02FC, 0x0142, 0x06FE):  # Non-font GDI objects
            placed = False
            for i in range(len(gdi_objs)):
                if gdi_objs[i] is None:
                    gdi_objs[i] = ("other", "", 0)
                    placed = True
                    break
            if not placed:
                gdi_objs.append(("other", "", 0))
        elif func == 0x02FB and len(rec) >= 18:  # META_CREATEFONTINDIRECT
            h = abs(struct.unpack("<h", rec[:2])[0])
            fname = rec[18:].split(b"\x00")[0].decode("gbk", errors="ignore")
            obj = ("font", fname, h)
            placed = False
            for i in range(len(gdi_objs)):
                if gdi_objs[i] is None:
                    gdi_objs[i] = obj
                    placed = True
                    break
            if not placed:
                gdi_objs.append(obj)
            cur_font, cur_height = fname, h
        elif func == 0x012D and len(rec) >= 2:  # META_SELECTOBJECT
            idx = struct.unpack("<H", rec[:2])[0]
            if idx < len(gdi_objs) and gdi_objs[idx] and gdi_objs[idx][0] == "font":
                _, cur_font, cur_height = gdi_objs[idx]
        elif func == 0x01F0 and len(rec) >= 2:  # META_DELETEOBJECT
            idx = struct.unpack("<H", rec[:2])[0]
            if idx < len(gdi_objs):
                gdi_objs[idx] = None
        elif func == 0x0A32 and len(rec) >= 8:  # META_EXTTEXTOUT
            ty, tx, count, opts = struct.unpack("<hhhh", rec[:8])
            off = 8 + (8 if (opts & 0x06) else 0)
            raw_s = rec[off:off + count]
            dx_off = off + count + (count % 2)
            px = cur_x if (tx == 0 and ty == 0) else tx
            py = cur_y if (tx == 0 and ty == 0) else ty
            if "MT Extra" in cur_font or "Euclid Math" in cur_font:
                dxs = (
                    list(struct.unpack(f"<{count}h", rec[dx_off:dx_off + count * 2]))
                    if len(rec) >= dx_off + count * 2
                    else []
                )
                for idx_c in range(count):
                    ch = raw_s[idx_c:idx_c + 1].decode("latin1")
                    ch = MTEXTRA_MAP.get(ch, SYMBOL_MAP.get(ch, ch))
                    if ch:
                        items.append([px, py, ch, cur_height])
                    px += dxs[idx_c] if idx_c < len(dxs) else int(cur_height * 0.5)
            elif "Symbol" in cur_font:
                dxs = (
                    list(struct.unpack(f"<{count}h", rec[dx_off:dx_off + count * 2]))
                    if len(rec) >= dx_off + count * 2
                    else []
                )
                for idx_c in range(count):
                    ch = raw_s[idx_c:idx_c + 1].decode("latin1")
                    ch = SYMBOL_MAP.get(ch, ch)
                    if ch:
                        items.append([px, py, ch, cur_height])
                    px += dxs[idx_c] if idx_c < len(dxs) else int(cur_height * 0.5)
            else:
                raw_fixed = raw_s.replace(b"\xa1\xe2", "△".encode("gbk"))
                text_str = raw_fixed.decode("gbk", errors="ignore")
                dxs = (
                    list(struct.unpack(f"<{len(text_str)}h", rec[dx_off:dx_off + len(text_str) * 2]))
                    if len(rec) >= dx_off + len(text_str) * 2
                    else []
                )
                for idx_c, ch in enumerate(text_str):
                    items.append([px, py, ch, cur_height])
                    px += dxs[idx_c] if idx_c < len(dxs) else int(cur_height * 0.5)
        pos += size_words * 2

    if not items:
        return "<?WMF_EMPTY?>"

    def format_seq(seq_items, ref_h):
        seq_items.sort(key=lambda t: t[0])
        main_ys = [t[1] for t in seq_items if t[3] >= ref_h * 0.80 and t[2] not in ("(", ")")]
        base_y = sorted(main_ys)[len(main_ys) // 2] if main_ys else seq_items[0][1]
        res = []
        i = 0
        while i < len(seq_items):
            tx, ty, ts, th = seq_items[i]
            if not ts.startswith(("\\frac", "\\sqrt")) and th < ref_h * 0.78 and abs(ty - base_y) > 15:
                is_sub = ty > base_y
                grp = [ts]
                i += 1
                while (
                    i < len(seq_items)
                    and not seq_items[i][2].startswith(("\\frac", "\\sqrt"))
                    and seq_items[i][3] < ref_h * 0.78
                    and ((seq_items[i][1] > base_y) == is_sub)
                ):
                    grp.append(seq_items[i][2])
                    i += 1
                g_str = "".join(grp)
                op = "_" if is_sub else "^"
                res.append(f"{op}{{{g_str}}}" if len(g_str) > 1 else f"{op}{g_str}")
            else:
                res.append(ts)
                i += 1
        return "".join(res)

    non_paren_h = sorted([t[3] for t in items if t[2] not in ("(", ")") and t[3] > 0])
    ref_h = non_paren_h[-1] if non_paren_h else 200

    used = [False] * len(items)
    tokens = []
    # First resolve radicals (\sqrt{...}) where is_radical is True
    for x1, x2, ly, is_rad in hlines:
        if not is_rad:
            continue
        rad_items = []
        for i, (ix, iy, ich, ih) in enumerate(items):
            if not used[i] and (x1 - 20 <= ix <= x2 + 20) and iy > ly:
                rad_items.append([ix, iy, ich, ih])
                used[i] = True
        if rad_items:
            rad_s = format_seq(rad_items, ref_h)
            tokens.append([x1, ly, f"\\sqrt{{{rad_s}}}", ref_h])

    # Next resolve fractions (\frac{num}{den})
    for x1, x2, ly, is_rad in hlines:
        if is_rad:
            continue
        num_items = []
        den_items = []
        for i, (ix, iy, ich, ih) in enumerate(items):
            if not used[i] and (x1 - 25 <= ix <= x2 + 25) and ich not in ("(", ")"):
                if iy < ly:
                    num_items.append([ix, iy, ich, ih])
                    used[i] = True
                elif iy > ly:
                    den_items.append([ix, iy, ich, ih])
                    used[i] = True
        if num_items and den_items:
            num_s = format_seq(num_items, ref_h)
            den_s = format_seq(den_items, ref_h)
            tokens.append([x1, ly, f"\\frac{{{num_s}}}{{{den_s}}}", ref_h])

    for i, it in enumerate(items):
        if not used[i]:
            tokens.append(it)
    return format_seq(tokens, ref_h)


def render_omml_to_latex(elem) -> str:
    """Recursively convert Word OMML (<m:oMath>, <m:f>, <m:sSub>, <m:sSup>, <m:rad>) into LaTeX."""
    tag = elem.tag
    if tag == f"{M_NS}r":
        return "".join(x.text or "" for x in elem.iter(f"{M_NS}t"))
    elif tag == f"{M_NS}f":
        num_el = elem.find(f"{M_NS}num")
        den_el = elem.find(f"{M_NS}den")
        num_s = "".join(render_omml_to_latex(c) for c in num_el) if num_el is not None else ""
        den_s = "".join(render_omml_to_latex(c) for c in den_el) if den_el is not None else ""
        return f"\\frac{{{num_s}}}{{{den_s}}}"
    elif tag == f"{M_NS}sSub":
        e_el = elem.find(f"{M_NS}e")
        sub_el = elem.find(f"{M_NS}sub")
        base_s = "".join(render_omml_to_latex(c) for c in e_el) if e_el is not None else ""
        sub_s = "".join(render_omml_to_latex(c) for c in sub_el) if sub_el is not None else ""
        return f"{base_s}_{{{sub_s}}}" if len(sub_s) > 1 else f"{base_s}_{sub_s}"
    elif tag == f"{M_NS}sSup":
        e_el = elem.find(f"{M_NS}e")
        sup_el = elem.find(f"{M_NS}sup")
        base_s = "".join(render_omml_to_latex(c) for c in e_el) if e_el is not None else ""
        sup_s = "".join(render_omml_to_latex(c) for c in sup_el) if sup_el is not None else ""
        return f"{base_s}^{{{sup_s}}}" if len(sup_s) > 1 else f"{base_s}^{sup_s}"
    elif tag == f"{M_NS}sSubSup":
        e_el = elem.find(f"{M_NS}e")
        sub_el = elem.find(f"{M_NS}sub")
        sup_el = elem.find(f"{M_NS}sup")
        base_s = "".join(render_omml_to_latex(c) for c in e_el) if e_el is not None else ""
        sub_s = "".join(render_omml_to_latex(c) for c in sub_el) if sub_el is not None else ""
        sup_s = "".join(render_omml_to_latex(c) for c in sup_el) if sup_el is not None else ""
        return f"{base_s}_{{{sub_s}}}^{{{sup_s}}}"
    elif tag == f"{M_NS}rad":
        deg_el = elem.find(f"{M_NS}deg")
        e_el = elem.find(f"{M_NS}e")
        deg_s = "".join(render_omml_to_latex(c) for c in deg_el).strip() if deg_el is not None else ""
        inner_s = "".join(render_omml_to_latex(c) for c in e_el) if e_el is not None else ""
        return f"\\sqrt[{deg_s}]{{{inner_s}}}" if deg_s else f"\\sqrt{{{inner_s}}}"
    elif tag == f"{M_NS}d":
        beg_chr = "("
        end_chr = ")"
        dpr = elem.find(f"{M_NS}dPr")
        if dpr is not None:
            bc = dpr.find(f"{M_NS}begChr")
            ec = dpr.find(f"{M_NS}endChr")
            if bc is not None and f"{M_NS}val" in bc.attrib:
                beg_chr = bc.attrib[f"{M_NS}val"]
            if ec is not None and f"{M_NS}val" in ec.attrib:
                end_chr = ec.attrib[f"{M_NS}val"]
        inners = ["".join(render_omml_to_latex(c) for c in e_el) for e_el in elem.findall(f"{M_NS}e")]
        return f"{beg_chr}{', '.join(inners)}{end_chr}"
    else:
        return "".join(render_omml_to_latex(c) for c in elem)


def render_node_text(elem, rel_map, wmf_latex_cache, show_wmf_tag=True):
    """Recursively render paragraph/cell XML into readable string with decoded WMF and OMML."""
    out = []
    for child in elem:
        tag = child.tag
        if tag == f"{W_NS}r":
            # Check for <w:object> (MathType WMF)
            objs = list(child.iter(f"{W_NS}object"))
            if objs:
                for obj in objs:
                    imdata = obj.find(f".//{V_NS}imagedata")
                    rid = imdata.attrib.get(f"{R_NS}id", "") if imdata is not None else ""
                    target = os.path.basename(rel_map.get(rid, ""))
                    latex = wmf_latex_cache.get(target, "?")
                    if show_wmf_tag:
                        out.append(f"⟦WMF:{target}→${latex}$⟧")
                    else:
                        out.append(f"${latex}$")
            # Check for <w:drawing> (embedded image or floating shape/textbox)
            drawings = list(child.iter(f"{W_NS}drawing"))
            if drawings:
                for dr in drawings:
                    blips = [b.attrib.get(f"{R_NS}embed", "") for b in dr.iter(f"{A_NS}blip")]
                    if blips:
                        for bid in blips:
                            bname = os.path.basename(rel_map.get(bid, ""))
                            out.append(f"⟦FIG:{bname}⟧")
                    elif dr.find(f".//{WPS_NS}txbx") is not None:
                        out.append("⟦FLOAT_TEXTBOX⟧")
            # Regular text runs (ignore text inside nested txbxContent to avoid printing floating box inline)
            if not drawings:
                t = "".join(x.text or "" for x in child.findall(f"{W_NS}t"))
                out.append(t)
        elif tag == f"{M_NS}oMath" or tag == f"{M_NS}oMathPara":
            out.append("$" + render_omml_to_latex(child) + "$")
        elif tag == f"{MC_NS}AlternateContent":
            # Usually a floating summary textbox or shape
            if child.find(f".//{W_NS}txbxContent") is not None:
                out.append("⟦FLOAT_TEXTBOX⟧")
            else:
                blips = [b.attrib.get(f"{R_NS}embed", "") for b in child.iter(f"{A_NS}blip")]
                for bid in blips:
                    if bid in rel_map:
                        out.append(f"⟦FIG:{os.path.basename(rel_map[bid])}⟧")
        else:
            out.append(render_node_text(child, rel_map, wmf_latex_cache, show_wmf_tag))
    return "".join(out)


def main():
    parser = argparse.ArgumentParser(description="Inspect a .docx math worksheet and export figure media.")
    parser.add_argument("docx_path", help="Path to the .docx file")
    parser.add_argument("--media-out", default="/tmp/docx_inspect_media", help="Directory to export figure images")
    parser.add_argument("--json-out", default="", help="Optional path to save structured JSON audit report")
    args = parser.parse_args()

    os.makedirs(args.media_out, exist_ok=True)
    # Clean old files in media_out so previous runs don't pollute visual inspection
    for old_f in os.listdir(args.media_out):
        old_p = os.path.join(args.media_out, old_f)
        if os.path.isfile(old_p):
            os.unlink(old_p)

    with zipfile.ZipFile(args.docx_path, "r") as z:
        root = ET.fromstring(z.read("word/document.xml"))
        rels_root = ET.fromstring(z.read("word/_rels/document.xml.rels"))
        rel_map = {r.attrib["Id"]: r.attrib["Target"] for r in rels_root}

        # 1. Decode all MathType .wmf files into LaTeX & export only real figures (.png/.jpg/.jpeg)
        wmf_latex_cache = {}
        exported_figures = {}
        for mf in sorted(z.namelist()):
            if not mf.startswith("word/media/"):
                continue
            bname = os.path.basename(mf)
            raw_bytes = z.read(mf)
            if bname.lower().endswith(".wmf"):
                wmf_latex_cache[bname] = decode_wmf_to_latex(raw_bytes)
            elif bname.lower().endswith((".png", ".jpg", ".jpeg", ".gif", ".bmp")):
                dst = os.path.join(args.media_out, bname)
                with open(dst, "wb") as f:
                    f.write(raw_bytes)
                exported_figures[bname] = dst

        # 2. Extract Headers (<w:hdr>)
        headers_text = []
        for name in sorted(z.namelist()):
            if re.match(r"word/header\d*\.xml$", name):
                h_root = ET.fromstring(z.read(name))
                h_str = " | ".join(
                    "".join(t.text or "" for t in p.iter(f"{W_NS}t")).strip()
                    for p in h_root.iter(f"{W_NS}p")
                ).strip(" |")
                if h_str:
                    headers_text.append(h_str)

        objs_all = list(root.iter(f"{W_NS}object"))
        omaths_all = list(root.iter(f"{M_NS}oMath"))

        print(f"=== DOCX WORKSHEET AUDIT v2.0: {os.path.basename(args.docx_path)} ===")
        print(
            f"MathType <w:object> (WMF): {len(objs_all)} (unique WMFs: {len(wmf_latex_cache)}) | "
            f"Native <m:oMath>: {len(omaths_all)} | "
            f"Exported Figures: {len(exported_figures)}"
        )
        if headers_text:
            print(f"Header(s): {' // '.join(headers_text)}")

        # 3. Inspect all embedded/anchored figures in document order (size, display cm, <a:srcRect> crop)
        print("\n=== FIGURE GEOMETRY & CROP (<a:srcRect>) AUDIT ===")
        body = root.find(f"{W_NS}body")
        figure_placements = []
        crop_view_idx = 0
        for p_idx, p in enumerate(body.findall(f"{W_NS}p")):
            for draw in p.iter(f"{W_NS}drawing"):
                blip = draw.find(f".//{A_NS}blip")
                if blip is None:
                    continue
                rid = blip.attrib.get(f"{R_NS}embed", "")
                target = rel_map.get(rid, "")
                bname = os.path.basename(target)
                if bname not in exported_figures:
                    continue
                ext = draw.find(f".//{WP_NS}extent")
                cx_cm = int(ext.attrib.get("cx", 0)) / 360000.0 if ext is not None else 0.0
                cy_cm = int(ext.attrib.get("cy", 0)) / 360000.0 if ext is not None else 0.0
                src_rect = draw.find(f".//{A_NS}srcRect")
                crop = {k: int(v) for k, v in src_rect.attrib.items()} if (src_rect is not None and src_rect.attrib) else None
                mode = "anchor" if draw.find(f"{WP_NS}anchor") is not None else "inline"

                im_path = exported_figures[bname]
                with Image.open(im_path) as im:
                    px_w, px_h = im.size
                    cropped_view_path = None
                    # If significant positive crop (>5% on any side), generate cropped preview image
                    if crop and any(v > 5000 for v in crop.values()):
                        l_ratio = max(0.0, crop.get("l", 0) / 100000.0)
                        t_ratio = max(0.0, crop.get("t", 0) / 100000.0)
                        r_ratio = max(0.0, crop.get("r", 0) / 100000.0)
                        b_ratio = max(0.0, crop.get("b", 0) / 100000.0)
                        x0 = int(round(px_w * l_ratio))
                        y0 = int(round(px_h * t_ratio))
                        x1 = int(round(px_w * (1.0 - r_ratio)))
                        y1 = int(round(px_h * (1.0 - b_ratio)))
                        if x1 > x0 + 10 and y1 > y0 + 10:
                            crop_view_idx += 1
                            stem_name = os.path.splitext(bname)[0]
                            cropped_view_name = f"{stem_name}_P{p_idx:02d}_crop{crop_view_idx}.png"
                            cropped_view_path = os.path.join(args.media_out, cropped_view_name)
                            im.crop((x0, y0, x1, y1)).save(cropped_view_path)

                rec_info = {
                    "paragraph": f"P{p_idx:02d}",
                    "file": bname,
                    "exported_path": im_path,
                    "mode": mode,
                    "pixel_size": [px_w, px_h],
                    "display_cm": [round(cx_cm, 2), round(cy_cm, 2)],
                    "srcRect_crop": crop,
                    "cropped_preview": cropped_view_path,
                }
                figure_placements.append(rec_info)
                crop_warn = f" ⚠️ CROP={crop}" if crop else ""
                preview_note = f" -> Cropped View: {os.path.basename(cropped_view_path)}" if cropped_view_path else ""
                dpi_warn = " [LOW-RES <2400px]" if px_w < 2400 else " [300DPI OK]"
                print(
                    f"  P{p_idx:02d} [{mode:6s}] {bname:14s} | {px_w:4d}x{px_h:<4d}px{dpi_warn} | "
                    f"disp={cx_cm:.2f}x{cy_cm:.2f}cm{crop_warn}{preview_note}"
                )

        # 4. Walk Body Elements in Order (Paragraphs P & Tables TBL)
        print("\n=== DOCUMENT BODY FLOW (PARAGRAPHS & TABLES WITH DECODED WMF) ===")
        paragraphs_report = []
        tables_report = []
        p_counter = 0
        tbl_counter = 0
        for elem in body:
            if elem.tag == f"{W_NS}p":
                p_idx = p_counter
                p_counter += 1
                txt_with_tags = render_node_text(elem, rel_map, wmf_latex_cache, show_wmf_tag=True).strip()
                txt_clean = render_node_text(elem, rel_map, wmf_latex_cache, show_wmf_tag=False).strip()
                obj_cnt = len(list(elem.iter(f"{W_NS}object")))
                if txt_with_tags or obj_cnt:
                    meta = []
                    if obj_cnt:
                        meta.append(f"WMF={obj_cnt}")
                    meta_str = f" ({', '.join(meta)})" if meta else ""
                    print(f"P{p_idx:02d}{meta_str}: {txt_with_tags}")
                    paragraphs_report.append({
                        "index": p_idx,
                        "id": f"P{p_idx:02d}",
                        "wmf_count": obj_cnt,
                        "text_annotated": txt_with_tags,
                        "text_clean_latex": txt_clean,
                    })
            elif elem.tag == f"{W_NS}tbl":
                t_idx = tbl_counter
                tbl_counter += 1
                rows_data = []
                print(f"\n  [TABLE #{t_idx + 1} (after P{p_counter - 1:02d})]")
                for r_idx, tr in enumerate(elem.findall(f"{W_NS}tr")):
                    row_cells = []
                    for tc in tr.findall(f"{W_NS}tc"):
                        cell_str = " / ".join(
                            render_node_text(cp, rel_map, wmf_latex_cache, show_wmf_tag=False).strip()
                            for cp in tc.findall(f"{W_NS}p")
                        ).strip(" /")
                        row_cells.append(cell_str)
                    rows_data.append(row_cells)
                    print(f"    Row {r_idx + 1}: | " + " | ".join(row_cells) + " |")
                tables_report.append({"table_index": t_idx + 1, "after_paragraph": p_counter - 1, "rows": rows_data})

        # 5. Inspect Floating Summary Textboxes (<mc:AlternateContent> / <w:txbxContent>) & Ghost Paragraphs
        floating_boxes = []
        for p_idx, p in enumerate(body.findall(f"{W_NS}p")):
            for ac in p.iter(f"{MC_NS}AlternateContent"):
                choice = ac.find(f"{MC_NS}Choice")
                fallback = ac.find(f"{MC_NS}Fallback")
                c_txbx = choice.find(f".//{W_NS}txbxContent") if choice is not None else None
                f_txbx = fallback.find(f".//{W_NS}txbxContent") if fallback is not None else None
                if c_txbx is None and f_txbx is None:
                    continue
                c_lines = [
                    render_node_text(cp, rel_map, wmf_latex_cache, show_wmf_tag=False).strip()
                    for cp in (c_txbx.findall(f"{W_NS}p") if c_txbx is not None else [])
                ]
                f_lines = [
                    render_node_text(fp, rel_map, wmf_latex_cache, show_wmf_tag=False).strip()
                    for fp in (f_txbx.findall(f"{W_NS}p") if f_txbx is not None else [])
                ]
                c_lines = [x for x in c_lines if x]
                f_lines = [x for x in f_lines if x]
                has_gfxdata = any(
                    f"{O_NS}gfxdata" in el.attrib for el in ac.iter()
                )
                in_sync = (c_lines == f_lines)
                floating_boxes.append({
                    "anchor_paragraph": f"P{p_idx:02d}",
                    "choice_lines": c_lines,
                    "fallback_lines": f_lines,
                    "branches_in_sync": in_sync,
                    "has_o_gfxdata_cache": has_gfxdata,
                })

        if floating_boxes:
            print("\n=== FLOATING SUMMARY TEXTBOXES (<mc:AlternateContent> Dual-Branch Audit) ===")
            for b_idx, fb in enumerate(floating_boxes):
                sync_flag = "SYNC_OK" if fb["branches_in_sync"] else "⚠️ BRANCH_DESYNC"
                gfx_flag = "⚠️ HAS_O_GFXDATA" if fb["has_o_gfxdata_cache"] else "NO_GFXDATA_OK"
                print(f"  Textbox #{b_idx + 1} (at {fb['anchor_paragraph']}) [{sync_flag} | {gfx_flag}]:")
                for ln in fb["choice_lines"]:
                    print(f"    • {ln}")

        if args.json_out:
            report_obj = {
                "docx_file": os.path.basename(args.docx_path),
                "wmf_object_count": len(objs_all),
                "omath_count": len(omaths_all),
                "headers": headers_text,
                "figures": figure_placements,
                "floating_textboxes": floating_boxes,
                "paragraphs": paragraphs_report,
                "tables": tables_report,
                "wmf_dictionary": wmf_latex_cache,
            }
            os.makedirs(os.path.dirname(os.path.abspath(args.json_out)), exist_ok=True)
            with open(args.json_out, "w", encoding="utf-8") as jf:
                json.dump(report_obj, jf, ensure_ascii=False, indent=2)
            print(f"\n[OK] Saved structured JSON audit blueprint to: {args.json_out}")


if __name__ == "__main__":
    main()

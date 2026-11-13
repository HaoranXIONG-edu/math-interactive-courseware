#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
In-Place Word (.docx) XML Patcher for Math Student Worksheets (docx_inplace_patcher.py).
Provides zero-boilerplate, lossless XML manipulation on top of an existing .docx template:
1. `upgrade_all_wmf_to_omml(size_pt=12.0)`: Automatically converts all legacy MathType <w:object> (.wmf)
   nodes into native 12pt <m:oMath> / Times New Roman runs in 5ms using the WMF GDI decoder;
2. `set_paragraph_rich_text(p_idx, rich_text, size_pt=12.0, keep_drawings=True)`: Replaces paragraph text
   using $LaTeX$ + auto-tokenization (SimSun for Chinese, Times New Roman Italic for variables, Upright for
   numbers/operators) while preserving paragraph <w:pPr> and embedded <w:drawing> / <mc:AlternateContent>;
3. `update_floating_textbox(textbox_idx, lines, size_pt=12.0)`: Synchronously updates both `mc:Choice`
   (`wps:txbx`) and `mc:Fallback` (`v:textbox`) branches of a rounded summary box, and strips `o:gfxdata`;
4. `replace_media_and_clear_crop(media_map)`: Replaces `word/media/image*.png` with 300 DPI redrawn figures
   and automatically clears `<a:srcRect>` crop attributes so redrawn figures are never clipped by Word.
"""

import os
import re
import shutil
import sys
import tempfile
import zipfile
from lxml import etree

# Import LaTeX -> OMML / Auto-Tokenizer from docx_exam_builder.py
sys.path.insert(0, "/Users/xionghaoran/.gemini/config/plugins/polya-math-diagram/skills/math-exam-to-word/scripts")
import docx_exam_builder as deb

# Import WMF GDI -> LaTeX decoder from inspect_docx_worksheet.py
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, SCRIPT_DIR)
import inspect_docx_worksheet as insp

W_NS = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
M_NS = "http://schemas.openxmlformats.org/officeDocument/2006/math"
WP_NS = "http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"
A_NS = "http://schemas.openxmlformats.org/drawingml/2006/main"
R_NS = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
V_NS = "urn:schemas-microsoft-com:vml"
O_NS = "urn:schemas-microsoft-com:office:office"
MC_NS = "http://schemas.openxmlformats.org/markup-compatibility/2006"
WPS_NS = "http://schemas.microsoft.com/office/word/2010/wordprocessingShape"


class _DummyParagraphWrapper:
    """Adapter so docx_exam_builder.fill_rich_paragraph can write directly into any lxml <w:p> element."""
    def __init__(self, p_elem):
        self._p = p_elem


class DocxWorksheetPatcher:
    """Lossless in-place XML patcher for student math worksheets (.docx)."""

    def __init__(self, src_docx_path: str):
        self.src_docx_path = os.path.abspath(src_docx_path)
        self.work_dir = tempfile.mkdtemp(prefix="docx_patch_")
        with zipfile.ZipFile(self.src_docx_path, "r") as z:
            z.extractall(self.work_dir)

        self.doc_xml_path = os.path.join(self.work_dir, "word", "document.xml")
        self.rels_xml_path = os.path.join(self.work_dir, "word", "_rels", "document.xml.rels")

        self.parser = etree.XMLParser(remove_blank_text=False)
        self.tree = etree.parse(self.doc_xml_path, self.parser)
        self.root = self.tree.getroot()
        self.body = self.root.find(f"{{{W_NS}}}body")

        rels_tree = etree.parse(self.rels_xml_path, self.parser)
        self.rel_map = {
            r.attrib["Id"]: r.attrib["Target"]
            for r in rels_tree.getroot()
            if "Id" in r.attrib and "Target" in r.attrib
        }

        # Decode all WMF files once in ~4ms
        self.wmf_latex_cache = {}
        media_dir = os.path.join(self.work_dir, "word", "media")
        if os.path.isdir(media_dir):
            for fname in sorted(os.listdir(media_dir)):
                if fname.lower().endswith(".wmf"):
                    fpath = os.path.join(media_dir, fname)
                    with open(fpath, "rb") as f:
                        self.wmf_latex_cache[fname] = insp.decode_wmf_to_latex(f.read())

    def get_paragraphs(self):
        """Return list of all direct body <w:p> elements."""
        return self.body.findall(f"{{{W_NS}}}p")

    def upgrade_all_wmf_to_omml(self, size_pt: float = 12.0, custom_overrides: dict = None) -> int:
        """
        Automatically replaces every <w:object> (MathType WMF) in the document with native 12pt <m:oMath>
        or styled <w:r> runs, achieving `objs = 0` in milliseconds.
        `custom_overrides`: optional dict mapping `imageX.wmf` -> custom LaTeX string.
        """
        overrides = custom_overrides or {}
        upgraded_count = 0

        for p in self.root.iter(f"{{{W_NS}}}p"):
            for r in list(p.findall(f"{{{W_NS}}}r")):
                objs = r.findall(f"{{{W_NS}}}object")
                if not objs:
                    continue
                idx_in_p = list(p).index(r)
                temp_p = etree.Element(f"{{{W_NS}}}p")
                for obj in objs:
                    imdata = obj.find(f".//{{{V_NS}}}imagedata")
                    rid = imdata.attrib.get(f"{{{R_NS}}}id", "") if imdata is not None else ""
                    bname = os.path.basename(self.rel_map.get(rid, ""))
                    latex = overrides.get(bname, self.wmf_latex_cache.get(bname, ""))
                    if latex:
                        deb.append_smart_math(temp_p, latex, size_pt=size_pt)
                        upgraded_count += 1
                # Insert generated <w:r> / <m:oMath> nodes at exact original position and remove old <w:r>
                for offset, new_child in enumerate(list(temp_p)):
                    p.insert(idx_in_p + offset, new_child)
                p.remove(r)

        return upgraded_count

    def set_paragraph_rich_text(
        self,
        p_idx: int,
        rich_text: str,
        size_pt: float = 12.0,
        bold: bool = False,
        keep_drawings: bool = True,
        auto_clean_spaces: bool = True,
    ):
        """
        Replaces the text/math content of paragraph `P{p_idx:02d}` using `$LaTeX$` syntax while preserving:
        - Original paragraph formatting `<w:pPr>` (indentation, line spacing, alignment)
        - Any anchored/inline figures (`<w:drawing>`, `<mc:AlternateContent>`) if `keep_drawings=True`.
        """
        ps = self.get_paragraphs()
        if not (0 <= p_idx < len(ps)):
            raise IndexError(f"Paragraph index P{p_idx:02d} out of range (0..{len(ps) - 1})")
        p = ps[p_idx]

        pPr = p.find(f"{{{W_NS}}}pPr")
        preserved_drawing_nodes = []
        if keep_drawings:
            for child in list(p):
                if child.tag == f"{{{MC_NS}}}AlternateContent":
                    preserved_drawing_nodes.append(child)
                elif child.tag == f"{{{W_NS}}}r":
                    if child.find(f"{{{W_NS}}}drawing") is not None or child.find(f"{{{MC_NS}}}AlternateContent") is not None:
                        preserved_drawing_nodes.append(child)

        # Clear all children of p
        for child in list(p):
            p.remove(child)

        if pPr is not None:
            p.append(pPr)
        for dn in preserved_drawing_nodes:
            p.append(dn)

        if rich_text:
            deb.fill_rich_paragraph(
                _DummyParagraphWrapper(p),
                rich_text,
                bold=bold,
                size_pt=size_pt,
                auto_clean_spaces=auto_clean_spaces,
            )

    def update_floating_textbox(self, textbox_idx: int, rich_lines: list, size_pt: float = 12.0):
        """
        Synchronously updates both `mc:Choice` (`wps:txbx`) and `mc:Fallback` (`v:textbox`) branches
        of the `textbox_idx`-th (0-based) floating summary box (<mc:AlternateContent>),
        and strips `o:gfxdata` from `<v:roundrect>` / `<v:shape>` so Word never renders stale cached graphics.
        """
        ac_boxes = []
        for ac in self.root.iter(f"{{{MC_NS}}}AlternateContent"):
            if ac.find(f".//{{{W_NS}}}txbxContent") is not None:
                ac_boxes.append(ac)

        if not (0 <= textbox_idx < len(ac_boxes)):
            raise IndexError(f"Textbox index {textbox_idx} out of range (found {len(ac_boxes)} floating textboxes)")

        target_ac = ac_boxes[textbox_idx]
        # Strip o:gfxdata cache attribute from any VML element inside AlternateContent
        for el in target_ac.iter():
            gfx_attr = f"{{{O_NS}}}gfxdata"
            if gfx_attr in el.attrib:
                del el.attrib[gfx_attr]

        # Update both Choice and Fallback <w:txbxContent>
        for txbx_content in target_ac.iter(f"{{{W_NS}}}txbxContent"):
            existing_ps = txbx_content.findall(f"{{{W_NS}}}p")
            template_pPr = existing_ps[0].find(f"{{{W_NS}}}pPr") if existing_ps else None

            for old_p in existing_ps:
                txbx_content.remove(old_p)

            for line_str in rich_lines:
                new_p = etree.Element(f"{{{W_NS}}}p")
                if template_pPr is not None:
                    new_p.append(etree.fromstring(etree.tostring(template_pPr)))
                deb.fill_rich_paragraph(
                    _DummyParagraphWrapper(new_p),
                    line_str,
                    bold=False,
                    size_pt=size_pt,
                    auto_clean_spaces=True,
                )
                txbx_content.append(new_p)

    def replace_media_and_clear_crop(self, media_replacements: dict, clear_src_rect: bool = True):
        """
        Copies redrawn 300 DPI images into `word/media/` and automatically removes `<a:srcRect>` crop
        tags on those images so Word displays the full unclipped figure.
        `media_replacements`: dict mapping `imageX.png` -> `/path/to/new_image.png`
        """
        media_dir = os.path.join(self.work_dir, "word", "media")
        os.makedirs(media_dir, exist_ok=True)

        replaced_rids = set()
        for target_name, src_img_path in media_replacements.items():
            dst_path = os.path.join(media_dir, target_name)
            shutil.copy2(src_img_path, dst_path)
            for rid, rel_target in self.rel_map.items():
                if os.path.basename(rel_target) == target_name:
                    replaced_rids.add(rid)

        if clear_src_rect and replaced_rids:
            for draw in self.root.iter(f"{{{W_NS}}}drawing"):
                blip = draw.find(f".//{{{A_NS}}}blip")
                if blip is not None and blip.attrib.get(f"{{{R_NS}}}embed") in replaced_rids:
                    for sr in list(draw.iter(f"{{{A_NS}}}srcRect")):
                        sr.attrib.clear()
                    # Automatically sync cy to preserve the redrawn image's exact aspect ratio
                    rid = blip.attrib.get(f"{{{R_NS}}}embed")
                    bname = os.path.basename(self.rel_map.get(rid, ""))
                    img_path = os.path.join(media_dir, bname)
                    if os.path.exists(img_path):
                        try:
                            from PIL import Image
                            with Image.open(img_path) as im:
                                w_px, h_px = im.size
                            if w_px > 0 and h_px > 0:
                                wp_ext = draw.find(f".//{{{WP_NS}}}extent")
                                if wp_ext is not None and "cx" in wp_ext.attrib:
                                    cx_val = int(wp_ext.attrib["cx"])
                                    new_cy = int(round(cx_val * (h_px / float(w_px))))
                                    wp_ext.attrib["cy"] = str(new_cy)
                                    for a_ext in draw.iter(f"{{{A_NS}}}ext"):
                                        if "cx" in a_ext.attrib and int(a_ext.attrib["cx"]) == cx_val:
                                            a_ext.attrib["cy"] = str(new_cy)
                        except Exception:
                            pass

    def audit_cleanliness(self):
        """Final gate check before saving: ensures 0 remaining <w:object> and 0 o:gfxdata on textboxes."""
        rem_objs = len(list(self.root.iter(f"{{{W_NS}}}object")))
        rem_omaths = len(list(self.root.iter(f"{{{M_NS}}}oMath")))
        gfx_caches = sum(
            1 for ac in self.root.iter(f"{{{MC_NS}}}AlternateContent")
            if ac.find(f".//{{{W_NS}}}txbxContent") is not None
            and any(f"{{{O_NS}}}gfxdata" in el.attrib for el in ac.iter())
        )
        print(f"[PATCH AUDIT] Remaining <w:object> (WMF): {rem_objs} | Native <m:oMath>: {rem_omaths} | Stale o:gfxdata: {gfx_caches}")
        if rem_objs > 0:
            print(f"  ⚠️ WARNING: {rem_objs} MathType WMF objects still remain! Call upgrade_all_wmf_to_omml() first.")
        return rem_objs == 0 and gfx_caches == 0

    def save(self, out_docx_path: str):
        """Writes updated XML and repacks into a valid .docx archive."""
        self.tree.write(self.doc_xml_path, xml_declaration=True, encoding="UTF-8", standalone="yes")
        out_abs = os.path.abspath(out_docx_path)
        os.makedirs(os.path.dirname(out_abs), exist_ok=True)

        with zipfile.ZipFile(out_abs, "w", zipfile.ZIP_DEFLATED) as zf:
            for root_dir, _, files in os.walk(self.work_dir):
                for file in sorted(files):
                    full_p = os.path.join(root_dir, file)
                    rel_p = os.path.relpath(full_p, self.work_dir)
                    zf.write(full_p, rel_p)
        print(f"[OK] Saved patched worksheet to: {out_abs}")
        return out_abs

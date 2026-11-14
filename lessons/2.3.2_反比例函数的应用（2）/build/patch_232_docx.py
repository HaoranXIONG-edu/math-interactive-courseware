#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
In-Place XML Patching Script for `2.3.2 反比例函数的应用（2）.docx` (40-Minute Classroom Edition).
Strictly follows all rules in `AGENTS.md` and `SKILL.md`:
1. Upgrades all 116 MathType WMF (<w:object>) equations (including inside Table #1) to native 12pt <m:oMath> / Times New Roman runs (`WMF = 0`);
2. Fixes all 7 legacy MathType Symbol-font garbled equations (`kW` -> `k\\Omega`, `20k` -> `20\\text{k}\\Omega`, `AB\\perp l_1` -> `AB\\perp l_2`, `570ml` -> `570\\text{mL}`, etc.) with zero extra spaces;
3. Splits the double-cropped `image31.png` into two separate uncropped 300 DPI media files (`image31.png` for P37 Figs 1-3, `image31_bot.png` for P46 Figs 4-5);
4. Strictly preserves the original 40-minute classroom scope (Section I: 情境引入 + Section II: 问题1、问题2、问题3) without appending extra exercises;
5. Replaces all figures with 300 DPI (`>=2400px`) redrawn figures and verifies `audit_cleanliness()`.
"""

import os
import shutil
import sys
from lxml import etree

BUILD_DIR = os.path.dirname(os.path.abspath(__file__))
LESSON_DIR = os.path.dirname(BUILD_DIR)
REPO_ROOT = os.path.dirname(os.path.dirname(LESSON_DIR))
SCRIPT_DIR = os.path.join(REPO_ROOT, ".agents", "skills", "math-interactive-courseware", "scripts")
sys.path.insert(0, SCRIPT_DIR)
from docx_inplace_patcher import DocxWorksheetPatcher, W_NS, WP_NS, A_NS, R_NS

SRC_DOCX = "/Users/xionghaoran/Desktop/学案/6反比例函数/2.3.2 反比例函数的应用（2） .docx"
REDRAWN_DIR = os.path.join(BUILD_DIR, "redrawn_media")
OUT_DOCX = os.path.join(LESSON_DIR, "2.3.2_反比例函数的应用（2）_学生学案_优化版.docx")


def configure_anchor_right_square(draw_elem, cx_emu: int, pos_v_emu: int = 25000):
    """Set a <w:drawing> anchor to right-aligned relative to margin with wrapSquare."""
    anchor = draw_elem.find(f"{{{WP_NS}}}anchor")
    if anchor is None:
        return
    posH = anchor.find(f"{{{WP_NS}}}positionH")
    if posH is not None:
        posH.attrib["relativeFrom"] = "margin"
        for ch in list(posH):
            posH.remove(ch)
        align_el = etree.SubElement(posH, f"{{{WP_NS}}}align")
        align_el.text = "right"

    posV = anchor.find(f"{{{WP_NS}}}positionV")
    if posV is not None:
        posV.attrib["relativeFrom"] = "paragraph"
        for ch in list(posV):
            posV.remove(ch)
        off_el = etree.SubElement(posV, f"{{{WP_NS}}}posOffset")
        off_el.text = str(pos_v_emu)

    ext = anchor.find(f"{{{WP_NS}}}extent")
    if ext is not None:
        old_cx = int(ext.attrib.get("cx", cx_emu))
        ext.attrib["cx"] = str(cx_emu)
        for a_ext in draw_elem.iter(f"{{{A_NS}}}ext"):
            if "cx" in a_ext.attrib and int(a_ext.attrib["cx"]) == old_cx:
                a_ext.attrib["cx"] = str(cx_emu)

    for wrap_tag in ("wrapNone", "wrapTight", "wrapThrough", "wrapTopAndBottom"):
        w_el = anchor.find(f"{{{WP_NS}}}{wrap_tag}")
        if w_el is not None:
            idx = list(anchor).index(w_el)
            anchor.remove(w_el)
            ws = etree.Element(f"{{{WP_NS}}}wrapSquare")
            ws.attrib["wrapText"] = "bothSides"
            anchor.insert(idx, ws)


def add_new_media_relationship(patcher: DocxWorksheetPatcher, rel_id: str, media_filename: str, src_path: str):
    """Copy a new image into word/media/ and register its Relationship in word/_rels/document.xml.rels."""
    media_dir = os.path.join(patcher.work_dir, "word", "media")
    os.makedirs(media_dir, exist_ok=True)
    shutil.copy2(src_path, os.path.join(media_dir, media_filename))

    rels_tree = etree.parse(patcher.rels_xml_path, patcher.parser)
    rels_root = rels_tree.getroot()
    rel_ns = "http://schemas.openxmlformats.org/package/2006/relationships"
    new_rel = etree.SubElement(rels_root, f"{{{rel_ns}}}Relationship")
    new_rel.attrib["Id"] = rel_id
    new_rel.attrib["Type"] = "http://schemas.openxmlformats.org/officeDocument/2006/relationships/image"
    new_rel.attrib["Target"] = f"media/{media_filename}"
    rels_tree.write(patcher.rels_xml_path, xml_declaration=True, encoding="UTF-8", standalone="yes")
    patcher.rel_map[rel_id] = f"media/{media_filename}"


def main():
    patcher = DocxWorksheetPatcher(SRC_DOCX)

    # 1. Upgrade all 116 MathType WMF equations (including inside Table #1) to native 12pt OMML/Runs
    custom_wmf_overrides = {
        "image14.wmf": r"\text{k}\Omega",
        "image16.wmf": r"\text{kg}",
        "image18.wmf": r"R_2=20\text{k}\Omega",
        "image20.wmf": r"\text{mA}",
        "image22.wmf": r"1\text{kg}",
        "image23.wmf": r"0.2\text{mA}",
        "image25.wmf": r"0.15\le I\le 0.6",
        "image32.wmf": r"AB\perp l_2",
        "image35.wmf": r"l_1\parallel l_2",
        "image37.wmf": r"\text{Rt}\triangle BAC",
        "image40.wmf": r"DE\parallel BC",
        "image46.wmf": r"l_3\text{：}y=-x+4",
        "image47.wmf": r"C_1\text{：}y=\frac{k}{x}\text{（}x>0\text{）}",
        "image50.wmf": r"80\text{m}",
        "image54.wmf": r"y=\frac{3000}{x}\text{（}x>0\text{）}",
        "image63.wmf": r"y_{\text{需求}}",
        "image67.wmf": r"y_{\text{供给}}",
        "image77.wmf": r"x_{\text{售价}}",
        "image78.wmf": r"x_{\text{成本}}",
        "image80.wmf": r"x_{\text{售价}}=\frac{1}{2}t+\frac{1}{2}",
        "image81.wmf": r"x_{\text{成本}}=-\frac{1}{4}t^2+\frac{7}{2}t-\frac{37}{4}",
        "image82.wmf": r"x_{\text{利润}}",
    }
    upgraded = patcher.upgrade_all_wmf_to_omml(size_pt=12.0, custom_overrides=custom_wmf_overrides)
    print(f"[INFO] Upgraded {upgraded} WMF equation objects to native 12pt OMML/Runs.")

    # 2. Polish Section I (一、情境引入 思维激活: P06 - P15)
    patcher.set_paragraph_rich_text(
        6,
        r"如图，一次函数$y=kx+b$与反比例函数$y=\frac{m}{x}$的图象交于点$A(-3,2)$，$B(n,-3)$．",
        size_pt=12.0,
    )
    patcher.set_paragraph_rich_text(
        7,
        r"（1）求反比例函数和一次函数的表达式；",
        size_pt=12.0,
    )
    patcher.set_paragraph_rich_text(
        11,
        r"（2）求$\triangle AOB$的面积；",
        size_pt=12.0,
    )
    patcher.set_paragraph_rich_text(
        15,
        r"（3）当x取何值时，$kx+b=\frac{m}{x}$？$kx+b>\frac{m}{x}$呢？$kx+b<\frac{m}{x}$呢？",
        size_pt=12.0,
    )

    # 3. Polish Section II (二、新知探究 思维生长: P20 - P66)
    # 问题1：电子秤电路中一次函数与反比例函数复合建模
    patcher.set_paragraph_rich_text(
        20,
        r"问题1：图1为某电子秤的实物图，图2为其工作电路图，其工作原理为：电源两端电压保持不变，通过所称物体质量调节可变电阻$R_1$的大小，从而改变电路中的电流I，最终通过显示器显示物体质量．已知：①可变电阻$R_1$（单位：$\text{k}\Omega$）与物体质量x（单位：kg）满足图3所示的一次函数关系；②定值电阻$R_2=20\text{k}\Omega$，总电阻$R=R_1+R_2$；③电路中的电流I（单位：mA）与总电阻R（单位：$\text{k}\Omega$）成反比例；④当在电子秤上放置质量为1kg的物体时，电流表显示电流I为0.2mA．",
        size_pt=12.0,
    )
    patcher.set_paragraph_rich_text(
        25,
        r"（1）求可变电阻$R_1$（单位：$\text{k}\Omega$）与物体质量x（单位：kg）之间满足的函数关系式；",
        size_pt=12.0,
    )
    patcher.set_paragraph_rich_text(
        26,
        r"（2）求电流I（单位：mA）与总电阻R（单位：$\text{k}\Omega$）之间满足的函数关系式；",
        size_pt=12.0,
    )
    patcher.set_paragraph_rich_text(
        27,
        r"（3）已知该电子秤正常工作的电流范围为$0.15\le I\le 0.6$（单位：mA），求该电子秤可称量物品的最大质量．",
        size_pt=12.0,
    )

    # 问题2：新定义“两个图形之间的距离”与隔音屏障跨学科探究
    patcher.set_paragraph_rich_text(
        36,
        r"问题2：在平面内，把一个图形上任意一点与另一个图形上任意一点之间的距离的最小值，称为这两个图形之间的距离，即A，B分别是图形M和图形N上任意一点，当AB的长最小时，称这个最小值为图形M与图形N之间的距离．",
        size_pt=12.0,
    )
    patcher.set_paragraph_rich_text(
        42,
        r"例如，如图1，$AB\perp l_2$，线段AB的长度称为点A与直线$l_2$之间的距离，当$l_1\parallel l_2$时，线段AB的长度也是$l_1$与$l_2$之间的距离．",
        size_pt=12.0,
    )
    patcher.set_paragraph_rich_text(
        43,
        r"【应用】（1）如图2，在等腰$\text{Rt}\triangle BAC$中，$\angle A=90^\circ$，$AB=AC$，点D为AB边上一点，过点D作$DE\parallel BC$交AC于点E．若$AB=6$，$AD=4$，则DE与BC之间的距离是__blank__；",
        size_pt=12.0,
    )
    patcher.set_paragraph_rich_text(
        44,
        r"（2）如图3，已知直线$l_3\text{：}y=-x+4$与双曲线$C_1\text{：}y=\frac{k}{x}$（$x>0$）交于$A(1,m)$与B两点，点A与点B之间的距离是__blank__，点O与双曲线$C_1$之间的距离是__blank__．",
        size_pt=12.0,
    )
    patcher.set_paragraph_rich_text(
        45,
        r"【拓展】（3）按规定，住宅小区的外延到高速路的距离不超过80m时，需要在高速路旁修建与高速路相同走向的隔音屏障（如图4）．有一条“东南—西北”走向的笔直高速路，路旁某住宅小区建筑外延呈双曲线的形状，它们之间的距离小于80m．现以高速路上某一合适位置为坐标原点，建立如图5所示的直角坐标系，此时高速路所在直线$l_4$的函数表达式为$y=-x$，小区外延所在双曲线$C_2$的函数表达式为$y=\frac{3000}{x}$（$x>0$），那么需要在高速路旁修建隔音屏障的长度是多少？",
        size_pt=12.0,
    )

    # 问题3：崂山景区矿泉水供需平衡与利润综合问题
    patcher.set_paragraph_rich_text(
        59,
        r"问题3：在中国大陆长达1.8万公里的海岸线上，屹立于黄海之滨的崂山“试比天高”，其山脉以主峰为中心向四方延伸，演绎着山海相依的浪漫和道法自然的美学．小飞一家在崂山风景区开了一家超市，为迎接将要到来的旅游黄金季（每年5月到10月），小飞拿出了去年对某种矿泉水（如图1）销售情况的统计数据进行参考，提供如下信息：",
        size_pt=12.0,
    )
    patcher.set_paragraph_rich_text(
        60,
        r"①工商管理局规定：该矿泉水零售价不得高于6元/瓶；",
        size_pt=12.0,
    )
    patcher.set_paragraph_rich_text(
        61,
        r"②统计售价x（元/瓶）与需求量$y_{\text{需求}}$（箱）的数据：发现当售价为3元/瓶时，该矿泉水的需求量为100箱，售价每上涨0.5元，需求量就减少5箱．",
        size_pt=12.0,
    )
    patcher.set_paragraph_rich_text(
        62,
        r"③该矿泉水的供给量$y_{\text{供给}}$（箱）关于售价x（元/瓶）的函数关系如下表所示：",
        size_pt=12.0,
    )
    patcher.set_paragraph_rich_text(
        63,
        r"④5～10月份该矿泉水的售价$x_{\text{售价}}$（元/瓶），$x_{\text{成本}}$（元/瓶）关于月份t的函数表达式分别为$x_{\text{售价}}=\frac{1}{2}t+\frac{1}{2}$，$x_{\text{成本}}=-\frac{1}{4}t^2+\frac{7}{2}t-\frac{37}{4}$，函数图象见图2．",
        size_pt=12.0,
    )
    patcher.set_paragraph_rich_text(
        64,
        r"（1）写出需求量$y_{\text{需求}}$（箱）和供给量$y_{\text{供给}}$（箱）关于售价x（元/瓶）的函数关系式．",
        size_pt=12.0,
    )
    patcher.set_paragraph_rich_text(
        65,
        r"（2）哪个月出售这种矿泉水每瓶获利$x_{\text{利润}}$（元/瓶）最大？并说明理由．",
        size_pt=12.0,
    )
    patcher.set_paragraph_rich_text(
        66,
        r"（3）求该矿泉水需求量与供给量相等时的售价，以及按照该价格出售获得的总利润．",
        size_pt=12.0,
    )

    # 4. Split `image31.png` so P37 uses `image31.png` (top Figs 1-3) and P46 uses `image31_bot.png` (bottom Figs 4-5)
    add_new_media_relationship(
        patcher,
        "rId901",
        "image31_bot.png",
        os.path.join(REDRAWN_DIR, "image31_bot.png"),
    )

    ps = patcher.get_paragraphs()
    for blip in ps[46].iter(f"{{{A_NS}}}blip"):
        blip.attrib[f"{{{R_NS}}}embed"] = "rId901"

    # Ensure P60 (`image58.jpeg`) is cleanly right-aligned relative to margin
    for d_el in ps[60].iter(f"{{{W_NS}}}drawing"):
        configure_anchor_right_square(d_el, cx_emu=3486150, pos_v_emu=40000)

    # 5. Replace media files with 300 DPI redrawn figures and clear all <a:srcRect> crop tags
    media_replacements = {
        "image5.png": os.path.join(REDRAWN_DIR, "image5.png"),
        "image24.png": os.path.join(REDRAWN_DIR, "image24.png"),
        "image31.png": os.path.join(REDRAWN_DIR, "image31_top.png"),
        "image31_bot.png": os.path.join(REDRAWN_DIR, "image31_bot.png"),
        "image58.jpeg": os.path.join(REDRAWN_DIR, "image58.jpeg"),
    }
    patcher.replace_media_and_clear_crop(media_replacements)

    # 6. Audit cleanliness and save
    clean_ok = patcher.audit_cleanliness()
    if not clean_ok:
        sys.exit(1)
    patcher.save(OUT_DOCX)


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Stage 3 In-Place XML Patching Script for `2.3.1 反比例函数的应用（1）.docx`.
Strictly follows all rules in `AGENTS.md` and `SKILL.md`:
1. Upgrades all 81 MathType WMF (<w:object>) equations to native 12pt <m:oMath> / Times New Roman runs (`WMF = 0`);
2. Cleans stray characters (`P23` single quote `‘`) and standardizes units (`S`（单位：$\text{m}^2$）, `p`（单位：$\text{Pa}$）, `$x\,\text{N}$`, `$y\,\text{cm}$`) with zero extra spaces;
3. Replaces the mismatched 2.2.2 template exercises in Sections III (`三、新知应用`) and IV (`四、分层训练`) with 5 classic 2.3.1 application problems + 2 stratified training problems;
4. Replaces all figures with 300 DPI (`>=2400px`) redrawn figures, repositions anchored figures cleanly on the right margin with `wrapSquare`, and verifies `audit_cleanliness()`.
"""

import os
import sys
from lxml import etree

BUILD_DIR = os.path.dirname(os.path.abspath(__file__))
LESSON_DIR = os.path.dirname(BUILD_DIR)
REPO_ROOT = os.path.dirname(os.path.dirname(LESSON_DIR))
SCRIPT_DIR = os.path.join(REPO_ROOT, ".agents", "skills", "math-interactive-courseware", "scripts")
sys.path.insert(0, SCRIPT_DIR)
from docx_inplace_patcher import DocxWorksheetPatcher, W_NS, WP_NS, A_NS, R_NS

SRC_DOCX = os.environ.get("SRC_DOCX", os.path.join(LESSON_DIR, "2.3.1_反比例函数的应用（1）_原学案.docx"))
REDRAWN_DIR = os.path.join(BUILD_DIR, "redrawn_media")
OUT_DOCX = os.path.join(LESSON_DIR, "2.3.1_反比例函数的应用（1）_学生学案_优化版.docx")


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

    # Set width cx_emu (aspect ratio cy will be synced by replace_media_and_clear_crop)
    ext = anchor.find(f"{{{WP_NS}}}extent")
    if ext is not None:
        old_cx = int(ext.attrib.get("cx", cx_emu))
        ext.attrib["cx"] = str(cx_emu)
        for a_ext in draw_elem.iter(f"{{{A_NS}}}ext"):
            if "cx" in a_ext.attrib and int(a_ext.attrib["cx"]) == old_cx:
                a_ext.attrib["cx"] = str(cx_emu)

    # Ensure wrapSquare so text wraps cleanly on the left without collision
    wrap_none = anchor.find(f"{{{WP_NS}}}wrapNone")
    if wrap_none is not None:
        idx = list(anchor).index(wrap_none)
        anchor.remove(wrap_none)
        ws = etree.Element(f"{{{WP_NS}}}wrapSquare")
        ws.attrib["wrapText"] = "bothSides"
        anchor.insert(idx, ws)


def main():
    patcher = DocxWorksheetPatcher(SRC_DOCX)

    # 1. Upgrade all MathType WMF equations in the document (including TABLE #1) to 12pt native OMML/Runs
    custom_wmf_overrides = {
        "image4.wmf": r"y\text{cm}",
        "image6.wmf": r"x\text{N}",
        "image7.wmf": r"x/\text{N}",
        "image8.wmf": r"y/\text{cm}",
        "image12.wmf": r"y=ax+b\text{（}a\neq 0\text{）}",
        "image13.wmf": r"y=\frac{k}{x}\text{（}k\neq 0\text{）}",
    }
    upgraded = patcher.upgrade_all_wmf_to_omml(size_pt=12.0, custom_overrides=custom_wmf_overrides)
    print(f"[INFO] Upgraded {upgraded} WMF equation objects to native 12pt OMML/Runs.")

    # 2. Polish Section I (一、情境引入 思维激活: P06 - P16)
    patcher.set_paragraph_rich_text(
        6,
        r"道远学校科技小组进行野外考察，利用铺垫木板的方式通过一片烂泥湿地，你能解释他们这样做的道理吗？当人和木板对湿地的压力一定时，随着木板面积S（单位：$\text{m}^2$）的变化，人和木板对地面的压强p（单位：$\text{Pa}$）将如何变化？已知人和木板对湿地地面的压力合计600N．",
        size_pt=12.0,
    )
    patcher.set_paragraph_rich_text(
        7,
        r"（1）用含S的代数式表示p，p是S的反比例函数吗？为什么？",
        size_pt=12.0,
    )
    patcher.set_paragraph_rich_text(
        10,
        r"（2）当木板面积为$0.2\text{m}^2$时，压强是多少？",
        size_pt=12.0,
    )
    patcher.set_paragraph_rich_text(
        13,
        r"（3）如果要求压强不超过6000Pa，木板面积至少要多大？",
        size_pt=12.0,
    )
    patcher.set_paragraph_rich_text(
        16,
        r"（4）在平面直角坐标系中，作出相应函数的图象．请利用图象对（2）和（3）作出直观解释，并与同伴交流．",
        size_pt=12.0,
    )

    # 3. Polish Section II (二、新知探究 思维生长: P20 - P35)
    patcher.set_paragraph_rich_text(
        20,
        r"问题1：蓄电池电压为定值，使用此电源时，电流I（单位：A）与电阻R（单位：Ω）之间的关系图象如图所示．若点A(9,4)在图象上，解答下列问题：",
        size_pt=12.0,
    )
    patcher.set_paragraph_rich_text(
        21,
        r"（1）电流I可以看成电阻R的什么函数？求出这个函数的表达式；",
        size_pt=12.0,
    )
    # Remove stray quote '‘' in P23
    patcher.set_paragraph_rich_text(23, "", size_pt=12.0)
    patcher.set_paragraph_rich_text(
        24,
        r"（2）如果以此蓄电池为电源的用电器能正常工作，则限制电流不得低于9A，且不超过18A，请问用电器的可变电阻R应控制在什么范围？",
        size_pt=12.0,
    )
    patcher.set_paragraph_rich_text(
        28,
        r"问题2：如图所示，是《天工开物》中记载的三千多年前中国古人利用桔槔在井上汲水的情境．受桔槔的启发，某数学兴趣小组组装了以下装置，通过实验收集了大量数据，通过对数据的整理和分析，发现$L_2$的长度y（单位：cm）和重物B所受重力x（单位：N）之间近似存在一个函数关系，部分数据如下表：",
        size_pt=12.0,
    )
    patcher.set_paragraph_rich_text(
        30,
        r"（1）在图1中描出表中数据对应的点(x,y)，并用平滑曲线连接；",
        size_pt=12.0,
    )
    patcher.set_paragraph_rich_text(
        31,
        r"（2）根据表中数据，从$y=ax+b$（$a\neq 0$）和$y=\frac{k}{x}$（$k\neq 0$）中选择一个函数模型，使它能近似地反映重物B所受重力x（单位：N）和$L_2$的长度y（单位：cm）的函数关系，并求出这个函数的表达式（不要求写出x的取值范围）；",
        size_pt=12.0,
    )
    patcher.set_paragraph_rich_text(
        35,
        r"（3）在（2）的条件下，若点A的坐标为(20,0)，点B的坐标为(0,2)，在（2）中所求函数的图象（$x>0$）上存在点C，使得$S_{\triangle ABC}=40$，请求出所有满足条件的点C的坐标．",
        size_pt=12.0,
    )

    # 4. Relocate anchored figures in P59 (`image36.png` -> P57, `image37.png` -> P54, remove `image38.png`)
    ps = patcher.get_paragraphs()
    p59 = ps[59]
    draw_r36 = None
    draw_r37 = None
    for child in list(p59):
        if child.tag == f"{{{W_NS}}}r" and child.find(f"{{{W_NS}}}drawing") is not None:
            d_el = child.find(f"{{{W_NS}}}drawing")
            blip = d_el.find(f".//{{{A_NS}}}blip")
            rid = blip.attrib.get(f"{{{R_NS}}}embed", "") if blip is not None else ""
            target_bname = os.path.basename(patcher.rel_map.get(rid, ""))
            if target_bname == "image36.png":
                configure_anchor_right_square(d_el, cx_emu=1360000, pos_v_emu=18000)
                draw_r36 = child
            elif target_bname == "image37.png":
                configure_anchor_right_square(d_el, cx_emu=1680000, pos_v_emu=28000)
                draw_r37 = child
            p59.remove(child)

    if draw_r37 is not None:
        ps[54].append(draw_r37)
    if draw_r36 is not None:
        ps[57].append(draw_r36)

    # Also ensure P65 (`image56.png`) and P70 (`image74.png`) use clean right-aligned wrapSquare
    for idx, cx_val in ((65, 1520000), (70, 1850000)):
        for d_el in ps[idx].iter(f"{{{W_NS}}}drawing"):
            configure_anchor_right_square(d_el, cx_emu=cx_val, pos_v_emu=20000)

    # Remove first-line indent on P55, P56, P58, P71 when used as question sub-lines or answer space
    for idx in (55, 56, 58, 71):
        pPr = ps[idx].find(f"{{{W_NS}}}pPr")
        if pPr is not None:
            ind = pPr.find(f"{{{W_NS}}}ind")
            if ind is not None:
                pPr.remove(ind)

    # 5. Populate Section III (`三、新知应用 思维迁移`: 5 classic 2.3.1 exercises)
    # Q1 (P52 - P53): 物流货运反比例应用选择题
    patcher.set_paragraph_rich_text(
        52,
        r"1．某物流公司需运送500t抗旱物资前往受灾地区，平均每天运送的物资量v（单位：t/天）与规定的运送时间t（单位：天）之间满足反比例函数关系．若要求在不超过10天内全部运完，则平均每天至少需运送物资（　　）",
        size_pt=12.0,
    )
    patcher.set_paragraph_rich_text(
        53,
        "A．25t\tB．50t\tC．100t\tD．500t",
        size_pt=12.0,
    )

    # Q2 (P54 - P56, paired with `image37.png` lever diagram): 阿基米德杠杆原理实际建模
    patcher.set_paragraph_rich_text(
        54,
        r"2．如图，古希腊科学家阿基米德发现杠杆平衡原理：动力$\times$动力臂$=$阻力$\times$阻力臂（即$Fl_1=F_{\text{阻}}l_2$）．某工程队用撬棍撬动一块大石头，已知石头对撬棍的阻力$F_{\text{阻}}=1200\text{N}$，阻力臂$l_2=0.5\text{m}$，则动力F（单位：N）关于动力臂$l_1$（单位：m）的函数表达式为__blank__；若工人在撬棍右端施加的动力臂$l_1=1.5\text{m}$，则撬动这块石头至少需要动力$F=$__blank__N．",
        size_pt=12.0,
    )
    patcher.set_paragraph_rich_text(55, "", size_pt=12.0)
    patcher.set_paragraph_rich_text(56, "", size_pt=12.0)

    # Q3 (P57 - P62, paired with `image36.png` eyeglasses curve): 跨学科物理·近视眼镜度数与焦距
    patcher.set_paragraph_rich_text(
        57,
        r"3．（跨学科·物理）近视眼镜的度数y（单位：度）与镜片焦距x（单位：m）成反比例，其函数图象如图所示，且图象经过点A(0.5,800)．则y关于x的函数表达式为__blank__；若某同学佩戴的近视眼镜度数为400度，则该镜片的焦距x为__blank__m．",
        size_pt=12.0,
    )
    for empty_idx in (58, 59, 60, 61, 62):
        patcher.set_paragraph_rich_text(empty_idx, "", size_pt=12.0)

    # Q4 (P63 - P64): 汽车行程速度与时间反比例关系及增减性区间填空
    patcher.set_paragraph_rich_text(
        63,
        r"4．甲、乙两地相距300km，汽车从甲地匀速驶往乙地，行驶的平均速度v（单位：km/h）是行驶时间t（单位：h）的反比例函数．当$t=3\text{h}$时，$v=$__blank__km/h；若该路段最高限速不超过100km/h，则汽车从甲地到乙地至少需要__blank__h；当行驶时间满足$3\le t\le 5$时，平均速度v的取值范围是__blank__．",
        size_pt=12.0,
    )
    patcher.set_paragraph_rich_text(64, "", size_pt=12.0)

    # Q5 (P65 - P67, paired with `image56.png` water dispenser piecewise graph): 饮水机加热与恒温分段函数解答题
    patcher.set_paragraph_rich_text(
        65,
        r"5．某品牌饮水机开启加热程序后，水温y（单位：$^\circ\text{C}$）随时间x（单位：min）变化的图象如图所示：前5min为加热阶段，图象是连接点A(0,20)与点B(5,100)的线段AB；5min后进入恒温散热阶段，图象是反比例函数$y=\frac{k}{x}$（$x>5$）图象的一部分BC．",
        size_pt=12.0,
    )
    patcher.set_paragraph_rich_text(
        66,
        r"（1）分别求出加热阶段（$0\le x\le 5$）和恒温散热阶段（$x>5$）水温y关于时间x的函数表达式；",
        size_pt=12.0,
    )
    patcher.set_paragraph_rich_text(
        67,
        r"（2）当水温不低于$50^\circ\text{C}$时适合冲泡柠檬水，求饮水机开启一次加热程序后，水温不低于$50^\circ\text{C}$的持续时长．",
        size_pt=12.0,
    )

    # 6. Populate Section IV (`四、分层训练 思维提升`: 2 stratified training exercises)
    # Stratified Q1 (P69): 圆柱形容器底面积与液面高度反比例区间问题
    patcher.set_paragraph_rich_text(
        69,
        r"1．向容积固定的圆柱形容器中注入一定体积的液体，容器底面积S（单位：$\text{cm}^2$）与液面高度h（单位：cm）成反比例．已知当液面高度$h=12\text{cm}$时，底面积$S=25\text{cm}^2$；若实验要求液面高度控制在$10\text{cm}\le h\le 15\text{cm}$之间，则所选容器底面积S的取值范围是__blank__．",
        size_pt=12.0,
    )

    # Stratified Q2 (P70 - P72, paired with `image74.png` disinfection piecewise graph): 教室药物熏蒸消毒分段函数综合解答题
    patcher.set_paragraph_rich_text(
        70,
        r"2．为了预防春季流感，某校在周末采用环保药物熏蒸法对教室进行消毒．已知药物释放阶段，教室内每立方米空气中的含药量y（单位：mg）与时间x（单位：min）成正比例（线段OA）；8min后药物释放完毕，此时含药量达到最大值6mg（即点A(8,6)），随后y与x成反比例（曲线$y=\frac{k}{x}$，$x>8$），如图所示．",
        size_pt=12.0,
    )
    patcher.set_paragraph_rich_text(
        71,
        r"（1）分别求出药物释放阶段（$0\le x\le 8$）和药物释放完毕后（$x>8$）y关于x的函数表达式；",
        size_pt=12.0,
    )
    patcher.set_paragraph_rich_text(
        72,
        r"（2）当每立方米空气中的含药量不低于3mg时消毒有效，且当含药量低于1.6mg时学生方可安全进入教室．求此次消毒的有效持续时长，以及从开始消毒到学生可安全进入教室至少需要经过多少分钟？",
        size_pt=12.0,
    )
    # Remove bold/Heiti from P72 pPr so it matches P71
    p71_pPr = ps[71].find(f"{{{W_NS}}}pPr")
    p72_pPr = ps[72].find(f"{{{W_NS}}}pPr")
    if p71_pPr is not None and p72_pPr is not None:
        ps[72].remove(p72_pPr)
        ps[72].insert(0, etree.fromstring(etree.tostring(p71_pPr)))

    # Append 3 blank lines at the end of body so students have room to write Q2's solution
    for _ in range(3):
        blank_p = etree.Element(f"{{{W_NS}}}p")
        if p71_pPr is not None:
            blank_p.append(etree.fromstring(etree.tostring(p71_pPr)))
        patcher.body.insert(list(patcher.body).index(ps[72]) + 1, blank_p)

    # 7. Replace media files with 300 DPI redrawn figures and sync aspect ratios
    media_replacements = {
        "image1.png": os.path.join(REDRAWN_DIR, "image1.png"),
        "image2.png": os.path.join(REDRAWN_DIR, "image2.png"),
        "image10.png": os.path.join(REDRAWN_DIR, "image10.png"),
        "image36.png": os.path.join(REDRAWN_DIR, "image36.png"),
        "image37.png": os.path.join(REDRAWN_DIR, "image37.png"),
        "image38.png": os.path.join(REDRAWN_DIR, "image38.png"),
        "image56.png": os.path.join(REDRAWN_DIR, "image56.png"),
        "image74.png": os.path.join(REDRAWN_DIR, "image74.png"),
    }
    patcher.replace_media_and_clear_crop(media_replacements)

    # 8. Audit cleanliness and save
    clean_ok = patcher.audit_cleanliness()
    if not clean_ok:
        sys.exit(1)
    patcher.save(OUT_DOCX)


if __name__ == "__main__":
    main()

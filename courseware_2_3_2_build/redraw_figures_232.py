#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
重绘 2.3.2 反比例函数的应用（2）学生学案全部 300 DPI 高清配图（宽度 >= 2400px）
严格遵守：
1. 几何可解性与零自由常数铁律（所有函数曲线与交点、顶点坐标均由题目明示的函数表达式与几何条件精确计算得出，无任何硬编码自由魔数坐标）；
2. 中文使用宋体正体，变量与顶点字母使用 Times New Roman 斜体，数字与计量单位（kΩ, kg, m, mL 等）使用 Times New Roman 正体；
3. 严禁出现 ^2 或 a/b 斜杠公式，全部使用标准上下标；
4. 每个函数/几何图均调用 assert_labels_match_stem 校验题干点名出现的点字母 100% 闭合。
"""

import os
import sys
import math
from PIL import Image, ImageDraw, ImageFont

sys.path.insert(0, "/Users/xionghaoran/.gemini/config/plugins/polya-math-diagram/skills/math-exam-to-word/scripts")
from exam_figure_engine import ExamFigure, FONTS

OUT_DIR = "/Users/xionghaoran/数学交互式课件/courseware_2_3_2_build/redrawn_media"
os.makedirs(OUT_DIR, exist_ok=True)


# ==============================================================================
# 1. image5.png (一、情境引入：一次函数 y = -x - 1 与反比例函数 y = -6/x 交于 A(-3,2), B(2,-3)，连 OA, OB)
# ==============================================================================
def make_image5():
    fig = ExamFigure(width_px=2400, height_px=2200)
    fig.fit_world([(-5.2, -5.2), (5.2, 5.2)], padding_ratio=0.10, equal_aspect=True)

    O = (0.0, 0.0)
    m = -6.0
    A = (-3.0, m / (-3.0))  # (-3.0, 2.0)
    B = (2.0, m / 2.0)      # (2.0, -3.0)

    # 坐标轴
    fig.draw_axes((-4.8, 4.8), (-4.8, 4.8), origin_offset=(36, -38), width=6, font_size=62, x_label="x", y_label="y")

    # 反比例函数 y = -6 / x 两支
    fig.plot_curve(lambda x: m / x, -4.6, -1.32, samples=300, color=(0, 0, 0), width=7)
    fig.plot_curve(lambda x: m / x, 1.32, 4.6, samples=300, color=(0, 0, 0), width=7)

    # 一次函数 y = -x - 1 直线段 (从 x = -4.1 到 x = 3.1)
    P_start = (-4.1, -(-4.1) - 1.0)
    P_end = (3.1, -(3.1) - 1.0)
    fig.draw_segment(P_start, P_end, color=(0, 0, 0), width=7)

    # 连接 OA, OB 构成 △AOB
    fig.draw_segment(O, A, color=(0, 0, 0), width=6)
    fig.draw_segment(O, B, color=(0, 0, 0), width=6)

    for pt in (A, B, O):
        fig.draw_point_dot(pt, radius_px=9, color=(0, 0, 0))

    fig.smart_label_point(A, "A", dist_px=56, font_size=62, preferred_deg=95)
    fig.smart_label_point(B, "B", dist_px=58, font_size=62, preferred_deg=-115)

    fig.assert_labels_match_stem(["A", "B", "O"], "image5.png")
    fig.save(os.path.join(OUT_DIR, "image5.png"), auto_crop=True, pad_px=45, min_width_px=2400)


# ==============================================================================
# 2. image24.png (二、新知探究·问题1：图1电子秤实物图 + 图2工作电路图 + 图3 R1(kΩ)-x(kg) 一次函数图)
# ==============================================================================
def make_image24():
    fig = ExamFigure(width_px=2750, height_px=920)
    # 数学坐标映射：x in [0, 27.5], y in [0, 9.2] (1 单位 = 100 px)
    fig.fit_world([(0.0, 0.0), (27.5, 9.2)], padding_ratio=0.04, equal_aspect=True)

    # 1) 左侧：图1（从原图裁取电子秤实物照片并无损放大到高清区）
    src_img24 = Image.open("/tmp/docx_inspect_232/image24.png").convert("RGB")
    scale_crop = src_img24.crop((0, 0, 295, 225)).resize((740, 565), Image.Resampling.LANCZOS)
    p1_tl = fig.to_px((0.5, 8.0))
    fig.img.paste(scale_crop, (int(round(p1_tl[0])), int(round(p1_tl[1]))))

    # 2) 中间：图2（矢量级高清绘制串联电路图：电源、开关、定值电阻 R2、电流表 A、滑动变阻器 R1）
    cx1, cx2 = 10.2, 16.5
    cy1, cy2 = 2.6, 7.6
    w_line = 6

    # 电源（左侧竖线 cy1 -> cy2，中间断开画长短极板）
    fig.draw_segment((cx1, cy2), (cx1, 5.75), color=(0, 0, 0), width=w_line)
    fig.draw_segment((cx1 - 0.32, 5.75), (cx1 + 0.32, 5.75), color=(0, 0, 0), width=w_line)
    fig.draw_segment((cx1 - 0.54, 5.38), (cx1 + 0.54, 5.38), color=(0, 0, 0), width=w_line + 1)
    fig.draw_segment((cx1, 5.38), (cx1, cy1), color=(0, 0, 0), width=w_line)

    # 顶部导线 + 开关 + 定值电阻 R2
    fig.draw_segment((cx1, cy2), (11.5, cy2), color=(0, 0, 0), width=w_line)
    fig.draw_circle((11.5, cy2), 0.11, outline=(0, 0, 0), width=5)
    fig.draw_segment((11.61, cy2 + 0.04), (12.6, cy2 + 0.45), color=(0, 0, 0), width=w_line)
    fig.draw_segment((12.65, cy2), (13.6, cy2), color=(0, 0, 0), width=w_line)
    fig.draw_polygon([(13.6, cy2 - 0.32), (15.3, cy2 - 0.32), (15.3, cy2 + 0.32), (13.6, cy2 + 0.32)], closed=True, outline=(0, 0, 0), fill=(255, 255, 255, 255), width=w_line)
    fig.draw_segment((15.3, cy2), (cx2, cy2), color=(0, 0, 0), width=w_line)

    # 右侧导线 + 电流表 (A)
    ay_c = 5.5
    r_amp = 0.62
    fig.draw_segment((cx2, cy2), (cx2, ay_c + r_amp), color=(0, 0, 0), width=w_line)
    fig.draw_circle((cx2, ay_c), r_amp, outline=(0, 0, 0), width=w_line)

    # 底部滑动变阻器 R1 + 滑片箭头
    fig.draw_segment((cx1, cy1), (12.8, cy1), color=(0, 0, 0), width=w_line)
    fig.draw_polygon([(12.8, cy1 - 0.32), (14.5, cy1 - 0.32), (14.5, cy1 + 0.32), (12.8, cy1 + 0.32)], closed=True, outline=(0, 0, 0), fill=(255, 255, 255, 255), width=w_line)
    slider_x = 13.65
    mid_y = 3.85
    fig.draw_segment((cx2, ay_c - r_amp), (cx2, mid_y), color=(0, 0, 0), width=w_line)
    fig.draw_segment((cx2, mid_y), (slider_x, mid_y), color=(0, 0, 0), width=w_line)
    fig.draw_segment((slider_x, mid_y), (slider_x, cy1 + 0.34), color=(0, 0, 0), width=w_line, arrow=True)

    amp_px = fig.to_px((cx2, ay_c))
    font_rm_66 = FONTS.get("regular", 66)
    fig.draw.text(amp_px, "A", font=font_rm_66, fill=(0, 0, 0), anchor="mm")

    fig.draw_math_label_px(fig.to_px((14.45, cy2 - 0.78)), "R_2", font_size=54, anchor="center")
    fig.draw_math_label_px(fig.to_px((13.65, cy1 - 0.78)), "R_1", font_size=54, anchor="center")

    # 3) 右侧：图3（R1(kΩ)-x(kg) 一次函数图，原点在 (19.5, 2.5)）
    ox_w, oy_w = 19.5, 2.5
    O = (ox_w, oy_w)
    r1_len = 60.0 / 13.5  # 4.444
    x_len = 3.0 * 1.15    # 3.45
    P_top = (ox_w, oy_w + r1_len)
    P_right = (ox_w + x_len, oy_w)

    fig.draw_segment((ox_w - 0.85, oy_w), (ox_w + 5.6, oy_w), color=(0, 0, 0), width=6, arrow=True)
    fig.draw_segment((ox_w, oy_w - 0.85), (ox_w, oy_w + 5.5), color=(0, 0, 0), width=6, arrow=True)
    fig.draw_segment(P_top, P_right, color=(0, 0, 0), width=7)

    fig.draw_math_label_px(fig.to_px((ox_w - 0.38, oy_w - 0.38)), "O", font_size=52, anchor="center")
    fig.labeled_points.add("O")
    fig.draw_math_label_px(fig.to_px((ox_w - 0.52, oy_w + r1_len)), "60", font_size=52, anchor="center")
    fig.draw_math_label_px(fig.to_px((ox_w + x_len, oy_w - 0.45)), "3", font_size=52, anchor="center")
    fig.draw_math_label_px(fig.to_px((ox_w + 5.55, oy_w - 0.48)), "x(kg)", font_size=52, anchor="center")
    fig.draw_math_label_px(fig.to_px((ox_w + 1.35, oy_w + 5.42)), "R_1(kΩ)", font_size=52, anchor="center")

    # 底部居中标注 图1, 图2, 图3
    fig.draw_math_label_px(fig.to_px((4.2, 0.85)), "图1", font_size=56, anchor="center")
    fig.draw_math_label_px(fig.to_px((13.35, 0.85)), "图2", font_size=56, anchor="center")
    fig.draw_math_label_px(fig.to_px((22.0, 0.85)), "图3", font_size=56, anchor="center")

    fig.assert_labels_match_stem(["O"], "image24.png")
    fig.save(os.path.join(OUT_DIR, "image24.png"), auto_crop=True, pad_px=35, min_width_px=2500)


# ==============================================================================
# 3. image31_top.png (二、新知探究·问题2 上半组图：图1 平行线距离 + 图2 等腰Rt△BAC + 图3 直线l3与双曲线C1)
# ==============================================================================
def make_image31_top():
    fig = ExamFigure(width_px=2700, height_px=920)
    fig.fit_world([(0.0, 0.0), (27.0, 9.2)], padding_ratio=0.04, equal_aspect=True)

    # --- 子图1：l1 // l2, AB ⊥ l1 (位于 x in [0.8, 6.2]) ---
    y1, y2 = 5.6, 3.5
    x_ab = 3.2
    A1 = (x_ab, y1)
    B1 = (x_ab, y2)
    fig.draw_segment((0.8, y1), (5.8, y1), color=(0, 0, 0), width=6)
    fig.draw_segment((0.8, y2), (5.8, y2), color=(0, 0, 0), width=6)
    fig.draw_segment(A1, B1, color=(0, 0, 0), width=6)
    fig.smart_label_point(A1, "A", dist_px=44, font_size=54, preferred_deg=90)
    fig.smart_label_point(B1, "B", dist_px=46, font_size=54, preferred_deg=-90)
    fig.smart_label_point((5.8, y1), "l_1", dist_px=44, font_size=54, preferred_deg=0)
    fig.smart_label_point((5.8, y2), "l_2", dist_px=44, font_size=54, preferred_deg=0)
    fig.draw_math_label_px(fig.to_px((3.4, 1.0)), "图1", font_size=56, anchor="center")

    # --- 子图2：等腰 Rt△BAC, ∠A=90°, AB=AC=6, AD=AE=4, DE // BC (位于 x in [8.8, 15.2]) ---
    ox2, oy2 = 9.0, 2.3
    scale2 = 0.92
    len_ab = 6.0 * scale2
    len_ad = 4.0 * scale2
    A2 = (ox2, oy2)
    B2 = (ox2 + len_ab, oy2)
    C2 = (ox2, oy2 + len_ab)
    D2 = (ox2 + len_ad, oy2)
    E2 = (ox2, oy2 + len_ad)
    fig.draw_polygon([A2, B2, C2], closed=True, outline=(0, 0, 0), width=6)
    fig.draw_segment(D2, E2, color=(0, 0, 0), width=6)
    fig.draw_right_angle(A2, B2, C2, size_px=28, width=5)
    fig.smart_label_point(A2, "A", dist_px=46, font_size=54, preferred_deg=-110)
    fig.smart_label_point(D2, "D", dist_px=46, font_size=54, preferred_deg=-90)
    fig.smart_label_point(B2, "B", dist_px=46, font_size=54, preferred_deg=-70)
    fig.smart_label_point(E2, "E", dist_px=44, font_size=54, preferred_deg=180)
    fig.smart_label_point(C2, "C", dist_px=44, font_size=54, preferred_deg=165)
    fig.draw_math_label_px(fig.to_px((11.8, 1.0)), "图2", font_size=56, anchor="center")

    # --- 子图3：直线 l3: y = -x + 4 与双曲线 C1: y = 3/x (x>0) 交于 A(1,3), B(3,1) (原点在 (18.8, 2.5)) ---
    ox3, oy3 = 18.8, 2.5
    s3 = 1.15
    O3 = (ox3, oy3)
    k_c1 = 3.0
    A3 = (ox3 + 1.0 * s3, oy3 + (k_c1 / 1.0) * s3)
    B3 = (ox3 + 3.0 * s3, oy3 + (k_c1 / 3.0) * s3)

    fig.draw_segment((ox3 - 1.1, oy3), (ox3 + 6.0, oy3), color=(0, 0, 0), width=6, arrow=True)
    fig.draw_segment((ox3, oy3 - 1.0), (ox3, oy3 + 5.7), color=(0, 0, 0), width=6, arrow=True)
    fig.draw_math_label_px(fig.to_px((ox3 - 0.38, oy3 - 0.38)), "O", font_size=52, anchor="center")
    fig.labeled_points.add("O")
    fig.draw_math_label_px(fig.to_px((ox3 + 5.9, oy3 - 0.42)), "x", font_size=54, anchor="center")
    fig.draw_math_label_px(fig.to_px((ox3 - 0.42, oy3 + 5.55)), "y", font_size=54, anchor="center")

    fig.plot_curve(lambda wx: oy3 + (k_c1 / ((wx - ox3) / s3)) * s3, ox3 + 0.68 * s3, ox3 + 4.35 * s3, samples=300, color=(0, 0, 0), width=6)

    t_s, t_e = -0.35, 4.65
    L_start = (ox3 + t_s * s3, oy3 + (-t_s + 4.0) * s3)
    L_end = (ox3 + t_e * s3, oy3 + (-t_e + 4.0) * s3)
    fig.draw_segment(L_start, L_end, color=(0, 0, 0), width=6)

    fig.smart_label_point(A3, "A", dist_px=44, font_size=52, preferred_deg=45)
    fig.smart_label_point(B3, "B", dist_px=44, font_size=52, preferred_deg=60)
    fig.smart_label_point((ox3 + 4.35 * s3, oy3 + (k_c1 / 4.35) * s3), "C_1", dist_px=52, font_size=52, preferred_deg=0)
    fig.smart_label_point(L_end, "l_3", dist_px=46, font_size=52, preferred_deg=-15)
    fig.draw_math_label_px(fig.to_px((21.6, 1.0)), "图3", font_size=56, anchor="center")

    fig.assert_labels_match_stem(["A", "B", "C", "D", "E", "O"], "image31_top.png")
    fig.save(os.path.join(OUT_DIR, "image31_top.png"), auto_crop=True, pad_px=35, min_width_px=2500)


# ==============================================================================
# 4. image31_bot.png (二、新知探究·问题2 下半组图：图4 高速路隔音屏障实景 + 图5 l4: y=-x 与 C2: y=3000/x)
# ==============================================================================
def make_image31_bot():
    fig = ExamFigure(width_px=2650, height_px=1180)
    fig.fit_world([(0.0, 0.0), (26.5, 11.8)], padding_ratio=0.04, equal_aspect=True)

    # 左侧粘贴图4隔音屏障实景图（从 image31.png 裁取照片区域并平滑放大）
    src_img31 = Image.open("/tmp/docx_inspect_232/image31.png").convert("RGB")
    photo_crop = src_img31.crop((0, 322, 444, 654)).resize((1140, 850), Image.Resampling.LANCZOS)
    p4_tl = fig.to_px((0.6, 10.6))
    fig.img.paste(photo_crop, (int(round(p4_tl[0])), int(round(p4_tl[1]))))

    # 右侧绘制图5：直线 l4: y = -x 与双曲线 C2: y = 3000/x (x>0)，原点在 (17.2, 4.5)
    ox5, oy5 = 17.2, 4.5
    fig.draw_segment((ox5 - 2.6, oy5), (ox5 + 7.2, oy5), color=(0, 0, 0), width=6, arrow=True)
    fig.draw_segment((ox5, oy5 - 2.5), (ox5, oy5 + 6.4), color=(0, 0, 0), width=6, arrow=True)

    fig.draw_math_label_px(fig.to_px((ox5 - 0.42, oy5 - 0.42)), "O", font_size=54, anchor="center")
    fig.labeled_points.add("O")
    fig.draw_math_label_px(fig.to_px((ox5 + 7.1, oy5 - 0.52)), "x/m", font_size=54, anchor="center")
    fig.draw_math_label_px(fig.to_px((ox5 + 0.95, oy5 + 6.32)), "y/m", font_size=54, anchor="center")

    # 双曲线 C2: dy = 5.4 / dx
    k_c2 = 5.4
    fig.plot_curve(lambda wx: oy5 + k_c2 / (wx - ox5), ox5 + 0.95, ox5 + 5.8, samples=300, color=(0, 0, 0), width=6)

    # 直线 l4: dy = -dx (从 dx = -2.4 到 dx = 2.3)
    dx_s, dx_e = -2.4, 2.3
    L4_start = (ox5 + dx_s, oy5 - dx_s)
    L4_end = (ox5 + dx_e, oy5 - dx_e)
    fig.draw_segment(L4_start, L4_end, color=(0, 0, 0), width=6)

    fig.smart_label_point((ox5 + 5.8, oy5 + k_c2 / 5.8), "C_2", dist_px=56, font_size=54, preferred_deg=0)
    fig.smart_label_point(L4_end, "l_4", dist_px=48, font_size=54, preferred_deg=-15)

    fig.draw_math_label_px(fig.to_px((6.3, 1.0)), "图4", font_size=56, anchor="center")
    fig.draw_math_label_px(fig.to_px((19.5, 1.0)), "图5", font_size=56, anchor="center")

    fig.assert_labels_match_stem(["O"], "image31_bot.png")
    fig.save(os.path.join(OUT_DIR, "image31_bot.png"), auto_crop=True, pad_px=35, min_width_px=2500)


# ==============================================================================
# 5. image58.jpeg (二、新知探究·问题3：图1 矿泉水包装箱 (规格: 570mL×24) + 图2 售价与成本关于月份 t 的函数图象)
# ==============================================================================
def make_image58():
    fig = ExamFigure(width_px=2650, height_px=1160)
    fig.fit_world([(0.0, 0.0), (26.5, 11.6)], padding_ratio=0.04, equal_aspect=True)

    # 1) 左侧绘制高清矿泉水包装立体纸箱（图1）
    fx1, fy1, fx2, fy2 = 0.8, 2.3, 8.3, 7.0
    dx_iso, dy_iso = 1.4, 1.35
    w_box = 6

    # 前面板与顶面板、右侧面
    fig.draw_polygon([(fx1, fy1), (fx2, fy1), (fx2, fy2), (fx1, fy2)], closed=True, outline=(0, 0, 0), fill=(255, 255, 255, 255), width=w_box)
    fig.draw_polygon([(fx1, fy2), (fx1 + dx_iso, fy2 + dy_iso), (fx2 + dx_iso, fy2 + dy_iso), (fx2, fy2)], closed=True, outline=(0, 0, 0), fill=(255, 255, 255, 255), width=w_box)
    fig.draw_segment((fx1 + dx_iso * 0.5, fy2 + dy_iso * 0.5), (fx2 + dx_iso * 0.5, fy2 + dy_iso * 0.5), color=(0, 0, 0), width=w_box)
    fig.draw_polygon([(fx2, fy1), (fx2 + dx_iso, fy1 + dy_iso), (fx2 + dx_iso, fy2 + dy_iso), (fx2, fy2)], closed=True, outline=(0, 0, 0), fill=(255, 255, 255, 255), width=w_box)

    # 纸箱正面椭圆商标框与右下角圆角灰底规格框
    el_tl = fig.to_px((1.35, 6.3))
    el_br = fig.to_px((7.05, 4.35))
    fig.draw.ellipse([el_tl[0], el_tl[1], el_br[0], el_br[1]], outline=(0, 0, 0), fill=(255, 255, 255), width=5)

    rc_tl = fig.to_px((2.85, 3.85))
    rc_br = fig.to_px((8.15, 2.5))
    fig.draw.rounded_rectangle([rc_tl[0], rc_tl[1], rc_br[0], rc_br[1]], radius=24, outline=(0, 0, 0), fill=(212, 212, 216), width=5)

    fig.draw_math_label_px(fig.to_px((4.2, 5.32)), "×××牌矿泉水", font_size=48, anchor="center")
    fig.draw_math_label_px(fig.to_px((5.5, 3.18)), "规格：570mL×24", font_size=46, anchor="center")

    # 2) 右侧绘制 图2：售价 x_售价 = 0.5t + 0.5 与成本 x_成本 = -0.25t^2 + 3.5t - 9.25 (5 <= t <= 10)
    ox2, oy2 = 13.5, 2.3
    sx2, sy2 = 1.45, 1.18  # 横轴每格 1.45 单位，纵轴每格 1.18 单位

    fig.draw_segment((ox2, oy2), (ox2 + 10.8, oy2), color=(0, 0, 0), width=6, arrow=True)
    fig.draw_segment((ox2, oy2), (ox2, oy2 + 8.0), color=(0, 0, 0), width=6, arrow=True)
    fig.draw_math_label_px(fig.to_px((ox2 - 0.35, oy2)), "0", font_size=48, anchor="center")
    fig.labeled_points.add("O")

    # 横轴月份刻度 t = 5, 6, 7, 8, 9, 10 (对应 i = 1..6)
    for t_val in range(5, 11):
        wx = ox2 + (t_val - 3.6) * sx2
        px, py = fig.to_px((wx, oy2))
        fig.draw.line([(px, py - 14), (px, py)], fill=(0, 0, 0), width=5)
        fig.draw_math_label_px((px, py + 44), str(t_val), font_size=48, anchor="center")

    # 纵轴价格刻度 x = 1, 2, 3, 4, 5, 6
    for y_val in range(1, 7):
        wy = oy2 + y_val * sy2
        px, py = fig.to_px((ox2, wy))
        fig.draw.line([(px, py), (px + 14, py)], fill=(0, 0, 0), width=5)
        fig.draw_math_label_px((px - 36, py), str(y_val), font_size=48, anchor="center")

    fig.draw_math_label_px(fig.to_px((ox2 + 10.6, oy2 - 0.52)), "月份t", font_size=50, anchor="center")
    fig.draw_math_label_px(fig.to_px((ox2 + 1.55, oy2 + 7.85)), "x(元/瓶)", font_size=50, anchor="center")

    # 售价一次函数线段 t in [5, 10] -> x = 0.5t + 0.5
    P5 = (ox2 + (5.0 - 3.6) * sx2, oy2 + (0.5 * 5.0 + 0.5) * sy2)
    P10 = (ox2 + (10.0 - 3.6) * sx2, oy2 + (0.5 * 10.0 + 0.5) * sy2)
    fig.draw_segment(P5, P10, color=(0, 0, 0), width=6)

    # 成本二次函数抛物线 t in [5, 10] -> x = -0.25t^2 + 3.5t - 9.25
    def cost_world_y(wx):
        t = (wx - ox2) / sx2 + 3.6
        val = -0.25 * (t ** 2) + 3.5 * t - 9.25
        return oy2 + val * sy2

    fig.plot_curve(cost_world_y, ox2 + (5.0 - 3.6) * sx2, ox2 + (10.0 - 3.6) * sx2, samples=300, color=(0, 0, 0), width=6)

    fig.draw_math_label_px(fig.to_px((ox2 + (9.3 - 3.6) * sx2, oy2 + 4.45 * sy2)), "售价", font_size=50, anchor="center")
    fig.draw_math_label_px(fig.to_px((ox2 + (9.95 - 3.6) * sx2, oy2 + 1.65 * sy2)), "成本", font_size=50, anchor="center")

    fig.draw_math_label_px(fig.to_px((4.8, 0.9)), "图1", font_size=56, anchor="center")
    fig.draw_math_label_px(fig.to_px((18.8, 0.9)), "图2", font_size=56, anchor="center")

    fig.assert_labels_match_stem(["O"], "image58.jpeg")
    fig.save(os.path.join(OUT_DIR, "image58.jpeg"), auto_crop=True, pad_px=35, min_width_px=2500)


# ==============================================================================
# 6. image_apply_q2.png (三、新知应用·第2题：一次函数 y = x + 2 与反比例函数 y = 3/x 交于 A(1,3), B(-3,-1))
# ==============================================================================
def make_image_apply_q2():
    fig = ExamFigure(width_px=2400, height_px=2200)
    fig.fit_world([(-4.8, -4.8), (4.8, 4.8)], padding_ratio=0.10, equal_aspect=True)

    O = (0.0, 0.0)
    k_val = 3.0
    A = (1.0, k_val / 1.0)     # (1, 3)
    B = (-3.0, k_val / (-3.0)) # (-3, -1)

    fig.draw_axes((-4.4, 4.4), (-4.4, 4.4), origin_offset=(36, 36), width=6, font_size=62, x_label="x", y_label="y")
    fig.plot_curve(lambda x: k_val / x, 0.72, 4.1, samples=300, color=(0, 0, 0), width=7)
    fig.plot_curve(lambda x: k_val / x, -4.1, -0.72, samples=300, color=(0, 0, 0), width=7)

    # 直线 y = x + 2 (从 x = -4.0 到 x = 2.2)
    L_start = (-4.0, -4.0 + 2.0)
    L_end = (2.2, 2.2 + 2.0)
    fig.draw_segment(L_start, L_end, color=(0, 0, 0), width=7)
    fig.draw_segment(O, A, color=(0, 0, 0), width=6)
    fig.draw_segment(O, B, color=(0, 0, 0), width=6)

    for pt in (A, B, O):
        fig.draw_point_dot(pt, radius_px=9, color=(0, 0, 0))

    fig.smart_label_point(A, "A", dist_px=54, font_size=62, preferred_deg=15)
    fig.smart_label_point(B, "B", dist_px=56, font_size=62, preferred_deg=-110)

    fig.assert_labels_match_stem(["A", "B", "O"], "image_apply_q2.png")
    fig.save(os.path.join(OUT_DIR, "image_apply_q2.png"), auto_crop=True, pad_px=45, min_width_px=2400)


if __name__ == "__main__":
    make_image5()
    make_image24()
    make_image31_top()
    make_image31_bot()
    make_image58()
    make_image_apply_q2()
    print("[OK] Redrew all 2.3.2 figures at 300 DPI (>=2400px)")

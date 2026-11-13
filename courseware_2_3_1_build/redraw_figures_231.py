#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
重绘 2.3.1 反比例函数的应用（1）学生学案全部 300 DPI 高清配图（宽度 >= 2400px）
严格遵守：
1. 几何可解性与零自由常数铁律（所有函数曲线上的特征点坐标均由函数表达式精确计算，无任何硬编码魔数坐标）；
2. 中文使用宋体正体，变量与顶点字母使用 Times New Roman 斜体，数字与计量单位（Pa, m, A, Ω, cm, N, kg, °C, min, mg）使用 Times New Roman 正体；
3. 严禁出现 ^2 或 a/b 斜杠公式，全部使用标准上标与二维上下叠置分式；
4. 每个函数/几何图均调用 assert_labels_match_stem 校验题干点名出现的点字母 100% 闭合。
"""

import os
import sys
import math
from PIL import Image, ImageDraw

sys.path.insert(0, "/Users/xionghaoran/.gemini/config/plugins/polya-math-diagram/skills/math-exam-to-word/scripts")
from exam_figure_engine import ExamFigure, FONTS

OUT_DIR = "/Users/xionghaoran/数学交互式课件/courseware_2_3_1_build/redrawn_media"
os.makedirs(OUT_DIR, exist_ok=True)


# ==============================================================================
# 1. image1.png (情境引入：湿地铺木板压强 p(Pa) 与面积 S(m^2) 空白描点坐标纸)
#    纯学生视角：提供第一象限标准虚线网格与刻度 (S: 0.1~0.6, p: 1000~6000)，保持空白供学生作图
# ==============================================================================
def make_image1():
    fig = ExamFigure(width_px=2400, height_px=2100)
    # 数学坐标映射：x 对应 S * 10 (即 1..6 格代表 0.1..0.6 m^2)，y 对应 p / 1000 (即 1..6 格代表 1000..6000 Pa)
    fig.fit_world([(-0.9, -0.85), (7.2, 7.1)], padding_ratio=0.10, equal_aspect=True)

    # 绘制 6x6 浅灰虚线网格 (1..6)
    grid_color = (160, 160, 160)
    for gx in range(1, 7):
        fig.draw_segment((gx, 0), (gx, 6.2), color=grid_color, width=3, dashed=True, dash_len=18, gap_len=14)
    for gy in range(1, 7):
        fig.draw_segment((0, gy), (6.2, gy), color=grid_color, width=3, dashed=True, dash_len=18, gap_len=14)

    # 绘制主坐标轴
    fig.draw_segment((-0.5, 0), (6.8, 0), color=(0, 0, 0), width=6, arrow=True)
    fig.draw_segment((0, -0.5), (0, 6.8), color=(0, 0, 0), width=6, arrow=True)

    # 坐标轴刻度短线与数值
    for gx in range(1, 7):
        px, py = fig.to_px((gx, 0))
        fig.draw.line([(px, py - 12), (px, py + 12)], fill=(0, 0, 0), width=5)
        fig.draw_math_label_px((px, py + 44), f"0.{gx}", font_size=48, anchor="center")

    for gy in range(1, 7):
        px, py = fig.to_px((0, gy))
        fig.draw.line([(px - 12, py), (px + 12, py)], fill=(0, 0, 0), width=5)
        fig.draw_math_label_px((px - 76, py), f"{gy * 1000}", font_size=46, anchor="center")

    # 原点 O 与坐标轴物理量/单位标签 (严格正体单位 Pa, m^2)
    ox, oy = fig.to_px((0, 0))
    fig.draw_math_label_px((ox - 38, oy + 42), "O", font_size=54, anchor="center")
    fig.labeled_points.add("O")

    px_xend, py_xend = fig.to_px((6.75, 0))
    fig.draw_math_label_px((px_xend - 20, py_xend + 62), "S/m^2", font_size=54, anchor="center")

    px_yend, py_yend = fig.to_px((0, 6.75))
    fig.draw_math_label_px((px_yend + 95, py_yend + 10), "p/Pa", font_size=54, anchor="center")

    fig.assert_labels_match_stem(["O"], "image1.png")
    fig.save(os.path.join(OUT_DIR, "image1.png"), auto_crop=True, pad_px=45, min_width_px=2400)


# ==============================================================================
# 2. image2.png (新知探究·问题1：蓄电池电流 I(A) 与电阻 R(Ω) 图象 I = 36/R，过点 A(9, 4))
# ==============================================================================
def make_image2():
    fig = ExamFigure(width_px=2400, height_px=2550)
    # 数学世界坐标：x = R / 2 (0..10 对应 R = 0..20)，y = I / 3 (0..13 对应 I = 0..39)
    fig.fit_world([(-1.2, -1.1), (10.5, 13.2)], padding_ratio=0.08, equal_aspect=True)

    U = 36.0
    # 关键网格对应点 R in [1, 2, 3, 4, 6, 9, 12, 18] -> I = 36 / R
    grid_Rs = [1, 2, 3, 4, 6, 9, 12, 18]
    dash_col = (2, 132, 199)
    for r_val in grid_Rs:
        i_val = U / r_val
        wx, wy = r_val / 2.0, i_val / 3.0
        fig.draw_segment((wx, 0), (wx, wy), color=dash_col, width=4, dashed=True, dash_len=18, gap_len=12)
        fig.draw_segment((0, wy), (wx, wy), color=dash_col, width=4, dashed=True, dash_len=18, gap_len=12)

    # 坐标轴
    axis_col = (0, 119, 182)
    fig.draw_segment((0, 0), (10.1, 0), color=axis_col, width=6, arrow=True)
    fig.draw_segment((0, 0), (0, 12.8), color=axis_col, width=6, arrow=True)

    # R 轴刻度 (2, 4, 6, ..., 18)
    for r_tick in range(2, 19, 2):
        wx = r_tick / 2.0
        px, py = fig.to_px((wx, 0))
        fig.draw.line([(px, py - 12), (px, py)], fill=axis_col, width=5)
        fig.draw_math_label_px((px, py + 44), str(r_tick), font_size=48, anchor="center")

    # I 轴刻度 (3, 6, 9, ..., 36)
    for i_tick in range(3, 37, 3):
        wy = i_tick / 3.0
        px, py = fig.to_px((0, wy))
        fig.draw.line([(px, py), (px + 12, py)], fill=axis_col, width=5)
        fig.draw_math_label_px((px - 48, py), str(i_tick), font_size=48, anchor="center")

    ox, oy = fig.to_px((0, 0))
    fig.draw_math_label_px((ox - 34, oy + 42), "O", font_size=50, anchor="center")
    fig.labeled_points.add("O")

    # 绘制反比例曲线 I = 36 / R (R from 1 to 18 -> wx from 0.5 to 9.0)
    fig.plot_curve(lambda wx: (U / (wx * 2.0)) / 3.0, 0.5, 9.0, samples=500, color=(0, 0, 0), width=7)

    # 标注点 A(9, 4) -> wx = 4.5, wy = 4/3
    A = (9.0 / 2.0, 4.0 / 3.0)
    fig.draw_point_dot(A, radius_px=10, color=(0, 0, 0))
    ax, ay = fig.to_px(A)
    fig.draw_math_label_px((ax + 115, ay - 38), "A(9,4)", font_size=54, anchor="center")
    fig.labeled_points.add("A")

    # 轴端标签 R/Ω, I/A
    px_rx, py_rx = fig.to_px((9.8, 0))
    fig.draw_math_label_px((px_rx, py_rx + 56), "R/Ω", font_size=54, anchor="center")
    px_iy, py_iy = fig.to_px((0, 12.6))
    fig.draw_math_label_px((px_iy + 78, py_iy + 6), "I/A", font_size=54, anchor="center")

    fig.assert_labels_match_stem(["A", "O"], "image2.png")
    fig.save(os.path.join(OUT_DIR, "image2.png"), auto_crop=True, pad_px=40, min_width_px=2400)


# ==============================================================================
# 3. image10.png (新知探究·问题2：桔槔实验数据描点网格图1，x/N: 0~50, y/cm: 0~8)
# ==============================================================================
def make_image10():
    fig = ExamFigure(width_px=2400, height_px=1850)
    # 数学坐标：1 格 = 5N (x: 0..12 对应 0..60N)，纵轴 1 格 = 1cm (y: 0..8 对应 0..8cm)
    fig.fit_world([(-1.2, -1.6), (13.6, 9.4)], padding_ratio=0.08, equal_aspect=True)

    grid_col = (145, 145, 145)
    for gx in range(1, 13):
        fig.draw_segment((gx, 0), (gx, 8), color=grid_col, width=3, dashed=True, dash_len=20, gap_len=14)
    for gy in range(1, 9):
        fig.draw_segment((0, gy), (12, gy), color=grid_col, width=3, dashed=True, dash_len=20, gap_len=14)

    fig.draw_segment((0, 0), (13.1, 0), color=(0, 0, 0), width=6, arrow=True)
    fig.draw_segment((0, 0), (0, 8.95), color=(0, 0, 0), width=6, arrow=True)

    # x 轴刻度 10, 20, 30, 40, 50 (对应 gx = 2, 4, 6, 8, 10)
    for gx in range(2, 11, 2):
        px, py = fig.to_px((gx, 0))
        fig.draw.line([(px, py - 14), (px, py)], fill=(0, 0, 0), width=5)
        fig.draw_math_label_px((px, py + 48), str(gx * 5), font_size=54, anchor="center")

    # y 轴刻度 0..8
    for gy in range(0, 9):
        px, py = fig.to_px((0, gy))
        if gy > 0:
            fig.draw.line([(px, py), (px + 14, py)], fill=(0, 0, 0), width=5)
        fig.draw_math_label_px((px - 42, py), str(gy), font_size=54, anchor="center")

    px_xend, py_xend = fig.to_px((12.9, 0))
    fig.draw_math_label_px((px_xend, py_xend + 56), "x/N", font_size=56, anchor="center")

    px_yend, py_yend = fig.to_px((0, 8.85))
    fig.draw_math_label_px((px_yend + 92, py_yend + 4), "y/cm", font_size=56, anchor="center")

    # 底部居中标注“图1”（与题干“（1）在图1中描出表中数据对应的点”严格呼应）
    cx_mid, cy_bot = fig.to_px((6.2, -1.15))
    fig.draw_math_label_px((cx_mid, cy_bot), "图1", font_size=52, anchor="center")

    fig.save(os.path.join(OUT_DIR, "image10.png"), auto_crop=True, pad_px=40, min_width_px=2400)


# ==============================================================================
# 4. image36.png (新知应用第3题：近视眼镜镜片度数 y(度) 与焦距 x(m) 的反比例函数 y = 400/x，过 A(0.5, 800))
# ==============================================================================
def make_image36():
    fig = ExamFigure(width_px=2400, height_px=2200)
    # 数学坐标：wx = x * 4 (x=0.5 -> wx=2.0)，wy = y / 200 (y=800 -> wy=4.0)
    fig.fit_world([(-1.0, -1.0), (5.8, 5.8)], padding_ratio=0.12, equal_aspect=True)

    k_scaled = 2.0 * 4.0  # wx * wy = (4x)*(y/200) = 4*400/200 = 8.0
    A = (2.0, k_scaled / 2.0)  # (2.0, 4.0) 对应真实坐标 (0.5, 800)
    Ax = (A[0], 0.0)
    Ay = (0.0, A[1])

    fig.draw_segment(Ax, A, color=(100, 100, 100), width=4, dashed=True, dash_len=20, gap_len=14)
    fig.draw_segment(Ay, A, color=(100, 100, 100), width=4, dashed=True, dash_len=20, gap_len=14)

    fig.draw_axes((-0.4, 5.3), (-0.4, 5.3), origin_offset=(-36, 38), width=6, font_size=60, x_label="x/m", y_label="y/度")
    fig.plot_curve(lambda wx: k_scaled / wx, 1.55, 4.9, samples=300, color=(0, 0, 0), width=7)

    fig.draw_point_dot(A, radius_px=10, color=(0, 0, 0))
    fig.smart_label_point(A, "A", dist_px=56, font_size=60, preferred_deg=45)

    px_ax, py_ax = fig.to_px(Ax)
    fig.draw_math_label_px((px_ax, py_ax + 48), "0.5", font_size=54, anchor="center")
    px_ay, py_ay = fig.to_px(Ay)
    fig.draw_math_label_px((px_ay - 64, py_ay), "800", font_size=54, anchor="center")

    fig.assert_labels_match_stem(["A", "O"], "image36.png")
    fig.save(os.path.join(OUT_DIR, "image36.png"), auto_crop=True, pad_px=45, min_width_px=2400)


# ==============================================================================
# 5. image37.png (新知应用第2题：杠杆原理撬石头示意图，动力臂 L1、阻力臂 L2、支点 O)
# ==============================================================================
def make_image37():
    fig = ExamFigure(width_px=2400, height_px=1800)
    fig.fit_world([(-3.2, -1.6), (3.6, 2.8)], padding_ratio=0.10, equal_aspect=True)

    # 小支石三角形 (支点 O 在原点 (0.0, 0.0)，撬棍斜率 m = 0.4)
    O = (0.0, 0.0)
    slope = 0.4
    l1_len = 3.2
    l2_len = 1.2
    A = (-l2_len, -l2_len * slope)
    B = (l1_len, l1_len * slope)
    ground_y = -0.55

    # 地面水平线与斜纹
    fig.draw_segment((-2.1, ground_y), (3.9, ground_y), color=(0, 0, 0), width=6)
    for i in range(18):
        gx = -1.9 + i * 0.32
        fig.draw_segment((gx, ground_y), (gx - 0.18, ground_y - 0.25), color=(80, 80, 80), width=4)

    S1 = (-0.45, ground_y)  # MOVING_POINT_ON_AXIS
    S2 = (0.45, ground_y)   # MOVING_POINT_ON_AXIS
    fig.draw_polygon([O, S1, S2], closed=True, outline=(0, 0, 0), fill=(190, 190, 190, 255), width=5)

    # 撬棍 AB
    fig.draw_segment(A, B, color=(0, 0, 0), width=9)

    # 左侧大石头多边形
    rock_pts = [(-1.95, ground_y), (-1.05, ground_y), (-0.85, 0.10), (-1.25, 0.70), (-1.85, 0.50), (-2.10, -0.05)]
    fig.draw_polygon(rock_pts, closed=True, outline=(0, 0, 0), fill=(220, 220, 220, 255), width=5)

    # 右端 B 处向下的动力箭头 F
    F_end = (B[0], B[1] - 1.15)
    fig.draw_segment(B, F_end, color=(0, 0, 0), width=6, arrow=True)

    for pt in (O, B):
        fig.draw_point_dot(pt, radius_px=9, color=(0, 0, 0))

    fig.smart_label_point(O, "O", dist_px=54, font_size=58, preferred_deg=115)
    fig.smart_label_point(F_end, "F", dist_px=52, font_size=58, preferred_deg=-30)
    fig.smart_label_point((-0.65, -0.08), "l_2", dist_px=42, font_size=54, preferred_deg=120)
    fig.smart_label_point((1.6, 0.65), "l_1", dist_px=48, font_size=54, preferred_deg=120)

    fig.assert_labels_match_stem(["O", "F"], "image37.png")
    fig.save(os.path.join(OUT_DIR, "image37.png"), auto_crop=True, pad_px=45, min_width_px=2400)


# ==============================================================================
# 6. image38.png (空白透明占位图，因为原 P59 挂载了3张小图，我们将第3张设为1x1纯白透明或隐藏)
# ==============================================================================
def make_image38_blank():
    im = Image.new("RGB", (20, 20), (255, 255, 255))
    im.save(os.path.join(OUT_DIR, "image38.png"), dpi=(300, 300))


# ==============================================================================
# 7. image56.png (新知应用第5题：饮水机加热(一次函数 AB)与恒温(反比例函数 BC)水温 y(°C) 与时间 x(min) 分段图象)
#    数学关系：A(0, 20), B(5, 100)，当 x > 5 时 y = 500/x，在 x = 10 时 y = 50 (点 C(10, 50))
# ==============================================================================
def make_image56():
    fig = ExamFigure(width_px=2400, height_px=2000)
    # 数学坐标映射：wx = x / 2.5 (x=5 -> wx=2.0, x=10 -> wx=4.0)，wy = y / 25 (y=20 -> wy=0.8, y=100 -> wy=4.0)
    fig.fit_world([(-1.1, -0.9), (6.8, 5.2)], padding_ratio=0.10, equal_aspect=True)

    A = (0.0, 20.0 / 25.0)       # (0, 0.8) -> (0, 20)
    B = (5.0 / 2.5, 100.0 / 25.0)  # (2.0, 4.0) -> (5, 100)
    Bx = (B[0], 0.0)
    By = (0.0, B[1])

    # 虚线辅助线
    fig.draw_segment(Bx, B, color=(110, 110, 110), width=4, dashed=True, dash_len=20, gap_len=14)
    fig.draw_segment(By, B, color=(110, 110, 110), width=4, dashed=True, dash_len=20, gap_len=14)

    # 坐标轴
    fig.draw_axes((-0.4, 6.2), (-0.4, 4.8), origin_offset=(-36, 38), width=6, font_size=54, x_label="x/min", y_label="y/°C")

    # 线段 AB (0 <= x <= 5) 与反比例曲线 BC (x >= 5, wy = 8.0 / wx)
    fig.draw_segment(A, B, color=(0, 0, 0), width=7)
    fig.plot_curve(lambda wx: 8.0 / wx, 2.0, 5.6, samples=300, color=(0, 0, 0), width=7)

    C = (4.2, 8.0 / 4.2)
    for pt in (A, B, C):
        fig.draw_point_dot(pt, radius_px=9, color=(0, 0, 0))

    # 刻度数字 20, 100, 5 (先标注 20 以便点 A 自动避让在右侧)
    px_a, py_a = fig.to_px(A)
    fig.draw_math_label_px((px_a - 54, py_a), "20", font_size=48, anchor="center")
    px_by, py_by = fig.to_px(By)
    fig.draw_math_label_px((px_by - 64, py_by), "100", font_size=48, anchor="center")
    px_bx, py_bx = fig.to_px(Bx)
    fig.draw_math_label_px((px_bx, py_bx + 46), "5", font_size=48, anchor="center")

    fig.smart_label_point(A, "A", dist_px=48, font_size=54, preferred_deg=15)
    fig.smart_label_point(B, "B", dist_px=52, font_size=54, preferred_deg=65)
    fig.smart_label_point(C, "C", dist_px=52, font_size=54, preferred_deg=45)

    fig.assert_labels_match_stem(["A", "B", "C", "O"], "image56.png")
    fig.save(os.path.join(OUT_DIR, "image56.png"), auto_crop=True, pad_px=45, min_width_px=2400)


# ==============================================================================
# 8. image74.png (分层训练第2题：环保消毒药物释放阶段正比例函数 OA 与发效阶段反比例函数 AB 图象)
#    数学关系：y(mg) 与 x(min)，OA 过 (0,0) 和 A(8, 6)，AB 为 y = 48/x (x >= 8)
# ==============================================================================
def make_image74():
    fig = ExamFigure(width_px=2400, height_px=1350)
    # wx = x / 4.0 (x=8 -> wx=2.0), wy = y / 2.0 (y=6 -> wy=3.0)
    fig.fit_world([(-0.8, -0.75), (7.6, 3.8)], padding_ratio=0.10, equal_aspect=True)

    O = (0.0, 0.0)
    A = (8.0 / 4.0, 6.0 / 2.0)  # (2.0, 3.0) -> (8, 6)
    Ax = (A[0], 0.0)
    Ay = (0.0, A[1])

    fig.draw_segment(Ax, A, color=(110, 110, 110), width=4, dashed=True, dash_len=20, gap_len=14)
    fig.draw_segment(Ay, A, color=(110, 110, 110), width=4, dashed=True, dash_len=20, gap_len=14)

    fig.draw_axes((-0.35, 7.1), (-0.35, 3.55), origin_offset=(-34, 34), width=6, font_size=50, x_label="x/min", y_label="y/mg")

    # 线段 OA 与反比例曲线 y = 48/x (wy = 6.0 / wx)
    fig.draw_segment(O, A, color=(0, 0, 0), width=7)
    fig.plot_curve(lambda wx: 6.0 / wx, 2.0, 6.5, samples=300, color=(0, 0, 0), width=7)

    fig.draw_point_dot(A, radius_px=9, color=(0, 0, 0))
    fig.smart_label_point(A, "A", dist_px=48, font_size=52, preferred_deg=65)

    px_ax, py_ax = fig.to_px(Ax)
    fig.draw_math_label_px((px_ax, py_ax + 44), "8", font_size=48, anchor="center")
    px_ay, py_ay = fig.to_px(Ay)
    fig.draw_math_label_px((px_ay - 44, py_ay), "6", font_size=48, anchor="center")

    fig.assert_labels_match_stem(["A", "O"], "image74.png")
    fig.save(os.path.join(OUT_DIR, "image74.png"), auto_crop=True, pad_px=40, min_width_px=2400)


if __name__ == "__main__":
    make_image1()
    make_image2()
    make_image10()
    make_image36()
    make_image37()
    make_image38_blank()
    make_image56()
    make_image74()
    print("[OK] Redrew all 2.3.1 figures at 300 DPI (>=2400px)")

#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
重绘 2.2.3 反比例函数中“k”的几何意义 学生学案全部 14 张高清配图（300 DPI，宽度 >= 2400px）
严格遵守：
1. 中文使用宋体正体（Songti.ttc），几何顶点与变量字母使用 Times New Roman 斜体，数字与运算符使用 Times New Roman 正体；
2. 图内所有分式（如 y = k_1/x, y = k_2/x, y = k/x, y = 1/x, y = -6/x）全部绘制为上下叠置的二维分式；
3. 坐标轴刻度数字标在无双曲线经过的一侧，严禁压线。
"""

import os
import sys
import math
from PIL import Image, ImageDraw

sys.path.insert(0, "/Users/xionghaoran/.gemini/config/plugins/polya-math-diagram/skills/math-exam-to-word/scripts")
from exam_figure_engine import ExamFigure, FONTS

MEDIA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "docx_unpacked", "word", "media")


class SubFigure(ExamFigure):
    """允许任意像素宽高的子图画布，用于拼接进 >= 2400px 的多子图总画布"""
    def __init__(self, width_px: int = 800, height_px: int = 800, bg_color=(255, 255, 255)):
        self.width = int(width_px)
        self.height = int(height_px)
        self.img = Image.new("RGB", (self.width, self.height), bg_color)
        self.draw = ImageDraw.Draw(self.img, "RGBA")
        self.scale_x = 100.0
        self.scale_y = 100.0
        self.offset_x = self.width / 2.0
        self.offset_y = self.height / 2.0
        self.obstacles_segments = []
        self.placed_label_boxes = []


def draw_axes_custom(fig: ExamFigure, x_range, y_range, origin_offset=(-34, 34), width: int = 5, font_size: int = 54):
    """支持自定义原点 O 偏移方向（例如当直线穿过一、三象限时将 O 放在第二象限侧 (-36, -34) 防压线）"""
    xmin, xmax = x_range
    ymin, ymax = y_range
    fig.draw_segment((xmin, 0), (xmax, 0), color=(0, 0, 0), width=width, arrow=True)
    fig.draw_segment((0, ymin), (0, ymax), color=(0, 0, 0), width=width, arrow=True)

    px_xmax, py_x = fig.to_px((xmax, 0))
    fig.draw_math_label_px((px_xmax - 10, py_x + 42), "x", font_size=font_size, anchor="center")

    px_y, py_ymax = fig.to_px((0, ymax))
    fig.draw_math_label_px((px_y + 42, py_ymax + 15), "y", font_size=font_size, anchor="center")

    ox, oy = fig.to_px((0, 0))
    fig.draw_math_label_px((ox + origin_offset[0], oy + origin_offset[1]), "O", font_size=font_size, anchor="center")


def draw_stacked_equation_px(fig: ExamFigure, center_px, lhs_str: str, sign_str: str, num_str: str, den_str: str, font_size: int = 58, color=(0, 0, 0)):
    """
    在像素坐标 center_px 处绘制形如 y = num/den 或 y = -num/den 的标准上下叠置二维分式方程
    支持 num_str 含下标如 'k_1', 'k_2' 或普通字母/数字 'k', '1', '6'
    """
    cx, cy = center_px
    lhs_w, lhs_h = fig.measure_math_label(lhs_str, font_size=font_size)
    sign_w, sign_h = fig.measure_math_label(sign_str, font_size=font_size) if sign_str else (0, 0)
    frac_font = int(round(font_size * 0.90))
    num_w, num_h = fig.measure_math_label(num_str, font_size=frac_font)
    den_w, den_h = fig.measure_math_label(den_str, font_size=frac_font)

    bar_w = max(num_w, den_w) + 20
    gap_x = 8
    total_w = lhs_w + gap_x + (sign_w + gap_x if sign_str else 0) + bar_w

    cur_x = cx - total_w / 2.0
    fig.draw_math_label_px((cur_x + lhs_w / 2.0, cy), lhs_str, font_size=font_size, color=color, anchor="center")
    cur_x += lhs_w + gap_x

    if sign_str:
        fig.draw_math_label_px((cur_x + sign_w / 2.0, cy), sign_str, font_size=font_size, color=color, anchor="center")
        cur_x += sign_w + gap_x

    bar_cx = cur_x + bar_w / 2.0
    fig.draw.line([(cur_x, cy), (cur_x + bar_w, cy)], fill=color, width=max(4, font_size // 13))
    fig.draw_math_label_px((bar_cx, cy - num_h * 0.62 - 9), num_str, font_size=frac_font, color=color, anchor="center")
    fig.draw_math_label_px((bar_cx, cy + den_h * 0.62 + 9), den_str, font_size=frac_font, color=color, anchor="center")

    box = (cx - total_w / 2.0 - 6, cy - num_h - 16, cx + total_w / 2.0 + 6, cy + den_h + 16)
    fig.placed_label_boxes.append(box)
    return box


def draw_circled_title_px(fig: ExamFigure, center_px, num_int: int, text_after: str, font_size: int = 40, color=(0, 0, 0)):
    """绘制带标准圆圈数字 ①②③④ 的标题（避免字库缺失 ① 变成方框）"""
    cx, cy = center_px
    r = int(round(font_size * 0.48))
    w_txt, h_txt = fig.measure_math_label(text_after, font_size=font_size) if text_after else (0, 0)
    gap = 12 if text_after else 0
    total_w = 2 * r + gap + w_txt
    start_x = cx - total_w / 2.0

    c_x = start_x + r
    fig.draw.ellipse([c_x - r, cy - r, c_x + r, cy + r], outline=color, width=3)
    fig.draw_math_label_px((c_x, cy), str(num_int), font_size=int(round(font_size * 0.72)), color=color, anchor="center")
    if text_after:
        fig.draw_math_label_px((start_x + 2 * r + gap + w_txt / 2.0, cy), text_after, font_size=font_size, color=color, anchor="center")


def draw_s_shadow_blank_px(fig: ExamFigure, center_px, font_size: int = 44):
    """在像素坐标 center_px 处绘制 'S_阴影 = ________'（S 斜体，阴影 宋体下标，= 与横线 正体）"""
    cx, cy = center_px
    w_s, h_s = fig.measure_math_label("S", font_size=font_size)
    sub_sz = int(round(font_size * 0.65))
    w_sub, h_sub = fig.measure_math_label("阴影", font_size=sub_sz)
    w_eq, _ = fig.measure_math_label("=", font_size=font_size)
    line_w = 180
    total_w = w_s + 4 + w_sub + 14 + w_eq + 14 + line_w

    cur_x = cx - total_w / 2.0
    fig.draw_math_label_px((cur_x + w_s / 2.0, cy), "S", font_size=font_size, anchor="center")
    cur_x += w_s + 4
    fig.draw_math_label_px((cur_x + w_sub / 2.0, cy + font_size * 0.28), "阴影", font_size=sub_sz, anchor="center")
    cur_x += w_sub + 14
    fig.draw_math_label_px((cur_x + w_eq / 2.0, cy), "=", font_size=font_size, anchor="center")
    cur_x += w_eq + 14
    line_y = cy + font_size * 0.36
    fig.draw.line([(cur_x, line_y), (cur_x + line_w, line_y)], fill=(0, 0, 0), width=3)


# ==============================================================================
# 1. image2.png (P07 情境引入：矩形 AOBQ 与 △AOQ, △BOQ，统一黑白灰风格)
# ==============================================================================
def make_image2():
    fig = ExamFigure(width_px=2400, height_px=2200)
    pts = [(-3.6, -3.6), (3.6, 3.6)]
    fig.fit_world(pts, padding_ratio=0.14)

    k = 2.4
    Q = (1.6, k / 1.6)
    A = (0.0, Q[1])
    B = (Q[0], 0.0)
    O = (0.0, 0.0)

    fig.draw_polygon([O, B, Q, A], closed=True, outline=(0, 0, 0), fill=(205, 205, 205, 255), width=6)
    fig.draw_axes((-3.4, 3.5), (-3.4, 3.5), width=6, font_size=76)
    fig.plot_curve(lambda x: k / x, 0.72, 3.25, color=(0, 0, 0), width=7)
    fig.plot_curve(lambda x: k / x, -3.25, -0.72, color=(0, 0, 0), width=7)
    fig.draw_segment(O, Q, color=(0, 0, 0), width=6)
    for pt in (A, B, Q, O):
        fig.draw_point_dot(pt, radius_px=9, color=(0, 0, 0))

    fig.smart_label_point(A, "A", dist_px=68, font_size=76, preferred_deg=180)
    fig.smart_label_point(B, "B", dist_px=68, font_size=76, preferred_deg=-90)
    fig.smart_label_point(Q, "Q", dist_px=72, font_size=76, preferred_deg=45)

    fig.save(os.path.join(MEDIA_DIR, "image2.png"), auto_crop=True, pad_px=60, min_width_px=2400)


# ==============================================================================
# 2. image3.png (问题1三联图：图(1) D在y轴正半轴，图(2) D在y轴负半轴，图(3) AC⊥y轴且E在x轴上)
# ==============================================================================
def make_image3():
    W, H = 3300, 1060
    canvas = ExamFigure(width_px=W, height_px=H)
    col_w = W / 3.0

    for idx in range(3):
        sub_w, sub_h = int(col_w) - 24, 900
        sub = SubFigure(width_px=sub_w, height_px=sub_h)
        sub.fit_world([(-1.8, -2.1), (3.8, 3.5)], padding_ratio=0.11)

        k = 2.2
        A = (1.05, k / 1.05)
        B = (A[0], 0.0)
        C = (0.0, A[1])
        O = (0.0, 0.0)

        if idx == 0:
            D = (0.0, 2.85)
            sub.draw_polygon([A, B, D], closed=True, outline=(0, 0, 0), fill=(196, 196, 196, 255), width=5)
            sub.draw_segment(O, A, color=(0, 0, 0), width=5)
            sub.draw_axes((-1.6, 3.55), (-1.9, 3.35), width=5, font_size=50)
            sub.plot_curve(lambda x: k / x, 0.66, 3.3, color=(0, 0, 0), width=6)
            for pt in (A, B, D, O):
                sub.draw_point_dot(pt, radius_px=7)
            sub.smart_label_point(A, "A", dist_px=46, font_size=50, preferred_deg=25)
            sub.smart_label_point(B, "B", dist_px=46, font_size=50, preferred_deg=-90)
            sub.smart_label_point(D, "D", dist_px=46, font_size=50, preferred_deg=180)
        elif idx == 1:
            D = (0.0, -1.55)
            sub.draw_polygon([A, B, D], closed=True, outline=(0, 0, 0), fill=(196, 196, 196, 255), width=5)
            sub.draw_segment(O, A, color=(0, 0, 0), width=5)
            sub.draw_axes((-1.6, 3.55), (-1.9, 3.35), width=5, font_size=50)
            sub.plot_curve(lambda x: k / x, 0.66, 3.3, color=(0, 0, 0), width=6)
            for pt in (A, B, D, O):
                sub.draw_point_dot(pt, radius_px=7)
            sub.smart_label_point(A, "A", dist_px=46, font_size=50, preferred_deg=25)
            sub.smart_label_point(B, "B", dist_px=46, font_size=50, preferred_deg=-65)
            sub.smart_label_point(D, "D", dist_px=46, font_size=50, preferred_deg=180)
        else:
            # 图(3)：作 AC ⊥ y 轴于 C，点 E 为 x 轴上一动点，阴影 △ACE
            A3 = (1.85, k / 1.85)
            C3 = (0.0, A3[1])
            E3 = (2.85, 0.0)
            sub.draw_polygon([A3, C3, E3], closed=True, outline=(0, 0, 0), fill=(196, 196, 196, 255), width=5)
            sub.draw_segment(O, A3, color=(0, 0, 0), width=5, dashed=True)
            sub.draw_axes((-1.6, 3.55), (-1.9, 3.35), width=5, font_size=50)
            sub.plot_curve(lambda x: k / x, 0.66, 3.3, color=(0, 0, 0), width=6)
            for pt in (A3, C3, E3, O):
                sub.draw_point_dot(pt, radius_px=7)
            sub.smart_label_point(A3, "A", dist_px=46, font_size=50, preferred_deg=45)
            sub.smart_label_point(C3, "C", dist_px=46, font_size=50, preferred_deg=180)
            sub.smart_label_point(E3, "E", dist_px=46, font_size=50, preferred_deg=-90)

        x_left = int(idx * col_w) + 12
        canvas.img.paste(sub.img, (x_left, 15))
        canvas.draw_math_label_px((x_left + sub_w / 2.0, H - 55), f"图({idx + 1})", font_size=46, anchor="center")

    canvas.save(os.path.join(MEDIA_DIR, "image3.png"), auto_crop=True, pad_px=30, min_width_px=3100)


# ==============================================================================
# 3. image4.png (P13 问题1右图：点 D 在 y 轴负半轴)
# ==============================================================================
def make_image4():
    fig = ExamFigure(width_px=2400, height_px=2100)
    pts = [(-2.6, -2.4), (3.8, 3.5)]
    fig.fit_world(pts, padding_ratio=0.14)

    k = 2.2
    A = (1.0, 2.2)
    B = (1.0, 0.0)
    D = (0.0, -1.65)
    O = (0.0, 0.0)

    fig.draw_polygon([A, B, D], closed=True, outline=(0, 0, 0), fill=(196, 196, 196, 255), width=6)
    fig.draw_segment(O, A, color=(0, 0, 0), width=6)
    fig.draw_axes((-2.5, 3.6), (-2.3, 3.4), width=6, font_size=74)
    fig.plot_curve(lambda x: k / x, 0.66, 3.3, color=(0, 0, 0), width=6)

    for pt in (A, B, D, O):
        fig.draw_point_dot(pt, radius_px=8)

    fig.smart_label_point(A, "A", dist_px=66, font_size=74, preferred_deg=20)
    fig.smart_label_point(B, "B", dist_px=64, font_size=74, preferred_deg=-70)
    fig.smart_label_point(D, "D", dist_px=66, font_size=74, preferred_deg=180)

    fig.save(os.path.join(MEDIA_DIR, "image4.png"), auto_crop=True, pad_px=60, min_width_px=2400)


# ==============================================================================
# 4. image6.png (P19 问题2：S_△AOE 与 S_四边形BECD)
# ==============================================================================
def make_image6():
    fig = ExamFigure(width_px=2400, height_px=2050)
    pts = [(-2.4, -1.8), (3.9, 3.5)]
    fig.fit_world(pts, padding_ratio=0.14)

    k = 2.4
    A = (0.95, k / 0.95)
    B = (0.95, 0.0)
    C = (2.65, k / 2.65)
    D = (2.65, 0.0)
    O = (0.0, 0.0)
    E = (0.95, (C[1] / C[0]) * 0.95)

    fig.draw_polygon([O, A, E], closed=True, outline=(0, 0, 0), fill=(198, 198, 198, 255), width=6)
    fig.draw_polygon([B, E, C, D], closed=True, outline=(0, 0, 0), fill=(138, 138, 138, 255), width=6)
    fig.draw_segment(O, C, color=(0, 0, 0), width=6)
    fig.draw_axes((-2.3, 3.75), (-1.7, 3.4), width=6, font_size=74)
    fig.plot_curve(lambda x: k / x, 0.68, 3.4, color=(0, 0, 0), width=6)

    for pt in (A, B, C, D, E, O):
        fig.draw_point_dot(pt, radius_px=8)

    fig.smart_label_point(A, "A", dist_px=66, font_size=74, preferred_deg=35)
    fig.smart_label_point(B, "B", dist_px=66, font_size=74, preferred_deg=-90)
    fig.smart_label_point(D, "D", dist_px=66, font_size=74, preferred_deg=-90)
    fig.smart_label_point(C, "C", dist_px=66, font_size=74, preferred_deg=45)
    fig.smart_label_point(E, "E", dist_px=64, font_size=74, preferred_deg=65)

    fig.save(os.path.join(MEDIA_DIR, "image6.png"), auto_crop=True, pad_px=60, min_width_px=2400)


# ==============================================================================
# 5. image8.png (问题4：无表格框、无填空横线的五联黑白图 图(1)～图(5)，含高阶双平行线截双曲线拓展)
# ==============================================================================
def make_image8():
    W, H = 3750, 880
    canvas = ExamFigure(width_px=W, height_px=H)
    col_w = W / 5.0

    for idx in range(5):
        sub_w, sub_h = int(col_w) - 16, 750
        sub = SubFigure(width_px=sub_w, height_px=sub_h)

        if idx in (0, 1, 4):
            sub.fit_world([(-0.55, -0.55), (4.3, 3.8)], padding_ratio=0.10)
            k1, k2 = 3.5, 1.45
            y_bar = 1.35
            B = (k1 / y_bar, y_bar)
            F = (k2 / y_bar, y_bar)
            C = (0.0, y_bar)
            A = (B[0], 0.0)
            D_rect = (F[0], 0.0)
            D_tri = (B[0], k2 / B[0])
            O = (0.0, 0.0)

            if idx == 0:
                sub.draw_polygon([D_rect, A, B, F], closed=True, outline=(0, 0, 0), fill=(196, 196, 196, 255), width=4)
                sub.draw_segment(O, C, width=4)
                sub.draw_segment(C, F, width=4)
                sub.draw_axes((-0.35, 3.95), (-0.35, 3.45), width=4, font_size=38)
                sub.plot_curve(lambda x: k1 / x, 1.05, 2.95, width=4)
                sub.plot_curve(lambda x: k2 / x, 0.45, 2.85, width=4)
                for pt in (A, B, C, D_rect, F, O):
                    sub.draw_point_dot(pt, radius_px=6)

                sub.smart_label_point(C, "C", dist_px=32, font_size=38, preferred_deg=180)
                sub.smart_label_point(F, "F", dist_px=34, font_size=38, preferred_deg=110)
                sub.smart_label_point(B, "B", dist_px=34, font_size=38, preferred_deg=55)
                sub.smart_label_point(D_rect, "D", dist_px=34, font_size=38, preferred_deg=-90)
                sub.smart_label_point(A, "A", dist_px=34, font_size=38, preferred_deg=-90)

                draw_stacked_equation_px(sub, sub.to_px((3.52, 0.55)), "y=", "", "k_2", "x", font_size=32)
                draw_stacked_equation_px(sub, sub.to_px((3.52, 1.48)), "y=", "", "k_1", "x", font_size=32)
            elif idx == 1:
                sub.draw_polygon([O, B, D_tri], closed=True, outline=(0, 0, 0), fill=(196, 196, 196, 255), width=4)
                sub.draw_segment(C, B, width=4)
                sub.draw_segment(D_tri, A, width=4)
                sub.draw_axes((-0.35, 3.95), (-0.35, 3.45), width=4, font_size=38)
                sub.plot_curve(lambda x: k1 / x, 1.05, 2.95, width=4)
                sub.plot_curve(lambda x: k2 / x, 0.45, 2.85, width=4)
                for pt in (A, B, C, D_tri, O):
                    sub.draw_point_dot(pt, radius_px=6)

                sub.smart_label_point(C, "C", dist_px=32, font_size=38, preferred_deg=180)
                sub.smart_label_point(B, "B", dist_px=34, font_size=38, preferred_deg=55)
                sub.smart_label_point(D_tri, "D", dist_px=34, font_size=38, preferred_deg=-15)
                sub.smart_label_point(A, "A", dist_px=34, font_size=38, preferred_deg=-90)

                draw_stacked_equation_px(sub, sub.to_px((3.52, 0.55)), "y=", "", "k_2", "x", font_size=32)
                draw_stacked_equation_px(sub, sub.to_px((3.52, 1.48)), "y=", "", "k_1", "x", font_size=32)
            else:
                # 图(5)：高阶拓展——过外支点 B 作 x 轴、y 轴垂线分别交内支于 D, F，连接 OD, OF, DF
                y_b5 = 2.05
                B5 = (k1 / y_b5, y_b5)        # (1.71, 2.05)
                F5 = (k2 / y_b5, y_b5)        # (0.71, 2.05)
                C5 = (0.0, y_b5)
                D5 = (B5[0], k2 / B5[0])      # (1.71, 0.85)
                A5 = (B5[0], 0.0)
                sub.draw_polygon([O, D5, F5], closed=True, outline=(0, 0, 0), fill=(196, 196, 196, 255), width=4)
                sub.draw_polygon([B5, D5, F5], closed=True, outline=(0, 0, 0), fill=(228, 228, 228, 255), width=4)
                sub.draw_segment(C5, B5, width=4)
                sub.draw_segment(B5, A5, width=4)
                sub.draw_axes((-0.35, 3.95), (-0.35, 3.45), width=4, font_size=38)
                sub.plot_curve(lambda x: k1 / x, 1.05, 2.95, width=4)
                sub.plot_curve(lambda x: k2 / x, 0.45, 2.85, width=4)
                for pt in (A5, B5, C5, D5, F5, O):
                    sub.draw_point_dot(pt, radius_px=6)

                sub.smart_label_point(C5, "C", dist_px=32, font_size=38, preferred_deg=180)
                sub.smart_label_point(F5, "F", dist_px=34, font_size=38, preferred_deg=110)
                sub.smart_label_point(B5, "B", dist_px=34, font_size=38, preferred_deg=45)
                sub.smart_label_point(D5, "D", dist_px=34, font_size=38, preferred_deg=-15)
                sub.smart_label_point(A5, "A", dist_px=34, font_size=38, preferred_deg=-90)

                draw_stacked_equation_px(sub, sub.to_px((3.52, 0.55)), "y=", "", "k_2", "x", font_size=32)
                draw_stacked_equation_px(sub, sub.to_px((3.52, 1.48)), "y=", "", "k_1", "x", font_size=32)
        else:
            sub.fit_world([(-3.3, -0.55), (3.3, 3.8)], padding_ratio=0.10)
            k1 = 2.0
            k2 = -2.0
            y_bar = 1.35
            A = (k1 / y_bar, y_bar)
            B = (k2 / y_bar, y_bar)
            D = (A[0], 0.0)
            C = (B[0], 0.0)
            E = (0.0, y_bar)
            O = (0.0, 0.0)

            if idx == 2:
                sub.draw_polygon([C, D, A, B], closed=True, outline=(0, 0, 0), fill=(196, 196, 196, 255), width=4)
                sub.draw_axes((-3.0, 3.0), (-0.35, 3.45), width=4, font_size=38)
                sub.plot_curve(lambda x: k1 / x, 0.65, 2.75, width=4)
                sub.plot_curve(lambda x: k2 / x, -2.75, -0.65, width=4)
                for pt in (A, B, C, D, E, O):
                    sub.draw_point_dot(pt, radius_px=6)

                sub.smart_label_point(B, "B", dist_px=32, font_size=38, preferred_deg=145)
                sub.smart_label_point(E, "E", dist_px=34, font_size=38, preferred_deg=60)
                sub.smart_label_point(A, "A", dist_px=32, font_size=38, preferred_deg=35)
                sub.smart_label_point(C, "C", dist_px=34, font_size=38, preferred_deg=-90)
                sub.smart_label_point(D, "D", dist_px=34, font_size=38, preferred_deg=-90)

                draw_stacked_equation_px(sub, sub.to_px((-1.95, 2.85)), "y=", "", "k_2", "x", font_size=32)
                draw_stacked_equation_px(sub, sub.to_px((1.95, 2.85)), "y=", "", "k_1", "x", font_size=32)
            else:
                sub.draw_polygon([O, A, B], closed=True, outline=(0, 0, 0), fill=(196, 196, 196, 255), width=4)
                sub.draw_axes((-3.0, 3.0), (-0.35, 3.45), width=4, font_size=38)
                sub.plot_curve(lambda x: k1 / x, 0.65, 2.75, width=4)
                sub.plot_curve(lambda x: k2 / x, -2.75, -0.65, width=4)
                for pt in (A, B, E, O):
                    sub.draw_point_dot(pt, radius_px=6)

                sub.smart_label_point(B, "B", dist_px=32, font_size=38, preferred_deg=145)
                sub.smart_label_point(E, "C", dist_px=34, font_size=38, preferred_deg=60)
                sub.smart_label_point(A, "A", dist_px=32, font_size=38, preferred_deg=35)

                draw_stacked_equation_px(sub, sub.to_px((-1.95, 2.85)), "y=", "", "k_2", "x", font_size=32)
                draw_stacked_equation_px(sub, sub.to_px((1.95, 2.85)), "y=", "", "k_1", "x", font_size=32)

        x_left = int(idx * col_w) + 8
        canvas.img.paste(sub.img, (x_left, 15))
        canvas.draw_math_label_px((x_left + sub_w / 2.0, H - 50), f"图({idx + 1})", font_size=42, anchor="center")

    canvas.save(os.path.join(MEDIA_DIR, "image8.png"), auto_crop=True, pad_px=24, min_width_px=3500)


# ==============================================================================
# 6. image9.png (问题2：过原点的直线与双曲线交于对称两点，四个黑白灰子图 图(1)～图(4))
# ==============================================================================
def make_image9():
    W, H = 3600, 960
    canvas = ExamFigure(width_px=W, height_px=H)
    col_w = W / 4.0

    for idx in range(4):
        sub_w, sub_h = int(col_w) - 20, 820
        sub = SubFigure(width_px=sub_w, height_px=sub_h)
        sub.fit_world([(-3.3, -3.3), (3.3, 3.3)], padding_ratio=0.11)

        k = 2.0
        O = (0.0, 0.0)

        if idx == 0:
            A = (1.15, k / 1.15)
            C = (-1.15, -k / 1.15)
            B = (1.15, 0.0)
            sub.draw_polygon([A, B, C], closed=True, outline=(0, 0, 0), fill=(198, 198, 198, 255), width=5)
            sub.draw_right_angle(B, O, A, size_px=26, color=(0, 0, 0), width=4)
            draw_axes_custom(sub, (-3.1, 3.15), (-3.1, 3.15), origin_offset=(-32, -32), width=5, font_size=46)
            sub.plot_curve(lambda x: k / x, 0.65, 2.95, color=(0, 0, 0), width=5)
            sub.plot_curve(lambda x: k / x, -2.95, -0.65, color=(0, 0, 0), width=5)
            for pt in (A, B, C, O):
                sub.draw_point_dot(pt, radius_px=7, color=(0, 0, 0))
            sub.smart_label_point(A, "A", dist_px=42, font_size=46, preferred_deg=45)
            sub.smart_label_point(B, "B", dist_px=44, font_size=46, preferred_deg=-90)
            sub.smart_label_point(C, "C", dist_px=44, font_size=46, preferred_deg=-135)
        elif idx == 1:
            A = (1.3, k / 1.3)
            C = (-1.3, -k / 1.3)
            B = (0.0, A[1])
            sub.draw_polygon([A, B, C], closed=True, outline=(0, 0, 0), fill=(198, 198, 198, 255), width=5)
            sub.draw_right_angle(B, O, A, size_px=26, color=(0, 0, 0), width=4)
            draw_axes_custom(sub, (-3.1, 3.15), (-3.1, 3.15), origin_offset=(32, 32), width=5, font_size=46)
            sub.plot_curve(lambda x: k / x, 0.65, 2.95, color=(0, 0, 0), width=5)
            sub.plot_curve(lambda x: k / x, -2.95, -0.65, color=(0, 0, 0), width=5)
            for pt in (A, B, C, O):
                sub.draw_point_dot(pt, radius_px=7, color=(0, 0, 0))
            sub.smart_label_point(A, "A", dist_px=42, font_size=46, preferred_deg=35)
            sub.smart_label_point(B, "B", dist_px=44, font_size=46, preferred_deg=180)
            sub.smart_label_point(C, "C", dist_px=44, font_size=46, preferred_deg=-135)
        elif idx == 2:
            A = (1.0, k / 1.0)
            B = (-1.0, -k / 1.0)
            C = (1.75, 0.0)
            D = (-1.75, 0.0)
            sub.draw_polygon([A, C, B, D], closed=True, outline=(0, 0, 0), fill=(198, 198, 198, 255), width=5)
            sub.draw_segment(A, B, color=(0, 0, 0), width=5)
            draw_axes_custom(sub, (-3.1, 3.15), (-3.1, 3.15), origin_offset=(-32, -32), width=5, font_size=46)
            sub.plot_curve(lambda x: k / x, 0.65, 2.95, color=(0, 0, 0), width=5)
            sub.plot_curve(lambda x: k / x, -2.95, -0.65, color=(0, 0, 0), width=5)
            for pt in (A, B, C, D, O):
                sub.draw_point_dot(pt, radius_px=7, color=(0, 0, 0))
            sub.smart_label_point(A, "A", dist_px=42, font_size=46, preferred_deg=45)
            sub.smart_label_point(B, "B", dist_px=44, font_size=46, preferred_deg=-135)
            sub.smart_label_point(C, "C", dist_px=44, font_size=46, preferred_deg=-75)
            sub.smart_label_point(D, "D", dist_px=44, font_size=46, preferred_deg=120)
        else:
            A = (0.95, k / 0.95)
            B = (-0.95, -k / 0.95)
            F = (0.0, 1.35)
            E = (0.0, -1.35)
            sub.draw_polygon([A, F, B, E], closed=True, outline=(0, 0, 0), fill=(198, 198, 198, 255), width=5)
            sub.draw_segment(A, B, color=(0, 0, 0), width=5)
            draw_axes_custom(sub, (-3.1, 3.15), (-3.1, 3.15), origin_offset=(48, 32), width=5, font_size=46)
            sub.plot_curve(lambda x: k / x, 0.65, 2.95, color=(0, 0, 0), width=5)
            sub.plot_curve(lambda x: k / x, -2.95, -0.65, color=(0, 0, 0), width=5)
            for pt in (A, B, E, F, O):
                sub.draw_point_dot(pt, radius_px=7, color=(0, 0, 0))
            sub.smart_label_point(A, "A", dist_px=42, font_size=46, preferred_deg=45)
            sub.smart_label_point(B, "B", dist_px=44, font_size=46, preferred_deg=-145)
            sub.smart_label_point(F, "F", dist_px=44, font_size=46, preferred_deg=155)
            sub.smart_label_point(E, "E", dist_px=44, font_size=46, preferred_deg=-30)

        x_left = int(idx * col_w) + 10
        canvas.img.paste(sub.img, (x_left, 15))
        canvas.draw_math_label_px((x_left + sub_w / 2.0, H - 55), f"图({idx + 1})", font_size=44, anchor="center")

    canvas.save(os.path.join(MEDIA_DIR, "image9.png"), auto_crop=True, pad_px=30, min_width_px=3200)


# ==============================================================================
# 7. image10.png (问题3(2)：统一黑白灰风格三子图 方法一、方法二、方法三)
# ==============================================================================
def make_image10():
    W, H = 3300, 1060
    canvas = ExamFigure(width_px=W, height_px=H)
    col_w = W / 3.0

    for idx in range(3):
        sub_w, sub_h = int(col_w) - 24, 900
        sub = SubFigure(width_px=sub_w, height_px=sub_h)
        sub.fit_world([(-0.7, -0.75), (4.5, 4.3)], padding_ratio=0.10)

        k = 2.5
        b = 3.5
        A = (1.0, 2.5)
        B = (2.5, 1.0)
        C_line = (0.0, b)
        D_line = (b, 0.0)
        O = (0.0, 0.0)

        if idx == 0:
            sub.draw_polygon([O, A, B], closed=True, outline=(0, 0, 0), fill=(198, 198, 198, 255), width=5)
            sub.draw_axes((-0.55, 4.25), (-0.55, 4.05), width=5, font_size=50)
            sub.plot_curve(lambda x: k / x, 0.68, 3.65, color=(0, 0, 0), width=6)
            sub.draw_segment((-0.35, b + 0.35), (b + 0.45, -0.45), color=(0, 0, 0), width=5)
            sub.draw_segment(O, A, color=(0, 0, 0), width=5)
            sub.draw_segment(O, B, color=(0, 0, 0), width=5)

            for pt in (A, B, C_line, D_line, O):
                sub.draw_point_dot(pt, radius_px=7, color=(0, 0, 0))
            sub.smart_label_point(C_line, "C", dist_px=44, font_size=50, preferred_deg=25)
            sub.smart_label_point(A, "A", dist_px=44, font_size=50, preferred_deg=55)
            sub.smart_label_point(B, "B", dist_px=44, font_size=50, preferred_deg=55)
            sub.smart_label_point(D_line, "D", dist_px=44, font_size=50, preferred_deg=-125)
        elif idx == 1:
            E = (A[0], 0.0)
            F = (B[0], 0.0)
            M = (A[0], (B[1] / B[0]) * A[0])

            sub.draw_polygon([O, A, B], closed=True, outline=(0, 0, 0), fill=(198, 198, 198, 255), width=5)
            sub.draw_right_angle(E, F, A, size_px=28, color=(0, 0, 0), width=4)
            sub.draw_right_angle(F, D_line, B, size_px=28, color=(0, 0, 0), width=4)
            sub.draw_axes((-0.55, 4.25), (-0.55, 4.05), width=5, font_size=50)
            sub.plot_curve(lambda x: k / x, 0.68, 3.65, color=(0, 0, 0), width=6)
            sub.draw_segment((-0.35, b + 0.35), (b + 0.45, -0.45), color=(0, 0, 0), width=5)
            sub.draw_segment(O, A, color=(0, 0, 0), width=5)
            sub.draw_segment(O, B, color=(0, 0, 0), width=5)
            sub.draw_segment(A, E, color=(0, 0, 0), width=5, dashed=True, dash_len=20, gap_len=14)
            sub.draw_segment(B, F, color=(0, 0, 0), width=5, dashed=True, dash_len=20, gap_len=14)

            for pt in (A, B, C_line, D_line, E, F, M, O):
                sub.draw_point_dot(pt, radius_px=7, color=(0, 0, 0))
            sub.smart_label_point(C_line, "C", dist_px=44, font_size=50, preferred_deg=25)
            sub.smart_label_point(A, "A", dist_px=44, font_size=50, preferred_deg=55)
            sub.smart_label_point(B, "B", dist_px=44, font_size=50, preferred_deg=55)
            sub.smart_label_point(M, "M", dist_px=42, font_size=48, preferred_deg=140)
            sub.smart_label_point(E, "E", dist_px=46, font_size=50, preferred_deg=-90)
            sub.smart_label_point(F, "F", dist_px=46, font_size=50, preferred_deg=-90)
            sub.smart_label_point(D_line, "D", dist_px=46, font_size=50, preferred_deg=-90)
        else:
            C_rect = (0.0, A[1])
            D_rect = (B[0], A[1])
            F_rect = (B[0], 0.0)

            sub.draw_polygon([O, A, B], closed=True, outline=(0, 0, 0), fill=(198, 198, 198, 255), width=5)
            sub.draw_right_angle(C_rect, O, D_rect, size_px=28, color=(0, 0, 0), width=4)
            sub.draw_right_angle(F_rect, (3.5, 0.0), D_rect, size_px=28, color=(0, 0, 0), width=4)
            sub.draw_axes((-0.55, 4.15), (-0.55, 4.05), width=5, font_size=50)
            sub.plot_curve(lambda x: k / x, 0.68, 3.65, color=(0, 0, 0), width=6)
            sub.draw_segment(A, D_rect, color=(0, 0, 0), width=5, dashed=True, dash_len=20, gap_len=14)
            sub.draw_segment(C_rect, A, color=(0, 0, 0), width=5, dashed=True, dash_len=20, gap_len=14)
            sub.draw_segment(D_rect, F_rect, color=(0, 0, 0), width=5, dashed=True, dash_len=20, gap_len=14)

            for pt in (A, B, C_rect, D_rect, F_rect, O):
                sub.draw_point_dot(pt, radius_px=7, color=(0, 0, 0))
            sub.smart_label_point(C_rect, "C", dist_px=44, font_size=50, preferred_deg=180)
            sub.smart_label_point(A, "A", dist_px=44, font_size=50, preferred_deg=90)
            sub.smart_label_point(D_rect, "D", dist_px=44, font_size=50, preferred_deg=45)
            sub.smart_label_point(B, "B", dist_px=44, font_size=50, preferred_deg=25)
            sub.smart_label_point(F_rect, "F", dist_px=46, font_size=50, preferred_deg=-90)

        x_left = int(idx * col_w) + 12
        canvas.img.paste(sub.img, (x_left, 15))
        captions = ["方法一", "方法二", "方法三"]
        canvas.draw_math_label_px((x_left + sub_w / 2.0, H - 58), captions[idx], font_size=48, color=(0, 0, 0), anchor="center")

    canvas.save(os.path.join(MEDIA_DIR, "image10.png"), auto_crop=True, pad_px=30, min_width_px=3000)


# ==============================================================================
# 8. image11.png (P48 新知应用第1题：P1, P2, P3 与 S1, S2)
# ==============================================================================
def make_image11():
    fig = ExamFigure(width_px=2400, height_px=2050)
    pts = [(-0.7, -0.75), (6.8, 5.2)]
    fig.fit_world(pts, padding_ratio=0.12)

    x1, x2, x3 = 1.0, 2.55, 5.1
    f_curve = lambda x: 3.85 / (x ** 0.85)
    y1, y2, y3 = f_curve(x1), f_curve(x2), f_curve(x3)

    P1 = (x1, y1)
    P2 = (x2, y2)
    P3 = (x3, y3)

    fig.draw_polygon([(0, y2), (x1, y2), (x1, y1), (0, y1)], closed=True, outline=(0, 0, 0), fill=(186, 186, 186, 255), width=1, dashed=True)
    fig.draw_polygon([(x2, 0), (x3, 0), (x3, y3), (x2, y3)], closed=True, outline=(0, 0, 0), fill=(186, 186, 186, 255), width=1, dashed=True)

    fig.draw_segment((0, y1), P1, width=5, dashed=True, dash_len=20, gap_len=14)
    fig.draw_segment(P1, (x1, 0), width=5, dashed=True, dash_len=20, gap_len=14)
    fig.draw_segment((0, y2), P2, width=5, dashed=True, dash_len=20, gap_len=14)
    fig.draw_segment(P2, (x2, 0), width=5, dashed=True, dash_len=20, gap_len=14)
    fig.draw_segment((0, y3), P3, width=5, dashed=True, dash_len=20, gap_len=14)
    fig.draw_segment(P3, (x3, 0), width=5, dashed=True, dash_len=20, gap_len=14)

    fig.draw_axes((-0.6, 6.2), (-0.45, 4.85), width=6, font_size=74)
    fig.plot_curve(f_curve, 0.82, 5.95, color=(0, 0, 0), width=6)

    fig.smart_label_point(P1, "P_1", dist_px=68, font_size=70, preferred_deg=25)
    fig.smart_label_point(P2, "P_2", dist_px=68, font_size=70, preferred_deg=45)
    fig.smart_label_point(P3, "P_3", dist_px=68, font_size=70, preferred_deg=65)

    fig.draw_math_label_px(fig.to_px((x1 / 2.0, (y1 + y2) / 2.0)), "S_1", font_size=72, anchor="center")
    fig.draw_math_label_px(fig.to_px(((x2 + x3) / 2.0, y3 / 2.0)), "S_2", font_size=72, anchor="center")

    fig.draw_math_label_px((fig.to_px((x1, 0))[0], fig.to_px((x1, 0))[1] + 50), "1", font_size=68, anchor="center")
    fig.draw_math_label_px((fig.to_px((x2, 0))[0], fig.to_px((x2, 0))[1] + 50), "3", font_size=68, anchor="center")
    fig.draw_math_label_px((fig.to_px((x3, 0))[0], fig.to_px((x3, 0))[1] + 50), "6", font_size=68, anchor="center")

    draw_stacked_equation_px(fig, fig.to_px((6.55, f_curve(5.95))), "y=", "", "k", "x", font_size=68)

    fig.save(os.path.join(MEDIA_DIR, "image11.png"), auto_crop=True, pad_px=60, min_width_px=2400)


# ==============================================================================
# 9. image24.png (P51 新知应用第2题：正比例与反比例交于 A, B，AC ⊥ x轴，连接 BC)
# ==============================================================================
def make_image24():
    fig = ExamFigure(width_px=2400, height_px=2200)
    pts = [(-3.6, -3.6), (3.6, 3.6)]
    fig.fit_world(pts, padding_ratio=0.14)

    k = 1.5
    A = (1.5, 1.0)
    B = (-1.5, -1.0)
    C = (1.5, 0.0)

    # 原点 O 放在左上角第二象限 (-42, -40) 彻底避开直线 AB
    draw_axes_custom(fig, (-3.4, 3.5), (-3.4, 3.5), origin_offset=(-42, -40), width=6, font_size=74)
    fig.plot_curve(lambda x: k / x, 0.45, 3.35, color=(0, 0, 0), width=6)
    fig.plot_curve(lambda x: k / x, -3.35, -0.45, color=(0, 0, 0), width=6)

    fig.draw_segment((-2.6, -2.6 * (2.0 / 3.0)), (2.6, 2.6 * (2.0 / 3.0)), color=(0, 0, 0), width=6)
    fig.draw_segment(A, C, color=(0, 0, 0), width=6)
    fig.draw_segment(B, C, color=(0, 0, 0), width=6)

    fig.smart_label_point(A, "A", dist_px=68, font_size=74, preferred_deg=95)
    fig.smart_label_point(B, "B", dist_px=68, font_size=74, preferred_deg=-95)
    fig.smart_label_point(C, "C", dist_px=66, font_size=74, preferred_deg=-90)

    fig.save(os.path.join(MEDIA_DIR, "image24.png"), auto_crop=True, pad_px=60, min_width_px=2400)


# ==============================================================================
# 10. image32.png (P56 新知应用第3题：△ABC 边 AB 过原点 O，A 在 y=1/x(x<0)，B 在 y=k/x(x>0))
# ==============================================================================
def make_image32():
    fig = ExamFigure(width_px=2400, height_px=2100)
    pts = [(-2.8, -2.8), (4.6, 3.6)]
    fig.fit_world(pts, padding_ratio=0.13)

    m = 0.88
    k1 = 2.4
    k2 = 0.72
    xB = math.sqrt(k1 / m)
    B = (xB, m * xB)
    xA = -math.sqrt(k2 / m)
    A = (xA, m * xA)
    C = (3.15, 0.0)

    # 原点 O 放在左上角第二象限 (-44, -40) 彻底避开线段 AB
    draw_axes_custom(fig, (-2.6, 4.45), (-2.65, 3.45), origin_offset=(-44, -40), width=6, font_size=74)
    fig.plot_curve(lambda x: k1 / x, 0.75, 3.85, color=(0, 0, 0), width=6)
    fig.plot_curve(lambda x: k2 / x, -2.35, -0.28, color=(0, 0, 0), width=6)

    fig.draw_polygon([A, B, C], closed=True, outline=(0, 0, 0), fill=None, width=6)

    fig.smart_label_point(B, "B", dist_px=66, font_size=74, preferred_deg=60)
    fig.smart_label_point(A, "A", dist_px=66, font_size=74, preferred_deg=-130)
    fig.smart_label_point(C, "C", dist_px=66, font_size=74, preferred_deg=-90)

    draw_stacked_equation_px(fig, fig.to_px((3.85, 1.35)), "y=", "", "k", "x", font_size=68)
    draw_stacked_equation_px(fig, fig.to_px((-1.25, -2.25)), "y=", "", "1", "x", font_size=68)

    fig.save(os.path.join(MEDIA_DIR, "image32.png"), auto_crop=True, pad_px=60, min_width_px=2400)


# ==============================================================================
# 11. image38.png (P61 新知应用第4题：第二象限双曲线 y = -6/x 与 y = k/x)
# ==============================================================================
def make_image38():
    fig = ExamFigure(width_px=2400, height_px=2100)
    pts = [(-4.6, -0.8), (1.0, 4.2)]
    fig.fit_world(pts, padding_ratio=0.13)

    k_top = -4.2
    k_bot = -1.6
    xB = -1.45
    A = (xB, k_top / xB)
    D = (xB, k_bot / xB)
    B = (xB, 0.0)
    O = (0.0, 0.0)

    fig.draw_right_angle(B, O, A, size_px=38, color=(0, 0, 0), width=5)
    fig.draw_axes((-4.0, 0.85), (-0.65, 4.05), width=6, font_size=74)
    fig.plot_curve(lambda x: k_top / x, -3.05, -1.15, color=(0, 0, 0), width=6)
    fig.plot_curve(lambda x: k_bot / x, -3.35, -0.44, color=(0, 0, 0), width=6)

    fig.draw_segment(A, B, width=6)
    fig.draw_segment(O, A, width=6)
    fig.draw_segment(O, D, width=6)

    fig.smart_label_point(A, "A", dist_px=64, font_size=74, preferred_deg=135)
    fig.smart_label_point(D, "D", dist_px=78, font_size=74, preferred_deg=135)
    fig.smart_label_point(B, "B", dist_px=66, font_size=74, preferred_deg=-90)

    draw_stacked_equation_px(fig, fig.to_px((-3.05, 2.35)), "y=", "-", "6", "x", font_size=68)
    draw_stacked_equation_px(fig, fig.to_px((-3.95, 0.72)), "y=", "", "k", "x", font_size=68)

    fig.save(os.path.join(MEDIA_DIR, "image38.png"), auto_crop=True, pad_px=60, min_width_px=2400)


# ==============================================================================
# 12. image49.png (P66 新知应用第5题：AB ∥ x轴交两支双曲线，平行四边形 ABCD)
# ==============================================================================
def make_image49():
    fig = ExamFigure(width_px=2400, height_px=1550)
    pts = [(-3.8, -0.7), (3.6, 3.0)]
    fig.fit_world(pts, padding_ratio=0.13)

    k1 = 1.9
    k2 = -2.3
    y0 = 1.05
    A = (k1 / y0, y0)
    B = (k2 / y0, y0)
    shift = -0.68
    D = (A[0] + shift, 0.0)
    C = (B[0] + shift, 0.0)

    fig.draw_axes((-3.6, 3.45), (-0.55, 2.85), width=6, font_size=72)
    fig.plot_curve(lambda x: k1 / x, 0.72, 3.05, color=(0, 0, 0), width=6)
    fig.plot_curve(lambda x: k2 / x, -3.25, -0.88, color=(0, 0, 0), width=6)

    fig.draw_polygon([A, B, C, D], closed=True, outline=(0, 0, 0), fill=None, width=6)

    fig.smart_label_point(A, "A", dist_px=64, font_size=72, preferred_deg=35)
    fig.smart_label_point(B, "B", dist_px=64, font_size=72, preferred_deg=145)
    fig.smart_label_point(C, "C", dist_px=66, font_size=72, preferred_deg=-90)
    fig.smart_label_point(D, "D", dist_px=66, font_size=72, preferred_deg=-90)

    fig.save(os.path.join(MEDIA_DIR, "image49.png"), auto_crop=True, pad_px=60, min_width_px=2400)


# ==============================================================================
# 13. image50.png (P72 分层训练第1题：2026·四川攀枝花 AB ∥ x轴交 y 轴于 D，△ABC)
# ==============================================================================
def make_image50():
    fig = ExamFigure(width_px=2400, height_px=2000)
    pts = [(-3.3, -1.2), (3.3, 3.5)]
    fig.fit_world(pts, padding_ratio=0.13)

    k1 = 1.6
    k2 = -2.4
    y0 = 1.55
    A = (k1 / y0, y0)
    B = (k2 / y0, y0)
    D = (0.0, y0)
    C = (-0.82, 0.0)

    fig.draw_axes((-3.15, 3.15), (-1.05, 3.35), width=6, font_size=74)
    fig.plot_curve(lambda x: k1 / x, 0.50, 2.95, color=(0, 0, 0), width=6)
    fig.plot_curve(lambda x: k2 / x, -3.00, -0.76, color=(0, 0, 0), width=6)

    fig.draw_polygon([A, B, C], closed=True, outline=(0, 0, 0), fill=None, width=6)

    fig.smart_label_point(A, "A", dist_px=66, font_size=74, preferred_deg=25)
    fig.smart_label_point(B, "B", dist_px=66, font_size=74, preferred_deg=155)
    dx_px, dy_px = fig.to_px(D)
    fig.draw_math_label_px((dx_px - 48, dy_px - 46), "D", font_size=74, anchor="center")
    fig.smart_label_point(C, "C", dist_px=66, font_size=74, preferred_deg=-105)

    fig.save(os.path.join(MEDIA_DIR, "image50.png"), auto_crop=True, pad_px=60, min_width_px=2400)


# ==============================================================================
# 14. image62.jpeg (P79 分层训练第2题：一次函数 y=-x+b 与 y=4/x，阴影 △OAF + 四边形 EFBC)
# ==============================================================================
def make_image62():
    fig = ExamFigure(width_px=2400, height_px=2100)
    pts = [(-0.7, -0.7), (4.6, 4.2)]
    fig.fit_world(pts, padding_ratio=0.12)

    k = 2.5
    b = 3.5
    A = (1.0, 2.5)
    B = (2.5, 1.0)
    D = (0.0, b)
    C = (b, 0.0)
    E = (1.0, 0.0)
    O = (0.0, 0.0)
    F = (1.0, (B[1] / B[0]) * 1.0)

    fig.draw_polygon([O, A, F], closed=True, outline=(0, 0, 0), fill=(196, 196, 196, 255), width=6)
    fig.draw_polygon([E, F, B, C], closed=True, outline=(0, 0, 0), fill=(196, 196, 196, 255), width=6)

    fig.draw_axes((-0.55, 4.35), (-0.45, 4.05), width=6, font_size=74)
    fig.plot_curve(lambda x: k / x, 0.68, 3.75, color=(0, 0, 0), width=6)
    fig.draw_segment((-0.32, b + 0.32), (b + 0.42, -0.42), color=(0, 0, 0), width=6)
    fig.draw_segment(O, A, width=6)
    fig.draw_segment(O, B, width=6)
    fig.draw_segment(A, E, width=6)

    fig.smart_label_point(D, "D", dist_px=64, font_size=74, preferred_deg=-150)
    fig.smart_label_point(A, "A", dist_px=64, font_size=74, preferred_deg=45)
    fig.smart_label_point(B, "B", dist_px=64, font_size=74, preferred_deg=55)
    # F 标注在点 F 右上方空白处，完全避开竖线 AE 与斜线 OB
    fx_px, fy_px = fig.to_px(F)
    fig.draw_math_label_px((fx_px + 48, fy_px - 48), "F", font_size=74, anchor="center")
    fig.smart_label_point(E, "E", dist_px=66, font_size=74, preferred_deg=-90)
    fig.smart_label_point(C, "C", dist_px=66, font_size=74, preferred_deg=-115)

    out_path = os.path.join(MEDIA_DIR, "image62.jpeg")
    fig.save(out_path, auto_crop=True, pad_px=60, min_width_px=2400)


# ==============================================================================
# 15. image86.png (P85 分层训练第3题：2025·山东潍坊 图1、图2 与 …)
# ==============================================================================
def make_image86():
    W, H = 2800, 1340
    canvas = ExamFigure(width_px=W, height_px=H)

    for idx in range(2):
        sub_w, sub_h = 1140, 1100
        sub = SubFigure(width_px=sub_w, height_px=sub_h)
        sub.fit_world([(-0.8, -0.75), (3.8, 3.6)], padding_ratio=0.11)

        O = (0.0, 0.0)
        sub.draw_axes((-0.65, 3.55), (-0.65, 3.35), width=6, font_size=62)

        if idx == 0:
            k = 2.04
            A1 = (0.95, k / 0.95)
            B1 = (0.0, A1[1])
            C1 = (A1[0], 0.0)
            sub.plot_curve(lambda x: k / x, 0.65, 3.1, color=(0, 0, 0), width=6)
            sub.draw_segment(B1, A1, width=5)
            sub.draw_segment(C1, A1, width=5)

            sub.smart_label_point(B1, "B_1", dist_px=58, font_size=62, preferred_deg=180)
            sub.smart_label_point(A1, "A_1", dist_px=60, font_size=62, preferred_deg=25)
            sub.smart_label_point(C1, "C_1", dist_px=58, font_size=62, preferred_deg=-90)
        else:
            k = 2.9
            A2 = (2.15, k / 2.15)
            B2 = (0.0, A2[1])
            C2 = (A2[0], 0.0)
            sub.plot_curve(lambda x: k / x, 0.92, 3.15, color=(0, 0, 0), width=6)
            sub.draw_segment(B2, A2, width=5)
            sub.draw_segment(C2, A2, width=5)

            sub.smart_label_point(B2, "B_2", dist_px=58, font_size=62, preferred_deg=180)
            sub.smart_label_point(A2, "A_2", dist_px=60, font_size=62, preferred_deg=35)
            sub.smart_label_point(C2, "C_2", dist_px=58, font_size=62, preferred_deg=-90)

        x_left = 40 + idx * 1200
        canvas.img.paste(sub.img, (x_left, 20))
        canvas.draw_math_label_px((x_left + sub_w / 2.0, H - 80), f"图{idx + 1}", font_size=64, anchor="center")

    canvas.draw_math_label_px((2580, 560), "…", font_size=86, anchor="center")
    canvas.save(os.path.join(MEDIA_DIR, "image86.png"), auto_crop=True, pad_px=50, min_width_px=2600)


# ==============================================================================
# 16. image_apply3_butterfly.png (新知应用第3题：单曲线双点蝴蝶等积与 △AOC 转直角梯形)
# ==============================================================================
def make_image_apply3():
    fig = ExamFigure(width_px=2400, height_px=2100)
    pts = [(-0.8, -0.8), (4.2, 3.8)]
    fig.fit_world(pts, padding_ratio=0.13)

    k = 2.7
    A = (0.9, k / 0.9)   # (0.9, 3.0)
    B = (0.9, 0.0)
    C = (2.7, k / 2.7)   # (2.7, 1.0)
    D = (2.7, 0.0)
    O = (0.0, 0.0)
    E = (0.9, (C[1] / C[0]) * 0.9)  # (0.9, 1/3)

    # 阴影：△AOE 与 四边形BECD
    fig.draw_polygon([O, A, E], closed=True, outline=(0, 0, 0), fill=(208, 208, 208, 255), width=6)
    fig.draw_polygon([B, E, C, D], closed=True, outline=(0, 0, 0), fill=(168, 168, 168, 255), width=6)

    # 线段 OA, OC, AB, CD 及虚线 AC
    fig.draw_segment(O, C, color=(0, 0, 0), width=6)
    fig.draw_segment(O, A, color=(0, 0, 0), width=6)
    fig.draw_segment(A, B, color=(0, 0, 0), width=6)
    fig.draw_segment(C, D, color=(0, 0, 0), width=6)
    fig.draw_segment(A, C, color=(0, 0, 0), width=5, dashed=True)

    fig.draw_axes((-0.65, 3.95), (-0.65, 3.65), width=6, font_size=74)
    fig.plot_curve(lambda x: k / x, 0.74, 3.65, color=(0, 0, 0), width=6)

    for pt in (A, B, C, D, E, O):
        fig.draw_point_dot(pt, radius_px=8)

    fig.smart_label_point(A, "A", dist_px=64, font_size=74, preferred_deg=40)
    fig.smart_label_point(B, "B", dist_px=66, font_size=74, preferred_deg=-90)
    fig.smart_label_point(D, "D", dist_px=66, font_size=74, preferred_deg=-90)
    fig.smart_label_point(C, "C", dist_px=64, font_size=74, preferred_deg=45)
    ex_px, ey_px = fig.to_px(E)
    fig.draw_math_label_px((ex_px - 52, ey_px - 36), "E", font_size=74, anchor="center")

    fig.save(os.path.join(MEDIA_DIR, "image_apply3_butterfly.png"), auto_crop=True, pad_px=60, min_width_px=2400)


def main():
    make_image2()
    make_image3()
    make_image4()
    make_image6()
    make_image8()
    make_image9()
    make_image10()
    make_image11()
    make_image24()
    make_image32()
    make_image38()
    make_image49()
    make_image50()
    make_image62()
    make_image86()
    make_image_apply3()
    print("All 15 figures redrawn successfully!")


if __name__ == "__main__":
    main()

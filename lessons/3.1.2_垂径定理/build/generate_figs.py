#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import math
import os
import sys

sys.path.insert(0, "/Users/xionghaoran/.gemini/config/plugins/polya-math-diagram/skills/math-exam-to-word/scripts")
from exam_figure_engine import ExamFigure, SubFigure

OUT_DIR = "/Users/xionghaoran/数学交互式课件/lessons/3.1.2_垂径定理/build/figs"
os.makedirs(OUT_DIR, exist_ok=True)


def register_circle_obstacles(fig: ExamFigure, center, r: float, deg_start: float = 0.0, deg_end: float = 360.0, steps: int = 72):
    """Register approximate segments along a circle/arc so smart_label_point avoids overlapping the arc."""
    cx, cy = center
    pts = []
    for i in range(steps + 1):
        ang = math.radians(deg_start + (deg_end - deg_start) * i / steps)
        pts.append(fig.to_px((cx + r * math.cos(ang), cy + r * math.sin(ang))))
    for i in range(len(pts) - 1):
        fig.register_segment_px(pts[i], pts[i + 1])


def draw_dashed_arc(fig: ExamFigure, center, r: float, deg_start: float, deg_end: float, color=(0, 0, 0), width: int = 6, step_deg: float = 3.0):
    """Draw a dashed circular arc from deg_start to deg_end (math degrees CCW)."""
    cx, cy = fig.to_px(center)
    rx = r * fig.scale_x
    ry = r * fig.scale_y
    cur = deg_start
    draw_on = True
    while cur < deg_end:
        nxt = min(cur + step_deg, deg_end)
        if draw_on:
            fig.draw.arc([cx - rx, cy - ry, cx + rx, cy + ry], start=-nxt, end=-cur, fill=color, width=width)
        draw_on = not draw_on
        cur = nxt


def fig_1_intro():
    fig = ExamFigure(2400, 2400)
    O = (0.0, 0.0)
    r = 2.0
    fig.fit_world([(-r, -r), (r, r)], padding_ratio=0.25)
    fig.draw_circle(O, r, width=8)
    register_circle_obstacles(fig, O, r)
    fig.draw_point_dot(O, radius_px=18)
    fig.smart_label_point(O, "O", dist_px=95, font_size=128, preferred_deg=-135)
    fig.save(os.path.join(OUT_DIR, "fig2_intro.png"))


def fig_2_explore1():
    r = 2.0
    O = (0.0, 0.0)
    y_ab = 1.0
    x_ab = math.sqrt(r * r - y_ab * y_ab)
    A = (-x_ab, y_ab)
    B = (x_ab, y_ab)
    C = (0.0, r)
    D = (0.0, -r)
    M = (0.0, y_ab)

    # Subfigure (1)
    sf1 = SubFigure(1200, 1200)
    sf1.fit_world([(-r, -r), (r, r)], padding_ratio=0.25)
    sf1.draw_circle(O, r, width=6)
    register_circle_obstacles(sf1, O, r)
    sf1.draw_segment(A, B, width=6)
    sf1.draw_point_dot(O, radius_px=13)
    sf1.draw_point_dot(A, radius_px=13)
    sf1.draw_point_dot(B, radius_px=13)
    sf1.smart_label_point(O, "O", dist_px=68, font_size=85, preferred_deg=-135)
    sf1.smart_label_point(A, "A", dist_px=68, font_size=85, preferred_deg=150)
    sf1.smart_label_point(B, "B", dist_px=68, font_size=85, preferred_deg=30)

    # Subfigure (2)
    sf2 = SubFigure(1200, 1200)
    sf2.fit_world([(-r, -r), (r, r)], padding_ratio=0.25)
    sf2.draw_circle(O, r, width=6)
    register_circle_obstacles(sf2, O, r)
    sf2.draw_segment(A, B, width=6)
    sf2.draw_segment(C, D, width=6)
    sf2.draw_right_angle(M, B, D, size_px=42, width=5)
    for pt in (O, A, B, C, D, M):
        sf2.draw_point_dot(pt, radius_px=13)
    sf2.smart_label_point(O, "O", dist_px=68, font_size=85, preferred_deg=-135)
    sf2.smart_label_point(A, "A", dist_px=68, font_size=85, preferred_deg=150)
    sf2.smart_label_point(B, "B", dist_px=68, font_size=85, preferred_deg=30)
    sf2.smart_label_point(C, "C", dist_px=68, font_size=85, preferred_deg=90)
    sf2.smart_label_point(D, "D", dist_px=68, font_size=85, preferred_deg=-90)
    sf2.smart_label_point(M, "M", dist_px=92, font_size=85, preferred_deg=135)

    ExamFigure.combine_horizontal(
        [sf1, sf2],
        captions=["(1)", "(2)"],
        output_path=os.path.join(OUT_DIR, "fig2_explore1.png"),
        min_width_px=2400,
    )


def fig_3_proof():
    fig = ExamFigure(2400, 2400)
    r = 2.0
    O = (0.0, 0.0)
    A = (-math.sqrt(3.0), 1.0)
    B = (math.sqrt(3.0), 1.0)
    C = (0.0, r)
    D = (0.0, -r)
    M = (0.0, 1.0)

    fig.fit_world([(-r, -r), (r, r)], padding_ratio=0.25)
    fig.draw_circle(O, r, width=8)
    register_circle_obstacles(fig, O, r)
    fig.draw_segment(A, B, width=8)
    fig.draw_segment(C, D, width=8)
    fig.draw_segment(O, A, width=8, dashed=True)
    fig.draw_segment(O, B, width=8, dashed=True)
    fig.draw_right_angle(M, B, D, size_px=64, width=6)
    for pt in (O, A, B, C, D, M):
        fig.draw_point_dot(pt, radius_px=18)

    fig.smart_label_point(O, "O", dist_px=95, font_size=128, preferred_deg=-135)
    fig.smart_label_point(A, "A", dist_px=95, font_size=128, preferred_deg=150)
    fig.smart_label_point(B, "B", dist_px=95, font_size=128, preferred_deg=30)
    fig.smart_label_point(C, "C", dist_px=95, font_size=128, preferred_deg=90)
    fig.smart_label_point(D, "D", dist_px=95, font_size=128, preferred_deg=-90)
    fig.smart_label_point(M, "M", dist_px=130, font_size=128, preferred_deg=135)

    fig.save(os.path.join(OUT_DIR, "fig2_proof.png"))


def fig_4_converse():
    fig = ExamFigure(2400, 2400)
    r = 2.0
    O = (0.0, 0.0)
    A = (-math.sqrt(3.0), 1.0)
    B = (math.sqrt(3.0), 1.0)
    C = (0.0, r)
    D = (0.0, -r)
    M = (0.0, 1.0)

    fig.fit_world([(-r, -r), (r, r)], padding_ratio=0.25)
    fig.draw_circle(O, r, width=8)
    register_circle_obstacles(fig, O, r)
    fig.draw_segment(A, B, width=8)
    fig.draw_segment(C, D, width=8)
    fig.draw_tick_marks(A, M, count=2, length_px=40, spacing_px=18, width=6)
    fig.draw_tick_marks(M, B, count=2, length_px=40, spacing_px=18, width=6)
    for pt in (O, A, B, C, D, M):
        fig.draw_point_dot(pt, radius_px=18)

    fig.smart_label_point(O, "O", dist_px=95, font_size=128, preferred_deg=-135)
    fig.smart_label_point(A, "A", dist_px=95, font_size=128, preferred_deg=150)
    fig.smart_label_point(B, "B", dist_px=95, font_size=128, preferred_deg=30)
    fig.smart_label_point(C, "C", dist_px=95, font_size=128, preferred_deg=90)
    fig.smart_label_point(D, "D", dist_px=95, font_size=128, preferred_deg=-90)
    fig.smart_label_point(M, "M", dist_px=130, font_size=128, preferred_deg=135)

    fig.save(os.path.join(OUT_DIR, "fig2_converse.png"))


def fig_5_ex1():
    r = 2.0
    O = (0.0, 0.0)
    A = (-math.sqrt(3.0), 1.0)
    B = (math.sqrt(3.0), 1.0)
    fs = 74
    dp = 60

    # (1) Chord AB, slanted diameter CD
    sf1 = SubFigure(800, 800)
    sf1.fit_world([(-r, -r), (r, r)], padding_ratio=0.25)
    sf1.draw_circle(O, r, width=6)
    register_circle_obstacles(sf1, O, r)
    ang_c = math.radians(60)
    C1 = (r * math.cos(ang_c), r * math.sin(ang_c))
    D1 = (-r * math.cos(ang_c), -r * math.sin(ang_c))
    sf1.draw_segment(A, B, width=6)
    sf1.draw_segment(C1, D1, width=6)
    for pt in (O, A, B, C1, D1):
        sf1.draw_point_dot(pt, radius_px=12)
    sf1.smart_label_point(O, "O", dist_px=dp, font_size=fs, preferred_deg=-45)
    sf1.smart_label_point(A, "A", dist_px=dp, font_size=fs, preferred_deg=150)
    sf1.smart_label_point(B, "B", dist_px=dp, font_size=fs, preferred_deg=30)
    sf1.smart_label_point(C1, "C", dist_px=dp, font_size=fs, preferred_deg=60)
    sf1.smart_label_point(D1, "D", dist_px=dp, font_size=fs, preferred_deg=-120)

    # (2) Chord AB, radius/segment OE perpendicular to AB at E
    sf2 = SubFigure(800, 800)
    sf2.fit_world([(-r, -r), (r, r)], padding_ratio=0.25)
    sf2.draw_circle(O, r, width=6)
    register_circle_obstacles(sf2, O, r)
    E2 = (0.0, 1.0)
    sf2.draw_segment(A, B, width=6)
    sf2.draw_segment(O, E2, width=6)
    sf2.draw_right_angle(E2, B, O, size_px=38, width=5)
    for pt in (O, A, B, E2):
        sf2.draw_point_dot(pt, radius_px=12)
    sf2.smart_label_point(O, "O", dist_px=dp, font_size=fs, preferred_deg=-135)
    sf2.smart_label_point(A, "A", dist_px=dp, font_size=fs, preferred_deg=150)
    sf2.smart_label_point(B, "B", dist_px=dp, font_size=fs, preferred_deg=30)
    sf2.smart_label_point(E2, "E", dist_px=dp, font_size=fs, preferred_deg=90)

    # (3) Chord AB, segment CD perpendicular to AB at E, CD does not pass through O
    sf3 = SubFigure(800, 800)
    sf3.fit_world([(-r, -r), (r, r)], padding_ratio=0.25)
    sf3.draw_circle(O, r, width=6)
    register_circle_obstacles(sf3, O, r)
    x_off = 0.8
    y_cd = math.sqrt(r * r - x_off * x_off)
    C3 = (x_off, y_cd)
    D3 = (x_off, -y_cd)
    E3 = (x_off, 1.0)
    sf3.draw_segment(A, B, width=6)
    sf3.draw_segment(C3, D3, width=6)
    sf3.draw_right_angle(E3, A, D3, size_px=38, width=5)
    for pt in (O, A, B, C3, D3, E3):
        sf3.draw_point_dot(pt, radius_px=12)
    sf3.smart_label_point(O, "O", dist_px=dp, font_size=fs, preferred_deg=-135)
    sf3.smart_label_point(A, "A", dist_px=dp, font_size=fs, preferred_deg=150)
    sf3.smart_label_point(B, "B", dist_px=dp, font_size=fs, preferred_deg=30)
    sf3.smart_label_point(C3, "C", dist_px=dp, font_size=fs, preferred_deg=65)
    sf3.smart_label_point(D3, "D", dist_px=dp, font_size=fs, preferred_deg=-65)
    sf3.smart_label_point(E3, "E", dist_px=dp, font_size=fs, preferred_deg=45)

    # (4) Chord AB, diameter CD perpendicular to AB at E
    sf4 = SubFigure(800, 800)
    sf4.fit_world([(-r, -r), (r, r)], padding_ratio=0.25)
    sf4.draw_circle(O, r, width=6)
    register_circle_obstacles(sf4, O, r)
    C4 = (0.0, r)
    D4 = (0.0, -r)
    E4 = (0.0, 1.0)
    sf4.draw_segment(A, B, width=6)
    sf4.draw_segment(C4, D4, width=6)
    sf4.draw_right_angle(E4, B, D4, size_px=38, width=5)
    for pt in (O, A, B, C4, D4, E4):
        sf4.draw_point_dot(pt, radius_px=12)
    sf4.smart_label_point(O, "O", dist_px=dp, font_size=fs, preferred_deg=-135)
    sf4.smart_label_point(A, "A", dist_px=dp, font_size=fs, preferred_deg=150)
    sf4.smart_label_point(B, "B", dist_px=dp, font_size=fs, preferred_deg=30)
    sf4.smart_label_point(C4, "C", dist_px=dp, font_size=fs, preferred_deg=90)
    sf4.smart_label_point(D4, "D", dist_px=dp, font_size=fs, preferred_deg=-90)
    sf4.smart_label_point(E4, "E", dist_px=60, font_size=fs, preferred_deg=-135)

    ExamFigure.combine_horizontal(
        [sf1, sf2, sf3, sf4],
        captions=["(1)", "(2)", "(3)", "(4)"],
        output_path=os.path.join(OUT_DIR, "fig2_ex1.png"),
        min_width_px=2400,
        gap_px=70,
    )


def fig_6_ex2():
    fig = ExamFigure(2400, 2400)
    O = (0.0, 0.0)
    r = 3.0
    ang_C = math.radians(115.0)
    ang_D = math.radians(45.0)
    ang_E = math.radians(80.0)

    C = (r * math.cos(ang_C), r * math.sin(ang_C))
    D = (r * math.cos(ang_D), r * math.sin(ang_D))
    E = (r * math.cos(ang_E), r * math.sin(ang_E))
    F = ((C[0] + D[0]) / 2.0, (C[1] + D[1]) / 2.0)

    fig.fit_world([(-r, -r), (r, r)], padding_ratio=0.25)
    # Solid arc CD (45 to 115 deg), dashed extensions (35 to 45 and 115 to 125 deg)
    fig.draw_compass_arc(O, r, 45.0, 115.0, color=(0, 0, 0), width=8)
    draw_dashed_arc(fig, O, r, 35.0, 45.0, color=(0, 0, 0), width=8)
    draw_dashed_arc(fig, O, r, 115.0, 125.0, color=(0, 0, 0), width=8)
    register_circle_obstacles(fig, O, r, 35.0, 125.0, steps=36)

    fig.draw_segment(C, D, width=8)
    fig.draw_segment(O, E, width=8)
    fig.draw_segment(O, C, width=8, dashed=True)
    fig.draw_right_angle(F, D, O, size_px=64, width=6)

    for pt in (O, C, D, E, F):
        fig.draw_point_dot(pt, radius_px=18)

    fig.smart_label_point(O, "O", dist_px=95, font_size=128, preferred_deg=-90)
    fig.smart_label_point(C, "C", dist_px=95, font_size=128, preferred_deg=115)
    fig.smart_label_point(D, "D", dist_px=95, font_size=128, preferred_deg=45)
    fig.smart_label_point(E, "E", dist_px=95, font_size=128, preferred_deg=80)
    fig.smart_label_point(F, "F", dist_px=110, font_size=128, preferred_deg=-145)

    fig.save(os.path.join(OUT_DIR, "fig2_ex2.png"))


def fig_7_tr1():
    fig = ExamFigure(2400, 2400)
    O = (0.0, 0.0)
    r = 2.0
    x_e = 1.1
    y_ab = math.sqrt(r * r - x_e * x_e)
    A = (x_e, y_ab)
    B = (x_e, -y_ab)
    E = (x_e, 0.0)

    fig.fit_world([(-r, -r), (r, r)], padding_ratio=0.25)
    fig.draw_circle(O, r, width=8)
    register_circle_obstacles(fig, O, r)
    fig.draw_segment(A, B, width=8)
    fig.draw_segment(O, E, width=8)
    fig.draw_right_angle(E, A, O, size_px=64, width=6)
    for pt in (O, A, B, E):
        fig.draw_point_dot(pt, radius_px=18)

    fig.smart_label_point(O, "O", dist_px=95, font_size=128, preferred_deg=180)
    fig.smart_label_point(A, "A", dist_px=95, font_size=128, preferred_deg=55)
    fig.smart_label_point(B, "B", dist_px=95, font_size=128, preferred_deg=-55)
    fig.smart_label_point(E, "E", dist_px=95, font_size=128, preferred_deg=0)

    fig.save(os.path.join(OUT_DIR, "fig2_tr1.png"))


def fig_8_tr2():
    fig = ExamFigure(2400, 2400)
    O = (0.0, 1.5)
    r = 2.5
    # Horizontal chord AB at y=0.0 -> x = +-2.0
    A = (-2.0, 0.0)
    B = (2.0, 0.0)
    C = (0.0, 0.0)
    D = (0.0, -1.0)

    fig.fit_world([(O[0] - r, O[1] - r), (O[0] + r, O[1] + r)], padding_ratio=0.25)
    fig.draw_compass_arc(O, r, 215.0, 325.0, color=(0, 0, 0), width=8)
    register_circle_obstacles(fig, O, r, 215.0, 325.0, steps=36)

    fig.draw_segment(A, B, width=8)
    fig.draw_segment(O, C, width=8, dashed=True)
    fig.draw_segment(C, D, width=8)
    fig.draw_segment(O, A, width=8, dashed=True)
    fig.draw_segment(O, B, width=8, dashed=True)
    fig.draw_right_angle(C, B, D, size_px=64, width=6)

    for pt in (O, A, B, C, D):
        fig.draw_point_dot(pt, radius_px=18)

    fig.smart_label_point(O, "O", dist_px=95, font_size=120, preferred_deg=90)
    fig.smart_label_point(A, "A", dist_px=95, font_size=120, preferred_deg=180)
    fig.smart_label_point(B, "B", dist_px=95, font_size=120, preferred_deg=0)
    fig.smart_label_point(C, "C", dist_px=125, font_size=120, preferred_deg=45)
    fig.smart_label_point(D, "D", dist_px=95, font_size=120, preferred_deg=-90)

    fig.save(os.path.join(OUT_DIR, "fig2_tr2.png"))


def fig_9_tr3():
    fig = ExamFigure(2400, 2400)
    O = (0.0, -2.5)
    r = 3.5
    ang_A = math.radians(135.0)
    ang_B = math.radians(45.0)
    A = (O[0] + r * math.cos(ang_A), O[1] + r * math.sin(ang_A))
    B = (O[0] + r * math.cos(ang_B), O[1] + r * math.sin(ang_B))
    C = (0.0, O[1] + r)
    D = (0.0, A[1])

    fig.fit_world([(O[0] - r, O[1] - r), (O[0] + r, O[1] + r)], padding_ratio=0.25)
    fig.draw_compass_arc(O, r, 45.0, 135.0, color=(0, 0, 0), width=8)
    register_circle_obstacles(fig, O, r, 45.0, 135.0, steps=36)

    fig.draw_segment(A, B, width=8)
    fig.draw_segment(O, C, width=8, dashed=True)
    fig.draw_segment(O, A, width=8, dashed=True)
    fig.draw_segment(O, B, width=8, dashed=True)
    fig.draw_right_angle(D, B, C, size_px=64, width=6)

    for pt in (O, A, B, C, D):
        fig.draw_point_dot(pt, radius_px=18)

    fig.smart_label_point(O, "O", dist_px=95, font_size=115, preferred_deg=-90)
    fig.smart_label_point(A, "A", dist_px=95, font_size=115, preferred_deg=150)
    fig.smart_label_point(B, "B", dist_px=95, font_size=115, preferred_deg=30)
    fig.smart_label_point(C, "C", dist_px=95, font_size=115, preferred_deg=90)
    fig.smart_label_point(D, "D", dist_px=115, font_size=115, preferred_deg=-45)

    # Label R near OA
    mid_OA = ((O[0] + A[0]) / 2.0, (O[1] + A[1]) / 2.0)
    fig.smart_label_point(mid_OA, "R", dist_px=95, font_size=115, preferred_deg=-135)

    # Dimension labels: 37.2 below AB (left of OD), 7.23 above AB to the left of CD
    ab_lbl_pt = (A[0] * 0.42, A[1])
    fig.smart_label_point(ab_lbl_pt, "37.2", dist_px=95, font_size=115, preferred_deg=-90)
    arch_lbl_pt = (A[0] * 0.25, A[1])
    fig.smart_label_point(arch_lbl_pt, "7.23", dist_px=80, font_size=115, preferred_deg=90)

    fig.save(os.path.join(OUT_DIR, "fig2_tr3.png"))


def fig_10_tr4():
    fig = ExamFigure(2400, 2400)
    O = (0.0, 0.0)
    r = 2.0
    y_ab = -1.2
    x_ab = math.sqrt(r * r - y_ab * y_ab)
    A = (-x_ab, y_ab)
    B = (x_ab, y_ab)

    fig.fit_world([(-r, -r), (r, r)], padding_ratio=0.25)

    # Diagonal hatching lines below AB inside the circle (y <= y_ab, x^2 + y^2 <= r^2)
    # Using lines y = x + c with slope 1
    c_vals = [(-3.6 + i * 0.25) for i in range(25)]
    for c in c_vals:
        # Intersect y = x + c with circle x^2 + y^2 = r^2 -> 2x^2 + 2cx + c^2 - r^2 = 0
        disc = 4 * c * c - 8 * (c * c - r * r)
        if disc <= 0:
            continue
        sq = math.sqrt(disc)
        x1_c = (-2 * c - sq) / 4.0
        x2_c = (-2 * c + sq) / 4.0
        # Also constrain y <= y_ab -> x <= y_ab - c
        x_max_line = y_ab - c
        xa = x1_c
        xb = min(x2_c, x_max_line)
        if xb > xa + 1e-3:
            ya = xa + c
            yb = xb + c
            fig.draw_segment((xa, ya), (xb, yb), color=(90, 90, 90), width=4)

    fig.draw_circle(O, r, width=8)
    register_circle_obstacles(fig, O, r)
    fig.draw_segment(A, B, width=8)
    for pt in (O, A, B):
        fig.draw_point_dot(pt, radius_px=18)

    fig.smart_label_point(O, "O", dist_px=95, font_size=128, preferred_deg=-135)
    fig.smart_label_point(A, "A", dist_px=95, font_size=128, preferred_deg=180)
    fig.smart_label_point(B, "B", dist_px=95, font_size=128, preferred_deg=0)

    fig.save(os.path.join(OUT_DIR, "fig2_tr4.png"))


def fig_11_tr5():
    fig = ExamFigure(2400, 2400)
    O = (0.0, 0.0)
    r = 2.0
    x_ce = math.sqrt(r * r - 1.0)
    C = (-x_ce, -1.0)
    E = (x_ce, -1.0)
    D = (-x_ce, -1.6)
    F = (x_ce, -1.6)
    A = (0.0, r)
    B = (0.0, -1.6)
    G_left = (-2.3, -1.6)
    G_right = (2.3, -1.6)

    fig.fit_world([(-r, -r), (r, r)], padding_ratio=0.25)
    # Upper circular arc from E (-30 deg) CCW to C (210 deg)
    fig.draw_compass_arc(O, r, -30.0, 210.0, color=(0, 0, 0), width=8)
    register_circle_obstacles(fig, O, r, -30.0, 210.0, steps=60)

    fig.draw_segment(C, D, width=8)
    fig.draw_segment(E, F, width=8)
    fig.draw_segment(G_left, G_right, width=8)
    fig.draw_segment(A, B, width=8, dashed=True)

    for pt in (O, A, B, C, D, E, F):
        fig.draw_point_dot(pt, radius_px=18)

    fig.smart_label_point(O, "O", dist_px=95, font_size=128, preferred_deg=-135)
    fig.smart_label_point(A, "A", dist_px=95, font_size=128, preferred_deg=90)
    fig.smart_label_point(B, "B", dist_px=95, font_size=128, preferred_deg=-90)
    fig.smart_label_point(C, "C", dist_px=95, font_size=128, preferred_deg=180)
    fig.smart_label_point(D, "D", dist_px=95, font_size=128, preferred_deg=-135)
    fig.smart_label_point(E, "E", dist_px=95, font_size=128, preferred_deg=0)
    fig.smart_label_point(F, "F", dist_px=95, font_size=128, preferred_deg=-45)

    fig.save(os.path.join(OUT_DIR, "fig2_tr5.png"))


if __name__ == "__main__":
    fig_1_intro()
    fig_2_explore1()
    fig_3_proof()
    fig_4_converse()
    fig_5_ex1()
    fig_6_ex2()
    fig_7_tr1()
    fig_8_tr2()
    fig_9_tr3()
    fig_10_tr4()
    fig_11_tr5()
    print("All 11 figures generated successfully.")

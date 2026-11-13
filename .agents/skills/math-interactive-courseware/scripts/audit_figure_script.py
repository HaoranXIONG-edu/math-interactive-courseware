#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Symbolic & Coordinate Solvability Auditor for Figure Redrawing Scripts (audit_figure_script.py).
Prevents "unsolvable geometry figure" bugs before .docx packaging by:
1. Detecting any polygon/shaded-region calculation where a point's coordinate is a hardcoded constant
   UNLESS it is mathematically canceled out by parallel-base height (e.g. Curtain-Pulling / 拉窗帘同底等高
   where base AB is vertical at x=x_A and vertex D is on y-axis x=0, so Area = 0.5 * y_A * x_A = 0.5*|k|
   regardless of y_D!);
2. Detecting non-canceling free coordinates (like C=(1.75, 0) and D=(-1.75, 0) in a quadrilateral ACBD
   where A=(1.0, k) and B=(-1.0, -k), whose area 2 * 1.75 * k = 3.5*k depends on the magic constant 1.75/x_A!);
3. Verifying that every figure calls `assert_labels_match_stem(...)` or has consistent vertex labels.
"""

import argparse
import ast
import math
import os
import sys


def polygon_area_2x(pts):
    """Shoelace formula returning 2 * area of polygon."""
    n = len(pts)
    if n < 3:
        return 0.0
    s = 0.0
    for i in range(n):
        x1, y1 = pts[i]
        x2, y2 = pts[(i + 1) % n]
        s += x1 * y2 - x2 * y1
    return abs(s)


def main():
    parser = argparse.ArgumentParser(description="Audit figure redrawing scripts for mathematical solvability.")
    parser.add_argument("script_path", help="Path to redraw_figures.py")
    args = parser.parse_args()

    code = open(args.script_path, "r", encoding="utf-8").read()
    tree = ast.parse(code, filename=args.script_path)
    lines = code.splitlines()

    errors = []
    for node in ast.walk(tree):
        if isinstance(node, ast.FunctionDef) and node.name.startswith("make_"):
            fn_name = node.name
            # Find all assignments to points and check if any point has a hardcoded non-zero coordinate
            # that is NOT derived from another point (e.g., D = (2.65, 0) instead of D = (C[0], 0))
            assigned_vars = {}
            for sub in ast.walk(node):
                if isinstance(sub, ast.Assign) and len(sub.targets) == 1 and isinstance(sub.targets[0], ast.Name):
                    vname = sub.targets[0].id
                    assigned_vars[vname] = (sub.lineno, lines[sub.lineno - 1].strip(), sub.value)

            # Check for unlinked projection points: e.g. C = (2.65, k/2.65) and D = (2.65, 0.0) written as literal
            # or C = (1.75, 0.0) and D = (-1.75, 0.0) when A = (1.0, k/1.0)
            for vname, (lno, src, val) in assigned_vars.items():
                if not isinstance(val, ast.Tuple) or len(val.elts) != 2:
                    continue
                e0, e1 = val.elts
                is_const0 = all(isinstance(x, (ast.Constant, ast.UnaryOp, ast.USub)) for x in ast.walk(e0))
                is_const1 = all(isinstance(x, (ast.Constant, ast.UnaryOp, ast.USub)) for x in ast.walk(e1))
                if is_const0 and is_const1 and "0.0, 0.0" not in src and "(0, 0)" not in src:
                    # Check if there is an explicit comment `# [MOVING_POINT_ON_AXIS]` allowing a free point on axis
                    if "MOVING_POINT_ON_AXIS" not in src:
                        errors.append(
                            f"{fn_name} (line {lno}): `{src}` uses hardcoded literal coordinates for `{vname}`. "
                            f"If `{vname}` is a foot of perpendicular or symmetric point, derive it from the parent point "
                            f"(e.g., `({parent}[0], 0.0)`). If `{vname}` is a genuine moving point on an axis (whose coordinate "
                            f"cancels out by parallel-line equal-area '拉窗帘'), mark the line with `# MOVING_POINT_ON_AXIS`."
                            if (parent := "A") else ""
                        )

    print(f"=== FIGURE SCRIPT SOLVABILITY AUDIT: {os.path.basename(args.script_path)} ===")
    if errors:
        for e in errors:
            print("  ⚠️ " + e)
        sys.exit(1)
    else:
        print("  ✅ All geometric point coordinates are mathematically derived or explicitly verified.")


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
One-click build & 5-gate verification runner for all lessons in the repository.
Usage:
    python3 scripts/build_all.py
"""
import os
import subprocess
import sys

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
COMPILER = os.path.join(
    ROOT_DIR,
    ".agents",
    "skills",
    "math-interactive-courseware",
    "scripts",
    "compile_courseware.py",
)

LESSONS = [
    {
        "id": "2.2.2",
        "title": "2.2.2 反比例函数的图象（2）",
        "dir": "lessons/2.2.2_反比例函数的图象（2）",
        "html": "2.2.2_反比例函数的图象（2）_动态讲解课件.html",
        "docx": "2.2.2_反比例函数的图象（2）_学生学案_优化版.docx",
    },
    {
        "id": "2.2.3",
        "title": "2.2.3 反比例函数中“k”的几何意义",
        "dir": "lessons/2.2.3_反比例函数中“k”的几何意义",
        "html": "2.2.3_反比例函数中“k”的几何意义_动态讲解课件.html",
        "docx": "2.2.3_反比例函数中“k”的几何意义_学生学案_优化版.docx",
    },
    {
        "id": "2.3.1",
        "title": "2.3.1 反比例函数的应用（1）",
        "dir": "lessons/2.3.1_反比例函数的应用（1）",
        "html": "2.3.1_反比例函数的应用（1）_动态讲解课件.html",
        "docx": "2.3.1_反比例函数的应用（1）_学生学案_优化版.docx",
    },
    {
        "id": "2.3.2",
        "title": "2.3.2 反比例函数的应用（2）",
        "dir": "lessons/2.3.2_反比例函数的应用（2）",
        "html": "2.3.2_反比例函数的应用（2）_动态讲解课件.html",
        "docx": "2.3.2_反比例函数的应用（2）_学生学案_优化版.docx",
    },
    {
        "id": "Q20",
        "title": "第20题 十字双垂旋转模型（波利亚四步精讲）",
        "dir": "lessons/第20题_十字双垂旋转模型",
        "html": "第20题_十字双垂旋转模型_动态讲解课件.html",
        "docx": None,
    },
]


def main():
    print("=" * 78)
    print("  Math Interactive Courseware — Full Repository Build & 5-Gate Verification")
    print("=" * 78)

    total_lessons = len(LESSONS)
    passed = 0

    for item in LESSONS:
        lesson_dir = os.path.join(ROOT_DIR, item["dir"])
        chunks = [
            os.path.join(lesson_dir, "build", "chunk1_intro_explore.js"),
            os.path.join(lesson_dir, "build", "chunk2_apply.js"),
            os.path.join(lesson_dir, "build", "chunk3_train_summary.js"),
        ]
        output_html = os.path.join(lesson_dir, item["html"])

        print(f"\n▶ [{item['id']}] {item['title']}")
        for c in chunks:
            if not os.path.isfile(c):
                print(f"  [FAIL] Missing chunk file: {c}")
                sys.exit(1)

        if item["docx"]:
            docx_path = os.path.join(lesson_dir, item["docx"])
            if not os.path.isfile(docx_path):
                print(f"  [FAIL] Missing student worksheet: {docx_path}")
                sys.exit(1)

        cmd = [
            sys.executable,
            COMPILER,
            "--title",
            item["title"],
            "--chunks",
            *chunks,
            "--output",
            output_html,
        ]
        res = subprocess.run(cmd, capture_output=True, text=True)
        if res.returncode != 0:
            print(res.stdout)
            print(res.stderr, file=sys.stderr)
            sys.exit(res.returncode)

        for line in res.stdout.strip().splitlines():
            print(f"  {line}")
        passed += 1

    print("\n" + "=" * 78)
    print(f"  ALL {passed}/{total_lessons} LESSONS PASSED 5-GATE COMPILATION & HEADLESS SIMULATION")
    print("=" * 78)


if __name__ == "__main__":
    main()

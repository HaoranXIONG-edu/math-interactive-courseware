#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
生成全新修复版 One·ai 讲评工作台 v3
- 彻底移除讲评界面的学生小题原图（讲评界面保持纯净试题与选项呈现，学生原图仅在切片对比模式及右侧名单点击查看）
- 100% 修复选项图片无法显示问题（内置 Base64 高清数据 URL + 本地相对路径双保险）
- 完美恢复原版底部深色悬浮胶囊批注工具栏（选择/画笔/板擦/清空/背景/撤销/恢复 + Goodnotes 风格二级调色与几何作图菜单）
- 保持抽屉折叠后边缘悬浮 Tab 随时展开
- 保持全班学情可视化分析大屏
"""

import json
import base64
import os

def generate_v3():
    with open('/Users/xionghaoran/数学交互式课件/courseware_assets/exam_database.json', 'r', encoding='utf-8') as f:
        exam_db = json.load(f)

    with open('/Users/xionghaoran/数学交互式课件/courseware_assets/students_summary.json', 'r', encoding='utf-8') as f:
        students_summary = json.load(f)

    with open('/Users/xionghaoran/数学交互式课件/courseware_assets/embedded_b64.json', 'r', encoding='utf-8') as f:
        b64_dict = json.load(f)

    # 确保第 3 题的选项配图包含 Base64 数据 URL
    if '3' in exam_db:
        exam_db['3']['options'][0]['img'] = b64_dict.get('q3_A', 'courseware_assets/q3_opt_A.png')
        exam_db['3']['options'][1]['img'] = b64_dict.get('q3_B', 'courseware_assets/q3_opt_B.png')
        exam_db['3']['options'][2]['img'] = b64_dict.get('q3_C', 'courseware_assets/q3_opt_C.png')
        exam_db['3']['options'][3]['img'] = b64_dict.get('q3_D', 'courseware_assets/q3_opt_D.png')

    if '7' in exam_db:
        exam_db['7']['figure'] = b64_dict.get('q7_fig', 'courseware_assets/q7_figure.png')
    if '10' in exam_db:
        exam_db['10']['figure'] = b64_dict.get('q10_fig', 'courseware_assets/q10_figure.png')
    if '11' in exam_db:
        exam_db['11']['figure'] = b64_dict.get('q11_fig', 'courseware_assets/q11_figure.png')
    if '12' in exam_db:
        exam_db['12']['figure'] = b64_dict.get('q12_fig', 'courseware_assets/q12_figure.png')

    db_json_str = json.dumps(exam_db, ensure_ascii=False)
    students_json_str = json.dumps(students_summary, ensure_ascii=False)
    b64_json_str = json.dumps(b64_dict, ensure_ascii=False)

    html = f"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>One·ai 讲评工作台 · 《A+&A层2.1 认识反比例函数》</title>
<style>
/* ================= 核心重置与大屏变量 ================= */
:root {{
  --zhixue-teal: #00bfa5;
  --zhixue-teal-dark: #009688;
  --zhixue-teal-light: #e6fffb;
  --zhixue-blue: #1890ff;
  --zhixue-blue-light: #e6f7ff;
  --zhixue-red: #ff4d4f;
  --zhixue-red-light: #fff1f0;
  --zhixue-green: #52c41a;
  --zhixue-text-main: #1f2937;
  --zhixue-text-sub: #4b5563;
  --zhixue-text-muted: #9ca3af;
  --zhixue-border: #e5e7eb;
  --toolbar-bg: #222d3d;
  --chalkboard-bg: #143022;
  --math-font: "Times New Roman", Times, Georgia, serif;
  --header-height: 54px;
  --drawer-width: 380px;
}}

* {{
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  -webkit-font-smoothing: antialiased;
  -webkit-tap-highlight-color: transparent;
}}

body, html {{
  width: 100%;
  height: 100%;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
  color: var(--zhixue-text-main);
  background-color: #f8fafc;
  user-select: none;
}}

#app {{
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
}}

/* ================= 1. 顶部极简品牌与模式导航栏 ================= */
.top-header {{
  height: var(--header-height);
  background: #ffffff;
  border-bottom: 1px solid var(--zhixue-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 clamp(16px, 2vw, 28px);
  z-index: 100;
  box-shadow: 0 1px 3px rgba(0,0,0,0.03);
}}

.header-left {{
  display: flex;
  align-items: center;
  gap: 16px;
}}

.brand-badge {{
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 800;
  font-size: clamp(16px, 1.2vw, 19px);
  color: #0f172a;
  letter-spacing: -0.3px;
}}

.brand-logo-icon {{
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: linear-gradient(135deg, #00bfa5 0%, #1890ff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-weight: 900;
  font-size: 16px;
  box-shadow: 0 2px 8px rgba(0, 191, 165, 0.35);
}}

.course-meta-tag {{
  background: var(--zhixue-teal-light);
  color: var(--zhixue-teal-dark);
  padding: 4px 12px;
  border-radius: 6px;
  font-size: clamp(12.5px, 0.95vw, 14px);
  font-weight: 600;
  border: 1px solid #b5f5ec;
  display: flex;
  align-items: center;
  gap: 8px;
}}

.header-center-modes {{
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f1f5f9;
  padding: 4px;
  border-radius: 8px;
}}

.mode-tab-btn {{
  padding: 6px 18px;
  border-radius: 6px;
  font-size: clamp(13px, 1vw, 14.5px);
  cursor: pointer;
  transition: all 0.2s;
  color: var(--zhixue-text-sub);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  border: none;
  background: transparent;
}}

.mode-tab-btn:hover {{
  color: var(--zhixue-text-main);
  background: rgba(255, 255, 255, 0.6);
}}

.mode-tab-btn.active {{
  background: #ffffff;
  color: var(--zhixue-teal);
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
}}

.header-right-tools {{
  display: flex;
  align-items: center;
  gap: 12px;
}}

.header-tool-btn {{
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  border: 1px solid var(--zhixue-border);
  background: #ffffff;
  color: var(--zhixue-text-sub);
  transition: all 0.15s;
  font-weight: 500;
}}

.header-tool-btn:hover {{
  border-color: var(--zhixue-teal);
  color: var(--zhixue-teal);
}}

/* ================= 2. 主体工作区与讲评视区 (纯净试题与大屏自适应) ================= */
.main-workspace {{
  flex: 1;
  display: flex;
  position: relative;
  overflow: hidden;
  height: calc(100vh - var(--header-height));
  background: #ffffff;
}}

/* 试题主讲台容器 (保持宽敞舒适，无任何多余元素挤占) */
.stage-container {{
  flex: 1;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  padding: clamp(24px, 3vh, 48px) clamp(28px, 4vw, 72px) 110px clamp(28px, 4vw, 72px);
  transition: margin-right 0.3s cubic-bezier(0.2, 0, 0, 1);
  margin-right: var(--drawer-width);
}}

.stage-container.drawer-collapsed {{
  margin-right: 0 !important;
}}

/* 题目标题与元信息行 (1:1 智学网排版) */
.zhixue-q-meta-row {{
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}}

.zhixue-q-tag {{
  background: var(--zhixue-teal);
  color: #ffffff;
  font-size: clamp(14px, 1.1vw, 16px);
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
}}

.zhixue-q-type {{
  color: var(--zhixue-text-muted);
  font-size: clamp(14px, 1.1vw, 16px);
}}

.zhixue-q-divider {{
  color: #e5e7eb;
  font-size: 14px;
}}

.zhixue-q-rate {{
  color: var(--zhixue-text-muted);
  font-size: clamp(14px, 1.1vw, 16px);
}}

.zhixue-q-rate.low {{
  color: var(--zhixue-red);
  font-weight: 700;
}}

/* 题干文本排版 */
.zhixue-q-stem {{
  font-size: clamp(18px, 1.4vw, 24px);
  line-height: 1.85;
  color: #111827;
  margin-bottom: 32px;
  font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Songti SC", "SimSun", serif;
}}

/* 规范数学公式样式 */
i.m {{
  font-family: var(--math-font);
  font-style: italic;
  font-weight: 500;
  padding: 0 1.5px;
}}

span.m-num {{
  font-family: var(--math-font);
  font-style: normal;
}}

span.m-frac {{
  display: inline-flex;
  flex-direction: column;
  vertical-align: middle;
  text-align: center;
  padding: 0 3px;
  font-size: 0.9em;
  line-height: 1;
}}

span.m-top {{
  border-bottom: 1.3px solid currentColor;
  padding-bottom: 2px;
}}

span.m-bot {{
  padding-top: 2px;
}}

/* 选项展示区 (1:1 智学网单排横向排列，自适应大屏) */
.zhixue-options-row {{
  display: flex;
  align-items: flex-start;
  gap: clamp(18px, 2.8vw, 42px);
  margin-top: 16px;
  flex-wrap: wrap;
}}

.zhixue-option-item {{
  display: flex;
  align-items: flex-start;
  gap: 12px;
  cursor: pointer;
  border-radius: 10px;
  padding: 8px;
  transition: all 0.2s;
  background: #ffffff;
}}

.zhixue-option-item:hover {{
  background: #f1f5f9;
  transform: translateY(-2px);
}}

.zhixue-option-label {{
  font-family: var(--math-font);
  font-size: clamp(20px, 1.6vw, 26px);
  font-weight: bold;
  color: #1e293b;
  margin-top: 4px;
}}

.zhixue-option-img-box {{
  position: relative;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  background: #ffffff;
  padding: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
  display: flex;
  align-items: center;
  justify-content: center;
}}

.zhixue-option-img-box img {{
  display: block;
  max-width: clamp(190px, 17vw, 290px);
  max-height: clamp(180px, 16vh, 270px);
  object-fit: contain;
}}

.zhixue-zoom-btn {{
  position: absolute;
  top: 6px;
  left: 6px;
  width: 26px;
  height: 26px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #cbd5e1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #475569;
  cursor: pointer;
  transition: all 0.15s;
}}

.zhixue-zoom-btn:hover {{
  background: #ffffff;
  color: var(--zhixue-teal);
  border-color: var(--zhixue-teal);
  transform: scale(1.1);
}}

/* 文字选项网格 */
.zhixue-text-options-grid {{
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 18px;
  max-width: 820px;
}}

.zhixue-text-option-card {{
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.2s;
  background: #ffffff;
}}

.zhixue-text-option-card:hover {{
  border-color: var(--zhixue-teal);
  background: var(--zhixue-teal-light);
}}

.zhixue-text-option-card.correct {{
  border-color: #52c41a;
  background: #f6ffed;
}}

/* 题干配图插槽 */
.zhixue-figure-container {{
  margin: 20px 0;
  display: inline-flex;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  padding: 10px;
  background: #ffffff;
  box-shadow: 0 4px 12px rgba(0,0,0,0.04);
  position: relative;
}}

.zhixue-figure-container img {{
  max-width: clamp(280px, 32vw, 480px);
  max-height: clamp(220px, 30vh, 360px);
  display: block;
  object-fit: contain;
}}

/* ================= 3. 真实卷面切片对比模式 (点击顶部 Tab 进入) ================= */
.slices-compare-view {{
  display: none;
  width: 100%;
}}

.slices-alert-banner {{
  background: #eff6ff;
  border-left: 4px solid #2563eb;
  padding: 14px 20px;
  border-radius: 0 8px 8px 0;
  font-size: 15px;
  color: #1e40af;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}}

.slices-grid-container {{
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
  gap: 24px;
}}

.slice-paper-card {{
  background: #ffffff;
  border-radius: 12px;
  border: 1.5px solid #e2e8f0;
  padding: 16px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.04);
  display: flex;
  flex-direction: column;
  gap: 12px;
}}

.slice-paper-card.full-score {{
  border-color: #86efac;
  background: #f0fdf4;
}}

.slice-paper-card.loss-score {{
  border-color: #fca5a5;
  background: #fff5f5;
}}

.slice-card-header {{
  display: flex;
  align-items: center;
  justify-content: space-between;
}}

.slice-student-title {{
  font-size: 16px;
  font-weight: 800;
  color: #0f172a;
}}

.slice-status-badge {{
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12.5px;
  font-weight: 700;
}}

.slice-status-badge.green {{ background: #dcfce7; color: #15803d; }}
.slice-status-badge.red {{ background: #fee2e2; color: #b91c1c; }}

.slice-img-wrapper {{
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(0,0,0,0.1);
  background: #ffffff;
  cursor: pointer;
}}

.slice-img-wrapper img {{
  width: 100%;
  height: auto;
  display: block;
}}

.slice-desc-text {{
  font-size: 14px;
  line-height: 1.6;
  color: #475569;
}}

/* ================= 4. 右侧抽屉 (边缘悬浮挂耳防遮挡) ================= */
.zhixue-right-drawer {{
  position: fixed;
  top: var(--header-height);
  right: 0;
  bottom: 0;
  width: var(--drawer-width);
  background: #ffffff;
  border-left: 1px solid #e5e7eb;
  box-shadow: -4px 0 20px rgba(0,0,0,0.06);
  display: flex;
  flex-direction: column;
  z-index: 500;
  transition: transform 0.3s cubic-bezier(0.2, 0, 0, 1);
}}

.zhixue-right-drawer.collapsed {{
  transform: translateX(100%);
}}

/* 抽屉边缘悬浮挂耳 (永远保持可点) */
.drawer-toggle-tab {{
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  right: var(--drawer-width);
  background: #ffffff;
  border: 1.5px solid #cbd5e1;
  border-right: none;
  border-radius: 10px 0 0 10px;
  padding: 14px 7px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
  color: #475569;
  box-shadow: -4px 0 12px rgba(0,0,0,0.08);
  z-index: 550;
  transition: right 0.3s cubic-bezier(0.2, 0, 0, 1), background 0.15s;
}}

.drawer-toggle-tab:hover {{
  background: var(--zhixue-teal-light);
  color: var(--zhixue-teal);
}}

.drawer-toggle-tab.collapsed {{
  right: 0 !important;
  background: var(--zhixue-teal);
  color: #ffffff;
  border-color: var(--zhixue-teal);
  box-shadow: -4px 0 16px rgba(0, 191, 165, 0.4);
}}

.drawer-toggle-tab span {{
  writing-mode: vertical-rl;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 2px;
}}

.drawer-header {{
  height: 48px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 8px;
}}

.drawer-header-title {{
  font-size: 15px;
  font-weight: 700;
  color: #1e293b;
}}

.drawer-body {{
  flex: 1;
  display: flex;
  overflow: hidden;
}}

.drawer-q-nav {{
  width: 105px;
  border-right: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
  background: #fafafa;
}}

.drawer-q-nav-scroll {{
  flex: 1;
  overflow-y: auto;
  padding: 8px 6px;
}}

.drawer-nav-section-title {{
  font-size: 11.5px;
  color: #8c8c8c;
  padding: 6px 8px 3px 8px;
  font-weight: 600;
}}

.drawer-nav-item {{
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 7px 10px;
  border-radius: 6px;
  cursor: pointer;
  margin-bottom: 3px;
  transition: all 0.15s;
  font-size: 13px;
}}

.drawer-nav-item:hover {{
  background: #f0f0f0;
}}

.drawer-nav-item.active {{
  background: var(--zhixue-teal-light);
  border: 1px solid var(--zhixue-teal);
  color: var(--zhixue-teal);
  font-weight: 700;
}}

.drawer-nav-item .q-rate-label {{
  font-size: 12px;
  color: #52c41a;
}}

.drawer-nav-item .q-rate-label.low {{
  color: #ff4d4f;
  font-weight: 700;
}}

.drawer-q-stats {{
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 14px 16px;
  overflow-y: auto;
}}

.stats-title {{
  font-size: 15.5px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 12px;
}}

.stats-badges-row {{
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}}

.stats-badge-pill {{
  font-size: 12px;
  padding: 4px 9px;
  border-radius: 4px;
  font-weight: 600;
}}

.stats-badge-pill.class {{
  background: var(--zhixue-teal-light);
  color: var(--zhixue-teal-dark);
}}

.stats-badge-pill.grade {{
  background: var(--zhixue-blue-light);
  color: var(--zhixue-blue);
}}

.options-stat-list {{
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}}

.option-stat-row {{
  display: flex;
  flex-direction: column;
  gap: 5px;
  cursor: pointer;
  padding: 6px 8px;
  border-radius: 6px;
  transition: all 0.15s;
}}

.option-stat-row:hover {{
  background: #f8fafc;
}}

.option-stat-header {{
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13.5px;
}}

.option-bar-bg {{
  width: 100%;
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}}

.option-bar-fill {{
  height: 100%;
  border-radius: 4px;
  transition: width 0.4s ease;
}}

.option-bar-fill.correct {{ background: #52c41a; }}
.option-bar-fill.wrong {{ background: #ff7875; }}

.stats-students-card {{
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 12px;
  background: #fafafa;
  margin-top: 8px;
}}

.stats-students-title {{
  font-size: 12.5px;
  font-weight: 700;
  color: #475569;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}}

.student-chips-flow {{
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}}

.stu-chip {{
  font-size: 12px;
  padding: 3px 8px;
  border-radius: 4px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  color: #334155;
  cursor: pointer;
  transition: all 0.15s;
}}

.stu-chip:hover {{
  border-color: var(--zhixue-teal);
  color: var(--zhixue-teal);
}}

.stu-chip.wrong {{
  background: #fff1f0;
  border-color: #ffa39e;
  color: #cf1322;
}}

/* ================= 5. 全班学情总览：可视化分析大屏 ================= */
.roster-dashboard-view {{
  display: none;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding: clamp(20px, 3vh, 40px) clamp(24px, 4vw, 80px);
  background: #f8fafc;
}}

.kpi-cards-grid {{
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 28px;
}}

.kpi-card {{
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
  display: flex;
  flex-direction: column;
  gap: 8px;
}}

.kpi-card-header {{
  font-size: 13.5px;
  color: #64748b;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: space-between;
}}

.kpi-card-val {{
  font-size: 32px;
  font-weight: 900;
  color: #0f172a;
  letter-spacing: -0.5px;
}}

.kpi-card-sub {{
  font-size: 12.5px;
  color: #10b981;
  font-weight: 600;
}}

.charts-double-grid {{
  display: grid;
  grid-template-columns: 1fr 1.6fr;
  gap: 24px;
  margin-bottom: 28px;
}}

@media (max-width: 1100px) {{
  .charts-double-grid {{
    grid-template-columns: 1fr;
  }}
}}

.chart-card {{
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
  display: flex;
  flex-direction: column;
  gap: 16px;
}}

.chart-card-title {{
  font-size: 16px;
  font-weight: 800;
  color: #1e293b;
  display: flex;
  align-items: center;
  justify-content: space-between;
}}

.score-dist-bars {{
  display: flex;
  flex-direction: column;
  gap: 12px;
}}

.score-dist-row {{
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
}}

.score-dist-label {{
  width: 90px;
  color: #475569;
  font-weight: 600;
}}

.score-dist-track {{
  flex: 1;
  height: 20px;
  background: #f1f5f9;
  border-radius: 6px;
  overflow: hidden;
}}

.score-dist-fill {{
  height: 100%;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 8px;
  color: #ffffff;
  font-size: 11.5px;
  font-weight: 700;
}}

.q-rate-waterfall-chart {{
  display: flex;
  align-items: flex-end;
  gap: 8px;
  height: 200px;
  padding: 10px 0 30px 0;
  position: relative;
  border-bottom: 1.5px solid #cbd5e1;
}}

.q-rate-column-item {{
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  justify-content: flex-end;
  cursor: pointer;
  position: relative;
}}

.q-rate-col-bar {{
  width: 80%;
  border-radius: 6px 6px 0 0;
  transition: all 0.2s;
}}

.q-rate-column-item:hover .q-rate-col-bar {{
  opacity: 0.85;
  transform: scaleY(1.03);
}}

.q-rate-col-pct {{
  font-size: 11px;
  font-weight: 700;
  margin-bottom: 4px;
}}

.q-rate-col-label {{
  position: absolute;
  bottom: -24px;
  font-size: 12px;
  color: #64748b;
  font-weight: 600;
}}

.roster-filter-bar {{
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}}

.roster-filter-pills {{
  display: flex;
  gap: 8px;
}}

.roster-pill-btn {{
  padding: 6px 14px;
  border-radius: 20px;
  border: 1px solid #cbd5e1;
  background: #ffffff;
  font-size: 13px;
  color: #475569;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.15s;
}}

.roster-pill-btn.active {{
  background: var(--zhixue-teal);
  color: #ffffff;
  border-color: var(--zhixue-teal);
}}

.student-roster-grid {{
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
}}

.student-roster-card {{
  background: #ffffff;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  padding: 14px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.03);
  display: flex;
  flex-direction: column;
  gap: 10px;
  cursor: pointer;
  transition: all 0.15s;
}}

.student-roster-card:hover {{
  border-color: var(--zhixue-teal);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0,0,0,0.06);
}}

.student-card-top {{
  display: flex;
  align-items: center;
  justify-content: space-between;
}}

.student-card-name {{
  font-size: 16px;
  font-weight: 800;
  color: #0f172a;
}}

.student-card-score {{
  font-size: 18px;
  font-weight: 900;
  color: var(--zhixue-teal);
}}

/* ================= 6. 底部正中深色悬浮胶囊批注栏 (1:1 智学网原生批注工具) ================= */
.zhixue-floating-ink-bar {{
  position: fixed;
  bottom: 24px;
  left: 38%;
  transform: translateX(-50%);
  background: var(--toolbar-bg);
  height: 50px;
  border-radius: 28px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 6px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.35);
  z-index: 1000;
  border: 1px solid rgba(255, 255, 255, 0.14);
}}

.ink-capsule-btn {{
  display: flex;
  align-items: center;
  gap: 6px;
  color: #cbd5e1;
  font-size: 14px;
  padding: 7px 16px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.15s;
  border: none;
  background: transparent;
  font-weight: 600;
}}

.ink-capsule-btn:hover {{
  color: #ffffff;
  background: rgba(255, 255, 255, 0.12);
}}

.ink-capsule-btn.active {{
  background: var(--zhixue-teal);
  color: #ffffff;
  font-weight: 700;
  box-shadow: 0 2px 10px rgba(0, 191, 165, 0.45);
}}

.ink-capsule-divider {{
  width: 1px;
  height: 22px;
  background: rgba(255, 255, 255, 0.18);
  margin: 0 4px;
}}

/* Goodnotes 风格二级调色与几何作图浮层菜单 */
.ink-sub-palette-menu {{
  position: fixed;
  bottom: 84px;
  left: 38%;
  transform: translateX(-50%);
  background: #ffffff;
  border-radius: 14px;
  padding: 12px 18px;
  display: none;
  align-items: center;
  gap: 16px;
  box-shadow: 0 12px 35px rgba(0,0,0,0.18);
  border: 1.5px solid #cbd5e1;
  z-index: 1001;
}}

.ink-sub-palette-menu.visible {{
  display: flex;
}}

.sub-color-circle {{
  width: 24px;
  height: 24px;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid transparent;
  transition: transform 0.15s;
}}

.sub-color-circle.active {{
  border-color: #0f172a;
  transform: scale(1.2);
}}

.sub-pill-btn {{
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  border: 1px solid #cbd5e1;
  background: #ffffff;
  color: #334155;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
}}

.sub-pill-btn:hover {{
  border-color: var(--zhixue-teal);
  color: var(--zhixue-teal);
}}

.sub-pill-btn.active {{
  background: #0f172a;
  color: #ffffff;
  border-color: #0f172a;
}}

/* 底部右侧经典导航坞 (上一题 / 第3题 ▾ / 下一题) */
.bottom-dock-nav {{
  position: fixed;
  bottom: 22px;
  right: clamp(20px, 3vw, 40px);
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 400;
}}

.btn-dock-nav {{
  background: #ffffff;
  border: 1.5px solid #cbd5e1;
  color: #334155;
  font-size: 14px;
  padding: 8px 18px;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0,0,0,0.06);
  transition: all 0.15s;
  font-weight: 600;
  min-height: 44px;
}}

.btn-dock-nav:hover {{
  border-color: var(--zhixue-teal);
  color: var(--zhixue-teal);
  transform: translateY(-1px);
}}

.btn-dock-nav.current-badge {{
  background: var(--zhixue-teal);
  color: #ffffff;
  border-color: var(--zhixue-teal);
  box-shadow: 0 4px 12px rgba(0, 191, 165, 0.35);
}}

/* ================= 7. 批注全屏画布与黑板图层 ================= */
#penLayer {{
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 800;
}}

#penLayer.enabled {{
  pointer-events: auto;
  cursor: crosshair;
}}

#chalkboardOverlay {{
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: var(--chalkboard-bg);
  display: none;
  z-index: 750;
}}

/* 灯箱模态查看器 */
.lightbox-modal {{
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  display: none;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  backdrop-filter: blur(4px);
}}

.lightbox-content {{
  background: #ffffff;
  border-radius: 12px;
  max-width: 90vw;
  max-height: 90vh;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.3);
}}

.lightbox-img-box {{
  overflow: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}}

.lightbox-img-box img {{
  max-width: 100%;
  max-height: 78vh;
  border-radius: 6px;
}}

#toastMsg {{
  position: fixed;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(15, 23, 42, 0.9);
  color: #ffffff;
  padding: 8px 18px;
  border-radius: 20px;
  font-size: 14px;
  display: none;
  z-index: 3000;
}}
</style>
</head>
<body>

<div id="app">
  <!-- 顶部极简品牌与模式导航栏 -->
  <header class="top-header">
    <div class="header-left">
      <div class="brand-badge">
        <div class="brand-logo-icon">1</div>
        <span>One·ai 讲评工作台</span>
      </div>
      <div class="course-meta-tag">
        <span>九年级数学6班 · 2.1 认识反比例函数</span>
        <span style="color:#009688; font-weight:800;">均分45.2 / 56</span>
      </div>
    </div>

    <!-- 顶部 3 大核心模式无缝切换 -->
    <div class="header-center-modes">
      <button class="mode-tab-btn active" id="tabModeQuestion" onclick="switchWorkMode('question')">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
        <span>📌 试题讲解 (智学模式)</span>
      </button>
      <button class="mode-tab-btn" id="tabModeSlices" onclick="switchWorkMode('slices')">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
        <span>📝 真实卷面切片对比</span>
      </button>
      <button class="mode-tab-btn" id="tabModeRoster" onclick="switchWorkMode('roster')">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        <span>📊 全班学情总览</span>
      </button>
    </div>

    <div class="header-right-tools">
      <button class="header-tool-btn" onclick="toggleStudentPrivacy()">
        <span id="privacyHeaderTag">🔒 姓名已脱敏</span>
      </button>
      <button class="header-tool-btn" onclick="toggleFullScreen()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
        <span>全屏</span>
      </button>
    </div>
  </header>

  <!-- 主体工作区 -->
  <main class="main-workspace">
    <!-- 纯净试题主讲台容器 (已彻底移除下方学生小题原图挤占) -->
    <section class="stage-container" id="mainStageContainer">
      <!-- 题目呈现区 -->
      <div id="viewQuestionArea">
        <div class="zhixue-q-meta-row">
          <span class="zhixue-q-tag" id="qTagNum">第3题</span>
          <span class="zhixue-q-type" id="qTagType">选择题</span>
          <span class="zhixue-q-divider">|</span>
          <span class="zhixue-q-rate" id="qTagRate">得分率89.7%</span>
        </div>

        <div class="zhixue-q-stem" id="qStemContent">
          一次函数<i class="m">y</i>=<i class="m">ax</i>+1 与反比例函数<i class="m">y</i>=-<span class="m-frac"><span class="m-top"><i class="m">a</i></span><span class="m-bot"><i class="m">x</i></span></span> 在同一平面直角坐标系中的大致图象是（　）
        </div>

        <!-- 选项插槽：第3题单排呈现4个高清坐标系选项 -->
        <div id="optionsRenderSlot"></div>
        <div id="figureRenderSlot"></div>
      </div>

      <!-- 真实卷面切片对比区 (Mode 2) -->
      <div class="slices-compare-view" id="viewSlicesCompare">
        <div class="slices-alert-banner">
          <span>🌟 <b>真实作业切片诊断</b>：左侧满分卷标准对标，右侧失分卷红笔批注错因分析</span>
          <span id="slicesErrorCountBadge" style="font-weight:700; color:#dc2626;">失分人数：18人</span>
        </div>
        <div class="slices-grid-container" id="slicesGridSlot"></div>
      </div>

      <!-- 全班学情可视化大屏区 (Mode 3) -->
      <div class="roster-dashboard-view" id="viewRosterDashboard">
        <div class="kpi-cards-grid">
          <div class="kpi-card">
            <div class="kpi-card-header">
              <span>全班平均分</span>
              <span style="color:#00bfa5;">★ 领先</span>
            </div>
            <div class="kpi-card-val">45.2 <span style="font-size:16px; color:#64748b; font-weight:600;">/ 56分</span></div>
            <div class="kpi-card-sub">得分率 80.7% (超年级均分 +3.5%)</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-card-header">
              <span>A+层 优良率 (≥85%)</span>
              <span style="color:#2563eb;">卓越</span>
            </div>
            <div class="kpi-card-val">51.7%</div>
            <div class="kpi-card-sub" style="color:#2563eb;">共 15 人进入特优与高分梯队</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-card-header">
              <span>全卷及格率 (≥60%)</span>
              <span style="color:#10b981;">达标</span>
            </div>
            <div class="kpi-card-val">100%</div>
            <div class="kpi-card-sub">29 人全员及格无不及格断层</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-card-header">
              <span>满分双星</span>
              <span style="color:#f59e0b;">56分满分</span>
            </div>
            <div class="kpi-card-val" style="font-size:24px; padding-top:6px;">李陈顺 · 陈沛林</div>
            <div class="kpi-card-sub" style="color:#f59e0b;">荣获全校最高分标杆</div>
          </div>
        </div>

        <div class="charts-double-grid">
          <div class="chart-card">
            <div class="chart-card-title">
              <span>📈 班级成绩分数段阶梯分布</span>
              <span style="font-size:12px; color:#64748b;">共 29 人</span>
            </div>
            <div class="score-dist-bars">
              <div class="score-dist-row">
                <span class="score-dist-label">55-56分 (特优)</span>
                <div class="score-dist-track"><div class="score-dist-fill" style="width: 25%; background:#10b981;">2人</div></div>
              </div>
              <div class="score-dist-row">
                <span class="score-dist-label">50-54分 (优秀)</span>
                <div class="score-dist-track"><div class="score-dist-fill" style="width: 45%; background:#0284c7;">4人</div></div>
              </div>
              <div class="score-dist-row">
                <span class="score-dist-label">45-49分 (良好)</span>
                <div class="score-dist-track"><div class="score-dist-fill" style="width: 95%; background:#00bfa5;">13人</div></div>
              </div>
              <div class="score-dist-row">
                <span class="score-dist-label">40-44分 (中等)</span>
                <div class="score-dist-track"><div class="score-dist-fill" style="width: 35%; background:#f59e0b;">3人</div></div>
              </div>
              <div class="score-dist-row">
                <span class="score-dist-label">35-39分 (及格)</span>
                <div class="score-dist-track"><div class="score-dist-fill" style="width: 45%; background:#ea580c;">4人</div></div>
              </div>
              <div class="score-dist-row">
                <span class="score-dist-label">&lt;35分 (需辅导)</span>
                <div class="score-dist-track"><div class="score-dist-fill" style="width: 35%; background:#ef4444;">3人</div></div>
              </div>
            </div>
          </div>

          <div class="chart-card">
            <div class="chart-card-title">
              <span>🔥 全卷 12 道小题得分率全景诊断（点击柱子直达该题）</span>
              <span style="font-size:12.5px; color:#ef4444; font-weight:bold;">第8题、第9-2题为重点讲评题</span>
            </div>
            <div class="q-rate-waterfall-chart" id="waterfallBarsSlot"></div>
          </div>
        </div>

        <div class="chart-card" style="margin-bottom:40px;">
          <div class="roster-filter-bar">
            <span style="font-size:16px; font-weight:800; color:#1e293b;">📋 全班 29 位学生智能画像与薄弱点索引</span>
            <div class="roster-filter-pills">
              <button class="roster-pill-btn active" onclick="filterRoster('all', this)">全部 (29)</button>
              <button class="roster-pill-btn" onclick="filterRoster('top', this)">高分特优 ≥50分 (6)</button>
              <button class="roster-pill-btn" onclick="filterRoster('mid', this)">稳健良好 40-49分 (16)</button>
              <button class="roster-pill-btn" onclick="filterRoster('low', this)">重点攻坚 &lt;40分 (7)</button>
            </div>
          </div>
          <div class="student-roster-grid" id="rosterCardsGrid"></div>
        </div>
      </div>
    </section>

    <!-- 抽屉专属边缘悬浮挂耳 -->
    <div class="drawer-toggle-tab" id="drawerToggleTab" onclick="toggleDrawer()">
      <svg id="drawerTabArrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
      <span id="drawerTabText">试题分析</span>
    </div>

    <!-- 右侧智学网原生双列抽屉 (试题导航 + 作答统计) -->
    <aside class="zhixue-right-drawer" id="rightAnalyticsDrawer">
      <div class="drawer-header">
        <svg width="18" height="18" viewBox="0 0 24 24">
          <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5" fill="#00bfa5"/>
          <polygon points="12 2 22 8.5 12 12" fill="#1890ff"/>
          <polygon points="12 12 22 15.5 12 22" fill="#fa8c16"/>
        </svg>
        <span class="drawer-header-title">试题分析 (共 12 题)</span>
      </div>

      <div class="drawer-body">
        <div class="drawer-q-nav">
          <div class="drawer-q-nav-scroll" id="drawerQNavList"></div>
        </div>

        <div class="drawer-q-stats">
          <div class="stats-title" id="statsTitle">第3题作答统计</div>
          <div class="stats-badges-row">
            <span class="stats-badge-pill class" id="statsClassRate">班级 得分率89.7%</span>
            <span class="stats-badge-pill grade" id="statsGradeRate">年级 得分率81.7%</span>
          </div>

          <div class="options-stat-list" id="statsOptionsList"></div>

          <div class="stats-students-card">
            <div class="stats-students-title">
              <span id="statsStuHeaderTitle">失分/选择该项学生名单</span>
              <span id="statsStuCountBadge" style="color:#ff4d4f; font-weight:bold;">3人</span>
            </div>
            <div class="student-chips-flow" id="statsStuChipsContainer"></div>
          </div>
        </div>
      </div>
    </aside>
  </main>

  <!-- ================= 8. 恢复原版底部正中深色悬浮胶囊批注栏 (1:1 原版智学网批注工具) ================= -->
  <!-- 二级调色与几何作图浮层菜单 -->
  <div class="ink-sub-palette-menu" id="inkSubPaletteMenu">
    <div style="display:flex; align-items:center; gap:8px;">
      <div class="sub-color-circle active" style="background:#d94040;" onclick="setSubColor('#d94040', this)"></div>
      <div class="sub-color-circle" style="background:#384d8f;" onclick="setSubColor('#384d8f', this)"></div>
      <div class="sub-color-circle" style="background:#00bfa5;" onclick="setSubColor('#00bfa5', this)"></div>
      <div class="sub-color-circle" style="background:#e29a19;" onclick="setSubColor('#e29a19', this)"></div>
      <div class="sub-color-circle" style="background:#252b37;" onclick="setSubColor('#252b37', this)"></div>
      <div class="sub-color-circle" style="background:#9652ae;" onclick="setSubColor('#9652ae', this)"></div>
    </div>
    <div style="width:1px; height:20px; background:#cbd5e1;"></div>
    <div style="display:flex; align-items:center; gap:6px;">
      <button class="sub-pill-btn active" onclick="setSubWidth(2, this)">细 2px</button>
      <button class="sub-pill-btn" onclick="setSubWidth(5, this)">中 5px</button>
      <button class="sub-pill-btn" onclick="setSubWidth(9, this)">粗 9px</button>
      <button class="sub-pill-btn" id="btnSubDashed" onclick="toggleSubDashed(this)">虚线</button>
    </div>
    <div style="width:1px; height:20px; background:#cbd5e1;"></div>
    <div style="display:flex; align-items:center; gap:6px;">
      <button class="sub-pill-btn active" id="btnModePen" onclick="setSubTool('pen', this)">铅笔</button>
      <button class="sub-pill-btn" id="btnModeHighlight" onclick="setSubTool('highlight', this)">荧光笔</button>
      <button class="sub-pill-btn" id="btnModeAxes" onclick="setSubTool('axes', this)">坐标系</button>
      <button class="sub-pill-btn" id="btnModeArrow" onclick="setSubTool('arrow', this)">箭头</button>
      <button class="sub-pill-btn" id="btnModeRect" onclick="setSubTool('rect', this)">矩形</button>
      <button class="sub-pill-btn" id="btnModeCircle" onclick="setSubTool('circle', this)">圆形</button>
    </div>
  </div>

  <!-- 深色悬浮胶囊工具条 (常驻屏幕正下方，触手可及) -->
  <div class="zhixue-floating-ink-bar" id="zhixueFloatingInkBar">
    <button class="ink-capsule-btn active" id="capsuleBtnSelect" onclick="selectInkTool('select')">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/><path d="M13 13l6 6"/></svg>
      <span>选择</span>
    </button>
    <button class="ink-capsule-btn" id="capsuleBtnPen" onclick="selectInkTool('pen')">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/></svg>
      <span>画笔</span>
    </button>
    <button class="ink-capsule-btn" id="capsuleBtnEraser" onclick="selectInkTool('eraser')">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M20 20H7L3 16C2 15 2 13 3 12L13 2L22 11L20 20Z"/></svg>
      <span>板擦</span>
    </button>
    <button class="ink-capsule-btn" onclick="clearPenInk()">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
      <span>清空</span>
    </button>
    <button class="ink-capsule-btn" onclick="toggleChalkboard()">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
      <span>背景</span>
    </button>
    <div class="ink-capsule-divider"></div>
    <button class="ink-capsule-btn" onclick="inkUndo()">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M9 14L4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11"/></svg>
      <span>撤销</span>
    </button>
    <button class="ink-capsule-btn" onclick="inkRedo()">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M15 14l5-5-5-5"/><path d="M20 9H9.5A5.5 5.5 0 0 0 4 14.5v0A5.5 5.5 0 0 0 9.5 20H13"/></svg>
      <span>恢复</span>
    </button>
  </div>

  <!-- 底部右侧经典导航坞 (上一题 / 第3题 ▾ / 下一题) -->
  <div class="bottom-dock-nav">
    <button class="btn-dock-nav" onclick="prevQuestion()">上一题</button>
    <button class="btn-dock-nav current-badge" id="btnDockCurrentBadge" onclick="toggleDrawer()">第3题 ▾</button>
    <button class="btn-dock-nav" onclick="nextQuestion()">下一题</button>
  </div>
</div>

<!-- 批注透明画板与黑板覆盖层 -->
<div id="chalkboardOverlay"></div>
<canvas id="penLayer"></canvas>

<!-- 灯箱模态 (小题原图与选项大图查看) -->
<div class="lightbox-modal" id="lightboxModal" onclick="closeLightbox(event)">
  <div class="lightbox-content">
    <div style="display:flex; justify-content:space-between; align-items:center;">
      <span style="font-weight:700; color:#0f172a; font-size:16px;" id="lightboxTitle">大图查看</span>
      <button style="border:none; background:none; font-size:24px; cursor:pointer; color:#64748b;" onclick="document.getElementById('lightboxModal').style.display='none'">×</button>
    </div>
    <div class="lightbox-img-box">
      <img id="lightboxImg" src="" alt="大图查看">
    </div>
  </div>
</div>

<div id="toastMsg">提示</div>

<!-- ================= 9. 核心交互与学情可视化 JS ================= -->
<script>
const examDatabase = {db_json_str};
const studentsSummary = {students_json_str};
const b64Assets = {b64_json_str};

let currentQNum = 3;
let currentWorkMode = 'question'; // 'question', 'slices', 'roster'
let hidePrivacyNames = true;
let isDrawerOpen = true;

// 切换三大工作模式
function switchWorkMode(mode) {{
  currentWorkMode = mode;
  document.getElementById('tabModeQuestion').classList.toggle('active', mode === 'question');
  document.getElementById('tabModeSlices').classList.toggle('active', mode === 'slices');
  document.getElementById('tabModeRoster').classList.toggle('active', mode === 'roster');

  const qArea = document.getElementById('viewQuestionArea');
  const slicesArea = document.getElementById('viewSlicesCompare');
  const rosterArea = document.getElementById('viewRosterDashboard');
  const drawer = document.getElementById('rightAnalyticsDrawer');
  const drawerTab = document.getElementById('drawerToggleTab');
  const stage = document.getElementById('mainStageContainer');

  if (mode === 'roster') {{
    qArea.style.display = 'none';
    slicesArea.style.display = 'none';
    rosterArea.style.display = 'block';
    drawer.classList.add('collapsed');
    drawerTab.classList.add('collapsed');
    stage.classList.add('drawer-collapsed');
    renderRosterDashboard();
  }} else if (mode === 'slices') {{
    qArea.style.display = 'none';
    slicesArea.style.display = 'block';
    rosterArea.style.display = 'none';
    renderSlicesCompareView(examDatabase[currentQNum]);
    stage.scrollTo({{ top: 0, behavior: 'smooth' }});
  }} else {{
    qArea.style.display = 'block';
    slicesArea.style.display = 'none';
    rosterArea.style.display = 'none';
    stage.scrollTo({{ top: 0, behavior: 'smooth' }});
  }}
}}

// 题目切换
function loadQuestion(num) {{
  currentQNum = parseInt(num);
  const q = examDatabase[currentQNum] || examDatabase['3'];

  // 1. 更新顶部题标与得分率
  document.getElementById('qTagNum').textContent = `第${{q.num}}题`;
  document.getElementById('qTagType').textContent = q.type;
  document.getElementById('qTagRate').textContent = `得分率${{q.scoreRate}}`;
  document.getElementById('qTagRate').classList.toggle('low', !!q.isLow);
  document.getElementById('btnDockCurrentBadge').textContent = `第${{q.num}}题 ▾`;

  // 2. 题干
  document.getElementById('qStemContent').innerHTML = q.stemHtml;

  // 3. 选项插槽渲染 (确保选项图片 100% 正常显示)
  const optSlot = document.getElementById('optionsRenderSlot');
  const figSlot = document.getElementById('figureRenderSlot');
  optSlot.innerHTML = '';
  figSlot.innerHTML = '';

  if (currentQNum === 3) {{
    const q3Imgs = {{
      'A': b64Assets['q3_A'] || 'courseware_assets/q3_opt_A.png',
      'B': b64Assets['q3_B'] || 'courseware_assets/q3_opt_B.png',
      'C': b64Assets['q3_C'] || 'courseware_assets/q3_opt_C.png',
      'D': b64Assets['q3_D'] || 'courseware_assets/q3_opt_D.png'
    }};

    let html = '<div class="zhixue-options-row">';
    q.options.forEach(opt => {{
      const imgSrc = q3Imgs[opt.label] || opt.img || `courseware_assets/q3_opt_${{opt.label}}.png`;
      html += `
        <div class="zhixue-option-item" onclick="filterOptionStudents('${{opt.label}}')">
          <span class="zhixue-option-label">${{opt.label}}.</span>
          <div class="zhixue-option-img-box">
            <img src="${{imgSrc}}" alt="选项${{opt.label}}">
            <div class="zhixue-zoom-btn" title="放大预览" onclick="event.stopPropagation(); openLightbox('${{imgSrc}}', '第3题 选项 ${{opt.label}} 坐标系高清图')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
            </div>
          </div>
        </div>
      `;
    }});
    html += '</div>';
    optSlot.innerHTML = html;
  }} else if (q.options && q.options.length > 0) {{
    let html = '<div class="zhixue-text-options-grid">';
    q.options.forEach(opt => {{
      html += `
        <div class="zhixue-text-option-card ${{opt.isCorrect ? 'correct' : ''}}" onclick="filterOptionStudents('${{opt.label}}')">
          <span style="font-weight:bold; font-family:var(--math-font); font-size:20px;">${{opt.label}}.</span>
          <span style="font-size:18px; font-family:var(--math-font);">${{opt.text || ''}}</span>
          <span style="font-size:12px; color:#8c8c8c;">${{opt.count}}人 (${{opt.pct}})</span>
        </div>
      `;
    }});
    html += '</div>';
    optSlot.innerHTML = html;
  }}

  if (q.figure) {{
    figSlot.innerHTML = `
      <div class="zhixue-figure-container">
        <img src="${{q.figure}}" alt="第${{q.num}}题原题附图">
        <div class="zhixue-zoom-btn" title="查看大图" onclick="openLightbox('${{q.figure}}', '第${{q.num}}题 原题几何附图')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
        </div>
      </div>
    `;
  }}

  // 4. 更新右侧抽屉列表高亮与统计
  document.querySelectorAll('.drawer-nav-item').forEach(el => {{
    el.classList.toggle('active', el.id === 'drawerNavItem_' + currentQNum);
  }});
  renderDrawerStats(q);

  if (currentWorkMode === 'slices') {{
    renderSlicesCompareView(q);
  }}

  // 5. 重绘本题独立批注
  redrawCurrentInkPage();
}}

// 渲染右侧作答统计
function renderDrawerStats(q) {{
  document.getElementById('statsTitle').textContent = `第${{q.num}}题作答统计`;
  document.getElementById('statsClassRate').textContent = `班级 得分率${{q.scoreRate}}`;
  document.getElementById('statsGradeRate').textContent = `年级 得分率${{q.gradeRate}}`;

  const optContainer = document.getElementById('statsOptionsList');
  optContainer.innerHTML = '';

  if (q.options) {{
    q.options.forEach(opt => {{
      const row = document.createElement('div');
      row.className = 'option-stat-row';
      row.onclick = () => filterOptionStudents(opt.label);
      row.innerHTML = `
        <div class="option-stat-header">
          <span style="font-weight:700; color:#1e293b;">${{opt.label}} ${{opt.isCorrect ? '<span style="color:#52c41a; font-size:12px;">(正确)</span>' : ''}}</span>
          <span style="font-size:12.5px; color:#64748b;">${{opt.count}} 人</span>
        </div>
        <div class="option-bar-bg">
          <div class="option-bar-fill ${{opt.isCorrect ? 'correct' : 'wrong'}}" style="width: ${{opt.pct}};"></div>
        </div>
      `;
      optContainer.appendChild(row);
    }});
  }} else if (q.subQuestions) {{
    q.subQuestions.forEach(sub => {{
      const row = document.createElement('div');
      row.className = 'option-stat-row';
      row.innerHTML = `
        <div class="option-stat-header">
          <span style="font-size:12px; font-weight:600;">${{sub.subTitle}}</span>
          <span style="font-weight:bold; color:${{sub.isLow ? '#dc2626' : '#00bfa5'}};">${{sub.rate}}</span>
        </div>
        <div class="option-bar-bg">
          <div class="option-bar-fill ${{sub.isLow ? 'wrong' : 'correct'}}" style="width: ${{sub.rate}};"></div>
        </div>
      `;
      optContainer.appendChild(row);
    }});
  }}

  // 初始加载全部失分名单
  showWrongStudentsList(q);
}}

function showWrongStudentsList(q) {{
  const container = document.getElementById('statsStuChipsContainer');
  const title = document.getElementById('statsStuHeaderTitle');
  const badge = document.getElementById('statsStuCountBadge');

  const wrongs = q.wrongStudents || [];
  title.textContent = '失分学生名单 (点击可看原图)';
  badge.textContent = `${{wrongs.length}}人`;
  container.innerHTML = '';

  if (wrongs.length === 0) {{
    container.innerHTML = '<span style="font-size:12px; color:#52c41a;">🎉 全班全对，无人失分！</span>';
  }} else {{
    wrongs.forEach(stu => {{
      const chip = document.createElement('span');
      chip.className = 'stu-chip wrong';
      chip.textContent = hidePrivacyNames ? maskStudentName(stu) : stu;
      chip.title = '点击查看该生本题原图';
      chip.onclick = () => openStudentQuestionDirectSlice(stu, q.num);
      container.appendChild(chip);
    }});
  }}
}}

// 筛选某选项作答学生
function filterOptionStudents(optLabel) {{
  const q = examDatabase[currentQNum];
  if (!q || !q.options) return;
  const opt = q.options.find(o => o.label === optLabel);
  if (!opt) return;

  const container = document.getElementById('statsStuChipsContainer');
  const title = document.getElementById('statsStuHeaderTitle');
  const badge = document.getElementById('statsStuCountBadge');

  title.textContent = `选择 [选项 ${{optLabel}}] 学生`;
  badge.textContent = `${{opt.count}}人`;
  container.innerHTML = '';

  if (opt.students && opt.students.length > 0) {{
    opt.students.forEach(name => {{
      const chip = document.createElement('span');
      chip.className = 'stu-chip ' + (opt.isCorrect ? '' : 'wrong');
      chip.textContent = hidePrivacyNames ? maskStudentName(name) : name;
      chip.onclick = () => openStudentQuestionDirectSlice(name, q.num);
      container.appendChild(chip);
    }});
  }} else {{
    container.innerHTML = '<span style="font-size:12px; color:#8c8c8c;">无学生选择此项</span>';
  }}
}}

// 点击学生名牌直接查看学生小题精准原图
function openStudentQuestionDirectSlice(stuName, qNum) {{
  const raw = stuName.split('(')[0].trim();
  let tag = 'chen';
  if (raw.includes('沙兴远')) tag = 'sha';
  else if (raw.includes('周辰玺')) tag = 'zhou';
  else if (raw.includes('何晨煦')) tag = 'he';
  else if (raw.includes('张育敏')) tag = 'zhang';
  else if (raw.includes('廖思敏')) tag = 'liao';
  else if (raw.includes('李陈顺')) tag = 'li';
  else tag = 'chen';

  const sliceImg = 'courseware_assets/accurate_' + tag + '_q' + qNum + '.png';
  openLightbox(sliceImg, stuName + ' · 第' + qNum + '题精准小题作答原图（带老师红笔批注）');
}}

// 真实卷面切片对比模式渲染
function renderSlicesCompareView(q) {{
  const grid = document.getElementById('slicesGridSlot');
  const badge = document.getElementById('slicesErrorCountBadge');
  grid.innerHTML = '';

  const wrongs = q.wrongStudents || [];
  badge.textContent = `失分学生：${{wrongs.length}} 人`;

  if (q.slices && q.slices.length > 0) {{
    q.slices.forEach(sl => {{
      const isFull = sl.tag.includes('满分') || sl.tag.includes('全班满分') || sl.tag.includes('正确') || sl.tag.includes('示范');
      const card = document.createElement('div');
      card.className = 'slice-paper-card ' + (isFull ? 'full-score' : 'loss-score');
      card.innerHTML = `
        <div class="slice-card-header">
          <span class="slice-student-title">${{hidePrivacyNames ? maskStudentName(sl.student) : sl.student}}</span>
          <span class="slice-status-badge ${{isFull ? 'green' : 'red'}}">${{sl.tag}}</span>
        </div>
        <div class="slice-img-wrapper" onclick="openLightbox('${{sl.file}}', '${{sl.student}} · 第${{q.num}}题真实卷面切片')">
          <img src="${{sl.file}}" alt="${{sl.student}}">
        </div>
        <div class="slice-desc-text">💡 <b>诊断剖析</b>：${{sl.desc || '真实客观答卷原样对标'}}</div>
      `;
      grid.appendChild(card);
    }});
  }} else {{
    grid.innerHTML = '<div style="color:#64748b; padding:20px;">暂无该题主观书写切片</div>';
  }}
}}

// 隐私脱敏姓名转换
function maskStudentName(rawName) {{
  if (!rawName) return '';
  const match = rawName.match(/^([^\(]+)(\(.*\))?$/);
  if (!match) return rawName;
  const name = match[1];
  const note = match[2] || '';
  if (name.length <= 1) return name + note;
  if (name.length === 2) return name[0] + '*' + note;
  return name[0] + '*'.repeat(name.length - 2) + name[name.length - 1] + note;
}}

function toggleStudentPrivacy() {{
  hidePrivacyNames = !hidePrivacyNames;
  document.getElementById('privacyHeaderTag').textContent = hidePrivacyNames ? '🔒 姓名已脱敏' : '🔓 姓名明文';
  loadQuestion(currentQNum);
  if (currentWorkMode === 'roster') renderRosterDashboard();
  showToast(hidePrivacyNames ? '已启用隐私保护，学生姓名已打码' : '已显示学生真实姓名');
}}

// 抽屉折叠展开
function toggleDrawer() {{
  isDrawerOpen = !isDrawerOpen;
  const drawer = document.getElementById('rightAnalyticsDrawer');
  const drawerTab = document.getElementById('drawerToggleTab');
  const stage = document.getElementById('mainStageContainer');
  const arrow = document.getElementById('drawerTabArrow');

  drawer.classList.toggle('collapsed', !isDrawerOpen);
  drawerTab.classList.toggle('collapsed', !isDrawerOpen);
  stage.classList.toggle('drawer-collapsed', !isDrawerOpen);

  arrow.style.transform = isDrawerOpen ? 'none' : 'rotate(180deg)';
  document.getElementById('drawerTabText').textContent = isDrawerOpen ? '收起分析' : '试题分析';
}}

// 题号目录导航渲染
function renderQNavList() {{
  const list = document.getElementById('drawerQNavList');
  list.innerHTML = '';

  let currentSection = '';
  Object.keys(examDatabase).sort((a,b) => parseInt(a) - parseInt(b)).forEach(k => {{
    const item = examDatabase[k];
    if (item.type !== currentSection) {{
      currentSection = item.type;
      const sec = document.createElement('div');
      sec.className = 'drawer-nav-section-title';
      sec.textContent = currentSection;
      list.appendChild(sec);
    }}

    const btn = document.createElement('div');
    btn.className = 'drawer-nav-item' + (item.num === currentQNum ? ' active' : '');
    btn.id = 'drawerNavItem_' + item.num;
    btn.onclick = () => loadQuestion(item.num);

    btn.innerHTML = `
      <span style="font-weight:700;">${{item.num}}</span>
      <span class="q-rate-label ${{item.isLow ? 'low' : ''}}">${{item.scoreRate}}</span>
    `;
    list.appendChild(btn);
  }});
}}

// 渲染全班学情诊断大屏
function renderRosterDashboard() {{
  const waterfall = document.getElementById('waterfallBarsSlot');
  waterfall.innerHTML = '';

  const questionsRateList = [
    {{ num: 1, rate: 96.6, isHot: false }},
    {{ num: 2, rate: 89.7, isHot: false }},
    {{ num: 3, rate: 89.7, isHot: false }},
    {{ num: 4, rate: 100.0, isHot: false }},
    {{ num: 5, rate: 96.6, isHot: false }},
    {{ num: 6, rate: 93.1, isHot: false }},
    {{ num: 7, rate: 86.2, isHot: false }},
    {{ num: 8, rate: 37.9, isHot: true, label: '🔥 重点' }},
    {{ num: '9-1', qNum: 9, rate: 87.9, isHot: false }},
    {{ num: '9-2', qNum: 9, rate: 21.6, isHot: true, label: '🔥 重灾区' }},
    {{ num: '10-1', qNum: 10, rate: 95.3, isHot: false }},
    {{ num: '10-2', qNum: 10, rate: 75.4, isHot: false }},
    {{ num: '11-1', qNum: 11, rate: 98.7, isHot: false }},
    {{ num: '11-2', qNum: 11, rate: 69.8, isHot: false }},
    {{ num: '12-1', qNum: 12, rate: 91.4, isHot: false }},
    {{ num: '12-2', qNum: 12, rate: 72.0, isHot: false }},
  ];

  questionsRateList.forEach(item => {{
    const col = document.createElement('div');
    col.className = 'q-rate-column-item';
    col.title = `第${{item.num}}题 得分率: ${{item.rate}}% (点击直接跳转该题讲评)`;
    col.onclick = () => {{
      const targetNum = item.qNum || item.num;
      switchWorkMode('question');
      loadQuestion(targetNum);
    }};

    const barColor = item.isHot ? '#ef4444' : item.rate >= 85 ? '#00bfa5' : item.rate >= 70 ? '#0284c7' : '#f59e0b';
    col.innerHTML = `
      <div class="q-rate-col-pct" style="color:${{barColor}}">${{item.rate}}%</div>
      <div class="q-rate-col-bar" style="height:${{item.rate * 1.5}}px; background:${{barColor}};"></div>
      <div class="q-rate-col-label">${{item.num}}</div>
    `;
    waterfall.appendChild(col);
  }});

  filterRoster('all');
}}

function filterRoster(type, btnEl) {{
  if (btnEl) {{
    document.querySelectorAll('.roster-pill-btn').forEach(b => b.classList.remove('active'));
    btnEl.classList.add('active');
  }}

  const container = document.getElementById('rosterCardsGrid');
  container.innerHTML = '';

  let list = studentsSummary;
  if (type === 'top') list = list.filter(s => s.score >= 50);
  else if (type === 'mid') list = list.filter(s => s.score >= 40 && s.score < 50);
  else if (type === 'low') list = list.filter(s => s.score < 40);

  list.forEach(stu => {{
    const card = document.createElement('div');
    card.className = 'student-roster-card';
    card.onclick = () => {{
      const qFirst = stu.wrongs.split('、')[0] || '8';
      const qNum = parseInt(qFirst) || 8;
      openStudentQuestionDirectSlice(stu.name, qNum);
    }};

    card.innerHTML = `
      <div class="student-card-top">
        <span class="student-card-name">第${{stu.rank}}名 · ${{hidePrivacyNames ? maskStudentName(stu.name) : stu.name}}</span>
        <span class="student-card-score">${{stu.score}} 分</span>
      </div>
      <div style="font-size:12px; color:#64748b;">准考号: ${{stu.id}} | 得分率: ${{stu.rate}}</div>
      <div style="font-size:12px; color:#dc2626; background:#fff1f0; padding:4px 8px; border-radius:4px;">
        ⚠️ 失分题号: ${{stu.wrongs || '无 (满分)'}}
      </div>
      <button class="header-tool-btn" style="width:100%; justify-content:center; margin-top:4px;">
        <span>🔍 查看精准小题原卷 →</span>
      </button>
    `;
    container.appendChild(card);
  }});
}}

// 前后翻题
function prevQuestion() {{
  if (currentQNum > 1) loadQuestion(currentQNum - 1);
  else showToast('已是第一题');
}}

function nextQuestion() {{
  if (currentQNum < 12) loadQuestion(currentQNum + 1);
  else showToast('已是最后一题');
}}

function toggleFullScreen() {{
  if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(() => {{}});
  else if (document.exitFullscreen) document.exitFullscreen();
}}

function openLightbox(url, title) {{
  document.getElementById('lightboxTitle').textContent = title;
  document.getElementById('lightboxImg').src = url;
  document.getElementById('lightboxModal').style.display = 'flex';
}}

function closeLightbox(e) {{
  if (e.target.id === 'lightboxModal') document.getElementById('lightboxModal').style.display = 'none';
}}

function showToast(msg) {{
  const t = document.getElementById('toastMsg');
  t.textContent = msg;
  t.style.display = 'block';
  clearTimeout(t.timer);
  t.timer = setTimeout(() => {{ t.style.display = 'none'; }}, 1800);
}}

/* ================= 10. 恢复原版批注工具 JS (#penLayer + 底部深色胶囊栏) ================= */
let activeInkTool = 'select'; // 'select', 'pen', 'eraser'
let currentInkColor = '#d94040';
let currentInkWidth = 2;
let isDashedStroke = false;
let currentSubTool = 'pen'; // 'pen', 'highlight', 'axes', 'arrow', 'rect', 'circle'
let isChalkboard = false;
let strokesHistory = {{}};
let redoStack = {{}};
let currentStroke = null;

const canvas = document.getElementById('penLayer');
const ctx = canvas.getContext('2d', {{ desynchronized: true }});

function resizeCanvas() {{
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  redrawCurrentInkPage();
}}
window.addEventListener('resize', resizeCanvas);

function selectInkTool(tool) {{
  activeInkTool = tool;
  document.getElementById('capsuleBtnSelect').classList.toggle('active', tool === 'select');
  document.getElementById('capsuleBtnPen').classList.toggle('active', tool === 'pen');
  document.getElementById('capsuleBtnEraser').classList.toggle('active', tool === 'eraser');

  const subMenu = document.getElementById('inkSubPaletteMenu');
  if (tool === 'pen') {{
    subMenu.classList.add('visible');
    canvas.classList.add('enabled');
    showToast('已激活画笔批注模式');
  }} else if (tool === 'eraser') {{
    subMenu.classList.remove('visible');
    canvas.classList.add('enabled');
    showToast('已激活板擦模式');
  }} else {{
    subMenu.classList.remove('visible');
    canvas.classList.remove('enabled');
    showToast('已进入触控操作/选择模式');
  }}
}}

function setSubColor(color, el) {{
  currentInkColor = color;
  document.querySelectorAll('.sub-color-circle').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
}}

function setSubWidth(w, el) {{
  currentInkWidth = w;
  document.querySelectorAll('.sub-pill-btn').forEach(b => {{
    if (b.textContent.includes('px')) b.classList.remove('active');
  }});
  el.classList.add('active');
}}

function toggleSubDashed(el) {{
  isDashedStroke = !isDashedStroke;
  el.classList.toggle('active', isDashedStroke);
}}

function setSubTool(toolName, el) {{
  currentSubTool = toolName;
  document.getElementById('btnModePen').classList.remove('active');
  document.getElementById('btnModeHighlight').classList.remove('active');
  document.getElementById('btnModeAxes').classList.remove('active');
  document.getElementById('btnModeArrow').classList.remove('active');
  document.getElementById('btnModeRect').classList.remove('active');
  document.getElementById('btnModeCircle').classList.remove('active');
  el.classList.add('active');
}}

function toggleChalkboard() {{
  isChalkboard = !isChalkboard;
  document.getElementById('chalkboardOverlay').style.display = isChalkboard ? 'block' : 'none';
  showToast(isChalkboard ? '已开启全屏墨绿黑板' : '已返回原生试卷背景');
}}

function clearPenInk() {{
  strokesHistory[currentQNum] = [];
  redoStack[currentQNum] = [];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  showToast('已清空当前题目批注');
}}

function inkUndo() {{
  const s = strokesHistory[currentQNum] || [];
  if (s.length > 0) {{
    if (!redoStack[currentQNum]) redoStack[currentQNum] = [];
    redoStack[currentQNum].push(s.pop());
    redrawCurrentInkPage();
  }}
}}

function inkRedo() {{
  const r = redoStack[currentQNum] || [];
  if (r.length > 0) {{
    if (!strokesHistory[currentQNum]) strokesHistory[currentQNum] = [];
    strokesHistory[currentQNum].push(r.pop());
    redrawCurrentInkPage();
  }}
}}

function redrawCurrentInkPage() {{
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const s = strokesHistory[currentQNum] || [];
  s.forEach(st => drawSingleStroke(st));
}}

function drawSingleStroke(st) {{
  if (!st || !st.points || st.points.length === 0) return;
  ctx.save();
  ctx.strokeStyle = st.color;
  ctx.lineWidth = st.width;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  if (st.isDashed) ctx.setLineDash([8, 8]);
  else ctx.setLineDash([]);

  if (st.tool === 'highlight') {{
    ctx.globalAlpha = 0.35;
    ctx.lineWidth = st.width * 3.5;
  }} else {{
    ctx.globalAlpha = 1.0;
  }}

  const p1 = st.points[0];
  const p2 = st.points[st.points.length - 1];
  const w = p2.x - p1.x;
  const h = p2.y - p1.y;

  if (st.tool === 'rect') {{
    ctx.strokeRect(p1.x, p1.y, w, h);
  }} else if (st.tool === 'circle') {{
    const r = Math.hypot(w, h);
    ctx.beginPath();
    ctx.arc(p1.x, p1.y, r, 0, Math.PI * 2);
    ctx.stroke();
  }} else if (st.tool === 'axes') {{
    const cx = (p1.x + p2.x) / 2;
    const cy = (p1.y + p2.y) / 2;
    ctx.beginPath();
    ctx.moveTo(p1.x, cy); ctx.lineTo(p2.x, cy);
    ctx.moveTo(cx, p2.y); ctx.lineTo(cx, p1.y);
    ctx.stroke();
  }} else if (st.tool === 'arrow') {{
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
    const ang = Math.atan2(h, w);
    ctx.beginPath();
    ctx.moveTo(p2.x, p2.y);
    ctx.lineTo(p2.x - 16 * Math.cos(ang - Math.PI / 6), p2.y - 16 * Math.sin(ang - Math.PI / 6));
    ctx.lineTo(p2.x - 16 * Math.cos(ang + Math.PI / 6), p2.y - 16 * Math.sin(ang + Math.PI / 6));
    ctx.closePath();
    ctx.fillStyle = st.color;
    ctx.fill();
  }} else {{
    ctx.beginPath();
    ctx.moveTo(st.points[0].x, st.points[0].y);
    for (let i = 1; i < st.points.length - 1; i++) {{
      const xc = (st.points[i].x + st.points[i + 1].x) / 2;
      const yc = (st.points[i].y + st.points[i + 1].y) / 2;
      ctx.quadraticCurveTo(st.points[i].x, st.points[i].y, xc, yc);
    }}
    if (st.points.length > 1) {{
      const last = st.points[st.points.length - 1];
      ctx.lineTo(last.x, last.y);
    }}
    ctx.stroke();
  }}
  ctx.restore();
}}

// 批注指针事件绑定
canvas.addEventListener('pointerdown', e => {{
  if (activeInkTool === 'select') return;
  currentStroke = {{
    tool: (activeInkTool === 'pen' ? currentSubTool : 'pen'),
    color: currentInkColor,
    width: currentInkWidth,
    isDashed: isDashedStroke,
    points: [{{ x: e.clientX, y: e.clientY }}]
  }};
}});

canvas.addEventListener('pointermove', e => {{
  if (!currentStroke) return;
  if (activeInkTool === 'eraser') {{
    const s = strokesHistory[currentQNum] || [];
    strokesHistory[currentQNum] = s.filter(st => {{
      return !st.points.some(p => Math.hypot(p.x - e.clientX, p.y - e.clientY) < 24);
    }});
    redrawCurrentInkPage();
    return;
  }}

  currentStroke.points.push({{ x: e.clientX, y: e.clientY }});
  redrawCurrentInkPage();
  drawSingleStroke(currentStroke);
}});

window.addEventListener('pointerup', () => {{
  if (!currentStroke) return;
  if (currentStroke.points.length > 0 && activeInkTool !== 'eraser') {{
    if (!strokesHistory[currentQNum]) strokesHistory[currentQNum] = [];
    strokesHistory[currentQNum].push(currentStroke);
    redoStack[currentQNum] = [];
  }}
  currentStroke = null;
  redrawCurrentInkPage();
}});

// 键盘快捷键 (←/→翻题，F全屏，P切画笔，B黑板，Esc光标选择)
window.addEventListener('keydown', e => {{
  if (e.key === 'ArrowLeft') prevQuestion();
  else if (e.key === 'ArrowRight') nextQuestion();
  else if (e.key === 'f' || e.key === 'F') toggleFullScreen();
  else if (e.key === 'p' || e.key === 'P') selectInkTool(activeInkTool === 'pen' ? 'select' : 'pen');
  else if (e.key === 'b' || e.key === 'B') toggleChalkboard();
  else if (e.key === 'Escape') {{
    document.getElementById('lightboxModal').style.display = 'none';
    selectInkTool('select');
  }} else if ((e.ctrlKey || e.metaKey) && e.key === 'z') {{
    e.preventDefault();
    inkUndo();
  }} else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {{
    e.preventDefault();
    inkRedo();
  }}
}});

// 初始化启动
window.addEventListener('DOMContentLoaded', () => {{
  resizeCanvas();
  renderQNavList();
  loadQuestion(3);
}});
</script>
</body>
</html>
"""

    out_file1 = '/Users/xionghaoran/数学交互式课件/One·ai_讲评工作台_动态演示.html'
    out_file2 = '/Users/xionghaoran/数学交互式课件/智学网讲评模式_动态交互演示Demo.html'

    with open(out_file1, 'w', encoding='utf-8') as f:
        f.write(html)
    with open(out_file2, 'w', encoding='utf-8') as f:
        f.write(html)

    print(f"Generated v3 successfully!\n- {out_file1}\n- {out_file2}")

if __name__ == '__main__':
    generate_v3()

#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
生成全新重构的高规格 One·ai 讲评工作台 v2
- 完美大屏自适应缩放（Seewo 希沃一体机 / 1080P / 4K / 平板响应式）
- 抽屉折叠后边缘悬浮 Tab 随时一键展出，零裁剪防遮挡
- 支持点击查看学生小题真实作答原图（带老师红笔切片与扣分标记）
- 彻底删去不需要的讲题画板模式，聚焦试题原题、小题原图与学情分析
- 打造高颜值交互式全班学情诊断大屏（4核心指标卡 + 分数段柱状图 + 12小题得分率柱状图 + 29人画像筛选名册）
- 删去多余重复元素，极大优化人机交互与大触控区域
- 完整恢复用户原版批注工具（#penLayer + #inkToolbar.ink-floating + 穿透模式 + 几何图形作图 + 二级菜单 + 双缓冲画布）
"""

import json
import os

def generate_v2():
    with open('/Users/xionghaoran/数学交互式课件/courseware_assets/exam_database.json', 'r', encoding='utf-8') as f:
        exam_db = json.load(f)

    with open('/Users/xionghaoran/数学交互式课件/courseware_assets/students_summary.json', 'r', encoding='utf-8') as f:
        students_summary = json.load(f)

    with open('/Users/xionghaoran/数学交互式课件/courseware_assets/user_ink_css.css', 'r', encoding='utf-8') as f:
        user_ink_css = f.read()

    db_json_str = json.dumps(exam_db, ensure_ascii=False)
    students_json_str = json.dumps(students_summary, ensure_ascii=False)

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

/* ================= 2. 主体工作区与大屏自适应 ================= */
.main-workspace {{
  flex: 1;
  display: flex;
  position: relative;
  overflow: hidden;
  height: calc(100vh - var(--header-height));
  background: #ffffff;
}}

/* 试题与切片主视区容器 (自适应右侧抽屉伸缩) */
.stage-container {{
  flex: 1;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  padding: clamp(20px, 2.5vh, 40px) clamp(24px, 3.5vw, 60px) 100px clamp(24px, 3.5vw, 60px);
  transition: margin-right 0.3s cubic-bezier(0.2, 0, 0, 1);
  margin-right: var(--drawer-width);
}}

.stage-container.drawer-collapsed {{
  margin-right: 0 !important;
}}

/* 题目标题与元信息行 */
.zhixue-q-meta-row {{
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}}

.zhixue-q-tag {{
  background: var(--zhixue-teal);
  color: #ffffff;
  font-size: clamp(14px, 1.1vw, 16px);
  font-weight: 700;
  padding: 3px 10px;
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
  font-size: clamp(18px, 1.35vw, 24px);
  line-height: 1.85;
  color: #111827;
  margin-bottom: 28px;
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

/* 选项展示区 (自适应大屏横排，小屏自适应换行) */
.zhixue-options-row {{
  display: flex;
  align-items: flex-start;
  gap: clamp(16px, 2.5vw, 36px);
  margin-top: 14px;
  flex-wrap: wrap;
}}

.zhixue-option-item {{
  display: flex;
  align-items: flex-start;
  gap: 12px;
  cursor: pointer;
  border-radius: 10px;
  padding: 10px;
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
  box-shadow: 0 2px 6px rgba(0,0,0,0.03);
  display: flex;
  align-items: center;
  justify-content: center;
}}

.zhixue-option-img-box img {{
  display: block;
  max-width: clamp(180px, 16vw, 280px);
  max-height: clamp(170px, 15vh, 260px);
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
  gap: 16px;
  max-width: 800px;
}}

.zhixue-text-option-card {{
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  padding: 14px 20px;
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
  margin: 18px 0;
  display: inline-flex;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  padding: 10px;
  background: #ffffff;
  box-shadow: 0 4px 12px rgba(0,0,0,0.04);
  position: relative;
}}

.zhixue-figure-container img {{
  max-width: clamp(280px, 30vw, 480px);
  max-height: clamp(220px, 28vh, 340px);
  display: block;
  object-fit: contain;
}}

/* ================= 3. 学生小题作答原图展示区 (支持全题切片查看) ================= */
.student-slices-section {{
  margin-top: 36px;
  border-top: 2px dashed #e2e8f0;
  padding-top: 24px;
}}

.student-slices-header {{
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}}

.student-slices-title {{
  font-size: clamp(16px, 1.2vw, 19px);
  font-weight: 800;
  color: #0f172a;
  display: flex;
  align-items: center;
  gap: 10px;
}}

.student-slices-grid {{
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
  transition: transform 0.2s, box-shadow 0.2s;
}}

.slice-paper-card:hover {{
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
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
  position: relative;
}}

.slice-img-wrapper img {{
  width: 100%;
  height: auto;
  display: block;
}}

.slice-desc-text {{
  font-size: 13.5px;
  line-height: 1.6;
  color: #475569;
}}

/* ================= 4. 右侧抽屉 (折叠防遮挡 + 边缘悬浮挂耳) ================= */
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

/* 核心修复：抽屉折叠/展开专用悬浮挂耳 (永远保持可点，大触控热区) */
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

/* ================= 5. 全班学情总览：可视化分析大屏 (Visual Analytics Dashboard) ================= */
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

/* 图表双栏网格 */
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

/* 分数段分布柱状条 */
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
  position: relative;
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

/* 12小题得分率柱状全景图 */
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

/* 学生名册过滤与卡片网格 */
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

/* ================= 6. 底部悬浮控制坞 (上一题/第3题/下一题) ================= */
.bottom-dock-nav {{
  position: fixed;
  bottom: 20px;
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
  font-size: 13.5px;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0,0,0,0.06);
  transition: all 0.15s;
  font-weight: 600;
  min-height: 42px;
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

/* ================= 7. 用户原版批注工具 CSS (#penLayer + #inkToolbar.ink-floating) ================= */
{user_ink_css}

/* 批注全屏画布与黑板图层 */
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

/* 模态大图查看器 */
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
        <span>📌 试题讲解与原图</span>
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
      <button class="header-tool-btn" id="btnPenTrigger" onclick="togglePenMode()">
        <span>✏️ 批注</span>
      </button>
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
    <!-- 试题主讲台容器 -->
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
          一次函数<i class="m">y</i>=<i class="m">ax</i>+1 与反比例函数<i class="m">y</i>=-<span class="m-frac"><span class="m-top"><i class="m">a</i></span><span class="m-bot"><i class="m">x</i></span></span> 在同一坐标系中的大致图象是（　）
        </div>

        <div id="optionsRenderSlot"></div>
        <div id="figureRenderSlot"></div>

        <!-- 试题下方内嵌学生小题原图快速切换卡 -->
        <div class="student-slices-section" id="studentSlicesInlineSection">
          <div class="student-slices-header">
            <div class="student-slices-title">
              <span>📝 学生本题作答原图（带老师红笔切片与扣分标记）</span>
              <span id="inlineSlicesErrorBadge" style="font-size:13px; color:#ef4444; background:#fee2e2; padding:3px 9px; border-radius:4px; font-weight:700;">失分 3 人</span>
            </div>
            <button class="header-tool-btn" onclick="switchWorkMode('slices')">
              <span>全屏对比讲评 →</span>
            </button>
          </div>
          <div class="student-slices-grid" id="inlineSlicesGrid"></div>
        </div>
      </div>

      <!-- 全班学情可视化大屏区 -->
      <div class="roster-dashboard-view" id="viewRosterDashboard">
        <!-- 4 核心指标卡 -->
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

        <!-- 图表网格：分数段分布 + 12小题得分率柱状图 -->
        <div class="charts-double-grid">
          <!-- 分数段分布 -->
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

          <!-- 12小题得分率柱状瀑布图 -->
          <div class="chart-card">
            <div class="chart-card-title">
              <span>🔥 全卷 12 道小题得分率全景诊断（点击柱子直达该题）</span>
              <span style="font-size:12.5px; color:#ef4444; font-weight:bold;">第8题、第9-2题为重点讲评题</span>
            </div>
            <div class="q-rate-waterfall-chart" id="waterfallBarsSlot">
              <!-- 动态注入 12 小题柱状图 -->
            </div>
          </div>
        </div>

        <!-- 全班 29 人学生画像卡片名册 -->
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

    <!-- 抽屉专属边缘悬浮挂耳 (永远保持可点，大屏触控必备) -->
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
        <!-- 左侧题目目录导航 -->
        <div class="drawer-q-nav">
          <div class="drawer-q-nav-scroll" id="drawerQNavList"></div>
        </div>

        <!-- 右侧本题作答统计 -->
        <div class="drawer-q-stats">
          <div class="stats-title" id="statsTitle">第3题作答统计</div>
          <div class="stats-badges-row">
            <span class="stats-badge-pill class" id="statsClassRate">班级 得分率89.7%</span>
            <span class="stats-badge-pill grade" id="statsGradeRate">年级 得分率81.7%</span>
          </div>

          <!-- 选项分布柱状图 -->
          <div class="options-stat-list" id="statsOptionsList"></div>

          <!-- 学生作答详情名牌 (支持点击直接弹窗看该生本题原图) -->
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

  <!-- 底部右侧经典导航坞 (上一题 / 第3题 ▾ / 下一题) -->
  <div class="bottom-dock-nav">
    <button class="btn-dock-nav" onclick="prevQuestion()">上一题</button>
    <button class="btn-dock-nav current-badge" id="btnDockCurrentBadge" onclick="toggleDrawer()">第3题 ▾</button>
    <button class="btn-dock-nav" onclick="nextQuestion()">下一题</button>
  </div>
</div>

<!-- ================= 8. 用户原版批注工具 HTML (#penLayer + #inkToolbar.ink-floating) ================= -->
<div id="chalkboardOverlay"></div>
<canvas id="penLayer"></canvas>

<section id="inkToolbar" aria-label="课堂批注工具" class="ink-floating ink-simple" hidden>
  <div class="ink-float-head">
    <div id="inkDrag" title="拖拽移动批注栏" aria-label="拖拽移动批注栏">
      <span class="ink-grip" aria-hidden="true">⋮⋮</span>
      <span>批注工具</span>
    </div>
    <button id="inkFold" type="button" title="收起为悬浮球" aria-label="收起为悬浮球">
      <svg viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/></svg>
    </button>
    <button id="inkExit" type="button" title="退出批注" aria-label="退出批注">
      <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
  </div>

  <div class="ink-group">
    <button type="button" data-ink-tool="cursor" title="手指触控操作课件（鼠标穿透模式）" aria-label="触控操作课件">
      <svg viewBox="0 0 24 24"><path d="M18 11v-1a2 2 0 0 0-2-2a2 2 0 0 0-2 2"/><path d="M14 10V9a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2"/><path d="M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/></svg>
    </button>
    <button type="button" data-ink-tool="pen" class="selected" title="画笔（点击展开粗细与调色二级菜单）" aria-label="画笔">
      <svg viewBox="0 0 24 24"><path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
      <svg class="ink-tool-caret" viewBox="0 0 12 12" fill="none" stroke="currentColor"><path d="M2.5 4.5 6 8l3.5-3.5"/></svg>
      <span class="ink-tool-color-bar" style="background:#d94040"></span>
    </button>
    <button type="button" data-ink-tool="highlight" title="荧光笔（点击展开粗细与调色二级菜单）" aria-label="荧光笔">
      <svg viewBox="0 0 24 24"><path d="m9 11-6 6v3h9l3-3"/><path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4"/></svg>
      <svg class="ink-tool-caret" viewBox="0 0 12 12" fill="none" stroke="currentColor"><path d="M2.5 4.5 6 8l3.5-3.5"/></svg>
      <span class="ink-tool-color-bar" style="background:#e29a19"></span>
    </button>
    <button type="button" data-ink-tool="shape" title="几何作图工具（坐标系 / 数轴 / 三角形 / 圆 / 矩形 / 箭头等）" aria-label="几何作图工具">
      <svg viewBox="0 0 24 24"><path d="M10.5 3.5a2 2 0 1 1 3 0L19 13.5a2 2 0 1 1-2 2.5H7a2 2 0 1 1-2-2.5l5.5-10z"/><circle cx="17.5" cy="18" r="2.5"/></svg>
      <svg class="ink-tool-caret" viewBox="0 0 12 12" fill="none" stroke="currentColor"><path d="M2.5 4.5 6 8l3.5-3.5"/></svg>
      <span class="ink-tool-color-bar" style="background:#d94040"></span>
    </button>
    <button type="button" data-ink-tool="eraser" title="橡皮擦" aria-label="橡皮擦">
      <svg viewBox="0 0 24 24"><path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"/><path d="M22 21H7"/><path d="m5 11 9 9"/></svg>
    </button>
  </div>

  <div class="ink-group ink-palette">
    <button type="button" class="ink-swatch selected" data-ink-color="#d94040" style="--swatch:#d94040" aria-label="红色" title="红色"></button>
    <button type="button" class="ink-swatch" data-ink-color="#384d8f" style="--swatch:#384d8f" aria-label="靛蓝" title="靛蓝"></button>
    <button type="button" class="ink-swatch" data-ink-color="#118575" style="--swatch:#118575" aria-label="绿色" title="绿色"></button>
    <button type="button" class="ink-swatch" data-ink-color="#252b37" style="--swatch:#252b37" aria-label="黑色" title="黑色"></button>
    <button type="button" class="ink-swatch" data-ink-color="#e29a19" style="--swatch:#e29a19" aria-label="橙色" title="橙色"></button>
    <button type="button" class="ink-swatch" data-ink-color="#9652ae" style="--swatch:#9652ae" aria-label="紫色" title="紫色"></button>
  </div>

  <!-- 二级调色与几何图形菜单 -->
  <div id="inkSubMenu" role="group" aria-label="几何图形、笔迹粗细与调色二级菜单">
    <div class="ink-shape-presets">
      <button type="button" class="ink-shape-btn selected" data-ink-shape="axes" title="平面直角坐标系 xOy（拖拽生成）" aria-label="坐标系">
        <svg viewBox="0 0 24 24"><line x1="2" y1="12" x2="21" y2="12"/><polyline points="17 8.5 21 12 17 15.5"/><line x1="12" y1="22" x2="12" y2="3"/><polyline points="8.5 7 12 3 15.5 7"/></svg>
      </button>
      <button type="button" class="ink-shape-btn" data-ink-shape="numberline" title="数轴（带原点0与刻度）" aria-label="数轴">
        <svg viewBox="0 0 24 24"><line x1="2" y1="13" x2="21" y2="13"/><polyline points="17 9 21 13 17 17"/><line x1="12" y1="9.5" x2="12" y2="16.5"/></svg>
      </button>
      <button type="button" class="ink-shape-btn" data-ink-shape="triangle" title="三角形 △" aria-label="三角形">
        <svg viewBox="0 0 24 24"><polygon points="12 4 3.5 19.5 20.5 19.5"/></svg>
      </button>
      <button type="button" class="ink-shape-btn" data-ink-shape="rttriangle" title="直角三角形 Rt△（带直角符号∟）" aria-label="直角三角形">
        <svg viewBox="0 0 24 24"><polygon points="4.5 4.5 4.5 19.5 20 19.5"/><polyline points="4.5 15 9 15 9 19.5"/></svg>
      </button>
      <button type="button" class="ink-shape-btn" data-ink-shape="circle" title="圆 / 椭圆 ○" aria-label="圆">
        <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/></svg>
      </button>
      <button type="button" class="ink-shape-btn" data-ink-shape="rect" title="矩形 / 正方形 □" aria-label="矩形">
        <svg viewBox="0 0 24 24"><rect x="4" y="5.5" width="16" height="13" rx="1.5"/></svg>
      </button>
      <button type="button" class="ink-shape-btn" data-ink-shape="line" title="直线段 / 虚线辅助线" aria-label="直线">
        <svg viewBox="0 0 24 24"><line x1="4" y1="19" x2="20" y2="5"/><circle cx="4" cy="19" r="1.6" fill="currentColor"/><circle cx="20" cy="5" r="1.6" fill="currentColor"/></svg>
      </button>
      <button type="button" class="ink-shape-btn" data-ink-shape="arrow" title="射线 / 箭头" aria-label="箭头">
        <svg viewBox="0 0 24 24"><line x1="4" y1="19" x2="20" y2="5"/><polyline points="13 5 20 5 20 12"/></svg>
      </button>
    </div>

    <div class="ink-stroke-presets">
      <button type="button" class="ink-stroke-btn" data-ink-dash="1" title="虚线批注 / 几何虚线辅助线" aria-label="虚线">
        <svg viewBox="0 0 32 16"><line x1="2" y1="8" x2="8" y2="8" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"/><line x1="13" y1="8" x2="19" y2="8" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"/><line x1="24" y1="8" x2="30" y2="8" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"/></svg>
      </button>
      <button type="button" class="ink-stroke-btn selected" data-ink-size="3" title="细笔迹 (3px)" aria-label="细">
        <svg viewBox="0 0 32 16"><line x1="4" y1="8" x2="28" y2="8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
      </button>
      <button type="button" class="ink-stroke-btn" data-ink-size="6" title="中等笔迹 (6px)" aria-label="中">
        <svg viewBox="0 0 32 16"><line x1="4" y1="8" x2="28" y2="8" stroke="currentColor" stroke-width="4.5" stroke-linecap="round"/></svg>
      </button>
      <button type="button" class="ink-stroke-btn" data-ink-size="10" title="粗笔迹 (10px)" aria-label="粗">
        <svg viewBox="0 0 32 16"><line x1="4" y1="8" x2="28" y2="8" stroke="currentColor" stroke-width="8" stroke-linecap="round"/></svg>
      </button>
    </div>
  </div>

  <div class="ink-group">
    <button id="inkUndo" type="button" title="撤销 (Ctrl+Z)" aria-label="撤销">
      <svg viewBox="0 0 24 24"><path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11"/></svg>
    </button>
    <button id="inkRedo" type="button" title="重做 (Ctrl+Y)" aria-label="重做">
      <svg viewBox="0 0 24 24"><path d="m15 14 5-5-5-5"/><path d="M20 9H9.5A5.5 5.5 0 0 0 4 14.5v0A5.5 5.5 0 0 0 9.5 20H13"/></svg>
    </button>
    <button id="inkClear" type="button" title="清空本题批注" aria-label="清空">
      <svg viewBox="0 0 24 24"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
    </button>
    <button type="button" onclick="toggleChalkboard()" title="沉浸黑板" aria-label="黑板">
      <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/></svg>
    </button>
  </div>
</section>

<!-- 灯箱模态 (小题原图与选项大图查看) -->
<div class="lightbox-modal" id="lightboxModal" onclick="closeLightbox(event)">
  <div class="lightbox-content">
    <div style="display:flex; justify-content:space-between; align-items:center;">
      <span style="font-weight:700; color:#0f172a; font-size:16px;" id="lightboxTitle">学生作答原图查看</span>
      <button style="border:none; background:none; font-size:22px; cursor:pointer; color:#64748b;" onclick="document.getElementById('lightboxModal').style.display='none'">×</button>
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
  const rosterArea = document.getElementById('viewRosterDashboard');
  const inlineSlices = document.getElementById('studentSlicesInlineSection');
  const drawer = document.getElementById('rightAnalyticsDrawer');
  const drawerTab = document.getElementById('drawerToggleTab');
  const stage = document.getElementById('mainStageContainer');

  if (mode === 'roster') {{
    qArea.style.display = 'none';
    rosterArea.style.display = 'block';
    drawer.classList.add('collapsed');
    drawerTab.classList.add('collapsed');
    stage.classList.add('drawer-collapsed');
    renderRosterDashboard();
  }} else if (mode === 'slices') {{
    qArea.style.display = 'block';
    rosterArea.style.display = 'none';
    inlineSlices.scrollIntoView({{ behavior: 'smooth' }});
  }} else {{
    qArea.style.display = 'block';
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

  // 3. 选项插槽渲染
  const optSlot = document.getElementById('optionsRenderSlot');
  const figSlot = document.getElementById('figureRenderSlot');
  optSlot.innerHTML = '';
  figSlot.innerHTML = '';

  if (currentQNum === 3) {{
    let html = '<div class="zhixue-options-row">';
    q.options.forEach(opt => {{
      html += `
        <div class="zhixue-option-item" onclick="filterOptionStudents('${{opt.label}}')">
          <span class="zhixue-option-label">${{opt.label}}.</span>
          <div class="zhixue-option-img-box">
            <img src="${{opt.img}}" alt="选项${{opt.label}}">
            <div class="zhixue-zoom-btn" title="放大预览" onclick="event.stopPropagation(); openLightbox('${{opt.img}}', '第3题 选项 ${{opt.label}} 坐标系高清图')">
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

  // 4. 渲染本题学生小题原图切片
  renderInlineStudentSlices(q);

  // 5. 更新右侧抽屉列表高亮与统计
  document.querySelectorAll('.drawer-nav-item').forEach(el => {{
    el.classList.toggle('active', el.id === 'drawerNavItem_' + currentQNum);
  }});
  renderDrawerStats(q);

  // 6. 重绘本题独立批注
  redrawCurrentInkPage();
}}

// 渲染学生小题作答原图切片
function renderInlineStudentSlices(q) {{
  const grid = document.getElementById('inlineSlicesGrid');
  const badge = document.getElementById('inlineSlicesErrorBadge');
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

// 点击学生名牌直接查看学生小题原图
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

  const sliceImg = "courseware_assets/accurate_" + tag + "_q" + qNum + ".png";
  openLightbox(sliceImg, stuName + " · 第" + qNum + "题精准小题作答原图（带老师红笔批注）");
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

// 隐私开关
function toggleStudentPrivacy() {{
  hidePrivacyNames = !hidePrivacyNames;
  document.getElementById('privacyHeaderTag').textContent = hidePrivacyNames ? '🔒 姓名已脱敏' : '🔓 姓名明文';
  loadQuestion(currentQNum);
  if (currentWorkMode === 'roster') renderRosterDashboard();
  showToast(hidePrivacyNames ? '已启用隐私保护，学生姓名已打码' : '已显示学生真实姓名');
}}

// 核心修复：抽屉折叠展开 (边缘悬浮挂耳永远保持可点)
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

// 渲染全班学情诊断大屏 (Visual Analytics Dashboard)
function renderRosterDashboard() {{
  // 1. 渲染 12 小题得分率柱状全景图
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

  // 2. 渲染全班 29 人卡片名册
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
      // 点击直接打开该生答卷原图
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
        <span>🔍 查看小题原卷 →</span>
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

// 全屏
function toggleFullScreen() {{
  if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(() => {{}});
  else if (document.exitFullscreen) document.exitFullscreen();
}}

// 灯箱大图
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

/* ================= 10. 用户原版批注工具 JS 驱动 (#penLayer + #inkToolbar) ================= */
let penOn = false;
let currentTool = 'pen';
let inkColor = '#d94040';
let inkSize = 3;
let isDashed = false;
let currentShape = 'axes';
let isCursorMode = false;
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

function togglePenMode() {{
  penOn = !penOn;
  canvas.classList.toggle('enabled', penOn && !isCursorMode);
  document.getElementById('inkToolbar').hidden = !penOn;
  document.getElementById('btnPenTrigger').classList.toggle('active', penOn);
  showToast(penOn ? '已开启批注工具' : '已退出批注');
}}

function toggleChalkboard() {{
  isChalkboard = !isChalkboard;
  document.getElementById('chalkboardOverlay').style.display = isChalkboard ? 'block' : 'none';
  showToast(isChalkboard ? '已开启全屏墨绿黑板' : '已返回试卷背景');
}}

// 批注工具栏事件监听
document.getElementById('inkToolbar').addEventListener('click', e => {{
  const btn = e.target.closest('button');
  if (!btn) return;

  // 1. 颜色选择
  if (btn.dataset.inkColor) {{
    inkColor = btn.dataset.inkColor;
    document.querySelectorAll('#inkToolbar .ink-swatch').forEach(s => s.classList.remove('selected'));
    btn.classList.add('selected');
    updateToolColorBars(inkColor);
    return;
  }}

  // 2. 主工具切换
  if (btn.dataset.inkTool) {{
    const tool = btn.dataset.inkTool;
    currentTool = tool;
    document.querySelectorAll('#inkToolbar [data-ink-tool]').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');

    if (tool === 'cursor') {{
      isCursorMode = true;
      canvas.classList.remove('enabled');
      document.getElementById('inkSubMenu').classList.remove('palette-open');
    }} else {{
      isCursorMode = false;
      canvas.classList.add('enabled');
      // 二级菜单联动
      if (tool === 'pen' || tool === 'highlight' || tool === 'shape') {{
        const sub = document.getElementById('inkSubMenu');
        sub.classList.toggle('palette-open');
        sub.classList.toggle('shape-mode', tool === 'shape');
      }} else {{
        document.getElementById('inkSubMenu').classList.remove('palette-open');
      }}
    }}
    return;
  }}

  // 3. 几何图形预设
  if (btn.dataset.inkShape) {{
    currentShape = btn.dataset.inkShape;
    document.querySelectorAll('.ink-shape-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    return;
  }}

  // 4. 笔画粗细 / 虚线预设
  if (btn.dataset.inkSize) {{
    inkSize = parseInt(btn.dataset.inkSize);
    document.querySelectorAll('.ink-stroke-btn[data-ink-size]').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    return;
  }}
  if (btn.dataset.inkDash !== undefined) {{
    isDashed = !isDashed;
    btn.classList.toggle('selected', isDashed);
    return;
  }}

  // 5. 撤销 / 重做 / 清空 / 退出
  if (btn.id === 'inkUndo') inkUndo();
  else if (btn.id === 'inkRedo') inkRedo();
  else if (btn.id === 'inkClear') clearPenInk();
  else if (btn.id === 'inkExit') togglePenMode();
  else if (btn.id === 'inkFold') {{
    document.getElementById('inkToolbar').classList.toggle('ink-simple');
  }}
}});

function updateToolColorBars(c) {{
  document.querySelectorAll('.ink-tool-color-bar').forEach(b => b.style.backgroundColor = c);
}}

function clearPenInk() {{
  strokesHistory[currentQNum] = [];
  redoStack[currentQNum] = [];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  showToast('已清空当前题批注');
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

  if (st.tool === 'shape') {{
    const p1 = st.points[0];
    const p2 = st.points[st.points.length - 1];
    drawGeometricShape(ctx, st.shape, p1, p2, st.color);
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

function drawGeometricShape(c, shape, p1, p2, color) {{
  const w = p2.x - p1.x;
  const h = p2.y - p1.y;

  if (shape === 'rect') {{
    c.strokeRect(p1.x, p1.y, w, h);
  }} else if (shape === 'circle') {{
    const r = Math.hypot(w, h);
    c.beginPath();
    c.arc(p1.x, p1.y, r, 0, Math.PI * 2);
    c.stroke();
  }} else if (shape === 'triangle') {{
    c.beginPath();
    c.moveTo(p1.x + w / 2, p1.y);
    c.lineTo(p1.x, p2.y);
    c.lineTo(p2.x, p2.y);
    c.closePath();
    c.stroke();
  }} else if (shape === 'rttriangle') {{
    c.beginPath();
    c.moveTo(p1.x, p1.y);
    c.lineTo(p1.x, p2.y);
    c.lineTo(p2.x, p2.y);
    c.closePath();
    c.stroke();
    // 直角符号
    const sz = 14;
    c.strokeRect(p1.x, p2.y - sz, sz, sz);
  }} else if (shape === 'line') {{
    c.beginPath();
    c.moveTo(p1.x, p1.y);
    c.lineTo(p2.x, p2.y);
    c.stroke();
  }} else if (shape === 'arrow') {{
    c.beginPath();
    c.moveTo(p1.x, p1.y);
    c.lineTo(p2.x, p2.y);
    c.stroke();
    const ang = Math.atan2(h, w);
    c.beginPath();
    c.moveTo(p2.x, p2.y);
    c.lineTo(p2.x - 16 * Math.cos(ang - Math.PI / 6), p2.y - 16 * Math.sin(ang - Math.PI / 6));
    c.lineTo(p2.x - 16 * Math.cos(ang + Math.PI / 6), p2.y - 16 * Math.sin(ang + Math.PI / 6));
    c.closePath();
    c.fillStyle = color;
    c.fill();
  }} else if (shape === 'axes') {{
    // 平面直角坐标系
    const cx = (p1.x + p2.x) / 2;
    const cy = (p1.y + p2.y) / 2;
    // x轴
    c.beginPath();
    c.moveTo(p1.x, cy);
    c.lineTo(p2.x, cy);
    c.stroke();
    // y轴
    c.beginPath();
    c.moveTo(cx, p2.y);
    c.lineTo(cx, p1.y);
    c.stroke();
  }}
}}

// 批注指针事件绑定
canvas.addEventListener('pointerdown', e => {{
  if (!penOn || isCursorMode) return;
  currentStroke = {{
    tool: currentTool,
    color: inkColor,
    width: inkSize,
    isDashed: isDashed,
    shape: currentShape,
    points: [{{ x: e.clientX, y: e.clientY }}]
  }};
}});

canvas.addEventListener('pointermove', e => {{
  if (!currentStroke) return;
  if (currentTool === 'eraser') {{
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
  if (currentStroke.points.length > 0 && currentTool !== 'eraser') {{
    if (!strokesHistory[currentQNum]) strokesHistory[currentQNum] = [];
    strokesHistory[currentQNum].push(currentStroke);
    redoStack[currentQNum] = [];
  }}
  currentStroke = null;
  redrawCurrentInkPage();
}});

// 键盘快捷键 (←/→翻题，F全屏，P批注，B黑板，Esc光标)
window.addEventListener('keydown', e => {{
  if (e.key === 'ArrowLeft') prevQuestion();
  else if (e.key === 'ArrowRight') nextQuestion();
  else if (e.key === 'f' || e.key === 'F') toggleFullScreen();
  else if (e.key === 'p' || e.key === 'P') togglePenMode();
  else if (e.key === 'b' || e.key === 'B') toggleChalkboard();
  else if (e.key === 'Escape') {{
    document.getElementById('lightboxModal').style.display = 'none';
    if (penOn) {{
      isCursorMode = true;
      canvas.classList.remove('enabled');
    }}
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

    print(f"Generated successfully!\n- {out_file1}\n- {out_file2}")

if __name__ == '__main__':
    generate_v2()

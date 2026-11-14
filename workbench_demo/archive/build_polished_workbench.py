#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
生成符合 1:1 智学网讲评模式界面 + 高规格交互式课件标准的 "One·ai 讲评工作台"
"""

import json
import os

def build_workbench_html():
    # 读取原始数据库
    with open('/Users/xionghaoran/数学交互式课件/courseware_assets/exam_database.json', 'r', encoding='utf-8') as f:
        exam_db = json.load(f)

    # 读取学生成绩汇总
    with open('/Users/xionghaoran/数学交互式课件/courseware_assets/students_summary.json', 'r', encoding='utf-8') as f:
        students_summary = json.load(f)

    # 完善第 3 题的选项配图
    if '3' in exam_db:
        exam_db['3']['options'][0]['img'] = 'courseware_assets/q3_opt_A.png'
        exam_db['3']['options'][1]['img'] = 'courseware_assets/q3_opt_B.png'
        exam_db['3']['options'][2]['img'] = 'courseware_assets/q3_opt_C.png'
        exam_db['3']['options'][3]['img'] = 'courseware_assets/q3_opt_D.png'

    # 完善其他大题的题干配图
    if '7' in exam_db:
        exam_db['7']['figure'] = 'courseware_assets/q7_figure.png'
    if '10' in exam_db:
        exam_db['10']['figure'] = 'courseware_assets/q10_figure.png'
        exam_db['10']['ansFigure'] = 'courseware_assets/q10_ans_figure.png'
    if '11' in exam_db:
        exam_db['11']['figure'] = 'courseware_assets/q11_figure.png'
    if '12' in exam_db:
        exam_db['12']['figure'] = 'courseware_assets/q12_figure.png'

    db_json_str = json.dumps(exam_db, ensure_ascii=False)
    students_json_str = json.dumps(students_summary, ensure_ascii=False)

    html_content = f"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>One·ai 讲评工作台 · 《A+&A层2.1 认识反比例函数》</title>
<style>
/* ================= 全局重置与系统主题 ================= */
:root {{
  --zhixue-teal: #00bfa5;
  --zhixue-teal-dark: #009688;
  --zhixue-teal-light: #e6fffb;
  --zhixue-blue: #1890ff;
  --zhixue-blue-light: #e6f7ff;
  --zhixue-red: #ff4d4f;
  --zhixue-red-light: #fff1f0;
  --zhixue-green: #52c41a;
  --zhixue-green-light: #f6ffed;
  --zhixue-text-main: #262626;
  --zhixue-text-sub: #595959;
  --zhixue-text-muted: #8c8c8c;
  --zhixue-border: #e8e8e8;
  --zhixue-bg: #f8fafc;
  --toolbar-bg: #293444;
  --chalkboard-bg: #143022;
  --math-font: "Times New Roman", Times, Georgia, serif;
}}

* {{
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  -webkit-font-smoothing: antialiased;
}}

body, html {{
  width: 100%;
  height: 100%;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
  color: var(--zhixue-text-main);
  background-color: #ffffff;
  user-select: none;
}}

#app {{
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background-color: #ffffff;
}}

/* ================= 顶部品牌与多模态讲评切换栏 ================= */
.top-header {{
  height: 52px;
  background: #ffffff;
  border-bottom: 1px solid var(--zhixue-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  z-index: 100;
  box-shadow: 0 1px 4px rgba(0,0,0,0.03);
}}

.header-left {{
  display: flex;
  align-items: center;
  gap: 14px;
}}

.brand-badge {{
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 800;
  font-size: 17px;
  color: #1e293b;
  letter-spacing: -0.2px;
}}

.brand-logo-icon {{
  width: 28px;
  height: 28px;
  border-radius: 7px;
  background: linear-gradient(135deg, #00bfa5 0%, #1890ff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-weight: 900;
  font-size: 15px;
  box-shadow: 0 2px 8px rgba(0, 191, 165, 0.35);
}}

.course-title-tag {{
  background: var(--zhixue-teal-light);
  color: var(--zhixue-teal-dark);
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  border: 1px solid #b5f5ec;
  display: flex;
  align-items: center;
  gap: 6px;
}}

.header-center {{
  display: flex;
  align-items: center;
  gap: 8px;
}}

.mode-tab {{
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 13.5px;
  cursor: pointer;
  transition: all 0.2s;
  color: var(--zhixue-text-sub);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 5px;
}}

.mode-tab:hover {{
  background: #f1f5f9;
  color: var(--zhixue-text-main);
}}

.mode-tab.active {{
  background: var(--zhixue-teal-light);
  color: var(--zhixue-teal);
  font-weight: 700;
  border: 1px solid #b5f5ec;
}}

.header-right {{
  display: flex;
  align-items: center;
  gap: 12px;
}}

.btn-header {{
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 12px;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  border: 1px solid var(--zhixue-border);
  background: #ffffff;
  color: var(--zhixue-text-sub);
  transition: all 0.15s;
}}

.btn-header:hover {{
  border-color: var(--zhixue-teal);
  color: var(--zhixue-teal);
}}

/* ================= 核心工作台视区 ================= */
.main-workspace {{
  flex: 1;
  display: flex;
  position: relative;
  overflow: hidden;
  background-color: #ffffff;
}}

/* 左侧主讲台 (题目呈现 / 讲题画板 / 真实卷面对比) */
.stage-container {{
  flex: 1;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 30px 48px 120px 48px;
  position: relative;
  transition: margin-right 0.25s cubic-bezier(0.2, 0, 0, 1);
}}

/* 题目标题与元信息 (1:1 智学网排版) */
.zhixue-q-meta-row {{
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 24px;
}}

.zhixue-q-tag {{
  background: var(--zhixue-teal);
  color: #ffffff;
  font-size: 14px;
  font-weight: 700;
  padding: 3px 9px;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}}

.zhixue-q-type {{
  color: var(--zhixue-text-muted);
  font-size: 14.5px;
}}

.zhixue-q-divider {{
  color: #d9d9d9;
  font-size: 14px;
  margin: 0 2px;
}}

.zhixue-q-rate {{
  color: var(--zhixue-text-muted);
  font-size: 14.5px;
}}

.zhixue-q-rate.low {{
  color: var(--zhixue-red);
  font-weight: 600;
}}

/* 题干文本规范与排版 */
.zhixue-q-stem {{
  font-size: 18.5px;
  line-height: 1.8;
  color: #1f2937;
  margin-bottom: 28px;
  font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Songti SC", "SimSun", serif;
}}

/* 数学公式内联排版规范 */
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
  border-bottom: 1.2px solid currentColor;
  padding-bottom: 2px;
}}

span.m-bot {{
  padding-top: 2px;
}}

/* ================= 智学网选择题选项呈现 (横向单排 4 选项 + 放大镜) ================= */
.zhixue-options-row {{
  display: flex;
  align-items: flex-start;
  gap: 28px;
  margin-top: 10px;
  flex-wrap: wrap;
}}

.zhixue-option-item {{
  display: flex;
  align-items: flex-start;
  gap: 10px;
  cursor: pointer;
  border-radius: 8px;
  padding: 8px;
  transition: all 0.2s;
}}

.zhixue-option-item:hover {{
  background: #f8fafc;
}}

.zhixue-option-label {{
  font-family: var(--math-font);
  font-size: 20px;
  font-weight: bold;
  color: #1e293b;
  margin-top: 2px;
}}

.zhixue-option-img-box {{
  position: relative;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: #ffffff;
  padding: 6px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.03);
  display: flex;
  align-items: center;
  justify-content: center;
}}

.zhixue-option-img-box img {{
  display: block;
  max-width: 210px;
  max-height: 190px;
  object-fit: contain;
}}

.zhixue-zoom-btn {{
  position: absolute;
  top: 4px;
  left: 4px;
  width: 22px;
  height: 22px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid #cbd5e1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  cursor: pointer;
  transition: all 0.15s;
}}

.zhixue-zoom-btn:hover {{
  background: #ffffff;
  color: var(--zhixue-teal);
  border-color: var(--zhixue-teal);
}}

/* 常规文字选项 (A, B, C, D) */
.zhixue-text-options-grid {{
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  max-width: 720px;
}}

.zhixue-text-option-card {{
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  padding: 14px 18px;
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

/* 填空题与解答题配图排版 */
.zhixue-figure-container {{
  margin: 16px 0 24px 0;
  display: inline-flex;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 8px;
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  position: relative;
}}

.zhixue-figure-container img {{
  max-width: 380px;
  max-height: 260px;
  display: block;
}}

/* ================= 模式 2：讲题画板 (Polya 4步启发式分步推导 Layout B) ================= */
.polya-board-view {{
  display: none;
  width: 100%;
}}

.polya-layout-b {{
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 28px;
  align-items: flex-start;
}}

/* 左栏：步骤流卡片与控制 */
.polya-step-column {{
  display: flex;
  flex-direction: column;
  gap: 16px;
}}

.polya-step-header-bar {{
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f1f5f9;
  padding: 10px 16px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}}

.polya-step-card {{
  background: #ffffff;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  padding: 18px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
  animation: fadeInStep 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}}

@keyframes fadeInStep {{
  from {{ opacity: 0; transform: translateY(8px); }}
  to {{ opacity: 1; transform: translateY(0); }}
}}

.polya-step-card-header {{
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}}

.polya-step-tag {{
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 700;
  background: #eff6ff;
  color: #2563eb;
  border: 1px solid #bfdbfe;
}}

.polya-step-title {{
  font-size: 15.5px;
  font-weight: 700;
  color: #0f172a;
}}

.polya-step-body {{
  font-size: 15px;
  line-height: 1.8;
  color: #334155;
}}

/* 右栏：动态数学矢量坐标系 */
.polya-canvas-column {{
  background: #ffffff;
  border: 1.5px solid #cbd5e1;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 14px rgba(0,0,0,0.04);
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 440px;
}}

.polya-svg-wrap {{
  width: 100%;
  height: 380px;
  display: flex;
  align-items: center;
  justify-content: center;
}}

.polya-svg-wrap svg {{
  width: 100%;
  height: 100%;
}}

/* ================= 模式 3：真实卷面切片对比 (陈沛林满分卷 vs 沙兴远失分卷) ================= */
.slices-compare-view {{
  display: none;
  width: 100%;
}}

.slices-alert-banner {{
  background: #eff6ff;
  border-left: 4px solid #2563eb;
  padding: 12px 18px;
  border-radius: 0 8px 8px 0;
  font-size: 14px;
  color: #1e40af;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}}

.slices-grid-container {{
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
  gap: 20px;
}}

.slice-paper-card {{
  background: #ffffff;
  border-radius: 10px;
  border: 1.5px solid #e2e8f0;
  padding: 14px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.04);
  display: flex;
  flex-direction: column;
  gap: 10px;
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
  font-size: 15px;
  font-weight: 800;
  color: #0f172a;
}}

.slice-status-badge {{
  padding: 3px 9px;
  border-radius: 4px;
  font-size: 12px;
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
}}

.slice-img-wrapper img {{
  width: 100%;
  height: auto;
  display: block;
}}

/* ================= 右侧智学网风格抽屉 (试题分析与作答统计) ================= */
.zhixue-right-drawer {{
  width: 380px;
  height: calc(100% - 20px);
  margin: 10px 10px 10px 0;
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: -4px 0 20px rgba(0,0,0,0.06);
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 90;
  transition: transform 0.28s cubic-bezier(0.2, 0, 0, 1), margin-right 0.28s cubic-bezier(0.2, 0, 0, 1);
}}

.zhixue-right-drawer.collapsed {{
  transform: translateX(390px);
  margin-right: -380px;
}}

.drawer-collapse-btn {{
  position: absolute;
  top: 50%;
  left: -24px;
  transform: translateY(-50%);
  width: 24px;
  height: 56px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-right: none;
  border-radius: 8px 0 0 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #64748b;
  box-shadow: -3px 0 8px rgba(0,0,0,0.05);
  transition: all 0.15s;
}}

.drawer-collapse-btn:hover {{
  color: var(--zhixue-teal);
}}

/* 抽屉头部 */
.drawer-header {{
  height: 48px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 8px;
}}

.drawer-brand-icon {{
  width: 18px;
  height: 18px;
  display: inline-block;
}}

.drawer-header-title {{
  font-size: 15px;
  font-weight: 700;
  color: #262626;
}}

/* 抽屉主体：左题目列表 + 右本题统计 */
.drawer-body {{
  flex: 1;
  display: flex;
  overflow: hidden;
}}

/* 左子列：题目列表导航 (选择/填空/解答) */
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
  font-weight: 500;
}}

.drawer-nav-item {{
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 10px;
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

.drawer-nav-item .q-num-label {{
  font-weight: 600;
}}

.drawer-nav-item .q-rate-label {{
  font-size: 12px;
  color: #52c41a;
}}

.drawer-nav-item .q-rate-label.low {{
  color: #ff4d4f;
  font-weight: 700;
}}

.drawer-nav-item .q-sub-badge {{
  background: #fa8c16;
  color: #fff;
  font-size: 10px;
  padding: 1px 5px;
  border-radius: 10px;
  font-weight: bold;
}}

.drawer-nav-footer {{
  height: 42px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
  background: #ffffff;
}}

.drawer-sort-btn {{
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #595959;
  cursor: pointer;
  border: none;
  background: none;
}}

.drawer-sort-btn:hover {{
  color: var(--zhixue-teal);
}}

/* 右子列：本题作答统计 */
.drawer-q-stats {{
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 14px 16px;
  overflow-y: auto;
}}

.stats-title {{
  font-size: 15px;
  font-weight: 700;
  color: #262626;
  margin-bottom: 12px;
}}

.stats-badges-row {{
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 18px;
}}

.stats-badge-pill {{
  font-size: 12px;
  padding: 3px 8px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
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

/* 选项作答柱状图 (1:1 智学网选项分布) */
.options-stat-list {{
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 20px;
}}

.option-stat-row {{
  display: flex;
  flex-direction: column;
  gap: 5px;
  cursor: pointer;
  padding: 4px 6px;
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

.option-stat-label {{
  font-weight: 700;
  color: #262626;
  display: flex;
  align-items: center;
  gap: 6px;
}}

.option-stat-count {{
  color: #8c8c8c;
  font-size: 12.5px;
}}

.option-bar-bg {{
  width: 100%;
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}}

.option-bar-fill {{
  height: 100%;
  border-radius: 4px;
  transition: width 0.4s ease;
}}

.option-bar-fill.correct {{
  background: #52c41a;
}}

.option-bar-fill.wrong {{
  background: #ff7875;
}}

/* 答错/对应学生名单卡片 */
.stats-students-card {{
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 10px 12px;
  background: #fafafa;
  margin-top: 8px;
}}

.stats-students-title {{
  font-size: 12.5px;
  font-weight: 700;
  color: #475569;
  margin-bottom: 8px;
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
  padding: 2px 7px;
  border-radius: 4px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  color: #334155;
}}

.stu-chip.wrong {{
  background: #fff1f0;
  border-color: #ffa39e;
  color: #cf1322;
}}

/* ================= 底部核心工具区 (黑底胶囊批注栏 + 浅底导航栏) ================= */
/* 批注工具黑底悬浮胶囊栏 (1:1 原版智学网批注层) */
.zhixue-floating-ink-bar {{
  position: fixed;
  bottom: 24px;
  left: 36%;
  transform: translateX(-50%);
  background: var(--toolbar-bg);
  height: 48px;
  border-radius: 28px;
  display: flex;
  align-items: center;
  padding: 0 14px;
  gap: 4px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.28);
  z-index: 1000;
  border: 1px solid rgba(255, 255, 255, 0.12);
}}

.ink-btn {{
  display: flex;
  align-items: center;
  gap: 6px;
  color: #cbd5e1;
  font-size: 13.5px;
  padding: 6px 14px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.15s;
  border: none;
  background: none;
}}

.ink-btn:hover {{
  color: #ffffff;
  background: rgba(255, 255, 255, 0.1);
}}

.ink-btn.active {{
  background: var(--zhixue-teal);
  color: #ffffff;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(0, 191, 165, 0.4);
}}

.ink-divider {{
  width: 1px;
  height: 20px;
  background: rgba(255, 255, 255, 0.15);
  margin: 0 4px;
}}

/* 批注二级子菜单浮层 (颜色/粗细/图形/荧光笔) */
.ink-sub-menu {{
  position: fixed;
  bottom: 80px;
  left: 36%;
  transform: translateX(-50%);
  background: #ffffff;
  border-radius: 12px;
  padding: 10px 16px;
  display: none;
  align-items: center;
  gap: 16px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
  border: 1px solid #e2e8f0;
  z-index: 1001;
}}

.ink-sub-menu.visible {{
  display: flex;
}}

.sub-color-circle {{
  width: 22px;
  height: 22px;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid transparent;
  transition: transform 0.15s;
}}

.sub-color-circle.active {{
  border-color: #0f172a;
  transform: scale(1.18);
}}

.sub-width-pill {{
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  border: 1px solid #cbd5e1;
}}

.sub-width-pill.active {{
  background: #0f172a;
  color: #ffffff;
  border-color: #0f172a;
}}

/* 底部右侧控制操作栏 (上一题/第3题/下一题 + 隐藏姓名/更多/解析/缩放/对比/全屏) */
.bottom-right-dock {{
  position: fixed;
  bottom: 14px;
  right: 24px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  z-index: 80;
}}

.nav-buttons-row {{
  display: flex;
  align-items: center;
  gap: 6px;
}}

.btn-nav {{
  background: #ffffff;
  border: 1px solid var(--zhixue-border);
  color: #475569;
  font-size: 13px;
  padding: 5px 12px;
  border-radius: 6px;
  cursor: pointer;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  transition: all 0.15s;
}}

.btn-nav:hover {{
  color: var(--zhixue-teal);
  border-color: var(--zhixue-teal);
}}

.btn-nav.current-badge {{
  font-weight: 700;
  color: var(--zhixue-teal);
  background: var(--zhixue-teal-light);
  border-color: #b5f5ec;
}}

.action-tools-row {{
  display: flex;
  align-items: center;
  gap: 14px;
  color: #595959;
  font-size: 13px;
}}

.action-tool-item {{
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: color 0.15s;
}}

.action-tool-item:hover {{
  color: var(--zhixue-teal);
}}

.action-tool-item.active {{
  color: var(--zhixue-teal);
  font-weight: 600;
}}

/* ================= 批注透明画板 Canvas ================= */
#penCanvas {{
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 800;
}}

#penCanvas.drawing-active {{
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

/* ================= 弹窗模态层 (大图预览 / 全班总览) ================= */
.modal-overlay {{
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  display: none;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  backdrop-filter: blur(4px);
}}

.modal-content-card {{
  background: #ffffff;
  border-radius: 12px;
  max-width: 900px;
  width: 90%;
  max-height: 85vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 40px rgba(0,0,0,0.25);
}}

.modal-header {{
  height: 52px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}}

.modal-title {{
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
}}

.modal-close-btn {{
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #64748b;
}}

.modal-body {{
  padding: 20px;
  overflow-y: auto;
}}

/* 全班排名表格 */
.table-roster {{
  width: 100%;
  border-collapse: collapse;
  font-size: 13.5px;
}}

.table-roster th {{
  background: #f8fafc;
  color: #475569;
  text-align: left;
  padding: 10px 14px;
  border-bottom: 1.5px solid #e2e8f0;
}}

.table-roster td {{
  padding: 10px 14px;
  border-bottom: 1px solid #f1f5f9;
}}

.rank-badge {{
  font-weight: 800;
  color: var(--zhixue-teal);
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
  box-shadow: 0 4px 14px rgba(0,0,0,0.15);
}}
</style>
</head>
<body>

<div id="app">
  <!-- 顶部 One·ai 讲评工作台品牌与模式栏 -->
  <header class="top-header">
    <div class="header-left">
      <div class="brand-badge">
        <div class="brand-logo-icon">1</div>
        <span>One·ai 讲评工作台</span>
      </div>
      <div class="course-title-tag">
        <span>九年级数学6班 · 《2.1 认识反比例函数》</span>
        <span style="color:#009688; font-weight:bold;">均分45.2 / 56</span>
      </div>
    </div>

    <!-- 顶部主模式切换 -->
    <div class="header-center">
      <div class="mode-tab active" id="tabModeZhixue" onclick="switchMainView('zhixue')">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
        <span>📌 原题呈现 (智学模式)</span>
      </div>
      <div class="mode-tab" id="tabModePolya" onclick="switchMainView('polya')">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
        <span>📑 讲题画板 (分步推导)</span>
      </div>
      <div class="mode-tab" id="tabModeSlices" onclick="switchMainView('slices')">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
        <span>📝 真实卷面切片对比</span>
      </div>
      <div class="mode-tab" id="tabModeRoster" onclick="openRosterModal()">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        <span>📊 全班学情总览</span>
      </div>
    </div>

    <div class="header-right">
      <button class="btn-header" onclick="toggleStudentPrivacy()">
        <span id="headerPrivacyTxt">🔒 姓名已脱敏</span>
      </button>
      <button class="btn-header" onclick="toggleFullScreen()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
        <span>全屏</span>
      </button>
    </div>
  </header>

  <!-- 主体工作区 -->
  <main class="main-workspace">
    <!-- 主舞台内容区 -->
    <section class="stage-container" id="mainStageContainer">
      <!-- 智学网原生原题视区 -->
      <div id="viewZhixueStem">
        <!-- 题目元信息 (第3题 选择题 | 得分率89.7%) -->
        <div class="zhixue-q-meta-row">
          <span class="zhixue-q-tag" id="qTagNum">第3题</span>
          <span class="zhixue-q-type" id="qTagType">选择题</span>
          <span class="zhixue-q-divider">|</span>
          <span class="zhixue-q-rate" id="qTagRate">得分率89.7%</span>
        </div>

        <!-- 题干文本 -->
        <div class="zhixue-q-stem" id="qStemContent">
          一次函数<i class="m">y</i>=<i class="m">ax</i>+1 与反比例函数<i class="m">y</i>=-<span class="m-frac"><span class="m-top"><i class="m">a</i></span><span class="m-bot"><i class="m">x</i></span></span> 在同一坐标系中的大致图象是（　）
        </div>

        <!-- 选项展示容器 (选择题特有) -->
        <div id="optionsRenderSlot">
          <!-- 动态渲染：第3题呈现 4 坐标系配图选项；其他选择题呈现文字选项 -->
        </div>

        <!-- 几何题干配图展示 (填空/解答题特有) -->
        <div id="figureRenderSlot"></div>
      </div>

      <!-- 模式 2：Polya 4步启发式零剧透分步推导画板 -->
      <div class="polya-board-view" id="viewPolyaBoard">
        <div class="polya-layout-b">
          <!-- 左侧卡片步骤流 -->
          <div class="polya-step-column">
            <div class="polya-step-header-bar">
              <span style="font-weight:700; color:#1e293b; font-size:14px;">波利亚思维拆解卡片 (Zero-Spoiler)</span>
              <div style="display:flex; gap:8px;">
                <button class="btn-nav" onclick="resetPolyaSteps()">↺ 重置</button>
                <button class="btn-nav current-badge" onclick="nextPolyaStep()">▶ 下一步 (Space)</button>
              </div>
            </div>
            <div id="polyaStepsFlowContainer" style="display:flex; flex-direction:column; gap:14px;">
              <!-- 动态注入分步卡片 -->
            </div>
          </div>

          <!-- 右侧交互式 SVG 直角坐标图示 -->
          <div class="polya-canvas-column">
            <div style="width:100%; display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
              <span style="font-size:14.5px; font-weight:700; color:#0f172a;">📐 动态几何与函数坐标分析</span>
              <span id="polyaStepIndicator" style="font-size:12px; color:#64748b;">步骤 1/3</span>
            </div>
            <div class="polya-svg-wrap" id="polyaDynamicSvgContainer">
              <!-- 动态 SVG -->
            </div>
          </div>
        </div>
      </div>

      <!-- 模式 3：真实学生卷面切片对比 -->
      <div class="slices-compare-view" id="viewSlicesCompare">
        <div class="slices-alert-banner">
          <span>🌟 <b>真实作业切片诊断</b>：左侧满分卷规范对标，右侧失分卷红笔批注错因分析</span>
          <span id="slicesErrorCountBadge" style="font-weight:700; color:#dc2626;">失分人数：18人</span>
        </div>
        <div class="slices-grid-container" id="slicesGridSlot">
          <!-- 动态注入满分切片与失分切片 -->
        </div>
      </div>
    </section>

    <!-- 右侧智学网风格抽屉 (试题分析与作答统计) -->
    <aside class="zhixue-right-drawer" id="rightAnalyticsDrawer">
      <!-- 展开收起按钮 -->
      <div class="drawer-collapse-btn" onclick="toggleDrawer()">
        <svg id="drawerArrowIcon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
      </div>

      <!-- 抽屉顶部标题 -->
      <div class="drawer-header">
        <svg class="drawer-brand-icon" viewBox="0 0 24 24">
          <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5" fill="#00bfa5"/>
          <polygon points="12 2 22 8.5 12 12" fill="#1890ff"/>
          <polygon points="12 12 22 15.5 12 22" fill="#fa8c16"/>
        </svg>
        <span class="drawer-header-title">试题分析 (共 12 题)</span>
      </div>

      <!-- 抽屉双列主体 -->
      <div class="drawer-body">
        <!-- 左侧题目列表导航 -->
        <div class="drawer-q-nav">
          <div class="drawer-q-nav-scroll" id="drawerQNavList">
            <!-- 动态生成 12 题目录 -->
          </div>
          <div class="drawer-nav-footer">
            <button class="drawer-sort-btn" onclick="toggleSortMode()">
              <span>题号</span>
              <span style="color:#00bfa5; font-weight:bold;">得分率 ⇅</span>
            </button>
          </div>
        </div>

        <!-- 右侧本题作答统计 -->
        <div class="drawer-q-stats">
          <div class="stats-title" id="statsTitle">第3题作答统计</div>
          <div class="stats-badges-row">
            <span class="stats-badge-pill class" id="statsClassRate">班级 得分率89.7%</span>
            <span class="stats-badge-pill grade" id="statsGradeRate">年级 得分率81.7%</span>
          </div>

          <!-- 选项分布柱状图 -->
          <div class="options-stat-list" id="statsOptionsList">
            <!-- 动态注入选项 A, B, C, D 比例 -->
          </div>

          <!-- 学生作答详情名牌 -->
          <div class="stats-students-card">
            <div class="stats-students-title">
              <span id="statsStuHeaderTitle">失分/选择该项学生名单</span>
              <span id="statsStuCountBadge" style="color:#ff4d4f; font-weight:bold;">3人</span>
            </div>
            <div class="student-chips-flow" id="statsStuChipsContainer">
              <!-- 动态名牌 -->
            </div>
          </div>
        </div>
      </div>
    </aside>
  </main>

  <!-- 批注透明画板 Canvas 与黑板背景 -->
  <div id="chalkboardOverlay"></div>
  <canvas id="penCanvas"></canvas>

  <!-- 批注二级子菜单 (颜色/粗细/图形/荧光笔) -->
  <div class="ink-sub-menu" id="inkSubMenu">
    <div style="display:flex; align-items:center; gap:8px;">
      <div class="sub-color-circle active" style="background:#ef4444;" onclick="setInkColor('#ef4444')"></div>
      <div class="sub-color-circle" style="background:#2563eb;" onclick="setInkColor('#2563eb')"></div>
      <div class="sub-color-circle" style="background:#00bfa5;" onclick="setInkColor('#00bfa5')"></div>
      <div class="sub-color-circle" style="background:#faad14;" onclick="setInkColor('#faad14')"></div>
      <div class="sub-color-circle" style="background:#0f172a;" onclick="setInkColor('#0f172a')"></div>
    </div>
    <div class="ink-divider" style="background:#cbd5e1; height:18px;"></div>
    <div style="display:flex; align-items:center; gap:6px;">
      <span class="sub-width-pill active" onclick="setInkWidth(2)">细 2px</span>
      <span class="sub-width-pill" onclick="setInkWidth(5)">中 5px</span>
      <span class="sub-width-pill" onclick="setInkWidth(9)">粗 9px</span>
    </div>
    <div class="ink-divider" style="background:#cbd5e1; height:18px;"></div>
    <div style="display:flex; align-items:center; gap:6px;">
      <span class="sub-width-pill active" id="btnModePen" onclick="setInkMode('pen')">铅笔</span>
      <span class="sub-width-pill" id="btnModeHighlighter" onclick="setInkMode('highlighter')">荧光笔</span>
      <span class="sub-width-pill" id="btnModeArrow" onclick="setInkMode('arrow')">箭头</span>
      <span class="sub-width-pill" id="btnModeRect" onclick="setInkMode('rect')">矩形</span>
    </div>
  </div>

  <!-- 批注工具黑底悬浮胶囊栏 (1:1 智学网底部批注条) -->
  <div class="zhixue-floating-ink-bar" id="floatingInkBar">
    <button class="ink-btn active" id="toolSelect" onclick="selectInkTool('select')">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/><path d="M13 13l6 6"/></svg>
      <span>选择</span>
    </button>
    <button class="ink-btn" id="toolPen" onclick="selectInkTool('pen')">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/></svg>
      <span>画笔</span>
    </button>
    <button class="ink-btn" id="toolEraser" onclick="selectInkTool('eraser')">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M20 20H7L3 16C2 15 2 13 3 12L13 2L22 11L20 20Z"/></svg>
      <span>板擦</span>
    </button>
    <button class="ink-btn" onclick="clearPenInk()">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
      <span>清空</span>
    </button>
    <button class="ink-btn" onclick="toggleChalkboard()">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
      <span>背景</span>
    </button>
    <div class="ink-divider"></div>
    <button class="ink-btn" onclick="inkUndo()">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M9 14L4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11"/></svg>
      <span>撤销</span>
    </button>
    <button class="ink-btn" onclick="inkRedo()">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M15 14l5-5-5-5"/><path d="M20 9H9.5A5.5 5.5 0 0 0 4 14.5v0A5.5 5.5 0 0 0 9.5 20H13"/></svg>
      <span>恢复</span>
    </button>
  </div>

  <!-- 底部右侧控制操作栏 (上一题/第3题/下一题 + 隐藏姓名/更多/解析/缩放/对比/全屏) -->
  <div class="bottom-right-dock">
    <div class="nav-buttons-row">
      <button class="btn-nav" onclick="prevQuestion()">上一题</button>
      <button class="btn-nav current-badge" id="btnNavCurrentBadge" onclick="toggleDrawer()">第3题 ▾</button>
      <button class="btn-nav" onclick="nextQuestion()">下一题</button>
    </div>
    <div class="action-tools-row">
      <div class="action-tool-item" id="toolTogglePrivacy" onclick="toggleStudentPrivacy()">
        <span id="privacyCheckIcon">☑</span>
        <span>隐藏姓名</span>
      </div>
      <div class="action-tool-item" onclick="showToast('正在调取智能学情推荐...')">更多</div>
      <div class="action-tool-item" onclick="switchMainView('polya')">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
        <span>答案解析</span>
      </div>
      <div class="action-tool-item" onclick="zoomStage(-0.1)">缩小</div>
      <div class="action-tool-item" onclick="zoomStage(0)">整体 ▾</div>
      <div class="action-tool-item" onclick="zoomStage(0.1)">放大</div>
      <div class="action-tool-item" onclick="showToast('已加载道远学校校本同类变式题组')">同类题</div>
      <div class="action-tool-item" id="btnToolContrast" onclick="switchMainView('slices')">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="3" x2="12" y2="21"/></svg>
        <span>对比讲评</span>
      </div>
      <div class="action-tool-item" onclick="toggleFullScreen()">全屏</div>
      <div class="action-tool-item" onclick="showToast('已安全退出工作台')">退出</div>
    </div>
  </div>
</div>

<!-- 弹窗模态：大图预览与全班总览 -->
<div class="modal-overlay" id="generalModalOverlay" onclick="closeModalOnBg(event)">
  <div class="modal-content-card" id="modalCard">
    <div class="modal-header">
      <span class="modal-title" id="modalTitle">全班作答总览</span>
      <button class="modal-close-btn" onclick="closeModal()">×</button>
    </div>
    <div class="modal-body" id="modalBody"></div>
  </div>
</div>

<div id="toastMsg">提示</div>

<!-- ================= 交互核心 JS 驱动 ================= -->
<script>
const examDatabase = {db_json_str};
const studentsSummary = {students_json_str};

let currentQNum = 3;
let currentMainMode = 'zhixue'; // 'zhixue', 'polya', 'slices'
let hidePrivacyNames = true;
let isDrawerOpen = true;
let sortAscending = false;
let currentPolyaStep = 0;
let currentZoom = 1.0;

// 波利亚 4 步思维拆解数据 (符合 Zero-Spoiler 规范)
const polyaStepsData = {{
  3: [
    {{
      tag: "审题定位",
      title: "从一次函数的截距切入，直接排除矛盾选项",
      body: "一次函数解析式为 <i class='m'>y</i> = <i class='m'>ax</i> + 1。<br>• 纵截距为常数项 <span class='m-num'>1 &gt; 0</span>，直线与 <i class='m'>y</i> 轴交点必为 <span class='m-num'>(0, 1)</span>，位于 <i class='m'>y</i> 轴<b>正半轴</b>。<br>观察四个选项：选项 A 与选项 C 的直线均交于 <i class='m'>y</i> 轴负半轴，<b>直接秒杀排除 A、C！</b>"
    }},
    {{
      tag: "分号讨论",
      title: "针对一次项系数 a 正负进行双曲线位置一致性验证",
      body: "剩余 B、D 选项中，直线的交点都在 <i class='m'>y</i> 轴正半轴，且直线均由左向右下降，即斜率 <i class='m'>a</i> &lt; 0！<br>• 当 <i class='m'>a</i> &lt; 0 时，反比例函数解析式 <i class='m'>y</i> = -<span class='m-frac'><span class='m-top'><i class='m'>a</i></span><span class='m-bot'><i class='m'>x</i></span></span> 中，比例系数 <i class='m'>k</i> = -<i class='m'>a</i> &gt; 0！<br>• 比例系数大于 0 时，双曲线两支必分布在<b>第一、三象限</b>！"
    }},
    {{
      tag: "确立定解",
      title: "比对选项锁定唯一正确解",
      body: "• B 选项：双曲线在一、三象限，与 <i class='m'>k</i> = -<i class='m'>a</i> &gt; 0 完全吻合！<br>• D 选项：双曲线在二、四象限，对应 <i class='m'>k</i> &lt; 0（失分学生沙兴远、何晨煦误漏了式子前面的负号）。<br><b>故本题正确选项必为 B！</b>"
    }}
  ],
  8: [
    {{
      tag: "已知剖析",
      title: "挖掘三点分别在【三个不同象限】的隐蔽几何约束",
      body: "点 <i class='m'>A</i>(1, <i class='m'>a</i>)，<i class='m'>B</i>(2, <i class='m'>b</i>)，<i class='m'>C</i>(-1, <i class='m'>c</i>)。<br>• 点 <i class='m'>A</i> 横坐标 1 &gt; 0，必在一或四象限；<br>• 点 <i class='m'>B</i> 横坐标 2 &gt; 0，也必在一或四象限；<br>因为三点象限各不相同，所以点 <i class='m'>A</i>、<i class='m'>B</i> 必定<b>分居一、四象限</b>，即 <i class='m'>a</i>·<i class='m'>b</i> &lt; 0（纵坐标异号）！"
    }},
    {{
      tag: "排除矛盾",
      title: "同侧分支单调性矛盾排除",
      body: "反比例函数 <i class='m'>y</i> = <i class='m'>k</i>/<i class='m'>x</i> 在 <i class='m'>x</i> &gt; 0 分支上，所有点的纵坐标符号相同！<br>因此双曲线<b>绝对不可能同时经过 A、B 两点</b>！<br>经过的两点只能是 [A 与 C] 或 [B 与 C]！"
    }},
    {{
      tag: "求解检验",
      title: "联立代数求解与象限封闭性检验",
      body: "若过 A(1, a) 与 C(-1, c)，则 <i class='m'>k</i> = 1·<i class='m'>a</i> = -1·<i class='m'>c</i> ⇒ <i class='m'>a</i> = -<i class='m'>c</i>。<br>代入检验 B 点不重合的象限条件，求得唯一满足要求的解：<br><b><i class='m'>k</i> = -2</b>。<br>（全班共 18 人全错，主要死因是未挖掘 A、B 纵坐标异号不能同过，胡乱猜正负号）"
    }}
  ],
  9: [
    {{
      tag: "第(1)问求解",
      title: "双系数拆分模型建立方程组",
      body: "设 <i class='m'>y</i><sub>1</sub> = <i class='m'>k</i><sub>1</sub>/<i class='m'>x</i>, <i class='m'>y</i><sub>2</sub> = <i class='m'>k</i><sub>2</sub><i class='m'>x</i>，则 <i class='m'>y</i> = <i class='m'>k</i><sub>1</sub>/<i class='m'>x</i> + <i class='m'>k</i><sub>2</sub><i class='m'>x</i>。<br>代入 (1, 4) 与 (2, 5)，解得 <i class='m'>k</i><sub>1</sub> = 2, <i class='m'>k</i><sub>2</sub> = 2。<br>∴ <b><i class='m'>y</i> = 2/<i class='m'>x</i> + 2<i class='m'>x</i></b>。"
    }},
    {{
      tag: "第(2)问痛点",
      title: "【🔥全卷第一重灾区·得分率仅21.6%】一元二次方程漏解分析",
      body: "当 <i class='m'>y</i> = 5 时，2/<i class='m'>x</i> + 2<i class='m'>x</i> = 5。<br>方程两边同时乘以 <i class='m'>x</i> 移项整理得：<b>2<i class='m'>x</i>² - 5<i class='m'>x</i> + 2 = 0</b>。<br>因式分解：(2<i class='m'>x</i> - 1)(<i class='m'>x</i> - 2) = 0！"
    }},
    {{
      tag: "双根检验",
      title: "解出双解并作分母非零检验",
      body: "解得：<b><i class='m'>x</i><sub>1</sub> = 1/2，<i class='m'>x</i><sub>2</sub> = 2</b>！<br>经检验均为原方程的根。<br><b>全班 23 位同学因看到题干‘x=2时y=5’误以为只有 x=2 一个答案，严重遗漏 x=1/2！</b>"
    }}
  ]
}};

// 动态 SVG 绘图生成器
function generateSvgForPolya(qNum, step) {{
  const cx = 170, cy = 170, axisLen = 140;
  let extraSvg = "";

  if (qNum === 3) {{
    if (step >= 0) {{
      // 截距为正 (0, 1)
      extraSvg += `
        <circle cx="${{cx}}" cy="${{cy - 40}}" r="4" fill="#00bfa5"/>
        <text x="${{cx + 8}}" y="${{cy - 36}}" font-size="12" fill="#00bfa5" font-weight="bold">(0, 1) 纵截距&gt;0</text>
      `;
    }}
    if (step >= 1) {{
      // a < 0 直线向右下倾斜
      extraSvg += `
        <line x1="${{cx - 100}}" y1="${{cy - 90}}" x2="${{cx + 90}}" y2="${{cy + 30}}" stroke="#00bfa5" stroke-width="2.2"/>
        <text x="${{cx + 40}}" y="${{cy + 45}}" font-size="12" fill="#00bfa5" font-style="italic">y = ax + 1 (a &lt; 0)</text>
      `;
    }}
    if (step >= 2) {{
      // k = -a > 0 双曲线在一、三象限
      extraSvg += `
        <path d="M ${{cx + 20}} ${{cy - 120}} Q ${{cx + 40}} ${{cy - 40}} ${{cx + 120}} ${{cy - 20}}" fill="none" stroke="#2563eb" stroke-width="2.5"/>
        <path d="M ${{cx - 20}} ${{cy + 120}} Q ${{cx - 40}} ${{cy + 40}} ${{cx - 120}} ${{cy + 20}}" fill="none" stroke="#2563eb" stroke-width="2.5"/>
        <text x="${{cx + 60}}" y="${{cy - 65}}" font-size="12" fill="#2563eb" font-weight="bold">y = -a/x (一、三象限)</text>
      `;
    }}
  }} else if (qNum === 8) {{
    extraSvg += `
      <line x1="${{cx + 50}}" y1="30" x2="${{cx + 50}}" y2="310" stroke="#94a3b8" stroke-dasharray="4,4"/>
      <text x="${{cx + 50}}" y="325" font-size="11" fill="#64748b" text-anchor="middle">x=1</text>
      <line x1="${{cx + 90}}" y1="30" x2="${{cx + 90}}" y2="310" stroke="#94a3b8" stroke-dasharray="4,4"/>
      <text x="${{cx + 90}}" y="325" font-size="11" fill="#64748b" text-anchor="middle">x=2</text>
    `;
    if (step >= 1) {{
      extraSvg += `
        <circle cx="${{cx + 50}}" cy="${{cy + 60}}" r="5" fill="#ef4444"/>
        <text x="${{cx + 58}}" y="${{cy + 65}}" font-size="11" fill="#ef4444" font-weight="bold">A(1, a) 在第四象限</text>
        <circle cx="${{cx + 90}}" cy="${{cy - 50}}" r="5" fill="#2563eb"/>
        <text x="${{cx + 98}}" y="${{cy - 45}}" font-size="11" fill="#2563eb" font-weight="bold">B(2, b) 在第一象限</text>
      `;
    }}
    if (step >= 2) {{
      extraSvg += `
        <path d="M ${{cx - 30}} 40 Q ${{cx - 60}} ${{cy - 60}} ${{cx - 130}} ${{cy - 30}}" fill="none" stroke="#ef4444" stroke-width="2.2"/>
        <path d="M ${{cx + 30}} 300 Q ${{cx + 60}} ${{cy + 60}} ${{cx + 130}} ${{cy + 30}}" fill="none" stroke="#ef4444" stroke-width="2.2"/>
        <text x="${{cx - 100}}" y="${{cy - 80}}" font-size="12" fill="#ef4444" font-weight="bold">y = -2/x (k = -2)</text>
      `;
    }}
  }} else {{
    // 默认双曲线
    extraSvg += `
      <path d="M ${{cx + 25}} ${{cy - 120}} Q ${{cx + 45}} ${{cy - 45}} ${{cx + 120}} ${{cy - 25}}" fill="none" stroke="#00bfa5" stroke-width="2.2"/>
      <path d="M ${{cx - 25}} ${{cy + 120}} Q ${{cx - 45}} ${{cy + 45}} ${{cx - 120}} ${{cy + 25}}" fill="none" stroke="#00bfa5" stroke-width="2.2"/>
    `;
  }}

  return `<svg viewBox="0 0 340 340">
    <!-- 网格背景 -->
    <defs>
      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f1f5f9" stroke-width="1"/>
      </pattern>
    </defs>
    <rect width="340" height="340" fill="url(#grid)" />
    <!-- 坐标轴 -->
    <line x1="${{cx - axisLen}}" y1="${{cy}}" x2="${{cx + axisLen}}" y2="${{cy}}" stroke="#334155" stroke-width="1.6"/>
    <polygon points="${{cx + axisLen}},${{cy}} ${{cx + axisLen - 6}},${{cy - 3}} ${{cx + axisLen - 6}},${{cy + 3}}" fill="#334155"/>
    <text x="${{cx + axisLen - 4}}" y="${{cy + 15}}" font-family="Times New Roman" font-style="italic" font-size="13">x</text>

    <line x1="${{cx}}" y1="${{cy + axisLen}}" x2="${{cx}}" y2="${{cy - axisLen}}" stroke="#334155" stroke-width="1.6"/>
    <polygon points="${{cx}},${{cy - axisLen}} ${{cx - 3}},${{cy - axisLen + 6}} ${{cx + 3}},${{cy - axisLen + 6}}" fill="#334155"/>
    <text x="${{cx - 14}}" y="${{cy - axisLen + 10}}" font-family="Times New Roman" font-style="italic" font-size="13">y</text>
    <text x="${{cx - 13}}" y="${{cy + 14}}" font-family="Times New Roman" font-style="italic" font-size="13">O</text>

    ${{extraSvg}}
  </svg>`;
}}

// 切换题目
function loadQuestion(num) {{
  currentQNum = parseInt(num);
  currentPolyaStep = 0;

  const q = examDatabase[currentQNum] || examDatabase['3'];

  // 1. 顶部元信息
  document.getElementById('qTagNum').textContent = `第${{q.num}}题`;
  document.getElementById('qTagType').textContent = q.type;
  document.getElementById('qTagRate').textContent = `得分率${{q.scoreRate}}`;
  document.getElementById('qTagRate').classList.toggle('low', !!q.isLow);
  document.getElementById('btnNavCurrentBadge').textContent = `第${{q.num}}题 ▾`;

  // 2. 题干
  document.getElementById('qStemContent').innerHTML = q.stemHtml;

  // 3. 选项插槽渲染
  const optSlot = document.getElementById('optionsRenderSlot');
  const figSlot = document.getElementById('figureRenderSlot');
  optSlot.innerHTML = '';
  figSlot.innerHTML = '';

  if (currentQNum === 3) {{
    // 第 3 题专用 4 选项直角坐标配图
    let html = '<div class="zhixue-options-row">';
    q.options.forEach(opt => {{
      html += `
        <div class="zhixue-option-item" onclick="filterOptionStudents('${{opt.label}}')">
          <span class="zhixue-option-label">${{opt.label}}.</span>
          <div class="zhixue-option-img-box">
            <img src="${{opt.img}}" alt="选项${{opt.label}}">
            <div class="zhixue-zoom-btn" title="放大预览" onclick="event.stopPropagation(); openImageModal('${{opt.img}}', '选项 ${{opt.label}} 放大预览')">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
            </div>
          </div>
        </div>
      `;
    }});
    html += '</div>';
    optSlot.innerHTML = html;
  }} else if (q.options && q.options.length > 0) {{
    // 普通文字选择题
    let html = '<div class="zhixue-text-options-grid">';
    q.options.forEach(opt => {{
      html += `
        <div class="zhixue-text-option-card ${{opt.isCorrect ? 'correct' : ''}}" onclick="filterOptionStudents('${{opt.label}}')">
          <span style="font-weight:bold; font-family:var(--math-font); font-size:18px;">${{opt.label}}.</span>
          <span style="font-size:16.5px; font-family:var(--math-font);">${{opt.text || ''}}</span>
          <span style="font-size:12px; color:#8c8c8c;">${{opt.count}}人 (${{opt.pct}})</span>
        </div>
      `;
    }});
    html += '</div>';
    optSlot.innerHTML = html;
  }}

  // 填空/解答题附图
  if (q.figure) {{
    figSlot.innerHTML = `
      <div class="zhixue-figure-container">
        <img src="${{q.figure}}" alt="第${{q.num}}题原题附图">
        <div class="zhixue-zoom-btn" title="查看高清大图" onclick="openImageModal('${{q.figure}}', '第${{q.num}}题题干图')">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
        </div>
      </div>
    `;
  }}

  // 4. 更新右侧抽屉列表高亮
  document.querySelectorAll('.drawer-nav-item').forEach(el => {{
    el.classList.toggle('active', el.id === 'drawerNavItem_' + currentQNum);
  }});

  // 5. 更新右侧作答统计
  renderDrawerStats(q);

  // 6. 更新波利亚卡片
  renderPolyaView(currentQNum);

  // 7. 更新真实卷面切片对比
  renderSlicesView(q);

  // 8. 重绘批注
  redrawCurrentInkPage();
}}

// 渲染右侧作答统计面板
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
          <span class="option-stat-label">
            ${{opt.label}}
            ${{opt.isCorrect ? '<span style="color:#52c41a; font-size:12px;">(正确)</span>' : ''}}
          </span>
          <span class="option-stat-count">${{opt.count}} 人</span>
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
          <span class="option-stat-label" style="font-size:12.5px;">${{sub.subTitle}}</span>
          <span class="option-stat-count" style="font-weight:bold; color:${{sub.isLow ? '#dc2626' : '#00bfa5'}};">${{sub.rate}}</span>
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
  title.textContent = '失分学生名单';
  badge.textContent = `${{wrongs.length}}人`;
  container.innerHTML = '';

  if (wrongs.length === 0) {{
    container.innerHTML = '<span style="font-size:12px; color:#52c41a;">🎉 全班全对，无人失分！</span>';
  }} else {{
    wrongs.forEach(stu => {{
      const chip = document.createElement('span');
      chip.className = 'stu-chip wrong';
      chip.textContent = hidePrivacyNames ? maskStudentName(stu) : stu;
      container.appendChild(chip);
    }});
  }}
}}

// 筛选某选项具体作答学生
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
      container.appendChild(chip);
    }});
  }} else {{
    container.innerHTML = '<span style="font-size:12px; color:#8c8c8c;">无学生选择此项</span>';
  }}
}}

// 隐私脱敏处理 (李**、陈**、沙兴远 -> 沙*远)
function maskStudentName(rawName) {{
  if (!rawName) return '';
  // 提取纯姓名（去括号内容）
  const match = rawName.match(/^([^\(]+)(\(.*\))?$/);
  if (!match) return rawName;
  const name = match[1];
  const note = match[2] || '';
  if (name.length <= 1) return name + note;
  if (name.length === 2) return name[0] + '*' + note;
  return name[0] + '*'.repeat(name.length - 2) + name[name.length - 1] + note;
}}

// 切换主视区
function switchMainView(mode) {{
  currentMainMode = mode;
  document.getElementById('tabModeZhixue').classList.toggle('active', mode === 'zhixue');
  document.getElementById('tabModePolya').classList.toggle('active', mode === 'polya');
  document.getElementById('tabModeSlices').classList.toggle('active', mode === 'slices');

  document.getElementById('viewZhixueStem').style.display = (mode === 'zhixue' ? 'block' : 'none');
  document.getElementById('viewPolyaBoard').style.display = (mode === 'polya' ? 'block' : 'none');
  document.getElementById('viewSlicesCompare').style.display = (mode === 'slices' ? 'block' : 'none');

  if (mode === 'polya') {{
    renderPolyaView(currentQNum);
  }} else if (mode === 'slices') {{
    renderSlicesView(examDatabase[currentQNum]);
  }}
}}

// 波利亚卡片推导流渲染
function renderPolyaView(qNum) {{
  const steps = polyaStepsData[qNum] || polyaStepsData[3];
  const container = document.getElementById('polyaStepsFlowContainer');
  container.innerHTML = '';

  steps.forEach((st, idx) => {{
    const card = document.createElement('div');
    card.className = 'polya-step-card';
    card.style.display = (idx <= currentPolyaStep ? 'block' : 'none');
    card.innerHTML = `
      <div class="polya-step-card-header">
        <span class="polya-step-tag">[${{st.tag}}]</span>
        <span class="polya-step-title">${{st.title}}</span>
      </div>
      <div class="polya-step-body">${{st.body}}</div>
    `;
    container.appendChild(card);
  }});

  document.getElementById('polyaStepIndicator').textContent = `步骤 ${{Math.min(currentPolyaStep + 1, steps.length)}} / ${{steps.length}}`;
  document.getElementById('polyaDynamicSvgContainer').innerHTML = generateSvgForPolya(qNum, currentPolyaStep);
}}

function nextPolyaStep() {{
  const steps = polyaStepsData[currentQNum] || polyaStepsData[3];
  if (currentPolyaStep < steps.length - 1) {{
    currentPolyaStep++;
    renderPolyaView(currentQNum);
  }} else {{
    showToast('已展现本题完整波利亚推导链');
  }}
}}

function resetPolyaSteps() {{
  currentPolyaStep = 0;
  renderPolyaView(currentQNum);
}}

// 真实学生卷面切片渲染
function renderSlicesView(q) {{
  const grid = document.getElementById('slicesGridSlot');
  const badge = document.getElementById('slicesErrorCountBadge');
  grid.innerHTML = '';

  if (q.slices && q.slices.length > 0) {{
    badge.textContent = `失分人数：${{q.wrongStudents ? q.wrongStudents.length : 0}} 人`;
    q.slices.forEach(sl => {{
      const isFull = sl.tag.includes('满分') || sl.tag.includes('规范') || sl.tag.includes('正确');
      const card = document.createElement('div');
      card.className = 'slice-paper-card ' + (isFull ? 'full-score' : 'loss-score');
      card.innerHTML = `
        <div class="slice-card-header">
          <span class="slice-student-title">${{hidePrivacyNames ? maskStudentName(sl.student) : sl.student}}</span>
          <span class="slice-status-badge ${{isFull ? 'green' : 'red'}}">${{sl.tag}}</span>
        </div>
        <div class="slice-img-wrapper">
          <img src="${{sl.file}}" alt="${{sl.student}}" onclick="openImageModal('${{sl.file}}', '${{sl.student}} 真实卷面切片')">
        </div>
      `;
      grid.appendChild(card);
    }});
  }} else {{
    badge.textContent = '客观题无主观书写切片';
    grid.innerHTML = '<div style="padding:40px; color:#8c8c8c; font-size:15px; text-align:center;">此题为客观选择/填空题，已在右侧【作答统计】提供完整选项人次分布与错因归因。</div>';
  }}
}}

// 抽屉展开收起
function toggleDrawer() {{
  isDrawerOpen = !isDrawerOpen;
  const drawer = document.getElementById('rightAnalyticsDrawer');
  const arrow = document.getElementById('drawerArrowIcon');
  drawer.classList.toggle('collapsed', !isDrawerOpen);
  arrow.style.transform = isDrawerOpen ? 'none' : 'rotate(180deg)';
}}

// 隐私脱敏开关
function toggleStudentPrivacy() {{
  hidePrivacyNames = !hidePrivacyNames;
  document.getElementById('headerPrivacyTxt').textContent = hidePrivacyNames ? '🔒 姓名已脱敏' : '🔓 姓名明文';
  document.getElementById('privacyCheckIcon').textContent = hidePrivacyNames ? '☑' : '☐';
  loadQuestion(currentQNum);
  showToast(hidePrivacyNames ? '已启用隐私保护，学生姓名已打码' : '已显示学生真实姓名');
}}

// 前后题翻页
function prevQuestion() {{
  if (currentQNum > 1) loadQuestion(currentQNum - 1);
  else showToast('已是第一题');
}}

function nextQuestion() {{
  if (currentQNum < 12) loadQuestion(currentQNum + 1);
  else showToast('已是最后一题');
}}

// 缩放
function zoomStage(delta) {{
  if (delta === 0) currentZoom = 1.0;
  else currentZoom = Math.max(0.7, Math.min(1.5, currentZoom + delta));
  document.getElementById('mainStageContainer').style.transform = `scale(${{currentZoom}})`;
  document.getElementById('mainStageContainer').style.transformOrigin = 'top left';
  showToast(`画布缩放比例: ${{Math.round(currentZoom * 100)}}%`);
}}

// 全屏
function toggleFullScreen() {{
  if (!document.fullscreenElement) {{
    document.documentElement.requestFullscreen().catch(() => {{}});
  }} else {{
    if (document.exitFullscreen) document.exitFullscreen();
  }}
}}

// 弹窗模态处理
function openImageModal(imgUrl, title) {{
  document.getElementById('modalTitle').textContent = title || '高清图像查看';
  document.getElementById('modalBody').innerHTML = `
    <div style="display:flex; justify-content:center; align-items:center; background:#f8fafc; padding:20px; border-radius:8px;">
      <img src="${{imgUrl}}" style="max-width:100%; max-height:70vh; border-radius:6px; box-shadow:0 4px 16px rgba(0,0,0,0.15);" alt="大图">
    </div>
  `;
  document.getElementById('generalModalOverlay').style.display = 'flex';
}}

function openRosterModal() {{
  document.getElementById('modalTitle').textContent = '九年级数学6班 · 全班 29 人成绩与错题分布总览 (均分 45.2 / 56)';
  let rowsHtml = '';
  studentsSummary.forEach(stu => {{
    const displayName = hidePrivacyNames ? maskStudentName(stu.name) : stu.name;
    rowsHtml += `
      <tr>
        <td class="rank-badge">第 ${{stu.rank}} 名</td>
        <td>${{stu.id}}</td>
        <td style="font-weight:700;">${{displayName}}</td>
        <td style="font-weight:800; color:${{stu.score >= 50 ? '#15803d' : stu.score >= 40 ? '#0284c7' : '#b91c1c'}};">${{stu.score}} 分</td>
        <td>${{stu.rate}}</td>
        <td style="color:#b91c1c; font-size:12.5px;">${{stu.wrongs}}</td>
      </tr>
    `;
  }});

  document.getElementById('modalBody').innerHTML = `
    <table class="table-roster">
      <thead>
        <tr>
          <th>班级排名</th>
          <th>准考号</th>
          <th>姓名</th>
          <th>实得分</th>
          <th>得分率</th>
          <th>主要失分题号</th>
        </tr>
      </thead>
      <tbody>${{rowsHtml}}</tbody>
    </table>
  `;
  document.getElementById('generalModalOverlay').style.display = 'flex';
}}

function closeModal() {{
  document.getElementById('generalModalOverlay').style.display = 'none';
}}

function closeModalOnBg(e) {{
  if (e.target.id === 'generalModalOverlay') closeModal();
}}

function showToast(msg) {{
  const t = document.getElementById('toastMsg');
  t.textContent = msg;
  t.style.display = 'block';
  clearTimeout(t.timer);
  t.timer = setTimeout(() => {{ t.style.display = 'none'; }}, 1800);
}}

// 排序切换 (按题号 vs 按得分率升序查错)
function toggleSortMode() {{
  sortAscending = !sortAscending;
  renderQNavList();
  showToast(sortAscending ? '已按得分率由低到高升序排列 (优先查错)' : '已按原生试卷题号排序');
}}

// 渲染右侧试题导航目录
function renderQNavList() {{
  const list = document.getElementById('drawerQNavList');
  list.innerHTML = '';

  let keys = Object.keys(examDatabase);
  if (sortAscending) {{
    keys.sort((a, b) => parseFloat(examDatabase[a].scoreRate) - parseFloat(examDatabase[b].scoreRate));
  }} else {{
    keys.sort((a, b) => parseInt(a) - parseInt(b));
  }}

  let currentSection = '';
  keys.forEach(k => {{
    const item = examDatabase[k];
    if (!sortAscending && item.type !== currentSection) {{
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

    const hasSub = !!item.subQuestions;
    btn.innerHTML = `
      <span class="q-num-label">${{item.num}}</span>
      ${{hasSub ? '<span class="q-sub-badge">2</span>' : `<span class="q-rate-label ${{item.isLow ? 'low' : ''}}">${{item.scoreRate}}</span>`}}
    `;
    list.appendChild(btn);
  }});
}}

/* ================= 批注系统 (双缓冲 Canvas + 平滑笔迹 + 二级菜单 + 黑板) ================= */
let activeTool = 'select'; // 'select', 'pen', 'eraser'
let currentColor = '#ef4444';
let currentWidth = 2;
let currentPenMode = 'pen'; // 'pen', 'highlighter', 'arrow', 'rect'
let isChalkboard = false;
let isDrawing = false;
let strokesHistory = {{}}; // 按题号独立缓存笔迹
let redoStack = {{}};
let currentStroke = null;

const canvas = document.getElementById('penCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {{
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  redrawCurrentInkPage();
}}
window.addEventListener('resize', resizeCanvas);

function selectInkTool(tool) {{
  activeTool = tool;
  document.getElementById('toolSelect').classList.toggle('active', tool === 'select');
  document.getElementById('toolPen').classList.toggle('active', tool === 'pen');
  document.getElementById('toolEraser').classList.toggle('active', tool === 'eraser');

  const subMenu = document.getElementById('inkSubMenu');
  if (tool === 'pen') {{
    subMenu.classList.add('visible');
    canvas.classList.add('drawing-active');
  }} else if (tool === 'eraser') {{
    subMenu.classList.remove('visible');
    canvas.classList.add('drawing-active');
  }} else {{
    subMenu.classList.remove('visible');
    canvas.classList.remove('drawing-active');
  }}
}}

function setInkColor(c) {{
  currentColor = c;
  document.querySelectorAll('.sub-color-circle').forEach(el => {{
    el.classList.toggle('active', el.style.backgroundColor === c);
  }});
}}

function setInkWidth(w) {{
  currentWidth = w;
  document.querySelectorAll('.sub-width-pill').forEach(el => {{
    if (el.textContent.includes(w + 'px')) el.classList.add('active');
    else if (el.textContent.includes('px')) el.classList.remove('active');
  }});
}}

function setInkMode(m) {{
  currentPenMode = m;
  document.getElementById('btnModePen').classList.toggle('active', m === 'pen');
  document.getElementById('btnModeHighlighter').classList.toggle('active', m === 'highlighter');
  document.getElementById('btnModeArrow').classList.toggle('active', m === 'arrow');
  document.getElementById('btnModeRect').classList.toggle('active', m === 'rect');
}}

function toggleChalkboard() {{
  isChalkboard = !isChalkboard;
  document.getElementById('chalkboardOverlay').style.display = isChalkboard ? 'block' : 'none';
  showToast(isChalkboard ? '已开启全屏沉浸黑板板书模式' : '已返回原生试卷课件背景');
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

  if (st.mode === 'highlighter') {{
    ctx.globalAlpha = 0.35;
    ctx.lineWidth = st.width * 3.5;
  }} else {{
    ctx.globalAlpha = 1.0;
  }}

  if (st.mode === 'rect') {{
    const p1 = st.points[0];
    const p2 = st.points[st.points.length - 1];
    ctx.strokeRect(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y);
  }} else if (st.mode === 'arrow') {{
    const p1 = st.points[0];
    const p2 = st.points[st.points.length - 1];
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
    // 箭头头
    const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
    ctx.beginPath();
    ctx.moveTo(p2.x, p2.y);
    ctx.lineTo(p2.x - 14 * Math.cos(angle - Math.PI / 6), p2.y - 14 * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(p2.x - 14 * Math.cos(angle + Math.PI / 6), p2.y - 14 * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fillStyle = st.color;
    ctx.fill();
  }} else {{
    // 贝塞尔二次平滑笔迹
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

// 批注鼠标/触摸事件绑定
canvas.addEventListener('mousedown', e => {{
  if (activeTool === 'select') return;
  isDrawing = true;
  currentStroke = {{
    color: currentColor,
    width: currentWidth,
    mode: currentPenMode,
    points: [{{ x: e.clientX, y: e.clientY }}]
  }};
}});

canvas.addEventListener('mousemove', e => {{
  if (!isDrawing || !currentStroke) return;
  if (activeTool === 'eraser') {{
    // 橡皮擦：擦除碰撞笔画
    const s = strokesHistory[currentQNum] || [];
    strokesHistory[currentQNum] = s.filter(st => {{
      return !st.points.some(p => Math.hypot(p.x - e.clientX, p.y - e.clientY) < 20);
    }});
    redrawCurrentInkPage();
    return;
  }}

  currentStroke.points.push({{ x: e.clientX, y: e.clientY }});
  redrawCurrentInkPage();
  drawSingleStroke(currentStroke);
}});

window.addEventListener('mouseup', () => {{
  if (!isDrawing) return;
  isDrawing = false;
  if (currentStroke && currentStroke.points.length > 0 && activeTool !== 'eraser') {{
    if (!strokesHistory[currentQNum]) strokesHistory[currentQNum] = [];
    strokesHistory[currentQNum].push(currentStroke);
    redoStack[currentQNum] = [];
  }}
  currentStroke = null;
  redrawCurrentInkPage();
}});

// 键盘快捷键 (Space 下一步，B 黑板，Esc 选择，C 清空，Ctrl+Z 撤销)
window.addEventListener('keydown', e => {{
  if (e.key === ' ' && currentMainMode === 'polya') {{
    e.preventDefault();
    nextPolyaStep();
  }} else if (e.key === 'b' || e.key === 'B') {{
    toggleChalkboard();
  }} else if (e.key === 'Escape') {{
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
  loadQuestion(3); // 默认打开用户指定第 3 题，完美对照截图
}});
</script>
</body>
</html>
"""
    
    out_file1 = '/Users/xionghaoran/数学交互式课件/One·ai_讲评工作台_动态演示.html'
    out_file2 = '/Users/xionghaoran/数学交互式课件/智学网讲评模式_动态交互演示Demo.html'
    
    with open(out_file1, 'w', encoding='utf-8') as f:
        f.write(html_content)
    with open(out_file2, 'w', encoding='utf-8') as f:
        f.write(html_content)
        
    print(f"Successfully generated:\n- {out_file1}\n- {out_file2}")

if __name__ == '__main__':
    build_workbench_html()

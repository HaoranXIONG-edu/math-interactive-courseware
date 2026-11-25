---
name: math-interactive-courseware
description: Use this skill whenever the user asks to optimize a middle/high school math student worksheet (.docx) and/or generate an interactive HTML dynamic presentation courseware (动态讲解课件.html) for classroom smartboard use. Provides the full-screen Goodnotes interactive HTML shell, adaptive PPT-grade layouts (Layouts F–J & layout-ppt), zero-spoiler step-by-step progression rules, in-place Word XML patching rules, and a parallel Multi-Agent build pipeline.
---

# 数学学案无损优化与交互式 HTML 动态讲解课件开发技能

当用户要求“优化某节数学学案（`.docx`）并生成交互式 HTML 动态演示课件”时，严格执行本规范。

---

## 一、两阶段用户确认制开发流水线（严禁跳步）

### 第一阶段：学案解析与优化版 `.docx` 定稿确认（未定稿前严禁写 HTML）
1. **结构解析与原图核验**：
   ```bash
   python3 ~/.gemini/config/skills/math-interactive-courseware/scripts/inspect_docx_worksheet.py \
     "原学案路径.docx" --media-out /tmp/docx_inspect_media --json-out /tmp/docx_inspect_media/audit_report.json
   ```
   用 `read_file` 逐张核验导出配图（及 `*_crop*.png`）的顶点字母、线段关系与子图数量。
2. **可解性验算、40 分钟容量守恒与原地无损修补**：
   - 除驱动动点外，其余顶点坐标必须由题干几何条件推导得出，**严禁硬编码自由常数坐标**；题干几何字母必须与配图 `smart_label_point` 1:1 闭合。
   - 严格控制单节课 40 分钟容量，题量已饱满时严禁机械增补多余习题。
   - 配图 $\ge 3$ 张时并发 `invoke_subagent` 重绘 300 DPI 高清图（$\ge 2400\text{px}$），并用 `docx_inplace_patcher.py`（`DocxWorksheetPatcher`）原地修补 `.docx`（保留页边距/页眉/`12pt` 字号/`1.5` 倍行距；所有填空与网格保持空白；替换配图时同步清空 `<a:srcRect>` 并按新图比例更新尺寸）。
   - 重绘配图脚本运行前须通过 `audit_figure_script.py` 静态检查。
3. **强制确认门禁**：向用户提交优化版 `.docx` 与修改清单，待用户确认定稿后再进入第二阶段（若用户直接提供已定稿 `.docx` 要求做课件，则直接进入第二阶段）。

### 第二阶段：基于定稿 `.docx` 1:1 生成 `.html` 动态课件
1. **锁定单一数据源**：以定稿 `.docx`（或用户最新确认的学案 PDF）的题干、选项、数据、子图数量为准，提取《课时定稿蓝图》。
2. **弹性并发编写 `chunk*.js`**：
   - $\le 8$ 页启动 `1～2` 个子智能体；常规课（10～18 页）启动 `3` 个子智能体（`chunk1`～`chunk3`）；18+ 页复杂课可拆为 `4～6` 个。
   - `chunk1` 开头必须声明 `window.COURSEWARE_BRAND`（$\le 15$ 字）、`window.COURSEWARE_TITLE`（$\le 15$ 字）、`window.COURSEWARE_PHASES`（每项主标题 $\le 7$ 字、副标题 $\le 10$ 字）及第 1 页 `cover: true` 标准封面（调用 `window.renderStandardCover`，严禁重复堆砌四环节卡片）。
3. **一键编译与全页面视觉检验**：
   ```bash
   python3 ~/.gemini/config/skills/math-interactive-courseware/scripts/compile_courseware.py \
     --title "课题标题" --chunks chunk1.js chunk2.js chunk3.js --output "课题_动态讲解课件.html"
   ```
   编译通过后，必须用无头浏览器（`1600×900`）遍历全页展开态，确认零控制台报错、零旧版 `.step` 卡片、零标题截断与溢出、零元素遮挡。

---

## 二、自适应版式选型与课堂 PPT 直排规范（详参 [LAYOUTS.md](./LAYOUTS.md)）

1. **全面废除旧版 `.step` 蓝边编号卡片与外框套娃**：
   - 所有情境引入、问题探究、定理证明、例题解答、选择题解析与分层训练，一律使用 **`layout: 'layout-ppt'`** 搭配 `window.pptExampleLayout`、`window.pptInferDiagram` 或 `window.pptThreeColTable`；
   - 底层 `shell_prefix.html` 已自动将旧版 `layout-a`～`layout-e` 映射到 `layout-ppt`，全卷严禁出现 `.step` 或 `.prob-step-card`。
2. **PPT 板书视觉规范**：
   - **左文右图直排**：左侧解答/证明使用 **`29px` 加粗红字（`#c81e1e`，`line-height: 1.66`）**，顶部对齐紧贴题干下方起笔，点按空白处或按空格键逐行浮现；
   - **紧凑胶囊控制栏**：`#controls` 收纳于右上角悬浮胶囊（必须保持 `top: 0`、`overflow: visible`，严禁负偏移遮挡）；滑块与双解切换按钮（`modeButtons` 须带第 3 参 `syncStep`）同行胶囊化排布；
   - **大图直观呈现**：右侧几何/函数图放大至 `460–510px` 宽，顶点字母 `18px`，无多余外框。
3. **专用高阶版式（`F–J`）**：
   - `layout-f`：知识归纳与流程对照（左流程要领 ↔ 右同步演算，或 PPT 主题知识卡）；
   - `layout-g`：多解法对比 / 正误辨析（2/3 列卡片 + 点评 + 末步 `summary`）；
   - `layout-h`：教研级交互对比表格（`headers` + `cells` + `summary`）；
   - `layout-i`：全屏交互式思维导图 / 课堂小结（`window.renderMindMapScene`）；
   - `layout-j`：多图网格条件辨析（支持 `cols: 2 / 3 / 4 / 5`，如学案有 5 个并排图则用 `cols: 5` 单行呈现）。

---

## 三、零剧透、多问拆页与 SVG 几何绘制规范

1. **一题一页 & 多问拆页**：每个追问独立成页，后问顶部加 `【前问已知】` 横幅；含 $\ge 3$ 小问、数据表+多问或长背景多问时拆页精讲，单页保持 2～4 步。
2. **零剧透（`step = 0`）**：
   - 题干填空/括号必须用 `<span class="screen-blank" data-step="k" data-ans="..."></span>`（选择题加 `choice-blank`）原位同步回填；
   - `step = 0` 时仅画原题图形（无配图题仅画空白坐标系），辅助线、数字角与色块在 `step >= 1` 后浮现。
3. **SVG 与公式硬规范（编译脚本自动门禁拦截）**：
   - 必须使用 `window.createCoordCanvas({ ..., equalAspect: true })` 传入真实数学坐标绘图，严禁口算像素或省略 `equalAspect: true` 导致圆/弧椭圆变形；
   - 严禁在 SVG 内嵌套子 `<svg>`；
   - 严禁在 HTML 裸写 `√`（必须用 `<span class="sqrt"><span class="num">...</span></span>`）或前置 `⌒`（必须用 `window.arcHtml('CD')`）；
   - 严禁在 SVG `<text>` 中裸写未转义 `<`（应写 `&lt;` 或经 `svgAutoFormatText`）及单行斜杠分式（含分式标签须用 `window.svgFoLabel` + `.fraction`）；
   - `<foreignObject>` 与 `<text>` 零碰撞重叠；相似（`∽`）后严禁括号标注 `（AA）` / `（SAS）`。

---

## 四、核心全局 API 白名单（已前置挂载于 `shell_prefix.html`）

- **页面与组件**：`window.defineSlide(cfg)`、`window.renderStandardCover(cfg)`、`window.pptExampleLayout`、`window.pptInferDiagram`、`window.pptThreeColTable`、`window.renderMindMapScene`、`window.renderMultiPanelScene`、`window.renderChoices(items, cols)`、`window.formalProofStep(lines)`、`window.arcHtml(letters)`。
- **坐标与标注**：`window.createCoordCanvas(opts)`、`window.svgLegendBar(items, opts)`、`window.svgNumberedAngle(v, p1, p2, num, opts)`、`window.svgCalloutTag(anchor, rect, html, opts)`、`window.svgFoLabel`、`window.svgFoCard`、`window.svgAutoFormatText`、`window.draw3DFoldCircle` / `window.toggle3DFoldAnim`。
- **交互控件**：`slider(key, label, min, max, val, step, unit)`、`modeButtons(key, cur, [[val, label, syncStep], ...])`、`stepBar`、`isManualOverride` / `setManualOverride`。
- **三层组件库**：`layers/math_components.js`（公式与函数/数轴/箱线图）、`layers/ui_components.js`（题干/填空/选项/表格组件）、`layers/annotation_components.js`（批注画板与 8 种尺规作图工具）。

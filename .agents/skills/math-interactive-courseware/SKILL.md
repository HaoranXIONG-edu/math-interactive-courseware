---
name: math-interactive-courseware
description: Use this skill whenever the user asks to optimize a middle/high school math student worksheet (.docx) and/or generate an interactive HTML dynamic presentation courseware (动态讲解课件.html) for classroom/Seewo smartboard use. Provides the full-screen Seewo/Goodnotes interactive HTML shell, 5 adaptive question layouts (Layouts A–E), zero-spoiler step-by-step progression rules, in-place Word XML patching rules, and a parallel Multi-Agent build pipeline.
---

# 数学学案无损优化与交互式 HTML 动态讲解课件（希沃大屏版）开发技能

当用户要求“优化某节数学学案（`.docx`）并生成交互式 HTML 动态演示课件”时，必须严格执行本规范。

---

## 一、两阶段用户确认制开发流水线（Two-Stage Confirmation SOP，严禁跳步）

为彻底消除“边改学案边猜着写课件”导致的题干不一致、设问错位与返工，必须严格执行**“第一阶段先定稿 `.docx` 学案并交由用户确认 $\to$ 第二阶段以定稿 `.docx` 为唯一基准 1:1 生成 `.html` 动态课件”**的两阶段工作流：

### 第一阶段：学案体检与优化版 `.docx` 交付确认（严禁在此阶段提前生成 HTML）
1. **步骤 1.1（1 秒自动化体检 + WMF/OMML 公式全自动解码 + 原图视觉必读 `Visual-First Rule`）**：
   - 运行本技能内置的一键体检脚本（v2.0），一次性完成：① 自动解码全部遗留 MathType `<w:object>`（`.wmf`）与原生 `<m:oMath>` 为内联 `$LaTeX$` 公式；② 仅将真正的题目配图（`.png / .jpg / .jpeg`）导出到 `--media-out`（自动过滤掉数十个 `.wmf` 公式碎片）；③ 审计每张配图的像素分辨率、Word 物理宽高（`cm`）及 `<a:srcRect>` 裁剪参数，并对存在大幅裁剪的图片自动生成裁剪后实际可见视图 `*_crop*.png`；④ 审计 `<mc:AlternateContent>` 浮动圆角文本框的 `Choice/Fallback` 双分支同步状态与 `o:gfxdata` 缓存标志，并输出结构化 JSON 蓝图：
     ```bash
     python3 .agents/skills/math-interactive-courseware/scripts/inspect_docx_worksheet.py \
       "原学案路径.docx" --media-out /tmp/docx_inspect_media --json-out /tmp/docx_inspect_media/audit_report.json
     ```
   - **原图必读铁律**：主智能体必须先用 `read_file` 逐张查看 `/tmp/docx_inspect_media/` 下的所有导出配图（及 `*_crop*.png` 裁剪预览图），核对几何顶点字母、线段连接关系与子图编号（如图(1)～图(5)）。
2. **步骤 1.2（数学可解性验算 + 并发重绘 300 DPI 配图 + 原地无损修补生成优化版 `.docx`）**：
   - **🚨 几何可解性与零自由常数铁律（Mathematical Solvability & Zero Magic-Coordinate Rule，防病题复现门禁）**：
     1. **严禁无约束自由常数坐标**：原版学案常包含随手画的示意图和笼统提问（如“你发现了什么规律？”）。在具象化题干设问与重绘配图时，除驱动动点（如 $A(x_0, k/x_0)$）外，**图形中其余所有顶点（垂足、交点、对称点）的坐标必须严格由题干明示的几何条件（如 $\perp x$ 轴、$\parallel y$ 轴、过原点对称）通过数学公式推导得出**（如 `C = (A[0], 0)`），**绝对禁止**在绘图代码中硬编码与 $k$ 或 $x_0$ 无关的自由常数坐标（如把非垂足斜线端点写死为 `C = (1.75, 0)`，导致面积含未知截距而无法用 $|k|$ 解出）！
     2. **代数消元必检**：凡要求“用含 $|k|$ 的代数式表示面积/长度”的探究题，动笔作图前必须先列出含动点坐标 $(x_0, y_0)$ 的面积代数式，验证 $x_0, y_0$ 乘积能 100% 转化为 $k$（无无法消去的自由变量），并在题干中补全必要的垂直/平行前提条件（图中同步标出直角符号 `⊥`）。
     3. **题干几何名称 ↔ 子图顶点字母 1:1 闭合校验**：每个子图（如图(1)～图(4)）调用 `smart_label_point` 标注的顶点字母集合，必须与题干点名求面积的几何图形字母（如 `△ABC`、`四边形ACBD`、`四边形AFBE`）100% 一致，严禁图(4) 标了 $A,F,B,E$ 而题干统称求 `四边形ABCD`！
      4. **40分钟课堂容量守恒铁律（严禁盲目扩充题量）**：初中一节数学课仅 40 分钟，审视和优化学案时必须严格根据单节课 40 分钟容量进行把控。若原版学案中的探究/应用大题本身综合度高、题量已饱满（例如已含 1 道多问情境引入 + 3 道长背景跨学科/新定义/实际建模综合大题），**严禁机械照搬四环节模板强行在末尾增补“三、新知应用”与“四、分层训练”**，避免课堂讲不完！仅当原学案存在错搬其他课时废题或总题量明显不足（少于 20 分钟容量）时，才按需精简替换或补充。
   - 若需重绘配图 $\ge 3$ 张，使用 `invoke_subagent` 并发重绘全部 300 DPI 高清配图（$\ge 2400\text{px}$），并原地无损修补 `word/document.xml`（清零 `<w:object>` 升级为 `12pt` 原生 `<m:oMath>`，修复剧透填空与设问梯度，同步浮动归纳框双分支并清空框下残留段落），输出 `xxx_学生学案_优化版.docx`。
3. **步骤 1.3（🛑 强制暂停确认门禁 STOP & CONFIRM）**：
   - 将生成的 `xxx_学生学案_优化版.docx` 及《学案优化修改清单》（**必须包含每道改动/重绘题的【几何条件与可解性验算式】及【题干↔配图字母核对结果】**）呈现给用户审阅，询问用户：**“请确认优化后的 Word 学案是否定稿（您也可以直接在 Word 中修改后发回给我），确认后我将严格按定稿学案 1:1 生成 HTML 动态讲解课件。”**
   - **铁律**：在用户明确回复“确认”或发回修改后的定稿 `.docx` 之前，**严禁提前编写或生成 HTML 课件**！（若用户一开始直接上传的就是已定稿 `.docx` 并明确只要求直接生成 HTML 课件，则直接进入第二阶段）。

### 第二阶段：基于用户确认定稿 `.docx` 1:1 极速生成 `.html` 课件
1. **步骤 2.1（锁定唯一真实数据源 `Single Source of Truth`）**：
   - 若用户发回了微调后的 `.docx` 学案，再次运行 `inspect_docx_worksheet.py` 并用 `read_file` 查看最终配图，提取出**100% 锁定的《课时定稿蓝图》**（包含每一题的定稿题干、每一个填空对应的 `data-step="1..N"` 序号、每一张子图 `图(1)～图(k)` 的真实数学顶点坐标）。
2. **步骤 2.2（多子智能体 1:1 并发编写课件模块）**：
   - 在同一轮工具调用中，同时使用 `invoke_subagent` 启动 3 个子智能体并行编写 `chunk1_intro_explore.js`, `chunk2_apply.js`, `chunk3_train_summary.js`：
     - 将《课时定稿蓝图》直接内联到各子智能体 Prompt 中，**严禁子智能体擅自增删设问、严禁更改字母或子图顺序、严禁翻阅旧历史课件**；
     - 统一调用壳文件内置的声明式构建器 `window.defineSlide({...})`、数学坐标底座 `window.createCoordCanvas({...})` 以及多子图总览/放大容器 `window.renderMultiPanelScene(step, panels)`。
3. **步骤 2.3（一键编译 + 1对1步数一致性门禁 + 全页面运行时仿真）**：
   - 调用编译脚本合并输出 `.html`，脚本会自动执行 **JS 语法检验**、**顶栏 `COURSEWARE_PHASES` 与封面页校验**、**DOM 结构校验（`.screen-page.lab-visible` / `.screen-lower`）**、**1对1 步数对齐校验（`.step` 卡片数 === `stepBar` 圆点数 >= 填空最大 `data-step`）**、**`modeButtons` 同步校验**、**SVG 非法 `<0` 乱码扫描**以及**全页面 `step = 0..maxStep` 运行时仿真渲染测试**，任何一页违背契约即刻报错拦截：
     ```bash
     python3 .agents/skills/math-interactive-courseware/scripts/compile_seewo_courseware.py \
       --title "2.2.3 反比例函数中“k”的几何意义" \
       --chunks chunk1_intro_explore.js chunk2_apply.js chunk3_train_summary.js \
       --output "2.2.3_反比例函数中“k”的几何意义_动态讲解课件.html"
     ```

---

## 二、Word 学生学案（`.docx`）原地无损修补铁律（统一调用 `docx_inplace_patcher.py` + `audit_figure_script.py`）

1. **严禁手写冗长 XML 拼接或新建无边框表格重排**：
   - 必须直接调用本技能内置的 [docx_inplace_patcher.py](./scripts/docx_inplace_patcher.py)（`DocxWorksheetPatcher` 类）原地修改 `word/document.xml`，100% 保留原文档页面边距、学校页眉、四号（`12pt`，`w:sz="24"`）字号、`1.5` 倍行距与圆角浮动归纳框：
     ```python
     from docx_inplace_patcher import DocxWorksheetPatcher
     patcher = DocxWorksheetPatcher("原学案.docx")
     # 1) 44ms 全自动将全篇遗留 MathType <w:object> (.wmf) 升级为 12pt 原生 <m:oMath> 与正斜体 Run
     patcher.upgrade_all_wmf_to_omml(size_pt=12.0)
     # 2) 用 $LaTeX$ 语法原地替换指定段落文本（自动保留原段落缩进 <w:pPr> 与内嵌配图 <w:drawing>）
     patcher.set_paragraph_rich_text(13, r"问题1：如图，点A是反比例函数$y=\frac{k}{x}$图象上任意一点...")
     # 3) 双分支同步更新圆角浮动归纳框（自动同步 mc:Choice 与 mc:Fallback 并剥离 o:gfxdata 缓存）
     patcher.update_floating_textbox(0, [r"反比例函数$y=\frac{k}{x}$（$k\neq 0$）的图象是由________组成的。"])
     # 4) 替换 300 DPI 高清配图并自动清空 <a:srcRect> 裁剪框（防止新图被旧裁剪参数切边）
     patcher.replace_media_and_clear_crop({"image9.png": "/tmp/redrawn_image9.png"})
     patcher.audit_cleanliness()
     patcher.save("xxx_学生学案_优化版.docx")
     ```
2. **配图脚本静态可解性必检（`audit_figure_script.py`）**：
   - 在运行重绘配图脚本生成 `.docx` 之前，必须调用 [audit_figure_script.py](./scripts/audit_figure_script.py) 检查重绘脚本是否存在硬编码自由魔数坐标（如 `C = (1.75, 0)`），并在子图中调用 `fig.assert_labels_match_stem([...])` 确保图内标注的顶点字母与题干多边形名称 100% 闭合。
3. **纯粹学生视角**：所有填空处（`________`）、表格、作图网格保持空白，严禁预填答案或塞入 `【温故知新】`、`【方法指导】` 等教案标签。
4. **300 DPI 配图防压线与正斜体/单位规范**：
   - 重绘配图宽度 $\ge 2400\text{px}$；坐标轴刻度数字必须标在**无双曲线经过的象限侧**，图内分式必须调用 `fig.draw_stacked_equation` 上下叠置。
   - `exam_figure_engine.py` 已内置以下防呆规则：
     - `draw_axes` 默认对 $x$ 轴末端标签使用 `anchor="right"`、对 $y$ 轴顶端标签使用 `anchor="left"`（`px_y + 24`），彻底杜绝 `y/°C`、`y/度` 等带单位标签左边缘压住 $y$ 轴顶端箭头；
     - `_tokenize_label` 自动将紧跟斜杠 `/` 或数字后的计量单位（如 `/Pa`, `/m`, `/A`, `/N`, `/min`, `/mg`, `/Ω`, `°C`）渲染为 `Times New Roman` **正体**（中文单位如 `/度` 渲染为`宋体`正体），而将独立的单字母几何顶点或物理变量（如 `A`, `B`, `C`, `O`, `F`, `I`, `R`, `S`, `p`, `x`, `y`）严格渲染为 `Times New Roman` **斜体**；
     - `DocxWorksheetPatcher.replace_media_and_clear_crop` 在替换高清配图并清空 `<a:srcRect>` 时，会自动读取新图真实像素宽高比并同步更新 `<wp:extent>` 与 `<a:ext>` 的 `cy`，杜绝高清重绘图在 Word 中被旧尺寸拉伸变形。

---

## 三、交互式 HTML 动态课件五大自适应版式（Layouts A–E）与零剧透规范

### 1. 五大自适应版式（按题型精准匹配）
- **版式 A (`layout-a`)**：无配图纯文字/代数/概念辨析题。上方 `.screen-stem` 100% 全宽展示题干与选项，下方 `.screen-lower.layout-a` 100% 全宽展示分步解析。**严禁为了凑左右分栏而在左侧捏造假表格！**
- **版式 B (`layout-b`)**：单配图几何/函数综合题、探究题。上方 `.screen-stem` 100% 全宽展示完整题干（含子问题串、归纳填空框或追问顶部的 `【关联前问总结】` 横幅），下方严格**左解（`.screen-notes`）右图（`.screen-media`）**。
- **版式 C (`layout-c`)**：含 4 个函数图象选项的选择题。上方全宽展示题干及一行 4 张放大版 SVG 选项图，下方全宽展示分步排除推导。
- **版式 D (`layout-d`)**：列表—描点—连线作图题。上方全宽展示带两端省略号 `…` 的取点表格（初始用 `?` 遮罩 $x, y$ 数值），左下分步推导，右下交互式坐标纸。
- **版式 E (`layout-e`)**：多点坐标验算判断卡片题。上方题干，下方全宽并排展示待验算点卡片。

### 2. 零剧透（Zero-Spoiler）与零冗余铁律
0. **第 1 页必为极简正式教学封面页（`cover: true` + `window.renderStandardCover`）**：
   - `chunk1_intro_explore.js` 的第 1 页必须固定为 `cover: true` 的教学封面页，直接调用壳文件内置的 `window.renderStandardCover({ chapter, num, title, caption, goals })`：
     - **严禁在封面页重复堆砌“课堂四环节导览”卡片**（页面顶部 `flowbar` 已有四环节导航）；
     - **左栏（`.std-cover-left`）**：仅保留清爽庄重的**教材章节眉头**、**课时编号 + 大字号课题标题**以及与学案完全一致的**【学习目标】框**（大字号、宽行距，清晰标注重点/难点）；
     - **右栏（`.std-cover-right`）**：由壳文件内置的 `window.getChapterCoverEmblem(chapterTheme)` 自动渲染**全章统一的圆形主题数学徽章插画**（同一章的所有课时共享同一个章节插画，无需每节课重复手写封面配图，大幅减少封面工作量）。
1. **一题一页 & 追问独立成页**：每个 `追问` 独立成页，并在 `.screen-stem` 顶部放置 `20px` 浅青色 `【关联前问总结】` 横幅（**切勿把题干、归纳框或关联前问总结塞进左侧 `.screen-notes` 挤压推导区空间**）。
2. **`step = 0` 绝对纯净与直接点击步进（零显眼“下一步”按钮）**：
   - **题干答题栏同步回填（必选）**：所有填空题横线与选择题括号必须使用 `<span class="screen-blank" data-step="3" data-ans="..."></span>`（选择题加 `choice-bracket` 类，如 `<span class="screen-blank choice-bracket" data-step="3" data-ans="B"></span>`）放置在 `.screen-stem` 题干对应位置。初始状态为空白横线或空括号 `（   ）`；当步骤推进到 `data-step`（或最后一步 `maxStep`）时，自动以醒目红字手写批注风格填入题干答题栏中，严禁只把答案埋在解析末尾。
   - **点击步骤条直接展开（去显眼“下一步”按钮）**：普通视图下隐藏显眼的蓝色 `▶ 下一步` 按钮；未解锁的 `.step.step-locked` 显示为仅含步骤序号与阶段标题的折叠引导条（如 `01 步骤1（设点表边） · 点击展开 ▸`），教师在希沃白板上**直接点击任意步骤卡片**（或点击顶部轻量数字进度圆点 `1, 2, 3`、按空格/回车键）即可展开该步解析并同步触发右侧 SVG 动态几何演示。
   - **无配图题的辅助坐标系零剧透**：若原学案某题无配图，而课件右侧提供了辅助坐标系（如三点比大小、区间最值），**在 `step = 0` 时右侧 SVG 只允许渲染空白平面直角坐标系（坐标轴、网格与刻度），严禁提前画出双曲线或点坐标**！必须等 `step >= 1` 判定 $k$ 的正负后才动态绘出曲线。
   - **有配图题的辅助线零剧透**：`step = 0` 严格还原原题配图，辅助线（如连接 $AO$、作垂线构造一线三垂直）与数字角（$\angle 1, \angle 2$）在 `step >= 1` 时才以彩色虚线浮现。
3. **SVG 排版与防乱码规范（严禁裸斜杠、严禁裸 `<` 号、严禁中文夹空格）**：
   - **正斜体与下标自动引擎**：壳文件已在 `<script>` 顶部前置挂载 `window.svgAutoFormatText(rawText, baseSize)`、`window.svgFoCard(x, y, w, h, innerHtml, extraStyle)` 与 `window.svgFoLabel(x, y, w, h, innerHtml, extraStyle)`：
     - 凡包含 `S矩形AOBQ`、`S△AOQ`、`k₁`、`x²` 等文本，会自动将几何/代数变量转为 `Times New Roman` 斜体、数字/运算符转为正体、汉字转为宋体，并将面积下标与数字上下标按 `0.75em` 缩放偏移；
     - **严禁在 SVG `<text>` 中直接裸写未转义的 `<` 或 `>`**（如 `x<0` 会被 HTML 解析器误认为非法标签 `<0` 吞掉后续文字造成乱码！必须写成 `&lt;` / `&gt;` 或统一通过 `svgAutoFormatText` 转义输出）；
     - 涉及分式（如 $\frac{1}{2}|k|$、$\frac{(k_1-k_2)^2}{2k_1}$、设元边长 $\frac{4}{3}(4-x)$、$\frac{25-4x}{3}$）的图内悬浮公式卡片与几何边长胶囊框，一律优先调用 `window.svgFoCard` 或 `window.svgFoLabel` 渲染 HTML 原生 `.fraction` 上下叠置分式，**严禁在图内写 `0.5|k|`、`4/3(4-x)` 或 `(25-4x)/3` 单行斜杠拼凑**！
   - 坐标轴刻度数字必须布置在**无双曲线经过的象限侧**（如 $k>0$ 时标在二、四象限侧，$k<0$ 时标在一、三象限侧），且所有刻度与几何字母必须加白色描边光晕（`stroke="#ffffff" stroke-width="3.5" paint-order="stroke"`）防止压线。
4. **函数图象画布全屏放大展示模式（Canvas Full-Screen Zoom）**：
   - 底座内置 `window.toggleCanvasZoom`（支持画布右下角 `🔍 全屏放大图象` 悬浮按钮、步骤控制栏 `🔍 放大图象` 按钮、双击画布空白处、快捷键 `Z` / `ESC`）；
   - 开启全屏放大后，自动收起题干与文字推导步骤，仅在顶部保留互动控制条（`#controls`），画布 100% 占满舞台，支持在全屏大图下拖动动点滑块、切换函数模式及使用荧光笔批注。

---

## 四、多智能体防呆契约与全局 API 白名单（严禁踩坑）

为防止多个子智能体并行编写 `chunk1`、`chunk2`、`chunk3` 时出现接口不一致、DOM 容器缺失、步骤与图形错乱或几何坐标算错，所有子智能体必须严格遵守以下契约：

1. **步骤卡片 ↔ 进度圆点 ↔ 题干填空 ↔ 几何子图“四位一体 1 对 1 同步铁律”**：
   - 每一页的 `.step` 卡片总数 $N$ **必须严格等于** `stepBar(step, N)` 的进度圆点总数 $N$（编译脚本会自动拦截任何不相等的页面）！
   - 当一道题包含多个填空或子图（如图(1)～图(5)）时，**每个填空（`data-step="1"..data-step="N"`）必须独立对应一张 `.step` 卡片（`01 步骤1` ～ `0N 步骤N`）**，严禁把 2 个填空的推导合并塞进同一张 `.step` 卡片导致点一下跳两步、两个空同时蹦出！
   - 右侧 SVG 必须直接由 `step` 驱动切换对应子图（例如 `step = 0` 显示多图总览，`step = 1` 自动放大图(1)，`step = 2` 自动放大图(2)…）。若额外使用了 `modeButtons(key, curVal, items)`，每一项必须传入第 3 个参数 `syncStep`（如 `['1', '方法一', 1]`），使点击模式按钮时同步更新 `state.step`。
2. **优先使用声明式构建器 `window.defineSlide({...})` 与数学坐标底座 `window.createCoordCanvas({...})`**：
   - 使用 `window.defineSlide(cfg)` 自动生成外层 `.screen-page.lab-visible` + `.screen-lower` + `.step.step-locked` 与 `stepBar(step, steps.length)`，从根源上杜绝漏写 DOM 容器或步数不匹配。
   - 使用 `window.createCoordCanvas({ width, height, xRange, yRange })` 传入**真实数学顶点坐标 `[x, y]`** 绘制双曲线、多边形、垂线与直角标，**严禁口算像素坐标手写 `<polygon>`**（杜绝把过原点的斜三角形 $\triangle AOB$ 误画成直角三角形）。
3. **壳文件内置全局函数白名单（已前置挂载，可直接调用，严禁调用未声明的自定义全局函数）**：
   - `window.defineSlide(cfg)`：声明式注册课件页与配套 `sim` 函数（自动保障 `steps.length === maxStep`）。
   - `window.createCoordCanvas(opts)`：真实数学坐标系 SVG 绘图引擎（支持 `.drawAxes()`, `.drawHyperbola()`, `.drawPolygon()`, `.drawSegment()`, `.drawRightAngle()`, `.drawPoint()`, `.drawText()`, `.drawFoCard()`, `.toSvg()`）。
   - `window.renderMultiPanelScene(step, panels, opts)`：一题多图（`图(1)～图(k)`）标准容器，`step = 0` 自动渲染多图网格总览（点击任意子图跳转对应步骤），`step >= 1` 自动放大对应子图并提供 `⊞ 返回多图总览` 按钮。
   - `window.renderStandardCover(cfg)`：标准极简教学封面页渲染器（左侧章节/标题/学习目标，右侧全章统一数学徽章插画）。
   - `activeRoot()`：获取当前活动页根节点 `#content`。
   - `stepBar(step, maxStep)`：生成顶部轻量数字进度圆点条（`💡 推导进度 1 2 3`）。
   - `slider(key, labelHTML, min, max, defaultVal, step, unit)`：生成连续动态探究滑块。
   - `modeButtons(key, curVal, [[val1, label1, syncStep1], [val2, label2, syncStep2], ...])`：生成与步骤同步的多模式/多解法切换按钮组。
   - `isManualOverride(state, key)` / `setManualOverride(state, key)` / `clearManualOverrides(state)`：判断或重置用户手动模式状态。
   - `window.svgAutoFormatText(rawText, baseSize)`：SVG 文本自动去空格、正斜体分词、下标缩放与 HTML 特殊字符安全转义。
   - `window.svgFoCard(x, y, w, h, innerHtml, extraStyle)` / `window.svgFoLabel(x, y, w, h, innerHtml, extraStyle)`：在 SVG 内渲染支持标准二维上下分式 `.fraction` 与 `<sub>`/`<sup>` 的高清公式框。
   - `window.svgLegendBar(items, opts)`：波利亚式顶部通栏色彩图例条（100% 纯原生 SVG 图元渲染，零 `<foreignObject>`、零嵌套 `<svg>`）。
   - `window.svgNumberedAngle(vertex, pStart, pEnd, numStr, opts)`：数字角（`1, 2, 3, 4, 5`）圆弧与角平分线引线标注器。
   - `window.svgCalloutTag(anchorPt, boxRect, innerHtml, opts)`：带圆点引线的求解目标/结论气泡框（如 `求 BC = ?` / `BC = 4√3`）。
4. **顶部章节导航栏配置与字数防溢出红线（必须在 `chunk1_intro_explore.js` 开头声明）**：
   - **字数硬门禁（编译脚本自动校验，超长即报错拦截）**：
     - `window.COURSEWARE_BRAND` $\le 15$ 个字符；
     - `window.COURSEWARE_TITLE` $\le 15$ 个字符；
     - `window.COURSEWARE_PHASES` 每项 `[主标题, 副标题]` 中：**主标题 $\le 7$ 个字符**，**副标题 $\le 10$ 个字符**（严禁写超过 10 字的长句导致顶栏箭头卡片文字挤压截断）。
   ```javascript
   window.COURSEWARE_BRAND = "北师大版九上 · 第二章";
   window.COURSEWARE_TITLE = "2.2.3 k的几何意义";
   window.COURSEWARE_PHASES = [
     ['① 情境引入', '矩形与三角形面积激活'],
     ['② 新知探究', '问题1—4模型探究'],
     ['③ 新知应用', '第1—5题典例精析'],
     ['④ 分层训练', '训练1—3与课堂小结']
   ];
   ```

---

## 五、JS 分块模块（`chunk*.js`）声明式标准代码模板

推荐使用 `window.defineSlide({...})` 结合 `window.createCoordCanvas({...})` 编写每一页，彻底消除手拼 DOM 外壳与手算像素误差：

```javascript
// 1. 封面页（仅在 chunk1 第 1 页调用）
window.defineSlide({
  cover: true,
  chapter: "北师大版九年级数学上册 · 第二章 反比例函数",
  num: "<span class='num'>2.2.3</span>",
  title: "反比例函数中“<i class='m'>k</i>”的几何意义",
  caption: "反比例函数 · 图象对称性与 k 的面积不变性",
  goals: [
    "理解并掌握反比例函数中“<i class='m'>k</i>”的几何意义（<b>重点</b>）；",
    "能灵活运用“<i class='m'>k</i>”的几何意义解决图形面积及求<i class='m'>k</i>值问题（<b>难点</b>）．"
  ]
});

// 2. 标准互动题目页（自动保障 steps 数量 === stepBar 圆点数量 === 填空与图形 1对1 解锁）
window.defineSlide({
  lesson: 1,
  phase: 2, // 0: 情境引入, 1: 新知探究, 2: 新知应用, 3: 分层训练与小结
  navTag: "题1·矩形面积",
  section: "新知应用",
  title: "第<span class='num'>1</span>题：利用<i class='m'>k</i>的几何意义求矩形面积",
  layout: "layout-b",
  stem: `<p><span class="num">1．</span>如图，点<i class="m">P</i>在反比例函数<span class="math"><i class="m">y</i><span class="num">=-</span><span class="fraction"><span><span class="num">2</span></span><span><i class="m">x</i></span></span></span>（<i class="m">x</i><span class="num">&lt;0</span>）的图象上，过点<i class="m">P</i>分别作<i class="m">x</i>轴、<i class="m">y</i>轴的平行线，交坐标轴于点<i class="m">A</i>，<i class="m">B</i>，则矩形<i class="m">OAPB</i>的面积是<span class="screen-blank" data-step="2" data-ans="<span class='num'>2</span>"></span>．</p>`,
  steps: [
    {
      title: "识别过双曲线上一点的双垂线矩形模型",
      html: `点<i class="m">P</i>在反比例函数<span class="math"><i class="m">y</i><span class="num">=-</span><span class="fraction"><span><span class="num">2</span></span><span><i class="m">x</i></span></span></span>图象上，比例系数<span class="math"><i class="m">k</i><span class="num">=-2</span></span>．`
    },
    {
      title: "由 k 的几何意义直接求矩形面积",
      html: `根据反比例函数中<i class="m">k</i>的几何意义：<span class="math"><i class="m">S</i><sub>矩形<i class="m">OAPB</i></sub><span class="num">=|</span><i class="m">k</i><span class="num">|=|-2|=</span><b style="color:#dc2626;">2</b></span>．`
    }
  ],
  onInit(state) {
    state.xP = -1.4;
  },
  controls(step, state) {
    return step >= 1 ? slider('xP', '拖动点<i class="m">P</i>', -3.2, -0.7, state.xP, 0.05) : '';
  },
  renderScene(step, state) {
    const xP = Number(state.xP || -1.4);
    const yP = -2 / xP;
    const cv = window.createCoordCanvas({ width: 500, height: 390, xRange: [-4, 1.5], yRange: [-1, 3.8] });
    cv.drawAxes()
      .drawHyperbola(-2, { branches: ['neg'], color: '#1e293b', width: 2.6 })
      .drawPolygon([[0, 0], [xP, 0], [xP, yP], [0, yP]], {
        fill: step >= 1 ? 'rgba(37,99,235,0.20)' : 'rgba(148,163,184,0.12)',
        stroke: step >= 1 ? '#2563eb' : '#475569'
      })
      .drawRightAngle([xP, 0], [0, 0], [xP, yP])
      .drawRightAngle([0, yP], [0, 0], [xP, yP])
      .drawPoint([xP, yP], { label: 'P', dx: -16, dy: -8, color: '#dc2626' })
      .drawPoint([xP, 0], { label: 'A', dx: -6, dy: 20 })
      .drawPoint([0, yP], { label: 'B', dx: 10, dy: 5 });
    return cv.toSvg();
  }
});
```

### 3.6 多问长题拆页精讲规范（防页面拥挤铁律）

为保障 1600×900 教室希沃大屏上的最佳视觉呼吸感（杜绝顶部 `.screen-stem` 过长挤压下方步骤区、杜绝单页塞入过多推导步骤或同屏堆叠多张不同配图），凡遇到**多问综合题或长题干题**，必须将子问题拆分为连续的多个独立页面（如 `问题2(1)(2)` 与 `问题2(3)`、`第5题(1)` 与 `第5题(2)`）进行分页精讲：

1. **强制拆页触发条件（满足任一即拆页）**：
   - **子问题数量较多**：单道大题包含 $\ge 3$ 个小问（如 `（1）`、`（2）`、`（3）`、`（4）`）；
   - **含数据表格 + 多问**：题干包含实验数据表格（`<table>`）且含有 $\ge 2$ 个小问（如描点建模 + 几何存在性探究）；
   - **含多张不同原题配图**：不同小问对应不同的几何图或函数图（如 `图1` 用于描点拟合、`图2` 用于几何面积求解）；
   - **长背景综合应用题**：题干背景超过 3 行且包含 $\ge 2$ 个综合性子问题（如一次函数与反比例函数分段温控/消毒问题：第 `(1)` 问求两段解析式，第 `(2)` 问求不低于某阈值的持续时长与安全时间）。
2. **拆页后的页面结构规范**：
   - **前一页（如第 `(1)` 问或 `(1)(2)` 问）**：`.screen-stem` 仅展示背景题干（或表格）与当前页所讲的小问；下方 `.screen-notes` 控制在 **2～3 步**，右侧画布专注呈现该小问对应的建模/作图过程。
   - **后一页（如第 `(2)` 问或第 `(3)` 问）**：
     - 顶部 `.screen-stem` 首行使用精简的 **`【前问已知】` 提示条**（1 行高度，带浅蓝左边框）概括前页已求出的函数表达式或关键结论，紧接着只列出当前小问的题干与填空；
     - 下方 `.screen-notes` 集中用 **2～3 步** 透彻拆解当前小问的难点（如临界方程求解、割补法面积列式、分类讨论双解），右侧画布 100% 服务于当前小问的几何/图象动态演示。
   - **单页密度红线**：单页 `.screen-stem` 严禁同时出现“长背景段落 + 数据表格 + 3 个以上小问”；单页 `.step` 步骤卡片数量原则上控制在 **2～3 步**（最多不超过 4 步）。

### 3.7 波利亚级（Polya-Grade）SVG 几何图示清晰标注七大规范（内置全局引擎）

为彻底解决 HTML 课件几何图“标注模糊、只画空角弧不标数字、图内悬浮框遮挡图形、左右图文符号脱节”的问题，所有几何题/综合题 SVG 必须严格执行以下**波利亚解题图级标注规范**（壳文件已内置 `window.svgLegendBar`、`window.svgNumberedAngle`、`window.svgCalloutTag`）：

1. **顶部通栏色彩图例条必配规范（`window.svgLegendBar(items)`）**：
   - 凡 `step >= 1` 出现辅助线、数字角或全等/相似三角形色块时，画布顶部（`y = 6..36`）必须调用 `window.svgLegendBar([...])` 渲染一条清爽的浅灰圆角图例条（如 `[angle] ∠1=∠2=∠3 | [angle] ∠4=∠5 | [dash] BF,EF: 构造筝形 | [tri] △FDE∽△BDF`），图例颜色与图内几何元素 1:1 严格对应；
   - **严禁在图形角落放置大面积矩形悬浮卡片遮挡几何边线**，也严禁在图形正下方放置“图2（原题纯享图）”等压住下顶点的文字标题。
2. **数字角（`1, 2, 3, 4, 5`）图文联动铁律（`window.svgNumberedAngle`）**：
   - **严禁画无字空角弧**，也严禁在图内塞入冗长的 `∠ABF`、`∠CBD` 三字母角标；
   - 凡涉及角平分线、倍角、外角定理或全等/相似导角，必须调用 `window.svgNumberedAngle(vertex, pStart, pEnd, '1', { radius, color, leader })` 在角弧旁标出醒目的纯数字 **`1`、`2`、`3`、`4`、`5`**；
   - **同顶点相邻角阶梯错位**：共顶点的相邻角（如 $\angle 1, \angle 2, \angle 3$）必须采用阶梯递增半径（如 `radius: 26, 33, 40`）错开圆弧，对狭窄角开启 `leader: true` 用细引线引出数字；
   - **左右图文 100% 同步**：左侧 `.step` 步骤卡片必须直接用 `∠1 = ∠2 = ∠3`、`∠4 = ∠5` 书写推导过程（首次定义时写 `作∠ABD的平分线BF，则∠1=∠2=∠3，∠4=∠5`），让学生视线在“左文数字 $\leftrightarrow$ 右图数字”之间零障碍对齐。
3. **求解目标引线标签框规范（`window.svgCalloutTag`）**：
   - 在所求目标线段旁（如求 `BC`），必须调用 `window.svgCalloutTag([anchorX, anchorY], [boxX, boxY, w, h], html, { color, bg })` 绘制带圆点引线的目标框：推导中途显示绿底绿框 **`求 BC = ?`**，最后一步（`step === maxStep`）高亮切换为红底红框 **`BC = 4√3`**。
4. **全等/等腰“短杠标记 + 贴边数值”双重直观标注**：
   - 相等线段必须同步标出法向短杠（第一组等边标单短杠 `/`，第二组等边标双短杠 `//`）；
   - 已知边长（如 `CE = 4`）与全等翻折转移后的边长（如 `EF = 4`）必须沿线段法向偏移 `14–16px` 直接在边旁标出数值 `4`。
5. **视觉层级与色块垫底规范**：
   - 绘制顺序严格遵循：**① 底层柔和三角形色块（透明度 `0.15–0.24`） $\to$ ② 原题实线（深黑 `#0f172a`, `2.6px`）与辅助虚线（朱红 `#dc2626`, `dash="7 4"`） $\to$ ③ 角弧、短杠与直角标 $\to$ ④ 顶层顶点圆点、18px 顶点斜体字母与顶部图例条**。
6. **严禁嵌套子 `<svg>` 铁律（防 `.visual svg` 100% 拉伸污染）**：
   - 在非 `layout-c` 页面的 `#scene` 主 `<svg>` 内部（包括 `<foreignObject>` 内部），**绝对禁止再次嵌套 `<svg>` 标签**！所有图例图标、几何符号必须使用原生 `<path>`、`<polygon>`、`<line>`、`<rect>`、`<circle>` 绘制（`compile_seewo_courseware.py` 已内置 `FORBIDDEN NESTED <svg> DETECTED` 编译门禁）。
7. **`<foreignObject>` 与 `<text>` 全包围盒零碰撞门禁**：
   - 图内所有 `<foreignObject>`（如 `svgFoCard`、`svgCalloutTag`）的矩形包围盒 `(x, y, width, height)` 严禁与任何 `<text>` 顶点字母、边长数值或其他 `<foreignObject>` 重叠（编译脚本自动执行 `SVG FOREIGNOBJECT-TEXT OVERLAP` 与 `FOREIGNOBJECT-FOREIGNOBJECT OVERLAP` 检测）。
8. **相似三角形严禁括号证明符号 & 根号完整顶线（`.sqrt`）门禁**：
   - **相似三角形严禁写 `（AA）` / `（SAS）`**：初中数学规范中仅全等三角形（`≌`）在括号内注 `（SAS）`、`（ASA）`、`（AAS）`、`（SSS）`、`（HL）`；**相似三角形（`∽` 或“相似”）后严禁附加 `（AA）`、`（SAS）`、`（SSS）` 等括号符号**（编译脚本已内置 `FORBIDDEN SIMILARITY PROOF SYMBOL` 门禁拦截）。
   - **根式必须带完整顶线（`.sqrt`）且严禁楷体渲染 `√`**：所有 HTML 文本（含 `.step` 正文、步骤标题、填空 `data-ans` 及 SVG `<foreignObject>` 卡片）中的根号严禁裸写纯文本 `√3`（在楷体下会退化为中文对勾乱码 `∨` 且无顶线），必须使用 `<span class="sqrt"><span class="num">3</span></span>` 渲染为 Times New Roman 正体 `√` + 顶部相连水平顶线（`steps[].title` 已由壳文件 `window.formatInlineMathHTML` 自动转换，编译脚本已内置 `BARE RADICAL '√' WITHOUT .sqrt VINCULUM` 门禁拦截）。
9. **图内所有几何边长与设元代数式 100% 采用标准二维上下叠置分式铁律（严禁单行斜杠 `/` 拼凑）**：
   - **痛点**：在几何与函数题中，设元 $x$ 后导出的边长表达式（如 $NF = \frac{4}{3}(4-x)$、$BF = \frac{25-4x}{3}$），若在 SVG 图中使用 `<text>` 渲染为单行斜杠纯文本（如 `NF=4/3(4-x)` 或 `(25-4x)/3`），既不符合初中数学出版级排版规范，也降低了课堂大屏的教学专业度。
   - **强制实现方案**：
     1. **胶囊标签与贴边数值**：凡包含分式的线段长标签，一律调用 `window.svgFoLabel(x, y, w, h, innerHtml, { bg, border, color })` 或在 `<foreignObject>` 中使用标准 `.fraction` HTML 结构：
        ```javascript
        window.svgFoLabel(20, midNFy - 14, 100, 28, `
          <span class="math"><i class="m">NF</i><span class="num">=</span><span class="fraction"><span><span class="num">4</span></span><span><span class="num">3</span></span></span><span class="num">(4-</span><i class="m">x</i><span class="num">)</span></span>
        `, { bg: '#fff7ed', border: '#fdba74', color: '#c2410c' });
        ```
     2. **带括号长分子分式**：如 $BF = \frac{25-4x}{3}$，渲染为：
        ```javascript
        window.svgFoLabel(20, midBFy - 14, 105, 28, `
          <span class="math"><i class="m">BF</i><span class="num">=</span><span class="fraction"><span><span class="num">25-4</span><i class="m">x</i></span><span><span class="num">3</span></span></span></span>
        `, { bg: '#eff6ff', border: '#93c5fd', color: '#1d4ed8' });
        ```
        分子居中在上方、水平分数线居中、分母在下方，自动去除不必要的分子外层括号。
     3. **模型总结与流程图卡片**：在模型全景卡片中的高比、边长比例（如 $\frac{PF}{PE} = \frac{4}{3}n$），同样必须调用 `.fraction` 或 `svgFoCard` 呈现上下叠置分式，严禁在 `<text>` 中写 `PF/PE = (4/3)n`。
   - **编译门禁拦截（`BARE SLASH FRACTION IN SVG TEXT DETECTED`）**：
     `compile_seewo_courseware.py` 自动扫描所有 chunk 中的 SVG `<text>` 标签内容，若检测到纯文本单行斜杠分式（如 `\d+/\d+` 或 `/\d+\(`），立即报错拦截并提示改用 `svgFoLabel` / `.fraction` 渲染。





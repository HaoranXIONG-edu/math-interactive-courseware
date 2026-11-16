# 数学交互式课件（Math Interactive Courseware）

[![CI Verification](https://github.com/HaoranXIONG-edu/math-interactive-courseware/actions/workflows/verify-courseware.yml/badge.svg)](https://github.com/HaoranXIONG-edu/math-interactive-courseware/actions/workflows/verify-courseware.yml)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/python-3.9+-green.svg)](https://www.python.org/)
[![Platform](https://img.shields.io/badge/platform-Smartboard%20%7C%20Web%20%7C%20iPad-orange.svg)]()

> 面向中学数学课堂教学、教室智慧大屏及触屏设备的学案优化与交互式课件构建工具链。支持从 Word 学案原地 XML 无损修补（`.docx`）到单文件 SVG 动态交互课件（`.html`）的标准化构建与五重门禁校验。

---

## 目录
- [一、系统架构与构建流程](#一系统架构与构建流程)
- [二、三大核心组件库架构（2024北师大版全六册）](#二三大核心组件库架构2024北师大版全六册)
- [三、示范课例与在线预览索引](#三示范课例与在线预览索引)
- [四、自适应页面版式体系（Layouts A–I）](#四自适应页面版式体系layouts-ai)
- [五、几何图示 SVG 动态标注规范](#五几何图示-svg-动态标注规范)
- [六、渐进式呈现与教学节奏控制规范](#六渐进式呈现与教学节奏控制规范)
- [七、工具链与命令行使用说明](#七工具链与命令行使用说明)
- [八、项目目录结构](#八项目目录结构)

---

## 一、系统架构与构建流程

本项目采用**两阶段解耦构建流程**：先完成 Word 学案的结构解析、配图重绘与 XML 无损修补，经审阅定稿后，再以定稿学案为唯一数据源生成对应的单文件交互式 HTML 课件，确保学案与课件的题干、符号及图形坐标完全一致。

<p align="center">
  <img src="docs/assets/architecture_pipeline.svg" width="100%" alt="数学交互式课件与学案双阶段解耦构建架构"/>
</p>

### 阶段一：Word 学案解析与无损修补（`.docx`）
1. **文档解析与公式解码**：运行 `inspect_docx_worksheet.py` 扫描文档 XML 结构，将遗留 MathType `<w:object>`（WMF）与原生 `<m:oMath>` 自动解码为内联 `$LaTeX$`，并导出配图审计原始 DPI、物理宽高与 `<a:srcRect>` 裁剪参数。
2. **几何坐标推导与可解性校验**：除自由动点（如 $A(x_0, k/x_0)$）外，垂足、交点、对称点坐标均由几何条件精确推导，对含参面积或长度问题进行代数消元检验，确保题目唯一可解且题干与配图字母 1:1 对应。
3. **原地无损 XML 修补**：调用 `docx_inplace_patcher.py` 在原 `word/document.xml` 上执行定点替换，保留原模板页边距、页眉、字号（12pt）与 1.5 倍行距，并同步更新 `<mc:AlternateContent>` 双分支。

### 阶段二：交互式动态课件构建与校验（`.html`）
1. **弹性分块并发编写**：以定稿学案为唯一数据源，按课例体量与 SVG 复杂度弹性拆分为 `1～N` 个顺序 JS 模块（微课/演示 `1～2` 块、常规 40 分钟新授课 `3` 块、重度压轴/复习课 `4～6` 块），统一调用 `window.defineSlide({...})`、`window.createCoordCanvas({...})` 与 `window.renderMultiPanelScene(...)`。
2. **编译与五重门禁校验**：运行 `compile_courseware.py` 注入交互壳层并自动执行：
   - JavaScript 语法检查（支持 macOS JXA / Node.js）；
   - 步骤一致性校验（`.step` 卡片数、进度圆点数与 `data-step` 严格对齐，覆盖 `Layouts A–I` 结构契约）；
   - DOM 与公式排版校验（根式顶线 `.sqrt`、二维叠置分式 `.fraction`、禁止嵌套 `<svg>`）；
   - SVG 文本与图形包围盒防重叠碰撞检测；
   - 全页面 `0..maxStep` 无头运行时仿真。

---

## 二、三大核心组件库架构（2024北师大版全六册）

课件底层已全面解耦为**三大独立核心组件库**（聚合入口 [`components/courseware_components.js`](components/courseware_components.js)，在线交互演练场 [`docs/component_library_preview.html`](docs/component_library_preview.html)），完整覆盖 2024 版北师大初中数学七至九年级全六册教学场景。

| 组件库 | 源码路径 | 核心定位 |
| :--- | :--- | :--- |
| **1. 数学公式与图形组件库** | [`components/math_components.js`](components/math_components.js) | 公式排版引擎 + 平面几何 / 函数 / 数轴 / 统计 / 立体几何画板 |
| **2. 页面 UI 与教学交互组件库** | [`components/ui_components.js`](components/ui_components.js) | 北师大教材栏目徽章、零剧透题干填空、波利亚步骤流与版式承载 |
| **3. 课堂黑板批注与尺规作图库** | [`components/annotation_components.js`](components/annotation_components.js) | 双离屏高帧率批注画板、可拖拽/最小化工具坞与 8 种数学尺规工具 |

### 2.1 数学公式与图形组件库（`math_components.js`）
- **公式编译器（`window.MathFormula.render` / `.svg`）**：
  - 自动执行中西文零空格切分、变量 `Times New Roman` 斜体，以及数字、单位、函数名（`Rt|sin|cos|tan|cot|min|max`）和全等判定缩写（`SAS|ASA|AAS|SSS|HL`）正体排版；
  - `\cong` / `≌` 渲染为北师大教材标准矢量全等号，`\sqrt{...}` 渲染为带完整水平顶线的连体矢量根号，`.fraction` 渲染标准上下叠置分式。
- **平面几何与函数画板（`createGeoCanvas` / `createFuncCanvas`）**：
  - 支持波利亚阶梯数字角（$\angle 1, \angle 2$）、切线与尺规作图痕迹、轴对称变换、顶部通栏图例条及无胶囊白描边直接旁注（`segmentLabel` / `targetCallout`）；
  - 函数画板支持一次函数、反比例双曲线、二次抛物线、对称轴与铅垂高 $\triangle PAB$ 智能阴影标注，原点 `O` 与轴标 `x, y` 自动置顶并带白色光晕防压线。
- **统计与立体组件（`createNumberLine` / `createBoxPlot` / `create3DCanvas`）**：
  - 数轴严格遵循北师大八下教材规范（仅正方向带箭头，不等式解集折线末端不带箭头）；箱线图内置防重叠避让；支持正方体截面与圆锥侧面展开图。

### 2.2 页面 UI 与教学交互组件库（`ui_components.js`）
- **教材栏目与上下文承接**：提供 `UI.bookBadge`（还原 2024 北师大教材《尝试·思考》《操作·思考》《随堂练习》徽章）与 `UI.prevContext`（拆页 `【前问已知】` 横幅）。
- **零剧透题干与步骤流**：提供 `UI.stemCard` / `UI.blank` / `UI.choices`（题干下划线填空与选择题网格随步进自动回填）、`UI.stepCard`（`[导角]`、`[表边]`、`[求解]` 动作标签与紧凑无剧透胶囊引导条）、`UI.stepTable` 与 `UI.summaryGrid`。
- **九大自适应版式与板书支持**：配合 `window.defineSlide` 与 `window.renderMindMapScene` 驱动 `Layouts A–I`，支持「✎ 留白板书」（`board-blank-mode`）一键隐藏未展开步骤占位条。

### 2.3 课堂黑板批注与尺规作图库（`annotation_components.js`）
- **可拖拽 / 最小化悬浮批注坞**：支持按住手柄自由拖拽移动位置，点击 `—` 一键最小化为悬浮球，避免遮挡底层数轴与图形；内置触控穿透、二次贝塞尔平滑画笔、正片叠底荧光笔、块状橡皮擦及分页独立撤销/重做栈。
- **8 种初中数学尺规作图工具**（`axes`, `numberline`, `triangle`, `rttriangle`, `circle`, `rect`, `line`, `arrow`）：
  - **轻点即放（Tap-to-Stamp）**：单击即可在落笔点生成标准尺寸完整坐标系或数轴；
  - **坐标系与数轴增强交互**：拖拽生成坐标系后可单独拉动 $+x, -x, +y, -y$ 四端手柄调节各半轴长度及平移原点 $O$（内置固定 `44px` 单位格距、准正方形吸附与淡雅单位网格）；数轴拖拽严格锁定起笔水平线并带垂直对齐引导线与光晕刻度。

---

## 三、示范课例与在线预览索引

仓库内置 **5 节完整示范课例（共 68 页）**、**九大版式全景图鉴（10 页）**、**三大组件库交互演练场**与 **AI 试卷讲评工作台原型**，全部通过五重门禁校验。可直接打开 [index.html](index.html) 门户页浏览：

| 序号 | 课题 / 模块 | 规模与版式 | 在线课件 / 预览 | 配套资料 |
| :---: | :--- | :--- | :--- | :--- |
| **00a** | **三大核心组件库交互演练场** | 组件库全景 | [component_library_preview.html](docs/component_library_preview.html) | [图示标注规范.md](docs/图示标注规范.md) |
| **00b** | **九大自适应版式全景图鉴（A–I）** | 10 页 · Cover + A–I | [layouts_showcase.html](docs/layouts_showcase.html) | [LAYOUTS.md](.agents/skills/math-interactive-courseware/LAYOUTS.md) |
| **01** | **2.2.2 反比例函数的图象（2）** | 15 页 · Layouts A/B | [2.2.2_动态讲解课件.html](lessons/2.2.2_反比例函数的图象（2）/2.2.2_反比例函数的图象（2）_动态讲解课件.html) | [优化版学案.docx](lessons/2.2.2_反比例函数的图象（2）/2.2.2_反比例函数的图象（2）_学生学案_优化版.docx) |
| **02** | **2.2.3 反比例函数中“k”的几何意义** | 16 页 · Layouts A/B | [2.2.3_动态讲解课件.html](lessons/2.2.3_反比例函数中“k”的几何意义/2.2.3_反比例函数中“k”的几何意义_动态讲解课件.html) | [优化版学案.docx](lessons/2.2.3_反比例函数中“k”的几何意义/2.2.3_反比例函数中“k”的几何意义_学生学案_优化版.docx) |
| **03** | **2.3.1 反比例函数的应用（1）** | 18 页 · Layouts A/B/D | [2.3.1_动态讲解课件.html](lessons/2.3.1_反比例函数的应用（1）/2.3.1_反比例函数的应用（1）_动态讲解课件.html) | [优化版学案.docx](lessons/2.3.1_反比例函数的应用（1）/2.3.1_反比例函数的应用（1）_学生学案_优化版.docx) |
| **04** | **2.3.2 反比例函数的应用（2）** | 11 页 · Layout B | [2.3.2_动态讲解课件.html](lessons/2.3.2_反比例函数的应用（2）/2.3.2_反比例函数的应用（2）_动态讲解课件.html) | [优化版学案.docx](lessons/2.3.2_反比例函数的应用（2）/2.3.2_反比例函数的应用（2）_学生学案_优化版.docx) |
| **05** | **第20题 十字双垂旋转模型** | 8 页 · Layout B | [第20题_动态讲解课件.html](lessons/第20题_十字双垂旋转模型/第20题_十字双垂旋转模型_动态讲解课件.html) | 专项几何压轴精讲 |
| **06** | **One·ai 试卷讲评工作台（演示）** | 交互工作台原型 | [One·ai_讲评工作台_动态演示.html](workbench_demo/One·ai_讲评工作台_动态演示.html) | 班级得分热力与错因归因 |

---

## 四、自适应页面版式体系（Layouts A–I）

为适配教室一体机大屏（16:9，标准画布 `1600×900`）与平板触控，课件内置 **1 种标准教学封面 + 9 种自适应版式**（详细配置模板见 [`LAYOUTS.md`](.agents/skills/math-interactive-courseware/LAYOUTS.md)）：

| 版式代号 | 适用场景 | 核心结构与交互特征 |
| :--- | :--- | :--- |
| **`layout-a`** | 纯代数运算、概念辨析 | 100% 全宽居中题干与分步解析，无冗余右侧空栏 |
| **`layout-b`** | 单配图几何 / 函数综合题 | 黄金分割左解右图，步进联动右图辅助线、数字角与色块 |
| **`layout-c`** | 四图函数图象选择题 | 顶部 4 张 SVG 选项图矩阵 + 下方分步排除与正误标记 |
| **`layout-d`** | 列表—描点—连线作图题 | 顶部取点表格 + 左下推导 + 右下交互坐标纸描点连线 |
| **`layout-e`** | 多点坐标验算 / 结论判断 | 顶部题干 + 下方 2/3 列并排验算卡片逐张揭晓 |
| **`layout-f`** | 知识归纳与流程对照 | 含 `example` 时呈现“左要领 ↔ 右演算”对照行；否则呈现 PPT 顶栏知识卡 |
| **`layout-g`** | 一题多解对比 / 正误辨析 | 2/3 列自适应对比卡，含 `badge`、完整过程 + 23px 点评区 `comment` 与底部 `summary` |
| **`layout-h`** | 教研级方法对比表格 | 蓝白渐变表头 + 顶对齐单元格，首列彩色胶囊提示，其余列逐行揭晓 |
| **`layout-i`** | 课堂小结 / 单元思维导图 | 调用 `window.renderMindMapScene` 100% 全宽渲染交互 SVG 导图与底部 `summary` |

---

## 五、几何图示 SVG 动态标注规范

课件中的几何图形完全采用原生高保真 SVG 动态生成：
1. **顶部通栏色彩图例条（`window.svgLegendBar`）**：画布顶部（$y=6\sim 36$）统一渲染浅灰圆角图例条，严禁在图形角落堆叠遮挡边线的悬浮卡片。
2. **数字角图文联动（`window.svgNumberedAngle`）**：共顶点相邻角采用阶梯递增半径（如 $r = 26, 33, 40$）标注纯数字 $\angle 1, \angle 2, \dots$（狭窄角开启 `leader: true`），并与左侧步骤卡片 100% 同步。
3. **求解目标引线气泡框（`window.svgCalloutTag`）**：推导中途显示绿底白字 `求 BC = ?`，末步高亮切换为红底白字最终结果。
4. **全等/等腰短杠与渲染层级**：相等边标注法向短杠（`/`、`//`），按“底层色块 $\to$ 原题实线与辅助虚线 $\to$ 角弧/短杠/直角标 $\to$ 顶层顶点/斜体字母/图例条”渲染。
5. **图内二维叠置分式**：涉及设元边长或比例时统一调用 `window.svgFoLabel` / `window.svgFoCard` 渲染 `.fraction` 叠置分式，编译门禁自动拦截 SVG `<text>` 中的裸斜杠分式。

---

## 六、渐进式呈现与教学节奏控制规范

1. **初始状态（`step = 0`）留白与「✎ 留白板书」模式**：
   - 进入页面时，所有推导步骤默认折叠为紧凑内联胶囊条（`01 展开第 1 步 ▸`，隐藏括号内方法提示以防剧透），填空处保持留白；
   - 点击顶部控制栏 `✎ 留白板书`（`board-blank-mode`）可一键隐藏所有未展开占位条，释放 100% 纯净空白区域供现场手写板书；
   - 无配图题的辅助坐标系在 `step = 0` 仅展示空白坐标轴与网格；有配图题严格还原原题。
2. **定性观察与禁用动态测量读数**：滑块仅用于定性观察图形联动变化，禁止在画布上输出动态测量数值读数。
3. **长题与多问拆页规范**：单页步骤严格控制在 2～3 步；遇到 $\ge 3$ 个小问或长背景应用题时拆分为独立页面，后续页面顶部配置 `【前问已知】` 提示条承接上下文。

---

## 七、工具链与命令行使用说明

### 1. 全仓构建与五重门禁校验 (`scripts/build_all.py`)
```bash
python3 scripts/build_all.py
```
自动遍历全部示范课例与九大版式全景图鉴，合并编译并执行五重门禁全量验证。

### 2. 技能与组件单源同步 (`scripts/sync_skill.sh`)
```bash
./scripts/sync_skill.sh
```
将 `components/*.js` 与 `.agents/skills/math-interactive-courseware/` 同步至本地全局技能目录。

### 3. 学案解析与原地 XML 修补
```bash
python3 .agents/skills/math-interactive-courseware/scripts/inspect_docx_worksheet.py \
  "path/to/学案.docx" --media-out /tmp/audit_media --json-out /tmp/audit_report.json
```
```python
from scripts.docx_inplace_patcher import DocxWorksheetPatcher

patcher = DocxWorksheetPatcher("原学案.docx")
patcher.patch_paragraph(target_index, new_xml_fragment)
patcher.save("优化版学案.docx")
```

### 4. 单课例编译与自动化仿真 (`compile_courseware.py`)
```bash
python3 .agents/skills/math-interactive-courseware/scripts/compile_courseware.py \
  --title "2.2.3 反比例函数中“k”的几何意义" \
  --chunks "lessons/2.2.3_反比例函数中“k”的几何意义/build/chunk1_intro_explore.js" \
           "lessons/2.2.3_反比例函数中“k”的几何意义/build/chunk2_apply.js" \
           "lessons/2.2.3_反比例函数中“k”的几何意义/build/chunk3_train_summary.js" \
  --output "lessons/2.2.3_反比例函数中“k”的几何意义/2.2.3_反比例函数中“k”的几何意义_动态讲解课件.html"
```

---

## 八、项目目录结构

```text
├── components/                                 # 三大核心组件库顶层源码目录
│   ├── math_components.js                      # 数学公式引擎与几何/函数/数轴/3D图形组件库
│   ├── ui_components.js                        # 页面 UI 设计、北师大教材徽章与渐进步骤组件库
│   ├── annotation_components.js                # 课堂黑板批注、可拖拽/最小化工具坞与8种尺规作图库
│   └── courseware_components.js                # 三大核心组件库聚合运行时
├── docs/                                       # 组件库预览、版式图鉴、技术规范与开发总结文档
│   ├── component_library_preview.html          # 三大核心组件库架构总览与交互式黑板演练场
│   ├── layouts_showcase.html                   # 全九大自适应版式全景图鉴（Layouts A–I）
│   ├── build/all_layouts_showcase.js           # 全九大版式全景图鉴源码
│   ├── 图示标注规范.md                          # 数学公式、函数画板与几何动态标注规范细则
│   ├── 数学学案优化与动态交互课件开发规范总结.md  # 双阶段研发全流程总结
│   └── assets/architecture_pipeline.svg        # 双阶段解耦构建架构矢量图
├── .github/workflows/verify-courseware.yml     # GitHub Actions 五重门禁自动化 CI 流水线
├── .agents/skills/math-interactive-courseware/ # 核心技能、组件底座与构建流水线
│   ├── SKILL.md                                # 规范说明书（全套开发规则与接口契约）
│   ├── LAYOUTS.md                              # 全九大自适应版式（Layouts A–I）速查与配置模板
│   ├── layers/                                 # 教室大屏标准 HTML 壳层与组件底座
│   └── scripts/                                # 解析、修补、编译与坐标审计脚本
├── lessons/                                    # 分课时学案与动态课件（成品 HTML/DOCX + build 源码）
├── scripts/
│   ├── build_all.py                            # 全仓课例与版式图鉴一键编译与五重门禁校验脚本
│   └── sync_skill.sh                           # 单一数据源同步脚本（同步 components/ 与全局技能目录）
├── workbench_demo/                             # One·ai 讲评工作台动态演示与构建脚本
├── index.html                                  # 课例门户与 GitHub Pages 在线预览主页
├── requirements.txt                            # Python 运行环境依赖声明
├── LICENSE
└── README.md
```

---

## 许可证
本项目遵照 [MIT License](LICENSE) 进行开源与内部技术共享。

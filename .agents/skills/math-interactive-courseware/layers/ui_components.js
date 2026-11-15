// =========================================================================
// 数学交互式课件 — 页面 UI 设计与教学交互组件库 (ui_components.js v2.2)
// 职责：专门负责课件的页面版式、2024版北师大教材栏目徽章、题干与拆页横幅、
//       零剧透步骤卡片（[导角]/[求解]）、填空/选择网格、步进描点表格、课堂总结矩阵
// 依赖：调用 window.MathFormula.render() 渲染卡片内部的数学公式
// =========================================================================

window.UI_THEME = {
    primary: '#2563eb',
    primaryLight: '#eff6ff',
    primaryBorder: '#bfdbfe',
    accentRed: '#dc2626',
    accentRedLight: '#fef2f2',
    accentOrange: '#d97706',
    accentOrangeLight: '#fffbeb',
    accentGreen: '#059669',
    accentGreenLight: '#ecfdf5',
    accentPurple: '#7c3aed',
    accentPurpleLight: '#f5f3ff',
    textMain: '#0f172a',
    textSub: '#475569',
    border: '#cbd5e1',
    bgCard: '#ffffff',
    bgSoft: '#f8fafc'
};

window._mathRender = function(text) {
    if (window.MathFormula && typeof window.MathFormula.render === 'function') {
        return window.MathFormula.render(text);
    }
    return String(text || '');
};

window.UI = {
    // 1. 文本与内联公式渲染包装
    text: function(rawText) {
        return window._mathRender(rawText);
    },

    // 2. 2024版北师大教材原生栏目徽章（尝试·思考 / 思考·交流 / 操作·思考 / 随堂练习 / 例题）
    bookBadge: function(type, customLabel) {
        const presets = {
            'try-think':   { label: '尝试·思考', bg: 'linear-gradient(135deg,#0284c7,#0369a1)', icon: '💡', border: '#bae6fd' },
            'try-share':   { label: '尝试·交流', bg: 'linear-gradient(135deg,#0d9488,#0f766e)', icon: '💬', border: '#99f6e4' },
            'think-share': { label: '思考·交流', bg: 'linear-gradient(135deg,#2563eb,#1d4ed8)', icon: '🔍', border: '#bfdbfe' },
            'do-think':    { label: '操作·思考', bg: 'linear-gradient(135deg,#7c3aed,#6d28d9)', icon: '📐', border: '#ddd6fe' },
            'observe':     { label: '观察·思考', bg: 'linear-gradient(135deg,#d97706,#b45309)', icon: '👀', border: '#fde68a' },
            'practice':    { label: '随堂练习',  bg: 'linear-gradient(135deg,#059669,#047857)', icon: '✏️', border: '#a7f3d0' },
            'example':     { label: customLabel || '例 1', bg: 'linear-gradient(135deg,#dc2626,#b91c1c)', icon: '📌', border: '#fecaca' }
        };
        const p = presets[type] || { label: customLabel || type, bg: 'linear-gradient(135deg,#2563eb,#1d4ed8)', icon: '📘', border: '#bfdbfe' };
        return `<span class="book-badge" style="display:inline-flex;align-items:center;gap:6px;padding:3px 12px;border-radius:999px;background:${p.bg};color:#fff;font-size:18px;font-weight:700;box-shadow:0 2px 6px rgba(15,23,42,0.12);border:1.5px solid ${p.border};vertical-align:middle;margin-right:8px;line-height:1.3;"><span>${p.icon}</span><span>${p.label}</span></span>`;
    },

    // 3. 零剧透填空横线（到达 revealStep 时自动切换红色高亮答案）
    blank: function(revealStep, answerLatex, minWidth) {
        const w = minWidth ? `min-width:${minWidth}px;` : '';
        return `<!--UI_START--><span class="blank" data-Empty="　　　" data-step="${revealStep}" style="${w}">${window._mathRender(answerLatex)}</span><!--UI_END-->`;
    },

    // 4. 选择题括号 + 响应式选项网格（支持 4 列单行或 2×2 双列）
    choices: function(options, revealStep, answerLetter, cols = 4) {
        const bracket = `<!--UI_START--><span class="choice-bracket" data-step="${revealStep}" data-ans="${answerLetter}">（<span class="choice-ans">　</span>）</span><!--UI_END-->`;
        const gridClass = cols === 2 ? 'options-grid cols-2' : 'options-grid';
        const items = options.map(opt => `<div class="option-item">${window._mathRender(opt)}</div>`).join('');
        return { bracket, grid: `<div class="${gridClass}">${items}</div>` };
    },

    // 5. 题干卡片与多小问列表（支持题源标签、徽章与子问题编号）
    stemCard: function(stemHtml, opts = {}) {
        const badgeHtml = opts.badge ? UI.bookBadge(opts.badge, opts.badgeLabel) : '';
        const sourceHtml = opts.source ? `<span class="tag-source" style="display:inline-block;padding:2px 8px;border-radius:6px;background:#e0f2fe;color:#0369a1;font-size:16px;font-weight:700;margin-right:8px;vertical-align:middle;">${opts.source}</span>` : '';
        const subItems = (opts.subQuestions || []).map((q, idx) =>
            `<div class="sub-q" style="margin-top:8px;padding-left:8px;font-size:22px;line-height:1.55;color:#1e293b;">${window._mathRender(`（${idx + 1}）${q}`)}</div>`
        ).join('');
        return `<div class="problem-stem" style="background:#ffffff;border:1.5px solid #cbd5e1;border-radius:14px;padding:14px 18px;box-shadow:0 2px 8px rgba(15,23,42,0.04);font-size:23px;line-height:1.6;color:#0f172a;">${badgeHtml}${sourceHtml}${window._mathRender(stemHtml)}${subItems}</div>`;
    },

    // 6. 拆页【前问已知】承接横幅（第(2)/(3)问独立成页时顶部展示）
    prevContext: function(summaryText, title = '前问已知') {
        return `<div class="prev-context-banner" style="display:flex;align-items:center;gap:10px;padding:8px 14px;margin-bottom:10px;border-radius:10px;background:linear-gradient(90deg,#eff6ff,#f8fafc);border-left:4px solid #2563eb;border-top:1px solid #dbeafe;border-right:1px solid #dbeafe;border-bottom:1px solid #dbeafe;font-size:19px;color:#1e3a8a;line-height:1.45;">
            <span style="background:#2563eb;color:#fff;font-weight:700;font-size:15px;padding:2px 8px;border-radius:6px;flex-shrink:0;">【${title}】</span>
            <span>${window._mathRender(summaryText)}</span>
        </div>`;
    },

    // 7. 波利亚两字动作标签步骤卡片（[导角] / [表边] / [列式] / [求解]）
    stepCard: function(tag, contentLatex, stepIndex, theme = 'blue') {
        const themes = {
            blue:   { bg: '#eff6ff', border: '#bfdbfe', tagBg: '#2563eb', text: '#1e3a8a' },
            orange: { bg: '#fffbeb', border: '#fde68a', tagBg: '#d97706', text: '#92400e' },
            green:  { bg: '#ecfdf5', border: '#a7f3d0', tagBg: '#059669', text: '#065f46' },
            purple: { bg: '#f5f3ff', border: '#ddd6fe', tagBg: '#7c3aed', text: '#5b21b6' },
            red:    { bg: '#fef2f2', border: '#fecaca', tagBg: '#dc2626', text: '#991b1b' }
        };
        const t = themes[theme] || themes.blue;
        return `<div class="step" data-step="${stepIndex}" style="display:flex;align-items:flex-start;gap:10px;padding:10px 14px;margin-top:8px;border-radius:12px;background:${t.bg};border:1.5px solid ${t.border};font-size:21px;line-height:1.55;color:#0f172a;">
            <span class="step-action-tag" style="display:inline-flex;align-items:center;justify-content:center;padding:2px 9px;border-radius:7px;background:${t.tagBg};color:#fff;font-size:17px;font-weight:700;flex-shrink:0;margin-top:2px;">[${tag}]</span>
            <div style="flex:1;">${window._mathRender(contentLatex)}</div>
        </div>`;
    },

    // 8. 步进描点表格（列表 → 描点 → 连线）
    stepTable: function(cfg) {
        const headers = cfg.headers || [];
        const rows = cfg.rows || [];
        const ths = headers.map((h, i) => `<th style="padding:7px 10px;border:1.5px solid #94a3b8;background:${i === 0 ? '#e2e8f0' : '#f8fafc'};font-weight:700;text-align:center;">${window._mathRender(String(h))}</th>`).join('');
        const trs = rows.map(row => {
            const tds = row.cells.map((cell, idx) => {
                if (idx === 0) {
                    return `<td style="padding:7px 10px;border:1.5px solid #94a3b8;background:#f1f5f9;font-weight:700;text-align:center;">${window._mathRender(String(cell))}</td>`;
                }
                const stepAttr = row.revealStep ? `class="blank" data-Empty="　" data-step="${row.revealStep}"` : '';
                return `<td style="padding:7px 10px;border:1.5px solid #94a3b8;text-align:center;"><span ${stepAttr}>${window._mathRender(String(cell))}</span></td>`;
            }).join('');
            return `<tr>${tds}</tr>`;
        }).join('');
        return `<table class="step-table" style="width:100%;border-collapse:collapse;font-size:20px;margin:8px 0;background:#fff;border-radius:8px;overflow:hidden;"><thead><tr>${ths}</tr></thead><tbody>${trs}</tbody></table>`;
    },

    // 9. 课堂方法总结矩阵卡片（支持 2×2 或 3 列网格）
    summaryGrid: function(cards, cols = 2) {
        const palette = [
            { bg: '#eff6ff', border: '#93c5fd', titleBg: '#2563eb', titleColor: '#ffffff' },
            { bg: '#fffbeb', border: '#fcd34d', titleBg: '#d97706', titleColor: '#ffffff' },
            { bg: '#ecfdf5', border: '#6ee7b7', titleBg: '#059669', titleColor: '#ffffff' },
            { bg: '#f5f3ff', border: '#c4b5fd', titleBg: '#7c3aed', titleColor: '#ffffff' }
        ];
        const items = (cards || []).map((c, idx) => {
            const p = palette[idx % palette.length];
            const stepAttr = c.step ? `class="step" data-step="${c.step}"` : '';
            return `<div ${stepAttr} style="background:${p.bg};border:1.8px solid ${p.border};border-radius:14px;padding:12px 15px;display:flex;flex-direction:column;gap:6px;">
                <div style="display:flex;align-items:center;flex-wrap:wrap;gap:6px 8px;">
                    <span style="background:${p.titleBg};color:${p.titleColor};font-size:15px;font-weight:700;padding:2px 10px;border-radius:999px;white-space:nowrap;flex-shrink:0;">${window._mathRender(c.badge || `要点 ${idx + 1}`)}</span>
                    <span style="font-size:18px;font-weight:700;color:#0f172a;line-height:1.3;">${window._mathRender(c.title || '')}</span>
                </div>
                <div style="font-size:18.5px;line-height:1.5;color:#1e293b;">${window._mathRender(c.body || '')}</div>
            </div>`;
        }).join('');
        return `<div style="display:grid;grid-template-columns:repeat(${cols},minmax(0,1fr));gap:12px;margin-top:8px;">${items}</div>`;
    },

    // 10. 几何/函数画板底栏参数滑块与交互按钮条
    controlBar: function(controls = []) {
        const items = controls.map(ctrl => {
            if (ctrl.type === 'slider') {
                return `<label style="display:inline-flex;align-items:center;gap:8px;font-size:18px;font-weight:700;color:#1e293b;background:#fff;padding:4px 12px;border-radius:999px;border:1.5px solid #cbd5e1;">
                    <span>${window._mathRender(ctrl.label || '参数')}</span>
                    <input type="range" min="${ctrl.min ?? -5}" max="${ctrl.max ?? 5}" step="${ctrl.step ?? 0.5}" value="${ctrl.value ?? 1}" style="accent-color:#2563eb;cursor:pointer;" oninput="${ctrl.onInput || ''}">
                    <span style="color:#2563eb;font-family:'Times New Roman',serif;min-width:28px;text-align:center;">${ctrl.value ?? 1}</span>
                </label>`;
            }
            return `<button type="button" onclick="${ctrl.onClick || ''}" style="padding:5px 14px;border-radius:999px;border:1.5px solid ${ctrl.primary ? '#1d4ed8' : '#cbd5e1'};background:${ctrl.primary ? '#2563eb' : '#ffffff'};color:${ctrl.primary ? '#ffffff' : '#1e293b'};font-size:17px;font-weight:700;cursor:pointer;">${window._mathRender(ctrl.label || '操作')}</button>`;
        }).join('');
        return `<div class="canvas-control-bar" style="display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:10px;padding:8px 12px;background:#f8fafc;border:1.5px solid #e2e8f0;border-radius:12px;margin-top:8px;">${items}</div>`;
    }
};

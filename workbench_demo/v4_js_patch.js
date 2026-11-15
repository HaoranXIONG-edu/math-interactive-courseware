// === V4 核心增强交互逻辑 ===
let globalRevealStats = false;
let currentFigScale = 1.0;
let currentSubTabIdx = 'all'; // 'all', 0, 1
let figIsFloating = false;
let figFloatingPos = { x: 0, y: 0 };
let q3OptScale = 1.0;

// LaTeX 转标准 HTML 公式转换器 (彻底杜绝 raw LaTeX)
function formatMathHtml(text) {
  if (!text) return '';
  let str = text;
  // \frac{A}{B} 替换
  const fracRegex = /\\frac\{([^{}]+)\}\{([^{}]+)\}/g;
  while (fracRegex.test(str)) {
    str = str.replace(fracRegex, '<span class="m-frac"><span class="m-top">$1</span><span class="m-bot">$2</span></span>');
  }
  // 上标 ^2 -> <sup>2</sup>
  str = str.replace(/\^\{([^{}]+)\}/g, '<sup>$1</sup>');
  str = str.replace(/\^([0-9a-zA-Z+-]+)/g, '<sup>$1</sup>');
  // 下标 _1 -> <sub>1</sub>
  str = str.replace(/_\{([^{}]+)\}/g, '<sub>$1</sub>');
  str = str.replace(/_([0-9a-zA-Z+-]+)/g, '<sub>$1</sub>');
  // 替换正负号 \pm
  str = str.replace(/\\pm/g, '±');
  return str;
}

// 切换全局公布/隐藏作答数据
function toggleRevealAllStats() {
  globalRevealStats = !globalRevealStats;
  const btn = document.getElementById('btnToggleAllAnswers');
  const lbl = document.getElementById('lblRevealBtn');
  if (btn && lbl) {
    if (globalRevealStats) {
      btn.classList.add('active');
      lbl.textContent = '🙈 隐藏作答数据';
    } else {
      btn.classList.remove('active');
      lbl.textContent = '👥 展开全部作答';
    }
  }
  // 刷新当前题选项展示状态
  updateOptionsDisplayState();
}

// 刷新选项卡片的显隐状态
function updateOptionsDisplayState() {
  const q = examDatabase[currentQNum];
  if (!q) return;

  // 1. 文字选项卡片
  document.querySelectorAll('.zhixue-text-option-card').forEach(card => {
    const label = card.getAttribute('data-opt-label');
    const opt = q.options ? q.options.find(o => o.label === label) : null;
    if (!opt) return;

    const pill = card.querySelector('.stat-interactive-pill');
    const isClicked = card.getAttribute('data-clicked') === 'true';
    const shouldReveal = globalRevealStats || isClicked;

    if (shouldReveal) {
      if (opt.isCorrect) {
        card.classList.add('revealed-correct');
        card.classList.remove('revealed-wrong');
      } else {
        card.classList.add('revealed-wrong');
        card.classList.remove('revealed-correct');
      }
      if (pill) {
        pill.classList.add('revealed');
        if (opt.isCorrect) pill.classList.add('correct');
        else pill.classList.add('wrong');
        pill.innerHTML = `👥 <strong>${opt.count}人</strong> (${opt.pct}) ${opt.isCorrect ? '✓' : ''}`;
      }
    } else {
      card.classList.remove('revealed-correct', 'revealed-wrong');
      if (pill) {
        pill.classList.remove('revealed', 'correct', 'wrong');
        pill.innerHTML = `📊 查看作答`;
      }
    }
  });

  // 2. 图象选项卡片 (Q3)
  document.querySelectorAll('.zhixue-option-item').forEach(item => {
    const label = item.getAttribute('data-opt-label');
    const opt = q.options ? q.options.find(o => o.label === label) : null;
    if (!opt) return;

    const statBadge = item.querySelector('.q3-opt-stat-badge');
    const isClicked = item.getAttribute('data-clicked') === 'true';
    const shouldReveal = globalRevealStats || isClicked;

    if (statBadge) {
      if (shouldReveal) {
        statBadge.style.display = 'inline-flex';
        statBadge.className = 'q3-opt-stat-badge ' + (opt.isCorrect ? 'correct' : 'wrong');
        statBadge.innerHTML = `${opt.count}人 (${opt.pct})`;
      } else {
        statBadge.style.display = 'none';
      }
    }
  });
}

// 点击单个选项卡片触发交互
function handleOptionCardClick(optLabel) {
  const card = document.querySelector(`.zhixue-text-option-card[data-opt-label="${optLabel}"]`) ||
               document.querySelector(`.zhixue-option-item[data-opt-label="${optLabel}"]`);
  if (card) {
    const wasClicked = card.getAttribute('data-clicked') === 'true';
    card.setAttribute('data-clicked', wasClicked ? 'false' : 'true');
    // 取消其他卡片选定视觉
    document.querySelectorAll('.zhixue-text-option-card').forEach(c => c.classList.remove('active-selected'));
    if (!wasClicked) card.classList.add('active-selected');
    updateOptionsDisplayState();
  }
  // 联动右侧抽屉展示对应学生名单
  filterOptionStudents(optLabel);
}

// 题图交互控制器
function zoomFigure(factor) {
  currentFigScale = Math.max(0.5, Math.min(3.0, currentFigScale * factor));
  applyFigureTransform();
}

function resetFigureScale() {
  currentFigScale = 1.0;
  applyFigureTransform();
}

function pinFigureToCorner() {
  figIsFloating = false;
  figFloatingPos = { x: 0, y: 0 };
  const card = document.getElementById('interactiveFigureCard');
  if (card) {
    card.classList.remove('is-floating');
    card.style.position = '';
    card.style.left = '';
    card.style.top = '';
    card.style.transform = '';
  }
  applyFigureTransform();
}

function applyFigureTransform() {
  const img = document.getElementById('interactiveFigImg');
  if (img) {
    img.style.width = `${Math.round(280 * currentFigScale)}px`;
  }
  const badge = document.getElementById('figScaleBadge');
  if (badge) {
    badge.textContent = `${Math.round(currentFigScale * 100)}%`;
  }
}

// 题图自由拖拽 (衬于文字上方)
function initFigureDraggable(card) {
  if (!card) return;
  const handle = card.querySelector('.fig-drag-handle') || card.querySelector('.fig-toolbar');
  if (!handle) return;

  let isDragging = false;
  let startX = 0, startY = 0;
  let initLeft = 0, initTop = 0;

  function onMouseDown(e) {
    if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return;
    isDragging = true;
    figIsFloating = true;
    card.classList.add('is-floating');

    const rect = card.getBoundingClientRect();
    const parentRect = card.parentElement.getBoundingClientRect();
    
    // 转换为 absolute 定位坐标
    if (!card.style.left) {
      card.style.left = `${rect.left - parentRect.left}px`;
      card.style.top = `${rect.top - parentRect.top}px`;
    }

    startX = e.clientX;
    startY = e.clientY;
    initLeft = parseFloat(card.style.left) || 0;
    initTop = parseFloat(card.style.top) || 0;

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    e.preventDefault();
  }

  function onMouseMove(e) {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    card.style.left = `${initLeft + dx}px`;
    card.style.top = `${initTop + dy}px`;
  }

  function onMouseUp() {
    isDragging = false;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }

  handle.addEventListener('mousedown', onMouseDown);

  // 触摸屏支持 (教室大屏)
  handle.addEventListener('touchstart', function(e) {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    onMouseDown({
      clientX: touch.clientX,
      clientY: touch.clientY,
      target: e.target,
      preventDefault: () => e.preventDefault()
    });
  }, { passive: false });

  window.addEventListener('touchmove', function(e) {
    if (isDragging && e.touches.length === 1) {
      const touch = e.touches[0];
      onMouseMove({ clientX: touch.clientX, clientY: touch.clientY });
    }
  }, { passive: true });

  window.addEventListener('touchend', function() {
    if (isDragging) onMouseUp();
  });
}

// 题图右下角拉伸等比缩放手柄
function initFigureResizer(card) {
  if (!card) return;
  const resizer = card.querySelector('.fig-resize-handle');
  if (!resizer) return;

  let isResizing = false;
  let startX = 0;
  let startScale = 1.0;

  resizer.addEventListener('mousedown', function(e) {
    isResizing = true;
    startX = e.clientX;
    startScale = currentFigScale;
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    e.preventDefault();
    e.stopPropagation();
  });

  function onMouseMove(e) {
    if (!isResizing) return;
    const dx = e.clientX - startX;
    const newScale = Math.max(0.5, Math.min(3.0, startScale + dx / 200));
    currentFigScale = newScale;
    applyFigureTransform();
  }

  function onMouseUp() {
    isResizing = false;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }
}

// 缩放第3题选项图
function zoomQ3Options(factor) {
  q3OptScale = Math.max(0.7, Math.min(2.0, q3OptScale * factor));
  document.querySelectorAll('.zhixue-option-img-box img').forEach(img => {
    img.style.transform = `scale(${q3OptScale})`;
    img.style.transformOrigin = 'center center';
  });
  const lbl = document.getElementById('q3ScaleLabel');
  if (lbl) lbl.textContent = `${Math.round(q3OptScale * 100)}%`;
}

// 加载题目核心渲染
function loadQuestion(num) {
  currentQNum = parseInt(num);
  const q = examDatabase[currentQNum] || examDatabase['3'];
  currentFigScale = 1.0;
  currentSubTabIdx = 'all';

  // 1. 顶部题目标签
  document.getElementById('qTagNum').textContent = `第${q.num}题`;
  document.getElementById('qTagType').textContent = q.type;
  document.getElementById('qTagRate').textContent = `得分率${q.scoreRate}`;
  document.getElementById('qTagRate').classList.toggle('low', !!q.isLow);
  document.getElementById('btnDockCurrentBadge').textContent = `第${q.num}题 ▾`;

  // 2. 题干 (经过安全 LaTeX 过滤与原生公式排版)
  document.getElementById('qStemContent').innerHTML = formatMathHtml(q.stemHtml);

  // 3. 渲染题图 (若有，默认排在题目内容右下方，支持自由拖拽与缩放)
  const figSlot = document.getElementById('figureRenderSlot');
  figSlot.innerHTML = '';
  
  const figSrc = q.figure || (q.figureUrl ? q.figureUrl : null);
  if (figSrc) {
    const figHtml = `
      <div class="zhixue-figure-interactive" id="interactiveFigureCard">
        <div class="fig-toolbar">
          <div class="fig-drag-handle" title="按住拖拽位置 (衬于文字上方/悬浮画中画)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20"/></svg>
            <span>自由拖拽</span>
          </div>
          <div class="fig-actions">
            <button class="fig-btn" onclick="zoomFigure(1.2)" title="等比例放大">➕</button>
            <button class="fig-btn" onclick="zoomFigure(0.85)" title="等比例缩小">➖</button>
            <button class="fig-btn" onclick="resetFigureScale()" title="恢复100%">↺ <span id="figScaleBadge">100%</span></button>
            <button class="fig-btn" onclick="pinFigureToCorner()" title="复位吸附到右下角">📌 靠右下</button>
            <button class="fig-btn" onclick="openLightbox('${figSrc}', '第${q.num}题 原题几何附图')" title="全屏高清放大">⛶</button>
          </div>
        </div>
        <div class="fig-img-box">
          <img id="interactiveFigImg" src="${figSrc}" alt="第${q.num}题原题附图" style="width: 280px;">
          <div class="fig-resize-handle" title="按住等比例拉伸缩放">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M22 22H20V20H22V22ZM22 16H20V18H22V16ZM18 20H16V22H18V20ZM22 12H20V14H22V12ZM14 20H12V22H14V20ZM18 16H16V18H18V16Z"/></svg>
          </div>
        </div>
      </div>
    `;
    figSlot.innerHTML = figHtml;
    // 绑定拖拽与缩放事件
    const cardEl = document.getElementById('interactiveFigureCard');
    initFigureDraggable(cardEl);
    initFigureResizer(cardEl);
  }

  // 4. 选项插槽渲染
  const optSlot = document.getElementById('optionsRenderSlot');
  optSlot.innerHTML = '';

  if (currentQNum === 3) {
    // Q3 图象选择题
    const q3Imgs = {
      'A': b64Assets['q3_A'] || 'courseware_assets/q3_opt_A.png',
      'B': b64Assets['q3_B'] || 'courseware_assets/q3_opt_B.png',
      'C': b64Assets['q3_C'] || 'courseware_assets/q3_opt_C.png',
      'D': b64Assets['q3_D'] || 'courseware_assets/q3_opt_D.png'
    };

    let html = `
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:10px;">
        <span style="font-size:13px; color:#64748b;">💡 点击选项卡片可展开作答人数并联动右侧名单</span>
        <div style="display:inline-flex; align-items:center; gap:6px;">
          <span style="font-size:12px; color:#64748b;">选项图缩放:</span>
          <button class="fig-btn" onclick="zoomQ3Options(1.2)">🔍+ 放大</button>
          <button class="fig-btn" onclick="zoomQ3Options(0.85)">🔍- 缩小</button>
          <button class="fig-btn" onclick="zoomQ3Options(1/q3OptScale)">↺ <span id="q3ScaleLabel">100%</span></button>
        </div>
      </div>
      <div class="zhixue-options-row">
    `;

    q.options.forEach(opt => {
      const imgSrc = q3Imgs[opt.label] || opt.img || `courseware_assets/q3_opt_${opt.label}}.png`;
      html += `
        <div class="zhixue-option-item" data-opt-label="${opt.label}" data-clicked="false" onclick="handleOptionCardClick('${opt.label}')">
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:6px;">
            <span class="zhixue-option-label">${opt.label}.</span>
            <span class="q3-opt-stat-badge" style="display:none; font-size:11px; padding:2px 6px; border-radius:10px;"></span>
          </div>
          <div class="zhixue-option-img-box" style="overflow:hidden;">
            <img src="${imgSrc}" alt="选项${opt.label}" style="transition:transform 0.2s ease-out;">
            <div class="zhixue-zoom-btn" title="查看高清大图" onclick="event.stopPropagation(); openLightbox('${imgSrc}', '第3题 选项 ${opt.label} 坐标系高清图')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
            </div>
          </div>
        </div>
      `;
    });
    html += '</div>';
    optSlot.innerHTML = html;
  } else if (q.options && q.options.length > 0) {
    // 文字/公式选择题 (Q1, Q2, Q4, Q5)
    let html = '<div class="zhixue-text-options-grid">';
    q.options.forEach(opt => {
      const optHtml = opt.html ? opt.html : formatMathHtml(opt.text || '');
      html += `
        <div class="zhixue-text-option-card" data-opt-label="${opt.label}" data-clicked="false" onclick="handleOptionCardClick('${opt.label}')">
          <div style="display:inline-flex; align-items:center; gap:10px;">
            <span style="font-weight:bold; font-family:var(--math-font); font-size:20px; color:#1e293b;">${opt.label}.</span>
            <span style="font-size:18px; font-family:var(--math-font);">${optHtml}</span>
          </div>
          <div class="stat-interactive-pill">📊 查看作答</div>
        </div>
      `;
    });
    html += '</div>';
    optSlot.innerHTML = html;
  }

  // 刷新选项显隐状态
  updateOptionsDisplayState();

  // 5. 更新右侧抽屉列表高亮与统计
  document.querySelectorAll('.drawer-nav-item').forEach(el => {
    el.classList.toggle('active', el.id === 'drawerNavItem_' + currentQNum);
  });
  renderDrawerStats(q);

  if (currentWorkMode === 'slices') {
    renderSlicesCompareView(q);
  }

  // 6. 重绘本题独立批注
  redrawCurrentInkPage();
}

// 渲染右侧作答统计
function renderDrawerStats(q) {
  document.getElementById('statsTitle').textContent = `第${q.num}题作答统计`;
  document.getElementById('statsClassRate').textContent = `班级 得分率${q.scoreRate}`;
  document.getElementById('statsGradeRate').textContent = `年级 得分率${q.gradeRate}`;

  const optContainer = document.getElementById('statsOptionsList');
  optContainer.innerHTML = '';

  if (q.options) {
    q.options.forEach(opt => {
      const row = document.createElement('div');
      row.className = 'option-stat-row';
      row.onclick = () => handleOptionCardClick(opt.label);
      row.innerHTML = `
        <div class="option-stat-header">
          <span style="font-weight:700; color:#1e293b;">${opt.label} ${opt.isCorrect ? '<span style="color:#52c41a; font-size:12px;">(正确)</span>' : ''}</span>
          <span style="font-size:12.5px; color:#64748b;">${opt.count} 人 (${opt.pct})</span>
        </div>
        <div class="option-bar-bg">
          <div class="option-bar-fill ${opt.isCorrect ? 'correct' : 'wrong'}" style="width: ${opt.pct};"></div>
        </div>
      `;
      optContainer.appendChild(row);
    });
  } else if (q.subQuestions && q.subQuestions.length > 0) {
    // 解答题：渲染分问进度条与切换 Tabs
    let tabsHtml = `
      <div class="sub-q-tabs">
        <button class="sub-q-tab-btn ${currentSubTabIdx === 'all' ? 'active' : ''}" onclick="switchSubQuestionTab('all')">整题失分 (${q.wrongStudents ? q.wrongStudents.length : 0}人)</button>
    `;
    q.subQuestions.forEach((sub, sIdx) => {
      const count = sub.wrongStudents ? sub.wrongStudents.length : (sub.wrongCount || 0);
      tabsHtml += `
        <button class="sub-q-tab-btn ${currentSubTabIdx === sIdx ? 'active' : ''}" onclick="switchSubQuestionTab(${sIdx})">第(${sIdx+1})问 (${count}人)</button>
      `;
    });
    tabsHtml += '</div>';
    optContainer.innerHTML = tabsHtml;

    q.subQuestions.forEach((sub, sIdx) => {
      const row = document.createElement('div');
      row.className = 'option-stat-row';
      row.style.cursor = 'pointer';
      row.onclick = () => switchSubQuestionTab(sIdx);
      row.innerHTML = `
        <div class="option-stat-header">
          <span style="font-size:12px; font-weight:600; color:#334155;">${sub.subTitle}</span>
          <span style="font-weight:bold; color:${sub.isLow ? '#dc2626' : '#00bfa5'};">${sub.rate}</span>
        </div>
        <div class="option-bar-bg">
          <div class="option-bar-fill ${sub.isLow ? 'wrong' : 'correct'}" style="width: ${sub.rate};"></div>
        </div>
      `;
      optContainer.appendChild(row);
    });
  }

  // 初始加载失分名单
  showWrongStudentsList(q, currentSubTabIdx);
}

// 切换解答题分问失分名单
function switchSubQuestionTab(tabIdx) {
  currentSubTabIdx = tabIdx;
  const q = examDatabase[currentQNum];
  if (!q) return;

  // 更新 Tab 按钮激活状态
  document.querySelectorAll('.sub-q-tab-btn').forEach((btn, idx) => {
    if (tabIdx === 'all') {
      btn.classList.toggle('active', idx === 0);
    } else {
      btn.classList.toggle('active', idx === (tabIdx + 1));
    }
  });

  showWrongStudentsList(q, tabIdx);
}

// 展示失分名单 (支持整题与分问切换)
function showWrongStudentsList(q, subIdx = 'all') {
  const container = document.getElementById('statsStuChipsContainer');
  const title = document.getElementById('statsStuHeaderTitle');
  const badge = document.getElementById('statsStuCountBadge');

  let wrongs = [];
  if (subIdx === 'all') {
    title.textContent = '整题失分学生名单 (点击看原图)';
    wrongs = q.wrongStudents || [];
  } else if (q.subQuestions && q.subQuestions[subIdx]) {
    title.textContent = `第(${subIdx+1})问失分学生 (点击看原图)`;
    wrongs = q.subQuestions[subIdx].wrongStudents || [];
  }

  badge.textContent = `${wrongs.length}人`;
  container.innerHTML = '';

  if (wrongs.length === 0) {
    container.innerHTML = '<span style="font-size:12.5px; color:#52c41a;">🎉 本问全班全对，无人失分！</span>';
  } else {
    wrongs.forEach(stuInfo => {
      // 提取姓名与分数 (例如 '董玥彤(0.5分)' 或 '沙兴远')
      let stuName = stuInfo;
      let scoreBadge = '';
      if (stuInfo.includes('(')) {
        const parts = stuInfo.split('(');
        stuName = parts[0];
        scoreBadge = `(${parts[1]}`;
      }
      const chip = document.createElement('span');
      chip.className = 'stu-chip wrong';
      const displayName = hidePrivacyNames ? maskStudentName(stuName) : stuName;
      chip.innerHTML = `${displayName} <span class="stu-score">${scoreBadge}</span>`;
      chip.title = `点击查看【${stuName}】本题作答原图`;
      chip.onclick = () => openStudentQuestionDirectSlice(stuName, q.num);
      container.appendChild(chip);
    });
  }
}

// 筛选某选项作答学生
function filterOptionStudents(optLabel) {
  const q = examDatabase[currentQNum];
  if (!q || !q.options) return;
  const opt = q.options.find(o => o.label === optLabel);
  if (!opt) return;

  const container = document.getElementById('statsStuChipsContainer');
  const title = document.getElementById('statsStuHeaderTitle');
  const badge = document.getElementById('statsStuCountBadge');

  title.textContent = `选择 [选项 ${optLabel}] 学生名单`;
  badge.textContent = `${opt.count}人`;
  container.innerHTML = '';

  if (opt.students && opt.students.length > 0) {
    opt.students.forEach(nameInfo => {
      let sName = nameInfo;
      let sScore = '';
      if (nameInfo.includes('(')) {
        const p = nameInfo.split('(');
        sName = p[0];
        sScore = `(${p[1]}`;
      }
      const chip = document.createElement('span');
      chip.className = 'stu-chip ' + (opt.isCorrect ? '' : 'wrong');
      const disp = hidePrivacyNames ? maskStudentName(sName) : sName;
      chip.innerHTML = `${disp} <span class="stu-score">${sScore}</span>`;
      chip.title = `点击查看【${sName}】本题作答原图`;
      chip.onclick = () => openStudentQuestionDirectSlice(sName, q.num);
      container.appendChild(chip);
    });
  } else {
    container.innerHTML = '<span style="font-size:12px; color:#8c8c8c;">无学生选择此项</span>';
  }
}

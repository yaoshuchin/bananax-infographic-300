/**
 * 茶米老師 NotebookLM 資訊圖表風格一覽表 - 主交互邏輯
 */

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  renderCoreStyles();
  renderExtendedStyles();
  initFlowTabs();
  initPromptGenerator();
  initSearchAndFilter();
});

// 1. 主題切換 (Dark / Light)
function initTheme() {
  const themeToggleBtn = document.getElementById("themeToggleBtn");
  const savedTheme = localStorage.getItem("chami_theme") || "dark";
  document.documentElement.setAttribute("data-theme", savedTheme);
  updateThemeIcon(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      const currentTheme = document.documentElement.getAttribute("data-theme");
      const newTheme = currentTheme === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("chami_theme", newTheme);
      updateThemeIcon(newTheme);
    });
  }
}

function updateThemeIcon(theme) {
  const icon = document.querySelector("#themeToggleBtn i");
  if (icon) {
    icon.className = theme === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
  }
}

// 2. 核心 10 大資訊圖表風格渲染
function renderCoreStyles(filterCategory = "all", searchQuery = "") {
  const container = document.getElementById("coreStylesGrid");
  if (!container) return;

  const data = window.INFOGRAPHIC_DATA.coreStyles;
  let filtered = data;

  if (filterCategory !== "all") {
    filtered = filtered.filter(item => item.category.includes(filterCategory));
  }

  if (searchQuery.trim() !== "") {
    const q = searchQuery.toLowerCase().trim();
    filtered = filtered.filter(item =>
      item.name.toLowerCase().includes(q) ||
      item.nameEn.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.features.some(f => f.toLowerCase().includes(q)) ||
      item.caseExample.toLowerCase().includes(q)
    );
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: var(--text-muted);">
        <i class="fa-solid fa-folder-open" style="font-size: 2.5rem; margin-bottom: 12px; display: block;"></i>
        <p style="font-size: 1.1rem;">查無符合「${searchQuery}」的風格項目</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(item => `
    <article class="style-card fade-in" id="card-${item.id}">
      <div class="card-top">
        <div class="card-icon-box">
          <i class="fa-solid ${item.icon}"></i>
        </div>
        <span class="badge badge-${item.badgeColor}">${item.badge}</span>
      </div>

      <div class="card-title-group">
        <h3>${item.name}</h3>
        <span class="en-name">${item.nameEn}</span>
      </div>

      <p class="card-desc">${item.description}</p>

      <div class="card-palette" title="代表配色計畫">
        ${item.colorPalette.map(c => `
          <span class="palette-dot" style="background-color: ${c}" title="${c}"></span>
        `).join("")}
      </div>

      <ul class="card-meta-list">
        <li><i class="fa-solid fa-route"></i> <strong>推薦動線：</strong> ${item.recommendedFlow}</li>
        <li><i class="fa-solid fa-vector-square"></i> <strong>適用尺寸：</strong> ${item.aspectRatio}</li>
        <li><i class="fa-solid fa-lightbulb"></i> <strong>實戰案例：</strong> ${item.caseExample}</li>
      </ul>

      <div class="card-prompt-preview" title="提示詞預覽">
        ${item.promptSnippet}
      </div>

      <div class="card-actions">
        <button class="btn btn-primary" onclick="copyPromptText('${encodeURIComponent(item.promptSnippet)}')">
          <i class="fa-regular fa-copy"></i> 複製提示詞
        </button>
        <button class="btn btn-secondary" onclick="openStyleModal('${item.id}')" title="查看完整規格">
          <i class="fa-solid fa-circle-info"></i>
        </button>
      </div>
    </article>
  `).join("");
}

// 3. 渲染擴充 20 大風格
function renderExtendedStyles(searchQuery = "") {
  const container = document.getElementById("extendedStylesGrid");
  if (!container) return;

  const data = window.INFOGRAPHIC_DATA.extendedStyles;
  let filtered = data;

  if (searchQuery.trim() !== "") {
    const q = searchQuery.toLowerCase().trim();
    filtered = filtered.filter(item =>
      item.name.toLowerCase().includes(q) ||
      item.nameEn.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.tags.some(t => t.toLowerCase().includes(q))
    );
  }

  container.innerHTML = filtered.map(item => `
    <div class="mini-card fade-in">
      <div class="mini-header">
        <span class="mini-title">${item.name}</span>
        <span class="mini-color-indicator" style="background-color: ${item.color}"></span>
      </div>
      <div class="mini-en">${item.nameEn}</div>
      <p class="mini-desc">${item.description}</p>
      <div class="tag-list">
        ${item.tags.map(t => `<span class="tag-badge">#${t}</span>`).join("")}
      </div>
      <div style="margin-top: 14px;">
        <button class="btn btn-secondary" style="width: 100%; padding: 6px 10px; font-size: 0.8rem;" 
          onclick="applyToGenerator('${item.name}', '${item.nameEn}')">
          <i class="fa-solid fa-wand-magic-sparkles"></i> 帶入產生器
        </button>
      </div>
    </div>
  `).join("");
}

// 4. 動線展示切換 (F/S/Z-Pattern)
function initFlowTabs() {
  const flowTabs = document.querySelectorAll(".flow-tab-btn");
  const detailContainer = document.getElementById("flowDetailContainer");
  if (!detailContainer) return;

  flowTabs.forEach(btn => {
    btn.addEventListener("click", () => {
      flowTabs.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const flowId = btn.getAttribute("data-flow");
      renderFlowDetail(flowId);
    });
  });

  // 預設渲染第一個 S型或 F型
  renderFlowDetail("s-pattern");
}

function renderFlowDetail(flowId) {
  const container = document.getElementById("flowDetailContainer");
  const flows = window.INFOGRAPHIC_DATA.visualFlows;
  const flow = flows.find(f => f.id === flowId) || flows[0];

  let visualSVG = "";
  if (flow.id === "f-pattern") {
    visualSVG = `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div class="flow-node" style="border-left: 4px solid var(--accent);"><i class="fa-solid fa-heading"></i> 1. 全幅主標題（眼球第一焦點）</div>
        <div style="display: flex; gap: 12px;">
          <div class="flow-node" style="flex: 2; border-left: 4px solid var(--primary);"><i class="fa-solid fa-list-check"></i> 2. 核心首要條列 / 關鍵指引</div>
          <div class="flow-node" style="flex: 1; opacity: 0.6;"><i class="fa-solid fa-image"></i> 輔助插圖</div>
        </div>
        <div class="flow-node" style="width: 75%; border-left: 4px solid var(--accent-emerald);"><i class="fa-solid fa-circle-dot"></i> 3. 次要步驟 / 細節展開</div>
        <div class="flow-node" style="border-left: 4px solid var(--text-muted);"><i class="fa-solid fa-info"></i> 4. 底部備註與資訊總結</div>
      </div>
    `;
  } else if (flow.id === "s-pattern") {
    visualSVG = `
      <div style="display: flex; flex-direction: column; gap: 14px; position: relative;">
        <div class="flow-node" style="width: 65%; border-left: 4px solid var(--accent-amber);"><i class="fa-solid fa-play"></i> 起點：前置準備與材料</div>
        <div style="text-align: right; padding-right: 20px;"><i class="fa-solid fa-arrow-turn-down" style="color: var(--accent); font-size: 1.5rem;"></i></div>
        <div class="flow-node" style="width: 70%; margin-left: auto; border-left: 4px solid var(--primary);"><i class="fa-solid fa-fire"></i> 步驟 2：核心料理與翻炒</div>
        <div style="text-align: left; padding-left: 20px;"><i class="fa-solid fa-arrow-turn-down" style="color: var(--accent-pink); font-size: 1.5rem; transform: scaleX(-1);"></i></div>
        <div class="flow-node" style="width: 80%; border-left: 4px solid var(--accent-emerald);"><i class="fa-solid fa-trophy"></i> 終點：完美出爐與零失誤美味秘訣</div>
      </div>
    `;
  } else {
    visualSVG = `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div style="display: flex; gap: 16px;">
          <div class="flow-node" style="flex: 1; border-top: 3px solid #ef4444;"><i class="fa-solid fa-circle-xmark" style="color: #ef4444;"></i> 左上：傳統錯誤作法 (DON'T)</div>
          <div class="flow-node" style="flex: 1; border-top: 3px solid #10b981;"><i class="fa-solid fa-circle-check" style="color: #10b981;"></i> 右上：AI 高效新法 (DO)</div>
        </div>
        <div style="text-align: center; color: var(--accent); font-size: 1.2rem; font-weight: bold;">
          <i class="fa-solid fa-bolt"></i> 關鍵痛點交會與對比分析
        </div>
        <div class="flow-node" style="border-top: 3px solid var(--accent);"><i class="fa-solid fa-star"></i> 底部結論：效益翻倍的實踐指南</div>
      </div>
    `;
  }

  container.innerHTML = `
    <div class="flow-visual-box">
      <div style="position: absolute; top: 12px; right: 16px; font-size: 0.8rem; color: var(--text-muted);">
        <i class="fa-solid fa-eye"></i> 視線引導軌跡
      </div>
      ${visualSVG}
    </div>
    <div class="flow-content-box">
      <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
        <i class="fa-solid ${flow.icon}" style="font-size: 1.6rem; color: var(--primary);"></i>
        <h3 style="font-size: 1.5rem; font-weight: 700;">${flow.name}</h3>
      </div>
      <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 16px;">${flow.nameEn}</div>
      <p style="margin-bottom: 14px; font-size: 0.95rem; color: var(--text-main);"><strong>🎯 動線法則：</strong> ${flow.rule}</p>
      <p style="margin-bottom: 14px; font-size: 0.95rem; color: var(--text-sub);"><strong>💡 適用場景：</strong> ${flow.suitable}</p>
      <p style="margin-bottom: 20px; font-size: 0.95rem; color: var(--text-sub);"><strong>🧠 心理認知：</strong> ${flow.userBehavior}</p>
      
      <div style="background: rgba(0,0,0,0.25); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 12px; font-size: 0.85rem; color: var(--accent); margin-bottom: 16px; font-family: monospace;">
        ${flow.promptInject}
      </div>

      <button class="btn btn-primary" onclick="copyPromptText('${encodeURIComponent(flow.promptInject)}')">
        <i class="fa-regular fa-copy"></i> 複製此動線提示語
      </button>
    </div>
  `;
}

// 5. 神級提示詞產生器 (Prompt Generator)
function initPromptGenerator() {
  const form = document.getElementById("promptGenForm");
  if (!form) return;

  const topicInput = document.getElementById("genTopic");
  const styleSelect = document.getElementById("genStyle");
  const flowSelect = document.getElementById("genFlow");
  const aspectSelect = document.getElementById("genAspect");
  const detailInput = document.getElementById("genDetails");
  const outputArea = document.getElementById("genOutput");
  const copyBtn = document.getElementById("genCopyBtn");

  // 初始化風格選單
  if (styleSelect) {
    styleSelect.innerHTML = window.INFOGRAPHIC_DATA.coreStyles.map(s => `
      <option value="${s.name}">${s.name} (${s.nameEn})</option>
    `).join("") + `
      <optgroup label="--- 擴充視覺風格 ---">
        ${window.INFOGRAPHIC_DATA.extendedStyles.map(s => `
          <option value="${s.name}">${s.name} (${s.nameEn})</option>
        `).join("")}
      </optgroup>
    `;
  }

  function updatePrompt() {
    const topic = topicInput.value.trim() || "威靈頓牛排零失敗料理全攻略";
    const style = styleSelect.value;
    const flow = flowSelect.value;
    const aspect = aspectSelect.value;
    const details = detailInput.value.trim();

    let flowDesc = "";
    if (flow === "S型") {
      flowDesc = "採用 S 型路徑引導動線（蜿蜒探索式路線），以箭頭和步驟節點串聯，層層遞進直到最終成果。";
    } else if (flow === "Z型") {
      flowDesc = "採用 Z 型對照比較動線，左右或上下兩側形成鮮明對比，中間以對角線過渡，底部給予總結。";
    } else {
      flowDesc = "採用標準 F 型閱讀動線（由左至右、由上而下），首重頂部大標題與關鍵摘要，接著依序展開各項說明。";
    }

    const generated = `請你扮演一位頂級資訊圖表與視覺設計專家。
根據我提供的資料來源，請自動分析文本內容核心特性，並為我生成一張極致專業、好讀且資訊層次豐富的資訊圖表：

【版面與視覺規範】
1. 主題聚焦：${topic}
2. 版面規格：${aspect}
3. 視覺風格：${style}（兼具視覺張力與資訊易讀性，絕非盲目填塞文字）
4. 視覺引導動線：${flowDesc}
5. 內容結構精煉：
   - 頂部大標題醒目居中，附帶精準副標題
   - 區塊模組化分組（嚴禁冗長贅字，精煉重點與數據指標）
   - 適度留白，輔以視覺化微圖示與指引箭頭
${details ? `6. 客製需求重點：${details}\n` : ""}
【輸出品質與文字標準】
- 圖表內文字強制使用「繁體中文（台灣標準）」
- 文字排版指定使用「Noto Sans TC」高品質清晰字型
- 圖片輸出規格要求達到「4K 超高清品質」輸出`;

    outputArea.textContent = generated;
  }

  [topicInput, styleSelect, flowSelect, aspectSelect, detailInput].forEach(el => {
    if (el) el.addEventListener("input", updatePrompt);
    if (el) el.addEventListener("change", updatePrompt);
  });

  updatePrompt();

  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      copyPromptText(encodeURIComponent(outputArea.textContent));
    });
  }
}

function applyToGenerator(styleName, styleNameEn) {
  const styleSelect = document.getElementById("genStyle");
  if (styleSelect) {
    styleSelect.value = styleName;
    styleSelect.dispatchEvent(new Event("change"));
    document.getElementById("generator").scrollIntoView({ behavior: "smooth" });
    showToast(`已將「${styleName}」帶入提示詞產生器！`);
  }
}

// 6. 搜尋與分類過濾
function initSearchAndFilter() {
  const searchInput = document.getElementById("styleSearchInput");
  const filterBtns = document.querySelectorAll(".filter-btn");

  let currentCategory = "all";
  let currentQuery = "";

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      currentQuery = e.target.value;
      renderCoreStyles(currentCategory, currentQuery);
      renderExtendedStyles(currentQuery);
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentCategory = btn.getAttribute("data-category");
      renderCoreStyles(currentCategory, currentQuery);
    });
  });
}

// 7. Modal 彈出視窗
function openStyleModal(styleId) {
  const item = window.INFOGRAPHIC_DATA.coreStyles.find(s => s.id === styleId);
  if (!item) return;

  const modal = document.getElementById("styleModal");
  const body = document.getElementById("modalBody");
  if (!modal || !body) return;

  body.innerHTML = `
    <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 20px;">
      <div class="card-icon-box" style="width: 60px; height: 60px; font-size: 1.8rem;">
        <i class="fa-solid ${item.icon}"></i>
      </div>
      <div>
        <h2 style="font-size: 1.6rem; font-weight: 800;">${item.name}</h2>
        <div style="color: var(--text-muted); font-size: 0.9rem;">${item.nameEn}</div>
      </div>
      <span class="badge badge-${item.badgeColor}" style="margin-left: auto;">${item.badge}</span>
    </div>

    <p style="font-size: 1.05rem; line-height: 1.6; margin-bottom: 20px; color: var(--text-main);">
      ${item.description}
    </p>

    <div style="margin-bottom: 20px;">
      <h4 style="font-size: 1rem; margin-bottom: 8px;"><i class="fa-solid fa-palette"></i> 色彩方案</h4>
      <div style="display: flex; gap: 10px;">
        ${item.colorPalette.map(c => `
          <div style="display: flex; align-items: center; gap: 6px; font-size: 0.8rem; background: rgba(255,255,255,0.06); padding: 4px 8px; border-radius: 4px;">
            <span class="palette-dot" style="background: ${c}; width: 18px; height: 18px;"></span> ${c}
          </div>
        `).join("")}
      </div>
    </div>

    <div style="margin-bottom: 20px;">
      <h4 style="font-size: 1rem; margin-bottom: 8px;"><i class="fa-solid fa-list-check"></i> 風格核心特徵</h4>
      <ul style="list-style: disc; padding-left: 20px; color: var(--text-sub); font-size: 0.95rem; line-height: 1.6;">
        ${item.features.map(f => `<li>${f}</li>`).join("")}
      </ul>
    </div>

    <div style="margin-bottom: 20px;">
      <h4 style="font-size: 1rem; margin-bottom: 8px;"><i class="fa-solid fa-bullseye"></i> 最適應用場景</h4>
      <div class="tag-list">
        ${item.bestFor.map(b => `<span class="tag-badge" style="font-size: 0.85rem; padding: 4px 10px;">${b}</span>`).join("")}
      </div>
    </div>

    <div style="margin-bottom: 24px;">
      <h4 style="font-size: 1rem; margin-bottom: 8px;"><i class="fa-solid fa-code"></i> 茶米老師標準 Prompt 注入語句</h4>
      <div style="background: rgba(0,0,0,0.3); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 14px; font-family: monospace; font-size: 0.88rem; color: #38bdf8; line-height: 1.5;">
        ${item.promptSnippet}
      </div>
    </div>

    <div style="display: flex; gap: 12px;">
      <button class="btn btn-primary" style="flex: 1;" onclick="copyPromptText('${encodeURIComponent(item.promptSnippet)}')">
        <i class="fa-regular fa-copy"></i> 複製提示詞
      </button>
      <button class="btn btn-secondary" onclick="closeStyleModal()">關閉</button>
    </div>
  `;

  modal.classList.add("active");
}

function closeStyleModal() {
  const modal = document.getElementById("styleModal");
  if (modal) modal.classList.remove("active");
}

// 8. 複製與 Toast 提示
function copyPromptText(encodedText) {
  const text = decodeURIComponent(encodedText);
  navigator.clipboard.writeText(text).then(() => {
    showToast("提示詞已成功複製到剪貼簿！");
  }).catch(err => {
    console.error("複製失敗", err);
    // fallback
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    showToast("提示詞已成功複製到剪貼簿！");
  });
}

function showToast(msg) {
  let toast = document.getElementById("appToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "appToast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${msg}`;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 2800);
}

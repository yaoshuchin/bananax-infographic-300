# BananaX 提示詞庫 300 選 · AI 資訊圖表生成 (2026年)

> 完整收錄與鏡像 **BananaX / Infographic Evaluation (300 Designs)** 繁體中文完整版。  
> 原始來源：[https://furoku.github.io/bananaX/projects/infographic-evaluation/zh/?tab=history#designs](https://furoku.github.io/bananaX/projects/infographic-evaluation/zh/?tab=history#designs)

---

## 🌐 線上展示與部署

- **直接訪問位址**：`https://<你的帳號>.github.io/<專案名稱>/zh/?tab=history#designs`
- **Netlify 一鍵部署**：已內建 `netlify.toml` 與 `_redirects`，可直接於 Netlify 連結本倉庫自動上線！
- **茶米老師專題指南**：附錄收錄 [`chami.html`](chami.html)（NotebookLM 三大視覺動線 F/S/Z、4 步法實戰與 Canva Magic Layers 拆圖後製）。

---

## 📖 系統收錄架構

1. **300 款通用資訊圖表設計風格評估（`zh/evaluation_data.json`）**：
   - 包含每款風格完整提示詞（YAML 結構化與 Prompt）、評分指標、建議標籤、縮圖展示。
   - 支援搜尋、分類標籤、收藏清單與自訂排序（總分、人氣、評估時間）。
2. **45 款商業商務進階提示詞庫（`zh/business_prompts.json`）**：
   - 科技、扁平漸層、幾何、極簡商務等高階排版。
3. **歷史演進與人氣榜單（`style-ranking.json`）**：
   - 即時切換人氣榜單、歷史演進脈絡與設計牆。
4. **完整本地縮圖庫（`assets/images/`）**：
   - 包含 346 張 WebP 高清縮圖，100% 本地化自給自足，不依賴外部伺服器防盜鏈。

---

## 🚀 本地快速啟動

### 方式一：雙擊啟動（推薦）
直接雙擊根目錄下的 **`start_local.bat`**，自動啟動本地伺服器並自動在瀏覽器中開啟：
`http://localhost:8089/zh/?tab=history#designs`

### 方式二：使用 Python 或 Node.js
```bash
# Python
python -m http.server 8089

# 或 npx
npx serve -l 8089 .
```
瀏覽器訪問：`http://localhost:8089/zh/?tab=history#designs`

---

## 📁 目錄結構

```
├── zh/
│   ├── index.html              # 主介面（支援 ?tab=history#designs、即時搜尋、收藏與彈窗複製）
│   ├── evaluation_data.json    # 301 款完整設計、評估數據與完整提示詞
│   ├── evaluation_lite.json    # 輕量快速索引資料
│   └── business_prompts.json   # 45 款商業進階設計提示詞
├── assets/
│   ├── images/                 # 346 張本地 WebP 高清縮圖庫
│   ├── css/                    # 樣式庫與元件樣式
│   └── js/                     # 評估邏輯、徽章標記、互動組件
├── shared/                     # 共用導航、列印樣式與分享元件
├── index.html                  # 首頁自動轉向進入 zh/?tab=history#designs
├── chami.html                  # 茶米老師 NotebookLM 視覺動線與 4 步實戰指南
├── netlify.toml                # Netlify 部署自動化設定
├── _redirects                  # Netlify 轉向路由設定
├── .nojekyll                   # GitHub Pages 資源防屏蔽標記
└── start_local.bat             # 一鍵本機啟動腳本
```

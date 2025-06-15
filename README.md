# Gaming-Setup-Visualizer: 互動式 3D 燈光佈置系統

這是一個基於 Three.js 的 3D 視覺化專案，旨在為一款流行的電競桌，打造一個可擴展的、資料驅動的燈光佈置系統。使用者可以透過簡單的 UI 介面，自由組合、即時預覽多種 LED 燈條的佈置方案。

## ✨ 核心功能

- **即時 3D 預覽**: 在逼真的 3D 場景中，即時查看燈光佈置效果。
- **資料驅動**: 所有燈光位置皆由標準化資料定義，易於擴展與維護。
- **方案切換**: 內建多種預設燈光方案，一鍵切換，輕鬆預覽。
- **高擬真模型**: 包含一個精細的電競桌 3D 模型。
- **動態光效**: 支援動態 RGB 燈光效果，模擬真實的電競氛圍。

## 🛠️ 技術棧

- **核心框架**: [Three.js](https://threejs.org/)
- **語言**: JavaScript (ES6 Modules), HTML5, CSS3
- **開發環境**: 本專案推薦在 [Cursor](https://cursor.sh/) IDE 中進行開發與協作。

## 🚀 本地運行指南 (Getting Started)

本專案是一個純前端應用，不需要複雜的建置流程。

1.  **下載或複製專案**
    ```bash
    git clone [repository-url]
    ```

2.  **進入專案目錄**
    ```bash
    cd [project-directory]
    ```

3.  **啟動本地伺服器**
    本專案需要透過 HTTP 伺服器來運行，以處理 ES6 模組的導入。您可以使用 Python 內建的 `http.server`。
    ```bash
    python -m http.server 8000
    ```
    如果您未安裝 Python，也可以使用 Node.js 的 `http-server` 或 VS Code 的 `Live Server` 擴充功能。

4.  **在瀏覽器中開啟**
    打開您的瀏覽器，並訪問以下網址：
    [http://localhost:8000](http://localhost:8000)

## 📁 專案結構

```
.
├── js/
│   ├── main.js               # 主程式進入點，負責場景初始化與動畫循環
│   ├── scene.js              # 設定 3D 場景、相機、環境光
│   ├── desk.js               # 建立並匯出電競桌模型
│   ├── lighting.js           # 根據傳入的 ID 陣列，動態生成燈光
│   ├── lighting-positions.js # 定義所有可用的燈光位置
│   ├── lighting-schemes.js   # 定義不同的燈光佈置方案 (資料字典)
│   ├── ui.js                 # 動態生成 UI 互動按鈕
│   └── constants.js          # 存放專案中使用的常數
├── index.html                # 專案主頁
└── style.css                 # 頁面樣式
```

## 📈 開發狀態

專案的核心重構已完成，目前進入 **第三階段：對稱性規則與最終化**。
詳細的開發計畫與歷史決策，請參考 `.cursor/rules/project-status-tracker.mdc`。
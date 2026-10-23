@echo off
chcp 65001 >nul
title BananaX 提示詞庫 300 選 - AI 資訊圖表生成
echo ========================================================
echo   BananaX 提示詞庫 300 選 - AI 資訊圖表生成
echo   NotebookLM / Gemini 300 款設計風格評估與提示詞庫
echo ========================================================
echo.
echo 正在啟動本地伺服器：http://localhost:8089 ...
echo 瀏覽器將自動開啟：http://localhost:8089/zh/?tab=history#designs
echo 按 Ctrl+C 可停止伺服器。
echo.

start "" "http://localhost:8089/zh/?tab=history#designs"
python -m http.server 8089
if %ERRORLEVEL% NEQ 0 (
    echo 8089 端口被佔用，嘗試使用 8080 端口...
    python -m http.server 8080
    if %ERRORLEVEL% NEQ 0 (
        npx serve -l 8089 .
    )
)
pause

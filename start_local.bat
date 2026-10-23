@echo off
chcp 65001 >nul
title 茶米老師 NotebookLM 資訊圖表風格一覽表
echo ========================================================
echo   茶米老師 NotebookLM 資訊圖表風格一覽表
echo   視覺動線 (F/S/Z) × 10大核心風格 × 神級提示詞產生器
echo ========================================================
echo.
echo 正在啟動本地伺服器：http://localhost:8089 ...
echo 瀏覽器將自動開啟首頁，按 Ctrl+C 可停止伺服器。
echo.

start "" "http://localhost:8089/index.html"
python -m http.server 8089
if %ERRORLEVEL% NEQ 0 (
    echo Python 伺服器啟動失敗，嘗試使用 8080 端口或 npx serve...
    python -m http.server 8080
    if %ERRORLEVEL% NEQ 0 (
        npx serve -l 8089 .
    )
)
pause

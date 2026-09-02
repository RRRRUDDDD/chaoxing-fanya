@echo off
setlocal EnableDelayedExpansion
cd /d "%~dp0"

echo ========================================
echo   超星泛雅刷课助手 - Electron 桌面版构建
echo ========================================
echo.

REM [1/4] 构建前端
echo [1/4] 构建前端...
pushd web
call npm ci || goto :error
call npm run build || goto :error
popd
echo 前端构建完成
echo.

REM [2/4] 构建后端 exe
echo [2/4] 构建后端 (chaoxing-backend.exe)...
python -m PyInstaller --clean --noconfirm chaoxing-backend.spec || goto :error
echo 后端构建完成
echo.

REM [3/4] 复制后端到 desktop/backend
echo [3/4] 复制后端到 desktop/backend...
if exist desktop\backend rd /s /q desktop\backend
mkdir desktop\backend
xcopy /E /I /Y dist\chaoxing-backend.exe desktop\backend\ >nul || goto :error
echo 后端复制完成
echo.

REM [4/4] 构建 Electron 桌面应用
echo [4/4] 构建 Electron 应用...
pushd desktop
call npm ci || goto :error
call npx electron-builder --win || goto :error
popd
echo.

echo ========================================
echo   构建完成！
echo   安装包位置: desktop\release\
echo ========================================
dir desktop\release\*.exe
exit /b 0

:error
echo.
echo ========================================
echo   构建失败！
echo ========================================
popd
exit /b 1

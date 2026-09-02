@echo off
setlocal EnableDelayedExpansion
cd /d "%~dp0"

echo ========================================
echo   Chaoxing Fanya Desktop Build
echo ========================================
echo.

REM [1/4] Build frontend
echo [1/4] Building frontend...
pushd web
call npm ci || goto :error
call npm run build || goto :error
popd
echo Frontend build complete
echo.

REM [2/4] Build backend exe
echo [2/4] Building backend (chaoxing-backend.exe)...
python -m PyInstaller --clean --noconfirm chaoxing-backend.spec || goto :error
echo Backend build complete
echo.

REM [3/4] Copy backend to desktop/backend
echo [3/4] Copying backend to desktop/backend...
if exist desktop\backend rd /s /q desktop\backend
mkdir desktop\backend
xcopy /E /I /Y dist\chaoxing-backend desktop\backend\chaoxing-backend\ >nul || goto :error
echo Backend copy complete
echo.

REM [4/4] Build Electron desktop app
echo [4/4] Building Electron app...
pushd desktop
call npm ci || goto :error
call npx electron-builder --win || goto :error
popd
echo.

echo ========================================
echo   Build Complete!
echo   Installer: desktop\release\
echo ========================================
dir desktop\release\*.exe
exit /b 0

:error
echo.
echo ========================================
echo   Build Failed!
echo ========================================
popd
exit /b 1

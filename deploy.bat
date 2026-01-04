@echo off
echo === Playbook 2026 Deploy Script ===
echo.

echo [1/4] Pulling latest changes...
git pull origin master
if %errorlevel% neq 0 (
    echo ERROR: Git pull failed!
    pause
    exit /b 1
)

echo.
echo [2/4] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: npm install failed!
    pause
    exit /b 1
)

echo.
echo [3/4] Building executable...
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Build failed!
    pause
    exit /b 1
)

echo.
echo [4/4] Build complete!
echo.
echo Your EXE is ready in: dist\
echo.
echo Next steps:
echo 1. Create GitHub release
echo 2. Upload the EXE from dist\ folder
echo.
pause
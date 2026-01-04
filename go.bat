@echo off
echo === Playbook 2026 Smart Deploy ===
echo.

echo [1/3] Checking for updates...
git pull origin master

echo.
echo [2/3] Building EXE...
call npm install
call npm run build

echo.
echo === COMPLETE! ===
echo.
echo EXE ready in: dist\
echo.
echo To release a new version:
echo 1. Make your changes
echo 2. Run: npm version patch
echo 3. Commit and push
echo 4. Run go.bat again
echo.
pause
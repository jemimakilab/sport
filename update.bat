@echo off
echo === Playbook 2026 Update Script ===
echo.

echo [1/3] Pulling latest changes...
git pull origin master
echo.

echo [2/3] Installing dependencies...
call npm install
echo.

echo [3/3] Building EXE...
call npm run build
echo.

echo === COMPLETE! ===
echo EXE ready in: dist\
echo.
echo To release a new version:
echo 1. Make code changes
echo 2. Run: npm version patch
echo 3. Run: git add . && git commit -m "Your changes" && git push
echo 4. Run this script again
echo.
pause
@echo off
echo === Playbook 2026 Auto-Deploy ===
echo.

echo [1/6] Pulling latest changes...
git pull origin master

echo.
echo [2/6] Installing dependencies...
call npm install

echo.
echo [3/6] Incrementing version...
call npm version patch --no-git-tag-version

echo.
echo [4/6] Committing version bump...
git add package.json package-lock.json
git commit -m "Bump version"
git push origin master

echo.
echo [5/6] Building EXE with new version...
call npm run build

echo.
echo [6/6] Creating GitHub release...
echo Please create release manually at:
echo https://github.com/jemimakilab/sport/releases/new
echo.
echo === COMPLETE! ===
echo.
echo EXE ready in: dist\
echo.
pause
@echo off
echo === Quick Update & Build ===
echo.

REM Auto increment version
echo Incrementing version...
call npm version patch --no-git-tag-version

echo.
echo Committing changes...
git add -A
git commit -m "Version bump and updates"

echo.
echo Pushing to GitHub...
git push origin master

echo.
echo Building EXE...
call npm run build

echo.
echo === DONE! ===
echo Check dist\ folder for the new EXE
pause
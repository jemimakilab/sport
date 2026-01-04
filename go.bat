@echo off
echo === Playbook 2026 Smart Deploy ===
echo.

echo [1/4] Checking for updates...
git fetch origin master

REM Check if there are new commits to pull
git rev-list HEAD...origin/master --count > temp.txt
set /p NEW_COMMITS=<temp.txt
del temp.txt

if %NEW_COMMITS% gtr 0 (
    echo Found %NEW_COMMITS% new commits. Pulling...
    git pull origin master
    echo.
    echo [2/4] Installing dependencies...
    call npm install
) else (
    echo Already up to date.
)

echo.
echo [3/4] Checking for local changes...
git status --porcelain > temp.txt
set /p CHANGES=<temp.txt
del temp.txt

if defined CHANGES (
    echo Found local changes!
    echo.
    
    REM Ask user if they want to commit
    set /p COMMIT_NOW=Commit changes and bump version? (y/n): 
    
    if /i "%COMMIT_NOW%"=="y" (
        echo Incrementing version...
        call npm version patch --no-git-tag-version
        
        echo Committing all changes...
        git add -A
        set /p COMMIT_MSG=Enter commit message: 
        git commit -m "%COMMIT_MSG%"
        
        echo Pushing to GitHub...
        git push origin master
    )
)

echo.
echo [4/4] Building EXE...
call npm run build

echo.
echo === COMPLETE! ===
for /f "tokens=2 delims=:" %%i in ('findstr /c:"version" package.json') do set VERSION=%%i
set VERSION=%VERSION:"=%
set VERSION=%VERSION:,=%
set VERSION=%VERSION: =%

echo Built version:%VERSION%
echo EXE ready in: dist\
echo.

REM Check if should create release
if defined CHANGES if /i "%COMMIT_NOW%"=="y" (
    echo Create GitHub release at:
    echo https://github.com/jemimakilab/sport/releases/new?tag=v%VERSION%
    echo.
)

pause
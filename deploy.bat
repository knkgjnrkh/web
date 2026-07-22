@echo off
setlocal
cd /d "%~dp0"

echo ========================================
echo   [1/3] Building post index (posts.json)
echo ========================================
call :find_python
if errorlevel 1 goto error

%PYTHON_CMD% build.py
if errorlevel 1 goto error

echo.
echo ========================================
echo   [2/3] Committing changes
echo ========================================
git add -A
if errorlevel 1 goto error

git diff --cached --quiet
if errorlevel 2 goto error
if errorlevel 1 goto commit_changes

echo No local changes to commit.
goto push_changes

:commit_changes
echo Changes staged for commit:
git status --short
git commit -m "update posts %date% %time%"
if errorlevel 1 goto error

:push_changes
echo.
echo ========================================
echo   [3/3] Pushing to GitHub
echo ========================================
git push origin main
if errorlevel 1 goto error

echo.
echo ========================================
echo   SUCCESS! Your site is live at:
echo   https://knkgjnrkh.github.io/web/
echo   (wait 1-2 minutes, then refresh)
echo ========================================
goto end

:find_python
python --version >nul 2>nul
if not errorlevel 1 (
  set "PYTHON_CMD=python"
  exit /b 0
)

py -3 --version >nul 2>nul
if not errorlevel 1 (
  set "PYTHON_CMD=py -3"
  exit /b 0
)

echo Python was not found.
echo Install Python 3, or add python/py to PATH, then run this script again.
exit /b 1

:error
echo.
echo !!! Something went wrong. Check the message above. !!!

:end
set /p "DUMMY=Press Enter to exit..."

@echo off
cd /d "%~dp0"

echo ========================================
echo   [1/3] Building post index (posts.json)
echo ========================================
python build.py
if errorlevel 1 goto error

echo.
echo ========================================
echo   [2/3] Committing changes
echo ========================================
git add -A
git commit -m "update posts %date% %time%"

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

:error
echo.
echo !!! Something went wrong. Send the message above to Claude. !!!

:end
pause

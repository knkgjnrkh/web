@echo off
cd /d "%~dp0"

echo Building post index...
python build.py
if errorlevel 1 goto error

echo.
echo Starting local server at http://localhost:8080
echo Press Ctrl+C to stop.
start "" http://localhost:8080
python -m http.server 8080
goto end

:error
echo Build failed. Send the message above to Claude.
pause

:end

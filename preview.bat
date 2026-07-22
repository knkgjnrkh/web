@echo off
setlocal
cd /d "%~dp0"

echo Building post index...
call :find_python
if errorlevel 1 goto error

%PYTHON_CMD% build.py
if errorlevel 1 goto error

set "PORT=8080"
call :port_in_use %PORT%
if errorlevel 1 (
  echo Port %PORT% is already in use. Trying port 8000...
  set "PORT=8000"
  call :port_in_use %PORT%
  if errorlevel 1 (
    echo Port 8000 is also in use. Please close one local server and try again.
    goto error
  )
)

echo.
echo Starting local server at http://localhost:%PORT%
echo Press Ctrl+C to stop.
start "" "http://localhost:%PORT%"
%PYTHON_CMD% -m http.server %PORT%
if errorlevel 1 goto error
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

:port_in_use
netstat -ano | findstr /R /C:":%~1 .*LISTENING" >nul
if errorlevel 1 exit /b 0
exit /b 1

:error
echo Preview failed. Check the message above.
set /p "DUMMY=Press Enter to exit..."

:end

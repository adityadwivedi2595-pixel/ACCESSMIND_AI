@echo off
setlocal
set "ROOT_DIR=%~dp0.."
set "BACKEND_DIR=%ROOT_DIR%\backend"
set "FRONTEND_DIR=%ROOT_DIR%\frontend"
set "BACKEND_URL=http://127.0.0.1:8000/health"
set "FRONTEND_URL=http://localhost:5173"

if not exist "%BACKEND_DIR%\venv\Scripts\python.exe" (
  echo Backend Python environment not found: "%BACKEND_DIR%\venv"
  pause
  exit /b 1
)

if not exist "%FRONTEND_DIR%\package.json" (
  echo Frontend project not found: "%FRONTEND_DIR%"
  pause
  exit /b 1
)

curl.exe --fail --silent --show-error --max-time 2 "%BACKEND_URL%" >nul 2>&1
if not errorlevel 1 goto start_frontend

echo Starting AccessMind backend...
start "AccessMind Backend" /D "%BACKEND_DIR%" cmd /k "venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

set /a attempts=0
:wait_for_backend
curl.exe --fail --silent --show-error --max-time 2 "%BACKEND_URL%" >nul 2>&1
if not errorlevel 1 goto start_frontend
set /a attempts+=1
if %attempts% GEQ 30 goto backend_failed
timeout /t 1 /nobreak >nul
goto wait_for_backend

:start_frontend
curl.exe --fail --silent --show-error --max-time 2 "%FRONTEND_URL%" >nul 2>&1
if not errorlevel 1 goto open_browser

echo Starting AccessMind frontend...
start "AccessMind Frontend" /D "%FRONTEND_DIR%" cmd /k "npm run dev -- --host 127.0.0.1 --port 5173 --strictPort"

set /a attempts=0
:wait_for_frontend
curl.exe --fail --silent --show-error --max-time 2 "%FRONTEND_URL%" >nul 2>&1
if not errorlevel 1 goto open_browser
set /a attempts+=1
if %attempts% GEQ 30 goto frontend_failed
timeout /t 1 /nobreak >nul
goto wait_for_frontend

:open_browser
echo AccessMind is ready at %FRONTEND_URL%
start "" "%FRONTEND_URL%"
exit /b 0

:backend_failed
echo Backend did not start. Check the AccessMind Backend window for errors.
pause
exit /b 1

:frontend_failed
echo Frontend did not start. Check the AccessMind Frontend window for errors.
pause
exit /b 1

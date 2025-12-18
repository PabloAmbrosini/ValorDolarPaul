@echo off
:: Check if we are already running minimized
if not "%minimized%"=="" goto :minimized
set minimized=true
:: Re-launch self minimized
start /min cmd /C "%~dpnx0"
goto :EOF

:minimized
TITLE SERVER - Valor Dolar Paul (NO CERRAR)
echo ===================================================
echo   EL SERVIDOR ESTA CORRIENDO - NO CIERRES ESTO
echo   (Puedes minimizar esta ventana si molesta)
echo ===================================================
echo.

:: Check for node
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: Node.js no esta instalado.
    pause
    exit
)

cd /d "%~dp0"

echo Abriendo navegador...
start "" "http://localhost:4173"

echo Iniciando servidor...
call npm run preview

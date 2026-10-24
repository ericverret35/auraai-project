@echo off
TITLE AuraAI - Console Locale
SETLOCAL
cd /d "%~dp0"
color 0B

echo ===================================================
echo   AURA AI : SYSTEME DE GESTION LOCALE
echo ===================================================
echo.

:: --- ETAPE 1 : VERIFICATION NODE ---
echo [1/3] Verification de Node.js...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    color 0C
    echo [ERREUR] Node.js est introuvable sur votre systeme.
    echo Allez sur https://nodejs.org/ et installez la version LTS.
    echo.
    pause
    exit
)
node -v

:: --- ETAPE 2 : DEPENDANCES ET BUILD ---
echo.
echo [2/3] Verification des fichiers et compilation...
echo (Note : cela peut prendre 1 a 2 minutes la toute premiere fois)
echo.

if not exist "node_modules" (
    echo Installation des modules manquants...
    call npm install --no-audit --no-fund
)

echo Compilation du projet...
call npm run build

if %errorlevel% neq 0 (
    color 0C
    echo [ERREUR] La compilation a echoue. Verifiez les messages au-dessus.
    pause
    exit
)

:: --- ETAPE 3 : LANCEMENT ---
echo.
echo [3/3] Demarrage du serveur sur le port 3000...
if not exist .env (
    copy .env.example .env >nul
)

set PORT=3000
set NODE_ENV=production

echo.
echo ---------------------------------------------------
echo  AURA AI EST ACTIF : http://localhost:3000
echo ---------------------------------------------------
echo  (Gardez cette fenetre ouverte)
echo ---------------------------------------------------
echo.

node dist/server.cjs

if %errorlevel% neq 0 (
    color 0C
    echo.
    echo [ERREUR] Le serveur s'est arrete (Code: %errorlevel%)
    pause
)

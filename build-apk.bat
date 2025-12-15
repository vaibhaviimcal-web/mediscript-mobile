@echo off
REM MediScript Mobile - Automated APK Builder (Windows)
REM This script builds the APK file automatically

echo.
echo ========================================
echo   MediScript Mobile - APK Builder
echo ========================================
echo.

REM Check if we're in the right directory
if not exist "package.json" (
    echo Error: Please run this script from the project root directory
    exit /b 1
)

REM Step 1: Install dependencies
echo Step 1/4: Installing dependencies...
call npm install
if errorlevel 1 (
    echo Failed to install dependencies
    exit /b 1
)
echo Dependencies installed
echo.

REM Step 2: Clean previous builds
echo Step 2/4: Cleaning previous builds...
cd android
call gradlew clean
if errorlevel 1 (
    echo Failed to clean builds
    exit /b 1
)
echo Clean complete
echo.

REM Step 3: Build debug APK
echo Step 3/4: Building APK (this may take 2-5 minutes)...
call gradlew assembleDebug
if errorlevel 1 (
    echo Failed to build APK
    exit /b 1
)
echo APK built successfully
echo.

REM Step 4: Copy APK to root directory
echo Step 4/4: Copying APK to project root...
cd ..
copy android\app\build\outputs\apk\debug\app-debug.apk mediscript-mobile.apk
if errorlevel 1 (
    echo Failed to copy APK
    exit /b 1
)
echo APK copied
echo.

REM Success message
echo.
echo ========================================
echo   SUCCESS! APK built successfully!
echo ========================================
echo.
echo APK Location:
echo   mediscript-mobile.apk
echo.
echo Next Steps:
echo   1. Upload to Google Drive
echo   2. Share link with testers
echo   3. Install on Android device
echo.
echo Installation Instructions:
echo   1. Download APK on Android device
echo   2. Enable 'Install from Unknown Sources'
echo   3. Tap APK file to install
echo   4. Open MediScript AI app
echo.
echo Happy testing!
echo.
pause

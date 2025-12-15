#!/bin/bash

# MediScript Mobile - Automated APK Builder
# This script builds the APK file automatically

echo "🚀 MediScript Mobile - APK Builder"
echo "=================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Step 1: Install dependencies
echo "📦 Step 1/4: Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi
echo "✅ Dependencies installed"
echo ""

# Step 2: Clean previous builds
echo "🧹 Step 2/4: Cleaning previous builds..."
cd android
./gradlew clean
if [ $? -ne 0 ]; then
    echo "❌ Failed to clean builds"
    exit 1
fi
echo "✅ Clean complete"
echo ""

# Step 3: Build debug APK
echo "🔨 Step 3/4: Building APK (this may take 2-5 minutes)..."
./gradlew assembleDebug
if [ $? -ne 0 ]; then
    echo "❌ Failed to build APK"
    exit 1
fi
echo "✅ APK built successfully"
echo ""

# Step 4: Copy APK to root directory
echo "📋 Step 4/4: Copying APK to project root..."
cd ..
cp android/app/build/outputs/apk/debug/app-debug.apk ./mediscript-mobile.apk
if [ $? -ne 0 ]; then
    echo "❌ Failed to copy APK"
    exit 1
fi
echo "✅ APK copied"
echo ""

# Success message
echo "🎉 SUCCESS! APK built successfully!"
echo "=================================="
echo ""
echo "📱 APK Location:"
echo "   ./mediscript-mobile.apk"
echo ""
echo "📊 APK Details:"
ls -lh mediscript-mobile.apk
echo ""
echo "📤 Next Steps:"
echo "   1. Upload to Google Drive"
echo "   2. Share link with testers"
echo "   3. Install on Android device"
echo ""
echo "📖 Installation Instructions:"
echo "   1. Download APK on Android device"
echo "   2. Enable 'Install from Unknown Sources'"
echo "   3. Tap APK file to install"
echo "   4. Open MediScript AI app"
echo ""
echo "✨ Happy testing!"

# 🚀 Quick APK Build Guide

## ⚡ **BUILD APK IN 5 MINUTES**

---

## 🎯 **OPTION 1: AUTOMATED SCRIPT (EASIEST)**

### **Mac/Linux:**
```bash
# 1. Clone repository
git clone https://github.com/vaibhaviimcal-web/mediscript-mobile.git
cd mediscript-mobile

# 2. Make script executable
chmod +x build-apk.sh

# 3. Run build script
./build-apk.sh
```

### **Windows:**
```bash
# 1. Clone repository
git clone https://github.com/vaibhaviimcal-web/mediscript-mobile.git
cd mediscript-mobile

# 2. Run build script
build-apk.bat
```

**Output:** `mediscript-mobile.apk` in project root

---

## 🛠️ **OPTION 2: MANUAL BUILD**

### **Prerequisites:**
- Node.js 18+ installed
- Android Studio installed (for Android SDK)
- Java JDK 11+ installed

### **Steps:**

```bash
# 1. Clone repository
git clone https://github.com/vaibhaviimcal-web/mediscript-mobile.git
cd mediscript-mobile

# 2. Install dependencies
npm install

# 3. Navigate to android folder
cd android

# 4. Build APK
./gradlew assembleDebug

# 5. Find APK at:
# android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 📱 **INSTALL APK ON ANDROID**

### **Method 1: USB Transfer**
1. Connect phone to computer via USB
2. Copy `mediscript-mobile.apk` to phone
3. Open file on phone
4. Enable "Install from Unknown Sources" if prompted
5. Tap "Install"

### **Method 2: Google Drive**
1. Upload `mediscript-mobile.apk` to Google Drive
2. Share link with yourself/others
3. Download on Android phone
4. Install as above

### **Method 3: Email**
1. Email APK to yourself
2. Open email on phone
3. Download attachment
4. Install as above

---

## 🔧 **TROUBLESHOOTING**

### **"npm: command not found"**
Install Node.js: https://nodejs.org

### **"gradlew: command not found"**
Install Android Studio: https://developer.android.com/studio

### **"JAVA_HOME not set"**
Install Java JDK 11+: https://adoptium.net

### **Build fails with "SDK not found"**
1. Open Android Studio
2. Tools → SDK Manager
3. Install Android SDK 33 or 34

### **"Permission denied" on Mac/Linux**
```bash
chmod +x build-apk.sh
chmod +x android/gradlew
```

---

## 📊 **BUILD OUTPUT**

**Expected APK size:** 25-30 MB

**Build time:** 2-5 minutes (first time), 30 seconds (subsequent builds)

**APK name:** `mediscript-mobile.apk` or `app-debug.apk`

---

## ✅ **VERIFICATION**

After build completes, verify:

```bash
# Check APK exists
ls -lh mediscript-mobile.apk

# Should show file size ~25-30 MB
```

---

## 🎉 **SUCCESS!**

You now have `mediscript-mobile.apk` ready to:
- Install on your Android device
- Share with testers
- Upload to Firebase/Appetize.io
- Distribute via Google Drive

---

## 📤 **SHARING THE APK**

### **Google Drive (Recommended):**
1. Upload APK to Google Drive
2. Right-click → Get link
3. Change to "Anyone with the link"
4. Share link

### **Installation Instructions for Recipients:**
```
📱 MediScript AI - Installation Guide

1. Download APK from link
2. Open downloaded file
3. If prompted, enable "Install from Unknown Sources"
   (Settings → Security → Unknown Sources)
4. Tap "Install"
5. Open "MediScript AI" app
6. Configure Groq API key (get free at console.groq.com)
7. Start creating prescriptions!

Questions? Email: vaibhav.iimcal@gmail.com
```

---

## 🚀 **NEXT STEPS**

After building APK:

1. **Test on your device** - Install and verify all features work
2. **Share with beta testers** - Get feedback
3. **Iterate and improve** - Fix bugs, add features
4. **Publish to Play Store** - When ready for production

---

## 💡 **PRO TIPS**

### **Faster Builds:**
```bash
# Use Gradle daemon
echo "org.gradle.daemon=true" >> android/gradle.properties

# Increase memory
echo "org.gradle.jvmargs=-Xmx4096m" >> android/gradle.properties
```

### **Smaller APK:**
```bash
# Build release APK (smaller, optimized)
cd android
./gradlew assembleRelease

# Output: android/app/build/outputs/apk/release/app-release.apk
```

### **Multiple APKs:**
```bash
# Build for specific architecture
./gradlew assembleDebug -Parch=arm64-v8a  # 64-bit ARM
./gradlew assembleDebug -Parch=armeabi-v7a # 32-bit ARM
./gradlew assembleDebug -Parch=x86_64      # 64-bit Intel
```

---

## 📞 **NEED HELP?**

**Build issues?**
- Check TESTING_WITHOUT_PLAYSTORE.md
- GitHub Issues: https://github.com/vaibhaviimcal-web/mediscript-mobile/issues
- Email: vaibhav.iimcal@gmail.com

---

## 🎯 **QUICK REFERENCE**

| Command | Purpose |
|---------|---------|
| `./build-apk.sh` | Automated build (Mac/Linux) |
| `build-apk.bat` | Automated build (Windows) |
| `npm install` | Install dependencies |
| `./gradlew assembleDebug` | Build debug APK |
| `./gradlew assembleRelease` | Build release APK |
| `./gradlew clean` | Clean previous builds |

---

**Happy Building! 🚀**

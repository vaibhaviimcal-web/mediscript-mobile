# 🤖 GitHub Actions - Automatic APK Builds

## ✅ **SETUP COMPLETE!**

Your repository now has **automatic APK building** enabled!

---

## 🎯 **HOW IT WORKS**

### **Automatic Builds:**
Every time you push code to the `main` branch, GitHub Actions will:
1. ✅ Install dependencies
2. ✅ Build Android APK
3. ✅ Upload APK as downloadable artifact
4. ✅ Keep APK for 30 days

**No local setup needed!** Everything runs in the cloud.

---

## 📥 **HOW TO DOWNLOAD APK**

### **Method 1: After Push (Automatic)**

1. **Push code to GitHub:**
   ```bash
   git add .
   git commit -m "Update app"
   git push origin main
   ```

2. **Wait 3-5 minutes** for build to complete

3. **Download APK:**
   - Go to: https://github.com/vaibhaviimcal-web/mediscript-mobile/actions
   - Click on latest "Build Android APK" workflow
   - Scroll down to "Artifacts" section
   - Click "mediscript-mobile-apk" to download

### **Method 2: Manual Trigger (On-Demand)**

1. **Go to Actions tab:**
   https://github.com/vaibhaviimcal-web/mediscript-mobile/actions

2. **Click "Build Android APK"** in left sidebar

3. **Click "Run workflow"** button (top right)

4. **Select branch:** main

5. **Click green "Run workflow"** button

6. **Wait 3-5 minutes** for build

7. **Download APK** from Artifacts section

---

## 🚀 **QUICK START**

### **Get APK Right Now (2 clicks):**

1. **Trigger build:**
   - Go to: https://github.com/vaibhaviimcal-web/mediscript-mobile/actions/workflows/build-apk.yml
   - Click "Run workflow" → "Run workflow"

2. **Download APK:**
   - Wait 3-5 minutes
   - Refresh page
   - Click on the workflow run
   - Download from "Artifacts"

**That's it!** No coding, no setup, just download!

---

## 📊 **BUILD STATUS**

### **Check Build Status:**

**Badge (add to README.md):**
```markdown
![Build Status](https://github.com/vaibhaviimcal-web/mediscript-mobile/actions/workflows/build-apk.yml/badge.svg)
```

**Live Status:**
- Green ✅ = Build successful, APK ready
- Red ❌ = Build failed, check logs
- Yellow 🟡 = Build in progress

---

## 🎯 **TWO WORKFLOWS AVAILABLE**

### **1. Build Android APK (Debug)**
- **Trigger:** Every push to main OR manual
- **Output:** Debug APK (for testing)
- **Size:** ~30 MB
- **Retention:** 30 days
- **Use for:** Testing, sharing with beta testers

### **2. Build Release APK**
- **Trigger:** Manual only
- **Output:** Release APK (optimized)
- **Size:** ~25 MB (smaller, optimized)
- **Retention:** 90 days
- **Use for:** Production, Play Store preparation

---

## 📱 **APK NAMING**

APKs are automatically named with version numbers:

**Debug APK:**
```
mediscript-mobile-v1.apk
mediscript-mobile-v2.apk
mediscript-mobile-v3.apk
```

**Release APK:**
```
mediscript-mobile-v1.0.0.apk
```

Version number = GitHub Actions run number (auto-increments)

---

## 🔄 **WORKFLOW DETAILS**

### **Build Process:**

```
1. Checkout code from GitHub
   ↓
2. Setup Node.js 18
   ↓
3. Setup Java JDK 17
   ↓
4. Install npm dependencies
   ↓
5. Make gradlew executable
   ↓
6. Clean previous builds
   ↓
7. Build APK (3-5 minutes)
   ↓
8. Upload APK as artifact
   ↓
9. ✅ Done! Download ready
```

**Total time:** 3-5 minutes

---

## 📥 **DOWNLOAD INSTRUCTIONS**

### **For You (Developer):**

1. Go to: https://github.com/vaibhaviimcal-web/mediscript-mobile/actions
2. Click latest successful workflow (green ✅)
3. Scroll to "Artifacts"
4. Click "mediscript-mobile-apk"
5. ZIP file downloads
6. Extract APK from ZIP
7. Install on Android device

### **For Testers:**

**Share these instructions:**

```
📱 MediScript AI - Beta Testing

1. Download APK:
   - Go to: [GITHUB_ACTIONS_LINK]
   - Click "mediscript-mobile-apk"
   - Extract ZIP file
   - Get APK file

2. Install on Android:
   - Transfer APK to phone
   - Enable "Unknown Sources" in Settings
   - Tap APK to install
   - Open MediScript AI

3. Setup:
   - Get free API key: console.groq.com
   - Enter in app Settings
   - Start creating prescriptions!

Questions? Email: vaibhav.iimcal@gmail.com
```

---

## 🎨 **CUSTOMIZATION**

### **Change Build Trigger:**

Edit `.github/workflows/build-apk.yml`:

```yaml
# Build on every push
on:
  push:
    branches: [ main ]

# OR build only on tags
on:
  push:
    tags:
      - 'v*'

# OR build on schedule (daily at 2 AM)
on:
  schedule:
    - cron: '0 2 * * *'
```

### **Change APK Name:**

Edit workflow file:

```yaml
- name: 📋 Rename APK
  run: |
    cp android/app/build/outputs/apk/debug/app-debug.apk \
       output/my-custom-name.apk
```

### **Add Slack/Discord Notifications:**

Add to workflow:

```yaml
- name: 📢 Notify on Slack
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    text: 'APK build completed!'
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

---

## 🔐 **SECURITY**

### **What's Safe:**
- ✅ Code is public (already on GitHub)
- ✅ Build process is transparent
- ✅ No secrets in workflow
- ✅ APK is unsigned (for testing only)

### **What to Protect:**
- 🔒 Don't commit API keys
- 🔒 Don't commit keystore files
- 🔒 Use GitHub Secrets for sensitive data

### **Add Secrets:**

1. Go to: Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add:
   - `GROQ_API_KEY` (optional)
   - `KEYSTORE_PASSWORD` (for signed builds)

---

## 📊 **MONITORING**

### **Build Logs:**

1. Go to Actions tab
2. Click on workflow run
3. Click "build" job
4. See detailed logs for each step

### **Common Issues:**

**Build fails at "Install dependencies":**
- Check package.json syntax
- Verify all dependencies are valid

**Build fails at "Build APK":**
- Check Android code for errors
- Review Gradle configuration

**APK not appearing:**
- Wait for full workflow completion
- Check "Artifacts" section (bottom of page)

---

## 🎯 **BEST PRACTICES**

### **1. Version Control:**
```bash
# Tag releases
git tag -a v1.0.0 -m "Version 1.0.0"
git push origin v1.0.0
```

### **2. Changelog:**
Keep `CHANGELOG.md` updated:
```markdown
## [1.0.0] - 2024-12-15
### Added
- Voice recognition
- AI prescription generation
- Offline database
```

### **3. Testing:**
- Test APK before sharing
- Verify all features work
- Check on different devices

---

## 🚀 **ADVANCED: AUTO-RELEASE**

### **Automatic GitHub Releases:**

Create `.github/workflows/auto-release.yml`:

```yaml
name: Auto Release

on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build APK
        run: |
          npm ci
          cd android && ./gradlew assembleRelease
      
      - name: Create Release
        uses: softprops/action-gh-release@v1
        with:
          files: android/app/build/outputs/apk/release/*.apk
          body: |
            ## MediScript Mobile ${{ github.ref_name }}
            
            Download APK and install on Android device.
            
            ### Installation:
            1. Download APK
            2. Enable Unknown Sources
            3. Install and enjoy!
```

**Usage:**
```bash
git tag v1.0.0
git push origin v1.0.0
# Automatic release created with APK!
```

---

## 📞 **SUPPORT**

### **Build Issues?**

1. **Check workflow logs:**
   - Actions → Click failed run → View logs

2. **Common fixes:**
   ```bash
   # Update dependencies
   npm update
   
   # Clear cache
   cd android && ./gradlew clean
   ```

3. **Still stuck?**
   - GitHub Issues: https://github.com/vaibhaviimcal-web/mediscript-mobile/issues
   - Email: vaibhav.iimcal@gmail.com

---

## ✅ **CHECKLIST**

- [ ] GitHub Actions workflows created
- [ ] Pushed to main branch
- [ ] First build triggered automatically
- [ ] APK downloaded successfully
- [ ] APK tested on Android device
- [ ] Shared with beta testers

---

## 🎉 **SUCCESS!**

You now have:
- ✅ Automatic APK builds on every push
- ✅ Manual build trigger anytime
- ✅ 30-day APK retention
- ✅ Version-numbered APKs
- ✅ No local setup needed

**Just push code → Wait 5 mins → Download APK!** 🚀

---

## 🔗 **QUICK LINKS**

- **Actions Dashboard:** https://github.com/vaibhaviimcal-web/mediscript-mobile/actions
- **Latest APK:** https://github.com/vaibhaviimcal-web/mediscript-mobile/actions/workflows/build-apk.yml
- **Trigger Build:** Click "Run workflow" on Actions page

---

**Happy Building! 🎉**

# 💻 Local Installation & Development

Get Tempow running on your machine for testing or development.

---

## 🚀 Quick Start (All Platforms)

### **Option A: Using Node.js** (Easiest)

```bash
# 1. Clone or download the project
git clone https://github.com/yourname/tempow.git
cd tempow

# 2. Start the development server (no dependencies needed!)
npm start
# or: yarn start
# or: pnpm start

# 3. Open browser
# → Navigate to http://localhost:3000
# → App should load!

# 4. Install the app
# → Look for install button in address bar (Chrome/Edge)
# → Or: Shift+Cmd+M (Mac) / Ctrl+Shift+M (Windows)
```

✅ **Done! App running locally with PWA support**

---

### **Option B: Python (Built-in)**

```bash
# If you have Python installed:
cd /path/to/tempow

# Python 3
python -m http.server 3000

# Python 2
python -m SimpleHTTPServer 3000

# Then open: http://localhost:3000
```

---

### **Option C: Use any local web server**

```bash
# Node.js http-server
npx http-server . -p 3000 -o

# PHP (if installed)
cd tempow && php -S localhost:3000

# Ruby
ruby -run -ehttpd . -p3000

# Go
# go run "net/http/server"

# Any HTTP server works!
```

---

## 🔧 Setup by Operating System

### **Windows**

#### Node.js Method
```batch
# 1. Install Node.js from nodejs.org

# 2. Open Command Prompt in tempow folder
cd C:\Users\YourName\Desktop\tempow

# 3. Start server
npm start

# 4. Browser opens automatically
```

#### Python Method
```batch
cd C:\Users\YourName\Desktop\tempow
python -m http.server 3000
# Then: http://localhost:3000
```

---

### **macOS**

#### Node.js Method
```bash
# 1. Install Node.js
# Option A: Download from nodejs.org
# Option B: Using Homebrew
brew install node

# 2. Navigate to tempow
cd ~/Desktop/tempow  # or wherever you downloaded

# 3. Start server  
npm start

# Browser should open automatically
```

#### Python Method (Built-in)
```bash
cd ~/Desktop/tempow
python3 -m http.server 3000
# Then: http://localhost:3000
```

---

### **Linux**

#### Debian/Ubuntu
```bash
# Install Node.js
sudo apt update
sudo apt install nodejs npm

# Navigate and start
cd ~/tempow
npm start
```

#### Fedora/RHEL
```bash
sudo dnf install nodejs npm
cd ~/tempow
npm start
```

#### Arch
```bash
sudo pacman -S nodejs npm
cd ~/tempow
npm start
```

#### Using Python (already installed)
```bash
cd ~/tempow
python3 -m http.server 3000
```

---

## ✅ Verify Installation

After starting the server, check:

### **1. App loads**
- [ ] Open `http://localhost:3000`
- [ ] See Tempow interface with ⏱ Timer, ◕ Clock, 📊 Reports tabs

### **2. Service Worker registers**
- [ ] Open DevTools: F12 or Right-Click → Inspect
- [ ] Go to **Application** tab
- [ ] Look for **Service Workers** section
- [ ] Should show "Service Worker" as "Active"

### **3. PWA features work**
- [ ] Try to add a task
- [ ] Refresh page (Ctrl+R / Cmd+R)
- [ ] Task should still be there ✓

### **4. Offline mode (offline testing)**
- [ ] In DevTools → Network tab
- [ ] Check **"Offline"** checkbox
- [ ] Refresh page
- [ ] App should still load completely (even content) ✓

### **5. Install button appears**
- [ ] **Chrome/Edge**: Look in address bar
- [ ] **Firefox**: May appear in menu or installation prompt
- [ ] **Safari Mac**: May not show one (use Share button instead)

---

## 🛠️ Development Workflow

### **Edit & Live Reload**

Unfortunately, the current setup doesn't have hot reload. To see changes:

```bash
# 1. Edit any file (HTML, CSS, or JS in <script> tags)
# 2. Save the file
# 3. Refresh browser (Ctrl+R / Cmd+R)
# 4. Changes appear instantly
```

### **Don't need to restart the server** — just refresh the browser!

---

## 🐛 Troubleshooting Local Setup

### **Port already in use**
```
❌ Error: "Address already in use"
✅ Solution: Use different port
  npm start:8000
  python -m http.server 8000
  # Then open: http://localhost:8000
```

### **Permission denied**
```
❌ Error: "Permission denied"
✅ Solution:
  # Linux/Mac: Add sudo if needed
  sudo npm install -g http-server
  # Or change file permissions
  sudo chown -R $USER tempow/
```

### **CORS errors**
```
❌ Error: "CORS policy blocked"
✅ Solution:
  # These shouldn't occur on localhost
  # If they do, check browser console for actual error
  # Likely a file is missing
```

### **Service Worker not registering**
```
❌ Errors in DevTools
✅ Solution:
  # 1. Check MIME type
  #    DevTools → Network → service-worker.js
  #    Should show "application/javascript"
  # 
  # 2. Hard refresh (clear cache)
  #    Ctrl+Shift+R (Windows/Linux)
  #    Cmd+Shift+R (Mac)
  #
  # 3. Update checking too fast?
  #    Wait 30+ seconds and refresh
```

### **Data not persisting**
```
❌ Task disappears after refresh
✅ Solution:
  # 1. Check your not in private/incognito mode
  #    (Private mode doesn't persist data)
  #
  # 2. Check DevTools → Application → Storage
  #    Look for "Local Storage" → http://localhost:3000
  #
  # 3. Increase quota if needed
  #    Browser usually allows 5-10MB
```

---

## 📊 Testing Checklist

Before deploying to production, test:

### **Core Functionality**
- [ ] Add task → task appears
- [ ] Start timer → timer counts down
- [ ] Pause task → shows break timer
- [ ] Complete task → marks as done
- [ ] Delete task → task removed

### **24-Hour Clock**
- [ ] Add availability window
- [ ] Add task to clock
- [ ] Drag task to reschedule
- [ ] Overlap detection works
- [ ] Free time gaps show

### **Reports**
- [ ] View daily report
- [ ] Filter by date range
- [ ] Metrics calculate correctly
- [ ] Export works

### **PWA Features**
- [ ] Install works
- [ ] Works offline
- [ ] Notifications (if enabled)
- [ ] Service Worker active

### **Data Persistence**
- [ ] Refresh persists data
- [ ] Different tabs share data
- [ ] Clear browser data → resets app
- [ ] Export/import works

### **Performance**
- [ ] Loads in <3 seconds
- [ ] No console errors
- [ ] Smooth animations
- [ ] No memory leaks

---

## 🧪 Advanced Testing

### **Lighthouse Audit**
```bash
# Using Chrome:
# 1. Open DevTools (F12)
# 2. Go to "Lighthouse" tab
# 3. Click "Generate report"
# 4. Check all scores ≥ 90

# Using CLI:
npm install -g @lhci/cli@0.11.x
lhci autorun
```

### **Device Emulation**
```bash
# In Chrome DevTools:
# 1. Press Ctrl+Shift+M (or Cmd+Shift+M)
# 2. Select device (iPhone, Pixel, etc.)
# 3. Test responsive design
# 4. Test install prompt on mobile
```

### **Network Throttling**
```bash
# DevTools → Network tab:
# 1. Find throttling dropdown (default: "No throttling")
# 2. Select "Slow 3G" or "Fast 3G"
# 3. Refresh and see performance
# 4. Service Worker should still work
```

### **Offline Testing**
```bash
# DevTools → Network tab:
# 1. Check "Offline" checkbox
# 2. Refresh page (Ctrl+R)
# 3. App should work completely
# 4. Try all features offline
```

---

## 📦 Building for Production

No build step needed! Tempow is ready to deploy as-is.

However, if you want to optimize:

```bash
# Minify HTML (optional)
npm install -g html-minifier
html-minifier --input-dir . --output-dir dist --file-ext html

# Create deployment package
npm run backup
# Creates: tempow-backup-YYYYMMDD.tar.gz

# Then upload dist/ or compressed file to server
```

---

## 🔗 Related Guides

- **Deploying to production?** → See [DEPLOY.md](DEPLOY.md)
- **Want to modify features?** → See code comments in index.html
- **Need help?** → Check [README.md](README.md) for full docs

---

## ✨ Tips

1. **Use Chrome DevTools** for best debugging
2. **Always test offline** before shipping
3. **Check manifest.json** for PWA metadata
4. **Lighthouse score** should be 90+ for all categories
5. **Device testing** important for mobile PWAs

---

**Happy developing! 🎉**

If you're ready to deploy, follow the guide in [DEPLOY.md](DEPLOY.md)

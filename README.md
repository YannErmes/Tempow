# Tempow — Task Timer & 24-Hour Clock Planner

> **Advanced productivity companion with smart break management, 24-hour clock scheduling, and detailed analytics**

## 🚀 Installation Guide

### Install as an App (Recommended)

Tempow is a **Progressive Web App (PWA)** that works on any device with a web browser. It can be installed like a native app and works fully offline.

#### **Desktop (Chrome, Edge, Firefox)**
1. Open Tempow in your browser
2. Look for the **Install** button in the address bar (or press `Ctrl+Shift+M` / `Cmd+Shift+M`)
3. Click **Install** and confirm
4. Tempow now appears in your applications menu and works offline ✓

#### **iPhone/iPad (Safari)**
1. Open Tempow in Safari
2. Tap the **Share** button (⬆️ at bottom)
3. Scroll down and tap **Add to Home Screen**
4. Tap **Add** to confirm
5. Tempow appears on your home screen with offline support ✓

#### **Android (Chrome, Firefox, Edge)**
1. Open Tempow in your browser
2. Tap the **⋮ menu** (three dots)
3. Select **Install app** or **Add to Home screen**
4. Confirm with **Install**
5. Tempow now has its own app icon and works offline ✓

#### **Windows (Edge)**
1. Open Tempow in Microsoft Edge
2. Click the **App install** icon (+ in address bar)
3. Click **Install**
4. Edge creates a dedicated window — you can also pin it to Start Menu
5. Full offline support enabled ✓

---

## 📋 Features

### ⏱️ **Flow Timer** Page
- **Smart Pomodoro-style** task timing with configurable work/break cycles
- **Break management** with notes and automatic overrun alerts
- **Progress tracking** with visual bars showing work vs. break time
- **Auto-save** — all data persists automatically
- **Bulk export/import** via JSON for backup & sharing

### 🕐 **24-Hour Clock** Page
- **Visual task planner** — place tasks on a 24h radial clock
- **Availability windows** — set your working hours
- **Automatic overlap detection** — prevents double-booking
- **Color-coded tasks** — instant visual organization
- **Drag-to-reschedule** — reposition tasks in real-time
- **Free time gaps** — highlights breaks between tasks

### 📊 **Analytics & Reports** Page
- **Focus Score** — work-to-break ratio tracking
- **Daily activity charts** — productivity trends over time
- **Task completion rates** — success metrics
- **Break logs** — detailed notes on every pause
- **Custom date ranges** — today, this week, this month, all-time
- **Downloadable reports** — beautiful HTML reports

---

## 💾 Data & Persistence

### Automatic Backup
- **All data is saved locally** in your browser using IndexedDB + localStorage
- **Auto-save triggers** on every action (no manual saves needed)
- **Survives crashes** — data persists even if browser closes unexpectedly
- **Works offline** — no internet required for full functionality

### Export & Import
```
📥 Download Tasks
  → All tasks as .json
  → Completed tasks only
  → Individual task backups

📤 Import Tasks
  → Drag & drop .json files
  → Merge with existing or replace all
  → Supports both Flow and Clock formats
```

### Sync to Server (Optional)
You can optionally sync data to a cloud server by:
1. Export your tasks as JSON
2. Upload to your cloud storage (Drive, iCloud, Dropbox, etc.)
3. Import from any device by downloading the file

---

## ⚙️ Technical Details

### Progressive Web App Technology
Tempow uses modern web standards for native app experience:

| Component | Purpose |
|-----------|---------|
| **Service Worker** | Offline caching, background sync |
| **Web App Manifest** | Install prompt, app metadata |
| **IndexedDB** | Large data storage |
| **localStorage** | Quick data persistence |
| **Device Notifications** | Break alerts + Task reminders |

### Browser Support
✅ Chrome/Chromium v90+  
✅ Firefox v88+  
✅ Safari v15+ (iOS/macOS)  
✅ Edge v90+  
✅ Mobile browsers (Android, iOS)  

### Offline Capabilities
- **100% functional offline** after first load
- App shell cached for instant loading
- All task operations work without internet
- Data syncs when connection returns (optional)

---

## 🛠️ Self-Hosting

### Option 1: Deploy with Platform (Easiest)
Deploy to free services in one click:

- **Vercel**: `npm run deploy:vercel`
- **Netlify**: Drag & drop the folder
- **GitHub Pages**: Enable in Settings
- **Cloudflare Pages**: Connect your repo

### Option 2: Use Any Web Server
```bash
# Copy all files to your web server
cp -r ./* /var/www/tempow/

# Ensure these files are served:
# - index.html (with .html MIME type)
# - manifest.json (with application/json MIME type)
# - service-worker.js (with application/javascript MIME type)
# - All assets with proper MIME types
```

### Server Headers (Important)
```nginx
# nginx example
server {
    add_header Service-Worker-Allowed "/";
    add_header Cache-Control "public, max-age=3600";
}
```

### HTTPS Required
- Service Workers require **HTTPS** in production
- Use **Let's Encrypt** for free SSL certificates
- `http://localhost` works for local development

---

## 📲 Recommended Setup

### Best Experience
1. **Install the app** (don't just bookmark)
2. **Enable notifications** for break alerts
3. **Pin to taskbar/dock** for quick access
4. **Periodic backups** — export JSON monthly

### For Team Use
1. Each person installs individually
2. Share templates via JSON export
3. Optional: self-host for enterprise control

---

## 🔒 Privacy & Security

✅ **All data stored locally** — never sent to servers (unless YOU upload)  
✅ **No tracking** — no analytics, no ads, no cookies  
✅ **Open source ready** — transparent code, no hidden features  
✅ **Works offline** — doesn't require external services  

---

## 🐛 Troubleshooting

### "Install button not showing"
- **Chrome/Edge**: Look for `⊕` icon in address bar
- **Firefox**: Some versions show install option in menu instead
- **Safari iOS**: Use Share → Add to Home Screen
- Installation requires HTTPS (use `https://` not `http://`)

### "Data not syncing"
- Check browser settings — allow IndexedDB
- Disable privacy mode (private browsing blocks persistence)
- Try another browser to verify data isolation
- Data is stored **per browser/device** — log in separately if needed

### "Notifications not working"
- Browser must have permission — check Settings
- Notifications only work in installed mode on some browsers
- iOS doesn't support push notifications for web apps yet

### "Service Worker won't update"
- Uninstall and reinstall the app
- Clear browser cache: Settings → Clear Browsing Data
- Or: Hard refresh the page (Ctrl+Shift+R / Cmd+Shift+R)

---

## 📚 Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Enter` (in modal) | Confirm action |
| `Esc` | Close modals |
| `Ctrl+A` | Select all tasks |
| `Ctrl+J` | Export tasks |
| `Cmd+,` | Open settings (future) |

---

## 🚀 Performance

- **Initial load**: ~2 seconds
- **Cached load**: <500ms (instant)
- **Data operations**: Real-time (no delay)
- **Storage**: ~5MB for 1000 tasks
- **Memory**: Minimal (<50MB typical)

---

## 📝 License & Attribution

**Tempow** — Built with focus in mind

Fonts:
- **Syne** (display) — https://fonts.google.com/specimen/Syne
- **DM Mono** (mono) — https://fonts.google.com/specimen/DM+Mono

---

## 💡 Tips & Tricks

### Maximize Productivity
1. **Set realistic work blocks** — 25-50min range optimal
2. **Use notes on breaks** — track what refreshes you most
3. **Review reports weekly** — adjust habits based on focus score
4. **Color-code by project** — visual task organization
5. **Plan next day** on Clock page — see your schedule

### Export Workflow
- Weekly JSON backups via export button
- Store in cloud (Drive, Dropbox)
- Import to new device when needed
- Merging preserves all data

### Multiple Devices
- Install on each device independently
- Each stores its own data locally
- Optional: export from one, import to others for sync

---

## 🤝 Support & Feedback

- **Found a bug?** Check browser console (F12)
- **Have ideas?** Consider opening GitHub issues
- **Self-hosting issues?** Check MIME types and HTTPS setup

---

## 🎯 Future Roadmap

- [ ] Team collaboration (shared workspaces)
- [ ] Sub-tasks & dependencies
- [ ] Integration with calendar apps
- [ ] Voice commands
- [ ] AI-powered focus recommendations
- [ ] Dark/light theme toggle
- [ ] More analytics dashboards

---

**Made for focused developers, designers, and deep workers.**

Current Version: **2.0.0** (PWA Edition)  
Last Updated: 2024  
Status: ✅ Production Ready

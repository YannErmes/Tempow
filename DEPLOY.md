# 🚀 Tempow Deployment Guide

Deploy Tempow to the internet with one of these methods.

---

## Option 1: Free Cloud Deployment (Easiest) 

### **Vercel** (Recommended)
```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Deploy from project directory
cd /path/to/tempow
vercel

# 3. Login and follow prompts
# → Your app is live at auto-generated URL
# → Automatic HTTPS ✓
# → Custom domain optional
```

**Result**: Live at `tempow.vercel.app` → Custom domain in 5 minutes

---

### **Netlify**
```bash
# Method A: Drag & drop
1. Go to https://netlify.com
2. Drag the entire `tempow` folder into the browser
3. Done! Get instant URL

# Method B: CLI
npm install -g netlify-cli
cd /path/to/tempow
netlify deploy --prod
```

**Result**: Live at `yourname.netlify.app` → HTTPS automatic

---

### **GitHub Pages** (Free, but basic)
```bash
# 1. Create GitHub cuenta if needed

# 2. Create repo named: username.github.io
#    (or any repo, then enable Pages)

# 3. Push files
git init
git add .
git commit -m "Initial Tempow deployment"
git branch -M main
git remote add origin https://github.com/username/username.github.io.git
git push -u origin main

# 4. In GitHub: Settings → Pages → set to main branch

# ⚠️ Note: Service Workers require HTTPS
#   GitHub Pages provides HTTPS automatically
```

**Result**: Live at `username.github.io`

---

### **Cloudflare Pages**
```bash
# 1. Connect GitHub repo in Cloudflare dashboard
# 2. Build command: (leave empty)
# 3. Publish directory: . (current directory)
# 4. Click Deploy

# Or via CLI:
npm install -g wrangler
wrangler pages publish .
```

**Result**: Live with Cloudflare's infrastructure ✓

---

## Option 2: Your Own Server (Full Control)

### **Prerequisites Required**
- [ ] Web hosting with root/SSH access
- [ ] Domain name (optional but recommended)
- [ ] Basic command line knowledge

### **Setup with Docker** (Recommended)
```bash
# 1. SSH into your server
ssh user@yourserver.com

# 2. Clone/upload Tempow files
git clone https://github.com/yourname/tempow.git
cd tempow

# 3. Start with Docker Compose
docker-compose up -d

# 4. Access at http://yourserver.com
```

**With SSL (Let's Encrypt)**
```bash
# Update domain in docker-compose.yml first
docker-compose --profile ssl up -d certbot

# Automatic renewal:
docker-compose run certbot renew
```

---

### **Manual Setup with Nginx**

**1. Upload files to server**
```bash
scp -r ./* user@server.com:/var/www/tempow/
```

**2. Install Nginx**
```bash
sudo apt update
sudo apt install nginx certbot python3-certbot-nginx
```

**3. Copy config**
```bash
sudo cp nginx.conf /etc/nginx/nginx.conf
sudo nano /etc/nginx/nginx.conf
# Update server_name to your domain
```

**4. Setup HTTPS**
```bash
sudo certbot certonly --webroot -w /var/www/certbot -d yourdomain.com
```

**5. Enable & restart**
```bash
sudo systemctl enable nginx
sudo systemctl restart nginx
```

---

### **Apache Setup**

**1. Upload files**
```bash
scp -r ./* user@server.com:/var/www/html/tempow/
```

**2. Enable mods**
```bash
sudo a2enmod rewrite
sudo a2enmod headers
sudo a2enmod deflate
```

**3. Copy .htaccess**
```bash
sudo cp .htaccess /var/www/html/tempow/
sudo chown www-data:www-data /var/www/html/tempow -R
```

**4. Setup HTTPS**
```bash
sudo apt install certbot python3-certbot-apache
sudo certbot certonly --apache -d yourdomain.com
```

**5. Restart Apache**
```bash
sudo systemctl restart apache2
```

---

## Option 3: Shared Hosting (cPanel)

1. **Upload files**
   - Use cPanel File Manager or FTP
   - Upload all files to `public_html` directory

2. **Set public_html path**
   - Copy `.htaccess` to `public_html`
   - Ensure permissions: 755 for folders, 644 for files

3. **Enable AUTOSSL**
   - cPanel → AutoSSL → Check for certificate

4. **Verify Service Worker**
   - Browser DevTools → Application → Service Workers
   - Should show as "active"

---

## ✅ Post-Deployment Checklist

After deploying, verify:

### **1. PWA Installation**
```javascript
// Check browser console (F12):
// Should see messages like:
// "[App] Service Worker registered: https://yourdomain.com/service-worker.js"
// "[SW] Install complete"
```

### **2. Test Installation**
- Desktop: Look for install icon in address bar
- Mobile: Share menu should show "Add to Home Screen"

### **3. Offline Test**
1. Load the site
2. Open DevTools (F12)
3. Network tab → Offline mode
4. Refresh page
5. Should still load completely ✓

### **4. Data Persistence**
1. Add a task
2. Refresh page
3. Task should still be there ✓

### **5. HTTPS Verification**
- URL must start with `https://`
- Check for green lock icon in browser

### **6. Manifest**
Navigate to: `https://yourdomain.com/manifest.json`
Should show JSON metadata (not 404)

### **7. Service Worker**
Navigate to: `https://yourdomain.com/service-worker.js`
Should show JavaScript code (not 404)

---

## 🔧 Troubleshooting

### **Service Worker won't register**
```
❌ Error: "Service Worker registration failed"
✅ Solution: 
  - Check browser console for exact error
  - Ensure HTTPS is enabled (http://localhost OK)
  - Check MIME type: service-worker.js must be application/javascript
  - Verify file exists: /service-worker.js
```

### **Install button not showing**
```
❌ No install prompt
✅ Solution:
  - Check manifest.json is valid: https://yoursite.com/manifest.json
  - Verify HTTPS
  - Check DevTools → Application → Manifest panel
  - Wait >30 seconds (browser caches manifest)
  - Not showing on iPad? Use Share → Add to Home Screen instead
```

### **Data not persisting**
```
❌ Refresh and data disappears
✅ Solution:
  - Check DevTools → Application → Local Storage / IndexedDB
  - Disable private/incognito mode
  - Clear browser cache: DevTools → Network → Disable cache → Hard refresh
  - Check browser supports localStorage (should work on all modern browsers)
```

### **CORS errors**
```
❌ "Access to XMLHttpRequest blocked by CORS policy"
✅ Solution: 
  - Ensure all assets load from same origin
  - Check .htaccess or nginx headers for Access-Control-Allow-Origin
  - Or use relative paths instead of absolute URLs
```

### **SSL Certificate error**
```
❌ "NET::ERR_CERT_AUTHORITY_INVALID"
✅ Solution:
  - Wait 5 minutes for Let's Encrypt to configure
  - Verify domain points to server IP
  - Renew if expired: certbot renew
  - Check: https://ssl.com/ (free SSL checker)
```

---

## 📊 Monitoring

### **Check deployment status**
```bash
# Vercel
vercel status

# Netlify
netlify status

# Docker
docker-compose logs -f tempow

# Nginx
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### **Monitor performance**
- Google Lighthouse: https://developers.google.com/web/tools/lighthouse
- PageSpeed: https://pagespeed.web.dev
- Target: Lighthouse PWA score 90+

---

## 🔐 Security Hardening

### **Before going public**

```bash
# 1. Update security headers in nginx.conf / .htaccess
# 2. Enable HTTPS only (redirect HTTP)
# 3. Set strong CSP headers
# 4. Enable HSTS (Strict-Transport-Security)
# 5. Disable directory listing
# 6. Hide server info
```

### **Example: Nginx security headers**
```nginx
add_header Strict-Transport-Security "max-age=31536000" always;
add_header X-Frame-Options "DENY" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Content-Security-Policy "default-src 'self' https://fonts.googleapis.com" always;
```

---

## 💰 Cost Analysis

| Option | Cost | SSL | Speed | Setup |
|--------|------|-----|-------|-------|
| **Vercel** | Free tier | ✓ | Excellent | 5 min |
| **Netlify** | Free tier | ✓ | Excellent | 5 min |
| **GitHub Pages** | Free | ✓ | Good | 10 min |
| **Cloudflare Pages** | Free | ✓ | Excellent | 5 min |
| **VPS ($5/mo)** | $60/yr | ✓ | Great | 30 min |
| **Shared Hosting ($3/mo)** | $36/yr | ✓ | Good | 15 min |

---

## 📞 Support

Deployment stuck? Check:
1. **Error logs** in browser console (F12)
2. **Server logs** (nginx/apache/docker)
3. **Status pages** (vercel.com/status, netlify.com/status)
4. **DNS propagation** (if custom domain): https://dnschecker.org

---

**Ready to deploy? Pick an option above and get Tempow live! 🚀**

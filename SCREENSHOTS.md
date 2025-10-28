# 📸 Screenshots Guide

Quick guide for capturing and adding screenshots to the README.

## 🚀 Quick Start

### Option 1: Complete Process (Recommended)

Capture screenshots AND update README automatically:

```powershell
# Make sure dev server is running
npm run dev

# In another terminal, run everything at once:
npm run screenshots:all
```

This will:
1. ✅ Capture 9 screenshots (desktop + mobile + error states)
2. ✅ Automatically update README.md with screenshot links
3. ✅ Ready to commit and push!

---

### Option 2: Step by Step

**Step 1: Capture screenshots**
```powershell
# Make sure dev server is running
npm run dev

# In another terminal:
npm run screenshots
```

**Step 2: Update README**
```powershell
npm run screenshots:update-readme
```

---

### Option 3: Production Screenshots

Capture from your live Vercel deployment:

```powershell
npm run screenshots:prod
npm run screenshots:update-readme
```

---

## 📋 What Gets Captured

The script automatically captures:

### Desktop (1920x1080)
1. **Homepage** - Random collection on load
2. **Search Results** - "Matrix" search
3. **Movie Modal** - Detailed view
4. **Recent Searches** - Dropdown feature
5. **Keyboard Shortcut** - `/` focus demo
6. **Error State** - User-friendly errors

### Mobile (375x812 - iPhone X)
7. **Homepage Mobile** - Responsive design
8. **Search Results Mobile** - "Avengers" search
9. **Movie Modal Mobile** - Mobile view

---

## 📂 File Locations

```
screenshots/
├── 01-homepage-desktop.png
├── 02-search-results-desktop.png
├── 03-movie-modal-desktop.png
├── 04-recent-searches-desktop.png
├── 05-keyboard-shortcut-desktop.png
├── 06-homepage-mobile.png
├── 07-search-results-mobile.png
├── 08-movie-modal-mobile.png
└── 09-error-state-desktop.png
```

These are **included in Git** (not ignored) so they show on GitHub.

---

## 🔄 Updating Screenshots

If you make UI changes and need new screenshots:

```powershell
# Delete old screenshots
Remove-Item screenshots/*.png

# Capture new ones
npm run screenshots:all
```

---

## ✅ Committing to GitHub

After capturing:

```powershell
git add screenshots/ README.md
git commit -m "docs: add screenshots to README"
git push
```

Screenshots will now display on GitHub! 🎉

---

## 🎨 Advanced: Custom Screenshots

Edit `scripts/capture-screenshots.js` to customize:

- Change viewport sizes
- Add more screenshots
- Change search terms
- Adjust delays/timing

---

## 📝 Manual README Update

If you want to manually control what goes in the README, just run:

```powershell
npm run screenshots
```

Then manually edit README.md with your preferred layout.

---

## 🆘 Troubleshooting

### "Some screenshots are missing"
Make sure all 9 screenshots were captured successfully.

```powershell
# Check screenshots folder
dir screenshots
```

### "Could not find insertion point"
The README structure changed. Edit `scripts/update-readme-screenshots.js` to adjust insertion logic.

### Screenshots look cut off
Adjust `viewport` or `clip` settings in `scripts/capture-screenshots.js`.

---

**That's it! You're ready to showcase your app with beautiful screenshots! 🚀**


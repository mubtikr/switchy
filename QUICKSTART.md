# ⚡ Switchy - Quick Start Guide

## 1. Try It Now (Development Mode)

```bash
cd /Users/mubtikr/work/private/switchy
npm run dev
```

**What happens:**
1. Vite dev server starts (UI)
2. Electron app launches
3. Look for Switchy icon in system tray
4. Click tray icon → "Open Converter"

## 2. Test the Conversion

### Using the UI:
1. Open converter window (Cmd/Ctrl+Shift+K)
2. Type some Arabic text: `ويممخ`
3. Click "Convert"
4. Result: `hello`

### Using Global Shortcuts:
1. Go to any app (Chrome, Notes, etc.)
2. Type in Arabic keyboard: `ويممخ`
3. Select the text
4. Press **Cmd+Shift+Space** (macOS) or **Ctrl+Shift+Space** (Windows)
5. Text converts to: `hello`

## 3. Grant Permissions (macOS Only)

When you first use shortcuts, macOS will prompt for Accessibility permissions:

1. Click "Open System Preferences"
2. Go to: **Security & Privacy → Accessibility**
3. Click the lock 🔒 to make changes
4. Check the box next to "Electron" or "Switchy"
5. Restart the app

## 4. Available Shortcuts

| macOS | Windows | Action |
|-------|---------|--------|
| Cmd+Shift+Space | Ctrl+Shift+Space | Smart Convert (auto-detect) |
| Cmd+Shift+E | Ctrl+Shift+E | Force English |
| Cmd+Shift+A | Ctrl+Shift+A | Force Arabic |
| Cmd+Shift+K | Ctrl+Shift+K | Open Converter Window |

## 5. Current Layout Indicator

Look at the system tray:
- Tooltip shows: "Switchy - Current Layout: AR" or "EN"
- Changes in real-time when you switch keyboard layouts

## 6. Supported Languages

✅ **Arabic ↔ English** (All keys mapped)

## 7. Adding Your Own Language

See: `docs/ADDING_LANGUAGES.md`

Quick example for French:
```typescript
// 1. Create: src/main/maps/FrenchEnglish.ts
// 2. Map keys: 'à' → 'a', etc.
// 3. Register in: src/main/maps/index.ts
// Done! 🎉
```

## 8. Building for Production

```bash
# macOS
npm run package:mac

# Windows
npm run package:win

# Find installer in: release/
```

## 9. Troubleshooting

**Problem: Shortcuts don't work**
→ Grant Accessibility permissions (see step 3)

**Problem: App won't start**
```bash
# Check logs
npm run dev
# Look for errors in terminal
```

**Problem: Layout detection wrong**
→ Check supported layouts in `src/shared/constants.ts`

**Problem: Build fails**
```bash
# Rebuild native modules
npm rebuild robotjs
```

## 10. File Structure (Where to Edit)

```
src/
├── main/
│   ├── maps/              👈 Add new languages here
│   ├── services/          👈 Core logic
│   └── main.ts            👈 App configuration
├── renderer/
│   └── converter/         👈 UI design
└── shared/
    ├── types.ts           👈 Add language codes
    └── constants.ts       👈 Add layout names
```

## 🎯 Most Common Tasks

### Change a Shortcut
```typescript
// File: src/shared/types.ts
export const DEFAULT_SETTINGS: AppSettings = {
  shortcuts: {
    smartConvert: 'CommandOrControl+Shift+Space',  // 👈 Change this
    // ...
  },
};
```

### Add a Language
```bash
# 1. Copy template
cp src/main/maps/FrenchEnglish.ts src/main/maps/SpanishEnglish.ts

# 2. Edit character mappings
# 3. Register in src/main/maps/index.ts
```

### Customize UI
```
File: src/renderer/converter/index.html
→ Edit CSS in <style> section
→ Change colors, fonts, layout
```

## 📚 Documentation

- **README.md** - Overview and installation
- **CONTRIBUTING.md** - How to contribute
- **docs/ADDING_LANGUAGES.md** - Complete language guide
- **PROJECT_SUMMARY.md** - Full feature list
- **DEVELOPMENT.md** - Technical details

## 🚀 Next Steps

1. ✅ Run the app (`npm run dev`)
2. ✅ Test conversion (type, select, press shortcut)
3. ⏳ Add your favorite language
4. ⏳ Customize UI to your liking
5. ⏳ Build and share!

---

**Need help?** Check `CONTRIBUTING.md` or open an issue on GitHub.

**Happy converting! ✨**

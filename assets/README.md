# Switchy Assets# Switchy Icon Assets



This directory contains all application icons and branding assets for Switchy.This directory contains icon assets for Switchy.



## 📦 Contents## Required Icons:



### Application Icons### macOS

- `icon.icns` - Main app icon (512x512 source converted to .icns)

- **`icon.icns`** - macOS application icon (ICNS format)- `iconTemplate.png` - System tray icon (16x16 template image)

  - Used by electron-builder for macOS builds- `iconTemplate@2x.png` - Retina system tray icon (32x32)

  - Contains multiple resolutions: 16x16 to 1024x1024

  ### Windows

- **`icon.ico`** - Windows application icon (ICO format)- `icon.ico` - Main app icon (256x256 with multiple sizes: 16, 32, 48, 256)

  - Used by electron-builder for Windows builds- `icon.png` - System tray icon (16x16)

  - Contains multiple resolutions: 16x16 to 256x256

## Creating Icons:

- **`icon.png`** - Source icon (1024x1024)

  - High-resolution source file### macOS .icns

  - Use this to regenerate platform-specific icons```bash

# Create icon.iconset directory with multiple sizes

### Branding Assetsmkdir icon.iconset

sips -z 16 16     icon-512.png --out icon.iconset/icon_16x16.png

- **`logo.png`** - README and documentation logosips -z 32 32     icon-512.png --out icon.iconset/icon_16x16@2x.png

  - Used in README headersips -z 32 32     icon-512.png --out icon.iconset/icon_32x32.png

  - Optimized for display on documentation pagessips -z 64 64     icon-512.png --out icon.iconset/icon_32x32@2x.png

sips -z 128 128   icon-512.png --out icon.iconset/icon_128x128.png

## 🔄 Regenerating Iconssips -z 256 256   icon-512.png --out icon.iconset/icon_128x128@2x.png

sips -z 256 256   icon-512.png --out icon.iconset/icon_256x256.png

If you need to update the application icons from a new source image:sips -z 512 512   icon-512.png --out icon.iconset/icon_256x256@2x.png

sips -z 512 512   icon-512.png --out icon.iconset/icon_512x512.png

```bashsips -z 1024 1024 icon-512.png --out icon.iconset/icon_512x512@2x.png

# Install the icon generator (one time)

npm install --save-dev png2icons# Convert to .icns

iconutil -c icns icon.iconset

# Generate all platform icons from source```

npx png2icons icon.png icon -allp -i

```### Windows .ico

Use online converter or ImageMagick:

This will create:```bash

- `icon.icns` for macOS (with all required sizes)convert icon-256.png -define icon:auto-resize=256,48,32,16 icon.ico

- `icon.ico` for Windows (with all required sizes)```



## 📐 Icon Guidelines## Temporary Placeholder

For development, you can use any PNG image. The build will work without icons but won't look professional.

For best results, your source icon should:
- Be at least **1024x1024 pixels**
- Use **PNG format** with transparency
- Have clear, simple design that works at small sizes (16x16)
- Use bold shapes and colors for visibility

## 🎨 Design Notes

The Switchy icon represents:
- Language switching and conversion
- Keyboard layout transformation
- Multi-directional text flow

---

**Note:** Do not manually edit `.icns` or `.ico` files. Always regenerate from the source PNG.

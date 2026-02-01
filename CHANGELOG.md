# Changelog

All notable changes to Switchy will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- French ↔ English language support (AZERTY keyboard layout)
- Russian ↔ English language support (ЙЦУКЕН keyboard layout)
- German ↔ English language support (QWERTZ keyboard layout)
- Spanish ↔ English language support (QWERTY España layout)

### Fixed
- Windows build failure by using Python 3.11 instead of Python 3.12
  - Python 3.12+ removed the `distutils` module required by `node-gyp`
  - Updated GitHub Actions workflows (build.yml and release.yml)
  - Updated documentation to specify Python 3.11 requirement for Windows builds

### Planned
- Settings window with UI
- Conversion history
- Custom character mappings
- Linux support

## [1.0.0] - 2025-12-16

### Added
- Initial release
- Cross-platform support (macOS Intel, macOS Apple Silicon, Windows x64, Windows x86)
- Smart keyboard layout detection with real-time monitoring
- Arabic ↔ English complete character mapping
- Global shortcuts:
  - Smart auto-convert (Cmd/Ctrl+Shift+Space)
  - Force English (Cmd/Ctrl+Shift+E)
  - Force Arabic (Cmd/Ctrl+Shift+A)
  - Open converter (Cmd/Ctrl+Shift+K)
- Beautiful converter UI with gradient design
- System tray integration with live layout indicator
- Text replacement in any application via clipboard
- Extensible language mapping system
- Comprehensive documentation
- GitHub Actions CI/CD pipeline
- Automated releases on version tags

### Technical
- Built with Electron + TypeScript
- Vite for fast development builds
- electron-builder for cross-platform packaging
- robotjs for keyboard simulation
- electron-store for settings persistence
- Full type safety with TypeScript

---

## Release Notes Template

When releasing a new version, use this template:

```markdown
## [X.Y.Z] - YYYY-MM-DD

### Added
- New features

### Changed
- Changes to existing functionality

### Deprecated
- Soon-to-be removed features

### Removed
- Removed features

### Fixed
- Bug fixes

### Security
- Security improvements
```

## Version Numbering

- **Major (X.0.0)**: Breaking changes
- **Minor (x.Y.0)**: New features, backward compatible
- **Patch (x.y.Z)**: Bug fixes, backward compatible

## How to Release

1. Update this CHANGELOG.md
2. Update version in package.json
3. Commit changes
4. Create and push tag:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```
5. GitHub Actions will automatically build and create release

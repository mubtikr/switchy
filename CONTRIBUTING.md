# 🤝 Contributing to Switchy

Thank you for your interest in contributing to Switchy! This document provides guidelines for contributing to the project.

## 🌟 Ways to Contribute

- 🌍 **Add new language pairs** - See [Adding Languages Guide](./ADDING_LANGUAGES.md)
- 🐛 **Report bugs** - Open an issue with detailed information
- 💡 **Suggest features** - Share your ideas in issues
- 📖 **Improve documentation** - Help make docs clearer
- 🧪 **Write tests** - Improve code quality
- 🎨 **Design icons** - Create better app and tray icons

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git
- macOS 10.13+ or Windows 10+ (for testing)
- Basic TypeScript knowledge

### Development Setup

1. **Fork the repository**
   ```bash
   # Click "Fork" on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/switchy.git
   cd switchy
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run in development mode**
   ```bash
   npm run dev
   ```

4. **Build the project**
   ```bash
   npm run build
   ```

## 📝 Development Guidelines

### Code Style

- Use **TypeScript** for all new code
- Follow the existing code structure
- Use **meaningful variable names**
- Add **JSDoc comments** for public APIs
- Run linting before committing (if configured)

### Commit Messages

Use clear, descriptive commit messages:

```
✅ Good:
- "Add French keyboard layout mapping"
- "Fix clipboard restoration on Windows"
- "Improve layout detection performance"

❌ Bad:
- "fix bug"
- "update"
- "changes"
```

### Branch Naming

Use descriptive branch names:

- `feature/add-russian-language` - New features
- `fix/clipboard-windows` - Bug fixes
- `docs/update-readme` - Documentation
- `refactor/conversion-engine` - Code improvements

## 🌍 Adding a New Language

See the detailed guide: [Adding Languages](./ADDING_LANGUAGES.md)

Quick checklist:
- [ ] Create language map file (`src/main/maps/YourLanguage.ts`)
- [ ] Implement complete character mapping
- [ ] Add language detection function
- [ ] Register in `src/main/maps/index.ts`
- [ ] Update type definitions
- [ ] Test thoroughly
- [ ] Document any special cases

## 🐛 Reporting Bugs

### Before Reporting

1. Check if the bug is already reported in [Issues](https://github.com/mubtikr/switchy/issues)
2. Try to reproduce on latest version
3. Test on a clean install if possible

### Bug Report Template

```markdown
**Description**
Clear description of the bug

**To Reproduce**
1. Open app
2. Press Cmd+Shift+Space
3. See error

**Expected Behavior**
What should happen

**Actual Behavior**
What actually happens

**Environment**
- OS: macOS 14.1 / Windows 11
- Switchy Version: 1.0.0
- Language Pair: Arabic → English

**Screenshots**
If applicable

**Logs**
Include any error logs from Console/Event Viewer
```

## 💡 Suggesting Features

### Feature Request Template

```markdown
**Feature Description**
Clear description of the proposed feature

**Use Case**
Why is this feature needed? Who benefits?

**Proposed Solution**
How could this be implemented?

**Alternatives Considered**
Other approaches you've thought about

**Additional Context**
Mockups, examples, references
```

## 🔍 Code Review Process

### Pull Request Guidelines

1. **Create a focused PR**
   - One feature/fix per PR
   - Keep changes small and reviewable

2. **Write a clear description**
   ```markdown
   ## What
   Brief description of changes
   
   ## Why
   Reason for changes
   
   ## How
   Technical approach
   
   ## Testing
   How was this tested?
   ```

3. **Ensure tests pass**
   - Build succeeds
   - No TypeScript errors
   - Manual testing completed

4. **Update documentation**
   - Update README if needed
   - Add JSDoc comments
   - Update CHANGELOG (if exists)

### Review Process

1. Maintainers will review within 1-7 days
2. Address feedback and requested changes
3. Once approved, PR will be merged
4. Your contribution will be credited!

## 🧪 Testing

### Manual Testing

Test your changes on:
- ✅ macOS (if applicable)
- ✅ Windows (if applicable)
- ✅ Different applications (Chrome, VSCode, etc.)

### Test Checklist for Language Pairs

- [ ] All keyboard keys mapped correctly
- [ ] Shifted characters work
- [ ] Numbers preserved correctly
- [ ] Special characters handled
- [ ] Whitespace maintained
- [ ] Bidirectional conversion works
- [ ] Language detection accurate

## 📁 Project Structure

```
switchy/
├── src/
│   ├── main/              # Electron main process
│   │   ├── main.ts        # Entry point
│   │   ├── services/      # Core services
│   │   ├── utils/         # Utilities
│   │   └── maps/          # Language mappings ⭐ Add here
│   ├── renderer/          # UI (React/HTML)
│   ├── preload/           # IPC bridge
│   └── shared/            # Shared types/constants
├── assets/                # Icons and resources
├── docs/                  # Documentation
└── .github/workflows/     # CI/CD
```

## 🎨 UI/UX Contributions

### Design Guidelines

- Keep UI simple and clean
- Support both light and dark themes
- Ensure accessibility
- Make it cross-platform friendly

### Icon Contributions

We need:
- App icon (512x512 PNG)
- System tray icon (16x16, 32x32)
- Both macOS (.icns) and Windows (.ico) formats

## 📜 License

By contributing, you agree that your contributions will be licensed under the same license as the project (MIT License).

## 🙏 Recognition

Contributors will be:
- Listed in README
- Mentioned in release notes
- Credited in code comments (for major contributions)

## ❓ Questions?

- Open a [Discussion](https://github.com/mubtikr/switchy/discussions)
- Join our community (if applicable)
- Email maintainers (if listed)

## 🎯 Priority Contributions

Currently seeking help with:

1. **Language Pairs**
   - Russian ↔ English
   - French ↔ English
   - German ↔ English
   - Spanish ↔ English

2. **Platform Support**
   - Linux support
   - Additional Windows keyboard layouts

3. **Features**
   - Custom character mappings
   - Phonetic conversion mode
   - Conversion history

4. **Testing**
   - Automated tests
   - More language coverage
   - Cross-platform testing

## 📚 Resources

- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Electron Documentation](https://www.electronjs.org/docs)
- [Keyboard Layout References](https://en.wikipedia.org/wiki/Keyboard_layout)

---

Thank you for contributing to Switchy! 🎉

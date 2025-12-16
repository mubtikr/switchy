# 🌍 Adding New Language Pairs to Switchy

This guide explains how to add support for new language pairs to Switchy.

## 📋 Overview

Switchy uses a structured, extensible system for language mappings. Each language pair:
- Maps keyboard positions from one layout to another
- Handles both regular and shifted characters
- Supports bidirectional conversion
- Can be easily enabled/disabled

## 🚀 Quick Start

To add a new language pair (e.g., French ↔ English):

### Step 1: Create the Mapping File

Create a new file in `src/main/maps/` named after your language pair:

```typescript
// src/main/maps/FrenchEnglish.ts

import { LanguageMapBase, type LanguageMapConfig, type CharacterMap } from './LanguageMapBase';

/**
 * French to English character mapping
 * Based on AZERTY keyboard layout (French standard)
 */
const FRENCH_TO_ENGLISH_MAP: CharacterMap = {
  // Map each French keyboard character to its QWERTY position
  
  // First row (AZERTY → QWERTY)
  'a': 'q',
  'z': 'w',
  'e': 'e',
  'r': 'r',
  't': 't',
  'y': 'y',
  'u': 'u',
  'i': 'i',
  'o': 'o',
  'p': 'p',
  
  // Second row
  'q': 'a',
  's': 's',
  'd': 'd',
  'f': 'f',
  'g': 'g',
  'h': 'h',
  'j': 'j',
  'k': 'k',
  'l': 'l',
  'm': ';',
  
  // Third row
  'w': 'z',
  'x': 'x',
  'c': 'c',
  'v': 'v',
  'b': 'b',
  'n': 'n',
  ',': 'm',
  
  // French special characters
  'à': '\'',
  'é': '2',
  'è': '7',
  'ù': '\'',
  'ç': '9',
  
  // Accented uppercase
  'À': '"',
  'É': '2',
  'È': '7',
  
  // Common punctuation
  ' ': ' ',
  '\n': '\n',
  '\t': '\t',
};

/**
 * French to English Language Map
 */
export class FrenchToEnglishMap extends LanguageMapBase {
  constructor() {
    const config: LanguageMapConfig = {
      from: 'FR',
      to: 'EN',
      name: 'French → English',
      description: 'Converts text typed on French AZERTY keyboard to English QWERTY positions',
      mapping: FRENCH_TO_ENGLISH_MAP,
      defaultEnabled: true,
    };
    
    super(config);
  }
}

/**
 * Helper function to detect if text is primarily French
 */
export function isFrenchText(text: string): boolean {
  const frenchChars = /[àâäæçéèêëïîôùûüÿœ]/gi;
  const matches = (text.match(frenchChars) || []).length;
  const totalChars = text.replace(/\s/g, '').length;
  
  return totalChars > 0 && matches / totalChars > 0.1;
}
```

### Step 2: Register the Language Map

Add your new language map to the registry in `src/main/maps/index.ts`:

```typescript
// Import your new map
import { FrenchToEnglishMap } from './FrenchEnglish';

export function initializeLanguageMaps(): void {
  LanguageMapRegistry.register(new ArabicToEnglishMap());
  
  // Add your new language pair
  LanguageMapRegistry.register(new FrenchToEnglishMap());
}

// Export the detection function
export { isFrenchText } from './FrenchEnglish';
```

### Step 3: Update Type Definitions

Add your language code to `src/shared/types.ts`:

```typescript
export type LayoutCode = 'AR' | 'EN' | 'FR' | 'RU' | 'ES' | 'UNKNOWN';
```

### Step 4: Update Layout Names

Add your language to `src/shared/constants.ts`:

```typescript
export const LAYOUT_NAMES: Record<string, { code: string; name: string; fullName: string }> = {
  // ... existing entries
  'French': { code: 'FR', name: 'French', fullName: 'French' },
  'Français': { code: 'FR', name: 'French', fullName: 'Français' },
};
```

### Step 5: Update ConversionEngine

Add conversion methods in `src/main/services/ConversionEngine.ts`:

```typescript
import { LanguageMapRegistry } from '../maps';

// In the convert method, use the registry
const languageMap = LanguageMapRegistry.getMap(from, to);
if (languageMap) {
  convertedText = languageMap.convertForward(text);
}
```

## 📚 Understanding the Structure

### CharacterMap

A simple object mapping source characters to target characters:

```typescript
{
  'ش': 'a',  // Arabic 'sheen' → English 'a' position
  'س': 's',  // Arabic 'seen' → English 's' position
  // ... more mappings
}
```

### LanguageMapConfig

Configuration for a language pair:

```typescript
{
  from: 'AR',              // Source layout code
  to: 'EN',                // Target layout code
  name: 'Arabic → English', // Display name
  description: '...',       // Description
  mapping: { ... },         // Character mappings
  defaultEnabled: true      // Enabled by default?
}
```

## 🎯 Best Practices

### 1. Complete Mapping

Include all keyboard keys:
- ✅ Letters (lowercase and uppercase)
- ✅ Numbers
- ✅ Special characters
- ✅ Punctuation
- ✅ Whitespace (space, tab, newline)

### 2. Test Your Mappings

Create test cases:

```typescript
const testCases = [
  { input: 'bonjour', expected: 'bonjour' },
  { input: 'àéèù', expected: 'corresponding positions' },
];
```

### 3. Document Special Cases

Comment unusual mappings:

```typescript
'ç': '9',  // French cedilla on AZERTY number row
```

### 4. Language Detection

Implement a detection function:

```typescript
export function isFrenchText(text: string): boolean {
  // Look for French-specific characters
  const frenchChars = /[àâäæçéèêëïîôùûüÿœ]/gi;
  // Return true if enough French chars found
}
```

## 📖 Reference Keyboard Layouts

### Find Keyboard Layout Charts

1. **Wikipedia**: Search for "[Language] keyboard layout"
2. **Images**: Visual keyboard layout diagrams
3. **Online Tools**: Virtual keyboard testers

### Common Layouts

- **QWERTY**: English (US, UK)
- **AZERTY**: French
- **QWERTZ**: German
- **Cyrillic**: Russian
- **Arabic**: Middle Eastern standard

## 🧪 Testing Your Language Pair

### Manual Testing

1. Type text in the source language
2. Select the text
3. Press conversion shortcut
4. Verify correct conversion

### Test Cases

```typescript
// Example test cases
const tests = [
  {
    name: 'Basic conversion',
    input: 'french_text_here',
    expected: 'english_positions',
  },
  {
    name: 'Special characters',
    input: 'àéèùç',
    expected: 'corresponding_keys',
  },
  {
    name: 'Mixed content',
    input: 'français123',
    expected: 'english123',
  },
];
```

## 🤝 Contributing

Want to contribute your language pair?

1. Fork the repository
2. Create a new branch: `git checkout -b add-french-language`
3. Add your language mapping
4. Test thoroughly
5. Submit a pull request with:
   - Description of the language pair
   - Keyboard layout reference
   - Test cases

## 📝 Language Pair Template

Use this template to start your language map:

```typescript
import { LanguageMapBase, type LanguageMapConfig, type CharacterMap } from './LanguageMapBase';

const YOUR_LANGUAGE_TO_ENGLISH_MAP: CharacterMap = {
  // TODO: Add character mappings
};

export class YourLanguageToEnglishMap extends LanguageMapBase {
  constructor() {
    const config: LanguageMapConfig = {
      from: 'XX',  // Your language code
      to: 'EN',
      name: 'YourLanguage → English',
      description: 'Your description',
      mapping: YOUR_LANGUAGE_TO_ENGLISH_MAP,
      defaultEnabled: true,
    };
    super(config);
  }
}

export function isYourLanguageText(text: string): boolean {
  // TODO: Implement detection
  return false;
}
```

## 🌟 Currently Supported Languages

- ✅ **Arabic** ↔ English (Complete)
- ✅ **French** ↔ English (Template ready)
- ✅ **Russian** ↔ English (Planned)
- 🚧 **German** ↔ English (Planned)
- ✅ **Spanish** ↔ English (Planned)

## ❓ FAQ

### Q: Do I need to create both directions (e.g., FR→EN and EN→FR)?

**A:** No! The reverse mapping is automatically generated from the forward mapping by the `LanguageMapBase` class.

### Q: What if my keyboard layout has keys that don't exist in QWERTY?

**A:** Map them to the closest equivalent or skip them. Document the decision.

### Q: How do I handle dead keys (accent modifiers)?

**A:** Map the resulting accented character, not the dead key itself.

### Q: Can I have multiple layouts for the same language?

**A:** Yes! Just create separate map classes (e.g., `FrenchAzertyMap`, `FrenchBepoMap`).

## 📞 Need Help?

- Open an issue on GitHub
- Check existing language maps for examples
- Read the TypeScript interfaces for documentation

---

Happy mapping! 🎨✨

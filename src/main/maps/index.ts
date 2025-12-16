/**
 * Language Maps Index
 * 
 * This file imports and registers all available language mappings.
 * To add a new language pair:
 * 1. Create a new file in this directory (e.g., FrenchEnglish.ts)
 * 2. Import it here
 * 3. Register it with the registry
 */

import { LanguageMapRegistry } from './LanguageMapBase';
import { ArabicToEnglishMap } from './ArabicEnglish';
import { FrenchToEnglishMap } from './FrenchEnglish';
import { RussianToEnglishMap } from './RussianEnglish';
import { GermanToEnglishMap } from './GermanEnglish';
import { SpanishToEnglishMap } from './SpanishEnglish';

/**
 * Initialize and register all language maps
 */
export function initializeLanguageMaps(): void {
  // Register Arabic ↔ English
  LanguageMapRegistry.register(new ArabicToEnglishMap());
  
  // Register French ↔ English (AZERTY)
  LanguageMapRegistry.register(new FrenchToEnglishMap());
  
  // Register Russian ↔ English (ЙЦУКЕН)
  LanguageMapRegistry.register(new RussianToEnglishMap());
  
  // Register German ↔ English (QWERTZ)
  LanguageMapRegistry.register(new GermanToEnglishMap());
  
  // Register Spanish ↔ English (QWERTY España)
  LanguageMapRegistry.register(new SpanishToEnglishMap());
}

// Export commonly used functions
export { LanguageMapRegistry, LanguageMapBase } from './LanguageMapBase';
export type { LanguageMapConfig, CharacterMap } from './LanguageMapBase';
export { isArabicText, isEnglishText } from './ArabicEnglish';
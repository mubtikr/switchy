/**
 * Arabic to English Keyboard Layout Mapping
 * 
 * Maps characters typed on an Arabic keyboard layout to their
 * corresponding positions on a QWERTY English keyboard layout.
 * 
 * This is based on the standard Arabic keyboard layout used in
 * most Middle Eastern countries.
 */

import { LanguageMapBase, type LanguageMapConfig, type CharacterMap } from './LanguageMapBase';

/**
 * Arabic to English character mapping
 * Based on QWERTY keyboard positions
 */
const ARABIC_TO_ENGLISH_MAP: CharacterMap = {
  // Numbers row (Arabic numerals to Western numerals)
  '١': '1', '٢': '2', '٣': '3', '٤': '4', '٥': '5',
  '٦': '6', '٧': '7', '٨': '8', '٩': '9', '٠': '0',
  '-': '-', '=': '=',
  
  // First letter row (QWERTY equivalent)
  'ض': 'q', 'ص': 'w', 'ث': 'e', 'ق': 'r', 'ف': 't',
  'غ': 'y', 'ع': 'u', 'ه': 'i', 'خ': 'o', 'ح': 'p',
  'ج': '[', 'د': ']',
  
  // Second letter row (ASDFGH equivalent)
  'ش': 'a', 'س': 's', 'ي': 'd', 'ب': 'f', 'ل': 'g',
  'ا': 'h', 'ت': 'j', 'ن': 'k', 'م': 'l', 'ك': ';',
  'ط': '\'',
  
  // Third letter row (ZXCVBN equivalent)
  'ئ': 'z', 'ء': 'x', 'ؤ': 'c', 'ر': 'v', 'لا': 'b',
  'ى': 'n', 'ة': 'm', 'و': ',', 'ز': '.', 'ظ': '/',
  
  // Shifted characters (Arabic diacritics and special characters)
  'َ': 'Q',      // Fatha
  'ً': 'W',      // Tanween Fatha
  'ُ': 'E',      // Damma
  'ٌ': 'R',      // Tanween Damma
  'لإ': 'T',     // Lam-Alef with Hamza below
  'إ': 'Y',      // Alef with Hamza below
  '`': 'U',
  '÷': 'I',      // Division sign
  '×': 'O',      // Multiplication sign
  '؛': 'P',      // Arabic semicolon
  '\\': 'A',
  ']': 'S',
  '[': 'D',
  'لأ': 'F',     // Lam-Alef with Hamza above
  'أ': 'G',      // Alef with Hamza above
  'ـ': 'H',      // Tatweel (kashida)
  '،': 'J',      // Arabic comma
  '/': 'K',
  ':': 'L',
  '"': ':',
  '~': 'Z',
  'ْ': 'X',      // Sukun
  '}': 'C',
  '{': 'V',
  'لآ': 'B',     // Lam-Alef with Madda
  'آ': 'N',      // Alef with Madda
  '\'': 'M',
  ',': '<',
  '.': '>',
  '؟': '?',      // Arabic question mark
  
  // Common punctuation and whitespace
  ' ': ' ',
  '\n': '\n',
  '\t': '\t',
  '\r': '\r',
};

/**
 * Arabic to English Language Map
 */
export class ArabicToEnglishMap extends LanguageMapBase {
  constructor() {
    const config: LanguageMapConfig = {
      from: 'AR',
      to: 'EN',
      name: 'Arabic → English',
      description: 'Converts text typed on Arabic keyboard layout to English QWERTY positions',
      mapping: ARABIC_TO_ENGLISH_MAP,
      defaultEnabled: true,
    };
    
    super(config);
  }
}

/**
 * Helper function to detect if text is primarily Arabic
 */
export function isArabicText(text: string): boolean {
  // Count Arabic Unicode characters (0600-06FF)
  const arabicCharCount = (text.match(/[\u0600-\u06FF]/g) || []).length;
  const totalChars = text.replace(/\s/g, '').length;
  
  return totalChars > 0 && arabicCharCount / totalChars > 0.3;
}

/**
 * Helper function to detect if text is primarily English
 */
export function isEnglishText(text: string): boolean {
  // Count ASCII letters
  const englishCharCount = (text.match(/[a-zA-Z]/g) || []).length;
  const totalChars = text.replace(/\s/g, '').length;
  
  return totalChars > 0 && englishCharCount / totalChars > 0.3;
}

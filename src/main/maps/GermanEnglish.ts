import { LanguageMapBase, type LanguageMapConfig, type CharacterMap } from './LanguageMapBase';

/**
 * German ↔ English Keyboard Layout Mapping
 * Maps characters between German (QWERTZ) and English (QWERTY) layouts
 * based on physical key positions.
 * 
 * German QWERTZ Layout:
 * - Z and Y are swapped compared to QWERTY
 * - Special German characters: ü, ö, ä, ß
 * - Different special character positions
 * - Top row has ß instead of -
 */
const GERMAN_TO_ENGLISH_MAP: CharacterMap = {
  // Number row
  '1': '1', '2': '2', '3': '3', '4': '4', '5': '5',
  '6': '6', '7': '7', '8': '8', '9': '9', '0': '0',
  'ß': '-', '´': '=',
  
  // Number row shifted
  '!': '!', '"': '@', '§': '#', '$': '$', '%': '%',
  '&': '^', '/': '&', '(': '*', ')': '(', '=': ')',
  '?': '_', '`': '+',
  
  // Top letter row (QWERTZ)
  'q': 'q', 'w': 'w', 'e': 'e', 'r': 'r', 't': 't',
  'z': 'y', 'u': 'u', 'i': 'i', 'o': 'o', 'p': 'p',
  'ü': '[', '+': ']',
  
  'Q': 'Q', 'W': 'W', 'E': 'E', 'R': 'R', 'T': 'T',
  'Z': 'Y', 'U': 'U', 'I': 'I', 'O': 'O', 'P': 'P',
  'Ü': '{', '*': '}',
  
  // Middle letter row
  'a': 'a', 's': 's', 'd': 'd', 'f': 'f', 'g': 'g',
  'h': 'h', 'j': 'j', 'k': 'k', 'l': 'l', 'ö': ';',
  'ä': "'", '#': '\\',
  
  'A': 'A', 'S': 'S', 'D': 'D', 'F': 'F', 'G': 'G',
  'H': 'H', 'J': 'J', 'K': 'K', 'L': 'L', 'Ö': ':',
  'Ä': '"', "'": '|',
  
  // Bottom letter row (Y and Z swapped)
  'y': 'z', 'x': 'x', 'c': 'c', 'v': 'v', 'b': 'b',
  'n': 'n', 'm': 'm', ',': ',', '.': '.', '-': '/',
  
  'Y': 'Z', 'X': 'X', 'C': 'C', 'V': 'V', 'B': 'B',
  'N': 'N', 'M': 'M', ';': '<', ':': '>', '_': '?',
  
  // Special
  '<': '`', '>': '~', '^': '^',
  ' ': ' ', '\n': '\n', '\t': '\t',
};

/**
 * German to English Language Map
 */
export class GermanToEnglishMap extends LanguageMapBase {
  constructor() {
    const config: LanguageMapConfig = {
      from: 'DE',
      to: 'EN',
      name: 'German → English',
      description: 'Converts text typed on German QWERTZ keyboard layout to English QWERTY positions',
      mapping: GERMAN_TO_ENGLISH_MAP,
      defaultEnabled: true,
    };
    
    super(config);
  }
}

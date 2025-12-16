import { LanguageMapBase, type LanguageMapConfig, type CharacterMap } from './LanguageMapBase';

/**
 * French ↔ English Keyboard Layout Mapping
 * Maps characters between AZERTY (French) and QWERTY (English) layouts
 * based on physical key positions.
 * 
 * French AZERTY Layout:
 * - Top row: &é"'(-è_çà)=
 * - Numbers accessed via Shift: 1234567890°+
 * - Letter row swaps: A↔Q, Z↔W, Q↔A, M after L
 * - Special characters: ù, ^, $, *, µ, ²
 */
const FRENCH_TO_ENGLISH_MAP: CharacterMap = {
  // Number row
  '&': '1', 'é': '2', '"': '3', "'": '4', '(': '5',
  '-': '6', 'è': '7', '_': '8', 'ç': '9', 'à': '0',
  ')': '-', '=': '=',
  
  // Number row shifted
  '1': '!', '2': '@', '3': '#', '4': '$', '5': '%',
  '6': '^', '7': '&', '8': '*', '9': '(', '0': ')',
  '°': '_', '+': '+',
  
  // Top letter row (AZERTY)
  'a': 'q', 'z': 'w', 'e': 'e', 'r': 'r', 't': 't',
  'y': 'y', 'u': 'u', 'i': 'i', 'o': 'o', 'p': 'p',
  '^': '[', '$': ']',
  
  'A': 'Q', 'Z': 'W', 'E': 'E', 'R': 'R', 'T': 'T',
  'Y': 'Y', 'U': 'U', 'I': 'I', 'O': 'O', 'P': 'P',
  '¨': '{', '£': '}',
  
  // Middle letter row
  'q': 'a', 's': 's', 'd': 'd', 'f': 'f', 'g': 'g',
  'h': 'h', 'j': 'j', 'k': 'k', 'l': 'l', 'm': ';',
  'ù': "'", '*': '\\',
  
  'Q': 'A', 'S': 'S', 'D': 'D', 'F': 'F', 'G': 'G',
  'H': 'H', 'J': 'J', 'K': 'K', 'L': 'L', 'M': ':',
  '%': '"', 'µ': '|',
  
  // Bottom letter row
  'w': 'z', 'x': 'x', 'c': 'c', 'v': 'v', 'b': 'b',
  'n': 'n', ',': 'm', ';': ',', ':': '.', '!': '/',
  
  'W': 'Z', 'X': 'X', 'C': 'C', 'V': 'V', 'B': 'B',
  'N': 'N', '?': 'M', '.': '<', '/': '>', '§': '?',
  
  // Special
  '²': '`', '³': '~', '<': '<', '>': '>',
  ' ': ' ', '\n': '\n', '\t': '\t',
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
      description: 'Converts text typed on French AZERTY keyboard layout to English QWERTY positions',
      mapping: FRENCH_TO_ENGLISH_MAP,
      defaultEnabled: true,
    };
    
    super(config);
  }
}

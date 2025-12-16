import { LanguageMapBase, type LanguageMapConfig, type CharacterMap } from './LanguageMapBase';

/**
 * Spanish ↔ English Keyboard Layout Mapping
 * Maps characters between Spanish (QWERTY España) and English (QWERTY) layouts
 * based on physical key positions.
 * 
 * Spanish QWERTY Layout (Spain):
 * - Special Spanish characters: ñ, á, é, í, ó, ú, ü
 * - Different special character positions
 * - Dead keys for accents: ´ and `
 * - Top row has special symbols: ¡, ', ¿
 */
const SPANISH_TO_ENGLISH_MAP: CharacterMap = {
  // Number row
  '1': '1', '2': '2', '3': '3', '4': '4', '5': '5',
  '6': '6', '7': '7', '8': '8', '9': '9', '0': '0',
  "'": '-', '¡': '=',
  
  // Number row shifted
  '!': '!', '"': '@', '·': '#', '$': '$', '%': '%',
  '&': '^', '/': '&', '(': '*', ')': '(', '=': ')',
  '?': '_', '¿': '+',
  
  // Top letter row (QWERTY - mostly same)
  'q': 'q', 'w': 'w', 'e': 'e', 'r': 'r', 't': 't',
  'y': 'y', 'u': 'u', 'i': 'i', 'o': 'o', 'p': 'p',
  '`': '[', '+': ']',
  
  'Q': 'Q', 'W': 'W', 'E': 'E', 'R': 'R', 'T': 'T',
  'Y': 'Y', 'U': 'U', 'I': 'I', 'O': 'O', 'P': 'P',
  '^': '{', '*': '}',
  
  // Middle letter row
  'a': 'a', 's': 's', 'd': 'd', 'f': 'f', 'g': 'g',
  'h': 'h', 'j': 'j', 'k': 'k', 'l': 'l', 'ñ': ';',
  '´': "'", 'ç': '\\',
  
  'A': 'A', 'S': 'S', 'D': 'D', 'F': 'F', 'G': 'G',
  'H': 'H', 'J': 'J', 'K': 'K', 'L': 'L', 'Ñ': ':',
  '¨': '"', 'Ç': '|',
  
  // Bottom letter row
  'z': 'z', 'x': 'x', 'c': 'c', 'v': 'v', 'b': 'b',
  'n': 'n', 'm': 'm', ',': ',', '.': '.', '-': '/',
  
  'Z': 'Z', 'X': 'X', 'C': 'C', 'V': 'V', 'B': 'B',
  'N': 'N', 'M': 'M', ';': '<', ':': '>', '_': '?',
  
  // Special and accented characters
  '<': '<', '>': '>',
  'á': 'á', 'é': 'é', 'í': 'í', 'ó': 'ó', 'ú': 'ú', 'ü': 'ü',
  'Á': 'Á', 'É': 'É', 'Í': 'Í', 'Ó': 'Ó', 'Ú': 'Ú', 'Ü': 'Ü',
  ' ': ' ', '\n': '\n', '\t': '\t',
};

/**
 * Spanish to English Language Map
 */
export class SpanishToEnglishMap extends LanguageMapBase {
  constructor() {
    const config: LanguageMapConfig = {
      from: 'ES',
      to: 'EN',
      name: 'Spanish → English',
      description: 'Converts text typed on Spanish QWERTY keyboard layout to English QWERTY positions',
      mapping: SPANISH_TO_ENGLISH_MAP,
      defaultEnabled: true,
    };
    
    super(config);
  }
}

import { LanguageMapBase, type LanguageMapConfig, type CharacterMap } from './LanguageMapBase';

/**
 * Russian ↔ English Keyboard Layout Mapping
 * Maps characters between Russian (ЙЦУКЕН) and English (QWERTY) layouts
 * based on physical key positions.
 * 
 * Russian ЙЦУКЕН Layout:
 * - Top row: йцукенгшщзхъ
 * - Middle row: фывапролджэ
 * - Bottom row: ячсмитьбю
 * - Common paired letters: ё/`, ж/;, э/', б/,, ю/.
 */
const RUSSIAN_TO_ENGLISH_MAP: CharacterMap = {
  // Number row (same)
  '1': '1', '2': '2', '3': '3', '4': '4', '5': '5',
  '6': '6', '7': '7', '8': '8', '9': '9', '0': '0',
  '-': '-', '=': '=',
  
  // Number row shifted
  '!': '!', '"': '@', '№': '#', ';': '$', '%': '%',
  ':': '^', '?': '&', '*': '*', '(': '(', ')': ')',
  '_': '_', '+': '+',
  
  // Top letter row (ЙЦУКЕН)
  'й': 'q', 'ц': 'w', 'у': 'e', 'к': 'r', 'е': 't',
  'н': 'y', 'г': 'u', 'ш': 'i', 'щ': 'o', 'з': 'p',
  'х': '[', 'ъ': ']',
  
  'Й': 'Q', 'Ц': 'W', 'У': 'E', 'К': 'R', 'Е': 'T',
  'Н': 'Y', 'Г': 'U', 'Ш': 'I', 'Щ': 'O', 'З': 'P',
  'Х': '{', 'Ъ': '}',
  
  // Middle letter row
  'ф': 'a', 'ы': 's', 'в': 'd', 'а': 'f', 'п': 'g',
  'р': 'h', 'о': 'j', 'л': 'k', 'д': 'l', 'ж': ';',
  'э': "'", '\\': '\\',
  
  'Ф': 'A', 'Ы': 'S', 'В': 'D', 'А': 'F', 'П': 'G',
  'Р': 'H', 'О': 'J', 'Л': 'K', 'Д': 'L', 'Ж': ':',
  'Э': '"', '/': '|',
  
  // Bottom letter row
  'я': 'z', 'ч': 'x', 'с': 'c', 'м': 'v', 'и': 'b',
  'т': 'n', 'ь': 'm', 'б': ',', 'ю': '.', '.': '/',
  
  'Я': 'Z', 'Ч': 'X', 'С': 'C', 'М': 'V', 'И': 'B',
  'Т': 'N', 'Ь': 'M', 'Б': '<', 'Ю': '>', ',': '?',
  
  // Special Russian character Ё
  'ё': '`', 'Ё': '~',
  
  // Common whitespace
  ' ': ' ', '\n': '\n', '\t': '\t',
};

/**
 * Russian to English Language Map
 */
export class RussianToEnglishMap extends LanguageMapBase {
  constructor() {
    const config: LanguageMapConfig = {
      from: 'RU',
      to: 'EN',
      name: 'Russian → English',
      description: 'Converts text typed on Russian ЙЦУКЕН keyboard layout to English QWERTY positions',
      mapping: RUSSIAN_TO_ENGLISH_MAP,
      defaultEnabled: true,
    };
    
    super(config);
  }
}

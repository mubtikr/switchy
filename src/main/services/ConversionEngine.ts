import log from 'electron-log';
import type { LayoutCode, ConversionResult, ConversionMode } from '../../shared/types';
import { LanguageMapRegistry, initializeLanguageMaps } from '../maps';

export class ConversionEngine {
  constructor() {
    initializeLanguageMaps();
    
    // Debug: Log registered maps
    const allMaps = LanguageMapRegistry.getAllMaps();
    log.info('Registered language maps:', allMaps.map(m => {
      const cfg = m.getConfig();
      return `${cfg.from}_${cfg.to}`;
    }));
  }

  /**
   * Convert text based on mode and current layout
   */
  convert(text: string, mode: ConversionMode, currentLayout: LayoutCode): ConversionResult {
    if (!text || text.trim().length === 0) {
      return {
        success: false,
        originalText: text,
        convertedText: text,
        from: currentLayout,
        to: currentLayout,
        error: 'No text to convert',
      };
    }

    try {
      let convertedText: string;
      let from: LayoutCode;
      let to: LayoutCode;

      if (mode === 'auto') {
        // Smart conversion based on current layout
        if (currentLayout === 'AR') {
          // User is on Arabic keyboard but typing English positions
          convertedText = this.convertToEnglish(text, 'AR');
          from = 'AR';
          to = 'EN';
        } else {
          // User is on English keyboard but wants Arabic (default)
          convertedText = this.convertToArabic(text, 'EN');
          from = 'EN';
          to = 'AR';
        }
      } else if (mode === 'toEnglish') {
        convertedText = this.convertToEnglish(text, currentLayout);
        from = currentLayout;
        to = 'EN';
      } else if (mode === 'toArabic') {
        convertedText = this.convertToArabic(text, 'EN');
        from = 'EN';
        to = 'AR';
      } else {
        throw new Error(`Unsupported conversion mode: ${mode}`);
      }

      log.info('Conversion:', { mode, from, to, textLength: text.length });

      return {
        success: true,
        originalText: text,
        convertedText,
        from,
        to,
      };
    } catch (error) {
      log.error('Conversion error:', error);
      return {
        success: false,
        originalText: text,
        convertedText: text,
        from: currentLayout,
        to: currentLayout,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Convert text to English
   */
  convertToEnglish(text: string, fromLayout: LayoutCode = 'AR'): string {
    // Smart detection: if fromLayout is EN but text contains non-English chars, detect the actual language
    if (fromLayout === 'EN') {
      const detectedLayout = this.detectLanguage(text);
      if (detectedLayout !== 'EN') {
        log.info(`Detected text language as ${detectedLayout}, overriding keyboard layout ${fromLayout}`);
        fromLayout = detectedLayout;
      }
    }
    
    const languageMap = LanguageMapRegistry.getMap(fromLayout, 'EN');
    if (languageMap) {
      return languageMap.convertForward(text);
    }
    log.warn(`No language map found for ${fromLayout} -> EN`);
    return text;
  }

  /**
   * Convert text to Arabic
   */
  convertToArabic(text: string, fromLayout: LayoutCode = 'EN'): string {
    // Try to get the AR->EN map and use reverse
    log.debug('Looking for AR->EN map to convert to Arabic...');
    const languageMap = LanguageMapRegistry.getMap('AR', 'EN');
    if (languageMap) {
      log.debug('Found AR->EN map, using reverse mapping');
      const config = languageMap.getConfig();
      log.debug('Reverse mapping sample:', {
        'd': config.reverseMapping?.['d'],
        's': config.reverseMapping?.['s'],
        'a': config.reverseMapping?.['a'],
        hasReverseMap: !!config.reverseMapping,
        reverseMappingSize: Object.keys(config.reverseMapping || {}).length
      });
      const result = languageMap.convertReverse(text);
      log.debug('Conversion result:', { original: text.substring(0, 20), converted: result.substring(0, 20) });
      return result;
    }
    log.warn(`No language map found for AR -> EN (needed for ${fromLayout} -> AR conversion)`);
    return text;
  }

  /**
   * Apply character mapping to text (legacy method)
   */
  private applyMapping(text: string, mapping: Record<string, string>): string {
    let result = '';
    
    for (const char of text) {
      // Check if character exists in mapping
      if (mapping[char]) {
        result += mapping[char];
      } else {
        // Keep character as-is (numbers, special chars, etc.)
        result += char;
      }
    }
    
    return result;
  }

  /**
   * Detect text language (simple heuristic)
   */
  detectLanguage(text: string): LayoutCode {
    const totalChars = text.replace(/\s/g, '').length;
    
    if (totalChars === 0) {
      return 'EN'; // Default for empty text
    }
    
    // Check for Arabic (Unicode range 0600-06FF)
    const arabicCharCount = (text.match(/[\u0600-\u06FF]/g) || []).length;
    if (arabicCharCount > 0) {
      log.debug(`Detected Arabic: ${arabicCharCount}/${totalChars} chars`);
      return 'AR';
    }
    
    // Check for Cyrillic/Russian (Unicode range 0400-04FF)
    const cyrillicCharCount = (text.match(/[\u0400-\u04FF]/g) || []).length;
    if (cyrillicCharCount > 0) {
      log.debug(`Detected Russian: ${cyrillicCharCount}/${totalChars} chars`);
      return 'RU';
    }
    
    // Check for common French accented characters
    const frenchCharCount = (text.match(/[àâäæçéèêëïîôùûüÿœÀÂÄÆÇÉÈÊËÏÎÔÙÛÜŸŒ]/g) || []).length;
    if (frenchCharCount > totalChars * 0.1) {
      log.debug(`Detected French: ${frenchCharCount}/${totalChars} chars`);
      return 'FR';
    }
    
    // Check for German umlauts
    const germanCharCount = (text.match(/[äöüßÄÖÜẞ]/g) || []).length;
    if (germanCharCount > totalChars * 0.05) {
      log.debug(`Detected German: ${germanCharCount}/${totalChars} chars`);
      return 'DE';
    }
    
    // Check for Spanish specific characters
    const spanishCharCount = (text.match(/[áéíóúñüÁÉÍÓÚÑÜ¿¡]/g) || []).length;
    if (spanishCharCount > totalChars * 0.05) {
      log.debug(`Detected Spanish: ${spanishCharCount}/${totalChars} chars`);
      return 'ES';
    }
    
    // Check for English (ASCII letters)
    const englishCharCount = (text.match(/[a-zA-Z]/g) || []).length;
    if (englishCharCount > totalChars * 0.5) {
      log.debug(`Detected English: ${englishCharCount}/${totalChars} chars`);
      return 'EN';
    }
    
    // Default to English if no clear match
    log.debug(`No clear language detected, defaulting to EN`);
    return 'EN';
  }

  /**
   * Check if text needs conversion
   */
  needsConversion(text: string, targetLayout: LayoutCode): boolean {
    const detectedLayout = this.detectLanguage(text);
    return detectedLayout !== targetLayout;
  }
}

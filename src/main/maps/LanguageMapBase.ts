/**
 * Language Map Interface
 * 
 * This interface defines the structure for keyboard layout mappings.
 * Each language pair should implement this interface.
 */

import type { LayoutCode } from '../../shared/types';

export interface LanguageMapConfig {
  /** Source layout code (e.g., 'AR' for Arabic) */
  from: LayoutCode;
  
  /** Target layout code (e.g., 'EN' for English) */
  to: LayoutCode;
  
  /** Display name of the language pair */
  name: string;
  
  /** Description of the mapping */
  description: string;
  
  /** Character mapping from source to target */
  mapping: CharacterMap;
  
  /** Optional: Reverse mapping (auto-generated if not provided) */
  reverseMapping?: CharacterMap;
  
  /** Whether this language pair is enabled by default */
  defaultEnabled: boolean;
}

export interface CharacterMap {
  [sourceChar: string]: string;
}

/**
 * Base class for language mappings
 */
export abstract class LanguageMapBase {
  protected config: LanguageMapConfig;

  constructor(config: LanguageMapConfig) {
    this.config = config;
    
    // Auto-generate reverse mapping if not provided
    if (!config.reverseMapping) {
      this.config.reverseMapping = this.generateReverseMapping(config.mapping);
    }
  }

  /**
   * Get the language pair configuration
   */
  getConfig(): LanguageMapConfig {
    return this.config;
  }

  /**
   * Convert text from source to target language
   */
  convertForward(text: string): string {
    return this.applyMapping(text, this.config.mapping);
  }

  /**
   * Convert text from target to source language
   */
  convertReverse(text: string): string {
    if (!this.config.reverseMapping) {
      throw new Error('Reverse mapping not available');
    }
    return this.applyMapping(text, this.config.reverseMapping);
  }

  /**
   * Apply a character mapping to text
   */
  protected applyMapping(text: string, mapping: CharacterMap): string {
    let result = '';
    
    for (const char of text) {
      result += mapping[char] || char;
    }
    
    return result;
  }

  /**
   * Generate reverse mapping from forward mapping
   */
  protected generateReverseMapping(mapping: CharacterMap): CharacterMap {
    const reverse: CharacterMap = {};
    
    for (const [key, value] of Object.entries(mapping)) {
      reverse[value] = key;
    }
    
    return reverse;
  }

  /**
   * Get supported characters in source layout
   */
  getSupportedChars(): string[] {
    return Object.keys(this.config.mapping);
  }

  /**
   * Check if a character is supported
   */
  isSupported(char: string): boolean {
    return char in this.config.mapping;
  }
}

/**
 * Language Map Registry
 * Central registry for all language mappings
 */
export class LanguageMapRegistry {
  private static maps: Map<string, LanguageMapBase> = new Map();

  /**
   * Register a language map
   */
  static register(map: LanguageMapBase): void {
    const config = map.getConfig();
    const key = `${config.from}_${config.to}`;
    this.maps.set(key, map);
  }

  /**
   * Get a language map by source and target codes
   */
  static getMap(from: LayoutCode, to: LayoutCode): LanguageMapBase | undefined {
    const key = `${from}_${to}`;
    return this.maps.get(key);
  }

  /**
   * Get all registered language maps
   */
  static getAllMaps(): LanguageMapBase[] {
    return Array.from(this.maps.values());
  }

  /**
   * Get all enabled language maps
   */
  static getEnabledMaps(): LanguageMapBase[] {
    return this.getAllMaps().filter(map => map.getConfig().defaultEnabled);
  }

  /**
   * Check if a language pair is supported
   */
  static isSupported(from: LayoutCode, to: LayoutCode): boolean {
    const key = `${from}_${to}`;
    return this.maps.has(key);
  }
}

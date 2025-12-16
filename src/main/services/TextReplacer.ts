import robotjs from 'robotjs';
import log from 'electron-log';
import type { LayoutCode, ConversionMode, ConversionResult } from '../../shared/types';
import { ConversionEngine } from './ConversionEngine';

// Helper to dynamically import ESM modules from CommonJS
// Using Function constructor to prevent TypeScript from transforming to require()
const dynamicImport = new Function('specifier', 'return import(specifier)');

export class TextReplacer {
  private conversionEngine: ConversionEngine;
  private isReplacing: boolean = false;

  constructor(conversionEngine: ConversionEngine) {
    this.conversionEngine = conversionEngine;
  }

  /**
   * Replace selected text with converted version
   * Cross-platform implementation
   */
  async replaceSelectedText(
    mode: ConversionMode,
    currentLayout: LayoutCode
  ): Promise<ConversionResult> {
    if (this.isReplacing) {
      log.warn('Already performing text replacement');
      return {
        success: false,
        originalText: '',
        convertedText: '',
        from: currentLayout,
        to: currentLayout,
        error: 'Already replacing text',
      };
    }

    this.isReplacing = true;

    try {
      // Step 1: Save current clipboard
      let originalClipboard = '';
      try {
        const clipboardy = (await dynamicImport('clipboardy')).default;
        originalClipboard = await clipboardy.read();
      } catch (error) {
        log.warn('Could not read clipboard:', error);
      }

      // Step 2: Copy selected text (Cmd+C on macOS, Ctrl+C on Windows)
      await this.copySelection();
      await this.delay(150); // Wait for clipboard to update

      // Step 3: Read clipboard
      let selectedText = '';
      try {
        const clipboardy = (await dynamicImport('clipboardy')).default;
        selectedText = await clipboardy.read();
        log.debug('Read selected text from clipboard:', selectedText.substring(0, 50));
      } catch (error) {
        log.warn('Could not read clipboard after copy:', error);
      }

      if (!selectedText || selectedText.trim().length === 0) {
        log.warn('No text selected');
        // Restore original clipboard
        try {
          const clipboardy = (await dynamicImport('clipboardy')).default;
          await clipboardy.write(originalClipboard);
        } catch (error) {
          log.warn('Could not restore clipboard:', error);
        }
        return {
          success: false,
          originalText: '',
          convertedText: '',
          from: currentLayout,
          to: currentLayout,
          error: 'No text selected',
        };
      }

      // Step 4: Convert text
      const result = this.conversionEngine.convert(selectedText, mode, currentLayout);

      if (!result.success) {
        // Restore original clipboard on conversion failure
        try {
          const clipboardy = (await dynamicImport('clipboardy')).default;
          await clipboardy.write(originalClipboard);
        } catch (error) {
          log.warn('Could not restore clipboard after conversion failure:', error);
        }
        return result;
      }

      log.info('Conversion successful:', {
        original: selectedText.substring(0, 50),
        converted: result.convertedText.substring(0, 50),
        from: result.from,
        to: result.to
      });

      // Step 5: Write converted text to clipboard
      try {
        const clipboardy = (await dynamicImport('clipboardy')).default;
        await clipboardy.write(result.convertedText);
        log.debug('Converted text written to clipboard');
      } catch (error) {
        log.error('Could not write converted text to clipboard:', error);
        throw error;
      }

      await this.delay(150); // Increased delay for clipboard sync

      // Step 6: Paste converted text (Cmd+V on macOS, Ctrl+V on Windows)
      // The selected text is still selected, so pasting will replace it
      await this.paste();
      log.debug('Paste command sent');
      
      await this.delay(200); // Wait for paste to complete

      // Step 7: Restore original clipboard (with longer delay)
      await this.delay(100); // Additional delay before restoring
      try {
        const clipboardy = (await dynamicImport('clipboardy')).default;
        await clipboardy.write(originalClipboard);
        log.debug('Original clipboard restored');
      } catch (error) {
        log.warn('Could not restore clipboard:', error);
      }

      return result;
    } catch (error) {
      log.error('Text replacement error:', error);
      return {
        success: false,
        originalText: '',
        convertedText: '',
        from: currentLayout,
        to: currentLayout,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    } finally {
      this.isReplacing = false;
    }
  }

  /**
   * Simulate copy command (Cmd+C on macOS, Ctrl+C on Windows)
   */
  private async copySelection(): Promise<void> {
    const isMac = process.platform === 'darwin';
    const modifier = isMac ? 'command' : 'control';

    try {
      robotjs.keyTap('c', modifier);
      log.debug('Copy command sent');
    } catch (error) {
      log.error('Failed to send copy command:', error);
      throw error;
    }
  }

  /**
   * Simulate paste command (Cmd+V on macOS, Ctrl+V on Windows)
   */
  private async paste(): Promise<void> {
    const isMac = process.platform === 'darwin';
    const modifier = isMac ? 'command' : 'control';

    try {
      robotjs.keyTap('v', modifier);
      log.debug('Paste command sent');
    } catch (error) {
      log.error('Failed to send paste command:', error);
      throw error;
    }
  }

  /**
   * Utility delay function
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

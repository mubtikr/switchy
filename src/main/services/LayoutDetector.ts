import { execSync } from 'child_process';
import { EventEmitter } from 'events';
import log from 'electron-log';
import type { LayoutCode, LayoutInfo } from '../../shared/types';
import { LAYOUT_NAMES } from '../../shared/constants';

export class KeyboardLayoutDetector extends EventEmitter {
  private currentLayout: LayoutCode = 'EN';
  private pollInterval: NodeJS.Timeout | null = null;
  private isMonitoring: boolean = false;

  constructor() {
    super();
  }

  /**
   * Detect current keyboard layout based on platform
   */
  async detectLayout(): Promise<LayoutCode> {
    try {
      const platform = process.platform;
      
      if (platform === 'darwin') {
        return this.detectLayoutMacOS();
      } else if (platform === 'win32') {
        return this.detectLayoutWindows();
      } else {
        log.warn('Unsupported platform for layout detection:', platform);
        return 'EN';
      }
    } catch (error) {
      log.error('Error detecting layout:', error);
      return 'EN';
    }
  }

  /**
   * Detect layout on macOS using AppleScript
   */
  private detectLayoutMacOS(): LayoutCode {
    try {
      // Method 1: Try to get the input source identifier (most reliable for all input sources)
      const sourceIdCommand = `defaults read ~/Library/Preferences/com.apple.HIToolbox.plist AppleSelectedInputSources | grep -A 2 "KeyboardLayout ID" | grep "KeyboardLayout Name" | sed 's/.*= "\\(.*\\)";/\\1/' | head -1`;
      const sourceId = execSync(sourceIdCommand, { encoding: 'utf-8', timeout: 1000 }).trim();
      
      if (sourceId && sourceId.length > 0 && sourceId !== '}') {
        const normalized = this.normalizeLayoutName(sourceId);
        log.debug('Layout detected from source name:', sourceId, '->', normalized);
        return normalized;
      }
      
      // Method 2: Try to get input source ID number
      const layoutIdCommand = `defaults read ~/Library/Preferences/com.apple.HIToolbox.plist AppleSelectedInputSources | grep -A 1 "KeyboardLayout ID" | tail -1 | awk '{print $NF}' | tr -d '";' | head -1`;
      const layoutId = execSync(layoutIdCommand, { encoding: 'utf-8', timeout: 1000 }).trim();
      
      if (layoutId && layoutId.match(/^\d+$/)) {
        // Map common keyboard layout IDs to codes
        const layoutIdMap: Record<string, LayoutCode> = {
          '0': 'EN',      // US
          '1': 'EN',      // US Extended
          '2': 'EN',      // British
          '19': 'AR',     // Arabic
          '3': 'AR',      // Arabic - PC
          '71': 'FR',     // French
          '77': 'RU',     // Russian
          '92': 'DE',     // German
          '87': 'ES',     // Spanish
        };
        
        const detected = layoutIdMap[layoutId] || 'EN';
        log.debug('Layout detected from ID:', layoutId, '->', detected);
        return detected;
      }
      
      log.debug('No layout detected, defaulting to EN');
      return 'EN';
    } catch (error) {
      log.error('macOS layout detection failed:', error);
      return 'EN';
    }
  }

  /**
   * Detect layout on Windows using PowerShell
   */
  private detectLayoutWindows(): LayoutCode {
    try {
      // Get current input language from Windows
      const command = `powershell -Command "(Get-WinUserLanguageList)[0].LanguageTag"`;
      const result = execSync(command, { encoding: 'utf-8', timeout: 1000 }).trim();
      
      // Map language tags to layout codes
      const languageMap: Record<string, LayoutCode> = {
        'ar': 'AR',
        'ar-SA': 'AR',
        'ar-EG': 'AR',
        'en': 'EN',
        'en-US': 'EN',
        'en-GB': 'EN',
        'fr': 'FR',
        'fr-FR': 'FR',
        'fr-CA': 'FR',
        'ru': 'RU',
        'ru-RU': 'RU',
        'de': 'DE',
        'de-DE': 'DE',
        'de-AT': 'DE',
        'de-CH': 'DE',
        'es': 'ES',
        'es-ES': 'ES',
        'es-MX': 'ES',
      };
      
      return languageMap[result] || 'EN';
    } catch (error) {
      log.error('Windows layout detection failed:', error);
      return 'EN';
    }
  }

  /**
   * Normalize layout name from OS to LayoutCode
   */
  private normalizeLayoutName(rawName: string): LayoutCode {
    // Clean up the name
    const cleanName = rawName.trim().toLowerCase();
    
    // Check against known layout names
    for (const [key, value] of Object.entries(LAYOUT_NAMES)) {
      if (cleanName.includes(key.toLowerCase()) || cleanName === value.name.toLowerCase()) {
        return value.code as LayoutCode;
      }
    }
    
    // Check for partial matches (more comprehensive)
    if (cleanName.includes('arab') || cleanName.includes('ar-') || cleanName === 'arabic') return 'AR';
    if (cleanName.includes('fren') || cleanName.includes('fr-') || cleanName.includes('french') || cleanName.includes('français')) return 'FR';
    if (cleanName.includes('russ') || cleanName.includes('ru-') || cleanName.includes('russian') || cleanName.includes('русский')) return 'RU';
    if (cleanName.includes('germ') || cleanName.includes('de-') || cleanName.includes('deutsch') || cleanName.includes('german')) return 'DE';
    if (cleanName.includes('span') || cleanName.includes('es-') || cleanName.includes('español') || cleanName.includes('spanish')) return 'ES';
    if (cleanName.includes('engl') || cleanName.includes('en-') || cleanName.includes('us') || cleanName.includes('british')) return 'EN';
    
    log.warn('Unknown layout name:', rawName);
    return 'EN'; // Default to English
  }

  /**
   * Start monitoring layout changes
   */
  startMonitoring(interval: number = 500): void {
    if (this.isMonitoring) {
      log.warn('Layout monitoring already started');
      return;
    }

    this.isMonitoring = true;
    log.info('Starting layout monitoring with interval:', interval);

    // Initial detection
    this.detectLayout().then(layout => {
      this.currentLayout = layout;
      this.emit('layoutChanged', layout);
    });

    // Poll for changes
    this.pollInterval = setInterval(async () => {
      const newLayout = await this.detectLayout();
      
      if (newLayout !== this.currentLayout) {
        log.info('Layout changed:', this.currentLayout, '->', newLayout);
        this.currentLayout = newLayout;
        this.emit('layoutChanged', newLayout);
      }
    }, interval);
  }

  /**
   * Stop monitoring layout changes
   */
  stopMonitoring(): void {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
      this.isMonitoring = false;
      log.info('Layout monitoring stopped');
    }
  }

  /**
   * Get current layout without detection
   */
  getCurrentLayout(): LayoutCode {
    return this.currentLayout;
  }

  /**
   * Get layout info
   */
  getLayoutInfo(code: LayoutCode): LayoutInfo {
    const entry = Object.values(LAYOUT_NAMES).find(l => l.code === code);
    const defaultInfo: LayoutInfo = { code: 'EN', name: 'English', fullName: 'English' };
    return (entry as LayoutInfo) || defaultInfo;
  }
}

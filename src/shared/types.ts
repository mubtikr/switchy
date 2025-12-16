export type LayoutCode = 'AR' | 'EN' | 'FR' | 'RU' | 'DE' | 'ES' | 'UNKNOWN';

export type ConversionMode = 'auto' | 'toEnglish' | 'toArabic' | 'toFrench' | 'toRussian' | 'toGerman' | 'toSpanish';

export interface LayoutInfo {
  code: LayoutCode;
  name: string;
  fullName: string;
}

export interface ConversionResult {
  success: boolean;
  originalText: string;
  convertedText: string;
  from: LayoutCode;
  to: LayoutCode;
  error?: string;
}

export interface AppSettings {
  shortcuts: {
    smartConvert: string;
    convertToEnglish: string;
    convertToArabic: string;
    openConverter: string;
  };
  general: {
    launchAtStartup: boolean;
    showNotifications: boolean;
    enabledLanguages: LayoutCode[];
  };
  advanced: {
    clipboardDelay: number; // ms
    pollInterval: number; // ms for layout detection
  };
}

export interface IpcChannels {
  // Main -> Renderer
  LAYOUT_CHANGED: 'layout-changed';
  CONVERSION_RESULT: 'conversion-result';
  
  // Renderer -> Main
  CONVERT_TEXT: 'convert-text';
  GET_CURRENT_LAYOUT: 'get-current-layout';
  GET_SETTINGS: 'get-settings';
  UPDATE_SETTINGS: 'update-settings';
  SHOW_NOTIFICATION: 'show-notification';
  OPEN_SETTINGS: 'open-settings';
}

export const DEFAULT_SETTINGS: AppSettings = {
  shortcuts: {
    smartConvert: 'CommandOrControl+Shift+Space',
    convertToEnglish: 'CommandOrControl+Shift+E',
    convertToArabic: 'CommandOrControl+Shift+A',
    openConverter: 'CommandOrControl+Shift+K',
  },
  general: {
    launchAtStartup: false,
    showNotifications: true,
    enabledLanguages: ['AR', 'EN'],
  },
  advanced: {
    clipboardDelay: 100,
    pollInterval: 500,
  },
};

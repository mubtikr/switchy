export const APP_NAME = 'Switchy';
export const APP_VERSION = '1.0.0';

export const IPC_CHANNELS = {
  // Main -> Renderer events
  LAYOUT_CHANGED: 'layout-changed',
  CONVERSION_RESULT: 'conversion-result',
  
  // Renderer -> Main requests
  CONVERT_TEXT: 'convert-text',
  GET_CURRENT_LAYOUT: 'get-current-layout',
  GET_SETTINGS: 'get-settings',
  UPDATE_SETTINGS: 'update-settings',
  SHOW_NOTIFICATION: 'show-notification',
  OPEN_SETTINGS: 'open-settings',
  CHECK_PERMISSIONS: 'check-permissions',
  REQUEST_PERMISSIONS: 'request-permissions',
} as const;

export const LAYOUT_NAMES: Record<string, { code: string; name: string; fullName: string }> = {
  'Arabic': { code: 'AR', name: 'Arabic', fullName: 'Arabic' },
  'U.S.': { code: 'EN', name: 'English', fullName: 'U.S. English' },
  'ABC': { code: 'EN', name: 'English', fullName: 'ABC' },
  'French': { code: 'FR', name: 'French', fullName: 'French' },
  'Russian': { code: 'RU', name: 'Russian', fullName: 'Russian' },
  'German': { code: 'DE', name: 'German', fullName: 'German' },
  'Spanish': { code: 'ES', name: 'Spanish', fullName: 'Spanish' },
};

export const SUPPORTED_LAYOUTS = ['AR', 'EN', 'FR', 'RU', 'DE', 'ES'] as const;

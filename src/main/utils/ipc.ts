import { ipcMain } from 'electron';
import log from 'electron-log';
import { IPC_CHANNELS } from '../../shared/constants';

/**
 * Setup IPC communication handlers
 */
export function setupIPC(app: any) {
  log.info('Setting up IPC handlers...');

  // Get current keyboard layout
  ipcMain.handle(IPC_CHANNELS.GET_CURRENT_LAYOUT, async () => {
    try {
      const layout = app.getCurrentLayout();
      return { success: true, layout };
    } catch (error) {
      log.error('Failed to get current layout:', error);
      return { success: false, error: 'Failed to get layout' };
    }
  });

  // Convert text manually (from UI)
  ipcMain.handle(IPC_CHANNELS.CONVERT_TEXT, async (_event, text: string, mode: string, fromLayout?: string) => {
    try {
      const currentLayout = fromLayout || app.getCurrentLayout();
      const result = app.getConversionEngine().convert(text, mode, currentLayout);
      return { success: true, result };
    } catch (error) {
      log.error('Failed to convert text:', error);
      return { success: false, error: 'Conversion failed' };
    }
  });

  // Get settings
  ipcMain.handle(IPC_CHANNELS.GET_SETTINGS, async () => {
    try {
      const settings = app.getSettingsManager().getSettings();
      return { success: true, settings };
    } catch (error) {
      log.error('Failed to get settings:', error);
      return { success: false, error: 'Failed to get settings' };
    }
  });

  // Update settings
  ipcMain.handle(IPC_CHANNELS.UPDATE_SETTINGS, async (_event, updates: any) => {
    try {
      app.getSettingsManager().updateSettings(updates);
      return { success: true };
    } catch (error) {
      log.error('Failed to update settings:', error);
      return { success: false, error: 'Failed to update settings' };
    }
  });

  // Show notification
  ipcMain.handle(IPC_CHANNELS.SHOW_NOTIFICATION, async (_event, title: string, body: string) => {
    try {
      const { Notification } = require('electron');
      new Notification({ title, body }).show();
      return { success: true };
    } catch (error) {
      log.error('Failed to show notification:', error);
      return { success: false, error: 'Failed to show notification' };
    }
  });

  // Check permissions (macOS only)
  ipcMain.handle(IPC_CHANNELS.CHECK_PERMISSIONS, async () => {
    try {
      if (process.platform === 'darwin') {
        const { systemPreferences } = require('electron');
        const isTrusted = systemPreferences.isTrustedAccessibilityClient(false);
        return { success: true, hasPermissions: isTrusted };
      }
      // Windows doesn't need special permissions for shortcuts
      return { success: true, hasPermissions: true };
    } catch (error) {
      log.error('Failed to check permissions:', error);
      return { success: false, error: 'Failed to check permissions' };
    }
  });

  // Request permissions (macOS only)
  ipcMain.handle(IPC_CHANNELS.REQUEST_PERMISSIONS, async () => {
    try {
      if (process.platform === 'darwin') {
        const { systemPreferences } = require('electron');
        systemPreferences.isTrustedAccessibilityClient(true);
        return { success: true };
      }
      return { success: true };
    } catch (error) {
      log.error('Failed to request permissions:', error);
      return { success: false, error: 'Failed to request permissions' };
    }
  });

  log.info('IPC handlers setup complete');
}

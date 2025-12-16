/**
 * Preload Script
 * 
 * This script runs in a privileged context and exposes safe APIs
 * to the renderer process using contextBridge.
 */

import { contextBridge, ipcRenderer } from 'electron';
import type { LayoutCode, ConversionResult, AppSettings } from '../shared/types';
import { IPC_CHANNELS } from '../shared/constants';

export interface SwitchyAPI {
  // Get current keyboard layout
  getCurrentLayout: () => Promise<LayoutCode>;
  
  // Convert text manually
  convertText: (text: string, mode: string, currentLayout?: string) => Promise<ConversionResult>;
  
  // Settings
  getSettings: () => Promise<{ success: boolean; settings?: AppSettings; error?: string }>;
  updateSettings: (updates: Partial<AppSettings>) => Promise<{ success: boolean; error?: string }>;
  
  // Notifications
  showNotification: (title: string, body: string) => Promise<{ success: boolean; error?: string }>;
  
  // Permissions
  checkPermissions: () => Promise<{ success: boolean; hasPermissions?: boolean; error?: string }>;
  requestPermissions: () => Promise<{ success: boolean; error?: string }>;
  
  onLayoutChanged: (callback: (layout: LayoutCode) => void) => void;
  onConversionResult: (callback: (result: ConversionResult) => void) => void;
  
  removeLayoutChangedListener: (callback: (layout: LayoutCode) => void) => void;
}

const api: SwitchyAPI = {
  getCurrentLayout: async () => {
    const response = await ipcRenderer.invoke(IPC_CHANNELS.GET_CURRENT_LAYOUT);
    return response.layout || 'EN';
  },
  convertText: async (text: string, mode: string, currentLayout?: string) => {
    const response = await ipcRenderer.invoke(IPC_CHANNELS.CONVERT_TEXT, text, mode, currentLayout);
    return response.result;
  },
  getSettings: () => ipcRenderer.invoke(IPC_CHANNELS.GET_SETTINGS),
  updateSettings: (updates: Partial<AppSettings>) => ipcRenderer.invoke(IPC_CHANNELS.UPDATE_SETTINGS, updates),
  showNotification: (title: string, body: string) => ipcRenderer.invoke(IPC_CHANNELS.SHOW_NOTIFICATION, title, body),
  checkPermissions: () => ipcRenderer.invoke(IPC_CHANNELS.CHECK_PERMISSIONS),
  requestPermissions: () => ipcRenderer.invoke(IPC_CHANNELS.REQUEST_PERMISSIONS),
  
  onLayoutChanged: (callback) => {
    const listener = (_event: any, layout: LayoutCode) => callback(layout);
    ipcRenderer.on(IPC_CHANNELS.LAYOUT_CHANGED, listener);
  },
  
  onConversionResult: (callback) => {
    const listener = (_event: any, result: ConversionResult) => callback(result);
    ipcRenderer.on(IPC_CHANNELS.CONVERSION_RESULT, listener);
  },
  
  removeLayoutChangedListener: (callback) => {
    // Note: This is a simplified implementation. For proper cleanup,
    // TODO: need to store the wrapper function and remove that specific listener.
    ipcRenderer.removeAllListeners(IPC_CHANNELS.LAYOUT_CHANGED);
  },
};

contextBridge.exposeInMainWorld('switchy', api);

declare global {
  interface Window {
    switchy: SwitchyAPI;
  }
}

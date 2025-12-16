import { app, BrowserWindow, Tray, Menu, globalShortcut, nativeImage, systemPreferences } from 'electron';
import path from 'path';
import log from 'electron-log';
import { SettingsManager } from './services/SettingsManager';
import { KeyboardLayoutDetector } from './services/LayoutDetector';
import { ConversionEngine } from './services/ConversionEngine';
import { TextReplacer } from './services/TextReplacer';
import { setupIPC } from './utils/ipc';
import { APP_NAME } from '../shared/constants';
import type { LayoutCode } from '../shared/types';

// Configure logging
log.transports.file.level = 'info';
log.info('Switchy starting...');

class SwitchyApp {
  private tray: Tray | null = null;
  private converterWindow: BrowserWindow | null = null;
  private settingsWindow: BrowserWindow | null = null;
  
  private settingsManager: SettingsManager;
  private layoutDetector: KeyboardLayoutDetector;
  private conversionEngine: ConversionEngine;
  private textReplacer: TextReplacer;
  
  private currentLayout: LayoutCode = 'EN';
  private shortcutsEnabled: boolean = true;

  constructor() {
    this.settingsManager = new SettingsManager();
    this.layoutDetector = new KeyboardLayoutDetector();
    this.conversionEngine = new ConversionEngine();
    this.textReplacer = new TextReplacer(this.conversionEngine);
    
    this.init();
  }

  private async init() {
    // Single instance lock
    const gotTheLock = app.requestSingleInstanceLock();
    if (!gotTheLock) {
      app.quit();
      return;
    }

    app.on('second-instance', () => {
      this.showConverterWindow();
    });

    // App ready
    app.whenReady().then(() => {
      this.onAppReady();
    });

    // macOS: Keep app running when all windows closed
    app.on('window-all-closed', (e: Event) => {
      e.preventDefault(); // Prevent app from quitting
    });

    // Handle activate (macOS dock click)
    app.on('activate', () => {
      this.showConverterWindow();
    });

    // Cleanup before quit
    app.on('will-quit', () => {
      this.cleanup();
    });
  }

  private async onAppReady() {
    log.info('App ready, initializing...');

    // Hide dock icon on macOS
    if (process.platform === 'darwin') {
      app.dock.hide();
    }

    // Check permissions
    await this.checkPermissions();

    // Setup IPC handlers
    setupIPC(this);

    // Create system tray
    this.createTray();

    // Register global shortcuts
    this.registerShortcuts();

    // Start layout detection
    this.startLayoutMonitoring();

    log.info('Switchy initialized successfully');
  }

  private async checkPermissions() {
    if (process.platform === 'darwin') {
      const isTrusted = systemPreferences.isTrustedAccessibilityClient(false);
      
      if (!isTrusted) {
        log.warn('Accessibility permissions not granted');
        // Prompt user to grant permissions
        systemPreferences.isTrustedAccessibilityClient(true);
        
        // Show notification
        const { Notification } = await import('electron');
        new Notification({
          title: 'Switchy Permissions Required',
          body: 'Please grant Accessibility permissions in System Preferences to enable keyboard shortcuts.',
        }).show();
      }
    }
  }

  private createTray() {
    const iconPath = this.getTrayIconPath();
    const icon = nativeImage.createFromPath(iconPath);
    
    // Resize for tray (16x16 on macOS, 16x16 on Windows)
    const trayIcon = icon.resize({ width: 16, height: 16 });
    
    this.tray = new Tray(trayIcon);
    this.tray.setToolTip(`${APP_NAME} - Current Layout: ${this.currentLayout}`);
    
    this.updateTrayMenu();

    // macOS: Single click to show menu
    // Windows: Right-click to show menu
    if (process.platform !== 'darwin') {
      this.tray.on('click', () => {
        this.showConverterWindow();
      });
    }
  }

  private getTrayIconPath(): string {
    const isDev = !app.isPackaged;
    const assetsPath = isDev 
      ? path.join(__dirname, '../../assets')
      : path.join(process.resourcesPath, 'assets');

    if (process.platform === 'darwin') {
      return path.join(assetsPath, 'iconTemplate.png');
    } else if (process.platform === 'win32') {
      return path.join(assetsPath, 'icon.ico');
    }
    return path.join(assetsPath, 'icon.png');
  }

  private updateTrayMenu() {
    const settings = this.settingsManager.getSettings();
    const isMac = process.platform === 'darwin';
    const modifierKey = isMac ? 'Cmd' : 'Ctrl';

    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Open Converter',
        click: () => this.showConverterWindow(),
      },
      { type: 'separator' },
      {
        label: `Current Layout: ${this.currentLayout}`,
        enabled: false,
      },
      { type: 'separator' },
      {
        label: `Smart Convert (${modifierKey}+Shift+Space)`,
        enabled: this.shortcutsEnabled,
        click: () => this.handleSmartConvert(),
      },
      {
        label: `Convert to English (${modifierKey}+Shift+E)`,
        enabled: this.shortcutsEnabled,
        click: () => this.handleConversion('toEnglish'),
      },
      {
        label: `Convert to Arabic (${modifierKey}+Shift+A)`,
        enabled: this.shortcutsEnabled,
        click: () => this.handleConversion('toArabic'),
      },
      { type: 'separator' },
      {
        label: this.shortcutsEnabled ? 'Disable Shortcuts' : 'Enable Shortcuts',
        type: 'checkbox',
        checked: this.shortcutsEnabled,
        click: () => this.toggleShortcuts(),
      },
      {
        label: 'Settings',
        click: () => this.showSettingsWindow(),
      },
      { type: 'separator' },
      {
        label: 'Quit',
        click: () => {
          app.quit();
        },
      },
    ]);

    this.tray?.setContextMenu(contextMenu);
  }

  private registerShortcuts() {
    const settings = this.settingsManager.getSettings();
    
    try {
      // Smart convert
      const smartConvertRegistered = globalShortcut.register(
        settings.shortcuts.smartConvert,
        () => this.handleSmartConvert()
      );
      
      // Convert to English
      const toEnglishRegistered = globalShortcut.register(
        settings.shortcuts.convertToEnglish,
        () => this.handleConversion('toEnglish')
      );
      
      // Convert to Arabic
      const toArabicRegistered = globalShortcut.register(
        settings.shortcuts.convertToArabic,
        () => this.handleConversion('toArabic')
      );
      
      // Open converter window
      const openConverterRegistered = globalShortcut.register(
        settings.shortcuts.openConverter,
        () => this.showConverterWindow()
      );

      log.info('Global shortcuts registered:', {
        smartConvert: smartConvertRegistered,
        toEnglish: toEnglishRegistered,
        toArabic: toArabicRegistered,
        openConverter: openConverterRegistered,
      });
    } catch (error) {
      log.error('Failed to register shortcuts:', error);
    }
  }

  private startLayoutMonitoring() {
    this.layoutDetector.on('layoutChanged', (layout: LayoutCode) => {
      this.currentLayout = layout;
      log.info('Layout changed to:', layout);
      
      // Update tray tooltip
      this.tray?.setToolTip(`${APP_NAME} - Current Layout: ${layout}`);
      
      // Update tray menu
      this.updateTrayMenu();
      
      // Notify renderer windows
      this.converterWindow?.webContents.send('layout-changed', layout);
    });

    this.layoutDetector.startMonitoring();
  }

  private async handleSmartConvert() {
    if (!this.shortcutsEnabled) return;
    
    log.info('Smart convert triggered, current layout:', this.currentLayout);
    
    try {
      const result = await this.textReplacer.replaceSelectedText('auto', this.currentLayout);
      
      if (result.success && this.settingsManager.getSettings().general.showNotifications) {
        this.showNotification(
          'Conversion Successful',
          `Converted: ${result.from} → ${result.to}`
        );
      } else if (!result.success) {
        this.showNotification('Conversion Failed', result.error || 'Unknown error');
      }
    } catch (error) {
      log.error('Smart convert error:', error);
      this.showNotification('Error', 'Failed to convert text');
    }
  }

  private async handleConversion(mode: 'toEnglish' | 'toArabic') {
    if (!this.shortcutsEnabled) return;
    
    log.info('Manual conversion triggered:', mode);
    
    try {
      const result = await this.textReplacer.replaceSelectedText(mode, this.currentLayout);
      
      if (result.success && this.settingsManager.getSettings().general.showNotifications) {
        this.showNotification(
          'Conversion Successful',
          `Converted to ${mode === 'toEnglish' ? 'English' : 'Arabic'}`
        );
      } else if (!result.success) {
        this.showNotification('Conversion Failed', result.error || 'Unknown error');
      }
    } catch (error) {
      log.error('Conversion error:', error);
      this.showNotification('Error', 'Failed to convert text');
    }
  }

  private toggleShortcuts() {
    this.shortcutsEnabled = !this.shortcutsEnabled;
    log.info('Shortcuts enabled:', this.shortcutsEnabled);
    this.updateTrayMenu();
    
    if (this.shortcutsEnabled) {
      this.showNotification('Switchy', 'Shortcuts enabled');
    } else {
      this.showNotification('Switchy', 'Shortcuts disabled');
    }
  }

  private showNotification(title: string, body: string) {
    const { Notification } = require('electron');
    new Notification({ title, body }).show();
  }

  private showConverterWindow() {
    if (this.converterWindow) {
      this.converterWindow.show();
      this.converterWindow.focus();
      return;
    }

    const isDev = !app.isPackaged;
    
    this.converterWindow = new BrowserWindow({
      width: 400,
      height: 550,
      resizable: false,
      frame: false,
      transparent: true,
      alwaysOnTop: true,
      skipTaskbar: true,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, '../preload/preload.js'),
      },
    });

    // Load converter HTML
    if (isDev) {
      this.converterWindow.loadURL('http://localhost:5173/converter/');
      // Open DevTools in development
      this.converterWindow.webContents.openDevTools();
    } else {
      this.converterWindow.loadFile(path.join(__dirname, '../renderer/converter/index.html'));
    }

    // Handle window close
    this.converterWindow.on('closed', () => {
      this.converterWindow = null;
    });

    // Hide instead of close on blur (optional)
    this.converterWindow.on('blur', () => {
      // Uncomment to auto-hide when focus lost
      // this.converterWindow?.hide();
    });

    log.info('Converter window created');
  }

  private showSettingsWindow() {
    if (this.settingsWindow) {
      this.settingsWindow.show();
      this.settingsWindow.focus();
      return;
    }

    // Create settings window (will be implemented in next task)
    log.info('Settings window creation - to be implemented');
  }

  private cleanup() {
    log.info('Cleaning up...');
    
    // Unregister all shortcuts
    globalShortcut.unregisterAll();
    
    // Stop layout monitoring
    this.layoutDetector.stopMonitoring();
    
    // Close windows
    this.converterWindow?.close();
    this.settingsWindow?.close();
  }

  // Public methods for IPC handlers
  public getLayoutDetector() { return this.layoutDetector; }
  public getConversionEngine() { return this.conversionEngine; }
  public getSettingsManager() { return this.settingsManager; }
  public getCurrentLayout() { return this.currentLayout; }
}

// Start the app
new SwitchyApp();

import Store from 'electron-store';
import type { AppSettings } from '../../shared/types';
import { DEFAULT_SETTINGS } from '../../shared/types';

export class SettingsManager {
  private store: Store<AppSettings>;

  constructor() {
    this.store = new Store<AppSettings>({
      defaults: DEFAULT_SETTINGS,
      name: 'switchy-settings',
    });
  }

  getSettings(): AppSettings {
    return this.store.store;
  }

  updateSettings(updates: Partial<AppSettings>): void {
    this.store.store = {
      ...this.store.store,
      ...updates,
    };
  }

  resetToDefaults(): void {
    this.store.clear();
    this.store.store = DEFAULT_SETTINGS;
  }

  getSetting<K extends keyof AppSettings>(key: K): AppSettings[K] {
    return this.store.get(key);
  }

  setSetting<K extends keyof AppSettings>(key: K, value: AppSettings[K]): void {
    this.store.set(key, value);
  }
}

/**
 * User preferences persistence utility
 * 
 * This utility addresses the configuration persistence issue where user settings
 * were only stored in memory (component state) but not persisted to storage.
 * Similar to ConfigSystem.storeConfigurable() mentioned in the problem statement.
 */

export interface LessonFormPreferences {
  replicaId: string;
  personaId: string;
}

const PREFERENCES_KEY = 'appwrite-tavus-preferences';

export class PreferencesManager {
  private static getStoredPreferences(): Partial<LessonFormPreferences> {
    try {
      const stored = localStorage.getItem(PREFERENCES_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.warn('Failed to load preferences from localStorage:', error);
      return {};
    }
  }

  private static storePreferences(preferences: Partial<LessonFormPreferences>): void {
    try {
      const current = this.getStoredPreferences();
      const updated = { ...current, ...preferences };
      localStorage.setItem(PREFERENCES_KEY, JSON.stringify(updated));
    } catch (error) {
      console.warn('Failed to store preferences to localStorage:', error);
    }
  }

  /**
   * Get the user's preferred replica ID, with fallback to default
   */
  static getReplicaId(defaultValue: string = 'r79e1c033f'): string {
    const prefs = this.getStoredPreferences();
    return prefs.replicaId || defaultValue;
  }

  /**
   * Get the user's preferred persona ID, with fallback to default
   */
  static getPersonaId(defaultValue: string = ''): string {
    const prefs = this.getStoredPreferences();
    return prefs.personaId || defaultValue;
  }

  /**
   * Store the user's replica preference
   * This is the equivalent of ConfigSystem.storeConfigurable() for replica settings
   */
  static setReplicaId(replicaId: string): void {
    this.storePreferences({ replicaId });
  }

  /**
   * Store the user's persona preference
   * This is the equivalent of ConfigSystem.storeConfigurable() for persona settings
   */
  static setPersonaId(personaId: string): void {
    this.storePreferences({ personaId });
  }

  /**
   * Store all lesson form preferences at once
   * This is equivalent to ConfigSystem.saveAll() for lesson form settings
   */
  static setLessonFormPreferences(preferences: LessonFormPreferences): void {
    this.storePreferences(preferences);
  }
}
import { describe, it, expect, beforeEach } from 'vitest';
import { PreferencesManager } from '../../src/utils/preferences';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem(key: string) {
      return store[key] || null;
    },
    setItem(key: string, value: string) {
      store[key] = value.toString();
    },
    removeItem(key: string) {
      delete store[key];
    },
    clear() {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('PreferencesManager', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should return default values when no preferences are stored', () => {
    expect(PreferencesManager.getReplicaId()).toBe('r79e1c033f');
    expect(PreferencesManager.getPersonaId()).toBe('');
  });

  it('should return custom default values when provided', () => {
    expect(PreferencesManager.getReplicaId('custom-replica')).toBe('custom-replica');
    expect(PreferencesManager.getPersonaId('custom-persona')).toBe('custom-persona');
  });

  it('should store and retrieve replica preference', () => {
    const testReplicaId = 'test-replica-123';
    PreferencesManager.setReplicaId(testReplicaId);
    expect(PreferencesManager.getReplicaId()).toBe(testReplicaId);
  });

  it('should store and retrieve persona preference', () => {
    const testPersonaId = 'test-persona-456';
    PreferencesManager.setPersonaId(testPersonaId);
    expect(PreferencesManager.getPersonaId()).toBe(testPersonaId);
  });

  it('should persist preferences across multiple operations', () => {
    // Set both preferences
    PreferencesManager.setReplicaId('replica-1');
    PreferencesManager.setPersonaId('persona-1');
    
    // Verify both are stored correctly
    expect(PreferencesManager.getReplicaId()).toBe('replica-1');
    expect(PreferencesManager.getPersonaId()).toBe('persona-1');
    
    // Update one preference
    PreferencesManager.setReplicaId('replica-2');
    
    // Verify the updated one changed but the other persisted
    expect(PreferencesManager.getReplicaId()).toBe('replica-2');
    expect(PreferencesManager.getPersonaId()).toBe('persona-1');
  });

  it('should handle malformed localStorage data gracefully', () => {
    // Simulate corrupted localStorage data
    localStorage.setItem('appwrite-tavus-preferences', 'invalid-json');
    
    // Should return defaults without throwing
    expect(PreferencesManager.getReplicaId()).toBe('r79e1c033f');
    expect(PreferencesManager.getPersonaId()).toBe('');
    
    // Should still be able to store new preferences
    PreferencesManager.setReplicaId('new-replica');
    expect(PreferencesManager.getReplicaId()).toBe('new-replica');
  });

  it('should batch store lesson form preferences', () => {
    const preferences = {
      replicaId: 'batch-replica',
      personaId: 'batch-persona'
    };
    
    PreferencesManager.setLessonFormPreferences(preferences);
    
    expect(PreferencesManager.getReplicaId()).toBe('batch-replica');
    expect(PreferencesManager.getPersonaId()).toBe('batch-persona');
  });
});
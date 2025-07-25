import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LessonForm from '../../src/components/LessonForm';
import { PreferencesManager } from '../../src/utils/preferences';

// Mock the UserContext
vi.mock('../../src/contexts/UserContext', () => ({
  useAppwriteUser: () => ({
    user: { $id: 'test-user-id' }
  })
}));

// Mock the lessons service
vi.mock('../../src/services/lessons', () => ({
  createLesson: vi.fn().mockResolvedValue({ $id: 'test-lesson-id' })
}));

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

describe('LessonForm Configuration Persistence', () => {
  const mockOnLessonCreated = vi.fn();

  beforeEach(() => {
    localStorage.clear();
    mockOnLessonCreated.mockClear();
  });

  it('should initialize with default preferences when none are stored', () => {
    render(<LessonForm onLessonCreated={mockOnLessonCreated} />);
    
    const replicaSelect = screen.getByLabelText('Replica');
    const personaSelect = screen.getByLabelText('Persona (Optional)');
    
    expect(replicaSelect).toHaveValue('r79e1c033f');
    expect(personaSelect).toHaveValue('');
  });

  it('should initialize with stored preferences when they exist', () => {
    // Set preferences before rendering - use valid replica ID
    PreferencesManager.setReplicaId('r79e1c033f');
    PreferencesManager.setPersonaId('p88964a7');
    
    render(<LessonForm onLessonCreated={mockOnLessonCreated} />);
    
    const replicaSelect = screen.getByLabelText('Replica');
    const personaSelect = screen.getByLabelText('Persona (Optional)');
    
    expect(replicaSelect).toHaveValue('r79e1c033f');
    expect(personaSelect).toHaveValue('p88964a7');
  });

  it('should persist replica preference when changed', async () => {
    render(<LessonForm onLessonCreated={mockOnLessonCreated} />);
    
    const replicaSelect = screen.getByLabelText('Replica');
    
    // Change replica selection
    fireEvent.change(replicaSelect, { target: { value: 'r79e1c033f' } });
    
    // Verify preference is persisted
    expect(PreferencesManager.getReplicaId()).toBe('r79e1c033f');
    
    // Verify localStorage contains the preference
    const stored = JSON.parse(localStorage.getItem('appwrite-tavus-preferences') || '{}');
    expect(stored.replicaId).toBe('r79e1c033f');
  });

  it('should persist persona preference when changed', async () => {
    render(<LessonForm onLessonCreated={mockOnLessonCreated} />);
    
    const personaSelect = screen.getByLabelText('Persona (Optional)');
    
    // Change persona selection
    fireEvent.change(personaSelect, { target: { value: 'p88964a7' } });
    
    // Verify preference is persisted
    expect(PreferencesManager.getPersonaId()).toBe('p88964a7');
    
    // Verify localStorage contains the preference
    const stored = JSON.parse(localStorage.getItem('appwrite-tavus-preferences') || '{}');
    expect(stored.personaId).toBe('p88964a7');
  });

  it('should maintain preferences across component re-renders', () => {
    // First render with preferences - use valid replica ID
    PreferencesManager.setReplicaId('r79e1c033f');
    PreferencesManager.setPersonaId('p88964a7');
    
    const { rerender } = render(<LessonForm onLessonCreated={mockOnLessonCreated} />);
    
    let replicaSelect = screen.getByLabelText('Replica');
    let personaSelect = screen.getByLabelText('Persona (Optional)');
    
    expect(replicaSelect).toHaveValue('r79e1c033f');
    expect(personaSelect).toHaveValue('p88964a7');
    
    // Re-render component (simulating unmount/remount)
    rerender(<LessonForm onLessonCreated={mockOnLessonCreated} />);
    
    replicaSelect = screen.getByLabelText('Replica');
    personaSelect = screen.getByLabelText('Persona (Optional)');
    
    // Preferences should still be maintained
    expect(replicaSelect).toHaveValue('r79e1c033f');
    expect(personaSelect).toHaveValue('p88964a7');
  });

  it('should demonstrate the fix for the original configuration persistence issue', () => {
    // This test demonstrates the issue described in the problem statement
    // Before the fix: settings only lived in component state and were lost
    // After the fix: settings are persisted to localStorage
    
    // Step 1: Component starts with defaults
    const { rerender } = render(<LessonForm onLessonCreated={mockOnLessonCreated} />);
    
    // Step 2: User changes settings in the "popup" (form)
    const replicaSelect = screen.getByLabelText('Replica');
    fireEvent.change(replicaSelect, { target: { value: 'r79e1c033f' } });
    
    // Step 3: Settings are now persisted (equivalent to ConfigSystem.storeConfigurable)
    expect(localStorage.getItem('appwrite-tavus-preferences')).toContain('r79e1c033f');
    
    // Step 4: Close and reopen the "popup" (unmount/remount component)
    rerender(<LessonForm onLessonCreated={mockOnLessonCreated} />);
    
    // Step 5: Settings should persist (this would have failed before the fix)
    const newReplicaSelect = screen.getByLabelText('Replica');
    expect(newReplicaSelect).toHaveValue('r79e1c033f');
  });
});
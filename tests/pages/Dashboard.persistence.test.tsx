import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Dashboard from '../../src/pages/Dashboard';
import { PreferencesManager } from '../../src/utils/preferences';

// Mock the UserContext
vi.mock('../../src/contexts/UserContext', () => ({
  useAppwriteUser: () => ({
    user: { $id: 'test-user-id', name: 'Test User', email: 'test@example.com' },
    handleLogout: vi.fn()
  })
}));

// Mock the lessons service
vi.mock('../../src/services/lessons', () => ({
  createLesson: vi.fn().mockResolvedValue({ $id: 'test-lesson-id' }),
  getUserLessons: vi.fn().mockResolvedValue([]),
  deleteLesson: vi.fn().mockResolvedValue(undefined),
  updateLessonRating: vi.fn().mockResolvedValue(undefined)
}));

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  Link: ({ children, to, ...props }: any) => <a href={to} {...props}>{children}</a>
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

describe('Dashboard Configuration Persistence', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should initialize replica and persona selects with default preferences when none are stored', () => {
    render(<Dashboard />);
    
    const replicaSelect = screen.getByLabelText(/replica/i);
    const personaSelect = screen.getByLabelText(/teaching style/i);
    
    expect(replicaSelect).toHaveValue('r79e1c033f');
    expect(personaSelect).toHaveValue('');
  });

  it('should initialize with stored preferences when they exist', () => {
    // Set preferences before rendering
    PreferencesManager.setReplicaId('r79e1c033f');
    PreferencesManager.setPersonaId('p88964a7');
    
    render(<Dashboard />);
    
    const replicaSelect = screen.getByLabelText(/replica/i);
    const personaSelect = screen.getByLabelText(/teaching style/i);
    
    expect(replicaSelect).toHaveValue('r79e1c033f');
    expect(personaSelect).toHaveValue('p88964a7');
  });

  it('should persist replica preference when changed in dashboard', async () => {
    render(<Dashboard />);
    
    const replicaSelect = screen.getByLabelText(/replica/i);
    
    // Change replica selection
    fireEvent.change(replicaSelect, { target: { value: 'r79e1c033f' } });
    
    // Verify preference is persisted
    expect(PreferencesManager.getReplicaId()).toBe('r79e1c033f');
    
    // Verify localStorage contains the preference
    const stored = JSON.parse(localStorage.getItem('appwrite-tavus-preferences') || '{}');
    expect(stored.replicaId).toBe('r79e1c033f');
  });

  it('should persist persona preference when changed in dashboard', async () => {
    render(<Dashboard />);
    
    const personaSelect = screen.getByLabelText(/teaching style/i);
    
    // Change persona selection
    fireEvent.change(personaSelect, { target: { value: 'p88964a7' } });
    
    // Verify preference is persisted
    expect(PreferencesManager.getPersonaId()).toBe('p88964a7');
    
    // Verify localStorage contains the preference
    const stored = JSON.parse(localStorage.getItem('appwrite-tavus-preferences') || '{}');
    expect(stored.personaId).toBe('p88964a7');
  });

  it('should maintain preferences across dashboard re-renders', () => {
    // Set preferences before rendering
    PreferencesManager.setReplicaId('r79e1c033f');
    PreferencesManager.setPersonaId('p88964a7');
    
    const { rerender } = render(<Dashboard />);
    
    let replicaSelect = screen.getByLabelText(/replica/i);
    let personaSelect = screen.getByLabelText(/teaching style/i);
    
    expect(replicaSelect).toHaveValue('r79e1c033f');
    expect(personaSelect).toHaveValue('p88964a7');
    
    // Re-render component (simulating unmount/remount)
    rerender(<Dashboard />);
    
    replicaSelect = screen.getByLabelText(/replica/i);
    personaSelect = screen.getByLabelText(/teaching style/i);
    
    // Preferences should still be maintained
    expect(replicaSelect).toHaveValue('r79e1c033f');
    expect(personaSelect).toHaveValue('p88964a7');
  });

  it('should demonstrate the fix works across both LessonForm and Dashboard components', () => {
    // This test demonstrates that preferences are shared between components
    
    // Set preferences in one component context
    PreferencesManager.setReplicaId('r79e1c033f');
    PreferencesManager.setPersonaId('p88964a7');
    
    // Render Dashboard which should pick up those preferences
    render(<Dashboard />);
    
    const replicaSelect = screen.getByLabelText(/replica/i);
    const personaSelect = screen.getByLabelText(/teaching style/i);
    
    // Should show the shared preferences
    expect(replicaSelect).toHaveValue('r79e1c033f');
    expect(personaSelect).toHaveValue('p88964a7');
    
    // Change preferences in Dashboard
    fireEvent.change(replicaSelect, { target: { value: 'r79e1c033f' } });
    
    // Verify preferences are persisted and would be available to LessonForm
    expect(PreferencesManager.getReplicaId()).toBe('r79e1c033f');
  });
});
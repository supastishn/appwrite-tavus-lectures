import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import LessonForm from '../../src/components/LessonForm'
import { UserProvider } from '../../src/contexts/UserContext'
import { describe, it, expect, vi } from 'vitest'
import type { Models } from 'appwrite'
// Add mock for lessons service
import * as lessonsService from '../../src/services/lessons'

const mockUser: Models.User<Models.Preferences> = {
  $id: 'test-user',
  name: 'Test User',
  registration: Date.now(),
  status: true,
  passwordUpdate: Date.now(),
  email: 'test@example.com',
  emailVerification: true,
  prefs: {}
}

describe('LessonForm', () => {
  it('submits lesson creation', async () => {
    const mockSubmit = vi.fn()
    // Mock createLesson to resolve properly
    vi.spyOn(lessonsService, 'createLesson').mockResolvedValue({
      $id: 'test-lesson',
      userId: mockUser.$id,
      topic: 'Test Topic',
      videoUrl: 'https://example.com/video.mp4',
      status: 'pending',
      createdAt: new Date().toISOString()
    })

    render(
      <UserProvider value={{ user: mockUser, loading: false, refetchUser: vi.fn(), handleLogout: vi.fn() }}>
        <LessonForm onLessonCreated={mockSubmit} />
      </UserProvider>
    )
    
    fireEvent.change(screen.getByLabelText('Lesson Topic'), {
      target: { value: 'Test Topic' }
    });
    
    fireEvent.click(screen.getByText('Create Lesson'));

    // Verify creating state
    expect(screen.getByText('Creating...')).toBeInTheDocument();
    
    await waitFor(() => {
        // Verify lesson topic is cleared after creation
        expect(screen.getByLabelText('Lesson Topic')).toHaveValue('');
        expect(mockSubmit).toHaveBeenCalled();
    });

    // Verify UI returns to normal state after creation
    // expect(screen.getByText('Create Lesson')).toBeInTheDocument();
  })
})
